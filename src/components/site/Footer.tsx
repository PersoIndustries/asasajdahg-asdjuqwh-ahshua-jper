import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoAsset from "@/assets/brand/logo.png.asset.json";

export function Footer() {
  const { t } = useTranslation();
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
            {t("footer.tagline")}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <h4 className="font-serif text-lg text-foreground">{t("footer.visitUs")}</h4>
          <p className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            Carretera A-131 km 1,800<br />22520 Fraga, Huesca
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <a href="tel:+34974472158" className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4" /> 974 47 21 58</a>
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <a href="tel:+34611321620" className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4" /> 611 32 16 20</a>
          </p>
          <a
            href="https://instagram.com/jardiper"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Instagram className="h-4 w-4" /> @jardiper
          </a>
          <p className="flex items-start gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 mt-0.5" />
            <span>
              {t("footer.schedule")}<br />
              {t("footer.saturday")}<br />
              <span className="text-xs">{t("footer.closed")}</span>
            </span>
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <h4 className="font-serif text-lg text-foreground">{t("footer.explore")}</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="text-muted-foreground hover:text-primary">{t("nav.home")}</Link></li>
            <li><Link to="/productos" className="text-muted-foreground hover:text-primary">{t("nav.products")}</Link></li>
            <li><Link to="/tu-huerto" className="text-muted-foreground hover:text-primary">{t("nav.garden")}</Link></li>
            <li><Link to="/historia" className="text-muted-foreground hover:text-primary">{t("nav.history")}</Link></li>
            <li><Link to="/contacto" className="text-muted-foreground hover:text-primary">{t("nav.contact")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-page py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Jardiper · Horticultura Peralta S.L. · {t("footer.rights")}</p>
          <p>Fraga · Bajo Cinca · Huesca</p>
        </div>
      </div>
    </footer>
  );
}