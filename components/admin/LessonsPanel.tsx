'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Course, Lesson, Module } from '@/lib/types';
import LessonForm from '@/components/LessonForm';

interface Props {
  clerkId?: string | null;
}

export default function LessonsPanel({ clerkId }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState<number | ''>('');
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleId, setModuleId] = useState<number | ''>('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .courses()
      .then(setCourses)
      .catch((e) => toast.error(e.message));
  }, []);

  async function loadStructure(slug: string) {
    const detail = await api.course(slug);
    setModules(detail.modules);
  }

  async function loadLessons(moduleId: number) {
    setLoading(true);
    try {
      setLessons(await api.admin.listLessons(clerkId || undefined, moduleId));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function onSelectCourse(id: string) {
    const cid = Number(id);
    setCourseId(cid);
    setModuleId('');
    setLessons([]);
    setEditing(null);
    setCreating(false);
    const course = courses.find((c) => c.id === cid);
    if (course) loadStructure(course.slug);
  }

  function onSelectModule(id: string) {
    const mid = Number(id);
    setModuleId(mid);
    setEditing(null);
    setCreating(false);
    loadLessons(mid);
  }

  async function handleSave(payload: Partial<Lesson>) {
    setBusy(true);
    try {
      await api.admin.upsertLesson(payload, clerkId || undefined);
      toast.success(payload.id ? 'Lección actualizada.' : 'Lección creada.');
      setEditing(null);
      setCreating(false);
      if (moduleId) loadLessons(Number(moduleId));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(lesson: Lesson) {
    if (!confirm(`¿Eliminar la lección "${lesson.title}"?`)) return;
    try {
      await api.admin.deleteLesson(lesson.id, clerkId || undefined);
      toast.success('Lección eliminada.');
      if (moduleId) loadLessons(Number(moduleId));
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function handleUploadImage(file: File): Promise<string> {
    const { url } = await api.admin.uploadImage(file, clerkId || undefined);
    return url;
  }

  const input =
    'w-full rounded-xl border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-sm text-slate-200 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20';

  const typeColor: Record<string, string> = {
    chapter: 'text-accent-cyan',
    practice: 'text-accent',
    exam: 'text-violet-300',
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <select value={courseId} onChange={(e) => onSelectCourse(e.target.value)} className={input}>
          <option value="">— Curso —</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          value={moduleId}
          onChange={(e) => onSelectModule(e.target.value)}
          disabled={!courseId}
          className={input}
        >
          <option value="">— Módulo —</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.order_num}. {m.title}
            </option>
          ))}
        </select>
      </div>

      {moduleId && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Lecciones</h2>
            <button
              onClick={() => {
                setCreating(true);
                setEditing(null);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent to-accent-cyan px-3 py-2 text-sm font-semibold text-ink-950 transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Nueva lección
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-8 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" /> Cargando lecciones…
            </div>
          ) : (
            lessons.map((l) => (
              <div key={l.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-ink-900/60 px-4 py-3">
                <span className={`w-20 shrink-0 font-mono text-xs uppercase ${typeColor[l.type] ?? 'text-slate-400'}`}>
                  {l.type}
                </span>
                <span className="flex-1 truncate text-sm text-slate-200">{l.title}</span>
                <button
                  onClick={() => {
                    setEditing(l);
                    setCreating(false);
                  }}
                  className="rounded-lg border border-ink-700 px-2.5 py-1.5 text-xs text-slate-300 transition hover:bg-white/5"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(l)}
                  className="rounded-lg border border-red-500/20 p-2 text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}

          {(creating || editing) && (
            <div className="rounded-2xl border border-white/5 bg-ink-900/60 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">
                  {editing ? 'Editar lección' : 'Nueva lección'}
                </h3>
                <button
                  onClick={() => {
                    setCreating(false);
                    setEditing(null);
                  }}
                  className="text-slate-400 transition hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <LessonForm
                lesson={editing ? { ...editing, module_id: Number(moduleId) } : null}
                modules={modules}
                onSave={handleSave}
                onCancel={() => {
                  setCreating(false);
                  setEditing(null);
                }}
                onUploadImage={handleUploadImage}
                busy={busy}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
