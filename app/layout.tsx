import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import ConsentGate from '@/components/ConsentGate';
import ScrollToTop from '@/components/ScrollToTop';
import { AuthBridge, PreviewAuthProvider } from '@/lib/auth-context';
import {
  OWNER,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_TAGLINE,
  SITE_URL,
  absoluteUrl,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/seo';
import './globals.css';

/**
 * Ficha de Google Search Console (opcional).
 *
 * Cuando verifiques el dominio, pega el código que te da Google (solo la parte
 * del `content`, sin etiquetas) en la variable de entorno
 * `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` y vuelve a desplegar.
 */
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · ${SITE_TAGLINE}`,
    // Cada página aporta su propio título: «Curso de Linux Básico | Edúcate Comas»
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  category: 'education',
  authors: [{ name: OWNER.name, url: `${SITE_URL}/privacidad` }],
  creator: OWNER.name,
  publisher: SITE_NAME,
  // La dirección canónica se declara en cada página (no aquí), para que
  // ningún contenido se marque por error como duplicado de la portada.
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'es_PE',
    url: SITE_URL,
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl(SITE_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: `${SITE_NAME}: ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(SITE_OG_IMAGE)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  ...(GOOGLE_VERIFICATION ? { verification: { google: GOOGLE_VERIFICATION } } : {}),
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
        {/*
          Datos estructurados (JSON-LD): la ficha de la organización y del sitio
          que Google usa para entender quién está detrás de la web y mostrar
          enlaces de sitio (sitelinks) en los resultados de búsqueda.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]),
          }}
        />
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
