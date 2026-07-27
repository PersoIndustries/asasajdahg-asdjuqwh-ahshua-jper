import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, Calendar, Download, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import { guias, type Guia, type GuiaSection } from "@/lib/mock-data";

export const Route = createFileRoute("/guias/$slug")({
  loader: ({ params }): Guia => {
    const guia = guias.find((g) => g.slug === params.slug);
    if (!guia) throw notFound();
    return guia;
  },
  head: ({ params, loaderData: guia }) => {
    if (!guia) {
      return {
        meta: [
          { title: "Guía no encontrada · Jardiper" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        { title: `${guia.titulo} · Guías · Jardiper` },
        { name: "description", content: guia.resumen },
        { property: "og:title", content: guia.titulo },
        { property: "og:description", content: guia.resumen },
        { property: "og:url", content: `/guias/${params.slug}` },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: guia.fechaPublicacion },
        { property: "article:section", content: guia.categoria },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: guia.titulo },
        { name: "twitter:description", content: guia.resumen },
      ],
      links: [{ rel: "canonical", href: `/guias/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guia.titulo,
            description: guia.resumen,
            datePublished: guia.fechaPublicacion,
            articleSection: guia.categoria,
            author: { "@type": "Organization", name: "Jardiper" },
            publisher: { "@type": "Organization", name: "Jardiper", url: "/" },
            mainEntityOfPage: { "@type": "WebPage", "@id": `/guias/${params.slug}` },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
              { "@type": "ListItem", position: 2, name: "Guías", item: "/guias" },
              { "@type": "ListItem", position: 3, name: guia.titulo, item: `/guias/${params.slug}` },
            ],
          }),
        },
      ],
    };
  },
  component: GuiaDetailPage,
});

function GuiaDetailPage() {
  const { t } = useTranslation();
  const guia = Route.useLoaderData();

  const relacionadas: Guia[] = guia.relacionados
    ? (guias.filter((g) => guia.relacionados!.includes(g.slug)) as Guia[])
    : (guias.filter((g) => g.categoria === guia.categoria && g.slug !== guia.slug).slice(0, 3) as Guia[]);

  const fechaFormateada = new Date(guia.fechaPublicacion).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SiteLayout>
      <section className="pt-28 md:pt-36 pb-12 border-b border-border/60">
        <div className="container-page max-w-4xl">
          <Link
            to="/guias"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> {t("guides.back")}
          </Link>
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">{guia.categoria}</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight">{guia.titulo}</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed">{guia.resumen}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {fechaFormateada}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {guia.minutos} min
            </span>
          </div>
        </div>
      </section>

      <div className="container-page max-w-4xl py-12">
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl mb-12">
          <img src={guia.imagen} alt={guia.titulo} className="h-full w-full object-cover" />
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl leading-relaxed text-foreground/90">{guia.contenido}</p>

          {guia.secciones.map((seccion: GuiaSection, i: number) => (
            <div key={i} className="mt-10">
              {seccion.titulo && (
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">{seccion.titulo}</h2>
              )}
              {seccion.parrafos.map((parrafo: string, j: number) => (
                <p key={j} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
                  {parrafo}
                </p>
              ))}
            </div>
          ))}
        </div>

        {guia.pdfUrl && (
          <div className="mt-12 p-6 rounded-2xl bg-secondary/50 border border-border">
            <h3 className="font-serif text-xl mb-2">{t("guides.downloadTitle")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("guides.downloadText")}</p>
            <a
              href={guia.pdfUrl}
              download
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" /> {t("guides.download")}
            </a>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-2">
          {guia.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs uppercase tracking-widest px-3 py-1.5 rounded-full bg-secondary text-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {relacionadas.length > 0 && (
        <Section eyebrow={t("guides.relatedEyebrow")} title={t("guides.relatedTitle")}>
          <div className="grid md:grid-cols-3 gap-8">
            {relacionadas.map((g: Guia) => (
              <article key={g.id} className="group">
                <Link to="/guias/$slug" params={{ slug: g.slug }} className="block relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted mb-4">
                  <img
                    src={g.imagen}
                    alt={g.titulo}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <p className="text-xs uppercase tracking-widest text-accent">{g.categoria}</p>
                <Link to="/guias/$slug" params={{ slug: g.slug }}>
                  <h3 className="font-serif text-xl mt-2 group-hover:text-primary transition-colors">{g.titulo}</h3>
                </Link>
                <Link
                  to="/guias/$slug"
                  params={{ slug: g.slug }}
                  className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all"
                >
                  {t("guides.read")} <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </Section>
      )}
    </SiteLayout>
  );
}
