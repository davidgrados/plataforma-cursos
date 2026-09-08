'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SignInButton } from '@clerk/nextjs';
import { AlertTriangle, Loader2, Lock } from 'lucide-react';
import { useAuthUser } from '@/lib/auth-context';
import dynamic from 'next/dynamic';
import Breadcrumbs from '@/components/Breadcrumbs';
import Markdown from '@/components/Markdown';
import { api } from '@/lib/api';
import type { Lesson } from '@/lib/types';
import { cn, LESSON_TYPE_LABEL } from '@/lib/utils';

// xterm es una librería solo-navegador: se carga únicamente en cliente.
const TerminalEmbed = dynamic(() => import('@/components/TerminalEmbed'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] animate-pulse rounded-2xl border border-white/5 bg-ink-900" />
  ),
});

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const { userId, isLoaded } = useAuthUser();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .lesson(id)
      .then(setLesson)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-400" />
        <p className="text-sm text-red-300">No se pudo cargar la lección: {error}</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Cargando lección…
      </div>
    );
  }

  const showTerminal = lesson.type !== 'exam';
  const crumbCourse = lesson.course;
  const crumbModule = lesson.module;

  const typeStyles: Record<string, string> = {
    chapter: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    practice: 'bg-accent/10 text-accent border-accent/20',
    exam: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  };

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      <Breadcrumbs
        items={[
          crumbCourse ? { label: crumbCourse.title, href: `/course/${crumbCourse.slug}` } : null,
          crumbModule ? { label: crumbModule.title } : null,
          { label: lesson.title },
        ].filter(Boolean) as { label: string; href?: string }[]}
      />

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium',
              typeStyles[lesson.type] ?? typeStyles.chapter,
            )}
          >
            {LESSON_TYPE_LABEL[lesson.type] ?? lesson.type}
          </span>
          {lesson.type === 'exam' && (
            <span className="text-xs text-slate-500">Examen final integral del curso</span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
      </header>

      <article className="rounded-2xl border border-white/5 bg-ink-900/60 p-6 sm:p-8">
        <Markdown content={lesson.content_md} />
      </article>

      {showTerminal && (
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            Laboratorio
            {lesson.type === 'practice' && (
              <span className="text-sm font-normal text-slate-400">
                · completa el ejercicio y pulsa «Verificar»
              </span>
            )}
          </h2>

          {!isLoaded ? (
            <div className="flex items-center gap-2 py-10 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" /> Comprobando sesión…
            </div>
          ) : !userId ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/5 bg-ink-900/60 p-10 text-center">
              <Lock className="h-8 w-8 text-slate-500" />
              <p className="text-slate-300">
                Inicia sesión para usar el laboratorio interactivo y guardar tu progreso.
              </p>
              <SignInButton mode="modal">
                <button className="rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-6 py-2.5 text-sm font-semibold text-ink-950 transition hover:opacity-90">
                  Iniciar sesión con Google
                </button>
              </SignInButton>
            </div>
          ) : (
            <TerminalEmbed lessonId={lesson.id} verify={lesson.type === 'practice'} />
          )}
        </section>
      )}
    </div>
  );
}
