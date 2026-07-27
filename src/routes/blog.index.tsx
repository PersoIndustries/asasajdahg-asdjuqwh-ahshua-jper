import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, Search, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import { guias } from "@/lib/mock-data";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Guías y blog de jardinería · Jardiper" },
      { name: "description", content: "Guías prácticas de cultivo, calendarios del huerto, consejos de sustratos y compostaje del equipo de Jardiper en Fraga (Huesca)." },
      { name: "keywords", content: "guías jardinería, blog huerto, cultivo Bajo Cinca, sustratos, compostaje, poda frutales" },
      { property: "og:title", content: "Guías y blog de jardinería · Jardiper" },
      { property: "og:description", content: "Consejos prácticos de cultivo para el huerto y el jardín del Bajo Cinca." },
      { property: "og:url", content: "/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
            { "@type": "ListItem", position: 2, name: "Guías", item: "/blog" },
          ],
        }),
      },
    ],
  }),
  component: BlogPage,
});

const categorias = ["Todas", "Huerto", "Jardín", "Frutales", "Sustratos", "Compost"] as const;

function BlogPage() {
  const { t } = useTranslation();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<(typeof categorias)[number]>("Todas");

  const guiasFiltradas = useMemo(() => {
    return guias.filter((g) => {
      const coincideCategoria = categoria === "Todas" || g.categoria === categoria;
      const texto = `${g.titulo} ${g.resumen} ${g.tags.join(" ")}`.toLowerCase();
      const coincideBusqueda = texto.includes(busqueda.toLowerCase().trim());
      return coincideCategoria && coincideBusqueda;
    });
  }, [busqueda, categoria]);

  return (
    <SiteLayout>
      <section className="pt-28 md:pt-36 pb-12 border-b border-border/60">
        <div className="container-page">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">{t("guides.eyebrow")}</p>
          <h1 className="font-serif text-5xl md:text-6xl max-w-3xl leading-tight">{t("guides.title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{t("guides.subtitle")}</p>
        </div>
      </section>

      <Section>
        <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categorias.map((c) => (
              <button
                key={c}
                onClick={() => setCategoria(c)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                  categoria === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground/70 hover:bg-secondary/70"
                }`}
              >
                {c === "Todas" ? t("guides.all") : c}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder={t("guides.searchPlaceholder")}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full md:w-72 rounded-full border border-input bg-background pl-10 pr-4 py-2.5 text-sm"
            />
          </div>
        </div>

        {guiasFiltradas.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">{t("guides.noResults")}</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guiasFiltradas.map((g) => (
            <article key={g.id} className="group flex flex-col">
              <Link to="/blog/$slug" params={{ slug: g.slug }} className="block relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted mb-4">
                <img
                  src={g.imagen}
                  alt={g.titulo}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              <p className="text-xs uppercase tracking-widest text-accent flex items-center gap-3">
                {g.categoria}
                <span className="flex items-center gap-1 text-muted-foreground normal-case tracking-normal">
                  <Clock className="h-3 w-3" /> {g.minutos} min
                </span>
              </p>
              <Link to="/blog/$slug" params={{ slug: g.slug }}>
                <h3 className="font-serif text-2xl mt-2 group-hover:text-primary transition-colors">{g.titulo}</h3>
              </Link>
              <p className="text-muted-foreground mt-2 flex-1">{g.resumen}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {g.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-secondary text-foreground/70">
                    {t}
                  </span>
                ))}
              </div>
              <Link
                to="/blog/$slug"
                params={{ slug: g.slug }}
                className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all"
              >
                {t("guides.read")} <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
