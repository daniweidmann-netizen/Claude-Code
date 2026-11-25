# 06 – Technical Overview

Stand: 25.11.2026 · Quellen: Quellcode, `docs/03_TECHNICAL_ARCHITECTURE.md`,
`docs/publisher/03_TECHNICAL_FACT_SHEET.md`, `package.json`.

## 1. Datenblatt

| Punkt | Inhalt | Quelle |
|---|---|---|
| Sprache | TypeScript 5.9 (strikt) | `package.json`, `tsconfig*.json` |
| Darstellung | Phaser 3.90 (MIT), WebGL mit Canvas-Rückfall | `src/client/main.ts` |
| Build | Vite 6; Ausgabe statische Dateien in `dist-client` (rund 5,6 MB; davon Phaser 1,48 MB, Spielcode 135 kB) | `vite.config.ts` |
| Laufzeit-Abhängigkeiten | nur Phaser. Keine weiteren Bibliotheken im ausgelieferten Spiel | `package.json` Z. 20–27 |
| Werkzeuge | Vitest 2.1, fast-check 3.23 (Tests); Playwright (Browser-Tests); Python 3 (Zweitimplementierung, Bildaufbereitung) | `tests/`, `tools/` |
| Architektur | drei Schichten: **Engine** (`src/engine`, reine Logik ohne Browser), **Sitzung** (`src/session`, Guthaben, Verlauf), **Client** (`src/client`, Darstellung) | Verzeichnisstruktur |
| Zustandsmodell | Zustandsautomat `Round` (neu → Basis-Bonus → Finale → fertig); der Client hat keinen eigenen Spielzustand, er spielt das Ereignisprotokoll ab | `src/engine/round/round.ts`, `src/client/presentation/presenter.ts` |
| Geldrechnung | ganzzahlig in Hundertstel-Einsätzen; Umrechnung in Währung nur für Einsätze, die Vielfache von 10 Kleinsteinheiten sind | `round.ts` Z. 424–430 |
| Asset-Laden | Phaser-Loader mit Ladebalken; bei fehlenden Bildern im Code gezeichnete Platzhalter | `src/client/textures.ts` |
| Animation | Phaser-Tweens und Partikel; zentrales Effekt-Budget mit drei Stufen und automatischer Absenkung bei niedriger Bildrate | `src/client/fx.ts`, `src/client/perf.ts` |
| Audio | Web Audio API, 15 Effekte + 2 Musikschleifen (MP3), synthetischer Rückfall, Lautstärke, Stummschaltung | `src/client/audio/sfx.ts` |
| Speicherung | nur im Browser (`localStorage`): Sprache, Tempo-Modus, Ton. **Kein** Spielstand, keine Konten | `i18n.ts`, `game-scene.ts` |
| Responsive | reine Layout-Funktion für Hoch- und Querformat; Zeichenfläche in Geräteauflösung (Pixelverhältnis bis 2) | `src/client/layout.ts`, `env.ts` |
| Sprachen | Englisch, Deutsch | `src/client/i18n.ts` |

## 2. Lauffähigkeit

| Frage | Antwort |
|---|---|
| Lokal lauffähig? | Ja: `npm install`, `npm run build && npm run build:client`, `npx vite preview` |
| Über einen Webserver? | Ja, als statische Dateien; kein Server-Code nötig |
| Eigenständige Demo? | Ja; zusätzlich eine Einzeldatei-Fassung (`npm run build:single`). Diese liess sich auf einem iPhone **nicht** öffnen (Rückmeldung des Eigentümers); auf dem Telefon wird die gehostete Seite verwendet |
| Für eine Provider-Plattform vorbereitet? | **Teilweise.** Vorhanden: Schnittstelle `GameService` zwischen Client und Spiellogik, deterministische Engine, Ereignisprotokoll. **Nicht vorhanden:** Server, RGS-Anbindung, Wallet, Sitzungen, Wiederaufnahme, Jurisdiktions-Einstellungen |

## 3. Zufall und Spielintegrität

| Punkt | Stand | Quelle |
|---|---|---|
| Generator | xoshiro256** (64-Bit), Zustand über SplitMix64 aus dem Seed; unabhängige Ströme je Seed | `src/engine/rng/rng.ts` Z. 9–20, 25–97 |
| Gleichverteilte Ganzzahlen | Verwerfungsverfahren ohne Modulo-Verzerrung | `rng.ts` Z. 88–97 |
| Zuordnung zu Symbolen | kumulative Gewichtstabelle, genau eine Ziehung je Feld | `rng.ts` Z. 100–119; `src/engine/grid/grid.ts` |
| Seed in der Demo | je Runde 64 Bit aus `crypto.getRandomValues` des Browsers; im Verlauf gespeichert | `src/session/game-service.ts` Z. 54–58 |
| Reihenfolge der Ziehungen | fest und dokumentiert; Zweitimplementierung zieht in derselben Reihenfolge und liefert identische Runden | `tools/reference/reference_engine.py` |
| Trennung Berechnung / Darstellung | vollständig: Die Engine importiert nichts aus dem Client; das Ergebnis steht fest, bevor die erste Animation läuft | `src/engine/index.ts`; `game-scene.ts` (`playRound`) |
| Abhängigkeit von Animationen | keine. Tempo-Modi und Überspringen ändern das Ergebnis nicht (Test: gleiche Seeds, drei Modi, identische Gewinne) | `tools/e2e/timing.cjs` |
| Pick-Bonus | Preise werden vor der Wahl gezogen und gemischt; der Client erfährt den Inhalt geschlossener Kammern erst mit dem Ereignis | `round.ts` Z. 232–250 |

**Sicherheitslage der Demo (wichtig):** Die Engine läuft im Browser des Spielers. Das ist für
eine Demo mit Spielgeld in Ordnung, für Echtgeld **ungeeignet**: Ergebnis und Seed liegen auf
dem Gerät. xoshiro256** ist ein statistischer, **kein kryptografisch sicherer** Generator. Für
den kommerziellen Betrieb gehört die Engine auf einen Server und wird in der Regel mit dem
zertifizierten Zufallsgenerator des Anbieters betrieben; die Schnittstelle `Rng` ist dafür
austauschbar (`rng.ts` Z. 1–7).

**Vorbereitung auf eine unabhängige Prüfung:** gut vorbereitet in der Struktur (deterministisch,
wiederholbar, Konfiguration mit Prüfsumme, zweite Implementierung, dokumentierte Ziehungsliste).
**Nicht** vorhanden: Prüfbericht, statistische Testbatterie des Generators, Zertifikat.

Für einen kommerziellen Einsatz noch nötig (je nach Markt): Zertifizierung von RNG und
Spielmathematik durch ein akkreditiertes Labor, Prüfung der Spielregeln und Anzeigen je
Jurisdiktion, Sicherheits- und Lasttests der Server-Integration.

## 4. Leistung

| Messung | Ergebnis | Aussagekraft |
|---|---|---|
| Langzeittest 300 Runden | Speicher 18,9–19,8 MB ohne Anstieg, 47 Objekte, keine hängenden Animationen | Chromium ohne Grafikkarte |
| Bildrate im Testbrowser | 9–17 Bilder/s | **nicht repräsentativ** (Software-Rendering) |
| Bildrate auf echten Geräten | **NICHT VERIFIZIERT** | Anzeige im Spiel unter «i → Leistung» vorhanden, Werte liegen nicht vor |
| Ladezeit im Mobilfunknetz | **NICHT VERIFIZIERT** | – |
| Dauer eines Free Spins ohne Gewinn | Normal 3,5 s · Fast 2,2 s · Skip 1,5 s (Handyformat, Testbrowser) | auf Geräten vermutlich kürzer |

## 5. Bekannte technische Punkte

- Nur in Chromium geprüft; Safari und Firefox offen.
- Einzeldatei-Fassung öffnet auf iPhone nicht.
- Auslieferung 5,6 MB, keine Aufteilung in nachladbare Pakete.
- Rahmenbild des Spielfelds wird rund 10 % horizontal gestaucht.
- `package.json` trägt die Paketversion 0.1.0, die Spielkonfiguration 1.0.0 (zwei verschiedene Zähler, nicht abgeglichen).
- Lizenztexte (MIT für Phaser, OFL für die Schriften) sind noch nicht im Build enthalten.

## 6. Integrationsarbeiten, die ein Provider vermutlich braucht

1. Engine auf den Server (RGS) des Anbieters; Zufallsgenerator des Anbieters hinter der Schnittstelle `Rng`.
2. Umsetzung von `GameService` gegen die API des Anbieters (Start, Pick, Abschluss, Wiederaufnahme).
3. Wallet, Sitzung, Währungen und Einsatzstufen des Anbieters; Rundung je Währung.
4. Wiederaufnahme unterbrochener Runden (Free Spins, offene Kammerwahl).
5. Jurisdiktions-Schalter: Feature-Kauf, Autoplay-Grenzen, Mindest-Spindauer, Schnellspiel, Anzeige von RTP und Spielzeit, Realitäts-Checks.
6. Weitere RTP-Varianten samt Simulation und Zertifizierung.
7. Falls ein eigenes Client-Framework Pflicht ist: Neuaufbau der Darstellung auf Basis des Ereignisprotokolls.
8. Weitere Sprachen, Lokalisierung der Regeltexte, Analyse-Ereignisse, Fehlerbehandlung bei Verbindungsabbruch.
9. Geräte- und Browser-Matrix des Anbieters, Lasttests.

Welche dieser Punkte tatsächlich verlangt werden, ist **nicht bekannt**; mit keinem Anbieter
bestand Kontakt.
