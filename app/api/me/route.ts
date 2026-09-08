import { error, getClerkId, getEnv, json } from '@/lib/cloudflare';
import { ensureUser } from '@/lib/d1';

// GET /api/me -> devuelve el rol y datos del usuario autenticado
export async function GET(request: Request) {
  const env = await getEnv();
  const clerkId = getClerkId(request);
  if (!clerkId) return error('No autenticado', 401);

  const user = await ensureUser(env, clerkId);
  return json({
    clerk_id: clerkId,
    email: user?.email ?? '',
    name: user?.name ?? '',
    role: user?.role ?? 'student',
  });
}
