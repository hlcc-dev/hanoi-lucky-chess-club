import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonEn from "./locales/en/common.json";
import commonVi from "./locales/vi/common.json";
import homeEn from "./locales/en/home.json";
import homeVi from "./locales/vi/home.json";
import leaderboardEn from "./locales/en/leaderboard.json";
import leaderboardVi from "./locales/vi/leaderboard.json";
import puzzlesEn from "./locales/en/puzzles.json";
import puzzlesVi from "./locales/vi/puzzles.json";
import marathonEn from "./locales/en/marathon.json";
import marathonVi from "./locales/vi/marathon.json";
import contactEn from "./locales/en/contact.json";
import contactVi from "./locales/vi/contact.json";
import authEn from "./locales/en/auth.json";
import authVi from "./locales/vi/auth.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "vi"],
    ns: ["common", "home", "leaderboard", "puzzles", "marathon", "contact", "auth-pages"],
    defaultNS: "common",
    resources: {
      en: { common: commonEn, home: homeEn, leaderboard: leaderboardEn, puzzles: puzzlesEn, marathon: marathonEn, contact: contactEn, "auth-pages": authEn },
      vi: { common: commonVi, home: homeVi, leaderboard: leaderboardVi, puzzles: puzzlesVi, marathon: marathonVi, contact: contactVi, "auth-pages": authVi },
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "hlcc_language",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
