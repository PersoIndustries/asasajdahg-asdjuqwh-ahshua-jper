import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Sprout, Hammer, LogOut, CalendarDays, NotebookPen, Bell } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth, cerrarSesion } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/cuenta")({
  head: () => ({
    meta: [
      { title: "Mi cuenta · Gestor de huerto Jardiper (en construcción)" },
      { name: "description", content: "Estamos trabajando en tu gestor de huerto personal y en más aplicaciones para ti y tu huerto." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Mi cuenta · Jardiper" },
      { property: "og:description", content: "Tu gestor de huerto personal, en construcción." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CuentaPage,
});

const proximamente = [
  { icon: CalendarDays, titulo: "Tu calendario", texto: "Siembras, trasplantes y cosechas ajustados a tu huerto y tu clima." },
  { icon: NotebookPen, titulo: "Libro de campo", texto: "Anota qué plantaste, cuándo y cómo fue la temporada." },
  { icon: Bell, titulo: "Avisos", texto: "Te recordamos las labores del mes y las novedades del vivero." },
];

function CuentaPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const salir = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await cerrarSesion();
    navigate({ to: "/", replace: true });
  };

  return (
    <SiteLayout>
      <section className="py-20 md:py-28">
        <div className="container-page max-w-3xl">
          <div className="rounded-3xl border border-border bg-card p-8 md:p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sage/30">
              <Hammer className="h-7 w-7 text-primary" aria-hidden />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-medium mb-4">
              Estamos trabajando en tu gestor de huerto
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Gracias por registrarte{user?.email ? `, ${user.email}` : ""}. Estamos preparando tu
              gestor de huerto y más aplicaciones para ti y tu huerto. Te avisaremos en cuanto
              esté listo.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mt-10 text-left">
              {proximamente.map(({ icon: Icon, titulo, texto }) => (
                <div key={titulo} className="rounded-2xl border border-border/70 bg-background p-5">
                  <Icon className="h-5 w-5 text-accent mb-3" aria-hidden />
                  <p className="font-medium text-sm mb-1">{titulo}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{texto}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/tu-huerto"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Sprout className="h-4 w-4" aria-hidden />
                Mientras tanto, visita Tu huerto
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
                >
                  Ir al gestor de la web
                </Link>
              )}
              <button
                type="button"
                onClick={salir}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
