import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Clock, Mail, Check } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto · Jardiper Fraga" },
      { name: "description", content: "Visita Jardiper en Carretera A-131 km 1,800, Fraga. Horarios, teléfonos y formulario de contacto." },
      { property: "og:title", content: "Contacto · Jardiper" },
      { property: "og:description", content: "Cómo llegar, horarios y contacto directo." },
    ],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  const [sent, setSent] = useState(false);
  // TODO: conectar formulario a Lovable Cloud (edge function o Resend) más adelante.
  return (
    <SiteLayout>
      <section className="pt-20 pb-12">
        <div className="container-page">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Contacto</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-tight max-w-3xl">
            Ven a vernos, o escríbenos.
          </h1>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex gap-4">
              <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-serif text-xl">Vivero Jardiper</h3>
                <p className="text-muted-foreground mt-1">Carretera A-131 km 1,800<br />22520 Fraga, Huesca</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-serif text-xl">Teléfonos</h3>
                <p className="text-muted-foreground mt-1">
                  <a href="tel:974472158" className="hover:text-primary">974 47 21 58</a><br />
                  <a href="tel:611321620" className="hover:text-primary">611 32 16 20</a>
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-serif text-xl">Horario</h3>
                <p className="text-muted-foreground mt-1">
                  Lunes a Sábado<br />9:00 – 13:30 · 16:00 – 20:00<br />Domingo cerrado
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-serif text-xl">Email</h3>
                <p className="text-muted-foreground mt-1">
                  <a href="mailto:hola@jardiper.es" className="hover:text-primary">hola@jardiper.es</a>
                </p>
              </div>
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border">
              <iframe
                title="Mapa Jardiper"
                src="https://www.openstreetmap.org/export/embed.html?bbox=0.325,41.520,0.360,41.545&layer=mapnik&marker=41.5322,0.3416"
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-8 md:p-10 h-fit">
            <h2 className="font-serif text-3xl">Escríbenos</h2>
            <p className="text-muted-foreground mt-2 text-sm">Te contestamos en 24-48h laborables.</p>
            {sent ? (
              <div className="mt-8 rounded-xl bg-primary/10 p-8 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <Check className="h-6 w-6" />
                </div>
                <p className="font-serif text-xl">¡Mensaje enviado!</p>
                <p className="text-sm text-muted-foreground mt-2">Te contactaremos pronto. (versión demo)</p>
              </div>
            ) : (
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <input required placeholder="Nombre" className="rounded-lg border border-input bg-background px-4 py-3 text-sm" />
                  <input required placeholder="Apellidos" className="rounded-lg border border-input bg-background px-4 py-3 text-sm" />
                </div>
                <input required type="email" placeholder="Email" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm" />
                <input placeholder="Teléfono (opcional)" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm" />
                <select className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm">
                  <option>Consulta general</option>
                  <option>Pedido de plantas</option>
                  <option>Sustratos al por mayor</option>
                  <option>Consejo técnico</option>
                </select>
                <textarea required rows={5} placeholder="Cuéntanos…" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm" />
                <button className="w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-medium hover:bg-primary/90 transition-colors">
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}