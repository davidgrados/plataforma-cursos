import type { Metadata } from 'next';
import Link from 'next/link';
import { Copyright, Mail, ShieldCheck, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones de uso | Edúcate Comas',
  description:
    'Condiciones de uso de la plataforma educativa Edúcate Comas: uso permitido, propiedad intelectual, contenido de los cursos y responsabilidades.',
};

const ACTUALIZADO = 'Septiembre de 2026';
const CONTACTO = 'davidgradosa@hotmail.com';
const RESPONSABLE = 'David Grados';

export default function TerminosPage() {
  return (
    <div className="animate-fade-up mx-auto flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <span className="flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-1.5 text-sm font-medium text-sky-700">
          <Scale className="h-4 w-4" />
          Condiciones de uso de la plataforma
        </span>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Términos y Condiciones</h1>
        <p className="text-slate-600">
          Estas condiciones explican cómo puedes usar <strong>Edúcate Comas</strong>, qué puedes hacer
          y qué no, y cómo protegemos el trabajo que hay detrás de cada curso.
        </p>
        <p className="text-sm text-slate-500">Última actualización: {ACTUALIZADO}</p>
      </header>

      <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Copyright className="h-5 w-5 text-sky-600" />
          En resumen
        </h2>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-slate-600">
          <li>• La plataforma es <strong>gratuita</strong> y su contenido es educativo.</li>
          <li>• Puedes estudiar, practicar y compartir el <strong>enlace</strong> de los cursos.</li>
          <li>• <strong>No puedes copiar</strong> los contenidos, el código ni la marca para usarlos como propios.</li>
          <li>• Cuida tu cuenta y usa el asistente de IA con respeto.</li>
          <li>• Los menores de 14 años necesitan la autorización de un adulto responsable.</li>
        </ul>
      </section>

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-a:text-sky-700">
        <h2>1. Identificación del titular</h2>
        <p>
          La plataforma <strong>Edúcate Comas</strong> (en adelante, «la Plataforma»), accesible en{' '}
          <strong>https://educatecomas.com</strong>, es titularidad de <strong>{RESPONSABLE}</strong>,
          iniciativa educativa para la comunidad de Comas, Lima (Perú). Correo de contacto:{' '}
          <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>.
        </p>

        <h2>2. Objeto y aceptación</h2>
        <p>
          Estos Términos y Condiciones regulan el acceso y uso de la Plataforma, de sus cursos,
          ejercicios, laboratorios y del asistente de inteligencia artificial. El solo uso de la
          Plataforma implica que <strong>aceptas estas condiciones</strong>. Si no estás de acuerdo,
          te pedimos no utilizarla.
        </p>
        <p>
          El tratamiento de tus datos personales se rige por nuestra{' '}
          <Link href="/privacidad">Política de Privacidad</Link>, que forma parte de estas condiciones.
        </p>

        <h2>3. Descripción del servicio</h2>
        <p>
          Edúcate Comas ofrece <strong>cursos educativos gratuitos</strong> con contenido teórico,
          ejercicios interactivos, un laboratorio simulado y un asistente de conversación con
          inteligencia artificial. El servicio se brinda <strong>tal como está</strong>, con fines
          exclusivamente formativos, y puede actualizarse, ampliarse o modificarse sin aviso previo.
        </p>

        <h2>4. Cuenta de usuario</h2>
        <ul>
          <li>Para guardar tu progreso necesitas crear una cuenta con un proveedor de autenticación externo.</li>
          <li>Debes proporcionar información veraz y <strong>mantener la confidencialidad</strong> de tu acceso.</li>
          <li>Eres responsable de la actividad realizada desde tu cuenta.</li>
          <li>
            Si detectas un uso no autorizado, escríbenos de inmediato a{' '}
            <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>.
          </li>
          <li>
            <strong>Menores de edad:</strong> los menores de 14 años requieren la autorización
            verificable de su madre, padre o tutor legal, conforme se describe en la{' '}
            <Link href="/privacidad#menores">Política de Privacidad</Link>.
          </li>
        </ul>

        <h2>5. Uso permitido</h2>
        <p>Puedes usar la Plataforma para:</p>
        <ul>
          <li>Aprender, practicar y repasar los contenidos de los cursos.</li>
          <li>Usar el laboratorio y el asistente de IA para tu propio aprendizaje.</li>
          <li>Compartir el <strong>enlace</strong> de la Plataforma o de sus cursos con otras personas.</li>
          <li>Usar los contenidos en clase, citando la fuente y sin reproducirlos íntegramente.</li>
        </ul>

        <h2>6. Propiedad intelectual</h2>
        <p>
          Todos los contenidos de la Plataforma —textos de los cursos, ejemplos, preguntas de examen,
          ilustraciones, portadas, diseño, logotipos, nombres comerciales (incluido «Edúcate Comas» y
          la mascota «Colliq») y el <strong>código fuente</strong> que la hace funcionar— son
          titularidad de {RESPONSABLE} o se utilizan con autorización, y están protegidos por la
          legislación peruana sobre derechos de autor y propiedad intelectual, en particular el
          <strong> Decreto Legislativo N° 822</strong> (Ley sobre el Derecho de Autor) y el
          <strong> Decreto Legislativo N° 1075</strong>.
        </p>
        <p>
          Queda <strong>prohibida</strong> la reproducción, distribución, comunicación pública,
          transformación, extracción masiva (incluida la recolección automatizada o <em>scraping</em>)
          o reutilización, total o parcial, de dichos contenidos y del código, por cualquier medio,
          sin <strong>autorización previa y por escrito</strong> del titular.
        </p>
        <p>
          Se permite citar fragmentos breves con fines educativos o informativos, siempre que se
          indique claramente la autoría y se enlace a la fuente original.
        </p>

        <h2>7. Conductas prohibidas</h2>
        <ul>
          <li>Copiar o revender los cursos, total o parcialmente, o presentarlos como propios.</li>
          <li>Usar herramientas automáticas para extraer contenidos o saturar el servicio.</li>
          <li>Intentar acceder a cuentas ajenas, a la administración o a zonas restringidas.</li>
          <li>Introducir virus, código malicioso o realizar pruebas de penetración sin autorización escrita.</li>
          <li>Usar el asistente de IA para generar contenido ilícito, ofensivo o engañoso.</li>
          <li>Suplantar la identidad de otra persona o de la propia Plataforma.</li>
        </ul>
        <p>
          El incumplimiento puede suponer la <strong>suspensión o eliminación de la cuenta</strong> y,
          cuando corresponda, el ejercicio de las acciones legales que amparan al titular.
        </p>

        <h2>8. Asistente de inteligencia artificial</h2>
        <p>
          El asistente «Colliq» utiliza servicios de inteligencia artificial para transcribir la voz y
          generar respuestas. Sus respuestas son <strong>orientativas</strong> y pueden contener
          errores; no sustituyen la enseñanza de un docente ni constituyen asesoría profesional. El uso
          del micrófono es <strong>voluntario</strong> y puedes practicar escribiendo.
        </p>

        <h2>9. Disponibilidad y responsabilidad</h2>
        <p>
          Procuramos que la Plataforma esté siempre disponible, pero no garantizamos un funcionamiento
          ininterrumpido ni libre de errores. El servicio se ofrece de forma gratuita y, en la medida
          permitida por ley, {RESPONSABLE} no responde por daños derivados del uso o de la
          imposibilidad de uso de la Plataforma, ni por decisiones tomadas a partir de su contenido.
        </p>

        <h2>10. Enlaces a terceros</h2>
        <p>
          La Plataforma puede incluir enlaces a sitios de terceros. No controlamos su contenido ni sus
          políticas, por lo que su uso es responsabilidad de cada usuario.
        </p>

        <h2>11. Modificaciones</h2>
        <p>
          Podemos actualizar estos Términos para reflejar mejoras del servicio o cambios normativos.
          Publicaremos siempre la versión vigente en esta página, con su fecha de actualización.
        </p>

        <h2>12. Ley aplicable y jurisdicción</h2>
        <p>
          Estos Términos se rigen por la legislación de la <strong>República del Perú</strong>.
          Cualquier controversia se someterá a los tribunales competentes de Lima, Perú, sin perjuicio
          de los derechos que la ley reconozca a los consumidores.
        </p>

        <h2>13. Contacto</h2>
        <p>
          Para consultas sobre estos Términos, solicitudes de autorización de uso de contenidos o
          cualquier comunicación, escríbenos a{' '}
          <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>.
        </p>
      </div>

      <section className="flex flex-col items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <ShieldCheck className="h-4 w-4 text-sky-600" />
          Consulta también cómo tratamos tus datos personales.
        </p>
        <Link
          href="/privacidad"
          className="rounded-xl border border-sky-300 bg-white px-5 py-2.5 font-semibold text-sky-700 transition hover:bg-sky-50"
        >
          Política de Privacidad
        </Link>
      </section>

      <p className="flex items-center gap-2 text-xs text-slate-500">
        <Mail className="h-3.5 w-3.5" />
        © 2026 Edúcate Comas · Todos los derechos reservados · {RESPONSABLE}
      </p>
    </div>
  );
}
