# 10 – Commercial Models

Stand: 25.11.2026 · Entwurf als Gesprächsgrundlage.

> Dieses Dokument nennt **keine Preise, Vorschüsse oder Prozentsätze**. Dem Projekt liegen keine
> Marktdaten und **kein Angebot** eines Anbieters vor; mit keinem Anbieter bestand Kontakt.
> Nichts hier ist ein annahmefähiges Angebot.

## 1. Was angeboten werden kann

Spielkonzept und Name · Mathematik-Engine mit Konfiguration 1.0.0, Simulator, Zweitimplementierung,
Tests · Demo-Client (Phaser 3) mit allen Bildern und Tönen im heutigen Rechtsstand · Dokumentation.

## 2. Die drei Modelle

### Modell A – Publishing (bevorzugt)

Der Anbieter veröffentlicht und vertreibt das Spiel; der Entwickler bleibt Studio.

- Vertrieb über die Plattform und die Betreiber des Anbieters
- Umsatzbeteiligung, möglicherweise mit Vorschuss
- Technische Integration nach den Vorgaben des Anbieters (Server, Framework, Zertifizierung)
- Marketing und Promotion durch den Anbieter

### Modell B – Exklusive Lizenz

- Exklusivität für einen festgelegten Zeitraum und Rechteumfang (Märkte, Kanäle, Folgetitel)
- Vorauszahlung und laufende Beteiligung
- Rückfall der Rechte bei Nichtveröffentlichung oder nach Ablauf
- Client-Anpassung meist beim Lizenznehmer

### Modell C – Vollständiger IP-Verkauf

- Einmaliger Kaufpreis, eventuell in Raten oder mit erfolgsabhängigem Anteil
- Übertragung aller Rechte an Konzept, Mathematik, Code, Marke; Übergabe von Repository,
  Rohdaten und Dokumentation
- Zusatzleistungen möglich: Einarbeitung, Anpassungen für eine begrenzte Zeit

## 3. Vergleich

| | A – Publishing | B – Exklusive Lizenz | C – IP-Verkauf |
|---|---|---|---|
| Chance | laufende Einnahmen, Aufbau eines Studios, Folgetitel | Einnahmen plus Rückfallrechte; weniger eigene Integrationsarbeit | sofortiger, abgeschlossener Erlös; kein Betriebsrisiko |
| Risiko | Einnahmen ungewiss; viel Integrationsarbeit für eine Einzelperson; Abhängigkeit vom Marketing des Partners | Bindung während der Exklusivität; Erlös hängt vom Engagement des Lizenznehmers ab | kein Anteil an späterem Erfolg; verlangt die sauberste Rechtekette und Gewährleistungen |
| Rechtelage heute | Bild/Ton können ersetzt werden; Code- und Markenfrage bleibt | wie A | **grösste Hürde:** ausschliessliche Rechte an KI-Material fraglich |
| Aufwand für den Entwickler | hoch (Integration, Zertifizierungsbegleitung, Pflege) | mittel | niedrig nach Übergabe |
| Verhandlungspunkte | Vorschuss; Berechnungsbasis der Beteiligung; wer zahlt Zertifizierung und Kunst-Überarbeitung; Laufzeit; Märkte; Rechte an Folgetiteln | Dauer und Umfang der Exklusivität; Mindestgarantie; Rückfallbedingungen; Änderungsrechte | Umfang der Übertragung; Zahlungsplan; Gewährleistung zur Rechtekette; Nennung; Wettbewerbsklauseln |

## 4. Was ein Partner vor einer Bewertung wissen muss

1. Nicht zertifiziert, nicht unabhängig geprüft.
2. Eine RTP-Konfiguration.
3. Rechte an Bild, Ton, Code und Marke nicht geklärt (`09_IP_And_Licensing_Register.md`).
4. Demo auf Phaser 3; bei eigenem Framework Neuaufbau der Darstellung.
5. Ein einzelner Entwickler mit KI-Unterstützung; keine veröffentlichten Titel; kein
   Leistungsnachweis im Markt.
6. Keine Spielerdaten, kein Markttest.

## 5. Fragen, die ein Provider im ersten Gespräch wahrscheinlich stellt

**Produkt**
- Was unterscheidet das Spiel von bestehenden Cluster-Slots mit Fortschrittsleiste?
- Für welche Spielergruppe und welche Märkte ist es gedacht? Gibt es Daten?
- Gibt es weitere Titel oder eine Roadmap?

**Mathematik**
- Welche RTP-Varianten gibt es? Wie schnell sind weitere lieferbar?
- Wie ist die Volatilität nach unserer Skala? Wie hoch ist der Höchstgewinn und wie oft tritt er ein?
- Wer hat die Mathematik geprüft? Können wir Modell und Parameter einsehen?
- Wie verhält sich der Feature-Kauf (RTP, Varianz), und lässt er sich abschalten?

**Technik**
- Läuft das auf unserem RGS und in unserem Framework? Wer integriert?
- Wo läuft die Spiellogik, welcher Zufallsgenerator?
- Auf welchen Geräten und Browsern ist getestet? Ladegrösse? Bildrate?
- Wie wird eine unterbrochene Runde fortgesetzt?

**Recht und Organisation**
- Wem gehört das IP? Woher stammen Bilder, Musik, Code? Wurde KI eingesetzt?
- Ist der Name als Marke geprüft oder angemeldet?
- Wer sind Sie, in welcher Rechtsform, mit welcher Kapazität für Support?

**Kommerziell**
- Welches Modell und welche Konditionen stellen Sie sich vor?
- Exklusivität? Zeitplan bis zur Lieferung?

Ehrliche Antworten auf die meisten dieser Fragen stehen in diesem Paket. Keine Antwort gibt es
bisher auf: Marktdaten, Volatilität nach Anbieterskala, Gerätematrix, Rechtsform, Konditionen.

## 6. Was vom Partner zu erfragen ist

Technische Anforderungen des Programms (Framework, RGS-Schnittstelle, Zertifizierungsweg,
erwartete RTP-Varianten) · Konditionen für einen Ersttitel · Einschätzung, ob Thema und Mechanik
ins Portfolio passen · Haltung zu KI-erzeugtem Material.

## 7. Zu den Zielanbietern

Nur öffentliche Quellen (Websuchen vom 24./25.11.2026, `docs/09_ULTIMATE_READINESS_REPORT.md`
Abschn. 7); **keine eigene Erfahrung, keine Aufnahmekriterien gefunden.**

| Anbieter | Öffentlich belegt | Vorsicht |
|---|---|---|
| BGaming | Fachartikel beschreibt «BGaming Publishing» für Studios (Integration, Vertrieb, Promotion, Analyse) | Bedingungen unbekannt |
| Relax Gaming | Partnerprogramme «Silver Bullet» und «Powered By Relax» | Quellen überwiegend 2018–2021, Aktualität unklar |
| Hacksaw Gaming | Plattform OpenRGS für Partnerstudios seit 2023 | Partner bauen auf Hacksaws Technik – spricht für Neuaufbau des Clients |
| Pragmatic Play | **Im Projekt liegt keine Recherche vor.** Ob und wie externe Studios aufgenommen werden: NICHT VERIFIZIERT | vor Kontakt recherchieren |
