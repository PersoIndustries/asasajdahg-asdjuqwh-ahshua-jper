import { useState } from "react";
import { X } from "lucide-react";
import type { PlagaFicha } from "@/lib/mock-data";

/**
 * Sección «Plagas, enfermedades y cómo combatirlas» tal y como se ve en la
 * ficha del catálogo. Se comparte entre la web pública y la vista previa del
 * gestor para que ambas se vean exactamente igual.
 */
export function SeccionPlagas({
  plagas,
  onZoom,
}: {
  plagas: PlagaFicha[];
  onZoom?: (img: { src: string; alt: string }) => void;
}) {
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
  const ampliar = onZoom ?? setZoom;
  if (plagas.length === 0) return null;

  return (
    <div>
      <h4 className="font-serif text-lg mb-2">Plagas, enfermedades y cómo combatirlas</h4>
      <ul className="space-y-4">
        {plagas.map((e) => (
          <li key={e.nombre} className="text-sm flex gap-3">
            <button
              type="button"
              onClick={() => ampliar({ src: e.imagen, alt: e.nombre })}
              className="shrink-0 rounded-lg overflow-hidden border border-border hover:opacity-90 transition"
              aria-label={`Ampliar imagen de ${e.nombre}`}
            >
              <img src={e.imagen} alt={e.nombre} loading="lazy" className="h-16 w-16 object-cover" />
            </button>
            <div className="space-y-1">
              <p className="font-medium text-foreground">{e.nombre}</p>
              {e.descripcion && <p className="text-muted-foreground">{e.descripcion}</p>}
              {e.prevencion && (
                <p className="text-muted-foreground">
                  <span className="text-foreground/80 font-medium">Prevención:</span> {e.prevencion}
                </p>
              )}
              {e.combate && (
                <p className="text-muted-foreground">
                  <span className="text-foreground/80 font-medium">Cómo combatirla:</span> {e.combate}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {!onZoom && zoom && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/80 p-4"
          onClick={() => setZoom(null)}
        >
          <button
            type="button"
            aria-label="Cerrar imagen"
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80"
            onClick={() => setZoom(null)}
          >
            <X className="h-4 w-4" />
          </button>
          <img src={zoom.src} alt={zoom.alt} className="max-h-[85vh] max-w-full rounded-xl object-contain" />
        </div>
      )}
    </div>
  );
}
