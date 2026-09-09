'use client';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {/* Banner de la campaña (contenido y amigable) */}
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/campana.png"
            alt="Campaña por el cambio que Comas necesita · Renovación Popular"
            className="w-full max-w-3xl rounded-2xl border border-slate-200 shadow-md"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <p className="text-center text-xs text-slate-500">
            Juntos lo haremos posible · Iniciativa para Comas
          </p>
        </div>

        {/* Pie de página base */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 Edúcate Comas · Cursos interactivos</p>
          <p className="flex items-center gap-4">
            <span>Para toda la familia</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
