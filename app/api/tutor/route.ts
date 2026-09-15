// ============================================================
//  API del tutor de inglés con IA.
//
//  POST /api/tutor
//    - multipart/form-data  -> campo "audio" (voz del estudiante)
//    - application/json     -> { text } (respuesta escrita)
//    Opcionales: modulo, ejemplo, turno
//
//  1) Transcribe la voz con Whisper (Workers AI)
//  2) Responde como tutora con un LLM (Workers AI)
//
//  El audio NO se guarda: se procesa y se descarta.
// ============================================================

import { error, getEnv, json, readJson } from '@/lib/cloudflare';

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

/** Personalidad de la tutora. */
function personalidad(modulo: string, ejemplo: string, turno: string): string {
  return [
    'Eres "Coti", tutora de inglés para estudiantes peruanos de secundaria. Nivel A1-A2.',
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
    '- Máximo 45 palabras en total. Sin listas, sin explicaciones largas.',
    '- Nunca digas tu nombre ni te presentes. No seas repetitiva.',
    '- NUNCA preguntes algo que el estudiante ya respondió en su frase.',
    '- Tus preguntas deben ser sencillas y sobre él mismo (edad, gustos, familia, rutina, ciudad), nunca sobre otras personas.',
    '- Si la frase está bien, felicítalo y pregunta algo nuevo y sencillo.',
    modulo ? `Módulo que practica: "${modulo}".` : '',
    ejemplo ? `Frase objetivo de este turno: "${ejemplo}".` : '',
    turno ? `Turno ${turno} de la práctica.` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function POST(request: Request) {
  const env = await getEnv();
  if (!env.AI) {
    return error('La IA no está disponible en este momento. Inténtalo más tarde.', 503);
  }

  const tipo = request.headers.get('content-type') ?? '';
  let texto = '';
  let audioBase64 = '';
  let modulo = '';
  let ejemplo = '';
  let turno = '';

  try {
    if (tipo.includes('multipart/form-data')) {
      const form = await request.formData();
      modulo = String(form.get('modulo') ?? '');
      ejemplo = String(form.get('ejemplo') ?? '');
      turno = String(form.get('turno') ?? '');
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

  // ---- 2. Texto -> respuesta de la tutora ----
  let respuesta = '';
  let ultimoError = '';
  for (const modelo of MODELOS_CHAT) {
    try {
      const chat: any = await env.AI.run(modelo, {
        messages: [
          { role: 'system', content: personalidad(modulo, ejemplo, turno) },
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
    return error(`La tutora no pudo responder (${ultimoError}). Inténtalo otra vez.`, 502);
  }
  return json({ transcript: transcripcion, reply: respuesta });
}
