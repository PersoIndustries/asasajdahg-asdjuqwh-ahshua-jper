#!/usr/bin/env node
/**
 * Valida que todas las imágenes/assets del proyecto:
 *  1. Vivan en src/assets/<carpeta permitida>/
 *  2. Cumplan la nomenclatura kebab-case (o números tipo 1974.jpg)
 *  3. Usen una extensión permitida por carpeta
 *  4. Estén referenciadas desde el código (aviso de huérfanos)
 *  5. Cada referencia desde el código apunte a un archivo existente
 *
 * Uso: node scripts/validate-assets.mjs
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";

const ROOT = process.cwd();
const ASSETS_DIR = join(ROOT, "src/assets");
const SRC_DIR = join(ROOT, "src");

// Carpetas permitidas y sus extensiones válidas
const FOLDER_RULES = {
  brand: [".png", ".svg", ".jpg"],
  home: [".jpg", ".png", ".webp"],
  tierras: [".jpg", ".png", ".webp"],
  historia: [".jpg", ".png", ".webp"],
  guias: [".pdf"],
};

// kebab-case: minúsculas, dígitos y guiones. Permitimos también solo dígitos (ej: 1974).
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const errors = [];
const warnings = [];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

// 1. Validar cada archivo bajo src/assets
const assetFiles = walk(ASSETS_DIR);
const validAssets = [];

for (const file of assetFiles) {
  const rel = relative(ASSETS_DIR, file).replaceAll("\\", "/");
  const [folder, ...rest] = rel.split("/");

  if (rest.length === 0) {
    errors.push(`Fuera de carpeta: src/assets/${rel} debe estar en una subcarpeta temática.`);
    continue;
  }
  if (!(folder in FOLDER_RULES)) {
    errors.push(`Carpeta no permitida: src/assets/${folder}/ (permitidas: ${Object.keys(FOLDER_RULES).join(", ")}).`);
    continue;
  }

  const fileName = basename(file);
  // Los pointers .asset.json se validan por el nombre real del asset (ej: logo.png.asset.json → logo.png)
  const realName = fileName.endsWith(".asset.json") ? fileName.slice(0, -".asset.json".length) : fileName;
  const ext = extname(realName).toLowerCase();
  const stem = basename(realName, ext);

  const allowedExt = FOLDER_RULES[folder];
  if (!allowedExt.includes(ext)) {
    errors.push(`Extensión inválida en ${rel}: ${ext} (permitidas en /${folder}: ${allowedExt.join(", ")}).`);
  }
  if (!NAME_RE.test(stem)) {
    errors.push(`Nombre no kebab-case en ${rel}: "${stem}" debe ser minúsculas con guiones (ej: mi-imagen).`);
  }
  validAssets.push(rel);
}

// 2. Buscar referencias en el código
const codeFiles = walk(SRC_DIR).filter((f) => /\.(tsx?|css)$/.test(f));
const referenced = new Set();
const REF_RE = /assets\/([a-z0-9/_.-]+\.(?:jpg|jpeg|png|svg|webp|pdf)(?:\.asset\.json)?)/gi;

for (const file of codeFiles) {
  const content = readFileSync(file, "utf8");
  for (const m of content.matchAll(REF_RE)) {
    referenced.add(m[1]);
  }
}

// 3. Referencias rotas
for (const ref of referenced) {
  if (!validAssets.includes(ref)) {
    errors.push(`Referencia rota en código: src/assets/${ref} no existe.`);
  }
}

// 4. Assets huérfanos (warning, no error)
for (const asset of validAssets) {
  if (!referenced.has(asset)) {
    warnings.push(`Asset huérfano (sin referencias): src/assets/${asset}`);
  }
}

// Reporte
console.log(`\n📦 Assets validados: ${validAssets.length}`);
console.log(`🔗 Referencias encontradas: ${referenced.size}`);

if (warnings.length) {
  console.log(`\n⚠️  Avisos (${warnings.length}):`);
  warnings.forEach((w) => console.log("  - " + w));
}

if (errors.length) {
  console.error(`\n❌ Errores (${errors.length}):`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}

console.log("\n✅ Todos los assets cumplen la nomenclatura y ubicación esperadas.");