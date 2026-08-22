import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import { familia } from "@/lib/mock-data";
import historiaImg from "@/assets/historia/portada.jpg";
import img1974 from "@/assets/historia/1974.jpg";
import gal0 from "@/assets/instalaciones/instalaciones-0.jpg.asset.json";
import gal1 from "@/assets/instalaciones/instalaciones-1.jpg.asset.json";
import gal2 from "@/assets/instalaciones/instalaciones-2.jpg.asset.json";
import gal3 from "@/assets/instalaciones/instalaciones-3.jpg.asset.json";


export const Route = createFileRoute("/historia")({
  head: () => ({
    meta: [
      { title: "Historia · 50 años del vivero Jardiper en Fraga · Bajo Cinca" },
      { name: "description", content: "De Horticultura Peralta a Jardiper: más de 50 años de historia familiar cultivando plantas y comunidad en Fraga, el corazón del Bajo Cinca." },
      { name: "keywords", content: "historia Jardiper, Horticultura Peralta, vivero familiar Fraga, garden center Huesca desde 1974" },
      { property: "og:title", content: "Historia · Jardiper" },
      { property: "og:description", content: "50 años cultivando plantas y comunidad en el Bajo Cinca." },
      { property: "og:url", content: "/historia" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "/historia" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
            { "@type": "ListItem", position: 2, name: "Historia", item: "/historia" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Historia de Jardiper",
          url: "/historia",
          about: { "@id": "https://jardiper.es/#business" },
        }),
      },
    ],
  }),
  component: HistoriaPage,
});

const hitos = [
  { año: "1974", titulo: "Nace Horticultura Peralta", texto: "Salvador Peralta funda la explotación hortícola familiar en Fraga, el origen de todo lo que hoy es Jardiper.", img: img1974, alt: "Invernadero familiar de los años 70 en Fraga" },
];

function HistoriaPage() {
  return (
    <SiteLayout>
      <section className="pt-20">
        <div className="container-page grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Nuestra historia</p>
            <h1 className="font-serif text-5xl md:text-6xl leading-tight">
              Cincuenta años<br /><span className="italic text-primary">cultivando raíces.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              De un pequeño invernadero en las afueras de Fraga a un garden center de
              referencia en el Bajo Cinca. La familia Peralta lleva medio siglo mimando
              cada planta como si fuera para su propio huerto.
            </p>
          </div>
          <img src={historiaImg} alt="Familia Jardiper" width={1400} height={1000} className="rounded-2xl w-full h-auto shadow-xl" loading="lazy" />
        </div>
      </section>

      <Section eyebrow="Línea del tiempo" title="Momentos que nos han hecho">
        <ol className="relative border-l-2 border-primary/20 ml-3 md:ml-1/2 md:-translate-x-px space-y-14 md:space-y-20">
          {hitos.map((h, i) => {
            const isEven = i % 2 === 0;
            return (
              <li key={h.año} className="pl-8 md:pl-0 relative md:grid md:grid-cols-2 md:gap-12 md:items-center">
                <span className="absolute -left-[11px] md:left-1/2 md:-translate-x-1/2 top-1 h-5 w-5 rounded-full bg-primary ring-4 ring-background z-10" />

                <div className={`${isEven ? "md:col-start-1 md:text-right md:pr-8" : "md:col-start-2 md:pl-8"}`}>
                  <p className="font-serif text-3xl text-primary">{h.año}</p>
                  <h3 className="font-serif text-xl mt-1">{h.titulo}</h3>
                  <p className="text-muted-foreground mt-1 max-w-md md:max-w-none">{h.texto}</p>
                </div>

                <div className={`mt-4 md:mt-0 ${isEven ? "md:col-start-2 md:pl-8" : "md:col-start-1 md:row-start-1 md:pr-8"}`}>
                  <img
                    src={h.img}
                    alt={h.alt}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="rounded-2xl w-full h-auto shadow-lg object-cover aspect-[4/3] hover-lift"
                  />
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-10 rounded-2xl border border-dashed border-primary/30 bg-secondary/40 p-5 text-sm text-muted-foreground leading-relaxed">
          Esta web todavía está en desarrollo: próximamente ampliaremos este apartado con
          más hitos, fotografías y recuerdos de nuestros más de 50 años de historia.
        </p>
      </Section>

      <Section eyebrow="La familia" title="Tres generaciones detrás del mostrador">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familia.map((f) => (
            <article key={f.nombre} className="rounded-2xl bg-secondary/50 p-6 hover-lift">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent mb-4 flex items-center justify-center text-primary-foreground font-serif text-2xl">
                {f.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <h3 className="font-serif text-xl">{f.nombre}</h3>
              <p className="text-xs uppercase tracking-widest text-accent mt-1">{f.rol}</p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.bio}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Galería"
        title="Nuestras instalaciones"
        intro="Más de 5.000 m² de vivero junto a la A-131: invernaderos, zona exterior de árboles y arbustos, tienda y patio de sustratos."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { src: gal0.url, alt: "Vista aérea de los invernaderos de Jardiper al atardecer" },
            { src: gal1.url, alt: "Interior del invernadero de plantel hortícola de Jardiper" },
            { src: gal2.url, alt: "Invernaderos y zona de cultivo exterior del vivero" },
            { src: gal3.url, alt: "Nave de venta con planta de temporada y ornamentales" },
          ].map((g) => (
            <figure key={g.alt} className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src={g.src}
                alt={g.alt}
                width={1280}
                height={960}
                loading="lazy"
                className="w-full h-full object-cover aspect-[4/3] transition-transform duration-500 hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </Section>


      <section className="bg-secondary/40 py-20">
        <div className="container-page grid md:grid-cols-3 gap-8">
          {[
            { t: "Cercanía", d: "Conocemos cada suelo y cada microclima de la comarca. Te lo llevamos escrito en la ficha." },
            { t: "Producto vivo", d: "Trabajamos con productores locales y variedades autóctonas siempre que es posible." },
            { t: "Consejo honesto", d: "Si algo no funciona para tu jardín, te lo decimos. Vendemos plantas, no promesas." },
          ].map((v) => (
            <div key={v.t}>
              <h3 className="font-serif text-2xl">{v.t}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}