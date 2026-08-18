// Mock data for Jardiper — reemplazar con datos de la base de datos futura.
// TODO: conectar a Lovable Cloud (Supabase) cuando la BD esté lista.

import imgLechuga from "@/assets/horticolas/lechuga.jpg";
import imgColiflor from "@/assets/horticolas/coliflor.jpg";
import imgColesHoja from "@/assets/horticolas/coles-hoja.jpg";
import imgPimiento from "@/assets/horticolas/pimiento.jpg";
import imgBerenjena from "@/assets/horticolas/berenjena.jpg";
import imgCalabacin from "@/assets/horticolas/calabacin.jpg";
import imgPepino from "@/assets/horticolas/pepino.jpg";
import imgAcelga from "@/assets/horticolas/acelga-espinaca.jpg";
import imgCebollaPuerro from "@/assets/horticolas/cebolla-puerro.jpg";
import imgRaices from "@/assets/horticolas/raices.jpg";
import imgLegumbres from "@/assets/horticolas/legumbres.jpg";
import imgFresa from "@/assets/horticolas/fresa.jpg";
import imgRomero from "@/assets/aromaticas/romero.jpg";
import imgAlbahaca from "@/assets/aromaticas/albahaca.jpg";
import imgTomilloMenta from "@/assets/aromaticas/tomillo-menta.jpg";

/** Ficha de una plaga o enfermedad ya resuelta para mostrar en el catálogo. */
export type PlagaFicha = {
  id?: string;
  nombre: string;
  descripcion?: string;
  prevencion?: string;
  combate?: string;
  otrosDatos?: string;
  imagen: string;
};

export type Plant = {
  id: string;
  nombre: string;
  nombreCientifico?: string;
  categoria: "hortícola" | "ornamental" | "árbol" | "arbusto" | "flor" | "aromática" | "frutal";
  imagen: string;
  descripcion: string;
  curiosidades: string;
  /** Uso culinario: cómo se come / cómo se prepara. */
  comoSeCome?: string;
  enfermedades: { nombre: string; combate: string; imagen?: string }[];
  /** Plagas del catálogo global asociadas a esta planta (base de datos). */
  plagas?: PlagaFicha[];
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
    id: "tomate",
    nombre: "Tomate",
    nombreCientifico: "Solanum lycopersicum",
    categoria: "hortícola",
    imagen: img("1592841200221-a6898f307baa"),
    descripcion: "Todas nuestras variedades de tomate: Rosa de Barbastro, pera, cherry, RAF, corazón de buey y de colgar.",
    curiosidades: "El Rosa de Barbastro es la variedad autóctona más apreciada del Somontano; se conserva desde principios del siglo XX.",
    comoSeCome:
      "En crudo en ensalada, en tostada, asado, en salsa lenta o en conserva. Las variedades de colgar aguantan meses en fresco.",
    enfermedades: [{ nombre: "Mildiu", combate: "Tratamientos preventivos con caldo bordelés y buena ventilación." }, { nombre: "Araña roja", combate: "Aumentar humedad ambiental y aplicar jabón potásico." }, { nombre: "Podredumbre apical", combate: "Riego regular y aporte de calcio." }],
    temporada: "Mayo – Septiembre",
    calendarioKey: "Tomate",
  },
  {
    id: "calçot",
    nombre: "Calçot",
    nombreCientifico: "Allium cepa",
    categoria: "hortícola",
    imagen: imgCalcots,
    descripcion: "Cebolla tierna típica del noreste peninsular, ideal para brasa.",
    curiosidades: "Se planta en verano y se cosecha en invierno tras varias 'calzadas' de tierra.",
    comoSeCome:
      "Asado a la brasa hasta que la capa exterior se quema, envuelto en papel de periódico y comido con salsa romesco, mojando el tallo blanco.",
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
    comoSeCome:
      "Asado al horno con piel, en puré, frito en bastones o cocido en cremas. También en dulces y en el clásico relleno de panellets.",
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
    comoSeCome:
      "El melocotón se come fresco, en almíbar, en mermelada o asado con vino tinto y canela.",
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
    categoria: "aromática",
    imagen: img("1595351298020-038700609878"),
    descripcion: "Aromática mediterránea, resistente a la sequía y muy melífera.",
    curiosidades: "Sus flores atraen abejas y ahuyentan mosquitos de manera natural.",
    comoSeCome:
      "Uso culinario limitado: unas flores secas aromatizan bizcochos, miel, infusiones o mezclas tipo hierbas provenzales.",
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
    comoSeCome:
      "La aceituna necesita endulzado en salmuera antes de comerse; del fruto se obtiene el aceite de oliva virgen extra.",
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
    comoSeCome:
      "Los pétalos (sin tratar) se usan en mermeladas, siropes e infusiones; los escaramujos, en confitura rica en vitamina C.",
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
    comoSeCome:
      "No comestible: todas sus partes son tóxicas. Es una planta exclusivamente ornamental.",
    enfermedades: [{ nombre: "Cochinilla", combate: "Aceite de neem o jabón potásico." }],
    temporada: "Junio – Septiembre",
  },
  {
    id: "lechuga-romana",
    nombre: "Lechuga Romana",
    nombreCientifico: "Lactuca sativa var. longifolia",
    categoria: "hortícola",
    imagen: imgLechuga,
    descripcion: "Cogollo alargado y crujiente, la lechuga más cultivada del Bajo Cinca.",
    curiosidades: "Aguanta bien el calor si se riega por la mañana temprano.",
    comoSeCome:
      "En crudo: es la base de la ensalada César y de los cogollos a la plancha con anchoas y vinagreta.",
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
    comoSeCome:
      "En crudo, en ensaladas de hoja tierna; combina con frutos secos, queso fresco y vinagretas suaves.",
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
    comoSeCome:
      "En crudo, en ensalada clásica; sus hojas mantecosas sirven también como envoltorio para rellenos ligeros.",
    enfermedades: [{ nombre: "Caracoles y babosas", combate: "Trampas de cerveza y acolchado seco." }],
    temporada: "Marzo – Octubre",
    calendarioKey: "Lechuga",
  },
  {
    id: "lechuga-negra",
    nombre: "Lechuga Negra de Fraga",
    nombreCientifico: "Lactuca sativa",
    categoria: "hortícola",
    imagen: imgLechuga,
    descripcion: "Variedad autóctona de Fraga, de hoja oscura y rizada, sabor intenso y muy buena resistencia al calor.",
    curiosidades: "Es una de las variedades locales que se han conservado de huerto en huerto en el Bajo Cinca.",
    comoSeCome:
      "En crudo en ensalada, sola con un buen aceite de oliva y sal para apreciar su sabor.",
    enfermedades: [{ nombre: "Mildiu de la lechuga", combate: "Evitar mojar la hoja y airear el marco de plantación." }],
    temporada: "Marzo – Noviembre",
    calendarioKey: "Lechuga",
  },
  {
    id: "cogollo",
    nombre: "Cogollo",
    nombreCientifico: "Lactuca sativa var. longifolia",
    categoria: "hortícola",
    imagen: imgLechuga,
    descripcion: "Cogollo pequeño y compacto tipo Tudela, muy crujiente y de cosecha rápida.",
    curiosidades: "Se planta muy junto para que los cogollos queden apretados y tiernos.",
    comoSeCome:
      "Partidos por la mitad a la plancha con anchoas y vinagreta, o crudos en ensalada.",
    enfermedades: [{ nombre: "Pulgón", combate: "Jabón potásico y fomento de mariquitas." }],
    temporada: "Todo el año (según variedad)",
    calendarioKey: "Lechuga",
  },
  {
    id: "lechuga-maravilla",
    nombre: "Lechuga Maravilla",
    nombreCientifico: "Lactuca sativa var. capitata",
    categoria: "hortícola",
    imagen: imgLechuga,
    descripcion: "Lechuga de cogollo mantecoso con borde rojizo, la clásica «Maravilla de verano».",
    curiosidades: "Aguanta el calor mejor que otras acogolladas sin subirse a flor tan pronto.",
    comoSeCome:
      "En crudo en ensalada clásica; sus hojas mantecosas sirven de envoltorio para rellenos ligeros.",
    enfermedades: [{ nombre: "Botritis", combate: "Riego moderado y buena ventilación." }],
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
    comoSeCome:
      "En crudo con ajo, anchoas y granada (ensalada de Navidad) o ligeramente salteada para suavizar su amargor.",
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
    comoSeCome:
      "Cocida al vapor, asada al horno con especias, rebozada, en puré o cruda rallada como «cuscús» de coliflor.",
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
    comoSeCome:
      "Al vapor o salteado breve para conservar el color; también asado, en cremas o en pasta con ajo y guindilla.",
    enfermedades: [{ nombre: "Pulgón ceniciento", combate: "Jabón potásico y eliminación de brotes afectados." }],
    temporada: "Octubre – Marzo",
  },
  {
    id: "coles",
    nombre: "Coles",
    nombreCientifico: "Brassica oleracea",
    categoria: "hortícola",
    imagen: imgColesHoja,
    descripcion: "Repollo, col rizada (kale), berza o col de hoja, lombarda y col de Milán en plantel de temporada.",
    curiosidades: "El frío convierte parte de su almidón en azúcar: tras las primeras heladas están mucho más dulces.",
    comoSeCome:
      "Cocidas en potajes y guisos, salteadas con ajo y pimentón, crudas en ensalada tipo coleslaw o fermentadas en chucrut.",
    enfermedades: [{ nombre: "Oruga de la col", combate: "Bacillus thuringiensis y revisión del envés de la hoja." }, { nombre: "Hernia de la col", combate: "Rotación larga y encalado del suelo." }, { nombre: "Mosca blanca", combate: "Trampas cromáticas amarillas y neem." }],
    temporada: "Octubre – Abril",
    calendarioKey: "Col rizada",
  },
  {
    id: "pimiento",
    nombre: "Pimiento",
    nombreCientifico: "Capsicum annuum",
    categoria: "hortícola",
    imagen: imgPimiento,
    descripcion: "Todas las variedades de pimiento: italiano de freír, morrón de asar, de Padrón, lamuyo y picantes.",
    curiosidades: "Si se deja madurar en planta el pimiento verde pasa a rojo y gana mucho dulzor.",
    comoSeCome:
      "Frito con sal, asado en escalivada o en conserva, relleno al horno o crudo en tiras para ensaladas.",
    enfermedades: [{ nombre: "Oidiopsis", combate: "Azufre mojable y evitar exceso de humedad." }, { nombre: "Trips", combate: "Trampas azules y control biológico." }, { nombre: "Podredumbre apical", combate: "Riego regular y aporte de calcio." }],
    temporada: "Julio – Octubre",
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
    comoSeCome:
      "Asada al horno, a la plancha, frita en rodajas con miel, en escalivada, moussaka o babaganoush.",
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
    comoSeCome:
      "A la plancha, salteado, en crema, relleno al horno, en tortilla o crudo en tiras finas marinadas.",
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
    comoSeCome:
      "Crudo en ensalada, gazpachos y salmorejos frescos, en tzatziki o encurtido en vinagre.",
    enfermedades: [{ nombre: "Mildiu", combate: "Riego por goteo y buena ventilación." }],
    temporada: "Junio – Septiembre",
  },
  {
    id: "melon",
    nombre: "Melón",
    nombreCientifico: "Cucumis melo",
    categoria: "hortícola",
    imagen: imgPlaceholder,
    descripcion: "Melón piel de sapo, cantalupo y galia: variedades de secano y de regadío para el Bajo Cinca.",
    curiosidades: "El pedúnculo agrietado y el aroma en la punta son las mejores señales de que está en su punto.",
    comoSeCome:
      "Fresco en tajadas, con jamón, en gazpacho de melón o en sorbetes y macedonias.",
    enfermedades: [{ nombre: "Oidio", combate: "Azufre mojable y retirar hojas muy afectadas." }, { nombre: "Mosca blanca", combate: "Malla antiinsectos y trampas amarillas." }],
    temporada: "Julio – Septiembre",
  },
  {
    id: "sandia",
    nombre: "Sandía",
    nombreCientifico: "Citrullus lanatus",
    categoria: "hortícola",
    imagen: imgPlaceholder,
    descripcion: "Sandía con y sin pepita, de piel rayada o negra; muy productiva con calor y riego constante.",
    curiosidades: "Necesita polinización cruzada: las variedades sin pepita se plantan junto a una polinizadora.",
    comoSeCome:
      "Fresca y bien fría en tajadas o dados, en zumos, granizados y ensaladas con queso feta y menta.",
    enfermedades: [{ nombre: "Fusarium", combate: "Rotación de cultivos y portainjertos resistentes." }, { nombre: "Oidio", combate: "Azufre mojable y buena ventilación." }],
    temporada: "Julio – Septiembre",
  },
  {
    id: "calabaza",
    nombre: "Calabaza",
    nombreCientifico: "Cucurbita maxima",
    categoria: "hortícola",
    imagen: imgCalabacin,
    descripcion: "Calabaza cacahuete (butternut), violín, potimarrón y de gran calibre para otoño.",
    curiosidades: "Bien curada y en lugar seco se conserva en perfecto estado durante todo el invierno.",
    comoSeCome:
      "Asada al horno, en crema, en puré, en guisos, en bizcochos y en conserva dulce (cabello de ángel).",
    enfermedades: [{ nombre: "Oidio", combate: "Azufre mojable y marcos de plantación amplios." }, { nombre: "Podredumbre del fruto", combate: "Acolchado para que el fruto no toque el suelo húmedo." }],
    temporada: "Septiembre – Diciembre",
  },
  {
    id: "acelga",
    nombre: "Acelga",
    nombreCientifico: "Beta vulgaris var. cicla",
    categoria: "hortícola",
    imagen: imgAcelga,
    descripcion: "Hortaliza rústica de corte continuo, produce casi todo el año.",
    curiosidades: "De una misma planta se pueden cortar hojas durante varios meses.",
    comoSeCome:
      "Hoja y penca por separado: la hoja rehogada con ajo o en pastel, la penca cocida, rebozada o gratinada.",
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
    comoSeCome:
      "Cruda en ensalada cuando es tierna; salteada con pasas y piñones, en crema, en tortilla o en lasaña.",
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
    comoSeCome:
      "Base de todo sofrito; cruda en ensalada, caramelizada, asada al horno o en sopa de cebolla.",
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
    comoSeCome:
      "En cremas (vichyssoise), en caldos, asado a la brasa con romesco o salteado como base de guisos.",
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
    comoSeCome:
      "Crudo picado en aliños y alioli, dorado en sofritos, asado entero en cabeza o en sopa castellana.",
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
    comoSeCome:
      "Cruda en bastones y rallada, cocida en guisos y caldos, asada al horno, en crema o en bizcocho.",
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
    comoSeCome:
      "Crudo en rodajas finas con sal y aceite, en ensaladas por su punto picante, o encurtido.",
    enfermedades: [{ nombre: "Pulguilla", combate: "Riego frecuente y malla fina." }],
    temporada: "Marzo – Noviembre",
  },
  {
    id: "judias",
    nombre: "Judías",
    nombreCientifico: "Phaseolus vulgaris",
    categoria: "hortícola",
    imagen: imgLegumbres,
    descripcion: "Judía verde de mata baja y de enrame, judía plana y judías de grano para secar.",
    curiosidades: "Fijan nitrógeno en el suelo: dejan la tierra preparada para el cultivo siguiente.",
    comoSeCome:
      "Las verdes cocidas al vapor y salteadas con ajo y jamón o en menestra; las de grano, en potajes y ensaladas.",
    enfermedades: [{ nombre: "Roya de la judía", combate: "Airear el emparrado y evitar mojar la hoja." }, { nombre: "Araña roja", combate: "Humedad ambiental y jabón potásico." }],
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
    comoSeCome:
      "Salteado con jamón, en menestras y guisos; los más tiernos se pueden comer casi crudos.",
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
    comoSeCome:
      "Tiernas salteadas con jamón o «a la catalana»; secas, en potajes. Las muy pequeñas, crudas con queso.",
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
    comoSeCome:
      "Crudo en bastones y ensaladas, como base aromática de caldos y sofritos, o en crema con manzana.",
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
    comoSeCome:
      "Fresca al natural, con zumo de naranja o nata, en mermelada, batidos y postres.",
    enfermedades: [{ nombre: "Botritis", combate: "Acolchado de paja para que el fruto no toque el suelo." }],
    temporada: "Abril – Junio",
  },
  {
    id: "romero",
    nombre: "Romero",
    nombreCientifico: "Rosmarinus officinalis",
    categoria: "aromática",
    imagen: imgRomero,
    descripcion: "Arbusto mediterráneo perenne, muy rústico y resistente a la sequía; en maceta o seto bajo.",
    curiosidades: "Florece incluso en invierno y es una de las primeras fuentes de néctar para las abejas.",
    comoSeCome:
      "Ramitas frescas o secas para asados, patatas al horno, escabeches y aceites aromatizados.",
    enfermedades: [{ nombre: "Pudrición de raíz", combate: "Sustrato muy drenante y riegos espaciados." }],
    temporada: "Todo el año",
  },
  {
    id: "tomillo",
    nombre: "Tomillo",
    nombreCientifico: "Thymus vulgaris",
    categoria: "aromática",
    imagen: imgTomilloMenta,
    descripcion: "Mata baja y compacta, ideal para rocallas, bordes y macetas a pleno sol.",
    curiosidades: "Su aceite esencial (timol) tiene propiedades antisépticas conocidas desde la antigüedad.",
    comoSeCome:
      "En guisos, adobos de carne, verduras al horno e infusiones para la garganta.",
    enfermedades: [{ nombre: "Exceso de humedad", combate: "Evitar encharcamiento y podar tras la floración." }],
    temporada: "Todo el año",
  },
  {
    id: "albahaca",
    nombre: "Albahaca",
    nombreCientifico: "Ocimum basilicum",
    categoria: "aromática",
    imagen: imgAlbahaca,
    descripcion: "Anual de hoja tierna y aroma intenso; muy agradecida en maceta junto a la cocina.",
    curiosidades: "Plantada junto al tomate ayuda a ahuyentar la mosca blanca.",
    comoSeCome:
      "Hoja fresca en ensalada de tomate, pesto, pizzas y pasta; se añade siempre al final.",
    enfermedades: [{ nombre: "Mildiu de la albahaca", combate: "Riego a pie de planta y buena ventilación." }],
    temporada: "Mayo – Septiembre",
  },
  {
    id: "menta-hierbabuena",
    nombre: "Menta y Hierbabuena",
    nombreCientifico: "Mentha spp.",
    categoria: "aromática",
    imagen: imgTomilloMenta,
    descripcion: "Vivaces muy vigorosas; conviene cultivarlas en maceta para controlar su expansión.",
    curiosidades: "Sus rizomas pueden colonizar un bancal entero en una sola temporada.",
    comoSeCome:
      "En infusión, mojitos y limonadas, con guisantes o habas y en salsas frescas de yogur.",
    enfermedades: [{ nombre: "Roya de la menta", combate: "Cortar a ras en otoño y renovar la mata cada 2–3 años." }],
    temporada: "Marzo – Octubre",
  },
  {
    id: "oregano",
    nombre: "Orégano",
    nombreCientifico: "Origanum vulgare",
    categoria: "aromática",
    imagen: imgRomero,
    descripcion: "Vivaz mediterránea muy rústica, perfecta en maceta o borde soleado.",
    curiosidades: "Seco concentra mucho más aroma que fresco.",
    comoSeCome:
      "Seco sobre pizza, tomate, pescado al horno, adobos y salsas.",
    enfermedades: [{ nombre: "Pudrición de raíz", combate: "Sustrato drenante y riegos espaciados." }],
    temporada: "Todo el año",
  },
  {
    id: "curry",
    nombre: "Planta del Curry",
    nombreCientifico: "Helichrysum italicum",
    categoria: "aromática",
    imagen: imgRomero,
    descripcion: "Mata plateada de aroma intenso a curry, muy resistente a la sequía.",
    curiosidades: "No tiene relación con la mezcla de especias: su aroma recuerda al curry pero es un helicriso.",
    comoSeCome:
      "Una ramita aromatiza arroces, guisos y salsas; se retira antes de servir.",
    enfermedades: [{ nombre: "Exceso de humedad", combate: "Suelo muy drenante y pleno sol." }],
    temporada: "Todo el año",
  },
  {
    id: "cebollino",
    nombre: "Cebollino",
    nombreCientifico: "Allium schoenoprasum",
    categoria: "aromática",
    imagen: imgCebollaPuerro,
    descripcion: "Vivaz de mata fina; se corta a tijera y rebrota una y otra vez.",
    curiosidades: "Sus flores lilas son comestibles y decoran muy bien las ensaladas.",
    comoSeCome:
      "Crudo picado sobre ensaladas, huevos, patatas, cremas y salsas de yogur.",
    enfermedades: [{ nombre: "Roya", combate: "Cortar a ras y airear la mata." }],
    temporada: "Marzo – Octubre",
  },
  {
    id: "stevia",
    nombre: "Stevia",
    nombreCientifico: "Stevia rebaudiana",
    categoria: "aromática",
    imagen: imgAlbahaca,
    descripcion: "Planta edulcorante natural; en maceta protegida pasa bien el invierno.",
    curiosidades: "Una sola hoja endulza como varias cucharaditas de azúcar.",
    comoSeCome:
      "Hoja fresca o seca para endulzar infusiones, postres y bebidas.",
    enfermedades: [{ nombre: "Mosca blanca", combate: "Trampas amarillas y jabón potásico." }],
    temporada: "Mayo – Octubre",
  },
  {
    id: "satureja",
    nombre: "Ajedrea (Satureja)",
    nombreCientifico: "Satureja montana",
    categoria: "aromática",
    imagen: imgTomilloMenta,
    descripcion: "Aromática de montaña, compacta y muy melífera, ideal en rocalla.",
    curiosidades: "Tradicionalmente se usa para aromatizar las olivas y los encurtidos.",
    comoSeCome:
      "En adobos de oliva, legumbres, embutidos caseros y guisos de carne.",
    enfermedades: [{ nombre: "Hongos por exceso de riego", combate: "Suelo drenante y riego escaso." }],
    temporada: "Todo el año",
  },
  {
    id: "morera",
    nombre: "Morera",
    nombreCientifico: "Morus alba",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Árbol de sombra rápido y agradecido, en variedad fructífera o sin fruto.",
    curiosidades: "Sus hojas son el único alimento del gusano de seda.",
    comoSeCome:
      "Las moras se comen frescas, en mermelada o en licor.",
    enfermedades: [{ nombre: "Cochinilla", combate: "Aceite de parafina en invierno." }],
    temporada: "Todo el año (plantación otoño-invierno)",
  },
  {
    id: "litonero",
    nombre: "Litonero",
    nombreCientifico: "Celtis australis",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Árbol de sombra muy resistente y longevo, clásico en plazas y paseos del Bajo Cinca.",
    curiosidades:
      "Con su madera flexible se hacían horcas y bastones; sus frutos, los litones, son pequeños y comestibles.",
    comoSeCome: "Los litones maduros se comen crudos: son dulces, con un hueso grande y poca pulpa.",
    enfermedades: [
      { nombre: "Pulgón", combate: "Jabón potásico y fauna auxiliar." },
      { nombre: "Cochinilla", combate: "Aceite de parafina en invierno." },
    ],
    temporada: "Todo el año (plantación otoño-invierno)",
  },

  {
    id: "sauce-lloron",
    nombre: "Sauce Llorón",
    nombreCientifico: "Salix babylonica",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Porte llorón espectacular junto a estanques y zonas húmedas.",
    curiosidades: "Necesita mucha agua: sus raíces buscan la humedad a gran distancia.",
    enfermedades: [{ nombre: "Roya del sauce", combate: "Podar ramas afectadas y airear la copa." }],
    temporada: "Todo el año",
  },
  {
    id: "platanero",
    nombre: "Plátano de Sombra",
    nombreCientifico: "Platanus × hispanica",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Clásico árbol de alineación y sombra densa en calles y paseos.",
    curiosidades: "Es el árbol de sombra más plantado de las ciudades españolas.",
    enfermedades: [{ nombre: "Antracnosis", combate: "Retirar hojarasca y tratamientos cúpricos en brotación." }],
    temporada: "Todo el año",
  },
  {
    id: "prunus-pisardi",
    nombre: "Prunus Pisardi",
    nombreCientifico: "Prunus cerasifera 'Pissardii'",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Ciruelo de hoja roja con floración rosa muy temprana.",
    curiosidades: "Es de los primeros árboles en florecer al final del invierno.",
    enfermedades: [{ nombre: "Pulgón", combate: "Jabón potásico al inicio de la brotación." }],
    temporada: "Floración Febrero – Marzo",
  },
  {
    id: "cedro",
    nombre: "Cedro",
    nombreCientifico: "Cedrus spp.",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Conífera monumental de gran porte para jardines amplios.",
    curiosidades: "Un cedro puede superar los 40 m y vivir varios siglos.",
    enfermedades: [{ nombre: "Procesionaria", combate: "Trampas de feromona y anillos de captura." }],
    temporada: "Todo el año",
  },
  {
    id: "roble",
    nombre: "Roble",
    nombreCientifico: "Quercus robur",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Árbol caducifolio longevo, de madera noble y sombra amplia.",
    curiosidades: "Puede tardar más de 30 años en dar sus primeras bellotas.",
    enfermedades: [{ nombre: "Oídio del roble", combate: "Airear la copa y tratamientos con azufre." }],
    temporada: "Todo el año",
  },
  {
    id: "liquidambar",
    nombre: "Liquidámbar",
    nombreCientifico: "Liquidambar styraciflua",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Árbol ornamental por excelencia por su color otoñal rojo intenso.",
    curiosidades: "Su resina aromática (estoraque) se usaba en perfumería.",
    enfermedades: [{ nombre: "Clorosis férrica", combate: "Aportes de quelato de hierro en suelos calizos." }],
    temporada: "Color otoñal Octubre – Noviembre",
  },
  {
    id: "madrono",
    nombre: "Madroño",
    nombreCientifico: "Arbutus unedo",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Pequeño árbol mediterráneo perenne con frutos rojos comestibles.",
    curiosidades: "Florece y fructifica a la vez: lleva flores y frutos del año anterior.",
    comoSeCome:
      "El madroño se come maduro, en mermelada o en licor.",
    enfermedades: [{ nombre: "Cochinilla algodonosa", combate: "Aceite de parafina y poda de aireación." }],
    temporada: "Fruto Octubre – Diciembre",
  },
  {
    id: "encina",
    nombre: "Encina",
    nombreCientifico: "Quercus ilex",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Árbol perenne emblemático del clima mediterráneo, muy resistente a la sequía.",
    curiosidades: "Sus bellotas dulces son la base de la montanera del cerdo ibérico.",
    enfermedades: [{ nombre: "Seca de la encina", combate: "Evitar encharcamientos y heridas en el tronco." }],
    temporada: "Todo el año",
  },
  {
    id: "pino",
    nombre: "Pino",
    nombreCientifico: "Pinus spp.",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Coníferas de crecimiento rápido: carrasco, piñonero y laricio.",
    curiosidades: "El pino piñonero da los piñones que se usan en cocina.",
    enfermedades: [{ nombre: "Procesionaria del pino", combate: "Trampas de feromona, anillos y retirada de bolsones." }],
    temporada: "Todo el año",
  },
  {
    id: "catalpa-bungei",
    nombre: "Catalpa Bungei",
    nombreCientifico: "Catalpa bungei",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Catalpa de copa esférica injertada, ideal para alineaciones y patios.",
    curiosidades: "Su copa compacta apenas necesita poda para mantener la forma de bola.",
    enfermedades: [{ nombre: "Oídio", combate: "Azufre mojable y buena ventilación." }],
    temporada: "Todo el año",
  },
  {
    id: "sophora",
    nombre: "Sóphora",
    nombreCientifico: "Styphnolobium japonicum",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Árbol de sombra con floración blanca estival y porte elegante.",
    curiosidades: "Es de los pocos árboles grandes que florecen en pleno verano.",
    enfermedades: [{ nombre: "Pulgón", combate: "Jabón potásico en brotación." }],
    temporada: "Floración Julio – Agosto",
  },
  {
    id: "castano",
    nombre: "Castaño",
    nombreCientifico: "Castanea sativa",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Árbol de gran porte y fruto muy apreciado en otoño.",
    curiosidades: "Un castaño injertado puede producir castañas durante más de un siglo.",
    comoSeCome:
      "Las castañas se comen asadas, cocidas, en puré o en marrón glacé.",
    enfermedades: [{ nombre: "Chancro del castaño", combate: "Podar y quemar ramas afectadas." }],
    temporada: "Cosecha Octubre – Noviembre",
  },
  {
    id: "nogal",
    nombre: "Nogal",
    nombreCientifico: "Juglans regia",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Frutal de sombra densa y madera muy valorada.",
    curiosidades: "Sus raíces liberan juglona: pocas plantas prosperan bajo su copa.",
    comoSeCome:
      "Las nueces se comen crudas, tostadas, en ensaladas, repostería y salsas.",
    enfermedades: [{ nombre: "Bacteriosis del nogal", combate: "Tratamientos cúpricos en brotación." }],
    temporada: "Cosecha Septiembre – Octubre",
  },
  {
    id: "paulonia",
    nombre: "Paulonia",
    nombreCientifico: "Paulownia tomentosa",
    categoria: "árbol",
    imagen: imgPlaceholder,
    descripcion: "Crecimiento muy rápido, hoja enorme y floración lila espectacular.",
    curiosidades: "Es uno de los árboles de crecimiento más rápido del mundo.",
    enfermedades: [{ nombre: "Pudrición de raíz", combate: "Suelo bien drenado y riegos controlados." }],
    temporada: "Floración Abril – Mayo",
  },
  {
    id: "abelia",
    nombre: "Abelia",
    nombreCientifico: "Abelia × grandiflora",
    categoria: "arbusto",
    imagen: imgPlaceholder,
    descripcion: "Arbusto perenne de floración muy larga, perfecto para setos bajos.",
    curiosidades: "Florece de forma continua desde primavera hasta bien entrado el otoño.",
    enfermedades: [{ nombre: "Pulgón", combate: "Jabón potásico en brotes tiernos." }],
    temporada: "Floración Mayo – Octubre",
  },
  {
    id: "callistemon",
    nombre: "Callistemon",
    nombreCientifico: "Callistemon citrinus",
    categoria: "arbusto",
    imagen: imgPlaceholder,
    descripcion: "El «limpiatubos»: espigas rojas muy vistosas y gran resistencia a la sequía.",
    curiosidades: "Sus flores atraen abejas y pájaros al jardín.",
    enfermedades: [{ nombre: "Clorosis férrica", combate: "Quelato de hierro en suelos calizos." }],
    temporada: "Floración Abril – Junio",
  },
  {
    id: "viburnum-tinus",
    nombre: "Viburnum Tinus (Durillo)",
    nombreCientifico: "Viburnum tinus",
    categoria: "arbusto",
    imagen: imgPlaceholder,
    descripcion: "Perenne muy rústico, ideal para setos y masas de sombra.",
    curiosidades: "Florece en pleno invierno, cuando casi nada más lo hace.",
    enfermedades: [{ nombre: "Oídio", combate: "Airear el seto y azufre mojable." }],
    temporada: "Floración Diciembre – Marzo",
  },
  {
    id: "viburnum-lucidum",
    nombre: "Viburnum Lucidum",
    nombreCientifico: "Viburnum tinus 'Lucidum'",
    categoria: "arbusto",
    imagen: imgPlaceholder,
    descripcion: "Variedad de hoja más grande y brillante, de crecimiento vigoroso.",
    curiosidades: "Muy usado en setos altos por su follaje denso todo el año.",
    enfermedades: [{ nombre: "Cochinilla", combate: "Aceite de parafina en invierno." }],
    temporada: "Todo el año",
  },
  {
    id: "nispero",
    nombre: "Níspero",
    nombreCientifico: "Eriobotrya japonica",
    categoria: "frutal",
    imagen: imgPlaceholder,
    descripcion: "Frutal perenne de cosecha muy temprana, en primavera.",
    curiosidades: "Es de los pocos frutales que florece en otoño y madura en primavera.",
    comoSeCome:
      "Fresco al natural, en mermelada, en almíbar o en licor.",
    enfermedades: [{ nombre: "Moteado del níspero", combate: "Podar para airear y tratamientos cúpricos." }],
    temporada: "Cosecha Abril – Mayo",
  },
  {
    id: "naranjo",
    nombre: "Naranjo",
    nombreCientifico: "Citrus × sinensis",
    categoria: "frutal",
    imagen: imgPlaceholder,
    descripcion: "Cítrico clásico en variedades de mesa y de zumo.",
    curiosidades: "El azahar del naranjo perfuma el jardín entero en primavera.",
    comoSeCome:
      "Fresca en gajos, en zumo, en ensaladas y en mermelada.",
    enfermedades: [{ nombre: "Minador de los cítricos", combate: "Neem en brotaciones tiernas." }, { nombre: "Cochinilla", combate: "Aceite de parafina y poda de aireación." }],
    temporada: "Cosecha Noviembre – Abril",
  },
  {
    id: "limonero",
    nombre: "Limonero",
    nombreCientifico: "Citrus × limon",
    categoria: "frutal",
    imagen: imgPlaceholder,
    descripcion: "Cítrico reflorecente: da fruto prácticamente todo el año.",
    curiosidades: "Puede tener flor, fruto verde y fruto maduro a la vez.",
    comoSeCome:
      "En zumo, aliños, conservas, repostería y bebidas.",
    enfermedades: [{ nombre: "Cochinilla", combate: "Aceite de parafina en invierno." }, { nombre: "Negrilla", combate: "Controlar pulgón y cochinilla, causa de la melaza." }],
    temporada: "Todo el año",
  },
  {
    id: "limero",
    nombre: "Limero (Lima)",
    nombreCientifico: "Citrus × latifolia",
    categoria: "frutal",
    imagen: imgPlaceholder,
    descripcion: "Cítrico de fruto pequeño y muy aromático; agradece protección del frío.",
    curiosidades: "Es más sensible a las heladas que el limonero: mejor en maceta o zona resguardada.",
    comoSeCome:
      "En cócteles, ceviches, guacamole y aliños.",
    enfermedades: [{ nombre: "Minador de los cítricos", combate: "Neem en brotaciones tiernas." }],
    temporada: "Cosecha Agosto – Diciembre",
  },
  {
    id: "kumquat",
    nombre: "Kumquat",
    nombreCientifico: "Citrus japonica",
    categoria: "frutal",
    imagen: imgPlaceholder,
    descripcion: "Cítrico enano de fruto pequeño, ideal en maceta y patios.",
    curiosidades: "Es el único cítrico que se come entero, con piel incluida.",
    comoSeCome:
      "Entero con piel, confitado o en mermelada.",
    enfermedades: [{ nombre: "Cochinilla", combate: "Aceite de parafina y poda de aireación." }],
    temporada: "Cosecha Diciembre – Marzo",
  },
  {
    id: "membrillo",
    nombre: "Membrillero",
    nombreCientifico: "Cydonia oblonga",
    categoria: "frutal",
    imagen: imgPlaceholder,
    descripcion: "Frutal rústico de gran floración y fruto muy aromático.",
    curiosidades: "Un solo membrillo perfuma toda una habitación.",
    comoSeCome:
      "Cocido en dulce de membrillo, asado o en compota; crudo resulta áspero.",
    enfermedades: [{ nombre: "Moteado", combate: "Podar para airear y tratamientos cúpricos." }],
    temporada: "Cosecha Septiembre – Octubre",
  },
  {
    id: "kaki",
    nombre: "Kaki",
    nombreCientifico: "Diospyros kaki",
    categoria: "frutal",
    imagen: imgPlaceholder,
    descripcion: "Frutal de otoño muy productivo y de color espectacular al madurar.",
    curiosidades: "Las variedades tipo Rojo Brillante se comen duras tras destanizarlas.",
    comoSeCome:
      "Maduro a cucharada, en variedad persimon como una manzana, o en batidos y postres.",
    enfermedades: [{ nombre: "Mosca de la fruta", combate: "Trampas de captura y recogida de fruta caída." }],
    temporada: "Cosecha Octubre – Diciembre",
  },

];


export const plantasHortícolas = plantasDestacadas.filter((p) => p.categoria === "hortícola");
export const plantasOrnamentales = plantasDestacadas.filter((p) =>
  ["árbol", "arbusto", "flor", "ornamental", "aromática", "frutal"].includes(p.categoria),
);

export const temporadaActual: Plant[] = plantasDestacadas.slice(0, 6);

// ── Calendario hortícola ──────────────────────────────────────────────────────
// Cada celda es un mes y admite varias labores con precisión de quincena:
//   "S"   → siembra durante todo el mes
//   "T1"  → trasplante en la 1ª quincena (inicios de mes)
//   "C2"  → cosecha en la 2ª quincena (finales de mes)
//   "S1C2"→ varias labores en el mismo mes
// Una misma planta puede tener VARIAS filas (ciclos distintos: primavera,
// otoño, cultivo temprano/tardío…) usando la misma clave en `planta` y una
// etiqueta en `ciclo`.
export type MesEstado = string;
export const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export const calendario: { planta: string; ciclo?: string; meses: MesEstado[] }[] = [
  { planta: "Tomate",       ciclo: "Ciclo temprano",   meses: ["", "S1", "S", "T1", "T", "C2", "C", "C", "", "", "", ""] },
  { planta: "Tomate",       ciclo: "Ciclo tardío",     meses: ["", "", "S2", "S", "T2", "T1", "", "C2", "C", "C1", "", ""] },
  { planta: "Pimiento",     ciclo: "Ciclo principal",  meses: ["", "S", "S", "T2", "T", "", "C2", "C", "C", "C1", "", ""] },
  { planta: "Berenjena",    ciclo: "Ciclo principal",  meses: ["", "S", "S", "T2", "T", "", "C2", "C", "C", "C1", "", ""] },
  { planta: "Calabacín",    ciclo: "Primavera",        meses: ["", "", "S2", "T1", "T", "C", "C", "C", "", "", "", ""] },
  { planta: "Calabacín",    ciclo: "Verano",           meses: ["", "", "", "", "", "S2", "T1", "C", "C", "C1", "", ""] },
  { planta: "Pepino",       ciclo: "Primavera",        meses: ["", "", "S2", "S", "T1", "C", "C", "C", "C1", "", "", ""] },
  { planta: "Lechuga",      ciclo: "Primavera",        meses: ["S2", "S", "S", "T1", "C", "C1", "", "", "", "", "", ""] },
  { planta: "Lechuga",      ciclo: "Otoño-invierno",   meses: ["", "", "", "", "", "", "S2", "S", "T1", "T2", "C", "C"] },
  { planta: "Escarola",     ciclo: "Otoño",            meses: ["C1", "C", "", "", "", "", "S2", "S", "T1", "T2", "C", "C"] },
  { planta: "Acelga",       ciclo: "Primavera",        meses: ["", "S2", "S", "T1", "C", "C", "C", "C", "", "", "", ""] },
  { planta: "Acelga",       ciclo: "Otoño",            meses: ["C", "C", "", "", "", "", "S2", "S", "T1", "C", "C", "C"] },
  { planta: "Espinaca",     ciclo: "Otoño-invierno",   meses: ["C", "C", "S1", "", "", "", "", "S2", "S", "S", "C", "C"] },
  { planta: "Coliflor",     ciclo: "Ciclo de otoño",   meses: ["C", "C1", "", "", "", "S2", "S", "T1", "T2", "C", "C", "C"] },
  { planta: "Brócoli",      ciclo: "Ciclo de otoño",   meses: ["C", "C1", "", "", "", "S2", "S", "T1", "T2", "C", "C", "C"] },
  { planta: "Repollo",      ciclo: "Ciclo de otoño",   meses: ["C", "C1", "", "", "", "S2", "S", "T1", "T2", "C", "C", "C"] },
  { planta: "Repollo",      ciclo: "Ciclo de primavera", meses: ["S2", "S", "T1", "T", "C2", "C", "", "", "", "", "", ""] },
  { planta: "Col rizada",   ciclo: "Ciclo de otoño",   meses: ["C", "C", "C", "C1", "", "", "S1", "S", "T1", "T2", "C", "C"] },
  { planta: "Cebolla",      ciclo: "Cebolla temprana", meses: ["S", "S2", "T1", "T", "", "C2", "C", "", "", "", "", ""] },
  { planta: "Cebolla",      ciclo: "Cebolla tardía",   meses: ["", "", "", "", "", "", "C1", "C", "", "S2", "S", ""] },
  { planta: "Calçot",       ciclo: "Ciclo tradicional", meses: ["C", "C", "", "", "", "", "S2", "S", "T1", "T", "C2", "C"] },
  { planta: "Puerro",       ciclo: "Ciclo principal",  meses: ["C", "C1", "S1", "S", "", "T1", "T", "", "", "C2", "C", "C"] },
  { planta: "Ajo",          ciclo: "Ciclo tradicional", meses: ["", "", "", "", "", "C2", "C1", "", "", "S2", "S", ""] },
  { planta: "Boniato",      ciclo: "Ciclo principal",  meses: ["", "", "", "S1", "T1", "T2", "", "", "", "C1", "C", ""] },
  { planta: "Zanahoria",    ciclo: "Primavera",        meses: ["", "S2", "S", "S", "C2", "C", "C", "", "", "", "", ""] },
  { planta: "Zanahoria",    ciclo: "Otoño",            meses: ["", "", "", "", "", "", "", "S1", "S", "C2", "C", "C1"] },
  { planta: "Rábano",       ciclo: "Primavera",        meses: ["", "", "S", "S1C2", "S1C", "C1", "", "", "", "", "", ""] },
  { planta: "Rábano",       ciclo: "Otoño",            meses: ["", "", "", "", "", "", "", "", "S", "S1C2", "C", ""] },
  { planta: "Habas",        ciclo: "Ciclo de invierno", meses: ["", "", "", "C1", "C", "", "", "", "", "S2", "S", "S1"] },
  { planta: "Guisante",     ciclo: "Ciclo de invierno", meses: ["", "", "", "C1", "C", "", "", "", "", "S2", "S", "S1"] },
  { planta: "Judía verde",  ciclo: "Primavera",        meses: ["", "", "", "S2", "S", "C2", "C", "C1", "", "", "", ""] },
  { planta: "Judía verde",  ciclo: "Verano",           meses: ["", "", "", "", "", "S2", "S1", "C2", "C", "C1", "", ""] },
  { planta: "Apio",         ciclo: "Ciclo principal",  meses: ["C1", "", "", "S", "S", "T1", "T", "", "C2", "C", "C", "C"] },
  { planta: "Fresa",        ciclo: "Plantación de otoño", meses: ["", "", "C2", "C", "C", "C1", "", "", "T2", "T", "T1", ""] },
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
  { nombre: "Salvador Peralta Ricart", rol: "Primera generación — el origen", bio: "Quien lo empezó todo: de la horticultura tradicional del Bajo Cinca nacieron los primeros invernaderos familiares en Fraga." },
  { nombre: "Carmen Siso", rol: "Primera generación", bio: "Mujer de Salvador. Con su trabajo diario ayudó a levantar la explotación desde los cimientos." },
  { nombre: "Nazario Peralta", rol: "Segunda generación — fundador de Jardiper", bio: "Hijo de Salvador. Fundó Jardiper junto a su mujer y dio el salto del campo al vivero y garden center." },
  { nombre: "Toni Sorolla Soro", rol: "Segunda generación", bio: "Mujer de Nazario. Junto a él escaló la empresa hasta convertirla en referencia comarcal." },
  { nombre: "Pablo y Carlos Peralta", rol: "Tercera generación", bio: "La nueva generación, que gestiona Jardiper mano a mano manteniendo el trato cercano y la calidad de siempre." },
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

export type FilaCalendario = { planta: string; ciclo?: string; meses: MesEstado[] };

/** Filas de un calendario dado (BD o estático) que corresponden a una planta. */
export function filasCalendarioPara(planta: Plant, fuente: FilaCalendario[]): FilaCalendario[] {
  const clave = normalizar(planta.calendarioKey ?? planta.nombre);
  const filas = fuente.map((f) => ({ fila: f, key: normalizar(f.planta) }));

  const exactas = filas.filter((f) => f.key === clave);
  if (exactas.length) return exactas.map((f) => f.fila);

  const prefijo = filas.filter((f) => clave.startsWith(f.key) || clave.includes(` ${f.key} `));
  if (prefijo.length) return prefijo.map((f) => f.fila);

  return filas.filter((f) => clave.includes(f.key)).map((f) => f.fila);
}

/** Todas las filas (ciclos) del calendario estático que corresponden a una planta. */
export function getCalendariosPlanta(planta: Plant): FilaCalendario[] {
  return filasCalendarioPara(planta, calendario);
}

/** Primera fila del calendario de una planta (compatibilidad). */
export function getCalendarioPlanta(planta: Plant): FilaCalendario | undefined {
  return getCalendariosPlanta(planta)[0];
}

// ── Filtros por mes / rango de meses ──────────────────────────────────────────
// Escalable: cualquier planta nueva del catálogo se filtra automáticamente en
// cuanto tenga (o empareje con) una o varias filas del `calendario`.

export type Actividad = "S" | "T" | "C";
/** 1 = primera quincena (inicios de mes), 2 = segunda quincena (finales). */
export type Quincena = 1 | 2;
export type Labor = { actividad: Actividad; quincena?: Quincena };

export const actividadesLabel: Record<Actividad, string> = {
  S: "Siembra",
  T: "Trasplante",
  C: "Cosecha",
};

export const quincenaLabel: Record<Quincena, string> = {
  1: "1ª quincena",
  2: "2ª quincena",
};

export const leyendaCalendario: { codigo: Actividad; etiqueta: string }[] = [
  { codigo: "S", etiqueta: "Siembra" },
  { codigo: "T", etiqueta: "Trasplante" },
  { codigo: "C", etiqueta: "Cosecha" },
];

/** Convierte una celda ("T1", "S1C2", "SC"…) en la lista de labores. */
export function parseCelda(estado: MesEstado | undefined): Labor[] {
  if (!estado) return [];
  const out: Labor[] = [];
  for (const m of estado.matchAll(/([STC])([12])?/g)) {
    out.push({
      actividad: m[1] as Actividad,
      quincena: m[2] ? (Number(m[2]) as Quincena) : undefined,
    });
  }
  return out;
}

/** Labores de una celda que caen en una quincena concreta (1 o 2). */
export function laboresEnQuincena(estado: MesEstado | undefined, quincena: Quincena): Labor[] {
  return parseCelda(estado).filter((l) => l.quincena === undefined || l.quincena === quincena);
}

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

/** Actividades de cultivo de una planta dentro de un rango de meses. */
export function actividadesEnRango(
  planta: Plant,
  desde: number,
  hasta: number,
  fuente?: FilaCalendario[],
): Actividad[] {
  const filas = fuente ? filasCalendarioPara(planta, fuente) : getCalendariosPlanta(planta);
  if (!filas.length) return [];
  const set = new Set<Actividad>();
  for (const fila of filas) {
    for (const i of mesesEnRango(desde, hasta)) {
      for (const l of parseCelda(fila.meses[i])) set.add(l.actividad);
    }
  }
  return (["S", "T", "C"] as Actividad[]).filter((a) => set.has(a));
}

