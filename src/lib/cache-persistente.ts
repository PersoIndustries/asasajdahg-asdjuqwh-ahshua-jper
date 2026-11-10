import type { QueryClient } from "@tanstack/react-query";

// Guarda en el navegador los datos públicos del catálogo (claves "cms") para
// que la siguiente visita se muestre al instante; luego se revalida en segundo plano.
const CLAVE = "jardiper.cache.v1";
const MAX_EDAD = 7 * 24 * 60 * 60 * 1000; // 7 días

type Entrada = { key: unknown[]; data: unknown; updatedAt: number };

export function activarCachePersistente(queryClient: QueryClient): () => void {
  if (typeof window === "undefined") return () => {};

  try {
    const raw = window.localStorage.getItem(CLAVE);
    if (raw) {
      const guardado = JSON.parse(raw) as { ts: number; entries: Entrada[] };
      if (Date.now() - guardado.ts < MAX_EDAD) {
        for (const e of guardado.entries) {
          const actual = queryClient.getQueryState(e.key);
          if (!actual || actual.dataUpdatedAt < e.updatedAt) {
            queryClient.setQueryData(e.key, e.data, { updatedAt: e.updatedAt });
          }
        }
      } else {
        window.localStorage.removeItem(CLAVE);
      }
    }
  } catch {
    // caché corrupta o no disponible: se ignora
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  const guardar = () => {
    try {
      const entries: Entrada[] = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["cms"] })
        .filter((q) => q.state.status === "success" && !q.isDisabled())
        .filter((q) => !(Array.isArray(q.state.data) && q.state.data.length === 0))
        .map((q) => ({
          key: q.queryKey as unknown[],
          data: q.state.data,
          updatedAt: q.state.dataUpdatedAt,
        }));
      if (entries.length === 0) return;
      window.localStorage.setItem(CLAVE, JSON.stringify({ ts: Date.now(), entries }));
    } catch {
      // cuota llena o sin acceso: se ignora
    }
  };

  const unsub = queryClient.getQueryCache().subscribe((ev) => {
    if (ev.type !== "updated" || ev.query.queryKey[0] !== "cms") return;
    clearTimeout(timer);
    timer = setTimeout(guardar, 500);
  });

  return () => {
    clearTimeout(timer);
    unsub();
  };
}
