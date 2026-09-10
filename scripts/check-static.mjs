import "./env.mjs";
import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const html = await readFile("out/index.html", "utf8");
await access("out/.nojekyll");
assert.ok(html.includes("СДЕЛАНО"));
assert.ok(!html.includes("/_next/image?"), "Image server must not be needed");
const localAssets = new Set(
  [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
    .map((m) => m[1])
    .filter((s) => s.startsWith("/")),
);
for (const asset of localAssets) {
  assert.ok(
    !base || asset.startsWith(base + "/"),
    "Missing basePath: " + asset,
  );
  const path = decodeURIComponent(asset.slice(base.length).split("?")[0]);
  await access(join("out", path));
}
const sources = JSON.parse(await readFile("docs/image-sources.json", "utf8"));
assert.equal(sources.length, 23);
let bytes = 0;
for (const source of sources) {
  const path = source.file.replace(/^public\//, "out/");
  bytes += (await stat(path)).size;
}
const images = await readdir("out/images");
const previewSources = JSON.parse(await readFile("docs/personalization-image-sources.json", "utf8"));
assert.equal(previewSources.length, 3);
for (const source of previewSources) await access(source.file.replace(/^public\//, "out/"));
for (const old of [
  "hero-gi.webp",
  "custom-gi-back.webp",
  "product-white.webp",
  "product-indigo.webp",
  "product-graphite.webp",
  "judoka-action.webp",
  "fabric-detail.webp",
  "patch-maratova-story.webp",
  "patch-rizabek-story.webp",
]) {
  assert.ok(!images.includes(old), "Legacy concept image in export: " + old);
}
assert.ok(
  !(await readdir("out")).includes("api"),
  "Export must not contain API routes",
);
console.log(
  `PASS: static export, ${localAssets.size} local asset references, 23 product photos (${Math.round(bytes / 1024)} KB), no legacy AI images or API routes. Base path: ${base || "/"}`,
);
