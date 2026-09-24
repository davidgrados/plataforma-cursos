// ============================================================
//  Ejemplos del mundo real · Inteligencia Artificial Básica
// ============================================================

export const EJEMPLOS_IA: Record<string, string> = {
  'ia-01': `

## 🌍 En el mundo real

### ⚖️ Caso 1 · El abogado que citó casos inventados (Nueva York, 2023)
Un abogado usó un chatbot para preparar un escrito judicial. El chatbot **inventó sentencias y jurisprudencia** que no existían, con nombres y números de expediente falsos. El tribunal lo sancionó al descubrirlo.

**Qué falló:** creer que la IA "sabe" y no verificar sus respuestas.
**Qué aprendemos:** la IA predice texto probable, **no consulta la verdad**. Siempre verifica datos, citas y cifras en fuentes confiables.

### 🩺 Caso 2 · La IA que ayuda a leer radiografías
Sistemas entrenados con **miles de imágenes médicas** (por ejemplo una investigación publicada en Nature en 2020) lograron detectar cáncer de mama con precisión comparable a la de especialistas, y a veces mejor, sobre todo en grupos donde los radiólogos tenían menos experiencia.

**Qué enseña:** bien usada, la IA amplifica lo que ya sabemos hacer; no reemplaza al médico, le da un segundo par de ojos incansable.

### ✅ En tu día a día
- Usa la IA como **asistente**, no como oráculo: verifica cualquier dato importante.
- Recuerda qué es: reconocer patrones en datos, no "entender" como una persona.
- Pregúntate siempre quién entrenó el sistema, con qué datos y para qué.`,

  'ia-02': `

## 🌍 En el mundo real

### ♟️ Caso 1 · De Deep Blue a AlphaGo (1997 y 2016)
En 1997 la computadora **Deep Blue** venció al campeón mundial de ajedrez. En 2016, **AlphaGo** ganó al mejor jugador de Go, un juego con más posiciones posibles que átomos tiene el universo. Ningún humano le enseñó las jugadas: **aprendió jugando millones de partidas**.

**Qué enseña:** la IA pasó de seguir reglas escritas por humanos a descubrir estrategias que los humanos no habíamos encontrado. En una partida famosa, AlphaGo hizo una jugada que los expertos creían un error... y era brillante.

### 🧬 Caso 2 · AlphaFold y el Nobel de Química 2024
Predecir la forma 3D de una proteína era un reto de décadas. Un sistema de IA lo resolvió y liberó **más de 200 millones de estructuras** para que cualquier científico del mundo las use. Sus creadores recibieron el **Premio Nobel de Química 2024**.

**Qué enseña:** el mayor impacto de la IA no está en los chatbots, sino en acelerar la ciencia.

### ✅ En tu día a día
- Fíjate en la IA que **ya usas** sin llamarla así: el buscador del celular, las recomendaciones de videos, el corrector del teclado.
- Cuando uses una IA, piensa qué datos le estás dando: aprende de ellos.
- La historia enseña que las predicciones "imposibles" caducan rápido: hoy es escribir, ayer fue el ajedrez.`,

  'ia-03': `

## 🌍 En el mundo real

### 🛒 Caso 1 · "A los que compraron esto también les gustó…"
Las recomendaciones de Amazon, Netflix, Spotify y YouTube son **aprendizaje automático** en acción: el sistema aprende de millones de comportamientos y acierta cada vez más. Es probablemente la IA que más dinero mueve en el mundo.

**Qué enseña:** aprender de los datos funciona, y por eso las empresas que tienen datos tienen ventaja.

### ⚖️ Caso 2 · El algoritmo de contratación que discriminaba (Amazon, 2018)
Amazon entrenó un sistema para filtrar currículums. Aprendió de **10 años de contrataciones reales**, que habían sido mayoritariamente de hombres, y terminó penalizando currículums que mencionaban "mujeres" (por ejemplo, equipos deportivos femeninos). Lo cancelaron.

**Qué falló:** los datos de entrenamiento llevaban años de sesgo humano; el modelo lo copió y lo automatizó.
**Qué aprendemos:** un modelo solo es tan justo como sus datos. Con decisiones sobre personas (crédito, empleo, salud) hay que auditar el sesgo.

### ✅ En tu día a día
- Si una IA te recomienda, te puntúa o te filtra, pregúntate: ¿con qué datos aprendió?
- En proyectos escolares o de trabajo: la calidad de los datos importa más que el algoritmo.
- Desconfía de decisiones automáticas sobre personas que nadie revisa.`,

  'ia-04': `

## 🌍 En el mundo real

### 📸 Caso 1 · Buscar una foto por lo que aparece en ella
Google Fotos y las apps de tu celular usan **redes neuronales convolucionales** para reconocer caras, perros, playas o textos sin que nadie etiquete cada imagen. Cada vez que buscas "playa" y acierta, hay millones de parámetros ajustados.

**Qué enseña:** el Deep Learning funciona parecido a nuestra vista: capas que detectan bordes, luego formas, luego objetos completos.

### 🚗 Caso 2 · Los casos raros que el coche autónomo no vio
Los sistemas de conducción asistida funcionan muy bien en situaciones comunes, pero han fallado con **casos límite** (un camión atravesado, una señal tapada, una persona con ropa inusual). Esos casos raros son el gran desafío.

**Qué aprendemos:** un modelo es tan bueno como los ejemplos con los que aprendió. Lo raro y lo nuevo es donde falla.
**Y algo importante:** si tu modelo solo ve datos de un tipo de personas, funcionará peor con las demás.

### ✅ En tu día a día
- Piensa en tres cosas que tu celular reconoce automáticamente: eso es visión por computadora.
- Cuando una IA se equivoque "raro", pregúntate si había visto antes un caso así.
- Cuidado con los datos que alimentan esos sistemas: tus fotos también entrenan modelos.`,

  'ia-05': `

## 🌍 En el mundo real

### ✈️ Caso 1 · El chatbot de la aerolínea que inventó una política (Air Canada, 2024)
Un chatbot de atención al cliente dijo a un pasajero que podía pedir un reembolso por duelo **después** de viajar (algo que la política real no permitía). El pasajero lo hizo y la aerolínea se negó. Un tribunal canadiense falló que **la empresa era responsable de lo que dijo su chatbot**.

**Qué fallo:** un chatbot sin límites claros y sin supervisión humana.
**Qué aprendemos:** si una IA habla en nombre de tu negocio, sus respuestas te comprometen legalmente. Ponle límites y revisión.

### 🌎 Caso 2 · Traducir sin saber idiomas
Google Translate y DeepL traducen entre decenas de idiomas en segundos. Gracias al NLP puedes leer un manual en inglés, entender un correo en portugués o subtitular un video. Durante la pandemia, la OMS publicó material en decenas de idiomas con ayuda de estas herramientas.

**Qué enseña:** el procesamiento del lenguaje natural acorta distancias. Pero en temas legales, médicos o comerciales, **siempre revisa** la traducción.

### ✅ En tu día a día
- Usa la traducción automática para entender, pero revisa antes de firmar o publicar algo importante.
- Revisa los resúmenes y respuestas de asistentes: pueden "alucinar" con seguridad total.
- Si tienes un negocio con chatbot, define qué puede y qué no puede responder.`,

  'ia-06': `

## 🌍 En el mundo real

### 🚔 Caso 1 · El reconocimiento facial que se equivocó (Estados Unidos, 2020)
Un hombre fue **detenido por error** por un sistema de reconocimiento facial que lo confundió con un sospechoso. Varios casos similares mostraron un patrón: la tecnología fallaba más con personas negras y morenas, porque los datos de entrenamiento estaban desequilibrados.

**Qué fallo:** servir el sistema sin auditar el sesgo por grupos de personas.
**Qué aprendemos:** con datos biométricos el margen de error debe ser mínimo, y **siempre** debe haber revisión humana antes de una decisión que afecte a alguien.

### 🎭 Caso 2 · Los filtros y el cine: la visión artificial en tu bolsillo
Los filtros que cambian tu cara en tiempo real, el reconocimiento de texto (traducir un menú con la cámara) y el desbloqueo por rostro usan visión por computadora. También se usa para **detectar tumores**, medir cosechas por satélite o revisar piezas en una fábrica.

**Qué enseña:** la misma tecnología sirve para entretener y para salvar vidas. La diferencia está en cómo se usa.

### ✅ En tu día a día
- Recuerda que tus fotos y videos también son datos biométricos: piensa dónde los subes.
- Desconfía de decisiones automáticas sobre personas que no tienen revisión humana.
- Si algo te interesa (salud, agro, industria), la visión por computadora es una salida laboral real.`,

  'ia-07': `

## 🌍 En el mundo real

### 🎙️ Caso 1 · La voz clonada del CEO (2019)
Un estafador clonó con IA la **voz de un director general** y llamó a su subordinado pidiendo una transferencia urgente. El empleado transfirió unos **243.000 dólares** en varias cuentas. La voz sonaba igual.

**Qué fallo:** una decisión financiera tomada solo por teléfono, sin verificación.
**Qué aprendemos:** con IA ya no basta "reconocer la voz". Confirma operaciones importantes por un segundo canal y con procedimientos definidos.

### 🎨 Caso 2 · Escribir, dibujar y programar con IA
Los asistentes de IA ayudan hoy a redactar correos, resumir documentos, generar imágenes, crear presentaciones y hasta escribir código. Muchas pymes han reducido horas de trabajo administrativo usándolos bien.

**Qué enseña:** la IA generativa es una herramienta de productividad enorme... siempre con **ojos humanos** encima: puede inventar datos, copiar estilos de terceros y equivocarse con total seguridad.

### ✅ En tu día a día
- Usa la IA para **borradores y lluvia de ideas**, y revisa todo antes de enviarlo o publicarlo.
- No compartas datos personales, claves ni información confidencial de tu trabajo con chatbots públicos.
- Ante una llamada o mensaje pidiendo dinero con una voz "conocida": corta y confirma por otro canal.`,

  'ia-08': `

## 🌍 En el mundo real

### 😱 Caso 1 · Cuando la IA "alucina" con seguridad
Los modelos de lenguaje inventan datos con una confianza total: citan libros que no existen, estadísticas falsas y fuentes inexistentes. Es un fallo conocido que se llama *alucinación*.

**Qué fallo:** pedirle a un sistema que genera texto probable que sea una fuente de verdad.
**Qué aprendemos:** la IA es un punto de partida, no una prueba. Verifica siempre lo importante.

### ⚖️ Caso 2 · Las primeras leyes de IA (Unión Europea, 2024)
La UE aprobó la **AI Act**, una ley que clasifica los sistemas de IA por riesgo: prohíbe algunos usos (puntuación social, ciertos reconocimientos biométricos) y obliga a transparencia y evaluación en los de alto riesgo (empleo, educación, salud, crédito).

**Qué enseña:** el mundo está regulando la IA. Como usuario y futuro profesional, entender esos límites vale tanto como saber usarla.

### ✅ En tu día a día
- Si usas IA para estudiar o trabajar, **declara** cuando corresponda: presentar texto de IA como tuyo se considera deshonestidad académica.
- Reflexiona sobre el sesgo, la privacidad y el empleo: son los grandes debates de tu generación.
- Y un dato esperanzador: la IA también ayuda a diagnosticar enfermedades, traducir idiomas y enseñar a quien no tiene profesores cerca.
`,
};
