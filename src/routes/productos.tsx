import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  X, Search, ChevronRight, Clock, Download, Printer,
  Check, Package, Truck, Sprout, Leaf, Recycle, Mountain, TreePine, Gem,
  FlowerIcon, Info, CalendarDays, Boxes,
} from "lucide-react";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import {
  guias, meses,
  actividadesEnRango, actividadesLabel,
  type Plant, type Actividad, type PlagaFicha,
} from "@/lib/mock-data";
import { usePlantas, useMateriales, IMAGEN_PLAGA_POR_DEFECTO } from "@/lib/cms";

import { CalendarioCultivo, estadoEstilos } from "@/components/site/CalendarioCultivo";
import { SeccionPlagas } from "@/components/site/SeccionPlagas";
import { imprimirFichaPlanta, DISCLAIMER_FICHA } from "@/lib/imprimir-ficha";



import sustratos from "@/assets/tierras/sustratos.jpg";
import macetas3d from "@/assets/material/macetas-3d.jpg";

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



const MES_ACTUAL = new Date().getMonth();

function ProductosPage() {
  const [tab, setTab] = useState<TabKey>("hortícolas");
  const { sustratos: sustratosSuliflor, compost: composts, piedras, macetas } = useMateriales();
  const [busqueda, setBusqueda] = useState("");
  const [catFiltro, setCatFiltro] = useState<string>("todas");
  const [ficha, setFicha] = useState<Plant | null>(null);
  // Filtro por mes / rango de meses del calendario de cultivo
  const [filtroMesActivo, setFiltroMesActivo] = useState(false);
  const [mesDesde, setMesDesde] = useState(MES_ACTUAL);
  const [mesHasta, setMesHasta] = useState(MES_ACTUAL);
  const [actividades, setActividades] = useState<Actividad[]>([]);

  // Catálogo: contenido estático + lo publicado desde el gestor de la web.
  const todasLasPlantas = usePlantas();
  const listaBase = useMemo(() => {
    if (tab === "hortícolas") return todasLasPlantas.filter((p) => p.categoria === "hortícola");
    if (tab === "ornamentales")
      return todasLasPlantas.filter((p) =>
        ["ornamental", "árbol", "arbusto", "flor", "aromática", "frutal"].includes(p.categoria),
      );
    return [] as Plant[];
  }, [tab, todasLasPlantas]);

  const categoriasDisponibles = useMemo(
    () => Array.from(new Set(listaBase.map((p) => p.categoria))),
    [listaBase],
  );
  const filtroCalendarioActivo = tab === "hortícolas" && filtroMesActivo;

  const listaFiltrada = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return listaBase.filter((p) => {
      const matchCat = catFiltro === "todas" || p.categoria === catFiltro;
      const matchQ =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        (p.nombreCientifico ?? "").toLowerCase().includes(q);
      if (!matchCat || !matchQ) return false;
      if (!filtroCalendarioActivo) return true;
      const acts = actividadesEnRango(p, mesDesde, mesHasta);
      if (acts.length === 0) return false;
      return actividades.length === 0 || acts.some((a) => actividades.includes(a));
    });
  }, [listaBase, catFiltro, busqueda, filtroCalendarioActivo, mesDesde, mesHasta, actividades]);

  const toggleActividad = (a: Actividad) =>
    setActividades((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const resetCalendario = () => {
    setFiltroMesActivo(false);
    setMesDesde(MES_ACTUAL);
    setMesHasta(MES_ACTUAL);
    setActividades([]);
  };


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
          <div className="mb-10 rounded-3xl border border-border bg-card overflow-hidden">
            {/* Buscador + recuento */}
            <div className="p-5 md:p-6 border-b border-border/70 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1 min-w-0">
                <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  placeholder="Buscar por nombre o nombre científico…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full h-11 rounded-full border border-input bg-background pl-11 pr-10 text-sm outline-none focus:border-primary transition-colors"
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda("")}
                    aria-label="Borrar búsqueda"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:bg-secondary"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground sm:text-right shrink-0">
                <span className="text-foreground font-medium">{listaFiltrada.length}</span> de {listaBase.length} variedades
              </p>
            </div>

            {/* Filtros */}
            <div className="p-5 md:p-6 grid gap-x-5 gap-y-4 md:grid-cols-[8rem_1fr] md:items-start">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground md:pt-2">Categoría</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCatFiltro("todas")}
                  className={`h-8 px-4 rounded-full text-xs transition-all capitalize ${
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
                    className={`h-8 px-4 rounded-full text-xs transition-all capitalize ${
                      catFiltro === c
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground/70 hover:bg-secondary/70"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {tab === "hortícolas" && (
                <>
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground md:pt-2 flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-primary" /> Calendario
                  </span>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => { setFiltroMesActivo(true); setMesDesde(MES_ACTUAL); setMesHasta(MES_ACTUAL); }}
                        className={`h-8 px-4 rounded-full text-xs transition-all border ${
                          filtroMesActivo && mesDesde === MES_ACTUAL && mesHasta === MES_ACTUAL
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:bg-secondary/70"
                        }`}
                      >
                        Este mes · {meses[MES_ACTUAL]}
                      </button>
                      <button
                        onClick={() => { setFiltroMesActivo(true); setMesDesde(MES_ACTUAL); setMesHasta((MES_ACTUAL + 2) % 12); }}
                        className={`h-8 px-4 rounded-full text-xs transition-all border ${
                          filtroMesActivo && mesDesde === MES_ACTUAL && mesHasta === (MES_ACTUAL + 2) % 12
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:bg-secondary/70"
                        }`}
                      >
                        Próximos 3 meses
                      </button>
                      <span className="hidden sm:block h-5 w-px bg-border mx-1" />
                      <label className="flex items-center gap-2 text-xs text-muted-foreground">
                        Desde
                        <select
                          value={mesDesde}
                          onChange={(e) => { setMesDesde(Number(e.target.value)); setFiltroMesActivo(true); }}
                          className="h-8 rounded-full border border-input bg-background px-3 text-xs text-foreground"
                        >
                          {meses.map((m, i) => <option key={m} value={i}>{m}</option>)}
                        </select>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-muted-foreground">
                        Hasta
                        <select
                          value={mesHasta}
                          onChange={(e) => { setMesHasta(Number(e.target.value)); setFiltroMesActivo(true); }}
                          className="h-8 rounded-full border border-input bg-background px-3 text-xs text-foreground"
                        >
                          {meses.map((m, i) => <option key={m} value={i}>{m}</option>)}
                        </select>
                      </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground mr-1">Labor</span>
                      {(["S", "T", "C"] as Actividad[]).map((a) => (
                        <button
                          key={a}
                          onClick={() => { toggleActividad(a); setFiltroMesActivo(true); }}
                          className={`h-8 px-4 rounded-full text-xs transition-all border ${
                            actividades.includes(a)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border hover:bg-secondary/70"
                          }`}
                        >
                          {actividadesLabel[a]}
                        </button>
                      ))}
                      {filtroMesActivo && (
                        <button
                          onClick={resetCalendario}
                          className="h-8 px-4 rounded-full text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors inline-flex items-center gap-1.5"
                        >
                          <X className="h-3 w-3" /> Quitar filtro
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {filtroCalendarioActivo && (
              <p className="px-5 md:px-6 py-3 bg-secondary/40 border-t border-border/70 text-xs text-muted-foreground">
                Mostrando variedades con actividad
                {actividades.length > 0 ? ` de ${actividades.map((a) => actividadesLabel[a].toLowerCase()).join(" o ")}` : ""}{" "}
                entre <strong className="text-foreground font-medium">{meses[mesDesde]}</strong> y{" "}
                <strong className="text-foreground font-medium">{meses[mesHasta]}</strong>.
              </p>
            )}
          </div>

          {listaFiltrada.length === 0 && (
            <p className="text-sm text-muted-foreground py-12 text-center">
              {filtroCalendarioActivo
                ? "Ninguna variedad tiene labores de cultivo en el periodo seleccionado."
                : "No hay variedades que coincidan con tu búsqueda."}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listaFiltrada.map((p) => {
              const acts = filtroCalendarioActivo ? actividadesEnRango(p, mesDesde, mesHasta) : [];
              return (
                <button key={p.id} onClick={() => setFicha(p)} className="text-left group">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-muted mb-3">
                    <img src={p.imagen} alt={p.nombre} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="font-serif text-lg group-hover:text-primary transition-colors">{p.nombre}</h3>
                  <p className="text-xs italic text-muted-foreground">{p.nombreCientifico}</p>
                  {acts.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {acts.map((a) => (
                        <span key={a} className={`text-[10px] px-2 py-0.5 rounded-full border ${estadoEstilos[a].clase}`}>
                          {actividadesLabel[a]}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </Section>
      )}

      {tab === "tierras" && (
        <>
          <Section eyebrow="Suliflor España" title="Tierras y sustratos" intro="Distribuidor oficial Suliflor. Disponibles en tienda física en Fraga y venta al por mayor.">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sustratosSuliflor.map((p) => (
                <article key={p.id} className="group rounded-2xl border border-border overflow-hidden hover-lift bg-card flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <img src={p.imagen} alt={p.nombre} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute top-3 right-3 text-xs rounded-full bg-background/95 backdrop-blur px-3 py-1 font-medium">{p.formato}</span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{p.marca || "Suliflor España"}</span>
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
                  <article key={c.id} className="group rounded-2xl border border-border overflow-hidden bg-card hover-lift flex flex-col md:flex-row">
                    <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden bg-secondary">
                      <img src={c.imagen} alt={c.nombre} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-6 md:p-7 flex-1 flex flex-col">
                      <span className="inline-flex self-start items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
                        <Recycle className="h-3.5 w-3.5 text-primary" /> {c.marca || "Liett Ibérica"}
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
                <article key={c.id} className="group rounded-2xl border border-border overflow-hidden hover-lift bg-card flex flex-col">
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
                <article key={c.id} className="group rounded-2xl border border-border overflow-hidden hover-lift bg-card flex flex-col">
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

          <Section
            eyebrow="Novedad · Fabricación propia"
            title="Impresión 3D de macetas a medida"
            intro="Diseñamos e imprimimos macetas, jardineras y accesorios personalizados en nuestro taller de Fraga: tu medida, tu color y hasta tu logotipo."
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="rounded-3xl overflow-hidden border border-border bg-secondary">
                <img
                  src={macetas3d}
                  alt="Macetas impresas en 3D con acabado texturizado en el taller de Jardiper"
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <ul className="space-y-4">
                  {[
                    { t: "Medidas exactas", d: "Macetas y jardineras adaptadas a tu balcón, alféizar, repisa o mesa de cultivo, al milímetro." },
                    { t: "Diseño personalizado", d: "Formas geométricas, texturas, colores a elegir y grabado de nombre o logotipo para empresas y regalos." },
                    { t: "Materiales resistentes", d: "Filamentos aptos para exterior, con drenaje y plato integrados si lo necesitas." },
                    { t: "Piezas de repuesto", d: "Soportes, autorriegos, tutores, etiquetas de huerto y accesorios descatalogados." },
                  ].map((f) => (
                    <li key={f.t} className="flex items-start gap-3">
                      <Boxes className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <h3 className="font-serif text-lg leading-snug">{f.t}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{f.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-2xl border border-border bg-secondary/50 p-5">
                  <p className="text-sm text-foreground/80">
                    Cuéntanos la medida y el uso y te preparamos un presupuesto sin compromiso.
                    Los plazos dependen del tamaño de la pieza (normalmente 3–7 días).
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to="/contacto"
                      className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Pedir presupuesto <ChevronRight className="h-4 w-4" />
                    </Link>
                    <a
                      href="tel:974472158"
                      className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
                    >
                      974 47 21 58
                    </a>
                  </div>
                </div>
              </div>
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
  // Plagas del catálogo global; si la planta aún no tiene ninguna asociada se
  // usan sus enfermedades de la ficha estática.
  const plagasFicha: PlagaFicha[] =
    planta.plagas && planta.plagas.length > 0
      ? planta.plagas
      : planta.enfermedades.map((e) => ({
          nombre: e.nombre,
          combate: e.combate,
          imagen: e.imagen || IMAGEN_PLAGA_POR_DEFECTO,
        }));
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Cerrar ficha" className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-muted z-10"><X className="h-4 w-4" /></button>
        <img src={planta.imagen} alt={planta.nombre} className="w-full h-64 object-cover" />
        <div className="p-8">
          <p className="text-xs uppercase tracking-widest text-accent capitalize">{planta.categoria}</p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-serif text-3xl">{planta.nombre}</h3>
              <p className="text-sm italic text-muted-foreground">{planta.nombreCientifico}</p>
            </div>
            <button
              type="button"
              onClick={() => imprimirFichaPlanta(planta, plagasFicha)}
              className="shrink-0 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs font-medium hover:bg-secondary transition-colors"
            >
              <Printer className="h-3.5 w-3.5" /> Exportar ficha en PDF
            </button>
          </div>
          <p className="mt-4 text-foreground/80 leading-relaxed">{planta.descripcion}</p>

          <div className="mt-4 rounded-lg bg-secondary/60 px-4 py-3 text-sm">
            <span className="text-muted-foreground">Temporada:</span> <span className="font-medium">{planta.temporada}</span>
          </div>

          <div className="mt-6 grid gap-6">
            <CalendarioCultivo planta={planta} mostrarExportar={false} />

            <SeccionPlagas plagas={plagasFicha} onZoom={setZoom} />


            {planta.comoSeCome && (
              <div>
                <h4 className="font-serif text-lg mb-1">Cómo se come</h4>
                <p className="text-sm text-muted-foreground">{planta.comoSeCome}</p>
              </div>
            )}

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

            <div>
              <h4 className="font-serif text-lg mb-1">Curiosidades</h4>
              <p className="text-sm text-muted-foreground">{planta.curiosidades}</p>
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
            <button onClick={onClose} aria-label="Cerrar" className="p-2 rounded-full bg-secondary hover:bg-muted">
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
