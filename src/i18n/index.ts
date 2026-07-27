import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./locales/es.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";

export const SUPPORTED_LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
] as const;

export type SupportedLang = (typeof SUPPORTED_LANGUAGES)[number]["code"];

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      fr: { translation: fr },
      de: { translation: de },
    },
    lng: "es",
    fallbackLng: "es",
    supportedLngs: ["es", "en", "fr", "de"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem("jardiper.lang");
      const nav = window.navigator.language?.slice(0, 2);
      const initial = (stored ?? (["en", "fr", "de", "es"].includes(nav) ? nav : "es")) as SupportedLang;
      if (initial !== "es") void i18n.changeLanguage(initial);
    } catch {
      /* noop */
    }
  }
}

export default i18n;

export function setLanguage(lang: SupportedLang) {
  void i18n.changeLanguage(lang);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem("jardiper.lang", lang);
      document.documentElement.lang = lang;
    } catch {
      /* noop */
    }
  }
}