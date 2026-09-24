// ============================================================
//  Cumplimiento de la Ley N° 29733 (Perú) y su Reglamento:
//  consentimiento verificable del padre/madre/tutor para menores de 14 años.
//
//  GET  /api/consentimiento  -> estado del usuario (edad + consentimiento)
//  POST /api/consentimiento  -> { edad }  o  datos del tutor (crea solicitud)
// ============================================================

import { error, getClerkId, getClientIp, getEnv, json, readJson, type Env } from '@/lib/cloudflare';
import { ensureUser } from '@/lib/d1';

// Edad mínima para usar la plataforma sin autorización de un adulto responsable.
// (No se exporta: Next.js solo admite exports de funciones HTTP en route.ts)
const EDAD_MINIMA_SIN_TUTOR = 14;

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
  datos: { tutorEmail: string; tutorNombre: string; menorNombre: string; enlace: string; parentesco?: string },
): Promise<boolean> {
  const email = env.EMAIL;
  if (!email?.send) return false;

  const asunto = `Autoriza la cuenta de ${datos.menorNombre} en Edúcate Comas`;
  const texto =
    `Hola ${datos.tutorNombre}:\n\n` +
    `${datos.menorNombre} quiere usar Edúcate Comas (https://educatecomas.com), una plataforma ` +
    `educativa gratuita con cursos interactivos.\n\n` +
    `Como es menor de 14 años, la Ley N° 29733 (Protección de Datos Personales del Perú) exige tu ` +
    `autorización para tratar sus datos personales: nombre, correo electrónico, edad y progreso de ` +
    `aprendizaje.\n\n` +
    `Para AUTORIZAR o RECHAZAR, abre este enlace personal:\n${datos.enlace}\n\n` +
    `El enlace es personal e intransferible: solo tú puedes usarlo. Si no autorizas, la cuenta del ` +
    `menor quedará inactiva y no trataremos sus datos.\n\n` +
    `Qué NO hacemos: no vendemos ni cedemos sus datos, no se usan para publicidad y no se usan para ` +
    `entrenar modelos de inteligencia artificial. En la práctica de conversación en inglés, la voz se ` +
    `transcribe y no se almacena.\n\n` +
    `El banco de datos «Estudiantes Edúcate Comas» está inscrito ante la Autoridad Nacional de ` +
    `Protección de Datos Personales (constancia INS-2026-5585 · código PN-2026-311).\n\n` +
    `Puedes ejercer los derechos de acceso, rectificación, cancelación y oposición escribiendo a ` +
    `privacidad@educatecomas.com.\n\n` +
    `Política de Privacidad: https://educatecomas.com/privacidad\n\n` +
    `Edúcate Comas · Comas, Lima (Perú)`;

  const html = `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f1f5f9;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:linear-gradient(135deg,#0ea5e9,#4f46e5);padding:20px 24px;color:#ffffff;">
        <p style="margin:0;font-size:18px;font-weight:700;">Edúcate Comas</p>
        <p style="margin:4px 0 0;font-size:13px;opacity:.9;">Autorización de un adulto responsable</p>
      </div>
      <div style="padding:24px;">
        <p style="margin:0 0 12px;font-size:15px;">Hola <strong>${datos.tutorNombre}</strong>:</p>
        <p style="margin:0 0 12px;font-size:15px;line-height:1.6;">
          <strong>${datos.menorNombre}</strong> quiere usar <strong>Edúcate Comas</strong>, una plataforma
          educativa <strong>gratuita</strong> con cursos interactivos (Linux, inglés con asistente de IA,
          ciberseguridad y más).
        </p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
          Como es <strong>menor de 14 años</strong>, la Ley N° 29733 exige tu autorización para tratar sus
          datos personales: nombre, correo electrónico, edad y progreso de aprendizaje.
        </p>
        <p style="margin:0 0 20px;text-align:center;">
          <a href="${datos.enlace}"
             style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#4f46e5);color:#ffffff;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:12px;">
            Revisar y autorizar
          </a>
        </p>
        <p style="margin:0 0 16px;font-size:13px;color:#475569;line-height:1.6;">
          El enlace es <strong>personal e intransferible</strong>. Si no autorizas, la cuenta quedará
          inactiva y no trataremos sus datos.
        </p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px;font-size:13px;color:#475569;line-height:1.6;">
          <strong style="color:#0f172a;">Qué NO hacemos:</strong> no vendemos ni cedemos sus datos, no se
          usan para publicidad y no se usan para entrenar modelos de IA. En la práctica de inglés, la voz
          se transcribe y <strong>no se almacena</strong>.<br /><br />
          El banco de datos «Estudiantes Edúcate Comas» está <strong>inscrito ante la ANPD</strong>
          (INS-2026-5585 · PN-2026-311). Puedes ejercer tus derechos ARCO escribiendo a
          <a href="mailto:privacidad@educatecomas.com" style="color:#0369a1;">privacidad@educatecomas.com</a>.
        </div>
        <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;line-height:1.6;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
          <span style="color:#0369a1;word-break:break-all;">${datos.enlace}</span>
        </p>
      </div>
      <div style="padding:14px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;">
        Edúcate Comas · Comas, Lima (Perú) ·
        <a href="https://educatecomas.com/privacidad" style="color:#0369a1;">Política de Privacidad</a>
      </div>
    </div>
  </body>
</html>`;

  try {
    const res: any = await email.send({
      to: { email: datos.tutorEmail, name: datos.tutorNombre },
      from: { email: 'privacidad@educatecomas.com', name: 'Edúcate Comas' },
      subject: asunto,
      text: texto,
      html,
    });
    if (Array.isArray(res?.errors) && res.errors.length > 0) return false;
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
