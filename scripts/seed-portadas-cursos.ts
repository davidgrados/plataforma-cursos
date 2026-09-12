// ============================================================
//  Portadas (image_url) de todos los cursos del catálogo.
//  Los SVG viven en public/cursos/<slug>.svg.
//  Genera seed-portadas.sql y lo aplica a D1.
// ============================================================

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PORTADAS: Record<string, string> = {
  'linux-basico': '/cursos/linux-basico.svg',
  'ingles-basico': '/cursos/ingles-basico.svg',
  'inteligencia-artificial': '/cursos/inteligencia-artificial.svg',
  'seguridad-informatica': '/cursos/seguridad-informatica.svg',
  'marketing-digital': '/cursos/marketing-digital.svg',
  ciberseguridad: '/cursos/ciberseguridad.svg',
  'informatica-forense': '/cursos/informatica-forense.svg',
};

const sql =
  '-- Portadas de los cursos (SVG en public/cursos)\n' +
  Object.entries(PORTADAS)
    .map(([slug, url]) => `UPDATE courses SET image_url = '${url}' WHERE slug = '${slug}';`)
    .join('\n') +
  '\n';

const out = resolve(process.cwd(), 'seed-portadas.sql');
writeFileSync(out, sql, 'utf8');
console.log('Generado:', out);
console.log('Cursos:', Object.keys(PORTADAS).length);
