"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type Locale,
  LOCALES,
  LOCALE_LABELS,
  getTranslation,
} from "../data/translations";

const STORAGE_KEY = "portfolio-locale";

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && LOCALES.includes(stored as Locale)) return stored as Locale;
  return "en";
}

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof import("../data/translations").TranslationKeys) => string;
  localeLabel: (locale: Locale) => string;
  locales: Locale[];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getStoredLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const t = useCallback(
    (key: keyof import("../data/translations").TranslationKeys) => {
      return getTranslation(locale, key);
    },
    [locale]
  );

  const localeLabel = useCallback((l: Locale) => LOCALE_LABELS[l], []);

  const value: LanguageContextValue = {
    locale,
    setLocale,
    t,
    localeLabel,
    locales: LOCALES,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
