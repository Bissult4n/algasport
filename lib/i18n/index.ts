import { en } from "./en";
import { kk } from "./kk";
import { ru, type TranslationKey } from "./ru";

export type Locale = "ru" | "kk" | "en";
export const DEFAULT_LOCALE: Locale = "ru";
export const LOCALE_STORAGE_KEY = "alga:locale:v1";
export const localeLabels: Record<Locale, string> = { ru: "RU", kk: "KZ", en: "EN" };
export const localeHtmlLang: Record<Locale, string> = { ru: "ru", kk: "kk", en: "en" };
const dictionaries = { ru, kk, en };

export const isLocale = (value: unknown): value is Locale =>
  value === "ru" || value === "kk" || value === "en";

export function translate(
  locale: Locale,
  key: TranslationKey,
  params: Record<string, string | number> = {},
) {
  return Object.entries(params).reduce(
    (value, [name, replacement]) =>
      value.replaceAll("{" + name + "}", String(replacement)),
    dictionaries[locale][key] || ru[key],
  );
}

export type Translate = (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string;

export { type TranslationKey };
