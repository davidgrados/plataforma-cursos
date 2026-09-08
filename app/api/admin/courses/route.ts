import { error, getEnv, json, readJson, requireAdmin } from '@/lib/cloudflare';

// GET /api/admin/courses -> lista todos los cursos
export async function GET(request: Request) {
  const env = await getEnv();
  const auth = await requireAdmin(env, request);
  if (auth.response) return auth.response;

  const { results } = await env.DB.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
  return json(results);
}

// POST /api/admin/courses -> crea un curso { slug, title, description?, image_url? }
export async function POST(request: Request) {
  const env = await getEnv();
  const auth = await requireAdmin(env, request);
  if (auth.response) return auth.response;

  const { slug, title, description, image_url } = await readJson(request);
  if (!slug || !title) return error('Los campos slug y title son obligatorios', 422);

  try {
    const res = await env.DB.prepare(
      'INSERT INTO courses (slug, title, description, image_url) VALUES (?, ?, ?, ?)',
    )
      .bind(String(slug), title, description || '', image_url || null)
      .run();

    return json(
      {
        id: res.meta.last_row_id,
        slug: String(slug),
        title,
        description: description || '',
        image_url: image_url || null,
      },
      201,
    );
  } catch (e) {
    return error(`No se pudo crear el curso (Â¿el slug ya existe?): ${(e as Error).message}`, 409);
  }
}
