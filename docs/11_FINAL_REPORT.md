# 11 – Final Polish: Abschlussbericht

Stand: 25. November 2026 · Konfiguration 1.0.0 (unverändert) · Demo, kein Echtgeld

Grundsatz dieses Berichts: Was nicht geprüft wurde, steht als offen da. Eine interne Simulation ist
keine unabhängige Zertifizierung. Die Noten am Ende sind meine eigene Einschätzung, kein Urteil
eines Anbieters oder Prüflabors.

## 1. Was geändert wurde

| Bereich | Änderung |
|---|---|
| Walzenwechsel | Alte und neue Symbole bewegen sich je Spalte als ein durchgehender Streifen. Das kurz leere Spielfeld zwischen zwei Spins gibt es nicht mehr. |
| Titelbildschirm | Logo mit Lichtschein, Claim mit Zierlinie, goldener START-Knopf (mindestens 56 Bildpunkte hoch), Demo-Hinweis, kurzer Einblend- und Übergangseffekt. |
| Free Spins | In den letzten zwei Free Spins wird die Umgebung dunkler, das Spielfeld tritt hervor (zusätzlich zu Zählerpuls und Ton). Die Abschlusstafel nennt jetzt: gespielte Free Spins, Gesamtgewinn, höchsten Multiplikator, Siegel, und dass es in die Basisrunde zurückgeht. |
| Sun Relic | Das Relikt-Emblem erscheint mit seinem Wert auf dem Feld, bevor das Feld zum Wild wird. Reine Darstellung. |
| Präsentationsmodus | Neu: vier vorbereitete Runden mit festen Seeds, dauerhaft als «DEMONSTRATION» beschriftet (Abschnitt 13). |
| Tablet (Hochformat) | Expedition Track erhält mehr Höhe, die Medaillons sind grösser. |
| Tests | Neues Browser-Prüfskript `tools/e2e/final.cjs` (`npm run e2e:final`). |
| Dokumente | Dieser Bericht; Demo-Anleitung im Publisher-Paket ergänzt. |

## 2. Visuelle Verbesserungen

Titelbildschirm mit klarer Handlung statt blinkendem Text; Relikt-Moment sichtbar; Abschlusstafel
der Free Spins vollständiger; Lichtstimmung der letzten Free Spins; grösserer Track auf Tablets.
Symbole, Hintergründe und Logo sind **unverändert** (keine neuen Bilder in diesem Schritt).

## 3. Animationen

- Walzenwechsel als durchgehende Bewegung (380 ms je Spalte, 60 ms Versatz von links nach rechts).
- Einblenden des Titelbildschirms in Stufen, Übergang ins Spiel in rund 0,4 s mit warmem Lichtblitz.
- Relikt-Moment rund 0,9 s.
- Bei «reduzierter Bewegung» werden alle drei durch kurze Überblendungen ersetzt.

## 4. Mobile Probleme behoben

- Startknopf als grosse, eindeutige Tippfläche (der ganze Bildschirm startet weiterhin).
- Tablet-Hochformat: Track war im Verhältnis zu klein.
- Im Browser-Test in fünf Formaten (360×640, 430×932, 768×1024, 1366×768, 1920×1080): alle Texte
  und Knöpfe im Bild, kein Knopf unter 40 Bildpunkten.

**Nicht behoben, weil nicht prüfbar:** Verhalten auf echten Geräten und in Safari. Ich habe kein
Gerät zur Verfügung; Rückmeldungen vom iPhone 15 Pro liegen bisher nur zu Tempo vor.

## 5. Technische Fehler behoben

- Leeres Spielfeld beim Walzenwechsel (Darstellungsfehler, kein Logikfehler).
- Wiedergaben setzen die Guthabenanzeige vor Beginn auf den echten Stand.

Es wurde kein Fehler in Spiellogik oder Buchführung gefunden.

## 6. Bestandene Tests

| Prüfung | Ergebnis |
|---|---|
| Typprüfung, 86 automatische Tests (Stand nach der Regelbestätigung; beim Final-Polish 82) (Engine, Sitzung, Layout, Regeltexte, Zeiten) | bestanden |
| Engine, Sitzungsschicht und Konfiguration gegenüber dem Stand vor der Oberflächenarbeit | 0 geänderte Zeilen |
| Titelbildschirm und Layout in fünf Formaten | bestanden |
| Walzenwechsel: geringste Zahl Symbole im Feld über 484 geprüfte Bilder | 27 von 30 (Grenze 24: eine Reihe quert gerade den Rand) |
| Präsentationsmodus: alle vier Schritte, Raster gleich Ereignisprotokoll, Guthaben und Verlauf unverändert, danach normales Spiel möglich | bestanden |
| Schnelltest (16 Runden mit Bonus, Handyformat) | bestanden |
| Volltest in sechs Formaten | Erster Lauf **fehlgeschlagen**: im Querformat überlappte der Free-Spins-Zähler die Tempo-Knöpfe (Fehler aus der Tempo-Umstellung, bis dahin unentdeckt). Behoben; Wiederholung: bestanden (sechs Formate, 102 Runden, 9 Bonusrunden und 15 Kammerwahlen über die Oberfläche) |
| Langzeittest | bestanden: 300 Runden, Speicher 18,9–19,8 MB ohne Anstieg, 47 Objekte, keine hängenden Animationen |
| Zeitmessung der drei Modi | bestanden: Gewinn je Seed in allen Modi identisch. Free Spin ohne Gewinn im Handyformat: Normal 3,5 s · Fast 2,2 s · Skip 1,5 s (bei nur 16–17 Bildern/s im Testbrowser; auf Geräten kürzer) |
| Sichtprüfung per Bildschirmfoto: Titel, Walzenwechsel, Relikt-Moment, letzte Free Spins, Abschlusstafel, vier Demonstrationsschritte | durchgeführt |

Alle Browser-Tests laufen in Chromium ohne Grafikkarte (9–17 Bilder pro Sekunde). Sie belegen
Abläufe und Layout, **nicht** die Bildrate oder das Tempo auf echten Geräten.

## 7. Offene Tests

1. Echte Geräte: iPhone (Safari), Android (Chrome), Tablet – Prüfliste in `08_DEVICE_TEST_CHECKLIST.md`.
2. Safari und Firefox am Desktop.
3. Ton: Ich kann nichts anhören. Lautstärkeverhältnisse, Musikschleifen und Wirkung sind ungeprüft.
4. Bildrate und Ladezeit auf echter Hardware und im Mobilfunknetz (Auslieferung rund 5,6 MB).
5. Unabhängige Prüfung von Mathematik und Zufallsgenerator durch ein Prüflabor.
6. Verständnistest mit echten Spielern (wird das Expedition-System ohne Erklärung verstanden?).

## 8. Mathematik unverändert?

**Ja.** Keine Datei unter `src/engine`, `src/session` oder `config` wurde berührt
(`git diff pre-polish HEAD -- src/engine src/session config` ergibt 0 Zeilen; Konfigurations-Hash
unverändert, vom Test `frozen-config` geprüft). RNG, RTP, Gewichte, Auszahlungen, Trefferquote,
Bonus- und Free-Spin-Wahrscheinlichkeiten, Multiplikatoren, Höchstgewinn und Ereignisreihenfolge
sind unverändert. Alle neuen Anzeigen lesen nur das Ereignisprotokoll.

Messwerte (intern simuliert, **nicht** zertifiziert): RTP 95,995 % (2 Mrd. Runden, 95-%-Intervall
95,902–96,088), Trefferquote 32,80 %, Free Spins 1 in 222, Temple Bonus 1 in 326, Feature-Kauf-RTP
96,81 %.

## 9. Nicht vollständig umgesetzt

| Punkt aus dem Auftrag | Stand |
|---|---|
| «Sun Relic» als eigenes Walzensymbol | Entschieden am 25.11.: kein Walzensymbol. Das Relikt ist als zentrales Artefakt visuell eingebunden (`13_SUN_RELIC.md`), ohne Änderung der Mathematik. |
| Mindestcluster 8 (so im Auftragstext) | Geklärt am 25.11.: 5 ist die beabsichtigte, endgültige Regel (`12_CLUSTER_RULE_CONFIRMATION.md`). Keine Abweichung mehr. |
| Animierte Symbole (Einzelbild-Animationen) | Nicht vorhanden; Symbole sind Standbilder mit Licht- und Bewegungseffekten. |
| Dschungel-Atmosphäre als Tonspur | Nicht ausgeliefert (der Generator lieferte nur 2 Sekunden). |
| Wiederaufnahme einer unterbrochenen Runde nach Neuladen | Nicht vorhanden (braucht einen Server). |
| Neue Symbolgrafiken | Keine neuen Bilder in diesem Schritt; drei Goldsymbole bleiben einander ähnlich. |

## 10. Was für einen Provider-Pitch noch fehlt

- Bestätigung auf echten Geräten samt Bildrate, und eine Abnahme des Tons durch einen Menschen.
- Geklärte Rechtekette: KI-erzeugte Bilder, Töne und KI-unterstützter Code sind rechtlich nicht
  geprüft; keine Markenrecherche zum Titel. Ich kann dazu keine Bestätigung geben.
- Weitere RTP-Varianten (üblich sind mehrere; vorhanden ist eine).
- Prüfbericht eines unabhängigen Labors (Mathematik, RNG).
- Ein Trailer oder Gameplay-Video (Konzept liegt vor, Video nicht).
- Angaben des Anbieters: verlangtes Framework, Zielmärkte, Zertifizierungsweg – offen, nicht erfunden.

## 11. Bewertung vorher und nachher

«Vorher» ist der Stand des letzten Abschlussberichts (`09`), «nachher» der jetzige. Eine Note über
7 vergebe ich nur, wo die Funktion auch geprüft ist; fehlende Geräte- und Hörprüfung begrenzen
mehrere Zeilen bewusst.

| Kategorie | Vorher | Nachher | Begründung |
|---|---|---|---|
| Art Direction & Grafik | 7,5 | 7,5 | unverändert; einheitliche Welt, aber nur Standbilder und ohne menschliche Überarbeitung |
| Logo & Markenwirkung | 7 | 7,5 | Logo jetzt gross und ruhig inszeniert; Markenrecherche fehlt |
| Symbolqualität | 7 | 7 | unverändert; drei Goldsymbole ähnlich, Lesbarkeit bei Farbfehlsichtigkeit ungeprüft |
| Spieloberfläche | 8 | 8 | klare Zonen; unverändert gut |
| Mobile UX | 6 | 6,5 | fünf weitere Formate geprüft, Tablet verbessert; **kein echtes Gerät** |
| Animationen | 7 | 7,5 | Walzenwechsel durchgehend, Relikt-Moment; keine Symbolanimationen |
| Cascades | 7 | 8 | kein leeres Feld mehr, per Messung belegt |
| Expedition System | 8 | 8 | Relikt sichtbarer; Spielertest fehlt |
| Free Spins | 8 | 8,5 | Spannung in den letzten Spins, vollständige Abschlusstafel |
| Temple Bonus | 8 | 8 | unverändert |
| Sound & Atmosphäre | 4 | 4 | **nie angehört**; ohne Hörprüfung keine höhere Note |
| Technische Stabilität | 7 | 7,5 | zusätzliche Prüfungen; nur Chromium |
| Provider-Präsentation | 5 | 7 | Präsentationsmodus und Titelbildschirm; Geräte, Ton, Rechte und Video fehlen |

**Gesamteindruck: rund 7,5 von 10.** Das Ziel 9/10 ist **nicht erreicht**, und ich kann es mit
Arbeit an der Oberfläche allein nicht erreichen: Die fehlenden Punkte liegen bei Geräteprüfung,
Ton, Rechten und unabhängiger Prüfung.

## 12. Die fünf wichtigsten verbleibenden Schwächen

1. **Keine Prüfung auf echten Geräten und in Safari** – das grösste Risiko für eine Vorführung.
2. **Ton ungeprüft** – niemand hat die 17 Tondateien im Spielzusammenhang beurteilt.
3. **Rechtekette offen** – KI-Bilder, KI-Töne, Titelmarke.
4. **Nur Standbild-Symbole** – im Vergleich zu aktuellen Premium-Titeln fehlen Symbolanimationen.
5. **Eine einzige RTP-Variante und keine unabhängige Prüfung** der Mathematik.

## 13. Präsentationsmodus

Start: Adresse mit `?demo=1`, oder im Spiel **i → Einstellungen → Demonstration starten**.

| Schritt | Seed | Zeigt | Rundengewinn |
|---|---|---|---|
| 1 | 5 | Gewinn, zwei Kaskaden, Discovery und Treasure | 2,20× Einsatz |
| 2 | 57 | sechs Kaskaden, Expedition bis zum Relikt, wachsender Multiplikator | 11,30× |
| 3 | 697 | drei Kompasse, 8 Free Spins, Base Camp, Sonnenbonus, Abschlusstafel | 38,80× |
| 4 | 1168 | Expedition erreicht den Tempel: Temple Bonus mit drei Kammern | 42,30× |

- Ein goldenes Schild «DEMONSTRATION n/4» bleibt die ganze Zeit sichtbar.
- Nichts ist gestellt: Jede Runde berechnet die Engine aus ihrem Seed, auf demselben Weg wie eine
  Wiedergabe aus dem Verlauf. Die Seeds wurden durch Suche in gewöhnlichen Ergebnissen gefunden.
- Es sind **ausgewählte, nicht typische** Runden. Die meisten Runden gewinnen nichts
  (Trefferquote 32,8 %). Das sollte in einer Vorführung gesagt werden.
- Guthaben und Verlauf bleiben unberührt; danach läuft das normale Demo-Spiel weiter.
- «Demonstration beenden» in den Einstellungen stoppt nach der laufenden Runde.

## 14. Start- und Testanleitung

**Am einfachsten (auch iPhone):** die private Demo-Seite öffnen
<https://claude.ai/artifact/Dz7DwGMV6EqcvNEZfLtJqa> und START tippen. Die Demonstration dort über
**i → Einstellungen** starten.

**Lokal am Rechner:**

```bash
npm install
npm run build && npm run build:client
npx vite preview --port 4173        # dann http://localhost:4173/ öffnen
```

Nützliche Adresszusätze: `?demo=1` (Demonstration), `?lang=de`, `?speed=normal|fast|skip`,
`?seed=1168` (feste Runden, ohne Titelbildschirm), `?motion=reduced`.

**Automatische Prüfungen** (bei laufender Vorschau auf Port 4173):

```bash
npm run typecheck && npm test       # 86 Tests
npm run e2e:quick                   # 16 Runden im Handyformat
npm run e2e:final                   # Titel, fünf Formate, Walzenwechsel, Demonstration
npm run e2e                         # Volltest in sechs Formaten (langsam)
```

**Kurzprüfung von Hand (10 Minuten):**

1. Titel erscheint, START reagiert beim ersten Tippen, Ton setzt ein.
2. Zehn Spins in Normal: Das Spielfeld ist beim Walzenwechsel nie leer.
3. Fast und Skip wählen: Tempo ändert sich sofort, Ergebnisse bleiben lesbar.
4. Demonstration starten und alle vier Schritte ansehen; im Bonus eine Kammer wird automatisch geöffnet.
5. Danach normal weiterspielen: Guthaben ist wie vor der Demonstration.
6. **i → Leistung** nach 20 Runden: Bildrate notieren und mir mitteilen.
7. Gerät quer drehen, App wechseln und zurückkehren: Spiel läuft weiter, kein doppelter Spin.
