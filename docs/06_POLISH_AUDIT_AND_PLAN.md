# 06 – Premium Publisher Polish: Audit und Designplan

Stand: 2026-11-24 · Status: Phase A und B vorgelegt, **Phase C wartet auf Freigabe**

Grundlage: Client-Stand Commit `1535797` (Branch `claude/awesome-heisenberg-7vbnfn`), Konfiguration v1.0.0 (eingefroren). Untersucht mit emulierten iPhone-Ansichten (SE 375×667, 14 390×844, 14 Pro Max 430×932, 14 quer) in Chromium, Bildfolgen während Kaskaden, Free Spins und Temple Bonus sowie Durchsicht von `src/client`.

**Einschränkung der Untersuchung:** Echtes Mobile Safari (WebKit) steht in dieser Umgebung nicht zur Verfügung; die iPhone-Ansichten sind Chromium mit iPhone-Abmessungen. Safari-spezifische Punkte unten sind deshalb aus dem Code abgeleitete Risiken, keine Messungen.

Bildbelege: `docs/polish/audit_layouts.jpg`, `audit_header_se.jpg`, `audit_cascade.jpg`, `audit_bonus.jpg`.

## Phase A – Audit

Schweregrad: **H** hoch (fällt einem Publisher sofort auf) · **M** mittel · **N** niedrig.

### A1 Header und Kopfbereich

| ID | Befund | Grad |
|---|---|---|
| A-01 | Fünf Elemente teilen sich eine Zeile von rund 64 px: Logo, «Ton an», «i», Multiplikator, Free-Spin-Zähler. Auf 375 px Breite berühren sich Logo und Ton-Knopf. | H |
| A-02 | **Ursache der «Textfragmente»:** Der Ton-Knopf zeigt zweizeiligen Text («Ton / an») in einem Kasten vor der Sonnenscheibe des Hintergrunds. Der Info-Knopf wird während einer Runde auf 40 % Deckkraft gesetzt und wirkt dann wie ein leerer, halb sichtbarer Kasten mit einem Strich. Beides liest sich wie ein abgeschnittenes Textfeld. | H |
| A-03 | Der Free-Spin-Zähler steht rechtsbündig unter dem Multiplikator und läuft in den Info-Knopf. Er ist der kleinste Text im Kopf, obwohl er in Free Spins die wichtigste Angabe ist. | H |
| A-04 | «DEMO – kein Echtgeld» liegt als kleinster Text direkt unter dem Logo auf unruhigem Hintergrund und ist kaum lesbar. | M |
| A-05 | Der Multiplikator («×1») ist reiner Text ohne Fassung. Er ändert sich mit einem kurzen Zucken; ein Anstieg von ×2 auf ×27 wird nicht inszeniert. | H |
| A-06 | Das Base-Camp-Zeichen ist ein Emoji (⛺). Emojis sehen auf iOS, Android und Windows unterschiedlich aus und passen nicht zum Stil. | M |

### A2 Expedition Track (USP)

| ID | Befund | Grad |
|---|---|---|
| A-07 | Die Stationen sind sechs gleiche Kreise mit Kleintext. Keine Station hat ein eigenes Zeichen, eine eigene Farbe oder eine eigene Freischaltanimation – das Alleinstellungsmerkmal ist optisch das schwächste Element der Oberfläche. | H |
| A-08 | «Ancient Power» bricht als einzige Beschriftung zweizeilig um; die Zeile wirkt uneinheitlich. | N |
| A-09 | Es ist nicht sichtbar, wie viele Schritte bis zur nächsten Station fehlen (Trittsteine 1/2/4/6/9). Punkt 5 der Zielvorgabe («nächster wichtiger Spielschritt») ist nicht erfüllt. | H |
| A-10 | Stationseffekte erscheinen als Text mitten über den Symbolen («Discovery – Wilds erscheinen»), ohne Hinterlegung und ohne sichtbare Verbindung zwischen Station und Raster. | H |
| A-11 | Die Tempelsiegel sind drei kleine Kreise unter «Temple» ohne Beschriftung. | M |

### A3 Raster und Symbole

| ID | Befund | Grad |
|---|---|---|
| A-12 | **Ursache der «verzerrten Symbole»:** Verwandelt eine Station ein Symbol (Wild, Explorer, Sun Relic), wird es waagerecht auf Breite 0 zusammengeschoben und wieder aufgezogen (`grid-view.ts`, `scaleX`). In den Zwischenbildern ist das Symbol sichtbar gestaucht. | H |
| A-13 | Neue Symbole fallen von oberhalb des Rasters ein und sind dabei über Track und Kopfbereich sichtbar; es gibt keine Maske am Rasterrand. Beim Einfallen wirken sie dadurch am Rand «abgeschnitten» bzw. überlagern andere Elemente. | H |
| A-14 | Jedes Symbolbild enthält ein eigenes dunkelblaues Quadrat (aus der Bilderzeugung). Die Kacheln haben dadurch leicht unterschiedliche Blautöne und keinen einheitlichen Rahmen; der Wild hat keine Sonderfassung. | M |
| A-15 | Vor dem ersten Spin ist das Raster eine leere dunkle Fläche. Der erste Eindruck eines Publishers ist ein leeres Spielfeld. | H |
| A-16 | Gewinncluster pulsieren nur. Es gibt keinen Rahmen, kein Aufleuchten, keine Abdunklung der übrigen Symbole und keinen Betrag am Cluster. | H |
| A-17 | Das Einfallen nutzt eine Hüpfkurve (`Bounce`), die verspielt wirkt und nicht zum ruhigen, hochwertigen Ton passt. | M |
| A-18 | Scarab, Chalice und Crown sind überwiegend golden; bei 52 px Kachelgrösse (iPhone SE) unterscheidet sie nur die Silhouette. | M |

### A4 Gewinnpräsentation

| ID | Befund | Grad |
|---|---|---|
| A-19 | Der Gewinn springt nach jeder Kaskade auf den neuen Wert; er zählt nicht hoch. | H |
| A-20 | Es gibt zwei Zustände: nichts (unter 20×) und eine Einblendung ab 20×/50×/200×. Eine Abstufung für kleine und gute Gewinne fehlt; Partikel und Licht fehlen ganz. Die Titel sind deutsch. | H |
| A-21 | Die Gewinnzeile steht frei zwischen Raster und Bedienleiste, ohne Fassung; bei 0 ist dort eine leere Lücke. | M |

### A5 Bedienleiste

| ID | Befund | Grad |
|---|---|---|
| A-22 | **Abgeschnittener Text:** Auf 375 px Breite verdecken Minus- und Plus-Knopf die Beschriftung «Einsatz» («Einsat…»). | H |
| A-23 | Der Spin-Knopf ist ein flaches Rechteck in derselben Formensprache wie alle anderen Knöpfe und nicht mittig. Er ist die wichtigste Schaltfläche und hebt sich nicht ab. | H |
| A-24 | «Expedition kaufen» und «AUTO» stehen rechts übereinander, das Guthaben links unten in kleiner Schrift. Die drei Zeilen haben keine erkennbare Ordnung. | M |
| A-25 | Gesperrte Knöpfe werden nur blasser; auf dem Hintergrund sehen sie wie Darstellungsfehler aus. | M |
| A-26 | Zwischen Raster und Bedienleiste bleiben auf hohen Displays rund 40 px ungenutzt, während der Kopf gedrängt ist. Das Raster könnte auf dem iPhone 14 rund 8 % grösser sein. | M |

### A6 Free Spins

| ID | Befund | Grad |
|---|---|---|
| A-27 | Free Spins sehen aus wie die Basisrunde: gleicher Hintergrund, gleiche Farben, kein Übergang ausser einer Textzeile «8 Free Spins». | H |
| A-28 | Nach dem Ende bleiben «Free Spin 8 / 8», Base Camp und Siegel bis zum nächsten Spin stehen; es gibt keine Zusammenfassung und keine Rückkehr in die Basisrunde. | H |
| A-29 | Zusätzliche Free Spins erscheinen als gleiche Textzeile («+4 Free Spins»). | M |

### A7 Temple Bonus

| ID | Befund | Grad |
|---|---|---|
| A-30 | Die drei Kammern sind funktional vollständig (echte Auswahl, Relic-Zweitwahl, Aufdecken), aber drei identische Rechtecke mit «Kammer 1–3». Keine Identität, keine Öffnungsanimation, keine Schatzdarstellung. | H |
| A-31 | Die Abdunklung ist zu schwach: Die Symbole des Rasters scheinen durch Titel, Erklärtext und Kammern. | H |
| A-32 | Nicht gewählte Kammern werden grau mit «(nicht gewählt)» gezeigt – korrekt und ehrlich, aber gestalterisch roh. | M |

### A8 Technik

| ID | Befund | Grad |
|---|---|---|
| A-33 | Schrift ist `Georgia` als Systemschrift. Android hat sie nicht und fällt auf eine andere Serifenschrift zurück; Laufweiten und Umbrüche unterscheiden sich je Gerät. Es gibt keine eingebettete Schrift. | H |
| A-34 | Texte werden mit einer 4 px starken dunklen Kontur gezeichnet statt auf ruhigen Flächen zu stehen; kleine Schrift wirkt dadurch fett und unscharf. | M |
| A-35 | Einblendungen (Stationstexte) haben keine eigene Fläche und keine garantierte Ebene über dem Raster-Rahmen; lange Texte können auf schmalen Displays über den Rand laufen (kein Umbruch gesetzt). | M |
| A-36 | Safari-Risiken aus dem Code: (a) Ton startet erst nach einer Berührung – umgesetzt, auf iOS ungetestet; (b) beim Ein- und Ausblenden der Safari-Leisten ändert sich die Höhe, das Layout wird mitten in einer Animation neu berechnet; (c) Schutzbereiche (Notch, Home-Balken) sind nur über CSS-Abstände berücksichtigt, im Querformat ungetestet. | M |
| A-37 | Bildrate auf echten Geräten ist unbekannt (Messansicht «Leistung» vorhanden, noch keine Rückmeldung). Partikel und Lichteffekte aus diesem Plan erhöhen die Last. | H |
| A-38 | Oberfläche mischt Deutsch («Guthaben», «Einsatz», «Kammer») und Englisch («SPIN», «AUTO», Stationsnamen). Für internationale Publisher sollte die Präsentationsfassung einheitlich englisch sein. | H |

### A9 Mathematik und RNG

Im Audit wurde **kein neuer mathematischer oder logischer Fehler** gefunden. Bereits bekannt und dokumentiert: Der Kauf-RTP (96,81 %) weicht nach deinem Preisentscheid vom RTP normaler Runden (95,995 %) ab. Engine, Konfiguration, RNG und Sitzungsschicht werden in diesem Vorhaben nicht angefasst; ein Test prüft den Hash der Konfiguration.

### Ausgangsbewertung (vor dem Polish)

| Bereich | Punkte | Begründung |
|---|---|---|
| Visual Design | 6 | Symbole, Hintergrund und Logo tragen; Oberfläche darüber ist Rohbau |
| UI/UX | 4 | gedrängter Kopf, abgeschnittener Text, schwache Hierarchie |
| Gameplay Feedback | 4 | Gewinne und Stationen werden gemeldet, nicht inszeniert |
| Animationen | 4 | funktional; Stauchen, Hüpfen, kein Zählen, keine Partikel |
| Mobile Experience | 5 | passt auf alle Grössen, aber mit Überlappungen; Geräte ungetestet |
| Technical Stability | 7 | 57 Tests, Browser-Test grün; Safari und Leistung offen |
| Publisher Presentation | 4 | leeres Startbild, gemischte Sprache, USP unauffällig |

## Phase B – Designplan

Leitlinie: bestehende Identität, Architektur und Assets bleiben. Geändert werden ausschliesslich Dateien unter `src/client`, `public`, `assets` und `index.html`. `src/engine`, `src/session` und `config` bleiben unberührt.

Risiko: **n** niedrig · **m** mittel · **h** hoch.

### Paket 1 – Fundament (zuerst, alles Weitere baut darauf)

| Nr. | Problem | Verbesserung | Dateien | Ergebnis | Risiko |
|---|---|---|---|---|---|
| P1.1 | A-33, A-34 | Eingebettete Schrift mit freier Lizenz (SIL OFL): eine Versalschrift für Titel und Zahlen, eine gut lesbare Textschrift; Dateien lokal im Projekt, Eintrag im Asset-Register. Konturen durch ruhige Flächen ersetzen. | `theme.ts`, `index.html`, `public/fonts`, alle Views | gleiche Schrift auf allen Geräten, klare kleine Texte | n |
| P1.2 | A-38 | Präsentationsfassung einheitlich englisch; alle Texte in eine Textdatei mit Sprachschlüssel (Deutsch bleibt erhalten und umschaltbar). | neu `i18n.ts`, alle Views, `rules-text.ts` | publisher-taugliche Sprache, spätere Lokalisierung vorbereitet | m (viele Stellen, Tests anpassen) |
| P1.3 | A-13 | Maske am Rasterrand: Symbole sind nur innerhalb des Spielfelds sichtbar. | `grid-view.ts` | kein Überlagern von Track und Kopf, sauberes Einfallen | n |
| P1.4 | A-12, A-17 | Verwandlung ohne Stauchen: kurzes Aufleuchten mit Überblendung bei gleichbleibender Grösse; Einfallen mit weichem Abfangen statt Hüpfen. | `grid-view.ts` | keine verzerrten Zwischenbilder | n |
| P1.5 | A-26, A-01 | Neues Hochformat-Raster der Oberfläche (Zonen von oben): schmale Statusleiste · Expedition Track mit Multiplikator · Raster · Gewinnleiste · Bedienleiste. Logo in der Statusleiste klein, gross nur im Startbild. | `layout.ts`, `layout.test.ts`, `hud.ts` | mehr Platz fürs Raster, Kopf entlastet | m (Layouttests für alle Grössen neu) |

### Paket 2 – Kopf, Track und Multiplikator (USP)

| Nr. | Problem | Verbesserung | Dateien | Ergebnis | Risiko |
|---|---|---|---|---|---|
| P2.1 | A-02, A-25 | Ton und Info als runde Symbolknöpfe (Lautsprecher, «i») ohne Textkasten in der Statusleiste; gesperrt = entsättigt statt halb durchsichtig. | `hud.ts`, `button.ts` | keine «Textfragmente» mehr | n |
| P2.2 | A-07, A-08 | Jede Station erhält ein eigenes Medaillon mit Zeichen und Farbe: Discovery (Fackel, Bernstein) · Treasure (Truhe, Gold) · Ancient Power (Jade-Auge, Grün) · Relic (Sonnenscheibe, Türkis) · Temple (Tor, Weissgold). Zustände: verschlossen (Stein), erreicht (leuchtend), aktiv (pulsierender Ring). Namen nur unter der aktiven und der nächsten Station. | `track-view.ts`, neue Bilder | Track wird zum Blickfang, Stationen unterscheidbar | m (5 neue Bilder nötig) |
| P2.3 | A-09 | Trittsteine sichtbar: kleine Steine zwischen den Stationen (1/1/2/2/3), die sich Schritt für Schritt füllen; ein Temple Key fliegt als Funke vom Raster zum Track. | `track-view.ts`, `presenter.ts` | Spieler sieht den nächsten Schritt | n (Ereignis `trackAdvanced` liefert `steps` bereits) |
| P2.4 | A-10 | Stationseffekt als Lichtstrahl von der Station ins Raster plus kurze Namenstafel am Track statt Text über den Symbolen. | `presenter.ts`, `overlays.ts`, `grid-view.ts` | Ursache und Wirkung sichtbar verbunden | m |
| P2.5 | A-05 | Multiplikator als Sonnenmedaillon rechts am Track: Grundwert und Sonnenbonus getrennt lesbar («×2 + 25»), Summe gross; bei Anstieg Zählen und Lichtkranz. | `hud.ts` oder neu `multiplier-view.ts` | Multiplikator jederzeit klar | n |
| P2.6 | A-06, A-11 | Base Camp als gezeichnete Flagge, Siegel als drei beschriftete Sonnensiegel am Temple-Medaillon. | `track-view.ts` | einheitlicher Stil auf allen Geräten | n |

### Paket 3 – Raster, Kaskaden, Gewinne

| Nr. | Problem | Verbesserung | Dateien | Ergebnis | Risiko |
|---|---|---|---|---|---|
| P3.1 | A-14 | Einheitliche Steinkachel hinter jedem Symbol, Symbolbilder freigestellt (dunkler Grund lokal entfernt, wie beim Logo); Wild und Explorer mit Goldfassung. | `textures.ts`, `public/symbols`, Asset-Register | ruhiges, einheitliches Raster | m (Freistellen kann Kanten ausfransen; je Symbol prüfen) |
| P3.2 | A-16 | Gewinnmarkierung: Cluster leuchtet in Symbolfarbe mit umlaufender Kontur, übrige Symbole dunkeln kurz ab, Betrag erscheint am Cluster. | `grid-view.ts`, `presenter.ts` | Gewinn sofort lesbar | n |
| P3.3 | A-16 | Entfernen als kurzes Zerstäuben in Goldfunken; Nachrücken spaltenweise leicht versetzt. Gesamtdauer je Kaskade nicht länger als heute. | `grid-view.ts`, neu `fx.ts` | hochwertige, kurze Kaskade | m (Leistung, siehe P6.1) |
| P3.4 | A-19, A-21 | Gewinnleiste mit Fassung; Betrag zählt je Kaskade hoch, letzter Wert stammt immer aus dem Ereignis. | `hud.ts`, `presenter.ts` | befriedigende Gewinnzählung | n |
| P3.5 | A-20 | Vier Stufen nach gemessener Verteilung (Abnahmelauf, 2 Mrd. Runden): **Normal** unter 5× (kein Zusatz) · **Good** 5–20× (rund 1,5 % der Runden; Lichtkranz, kurzer Zähler) · **Big** 20–100× (rund 0,33 %; Vollbild, Funken) · **Epic** ab 100× (rund 0,10 %, etwa jede 1 050. Runde; Vollbild, Sonnenaufgang, längster Zähler). Maximalgewinn bleibt eigene Darstellung. Töne je Stufe. | `layout.ts` (Stufen), `overlays.ts`, `sfx.ts`, Tests | Dramaturgie ohne Übertreibung bei Kleinem | n |
| P3.6 | A-15 | Startbild: Raster zeigt beim Laden eine feste, gewinnlose Beispielanordnung (als Vorschau gekennzeichnet, kein Spielergebnis); grosses Logo, «Tap to start». | `game-scene.ts`, `grid-view.ts` | kein leeres Spielfeld beim ersten Eindruck | n |
| P3.7 | A-18 | Lesbarkeit der drei Goldsymbole: unterschiedliche Kachel-Akzentfarbe (Scarab türkis, Chalice bernstein, Crown rubin) als schmaler Rand. | `textures.ts` | Unterscheidung auch bei 52 px | n |

### Paket 4 – Bedienleiste

| Nr. | Problem | Verbesserung | Dateien | Ergebnis | Risiko |
|---|---|---|---|---|---|
| P4.1 | A-23 | Runder Spin-Knopf mittig (Sonnenscheibe, mind. 76 px), dreht sich beim Start; während der Runde wird er zum Schnellvorlauf-Knopf. | `hud.ts`, `button.ts` | klare Hauptaktion in Daumenreichweite | n |
| P4.2 | A-22, A-24 | Ordnung: links Einsatz (− Betrag +, Beschriftung darüber), Mitte Spin, rechts Auto und Kauf; Guthaben und Gewinn als feste Leiste darüber. Alle Ziele mindestens 48 px. | `hud.ts`, `layout.ts` | nichts abgeschnitten, nichts gedrängt | m |
| P4.3 | A-24 | Kauf-Knopf mit eigener Fassung (Kompass-Zeichen, Preis), Bestätigungsdialog im neuen Stil mit Kauf-RTP-Hinweis. | `hud.ts`, `overlays.ts` | Kauf wirkt als Feature, bleibt ehrlich | n |

### Paket 5 – Free Spins und Temple Bonus

| Nr. | Problem | Verbesserung | Dateien | Ergebnis | Risiko |
|---|---|---|---|---|---|
| P5.1 | A-27 | Eigener Modus: Übergangsblende (Tor öffnet sich, Licht), zweiter Hintergrund im Tempelinneren, wärmere Farbstimmung der Oberfläche, Zähler gross neben dem Multiplikator («FREE SPINS 3 / 8»). | `game-scene.ts`, `hud.ts`, neues Bild | Free Spins sind sofort als Sondermodus erkennbar | m (1–2 neue Bilder) |
| P5.2 | A-29 | Retrigger als eigene kurze Szene: Compass-Symbole leuchten, Zähler springt sichtbar hoch. | `presenter.ts` | Retrigger wird gefeiert | n |
| P5.3 | A-28 | Abschlusstafel «Free Spins complete – Total Win», danach Rückblende in die Basisrunde und Zurücksetzen von Zähler, Base Camp und Siegeln. | `presenter.ts`, `overlays.ts` | sauberer Abschluss | n |
| P5.4 | A-30, A-31 | Temple Bonus als eigene Szene mit vollem Hintergrund: drei Kammertore mit eigener Identität (Sonne/Gold · Jade · Türkis-Mond), Fackellicht, Tor öffnet sich mit Licht und Staub, Schatz erscheint mit Betrag. Regeltext bleibt sichtbar. | `overlays.ts` oder neu `bonus-view.ts`, neue Bilder | dramatische, verständliche Auswahl | h (grösstes Einzelpaket, 3–4 neue Bilder) |
| P5.5 | A-32 | Nicht gewählte Kammern öffnen sich danach schwächer beleuchtet und zeigen wahrheitsgemäss ihren Inhalt; Relic-Zweitwahl mit klarer Aufforderung. | wie P5.4 | Transparenz bleibt, sieht fertig aus | n |

### Paket 6 – Technik und Qualität

| Nr. | Problem | Verbesserung | Dateien | Ergebnis | Risiko |
|---|---|---|---|---|---|
| P6.1 | A-37 | Effekt-Budget: Partikel aus einem Vorrat mit Obergrenze; automatische Stufe «leicht», wenn die gemessene Bildrate unter 45 fällt; reduzierte Bewegung schaltet Partikel ab. | neu `fx.ts`, `perf.ts` | Effekte ohne Ruckeln auf schwächeren Geräten | m |
| P6.2 | A-35 | Feste Ebenenordnung (Hintergrund · Raster · Effekte · Oberfläche · Einblendungen · Dialoge), Umbruchbreite für alle Einblendungen. | `theme.ts`, alle Views | keine Überlagerungen | n |
| P6.3 | A-36 | Safari: Layout-Neuberechnung nur bei echter Grössenänderung und nach Ende einer Animation; Schutzbereiche im Querformat. Test auf echtem iPhone durch dich nötig. | `main.ts`, `game-scene.ts` | stabile Darstellung beim Scrollen der Leisten | m (ohne Gerät nicht prüfbar) |
| P6.4 | – | Browser-Test erweitern: Bildvergleich des Kopfbereichs auf 375 px (kein Element überlappt), Startbild, jede Gewinnstufe, Free-Spin-Übergang, Bonus-Szene. | `tools/e2e` | Regressionen fallen auf | n |

### Was dafür neu erzeugt werden muss

Mit demselben Werkzeug und Stil wie bisher, alles ins Asset-Register:

| Bilder | Anzahl | Für |
|---|---|---|
| Stationsmedaillons | 5 | P2.2 |
| Kammertore (geschlossen) und Schatzmotiv | 4 | P5.4 |
| Hintergrund Tempelinneres (Hoch- und Querformat) | 2 | P5.1, P5.4 |
| Steinkachel, Spin-Scheibe | 2 | P3.1, P4.1 |

Zusammen rund 13 Bilder, geschätzt 10 Credits (aus dem bisherigen Einzelpreis). Die offenen rechtlichen Punkte des Asset-Registers gelten unverändert.

### Reihenfolge und Sicherung

1. Vor Beginn: Git-Tag `pre-polish` auf den heutigen Stand; jede Paketgruppe ein eigener Commit, Tests und Browser-Test nach jedem Paket.
2. Paket 1 → 2 → 4 → 3 → 5 → 6. Paket 6.1 (Effekt-Budget) wird vor den ersten Partikeln aus Paket 3 gebaut.
3. Nach Paket 2 und nach Paket 5 jeweils Zwischenstand als private Demo-Seite zur Ansicht.

### Was nicht geändert wird

`src/engine`, `src/session`, `config/game-config.v1.0.0.json`, RNG, Auszahlungstabelle, Gewichte, Wahrscheinlichkeiten, Preise, Gewinnobergrenze, Reihenfolge der Ereignisse. Animationen spielen weiterhin nur das fertige Ereignisprotokoll ab. Die Gewinnstufen in P3.5 sind reine Darstellungsschwellen.

### Offene Entscheidungen

1. **Freigabe Phase C** in der genannten Reihenfolge?
2. **Sprache:** Präsentationsfassung englisch mit umschaltbarem Deutsch (P1.2)?
3. **Neue Bilder:** rund 13 Bilder für geschätzt 10 Credits erzeugen?
4. **Gewinnstufen** wie in P3.5 (5× / 20× / 100×)?
5. **Echtes Gerät:** Welches Handy nutzt du, und was zeigt die Ansicht «Leistung» in der Demo? Ohne das bleibt die Bildrate und Mobile Safari ungeprüft.
