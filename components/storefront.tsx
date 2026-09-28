"use client";

import { useEffect, useState } from "react";
import {
  categories,
  getProduct,
  productImages,
  productPrice,
  products,
  type Category,
  type Product,
} from "@/lib/catalog";
import {
  CART_KEY,
  newItem,
  parseCart,
  priceText,
  whatsappUrl,
  type CartItem,
} from "@/lib/orders";
import { INSTAGRAM_URL, INSTAGRAM_USERNAME } from "@/lib/shop-config";
import { Arrow, BagIcon, BrandMark, Photo } from "./shop-ui";
import { ProductDialog } from "./product-dialog";
import { CartDialog, OrderDialog } from "./cart-dialog";
import { KimonoPhoto } from "./kimono-photo";
import { OwnersSection } from "./owners-section";
import { ZoneComparison } from "./zone-comparison";
import { useI18n } from "@/lib/i18n/context";
import {
  localizedCategory,
  localizedProduct,
  localizedVariant,
} from "@/lib/i18n/catalog";
import { localeLabels, type Locale } from "@/lib/i18n";
import { ProductFacts } from "./product-facts";

type View =
  | { type: "product"; id: string; initial?: CartItem }
  | { type: "cart" }
  | { type: "compare" }
  | { type: "order"; items: CartItem[] }
  | null;

function ProductCard({
  product,
  onOpen,
  onAdd,
}: {
  product: Product;
  onOpen: (variant: string) => void;
  onAdd: (variant: string) => void;
}) {
  const { locale, t } = useI18n();
  const [variant, setVariant] = useState(product.variants[0]);
  const images = productImages(product, variant);
  const copy = localizedProduct(product, locale);
  return (
    <article className="catalog-card">
      <button
        type="button"
        className="catalog-photo"
        onClick={() => onOpen(variant)}
        aria-label={t("product.open", { name: copy.name })}
      >
        <Photo src={images[0]} alt={copy.name + ", " + localizedVariant(variant, locale)} />
        {copy.badge && (
          <span className="product-badge">{copy.badge}</span>
        )}
        <span className="photo-arrow">
          <Arrow />
        </span>
      </button>
      <div className="catalog-card-copy">
        <div className="product-meta">
          <p className="product-brand">{product.brand}</p>
          <span>{localizedCategory(product.category, locale).name}</span>
        </div>
        <h3>
          <button type="button" onClick={() => onOpen(variant)}>
            {copy.name}
          </button>
        </h3>
        <p className="product-description">{copy.description}</p>
        <ProductFacts specs={copy.specs} compact />
        <p className="product-stock">
          {copy.availability || (product.category === "kimono"
            ? t("common.kimonoAvailability")
            : t("common.availability"))}
        </p>
        {product.variantSwatches && product.variants.length > 1 && (
          <div className="card-color-picker" aria-label={t("product.colorChoice")}>
            {product.variants.map((name) => (
              <button
                type="button"
                key={name}
                className={name === variant ? "active" : ""}
                aria-label={t("product.color", { value: localizedVariant(name, locale) })}
                aria-pressed={name === variant}
                onClick={() => setVariant(name)}
              >
                <span
                  className="color-swatch"
                  style={{ background: product.variantSwatches?.[name] }}
                  aria-hidden="true"
                />
                {localizedVariant(name, locale)}
              </button>
            ))}
          </div>
        )}
        <div className="product-price">
          <span>{priceText(productPrice(product, variant), locale)}</span>
          <small>{t("product.confirmInChat")}</small>
        </div>
        <div className="card-actions">
          <button className="btn-primary" onClick={() => onOpen(variant)}>
            {t("product.order")} <Arrow />
          </button>
          <button className="btn-secondary" onClick={() => onAdd(variant)}>
            {t("product.add")}
          </button>
        </div>
      </div>
    </article>
  );
}

export function Storefront() {
  const { locale, setLocale, t } = useI18n();
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      setCart(parseCart(localStorage.getItem(CART_KEY)));
    } catch {
      setStorageError(true);
    }
    setLoaded(true);
    const sync = (e: StorageEvent) => {
      if (e.key === CART_KEY || e.key === null) setCart(parseCart(e.newValue));
    };
    const hash = () => {
      const id = window.location.hash.slice(9);
      if (window.location.hash.startsWith("#product/") && getProduct(id))
        setView({ type: "product", id });
      else setView(current => current?.type === "product" ? null : current);
    };
    hash();
    window.addEventListener("storage", sync);
    window.addEventListener("hashchange", hash);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("hashchange", hash);
    };
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      setStorageError(true);
    }
  }, [cart, loaded]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  function openProduct(product: Product, initial?: CartItem) {
    setView({ type: "product", id: product.id, initial });
    history.replaceState(null, "", "#product/" + product.id);
  }
  function close() {
    setView(null);
    if (location.hash.startsWith("#product/"))
      history.replaceState(null, "", "#catalog");
  }
  function add(item: CartItem) {
    const identity = (v: CartItem) =>
      JSON.stringify({
        id: v.productId,
        size: v.size,
        variant: v.variant,
        customization: v.customization,
      });
    const existing = cart.find(v => identity(v) === identity(item));
    if (cart.length >= 50 && !item.key && !existing) {
      setNotice(t("product.cartLimit"));
      return;
    }
    if (!item.key && existing && existing.quantity + item.quantity > 99) {
      setNotice(t("product.quantityLimit"));
      return;
    }
    setCart((current) => {
      if (item.key && current.some((v) => v.key === item.key))
        return current.map((v) => (v.key === item.key ? item : v));
      const match = current.find((v) => identity(v) === identity(item));
      if (match)
        return current.map((v) =>
          v.key === match.key
            ? { ...v, quantity: Math.min(99, v.quantity + item.quantity) }
            : v,
        );
      return [
        ...current,
        {
          ...item,
          key: crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(36) + Math.random().toString(36).slice(2),
        },
      ];
    });
    setNotice(
      item.key
        ? t("product.saved")
        : t("product.added", {
            name: localizedProduct(getProduct(item.productId)!, locale).name,
          }),
    );
    close();
  }
  function chooseCategory(value: Category | "all") {
    setCategory(value);
    setQuery("");
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  }
  const filtered = products.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (() => {
        const copy = localizedProduct(p, locale);
        return [
        copy.name,
        p.brand,
        copy.description,
        copy.detail,
        ...(copy.specs?.map((spec) => spec.value) || []),
        localizedCategory(p.category, locale).name,
      ];
      })()
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const count = cart.reduce((n, item) => n + item.quantity, 0);
  const renderCard = (p: Product) => (
    <ProductCard
      key={p.id}
      product={p}
      onOpen={(variant) => openProduct(p, newItem(p.id, variant))}
      onAdd={(variant) => add(newItem(p.id, variant))}
    />
  );

  return (
    <div className="theme-root static-shop">
      <a className="skip-link" href="#catalog">
        {t("nav.catalog")}
      </a>
      <div className="announcement">
        ALGA SPORT SHOP <span>{t("announcement")}</span>
      </div>
      <header className="shop-header">
        <div className="container-frame">
          <a href="#home" className="wordmark">
            <BrandMark />
            <span>
              ALGA<small>SPORT SHOP</small>
            </span>
          </a>
          <nav aria-label={t("nav.main")}>
            <a href="#catalog">{t("nav.catalog")}</a>
            <a href="#atelier">{t("nav.customization")}</a>
            <a href="#about">{t("nav.about")}</a>
            <a href="#contacts">{t("nav.contacts")}</a>
          </nav>
          <div className="header-actions">
            <a
              className="instagram-link"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram <Arrow />
            </a>
            <div className="language-switcher" role="group" aria-label={t("language.label")}>
              {(Object.keys(localeLabels) as Locale[]).map((option) => (
                <button
                  type="button"
                  key={option}
                  className={locale === option ? "active" : ""}
                  aria-pressed={locale === option}
                  onClick={() => setLocale(option)}
                >
                  {localeLabels[option]}
                </button>
              ))}
            </div>
            <button
              className="cart-button"
              onClick={() => setView({ type: "cart" })}
              aria-label={t("header.cartAria", { count })}
            >
              <BagIcon />
              <span>{t("header.cart")}</span>
              <b>{count}</b>
            </button>
          </div>
        </div>
      </header>
      <main>
        <section id="home" className="shop-hero">
          <div className="container-frame hero-grid">
            <div className="hero-copy">
              <p className="label">
                <span className="red-dot" /> {t("hero.eyebrow")}
              </p>
              <h1>
                {t("hero.title1")}
                <br />{t("hero.title2")}
                <br />
                <span>{t("hero.title3")}</span>
              </h1>
              <p>
                {t("hero.copy1")}
                <br />
                {t("hero.copy2")}
              </p>
              <div className="hero-actions">
                <a href="#catalog" className="btn-primary">
                  {t("hero.choose")} <Arrow />
                </a>
                <a href="#atelier" className="text-link">
                  {t("hero.personalize")} <Arrow />
                </a>
              </div>
              <div className="hero-footnote">
                <span>
                  <b>{t("hero.fitTitle")}</b>{t("hero.fitCopy")}
                </span>
                <span>
                  <b>{t("hero.customTitle")}</b>{t("hero.customCopy")}
                </span>
              </div>
            </div>
            <div className="hero-product">
              <div className="hero-sun" aria-hidden="true" />
              <span className="hero-kanji" aria-hidden="true">
                柔<br />道
              </span>
              <div className="hero-kimono-pair">
                <Photo
                  src="/images/hero/zone-blue.png"
                  alt={t("hero.blueAlt")}
                  className="hero-kimono hero-kimono-blue"
                  eager
                />
                <Photo
                  src="/images/hero/zone-white.png"
                  alt={t("hero.whiteAlt")}
                  className="hero-kimono hero-kimono-white"
                  eager
                />
              </div>
              <span className="hero-caption">
                ZONE JUDOGI / WHITE + BLUE
                <br />
                <small>{t("hero.caption")}</small>
              </span>
              <a
                className="hero-product-link"
                href="#catalog"
                aria-label={t("hero.catalogAria")}
              >
                <Arrow />
              </a>
            </div>
          </div>
        </section>
        <div className="brand-strip">
          <span>
            ZONE <small>BY MITSUBOSHI</small>
          </span>
          <i />
          <span>
            adidas <small>COMBAT SPORTS</small>
          </span>
          <i />
          <span className="fitline-word">
            FitLine <small>PM-INTERNATIONAL</small>
          </span>
          <i />
          <span>
            ALGA <small>PERSONALIZATION</small>
          </span>
        </div>

        <section
          className="container-frame category-section"
          aria-label={t("category.aria")}
        >
          {categories.map((c, i) => (
            <button
              key={c.id}
              onClick={() => chooseCategory(c.id)}
              className={"category-tile category-" + c.id}
            >
              <span className="category-number">0{i + 1}</span>
              <div>
                <h2>{localizedCategory(c.id, locale).name}</h2>
                <p>{localizedCategory(c.id, locale).caption}</p>
              </div>
              <Arrow />
            </button>
          ))}
        </section>

        <section id="catalog" className="container-frame catalog-section">
          <div className="section-heading">
            <div>
              <p className="label">{t("catalog.eyebrow")}</p>
              <h2>{t("catalog.title")}</h2>
            </div>
            <p>
              {t("catalog.intro1")}
              <br />
              {t("catalog.intro2")}
            </p>
          </div>
          <div className="catalog-toolbar">
            <div
              className="category-tabs"
              role="group"
              aria-label={t("catalog.filterAria")}
            >
              {[{ id: "all" as const }, ...categories].map((c) => (
                <button
                  key={c.id}
                  aria-pressed={category === c.id}
                  className={category === c.id ? "active" : ""}
                  onClick={() => setCategory(c.id as Category | "all")}
                >
                  {c.id === "all"
                    ? t("category.all")
                    : localizedCategory(c.id, locale).name}
                  <span>
                    {c.id === "all"
                      ? products.length
                      : products.filter((p) => p.category === c.id).length}
                  </span>
                </button>
              ))}
            </div>
            <label className="catalog-search">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="8" cy="8" r="5.5" />
                <path d="m12 12 5 5" />
              </svg>
              <input
                type="search"
                placeholder={t("catalog.search")}
                aria-label={t("catalog.search")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          {(category === "all" || category === "kimono") && (
            <div className="comparison-entry">
              <p><strong>ZONE / MITSUBOSHI</strong> {t("catalog.comparePrompt")}</p>
              <button className="btn-secondary" onClick={() => setView({ type: "compare" })}>{t("catalog.compare")} <Arrow /></button>
            </div>
          )}
          <p className="catalog-note">
            {t("catalog.note")}
          </p>
          <div className="catalog-grid">{filtered.map(renderCard)}</div>
          {!filtered.length && (
            <div className="no-results">
              <h3>{t("catalog.emptyTitle")}</h3>
              <p>{t("catalog.emptyCopy")}</p>
              <button
                className="btn-secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                {t("catalog.showAll")}
              </button>
            </div>
          )}
        </section>

        <aside
          className="size-help container-frame"
          aria-label={t("sizeHelp.aria")}
        >
          <div className="size-help-inner">
            <span className="size-symbol" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="m5 11 16-6 7 17-16 6Z" stroke="currentColor" />
                <path d="m10 9 2 5m3-7 2 5m3-7 2 5" stroke="currentColor" />
              </svg>
            </span>
            <div>
              <h2>{t("sizeHelp.title")}</h2>
              <p>{t("sizeHelp.copy")}</p>
            </div>
            <a className="text-link" href="#catalog">
              {t("sizeHelp.action")} <Arrow />
            </a>
          </div>
        </aside>

      <div id="customize" aria-hidden="true" />
      <section id="atelier" className="atelier-section container-frame">
          <div className="atelier-photo">
            <KimonoPhoto back />
            <div className="atelier-stamp">
              YOUR
              <br />
              NAME.<span>YOUR STORY.</span>
            </div>
            <p>ALGA ATELIER / PERSONALIZATION</p>
          </div>
          <div className="atelier-copy">
            <p className="label">{t("atelier.eyebrow")}</p>
            <h2>
              {t("atelier.title1")}
              <br />
              <em>{t("atelier.title2")}</em>
            </h2>
            <p>{t("atelier.copy")}</p>
            <div className="atelier-options">
              <span>
                <b>01 / IJF backpatch</b>{t("atelier.backpatch")}
              </span>
              <span>
                <b>02 / {t("custom.embroidery")}</b>{t("atelier.embroidery")}
              </span>
            </div>
            <p className="small-copy muted">
              {t("atelier.note")}
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                const item = newItem("adidas-champion-ii");
                item.customization.enabled = true;
                openProduct(getProduct(item.productId)!, item);
              }}
            >
              {t("atelier.action")} <Arrow />
            </button>
          </div>
        </section>

        <section className="container-frame featured-section">
          <div className="section-heading">
            <div>
              <p className="label">{t("featured.eyebrow")}</p>
              <h2>{t("featured.title")}</h2>
            </div>
            <a href="#catalog" className="text-link">
              {t("featured.all")} <Arrow />
            </a>
          </div>
          <div className="catalog-grid featured-grid">
            {products.filter((p) => p.featured).map(renderCard)}
          </div>
        </section>

        <section id="about" className="about-section container-frame">
          <div>
            <p className="label">{t("about.eyebrow")}</p>
            <h2>
              {t("about.title1")}
              <br />
              <span>{t("about.title2")}</span>
            </h2>
            <p className="about-caption">
              {t("about.caption")}
            </p>
          </div>
          <div>
            <p className="about-intro">
              {t("about.intro")}
            </p>
            <p className="muted">
              {t("about.copy")}
            </p>
            <div className="order-steps">
              <div>
                <b>01</b>
                <p>
                  {t("about.step1")}
                  <small>{t("about.step1copy")}</small>
                </p>
              </div>
              <div>
                <b>02</b>
                <p>
                  {t("about.step2")}
                  <small>{t("about.step2copy")}</small>
                </p>
              </div>
              <div>
                <b>03</b>
                <p>
                  {t("about.step3")}
                  <small>{t("about.step3copy")}</small>
                </p>
              </div>
            </div>
          </div>
        </section>

        <OwnersSection />

        <section className="container-frame faq-section">
          <p className="label">{t("faq.eyebrow")}</p>
          <h2>{t("faq.title")}</h2>
          {[
            [
              t("faq.q1"),
              t(whatsappUrl("") ? "faq.a1whatsapp" : "faq.a1offline"),
            ],
            [
              t("faq.q2"),
              t("faq.a2", {
                delivery: t("common.delivery"),
                payment: t("common.payment"),
              }),
            ],
            [
              t("faq.q3"),
              t("faq.a3"),
            ],
            [
              t("faq.q4"),
              t("faq.a4"),
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
      </main>
      <footer id="contacts" className="shop-footer wave-pattern">
        <div className="container-frame">
          <div className="footer-top">
            <div>
              <p className="label">{t("footer.eyebrow")}</p>
              <h2>
                {t("footer.title1")}
                <br />{t("footer.title2")}
              </h2>
              <p>{t("footer.copy")}</p>
            </div>
            <div className="footer-links">
              <button
                className="btn-primary"
                onClick={() => setView({ type: "order", items: [] })}
              >
                WhatsApp <Arrow />
              </button>
              <a
                className="btn-secondary"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram <Arrow />
              </a>
              <span>@{INSTAGRAM_USERNAME}</span>
            </div>
          </div>
          <div className="footer-bottom">
            <a href="#home" className="wordmark">
              <BrandMark />
              <span>
                ALGA<small>SPORT SHOP</small>
              </span>
            </a>
            <p>JUDO / KAZAKHSTAN / CHARACTER</p>
            <small>© 2026 ALGA Sport Shop</small>
          </div>
        </div>
      </footer>
      <nav className="mobile-dock" aria-label={t("nav.quick")}>
        <a href="#catalog">{t("nav.catalog")}</a>
        <a href="#atelier">{t("nav.patch")}</a>
        <button onClick={() => setView({ type: "cart" })}>
          <BagIcon /> {t("header.cart")} <b>{count}</b>
        </button>
        <button onClick={() => setView({ type: "order", items: [] })}>
          {t("nav.contact")} <Arrow />
        </button>
      </nav>
      {storageError && (
        <div className="storage-notice" role="status">
          {t("storage.error")}
        </div>
      )}
      {notice && (
        <div className="shop-toast" role="status">
          {notice}
          <button onClick={() => setView({ type: "cart" })}>
            {t("toast.cart")} <Arrow />
          </button>
        </div>
      )}
      {view?.type === "product" && (
        <ProductDialog
          key={view.initial?.key || view.id}
          product={getProduct(view.id)!}
          initial={view.initial}
          onClose={close}
          onAdd={add}
          onOrder={(item) => setView({ type: "order", items: [item] })}
        />
      )}
      {view?.type === "cart" && (
        <CartDialog
          items={cart}
          onClose={close}
          onQuantity={(key, q) =>
            setCart((current) =>
              current.map((i) => (i.key === key ? { ...i, quantity: q } : i)),
            )
          }
          onRemove={(key) =>
            setCart((current) => current.filter((i) => i.key !== key))
          }
          onEdit={(item) => openProduct(getProduct(item.productId)!, item)}
          onOrder={() => setView({ type: "order", items: cart })}
        />
      )}
      {view?.type === "compare" && (
        <ZoneComparison
          onClose={close}
          onChoose={id => openProduct(getProduct(id)!)}
          onHelp={() => setView({ type: "order", items: [] })}
        />
      )}
      {view?.type === "order" && (
        <OrderDialog items={view.items} onClose={close} />
      )}
    </div>
  );
}
