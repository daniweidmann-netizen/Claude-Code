# 07 – Publisher Readiness: Audit, Gap-Analyse und Verbesserungsplan

Stand: 2026-11-24 · Status: Audit und Plan vorgelegt, **Umsetzung wartet auf Freigabe**

Ziel: Publishing- oder Lizenzpartnerschaft mit BGaming (erste Wahl) oder Relax Gaming (zweite Wahl).

Untersuchter Stand: Branch `claude/awesome-heisenberg-7vbnfn` nach dem Premium-Polish (Dokument 06, Pakete 1–5 umgesetzt). Konfiguration v1.0.0, eingefroren. Dieses Dokument bewertet also den **bereits überarbeiteten** Stand, nicht den aus dem ersten Audit.

Bildbelege: `docs/polish/readiness_mobile.jpg`, `readiness_bonus_freespins.jpg`, `readiness_landscape.jpg`, `readiness_cascade_frames.jpg` (20 Einzelbilder einer Kaskade bei halber Geschwindigkeit).

## 1. Grenzen dieser Prüfung

- **Mobile Safari ist nicht getestet.** In dieser Umgebung gibt es nur Chromium. Die Ansichten in iPhone-Abmessungen (15 Pro 393×852, SE 375×667, quer 852×393) laufen in Chromium. Echte Safari-Ergebnisse liefert nur dein iPhone 15 Pro über die Demo-Seite; eine Rückmeldung dazu liegt noch nicht vor.
- **Bildrate auf echten Geräten ist unbekannt.** Der Test-Browser rendert ohne Grafikkarte und ist kein Massstab.
- **Ton wurde nie angehört.**
- **Aussagen über BGaming und Relax Gaming** stammen aus einer Websuche vom 2026-11-24 (Abschnitt 6) und nicht aus eigener Erfahrung oder Kontakt. Einreichungsbedingungen sind nicht öffentlich dokumentiert gefunden worden.

## 2. Implementierungsstand der Kernmechaniken

| Mechanik | Stand | Beleg |
|---|---|---|
| 6×5 Cluster Pays, Kaskaden | vollständig | Engine-Tests, Python-Zweitimplementierung |
| Expedition System, fünf Stationen | vollständig | Engine-Tests; Darstellung mit Medaillons und Trittsteinen |
| Free Spins mit Base Camp, Retrigger, Siegeln | vollständig | Engine-Tests; eigene Kulisse, Zähler, Abschlusstafel |
| Multiplikator (Grundwert + Sonnenbonus) | vollständig | Engine-Tests; getrennte Anzeige |
| **Temple Bonus, drei Kammern** | **vollständig implementiert** (echte Auswahl, Relic-Zweitwahl, Aufdecken, Temple Finale mit drei Stufen) | Engine-Tests, exakte Erwartungswerte, Browser-Test mit Kammerwahl über die Oberfläche; eigene Szene mit drei Toren |
| Feature-Kauf | vollständig | Tests; Kauf-RTP getrennt ausgewiesen |

Ein separater Entwicklungsplan für den Temple Bonus ist deshalb nicht nötig; es geht um Inszenierung (Abschnitt 5, Paket C).

## 3. Audit des aktuellen Stands

Schweregrad: **H** fällt einem Publisher sofort auf · **M** mittel · **N** niedrig.

### 3.1 Mobile UI

| ID | Befund | Grad |
|---|---|---|
| R-01 | Der Free-Spin-Zähler passt auf 393 px nur gekürzt in die Statusleiste («FS 1 / 8»). Für die wichtigste Angabe im Bonusmodus ist das zu knapp. | H |
| R-02 | Zwischen Raster und Gewinnleiste bleiben auf hohen Displays rund 80 px leer; dort steht vor dem ersten Spin nur der Vorschau-Hinweis. Die Fläche wirkt ungenutzt. | M |
| R-03 | Der Multiplikator zeigt bei ×1 eine fast leere Fassung; der Sonnenbonus ist nur als kleine Zahl «2 + 25» lesbar, ohne Sonnenzeichen. | M |
| R-04 | Die Informationszeile wechselt zwischen «nächster Schritt» und Stationseffekt ohne Übergang; Text springt. | N |
| R-05 | Das Logo in der Statusleiste ist auf 393 px rund 150 px breit und klein; der Demo-Hinweis daneben liegt direkt auf dem Hintergrundmotiv. | N |
| R-06 | Bedienleiste: Auto und Kauf sind gleich gross und gleich gewichtet; der Kauf-Knopf trägt den Preis in kleinster Schrift (rund 9 px). | M |
| R-07 | Es gibt keine Einsatz-Schnellwahl und keinen Hinweis auf den Maximalgewinn im Spielbild – beides ist bei aktuellen Slots üblich. | N |

### 3.2 Reel Quality

| ID | Befund | Grad |
|---|---|---|
| R-08 | **Leere Bereiche in Kaskaden:** Nach dem Entfernen stehen die Kacheln für rund 150–250 ms leer, bevor nachrückende und neue Symbole ankommen (Bildfolge, Bilder 8 und 16). Die leeren Kacheln sind einheitlich und sauber, wirken aber wie eine Pause. Kein Ladefehler, sondern die Abfolge «erst entfernen, dann fallen». | H |
| R-09 | Der Rasterrahmen ist eine gezeichnete Linie mit dunkler Fläche. Er hat keine Tiefe (kein Stein, kein innerer Schatten, keine Verankerung im Hintergrund). | H |
| R-10 | Die Kacheln sind sehr dunkel und kontrastarm; die Symbole schweben ohne Schlagschatten. Der farbige Schein hinter den Symbolen ist kaum sichtbar. | M |
| R-11 | Symbole fallen mit einheitlicher Geschwindigkeit und kleinem Nachfedern; es fehlt eine kurze Staubwolke oder ein Aufblitzen beim Aufsetzen. | N |
| R-12 | Wild und Explorer haben keine dauerhafte Sonderfassung; ein Explorer, der stehen bleibt, ist nach der Verwandlung nicht als «bleibt» erkennbar. | M |
| R-13 | Keine Leerlaufbewegung: Im Stillstand ist das Bild vollkommen statisch (kein Glimmen der Fackeln, kein Staub, kein Schimmer auf Wilds). | M |

### 3.3 Expedition System

| ID | Befund | Grad |
|---|---|---|
| R-14 | Noch nicht erreichte Medaillons sind nur abgedunkelt; erreichte unterscheiden sich durch Helligkeit, aber nicht durch einen klaren Zustand (zum Beispiel leuchtender Ring in Stationsfarbe, der bleibt). | M |
| R-15 | Die Freischaltung ist für alle Stationen dieselbe (Aufblitzen, Funken, kurzes Wachsen) – nur die Farbe unterscheidet sich. Jede Station sollte ihre eigene kurze Geste haben. | H |
| R-16 | Das Erreichen des Tempels (grösster Moment der Basisrunde) wird nur mit einer Textzeile und einer Pause angekündigt, dann wechselt die Szene. | H |
| R-17 | Die Trittsteine sind klein (rund 6 px) und auf dem Handy schwer zu sehen. | M |
| R-18 | Der Lichtfunke von der Station ins Raster ist schnell und klein; die Verbindung «diese Station hat das bewirkt» wird nicht jedem auffallen. | M |

### 3.4 Free Spins

| ID | Befund | Grad |
|---|---|---|
| R-19 | Einstieg: Blende und Tafel «8 FREE SPINS» sind vorhanden, aber ohne eigene Bildidee (kein Tor, das aufgeht; keine Zusammenfassung der Startbedingungen wie Base Camp). | H |
| R-20 | Das Hintergrundbild der Free Spins ist oben sehr hell; Track und Statusleiste liegen darauf mit geringerem Kontrast als in der Basisrunde. | M |
| R-21 | Der über die Free Spins wachsende Sonnenbonus ist das zentrale Spannungselement, wird aber nur als Zahl im Multiplikator gezeigt. | H |
| R-22 | Abschluss: Tafel mit Gesamtgewinn vorhanden; es fehlt die Angabe, was erreicht wurde (höchster Multiplikator, Siegel). | N |

### 3.5 Temple Bonus

| ID | Befund | Grad |
|---|---|---|
| R-23 | Die drei Tore sind auf dem Handy je rund 120 px breit; die untere Bildhälfte ist leer. Als «wichtigstes visuelles Highlight» sind sie zu klein. | H |
| R-24 | Das Öffnen ist ein Wackeln und Ausblenden des Tors. Es gibt kein Bild eines offenen Tors und keine Lichtflut aus der Kammer. | H |
| R-25 | Der Einstieg in den Bonus ist ein einfaches Einblenden; vom Raster zur Kammerszene fehlt ein Übergang («Der Tempel öffnet sich»). | M |
| R-26 | Die Jademaske am Tor (mit Reisszähnen) passt im Ton nicht zur ruhigen Jade Mask der Symbole; das Sonnentor trägt ein Gesicht, die Sonnenmotive sonst nicht. | N |
| R-27 | Nicht gewählte Kammern werden korrekt aufgedeckt; das ist ein Vertrauensmerkmal und sollte im Verkaufsmaterial ausdrücklich genannt werden. | – (Stärke) |

### 3.6 Technik

| ID | Befund | Grad |
|---|---|---|
| R-28 | Mobile Safari und echte Geräte ungetestet (Abschnitt 1). | H |
| R-29 | Das Spiel lädt rund 5 MB (Skript 1,5 MB, Bilder 3,5 MB) in einem Schritt; es gibt kein gestaffeltes Laden und keine WebP-Fassungen. Publisher prüfen Ladezeiten in Mobilnetzen. | M |
| R-30 | Der Browser-Test braucht mit Effekten rund 20 Minuten und kann nur Chromium. Firefox und WebKit fehlen. | M |
| R-31 | Kein Verhalten bei Verbindungsabbruch oder Wiederaufnahme einer Runde im Client (die Engine kann es, der Demo-Client braucht es nicht; für eine RGS-Integration wird danach gefragt). | M |
| R-32 | Ton: synthetische Platzhalter ohne Musik. Für eine Publisher-Präsentation ist der Ton der schwächste Teil. | H |

### 3.7 Mathematische Auffälligkeiten (nur dokumentiert, nichts geändert)

| ID | Beobachtung |
|---|---|
| M-01 | Kauf-RTP 96,81 % gegenüber 95,995 % normaler Runden (Folge des runden Preises 58×, dein Entscheid). Publisher erwarten diese Zahl getrennt ausgewiesen; das ist im Spiel und in den Regeln der Fall. |
| M-02 | Es gibt nur eine RTP-Variante. Publisher und Betreiber erwarten üblicherweise mehrere (um 96 / 94 / 92 % und tiefer). Das erfordert neue Konfigurationen und neue Abnahmeläufe – eine Mathematik-Aufgabe, die eine eigene Freigabe braucht. |
| M-03 | Die Auszahlungstabelle ist funktional abgestimmt, aber nicht geglättet (zum Beispiel zwei gleiche Werte 0,3× in einer Zeile). |
| M-04 | Der durch die Gewinnobergrenze abgeschnittene RTP-Anteil ist nicht separat ausgewiesen; die Miniaturraster-Enumeration aus dem Mathematikplan fehlt. |
| M-05 | Alle Werte sind simuliert, nicht zertifiziert. |

## 4. Gap-Analyse aus Publisher-Sicht

Bewertung 1–10; «Ziel» ist, was ich für eine ernst genommene Erstpräsentation für nötig halte.

| Kriterium | Jetzt | Ziel | Lücke und konkrete Verbesserung |
|---|---|---|---|
| Eigenständigkeit | 6 | 8 | Die Mechanik (Trittsteine, Base Camp, echte Kammerwahl) ist eigenständig. Das **Thema** (Dschungeltempel, Masken, Sonnenscheibe) ist eines der meistbesetzten im Markt. Verbesserung: den Track und die Explorer-Figur als Gesicht des Spiels herausstellen, Verkaufsargument auf die Mechanik legen. Keine Ähnlichkeitsprüfung gegen bestehende Titel durchgeführt. |
| Visuelle Qualität | 7 | 8–9 | Symbole, Hintergründe, Medaillons und Tore tragen. Lücke: Rasterrahmen ohne Tiefe, statisches Standbild, keine handwerkliche Überarbeitung der KI-Bilder (R-09, R-10, R-13). |
| Gameplay | 7 | 8 | Vollständig und getestet. Lücke: Höhepunkte (Tempel erreicht, Sonnenbonus wächst) werden nicht inszeniert (R-16, R-21). |
| User Experience | 7 | 8 | Klare Hierarchie, nächster Schritt sichtbar. Lücke: Free-Spin-Zähler gekürzt, kleine Preisangabe, Leerfläche (R-01, R-02, R-06). |
| Technische Stabilität | 7 | 9 | 78 Tests, Browser-Test mit Prüfungen auf Verzerrung, Überlappung und Buchführung. Lücke: Safari, echte Geräte, Ladegrösse, nur Chromium (R-28 bis R-31). |
| Mobile Qualität | 6 | 9 | Layout passt von 360 bis 430 px. Lücke: auf keinem echten Gerät bestätigt. |
| Bonusfeatures | 7 | 9 | Alle Features vollständig. Lücke: Kammern zu klein, Öffnung ohne Bild, Free-Spin-Einstieg ohne Bildidee (R-19, R-23, R-24). |
| Kommerzielles Differenzierungspotenzial | 5 | 7 | Eine Mechanik mit ehrlicher Auswahl und sichtbarem Fortschritt ist ein gutes Argument. Lücken: nur eine RTP-Variante, keine Zertifizierung, kein Ton auf Niveau, offene Rechtefragen bei KI-Bildern, kein Verkaufspaket (Mathematikdokument, Game Sheet, Trailer), Einzelentwickler ohne Referenzen. |

**Ehrliche Gesamteinschätzung:** Das Spiel ist als Demo vorzeigbar und technisch sauberer dokumentiert als viele Erstvorstellungen. Für eine Lizenzpartnerschaft sind die grössten Lücken aber nicht die Oberfläche, sondern (1) Bestätigung auf echten Geräten, (2) Ton, (3) Rechtekette der Grafik, (4) RTP-Varianten und (5) das Verkaufspaket. Die Oberflächenarbeit in Abschnitt 5 hebt den ersten Eindruck; sie ersetzt diese fünf Punkte nicht.

## 5. Verbesserungsplan

Geändert werden nur Dateien unter `src/client`, `public`, `assets`, `tools/e2e`, `index.html` und `docs`. `src/engine`, `src/session` und `config` bleiben unberührt (wird nach jedem Paket per `git diff` geprüft). Risiko: **n** niedrig · **m** mittel · **h** hoch.

### Paket A – Reel Quality (höchste Priorität nach deiner Vorgabe)

| Nr. | Befund | Verbesserung | Dateien | Risiko |
|---|---|---|---|---|
| A1 | R-08 | Kaskade ohne Pause: Nachrücken und Einfallen starten, während die Gewinnsymbole noch zerstäuben; leere Kacheln zeigen in der Zwischenzeit ein kurzes Nachglühen in Symbolfarbe. Die Reihenfolge der Ereignisse bleibt unverändert, nur die Animationen überlappen. | `src/client/views/grid-view.ts`, `src/client/presentation/presenter.ts` | m (Überlappung muss mit der Rasterprüfung vereinbar bleiben; der Test auf Abweichungen fängt Fehler) |
| A2 | R-09 | Rasterrahmen aus Stein mit Goldfassung als Bild (neunteilig skalierbar), innerer Schatten, leichte Abdunklung des Hintergrunds dahinter. | `src/client/views/grid-view.ts`, `src/client/textures.ts`, neues Bild `public/ui/frame.png`, `tools/assets/process.py` | m (1 neues Bild) |
| A3 | R-10 | Kacheln etwas heller mit sichtbarer Kante; weicher Schlagschatten unter jedem Symbol; farbiger Schein verstärkt. | `src/client/views/grid-view.ts`, `tools/assets/process.py` | n |
| A4 | R-11 | Aufsetzen mit kurzem Staub- und Lichtakzent je Spalte (im Effekt-Budget). | `src/client/views/grid-view.ts`, `src/client/fx.ts` | n |
| A5 | R-12 | Wild mit dauerhaftem Sonnenschimmer; Explorer mit Goldring und kleinem Anker-Zeichen «bleibt». | `src/client/views/grid-view.ts` | n |
| A6 | R-13 | Leerlauf: schwebender Staub, langsames Atmen des Schimmers auf Wild und aktiver Station; pausiert bei reduzierter Bewegung und niedriger Bildrate. | `src/client/fx.ts`, `src/client/scenes/game-scene.ts` | n |

### Paket B – Expedition System

| Nr. | Befund | Verbesserung | Dateien | Risiko |
|---|---|---|---|---|
| B1 | R-15 | Eigene Freischaltgeste je Station: Discovery Fackel flammt auf · Treasure Münzen springen · Ancient Power Auge öffnet sich mit Jade-Welle · Relic Sonnenstrahlen drehen · Temple Tor leuchtet weiss auf und der ganze Track pulsiert. | `src/client/views/track-view.ts`, `src/client/fx.ts` | n |
| B2 | R-14, R-17 | Klare Zustände: verschlossen (Stein), erreicht (bleibender Ring in Stationsfarbe), aktiv (pulsierend). Trittsteine doppelt so gross mit Füllanimation. | `src/client/views/track-view.ts` | n |
| B3 | R-16 | Tempel erreicht: kurzer Stillstand, Lichtkegel vom Temple-Medaillon über das Raster, dann Überblendung in die Kammerszene (verbindet mit C3). | `src/client/presentation/presenter.ts`, `src/client/views/overlays.ts` | n |
| B4 | R-18 | Breiterer, langsamerer Lichtstrahl von der Station zum Ziel; das Zielsymbol leuchtet in Stationsfarbe nach. | `src/client/fx.ts`, `src/client/presentation/presenter.ts` | n |
| B5 | R-03, R-21 | Multiplikator: Sonnenzeichen neben dem Sonnenbonus; in Free Spins wächst ein Sonnenkranz um die Fassung mit dem Sonnenbonus (rein aus dem angezeigten Wert abgeleitet). | `src/client/views/hud.ts` | n |
| B6 | R-04 | Informationszeile mit kurzer Überblendung statt Sprung. | `src/client/views/track-view.ts` | n |

### Paket C – Free Spins und Temple Bonus

| Nr. | Befund | Verbesserung | Dateien | Risiko |
|---|---|---|---|---|
| C1 | R-19 | Einstieg als Szene: Tor-Bild öffnet sich, Tafel mit Anzahl, Base Camp und Hinweis «Sun bonus is kept». | `src/client/views/overlays.ts`, `src/client/presentation/presenter.ts` | m |
| C2 | R-01, R-20 | Free-Spin-Zähler gross in der Informationszeile des Tracks («FREE SPIN 3 / 8»); im oberen Bereich ein Verlauf zur Abdunklung, damit Track und Leiste denselben Kontrast haben wie in der Basisrunde. | `src/client/views/hud.ts`, `src/client/views/track-view.ts`, `src/client/scenes/game-scene.ts` | n |
| C3 | R-23, R-25 | Kammern grösser: im Hochformat nutzen die Tore die volle Breite und rund 45 % der Höhe; Einstieg mit Kamerafahrt (Tore wachsen aus der Tiefe), Fackelflackern. | `src/client/views/bonus-view.ts` | m |
| C4 | R-24 | Echte Öffnung: je Kammer ein Bild des offenen Tors mit Licht aus dem Inneren; Torflügel blenden über, Lichtflut, Schatz steigt auf, Betrag zählt hoch. | `src/client/views/bonus-view.ts`, 3 neue Bilder `public/ui/door_*_open.png`, `tools/assets/process.py` | h (Bilder müssen zu den geschlossenen Toren passen; sonst Rückfall auf Lichtflut ohne Torbild) |
| C5 | R-22 | Abschlusstafel mit Gesamtgewinn, höchstem Multiplikator und Siegeln (alles aus dem Ereignisprotokoll). | `src/client/presentation/presenter.ts`, `src/client/views/overlays.ts` | n |
| C6 | R-26 | Jade-Tor und Sonnentor neu erzeugen, damit sie zu Symbolen und Stationen passen (ruhige Maske, Sonne ohne Gesicht). | 2 neue Bilder, Asset-Register | n |

### Paket D – Mobile UI Feinschliff

| Nr. | Befund | Verbesserung | Dateien | Risiko |
|---|---|---|---|---|
| D1 | R-02 | Leerfläche nutzen: Raster und Track teilen sich den freien Raum; unter dem Raster eine schmale Zeile mit «MAX WIN 10,000×» und in Free Spins dem Feature-Gewinn. | `src/client/layout.ts`, `tests/unit/layout.test.ts`, `src/client/views/hud.ts` | m (Layouttests) |
| D2 | R-06 | Kauf-Knopf mit grösserem Preis und Kompass-Zeichen; Auto schmaler. | `src/client/views/hud.ts` | n |
| D3 | R-05 | Statusleiste: Logo etwas grösser, Demo-Hinweis auf eigener kleiner Fassung. | `src/client/views/hud.ts` | n |
| D4 | R-07 | Einsatz-Schnellwahl (Antippen des Betrags öffnet die Stufen). | `src/client/views/hud.ts`, `src/client/views/overlays.ts` | n |

### Paket E – Technik und Nachweise

| Nr. | Befund | Verbesserung | Dateien | Risiko |
|---|---|---|---|---|
| E1 | R-29 | Bilder zusätzlich als WebP, Skript geteilt (Phaser getrennt), Ladebalken zeigt echten Fortschritt; Ziel unter 3 MB Erstladung. | `tools/assets/process.py`, `vite.config.ts`, `src/client/textures.ts` | m |
| E2 | R-30 | Browser-Test in zwei Stufen (schnell für jede Änderung, vollständig vor Übergaben); Firefox und WebKit sobald eine Umgebung sie bietet. | `tools/e2e/smoke.cjs`, `package.json` | n |
| E3 | R-28 | Prüfliste für dein iPhone 15 Pro (Safari und als App-Ansicht): Kopf, Kaskaden, Free Spins, Bonus, Drehen des Geräts, Ton, Leistungswerte. Ergebnisse trage ich ein. | `docs/08_DEVICE_TEST_CHECKLIST.md` | n |
| E4 | Phase D aus Dokument 06 | Abschlussbericht mit Testergebnissen und Bewertung nach den Paketen. | `docs/06_POLISH_AUDIT_AND_PLAN.md` | n |

### Nicht Teil dieses Plans (eigene Freigabe nötig)

- **Ton und Musik** (R-32): grösste hörbare Lücke. Möglich wären erzeugte Effekte und Musik über ElevenLabs (verbraucht Guthaben, eigene Lizenzprüfung) oder lizenzierte Bibliotheken.
- **RTP-Varianten** (M-02), Glätten der Auszahlungstabelle (M-03), fehlende Mathematik-Nachweise (M-04): Mathematik-Arbeit mit neuen Abnahmeläufen.
- **Verkaufspaket**: Game Sheet, Mathematikdokument, Trailer, Integrationsbeschreibung.
- **Rechtekette**: Lizenzprüfung der KI-Bilder, menschliche Überarbeitung, Markenregister.

### Neue Bilder für diesen Plan

Rasterrahmen (1), offene Tore (3), neue Fassungen von Jade- und Sonnentor (2), Tor für den Free-Spin-Einstieg (1): 7 Bilder, geschätzt 5–6 Credits.

### Reihenfolge und Sicherung

1. Sicherung: Git-Tag `pre-readiness` (lokal; das Hochladen von Tags ist in dieser Umgebung nicht erlaubt) – der Stand ist zusätzlich über den Commit erreichbar.
2. A → B → C → D → E. Nach jedem Paket: Typprüfung, alle automatisierten Tests, Browser-Test, `git diff` auf Engine und Konfiguration, eigener Commit, aktualisierte Demo-Seite.

## 6. Was über die Zielanbieter öffentlich zu finden war

Websuche vom 2026-11-24; keine eigene Erfahrung, kein Kontakt.

- **BGaming:** Ein Fachartikel beschreibt «BGaming Publishing» als Programm für Studios mit technischer Integration, Vertrieb, Promotion und Analyse und nennt ein Netz von über 3 000 Betreibern sowie Perfect Position Studios als Beispiel. Der Artikel ist werblich; **wie man sich bewirbt und was verlangt wird, war nicht zu finden.**
- **Relax Gaming:** «Silver Bullet» und das Schwesterprogramm «Powered By Relax» bieten Studios laut Fachpresse Vertrieb über eine einmalige Integration sowie Unterstützung bei Compliance und Vermarktung. Die Quellen stammen überwiegend aus 2018–2021; **aktuelle Aufnahmekriterien waren nicht zu finden.**

Beide Programme nehmen nach diesen Quellen **Studios** auf, die Spiele auf der Plattform des Anbieters veröffentlichen. Das spricht für ein Angebot als Studio-Partner mit fertigem, integrierbarem Spiel und gegen einen reinen IP-Verkauf. Ob das Spiel dafür auf deren Technik portiert werden muss, ist offen und die wichtigste Frage für den Erstkontakt.

Quellen: https://igamingfuture.com/helping-small-studios-scale-faster-with-bgaming-publishing/ · https://sbcnews.co.uk/igaming/2018/08/20/relax-gaming-launches-pioneering-silver-bullet-program/ · https://europeangaming.eu/portal/press-releases/2019/10/15/56438/relax-gaming-achieves-monumental-year-with-silver-bullet-partners/ · https://www.gamblinginsider.com/news/11598/lucabet-revolutionizing-online-gambling-industry

## 7. Offene Entscheidungen

1. Freigabe der Pakete A bis E in dieser Reihenfolge?
2. Sieben neue Bilder für geschätzt 5–6 Credits erzeugen?
3. Ton und Musik als eigenes Vorhaben danach angehen – und auf welchem Weg?
4. Rückmeldung vom iPhone 15 Pro (Darstellung, Ton, Werte aus «Performance»): ohne sie bleiben R-28 und die Mobile-Bewertung offen.
