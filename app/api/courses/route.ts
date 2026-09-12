import { getEnv, json } from '@/lib/cloudflare';

// GET /api/courses -> lista de cursos disponibles
// Los cursos aún en preparación (sin módulos) se muestran al final.
export async function GET() {
  const env = await getEnv();
  const { results } = await env.DB.prepare(
    `SELECT c.*,
            (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) AS module_count
     FROM courses c
     ORDER BY (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) = 0 ASC,
              c.created_at DESC`,
  ).all();
  return json(results);
}
