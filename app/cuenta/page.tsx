'use client';

// ============================================================
//  Mi cuenta
//
//  Dos cosas, en lenguaje claro:
//    1. TRANSPARENCIA: qué datos tenemos guardados de esta persona.
//    2. DERECHO DE SUPRESIÓN (Ley 29733, art. 20): eliminar la
//       cuenta y todos sus datos, sin escribir a nadie ni esperar.
//
//  La eliminación la ejecuta el servidor (/api/cuenta) verificando
//  la sesión: nadie puede borrar la cuenta de otra persona.
// ============================================================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignInButton, useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';
import {
  AlertTriangle,
  BookOpenCheck,
  Database,
  Loader2,
  LogIn,
  ShieldCheck,
  TerminalSquare,
  Trash2,
  UserCog,
} from 'lucide-react';
import { api } from '@/lib/api';
import { PREVIEW_MODE, useAuthUser } from '@/lib/auth-context';

/** Palabra que hay que escribir para confirmar la baja. */
const CONFIRMACION = 'ELIMINAR';

export default function CuentaPage() {
  const { userId, isLoaded } = useAuthUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Cargando…
      </div>
    );
  }

  if (PREVIEW_MODE) {
    return (
      <div className="animate-fade-up mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-slate-900">Mi cuenta</h1>
        </header>
        <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
          <p className="text-sm leading-relaxed text-slate-600">
            Estás viendo la plataforma en <strong>modo vista previa</strong> (sin inicio de sesión
            configurado), así que aquí no hay datos personales que gestionar. Puedes seguir
            estudiando con total normalidad.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-4 py-2 text-sm font-semibold text-white"
          >
            Volver a los cursos
          </Link>
        </section>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="animate-fade-up mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <span className="flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm font-medium text-sky-700">
            <UserCog className="h-4 w-4" />
            Gestión de tu cuenta
          </span>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Mi cuenta</h1>
        </header>

        <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <LogIn className="h-5 w-5 text-sky-600" />
            Necesitas iniciar sesión
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            Para ver qué datos guardamos de ti y —si lo deseas— eliminarlos, primero entra con tu
            cuenta. Recuerda que <strong>no necesitas cuenta para estudiar</strong>: solo sirve para
            guardar tu progreso.
          </p>
          <SignInButton mode="modal">
            <button className="rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
              Iniciar sesión
            </button>
          </SignInButton>
        </section>
      </div>
    );
  }

  return <PanelCuenta />;
}

// ------------------------------------------------------------
//  Panel con la sesión ya activa. Se monta solo cuando existe
//  Clerk, por eso puede usar useClerk() con seguridad.
// ------------------------------------------------------------
function PanelCuenta() {
  const router = useRouter();
  const clerk = useClerk();
  const [resumen, setResumen] = useState<{
    email: string;
    creado_en: string | null;
    lecciones_completadas: number;
    practicas_guardadas: number;
    consentimientos: number;
  } | null>(null);
  const [cargando, setCargando] = useState(true);
  const [texto, setTexto] = useState('');
  const [borrando, setBorrando] = useState(false);

  useEffect(() => {
    api.cuenta
      .resumen()
      .then(setResumen)
      .catch(() => toast.error('No pudimos cargar tus datos. Inténtalo de nuevo.'))
      .finally(() => setCargando(false));
  }, []);

  async function eliminar() {
    if (texto.trim().toUpperCase() !== CONFIRMACION) return;
    if (
      !window.confirm(
        '¿Eliminar tu cuenta y TODOS tus datos? Esta acción es definitiva y no se puede deshacer.',
      )
    ) {
      return;
    }

    setBorrando(true);
    try {
      const r = await api.cuenta.eliminar();
      toast.success(r.mensaje || 'Tu cuenta ha sido eliminada.');
      try {
        await clerk.signOut();
      } catch {
        /* si falla, la sesión caduca igualmente al borrarse la cuenta */
      }
      router.push('/');
    } catch (e: any) {
      toast.error(e?.message || 'No pudimos eliminar la cuenta. Escríbenos y lo hacemos por ti.');
      setBorrando(false);
    }
  }

  return (
    <div className="animate-fade-up mx-auto flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <span className="flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm font-medium text-sky-700">
          <UserCog className="h-4 w-4" />
          Gestión de tu cuenta
        </span>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Mi cuenta</h1>
        <p className="text-slate-600">
          Aquí puedes ver <strong>qué guardamos de ti</strong> y eliminar tu cuenta cuando quieras.
          Sin correos, sin esperas y sin dar explicaciones.
        </p>
      </header>

      {/* ---------------- Transparencia ---------------- */}
      <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Database className="h-5 w-5 text-sky-600" />
          Qué guardamos de ti
        </h2>

        {cargando ? (
          <p className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando tus datos…
          </p>
        ) : resumen ? (
          <div className="flex flex-col gap-4">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Correo</dt>
                <dd className="mt-0.5 break-all text-sm font-semibold text-slate-800">
                  {resumen.email || '—'}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Cuenta creada
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-800">
                  {resumen.creado_en ? String(resumen.creado_en).slice(0, 10) : '—'}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <dt className="mt-0.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <BookOpenCheck className="h-3.5 w-3.5" />
                  Lecciones completadas
                </dt>
                <dd className="text-lg font-bold text-slate-800">{resumen.lecciones_completadas}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <dt className="mt-0.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <TerminalSquare className="h-3.5 w-3.5" />
                  Prácticas guardadas
                </dt>
                <dd className="text-lg font-bold text-slate-800">{resumen.practicas_guardadas}</dd>
              </div>
            </dl>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-900">
              <p className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  <strong>Lo que NO guardamos:</strong> tu voz no se almacena (solo se transcribe
                  para entenderte), no guardamos contraseñas ni datos de tarjetas, y no usamos tus
                  datos para publicidad ni para entrenar modelos de inteligencia artificial.
                </span>
              </p>
            </div>

            <p className="text-xs leading-relaxed text-slate-500">
              Como titular de tus datos tienes derecho a acceder, rectificar, cancelar y oponerte
              (derechos ARCO). Puedes ejercerlos aquí mismo —eliminando tu cuenta— o escribiendo a{' '}
              <a className="text-sky-700 underline" href="mailto:privacidad@educatecomas.com">
                privacidad@educatecomas.com
              </a>
              . Más detalles en nuestra{' '}
              <Link className="text-sky-700 underline" href="/privacidad">
                Política de Privacidad
              </Link>
              .
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No pudimos cargar tus datos.</p>
        )}
      </section>

      {/* ---------------- Zona de peligro ---------------- */}
      <section className="rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-6">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-rose-800">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
          Eliminar mi cuenta
        </h2>
        <p className="mb-3 text-sm leading-relaxed text-slate-700">
          Se borrarán <strong>de forma definitiva</strong>: tu cuenta de acceso, tu correo, tu
          progreso en los cursos, las prácticas del terminal y los datos de consentimiento. Esta
          acción <strong>no se puede deshacer</strong>.
        </p>
        <p className="mb-4 text-sm leading-relaxed text-slate-700">
          Si eres menor de edad, pide a tu madre, padre o tutor que revise esto contigo antes de
          continuar.
        </p>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Escribe <strong>{CONFIRMACION}</strong> para confirmar:
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={CONFIRMACION}
            disabled={borrando}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 sm:max-w-xs"
          />
          <button
            onClick={eliminar}
            disabled={borrando || texto.trim().toUpperCase() !== CONFIRMACION}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {borrando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Eliminando…
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Eliminar mi cuenta
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
