import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="bg-gradient-to-r from-accent to-accent-cyan bg-clip-text text-7xl font-black text-transparent">
        404
      </h1>
      <p className="text-lg text-slate-800">Esta página no existe.</p>
      <p className="max-w-md text-sm text-slate-500">
        Puede que el enlace sea incorrecto o que el recurso se haya movido.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-6 py-3 font-semibold text-white transition hover:brightness-105"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
