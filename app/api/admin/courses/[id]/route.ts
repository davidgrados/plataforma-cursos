import { error, getEnv, json, readJson, requireAdmin } from '@/lib/cloudflare';

type Params = { params: Promise<{ id: string }> };

// PUT /api/admin/courses/:id -> actualiza un curso
export async function PUT(request: Request, context: Params) {
  const { id } = await context.params;
  const env = await getEnv();
  const auth = await requireAdmin(env, request);
  if (auth.response) return auth.response;

  const { slug, title, description, image_url } = await readJson(request);
  try {
    await env.DB.prepare(
      'UPDATE courses SET slug = ?, title = ?, description = ?, image_url = ? WHERE id = ?',
    )
      .bind(String(slug), title, description || '', image_url || null, Number(id))
      .run();
    return json({ ok: true });
  } catch (e) {
    return error(`No se pudo actualizar el curso: ${(e as Error).message}`, 409);
  }
}

// DELETE /api/admin/courses/:id -> elimina un curso (cascada)
export async function DELETE(request: Request, context: Params) {
  const { id } = await context.params;
  const env = await getEnv();
  const auth = await requireAdmin(env, request);
  if (auth.response) return auth.response;

  await env.DB.prepare('DELETE FROM courses WHERE id = ?').bind(Number(id)).run();
  return json({ ok: true });
}
