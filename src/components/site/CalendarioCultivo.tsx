import { Printer } from "lucide-react";
import {
  meses, leyendaCalendario, parseCelda, laboresEnQuincena, quincenaLabel,
  getCalendariosPlanta, actividadesLabel,
  type Actividad, type Plant,
} from "@/lib/mock-data";

export type FilaCal = { planta: string; ciclo?: string; meses: (string | undefined)[] };

/** Estilos únicos de actividad, compartidos por todas las secciones. */
export const estadoEstilos: Record<Actividad, { fondo: string; borde: string; clase: string; hex: string }> = {
  S: { fondo: "bg-sage/45", borde: "border-sage/60", clase: "bg-sage/30 text-primary border-sage/50", hex: "#cfe3cb" },
  T: { fondo: "bg-primary/25", borde: "border-primary/40", clase: "bg-primary/15 text-primary border-primary/40", hex: "#a9c1a4" },
  C: { fondo: "bg-tierra/35", borde: "border-tierra/50", clase: "bg-tierra/20 text-foreground border-tierra/40", hex: "#e2c8a6" },
};

/** Media casilla de mes (1ª o 2ª quincena). */
function MediaCasilla({ mesIdx, estado, quincena }: { mesIdx: number; estado: string | undefined; quincena: 1 | 2 }) {
  const labores = laboresEnQuincena(estado, quincena);
  const principal = labores[0];
  const titulo = labores.length
    ? `${meses[mesIdx]}, ${quincenaLabel[quincena]}: ${labores.map((l) => actividadesLabel[l.actividad]).join(" y ")}`
    : `${meses[mesIdx]}, ${quincenaLabel[quincena]}: sin labores`;

  return (
    <div
      title={titulo}
      className={`h-7 flex items-center justify-center text-[9px] font-semibold leading-none ${
        quincena === 1 && mesIdx > 0 ? "border-l border-border/60" : ""
      } ${principal ? `${estadoEstilos[principal.actividad].fondo} text-foreground/80` : ""}`}
    >
      {labores.map((l) => l.actividad).join("")}
    </div>
  );
}

/** Cabecera de meses alineada con la pista de quincenas. */
export function CabeceraMeses() {
  return (
    <>
      {meses.map((m, i) => (
        <div
          key={m}
          className={`text-[10px] uppercase tracking-wide text-muted-foreground py-1.5 border-b border-border ${
            i > 0 ? "border-l border-border/60" : ""
          }`}
        >
          {m}
        </div>
      ))}
    </>
  );
}

/** Pista continua de 12 meses × 2 quincenas para una fila de calendario. */
export function PistaCalendario({ fila }: { fila: FilaCal }) {
  return (
    <>
      {fila.meses.map((estado, i) => (
        <div key={i} className="grid grid-cols-2 bg-muted/30">
          <MediaCasilla mesIdx={i} estado={estado} quincena={1} />
          <MediaCasilla mesIdx={i} estado={estado} quincena={2} />
        </div>
      ))}
    </>
  );
}

/** Bloque de una fila con su cabecera de meses y (opcional) ciclo. */
export function BloqueCalendario({ fila, etiqueta }: { fila: FilaCal; etiqueta?: string }) {
  const titulo = etiqueta ?? fila.ciclo;
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      {titulo && (
        <p className="px-3 py-1.5 bg-secondary/50 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border">
          {titulo}
        </p>
      )}
      <div className="grid grid-cols-12 text-center">
        <CabeceraMeses />
        <PistaCalendario fila={fila} />
      </div>
    </div>
  );
}

export function LeyendaCalendario({ filas }: { filas?: FilaCal[] }) {
  const usados = filas
    ? leyendaCalendario.filter((l) => filas.some((f) => f.meses.some((m) => parseCelda(m).some((x) => x.actividad === l.codigo))))
    : leyendaCalendario;
  return (
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
      {usados.map((l) => (
        <span key={l.codigo} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className={`inline-block h-3 w-5 rounded-sm border ${estadoEstilos[l.codigo].fondo} ${estadoEstilos[l.codigo].borde}`} />
          {l.etiqueta}
        </span>
      ))}
    </div>
  );
}

/** Calendario completo de una planta del catálogo. */
export function CalendarioCultivo({ planta, mostrarExportar = true }: { planta: Plant; mostrarExportar?: boolean }) {
  const filas = getCalendariosPlanta(planta) as FilaCal[];
  if (!filas.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <h4 className="font-serif text-lg">Calendario de cultivo</h4>
        {mostrarExportar && (
          <BotonImprimirCalendario titulo={`Calendario de cultivo · ${planta.nombre}`} filas={filas} />
        )}
      </div>

      <div className="space-y-3">
        {filas.map((fila, fi) => (
          <BloqueCalendario key={`${fila.planta}-${fila.ciclo ?? fi}`} fila={fila} />
        ))}
      </div>
      <LeyendaCalendario filas={filas} />
      <p className="mt-2 text-[11px] text-muted-foreground">
        Cada mes se divide en 1ª y 2ª quincena. Fechas orientativas para el Bajo Cinca; pueden variar
        según la variedad y la meteorología.
      </p>
    </div>
  );
}

// ── Exportar / imprimir en PDF ────────────────────────────────────────────────

/** Abre una ventana con el calendario maquetado y lanza el diálogo de impresión (Guardar como PDF). */
export function imprimirCalendario(titulo: string, filas: FilaCal[]) {
  const cabecera = meses
    .map((m) => `<th colspan="2">${m}</th>`)
    .join("");

  const cuerpo = filas
    .map((fila) => {
      const celdas = fila.meses
        .flatMap((estado, mi) =>
          ([1, 2] as const).map((q) => {
            const labores = laboresEnQuincena(estado, q);
            const principal = labores[0];
            const bg = principal ? estadoEstilos[principal.actividad].hex : "#ffffff";
            const sep = q === 1 && mi > 0 ? "border-left:1px solid #b9b9b9;" : "";
            return `<td style="background:${bg};${sep}">${labores.map((l) => l.actividad).join("")}</td>`;
          }),
        )
        .join("");
      const nombre = fila.ciclo ? `${fila.planta}<br><small>${fila.ciclo}</small>` : fila.planta;
      return `<tr><th class="planta">${nombre}</th>${celdas}</tr>`;
    })
    .join("");

  const leyenda = leyendaCalendario
    .map((l) => `<span><i style="background:${estadoEstilos[l.codigo].hex}"></i>${l.codigo} · ${l.etiqueta}</span>`)
    .join("");

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${titulo}</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  body { font-family: Georgia, "Times New Roman", serif; color: #24302a; margin: 0; }
  h1 { font-size: 18px; margin: 0 0 2px; }
  p.sub { font-size: 10px; color: #6b7a71; margin: 0 0 12px; }
  table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
  th, td { border: 1px solid #d8d8d8; text-align: center; font-size: 8px; height: 18px; }
  thead th { background: #eef1ea; font-size: 9px; padding: 3px 0; }
  th.planta { text-align: left; padding: 3px 6px; font-size: 9px; width: 130px; background: #f7f8f5; }
  th.planta small { font-weight: normal; color: #6b7a71; font-size: 8px; }
  .leyenda { margin-top: 10px; font-family: Arial, sans-serif; font-size: 9px; color: #4a5a51; }
  .leyenda span { margin-right: 14px; }
  .leyenda i { display: inline-block; width: 14px; height: 9px; border: 1px solid #b9b9b9; margin-right: 4px; vertical-align: -1px; }
  .pie { margin-top: 8px; font-family: Arial, sans-serif; font-size: 8px; color: #8a978d; }
</style></head><body>
  <h1>${titulo}</h1>
  <p class="sub">Jardiper · Bajo Cinca (Fraga, Huesca) — cada mes se divide en 1ª y 2ª quincena</p>
  <table><thead><tr><th class="planta">Planta</th>${cabecera}</tr></thead><tbody>${cuerpo}</tbody></table>
  <div class="leyenda">${leyenda}</div>
  <p class="sub" style="margin-top:8px">Fechas orientativas; pueden variar según variedad y meteorología.</p>
  <script>window.onload = function(){ window.focus(); window.print(); }<\/script>
</body></html>`;

  const win = window.open("", "_blank", "width=1100,height=800");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
}

export function BotonImprimirCalendario({ titulo, filas, className = "" }: { titulo: string; filas: FilaCal[]; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => imprimirCalendario(titulo, filas)}
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs font-medium hover:bg-secondary transition-colors ${className}`}
    >
      <Printer className="h-3.5 w-3.5" /> Exportar PDF
    </button>
  );
}
