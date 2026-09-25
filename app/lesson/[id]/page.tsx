'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SignInButton } from '@clerk/nextjs';
import { AlertTriangle, ArrowLeft, ArrowRight, Info, Loader2 } from 'lucide-react';
import { useAuthUser } from '@/lib/auth-context';
import dynamic from 'next/dynamic';
import Breadcrumbs from '@/components/Breadcrumbs';
import Markdown from '@/components/Markdown';
import Quiz from '@/components/Quiz';
import { api } from '@/lib/api';
import { QUIZZES } from '@/lib/quiz-data';
import type { Lesson } from '@/lib/types';
import { cn, LESSON_TYPE_LABEL } from '@/lib/utils';

// xterm es una librería solo-navegador: se carga únicamente en cliente.
const TerminalEmbed = dynamic(() => import('@/components/TerminalEmbed'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
  ),
});

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const { userId, isLoaded } = useAuthUser();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .lesson(id)
      .then((l) => {
        setLesson(l);
        if (l.course) {
          api
            .course(l.course.slug)
            .then((course) => {
              const all = course.modules.flatMap((m) => m.lessons ?? []);
              const idx = all.findIndex((ls) => ls.id === l.id);
              setPrevLesson(idx > 0 ? all[idx - 1] : null);
              setNextLesson(idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null);
            })
            .catch(() => {
              /* opcional */
            });
        }
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
        <p className="text-sm text-red-700">No se pudo cargar la lección: {error}</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Cargando lección…
      </div>
    );
  }

  const showTerminal = lesson.type === 'practice';
  const crumbCourse = lesson.course;
  const crumbModule = lesson.module;
  const quiz = QUIZZES[lesson.slug];

  const typeStyles: Record<string, string> = {
    chapter: 'bg-sky-100 text-sky-700 border-sky-200',
    practice: 'bg-blue-100 text-blue-700 border-blue-200',
    exam: 'bg-indigo-100 text-indigo-700 border-indigo-200',
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
              'rounded-full border px-3 py-1 text-xs font-semibold',
              typeStyles[lesson.type] ?? typeStyles.chapter,
            )}
          >
            {LESSON_TYPE_LABEL[lesson.type] ?? lesson.type}
          </span>
          {lesson.type === 'exam' && (
            <span className="text-xs text-slate-500">Examen final integral del curso</span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
      </header>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {quiz ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-slate-600">
              Selecciona una opción por pregunta y pulsa <b>«Comprobar respuestas»</b>.
            </p>
            <Quiz questions={quiz} />
          </div>
        ) : (
          <Markdown
            content={lesson.content_md}
            speakEnabled={lesson.course?.slug === 'ingles-basico'}
          />
        )}
      </article>

      {showTerminal && (
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            Laboratorio
            {lesson.type === 'practice' && (
              <span className="text-sm font-normal text-slate-500">
                · completa el ejercicio y pulsa «Verificar»
              </span>
            )}
          </h2>

          {!isLoaded ? (
            <div className="flex items-center gap-2 py-10 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" /> Comprobando sesión…
            </div>
          ) : !userId ? (
            <>
              {/* Mensaje amigable: no hace falta cuenta para practicar */}
              <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2.5">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <p className="leading-relaxed">
                    <strong>No necesitas cuenta para practicar aquí.</strong> Puedes escribir comandos
                    en el terminal, hacer el ejercicio y verificar tu respuesta ahora mismo.
                    <span className="mt-1 block text-amber-800">
                      Lo único que no se guardará es tu progreso: si creas una cuenta (gratis), al
                      volver seguirás justo donde lo dejaste.
                    </span>
                  </p>
                </div>
                <SignInButton mode="modal">
                  <button className="shrink-0 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-105">
                    Guardar mi progreso
                  </button>
                </SignInButton>
              </div>
              <TerminalEmbed
                lessonId={lesson.id}
                verify={lesson.type === 'practice'}
                initialFs={lesson.initial_fs}
                checkLogic={lesson.check_logic}
              />
            </>
          ) : (
            <>
              <div className="flex items-start gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                <p>
                  Tu laboratorio <strong>guarda lo que haces</strong>, así que si ya habías hecho esta
                  práctica verás tus archivos anteriores. En ese caso el trabajo ya está hecho: pulsa{' '}
                  <strong>«Verificar ejercicio»</strong>. Si quieres empezar de cero, pulsa{' '}
                  <strong>«Reiniciar»</strong> (borra tus archivos de esta práctica).
                </p>
              </div>
              <TerminalEmbed
                lessonId={lesson.id}
                verify={lesson.type === 'practice'}
                initialFs={lesson.initial_fs}
                checkLogic={lesson.check_logic}
              />
            </>
          )}
        </section>
      )}

      {(prevLesson || nextLesson) && (
        <nav className="mt-2 flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
          {prevLesson ? (
            <Link
              href={`/lesson/${prevLesson.id}`}
              className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span className="flex min-w-0 flex-col">
                <span className="text-xs text-slate-500">Anterior</span>
                <span className="truncate font-semibold text-slate-800">{prevLesson.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}

          {nextLesson ? (
            <Link
              href={`/lesson/${nextLesson.id}`}
              className="ml-auto flex min-w-0 items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
            >
              <span className="flex min-w-0 flex-col text-left">
                <span className="text-[11px] font-medium opacity-90">Siguiente</span>
                <span className="truncate font-semibold">{nextLesson.title}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          ) : null}
        </nav>
      )}
    </div>
  );
}
