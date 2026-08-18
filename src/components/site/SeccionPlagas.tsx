import { useState } from "react";
import { X, ChevronDown, ShieldCheck, Sprout, Info, FileText } from "lucide-react";
import type { PlagaFicha } from "@/lib/mock-data";

/**
 * Sección «Plagas, enfermedades y cómo combatirlas» en formato lista:
 * cada fila muestra sólo la imagen cuadrada y el nombre, y al desplegar
 * aparece la información base, la prevención y el tratamiento.
 */
function Fila({
  plaga,
  onZoom,
}: {
  plaga: PlagaFicha;
  onZoom: (img: { src: string; alt: string }) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const detalles = [
    { icono: FileText, titulo: "Información", texto: plaga.descripcion },
    { icono: ShieldCheck, titulo: "Prevención", texto: plaga.prevencion },
    { icono: Sprout, titulo: "Tratamiento", texto: plaga.combate },
    { icono: Info, titulo: "Otros datos", texto: plaga.otrosDatos },
  ].filter((d) => d.texto);

  return (
    <li className="border-b border-border last:border-b-0">
      <div className="flex items-center gap-3 px-3 py-2">
        <button
          type="button"
          onClick={() => onZoom({ src: plaga.imagen, alt: plaga.nombre })}
          className="shrink-0 rounded-md overflow-hidden border border-border hover:opacity-90 transition"
          aria-label={`Ampliar imagen de ${plaga.nombre}`}
        >
          <span className="block h-12 w-12 aspect-square">
            <img
              src={plaga.imagen}
              alt={plaga.nombre}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          disabled={detalles.length === 0}
          className="flex-1 flex items-center justify-between gap-3 text-left min-w-0 disabled:cursor-default"
        >
          <span className="font-medium text-foreground truncate">{plaga.nombre}</span>
          {detalles.length > 0 && (
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-primary transition-transform ${abierto ? "rotate-180" : ""}`}
              aria-hidden
            />
          )}
        </button>
      </div>

      {abierto && detalles.length > 0 && (
        <div className="bg-muted/40 px-3 py-3 space-y-2.5 border-t border-border">
          {detalles.map(({ icono: Icono, titulo, texto }) => (
            <div key={titulo} className="flex gap-2 text-sm">
              <Icono className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden />
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{titulo}: </span>
                {texto}
              </p>
            </div>
          ))}
        </div>
      )}
    </li>
  );
}

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
      <h4 className="font-serif text-lg mb-3">Plagas, enfermedades y cómo combatirlas</h4>
      <ul className="rounded-xl border border-border bg-card overflow-hidden">
        {plagas.map((e) => (
          <Fila key={e.id ?? e.nombre} plaga={e} onZoom={ampliar} />
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Los productos fitosanitarios indicados son de venta en tienda (formato pequeño Sipcam).
        Respeta siempre la dosis y el plazo de seguridad de la etiqueta.
      </p>

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
