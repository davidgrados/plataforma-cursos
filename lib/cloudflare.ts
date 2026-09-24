// ============================================================
//  Helpers específicos de Cloudflare para las route handlers.
//
//  Con el adaptador OpenNext (@opennextjs/cloudflare) los bindings
//  (D1/R2/AI) se obtienen con getCloudflareContext({ async: true }).
//
//  SEGURIDAD: la identidad del usuario se obtiene verificando el token
//  de sesión de Clerk (Authorization: Bearer <jwt>) con la clave secreta.
//  Nunca se confía en datos que el navegador envíe por su cuenta.
// ============================================================

import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { D1Binding } from './d1';

export interface Env {
  DB: D1Binding;
  IMAGES?: {
    put: (key: string, value: ArrayBuffer, opts?: { httpMetadata?: { contentType?: string } }) => Promise<unknown>;
  };
  PUBLIC_R2_URL?: string;
  /** Workers AI: transcripción de voz (Whisper) y tutor conversacional (LLM). */
  AI?: {
    run: (model: string, input: Record<string, unknown>) => Promise<any>;
  };
  /** Clave secreta de Clerk (Worker secret). Necesaria para verificar sesiones. */
  CLERK_SECRET_KEY?: string;
  /** Envío de correo (Cloudflare Email Service). Opcional. */
  EMAIL?: {
    send: (mensaje: {
      to: string | { email: string; name?: string } | (string | { email: string; name?: string })[];
      from: string | { email: string; name?: string };
      subject: string;
      html?: string;
      text?: string;
    }) => Promise<any>;
  };
}

/** Devuelve el entorno (bindings) actual del worker. */
export async function getEnv(): Promise<Env> {
  const { env } = await getCloudflareContext({ async: true });
  return env as unknown as Env;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

/** Extrae el token Bearer de la cabecera Authorization. */
function bearerToken(request: Request): string | null {
  const cabecera = request.headers.get('authorization') ?? '';
  const m = cabecera.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

/**
 * Devuelve el clerk_id del usuario autenticado, verificando el token de
 * sesión de Clerk contra la clave secreta (firma + caducidad + emisor).
 *
 * Si el token no es válido o no existe, devuelve null (y las rutas que
 * necesitan usuario responden 401).
 */
export async function getClerkId(request: Request, env?: Env): Promise<string | null> {
  const entorno = env ?? (await getEnv());
  const secretKey = entorno.CLERK_SECRET_KEY;

  // Sin clave secreta configurada (desarrollo local): se mantiene el modo
  // vista previa con el identificador indicado por el cliente.
  if (!secretKey) {
    return request.headers.get('x-clerk-user-id')?.trim() || null;
  }

  const token = bearerToken(request);
  if (!token) return null;

  try {
    const { verifyToken } = await import('@clerk/backend');
    const payload = await verifyToken(token, { secretKey });
    const sub = typeof payload?.sub === 'string' ? payload.sub : null;
    return sub || null;
  } catch {
    // Token caducado, manipulado o de otra aplicación.
    return null;
  }
}

/** Lee y parsea el cuerpo JSON de la petición (devuelve {} si falla). */
export async function readJson(request: Request): Promise<Record<string, any>> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

/** IP del visitante (Cloudflare la añade en cf-connecting-ip). */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'desconocida'
  );
}
