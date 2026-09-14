import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Edúcate Comas · Cursos interactivos',
    short_name: 'Edúcate Comas',
    description:
      'Cursos interactivos para toda la familia: Linux, inglés, inteligencia artificial, seguridad informática, ciberseguridad, marketing digital y más.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    lang: 'es',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
