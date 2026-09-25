'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { useAuthUser } from '@/lib/auth-context';
import { toast } from 'sonner';
import { Check, Loader2, RefreshCw, TerminalSquare, UserPlus } from 'lucide-react';
import { api } from '@/lib/api';
import { executeCommand, runCheckLogic } from '@/lib/terminal';
import type { FSDir } from '@/lib/types';
import '@xterm/xterm/css/xterm.css';

const HOME = '/home/student';

function displayPath(cwd: string) {
  if (cwd === HOME) return '~';
  if (cwd.startsWith(HOME + '/')) return '~' + cwd.slice(HOME.length);
  return cwd;
}

const THEME = {
  background: '#1e1e1e',
  foreground: '#d4d4d4',
  cursor: '#d4d4d4',
  cursorAccent: '#1e1e1e',
  selectionBackground: '#264f78',
  black: '#000000',
  red: '#f87171',
  green: '#34d399',
  yellow: '#fbbf24',
  blue: '#60a5fa',
  magenta: '#c084fc',
  cyan: '#22d3ee',
  white: '#e5e7eb',
  brightBlack: '#6b7280',
  brightRed: '#fca5a5',
  brightGreen: '#6ee7b7',
  brightYellow: '#fcd34d',
  brightBlue: '#93c5fd',
  brightMagenta: '#d8b4fe',
  brightCyan: '#67e8f9',
  brightWhite: '#ffffff',
};

interface Props {
  lessonId: number;
  verify?: boolean;
  /** Sistema de archivos inicial de la lección (modo invitado). */
  initialFs?: string;
  /** Reglas de validación del ejercicio (modo invitado). */
  checkLogic?: string | null;
}

export default function TerminalEmbed({ lessonId, verify = false, initialFs, checkLogic }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const inputRef = useRef('');
  const cwdRef = useRef(HOME);
  const localFsRef = useRef<FSDir | null>(null);
  const [busy, setBusy] = useState(false);
  const { userId, isLoaded } = useAuthUser();

  /** true cuando el alumno practica sin cuenta: todo se ejecuta en su navegador. */
  const invitado = isLoaded && !userId;

  /** Sistema de archivos inicial de la lección (para el modo invitado). */
  const fsInicial = useCallback((): FSDir => {
    try {
      return initialFs ? (JSON.parse(initialFs) as FSDir) : { home: { student: {} } };
    } catch {
      return { home: { student: {} } };
    }
  }, [initialFs]);

  const prompt = useCallback(() => {
    const d = displayPath(cwdRef.current);
    return `\x1b[1;32mstudent@linux\x1b[0m:\x1b[1;34m${d}\x1b[0m$ `;
  }, []);

  /** Ejecuta el comando en el navegador (modo invitado: no se guarda nada). */
  const ejecutarLocal = useCallback(
    (cmd: string): string => {
      const actual: FSDir = localFsRef.current ?? fsInicial();
      const res = executeCommand(actual, cwdRef.current, cmd);
      localFsRef.current = res.fs;
      cwdRef.current = res.cwd;
      return res.output;
    },
    [fsInicial],
  );

  const execute = useCallback(
    async (cmd: string) => {
      const t = termRef.current;
      if (!t) return;

      // --- Modo invitado: todo ocurre en el navegador ---
      if (invitado) {
        try {
          const salida = ejecutarLocal(cmd);
          if (cmd.trim() === 'clear') t.clear();
          else if (salida) t.write(salida.replace(/\n/g, '\r\n') + '\r\n');
        } catch {
          t.write('\x1b[31mError al ejecutar el comando.\x1b[0m\r\n');
        }
        t.write(prompt());
        return;
      }

      if (!userId) {
        t.write('\x1b[90m# Un momento: comprobando la sesión…\x1b[0m\r\n');
        t.write(prompt());
        return;
      }

      setBusy(true);
      try {
        const res = await api.terminal({ lesson_id: lessonId, command: cmd, action: 'exec' }, userId);
        if (res.clear) {
          t.clear();
        } else if (res.output) {
          t.write(res.output.replace(/\n/g, '\r\n') + '\r\n');
        }
        if (res.current_path) cwdRef.current = res.current_path;
      } catch (e) {
        t.write(`\x1b[31mError: ${(e as Error).message}\x1b[0m\r\n`);
      } finally {
        setBusy(false);
        t.write(prompt());
      }
    },
    [lessonId, userId, prompt, invitado, ejecutarLocal],
  );

  const handleInput = useCallback(
    (data: string) => {
      const t = termRef.current;
      if (!t) return;
      for (const ch of data) {
        if (ch === '\r') {
          const cmd = inputRef.current;
          t.write('\r\n');
          inputRef.current = '';
          if (cmd.trim()) void execute(cmd);
          else t.write(prompt());
        } else if (ch === '\u007f') {
          if (inputRef.current.length > 0) {
            inputRef.current = inputRef.current.slice(0, -1);
            t.write('\b \b');
          }
        } else if (ch === '\u0003') {
          t.write('^C\r\n');
          inputRef.current = '';
          t.write(prompt());
        } else if (ch >= ' ') {
          inputRef.current += ch;
          t.write(ch);
        }
      }
    },
    [execute, prompt],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const t = new Terminal({
      theme: THEME,
      fontFamily: '"Cascadia Code", "JetBrains Mono", Menlo, Consolas, monospace',
      fontSize: 14,
      lineHeight: 1.25,
      cursorBlink: true,
      scrollback: 2000,
    });
    const fit = new FitAddon();
    t.loadAddon(fit);
    t.open(el);
    fit.fit();

    termRef.current = t;
    fitRef.current = fit;

    if (invitado) {
      t.write('\x1b[90m# Modo invitado: puedes practicar sin crear una cuenta.\r\n');
      t.write('# Ojo: tu progreso no se guardará al salir de la página.\x1b[0m\r\n');
    }
    t.write(prompt());

    const sub = t.onData(handleInput);
    const onResize = () => fit.fit();
    window.addEventListener('resize', onResize);

    if (userId) {
      api
        .terminalSession(lessonId, userId)
        .then((s) => {
          if (s?.current_path) cwdRef.current = s.current_path;
        })
        .catch(() => {
          /* la sesión aún no existe */
        });
    }

    return () => {
      sub.dispose();
      window.removeEventListener('resize', onResize);
      t.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, userId]);

  const handleVerify = useCallback(async () => {
    // --- Verificación en el navegador (modo invitado) ---
    if (invitado) {
      const actual: FSDir = localFsRef.current ?? fsInicial();
      const res = runCheckLogic(actual, cwdRef.current, checkLogic);
      if (res.passed) {
        toast.success(res.message || '¡Ejercicio completado!');
        termRef.current?.write(
          '\x1b[1;32m✓ ¡Ejercicio correcto!\x1b[0m \x1b[90m(practicaste como invitado: tu progreso no se guardó)\x1b[0m\r\n',
        );
      } else {
        toast.error(res.message || 'El ejercicio aún no está completo.');
      }
      return;
    }

    if (!userId) {
      toast.error('Un momento: comprobando la sesión…');
      return;
    }
    setBusy(true);
    try {
      const res = await api.terminal({ lesson_id: lessonId, action: 'verify' }, userId);
      if (res.passed) toast.success(res.message || '¡Ejercicio completado!');
      else toast.error(res.message || 'El ejercicio aún no está completo.');
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [lessonId, userId, invitado, fsInicial, checkLogic]);

  const handleReset = useCallback(async () => {
    const confirmado = window.confirm(
      '¿Reiniciar el laboratorio?\n\nSe borrarán los archivos y carpetas que creaste en esta práctica y volverás al estado inicial.',
    );
    if (!confirmado) return;

    if (invitado) {
      localFsRef.current = fsInicial();
      cwdRef.current = HOME;
      termRef.current?.clear();
      termRef.current?.write('\x1b[90m# Laboratorio reiniciado (modo invitado).\x1b[0m\r\n');
      termRef.current?.write(prompt());
      return;
    }

    if (!userId) return;
    setBusy(true);
    try {
      const res = await api.terminal({ lesson_id: lessonId, action: 'reset' }, userId);
      termRef.current?.clear();
      termRef.current?.write('\r\n' + (res.output || '') + '\r\n');
      cwdRef.current = res.current_path || HOME;
      toast.success('Laboratorio reiniciado. ¡Empieza de nuevo!');
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      termRef.current?.write(prompt());
    }
  }, [lessonId, userId, invitado, fsInicial, prompt]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e1e] shadow-2xl">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#27272a] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </span>
          <span className="ml-2 flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <TerminalSquare className="h-3.5 w-3.5" /> bash — Linux (simulado)
          </span>
          {invitado && (
            <span className="ml-1 flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
              <UserPlus className="h-3 w-3" /> Modo invitado · sin guardar
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {busy && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 transition hover:bg-white/5"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reiniciar
          </button>
          {verify && (
            <button
              onClick={handleVerify}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-accent-cyan px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <Check className="h-3.5 w-3.5" /> Verificar ejercicio
            </button>
          )}
        </div>
      </div>

      <div ref={containerRef} className="h-[420px] w-full px-2 py-2" />
    </div>
  );
}
