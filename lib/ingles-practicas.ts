// ============================================================
//  Práctica de conversación por módulo del curso "Inglés Básico".
//  Cada módulo tiene su práctica, alineada con lo que se estudia.
// ============================================================

export interface Turn {
  say: string;
  expect: string[];
  example: string;
  tip: string;
}

export interface Practica {
  id: string;
  titulo: string;
  turns: Turn[];
}

export interface Modulo {
  /** Slug de la lección del curso de inglés a la que pertenece esta práctica. */
  slug: string;
  num: number;
  titulo: string;
  emoji: string;
  nivel: string;
  practicas: Practica[];
}

export const MODULOS: Modulo[] = [
  {
    slug: 'ingles-01',
    num: 1,
    titulo: 'Saludos y presentaciones',
    emoji: '👋',
    nivel: 'Principiante',
    practicas: [
      {
        id: 'conocer',
        titulo: 'Conocer a alguien nuevo',
        turns: [
          {
            say: "Hi! Good morning. My name is Ana. What's your name?",
            expect: ['name is', 'my name'],
            example: 'Good morning! My name is Luis.',
            tip: 'Para decir tu nombre: "My name is ..." o "I\'m ...".',
          },
          {
            say: 'Nice to meet you! How are you today?',
            expect: ['i am', 'fine', 'good', 'well'],
            example: "I'm fine, thank you. And you?",
            tip: 'Devolver la pregunta con "And you?" hace la charla natural.',
          },
          {
            say: 'Great! Where are you from?',
            expect: ['from'],
            example: "I'm from Comas, in Lima.",
            tip: '"I\'m from + lugar" sirve para cualquier ciudad o país.',
          },
          {
            say: 'Welcome! It was nice talking to you. See you later!',
            expect: ['thank', 'see you', 'bye', 'goodbye'],
            example: 'Thank you! See you later. Goodbye!',
            tip: 'Despedidas: "See you later", "Goodbye", "Have a nice day".',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-02',
    num: 2,
    titulo: 'El alfabeto y la pronunciación',
    emoji: '🔤',
    nivel: 'Principiante',
    practicas: [
      {
        id: 'deletrear',
        titulo: 'Deletrear y pronunciar',
        turns: [
          {
            say: "Hi! Let's practise the alphabet. Say the letters A, B and C.",
            expect: ['a', 'b', 'c'],
            example: 'A, B, C.',
            tip: 'En inglés la "A" suena /eɪ/ y la "B" suena /biː/.',
          },
          {
            say: 'Very good! Now spell the word HOUSE, letter by letter.',
            expect: ['h', 'o', 'u', 's', 'e'],
            example: 'H - O - U - S - E.',
            tip: 'Para deletrear se dice cada letra separada: "H, O, U, S, E".',
          },
          {
            say: 'Perfect! Now say this word out loud: teacher.',
            expect: ['teacher'],
            example: 'Teacher.',
            tip: 'La "ch" suena como en español; la "ea" suena /iː/.',
          },
          {
            say: 'Excellent! Finally, say the alphabet from A to F.',
            expect: ['a', 'b', 'c', 'd', 'e', 'f'],
            example: 'A, B, C, D, E, F.',
            tip: 'Repite el alfabeto en voz alta todos los días: es la base.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-03',
    num: 3,
    titulo: 'Números, fechas y horas',
    emoji: '🔢',
    nivel: 'Principiante',
    practicas: [
      {
        id: 'datos',
        titulo: 'Tus datos y la hora',
        turns: [
          {
            say: 'Hello! How old are you?',
            expect: ['i am', 'years old'],
            example: "I'm fifteen years old.",
            tip: 'La edad se dice con el verbo "to be": "I am 15 years old".',
          },
          {
            say: "Great! What's your phone number?",
            expect: ['number is', 'my number', 'nine', 'six', 'seven'],
            example: 'My phone number is 987 654 321.',
            tip: 'Los números de teléfono se dicen dígito a dígito.',
          },
          {
            say: 'Thanks! What time is it now?',
            expect: ['it is', 'time', 'oclock', 'o clock'],
            example: "It's nine o'clock.",
            tip: '"It\'s + hora + o\'clock" para las horas exactas.',
          },
          {
            say: 'And what day is it today?',
            expect: [
              'today is',
              'monday',
              'tuesday',
              'wednesday',
              'thursday',
              'friday',
              'saturday',
              'sunday',
            ],
            example: 'Today is Monday.',
            tip: 'Los días de la semana en inglés siempre van con mayúscula.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-04',
    num: 4,
    titulo: 'Pronombres y el verbo "to be"',
    emoji: '👥',
    nivel: 'Básico',
    practicas: [
      {
        id: 'to-be',
        titulo: 'I am, you are, she is',
        turns: [
          {
            say: 'Hello! Are you a student?',
            expect: ['i am', 'yes', 'no'],
            example: 'Yes, I am a student.',
            tip: 'Recuerda: I am · you are · he/she is · we/they are.',
          },
          {
            say: 'Nice! Who is with you today?',
            expect: ['he is', 'she is', 'my'],
            example: 'She is my sister.',
            tip: 'Con "he/she" el verbo es "is": "She is my sister".',
          },
          {
            say: 'And where are your friends from?',
            expect: ['they are', 'from', 'he is', 'she is'],
            example: 'They are from Peru.',
            tip: 'Con "they" el verbo es "are": "They are from Peru".',
          },
          {
            say: 'Great job! Are you happy today?',
            expect: ['i am', 'yes', 'no'],
            example: 'Yes, I am very happy.',
            tip: 'Puedes añadir adjetivos: happy, tired, excited, ready.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-05',
    num: 5,
    titulo: 'El presente simple',
    emoji: '📅',
    nivel: 'Básico',
    practicas: [
      {
        id: 'rutina',
        titulo: 'Mi rutina diaria',
        turns: [
          {
            say: 'Hi! Do you study English every day?',
            expect: ['yes', 'no', 'study'],
            example: 'Yes, I study English every day.',
            tip: '"Every day" son dos palabras: todos los días.',
          },
          {
            say: 'Great! What do you do in the morning?',
            expect: ['i wake up', 'i go', 'i have', 'i get up'],
            example: 'I wake up at six and I go to school.',
            tip: 'Presente simple: I wake up, I go, I have breakfast.',
          },
          {
            say: 'Nice! Does your mother work?',
            expect: ['she works', 'yes', 'no'],
            example: 'Yes, she works in a hospital.',
            tip: 'Con he/she/it el verbo lleva -s: "she works".',
          },
          {
            say: 'And what do you like to do after school?',
            expect: ['i like', 'play', 'watch', 'read'],
            example: 'I like playing football and watching videos.',
            tip: 'Después de "I like" puedes usar un verbo en -ing.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-06',
    num: 6,
    titulo: 'Vocabulario esencial',
    emoji: '🧺',
    nivel: 'Básico',
    practicas: [
      {
        id: 'mi-mundo',
        titulo: 'Colores, familia y comida',
        turns: [
          {
            say: "Let's practise vocabulary. What's your favourite colour?",
            expect: ['favourite', 'favorite', 'colour', 'color'],
            example: 'My favourite colour is blue.',
            tip: 'En inglés americano se escribe "color" y "favorite".',
          },
          {
            say: 'Tell me about your family. Who do you live with?',
            expect: ['mother', 'father', 'brother', 'sister', 'family', 'parents'],
            example: 'I live with my mother, my father and my brother.',
            tip: 'Family: mother, father, brother, sister, grandparents.',
          },
          {
            say: 'What do you usually eat for breakfast?',
            expect: ['bread', 'milk', 'egg', 'coffee', 'eat', 'tea'],
            example: 'I eat bread with milk for breakfast.',
            tip: '"For breakfast / for lunch / for dinner".',
          },
          {
            say: "Nice! And what's in your school bag?",
            expect: ['book', 'pen', 'notebook', 'pencil', 'have'],
            example: 'I have a book, a notebook and two pens.',
            tip: 'Recuerda el plural: one book → two books.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-07',
    num: 7,
    titulo: 'Preguntas y frases útiles',
    emoji: '❓',
    nivel: 'Intermedio',
    practicas: [
      {
        id: 'preguntar',
        titulo: 'Preguntar y pedir ayuda',
        turns: [
          {
            say: 'Hello! Do you have any questions for me?',
            expect: ['can you', 'what is', 'how do', 'repeat'],
            example: 'Can you repeat that, please?',
            tip: 'Frases útiles: "Can you repeat, please?", "How do you say ... in English?"',
          },
          {
            say: 'Of course! Now ask me how old I am.',
            expect: ['how old are you'],
            example: 'How old are you?',
            tip: 'Pregunta por la edad: "How old are you?".',
          },
          {
            say: "I'm thirty years old. Now ask me where I live.",
            expect: ['where do you live'],
            example: 'Where do you live?',
            tip: 'Preguntas con "do": Where do you live? What do you do?',
          },
          {
            say: "Perfect! Finally, tell me politely that you don't understand.",
            expect: ['i do not understand', "don't understand", 'sorry', 'repeat'],
            example: "Sorry, I don't understand. Can you repeat, please?",
            tip: '"I don\'t understand" es la forma más clara de pedir ayuda.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ingles-examen-final',
    num: 8,
    titulo: 'Repaso general (antes del examen)',
    emoji: '🏆',
    nivel: 'Repaso',
    practicas: [
      {
        id: 'repaso',
        titulo: 'Conversación completa',
        turns: [
          {
            say: "Hello! I'm your tutor. What's your name and how are you?",
            expect: ['name is', 'my name', 'i am', 'fine', 'good'],
            example: "My name is Luis and I'm fine, thank you.",
            tip: 'Une dos ideas con "and" para sonar más natural.',
          },
          {
            say: 'Nice! Where are you from and what do you do?',
            expect: ['from', 'i am', 'student', 'study'],
            example: "I'm from Comas and I'm a student.",
            tip: 'Puedes responder a dos preguntas en una sola frase.',
          },
          {
            say: 'What time do you usually study English?',
            expect: ['i study', 'at', 'oclock', 'o clock', 'in the'],
            example: "I usually study English at six o'clock.",
            tip: 'Coloca "usually" antes del verbo: "I usually study".',
          },
          {
            say: 'And what do you like most about English?',
            expect: ['i like', 'because', 'like'],
            example: 'I like English because I can talk to more people.',
            tip: 'Usa "because" para explicar el motivo.',
          },
          {
            say: 'Excellent work! Thanks for practising. See you next time!',
            expect: ['thank', 'see you', 'bye'],
            example: 'Thank you! See you next time!',
            tip: '¡Ya puedes presentarte en inglés con confianza! 🎉',
          },
        ],
      },
    ],
  },
];

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface Evaluacion {
  pct: number;
  ok: boolean;
  matched: string[];
  missing: string[];
}

export function evaluar(dicho: string, turn: Turn): Evaluacion {
  const said = normalizar(dicho);
  const palabras = new Set(said.split(' ').filter(Boolean));
  const matched: string[] = [];
  const missing: string[] = [];
  for (const clave of turn.expect) {
    const k = normalizar(clave);
    const acierto = k.includes(' ') ? said.includes(k) : palabras.has(k);
    (acierto ? matched : missing).push(clave);
  }
  const ok = matched.length > 0;
  const ratio = turn.expect.length ? matched.length / turn.expect.length : 0;
  const objetivo = normalizar(turn.example).split(' ').length;
  const bonus = Math.min(1, palabras.size / Math.max(objetivo, 1)) * 0.25;
  const pct = Math.round(Math.min(1, (ok ? 0.75 : 0) + ratio * 0.15 + bonus) * 100);
  return { pct, ok, matched, missing };
}
