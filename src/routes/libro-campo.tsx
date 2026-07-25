import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Sprout, Calendar, LineChart, Bell, Lock } from "lucide-react";
import { SiteLayout, Section } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/libro-campo")({
  head: () => ({
    meta: [
      { title: "Libro de Campo · Jardiper" },
      { name: "description", content: "Tu cuaderno digital del huerto: siembras, cosechas, tratamientos y observaciones. Próximamente disponible." },
      { property: "og:title", content: "Libro de Campo · Jardiper" },
      { property: "og:description", content: "El cuaderno digital de tu huerto." },
      { property: "og:url", content: "/libro-campo" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/libro-campo" }],
  }),
  component: LibroCampo,
});

// TODO: cuando Lovable Cloud esté activo, sustituir el mockup por la aplicación real
// con auth (Supabase) y CRUD de siembras/cosechas/tratamientos.

function LibroCampo() {
  return (
    <SiteLayout>
      <section className="pt-20 pb-12">
        <div className="container-page max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 text-accent px-4 py-1.5 text-xs uppercase tracking-widest mb-6">
            <BookOpen className="h-3.5 w-3.5" /> Próximamente
          </div>
          <h1 className="font-serif text-5xl md:text-7xl leading-tight">
            El Libro de Campo<br /><span className="italic text-primary">de tu huerto.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Un cuaderno digital para registrar siembras, cosechas, tratamientos y
            observaciones. Guarda el conocimiento de tu huerto año tras año.
          </p>
        </div>
      </section>

      <Section eyebrow="Cómo funcionará" title="Todo tu huerto en un solo lugar">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <Section eyebrow="Vista previa" title="Así se verá tu Libro de Campo">
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-2xl">
          <div className="bg-secondary/60 px-6 py-3 flex items-center gap-2 border-b border-border">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-4 text-xs text-muted-foreground">libro-campo.jardiper.es</span>
          </div>
          <div className="grid md:grid-cols-[220px_1fr] min-h-[500px]">
            <aside className="border-r border-border p-6 bg-secondary/30 space-y-2 text-sm">
              {["Panel", "Mis siembras", "Cosechas", "Tratamientos", "Calendario", "Notas"].map((n, i) => (
                <div key={n} className={`px-3 py-2 rounded-lg ${i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{n}</div>
              ))}
            </aside>
            <div className="p-8">
              <h4 className="font-serif text-2xl">Panel de tu huerto</h4>
              <p className="text-sm text-muted-foreground">Temporada 2026</p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { l: "Plantas activas", v: "24" },
                  { l: "Cosechas del mes", v: "7,2 kg" },
                  { l: "Próximas tareas", v: "3" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-secondary/60 p-4">
                    <p className="text-xs text-muted-foreground">{s.l}</p>
                    <p className="font-serif text-3xl mt-1">{s.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Últimas anotaciones</p>
                <ul className="space-y-3">
                  {[
                    { p: "Tomate Rosa", a: "Trasplante · Bancal 2", d: "Hace 3 días" },
                    { p: "Calabacín", a: "Cosecha · 1,4 kg", d: "Hace 1 semana" },
                    { p: "Boniato", a: "Riego programado", d: "Ayer" },
                  ].map((n) => (
                    <li key={n.p} className="flex items-center justify-between border-b border-border pb-3 text-sm">
                      <div>
                        <p className="font-medium">{n.p}</p>
                        <p className="text-muted-foreground text-xs">{n.a}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{n.d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
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
          {/* TODO: sustituir por botón "Crear cuenta" / "Acceder" cuando el auth esté listo. */}
          <button
            disabled
            className="mt-8 rounded-full bg-primary-foreground/20 text-primary-foreground px-6 py-3 text-sm font-medium cursor-not-allowed"
          >
            Acceder (próximamente)
          </button>
        </div>
      </section>
    </SiteLayout>
  );
}