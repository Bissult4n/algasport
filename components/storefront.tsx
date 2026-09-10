"use client";

import { useEffect, useState } from "react";
import {
  categories,
  categoryName,
  getProduct,
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
import { INSTAGRAM_URL, INSTAGRAM_USERNAME, SHOP_TERMS, DELIVERY_TEXT, PAYMENT_TEXT } from "@/lib/shop-config";
import { Arrow, BagIcon, BrandMark, Photo } from "./shop-ui";
import { ProductDialog } from "./product-dialog";
import { CartDialog, OrderDialog } from "./cart-dialog";
import { KimonoPhoto } from "./kimono-photo";
import { OwnersSection } from "./owners-section";
import { ZoneComparison } from "./zone-comparison";

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
  onOpen: () => void;
  onAdd: () => void;
}) {
  return (
    <article className="catalog-card">
      <button
        type="button"
        className="catalog-photo"
        onClick={onOpen}
        aria-label={"Открыть " + product.name}
      >
        <Photo src={product.images[0]} alt={product.name} />
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}
        <span className="photo-arrow">
          <Arrow />
        </span>
      </button>
      <div className="catalog-card-copy">
        <div className="product-meta">
          <p className="product-brand">{product.brand}</p>
          <span>{categoryName(product.category)}</span>
        </div>
        <h3>
          <button type="button" onClick={onOpen}>
            {product.name}
          </button>
        </h3>
        <p className="product-description">{product.description}</p>
        <p className="product-stock">
          {product.availability || (product.category === "kimono"
            ? SHOP_TERMS.kimonoAvailability
            : SHOP_TERMS.availability)}
        </p>
        <div className="product-price">
          <span>{priceText(product.price)}</span>
          <small>Уточним в переписке</small>
        </div>
        <div className="card-actions">
          <button className="btn-primary" onClick={onOpen}>
            Оформить <Arrow />
          </button>
          <button className="btn-secondary" onClick={onAdd}>
            Добавить в корзину
          </button>
        </div>
      </div>
    </article>
  );
}

export function Storefront() {
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
      setNotice("В корзине уже 50 позиций. Оформите их отдельным заказом.");
      return;
    }
    if (!item.key && existing && existing.quantity + item.quantity > 99) {
      setNotice("Максимум 99 единиц в одной позиции. Измените количество в корзине.");
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
        ? "Параметры товара сохранены"
        : getProduct(item.productId)!.name + " добавлен в корзину",
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
      (p.name + " " + categoryName(p.category))
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const count = cart.reduce((n, item) => n + item.quantity, 0);
  const renderCard = (p: Product) => (
    <ProductCard
      key={p.id}
      product={p}
      onOpen={() => openProduct(p)}
      onAdd={() => add(newItem(p.id))}
    />
  );

  return (
    <div className="theme-root static-shop">
      <a className="skip-link" href="#catalog">
        Перейти к каталогу
      </a>
      <div className="announcement">
        ALGA SPORT SHOP <span>Экипировка. Характер. Движение вперед.</span>
      </div>
      <header className="shop-header">
        <div className="container-frame">
          <a href="#home" className="wordmark">
            <BrandMark />
            <span>
              ALGA<small>SPORT SHOP</small>
            </span>
          </a>
          <nav aria-label="Основная навигация">
            <a href="#catalog">Каталог</a>
            <a href="#atelier">Кастомизация</a>
            <a href="#about">О магазине</a>
            <a href="#contacts">Контакты</a>
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
            <button
              className="cart-button"
              onClick={() => setView({ type: "cart" })}
              aria-label={"Корзина, товаров: " + count}
            >
              <BagIcon />
              <span>Корзина</span>
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
                <span className="red-dot" /> JUDO CULTURE / KAZAKHSTAN
              </p>
              <h1>
                СИЛА
                <br />В КАЖДОЙ
                <br />
                <span>ДЕТАЛИ.</span>
              </h1>
              <p>
                Кимоно для вашего пути в дзюдо.
                <br />
                Поможем с моделью, размером и персональной вышивкой.
              </p>
              <div className="hero-actions">
                <a href="#catalog" className="btn-primary">
                  Выбрать экипировку <Arrow />
                </a>
                <a href="#atelier" className="text-link">
                  Сделать своим <Arrow />
                </a>
              </div>
              <div className="hero-footnote">
                <span>
                  <b>Подбор по модели</b>Размер и посадка
                </span>
                <span>
                  <b>Персонализация</b>Нашивка и вышивка
                </span>
              </div>
            </div>
            <div className="hero-product">
              <div className="hero-sun" aria-hidden="true" />
              <span className="hero-kanji" aria-hidden="true">
                柔<br />道
              </span>
              <KimonoPhoto />
              <button
                className="hero-detail"
                onClick={() => openProduct(getProduct("adidas-champion-ii")!)}
                aria-label="Рассмотреть детали Adidas Champion II"
              >
                <Photo
                  src="/images/kimono/adidas-ii-detail.webp"
                  alt="Фактура ткани Adidas Champion II"
                />
                <span>
                  Внимание
                  <br />к деталям <Arrow />
                </span>
              </button>
              <span className="hero-caption">
                ADIDAS CHAMPION II
                <br />
                <small>Дисциплина начинается с выбора.</small>
              </span>
              <button
                className="hero-product-link"
                onClick={() => openProduct(getProduct("adidas-champion-ii")!)}
                aria-label="Открыть Adidas Champion II"
              >
                <Arrow />
              </button>
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
          aria-label="Категории товаров"
        >
          {categories.map((c, i) => (
            <button
              key={c.id}
              onClick={() => chooseCategory(c.id)}
              className={"category-tile category-" + c.id}
            >
              <span className="category-number">0{i + 1}</span>
              <div>
                <h2>{c.name}</h2>
                <p>{c.caption}</p>
              </div>
              <Arrow />
            </button>
          ))}
        </section>

        <section id="catalog" className="container-frame catalog-section">
          <div className="section-heading">
            <div>
              <p className="label">КАТАЛОГ / ALGA SPORT SHOP</p>
              <h2>Для работы на татами.</h2>
            </div>
            <p>
              Сравните модели и выберите параметры.
              <br />
              Цену и наличие подтвердим лично.
            </p>
          </div>
          <div className="catalog-toolbar">
            <div
              className="category-tabs"
              role="group"
              aria-label="Фильтр категории"
            >
              {[{ id: "all", name: "Все товары" }, ...categories].map((c) => (
                <button
                  key={c.id}
                  aria-pressed={category === c.id}
                  className={category === c.id ? "active" : ""}
                  onClick={() => setCategory(c.id as Category | "all")}
                >
                  {c.name}
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
                placeholder="Найти товар"
                aria-label="Найти товар"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          {(category === "all" || category === "kimono") && (
            <div className="comparison-entry">
              <p><strong>ZONE / MITSUBOSHI</strong> Не знаете, какую модель выбрать?</p>
              <button className="btn-secondary" onClick={() => setView({ type: "compare" })}>Сравнить модели <Arrow /></button>
            </div>
          )}
          <p className="catalog-note">
            Цены по запросу · Размеры, варианты и наличие подтверждаем в
            переписке
          </p>
          <div className="catalog-grid">{filtered.map(renderCard)}</div>
          {!filtered.length && (
            <div className="no-results">
              <h3>Ничего не нашлось</h3>
              <p>Попробуйте другое название или категорию.</p>
              <button
                className="btn-secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                Показать все товары
              </button>
            </div>
          )}
        </section>

        <aside
          className="size-help container-frame"
          aria-label="Помощь с размером"
        >
          <div className="size-help-inner">
            <span className="size-symbol" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="m5 11 16-6 7 17-16 6Z" stroke="currentColor" />
                <path d="m10 9 2 5m3-7 2 5m3-7 2 5" stroke="currentColor" />
              </svg>
            </span>
            <div>
              <h2>Не уверены в размере?</h2>
              <p>
                Укажите рост и вес в поле размера выбранной модели. Поможем
                подобрать размер и посадку именно этого кимоно.
              </p>
            </div>
            <a className="text-link" href="#catalog">
              Выбрать модель <Arrow />
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
            <p className="label">ПЕРСОНАЛИЗАЦИЯ / ALGA ATELIER</p>
            <h2>
              Ваша фамилия.
              <br />
              <em>На вашем кимоно.</em>
            </h2>
            <p>
              Именная нашивка на спине или компактная вышивка на куртке и
              штанах. Это два разных способа персонализации: у каждого свои
              настройки и предварительный макет.
            </p>
            <div className="atelier-options">
              <span>
                <b>01 / IJF backpatch</b>Фамилия и код страны
              </span>
              <span>
                <b>02 / Вышивка</b>Текст, цвет и место
              </span>
            </div>
            <p className="small-copy muted">
              Финальный макет и требования к соревнованиям согласуем перед
              изготовлением.
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                const item = newItem("adidas-champion-ii");
                item.customization.enabled = true;
                openProduct(getProduct(item.productId)!, item);
              }}
            >
              Создать свою нашивку <Arrow />
            </button>
          </div>
        </section>

        <section className="container-frame featured-section">
          <div className="section-heading">
            <div>
              <p className="label">ЗНАКОМСТВО С КОЛЛЕКЦИЕЙ</p>
              <h2>Начните с этих моделей.</h2>
            </div>
            <a href="#catalog" className="text-link">
              Весь каталог <Arrow />
            </a>
          </div>
          <div className="catalog-grid featured-grid">
            {products.filter((p) => p.featured).map(renderCard)}
          </div>
        </section>

        <section id="about" className="about-section container-frame">
          <div>
            <p className="label">О МАГАЗИНЕ</p>
            <h2>
              ALGA значит
              <br />
              <span>вперед.</span>
            </h2>
            <p className="about-caption">
              Кимоно выбирают не только по размеру на этикетке.
            </p>
          </div>
          <div>
            <p className="about-intro">
              От выбора модели до согласования нашивки.
            </p>
            <p className="muted">
              Расскажите, для чего подбираете кимоно: для тренировок или
              соревнований. Укажите рост, вес и пожелания к посадке. Обсудим
              конкретную модель, а для персонализации отдельно проверим текст и
              размещение.
            </p>
            <div className="order-steps">
              <div>
                <b>01</b>
                <p>
                  Выберите модель
                  <small>Сравните фото и добавьте нужные параметры</small>
                </p>
              </div>
              <div>
                <b>02</b>
                <p>
                  Уточните детали
                  <small>Размер, посадка, наличие и окончательная цена</small>
                </p>
              </div>
              <div>
                <b>03</b>
                <p>
                  Согласуйте заказ
                  <small>Макет, оплата и доставка до подтверждения</small>
                </p>
              </div>
            </div>
          </div>
        </section>

        <OwnersSection />

        <section className="container-frame faq-section">
          <p className="label">ПЕРЕД ЗАКАЗОМ</p>
          <h2>Все просто.</h2>
          {[
            [
              "Как оформить заказ?",
              "Добавьте товары в корзину или нажмите «Оформить» в карточке. Мы подготовим сообщение с выбранными параметрами. " +
                (whatsappUrl("")
                  ? "Проверьте текст и отправьте его в WhatsApp магазина. Окончательные детали подтвердим в переписке."
                  : "Номер WhatsApp подключим перед запуском. Пока можно скопировать текст и написать в Instagram Direct."),
            ],
            [
              "Как узнать цену и наличие?",
              "Цены, размеры и наличие уточняются лично. Укажите желаемый размер или рост и вес: поможем с подбором конкретной модели. " + DELIVERY_TEXT + " " + PAYMENT_TEXT,
            ],
            [
              "Чем backpatch отличается от вышивки?",
              "IJF backpatch — именная нашивка на спине: фамилия спортсмена и код страны, без декоративных настроек. Вышивка — компактный текст непосредственно на ткани в нижней части куртки или верхней части штанины, с выбором цвета, шрифта и ориентации. Финальный макет и требования к соревнованиям согласуем перед изготовлением.",
            ],
            [
              "Нужна ли регистрация?",
              "Нет. Корзина сохраняется в браузере на этом устройстве. Заказ оформляется в переписке с магазином.",
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
              <p className="label">НА СВЯЗИ</p>
              <h2>
                Начнем
                <br />с разговора.
              </h2>
              <p>Поможем собрать ваш комплект.</p>
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
      <nav className="mobile-dock" aria-label="Быстрая навигация">
        <a href="#catalog">Каталог</a>
        <a href="#atelier">Нашивка</a>
        <button onClick={() => setView({ type: "cart" })}>
          <BagIcon /> Корзина <b>{count}</b>
        </button>
        <button onClick={() => setView({ type: "order", items: [] })}>
          Связаться <Arrow />
        </button>
      </nav>
      {storageError && (
        <div className="storage-notice" role="status">
          Браузер не разрешил сохранение корзины. Она доступна до закрытия
          страницы.
        </div>
      )}
      {notice && (
        <div className="shop-toast" role="status">
          {notice}
          <button onClick={() => setView({ type: "cart" })}>
            В корзину <Arrow />
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
