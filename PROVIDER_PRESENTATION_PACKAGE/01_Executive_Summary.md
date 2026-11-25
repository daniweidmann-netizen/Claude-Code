# 01 – Executive Summary

**TEMPLE OF THE LOST SUN** · *EVERY RELIC REVEALS A SECRET.*
Stand: 25. November 2026 · Spielkonfiguration 1.0.0 · spielbare Demo ohne Echtgeld

> Alle Zahlen stammen aus internen Simulationen des Entwicklers. Sie sind **nicht unabhängig
> geprüft und nicht zertifiziert**. Quellen und Prüfstatus jeder Zahl: `05_Math_Overview.md`.

## Das Produkt in drei Sätzen

Ein Cluster-Slot auf einem 6×5-Raster mit Kaskaden. Jede Gewinnkaskade ist ein Schritt auf dem
**Expedition Track**; fünf Stationen verändern das laufende Spiel unterschiedlich (Wilds,
Multiplikator, stehendes Wild, Sonnenbonus, Tempel). Wer den Tempel erreicht, öffnet den
**Temple Bonus** mit drei Kammern; in den Free Spins startet jede Drehung auf einem «Base Camp»
weiter oben auf dem Track.

## Was vorhanden ist

| Bereich | Stand |
|---|---|
| Spiellogik | vollständig implementiert, reine TypeScript-Engine ohne Abhängigkeit von der Darstellung |
| Mathematik | eine Konfiguration (Ziel-RTP 96,00 %), eingefroren mit Prüfsumme; Simulator und unabhängige Zweitimplementierung |
| Simulierter RTP | 95,995 % (2 Mrd. Runden; 95-%-Intervall 95,902–96,088 %) |
| Trefferquote | 32,80 % der Basis-Spins |
| Höchstgewinn | 10 000× Einsatz (Kappung), in der Simulation 1 in 3,03 Mio. Runden |
| Client | spielbare Web-Demo (Phaser 3), Hoch- und Querformat, zwei Sprachen, drei Tempo-Modi, Regeln, Verlauf mit Wiedergabe |
| Präsentationsmodus | vier vorbereitete Runden mit festen Seeds, als Demonstration gekennzeichnet |
| Tests | 86 automatische Tests bestanden; Browser-Tests in sechs Formaten bestanden (nur Chromium) |

## Was fehlt (ehrlich)

1. **Keine Prüfung auf echten Geräten und in Safari.** Getestet wurde nur in einem Chromium ohne Grafikkarte.
2. **Ton nie angehört.** 17 Tondateien sind eingebunden, ihre Wirkung ist ungeprüft.
3. **Rechtekette offen.** Bilder und Ton sind KI-erzeugt und nicht von Hand überarbeitet; die
   Lizenzbedingungen der Werkzeuge sind nicht juristisch geprüft; keine Markenrecherche in Registern.
4. **Keine Zertifizierung**, keine unabhängige Prüfung von Mathematik und Zufallsgenerator.
5. **Eine einzige RTP-Variante**; kein Server (RGS), keine Wallet-Anbindung, keine Wiederaufnahme
   unterbrochener Runden.
6. Team: ein einzelner Entwickler mit KI-Unterstützung; keine veröffentlichten Titel.

## Was gesucht wird

Bevorzugt eine Studio-Partnerschaft (Vorschuss plus Umsatzbeteiligung); eine Lizenz oder ein
vollständiger IP-Verkauf sind möglich. Es liegt kein Angebot eines Anbieters vor, und dieses
Dokument nennt keine Preise (`10_Commercial_Models.md`).

## Einschätzung des Entwicklers

Konzept, Spiellogik und mathematische Dokumentation sind für ein erstes Gespräch vorzeigbar. Für
eine formelle Einreichung fehlen die Punkte 1 bis 4. Details: `12_Open_Issues_And_Risks.md`.
