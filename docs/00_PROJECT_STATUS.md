# 00 – Projektstatus (zentrales Register)

Stand: 2026-11-24

Statusstufen: `NOT STARTED` · `IN PROGRESS` · `IMPLEMENTED` · `TESTED` · `VALIDATED` · `APPROVED`

Für Dokumente bedeutet `IMPLEMENTED` «fertig geschrieben, wartet auf Freigabe».

## 1. Fortschrittsbericht Nr. 3 – Mathematik abgestimmt, Abnahmelauf bestanden

**Freigaben:** Phase 1 samt CR-01 bis CR-08 am 2026-11-23 («Alles gut»). Fortschrittsbericht Nr. 2 mit den offenen Fragen 1–3 wurde am 2026-11-24 mit «Weiter» beantwortet; das wurde als Zustimmung zu CR-09 (Trittsteine), zum Trefferfrequenz-Ziel 30–35 % und zur höheren Volatilität gewertet. Diese Auslegung kann jederzeit widerrufen werden.

**Seit Bericht Nr. 2 umgesetzt:**
- Kandidat v0.3: höhere Volatilität (eigene Relic-Werte in Free Spins, grössere Schätze, steilere Auszahlungstabelle), Obergrenze 10 000× wird jetzt erreicht.
- Unabhängige Python-Zweitimplementierung (`tools/reference/`). Differenztest: identische Rundenergebnisse über 1,1 Mio. Runden (v0.3.0), 100 000 Runden mit featurereicher Testkonfiguration und je 200 000 Runden für v0.3.1 und v0.3.2. Der Code der Engine ist seit dem 1,1-Mio.-Test unverändert; geändert wurden nur Parameter.
- RTP-Abnahmekriterium geändert und begründet (Dokument 04, Abschnitt 1.1).

**Verlauf der grossen Läufe** (Berichte in `docs/math/reports/`):

| Version | Runden | RTP | 95 %-Intervall | Ergebnis |
|---|---|---|---|---|
| v0.3.0 | 1 Mrd. | 95,850 % | 95,719–95,980 | Band verfehlt → zwei Schatzpreise angehoben |
| v0.3.1 | 2 Mrd. | 96,107 % | 96,014–96,200 | Band um 0,007 verfehlt → ein Schatzpreis gesenkt |
| **v0.3.2** | 2 Mrd. | **95,995 %** | 95,902–96,088 | **Kriterium erfüllt** |

Die Anpassungen betrafen jeweils nur Schatzpreise des Temple Bonus der Basisrunde; ihre Wirkung wurde vorab exakt berechnet.

**Abnahmelauf v0.3.2** (2 Mrd. Runden, Seed 20261126, Konfigurations-Hash 3161a5c31027ea3a):

| Kennzahl | Gemessen | Kriterium | |
|---|---|---|---|
| RTP (Punktschätzung) | 95,995 % | 96,00 ± 0,10 % | ✓ |
| Halbe Breite 95 %-Intervall | 0,093 Prozentpunkte | ≤ 0,10 | ✓ |
| Basis / Temple Bonus / Free Spins inkl. Finale | 49,84 / 15,59 / 30,57 % | 50 / 16 / 30 % ± 3 | ✓ |
| Trefferfrequenz | 32,8 % | 30–35 % | ✓ |
| Free Spins über Compass | 1 in 238 | 1 in 150–250 | ✓ |
| Temple Bonus (Basisrunde) | 1 in 326 | 1 in 250–450 | ✓ |
| Obergrenze 10 000× erreicht | 659-mal (1 in 3,03 Mio.) | erreichbar, seltener als 1 in 1 Mio. | ✓ |
| Gewinn über der Obergrenze | 0 | 0 | ✓ |
| Kaskadenlimit erreicht | 0 (längste Folge 23) | 0 | ✓ |
| Standardabweichung je Runde | 21,1× Einsatz | «hoch», ausgewiesen | ✓ |
| Temple Bonus Basis: exakt / simuliert | 50,971× / 50,826× (6,1 Mio. Boni) | Übereinstimmung | ✓ |

**Einschränkungen (ehrlich ausgewiesen):**
- Alle Werte sind **simuliert, nicht zertifiziert**. Kein Prüflabor hat die Mathematik gesehen.
- Der Standardfehler aus Batch-Means (100 Blöcke) beträgt 0,054 statt analytisch 0,047 Prozentpunkte; damit wäre die halbe Intervallbreite 0,105. Die Batch-Schätzung ist bei 100 Blöcken und schwerer Verteilung selbst ungenau (im v0.3.1-Lauf lag sie unter dem analytischen Wert); das Kriterium wurde mit dem analytischen Wert geprüft.
- Die im Mathematikplan vorgesehene vollständige Enumeration von Miniaturrastern ist **nicht durchgeführt**. Die Korrektheit der Engine stützt sich auf Tests, Ereignisprüfer und Zweitimplementierung.
- Das Finale mit drei Siegeln liegt simuliert unter dem exakten Erwartungswert (454× statt 476×), weil die Gewinnobergrenze Auszahlungen abschneidet; der abgeschnittene RTP-Anteil ist noch nicht separat ausgewiesen.
- Die Auszahlungstabelle ist funktional abgestimmt, aber nicht auf «schöne» Werte geglättet. Weitere RTP-Varianten (94 %, 92 %) sind nicht abgeleitet.
- Vor dem bestandenen Lauf gab es zwei verfehlte Läufe mit Nachjustierung. Der bestandene Lauf ist ein unabhängiger Lauf mit neuem Seed auf der unveränderten Endkonfiguration.

**Zur Freigabe vorgelegt: Meilenstein M3** – Mathematik VALIDATED nach den Kriterien aus Dokument 04, Konfiguration v0.3.2 einfrieren. Danach beginnt Phase 4 (Phaser-Client).

## 2. Dokumente

| Dokument | Status |
|---|---|
| 01 Konzept-Review | IMPLEMENTED |
| 02 GDD v1.1 | IMPLEMENTED |
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
| F-13 | Mathematische Abstimmung auf 96,00 % | Mathematikplan 7 | VALIDATED (simuliert, v0.3.2; Freigabe M3 offen) |
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
| D-012 | Trittsteine 1/2/4/6/9 (CR-09) | Messung: Tempel sonst jeden 50.–80. Spin | freigegeben («Weiter», 2026-11-24) |
| D-013 | Jeder Relic Bonus gibt eine weitere Kammer; Preise werden auf die Kammern gemischt; Finale ohne Free-Spin-Preis | Präzisierungen aus der Implementierung (GDD v1.0.1) | umgesetzt, zur Kenntnis |
| D-014 | Worker-Seeds per SplitMix64 statt Xoshiro-Jump | einfacher, gleichwertig für den Zweck | umgesetzt |
| D-015 | Höhere Volatilität: eigene Relic-Werte in Free Spins, grössere Schätze; Ziel-Aufteilung 50 / 16 / 30 %, Trefferfrequenz 30–35 % | v0.2 war nur mittel volatil, Obergrenze nie erreicht | als freigegeben gewertet («Weiter») |
| D-016 | RTP-Kriterium: Punktschätzung 96,00 ± 0,10 % und halbe Intervallbreite ≤ 0,10 | altes Kriterium bei σ ≈ 21× praktisch unerfüllbar | umgesetzt, zur Kenntnis |
| D-017 | Feinabstimmung des RTP nur über Schatzpreise des Temple Bonus (v0.3.0 → v0.3.2) | Wirkung exakt vorab berechenbar, keine Regeländerung | umgesetzt |

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

1. **Meilenstein M3 freigeben?** Konfiguration v0.3.2 einfrieren und mit dem Client (Phase 4) beginnen.
2. Wer erstellt die Grafik, und wie viele Stunden pro Woche stehen zur Verfügung?
3. Feature-Kauf: weiterhin als «nein» angenommen. Einverstanden?

## 7. Fehlerregister

| ID | Fehler | Behebung | Status |
|---|---|---|---|
| B-001 | GDD: Bronze-Finale hätte Free Spins vergeben können, im Widerspruch zu 7.4 | eigene Finale-Tabelle ohne Free-Spin-Preis; Konfigurationsprüfung verbietet ihn | behoben, getestet |
| B-002 | GDD: Kammern wären ohne Mischen nicht gleichwertig (Hauptschatz-Regel) | Mischen nach der Ziehung | behoben, getestet |
