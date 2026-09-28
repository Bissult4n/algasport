import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const background = "#e7e6e3";
const jobs = [
  ["fitline-activize", "FitLine Activize", "public/images/fitline/activize.webp", "public/images/products/fitline/fitline-activize-main.webp"],
  ["fitline-restorate", "FitLine Restorate", "public/images/fitline/restorate.webp", "public/images/products/fitline/fitline-restorate-main.webp"],
  ["fitline-basics", "FitLine Basics", "public/images/fitline/basics.webp", "public/images/products/fitline/fitline-basics-main.webp"],
  ["fitline-powercocktail", "FitLine PowerCocktail", "public/images/fitline/powercocktail.webp", "public/images/products/fitline/fitline-powercocktail-main.webp"],
].map(([id, model, input, file]) => ({ id, model, input, file }));

await mkdir("public/images/products/adidas", { recursive: true });
await mkdir("public/images/products/fitline", { recursive: true });
const sourceFile = "docs/image-sources.json";
const existing = JSON.parse(await readFile(sourceFile, "utf8"));
const generated = [];

for (const job of jobs) {
  const sourceEntry = existing.find(
    (entry) => entry.id === job.id && entry.file === job.input,
  );
  if (!sourceEntry) throw new Error(`Missing source metadata: ${job.id}`);
  const result = await sharp(job.input)
    .rotate()
    .trim({ background: "#ffffff", threshold: 8 })
    .resize(820, 820, { fit: "contain", background })
    .extend({ top: 90, bottom: 90, left: 90, right: 90, background })
    .webp({ quality: 90 })
    .toFile(job.file);
  generated.push({
    id: job.id,
    model: job.model,
    source: sourceEntry.source,
    url: sourceEntry.url,
    file: job.file,
    role: "normalized-catalog-main",
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
    generated: new Date().toISOString(),
  });
  console.log(job.file, result.width, result.height, result.size);
}

const generatedIds = new Set(jobs.map((job) => job.id));
const retained = existing.filter(
  (entry) =>
    entry.role !== "normalized-catalog-main" || !generatedIds.has(entry.id),
);
await writeFile(sourceFile, JSON.stringify([...retained, ...generated], null, 2) + "\n");
