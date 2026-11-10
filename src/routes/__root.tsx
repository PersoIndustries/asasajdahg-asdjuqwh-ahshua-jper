import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { localBusinessLd } from "../lib/business-info";
import { activarCachePersistente } from "../lib/cache-persistente";
import { PaginaNoEncontrada, PaginaError } from "../components/site/ErrorPages";
import "../i18n";

function NotFoundComponent() {
  return <PaginaNoEncontrada />;
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return <PaginaError reset={reset} />;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Jardiper · Vivero y Garden Center en Fraga (Huesca) desde 1974" },
      { name: "description", content: "Vivero familiar en Fraga (Huesca) desde 1974. Plantas de huerto y jardín, sustratos Suliflor, compost ECO, macetas y consejo experto en el Bajo Cinca y Lleida." },
      { name: "keywords", content: "vivero Fraga, garden center Huesca, plantas Bajo Cinca, sustratos Suliflor, compost ECO, jardinería Lleida, macetas, huerto Fraga, Jardiper" },
      { name: "author", content: "Jardiper" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "theme-color", content: "#3d5a3d" },
      { name: "format-detection", content: "telephone=yes" },
      { name: "geo.region", content: "ES-HU" },
      { name: "geo.placename", content: "Fraga, Huesca" },
      { name: "geo.position", content: "41.5322062;0.3163568" },
      { name: "ICBM", content: "41.5322062, 0.3163568" },
      { property: "og:site_name", content: "Jardiper" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:locale:alternate", content: "fr_FR" },
      { property: "og:locale:alternate", content: "de_DE" },
      { property: "og:title", content: "Jardiper · Vivero y Garden Center en Fraga" },
      { property: "og:description", content: "Plantas, huerto y jardinería con más de 50 años de historia familiar en el Bajo Cinca." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Jardiper · Vivero y Garden Center en Fraga" },
      { name: "twitter:description", content: "Vivero familiar en Fraga (Huesca) desde 1974. Plantas, sustratos y consejo experto." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(localBusinessLd),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => activarCachePersistente(queryClient), [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
