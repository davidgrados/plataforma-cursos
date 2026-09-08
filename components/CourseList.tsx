'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BrainCircuit, Cpu, Loader2, ShieldCheck, TerminalSquare } from 'lucide-react';
import { api } from '@/lib/api';
import type { Course } from '@/lib/types';

function iconFor(course: Course) {
  const t = `${course.slug} ${course.title}`.toLowerCase();
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
      <div className="flex items-center justify-center gap-2 py-20 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando cursos…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-400" />
        <p className="text-sm text-red-300">
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
      <div className="rounded-2xl border border-white/5 bg-ink-900 p-10 text-center text-slate-400">
        Aún no hay cursos publicados. Crea el primero desde el panel de administración.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, i) => {
        const Icon = iconFor(course);
        return (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <Link
              href={`/course/${course.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-ink-900/60 shadow-xl transition hover:-translate-y-1 hover:border-accent/30 hover:shadow-glow"
            >
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-ink-800 to-ink-900">
                {course.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="h-full w-full object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Icon className="h-12 w-12 text-accent/60 transition group-hover:text-accent" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-400">
                  {course.description || 'Sin descripción.'}
                </p>
                <span className="mt-auto flex items-center gap-1.5 text-sm font-medium text-accent-cyan">
                  Ver curso
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
