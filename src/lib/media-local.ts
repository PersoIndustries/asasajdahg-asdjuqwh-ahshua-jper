const mediosLocales: Record<string, string> = {
  "9dc1fbad-40e6-47f7-ae1c-60f46ea57e2e": "/media/brand/jardiper-logo.png",
  "b97cfdfc-89e9-4fe4-80e4-8a053090f7cb": "/media/guias/cultivar-calcots.pdf",
  "62852d76-3829-4ee4-9ca9-0b9bce2f470c": "/media/guias/fechas-trasplante.pdf",
  "2f541cdd-533c-4aab-b54b-3b535fb4fadd": "/media/guias/plantar-boniatos.pdf",
  "9b1b0627-9ca2-4961-bd97-c3dbbe5ad1cc": "/media/guias/poda-frutales.pdf",
  "785430f6-b896-434d-8ec0-0caca75d8bd6": "/media/guias/polinizacion-calabacines.pdf",
  "4e384c8f-bb8a-44d2-9401-50155cb44042": "/media/historia/historia-1974.jpg",
  "c44ac4b9-ea47-453e-b244-a1043214cc64": "/media/historia/historia-2026.jpg",
  "507038ae-0865-4e51-80ba-6c41228dc0d3": "/media/home/hero.jpg",
  "d4472f26-9403-42f7-b48f-86a02cd1dca8": "/media/instalaciones/instalaciones-0.jpg",
  "1db855a7-46e7-4658-902e-11ca1ac7e8a2": "/media/instalaciones/instalaciones-1.jpg",
  "353151e8-721c-41be-96af-4a057a0a626c": "/media/instalaciones/instalaciones-2.jpg",
  "17023d70-e9fc-4f43-92b3-d780410eed94": "/media/instalaciones/instalaciones-3.jpg",
  "4973d5e9-dcb8-430f-aab6-73b6b43d08fa": "/media/instalaciones/instalaciones-4.jpg",
  "d2494641-3128-4a27-a0bc-bb4118dfe3c9": "/media/turbas/rododendrams.jpg",
  "9139e63a-a378-4439-9884-ba178da44778": "/media/turbas/suliflor-PM-SuliflorESP.png",
  "046bd761-aaba-4367-b373-93a8f81aa0d6": "/media/turbas/suliflor-SF0-SuliflorESP.png",
  "60bb45da-79eb-4546-8420-b1645506b94e": "/media/turbas/suliflor-SF1-SuliflorESP.png",
  "15e7c2fa-c307-403e-999e-abf37b3acb90": "/media/turbas/suliflor-SF2-SuliflorESP.png",
  "e0dbfb3b-4755-4fc9-9d00-93390ac7ccfb": "/media/turbas/traditional-universal.jpg"
};

/** Resuelve referencias históricas de Lovable a los archivos incluidos en el hosting. */
export function mediaLocal(url: string | null | undefined): string {
  const valor = url?.trim() ?? "";
  if (!valor) return "";
  for (const [id, local] of Object.entries(mediosLocales)) {
    if (valor.includes(id)) return local;
  }
  return valor;
}

export function imagenCatalogo(url: string | null | undefined, placeholder: string): string {
  return mediaLocal(url) || placeholder;
}
