import { Link, useRouter } from "@tanstack/react-router";
import { Home, RefreshCw, Leaf, Search, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

const enlaces = [
  { to: "/productos", label: "Catálogo de productos" },
  { to: "/tu-huerto", label: "Tu huerto: guías y calendario" },
  { to: "/blog", label: "Noticias y curiosidades" },
  { to: "/contacto", label: "Contacto" },
] as const;

function Marco({
  eyebrow,
  titulo,
  texto,
  children,
}: {
  eyebrow: string;
  titulo: string;
  texto: string;
  children?: React.ReactNode;
}) {
  return (
    <SiteLayout>
      <section className="pt-32 md:pt-40 pb-24">
        <div className="container-page max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-accent">
            <Leaf className="h-3.5 w-3.5" /> {eyebrow}
          </span>
          <h1 className="mt-6 font-serif text-5xl md:text-6xl leading-tight">{titulo}</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{texto}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>

          <div className="mt-14 border-t border-border/60 pt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Quizá buscabas
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {enlaces.map((e) => (
                <Link
                  key={e.to}
                  to={e.to}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-secondary/60 transition-colors"
                >
                  <Search className="h-3.5 w-3.5 text-primary" /> {e.label}
                </Link>
              ))}
            </div>
            <a
              href="tel:+34974472158"
              className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4"
            >
              <Phone className="h-4 w-4" /> ¿Necesitas ayuda? 974 47 21 58
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export function PaginaNoEncontrada() {
  return (
    <Marco
      eyebrow="Error 404"
      titulo="Esta página se nos ha quedado sin trasplantar"
      texto="La dirección que has abierto no existe o la hemos movido de sitio. No te preocupes: desde aquí puedes volver al vivero."
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Home className="h-4 w-4" /> Volver al inicio
      </Link>
      <Link
        to="/productos"
        className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-secondary/60 transition-colors"
      >
        Ver el catálogo
      </Link>
    </Marco>
  );
}

export function PaginaError({ reset }: { reset?: () => void }) {
  const router = useRouter();
  return (
    <Marco
      eyebrow="Algo ha fallado"
      titulo="No hemos podido cargar esta página"
      texto="Ha ocurrido un problema técnico por nuestra parte. Puedes intentarlo de nuevo o volver al inicio; si sigue pasando, llámanos y lo miramos."
    >
      <button
        onClick={() => {
          router.invalidate();
          reset?.();
        }}
        className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <RefreshCw className="h-4 w-4" /> Reintentar
      </button>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-secondary/60 transition-colors"
      >
        <Home className="h-4 w-4" /> Volver al inicio
      </Link>
    </Marco>
  );
}
