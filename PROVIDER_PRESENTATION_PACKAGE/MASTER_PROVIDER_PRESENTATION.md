# TEMPLE OF THE LOST SUN – Master Provider Presentation

*EVERY RELIC REVEALS A SECRET.*

Stand: 25. November 2026 · Spielkonfiguration 1.0.0 · Demo ohne Echtgeld
Zentrale Zusammenfassung des Pakets; Einzelheiten und Quellen in den Dokumenten 01–13.

> **Prüfstatus:** Alle Zahlen sind interne Simulationen oder interne Berechnungen des
> Entwicklers. **Nicht unabhängig geprüft, nicht zertifiziert.** 96,00 % ist das Entwurfsziel;
> gemessen wurden 95,995 %. Für dieses Paket wurde am Spiel und an der Mathematik nichts geändert.

---

## A. Executive Summary

Temple of the Lost Sun ist ein Cluster-Slot auf einem 6×5-Raster mit Kaskaden. Sein Kennzeichen
ist der **Expedition Track**: Jede Gewinnkaskade ist ein Schritt, fünf Stationen verändern den
laufenden Spin auf unterschiedliche Weise, und wer den Tempel erreicht, öffnet den Temple Bonus.

Vorhanden sind eine vollständige, von der Darstellung getrennte Spiel-Engine, eine eingefrorene
Mathematik-Konfiguration mit Simulationsnachweisen, eine spielbare Web-Demo für Hoch- und
Querformat und ein dokumentiertes Datenpaket. Der Projektinhaber hat die Demo auf einem iPhone 15
Pro getestet und den Ton angehört (beides positiv, 25.11.2026). Nicht vorhanden sind eine vollständige Geräteprüfung,
geklärte Rechte, Zertifizierung, Server-Anbindung und weitere RTP-Varianten.

Gesucht wird bevorzugt eine Studio-Partnerschaft; Lizenz oder IP-Verkauf sind möglich. → `01`

## B. Game Fact Sheet

| | |
|---|---|
| Raster | 6×5, jedes Feld unabhängig gezogen (keine Walzenstreifen) |
| Gewinnsystem | Cluster ab **5** Symbolen, nur waagerecht/senkrecht verbunden, keine Diagonalen |
| Kaskaden | ja, höchstens 50 je Spin (in 2 Mrd. Runden höchstens 23) |
| Gewinnsymbole | Sapphire Gem, Golden Scarab, Golden Chalice, Ruby Crown, Jade Mask |
| Sondersymbole | Wild (nur durch Stationen), Explorer (stehendes Wild), Compass (Auslöser), Temple Key (Zusatzschritt) |
| Multiplikator | M = T + S: Grundmultiplikator 1 oder 2, plus Sonnenbonus |
| Free Spins | 3/4/5+ Compass → 8/10/12; Retrigger +4; höchstens 30 |
| Temple Bonus | Station 5 in der Basisrunde; drei Kammern, eine Wahl |
| Temple Finale | Siegel aus den Free Spins; Hauptschatz bis 10 000× |
| Feature-Kauf | 58× Einsatz, abschaltbar |
| Höchstgewinn | 10 000× Einsatz |
| RTP | Ziel 96,00 % · simuliert 95,995 % (nicht zertifiziert) |
| Trefferquote | 32,80 % |
| Volatilität | hoch (Einordnung des Entwicklers; Std.-Abw. 21,14× je Runde) |
| Technik | TypeScript, Phaser 3.90, WebGL, Web Audio; statische Web-Dateien, rund 5,6 MB |
| Sprachen | Englisch, Deutsch |

→ `02` mit Quellen je Zeile

## C. Feature Overview

| Feature | Beschreibung | Nutzen |
|---|---|---|
| Expedition Track | Schritte durch Kaskaden und Keys; Stationen nach 1·2·4·6·9 Schritten | sichtbares Ziel in jedem Spin |
| Discovery | 2 Felder werden Wild | frühe, häufige Belohnung |
| Treasure | Grundmultiplikator ×2 | spürbarer Schub ab der zweiten Kaskade |
| Ancient Power | Explorer: Wild, das stehen bleibt | hält Kaskaden am Laufen |
| Relic | Sun Relic addiert 2–25 (Free Spins 5–100) zum Multiplikator, wird Wild | seltene, grosse Hebel |
| Temple | Temple Bonus bzw. Siegel | Höhepunkt, der erarbeitet wird |
| Free Spins | Start vom Base Camp; Sonnenbonus bleibt erhalten | Features beginnen nie bei null |
| Temple Bonus / Finale | drei Kammern; Preise liegen vorher fest; Relic Bonus gibt eine weitere Kammer | ehrlicher, nachvollziehbarer Pick-Bonus |
| Tempo-Modi, Verlauf mit Wiedergabe, Präsentationsmodus | Darstellungsfunktionen | Komfort, Nachvollziehbarkeit, Vorführung |

**SUN** ist der Sonnenbonus: ein echter Teil des Multiplikators, kein reiner Anzeigewert. Er
entsteht nur durch die Station Relic, gilt für Clustergewinne, wird in der Basisrunde je Spin
zurückgesetzt und bleibt in den Free Spins erhalten. Im Temple Bonus hat er keine Funktion.
Das **Sun Relic** ist kein Walzensymbol, sondern das zentrale Artefakt und die Wirkung von
Station 4. → `04`

## D. USP

1. Fortschritt innerhalb eines Spins mit fünf verschiedenen Wirkungen.
2. Der Bonus wird erreicht, nicht gewürfelt; Free Spins verkürzen den Weg.
3. Pick-Bonus, dessen Preise vor der Wahl feststehen und danach offengelegt werden.
4. Nachvollziehbare Mathematik: Prüfsumme, Simulator, Zweitimplementierung, Wiedergabe aus Seed.
5. Logik und Darstellung getrennt – portierbar auf eine fremde Plattform.

Keine Behauptung zu Marktneuheit oder Spielererfolg; dafür gibt es keine Daten. → `03`

## E. Math Overview

| Kennzahl | Wert | Art |
|---|---|---|
| RTP | 95,995 % (95-%-Intervall 95,902–96,088 %) | simuliert, 2 Mrd. Runden |
| Aufteilung | Basisrunde 65,42 % (Cluster 49,84 + Bonus 15,59) · Feature 30,57 % (Cluster 25,74 + Finale 4,83) | simuliert |
| Trefferquote / Runden mit Gewinn | 32,80 % / 33,01 % | simuliert |
| Mittlerer Gewinn je Gewinnrunde | 2,91× | abgeleitet |
| Standardabweichung | 21,14× je Runde | simuliert |
| Free Spins | 1 in 222 Runden; im Mittel 8,21 Spins; mittlerer Feature-Gewinn 67,90× | simuliert |
| Temple Bonus | 1 in 326 Runden; Erwartungswert 50,97× (exakt), 50,83× (simuliert) | beides |
| Höchstgewinn 10 000× | 1 in 3,03 Mio. Runden | simuliert |
| Feature-Kauf | mittlerer Gewinn 56,16×; RTP bei 58× = 96,83 % (96,77–96,90); zuvor abgeleitet 96,81 % | simuliert, 100 Mio. Käufe auf 1.0.0 |
| Retrigger | in 1,36 % der Features; 1 je 596 Free Spins | simuliert, 100 Mio. Runden |
| Mittlerer Multiplikator je Gewinnkaskade | Basisrunde 1,42 · Free Spins 9,47 | simuliert, 100 Mio. Runden |
| Weitere RTP-Varianten | **nicht vorhanden** | – |

Der Abnahmelauf wurde am 25.11.2026 auf der ausgelieferten Konfiguration 1.0.0
(Hash `943082d6…98e3`) wiederholt und ist bitgenau identisch mit dem früheren Lauf auf 0.3.2. → `05`

## F. Technical Overview

Drei Schichten: Engine (reine Logik, deterministisch aus einem Seed), Sitzung (Guthaben, Verlauf),
Client (spielt ein Ereignisprotokoll ab). Zufallsgenerator xoshiro256** hinter einer
austauschbaren Schnittstelle. Lokal und als statische Webseite lauffähig.

Für eine Plattform-Integration fehlen: Server/RGS, Wallet, Sitzungen, Wiederaufnahme,
Jurisdiktions-Einstellungen. In der Demo läuft die Logik im Browser – für Echtgeld ungeeignet
und so auch nicht gedacht. → `06`

## G. Art & Audio Overview

Bildwelt aus Stein, Gold, Jade und Türkis mit dem Sonnenmotiv als rotem Faden; 9 Symbole,
5 Stationsmedaillons, Sun Relic, 3 Kammertore (zu/offen), 4 Hintergründe, Rahmen, Logo;
15 Soundeffekte und 2 Musikschleifen; Schriften Cinzel und Source Sans 3 (OFL).

Alle Bilder und Töne sind **KI-erzeugt und nicht von Hand überarbeitet**; die Symbole sind
Standbilder. Der Ton wurde vom Projektinhaber angehört: «Die Musik und die Töne klingen gut und
passen zum Slot» (25.11.2026). → `07`, Rechte → `09`

## H. Development Status

| Fertig | Teilweise | Offen |
|---|---|---|
| Regeln, Engine, alle Features | Mathematik (eine Variante, intern geprüft) | Zertifizierung |
| Web-Demo, zwei Formate, zwei Sprachen | Tests (nur Chromium) | echte Geräte, Safari |
| Simulator, Zweitimplementierung, Dokumentation | Ton (eingebunden, ungehört) | Rechteklärung, Marke |
| Präsentationsmodus | Bilder (vollständig, KI, Standbilder) | Server, Wallet, Wiederaufnahme |

→ `12`

## I. QA & Testing

86 automatische Tests bestanden · Volltest im Browser in sechs Formaten bestanden (25.11.2026,
nach einem behobenen Layoutfehler) · Zusatzprüfungen in fünf weiteren Formaten bestanden ·
Langzeittest über 300 Runden stabil · Ergebnisse in allen drei Tempo-Modi identisch ·
Clusterregel in 4000 echten Runden nachgeprüft · Zweitimplementierung identisch.

Vom Projektinhaber ausgeführt (25.11.2026): Test auf einem iPhone 15 Pro («sehr gut») und
Hörprüfung (positiv) – jeweils als persönlicher Eindruck ohne Messwerte.
Nicht ausgeführt: weitere Geräte, Safari/Firefox am Desktop, Leistungsmessung auf Hardware, RNG-Testbatterie,
Spielertest, externe QA. → `08`

## J. Commercial Proposal

| Modell | Kern | Haltung |
|---|---|---|
| A – Publishing | Anbieter vertreibt, Entwickler bleibt Studio; Beteiligung, evtl. Vorschuss | bevorzugt |
| B – Exklusive Lizenz | befristete Exklusivität, Vorauszahlung, Beteiligung, Rückfallrechte | offen |
| C – IP-Verkauf | einmalige Übertragung aller Rechte | möglich; setzt geklärte Rechte voraus |

Keine Preise, kein vorliegendes Angebot, kein bisheriger Kontakt. → `10`

## K. Development Roadmap

1. **Vor dem ersten Kontakt:** Geräteprüfung · Ton anhören · Erstberatung zu Rechten und
   Rechtsform · Folien und kurzes Video · Demo-Link für Dritte.
2. **Nach erstem Interesse:** Anforderungen des Programms · Bild/Ton ersetzen oder überarbeiten ·
   Markenrecherche · fehlende Simulationsläufe · RTP-Varianten.
3. **Integration:** Engine auf den Server des Partners, Wallet, Wiederaufnahme, Einstellungen je
   Markt, gegebenenfalls neuer Client.
4. **Prüfung und Start:** Zertifizierung, Gerätematrix, Lasttests, Marketing.

→ `12` Abschn. 4

---

## Bereitschaft

| Zweck | Bereit? |
|---|---|
| Informelles Erstgespräch mit Demo und diesem Paket | **ja, mit offener Benennung der Lücken** – iPhone-Test und Hörprüfung sind durch den Projektinhaber erfolgt |
| Formelle Einreichung in ein Partnerprogramm | **nein** – Rechte, Geräte, Ton fehlen |
| Verhandlung eines IP-Verkaufs | **nein** – Rechtekette ungeklärt |
| Zertifizierung | **nein** – braucht Plattform und Prüflabor |

Abschliessende Prüfung mit Freigabe-Entscheidung: `FINAL_PROVIDER_READINESS_REPORT.md`.

## Inhalt des Pakets

`01_Executive_Summary` · `02_Game_Fact_Sheet` · `03_Game_Design_Overview` · `04_Feature_Overview` ·
`05_Math_Overview` · `06_Technical_Overview` · `07_Art_And_Audio_Inventory` ·
`08_QA_And_Test_Report` · `09_IP_And_Licensing_Register` · `10_Commercial_Models` ·
`11_Provider_Pitch_Structure` · `12_Open_Issues_And_Risks` · `13_Source_References`
