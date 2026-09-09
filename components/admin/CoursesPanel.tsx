'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ImagePlus, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Course } from '@/lib/types';

interface Props {
  clerkId?: string | null;
}

const empty = { title: '', slug: '', description: '', image_url: '' };

export default function CoursesPanel({ clerkId }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(empty);

  async function load() {
    setLoading(true);
    try {
      setCourses(await api.admin.listCourses(clerkId || undefined));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkId]);

  function startEdit(course: Course) {
    setEditing(course);
    setForm({
      title: course.title,
      slug: course.slug,
      description: course.description ?? '',
      image_url: course.image_url ?? '',
    });
  }

  function resetForm() {
    setEditing(null);
    setForm(empty);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return toast.error('Título y slug son obligatorios.');
    setBusy(true);
    try {
      if (editing) {
        await api.admin.updateCourse(editing.id, form, clerkId || undefined);
        toast.success('Curso actualizado.');
      } else {
        await api.admin.createCourse(form, clerkId || undefined);
        toast.success('Curso creado.');
      }
      resetForm();
      await load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(course: Course) {
    if (!confirm(`¿Eliminar el curso "${course.title}" y todo su contenido?`)) return;
    try {
      await api.admin.deleteCourse(course.id, clerkId || undefined);
      toast.success('Curso eliminado.');
      if (editing?.id === course.id) resetForm();
      await load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function handleUpload(file: File) {
    try {
      const { url } = await api.admin.uploadImage(file, clerkId || undefined);
      setForm((f) => ({ ...f, image_url: url }));
      toast.success('Imagen subida.');
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  const input =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/20';

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="h-fit rounded-2xl border border-slate-200 bg-white p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            {editing ? 'Editar curso' : 'Nuevo curso'}
          </h2>
          {editing && (
            <button onClick={resetForm} className="text-slate-500 transition hover:text-slate-900">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <input
            className={input}
            placeholder="Título (ej. Inteligencia Artificial)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className={input}
            placeholder="Slug (ej. inteligencia-artificial)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
          <textarea
            className={input}
            rows={3}
            placeholder="Descripción del curso"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const inp = document.createElement('input');
                inp.type = 'file';
                inp.accept = 'image/*';
                inp.onchange = () => inp.files?.[0] && handleUpload(inp.files[0]);
                inp.click();
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-100"
            >
              <ImagePlus className="h-4 w-4" /> Subir portada
            </button>
            {form.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image_url} alt="portada" className="h-10 w-16 rounded-lg object-cover" />
            )}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editing ? 'Guardar cambios' : 'Crear curso'}
          </button>
        </div>
      </form>

      {/* Lista */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="flex items-center gap-2 py-10 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" /> Cargando…
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No hay cursos todavía.
          </div>
        ) : (
          courses.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-sky-100">
                {c.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-500">sin img</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">{c.title}</p>
                <p className="truncate font-mono text-xs text-slate-500">/{c.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(c)}
                  className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className="rounded-lg border border-red-500/20 p-2 text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
