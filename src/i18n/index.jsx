import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import de from './de.js';
import en from './en.js';

// FR/IT/ES-Oberfläche: Wörterbücher hier ergänzen. Fehlende Keys fallen auf Deutsch zurück.
const DICTS = { de, en };
export const UI_LANGUAGES = [
  { id: 'de', label: 'DE' },
  { id: 'en', label: 'EN' },
];

const I18nContext = createContext(null);

function detect() {
  try {
    const saved = localStorage.getItem('tr-lang');
    if (saved && DICTS[saved]) return saved;
  } catch {}
  const nav = (navigator.language || 'de').slice(0, 2);
  return DICTS[nav] ? nav : 'de';
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detect);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('tr-lang', lang); } catch {}
  }, [lang]);
  const value = useMemo(() => ({
    lang,
    setLang,
    t: (key) => DICTS[lang]?.[key] ?? de[key] ?? key,
  }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
