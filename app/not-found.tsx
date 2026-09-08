import Link from 'next/link';

// @cloudflare/next-on-pages exige runtime edge en todas las rutas no estáticas.
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="bg-gradient-to-r from-accent to-accent-cyan bg-clip-text text-7xl font-black text-transparent">
        404
      </h1>
      <p className="text-lg text-slate-300">Esta página no existe.</p>
      <p className="max-w-md text-sm text-slate-500">
        Puede que el enlace sea incorrecto o que el recurso se haya movido.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-6 py-3 font-semibold text-ink-950 transition hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
