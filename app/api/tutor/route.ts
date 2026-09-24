// ============================================================
//  API del tutor de inglés con IA.
//
//  POST /api/tutor
//    - multipart/form-data  -> campo "audio" (voz del estudiante)
//    - application/json     -> { text } (respuesta escrita)
//    Opcionales: modulo, ejemplo, turno
//
//  1) Transcribe la voz con Whisper (Workers AI)
//  2) Responde como asistente con un LLM (Workers AI)
//
//  El audio NO se guarda: se procesa y se descarta.
// ============================================================

import { error, getClientIp, getEnv, json, readJson, type Env } from '@/lib/cloudflare';

const MODELOS_VOZ = ['@cf/openai/whisper-large-v3-turbo', '@cf/openai/whisper'];
// Varios modelos en orden: si uno se deprecia o falla, se prueba el siguiente.
// El 8B fp8 cuesta casi lo mismo que el 3B pero responde mucho mejor.
const MODELOS_CHAT = [
  '@cf/meta/llama-3.1-8b-instruct-fp8',
  '@cf/meta/llama-3.2-3b-instruct',
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
];

/** Convierte bytes a base64 (en trozos, para no desbordar la pila). */
function aBase64(bytes: Uint8Array): string {
  let binario = '';
  const trozo = 0x2000;
  for (let i = 0; i < bytes.length; i += trozo) {
    binario += String.fromCharCode(...Array.from(bytes.subarray(i, i + trozo)));
  }
  return btoa(binario);
}

/** Personalidad de Colliq. */
function personalidad(modulo: string, ejemplo: string, turno: string): string {
  return [
    'Eres "Colliq", el asistente de inglés para estudiantes peruanos de secundaria. Nivel A1-A2.',
    '',
    'FORMATO OBLIGATORIO de cada respuesta (máximo 3 líneas):',
    '1) Una frase corta en INGLÉS (felicitar o corregir).',
    '2) Entre paréntesis, una ayuda breve en ESPAÑOL (máximo 12 palabras).',
    '3) Una pregunta corta en INGLÉS para continuar la conversación.',
    '',
    'EJEMPLO EXACTO de cómo debes responder:',
    'Great job! (¡Muy bien!)',
    'Now repeat: I am fifteen years old. (Ahora repite: tengo quince años.)',
    'How old is your brother?',
    '',
    'REGLAS ESTRICTAS:',
    '- NUNCA mezcles los dos idiomas en la misma frase.',
    '- Si el estudiante comete un error, escribe la forma correcta después de "Try:".',
    '- Si la frase es CORRECTA, NO uses "Try:" ni la repitas: solo felicítalo y haz una pregunta nueva.',
    '- Cuida la ortografía del inglés (football, colour, favourite).',
    '- Máximo 45 palabras en total. Sin listas, sin explicaciones largas.',
    '- Nunca digas tu nombre ni te presentes. No seas repetitiva.',
    '- NUNCA preguntes algo que el estudiante ya respondió en su frase.',
    '- NUNCA repitas una pregunta que ya hiciste antes en la conversación.',
    '- Tus preguntas deben ser sencillas y sobre él mismo (edad, gustos, familia, rutina, ciudad), nunca sobre otras personas.',
    '- Tienes memoria de la conversación: aprovecha lo que ya te contó para conversar con naturalidad.',
    modulo ? `Módulo que practica: "${modulo}".` : '',
    ejemplo ? `Frase objetivo de este turno: "${ejemplo}".` : '',
    turno ? `Turno ${turno} de la práctica.` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/** Límites anti-abuso (protegen el consumo de Workers AI). */
const LIMITE_POR_IP = 200; // peticiones por IP y día
const LIMITE_GLOBAL = 2500; // peticiones totales por día (cortafuegos)

/** Comprueba que la petición venga de nuestra propia web. */
function origenPermitido(request: Request): boolean {
  const origen = request.headers.get('origin') || request.headers.get('referer') || '';
  if (!origen) return true; // peticiones sin origen (curl, apps): las controla el límite por IP
  return (
    origen.includes('educatecomas.com') ||
    origen.includes('localhost') ||
    origen.includes('127.0.0.1')
  );
}

/**
 * Control de uso diario. Devuelve un mensaje de error si se pasa del límite.
 * Si algo falla al consultar, deja pasar (nunca rompe la práctica).
 */
async function comprobarLimite(env: Env, request: Request): Promise<string | null> {
  const ip = getClientIp(request);
  const dia = new Date().toISOString().slice(0, 10);
  try {
    const fila = await env.DB.prepare('SELECT n FROM ai_usage WHERE ip = ? AND day = ?')
      .bind(ip, dia)
      .first();
    if (Number(fila?.n ?? 0) >= LIMITE_POR_IP) {
      return 'Has practicado muchísimo hoy 🙂 Vuelve mañana y seguimos con la conversación.';
    }
    const total = await env.DB.prepare('SELECT SUM(n) AS t FROM ai_usage WHERE day = ?')
      .bind(dia)
      .first();
    if (Number(total?.t ?? 0) >= LIMITE_GLOBAL) {
      return 'Colliq está muy solicitado hoy. Inténtalo de nuevo mañana, por favor. 🙏';
    }
    await env.DB.prepare(
      'INSERT INTO ai_usage (ip, day, n) VALUES (?, ?, 1) ON CONFLICT(ip, day) DO UPDATE SET n = n + 1',
    )
      .bind(ip, dia)
      .run();
  } catch {
    return null; // sin control disponible: no bloqueamos al estudiante
  }
  return null;
}

export async function POST(request: Request) {
  const env = await getEnv();
  if (!env.AI) {
    return error('La IA no está disponible en este momento. Inténtalo más tarde.', 503);
  }

  if (!origenPermitido(request)) {
    return error('Origen no permitido.', 403);
  }

  const limite = await comprobarLimite(env, request);
  if (limite) return error(limite, 429);

  const tipo = request.headers.get('content-type') ?? '';
  let texto = '';
  let audioBase64 = '';
  let modulo = '';
  let ejemplo = '';
  let turno = '';
  let historial: { role: string; content: string }[] = [];

  /** Normaliza el historial que llega del navegador. */
  const leerHistorial = (valor: unknown): { role: string; content: string }[] => {
    try {
      const lista = typeof valor === 'string' ? JSON.parse(valor) : valor;
      if (!Array.isArray(lista)) return [];
      return lista
        .slice(-6)
        .map((m: any) => ({
          role: m?.role === 'assistant' ? 'assistant' : 'user',
          content: String(m?.content ?? '').slice(0, 200),
        }))
        .filter((m) => m.content.length > 0);
    } catch {
      return [];
    }
  };

  try {
    if (tipo.includes('multipart/form-data')) {
      const form = await request.formData();
      modulo = String(form.get('modulo') ?? '');
      ejemplo = String(form.get('ejemplo') ?? '');
      turno = String(form.get('turno') ?? '');
      historial = leerHistorial(form.get('historial'));
      const audio = form.get('audio');
      if (audio && typeof audio !== 'string') {
        const bytes = new Uint8Array(await (audio as File).arrayBuffer());
        if (bytes.length > 3_000_000) return error('El audio es demasiado largo. Habla frases cortas.', 413);
        audioBase64 = aBase64(bytes);
      }
    } else {
      const body = await readJson(request);
      texto = String(body.text ?? '').slice(0, 400);
      modulo = String(body.modulo ?? '');
      ejemplo = String(body.ejemplo ?? '');
      turno = String(body.turno ?? '');
      historial = leerHistorial(body.historial);
    }
  } catch {
    return error('No pude leer lo que enviaste.', 400);
  }

  // ---- 1. Voz -> texto ----
  let transcripcion = texto;
  if (!transcripcion && audioBase64) {
    let ultimoError = '';
    for (const modelo of MODELOS_VOZ) {
      try {
        const stt: any = await env.AI.run(modelo, { audio: audioBase64 });
        transcripcion = String(stt?.text ?? '').trim();
        if (transcripcion) break;
      } catch (e: any) {
        ultimoError = e?.message ?? 'error';
      }
    }
    if (!transcripcion && ultimoError) {
      return error(`No pude entender el audio (${ultimoError}). Prueba otra vez.`, 502);
    }
  }

  if (!transcripcion) {
    return json({
      transcript: '',
      reply: "I didn't hear you. Can you say it again, please? (No te escuché, ¿lo repites?)",
    });
  }

  // ---- 2. Texto -> respuesta de Colliq ----
  let respuesta = '';
  let ultimoError = '';
  for (const modelo of MODELOS_CHAT) {
    try {
      const chat: any = await env.AI.run(modelo, {
        messages: [
          { role: 'system', content: personalidad(modulo, ejemplo, turno) },
          ...historial,
          { role: 'user', content: transcripcion },
        ],
        max_tokens: 180,
        temperature: 0.5,
      });
      respuesta = String(chat?.response ?? '').trim();
      if (respuesta) break;
    } catch (e: any) {
      ultimoError = e?.message ?? 'error';
    }
  }

  if (!respuesta) {
    return error(`Colliq no pudo responder (${ultimoError}). Inténtalo otra vez.`, 502);
  }
  return json({ transcript: transcripcion, reply: respuesta });
}
