# FINAL PROVIDER READINESS REPORT

**TEMPLE OF THE LOST SUN** · Stand: 25. November 2026 · Spielkonfiguration 1.0.0

Diese Prüfung hat **keine Spielmechanik und keinen mathematischen Parameter verändert.**
Engine, Sitzungsschicht und Konfiguration sind unberührt (Konfigurations-Hash unverändert,
automatisch geprüft). Neu sind drei Simulationsläufe, ein reines Messwerkzeug
(`tools/sim/extra-stats.ts`) und Korrekturen an Dokumenten.

Begriffe in diesem Bericht:
**intern geprüft** = vom Entwickler mit eigenen Werkzeugen gemessen oder getestet ·
**extern geprüft** = von einer unabhängigen Stelle bestätigt · **zertifiziert** = von einem
akkreditierten Prüflabor bescheinigt. **Extern geprüft oder zertifiziert ist nichts.**

---

## Nachtrag vom 25.11.2026: Rückmeldung des Projektinhabers

Nach Abschluss dieser Prüfung hat der Projektinhaber gemeldet:

> «Die Musik und die Töne klingen gut und passen zum Slot.»
> «Ich habe die Demo auf meinem iPhone 15 Pro getestet und finde es sehr gut.»

Einordnung:

| Punkt | Stand vorher | Stand jetzt |
|---|---|---|
| Hörprüfung | nicht durchgeführt | **durch den Projektinhaber durchgeführt, positiv.** Persönlicher Höreindruck; keine technische Prüfung von Lautheit oder Schleifenpunkten, keine Zweitmeinung |
| Echter iPhone-Test | nicht durchgeführt | **durch den Projektinhaber auf einem iPhone 15 Pro durchgeführt, positiv.** Ein Gerät; Browser, Bildrate, Ladezeit und die Punkte der Prüfliste sind nicht mitgeteilt |
| Bedingung 1 für das Erstgespräch (Abschn. 7) | offen | **erfüllt** |

Weiterhin offen: Android-Gerät und Tablet, Safari und Firefox am Desktop, gemessene Bildrate und
Ladezeit, die schriftliche Prüfliste (`docs/08_DEVICE_TEST_CHECKLIST.md`). Unverändert bleiben
alle Rechtefragen – auch für den Ton (siehe `IP_AND_LICENSE_AUDIT/`): Dass die Töne gut klingen,
sagt nichts darüber, ob sie in einem Echtgeld-Slot verwendet werden dürfen.

Die Abschnitte unten zeigen den Stand **vor** dieser Rückmeldung; betroffene Zeilen sind markiert.

---

## 0. Was in dieser Prüfung gemacht wurde

| Schritt | Ergebnis |
|---|---|
| Abnahmelauf mit exakt der ausgelieferten Konfiguration 1.0.0 (2 Mrd. Runden, Seed 20261126) | RTP 95,9950 %; **alle Zähler bitgenau identisch** mit dem früheren Lauf auf 0.3.2 |
| Vergleich der Konfigurationen 0.3.2 und 1.0.0 im Versionsverlauf | einzige Unterschiede: Versionsnummer und Block «Feature-Kauf» |
| Feature-Kauf direkt bei 58× auf 1.0.0 (100 Mio. Käufe, Seed 20261129) | RTP 96,831 % (96,767–96,895) – bestätigt den abgeleiteten Wert 96,81 % |
| Zusatzlauf für Retrigger und Multiplikator (100 Mio. Runden, Seed 20261128) | Werte erstmals vorhanden (Abschn. 2) |
| Regelprüfung am Code und in Tests | alle neun genannten Regeln bestätigt (Abschn. 1) |
| Abgleich aller ausgelieferten Dateien mit dem Asset-Register | zwei Tondateien fehlten im Register, eine Längenangabe war veraltet – nachgetragen |
| Durchsicht der 13 Dossier-Dokumente und des englischen Publisher-Pakets | sieben Dokumentationsfehler korrigiert (Abschn. 9) |

Konfigurations-Hash (SHA-256 des kanonischen JSON):
`943082d640a065931a87d21e3bb84a953ae27ba653531d4303b22857d75698e3`
(in den Simulationsberichten auf 16 Stellen gekürzt: `943082d640a06593`).

---

## 1. Bestätigte Produktdaten

Bestätigt heisst hier: am Code und an der Konfiguration nachgelesen **und** durch automatische
Tests abgedeckt. Intern geprüft, nicht extern.

| Regel | Bestätigt | Nachweis |
|---|---|---|
| Raster 6×5, jedes Feld unabhängig gezogen | ja | Konfig. Z. 3–4; `src/engine/grid/grid.ts` |
| Mindestcluster **5** | ja | Konfig. Z. 5; `round.ts` Z. 347; Test `cluster-rule` (4000 echte Runden, kleinster Cluster genau 5) |
| Keine diagonalen Verbindungen | ja | `clusters.ts` Z. 36–41 (vier Nachbarn); Tests: Diagonale aus fünf zahlt nichts |
| Expedition Track: Stationen nach 1·2·4·6·9 Schritten; 1 Schritt je Gewinnkaskade, +1 je Temple Key | ja | Konfig. Z. 92–98; `round.ts` Z. 366–371 |
| SUN = Sonnenbonus S, additiver Teil des Multiplikators M = T + S; Basisrunde: Rücksetzung je Spin; Free Spins: bleibt erhalten; im Temple Bonus ohne Wirkung | ja | `round.ts` Z. 329, 350, 174 |
| Sun Relic = Wirkung von Station 4, **kein Walzensymbol** (kein Gewicht, kein Paytable-Eintrag) | ja | Konfig. Z. 8–29 (kein Eintrag), `round.ts` Z. 300–311 |
| Free Spins: 3/4/5+ Compass → 8/10/12; Retrigger +4 bei 3+ Compass; höchstens 30; Base Camp 1–3 | ja | Konfig. Z. 145–168; `round.ts` Z. 191–230 |
| Temple Bonus: Station 5 in der Basisrunde; 3 Kammern; Preise vor der Wahl gezogen und gemischt; höchstens ein Hauptschatz; Relic Bonus gibt eine weitere Kammer | ja | Konfig. Z. 169–212; `round.ts` Z. 159–189, 232–250 |
| Temple Finale: 1–3 Siegel aus den Free Spins (höchstens 1 je Spin), eigene Preistabelle je Siegelzahl, Hauptschatz 2 500 / 5 000 / 10 000× | ja | Konfig. Z. 213–320; `round.ts` Z. 204–209 |
| Feature-Kauf: 58× Einsatz, 8 Free Spins ab Base Camp 1, abschaltbar | ja | Konfig. Z. 326–331; `round.ts` Z. 148–157 |
| Höchstgewinn 10 000× Einsatz je Runde | ja | Konfig. Z. 7; `round.ts` Z. 252–262 |

**Einheitliche Bezeichnungen.** Die Regeln sind in allen Dokumenten gleich. Eine Uneinheitlichkeit
bleibt in den Namen des Feature-Kaufs: im Spiel «BUY EXPEDITION» / «Expedition kaufen», im
englischen Publisher-Paket teils «Buy feature», im Dossier «Feature-Kauf». Gemeint ist dasselbe;
im Fact Sheet ist das jetzt vermerkt. Für Provider-Folien empfehle ich durchgehend
«Buy Expedition (feature buy)».

---

## 2. Bestätigte mathematische Daten

Alle Werte: **intern simuliert oder intern berechnet, nicht extern geprüft, nicht zertifiziert.**
Konfiguration 1.0.0, Hash wie oben.

| Kennzahl | Wert | Grundlage |
|---|---|---|
| RTP normale Runden | **95,9950 %**, 95-%-Intervall 95,9024–96,0877 % | 2 Mrd. Runden auf 1.0.0 |
| Ziel-RTP | 96,00 % – Entwurfsziel, kein Messwert; das Ziel liegt im Intervall | – |
| Standardabweichung je Runde | 21,141× Einsatz | wie oben |
| Hit Frequency | 32,795 % | wie oben |
| Win Frequency | 33,011 % | wie oben |
| Free Spins | 1 in 222,1 Runden (über Compass 1 in 238,1; über den Bonus 1 in 3267) | wie oben |
| Temple Bonus (Basisrunde) | 1 in 326,1 Runden | wie oben |
| Höchstgewinn erreicht | 659-mal = 1 in 3 034 901 Runden | wie oben |
| Retrigger | in 1,360 % der Features (1 in 73,5); 1 je 596 Free Spins; 1 in 16 305 Runden | 100 Mio. Runden auf 1.0.0 |
| Mittlerer Multiplikator je Gewinnkaskade | Basisrunde 1,42 · Free Spins 9,47 · gesamt 1,91 (gewinngewichtet 1,46 / 9,94 / 2,06) | wie oben |
| Feature-Kauf bei 58× | **96,831 %**, Intervall 96,767–96,895 %; mittlerer Gewinn 56,162×; Std.-Abw. 189,58× | 100 Mio. Käufe auf 1.0.0 |

### Sind 0.3.2 und 1.0.0 dieselben Spielwerte?

**Ja, nachgewiesen.** (a) Der Versionsverlauf zeigt zwischen beiden Konfigurationen nur die
Versionsnummer und den Feature-Kauf-Block. (b) Der Lauf auf 1.0.0 mit demselben Seed ergibt
dieselbe Gewinnsumme (191 990 090 170 Hundertstel-Einsätze), dieselben Verteilungen und dieselben
zehn grössten Gewinne wie der Lauf auf 0.3.2. Einschränkung: Wegen des gleichen Seeds ist das
eine Gleichheitsprüfung, **keine zweite statistische Stichprobe**.

### RTP-Aufteilung (geprüft)

| Quelle | Anteil | Gegenprobe |
|---|---|---|
| Cluster Basisrunde | 49,836 % | – |
| Temple Bonus Basisrunde | 15,588 % | Häufigkeit 1/326,1 × Mittelwert 50,826× = 15,59 % ✓ |
| Cluster Free Spins | 25,738 % | – |
| Temple Finale | 4,834 % | Summe über 1/2/3 Siegel aus den Einzelzählern ✓ |
| **Summe** | **95,995 %** | die vier Teilsummen ergeben exakt die Gewinnsumme ✓ |

Basisrunde zusammen 65,42 %, Free-Spin-Feature zusammen 30,57 %. Gegenprobe Feature:
9 004 289 Features × 67,90× mittlerer Gewinn ÷ 2 Mrd. Runden = 30,57 % ✓.

### Warum 32,80 % und 33,01 %?

Es sind zwei verschiedene Grössen aus demselben Lauf, kein Widerspruch:

- **32,80 % Hit Frequency:** Runden, deren **Basis-Spin** mindestens einen Cluster hat.
- **33,01 % Win Frequency:** Runden, die **irgendetwas** auszahlen.

Die Differenz (0,216 Prozentpunkte) sind Runden ohne Cluster im Basis-Spin, die über drei
Compass-Symbole Free Spins auslösen und dort gewinnen. In Provider-Unterlagen sollte als
«Hit Frequency» 32,80 % stehen und die zweite Zahl, wenn überhaupt, als «rounds with any win».

### Konsistenz Basisrunde – Free Spins – Temple Bonus

| Prüfung | Ergebnis |
|---|---|
| Erwartungswert Temple Bonus: exakt berechnet 50,971× gegen simuliert 50,826× | stimmt innerhalb der Streuung |
| Finale 1 / 2 Siegel: exakt 63,360 / 174,954 gegen simuliert 63,034 / 176,550 | stimmt |
| Finale 3 Siegel: exakt 476,347 gegen simuliert 454,174 | simuliert tiefer, **erklärt** durch die Kappung bei 10 000× (Hauptschatz 10 000× plus Vorgewinne) |
| Free Spins aus dem Basis-Bonus: exakt 9,991 % gegen simuliert 9,980 % | stimmt |
| Feature-Kauf (8 Spins, Base Camp 1) 56,16× gegen natürliches Feature 67,90× | plausibel: natürliche Features enthalten auch 10 und 12 Spins, höheres Start-Camp und Bonus-Free-Spins |
| Unabhängige Zweitimplementierung (Python), Runde für Runde | identisch (zuletzt 80 000 Runden am 25.11.2026) |

**Eine ehrliche Auffälligkeit:** Der Feature-Kauf hat mit 96,83 % einen um rund 0,84
Prozentpunkte höheren RTP als das normale Spiel. Das ist eine bewusste Entscheidung des
Eigentümers (runder Preis 58×), im Spiel offen ausgewiesen, aber ein Provider wird danach fragen;
viele Märkte und Betreiber erwarten gleiche oder ausgewiesene RTP-Werte je Spielmodus.

---

## 3. Noch nicht unabhängig geprüfte Daten

**Alles.** Im Einzelnen:

| Gegenstand | Stand |
|---|---|
| RTP, Trefferquote, Volatilität, alle Häufigkeiten | nur intern simuliert |
| Zufallsgenerator (xoshiro256**) | Referenzwerte und Gleichverteilung in eigenen Tests; **keine** statistische Testbatterie (TestU01, PractRand), keine externe Prüfung |
| Volatilitätsklasse | «hoch» ist eine Einordnung des Entwicklers ohne anerkannte Skala |
| Zweite, unabhängige Stichprobe des RTP auf 1.0.0 mit neuem Seed | **nicht vorhanden** (der Lauf vom 25.11. nutzt den alten Seed) |
| Anteil des durch die Kappung abgeschnittenen Gewinns | nicht ausgewiesen |
| Gewinnbeitrag je Station | nicht erfasst |
| Weitere RTP-Varianten | nicht vorhanden |
| Vollständige Enumeration auf einem Miniaturraster als Gegenprobe | nicht durchgeführt |

---

## 4. Technische Einschränkungen

| Punkt | Bedeutung |
|---|---|
| Die Spiellogik läuft in der Demo **im Browser** | für Echtgeld ungeeignet; Engine gehört auf einen Server |
| Zufallsgenerator ist statistisch, nicht kryptografisch | im Betrieb durch den zertifizierten Generator des Anbieters zu ersetzen (Schnittstelle vorhanden) |
| Kein Server, kein RGS, keine Wallet, keine Sitzungen | vollständig offen |
| Keine Wiederaufnahme unterbrochener Runden | offen |
| Keine Jurisdiktions-Einstellungen (Autoplay-Grenzen, Mindest-Spindauer, Realitäts-Checks) | offen; nur der Feature-Kauf ist abschaltbar |
| Nur Chromium ohne Grafikkarte getestet | Verhalten auf Geräten unbekannt |
| Auslieferung rund 5,6 MB, nicht aufgeteilt | Ladezeit im Mobilfunknetz unbekannt |
| Symbole 256×256 px, Standbilder | auf grossen, hochauflösenden Bildschirmen knapp |
| Einzeldatei-Fassung öffnet auf iPhone nicht | Vorführung nur über gehostete Seite |
| Lizenztexte (MIT, OFL) nicht im Build | vor jeder Weitergabe ergänzen |
| Schrift-Pakete (`@fontsource`) nicht in `package.json` eingetragen; die Schriftdateien liegen fertig in `public/fonts` | Build funktioniert, die Herkunft ist aber nicht über die Paketliste reproduzierbar |
| Paketversion 0.1.0 gegenüber Spielkonfiguration 1.0.0 | zwei Zähler, nicht abgeglichen |

---

## 5. Offene Rechtefragen

Tatsachenübersicht, kein Rechtsgutachten. Geprüft wurde jede ausgelieferte Datei gegen das
Register.

### Nachgewiesen

| Bestandteil | Nachweis |
|---|---|
| Phaser 3.90.0 | Lizenz MIT (Lizenzdatei im Paket) |
| TypeScript 5.9.3, Vite 6.4.6, Vitest 2.1.9, fast-check 3.23.2 | Apache-2.0 bzw. MIT; nur Werkzeuge, nicht im Spiel |
| Schriften Cinzel, Source Sans 3 | SIL OFL 1.1 (Lizenzdateien in den Paketen) |
| Im Code erzeugte Effekte, Platzhalter, Ersatztöne | eigene Arbeit |
| Herkunft jedes Bildes und jeder Tondatei | im Register mit Werkzeug, Modell und Auftrag dokumentiert (nach den Nachträgen vom 25.11.2026 vollständig) |

Nachgewiesen ist damit die **Herkunft**, nicht das **Recht**, die Werke exklusiv zu verwerten
oder zu übertragen.

### Nicht nachgewiesen – vor Verkauf oder Lizenz zu klären

1. **Nutzungsbedingungen der KI-Werkzeuge** (Higgsfield für alle Bilder, ElevenLabs für allen
   Ton): nicht vollständig gelesen, nicht juristisch geprüft; Tarif zum Erzeugungszeitpunkt nicht
   belegt; Bedingungen des zugrunde liegenden Bildmodells nicht geprüft.
2. **Schutzfähigkeit** rein KI-erzeugter Bilder und Töne: in wichtigen Rechtsordnungen fraglich.
   Es gab **keine menschliche Überarbeitung**. Ausschliessliche Rechte kann der Eigentümer daran
   möglicherweise nicht einräumen.
3. **Quellcode:** mit einem KI-Assistenten geschrieben. Urheberschaft und Schutz sind nicht
   geprüft; es gibt keine Lizenzdatei und keine schriftliche Rechtekette.
4. **Marke:** keine Recherche in Markenregistern; ähnliche Titel existieren.
5. **Ähnlichkeit:** keine Prüfung der Bilder (auch nicht des erzeugten Explorer-Gesichts) und
   der Musik gegen bestehende Werke.
6. **Rechtsform und Gewährleistungen** des Eigentümers: nicht festgelegt.
7. **Kulturelle Prüfung** der erfundenen Bildwelt: nicht erfolgt.

**Es kann nicht gesagt werden, dass die Rechte geklärt sind.**

---

## 6. Noch erforderliche Tests

### Intern durchgeführt (Stand 25.11.2026)

86 automatische Tests bestanden · Browser-Volltest in sechs Formaten bestanden (nach einem
behobenen Layoutfehler) · fünf weitere Formate, Walzenwechsel, Präsentationsmodus bestanden ·
Simulationen und Zweitimplementierung wie oben.

Einschränkung: Langzeittest (300 Runden) und Zeitmessung der Tempo-Modi liefen **vor** dem Einbau
des Sun-Relic-Bildes und wurden danach nicht wiederholt.

### Intern noch zu tun

| Test | Wer |
|---|---|
| **Echter iPhone-Test** – *erledigt laut Nachtrag (iPhone 15 Pro, positiv)*; offen bleiben Bildrate und Prüfliste | Eigentümer |
| Android-Gerät und ein Tablet | Eigentümer |
| **Safari und Firefox** am Desktop | Eigentümer / Entwickler mit Gerät |
| **Soundprüfung** – *erledigt laut Nachtrag (Höreindruck positiv)*; offen bleibt eine technische Prüfung von Lautheit und Schleifenpunkten | Eigentümer |
| **Bild- und Assetqualität** auf echten Bildschirmen (256-px-Symbole, gestauchter Rahmen, KI-Artefakte) | Eigentümer, besser eine Grafikerin oder ein Grafiker |
| **Mobile Performance:** Bildrate («i → Leistung»), Ladezeit im Mobilfunknetz, Erwärmung | Eigentümer |
| Langzeittest und Zeitmessung auf dem aktuellen Build wiederholen | Entwickler |
| Zweite RTP-Stichprobe auf 1.0.0 mit neuem Seed | Entwickler |
| Verständnistest mit unbeteiligten Personen | Eigentümer |

### Extern erforderlich

| Prüfung | Durch |
|---|---|
| Zertifizierung von Zufallsgenerator und Spielmathematik | akkreditiertes Prüflabor, in der Regel über den Provider |
| Prüfung von Regeln und Anzeigen je Jurisdiktion | Provider / Compliance |
| **Technische Provider-Integration:** Server, Wallet, Wiederaufnahme, Gerätematrix, Last- und Sicherheitstests | Provider mit Entwickler |
| **Rechteklärung** (Abschn. 5) | Rechtsberatung |
| Markenrecherche | Markenanwalt oder Rechercheanbieter |

---

## 7. Freigabe für ein informelles Erstgespräch

# JA – unter drei Bedingungen

Die Bedingungen sind keine Formsache:

1. *(erfüllt laut Nachtrag)* **Vorher** die Demo auf mindestens einem echten iPhone durchspielen und den Ton anhören.
   Ein Provider darf nicht der Erste sein, der das tut. Fällt der Ton durch: stumm vorführen.
2. Im Gespräch **von sich aus** sagen: KI-erzeugte Bilder und Töne, Rechte in Klärung, nicht
   zertifiziert, ein Entwickler, keine veröffentlichten Titel.
3. Jede Zahl mit dem Zusatz «intern simuliert, nicht zertifiziert» nennen; 96 % nur als Ziel.

Was das Gespräch trägt: eine eigenständige Mechanik, eine spielbare Demo mit
Präsentationsmodus, eine nachvollziehbare und jetzt auf der ausgelieferten Konfiguration
gemessene Mathematik, saubere Trennung von Logik und Darstellung.

## 8. Freigabe für eine formelle Provider-Einreichung

# NEIN

Gründe, in der Reihenfolge ihres Gewichts:

1. **Rechte nicht geklärt** – der wichtigste Punkt für jedes der drei Geschäftsmodelle, für den
   IP-Verkauf ausschlaggebend.
2. **Geräteprüfung unvollständig:** ein iPhone 15 Pro durch den Projektinhaber (positiv, siehe Nachtrag); Android, Tablet, Safari/Firefox am Desktop und Messwerte fehlen. Der Ton ist angehört, aber rechtlich ungeklärt.
3. **Keine Integration und keine Zertifizierung;** nur eine RTP-Variante.
4. **Unterlagen unvollständig für eine Einreichung:** keine Folien, kein Video, kein für Dritte
   zugänglicher Demo-Link, keine Kontaktdaten und keine Rechtsform im Paket; alle Dokumente ausser
   den Pitch-Texten sind auf Deutsch.
5. Zu Pragmatic Play liegt keinerlei Recherche vor.

---

## 9. Korrigierte Dokumentationsfehler

| Wo | Fehler | Korrektur |
|---|---|---|
| `04_Feature_Overview.md` | Summen der Symbolgewichte falsch (9992 / 9851) | 9792 / 9651 (bereits vor dieser Prüfung berichtigt; Anteile in `05` waren richtig) |
| `05_Math_Overview.md`, Master, `12` | «kein Lauf auf 1.0.0», «Feature-Kauf nur abgeleitet», «Retrigger und Multiplikator fehlen» | durch die neuen Läufe ersetzt |
| `docs/publisher/02_MATH_DOCUMENTATION.md` | «79 automated tests»; Nachweis der Gleichheit nur über 300 000 Runden | 86; Verweis auf den bitgenauen Lauf und den Kauf-Lauf |
| `docs/publisher/06_QA_REPORT.md` | 79 Tests; Volltest «nicht wiederholt» | 86; Volltest bestanden am 25.11.2026 |
| `docs/publisher/05_ASSET_AND_RIGHTS_REGISTER.md` | Sun-Relic-Bild fehlte | ergänzt |
| `assets/ASSET_REGISTER.md` | `retrigger.mp3` und `complete.mp3` fehlten; `bonus.mp3` mit alter Länge 0,5 s | nachgetragen (Herkunft aus dem Erzeugungsverlauf belegt); 1,0 s, zweite Fassung |
| `02_Game_Fact_Sheet.md` | uneinheitliche Namen des Feature-Kaufs | Hinweis ergänzt |

### Bekannte Unschärfen, bewusst nicht geändert

| Punkt | Warum nicht geändert |
|---|---|
| Im Spiel steht beim Feature-Kauf «simulierter RTP 96,81 % (96,74–96,87 %)»; der direkte Lauf ergibt 96,83 % (96,77–96,90 %) | Der angezeigte Wert stammt aus dem ersten Lauf und ist statistisch gleichwertig. Eine Änderung des Regeltexts wäre eine Änderung am Spiel-Client; das entscheidest du. |
| `docs/02_GDD.md` Z. 91 führt das Sun Relic in der Symboltabelle als «Feature-Symbol» | inhaltlich richtig (fällt nie auf die Walzen), aber missverständlich; das GDD ist ein internes Dokument |
| Ältere Berichte (`07`, `09`) nennen 79 bzw. 82 Tests | historische Stände mit Datum |
| `docs/01_CONCEPT_REVIEW.md` nennt Mindestcluster 8 | historische Begründung für die Senkung auf 5 |

---

## 10. Kritische Gesamteinschätzung

Die Stärke des Projekts ist seine Nachvollziehbarkeit: Regeln, Zahlen und Tests lassen sich
Zeile für Zeile belegen, und die Messung liegt jetzt auf der ausgelieferten Konfiguration vor.
Die Schwäche ist alles, was ein Computer allein nicht leisten kann: Bis zur Rückmeldung des Projektinhabers (siehe Nachtrag) hatte niemand das Spiel auf
einem Gerät geprüft oder gehört; kein Jurist hat die Rechte angesehen, und es gibt
weder Markt- noch Spielerdaten. Ein Provider kauft kein Dokument, sondern ein Produkt mit
sauberer Rechtekette und einem lieferfähigen Team. Davon ist das Projekt noch ein Stück entfernt;
für ein ehrliches erstes Gespräch reicht es.
