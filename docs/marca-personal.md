# Posicionar «David Grados Alzamora» como referente en inteligencia artificial

Objetivo: que al buscar **«David Grados Alzamora»** o **«David Grados IA»** aparezca su perfil,
sus artículos y el panel de conocimiento de Google; y que al buscar temas de IA en Perú, sus
contenidos compitan.

---

## 1. Lo que ya está construido en el sitio

| Pieza | Dirección | Qué hace |
| --- | --- | --- |
| Página de autor | `/sobre-mi` | Es la ficha oficial: quién es, qué temas trabaja, proyectos, contacto. |
| Hub de inteligencia artificial | `/ia` | Sección temática que reúne las guías firmadas. |
| Guías publicadas | `/ia/que-es-la-inteligencia-artificial`, `/ia/como-escribir-buenos-prompts`, `/ia/aprender-inteligencia-artificial-gratis-peru` | Contenido largo, en español, con palabras que la gente busca. |
| Datos estructurados `Person` | `/sobre-mi` (JSON-LD) | Declara nombre, cargo, temas (`knowsAbout`), ubicación, correo y perfiles externos (`sameAs`). |
| Autoría en cada artículo | JSON-LD `Article` + firma visible | Google asocia cada texto con la persona, no con el sitio. |
| Enlazado interno | menú «Guías de IA», pie y portada | Reparte autoridad hacia `/sobre-mi` y `/ia`. |
| Mapa del sitio | `/sitemap.xml` | Incluye el perfil y las tres guías. |

Archivos que se editan cuando cambien los datos del autor: **`lib/perfil.ts`** (nombre, temas,
perfiles externos, lema) y **`lib/ia/articulos.tsx`** (artículos nuevos).

---

## 2. La verdad incómoda (para no vender humo)

Un nombre se posiciona de dos maneras y **las dos son necesarias**:

1. **Señales propias** (lo que ya hicimos): una página dedicada, contenido firmado y datos
   estructurados.
2. **Señales externas** (lo que falta): menciones en otros sitios. Google necesita ver el nombre
   escrito fuera de casa para creer que es relevante. Sin esto, el perfil existe pero no compite.

Nadie —ni una agencia— puede colocar un nombre en las primeras posiciones por IA en pocas semanas.
Lo realista:

- **Semana 1–2:** aparece al buscar «David Grados Alzamora».
- **Mes 1–3:** los artículos empiezan a recibir visitas por búsquedas largas («cómo escribir
  prompts», «aprender IA gratis Perú»).
- **Mes 4–12:** posibles apariciones para «inteligencia artificial Perú» y, si hay suficientes
  menciones externas, **panel de conocimiento** con foto y perfiles.

---

## 3. Lo que solo puede hacer el dueño (orden de prioridad)

### A. Google Search Console (imprescindible)

Ver el documento `docs/seo-google.md`: verificar el dominio y enviar el sitemap. Sin esto Google
tarda mucho más en descubrir `/sobre-mi` y `/ia`.

### B. LinkedIn: el perfil que Google usa para confirmar identidad

1. Nombre exacto y consistente: **David Grados Alzamora**.
2. Titular (headline): «Fundador de Edúcate Comas · Inteligencia artificial y educación
   tecnológica».
3. En la sección **Destacado / Información de contacto**, añadir el enlace al sitio:
   `https://educatecomas.com/sobre-mi`.
4. Publicar **un texto corto a la semana** sobre IA (puede ser el resumen de una guía del sitio,
   con enlace al artículo completo). La constancia vale más que la extensión.
5. Añadir «Edúcate Comas» como experiencia actual con el enlace a la web.

> Perfiles ya declarados en `sameAs` (`lib/perfil.ts`): **TikTok** (`@davidgradosa`) y **GitHub**
> (`davidgrados`). Faltan LinkedIn y, si los usa, YouTube o X. Para añadir uno nuevo basta editar
> `REDES` en `lib/perfil.ts`: aparece solo en `/sobre-mi`, en el pie y en el JSON-LD.

### B bis. TikTok: cómo convertir los vídeos en señal SEO

TikTok no posiciona en Google, pero **sí alimenta la identidad de la marca**: Google encuentra el
perfil, ve el nombre completo y suma una fuente externa que confirma que la persona existe.

Qué hacer en el perfil:

1. **Nombre visible** (no el @): *David Grados Alzamora*. El @ es `@davidgradosa`; en el campo
   «Nombre» hay que escribir el nombre completo, porque es lo que indexan los buscadores.
2. **Biografía** con la palabra clave: «Inteligencia artificial explicada en simple · Fundador de
   Edúcate Comas».
3. **Enlace en bio**: `https://educatecomas.com/sobre-mi` (una página con más enlaces desde el
   perfil reparte mejor la señal que la portada).
4. **Al publicar**: di el tema en las primeras palabras del texto del vídeo («prompts», «qué es la
   IA») y escribe el nombre completo al menos en la descripción de los vídeos importantes.
5. **Constancia**: 2–3 vídeos por semana valen más que 10 en un día y un mes de silencio. Cada
   vídeo puede ser el resumen de 60 segundos de una guía de `/ia`, con enlace en bio.

### C. Menciones externas (de 1 a 3 al mes, sin rellenar)

Las que de verdad mueven la aguja para un nombre personal:

- **Charlas o talleres** en colegios, UGEL, bibliotecas o universidades: casi siempre publican el
  nombre y la web.
- **Entrevistas** en radios locales o medios digitales de Comas/Lima Norte.
- **Comunidades**: respuestas útiles en grupos de docentes, foros peruanos de tecnología,
  Stack Overflow en español (con el perfil enlazado).
- **Colaboraciones**: escribir un artículo invitado para un blog educativo peruano.
- **GitHub**: repositorios con README que enlacen a `educatecomas.com/sobre-mi`.

Regla de oro: una mención real vale más que cincuenta enlaces comprados. Los enlaces pagados o
granjas de enlaces pueden penalizar el dominio.

### D. Consistencia del nombre (lo que Google llama «citations»)

Siempre igual, sin variantes: **David Grados Alzamora**. Si se usa «David Grados» solo, que sea un
alias declarado (ya está en el `alternateName`). Que coincidan: nombre del sitio, LinkedIn, correo,
firma de los artículos y tarjetas.

---

## 4. Plan de contenido (90 días)

| Semana | Acción |
| --- | --- |
| 1 | Verificar Search Console, enviar sitemap, pedir indexación de `/sobre-mi` y `/ia`. Actualizar LinkedIn. |
| 2 | Publicar una guía nueva en `/ia` (tema: «IA para docentes»). Compartirla en LinkedIn. |
| 3 | Ofrecer un taller gratuito en un colegio de Comas y pedir que publiquen el enlace. |
| 4 | Guía: «Herramientas de IA gratis que sí sirven en 2026». |
| 5–8 | Una guía cada dos semanas + una publicación semanal en LinkedIn. |
| 9–12 | Buscar 2 menciones externas (radio local, blog educativo) y revisar en Search Console qué búsquedas ya traen visitas. |

Temas con más probabilidad de posicionar (poca competencia en español, intención clara):

- «IA para docentes de secundaria en Perú»
- «Cómo detectar si un texto lo escribió una IA»
- «IA gratis para estudiantes sin tarjeta»
- «Qué es un modelo de lenguaje, explicado con ejemplos peruanos»
- «Cómo usar IA sin conexión estable»

---

## 5. Cómo medir el avance

En Search Console → **Rendimiento**, filtrar por consulta:

- `david grados alzamora` → debe aparecer en 1–2 semanas.
- `david grados` + `ia` → señal de asociación de marca con el tema.
- Consultas de los artículos → indican qué temas profundizar.

Herramientas gratuitas para revisar la ficha de persona:

- <https://search.google.com/test/rich-results> (pegar `https://educatecomas.com/sobre-mi`).
- Buscar el nombre entre comillas en Google, Bing y DuckDuckGo una vez al mes.
