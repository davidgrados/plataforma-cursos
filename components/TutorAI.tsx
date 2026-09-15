'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Info,
  Keyboard,
  Loader2,
  Mic,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Volume2,
} from 'lucide-react';
import { MODULOS, evaluar, type Turn } from '@/lib/ingles-practicas';

/** Clave donde se guarda el consentimiento del micrófono. */
const MIC_CONSENT_KEY = 'educatecomas-mic-consent';

type EstadoOrbe = 'listo' | 'grabando' | 'pensando' | 'hablando';

interface Mensaje {
  rol: 'coti' | 'yo';
  texto: string;
  traduccion?: string;
}

function estrellas(pct: number, ok: boolean) {
  if (!ok) return 1;
  return pct >= 80 ? 3 : 2;
}

function mensajeCorto(pct: number, ok: boolean) {
  if (!ok) return 'Casi. Escucha la frase modelo y prueba otra vez. 🙂';
  if (pct >= 90) return '¡Excelente! Sonó muy natural. 🎉';
  if (pct >= 75) return '¡Muy bien! Solo cuida algún detalle. 👏';
  return '¡Bien! Repite la frase completa para sonar más fluido. 💪';
}

/** Separa la parte en inglés de la ayuda en español "(...)". */
function partirRespuesta(texto: string): { ingles: string; ayuda?: string } {
  const m = texto.match(/^(.*?)[\s]*\(([^)]{3,})\)\s*$/s);
  if (m) return { ingles: m[1].trim(), ayuda: m[2].trim() };
  return { ingles: texto.trim() };
}

export default function TutorAI({ moduloInicial }: { moduloInicial?: string }) {
  const moduloFijo = MODULOS.find((m) => m.slug === moduloInicial);
  const [cargado, setCargado] = useState(false);
  const [consent, setConsent] = useState<boolean | null>(null);
  const [moduloIdx, setModuloIdx] = useState(moduloFijo ? MODULOS.indexOf(moduloFijo) : 0);
  const [practicaIdx, setPracticaIdx] = useState(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [estado, setEstado] = useState<EstadoOrbe>('listo');
  const [nivel, setNivel] = useState(0);
  const [transcripcion, setTranscripcion] = useState('');
  const [chat, setChat] = useState<Mensaje[]>([]);
  const [resultado, setResultado] = useState<ReturnType<typeof evaluar> | null>(null);
  const [aviso, setAviso] = useState('');
  const [detalle, setDetalle] = useState('');
  const [modoTexto, setModoTexto] = useState(false);
  const [textoEscrito, setTextoEscrito] = useState('');
  const [soportado, setSoportado] = useState(true);

  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const trozosRef = useRef<Blob[]>([]);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const habloRef = useRef(false);
  const silencioRef = useRef(0);
  const detenerRef = useRef(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const modulo = MODULOS[moduloIdx] ?? MODULOS[0];
  const practica = modulo.practicas[practicaIdx] ?? modulo.practicas[0];
  const turn: Turn = practica.turns[turnIndex];

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
    const soporta =
      typeof window !== 'undefined' &&
      typeof MediaRecorder !== 'undefined' &&
      Boolean(navigator.mediaDevices?.getUserMedia);
    setSoportado(soporta);
  }, []);

  // --- Voz del navegador: precargar voces en inglés ---
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const cargar = () => {
      const voces = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'));
      if (!voces.length) return;
      voiceRef.current =
        voces.find((v) => v.localService && /en[-_]us/i.test(v.lang)) ||
        voces.find((v) => /en[-_]us/i.test(v.lang)) ||
        voces[0];
    };
    cargar();
    synth.addEventListener?.('voiceschanged', cargar);
    return () => synth.removeEventListener?.('voiceschanged', cargar);
  }, []);

  const hablar = useCallback((texto: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !texto) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'en-US';
    u.rate = 0.95;
    if (voiceRef.current) u.voice = voiceRef.current;
    u.onstart = () => setEstado('hablando');
    u.onend = () => setEstado('listo');
    u.onerror = () => setEstado('listo');
    synth.speak(u);
  }, []);

  // --- Limpieza del micrófono ---
  const soltarMicrofono = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    try {
      ctxRef.current?.close();
    } catch {
      /* nada */
    }
    ctxRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setNivel(0);
  }, []);

  useEffect(() => () => soltarMicrofono(), [soltarMicrofono]);

  /** Mide el volumen real del micrófono para animar el orbe y detectar el silencio. */
  const vigilarVolumen = useCallback((stream: MediaStream) => {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx: AudioContext = new AC();
    ctxRef.current = ctx;
    const fuente = ctx.createMediaStreamSource(stream);
    const analizador = ctx.createAnalyser();
    analizador.fftSize = 1024;
    fuente.connect(analizador);
    const datos = new Uint8Array(analizador.fftSize);

    const medir = () => {
      analizador.getByteTimeDomainData(datos);
      let suma = 0;
      for (let i = 0; i < datos.length; i += 1) {
        const v = (datos[i] - 128) / 128;
        suma += v * v;
      }
      const rms = Math.sqrt(suma / datos.length);
      setNivel(Math.min(1, rms * 6));
      if (rms > 0.035) {
        habloRef.current = true;
        silencioRef.current = 0;
      } else if (habloRef.current) {
        silencioRef.current += 1;
        // ~1,2 s de silencio después de hablar: cerramos solos (más fluido)
        if (silencioRef.current > 70) {
          silencioRef.current = 0;
          habloRef.current = false;
          try {
            recRef.current?.state === 'recording' && recRef.current.stop();
          } catch {
            /* nada */
          }
          return;
        }
      }
      rafRef.current = requestAnimationFrame(medir);
    };
    rafRef.current = requestAnimationFrame(medir);
  }, []);

  // --- Enviar al tutor de IA ---
  const procesar = useCallback(
    async (opciones: { audio?: Blob; texto?: string }) => {
      setEstado('pensando');
      setAviso('');
      setDetalle('');
      // Memoria de la conversación: los últimos 6 mensajes (solo la parte en inglés)
      const historial = chat
        .slice(-6)
        .map((m) => ({ role: m.rol === 'coti' ? 'assistant' : 'user', content: m.texto }));
      try {
        let res: Response;
        if (opciones.audio) {
          const form = new FormData();
          const tipo = opciones.audio.type || 'audio/webm';
          const ext = tipo.includes('mp4') ? 'mp4' : 'webm';
          form.append('audio', opciones.audio, `voz.${ext}`);
          form.append('modulo', `${modulo.num <= 7 ? `Módulo ${modulo.num}` : 'Repaso'}: ${modulo.titulo}`);
          form.append('ejemplo', turn.example);
          form.append('turno', String(turnIndex + 1));
          form.append('historial', JSON.stringify(historial));
          res = await fetch('/api/tutor', { method: 'POST', body: form });
        } else {
          res = await fetch('/api/tutor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: opciones.texto ?? '',
              modulo: `${modulo.num <= 7 ? `Módulo ${modulo.num}` : 'Repaso'}: ${modulo.titulo}`,
              ejemplo: turn.example,
              turno: String(turnIndex + 1),
              historial,
            }),
          });
        }
        const data: any = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);

        const dicho = String(data?.transcript ?? '').trim();
        const respuesta = String(data?.reply ?? '').trim();
        setTranscripcion(dicho);

        if (dicho) {
          setResultado(evaluar(dicho, turn));
          setChat((c) => [...c, { rol: 'yo', texto: dicho }]);
        }
        if (respuesta) {
          const { ingles, ayuda } = partirRespuesta(respuesta);
          setChat((c) => [...c, { rol: 'coti', texto: ingles, traduccion: ayuda }]);
          hablar(ingles);
        } else {
          setEstado('listo');
        }
      } catch (e: any) {
        setEstado('listo');
        setAviso(
          'No pude conectar con la tutora de IA. Revisa tu conexión e inténtalo otra vez: también puedes escribir tu respuesta. ⌨️',
        );
        setDetalle(e?.message ? `Detalle: ${e.message}` : '');
      }
    },
    [modulo, turn, turnIndex, hablar, chat],
  );

  // --- Empezar / detener grabación ---
  const empezarGrabacion = useCallback(async () => {
    setAviso('');
    setDetalle('');
    try {
      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
      }
      const stream = streamRef.current!;
      const tipos = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', ''];
      const tipo = tipos.find((t) => !t || (window as any).MediaRecorder?.isTypeSupported?.(t)) ?? '';
      const rec = tipo ? new MediaRecorder(stream, { mimeType: tipo }) : new MediaRecorder(stream);
      trozosRef.current = [];
      habloRef.current = false;
      silencioRef.current = 0;
      detenerRef.current = false;
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) trozosRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(trozosRef.current, { type: rec.mimeType || 'audio/webm' });
        soltarMicrofono();
        if (blob.size < 1200) {
          setEstado('listo');
          setAviso('La grabación salió muy corta. Toca el orbe y habla un poquito más. 🎤');
          return;
        }
        void procesar({ audio: blob });
      };
      recRef.current = rec;
      rec.start();
      vigilarVolumen(stream);
      setEstado('grabando');
    } catch (err: any) {
      soltarMicrofono();
      setEstado('listo');
      const nombre = String(err?.name ?? '');
      if (nombre === 'NotAllowedError' || nombre === 'SecurityError') {
        setAviso(
          'Tu navegador bloqueó el micrófono. Toca el candado 🔒 junto a la dirección, permite el Micrófono y recarga la página. También puedes escribir tu respuesta. ⌨️',
        );
      } else if (nombre === 'NotFoundError') {
        setAviso('No encuentro ningún micrófono conectado. Puedes practicar escribiendo. ⌨️');
      } else {
        setAviso('No pude activar el micrófono. Inténtalo otra vez o escribe tu respuesta. ⌨️');
      }
      setDetalle(err?.message ? `Detalle: ${err.message}` : '');
    }
  }, [procesar, soltarMicrofono, vigilarVolumen]);

  const detenerGrabacion = useCallback(() => {
    habloRef.current = false;
    silencioRef.current = 0;
    try {
      if (recRef.current?.state === 'recording') recRef.current.stop();
    } catch {
      /* nada */
    }
  }, []);

  const tocarOrbe = useCallback(() => {
    if (estado === 'grabando') {
      detenerGrabacion();
      return;
    }
    if (estado === 'pensando' || estado === 'hablando') return;
    void empezarGrabacion();
  }, [estado, detenerGrabacion, empezarGrabacion]);

  // --- Cambios de turno ---
  const limpiarTurno = useCallback(() => {
    setResultado(null);
    setTranscripcion('');
    setTextoEscrito('');
    setAviso('');
    setDetalle('');
    setEstado('listo');
  }, []);

  const siguiente = useCallback(() => {
    limpiarTurno();
    setTurnIndex((i) => (i < practica.turns.length - 1 ? i + 1 : 0));
  }, [limpiarTurno, practica.turns.length]);

  // La tutora presenta el turno (voz) cuando no está hablando el estudiante
  useEffect(() => {
    if (consent !== true || modoTexto || estado === 'grabando') return;
    const id = window.setTimeout(() => hablar(turn.say), 250);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnIndex, practicaIdx, moduloIdx, consent, modoTexto]);

  const progreso = Math.round(((turnIndex + 1) / practica.turns.length) * 100);

  /** Colores del orbe según lo que está haciendo Coti. */
  const paleta =
    estado === 'grabando'
      ? ['#fb7185', '#e879f9', '#a855f7', '#fb923c']
      : estado === 'pensando'
        ? ['#fbbf24', '#e879f9', '#8b5cf6', '#38bdf8']
        : estado === 'hablando'
          ? ['#38bdf8', '#6366f1', '#22d3ee', '#a855f7']
          : ['#8b5cf6', '#6366f1', '#38bdf8', '#d946ef'];

  return (
    <div className="flex flex-col gap-6">
      {/* ---------------- Consentimiento ---------------- */}
      {cargado && consent !== true && (
        <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <ShieldCheck className="h-5 w-5 text-sky-600" />
            Antes de empezar: permiso para usar el micrófono
          </h2>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-slate-600">
            <p>
              Para conversar, la tutora necesita escuchar tu voz. Cuando tocas el orbe, tu navegador
              graba un fragmento corto y lo envía cifrado (HTTPS) a nuestra propia API en{' '}
              <strong>Cloudflare Workers AI</strong>, donde se convierte en texto con el modelo{' '}
              <strong>Whisper</strong> y se genera la respuesta con un modelo de lenguaje.
            </p>
            <p>
              <strong>No guardamos tu audio</strong>: se procesa al momento y se descarta. Tampoco
              guardamos la transcripción en nuestros servidores ni se usa para entrenar modelos.
              Puedes practicar sin micrófono escribiendo tus respuestas.
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
              onClick={() => {
                try {
                  window.localStorage.setItem(MIC_CONSENT_KEY, 'si');
                } catch {
                  /* nada */
                }
                setConsent(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-3 font-semibold text-white shadow-glow transition hover:brightness-105"
            >
              <Mic className="h-4 w-4" />
              Aceptar y hablar con la tutora
            </button>
            <button
              type="button"
              onClick={() => setConsent(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              <Keyboard className="h-4 w-4" />
              Prefiero escribir
            </button>
          </div>
        </section>
      )}

      {/* ---------------- Módulos ---------------- */}
      {!moduloFijo && (
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">1 · Elige el módulo</h2>
            <p className="text-sm text-slate-600">
              Practica justo lo que estudiaste en cada módulo del curso de Inglés Básico.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {MODULOS.map((m, i) => (
              <button
                key={m.slug}
                type="button"
                onClick={() => {
                  setModuloIdx(i);
                  setPracticaIdx(0);
                  setTurnIndex(0);
                  limpiarTurno();
                }}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  i === moduloIdx
                    ? 'border-sky-400 bg-sky-50 text-sky-800 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50'
                }`}
              >
                <span aria-hidden>{m.emoji}</span>
                <span>{m.num <= 7 ? `Módulo ${m.num}` : 'Repaso'} · {m.titulo}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- Orbe + conversación ---------------- */}
      <section className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            Turno {turnIndex + 1} de {practica.turns.length} · {modulo.emoji} {modulo.titulo}
          </span>
          <button
            type="button"
            onClick={() => hablar(turn.say)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 underline"
          >
            <Volume2 className="h-3.5 w-3.5" />
            Escuchar la frase del turno
          </button>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>

        {/* Orbe */}
        <div className="flex flex-col items-center gap-4 py-2">
          <button
            type="button"
            onClick={tocarOrbe}
            disabled={estado === 'pensando'}
            aria-label="Toca para hablar"
            className="tap-area relative flex h-48 w-48 items-center justify-center rounded-full outline-none"
          >
            {/* halo exterior que respira con tu voz */}
            <span
              className="absolute inset-0 rounded-full blur-2xl transition-all duration-500"
              style={{
                background: `radial-gradient(circle, ${paleta[0]}66, transparent 70%)`,
                transform: `scale(${1.12 + nivel * 0.3})`,
                opacity: estado === 'grabando' ? 1 : 0.75,
              }}
            />
            {(estado === 'grabando' || estado === 'hablando') && (
              <span className="absolute -inset-2 animate-ping rounded-full border border-white/50" />
            )}

            {/* esfera viva: el nivel del micro la hace crecer */}
            <span
              className="relative h-40 w-40"
              style={{ transform: `scale(${1 + nivel * 0.14})`, transition: 'transform 120ms linear' }}
            >
              <span
                className={`orb orb-latir ${estado === 'grabando' ? 'orb-latir--rapido' : ''} block h-full w-full`}
              >
                {/* capas de color que se funden y giran (efecto Apple Intelligence) */}
                <span className="orb-giro">
                  {paleta.map((color, i) => (
                    <span
                      key={color + i}
                      className={`orb-capa orb-capa--${i + 1}`}
                      style={{
                        background: `radial-gradient(circle at ${28 + i * 13}% ${22 + i * 16}%, ${color}, transparent 62%)`,
                      }}
                    />
                  ))}
                </span>
                <span className="orb-brillo" />
                {estado === 'pensando' && (
                  <span className="absolute inset-0 z-10 flex items-center justify-center">
                    <Loader2 className="h-9 w-9 animate-spin text-white/90" />
                  </span>
                )}
              </span>
            </span>
          </button>

          <p className="text-center text-base font-semibold text-slate-800">
            {estado === 'grabando'
              ? '🎧 Te escucho… habla con calma (toca para terminar)'
              : estado === 'pensando'
                ? '✨ Coti está pensando su respuesta…'
                : estado === 'hablando'
                  ? '🔊 Coti te está hablando…'
                  : 'Toca el orbe y responde en inglés'}
          </p>

          {/* Barras de volumen reales */}
          <div className="flex h-6 items-end gap-1" aria-hidden>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const activo = estado === 'grabando' || estado === 'hablando';
              const alto = activo ? Math.max(6, Math.min(24, 6 + nivel * 24 * (0.6 + ((i % 3) * 0.2)))) : 6;
              return (
                <span
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-100 ${
                    activo ? 'bg-violet-500' : 'bg-slate-300'
                  }`}
                  style={{ height: `${alto}px` }}
                />
              );
            })}
          </div>

          {transcripcion && estado !== 'grabando' && (
            <p className="text-center text-sm italic text-slate-600">Dijiste: «{transcripcion}»</p>
          )}
        </div>

        {/* Conversación */}
        {chat.length > 0 && (
          <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-4">
            {chat.slice(-6).map((m, i) => (
              <div
                key={i}
                className={`flex ${m.rol === 'yo' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    m.rol === 'yo'
                      ? 'bg-sky-100 text-slate-800'
                      : 'bg-white text-slate-800 shadow-sm'
                  }`}
                >
                  <span className="mr-1">{m.rol === 'yo' ? '🧑' : '🤖'}</span>
                  <span className="font-medium">{m.texto}</span>
                  {m.traduccion && (
                    <span className="mt-0.5 block text-xs text-slate-500">{m.traduccion}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resultado del turno */}
        {resultado && (
          <div className="flex flex-col gap-3 rounded-2xl border border-sky-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((n) => (
                  <Star
                    key={n}
                    className={`h-6 w-6 ${
                      n < estrellas(resultado.pct, resultado.ok)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-slate-700">{resultado.pct}%</span>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {mensajeCorto(resultado.pct, resultado.ok)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {resultado.matched.map((w) => (
                <span
                  key={w}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700"
                >
                  <Check className="h-3 w-3" />
                  {w}
                </span>
              ))}
              {resultado.missing.map((w) => (
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
                onClick={() => hablar(turn.example)}
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
                onClick={limpiarTurno}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <RotateCcw className="h-4 w-4" />
                Intentar otra vez
              </button>
              <button
                type="button"
                onClick={siguiente}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-105"
              >
                Siguiente frase
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {aviso && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p>{aviso}</p>
            {detalle && <p className="mt-1 text-xs text-amber-600">{detalle}</p>}
          </div>
        )}
      </section>

      {/* ---------------- Escribir (siempre disponible) ---------------- */}
      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          ⌨️ {consent === true && !modoTexto ? 'O escribe tu respuesta' : 'Escribe tu respuesta'}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const escrito = textoEscrito.trim();
            if (!escrito) {
              setAviso('Escribe tu respuesta en inglés y después toca «Enviar». ✍️');
              return;
            }
            setModoTexto(true);
            void procesar({ texto: escrito });
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
            Enviar
          </button>
        </form>
        <p className="text-xs text-slate-500">💡 {turn.tip}</p>
        {!soportado && (
          <p className="text-xs text-slate-500">
            Tu navegador no permite grabar audio, pero puedes practicar escribiendo.
          </p>
        )}
      </section>

      <p className="flex items-start gap-2 rounded-2xl bg-white/70 p-4 text-xs leading-relaxed text-slate-500">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
        Tu voz se transcribe con Whisper en Cloudflare Workers AI y se descarta al momento: no
        guardamos el audio. Las respuestas las genera un modelo de lenguaje. Puedes desactivar el
        micrófono borrando el permiso en tu navegador o leer más en la{' '}
        <Link href="/privacidad#voz" className="font-semibold text-sky-700 underline">
          Política de Privacidad
        </Link>
        .
      </p>
    </div>
  );
}
