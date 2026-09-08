// ============================================================
//  Seed del curso "Inteligencia Artificial Básica" (añade a la BD).
//  Genera seed-ai.sql y lo aplica a D1 (local o remoto).
// ============================================================

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SLUG = 'inteligencia-artificial';
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

const M1 = `# Módulo 1 · Introducción a la Inteligencia Artificial

La **Inteligencia Artificial (IA)** es la capacidad de las máquinas para realizar tareas que normalmente requieren inteligencia humana: reconocer imágenes, entender lenguaje, tomar decisiones, etc.

## ¿Qué es la IA?

- Rama de la informática que busca crear **sistemas que aprenden y razonan**.
- No es magia: son **algoritmos** y **datos**.

## Tipos de IA

- **IA débil (estrecha):** especializada en una tarea (asistentes, buscadores).
- **IA fuerte (general):** capacidad similar a la humana en muchas tareas (aún en desarrollo).
- **Superinteligencia:** hipotética, superior a la humana.

## Conceptos clave

- **Datos:** la materia prima; sin datos no hay IA útil.
- **Modelo:** el resultado del entrenamiento que hace predicciones.
- **Entrenamiento:** proceso de ajustar el modelo con ejemplos.

> La IA ya está en tu día a día: traducción automática, recomendaciones, filtros de spam y asistentes de voz.`;

const M2 = `# Módulo 2 · Historia y aplicaciones de la IA

## Breve historia

- **1950:** Alan Turing propone el "test de Turing" para evaluar la inteligencia de una máquina.
- **1956:** nace el término "Inteligencia Artificial" en la conferencia de Dartmouth.
- **1997:** la computadora Deep Blue vence al campeón mundial de ajedrez.
- **2012:** el aprendizaje profundo revoluciona la visión por computadora.
- **2020s:** irrupción de la **IA generativa** (modelos de lenguaje).

## Aplicaciones actuales

- **Salud:** diagnóstico por imagen, descubrimiento de fármacos.
- **Transporte:** coches autónomos, predicción de tráfico.
- **Finanzas:** detección de fraude, análisis de riesgo.
- **Educación:** tutores adaptativos, traducción.
- **Entretenimiento:** recomendaciones, creación de contenido.

## Campos de la IA

- **Machine Learning** (aprendizaje automático)
- **Deep Learning** (aprendizaje profundo)
- **NLP** (procesamiento del lenguaje)
- **Visión por computadora**
- **Robótica**

> La IA es una tecnología de propósito general: transforma muchas industrias a la vez.`;

const M3 = `# Módulo 3 · Aprendizaje automático (Machine Learning)

El **Machine Learning (ML)** permite que una máquina aprenda de datos **sin programarla explícitamente** para cada caso.

## Idea principal

En lugar de escribir reglas, el modelo **descubre patrones** a partir de ejemplos.

## Tipos de aprendizaje

- **Supervisado:** aprendes con ejemplos etiquetados (foto + "gato").
  - **Clasificación:** asignar una categoría (spam / no spam).
  - **Regresión:** predecir un número (precio de una casa).
- **No supervisado:** encuentra patrones sin etiquetas (agrupar clientes).
- **Por refuerzo:** aprende por ensayo y error con recompensas (juegos, robots).

## Flujo típico

1. Recopilar y limpiar **datos**.
2. Elegir un **modelo**.
3. **Entrenar** con parte de los datos.
4. **Evaluar** con datos nuevos.
5. **Implementar** y mantener.

## Conceptos clave

- **Dataset:** conjunto de datos.
- **Etiqueta:** la respuesta correcta en aprendizaje supervisado.
- **Overfitting:** el modelo memoriza en lugar de generalizar.
- **Precisión:** porcentaje de aciertos.

> El ML está detrás de las recomendaciones, el reconocimiento facial y muchos asistentes.`;

const M4 = `# Módulo 4 · Redes neuronales y Deep Learning

## ¿Qué es una red neuronal?

Una **red neuronal artificial** imita (de forma simplificada) cómo se conectan las neuronas del cerebro.

- **Neuronas (nodos):** unidades que reciben, procesan y transmiten información.
- **Capas:** grupos de neuronas (entrada, ocultas, salida).
- **Pesos:** números que indican la importancia de cada conexión.

## Deep Learning (aprendizaje profundo)

Es el **Machine Learning con redes de muchas capas**. Cuantas más capas, más patrones complejos puede aprender.

## ¿Por qué ahora?

- **Datos masivos** disponibles.
- **GPU** que aceleran el cálculo.
- Mejores **algoritmos**.

## Ejemplos

- Reconocer objetos en fotos.
- Traducir entre idiomas.
- Generar texto e imágenes.

## Conceptos clave

- **Función de activación:** introduce no linealidad.
- **Backpropagation:** método para ajustar los pesos.
- **Época:** una pasada completa por los datos de entrenamiento.

> El Deep Learning es la base de los grandes avances recientes de la IA.`;

const M5 = `# Módulo 5 · Procesamiento del Lenguaje Natural (NLP)

El **NLP** permite a las máquinas entender, interpretar y generar lenguaje humano.

## Tareas del NLP

- **Traducción automática:** de un idioma a otro.
- **Análisis de sentimiento:** saber si un texto es positivo o negativo.
- **Resumen de texto:** extraer lo esencial.
- **Chatbots y asistentes:** responder conversaciones.
- **Reconocimiento de voz:** convertir audio en texto.

## Conceptos clave

- **Token:** unidad de texto (palabra o parte de ella).
- **Embeddings:** representación numérica de palabras para que la máquina las entienda.
- **Modelo de lenguaje:** sistema que predice la siguiente palabra en un texto.

## Ejemplos reales

- Correctores y autocompletado.
- Búsqueda por voz.
- Asistentes como Siri, Alexa o Google Assistant.

> Entender el lenguaje es uno de los retos más difíciles, porque depende del contexto y de la ambigüedad.`;

const M6 = `# Módulo 6 · Visión por computadora

La **visión por computadora** permite a las máquinas "ver" e interpretar imágenes y vídeo.

## Tareas

- **Clasificación de imágenes:** ¿qué hay en la foto?
- **Detección de objetos:** localizar y nombrar objetos.
- **Segmentación:** separar las regiones de una imagen.
- **Reconocimiento facial:** identificar personas.

## Cómo funciona

1. La imagen se convierte en **píxeles** (números).
2. Las **redes neuronales convolucionales (CNN)** detectan patrones (bordes, formas, objetos).
3. El modelo clasifica lo que ve.

## Aplicaciones

- Diagnóstico médico por imagen.
- Coches autónomos (detectar peatones y señales).
- Control de calidad en fábricas.
- Filtros y edición de fotos.

> Para la IA, una imagen no es "una foto": es una **matriz de números** que la red interpreta.`;

const M7 = `# Módulo 7 · IA generativa

La **IA generativa** crea contenido nuevo: texto, imágenes, audio, código o vídeo, a partir de instrucciones.

## Cómo funciona

Se entrena con **enormes cantidades de datos** para aprender patrones, y luego **genera** contenido similar pero nuevo.

## Ejemplos

- **Texto:** ChatGPT, Gemini, Claude.
- **Imágenes:** DALL·E, Midjourney, Stable Diffusion.
- **Audio:** voces y música generadas.
- **Código:** asistentes de programación.

## Conceptos clave

- **Prompt:** la instrucción que le das al modelo.
- **Modelo de lenguaje grande (LLM):** entrenado con textos masivos.
- **Alucinación:** cuando el modelo inventa información falsa con seguridad.

## Uso responsable

- Verifica siempre la información generada.
- No compartas datos personales sensibles.
- Revisa los derechos de autor del contenido creado.

> La IA generativa democratiza la creación, pero requiere **pensamiento crítico** de quien la usa.`;

const M8 = `# Módulo 8 · Ética, riesgos y futuro de la IA

## Beneficios

- Automatización de tareas repetitivas.
- Avances en salud, ciencia y accesibilidad.
- Análisis de grandes volúmenes de datos.

## Riesgos y desafíos

- **Sesgo:** los modelos aprenden de datos sesgados y pueden discriminar.
- **Privacidad:** uso indebido de datos personales.
- **Desinformación:** deepfakes y contenido falso.
- **Empleo:** automatización de algunos trabajos.
- **Seguridad:** usos malintencionados.

## Principios de una IA responsable

- **Transparencia:** que se entienda cómo y por qué decide.
- **Equidad:** sin discriminación.
- **Privacidad y seguridad** de los datos.
- **Control humano:** decisiones importantes supervisadas por personas.

## Futuro

- IA explicable y de confianza.
- Integración en todos los ámbitos.
- Debates globales sobre regulación.

> El futuro de la IA depende tanto de la **tecnología** como de la **ética** con la que la usemos.`;

const EXAM = `# Examen Final · Inteligencia Artificial Básica

Responde el examen de opción múltiple para comprobar lo aprendido.`;

const MODULES: SModule[] = [
  { title: 'Módulo 1 · Introducción a la IA', order_num: 1, lessons: [chapter('ia-01', 'Introducción a la Inteligencia Artificial', M1)] },
  { title: 'Módulo 2 · Historia y aplicaciones', order_num: 2, lessons: [chapter('ia-02', 'Historia y aplicaciones de la IA', M2)] },
  { title: 'Módulo 3 · Machine Learning', order_num: 3, lessons: [chapter('ia-03', 'Aprendizaje automático (Machine Learning)', M3)] },
  { title: 'Módulo 4 · Redes neuronales y Deep Learning', order_num: 4, lessons: [chapter('ia-04', 'Redes neuronales y Deep Learning', M4)] },
  { title: 'Módulo 5 · Procesamiento del Lenguaje Natural', order_num: 5, lessons: [chapter('ia-05', 'Procesamiento del Lenguaje Natural (NLP)', M5)] },
  { title: 'Módulo 6 · Visión por computadora', order_num: 6, lessons: [chapter('ia-06', 'Visión por computadora', M6)] },
  { title: 'Módulo 7 · IA generativa', order_num: 7, lessons: [chapter('ia-07', 'IA generativa', M7)] },
  { title: 'Módulo 8 · Ética, riesgos y futuro', order_num: 8, lessons: [chapter('ia-08', 'Ética, riesgos y futuro de la IA', M8)] },
  {
    title: 'Examen Final',
    order_num: 9,
    lessons: [{ slug: 'ia-examen-final', title: 'Examen Final de Inteligencia Artificial', type: 'exam', content_md: EXAM, order_num: 1 }],
  },
];

const statements: string[] = [];
statements.push(`DELETE FROM courses WHERE slug = '${SLUG}';`);
statements.push(
  `INSERT INTO courses (slug, title, description) VALUES (${sqlStr(SLUG)}, 'Inteligencia Artificial Básica', 'Aprende los fundamentos de la IA: machine learning, redes neuronales, NLP, IA generativa y su uso ético.');`,
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
const out = resolve(process.cwd(), 'seed-ai.sql');
writeFileSync(out, sql, 'utf8');
console.log('Generado:', out);
console.log('Módulos:', MODULES.length, '| Lecciones:', MODULES.reduce((a, m) => a + m.lessons.length, 0));
