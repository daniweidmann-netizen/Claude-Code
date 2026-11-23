# 00 – Projektstatus (zentrales Register)

Stand: 2026-11-23

Statusstufen: `NOT STARTED` · `IN PROGRESS` · `IMPLEMENTED` · `TESTED` · `VALIDATED` · `APPROVED`

Für Dokumente bedeutet `IMPLEMENTED` «fertig geschrieben, wartet auf Freigabe».

## 1. Fortschrittsbericht Nr. 1 – Abschluss Phase 1

**Erledigt:** kritisches Konzept-Review, vollständige Spielregeln, GDD v1.0, technische Architektur, mathematischer Modellierungsplan, priorisierte Aufgabenliste, Zeit- und Budgetplan.

**Tatsächlich gerechnet:** eine einzige explorative Simulation (Erstfall-Clusterhäufigkeit, 300 000 Raster je Konfiguration, fester Seed), die CR-01 begründet.

**Nicht erledigt:** Es gibt keinen Spielcode, keine Engine, keine RTP-Messung, keine Grafik, kein Audio. Alle Gewichte, Auszahlungen und Preistabellen im GDD sind ungeprüfte Startwerte. Die Angaben zu Provider-Programmen sind nicht aktuell recherchiert.

**Nächster Schritt:** Freigabe von Phase 1 und Entscheidung über CR-01 bis CR-08; danach Start Phase 2 (T-001 ff.).

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
| F-01 | Raster 6×5, Füllen, Schwerkraft | GDD 3 | NOT STARTED |
| F-02 | Clustererkennung und Auszahlung | GDD 3.2, 4.2 | NOT STARTED |
| F-03 | Kaskaden mit Limit | GDD 3.3, 3.4 | NOT STARTED |
| F-04 | Expedition Track und Stationen | GDD 5 | NOT STARTED |
| F-05 | Multiplikator M = T + S | GDD 5.3 | NOT STARTED |
| F-06 | Temple Bonus | GDD 6 | NOT STARTED |
| F-07 | Free Spins mit Base Camp | GDD 7 | NOT STARTED |
| F-08 | Temple Finale | GDD 7.4 | NOT STARTED |
| F-09 | Gewinnobergrenze 10 000× | GDD 3.4 | NOT STARTED |
| F-10 | RNG | Architektur 5 | NOT STARTED |
| F-11 | Ereignisprotokoll / Wiedergabe | Architektur 4 | NOT STARTED |
| F-12 | Simulator und Berichte | Mathematikplan 4 | NOT STARTED |
| F-13 | Mathematische Abstimmung auf 96,00 % | Mathematikplan 7 | NOT STARTED |
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
| D-001 | Mindestcluster 5 statt 8 (CR-01) | Voruntersuchung: ~7 % Trefferfrequenz bei 8 | vorgeschlagen |
| D-002 | Track setzt je bezahltem Spin zurück (CR-02) | unabhängige Runden, kein gespeicherter Zustand | vorgeschlagen |
| D-003 | Explorer und Sun Relic nur über Stationen (CR-03) | Lesbarkeit, klare Rollen | vorgeschlagen |
| D-004 | Temple Bonus als echte Auswahl (CR-04) | keine irreführende Inszenierung | vorgeschlagen |
| D-005 | Maximalgewinn 10 000×, Kaskadenlimit 50 (CR-05) | belegbare Obergrenze und Terminierung | vorgeschlagen |
| D-006 | Engine als UI-freies Modul mit Ereignisprotokoll (CR-06) | Client austauschbar, RGS-fähig | vorgeschlagen |
| D-007 | Asset-Register ab dem ersten Asset (CR-07) | Rechtekette für den IP-Verkauf | vorgeschlagen |
| D-008 | Keine Spine-/Rive-Lizenz im Prototyp (CR-08) | Budget | vorgeschlagen |
| D-009 | Unabhängige gewichtete Symbolziehung statt Walzenstreifen | wenige Parameter, exakte Teilrechnungen | vorgeschlagen |
| D-010 | Kein steigender Kaskadenmultiplikator, keine frei fallenden Multiplikatorsymbole | Eigenständigkeit gegenüber bekannten Titeln | vorgeschlagen |
| D-011 | RTP per Simulation mit Konfidenzintervall, abgesichert durch exakte Teilrechnungen und Zweitimplementierung | geschlossene Berechnung nicht möglich | vorgeschlagen |

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

1. Werden CR-01 bis CR-08 freigegeben (insbesondere CR-01 Mindestcluster 5 und CR-02 Track-Reset)?
2. Wie viele Stunden pro Woche stehen zur Verfügung, und wer erstellt die Grafik (Eigenleistung in Blender, KI-unterstützt mit Nachbearbeitung, oder Mischung)?
3. Soll ein Feature-Kauf als abschaltbare Option vorgesehen werden?
4. Ist die Zielvolatilität «hoch» mit 10 000× Maximalgewinn gewünscht?

## 7. Fehlerregister

Noch keine Einträge (kein Code vorhanden).
