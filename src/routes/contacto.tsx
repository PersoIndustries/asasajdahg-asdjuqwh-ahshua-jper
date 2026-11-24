import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Clock, Mail, Check } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { localBusinessLd, businessInfo, openingHoursSpecification, postalAddressLd, geoCoordinatesLd } from "@/lib/business-info";
import { HORARIO_POR_DEFECTO, useHorario } from "@/lib/horario";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { property: "og:image", content: "https://jardiper.es/media/home/jardiper-vivero-compartir.jpg" },
      { name: "twitter:image", content: "https://jardiper.es/media/home/jardiper-vivero-compartir.jpg" },
      { title: "Contacto · Vivero Jardiper Fraga · Teléfono, mapa y horario" },
      { name: "description", content: "Visita Jardiper en Carretera A-131 km 1,800, Fraga (Huesca). Horario de invierno: lunes a viernes 8:00–13:00 y 15:00–18:00; sábados 9:00–13:00. Teléfono 974 47 21 58." },
      { name: "keywords", content: "contacto vivero Fraga, teléfono Jardiper, cómo llegar, horario garden center Fraga" },
      { property: "og:title", content: "Contacto · Jardiper" },
      { property: "og:description", content: "Cómo llegar, horarios y contacto directo." },
      { property: "og:url", content: "/contacto" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://jardiper.es/contacto" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
            { "@type": "ListItem", position: 2, name: "Contacto", item: "/contacto" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          ...localBusinessLd,
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: businessInfo.telephone,
              contactType: "customer service",
              areaServed: "ES",
              availableLanguage: ["Spanish", "Catalan", "English", "French", "German"],
              hoursAvailable: openingHoursSpecification,
            },
            {
              "@type": "ContactPoint",
              telephone: businessInfo.telephoneSecondary,
              contactType: "sales",
              areaServed: "ES",
              availableLanguage: ["Spanish", "Catalan", "English", "French", "German"],
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contacto · Jardiper",
          url: "/contacto",
          about: { "@id": "https://jardiper.es/#business" },
          mainEntity: {
            "@type": "LocalBusiness",
            "@id": "https://jardiper.es/#business",
            name: businessInfo.name,
            telephone: businessInfo.telephone,
            email: businessInfo.email,
            address: postalAddressLd,
            geo: geoCoordinatesLd,
            openingHoursSpecification,
          },
        }),
      },
    ],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  const horario = useHorario().data ?? HORARIO_POR_DEFECTO;
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
                <h2 className="font-serif text-xl">Vivero Jardiper</h2>
                <p className="text-muted-foreground mt-1">Carretera A-131 km 1,800<br />22520 Fraga, Huesca</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h2 className="font-serif text-xl">Teléfonos</h2>
                <p className="text-muted-foreground mt-1">
                  <a href="tel:974472158" className="hover:text-primary">974 47 21 58</a><br />
                  <a href="tel:611321620" className="hover:text-primary">611 32 16 20</a>
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h2 className="font-serif text-xl">Horario</h2>
                <div className="text-muted-foreground mt-1 space-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-accent mb-1">{horario.titulo}</p>
                    {horario.bloques.map((b, i) => (
                      <p key={i} className={i ? "mt-2" : undefined}>{b.dias}{b.horas.map((x) => <span key={x}><br />{x}</span>)}</p>
                    ))}
                  </div>
                  {horario.nota && <p className="text-xs">{horario.nota}</p>}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h2 className="font-serif text-xl">Email</h2>
                <p className="text-muted-foreground mt-1">
                  <a href="mailto:correo@jardiper.es" className="hover:text-primary">correo@jardiper.es</a>
                </p>
              </div>
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border">
              <iframe
                title="Mapa Jardiper"
                src="https://www.openstreetmap.org/export/embed.html?bbox=0.3063,41.5272,0.3263,41.5372&layer=mapnik&marker=41.5322062,0.3163568"
                className="w-full h-full"
                loading="lazy"
              />
              <a
                href="https://www.google.com/maps/place/JARDIPER/@41.5322062,0.3163568,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="sr-only"
              >
                Ver Jardiper en Google Maps
              </a>
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