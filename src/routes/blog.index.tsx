import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, Search, ArrowRight, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import {
  categoriasNoticias,
  noticiasOrdenadas,
  formatearFecha,
  type CategoriaNoticia,
} from "@/lib/noticias";
import { useNoticias, useCargandoCms } from "@/lib/cms";
import { GridSkeleton } from "@/components/site/Cargando";


export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog · Noticias y curiosidades del vivero · Jardiper" },
      { name: "description", content: "Novedades del vivero Jardiper: nuevas secciones de la web, visitas a ferias del sector, plantel de temporada y curiosidades del mundo vegetal en Fraga (Huesca)." },
      { name: "keywords", content: "blog jardinería, noticias vivero Fraga, ferias jardinería, curiosidades plantas, Bajo Cinca" },
      { property: "og:title", content: "Blog · Noticias y curiosidades del vivero · Jardiper" },
      { property: "og:description", content: "Novedades, ferias, temporada y curiosidades del vivero Jardiper en el Bajo Cinca." },
      { property: "og:url", content: "/blog" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Blog de Jardiper",
          description: "Noticias y curiosidades del vivero Jardiper en Fraga (Huesca).",
          url: "/blog",
          blogPost: noticiasOrdenadas().map((n) => ({
            "@type": "BlogPosting",
            headline: n.titulo,
            description: n.resumen,
            datePublished: n.fecha,
            author: { "@type": "Organization", name: n.autor },
            url: `/blog/${n.slug}`,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
          ],
        }),
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { t } = useTranslation();
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<CategoriaNoticia | "Todas">("Todas");

  const todas = useNoticias();
  const cargandoNoticias = useCargandoCms("noticias");

  const filtradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return todas.filter((n) => {
      const coincideCategoria = categoria === "Todas" || n.categoria === categoria;
      const texto = `${n.titulo} ${n.resumen} ${n.tags.join(" ")}`.toLowerCase();
      return coincideCategoria && texto.includes(q);
    });
  }, [todas, busqueda, categoria]);

  const destacada = filtradas[0];
  const resto = filtradas.slice(1);

  return (
    <SiteLayout>
      <section className="pt-28 md:pt-36 pb-12 border-b border-border/60">
        <div className="container-page">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">{t("blog.eyebrow")}</p>
          <h1 className="font-serif text-5xl md:text-6xl max-w-3xl leading-tight">{t("blog.title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{t("blog.subtitle")}</p>
        </div>
      </section>

      <Section>
        <div className="mb-10 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["Todas", ...categoriasNoticias] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategoria(c)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                  categoria === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground/70 hover:bg-secondary/70"
                }`}
              >
                {c === "Todas" ? t("blog.all") : c}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder={t("blog.searchPlaceholder")}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full md:w-72 rounded-full border border-input bg-background pl-10 pr-4 py-2.5 text-sm"
            />
          </div>
        </div>

        {cargandoNoticias && todas.length === 0 && (
          <GridSkeleton items={6} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" aspect="aspect-[16/10]" />
        )}

        {!cargandoNoticias && filtradas.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">{t("blog.noResults")}</p>
        )}


        {destacada && (
          <article className="group grid md:grid-cols-2 gap-8 items-center mb-16 pb-16 border-b border-border/60">
            <Link
              to="/blog/$slug"
              params={{ slug: destacada.slug }}
              className="block relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted"
            >
              <img
                src={destacada.imagen}
                alt={destacada.titulo}
                width={1600}
                height={1000}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
            <div>
              <p className="text-xs uppercase tracking-widest text-accent flex flex-wrap items-center gap-3">
                {destacada.categoria}
                <span className="flex items-center gap-1 text-muted-foreground normal-case tracking-normal">
                  <Calendar className="h-3 w-3" /> {formatearFecha(destacada.fecha)}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground normal-case tracking-normal">
                  <Clock className="h-3 w-3" /> {destacada.minutos} min
                </span>
              </p>
              <Link to="/blog/$slug" params={{ slug: destacada.slug }}>
                <h2 className="font-serif text-3xl md:text-4xl mt-3 leading-tight group-hover:text-primary transition-colors">
                  {destacada.titulo}
                </h2>
              </Link>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{destacada.resumen}</p>
              <Link
                to="/blog/$slug"
                params={{ slug: destacada.slug }}
                className="mt-6 inline-flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all"
              >
                {t("blog.read")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resto.map((n) => (
            <article key={n.id} className="group flex flex-col">
              <Link
                to="/blog/$slug"
                params={{ slug: n.slug }}
                className="block relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted mb-4"
              >
                <img
                  src={n.imagen}
                  alt={n.titulo}
                  loading="lazy"
                  width={1600}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              <p className="text-xs uppercase tracking-widest text-accent flex flex-wrap items-center gap-3">
                {n.categoria}
                <span className="flex items-center gap-1 text-muted-foreground normal-case tracking-normal">
                  <Calendar className="h-3 w-3" /> {formatearFecha(n.fecha)}
                </span>
              </p>
              <Link to="/blog/$slug" params={{ slug: n.slug }}>
                <h3 className="font-serif text-2xl mt-2 group-hover:text-primary transition-colors">{n.titulo}</h3>
              </Link>
              <p className="text-muted-foreground mt-2 flex-1">{n.resumen}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {n.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-secondary text-foreground/70">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to="/blog/$slug"
                params={{ slug: n.slug }}
                className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all"
              >
                {t("blog.read")} <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
