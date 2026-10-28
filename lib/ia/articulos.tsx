import type { ReactNode } from 'react';

/**
 * Artículos del hub de inteligencia artificial.
 *
 * Se escriben como componentes para que el HTML salga ya renderizado desde el
 * servidor: Google lee el texto completo sin ejecutar JavaScript, y eso es
 * justamente lo que permite que estos artículos aparezcan en las búsquedas.
 *
 * Para publicar uno nuevo: añadir un objeto al final de `ARTICULOS`.
 * El índice (/ia), el mapa del sitio y la firma del autor se actualizan solos.
 */

export type Articulo = {
  slug: string;
  titulo: string;
  /** Se usa como meta descripción (150–160 caracteres). */
  descripcion: string;
  /** Texto de la tarjeta en /ia. */
  resumen: string;
  /** Fecha de publicación (ISO). */
  fecha: string;
  /** Minutos de lectura, aproximados. */
  lectura: number;
  tema: string;
  palabrasClave: string[];
  Contenido: () => ReactNode;
};

function Articulo1() {
  return (
    <>
      <p className="lead text-lg text-slate-700">
        «Inteligencia artificial» es una de esas expresiones que se escuchan todos los días y que
        casi nadie explica con calma. En la práctica, se trata de programas que aprenden patrones a
        partir de ejemplos, en lugar de seguir instrucciones escritas una por una. Eso es todo lo
        misterioso que hay en el centro del asunto.
      </p>

      <h2>Una definición que se entiende</h2>
      <p>
        La inteligencia artificial (IA) es el conjunto de técnicas que permiten que una computadora
        realice tareas que asociamos con la inteligencia humana: reconocer una imagen, entender una
        frase, traducir un texto, recomendar una película o responder una pregunta.
      </p>
      <p>
        La diferencia con un programa tradicional está en cómo se resuelve el problema. En un
        programa clásico, una persona escribe las reglas: «si el correo contiene estas palabras,
        márcalo como spam». En la IA, en cambio, se le muestran miles de correos ya clasificados y
        el sistema deduce las reglas por su cuenta.
      </p>

      <h2>Cómo aprende una máquina, en tres pasos</h2>
      <ol>
        <li>
          <strong>Datos.</strong> Se reúne una gran cantidad de ejemplos: fotos, textos, números.
          Sin datos no hay aprendizaje; la calidad de los datos decide casi todo el resultado.
        </li>
        <li>
          <strong>Entrenamiento.</strong> El sistema ajusta sus parámetros internos para acertar en
          esos ejemplos. Cada vez que falla, corrige un poco.
        </li>
        <li>
          <strong>Predicción.</strong> Ya entrenado, recibe un caso nuevo y responde con lo que
          aprendió. No «recuerda» ese caso: lo generaliza.
        </li>
      </ol>

      <h2>Los nombres que se confunden</h2>
      <p>
        Se usan casi como sinónimos, pero no lo son, y entender la jerarquía ahorra mucha confusión:
      </p>
      <ul>
        <li>
          <strong>Inteligencia artificial</strong> es el paraguas general: todo lo que hace que una
          máquina imite capacidades humanas.
        </li>
        <li>
          <strong>Aprendizaje automático</strong> (<em>machine learning</em>) es la rama dentro de la
          IA que aprende de datos.
        </li>
        <li>
          <strong>Aprendizaje profundo</strong> (<em>deep learning</em>) es una técnica de aprendizaje
          automático basada en redes neuronales con muchas capas; es la que hizo despegar el
          reconocimiento de voz e imagen.
        </li>
        <li>
          <strong>Modelos de lenguaje</strong> (LLM) son una aplicación del aprendizaje profundo a
          texto: predicen la siguiente palabra probable y, al hacerlo, conversan.
        </li>
      </ul>

      <h2>Ejemplos que ya usas sin llamarlo IA</h2>
      <ul>
        <li>El teclado del celular que adivina la siguiente palabra.</li>
        <li>La traducción automática de un menú escaneado con la cámara.</li>
        <li>El filtro de spam del correo.</li>
        <li>El asistente que responde preguntas por escrito.</li>
        <li>El traductor de voz que convierte tu pronunciación en una frase.</li>
      </ul>

      <h2>Tres mitos que conviene dejar atrás</h2>
      <p>
        <strong>«La IA piensa como nosotros».</strong> No: detecta patrones estadísticos. Puede
        escribir algo convincente y equivocarse en un dato simple, porque no consulta la realidad.
      </p>
      <p>
        <strong>«La IA lo sabe todo».</strong> Sabe lo que estaba en sus datos de entrenamiento,
        hasta cierta fecha. Un modelo puede sonar seguro y estar desactualizado.
      </p>
      <p>
        <strong>«Solo la pueden usar expertos».</strong> Usarla es fácil; lo difícil —y lo
        valioso— es entender qué hace, qué límites tiene y para qué no sirve.
      </p>

      <h2>Por dónde empezar, sin gastar dinero</h2>
      <ul>
        <li>Elige un problema concreto de tu día (resumir un texto, ordenar notas) y resuélvelo con IA.</li>
        <li>Aprende a pedir bien: la calidad de la respuesta depende de la calidad de la pregunta.</li>
        <li>Verifica siempre los datos importantes en una fuente confiable.</li>
        <li>Estudia lo básico (datos, entrenamiento, predicción) antes de correr detrás de la última herramienta.</li>
      </ul>

      <p>
        Ese es el enfoque con el que enseñamos en <strong>Edúcate Comas</strong>: ideas simples,
        ejemplos reales y práctica. Si quieres seguir por aquí, el siguiente paso natural es aprender
        a escribir instrucciones claras, la habilidad que hoy marca la diferencia entre una respuesta
        mediocre y una buena.
      </p>
    </>
  );
}

function Articulo2() {
  return (
    <>
      <p className="lead text-lg text-slate-700">
        La misma herramienta puede darte un texto inútil o uno excelente según cómo le pidas las
        cosas. Escribir bien esas instrucciones («prompts») es una habilidad práctica que se aprende
        en una tarde y se mejora toda la vida.
      </p>

      <h2>Un prompt no es una contraseña: es un encargo</h2>
      <p>
        Un prompt es el mensaje con el que le encargas una tarea a un modelo de lenguaje. Cuando
        apenas dice «háblame de marketing», el modelo tiene que adivinar demasiadas cosas. Cuando
        dices para quién, con qué extensión y con qué objetivo, dejas de apostar.
      </p>

      <h2>La receta de cuatro partes</h2>
      <ol>
        <li>
          <strong>Papel:</strong> «Actúa como profesor de secundaria» o «como editor de un diario».
          Le da un registro y un punto de vista.
        </li>
        <li>
          <strong>Tarea:</strong> el verbo concreto. «Resume», «clasifica», «reescribe», «compara».
          Un solo verbo por petición.
        </li>
        <li>
          <strong>Contexto:</strong> el material de entrada y las condiciones. «Este texto es una
          norma escolar, el público son padres de familia».
        </li>
        <li>
          <strong>Formato:</strong> cómo quieres la salida. «Cinco viñetas», «tabla de dos columnas»,
          «máximo 120 palabras».
        </li>
      </ol>

      <h2>Antes y después</h2>
      <p>
        <strong>Vago:</strong> «Escríbeme sobre ciberseguridad».
      </p>
      <p>
        <strong>Útil:</strong> «Actúa como docente de un colegio de Comas. Escribe 5 consejos de
        ciberseguridad para padres de familia sin conocimientos técnicos, uno por viñeta, con un
        ejemplo cotidiano cada uno y máximo 25 palabras por viñeta».
      </p>
      <p>
        La segunda versión tiene papel, tarea, contexto y formato. No es magia: es precisión.
      </p>

      <h2>Cuatro errores que se repiten</h2>
      <ul>
        <li>
          <strong>Pedir varias cosas a la vez.</strong> Si quieres un correo y además una lista y
          además un resumen, pide una cosa por mensaje.
        </li>
        <li>
          <strong>No dar ejemplos.</strong> Un solo ejemplo del resultado esperado mejora la
          respuesta más que diez líneas de adjetivos.
        </li>
        <li>
          <strong>Creer que la primera respuesta es la definitiva.</strong> Corregir es parte del
          trabajo: «más corto», «sin tecnicismos», «cambia el tono, es para niños».
        </li>
        <li>
          <strong>Confiar sin verificar.</strong> Los modelos se equivocan con seguridad. Los datos
          importantes —cifras, leyes, fechas— se comprueban en la fuente original.
        </li>
      </ul>

      <h2>Pedir a la IA que te haga preguntas</h2>
      <p>
        Un truco que casi nadie usa: «antes de responder, hazme tres preguntas para entender el
        contexto». El modelo deja de adivinar y la respuesta final mejora notablemente, sobre todo
        en trabajos largos: un plan de clase, una carta, un proyecto.
      </p>

      <h2>La ética empieza por la transparencia</h2>
      <p>
        Si la IA redactó un texto que vas a publicar, dilo. Si un dato vino de una IA, verifícalo.
        Usar estas herramientas no tiene nada de malo; presentarlas como trabajo propio cuando no lo
        son, sí. Esa es la línea que enseñamos a los estudiantes: la IA ayuda a pensar, no reemplaza
        el criterio.
      </p>

      <p>
        Con estas cuatro partes —papel, tarea, contexto y formato— ya estás por delante de la
        mayoría. La práctica siguiente es repetirlo con tus propios casos hasta que salga natural.
      </p>
    </>
  );
}

function Articulo3() {
  return (
    <>
      <p className="lead text-lg text-slate-700">
        Una de las preguntas que más nos llegan en Comas es si de verdad se puede aprender
        inteligencia artificial sin pagar una mensualidad. La respuesta es sí, pero con una
        condición: hace falta un orden. Aquí está el que usamos en nuestras clases.
      </p>

      <h2>Primero, lo gratis que ya existe</h2>
      <p>
        Existen cursos abiertos de universidades y plataformas que no cobran nada y que están en
        español. El problema no es la falta de material: es que se empieza por lo difícil. Ordenar
        el aprendizaje vale más que acumular enlaces.
      </p>
      <ul>
        <li>
          <strong>Documentación oficial</strong> de las herramientas que uses: es gratis, está
          actualizada y casi nadie la lee.
        </li>
        <li>
          <strong>Canales y blogs de divulgación</strong> en español, útiles para entender
          conceptos, no para copiar código.
        </li>
        <li>
          <strong>Cursos abiertos introductorios</strong> de universidades: buenos para tener una
          base ordenada de conceptos.
        </li>
      </ul>

      <h2>La ruta de cuatro etapas</h2>
      <ol>
        <li>
          <strong>Alfabetización.</strong> Entender qué es la IA, qué puede y qué no. Dos semanas de
          lectura tranquila. Sin esto, todo lo demás se vuelve una colección de recetas.
        </li>
        <li>
          <strong>Uso con criterio.</strong> Practicar con un asistente de texto y una herramienta de
          imágenes. Aprender a pedir, corregir y verificar. Aquí la práctica diaria vale más que
          cualquier curso.
        </li>
        <li>
          <strong>Fundamentos técnicos.</strong> Datos, probabilidad básica y qué es entrenar un
          modelo. No necesitas ser matemático, pero sí saber qué ocurre por dentro para no creer
          cualquier promesa de marketing.
        </li>
        <li>
          <strong>Proyecto propio.</strong> Resolver un problema real de tu barrio, tu colegio o tu
          trabajo: clasificar reclamos, resumir actas, ordenar una biblioteca. El proyecto es lo que
          convierte el estudio en habilidad y, además, en portafolio.
        </li>
      </ol>

      <h2>Lo que sí cuesta y no se compra</h2>
      <p>
        Tiempo constante —treinta minutos al día rinden más que un taller de un fin de semana—, una
        computadora prestada si no tienes, y la costumbre de preguntar cuando algo no se entiende.
        En Perú hay además comunidades, universidades y colegios con talleres gratuitos: buscarlos
        vale la pena.
      </p>

      <h2>En qué se nota el progreso</h2>
      <ul>
        <li>Dejas de pedir «que me escriba todo» y empiezas a pedir cosas concretas.</li>
        <li>Detectas cuándo una respuesta suena bien pero es falsa.</li>
        <li>Puedes explicar con tus palabras la diferencia entre IA, aprendizaje automático y modelo de lenguaje.</li>
        <li>Tienes un proyecto terminado que puedes mostrar.</li>
      </ul>

      <h2>Por qué enseñamos esto gratis</h2>
      <p>
        Porque la distancia entre quien usa la IA y quien solo la escucha nombrar se está
        convirtiendo en una distancia de oportunidades: empleo, estudios, trámites. Cerrarla un poco
        desde un barrio de Lima no cambia el mundo, pero cambia el de quien se sienta a estudiar.
        Esa es toda la ambición de <strong>Edúcate Comas</strong>.
      </p>
    </>
  );
}

export const ARTICULOS: Articulo[] = [
  {
    slug: 'que-es-la-inteligencia-artificial',
    titulo: 'Qué es la inteligencia artificial: guía para empezar desde cero',
    descripcion:
      'Qué es la inteligencia artificial explicada sin tecnicismos: cómo aprende una máquina, qué diferencia hay entre IA, machine learning y deep learning, y por dónde empezar.',
    resumen:
      'La definición que sí se entiende, cómo aprende una máquina en tres pasos, los nombres que todos confunden y tres mitos que conviene dejar atrás.',
    fecha: '2026-10-27',
    lectura: 6,
    tema: 'Fundamentos',
    palabrasClave: [
      'qué es la inteligencia artificial',
      'inteligencia artificial para principiantes',
      'machine learning vs deep learning',
      'aprender IA desde cero',
    ],
    Contenido: Articulo1,
  },
  {
    slug: 'como-escribir-buenos-prompts',
    titulo: 'Cómo escribir buenos prompts: guía práctica para sacarle partido a la IA',
    descripcion:
      'Aprende a escribir prompts eficaces con la receta de cuatro partes (papel, tarea, contexto y formato), con ejemplos antes y después y los cuatro errores más comunes.',
    resumen:
      'Papel, tarea, contexto y formato: la receta que convierte una pregunta vaga en una respuesta útil, con ejemplos reales y errores a evitar.',
    fecha: '2026-10-27',
    lectura: 5,
    tema: 'Práctica',
    palabrasClave: [
      'cómo escribir prompts',
      'ingeniería de prompts',
      'prompts para ChatGPT en español',
      'usar IA correctamente',
    ],
    Contenido: Articulo2,
  },
  {
    slug: 'aprender-inteligencia-artificial-gratis-peru',
    titulo: 'Cómo aprender inteligencia artificial gratis en Perú, sin pagar cursos',
    descripcion:
      'Una ruta de cuatro etapas para aprender inteligencia artificial gratis desde Perú: qué estudiar primero, qué herramientas usar y cómo saber que estás avanzando.',
    resumen:
      'La ruta de cuatro etapas que usamos en nuestras clases: alfabetización, uso con criterio, fundamentos técnicos y un proyecto propio.',
    fecha: '2026-10-27',
    lectura: 5,
    tema: 'Aprender en Perú',
    palabrasClave: [
      'aprender inteligencia artificial gratis',
      'cursos de IA en Perú',
      'inteligencia artificial Lima',
      'estudiar IA sin dinero',
    ],
    Contenido: Articulo3,
  },
];

export function getArticulo(slug: string): Articulo | undefined {
  return ARTICULOS.find((a) => a.slug === slug);
}
