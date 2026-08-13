import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonEn from "./locales/en/common.json";
import commonVi from "./locales/vi/common.json";
import commonFr from "./locales/fr/common.json";
import commonDe from "./locales/de/common.json";
import commonEs from "./locales/es/common.json";
import homeEn from "./locales/en/home.json";
import homeVi from "./locales/vi/home.json";
import homeFr from "./locales/fr/home.json";
import homeDe from "./locales/de/home.json";
import homeEs from "./locales/es/home.json";
import leaderboardEn from "./locales/en/leaderboard.json";
import leaderboardVi from "./locales/vi/leaderboard.json";
import leaderboardFr from "./locales/fr/leaderboard.json";
import leaderboardDe from "./locales/de/leaderboard.json";
import leaderboardEs from "./locales/es/leaderboard.json";
import puzzlesEn from "./locales/en/puzzles.json";
import puzzlesVi from "./locales/vi/puzzles.json";
import puzzlesFr from "./locales/fr/puzzles.json";
import puzzlesDe from "./locales/de/puzzles.json";
import puzzlesEs from "./locales/es/puzzles.json";
import marathonEn from "./locales/en/marathon.json";
import marathonVi from "./locales/vi/marathon.json";
import marathonFr from "./locales/fr/marathon.json";
import marathonDe from "./locales/de/marathon.json";
import marathonEs from "./locales/es/marathon.json";
import contactEn from "./locales/en/contact.json";
import contactVi from "./locales/vi/contact.json";
import contactFr from "./locales/fr/contact.json";
import contactDe from "./locales/de/contact.json";
import contactEs from "./locales/es/contact.json";
import authEn from "./locales/en/auth.json";
import authVi from "./locales/vi/auth.json";
import authFr from "./locales/fr/auth.json";
import authDe from "./locales/de/auth.json";
import authEs from "./locales/es/auth.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "vi", "fr", "de", "es"],
    ns: ["common", "home", "leaderboard", "puzzles", "marathon", "contact", "auth-pages"],
    defaultNS: "common",
    resources: {
      en: { common: commonEn, home: homeEn, leaderboard: leaderboardEn, puzzles: puzzlesEn, marathon: marathonEn, contact: contactEn, "auth-pages": authEn },
      vi: { common: commonVi, home: homeVi, leaderboard: leaderboardVi, puzzles: puzzlesVi, marathon: marathonVi, contact: contactVi, "auth-pages": authVi },
      fr: { common: commonFr, home: homeFr, leaderboard: leaderboardFr, puzzles: puzzlesFr, marathon: marathonFr, contact: contactFr, "auth-pages": authFr },
      de: { common: commonDe, home: homeDe, leaderboard: leaderboardDe, puzzles: puzzlesDe, marathon: marathonDe, contact: contactDe, "auth-pages": authDe },
      es: { common: commonEs, home: homeEs, leaderboard: leaderboardEs, puzzles: puzzlesEs, marathon: marathonEs, contact: contactEs, "auth-pages": authEs },
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

// Keep <html lang> in sync so screen readers use the right pronunciation rules.
function syncDocumentLang(lng: string) {
  document.documentElement.lang = lng;
}
syncDocumentLang(i18n.resolvedLanguage ?? "en");
i18n.on("languageChanged", syncDocumentLang);

export default i18n;
