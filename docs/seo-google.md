# Aparecer en Google: qué hay que hacer

Este documento explica, paso a paso, cómo hacer que `educatecomas.com` salga en
las búsquedas de Google. La parte técnica **ya está hecha** en el código; lo que
falta es un trámite de **2 minutos** que solo puede hacer el dueño de la cuenta
de Google (David Grados Alzamora).

---

## 1. Lo que ya está preparado en el sitio

| Elemento | Dónde está | Para qué sirve |
| --- | --- | --- |
| Título y descripción propios | `app/layout.tsx`, `app/page.tsx` | Es el texto azul/en negro que se ve en Google. |
| Título por curso | `app/course/[slug]/layout.tsx` | Cada curso aparece como «Curso de X». |
| Dirección canónica | cada `page.tsx` (`alternates.canonical`) | Evita contenido duplicado. |
| `robots.txt` | `public/robots.txt` | Permite todo y prohíbe las zonas privadas. |
| `sitemap.xml` | `app/sitemap.ts` | Lista de las 11 direcciones públicas. |
| Datos estructurados | `lib/seo.ts` | Ficha de la organización, del sitio, de cada curso, migas de pan y preguntas frecuentes. |
| Imagen de vista previa | `public/og-image.png` | Lo que se ve al compartir el enlace (WhatsApp, X, LinkedIn). |
| Texto para buscadores | `app/page.tsx` | Sección «¿Qué puedes aprender…?» y preguntas frecuentes. |
| Páginas privadas fuera del índice | `next.config.mjs` (`X-Robots-Tag`) | Cuenta, acceso, consentimiento y lecciones no se indexan. |

Comprobaciones rápidas en el navegador:

- `https://educatecomas.com/robots.txt`
- `https://educatecomas.com/sitemap.xml`
- `https://educatecomas.com/og-image.png`

---

## 2. Verificar el dominio en Google Search Console (obligatorio)

1. Entra con la cuenta de Google del dueño en <https://search.google.com/search-console>.
2. Pulsa **«Añadir propiedad»** → elige **«Dominio»** y escribe `educatecomas.com`.
3. Google te muestra un registro **TXT** (empieza por `google-site-verification=…`).
4. Cópialo en Cloudflare: **DNS → Registros → Añadir registro**
   - Tipo: `TXT`
   - Nombre: `@`
   - Contenido: el valor que dio Google
   - TTL: automático
5. Vuelve a Search Console y pulsa **«Verificar»**. Suele tardar entre 1 minuto y 1 hora.

> Si el dominio está en la misma cuenta de Cloudflare, Google puede ofrecer
> «Verificación automática» y hacer el paso 4 solo.

### Alternativa: verificación con etiqueta meta

Si prefieres el método de etiqueta HTML, Google te da algo como:

```html
<meta name="google-site-verification" content="AbC123..." />
```

Copia **solo el valor** de `content` y defínelo como variable de entorno en el
proyecto (y en Cloudflare → Worker → Settings → Variables, como *texto*):

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=AbC123...
```

Después vuelve a desplegar. El sitio publicará la etiqueta automáticamente
(ya está programado en `app/layout.tsx`).

---

## 3. Enviar el mapa del sitio

1. En Search Console, menú izquierdo → **Sitemaps**.
2. Escribe `sitemap.xml` y pulsa **Enviar**.
3. Debe aparecer como «Correcto» con 11 direcciones.

---

## 4. Pedir la indexación de las páginas principales

En Search Console → **Inspección de URL**: pega cada dirección, pulsa
**«Solicitar indexación»**. Hazlo con estas 9:

```
https://educatecomas.com/
https://educatecomas.com/course/linux-basico
https://educatecomas.com/course/ingles-basico
https://educatecomas.com/course/inteligencia-artificial
https://educatecomas.com/course/seguridad-informatica
https://educatecomas.com/course/ciberseguridad
https://educatecomas.com/course/informatica-forense
https://educatecomas.com/course/marketing-digital
https://educatecomas.com/ingles/tutor
```

---

## 5. Cuánto tarda y qué esperar

- **Primeras apariciones:** entre 2 días y 2 semanas para una web nueva.
- **Posicionamiento por «cursos de Linux»:** compite con sitios grandes; lo
  realista al inicio es aparecer buscando **«Edúcate Comas»** o
  **«cursos gratis de Linux en Comas»**.
- Revisa cada semana en Search Console → **Rendimiento** qué búsquedas ya te
  traen visitas: eso indica por dónde crecer con contenido.

## 6. Recomendaciones para subir posiciones

1. **Publicar lecciones como páginas públicas** (hoy el contenido se carga con
   JavaScript y requiere sesión). Si cada lección tuviera su texto en el HTML,
   habría cientos de páginas indexables: es la mayor palanca pendiente.
2. **Enlaces desde fuera**: grupos de Facebook/WhatsApp de Comas, colegios,
   UGEL, directorios de cursos gratuitos del Perú.
3. **Contenido nuevo cada mes** (un curso o un artículo): Google premia la
   actualización constante.
4. **Bing y otros buscadores**: <https://www.bing.com/webmasters> permite
   importar el sitio directamente desde Search Console en un clic.
5. **Perfil de empresa en Google** (Google Business Profile) si en algún momento
   hay atención presencial: aparece en Google Maps y refuerza la marca.

---

## 7. Comprobar que todo está bien

- **Datos estructurados:** <https://search.google.com/test/rich-results> (pega la URL).
- **Vista previa al compartir:** <https://www.opengraph.xyz/>.
- **Velocidad y móvil:** <https://pagespeed.web.dev/>.
