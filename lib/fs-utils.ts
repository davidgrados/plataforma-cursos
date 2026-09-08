// ============================================================
//  Utilidades para manipular el sistema de archivos virtual.
//
//  Representación: el FS es un árbol de objetos. Un directorio es
//  un objeto `{ [nombre]: nodo }` y un archivo es un string (su
//  contenido). La raíz es el objeto principal.
//
//  Ejemplo:
//  {
//    "home": { "student": { "notas.txt": "hola" } },
//    "etc":  { "hosts": "127.0.0.1 localhost" },
//    "tmp":  {}
//  }
// ============================================================

import type { FSNode, FSDir } from './types';

/** Divide una ruta absoluta normalizada en sus segmentos. */
export function segments(path: string): string[] {
  return path.split('/').filter(Boolean);
}

/**
 * Normaliza una ruta (absoluta o relativa) a una ruta absoluta,
 * resolviendo `.` y `..`. Nunca sube más arriba de la raíz.
 */
export function normalizePath(cwd: string, input: string): string {
  const raw = input.startsWith('/') ? input : `${cwd}/${input}`;
  const stack: string[] = [];
  for (const seg of raw.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') {
      stack.pop();
      continue;
    }
    stack.push(seg);
  }
  return '/' + stack.join('/');
}

/** Devuelve el nodo en la ruta absoluta dada, o `null` si no existe. */
export function getNode(fs: FSDir, path: string): FSNode | null {
  if (path === '/') return fs;
  let cur: FSNode = fs;
  for (const seg of segments(path)) {
    if (typeof cur === 'string') return null;
    if (!(seg in cur)) return null;
    cur = (cur as FSDir)[seg];
  }
  return cur;
}

/** Establece un nodo en la ruta absoluta, creando directorios intermedios. */
export function setNode(fs: FSDir, path: string, value: FSNode): FSDir {
  const segs = segments(path);
  if (segs.length === 0) return fs;
  let cur = fs;
  for (let i = 0; i < segs.length - 1; i++) {
    const seg = segs[i];
    const next = cur[seg];
    if (typeof next === 'string' || next === undefined) {
      cur[seg] = {};
    }
    cur = cur[seg] as FSDir;
  }
  cur[segs[segs.length - 1]] = value;
  return fs;
}

/** Elimina un nodo (archivo o directorio, recursivamente). Devuelve true si existía. */
export function deleteNode(fs: FSDir, path: string): boolean {
  if (path === '/') return false;
  const segs = segments(path);
  let cur: FSNode = fs;
  for (let i = 0; i < segs.length - 1; i++) {
    if (typeof cur === 'string') return false;
    const next: FSNode = (cur as FSDir)[segs[i]];
    if (!next) return false;
    cur = next;
  }
  if (typeof cur === 'string') return false;
  const last = segs[segs.length - 1];
  if (!(last in cur)) return false;
  delete (cur as FSDir)[last];
  return true;
}

/** Lista los nombres de un directorio. */
export function listDir(fs: FSDir, path: string): string[] {
  const node = getNode(fs, path);
  if (!node || typeof node === 'string') return [];
  return Object.keys(node);
}

/**
 * Devuelve una lista de rutas de archivos que coinciden con un patrón
 * glob simple (solo `*`), buscando recursivamente desde `rootPath`.
 */
export function findFiles(fs: FSDir, rootPath: string, pattern: string | null): string[] {
  const results: string[] = [];
  const regex = pattern ? globToRegex(pattern) : null;

  function walk(dirPath: string, node: FSNode) {
    if (typeof node === 'string') {
      const base = dirPath.split('/').filter(Boolean).pop() || '';
      if (!regex || regex.test(base)) results.push(dirPath);
      return;
    }
    for (const [name, child] of Object.entries(node)) {
      const childPath = dirPath === '/' ? `/${name}` : `${dirPath}/${name}`;
      walk(childPath, child);
    }
  }

  const root = getNode(fs, rootPath);
  if (root) walk(rootPath === '/' ? '/' : rootPath, root);
  return results.sort();
}

/** Convierte un patrón glob simple (solo `*`) a expresión regular. */
export function globToRegex(pattern: string): RegExp {
  const escaped = pattern
    .split('*')
    .map((p) => p.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${escaped}$`);
}

/** Crea el FS base que comparten las lecciones del curso Linux. */
export function baseFilesystem(): FSDir {
  return {
    home: {
      student: {
        documentos: {},
        proyectos: {},
        'notas.txt': 'Mis apuntes de Linux\nBienvenido al curso.\n',
      },
    },
    etc: {
      hosts: '127.0.0.1 localhost\n',
      passwd:
        'root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000::/home/student:/bin/bash\n',
    },
    tmp: {},
    var: {
      log: {
        syslog: 'kernel: Linux versión 6.x iniciado\n',
      },
    },
  };
}

/** Convierte el FS a una representación de árbol para depuración. */
export function printTree(fs: FSDir, prefix = '', path = '/'): string {
  const entries = Object.entries(fs);
  let out = '';
  entries.forEach(([name, node], i) => {
    const last = i === entries.length - 1;
    const branch = last ? '└── ' : '├── ';
    if (typeof node === 'string') {
      out += `${prefix}${branch}${name}\n`;
    } else {
      out += `${prefix}${branch}${name}/\n`;
      out += printTree(node, prefix + (last ? '    ' : '│   '), path + name + '/');
    }
  });
  return out;
}
