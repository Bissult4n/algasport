import "./env.mjs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const port = "4176";
const url =
  process.env.TEST_URL ||
  `http://127.0.0.1:${port}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`;
const server = process.env.TEST_URL
  ? null
  : spawn(process.execPath, ["scripts/preview.mjs"], {
      env: { ...process.env, PORT: port },
      stdio: "ignore",
    });
let browser;
const artifacts = "test-results/targeted";
const overlap = (a, b) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(url)).ok) break;
    } catch {}
    if (i === 59) throw new Error("Preview server did not become ready");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  browser = await chromium.launch({
    headless: true,
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (event) => {
    if (event.type() === "error") errors.push(event.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(response.url() + " HTTP " + response.status());
  });
  await mkdir(artifacts, { recursive: true });
  const fontRequests = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".woff2")) fontRequests.push(request.url());
  });
  assert.equal(
    (await page.goto(url, { waitUntil: "networkidle" })).status(),
    200,
  );
  assert.equal(
    fontRequests.length,
    0,
    "Embroidery font must not slow down the homepage",
  );
  for (const width of [1920, 1440, 1024, 768, 390, 375]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    const boxes = await page.evaluate(() =>
      Object.fromEntries(
        [
          ".hero-product",
          ".hero-product > .kimono-cutout",
          ".hero-caption",
          ".hero-copy",
          ".hero-sun",
        ].map((selector) => {
          const r = document.querySelector(selector).getBoundingClientRect();
          return [
            selector,
            {
              left: r.left,
              top: r.top,
              right: r.right,
              bottom: r.bottom,
              width: r.width,
              height: r.height,
            },
          ];
        }),
      ),
    );
    const stage = boxes[".hero-product"],
      gi = boxes[".hero-product > .kimono-cutout"];
    assert.ok(
      gi.left >= stage.left + 10 && gi.right <= stage.right - 10,
      "Horizontal breathing room " + width,
    );
    assert.ok(
      gi.top >= stage.top + 28 && gi.bottom <= stage.bottom - 75,
      "Full gi and caption breathing room " + width,
    );
    assert.ok(
      Math.abs(gi.width / gi.height - 281 / 500) < 0.01,
      "Unstretched silhouette " + width,
    );
    assert.ok(
      !overlap(gi, boxes[".hero-caption"]) && !overlap(gi, boxes[".hero-copy"]),
      "Text must not cover gi " + width,
    );
    const sun = boxes[".hero-sun"];
    assert.ok(
      sun.left >= stage.left + 28 && sun.right <= stage.right - 28,
      "Decorative sun must fit its own column " + width,
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Page overflow " + width,
    );
    await page
      .locator(".shop-hero")
      .screenshot({ path: `${artifacts}/hero-${width}.png` });
  }
  const modal = page.locator("dialog");
  for (const width of [1440, 390, 375, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page
      .getByRole("button", { name: "Сравнить модели", exact: true })
      .click();
    assert.equal(await modal.locator(".comparison-model").count(), 3);
    assert.ok(
      await modal.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    );
    assert.equal(
      await modal.locator(".comparison-table").isVisible(),
      width > 760,
    );
    assert.equal(
      await modal.locator(".comparison-mobile-facts").first().isVisible(),
      width <= 760,
    );
    await modal.locator(".comparison-sizing summary").click();
    assert.match(
      await modal.locator(".comparison-sizing").textContent(),
      /не остатки ALGA/,
    );
    await modal.locator(".comparison-sizing summary").press("Enter");
    await modal.evaluate((element) => {
      element.scrollTop = 0;
    });
    await modal.screenshot({ path: `${artifacts}/compare-${width}.png` });
    if (width === 1440) {
      await modal
        .getByRole("button", { name: "Открыть Idomu", exact: true })
        .click();
      assert.equal(await modal.getAttribute("aria-label"), "Zone Idomu");
    }
    await page.keyboard.press("Escape");
    assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(url + "#product/adidas-champion-ii", {
      waitUntil: "networkidle",
    });
    await modal.getByLabel("Включить кастомизацию").check();
    await modal.getByLabel("Фамилия спортсмена").fill("N.MARATOVA");
    await modal.getByLabel("Код страны", { exact: true }).fill("KAZ");
    const preview = modal.locator(
      width > 760 ? ".desktop-preview" : ".mobile-preview",
    );
    assert.equal(
      await preview.locator("textPath").first().textContent(),
      "N.MARATOVA",
    );
    assert.match(
      await preview.locator("image").getAttribute("href"),
      /adidas-ii-back/,
    );
    await modal.getByRole("button", { name: "Вышивка", exact: true }).click();
    await modal.getByLabel("Цвет нити").selectOption("Золотой");
    const images = new Set();
    for (const zone of ["Куртка", "Штаны", "Пояс"]) {
      await modal.getByLabel("Место нанесения").selectOption(zone);
      images.add(await preview.locator("image").getAttribute("href"));
      assert.equal(
        await preview
          .locator("[data-embroidery-zone]")
          .getAttribute("data-embroidery-zone"),
        zone,
      );
      for (const text of [
        "柔道",
        "勝",
        "Алға",
        "ALGA",
        "ӘҒҚҢӨҰҮҺІ",
        "Сериков",
        "か\u3099",
      ]) {
        await modal.getByLabel("Текст вышивки").fill(text);
        for (const font of ["Modern", "Serif", "Brush"]) {
          await modal.getByLabel("Шрифт", { exact: true }).selectOption(font);
          for (const orientation of ["horizontal", "vertical"]) {
            await modal.getByLabel("Ориентация").selectOption(orientation);
            const letters = preview.locator('defs g[id$="letters"]');
            assert.equal(
              (await letters.textContent()).normalize("NFC"),
              text.normalize("NFC"),
            );
            assert.equal(
              await preview
                .locator("[data-orientation]")
                .getAttribute("data-orientation"),
              orientation,
            );
          }
        }
      }
      await modal.getByLabel("Текст вышивки").fill("柔道");
      await modal.getByLabel("Шрифт", { exact: true }).selectOption("Modern");
      for (const [color, hex] of Object.entries({
        Синий: "#183c79",
        Красный: "#922b2c",
        Черный: "#282b30",
        Золотой: "#93702d",
      })) {
        await modal.getByLabel("Цвет нити").selectOption(color);
        assert.equal(await preview.locator("[data-embroidery-zone] > use").first().getAttribute("fill"), hex);
      }
      await page.evaluate(() => document.fonts.ready);
      for (const orientation of ["horizontal", "vertical"]) {
        await modal.getByLabel("Ориентация").selectOption(orientation);
        await preview.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
        assert.ok(await preview.locator("figcaption").evaluate((element) => {
          const box = element.getBoundingClientRect();
          const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
          return element === hit || element.contains(hit);
        }), "Placement caption must remain readable, not covered by the sticky footer");
        await preview.screenshot({
          path: `${artifacts}/embroidery-${zone}-${orientation}-${width}.png`,
        });
      }
    }
    assert.equal(images.size, 3, "Each embroidery zone needs a distinct photo");
    assert.ok(
      [...images].every((src) => src.includes("/images/personalization/")),
    );
    const savedZones = [
      { placement: "Куртка", color: "Красный", orientation: "vertical" },
      { placement: "Штаны", color: "Синий", orientation: "horizontal" },
      { placement: "Пояс", color: "Золотой", orientation: "vertical" },
    ];
    for (const [index, settings] of savedZones.entries()) {
      if (index > 0) {
        await page.goto(url + "#product/adidas-champion-ii", { waitUntil: "networkidle" });
        await modal.getByLabel("Включить кастомизацию").check();
        await modal.getByRole("button", { name: "Вышивка", exact: true }).click();
      }
      await modal.getByLabel("Место нанесения").selectOption(settings.placement);
      await modal.getByLabel("Цвет нити").selectOption(settings.color);
      await modal.getByLabel("Ориентация").selectOption(settings.orientation);
      await modal.getByLabel("Текст вышивки").fill("柔道 Алға");
      await modal.getByRole("button", { name: "Добавить в корзину", exact: true }).click();
    }
    await page.reload({ waitUntil: "networkidle" });
    const cart = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("alga:cart:v2")),
    );
    assert.equal(cart.length, 3, "Different placements must stay separate in the cart");
    for (const settings of savedZones) {
      const { customization } = cart.find((item) => item.customization.placement === settings.placement);
      for (const [key, value] of Object.entries(settings)) assert.equal(customization[key], value);
      assert.equal(customization.text, "柔道 Алға");
    }
    await page.locator(".cart-button").click();
    assert.match(
      await modal.locator(".personalization-summary").last().textContent(),
      /Пояс.*возле одного из концов/s,
    );
    await modal
      .getByRole("button", { name: "Изменить", exact: true })
      .last()
      .click();
    assert.equal(
      await modal.getByLabel("Место нанесения").inputValue(),
      "Пояс",
    );
    await modal.getByRole("button", { name: "Оформить", exact: true }).click();
    const order = await modal.getByLabel("Текст заказа").inputValue();
    for (const expected of [
      "Пояс / возле одного из концов",
      "柔道 Алға",
      "Вертикально",
      "Золотой",
    ])
      assert.ok(order.includes(expected), expected);
    await page.keyboard.press("Escape");
    await page.locator(".cart-button").click();
    await modal.getByRole("button", { name: "Оформить заказ", exact: true }).click();
    const combinedOrder = await modal.getByLabel("Текст заказа").inputValue();
    for (const expected of ["Куртка / нижняя часть", "Штаны / верхняя часть штанины", "Пояс / возле одного из концов", "Красный", "Синий", "Золотой", "Горизонтально", "Вертикально"])
      assert.ok(combinedOrder.includes(expected), "Combined cart order: " + expected);
    assert.equal(combinedOrder.split("柔道 Алға").length - 1, 3);
    await page.keyboard.press("Escape");
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
  }
  assert.ok(
    fontRequests.some((url) => /\.woff2$/.test(url)),
    "Japanese fallback is served locally",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: hero at 1920/1440/1024/768/390/375; comparison at desktop/390/375/320; 3 real embroidery photos; all scripts/fonts/orientations/colors; backpatch; all zones persist in cart and combined order; belt edit; no browser errors.",
  );
} finally {
  await browser?.close();
  if (server) {
    const exited = new Promise((resolve) => server.once("exit", resolve));
    if (server.exitCode === null) {
      server.kill();
      await exited;
    }
  }
}
