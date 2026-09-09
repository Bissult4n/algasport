import { categoryName, getProduct } from "./catalog";
import {
  CUSTOMIZATION_PRICES,
  PRICE_ON_REQUEST,
  WHATSAPP_NUMBER,
} from "./shop-config";
import {
  defaultCustomization,
  parseCustomization,
  placementText,
  type Customization,
} from "./customization";
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
export function newItem(productId: string): CartItem {
  return {
    key: "",
    productId,
    size: "",
    variant: getProduct(productId)!.variants[0],
    quantity: 1,
    customization: defaultCustomization(),
  };
}
export const priceText = (value: number | null) =>
  value === null
    ? PRICE_ON_REQUEST
    : new Intl.NumberFormat("ru-RU").format(value) + " ₸";
export function itemTotal(item: CartItem): number | null {
  const product = getProduct(item.productId);
  if (!product || product.price === null) return null;
  const extra = item.customization.enabled
    ? CUSTOMIZATION_PRICES[item.customization.type]
    : 0;
  return extra === null ? null : (product.price + extra) * item.quantity;
}
export function cartTotal(items: CartItem[]): number | null {
  const totals = items.map(itemTotal);
  return totals.some((v) => v === null)
    ? null
    : totals.reduce<number>((sum, v) => sum + (v || 0), 0);
}
export function buildOrderMessage(items: CartItem[]): string {
  const blocks = items
    .map((item, index) => {
      const p = getProduct(item.productId);
      if (!p) return "";
      const c = item.customization;
      return [
        items.length > 1 ? String(index + 1) + "." : "",
        "Товар: " + p.name,
        "Категория: " + categoryName(p.category),
        p.category === "kimono"
          ? "Размер: " + (item.size || "Помогите подобрать")
          : "",
        "Вариант/цвет: " + item.variant,
        "Количество: " + item.quantity,
        "Цена: " + priceText(p.price),
        ...(c.enabled
          ? [
              "Кастомизация: Да",
              "Тип: " + (c.type === "backpatch" ? "IJF backpatch" : "Вышивка"),
              ...(c.type === "backpatch"
                ? [
                    "Фамилия: " + c.surname,
                    "Страна: " + c.country,
                    "Место: Спина · фиксировано",
                  ]
                : [
                    "Текст: " + c.text,
                    "Место: " +
                      (c.legacyNote ? "Нужно согласовать" : placementText(c)),
                    "Цвет: " + c.color,
                    "Шрифт: " + c.font,
                    "Ориентация: " +
                      (c.orientation === "vertical"
                        ? "Вертикально"
                        : "Горизонтально"),
                    ...(c.legacyNote ? [c.legacyNote] : []),
                  ]),
              "Доплата: " + priceText(CUSTOMIZATION_PRICES[c.type]),
            ]
          : []),
        "Итого по товару: " + priceText(itemTotal(item)),
      ]
        .filter(Boolean)
        .join("\n");
    })
    .filter(Boolean);
  return [
    "Здравствуйте! Хочу оформить заказ.",
    ...blocks,
    "Итого: " + priceText(cartTotal(items)),
    "Подскажите, пожалуйста, есть ли в наличии?",
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
      if (
        typeof x.size !== "string" ||
        x.size.length > 40 ||
        !p.variants.includes(x.variant)
      )
        return [];
      seen.add(x.key);
      return [
        {
          key: x.key,
          productId: p.id,
          size: x.size,
          variant: x.variant,
          quantity: x.quantity,
          customization: c,
        },
      ];
    });
  } catch {
    return [];
  }
}
