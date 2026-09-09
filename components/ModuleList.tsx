'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronDown, GraduationCap, TerminalSquare } from 'lucide-react';
import type { Module } from '@/lib/types';
import { cn, LESSON_TYPE_LABEL } from '@/lib/utils';

function typeIcon(type: string) {
  if (type === 'practice') return <TerminalSquare className="h-4 w-4 text-sky-600" />;
  if (type === 'exam') return <GraduationCap className="h-4 w-4 text-indigo-600" />;
  return <BookOpen className="h-4 w-4 text-sky-600" />;
}

function typeBadge(type: string) {
  const styles: Record<string, string> = {
    chapter: 'bg-sky-100 text-sky-700 border-sky-200',
    practice: 'bg-blue-100 text-blue-700 border-blue-200',
    exam: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };
  return (
    <span className={cn('rounded-full border px-2 py-0.5 text-[11px] font-semibold', styles[type] ?? styles.chapter)}>
      {LESSON_TYPE_LABEL[type] ?? type}
    </span>
  );
}

export default function ModuleList({ modules }: { modules: Module[] }) {
  const [open, setOpen] = useState<number | null>(modules[0]?.id ?? null);

  if (!modules.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Este curso aún no tiene módulos.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {modules.map((mod) => {
        const isOpen = open === mod.id;
        const lessons = mod.lessons ?? [];
        return (
          <div key={mod.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <button
              onClick={() => setOpen(isOpen ? null : mod.id)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-sky-50/60"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 font-mono text-sm font-bold text-sky-700">
                {mod.order_num}
              </span>
              <span className="flex-1 text-base font-semibold text-slate-800">{mod.title}</span>
              <span className="hidden text-xs text-slate-500 sm:block">
                {lessons.length} {lessons.length === 1 ? 'lección' : 'lecciones'}
              </span>
              <ChevronDown
                className={cn('h-5 w-5 text-slate-400 transition-transform', isOpen && 'rotate-180')}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <ul className="border-t border-slate-100 bg-sky-50/40 px-5 py-2">
                    {lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          href={`/lesson/${lesson.id}`}
                          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-white"
                        >
                          {typeIcon(lesson.type)}
                          <span className="flex-1 text-sm text-slate-600 transition group-hover:text-slate-900">
                            {lesson.title}
                          </span>
                          {typeBadge(lesson.type)}
                        </Link>
                      </li>
                    ))}
                    {lessons.length === 0 && (
                      <li className="px-3 py-3 text-sm text-slate-500">Sin lecciones todavía.</li>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
