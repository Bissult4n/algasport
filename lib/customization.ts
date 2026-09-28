export type Backpatch = {
  enabled: boolean;
  type: "backpatch";
  surname: string;
  country: string;
};

export const embroideryColors = {
  Синий: "#183c79",
  Красный: "#922b2c",
  Черный: "#282b30",
  Золотой: "#93702d",
};
export type Embroidery = {
  enabled: boolean;
  type: "embroidery";
  sourceText?: string;
  text: string;
  placement: "Куртка" | "Штаны" | "Пояс";
  color: keyof typeof embroideryColors;
  font: "Modern" | "Serif" | "Brush";
  orientation: "vertical";
  legacyNote?: string;
};
export type Customization = Backpatch | Embroidery;

export const defaultCustomization = (): Backpatch => ({
  enabled: false,
  type: "backpatch",
  surname: "",
  country: "KAZ",
});
export const defaultEmbroidery = (): Embroidery => ({
  enabled: false,
  type: "embroidery",
  sourceText: "",
  text: "",
  placement: "Куртка",
  color: "Синий",
  font: "Modern",
  orientation: "vertical",
});
export const placementText = (c: Embroidery, locale: Locale = "ru") => {
  const [placement, hint] = c.placement === "Куртка"
    ? [translate(locale, "custom.jacket"), translate(locale, "custom.jacketHint")]
    : c.placement === "Штаны"
      ? [translate(locale, "custom.pants"), translate(locale, "custom.pantsHint")]
      : [translate(locale, "custom.belt"), translate(locale, "custom.beltHint")];
  return placement + " / " + hint.charAt(0).toLocaleLowerCase(locale) + hint.slice(1);
};

export const embroideryColorText = (
  color: Embroidery["color"],
  locale: Locale = "ru",
) => {
  const keys = {
    Синий: "custom.blue",
    Красный: "custom.red",
    Черный: "custom.black",
    Золотой: "custom.gold",
  } satisfies Record<Embroidery["color"], TranslationKey>;
  return translate(locale, keys[color]);
};

export function parseCustomization(raw: unknown): Customization | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  if (typeof c.enabled !== "boolean") return null;
  if (c.type === "backpatch") {
    if (
      typeof c.surname !== "string" ||
      c.surname.length > 24 ||
      (c.enabled && !c.surname.trim())
    )
      return null;
    if (typeof c.country !== "string" || !/^[A-Z]{3}$/.test(c.country))
      return null;
    // Backpatch settings are fixed, including when reading an older saved cart.
    return {
      enabled: c.enabled,
      type: "backpatch",
      surname: c.surname,
      country: c.country,
    };
  }
  if (c.type !== "embroidery") return null;
  const sourceText = typeof c.sourceText === "string" && c.sourceText.trim()
    ? c.sourceText
    : typeof c.text === "string"
      ? c.text
      : c.surname;
  if (
    typeof sourceText !== "string" ||
    sourceText.length > 40 ||
    (c.enabled && !sourceText.trim())
  )
    return null;
  const text = toJapaneseEmbroidery(sourceText);
  if (c.enabled && !isJapaneseEmbroidery(text)) return null;
  if (
    typeof c.color !== "string" ||
    !Object.prototype.hasOwnProperty.call(embroideryColors, c.color)
  )
    return null;
  if (!["Modern", "Serif", "Brush"].includes(String(c.font))) return null;
  if (
    c.orientation !== undefined &&
    !["horizontal", "vertical"].includes(String(c.orientation))
  )
    return null;
  const legacy = ["Спина", "Грудь", "Другое"].includes(String(c.placement));
  if (!legacy && !["Куртка", "Штаны", "Пояс"].includes(String(c.placement)))
    return null;
  const legacyNote = legacy
    ? "Прежнее место: " + c.placement + ". Новое размещение нужно согласовать."
    : typeof c.legacyNote === "string"
      ? c.legacyNote.slice(0, 140)
      : undefined;
  return {
    enabled: c.enabled,
    type: "embroidery",
    sourceText: sourceText.trim(),
    text,
    placement: legacy ? "Куртка" : (c.placement as Embroidery["placement"]),
    color: c.color as Embroidery["color"],
    font: c.font as Embroidery["font"],
    // Older horizontal selections migrate to the single supported layout.
    orientation: "vertical",
    ...(legacyNote ? { legacyNote } : {}),
  };
}
import { translate, type Locale } from "./i18n";
import type { TranslationKey } from "./i18n/ru";
import { isJapaneseEmbroidery, toJapaneseEmbroidery } from "./japanese";
