
UPDATE public.plagas SET prevencion =
 'Aireación entre plantas, evitar exceso de nitrógeno y regar por la mañana. Preventivo clásico: azufre mojable 3 g/L o espolvoreo de azufre en polvo cada 10-14 días, siempre aplicado al fresco (primera hora de la mañana o al atardecer, nunca por encima de 30 ºC ni a pleno sol, porque quema la hoja).'
 WHERE nombre ILIKE 'oidio' OR nombre ILIKE 'oídio%' OR nombre ILIKE 'oidiopsis';

UPDATE public.plagas SET prevencion =
 'Mantener humedad ambiental y evitar estrés hídrico; mojar el envés de la hoja. Preventivo: azufre mojable 3 g/L (o azufre en polvo) cada 10-14 días aplicado al fresco, nunca a pleno sol ni con más de 30 ºC. Refuerza con sueltas de fitoseidos en invernadero.'
 WHERE nombre ILIKE 'araña%';

UPDATE public.plagas SET prevencion =
 'Ventilar, no mojar la planta y acolchar para que el fruto no toque el suelo. Aplicar cobre (oxicloruro 3 ml/L) justo después de cada lluvia o de un periodo húmedo prolongado, cuando la hoja se haya secado, y retirar restos vegetales y flores marchitas.'
 WHERE nombre ILIKE 'botritis%';

UPDATE public.plagas SET prevencion =
 COALESCE(NULLIF(prevencion,''),'Riego a pie de planta, marcos amplios y buena ventilación; evitar mojar la hoja.')
 || ' Preventivo cúprico: oxicloruro de cobre 3 ml/L renovado siempre después de cada lluvia (el cobre se lava) y antes de periodos húmedos o de niebla.'
 WHERE nombre ILIKE 'mildiu%' OR nombre ILIKE 'antracnosis' OR nombre ILIKE 'abolladura';

UPDATE public.plagas SET prevencion =
 COALESCE(NULLIF(prevencion,''),'Malla antiinsectos y revisión del envés.')
 || ' Preventivo biológico: Bacillus thuringiensis var. kurstaki 1-1,5 g/L cada 7-10 días desde que se ven las primeras mariposas, aplicado al atardecer (la luz solar lo degrada); es inocuo para abejas y fauna auxiliar.'
 WHERE nombre ILIKE 'oruga%' OR nombre ILIKE '%rosquilla%' OR nombre ILIKE '%heliothis%';

INSERT INTO public.plagas (slug, nombre, descripcion, prevencion, combate, otros_datos)
VALUES
 ('tuta-absoluta','Tuta absoluta',
  'Polilla del tomate. La larva excava galerías transparentes en la hoja y perfora el fruto, que se pudre. Muy activa de primavera a otoño y devastadora en invernadero.',
  'Malla antiinsectos de 6x9 hilos, eliminación de restos de cultivo y de tomates espontáneos, rotación y trampas de feromona (1 por cada 100 m² para seguimiento, trampas de agua+feromona para captura masiva). Preventivo biológico: Bacillus thuringiensis 1-1,5 g/L cada 7 días al atardecer desde las primeras capturas.',
  'Retirar y destruir hojas y frutos con galerías (no dejarlos en el huerto). Fitosanitarios Sipcam (botella pequeña, disponible en tienda): Bacillus thuringiensis 1-1,5 g/L, spinosad 0,3-0,5 ml/L o insecticida autorizado para tuta 0,5-1 ml/L, alternando materias activas para evitar resistencias y mojando bien el envés. Respetar el plazo de seguridad indicado en la etiqueta.',
  'Es la plaga clave del tomate; también ataca berenjena y patata. Combina siempre trampeo + tratamiento: solo con insecticida no se controla.'),
 ('toxicidad-fitosanitarios','Toxicidad por fitosanitarios',
  'No es una plaga: son los daños causados por el propio tratamiento. Se ve como quemaduras en el borde de la hoja, manchas plateadas o necróticas, hojas deformadas, caída de flor o parada del crecimiento.',
  'Respetar siempre la dosis de la etiqueta (más producto no cura mejor), no mezclar azufre con aceites de parafina ni aplicar ambos con menos de 21 días de diferencia, tratar al fresco (mañana temprano o atardecer, nunca a pleno sol ni por encima de 30 ºC), no tratar plantas en estrés hídrico o recién trasplantadas, y usar agua limpia con el pH ajustado.',
  'Suspender los tratamientos, regar abundantemente para lavar la planta y el sustrato, retirar las hojas muy dañadas y esperar a la nueva brotación. Un abonado foliar suave o un bioestimulante de aminoácidos ayuda a la recuperación. No repetir el producto sospechoso.',
  'Anota siempre qué producto, qué dosis y qué día aplicas. Respeta el plazo de seguridad antes de recolectar y guarda los envases fuera del alcance de niños y animales; en Jardiper te asesoramos sobre la dosis correcta de cada botella Sipcam.')
ON CONFLICT (slug) DO UPDATE SET
 nombre = EXCLUDED.nombre, descripcion = EXCLUDED.descripcion,
 prevencion = EXCLUDED.prevencion, combate = EXCLUDED.combate, otros_datos = EXCLUDED.otros_datos;

INSERT INTO public.planta_plagas (planta_id, plaga_id, orden)
SELECT p.id, g.id, 50
FROM public.plantas p
CROSS JOIN public.plagas g
WHERE g.slug = 'tuta-absoluta'
  AND (p.nombre ILIKE '%tomate%' OR p.nombre ILIKE '%berenjena%' OR p.nombre ILIKE '%patata%')
  AND NOT EXISTS (SELECT 1 FROM public.planta_plagas pp WHERE pp.planta_id = p.id AND pp.plaga_id = g.id);

INSERT INTO public.planta_plagas (planta_id, plaga_id, orden)
SELECT p.id, g.id, 99
FROM public.plantas p
CROSS JOIN public.plagas g
WHERE g.slug = 'toxicidad-fitosanitarios'
  AND p.categoria = 'hortícola'
  AND NOT EXISTS (SELECT 1 FROM public.planta_plagas pp WHERE pp.planta_id = p.id AND pp.plaga_id = g.id);
