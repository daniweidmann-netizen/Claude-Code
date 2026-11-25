# 02 – Game Fact Sheet

Stand: 25.11.2026 · Konfiguration 1.0.0 (`config/game-config.v1.0.0.json`, SHA-256 `943082d6…98e3`,
geprüft durch `tests/unit/frozen-config.test.ts`).
Spalte «Quelle» nennt Datei und Zeilen; Geldwerte der Konfiguration sind in Hundertstel-Einsätzen
(«centibet»: 100 = 1× Einsatz).

## Spiel

| Eigenschaft | Wert | Quelle |
|---|---|---|
| Name / Claim | TEMPLE OF THE LOST SUN / EVERY RELIC REVEALS A SECRET. | `src/client/scenes/game-scene.ts` (Titelbildschirm), `public/logo.webp` |
| Genre | Video-Slot, Cluster Pays mit Kaskaden | `docs/02_GDD.md` Z. 17 |
| Spielfeld | 6 Spalten × 5 Reihen = 30 Felder | Konfig. Z. 3–4 |
| Walzen | keine Walzenstreifen: jedes Feld wird unabhängig aus einer Gewichtstabelle gezogen | `src/engine/grid/grid.ts`, `docs/publisher/02_MATH_DOCUMENTATION.md` Abschn. 3 |
| Mindestcluster | **5** gleiche Symbole | Konfig. Z. 5; `src/engine/round/round.ts` Z. 347; Test `tests/integration/cluster-rule.test.ts` |
| Verbindung | nur waagerecht und senkrecht (gemeinsame Kante) | `src/engine/clusters/clusters.ts` Z. 36–41 |
| Diagonale Verbindungen | **nein** | wie oben; Tests `tests/unit/grid-clusters.test.ts` |
| Kaskaden | ja: Gewinnsymbole verschwinden, Symbole fallen nach, neue werden gezogen; höchstens 50 je Spin | Konfig. Z. 6; `round.ts` Z. 346–407 |
| Wild | ja; fällt nicht von oben (Gewicht 0), entsteht nur durch Stationen; zählt für jedes Gewinnsymbol, kann zu mehreren Clustern gehören | Konfig. Z. 15, 25; `clusters.ts` Z. 10–15 |
| Explorer | Wild, das nach einem Gewinn stehen bleibt (bis zum Ende des Spins) | `round.ts` Z. 294–298, 382 |
| Scatter / Trigger | Compass: zahlt nicht; 3 oder mehr auf dem Raster am Ende eines Spins lösen Free Spins aus | Konfig. Z. 145–162; `round.ts` Z. 128–135, 409–410 |
| Weiteres Sondersymbol | Temple Key: zahlt nicht; zählt bei einer Gewinnkaskade als zusätzlicher Schritt und wird entfernt | `round.ts` Z. 366–375 |
| Free-Spins-Auslöser | 3 / 4 / 5+ Compass → 8 / 10 / 12 Free Spins; Preis «Free Spins» im Temple Bonus → 8; Feature-Kauf → 8 | Konfig. Z. 146–161, 321–331 |
| Retrigger | ja: 3+ Compass am Ende eines Free Spins → +4; höchstens 30 Free Spins je Feature | Konfig. Z. 163–165; `round.ts` Z. 200, 220 |
| Multiplikator | M = T + S. T = 1, ab Station Treasure 2 (je Spin). S = Sonnenbonus aus der Station Relic. Gilt für Clustergewinne | Konfig. Z. 100–144; `round.ts` Z. 350, 291–293, 300–311 |
| Bonus-Auslöser | Expedition erreicht in der Basisrunde Station 5 (9 Schritte in einem Spin) → Temple Bonus | Konfig. Z. 92–98; `round.ts` Z. 312–317, 136–140 |
| Temple Finale | Free Spins: jedes Erreichen des Tempels gibt ein Siegel (höchstens 1 je Spin, 3 je Feature); nach den Free Spins Bonus mit besserer Preistabelle | Konfig. Z. 167, 213–320; `round.ts` Z. 204–209, 398–401 |
| Feature-Kauf (im Spiel beschriftet «BUY EXPEDITION» / «Expedition kaufen»; in den englischen Unterlagen auch «Buy feature») | 58× Einsatz → 8 Free Spins ab Base Camp 1 | Konfig. Z. 326–331; `round.ts` Z. 148–157 |
| Höchstgewinn | 10 000× Einsatz je Runde (harte Kappung) | Konfig. Z. 7; `round.ts` Z. 252–262 |
| Einsatzstufen der Demo | 0.20 / 0.50 / 1.00 / 2.00 / 5.00 / 10.00 (Spielgeld) | `src/session/game-service.ts` Z. 79 |
| Ziel-RTP | 96,00 % (Entwurfsziel, kein Messwert) | `docs/04_MATH_MODELING_PLAN.md` |
| Simulierter RTP | 95,995 % – intern, nicht zertifiziert | `05_Math_Overview.md` |

## Technik

| Eigenschaft | Wert | Quelle |
|---|---|---|
| Plattform | Web (HTML5), läuft im Browser | `index.html`, `vite.config.ts` |
| Sprache | TypeScript 5.9 | `package.json` Z. 20–27 |
| Engine (Darstellung) | Phaser 3.90 | `package.json` |
| Rendering | WebGL über Phaser (Canvas als Rückfall), Geräteauflösung bis Pixelverhältnis 2 | `src/client/main.ts`, `src/client/env.ts` |
| Audio | Web Audio API: 15 aufgenommene Effekte, 2 Musikschleifen, synthetischer Rückfall | `src/client/audio/sfx.ts` |
| Build | Vite 6 | `package.json` |
| Formate im Test | 393×852, 1280×720, 360×640, 375×667, 852×393, 393×852 bei Pixelverhältnis 3; zusätzlich 430×932, 768×1024, 1366×768, 1920×1080 | `tools/e2e/smoke.cjs`, `tools/e2e/final.cjs` |
| Geräte | **Nur Chromium (ohne Grafikkarte) geprüft.** Echte Smartphones, Tablets, Safari, Firefox: NICHT VERIFIZIERT | `docs/11_FINAL_REPORT.md` Abschn. 7 |
| Sprachen | Englisch, Deutsch | `src/client/i18n.ts` |
| Tempo-Modi | Normal (1×), Fast (1,9×), Skip (5×) | `src/client/timing.ts` |
| Auslieferung | rund 5,6 MB | Build `dist-client` |
| Server / RGS | nicht vorhanden; Engine läuft in der Demo im Browser | `src/session/game-service.ts` Z. 60–64 |
