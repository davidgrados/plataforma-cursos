// ============================================================
//  Helpers específicos de Cloudflare para las route handlers.
//
//  Con el adaptador OpenNext (@opennextjs/cloudflare) los bindings
//  (D1/R2) se obtienen con getCloudflareContext({ async: true }).
// ============================================================

import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { D1Binding } from './d1';

export interface Env {
  DB: D1Binding;
  IMAGES?: {
    put: (key: string, value: ArrayBuffer, opts?: { httpMetadata?: { contentType?: string } }) => Promise<unknown>;
  };
  PUBLIC_R2_URL?: string;
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

/** Lee el clerk_id desde el header `x-clerk-user-id`. */
export function getClerkId(request: Request): string | null {
  return request.headers.get('x-clerk-user-id')?.trim() || null;
}

/** Lee y parsea el cuerpo JSON de la petición (devuelve {} si falla). */
export async function readJson(request: Request): Promise<Record<string, any>> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

/**
 * Comprueba que el usuario autenticado exista y tenga rol admin.
 * Devuelve una Response de error si no está autorizado.
 */
export async function requireAdmin(env: Env, request: Request) {
  const clerkId = getClerkId(request);
  if (!clerkId) return { response: error('No autenticado', 401) };

  const user = await env.DB.prepare('SELECT * FROM users WHERE clerk_id = ?')
    .bind(clerkId)
    .first();
  if (!user || user.role !== 'admin') {
    return { response: error('Acceso denegado: se requiere rol de administrador', 403) };
  }
  return { clerkId };
}
