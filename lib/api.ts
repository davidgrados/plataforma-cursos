// ============================================================
//  Cliente HTTP para consumir la API desde el navegador.
//  Usa rutas relativas a /api (mismo origen en Cloudflare Pages).
//  Para desarrollo local apunta a NEXT_PUBLIC_API_BASE.
// ============================================================

import type { Course, CourseDetail, Lesson, Module, TerminalResponse } from './types';

const BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
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

  // ----- Admin -----
  admin: {
    listCourses: (clerkId?: string) =>
      request<Course[]>('/admin/courses', { headers: clerkHeaders(clerkId) }),
    createCourse: (payload: Partial<Course>, clerkId?: string) =>
      request<Course>('/admin/courses', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: clerkHeaders(clerkId),
      }),
    updateCourse: (id: number, payload: Partial<Course>, clerkId?: string) =>
      request<{ ok: boolean }>(`/admin/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: clerkHeaders(clerkId),
      }),
    deleteCourse: (id: number, clerkId?: string) =>
      request<{ ok: boolean }>(`/admin/courses/${id}`, {
        method: 'DELETE',
        headers: clerkHeaders(clerkId),
      }),

    listLessons: (clerkId?: string, moduleId?: number) =>
      request<Lesson[]>(
        `/admin/lessons${moduleId ? `?module_id=${moduleId}` : ''}`,
        { headers: clerkHeaders(clerkId) },
      ),
    createModule: (payload: Partial<Module>, clerkId?: string) =>
      request<Module>('/admin/modules', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: clerkHeaders(clerkId),
      }),
    updateModule: (id: number, payload: Partial<Module>, clerkId?: string) =>
      request<{ ok: boolean }>(`/admin/modules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: clerkHeaders(clerkId),
      }),
    deleteModule: (id: number, clerkId?: string) =>
      request<{ ok: boolean }>(`/admin/modules/${id}`, {
        method: 'DELETE',
        headers: clerkHeaders(clerkId),
      }),
    upsertLesson: (payload: Partial<Lesson>, clerkId?: string) =>
      request<Lesson>('/admin/lessons', {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: clerkHeaders(clerkId),
      }),
    deleteLesson: (id: number, clerkId?: string) =>
      request<{ ok: boolean }>(`/admin/lessons/${id}`, {
        method: 'DELETE',
        headers: clerkHeaders(clerkId),
      }),
    uploadImage: (file: File, clerkId?: string): Promise<{ url: string }> => {
      const fd = new FormData();
      fd.append('file', file);
      return fetch(`${BASE}/admin/upload`, {
        method: 'POST',
        body: fd,
        headers: clerkId ? { 'x-clerk-user-id': clerkId } : undefined,
      }).then(async (res) => {
        if (!res.ok) {
          const err: any = await res.json().catch(() => ({}));
          throw new Error(err?.error || `Error ${res.status}`);
        }
        return res.json();
      });
    },
  },
};
