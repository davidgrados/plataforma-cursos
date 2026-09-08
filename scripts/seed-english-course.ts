// ============================================================
//  Seed del curso "Inglés Básico" (añade a la BD; no borra los demás cursos).
//  Genera seed-english.sql y lo aplica a D1 (local o remoto).
// ============================================================

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SLUG = 'ingles-basico';
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

const M1 = `# Módulo 1 · Saludos y presentaciones

Aprende a saludar, presentarte y despedirte en inglés.

## Saludos (Greetings)

- **Hello** / **Hi** → Hola
- **Good morning** → Buenos días
- **Good afternoon** → Buenas tardes
- **Good evening** → Buenas noches (al llegar)

## ¿Cómo estás? (How are you?)

- **How are you?** → ¿Cómo estás?
- **I'm fine, thank you** → Estoy bien, gracias
- **Very well** → Muy bien
- **And you?** → ¿Y tú?

## Presentarte (Introductions)

- **My name is Ana** → Me llamo Ana
- **I am from Peru** → Soy de Perú
- **Nice to meet you** → Encantado/a de conocerte

## Despedidas (Farewells)

- **Goodbye** → Adiós
- **See you later** → Hasta luego
- **Bye** → Chao

> 💡 Usa "Good morning/afternoon/evening" en situaciones formales. "Hi/Hello" es más informal.`;

const M2 = `# Módulo 2 · El alfabeto y la pronunciación

El alfabeto inglés tiene 26 letras. Conocerlo te ayuda a deletrear nombres y palabras.

## Las vocales

- **A** /eɪ/, **E** /iː/, **I** /aɪ/, **O** /oʊ/, **U** /juː/

## Deletrear (Spelling)

Para deletrear se dicen los nombres de las letras:

- **A-N-A** → "ei - en - ei"
- **How do you spell your name?** → ¿Cómo se deletrea tu nombre?

## Sonidos clave

- **th** → como en *this* y *think* (no existe en español).
- **sh** → como en *she*.
- **ch** → como en *chair*.
- **ee** → largo, como en *see*.

## Palabras de ejemplo

- **cat** /kæt/ → gato
- **dog** /dɔːɡ/ → perro
- **sun** /sʌn/ → sol

> 💡 Escucha y repite. La pronunciación se mejora con la práctica diaria.`;

const M3 = `# Módulo 3 · Números, fechas y horas

## Números cardinales

- 1 **one**, 2 **two**, 3 **three**, 4 **four**, 5 **five**
- 6 **six**, 7 **seven**, 8 **eight**, 9 **nine**, 10 **ten**
- 11 **eleven**, 12 **twelve**, 20 **twenty**, 30 **thirty**
- 100 **one hundred**

## Días de la semana

- **Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday**

## Meses

- **January, February, March, April, May, June, July, August, September, October, November, December**

## La hora

- **What time is it?** → ¿Qué hora es?
- **It's three o'clock** → Son las tres en punto
- **It's half past three** → Son las tres y media

> 💡 En inglés la fecha se escribe normalmente: *the 5th of May* o *May 5th*.`;

const M4 = `# Módulo 4 · Pronombres personales y el verbo "to be"

## Pronombres personales

- **I** → yo · **you** → tú/usted · **he** → él · **she** → ella
- **it** → ello · **we** → nosotros · **they** → ellos

## El verbo "to be" (ser o estar)

- **I am** (I'm) · **you are** (you're) · **he/she/it is** (he's)
- **we are** (we're) · **they are** (they're)

## Ejemplos

- **I am a student** → Soy estudiante
- **She is from Mexico** → Ella es de México
- **They are happy** → Ellos están felices

## Negación

- **I am not tired** → No estoy cansado
- **He is not here** (he isn't) → Él no está aquí

## Preguntas

- **Are you a teacher?** → ¿Eres profesor/a?
- **Yes, I am / No, I'm not**

> 💡 "You" se usa tanto para "tú" como para "usted".`;

const M5 = `# Módulo 5 · El presente simple

Se usa para hábitos, rutinas y hechos generales.

## Afirmativo

- **I work** · **you work** · **he/she works** (añade -s)
- **we work** · **they work**

## Tercera persona (-s / -es)

- **He works** en una oficina
- **She watches** televisión
- **It goes** rápido

## Negación

- **I don't work** (do not)
- **He doesn't work** (does not)

## Preguntas

- **Do you work?**
- **Does she work?**
- Respuestas cortas: **Yes, I do / No, I don't**

## Adverbios de frecuencia

- **always** (siempre) · **usually** (normalmente) · **often** (a menudo)
- **sometimes** (a veces) · **never** (nunca)

> 💡 Ejemplo: *I always drink coffee in the morning.*`;

const M6 = `# Módulo 6 · Vocabulario esencial

## La familia (Family)

- **mother** madre · **father** padre · **brother** hermano · **sister** hermana
- **grandparents** abuelos · **child** hijo/a

## Colores (Colors)

- **red, blue, green, yellow, black, white, orange, purple, pink, brown**

## Verbos comunes

- **to eat** comer · **to drink** beber · **to go** ir · **to come** venir
- **to have** tener · **to like** gustar · **to want** querer

## Objetos cotidianos

- **book** libro · **pen** bolígrafo · **phone** teléfono · **bag** bolso · **chair** silla

## Preposiciones de lugar

- **in** en · **on** sobre · **under** debajo · **next to** al lado de

> 💡 Frase útil: *The book is on the table.*`;

const M7 = `# Módulo 7 · Preguntas y frases útiles

## Preguntas con WH-

- **What?** → ¿Qué? · **Where?** → ¿Dónde? · **When?** → ¿Cuándo?
- **Who?** → ¿Quién? · **Why?** → ¿Por qué? · **How?** → ¿Cómo?

## Ejemplos

- **What is your name?** → ¿Cómo te llamas?
- **Where are you from?** → ¿De dónde eres?
- **How old are you?** → ¿Cuántos años tienes?

## Frases de cortesía

- **Please** por favor · **Thank you** gracias · **You're welcome** de nada
- **Excuse me** disculpe · **I'm sorry** lo siento · **Can you help me?** ¿puede ayudarme?

## En la tienda / restaurante

- **How much is it?** → ¿Cuánto cuesta?
- **I would like a coffee, please** → Quisiera un café, por favor
- **The bill, please** → La cuenta, por favor

> 💡 Usa "Excuse me" para llamar la atención y "I'm sorry" para disculparte.`;

const EXAM = `# Examen Final · Inglés Básico

Responde el examen de opción múltiple para comprobar lo aprendido.`;

const MODULES: SModule[] = [
  { title: 'Módulo 1 · Saludos y presentaciones', order_num: 1, lessons: [chapter('ingles-01', 'Saludos y presentaciones', M1)] },
  { title: 'Módulo 2 · El alfabeto y la pronunciación', order_num: 2, lessons: [chapter('ingles-02', 'El alfabeto y la pronunciación', M2)] },
  { title: 'Módulo 3 · Números, fechas y horas', order_num: 3, lessons: [chapter('ingles-03', 'Números, fechas y horas', M3)] },
  { title: 'Módulo 4 · Pronombres y el verbo "to be"', order_num: 4, lessons: [chapter('ingles-04', 'Pronombres personales y el verbo "to be"', M4)] },
  { title: 'Módulo 5 · El presente simple', order_num: 5, lessons: [chapter('ingles-05', 'El presente simple', M5)] },
  { title: 'Módulo 6 · Vocabulario esencial', order_num: 6, lessons: [chapter('ingles-06', 'Vocabulario esencial', M6)] },
  { title: 'Módulo 7 · Preguntas y frases útiles', order_num: 7, lessons: [chapter('ingles-07', 'Preguntas y frases útiles', M7)] },
  {
    title: 'Examen Final',
    order_num: 8,
    lessons: [{ slug: 'ingles-examen-final', title: 'Examen Final de Inglés Básico', type: 'exam', content_md: EXAM, order_num: 1 }],
  },
];

const statements: string[] = [];
statements.push(`DELETE FROM courses WHERE slug = '${SLUG}';`);
statements.push(
  `INSERT INTO courses (slug, title, description) VALUES (${sqlStr(SLUG)}, 'Inglés Básico', 'Aprende inglés desde cero: saludos, gramática básica, vocabulario y frases útiles para comunicarte en situaciones cotidianas.');`,
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
const out = resolve(process.cwd(), 'seed-english.sql');
writeFileSync(out, sql, 'utf8');
console.log('Generado:', out);
console.log('Módulos:', MODULES.length, '| Lecciones:', MODULES.reduce((a, m) => a + m.lessons.length, 0));
