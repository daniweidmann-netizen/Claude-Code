# 11 – Provider Pitch Structure

Stand: 25.11.2026 · Vorlage für eine Präsentation mit 15 Folien (PowerPoint oder PDF).
Die Präsentation selbst ist **nicht erstellt**; dies ist die Struktur mit Inhalten und Quellen.

Bereitschaft: **bereit** = alle Daten vorhanden · **bedingt** = vorzeigbar mit offenem Hinweis ·
**nicht bereit** = Daten fehlen.

| # | Überschrift | Kernaussage | Benötigte Daten (Quelle) | Bild / Grafik | Darstellung | Bereit? |
|---|---|---|---|---|---|---|
| 1 | TEMPLE OF THE LOST SUN | Every relic reveals a secret. | Logo, Claim | Titelbildschirm (`docs/polish/`, neu aufnehmen) | Vollbild, nur Logo und Claim | bereit |
| 2 | Executive Summary | Cluster-Slot, in dem jede Kaskade eine Expedition voranbringt; spielbare Demo, eine Mathematik-Konfiguration, noch nicht zertifiziert | `01_Executive_Summary.md` | Spielszene | drei Aussagen links, Bild rechts | bereit |
| 3 | Game Concept | Der Bonus wird erreicht, nicht gewürfelt | `03_Game_Design_Overview.md` Abschn. 2 | Schema: Kaskade → Schritt → Station → Tempel | eine Grafik, ein Satz | bereit (Grafik anfertigen) |
| 4 | Visual Identity | Stein, Gold, Jade, Türkis; Sonnenmotiv als roter Faden | `07_Art_And_Audio_Inventory.md` Abschn. 5 | Logo, zwei Kulissen, Sun Relic, Farbfelder | Collage | **bedingt** – Hinweis «KI-erzeugt, Rechte in Klärung» gehört auf die Folie oder in den Vortrag |
| 5 | Core Gameplay | 6×5, Cluster ab 5, Kaskaden, Wilds nur durch Stationen | `02_Game_Fact_Sheet.md` | Bildfolge: Gewinn, Auflösen, Nachfallen (Demonstration Schritt 1) | drei Bilder | bereit |
| 6 | Symbol System | fünf Gewinnsymbole, Wild, Explorer, Compass, Temple Key; Sun Relic als Artefakt | `04_Feature_Overview.md` Abschn. 1 | Symbolreihe, Paytable | Tabelle + Symbole | bereit |
| 7 | Expedition System | fünf Stationen, fünf verschiedene Wirkungen | `04` Abschn. 2 | Track mit Medaillons; Demonstration Schritt 2 | Zeitstrahl mit Schrittzahlen 1·2·4·6·9 | bereit |
| 8 | Free Spins | Start vom Base Camp, Sonnenbonus bleibt, Siegel fürs Finale | `04` Abschn. 3 | Tor, Free-Spin-Szene, Abschlusstafel (Schritt 3) | drei Bilder, vier Stichpunkte | bereit |
| 9 | Temple Bonus | drei Kammern, Preise liegen vorher fest, ehrliche Auflösung | `04` Abschn. 4 | Kammerszene vor und nach der Wahl (Schritt 4) | zwei Bilder + Preistabelle | bereit |
| 10 | Mathematical Overview | RTP 95,995 % simuliert (2 Mrd. Runden), Trefferquote 32,80 %, Höchstgewinn 10 000× | `05_Math_Overview.md` | Gewinnverteilung, RTP-Aufteilung | Kennzahlen gross, **Fusszeile «internally simulated – not certified»** | **bedingt** – nur mit Prüfstatus zeigen; Volatilität nach Anbieterskala fehlt; nur eine RTP-Variante |
| 11 | Technical Overview | Logik getrennt von Darstellung, deterministisch, portierbar | `06_Technical_Overview.md` | Schichtenbild Engine / Sitzung / Client | Diagramm | bereit; **ohne** Aussage zu Geräten |
| 12 | QA & Testing | 86 Tests, Browser-Tests in zehn Formaten, Zweitimplementierung | `08_QA_And_Test_Report.md` | Tabelle | grün/offen nebeneinander | **bedingt** – Geräteprüfung und Hörprüfung fehlen und müssen genannt werden |
| 13 | Development Status | Was fertig ist, was offen ist | `12_Open_Issues_And_Risks.md` | Ampelliste | drei Spalten | bereit |
| 14 | Commercial Models | Publishing bevorzugt; Lizenz oder Verkauf möglich | `10_Commercial_Models.md` | Vergleichstabelle | Tabelle ohne Zahlen | **bedingt** – keine Konditionen festgelegt; Rechtsform offen |
| 15 | Contact & Next Steps | Demo-Link, Datenpaket, Wunsch: technische Anforderungen des Programms | Kontaktdaten des Eigentümers (**fehlen im Projekt**), Demo-Zugang | QR-Code zum Demo-Link | schlicht | **nicht bereit** – Kontaktdaten, Rechtsform und ein für Dritte zugänglicher Demo-Link fehlen (die heutige Demo-Seite ist privat) |

## Hinweise zur Erstellung

- Bilder aus dem Präsentationsmodus aufnehmen (`?demo=1`); feste Seeds 5, 57, 697, 1168.
  Dazu sagen, dass es ausgewählte, nicht typische Runden sind.
- Keine Zahl ohne Fusszeile zum Prüfstatus. Kein «96 % RTP» ohne «target» bzw. «simulated».
- Keine Aussagen zu Geräten, Bildrate oder Ton, solange sie ungeprüft sind.
- Empfohlen ist ein kurzes Gameplay-Video (30–60 s); ein Konzept liegt vor
  (`docs/publisher/11_TRAILER_CONCEPT.md`), ein Video nicht.
- Sprache der Folien: Englisch. Die Texte in `03_Game_Design_Overview.md` sind dafür vorbereitet.
