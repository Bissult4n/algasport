import {
  getProduct,
  normalizeProductVariant,
  productHasSize,
  productPrice,
  productVariantSelections,
  type Price,
} from "./catalog";
import {
  CUSTOMIZATION_PRICES,
  WHATSAPP_NUMBER,
} from "./shop-config";
import {
  defaultCustomization,
  embroideryColorText,
  orientationText,
  parseCustomization,
  placementText,
  type Customization,
} from "./customization";
import { translate, type Locale } from "./i18n";
import {
  localizedCategory,
  localizedProduct,
  localizedVariant,
  localizedVariantLabel,
} from "./i18n/catalog";
export { defaultCustomization } from "./customization";
export type { Customization } from "./customization";
export type CartItem = {
  key: string;
  productId: string;
  size: string;
  variant: string;
  quantity: number;
  customization: Customization;
};
export const CART_KEY = "alga:cart:v2";
export function newItem(productId: string, variant?: string): CartItem {
  const product = getProduct(productId)!;
  return {
    key: "",
    productId,
    size: "",
    variant: normalizeProductVariant(productId, variant) || product.variants[0],
    quantity: 1,
    customization: defaultCustomization(),
  };
}
const numberText = (value: number, locale: Locale) =>
  new Intl.NumberFormat(
    locale === "kk" ? "kk-KZ" : locale === "en" ? "en-US" : "ru-RU",
  ).format(value);

export const priceText = (value: Price, locale: Locale = "ru") => {
  if (value === null) return translate(locale, "common.priceOnRequest");
  if (typeof value === "number") return numberText(value, locale) + " ₸";
  return `${numberText(value.min, locale)}–${numberText(value.max, locale)} ₸`;
};

export function itemTotal(item: CartItem): Price {
  const product = getProduct(item.productId);
  if (!product) return null;
  const basePrice = productPrice(product, item.variant);
  if (basePrice === null) return null;
  const extra = item.customization.enabled
    ? CUSTOMIZATION_PRICES[item.customization.type]
    : 0;
  if (extra === null) return null;
  if (typeof basePrice === "number")
    return (basePrice + extra) * item.quantity;
  return {
    min: (basePrice.min + extra) * item.quantity,
    max: (basePrice.max + extra) * item.quantity,
  };
}
export function cartTotal(items: CartItem[]): Price {
  const totals = items.map(itemTotal);
  if (totals.some((value) => value === null)) return null;
  const range = totals.reduce<{ min: number; max: number }>(
    (sum, value) => ({
      min: sum.min + (typeof value === "number" ? value : value?.min || 0),
      max: sum.max + (typeof value === "number" ? value : value?.max || 0),
    }),
    { min: 0, max: 0 },
  );
  return range.min === range.max ? range.min : range;
}
export function buildOrderMessage(items: CartItem[], locale: Locale = "ru"): string {
  const blocks = items
    .map((item, index) => {
      const rawProduct = getProduct(item.productId);
      if (!rawProduct) return "";
      const p = localizedProduct(rawProduct, locale);
      const c = item.customization;
      const variantSelections = productVariantSelections(rawProduct, item.variant);
      return [
        items.length > 1 ? String(index + 1) + "." : "",
        translate(locale, "orderMessage.product") + ": " + p.name,
        translate(locale, "orderMessage.category") + ": " + localizedCategory(p.category, locale).name,
        productHasSize(rawProduct)
          ? translate(locale, "orderMessage.size") + ": " +
            (item.size || translate(locale,
              rawProduct.sizeField === "belt"
                ? "orderMessage.sizeOrder"
                : "orderMessage.sizeHelp"))
          : "",
        ...variantSelections.map(({ label, value }) =>
          (localizedVariantLabel(label, locale) ||
            translate(locale, "orderMessage.variant")) + ": " +
          localizedVariant(value, locale),
        ),
        translate(locale, "orderMessage.quantity") + ": " + item.quantity,
        translate(locale, "orderMessage.price") + ": " +
          priceText(productPrice(rawProduct, item.variant), locale),
        ...(c.enabled
          ? [
              translate(locale, "orderMessage.customization") + ": " + translate(locale, "common.yes"),
              translate(locale, "orderMessage.type") + ": " +
                (c.type === "backpatch" ? "IJF backpatch" : translate(locale, "custom.embroidery")),
              ...(c.type === "backpatch"
                ? [
                    translate(locale, "orderMessage.surname") + ": " + c.surname,
                    translate(locale, "orderMessage.country") + ": " + c.country,
                    translate(locale, "orderMessage.place") + ": " +
                      translate(locale, "custom.back") + " · " + translate(locale, "custom.fixed"),
                  ]
                : [
                    translate(locale, "orderMessage.text") + ": " + c.text,
                    translate(locale, "orderMessage.place") + ": " +
                      (c.legacyNote
                        ? translate(locale, "orderMessage.needsAgreement")
                        : placementText(c, locale)),
                    translate(locale, "orderMessage.color") + ": " +
                      embroideryColorText(c.color, locale),
                    translate(locale, "orderMessage.font") + ": " + c.font,
                    translate(locale, "orderMessage.orientation") + ": " +
                      orientationText(c.orientation, locale),
                    ...(c.legacyNote && locale === "ru" ? [c.legacyNote] : []),
                  ]),
              translate(locale, "orderMessage.extra") + ": " +
                priceText(CUSTOMIZATION_PRICES[c.type], locale),
            ]
          : []),
        translate(locale, "orderMessage.itemTotal") + ": " + priceText(itemTotal(item), locale),
      ]
        .filter(Boolean)
        .join("\n");
    })
    .filter(Boolean);
  return [
    translate(locale, "orderMessage.hello"),
    ...blocks,
    translate(locale, "orderMessage.total") + ": " + priceText(cartTotal(items), locale),
    translate(locale, "orderMessage.availability"),
  ].join("\n\n");
}
export function whatsappUrl(
  message: string,
  number = WHATSAPP_NUMBER,
): string | null {
  const digits = number.replace(/[\s()+-]/g, "");
  return /^[1-9]\d{7,14}$/.test(digits)
    ? "https://wa.me/" + digits + "?text=" + encodeURIComponent(message)
    : null;
}
// Never trust persisted data: catalog fields and prices always come from this build.
export function parseCart(raw: string | null): CartItem[] {
  try {
    const data: unknown = JSON.parse(raw || "[]");
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    return data.slice(0, 50).flatMap((x) => {
      if (!x || typeof x !== "object") return [];
      const p = getProduct(x.productId);
      if (
        !p ||
        typeof x.key !== "string" ||
        !x.key ||
        x.key.length > 100 ||
        seen.has(x.key)
      )
        return [];
      if (!Number.isInteger(x.quantity) || x.quantity < 1 || x.quantity > 99)
        return [];
      const c = parseCustomization(x.customization);
      if (!c || (c.enabled && p.category !== "kimono")) return [];
      const variant =
        normalizeProductVariant(x.productId, x.variant) ||
        (p.category === "kimono" &&
        ["Уточнить цвет", "Белый", "Синий"].includes(x.variant)
          ? p.variants[0]
          : null);
      if (
        typeof x.size !== "string" ||
        x.size.length > 40 ||
        !variant
      )
        return [];
      seen.add(x.key);
      return [
        {
          key: x.key,
          productId: p.id,
          size: x.size,
          variant,
          quantity: x.quantity,
          customization: c,
        },
      ];
    });
  } catch {
    return [];
  }
}
