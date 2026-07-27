// Noticias y curiosidades del vivero Jardiper.
// Estructura pensada para escalar: añade nuevas entradas al principio del array
// `noticias` y aparecerán automáticamente en /blog, en el sitemap y en los
// bloques de "también te puede interesar".
// TODO: migrar a base de datos (Lovable Cloud) cuando esté disponible.

import imgNuevaWeb from "@/assets/blog/nueva-web.jpg";
import imgFeria from "@/assets/blog/feria.jpg";
import imgTemporada from "@/assets/blog/temporada.jpg";
import imgCuriosidad from "@/assets/blog/curiosidad.jpg";

export const categoriasNoticias = [
  "Novedades",
  "Ferias y eventos",
  "Temporada",
  "Curiosidades",
] as const;

export type CategoriaNoticia = (typeof categoriasNoticias)[number];

export type NoticiaSection = {
  titulo?: string;
  parrafos: string[];
};

export type Noticia = {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  categoria: CategoriaNoticia;
  imagen: string;
  autor: string;
  fecha: string; // ISO YYYY-MM-DD
  minutos: number;
  destacada?: boolean;
  entradilla: string;
  secciones: NoticiaSection[];
  tags: string[];
};

export const noticias: Noticia[] = [
  {
    id: "nueva-web-jardiper",
    slug: "estrenamos-nueva-web",
    titulo: "Estrenamos nueva web: Jardiper, ahora también online",
    resumen:
      "Después de 50 años atendiendo en Fraga, damos el salto digital con un catálogo consultable, calendario de cultivo y guías descargables.",
    categoria: "Novedades",
    imagen: imgNuevaWeb,
    autor: "Equipo Jardiper",
    fecha: "2026-07-10",
    minutos: 3,
    destacada: true,
    entradilla:
      "Llevábamos tiempo con ganas: por fin podéis consultar desde casa buena parte de lo que tenemos en el vivero, sin esperar a pasaros por la tienda.",
    secciones: [
      {
        titulo: "Por qué hemos hecho la web",
        parrafos: [
          "Cada temporada recibimos las mismas preguntas por teléfono: qué plantel hay disponible, cuándo toca trasplantar, qué sustrato es mejor para semillero. La web nace para responder a todo eso las 24 horas, sin que tengáis que esperar a que abramos.",
          "También queríamos poner en valor lo que hacemos desde 1974: un vivero familiar del Bajo Cinca que conoce el clima, la tierra y las variedades de la zona.",
        ],
      },
      {
        titulo: "Qué encontrarás",
        parrafos: [
          "Un catálogo con plantas hortícolas y ornamentales, sustratos Suliflor, compost ECO, piedras decorativas y macetas. Cada variedad hortícola incluye ahora su calendario de cultivo mes a mes.",
          "En 'Tu huerto' están las guías de cultivo descargables en PDF y las fechas aconsejables de trasplante. Y aquí, en el blog, iremos publicando novedades, visitas a ferias y curiosidades del mundo vegetal.",
        ],
      },
      {
        titulo: "Esto es solo el principio",
        parrafos: [
          "El catálogo irá creciendo temporada a temporada y puede estar incompleto o desactualizado: si buscas algo concreto, lo mejor sigue siendo llamarnos o pasarte por Fraga.",
          "¿Echas algo en falta en la web? Cuéntanoslo, la idea es que sea útil de verdad para quien cultiva por aquí.",
        ],
      },
    ],
    tags: ["Jardiper", "Novedades", "Web"],
  },
  {
    id: "feria-iberflora",
    slug: "visitamos-la-feria-de-planta-y-jardineria",
    titulo: "Visitamos la feria de planta y jardinería: lo que nos traemos",
    resumen:
      "Dos días entre novedades varietales, sustratos de nueva generación y mucha conversación con productores. Esto es lo que veremos pronto en el vivero.",
    categoria: "Ferias y eventos",
    imagen: imgFeria,
    autor: "Equipo Jardiper",
    fecha: "2026-06-18",
    minutos: 4,
    entradilla:
      "Cada año intentamos escaparnos a las ferias del sector. No es turismo: es la manera de anticipar qué llegará a los huertos de la comarca en las próximas temporadas.",
    secciones: [
      {
        titulo: "Variedades resistentes a la sequía",
        parrafos: [
          "La palabra que más se repitió en los stands fue 'agua'. Se presentaron portainjertos de tomate y pimiento con mejor comportamiento en secano y ornamentales mediterráneas de bajísimo consumo hídrico.",
          "Nos interesa especialmente todo lo que aguante los veranos del Bajo Cinca sin exigir riegos diarios; probaremos algunas de estas variedades en nuestras parcelas antes de ofrecerlas.",
        ],
      },
      {
        titulo: "Sustratos con menos turba",
        parrafos: [
          "La reducción de turba rubia sigue avanzando: fibra de coco, fibra de madera y compost verde ganan peso en las mezclas profesionales. En semillero los resultados ya son muy comparables.",
          "Hablamos con nuestros proveedores para ir incorporando estas fórmulas más sostenibles sin subir el precio final.",
        ],
      },
      {
        titulo: "Lo mejor: la gente",
        parrafos: [
          "Reencontrarse con productores, viveristas y técnicos de toda la península es lo que más aporta. De esas conversaciones salen los contactos que luego permiten conseguir una variedad concreta que un cliente nos pide.",
          "Volvimos con la furgoneta llena de catálogos y la libreta llena de ideas para la próxima campaña.",
        ],
      },
    ],
    tags: ["Feria", "Novedades", "Sector"],
  },
  {
    id: "temporada-plantel-verano",
    slug: "ya-esta-listo-el-plantel-de-verano",
    titulo: "Ya está listo el plantel de verano",
    resumen:
      "Tomate, pimiento, berenjena, calabacín y aromáticas salen del invernadero. Te contamos cómo elegir buen plantel y qué mirar antes de comprarlo.",
    categoria: "Temporada",
    imagen: imgTemporada,
    autor: "Equipo Jardiper",
    fecha: "2026-05-05",
    minutos: 4,
    entradilla:
      "Ya tenemos en mostrador el plantel de temporada, criado aquí mismo. Aprovechamos para explicar en qué nos fijamos nosotros al seleccionar una bandeja.",
    secciones: [
      {
        titulo: "Cómo reconocer un buen plantel",
        parrafos: [
          "Busca plantas compactas, de tallo grueso y entrenudos cortos. Una planta muy alta y espigada ha crecido con poca luz y sufrirá más al trasplantar.",
          "Comprueba el cepellón: debe salir entero del alveolo, con raíces blancas y sin enrollarse en espiral en el fondo.",
        ],
      },
      {
        titulo: "Qué llevarse ahora",
        parrafos: [
          "Tomate, pimiento, berenjena, calabacín, pepino y judía están en su momento óptimo de trasplante en la comarca.",
          "Las aromáticas —albahaca, perejil, romero, tomillo— aguantan bien en maceta y son una buena compañía para el huerto: ayudan a alejar plagas y atraen polinizadores.",
        ],
      },
      {
        titulo: "Los primeros días son los que cuentan",
        parrafos: [
          "Trasplanta a última hora de la tarde, riega abundantemente el mismo día y protege del viento las primeras 48 horas.",
          "Un acolchado ligero de paja o corteza conserva la humedad y evita que el sol recaliente el suelo alrededor del cuello de la planta.",
        ],
      },
    ],
    tags: ["Temporada", "Huerto", "Plantel"],
  },
  {
    id: "curiosidad-polinizadores",
    slug: "curiosidades-sobre-los-polinizadores-del-huerto",
    titulo: "Curiosidades sobre los polinizadores de tu huerto",
    resumen:
      "Sin abejas, abejorros y sírfidos no hay calabacines. Cuatro datos que cambian la forma de mirar a los insectos del huerto.",
    categoria: "Curiosidades",
    imagen: imgCuriosidad,
    autor: "Equipo Jardiper",
    fecha: "2026-04-12",
    minutos: 3,
    entradilla:
      "Un huerto sano se mide también por los bichos que lo visitan. Estas son algunas cosas que nos siguen sorprendiendo de los polinizadores.",
    secciones: [
      {
        titulo: "El abejorro vibra para polinizar",
        parrafos: [
          "El tomate necesita 'polinización por vibración': el abejorro se agarra a la flor y hace vibrar los músculos del vuelo hasta liberar el polen. Las abejas melíferas no saben hacerlo.",
          "Por eso en invernadero se introducen colmenas de abejorros en lugar de abejas.",
        ],
      },
      {
        titulo: "La flor masculina y la femenina del calabacín",
        parrafos: [
          "El calabacín produce flores separadas: si no hay insectos que lleven el polen de una a otra, el fruto cuaja y se pudre a los pocos centímetros.",
          "Con pocos polinizadores puedes polinizar a mano con un pincel a primera hora de la mañana.",
        ],
      },
      {
        titulo: "La lavanda es un imán",
        parrafos: [
          "Plantar lavanda, romero o borraja en los bordes del huerto multiplica las visitas de polinizadores y mejora el cuajado de todo lo que hay alrededor.",
          "Además, los sírfidos que atrae son depredadores voraces de pulgón: sale doble beneficio.",
        ],
      },
    ],
    tags: ["Curiosidades", "Polinizadores", "Biodiversidad"],
  },
];

export function getNoticia(slug: string): Noticia | undefined {
  return noticias.find((n) => n.slug === slug);
}

export function noticiasOrdenadas(): Noticia[] {
  return [...noticias].sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function noticiasRelacionadas(noticia: Noticia, limite = 3): Noticia[] {
  const mismaCategoria = noticiasOrdenadas().filter(
    (n) => n.slug !== noticia.slug && n.categoria === noticia.categoria,
  );
  const resto = noticiasOrdenadas().filter(
    (n) => n.slug !== noticia.slug && n.categoria !== noticia.categoria,
  );
  return [...mismaCategoria, ...resto].slice(0, limite);
}

export function formatearFecha(iso: string, locale = "es-ES"): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
