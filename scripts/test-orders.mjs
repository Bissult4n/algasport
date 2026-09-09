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
  const item = o.newItem("zone-migaku");
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
    "Количество: 2",
    "IJF backpatch",
    "A. SERIKOV & +",
    "Доплата: Цена по запросу",
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
  assert.equal(o.itemTotal(item), null);
  assert.equal(o.cartTotal([item, second]), null);
  assert.ok(msg.includes("Место: Спина · фиксировано"));
  for (const label of ["Шрифт:", "Цвет:", "Ориентация:"])
    assert.ok(
      !msg.includes(label),
      "Backpatch must not include decorative fields",
    );
  const stitched = {
    ...o.newItem("adidas-champion-ii"),
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
    "Текст: 柔道・Алға & +",
    "Штаны / верхняя часть штанины",
    "Цвет: Золотой",
    "Ориентация: Горизонтально",
  ])
    assert.ok(stitchMessage.includes(label), label);
  for (const label of ["Фамилия:", "Страна:"])
    assert.ok(!stitchMessage.includes(label));
  assert.deepEqual(o.parseCart(JSON.stringify([stitched])), [stitched]);
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
  const catalog = require(join(output, "catalog.js"));
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
