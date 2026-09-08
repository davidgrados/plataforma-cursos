'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Course, Module } from '@/lib/types';

interface Props {
  clerkId?: string | null;
}

export default function ModulesPanel({ clerkId }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState<number | ''>('');
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Module | null>(null);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    api
      .courses()
      .then(setCourses)
      .catch((e) => toast.error(e.message));
  }, []);

  async function loadModules(courseSlug: string) {
    setLoading(true);
    try {
      const detail = await api.course(courseSlug);
      setModules(detail.modules);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function onSelectCourse(id: string) {
    const cid = Number(id);
    setCourseId(cid);
    setEditing(null);
    setTitle('');
    const course = courses.find((c) => c.id === cid);
    if (course) loadModules(course.slug);
  }

  function resetForm() {
    setEditing(null);
    setTitle('');
    setOrder(0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId) return toast.error('Selecciona un curso.');
    if (!title.trim()) return toast.error('El título es obligatorio.');

    try {
      if (editing) {
        await api.admin.updateModule(editing.id, { title, order_num: order }, clerkId || undefined);
        toast.success('Módulo actualizado.');
      } else {
        const nextOrder = order || (modules.length ? Math.max(...modules.map((m) => m.order_num)) + 1 : 1);
        await api.admin.createModule(
          { course_id: Number(courseId), title, order_num: nextOrder },
          clerkId || undefined,
        );
        toast.success('Módulo creado.');
      }
      resetForm();
      const course = courses.find((c) => c.id === Number(courseId));
      if (course) loadModules(course.slug);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function handleDelete(mod: Module) {
    if (!confirm(`¿Eliminar el módulo "${mod.title}" y sus lecciones?`)) return;
    try {
      await api.admin.deleteModule(mod.id, clerkId || undefined);
      toast.success('Módulo eliminado.');
      const course = courses.find((c) => c.id === Number(courseId));
      if (course) loadModules(course.slug);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function move(mod: Module, dir: -1 | 1) {
    const idx = modules.findIndex((m) => m.id === mod.id);
    const swap = modules[idx + dir];
    if (!swap) return;
    try {
      await api.admin.updateModule(mod.id, { title: mod.title, order_num: swap.order_num }, clerkId || undefined);
      await api.admin.updateModule(swap.id, { title: swap.title, order_num: mod.order_num }, clerkId || undefined);
      const course = courses.find((c) => c.id === Number(courseId));
      if (course) loadModules(course.slug);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  const input =
    'w-full rounded-xl border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-sm text-slate-200 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm text-slate-300">
          Curso
          <select
            value={courseId}
            onChange={(e) => onSelectCourse(e.target.value)}
            className={input}
          >
            <option value="">— Selecciona un curso —</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {courseId && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-ink-900/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              {editing ? 'Editar módulo' : 'Nuevo módulo'}
            </h2>
            {editing && (
              <button onClick={resetForm} className="text-slate-400 transition hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_120px_auto]">
            <input
              className={input}
              placeholder="Nombre del módulo (ej. Módulo 4 — Competencias de línea de comandos)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className={input}
              type="number"
              placeholder="Orden"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:opacity-90"
            >
              {editing ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editing ? 'Guardar' : 'Añadir'}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" /> Cargando módulos…
          </div>
        ) : (
          modules.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-ink-900/60 px-4 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-800 font-mono text-sm font-bold text-accent">
                {m.order_num}
              </span>
              <span className="flex-1 text-sm text-slate-200">{m.title}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => move(m, -1)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button onClick={() => move(m, 1)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setEditing(m);
                    setTitle(m.title);
                    setOrder(m.order_num);
                  }}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(m)}
                  className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
        {!loading && courseId && modules.length === 0 && (
          <div className="rounded-xl border border-white/5 bg-ink-900/60 p-6 text-center text-sm text-slate-400">
            Este curso no tiene módulos. Añade el primero.
          </div>
        )}
      </div>
    </div>
  );
}
