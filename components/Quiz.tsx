'use client';

import { useState } from 'react';
import { CheckCircle2, HelpCircle, RotateCcw, XCircle } from 'lucide-react';
import type { QuizQuestion } from '@/lib/quiz-data';
import { cn } from '@/lib/utils';

function shuffleIndexes(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  // Orden (mezclado) de las opciones por pregunta, para que la correcta no caiga siempre en la A.
  const [order, setOrder] = useState<number[][]>(() =>
    questions.map((q) => shuffleIndexes(q.options.length)),
  );

  const answered = Object.keys(answers).length;
  const score = questions.reduce((acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc), 0);

  function reset() {
    setAnswers({});
    setChecked(false);
  }

  return (
    <div className="flex flex-col gap-5">
      {questions.map((q, i) => {
        const chosen = answers[i];
        const isCorrect = checked && chosen === q.answer;
        const isWrong = checked && chosen !== undefined && chosen !== q.answer;
        return (
          <div key={i} className="rounded-2xl border border-white/5 bg-ink-900/60 p-5">
            <p className="mb-3 font-medium text-white">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink-800 text-xs font-bold text-accent">
                {i + 1}
              </span>
              {q.question}
            </p>
            <div className="flex flex-col gap-2">
              {order[i].map((srcIdx, pos) => {
                const opt = q.options[srcIdx];
                const selected = chosen === srcIdx;
                const correct = checked && srcIdx === q.answer;
                return (
                  <button
                    key={srcIdx}
                    type="button"
                    onClick={() => !checked && setAnswers((a) => ({ ...a, [i]: srcIdx }))}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition',
                      selected && !checked && 'border-accent/50 bg-accent/10',
                      checked && correct && 'border-green-500/50 bg-green-500/10 text-green-300',
                      checked && selected && !correct && 'border-red-500/50 bg-red-500/10 text-red-300',
                      !selected && !checked && 'border-ink-700 hover:bg-white/5',
                      !selected && checked && 'border-ink-700 opacity-60',
                    )}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs">
                      {String.fromCharCode(65 + pos)}
                    </span>
                    <span>{opt}</span>
                    {checked && correct && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-green-400" />}
                    {checked && selected && !correct && <XCircle className="ml-auto h-4 w-4 shrink-0 text-red-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-4">
        <p className="flex items-center gap-1.5 text-sm text-slate-400">
          <HelpCircle className="h-4 w-4" />
          {checked
            ? `Puntuación: ${score} / ${questions.length}`
            : `Respondidas: ${answered} / ${questions.length}`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 rounded-xl border border-ink-700 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
          >
            <RotateCcw className="h-4 w-4" /> Reiniciar
          </button>
          <button
            type="button"
            onClick={() => setChecked(true)}
            disabled={answered < questions.length}
            className="rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-2.5 text-sm font-semibold text-ink-950 transition hover:opacity-90 disabled:opacity-50"
          >
            Comprobar respuestas
          </button>
        </div>
      </div>
    </div>
  );
}
