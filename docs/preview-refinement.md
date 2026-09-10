# Hero and Embroidery Preview Refinement

## Hero

The existing real Adidas Champion II front photograph remains unchanged. Its original file contains the complete garment. The previous layout left very little headroom; the fixed-width decorative sun also clipped against the narrow desktop column at 768px. Earlier work had already removed the mobile lateral transform and the oversized image in a short container.

This pass reduces the displayed silhouette modestly to 490px / 410px / 310px on desktop / tablet / mobile, reserves space above and below it and constrains the sun to its own column. The SVG still uses `xMidYMid meet`; the original image proportions, clipping outline and separate back view remain intact. No replacement hero image was necessary.

## Real Preview Photographs

- Jacket: [Zone Kiwami, official Mitsuboshi / Zone product page](https://zone.mitsuboshi-global.com/products/kiwami-ijf-uniform). Uses the existing local full-set white front photograph. Only unused side background is trimmed; collar, sleeves, jacket hem and trousers stay visible. Replaces the tightly cropped lower-jacket Zone Idomu image.
- Pants: [Adidas JT275, specialist retailer SBJ Sportland](https://www.sbj-sportland.de/de/adidas-Judohose-Champion.html). A separate real photograph of the complete trousers, from waistband to hems. Replaces the upper-leg crop taken from a full Zone Kiwami set, which did not clearly identify the separate garment.
- Belt: [Outshock black martial-arts belt, Decathlon Pro](https://www.decathlonpro.fr/ceinture-arts-martiaux-piquee-2-80m-noire-id-2232570.html). The real laid-out belt photo shows its loop and both plain ends. Replaces the KuSakura JOG close-up dominated by large factory labels. The SVG lettering follows the left free end, not the middle of the belt.

All three images are local 800px WebP assets under `public/images/personalization/`, totalling about 59 KB. Source URLs and the exact crop/background parameters are recorded in `docs/personalization-image-sources.json`. Regenerate with `node scripts/prepare-personalization-assets.mjs`. No AI generation, watermark removal, label removal or baked-in lettering was used. These are labelled placement examples, not new catalog products or assertions about the selected item's brand or certification. Photo reuse permission remains for the shop to confirm before a commercial launch.

## Dynamic Embroidery

Each placement switches a distinct photograph with a short fade. The SVG text is compact and follows the photographed fabric with scene-specific rotation and skew. Low-amplitude displacement, a fine diagonal stitch pattern, restrained directional lighting and a subpixel contact shadow provide thread relief without a frame or backing panel. Both orientations and all existing thread colors remain editable.

Local Noto Sans JP, system fallback fonts and grapheme segmentation preserve Japanese, Cyrillic, Latin and Kazakh input without rasterizing the user's text. The earlier marked reference is used only to locate the lower jacket and upper trouser-leg zones, not to set lettering dimensions. The IJF backpatch still has its own back photograph and SVG implementation.

Cart serialization, validation and order generation are unchanged. Regression coverage now checks all three placements with distinct colors/orientations, reload persistence, belt editing and the combined order text, as well as live text and all thread colors. Hero screenshots cover 1920, 1440, 1024, 768, 390 and 375px; preview screenshots cover both orientations on desktop and mobile.
