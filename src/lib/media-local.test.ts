import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { imagenCatalogo, mediaLocal } from "./media-local";

describe("catalogue images", () => {
  const placeholder = "/media/web-under-construction-jardiper.jpg";
  it("uses the construction placeholder for products without an image URL", () => {
    expect(imagenCatalogo(null, placeholder)).toBe(placeholder);
    expect(imagenCatalogo(undefined, placeholder)).toBe(placeholder);
    expect(imagenCatalogo("", placeholder)).toBe(placeholder);
    expect(imagenCatalogo("  ", placeholder)).toBe(placeholder);
  });
  it("keeps a photo when a URL has been assigned", () => {
    expect(imagenCatalogo(" /media/home/vivero-paseo.jpg ", placeholder)).toBe("/media/home/vivero-paseo.jpg");
  });
  it("serves legacy substrate images from the external hosting", () => {
    const local = mediaLocal("/__l5e/assets-v1/d2494641-3128-4a27-a0bc-bb4118dfe3c9/rododendrams.jpg");
    expect(local).toBe("/media/turbas/rododendrams.jpg");
    expect(existsSync(`public${local}`)).toBe(true);
  });
  it("serves the associated cultivation PDF from the external hosting", () => {
    const local = mediaLocal("/__l5e/assets-v1/b97cfdfc-89e9-4fe4-80e4-8a053090f7cb/cultivar-calcots.pdf");
    expect(local).toBe("/media/guias/cultivar-calcots.pdf");
    expect(existsSync(`public${local}`)).toBe(true);
  });
});