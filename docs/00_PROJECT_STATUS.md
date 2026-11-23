# 00 – Projektstatus (zentrales Register)

Stand: 2026-11-23

Statusstufen: `NOT STARTED` · `IN PROGRESS` · `IMPLEMENTED` · `TESTED` · `VALIDATED` · `APPROVED`

Für Dokumente bedeutet `IMPLEMENTED` «fertig geschrieben, wartet auf Freigabe».

## 1. Fortschrittsbericht Nr. 2 – Engine, Tests, Simulator, erster Abstimmungskandidat

**Freigabe:** Phase 1 samt CR-01 bis CR-08 wurde am 2026-11-23 freigegeben («Alles gut»). Zu den offenen Fragen 2–4 gab es keine Antwort; angenommen sind hohe Volatilität mit 10 000× Obergrenze und kein Feature-Kauf.

**Implementiert und getestet (28 automatisierte Tests, alle grün):**
- Engine ohne UI-Abhängigkeit: RNG, Raster, Cluster, Kaskaden, Expedition Track, Temple Bonus mit echter Auswahl, Free Spins mit Base Camp und Finale, Gewinnobergrenze, Ereignisprotokoll.
- Tests: RNG gegen veröffentlichte Referenzwerte und eine BigInt-Referenz; Chi-Quadrat-Tests; geskriptete Runden für jeden Feature-Pfad; 12 000 Zufallsrunden, deren Ereignisprotokoll ein unabhängig geschriebener Prüfer (Union-Find statt Flood-Fill) Regel für Regel nachrechnet; Determinismus; Terminierung.
- Simulator: parallel, reproduzierbar (Seed, Strom, Rundenindex), rund 490 000 Runden/s auf 4 Kernen; exakte Bonus-Erwartungswerte als Kontrollgrösse.

**Messergebnisse** (Berichte in `docs/math/reports/`):

| | GDD-Startwerte v0.1 (20 Mio. Runden) | Kandidat v0.2 (400 Mio. Runden) | Ziel |
|---|---|---|---|
| RTP | 1 721,95 % | **95,98 %** (95 %-Intervall 95,86–96,10) | 96,00 % |
| Basis / Temple Bonus / Free Spins inkl. Finale | – | 56,93 / 12,81 / 26,24 % | 56 / 12 / 28 % |
| Trefferfrequenz | 43,2 % | 32,7 % | 22–30 % ✗ |
| Free Spins über Compass | 1 in 273 | 1 in 190 | 1 in 150–250 |
| Temple Bonus (Basisrunde) | 1 in 6,8 | 1 in 334 | 1 in 250–450 |
| Standardabweichung je Runde | 153× | 12,2× | «hoch» ✗ (eher mittel) |
| Höchster Gewinn im Lauf | – | 6 308× (Obergrenze nie erreicht) | 10 000× erreichbar ✗ |
| Kaskadenlimit erreicht | 0 | 0 (längste Folge: 22) | 0 |

Temple-Bonus-Mittelwerte der Simulation stimmen mit der exakten Rechnung überein (Basisrunde: exakt 42,862×, simuliert 42,728× bei 1,2 Mio. Boni).

**Wichtige Einschränkungen:**
- Kandidat v0.2 beruht auf **CR-09 (Trittsteine)**, einer noch nicht freigegebenen Regeländerung. Mit der freigegebenen Regel ist das Ziel «Temple Bonus 1 in 250–450» nicht erreichbar (gemessen 1 in 52–78 ohne Keys).
- Die Mathematik ist **nicht VALIDATED**: Das Abnahmekriterium (Intervall vollständig in 95,90–96,10 %) ist knapp verfehlt, die Python-Zweitimplementierung fehlt, drei Zielwerte sind verfehlt (siehe ✗).
- Die Free-Spin-Tabelle für Relic-Werte ist noch identisch mit der Basisrunde.

**Nächste Schritte:** Entscheidung CR-09 · Volatilität und Maximalgewinn nachschärfen · Zweitimplementierung · Abnahmelauf · danach Client (Phase 4).

## 2. Dokumente

| Dokument | Status |
|---|---|
| 01 Konzept-Review | IMPLEMENTED |
| 02 GDD v1.0 | IMPLEMENTED |
| 03 Technische Architektur | IMPLEMENTED |
| 04 Mathematischer Modellierungsplan | IMPLEMENTED |
| 05 Backlog & Roadmap | IMPLEMENTED |

## 3. Feature-Register

| ID | Feature | Spezifikation | Status |
|---|---|---|---|
| F-01 | Raster 6×5, Füllen, Schwerkraft | GDD 3 | TESTED |
| F-02 | Clustererkennung und Auszahlung | GDD 3.2, 4.2 | TESTED |
| F-03 | Kaskaden mit Limit | GDD 3.3, 3.4 | TESTED |
| F-04 | Expedition Track und Stationen | GDD 5 | TESTED |
| F-05 | Multiplikator M = T + S | GDD 5.3 | TESTED |
| F-06 | Temple Bonus | GDD 6 | TESTED |
| F-07 | Free Spins mit Base Camp | GDD 7 | TESTED |
| F-08 | Temple Finale | GDD 7.4 | TESTED |
| F-09 | Gewinnobergrenze 10 000× | GDD 3.4 | TESTED |
| F-10 | RNG | Architektur 5 | TESTED |
| F-11 | Ereignisprotokoll / Wiedergabe | Architektur 4 | TESTED |
| F-12 | Simulator und Berichte | Mathematikplan 4 | TESTED |
| F-13 | Mathematische Abstimmung auf 96,00 % | Mathematikplan 7 | IN PROGRESS |
| F-14 | Client: Raster und Kaskaden | GDD 9 | NOT STARTED |
| F-15 | Client: Expedition Track | GDD 9 | NOT STARTED |
| F-16 | Client: UI, Demo-Guthaben, Historie | GDD 9 | NOT STARTED |
| F-17 | Client: Temple Bonus und Free Spins | GDD 6, 7 | NOT STARTED |
| F-18 | Art Assets | GDD 10 | NOT STARTED |
| F-19 | Audio | GDD 11 | NOT STARTED |
| F-20 | Barrierefreiheit / reduzierte Bewegung | GDD 9.4 | NOT STARTED |
| F-21 | B2B-Verkaufspaket | Backlog Phase 7 | NOT STARTED |

## 4. Entscheidungsregister

| ID | Entscheidung | Begründung | Status |
|---|---|---|---|
| D-001 | Mindestcluster 5 statt 8 (CR-01) | Voruntersuchung: ~7 % Trefferfrequenz bei 8 | freigegeben |
| D-002 | Track setzt je bezahltem Spin zurück (CR-02) | unabhängige Runden, kein gespeicherter Zustand | freigegeben |
| D-003 | Explorer und Sun Relic nur über Stationen (CR-03) | Lesbarkeit, klare Rollen | freigegeben |
| D-004 | Temple Bonus als echte Auswahl (CR-04) | keine irreführende Inszenierung | freigegeben |
| D-005 | Maximalgewinn 10 000×, Kaskadenlimit 50 (CR-05) | belegbare Obergrenze und Terminierung | freigegeben |
| D-006 | Engine als UI-freies Modul mit Ereignisprotokoll (CR-06) | Client austauschbar, RGS-fähig | freigegeben |
| D-007 | Asset-Register ab dem ersten Asset (CR-07) | Rechtekette für den IP-Verkauf | freigegeben |
| D-008 | Keine Spine-/Rive-Lizenz im Prototyp (CR-08) | Budget | freigegeben |
| D-009 | Unabhängige gewichtete Symbolziehung statt Walzenstreifen | wenige Parameter, exakte Teilrechnungen | freigegeben |
| D-010 | Kein steigender Kaskadenmultiplikator, keine frei fallenden Multiplikatorsymbole | Eigenständigkeit gegenüber bekannten Titeln | freigegeben |
| D-011 | RTP per Simulation mit Konfidenzintervall, abgesichert durch exakte Teilrechnungen und Zweitimplementierung | geschlossene Berechnung nicht möglich | freigegeben |
| D-012 | Trittsteine 1/2/4/6/9 (CR-09) | Messung: Tempel sonst jeden 50.–80. Spin | **vorgeschlagen** |
| D-013 | Jeder Relic Bonus gibt eine weitere Kammer; Preise werden auf die Kammern gemischt; Finale ohne Free-Spin-Preis | Präzisierungen aus der Implementierung (GDD v1.0.1) | umgesetzt, zur Kenntnis |
| D-014 | Worker-Seeds per SplitMix64 statt Xoshiro-Jump | einfacher, gleichwertig für den Zweck | umgesetzt |

## 5. Risikoregister

| ID | Risiko | Stufe | Massnahme |
|---|---|---|---|
| R-01 | Grosse Provider kaufen selten externe Spiele | hoch | Fokus auf Partnerprogramme und Lizenzierung; Recherche T-501 |
| R-02 | Rechtekette bei KI-unterstützten Assets | hoch | Asset-Register, menschliche Bearbeitung dokumentieren, rechtliche Prüfung vor Vertrag |
| R-03 | Free Spins mathematisch zu stark | mittel | isolierte Simulation, definierte Stellschrauben |
| R-04 | Grafikqualität in Eigenleistung unter Premium-Niveau | hoch | zwei Referenzsymbole als frühes Qualitätstor (T-103) |
| R-05 | Name bereits als Marke oder Spieltitel belegt | mittel | Markenrecherche T-508 in Woche 2 |
| R-06 | Zeitplan zu knapp | mittel | Stufe A klar abgegrenzt, 14 statt 12 Wochen eingeplant |
| R-07 | Simulationsgeschwindigkeit | niedrig | früh messen, parallelisieren |

## 6. Offene Fragen an den Auftraggeber

1. **CR-09 freigeben?** Trittsteine (Stationen nach 1/2/4/6/9 Schritten) oder die bisherige Regel mit häufigem, kleinem Temple Bonus.
2. Trefferfrequenz: Ziel auf 30–35 % anheben (gemessen 32,7 %) oder durch andere Mittel senken?
3. Volatilität: gemessen eher mittel. Soll sie erhöht werden (höhere Relic-Werte in Free Spins, grössere Hauptschätze), damit 10 000× erreichbar wird?
4. Wer erstellt die Grafik, und wie viele Stunden pro Woche stehen zur Verfügung?

## 7. Fehlerregister

| ID | Fehler | Behebung | Status |
|---|---|---|---|
| B-001 | GDD: Bronze-Finale hätte Free Spins vergeben können, im Widerspruch zu 7.4 | eigene Finale-Tabelle ohne Free-Spin-Preis; Konfigurationsprüfung verbietet ihn | behoben, getestet |
| B-002 | GDD: Kammern wären ohne Mischen nicht gleichwertig (Hauptschatz-Regel) | Mischen nach der Ziehung | behoben, getestet |
