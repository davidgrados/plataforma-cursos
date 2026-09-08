import Link from 'next/link';
import { GraduationCap, ShieldCheck, TerminalSquare } from 'lucide-react';
import CourseList from '@/components/CourseList';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <section className="animate-fade-up flex flex-col items-center gap-6 py-10 text-center">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
          <TerminalSquare className="h-4 w-4 text-accent" />
          Laboratorio Linux 100% en tu navegador
        </div>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          Aprende Linux y mucho más con{' '}
          <span className="bg-gradient-to-r from-accent via-accent-cyan to-accent-violet bg-clip-text text-transparent">
            terminal interactivo
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-slate-400">
          Cursos completos con teoría, prácticas guiadas y un emulador de terminal que valida tus
          ejercicios al instante. Multi-curso y con panel de administración.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#cursos"
            className="rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-6 py-3 font-semibold text-ink-950 shadow-glow transition hover:opacity-90"
          >
            Explorar cursos
          </Link>
          <Link
            href="/course/linux-basico"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
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
            desc: 'Ejecuta pwd, ls, cd, mkdir, grep y más sobre un sistema de archivos virtual persistente.',
          },
          {
            icon: GraduationCap,
            title: 'Múltiples cursos',
            desc: 'Linux Básico, Inteligencia Artificial, Seguridad Informática… crea los que necesites.',
          },
          {
            icon: ShieldCheck,
            title: 'Progreso y validación',
            desc: 'Cada práctica se valida automáticamente y queda registrada en tu perfil.',
          },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-white/5 bg-ink-900/60 p-6">
            <f.icon className="mb-3 h-7 w-7 text-accent" />
            <h3 className="mb-1.5 font-semibold text-white">{f.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Cursos */}
      <section id="cursos" className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Cursos disponibles</h2>
          <p className="text-slate-400">Elige un curso para empezar a aprender.</p>
        </div>
        <CourseList />
      </section>
    </div>
  );
}
