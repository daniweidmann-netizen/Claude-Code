/**
 * Interface texts. English is the presentation language; German stays
 * available (?lang=de or the switch in the info panel).
 */
export type Lang = 'en' | 'de';

function detect(): Lang {
  if (typeof window === 'undefined') return 'en';
  const q = new URLSearchParams(window.location.search).get('lang');
  if (q === 'de' || q === 'en') return q;
  try { const s = window.localStorage.getItem('tls.lang'); if (s === 'de' || s === 'en') return s; } catch { /* storage unavailable */ }
  return 'en';
}
export const LANG: Lang = detect();

export function storeLang(lang: Lang): void {
  try { window.localStorage.setItem('tls.lang', lang); } catch { /* storage unavailable */ }
}

const S = {
  demo: { en: 'DEMO PLAY', de: 'DEMO' },
  demoLong: { en: 'DEMO PLAY · NO REAL MONEY', de: 'DEMO · KEIN ECHTGELD' },
  balance: { en: 'BALANCE', de: 'GUTHABEN' },
  win: { en: 'WIN', de: 'GEWINN' },
  bet: { en: 'BET', de: 'EINSATZ' },
  auto: { en: 'AUTO', de: 'AUTO' },
  stop: { en: 'STOP {n}', de: 'STOPP {n}' },
  buy: { en: 'BUY EXPEDITION', de: 'EXPEDITION KAUFEN' },
  freeSpins: { en: 'FREE SPINS', de: 'FREE SPINS' },
  freeSpinOf: { en: 'FREE SPIN {i} / {n}', de: 'FREE SPIN {i} / {n}' },
  tapStart: { en: 'TAP TO START', de: 'TIPPEN ZUM START' },
  preview: { en: 'Preview – not a game result', de: 'Vorschau – kein Spielergebnis' },
  loading: { en: 'Loading …', de: 'Laden …' },
  nextStation: { en: 'Next: {name} · {n} step', de: 'Nächste: {name} · {n} Schritt' },
  nextStationPl: { en: 'Next: {name} · {n} steps', de: 'Nächste: {name} · {n} Schritte' },
  trackDone: { en: 'The temple is open', de: 'Der Tempel ist offen' },
  trackIdle: { en: 'Every winning cascade is one step', de: 'Jede Gewinnkaskade ist ein Schritt' },
  seals: { en: 'SEALS', de: 'SIEGEL' },
  fxDiscovery: { en: 'DISCOVERY · Wilds appear', de: 'DISCOVERY · Wilds erscheinen' },
  fxTreasure: { en: 'TREASURE · Multiplier ×{m}', de: 'TREASURE · Multiplikator ×{m}' },
  fxAncient: { en: 'ANCIENT POWER · The Explorer stays', de: 'ANCIENT POWER · Der Explorer bleibt' },
  fxRelic: { en: 'RELIC · Sun bonus +{v}', de: 'RELIC · Sonnenbonus +{v}' },
  fxTemple: { en: 'TEMPLE · The gate opens', de: 'TEMPLE · Das Tor öffnet sich' },
  fxSeal: { en: 'TEMPLE SEAL {n}', de: 'TEMPELSIEGEL {n}' },
  fxKey: { en: 'TEMPLE KEY · +1 step', de: 'TEMPLE KEY · +1 Schritt' },
  bought: { en: 'EXPEDITION BOUGHT', de: 'EXPEDITION GEKAUFT' },
  fsAward: { en: '{n} FREE SPINS', de: '{n} FREE SPINS' },
  fsRetrigger: { en: '+{n} FREE SPINS', de: '+{n} FREE SPINS' },
  fsDone: { en: 'FREE SPINS COMPLETE', de: 'FREE SPINS BEENDET' },
  totalWin: { en: 'TOTAL WIN', de: 'GESAMTGEWINN' },
  winGood: { en: 'NICE WIN', de: 'SCHÖNER GEWINN' },
  winBig: { en: 'BIG WIN', de: 'GROSSER GEWINN' },
  winEpic: { en: 'EPIC WIN', de: 'EPISCHER GEWINN' },
  maxWin: { en: 'MAXIMUM WIN', de: 'MAXIMALGEWINN' },
  replay: { en: 'REPLAY', de: 'WIEDERGABE' },
  bonusTitle: { en: 'TEMPLE BONUS', de: 'TEMPLE BONUS' },
  finaleTitle: { en: 'TEMPLE FINALE', de: 'TEMPLE FINALE' },
  finaleSeals: { en: '{n} seal', de: '{n} Siegel' },
  finaleSealsPl: { en: '{n} seals', de: '{n} Siegel' },
  bonusHint: { en: 'Choose a chamber. The prizes are set before you choose – your choice decides.', de: 'Wähle eine Kammer. Die Preise liegen fest, bevor du wählst – deine Wahl entscheidet.' },
  bonusAgain: { en: 'Relic Bonus – choose another chamber', de: 'Relic Bonus – wähle eine weitere Kammer' },
  bonusRevealed: { en: 'The other chambers held:', de: 'In den anderen Kammern lag:' },
  notChosen: { en: 'not chosen', de: 'nicht gewählt' },
  chamberSun: { en: 'SUN CHAMBER', de: 'SONNENKAMMER' },
  chamberJade: { en: 'JADE CHAMBER', de: 'JADEKAMMER' },
  chamberMoon: { en: 'MOON CHAMBER', de: 'MONDKAMMER' },
  prizeTreasure: { en: 'TREASURE', de: 'SCHATZ' },
  prizeRelic: { en: 'RELIC BONUS', de: 'RELIC BONUS' },
  prizeGrand: { en: 'GRAND TREASURE', de: 'HAUPTSCHATZ' },
  prizeFs: { en: 'FREE SPINS', de: 'FREE SPINS' },
  prizeRelicMore: { en: '+ another chamber', de: '+ weitere Kammer' },
  buyTitle: { en: 'BUY EXPEDITION?', de: 'EXPEDITION KAUFEN?' },
  buyBody: {
    en: 'Price: {price} ({x}× bet).\nYou start directly with {spins} free spins, Base Camp on station {camp}.\nA win is not guaranteed.\nSimulated RTP of the purchase: {rtp} (not certified).',
    de: 'Preis: {price} ({x}× Einsatz).\nDu startest direkt mit {spins} Free Spins, Base Camp auf Station {camp}.\nEin Gewinn ist nicht garantiert.\nSimulierter RTP des Kaufs: {rtp} (nicht zertifiziert).',
  },
  buyYes: { en: 'BUY {price}', de: 'KAUFEN {price}' },
  cancel: { en: 'CANCEL', de: 'ABBRECHEN' },
} as const;

export type TextKey = keyof typeof S;

export function t(key: TextKey, params: Record<string, string | number> = {}, lang: Lang = LANG): string {
  let s: string = S[key][lang];
  for (const [k, v] of Object.entries(params)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

/** All keys, for the completeness test. */
export const TEXT_KEYS = Object.keys(S) as TextKey[];
