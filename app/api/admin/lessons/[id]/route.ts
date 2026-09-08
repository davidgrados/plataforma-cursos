import { getEnv, json, requireAdmin } from '@/lib/cloudflare';

// DELETE /api/admin/lessons/:id -> elimina una lección
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const env = await getEnv();
  const auth = await requireAdmin(env, request);
  if (auth.response) return auth.response;

  await env.DB.prepare('DELETE FROM lessons WHERE id = ?').bind(Number(id)).run();
  return json({ ok: true });
}
