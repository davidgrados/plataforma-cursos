'use client';

import { useEffect, useState } from 'react';
import { SignInButton } from '@clerk/nextjs';
import { BookOpen, GraduationCap, Layers, Loader2, ShieldAlert } from 'lucide-react';
import { useAuthUser } from '@/lib/auth-context';
import CoursesPanel from '@/components/admin/CoursesPanel';
import ModulesPanel from '@/components/admin/ModulesPanel';
import LessonsPanel from '@/components/admin/LessonsPanel';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'courses', label: 'Cursos', icon: BookOpen },
  { id: 'modules', label: 'Módulos', icon: Layers },
  { id: 'lessons', label: 'Lecciones', icon: GraduationCap },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function AdminDashboardPage() {
  const { userId, isLoaded } = useAuthUser();
  const [role, setRole] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<TabId>('courses');

  useEffect(() => {
    if (!userId) {
      setChecking(false);
      return;
    }
    api
      .me(userId)
      .then((u) => setRole(u.role))
      .catch(() => setRole('student'))
      .finally(() => setChecking(false));
  }, [userId]);

  if (!isLoaded || checking) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Comprobando permisos…
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-white/5 bg-ink-900/60 p-10 text-center">
        <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-slate-500" />
        <h1 className="mb-2 text-xl font-semibold text-white">Acceso restringido</h1>
        <p className="mb-5 text-sm text-slate-400">
          Debes iniciar sesión para acceder al panel de administración.
        </p>
        <SignInButton mode="modal">
          <button className="rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-6 py-2.5 text-sm font-semibold text-ink-950 transition hover:opacity-90">
            Iniciar sesión
          </button>
        </SignInButton>
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
        <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-red-400" />
        <h1 className="mb-2 text-xl font-semibold text-white">403 — No autorizado</h1>
        <p className="text-sm text-red-300">
          Tu cuenta no tiene rol de administrador. Pide a un administrador que actualice tu rol en
          D1 con:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-ink-950 p-3 text-left font-mono text-xs text-slate-300">
{`wrangler d1 execute DB --command \\
  "UPDATE users SET role='admin' WHERE clerk_id='${userId}'"`}
        </pre>
      </div>
    );
  }

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Panel de administración</h1>
        <p className="text-sm text-slate-400">
          Gestiona cursos, módulos y lecciones de la plataforma.
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Navegación lateral */}
        <aside className="flex shrink-0 flex-row gap-2 lg:w-52 lg:flex-col">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition',
                tab === t.id
                  ? 'bg-gradient-to-r from-accent/15 to-accent-cyan/10 text-accent ring-1 ring-accent/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </aside>

        {/* Contenido */}
        <section className="min-w-0 flex-1">
          {tab === 'courses' && <CoursesPanel clerkId={userId} />}
          {tab === 'modules' && <ModulesPanel clerkId={userId} />}
          {tab === 'lessons' && <LessonsPanel clerkId={userId} />}
        </section>
      </div>
    </div>
  );
}
