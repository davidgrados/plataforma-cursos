// ============================================================
//  Seed del curso "Ciberseguridad Básica" (12 módulos + examen final).
//  Incluye: gestión de amenazas, procesos de negocio, normas/buenas
//  prácticas, gestión de la ciberseguridad y respuesta a incidentes.
//  Genera seed-ciberseguridad.sql y lo aplica a D1.
// ============================================================

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SLUG = 'ciberseguridad';
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

const M1 = `# Módulo 1 · Introducción a la ciberseguridad

La **ciberseguridad** protege sistemas, redes, datos y personas frente a ataques digitales.

## Conceptos base

- **Activo:** algo valioso que proteger (datos, cuentas, equipos, reputación).
- **Amenaza:** lo que puede causar daño.
- **Vulnerabilidad:** una debilidad aprovechable.
- **Riesgo:** probabilidad × impacto de que una amenaza explote una vulnerabilidad.

## La tríada CIA

- **Confidencialidad**, **Integridad** y **Disponibilidad**.

## Pilares de un programa de ciberseguridad

**Personas · Procesos · Tecnología** — los tres deben trabajar juntos.

> La ciberseguridad no es solo un producto: es un **proceso continuo** de toda la organización.`;

const M2 = `# Módulo 2 · Amenazas y mentalidad del atacante

Entender cómo piensa un atacante mejora tu defensa.

## Actores de amenaza

- **Ciberdelincuentes** (dinero).
- **Hacktivistas** (ideología).
- **Espías / APT** (información estratégica).
- **Insiders** (empleados, por error o intención).
- **Hackers éticos** (con permiso, para mejorar).

## Fases del atacante

Reconocimiento → búsqueda de vulnerabilidades → explotación → escalada de privilegios → persistencia.

## Vulnerabilidades frecuentes

- Contraseñas débiles o reutilizadas.
- Software sin actualizar.
- Configuraciones por defecto.
- Falta de MFA.

> La mayoría de incidentes aprovechan debilidades **conocidas y evitables**.`;

const M3 = `# Módulo 3 · Gestión de amenazas informáticas

**Gestionar amenazas** es identificarlas, evaluarlas y reducirlas de forma ordenada.

## Inteligencia de amenazas (Threat Intelligence)

- **Indicadores de compromiso (IoC):** huellas de un ataque (IPs, dominios, hashes).
- **TTP:** tácticas, técnicas y procedimientos de los atacantes.
- Fuentes: feeds, CERT, fabricantes.

## Análisis de riesgos

1. **Identificar** activos y amenazas.
2. **Evaluar** probabilidad e impacto.
3. **Priorizar** (matriz de riesgo).
4. **Tratar:** mitigar, transferir, aceptar o evitar.

## Modelos de referencia

- **MITRE ATT&CK:** catálogo de tácticas y técnicas reales.
- **Cyber Kill Chain:** etapas de un ataque.

## Herramientas de gestión

- **SIEM** (correlación de eventos y alertas).
- **IDS/IPS** (detección/prevención de intrusiones).
- **Vulnerability management** (escaneo y parcheo).

> No puedes proteger lo que no conoces: **inventario y visibilidad** primero.`;

const M4 = `# Módulo 4 · Ingeniería social y phishing

La ingeniería social manipula **personas** para obtener acceso o información.

## Técnicas

- **Phishing**, **vishing** (voz), **smishing** (SMS).
- **Pretexting:** historia creíble.
- **Baiting:** USB o premio.
- **Spear phishing:** dirigido y personalizado.

## Señales de alerta

- Urgencia o miedo.
- Remitente/enlace sospechoso.
- Errores de ortografía.
- Piden contraseñas o dinero.

## Defensa

- Verificar por canal oficial.
- No hacer clic en enlaces inesperados.
- Formación continua del personal.
- Simulacros de phishing.

> El factor humano es el objetivo favorito: **concienciar** es defender.`;

const M5 = `# Módulo 5 · Identidad, autenticación y control de acceso

## Contraseñas

- Largas, únicas y complejas; usa un **gestor**.

## Autenticación multifactor (MFA)

Combina algo que **sabes**, algo que **tienes** y algo que **eres**. Las **passkeys** eliminan la contraseña.

## Control de acceso

- **Mínimo privilegio:** solo los permisos necesarios.
- **SSO:** inicio de sesión único.
- Revisión periódica de accesos y bajas de usuarios.

## Zero Trust ("confianza cero")

**Nunca confíes, verifica siempre.** Cada acceso se autentica y autoriza.

> La identidad es el nuevo perímetro de seguridad.`;

const M6 = `# Módulo 6 · Seguridad de redes y comunicaciones

## Riesgos

- Wi-Fi público, redes falsas (evil twin), sniffing.

## Protección

- **HTTPS** y certificados válidos.
- **VPN** para cifrar la conexión.
- Configurar bien el router (contraseña, WPA3, segmentación).
- **Firewall** y filtrado DNS.

## Conceptos

- **Segmentación:** separar redes (invitados, IoT).
- **DMZ:** zona para servicios expuestos.
- **Cifrado en tránsito.**

> Cifrado + buenas prácticas = red mucho más segura.`;

const M7 = `# Módulo 7 · Seguridad en la nube y en dispositivos

## Nube

- Protege el **acceso** (MFA) y la **configuración**.
- Revisa permisos de apps y compartición de archivos.
- Responsabilidad compartida: el proveedor protege la infraestructura; tú, tus datos y accesos.

## Dispositivos

- **Actualiza** sistema y apps.
- Cifra el disco.
- Bloqueo por PIN/huella.
- Apps solo de tiendas oficiales.

## Móviles

- Revisa permisos de las apps.
- "Buscar mi dispositivo" y borrado remoto.

> En la nube, casi todos los incidentes vienen de **configuraciones y accesos** mal gestionados.`;

const M8 = `# Módulo 8 · Gestión de procesos de negocio y continuidad

La ciberseguridad debe **servir al negocio**, no frenarlo.

## Procesos de negocio (BPM)

Un **proceso** es una secuencia de actividades que genera valor.

- **Identificar** los procesos críticos (ventas, pagos, atención).
- **Mapear** sus dependencias tecnológicas.
- **Priorizar** su protección según su impacto.

## Continuidad de negocio (BCP) y recuperación (DRP)

- **BCP:** cómo seguir operando durante una crisis.
- **DRP:** cómo recuperar los sistemas tras un desastre.
- **RTO:** tiempo máximo de interrupción aceptable.
- **RPO:** cantidad máxima de datos que puedes perder.

## Resiliencia

- Redundancia, planes de contingencia y **simulacros**.

> Un ataque no solo es un problema técnico: puede **parar el negocio**.`;

const M9 = `# Módulo 9 · Normas y buenas prácticas

Los estándares aportan un marco probado para gestionar la seguridad.

## Normas clave

- **ISO/IEC 27001:** sistema de gestión de seguridad de la información (SGSI).
- **ISO/IEC 27002:** controles y buenas prácticas.
- **NIST CSF:** marco de ciberseguridad (identificar, proteger, detectar, responder, recuperar).
- **ISO 22301:** continuidad de negocio.
- **RGPD / Ley de Protección de Datos:** privacidad de datos personales.
- **PCI DSS:** seguridad de datos de tarjetas de pago.

## Buenas prácticas generales

- Políticas claras y responsabilidades definidas.
- Actualizaciones y parcheo.
- Copias de seguridad 3-2-1.
- MFA en todas las cuentas críticas.
- Formación y concienciación continua.
- Registro y monitorización (logs).

## Cumplimiento (compliance)

Cumplir la norma **no garantiza** estar seguro, pero ordena el esfuerzo y demuestra responsabilidad.

> Las normas no son burocracia: son **experiencia acumulada** hecha método.`;

const M10 = `# Módulo 10 · Gestión de la ciberseguridad

**Gestionar** la ciberseguridad es dirigir personas, procesos y tecnología con método.

## Gobierno (governance)

- Define **políticas**, roles y responsabilidades.
- Alinea la seguridad con los **objetivos del negocio**.
- Apoyo de la **dirección** (no es solo cosa de TI).

## Roles típicos

- **CISO:** responsable de la estrategia de seguridad.
- **Analista SOC:** monitoriza y responde a alertas.
- **Pentester:** prueba la seguridad con permiso.
- **DPO:** protección de datos.

## Ciclo de mejora continua (PHVA)

**Planificar → Hacer → Verificar → Actuar.** La seguridad se mejora por ciclos.

## Métricas (KPIs)

- Nº de incidentes y tiempo de respuesta.
- % de sistemas actualizados.
- Cobertura de MFA.
- Resultados de simulacros.

## Concienciación

La formación del personal reduce el riesgo más que cualquier herramienta.

> La seguridad es un **programa**, no un parche.`;

const M11 = `# Módulo 11 · Respuesta a incidentes y forense básica

## Fases de respuesta

1. **Preparación** (planes, contactos, herramientas).
2. **Detección y análisis.**
3. **Contención** (aislar el problema).
4. **Erradicación** (eliminar la causa).
5. **Recuperación** (restaurar servicios).
6. **Lecciones aprendidas.**

## Si te hackean

- Cambia contraseñas y activa MFA.
- Avisa a tu banco y servicios afectados.
- Conserva **evidencias** (no borres todo).
- Denuncia ante las autoridades.
- **No pagues rescates.**

## Forense básica

- Preservar la evidencia (imágenes, logs).
- Cadena de custodia.
- Orden de volatilidad: memoria → disco → red.

> Responder bien reduce el daño; aprender evita que vuelva a ocurrir.`;

const M12 = `# Módulo 12 · Ciberseguridad responsable y carrera

## Hacking ético

- Prueba sistemas **solo con autorización**.
- No accedas a datos ajenos.
- **Divulgación responsable** de vulnerabilidades.
- Respeta la ley y la privacidad.

## Ética y legalidad

Actuar sin permiso puede ser **delito**, aunque la intención sea buena.

## Salidas profesionales

- Analista SOC / Blue Team.
- Pentester / Red Team.
- Forense digital.
- Consultor y auditor de seguridad.
- Gestor de riesgos / CISO.

## Cómo empezar

- Aprende redes, sistemas y fundamentos.
- Practica en laboratorios legales (CTF, entornos propios).
- Certificaciones: CompTIA Security+, CEH, ISO 27001 Lead Implementer.

> La ciberseguridad es una carrera de **aprendizaje continuo y ética**.`;

const EXAM = `# Examen Final · Ciberseguridad Básica

Responde el examen de opción múltiple para comprobar lo aprendido.`;

const MODULES: SModule[] = [
  { title: 'Módulo 1 · Introducción a la ciberseguridad', order_num: 1, lessons: [chapter('cib-01', 'Introducción a la ciberseguridad', M1)] },
  { title: 'Módulo 2 · Amenazas y mentalidad del atacante', order_num: 2, lessons: [chapter('cib-02', 'Amenazas y mentalidad del atacante', M2)] },
  { title: 'Módulo 3 · Gestión de amenazas informáticas', order_num: 3, lessons: [chapter('cib-03', 'Gestión de amenazas informáticas', M3)] },
  { title: 'Módulo 4 · Ingeniería social y phishing', order_num: 4, lessons: [chapter('cib-04', 'Ingeniería social y phishing', M4)] },
  { title: 'Módulo 5 · Identidad y control de acceso', order_num: 5, lessons: [chapter('cib-05', 'Identidad, autenticación y control de acceso', M5)] },
  { title: 'Módulo 6 · Seguridad de redes', order_num: 6, lessons: [chapter('cib-06', 'Seguridad de redes y comunicaciones', M6)] },
  { title: 'Módulo 7 · Nube y dispositivos', order_num: 7, lessons: [chapter('cib-07', 'Seguridad en la nube y en dispositivos', M7)] },
  { title: 'Módulo 8 · Procesos de negocio y continuidad', order_num: 8, lessons: [chapter('cib-08', 'Gestión de procesos de negocio y continuidad', M8)] },
  { title: 'Módulo 9 · Normas y buenas prácticas', order_num: 9, lessons: [chapter('cib-09', 'Normas y buenas prácticas', M9)] },
  { title: 'Módulo 10 · Gestión de la ciberseguridad', order_num: 10, lessons: [chapter('cib-10', 'Gestión de la ciberseguridad', M10)] },
  { title: 'Módulo 11 · Respuesta a incidentes', order_num: 11, lessons: [chapter('cib-11', 'Respuesta a incidentes y forense básica', M11)] },
  { title: 'Módulo 12 · Ciberseguridad responsable', order_num: 12, lessons: [chapter('cib-12', 'Ciberseguridad responsable y carrera', M12)] },
  {
    title: 'Examen Final',
    order_num: 13,
    lessons: [{ slug: 'cib-examen-final', title: 'Examen Final de Ciberseguridad', type: 'exam', content_md: EXAM, order_num: 1 }],
  },
];

const statements: string[] = [];
statements.push(`DELETE FROM courses WHERE slug = '${SLUG}';`);
statements.push(
  `INSERT INTO courses (slug, title, description) VALUES (${sqlStr(SLUG)}, 'Ciberseguridad Básica', 'Programa completo: amenazas, gestión de riesgos, procesos de negocio, normas (ISO 27001/NIST), gestión de la ciberseguridad y respuesta a incidentes.');`,
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
const out = resolve(process.cwd(), 'seed-ciberseguridad.sql');
writeFileSync(out, sql, 'utf8');
console.log('Generado:', out);
console.log('Módulos:', MODULES.length, '| Lecciones:', MODULES.reduce((a, m) => a + m.lessons.length, 0));
