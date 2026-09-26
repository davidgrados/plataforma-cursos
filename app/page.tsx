import Link from 'next/link';
import { GraduationCap, ShieldCheck, TerminalSquare } from 'lucide-react';
import CourseList from '@/components/CourseList';
import { getEnv } from '@/lib/cloudflare';
import type { Course } from '@/lib/types';

/**
 * Los cursos se leen en el SERVIDOR y se envían ya renderizados.
 *
 * Motivo (CLS): antes se pedían desde el navegador, así que la página mostraba
 * un pequeño «Cargando cursos…» y, al llegar los datos, la cuadrícula completa
 * aparecía de golpe empujando el pie de página hacia abajo. Ahora la cuadrícula
 * forma parte del HTML inicial: no hay ningún salto.
 */
async function leerCursos(): Promise<Course[]> {
  try {
    const env = await getEnv();
    const { results } = await env.DB.prepare(
      `SELECT c.*,
              (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) AS module_count
       FROM courses c
       ORDER BY (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) = 0 ASC,
                c.created_at DESC`,
    ).all();
    return (results ?? []) as Course[];
  } catch {
    // Si la lectura falla, CourseList los pedirá desde el navegador (como antes).
    return [];
  }
}

export default async function HomePage() {
  const cursos = await leerCursos();

  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <section className="animate-fade-up flex flex-col items-center gap-6 py-10 text-center">
        <div className="flex items-center gap-3 rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm font-medium text-sky-700">
          <TerminalSquare className="h-4 w-4 text-accent" />
          Laboratorio Linux 100% en tu navegador
        </div>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Aprende y crece con{' '}
          <span className="bg-gradient-to-r from-sky-600 via-accent to-indigo-500 bg-clip-text text-transparent">
            cursos interactivos
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Cursos claros y amigables para toda la familia: Linux, inglés, IA, seguridad y mucho más,
          con exámenes y laboratorios interactivos.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#cursos"
            className="rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-6 py-3 font-semibold text-white shadow-glow transition hover:brightness-105"
          >
            Explorar cursos
          </Link>
          <Link
            href="/course/linux-basico"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Ir a Linux Básico
          </Link>
        </div>

        {/* Aclaración amigable: la cuenta es opcional */}
        <div className="flex max-w-3xl flex-col items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center text-sm text-emerald-900 sm:flex-row sm:text-left">
          <GraduationCap className="h-5 w-5 shrink-0 text-emerald-600" />
          <p className="leading-relaxed">
            <strong>No necesitas crear una cuenta para aprender.</strong> Puedes entrar a cualquier
            curso, leer las lecciones y practicar en el laboratorio ahora mismo.
            <span className="mt-1 block text-emerald-800">
              La cuenta es <strong>opcional</strong> y sirve solo para una cosa: guardar tu progreso y
              seguir donde lo dejaste. Tú decides.
            </span>
          </p>
        </div>
      </section>

      {/* Características */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: TerminalSquare,
            title: 'Terminal real (simulado)',
            desc: 'Ejecuta comandos sobre un sistema de archivos virtual, sin riesgo y con validación.',
            image: '/features/terminal-real.svg',
          },
          {
            icon: GraduationCap,
            title: 'Varios cursos',
            desc: 'Linux, inglés con pronunciación, IA, seguridad y marketing. Para todas las edades.',
            image: '/features/varios-cursos.svg',
          },
          {
            icon: ShieldCheck,
            title: 'Progreso y exámenes',
            desc: 'Cada lección se valida y tu avance queda guardado en tu cuenta.',
            image: '/features/progreso-examenes.svg',
          },
        ].map((f) => (
          <div
            key={f.title}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
          >
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-sky-200 via-sky-100 to-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.image}
                alt={f.title}
                className="h-full w-full object-cover transition duration-300 hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-1.5 flex items-center gap-2">
                <f.icon className="h-5 w-5 shrink-0 text-sky-600" />
                <h3 className="font-semibold text-slate-900">{f.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Cursos */}
      <section id="cursos" className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cursos disponibles</h2>
          <p className="text-slate-600">Elige un curso para empezar a aprender.</p>
        </div>
        <CourseList iniciales={cursos} />
      </section>
    </div>
  );
}
