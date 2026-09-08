// ============================================================
//  Seed del curso "Marketing Digital y Redes Sociales" (añade a la BD).
//  Genera seed-marketing.sql y lo aplica a D1 (local o remoto).
// ============================================================

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SLUG = 'marketing-digital';
const SIMPLE_FS = JSON.stringify({ home: { student: {} } });

function sqlStr(v: string | null | undefined): string {
  if (v === null || v === undefined) return 'NULL';
  return "'" + v.replace(/'/g, "''") + "'";
}

interface SLesson {
  slug: string;
  title: string;
  type: 'chapter' | 'practice' | 'exam';
  content_md: string;
  order_num: number;
}
interface SModule {
  title: string;
  order_num: number;
  lessons: SLesson[];
}

const chapter = (slug: string, title: string, content: string): SLesson => ({
  slug,
  title,
  type: 'chapter',
  content_md: content,
  order_num: 1,
});

const M1 = `# Módulo 1 · Introducción al marketing digital

El **marketing digital** promueve productos o servicios a través de medios digitales: redes sociales, buscadores, correo y web.

## ¿Qué es el marketing digital?

Conjunto de estrategias para **conectar con tu audiencia** y lograr objetivos (vender, dar a conocer, fidelizar) usando canales en línea.

## Canales principales

- **Redes sociales** (Instagram, Facebook, TikTok, LinkedIn).
- **Buscadores** (SEO y publicidad en Google).
- **Email marketing**.
- **Página web y blog**.
- **YouTube y vídeo**.

## Ventajas

- Mide todo (alcance, clics, ventas).
- Segmenta a tu público.
- Resultados en tiempo real.
- Menor coste que el marketing tradicional.

## Diferencias con el marketing tradicional

- Tradicional: medios masivos (TV, radio, prensa).
- Digital: segmentado, medible e interactivo.

> El marketing digital no es solo publicar: es **estrategia basada en datos**.`;

const M2 = `# Módulo 2 · Estrategia, objetivos y público

Antes de publicar, define hacia dónde vas y para quién.

## Define tus objetivos (SMART)

- **Específicos, Medibles, Alcanzables, Relevantes y con Tiempo.**
- Ej.: "conseguir 500 seguidores en 3 meses" o "10 ventas al mes".

## Público objetivo (buyer persona)

Perfil ideal de tu cliente con datos demográficos, intereses y problemas:
- Edad, ubicación, género.
- Intereses y aficiones.
- Qué problema le resuelves.
- Dónde pasa su tiempo online.

## Análisis FODA / DAFO

Evalúa **Fortalezas, Oportunidades, Debilidades y Amenazas** para decidir tu estrategia.

## Propuesta de valor

¿Qué te hace diferente y por qué deberían elegirte? Debe quedar clara en todo tu contenido.

> Si no sabes a quién te diriges, tu mensaje no llega a nadie.`;

const M3 = `# Módulo 3 · Marca y posicionamiento

Tu **marca** es cómo te perciben. Construirla genera confianza y recuerdo.

## Elementos de la marca

- **Nombre y logo.**
- **Colores y tipografía.**
- **Tono de voz** (cómo hablas a tu audiencia).
- **Misión y valores.**

## Posicionamiento

Es el lugar que ocupas en la mente del cliente:
- ¿Te conocen como el barato, el de calidad, el innovador?
- Define un posicionamiento claro y consistente.

## Coherencia

Publica con un estilo reconocible y un mensaje constante en todos los canales. La repetición construye marca.

## Diferenciación

Destaca **qué te hace único** frente a la competencia para que te elijan.

> La marca es lo que la gente dice de ti cuando no estás en la sala.`;

const M4 = `# Módulo 4 · Redes sociales

Cada red tiene su lenguaje y su público. Elige las que mejor se adapten a tu objetivo.

## Principales plataformas

- **Instagram:** visual, jóvenes y compras (Reels, Stories).
- **Facebook:** audiencias amplias y comunidades.
- **TikTok:** vídeo corto y entretenido, alcance orgánico alto.
- **LinkedIn:** profesional, B2B y marca personal.
- **X (Twitter):** noticias y conversación en tiempo real.
- **YouTube:** contenido educativo y de mayor duración.

## Qué publicar

- Contenido que **eduque, entretenga o inspire**.
- Historias reales y detrás de cámaras.
- Ofertas y llamadas a la acción.
- Responde comentarios y mensajes.

## Constancia

- Publica con **regularidad** (calidad > cantidad).
- Interactúa con tu comunidad, no solo publiques.

> No necesitas estar en todas las redes: domina 2 o 3 donde esté tu público.`;

const M5 = `# Módulo 5 · Contenido y storytelling

El contenido es el motor del marketing digital. Un buen relato conecta emocionalmente.

## Tipos de contenido

- **Educativo:** tutoriales, consejos, guías.
- **Entretenimiento:** memes, humor, dinámicas.
- **Inspirador:** historias de éxito, casos reales.
- **Promocional:** ofertas y novedades (en menor medida).

## Storytelling (contar historias)

- Plantea un **conflicto o reto** que tu audiencia reconozca.
- Muestra cómo se **resuelve**.
- Termina con un **mensaje** o llamada a la acción.

## Calendario editorial

Planifica qué publicar y cuándo:
- Define temas por semana.
- Crea contenido por adelantado.
- Usa herramientas de programación.

## Formatos que funcionan

- Vídeo corto, imágenes con texto, carruseles, plantillas.

> El mejor contenido resuelve un problema o cuenta una historia que tu público siente como propia.`;

const M6 = `# Módulo 6 · Publicidad digital (anuncios)

La publicidad de pago acelera resultados y permite llegar a audiencias específicas.

## Modelos de pago

- **CPC:** pagas por clic.
- **CPM:** pagas por cada mil impresiones.
- **CPA:** pagas por acción (venta, registro).

## Plataformas de anuncios

- **Meta Ads** (Instagram y Facebook).
- **Google Ads** (búsqueda y display).
- **TikTok Ads**, **LinkedIn Ads**, **X Ads**.

## Segmentación

Define quién ve tu anuncio: edad, ubicación, intereses, comportamientos y *remarketing* (personas que ya te visitaron).

## Anuncio eficaz

- Imagen o vídeo llamativo.
- Texto breve y claro.
- Una sola **llamada a la acción**.
- Prueba (A/B) para mejorar.

> Empieza con presupuestos pequeños, mide y escala lo que funcione.`;

const M7 = `# Módulo 7 · Email marketing y embudos de ventas

El correo sigue siendo uno de los canales con mejor retorno.

## Email marketing

- Permite comunicarte directo con quienes te dieron permiso.
- Nutre la relación y fideliza.
- Automatizable.

## Buenas prácticas de email

- **Permiso:** solo a quien se suscribió (anti-spam).
- Asunto claro y atractivo.
- Contenido de valor + llamada a la acción.
- Segmenta tu lista (por interés o comportamiento).

## Embudo de ventas (funnel)

- **Top (atraer):** contenido para captar interés.
- **Middle (nutrir):** educar y generar confianza.
- **Bottom (convertir):** ofrecer y cerrar la venta.

## Herramientas

Plataformas de email y automatización (newsletter, correos de bienvenida, carritos abandonados).

> Construye una lista propia: no dependes de los algoritmos de las redes.`;

const M8 = `# Módulo 8 · Métricas, análisis y SEO

Mide para saber qué funciona y mejora continuamente.

## Métricas clave (KPIs)

- **Alcance e impresiones:** cuántos te vieron.
- **Interacción:** likes, comentarios, compartidos.
- **Clics y CTR:** cuántos hicieron clic.
- **Conversión:** ventas, registros, descargas.
- **ROI:** retorno de la inversión.

## Análisis

- Revisa qué contenido rinde mejor y replica lo que funciona.
- Haz **pruebas A/B**.
- Usa las analíticas de cada plataforma.

## SEO básico

Optimizar para buscadores (Google):
- **Palabras clave:** términos que busca tu audiencia.
- Contenido de calidad y original.
- Etiquetas de título, descripciones e imágenes.
- Página rápida y adaptable al móvil.
- Enlaces internos y externos.

> Sin medición, estás adivinando. Con datos, mejoras cada mes.`;

const EXAM = `# Examen Final · Marketing Digital y Redes Sociales

Responde el examen de opción múltiple para comprobar lo aprendido.`;

const MODULES: SModule[] = [
  { title: 'Módulo 1 · Introducción al marketing digital', order_num: 1, lessons: [chapter('mkt-01', 'Introducción al marketing digital', M1)] },
  { title: 'Módulo 2 · Estrategia, objetivos y público', order_num: 2, lessons: [chapter('mkt-02', 'Estrategia, objetivos y público', M2)] },
  { title: 'Módulo 3 · Marca y posicionamiento', order_num: 3, lessons: [chapter('mkt-03', 'Marca y posicionamiento', M3)] },
  { title: 'Módulo 4 · Redes sociales', order_num: 4, lessons: [chapter('mkt-04', 'Redes sociales', M4)] },
  { title: 'Módulo 5 · Contenido y storytelling', order_num: 5, lessons: [chapter('mkt-05', 'Contenido y storytelling', M5)] },
  { title: 'Módulo 6 · Publicidad digital', order_num: 6, lessons: [chapter('mkt-06', 'Publicidad digital (anuncios)', M6)] },
  { title: 'Módulo 7 · Email marketing y embudos', order_num: 7, lessons: [chapter('mkt-07', 'Email marketing y embudos de ventas', M7)] },
  { title: 'Módulo 8 · Métricas, análisis y SEO', order_num: 8, lessons: [chapter('mkt-08', 'Métricas, análisis y SEO', M8)] },
  {
    title: 'Examen Final',
    order_num: 9,
    lessons: [{ slug: 'mkt-examen-final', title: 'Examen Final de Marketing Digital', type: 'exam', content_md: EXAM, order_num: 1 }],
  },
];

const statements: string[] = [];
statements.push(`DELETE FROM courses WHERE slug = '${SLUG}';`);
statements.push(
  `INSERT INTO courses (slug, title, description) VALUES (${sqlStr(SLUG)}, 'Marketing Digital y Redes Sociales', 'Aprende estrategia, marca, contenido, publicidad, email marketing, métricas y SEO para crecer en el mundo digital.');`,
);
const courseExpr = `(SELECT id FROM courses WHERE slug = '${SLUG}')`;
for (const m of MODULES) {
  statements.push(`INSERT INTO modules (course_id, title, order_num) VALUES (${courseExpr}, ${sqlStr(m.title)}, ${m.order_num});`);
  const modExpr = `(SELECT id FROM modules WHERE course_id = ${courseExpr} AND title = ${sqlStr(m.title)})`;
  for (const l of m.lessons) {
    statements.push(
      `INSERT INTO lessons (slug, module_id, title, type, content_md, initial_fs, check_logic, order_num) VALUES (${sqlStr(l.slug)}, ${modExpr}, ${sqlStr(l.title)}, ${sqlStr(l.type)}, ${sqlStr(l.content_md)}, '${SIMPLE_FS}', NULL, ${l.order_num});`,
    );
  }
}

const sql = statements.join('\n\n') + '\n';
const out = resolve(process.cwd(), 'seed-marketing.sql');
writeFileSync(out, sql, 'utf8');
console.log('Generado:', out);
console.log('Módulos:', MODULES.length, '| Lecciones:', MODULES.reduce((a, m) => a + m.lessons.length, 0));
