import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import { ClerkAuthBridge, PreviewAuthProvider } from '@/lib/auth-context';
import './globals.css';

// @cloudflare/next-on-pages exige el runtime edge en todas las rutas no estáticas.
export const metadata: Metadata = {
  title: 'Edúcate Comas',
  description:
    'Aprende Linux, inglés, IA, seguridad y más con cursos interactivos y laboratorio en tu navegador.',
};

// Sin clave de Clerk => modo vista previa (usuario fijo, sin autenticación).
const PREVIEW_MODE = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = (
    <html lang="es" className="dark">
      <body className="min-h-screen">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6">{children}</main>
        <Toaster theme="dark" position="top-right" richColors closeButton />
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
      <ClerkAuthBridge>{content}</ClerkAuthBridge>
    </ClerkProvider>
  );
}
