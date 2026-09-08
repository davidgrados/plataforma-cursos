// ============================================================
//  Datos semilla del curso "Linux Básico".
//
//  Estructura: 16 módulos (capítulos) + prácticas en módulos 4-16
//  + un único Examen Final Integral (lección tipo 'exam').
//  No se crean exámenes por módulo ni examen parcial.
// ============================================================

import { baseFilesystem } from '../lib/fs-utils';

export const LINUX_COURSE = {
  slug: 'linux-basico',
  title: 'Linux Básico',
  description:
    'Domina los fundamentos de Linux: línea de comandos, archivos, permisos, red y seguridad, con un laboratorio interactivo de terminal en tu navegador.',
  image_url: null as string | null,
};

export interface SeedLesson {
  slug: string;
  title: string;
  type: 'chapter' | 'practice' | 'exam';
  content_md: string;
  initial_fs: string;
  check_logic: string | null;
  order_num: number;
}

export interface SeedModule {
  title: string;
  order_num: number;
  lessons: SeedLesson[];
}

const BASE_FS = JSON.stringify(baseFilesystem());

// Helper para prácticas: directorio de trabajo home del estudiante.
const home = '/home/student';

// ============================================================
//  CONTENIDO DE CAPÍTULOS
// ============================================================

const CAP_1 = `# Capítulo 1 · Introducción a Linux

Linux es un **sistema operativo de código abierto** creado por *Linus Torvalds* en 1991. Hoy impulsa servidores, supercomputadoras, móviles (Android) y millones de dispositivos embebidos.

## ¿Qué es el kernel?

El *kernel* es el núcleo del sistema: gestiona el hardware (CPU, memoria, discos) y ofrece servicios al resto de programas. Técnicamente, "Linux" es solo el kernel; el sistema completo se llama **GNU/Linux**.

## Distribuciones

Una *distribución* (o distro) empaqueta el kernel con herramientas, bibliotecas y un gestor de paquetes. Ejemplos:

- Debian / Ubuntu
- Red Hat / Fedora / CentOS
- Arch Linux
- openSUSE

## ¿Por qué aprender Linux?

- Es el estándar en servidores y en la nube.
- Es gratuito y de código abierto.
- Su terminal es potente y permite automatizar tareas.

En este curso usarás un **terminal simulado** para practicar sin riesgo.

**En resumen:** Linux = kernel. GNU/Linux = sistema operativo completo. Distribución = paquete listo para instalar.`;

const CAP_2 = `# Capítulo 2 · Aplicaciones de código abierto y Licencias

El **código abierto** permite leer, modificar y redistribuir el software. Es la base del ecosistema Linux.

## Software libre vs. código abierto

- **Software libre** (Free Software Foundation): enfatiza las *libertades* del usuario (usar, estudiar, modificar, compartir).
- **Código abierto** (Open Source Initiative): enfatiza los beneficios prácticos del desarrollo colaborativo.

## Licencias comunes

- **GPL**: obliga a que las obras derivadas se distribuyan con la misma licencia (copyleft).
- **MIT / BSD / Apache**: permisivas; permiten integrar el código incluso en software privativo.
- **Creative Commons**: orientada a contenidos, no a código.

## ¿Por qué importa?

Elegir una licencia define cómo otros pueden usar tu trabajo y qué obligaciones tienen. Al usar una biblioteca, debes cumplir su licencia (por ejemplo, publicar el código fuente si usas GPL).

**Clave:** software libre ≠ gratuito; se trata de **libertad**, no de precio.`;

const CAP_3 = `# Capítulo 3 · El uso de Linux

Linux puede usarse de dos maneras principales: con **interfaz gráfica** o con **línea de comandos**.

## Entornos de escritorio

- **GNOME** y **KDE Plasma**: los más populares.
- **XFCE**, **LXQt**: ligeros, ideales para equipos antiguos.

## La terminal

La terminal ejecuta un *shell* (intérprete de comandos). El más común es **bash**. En este curso practicarás con un simulador de bash.

## Usuarios

Linux es multiusuario. Existen:

- **root**: superusuario con permisos totales (peligroso usarlo siempre).
- **Usuarios normales**: con permisos limitados; usan **sudo** para tareas administrativas.

## Sesión y prompt

Al abrir una terminal verás algo como:

    student@linux:~$

- **student** = usuario
- **linux** = nombre del equipo
- **~** = estás en tu directorio personal
- **$** = usuario normal (root usaría **#**)

**Consejo:** trabaja siempre como usuario normal y usa *sudo* solo cuando sea necesario.`;

const CAP_4 = `# Capítulo 4 · Competencias de Línea de Comandos

La línea de comandos se compone de: **comando**, **opciones** y **argumentos**.

    comando -opción argumento

## Comandos básicos de navegación

- **pwd** → muestra la ruta actual (*print working directory*).
- **ls** → lista el contenido del directorio.
- **cd** → cambia de directorio.

Ejemplos:

    pwd
    ls
    cd documentos

## Rutas absolutas y relativas

- **Absoluta**: parte de la raíz, ej. /home/student/documentos
- **Relativa**: parte del directorio actual, ej. ./documentos o ..

Símbolos útiles:

- **.** → directorio actual
- **..** → directorio padre
- **~** → tu directorio personal

## Práctica

Ve a la pestaña del laboratorio y usa **mkdir** para crear un directorio.`;

const CAP_5 = `# Capítulo 5 · Encontrar Ayuda

Nadie memoriza todos los comandos: Linux trae la documentación incorporada.

## Fuentes de ayuda

- **man comando** → manual de referencia (ej. man ls).
- **comando --help** → resumen rápido de opciones.
- **info** → documentación más detallada (estilo hipertexto).
- **apropos palabra** → busca comandos relacionados con una palabra.

## Cómo leer una página man

    man ls

Se navega con las flechas, **q** para salir y **/texto** para buscar. Las secciones de man están numeradas (1 = comandos de usuario, 5 = formatos de archivo, 8 = administración).

## Buenas prácticas

- Antes de preguntar, consulta el manual.
- Usa --help para recordar opciones rápidas.
- Combina man + apropos para descubrir herramientas.

**En el simulador** practicaremos creando archivos de referencia; los comandos man/help reales están fuera del alcance del terminal simulado.`;

const CAP_6 = `# Capítulo 6 · Gestión de los Archivos y Directorios

## Crear y borrar

- **mkdir nombre** → crea un directorio.
- **touch archivo** → crea un archivo vacío (o actualiza su fecha).
- **rm archivo** → elimina un archivo.
- **rm -r directorio** → elimina un directorio y todo su contenido.

## Ver contenido

- **cat archivo** → muestra el contenido.
- **grep patrón archivo** → busca líneas que contienen un patrón.

## Estructura de directorios típica

El estándar FHS organiza el sistema:

- **/home** → directorios de usuarios.
- **/etc** → configuración.
- **/var** → datos variables (logs).
- **/tmp** → archivos temporales.

## Rutas con espacios

Si un nombre tiene espacios, escríbelo entre comillas:

    touch "mi archivo.txt"

**Práctica:** crea la estructura de directorios indicada en el laboratorio.`;

const CAP_7 = `# Capítulo 7 · Empacamiento y Compresión

## ¿Por qué empaquetar?

Para distribuir muchos archivos como uno solo y reducir su tamaño.

## Herramientas habituales

- **tar** → empaqueta (no comprime por sí solo).
- **gzip / gunzip** → comprime archivos (.gz).
- **tar -czf** → empaqueta y comprime en un .tar.gz.
- **zip / unzip** → formato de compresión común.

## Ejemplos reales

    tar -cf backup.tar documentos/
    tar -czf backup.tar.gz documentos/
    tar -xzf backup.tar.gz

## Concepto clave

Empaquetar (**tar**) agrupa; comprimir (**gzip**) reduce. Juntos forman el clásico **.tar.gz**.

**En el simulador** practicamos el concepto creando un directorio de respaldo y un archivo que representa los "datos empaquetados".`;

const CAP_8 = `# Capítulo 8 · Barras Verticales, Redirección y Regex

## Redirección

- **>** → redirige la salida a un archivo (sobrescribe).
- **>>** → añade al final del archivo.
- **<** → redirige la entrada desde un archivo.

Ejemplo:

    echo "hola mundo" > saludo.txt

## Tuberías (pipes)

El símbolo **|** conecta la salida de un comando con la entrada de otro:

    ls | grep txt

## Expresiones regulares (regex)

Patrones para buscar texto. Ejemplos básicos:

- **^inicio** → empieza con "inicio"
- **fin$** → termina con "fin"
- **a.** → "a" seguida de cualquier carácter
- **[0-9]** → un dígito

**grep** usa regex para filtrar líneas.

**Práctica:** usa redirección y grep en el laboratorio.`;

const CAP_9 = `# Capítulo 9 · El Scripting Básico

Un *script* es un archivo de texto con comandos que se ejecutan en secuencia.

## Primer script

Crea un archivo **script.sh**:

    #!/bin/bash
    echo "Hola, Linux"

La primera línea (*shebang*) indica qué intérprete usar.

## Variables

    nombre="Ana"
    echo "Hola $nombre"

## Condicionales y bucles

    if [ -f archivo ]; then
      echo "existe"
    fi

    for i in 1 2 3; do
      echo $i
    done

## Ejecutar un script

    bash script.sh
    # o dándole permiso de ejecución:
    chmod +x script.sh
    ./script.sh

**Práctica:** crea tu primer script en el laboratorio.`;

const CAP_10 = `# Capítulo 10 · Comprensión del hardware de la computadora

Linux expone el hardware a través de archivos y comandos.

## Componentes principales

- **CPU**: procesa instrucciones.
- **RAM**: memoria de trabajo.
- **Disco**: almacenamiento permanente.
- **Red**: tarjetas e interfaces.

## Comandos para inspeccionar hardware

- **lscpu** → información de la CPU.
- **free -h** → uso de memoria RAM.
- **df -h** → espacio en disco.
- **lsblk** → discos y particiones.

## Archivos de información

El kernel expone datos en archivos virtuales:

- **/proc/cpuinfo** → detalles de la CPU.
- **/proc/meminfo** → información de memoria.
- **/sys/** → dispositivos y controladores.

**Idea clave:** "en Linux, todo es un archivo", incluso el hardware.

**Práctica:** crea un archivo resumiendo los componentes que has aprendido.`;

const CAP_11 = `# Capítulo 11 · Gestión de paquetes y procesos

## Paquetes

Un *paquete* es software empaquetado listo para instalar. El gestor de paquetes lo descarga e instala resolviendo dependencias.

- **Debian/Ubuntu**: apt, dpkg (.deb)
- **Red Hat/Fedora**: dnf, rpm (.rpm)

Ejemplos con apt:

    apt update
    apt install vim
    apt remove vim

## Procesos

Un *proceso* es un programa en ejecución.

- **ps** → lista procesos.
- **top / htop** → monitor en tiempo real.
- **kill PID** → termina un proceso.

## systemd

Gestiona servicios y el arranque:

    systemctl status ssh
    systemctl start servicio
    systemctl enable servicio

**Práctica:** registra los comandos clave en un archivo.`;

const CAP_12 = `# Capítulo 12 · Configuración de la red

## Conceptos

- **IP**: identifica un equipo en la red (ej. 192.168.1.10).
- **DNS**: traduce nombres (google.com) a IPs.
- **Puerta de enlace**: ruta hacia otras redes.
- **Interfaz**: cada conexión de red (eth0, wlan0).

## Comandos útiles

- **ip addr** → muestra direcciones IP.
- **ip route** → tabla de rutas.
- **ping host** → comprueba conectividad.
- **ssh usuario@host** → conexión remota segura.

## Archivos de configuración

- **/etc/hosts** → resolución local de nombres.
- **/etc/resolv.conf** → servidores DNS.

## SSH

Permite administrar servidores remotos de forma segura:

    ssh usuario@servidor

**Práctica:** crea un archivo con una configuración de red simulada.`;

const CAP_13 = `# Capítulo 13 · Seguridad del sistema y del usuario

## Principios básicos

- Usa **contraseñas fuertes** y distintas.
- Trabaja como usuario normal; usa **sudo** solo cuando sea necesario.
- Mantén el sistema **actualizado**.

## Actualizaciones

    sudo apt update
    sudo apt upgrade

## Permisos mínimos

Otorga a cada usuario solo los permisos que necesita (principio de *mínimo privilegio*).

## Firewall

Un cortafuegos filtra el tráfico. Herramientas comunes: **ufw**, **iptables**, **nftables**.

    sudo ufw enable
    sudo ufw allow 22/tcp

## Buenas prácticas

- Revisa los logs (/var/log).
- Cierra servicios que no uses.
- Haz copias de seguridad.

**Práctica:** registra las buenas prácticas que has aprendido.`;

const CAP_14 = `# Capítulo 14 · Crear un nuevo usuario

## Crear usuarios

- **useradd** → crea un usuario (bajo nivel).
- **adduser** → crea un usuario de forma interactiva.
- **passwd usuario** → establece su contraseña.

Ejemplo (Debian/Ubuntu):

    sudo adduser carlos
    sudo passwd carlos

## Archivos de usuarios

- **/etc/passwd** → lista de usuarios.
- **/etc/shadow** → contraseñas cifradas.
- **/etc/group** → grupos.

## Grupos

Los grupos organizan permisos. Añadir un usuario a un grupo:

    sudo usermod -aG sudo carlos

## Eliminar usuarios

    sudo userdel carlos

**Práctica:** simula la creación de un nuevo usuario en el laboratorio.`;

const CAP_15 = `# Capítulo 15 · Propiedad y permisos

Cada archivo tiene un **propietario**, un **grupo** y unos **permisos**.

## Ver permisos

    ls -l archivo

Salida típica: -rw-r--r-- 1 student student 0 ene 1 00:00 archivo

## Los tres bloques de permisos

Los permisos se dividen en tres grupos de tres: **dueño**, **grupo**, **otros**.

- **r** (read) = leer
- **w** (write) = escribir
- **x** (execute) = ejecutar

## chmod

Cambia permisos. Notación simbólica:

    chmod u+x script.sh   # ejecutar para el dueño
    chmod g-w archivo     # quitar escritura al grupo

Notación octal:

    chmod 755 archivo     # rwxr-xr-x
    chmod 644 archivo     # rw-r--r--

**Regla:** r=4, w=2, x=1; se suman por bloque.

## chown

Cambia propietario y grupo:

    chown usuario:grupo archivo

**Práctica:** registra el comando chmod y su significado.`;

const CAP_16 = `# Capítulo 16 · Permisos especiales, vínculos y ubicaciones

## Permisos especiales

- **SUID** (s): ejecuta con permisos del dueño.
- **SGID** (s): ejecuta con permisos del grupo.
- **Sticky bit** (t): en /tmp, impide borrar archivos ajenos.

Se ven al inicio de los permisos, ej. -rwsr-xr-x.

## Vínculos (links)

- **Hard link**: otro nombre para el mismo archivo (mismo inodo).

    ln archivo enlace

- **Symbolic link (symlink)**: un acceso directo a una ruta.

    ln -s destino enlace

## Ubicaciones estándar (FHS)

- **/bin, /sbin** → binarios esenciales.
- **/usr** → programas de usuario.
- **/var** → datos variables.
- **/etc** → configuración.
- **/opt** → software opcional.
- **/mnt, /media** → puntos de montaje.

**Práctica:** registra los conceptos de vínculos y permisos especiales.`;

// ============================================================
//  PRÁCTICAS (módulos 4 a 16)
// ============================================================

// check_logic es un DSL declarativo en JSON (Cloudflare Workers no permite
// eval/new Function, así que la validación NO es código JS arbitrario).
type CheckKind = 'exists' | 'isDir' | 'isFile' | 'contains' | 'equals';
const check = (
  ...rules: { kind: CheckKind; path: string; value?: string; message: string }[]
): string => JSON.stringify({ checks: rules });

const prac = (n: number, slug: string, title: string, task: string, hint: string, check: string): SeedLesson => ({
  slug,
  title,
  type: 'practice',
  content_md: `# ${title}

${task}

## Instrucciones

${hint}

> 💡 Usa el terminal simulado. Cuando termines, pulsa **Verificar ejercicio** para validar tu trabajo.
`,
  initial_fs: BASE_FS,
  check_logic: check,
  order_num: 2,
});

const P04 = prac(
  4,
  'linux-04-practica',
  'Práctica 04 · Línea de comandos',
  'Crea un directorio llamado **practicas** dentro de tu directorio personal (/home/student).',
  'Ejecuta el comando **mkdir practicas** y verifica con **ls**.',
  check({ kind: 'isDir', path: '/home/student/practicas', message: 'No encuentro el directorio /home/student/practicas. Créalo con: mkdir practicas' }),
);

const P05 = prac(
  5,
  'linux-05-practica',
  'Práctica 05 · Encontrar ayuda',
  'Crea un archivo **ayuda.txt** en tu home cuyo contenido incluya el texto `--help`.',
  'Usa redirección: **echo "man --help" > ayuda.txt** y comprueba con **cat ayuda.txt**.',
  check({ kind: 'contains', path: '/home/student/ayuda.txt', value: '--help', message: 'Crea ayuda.txt con el texto "man --help" usando: echo "man --help" > ayuda.txt' }),
);

const P06 = prac(
  6,
  'linux-06-practica',
  'Práctica 06 · Gestión de archivos y directorios',
  'Crea el directorio **informes** y, dentro de él, un archivo **enero.txt**.',
  'Usa **mkdir informes**, luego **cd informes** y **touch enero.txt** (o **echo "texto" > enero.txt**).',
  check({ kind: 'isFile', path: '/home/student/informes/enero.txt', message: 'Debes crear el archivo /home/student/informes/enero.txt' }),
);

const P07 = prac(
  7,
  'linux-07-practica',
  'Práctica 07 · Empacamiento y compresión',
  'Crea un directorio **backup** y dentro un archivo **respaldo.txt** con el texto `datos comprimidos`.',
  'Usa **mkdir backup** y luego **echo "datos comprimidos" > backup/respaldo.txt**.',
  check({ kind: 'contains', path: '/home/student/backup/respaldo.txt', value: 'datos', message: 'Crea backup/respaldo.txt con el texto "datos comprimidos".' }),
);

const P08 = prac(
  8,
  'linux-08-practica',
  'Práctica 08 · Redirección y regex',
  '1) Crea **salida.txt** con el texto `hola mundo`. 2) Crea **frutas.txt** con tres frutas, una por línea.',
  'Usa **echo "hola mundo" > salida.txt** y **echo -e "manzana\\npera\\nuva" > frutas.txt** (o escribe cada línea con >>).',
  check(
    { kind: 'contains', path: '/home/student/salida.txt', value: 'hola', message: 'Crea salida.txt con el texto "hola mundo".' },
    { kind: 'isFile', path: '/home/student/frutas.txt', message: 'Crea el archivo frutas.txt.' },
  ),
);

const P09 = prac(
  9,
  'linux-09-practica',
  'Práctica 09 · Scripting básico',
  'Crea el archivo **script.sh** cuya primera línea sea `#!/bin/bash`.',
  'Ejecuta **echo "#!/bin/bash" > script.sh** (sin las comillas externas) y comprueba con **cat script.sh**.',
  check({ kind: 'contains', path: '/home/student/script.sh', value: '#!/bin/bash', message: 'Crea script.sh con la primera línea #!/bin/bash' }),
);

const P10 = prac(
  10,
  'linux-10-practica',
  'Práctica 10 · Hardware',
  'Crea **hardware.txt** que contenga las palabras `CPU`, `RAM` y `Disco`.',
  'Usa **echo "CPU RAM Disco" > hardware.txt** y verifica con **cat hardware.txt**.',
  check(
    { kind: 'contains', path: '/home/student/hardware.txt', value: 'CPU', message: 'Crea hardware.txt con las palabras CPU, RAM y Disco.' },
    { kind: 'contains', path: '/home/student/hardware.txt', value: 'RAM', message: 'hardware.txt debe contener la palabra RAM.' },
  ),
);

const P11 = prac(
  11,
  'linux-11-practica',
  'Práctica 11 · Paquetes y procesos',
  'Crea **paquetes.txt** que contenga los comandos `apt` y `dpkg`.',
  'Usa **echo "apt dpkg" > paquetes.txt** y comprueba con **cat paquetes.txt**.',
  check({ kind: 'contains', path: '/home/student/paquetes.txt', value: 'apt', message: 'Crea paquetes.txt con apt y dpkg.' }),
);

const P12 = prac(
  12,
  'linux-12-practica',
  'Práctica 12 · Configuración de la red',
  'Crea **red.txt** con una dirección IP simulada: `192.168.1.10`.',
  'Usa **echo "192.168.1.10" > red.txt** y verifica con **cat red.txt**.',
  check({ kind: 'contains', path: '/home/student/red.txt', value: '192.168.1.10', message: 'Crea red.txt con la IP 192.168.1.10.' }),
);

const P13 = prac(
  13,
  'linux-13-practica',
  'Práctica 13 · Seguridad del sistema y del usuario',
  'Crea **seguridad.txt** con las palabras `sudo` y `actualizar`.',
  'Usa **echo "sudo actualizar" > seguridad.txt** y comprueba con **cat seguridad.txt**.',
  check({ kind: 'contains', path: '/home/student/seguridad.txt', value: 'sudo', message: 'Crea seguridad.txt con sudo y actualizar.' }),
);

const P14 = prac(
  14,
  'linux-14-practica',
  'Práctica 14 · Crear un nuevo usuario',
  'Crea el directorio **nuevo_usuario** y dentro un archivo **perfil.txt** con el texto `nombre: alumno`.',
  'Usa **mkdir nuevo_usuario** y **echo "nombre: alumno" > nuevo_usuario/perfil.txt**.',
  check({ kind: 'contains', path: '/home/student/nuevo_usuario/perfil.txt', value: 'alumno', message: 'Crea nuevo_usuario/perfil.txt con "nombre: alumno".' }),
);

const P15 = prac(
  15,
  'linux-15-practica',
  'Práctica 15 · Propiedad y permisos',
  'Crea **permisos.txt** que contenga el comando `chmod 755`.',
  'Usa **echo "chmod 755" > permisos.txt** y verifica con **cat permisos.txt**.',
  check({ kind: 'contains', path: '/home/student/permisos.txt', value: 'chmod', message: 'Crea permisos.txt con chmod 755.' }),
);

const P16 = prac(
  16,
  'linux-16-practica',
  'Práctica 16 · Vínculos y ubicaciones',
  'Crea **enlaces.txt** que contenga el comando `ln -s`.',
  'Usa **echo "ln -s" > enlaces.txt** y verifica con **cat enlaces.txt**.',
  check({ kind: 'contains', path: '/home/student/enlaces.txt', value: 'ln -s', message: 'Crea enlaces.txt con el comando ln -s.' }),
);

// ============================================================
//  EXAMEN FINAL INTEGRAL
// ============================================================

const EXAMEN_FINAL: SeedLesson = {
  slug: 'linux-examen-final',
  title: 'Examen Final Integral (Módulos 1-16)',
  type: 'exam',
  content_md: `# Examen Final Integral · Linux Básico

Este examen cubre los 16 módulos del curso. Responde cada pregunta y comprueba tus respuestas con la clave al final.

1. ¿Quién creó el kernel Linux y en qué año?
2. ¿Qué diferencia hay entre *kernel* y *distribución*?
3. ¿Qué significa que una licencia sea "copyleft"? Nombra una licencia copyleft.
4. ¿Qué comando muestra la ruta actual de trabajo?
5. ¿Qué diferencia hay entre una ruta absoluta y una relativa?
6. ¿Qué comando elimina un directorio y todo su contenido?
7. ¿Para qué sirve el comando tar y en qué se diferencia de gzip?
8. ¿Qué símbolo redirige la salida de un comando a un archivo (sobrescribiendo)?
9. ¿Qué es una *shebang* y dónde se coloca?
10. ¿Qué comando muestra el espacio libre en disco?
11. ¿Qué hace el comando apt install?
12. ¿Qué protocolo se usa para conectarse de forma segura a un servidor remoto?
13. ¿Por qué se recomienda usar sudo en lugar de trabajar como root?
14. ¿Qué comando cambia la contraseña de un usuario?
15. ¿Qué significan los permisos r, w y x?
16. ¿Qué comando crea un enlace simbólico?

---

## Clave de respuestas

1. Linus Torvalds, 1991.
2. El kernel es el núcleo; la distribución empaqueta kernel + herramientas + gestor de paquetes.
3. Obliga a redistribuir derivados con la misma licencia; por ejemplo, GPL.
4. pwd.
5. La absoluta parte de la raíz (/); la relativa parte del directorio actual.
6. rm -r directorio.
7. tar empaqueta archivos; gzip comprime. Juntos forman .tar.gz.
8. El símbolo >.
9. La primera línea (#!) que indica el intérprete del script.
10. df -h.
11. Instala un paquete de software.
12. SSH.
13. Porque root tiene permisos totales y es fácil dañar el sistema.
14. passwd usuario.
15. r = leer, w = escribir, x = ejecutar.
16. ln -s destino enlace.
`,
  initial_fs: BASE_FS,
  check_logic: null,
  order_num: 1,
};

// ============================================================
//  ESTRUCTURA COMPLETA
// ============================================================

export const LINUX_MODULES: SeedModule[] = [
  {
    title: 'Módulo 1 · Introducción a Linux',
    order_num: 1,
    lessons: [
      { slug: 'linux-01-cap1', title: 'Capítulo 1 · Introducción a Linux', type: 'chapter', content_md: CAP_1, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
    ],
  },
  {
    title: 'Módulo 2 · Aplicaciones de código abierto y Licencias',
    order_num: 2,
    lessons: [
      { slug: 'linux-02-cap2', title: 'Capítulo 2 · Aplicaciones de código abierto y Licencias', type: 'chapter', content_md: CAP_2, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
    ],
  },
  {
    title: 'Módulo 3 · El uso de Linux',
    order_num: 3,
    lessons: [
      { slug: 'linux-03-cap3', title: 'Capítulo 3 · El uso de Linux', type: 'chapter', content_md: CAP_3, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
    ],
  },
  {
    title: 'Módulo 4 · Competencias de Línea de Comandos',
    order_num: 4,
    lessons: [
      { slug: 'linux-04-cap4', title: 'Capítulo 4 · Competencias de Línea de Comandos', type: 'chapter', content_md: CAP_4, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P04,
    ],
  },
  {
    title: 'Módulo 5 · Encontrar Ayuda',
    order_num: 5,
    lessons: [
      { slug: 'linux-05-cap5', title: 'Capítulo 5 · Encontrar Ayuda', type: 'chapter', content_md: CAP_5, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P05,
    ],
  },
  {
    title: 'Módulo 6 · Gestión de los Archivos y Directorios',
    order_num: 6,
    lessons: [
      { slug: 'linux-06-cap6', title: 'Capítulo 6 · Gestión de los Archivos y Directorios', type: 'chapter', content_md: CAP_6, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P06,
    ],
  },
  {
    title: 'Módulo 7 · Empacamiento y Compresión',
    order_num: 7,
    lessons: [
      { slug: 'linux-07-cap7', title: 'Capítulo 7 · Empacamiento y Compresión', type: 'chapter', content_md: CAP_7, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P07,
    ],
  },
  {
    title: 'Módulo 8 · Barras Verticales, Redirección y Regex',
    order_num: 8,
    lessons: [
      { slug: 'linux-08-cap8', title: 'Capítulo 8 · Barras Verticales, Redirección y Regex', type: 'chapter', content_md: CAP_8, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P08,
    ],
  },
  {
    title: 'Módulo 9 · El Scripting Básico',
    order_num: 9,
    lessons: [
      { slug: 'linux-09-cap9', title: 'Capítulo 9 · El Scripting Básico', type: 'chapter', content_md: CAP_9, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P09,
    ],
  },
  {
    title: 'Módulo 10 · Comprensión del hardware de la computadora',
    order_num: 10,
    lessons: [
      { slug: 'linux-10-cap10', title: 'Capítulo 10 · Comprensión del hardware de la computadora', type: 'chapter', content_md: CAP_10, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P10,
    ],
  },
  {
    title: 'Módulo 11 · Gestión de paquetes y procesos',
    order_num: 11,
    lessons: [
      { slug: 'linux-11-cap11', title: 'Capítulo 11 · Gestión de paquetes y procesos', type: 'chapter', content_md: CAP_11, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P11,
    ],
  },
  {
    title: 'Módulo 12 · Configuración de la red',
    order_num: 12,
    lessons: [
      { slug: 'linux-12-cap12', title: 'Capítulo 12 · Configuración de la red', type: 'chapter', content_md: CAP_12, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P12,
    ],
  },
  {
    title: 'Módulo 13 · Seguridad del sistema y del usuario',
    order_num: 13,
    lessons: [
      { slug: 'linux-13-cap13', title: 'Capítulo 13 · Seguridad del sistema y del usuario', type: 'chapter', content_md: CAP_13, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P13,
    ],
  },
  {
    title: 'Módulo 14 · Crear un nuevo usuario',
    order_num: 14,
    lessons: [
      { slug: 'linux-14-cap14', title: 'Capítulo 14 · Crear un nuevo usuario', type: 'chapter', content_md: CAP_14, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P14,
    ],
  },
  {
    title: 'Módulo 15 · Propiedad y permisos',
    order_num: 15,
    lessons: [
      { slug: 'linux-15-cap15', title: 'Capítulo 15 · Propiedad y permisos', type: 'chapter', content_md: CAP_15, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P15,
    ],
  },
  {
    title: 'Módulo 16 · Permisos especiales, vínculos y ubicaciones',
    order_num: 16,
    lessons: [
      { slug: 'linux-16-cap16', title: 'Capítulo 16 · Permisos especiales, vínculos y ubicaciones', type: 'chapter', content_md: CAP_16, initial_fs: BASE_FS, check_logic: null, order_num: 1 },
      P16,
    ],
  },
  {
    title: 'Examen Final Integral',
    order_num: 17,
    lessons: [EXAMEN_FINAL],
  },
];
