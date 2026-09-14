'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
        <p>© 2026 Edúcate Comas · Cursos interactivos</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/privacidad" className="transition hover:text-sky-700">
            Privacidad
          </Link>
          <Link href="/privacidad#cookies" className="transition hover:text-sky-700">
            Cookies
          </Link>
          <span>Para toda la familia</span>
        </nav>
      </div>
    </footer>
  );
}
