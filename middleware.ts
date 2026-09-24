import { NextResponse, type NextRequest } from 'next/server';

/**
 * Fuerza HTTPS: si el visitante entra por http://, lo redirigimos a la
 * versión segura. Cloudflare informa del esquema original en las cabeceras
 * `x-forwarded-proto` y `cf-visitor`, así que solo redirigimos cuando
 * alguna de las dos confirma que la conexión NO es segura (evita bucles).
 */
export function middleware(request: NextRequest) {
  const proto = (request.headers.get('x-forwarded-proto') || '').toLowerCase();
  const cfVisitor = request.headers.get('cf-visitor') || '';
  const esHttp = proto === 'http' || /"scheme"\s*:\s*"http"/i.test(cfVisitor);

  if (esHttp) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = 'educatecomas.com';
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // No interceptamos los recursos estáticos: solo páginas y API.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|icons/).*)'],
};
