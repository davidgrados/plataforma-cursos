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

> La ciberseguridad no es solo un producto: es un **proceso continuo** de toda la organización.


## 🌍 En el mundo real

### 🏬 Caso 1 · El aire acondicionado que abrió la caja fuerte (Target, 2013)
La cadena de tiendas Target sufrió el robo de unos **40 millones de tarjetas**. Los atacantes no entraron por la puerta principal: consiguieron las credenciales de un **proveedor externo de climatización** que tenía acceso a la red, y desde ahí llegaron a las cajas registradoras.

**Qué falló:** un tercero tenía más acceso del necesario y la red no estaba separada.
**Qué aprendemos:** protege también a tus proveedores, y separa las redes (la caja del supermercado no debe hablar con el sistema de aire acondicionado).

### 📵 Caso 2 · Cuando se cayó WhatsApp en todo el mundo (2021)
Durante unas **6 horas** no funcionaron WhatsApp, Instagram ni Facebook. No fue un ataque: una **mala configuración de red** dentro de la propia empresa dejó sus servidores fuera de internet. Miles de negocios que atienden por WhatsApp se quedaron sin poder responder ni cobrar.

**Qué falló:** la **disponibilidad** (la "D" de la tríada CIA) depende de la infraestructura y de tener alternativas.
**Qué aprendemos:** la seguridad no es solo "que no me roben", también es "que siga funcionando".

### ✅ En tu día a día
Piensa en tus propios activos: el celular, tus cuentas, tus fotos, el WhatsApp del negocio. Luego pregúntate: ¿cuál es la amenaza más probable y qué debilidad tengo hoy?`;

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

> La mayoría de incidentes aprovechan debilidades **conocidas y evitables**.


## 🌍 En el mundo real

### ⛽ Caso 1 · Una contraseña vieja paró el combustible (Colonial Pipeline, 2021)
Un oleoducto que abastecía de combustible a buena parte del sureste de Estados Unidos tuvo que **cerrar durante días**. La entrada fue una **cuenta de VPN antigua que seguía activa y cuya contraseña se había filtrado** en otra brecha.

**Qué falló:** una cuenta que ya no se usaba, con la misma contraseña de siempre.
**Qué aprendemos:** las cuentas viejas son puertas abiertas. Se revisan, se cierran y ninguna contraseña se reutiliza.

### 📷 Caso 2 · Cámaras que tumbaron medio internet (Mirai, 2016)
Un programa llamado Mirai infectó **cientos de miles de cámaras y routers** que venían con la contraseña de fábrica (admin/admin). Con ese ejército de dispositivos dejó sin servicio a Twitter, Netflix y Spotify durante horas.

**Qué falló:** dispositivos conectados con credenciales por defecto que nadie cambió.
**Qué aprendemos:** cambia la contraseña del router y de cualquier dispositivo antes de conectarlo. El atacante busca **lo más fácil**, no lo más grande.`;

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

> No puedes proteger lo que no conoces: **inventario y visibilidad** primero.


## 🌍 En el mundo real

### 📊 Caso 1 · El parche que existía y no se aplicó (Equifax, 2017)
La agencia de crédito Equifax sufrió el robo de datos de **147 millones de personas**. La puerta de entrada fue un fallo en un programa (Apache Struts) para el que **ya existía un parche publicado dos meses antes**. Nadie lo aplicó a tiempo.

**Qué falló:** la gestión de vulnerabilidades (saber qué tienes, qué falla y parchearlo).
**Qué aprendemos:** tener inventario y un plan de parcheo vale más que comprar otra herramienta.

### 🧩 Caso 2 · La librería que estaba en todas partes (Log4Shell, 2021)
Apareció un fallo crítico en Log4j, una librería usada por millones de aplicaciones. Las empresas que **sabían exactamente qué sistemas la usaban** reaccionaron en horas; las demás tardaron semanas buscando a ciegas.

**Qué falló / qué funcionó:** aquí se vio el valor del inventario y del análisis de amenazas.
**Qué aprendemos:** es lo mismo que hacen los equipos de seguridad cuando usan **SIEM**, **MITRE ATT&CK** y fuentes de inteligencia: identificar, priorizar y actuar.`;

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

> El factor humano es el objetivo favorito: **concienciar** es defender.


## 🌍 En el mundo real

### 🐦 Caso 1 · El hackeo de Twitter por teléfono (2020)
Atacantes **llamaron por teléfono a empleados de Twitter** haciéndose pasar por compañeros de soporte técnico. Convencieron a varios para que les dieran acceso a herramientas internas y tomaron **130 cuentas** (Obama, Biden, Musk…) para pedir bitcoins.

**Qué falló:** ingeniería social + demasiado poder para empleados sin verificación.
**Qué aprendemos:** verificar siempre la identidad por un canal oficial y aplicar el mínimo privilegio.

### 🏦 Caso 2 · El falso correo del jefe (fraude BEC)
Es uno de los fraudes más caros del mundo: un correo que parece de la gerencia pide una **transferencia urgente y confidencial** a una cuenta nueva. El FBI calcula pérdidas de **miles de millones de dólares** al año por esta estafa.

**Qué falló:** la prisa y la jerarquía se usan como armas.
**Qué aprendemos:** ninguna transferencia se hace solo por correo; se confirma por teléfono con un número conocido.

### 📱 Caso 3 · Los "falsos bancos" en el Perú
Patrón frecuente: te llaman o escriben diciendo que son de tu banco o de una billetera digital, te asustan con un "cargo desconocido" y te piden tu **clave, el código SMS o el código de Yape/Plin**.

**Qué falló:** alguien entregó el código por teléfono.
**Qué aprendemos:** tu banco **nunca** pide claves ni códigos. Ante la duda, cuelga y llama tú al número oficial.`;

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

> La identidad es el nuevo perímetro de seguridad.


## 🌍 En el mundo real

### 🔗 Caso 1 · Contraseñas robadas, años después (LinkedIn, 2012 y 2016)
Se filtraron contraseñas de LinkedIn (primero 6,5 millones y después **117 millones**). Años después, los atacantes las probaron en **otros servicios** (correo, redes, bancos) y entraron en las cuentas de quienes usaban la misma clave en todas partes.

**Qué falló:** reutilizar contraseñas.
**Qué aprendemos:** una contraseña distinta por servicio + un **gestor de contraseñas** + **MFA** lo evita por completo.

### 📲 Caso 2 · El robo de la línea telefónica (SIM swapping)
El atacante convence a la operadora de que es la víctima y **duplica su chip**. Con eso recibe los SMS y supera la verificación en dos pasos por mensaje. Es el método favorito para robar cuentas de correo y criptomonedas.

**Qué fallo:** depender solo del SMS.
**Qué aprendemos:** mejor una **app de autenticación** o una **passkey**; el SMS es el eslabón más débil del 2FA.`;

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

> Cifrado + buenas prácticas = red mucho más segura.


## 🌍 En el mundo real

### ☕ Caso 1 · El Wi-Fi del aeropuerto que no era del aeropuerto
Es un clásico: se crea una red llamada **"Aeropuerto_WiFi_Gratis"** junto a la verdadera. Todo lo que el usuario envía pasa por el equipo del atacante. Si el sitio usa **HTTPS**, el contenido va cifrado y no se puede leer.

**Qué falló:** confiar en una red abierta sin protección.
**Qué aprendemos:** en redes públicas, usa **VPN**, verifica la dirección (candado) y evita operaciones bancarias.

### 🛡️ Caso 2 · Entrar por el router de la sucursal (VPN sin parchear)
Varios grupos de ransomware (como los que atacaron a empresas en 2020-2021) entraron por **dispositivos de VPN con vulnerabilidades conocidas** en sucursales y oficinas remotas. CISA y los CERT emitieron alertas urgentes para parchearlos.

**Qué falló:** equipos de borde (VPN, firewall) sin actualizar.
**Qué aprendemos:** el firewall y la VPN son la puerta de la casa: se actualizan primero y se revisan sus accesos.`;

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

> En la nube, casi todos los incidentes vienen de **configuraciones y accesos** mal gestionados.


## 🌍 En el mundo real

### 🪣 Caso 1 · El depósito de datos abierto al mundo
Uno de los errores más repetidos: dejar un **almacenamiento en la nube con acceso público**. Ha ocurrido a bancos, aerolíneas, hospitales y gobiernos. Nadie "hackeó" nada: los datos simplemente estaban a la vista de cualquiera que supiera la dirección.

**Qué falló:** la configuración (y nadie que la revise).
**Qué aprendemos:** revisa la visibilidad de tus archivos y carpetas, y quita lo público que no deba serlo.

### 📱 Caso 2 · El celular perdido que lo cuenta todo
Un teléfono **sin bloqueo y sin cifrado** es una caja fuerte abierta: correo, banca, fotos, redes sociales y las claves guardadas en el navegador. Es una de las formas más comunes de robo de identidad.

**Qué falló:** no había PIN, ni cifrado, ni borrado remoto.
**Qué aprendemos:** activa bloqueo por huella o PIN, cifrado del disco y "Buscar mi dispositivo" desde el primer día.`;

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

> Un ataque no solo es un problema técnico: puede **parar el negocio**.


## 🌍 En el mundo real

### 🚢 Caso 1 · La naviera que se quedó sin sistemas (NotPetya, 2017)
El virus NotPetya entró por la actualización de un programa contable usado en Ucrania y se propagó por el mundo. Maersk, la mayor naviera del planeta, tuvo que **reinstalar miles de servidores y decenas de miles de computadoras**. El coste se estimó en cientos de millones de dólares.

**Qué falló:** no había un plan de recuperación que contemplara un ataque de esa velocidad.
**Qué aprendemos:** sin copias de seguridad aisladas y un plan de continuidad, el negocio se detiene.

### 🏥 Caso 2 · El hospital que volvió al papel
Cuando un hospital sufre ransomware, no puede ver historiales ni hacer análisis de laboratorio. Muchos activan protocolos **en papel** para seguir atendiendo: eso es exactamente un **BCP** (plan de continuidad de negocio) funcionando.

**Qué funcionó:** tener procedimientos alternativos probados.
**Qué aprendemos:** define tu **RTO** (cuánto puedes estar parado) y **RPO** (cuántos datos puedes perder) y **ensaya** el plan, no solo lo escribas.`;

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

> Las normas no son burocracia: son **experiencia acumulada** hecha método.


## 🌍 En el mundo real

### 📜 Caso 1 · Ganar licitaciones gracias a ISO 27001
Muchas empresas y entidades públicas piden a sus proveedores estar **certificados en ISO 27001**. Tener el sistema de gestión no es solo marketing: obliga a definir responsables, controles, revisiones y planes de mejora. Varias pymes consiguen contratos **solo porque pueden demostrarlo**.

**Qué enseña:** la norma es una ventaja comercial y ordena el esfuerzo de seguridad.

### 💶 Caso 2 · Multas por no proteger datos (RGPD en Europa)
Las autoridades europeas han impuesto sanciones de **cientos de millones de euros** por tratar datos personales sin base legal o sin medidas de seguridad (por ejemplo, la multa de 1.200 millones de euros a Meta en 2023). En el Perú, la ANPD también sanciona, y el registro del banco de datos es obligatorio.

**Qué enseña:** cumplir la ley de datos personales no es opcional; es parte de la seguridad.
**Qué aprendemos:** igual que la ISO, el **RGPD** o la **PCI DSS**, estas normas te dan un marco probado para no improvisar.`;

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

> La seguridad es un **programa**, no un parche.


## 🌍 En el mundo real

### 🛰️ Caso 1 · El ataque invisible durante meses (SolarWinds, 2020)
Un grupo de atacantes modificó el software de monitorización de una empresa y lo distribuyó a **unos 18.000 clientes**, incluidas agencias de gobierno. El intruso estuvo **meses dentro sin ser detectado** porque la visibilidad y la monitorización eran limitadas.

**Qué falló:** gobierno de la seguridad y detección (registros, alertas, revisión).
**Qué aprendemos:** sin visibilidad no hay control; por eso existen el **SOC**, el **SIEM** y los **KPI**.

### 🏪 Caso 2 · La pyme que ordenó su seguridad en un año
Una empresa pequeña nombró un **responsable de seguridad**, hizo un inventario de activos y un **análisis de riesgos**, y con eso decidió en qué gastar: primero las copias de seguridad y el MFA, después lo demás. En un año redujo sus incidentes sin comprar nada caro.

**Qué funcionó:** el ciclo **PHVA** (planificar, hacer, verificar, actuar) y priorizar por riesgo.
**Qué aprendemos:** la seguridad es un programa con responsables y métricas, no una compra puntual.`;

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

> Responder bien reduce el daño; aprender evita que vuelva a ocurrir.


## 🌍 En el mundo real

### ⏱️ Caso 1 · Aislar en 20 minutos (lo que salva a una empresa)
Una empresa con **plan de respuesta** y copias de seguridad **desconectadas** detectó el cifrado de archivos, aisló los equipos de la red y restauró todo el mismo día. Otra sin plan tardó dos semanas y pagó el rescate. La diferencia no fue la tecnología: fue el **plan**.

**Qué funcionó:** preparación, contención rápida y copias 3-2-1 con una copia **fuera de línea**.
**Qué aprendemos:** ensayar el plan vale más que tenerlo en un cajón.

### 💰 Caso 2 · Pagar no garantiza nada (Colonial Pipeline, 2021)
La empresa pagó unos **4,4 millones de dólares** en rescate; el FBI logró recuperar después buena parte del dinero. En muchos otros casos, pagar no devuelve los archivos y sí financia al delincuente (y a veces los datos se publican igual).

**Qué aprendemos:** la mejor respuesta es prevenir; y si ocurre: **no pagar**, conservar la evidencia y denunciar.`;

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

> La ciberseguridad es una carrera de **aprendizaje continuo y ética**.


## 🌍 En el mundo real

### 🏆 Caso 1 · Reportar en vez de aprovechar (bug bounty)
Muchos investigadores encuentran fallos en sistemas ajenos y los **reportan** a la empresa; a cambio reciben reconocimiento y, a veces, una recompensa económica (programas de *bug bounty*). Es un ingreso real y legal para quienes estudian seguridad.

**Qué enseña:** la misma habilidad puede ser un delito o una profesión; lo que cambia es la **autorización**.

### ⚖️ Caso 2 · Acceder "para probar" es delito
Cada año hay casos de jóvenes que entran en sistemas de su colegio, de una empresa o de una cuenta ajena "solo para ver si podían". El resultado es una **investigación penal**, aunque no hayan robado nada. Sin permiso por escrito, no se prueba nada.

**Qué aprendemos:** autorización escrita + alcance definido = hacking ético. Sin eso, es delito.

### 🧭 Caso 3 · La carrera por dentro
Los equipos de seguridad contratan perfiles como **analista SOC (blue team)**, **pentester (red team)**, **forense digital**, **gestor de riesgos** o **CISO**. Se entra con fundamentos sólidos (redes, sistemas, inglés), laboratorios legales y certificaciones como CompTIA Security+ o ISO 27001.

**Qué enseña:** hay demanda real de profesionales, y todos empezaron entendiendo lo básico.`;

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

// ------------------------------------------------------------
//  Actualización segura del contenido (sin borrar ni recrear).
//  Conserva los IDs de las lecciones y, por tanto, el progreso
//  y el laboratorio de los alumnos que ya están practicando.
// ------------------------------------------------------------
const updates = MODULES.flatMap((m) =>
  m.lessons.map(
    (l) => `UPDATE lessons SET content_md = ${sqlStr(l.content_md)} WHERE slug = ${sqlStr(l.slug)};`,
  ),
);
const sqlUpd =
  `-- Actualiza SOLO el contenido de las lecciones del curso "${SLUG}"\n` +
  '-- (no borra nada: conserva IDs, progreso y sesiones del laboratorio)\n' +
  updates.join('\n') +
  '\n';
const outUpd = resolve(process.cwd(), 'seed-ciberseguridad-update.sql');
writeFileSync(outUpd, sqlUpd, 'utf8');
console.log('Generado (actualización segura):', outUpd);
console.log('Lecciones a actualizar:', updates.length);
