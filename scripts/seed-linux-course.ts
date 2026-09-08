// ============================================================
//  Script de seed del curso "Linux Básico".
//
//  Uso:
//    npx tsx scripts/seed-linux-course.ts
//
//  Genera el archivo `seed.sql`. Si además defines las variables
//  CF_ACCOUNT_ID, CF_API_TOKEN y CF_D1_DATABASE_ID, lo ejecuta
//  directamente contra tu base D1 mediante la API HTTP de Cloudflare.
//
//  Alternativa manual (local o remota):
//    wrangler d1 execute DB --file=./seed.sql
// ============================================================

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LINUX_COURSE, LINUX_MODULES } from './seed-data';

/** Escapa un valor como literal SQL (single quotes duplicadas). */
function sqlStr(v: string | null | undefined): string {
  if (v === null || v === undefined) return 'NULL';
  return "'" + v.replace(/'/g, "''") + "'";
}

function buildStatements(): string[] {
  const statements: string[] = [];
  const slug = LINUX_COURSE.slug;
  const courseExpr = `(SELECT id FROM courses WHERE slug = '${slug}')`;

  statements.push(`DELETE FROM courses WHERE slug = '${slug}';`);

  statements.push(
    `INSERT INTO courses (slug, title, description, image_url) VALUES (` +
      `${sqlStr(slug)}, ${sqlStr(LINUX_COURSE.title)}, ${sqlStr(LINUX_COURSE.description)}, NULL);`,
  );

  for (const mod of LINUX_MODULES) {
    statements.push(
      `INSERT INTO modules (course_id, title, order_num) VALUES (` +
        `${courseExpr}, ${sqlStr(mod.title)}, ${mod.order_num});`,
    );

    const moduleExpr = `(SELECT id FROM modules WHERE course_id = ${courseExpr} AND title = ${sqlStr(mod.title)})`;

    for (const lesson of mod.lessons) {
      statements.push(
        `INSERT INTO lessons (slug, module_id, title, type, content_md, initial_fs, check_logic, order_num) VALUES (` +
          `${sqlStr(lesson.slug)}, ${moduleExpr}, ${sqlStr(lesson.title)}, ${sqlStr(lesson.type)}, ` +
          `${sqlStr(lesson.content_md)}, ${sqlStr(lesson.initial_fs)}, ${sqlStr(lesson.check_logic)}, ${lesson.order_num});`,
      );
    }
  }

  return statements;
}

async function runRemote(statements: string[]) {
  const accountId = process.env.CF_ACCOUNT_ID;
  const token = process.env.CF_API_TOKEN;
  const dbId = process.env.CF_D1_DATABASE_ID;

  if (!accountId || !token || !dbId) return false;

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;

  for (let i = 0; i < statements.length; i++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: statements[i] }),
    });
    const data = (await res.json()) as { success?: boolean; errors?: unknown[] };
    if (!data.success) {
      console.error(`\n✗ Error en la sentencia #${i + 1}:`);
      console.error(JSON.stringify(data.errors, null, 2));
      process.exit(1);
    }
    process.stdout.write(`\rEjecutando sentencia ${i + 1}/${statements.length}…`);
  }
  console.log('');
  return true;
}

function main() {
  const statements = buildStatements();
  const sqlPath = resolve(process.cwd(), 'seed.sql');
  writeFileSync(sqlPath, statements.join('\n\n') + '\n', 'utf8');

  const totalLessons = LINUX_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  console.log('============================================================');
  console.log('  Seed del curso "Linux Básico"');
  console.log('============================================================');
  console.log(`  Módulos:      ${LINUX_MODULES.length} (16 + examen final)`);
  console.log(`  Lecciones:    ${totalLessons} (16 capítulos, 13 prácticas, 1 examen)`);
  console.log(`  SQL generado: ${sqlPath}`);
  console.log('------------------------------------------------------------');

  runRemote(statements).then((remote) => {
    if (remote) {
      console.log('  ✓ Ejecutado contra la base D1 remota.');
    } else {
      console.log('  Aplica el SQL manualmente con:');
      console.log('    wrangler d1 execute DB --file=./seed.sql        (local)');
      console.log('    wrangler d1 execute DB --remote --file=./seed.sql (remoto)');
    }
    console.log('============================================================');
  });
}

main();
