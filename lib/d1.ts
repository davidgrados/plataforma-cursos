// ============================================================
//  Helpers de acceso a D1.
//
//  Se usan desde las route handlers (app/api) de Next.js, que
//  obtienen el binding `DB` con getRequestContext().env.DB
//  (ver lib/cloudflare.ts). Compatible con @cloudflare/next-on-pages.
// ============================================================

import type { Course, Lesson, Module } from './types';

export type D1Result<T = any> = { results: T[] };
// D1 está tipado de forma laxa: las consultas encadenadas (bind/all/first/run)
// devuelven `any`, igual que el binding real de Cloudflare.
export type D1Binding = {
  prepare: (sql: string) => any;
};

/** Obtiene o crea el usuario a partir de su clerk_id. */
export async function ensureUser(env: { DB: D1Binding }, clerkId: string, email = '', name = '') {
  const existing = await env.DB.prepare('SELECT * FROM users WHERE clerk_id = ?')
    .bind(clerkId)
    .first();

  if (!existing) {
    const finalEmail = email && email.trim() ? email.trim() : `${clerkId}@preview.local`;
    await env.DB.prepare(
      'INSERT INTO users (clerk_id, email, name, role) VALUES (?, ?, ?, ?)',
    )
      .bind(clerkId, finalEmail, name, 'student')
      .run();
  }
  return existing;
}

/** Comprueba si un clerk_id tiene rol admin. */
export async function isAdmin(env: { DB: D1Binding }, clerkId: string): Promise<boolean> {
  const user = await env.DB.prepare('SELECT role FROM users WHERE clerk_id = ?')
    .bind(clerkId)
    .first();
  return !!user && user.role === 'admin';
}

/** Devuelve un curso con sus módulos y lecciones. */
export async function getCourseWithContent(
  env: { DB: D1Binding },
  slug: string,
): Promise<(Course & { modules: Module[] }) | null> {
  const course = await env.DB.prepare('SELECT * FROM courses WHERE slug = ?')
    .bind(slug)
    .first();
  if (!course) return null;

  const modulesRes = await env.DB.prepare(
    'SELECT * FROM modules WHERE course_id = ? ORDER BY order_num ASC',
  )
    .bind(course.id)
    .all();

  const modules = modulesRes.results as Module[];
  for (const mod of modules) {
    const lessonsRes = await env.DB.prepare(
      'SELECT * FROM lessons WHERE module_id = ? ORDER BY order_num ASC',
    )
      .bind(mod.id)
      .all();
    mod.lessons = lessonsRes.results as Lesson[];
  }

  return { ...course, modules };
}

/** Guarda (upsert) la sesión de terminal de un usuario en una lección. */
export async function saveSession(
  env: { DB: D1Binding },
  clerkId: string,
  lessonId: number,
  virtualFs: unknown,
  currentPath: string,
) {
  await env.DB.prepare(
    `INSERT INTO user_sessions (clerk_id, lesson_id, current_path, virtual_fs, updated_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(clerk_id, lesson_id) DO UPDATE SET
       current_path = excluded.current_path,
       virtual_fs = excluded.virtual_fs,
       updated_at = CURRENT_TIMESTAMP`,
  )
    .bind(clerkId, lessonId, currentPath, JSON.stringify(virtualFs))
    .run();
}

/** Marca una lección como completada. */
export async function markCompleted(env: { DB: D1Binding }, clerkId: string, lessonId: number) {
  await env.DB.prepare(
    `INSERT INTO user_progress (clerk_id, lesson_id, completed, completed_at)
     VALUES (?, ?, 1, CURRENT_TIMESTAMP)
     ON CONFLICT(clerk_id, lesson_id) DO UPDATE SET
       completed = 1,
       completed_at = CURRENT_TIMESTAMP`,
  )
    .bind(clerkId, lessonId)
    .run();
}
