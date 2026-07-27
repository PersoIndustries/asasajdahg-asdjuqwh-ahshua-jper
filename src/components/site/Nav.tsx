import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoAsset from "@/assets/brand/logo.png.asset.json";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";

const linkDefs = [
  { to: "/", key: "home" },
  { to: "/productos", key: "products" },
  { to: "/guias", key: "guides" },
  { to: "/tu-huerto", key: "garden" },
  { to: "/historia", key: "history" },
  { to: "/contacto", key: "contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 md:h-20 items-center justify-between">
        <Link to="/" className="flex items-center group" aria-label={`Jardiper — ${t("nav.home")}`}>
          <img
            src={logoAsset.url}
            alt="Jardiper — Jardinería, Viveros y Medio Ambiente"
            className="h-9 md:h-11 w-auto transition-transform group-hover:scale-[1.03]"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {linkDefs.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-foreground/80 hover:text-primary transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              activeProps={{ className: "text-primary" }}
            >
              {t(`nav.${l.key}`)}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            to="/contacto"
            className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t("nav.visitUs")}
          </Link>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            className="p-2 -mr-2"
            onClick={() => setOpen((o) => !o)}
            aria-label={t("nav.openMenu")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border">
          <nav className="container-page flex flex-col py-4 gap-1">
            {linkDefs.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base border-b border-border/50 last:border-0"
                activeProps={{ className: "text-primary" }}
              >
                {t(`nav.${l.key}`)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}