'use client';

import { RotateCcw } from 'lucide-react';
import { CONSENT_EVENT, CONSENT_KEY } from './CookieBanner';

/**
 * Borra la elección guardada y vuelve a mostrar el aviso de cookies,
 * para que el visitante pueda cambiar entre aceptar y rechazar.
 */
export default function CookieSettings() {
  function cambiarEleccion() {
    try {
      window.localStorage.removeItem(CONSENT_KEY);
      window.localStorage.removeItem('educatecomas-cookies-aceptadas');
    } catch {
      /* sin almacenamiento disponible: basta con reabrir el aviso */
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  return (
    <button
      type="button"
      onClick={cambiarEleccion}
      className="inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
    >
      <RotateCcw className="h-4 w-4" />
      Cambiar mi elección de cookies
    </button>
  );
}
