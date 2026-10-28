import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Github, GraduationCap, Mail, MapPin, Sparkles, Terminal } from 'lucide-react';
import { ARTICULOS } from '@/lib/ia/articulos';
import { AUTOR, BIO_CORTA } from '@/lib/perfil';
import { SITE_NAME, absoluteUrl, organizationJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${AUTOR.nombre} · inteligencia artificial en Perú`,
  description:
    'David Grados Alzamora es el fundador de Edúcate Comas y escribe guías de inteligencia artificial en español para la comunidad de Comas, Lima (Perú).',
  keywords: [
    'David Grados Alzamora',
    'David Grados',
    'inteligencia artificial Perú',
    'divulgador de inteligencia artificial',
    'fundador de Edúcate Comas',
  ],
  alternates: { canonical: '/sobre-mi' },
  openGraph: {
    type: 'profile',
    siteName: SITE_NAME,
    locale: 'es_PE',
    url: absoluteUrl('/sobre-mi'),
    title: `${AUTOR.nombre} · ${AUTOR.rol}`,
    description: BIO_CORTA,
    images: [{ url: absoluteUrl('/og-image.png'), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${AUTOR.nombre} · ${AUTOR.rol}`,
    description: BIO_CORTA,
    images: [absoluteUrl('/og-image.png')],
  },
};

export default function SobreMiPage() {
  const url = absoluteUrl('/sobre-mi');
  const personaId = `${url}#persona`;

  return (
    <div className="animate-fade-up flex flex-col gap-10">
      {/*
        Ficha de la persona (Person + ProfilePage).

        Es el corazón del posicionamiento del nombre: aquí se declara, en el
        idioma que entienden los buscadores, quién es David Grados Alzamora,
        de qué temas habla (knowsAbout), con quién trabaja y qué perfiles
        externos lo respaldan (sameAs).
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Person',
              '@id': personaId,
              name: AUTOR.nombre,
              alternateName: [AUTOR.nombreCorto, 'David Grados'],
              url,
              email: AUTOR.email,
              jobTitle: AUTOR.rol,
              description: BIO_CORTA,
              image: absoluteUrl('/og-image.png'),
              knowsLanguage: ['es', 'en'],
              knowsAbout: AUTOR.temas,
              nationality: { '@type': 'Country', name: AUTOR.pais },
              workLocation: {
                '@type': 'Place',
                name: AUTOR.ciudad,
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Comas',
                  addressRegion: 'Lima',
                  addressCountry: 'PE',
                },
              },
              worksFor: organizationJsonLd(),
              sameAs: AUTOR.sameAs,
            },
            {
              '@context': 'https://schema.org',
              '@type': 'ProfilePage',
              '@id': url,
              url,
              name: `${AUTOR.nombre} · ${AUTOR.rol}`,
              inLanguage: 'es-PE',
              mainEntity: { '@id': personaId },
              about: { '@id': personaId },
              isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: absoluteUrl('/') },
              hasPart: ARTICULOS.map((a) => ({
                '@type': 'Article',
                headline: a.titulo,
                url: absoluteUrl(`/ia/${a.slug}`),
              })),
            },
          ]),
        }}
      />

      {/* Encabezado */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
        <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 via-accent to-indigo-600 text-3xl font-bold text-white shadow-glow">
          DG
        </span>
        <div className="flex flex-col gap-2">
          <span className="flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm font-medium text-sky-700">
            <Sparkles className="h-4 w-4" />
            Autor de las guías de inteligencia artificial
          </span>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            {AUTOR.nombre}
          </h1>
          <p className="text-lg font-medium text-slate-700">{AUTOR.rol}</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {AUTOR.ciudad}, {AUTOR.pais}
            </span>
            <a
              href={`mailto:${AUTOR.email}`}
              className="flex items-center gap-1.5 hover:text-sky-700"
            >
              <Mail className="h-4 w-4" /> {AUTOR.email}
            </a>
            <a
              href="https://github.com/davidgrados"
              rel="me noopener"
              target="_blank"
              className="flex items-center gap-1.5 hover:text-sky-700"
            >
              <Github className="h-4 w-4" /> github.com/davidgrados
            </a>
          </p>
        </div>
      </header>

      {/* Presentación */}
      <section className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-sky-700">
        <h2>Quién soy</h2>
        <p className="lead">{AUTOR.lema}</p>
        <p>
          Soy <strong>{AUTOR.nombre}</strong> y creé <strong>{SITE_NAME}</strong>, una plataforma
          educativa gratuita que nació en Comas con una idea sencilla: que el acceso a la tecnología
          no dependa del dinero ni del lugar donde vives. Allí enseño inteligencia artificial, Linux,
          inglés y seguridad informática con lecciones cortas, ejemplos reales y un laboratorio que
          funciona en el navegador.
        </p>
        <p>
          Escribo sobre <strong>inteligencia artificial en español</strong> porque casi todo el
          material serio está en inglés o lleno de tecnicismos. Mi trabajo consiste en traducir esas
          ideas a un lenguaje que cualquiera pueda seguir: qué es un modelo de lenguaje, por qué se
          equivoca con tanta seguridad, cómo pedirle algo para que la respuesta sirva de verdad.
        </p>

        <h2>En qué temas trabajo</h2>
        <ul>
          <li>
            <strong>Alfabetización en inteligencia artificial:</strong> llevar los conceptos básicos a
            estudiantes, familias y docentes sin formación técnica.
          </li>
          <li>
            <strong>Uso con criterio de la IA:</strong> redactar instrucciones claras, verificar
            respuestas y reconocer cuándo la herramienta no es la respuesta.
          </li>
          <li>
            <strong>Educación tecnológica gratuita:</strong> cursos abiertos, sin registro obligatorio
            y pensados para conexiones lentas.
          </li>
          <li>
            <strong>Linux y ciberseguridad:</strong> las bases técnicas que hoy se piden en casi
            cualquier trabajo relacionado con tecnología.
          </li>
        </ul>

        <h2>Proyectos</h2>
        <ul>
          <li>
            <strong>{SITE_NAME}:</strong> la plataforma de cursos gratuitos con laboratorio Linux
            simulado, exámenes y progreso guardado. Puedes ver los{' '}
            <Link href="/#cursos">cursos disponibles</Link>.
          </li>
          <li>
            <strong>Colliq, asistente de inglés con IA:</strong> práctica de conversación que escucha,
            corrige y responde con voz. Se puede probar en{' '}
            <Link href="/ingles/tutor">/ingles/tutor</Link>.
          </li>
          <li>
            <strong>Guías de inteligencia artificial:</strong> los artículos que escribo para
            explicar la IA sin humo. Están en la sección{' '}
            <Link href="/ia">Inteligencia artificial</Link>.
          </li>
        </ul>

        <h2>Cómo enseño</h2>
        <p>
          Empiezo siempre por lo concreto: un problema real, una herramienta que ya existe, una
          práctica que se puede repetir en casa. Después va la teoría, nunca al revés. Y hay una
          regla que repito en clase: <strong>si no puedes explicarlo con tus palabras, todavía no lo
          entendiste</strong>.
        </p>
        <p>
          También insisto en algo que la prisa por usar IA suele saltarse: <strong>verificar</strong>.
          Un modelo puede escribir tres párrafos impecables y equivocarse en el dato central. Enseñar
          a comprobarlo es tan importante como enseñar a pedirlo.
        </p>

        <h2>Contacto</h2>
        <p>
          Para consultas, talleres, colaboraciones o correcciones de algún artículo, escríbeme a{' '}
          <a href={`mailto:${AUTOR.email}`}>{AUTOR.email}</a>. Respondo personalmente.
        </p>
      </section>

      {/* Artículos del autor */}
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <BookOpen className="h-5 w-5 text-sky-600" />
          Artículos publicados
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {ARTICULOS.map((a) => (
            <Link
              key={a.slug}
              href={`/ia/${a.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                {a.tema}
              </span>
              <p className="mt-1 font-semibold text-slate-900">{a.titulo}</p>
              <p className="mt-1.5 text-sm text-slate-600">{a.resumen}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA a la plataforma */}
      <section className="flex flex-col items-start gap-4 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Aprende conmigo, gratis</h2>
            <p className="mt-1 text-slate-600">
              Linux, inglés, inteligencia artificial y seguridad, sin instalar nada.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/#cursos"
            className="rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-2.5 font-semibold text-white shadow-glow transition hover:brightness-105"
          >
            Ver cursos
          </Link>
          <Link
            href="/ia"
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <Terminal className="h-4 w-4" /> Guías de IA
          </Link>
        </div>
      </section>
    </div>
  );
}
