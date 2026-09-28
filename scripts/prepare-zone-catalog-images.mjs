import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const background = "#c1d0e3";
const jobs = [
  {
    id: "zone-migaku",
    model: "Zone Migaku",
    color: "Белый",
    source: "https://zone.mitsuboshi-global.com/products/migaku-ijf-uniform",
    url: "https://cdn.shopify.com/s/files/1/0930/0603/7356/files/thum-migaku-set-w.png?v=1754530639",
    file: "public/images/products/zone/zone-migaku-white-main.webp",
  },
  {
    id: "zone-migaku",
    model: "Zone Migaku",
    color: "Синий",
    source: "https://zone.mitsuboshi-global.com/products/migaku-ijf-uniform",
    url: "https://cdn.shopify.com/s/files/1/0930/0603/7356/files/thum-migaku-set-b.png?v=1754530639",
    file: "public/images/products/zone/zone-migaku-blue-main.webp",
  },
  {
    id: "zone-idomu",
    model: "Zone Idomu",
    color: "Белый",
    source: "https://zone.mitsuboshi-global.com/products/idomu-ijf-uniform",
    url: "https://cdn.shopify.com/s/files/1/0930/0603/7356/files/thum-idomu-set-w.png?v=1754530497",
    file: "public/images/products/zone/zone-idomu-white-main.webp",
  },
  {
    id: "zone-idomu",
    model: "Zone Idomu",
    color: "Синий",
    source: "https://zone.mitsuboshi-global.com/products/idomu-ijf-uniform",
    url: "https://cdn.shopify.com/s/files/1/0930/0603/7356/files/thum-idomu-set-b.png?v=1754530497",
    file: "public/images/products/zone/zone-idomu-blue-main.webp",
  },
  {
    id: "zone-kiwami",
    model: "Zone Kiwami",
    color: "Белый",
    source: "https://zone.mitsuboshi-global.com/products/kiwami-ijf-uniform",
    url: "https://cdn.shopify.com/s/files/1/0930/0603/7356/files/full_set_white.png?v=1756450469",
    file: "public/images/products/zone/zone-kiwami-white-main.webp",
  },
  {
    id: "zone-kiwami",
    model: "Zone Kiwami",
    color: "Синий",
    source: "https://zone.mitsuboshi-global.com/products/kiwami-ijf-uniform",
    url: "https://cdn.shopify.com/s/files/1/0930/0603/7356/files/full_set_blue.png?v=1756450469",
    file: "public/images/products/zone/zone-kiwami-blue-main.webp",
  },
];

await mkdir("public/images/products/zone", { recursive: true });
const generated = [];
for (const job of jobs) {
  const response = await fetch(job.url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${job.model}: HTTP ${response.status}`);
  const input = Buffer.from(await response.arrayBuffer());
  const result = await sharp(input)
    .rotate()
    .trim({ background, threshold: 8 })
    .resize(820, 820, { fit: "contain", background })
    .extend({ top: 90, bottom: 90, left: 90, right: 90, background })
    .webp({ quality: 90 })
    .toFile(job.file);
  generated.push({
    ...job,
    role: "normalized-variant-main",
    width: result.width,
    height: result.height,
    bytes: result.size,
    normalization: {
      canvas: "1000x1000",
      contentBox: "820x820",
      fit: "contain",
      background,
      productPixelsRetouched: false,
    },
    downloaded: new Date().toISOString(),
  });
  console.log(job.file, result.width, result.height, result.size);
}

const sourceFile = "docs/image-sources.json";
const existing = JSON.parse(await readFile(sourceFile, "utf8"));
const retained = existing.filter(
  (entry) =>
    entry.role !== "normalized-main" &&
    entry.role !== "normalized-variant-main",
);
await writeFile(sourceFile, JSON.stringify([...retained, ...generated], null, 2) + "\n");
