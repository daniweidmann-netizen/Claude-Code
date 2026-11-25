# 13 – Source References

Stand: 25.11.2026 · Repository `daniweidmann-netizen/claude-code`, Branch
`claude/awesome-heisenberg-7vbnfn`. Zeilenangaben gelten für diesen Stand.

## 1. Spielregeln und Mathematik (massgeblich)

| Thema | Datei | Zeilen |
|---|---|---|
| Konfiguration 1.0.0 (alle Parameter) | `config/game-config.v1.0.0.json` | 1–332 |
| – Raster, Mindestcluster, Kaskadengrenze, Höchstgewinn | | 3–7 |
| – Symbolgewichte Basis / Free Spins | | 8–29 |
| – Auszahlungsstufen und Paytable | | 30–91 |
| – Schritte je Station, Discovery-Wilds, Treasure-Multiplikator | | 92–100 |
| – Sun-Relic-Werte Basis / Free Spins | | 101–144 |
| – Free Spins (Auslöser, Retrigger, Grenzen) | | 145–168 |
| – Temple Bonus: Preistabellen Basis und Finale, Bonus-Free-Spins | | 169–325 |
| – Feature-Kauf | | 326–331 |
| Dieselbe Konfiguration im Code | `src/engine/config/candidate-config.ts` | 18–64 |
| Konfigurationsprüfung | `src/engine/config/validate.ts` | 1–80 |
| Symbol-IDs | `src/engine/config/types.ts` | 2–12 |
| Clustersuche (4 Nachbarn, Wilds) | `src/engine/clusters/clusters.ts` | 18–57 |
| Schwerkraft und Nachfüllen | `src/engine/grid/grid.ts` | 1–40 |
| Rundenstart, Free-Spins-Auslöser | `src/engine/round/round.ts` | 126–142 |
| Feature-Kauf | | 148–157 |
| Kammerwahl, Relic Bonus, Aufdecken | | 159–189 |
| Free-Spins-Schleife, Retrigger, Finale | | 191–211 |
| Vergabe und Obergrenze der Free Spins | | 219–230 |
| Ziehen und Mischen der Kammerpreise | | 232–250 |
| Gewinn gutschreiben, Kappung | | 252–262 |
| Wirkung der fünf Stationen | | 277–319 |
| Ein Spin mit Kaskaden, Multiplikator, Schritte, Keys | | 322–421 |
| Umrechnung in Währung | | 424–430 |
| Ereignistypen | `src/engine/round/events.ts` | 1–41 |
| Zufallsgenerator | `src/engine/rng/rng.ts` | 1–119 |
| Sitzung, Seed, Verlauf, Wiedergabe | `src/session/game-service.ts` | 18–27, 54–58, 77–85, 153–159 |

## 2. Simulation und Nachweise

| Thema | Datei |
|---|---|
| Abnahmelauf 2 Mrd. Runden (massgebliche Kennzahlen) | `docs/math/reports/2026-11-24_v0.3.2-candidate_2G_acceptance.md` und `.json` |
| Feature-Kauf, 100 Mio. Käufe | `docs/math/reports/2026-11-24_v0.3.3-candidate_featurebuy_100M.md` und `.json` |
| Frühere Läufe (0.1, 0.2, 0.3, 0.3.1) | `docs/math/reports/` |
| Simulator | `tools/sim/` (`cli.ts`, `core.ts`, `bonus-math.ts`) |
| Zweitimplementierung und Vergleich | `tools/reference/reference_engine.py`, `tools/reference/diff.sh` |
| Mathematik-Dokumentation (englisch) | `docs/publisher/02_MATH_DOCUMENTATION.md` |
| Modellierungsplan, Abnahmekriterien | `docs/04_MATH_MODELING_PLAN.md` |
| Bestätigung der Clusterregel | `docs/12_CLUSTER_RULE_CONFIRMATION.md` |

## 3. Client

| Thema | Datei |
|---|---|
| Szene, Ablauf, Präsentationsmodus | `src/client/scenes/game-scene.ts` |
| Abspielen des Ereignisprotokolls | `src/client/presentation/presenter.ts` |
| Raster, Track, Bedienung, Bonus, Tafeln | `src/client/views/` |
| Layout | `src/client/layout.ts` |
| Tempo | `src/client/timing.ts` |
| Effekte, Leistung | `src/client/fx.ts`, `src/client/perf.ts` |
| Ton | `src/client/audio/sfx.ts` |
| Texte, Regeln | `src/client/i18n.ts`, `src/client/rules-text.ts` |

## 4. Tests

`tests/unit/`, `tests/integration/`, `tests/property/` (86 Tests) · `tools/e2e/smoke.cjs`,
`final.cjs`, `soak.cjs`, `timing.cjs`.

## 5. Assets und Rechte

`public/` (ausgeliefert) · `assets/reference/raw/`, `assets/audio/raw/` (Rohdaten) ·
`assets/ASSET_REGISTER.md` (jedes Asset mit Erzeugungsauftrag) ·
`docs/publisher/05_ASSET_AND_RIGHTS_REGISTER.md` · `tools/assets/process.py`, `tools/assets/audio.sh`.

## 6. Projektdokumente

| Nr. | Datei | Inhalt |
|---|---|---|
| 00–05 | `docs/00_PROJECT_STATUS.md` … `05_BACKLOG_AND_ROADMAP.md` | Status, Konzept-Review, GDD, Architektur, Mathematik-Plan, Backlog |
| 06–11 | `docs/06_…` … `docs/11_FINAL_REPORT.md` | Polish, Readiness-Berichte, Geräte-Prüfliste, Tempo-Bericht, Abschlussbericht |
| 12, 13 | `docs/12_CLUSTER_RULE_CONFIRMATION.md`, `docs/13_SUN_RELIC.md` | Regelbestätigung, Rolle des Relikts |
| Publisher | `docs/publisher/01…11` | englisches Paket: GDD, Mathematik, Technik, Features, Rechte, QA, Präsentation, Pitch-Gliederung, kommerzieller Entwurf, Demo-Anleitung, Trailer-Konzept |

## 7. Externe Quellen

Nur zu den Zielanbietern (Websuchen 24./25.11.2026), aufgeführt in
`docs/09_ULTIMATE_READINESS_REPORT.md` Abschn. 7. Sonst stammen alle Angaben aus dem Projekt.

## 8. Abgeleitete Werte in diesem Paket

Aus den Rohzahlen des Abnahmelaufs (`.json`) am 25.11.2026 berechnet und als «abgeleitet»
gekennzeichnet: mittlerer Gewinn je Gewinnrunde, mittlere Kaskadenzahl, Free Spins über den
Bonus, Finale-Anteil, Summen der RTP-Aufteilung, Symbolanteile in Prozent, Feature-Kauf-RTP bei 58×.
