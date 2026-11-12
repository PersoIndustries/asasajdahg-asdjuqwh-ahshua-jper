import placeholder from "@/assets/placeholder/under-construction-wide.jpg";

export type FotoGaleria = { id: string; src: string; texto: string };
export const instalaciones: FotoGaleria[] = [
  { id: "instalaciones-0", src: "/media/instalaciones/instalaciones-0.jpg", texto: "Vista aérea de los invernaderos de Jardiper al atardecer" },
  { id: "instalaciones-1", src: "/media/instalaciones/instalaciones-1.jpg", texto: "Interior del invernadero de plantel hortícola de Jardiper" },
  { id: "instalaciones-2", src: "/media/instalaciones/instalaciones-2.jpg", texto: "Invernaderos y zona de cultivo exterior del vivero" },
  { id: "instalaciones-3", src: "/media/instalaciones/instalaciones-3.jpg", texto: "Nave de venta con planta de temporada y ornamentales" },
  { id: "instalaciones-4", src: "/media/instalaciones/instalaciones-4.jpg", texto: "Invernadero de plantel con bandejas de hortícolas y riego aéreo" },
];
export const obras: FotoGaleria[] = Array.from({ length: 3 }, (_, i) => ({
  id: `obra-${i + 1}`, src: placeholder, texto: `Obra ${i + 1} · Fotografías próximamente`,
}));
export const galerias = [{ id: "instalaciones", titulo: "Nuestras instalaciones", fotos: instalaciones }, { id: "obras", titulo: "Obras ejecutadas", fotos: obras }];

export function promptTextosFotos(textos: Record<string, string>): string {
  return ["Actualiza los textos y descripciones de estas imágenes de Jardiper en los archivos locales de la web, sin guardar nada en Supabase. Mantén las imágenes y su orden.", ...galerias.flatMap((g) => [
    `\n${g.titulo}:`, ...g.fotos.map((f) => `${f.id} (${f.src}): ${textos[f.id] ?? f.texto}`),
  ])].join("\n");
}