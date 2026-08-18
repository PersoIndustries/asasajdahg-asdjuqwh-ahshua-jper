// Loaders visuales mientras se descargan los datos del catálogo desde Supabase.

import { Loader2 } from "lucide-react";

/** Rejilla de tarjetas «fantasma» con la misma forma que el catálogo. */
export function GridSkeleton({
  items = 8,
  className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
  aspect = "aspect-square",
}: {
  items?: number;
  className?: string;
  aspect?: string;
}) {
  return (
    <div className={className} aria-busy="true" aria-live="polite">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className={`${aspect} rounded-2xl bg-muted mb-3`} />
          <div className="h-4 w-2/3 rounded bg-muted mb-2" />
          <div className="h-3 w-1/2 rounded bg-muted/70" />
        </div>
      ))}
    </div>
  );
}

/** Indicador compacto en línea. */
export function CargandoLinea({ texto = "Cargando datos…" }: { texto?: string }) {
  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground py-8" aria-live="polite">
      <Loader2 className="h-4 w-4 animate-spin text-primary" /> {texto}
    </p>
  );
}
