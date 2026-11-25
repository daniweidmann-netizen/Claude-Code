# 08 – QA and Test Report

Stand: 25.11.2026 · Alle Ergebnisse stammen aus Läufen des Entwicklers. **Keine externe QA.**

## 1. Automatische Tests (Vitest) – 86 Tests, 86 bestanden, 0 fehlgeschlagen

Zuletzt ausgeführt am 25.11.2026 (`npm test`).

| Datei | Tests | Prüft |
|---|---|---|
| `tests/unit/rng.test.ts` | 7 | Zufallsgenerator: Referenzwerte, Ströme, Gleichverteilung der Ganzzahlen, Gewichtstabelle |
| `tests/unit/grid-clusters.test.ts` | 10 | Clustersuche (mindestens 5, keine Diagonalen, Wilds in mehreren Clustern), Schwerkraft, Konfigurationsprüfung |
| `tests/unit/frozen-config.test.ts` | 2 | Konfiguration 1.0.0: Prüfsumme, Gleichheit mit der JSON-Datei |
| `tests/integration/round.test.ts` | 9 | Rundenablauf mit vorgegebenen Ziehungen: Stationen, Multiplikator, Free Spins, Bonus, Feature-Kauf |
| `tests/integration/cluster-rule.test.ts` | 2 | 4000 echte Runden: jeder ausgezahlte Cluster ≥ 5, nur über Kanten verbunden, vollständig |
| `tests/integration/session.test.ts` | 5 | Guthabenführung, Verlauf, bitgenaue Wiedergabe |
| `tests/property/round.property.test.ts` | 7 | zufällige Runden in mehreren Konfigurationen: jedes Ereignisprotokoll regelkonform, Kappung, Obergrenzen |
| `tests/unit/layout.test.ts` | 32 | Layout in vielen Formaten: nichts ausserhalb, keine Überlappung, Mindestgrössen |
| `tests/unit/rules-text.test.ts` | 7 | Regeltexte nennen die Werte der Konfiguration |
| `tests/unit/timing.test.ts` | 3 | Tempo-Tabelle und Mindestzeiten |
| `tests/unit/perf.test.ts` | 2 | Bildraten-Messung |

## 2. Browser-Tests (Playwright, Chromium ohne Grafikkarte)

| Lauf | Inhalt | Ergebnis | Datum |
|---|---|---|---|
| Volltest `tools/e2e/smoke.cjs` | 6 Formate (393×852, 1280×720, 360×640 mit reduzierter Bewegung, 375×667 deutsch, 852×393, 393×852 bei Pixelverhältnis 3), 102 Runden, 9 Bonusrunden und 15 Kammerwahlen über die Oberfläche; prüft Konsolenfehler, geladene Bilder, Raster = Ereignisprotokoll, Verzerrung, Überlappung, Buchführung, Rückkehr der Kulisse | **1. Lauf fehlgeschlagen** (Free-Spins-Zähler überlappte im Querformat die Tempo-Knöpfe), behoben, **2. Lauf bestanden** | 25.11.2026 |
| `tools/e2e/final.cjs` | Titelbildschirm und Layout in 5 Formaten (360×640, 430×932, 768×1024, 1366×768, 1920×1080); Walzenwechsel ohne leeres Feld (mind. 28 von 30 Symbolen, 481 Bilder); Präsentationsmodus | bestanden | 25.11.2026 |
| Langzeittest `tools/e2e/soak.cjs` | 300 Runden, Speicher und Objektzahl | bestanden (18,9–19,8 MB, 47 Objekte) – **auf dem Build vor dem Sun-Relic-Bild, danach nicht wiederholt** | 25.11.2026 |
| Zeitmessung `tools/e2e/timing.cjs` | drei Tempo-Modi, zwei Formate, gleiche Seeds | bestanden; Gewinne identisch – **ebenfalls vor dem Sun-Relic-Bild** | 25.11.2026 |

## 3. Mathematische Prüfungen

Siehe `05_Math_Overview.md` Abschn. 6: Simulationen bis 2 Mrd. Runden, exakte Teilrechnungen,
Zweitimplementierung (zuletzt 80 000 Runden identisch am 25.11.2026).

## 4. Geforderte Einzelprüfungen

| Prüfpunkt | Wie geprüft | Ergebnis |
|---|---|---|
| Mindestcluster 5 | Konfiguration, Einzeltests, 4000 echte Runden, Zweitimplementierung | bestätigt |
| Gewinnberechnung | Integrations- und Eigenschaftstests; Buchführung im Browser-Test | bestanden |
| Kaskaden | Eigenschaftstests; Raster = Ereignisprotokoll in jeder Browser-Runde | bestanden |
| Expedition-Fortschritt | Integrationstests mit vorgegebenen Ziehungen; Eigenschaftstests | bestanden |
| SUN-Mechanik | Integrationstests (Relikt, Multiplikator); Simulation | bestanden |
| Free Spins | Tests und Browser (Zähler lückenlos, Kulisse zurück) | bestanden |
| Retrigger | Eigenschaftstests (Obergrenze 30); Zusatzlauf 100 Mio. Runden | bestanden; Häufigkeit 1,36 % der Features |
| Temple Bonus | Tests; 9 Bonusrunden über die Oberfläche; exakte Erwartungswerte | bestanden |
| Geschwindigkeitsmodi | Zeitmessung; Moduswechsel mitten im Feature; sechsfaches Tippen startet keinen zweiten Spin | bestanden (Chromium) |
| Sound | nur: Dateien laden, kein Fehler | **Wirkung NICHT geprüft – nie angehört** |
| Mobile Spielfeldübergänge | Messung im Handyformat im Testbrowser | bestanden; **auf echtem Gerät NICHT geprüft** |

## 5. Nicht ausgeführte Tests

| Test | Status |
|---|---|
| Echte Geräte (iPhone/Safari, Android/Chrome, Tablets) | **nicht ausgeführt.** Der Eigentümer hat die Demo auf einem iPhone 15 Pro geöffnet und Rückmeldung zum Tempo gegeben; eine Prüfliste (`docs/08_DEVICE_TEST_CHECKLIST.md`) ist nicht abgearbeitet |
| Safari und Firefox am Desktop | nicht ausgeführt |
| Hörprüfung | nicht ausgeführt |
| Bildrate und Ladezeit auf Hardware / im Mobilfunknetz | nicht ausgeführt |
| Statistische Testbatterie des Zufallsgenerators | nicht ausgeführt |
| Unabhängige Prüfung, Zertifizierung | nicht ausgeführt |
| Spielertest (Verständlichkeit) | nicht ausgeführt |
| Barrierefreiheit (Screenreader, Farbfehlsichtigkeit) | nicht ausgeführt |
| Last-, Sicherheits-, Integrations-Tests | nicht anwendbar (kein Server) |

## 6. Fehler

**Behoben** (Auswahl; vollständig in `docs/publisher/06_QA_REPORT.md` Abschn. 3): Preistabellen-Regel
im Finale (B-001), Gleichwertigkeit der Kammern (B-002), gestauchte Symbole (U-01), Symbole
oberhalb des Felds (U-02), verdeckte Beschriftung (U-03), leere Felder in Kaskaden (U-05),
leeres Spielfeld beim Walzenwechsel, Überlappung des Free-Spins-Zählers im Querformat.

**Bekannt und offen:**

| Punkt | Schwere |
|---|---|
| Keine Bestätigung auf echten Geräten und in Safari | hoch |
| Ton ungeprüft; zwei Effekte kürzer als gewünscht; Musikschleifen nicht auf Taktgrenzen geschnitten | hoch |
| Einzeldatei-Fassung öffnet auf iPhone nicht | mittel |
| Auslieferung rund 5,6 MB | mittel |
| Rahmen rund 10 % gestaucht | niedrig |
| Kein kritischer Fehler in Spiellogik oder Buchführung bekannt | – |

**Widerspruch in den Unterlagen:** `docs/publisher/06_QA_REPORT.md` nannte bis 25.11.2026 «Full
browser suite not repeated on the final build». Das ist seit dem Volltest vom 25.11. überholt und
wurde dort korrigiert.
