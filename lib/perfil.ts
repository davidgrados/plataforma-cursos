// ============================================================
//  Ficha del autor (marca personal).
//
//  Todo lo que hay aquí se publica en /sobre-mi, en la firma de
//  cada artículo y en los datos estructurados (Person) que leen
//  Google y Bing. Es el ÚNICO sitio que hay que editar cuando
//  cambien los datos: no repetir el nombre a mano en las páginas.
//
//  IMPORTANTE (honestidad): solo se afirman cosas comprobables.
//  Si algún día hay un título, una ponencia o una publicación,
//  se añade aquí y aparece en toda la web automáticamente.
// ============================================================

/**
 * Perfiles externos del autor.
 *
 * `sameAs` en los datos estructurados es la forma que tiene Google de
 * comprobar que la persona de esta web es la misma que aparece en otras
 * plataformas. Cuantos más perfiles reales y coherentes, más fácil es que
 * construya la ficha de conocimiento (Knowledge Panel) con el nombre.
 *
 * Al añadir una red nueva: se agrega aquí y aparece sola en /sobre-mi,
 * en el pie y en el JSON-LD. Usar siempre la dirección limpia, sin los
 * parámetros de seguimiento que copia la app.
 */
export const REDES = [
  {
    nombre: 'TikTok',
    usuario: '@davidgradosa',
    url: 'https://www.tiktok.com/@davidgradosa',
    icono: 'tiktok',
  },
  {
    nombre: 'GitHub',
    usuario: 'davidgrados',
    url: 'https://github.com/davidgrados',
    icono: 'github',
  },
] as const;

export const AUTOR = {
  nombre: 'David Grados Alzamora',
  /** Cómo se le nombra en los textos largos. */
  nombreCorto: 'David Grados',
  rol: 'Fundador de Edúcate Comas · divulgación de inteligencia artificial',
  /** Frase de una línea: la que se ve bajo el nombre. */
  lema: 'Enseño inteligencia artificial en palabras simples, desde Comas para todo el Perú.',
  email: 'davidgradosa@hotmail.com',
  ciudad: 'Comas, Lima',
  pais: 'Perú',
  /** Enlaces que confirman que la persona existe fuera de esta web. */
  sameAs: REDES.map((r) => r.url) as string[],
  /**
   * Temas por los que se quiere ser referente. Google usa esta lista
   * (`knowsAbout`) para entender de qué habla la persona.
   */
  temas: [
    'Inteligencia artificial',
    'Aprendizaje automático',
    'Modelos de lenguaje grandes (LLM)',
    'Ingeniería de prompts',
    'Alfabetización digital',
    'Linux',
    'Ciberseguridad',
    'Educación tecnológica gratuita',
  ],
} as const;

/** Biografía corta (la que aparece en la firma de los artículos). */
export const BIO_CORTA =
  'David Grados Alzamora es el fundador de Edúcate Comas, una plataforma educativa gratuita desde la que enseña inteligencia artificial, Linux y seguridad informática a la comunidad de Comas, Lima (Perú).';
