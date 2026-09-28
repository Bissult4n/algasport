"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  localeHtmlLang,
  translate,
  type Locale,
  type Translate,
} from ".";

type I18nValue = { locale: Locale; setLocale: (locale: Locale) => void; t: Translate };
const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(saved)) setLocaleState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = localeHtmlLang[locale];
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {}
  }, [locale]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === LOCALE_STORAGE_KEY && isLocale(event.newValue))
        setLocaleState(event.newValue);
    };
    addEventListener("storage", sync);
    return () => removeEventListener("storage", sync);
  }, []);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const t = useCallback<Translate>(
    (key, params) => translate(locale, key, params),
    [locale],
  );
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
