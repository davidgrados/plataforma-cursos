// @ts-check
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // No revelar el framework en la cabecera X-Powered-By.
  poweredByHeader: false,
  images: {
    // Permitimos imágenes remotas (R2, etc.) sin dominio fijo.
    unoptimized: true,
  },
  // Cabeceras de seguridad.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // microphone=(self): permite el micro SOLO en nuestra web (necesario para el tutor de inglés).
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
          { key: 'X-XSS-Protection', value: '0' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // CSP mínima y segura: no restringe scripts (no rompe Next/Clerk)
          // pero bloquea clickjacking, plugins incrustados y secuestro del <base>.
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

// Habilita los bindings (D1/R2) durante `next dev` (solo en desarrollo).
initOpenNextCloudflareForDev();
