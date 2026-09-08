# 🚀 Plataforma Multi-Curso con Laboratorio Linux Interactivo

Aplicación web full-stack para impartir **cursos interactivos**. El curso principal es
**"Linux Básico"**, pero la plataforma soporta **múltiples cursos** gestionables desde un
panel de administración.

El núcleo técnico es un **emulador de terminal 100 % en JavaScript** (Xterm.js) con un
**sistema de archivos virtual persistente** en D1, validación automática de ejercicios y
un panel de administración para editar contenido, estado inicial del FS y lógica de verificación.

---

## ✨ Características

- **Multi-curso**: crea, edita y elimina cursos completos (Linux, IA, Seguridad, etc.).
- **Linux Básico**: 16 módulos (capítulos), prácticas en los módulos 4–16 y **un único
  Examen Final Integral** (sin exámenes por módulo ni parcial).
- **Terminal simulado** con `pwd`, `ls`, `cd`, `mkdir`, `touch`, `echo` (con `>` y `>>`),
  `cat`, `rm` (con `-r`), `grep`, `find . -name`, `clear`.
- **Persistencia** del sistema de archivos y del progreso por usuario/lección en D1.
- **Validación** de ejercicios mediante `check_logic` (código JavaScript evaluado en el servidor).
- **Panel de administración** con editor Markdown (react-simplemde-editor), editor JSON para
  `initial_fs`, editor de `check_logic` y subida de imágenes a R2.
- **Autenticación** con Clerk (login exclusivo vía Google).
- **Diseño** oscuro estilo terminal con Tailwind CSS, Framer Motion, Lucide y Sonner.

---

## 🧱 Stack tecnológico

| Capa        | Tecnología                                                        |
| ----------- | ----------------------------------------------------------------- |
| Frontend    | Next.js 14 (App Router) + TypeScript + Tailwind CSS               |
| Terminal    | `@xterm/xterm` + `@xterm/addon-fit`                               |
| Autenticación | Clerk.dev (OAuth Google)                                        |
| Backend API | Route handlers de Next.js (`app/api`) + `@cloudflare/next-on-pages` |
| Base de datos | Cloudflare D1 (SQLite)                                         |
| Almacenamiento | Cloudflare R2 (imágenes)                                       |
| Editor MD   | `react-simplemde-editor` (EasyMDE)                                |
| UI extras   | Framer Motion, Lucide React, Sonner, `@tailwindcss/typography`    |

---

## 📁 Estructura de carpetas

```
.
├── app/                     # Next.js App Router
│   ├── page.tsx             # Catálogo de cursos (público)
│   ├── course/[slug]/       # Vista de un curso con sus módulos
│   ├── lesson/[id]/         # Lección (teoría/práctica/examen) + terminal
│   ├── admin/dashboard/     # Panel de administración
│   ├── sign-in/  sign-up/   # Páginas de Clerk
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── TerminalEmbed.tsx    # Terminal Xterm.js
│   ├── MarkdownEditor.tsx   # Editor EasyMDE con subida a R2
│   ├── CourseList.tsx       # Galería de cursos
│   ├── ModuleList.tsx       # Acordeón de módulos/lecciones
│   ├── LessonForm.tsx       # Formulario de lección (admin)
│   ├── Markdown.tsx         # Render Markdown + resaltado
│   ├── Navbar.tsx  Breadcrumbs.tsx
│   └── admin/               # CoursesPanel, ModulesPanel, LessonsPanel
├── lib/
│   ├── terminal.ts          # Intérprete de comandos (sin child_process)
│   ├── fs-utils.ts          # Manipulación del FS virtual
│   ├── d1.ts                # Helpers de D1
│   ├── cloudflare.ts        # getRequestContext + helpers HTTP/auth
│   ├── auth-context.tsx     # Auth (Clerk + modo vista previa)
│   ├── api.ts               # Cliente HTTP del frontend
│   ├── types.ts  utils.ts
├── app/api/                 # API (route handlers, edge runtime)
│   ├── courses/  lessons/  terminal/  me/
│   └── admin/  courses/ modules/ lessons/ upload/
├── scripts/
│   ├── seed-data.ts         # Contenido del curso Linux Básico
│   └── seed-linux-course.ts # Genera seed.sql y/o ejecuta vía API
├── schema.sql               # Esquema D1
├── wrangler.toml            # Bindings D1 + R2
├── middleware.ts            # Protección de rutas (Clerk)
└── package.json
```

---

## 🚦 Requisitos previos

- Node.js **v18+** (recomendado v20/22)
- Una cuenta de [Cloudflare](https://dash.cloudflare.com) con Workers/Pages habilitados
- Una aplicación en [Clerk](https://clerk.dev) con **Google OAuth** activado
- `wrangler` (se instala como dependencia)

---

## ⚙️ Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env.local` y rellena:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 3. Recursos de Cloudflare

```bash
# Base de datos D1
npx wrangler d1 create plataforma-cursos-db
# → copia el database_id a wrangler.toml

# Aplicar esquema
npx wrangler d1 execute DB --file=./schema.sql

# Bucket R2
npx wrangler r2 bucket create plataforma-cursos-images
# → actualiza PUBLIC_R2_URL en wrangler.toml
```

### 4. Semilla del curso Linux Básico

```bash
# Genera seed.sql y, si hay credenciales CF_*, lo ejecuta vía API
npx tsx scripts/seed-linux-course.ts

# O manualmente:
npx wrangler d1 execute DB --remote --file=./seed.sql
```

Esto crea el curso **Linux Básico** con 16 módulos (capítulos + prácticas en 4–16) y el
**Examen Final Integral**.

### 5. Primer administrador

Inicia sesión una vez y ejecuta (con el `clerk_id` real):

```bash
npx wrangler d1 execute DB --remote --command \
  "UPDATE users SET role='admin' WHERE clerk_id='user_XXXX';"
```

---

## 🖥️ Desarrollo local

Un solo comando levanta frontend + API (route handlers) con D1/R2 simulados localmente:

```bash
npm run dev
```

- App en `http://localhost:3000`; API en `/api/*` (mismo origen, sin CORS).
- `setupDevPlatform()` inyecta los bindings D1/R2 desde `wrangler.toml` (Miniflare).
- **Modo vista previa**: sin claves de Clerk se usa un usuario fijo para navegar y usar el laboratorio.

Setup inicial de la base de datos (una sola vez):

```bash
npm run db:init                                        # schema al D1 local
npm run seed                                           # genera seed.sql
npx wrangler d1 execute DB --local --file=./seed.sql   # aplica el seed
```

---

## ☁️ Despliegue en Cloudflare Pages

La app usa `@cloudflare/next-on-pages` (single-worker): la API vive en `app/api/**` y los
bindings D1/R2 se leen con `getRequestContext().env`.

1. Crea los recursos y actualiza `wrangler.toml`:
   ```bash
   npx wrangler d1 create plataforma-cursos-db          # copia el database_id a wrangler.toml
   npx wrangler d1 execute DB --remote --file=./schema.sql
   npx wrangler d1 execute DB --remote --file=./seed.sql
   npx wrangler r2 bucket create plataforma-cursos-images
   ```
2. Configura en Cloudflare Pages:
   - Build command: `npm run pages:build`
   - Output directory: `.vercel/output/static`
3. Añade los bindings `DB` (D1) y `IMAGES` (R2) y las variables de Clerk
   (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`).
4. Despliega con `npm run pages:deploy` (o con la integración Git de Cloudflare Pages).

Para marcar al primer administrador:

```bash
npx wrangler d1 execute DB --remote --command "UPDATE users SET role='admin' WHERE clerk_id='user_XXXX';"
```

---

## ⌨️ Comandos del terminal simulado

| Comando            | Descripción                                    |
| ------------------ | ---------------------------------------------- |
| `pwd`              | Muestra la ruta actual                         |
| `ls [ruta]`        | Lista un directorio                            |
| `cd ruta`          | Cambia de directorio (absoluta/relativa)       |
| `mkdir dir`        | Crea un directorio                             |
| `touch archivo`    | Crea un archivo vacío                          |
| `echo texto`       | Imprime texto; con `>`/`>>` redirige a archivo |
| `cat archivo`      | Muestra el contenido de un archivo             |
| `rm [-r] ruta`     | Elimina archivo (o directorio con `-r`)        |
| `grep patrón f`    | Busca un patrón en un archivo                  |
| `find . -name p`   | Busca archivos por patrón                      |
| `clear`            | Limpia la pantalla                             |

Cualquier otro comando devuelve: `bash: <comando>: command not found`.

---

## ✅ Convención de `check_logic`

La validación **no** es código JavaScript arbitrario (Cloudflare Workers prohíbe
`eval`/`new Function`), sino un **DSL declarativo en JSON**:

```json
{
  "checks": [
    { "kind": "isDir", "path": "/home/student/proyectos", "message": "Crea el directorio proyectos" }
  ]
}
```

Tipos de `kind`:

| kind       | Descripción                                   |
| ---------- | --------------------------------------------- |
| `exists`   | la ruta existe (archivo o directorio)         |
| `isDir`    | la ruta es un directorio                      |
| `isFile`   | la ruta es un archivo                         |
| `contains` | el archivo contiene `value`                   |
| `equals`   | el contenido del archivo es exactamente `value` |

Todas las comprobaciones deben cumplirse (AND). Si una falla, se muestra su `message`.

---

## 🗄️ Esquema de datos

Ver [`schema.sql`](./schema.sql): tablas `courses`, `modules`, `lessons`, `users`,
`user_sessions` y `user_progress`, con integridad referencial en cascada.

---

## 📝 Notas técnicas

- **No se usa** `child_process` ni `exec`; toda la terminal es simulada en memoria/JSON.
- Soporta rutas absolutas (`/home/...`) y relativas (`.`, `..`).
- `rm -r` elimina recursivamente el subárbol del JSON.
- `initial_fs` se valida como JSON antes de guardar en el panel admin.
- El terminal usa `xterm-addon-fit` para ajustarse al contenedor (responsive, ≥ 400 px).
