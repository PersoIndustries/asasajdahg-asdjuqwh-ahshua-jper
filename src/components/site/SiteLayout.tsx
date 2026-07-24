import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { CookieConsent } from "./CookieConsent";
import { WhatsAppButton } from "./WhatsAppButton";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  );
}

export function Section({
  children,
  className = "",
  eyebrow,
  title,
  intro,
}: {
  children?: ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  return (
    <section className={`py-20 md:py-28 ${className}`}>
      <div className="container-page">
        {(eyebrow || title || intro) && (
          <div className="max-w-2xl mb-12 md:mb-16">
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground leading-tight">
                {title}
              </h2>
            )}
            {intro && <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}