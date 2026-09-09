'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Save, TriangleAlert } from 'lucide-react';
import type { Lesson, LessonType, Module } from '@/lib/types';
import { cn } from '@/lib/utils';
import MarkdownEditor from './MarkdownEditor';

const TYPES: { value: LessonType; label: string }[] = [
  { value: 'chapter', label: 'Capítulo (teoría)' },
  { value: 'practice', label: 'Práctica (terminal)' },
  { value: 'exam', label: 'Examen' },
];

const DEFAULT_FS = JSON.stringify(
  {
    home: { student: { documentos: {}, 'notas.txt': 'Apuntes\n' } },
    etc: { hosts: '127.0.0.1 localhost\n' },
    tmp: {},
  },
  null,
  2,
);

interface Props {
  lesson?: Lesson | null;
  modules: Module[];
  onSave: (payload: Partial<Lesson>) => Promise<void>;
  onCancel?: () => void;
  onUploadImage?: (file: File) => Promise<string>;
  busy?: boolean;
}

export default function LessonForm({
  lesson,
  modules,
  onSave,
  onCancel,
  onUploadImage,
  busy = false,
}: Props) {
  const [moduleId, setModuleId] = useState<number | ''>(lesson?.module_id ?? '');
  const [title, setTitle] = useState(lesson?.title ?? '');
  const [type, setType] = useState<LessonType>(lesson?.type ?? 'chapter');
  const [orderNum, setOrderNum] = useState<number>(lesson?.order_num ?? 0);
  const [content, setContent] = useState(lesson?.content_md ?? '');
  const [initialFs, setInitialFs] = useState(lesson?.initial_fs ?? DEFAULT_FS);
  const [checkLogic, setCheckLogic] = useState(lesson?.check_logic ?? '');

  useEffect(() => {
    if (lesson) {
      setModuleId(lesson.module_id);
      setTitle(lesson.title);
      setType(lesson.type);
      setOrderNum(lesson.order_num);
      setContent(lesson.content_md);
      setInitialFs(lesson.initial_fs);
      setCheckLogic(lesson.check_logic ?? '');
    }
  }, [lesson]);

  const [fsValid, setFsValid] = useState(true);
  useEffect(() => {
    try {
      JSON.parse(initialFs);
      setFsValid(true);
    } catch {
      setFsValid(false);
    }
  }, [initialFs]);

  const [checkValid, setCheckValid] = useState(true);
  useEffect(() => {
    const value = checkLogic.trim();
    if (!value) return setCheckValid(true);
    try {
      JSON.parse(value);
      setCheckValid(true);
    } catch {
      setCheckValid(false);
    }
  }, [checkLogic]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!moduleId) return toast.error('Selecciona un módulo.');
    if (!title.trim()) return toast.error('El título es obligatorio.');
    if (!fsValid) return toast.error('El JSON de initial_fs no es válido.');
    if (!checkValid) return toast.error('El JSON de validación (check_logic) no es válido.');

    await onSave({
      id: lesson?.id,
      module_id: Number(moduleId),
      title: title.trim(),
      type,
      order_num: orderNum,
      content_md: content,
      initial_fs: initialFs,
      check_logic: checkLogic.trim() || null,
    });
  }

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm text-slate-600">
          Módulo
          <select
            value={moduleId}
            onChange={(e) => setModuleId(Number(e.target.value))}
            className={inputCls}
          >
            <option value="">— Selecciona un módulo —</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.order_num}. {m.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-slate-600">
          Título
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Capítulo 4 — Competencias de línea de comandos"
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-slate-600">
          Tipo de lección
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LessonType)}
            className={inputCls}
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-slate-600">
          Orden
          <input
            type="number"
            value={orderNum}
            onChange={(e) => setOrderNum(Number(e.target.value))}
            className={inputCls}
          />
        </label>
      </div>

      <div className="flex flex-col gap-1.5 text-sm text-slate-600">
        <span>Contenido (Markdown)</span>
        <MarkdownEditor value={content} onChange={setContent} onUploadImage={onUploadImage} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm text-slate-600">
          <span className="flex items-center justify-between">
            Sistema de archivos inicial (JSON)
            <span
              className={cn(
                'text-xs font-medium',
                fsValid ? 'text-accent' : 'text-red-400',
              )}
            >
              {fsValid ? '✓ JSON válido' : '✗ JSON inválido'}
            </span>
          </span>
          <textarea
            value={initialFs}
            onChange={(e) => setInitialFs(e.target.value)}
            rows={12}
            spellCheck={false}
            className={cn(inputCls, 'font-mono text-xs leading-relaxed', !fsValid && 'border-red-500/50')}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-slate-600">
          <span className="flex items-center justify-between">
            Validación del ejercicio (JSON)
            <span
              className={cn(
                'text-xs font-medium',
                checkValid ? 'text-accent' : 'text-red-400',
              )}
            >
              {checkValid ? '✓ JSON válido' : '✗ JSON inválido'}
            </span>
          </span>
          <textarea
            value={checkLogic}
            onChange={(e) => setCheckLogic(e.target.value)}
            rows={12}
            spellCheck={false}
            placeholder={`{ "checks": [ { "kind": "isDir", "path": "/home/student/proyectos", "message": "Crea el directorio proyectos" } ] }`}
            className={cn(inputCls, 'font-mono text-xs leading-relaxed', !checkValid && 'border-red-500/50')}
          />
          <span className="flex items-start gap-1.5 text-xs text-slate-500">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Tipos de <code className="text-accent-cyan">kind</code>: <b>exists</b>, <b>isDir</b>,{' '}
              <b>isFile</b>, <b>contains</b> (con <code className="text-accent-cyan">value</code>),{' '}
              <b>equals</b>. Todas las comprobaciones deben cumplirse.
            </span>
          </span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={busy}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {busy ? 'Guardando…' : 'Guardar lección'}
        </button>
      </div>
    </form>
  );
}
