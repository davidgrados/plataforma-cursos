import type { MetadataRoute } from 'next';
import { getEnv } from '@/lib/cloudflare';
import { SITE_URL } from '@/lib/seo';

// Se genera en cada petición (necesita la base de datos para listar los cursos).
export const dynamic = 'force-dynamic';

/**
 * Mapa del sitio: la lista de direcciones que le decimos a Google que visite.
 *
 * Solo se incluyen páginas que muestran su contenido completo sin iniciar
 * sesión (portada, cada curso, el asistente de inglés y las páginas legales).
 * Las lecciones se quedan fuera a propósito: su contenido se carga en el
 * navegador y exige sesión, así que indexarlas solo aportaría páginas vacías.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ahora = new Date();

  const paginas: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: ahora, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${SITE_URL}/ingles/tutor`,
      lastModified: ahora,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    { url: `${SITE_URL}/privacidad`, lastModified: ahora, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terminos`, lastModified: ahora, changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    const env = await getEnv();

    const cursos = await env.DB.prepare(
      'SELECT slug, created_at FROM courses ORDER BY created_at DESC',
    ).all();

    const paginasCursos: MetadataRoute.Sitemap = (cursos.results as {
      slug: string;
      created_at: string | null;
    }[]).map((c) => ({
      url: `${SITE_URL}/course/${c.slug}`,
      lastModified: c.created_at ? new Date(c.created_at) : ahora,
      changeFrequency: 'monthly',
      priority: 0.9,
    }));

    return [...paginas, ...paginasCursos];
  } catch {
    // Si la base de datos no responde, devolvemos al menos las páginas principales.
    return paginas;
  }
}
