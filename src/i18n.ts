import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "ar"],
    fallbackLng: "en",
    debug: true,

    detection: {
      // ترتيب مصادر اللغة
      order: ["cookie"],

      // يخزن اللغة فقط في cookies
      caches: ["cookie"],

      // اسم الكوكي
      lookupCookie: "appLang",

      // إعدادات الكوكي
      cookieMinutes: 60 * 24 * 365, // سنة
    },

    backend: {
      loadPath: "/locales/{{lng}}.json",
    },

    react: {
      useSuspense: true,
    },
  });

export default i18n;