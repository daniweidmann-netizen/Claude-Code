# TEMPLE OF THE LOST SUN

*Every relic reveals a secret.*

Premium Adventure Video Slot (6×5, Cluster Pays, Cascades, Expedition System) – eigenständige Game-IP in Entwicklung.

**Projektstand:** Engine, Tests und Simulator sind implementiert und getestet. Der Abstimmungskandidat v0.2 misst 95,98 % RTP (400 Mio. Runden), ist aber **nicht validiert** und setzt den offenen Änderungsvorschlag CR-09 voraus. Client, Grafik und Audio existieren noch nicht.

## Befehle

```
npm install
npm test                                   # alle Tests
npm run sim -- --rounds 10000000           # Simulation Kandidat v0.2
npm run sim -- --preset v0.1 --rounds 1000000
```

## Dokumente

| Nr. | Dokument | Inhalt |
|---|---|---|
| 00 | [Projektstatus](docs/00_PROJECT_STATUS.md) | Feature-Register, Entscheidungen, Risiken, offene Fragen, Fortschrittsbericht |
| 01 | [Konzept-Review](docs/01_CONCEPT_REVIEW.md) | Kritische Prüfung, Schwächen, Änderungsvorschläge (CR-01 … CR-08) |
| 02 | [Game Design Document v1.1](docs/02_GDD.md) | Vollständige Spielregeln, Symbole, Features, UX, Art, Audio |
| 03 | [Technische Architektur](docs/03_TECHNICAL_ARCHITECTURE.md) | Module, Datenmodell, RNG, Tests, Tooling |
| 04 | [Mathematischer Modellierungsplan](docs/04_MATH_MODELING_PLAN.md) | Modell, Simulation, Validierung, Abnahmekriterien |
| 05 | [Backlog & Roadmap](docs/05_BACKLOG_AND_ROADMAP.md) | Priorisierte Aufgaben, Zeitplan, Budget |

## Werkzeuge

- `tools/exploration/first_drop_cluster_frequency.py` – explorative Vorab-Simulation (nur Erstfall-Clusterhäufigkeit, keine Auszahlungen), Grundlage für CR-01.
