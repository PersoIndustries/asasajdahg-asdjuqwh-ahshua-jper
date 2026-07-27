import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES, setLanguage, type SupportedLang } from "@/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = (i18n.language?.slice(0, 2) ?? "es") as SupportedLang;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("nav.language")}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs uppercase tracking-widest text-foreground/70 hover:text-primary hover:border-primary/60 transition-colors"
      >
        <Globe className="h-3.5 w-3.5" />
        {current}
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 min-w-[140px] rounded-xl bg-background border border-border shadow-lg overflow-hidden z-50"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                role="option"
                aria-selected={current === l.code}
                onClick={() => {
                  setLanguage(l.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-secondary transition-colors ${
                  current === l.code ? "text-primary" : "text-foreground/80"
                }`}
              >
                {l.label}
                {current === l.code && <Check className="h-3.5 w-3.5" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}