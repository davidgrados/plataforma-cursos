// ============================================================
//  Ejemplos del mundo real · Linux Básico (16 capítulos)
//  IMPORTANTE: este archivo no usa acentos graves (backticks)
//  porque el contenido vive dentro de plantillas de TypeScript.
// ============================================================

export const EJEMPLOS_LINUX: Record<string, string> = {
  'linux-01-cap1': `

## 🌍 En el mundo real

### 📱 Caso 1 · Linux está en tu bolsillo
**Android está construido sobre el kernel de Linux**. Hay más de 2.500 millones de dispositivos Android activos, y a eso se suman las Smart TV, los routers de tu casa, los cajeros automáticos y cerca del **96% de los servidores** de los sitios más grandes de internet (Google, Amazon, Netflix).

**Qué enseña:** aunque Linux casi no aparezca en las noticias, es el sistema que sostiene internet y tu celular.

### ✅ En tu día a día
- Identifica 3 aparatos de tu casa que probablemente usan Linux: el router, el Smart TV, tu celular.
- Distingue **kernel** (el núcleo del sistema) de **distribución** (Ubuntu, Debian, Fedora…).
- Recuerda la idea clave: en Linux casi todo se hace escribiendo comandos, y eso es lo que te da poder.`,

  'linux-02-cap2': `

## 🌍 En el mundo real

### 📡 Caso 1 · La antena que obligó a liberar el código (Linksys WRT54G, 2003)
Un router doméstico usaba Linux y, según la licencia **GPL**, su firmware debía publicarse junto con el código fuente. La empresa tardó en cumplirlo y la comunidad lo reclamó hasta conseguirlo. De ese código nació **OpenWrt**, usado hoy en miles de routers y proyectos.

**Qué enseña:** las licencias de software libre tienen fuerza legal. Usar código abierto sin respetar sus condiciones sí trae consecuencias.

### ✅ En tu día a día
- Revisa la licencia antes de copiar código: GPL, MIT, Apache y BSD tienen reglas distintas.
- Si usas software libre en tu negocio, averigua qué obligaciones asumes al modificarlo o redistribuirlo.
- Cita siempre la autoría: es ética profesional (igual que citar fuentes en un trabajo escolar).`,

  'linux-03-cap3': `

## 🌍 En el mundo real

### 🏫 Caso 1 · Computadoras viejas que vuelven a la vida
Muchos colegios, bibliotecas y telecentros rescatan equipos antiguos instalando una distribución ligera de Linux. Lo que con Windows ya parece inservible, con Linux sigue sirviendo para estudiar, escribir y navegar.

**Qué enseña:** Linux da segundas oportunidades al hardware y reduce la brecha digital. Es una razón muy concreta para aprenderlo.

### 🍓 Caso 2 · La Raspberry Pi en el aula
Con una placa de bajo costo y Linux, estudiantes han creado estaciones meteorológicas, cámaras de seguridad, robots y servidores escolares. Es el mismo sistema que usan las empresas grandes.

**Qué enseña:** puedes empezar con una PC modesta, y las habilidades que aprendes son exactamente las profesionales.

### ✅ En tu día a día
- Prueba Linux sin borrar nada usando una memoria USB de arranque (live USB).
- Elige una distribución para empezar: Ubuntu o Linux Mint son las más amigables.
- Practica primero en el laboratorio simulado del curso antes de tocar una computadora real.`,

  'linux-04-cap4': `

## 🌍 En el mundo real

### 💥 Caso 1 · El comando que borró la base de datos de producción (GitLab, 2017)
Un ingeniero ejecutó por error un borrado **en el servidor equivocado** y eliminó la base de datos en producción. La empresa lo contó en directo mientras recuperaba el servicio y descubrió que, de sus cinco mecanismos de respaldo, **varios no funcionaban**. Restauraron desde una copia de horas antes: hubo pérdida de datos.

**Qué fallo:** un comando destructivo sin verificación previa y copias que nadie probaba.
**Qué aprendemos:** la línea de comandos es poderosísima y **no pregunta** si estás seguro. Antes de un comando destructivo: confirma dónde estás, qué carpeta es y que el respaldo existe.

### ✅ En tu día a día
- Antes de borrar o mover: usa pwd para saber dónde estás y ls para ver qué hay.
- Cuidado especial con rm -rf: no tiene papelera ni confirmación.
- Prueba tus respaldos de verdad, no basta con crearlos.`,

  'linux-05-cap5': `

## 🌍 En el mundo real

### 🧑‍🚒 Caso 1 · Caída a las 3 de la mañana y sin internet
Un servidor deja de responder de madrugada y no hay tiempo ni conexión para buscar en Google. El administrador resuelve con la ayuda que **ya está instalada** en la máquina: el manual de systemctl, el de journalctl y sus opciones con --help.

**Qué enseña:** saber encontrar ayuda vale más que memorizar mil comandos. Ningún profesional los recuerda todos.

### ✅ En tu día a día
- Aprende estas herramientas: man comando, comando --help, apropos palabra y whatis comando.
- Dentro de man, usa la barra inclinada para buscar y la letra q para salir.
- Anota lo que resuelves: tu manual personal vale más que cualquier libro.`,

  'linux-06-cap6': `

## 🌍 En el mundo real

### 💾 Caso 1 · La web que se cayó por un disco lleno
Un sitio web deja de guardar pedidos y muestra errores. Nadie tocó el código: el **disco estaba al 100%** porque el archivo de registros creció durante meses sin control. El diagnóstico tomó un solo comando: df -h.

**Qué enseña:** los problemas reales casi nunca son misteriosos: se diagnostican mirando disco (df -h), memoria (free -m) y procesos (top).

### ✅ En tu día a día
- Practica la ruta básica: pwd, ls, cd, mkdir, cp, mv y rm (con cuidado).
- Comprueba siempre **dónde estás** antes de mover o borrar.
- Ordena tus carpetas con nombres claros y sin duplicados: el desorden también causa errores.`,

  'linux-07-cap7': `

## 🌍 En el mundo real

### 📦 Caso 1 · Enviar una carpeta de 40 GB por internet lento
Un fotógrafo debe entregar su trabajo y su conexión sube a 2 Mbps. Con tar y gzip reduce el paquete a una fracción de su tamaño y lo envía como **un solo archivo**, que llega íntegro y ordenado.

**Qué enseña:** empaquetar y comprimir es rutina profesional: respaldos, entregas y migraciones.

### ✅ En tu día a día
- Recuerda la pareja esencial: tar -czvf respaldo.tar.gz carpeta/ para crear y tar -xzvf respaldo.tar.gz para extraer.
- Nombra los respaldos con fecha: respaldo-2026-09-24.tar.gz. Te lo agradecerás después.
- Comprimir no es cifrar: si hay datos sensibles, añade cifrado.`,

  'linux-08-cap8': `

## 🌍 En el mundo real

### 🕵️ Caso 1 · Encontrar al intruso en un log de 2 millones de líneas
Un servidor sufre intentos de acceso. Leer el archivo a mano es impensable. Con tuberías y expresiones regulares el análisis toma segundos: contar los intentos fallidos y ver qué direcciones IP se repiten más.

Por ejemplo: filtrar con grep las líneas de acceso fallido, quedarse con la columna de la IP, ordenarlas, contarlas con uniq -c y mostrar el top con head.

**Qué enseña:** las tuberías y las regex convierten miles de líneas en una respuesta clara. Así trabajan los analistas de seguridad.

### ✅ En tu día a día
- Domina esta cadena: comando, tubería, grep, sort, uniq -c, sort -rn y head.
- Guarda salidas largas con el símbolo mayor que (archivo nuevo) y con doble mayor que (añadir).
- Empieza con patrones simples y ve afinando la expresión regular.`,

  'linux-09-cap9': `

## 🌍 En el mundo real

### ⏰ Caso 1 · El respaldo que se hace solo cada noche
Nadie quiere copiar carpetas a mano todos los días. Un script de diez líneas programado con cron a las 2:00 a. m. crea el respaldo, lo comprime, lo guarda con la fecha y avisa si algo falla.

**Qué enseña:** automatizar tareas repetitivas es la mejor inversión de tiempo de un administrador. Un buen script trabaja mientras duermes.

### ✅ En tu día a día
- Empieza con scripts pequeños: variables, condicionales, bucles y echo para informar.
- Pon siempre la línea inicial de intérprete (#!/bin/bash) y termina con exit 0.
- **Prueba el script con datos de prueba** antes de programarlo: un error puede borrar archivos solo.`,

  'linux-10-cap10': `

## 🌍 En el mundo real

### 🐌 Caso 1 · La computadora que se volvió lentísima (RAM y swap)
Un equipo tarda minutos en abrir cualquier programa. La causa: la memoria RAM se agotó y el sistema usa el disco como memoria (swap). El comando free -m lo muestra al instante y top revela qué programa consume los recursos.

**Qué enseña:** el hardware se diagnostica con datos, no con suposiciones. Tres comandos dan el panorama: free -m, df -h y top.

### ✅ En tu día a día
- Antes de comprar más memoria o cambiar de equipo, mide: usa top para ver quién consume.
- Cierra los programas que no uses: liberan memoria real y alargan la vida del equipo.
- Aprende a revisar los discos con lsblk y df -h.`,

  'linux-11-cap11': `

## 🌍 En el mundo real

### 🔄 Caso 1 · El servidor que llevaba un año sin actualizarse
Un servidor con servicios web llevaba más de un año sin aplicar actualizaciones de seguridad. Aparece un fallo crítico público y hay que actuar el mismo día: primero se actualiza el índice de paquetes, luego se aplican las actualizaciones y por último se reinician los servicios afectados.

También pasa con los procesos: una aplicación se cuelga, se identifica su identificador con top o ps y se reinicia su servicio sin apagar todo el servidor.

**Qué enseña:** mantener el sistema actualizado y saber manejar procesos y servicios es el trabajo diario de cualquier administrador.

### ✅ En tu día a día
- Aprende el ciclo: actualizar el índice (apt update), actualizar paquetes (apt upgrade) y reiniciar servicios (systemctl restart).
- Revisa qué está consumiendo recursos con top, ps aux y df -h.
- Aplica las actualizaciones de seguridad en cuanto salen: es la defensa más barata que existe.`,

  'linux-12-cap12': `

## 🌍 En el mundo real

### 🌐 Caso 1 · El clásico "no tengo internet"
Un servidor no responde a los usuarios. Los pasos del diagnóstico real son ordenados: comprobar si hay enlace con ping, revisar la dirección IP y las rutas con ip a y ip r, y verificar la resolución de nombres con dig o nslookup.

Muchas caídas resultan ser solo **DNS mal configurado**: el servidor tenía internet, pero no sabía traducir los nombres de dominio a direcciones IP.

**Qué enseña:** diagnosticar en orden (enlace, IP, ruta, DNS) ahorra horas de prueba y error.

### ✅ En tu día a día
- Memoriza el orden del diagnóstico: ¿hay enlace?, ¿tengo IP?, ¿tengo ruta?, ¿resuelve nombres?
- Aprende a asignar una dirección IP fija y un DNS confiable en un servidor.
- Documenta la configuración de red que funciona: te salvará la próxima vez.`,

  'linux-13-cap13': `

## 🌍 En el mundo real

### 🛡️ Caso 1 · El servidor con SSH abierto que recibe miles de intentos al día
En cuanto un servidor queda expuesto a internet con el puerto SSH abierto y contraseñas, empieza a recibir **ataques automáticos de fuerza bruta**: bots que prueban usuarios como root o admin con contraseñas comunes, miles de veces por hora.

Las defensas reales: desactivar el acceso directo de root, usar **claves SSH** en lugar de contraseñas, cambiar el puerto por defecto y limitar intentos con herramientas como fail2ban.

**Qué enseña:** la seguridad no es un extra: es parte de instalar y configurar cualquier servidor.

### ✅ En tu día a día
- Usa claves SSH en vez de contraseñas y nunca compartas la cuenta root.
- Revisa los registros de acceso (auth.log) para ver los intentos de entrada.
- Aplica el mínimo privilegio: cada servicio con su propio usuario, no como root.`,

  'linux-14-cap14': `

## 🌍 En el mundo real

### 👋 Caso 1 · Alta y baja de empleados (el error más común de las empresas)
Cuando entra un trabajador se le crea su cuenta con permisos justos. Cuando **sale**, muchas empresas olvidan desactivarla… y esa cuenta sigue activa durante meses. Es una de las puertas de entrada más frecuentes en incidentes reales.

**Qué enseña:** crear usuarios es fácil; lo profesional es gestionar su ciclo de vida completo: alta, cambios de puesto y baja inmediata.

### ✅ En tu día a día
- Aprende a crear un usuario con directorio personal, a asignarle un grupo y a fijar caducidad de contraseña.
- Documenta quién tiene acceso a qué y revisa la lista cada cierto tiempo.
- Buenas prácticas: cada persona con su propia cuenta y los privilegios administrativos solo cuando se necesiten (sudo).`,

  'linux-15-cap15': `

## 🌍 En el mundo real

### 🔓 Caso 1 · La carpeta de nóminas que podía leer toda la empresa
En un servidor compartido se dejó una carpeta con datos de personal con permisos demasiado abiertos: cualquier empleado podía entrar. No hubo ataque ni virus: fue **un permiso mal puesto**.

Los permisos se leen como una clave de tres dígitos: el dueño, el grupo y el resto. Solo el dueño debe poder leer y escribir un archivo sensible, y nadie más debería poder leerlo.

**Qué enseña:** en Linux, los permisos son la cerradura. Un descuido equivale a dejar la puerta abierta.

### ✅ En tu día a día
- Entiende la clave: 4 = leer, 2 = escribir, 1 = ejecutar; y se suman (6 = leer y escribir, 7 = todo).
- Nunca uses permisos abiertos para todo el mundo (el clásico 777) en servidores o datos sensibles.
- Revisa con ls -l quién puede acceder a tus carpetas importantes y corrige con chmod y chown.`,

  'linux-16-cap16': `

## 🌍 En el mundo real

### 🔗 Caso 1 · Enlaces que simplifican las actualizaciones
Una empresa publica su aplicación en carpetas con versión (por ejemplo una para la 1.2 y otra para la 1.3) y mantiene un **enlace simbólico** llamado "actual" que apunta a la versión vigente. Para actualizar, solo cambia el enlace: si algo falla, lo devuelve a la versión anterior en un segundo.

**Qué enseña:** los enlaces simbólicos y los permisos especiales (setuid, sticky bit) resuelven problemas reales de administración.

### 💽 Caso 2 · Montar un disco nuevo sin perder datos
Un servidor se queda sin espacio; se añade un disco, se formatea con el sistema de archivos adecuado y se monta en la carpeta donde hacen falta los datos. Ese procedimiento, en Linux, se hace escribiendo comandos.

**Qué enseña:** entender discos, particiones y puntos de montaje es parte del oficio.

### ✅ En tu día a día
- Practica crear enlaces simbólicos (ln -s) para no duplicar archivos o carpetas.
- Aprende a ver discos y montajes: lsblk, df -h y el archivo /etc/fstab.
- Antes de formatear o montar algo, comprueba **dos veces** qué disco estás eligiendo.`,
};
