// Exportación a PDF (vía diálogo de impresión del navegador) de la ficha
// completa de una planta del catálogo: cabecera con el logo de Jardiper,
// datos generales, calendario de cultivo y plagas/enfermedades.

import {
  meses,
  laboresEnQuincena,
  leyendaCalendario,
  getCalendariosPlanta,
  type Plant,
  type PlagaFicha,
} from "@/lib/mock-data";
import { estadoEstilos } from "@/components/site/CalendarioCultivo";
import logo from "@/assets/brand/logo.png.asset.json";

export const DISCLAIMER_FICHA =
  "Esta información es orientativa y puede estar desactualizada o contener alguna errata. " +
  "Las dosis y los productos fitosanitarios deben aplicarse siempre siguiendo la etiqueta del fabricante. " +
  "Ante cualquier duda, no dudes en contactar con nosotros.";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function imprimirFichaPlanta(planta: Plant, plagas: PlagaFicha[]) {
  const filas = getCalendariosPlanta(planta);

  const cabeceraMeses = meses.map((m) => `<th colspan="2">${m}</th>`).join("");

  const cuerpoCal = filas
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
      const nombre = fila.ciclo
        ? `${esc(fila.planta)}<br><small>${esc(fila.ciclo)}</small>`
        : esc(fila.planta);
      return `<tr><th class="planta">${nombre}</th>${celdas}</tr>`;
    })
    .join("");

  const leyenda = leyendaCalendario
    .map(
      (l) =>
        `<span><i style="background:${estadoEstilos[l.codigo].hex}"></i>${l.codigo} · ${esc(l.etiqueta)}</span>`,
    )
    .join("");

  const bloqueCalendario = filas.length
    ? `<h2>Calendario de cultivo</h2>
       <table><thead><tr><th class="planta">Planta</th>${cabeceraMeses}</tr></thead><tbody>${cuerpoCal}</tbody></table>
       <div class="leyenda">${leyenda}</div>
       <p class="nota">Cada mes se divide en 1ª y 2ª quincena. Fechas orientativas para el Bajo Cinca.</p>`
    : "";

  const bloquePlagas = plagas.length
    ? `<h2>Plagas, enfermedades y cómo combatirlas</h2>
       ${plagas
         .map(
           (p) => `<div class="plaga">
             <h3>${esc(p.nombre)}</h3>
             ${p.descripcion ? `<p>${esc(p.descripcion)}</p>` : ""}
             ${p.prevencion ? `<p><b>Prevención:</b> ${esc(p.prevencion)}</p>` : ""}
             ${p.combate ? `<p><b>Cómo combatirla:</b> ${esc(p.combate)}</p>` : ""}
             ${p.otrosDatos ? `<p><b>Otros datos:</b> ${esc(p.otrosDatos)}</p>` : ""}
           </div>`,
         )
         .join("")}`
    : "";

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(planta.nombre)} · Jardiper</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  body { font-family: Georgia, "Times New Roman", serif; color: #24302a; margin: 0; }
  header { display: flex; align-items: center; gap: 14px; border-bottom: 2px solid #cfe3cb; padding-bottom: 10px; margin-bottom: 14px; }
  header img { height: 46px; }
  header .t { flex: 1; }
  h1 { font-size: 20px; margin: 0; }
  h2 { font-size: 13px; margin: 16px 0 6px; text-transform: uppercase; letter-spacing: .08em; color: #4a5a51; font-family: Arial, sans-serif; }
  h3 { font-size: 11px; margin: 0 0 3px; font-family: Arial, sans-serif; }
  p, li { font-size: 10px; line-height: 1.45; margin: 0 0 5px; }
  .sci { font-style: italic; color: #6b7a71; font-size: 11px; }
  .meta { font-family: Arial, sans-serif; font-size: 9px; color: #6b7a71; }
  .plaga { break-inside: avoid; border: 1px solid #e2e6df; border-radius: 6px; padding: 7px 9px; margin-bottom: 6px; }
  table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
  th, td { border: 1px solid #d8d8d8; text-align: center; font-size: 8px; height: 18px; }
  thead th { background: #eef1ea; font-size: 9px; padding: 3px 0; }
  th.planta { text-align: left; padding: 3px 6px; font-size: 9px; width: 130px; background: #f7f8f5; }
  th.planta small { font-weight: normal; color: #6b7a71; font-size: 8px; }
  .leyenda { margin-top: 8px; font-family: Arial, sans-serif; font-size: 9px; color: #4a5a51; }
  .leyenda span { margin-right: 14px; }
  .leyenda i { display: inline-block; width: 14px; height: 9px; border: 1px solid #b9b9b9; margin-right: 4px; vertical-align: -1px; }
  .nota { font-family: Arial, sans-serif; font-size: 8px; color: #8a978d; }
  .disclaimer { margin-top: 14px; border-top: 1px solid #e2e6df; padding-top: 6px; font-family: Arial, sans-serif; font-size: 8px; color: #8a978d; }
</style></head><body>
  <header>
    <img src="${logo.url}" alt="Jardiper">
    <div class="t">
      <h1>${esc(planta.nombre)}</h1>
      <p class="sci">${esc(planta.nombreCientifico ?? "")}</p>
    </div>
    <p class="meta">Jardiper SC · Fraga (Huesca)<br>974 47 21 58</p>
  </header>

  <p class="meta" style="text-transform:capitalize">${esc(planta.categoria)}${planta.temporada ? ` · Temporada: ${esc(planta.temporada)}` : ""}</p>
  ${planta.descripcion ? `<h2>Descripción</h2><p>${esc(planta.descripcion)}</p>` : ""}
  ${bloqueCalendario}
  ${bloquePlagas}
  ${planta.comoSeCome ? `<h2>Cómo se come</h2><p>${esc(planta.comoSeCome)}</p>` : ""}
  ${planta.curiosidades ? `<h2>Curiosidades</h2><p>${esc(planta.curiosidades)}</p>` : ""}

  <p class="disclaimer">${esc(DISCLAIMER_FICHA)}</p>
  <script>window.onload = function(){ window.focus(); window.print(); }<\/script>
</body></html>`;

  const win = window.open("", "_blank", "width=1100,height=800");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
}
