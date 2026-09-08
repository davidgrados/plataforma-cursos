'use client';

import { useEffect, useState } from 'react';
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
      <div className="mx-auto max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-400" />
        <p className="text-sm text-red-300">No se pudo cargar el curso: {error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Cargando curso…
      </div>
    );
  }

  return (
    <div className="animate-fade-up flex flex-col gap-6">
      <Breadcrumbs items={[{ label: course.title }]} />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{course.title}</h1>
          {course.description && (
            <p className="mt-2 max-w-3xl text-slate-400">{course.description}</p>
          )}
        </div>
        {course.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image_url}
            alt={course.title}
            className="h-28 w-44 shrink-0 rounded-2xl object-cover shadow-lg"
          />
        )}
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-white">
          Contenido del curso{' '}
          <span className="text-sm font-normal text-slate-500">
            ({course.modules.length} módulos)
          </span>
        </h2>
        <ModuleList modules={course.modules} />
      </section>
    </div>
  );
}
