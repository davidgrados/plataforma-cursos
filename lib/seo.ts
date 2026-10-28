// ============================================================
//  Datos de marca y SEO compartidos por todo el sitio.
//
//  Se centralizan aquí para que el título, la descripción, la
//  imagen de vista previa y los datos estructurados (JSON-LD que
//  leen Google y Bing) digan siempre lo mismo en todas las páginas.
// ============================================================

/** Dirección oficial y única del sitio (sin "www"). */
export const SITE_URL = 'https://educatecomas.com';

export const SITE_NAME = 'Edúcate Comas';

/** Frase corta que acompaña a la marca en las vistas previas. */
export const SITE_TAGLINE = 'Cursos gratis de Linux, inglés, IA y seguridad';

/** Descripción larga (150–160 caracteres es lo ideal para Google). */
export const SITE_DESCRIPTION =
  'Cursos interactivos gratis de Linux, inglés, inteligencia artificial y seguridad informática, con laboratorio y exámenes en el navegador. Aprende a tu ritmo desde Comas, Lima (Perú).';

/** Imagen de vista previa al compartir el enlace (1200 × 630). */
export const SITE_OG_IMAGE = '/og-image.png';

/** Titular y responsable del tratamiento de datos. */
export const OWNER = {
  name: 'David Grados Alzamora',
  email: 'davidgradosa@hotmail.com',
  role: 'Fundador y responsable de Edúcate Comas',
} as const;

/** Palabras clave con las que una persona buscaría estos cursos. */
export const SITE_KEYWORDS = [
  'cursos gratis en línea',
  'cursos de Linux',
  'curso de inglés básico',
  'curso de inteligencia artificial',
  'curso de seguridad informática',
  'curso de ciberseguridad',
  'curso de informática forense',
  'curso de marketing digital',
  'aprender Linux desde cero',
  'cursos virtuales Perú',
  'cursos gratis Comas Lima',
  'terminal Linux en el navegador',
  'Edúcate Comas',
];

/** Convierte una ruta interna en una dirección absoluta. */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Recorta un texto para usarlo como descripción (máx. ~160 caracteres). */
export function metaDescription(text: string | null | undefined, max = 158): string {
  const limpio = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!limpio) return SITE_DESCRIPTION;
  if (limpio.length <= max) return limpio;
  const corte = limpio.slice(0, max);
  const ultimoEspacio = corte.lastIndexOf(' ');
  return `${(ultimoEspacio > 80 ? corte.slice(0, ultimoEspacio) : corte).trim()}…`;
}

/**
 * Ficha de la organización (la lee Google para el panel de marca:
 * nombre, logo, fundador, correo de contacto y zona de servicio).
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE_URL}/#organizacion`,
    name: SITE_NAME,
    alternateName: 'Edúcate Comas · cursos interactivos',
    url: SITE_URL,
    logo: absoluteUrl('/icons/icon-512.png'),
    image: absoluteUrl(SITE_OG_IMAGE),
    description: SITE_DESCRIPTION,
    email: OWNER.email,
    foundingDate: '2026',
    founder: {
      '@type': 'Person',
      // El mismo @id que usa /sobre-mi: así Google entiende que el fundador
      // de la plataforma y el autor de los artículos son la misma persona.
      '@id': `${SITE_URL}/sobre-mi#persona`,
      name: OWNER.name,
      url: absoluteUrl('/sobre-mi'),
      email: OWNER.email,
      jobTitle: OWNER.role,
      knowsAbout: [
        'Inteligencia artificial',
        'Aprendizaje automático',
        'Modelos de lenguaje grandes (LLM)',
      ],
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Comas',
      addressRegion: 'Lima',
      addressCountry: 'PE',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Perú',
    },
    knowsLanguage: ['es', 'en'],
    sameAs: ['https://github.com/davidgrados'],
  };
}

/** Ficha del sitio (nombre, idioma y buscador interno). */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#sitio`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'es-PE',
    publisher: { '@id': `${SITE_URL}/#organizacion` },
  };
}

/** Ficha de un curso concreto (aparece en los resultados enriquecidos). */
export function courseJsonLd(curso: {
  title: string;
  slug: string;
  description?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${absoluteUrl(`/course/${curso.slug}`)}#curso`,
    name: curso.title,
    description: metaDescription(curso.description, 300),
    url: absoluteUrl(`/course/${curso.slug}`),
    inLanguage: 'es',
    isAccessibleForFree: true,
    provider: { '@id': `${SITE_URL}/#organizacion` },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT6H',
      location: { '@type': 'VirtualLocation', url: absoluteUrl(`/course/${curso.slug}`) },
    },
  };
}

/** Miga de pan de una página (Google la muestra bajo el enlace). */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
