// ============================================================
//  Cliente HTTP para consumir la API desde el navegador.
//  Usa rutas relativas a /api (mismo origen en Cloudflare Pages).
//  Para desarrollo local apunta a NEXT_PUBLIC_API_BASE.
//
//  SEGURIDAD: cada petición viaja con el token de sesión de Clerk
//  (Authorization: Bearer ...), que el servidor verifica.
// ============================================================

import type { Course, CourseDetail, Lesson, Module, TerminalResponse } from './types';
import { getAuthToken } from './auth-context';

const BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

/** Cabeceras de autenticación (token de sesión verificado en el servidor). */
async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(await authHeaders()),
    ...(options.headers as Record<string, string> | undefined),
  };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const data: any = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Identificador de usuario (solo para el modo vista previa local). */
function clerkHeaders(clerkId?: string) {
  return clerkId ? ({ 'x-clerk-user-id': clerkId } as Record<string, string>) : undefined;
}

export const api = {
  // ----- Público -----
  me: (clerkId?: string) =>
    request<{ clerk_id: string; email?: string; name?: string; role: string }>('/me', {
      headers: clerkHeaders(clerkId),
    }),
  courses: () => request<Course[]>('/courses'),
  course: (slug: string) => request<CourseDetail>(`/courses/${slug}`),
  lesson: (id: number | string) => request<Lesson>(`/lessons/${id}`),

  // ----- Terminal -----
  terminalSession: (lessonId: number, clerkId?: string) =>
    request<{ current_path: string }>(`/terminal?lesson_id=${lessonId}`, {
      headers: clerkHeaders(clerkId),
    }),
  terminal: (
    body: { lesson_id: number; command?: string; action?: 'exec' | 'verify' | 'reset' },
    clerkId?: string,
  ) =>
    request<TerminalResponse>('/terminal', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: clerkHeaders(clerkId),
    }),

  // ----- Protección de datos (Ley 29733): edad y consentimiento parental -----
  consentimiento: {
    estado: () =>
      request<{
        edad: number | null;
        menor: boolean | null;
        consentimiento: string;
        solicitud: { tutor_nombre: string; tutor_email: string; estado: string; creado_en: string } | null;
      }>('/consentimiento'),
    declararEdad: (edad: number) =>
      request<{ ok: boolean; menor: boolean; consentimiento: string }>('/consentimiento', {
        method: 'POST',
        body: JSON.stringify({ edad }),
      }),
    solicitar: (datos: {
      tutorNombre: string;
      tutorEmail: string;
      tutorDocumento?: string;
      parentesco: string;
      menorNombre?: string;
    }) =>
      request<{
        ok: boolean;
        requiere: boolean;
        enviado: boolean;
        enlace: string;
        mensaje: string;
      }>('/consentimiento', { method: 'POST', body: JSON.stringify(datos) }),
  },

  // ----- Mi cuenta: transparencia y derecho de supresión (Ley 29733) -----
  cuenta: {
    resumen: () =>
      request<{
        email: string;
        name: string;
        creado_en: string | null;
        edad: number | null;
        lecciones_completadas: number;
        practicas_guardadas: number;
        consentimientos: number;
      }>('/cuenta'),
    eliminar: () =>
      request<{ ok: boolean; datos_borrados: boolean; identidad: string; mensaje: string }>(
        '/cuenta',
        { method: 'DELETE', body: JSON.stringify({ confirmar: 'ELIMINAR' }) },
      ),
  },

};
