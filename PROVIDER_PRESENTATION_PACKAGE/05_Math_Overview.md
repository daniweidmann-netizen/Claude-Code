# 05 – Math Overview

Stand: 25.11.2026 · Konfiguration 1.0.0

> **Prüfstatus aller Zahlen in diesem Dokument:** intern simuliert oder intern berechnet.
> **Unabhängig geprüft: nein. Zertifiziert: nein.** Kein Prüflabor hat Spiel, Zufallsgenerator
> oder Mathematik gesehen. 96,00 % ist ein Entwurfsziel, kein nachgewiesener Wert.
> In diesem Auftrag wurde kein Parameter verändert und keine neue Simulation gefahren.

## 1. Datenlage

| Lauf | Konfiguration (Hash) | Runden | Seed | RTP | 95-%-Intervall | Std.-Abw. | Trefferquote | Datei |
|---|---|---|---|---|---|---|---|---|
| Entwurf | 0.1 (`4b2319b4…`) | 20 Mio. | 20261123 | 1721,95 % | – | 153,03× | 43,21 % | `docs/math/reports/2026-11-23_v0.1-draft_20M.md` |
| Kandidat | 0.2 (`55caa641…`) | 400 Mio. | 20261123 | 95,980 % | 95,860–96,099 | 12,20× | 32,70 % | `…_v0.2-candidate_400M.md` |
| Kandidat | 0.3 (`d2c94def…`) | 1 Mrd. | 20261124 | 95,850 % | 95,719–95,980 | 21,07× | 32,80 % | `…_v0.3-candidate_1G_seedA.md` |
| Abnahme 1 | 0.3.1 (`b6ca9b0d…`) | 2 Mrd. | 20261125 | 96,107 % | 96,014–96,200 | 21,23× | 32,80 % | `…_v0.3.1-candidate_2G_acceptance.md` |
| **Abnahme 2** | **0.3.2** (`3161a5c3…`) | **2 Mrd.** | 20261126 | **95,995 %** | **95,902–96,088** | 21,14× | 32,80 % | `…_v0.3.2-candidate_2G_acceptance.md` |
| Feature-Kauf | 0.3.3 (`71630094…`) | 100 Mio. Käufe | 20261127 | 95,815 % bei Preis 58,6× | 95,752–95,879 | 189,51× | – | `…_v0.3.3-candidate_featurebuy_100M.md` |

Einordnung der Läufe:

- 0.1 war ein unausgeglichener Erstentwurf (RTP 1722 %); er belegt nur, dass der Simulator lief.
- 0.3 → 0.3.1 → 0.3.2 sind Abstimmungsschritte. 0.3.1 lag ausserhalb der eigenen Toleranz
  (±0,10 Prozentpunkte um 96,00 %); daraufhin wurde ein Schatzpreis von 15× auf 14× gesenkt.
  Das ist dokumentiert und kein Widerspruch, sondern der Verlauf der Abstimmung.
- **Wichtig:** Mit der ausgelieferten Konfiguration **1.0.0 selbst (Hash `943082d6…`) gibt es
  keinen eigenen Abnahmelauf.** 1.0.0 unterscheidet sich von 0.3.2 durch die Versionsnummer und
  den Block «Feature-Kauf». Laut `docs/publisher/02_MATH_DOCUMENTATION.md` (Abschn. 1) wurden
  300 000 normale Runden beider Konfigurationen Ausgabe für Ausgabe verglichen und waren
  identisch. Ein Prüflabor würde vermutlich einen Lauf auf dem endgültigen Hash verlangen.
- **Feature-Kauf:** simuliert wurde bei Preis 58,6×; ausgeliefert ist Preis **58×**
  (Entscheidung des Eigentümers). Der Kauf-RTP von 96,81 % ist **abgeleitet**
  (56,148 ÷ 58), nicht separat simuliert. Der mittlere Gewinn je Kauf hängt nicht vom Preis ab.

## 2. Kennzahlen (normale Runden, Abnahme 2)

Methode: Monte-Carlo-Simulation mit der Spiel-Engine selbst (`tools/sim/`), 4 unabhängige
Zufallsströme, 2 000 000 000 Runden. «Z.» = Zeile im Bericht `…_v0.3.2-candidate_2G_acceptance.md`;
«JSON» = gleichnamige `.json`-Datei.

| Kennzahl | Wert | Quelle | Art | Unabh. geprüft | Zertifiziert |
|---|---|---|---|---|---|
| Ziel-RTP | 96,00 % | `docs/04_MATH_MODELING_PLAN.md` | Entwurfsziel | nein | nein |
| RTP | 95,9950 % | Z. 21 | simuliert | nein | nein |
| 95-%-Konfidenzintervall | 95,9024–96,0877 % | Z. 22 | simuliert | nein | nein |
| Standardfehler | 0,0473 % (analytisch) / 0,0538 % (Blockmittel) | Z. 24 | simuliert | nein | nein |
| Standardabweichung je Runde | 21,141× Einsatz | Z. 23 | simuliert | nein | nein |
| Volatilität | «hoch» – Einordnung des Entwicklers anhand Std.-Abw. und Verteilung; keine anerkannte Skala angewendet | `docs/12_CLUSTER_RULE_CONFIRMATION.md` | Einschätzung | nein | nein |
| Hit Frequency (Basis-Spin mit Cluster) | 32,795 % | Z. 34 | simuliert | nein | nein |
| Win Frequency (Runden mit Gewinn) | 33,011 % | Z. 35 | simuliert | nein | nein |
| Mittlerer Gewinn je Runde | 0,95995× Einsatz | = RTP | simuliert | nein | nein |
| Mittlerer Gewinn je **Gewinnrunde** | 2,908× Einsatz | abgeleitet: JSON `sumWin` ÷ `roundsWithWin` | abgeleitet | nein | nein |
| Kaskaden je Basis-Spin (Mittel) | 0,650 | abgeleitet aus Z. 73–98 | abgeleitet | nein | nein |
| Kaskaden je Basis-Spin mit Gewinn (Mittel) | 1,982 | abgeleitet | abgeleitet | nein | nein |
| Längste Kaskadenfolge | 23 (Grenze 50 nie erreicht) | Z. 40–41 | simuliert | nein | nein |
| Free Spins, alle Wege | 1 in 222,1 Runden | Z. 36 | simuliert | nein | nein |
| Free Spins über Compass | 1 in 238,1 | Z. 37 | simuliert | nein | nein |
| Free Spins über den Temple Bonus | 1 in 3267 | abgeleitet: JSON `fsFromBonus` | abgeleitet | nein | nein |
| 3+ Compass beim ersten Fall | 0,2785 % | Z. 122 | exakt berechnet (Binomial) | nein | nein |
| Mittlere Free Spins je Feature | 8,21 | Z. 107 | simuliert | nein | nein |
| **Retrigger-Frequenz** | **NICHT VERIFIZIERT / DATEN FEHLEN** – der Simulator zählt Retrigger nicht einzeln | – | – | – | – |
| Mittlerer Feature-Gewinn inkl. Finale | 67,90× (Std.-Abw. 212,44×) | Z. 105–106 | simuliert | nein | nein |
| Mittlerer End-Sonnenbonus im Feature | 14,72 (höchster Wert 400) | Z. 108 | simuliert | nein | nein |
| **Mittlerer Multiplikator je Gewinn** | **NICHT VERIFIZIERT / DATEN FEHLEN** | – | – | – | – |
| Temple Bonus in der Basisrunde | 1 in 326,1 | Z. 38 | simuliert | nein | nein |
| Mittlerer Gewinn Temple Bonus (Basis) | 50,826× simuliert · 50,971× exakt | Z. 116 | beides | nein | nein |
| Temple Finale 1/2/3 Siegel | 63,034 / 176,550 / 454,174× simuliert · 63,360 / 174,954 / 476,347× exakt | Z. 117–119 | beides | nein | nein |
| Free Spins aus dem Basis-Bonus | 9,980 % simuliert · 9,991 % exakt | Z. 121 | beides | nein | nein |
| Höchstgewinn | 10 000× Einsatz | Konfig. Z. 7 | Regel | nein | nein |
| Höchstgewinn erreicht | 659-mal, 1 in 3 034 901 | Z. 39 | simuliert | nein | nein |
| Feature-Kauf: mittlerer Gewinn | 56,148× (±0,037) | Kauf-Bericht Z. 14 | simuliert | nein | nein |
| Feature-Kauf: RTP bei 58× | 96,81 % | abgeleitet | abgeleitet | nein | nein |
| Feature-Kauf: Höchstgewinn erreicht | 1 in 17 940 Käufen | Kauf-Bericht Z. 41 | simuliert | nein | nein |

## 3. RTP-Aufteilung (Z. 25–28)

| Quelle | Anteil am RTP |
|---|---|
| Cluster der Basisrunde | 49,836 % |
| Temple Bonus der Basisrunde | 15,588 % |
| **Basisrunde gesamt** | **65,424 %** |
| Cluster der Free Spins | 25,738 % |
| Temple Finale | 4,834 % |
| **Free-Spin-Feature gesamt** | **30,571 %** |

## 4. Gewinnverteilung je Runde (Z. 45–58)

| Gewinn (× Einsatz) | Anteil | | Gewinn | Anteil |
|---|---|---|---|---|
| 0 | 66,989 % | | 20 bis <50 | 0,236 % |
| über 0 bis <1 | 17,765 % | | 50 bis <100 | 0,095 % |
| 1 bis <2 | 7,910 % | | 100 bis <500 | 0,082 % |
| 2 bis <5 | 5,372 % | | 500 bis <1000 | 0,0071 % |
| 5 bis <10 | 1,199 % | | 1000 bis <5000 | 0,0053 % |
| 10 bis <20 | 0,339 % | | ab 5000 | 0,00021 % |

## 5. Symbolgewichte und -wahrscheinlichkeiten (Konfig. Z. 8–29)

| Symbol | Gewicht Basis | Anteil | Gewicht Free Spins | Anteil |
|---|---|---|---|---|
| Sapphire Gem | 2000 | 20,42 % | 2000 | 20,72 % |
| Golden Scarab | 1950 | 19,91 % | 1950 | 20,21 % |
| Golden Chalice | 1900 | 19,40 % | 1900 | 19,69 % |
| Ruby Crown | 1850 | 18,89 % | 1850 | 19,17 % |
| Jade Mask | 1800 | 18,38 % | 1800 | 18,65 % |
| Wild | 0 | 0 % | 0 | 0 % |
| Compass | 92 | 0,94 % | 60 | 0,62 % |
| Temple Key | 200 | 2,04 % | 91 | 0,94 % |
| Summe | 9792 | | 9651 | |

Anteile = Gewicht ÷ Summe (hier berechnet). Zahlende Cluster je 1000 Runden nach Symbol und
Grösse: Bericht Z. 124–132. Sun-Relic-Werte: Basis 2 (500) · 3 (280) · 5 (150) · 10 (55) · 25 (15);
Free Spins 5 (480) · 10 (290) · 25 (150) · 50 (60) · 100 (20) – Konfig. Z. 101–144.
Paytable und Bonus-Preistabellen: `04_Feature_Overview.md`.

## 6. Absicherung der Zahlen (intern)

| Prüfung | Ergebnis | Quelle |
|---|---|---|
| Exakte Teilrechnungen (Bonus-Erwartungswerte, Compass beim ersten Fall) gegen Simulation | stimmen innerhalb der Streuung; Abweichung bei 3 Siegeln durch Kappung erklärt | Bericht Z. 112–122 |
| Unabhängige Zweitimplementierung in Python, Runde für Runde verglichen | identisch; zuletzt 80 000 Runden am 25.11.2026 (Seed 20261125) | `tools/reference/`, `docs/12_CLUSTER_RULE_CONFIRMATION.md` |
| Eigenschaftsbasierte Tests (jedes Ereignisprotokoll regelkonform) | bestanden | `tests/property/round.property.test.ts` |
| Clusterregel in 4000 echten Runden nachgeprüft | bestanden | `tests/integration/cluster-rule.test.ts` |
| Eingefrorene Konfiguration mit Prüfsumme | bestanden | `tests/unit/frozen-config.test.ts` |

## 7. Was fehlt

| Fehlend | Bedeutung |
|---|---|
| Unabhängige Prüfung und Zertifizierung | Voraussetzung für jeden regulierten Markt |
| Abnahmelauf auf dem Hash der Konfiguration 1.0.0 | formale Lücke (siehe Abschn. 1) |
| Simulation des Feature-Kaufs beim ausgelieferten Preis 58× | Kauf-RTP bisher nur abgeleitet |
| Weitere RTP-Varianten (üblich sind mehrere je Titel) | nur eine vorhanden; Werkzeuge existieren |
| Retrigger-Frequenz, mittlerer Multiplikator, Gewinn je Station | vom Simulator nicht erfasst |
| Anerkannte Volatilitätskennzahl des Zielanbieters | jeder Anbieter rechnet nach eigener Skala |
| Statistische Testbatterie für den Zufallsgenerator (z. B. TestU01, PractRand) | nicht ausgeführt |
| Anteil des durch die Kappung abgeschnittenen Gewinns | nicht ausgewiesen |
| Vollständige Enumeration auf einem Miniaturraster als Gegenprobe | geplant, nicht durchgeführt |
