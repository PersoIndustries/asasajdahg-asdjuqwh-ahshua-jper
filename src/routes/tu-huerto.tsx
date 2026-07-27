import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, ChevronRight, X, MapPin, Download, BookOpen, Sprout, Calendar, LineChart, Bell, Lock } from "lucide-react";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import pdfFechas from "@/assets/guias/fechas-trasplante.pdf.asset.json";
import { calendario, meses, guias, laboresEnQuincena, quincenaLabel } from "@/lib/mock-data";

export const Route = createFileRoute("/tu-huerto")({
  head: () => ({
    meta: [
      { title: "Tu Huerto · Calendario hortícola y guías de cultivo · Jardiper" },
      { name: "description", content: "Calendario hortícola semanal del Bajo Cinca (Fraga, Lleida), guías de cultivo en PDF descargables y libro de campo digital para planificar tu huerto todo el año." },
      { name: "keywords", content: "calendario hortícola Bajo Cinca, guías cultivo PDF, libro de campo, huerto Fraga, siembra Lleida, cuándo plantar" },
      { property: "og:title", content: "Tu Huerto · Jardiper" },
      { property: "og:description", content: "Calendario, guías PDF y libro de campo digital para tu huerto." },
      { property: "og:url", content: "/tu-huerto" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/tu-huerto" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
            { "@type": "ListItem", position: 2, name: "Tu Huerto", item: "/tu-huerto" },
          ],
        }),
      },
    ],
  }),
  component: TuHuertoPage,
});

const colorByActividad: Record<string, string> = {
  S: "bg-sage/60 text-primary",
  T: "bg-accent/70 text-white",
  C: "bg-primary text-primary-foreground",
  SC: "bg-tierra text-white",
  "": "bg-muted/40",
};

const zonas = [{ id: "bajo-cinca", nombre: "Bajo Cinca, Lleida y alrededores" }];
const SEMANAS_POR_MES = 4;


type Tab = "calendario" | "guias" | "libro";

function TuHuertoPage() {
  const [tab, setTab] = useState<Tab>("calendario");
  const [filtro, setFiltro] = useState("");
  const [zona, setZona] = useState(zonas[0].id);
  const [tagGuia, setTagGuia] = useState<string>("todas");
  const [guia, setGuia] = useState<(typeof guias)[number] | null>(null);

  const tagsGuias = useMemo(() => Array.from(new Set(guias.flatMap((g) => g.tags))).sort(), []);
  const guiasFiltradas = useMemo(
    () => (tagGuia === "todas" ? guias : guias.filter((g) => g.tags.includes(tagGuia))),
    [tagGuia],
  );

  return (
    <SiteLayout>
      <section className="pt-20 pb-12 border-b border-border/60">
        <div className="container-page">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Herramientas para tu huerto</p>
          <h1 className="font-serif text-5xl md:text-6xl max-w-3xl leading-tight">Tu Huerto</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Calendario hortícola, guías de cultivo y el próximo Libro de Campo digital para llevar
            todo tu huerto en un solo lugar.
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            {(
              [
                ["calendario", "Calendario Horticola"],
                ["guias", "Guías de Cultivo"],
                ["libro", "Libro de Campo"],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-5 py-2.5 rounded-full text-sm transition-all ${
                  tab === k ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-secondary/70"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      {tab === "calendario" && (
        <Section eyebrow="Cuándo sembrar" title="Calendario Horticola" intro="Datos orientativos">
          <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4 md:justify-between">
            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
                <MapPin className="h-3.5 w-3.5" /> Zona de cultivo
              </label>
              <select value={zona} onChange={(e) => setZona(e.target.value)} className="rounded-full border border-input bg-background px-5 py-2.5 text-sm min-w-[280px]">
                {zonas.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
              </select>
            </div>
            <input placeholder="Filtrar planta…" value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-full md:w-64 rounded-full border border-input bg-background px-5 py-2.5 text-sm" />
          </div>
          <div className="flex flex-wrap gap-4 mb-6 text-xs">
            {[["S", "Siembra"], ["T", "Trasplante"], ["C", "Cosecha"]].map(([k, l]) => (
              <span key={k} className="flex items-center gap-2">
                <span className={`inline-block h-4 w-4 rounded ${colorByActividad[k]}`} /> {l}
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
                      <th key={`${m}-${i}`} className={`py-1.5 px-1 font-normal text-[10px] text-muted-foreground ${i === 0 ? "border-l border-border/40" : ""}`}>S{i + 1}</th>
                    )),
                  )}
                </tr>
              </thead>
              <tbody>
                {calendario
                  .filter((r) => r.planta.toLowerCase().includes(filtro.toLowerCase()))
                  .map((row, ri) => (
                    <tr key={`${row.planta}-${row.ciclo ?? ri}`} className="border-t border-border hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-medium sticky left-0 bg-background z-10 whitespace-nowrap">
                        {row.planta}
                        {row.ciclo && <span className="block text-[10px] font-normal text-muted-foreground">{row.ciclo}</span>}
                      </td>
                      {row.meses.flatMap((estado, mi) =>
                        Array.from({ length: SEMANAS_POR_MES }, (_, wi) => {
                          // semanas 1-2 → 1ª quincena, semanas 3-4 → 2ª quincena
                          const labores = laboresEnQuincena(estado, wi < 2 ? 1 : 2);
                          const codigo = labores.map((l) => l.actividad).join("");
                          return (
                            <td key={`${mi}-${wi}`} className={`p-0.5 ${wi === 0 ? "border-l border-border/40" : ""}`}>
                              <div
                                title={labores.length ? `${meses[mi]} · ${quincenaLabel[wi < 2 ? 1 : 2]}` : undefined}
                                className={`h-7 rounded-sm flex items-center justify-center text-[9px] font-semibold ${colorByActividad[codigo] ?? colorByActividad[labores[0]?.actividad ?? ""]}`}
                              >
                                {codigo}
                              </div>
                            </td>
                          );
                        }),
                      )}
                    </tr>
                  ))}

              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <a
              href={pdfFechas.url}
              download
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors self-start"
            >
              <Download className="h-4 w-4" /> Descarga de Fechas aconsejables de Trasplante
            </a>
            <p className="text-xs text-muted-foreground">Vista semanal (4 semanas por mes) orientativa para la zona seleccionada.</p>
          </div>
        </Section>
      )}

      {tab === "guias" && (
        <Section eyebrow="Guías de Cultivo" title="Aprende de nuestro equipo" intro="Prácticas, breves y probadas en el campo.">
          <div className="mb-8 flex flex-wrap gap-2">
            <button onClick={() => setTagGuia("todas")} className={`px-4 py-1.5 rounded-full text-xs transition-all ${tagGuia === "todas" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-secondary/70"}`}>Todas</button>
            {tagsGuias.map((t) => (
              <button key={t} onClick={() => setTagGuia(t)} className={`px-4 py-1.5 rounded-full text-xs transition-all ${tagGuia === t ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70 hover:bg-secondary/70"}`}>{t}</button>
            ))}
          </div>
          {guiasFiltradas.length === 0 && <p className="text-sm text-muted-foreground py-12 text-center">No hay guías con esa etiqueta todavía.</p>}
          <div className="grid md:grid-cols-2 gap-8">
            {guiasFiltradas.map((g) => (
              <article key={g.id} className="group cursor-pointer" onClick={() => setGuia(g)}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted mb-4">
                  <img src={g.imagen} alt={g.titulo} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="text-xs uppercase tracking-widest text-accent flex items-center gap-3">
                  {g.categoria} <span className="flex items-center gap-1 text-muted-foreground normal-case tracking-normal"><Clock className="h-3 w-3" /> {g.minutos} min</span>
                </p>
                <h3 className="font-serif text-2xl mt-2 group-hover:text-primary transition-colors">{g.titulo}</h3>
                <p className="text-muted-foreground mt-2">{g.resumen}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.tags.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-secondary text-foreground/70">{t}</span>
                  ))}
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary">Leer guía <ChevronRight className="h-4 w-4" /></span>
              </article>
            ))}
          </div>
        </Section>
      )}

      {tab === "libro" && (
        <>
          <Section eyebrow="Próximamente" title="El Libro de Campo de tu huerto">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 text-accent px-4 py-1.5 text-xs uppercase tracking-widest mb-6">
                <BookOpen className="h-3.5 w-3.5" /> En desarrollo
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Un cuaderno digital para registrar siembras, cosechas, tratamientos y observaciones.
                Guarda el conocimiento de tu huerto año tras año.
              </p>
            </div>
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { i: Sprout, t: "Siembras y cosechas", d: "Anota cada planta, la fecha y el rendimiento obtenido." },
                { i: Calendar, t: "Calendario propio", d: "Ajusta el calendario a tu terreno y microclima." },
                { i: LineChart, t: "Histórico anual", d: "Compara temporadas y descubre qué funciona en tu huerto." },
                { i: Bell, t: "Recordatorios", d: "Te avisamos de riegos, tratamientos y momentos de cosecha." },
              ].map((f) => (
                <article key={f.t} className="rounded-2xl bg-card border border-border p-6">
                  <f.i className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-serif text-xl">{f.t}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.d}</p>
                </article>
              ))}
            </div>
          </Section>

          <section className="bg-primary text-primary-foreground py-20 text-center">
            <div className="container-page max-w-2xl">
              <Lock className="h-8 w-8 mx-auto mb-6 opacity-80" />
              <h2 className="font-serif text-4xl md:text-5xl leading-tight">Próximamente disponible</h2>
              <p className="mt-4 text-primary-foreground/85">
                Estamos preparando el sistema de acceso y registro. Déjanos tu email en
                contacto y te avisaremos en cuanto abramos las primeras cuentas.
              </p>
              <button disabled className="mt-8 rounded-full bg-primary-foreground/20 text-primary-foreground px-6 py-3 text-sm font-medium cursor-not-allowed">
                Acceder (próximamente)
              </button>
            </div>
          </section>
        </>
      )}

      {guia && <GuiaModal guia={guia} onClose={() => setGuia(null)} />}
    </SiteLayout>
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
            <button onClick={onClose} className="p-2 rounded-full bg-secondary hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="flex-1 bg-muted min-h-[60vh]">
          <iframe title={guia.titulo} src={guia.pdfUrl} className="w-full h-full min-h-[60vh]" />
        </div>
      </div>
    </div>
  );
}