'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Info,
  Keyboard,
  Mic,
  MicOff,
  RotateCcw,
  Send,
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

interface Practica {
  id: string;
  titulo: string;
  turns: Turn[];
}

interface Modulo {
  /** Slug de la lección del curso de inglés a la que pertenece esta práctica. */
  slug: string;
  num: number;
  titulo: string;
  emoji: string;
  nivel: string;
  practicas: Practica[];
}

/**
 * Práctica de conversación por módulo, alineada con el curso "Inglés Básico".
 * Cada módulo refuerza justo lo que el estudiante acaba de estudiar.
 */
const MODULOS: Modulo[] = [
  {
    slug: 'ingles-01',
    num: 1,
    titulo: 'Saludos y presentaciones',
    emoji: '👋',
    nivel: 'Principiante',
    practicas: [
      {
        id: 'conocer',
        titulo: 'Conocer a alguien nuevo',
        turns: [
          {
            say: "Hi! Good morning. My name is Ana. What's your name?",
            expect: ['name is', 'my name'],
            example: 'Good morning! My name is Luis.',
            tip: 'Para decir tu nombre: "My name is ..." o "I\'m ...".',
          },
          {
            say: 'Nice to meet you! How are you today?',
            expect: ['i am', 'fine', 'good', 'well'],
            example: "I'm fine, thank you. And you?",
            tip: 'Devolver la pregunta con "And you?" hace la charla natural.',
          },
          {
            say: 'Great! Where are you from?',
            expect: ['from'],
            example: "I'm from Comas, in Lima.",
            tip: '"I\'m from + lugar" sirve para cualquier ciudad o país.',
          },
          {
            say: 'Welcome! It was nice talking to you. See you later!',
            expect: ['thank', 'see you', 'bye', 'goodbye'],
            example: 'Thank you! See you later. Goodbye!',
            tip: 'Despedidas: "See you later", "Goodbye", "Have a nice day".',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-02',
    num: 2,
    titulo: 'El alfabeto y la pronunciación',
    emoji: '🔤',
    nivel: 'Principiante',
    practicas: [
      {
        id: 'deletrear',
        titulo: 'Deletrear y pronunciar',
        turns: [
          {
            say: "Hi! Let's practise the alphabet. Say the letters A, B and C.",
            expect: ['a', 'b', 'c'],
            example: 'A, B, C.',
            tip: 'En inglés la "A" suena /eɪ/ y la "B" suena /biː/.',
          },
          {
            say: 'Very good! Now spell the word HOUSE, letter by letter.',
            expect: ['h', 'o', 'u', 's', 'e'],
            example: 'H - O - U - S - E.',
            tip: 'Para deletrear se dice cada letra separada: "H, O, U, S, E".',
          },
          {
            say: 'Perfect! Now say this word out loud: teacher.',
            expect: ['teacher'],
            example: 'Teacher.',
            tip: 'La "ch" suena como en español; la "ea" suena /iː/.',
          },
          {
            say: 'Excellent! Finally, say the alphabet from A to F.',
            expect: ['a', 'b', 'c', 'd', 'e', 'f'],
            example: 'A, B, C, D, E, F.',
            tip: 'Repite el alfabeto en voz alta todos los días: es la base.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-03',
    num: 3,
    titulo: 'Números, fechas y horas',
    emoji: '🔢',
    nivel: 'Principiante',
    practicas: [
      {
        id: 'datos',
        titulo: 'Tus datos y la hora',
        turns: [
          {
            say: 'Hello! How old are you?',
            expect: ['i am', 'years old'],
            example: "I'm fifteen years old.",
            tip: 'La edad se dice con el verbo "to be": "I am 15 years old".',
          },
          {
            say: "Great! What's your phone number?",
            expect: ['number is', 'my number', 'nine', 'six', 'seven'],
            example: 'My phone number is 987 654 321.',
            tip: 'Los números de teléfono se dicen dígito a dígito.',
          },
          {
            say: 'Thanks! What time is it now?',
            expect: ['it is', 'time', 'oclock', 'o clock'],
            example: "It's nine o'clock.",
            tip: '"It\'s + hora + o\'clock" para las horas exactas.',
          },
          {
            say: 'And what day is it today?',
            expect: [
              'today is',
              'monday',
              'tuesday',
              'wednesday',
              'thursday',
              'friday',
              'saturday',
              'sunday',
            ],
            example: 'Today is Monday.',
            tip: 'Los días de la semana en inglés siempre van con mayúscula.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-04',
    num: 4,
    titulo: 'Pronombres y el verbo "to be"',
    emoji: '👥',
    nivel: 'Básico',
    practicas: [
      {
        id: 'to-be',
        titulo: 'I am, you are, she is',
        turns: [
          {
            say: 'Hello! Are you a student?',
            expect: ['i am', 'yes', 'no'],
            example: 'Yes, I am a student.',
            tip: 'Recuerda: I am · you are · he/she is · we/they are.',
          },
          {
            say: 'Nice! Who is with you today?',
            expect: ['he is', 'she is', 'my'],
            example: 'She is my sister.',
            tip: 'Con "he/she" el verbo es "is": "She is my sister".',
          },
          {
            say: 'And where are your friends from?',
            expect: ['they are', 'from', 'he is', 'she is'],
            example: 'They are from Peru.',
            tip: 'Con "they" el verbo es "are": "They are from Peru".',
          },
          {
            say: 'Great job! Are you happy today?',
            expect: ['i am', 'yes', 'no'],
            example: 'Yes, I am very happy.',
            tip: 'Puedes añadir adjetivos: happy, tired, excited, ready.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-05',
    num: 5,
    titulo: 'El presente simple',
    emoji: '📅',
    nivel: 'Básico',
    practicas: [
      {
        id: 'rutina',
        titulo: 'Mi rutina diaria',
        turns: [
          {
            say: 'Hi! Do you study English every day?',
            expect: ['yes', 'no', 'study'],
            example: 'Yes, I study English every day.',
            tip: '"Every day" son dos palabras: todos los días.',
          },
          {
            say: 'Great! What do you do in the morning?',
            expect: ['i wake up', 'i go', 'i have', 'i get up'],
            example: 'I wake up at six and I go to school.',
            tip: 'Presente simple: I wake up, I go, I have breakfast.',
          },
          {
            say: 'Nice! Does your mother work?',
            expect: ['she works', 'yes', 'no'],
            example: 'Yes, she works in a hospital.',
            tip: 'Con he/she/it el verbo lleva -s: "she works".',
          },
          {
            say: 'And what do you like to do after school?',
            expect: ['i like', 'play', 'watch', 'read'],
            example: 'I like playing football and watching videos.',
            tip: 'Después de "I like" puedes usar un verbo en -ing.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-06',
    num: 6,
    titulo: 'Vocabulario esencial',
    emoji: '🧺',
    nivel: 'Básico',
    practicas: [
      {
        id: 'mi-mundo',
        titulo: 'Colores, familia y comida',
        turns: [
          {
            say: "Let's practise vocabulary. What's your favourite colour?",
            expect: ['favourite', 'favorite', 'colour', 'color'],
            example: 'My favourite colour is blue.',
            tip: 'En inglés americano se escribe "color" y "favorite".',
          },
          {
            say: 'Tell me about your family. Who do you live with?',
            expect: ['mother', 'father', 'brother', 'sister', 'family', 'parents'],
            example: 'I live with my mother, my father and my brother.',
            tip: 'Family: mother, father, brother, sister, grandparents.',
          },
          {
            say: 'What do you usually eat for breakfast?',
            expect: ['bread', 'milk', 'egg', 'coffee', 'eat', 'tea'],
            example: 'I eat bread with milk for breakfast.',
            tip: '"For breakfast / for lunch / for dinner".',
          },
          {
            say: "Nice! And what's in your school bag?",
            expect: ['book', 'pen', 'notebook', 'pencil', 'have'],
            example: 'I have a book, a notebook and two pens.',
            tip: 'Recuerda el plural: one book → two books.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-07',
    num: 7,
    titulo: 'Preguntas y frases útiles',
    emoji: '❓',
    nivel: 'Intermedio',
    practicas: [
      {
        id: 'preguntar',
        titulo: 'Preguntar y pedir ayuda',
        turns: [
          {
            say: 'Hello! Do you have any questions for me?',
            expect: ['can you', 'what is', 'how do', 'repeat'],
            example: 'Can you repeat that, please?',
            tip: 'Frases útiles: "Can you repeat, please?", "How do you say ... in English?"',
          },
          {
            say: 'Of course! Now ask me how old I am.',
            expect: ['how old are you'],
            example: 'How old are you?',
            tip: 'Pregunta por la edad: "How old are you?".',
          },
          {
            say: "I'm thirty years old. Now ask me where I live.",
            expect: ['where do you live'],
            example: 'Where do you live?',
            tip: 'Preguntas con "do": Where do you live? What do you do?',
          },
          {
            say: "Perfect! Finally, tell me politely that you don't understand.",
            expect: ['i do not understand', "don't understand", 'sorry', 'repeat'],
            example: "Sorry, I don't understand. Can you repeat, please?",
            tip: '"I don\'t understand" es la forma más clara de pedir ayuda.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-examen-final',
    num: 8,
    titulo: 'Repaso general (antes del examen)',
    emoji: '🏆',
    nivel: 'Repaso',
    practicas: [
      {
        id: 'repaso',
        titulo: 'Conversación completa',
        turns: [
          {
            say: "Hello! I'm your tutor. What's your name and how are you?",
            expect: ['name is', 'my name', 'i am', 'fine', 'good'],
            example: "My name is Luis and I'm fine, thank you.",
            tip: 'Une dos ideas con "and" para sonar más natural.',
          },
          {
            say: 'Nice! Where are you from and what do you do?',
            expect: ['from', 'i am', 'student', 'study'],
            example: "I'm from Comas and I'm a student.",
            tip: 'Puedes responder a dos preguntas en una sola frase.',
          },
          {
            say: 'What time do you usually study English?',
            expect: ['i study', 'at', 'oclock', 'o clock', 'in the'],
            example: "I usually study English at six o'clock.",
            tip: 'Coloca "usually" antes del verbo: "I usually study".',
          },
          {
            say: 'And what do you like most about English?',
            expect: ['i like', 'because', 'like'],
            example: 'I like English because I can talk to more people.',
            tip: 'Usa "because" para explicar el motivo.',
          },
          {
            say: 'Excellent work! Thanks for practising. See you next time!',
            expect: ['thank', 'see you', 'bye'],
            example: 'Thank you! See you next time!',
            tip: '¡Ya puedes presentarte en inglés con confianza! 🎉',
          },
        ],
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
  const ok = matched.length > 0;
  const ratio = turn.expect.length ? matched.length / turn.expect.length : 0;
  const objetivo = normalize(turn.example).split(' ').length;
  const bonus = Math.min(1, words.size / Math.max(objetivo, 1)) * 0.25;
  const pct = Math.round(Math.min(1, (ok ? 0.75 : 0) + ratio * 0.15 + bonus) * 100);
  return { pct, matched, missing, ok };
}

function estrellas(pct: number, ok: boolean) {
  if (!ok) return 1;
  return pct >= 80 ? 3 : 2;
}

function mensaje(pct: number, ok: boolean) {
  if (!ok) return 'Casi. Escucha la frase modelo y prueba otra vez. 🙂';
  if (pct >= 90) return '¡Excelente! Sonó muy natural. 🎉';
  if (pct >= 75) return '¡Muy bien! Solo cuida algún detalle. 👏';
  return '¡Bien! Repite la frase completa para sonar más fluido. 💪';
}

export default function EnglishTutor({ moduloInicial }: { moduloInicial?: string }) {
  const moduloFijo = MODULOS.find((m) => m.slug === moduloInicial);
  const [cargado, setCargado] = useState(false);
  const [consent, setConsent] = useState<boolean | null>(null);
  const [moduloIdx, setModuloIdx] = useState(moduloFijo ? MODULOS.indexOf(moduloFijo) : 0);
  const [practicaIdx, setPracticaIdx] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<{
    pct: number;
    matched: string[];
    missing: string[];
    ok: boolean;
  } | null>(null);
  const [autoMode, setAutoMode] = useState(true);
  const [aviso, setAviso] = useState('');
  const [vozLocal, setVozLocal] = useState(false);
  const [supported, setSupported] = useState(true);
  const [modoTexto, setModoTexto] = useState(false);
  const [textoEscrito, setTextoEscrito] = useState('');
  const [estado, setEstado] = useState<'inactivo' | 'escuchando' | 'voz' | 'procesando'>('inactivo');

  const recRef = useRef<any>(null);
  const activoRef = useRef(false);
  const tiempoRef = useRef<number | null>(null);
  const transcriptRef = useRef('');
  const micListoRef = useRef(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const finalRef = useRef<(t: string) => void>(() => {});

  const modulo = MODULOS[moduloIdx] ?? MODULOS[0];
  const practica = modulo.practicas[practicaIdx] ?? modulo.practicas[0];
  const turn = practica.turns[turnIndex];

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

  // --- Reconocimiento: se detecta el soporte y se crea una instancia nueva en cada intento ---
  useEffect(() => {
    const w = window as any;
    if (!(w.SpeechRecognition || w.webkitSpeechRecognition)) setSupported(false);
  }, []);

  /** Crea un reconocedor nuevo, ya configurado y con sus eventos conectados. */
  const crearReconocedor = useCallback(() => {
    const w = window as any;
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return null;
    const rec = new Ctor();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      activoRef.current = true;
      setListening(true);
      setEstado('escuchando');
      setAviso('');
    };
    // Eventos reales del micrófono: sirven para mostrar que SÍ está escuchando
    rec.onaudiostart = () => setEstado('escuchando');
    rec.onsoundstart = () => setEstado('voz');
    rec.onspeechstart = () => setEstado('voz');
    rec.onspeechend = () => setEstado('procesando');
    rec.onaudioend = () => setEstado('procesando');
    rec.onresult = (e: any) => {
      let parcial = '';
      let completo = '';
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const texto = e.results[i][0].transcript;
        if (e.results[i].isFinal) completo += texto;
        else parcial += texto;
      }
      setTranscript((completo || parcial).trim());
      transcriptRef.current = (completo || parcial).trim();
      if (parcial && !completo) setEstado('voz');
      if (completo) finalRef.current(completo.trim());
    };
    rec.onerror = (e: any) => {
      activoRef.current = false;
      setListening(false);
      setEstado('inactivo');
      const teniaTexto = Boolean(transcriptRef.current.trim());
      const err = e?.error;
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        setAviso(
          'Tu navegador tiene el micrófono bloqueado para esta web. Actívalo en el candado de la barra de direcciones. Mientras tanto puedes practicar escribiendo. ⌨️',
        );
        setModoTexto(true);
      } else if (err === 'audio-capture') {
        setAviso('No encuentro ningún micrófono conectado. Revisa tu equipo o practica escribiendo. ⌨️');
        setModoTexto(true);
      } else if (err === 'network') {
        setAviso('El servicio de voz del navegador no respondió. Prueba otra vez o practica escribiendo. ⌨️');
      } else if (err === 'no-speech' && !teniaTexto) {
        setAviso('No te escuché esta vez. Toca el botón y habla un poco más cerca del micrófono. 🎤');
      } else if (err !== 'aborted' && err !== 'no-speech') {
        setAviso('Hubo un problema con el micrófono. Inténtalo otra vez o escribe tu respuesta. ⌨️');
      }
    };
    rec.onend = () => {
      activoRef.current = false;
      setListening(false);
      setEstado('inactivo');
    };
    return rec;
  }, []);

  // Al desmontar, liberamos el micrófono
  useEffect(
    () => () => {
      try {
        recRef.current?.abort();
      } catch {
        /* nada */
      }
      recRef.current = null;
    },
    [],
  );

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

  const limpiarTiempo = () => {
    if (tiempoRef.current !== null) {
      window.clearTimeout(tiempoRef.current);
      tiempoRef.current = null;
    }
  };

  /** Corrige la frase que se haya entendido. */
  const comprobar = useCallback(
    (dicho: string) => {
      const r = evaluar(dicho, turn);
      setResult(r);
      setListening(false);
      setEstado('inactivo');
      limpiarTiempo();
      if (r.ok && r.pct >= 80) hablar('Excellent! Well done.');
    },
    [turn, hablar],
  );

  const pararDeEscuchar = useCallback(() => {
    limpiarTiempo();
    try {
      recRef.current?.stop();
    } catch {
      /* nada */
    }
    activoRef.current = false;
    setListening(false);
    setEstado('procesando');
  }, []);

  /**
   * Arranca la escucha de forma robusta:
   * 1) comprueba permiso y micrófono, 2) usa una instancia nueva y 3) reintenta una vez.
   * Si no es posible, pasa al modo escribir para que la práctica nunca se bloquee.
   */
  const arrancarEscucha = useCallback(async () => {
    setAviso('');
    setResult(null);
    setTranscript('');
    transcriptRef.current = '';
    limpiarTiempo();

    // 1) Verificamos que exista micrófono y que tengamos permiso (solo la primera vez)
    if (!micListoRef.current) {
      try {
        if (navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((t) => t.stop());
        }
        micListoRef.current = true;
      } catch (err: any) {
        const nombre = String(err?.name ?? '');
        if (nombre === 'NotAllowedError' || nombre === 'SecurityError') {
          setAviso(
            'Tu navegador no dio permiso al micrófono. Actívalo en el candado 🔒 de la barra de direcciones y vuelve a intentarlo. Mientras tanto puedes escribir tu respuesta. ⌨️',
          );
        } else if (nombre === 'NotFoundError' || nombre === 'OverconstrainedError') {
          setAviso('No encuentro ningún micrófono conectado en este dispositivo. Puedes practicar escribiendo. ⌨️');
        } else {
          setAviso('No pude acceder al micrófono en este dispositivo. Puedes practicar escribiendo. ⌨️');
        }
        setModoTexto(true);
        setEstado('inactivo');
        return;
      }
    }

    // 2) Instancia nueva en cada intento: evita el error de "reconocimiento ya activo"
    try {
      recRef.current?.abort();
    } catch {
      /* nada */
    }

    const intentar = () => {
      const rec = crearReconocedor();
      if (!rec) return false;
      recRef.current = rec;
      try {
        rec.start();
        return true;
      } catch {
        try {
          rec.abort();
        } catch {
          /* nada */
        }
        return false;
      }
    };

    let ok = intentar();
    if (!ok) {
      // Un respiro y un segundo intento con instancia limpia
      await new Promise((r) => window.setTimeout(r, 300));
      ok = intentar();
    }

    if (ok) {
      activoRef.current = true;
      setListening(true);
      setEstado('escuchando');
      // Red de seguridad: si el motor se queda colgado, avisamos sin cortar en seco
      tiempoRef.current = window.setTimeout(() => {
        if (!transcriptRef.current.trim()) {
          setAviso(
            'Sigo escuchando… habla un poco más cerca del micrófono, o toca el botón para terminar.',
          );
        }
      }, 12000);
      return;
    }

    // 3) Si el navegador no deja usar el micrófono, seguimos con el teclado
    activoRef.current = false;
    setListening(false);
    setEstado('inactivo');
    setAviso(
      'El micrófono no respondió en este navegador. Te dejo el modo escribir para que puedas practicar igual. ⌨️',
    );
    setModoTexto(true);
  }, [crearReconocedor]);

  /** Un toque empieza a escuchar; otro toque termina y corrige. */
  const alternarMicrofono = useCallback(() => {
    if (listening || activoRef.current) {
      const dicho = transcriptRef.current.trim();
      pararDeEscuchar();
      if (dicho) comprobar(dicho);
      return;
    }
    void arrancarEscucha();
  }, [listening, pararDeEscuchar, comprobar, arrancarEscucha]);

  useEffect(() => {
    finalRef.current = (texto: string) => comprobar(texto);
  });

  // El tutor habla solo al empezar cada turno (modo conversación)
  useEffect(() => {
    if (consent !== true || !supported || !autoMode) return;
    const id = window.setTimeout(() => hablar(turn.say), 150);
    return () => window.clearTimeout(id);
  }, [consent, supported, autoMode, turn, hablar]);

  useEffect(() => () => limpiarTiempo(), []);

  function aceptarMicrofono() {
    try {
      window.localStorage.setItem(MIC_CONSENT_KEY, 'si');
    } catch {
      /* nada */
    }
    setConsent(true);
    setAviso('');
    // Calentamos el motor de voz en el mismo gesto del usuario (primera frase sin retardo)
    try {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch {
      /* nada */
    }
    // Permiso del micrófono desde ya, así al pulsar el botón es instantáneo
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((s) => {
          s.getTracks().forEach((t) => t.stop());
          micListoRef.current = true;
        })
        .catch(() => {
          micListoRef.current = false;
          setAviso(
            'No diste permiso al micrófono. Actívalo en el candado 🔒 de la barra de direcciones y toca el botón; si no, puedes escribir tus respuestas. ⌨️',
          );
        });
    }
  }

  function siguienteTurno() {
    setResult(null);
    setTranscript('');
    transcriptRef.current = '';
    setTextoEscrito('');
    setAviso('');
    setEstado('inactivo');
    setTurnIndex(turnIndex < practica.turns.length - 1 ? turnIndex + 1 : 0);
  }

  function elegirModulo(i: number) {
    setModuloIdx(i);
    setPracticaIdx(0);
    setTurnIndex(0);
    setResult(null);
    setTranscript('');
    transcriptRef.current = '';
    setTextoEscrito('');
    setAviso('');
    setEstado('inactivo');
  }

  function elegirPractica(i: number) {
    setPracticaIdx(i);
    setTurnIndex(0);
    setResult(null);
    setTranscript('');
    transcriptRef.current = '';
    setTextoEscrito('');
    setAviso('');
    setEstado('inactivo');
  }

  const progreso = Math.round(((turnIndex + 1) / practica.turns.length) * 100);
  const puedeMicrofono = consent === true && supported;

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
              <strong>
                el audio se envía y se procesa en los servidores del proveedor de tu navegador
              </strong>{' '}
              (por ejemplo, Google si usas Chrome o Android, Microsoft si usas Edge, o Apple si usas
              Safari), según las políticas de privacidad de ese proveedor.
            </p>
            <p>
              Edúcate Comas <strong>no recibe, no escucha ni guarda</strong> tu voz: solo vemos el
              texto que tu propio navegador nos devuelve para decirte si la frase está bien. Puedes
              practicar sin micrófono en el <strong>modo solo escuchar</strong> o escribiendo tus
              respuestas.
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
              onClick={() => setConsent(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              <MicOff className="h-4 w-4" />
              Practicar solo escuchando
            </button>
          </div>
        </section>
      )}

      {/* ---------------- Módulos del curso ---------------- */}
      {!moduloFijo && (
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">1 · Elige el módulo</h2>
            <p className="text-sm text-slate-600">
              Practica justo lo que estudiaste en cada módulo del curso de Inglés Básico.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {MODULOS.map((m, i) => {
              const activo = i === moduloIdx;
              return (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => elegirModulo(i)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    activo
                      ? 'border-sky-400 bg-sky-50 text-sky-800 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50'
                  }`}
                >
                  <span aria-hidden>{m.emoji}</span>
                  <span>
                    {m.num <= 7 ? `Módulo ${m.num}` : 'Repaso'} · {m.titulo}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------------- Prácticas del módulo ---------------- */}
      {modulo.practicas.length > 1 && (
        <section className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">Práctica:</span>
          {modulo.practicas.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => elegirPractica(i)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                i === practicaIdx
                  ? 'border-sky-400 bg-sky-50 text-sky-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-sky-50'
              }`}
            >
              {p.titulo}
            </button>
          ))}
        </section>
      )}

      {/* ---------------- Conversación ---------------- */}
      <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              Turno {turnIndex + 1} de {practica.turns.length}
            </span>
            <span className="text-xs text-slate-500">
              {modulo.emoji} {modulo.num <= 7 ? `Módulo ${modulo.num}` : 'Repaso'} · {modulo.titulo}
            </span>
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
                {speaking
                  ? 'El tutor está hablando…'
                  : vozLocal
                    ? 'Voz del dispositivo (sin retardo)'
                    : 'Voz del navegador'}
              </span>
            </div>
          </div>
        </div>

        {/* Micrófono */}
        {puedeMicrofono && !modoTexto && (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50 p-5">
            <button
              type="button"
              onClick={alternarMicrofono}
              className={`relative flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95 ${
                listening
                  ? 'bg-gradient-to-br from-rose-400 to-rose-600'
                  : 'bg-gradient-to-br from-sky-400 to-indigo-500 hover:brightness-105'
              }`}
              aria-label={listening ? 'Toca para terminar' : 'Toca para hablar'}
            >
              {listening && (
                <>
                  <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/40" />
                  <span className="absolute -inset-3 animate-pulse rounded-full border-4 border-rose-300/50" />
                </>
              )}
              <Mic className="relative h-8 w-8" />
            </button>

            {/* Indicador de escucha: barras que se mueven mientras el micrófono está activo */}
            <div className="flex items-end gap-1" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`w-1.5 rounded-full transition-all ${
                    estado === 'voz'
                      ? 'animate-bounce bg-rose-500'
                      : estado === 'escuchando'
                        ? 'animate-pulse bg-rose-400'
                        : estado === 'procesando'
                          ? 'bg-sky-400'
                          : 'bg-slate-300'
                  }`}
                  style={{
                    height: estado === 'inactivo' ? '8px' : `${14 + (i % 3) * 8}px`,
                    animationDelay: `${i * 120}ms`,
                    animationDuration: estado === 'voz' ? '600ms' : '1100ms',
                  }}
                />
              ))}
            </div>

            <p className="text-sm font-semibold text-slate-700">
              {estado === 'voz'
                ? '¡Te escucho! Sigue hablando…'
                : estado === 'procesando'
                  ? 'Listo, estoy entendiendo tu frase…'
                  : listening
                    ? 'Micrófono activo · toca el botón para terminar'
                    : '🎤 Toca el botón y responde en inglés'}
            </p>

            {listening && (
              <span className="flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                ESCUCHANDO
              </span>
            )}

            <p className="min-h-6 text-center text-base italic text-slate-600">
              {transcript || 'Tu frase aparecerá aquí mientras hablas'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  pararDeEscuchar();
                  transcriptRef.current = '';
                  setModoTexto(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 underline"
              >
                <Keyboard className="h-3.5 w-3.5" />
                Prefiero escribir mi respuesta
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    window.localStorage.removeItem(MIC_CONSENT_KEY);
                  } catch {
                    /* nada */
                  }
                  setConsent(false);
                }}
                className="text-xs text-slate-400 underline transition hover:text-slate-600"
              >
                Desactivar el micrófono
              </button>
            </div>
          </div>
        )}

        {/* Modo escribir (siempre disponible como respaldo) */}
        {(modoTexto || !puedeMicrofono) && (
          <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-5">
            {!puedeMicrofono && (
              <p className="text-xs text-slate-500">
                {supported
                  ? 'Modo solo escuchar: repite la frase en voz alta y escribe lo que dirías.'
                  : 'Tu navegador no permite el reconocimiento de voz, pero puedes practicar escribiendo.'}
              </p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (textoEscrito.trim()) comprobar(textoEscrito.trim());
              }}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <input
                value={textoEscrito}
                onChange={(e) => setTextoEscrito(e.target.value)}
                placeholder="Escribe tu respuesta en inglés…"
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-105"
              >
                <Send className="h-4 w-4" />
                Comprobar
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-3">
              {supported && (
                <button
                  type="button"
                  onClick={() => {
                    micListoRef.current = false;
                    setModoTexto(false);
                    setAviso('');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 underline"
                >
                  <Mic className="h-3.5 w-3.5" />
                  Volver a hablar con el micrófono
                </button>
              )}
              {!supported && (
                <span className="text-xs text-slate-500">
                  Consejo: para usar el micrófono abre la web en Chrome, Edge o Safari.
                </span>
              )}
            </div>
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
                      n < estrellas(result.pct, result.ok)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-slate-700">{result.pct}%</span>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {mensaje(result.pct, result.ok)}
              </p>
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
                  opción: {w}
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
                  transcriptRef.current = '';
                  setTextoEscrito('');
                  setModoTexto(false);
                  setEstado('inactivo');
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
