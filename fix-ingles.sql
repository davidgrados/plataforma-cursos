-- Corrige el ejemplo inapropiado del Modulo 2 de Ingles (solo ASCII)
UPDATE lessons SET content_md = REPLACE(content_md, '*beach* (playa) y *bitch* (insulto).', '*man* (hombre) y *men* (hombres); *hungry* (hambriento) y *angry* (enojado).') WHERE slug = 'ingles-02';
UPDATE lessons SET content_md = REPLACE(content_md, 'cambian totalmente de significado con un sonido:', 'cambian totalmente de significado con un sonido. Pares que conviene entrenar:') WHERE slug = 'ingles-02';
