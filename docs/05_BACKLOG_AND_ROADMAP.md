# 05 – Priorisierte Aufgabenliste und Entwicklungsplan

Stand: 2026-11-23 · Status: zur Freigabe vorgelegt

## 1. Die vier Entwicklungsstufen

| Stufe | Inhalt | Teil dieses Plans |
|---|---|---|
| **A – Präsentationsprototyp** | spielbare Demo mit validierter Mathematik, repräsentativer Grafik für Kernansichten, Verkaufsunterlagen | ja (Ziel der 12–14 Wochen) |
| **B – Technisch vollständiger Prototyp** | alle Features, vollständige Animationen und Audio, vollständige QA auf Zielgeräten | teilweise; Abschluss nach Stufe A |
| **C – Produktionsfertiger Client** | Provider-Framework, Lokalisierung, Markt-Konfigurationen, Lasttests | nein – gemeinsam mit oder durch den Lizenznehmer |
| **D – Zertifizierte Echtgeldintegration** | RGS, zertifizierter RNG, Laborprüfung je Markt | nein – Sache des Lizenznehmers |

## 2. Priorisierte Aufgaben

Priorität: **P0** blockiert alles Weitere · **P1** nötig für Stufe A · **P2** nötig für Stufe B · **P3** optional.

### Phase 2 – Engine und Mathematik

| ID | Aufgabe | Prio | Abhängig von |
|---|---|---|---|
| T-001 | Projekt aufsetzen (TypeScript strict, Vite, Vitest, ESLint, CI) | P0 | Freigabe Phase 1 |
| T-002 | Konfigurationsschema mit Validierung, `game-config.json` v0.1 | P0 | T-001 |
| T-003 | RNG (Xoshiro256**, verzerrungsfreie Ganzzahlen, gewichtete Auswahl) mit Referenztests | P0 | T-001 |
| T-004 | Raster, Schwerkraft, Nachfüllen | P0 | T-003 |
| T-005 | Clustererkennung mit Wild-Regeln | P0 | T-004 |
| T-006 | Auszahlung, Multiplikator, Gewinnobergrenze | P0 | T-005 |
| T-007 | Kaskadenschleife mit Limit | P0 | T-006 |
| T-008 | Expedition Track und Stationseffekte 1–5 | P0 | T-007 |
| T-009 | Temple Bonus (Preisziehung, echte Auswahl, Stufen) | P1 | T-008 |
| T-010 | Free Spins, Base Camp, Temple Finale | P1 | T-008 |
| T-011 | Ereignisprotokoll und Rundenzustandsautomat | P1 | T-008 |
| T-012 | Property-, Integration- und Golden-Tests | P1 | T-011 |
| T-013 | Simulator (parallel, reproduzierbar, Berichte) | P0 | T-007 |
| T-014 | Exakte Teilrechnungen (Bonus-Erwartungswert, Compass, Miniaturraster) | P1 | T-009 |
| T-015 | Abstimmung in Iterationen (Dokument 04, Abschnitt 7) | P1 | T-013 |
| T-016 | Python-Zweitimplementierung und Differenztest | P1 | T-010 |
| T-017 | Abnahmelauf und Mathematikdokument | P1 | T-015, T-016 |

### Phase 3 – Art Direction (läuft parallel zu Phase 2)

| ID | Aufgabe | Prio |
|---|---|---|
| T-101 | Styleguide: Palette, Licht-Setup, Materialien, Typografie | P1 |
| T-102 | Asset-Register anlegen (Herkunft, Werkzeug, Lizenz, Bearbeitung) | P0 |
| T-103 | Zwei Referenzsymbole final ausarbeiten (Jade Mask, Wild) als Qualitätsmassstab | P1 |
| T-104 | Übrige acht Symbole | P1 |
| T-105 | Hintergrund Basisrunde, Rasterrahmen, Expedition Track | P1 |
| T-106 | Hintergrund Free Spins, Temple-Bonus-Kammer | P2 |
| T-107 | UI-Kit (Schaltflächen, Anzeigen, Menüs) | P1 |
| T-108 | Logo und Key Art | P1 |

### Phase 4 – Client

| ID | Aufgabe | Prio |
|---|---|---|
| T-201 | Phaser-Grundgerüst, Skalierung Hoch-/Querformat, Ladebildschirm | P1 |
| T-202 | Rasterdarstellung und Fall-Animation aus Ereignissen | P1 |
| T-203 | Präsentations-Timeline (inkl. Überspringen) | P1 |
| T-204 | Expedition Track mit Stationseffekten | P1 |
| T-205 | Bedienleiste, Einsatz, Demo-Guthaben, Gewinnanzeige | P1 |
| T-206 | Temple-Bonus-Szene | P1 |
| T-207 | Free-Spin-Darstellung mit Base Camp und Siegeln | P1 |
| T-208 | Regeln/Auszahlungstabelle, Rundenhistorie mit Wiedergabe | P2 |
| T-209 | Autoplay (Demo), Einstellungen, reduzierte Bewegung | P2 |
| T-210 | Big-Win- und Maximalgewinn-Präsentation | P2 |

### Phase 5 – Animation und Audio

| ID | Aufgabe | Prio |
|---|---|---|
| T-301 | Symbolanimationen (Landung, Gewinn, Ruhe) | P2 |
| T-302 | Partikel, Lichtstrahlen, Shader-Effekte | P2 |
| T-303 | Sonnenmotiv und Atmosphären | P1 |
| T-304 | Effektklänge gemäss Ereignisliste | P2 |
| T-305 | Audio-Manager, Mischung, Lautstärkeregelung | P2 |

### Phase 6 – QA

| ID | Aufgabe | Prio |
|---|---|---|
| T-401 | QA-Plan und Testmatrix (Geräte, Browser) | P1 |
| T-402 | E2E-Tests und Bildvergleiche | P2 |
| T-403 | Leistungs- und Speichermessung | P2 |
| T-404 | Fehlerregister, Regressionstests je behobenem Fehler | P1 |

### Phase 7 – Verkaufspaket

| ID | Aufgabe | Prio |
|---|---|---|
| T-501 | Recherche Provider und Partnerprogramme mit Quellenangaben | P1 |
| T-502 | Game Fact Sheet (nur validierte Zahlen) | P1 |
| T-503 | USP- und Verkaufspräsentation | P1 |
| T-504 | Trailer (Bildschirmaufnahmen der Demo) | P2 |
| T-505 | IP-Dokumentation (Rechtekette, Asset-Register, Namensrecherche) | P1 |
| T-506 | Integrationskonzept und Lizenzmodelle | P1 |
| T-507 | Gehostete Demo mit Zugangsschutz | P1 |
| T-508 | Markenrecherche zum Namen «Temple of the Lost Sun» | P1 – früh erledigen |

## 3. Zeitplan

Der vorgegebene 12-Wochen-Plan wird in zwei Punkten angepasst: Mathematik und Engine werden gemeinsam entwickelt (die Simulation braucht die Engine), und Art läuft parallel statt davor. Realistisch sind 12 Wochen bei Vollzeit-Einsatz, sonst 14.

| Woche | Schwerpunkt | Meilenstein |
|---|---|---|
| 1 | Phase 1: Review, GDD, Architektur, Pläne | **M1** – Freigabe der Entwicklungsgrundlage ← *aktuell* |
| 2 | Projektaufsatz, RNG, Raster, Cluster · Styleguide, Asset-Register, Markenrecherche | – |
| 3–4 | Kaskaden, Expedition, Simulator, erste Abstimmung · Referenzsymbole | **M2** – Basisrunde simulierbar, erster Messbericht |
| 5–6 | Bonus, Free Spins, Abstimmung, Zweitimplementierung, Abnahmelauf · restliche Symbole | **M3** – Mathematik VALIDATED, Konfiguration eingefroren |
| 7–9 | Client: Raster, Timeline, Track, UI, Bonus, Free Spins | **M4** – vollständig spielbare Demo mit Platzhalter-Effekten |
| 10–11 | Animation, Audio, Hintergründe | **M5** – Präsentationsqualität der Kernansichten |
| 12 | QA, Fehlerbehebung, Leistungsmessung | **M6** – Stufe A abgeschlossen |
| 13–14 | Verkaufspaket, Provider-Recherche, gehostete Demo | **M7** – Verkaufspaket vollständig |

Nach jedem Meilenstein folgt ein Fortschrittsbericht; M1, M3 und M6 brauchen eine ausdrückliche Freigabe.

## 4. Budget (Rahmen 70–350 CHF)

| Posten | Kosten | Bemerkung |
|---|---|---|
| TypeScript, Phaser, Vite, Vitest, Playwright, Blender, Krita, Audacity, GitHub | 0 | Open Source bzw. kostenfreie Stufe |
| Demo-Hosting (statische Seite) | 0 | kostenfreie Stufen genügen |
| Domain für die Demo | ca. 15–20 CHF/Jahr | empfohlen für den professionellen Auftritt |
| Schriftlizenz bzw. freie Schrift (OFL) | 0 | freie Schrift mit dokumentierter Lizenz |
| Reserve für einzelne lizenzierte Klänge oder Texturen | bis ca. 100 CHF | nur bei belegtem Bedarf |
| Spine-Lizenz | nicht eingeplant | erst bei belegtem Mehrwert (CR-08) |
| Markenanmeldung | nicht im Rahmen | Entscheidung nach Markenrecherche; Kosten liegen über dem Startbudget |
| Rechtsberatung vor Vertragsabschluss | nicht im Rahmen | erst bei konkretem Interesse eines Providers nötig |

Erwarteter Aufwand bis Stufe A: etwa 15–120 CHF.
