'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertTriangle, Check, Loader2, ShieldCheck, X } from 'lucide-react';

interface Solicitud {
  menor_nombre: string;
  menor_edad: number | null;
  tutor_nombre: string;
  tutor_email: string;
  parentesco: string;
  estado: string;
  creado_en: string;
  verificado_en: string | null;
}

/**
 * Página pública para que el padre, madre o tutor autorice (o rechace)
 * la cuenta de un menor de 14 años. Ley N° 29733 (Perú).
 */
export default function ConsentimientoPage() {
  const { token } = useParams<{ token: string }>();
  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    fetch(`/api/consentimiento/${token}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d?.error || 'Enlace no válido');
        setSolicitud(d);
      })
      .catch((e) => setError(e.message));
  }, [token]);

  async function decidir(decision: 'aprobar' | 'rechazar') {
    setEnviando(true);
    setError('');
    try {
      const r = await fetch(`/api/consentimiento/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || 'No se pudo registrar tu decisión');
      setResultado(d.mensaje);
      setSolicitud((s) => (s ? { ...s, estado: d.estado } : s));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="animate-fade-up mx-auto flex max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm font-medium text-sky-700">
          <ShieldCheck className="h-4 w-4" />
          Autorización de un adulto responsable
        </span>
        <h1 className="text-3xl font-bold text-slate-900">Autorización para usar Edúcate Comas</h1>
      </header>

      {error && !solicitud && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!solicitud && !error && (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Cargando la solicitud…
        </div>
      )}

      {solicitud && (
        <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {resultado || solicitud.estado !== 'pendiente' ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  solicitud.estado === 'aprobado' ? 'bg-emerald-50' : 'bg-amber-50'
                }`}
              >
                {solicitud.estado === 'aprobado' ? (
                  <Check className="h-7 w-7 text-emerald-600" />
                ) : (
                  <X className="h-7 w-7 text-amber-600" />
                )}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {solicitud.estado === 'aprobado' ? 'Autorización registrada' : 'Solicitud rechazada'}
              </h2>
              <p className="max-w-md text-sm text-slate-600">
                {resultado ||
                  (solicitud.estado === 'aprobado'
                    ? 'Ya autorizaste la cuenta. El estudiante puede usar la plataforma.'
                    : 'Registramos tu decisión. La cuenta del menor no podrá usar la plataforma.')}
              </p>
              <Link
                href="/"
                className="mt-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
              >
                Ir a la web
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-slate-900">
                  Hola {solicitud.tutor_nombre}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  <strong>{solicitud.menor_nombre}</strong>
                  {solicitud.menor_edad ? ` (${solicitud.menor_edad} años)` : ''} quiere usar{' '}
                  <strong>Edúcate Comas</strong>, una plataforma educativa <strong>gratuita</strong> con
                  cursos interactivos (Linux, inglés con asistente de IA, ciberseguridad y más).
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-700">
                <p className="mb-2 font-semibold">Qué datos trataremos y para qué:</p>
                <ul className="flex flex-col gap-1.5">
                  <li>• <strong>Nombre y correo electrónico:</strong> para crear y dar acceso a su cuenta.</li>
                  <li>• <strong>Progreso de aprendizaje:</strong> saber qué lecciones completó y sus resultados.</li>
                  <li>• <strong>Datos técnicos de seguridad:</strong> protección frente a abusos.</li>
                </ul>
                <p className="mt-3">
                  <strong>No vendemos ni cedemos</strong> estos datos, no se usan para publicidad y no se
                  usan para entrenar modelos de IA. En la práctica de conversación en inglés, la voz se
                  transcribe y <strong>no se almacena</strong>.
                </p>
                <p className="mt-3">
                  Como adulto responsable puedes pedir en cualquier momento el acceso, la corrección o la
                  eliminación de sus datos escribiendo a{' '}
                  <a href="mailto:davidgradosa@hotmail.com" className="font-semibold underline">
                    davidgradosa@hotmail.com
                  </a>
                  .
                </p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => decidir('aprobar')}
                  disabled={enviando}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 font-semibold text-white shadow transition hover:brightness-105 disabled:opacity-60"
                >
                  {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Sí, autorizo su cuenta
                </button>
                <button
                  type="button"
                  onClick={() => decidir('rechazar')}
                  disabled={enviando}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
                >
                  <X className="h-4 w-4" />
                  No autorizo
                </button>
              </div>

              <p className="text-xs leading-relaxed text-slate-500">
                Al pulsar «Sí, autorizo» se registra tu consentimiento con la fecha y la dirección IP
                desde la que confirmas, como exige el Reglamento de la Ley N° 29733. Más información en
                la{' '}
                <Link href="/privacidad" className="underline">
                  Política de Privacidad
                </Link>
                .
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
