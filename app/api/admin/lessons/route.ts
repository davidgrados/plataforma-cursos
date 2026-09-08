import { error, getEnv, json, readJson, requireAdmin } from '@/lib/cloudflare';

const LESSON_TYPES = ['chapter', 'practice', 'exam'];

// GET /api/admin/lessons?module_id=N -> lista lecciones (filtro opcional por mÃ³dulo)
export async function GET(request: Request) {
  const env = await getEnv();
  const auth = await requireAdmin(env, request);
  if (auth.response) return auth.response;

  const url = new URL(request.url);
  const moduleId = url.searchParams.get('module_id');

  let sql = 'SELECT * FROM lessons';
  const binds: unknown[] = [];
  if (moduleId) {
    sql += ' WHERE module_id = ?';
    binds.push(Number(moduleId));
  }
  sql += ' ORDER BY module_id ASC, order_num ASC';

  const stmt = env.DB.prepare(sql);
  const { results } = binds.length ? await stmt.bind(...binds).all() : await stmt.all();
  return json(results);
}

// PUT /api/admin/lessons -> crea o actualiza una lecciÃ³n.
export async function PUT(request: Request) {
  const env = await getEnv();
  const auth = await requireAdmin(env, request);
  if (auth.response) return auth.response;

  const body = await readJson(request);
  const { id, slug, module_id, title, type, content_md, initial_fs, check_logic, order_num } = body;

  if (!module_id || !title || !type) {
    return error('Los campos module_id, title y type son obligatorios', 422);
  }
  if (!LESSON_TYPES.includes(type)) {
    return error(`El tipo debe ser uno de: ${LESSON_TYPES.join(', ')}`, 422);
  }

  // ValidaciÃ³n del JSON de initial_fs antes de guardar.
  try {
    JSON.parse(initial_fs);
  } catch {
    return error('El campo initial_fs no es un JSON vÃ¡lido', 422);
  }

  const finalSlug =
    slug ||
    `${module_id}-${String(title)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}-${Date.now()}`;

  try {
    if (id) {
      await env.DB.prepare(
        `UPDATE lessons SET
          slug = ?, module_id = ?, title = ?, type = ?,
          content_md = ?, initial_fs = ?, check_logic = ?, order_num = ?
         WHERE id = ?`,
      )
        .bind(
          finalSlug,
          Number(module_id),
          title,
          type,
          content_md || '',
          initial_fs,
          check_logic || null,
          order_num ?? 0,
          Number(id),
        )
        .run();
      return json({ id: Number(id), slug: finalSlug, ok: true });
    }

    const res = await env.DB.prepare(
      `INSERT INTO lessons (slug, module_id, title, type, content_md, initial_fs, check_logic, order_num)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        finalSlug,
        Number(module_id),
        title,
        type,
        content_md || '',
        initial_fs,
        check_logic || null,
        order_num ?? 0,
      )
      .run();

    return json({ id: res.meta.last_row_id, slug: finalSlug, ok: true }, 201);
  } catch (e) {
    return error(`No se pudo guardar la lecciÃ³n: ${(e as Error).message}`, 409);
  }
}
