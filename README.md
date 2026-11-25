# TEMPLE OF THE LOST SUN

*Every relic reveals a secret.*

Premium Adventure Video Slot (6×5, Cluster Pays, Cascades, Expedition System) – eigenständige Game-IP in Entwicklung.

**Projektstand:** Engine, Tests, Simulator und Python-Zweitimplementierung sind implementiert und getestet. Die Konfiguration ist als v1.0.0 eingefroren: simulierter RTP 95,995 % (2 Mrd. Runden, 95 %-Intervall 95,90–96,09 %), Feature-Kauf zu 58× Einsatz mit simuliertem Kauf-RTP 96,81 %. Alle Werte sind **simuliert, nicht zertifiziert**. Der Client ist in Arbeit; Grafik und Audio existieren noch nicht.

## Befehle

```
npm install
npm test                                   # alle Tests
npm run sim -- --rounds 10000000           # Simulation Konfiguration v1.0.0
npm run sim -- --preset v0.1 --rounds 1000000
npm run sim -- --mode buy --rounds 1000000 # Feature-Kauf
npm run dev                                # Demo-Client im Browser (Platzhaltergrafik)
npm run build:client && npx vite preview --port 4173   # danach: npm run e2e
```

## Dokumente

| Nr. | Dokument | Inhalt |
|---|---|---|
| 00 | [Projektstatus](docs/00_PROJECT_STATUS.md) | Feature-Register, Entscheidungen, Risiken, offene Fragen, Fortschrittsbericht |
| 01 | [Konzept-Review](docs/01_CONCEPT_REVIEW.md) | Kritische Prüfung, Schwächen, Änderungsvorschläge (CR-01 … CR-09) |
| 02 | [Game Design Document v1.1](docs/02_GDD.md) | Vollständige Spielregeln, Symbole, Features, UX, Art, Audio |
| 03 | [Technische Architektur](docs/03_TECHNICAL_ARCHITECTURE.md) | Module, Datenmodell, RNG, Tests, Tooling |
| 04 | [Mathematischer Modellierungsplan](docs/04_MATH_MODELING_PLAN.md) | Modell, Simulation, Validierung, Abnahmekriterien |
| 05 | [Backlog & Roadmap](docs/05_BACKLOG_AND_ROADMAP.md) | Priorisierte Aufgaben, Zeitplan, Budget |
| 06 | [Polish: Audit und Designplan](docs/06_POLISH_AUDIT_AND_PLAN.md) | Erstes Audit der Oberfläche und Plan (Pakete 1–5 umgesetzt) |
| 07 | [Publisher Readiness](docs/07_PUBLISHER_READINESS.md) | Audit, Gap-Analyse, Plan und Abschlussbericht mit Bewertung |
| 08 | [Geräte-Prüfliste](docs/08_DEVICE_TEST_CHECKLIST.md) | Was auf einem echten Smartphone zu prüfen ist |
| 09 | [Abschlussbericht](docs/09_ULTIMATE_READINESS_REPORT.md) | Audit, Änderungen, Tests, Bewertung, was bis zur externen Prüfung fehlt |
| 10 | [Tempo-Bericht](docs/10_PACING_REPORT.md) | Drei Geschwindigkeitsmodi, Free-Spin-Tempo, gemessene Zeiten |
| 11 | [Final Polish: Abschlussbericht](docs/11_FINAL_REPORT.md) | Änderungen, Tests, ehrliche Bewertung, Start- und Testanleitung, Präsentationsmodus |
| – | [Publisher-Paket](docs/publisher/README.md) | Elf englische Dokumente für Gespräche mit Anbietern |

## Werkzeuge

- `tools/exploration/first_drop_cluster_frequency.py` – explorative Vorab-Simulation (nur Erstfall-Clusterhäufigkeit, keine Auszahlungen), Grundlage für CR-01.
- `tools/reference/diff.sh <config.json> <seed> <ströme> <runden>` – Differenztest der Engine gegen die unabhängige Python-Implementierung.
