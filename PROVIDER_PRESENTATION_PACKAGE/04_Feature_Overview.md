# 04 – Feature Overview

Stand: 25.11.2026 · Regeln aus `src/engine/round/round.ts` und `config/game-config.v1.0.0.json`
(«Konfig.»). Status-Legende am Ende. Häufigkeiten aus dem Abnahmelauf über 2 Mrd. Runden
(intern simuliert, nicht zertifiziert; siehe `05_Math_Overview.md`).

## 1. Symbolsystem

| ID | Name | Typ | Bild | Gewinn | Sonderfunktion | Basisrunde | Free Spins | Temple Bonus |
|---|---|---|---|---|---|---|---|---|
| 0 | Sapphire Gem | Gewinnsymbol (tief) | `public/symbols/sym0.png` | Paytable | – | Gewicht 2000 | 2000 | – |
| 1 | Golden Scarab | Gewinnsymbol | `sym1.png` | Paytable | – | 1950 | 1950 | – |
| 2 | Golden Chalice | Gewinnsymbol | `sym2.png` | Paytable | – | 1900 | 1900 | – |
| 3 | Ruby Crown | Gewinnsymbol | `sym3.png` | Paytable | – | 1850 | 1850 | – |
| 4 | Jade Mask | Gewinnsymbol (hoch) | `sym4.png` | Paytable | – | 1800 | 1800 | – |
| 5 | Wild | Wild | `sym5.png` (Sonnenscheibe) | keine eigene Auszahlung | zählt für jedes Gewinnsymbol, auch in mehreren Clustern; fällt nie von oben | entsteht durch Discovery und Relic | ebenso | – |
| 6 | Compass | Auslöser (Scatter) | `sym6.png` | keine | 3+ am Spin-Ende → Free Spins bzw. Retrigger | Gewicht 92 | 60 | Bild für den Preis «Free Spins» |
| 7 | Temple Key | Sondersymbol | `sym7.png` | keine | +1 Schritt je Key bei einer Gewinnkaskade; in Free Spins zusätzlich Base Camp +1 | Gewicht 200 | 91 | – |
| 8 | Explorer | stehendes Wild | `sym8.png` (Porträt-Medaillon) | keine eigene | Wild, das nach Gewinnen stehen bleibt (bis Spin-Ende) | entsteht durch Ancient Power | ebenso | – |
| – | **Sun Relic** | **kein Walzensymbol**; Artefakt und Wirkung von Station 4 | `public/ui/relic.webp` | keine | zieht einen Wert, erhöht den Sonnenbonus, das Feld wird Wild | Werte 2–25 | Werte 5–100 | Bild des Preises «Relic Bonus»; Titel-Emblem |

Quellen: Symbol-IDs `src/engine/config/types.ts` Z. 2–12; Gewichte Konfig. Z. 8–29 (Summe Basis
9792, Free Spins 9651; Wahrscheinlichkeit = Gewicht ÷ Summe); Namen `src/client/theme.ts` Z. 13.

Dekoration ohne Spielfunktion: Rahmen, Kacheln, Hintergründe, Stationsmedaillons, Tore, Schatzbild,
Logo, Lichteffekte.

### Paytable (× Einsatz je Cluster, vor Multiplikator)

| Symbol | 5 | 6 | 7 | 8–9 | 10–11 | 12–14 | 15–19 | 20+ |
|---|---|---|---|---|---|---|---|---|
| Sapphire Gem | 0,1 | 0,2 | 0,3 | 0,4 | 0,7 | 1,3 | 3,5 | 10 |
| Golden Scarab | 0,2 | 0,3 | 0,3 | 0,5 | 0,9 | 1,9 | 5 | 17,5 |
| Golden Chalice | 0,3 | 0,3 | 0,5 | 0,8 | 1,6 | 3,2 | 7,5 | 25 |
| Ruby Crown | 0,3 | 0,5 | 0,8 | 1,3 | 2,6 | 5,1 | 12,5 | 50 |
| Jade Mask | 0,7 | 0,9 | 1,6 | 2,6 | 5,1 | 9,4 | 25 | 100 |

Quelle: Konfig. Z. 30–91 (Werte dort in centibet). Stimmt mit `docs/publisher/02_MATH_DOCUMENTATION.md`
Abschn. 3 überein.

### Was bedeutet «SUN»?

| Frage | Antwort | Quelle |
|---|---|---|
| Was ist SUN? | Der **Sonnenbonus S**: ein additiver Teil des Gewinnmultiplikators. M = T + S | `round.ts` Z. 350 |
| Wie wird er gesammelt? | Nur durch die Station Relic (4): Sie zieht einen Wert aus einer Tabelle und addiert ihn zu S | `round.ts` Z. 300–311; Konfig. Z. 101–144 |
| Wo wird er angezeigt? | Im Multiplikatorfeld: grosse Zahl = M, daneben «T + S SUN» mit Sonnenkranz | `src/client/views/hud.ts` (`setMultiplier`) |
| Wofür wird er verwendet? | Er multipliziert alle Clustergewinne der folgenden Kaskaden | `round.ts` Z. 350–356 |
| Teil der Gewinnmathematik? | **Ja.** Kein reiner Anzeigewert | wie oben |
| Eigenständiges Feature? | Nein, Bestandteil des Expedition Systems (Station 4) | – |
| Reiner Fortschrittswert? | Nein. Der Fortschritt sind die Schritte auf dem Track; S ist Multiplikator | – |
| In der Basisrunde | wird zu Beginn jedes Basis-Spins auf 0 gesetzt | `round.ts` Z. 329 |
| In den Free Spins | wird **nicht** zurückgesetzt, wächst über das ganze Feature; Werte 5–100; in der Simulation im Mittel 14,72 am Ende, höchster beobachteter Wert 400 | `round.ts` Z. 329; Bericht Z. 108 |
| Im Temple Bonus | **keine Funktion.** Kammerpreise werden ohne Multiplikator gutgeschrieben | `round.ts` Z. 174 |

## 2. Expedition System (USP)

**In 30 Sekunden:** Jede Gewinnkaskade ist ein Schritt. Nach 1, 2, 4, 6 und 9 Schritten erreicht
die Expedition eine Station, und jede Station tut etwas anderes: zwei Wilds, doppelter
Multiplikator, ein Wild, das stehen bleibt, ein Relikt, das den Multiplikator erhöht – und am
Ende der Tempel mit dem Bonus. In den Free Spins startet man weiter oben.

| # | Station | Aktivierung (Schritte im Spin) | Wirkung | Basisrunde | Free Spins | Multiplikator | Häufigkeit als höchste Station je Basis-Spin |
|---|---|---|---|---|---|---|---|
| 1 | Discovery | 1 | 2 zufällige Gewinnsymbol-Felder werden Wild | ja | ja; ab Base Camp 1 schon zu Spinbeginn | – | 7,22 % |
| 2 | Treasure | 2 | Grundmultiplikator T wird 2 (bis Spin-Ende) | ja | ja; ab Base Camp 2 zu Spinbeginn | T: 1 → 2 | 19,15 % |
| 3 | Ancient Power | 4 | 1 zufälliges Gewinnsymbol-Feld wird Explorer (stehendes Wild) | ja | ja; ab Base Camp 3 zu Spinbeginn | – | 4,58 % |
| 4 | Relic | 6 | Sun Relic: Wert wird gezogen und zu S addiert, das Feld wird Wild | Werte 2/3/5/10/25 | Werte 5/10/25/50/100; S bleibt erhalten | S wächst | 1,53 % |
| 5 | Temple | 9 | Basis: Temple Bonus. Free Spins: 1 Siegel (höchstens 1 je Spin, 3 je Feature) | Bonus | Siegel für das Finale | – | 0,31 % (1 in 326) |

Kein Fortschritt: 67,20 % der Basis-Spins. Quelle Häufigkeiten: Bericht Z. 60–69.
Quellen Regeln: Konfig. Z. 92–100; `round.ts` Z. 277–319 (Wirkungen), Z. 366–371 (Schritte),
Z. 331–344 (Base Camp), Z. 391–400 (Reihenfolge, ein Siegel je Spin).

Weitere Aktivierungen: Eine Station wirkt je Spin einmal. In den Free Spins wirken die Stationen
bis zum Base Camp bei **jedem** Spin erneut zu Beginn.

Darstellung (implementiert): eigene Freischalt-Geste und Farbe je Station, Trittsteine zwischen
den Stationen, Lichtstrahl von der Station ins Raster, Textzeile mit dem nächsten Ziel
(`src/client/views/track-view.ts`, `presenter.ts`). Töne: `step`, `station`, `relic`, `bonus`
(`src/client/audio/sfx.ts`) – **vorhanden, aber nie angehört**.

Warum eigenständig: Die fünf Stationen verändern Raster (Wilds, Explorer), Multiplikator (T, S)
und Spielzustand (Bonus, Siegel). Der Spieler sieht innerhalb eines Spins, wie weit er ist und
was als Nächstes kommt.

## 3. Free Spins

| Punkt | Regel | Quelle |
|---|---|---|
| Auslöser | 3 / 4 / 5+ Compass auf dem Raster **am Ende** eines Basis-Spins | Konfig. Z. 146–161; `round.ts` Z. 128–135 |
| Anzahl | 8 / 10 / 12 | wie oben |
| Start-Base-Camp | 1 / 1 / 2 | wie oben |
| Weitere Wege | Preis «Free Spins» im Temple Bonus der Basisrunde: 8 Spins, Base Camp 2. Feature-Kauf: 8 Spins, Base Camp 1 | Konfig. Z. 321–331 |
| Retrigger | 3+ Compass am Ende eines Free Spins: +4 Spins | Konfig. Z. 163–164 |
| Obergrenze | 30 Free Spins je Feature | Konfig. Z. 165; `round.ts` Z. 220 |
| Symbolgewichte | eigene Tabelle (weniger Compass und Keys) | Konfig. Z. 19–28 |
| Base Camp | Jeder Spin beginnt auf der Base-Camp-Station; Stationen bis dorthin wirken sofort. Jeder Temple Key in einer Gewinnkaskade hebt das Base Camp um 1 (höchstens 3), dauerhaft für das Feature | `round.ts` Z. 331–344, 372–373 |
| Sonnenbonus | bleibt über alle Free Spins erhalten | `round.ts` Z. 329 |
| Siegel | Tempel erreicht → 1 Siegel (höchstens 1 je Spin, 3 gesamt) | `round.ts` Z. 314, 398–401 |
| Ende | keine Spins mehr, oder Höchstgewinn erreicht | `round.ts` Z. 194–200 |
| Danach | mit Siegeln: Temple Finale; ohne: Rückkehr in die Basisrunde | `round.ts` Z. 204–210 |
| Letzter Free Spin | keine eigene Regel. Nur Darstellung: in den letzten zwei Spins dunklere Umgebung, pulsierender Zähler, Ton | `presenter.ts` (`lastSpins`), `hud.ts` |
| Abschlusstafel | gespielte Free Spins, Gesamtgewinn, höchster Multiplikator, Siegel, Hinweis auf Rückkehr | `presenter.ts` (`roundEnded`) |

Kennzahlen (Bericht Z. 100–110): Free Spins 1 in 222,1 Runden; im Mittel 8,21 Spins je Feature;
mittlerer Feature-Gewinn inklusive Finale 67,90× Einsatz (Standardabweichung 212,44×); End-Base-Camp
1/2/3 in 21,6 % / 30,6 % / 47,8 %; Siegel 0/1/2/3 in 87,0 % / 11,2 % / 1,6 % / 0,2 % der Features.

**Präsentationsfassung:** Free Spins beginnen nie bei null. Das Base Camp hält den Fortschritt,
Keys schieben es höher, der Sonnenbonus wächst über das ganze Feature, und Siegel führen in ein
Finale mit grösserem Hauptschatz.

## 4. Temple Bonus

**Ablauf**

1. Auslöser: Station 5 in der Basisrunde (Temple Bonus) oder mindestens ein Siegel nach den Free
   Spins (Temple Finale).
2. Die Engine zieht drei Preise unabhängig aus der Preistabelle, höchstens ein Hauptschatz, und
   mischt sie auf die Kammern (`round.ts` Z. 232–250). Der Client kennt die Inhalte erst nach
   der Wahl.
3. Eintritt: Das Sun Relic steigt über dem Spielfeld auf (nur Basisrunde), Lichtwischer, eigene
   Szene mit drei Toren (Sonnen-, Jade-, Mondkammer).
4. Der Spieler öffnet **eine** Kammer. Der Preis wird gutgeschrieben, ohne Multiplikator.
5. Bei «Relic Bonus» (25× Einsatz) darf eine weitere Kammer geöffnet werden, solange eine
   geschlossen ist (`round.ts` Z. 176–177).
6. Bei «Free Spins» (nur Basisrunde) folgen 8 Free Spins ab Base Camp 2.
7. Die übrigen Kammern werden aufgedeckt und als «nicht gewählt» gekennzeichnet; weiter mit
   Tippen oder nach 8 Sekunden.
8. Rückkehr: nach dem Bonus der Basisrunde in die Basisrunde bzw. in die Free Spins; nach dem
   Finale endet die Runde.

**Preistabellen** (Wert × Einsatz; Gewicht in Klammern; Konfig. Z. 169–320)

| Preis | Basisrunde | Finale 1 Siegel | Finale 2 Siegel | Finale 3 Siegel |
|---|---|---|---|---|
| Schatz | 7 (300) · 14 (240) · 30 (150) · 56 (80) · 140 (30) | 10 (300) · 20 (240) · 40 (240) · 80 (80) · 200 (30) | 10 (150) · 20 (220) · 40 (200) · 80 (140) · 200 (70) | 20 (150) · 40 (220) · 80 (200) · 200 (130) |
| Relic Bonus (+ weitere Kammer) | 25 (100) | 25 (100) | 25 (120) | 25 (150) |
| Free Spins (8, Base Camp 2) | (90) | – | – | – |
| Hauptschatz | 2 500 (10) | 2 500 (10) | 5 000 (20) | 10 000 (30) |
| Summe der Gewichte | 1000 | 1000 | 920 | 880 |
| Erwartungswert, exakt berechnet | 50,971× | 63,360× | 174,954× | 476,347× |
| Mittelwert der Simulation | 50,826× | 63,034× | 176,550× | 454,174× |

Erwartungswerte: Bericht Z. 112–121. Der simulierte Wert bei drei Siegeln liegt tiefer, weil die
Kappung bei 10 000× dort greift (`docs/publisher/02_MATH_DOCUMENTATION.md` Z. 118).
Häufigkeit: Temple Bonus in der Basisrunde 1 in 326,1 Runden; Finale in 13,0 % der Free-Spin-Features
(abgeleitet aus den Siegel-Anteilen).

Multiplikatoren im Bonus: **keine.** T und S wirken nur auf Clustergewinne.

## 5. Weitere Funktionen

| Funktion | Beschreibung | Quelle |
|---|---|---|
| Feature-Kauf | 58× Einsatz, 8 Free Spins ab Base Camp 1, Bestätigungsdialog mit Preis und RTP-Angabe | Konfig. Z. 326–331; `game-scene.ts` (`confirmBuy`) |
| Autoplay | 10 Runden, jederzeit abbrechbar | `game-scene.ts` (`AUTO_ROUNDS`) |
| Tempo | Normal / Fast / Skip; ändert nur die Darstellung, nie das Ergebnis | `timing.ts`; `tools/e2e/timing.cjs` |
| Verlauf und Wiedergabe | letzte 50 Runden mit Seed; jede Runde bitgenau wiederholbar | `game-service.ts` Z. 18–27, 153–159 |
| Präsentationsmodus | vier vorbereitete Seeds, gekennzeichnet, Guthaben unberührt | `game-scene.ts` (`DEMO_ROUNDS`, `runDemo`) |
| Regeln im Spiel | Regeln, Auszahlungen, Verlauf, Leistung, Einstellungen; Deutsch und Englisch | `rules-text.ts`, `ui/info-panel.ts` |
| Barrierearme Optionen | reduzierte Bewegung (Systemeinstellung), Effektstufe, Lautstärke | `env.ts`, `fx.ts` |

## 6. Status je Feature

| Feature | Logik | Darstellung | Ton | Geprüft |
|---|---|---|---|---|
| Cluster, Kaskaden, Wild, Explorer | vollständig | vollständig | vorhanden, nicht angehört | automatische Tests, Simulation, Browser (Chromium) |
| Expedition Track, fünf Stationen | vollständig | vollständig | vorhanden, nicht angehört | wie oben |
| Sonnenbonus / Sun Relic | vollständig | vollständig (eigenes Artefaktbild seit 25.11.) | vorhanden, nicht angehört | wie oben |
| Free Spins, Retrigger, Base Camp, Siegel | vollständig | vollständig | vorhanden, nicht angehört | wie oben |
| Temple Bonus und Finale | vollständig | vollständig | vorhanden, nicht angehört | wie oben; exakte Erwartungswerte |
| Feature-Kauf | vollständig | vollständig | – | Tests; Simulation bei abweichendem Preis (siehe `05`) |
| Symbolanimationen (Einzelbilder) | – | **nicht vorhanden** (Standbilder mit Licht- und Bewegungseffekten) | – | – |
| Dschungel-Atmosphäre | – | – | **nicht vorhanden** | – |
| Jackpot, Gamble, Bonus-Wetten, Turniere | **nicht vorhanden**, nicht geplant | – | – | – |
| Wiederaufnahme unterbrochener Runden | **nicht vorhanden** (braucht Server) | – | – | – |
