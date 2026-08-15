insert into public.plantas (slug, nombre, nombre_cientifico, categoria, descripcion, curiosidades, temporada, orden, publicado)
values ('litonero', 'Litonero', 'Celtis australis', 'árbol', 'Árbol de sombra muy resistente y longevo, clásico en plazas y paseos del Bajo Cinca.', 'Con su madera flexible se hacían tradicionalmente horcas y bastones; sus frutos, los litones, son comestibles.', 'Todo el año (plantación otoño-invierno)', 200, true)
on conflict (slug) do nothing;

with pares(planta_slug, plaga_slug) as (values
  ('cogollo','mildiu-de-la-lechuga'),('cogollo','pulgon'),('cogollo','caracoles-y-babosas'),('cogollo','botritis'),
  ('lechuga-negra','mildiu-de-la-lechuga'),('lechuga-negra','pulgon'),('lechuga-negra','caracoles-y-babosas'),('lechuga-negra','botritis'),
  ('lechuga-maravilla','mildiu-de-la-lechuga'),('lechuga-maravilla','pulgon'),('lechuga-maravilla','caracoles-y-babosas'),('lechuga-maravilla','minador-de-la-hoja'),
  ('melon','oidio'),('melon','mildiu'),('melon','pulgon'),('melon','mosca-blanca'),('melon','arana-roja'),
  ('sandia','oidio'),('sandia','mildiu'),('sandia','pulgon'),('sandia','arana-roja'),
  ('calabaza','oidio'),('calabaza','mildiu'),('calabaza','pulgon'),('calabaza','mosca-blanca'),
  ('nispero','moteado-del-nispero'),('nispero','pulgon'),('nispero','cochinilla'),('nispero','mosca-de-la-fruta'),
  ('naranjo','minador-de-los-citricos'),('naranjo','cochinilla'),('naranjo','pulgon'),('naranjo','negrilla'),('naranjo','clorosis-ferrica'),
  ('limonero','minador-de-los-citricos'),('limonero','cochinilla'),('limonero','pulgon'),('limonero','negrilla'),('limonero','clorosis-ferrica'),
  ('limero','minador-de-los-citricos'),('limero','cochinilla'),('limero','pulgon'),('limero','negrilla'),
  ('kumquat','minador-de-los-citricos'),('kumquat','cochinilla'),('kumquat','pulgon'),('kumquat','clorosis-ferrica'),
  ('membrillo','moteado'),('membrillo','pulgon'),('membrillo','mosca-de-la-fruta'),
  ('kaki','cochinilla'),('kaki','mosca-de-la-fruta'),('kaki','negrilla'),
  ('litonero','pulgon'),('litonero','cochinilla'),
  ('morera','pulgon'),('morera','negrilla'),
  ('sauce-lloron','roya-del-sauce'),('sauce-lloron','pulgon'),
  ('platanero','oidio'),('platanero','antracnosis'),('platanero','cochinilla'),
  ('prunus-pisardi','pulgon'),('prunus-pisardi','abolladura'),
  ('cedro','cochinilla'),('cedro','pudricion-de-raiz'),
  ('roble','oidio-del-roble'),('roble','procesionaria'),
  ('liquidambar','clorosis-ferrica'),('liquidambar','cochinilla'),
  ('madrono','clorosis-ferrica'),('madrono','cochinilla'),
  ('encina','seca-de-la-encina'),('encina','procesionaria'),
  ('pino','procesionaria-del-pino'),('pino','cochinilla'),
  ('catalpa-bungei','pulgon'),('catalpa-bungei','oidio'),
  ('sophora','pulgon'),('sophora','cochinilla'),
  ('castano','chancro-del-castano'),('castano','oidio'),
  ('nogal','bacteriosis-del-nogal'),('nogal','pulgon'),
  ('paulonia','pulgon'),('paulonia','pudricion-de-raiz'),
  ('melocotonero','abolladura'),('melocotonero','pulgon'),('melocotonero','mosca-de-la-fruta'),
  ('olivo','mosca-del-olivo'),('olivo','cochinilla'),('olivo','negrilla'),
  ('abelia','pulgon'),('abelia','oidio'),
  ('callistemon','cochinilla'),('callistemon','clorosis-ferrica'),
  ('viburnum-tinus','pulgon'),('viburnum-tinus','oidio'),
  ('viburnum-lucidum','cochinilla'),('viburnum-lucidum','oidio'),
  ('adelfa','cochinilla'),('adelfa','negrilla'),
  ('rosal','oidio'),('rosal','pulgon'),('rosal','roya'),
  ('romero','cochinilla'),('romero','hongos-por-exceso-de-riego'),
  ('oregano','pulgon'),('oregano','hongos-por-exceso-de-riego'),
  ('satureja','pulgon'),('satureja','hongos-por-exceso-de-riego'),
  ('curry','cochinilla'),('curry','hongos-por-exceso-de-riego'),
  ('cebollino','pulgon'),('cebollino','roya'),
  ('stevia','mosca-blanca'),('stevia','pulgon'),
  ('tomillo','hongos-por-exceso-de-riego'),
  ('lavanda','hongos-por-exceso-de-riego'),
  ('albahaca','mildiu-de-la-albahaca'),
  ('menta-hierbabuena','roya-de-la-menta')
)
insert into public.planta_plagas (planta_id, plaga_id, orden)
select pl.id, pg.id, 0
from pares
join public.plantas pl on pl.slug = pares.planta_slug
join public.plagas pg on pg.slug = pares.plaga_slug
where not exists (
  select 1 from public.planta_plagas x where x.planta_id = pl.id and x.plaga_id = pg.id
);