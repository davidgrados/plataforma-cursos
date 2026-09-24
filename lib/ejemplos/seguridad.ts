// ============================================================
//  Ejemplos del mundo real · Seguridad Informática Básica
//  Contenido didáctico que se añade al final de cada capítulo.
// ============================================================

export const EJEMPLOS_SEGURIDAD: Record<string, string> = {
  'seg-01': `

## 🌍 En el mundo real

### 🏨 Caso 1 · El hotel que no sabía que estaba hackeado (Marriott, 2018)
Los atacantes estuvieron **dentro de los sistemas durante 4 años** sin ser detectados, y se llevaron datos de unos **383 millones de huéspedes** (pasaportes, correos, tarjetas). La empresa se enteró cuando la información ya estaba a la venta.

**Qué falló:** nadie revisaba los sistemas ni los accesos; la brecha se detectó tardísimo.
**Qué aprendemos:** la seguridad no es solo "poner barreras", también es **vigilar**: saber qué pasa en tus sistemas.

### 🔎 Caso 2 · ¿Tu correo ya se filtró? (Have I Been Pwned)
Existe un servicio público (haveibeenpwned.com) donde cualquiera puede comprobar si su correo apareció en alguna filtración conocida. Millones de personas descubren ahí que su clave circula por internet.

**Qué aprendemos:** asumir que alguna vez te van a filtrar datos, y actuar antes: contraseñas distintas y verificación en dos pasos.

### ✅ En tu día a día
- Haz un inventario simple de lo que proteges: cuentas, celular, laptop, fotos, datos del negocio.
- Comprueba tu correo en haveibeenpwned.com y cambia las contraseñas que aparezcan.
- Piensa como en la tríada CIA: ¿qué perderías si se **filtra** (confidencialidad), se **altera** (integridad) o **desaparece** (disponibilidad)?`,

  'seg-02': `

## 🌍 En el mundo real

### 🇨🇷 Caso 1 · El país que declaró emergencia por un ciberataque (Costa Rica, 2022)
Grupos de ransomware atacaron los sistemas del Ministerio de Hacienda y de varias instituciones del Estado. El gobierno tuvo que **declarar estado de emergencia nacional** y la recaudación de impuestos quedó afectada durante semanas.

**Qué falló:** sistemas críticos sin protección suficiente y sin plan de recuperación probado.
**Qué aprendemos:** un ciberataque puede paralizar un país, una empresa o tu negocio. La prevención no es un gasto, es un seguro.

### 🔌 Caso 2 · El virus que viajó en un USB (Stuxnet, 2010)
Stuxnet fue un programa malicioso que se propagó por **memorias USB** y dañó equipos industriales en una planta nuclear. Demostró que el eslabón más simple puede alcanzar el sistema más protegido.

**Qué aprendemos:** nunca conectes un USB que encuentres o que te regalen; el "regalo" puede ser la trampa (esto se llama *baiting*).

### ✅ En tu día a día
- Actualiza sistema y programas: la mayoría de ataques usan fallos que ya tienen parche.
- Desconfía de lo urgente, lo gratis y lo desconocido: son las tres carnadas favoritas.
- Revisa tus dispositivos: ¿qué apps tienen acceso a tus archivos, contactos o cámara?`,

  'seg-03': `

## 🌍 En el mundo real

### 🔗 Caso 1 · 117 millones de contraseñas reutilizadas (LinkedIn, 2012 y 2016)
Cuando se filtraron las contraseñas de LinkedIn, el daño no quedó ahí: los atacantes las probaron en **correos, bancos y redes sociales** de quienes usaban la misma clave en todas partes. A esto se le llama *credential stuffing*.

**Qué fallo:** una sola contraseña para todo.
**Qué aprendemos:** si sale una filtración, cambia esa contraseña **y** todas las que sean iguales.

### 🔑 Caso 2 · Las contraseñas más usadas del mundo
Cada año las listas de contraseñas filtradas se repiten: "123456", "contraseña", "qwerty", nombres de hijos y fechas de nacimiento. Un programa puede probarlas **millones de veces por segundo**.

**Qué aprendemos:** una buena contraseña es **larga** (una frase de 4 palabras), única y guardada en un gestor. La longitud vence a la complejidad.

### ✅ En tu día a día
- Instala un gestor de contraseñas y deja que genere claves largas y distintas para cada servicio.
- Activa la verificación en dos pasos en correo, banco y redes sociales.
- Nunca compartas claves ni códigos por teléfono, chat o correo: nadie legítimo los pide.`,

  'seg-04': `

## 🌍 En el mundo real

### 💥 Caso 1 · El ransomware que paralizó hospitales de medio mundo (WannaCry, 2017)
En un solo fin de semana afectó a **más de 200.000 equipos en 150 países**, incluido el sistema sanitario británico: se cancelaron operaciones y consultas. Se aprovechó un fallo de Windows para el que **ya existía un parche**.

**Qué falló:** sistemas sin actualizar.
**Qué aprendemos:** actualizar el sistema operativo es la defensa más barata contra el ransomware.

### 🛠️ Caso 2 · "Llame a soporte técnico de Microsoft" (estafa del falso antivirus)
Aparece una ventana que dice que tu equipo está infectado y te da un número de teléfono. Del otro lado, alguien te pide acceso remoto y te cobra por "limpiar" un virus que no existe (o instala uno real).

**Qué fallo:** el miedo y la prisa.
**Qué aprendemos:** los fabricantes **nunca** llaman ni muestran números de teléfono en una ventana del navegador. Cierra la pestaña y listo.

### ✅ En tu día a día
- Instala un antivirus (el que ya trae Windows o un gratuito confiable) y **deja que se actualice solo**.
- Desconfía de programas "crackeados" y de instaladores de sitios raros: son la principal vía de infección doméstica.
- Si el equipo va lento, aparecen ventanas raras o se abren solas, revisa antes de descargar cualquier "limpiador".`,

  'seg-05': `

## 🌍 En el mundo real

### ☕ Caso 1 · El Wi-Fi gratis del aeropuerto que era una trampa
Es un clásico: alguien crea una red llamada "Aeropuerto_WiFi_Gratis" muy cerca de la verdadera. Todo lo que pasa por ahí lo ve el atacante: correos, contraseñas y datos de tarjetas si el sitio no está cifrado.

**Qué fallo:** usar una red abierta sin protección.
**Qué aprendemos:** en redes públicas, mejor una **VPN**, y siempre comprobar que el sitio tenga el candado (HTTPS).

### 📡 Caso 2 · El router con la contraseña de fábrica
Miles de routers domésticos se quedan con "admin/admin". Los atacantes los escanean por internet y los usan para atacar a otros (fue lo que hizo el botnet Mirai en 2016 con cámaras y routers).

**Qué fallo:** nadie cambió la clave del router.
**Qué aprendemos:** cambia la contraseña del router, actualiza su firmware y usa WPA3 (o WPA2). Revisa además los dispositivos conectados.

### ✅ En tu día a día
- Cambia la clave del router y la del Wi-Fi; crea una **red de invitados** para visitas y aparatos inteligentes.
- En Wi-Fi público: evita bancos y compras, o conéctate con VPN.
- Comprueba que las webs que usas muestran el **candado** y "https://" en la barra de direcciones.`,

  'seg-06': `

## 🌍 En el mundo real

### 📦 Caso 1 · "Tu paquete está retenido, paga la aduana" (smishing)
Miles de personas en Perú y Latinoamérica reciben mensajes que parecen de una empresa de envíos: piden un pago pequeño por un paquete retenido. El enlace lleva a una **copia falsa** de la web de la empresa donde roban los datos de la tarjeta.

**Qué fallo:** el mensaje parecía real y el monto era pequeño.
**Qué aprendemos:** nunca entres a un enlace de un mensaje inesperado. Entra tú a la web oficial escribiendo la dirección.

### 🏦 Caso 2 · El correo del banco que no era del banco
Los correos de phishing bancario son cada vez más creíbles: usan el logo real, el mismo diseño y un aviso alarmante ("detectamos un movimiento sospechoso"). El enlace lleva a una web falsa que pide usuario, clave y **código SMS**.

**Qué fallo:** la alarma y la prisa que provoca el mensaje.
**Qué aprendemos:** tu banco **nunca** pide claves ni códigos por correo. Ante la duda, cuelga, entra tú a la app oficial y revisa.

### ✅ En tu día a día
- Regla de oro: **si te piden urgencia, claves o dinero, desconfía** y verifica por un canal oficial.
- Desconfía de remitentes raros, errores de escritura y enlaces que no coinciden con el dominio real.
- Si dudaste y ya diste datos: cambia la contraseña, avisa al banco y revisa los movimientos.`,

  'seg-07': `

## 🌍 En el mundo real

### 🔒 Caso 1 · El candado del navegador que ahora es obligatorio
Hace unos años, las webs sin cifrado eran la norma. Hoy Chrome, Edge y Safari **marcan "No seguro"** a cualquier página sin HTTPS, y desde 2020 la mayoría del tráfico de internet está cifrado.

**Qué aprendemos:** el cifrado ya no es opcional. En un formulario o compra, si no hay candado, no pongas tus datos.

### 💻 Caso 2 · La computadora usada que guardaba todo
Comprar un equipo de segunda mano sin borrar bien el disco ha provocado filtraciones reales: documentos, fotos y hasta datos bancarios de la persona anterior. Formatear "normalmente" no siempre borra los datos.

**Qué aprendemos:** antes de vender o regalar un equipo, **borra el disco de forma segura** o cifra siempre el disco: si es robado, no podrán leerlo.

### ✅ En tu día a día
- Activa el **cifrado del disco** (BitLocker en Windows, FileVault en Mac, el del celular viene activado).
- Usa siempre HTTPS y una VPN en redes públicas.
- Antes de deshacerte de un dispositivo, borra los datos de forma segura y cierra la sesión de tus cuentas.`,

  'seg-08': `

## 🌍 En el mundo real

### 🧑‍💻 Caso 1 · El estudiante que perdió su tesis
Es una historia que se repite cada año: el único archivo estaba en una laptop, la laptop se rompió (o la cifró un ransomware) y meses de trabajo desaparecieron. Sin copias, no hay recuperación posible.

**Qué fallo:** una sola copia y en el mismo lugar.
**Qué aprendemos:** regla **3-2-1**: tres copias, en dos soportes distintos y **una fuera de tu casa** (o en la nube).

### 🦠 Caso 2 · El ransomware que borra las copias conectadas
Los ataques modernos no cifran solo tu computadora: buscan y **borran las copias de seguridad conectadas** a la red antes de pedir el rescate. Los que se salvan son los que tienen una copia **desconectada** (disco apagado o cinta).

**Qué aprendemos:** una copia que está siempre conectada no es una copia: es otro archivo en riesgo.

### ✅ En tu día a día
- Aplica 3-2-1 y mantén **una copia desconectada** (un disco externo que conectas solo para copiar).
- **Prueba restaurar** cada cierto tiempo: comprueba que la copia realmente funciona.
- Guarda en la nube lo crítico (documentos, fotos, tesis) y activa la sincronización automática.`,
};
