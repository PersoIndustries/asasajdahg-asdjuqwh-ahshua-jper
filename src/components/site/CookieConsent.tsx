import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, Cookie } from "lucide-react";
import { useTranslation } from "react-i18next";

type Consent = "accepted" | "rejected" | null;

const STORAGE_KEY = "jardiper-cookie-consent";

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Consent;
      if (saved === "accepted" || saved === "rejected") {
        setConsent(saved);
      }
    } catch {
      // localStorage no disponible
    }
  }, []);

  const save = (value: Consent) => {
    setConsent(value);
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // noop
    }
  };

  if (!mounted || consent) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("cookies.title")}
      className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6"
    >
      <div className="container-page">
        <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm md:text-base text-foreground leading-relaxed">
              {t("cookies.text")}{" "}
              <Link to="/cookies" className="text-primary underline underline-offset-2 hover:no-underline">
                {t("cookies.more")}
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => save("rejected")}
              className="rounded-full px-4 py-2 text-sm font-medium border border-border bg-background hover:bg-accent transition-colors"
            >
              {t("cookies.reject")}
            </button>
            <button
              onClick={() => save("accepted")}
              className="rounded-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("cookies.accept")}
            </button>
            <button
              onClick={() => save("rejected")}
              aria-label={t("cookies.reject")}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
