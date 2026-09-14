'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Info,
  Mic,
  MicOff,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Volume2,
} from 'lucide-react';

/** Clave donde se guarda el consentimiento del micrófono. */
export const MIC_CONSENT_KEY = 'educatecomas-mic-consent';

interface Turn {
  say: string;
  expect: string[];
  example: string;
  tip: string;
}

interface Scenario {
  id: string;
  title: string;
  emoji: string;
  level: string;
  turns: Turn[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'presentarse',
    title: 'Presentarme',
    emoji: '👋',
    level: 'Principiante',
    turns: [
      {
        say: "Hi! I'm Ana. What's your name?",
        expect: ['name is', 'my name'],
        example: 'My name is Luis. Nice to meet you!',
        tip: 'Para decir tu nombre: "My name is ..." o "I\'m ...".',
      },
      {
        say: 'Nice to meet you! How old are you?',
        expect: ['i am', 'years old'],
        example: "I'm fifteen years old.",
        tip: 'La edad se dice con el verbo "to be": "I am 15 years old".',
      },
      {
        say: 'Great! Where are you from?',
        expect: ['i am from', 'from'],
        example: "I'm from Comas, in Lima.",
        tip: '"I\'m from + lugar" sirve para cualquier ciudad o país.',
      },
      {
        say: 'Cool! What do you like to do in your free time?',
        expect: ['i like', 'like'],
        example: 'I like playing football and listening to music.',
        tip: 'Después de "I like" puedes usar un verbo en -ing: "I like reading".',
      },
    ],
  },
  {
    id: 'cafe',
    title: 'En la cafetería',
    emoji: '☕',
    level: 'Principiante',
    turns: [
      {
        say: 'Good morning! Welcome. What would you like to drink?',
        expect: ['would like', 'i want', 'can i have'],
        example: "I'd like a coffee, please.",
        tip: '"I\'d like ..." (I would like) es la forma más educada de pedir.',
      },
      {
        say: 'Sure! Would you like something to eat?',
        expect: ['yes', 'no', 'please', 'sandwich', 'cake'],
        example: "Yes, please. I'd like a sandwich.",
        tip: 'Recuerda añadir "please" al final para ser amable.',
      },
      {
        say: 'Perfect. Anything else?',
        expect: ['no', 'that is all', 'nothing'],
        example: "No, that's all. Thank you!",
        tip: '"That\'s all, thank you" cierra el pedido de forma natural.',
      },
    ],
  },
  {
    id: 'tienda',
    title: 'De compras',
    emoji: '🛍️',
    level: 'Básico',
    turns: [
      {
        say: 'Hello! Can I help you?',
        expect: ['yes', 'looking for', 'how much', 'i would like'],
        example: "Yes, I'm looking for a T-shirt.",
        tip: '"I\'m looking for ..." es lo que se dice al buscar algo.',
      },
      {
        say: 'Of course. What size do you need?',
        expect: ['size', 'small', 'medium', 'large'],
        example: 'I need a medium size, please.',
        tip: 'Las tallas: small (S), medium (M), large (L).',
      },
      {
        say: 'Here you are. How would you like to pay?',
        expect: ['cash', 'card', 'pay'],
        example: "I'd like to pay in cash.",
        tip: '"In cash" (efectivo) o "by card" (tarjeta).',
      },
    ],
  },
  {
    id: 'colegio',
    title: 'En clase',
    emoji: '🎒',
    level: 'Básico',
    turns: [
      {
        say: "Hello! What's your favourite subject at school?",
        expect: ['favourite', 'favorite', 'subject'],
        example: 'My favourite subject is English.',
        tip: 'En inglés americano: "favorite"; en británico: "favourite".',
      },
      {
        say: 'Nice! Why do you like it?',
        expect: ['because', 'like'],
        example: 'Because I like learning new words.',
        tip: 'Usa "because" para dar la razón: "Because it\'s fun".',
      },
      {
        say: 'Do you study English every day?',
        expect: ['yes', 'no', 'every day', 'sometimes'],
        example: 'Yes, I study English every day after school.',
        tip: '"Every day" son dos palabras (todos los días).',
      },
    ],
  },
  {
    id: 'conversacion',
    title: 'Charla libre',
    emoji: '💬',
    level: 'Intermedio',
    turns: [
      {
        say: 'Hey! How are you today?',
        expect: ['i am', 'fine', 'good', 'happy'],
        example: "I'm fine, thank you! And you?",
        tip: 'Devolver la pregunta con "And you?" hace la charla natural.',
      },
      {
        say: "I'm good, thanks! Did you do anything fun yesterday?",
        expect: ['yes', 'no', 'yesterday', 'played', 'watched', 'went'],
        example: 'Yes! I played football with my friends.',
        tip: 'Para el pasado: "play" → "played", "go" → "went", "watch" → "watched".',
      },
      {
        say: 'That sounds great. What are you going to do this weekend?',
        expect: ['going to', 'will', 'weekend'],
        example: "I'm going to visit my grandmother this weekend.",
        tip: 'Planes: "I\'m going to + verbo".',
      },
      {
        say: 'Lovely! Thanks for practising with me. See you next time!',
        expect: ['thank', 'bye', 'see you'],
        example: 'Thank you! See you next time. Bye!',
        tip: 'Despedirse: "See you!", "Bye!", "Take care!".',
      },
    ],
  },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function evaluar(dicho: string, turn: Turn) {
  const said = normalize(dicho);
  const words = new Set(said.split(' ').filter(Boolean));
  const matched: string[] = [];
  const missing: string[] = [];
  for (const key of turn.expect) {
    const k = normalize(key);
    const ok = k.includes(' ') ? said.includes(k) : words.has(k);
    (ok ? matched : missing).push(key);
  }
  const base = turn.expect.length ? matched.length / turn.expect.length : 0;
  const objetivo = normalize(turn.example).split(' ').length;
  const bonus = Math.min(1, words.size / Math.max(objetivo, 1)) * 0.2;
  const pct = Math.round(Math.min(1, base * 0.85 + bonus) * 100);
  return { pct, matched, missing };
}

function estrellas(pct: number) {
  if (pct >= 85) return 3;
  if (pct >= 60) return 2;
  return 1;
}

function mensaje(pct: number) {
  if (pct >= 90) return '¡Excelente! Sonó muy natural. 🎉';
  if (pct >= 75) return '¡Muy bien! Solo cuida algún detalle. 👏';
  if (pct >= 50) return '¡Buen intento! Repite la frase despacio. 💪';
  return 'Casi. Escucha otra vez y vuelve a intentarlo con calma. 🙂';
}

export default function EnglishTutor() {
  const [cargado, setCargado] = useState(false);
  const [consent, setConsent] = useState<boolean | null>(null);
  const [supported, setSupported] = useState(true);
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [turnIndex, setTurnIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<{ pct: number; matched: string[]; missing: string[] } | null>(null);
  const [autoMode, setAutoMode] = useState(true);
  const [aviso, setAviso] = useState('');
  const [vozLocal, setVozLocal] = useState(false);

  const recRef = useRef<any>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const finalRef = useRef<(t: string) => void>(() => {});

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const turn = scenario.turns[turnIndex];

  // --- Consentimiento guardado ---
  useEffect(() => {
    let ok = false;
    try {
      ok = window.localStorage.getItem(MIC_CONSENT_KEY) === 'si';
    } catch {
      ok = false;
    }
    setConsent(ok);
    setCargado(true);
  }, []);

  // --- Motor de voz: precarga de voces (voz local = sin ida y vuelta a la red) ---
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const cargar = () => {
      const voces = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'));
      if (!voces.length) return;
      const mejor =
        voces.find((v) => v.localService && /en[-_]us/i.test(v.lang)) ||
        voces.find((v) => /en[-_]us/i.test(v.lang)) ||
        voces.find((v) => v.localService) ||
        voces[0];
      voiceRef.current = mejor;
      setVozLocal(Boolean(mejor.localService));
    };
    cargar();
    synth.addEventListener?.('voiceschanged', cargar);
    return () => synth.removeEventListener?.('voiceschanged', cargar);
  }, []);

  // --- Reconocimiento: una sola instancia reutilizada (evita el retardo de crearla cada vez) ---
  useEffect(() => {
    const w = window as any;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e: any) => {
      let parcial = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const texto = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += texto;
        else parcial += texto;
      }
      if (parcial) setTranscript(parcial);
      if (final) {
        setTranscript(final);
        finalRef.current(final.trim());
      }
    };
    rec.onerror = (e: any) => {
      setListening(false);
      if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
        setAviso('El navegador bloqueó el micrófono. Actívalo en el candado de la barra de direcciones.');
      } else if (e?.error === 'no-speech') {
        setAviso('No escuché nada. Acércate al micrófono y prueba otra vez.');
      } else if (e?.error !== 'aborted') {
        setAviso('Hubo un problema con el micrófono. Inténtalo de nuevo.');
      }
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {
        /* nada */
      }
      recRef.current = null;
    };
  }, []);

  // --- Voz del tutor ---
  const hablar = useCallback((texto: string, alTerminar?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    synth.cancel(); // sin cola: responde al instante
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'en-US';
    u.rate = 0.92;
    u.pitch = 1;
    if (voiceRef.current) u.voice = voiceRef.current;
    u.onstart = () => setSpeaking(true);
    u.onend = () => {
      setSpeaking(false);
      alTerminar?.();
    };
    u.onerror = () => setSpeaking(false);
    synth.speak(u);
  }, []);

  const escucharAhora = useCallback((texto: string) => hablar(texto), [hablar]);

  const empezarAEscuchar = useCallback(() => {
    const rec = recRef.current;
    if (!rec) return;
    setAviso('');
    setResult(null);
    setTranscript('');
    try {
      rec.start();
      setListening(true);
    } catch {
      /* ya estaba escuchando */
    }
  }, []);

  const pararDeEscuchar = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* nada */
    }
    setListening(false);
  }, []);

  // Al detectar la frase completa: evaluar y dar retroalimentación
  useEffect(() => {
    finalRef.current = (texto: string) => {
      const r = evaluar(texto, turn);
      setResult(r);
      setListening(false);
      const puntos = estrellas(r.pct);
      if (puntos === 3) hablar('Excellent! Well done.', undefined);
    };
  });

  // El tutor habla solo al empezar cada turno (modo conversación)
  useEffect(() => {
    if (consent !== true || !supported || !autoMode) return;
    const id = window.setTimeout(() => hablar(turn.say), 150);
    return () => window.clearTimeout(id);
  }, [consent, supported, autoMode, turn, hablar]);

  function aceptarMicrofono() {
    try {
      window.localStorage.setItem(MIC_CONSENT_KEY, 'si');
    } catch {
      /* nada */
    }
    setConsent(true);
    // Calentamos el motor de voz en el mismo gesto del usuario (primera frase sin retardo)
    try {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch {
      /* nada */
    }
    // Pedimos el permiso del micrófono de inmediato, así luego es instantáneo
    navigator.mediaDevices
      ?.getUserMedia({ audio: true })
      .then((s) => s.getTracks().forEach((t) => t.stop()))
      .catch(() => setAviso('No diste permiso al micrófono: puedes practicar en modo "solo escuchar".'));
  }

  function seguirSinMicrofono() {
    setConsent(false);
  }

  function cambiarEleccion() {
    try {
      window.localStorage.removeItem(MIC_CONSENT_KEY);
    } catch {
      /* nada */
    }
    setConsent(false);
  }

  function siguienteTurno() {
    setResult(null);
    setTranscript('');
    setAviso('');
    if (turnIndex < scenario.turns.length - 1) {
      setTurnIndex(turnIndex + 1);
    } else {
      setTurnIndex(0);
    }
  }

  function elegirEscenario(id: string) {
    setScenarioId(id);
    setTurnIndex(0);
    setResult(null);
    setTranscript('');
    setAviso('');
  }

  const progreso = Math.round(((turnIndex + 1) / scenario.turns.length) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* ---------------- Consentimiento del micrófono ---------------- */}
      {cargado && consent !== true && (
        <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <ShieldCheck className="h-5 w-5 text-sky-600" />
            Antes de empezar: permiso para usar el micrófono
          </h2>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-600">
            <p>
              Para practicar conversación necesitamos escuchar tu voz. El reconocimiento de voz lo
              hace <strong>Web Speech API</strong>, una función de tu navegador, y{' '}
              <strong>el audio se envía y se procesa en los servidores del proveedor de tu navegador</strong>{' '}
              (por ejemplo, Google si usas Chrome o Android, Microsoft si usas Edge, o Apple si usas
              Safari), según las políticas de privacidad de ese proveedor.
            </p>
            <p>
              Edúcate Comas <strong>no recibe, no escucha ni guarda</strong> tu voz: solo vemos el
              texto que tu propio navegador nos devuelve para decirte si la frase está bien. Puedes
              practicar sin micrófono en el <strong>modo solo escuchar</strong>.
            </p>
            <p className="rounded-xl bg-sky-50 px-4 py-3 text-sky-800">
              <Info className="mr-1.5 inline h-4 w-4" />
              Más detalles en nuestra{' '}
              <Link href="/privacidad#voz" className="font-semibold underline">
                Política de Privacidad · apartado de voz
              </Link>
              .
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={aceptarMicrofono}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-3 font-semibold text-white shadow-glow transition hover:brightness-105"
            >
              <Mic className="h-4 w-4" />
              Aceptar y usar el micrófono
            </button>
            <button
              type="button"
              onClick={seguirSinMicrofono}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              <MicOff className="h-4 w-4" />
              Practicar solo escuchando
            </button>
          </div>
        </section>
      )}

      {!supported && consent === true && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Tu navegador no permite el reconocimiento de voz. Puedes practicar en{' '}
          <strong>modo solo escuchar</strong> y repetir las frases en voz alta. Si quieres usar el
          micrófono, abre la web en Chrome, Edge o Safari.
        </div>
      )}

      {/* ---------------- Escenarios ---------------- */}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Elige una situación</h2>
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => {
            const activo = s.id === scenarioId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => elegirEscenario(s.id)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  activo
                    ? 'border-sky-400 bg-sky-50 text-sky-800 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50'
                }`}
              >
                <span aria-hidden>{s.emoji}</span>
                {s.title}
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                  {s.level}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---------------- Conversación ---------------- */}
      <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              Turno {turnIndex + 1} de {scenario.turns.length}
            </span>
            <span className="text-xs text-slate-500">{scenario.emoji} {scenario.title}</span>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
            <input
              type="checkbox"
              checked={autoMode}
              onChange={(e) => setAutoMode(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600"
            />
            Modo conversación (el tutor habla solo)
          </label>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>

        {/* Burbuja del tutor */}
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-lg shadow-sm">
            🤖
          </span>
          <div className="flex-1 rounded-2xl rounded-tl-sm bg-sky-50 px-5 py-4">
            <p className="text-lg font-medium leading-relaxed text-slate-800">{turn.say}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => escucharAhora(turn.say)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-sm transition hover:bg-sky-100"
              >
                <Volume2 className="h-3.5 w-3.5" />
                Escuchar otra vez
              </button>
              <span className="text-xs text-slate-500">
                {speaking ? 'El tutor está hablando…' : vozLocal ? 'Voz del dispositivo (sin retardo)' : 'Voz del navegador'}
              </span>
            </div>
          </div>
        </div>

        {/* Micrófono */}
        {consent === true && supported && (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50 p-5">
            <button
              type="button"
              onPointerDown={empezarAEscuchar}
              onPointerUp={pararDeEscuchar}
              onPointerLeave={() => listening && pararDeEscuchar()}
              className={`relative flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95 ${
                listening
                  ? 'bg-gradient-to-br from-rose-400 to-rose-600'
                  : 'bg-gradient-to-br from-sky-400 to-indigo-500 hover:brightness-105'
              }`}
              aria-label={listening ? 'Escuchando…' : 'Mantén pulsado para hablar'}
            >
              {listening && (
                <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/40" />
              )}
              <Mic className="relative h-8 w-8" />
            </button>
            <p className="text-sm font-semibold text-slate-700">
              {listening ? 'Te estoy escuchando…' : 'Mantén pulsado y responde en inglés'}
            </p>
            <p className="h-6 text-base italic text-slate-600">{transcript || '\u00A0'}</p>
            <button
              type="button"
              onClick={cambiarEleccion}
              className="text-xs text-slate-400 underline transition hover:text-slate-600"
            >
              Desactivar el micrófono
            </button>
          </div>
        )}

        {consent === false && (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 p-5 text-center">
            <MicOff className="h-6 w-6 text-slate-400" />
            <p className="text-sm text-slate-600">
              Estás en <strong>modo solo escuchar</strong>. Repite la frase en voz alta y compara con
              la respuesta modelo.
            </p>
            <button
              type="button"
              onClick={aceptarMicrofono}
              className="mt-1 inline-flex items-center gap-2 rounded-xl border border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              <Mic className="h-4 w-4" />
              Activar el micrófono
            </button>
          </div>
        )}

        {aviso && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {aviso}
          </p>
        )}

        {/* Resultado */}
        {result && (
          <div className="flex flex-col gap-3 rounded-2xl border border-sky-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((n) => (
                  <Star
                    key={n}
                    className={`h-6 w-6 ${
                      n < estrellas(result.pct) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-slate-700">{result.pct}%</span>
              </div>
              <p className="text-sm font-semibold text-slate-700">{mensaje(result.pct)}</p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {result.matched.map((w) => (
                <span
                  key={w}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700"
                >
                  <Check className="h-3 w-3" />
                  {w}
                </span>
              ))}
              {result.missing.map((w) => (
                <span
                  key={w}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700"
                >
                  <Sparkles className="h-3 w-3" />
                  falta: {w}
                </span>
              ))}
            </div>

            <div className="rounded-xl bg-sky-50 px-4 py-3">
              <p className="text-sm text-slate-700">
                <strong>Respuesta modelo:</strong> {turn.example}
              </p>
              <button
                type="button"
                onClick={() => escucharAhora(turn.example)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 underline"
              >
                <Volume2 className="h-3.5 w-3.5" />
                Escuchar la respuesta modelo
              </button>
            </div>

            <p className="flex items-start gap-2 text-sm text-slate-600">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
              {turn.tip}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setTranscript('');
                  empezarAEscuchar();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <RotateCcw className="h-4 w-4" />
                Intentar otra vez
              </button>
              <button
                type="button"
                onClick={siguienteTurno}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-105"
              >
                Siguiente frase
              </button>
            </div>
          </div>
        )}

        {!result && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={siguienteTurno}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Saltar frase
            </button>
          </div>
        )}
      </section>

      <p className="flex items-start gap-2 rounded-2xl bg-white/70 p-4 text-xs leading-relaxed text-slate-500">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        Tu voz se procesa en los servidores del proveedor de tu navegador mediante Web Speech API.
        Edúcate Comas no guarda tu audio ni su transcripción. Puedes desactivar el micrófono cuando
        quieras o leer más en la{' '}
        <Link href="/privacidad#voz" className="font-semibold text-sky-700 underline">
          Política de Privacidad
        </Link>
        .
      </p>
    </div>
  );
}
