'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 py-8 sm:px-6">
        <div className="flex w-full flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 Edúcate Comas · Todos los derechos reservados</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacidad" className="transition hover:text-sky-700">
              Privacidad
            </Link>
            <Link href="/privacidad#cookies" className="transition hover:text-sky-700">
              Cookies
            </Link>
            <Link href="/terminos" className="transition hover:text-sky-700">
              Términos de uso
            </Link>
            <span>Para toda la familia</span>
          </nav>
        </div>

        <p className="w-full border-t border-slate-200 pt-5 text-center text-xs text-slate-500">
          Un proyecto de <span className="font-semibold text-slate-700">David Grados</span> · Los
          contenidos y el código están protegidos: prohibida su reproducción sin autorización.
        </p>
      </div>
    </footer>
  );
}
