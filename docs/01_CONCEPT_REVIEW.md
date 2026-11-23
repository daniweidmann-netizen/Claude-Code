# 01 – Kritisches Konzept-Review

Stand: 2026-11-23 · Status: zur Freigabe vorgelegt

Dieses Dokument prüft das Ausgangskonzept (Master Prompt) und leitet daraus Änderungsvorschläge (Change Requests, CR) ab. Das GDD v1.0 ist bereits mit den **empfohlenen** Varianten geschrieben; jede CR ist dort als Konfigurationsparameter oder klar abgegrenzter Abschnitt umgesetzt und kann einzeln abgelehnt werden.

## 1. Was am Konzept stark ist

- **Klare, international verständliche Themenwelt.** Abenteuer/Tempel ist ein dauerhaft nachgefragtes Genre und funktioniert ohne Text.
- **Der Expedition Track ist ein echter USP-Kandidat.** Ein sichtbarer Fortschrittsweg, der Spielmechanik und Erzählung verbindet, ist verständlicher als abstrakte Lademeter.
- **6×5 mit Kaskaden** ist ein Format, das Spieler und Provider kennen; die Einstiegshürde ist niedrig.
- **Die Architekturvorgabe** (Trennung Mathematik / RNG / Darstellung) entspricht exakt dem, was eine spätere RGS-Integration verlangt.

## 2. Schwächen und Risiken

### 2.1 Kritisch: «8 verbundene Symbole» auf 6×5 trifft zu selten (→ CR-01)

Die Vorgabe kombiniert das Raster eines Scatter-Pays-Spiels (8 gleiche *irgendwo*) mit einer Cluster-Regel (8 gleiche *verbunden*). Das ist deutlich strenger. Eine explorative, geseedete Simulation (300 000 Raster je Zeile, nur Erstfall ohne Kaskaden, `tools/exploration/first_drop_cluster_frequency.py`) ergibt als Anteil der Raster mit mindestens einem Cluster:

| Symbolverteilung | min. 5 | min. 6 | min. 8 |
|---|---|---|---|
| 5 Symbole, gleichverteilt | 35,97 % | 16,91 % | 3,32 % |
| 5 Symbole, gewichtet 30/25/20/15/10 | 52,91 % | 31,78 % | 10,60 % |
| 5 Symbole gewichtet + 8 % Sondersymbole | 41,83 % | 22,99 % | 6,63 % |
| 7 Symbole, gleichverteilt | 14,03 % | 4,72 % | 0,52 % |
| 7 Symbole, gewichtet 24/20/17/14/11/8/6 | 28,60 % | 13,56 % | 3,04 % |

Mit 8er-Clustern läge die Trefferfrequenz bei realistischer Verteilung um 7 %. Das heisst über 90 % tote Spins, und der Expedition Track – der von Gewinnkaskaden lebt – würde fast nie sichtbar arbeiten. Die Zahlen sind eine Voruntersuchung, kein Mathematikmodell; die Grössenordnung ist aber eindeutig.

### 2.2 Kritisch: Persistenz des Expedition Tracks ist nicht definiert (→ CR-02)

Bleibt Fortschritt zwischen bezahlten Spins erhalten, entstehen drei Probleme: (a) der Erwartungswert eines Spins hängt vom Zustand ab, wodurch Spieler gezielt «vorgeladene» Spiele übernehmen können; (b) der Zustand muss je Spieler und Einsatzstufe serverseitig gespeichert werden; (c) mehrere regulierte Märkte stellen an solche Mechaniken Zusatzanforderungen. Für ein Spiel, das verkauft werden soll, ist das unnötiger Integrationsaufwand.

### 2.3 Hoch: Zu viele Sondersymbole auf dem Raster (→ CR-03)

Fünf Sondersymbole neben fünf Gewinnsymbolen würden, wenn alle natürlich fallen, die Clusterbildung blockieren und die Lesbarkeit auf Mobilgeräten verschlechtern. Zudem fehlen im Konzept die Rollen von Explorer, Temple Key und Sun Relic.

### 2.4 Hoch: Temple-Bonus-Auswahl kann irreführend sein (→ CR-04)

Eine Auswahl, deren Ergebnis vorab feststeht, während die Animation Einfluss suggeriert, ist in mehreren Märkten problematisch und widerspricht der eigenen Vorgabe «keine falschen Erwartungen».

### 2.5 Hoch: Kein Maximalgewinn und keine Terminierungsgarantie definiert (→ CR-05)

Kaskaden mit persistenten Wilds und Multiplikatoren brauchen eine harte Obergrenze für Auszahlung und Kaskadenzahl, sonst ist weder die Maximalauszahlung noch die Terminierung beweisbar.

### 2.6 Mittel: «Theoretischer RTP» ist für dieses Spiel nicht geschlossen berechenbar

Ein 6×5-Clusterspiel mit Kaskaden hat einen Zustandsraum, der eine exakte Enumeration ausschliesst. Der RTP wird per Monte-Carlo-Simulation mit Konfidenzintervall bestimmt; exakt berechenbar sind nur Teilkomponenten (Scatter-Auslösung, Temple-Bonus-Erwartungswert). Der Vergleich «theoretisch vs. simuliert» wird deshalb auf diese Teilkomponenten sowie auf zwei unabhängige Implementierungen bezogen (siehe Dokument 04).

### 2.7 Mittel: Engine-Wahl und Provider-Realität (→ CR-06)

Grosse Provider entwickeln mit eigenen Frameworks (überwiegend PixiJS-basiert) und kaufen selten fertige Clients. Realistischer sind Partner-/Aggregationsprogramme für externe Studios und Lizenzierung von IP plus Mathematik. Phaser 3 ist für den Prototyp richtig; der verkaufbare Kern sind aber Mathematik-Engine, Ereignisprotokoll, Art und Marke. Die Architektur muss den Client austauschbar halten.

Nach meinem Wissensstand existieren Programme wie Relax Gaming «Silver Bullet / Powered By Relax», Hacksaw «OpenRGS» und Stake Engine für unabhängige Entwickler. **Das ist nicht aktuell verifiziert**; Bedingungen und Einreichungswege werden in der Akquise-Phase recherchiert und belegt, bevor sie in Verkaufsunterlagen stehen.

### 2.8 Mittel: Rechtekette der Assets (→ CR-07)

Ein Käufer verlangt eine lückenlose Rechtekette. Rein KI-generierte Grafik und Musik ist in wichtigen Rechtsordnungen möglicherweise nicht urheberrechtlich schutzfähig, und die Nutzungsbedingungen der Tools unterscheiden sich. Das mindert den Wert einer IP, die genau als IP verkauft werden soll. (Keine Rechtsberatung – vor Vertragsverhandlungen ist anwaltliche Prüfung nötig.)

### 2.9 Mittel: Zeitplan und Budget

12 Wochen sind für Stufe A (Präsentationsprototyp) und eine belastbare Mathematik realistisch, für Stufe B mit finaler Grafik und Animation in Eigenleistung eng. Das Budget von 70–350 CHF reicht für Stufe A, wenn keine Spine-Lizenz gekauft wird (→ CR-08). Zertifizierung (Stufe D) kostet fünfstellige Beträge und ist Sache des Lizenznehmers.

### 2.10 Niedrig: Nur ein RTP-Wert

Provider erwarten mehrere RTP-Varianten (typisch um 96 / 94 / 92 % und tiefer). Das Modell wird so parametrisiert, dass Varianten ohne Regeländerung ableitbar sind.

## 3. Änderungsvorschläge

| CR | Vorschlag | Begründung | Auswirkung bei Ablehnung |
|---|---|---|---|
| **CR-01** | Mindestcluster **5** statt 8 (Parameter `minClusterSize`) | 2.1: Trefferfrequenz ~7 % → Zielbereich 22–30 % erreichbar | Sehr tote Basisrunde; Expedition Track kaum aktiv; Ausgleich nur über sehr wenige, stark gewichtete Symbole |
| **CR-02** | Track **setzt bei jedem bezahlten Spin zurück**; Persistenz nur innerhalb der Free Spins («Base Camp») | 2.2: jeder Spin unabhängig, kein gespeicherter Zustand | Zustandsspeicherung je Spieler/Einsatz, komplexere Compliance |
| **CR-03** | Natürlich fallend nur: 5 Gewinnsymbole, Wild, Compass, Temple Key. **Explorer und Sun Relic entstehen nur durch Stationen** | 2.3: Lesbarkeit, Clusterbildung, klare Rollen | Mehr Blocker, komplexere Mathematik |
| **CR-04** | Temple Bonus als **echte Auswahl**: drei Preise werden vorab per RNG den Kammern zugeteilt, die Wahl bestimmt den Gewinn, nicht gewählte Kammern werden wahrheitsgemäss aufgedeckt | 2.4 | Hinweistext «Auswahl hat keinen Einfluss» nötig; schwächeres Erlebnis |
| **CR-05** | Maximalgewinn **10 000× Einsatz** (Runde endet bei Erreichen), max. 50 Kaskaden je Spin | 2.5 | Maximalauszahlung nicht belegbar |
| **CR-06** | Mathematik-Engine als eigenständiges, UI-freies TypeScript-Modul mit Ereignisprotokoll; Phaser-Client nur Darsteller | 2.7 | Client-Neubau beim Käufer entwertet das Paket |
| **CR-07** | Asset-Register mit Herkunft, Werkzeug, Lizenz und menschlichem Bearbeitungsanteil ab dem ersten Asset | 2.8 | IP-Dokumentation später nicht rekonstruierbar |
| **CR-08** | Animation im Prototyp mit Phaser-Tweens, Partikeln und Shadern; Spine/Rive erst bei belegtem Mehrwert | 2.9, Budget | Lizenzkosten vor Nutzennachweis |

## 4. Bewusst **nicht** geändert

- Name, Tagline, Story, Farbwelt und Symbolnamen.
- Raster 6×5, Cluster Pays orthogonal, Kaskaden.
- Fünf Stationen mit den vorgegebenen Namen und Funktionsrichtungen.
- Drei Kammern im Temple Bonus.
- 3+ Compass → 8 Free Spins.
- Ziel-RTP 96,00 %.
- Phaser 3 + TypeScript für den Client.
