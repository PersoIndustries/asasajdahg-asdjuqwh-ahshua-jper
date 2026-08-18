import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "./SiteLayout";

const LEGAL_LINKS = [
  { to: "/aviso-legal", label: "Aviso legal" },
  { to: "/privacidad", label: "Política de privacidad" },
  { to: "/cookies", label: "Política de cookies" },
] as const;

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated = "Agosto de 2026",
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <SiteLayout>
      <section className="py-16 md:py-24">
        <div className="container-page max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium">{eyebrow}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground leading-tight">{title}</h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{intro}</p>
          <p className="mt-2 text-xs text-muted-foreground">Última actualización: {updated}</p>

          <nav aria-label="Documentos legales" className="mt-8 flex flex-wrap gap-2">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                activeProps={{ className: "rounded-full border border-primary/50 bg-primary/10 px-4 py-1.5 text-sm text-primary" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="mt-12 space-y-10">{children}</div>
        </div>
      </section>
    </SiteLayout>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-2xl text-foreground">{title}</h2>
      <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
