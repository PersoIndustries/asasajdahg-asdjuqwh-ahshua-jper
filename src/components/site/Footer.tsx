import { Link } from "@tanstack/react-router";
import { Leaf, MapPin, Phone, Clock } from "lucide-react";
import logoAsset from "@/assets/brand/logo.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="container-page py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <img
              src={logoAsset.url}
              alt="Jardiper"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
            Vivero y garden center familiar en Fraga, Huesca. Más de 50 años cultivando
            plantas y consejo experto para el huerto y jardín del Bajo Cinca.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <h4 className="font-serif text-lg text-foreground">Visítanos</h4>
          <p className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            Carretera A-131 km 1,800<br />22520 Fraga, Huesca
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" /> 974 47 21 58
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" /> 611 32 16 20
          </p>
          <p className="flex items-start gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 mt-0.5" />
            Verano: L–V · 8:00–13:00 y 16:00–19:00
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <h4 className="font-serif text-lg text-foreground">Explora</h4>
          <ul className="space-y-2">
            <li><Link to="/informacion-campo" className="text-muted-foreground hover:text-primary">Información de Campo</Link></li>
            <li><Link to="/tierras-sustratos" className="text-muted-foreground hover:text-primary">Tierras y Sustratos</Link></li>
            <li><Link to="/historia" className="text-muted-foreground hover:text-primary">Historia</Link></li>
            <li><Link to="/libro-campo" className="text-muted-foreground hover:text-primary">Libro de Campo</Link></li>
            <li><Link to="/contacto" className="text-muted-foreground hover:text-primary">Contacto</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Jardiper · Horticultura Peralta S.L.</p>
          <p>Fraga · Bajo Cinca · Huesca</p>
        </div>
      </div>
    </footer>
  );
}