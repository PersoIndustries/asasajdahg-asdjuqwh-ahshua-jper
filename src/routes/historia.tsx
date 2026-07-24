import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import { familia } from "@/lib/mock-data";
import historiaImg from "@/assets/historia.jpg";
import img1974 from "@/assets/historia-1974.jpg";
import img1989 from "@/assets/historia-1989.jpg";
import img2003 from "@/assets/historia-2003.jpg";
import img2015 from "@/assets/historia-2015.jpg";
import img2024 from "@/assets/historia-2024.jpg";

export const Route = createFileRoute("/historia")({
  head: () => ({
    meta: [
      { title: "Historia · Jardiper" },
      { name: "description", content: "De Horticultura Peralta a Jardiper. Más de 50 años de historia familiar en Fraga." },
      { property: "og:title", content: "Historia · Jardiper" },
      { property: "og:description", content: "50 años cultivando plantas y comunidad en el Bajo Cinca." },
    ],
  }),
  component: HistoriaPage,
});

const hitos = [
  { año: "1974", titulo: "Nace Horticultura Peralta", texto: "Antonio Peralta funda la explotación hortícola familiar en Fraga.", img: img1974, alt: "Invernadero familiar de los años 70 en Fraga" },
  { año: "1989", titulo: "Primer garden center", texto: "Ampliamos con venta al público y ornamentales.", img: img1989, alt: "Fachada del primer garden center de Jardiper" },
  { año: "2003", titulo: "Distribuidor Suliflor", texto: "Comenzamos a trabajar los sustratos profesionales Suliflor España.", img: img2003, alt: "Sacas de sustrato profesional Suliflor" },
  { año: "2015", titulo: "Nueva sede A-131", texto: "Instalaciones actuales con más de 5.000 m² de vivero.", img: img2015, alt: "Vista aérea de las instalaciones de Jardiper junto a la A-131" },
  { año: "2024", titulo: "Jardiper digital", texto: "Lanzamos guías online y el proyecto Libro de Campo.", img: img2024, alt: "Tablet con la app Libro de Campo sobre mesa de jardinería" },
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
        <ol className="relative border-l-2 border-primary/20 ml-3 space-y-10">
          {hitos.map((h) => (
            <li key={h.año} className="pl-8 relative">
              <span className="absolute -left-[11px] top-1 h-5 w-5 rounded-full bg-primary ring-4 ring-background" />
              <p className="font-serif text-3xl text-primary">{h.año}</p>
              <h3 className="font-serif text-xl mt-1">{h.titulo}</h3>
              <p className="text-muted-foreground mt-1 max-w-lg">{h.texto}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="La familia" title="Tres generaciones detrás del mostrador">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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