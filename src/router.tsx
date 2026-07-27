import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { PaginaNoEncontrada, PaginaError } from "./components/site/ErrorPages";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => <PaginaNoEncontrada />,
    defaultErrorComponent: ({ reset }) => <PaginaError reset={reset} />,
  });

  return router;
};
