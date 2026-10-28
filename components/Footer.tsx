'use client';

import Link from 'next/link';
import { REDES } from '@/lib/perfil';

const CONTACTO = 'davidgradosa@hotmail.com';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 py-8 sm:px-6">
        <div className="flex w-full flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 Edúcate Comas · Todos los derechos reservados</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/ia" className="transition hover:text-sky-700">
              Guías de IA
            </Link>
            <Link href="/sobre-mi" className="transition hover:text-sky-700">
              Sobre el autor
            </Link>
            <Link href="/privacidad" className="transition hover:text-sky-700">
              Privacidad
            </Link>
            <Link href="/privacidad#cookies" className="transition hover:text-sky-700">
              Cookies
            </Link>
            <Link href="/terminos" className="transition hover:text-sky-700">
              Términos de uso
            </Link>
            {REDES.filter((r) => r.icono === 'tiktok').map((r) => (
              <a
                key={r.nombre}
                href={r.url}
                rel="me noopener noreferrer"
                target="_blank"
                className="transition hover:text-sky-700"
              >
                TikTok
              </a>
            ))}
            <span>Para toda la familia</span>
          </nav>
        </div>

        <div className="flex w-full flex-col items-center gap-1 border-t border-slate-200 pt-5 text-center text-xs text-slate-500">
          <p>
            Contacto:{' '}
            <Link href="/sobre-mi" className="font-semibold text-slate-700 hover:text-sky-700">
              David Grados Alzamora
            </Link>{' '}
            ·{' '}
            <a
              href={`mailto:${CONTACTO}`}
              className="font-medium text-sky-700 underline-offset-2 transition hover:underline"
            >
              {CONTACTO}
            </a>
          </p>
          <p>
            Un proyecto de{' '}
            <Link href="/sobre-mi" className="font-semibold text-slate-700 hover:text-sky-700">
              David Grados Alzamora
            </Link>{' '}
            · Los contenidos y el código están protegidos: prohibida su reproducción sin
            autorización.
          </p>
        </div>
      </div>
    </footer>
  );
}
