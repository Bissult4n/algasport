# Zone comparison: evidence and scope

Checked 2026-09-10. This comparison describes the export IJF versions linked below, not verified ALGA stock. No prices, stock, delivery promises or new products were added.

## Primary sources

- Migaku: https://zone.mitsuboshi-global.com/products/migaku-ijf-uniform
  Skill development and value positioning; wide stitching, smooth soft texture, movement. Cotton/polyester 70/30; Pakistan; IJF approval claimed by manufacturer.
- Idomu: https://zone.mitsuboshi-global.com/products/idomu-ijf-uniform
  Intensive training and durability; tight stitching. Cotton/polyester 70/30; Pakistan; IJF approval claimed by manufacturer.
- Kiwami: https://zone.mitsuboshi-global.com/products/kiwami-ijf-uniform
  Explicit flagship; cotton warp/polyester weft; standing collar, special shoulder-area sewing. Cotton/polyester 77/23; Japan; IJF approval claimed by manufacturer.
- Japanese brand site: https://www.zone-judo.com/
  Regional context only. Japanese options must not be treated as ALGA availability: Migaku IJF marking may be an option; Kiwami trouser variants differ. This page was available during initial research, but follow-up requests timed out. The public comparison therefore relies on the accessible export product pages.

All three export selectors list Regular (A), Slim (Y), Relax (B) and sizes 00000, 0000, 000, 00, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6. The UI explicitly labels them manufacturer options, not ALGA stock or a universal height chart. Model guidance is conditional advice based on this positioning, not a performance guarantee.

## Not published as facts

- Fabric weight in g/m2: not confirmed in the consulted primary product specifications.
- Exact trouser fabric/construction in ALGA's Kiwami set: no confirmed regional SKU/packing specification. The 77/23 statement is not extended to every possible trouser variant.
- Model-specific collar measurements for Migaku/Idomu, reinforcement measurements, shrinkage, actual stock and availability: not confirmed.
- Kiwami's advertised 20% weight reduction: comparison baseline not specified; not presented as 20% lighter than Migaku/Idomu.
- No guarantee that any unknown ALGA item is certified; check the actual model, label and event requirements before supplying a competition set.

## Images and font

The hero still uses the local real Adidas Champion II front photo, unchanged. Mobile clipping came from a 375px SVG inside a 310px overflow-hidden container with a lateral transform. The revised stage reserves space for the full proportional silhouette and its caption.

`docs/personalization-image-sources.json` records the three real photos and reproducible framing parameters. `scripts/prepare-personalization-assets.mjs` only trims unused background, fits the image proportionally, adds neutral margins and encodes WebP; it does not generate, erase or repaint product pixels. The initial close-ups have since been replaced with contextual views: Zone Kiwami front, separate Adidas JT275 trousers and an Outshock black belt without prominent labels. Details and source links: `docs/preview-refinement.md`. All previews are labelled as placement examples, not the selected product's photo. The user's earlier marked reference informed jacket/upper-leg locations only, never lettering scale or certification.

Local Japanese fallback: Noto Sans JP, weight 600, SIL Open Font License (`assets/fonts/OFL.txt`). Source: https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@600&display=swap and https://fonts.gstatic.com/s/notosansjp/v56/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFM8k75s.ttf . Converted losslessly from TTF to WOFF2 with fontTools. No glyph subsetting: arbitrary supported Japanese text remains available. Not preloaded; requested when needed by embroidery text. Latin/Cyrillic/Kazakh use the system font and Unicode fallback chain. Grapheme segmentation preserves combining marks in vertical text.
