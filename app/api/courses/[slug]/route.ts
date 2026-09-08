import { error, getEnv, json } from '@/lib/cloudflare';

// GET /api/courses/:slug -> curso con sus módulos y lecciones
export async function GET(_req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const env = await getEnv();
  const course = await env.DB.prepare('SELECT * FROM courses WHERE slug = ?')
    .bind(slug)
    .first();
  if (!course) return error('Curso no encontrado', 404);

  const modulesRes = await env.DB.prepare(
    'SELECT * FROM modules WHERE course_id = ? ORDER BY order_num ASC',
  )
    .bind(course.id)
    .all();

  const modules = modulesRes.results;
  for (const mod of modules) {
    const lessonsRes = await env.DB.prepare(
      'SELECT * FROM lessons WHERE module_id = ? ORDER BY order_num ASC',
    )
      .bind(mod.id)
      .all();
    mod.lessons = lessonsRes.results;
  }

  return json({ ...course, modules });
}
