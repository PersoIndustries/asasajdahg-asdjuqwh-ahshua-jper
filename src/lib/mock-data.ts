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

export type Guia = {
  id: string;
  titulo: string;
  resumen: string;
  minutos: number;
  categoria: string;
  imagen: string;
  contenido: string;
};

export const guias: Guia[] = [
  {
    id: "plantar-boniatos",
    titulo: "Cómo plantar boniatos en el Bajo Cinca",
    resumen: "Prepara los esquejes, elige el momento y consigue una cosecha abundante.",
    minutos: 6,
    categoria: "Huerto",
    imagen: img("1518977676601-b53f82aba655"),
    contenido:
      "El boniato prefiere suelos sueltos y soleados. Prepara caballones de 30 cm y planta los esquejes en mayo cuando el suelo supere los 18°C. Riego constante los primeros 20 días, luego espaciado. Cosecha antes de las primeras heladas, en octubre.",
  },
  {
    id: "cultivar-calçots",
    titulo: "El arte de cultivar calçots",
    resumen: "Del semillero al brasero: la técnica tradicional de las 'calzadas'.",
    minutos: 8,
    categoria: "Huerto",
    imagen: img("1615485499420-6d47c0cd5da5"),
    contenido:
      "Los calçots nacen de cebollas blancas plantadas en verano. La clave está en 'calzar' con tierra el tallo cada pocas semanas para que crezca blanco y tierno. Se cosechan de noviembre a marzo, cuando alcanzan un dedo de grosor.",
  },
  {
    id: "polinizacion-calabacines",
    titulo: "Polinización manual de calabacines",
    resumen: "Cuando faltan abejas, un pincel y cinco minutos aseguran la cosecha.",
    minutos: 4,
    categoria: "Huerto",
    imagen: img("1610348725531-843dff563e2c"),
    contenido:
      "Identifica flores macho (tallo fino y largo) y hembra (con calabacín pequeño en la base). Con un pincel suave transfiere el polen del macho a la hembra a primera hora de la mañana. Repite cada 2-3 días.",
  },
  {
    id: "poda-frutales",
    titulo: "Poda invernal de frutales",
    resumen: "Cuándo, cómo y con qué herramientas trabajar tus melocotoneros y perales.",
    minutos: 7,
    categoria: "Jardín",
    imagen: img("1548613053-22087dd8edb8"),
    contenido:
      "La poda se realiza entre diciembre y febrero, en días sin heladas. Elimina ramas cruzadas, chupones y madera muerta. Sella cortes grandes con pasta cicatrizante y desinfecta las tijeras entre árbol y árbol.",
  },
];

export const familia = [
  { nombre: "Antonio Peralta", rol: "Fundador — 1974", bio: "Hijo de agricultores, transformó la horticultura tradicional en un vivero de referencia." },
  { nombre: "María Peralta", rol: "Gerente", bio: "Segunda generación. Especialista en ornamentales y sustratos." },
  { nombre: "Jordi Peralta", rol: "Responsable de Huerto", bio: "Tercera generación. Coordina las variedades autóctonas y el calendario hortícola." },
  { nombre: "Laura Peralta", rol: "Comunicación y Libro de Campo", bio: "Impulsa la digitalización del vivero y las guías de cultivo." },
];