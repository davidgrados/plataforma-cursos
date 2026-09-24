// ============================================================
//  Aplica los ejemplos del mundo real a las lecciones de D1.
//
//  Genera seed-ejemplos.sql con UPDATE que AÑADEN la sección al
//  final del contenido (concatena). Es idempotente: si la lección
//  ya tiene "En el mundo real", no se vuelve a añadir.
//
//  Uso:
//    npx tsx scripts/aplicar-ejemplos.ts
//    npx wrangler d1 execute DB --remote --file=./seed-ejemplos.sql
// ============================================================

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { EJEMPLOS_REALES } from '../lib/ejemplos-reales';

function sqlStr(v: string): string {
  return "'" + v.replace(/'/g, "''") + "'";
}

const statements: string[] = [
  '-- Añade la sección "En el mundo real" al final de cada lección.',
  '-- No borra nada: conserva IDs, progreso y sesiones de laboratorio.',
  '',
];

for (const [slug, seccion] of Object.entries(EJEMPLOS_REALES)) {
  statements.push(
    `UPDATE lessons SET content_md = content_md || ${sqlStr(seccion)} ` +
      `WHERE slug = ${sqlStr(slug)} AND content_md NOT LIKE '%En el mundo real%';`,
  );
}

const sql = statements.join('\n') + '\n';
const out = resolve(process.cwd(), 'seed-ejemplos.sql');
writeFileSync(out, sql, 'utf8');

const slugs = Object.keys(EJEMPLOS_REALES);
console.log('Generado:', out);
console.log('Lecciones con ejemplos:', slugs.length);
console.log('Cursos:', [...new Set(slugs.map((s) => s.split('-')[0]))].join(', '));
