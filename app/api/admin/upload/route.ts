import { error, getEnv, json, requireAdmin } from '@/lib/cloudflare';

// POST /api/admin/upload -> sube una imagen a R2 y devuelve su URL pÃºblica.
// Espera multipart/form-data con el campo `file`.
export async function POST(request: Request) {
  const env = await getEnv();
  const auth = await requireAdmin(env, request);
  if (auth.response) return auth.response;

  if (!env.IMAGES) {
    return error('El bucket R2 (IMAGES) no estÃ¡ configurado', 500);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return error('Se espera multipart/form-data con el campo "file"', 422);
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');

  if (!file || typeof file === 'string') {
    return error('No se recibiÃ³ ningÃºn archivo', 422);
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE) {
    return error('El archivo supera el tamaÃ±o mÃ¡ximo de 5 MB', 413);
  }

  const fileType = file.type || 'application/octet-stream';
  const ext = fileType.split('/')[1]?.split('+')[0] || 'bin';
  const key = `uploads/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const buffer = await file.arrayBuffer();
  await env.IMAGES.put(key, buffer, { httpMetadata: { contentType: fileType } });

  const base = env.PUBLIC_R2_URL || 'https://pub-REPLACE_WITH_HASH.r2.dev';
  return json({ url: `${base.replace(/\/$/, '')}/${key}` }, 201);
}
