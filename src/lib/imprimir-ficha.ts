// Exportación a PDF (vía diálogo de impresión del navegador) de la ficha
// completa de una planta del catálogo: cabecera con el logo de Jardiper en
// todas las páginas, datos generales, calendario de cultivo y plagas con imagen.

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

/** Las imágenes empaquetadas llegan como rutas relativas: en la ventana de
 *  impresión (about:blank) hay que convertirlas en URL absolutas. */
const urlAbsoluta = (src: string) => {
  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
};

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");


export function imprimirFichaPlanta(
  planta: Plant,
  plagas: PlagaFicha[],
  filasCalendario?: { planta: string; ciclo?: string; meses: (string | undefined)[] }[],
) {
  const filas = filasCalendario ?? getCalendariosPlanta(planta);

  const cabeceraMeses = meses
    .map((m) => `<th colspan="2">${m.slice(0, 3)}</th>`)
    .join("");

  const cuerpoCal = filas
    .map((fila) => {
      const celdas = fila.meses
        .flatMap((estado, mi) =>
          ([1, 2] as const).map((q) => {
            const labores = laboresEnQuincena(estado, q);
            const principal = labores[0];
            const bg = principal ? estadoEstilos[principal.actividad].hex : "#ffffff";
            const sep = q === 1 && mi > 0 ? "border-left:1px solid #9aa79f;" : "";
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
    ? `<section class="bloque">
         <h2>Calendario de cultivo</h2>
         <table class="cal"><thead><tr><th class="planta">Planta / ciclo</th>${cabeceraMeses}</tr></thead><tbody>${cuerpoCal}</tbody></table>
         <div class="leyenda">${leyenda}</div>
         <p class="nota">Cada mes se divide en 1ª y 2ª quincena. Fechas orientativas para el Bajo Cinca.</p>
       </section>`
    : "";

  const bloquePlagas = plagas.length
    ? `<section class="bloque">
         <h2>Plagas, enfermedades y cómo combatirlas</h2>
         ${plagas
           .map(
             (p) => `<div class="plaga">
               ${p.imagen ? `<img src="${esc(p.imagen)}" alt="">` : `<div class="sinimg"></div>`}
               <div class="txt">
                 <h3>${esc(p.nombre)}</h3>
                 ${p.descripcion ? `<p>${esc(p.descripcion)}</p>` : ""}
                 ${p.prevencion ? `<p><b>Prevención:</b> ${esc(p.prevencion)}</p>` : ""}
                 ${p.combate ? `<p><b>Cómo combatirla:</b> ${esc(p.combate)}</p>` : ""}
                 ${p.otrosDatos ? `<p><b>Otros datos:</b> ${esc(p.otrosDatos)}</p>` : ""}
               </div>
             </div>`,
           )
           .join("")}
       </section>`
    : "";

  const titulo = `jardiper-ficha-${slug(planta.nombre)}`;

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${titulo}</title>
<style>
  @page { size: A4 portrait; margin: 11mm 13mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #24302a; margin: 0; }

  /* La tabla exterior hace que la cabecera (thead) y el pie (tfoot)
     se repitan automáticamente en todas las páginas impresas. */
  table.page { width: 100%; border-collapse: collapse; }
  table.page > thead > tr > td, table.page > tbody > tr > td, table.page > tfoot > tr > td { padding: 0; border: 0; }
  .run-header { display: flex; align-items: center; gap: 12px; border-bottom: 2px solid #cfe3cb; padding: 0 0 6px; margin-bottom: 10px; }
  .run-header img { height: 34px; }
  .run-header .t { flex: 1; }
  .run-header h1 { font-size: 15px; margin: 0; }
  .run-header .sci { font-style: italic; color: #6b7a71; font-size: 9px; margin: 1px 0 0; }
  .run-header .meta { text-align: right; }
  .run-footer { border-top: 1px solid #e2e6df; margin-top: 8px; padding-top: 4px;
    font-family: Arial, sans-serif; font-size: 7.5px; color: #6b7a71; display: flex; justify-content: space-between; gap: 10px; }

  h2 { font-size: 12px; margin: 14px 0 6px; text-transform: uppercase; letter-spacing: .08em; color: #3f5a49; font-family: Arial, sans-serif;
       border-left: 3px solid #6fa07a; padding-left: 6px; }
  h3 { font-size: 10.5px; margin: 0 0 3px; font-family: Arial, sans-serif; color: #2e4536; }
  p, li { font-size: 9.5px; line-height: 1.5; margin: 0 0 4px; }
  .meta { font-family: Arial, sans-serif; font-size: 9px; color: #6b7a71; }
  .chips { font-family: Arial, sans-serif; font-size: 8.5px; color: #3f5a49; margin: 0 0 8px; }
  .chips span { display: inline-block; border: 1px solid #cfe3cb; background: #f3f8f2; border-radius: 999px; padding: 2px 8px; margin-right: 5px; text-transform: capitalize; }

  .plaga { break-inside: avoid; display: flex; gap: 9px; border: 1px solid #e2e6df; border-radius: 6px; padding: 8px 10px; margin-bottom: 6px; background: #fcfdfb; }
  .plaga img, .plaga .sinimg { width: 74px; height: 74px; object-fit: cover; border-radius: 5px; border: 1px solid #e2e6df; flex: 0 0 74px; background: #eef1ea; }
  .plaga .txt { flex: 1; min-width: 0; }

  table.cal { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; table-layout: fixed; }
  table.cal th, table.cal td { border: 1px solid #d8d8d8; text-align: center; font-size: 6.5px; height: 15px; }
  table.cal thead th { background: #eef1ea; font-size: 7.5px; padding: 2px 0; }
  th.planta { text-align: left; padding: 3px 5px; font-size: 8px; width: 82px; background: #f7f8f5; }
  th.planta small { font-weight: normal; color: #6b7a71; font-size: 7px; }
  table.cal tr { break-inside: avoid; }
  .leyenda { margin-top: 6px; font-family: Arial, sans-serif; font-size: 8px; color: #4a5a51; }
  .leyenda span { margin-right: 12px; white-space: nowrap; }
  .leyenda i { display: inline-block; width: 12px; height: 8px; border: 1px solid #b9b9b9; margin-right: 3px; vertical-align: -1px; }
  .nota { font-family: Arial, sans-serif; font-size: 7.5px; color: #8a978d; }
  .disclaimer { margin-top: 12px; border-top: 1px dashed #d8ded4; padding-top: 5px; font-family: Arial, sans-serif; font-size: 7.5px; color: #8a978d; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style></head><body>
<table class="page">
  <thead><tr><td>
    <div class="run-header">
      <img src="${logo.url}" alt="Jardiper">
      <div class="t">
        <h1>${esc(planta.nombre)}</h1>
        ${planta.nombreCientifico ? `<p class="sci">${esc(planta.nombreCientifico)}</p>` : ""}
      </div>
      <p class="meta">Ficha de cultivo<br>Jardiper SC · Fraga (Huesca)</p>
    </div>
  </td></tr></thead>
  <tfoot><tr><td>
    <div class="run-footer">
      <span>Jardiper SC · Fraga (Huesca) · 974 47 21 58 · info@jardiper.com</span>
      <span>jardiper.com</span>
    </div>
  </td></tr></tfoot>
  <tbody><tr><td>
    <p class="chips"><span>${esc(planta.categoria)}</span>${planta.temporada ? `<span>${esc(planta.temporada)}</span>` : ""}</p>
    ${planta.descripcion ? `<section class="bloque"><h2>Descripción</h2><p>${esc(planta.descripcion)}</p></section>` : ""}
    ${bloqueCalendario}
    ${planta.comoSeCome ? `<section class="bloque"><h2>Cómo se come</h2><p>${esc(planta.comoSeCome)}</p></section>` : ""}
    ${planta.curiosidades ? `<section class="bloque"><h2>Curiosidades</h2><p>${esc(planta.curiosidades)}</p></section>` : ""}
    ${bloquePlagas}
    <p class="disclaimer">${esc(DISCLAIMER_FICHA)}</p>
  </td></tr></tbody>
</table>

  <script>
    window.onload = function () {
      var imgs = Array.prototype.slice.call(document.images);
      var pendientes = imgs.filter(function (i) { return !i.complete; });
      var listo = function () { window.focus(); window.print(); };
      if (!pendientes.length) return setTimeout(listo, 120);
      var n = pendientes.length;
      var done = function () { if (--n <= 0) setTimeout(listo, 120); };
      pendientes.forEach(function (i) { i.addEventListener('load', done); i.addEventListener('error', done); });
      setTimeout(listo, 4000);
    };
  <\/script>
</body></html>`;

  const win = window.open("", "_blank", "width=1000,height=900");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
}
