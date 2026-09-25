import type { MetadataRoute } from 'next';
import { getEnv } from '@/lib/cloudflare';

// Se genera en cada petición (necesita la base de datos para listar cursos y lecciones).
export const dynamic = 'force-dynamic';

const BASE = 'https://educatecomas.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ahora = new Date();

  const paginas: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: ahora, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/ingles/tutor`, lastModified: ahora, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/privacidad`, lastModified: ahora, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terminos`, lastModified: ahora, changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    const env = await getEnv();

    const cursos = await env.DB.prepare('SELECT slug FROM courses ORDER BY created_at DESC').all();
    const paginasCursos: MetadataRoute.Sitemap = (cursos.results as { slug: string }[]).map((c) => ({
      url: `${BASE}/course/${c.slug}`,
      lastModified: ahora,
      changeFrequency: 'monthly',
      priority: 0.9,
    }));

    const lecciones = await env.DB.prepare('SELECT id FROM lessons ORDER BY id ASC').all();
    const paginasLecciones: MetadataRoute.Sitemap = (lecciones.results as { id: number }[]).map((l) => ({
      url: `${BASE}/lesson/${l.id}`,
      lastModified: ahora,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...paginas, ...paginasCursos, ...paginasLecciones];
  } catch {
    // Si la base de datos no responde, devolvemos al menos las páginas principales.
    return paginas;
  }
}
