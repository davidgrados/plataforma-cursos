// ============================================================
//  Cumplimiento de la Ley N° 29733 (Perú) y su Reglamento:
//  consentimiento verificable del padre/madre/tutor para menores de 14 años.
//
//  GET  /api/consentimiento  -> estado del usuario (edad + consentimiento)
//  POST /api/consentimiento  -> { edad }  o  datos del tutor (crea solicitud)
// ============================================================

import { error, getClerkId, getClientIp, getEnv, json, readJson, type Env } from '@/lib/cloudflare';
import { ensureUser } from '@/lib/d1';

export const EDAD_MINIMA_SIN_TUTOR = 14;

/** Enlace que el tutor debe abrir para autorizar. */
function enlaceVerificacion(request: Request, token: string): string {
  const url = new URL(request.url);
  return `${url.origin}/consentimiento/${token}`;
}

/** Registra una acción sensible para auditoría. */
async function auditar(env: Env, clerkId: string | null, accion: string, detalle: string, ip: string) {
  try {
    await env.DB.prepare(
      'INSERT INTO audit_log (clerk_id, accion, detalle, ip) VALUES (?, ?, ?, ?)',
    )
      .bind(clerkId, accion, detalle, ip)
      .run();
  } catch {
    /* la auditoría nunca debe romper la acción principal */
  }
}

/** Intenta enviar el correo al tutor (si el envío está configurado). */
async function avisarAlTutor(
  env: Env,
  datos: { tutorEmail: string; tutorNombre: string; menorNombre: string; enlace: string },
): Promise<boolean> {
  const email = (env as any).EMAIL;
  if (!email?.send) return false;
  try {
    const texto =
      `Hola ${datos.tutorNombre}:\n\n` +
      `${datos.menorNombre} quiere usar Edúcate Comas (educatecomas.com), una plataforma educativa gratuita.\n` +
      `Como es menor de 14 años, la ley peruana exige tu autorización para tratar sus datos personales ` +
      `(nombre, correo electrónico y progreso de aprendizaje).\n\n` +
      `Para autorizar o rechazar, abre este enlace:\n${datos.enlace}\n\n` +
      `El enlace es personal: solo tú puedes usarlo. Si no autorizas, la cuenta no podrá usar la plataforma.\n\n` +
      `Edúcate Comas · Política de Privacidad: https://educatecomas.com/privacidad`;
    await email.send({
      to: datos.tutorEmail,
      from: { email: 'privacidad@educatecomas.com', name: 'Edúcate Comas' },
      subject: `Autorización para que ${datos.menorNombre} use Edúcate Comas`,
      text: texto,
    });
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const env = await getEnv();
  const clerkId = await getClerkId(request, env);
  if (!clerkId) return error('No autenticado', 401);

  const usuario = await ensureUser(env, clerkId);
  const solicitud = await env.DB.prepare(
    'SELECT id, tutor_nombre, tutor_email, parentesco, estado, creado_en, verificado_en FROM parental_consents WHERE clerk_id = ? ORDER BY id DESC LIMIT 1',
  )
    .bind(clerkId)
    .first();

  const edad = usuario?.edad ?? null;
  return json({
    edad,
    menor: edad !== null ? Number(edad) < EDAD_MINIMA_SIN_TUTOR : null,
    consentimiento: usuario?.consentimiento ?? 'no_requerido',
    solicitud: solicitud ?? null,
  });
}

export async function POST(request: Request) {
  const env = await getEnv();
  const clerkId = await getClerkId(request, env);
  if (!clerkId) return error('No autenticado', 401);
  const ip = getClientIp(request);
  const body = await readJson(request);

  await ensureUser(env, clerkId);

  // --- 1. Declaración de edad ---
  if (body.edad !== undefined) {
    const edad = Number(body.edad);
    if (!Number.isInteger(edad) || edad < 5 || edad > 110) {
      return error('Indica una edad válida.');
    }
    const menor = edad < EDAD_MINIMA_SIN_TUTOR;
    await env.DB.prepare('UPDATE users SET edad = ?, consentimiento = ? WHERE clerk_id = ?')
      .bind(edad, menor ? 'pendiente' : 'no_requerido', clerkId)
      .run();
    await auditar(env, clerkId, 'declaracion_edad', `edad=${edad}`, ip);
    return json({ ok: true, menor, consentimiento: menor ? 'pendiente' : 'no_requerido' });
  }

  // --- 2. Solicitud de consentimiento (datos del tutor) ---
  const tutorNombre = String(body.tutorNombre ?? '').trim().slice(0, 120);
  const tutorEmail = String(body.tutorEmail ?? '').trim().toLowerCase().slice(0, 160);
  const tutorDocumento = String(body.tutorDocumento ?? '').trim().slice(0, 20);
  const parentesco = String(body.parentesco ?? '').trim().slice(0, 40);
  const menorNombre = String(body.menorNombre ?? '').trim().slice(0, 120);

  if (tutorNombre.length < 4) return error('Escribe el nombre completo de tu padre, madre o tutor.');
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(tutorEmail)) {
    return error('Escribe un correo electrónico válido del adulto responsable.');
  }
  if (!parentesco) return error('Indica el parentesco (madre, padre, tutor legal…).');

  const usuario = await env.DB.prepare('SELECT edad FROM users WHERE clerk_id = ?')
    .bind(clerkId)
    .first();
  if (usuario?.edad !== null && usuario?.edad !== undefined && Number(usuario.edad) >= EDAD_MINIMA_SIN_TUTOR) {
    return json({ ok: true, requiere: false, mensaje: 'No necesitas autorización parental.' });
  }

  const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  const enlace = enlaceVerificacion(request, token);

  await env.DB.prepare(
    `INSERT INTO parental_consents
       (clerk_id, menor_nombre, menor_edad, tutor_nombre, tutor_email, tutor_documento, parentesco, token, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')`,
  )
    .bind(
      clerkId,
      menorNombre || null,
      usuario?.edad ?? null,
      tutorNombre,
      tutorEmail,
      tutorDocumento || null,
      parentesco,
      token,
    )
    .run();

  await env.DB.prepare("UPDATE users SET consentimiento = 'pendiente' WHERE clerk_id = ?")
    .bind(clerkId)
    .run();

  const enviado = await avisarAlTutor(env, { tutorEmail, tutorNombre, menorNombre: menorNombre || 'Tu hijo/a', enlace });
  await auditar(env, clerkId, 'solicitud_consentimiento', `tutor=${tutorEmail} correo_enviado=${enviado}`, ip);

  return json({
    ok: true,
    requiere: true,
    enviado,
    enlace,
    mensaje: enviado
      ? `Enviamos un correo a ${tutorEmail}. Pídele que abra el enlace para autorizar tu cuenta.`
      : `Copia este enlace y mándaselo a ${tutorEmail} para que autorice tu cuenta.`,
  });
}
