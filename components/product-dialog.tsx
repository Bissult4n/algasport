"use client";
import { useState, type FormEvent } from "react";
import { categoryName, type Product } from "@/lib/catalog";
import {
  defaultCustomization,
  itemTotal,
  newItem,
  priceText,
  type CartItem,
} from "@/lib/orders";
import {
  defaultEmbroidery,
  embroideryColors,
  type Backpatch,
  type Embroidery,
  type Customization,
} from "@/lib/customization";
import { CUSTOMIZATION_PRICES } from "@/lib/shop-config";
import { Arrow, Dialog, Photo, Quantity } from "./shop-ui";
import { PatchPreview } from "./patch-preview";
import { FitLineInformation, FitLineOverview } from "./fitline-information";

export function ProductDialog({
  product,
  initial,
  onClose,
  onAdd,
  onOrder,
}: {
  product: Product;
  initial?: CartItem;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
  onOrder: (item: CartItem) => void;
}) {
  const [item, setItem] = useState<CartItem>(() =>
    initial
      ? { ...initial, customization: { ...initial.customization } }
      : newItem(product.id),
  );
  const [photo, setPhoto] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [error, setError] = useState("");
  const [enabled, setEnabled] = useState(item.customization.enabled);
  const [mode, setMode] = useState(item.customization.type);
  const [backpatch, setBackpatch] = useState<Backpatch>(
    item.customization.type === "backpatch"
      ? item.customization
      : defaultCustomization(),
  );
  const [embroidery, setEmbroidery] = useState<Embroidery>(
    item.customization.type === "embroidery"
      ? item.customization
      : defaultEmbroidery(),
  );
  const c: Customization =
    mode === "backpatch"
      ? { ...backpatch, enabled }
      : { ...embroidery, enabled };
  function updateBackpatch(patch: Partial<Backpatch>) {
    setBackpatch((v) => ({ ...v, ...patch }));
    setError("");
  }
  function updateEmbroidery(patch: Partial<Embroidery>) {
    setEmbroidery((v) => ({ ...v, ...patch }));
    setError("");
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      c.enabled &&
      c.type === "backpatch" &&
      (!c.surname.trim() || !/^[A-Z]{3}$/.test(c.country))
    ) {
      setError("Укажите фамилию и трехбуквенный код страны.");
      return;
    }
    if (c.enabled && c.type === "embroidery" && !c.text.trim()) {
      setError("Введите текст для вышивки.");
      return;
    }
    const customization = !c.enabled
      ? defaultCustomization()
      : c.type === "backpatch"
        ? { ...c, surname: c.surname.trim() }
        : { ...c, text: c.text.trim() };
    const clean = { ...item, size: item.size.trim(), customization };
    const button = (e.nativeEvent as SubmitEvent).submitter;
    if (button?.getAttribute("value") === "order") onOrder(clean);
    else onAdd(clean);
  }
  return (
    <Dialog title={product.name} onClose={onClose} wide>
      <form onSubmit={submit} className="product-form">
        <div className="product-detail-body">
          <div className="detail-gallery">
            <button
              className={"gallery-main " + (zoom ? "zoomed" : "")}
              type="button"
              onClick={() => setZoom((v) => !v)}
              aria-label={zoom ? "Уменьшить фото" : "Увеличить фото"}
              disabled={!product.images.length}
            >
              <Photo
                src={product.images[photo]}
                alt={product.name + ", фото " + (photo + 1)}
                eager
              />
              {!!product.images.length && (
                <span className="zoom-label">{zoom ? "−" : "+"} Детали</span>
              )}
            </button>
            {product.images.length > 1 && (
              <div className="thumbnails">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    className={i === photo ? "selected" : ""}
                    type="button"
                    aria-label={"Фото " + (i + 1)}
                    aria-pressed={i === photo}
                    onClick={() => {
                      setPhoto(i);
                      setZoom(false);
                    }}
                  >
                    <Photo src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
            {product.category !== "vitamins" && <p className="muted photo-note">
              {product.images.length
                ? "Реальные фото модели. Цвет и комплектацию подтвердим в переписке."
                : "Точная модель и фотография ожидают подтверждения магазина."}
            </p>}
            {c.enabled && (
              <div className="desktop-preview">
                <PatchPreview value={c} />
              </div>
            )}
          </div>
          <div className="detail-fields">
            <p className="label">
              {product.brand} / {categoryName(product.category)}
            </p>
            {product.category === "vitamins" ? <FitLineOverview productId={product.id} /> : <p className="detail-description">{product.description}</p>}
            <p className="detail-price">{priceText(product.price)}</p>
            <p className="muted small-copy">
            {product.availability || "Наличие и окончательную стоимость уточним при заказе."}
            </p>
            <div className="option-grid">
              {product.category === "kimono" && (
                <label className="input-label">
                  Желаемый размер
                  <input
                    className="field"
                    value={item.size}
                    maxLength={40}
                    placeholder="Например, 175 см или 3.5"
                    onChange={(e) => setItem({ ...item, size: e.target.value })}
                  />
                  <small>
                    Не знаете размер? Укажите рост и вес, поможем с посадкой
                    этой модели.
                  </small>
                </label>
              )}
              <label className="input-label">
                {product.category === "vitamins"
                  ? "Вкус / вариант"
                  : "Цвет / вариант"}
                <select
                  aria-label={
                    product.category === "vitamins"
                      ? "Вкус / вариант"
                      : "Цвет / вариант"
                  }
                  className="field"
                  value={item.variant}
                  onChange={(e) =>
                    setItem({ ...item, variant: e.target.value })
                  }
                >
                  {product.variants.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="quantity-row">
              <span className="input-label">Количество</span>
              <Quantity
                value={item.quantity}
                onChange={(quantity) => setItem({ ...item, quantity })}
              />
            </div>
            {product.category === "kimono" && (
              <section className="custom-fields">
                <label className="custom-toggle">
                  <span>
                    <strong>Персонализация</strong>
                    <small>Нашивка или именная вышивка</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={c.enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    aria-label="Включить кастомизацию"
                  />
                  <span className="switch" aria-hidden="true" />
                </label>
                {c.enabled && (
                  <>
                    <div
                      className="segmented"
                      role="group"
                      aria-label="Тип персонализации"
                    >
                      {(
                        [
                          ["backpatch", "IJF backpatch"],
                          ["embroidery", "Вышивка"],
                        ] as const
                      ).map(([type, label]) => (
                        <button
                          type="button"
                          key={type}
                          className={mode === type ? "active" : ""}
                          aria-pressed={mode === type}
                          onClick={() => {
                            setMode(type);
                            setError("");
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    {c.type === "backpatch" ? (
                      <div className="backpatch-fields">
                        <p className="mode-description">
                          Именная нашивка с фамилией и кодом страны. Используйте
                          написание, нужное для соревнований.
                        </p>
                        <label className="input-label">
                          Фамилия спортсмена
                          <input
                            aria-label="Фамилия спортсмена"
                            className="field"
                            placeholder="A. SERIKOV"
                            required
                            value={backpatch.surname}
                            maxLength={24}
                            autoCapitalize="characters"
                            onChange={(e) =>
                              updateBackpatch({
                                surname: e.target.value.toUpperCase(),
                              })
                            }
                          />
                        </label>
                        <label className="input-label country-field">
                          Код страны
                          <input
                            aria-label="Код страны"
                            className="field"
                            required
                            value={backpatch.country}
                            pattern="[A-Z]{3}"
                            maxLength={3}
                            title="Три латинские буквы, например KAZ"
                            onChange={(e) =>
                              updateBackpatch({
                                country: e.target.value
                                  .toUpperCase()
                                  .replace(/[^A-Z]/g, ""),
                              })
                            }
                          />
                        </label>
                        <p className="fixed-placement">
                          <span className="fixed-marker" aria-hidden="true" />
                          Расположение: <strong>Спина</strong>
                          <span>фиксировано</span>
                        </p>
                      </div>
                    ) : (
                      <div className="embroidery-fields">
                        <p className="mode-description">
                          Компактная надпись на ткани, без подложки и рамки.
                          Кириллица, латиница и японские символы.
                        </p>
                        <label className="input-label">
                          Текст вышивки
                          <input
                            aria-label="Текст вышивки"
                            className="field"
                            required
                            placeholder="Например, 柔道"
                            value={embroidery.text}
                            maxLength={40}
                            onChange={(e) =>
                              updateEmbroidery({ text: e.target.value })
                            }
                          />
                        </label>
                        <div className="option-grid">
                          <label className="input-label">
                            Место нанесения
                            <select
                              aria-label="Место нанесения"
                              className="field"
                              value={embroidery.placement}
                              onChange={(e) =>
                                updateEmbroidery({
                                  placement: e.target
                                    .value as Embroidery["placement"],
                                  legacyNote: undefined,
                                })
                              }
                            >
                              <option>Куртка</option>
                              <option>Штаны</option>
                              <option>Пояс</option>
                            </select>
                            <small>
                              {embroidery.placement === "Куртка"
                                ? "Нижняя часть куртки"
                                : embroidery.placement === "Штаны"
                                  ? "Верхняя часть штанины"
                                  : "Возле одного из концов пояса"}
                            </small>
                          </label>
                          <label className="input-label">
                            Цвет нити
                            <select
                              aria-label="Цвет нити"
                              className="field"
                              value={embroidery.color}
                              onChange={(e) =>
                                updateEmbroidery({
                                  color: e.target.value as Embroidery["color"],
                                })
                              }
                            >
                              {Object.keys(embroideryColors).map((v) => (
                                <option key={v}>{v}</option>
                              ))}
                            </select>
                          </label>
                          <label className="input-label">
                            Шрифт
                            <select
                              aria-label="Шрифт"
                              className="field"
                              value={embroidery.font}
                              onChange={(e) =>
                                updateEmbroidery({
                                  font: e.target.value as Embroidery["font"],
                                })
                              }
                            >
                              {["Modern", "Serif", "Brush"].map((v) => (
                                <option key={v}>{v}</option>
                              ))}
                            </select>
                          </label>
                          <label className="input-label">
                            Ориентация
                            <select
                              aria-label="Ориентация"
                              className="field"
                              value={embroidery.orientation}
                              onChange={(e) =>
                                updateEmbroidery({
                                  orientation: e.target
                                    .value as Embroidery["orientation"],
                                })
                              }
                            >
                              <option value="vertical">Вертикально</option>
                              <option value="horizontal">Горизонтально</option>
                            </select>
                          </label>
                        </div>
                        {embroidery.legacyNote && (
                          <p className="mode-description">
                            {embroidery.legacyNote}
                          </p>
                        )}
                        <p className="small-copy muted">
                          Зоны примерные, надпись будет компактной. Точное место
                          и размер согласуем по выбранной модели.
                        </p>
                      </div>
                    )}
                    <div className="mobile-preview">
                      <PatchPreview value={c} />
                    </div>
                    <p className="custom-price">
                      Доплата за кастомизацию{" "}
                      <strong>{priceText(CUSTOMIZATION_PRICES[c.type])}</strong>
                    </p>
                    <p className="small-copy muted">
                      Финальный макет и требования к соревнованиям согласуем
                      перед изготовлением.
                    </p>
                  </>
                )}
              </section>
            )}
            <FitLineInformation productId={product.id} />
            {product.category !== "vitamins" && <details className="product-info">
              <summary>О товаре и заказе</summary>
              <p>{product.detail}</p>
            </details>}
            {error && (
              <p role="alert" className="error-copy">
                {error}
              </p>
            )}
          </div>
        </div>
        <div className="dialog-actions">
          <div className="action-total">
            <span>Итого</span>
            <strong>
              {priceText(itemTotal({ ...item, customization: c }))}
            </strong>
          </div>
          <button type="submit" value="add" className="btn-secondary">
            {initial?.key ? "Сохранить изменения" : "Добавить в корзину"}
          </button>
          <button type="submit" value="order" className="btn-primary">
            Оформить <Arrow />
          </button>
        </div>
      </form>
    </Dialog>
  );
}
