import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Mic, Volume2 } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import EnglishTutor from '@/components/EnglishTutor';

export const metadata: Metadata = {
  title: 'Tutor de conversación en inglés | Edúcate Comas',
  description:
    'Practica inglés hablando con un tutor virtual: escucha, responde en voz alta y recibe correcciones al instante. Usa el micrófono solo si lo autorizas.',
};

export default function TutorInglesPage() {
  return (
    <div className="animate-fade-up mx-auto flex max-w-3xl flex-col gap-6">
      <Breadcrumbs
        items={[{ label: 'Inglés Básico', href: '/course/ingles-basico' }, { label: 'Tutor de conversación' }]}
      />

      <header className="flex flex-col gap-3">
        <span className="flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm font-medium text-sky-700">
          <Mic className="h-4 w-4" />
          Habla y practica como en una conversación real
        </span>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Tutor de conversación en inglés
        </h1>
        <p className="text-slate-600">
          Elige una situación, escucha al tutor y responde <strong>en voz alta</strong>. Te diremos
          al instante qué palabras dijiste bien y cuáles puedes mejorar, sin exámenes y sin prisas.
          Ideal para perder el miedo a hablar.
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
            <Volume2 className="h-3.5 w-3.5 text-sky-600" />
            5 situaciones cotidianas
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
            <GraduationCap className="h-3.5 w-3.5 text-sky-600" />
            De principiante a intermedio
          </span>
        </div>
      </header>

      <EnglishTutor />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 font-semibold text-slate-900">Consejos para aprovecharlo</h2>
        <ul className="flex flex-col gap-1.5 text-sm text-slate-600">
          <li>• Busca un lugar tranquilo: el micrófono capta mejor tu voz sin ruido.</li>
          <li>• No pasa nada por equivocarse: repite la frase las veces que quieras.</li>
          <li>• Primero escucha al tutor, después responde con tus propias palabras.</li>
          <li>• Si estás empezando, activa el «modo conversación» y el tutor hablará solo.</li>
        </ul>
        <Link
          href="/course/ingles-basico"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:underline"
        >
          Volver al curso de Inglés Básico
        </Link>
      </section>
    </div>
  );
}
