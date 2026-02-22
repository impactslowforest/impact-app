import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const CUSTOM_STORAGE_KEY = 'impact_custom_translations';

function loadCustomTranslations() {
  try {
    const raw = localStorage.getItem(CUSTOM_STORAGE_KEY);
    if (!raw) return;
    const custom = JSON.parse(raw) as Record<string, Record<string, Record<string, string>>>;

    for (const [ns, langs] of Object.entries(custom)) {
      for (const [lang, overrides] of Object.entries(langs)) {
        i18n.addResourceBundle(lang, ns, overrides, true, true);
      }
    }
  } catch {
    // ignore parse errors
  }
}

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    supportedLngs: ['en', 'vi', 'lo', 'id'],
    ns: ['common', 'auth', 'nav'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'impact_language',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  })
  .then(() => {
    loadCustomTranslations();
  });

export default i18n;
