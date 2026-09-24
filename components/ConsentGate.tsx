'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Copy,
  Info,
  Loader2,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import { useAuthUser } from '@/lib/auth-context';
import { api } from '@/lib/api';

const EDAD_MINIMA = 14;

/**
 * Puerta de protección de datos (Ley N° 29733, Perú).
 *
 * - Pregunta la edad la primera vez (para saber si hay que proteger datos de menores).
 * - Si el estudiante es menor de 14 años, exige la AUTORIZACIÓN VERIFICABLE de su
 *   padre, madre o tutor antes de dejarle usar la plataforma.
 */
export default function ConsentGate() {
  const { userId, isLoaded } = useAuthUser();
  const [cargando, setCargando] = useState(true);
  const [edad, setEdad] = useState<number | null>(null);
  const [consentimiento, setConsentimiento] = useState('no_requerido');
  const [solicitud, setSolicitud] = useState<{ estado: string; tutor_email: string } | null>(null);
  const [edadInput, setEdadInput] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enlace, setEnlace] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [form, setForm] = useState({
    tutorNombre: '',
    tutorEmail: '',
    tutorDocumento: '',
    parentesco: '',
    menorNombre: '',
  });

  const consultar = useCallback(async () => {
    try {
      const r = await api.consentimiento.estado();
      setEdad(r.edad);
      setConsentimiento(r.consentimiento);
      setSolicitud(r.solicitud ? { estado: r.solicitud.estado, tutor_email: r.solicitud.tutor_email } : null);
    } catch {
      /* si falla, no bloqueamos la navegación */
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      setCargando(false);
      return;
    }
    void consultar();
  }, [isLoaded, userId, consultar]);

  async function guardarEdad(e: React.FormEvent) {
    e.preventDefault();
    const valor = Number(edadInput);
    if (!Number.isInteger(valor) || valor < 5 || valor > 110) {
      setError('Escribe una edad válida (por ejemplo, 12).');
      return;
    }
    setError('');
    setEnviando(true);
    try {
      const r = await api.consentimiento.declararEdad(valor);
      setEdad(valor);
      setConsentimiento(r.consentimiento);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  async function pedirAutorizacion(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const r = await api.consentimiento.solicitar(form);
      if (!r.requiere) {
        setConsentimiento('no_requerido');
        return;
      }
      setEnlace(r.enlace);
      setConsentimiento('pendiente');
      setSolicitud({ estado: 'pendiente', tutor_email: form.tutorEmail });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  function copiar() {
    navigator.clipboard?.writeText(enlace).then(
      () => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      },
      () => setError('No se pudo copiar. Mantén pulsado el enlace para copiarlo.'),
    );
  }

  if (!isLoaded || cargando || !userId) return null;

  // --- 1. Todavía no sabemos la edad ---
  if (edad === null) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/95 p-4 backdrop-blur">
        <form
          onSubmit={guardarEdad}
          className="w-full max-w-md rounded-3xl border border-sky-200 bg-white p-7 shadow-xl"
        >
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50">
            <ShieldCheck className="h-6 w-6 text-sky-600" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">Antes de empezar</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Para proteger tus datos, necesitamos saber tu edad. Si eres <strong>menor de 14 años</strong>,
            pediremos la autorización de tu madre, padre o tutor (lo exige la Ley de Protección de
            Datos Personales del Perú).
          </p>
          <label className="mt-5 block text-sm font-semibold text-slate-700">
            ¿Cuántos años tienes?
          </label>
          <input
            type="number"
            inputMode="numeric"
            min={5}
            max={110}
            value={edadInput}
            onChange={(e) => setEdadInput(e.target.value)}
            placeholder="Por ejemplo: 12"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-3 font-semibold text-white shadow-glow transition hover:brightness-105 disabled:opacity-60"
          >
            {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Continuar
          </button>
          <p className="mt-3 text-center text-xs text-slate-500">
            Solo guardamos tu edad para saber si necesitas autorización. Puedes leer más en la{' '}
            <Link href="/privacidad" className="underline">
              Política de Privacidad
            </Link>
            .
          </p>
        </form>
      </div>
    );
  }

  // --- 2. Adulto: sin restricciones ---
  if (edad >= EDAD_MINIMA && consentimiento === 'no_requerido') return null;

  // --- 3. Menor ya autorizado ---
  if (consentimiento === 'aprobado') return null;

  // --- 4. Menor rechazado ---
  if (consentimiento === 'rechazado') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/95 p-4 backdrop-blur">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <Users className="h-7 w-7 text-amber-600" />
          </span>
          <h2 className="text-xl font-bold text-slate-900">Tu tutor no autorizó el acceso</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Según la Ley N° 29733, sin la autorización de tu padre, madre o tutor no podemos tratar tus
            datos personales, así que la cuenta queda inactiva. Si fue un error, pídele que vuelva a
            revisar el correo.
          </p>
          <Link
            href="/privacidad#menores"
            className="mt-5 inline-block rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Ver la Política de Privacidad
          </Link>
        </div>
      </div>
    );
  }

  // --- 5. Menor pendiente de autorización ---
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-white/95 p-4 backdrop-blur">
      <div className="my-6 w-full max-w-2xl rounded-3xl border border-sky-200 bg-white p-7 shadow-xl">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50">
          <UserCheck className="h-6 w-6 text-sky-600" />
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          Necesitamos la autorización de tu madre, padre o tutor
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Tienes menos de {EDAD_MINIMA} años, así que la <strong>Ley N° 29733</strong> exige que un
          adulto responsable autorice el uso de tus datos personales (nombre, correo y tu progreso de
          aprendizaje). Es rápido y solo se hace una vez.
        </p>

        {enlace || consentimiento === 'pendiente' ? (
          <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-sky-50 p-5">
            <p className="flex items-start gap-2 text-sm font-semibold text-sky-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              Autorización pendiente{solicitud?.tutor_email ? ` de ${solicitud.tutor_email}` : ''}. Pídele
              que abra el enlace que le enviamos:
            </p>
            {enlace && (
              <>
                <code className="block break-all rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs text-slate-700">
                  {enlace}
                </code>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={copiar}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                  >
                    {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiado ? '¡Copiado!' : 'Copiar enlace'}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Hola, necesito que autorices mi cuenta de Edúcate Comas (soy menor de 14). Abre este enlace: ${enlace}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                  >
                    Enviar por WhatsApp
                  </a>
                </div>
              </>
            )}
            <button
              type="button"
              onClick={() => void consultar()}
              className="w-fit text-xs font-semibold text-sky-700 underline"
            >
              Ya autorizó — comprobar de nuevo
            </button>
          </div>
        ) : (
          <form onSubmit={pedirAutorizacion} className="mt-5 flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-semibold text-slate-700">Nombre completo del adulto *</span>
                <input
                  required
                  value={form.tutorNombre}
                  onChange={(e) => setForm({ ...form, tutorNombre: e.target.value })}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="Ej.: María Quispe Rojas"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-semibold text-slate-700">Correo del adulto *</span>
                <input
                  required
                  type="email"
                  value={form.tutorEmail}
                  onChange={(e) => setForm({ ...form, tutorEmail: e.target.value })}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="madre@correo.com"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-semibold text-slate-700">Parentesco *</span>
                <select
                  required
                  value={form.parentesco}
                  onChange={(e) => setForm({ ...form, parentesco: e.target.value })}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">Elige…</option>
                  <option value="madre">Madre</option>
                  <option value="padre">Padre</option>
                  <option value="tutor legal">Tutor legal</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-semibold text-slate-700">
                  DNI del adulto <span className="font-normal text-slate-400">(opcional)</span>
                </span>
                <input
                  value={form.tutorDocumento}
                  onChange={(e) => setForm({ ...form, tutorDocumento: e.target.value })}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="Para verificaciones"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                <span className="font-semibold text-slate-700">
                  Tu nombre <span className="font-normal text-slate-400">(opcional)</span>
                </span>
                <input
                  value={form.menorNombre}
                  onChange={(e) => setForm({ ...form, menorNombre: e.target.value })}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="Tu nombre y apellido"
                />
              </label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-3 font-semibold text-white shadow-glow transition hover:brightness-105 disabled:opacity-60"
            >
              {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
              Pedir autorización
            </button>
            <p className="text-xs leading-relaxed text-slate-500">
              Le enviaremos un enlace personal para que autorice o rechace tu cuenta. Solo el adulto
              puede abrirlo. Mientras tanto no podemos mostrar el contenido del curso. Más información
              en la{' '}
              <Link href="/privacidad#menores" className="underline">
                Política de Privacidad
              </Link>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
