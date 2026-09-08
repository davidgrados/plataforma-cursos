import { error, getEnv, json } from '@/lib/cloudflare';

// GET /api/lessons/:id -> datos de una lección + su módulo y curso
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const env = await getEnv();
  const lesson = await env.DB.prepare('SELECT * FROM lessons WHERE id = ?')
    .bind(id)
    .first();
  if (!lesson) return error('Lección no encontrada', 404);

  const module = await env.DB.prepare('SELECT * FROM modules WHERE id = ?')
    .bind(lesson.module_id)
    .first();
  const course = module
    ? await env.DB.prepare('SELECT * FROM courses WHERE id = ?').bind(module.course_id).first()
    : null;

  return json({ ...lesson, module, course });
}
