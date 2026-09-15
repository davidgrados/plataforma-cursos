'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ModuleList from '@/components/ModuleList';
import { api } from '@/lib/api';
import type { CourseDetail } from '@/lib/types';

export default function CoursePage() {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .course(slug)
      .then(setCourse)
      .catch((e) => setError(e.message));
  }, [slug]);

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
        <p className="text-sm text-red-700">No se pudo cargar el curso: {error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Cargando curso…
      </div>
    );
  }

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      <Breadcrumbs items={[{ label: course.title }]} />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
          {course.description && (
            <p className="mt-2 max-w-3xl text-slate-600">{course.description}</p>
          )}
        </div>
        {course.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image_url}
            alt={course.title}
            className="h-28 w-44 shrink-0 rounded-2xl object-cover shadow-md"
          />
        )}
      </header>

      {course.modules.length === 0 ? (
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-sky-200 bg-white p-10 text-center shadow-sm">
          <span className="rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-sm font-semibold text-sky-700">
            Próximamente
          </span>
          <h2 className="text-xl font-semibold text-slate-900">
            Este curso está en preparación
          </h2>
          <p className="max-w-xl text-slate-600">
            Estamos preparando el contenido de <strong>{course.title}</strong>: sus módulos,
            prácticas guiadas y examen final. Muy pronto lo tendrás disponible aquí.
          </p>
          <Link
            href="/#cursos"
            className="rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-6 py-3 font-semibold text-white shadow-glow transition hover:brightness-105"
          >
            Ver los cursos disponibles
          </Link>
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Contenido del curso{' '}
            <span className="text-sm font-normal text-slate-500">
              ({course.modules.length} módulos)
            </span>
          </h2>
          <ModuleList modules={course.modules} />
        </section>
      )}

      {course.slug === 'ingles-basico' && course.modules.length > 0 && (
        <section className="mt-2 flex flex-col items-start gap-5 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-sky-50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 text-2xl shadow-md">
              🎙️
            </span>
            <div className="flex flex-col gap-1.5">
              <span className="w-fit rounded-full bg-violet-100 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-violet-700">
                Práctica extra · opcional
              </span>
              <h2 className="text-lg font-semibold text-slate-900">
                ¿Terminaste el curso? Practica conversación con Coti
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                El curso es el contenido de los {course.modules.length} módulos de arriba. Esto es una{' '}
                <strong>práctica adicional para hablar</strong>: elige el módulo que estudiaste, toca
                el orbe y responde en voz alta. Coti, la tutora con IA, te escucha, te corrige con
                cariño y te contesta con voz. Si prefieres, también puedes escribir tus respuestas.
              </p>
            </div>
          </div>
          <Link
            href="/ingles/tutor"
            className="shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-6 py-3 font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            Practicar conversación
          </Link>
        </section>
      )}
    </div>
  );
}
