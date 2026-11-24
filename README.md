# TEMPLE OF THE LOST SUN

*Every relic reveals a secret.*

Premium Adventure Video Slot (6×5, Cluster Pays, Cascades, Expedition System) – eigenständige Game-IP in Entwicklung.

**Projektstand:** Engine, Tests, Simulator und Python-Zweitimplementierung sind implementiert und getestet. Die Konfiguration v0.3.2 misst im Abnahmelauf einen simulierten RTP von 95,995 % (2 Mrd. Runden, 95 %-Intervall 95,90–96,09 %) und erfüllt die eigenen Abnahmekriterien; sie ist **nicht zertifiziert**, und die Freigabe des Meilensteins M3 steht aus. Client, Grafik und Audio existieren noch nicht.

## Befehle

```
npm install
npm test                                   # alle Tests
npm run sim -- --rounds 10000000           # Simulation Kandidat v0.3.2
npm run sim -- --preset v0.1 --rounds 1000000
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

## Werkzeuge

- `tools/exploration/first_drop_cluster_frequency.py` – explorative Vorab-Simulation (nur Erstfall-Clusterhäufigkeit, keine Auszahlungen), Grundlage für CR-01.
- `tools/reference/diff.sh <config.json> <seed> <ströme> <runden>` – Differenztest der Engine gegen die unabhängige Python-Implementierung.
