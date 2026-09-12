// ============================================================
//  Portada del próximo curso: "Informática Forense".
//  Solo crea la ficha del curso (sin módulos todavía): aparece
//  en la página de cursos con la etiqueta "Próximamente".
//  Genera seed-forense.sql y lo aplica a D1.
// ============================================================

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SLUG = 'informatica-forense';
const TITLE = 'Informática Forense';
const DESCRIPTION =
  'Próximo curso: aprende a investigar incidentes digitales paso a paso — recolección y preservación de evidencias, análisis de discos y dispositivos móviles, línea de tiempo de los hechos, cadena de custodia y elaboración de informes periciales.';
const IMAGE_URL = '/cursos/informatica-forense.svg';

const sql = `-- Portada del curso "${TITLE}" (en preparación, sin módulos)
DELETE FROM courses WHERE slug = '${SLUG}';

INSERT INTO courses (slug, title, description, image_url)
VALUES ('${SLUG}', '${TITLE}', '${DESCRIPTION}', '${IMAGE_URL}');
`;

const out = resolve(process.cwd(), 'seed-forense.sql');
writeFileSync(out, sql, 'utf8');
console.log('Generado:', out);
