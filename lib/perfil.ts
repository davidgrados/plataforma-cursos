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
  sameAs: [
    'https://github.com/davidgrados',
    'https://github.com/davidgrados/plataforma-cursos',
  ],
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
