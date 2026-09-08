'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { useAuthUser } from '@/lib/auth-context';
import { toast } from 'sonner';
import { Check, Loader2, RefreshCw, TerminalSquare } from 'lucide-react';
import { api } from '@/lib/api';
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
}

export default function TerminalEmbed({ lessonId, verify = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const inputRef = useRef('');
  const cwdRef = useRef(HOME);
  const [busy, setBusy] = useState(false);
  const { userId } = useAuthUser();

  const prompt = useCallback(() => {
    const d = displayPath(cwdRef.current);
    return `\x1b[1;32mstudent@linux\x1b[0m:\x1b[1;34m${d}\x1b[0m$ `;
  }, []);

  const execute = useCallback(
    async (cmd: string) => {
      const t = termRef.current;
      if (!t) return;
      if (!userId) {
        t.write('\x1b[31mNo autenticado: inicia sesión para usar el terminal.\x1b[0m\r\n');
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
    [lessonId, userId, prompt],
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
    t.write(prompt());

    const sub = t.onData(handleInput);
    const onResize = () => fit.fit();
    window.addEventListener('resize', onResize);

    api
      .terminalSession(lessonId, userId || undefined)
      .then((s) => {
        if (s?.current_path) cwdRef.current = s.current_path;
      })
      .catch(() => {
        /* la sesión aún no existe */
      });

    return () => {
      sub.dispose();
      window.removeEventListener('resize', onResize);
      t.dispose();
    };
  }, [lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVerify = useCallback(async () => {
    if (!userId) {
      toast.error('Inicia sesión para verificar tu ejercicio.');
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
  }, [lessonId, userId]);

  const handleReset = useCallback(async () => {
    if (!userId) return;
    setBusy(true);
    try {
      const res = await api.terminal({ lesson_id: lessonId, action: 'reset' }, userId);
      termRef.current?.write('\r\n' + (res.output || '') + '\r\n');
      cwdRef.current = res.current_path || HOME;
      toast.info('Sesión reiniciada.');
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      termRef.current?.write(prompt());
    }
  }, [lessonId, userId, prompt]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e1e] shadow-2xl">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-ink-900 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </span>
          <span className="ml-2 flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <TerminalSquare className="h-3.5 w-3.5" /> bash — Linux (simulado)
          </span>
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
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-accent-cyan px-3 py-1.5 text-xs font-semibold text-ink-950 transition hover:opacity-90"
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
