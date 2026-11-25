# 12 – Bestätigung der Clusterregel

Stand: 25. November 2026 · Konfiguration 1.0.0 (unverändert)

## Die Regel

> Ein Gewinn braucht **mindestens 5 gleiche Symbole, die waagerecht oder senkrecht verbunden
> sind**. Diagonale Berührung verbindet nicht. Wilds (Wild und Explorer) zählen für jedes
> Gewinnsymbol; ein Cluster braucht mindestens ein echtes Gewinnsymbol.

**Entscheidung:** Das frühe Konzept nannte 8 Symbole. Eine Voruntersuchung ergab dafür auf dem
6×5-Raster nur rund 7 % Treffer. Der Wert wurde deshalb bewusst auf 5 gesenkt (CR-01, freigegeben
am 23.11.2026) und am 25.11.2026 vom Auftraggeber ausdrücklich als endgültige Spielregel bestätigt.
Der Wert 8 wird nicht wieder eingeführt.

In diesem Schritt wurde **kein mathematischer Parameter geändert**. Der Konfigurations-Hash ist
unverändert (`943082d6…98e3`).

## Was geprüft wurde

| Frage | Prüfung | Ergebnis |
|---|---|---|
| Steht der Wert auf 5? | `minClusterSize` in der eingefrorenen Konfiguration und in `config/game-config.v1.0.0.json`; erste Auszahlungsstufe beginnt bei 5; Test `cluster-rule` | ja |
| Verlangt die Gewinnberechnung wirklich 5? | Die Engine ruft die Clustersuche mit `minClusterSize` auf (`round.ts`). Einzeltests: vier in einer Reihe zahlen nichts; fünf in Reihe, Spalte und L-Form zahlen | bestanden |
| Nur waagerecht und senkrecht? | Die Suche prüft genau vier Nachbarn (oben, unten, links, rechts) | bestätigt am Code |
| Diagonalen ausgeschlossen? | Einzeltests: fünf gleiche Symbole auf einer Diagonale zahlen nichts; vier in Reihe plus diagonaler Nachbar zahlen nichts | bestanden |
| Gilt das auch in echten Runden? | 4000 Runden der Konfiguration 1.0.0: jeder ausgezahlte Cluster wird unabhängig von der Clustersuche nachgeprüft – Grösse ≥ 5, alle Felder zeigen das Symbol oder ein Wild, zusammenhängend nur über Kanten, kein passender Nachbar vergessen. Kleinster ausgezahlter Cluster: genau 5 | bestanden (über 1000 Cluster) |
| Stimmen Simulation und Spiel überein? | Simulator und Spiel benutzen **dieselbe** Engine und dieselbe Konfigurationsdatei. Zusätzlich: unabhängige Zweitimplementierung in Python (anderer Suchalgorithmus), 80 000 Runden mit neuem Seed 20261125, Ergebnisse Runde für Runde verglichen | identisch |
| Sagen die Spielregeln im Spiel dasselbe? | Regeltext liest den Wert aus der Konfiguration; Satz «Diagonale Berührung zählt nicht» ergänzt (deutsch und englisch) | angepasst |

Die 80 000 Vergleichsrunden hatten zufällig 97,82 % RTP. Das ist eine kleine Stichprobe und kein
Messwert; massgeblich ist der Abnahmelauf unten.

## Messwerte der 5er-Regel

Quelle: Abnahmelauf über 2 Milliarden Runden
(`docs/math/reports/2026-11-24_v0.3.2-candidate_2G_acceptance.md`); die Konfiguration 1.0.0 hat
dieselben Spielwerte. **Intern simuliert, nicht unabhängig geprüft und nicht zertifiziert.**

| Grösse | Wert |
|---|---|
| RTP | 95,995 % (95-%-Intervall 95,902 % … 96,088 %) |
| Gewinnfrequenz: Basis-Spins mit mindestens einem Cluster | 32,80 % |
| Runden mit irgendeinem Gewinn | 33,01 % |
| Standardabweichung je Runde | 21,14× Einsatz |
| Volatilität (eigene Einordnung) | hoch |
| Runden ohne Gewinn | 66,99 % |
| Runden mit Gewinn unter 1× Einsatz | 17,77 % |
| Runden ab 100× Einsatz | rund 0,095 % (etwa 1 in 1055) |
| Höchstgewinn 10 000× erreicht | 1 in 3,03 Mio. Runden |
| Free Spins | 1 in 222 Runden |
| Temple Bonus in der Basisrunde | 1 in 326 Runden |
| Feature-Kauf (58× Einsatz) | RTP 96,81 % (eigener Lauf über 100 Mio. Käufe) |

«Hoch» ist meine Einordnung anhand von Standardabweichung und Gewinnverteilung; eine verbindliche
Volatilitätsklasse vergibt erst der Anbieter oder ein Prüflabor nach eigenem Massstab.

## Stand der Dokumente

| Dokument | Aussage zur Clustergrösse |
|---|---|
| Spielregeln im Spiel (deutsch/englisch) | 5, waagerecht oder senkrecht, keine Diagonalen |
| `02_GDD.md` | 5, orthogonal, Diagonalen verbinden nicht |
| `publisher/01_GAME_DESIGN_DOCUMENT.md` | 5, mit Hinweis auf die frühere 8 als überholten Konzeptwert |
| `publisher/02`, `04`, `06` | 5 bzw. Messwerte der 5er-Regel |
| `00_PROJECT_STATUS.md` (Entscheidung D-001) | um die endgültige Bestätigung ergänzt |
| `09`, `11` | offene Frage «8 oder 5» als erledigt markiert |
| `01_CONCEPT_REVIEW.md` | nennt 8 nur als historische Ausgangslage und Begründung von CR-01 – bewusst belassen |

Die Zahl 8 kommt sonst nur noch in anderem Zusammenhang vor (8 Free Spins, Auszahlungsstufe 8–9).

## Offen

Die zweite frühere Abweichung bleibt unentschieden: «Sun Relic» ist kein Walzensymbol, sondern
die Wirkung von Station 4. Ein eigenes Symbol wäre eine Mathematikänderung und braucht eine
ausdrückliche Freigabe.
