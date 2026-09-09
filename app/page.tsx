import Link from 'next/link';
import { GraduationCap, ShieldCheck, TerminalSquare } from 'lucide-react';
import CourseList from '@/components/CourseList';

export default function HomePage() {
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
      </section>

      {/* Características */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: TerminalSquare,
            title: 'Terminal real (simulado)',
            desc: 'Ejecuta comandos sobre un sistema de archivos virtual, sin riesgo y con validación.',
          },
          {
            icon: GraduationCap,
            title: 'Varios cursos',
            desc: 'Linux, inglés con pronunciación, IA, seguridad y marketing. Para todas las edades.',
          },
          {
            icon: ShieldCheck,
            title: 'Progreso y exámenes',
            desc: 'Cada lección se valida y tu avance queda guardado en tu cuenta.',
          },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <f.icon className="mb-3 h-7 w-7 text-sky-600" />
            <h3 className="mb-1.5 font-semibold text-slate-900">{f.title}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Cursos */}
      <section id="cursos" className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cursos disponibles</h2>
          <p className="text-slate-600">Elige un curso para empezar a aprender.</p>
        </div>
        <CourseList />
      </section>
    </div>
  );
}
