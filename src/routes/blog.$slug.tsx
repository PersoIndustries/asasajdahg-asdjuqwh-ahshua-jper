import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Calendar, ArrowRight, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import type { NoticiaSection } from "@/lib/noticias";
import {
  getNoticia,
  formatearFecha,
  type Noticia,
} from "@/lib/noticias";
import { useNoticias } from "@/lib/cms";
import { NoticiaNotFound, NoticiaError } from "@/components/site/NoticiaEstados";


export const Route = createFileRoute("/blog/$slug")({
  // El artículo puede venir del contenido estático o de la base de datos
  // (publicado desde el gestor); en ese segundo caso lo resuelve el componente.
  loader: ({ params }): Noticia | null => getNoticia(params.slug) ?? null,

  head: ({ params, loaderData: noticia }) => {
    if (!noticia) {
      return {
        meta: [
          { title: "Artículo no encontrado · Jardiper" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        { title: `${noticia.titulo} · Blog · Jardiper` },
        { name: "description", content: noticia.resumen },
        { property: "og:title", content: noticia.titulo },
        { property: "og:description", content: noticia.resumen },
        { property: "og:url", content: `/blog/${params.slug}` },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: noticia.fecha },
        { property: "article:section", content: noticia.categoria },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: noticia.titulo },
        { name: "twitter:description", content: noticia.resumen },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: noticia.titulo,
            description: noticia.resumen,
            datePublished: noticia.fecha,
            articleSection: noticia.categoria,
            author: { "@type": "Organization", name: noticia.autor },
            publisher: { "@type": "Organization", name: "Jardiper", url: "/" },
            mainEntityOfPage: { "@type": "WebPage", "@id": `/blog/${params.slug}` },
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
              { "@type": "ListItem", position: 3, name: noticia.titulo, item: `/blog/${params.slug}` },
            ],
          }),
        },
      ],
    };
  },
  component: NoticiaDetailPage,
  errorComponent: NoticiaError,
  notFoundComponent: NoticiaNotFound,
});

function NoticiaDetailPage() {
  const { t } = useTranslation();
  const { slug } = Route.useParams();
  const estatica = Route.useLoaderData();
  const todas = useNoticias();
  const noticia: Noticia | null = todas.find((n) => n.slug === slug) ?? estatica;

  if (!noticia) return <NoticiaNotFound />;

  const relacionadas = todas
    .filter((n) => n.slug !== noticia.slug && n.categoria === noticia.categoria)
    .slice(0, 3);


  return (
    <SiteLayout>
      <section className="pt-28 md:pt-36 pb-12 border-b border-border/60">
        <div className="container-page max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> {t("blog.back")}
          </Link>
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">{noticia.categoria}</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight">{noticia.titulo}</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed">{noticia.resumen}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {formatearFecha(noticia.fecha)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {noticia.minutos} min
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {noticia.autor}
            </span>
          </div>
        </div>
      </section>

      <div className="container-page max-w-4xl py-12">
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl mb-12">
          <img
            src={noticia.imagen}
            alt={noticia.titulo}
            width={1600}
            height={1000}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl leading-relaxed text-foreground/90">{noticia.entradilla}</p>

          {noticia.secciones.map((seccion: NoticiaSection, i: number) => (
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

        <div className="mt-12 flex flex-wrap gap-2">
          {noticia.tags.map((tag: string) => (
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
        <Section eyebrow={t("blog.relatedEyebrow")} title={t("blog.relatedTitle")}>
          <div className="grid md:grid-cols-3 gap-8">
            {relacionadas.map((r) => (
              <article key={r.id} className="group flex flex-col">
                <Link
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="block relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted mb-4"
                >
                  <img
                    src={r.imagen}
                    alt={r.titulo}
                    loading="lazy"
                    width={1600}
                    height={1000}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <p className="text-xs uppercase tracking-widest text-accent">{r.categoria}</p>
                <Link to="/blog/$slug" params={{ slug: r.slug }}>
                  <h3 className="font-serif text-xl mt-2 group-hover:text-primary transition-colors">{r.titulo}</h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-2 flex-1">{r.resumen}</p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all"
                >
                  {t("blog.read")} <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </Section>
      )}
    </SiteLayout>
  );
}
