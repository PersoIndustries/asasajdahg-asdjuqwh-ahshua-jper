import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  X, Search, ChevronRight, Clock, Download,
  Check, Package, Truck, Sprout, Leaf, Recycle, Mountain, TreePine, Gem,
  FlowerIcon,
} from "lucide-react";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import {
  guias, plantasHortícolas, plantasOrnamentales, type Plant,
} from "@/lib/mock-data";
import sustratos from "@/assets/tierras/sustratos.jpg";

export const Route = createFileRoute("/productos")({
  head: () => ({
    meta: [
      { title: "Productos · Plantas, sustratos, compost y macetas · Jardiper Fraga" },
      { name: "description", content: "Catálogo Jardiper: plantas hortícolas y ornamentales, sustratos Suliflor, compost ECO Liett Ibérica, piedras decorativas y macetas de todos los tamaños en Fraga, Huesca." },
      { name: "keywords", content: "plantas hortícolas Fraga, plantas ornamentales, sustratos Suliflor, compost ECO, big bag compost, piedras decorativas, macetas, vivero al por mayor Bajo Cinca" },
      { property: "og:title", content: "Productos · Vivero Jardiper" },
      { property: "og:description", content: "Plantas, sustratos Suliflor, compost Liett Ibérica, piedras y macetas en Fraga, Huesca." },
      { property: "og:url", content: "/productos" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/productos" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
            { "@type": "ListItem", position: 2, name: "Productos", item: "/productos" },
          ],
        }),
      },
    ],
  }),
  component: ProductosPage,
});

type TabKey = "hortícolas" | "ornamentales" | "tierras" | "material";

const uimg = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const sustratosSuliflor = [
  { nombre: "Sustrato Universal Premium", uso: "Huerto, macetas, jardín", peso: "70 L", detalle: "Turba rubia, coco y perlita.", imagen: uimg("1585513553738-84fa8ee3e114") },
  { nombre: "Sustrato para Hortícolas", uso: "Semilleros y trasplantes", peso: "50 L", detalle: "pH ajustado, drenaje óptimo.", imagen: uimg("1416879595882-3373a0480b5b") },
  { nombre: "Sustrato Ácido", uso: "Azaleas, camelias, hortensias", peso: "20 L", detalle: "Turba rubia + fibra.", imagen: uimg("1502331538081-041522531548") },
  { nombre: "Sustrato Cactus & Suculentas", uso: "Ornamental interior", peso: "10 L", detalle: "Alto drenaje, mineral.", imagen: uimg("1459411552884-841db9b3cc2a") },
  { nombre: "Mantillo de Corteza", uso: "Acolchado y decoración", peso: "50 L", detalle: "Pino seleccionado.", imagen: uimg("1508766206392-8bd5cf550d1c") },
  { nombre: "Turba Rubia", uso: "Base de mezclas profesionales", peso: "80 L", detalle: "Fibra larga, baja densidad.", imagen: uimg("1466692476868-aef1dfb1e735") },
];

const composts = [
  { nombre: "Compost ECO", uso: "Huerto, agricultura ecológica y enmienda de suelos", formato: "Big bag 1 m³", detalle: "Materia orgánica compostada y certificada para uso ecológico. Mejora la estructura, fertilidad y retención hídrica del suelo.", imagen: uimg("1500595046743-cd271d694d30") },
];

const piedras = [
  { nombre: "Piedras Marmolinas", uso: "Jardines, senderos y macetas decorativas", formato: "Sacos y a granel", detalle: "Acabado natural en tonos claros, ideal para acentuar zonas de grava.", imagen: uimg("1518331647612-4a5e7e6f1a9c") },
  { nombre: "Canto Rodado", uso: "Bordes de arriates, fuentes y paisajismo", formato: "Sacos y a granel", detalle: "Piedra redondeada de río en diferentes granulometrías.", imagen: uimg("1534177618311-8dce4c8f2d20") },
  { nombre: "Piedra Volcánica", uso: "Drenaje, decoración y acolchado", formato: "Sacos y a granel", detalle: "Ligera, porosa y resistente a las heladas.", imagen: uimg("1504198458649-3128b932f49e") },
  { nombre: "Corteza de Pino", uso: "Acolchado de parterres y árboles", formato: "Sacos de 50 L", detalle: "Mantiene la humedad, frena malas hierbas y aporta orden visual.", imagen: uimg("1502082553048-f009c37129b9") },
];

const macetas = [
  { nombre: "Maceta de Terracota", uso: "Interior y exterior, aspecto clásico", formato: "Ø 10–60 cm", detalle: "Barro cocido tradicional, transpirable y duradero.", imagen: uimg("1485955900006-10f4d324d411") },
  { nombre: "Maceta de Cerámica Esmaltada", uso: "Decoración de interior", formato: "Ø 12–35 cm", detalle: "Acabados en colores mate y satinado, con plato incluido.", imagen: uimg("1509423350716-97f9360b4e09") },
  { nombre: "Maceta de Plástico", uso: "Vivero, huerto y trasplantes", formato: "0,5 L – 50 L", detalle: "Ligera, resistente y económica. Ideal para cultivo intensivo.", imagen: uimg("1459411552884-841db9b3cc2a") },
  { nombre: "Jardinera de Madera", uso: "Balcón, terraza y huerto urbano", formato: "60–120 cm", detalle: "Madera tratada para exterior, con lámina interior protectora.", imagen: uimg("1416879595882-3373a0480b5b") },
  { nombre: "Maceta Colgante", uso: "Plantas colgantes y aromáticas", formato: "Ø 20–30 cm", detalle: "Con cadena o cordón, en fibra, plástico o metal.", imagen: uimg("1466692476868-aef1dfb1e735") },
  { nombre: "Macetero XXL / Corporativo", uso: "Grandes espacios y proyectos", formato: "Ø 60–120 cm", detalle: "Fibra de vidrio, hormigón ligero o rotomoldeado. Consúltanos.", imagen: uimg("1523712999610-f77fbcfc3843") },
];

function ProductosPage() {
  const [tab, setTab] = useState<TabKey>("hortícolas");
  const [busqueda, setBusqueda] = useState("");
  const [catFiltro, setCatFiltro] = useState<string>("todas");
  const [ficha, setFicha] = useState<Plant | null>(null);

  const listaBase = tab === "hortícolas" ? plantasHortícolas : tab === "ornamentales" ? plantasOrnamentales : [];
  const categoriasDisponibles = useMemo(
    () => Array.from(new Set(listaBase.map((p) => p.categoria))),
    [listaBase],
  );
  const listaFiltrada = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return listaBase.filter((p) => {
      const matchCat = catFiltro === "todas" || p.categoria === catFiltro;
      const matchQ =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        (p.nombreCientifico ?? "").toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [listaBase, catFiltro, busqueda]);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10">
          <img src={sustratos} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        </div>
        <div className="container-page pt-24 pb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Nuestro catálogo</p>
          <h1 className="font-serif text-5xl md:text-7xl max-w-4xl leading-tight">
            Todo lo que tu <span className="italic text-primary">huerto y jardín</span> necesitan
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Miles de referencias entre plantas hortícolas y ornamentales, sustratos profesionales,
            compost ecológico, piedras decorativas y macetas de todos los estilos y tamaños.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {(
              [
                ["hortícolas", "Hortícolas"],
                ["ornamentales", "Ornamentales"],
                ["tierras", "Tierras y sustratos"],
                ["material", "Material para jardinería"],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => { setTab(k); setBusqueda(""); setCatFiltro("todas"); }}
                className={`px-5 py-2.5 rounded-full text-sm transition-all ${
                  tab === k
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground/70 hover:bg-secondary/70"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="mt-8 max-w-3xl rounded-2xl border border-border bg-secondary/40 p-5 flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-medium">Aviso:</strong> nuestros catálogos son orientativos y
              pueden estar incompletos o desactualizados. La disponibilidad varía según la temporada, por lo que
              siempre es mejor{" "}
              <a href="tel:+34974472158" className="text-primary underline underline-offset-4">contactar con nosotros</a>{" "}
              para confirmar existencias, formatos y precios.
            </p>
          </div>
        </div>
      </section>

      {(tab === "hortícolas" || tab === "ornamentales") && (
        <Section
          eyebrow="Catálogo"
          title={tab === "hortícolas" ? "Variedades Hortícolas" : "Ornamentales"}
          intro="Haz click en cualquier variedad para ver su ficha completa."
        >
          <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Buscar por nombre o nombre científico…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full rounded-full border border-input bg-background pl-11 pr-5 py-2.5 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCatFiltro("todas")}
                className={`px-4 py-1.5 rounded-full text-xs transition-all capitalize ${
                  catFiltro === "todas"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground/70 hover:bg-secondary/70"
                }`}
              >
                Todas
              </button>
              {categoriasDisponibles.map((c) => (
                <button
                  key={c}
                  onClick={() => setCatFiltro(c)}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all capitalize ${
                    catFiltro === c
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/70"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          {listaFiltrada.length === 0 && (
            <p className="text-sm text-muted-foreground py-12 text-center">
              No hay variedades que coincidan con tu búsqueda.
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listaFiltrada.map((p) => (
              <button key={p.id} onClick={() => setFicha(p)} className="text-left group">
                <div className="aspect-square overflow-hidden rounded-2xl bg-muted mb-3">
                  <img src={p.imagen} alt={p.nombre} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="font-serif text-lg group-hover:text-primary transition-colors">{p.nombre}</h3>
                <p className="text-xs italic text-muted-foreground">{p.nombreCientifico}</p>
              </button>
            ))}
          </div>
        </Section>
      )}

      {tab === "tierras" && (
        <>
          <Section eyebrow="Suliflor España" title="Tierras y sustratos" intro="Distribuidor oficial Suliflor. Disponibles en tienda física en Fraga y venta al por mayor.">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sustratosSuliflor.map((p) => (
                <article key={p.nombre} className="group rounded-2xl border border-border overflow-hidden hover-lift bg-card flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img src={p.imagen} alt={p.nombre} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute top-3 right-3 text-xs rounded-full bg-background/95 backdrop-blur px-3 py-1 font-medium">{p.peso}</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Suliflor España</span>
                    </div>
                    <h3 className="font-serif text-xl leading-snug">{p.nombre}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.uso}</p>
                    <p className="text-sm mt-3 text-foreground/80 flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {p.detalle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Section>

          <section className="bg-secondary/40 border-y border-border">
            <div className="container-page py-20 md:py-24">
              <div className="max-w-2xl mb-12">
                <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium">Distribuidor Liett Ibérica</p>
                <h2 className="font-serif text-4xl md:text-5xl leading-tight">
                  Compost<br />
                  <span className="italic text-primary">ECO en big bags de 1 m³</span>
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Distribuimos el <strong className="text-foreground font-medium">Compost ECO de Liett Ibérica</strong>,
                  apto para agricultura ecológica. Disponible en big bags de 1 m³ y también al por mayor
                  para viveros, cooperativas, ayuntamientos y explotaciones agrícolas.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm"><Leaf className="h-4 w-4 text-primary" /> Uso ecológico</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm"><Recycle className="h-4 w-4 text-primary" /> Compostaje controlado</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm"><Truck className="h-4 w-4 text-primary" /> Big bag y al por mayor</span>
                </div>
              </div>

              <div className="max-w-3xl">
                {composts.map((c) => (
                  <article key={c.nombre} className="group rounded-2xl border border-border overflow-hidden bg-card hover-lift flex flex-col md:flex-row">
                    <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden bg-secondary">
                      <img src={c.imagen} alt={c.nombre} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-6 md:p-7 flex-1 flex flex-col">
                      <span className="inline-flex self-start items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                        <Recycle className="h-3.5 w-3.5 text-primary" /> Liett Ibérica
                      </span>
                      <h3 className="font-serif text-2xl leading-snug">{c.nombre}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{c.uso}</p>
                      <p className="text-sm mt-3 text-foreground/80 flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {c.detalle}
                      </p>
                      <span className="mt-4 inline-flex self-start items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                        <Package className="h-3.5 w-3.5" /> {c.formato}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {tab === "material" && (
        <>
          <Section eyebrow="Piedras y áridos decorativos" title="Piedras para jardín" intro="Piedras marmolinas, canto rodado, volcánica y corteza — en saco o a granel.">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {piedras.map((c) => (
                <article key={c.nombre} className="group rounded-2xl border border-border overflow-hidden hover-lift bg-card flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img src={c.imagen} alt={c.nombre} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute top-3 right-3 text-xs rounded-full bg-background/95 backdrop-blur px-3 py-1 font-medium">{c.formato}</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      {c.nombre.includes("Corteza") ? <TreePine className="h-4 w-4 text-primary" /> :
                        c.nombre.includes("Volcánica") ? <Mountain className="h-4 w-4 text-primary" /> :
                        <Gem className="h-4 w-4 text-primary" />}
                      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Piedras</span>
                    </div>
                    <h3 className="font-serif text-xl leading-snug">{c.nombre}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{c.uso}</p>
                    <p className="text-sm mt-3 text-foreground/80 flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {c.detalle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Section>

          <Section eyebrow="Macetas y jardineras" title="Todo tipo de macetas" intro="Terracota, cerámica esmaltada, plástico técnico, madera y grandes formatos corporativos.">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {macetas.map((c) => (
                <article key={c.nombre} className="group rounded-2xl border border-border overflow-hidden hover-lift bg-card flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img src={c.imagen} alt={c.nombre} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute top-3 right-3 text-xs rounded-full bg-background/95 backdrop-blur px-3 py-1 font-medium">{c.formato}</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <FlowerIcon className="h-4 w-4 text-primary" />
                      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Macetas</span>
                    </div>
                    <h3 className="font-serif text-xl leading-snug">{c.nombre}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{c.uso}</p>
                    <p className="text-sm mt-3 text-foreground/80 flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {c.detalle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        </>
      )}

      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-page grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">¿No encuentras lo que buscas?</h2>
            <p className="mt-4 text-primary-foreground/85 max-w-xl">
              Nuestro catálogo cambia con la temporada. Llámanos o pásate por Fraga y te asesoramos.
            </p>
          </div>
          <a href="tel:974472158" className="rounded-full bg-primary-foreground text-primary text-center px-6 py-3 font-medium">
            974 47 21 58
          </a>
        </div>
      </section>

      {ficha && <FichaModal planta={ficha} onClose={() => setFicha(null)} />}
    </SiteLayout>
  );
}

function FichaModal({ planta, onClose }: { planta: Plant; onClose: () => void }) {
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const guiaVinculada = planta.guiaId ? guias.find((g) => g.id === planta.guiaId) : undefined;
  const [guiaOpen, setGuiaOpen] = useState<(typeof guias)[number] | null>(null);
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-muted z-10"><X className="h-4 w-4" /></button>
        <img src={planta.imagen} alt={planta.nombre} className="w-full h-64 object-cover" />
        <div className="p-8">
          <p className="text-xs uppercase tracking-widest text-accent capitalize">{planta.categoria}</p>
          <h3 className="font-serif text-3xl mt-2">{planta.nombre}</h3>
          <p className="text-sm italic text-muted-foreground">{planta.nombreCientifico}</p>
          <p className="mt-4 text-foreground/80 leading-relaxed">{planta.descripcion}</p>

          <div className="mt-6 grid gap-4">
            <div>
              <h4 className="font-serif text-lg mb-1">Curiosidades</h4>
              <p className="text-sm text-muted-foreground">{planta.curiosidades}</p>
            </div>
            <div>
              <h4 className="font-serif text-lg mb-2">Enfermedades y cómo combatirlas</h4>
              <ul className="space-y-4">
                {planta.enfermedades.map((e) => (
                  <li key={e.nombre} className="text-sm flex gap-3">
                    {e.imagen && (
                      <button
                        type="button"
                        onClick={() => setZoom({ src: e.imagen!, alt: e.nombre })}
                        className="shrink-0 rounded-lg overflow-hidden border border-border hover:opacity-90 transition"
                        aria-label={`Ampliar imagen de ${e.nombre}`}
                      >
                        <img src={e.imagen} alt={e.nombre} loading="lazy" className="h-16 w-16 object-cover" />
                      </button>
                    )}
                    <div>
                      <span className="font-medium text-foreground">{e.nombre}:</span>{" "}
                      <span className="text-muted-foreground">{e.combate}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {guiaVinculada && (
              <div>
                <h4 className="font-serif text-lg mb-2">Guía de cultivo</h4>
                <button
                  type="button"
                  onClick={() => setGuiaOpen(guiaVinculada)}
                  className="w-full flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-secondary/40 transition text-left"
                >
                  <img src={guiaVinculada.imagen} alt={guiaVinculada.titulo} className="h-16 w-24 object-cover rounded-lg shrink-0" loading="lazy" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-accent">{guiaVinculada.categoria}</p>
                    <p className="font-serif text-base truncate">{guiaVinculada.titulo}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{guiaVinculada.resumen}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                </button>
              </div>
            )}
            <div className="rounded-lg bg-secondary/60 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Temporada:</span> <span className="font-medium">{planta.temporada}</span>
            </div>
          </div>
        </div>
      </div>
      {zoom && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4"
          onClick={(e) => { e.stopPropagation(); setZoom(null); }}
        >
          <button onClick={(e) => { e.stopPropagation(); setZoom(null); }} className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-muted" aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
          <figure className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={zoom.src} alt={zoom.alt} className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
            <figcaption className="mt-3 text-center text-sm text-white/90">{zoom.alt}</figcaption>
          </figure>
        </div>
      )}
      {guiaOpen && <GuiaModal guia={guiaOpen} onClose={() => setGuiaOpen(null)} />}
    </div>
  );
}

function GuiaModal({ guia, onClose }: { guia: (typeof guias)[number]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col relative shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent flex items-center gap-3">
              {guia.categoria}
              <span className="flex items-center gap-1 text-muted-foreground normal-case tracking-normal">
                <Clock className="h-3 w-3" /> {guia.minutos} min
              </span>
            </p>
            <h3 className="font-serif text-2xl md:text-3xl mt-1">{guia.titulo}</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href={guia.pdfUrl} download className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
              <Download className="h-4 w-4" /> Descargar PDF
            </a>
            <button onClick={onClose} className="p-2 rounded-full bg-secondary hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-muted min-h-[60vh]">
          <iframe title={guia.titulo} src={guia.pdfUrl} className="w-full h-full min-h-[60vh]" />
        </div>
      </div>
    </div>
  );
}