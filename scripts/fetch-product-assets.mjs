import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
const zone = "https://cdn.shopify.com/s/files/1/0930/0603/7356/files/";
const ims = "https://imssport.pl/environment/cache/images/";
const jobs = [];
function add(id, source, images) {
  for (const [file, url] of Object.entries(images)) jobs.push({ id, source, file: "public/images/" + file, url });
}
for (const [id, names] of Object.entries({
  migaku: ["thum-migaku-set-w.png?v=1754530639", "thum-migaku-set-b.png?v=1754530639", "thum-migaku-shishu-shoulder-w.png?v=1754530639"],
  idomu: ["thum-idomu-set-w.png?v=1754530497", "thum-idomu-set-b.png?v=1754530497", "white_judo_jacket_closed_up_with_Zone_logo.png?v=1758268309"],
  kiwami: ["full_set_white.png?v=1756450469", "full_set_blue.png?v=1756450469", "kiwami_fabric.png?v=1756450469", "kiwami_front.png?v=1756450469"]
})) add("zone-" + id, "https://zone.mitsuboshi-global.com/products/" + id + "-ijf-uniform",
 Object.fromEntries(names.map((name,i)=>["kimono/zone-" + id + "-" + i + ".webp", zone + name])));
add("adidas-champion-iii-green", "https://imssport.pl/pl/p/Judoga-Adidas-Champion-III-2-IJF-GREEN-LABEL/986", {
 "kimono/adidas-green-0.webp": ims + "productGfx_4591_500_500/J-IJF_14241_gl1.png",
 "kimono/adidas-green-1.webp": ims + "productGfx_4557_500_500/J-IJF_14242.jpg"
});
add("adidas-champion-iii-gold", "https://www.roninwear.com/en/adidas-champion-iii-ijf-judogi-white-gold-p-22047.html", {
 "kimono/adidas-gold-0.webp": "https://www.roninwear.com/images/adidas-champion-iii-ijf-judogi-white-gold-1.jpg?v=1776151825",
 "kimono/adidas-gold-1.webp": "https://www.roninwear.com/imagenes_miniaturas/adidas-champion-iii-judogi-white-gold-2-lg.jpg?v=1760525274",
 "kimono/adidas-gold-2.webp": "https://www.roninwear.com/imagenes_miniaturas/adidas-champion-iii-ijf-judogi-white-gold-3-lg.jpg?v=1776151334"
});
add("adidas-champion-iii-red", "https://gi-obi.com/urun/adidas-champion-iii-red-ijf-onayli-judo-gi/", {
 "kimono/adidas-red-0.webp": "https://gi-obi.com/wp-content/uploads/2026/03/Adidas-Champion3-RedIJF695707024_w640_h640_4695707024.webp"
});
add("adidas-champion-ii", "https://imssport.pl/pl/p/Judoga-Adidas-Champion-II-IJF-APPROVED/343", {
 "kimono/adidas-ii-0.webp": ims + "productGfx_3241_500_500/J-IJF---Champion-II---White.jpg",
 "kimono/adidas-ii-back.webp": ims + "productGfx_3242_500_500/J-IJF-CHAMPIONII---WHITE---BACK.jpg",
 "kimono/adidas-ii-detail.webp": ims + "productGfx_3239_500_500/J-IJF---Champion-II---White---Close-up-1.jpg"
});
for (const [id, number, image] of [
 ["activize","0708054","a430b976-4304-4ea1-a565-3f9e5017cc1c"],
 ["restorate","0702037","aeecd00f-5e15-44f0-8dd3-3ab204ca39cd"],
 ["basics","0705066","e4e2a54e-0bf6-4e1f-8f3c-dfbcd163cb22"],
 ["powercocktail","0705067","a37142eb-aa5d-45e6-bc8e-daadfbcd6a37"]
]) add("fitline-" + id, "https://www.fitline.com/us/en-us/products/" + number,
 { ["fitline/" + id + ".webp"]: "https://cdn.pm-international.com/products/" + image + ".png" });
const results = [];
for (const job of jobs) {
 try {
  const r = await fetch(job.url, { signal: AbortSignal.timeout(25000) });
  if (!r.ok) throw new Error("HTTP " + r.status);
  const input = Buffer.from(await r.arrayBuffer());
  await mkdir(job.file.slice(0, job.file.lastIndexOf("/")), { recursive: true });
  const result = await sharp(input).rotate().resize(1000, 1000, { fit: "inside", withoutEnlargement: true }).webp({ quality: 86 }).toFile(job.file);
  results.push({ ...job, width: result.width, height: result.height, bytes: result.size, downloaded: new Date().toISOString() });
  console.log(job.file, result.width, result.height, result.size);
 } catch(e) { results.push({ ...job, error: e.message }); console.error(job.id, e.message); process.exitCode = 1; }
}
await mkdir("docs", { recursive: true });
await writeFile("docs/image-sources.json", JSON.stringify(results,null,2) + "\n");
