'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Al cambiar de página, sube al inicio (evita que se muestre el final del curso).
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Pequeño retraso para que corra tras el render/hidratación.
    const t = setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
