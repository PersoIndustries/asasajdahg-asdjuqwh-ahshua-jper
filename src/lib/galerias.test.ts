import { expect, it } from "vitest";
import { galerias, promptTextosFotos } from "./galerias";

it("copies every gallery description as a local-only edit request", () => {
  const texts = Object.fromEntries(galerias.flatMap((g) => g.fotos.map((f) => [f.id, `Nueva descripción ${f.id}`])));
  const prompt = promptTextosFotos(texts);
  for (const gallery of galerias) {
    for (const photo of gallery.fotos) {
      expect(prompt).toContain(`${photo.id} (${photo.src}): Nueva descripción ${photo.id}`);
    }
  }
  expect(prompt).toContain("sin guardar nada en Supabase");
});