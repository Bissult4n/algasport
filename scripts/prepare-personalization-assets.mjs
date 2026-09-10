import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Keep the full garments in view; trim only unused background and add breathing room.
// No product retouching, generated imagery or lettering baked into these photographs.
const jobs = [
  {
    zone: "Куртка",
    file: "jacket.webp",
    input: "public/images/kimono/zone-kiwami-0.webp",
    source: "https://zone.mitsuboshi-global.com/products/kiwami-ijf-uniform",
    original:
      "https://cdn.shopify.com/s/files/1/0930/0603/7356/files/full_set_white.png?v=1756450469",
    crop: { left: 200, top: 20, width: 550, height: 960 },
    background: "#c1d0e3",
  },
  {
    zone: "Штаны",
    file: "pants.webp",
    source: "https://www.sbj-sportland.de/de/adidas-Judohose-Champion.html",
    original:
      "https://www.sbj-sportland.de/images/product_images/popup_images/adidas-Judohose-Champion-02-ADIJT275IJFW.webp",
    background: "#ffffff",
  },
  {
    zone: "Пояс",
    file: "belt.webp",
    source: "https://www.decathlonpro.fr/ceinture-arts-martiaux-piquee-2-80m-noire-id-2232570.html",
    original:
      "https://contents.mediadecathlon.com/p1142337/k$daec5445a6f2559873f7899b923cc610/image_pixl.jpg?format=jpg&f=1200x1200",
    crop: { left: 90, top: 180, width: 1030, height: 860 },
    background: "#f3f3f3",
  },
];
await mkdir("public/images/personalization", { recursive: true });
const sources = [];
for (const job of jobs) {
  let input = job.input;
  if (!input) {
    const response = await fetch(job.original, {
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`Image HTTP ${response.status}`);
    input = Buffer.from(await response.arrayBuffer());
  }
  const file = "public/images/personalization/" + job.file;
  let photo = sharp(input);
  if (job.crop) photo = photo.extract(job.crop);
  const result = await photo
    .resize(752, 752, { fit: "contain", background: job.background, withoutEnlargement: true })
    .extend({ top: 24, bottom: 24, left: 24, right: 24, background: job.background })
    .webp({ quality: 91 })
    .toFile(file);
  sources.push({
    ...job,
    input: job.input ?? "Original remote photograph",
    file,
    width: result.width,
    height: result.height,
    bytes: result.size,
  });
  console.log(file, result.width, result.height, result.size);
}
await writeFile(
  "docs/personalization-image-sources.json",
  JSON.stringify(sources, null, 2) + "\n",
);
