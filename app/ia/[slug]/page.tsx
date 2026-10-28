import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, Clock, User } from 'lucide-react';
import { ARTICULOS, getArticulo } from '@/lib/ia/articulos';
import { AUTOR, BIO_CORTA } from '@/lib/perfil';
import { SITE_NAME, absoluteUrl, breadcrumbJsonLd } from '@/lib/seo';

// Los tres artículos se generan como HTML estático: llegan completos y rápidos
// a Google y al visitante.
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICULOS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const articulo = getArticulo(slug);
  if (!articulo) return { title: 'Artículo no encontrado', robots: { index: false } };

  const path = `/ia/${articulo.slug}`;
  return {
    title: articulo.titulo,
    description: articulo.descripcion,
    keywords: [...articulo.palabrasClave, AUTOR.nombre, 'inteligencia artificial'],
    authors: [{ name: AUTOR.nombre }],
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      locale: 'es_PE',
      url: absoluteUrl(path),
      title: `${articulo.titulo} | ${SITE_NAME}`,
      description: articulo.descripcion,
      publishedTime: articulo.fecha,
      authors: [AUTOR.nombre],
      images: [{ url: absoluteUrl('/og-image.png'), width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${articulo.titulo} | ${SITE_NAME}`,
      description: articulo.descripcion,
      images: [absoluteUrl('/og-image.png')],
    },
  };
}

const FECHA_LARGA = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default async function ArticuloIaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articulo = getArticulo(slug);
  if (!articulo) notFound();

  const path = `/ia/${articulo.slug}`;
  const url = absoluteUrl(path);
  const personaId = `${absoluteUrl('/sobre-mi')}#persona`;
  const Contenido = articulo.Contenido;
  const otros = ARTICULOS.filter((a) => a.slug !== articulo.slug);

  return (
    <div className="animate-fade-up flex flex-col gap-8">
      {/*
        Artículo firmado (datos estructurados Article + author Person).
        Es la pieza que permite que Google asocie el texto con su autor y
        construya la ficha de «David Grados Alzamora» como referente del tema.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              '@id': `${url}#articulo`,
              headline: articulo.titulo,
              description: articulo.descripcion,
              inLanguage: 'es-PE',
              datePublished: articulo.fecha,
              dateModified: articulo.fecha,
              articleSection: articulo.tema,
              keywords: articulo.palabrasClave.join(', '),
              author: {
                '@type': 'Person',
                '@id': personaId,
                name: AUTOR.nombre,
                url: absoluteUrl('/sobre-mi'),
                email: AUTOR.email,
                jobTitle: AUTOR.rol,
              },
              publisher: {
                '@type': 'EducationalOrganization',
                name: SITE_NAME,
                url: absoluteUrl('/'),
                logo: {
                  '@type': 'ImageObject',
                  url: absoluteUrl('/icons/icon-512.png'),
                },
              },
              mainEntityOfPage: { '@type': 'WebPage', '@id': url },
              isAccessibleForFree: true,
            },
            breadcrumbJsonLd([
              { name: 'Inicio', path: '/' },
              { name: 'Inteligencia artificial', path: '/ia' },
              { name: articulo.titulo, path },
            ]),
          ]),
        }}
      />

      <nav aria-label="Migas de pan" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-sky-700">
              Inicio
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li>
            <Link href="/ia" className="hover:text-sky-700">
              Inteligencia artificial
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li className="text-slate-700">{articulo.tema}</li>
        </ol>
      </nav>

      <article className="flex flex-col gap-6">
        <header className="flex flex-col gap-3">
          <span className="w-fit rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            {articulo.tema}
          </span>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            {articulo.titulo}
          </h1>
          <p className="text-slate-600">{articulo.descripcion}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-slate-200 py-3 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <Link href="/sobre-mi" className="font-medium text-slate-700 hover:text-sky-700">
                {AUTOR.nombre}
              </Link>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <time dateTime={articulo.fecha}>
                {FECHA_LARGA.format(new Date(`${articulo.fecha}T12:00:00Z`))}
              </time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {articulo.lectura} min de lectura
            </span>
          </div>
        </header>

        <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-sky-700 prose-li:my-1">
          <Contenido />
        </div>

        {/* Firma del autor: enlaza al perfil y refuerza la autoría. */}
        <footer className="mt-2 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-xl font-bold text-white">
            DG
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Escrito por</p>
            <Link href="/sobre-mi" className="text-lg font-semibold text-slate-900 hover:text-sky-700">
              {AUTOR.nombre}
            </Link>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{BIO_CORTA}</p>
          </div>
        </footer>
      </article>

      {/* Siguientes lecturas: enlazado interno entre guías del mismo tema. */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900">Sigue leyendo</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {otros.map((o) => (
            <Link
              key={o.slug}
              href={`/ia/${o.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm transition hover:border-sky-300 hover:shadow-md"
            >
              <span className="font-semibold text-slate-900">{o.titulo}</span>
              <p className="mt-1.5 text-slate-600">{o.resumen}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
