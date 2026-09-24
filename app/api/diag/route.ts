import { json } from '@/lib/cloudflare';

// TEMPORAL: diagnóstico de cabeceras para comprobar el redirect a HTTPS.
// Se elimina en cuanto se verifique.
export async function GET(request: Request) {
  const claves = [
    'x-forwarded-proto',
    'cf-visitor',
    'x-forwarded-for',
    'cf-connecting-ip',
    'host',
  ];
  const salida: Record<string, string> = {};
  for (const k of claves) salida[k] = request.headers.get(k) ?? '(vacío)';
  return json({ url: request.url, cabeceras: salida });
}
