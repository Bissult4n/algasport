// Set international digits only here, then rebuild the static site.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
export const INSTAGRAM_USERNAME = (process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME ?? "alga_sport_shops").replace(/^@/, "");
export const INSTAGRAM_URL = "https://www.instagram.com/" + encodeURIComponent(INSTAGRAM_USERNAME) + "/";
export const SITE_URL = "https://alga-sport-shops.vercel.app";
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
export const SHOP_TERMS = {
  availability: "Наличие уточняется",
  kimonoAvailability: "Размеры и наличие уточняются",
  delivery: null as string | null,
  payment: null as string | null,
};
export const DELIVERY_TEXT = SHOP_TERMS.delivery || "Стоимость доставки согласуем до оплаты.";
export const PAYMENT_TEXT = SHOP_TERMS.payment || "Способ оплаты согласуем при подтверждении заказа.";
export const PRICE_ON_REQUEST = "Цена по запросу";
export const CUSTOMIZATION_PRICES: Record<string, number | null> = {
  backpatch: null,
  embroidery: null,
};
export const asset = (path: string) =>
  (process.env.NEXT_PUBLIC_BASE_PATH || "") + path;
