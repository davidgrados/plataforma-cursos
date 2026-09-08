import { error, getEnv, json, readJson, requireAdmin } from '@/lib/cloudflare';

// POST /api/admin/modules -> crea un mÃ³dulo { course_id, title, order_num }
export async function POST(request: Request) {
  const env = await getEnv();
  const auth = await requireAdmin(env, request);
  if (auth.response) return auth.response;

  const { course_id, title, order_num } = await readJson(request);
  if (!course_id || !title) return error('Los campos course_id y title son obligatorios', 422);

  const res = await env.DB.prepare(
    'INSERT INTO modules (course_id, title, order_num) VALUES (?, ?, ?)',
  )
    .bind(Number(course_id), title, order_num ?? 0)
    .run();

  return json(
    { id: res.meta.last_row_id, course_id: Number(course_id), title, order_num: order_num ?? 0 },
    201,
  );
}
