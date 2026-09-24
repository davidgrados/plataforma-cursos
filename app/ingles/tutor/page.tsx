import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Mic, Sparkles, Volume2 } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import TutorAI from '@/components/TutorAI';

export const metadata: Metadata = {
  title: 'Colliq · Asistente de inglés con IA | Edúcate Comas',
  description:
    'Habla en inglés con Colliq, tu asistente de IA: te escucha, te corrige con cariño y conversa contigo. Usa el micrófono solo si lo autorizas.',
};

export default function TutorInglesPage() {
  return (
    <div className="animate-fade-up mx-auto flex max-w-3xl flex-col gap-6">
      <Breadcrumbs
        items={[{ label: 'Inglés Básico', href: '/course/ingles-basico' }, { label: 'Práctica de conversación' }]}
      />

      <header className="flex flex-col gap-3">
        <span className="flex w-fit items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-1.5 text-sm font-medium text-violet-700">
          <Sparkles className="h-4 w-4" />
          Práctica extra del curso · con inteligencia artificial
        </span>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Colliq, tu asistente de inglés con IA
        </h1>
        <p className="text-slate-600">
          Elige el <strong>módulo</strong> que estás estudiando, toca el orbe y habla{' '}
          <strong>en voz alta</strong>. Colliq te escucha, te responde y te corrige con cariño al
          instante, como en una conversación real. Sin exámenes y sin prisas.
        </p>
        <p className="rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-800">
          📚 Esto es una <strong>práctica complementaria al final del curso</strong>: las lecciones y
          el examen están en{' '}
          <Link href="/course/ingles-basico" className="font-semibold underline">
            Inglés Básico
          </Link>
          . Aquí solo practicas a hablar de lo que ya estudiaste.
        </p>
      </header>

      {/* Presentación amigable de Colliq */}
      <section className="flex flex-col items-center gap-5 rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-6 shadow-sm sm:flex-row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/colliq.jpg"
          alt="Colliq, tu asistente de inteligencia artificial"
          className="h-32 w-32 shrink-0 rounded-3xl object-cover shadow-md sm:h-36 sm:w-36"
        />
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h2 className="text-lg font-bold text-slate-900">¡Hola! Soy Colliq 🦉</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Soy tu <strong>asistente de inteligencia artificial</strong>. Estoy aquí para ayudarte,
            resolver tus dudas y hacer tu experiencia más fácil: elige un módulo, toca el orbe y
            háblame en inglés. Te escucho, te corrijo con cariño y te contesto con voz. Y si un día no
            puedes usar el micrófono, <strong>escríbeme</strong> y practicamos igual.
          </p>
          <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm">
            Tecnología para todos
          </span>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
          <Volume2 className="h-3.5 w-3.5 text-sky-600" />
          7 módulos + repaso del examen
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
          <GraduationCap className="h-3.5 w-3.5 text-sky-600" />
          De principiante a intermedio
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
          <Mic className="h-3.5 w-3.5 text-sky-600" />
          También puedes escribir tus respuestas
        </span>
      </div>

      <TutorAI />

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
