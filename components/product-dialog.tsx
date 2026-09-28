"use client";
import { useState, type FormEvent } from "react";
import {
  productHasSize,
  productImages,
  productPrice,
  productVariantGroups,
  productVariantSelections,
  productVariantWithOption,
  type Product,
} from "@/lib/catalog";
import {
  defaultCustomization,
  itemTotal,
  newItem,
  priceText,
  type CartItem,
} from "@/lib/orders";
import {
  defaultEmbroidery,
  embroideryColorText,
  embroideryColors,
  type Backpatch,
  type Embroidery,
  type Customization,
} from "@/lib/customization";
import { useI18n } from "@/lib/i18n/context";
import {
  localizedCategory,
  localizedProduct,
  localizedVariant,
  localizedVariantLabel,
} from "@/lib/i18n/catalog";
import { CUSTOMIZATION_PRICES } from "@/lib/shop-config";
import { toJapaneseEmbroidery } from "@/lib/japanese";
import { Arrow, Dialog, Photo, Quantity } from "./shop-ui";
import { PatchPreview } from "./patch-preview";
import { FitLineInformation, FitLineOverview } from "./fitline-information";
import { ProductFacts } from "./product-facts";

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
  const { locale, t } = useI18n();
  const copy = localizedProduct(product, locale);
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
  const images = productImages(product, item.variant);
  const variantGroups = productVariantGroups(product);
  const currentVariantSelections = Object.fromEntries(
    productVariantSelections(product, item.variant)
      .filter(({ label }) => label)
      .map(({ label, value }) => [label!, value]),
  );
  const variantFieldLabel =
    localizedVariantLabel(product.variantLabel, locale) ||
    (product.category === "vitamins"
      ? t("product.flavorVariant")
      : product.variantSwatches && product.category === "kimono"
        ? t("product.kimonoColor")
        : t("product.colorVariant"));
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
      setError(t("custom.errorBackpatch"));
      return;
    }
    if (c.enabled && c.type === "embroidery" && !c.text.trim()) {
      setError(t("custom.errorEmbroidery"));
      return;
    }
    const customization = !c.enabled
      ? defaultCustomization()
      : c.type === "backpatch"
        ? { ...c, surname: c.surname.trim() }
        : {
            ...c,
            sourceText: (c.sourceText || c.text).trim(),
            text: toJapaneseEmbroidery(c.sourceText || c.text),
          };
    const clean = { ...item, size: item.size.trim(), customization };
    const button = (e.nativeEvent as SubmitEvent).submitter;
    if (button?.getAttribute("value") === "order") onOrder(clean);
    else onAdd(clean);
  }
  return (
    <Dialog title={copy.name} onClose={onClose} wide>
      <form onSubmit={submit} className="product-form">
        <div className="product-detail-body">
          <div className="detail-gallery">
            <button
              className={"gallery-main " + (zoom ? "zoomed" : "")}
              type="button"
              onClick={() => setZoom((v) => !v)}
              aria-label={zoom ? t("product.zoomOut") : t("product.zoomIn")}
              disabled={!images.length}
            >
              <Photo
                src={images[photo]}
                alt={t("product.photoAlt", { name: copy.name, number: photo + 1 })}
                eager
              />
              {!!images.length && (
                <span className="zoom-label">{zoom ? "−" : "+"} {t("common.details")}</span>
              )}
            </button>
            {images.length > 1 && (
              <div className="thumbnails">
                {images.map((src, i) => (
                  <button
                    key={src}
                    className={i === photo ? "selected" : ""}
                    type="button"
                    aria-label={t("product.photo", { number: i + 1 })}
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
              {images.length
                ? t("product.realPhoto")
                : t("product.missingPhoto")}
            </p>}
            {c.enabled && (
              <div className="desktop-preview">
                <PatchPreview value={c} />
              </div>
            )}
          </div>
          <div className="detail-fields">
            <p className="label">
              {product.brand} / {localizedCategory(product.category, locale).name}
            </p>
            {product.category === "vitamins" ? <FitLineOverview productId={product.id} /> : <p className="detail-description">{copy.description}</p>}
            <ProductFacts specs={copy.specs} />
            <p className="detail-price">
              {priceText(productPrice(product, item.variant), locale)}
            </p>
            <p className="muted small-copy">
            {copy.availability || t("product.orderAvailability")}
            </p>
            <div className="option-grid">
              {productHasSize(product) && (
                <label className="input-label">
                  {t("product.size")}
                  <input
                    className="field"
                    value={item.size}
                    maxLength={40}
                    placeholder={t(product.sizeField === "belt"
                      ? "product.beltSizePlaceholder"
                      : "product.sizePlaceholder")}
                    onChange={(e) => setItem({ ...item, size: e.target.value })}
                  />
                  <small>
                    {t(product.sizeField === "belt"
                      ? "product.beltSizeHelp"
                      : "product.sizeHelp")}
                  </small>
                </label>
              )}
              {variantGroups.length ? (
                variantGroups.map(({ label, values }) => {
                  const localizedLabel = localizedVariantLabel(label, locale) || label;
                  const swatches = product.variantOptionSwatches?.[label];
                  return (
                    <fieldset className="input-label variant-fieldset" key={label}>
                      <legend>{localizedLabel}</legend>
                      <div className="variant-picker">
                        {values.map((value) => (
                          <button
                            type="button"
                            key={value}
                            className={currentVariantSelections[label] === value ? "active" : ""}
                            aria-label={`${localizedLabel}: ${localizedVariant(value, locale)}`}
                            aria-pressed={currentVariantSelections[label] === value}
                            onClick={() => {
                              setItem({
                                ...item,
                                variant: productVariantWithOption(
                                  product,
                                  item.variant,
                                  label,
                                  value,
                                ),
                              });
                              setPhoto(0);
                              setZoom(false);
                            }}
                          >
                            {swatches?.[value] && (
                              <span
                                className="color-swatch"
                                style={{ background: swatches[value] }}
                                aria-hidden="true"
                              />
                            )}
                            {localizedVariant(value, locale)}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  );
                })
              ) : product.variantSwatches ? (
                <fieldset className="input-label variant-fieldset">
                  <legend>{variantFieldLabel}</legend>
                  <div className="variant-picker">
                    {product.variants.map((name) => (
                      <button
                        type="button"
                        key={name}
                        className={item.variant === name ? "active" : ""}
                        aria-label={`${variantFieldLabel}: ${localizedVariant(name, locale)}`}
                        aria-pressed={item.variant === name}
                        onClick={() => {
                          setItem({ ...item, variant: name });
                          setPhoto(0);
                          setZoom(false);
                        }}
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
                </fieldset>
              ) : (
                <label className="input-label">
                  {variantFieldLabel}
                  <select
                    aria-label={
                      variantFieldLabel
                    }
                    className="field"
                    value={item.variant}
                    onChange={(e) => {
                      setItem({ ...item, variant: e.target.value });
                      setPhoto(0);
                      setZoom(false);
                    }}
                  >
                    {product.variants.map((v) => (
                      <option key={v} value={v}>{localizedVariant(v, locale)}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            <div className="quantity-row">
              <span className="input-label">{t("common.quantity")}</span>
              <Quantity
                value={item.quantity}
                onChange={(quantity) => setItem({ ...item, quantity })}
              />
            </div>
            {product.category === "kimono" && (
              <section className="custom-fields">
                <label className="custom-toggle">
                  <span>
                    <strong>{t("custom.title")}</strong>
                    <small>{t("custom.subtitle")}</small>
                  </span>
                  <input
                    type="checkbox"
                    checked={c.enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    aria-label={t("custom.enable")}
                  />
                  <span className="switch" aria-hidden="true" />
                </label>
                {c.enabled && (
                  <>
                    <div
                      className="segmented"
                      role="group"
                      aria-label={t("custom.type")}
                    >
                      {(
                        [
                          ["backpatch", "IJF backpatch"],
                          ["embroidery", t("custom.embroidery")],
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
                          {t("custom.modeBackpatch")}
                        </p>
                        <label className="input-label">
                          {t("custom.surname")}
                          <input
                            aria-label={t("custom.surname")}
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
                          {t("custom.country")}
                          <input
                            aria-label={t("custom.country")}
                            className="field"
                            required
                            value={backpatch.country}
                            pattern="[A-Z]{3}"
                            maxLength={3}
                            title={t("custom.countryHint")}
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
                          {t("custom.placementFixed")} <strong>{t("custom.back")}</strong>
                          <span>{t("custom.fixed")}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="embroidery-fields">
                        <p className="mode-description">
                          {t("custom.modeEmbroidery")}
                        </p>
                        <label className="input-label">
                          {t("custom.sourceText")}
                          <input
                            aria-label={t("custom.sourceText")}
                            className="field"
                            required
                            placeholder={t("custom.sourceTextPlaceholder")}
                            value={embroidery.sourceText ?? embroidery.text}
                            maxLength={40}
                            onChange={(e) => {
                              const sourceText = e.target.value;
                              updateEmbroidery({
                                sourceText,
                                text: toJapaneseEmbroidery(sourceText),
                              });
                            }}
                          />
                        </label>
                        <label className="input-label">
                          {t("custom.japaneseText")}
                          <input
                            aria-label={t("custom.japaneseText")}
                            className="field"
                            lang="ja"
                            readOnly
                            value={embroidery.text}
                          />
                          <small>{t("custom.japaneseHint")}</small>
                        </label>
                        <div className="option-grid">
                          <label className="input-label">
                            {t("custom.placement")}
                            <select
                              aria-label={t("custom.placement")}
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
                              <option value="Куртка">{t("custom.jacket")}</option>
                              <option value="Штаны">{t("custom.pants")}</option>
                              <option value="Пояс">{t("custom.belt")}</option>
                            </select>
                            <small>
                              {embroidery.placement === "Куртка"
                                ? t("custom.jacketHint")
                                : embroidery.placement === "Штаны"
                                  ? t("custom.pantsHint")
                                  : t("custom.beltHint")}
                            </small>
                          </label>
                          <label className="input-label">
                            {t("custom.threadColor")}
                            <select
                              aria-label={t("custom.threadColor")}
                              className="field"
                              value={embroidery.color}
                              onChange={(e) =>
                                updateEmbroidery({
                                  color: e.target.value as Embroidery["color"],
                                })
                              }
                            >
                              {Object.keys(embroideryColors).map((v) => (
                                <option key={v} value={v}>{embroideryColorText(v as Embroidery["color"], locale)}</option>
                              ))}
                            </select>
                          </label>
                          <label className="input-label">
                            {t("custom.font")}
                            <select
                              aria-label={t("custom.font")}
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
                        </div>
                        {embroidery.legacyNote && (
                          <p className="mode-description">
                            {locale === "ru" ? embroidery.legacyNote : t("orderMessage.needsAgreement")}
                          </p>
                        )}
                        <p className="small-copy muted">
                          {t("custom.zoneNote")}
                        </p>
                      </div>
                    )}
                    <div className="mobile-preview">
                      <PatchPreview value={c} />
                    </div>
                    <p className="custom-price">
                      {t("custom.extra")}{" "}
                      <strong>{priceText(CUSTOMIZATION_PRICES[c.type], locale)}</strong>
                    </p>
                    <p className="small-copy muted">
                      {t("custom.finalNote")}
                    </p>
                  </>
                )}
              </section>
            )}
            <FitLineInformation productId={product.id} />
            {product.category !== "vitamins" && <details className="product-info">
              <summary>{t("product.about")}</summary>
              <p>{copy.detail}</p>
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
            <span>{t("product.total")}</span>
            <strong>
              {priceText(itemTotal({ ...item, customization: c }), locale)}
            </strong>
          </div>
          <button type="submit" value="add" className="btn-secondary">
            {initial?.key ? t("product.save") : t("product.add")}
          </button>
          <button type="submit" value="order" className="btn-primary">
            {t("product.order")} <Arrow />
          </button>
        </div>
      </form>
    </Dialog>
  );
}
