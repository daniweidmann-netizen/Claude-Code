import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import de from './de.js';
import en from './en.js';
import appEn from './app-en.js';

// Zwei Arten von Texten:
//  t('key')        – Schlüssel-basiert (Marketing-Seiten, de.js / en.js)
//  tr('Deutscher Text', { n: 3 }) – App-Texte: der deutsche Text ist der Schlüssel,
//                    app-en.js liefert die englische Fassung. Platzhalter: {n}
const DICTS = { de, en };
export const UI_LANGUAGES = [
  { id: 'en', label: 'EN' },
  { id: 'de', label: 'DE' },
];
export const DEFAULT_LANG = 'en';

let currentLang = DEFAULT_LANG;
export const getLang = () => currentLang;
export const getLocale = () => (currentLang === 'de' ? 'de-CH' : 'en-GB');

const fill = (s, vars) => (vars ? String(s).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`)) : s);

// Auch ausserhalb von React nutzbar (z. B. für Fehlermeldungen)
export function translate(de, vars, lang = currentLang) {
  if (lang === 'de') return fill(de, vars);
  return fill(appEn[de] ?? de, vars);
}

const I18nContext = createContext(null);

function detect() {
  try {
    const saved = localStorage.getItem('tr-lang');
    if (saved && DICTS[saved]) return saved;
  } catch {}
  // Deutschsprachige Browser bekommen direkt die deutsche Version (sonst übersetzt der Browser
  // selbst – und macht aus „TrueReel“ z. B. „Echte Rolle“)
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    if (langs.some((l) => /^de\b/i.test(l || ''))) return 'de';
  } catch {}
  return DEFAULT_LANG; // sonst Englisch, Deutsch umschaltbar
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detect);
  currentLang = lang;
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('tr-lang', lang); } catch {}
  }, [lang]);
  const value = useMemo(() => ({
    lang,
    setLang,
    locale: lang === 'de' ? 'de-CH' : 'en-GB',
    t: (key) => DICTS[lang]?.[key] ?? en[key] ?? key,
    tr: (de, vars) => translate(de, vars, lang),
  }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
