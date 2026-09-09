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
      <div className="flex items-center justify-center gap-2 py-24 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Comprobando permisos…
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-slate-400" />
        <h1 className="mb-2 text-xl font-semibold text-slate-900">Acceso restringido</h1>
        <p className="mb-5 text-sm text-slate-600">
          Debes iniciar sesión para acceder al panel de administración.
        </p>
        <SignInButton mode="modal">
          <button className="rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105">
            Iniciar sesión
          </button>
        </SignInButton>
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
        <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h1 className="mb-2 text-xl font-semibold text-slate-900">403 — No autorizado</h1>
        <p className="text-sm text-red-700">
          Tu cuenta no tiene rol de administrador. Pide a un administrador que actualice tu rol en
          D1 con:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-3 text-left font-mono text-xs text-slate-100">
{`wrangler d1 execute DB --command \\
  "UPDATE users SET role='admin' WHERE clerk_id='${userId}'"`}
        </pre>
      </div>
    );
  }

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Panel de administración</h1>
        <p className="text-sm text-slate-600">
          Gestiona cursos, módulos y lecciones de la plataforma.
        </p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="flex shrink-0 flex-row gap-2 lg:w-52 lg:flex-col">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition',
                tab === t.id
                  ? 'bg-sky-100 text-sky-800 ring-1 ring-sky-300'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900',
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </aside>

        <section className="min-w-0 flex-1">
          {tab === 'courses' && <CoursesPanel clerkId={userId} />}
          {tab === 'modules' && <ModulesPanel clerkId={userId} />}
          {tab === 'lessons' && <LessonsPanel clerkId={userId} />}
        </section>
      </div>
    </div>
  );
}
