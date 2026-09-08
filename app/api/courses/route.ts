import { getEnv, json } from '@/lib/cloudflare';

// GET /api/courses -> lista de cursos disponibles
export async function GET() {
  const env = await getEnv();
  const { results } = await env.DB.prepare(
    'SELECT * FROM courses ORDER BY created_at DESC',
  ).all();
  return json(results);
}
