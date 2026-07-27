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
    imagen: img("1595855759920-86582396756a"),
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
    imagen: img("1596097635121-14b38c5d7a55"),
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
    imagen: img("1591209627517-d3f36a35c8d5"),
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


export const guias: Guia[] = [
  {
    id: "calendario-primavera",
    slug: "calendario-primavera",
    titulo: "Calendario de siembra de primavera",
    resumen: "Qué sembrar y trasplantar en marzo, abril y mayo en el Bajo Cinca.",
    minutos: 5,
    categoria: "Huerto",
    imagen: img("1464226182882-8de1a7131070"),
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
    imagen: img("1615485499420-6d47c0cd5da5"),
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
    imagen: img("1615816760367-3c1b8b3e0a2b"),
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
    imagen: img("1466694457118-15e921e5b6e0"),
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