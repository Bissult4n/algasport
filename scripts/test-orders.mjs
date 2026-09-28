import "./env.mjs";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
const require = createRequire(import.meta.url);
const output = await mkdtemp(join(tmpdir(), "alga-orders-test-"));
try {
  execFileSync(
    process.execPath,
    [
      "node_modules/typescript/bin/tsc",
      "lib/orders.ts",
      "--outDir",
      output,
      "--module",
      "commonjs",
      "--target",
      "es2021",
      "--skipLibCheck",
      "--esModuleInterop",
    ],
    { stdio: "inherit" },
  );
  const o = require(join(output, "orders.js"));
  const c = require(join(output, "customization.js"));
  const config = require(join(output, "shop-config.js"));
  const catalog = require(join(output, "catalog.js"));
  const item = o.newItem("zone-migaku", "Синий");
  item.key = "test-a";
  item.size = "175";
  item.quantity = 2;
  item.customization = {
    ...o.defaultCustomization(),
    enabled: true,
    surname: "A. SERIKOV & +",
    country: "KAZ",
  };
  const second = { ...o.newItem("fitline-restorate"), key: "test-b" };
  const msg = o.buildOrderMessage([item, second]);
  for (const part of [
    "Zone Migaku",
    "FitLine Restorate",
    "Размер: 175",
    "Вариант/цвет: Синий",
    "Количество: 2",
    "IJF backpatch",
    "A. SERIKOV & +",
    "Доплата: 16 000 ₸",
    "Итого: Цена по запросу",
  ])
    assert.ok(msg.includes(part), part);
  assert.equal(o.whatsappUrl(msg, ""), null, "Unconfigured WhatsApp must not open");
  assert.equal(o.whatsappUrl(msg), o.whatsappUrl(msg, config.WHATSAPP_NUMBER));
  if (config.WHATSAPP_NUMBER) {
    const configuredUrl = new URL(o.whatsappUrl(msg));
    assert.equal(configuredUrl.pathname, "/" + config.WHATSAPP_NUMBER.replace(/[\s()+-]/g, ""));
    assert.equal(configuredUrl.searchParams.get("text"), msg);
  }
  assert.equal(o.whatsappUrl(msg, "000"), null);
  const url = new URL(o.whatsappUrl(msg, "+7 (700) 123-45-67"));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/77001234567");
  assert.equal(
    url.searchParams.get("text"),
    msg,
    "Message must survive URL encoding",
  );
  assert.deepEqual(o.parseCart(JSON.stringify([item, second])), [item, second]);
  assert.equal(o.newItem("zone-migaku", "Несуществующий").variant, "Белый");
  assert.equal(
    o.parseCart(JSON.stringify([{ ...item, variant: "Уточнить цвет" }]))[0]
      .variant,
    "Белый",
    "Legacy generic color must migrate instead of dropping the cart line",
  );
  for (const bad of ["broken", "null", "{}", "[null]"])
    assert.deepEqual(o.parseCart(bad), []);
  assert.equal(o.parseCart(JSON.stringify([item, item])).length, 1);
  assert.equal(
    o.parseCart(JSON.stringify([{ ...item, quantity: -2 }])).length,
    0,
  );
  assert.equal(
    o.parseCart(JSON.stringify([{ ...item, productId: "fake" }])).length,
    0,
  );
  assert.equal(o.itemTotal(item), 202000);
  assert.equal(o.cartTotal([item, second]), null);
  assert.ok(msg.includes("Место: Спина · фиксировано"));
  for (const label of ["Шрифт:", "Цвет:", "Ориентация:"])
    assert.ok(
      !msg.includes(label),
      "Backpatch must not include decorative fields",
    );
  const stitched = {
    ...o.newItem("adidas-champion-ii", "Синий"),
    key: "stitch",
    customization: {
      ...c.defaultEmbroidery(),
      enabled: true,
      text: "柔道・Алға & +",
      placement: "Штаны",
      color: "Золотой",
      orientation: "horizontal",
    },
  };
  const stitchMessage = o.buildOrderMessage([stitched]);
  for (const label of [
    "Вариант/цвет: Синий",
    "Текст: 柔道・Алға & +",
    "Штаны / верхняя часть штанины",
    "Цвет: Золотой",
    "Ориентация: Горизонтально",
  ])
    assert.ok(stitchMessage.includes(label), label);
  for (const label of ["Фамилия:", "Страна:"])
    assert.ok(!stitchMessage.includes(label));
  assert.deepEqual(o.parseCart(JSON.stringify([stitched])), [stitched]);
  const kkMessage = o.buildOrderMessage([stitched], "kk");
  for (const value of [
    "Сәлеметсіз бе! Тапсырыс бергім келеді.",
    "Тауар: Adidas Champion II",
    "Нұсқа/түс: Көк",
    "Мәтін: 柔道・Алға & +",
    "Шалбар / шалбар балағының жоғарғы бөлігі",
    "Бағасы: Сұрау бойынша",
  ]) assert.ok(kkMessage.includes(value), "KZ order: " + value);
  assert.ok(!kkMessage.includes("Здравствуйте"), "KZ order must not contain the Russian greeting");
  const enMessage = o.buildOrderMessage([stitched], "en");
  for (const value of [
    "Hello! I would like to place an order.",
    "Product: Adidas Champion II",
    "Option/color: Blue",
    "Text: 柔道・Алға & +",
    "Trousers / upper trouser leg",
    "Price: Price on request",
  ]) assert.ok(enMessage.includes(value), "EN order: " + value);
  assert.ok(!enMessage.includes("Здравствуйте"), "EN order must not contain the Russian greeting");
  const championWhite = {
    ...o.newItem("adidas-champion-ii", "Белый"),
    key: "champion-white",
    size: "175",
  };
  const championBlue = {
    ...o.newItem("adidas-champion-ii", "Синий"),
    key: "champion-blue",
    size: "175",
  };
  const championColors = o.parseCart(
    JSON.stringify([championWhite, championBlue]),
  );
  assert.equal(championColors.length, 2, "Color variants remain separate cart lines");
  assert.deepEqual(
    championColors.map((entry) => entry.variant),
    ["Белый", "Синий"],
  );
  assert.equal(
    catalog.productImages(catalog.getProduct("adidas-champion-ii"), "Белый")[0],
    "/images/products/adidas/champion-ii/white.png",
  );
  assert.equal(
    catalog.productImages(catalog.getProduct("adidas-champion-ii"), "Синий")[0],
    "/images/products/adidas/champion-ii/blue.png",
  );
  const championMessage = o.buildOrderMessage(championColors);
  for (const value of [
    "Adidas Champion II",
    "Вариант/цвет: Белый",
    "Вариант/цвет: Синий",
    "Размер: 175",
  ])
    assert.ok(championMessage.includes(value), value);
  const legacyMizunoWhite = {
    ...o.newItem("mizuno-judogi"),
    key: "legacy-mizuno-white",
    productId: "mizuno-white",
    variant: "Лицензионный",
    size: "Уточнить",
  };
  const legacyMizunoBlue = {
    ...o.newItem("mizuno-judogi"),
    key: "legacy-mizuno-blue",
    productId: "mizuno-blue",
    variant: "Оригинал",
    size: "Уточнить",
  };
  const mizunoItems = o.parseCart(
    JSON.stringify([legacyMizunoWhite, legacyMizunoBlue]),
  );
  assert.equal(mizunoItems.length, 2, "Legacy Mizuno cart lines are preserved");
  assert.deepEqual(
    mizunoItems.map((entry) => [entry.productId, entry.variant]),
    [
      ["mizuno-judogi", "white-licensed"],
      ["mizuno-judogi", "blue-original"],
    ],
  );
  const mizunoMessage = o.buildOrderMessage(mizunoItems);
  for (const value of [
    "Mizuno — кимоно",
    "Цвет: Белый",
    "Версия: Лицензионный",
    "Цвет: Синий",
    "Версия: Оригинал",
  ])
    assert.ok(mizunoMessage.includes(value), value);
  const bandWide = {
    ...o.newItem("korean-band", "5 см × 200 см"),
    key: "band-wide",
  };
  const bandNarrow = {
    ...o.newItem("korean-band", "3 см × 200 см"),
    key: "band-narrow",
  };
  const bandVariants = o.parseCart(JSON.stringify([bandWide, bandNarrow]));
  assert.equal(
    bandVariants.length,
    2,
    "Different band widths remain separate cart lines",
  );
  assert.deepEqual(
    bandVariants.map((entry) => entry.variant),
    ["5 см × 200 см", "3 см × 200 см"],
  );
  assert.equal(
    o.newItem("korean-band").variant,
    "5 см × 200 см",
    "The wide band is the default variant",
  );
  assert.equal(
    catalog.productImages(catalog.getProduct("korean-band"))[0],
    "/images/products/equipment/korean-band/main.png",
  );
  const bandMessage = o.buildOrderMessage(bandVariants);
  for (const value of [
    "Корейский жгут",
    "Ширина: 5 см × 200 см",
    "Ширина: 3 см × 200 см",
  ])
    assert.ok(bandMessage.includes(value), value);
  const mizunoVariants = [
    ["white-licensed", 75000],
    ["white-original", 175000],
    ["blue-licensed", 75000],
    ["blue-original", 175000],
  ];
  for (const [variant, price] of mizunoVariants) {
    const selected = {
      ...o.newItem("mizuno-judogi", variant),
      key: "mizuno-" + variant,
    };
    assert.equal(selected.variant, variant);
    assert.equal(o.itemTotal(selected), price);
    assert.deepEqual(o.parseCart(JSON.stringify([selected])), [selected]);
  }
  assert.ok(o.buildOrderMessage([
    { ...o.newItem("mizuno-judogi", "blue-original"), key: "mizuno-kk" },
  ], "kk").includes("Нұсқа: Түпнұсқа"));
  assert.ok(o.buildOrderMessage([
    { ...o.newItem("mizuno-judogi", "white-licensed"), key: "mizuno-en" },
  ], "en").includes("Version: Licensed"));
  const mizunoBelt = {
    ...o.newItem("mizuno-black-belt"),
    key: "mizuno-belt",
    size: "4",
  };
  const sakuraBelt = {
    ...o.newItem("sakura-black-belt"),
    key: "sakura-belt",
    size: "3",
    quantity: 2,
  };
  assert.equal(o.priceText(catalog.getProduct("mizuno-black-belt").price), "25 000 ₸");
  assert.equal(o.priceText(catalog.getProduct("sakura-black-belt").price), "25 000–30 000 ₸");
  assert.deepEqual(o.itemTotal(sakuraBelt), { min: 50000, max: 60000 });
  assert.deepEqual(o.cartTotal([mizunoBelt, sakuraBelt]), { min: 75000, max: 85000 });
  const beltOrder = o.buildOrderMessage([mizunoBelt, sakuraBelt]);
  for (const value of [
    "Mizuno Black Belt",
    "Sakura Black Belt",
    "Размер: 4",
    "Размер: 3",
    "Цена: 25 000 ₸",
    "Цена: 25 000–30 000 ₸",
    "Итого: 75 000–85 000 ₸",
  ]) assert.ok(beltOrder.includes(value), value);
  const beltWithoutSize = { ...o.newItem("mizuno-black-belt"), key: "belt-no-size" };
  assert.ok(o.buildOrderMessage([beltWithoutSize]).includes("Размер: Уточнить при заказе"));
  for (const [id, price, facts] of [
    ["zone-migaku", 85000, 5],
    ["zone-idomu", 100000, 5],
    ["zone-kiwami", 140000, 5],
  ]) {
    const product = catalog.getProduct(id);
    assert.equal(product.price, price);
    assert.equal(product.specs.length, facts);
  }
  for (const orientation of ["vertical", "horizontal"]) {
    const belt = { ...stitched, customization: { ...stitched.customization, placement: "Пояс", orientation, text: "柔道 勝 Алға ӘҒҚҢӨҰҮҺІ ALGA" } };
    assert.deepEqual(o.parseCart(JSON.stringify([belt])), [belt], "Belt survives cart persistence");
    const message = o.buildOrderMessage([belt]);
    for (const value of ["Пояс / возле одного из концов", belt.customization.text, "Цвет: Золотой", orientation === "vertical" ? "Вертикально" : "Горизонтально"])
      assert.ok(message.includes(value), value);
    assert.equal(new URL(o.whatsappUrl(message, "77001234567")).searchParams.get("text"), message);
  }
  assert.equal(c.parseCustomization({ ...stitched.customization, placement: "Unknown" }), null);
  assert.equal(
    new URL(o.whatsappUrl(stitchMessage, "77001234567")).searchParams.get(
      "text",
    ),
    stitchMessage,
  );
  const legacyPatch = {
    ...item,
    customization: {
      ...item.customization,
      placement: "Грудь",
      font: "Brush",
      color: "Красный",
    },
  };
  assert.deepEqual(
    o.parseCart(JSON.stringify([legacyPatch]))[0].customization,
    item.customization,
  );
  const legacyStitch = {
    ...item,
    customization: {
      enabled: true,
      type: "embroidery",
      surname: "柔道",
      country: "KAZ",
      placement: "Грудь",
      font: "Brush",
      color: "Синий",
    },
  };
  const migrated = o.parseCart(JSON.stringify([legacyStitch]));
  assert.equal(migrated[0].customization.text, "柔道");
  assert.ok(migrated[0].customization.legacyNote.includes("Грудь"));
  assert.ok(o.buildOrderMessage(migrated).includes("Место: Нужно согласовать"));
  catalog.getProduct(item.productId).price = 100;
  config.CUSTOMIZATION_PRICES.backpatch = 20;
  assert.equal(o.itemTotal(item), 240);
  catalog.getProduct(second.productId).price = 50;
  assert.equal(o.cartTotal([item, second]), 290);
  config.CUSTOMIZATION_PRICES.backpatch = null;
  assert.equal(
    o.cartTotal([item, second]),
    null,
    "Unknown customization must not be counted as free",
  );
  console.log(
    "PASS: both personalization modes, Unicode, fixed backpatch, legacy cart migration, URL encoding, disabled phone, prices, storage validation.",
  );
} finally {
  if (
    !resolve(output).startsWith(resolve(tmpdir()) + sep + "alga-orders-test-")
  )
    throw new Error("Unexpected test directory");
  await rm(output, { recursive: true, force: true });
}
