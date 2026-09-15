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
// El primero es el ligero (3B): ~6 veces más barato y suficiente para nivel A1-A2.
const MODELOS_CHAT = [
  '@cf/meta/llama-3.2-3b-instruct',
  '@cf/meta/llama-3.1-8b-instruct-fp8',
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
    'Eres "Coti", una tutora de inglés muy amable, cercana y motivadora que ayuda a estudiantes de secundaria en Comas, Perú.',
    'REGLAS:',
    '1) Responde SIEMPRE primero en inglés muy sencillo (nivel A1-A2, frases cortas y claras).',
    '2) Después, entre paréntesis, añade una traducción o ayuda breve en español (máximo una línea).',
    '3) Corrige con cariño: si hay un error, muestra la forma correcta en inglés y pide que la repita.',
    '4) Si está bien, felicítalo con energia y haz UNA pregunta corta para seguir la conversación.',
    '5) Nunca uses más de 3 frases en total. No des listas ni explicaciones largas.',
    modulo ? `El estudiante practica el módulo: "${modulo}".` : '',
    ejemplo ? `La frase objetivo de este turno es: "${ejemplo}".` : '',
    turno ? `Contexto del turno ${turno}.` : '',
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
