import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Combina clases de Tailwind resolviendo conflictos. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convierte un slug legible (linux-basico -> Linux basico). */
export function humanize(slug: string) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Etiquetas legibles para los tipos de lección. */
export const LESSON_TYPE_LABEL: Record<string, string> = {
  chapter: 'Capítulo',
  practice: 'Práctica',
  exam: 'Examen',
};

/** Formatea una fecha ISO a un texto corto localizado. */
export function formatDate(iso?: string | null) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}
