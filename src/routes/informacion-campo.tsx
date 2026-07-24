import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, ChevronRight, X, MapPin } from "lucide-react";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import {
  calendario,
  meses,
  guias,
  plantasHortícolas,
  plantasOrnamentales,
  type Plant,
  type MesEstado,
} from "@/lib/mock-data";

export const Route = createFileRoute("/informacion-campo")({
  head: () => ({
    meta: [
      { title: "Información de Campo · Jardiper" },
      { name: "description", content: "Calendario hortícola, guías de cultivo y catálogo de plantas del Bajo Cinca." },
      { property: "og:title", content: "Información de Campo · Jardiper" },
      { property: "og:description", content: "Calendario hortícola, guías y catálogo de plantas." },
    ],
  }),
  component: InfoCampo,
});

const colorByEstado: Record<MesEstado, string> = {
  S: "bg-sage/60 text-primary",
  T: "bg-accent/70 text-white",
  C: "bg-primary text-primary-foreground",
  SC: "bg-tierra text-white",
  "": "bg-muted/40",
};

const zonas = [
  { id: "bajo-cinca", nombre: "Bajo Cinca, Lleida y alrededores" },
];
const SEMANAS_POR_MES = 4;

function InfoCampo() {
  const [tab, setTab] = useState<"calendario" | "guias" | "hortícolas" | "ornamentales">("calendario");
  const [filtro, setFiltro] = useState("");
  const [ficha, setFicha] = useState<Plant | null>(null);
  const [guia, setGuia] = useState<(typeof guias)[number] | null>(null);
  const [zona, setZona] = useState(zonas[0].id);

  return (
    <SiteLayout>
      <section className="pt-20 pb-12 border-b border-border/60">
        <div className="container-page">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Te ayudamos</p>
          <h1 className="font-serif text-5xl md:text-6xl max-w-3xl leading-tight">
            Información de Campo
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Calendarios, guías y fichas técnicas creadas por el equipo Jardiper.
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            {(
              [
                ["calendario", "Calendario Hortícola"],
                ["guias", "Guías de Cultivo"],
                ["hortícolas", "Catálogo Hortícolas"],
                ["ornamentales", "Catálogo Ornamentales"],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
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
        </div>
      </section>

      {tab === "calendario" && (
        <Section eyebrow="Cuándo sembrar" title="Calendario Hortícola del Bajo Cinca" intro="Datos orientativos para nuestra comarca. Ajusta según microclima.">
          <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4 md:justify-between">
            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
                <MapPin className="h-3.5 w-3.5" /> Zona de cultivo
              </label>
              <select
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className="rounded-full border border-input bg-background px-5 py-2.5 text-sm min-w-[280px]"
              >
                {zonas.map((z) => (
                  <option key={z.id} value={z.id}>{z.nombre}</option>
                ))}
              </select>
            </div>
            <input
              placeholder="Filtrar planta…"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full md:w-64 rounded-full border border-input bg-background px-5 py-2.5 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-4 mb-6 text-xs">
            {[
              ["S", "Siembra"],
              ["T", "Trasplante"],
              ["C", "Cosecha"],
            ].map(([k, l]) => (
              <span key={k} className="flex items-center gap-2">
                <span className={`inline-block h-4 w-4 rounded ${colorByEstado[k as MesEstado]}`} /> {l}
              </span>
            ))}
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-[1100px] text-sm">
              <thead>
                <tr className="bg-secondary/60">
                  <th rowSpan={2} className="text-left py-3 px-4 font-medium sticky left-0 bg-secondary/60 z-10">Planta</th>
                  {meses.map((m) => (
                    <th key={m} colSpan={SEMANAS_POR_MES} className="py-2 px-2 font-medium text-xs border-l border-border/40">{m}</th>
                  ))}
                </tr>
                <tr className="bg-secondary/40">
                  {meses.flatMap((m) =>
                    Array.from({ length: SEMANAS_POR_MES }, (_, i) => (
                      <th key={`${m}-${i}`} className={`py-1.5 px-1 font-normal text-[10px] text-muted-foreground ${i === 0 ? "border-l border-border/40" : ""}`}>
                        S{i + 1}
                      </th>
                    )),
                  )}
                </tr>
              </thead>
              <tbody>
                {calendario
                  .filter((r) => r.planta.toLowerCase().includes(filtro.toLowerCase()))
                  .map((row) => (
                    <tr key={row.planta} className="border-t border-border hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-medium sticky left-0 bg-background z-10 whitespace-nowrap">{row.planta}</td>
                      {row.meses.flatMap((estado, mi) =>
                        Array.from({ length: SEMANAS_POR_MES }, (_, wi) => (
                          <td key={`${mi}-${wi}`} className={`p-0.5 ${wi === 0 ? "border-l border-border/40" : ""}`}>
                            <div className={`h-7 rounded-sm flex items-center justify-center text-[9px] font-semibold ${colorByEstado[estado]}`}>
                              {estado}
                            </div>
                          </td>
                        )),
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Vista semanal (4 semanas por mes) orientativa para la zona seleccionada.</p>
        </Section>
      )}

      {tab === "guias" && (
        <Section eyebrow="Guías de Cultivo" title="Aprende de nuestro equipo" intro="Prácticas, breves y probadas en el campo.">
          <div className="grid md:grid-cols-2 gap-8">
            {guias.map((g) => (
              <article key={g.id} className="group cursor-pointer" onClick={() => setGuia(g)}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted mb-4">
                  <img src={g.imagen} alt={g.titulo} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="text-xs uppercase tracking-widest text-accent flex items-center gap-3">
                  {g.categoria} <span className="flex items-center gap-1 text-muted-foreground normal-case tracking-normal"><Clock className="h-3 w-3" /> {g.minutos} min</span>
                </p>
                <h3 className="font-serif text-2xl mt-2 group-hover:text-primary transition-colors">{g.titulo}</h3>
                <p className="text-muted-foreground mt-2">{g.resumen}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">Leer guía <ChevronRight className="h-4 w-4" /></span>
              </article>
            ))}
          </div>
        </Section>
      )}

      {(tab === "hortícolas" || tab === "ornamentales") && (
        <Section
          eyebrow="Catálogo"
          title={tab === "hortícolas" ? "Variedades Hortícolas" : "Ornamentales"}
          intro="Haz click en cualquier variedad para ver su ficha completa."
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(tab === "hortícolas" ? plantasHortícolas : plantasOrnamentales).map((p) => (
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

      {ficha && <FichaModal planta={ficha} onClose={() => setFicha(null)} />}
      {guia && <GuiaModal guia={guia} onClose={() => setGuia(null)} />}
    </SiteLayout>
  );
}

function FichaModal({ planta, onClose }: { planta: Plant; onClose: () => void }) {
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
              <ul className="space-y-2">
                {planta.enfermedades.map((e) => (
                  <li key={e.nombre} className="text-sm">
                    <span className="font-medium text-foreground">{e.nombre}:</span>{" "}
                    <span className="text-muted-foreground">{e.combate}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-secondary/60 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Temporada:</span> <span className="font-medium">{planta.temporada}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuiaModal({ guia, onClose }: { guia: (typeof guias)[number]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-muted z-10"><X className="h-4 w-4" /></button>
        <img src={guia.imagen} alt={guia.titulo} className="w-full h-64 object-cover" />
        <div className="p-8">
          <p className="text-xs uppercase tracking-widest text-accent flex items-center gap-3">
            {guia.categoria} <span className="flex items-center gap-1 text-muted-foreground normal-case tracking-normal"><Clock className="h-3 w-3" /> {guia.minutos} min</span>
          </p>
          <h3 className="font-serif text-3xl mt-2">{guia.titulo}</h3>
          <p className="mt-4 text-foreground/80 leading-relaxed whitespace-pre-line">{guia.contenido}</p>
        </div>
      </div>
    </div>
  );
}