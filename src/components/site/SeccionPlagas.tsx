import { useState } from "react";
import { X, ChevronDown, ShieldCheck, Sprout, Info } from "lucide-react";
import type { PlagaFicha } from "@/lib/mock-data";

/**
 * Sección «Plagas, enfermedades y cómo combatirlas» tal y como se ve en la
 * ficha del catálogo. Se comparte entre la web pública y la vista previa del
 * gestor para que ambas se vean exactamente igual.
 *
 * Cada plaga es una tarjeta con imagen cuadrada y un desplegable con la
 * prevención, cómo combatirla y otros datos.
 */
function Tarjeta({
  plaga,
  onZoom,
}: {
  plaga: PlagaFicha;
  onZoom: (img: { src: string; alt: string }) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const detalles = [
    { icono: ShieldCheck, titulo: "Prevención", texto: plaga.prevencion },
    { icono: Sprout, titulo: "Cómo combatirla", texto: plaga.combate },
    { icono: Info, titulo: "Otros datos", texto: plaga.otrosDatos },
  ].filter((d) => d.texto);

  return (
    <li className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex gap-4 p-3">
        <button
          type="button"
          onClick={() => onZoom({ src: plaga.imagen, alt: plaga.nombre })}
          className="shrink-0 rounded-lg overflow-hidden border border-border hover:opacity-90 transition"
          aria-label={`Ampliar imagen de ${plaga.nombre}`}
        >
          <span className="block h-20 w-20 sm:h-24 sm:w-24 aspect-square">
            <img
              src={plaga.imagen}
              alt={plaga.nombre}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground">{plaga.nombre}</p>
          {plaga.descripcion && (
            <p className="text-sm text-muted-foreground mt-1">{plaga.descripcion}</p>
          )}

          {detalles.length > 0 && (
            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              {abierto ? "Ocultar detalles" : "Prevención y tratamiento"}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${abierto ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
          )}
        </div>
      </div>

      {abierto && detalles.length > 0 && (
        <div className="border-t border-border bg-muted/40 px-3 py-3 space-y-3">
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
      <ul className="grid gap-3 sm:grid-cols-2">
        {plagas.map((e) => (
          <Tarjeta key={e.id ?? e.nombre} plaga={e} onZoom={ampliar} />
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
