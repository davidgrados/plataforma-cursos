import { getEnv, json, readJson, requireAdmin } from '@/lib/cloudflare';

type Params = { params: Promise<{ id: string }> };

// PUT /api/admin/modules/:id -> actualiza módulo (título, orden)
export async function PUT(request: Request, context: Params) {
  const { id } = await context.params;
  const env = await getEnv();
  const auth = await requireAdmin(env, request);
  if (auth.response) return auth.response;

  const { title, order_num } = await readJson(request);
  await env.DB.prepare('UPDATE modules SET title = ?, order_num = ? WHERE id = ?')
    .bind(title, order_num ?? 0, Number(id))
    .run();

  return json({ ok: true });
}

// DELETE /api/admin/modules/:id -> elimina módulo (cascada)
export async function DELETE(request: Request, context: Params) {
  const { id } = await context.params;
  const env = await getEnv();
  const auth = await requireAdmin(env, request);
  if (auth.response) return auth.response;

  await env.DB.prepare('DELETE FROM modules WHERE id = ?').bind(Number(id)).run();
  return json({ ok: true });
}
