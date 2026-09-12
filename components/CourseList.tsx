'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BrainCircuit, Clock, Cpu, Fingerprint, Loader2, ShieldCheck, TerminalSquare } from 'lucide-react';
import { api } from '@/lib/api';
import type { Course } from '@/lib/types';

function iconFor(course: Course) {
  const t = `${course.slug} ${course.title}`.toLowerCase();
  if (t.includes('forense') || t.includes('forensic')) return Fingerprint;
  if (t.includes('linux') || t.includes('terminal')) return TerminalSquare;
  if (t.includes('seguridad') || t.includes('ciberseguridad') || t.includes('security')) return ShieldCheck;
  if (t.includes('inteligencia') || t.includes('artificial') || t.includes(' ia')) return BrainCircuit;
  if (t.includes('red') || t.includes('hardware') || t.includes('sistema')) return Cpu;
  return BrainCircuit;
}

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .courses()
      .then(setCourses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando cursos…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
        <p className="text-sm text-red-700">
          No se pudieron cargar los cursos. {error}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Asegúrate de haber ejecutado el seed y de que la API esté en funcionamiento.
        </p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Aún no hay cursos publicados. Crea el primero desde el panel de administración.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, i) => {
        const Icon = iconFor(course);
        const comingSoon = course.module_count === 0;
        return (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <Link
              href={`/course/${course.slug}`}
              className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                comingSoon
                  ? 'border-2 border-dashed border-sky-300 hover:border-sky-400'
                  : 'border border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-sky-200 via-sky-100 to-white">
                {course.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className={`h-full w-full object-cover transition group-hover:scale-105 ${
                      comingSoon ? 'opacity-75 saturate-[0.85]' : 'opacity-90'
                    }`}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Icon className="h-12 w-12 text-sky-500/70 transition group-hover:text-sky-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                {comingSoon && <div className="absolute inset-0 bg-white/25" />}
                {comingSoon && (
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-sky-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                    <Clock className="h-3.5 w-3.5" />
                    Próximamente
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
                  {course.description || 'Sin descripción.'}
                </p>
                {comingSoon ? (
                  <div className="mt-auto flex flex-col gap-2">
                    <p className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                      Curso en preparación: publicaremos sus módulos muy pronto.
                    </p>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-sky-600">
                      <Clock className="h-4 w-4" />
                      Ver portada
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                ) : (
                  <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-sky-600">
                    Ver curso
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
