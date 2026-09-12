// ============================================================
//  Cuestionarios interactivos (opción múltiple), indexados por slug de lección.
//  `answer` = índice de la opción correcta (0-based).
// ============================================================

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export const QUIZZES: Record<string, QuizQuestion[]> = {
  'linux-examen-final': [
    {
      question: '¿Quién creó el kernel Linux y en qué año?',
      options: [
        'Linus Torvalds, 1991',
        'Bill Gates, 1985',
        'Richard Stallman, 1983',
        'Steve Wozniak, 1976',
      ],
      answer: 0,
    },
    {
      question: '¿Qué diferencia hay entre el kernel y una distribución?',
      options: [
        'El kernel es el núcleo; la distribución lo empaqueta con herramientas y un gestor de paquetes',
        'Son el mismo concepto',
        'La distribución es el núcleo y el kernel es la interfaz gráfica',
        'El kernel solo existe en Windows',
      ],
      answer: 0,
    },
    {
      question: '¿Qué implica una licencia "copyleft" y cuál es un ejemplo?',
      options: [
        'Obliga a distribuir las obras derivadas con la misma licencia; ej. GPL',
        'Permite usar el código sin restricciones; ej. propietario',
        'Prohíbe usar el software; ej. shareware',
        'Nada especial; ej. MIT',
      ],
      answer: 0,
    },
    {
      question: '¿Qué comando muestra la ruta de trabajo actual?',
      options: ['pwd', 'ls', 'cd', 'cat'],
      answer: 0,
    },
    {
      question: '¿Cuál es la diferencia entre una ruta absoluta y una relativa?',
      options: [
        'La absoluta parte de la raíz (/); la relativa parte del directorio actual',
        'La relativa parte de la raíz; la absoluta del directorio actual',
        'Son idénticas',
        'La absoluta no existe',
      ],
      answer: 0,
    },
    {
      question: '¿Qué comando elimina un directorio y todo su contenido?',
      options: ['rm -r directorio', 'rmdir directorio', 'touch directorio', 'cat -r directorio'],
      answer: 0,
    },
    {
      question: '¿Para qué sirve tar y en qué se diferencia de gzip?',
      options: [
        'tar empaqueta archivos; gzip los comprime; juntos forman .tar.gz',
        'Ambos solo comprimen',
        'tar solo comprime; gzip empaqueta',
        'Son intercambiables',
      ],
      answer: 0,
    },
    {
      question: '¿Qué símbolo redirige la salida de un comando a un archivo (sobrescribiendo)?',
      options: ['>', '>>', '<', '|'],
      answer: 0,
    },
    {
      question: '¿Qué es una shebang (#!/bin/bash) y dónde se coloca?',
      options: [
        'Indica el intérprete del script y va en la primera línea',
        'Es un comentario que va al final',
        'Es un tipo de variable',
        'Es un operador de redirección',
      ],
      answer: 0,
    },
    {
      question: '¿Qué comando muestra el espacio libre en disco?',
      options: ['df -h', 'free -h', 'lscpu', 'top'],
      answer: 0,
    },
    {
      question: '¿Qué hace el comando "apt install vim"?',
      options: [
        'Instala el paquete vim (y sus dependencias)',
        'Elimina vim',
        'Busca vim en internet',
        'Actualiza el sistema',
      ],
      answer: 0,
    },
    {
      question: '¿Qué protocolo se usa para conectarse de forma segura a un servidor remoto?',
      options: ['SSH', 'FTP', 'HTTP', 'Telnet'],
      answer: 0,
    },
    {
      question: '¿Por qué se recomienda usar sudo en lugar de trabajar siempre como root?',
      options: [
        'Porque root tiene permisos totales y es fácil dañar el sistema',
        'Porque sudo es más rápido',
        'Porque root no puede ejecutar comandos',
        'Porque sudo no necesita contraseña',
      ],
      answer: 0,
    },
    {
      question: '¿Qué comando cambia la contraseña de un usuario?',
      options: ['passwd usuario', 'chmod usuario', 'useradd usuario', 'chown usuario'],
      answer: 0,
    },
    {
      question: '¿Qué significan los permisos r, w y x?',
      options: ['leer, escribir, ejecutar', 'renombrar, copiar, borrar', 'raíz, web, extra', 'ruta, write, xml'],
      answer: 0,
    },
    {
      question: '¿Qué comando crea un enlace simbólico?',
      options: ['ln -s destino enlace', 'cp enlace', 'mv destino enlace', 'ln -l enlace'],
      answer: 0,
    },
  ],

  'ingles-examen-final': [
    {
      question: '¿Cómo se dice "Buenos días"?',
      options: ['Good morning', 'Good night', 'See you', 'How are you'],
      answer: 0,
    },
    {
      question: '"Nice to meet you" significa…',
      options: ['Encantado/a de conocerte', 'Hasta luego', 'Buenos días', 'No entiendo'],
      answer: 0,
    },
    {
      question: 'Para decir "Me llamo Ana" usas…',
      options: ['My name is Ana', 'I from Ana', 'Name Ana is', 'Ana my name'],
      answer: 0,
    },
    {
      question: 'Completa: "I ___ a student".',
      options: ['am', 'is', 'are', 'be'],
      answer: 0,
    },
    {
      question: '¿Cuál es el presente simple correcto en 3ª persona?',
      options: ['She works', 'She work', 'She working', 'She worked'],
      answer: 0,
    },
    {
      question: 'La negación de "He works" es…',
      options: ["He doesn't work", 'He not work', "He don't work", 'He no work'],
      answer: 0,
    },
    {
      question: '"Thank you" significa…',
      options: ['Gracias', 'Por favor', 'De nada', 'Disculpe'],
      answer: 0,
    },
    {
      question: '"See you later" se usa para…',
      options: ['Despedirse (hasta luego)', 'Saludar', 'Preguntar la hora', 'Presentarse'],
      answer: 0,
    },
    {
      question: '¿Cómo preguntas "¿De dónde eres?"?',
      options: ['Where are you from?', 'What is your name?', 'How old are you?', 'Where you go?'],
      answer: 0,
    },
    {
      question: '¿Cuál pronombre significa "ellos"?',
      options: ['They', 'We', 'He', 'It'],
      answer: 0,
    },
    {
      question: '"red" es…',
      options: ['Un color', 'Un número', 'Un saludo', 'Un verbo'],
      answer: 0,
    },
    {
      question: 'Para decir "¿Cómo estás?" preguntas…',
      options: ['How are you?', 'What is this?', 'Who are they?', 'Where is it?'],
      answer: 0,
    },
  ],

  'ia-examen-final': [
    {
      question: '¿Qué es la Inteligencia Artificial?',
      options: [
        'Sistemas que realizan tareas que requieren inteligencia humana',
        'Un tipo de hardware',
        'Un lenguaje de programación',
        'Una red social',
      ],
      answer: 0,
    },
    {
      question: '¿Quién propuso el "test de Turing"?',
      options: ['Alan Turing', 'Bill Gates', 'Linus Torvalds', 'Tim Berners-Lee'],
      answer: 0,
    },
    {
      question: 'El aprendizaje en el que se usan datos etiquetados se llama…',
      options: ['Supervisado', 'No supervisado', 'Por refuerzo', 'Aleatorio'],
      answer: 0,
    },
    {
      question: '¿Qué es el Deep Learning?',
      options: [
        'Machine Learning con redes de muchas capas',
        'Aprender sin datos',
        'Un tipo de base de datos',
        'Un lenguaje natural',
      ],
      answer: 0,
    },
    {
      question: '¿Para qué sirve el NLP (procesamiento del lenguaje)?',
      options: [
        'Entender y generar lenguaje humano',
        'Reconocer imágenes',
        'Controlar robots',
        'Comprimir vídeos',
      ],
      answer: 0,
    },
    {
      question: 'La visión por computadora permite a las máquinas…',
      options: ['Ver e interpretar imágenes y vídeo', 'Entender lenguaje', 'Generar audio', 'Conducir sin datos'],
      answer: 0,
    },
    {
      question: '¿Qué hace la IA generativa?',
      options: ['Crea contenido nuevo', 'Solo clasifica datos', 'Borra archivos', 'Encripta mensajes'],
      answer: 0,
    },
    {
      question: 'Cuando un modelo de lenguaje "alucina" significa que…',
      options: ['Inventa información falsa con seguridad', 'Detecta errores', 'Funciona perfecto', 'Se apaga'],
      answer: 0,
    },
    {
      question: 'Un riesgo importante de la IA es…',
      options: ['El sesgo en los datos de entrenamiento', 'Que siempre acierta', 'Que no necesita datos', 'Que es muy lenta'],
      answer: 0,
    },
    {
      question: '¿Qué es un "prompt"?',
      options: ['La instrucción que le das al modelo', 'Un tipo de red neuronal', 'Un error del sistema', 'Un dato etiquetado'],
      answer: 0,
    },
    {
      question: 'Un ejemplo de IA en salud es…',
      options: ['Diagnóstico por imagen', 'Redes sociales', 'Videojuegos', 'Correo electrónico'],
      answer: 0,
    },
    {
      question: 'Para un uso responsable de la IA debes…',
      options: ['Verificar la información generada', 'Compartir datos personales', 'Confiar en todo lo que dice', 'Evitarla siempre'],
      answer: 0,
    },
  ],

  'seg-examen-final': [
    {
      question: '¿Cuáles son los tres pilares de la seguridad (tríada CIA)?',
      options: ['Confidencialidad, integridad y disponibilidad', 'Velocidad, color y tamaño', 'Red, disco y RAM', 'Clave, usuario y correo'],
      answer: 0,
    },
    {
      question: '¿Qué es el phishing?',
      options: ['Un engaño para robar credenciales o datos', 'Un virus que borra archivos', 'Un cortafuegos', 'Un tipo de contraseña'],
      answer: 0,
    },
    {
      question: 'Una contraseña segura es…',
      options: ['Larga, única y con varios tipos de caracteres', 'Tu nombre de nacimiento', 'La misma en todos los sitios', 'Corta y fácil de recordar'],
      answer: 0,
    },
    {
      question: '¿Qué aporta la autenticación en dos pasos (2FA)?',
      options: ['Una segunda verificación además de la contraseña', 'Más velocidad', 'Borrar el historial', 'Una contraseña más corta'],
      answer: 0,
    },
    {
      question: 'El ransomware…',
      options: ['Cifra tus archivos y pide rescate', 'Espía tu teclado', 'Muestra publicidad', 'Acelera el equipo'],
      answer: 0,
    },
    {
      question: '¿Por qué es clave actualizar el software?',
      options: ['Corrige vulnerabilidades de seguridad', 'Solo cambia el aspecto', 'Libera espacio', 'No tiene importancia'],
      answer: 0,
    },
    {
      question: 'En una red Wi-Fi pública es recomendable…',
      options: ['Usar una VPN y HTTPS', 'Entrar al banco sin protección', 'Compartir tu contraseña', 'Desactivar el antivirus'],
      answer: 0,
    },
    {
      question: 'Una señal de phishing es…',
      options: ['Un mensaje urgente que pide datos o contraseñas', 'Un correo de un amigo', 'Una actualización del sistema', 'Un enlace conocido'],
      answer: 0,
    },
    {
      question: '¿Qué hace el cifrado?',
      options: ['Convierte la información en un código que solo se lee con clave', 'Borra los datos', 'Acelera internet', 'Copia archivos'],
      answer: 0,
    },
    {
      question: 'La regla 3-2-1 de copias de seguridad significa…',
      options: ['3 copias en 2 soportes, 1 fuera de sitio', '3 discos en 2 PCs', '2 copias en 3 nubes', '1 copia en 3 carpetas'],
      answer: 0,
    },
    {
      question: '¿Qué es un gestor de contraseñas?',
      options: ['Guarda contraseñas fuertes y únicas de forma cifrada', 'Un antivirus', 'Un navegador', 'Un cortafuegos'],
      answer: 0,
    },
    {
      question: '¿Cuál es el "eslabón más débil" en la seguridad?',
      options: ['El error humano', 'El antivirus', 'El hardware', 'El cifrado'],
      answer: 0,
    },
  ],

  'mkt-examen-final': [
    {
      question: '¿Qué es el marketing digital?',
      options: ['Promover productos usando medios en línea', 'Vender solo en tiendas', 'Imprimir anuncios', 'Enviar cartas'],
      answer: 0,
    },
    {
      question: 'Un objetivo SMART debe ser…',
      options: ['Específico, medible y con tiempo', 'Vago y general', 'Solo de ventas', 'Imposible de medir'],
      answer: 0,
    },
    {
      question: 'El "buyer persona" es…',
      options: ['El perfil ideal de tu cliente', 'Un personaje de ficción', 'Tu competidor', 'Una red social'],
      answer: 0,
    },
    {
      question: '¿Cuál es la ventaja principal del marketing digital?',
      options: ['Es medible y segmentable', 'No necesita internet', 'Solo sirve para grandes marcas', 'No tiene coste'],
      answer: 0,
    },
    {
      question: '¿Qué red se usa más para contenido profesional (B2B)?',
      options: ['LinkedIn', 'TikTok', 'Instagram', 'Snapchat'],
      answer: 0,
    },
    {
      question: 'El "storytelling" consiste en…',
      options: ['Contar historias que conecten con la audiencia', 'Publicar solo ofertas', 'Eliminar contenido', 'Comprar seguidores'],
      answer: 0,
    },
    {
      question: 'En publicidad, CPC significa…',
      options: ['Pagas por clic', 'Pagas por cada mil vistas', 'Pago por suscriptor', 'Coste de producción'],
      answer: 0,
    },
    {
      question: '¿Qué es el remarketing?',
      options: ['Mostrar anuncios a quien ya te visitó', 'Comprar anuncios en TV', 'Borrar la historia', 'Publicar en papel'],
      answer: 0,
    },
    {
      question: 'En email marketing es fundamental…',
      options: ['Contar con permiso (no enviar spam)', 'Enviar a cualquier correo', 'Enviar muchas veces al día', 'Ocultar el remitente'],
      answer: 0,
    },
    {
      question: 'El ROI mide…',
      options: ['El retorno de la inversión', 'El número de likes', 'La velocidad de la web', 'Los seguidores'],
      answer: 0,
    },
    {
      question: 'SEO se refiere a…',
      options: ['Optimizar para buscadores (Google)', 'Una red social', 'Publicidad en TV', 'Diseño de logos'],
      answer: 0,
    },
    {
      question: 'Para elegir redes sociales debes…',
      options: ['Ir donde está tu público objetivo', 'Estar en todas sin plan', 'Solo en las nuevas', 'Evitarlas todas'],
      answer: 0,
    },
  ],

  'cib-examen-final': [
    {
      question: '¿Qué es el "riesgo" en ciberseguridad?',
      options: [
        'La probabilidad de que una amenaza aproveche una vulnerabilidad y cause impacto',
        'Un virus informático',
        'Un tipo de contraseña',
        'El antivirus del equipo',
      ],
      answer: 0,
    },
    {
      question: 'La tríada CIA de la seguridad está formada por…',
      options: [
        'Confidencialidad, integridad y disponibilidad',
        'Control, internet y acceso',
        'Cifrado, identidad y auditoría',
        'Clave, usuario y correo',
      ],
      answer: 0,
    },
    {
      question: 'En la gestión de amenazas, un IoC (indicador de compromiso) es…',
      options: [
        'Una huella observable de un ataque, como una IP o un dominio malicioso',
        'Un tipo de firewall',
        'Un certificado digital',
        'Una política de contraseñas',
      ],
      answer: 0,
    },
    {
      question: '¿Qué permite hacer un SIEM?',
      options: [
        'Centralizar registros y correlacionar eventos para detectar incidentes',
        'Cifrar el disco duro',
        'Crear copias de seguridad',
        'Bloquear la publicidad',
      ],
      answer: 0,
    },
    {
      question: 'El marco MITRE ATT&CK sirve para…',
      options: [
        'Catalogar tácticas y técnicas reales usadas por atacantes',
        'Diseñar páginas web',
        'Gestionar nóminas',
        'Medir la velocidad de la red',
      ],
      answer: 0,
    },
    {
      question: 'Al gestionar el riesgo, "transferir" el riesgo significa…',
      options: [
        'Trasladarlo a un tercero, por ejemplo con un seguro o un proveedor',
        'Ignorarlo por completo',
        'Eliminar el activo afectado',
        'Aumentar los permisos de los usuarios',
      ],
      answer: 0,
    },
    {
      question: '¿Por qué la ciberseguridad debe mapear los procesos de negocio?',
      options: [
        'Para proteger primero lo que es crítico y evita parar la operación',
        'Para despedir personal',
        'Para reducir los precios',
        'Para vender más publicidad',
      ],
      answer: 0,
    },
    {
      question: 'El RTO (Recovery Time Objective) define…',
      options: [
        'El tiempo máximo aceptable de interrupción antes de recuperar el servicio',
        'La cantidad de datos que puedes perder',
        'El coste del seguro',
        'El número de empleados del SOC',
      ],
      answer: 0,
    },
    {
      question: 'El RPO (Recovery Point Objective) indica…',
      options: [
        'Cuánta información como máximo puedes permitirte perder',
        'Cuánto tarda en arrancar el servidor',
        'El número de copias de seguridad',
        'Los usuarios con MFA',
      ],
      answer: 0,
    },
    {
      question: 'La norma ISO/IEC 27001 establece…',
      options: [
        'Los requisitos de un sistema de gestión de seguridad de la información (SGSI)',
        'El diseño de redes inalámbricas',
        'El lenguaje de programación de una web',
        'El formato de las facturas',
      ],
      answer: 0,
    },
    {
      question: 'El marco NIST CSF se organiza en las funciones…',
      options: [
        'Identificar, proteger, detectar, responder y recuperar',
        'Comprar, vender, cobrar y facturar',
        'Diseñar, programar, probar y publicar',
        'Planear, ejecutar y despedir',
      ],
      answer: 0,
    },
    {
      question: 'ISO 22301 es la norma de referencia para…',
      options: [
        'La continuidad de negocio',
        'La calidad del software',
        'La gestión de redes sociales',
        'La contabilidad',
      ],
      answer: 0,
    },
    {
      question: 'Cumplir una norma de seguridad (compliance)…',
      options: [
        'Ordena y demuestra el esfuerzo, pero no garantiza estar libre de ataques',
        'Garantiza que nunca te hackearán',
        'Solo sirve para pagar menos impuestos',
        'Sustituye a la concienciación del personal',
      ],
      answer: 0,
    },
    {
      question: 'En la gestión de la ciberseguridad, el CISO es…',
      options: [
        'El responsable de la estrategia y el gobierno de la seguridad',
        'El técnico que repara impresoras',
        'El encargado de la publicidad',
        'El proveedor de internet',
      ],
      answer: 0,
    },
    {
      question: 'El ciclo de mejora continua de la seguridad (PHVA) es…',
      options: [
        'Planificar, hacer, verificar y actuar',
        'Comprar, instalar y olvidar',
        'Detectar, borrar y reiniciar',
        'Programar, vender y facturar',
      ],
      answer: 0,
    },
    {
      question: 'Después de un incidente, la fase de "lecciones aprendidas" sirve para…',
      options: [
        'Corregir las causas y evitar que vuelva a ocurrir',
        'Culpar a un empleado y cerrar el caso',
        'Ocultar lo sucedido',
        'Pagar el rescate',
      ],
      answer: 0,
    },
  ],
};
