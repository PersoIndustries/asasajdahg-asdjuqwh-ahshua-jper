import { createFileRoute } from "@tanstack/react-router";
import { Check, Package, Truck, Sprout, Leaf, Recycle, Mountain, TreePine, Gem } from "lucide-react";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import sustratos from "@/assets/sustratos.jpg";

export const Route = createFileRoute("/tierras-sustratos")({
  head: () => ({
    meta: [
      { title: "Tierras, Sustratos y Compost · Jardiper" },
      { name: "description", content: "Sustratos Suliflor España, compost Liett Ibérica y complementos para el jardín: piedras, canto rodado, corteza y más. Venta al por mayor en Fraga." },
      { property: "og:title", content: "Tierras, Sustratos y Compost · Jardiper" },
      { property: "og:description", content: "Distribuidor oficial Suliflor y Liett Ibérica. Sustratos, compost y complementos para el jardín en Fraga, Huesca." },
    ],
  }),
  component: TierrasPage,
});

// Imágenes botánicas (Unsplash CDN) — reemplazar con fotos reales del catálogo.
const uimg = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const productos = [
  {
    nombre: "Sustrato Universal Premium",
    uso: "Huerto, macetas, jardín",
    peso: "70 L",
    detalle: "Turba rubia, coco y perlita.",
    imagen: uimg("1585513553738-84fa8ee3e114"),
  },
  {
    nombre: "Sustrato para Hortícolas",
    uso: "Semilleros y trasplantes",
    peso: "50 L",
    detalle: "pH ajustado, drenaje óptimo.",
    imagen: uimg("1416879595882-3373a0480b5b"),
  },
  {
    nombre: "Sustrato Ácido",
    uso: "Azaleas, camelias, hortensias",
    peso: "20 L",
    detalle: "Turba rubia + fibra.",
    imagen: uimg("1502331538081-041522531548"),
  },
  {
    nombre: "Sustrato Cactus & Suculentas",
    uso: "Ornamental interior",
    peso: "10 L",
    detalle: "Alto drenaje, mineral.",
    imagen: uimg("1459411552884-841db9b3cc2a"),
  },
  {
    nombre: "Mantillo de Corteza",
    uso: "Acolchado y decoración",
    peso: "50 L",
    detalle: "Pino seleccionado.",
    imagen: uimg("1508766206392-8bd5cf550d1c"),
  },
  {
    nombre: "Turba Rubia",
    uso: "Base de mezclas profesionales",
    peso: "80 L",
    detalle: "Fibra larga, baja densidad.",
    imagen: uimg("1466692476868-aef1dfb1e735"),
  },
];

// Compost profesional Liett Ibérica — big bags 1 m³.
const composts = [
  {
    nombre: "Compost de Estiércol de Vaca",
    uso: "Huerto y enmienda de suelos agrícolas",
    formato: "Big bag 1 m³",
    detalle: "Rico en materia orgánica, mejora estructura y retención hídrica.",
    imagen: uimg("1500595046743-cd271d694d30"),
  },
  {
    nombre: "Compost de Gallinaza",
    uso: "Aporte nitrogenado para huerto intensivo",
    formato: "Big bag 1 m³",
    detalle: "Alto contenido en N-P-K, ideal como abonado de fondo.",
    imagen: uimg("1523348837708-15d4a09cfac2"),
  },
];

// Complementos para el jardín: piedras, canto rodado, corteza, etc.
const complementos = [
  {
    nombre: "Piedras Marmolinas",
    uso: "Jardines, senderos y macetas decorativas",
    formato: "Sacos y a granel",
    detalle: "Acabado natural en tonos claros, ideal para acentuar zonas de grava.",
    imagen: uimg("1518331647612-4a5e7e6f1a9c"),
  },
  {
    nombre: "Canto Rodado",
    uso: "Bordes de arriates, fuentes y paisajismo",
    formato: "Sacos y a granel",
    detalle: "Piedra redondeada de río en diferentes granulometrías.",
    imagen: uimg("1534177618311-8dce4c8f2d20"),
  },
  {
    nombre: "Piedra Volcánica",
    uso: "Drenaje, decoración y acolchado",
    formato: "Sacos y a granel",
    detalle: "Ligera, porosa y resistente a las heladas.",
    imagen: uimg("1504198458649-3128b932f49e"),
  },
  {
    nombre: "Corteza de Pino",
    uso: "Acolchado de parterres y árboles",
    formato: "Sacos de 50 L",
    detalle: "Mantiene la humedad, frena malas hierbas y aporta orden visual.",
    imagen: uimg("1502082553048-f009c37129b9"),
  },
];

function TierrasPage() {
  return (
    <SiteLayout>
      <section className="relative">
        <div className="container-page pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Suministro profesional</p>
            <h1 className="font-serif text-5xl md:text-6xl leading-tight">
              Tierras y sustratos<br /><span className="italic text-primary">para cada cultivo</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
              Distribuimos sustratos profesionales Suliflor España, compost Liett Ibérica y una
              amplia gama de complementos para el jardín: piedras, canto rodado, volcánica y cortezas.
              Venta al por mayor y para particulares.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm"><Truck className="h-4 w-4 text-primary" /> Venta al por mayor</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm"><Sprout className="h-4 w-4 text-primary" /> Uso hobby</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm"><Package className="h-4 w-4 text-primary" /> Formatos 10–70 L</span>
            </div>
          </div>
          <img src={sustratos} alt="Sustratos" width={1400} height={1000} loading="lazy" className="rounded-2xl w-full h-auto shadow-xl" />
        </div>
      </section>

      <Section eyebrow="Suliflor España" title="Tierras y sustratos" intro="Disponibles en tienda física en Fraga. Consúltanos para pedidos al por mayor.">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((p) => (
            <article key={p.nombre} className="group rounded-2xl border border-border overflow-hidden hover-lift bg-card flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 text-xs rounded-full bg-background/95 backdrop-blur px-3 py-1 font-medium">
                  {p.peso}
                </span>
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
        <div className="container-page py-20 md:py-28">
          <div className="max-w-2xl mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium">Distribuidor Liett Ibérica</p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight">
              Compost<br />
              <span className="italic text-primary">en big bags de 1 m³</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Trabajamos el compost de <strong className="text-foreground font-medium">Liett Ibérica</strong> para
              huerto y agricultura: enmiendas orgánicas de estiércol de vaca y gallinaza, servidas en big bags de
              un metro cúbico. Venta a particulares y al por mayor para viveros, cooperativas y explotaciones.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm">
                <Leaf className="h-4 w-4 text-primary" /> 100% orgánico
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm">
                <Recycle className="h-4 w-4 text-primary" /> Compostaje controlado
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm">
                <Truck className="h-4 w-4 text-primary" /> Servicio al por mayor
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {composts.map((c) => (
              <article key={c.nombre} className="group rounded-2xl border border-border overflow-hidden bg-card hover-lift flex flex-col md:flex-row">
                <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden bg-secondary">
                  <img
                    src={c.imagen}
                    alt={c.nombre}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
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

      <Section eyebrow="Complementos para el jardín" title="Otros tipos de tierras y piedras" intro="Además de sustratos y compost, suministramos materiales de jardinería a granel y en saco para particulares, paisajistas y grandes superficies.">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {complementos.map((c) => (
            <article key={c.nombre} className="group rounded-2xl border border-border overflow-hidden hover-lift bg-card flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={c.imagen}
                  alt={c.nombre}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 text-xs rounded-full bg-background/95 backdrop-blur px-3 py-1 font-medium">
                  {c.formato}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  {c.nombre.includes("Corteza") ? (
                    <TreePine className="h-4 w-4 text-primary" />
                  ) : c.nombre.includes("Volcánica") ? (
                    <Mountain className="h-4 w-4 text-primary" />
                  ) : (
                    <Gem className="h-4 w-4 text-primary" />
                  )}
                  <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Complemento</span>
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

      <section className="bg-primary text-primary-foreground py-20">
        <div className="container-page grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">¿Necesitas volumen para tu proyecto?</h2>
            <p className="mt-4 text-primary-foreground/85 max-w-xl">
              Servimos sustratos Suliflor, compost Liett Ibérica y complementos al por mayor para viveros,
              ayuntamientos, paisajistas, cooperativas y agricultores del Bajo Cinca. Consulta condiciones.
            </p>
          </div>
          <a href="tel:974472158" className="rounded-full bg-primary-foreground text-primary text-center px-6 py-3 font-medium">
            974 47 21 58
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
