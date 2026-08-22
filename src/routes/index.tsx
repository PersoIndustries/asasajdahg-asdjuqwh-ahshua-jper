import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sprout, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import { temporadaActual } from "@/lib/mock-data";
import heroAsset from "@/assets/home/hero.jpg.asset.json";
import vivero from "@/assets/home/vivero.jpg";
import placeholderImg from "@/assets/placeholder/under-construction-wide.jpg";
import { localBusinessLd } from "@/lib/business-info";

const heroPlant = heroAsset.url;
const heroAbsoluteUrl = `https://project--ef52ea49-28a7-4ca0-b0b9-5e515b1fb1f2.lovable.app${heroAsset.url}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jardiper · Vivero y Garden Center en Fraga (Huesca) · Bajo Cinca" },
      { name: "description", content: "Vivero familiar en Fraga con más de 50 años. Plantas hortícolas y ornamentales, sustratos Suliflor, compost ECO Liett Ibérica y macetas. Envíos y venta al por mayor en Bajo Cinca y Lleida." },
      { property: "og:title", content: "Jardiper · Vivero familiar en Fraga (Huesca)" },
      { property: "og:description", content: "Plantas, sustratos, compost y consejo experto desde 1974 en el Bajo Cinca." },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroAbsoluteUrl },
      { property: "og:image:width", content: "1600" },
      { property: "og:image:height", content: "1200" },
      { property: "og:image:alt", content: "Vivero Jardiper en Fraga (Huesca)" },
      { name: "twitter:image", content: heroAbsoluteUrl },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          ...localBusinessLd,
          image: heroAbsoluteUrl,
          logo: heroAbsoluteUrl,
          slogan: "Cultivamos plantas. Cultivamos historia.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Jardiper",
          url: "/",
          inLanguage: "es-ES",
          publisher: { "@id": "https://jardiper.es/#business" },
          potentialAction: {
            "@type": "SearchAction",
            target: "/productos?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <TeAyudamos />
      <Temporada />
    </SiteLayout>
  );
}

function Hero() {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroPlant}
          alt="Vivero Jardiper"
          className="h-full w-full object-cover scale-105 animate-[heroZoom_20s_ease-in-out_infinite_alternate]"
          width={1600}
          height={1200}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
      </div>
      <div className="container-page relative pt-24 pb-16">
        <div className="max-w-2xl fade-up">
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-medium mb-6">
            {t("home.eyebrow")}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] font-medium text-foreground">
            {t("home.titleA")}<br />
            <span className="italic text-primary">{t("home.titleB")}</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            {t("home.subtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/tu-huerto"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-all hover:gap-3"
            >
              {t("home.ctaGarden")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              {t("home.ctaVisit")}
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
        <span className="h-px w-8 bg-muted-foreground/60" /> {t("home.discover")}
      </div>
    </section>
  );
}

function TeAyudamos() {
  return (
    <section className="py-20 md:py-28 bg-primary text-primary-foreground">
      <div className="container-page grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary-foreground/70 mb-4">Te ayudamos</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            Cada planta viene con nuestro consejo.
          </h2>
          <p className="mt-6 text-primary-foreground/85 text-lg leading-relaxed max-w-lg">
            Calendarios de siembra, guías paso a paso y fichas detalladas de cada
            variedad. Todo lo que necesitas para que tu huerto o jardín prospere.
          </p>
          <Link
            to="/tu-huerto"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-foreground text-primary px-6 py-3 text-sm font-medium hover:gap-3 transition-all"
          >
            Ver Tu Huerto <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Sprout, t: "Calendario", d: "Hortícola mes a mes" },
            { icon: Sparkles, t: "Guías", d: "Cultivo paso a paso" },
            { icon: Sprout, t: "Fichas", d: "Enfermedades y cuidados" },
            { icon: Sparkles, t: "Consejo", d: "Del equipo Jardiper" },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl bg-primary-foreground/10 p-6 backdrop-blur">
              <f.icon className="h-5 w-5 mb-3" />
              <p className="font-serif text-xl">{f.t}</p>
              <p className="text-sm text-primary-foreground/70 mt-1">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Temporada() {
  return (
    <Section
      eyebrow="¿De qué es tiempo?"
      title="Plantas de temporada en el Bajo Cinca"
      intro="Estas variedades están en su mejor momento ahora mismo. Cultivarlas cuando toca es la mitad del éxito."
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {temporadaActual.map((p, i) => (
          <article
            key={p.id}
            className="relative aspect-square overflow-hidden rounded-2xl group hover-lift"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <img src={placeholderImg} alt={p.nombre} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5 text-white">
              <p className="text-xs opacity-80">{p.temporada}</p>
              <h3 className="font-serif text-2xl">{p.nombre}</h3>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Link
          to="/tu-huerto"
          hash="calendario"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
        >
          Ver Calendario Hortícola <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-24 grid md:grid-cols-2 gap-10 items-center">
        <img src={vivero} alt="Vivero Jardiper" loading="lazy" className="rounded-2xl w-full h-auto" width={1600} height={1000} />
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">El vivero</p>
          <h3 className="font-serif text-3xl md:text-4xl leading-tight">Ven a pasear entre plantas.</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Miles de referencias, un equipo que conoce cada rincón de la comarca y el mejor
            servicio técnico para tu huerto o jardín. Te esperamos en la A-131.
          </p>
          <Link to="/contacto" className="mt-6 inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium">
            Cómo llegar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}

