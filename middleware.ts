import { NextResponse, type NextRequest } from 'next/server';

/** Dirección oficial y única del sitio (sin "www"). */
const DOMINIO_OFICIAL = 'educatecomas.com';

/**
 * Unifica la dirección del sitio con redirecciones permanentes (308):
 *
 *  1. http://  →  https://  — Cloudflare informa del esquema original en las
 *     cabeceras `x-forwarded-proto` y `cf-visitor`, así que solo redirigimos
 *     cuando alguna de las dos confirma que la conexión NO es segura (evita
 *     bucles de redirección).
 *  2. www.educatecomas.com  →  educatecomas.com  — así existe una sola
 *     dirección oficial del curso: evita contenido duplicado en los
 *     buscadores y que el acceso con Google reciba un origen distinto al
 *     registrado (que es lo que rompería el inicio de sesión).
 */
export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase().split(':')[0];
  const proto = (request.headers.get('x-forwarded-proto') || '').toLowerCase();
  const cfVisitor = request.headers.get('cf-visitor') || '';
  const esHttp = proto === 'http' || /"scheme"\s*:\s*"http"/i.test(cfVisitor);
  const esWww = host.startsWith('www.');

  if (esHttp || esWww) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = DOMINIO_OFICIAL;
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // No interceptamos los recursos estáticos: solo páginas y API.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|icons/).*)'],
};
