// ============================================================
//  Seed del curso "Seguridad Informática Básica" (añade a la BD).
//  Genera seed-seguridad.sql y lo aplica a D1 (local o remoto).
// ============================================================

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SLUG = 'seguridad-informatica';
const SIMPLE_FS = JSON.stringify({ home: { student: {} } });

function sqlStr(v: string | null | undefined): string {
  if (v === null || v === undefined) return 'NULL';
  return "'" + v.replace(/'/g, "''") + "'";
}

interface SLesson {
  slug: string;
  title: string;
  type: 'chapter' | 'practice' | 'exam';
  content_md: string;
  order_num: number;
}
interface SModule {
  title: string;
  order_num: number;
  lessons: SLesson[];
}

const chapter = (slug: string, title: string, content: string): SLesson => ({
  slug,
  title,
  type: 'chapter',
  content_md: content,
  order_num: 1,
});

const M1 = `# Módulo 1 · Introducción a la seguridad informática

La **seguridad informática** protege los sistemas, las redes y los datos frente a accesos no autorizados, daños o robos.

## La tríada CIA

- **Confidencialidad:** solo quienes deben pueden ver la información.
- **Integridad:** los datos no se alteran sin autorización.
- **Disponibilidad:** los sistemas están accesibles cuando se necesitan.

## ¿Qué protegemos?

- Datos personales y empresariales.
- Credenciales (usuario y contraseña).
- Dinero y pagos.
- Reputación y privacidad.

## El eslabón más débil

La mayoría de los incidentes ocurren por **error humano**: contraseñas débiles, descuidos o engaños. Por eso la educación en seguridad es clave.

> La seguridad no es un producto: es un **proceso continuo**.`;

const M2 = `# Módulo 2 · Amenazas y tipos de ataques

## Tipos de amenazas

- **Malware:** software malicioso (virus, troyanos, ransomware).
- **Phishing:** engaño para robar credenciales o datos.
- **Ingeniería social:** manipular a las personas para que revelen información.
- **Ataques de fuerza bruta:** probar contraseñas hasta acertar.
- **DoS/DDoS:** saturar un servicio para dejarlo caído.
- **Man-in-the-middle:** interceptar la comunicación entre dos partes.

## Vectores de ataque

- Correo electrónico (adjuntos y enlaces maliciosos).
- Páginas web falsas.
- Redes Wi-Fi públicas inseguras.
- Dispositivos USB desconocidos.
- Aplicaciones no oficiales.

## ¿Quiénes atacan?

- Ciberdelincuentes (con fines económicos).
- Hackers éticos (encontrar fallos para corregirlos).
- Curiosos o usuarios descuidados.
- Actores estatales (espionaje).

> Reconocer las amenazas es el primer paso para defenderte.`;

const M3 = `# Módulo 3 · Contraseñas y autenticación

Las contraseñas son la primera barrera de acceso. Cuanto más fuertes, mejor protegido estás.

## Contraseñas seguras

- Largas (12+ caracteres).
- Mezcla de mayúsculas, minúsculas, números y símbolos.
- Sin datos personales (nombre, fecha de nacimiento).
- **Únicas** para cada servicio.

## Gestores de contraseñas

Guardan contraseñas fuertes y únicas de forma cifrada, para que solo recuerdes una principal.

## Autenticación en dos pasos (2FA)

Añade una segunda verificación (código SMS, app, llave) además de la contraseña. Aunque roben tu contraseña, no podrán entrar sin el segundo factor.

## Señales de una cuenta comprometida

- Actividad que no reconoces.
- Cambios de contraseña o datos que no hiciste.
- Mensajes extraños enviados desde tu cuenta.

> Activa el **2FA** siempre que puedas. Es una de las mejores defensas.`;

const M4 = `# Módulo 4 · Malware y protección

## ¿Qué es el malware?

Es cualquier **software malicioso** diseñado para dañar, robar o espiar.

## Tipos comunes

- **Virus:** se adjunta a programas y archivos.
- **Troyano:** se disfraza de software legítimo.
- **Ransomware:** cifra tus archivos y pide rescate.
- **Spyware:** espía tu actividad.
- **Adware:** muestra publicidad no deseada.
- **Keylogger:** registra lo que escribes (contraseñas).

## Cómo te infectas

- Descargas de sitios no oficiales.
- Adjuntos o enlaces de correos sospechosos.
- Unidades USB desconocidas.
- Software pirata.

## Protección

- **Antivirus** actualizado.
- Sistema operativo **actualizado** (parches de seguridad).
- Descargar solo de **fuentes oficiales**.
- No ejecutar archivos desconocidos.

> Actualiza el software: cada actualización corrige vulnerabilidades conocidas.`;

const M5 = `# Módulo 5 · Seguridad en la red

## Riesgos en las redes

- **Wi-Fi público:** cualquiera puede interceptar el tráfico.
- **Redes falsas:** puntos de acceso creados para espiar.

## Cómo protegerte

- Evita redes Wi-Fi públicas para operaciones sensibles.
- Usa una **VPN** para cifrar tu conexión.
- Verifica el nombre de la red y usa HTTPS.
- Apaga el Wi-Fi/Bluetooth cuando no lo uses.

## HTTPS y certificados

- **HTTPS** cifra la comunicación entre tu navegador y el sitio.
- Comprueba el **candado** en la barra del navegador.
- Desconfía de avisos de "certificado no válido".

## Firewall

Un **cortafuegos** filtra el tráfico y bloquea accesos no deseados.

> En una red pública trata tu tráfico como si lo estuvieran leyendo: usa VPN y HTTPS.`;

const M6 = `# Módulo 6 · Phishing y seguridad en internet

El **phishing** es el engaño más común: mensajes que parecen legítimos para robarte datos.

## Señales de phishing

- **Urgencia:** "tu cuenta será bloqueada".
- Enlaces que no coinciden con el sitio real.
- Errores de ortografía o remitentes raros.
- Piden contraseñas o datos bancarios.
- Adjuntos inesperados.

## Cómo defenderte

- No hagas clic en enlaces sospechosos: pasa el cursor y revisa la URL.
- Verifica con el canal oficial (llama o escribe al contacto real).
- Nunca envíes contraseñas por email.
- Revisa la URL antes de iniciar sesión.

## Qué hacer si caíste

- Cambia la contraseña de inmediato.
- Activa el 2FA.
- Notifica a tu banco o servicio.
- Reporta el correo como phishing.

> Si algo "huele mal" o es demasiado bueno para ser verdad, **desconfía**.`;

const M7 = `# Módulo 7 · Cifrado y privacidad

## ¿Qué es el cifrado?

El **cifrado** convierte información legible en un código que solo puede leerse con una **clave**.

## Cifrado en reposo y en tránsito

- **En reposo:** tus datos guardados (disco, móvil, nube) cifrados.
- **En tránsito:** datos que viajan por internet (HTTPS, VPN, mensajería cifrada).

## Cifrado simétrico y asimétrico

- **Simétrico:** misma clave para cifrar y descifrar (rápido).
- **Asimétrico:** par de claves (pública y privada); base de firmas y TLS.

## Privacidad en línea

- Revisa qué datos comparten las apps y redes sociales.
- Usa configuraciones de privacidad estrictas.
- Piensa antes de publicar información personal.
- Utiliza navegación privada o motores que no rastrean, si lo deseas.

> Cifrar tus dispositivos y tu comunicación hace que, incluso si alguien los intercepta, no pueda leerlos.`;

const M8 = `# Módulo 8 · Buenas prácticas y copias de seguridad

## Hábitos seguros

- **Contraseñas fuertes y únicas** + gestor.
- **2FA** activado en tus cuentas importantes.
- **Actualizaciones** al día (sistema y apps).
- Descargar software solo de **fuentes oficiales**.
- Desconfiar de correos y enlaces extraños.
- Cerrar sesión en equipos compartidos.

## Copias de seguridad (backup)

Protegen contra ransomware, robo o fallos. Regla **3-2-1**:
- **3** copias de tus datos.
- en **2** tipos de soporte distintos.
- **1** copia fuera de sitio (nube o externa).

## Antes de que ocurra

- Define a quién avisar si algo pasa.
- Guarda los números de contacto de soporte.
- Ten un plan para restaurar desde el backup.

> La seguridad se construye con **hábitos diarios**, no con una sola herramienta.`;

const EXAM = `# Examen Final · Seguridad Informática Básica

Responde el examen de opción múltiple para comprobar lo aprendido.`;

const MODULES: SModule[] = [
  { title: 'Módulo 1 · Introducción a la seguridad', order_num: 1, lessons: [chapter('seg-01', 'Introducción a la seguridad informática', M1)] },
  { title: 'Módulo 2 · Amenazas y ataques', order_num: 2, lessons: [chapter('seg-02', 'Amenazas y tipos de ataques', M2)] },
  { title: 'Módulo 3 · Contraseñas y autenticación', order_num: 3, lessons: [chapter('seg-03', 'Contraseñas y autenticación', M3)] },
  { title: 'Módulo 4 · Malware y protección', order_num: 4, lessons: [chapter('seg-04', 'Malware y protección', M4)] },
  { title: 'Módulo 5 · Seguridad en la red', order_num: 5, lessons: [chapter('seg-05', 'Seguridad en la red', M5)] },
  { title: 'Módulo 6 · Phishing y seguridad en internet', order_num: 6, lessons: [chapter('seg-06', 'Phishing y seguridad en internet', M6)] },
  { title: 'Módulo 7 · Cifrado y privacidad', order_num: 7, lessons: [chapter('seg-07', 'Cifrado y privacidad', M7)] },
  { title: 'Módulo 8 · Buenas prácticas y copias de seguridad', order_num: 8, lessons: [chapter('seg-08', 'Buenas prácticas y copias de seguridad', M8)] },
  {
    title: 'Examen Final',
    order_num: 9,
    lessons: [{ slug: 'seg-examen-final', title: 'Examen Final de Seguridad Informática', type: 'exam', content_md: EXAM, order_num: 1 }],
  },
];

const statements: string[] = [];
statements.push(`DELETE FROM courses WHERE slug = '${SLUG}';`);
statements.push(
  `INSERT INTO courses (slug, title, description) VALUES (${sqlStr(SLUG)}, 'Seguridad Informática Básica', 'Aprende a proteger tus datos y dispositivos: contraseñas, malware, phishing, cifrado y buenas prácticas.');`,
);
const courseExpr = `(SELECT id FROM courses WHERE slug = '${SLUG}')`;
for (const m of MODULES) {
  statements.push(`INSERT INTO modules (course_id, title, order_num) VALUES (${courseExpr}, ${sqlStr(m.title)}, ${m.order_num});`);
  const modExpr = `(SELECT id FROM modules WHERE course_id = ${courseExpr} AND title = ${sqlStr(m.title)})`;
  for (const l of m.lessons) {
    statements.push(
      `INSERT INTO lessons (slug, module_id, title, type, content_md, initial_fs, check_logic, order_num) VALUES (${sqlStr(l.slug)}, ${modExpr}, ${sqlStr(l.title)}, ${sqlStr(l.type)}, ${sqlStr(l.content_md)}, '${SIMPLE_FS}', NULL, ${l.order_num});`,
    );
  }
}

const sql = statements.join('\n\n') + '\n';
const out = resolve(process.cwd(), 'seed-seguridad.sql');
writeFileSync(out, sql, 'utf8');
console.log('Generado:', out);
console.log('Módulos:', MODULES.length, '| Lecciones:', MODULES.reduce((a, m) => a + m.lessons.length, 0));
