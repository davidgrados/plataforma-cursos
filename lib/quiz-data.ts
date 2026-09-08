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
};
