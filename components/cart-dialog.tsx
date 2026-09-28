"use client";
import {
  getProduct,
  productHasSize,
  productImages,
  productVariantSelections,
} from "@/lib/catalog";
import {
  buildOrderMessage,
  cartTotal,
  itemTotal,
  priceText,
  whatsappUrl,
  type CartItem,
} from "@/lib/orders";
import { CUSTOMIZATION_PRICES, INSTAGRAM_URL } from "@/lib/shop-config";
import { useState } from "react";
import { embroideryColorText, orientationText, placementText } from "@/lib/customization";
import { Arrow, Dialog, Photo, Quantity } from "./shop-ui";
import { useI18n } from "@/lib/i18n/context";
import {
  localizedProduct,
  localizedVariant,
  localizedVariantLabel,
} from "@/lib/i18n/catalog";

export function CartDialog({
  items,
  onClose,
  onQuantity,
  onRemove,
  onEdit,
  onOrder,
}: {
  items: CartItem[];
  onClose: () => void;
  onQuantity: (key: string, q: number) => void;
  onRemove: (key: string) => void;
  onEdit: (item: CartItem) => void;
  onOrder: () => void;
}) {
  const { locale, t } = useI18n();
  return (
    <Dialog title={t("cart.title")} onClose={onClose}>
      <div className="cart-body">
        {!items.length ? (
          <div className="empty-cart">
            <span className="label">{t("cart.emptyEyebrow")}</span>
            <h3>{t("cart.emptyTitle")}</h3>
            <p className="muted">
              {t("cart.emptyCopy")}
            </p>
            <button className="btn-primary" onClick={onClose}>
              {t("cart.toCatalog")} <Arrow />
            </button>
          </div>
        ) : (
          items.map((item) => {
            const rawProduct = getProduct(item.productId)!;
            const p = localizedProduct(rawProduct, locale);
            const variantSelections = productVariantSelections(
              rawProduct,
              item.variant,
            );
            return (
              <article className="cart-line" key={item.key}>
                <div className="cart-photo">
                  <Photo
                    src={productImages(rawProduct, item.variant)[0]}
                    alt={p.name + ", " + variantSelections
                      .map(({ value }) => localizedVariant(value, locale))
                      .join(", ")}
                  />
                </div>
                <div className="cart-line-detail">
                  <h3>{p.name}</h3>
                  <p className="muted">
                    {productHasSize(rawProduct) && (
                      <>
                        {t("cart.size", {
                          value: item.size || t(rawProduct.sizeField === "belt"
                            ? "cart.sizeOrder"
                            : "cart.sizeHelp"),
                        })}
                        <br />
                      </>
                    )}
                    {variantSelections.map(({ label, value }, index) => (
                      <span key={(label || "variant") + value}>
                        {label
                          ? `${localizedVariantLabel(label, locale)}: ${localizedVariant(value, locale)}`
                          : rawProduct.variantSwatches
                            ? `${t("product.kimonoColor")}: ${localizedVariant(value, locale)}`
                            : localizedVariant(value, locale)}
                        {index < variantSelections.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                  {item.customization.enabled && (
                    <p className="personalization-summary">
                      {item.customization.type === "backpatch" ? (
                        <>
                          IJF backpatch: {item.customization.surname} /{" "}
                          {item.customization.country}
                          <br />
                          {t("cart.backFixed")}
                        </>
                      ) : (
                        <>
                          {t("cart.embroidery", { text: item.customization.text })}
                          <br />
                          {item.customization.legacyNote
                            ? t("orderMessage.needsAgreement")
                            : placementText(item.customization, locale)}{" "}
                          · {embroideryColorText(item.customization.color, locale)} ·{" "}
                          {item.customization.font}
                          <br />
                          {orientationText(item.customization.orientation, locale)}
                        </>
                      )}
                      <br />
                      {t("custom.extra")}: {priceText(
                        CUSTOMIZATION_PRICES[item.customization.type],
                        locale,
                      )}
                    </p>
                  )}
                  <strong>{priceText(itemTotal(item), locale)}</strong>
                  <div className="cart-line-tools">
                    <Quantity
                      value={item.quantity}
                      onChange={(q) => onQuantity(item.key, q)}
                    />
                    <button type="button" onClick={() => onEdit(item)}>
                      {t("cart.edit")}
                    </button>
                    <button
                      type="button"
                      aria-label={t("cart.removeAria", { name: p.name })}
                      onClick={() => onRemove(item.key)}
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
      {!!items.length && (
        <div className="cart-footer">
          <div>
            <span>{t("product.total")}</span>
            <strong>{priceText(cartTotal(items), locale)}</strong>
          </div>
          <p className="muted small-copy">
            {t("cart.confirmation")}
          </p>
          <button className="btn-primary" onClick={onOrder}>
            {t("cart.checkout")} <Arrow />
          </button>
        </div>
      )}
    </Dialog>
  );
}
export function OrderDialog({
  items,
  onClose,
}: {
  items: CartItem[];
  onClose: () => void;
}) {
  const { locale, t } = useI18n();
  const message = items.length
    ? buildOrderMessage(items, locale)
    : t("order.emptyMessage");
  const url = whatsappUrl(message);
  const [copyStatus, setCopyStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus(t("order.copied"));
    } catch {
      setCopyStatus(t("order.copyManual"));
    }
  }
  return (
    <Dialog title={t("order.title")} onClose={onClose}>
      <div className="order-body">
        <p className="muted">
          {url
            ? t("order.ready")
            : t("order.offline")}
        </p>
        <label className="input-label">
          {t("order.text")}
          <textarea aria-label={t("order.text")} readOnly value={message} />
        </label>
        <p className="small-copy muted">
          {t("order.pending")}
        </p>
        <div className="order-buttons">
          {url ? (
            <a
              className="btn-primary"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("order.openWhatsapp")} <Arrow />
            </a>
          ) : (
            <button className="btn-primary" disabled>
              {t("order.whatsappOffline")}
            </button>
          )}
          <button className="btn-secondary" onClick={copy}>
            {t("order.copy")}
          </button>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            {t("order.instagram")} <Arrow />
          </a>
        </div>
        <p role="status" className="small-copy">
          {copyStatus}
        </p>
      </div>
    </Dialog>
  );
}
