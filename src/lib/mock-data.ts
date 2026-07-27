// Mock data for Jardiper — reemplazar con datos de la base de datos futura.
// TODO: conectar a Lovable Cloud (Supabase) cuando la BD esté lista.

export type Plant = {
  id: string;
  nombre: string;
  nombreCientifico?: string;
  categoria: "hortícola" | "ornamental" | "árbol" | "arbusto" | "flor";
  imagen: string;
  descripcion: string;
  curiosidades: string;
  enfermedades: { nombre: string; combate: string; imagen?: string }[];
  temporada: string;
  guiaId?: string;
  /** Clave opcional para enlazar con una fila del calendario de cultivo.
   *  Si se omite, se intenta emparejar automáticamente por nombre. */
  calendarioKey?: string;
};

// Imágenes botánicas placeholder (Unsplash CDN)
const img = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const plantasDestacadas: Plant[] = [
  {
    id: "tomate-rosa",
    nombre: "Tomate Rosa de Barbastro",
    nombreCientifico: "Solanum lycopersicum",
    categoria: "hortícola",
    imagen: img("1592841200221-a6898f307baa"),
    descripcion: "Variedad autóctona aragonesa, carnoso, dulce y de gran calibre.",
    curiosidades: "Denominación de Origen protegida en el Somontano; se conserva desde principios del siglo XX.",
    enfermedades: [
      { nombre: "Mildiu", combate: "Tratamientos preventivos con caldo bordelés y buena ventilación.", imagen: img("1591857177580-dc82b9ac4e1e", 400) },
      { nombre: "Araña roja", combate: "Aumentar humedad ambiental y aplicar jabón potásico." },
    ],
    temporada: "Mayo – Septiembre",
  },
  {
    id: "calçot",
    nombre: "Calçot",
    nombreCientifico: "Allium cepa",
    categoria: "hortícola",
    imagen: imgCalcots,
    descripcion: "Cebolla tierna típica del noreste peninsular, ideal para brasa.",
    curiosidades: "Se planta en verano y se cosecha en invierno tras varias 'calzadas' de tierra.",
    enfermedades: [
      { nombre: "Roya", combate: "Rotación de cultivos y azufre en polvo." },
    ],
    temporada: "Noviembre – Marzo",
    guiaId: "cultivar-calçots",
  },
  {
    id: "boniato",
    nombre: "Boniato",
    nombreCientifico: "Ipomoea batatas",
    categoria: "hortícola",
    imagen: imgPlaceholder,
    descripcion: "Tubérculo dulce y nutritivo, se adapta muy bien al clima del Bajo Cinca.",
    curiosidades: "Puede alcanzar hasta 3 kg por planta con riego adecuado.",
    enfermedades: [
      { nombre: "Gusano del boniato", combate: "Trampas de feromonas y suelo bien drenado." },
    ],
    temporada: "Mayo – Octubre",
    guiaId: "plantar-boniatos",
  },
  {
    id: "melocotonero",
    nombre: "Melocotonero",
    nombreCientifico: "Prunus persica",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Árbol frutal emblema del valle del Cinca, floración espectacular.",
    curiosidades: "Fraga celebra cada primavera la 'Floración del Bajo Cinca'.",
    enfermedades: [
      { nombre: "Abolladura", combate: "Tratamiento cuprico en otoño y al inicio de la primavera." },
    ],
    temporada: "Cosecha Junio – Agosto",
    guiaId: "poda-frutales",
  },
  {
    id: "lavanda",
    nombre: "Lavanda",
    nombreCientifico: "Lavandula angustifolia",
    categoria: "flor",
    imagen: img("1595351298020-038700609878"),
    descripcion: "Aromática mediterránea, resistente a la sequía y muy melífera.",
    curiosidades: "Sus flores atraen abejas y ahuyentan mosquitos de manera natural.",
    enfermedades: [{ nombre: "Hongos por exceso de riego", combate: "Suelo bien drenado y riego escaso." }],
    temporada: "Floración Mayo – Julio",
  },
  {
    id: "olivo",
    nombre: "Olivo Empeltre",
    nombreCientifico: "Olea europaea",
    categoria: "árbol",
    imagen: img("1445264718234-a623be589d37"),
    descripcion: "Variedad autóctona del Bajo Aragón, produce aceite virgen extra afrutado.",
    curiosidades: "Puede vivir más de 500 años en las condiciones adecuadas.",
    enfermedades: [{ nombre: "Mosca del olivo", combate: "Trampas cromáticas y tratamientos ecológicos." }],
    temporada: "Todo el año",
  },
  {
    id: "rosal",
    nombre: "Rosal Trepador",
    nombreCientifico: "Rosa spp.",
    categoria: "arbusto",
    imagen: img("1533616688419-b7a585564566"),
    descripcion: "Ornamental clásico, ideal para pérgolas y muros soleados.",
    curiosidades: "Con buena poda puede florecer dos veces al año.",
    enfermedades: [{ nombre: "Oidio", combate: "Azufre mojable y aireación entre plantas." }],
    temporada: "Abril – Octubre",
  },
  {
    id: "adelfa",
    nombre: "Adelfa",
    nombreCientifico: "Nerium oleander",
    categoria: "arbusto",
    imagen: img("1533050487297-09b450131914"),
    descripcion: "Arbusto muy resistente, florece todo el verano incluso en suelos pobres.",
    curiosidades: "Es tóxica al consumo pero muy segura como planta ornamental.",
    enfermedades: [{ nombre: "Cochinilla", combate: "Aceite de neem o jabón potásico." }],
    temporada: "Junio – Septiembre",
  },
  // ── Resto del catálogo hortícola ────────────────────────────────────────────
  // Añadir aquí nuevas variedades: heredan ficha, filtros y calendario
  // automáticamente (por nombre o con `calendarioKey`).
  {
    id: "lechuga-romana",
    nombre: "Lechuga Romana",
    nombreCientifico: "Lactuca sativa var. longifolia",
    categoria: "hortícola",
    imagen: imgLechuga,
    descripcion: "Cogollo alargado y crujiente, la lechuga más cultivada del Bajo Cinca.",
    curiosidades: "Aguanta bien el calor si se riega por la mañana temprano.",
    enfermedades: [
      { nombre: "Mildiu de la lechuga", combate: "Evitar mojar la hoja y airear el marco de plantación." },
      { nombre: "Pulgón", combate: "Jabón potásico y fomento de mariquitas." },
    ],
    temporada: "Todo el año (según variedad)",
    calendarioKey: "Lechuga",
  },
  {
    id: "lechuga-hoja-roble",
    nombre: "Lechuga Hoja de Roble",
    nombreCientifico: "Lactuca sativa var. crispa",
    categoria: "hortícola",
    imagen: imgLechuga,
    descripcion: "Hoja rizada y tierna, en tonos verdes y rojizos. Ideal para corte continuo.",
    curiosidades: "Se puede recolectar hoja a hoja durante varias semanas.",
    enfermedades: [{ nombre: "Botritis", combate: "Riego moderado y buena ventilación." }],
    temporada: "Marzo – Noviembre",
    calendarioKey: "Lechuga",
  },
  {
    id: "lechuga-trocadero",
    nombre: "Lechuga Trocadero",
    nombreCientifico: "Lactuca sativa var. capitata",
    categoria: "hortícola",
    imagen: imgLechuga,
    descripcion: "Cogollo mantecoso de hoja suave, muy apreciada en ensalada.",
    curiosidades: "Es la lechuga tradicional de primavera en los huertos de la zona.",
    enfermedades: [{ nombre: "Caracoles y babosas", combate: "Trampas de cerveza y acolchado seco." }],
    temporada: "Marzo – Octubre",
    calendarioKey: "Lechuga",
  },
  {
    id: "escarola",
    nombre: "Escarola",
    nombreCientifico: "Cichorium endivia",
    categoria: "hortícola",
    imagen: imgLechuga,
    descripcion: "Hoja rizada y amarga, muy resistente al frío del invierno.",
    curiosidades: "Se blanquea atando las hojas unos días antes de cosechar.",
    enfermedades: [{ nombre: "Podredumbre del cuello", combate: "No enterrar el cuello y regar por surco." }],
    temporada: "Septiembre – Febrero",
  },
  {
    id: "coliflor",
    nombre: "Coliflor",
    nombreCientifico: "Brassica oleracea var. botrytis",
    categoria: "hortícola",
    imagen: imgColiflor,
    descripcion: "Pella blanca y compacta, cultivo estrella de otoño e invierno.",
    curiosidades: "Doblar sus propias hojas sobre la pella la mantiene bien blanca.",
    enfermedades: [
      { nombre: "Oruga de la col", combate: "Bacillus thuringiensis y revisión de envés de hoja." },
      { nombre: "Hernia de la col", combate: "Rotación larga y encalado del suelo." },
    ],
    temporada: "Octubre – Marzo",
  },
  {
    id: "brocoli",
    nombre: "Brócoli",
    nombreCientifico: "Brassica oleracea var. italica",
    categoria: "hortícola",
    imagen: imgColiflor,
    descripcion: "Pella verde con rebrotes laterales que alargan la cosecha semanas.",
    curiosidades: "Tras cortar la pella central sigue produciendo brotes pequeños.",
    enfermedades: [{ nombre: "Pulgón ceniciento", combate: "Jabón potásico y eliminación de brotes afectados." }],
    temporada: "Octubre – Marzo",
  },
  {
    id: "col-rizada",
    nombre: "Col Rizada (Kale)",
    nombreCientifico: "Brassica oleracea var. sabellica",
    categoria: "hortícola",
    imagen: imgColesHoja,
    descripcion: "Col de hoja rizada, muy rústica: mejora de sabor tras las primeras heladas.",
    curiosidades: "El frío convierte parte de su almidón en azúcar y la vuelve más dulce.",
    enfermedades: [{ nombre: "Mosca blanca", combate: "Trampas cromáticas amarillas y neem." }],
    temporada: "Octubre – Abril",
  },
  {
    id: "berza",
    nombre: "Berza / Col de Hoja",
    nombreCientifico: "Brassica oleracea var. viridis",
    categoria: "hortícola",
    imagen: imgColesHoja,
    descripcion: "Col de hoja lisa y abierta, cosecha escalonada durante todo el invierno.",
    curiosidades: "Se recolecta hoja a hoja sin arrancar la planta.",
    enfermedades: [{ nombre: "Oruga de la col", combate: "Bacillus thuringiensis en tratamientos semanales." }],
    temporada: "Octubre – Abril",
    calendarioKey: "Col rizada",
  },
  {
    id: "repollo",
    nombre: "Repollo",
    nombreCientifico: "Brassica oleracea var. capitata",
    categoria: "hortícola",
    imagen: imgColesHoja,
    descripcion: "Cogollo apretado de hoja lisa o rizada, conserva muy bien tras la cosecha.",
    curiosidades: "Un repollo bien formado puede pesar más de 3 kg.",
    enfermedades: [{ nombre: "Hernia de la col", combate: "Rotación de cultivos de al menos 4 años." }],
    temporada: "Octubre – Marzo",
  },
  {
    id: "pimiento-italiano",
    nombre: "Pimiento Italiano",
    nombreCientifico: "Capsicum annuum",
    categoria: "hortícola",
    imagen: imgPimiento,
    descripcion: "Pimiento verde alargado y fino, dulce, perfecto para freír.",
    curiosidades: "Si se deja madurar en planta pasa a rojo y gana dulzor.",
    enfermedades: [
      { nombre: "Oidiopsis", combate: "Azufre mojable y evitar exceso de humedad." },
      { nombre: "Trips", combate: "Trampas azules y control biológico." },
    ],
    temporada: "Julio – Octubre",
    calendarioKey: "Pimiento",
  },
  {
    id: "pimiento-morron",
    nombre: "Pimiento Morrón",
    nombreCientifico: "Capsicum annuum",
    categoria: "hortícola",
    imagen: imgPimiento,
    descripcion: "Pimiento carnoso de tres o cuatro cascos, ideal para asar.",
    curiosidades: "Necesita bastante potasio para cuajar frutos grandes y de pared gruesa.",
    enfermedades: [{ nombre: "Podredumbre apical", combate: "Riego regular y aporte de calcio." }],
    temporada: "Julio – Octubre",
    calendarioKey: "Pimiento",
  },
  {
    id: "pimiento-padron",
    nombre: "Pimiento de Padrón",
    nombreCientifico: "Capsicum annuum",
    categoria: "hortícola",
    imagen: imgPimiento,
    descripcion: "Pimiento pequeño para freír, de recolección continua en verano.",
    curiosidades: "Unos pican y otros no: depende del calor y del riego recibido.",
    enfermedades: [{ nombre: "Araña roja", combate: "Humedad ambiental y jabón potásico." }],
    temporada: "Junio – Septiembre",
    calendarioKey: "Pimiento",
  },
  {
    id: "berenjena",
    nombre: "Berenjena",
    nombreCientifico: "Solanum melongena",
    categoria: "hortícola",
    imagen: imgBerenjena,
    descripcion: "Fruto morado y brillante, muy productiva con calor y riego constante.",
    curiosidades: "Es pariente directa del tomate y del pimiento: no conviene plantarlas seguidas.",
    enfermedades: [
      { nombre: "Araña roja", combate: "Aumentar humedad y aplicar azufre o neem." },
      { nombre: "Verticilosis", combate: "Rotación de cultivos y suelo bien drenado." },
    ],
    temporada: "Julio – Octubre",
  },
  {
    id: "calabacin",
    nombre: "Calabacín",
    nombreCientifico: "Cucurbita pepo",
    categoria: "hortícola",
    imagen: imgCalabacin,
    descripcion: "Planta muy productiva: en plena temporada se recolecta cada dos días.",
    curiosidades: "Necesita polinizadores; sin abejas muchos frutos se quedan sin cuajar.",
    enfermedades: [{ nombre: "Oidio", combate: "Azufre mojable y retirar hojas muy afectadas." }],
    temporada: "Junio – Septiembre",
    guiaId: "polinizacion-calabacines",
  },
  {
    id: "pepino",
    nombre: "Pepino",
    nombreCientifico: "Cucumis sativus",
    categoria: "hortícola",
    imagen: imgPepino,
    descripcion: "Cultivo trepador de crecimiento rápido, agradece emparrado y sombreo suave.",
    curiosidades: "Entutorado en vertical da frutos más rectos y sanos.",
    enfermedades: [{ nombre: "Mildiu", combate: "Riego por goteo y buena ventilación." }],
    temporada: "Junio – Septiembre",
  },
  {
    id: "acelga",
    nombre: "Acelga",
    nombreCientifico: "Beta vulgaris var. cicla",
    categoria: "hortícola",
    imagen: imgAcelga,
    descripcion: "Hortaliza rústica de corte continuo, produce casi todo el año.",
    curiosidades: "De una misma planta se pueden cortar hojas durante varios meses.",
    enfermedades: [{ nombre: "Minador de la hoja", combate: "Retirar hojas afectadas y usar malla antiinsectos." }],
    temporada: "Todo el año",
  },
  {
    id: "espinaca",
    nombre: "Espinaca",
    nombreCientifico: "Spinacia oleracea",
    categoria: "hortícola",
    imagen: imgAcelga,
    descripcion: "Cultivo de hoja rápido y de clima fresco, perfecto para otoño e invierno.",
    curiosidades: "Con calor se sube a flor enseguida: mejor sembrarla fuera del verano.",
    enfermedades: [{ nombre: "Mildiu", combate: "Variedades resistentes y marcos amplios." }],
    temporada: "Octubre – Marzo",
  },
  {
    id: "cebolla",
    nombre: "Cebolla",
    nombreCientifico: "Allium cepa",
    categoria: "hortícola",
    imagen: imgCebollaPuerro,
    descripcion: "Cebolla de bulbo para conservación, en variedades dulces y de guarda.",
    curiosidades: "Se cura al sol unos días tras arrancarla para que aguante meses.",
    enfermedades: [{ nombre: "Mildiu de la cebolla", combate: "Rotación y tratamientos cúpricos preventivos." }],
    temporada: "Junio – Septiembre",
  },
  {
    id: "puerro",
    nombre: "Puerro",
    nombreCientifico: "Allium ampeloprasum",
    categoria: "hortícola",
    imagen: imgCebollaPuerro,
    descripcion: "Se aporca con tierra para conseguir un tallo blanco largo y tierno.",
    curiosidades: "Resiste heladas fuertes y puede quedarse en tierra hasta su uso.",
    enfermedades: [{ nombre: "Roya del puerro", combate: "Marcos amplios y evitar exceso de nitrógeno." }],
    temporada: "Octubre – Marzo",
  },
  {
    id: "ajo",
    nombre: "Ajo",
    nombreCientifico: "Allium sativum",
    categoria: "hortícola",
    imagen: imgCebollaPuerro,
    descripcion: "Se planta en otoño diente a diente y se cosecha a principios de verano.",
    curiosidades: "El dicho local: por San Antón, el ajo en el terrón.",
    enfermedades: [{ nombre: "Roya", combate: "Rotación de cultivos y azufre en polvo." }],
    temporada: "Junio – Julio",
  },
  {
    id: "zanahoria",
    nombre: "Zanahoria",
    nombreCientifico: "Daucus carota",
    categoria: "hortícola",
    imagen: imgRaices,
    descripcion: "Raíz dulce y crujiente; pide suelo suelto, mullido y sin piedras.",
    curiosidades: "Sembrada junto a la cebolla se ahuyentan mutuamente sus moscas.",
    enfermedades: [{ nombre: "Mosca de la zanahoria", combate: "Malla antiinsectos y siembras escalonadas." }],
    temporada: "Todo el año (según siembra)",
  },
  {
    id: "rabano",
    nombre: "Rábano",
    nombreCientifico: "Raphanus sativus",
    categoria: "hortícola",
    imagen: imgRaices,
    descripcion: "El cultivo más rápido del huerto: listo en apenas un mes.",
    curiosidades: "Perfecto para intercalar entre cultivos lentos y aprovechar espacio.",
    enfermedades: [{ nombre: "Pulguilla", combate: "Riego frecuente y malla fina." }],
    temporada: "Marzo – Noviembre",
  },
  {
    id: "judia-verde",
    nombre: "Judía Verde",
    nombreCientifico: "Phaseolus vulgaris",
    categoria: "hortícola",
    imagen: imgLegumbres,
    descripcion: "En mata baja o de enrame; fija nitrógeno y mejora el suelo.",
    curiosidades: "Recolectada joven y a menudo, la planta produce mucho más tiempo.",
    enfermedades: [{ nombre: "Roya de la judía", combate: "Airear el emparrado y evitar mojar la hoja." }],
    temporada: "Junio – Septiembre",
  },
  {
    id: "guisante",
    nombre: "Guisante",
    nombreCientifico: "Pisum sativum",
    categoria: "hortícola",
    imagen: imgLegumbres,
    descripcion: "Leguminosa de invierno y primavera, agradece un pequeño entutorado.",
    curiosidades: "Como todas las leguminosas, deja el suelo enriquecido para el cultivo siguiente.",
    enfermedades: [{ nombre: "Oidio", combate: "Siembras tempranas y azufre mojable." }],
    temporada: "Abril – Junio",
    calendarioKey: "Habas",
  },
  {
    id: "haba",
    nombre: "Haba",
    nombreCientifico: "Vicia faba",
    categoria: "hortícola",
    imagen: imgLegumbres,
    descripcion: "Siembra otoñal, cosecha de primavera. Muy rústica y agradecida.",
    curiosidades: "Despuntar la planta en floración reduce mucho el ataque de pulgón negro.",
    enfermedades: [{ nombre: "Pulgón negro", combate: "Despunte de brotes tiernos y jabón potásico." }],
    temporada: "Abril – Mayo",
    calendarioKey: "Habas",
  },
  {
    id: "apio",
    nombre: "Apio",
    nombreCientifico: "Apium graveolens",
    categoria: "hortícola",
    imagen: imgAcelga,
    descripcion: "Pencas aromáticas y crujientes; exige riego constante y suelo rico.",
    curiosidades: "Su aroma ayuda a despistar plagas de las coles vecinas.",
    enfermedades: [{ nombre: "Septoriosis", combate: "Rotación y eliminación de hojas manchadas." }],
    temporada: "Septiembre – Enero",
  },
  {
    id: "fresa",
    nombre: "Fresa",
    nombreCientifico: "Fragaria × ananassa",
    categoria: "hortícola",
    imagen: imgFresa,
    descripcion: "Planta perenne de fruto rojo; ideal en mesa de cultivo, maceta o bancal.",
    curiosidades: "Sus estolones dan plantas nuevas gratis cada temporada.",
    enfermedades: [{ nombre: "Botritis", combate: "Acolchado de paja para que el fruto no toque el suelo." }],
    temporada: "Abril – Junio",
  },
];


export const plantasHortícolas = plantasDestacadas.filter((p) => p.categoria === "hortícola");
export const plantasOrnamentales = plantasDestacadas.filter((p) =>
  ["árbol", "arbusto", "flor", "ornamental"].includes(p.categoria),
);

export const temporadaActual: Plant[] = plantasDestacadas.slice(0, 6);

// Calendario hortícola — filas plantas, columnas meses (S = siembra, T = trasplante, C = cosecha)
export type MesEstado = "S" | "T" | "C" | "SC" | "";
export const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export const calendario: { planta: string; meses: MesEstado[] }[] = [
  { planta: "Tomate",       meses: ["", "S", "S", "T", "T", "C", "C", "C", "C", "", "", ""] },
  { planta: "Pimiento",     meses: ["", "S", "S", "T", "T", "", "C", "C", "C", "C", "", ""] },
  { planta: "Calabacín",    meses: ["", "", "S", "T", "T", "C", "C", "C", "C", "", "", ""] },
  { planta: "Lechuga",      meses: ["S", "S", "S", "T", "C", "C", "", "S", "T", "C", "C", ""] },
  { planta: "Boniato",      meses: ["", "", "", "S", "T", "T", "", "", "", "C", "C", ""] },
  { planta: "Calçot",       meses: ["", "", "", "", "", "", "S", "S", "T", "T", "C", "C"] },
  { planta: "Ajo",          meses: ["", "", "", "", "", "C", "C", "", "", "S", "S", ""] },
  { planta: "Cebolla",      meses: ["S", "S", "T", "T", "", "C", "C", "C", "", "S", "S", ""] },
  { planta: "Zanahoria",    meses: ["", "S", "S", "S", "C", "C", "C", "S", "S", "C", "C", ""] },
  { planta: "Habas",        meses: ["", "", "", "C", "C", "", "", "", "", "S", "S", "S"] },
  { planta: "Judía verde",  meses: ["", "", "", "S", "S", "C", "C", "C", "C", "", "", ""] },
  { planta: "Espinaca",     meses: ["C", "C", "S", "", "", "", "", "", "S", "S", "C", "C"] },
];

export type GuiaSection = {
  titulo?: string;
  parrafos: string[];
};

export type Guia = {
  id: string;
  slug: string;
  titulo: string;
  resumen: string;
  minutos: number;
  categoria: "Huerto" | "Jardín" | "Sustratos" | "Compost" | "Frutales";
  imagen: string;
  contenido: string;
  secciones: GuiaSection[];
  pdfUrl: string;
  tags: string[];
  fechaPublicacion: string;
  relacionados?: string[];
};

import pdfBoniatos from "@/assets/guias/plantar-boniatos.pdf.asset.json";
import pdfCalcots from "@/assets/guias/cultivar-calcots.pdf.asset.json";
import pdfCalabacines from "@/assets/guias/polinizacion-calabacines.pdf.asset.json";
import pdfPoda from "@/assets/guias/poda-frutales.pdf.asset.json";
import imgCalendarioPrimavera from "@/assets/guias/calendario-primavera.jpg";
import imgSustratos from "@/assets/guias/sustratos.jpg";
import imgCompostaje from "@/assets/guias/compostaje.jpg";
import imgCalcots from "@/assets/guias/calcots.jpg";
import imgPlaceholder from "@/assets/placeholder/under-construction-wide.jpg";



export const guias: Guia[] = [
  {
    id: "calendario-primavera",
    slug: "calendario-primavera",
    titulo: "Calendario de siembra de primavera",
    resumen: "Qué sembrar y trasplantar en marzo, abril y mayo en el Bajo Cinca.",
    minutos: 5,
    categoria: "Huerto",
    imagen: imgCalendarioPrimavera,
    contenido:
      "La primavera es la temporada de mayor actividad en el huerto. Aprovecha las subidas de temperatura para sembrar de forma escalonada y asegurar cosechas continuas.",
    secciones: [
      {
        titulo: "Marzo: arranca el semillero",
        parrafos: [
          "En el Bajo Cinca, marzo suele ser suficientemente templado para iniciar semilleros de tomate, pimiento, berenjena y calabacín bajo cubierto o en invernadero casero.",
          "También puedes sembrar directamente al aire libre: espinacas, lechugas, rábanos, zanahorias y habas. La clave es esperar a que el suelo no esté encharcado tras las lluvias de invierno.",
        ],
      },
      {
        titulo: "Abril: trasplantes y siembras directas",
        parrafos: [
          "Abril es el mes ideal para trasplantar a campo abierto las plantas de tomate y pimiento que germinaron en febrero-marzo, siempre que pasen las heladas tardías.",
          "Siembra directa de judías verdes, pepino, calabacín y maíz dulce. Recuerda dejar la distancia adecuada entre plantas para favorecer la ventilación y reducir hongos.",
        ],
      },
      {
        titulo: "Mayo: el huerto a pleno rendimiento",
        parrafos: [
          "En mayo se trasplantan los últimos tomates, pimientos y berenjenas, y se siembran boniato y alubias. Es momento también de tutorar y de empezar a podar los tomates de rama.",
          "Mantén un riego regular y aplica un acolchado natural para conservar humedad y evitar que el suelo se recaliente con los primeros días de calor.",
        ],
      },
    ],
    pdfUrl: "",
    tags: ["Huerto", "Calendario", "Primavera"],
    fechaPublicacion: "2025-03-15",
    relacionados: ["tomates-bajo-cinca", "plantar-boniatos"],
  },
  {
    id: "tomates-bajo-cinca",
    slug: "tomates-bajo-cinca",
    titulo: "Cómo plantar tomates en el Bajo Cinca",
    resumen: "Consejos de siembra, tutorado y prevención de mildiu para la variedad reina del huerto.",
    minutos: 7,
    categoria: "Huerto",
    imagen: img("1592841200221-a6898f307baa"),
    contenido:
      "El tomate es el cultivo estrella del verano en el Bajo Cinca. Con unos cuidados sencillos puedes conseguir cosechas abundantes desde julio hasta octubre.",
    secciones: [
      {
        titulo: "Elige la variedad y el momento",
        parrafos: [
          "Las variedades locales como el Tomate Rosa de Barbastro se adaptan perfectamente al clima semiárido de la zona. Si buscas producción temprana, opta por variedades cherry o ensalada de ciclo corto.",
          "Siembra en semillero a finales de febrero o principios de marzo, y trasplanta a campo abierto entre mediados de abril y principios de mayo, según el riesgo de heladas.",
        ],
      },
      {
        titulo: "Suelo, riego y tutorado",
        parrafos: [
          "El tomate prefiere suelos francos, bien drenados y con mucho sol. Aporta compost maduro en el fondo del hoyo y evita el estiércol fresco, que favorece el mildiu.",
          "Riega por la base sin mojar el follaje y tutora las ramas principales para mejorar la ventilación. Un riego profundo cada 3-4 días es mejor que gotas diarias.",
        ],
      },
      {
        titulo: "Prevención de enfermedades",
        parrafos: [
          "El mildiu es el principal problema en veranos húmedos. Previene con caldo bordelés, buena ventilación y evitando el riego por encima de las hojas.",
          "Retira las hojas inferiores enfermas y aplica un refuerzo de potasio cuando empiecen a cuajar los frutos para mejorar el sabor y la resistencia.",
        ],
      },
    ],
    pdfUrl: "",
    tags: ["Huerto", "Hortalizas", "Verano"],
    fechaPublicacion: "2025-04-02",
    relacionados: ["calendario-primavera", "polinizacion-calabacines"],
  },
  {
    id: "plantar-boniatos",
    slug: "plantar-boniatos",
    titulo: "Cómo plantar boniatos en el Bajo Cinca",
    resumen: "Prepara los esquejes, elige el momento y consigue una cosecha abundante.",
    minutos: 6,
    categoria: "Huerto",
    imagen: img("1518977676601-b53f82aba655"),
    contenido:
      "El boniato prefiere suelos sueltos y soleados. Prepara caballones de 30 cm y planta los esquejes en mayo cuando el suelo supere los 18°C.",
    secciones: [
      {
        titulo: "Preparación del esqueje",
        parrafos: [
          "Germina un boniato grande en un recipiente con agua a principios de abril. Cuando broten los vástagos, sepáralos con cuidado y deja que echen raíces en agua o en un sustrato muy suelto.",
          "Los esquejes deben tener al menos 20 cm de longitud y varios nudos antes de plantarlos en campo abierto.",
        ],
      },
      {
        titulo: "Plantación y cuidados",
        parrafos: [
          "En el Bajo Cinca, la fecha ideal de plantación es mediados de mayo, cuando el suelo ya no baja de los 18°C. Prepara caballones de unos 30 cm de altura para facilitar el drenaje.",
          "Riega con frecuencia los primeros 20 días para ayudar al enraizamiento. Después, reduce el riego: el boniato prefiere sequedad moderada para formar tubérculos grandes.",
        ],
      },
      {
        titulo: "Cosecha",
        parrafos: [
          "La cosecha se realiza entre octubre y noviembre, antes de que lleguen las primeras heladas. Saca las plantas con horquilla para no dañar los tubérculos.",
          "Deja los boniatos a la sombra unos días para curar la piel y mejorar su conservación durante el invierno.",
        ],
      },
    ],
    pdfUrl: pdfBoniatos.url,
    tags: ["Huerto", "Hortalizas", "Temporada"],
    fechaPublicacion: "2025-05-10",
    relacionados: ["tomates-bajo-cinca", "calendario-primavera"],
  },
  {
    id: "cultivar-calçots",
    slug: "cultivar-calçots",
    titulo: "El arte de cultivar calçots",
    resumen: "Del semillero al brasero: la técnica tradicional de las 'calzadas'.",
    minutos: 8,
    categoria: "Huerto",
    imagen: imgCalcots,
    contenido:
      "Los calçots nacen de cebollas blancas plantadas en verano. La clave está en 'calzar' con tierra el tallo cada pocas semanas para que crezca blanco y tierno.",
    secciones: [
      {
        titulo: "Siembra y primeras calzadas",
        parrafos: [
          "Planta cebollas blancas de tamaño medio a finales de julio o principios de agosto, con un marco de 15-20 cm entre plantas. Riega bien durante el primer mes.",
          "A finales de septiembre realiza la primera 'calzada': apila tierra alrededor del tallo hasta cubrir dos tercios de la planta. Esto estimula el alargamiento del cuello.",
        ],
      },
      {
        titulo: "Crecimiento invernal",
        parrafos: [
          "Repite la calzada cada 3-4 semanas hasta dejar solo la punta de las hojas visible. Usa tierra suelta y evita enterrar el cogollo, que podría pudrirse.",
          "Durante el invierno, reduce el riego y controla la roya con azufre en polvo si aparecen manchas en las hojas.",
        ],
      },
      {
        titulo: "Cosecha y conservación",
        parrafos: [
          "Cosecha de noviembre a marzo, cuando el tallo tenga el grosor de un dedo. Arranca la planta completa, retira las raíces y conserva los calçots frescos en un lugar oscuro.",
          "Si la cosecha es abundante, puedes conservarlos verticalmente en cajas con un poco de humedad durante varias semanas.",
        ],
      },
    ],
    pdfUrl: pdfCalcots.url,
    tags: ["Huerto", "Tradicional", "Invierno"],
    fechaPublicacion: "2024-11-20",
    relacionados: ["poda-frutales", "compostaje-domestico"],
  },
  {
    id: "polinizacion-calabacines",
    slug: "polinizacion-calabacines",
    titulo: "Polinización manual de calabacines",
    resumen: "Cuando faltan abejas, un pincel y cinco minutos aseguran la cosecha.",
    minutos: 4,
    categoria: "Huerto",
    imagen: img("1610348725531-843dff563e2c"),
    contenido:
      "Identifica flores macho (tallo fino y largo) y hembra (con calabacín pequeño en la base). Con un pincel suave transfiere el polen del macho a la hembra a primera hora de la mañana.",
    secciones: [
      {
        titulo: "Identifica las flores",
        parrafos: [
          "Las flores masculinas tienen un tallo largo y delgado y no llevan fruto en la base. Las femeninas presentan un pequeño calabacín en la base del pétalo y un tallo más corto.",
          "Ambas flores se abren al amanecer y solo duran unas horas, por lo que la polinización manual debe hacerse temprano.",
        ],
      },
      {
        titulo: "Técnica paso a paso",
        parrafos: [
          "Desprende con cuidado una flor macho y retira los pétalos para dejar al descubierto el estambre cargado de polen. Frota suavemente el estambre sobre el pistilo de la flor hembra.",
          "Si prefieres no dañar la flor macho, usa un pincel fino o un bastoncillo de algodón para recoger el polen y transferirlo. Repite cada 2-3 días mientras haya flores abiertas.",
        ],
      },
    ],
    pdfUrl: pdfCalabacines.url,
    tags: ["Huerto", "Técnicas", "Verano"],
    fechaPublicacion: "2024-07-08",
    relacionados: ["tomates-bajo-cinca", "calendario-primavera"],
  },
  {
    id: "poda-frutales",
    slug: "poda-frutales",
    titulo: "Poda invernal de frutales",
    resumen: "Cuándo, cómo y con qué herramientas trabajar tus melocotoneros y perales.",
    minutos: 7,
    categoria: "Frutales",
    imagen: img("1548613053-22087dd8edb8"),
    contenido:
      "La poda se realiza entre diciembre y febrero, en días sin heladas. Elimina ramas cruzadas, chupones y madera muerta.",
    secciones: [
      {
        titulo: "El momento correcto",
        parrafos: [
          "La poda de frutales de hoja caduca se realiza durante el reposo vegetativo, entre diciembre y febrero. Elige días secos y sin heladas para evitar daños en los cortes.",
          "En melocotoneros y albaricoqueros, la poda es especialmente importante porque fructifican sobre madera de un año.",
        ],
      },
      {
        titulo: "Herramientas e higiene",
        parrafos: [
          "Utiliza tijeras de podar afiladas, serrucho para ramas gruesas y pasta cicatrizante para cortes mayores a 2 cm de diámetro. La limpieza evita la transmisión de enfermedades.",
          "Desinfecta las herramientas con alcohol o lejía diluida entre árbol y árbol, especialmente si has cortado madera enferma.",
        ],
      },
      {
        titulo: "Qué eliminar y qué conservar",
        parrafos: [
          "Retira ramas muertas, enfermas, cruzadas o que crezcan hacia el interior de la copa. Suprime los chupones que nacen del tronco y las ramas principales.",
          "Mantén una estructura abierta que permita el paso de la luz y el aire. Así reduces el riesgo de hongos y mejoras la maduración de los frutos.",
        ],
      },
    ],
    pdfUrl: pdfPoda.url,
    tags: ["Frutales", "Jardín", "Invierno"],
    fechaPublicacion: "2025-01-12",
    relacionados: ["compostaje-domestico", "cultivar-calçots"],
  },
  {
    id: "sustrato-universal-vs-especifico",
    slug: "sustrato-universal-vs-especifico",
    titulo: "Elegir sustrato: tierra universal vs. específica",
    resumen: "Cuándo vale la pena una mezcla general y cuándo necesitas una formulación especializada.",
    minutos: 5,
    categoria: "Sustratos",
    imagen: imgSustratos,
    contenido:
      "La tierra universal es versátil, pero cada cultivo tiene necesidades diferentes. Conocer cuándo usar un sustrato específico marca la diferencia entre una planta que sobrevive y otra que prospera.",
    secciones: [
      {
        titulo: "Tierra universal: el comodín",
        parrafos: [
          "La tierra universal está formulada para un uso general: macetas de interior, jardineras, trasplantes de temporada y plantas no exigentes. Suele contener turba, compost y perlita en proporciones equilibradas.",
          "Es una buena opción cuando no sabes exactamente qué necesita la planta o cuando cultivas especies poco exigentes en maceta.",
        ],
      },
      {
        titulo: "Sustratos específicos",
        parrafos: [
          "Los cactus y suculentas necesitan mezclas muy drenantes con arena gruesa o pomice. Los geranios y plantas de flor de verano agradecen sustratos con más nutrientes de liberación gradual.",
          "Para el huerto urbano, elige sustratos ricos en materia orgánica y con buen drenaje. Para semilleros, usa mezclas finas y esterilizadas que faciliten la germinación.",
        ],
      },
      {
        titulo: "Consejo de Jardiper",
        parrafos: [
          "Si vas a mantener una planta en maceta más de un año, invierte en un sustrato de calidad. A la larga, un buen sustrato reduce problemas de riego, enfermedades y carencias nutricionales.",
          "Recuerda que el sustrato no es tierra del jardín envasada: está diseñado para aportar aireación, retención de agua y nutrientes en el equilibrio adecuado.",
        ],
      },
    ],
    pdfUrl: "",
    tags: ["Sustratos", "Macetas", "Consejo"],
    fechaPublicacion: "2025-02-28",
    relacionados: ["compostaje-domestico", "tomates-bajo-cinca"],
  },
  {
    id: "compostaje-domestico",
    slug: "compostaje-domestico",
    titulo: "Compostaje doméstico paso a paso",
    resumen: "Convierte los restos de cocina y jardín en compost rico para tus plantas.",
    minutos: 6,
    categoria: "Compost",
    imagen: imgCompostaje,
    contenido:
      "El compostaje es una de las prácticas más sencillas y efectivas para cerrar el ciclo de materia orgánica en casa. Con un poco de equilibrio obtendrás un abono excelente.",
    secciones: [
      {
        titulo: "Elige el compostador",
        parrafos: [
          "Puedes usar una compostadora cerrada, un cubo con tapa o una pila abierta en el jardín. Lo importante es que permita la entrada de aire y que puedas remover el contenido de vez en cuando.",
          "En balcones o terrazas pequeñas existen compostadoras de lombrices (vermicompostaje) compactas y sin olores.",
        ],
      },
      {
        titulo: "Equilibrio verde y marrón",
        parrafos: [
          "Los materiales verdes (restos de fruta, verdura, césped recién cortado) aportan nitrógeno y humedad. Los marrones (hojas secas, cartón, viruta) aportan carbono y estructura.",
          "Intenta mantener una proporción aproximada de 2 a 3 partes de marrón por cada parte de verde. Si huele mal o está muy húmedo, añade más material seco.",
        ],
      },
      {
        titulo: "Mantenimiento y uso",
        parrafos: [
          "Remueve la pila cada 2-4 semanas para aportar oxígeno y acelerar la descomposición. En 3-6 meses tendrás compost maduro: oscuro, con olor a tierra y sin restos reconocibles.",
          "Utiliza el compost para enriquecer el suelo del huerto, como capa de mantillo en macetas o para preparar semilleros mezclado con sustrato universal.",
        ],
      },
    ],
    pdfUrl: "",
    tags: ["Compost", "Sostenible", "Huerto"],
    fechaPublicacion: "2025-06-05",
    relacionados: ["sustrato-universal-vs-especifico", "calendario-primavera"],
  },
];

export const familia = [
  { nombre: "Antonio Peralta", rol: "Fundador — 1974", bio: "Hijo de agricultores, transformó la horticultura tradicional en un vivero de referencia." },
  { nombre: "María Peralta", rol: "Gerente", bio: "Segunda generación. Especialista en ornamentales y sustratos." },
  { nombre: "Jordi Peralta", rol: "Responsable de Huerto", bio: "Tercera generación. Coordina las variedades autóctonas y el calendario hortícola." },
  { nombre: "Laura Peralta", rol: "Comunicación y Libro de Campo", bio: "Impulsa la digitalización del vivero y las guías de cultivo." },
];
// ── Calendario de cultivo por planta ──────────────────────────────────────────
// Pensado para escalar: al añadir una planta nueva al catálogo basta con que su
// nombre contenga (o empiece por) el nombre de una fila del `calendario`, o bien
// con indicar `calendarioKey` en la ficha de la planta.

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export type FilaCalendario = { planta: string; meses: MesEstado[] };

/** Devuelve la fila del calendario que corresponde a una planta del catálogo. */
export function getCalendarioPlanta(planta: Plant): FilaCalendario | undefined {
  const clave = normalizar(planta.calendarioKey ?? planta.nombre);
  const filas = calendario.map((f) => ({ fila: f, key: normalizar(f.planta) }));

  return (
    filas.find((f) => f.key === clave)?.fila ??
    filas.find((f) => clave.startsWith(f.key) || clave.includes(` ${f.key} `))?.fila ??
    filas.find((f) => clave.includes(f.key))?.fila
  );
}

export const leyendaCalendario: { codigo: Exclude<MesEstado, "">; etiqueta: string }[] = [
  { codigo: "S", etiqueta: "Siembra" },
  { codigo: "T", etiqueta: "Trasplante" },
  { codigo: "C", etiqueta: "Cosecha" },
  { codigo: "SC", etiqueta: "Siembra y cosecha" },
];

// ── Filtros por mes / rango de meses ──────────────────────────────────────────
// Escalable: cualquier planta nueva del catálogo se filtra automáticamente en
// cuanto tenga (o empareje con) una fila del `calendario`.

export type Actividad = "S" | "T" | "C";

export const actividadesLabel: Record<Actividad, string> = {
  S: "Siembra",
  T: "Trasplante",
  C: "Cosecha",
};

/** Índices de meses (0-11) del rango, admitiendo rangos que cruzan el año. */
export function mesesEnRango(desde: number, hasta: number): number[] {
  const out: number[] = [];
  let i = desde;
  for (let n = 0; n < 12; n++) {
    out.push(i);
    if (i === hasta) break;
    i = (i + 1) % 12;
  }
  return out;
}

function expandir(estado: MesEstado): Actividad[] {
  if (estado === "SC") return ["S", "C"];
  if (estado === "S" || estado === "T" || estado === "C") return [estado];
  return [];
}

/** Actividades de cultivo de una planta dentro de un rango de meses. */
export function actividadesEnRango(planta: Plant, desde: number, hasta: number): Actividad[] {
  const fila = getCalendarioPlanta(planta);
  if (!fila) return [];
  const set = new Set<Actividad>();
  for (const i of mesesEnRango(desde, hasta)) {
    for (const a of expandir(fila.meses[i] ?? "")) set.add(a);
  }
  return (["S", "T", "C"] as Actividad[]).filter((a) => set.has(a));
}
