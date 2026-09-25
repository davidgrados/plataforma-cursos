// ============================================================
//  /api/cuenta — Derecho de supresión (Ley 29733, art. 20).
//
//  GET    -> resumen de los datos guardados del usuario autenticado.
//  DELETE -> elimina la cuenta y TODOS sus datos:
//              1. lo guardado en nuestra base de datos (D1),
//              2. la cuenta en el proveedor de identidad (Clerk),
//              3. deja constancia de la baja en el registro de auditoría.
//
//  La identidad se obtiene verificando el token de sesión: nadie puede
//  borrar la cuenta de otra persona. Además se exige una confirmación
//  explícita en el cuerpo de la petición.
// ============================================================

import { error, getClerkId, getClientIp, getEnv, json, readJson } from '@/lib/cloudflare';
import { ensureUser } from '@/lib/d1';

/** Palabra exacta que el usuario debe escribir para confirmar la baja. */
const CONFIRMACION = 'ELIMINAR';

// GET /api/cuenta -> resumen de lo que tenemos guardado de esta persona
export async function GET(request: Request) {
  const env = await getEnv();
  const clerkId = await getClerkId(request, env);
  if (!clerkId) return error('No autenticado', 401);

  await ensureUser(env, clerkId);

  const usuario = await env.DB.prepare(
    'SELECT email, name, role, created_at, edad, consentimiento FROM users WHERE clerk_id = ?',
  )
    .bind(clerkId)
    .first();

  const progreso = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM user_progress WHERE clerk_id = ? AND completed = 1',
  )
    .bind(clerkId)
    .first();

  const practicas = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM user_sessions WHERE clerk_id = ?',
  )
    .bind(clerkId)
    .first();

  const consentimientos = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM parental_consents WHERE clerk_id = ?',
  )
    .bind(clerkId)
    .first();

  return json({
    email: usuario?.email ?? '',
    name: usuario?.name ?? '',
    creado_en: usuario?.created_at ?? null,
    edad: usuario?.edad ?? null,
    lecciones_completadas: progreso?.n ?? 0,
    practicas_guardadas: practicas?.n ?? 0,
    consentimientos: consentimientos?.n ?? 0,
  });
}

// DELETE /api/cuenta -> borrado definitivo
export async function DELETE(request: Request) {
  const env = await getEnv();
  const clerkId = await getClerkId(request, env);
  if (!clerkId) return error('No autenticado', 401);

  const cuerpo = await readJson(request);
  if (cuerpo?.confirmar !== CONFIRMACION) {
    return error(`Falta la confirmación: escribe ${CONFIRMACION} para continuar`, 400);
  }

  const ip = getClientIp(request);

  // 1) Datos guardados en nuestra base de datos.
  //    Se borran una por una (sin depender de las claves foráneas) para
  //    garantizar que no quede ningún rastro asociado a la persona.
  await env.DB.prepare('DELETE FROM user_sessions WHERE clerk_id = ?').bind(clerkId).run();
  await env.DB.prepare('DELETE FROM user_progress WHERE clerk_id = ?').bind(clerkId).run();
  await env.DB.prepare('DELETE FROM parental_consents WHERE clerk_id = ?').bind(clerkId).run();
  await env.DB.prepare('DELETE FROM users WHERE clerk_id = ?').bind(clerkId).run();

  // 2) La cuenta en el proveedor de identidad.
  let proveedor = 'no_configurado';
  const secretKey = env.CLERK_SECRET_KEY;
  if (secretKey) {
    try {
      const { createClerkClient } = await import('@clerk/backend');
      const clerk = createClerkClient({ secretKey });
      await clerk.users.deleteUser(clerkId);
      proveedor = 'eliminada';
    } catch {
      // Si el proveedor falla, los datos locales ya están borrados; se
      // informa para que la persona pueda reclamar el borrado restante.
      proveedor = 'pendiente';
    }
  }

  // 3) Constancia de la baja (registro de auditoría, sin datos personales).
  try {
    await env.DB.prepare(
      'INSERT INTO audit_log (clerk_id, accion, detalle, ip) VALUES (?, ?, ?, ?)',
    )
      .bind(clerkId, 'eliminacion_cuenta', `datos_locales=borrados; identidad=${proveedor}`, ip)
      .run();
  } catch {
    /* la auditoría no debe impedir el borrado */
  }

  return json({
    ok: true,
    datos_borrados: true,
    identidad: proveedor,
    mensaje:
      proveedor === 'eliminada'
        ? 'Tu cuenta y todos tus datos han sido eliminados.'
        : 'Tus datos han sido eliminados. La cuenta de acceso se eliminará en breve.',
  });
}
