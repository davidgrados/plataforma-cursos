'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronDown, FileText, GraduationCap, TerminalSquare } from 'lucide-react';
import type { Module } from '@/lib/types';
import { cn, LESSON_TYPE_LABEL } from '@/lib/utils';

function typeIcon(type: string) {
  if (type === 'practice') return <TerminalSquare className="h-4 w-4 text-accent" />;
  if (type === 'exam') return <GraduationCap className="h-4 w-4 text-violet-400" />;
  return <BookOpen className="h-4 w-4 text-accent-cyan" />;
}

function typeBadge(type: string) {
  const styles: Record<string, string> = {
    chapter: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
    practice: 'bg-accent/10 text-accent border-accent/20',
    exam: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  };
  return (
    <span className={cn('rounded-full border px-2 py-0.5 text-[11px] font-medium', styles[type] ?? styles.chapter)}>
      {LESSON_TYPE_LABEL[type] ?? type}
    </span>
  );
}

export default function ModuleList({ modules }: { modules: Module[] }) {
  const [open, setOpen] = useState<number | null>(modules[0]?.id ?? null);

  if (!modules.length) {
    return (
      <div className="rounded-2xl border border-white/5 bg-ink-900 p-8 text-center text-slate-400">
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
          <div
            key={mod.id}
            className="overflow-hidden rounded-2xl border border-white/5 bg-ink-900/60"
          >
            <button
              onClick={() => setOpen(isOpen ? null : mod.id)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-white/[0.03]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-800 font-mono text-sm font-bold text-accent">
                {mod.order_num}
              </span>
              <span className="flex-1 text-base font-medium text-white">{mod.title}</span>
              <span className="hidden text-xs text-slate-500 sm:block">
                {lessons.length} {lessons.length === 1 ? 'lección' : 'lecciones'}
              </span>
              <ChevronDown
                className={cn('h-5 w-5 text-slate-500 transition-transform', isOpen && 'rotate-180')}
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
                  <ul className="border-t border-white/5 bg-ink-950/40 px-5 py-2">
                    {lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          href={`/lesson/${lesson.id}`}
                          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-white/5"
                        >
                          {typeIcon(lesson.type)}
                          <span className="flex-1 text-sm text-slate-300 transition group-hover:text-white">
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
