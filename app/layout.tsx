import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import ConsentGate from '@/components/ConsentGate';
import ScrollToTop from '@/components/ScrollToTop';
import { AuthBridge, PreviewAuthProvider } from '@/lib/auth-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'Edúcate Comas',
  description:
    'Aprende Linux, inglés, IA, seguridad y más con cursos interactivos y laboratorio en tu navegador.',
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
};

// Sin clave de Clerk => modo vista previa (usuario fijo, sin autenticación).
const PREVIEW_MODE = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = (
    <html lang="es">
      <body className="min-h-screen">
        <ScrollToTop />
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">{children}</main>
        <Footer />
        <CookieBanner />
        <ConsentGate />
        <Toaster theme="light" position="top-right" richColors closeButton />

        {/*
          Medición de audiencia de Cloudflare (Web Analytics).

          Es SIN COOKIES y sin datos personales: solo cuenta visitas, páginas
          vistas, país aproximado y tipo de dispositivo. Está declarada en la
          Política de Privacidad (medición de audiencia), por lo que no depende
          del aviso de cookies ni requiere consentimiento previo.

          Se instala aquí a mano porque la inyección automática del panel de
          Cloudflare NO se aplica a las webs servidas por un Worker
          (comprobado el 25/09/2026: el medidor no llegaba al visitante).
        */}
        <script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: '2173d4245cfd4c27b553d9e3126b58e4' })}
        />
      </body>
    </html>
  );

  if (PREVIEW_MODE) {
    return <PreviewAuthProvider>{content}</PreviewAuthProvider>;
  }

  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: '#0ea5e9', colorBackground: '#ffffff', colorText: '#0f172a' },
      }}
    >
      <AuthBridge>{content}</AuthBridge>
    </ClerkProvider>
  );
}
