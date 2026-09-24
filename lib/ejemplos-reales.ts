// ============================================================
//  Ejemplos del mundo real · índice general
//
//  Cada entrada se añade AL FINAL del contenido de la lección
//  correspondiente (identificada por su slug), sin reemplazar
//  nada y sin perder el progreso de los alumnos.
// ============================================================

import { EJEMPLOS_SEGURIDAD } from './ejemplos/seguridad';
import { EJEMPLOS_IA } from './ejemplos/ia';
import { EJEMPLOS_MARKETING } from './ejemplos/marketing';
import { EJEMPLOS_INGLES } from './ejemplos/ingles';
import { EJEMPLOS_LINUX } from './ejemplos/linux';

export const EJEMPLOS_REALES: Record<string, string> = {
  ...EJEMPLOS_SEGURIDAD,
  ...EJEMPLOS_IA,
  ...EJEMPLOS_MARKETING,
  ...EJEMPLOS_INGLES,
  ...EJEMPLOS_LINUX,
};
