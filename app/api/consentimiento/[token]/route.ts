// ============================================================
//  Verificación del consentimiento parental (página pública del tutor).
//
//  GET  /api/consentimiento/[token]  -> datos de la solicitud a revisar
//  POST /api/consentimiento/[token]  -> { decision: 'aprobar' | 'rechazar' }
// ============================================================

import { error, getClientIp, getEnv, json, readJson, type Env } from '@/lib/cloudflare';

async function auditar(env: Env, clerkId: string, accion: string, detalle: string, ip: string) {
  try {
    await env.DB.prepare('INSERT INTO audit_log (clerk_id, accion, detalle, ip) VALUES (?, ?, ?, ?)')
      .bind(clerkId, accion, detalle, ip)
      .run();
  } catch {
    /* nunca rompe la acción principal */
  }
}

async function buscar(env: Env, token: string) {
  if (!token || token.length < 20) return null;
  return env.DB.prepare('SELECT * FROM parental_consents WHERE token = ?').bind(token).first();
}

export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const env = await getEnv();
  const solicitud = await buscar(env, token);
  if (!solicitud) return error('Este enlace no es válido o ya expiró.', 404);

  return json({
    menor_nombre: solicitud.menor_nombre ?? 'El/la estudiante',
    menor_edad: solicitud.menor_edad,
    tutor_nombre: solicitud.tutor_nombre,
    tutor_email: solicitud.tutor_email,
    parentesco: solicitud.parentesco,
    estado: solicitud.estado,
    creado_en: solicitud.creado_en,
    verificado_en: solicitud.verificado_en,
  });
}

export async function POST(request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const env = await getEnv();
  const ip = getClientIp(request);
  const solicitud = await buscar(env, token);
  if (!solicitud) return error('Este enlace no es válido o ya expiró.', 404);

  if (solicitud.estado !== 'pendiente') {
    return error(
      solicitud.estado === 'aprobado'
        ? 'Esta autorización ya fue otorgada.'
        : 'Esta solicitud ya fue rechazada.',
      409,
    );
  }

  const body = await readJson(request);
  const decision = body.decision === 'aprobar' ? 'aprobado' : body.decision === 'rechazar' ? 'rechazado' : null;
  if (!decision) return error("Indica si autorizas o rechazas ('aprobar' o 'rechazar').");

  const agente = (request.headers.get('user-agent') ?? '').slice(0, 200);

  await env.DB.prepare(
    'UPDATE parental_consents SET estado = ?, verificado_en = CURRENT_TIMESTAMP, verificado_ip = ?, verificado_agente = ? WHERE token = ?',
  )
    .bind(decision, ip, agente, token)
    .run();

  await env.DB.prepare('UPDATE users SET consentimiento = ? WHERE clerk_id = ?')
    .bind(decision, solicitud.clerk_id)
    .run();

  await auditar(env, String(solicitud.clerk_id), `consentimiento_${decision}`, `token=${token.slice(0, 8)}…`, ip);

  return json({
    ok: true,
    estado: decision,
    mensaje:
      decision === 'aprobado'
        ? '¡Gracias! Tu autorización quedó registrada. El estudiante ya puede usar la plataforma.'
        : 'Se registró tu decisión. La cuenta del menor no podrá usar la plataforma.',
  });
}
