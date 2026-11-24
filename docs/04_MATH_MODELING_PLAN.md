# 04 – Mathematischer Modellierungsplan

Stand: 2026-11-23 · Status: zur Freigabe vorgelegt

> Dieses Dokument beschreibt, **wie** die Mathematik entwickelt und belegt wird. Es enthält keine Ergebnisse. Die einzige bisher durchgeführte Rechnung ist die Voruntersuchung zur Clustergrösse (Dokument 01, Abschnitt 2.1).

## 1. Zielgrössen und Abnahmekriterien

| Kennzahl | Ziel | Abnahmekriterium für VALIDATED |
|---|---|---|
| RTP | 96,00 % | Punktschätzung in 96,00 ± 0,10 % **und** halbe Breite des 95 %-Intervalls höchstens 0,10 Prozentpunkte (geändert am 2026-11-24, siehe Abschnitt 1.1) |
| Trefferfrequenz | 30–35 % | Messwert im Bereich |
| Free-Spin-Frequenz | 1 in 150–250 | Messwert im Bereich; Erstfall-Anteil stimmt mit exakter Rechnung überein |
| Temple Bonus (Basis) | 1 in 250–450 | Messwert im Bereich |
| RTP-Aufteilung | 50 / 16 / 30 % | Abweichung je Anteil höchstens ±3 Prozentpunkte, begründet |
| Maximalgewinn | 10 000× | kein simulierter Gewinn über der Obergrenze; Obergrenze wird erreicht, aber seltener als 1 in 1 Mio. Runden; Häufigkeit ausgewiesen |
| Terminierung | – | 0 Fälle des Kaskadenlimits; Verteilung der Kaskadenlänge ausgewiesen |
| Volatilität | hoch | Standardabweichung je Spin und Gewinnverteilung ausgewiesen; Einstufung begründet |

Werden Ziele verfehlt, werden zuerst Parameter angepasst; Regeländerungen brauchen eine Freigabe.

### 1.1 Änderung des RTP-Kriteriums (2026-11-24)

Das ursprüngliche Kriterium («Intervall vollständig in 95,90–96,10 %») ist bei der gemessenen Standardabweichung von rund 21× Einsatz je Runde praktisch nicht erfüllbar: Schon für eine halbe Intervallbreite von 0,10 Prozentpunkten sind etwa 1,8 Mrd. Runden nötig, und das Intervall läge nur dann vollständig im Band, wenn der wahre Wert fast exakt 96,00 % wäre. Das neue Kriterium trennt Genauigkeit der Messung (Intervallbreite) und Zielabweichung (Punktschätzung). Die Zielwerte für Trefferfrequenz und RTP-Aufteilung wurden mit der Entscheidung für höhere Volatilität angepasst.

## 2. Modellbeschreibung

- **Symbolziehung:** unabhängig je Position aus gewichteten Tabellen (Basisrunde, Free Spins). Vorteil gegenüber Walzenstreifen: wenige, gut interpretierbare Parameter und exakt berechenbare Erstfall-Wahrscheinlichkeiten.
- **Zufallsentscheidungen** (vollständige Liste): Symbol je Position; Positionen der Discovery-Wilds; Position des Explorers; Position und Wert des Sun Relic; drei Temple-Bonus-Preise und deren Kammerzuordnung. Jede hat eine dokumentierte Verteilung im Konfigurationsfile.
- **Stellschrauben** in Reihenfolge der Verwendung: Symbolgewichte → Auszahlungstabelle → Key- und Wild-Gewichte → Relic-Werte → Bonus-Preistabellen → Compass-Gewicht und Free-Spin-Anzahl.

## 3. Was exakt berechnet wird und was simuliert wird

Ein geschlossener theoretischer RTP ist für ein 6×5-Clusterspiel mit Kaskaden nicht berechenbar (Zustandsraum in der Grössenordnung 8³⁰ je Raster, dazu Kaskadenpfade). Der Gesamt-RTP wird deshalb simuliert. Die Glaubwürdigkeit kommt aus drei unabhängigen Prüfungen:

1. **Exakte Teilrechnungen als Kontrollgrössen**
   - Erwartungswert jeder Temple-Bonus-Stufe (endliche Aufzählung aller Preis-Tripel einschliesslich Relic-Zweitwahl).
   - Wahrscheinlichkeit von 3+/4+/5+ Compass im Erstfall (Binomialverteilung).
   - Erwartete Symbolhäufigkeiten und Verteilung der Relic-Werte.
   - Vollständige Enumeration von Miniaturrastern (z. B. 3×3 mit drei Symbolen) einschliesslich Kaskaden, verglichen mit der Engine in derselben Konfiguration.
2. **Zweite, unabhängige Implementierung** der Rundenlogik in Python (nur Rechenkern, anderer Algorithmus für die Clustersuche). Beide Implementierungen müssen bei identischer Zufallsfolge identische Rundenergebnisse liefern (Differenztest über mindestens 10⁶ Runden).
3. **Statistische Konvergenz** der Simulation (Abschnitt 5).

## 4. Simulator

- Node-Programm in `tools/sim`, nutzt den Engine-Rechenkern ohne Ereigniserzeugung, parallel über `worker_threads`.
- **Reproduzierbarkeit:** Jeder Lauf ist durch Konfigurationsversion, Master-Seed, Anzahl Worker und Spins je Worker vollständig bestimmt. Jeder Worker erhält einen eigenen RNG-Strom, dessen Zustand per SplitMix64 aus Master-Seed und Stromnummer abgeleitet wird (umgesetzt statt des ursprünglich geplanten Xoshiro-Jump: einfacher und ohne 64-Bit-Arithmetik im Simulator). Berichte enthalten Git-Commit und Konfigurations-Hash.
- **Ausgaben je Lauf:** RTP gesamt und je Quelle (Basis, Temple Bonus, Free Spins, Finale) · Standardabweichung und Standardfehler · Trefferfrequenz · Gewinnverteilung in Klassen (0, <1×, 1–2×, 2–5×, 5–10×, 10–20×, 20–50×, 50–100×, 100–500×, 500–1 000×, 1 000–5 000×, >5 000×, Obergrenze) · Clusterhäufigkeit je Symbol und Grösse · Verteilung der Kaskadenlänge · höchste erreichte Station je Spin · Feature-Frequenzen · Free-Spin-Verlauf (Anzahl, Base Camp, Endwert von S, Siegel) · Preisverteilung im Bonus · grösste Einzelgewinne mit Seed zur Wiedergabe.
- Ergebnisse werden als JSON und als lesbarer Bericht unter `docs/math/reports/` versioniert.

## 5. Stichprobenumfang und Konvergenz

- Standardfehler des RTP = σ / √N. Die Standardabweichung σ je Spin ist noch unbekannt und wird im ersten Lauf gemessen. Beispielrechnung: Bei σ = 15× Einsatz ergäben 10⁹ Spins einen Standardfehler von etwa 0,047 Prozentpunkten (95 %-Intervall ± 0,093); für ± 0,05 wären rund 3,5 × 10⁹ Spins nötig. Der Abnahmeumfang wird nach der σ-Messung festgelegt.
- **Stufen:** Abstimmungsläufe 10⁷ Spins · Kandidatenläufe 10⁸ · Abnahmelauf mindestens 10⁹ bzw. so viele, wie das Kriterium aus Abschnitt 1 verlangt.
- **Konvergenzprüfung:** RTP-Verlauf über logarithmisch gestaffelte Zwischenstände; Vergleich mehrerer unabhängiger Master-Seeds (Ergebnisse müssen innerhalb der Konfidenzintervalle übereinstimmen); Batch-Means zur Kontrolle des Standardfehlers.
- **Seltene Ereignisse:** Free Spins und Temple Bonus werden zusätzlich isoliert simuliert (Start direkt im Feature mit gemessener Verteilung der Eintrittszustände), um ihren Beitrag mit kleinerem Fehler zu bestimmen.

## 6. Extremwerte und Maximalgewinn

- Ausweis der Häufigkeit von Gewinnen ≥ 1 000×, ≥ 5 000× und des Erreichens der Obergrenze.
- Prüfung, dass die Obergrenze erreichbar, aber selten ist; der durch die Kappung abgeschnittene RTP-Anteil wird ausgewiesen.
- Gezielte Tests mit Skript-RNG für konstruierte Extremraster (volles Raster eines Symbols, Explorer mit Dauerkaskade), um Obergrenze und Kaskadenlimit auszulösen.

## 7. Vorgehen in Iterationen

1. Engine-Rechenkern und Simulator bauen; Geschwindigkeit messen.
2. Basisrunde ohne Features: Symbolgewichte und Auszahlungstabelle auf Trefferfrequenz und Basis-RTP abstimmen.
3. Stationen 1–4 zuschalten: Verteilung der erreichten Stationen und Multiplikatoreffekt messen; Key- und Wild-Gewichte abstimmen.
4. Temple Bonus: Preistabellen exakt berechnen, mit Auslösefrequenz auf den Zielanteil bringen.
5. Free Spins mit Base Camp und Finale: isoliert simulieren, dann Compass-Gewicht einstellen.
6. Gesamtabstimmung auf 96,00 %, Kandidatenläufe, Zweitimplementierung, Abnahmelauf.
7. Ableitung weiterer RTP-Varianten ausschliesslich über dokumentierte Parameter (bevorzugt Auszahlungstabelle bzw. Symbolgewichte, nicht über Regeln).

Jede Iteration endet mit einem Bericht und einem Eintrag im Entscheidungsregister.

## 8. Lieferobjekte der Mathematikphase

- Versionierte Spielkonfiguration (`game-config.json`) mit Hash.
- Mathematikdokument: Regeln, alle Verteilungen, exakte Teilrechnungen, Simulationsmethodik, Ergebnisse mit Konfidenzintervallen, RTP-Aufteilung, Gewinnverteilung, Volatilitätskennzahlen, Maximalgewinn-Analyse.
- Simulator und Zweitimplementierung mit Anleitung zur Reproduktion.
- Formulierungsregel für alle Unterlagen: «simulierter RTP … % (N Spins, 95 %-Intervall …)». Die Aussage «zertifiziert» oder «geprüft durch ein Labor» wird nicht verwendet, solange keine Prüfung stattgefunden hat.

## 9. Offene mathematische Risiken

| Risiko | Einschätzung |
|---|---|
| Free Spins mit erhaltenem Sonnenbonus und Base Camp 3 werden zu stark | wahrscheinlich; Stellschrauben: Relic-Werte in Free Spins, Base-Camp-Obergrenze, Key-Gewicht |
| Explorer erzeugt sehr lange Kaskaden | möglich; Kaskadenlängen-Verteilung früh messen |
| Trefferfrequenz und Volatilitätsziel widersprechen sich | möglich; dann Auszahlungen kleiner Cluster senken |
| Temple Bonus in der Basisrunde zu selten, um als USP wahrgenommen zu werden | möglich; Key-Gewicht ist der direkte Hebel |
