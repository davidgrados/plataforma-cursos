import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react';
import { ARTICULOS } from '@/lib/ia/articulos';
import { AUTOR, BIO_CORTA } from '@/lib/perfil';
import { SITE_NAME, absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Inteligencia artificial explicada en simple',
  description:
    'Guías de inteligencia artificial en español, escritas por David Grados Alzamora: qué es la IA, cómo escribir buenos prompts y cómo aprender gratis desde Perú.',
  keywords: [
    'inteligencia artificial en español',
    'aprender inteligencia artificial',
    'guías de IA para principiantes',
    'David Grados Alzamora',
  ],
  alternates: { canonical: '/ia' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'es_PE',
    url: absoluteUrl('/ia'),
    title: 'Inteligencia artificial explicada en simple | Edúcate Comas',
    description:
      'Guías de inteligencia artificial en español, escritas por David Grados Alzamora: qué es la IA, cómo escribir buenos prompts y cómo aprender gratis desde Perú.',
    images: [{ url: absoluteUrl('/og-image.png'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inteligencia artificial explicada en simple | Edúcate Comas',
    description: 'Guías de IA en español, sin tecnicismos.',
    images: [absoluteUrl('/og-image.png')],
  },
};

export default function IaPage() {
  return (
    <div className="animate-fade-up flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <span className="flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm font-medium text-sky-700">
          <Sparkles className="h-4 w-4" />
          Inteligencia artificial, explicada en simple
        </span>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          Inteligencia artificial sin humo: guías claras para empezar de verdad
        </h1>
        <p className="max-w-3xl text-lg text-slate-600">
          Aquí no vendemos herramientas de moda: explicamos cómo funciona la inteligencia artificial,
          qué límites tiene y cómo usarla con criterio, en español y con ejemplos cotidianos de
          Comas, Lima y cualquier lugar del Perú.
        </p>
      </header>

      {/* Índice de artículos */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Guías publicadas</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {ARTICULOS.map((a) => (
            <Link
              key={a.slug}
              href={`/ia/${a.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
            >
              <span className="flex w-fit items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                <BookOpen className="h-3.5 w-3.5" />
                {a.tema}
              </span>
              <h3 className="text-lg font-semibold leading-snug text-slate-900 group-hover:text-sky-700">
                {a.titulo}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-slate-600">{a.resumen}</p>
              <span className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {a.lectura} min de lectura
                <ArrowRight className="ml-auto h-4 w-4 text-sky-600 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quién escribe */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-8">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-2xl font-bold text-white">
          DG
        </span>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Quién escribe</p>
          <h2 className="text-xl font-bold text-slate-900">{AUTOR.nombre}</h2>
          <p className="text-sm leading-relaxed text-slate-600">{BIO_CORTA}</p>
          <Link
            href="/sobre-mi"
            className="w-fit text-sm font-semibold text-sky-700 hover:underline"
          >
            Conocer su trayectoria y proyectos →
          </Link>
        </div>
      </section>

      {/* Puente a los cursos */}
      <section className="flex flex-col items-start gap-4 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            ¿Prefieres aprender con práctica guiada?
          </h2>
          <p className="mt-1 text-slate-600">
            En {SITE_NAME} los cursos son gratuitos y no necesitas instalar nada.
          </p>
        </div>
        <Link
          href="/#cursos"
          className="shrink-0 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-6 py-3 font-semibold text-white shadow-glow transition hover:brightness-105"
        >
          Ver los cursos
        </Link>
      </section>
    </div>
  );
}
