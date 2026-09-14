'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

/** Clave donde se guarda la elección del visitante. */
export const CONSENT_KEY = 'educatecomas-cookies-consent';
/** Clave antigua (solo aceptar) para no volver a preguntar a quien ya aceptó. */
const LEGACY_KEY = 'educatecomas-cookies-aceptadas';
/** Evento para reabrir el aviso (por ejemplo desde "Cambiar mi elección"). */
export const CONSENT_EVENT = 'cookie-consent-change';

type Consent = 'aceptadas' | 'rechazadas';

/**
 * Aviso de cookies con opción de aceptar o rechazar.
 * La plataforma solo usa cookies necesarias, así que rechazar no limita el uso
 * del sitio: únicamente deja constancia de que no se autorizan cookies no esenciales.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  const sync = useCallback(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(CONSENT_KEY);
      if (!stored && window.localStorage.getItem(LEGACY_KEY)) stored = 'aceptadas';
    } catch {
      stored = null;
    }
    setVisible(!stored);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, [sync]);

  function decidir(valor: Consent) {
    try {
      window.localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ value: valor, date: new Date().toISOString() }),
      );
    } catch {
      /* si el navegador bloquea el almacenamiento, solo ocultamos el aviso */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-sky-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50">
            <Cookie className="h-5 w-5 text-sky-600" />
          </span>
          <p className="text-sm leading-relaxed text-slate-600">
            Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas
            nuestras{' '}
            <Link
              href="/privacidad"
              className="font-semibold text-sky-700 underline decoration-sky-300 underline-offset-2 hover:text-sky-800"
            >
              políticas de privacidad
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <Link
            href="/privacidad#cookies"
            className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Más información
          </Link>
          <button
            type="button"
            onClick={() => decidir('rechazadas')}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => decidir('aceptadas')}
            className="rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-105"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
