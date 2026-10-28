import type { Metadata } from 'next';
import { getEnv } from '@/lib/cloudflare';
import { breadcrumbJsonLd, courseJsonLd, metaDescription, absoluteUrl, SITE_NAME } from '@/lib/seo';

/**
 * Ficha del curso leída directamente en la base de datos (en el servidor).
 *
 * La página del curso se pinta en el navegador, así que este layout es el
 * encargado de darle a Google un título, una descripción y unos datos
 * estructurados propios: sin esto, los siete cursos compartían el mismo
 * título genérico y no se distinguían entre sí en los resultados.
 */
type CursoSeo = {
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

async function leerCurso(slug: string): Promise<CursoSeo | null> {
  try {
    const env = await getEnv();
    return (await env.DB.prepare(
      'SELECT title, slug, description, image_url FROM courses WHERE slug = ?',
    )
      .bind(slug)
      .first()) as CursoSeo | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const curso = await leerCurso(slug);
  const path = `/course/${slug}`;

  if (!curso) {
    return {
      title: 'Curso',
      alternates: { canonical: path },
      robots: { index: false, follow: true },
    };
  }

  const titulo = `Curso de ${curso.title}`;
  const descripcion = metaDescription(
    curso.description ||
      `Curso gratuito de ${curso.title} en ${SITE_NAME}: contenido interactivo, prácticas, exámenes y progreso guardado. Aprende a tu ritmo desde cualquier dispositivo.`,
  );
  const imagen = curso.image_url ? absoluteUrl(curso.image_url) : absoluteUrl('/og-image.png');

  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      locale: 'es_PE',
      url: absoluteUrl(path),
      title: `${titulo} | ${SITE_NAME}`,
      description: descripcion,
      images: [{ url: imagen, alt: curso.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${titulo} | ${SITE_NAME}`,
      description: descripcion,
      images: [imagen],
    },
  };
}

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const curso = await leerCurso(slug);

  return (
    <>
      {curso && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              courseJsonLd(curso),
              breadcrumbJsonLd([
                { name: 'Inicio', path: '/' },
                { name: 'Cursos', path: '/#cursos' },
                { name: curso.title, path: `/course/${curso.slug}` },
              ]),
            ]),
          }}
        />
      )}
      {children}
    </>
  );
}
