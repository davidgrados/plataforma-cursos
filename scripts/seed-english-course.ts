// ============================================================
//  Seed del curso "Inglés Básico" (añade a la BD; no borra los demás cursos).
//  Genera seed-english.sql y lo aplica a D1 (local o remoto).
//
//  Las palabras/frases en inglés van entre backticks (`...`) para que la app
//  muestre el botón 🔊 de pronunciación, y se añade una guía fonética
//  aproximada para hispanohablantes.
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

Pulsa el botón 🔊 junto a cada frase para escuchar cómo se pronuncia.

## Saludos (Greetings)
- \`Hello\` / \`Hi\` (jelóu / jái) → Hola
- \`Good morning\` (gud mórnin) → Buenos días
- \`Good afternoon\` (gud áfternún) → Buenas tardes
- \`Good evening\` (gud ívnin) → Buenas noches

## ¿Cómo estás? (How are you?)
- \`How are you?\` (jáu ar iú) → ¿Cómo estás?
- \`I'm fine, thank you\` (áim fáin, zénk iu) → Estoy bien, gracias
- \`And you?\` (and iú) → ¿Y tú?

## Presentarte (Introductions)
- \`My name is Ana\` (mái néim is ána) → Me llamo Ana
- \`I am from Peru\` (ái am from perú) → Soy de Perú
- \`Nice to meet you\` (náis tu mít iu) → Encantado de conocerte

## Despedidas (Farewells)
- \`Goodbye\` (gudbái) → Adiós
- \`See you later\` (sí iu léiter) → Hasta luego
- \`Bye\` (bái) → Chao

> 🔊 Escucha: \`Hello\`, \`Good morning\`, \`How are you?\`, \`Nice to meet you\``;

const M2 = `# Módulo 2 · El alfabeto y la pronunciación

El alfabeto inglés tiene 26 letras. Conocerlo te ayuda a deletrear.

## Las vocales
- \`A\` (/eɪ/, léi), \`E\` (/iː/, í), \`I\` (/aɪ/, ái), \`O\` (/oʊ/, óu), \`U\` (/juː/, iú)

## Deletrear (Spelling)
- \`How do you spell your name?\` (jáu du iu spél ior néim) → ¿Cómo se deletrea tu nombre?
- Para deletrear se dicen las letras: A-N-A → \`ei - en - ei\`

## Sonidos clave
- \`th\` → como en \`this\` (dis) y \`think\` (zínk) — no existe en español.
- \`sh\` → como en \`she\` (shi).
- \`ee\` → largo, como en \`see\` (sí).

## Palabras de ejemplo
- \`cat\` (kat) → gato
- \`dog\` (dog) → perro
- \`sun\` (san) → sol

> 🔊 Escucha: \`Hello\`, \`cat\`, \`dog\`, \`How do you spell your name?\``;

const M3 = `# Módulo 3 · Números, fechas y horas

## Números cardinales
- 1 \`one\` (uán), 2 \`two\` (tú), 3 \`three\` (zrí), 4 \`four\` (for), 5 \`five\` (fáiv)
- 6 \`six\` (siks), 7 \`seven\` (séven), 8 \`eight\` (éit), 9 \`nine\` (náin), 10 \`ten\` (ten)
- 20 \`twenty\` (tuénti), 100 \`one hundred\` (uán hándred)

## Días de la semana
- \`Monday\` (mándei), \`Tuesday\` (tiúsdei), \`Wednesday\` (wénsdei), \`Thursday\` (zérsdei)
- \`Friday\` (fráidei), \`Saturday\` (sáturdei), \`Sunday\` (sándei)

## La hora
- \`What time is it?\` (uat táim is it) → ¿Qué hora es?
- \`It's three o'clock\` (its zrí oclók) → Son las tres
- \`It's half past three\` (its jaf past zrí) → Son las tres y media

> 🔊 Escucha: \`What time is it?\`, \`Monday\`, \`seven\`, \`one hundred\``;

const M4 = `# Módulo 4 · Pronombres personales y el verbo "to be"

## Pronombres personales
- \`I\` (ái) yo · \`you\` (iú) tú/usted · \`he\` (jí) él · \`she\` (shi) ella
- \`it\` (it) ello · \`we\` (uí) nosotros · \`they\` (déi) ellos

## El verbo "to be" (ser/estar)
- \`I am\` (ái am) / \`I'm\` (áim)
- \`you are\` (iú ar) / \`you're\`
- \`he/she/it is\` (is)
- \`we are\` / \`they are\`

## Ejemplos
- \`I am a student\` (ái am a stiúdent) → Soy estudiante
- \`She is from Mexico\` (shi is from méxico) → Ella es de México
- \`They are happy\` (déi ar jápi) → Ellos están felices

## Negación y preguntas
- \`I am not tired\` → No estoy cansado
- \`Are you a teacher?\` (ar iú a tícher) → ¿Eres profesor?

> 🔊 Escucha: \`I am a student\`, \`She is from Mexico\`, \`Are you a teacher?\``;

const M5 = `# Módulo 5 · El presente simple

Se usa para hábitos, rutinas y hechos generales.

## Afirmativo
- \`I work\` (ái uérk) · \`you work\` · \`he/she works\` (añade -s)
- \`we work\` · \`they work\`

## Tercera persona (-s / -es)
- \`He works\` en una oficina
- \`She watches\` (shi uáches) televisión

## Negación y preguntas
- \`I don't work\` (ái dóunt uérk) → No trabajo
- \`He doesn't work\` (jí dázent uérk) → Él no trabaja
- \`Do you work?\` (du iú uérk) → ¿Trabajas?
- \`Yes, I do / No, I don't\`

## Adverbios de frecuencia
- \`always\` (ólueis) siempre · \`usually\` (iúshuali) normalmente · \`never\` (néver) nunca

> 🔊 Escucha: \`He works\`, \`She watches\`, \`I don't work\`, \`Do you work?\``;

const M6 = `# Módulo 6 · Vocabulario esencial

## La familia (Family)
- \`mother\` (máder) madre · \`father\` (fáder) padre · \`brother\` (bráder) hermano · \`sister\` (síster) hermana

## Colores (Colors)
- \`red\` (red), \`blue\` (blu), \`green\` (grín), \`yellow\` (iélou), \`black\` (blak), \`white\` (uáit)

## Verbos comunes
- \`to eat\` (tu ít) comer · \`to drink\` (tu drink) beber · \`to go\` (tu góu) ir · \`to have\` (tu jav) tener
- \`to like\` (tu láik) gustar · \`to want\` (tu uánt) querer

## Objetos cotidianos
- \`book\` (buk) libro · \`pen\` (pen) bolígrafo · \`phone\` (fóun) teléfono · \`chair\` (chér) silla

## Preposiciones de lugar
- \`in\` (in) en · \`on\` (on) sobre · \`under\` (ánder) debajo · \`next to\` (nekst tu) al lado de

> 🔊 Escucha: \`mother\`, \`book\`, \`I want\`, \`to eat\`, \`blue\``;

const M7 = `# Módulo 7 · Preguntas y frases útiles

## Preguntas con WH-
- \`What?\` (uát) ¿Qué? · \`Where?\` (uér) ¿Dónde? · \`When?\` (uén) ¿Cuándo?
- \`Who?\` (ju) ¿Quién? · \`Why?\` (uái) ¿Por qué? · \`How?\` (jáu) ¿Cómo?

## Ejemplos
- \`What is your name?\` (uát is ior néim) → ¿Cómo te llamas?
- \`Where are you from?\` (uér ar iu from) → ¿De dónde eres?
- \`How old are you?\` (jáu óuld ar iu) → ¿Cuántos años tienes?

## Frases de cortesía
- \`Please\` (plís) por favor · \`Thank you\` (zénk iu) gracias · \`You're welcome\` (ior uélcom) de nada
- \`Excuse me\` (ekskiús mi) disculpe · \`I'm sorry\` (áim sori) lo siento
- \`Can you help me?\` (kan iu jelp mi) ¿Puede ayudarme?

## En la tienda / restaurante
- \`How much is it?\` (jáu mach is it) → ¿Cuánto cuesta?
- \`I would like a coffee, please\` → Quisiera un café, por favor

> 🔊 Escucha: \`Where are you from?\`, \`Thank you\`, \`Can you help me?\`, \`How much is it?\``;

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
  `INSERT INTO courses (slug, title, description) VALUES (${sqlStr(SLUG)}, 'Inglés Básico', 'Aprende inglés desde cero: saludos, gramática, vocabulario, frases útiles y pronunciación interactiva (botón 🔊).');`,
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
