import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, ChevronRight, X, MapPin, Download, BookOpen, Sprout, Calendar, LineChart, Bell, Lock, ChevronDown } from "lucide-react";
import { useCalendario, useCargandoCms, useGuias } from "@/lib/cms";
import { GuiaLectura } from "@/components/site/GuiaLectura";
import { CargandoLinea } from "@/components/site/Cargando";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { SiteLayout, Section } from "@/components/site/SiteLayout";
import pdfFechas from "@/assets/guias/fechas-trasplante.pdf.asset.json";
import { meses, type Guia, laboresEnQuincena, quincenaLabel, actividadesLabel } from "@/lib/mock-data";
import { estadoEstilos, LeyendaCalendario, BotonImprimirCalendario } from "@/components/site/CalendarioCultivo";

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
      { name: "twitter:card", content: "summary_large_image" },
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

const zonas = [{ id: "bajo-cinca", nombre: "Bajo Cinca, Lleida y alrededores" }];


type Tab = "calendario" | "guias" | "libro";

function TuHuertoPage() {
  const guias = useGuias();
  const cargandoGuias = useCargandoCms("guias");
  const [tab, setTab] = useState<Tab>("calendario");
  const [filtro, setFiltro] = useState("");
  const [zona, setZona] = useState(zonas[0].id);
  const [tagGuia, setTagGuia] = useState<string>("todas");
  const [guia, setGuia] = useState<Guia | null>(null);
  const [modoMes, setModoMes] = useState<"todos" | "ahora" | number>("todos");

  // Mes y quincena actuales, para resaltar la columna y el filtro "Ahora".
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const quincenaActual: 1 | 2 = hoy.getDate() <= 15 ? 1 : 2;

  const calendario = useCalendario();
  const cargandoCalendario = useCargandoCms("calendario");

  const filas = useMemo(() => {
    const q = filtro.toLowerCase().trim();
    return calendario.filter((r) => {
      if (!r.planta.toLowerCase().includes(q)) return false;
      if (modoMes === "todos") return true;
      const mesIdx = modoMes === "ahora" ? mesActual : modoMes;
      const laboresQ1 = laboresEnQuincena(r.meses[mesIdx] ?? "", 1);
      const laboresQ2 = laboresEnQuincena(r.meses[mesIdx] ?? "", 2);
      if (modoMes === "ahora") {
        return (quincenaActual === 1 ? laboresQ1 : laboresQ2).some((l) => l.actividad === "S" || l.actividad === "T");
      }
      return [...laboresQ1, ...laboresQ2].some((l) => l.actividad === "S" || l.actividad === "T");
    });
  }, [filtro, calendario, modoMes, mesActual, quincenaActual]);


  const tagsGuias = useMemo(() => Array.from(new Set(guias.flatMap((g) => g.tags))).sort(), [guias]);
  const guiasFiltradas = useMemo(
    () => (tagGuia === "todas" ? guias : guias.filter((g) => g.tags.includes(tagGuia))),
    [tagGuia, guias],
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
          <div className="mb-6 rounded-3xl border border-border bg-card p-3 md:p-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* Zona */}
              <div className="relative min-w-0 flex-1 basis-56">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  aria-label="Zona de cultivo"
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  className="w-full h-10 rounded-full border border-input bg-background pl-10 pr-4 text-sm"
                >
                  {zonas.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
                </select>
              </div>

              {/* Buscador */}
              <div className="relative min-w-0 flex-1 basis-44">
                <input
                  aria-label="Buscar variedad"
                  placeholder="Buscar variedad…"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="w-full h-10 rounded-full border border-input bg-background px-5 pr-9 text-sm outline-none focus:border-primary transition-colors"
                />
                {filtro && (
                  <button
                    type="button"
                    onClick={() => setFiltro("")}
                    aria-label="Borrar búsqueda"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:bg-secondary"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Periodo */}
              <button
                type="button"
                onClick={() => setModoMes(modoMes === "ahora" ? "todos" : "ahora")}
                aria-pressed={modoMes === "ahora"}
                title="Qué sembrar o trasplantar ahora"
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-colors border ${
                  modoMes === "ahora"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border bg-background text-foreground/80 hover:bg-secondary/70"
                }`}
              >
                <Sprout className="h-4 w-4 shrink-0" />
                Ahora
              </button>

              <div className="flex items-center rounded-full border border-input bg-background overflow-hidden h-10">
                <Select
                  value={typeof modoMes === "number" ? String(modoMes) : ""}
                  onValueChange={(v) => setModoMes(v ? Number(v) : "todos")}
                >
                  <SelectTrigger className="border-0 rounded-none h-10 px-4 text-sm font-medium hover:bg-secondary/60 focus:ring-0 focus:ring-offset-0 gap-2">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0" />
                      {typeof modoMes === "number" ? meses[modoMes] : "Mes"}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {meses.map((m, i) => (
                      <SelectItem key={m} value={String(i)} className="rounded-full text-sm">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {typeof modoMes === "number" && (
                  <button
                    type="button"
                    onClick={() => setModoMes("todos")}
                    aria-label="Quitar filtro de mes"
                    className="h-10 px-3 border-l border-input hover:bg-secondary/60 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <a
                href={pdfFechas.url}
                download
                title="Descargar fechas aconsejables de trasplante"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-4 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Fechas aconsejables</span>
              </a>
            </div>
          </div>
          <div className="mb-4">
            <LeyendaCalendario />
          </div>
          {typeof modoMes === "number" && (
            <p className="mb-4 text-sm text-muted-foreground">
              Mostrando solo variedades con siembra o trasplante en {meses[modoMes]}.
              {filas.length === 0 && " No hay labores registradas en este periodo."}
            </p>
          )}
          {modoMes === "ahora" && (
            <p className="mb-4 text-sm text-muted-foreground">
              Mostrando solo variedades con siembra o trasplante en {meses[mesActual]} ({quincenaLabel[quincenaActual]}).
              {filas.length === 0 && " No hay labores registradas en este periodo."}
            </p>
          )}

          {cargandoCalendario && calendario.length === 0 && (
            <CargandoLinea texto="Cargando calendario de cultivo…" />
          )}
          <div className={`overflow-x-auto rounded-2xl border border-border${cargandoCalendario && calendario.length === 0 ? " hidden" : ""}`}>
            <table className="w-full min-w-[1040px] text-sm border-collapse">
              <thead>
                <tr className="bg-secondary/60">
                  <th rowSpan={2} className="text-left py-2 px-3 font-medium sticky left-0 bg-secondary/60 z-20 w-[170px] min-w-[170px]">
                    Planta
                  </th>
                  {meses.map((m, mi) => (
                    <th
                      key={m}
                      colSpan={2}
                      className={`py-2 px-1 font-medium text-xs border-l border-border/60 ${
                        mi === mesActual ? "bg-primary/15 text-primary" : ""
                      }`}
                    >
                      {m}
                    </th>
                  ))}
                </tr>
                <tr className="bg-secondary/40">
                  {meses.flatMap((m, mi) =>
                    ([1, 2] as const).map((q) => (
                      <th
                        key={`${m}-${q}`}
                        className={`py-1 px-1 font-normal text-[10px] border-b border-border ${q === 1 ? "border-l border-border/60" : ""} ${
                          mi === mesActual ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {q === 1 ? "1ª" : "2ª"}
                      </th>
                    )),
                  )}
                </tr>
              </thead>
              <tbody>
                {filas.map((row, ri) => (
                  <tr key={`${row.planta}-${row.ciclo ?? ri}`} className="border-t border-border group">
                    <td className="p-0 sticky left-0 bg-background z-10 w-[170px] min-w-[170px] border-r border-border/60">
                      <div className="h-11 px-3 flex flex-col justify-center overflow-hidden group-hover:bg-secondary/30 transition-colors">
                        <span className="font-medium leading-tight truncate" title={row.planta}>{row.planta}</span>
                        {row.ciclo && (
                          <span className="text-[10px] font-normal leading-tight text-muted-foreground truncate" title={row.ciclo}>
                            {row.ciclo}
                          </span>
                        )}
                      </div>
                    </td>
                    {row.meses.flatMap((estado, mi) =>
                      ([1, 2] as const).map((q) => {
                        const labores = laboresEnQuincena(estado, q);
                        const principal = labores[0];
                        const esAhora = mi === mesActual;
                        return (
                          <td
                            key={`${mi}-${q}`}
                            title={`${meses[mi]} · ${quincenaLabel[q]}${labores.length ? `: ${labores.map((l) => actividadesLabel[l.actividad]).join(" y ")}` : ""}`}
                            className={`p-0 ${esAhora ? "bg-primary/10" : "bg-muted/30"} ${q === 1 ? "border-l border-border/60" : ""}`}
                          >
                            <div
                              className={`h-11 flex items-center justify-center text-[9px] font-semibold leading-none group-hover:brightness-95 transition-all ${
                                principal ? `${estadoEstilos[principal.actividad].fondo} text-foreground/80` : ""
                              }`}
                            >
                              {labores.map((l) => l.actividad).join("")}
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

            <BotonImprimirCalendario titulo="Calendario hortícola · Bajo Cinca" filas={filas} className="self-start" />
            <p className="text-xs text-muted-foreground">Cada mes se divide en 1ª y 2ª quincena. Datos orientativos para la zona seleccionada.</p>
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
          {cargandoGuias && !guias.length ? <CargandoLinea texto="Cargando guías…" /> : guiasFiltradas.length === 0 && <p className="text-sm text-muted-foreground py-12 text-center">No hay guías con esa etiqueta todavía.</p>}
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

      {guia && <GuiaLectura guia={guia} onClose={() => setGuia(null)} />}
    </SiteLayout>
  );
}
