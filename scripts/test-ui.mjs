import "./env.mjs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const port = process.env.TEST_PORT || "4175";
const origin = "http://127.0.0.1:" + port;
const url = origin + (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/";
const cartKey = "alga:cart:v2";
const artifacts = "test-results";
const server = spawn(process.execPath, ["scripts/preview.mjs"], {
  env: { ...process.env, PORT: port }, stdio: ["ignore", "pipe", "pipe"],
});
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Static preview did not start")), 15000);
    server.once("error", error => { clearTimeout(timeout); reject(error); });
    server.once("exit", code => { clearTimeout(timeout); reject(new Error("Preview exited: " + code)); });
    server.stdout.on("data", chunk => {
      if (chunk.toString().includes("Static preview:")) { clearTimeout(timeout); resolve(); }
    });
    server.stderr.on("data", chunk => process.stderr.write(chunk));
  });
  browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ["clipboard-read", "clipboard-write"] });
  const errors = [], failures = [], requests = [];
  context.on("page", page => {
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("response", response => { if (response.status() >= 400) failures.push(response.url()); });
    page.on("request", request => requests.push(request.url()));
  });
  // Validate new-tab behavior without contacting recipients or sending messages.
  await context.route("https://wa.me/**", route => route.fulfill({ contentType: "text/html", body: "<p>WhatsApp link intercepted by local test.</p>" }));
  await context.route("https://www.instagram.com/**", route => route.fulfill({ contentType: "text/html", body: "<p>Instagram link intercepted by local test.</p>" }));
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const dialog = page.locator("dialog");
  assert.equal(await page.locator("#catalog .catalog-card").count(), 12);
  assert.equal(await page.locator(".owner-photo-placeholder").count(), 2);
  await mkdir(artifacts, { recursive: true });
  await page.screenshot({ path: artifacts + "/desktop.png" });

  for (const [name, count] of [["Кимоно", 7], ["Витамины", 4], ["Снаряжение", 1], ["Все товары", 12]]) {
    await page.getByRole("button", { name: new RegExp("^" + name + "\\s*" + count + "$" ) }).click();
    assert.equal(await page.locator("#catalog .catalog-card").count(), count);
  }
  await page.getByRole("searchbox").fill("kiwami");
  assert.equal(await page.locator("#catalog .catalog-card").count(), 1);
  await page.getByRole("searchbox").fill("unknown-product");
  assert.equal(await page.locator(".no-results").count(), 1);
  await page.getByRole("button", { name: "Показать все товары" }).click();
  const cards = page.locator("#catalog .catalog-card");
  for (let i = 0; i < 12; i++) {
    const card = cards.nth(i);
    const name = await card.locator("h3").textContent();
    await card.getByRole("button", { name: "Оформить", exact: true }).click();
    assert.equal(await dialog.getAttribute("aria-label"), name);
    const mainPhoto = dialog.locator(".gallery-main img");
    if (await mainPhoto.count()) {
      await mainPhoto.evaluate(img => img.decode());
      await dialog.getByRole("button", { name: "Увеличить фото" }).click();
      assert.equal(await dialog.locator(".gallery-main.zoomed").count(), 1);
      const thumbs = dialog.locator(".thumbnails button");
      for (let j = 0; j < await thumbs.count(); j++) {
        await thumbs.nth(j).click();
        await mainPhoto.evaluate(img => img.decode());
      }
    } else assert.equal(name, "Корейский жгут");
    await dialog.getByRole("button", { name: "Закрыть", exact: true }).click();
  }

  await cards.first().getByRole("button", { name: "Добавить в корзину", exact: true }).click();
  const fixture = await page.evaluate(key => JSON.parse(localStorage.getItem(key))[0], cartKey);
  await page.locator(".cart-button").click();
  await dialog.getByRole("button", { name: "Увеличить количество", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator(".cart-button b").textContent(), "2");
  await page.locator(".cart-button").click();
  await dialog.getByRole("button", { name: "Изменить", exact: true }).click();
  await dialog.getByLabel("Желаемый размер").fill("180 см, 75 кг");
  await dialog.getByLabel("Включить кастомизацию").check();
  assert.equal(await dialog.getByLabel("Цвет нити").count(), 0);
  await dialog.getByLabel("Фамилия спортсмена").fill("A. TESTOV");
  await dialog.getByLabel("Код страны", { exact: true }).fill("JPN");
  assert.equal(await page.locator(".desktop-preview textPath").first().textContent(), "A. TESTOV");
  assert.equal(await page.locator(".desktop-preview textPath").nth(1).textContent(), "JPN");
  await dialog.getByRole("button", { name: "Вышивка", exact: true }).click();
  await dialog.getByLabel("Текст вышивки").fill("柔道・Алға & +");
  await dialog.getByLabel("Место нанесения").selectOption("Штаны");
  await dialog.getByLabel("Цвет нити").selectOption("Золотой");
  await dialog.getByLabel("Ориентация").selectOption("horizontal");
  await dialog.getByRole("button", { name: "IJF backpatch", exact: true }).click();
  assert.equal(await dialog.getByLabel("Фамилия спортсмена").inputValue(), "A. TESTOV");
  await dialog.getByRole("button", { name: "Вышивка", exact: true }).click();
  assert.equal(await dialog.getByLabel("Текст вышивки").inputValue(), "柔道・Алға & +");
  await dialog.getByRole("button", { name: "Сохранить изменения" }).click();
  await cards.nth(7).getByRole("button", { name: "Добавить в корзину", exact: true }).click();
  await page.locator(".cart-button").click();
  await dialog.getByRole("button", { name: "Оформить заказ", exact: true }).click();
  const message = await dialog.getByLabel("Текст заказа").inputValue();
  for (const part of ["Zone Migaku", "FitLine Activize", "180 см, 75 кг", "柔道・Алға & +", "Штаны / верхняя часть штанины", "Горизонтально", "Цена по запросу"]) assert.ok(message.includes(part), part);
  await dialog.getByRole("button", { name: "Скопировать заказ" }).click();
  assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, "\n"), message);
  const whatsapp = dialog.getByRole("link", { name: "Открыть WhatsApp" });
  let phonePath = null;
  if (await whatsapp.count()) {
    const href = new URL(await whatsapp.getAttribute("href"));
    assert.equal(href.hostname, "wa.me");
    assert.match(href.pathname, /^\/[1-9]\d{7,14}$/);
    assert.equal(href.searchParams.get("text"), message);
    phonePath = href.pathname;
    const popupPromise = context.waitForEvent("page");
    await whatsapp.click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    assert.equal(popup.url(), href.toString());
    await popup.close();
  } else assert.ok(await dialog.getByRole("button", { name: "WhatsApp пока не подключен" }).isDisabled());
  await page.keyboard.press("Escape");
  const instagram = page.locator(".instagram-link");
  const instagramUrl = await instagram.getAttribute("href");
  assert.match(instagramUrl, /^https:\/\/www\.instagram\.com\/[A-Za-z0-9_.]+\/$/);
  const instagramPopup = context.waitForEvent("page");
  await instagram.click();
  const popup = await instagramPopup;
  await popup.waitForLoadState();
  assert.equal(popup.url(), instagramUrl);
  await popup.close();
  await page.locator("#contacts").getByRole("button", { name: "WhatsApp", exact: true }).click();
  if (phonePath) assert.equal(new URL(await dialog.getByRole("link", { name: "Открыть WhatsApp" }).getAttribute("href")).pathname, phonePath);
  await page.keyboard.press("Escape");
  await page.locator(".cart-button").click();
  await dialog.getByRole("button", { name: "Удалить FitLine Activize" }).click();
  assert.equal(await dialog.locator(".cart-line").count(), 1);
  await page.keyboard.press("Escape");

  await page.goto(url + "#product/adidas-champion-ii");
  await dialog.waitFor({ state: "visible" });
  await page.evaluate(() => { location.hash = "catalog"; });
  await dialog.waitFor({ state: "detached" });
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  for (const anchor of ["catalog", "customize", "atelier", "about", "contacts"]) {
    await page.goto(url + "#" + anchor);
    assert.equal(await page.locator("#" + anchor).count(), 1);
  }
  const faq = page.locator(".faq-section details").first();
  await faq.locator("summary").click();
  assert.equal(await faq.getAttribute("open"), "");
  await faq.locator("summary").press("Enter");
  assert.equal(await faq.getAttribute("open"), null);
  const sibling = await context.newPage();
  await sibling.goto(url, { waitUntil: "networkidle" });
  await sibling.evaluate(() => localStorage.clear());
  await page.waitForFunction(() => document.querySelector(".cart-button b").textContent === "0");
  await sibling.close();
  await page.evaluate(({ key, fixture }) => {
    const items = Array.from({ length: 50 }, (_, i) => ({ ...fixture, key: "limit-" + i, size: i ? "size-" + i : "" }));
    localStorage.setItem(key, JSON.stringify(items));
  }, { key: cartKey, fixture });
  await page.reload({ waitUntil: "networkidle" });
  await cards.first().getByRole("button", { name: "Добавить в корзину", exact: true }).click();
  assert.equal(await page.locator(".cart-button b").textContent(), "51", "Existing position can grow at 50-position limit");
  await page.evaluate(({ key, fixture }) => localStorage.setItem(key, JSON.stringify([{ ...fixture, quantity: 99 }])), { key: cartKey, fixture });
  await page.reload({ waitUntil: "networkidle" });
  await cards.first().getByRole("button", { name: "Добавить в корзину", exact: true }).click();
  assert.ok((await page.locator(".shop-toast").textContent()).includes("Максимум 99"));
  await page.evaluate(key => localStorage.setItem(key, "broken"), cartKey);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator(".cart-button b").textContent(), "0");

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobile = await mobileContext.newPage();
  mobile.on("pageerror", error => errors.push(error.message));
  await mobile.goto(url, { waitUntil: "networkidle" });
  for (let y = 0; y < await mobile.evaluate(() => document.body.scrollHeight); y += 600) {
    await mobile.evaluate(y => scrollTo({ top: y, behavior: "instant" }), y);
    await mobile.waitForTimeout(30);
  }
  await mobile.locator("img").evaluateAll(images => Promise.all(images.map(image => image.decode())));
  await mobile.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await mobile.screenshot({ path: artifacts + "/mobile.png" });
  await mobile.getByRole("button", { name: "Создать свою нашивку", exact: true }).click();
  const modal = mobile.locator("dialog");
  await modal.getByLabel("Фамилия спортсмена").fill("N.MARATOVA");
  await modal.getByLabel("Код страны", { exact: true }).fill("KAZ");
  assert.equal(await mobile.locator(".mobile-preview textPath").first().textContent(), "N.MARATOVA");
  await modal.getByRole("button", { name: "Вышивка", exact: true }).click();
  await modal.getByLabel("Текст вышивки").fill("柔道");
  for (const zone of ["Куртка", "Штаны"]) {
    await modal.getByLabel("Место нанесения").selectOption(zone);
    assert.equal(await mobile.locator(".mobile-preview [data-embroidery-zone]").getAttribute("data-embroidery-zone"), zone);
  }
  await mobile.locator(".mobile-preview").scrollIntoViewIfNeeded();
  await mobile.screenshot({ path: artifacts + "/personalization.png" });
  for (const width of [320, 375, 390, 768]) {
    await mobile.setViewportSize({ width, height: 844 });
    assert.ok(await modal.evaluate(element => element.scrollWidth <= element.clientWidth), "Modal overflow at " + width);
    assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Page overflow at " + width);
  }
  await modal.getByRole("button", { name: "Оформить", exact: true }).click();
  assert.ok((await modal.getByLabel("Текст заказа").inputValue()).includes("Текст: 柔道"));
  await mobile.keyboard.press("Escape");
  await mobileContext.close();

  const blockedContext = await browser.newContext();
  await blockedContext.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Storage blocked", "SecurityError"); } }));
  const blocked = await blockedContext.newPage();
  blocked.on("pageerror", error => errors.push(error.message));
  await blocked.goto(url, { waitUntil: "networkidle" });
  assert.ok(await blocked.locator(".storage-notice").isVisible());
  await blocked.locator("#catalog .catalog-card").first().getByRole("button", { name: "Добавить в корзину", exact: true }).click();
  assert.equal(await blocked.locator(".cart-button b").textContent(), "1");
  await blockedContext.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  assert.ok(requests.every(request => request.startsWith(url) || request.startsWith("https://wa.me/") || request.startsWith("https://www.instagram.com/")), "Unexpected external runtime dependency");
  console.log("PASS: all 12 products and galleries; filters/search; cart add/edit/remove/limits/persistence; cross-tab and blocked storage; Unicode/customization; order/copy; intercepted WhatsApp/Instagram links; anchors; FAQ; mobile 320-768; no console errors or broken assets.");
} finally {
  await browser?.close();
  if (server.exitCode === null) {
    const exited = new Promise(resolve => server.once("exit", resolve));
    server.kill();
    await exited;
  }
}
