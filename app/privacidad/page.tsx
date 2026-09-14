import type { Metadata } from 'next';
import Link from 'next/link';
import { Cookie, Lock, Mail, ShieldCheck } from 'lucide-react';
import CookieSettings from '@/components/CookieSettings';

export const metadata: Metadata = {
  title: 'Política de Privacidad y Cookies | Edúcate Comas',
  description:
    'Cómo Edúcate Comas trata tus datos personales y qué cookies utiliza la plataforma de cursos interactivos.',
};

const ACTUALIZADO = 'Enero de 2026';
const CONTACTO = 'davidgradosa@hotmail.com';
const RESPONSABLE = 'David Grados';

export default function PrivacidadPage() {
  return (
    <div className="animate-fade-up mx-auto flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <span className="flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm font-medium text-sky-700">
          <ShieldCheck className="h-4 w-4" />
          Tu privacidad, clara y sencilla
        </span>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Política de Privacidad y Cookies
        </h1>
        <p className="text-slate-600">
          En <strong>Edúcate Comas</strong> queremos que aprender sea fácil y seguro, también en lo
          que respecta a tus datos. Aquí te explicamos, sin tecnicismos, qué información usamos y
          para qué.
        </p>
        <p className="text-sm text-slate-500">Última actualización: {ACTUALIZADO}</p>
      </header>

      {/* Resumen amigable */}
      <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Lock className="h-5 w-5 text-sky-600" />
          En resumen
        </h2>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-slate-600">
          <li>• Solo pedimos los datos necesarios para que puedas usar los cursos.</li>
          <li>• <strong>No vendemos ni alquilamos</strong> tus datos a nadie.</li>
          <li>• <strong>No usamos publicidad</strong> ni seguimiento con fines comerciales.</li>
          <li>• Las cookies que utilizamos son <strong>necesarias</strong> para el funcionamiento del sitio.</li>
          <li>• Puedes pedir acceso, corrección o borrado de tus datos escribiéndonos.</li>
        </ul>
      </section>

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-sky-700">
        <h2>1. Quién es el responsable</h2>
        <p>
          El responsable del tratamiento de los datos es <strong>{RESPONSABLE}</strong>, de la
          iniciativa educativa <strong>Edúcate Comas</strong> (Comas, Perú). Para cualquier consulta
          sobre esta política o sobre tus datos personales puedes escribirnos a{' '}
          <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>.
        </p>

        <h2>2. Qué datos recopilamos</h2>
        <p>Solo tratamos la información necesaria para ofrecerte los cursos:</p>
        <ul>
          <li>
            <strong>Datos de tu cuenta:</strong> nombre, dirección de correo electrónico y, si
            inicias sesión con Google, la foto de perfil que ese servicio comparte. Se generan al
            registrarte o iniciar sesión.
          </li>
          <li>
            <strong>Tu progreso de aprendizaje:</strong> lecciones completadas, resultados de
            exámenes y el estado de tus prácticas en el laboratorio (terminal simulado).
          </li>
          <li>
            <strong>Datos técnicos básicos:</strong> dirección IP, tipo de navegador y registros de
            seguridad, necesarios para proteger el servicio frente a abusos y ataques.
          </li>
        </ul>
        <p>
          No solicitamos datos sensibles ni información de pago: la plataforma es de acceso
          gratuito.
        </p>

        <h2>3. Para qué usamos tus datos</h2>
        <ul>
          <li>Crear y gestionar tu cuenta y permitirte iniciar sesión.</li>
          <li>Guardar tu progreso y mostrarte por dónde ibas en cada curso.</li>
          <li>Corregir tus exámenes y prácticas y mostrarte los resultados.</li>
          <li>Mantener la seguridad de la plataforma y prevenir usos indebidos.</li>
          <li>Responder a tus consultas o solicitudes.</li>
        </ul>
        <p>
          <strong>No</strong> utilizamos tus datos para publicidad, perfilado comercial ni para
          enviarte comunicaciones que no hayas solicitado.
        </p>

        <h2>4. Base legal</h2>
        <p>
          Tratamos tus datos porque son necesarios para prestarte el servicio que solicitas (tu
          cuenta y tu progreso) y porque tenemos un interés legítimo en mantener la plataforma
          segura. Cuando aceptas el aviso de cookies, tu consentimiento es la base para el
          almacenamiento de esa preferencia.
        </p>

        <h2 id="cookies">5. Cookies</h2>
        <p>
          Las cookies son pequeños archivos que el navegador guarda para recordar información entre
          visitas. En Edúcate Comas utilizamos <strong>únicamente cookies necesarias</strong>:
        </p>
        <ul>
          <li>
            <strong>Cookies de sesión (autenticación):</strong> permiten mantener tu sesión iniciada
            mientras navegas por los cursos. Sin ellas no podrías entrar en tu cuenta. Las gestiona
            nuestro proveedor de identidad (Clerk).
          </li>
          <li>
            <strong>Cookies de seguridad:</strong> las utiliza nuestra red de distribución
            (Cloudflare) para proteger el sitio frente a ataques y tráfico malicioso.
          </li>
          <li>
            <strong>Preferencia del aviso de cookies:</strong> guardamos en tu navegador una marca
            para no mostrarte el aviso en cada visita.
          </li>
        </ul>
        <p>
          <strong>No utilizamos</strong> cookies publicitarias, de redes sociales ni de seguimiento
          de terceros con fines comerciales.
        </p>
        <p>
          <strong>Puedes aceptar o rechazar:</strong> el aviso que ves al entrar tiene las dos
          opciones. Como únicamente empleamos cookies necesarias, tu decisión no limita el uso del
          sitio: si rechazas, seguiremos usando solo las cookies imprescindibles para la sesión y la
          seguridad, y no activaremos ninguna cookie de análisis, publicidad o seguimiento. Tu
          elección queda guardada en tu navegador y puedes cambiarla cuando quieras.
        </p>
        <p>
          También puedes bloquear o eliminar las cookies desde la configuración de tu navegador. Ten
          en cuenta que, si desactivas las cookies necesarias, es posible que no puedas iniciar
          sesión ni guardar tu progreso.
        </p>

        <h2>6. Con quién compartimos la información</h2>
        <p>
          Para que la plataforma funcione nos apoyamos en proveedores tecnológicos que actúan como
          encargados del tratamiento:
        </p>
        <ul>
          <li>
            <strong>Clerk:</strong> gestiona el registro y el inicio de sesión, incluido el acceso
            con Google.
          </li>
          <li>
            <strong>Cloudflare:</strong> aloja la web, la base de datos donde se guarda tu progreso
            y los servicios de seguridad de la red.
          </li>
        </ul>
        <p>
          Estos proveedores pueden tratar datos en servidores fuera del país. En ningún caso
          vendemos, alquilamos ni cedemos tus datos personales a terceros con fines comerciales.
        </p>

        <h2>7. Cuánto tiempo conservamos los datos</h2>
        <p>
          Conservamos los datos de tu cuenta y tu progreso mientras la mantengas activa. Si solicitas
          el borrado de tu cuenta, eliminaremos tus datos personales y tu progreso en un plazo
          razonable, salvo aquellos que debamos conservar por obligación legal.
        </p>

        <h2>8. Tus derechos</h2>
        <p>
          Puedes ejercer en cualquier momento tus derechos de <strong>acceso</strong>,{' '}
          <strong>rectificación</strong>, <strong>supresión</strong>, <strong>oposición</strong>,{' '}
          <strong>limitación</strong> y <strong>portabilidad</strong> escribiéndonos a{' '}
          <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>. Responderemos lo antes posible y, como
          máximo, en el plazo que exija la normativa aplicable.
        </p>

        <h2>9. Menores de edad</h2>
        <p>
          Edúcate Comas está pensada para toda la familia y su contenido es apto para niños, jóvenes
          y adultos. Los menores de edad deben usar la plataforma con la supervisión de su madre,
          padre o tutor, quienes son responsables de crear y gestionar la cuenta.
        </p>

        <h2>10. Seguridad</h2>
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger tu información:
          conexiones cifradas (HTTPS), autenticación gestionada por un proveedor especializado y
          acceso restringido a la base de datos. Ningún sistema es infalible, pero trabajamos para
          mejorar continuamente.
        </p>

        <h2>11. Cambios en esta política</h2>
        <p>
          Podemos actualizar esta política para reflejar mejoras del servicio o cambios normativos.
          Publicaremos siempre la versión vigente en esta página, con la fecha de última
          actualización.
        </p>

        <h2>12. Contacto</h2>
        <p>
          Si tienes dudas sobre esta política o sobre cómo tratamos tus datos, escribe a{' '}
          <strong>{RESPONSABLE}</strong>:{' '}
          <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>.
        </p>
      </div>

      <section className="flex flex-col items-start gap-3 rounded-2xl border border-sky-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Cookie className="h-4 w-4 text-sky-600" />
          ¿Ya elegiste antes y quieres cambiar de opinión sobre las cookies?
        </p>
        <CookieSettings />
      </section>

      <section className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Mail className="h-4 w-4 text-sky-600" />
          ¿Prefieres empezar a aprender? Vuelve al catálogo de cursos.
        </p>
        <Link
          href="/#cursos"
          className="rounded-xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-2.5 font-semibold text-white shadow-glow transition hover:brightness-105"
        >
          Ver los cursos
        </Link>
      </section>

      <p className="flex items-center gap-2 text-xs text-slate-500">
        <Cookie className="h-3.5 w-3.5" />
        Edúcate Comas © 2026 · Iniciativa educativa para Comas
      </p>
    </div>
  );
}
