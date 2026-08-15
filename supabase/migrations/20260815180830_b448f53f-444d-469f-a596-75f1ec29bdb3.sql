
-- 1) Fusionar variedades duplicadas
UPDATE public.plantas SET nombre = 'Pimiento', slug = 'pimiento', descripcion = 'Todas las variedades de pimiento: italiano de freír, morrón de asar, de Padrón, lamuyo y picantes.', calendario_key = 'Pimiento' WHERE slug = 'pimiento-italiano';
UPDATE public.plantas SET nombre = 'Coles', slug = 'coles', nombre_cientifico = 'Brassica oleracea', descripcion = 'Repollo, col rizada (kale), berza o col de hoja, lombarda y col de Milán en plantel de temporada.', calendario_key = 'Col rizada' WHERE slug = 'col-rizada';
UPDATE public.plantas SET nombre = 'Judías', slug = 'judias', descripcion = 'Judía verde de mata baja y de enrame, judía plana y judías de grano para secar.' WHERE slug = 'judia-verde';

-- Reasignar plagas de las fichas que desaparecen a la ficha unificada
INSERT INTO public.planta_plagas (planta_id, plaga_id, orden)
SELECT destino.id, pp.plaga_id, pp.orden
FROM public.planta_plagas pp
JOIN public.plantas origen ON origen.id = pp.planta_id
JOIN public.plantas destino ON destino.slug = CASE
  WHEN origen.slug IN ('pimiento-morron','pimiento-padron') THEN 'pimiento'
  WHEN origen.slug IN ('berza','repollo') THEN 'coles'
END
WHERE origen.slug IN ('pimiento-morron','pimiento-padron','berza','repollo')
  AND NOT EXISTS (
    SELECT 1 FROM public.planta_plagas x WHERE x.planta_id = destino.id AND x.plaga_id = pp.plaga_id
  );

DELETE FROM public.planta_plagas WHERE planta_id IN (SELECT id FROM public.plantas WHERE slug IN ('pimiento-morron','pimiento-padron','berza','repollo'));
DELETE FROM public.planta_enfermedades WHERE planta_id IN (SELECT id FROM public.plantas WHERE slug IN ('pimiento-morron','pimiento-padron','berza','repollo'));
UPDATE public.planta_calendario SET planta_id = NULL WHERE planta_id IN (SELECT id FROM public.plantas WHERE slug IN ('pimiento-morron','pimiento-padron','berza','repollo'));
DELETE FROM public.plantas WHERE slug IN ('pimiento-morron','pimiento-padron','berza','repollo');

-- 2) Nuevas plantas
INSERT INTO public.plantas (slug, nombre, nombre_cientifico, categoria, descripcion, curiosidades, como_se_come, temporada, calendario_key, orden, publicado) VALUES
('melon','Melón','Cucumis melo','hortícola','Melón piel de sapo, cantalupo y galia: variedades de secano y de regadío para el Bajo Cinca.','El pedúnculo agrietado y el aroma en la punta indican que está en su punto.','Fresco en tajadas, con jamón, en gazpacho de melón o en sorbetes.','Julio – Septiembre',NULL,40,true),
('sandia','Sandía','Citrullus lanatus','hortícola','Sandía con y sin pepita, de piel rayada o negra; muy productiva con calor y riego constante.','Las variedades sin pepita necesitan una polinizadora al lado.','Fresca en tajadas o dados, en zumos, granizados y ensaladas con feta y menta.','Julio – Septiembre',NULL,41,true),
('calabaza','Calabaza','Cucurbita maxima','hortícola','Calabaza cacahuete (butternut), violín, potimarrón y de gran calibre para otoño.','Bien curada y en lugar seco se conserva todo el invierno.','Asada, en crema, en puré, en guisos, en bizcochos o en cabello de ángel.','Septiembre – Diciembre',NULL,42,true),
('lechuga-negra','Lechuga Negra de Fraga','Lactuca sativa','hortícola','Variedad autóctona de Fraga, de hoja oscura y rizada, sabor intenso y buena resistencia al calor.','Es una variedad local conservada de huerto en huerto en el Bajo Cinca.','En crudo en ensalada, sola con un buen aceite de oliva y sal.','Marzo – Noviembre','Lechuga',43,true),
('cogollo','Cogollo','Lactuca sativa var. longifolia','hortícola','Cogollo pequeño y compacto tipo Tudela, muy crujiente y de cosecha rápida.','Se planta muy junto para que los cogollos queden apretados y tiernos.','A la plancha con anchoas y vinagreta, o crudo en ensalada.','Todo el año (según variedad)','Lechuga',44,true),
('lechuga-maravilla','Lechuga Maravilla','Lactuca sativa var. capitata','hortícola','Lechuga de cogollo mantecoso con borde rojizo, la clásica «Maravilla de verano».','Aguanta el calor mejor que otras acogolladas sin subirse a flor.','En crudo en ensalada clásica o como envoltorio de rellenos ligeros.','Marzo – Octubre','Lechuga',45,true),
('oregano','Orégano','Origanum vulgare','aromática','Vivaz mediterránea muy rústica, perfecta en maceta o borde soleado.','Seco concentra mucho más aroma que fresco.','Seco sobre pizza, tomate, pescado al horno, adobos y salsas.','Todo el año',NULL,50,true),
('curry','Planta del Curry','Helichrysum italicum','aromática','Mata plateada de aroma intenso a curry, muy resistente a la sequía.','No es la especia: es un helicriso cuyo aroma recuerda al curry.','Una ramita aromatiza arroces, guisos y salsas; se retira antes de servir.','Todo el año',NULL,51,true),
('cebollino','Cebollino','Allium schoenoprasum','aromática','Vivaz de mata fina; se corta a tijera y rebrota una y otra vez.','Sus flores lilas son comestibles y decoran ensaladas.','Crudo picado sobre ensaladas, huevos, patatas, cremas y salsas de yogur.','Marzo – Octubre',NULL,52,true),
('stevia','Stevia','Stevia rebaudiana','aromática','Planta edulcorante natural; en maceta protegida pasa bien el invierno.','Una sola hoja endulza como varias cucharaditas de azúcar.','Hoja fresca o seca para endulzar infusiones, postres y bebidas.','Mayo – Octubre',NULL,53,true),
('satureja','Ajedrea (Satureja)','Satureja montana','aromática','Aromática de montaña, compacta y muy melífera, ideal en rocalla.','Tradicionalmente aromatiza las olivas y los encurtidos.','En adobos de oliva, legumbres, embutidos caseros y guisos de carne.','Todo el año',NULL,54,true),
('morera','Morera','Morus alba','árbol','Árbol de sombra rápido y agradecido, en variedad fructífera o sin fruto.','Sus hojas son el único alimento del gusano de seda.','Las moras se comen frescas, en mermelada o en licor.','Todo el año',NULL,60,true),
('sauce-lloron','Sauce Llorón','Salix babylonica','árbol','Porte llorón espectacular junto a estanques y zonas húmedas.','Sus raíces buscan la humedad a gran distancia.',NULL,'Todo el año',NULL,61,true),
('platanero','Plátano de Sombra','Platanus × hispanica','árbol','Clásico árbol de alineación y sombra densa en calles y paseos.','Es el árbol de sombra más plantado de las ciudades españolas.',NULL,'Todo el año',NULL,62,true),
('prunus-pisardi','Prunus Pisardi','Prunus cerasifera ''Pissardii''','árbol','Ciruelo de hoja roja con floración rosa muy temprana.','De los primeros árboles en florecer al final del invierno.',NULL,'Floración Febrero – Marzo',NULL,63,true),
('cedro','Cedro','Cedrus spp.','árbol','Conífera monumental de gran porte para jardines amplios.','Puede superar los 40 m y vivir varios siglos.',NULL,'Todo el año',NULL,64,true),
('roble','Roble','Quercus robur','árbol','Árbol caducifolio longevo, de madera noble y sombra amplia.','Puede tardar más de 30 años en dar sus primeras bellotas.',NULL,'Todo el año',NULL,65,true),
('liquidambar','Liquidámbar','Liquidambar styraciflua','árbol','Árbol ornamental por excelencia por su color otoñal rojo intenso.','Su resina aromática se usaba en perfumería.',NULL,'Color otoñal Octubre – Noviembre',NULL,66,true),
('madrono','Madroño','Arbutus unedo','árbol','Pequeño árbol mediterráneo perenne con frutos rojos comestibles.','Lleva a la vez flores y frutos del año anterior.','El madroño se come maduro, en mermelada o en licor.','Fruto Octubre – Diciembre',NULL,67,true),
('encina','Encina','Quercus ilex','árbol','Árbol perenne emblemático del clima mediterráneo, muy resistente a la sequía.','Sus bellotas son la base de la montanera del cerdo ibérico.',NULL,'Todo el año',NULL,68,true),
('pino','Pino','Pinus spp.','árbol','Coníferas de crecimiento rápido: carrasco, piñonero y laricio.','El pino piñonero da los piñones que se usan en cocina.',NULL,'Todo el año',NULL,69,true),
('catalpa-bungei','Catalpa Bungei','Catalpa bungei','árbol','Catalpa de copa esférica injertada, ideal para alineaciones y patios.','Su copa compacta apenas necesita poda para mantener la bola.',NULL,'Todo el año',NULL,70,true),
('sophora','Sóphora','Styphnolobium japonicum','árbol','Árbol de sombra con floración blanca estival y porte elegante.','De los pocos árboles grandes que florecen en pleno verano.',NULL,'Floración Julio – Agosto',NULL,71,true),
('castano','Castaño','Castanea sativa','árbol','Árbol de gran porte y fruto muy apreciado en otoño.','Un castaño injertado puede producir durante más de un siglo.','Las castañas se comen asadas, cocidas, en puré o en marrón glacé.','Cosecha Octubre – Noviembre',NULL,72,true),
('nogal','Nogal','Juglans regia','árbol','Frutal de sombra densa y madera muy valorada.','Sus raíces liberan juglona: pocas plantas prosperan bajo su copa.','Las nueces se comen crudas, tostadas, en ensaladas y repostería.','Cosecha Septiembre – Octubre',NULL,73,true),
('paulonia','Paulonia','Paulownia tomentosa','árbol','Crecimiento muy rápido, hoja enorme y floración lila espectacular.','Es uno de los árboles de crecimiento más rápido del mundo.',NULL,'Floración Abril – Mayo',NULL,74,true),
('abelia','Abelia','Abelia × grandiflora','arbusto','Arbusto perenne de floración muy larga, perfecto para setos bajos.','Florece de primavera hasta bien entrado el otoño.',NULL,'Floración Mayo – Octubre',NULL,80,true),
('callistemon','Callistemon','Callistemon citrinus','arbusto','El «limpiatubos»: espigas rojas muy vistosas y gran resistencia a la sequía.','Sus flores atraen abejas y pájaros al jardín.',NULL,'Floración Abril – Junio',NULL,81,true),
('viburnum-tinus','Viburnum Tinus (Durillo)','Viburnum tinus','arbusto','Perenne muy rústico, ideal para setos y masas de sombra.','Florece en pleno invierno, cuando casi nada más lo hace.',NULL,'Floración Diciembre – Marzo',NULL,82,true),
('viburnum-lucidum','Viburnum Lucidum','Viburnum tinus ''Lucidum''','arbusto','Variedad de hoja más grande y brillante, de crecimiento vigoroso.','Muy usado en setos altos por su follaje denso todo el año.',NULL,'Todo el año',NULL,83,true),
('nispero','Níspero','Eriobotrya japonica','frutal','Frutal perenne de cosecha muy temprana, en primavera.','Florece en otoño y madura en primavera.','Fresco al natural, en mermelada, en almíbar o en licor.','Cosecha Abril – Mayo',NULL,90,true),
('naranjo','Naranjo','Citrus × sinensis','frutal','Cítrico clásico en variedades de mesa y de zumo.','El azahar perfuma el jardín entero en primavera.','Fresca en gajos, en zumo, en ensaladas y en mermelada.','Cosecha Noviembre – Abril',NULL,91,true),
('limonero','Limonero','Citrus × limon','frutal','Cítrico reflorecente: da fruto prácticamente todo el año.','Puede tener flor, fruto verde y fruto maduro a la vez.','En zumo, aliños, conservas, repostería y bebidas.','Todo el año',NULL,92,true),
('limero','Limero (Lima)','Citrus × latifolia','frutal','Cítrico de fruto pequeño y muy aromático; agradece protección del frío.','Más sensible a las heladas que el limonero.','En cócteles, ceviches, guacamole y aliños.','Cosecha Agosto – Diciembre',NULL,93,true),
('kumquat','Kumquat','Citrus japonica','frutal','Cítrico enano de fruto pequeño, ideal en maceta y patios.','Es el único cítrico que se come entero, con piel.','Entero con piel, confitado o en mermelada.','Cosecha Diciembre – Marzo',NULL,94,true),
('membrillo','Membrillero','Cydonia oblonga','frutal','Frutal rústico de gran floración y fruto muy aromático.','Un solo membrillo perfuma toda una habitación.','En dulce de membrillo, asado o en compota.','Cosecha Septiembre – Octubre',NULL,95,true),
('kaki','Kaki','Diospyros kaki','frutal','Frutal de otoño muy productivo y de color espectacular al madurar.','Las variedades Rojo Brillante se comen duras tras destanizarlas.','A cucharada, tipo persimon como una manzana, o en batidos.','Cosecha Octubre – Diciembre',NULL,96,true)
ON CONFLICT (slug) DO NOTHING;
