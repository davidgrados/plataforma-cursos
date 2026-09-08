// ============================================================
//  Intérprete de comandos del terminal simulado.
//
//  Comandos soportados: pwd, ls, cd, mkdir, touch, echo (con > y >>),
//  cat, rm (con -r), grep, find . -name, clear.
//  Cualquier otro comando devuelve: bash: <cmd>: command not found.
//
//  IMPORTANTE: no se usa child_process ni exec. Todo es en memoria.
// ============================================================

import type { CheckResult, ExecResult, FSDir } from './types';
import {
  deleteNode,
  findFiles,
  getNode,
  normalizePath,
  setNode,
} from './fs-utils';

const HOME = '/home/student';

/** Divide una línea en tokens respetando comillas simples y dobles. */
export function tokenize(line: string): string[] {
  const tokens: string[] = [];
  let cur = '';
  let quote: string | null = null;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ' ' || ch === '\t') {
      if (cur) {
        tokens.push(cur);
        cur = '';
      }
    } else {
      cur += ch;
    }
  }
  if (cur) tokens.push(cur);
  return tokens;
}

/** Ejecuta un comando contra el FS virtual y devuelve el nuevo estado. */
export function executeCommand(fs: FSDir, cwd: string, rawCommand: string): ExecResult {
  const ok = (output = '', nextFs = fs, nextCwd = cwd): ExecResult => ({
    output,
    fs: nextFs,
    cwd: nextCwd,
    clear: false,
  });

  const line = rawCommand.trim();
  if (!line) return ok('');

  const parts = tokenize(line);
  const cmd = parts[0];
  const args = parts.slice(1);

  switch (cmd) {
    case 'clear':
      return { output: '', fs, cwd, clear: true };

    case 'pwd':
      return ok(cwd);

    case 'ls': {
      const targetPath = args[0] ? normalizePath(cwd, args[0]) : cwd;
      const node = getNode(fs, targetPath);
      if (node === null) return ok(`ls: no se puede acceder a '${args[0]}': No existe el archivo o el directorio`);
      if (typeof node === 'string') return ok(args[0] ?? targetPath);
      const names = Object.keys(node).sort();
      if (names.length === 0) return ok('');
      return ok(names.join('  '));
    }

    case 'cd': {
      const target = normalizePath(cwd, args[0] || HOME);
      const node = getNode(fs, target);
      if (node === null) return ok(`bash: cd: ${args[0]}: No existe el archivo o el directorio`);
      if (typeof node === 'string') return ok(`bash: cd: ${args[0]}: No es un directorio`);
      return ok('', fs, target);
    }

    case 'mkdir': {
      if (!args[0]) return ok('mkdir: falta un operando');
      const targetPath = normalizePath(cwd, args[0]);
      if (getNode(fs, targetPath) !== null) {
        return ok(`mkdir: no se puede crear el directorio '${args[0]}': El archivo ya existe`);
      }
      setNode(fs, targetPath, {});
      return ok('');
    }

    case 'touch': {
      if (!args[0]) return ok('touch: falta un operando');
      for (const a of args) {
        const targetPath = normalizePath(cwd, a);
        if (getNode(fs, targetPath) === null) setNode(fs, targetPath, '');
      }
      return ok('');
    }

    case 'echo': {
      const gtIndex = parts.findIndex((p) => p === '>' || p === '>>');
      if (gtIndex === -1) return ok(parts.slice(1).join(' '));

      const text = parts.slice(1, gtIndex).join(' ');
      const op = parts[gtIndex];
      const targetArg = parts[gtIndex + 1];
      if (!targetArg) return ok('bash: error de sintaxis cerca del token inesperado `newline`');

      const targetPath = normalizePath(cwd, targetArg);
      const existing = getNode(fs, targetPath);
      let content = text;
      if (op === '>>' && typeof existing === 'string') {
        content = existing.endsWith('\n') ? existing + text : existing + '\n' + text;
      }
      setNode(fs, targetPath, content);
      return ok('');
    }

    case 'cat': {
      if (args.length === 0) return ok('cat: falta un operando');
      let out = '';
      for (const a of args) {
        const p = normalizePath(cwd, a);
        const n = getNode(fs, p);
        if (n === null) out += `cat: ${a}: No existe el archivo o el directorio\n`;
        else if (typeof n === 'string') out += n.endsWith('\n') ? n : n + '\n';
        else out += `cat: ${a}: Es un directorio\n`;
      }
      return ok(out.trimEnd());
    }

    case 'rm': {
      let recursive = false;
      const targets: string[] = [];
      for (const a of args) {
        if (a === '-r' || a === '-rf' || a === '-fr' || a === '-R') recursive = true;
        else targets.push(a);
      }
      if (targets.length === 0) return ok('rm: falta un operando');
      let out = '';
      for (const t of targets) {
        const p = normalizePath(cwd, t);
        const n = getNode(fs, p);
        if (n === null) {
          out += `rm: no se puede borrar '${t}': No existe el archivo o el directorio\n`;
          continue;
        }
        if (typeof n === 'object' && !recursive) {
          out += `rm: no se puede borrar '${t}': Es un directorio\n`;
          continue;
        }
        deleteNode(fs, p);
      }
      return ok(out.trimEnd());
    }

    case 'grep': {
      if (args.length < 2) return ok('grep: uso: grep PATRÓN ARCHIVO');
      const [pattern, ...files] = args;
      let out = '';
      for (const f of files) {
        const p = normalizePath(cwd, f);
        const n = getNode(fs, p);
        if (n === null) {
          out += `grep: ${f}: No existe el archivo o el directorio\n`;
          continue;
        }
        if (typeof n !== 'string') {
          out += `grep: ${f}: Es un directorio\n`;
          continue;
        }
        const lines = n.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes(pattern)) {
            out += files.length > 1 ? `${f}:${line}\n` : `${line}\n`;
          }
        });
      }
      return ok(out.trimEnd());
    }

    case 'find': {
      // Sintaxis soportada: find . -name "patrón"
      const nameIdx = parts.indexOf('-name');
      const pattern = nameIdx !== -1 ? parts[nameIdx + 1] : null;
      const results = findFiles(fs, cwd, pattern);
      return ok(results.length ? results.join('\n') : '');
    }

    default:
      return ok(`bash: ${cmd}: command not found`);
  }
}

/**
 * Evalúa el `check_logic` de una lección contra el FS actual.
 *
 * IMPORTANTE: Cloudflare Workers prohíbe `eval`/`new Function`, por lo que
 * `check_logic` NO es código JS arbitrario: es un **DSL declarativo en JSON**.
 *
 * Formato:
 *   { "checks": [ { "kind": "isDir", "path": "/x/y", "message": "..." }, ... ] }
 *
 * Tipos de comprobación (`kind`):
 *   - "exists"    -> la ruta existe (archivo o directorio)
 *   - "isDir"     -> la ruta es un directorio
 *   - "isFile"    -> la ruta es un archivo
 *   - "contains"  -> el archivo contiene un texto (`value`)
 *   - "equals"    -> el contenido del archivo es exactamente `value`
 *
 * Todas las comprobaciones deben cumplirse (AND). Si una falla, se devuelve
 * su `message` (o un mensaje genérico).
 */
export function runCheckLogic(fs: FSDir, cwd: string, code?: string | null): CheckResult {
  if (!code || !code.trim()) {
    return { passed: true, message: 'Sin validación automática.' };
  }

  let spec: { checks?: CheckRule[] };
  try {
    spec = JSON.parse(code);
  } catch {
    return {
      passed: false,
      message: 'Configuración de validación inválida (JSON mal formado).',
    };
  }

  // Acepta tanto { checks: [...] } como un array directo [...]
  const checks: CheckRule[] = Array.isArray(spec) ? (spec as unknown as CheckRule[]) : (spec.checks ?? []);

  if (checks.length === 0) {
    return { passed: true, message: 'Sin validación automática.' };
  }

  for (const rule of checks) {
    const path = normalizePath(cwd, rule.path || '');
    const node = getNode(fs, path);
    let ok = false;

    switch (rule.kind) {
      case 'exists':
        ok = node !== null;
        break;
      case 'isDir':
        ok = node !== null && typeof node === 'object';
        break;
      case 'isFile':
        ok = typeof node === 'string';
        break;
      case 'contains':
        ok = typeof node === 'string' && node.includes(rule.value ?? '');
        break;
      case 'equals':
        ok = typeof node === 'string' && node === (rule.value ?? '');
        break;
      default:
        return {
          passed: false,
          message: `Tipo de verificación desconocido: ${String((rule as { kind: string }).kind)}`,
        };
    }

    if (!ok) {
      return {
        passed: false,
        message:
          rule.message ||
          `La comprobación "${rule.kind}" de "${rule.path}" no se cumple.`,
      };
    }
  }

  return { passed: true, message: '¡Ejercicio completado correctamente!' };
}

/** Regla individual de validación del DSL declarativo. */
export interface CheckRule {
  kind: 'exists' | 'isDir' | 'isFile' | 'contains' | 'equals';
  path: string;
  value?: string;
  message?: string;
}
