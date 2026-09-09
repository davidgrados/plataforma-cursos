'use client';

import Link from 'next/link';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { Eye, LayoutDashboard, TerminalSquare } from 'lucide-react';
import { PREVIEW_MODE, useAuthUser } from '@/lib/auth-context';

export default function Navbar() {
  const { userId } = useAuthUser();

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/60 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-cyan text-white shadow-glow transition-transform group-hover:scale-105">
            <TerminalSquare className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-800">
            Edúcate<span className="text-accent"> Comas</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:block"
          >
            Cursos
          </Link>

          {PREVIEW_MODE ? (
            <span className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
              <Eye className="h-3.5 w-3.5" />
              Vista previa
            </span>
          ) : userId ? (
            <>
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Panel</span>
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { avatarBox: 'h-9 w-9' } }}
              />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-lg bg-gradient-to-r from-accent to-accent-cyan px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
                Iniciar sesión
              </button>
            </SignInButton>
          )}
        </div>
      </nav>
    </header>
  );
}
