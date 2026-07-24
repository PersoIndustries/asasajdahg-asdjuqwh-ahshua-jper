import { createFileRoute } from "@tanstack/react-router";
import { Check, Package, Truck, Sprout } from "lucide-react";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import sustratos from "@/assets/sustratos.jpg";

export const Route = createFileRoute("/tierras-sustratos")({
  head: () => ({
    meta: [
      { title: "Tierras y Sustratos · Suliflor España · Jardiper" },
      { name: "description", content: "Distribuidor oficial Suliflor España. Sustratos profesionales para vivero, huerto y jardinería." },
      { property: "og:title", content: "Tierras y Sustratos · Jardiper" },
      { property: "og:description", content: "Sustratos Suliflor España — venta al por mayor y para hobby." },
    ],
  }),
  component: TierrasPage,
});

const productos = [
  { nombre: "Sustrato Universal Premium", uso: "Huerto, macetas, jardín", peso: "70 L", detalle: "Turba rubia, coco y perlita." },
  { nombre: "Sustrato para Hortícolas", uso: "Semilleros y trasplantes", peso: "50 L", detalle: "pH ajustado, drenaje óptimo." },
  { nombre: "Sustrato Ácido", uso: "Azaleas, camelias, hortensias", peso: "20 L", detalle: "Turba rubia + fibra." },
  { nombre: "Sustrato Cactus & Suculentas", uso: "Ornamental interior", peso: "10 L", detalle: "Alto drenaje, mineral." },
  { nombre: "Mantillo de Corteza", uso: "Acolchado y decoración", peso: "50 L", detalle: "Pino seleccionado." },
  { nombre: "Compost Ecológico", uso: "Enmienda orgánica", peso: "40 L", detalle: "Certificado ecológico." },
];

function TierrasPage() {
  return (
    <SiteLayout>
      <section className="relative">
        <div className="container-page pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Distribuidor oficial</p>
            <h1 className="font-serif text-5xl md:text-6xl leading-tight">
              Suliflor España<br /><span className="italic text-primary">Tierras y sustratos</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
              Trabajamos con los sustratos profesionales de Suliflor España desde hace más
              de dos décadas. Materia prima seleccionada y fórmulas específicas para cada tipo
              de planta.
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

      <Section eyebrow="Catálogo" title="Sustratos disponibles" intro="Disponibles en tienda física en Fraga. Consúltanos para pedidos al por mayor.">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((p) => (
            <article key={p.nombre} className="rounded-2xl border border-border p-6 hover-lift bg-card">
              <div className="flex items-start justify-between mb-4">
                <Package className="h-6 w-6 text-primary" />
                <span className="text-xs rounded-full bg-secondary px-3 py-1">{p.peso}</span>
              </div>
              <h3 className="font-serif text-xl">{p.nombre}</h3>
              <p className="text-sm text-muted-foreground mt-1">{p.uso}</p>
              <p className="text-sm mt-3 text-foreground/80 flex items-start gap-2"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {p.detalle}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="bg-primary text-primary-foreground py-20">
        <div className="container-page grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">¿Necesitas volumen para tu proyecto?</h2>
            <p className="mt-4 text-primary-foreground/85 max-w-xl">
              Servimos pedidos al por mayor para viveros, ayuntamientos, paisajistas y
              agricultores del Bajo Cinca. Consulta condiciones.
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