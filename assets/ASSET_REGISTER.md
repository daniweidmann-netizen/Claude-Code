# Asset-Register

Jedes Asset wird hier mit Herkunft, Werkzeug, Lizenzlage und Bearbeitung erfasst (CR-07). Status: `ENTWURF` · `REFERENZ (in Prüfung)` · `FREIGEGEBEN` · `VERWORFEN`.

## Rechtlicher Stand (keine Rechtsberatung)

- **Higgsfield:** Laut Help Center des Anbieters ist die kommerzielle Nutzung der Ergebnisse in allen Tarifen erlaubt, und der Anbieter beansprucht kein Eigentum an den Ergebnissen (dort zitiert: Abschnitt 4.4 der Terms of Use). Den Volltext der Terms habe ich **nicht** geprüft. Drittquellen beschreiben eine weitreichende, unwiderrufliche Lizenz, die sich der Anbieter an Inhalten einräumt; der aktuelle Wortlaut ist vor einem IP-Verkauf anwaltlich zu prüfen. Abgerufen am 2026-11-24:
  https://higgsfield.ai/creator-hub/help-center/account-and-privacy/who-owns-my-generations-and-can-i-use-them-commercially · https://higgsfield.ai/Terms-of-Use-Agreement
- **Zugrunde liegendes Bildmodell** (`gpt_image_2_6`): Nutzungsbedingungen des Modellanbieters nicht geprüft.
- **Schutzfähigkeit:** Rein KI-generierte Bilder sind in wichtigen Rechtsordnungen möglicherweise nicht urheberrechtlich geschützt. Für die finale Grafik ist eine dokumentierte menschliche Überarbeitung vorgesehen; bei den Referenzbildern unten gibt es sie noch **nicht**.
- **Ähnlichkeit:** Keine Prüfung auf Ähnlichkeit mit bestehenden Spielen oder realen Artefakten durchgeführt. Masken und Sonnenscheiben in diesem Stil sind im Genre verbreitet.

## Im Code gezeichnete Platzhalter

| Asset | Datei | Herkunft | Status |
|---|---|---|---|
| 9 Symbol-Platzhalter | `src/client/textures.ts` | eigene Arbeit, im Code gezeichnet, kein Fremdmaterial | ENTWURF (wird ersetzt) |

## Referenzsymbole (Qualitätstor, 2026-11-24)

Werkzeug: Higgsfield, Modell `gpt_image_2_6`, Seitenverhältnis 1:1, 1024×1024, je 2 Varianten, Kosten 3 Credits insgesamt. Konto des Auftraggebers.

| Asset | Rohdatei | Job-ID | Verwendung | Bearbeitung | Status |
|---|---|---|---|---|---|
| Jade Mask A | `assets/reference/raw/jade_mask_a.png` | 88d18963-2b19-4bc7-b537-126ee70c0b18 | – | keine | REFERENZ (in Prüfung) |
| Jade Mask B | `assets/reference/raw/jade_mask_b.png` | 06379c7f-ab7e-4ea5-ad66-f0935ed2dc2d | `public/symbols/sym4.png` | automatisch: auf 128 px verkleinert, Ecken abgerundet | REFERENZ (in Prüfung) |
| Wild A | `assets/reference/raw/wild_a.png` | 201a38f2-b73f-42c5-9017-5d2b20ede290 | `public/symbols/sym5.png` | automatisch: auf 128 px verkleinert, Ecken abgerundet | REFERENZ (in Prüfung) |
| Wild B | `assets/reference/raw/wild_b.png` | a7ba59af-ef39-40a7-afc6-be48805443f3 | – | keine | REFERENZ (in Prüfung) |

**Prompt Jade Mask:**
> Single game icon for a premium adventure slot game: an ancient ceremonial mask carved from polished green jade with gold inlay lines and small turquoise accents, calm closed-mouth expression, original invented design not based on any real artifact or existing game. Centered, front view, fills about 80 percent of the frame, strong readable silhouette that works at 96 pixels. Stylised painterly 3D rendering, warm golden rim light from upper left, deep teal shadows, crisp edges, subtle glow. Plain flat dark navy background (#10131c), no text, no letters, no frame, no border, no watermark, no other objects.

**Prompt Wild:**
> Single game icon for a premium adventure slot game: a radiant golden sun disc relic, a round engraved gold medallion with a stylised sun face-less emblem in the centre and twelve short pointed rays, small inlaid amber gem in the middle, original invented design not based on any real artifact or existing game. Centered, front view, fills about 80 percent of the frame, strong readable silhouette that works at 96 pixels. Stylised painterly 3D rendering, warm golden rim light from upper left, deep teal shadows, crisp edges, soft golden glow. Plain flat dark navy background (#10131c), no text, no letters, no frame, no border, no watermark, no other objects.

**Entscheid des Auftraggebers vom 2026-11-24:** Stil freigegeben; gewählt sind Jade Mask B und Wild A. Jade Mask A und Wild B sind VERWORFEN (Rohdateien bleiben zur Dokumentation erhalten).

## Symbolsatz v1 (2026-11-24)

Gleiches Werkzeug und Modell, je 1 Variante, 1024×1024. Alle Prompts enden mit demselben Stilblock wie oben («Centered … no other objects.»); der Motivteil steht in der Tabelle. Bearbeitung bei allen: automatisch auf 128 px verkleinert, Ecken abgerundet – **keine menschliche Überarbeitung**. Status aller Einträge: REFERENZ → im Client als Standard eingebunden, rechtliche Punkte oben offen.

| ID | Symbol | Rohdatei | Spieldatei | Job-ID | Motivteil des Prompts |
|---|---|---|---|---|---|
| 0 | Sapphire Gem | `raw/sapphire.png` | `public/symbols/sym0.png` | 9ebbca19-ea3b-4979-b9e9-9c711234e118 | large faceted deep-blue sapphire, kite-shaped brilliant cut, thin engraved gold claw setting with step-fret ornaments |
| 1 | Golden Scarab | `raw/scarab.png` | `sym1.png` | 26f39eac-8360-408c-b21e-176b69718d62 | golden scarab beetle amulet from above, wings closed, engraved wing cases, turquoise inlay |
| 2 | Golden Chalice | `raw/chalice.png` | `sym2.png` | 9cadcd26-766d-4318-b034-51df0662c876 | ornate golden chalice, wide bowl, step-fret band, three red and turquoise gems |
| 3 | Ruby Crown | `raw/crown.png` | `sym3.png` | 5339daa4-1d95-4f90-adc4-8aafad943c11 | ancient golden crown, five tall points, large ruby in the centre, smaller rubies on the band |
| 4 | Jade Mask | `raw/jade_mask_b.png` | `sym4.png` | 06379c7f-ab7e-4ea5-ad66-f0935ed2dc2d | siehe oben |
| 5 | Wild | `raw/wild_a.png` | `sym5.png` | 201a38f2-b73f-42c5-9017-5d2b20ede290 | siehe oben |
| 6 | Compass | `raw/compass.png` | `sym6.png` | 7945e184-7686-4659-9e8c-e6edc382c213 | antique brass explorer's compass from above, ivory dial, eight-point wind rose, red and white needle, no letters or numbers |
| 7 | Temple Key | `raw/key.png` | `sym7.png` | b00d746c-78b3-4894-b702-dca38ba0f2a1 | ancient temple key of gold and green jade, diagonal, sun-ring head with turquoise stone, step-fret teeth |
| 8 | Explorer | `raw/explorer.png` | `sym8.png` | 1fd7e9e2-7917-49b1-9e17-b5cf3829b589 | head-and-shoulders portrait of an original fictional explorer, woman in her thirties, short dark curly hair, olive jacket, teal scarf, brass goggles on the forehead; ausdrücklich «not resembling any real person or any existing game or film character» |

Kosten des Symbolsatzes: 7 Bilder, rund 5 Credits (Schätzung aus dem Einzelpreis von 0,75; nicht nachgemessen).

**Offene Gestaltungspunkte:** Scarab, Chalice und Crown sind alle überwiegend golden und unterscheiden sich vor allem über die Silhouette – Lesbarkeit für Farbfehlsichtige und auf kleinen Displays ist nicht getestet. Die Explorer-Figur ist ein generiertes Gesicht; eine zufällige Ähnlichkeit mit einer realen Person ist nicht geprüft.

Übersicht: `assets/reference/contact_sheet_all.png`, Vorschau im Spiel: `assets/reference/ingame_portrait.png` und `ingame_landscape.png`. Mit `?art=placeholder` zeigt der Client die im Code gezeichneten Platzhalter.

## Hintergrund und Logo (2026-11-24)

Gleiches Werkzeug und Modell. Hintergründe je 1 Variante (752×1344 und 1344×752), Logo 2 Varianten (1344×752). Status: REFERENZ, im Client eingebunden; rechtliche Punkte wie oben offen, keine menschliche Überarbeitung.

| Asset | Rohdatei | Spieldatei | Job-ID | Bearbeitung |
|---|---|---|---|---|
| Hintergrund Hochformat | `raw/bg_portrait.png` | `public/bg_portrait.jpg` | ddd4daa6-d261-4e4e-96a9-946c05592313 | automatisch: JPEG, Qualität 86 |
| Hintergrund Querformat | `raw/bg_landscape.png` | `public/bg_landscape.jpg` | b1836ad1-1088-42ec-a510-71264fc7cbb8 | automatisch: JPEG, Qualität 86 |
| Logo A | `raw/logo_a.png` | – | 42daf621-3e6c-4a00-a324-dba83d7ef5cf | keine (nicht verwendet) |
| Logo B | `raw/logo_b.png` | `public/logo.png` | c8d81381-5982-42d3-9415-03d4be36ee6c | automatisch: dunkler Hintergrund per Helligkeitsschwelle transparent gemacht, zugeschnitten, auf 720 px Breite verkleinert |

**Prompt Hintergrund** (Hochformat; Querformat identisch bis auf «Wide landscape» und die Lage der ruhigen Fläche):
> Vertical mobile game background for a premium adventure slot game: the overgrown entrance of a lost sun temple deep in a jungle at dusk, massive weathered stone stairway and doorway with invented step-fret carvings and a large carved sun disc above the gate, warm golden light glowing from inside the temple, hanging vines, mist, fireflies, deep teal and navy shadows. The whole middle of the image is calm, dark and low in detail (dark stone wall in shadow) so that game symbols placed on top stay readable; detail and light concentrated at the top and the far edges. Stylised painterly 3D rendering matching polished casino game art. Original invented architecture, not a real site and not from any existing game. No characters, no text, no letters, no logo, no UI, no frame, no watermark.

**Prompt Logo:**
> Game logo with the exact text "TEMPLE OF THE LOST SUN" in two lines: small line "TEMPLE OF THE" above, large line "LOST SUN" below. Custom chiselled golden capital letters with bevelled edges and subtle carved step-fret details, the letter O in "LOST" replaced by a small radiant sun disc with short pointed rays and an amber gem, thin jade-green and turquoise accents, soft warm glow. Correct spelling, every letter clearly legible, strong silhouette readable at small size. Original lettering, not resembling any existing game logo. Centered on a plain flat dark navy background (#10131c), no other words, no tagline, no frame, no extra objects, no watermark.

**Offene Punkte:** Die beiden Hintergründe sind getrennt erzeugt und zeigen nicht exakt dasselbe Bauwerk (Sonnenscheibe im Hochformat ohne, im Querformat mit Gesicht). Das Logo liegt nur als Rasterbild vor, nicht als Vektor. Die Markenrecherche zum Namen (T-508) ist noch nicht durchgeführt.

## Premium-Polish (2026-11-24)

### Schriften (keine KI, freie Lizenz)

| Schrift | Dateien | Quelle | Lizenz |
|---|---|---|---|
| Cinzel 700 | `public/fonts/cinzel-latin-700-normal.woff2`, `…-latin-ext-…` | npm-Paket `@fontsource/cinzel` | SIL Open Font License 1.1 |
| Source Sans 3, 400 und 600 | `public/fonts/source-sans-3-latin-*.woff2` | npm-Paket `@fontsource/source-sans-3` | SIL Open Font License 1.1 |

Die OFL erlaubt Einbettung und kommerzielle Nutzung; der Lizenztext muss mitgeliefert werden, wenn die Schriftdateien weitergegeben werden. **Der Lizenztext liegt dem Projekt noch nicht bei** (offener Punkt vor der Weitergabe).

### Neue Bilder

Werkzeug Higgsfield, Modell `gpt_image_2_6`, je 1 Variante. Kosten: 13 Bilder, geschätzt 10 Credits (nicht nachgemessen). Rechtliche Punkte wie oben offen; keine menschliche Überarbeitung. Alle Motivbeschreibungen enden mit demselben Stilblock wie der Symbolsatz.

| Asset | Rohdatei | Spieldatei | Job-ID | Motiv |
|---|---|---|---|---|
| Station Discovery | `raw/st1_discovery.png` | `public/ui/station1.png` | 5771dda7-ca84-4c24-8f57-c07d64e8fced | Steinmedaillon mit Goldrand, brennende Fackel, Bernstein |
| Station Treasure | `raw/st2_treasure.png` | `ui/station2.png` | d828c149-e2ab-4be7-8099-6c89d9f57e23 | offene Schatztruhe, Gold |
| Station Ancient Power | `raw/st3_ancient.png` | `ui/station3.png` | 419aa606-28f3-4fb3-b7dd-4bccbd8f5727 | Jade-Auge («not the Eye of Horus») |
| Station Relic | `raw/st4_relic.png` | `ui/station4.png` | d340b27d-fdef-4417-bd5f-410db1c28435 | Sonnenscheibe mit Türkis |
| Station Temple | `raw/st5_temple.png` | `ui/station5.png` | 5dba0d19-5e2d-4aa3-b3b7-d21d77c228d5 | Stufentor mit weissgoldenem Licht |
| Sonnenkammer | `raw/door_sun.png` | `ui/door_sun.png` | a4e5a37b-8164-47b0-92d6-cc7718f03a3f | geschlossenes Steintor, goldenes Sonnenemblem |
| Jadekammer | `raw/door_jade.png` | `ui/door_jade.png` | 16c2b402-ce35-41b1-85f2-5ec387381a84 | geschlossenes Steintor, Jademaske, Ranken |
| Mondkammer | `raw/door_moon.png` | `ui/door_moon.png` | a77d6f05-4fc8-445b-a51b-590bdc0a8014 | geschlossenes Steintor, Türkis-Mondsichel |
| Sun Relic (Artefakt) | `raw/sun_relic.png` | `ui/relic.webp` | 3ae02554-04ef-424e-8a8a-636000cdb192 | freistehende goldene Sonnenscheibe mit zwölf Strahlen, Türkisstein, Jade-Einlagen; erzeugt am 25.11.2026, 1 Variante; reines Anzeigeelement, kein Walzensymbol |
| Schatz | `raw/treasure.png` | `ui/treasure.png` | 49567760-9eea-4d3d-b65e-fb3579f93567 | Münzhaufen mit Edelsteinen und kleinem Idol |
| Tempelinneres hoch | `raw/bgfs_portrait.png` | `public/bgfs_portrait.jpg` | e96a729c-8dc7-4c22-9301-ab661d52260c | Säulenhalle, Sonnenscheibe, Lichtstrahlen |
| Tempelinneres quer | `raw/bgfs_landscape.png` | `public/bgfs_landscape.jpg` | f1fd6034-dda6-4ee3-879f-ab49487e0ee2 | wie oben, Querformat |
| Steinkachel | `raw/tile.png` | `ui/tile.png` | 2f790ba8-f91d-4416-8ebf-b48c44b58ebe | dunkle Steinplatte mit feiner Goldlinie |
| Spin-Scheibe | `raw/spin.png` | `ui/spin.png` | 35077e4c-c631-43c5-b882-26faa0e698d3 | goldene Sonnenscheibe mit Drehpfeil |

**Bearbeitung (automatisch, reproduzierbar mit `python3 tools/assets/process.py`):** dunkler Hintergrund freigestellt (Flutfüllung vom Bildrand, Kante geglättet), auf Inhalt zugeschnitten, zentriert, verkleinert. Die Symbole 0–7 wurden auf dieselbe Weise neu freigestellt (vorher mit dunklem Quadrat); der Explorer bleibt ein rundes Porträt. Hintergründe als JPEG.

**Offene Gestaltungspunkte:** Das Sonnenemblem der Sonnenkammer zeigt ein Gesicht, das der Stationen nicht. Die Jademaske am Tor hat Reisszähne und wirkt bedrohlicher als das Jade-Mask-Symbol. Das Treasure-Medaillon und das Schatzbild sind nicht auf Ähnlichkeit mit bestehenden Spielen geprüft.

## Publisher Readiness (2026-11-25)

Werkzeug Higgsfield, Modell `gpt_image_2_6`, je 1 Variante; 8 Bilder (eines mehr als geplant, weil das Mondtor vom Vortag nicht mehr als Bildvorlage abrufbar war und neu erzeugt wurde), geschätzt 6 Credits. Rechtliche Punkte wie oben offen; keine menschliche Überarbeitung.

| Asset | Rohdatei | Spieldatei | Job-ID | Hinweis |
|---|---|---|---|---|
| Rasterrahmen | `raw/frame.png` | `public/ui/frame.webp`, `frame.json` | 7969923e-fd5f-4d8f-9e42-04b86fc178b8 | Mitte ausgeschnitten; Öffnung wird auf das 6×5-Raster gelegt (Rahmen dabei um rund 10 % in der Breite gestaucht) |
| Jadekammer v2 | `raw/door_jade_v2.png` | `ui/door_jade.webp` | 52deacc5-a9a2-489b-a005-c171652ca10e | ruhige Maske ohne Zähne, ersetzt die erste Fassung |
| Sonnenkammer v2 | `raw/door_sun_v2.png` | `ui/door_sun.webp` | bf68a565-4a7d-40f5-820b-a3c3aceffe08 | Sonne ohne Gesicht, ersetzt die erste Fassung |
| Mondkammer v2 | `raw/door_moon_v2.png` | `ui/door_moon.webp` | eca14508-0d80-4604-ba69-8531422bb30e | neu erzeugt |
| Jadekammer offen | `raw/door_jade_open.png` | `ui/door_jade_open.webp` | c1a5901c-9cba-4c68-8a51-48edb0e004db | mit der geschlossenen Fassung als Bildvorlage erzeugt |
| Sonnenkammer offen | `raw/door_sun_open.png` | `ui/door_sun_open.webp` | b41d8a6a-f8a6-4238-bc50-f1be29d9fbc3 | ebenso |
| Mondkammer offen | `raw/door_moon_open.png` | `ui/door_moon_open.webp` | 75eb90c9-5b45-48d2-b952-5bd58d8350e8 | ebenso |
| Tempeltor offen | `raw/gate_open.png` | `ui/gate.webp` | 3a89a48d-be6f-456b-bd72-365e99a06906 | Einstieg in die Free Spins |

Die ersten Fassungen der drei Tore (`raw/door_sun.png`, `door_jade.png`, `door_moon.png`) sind VERWORFEN und bleiben nur zur Dokumentation erhalten.

**Formate:** Grosse Bilder liegen im Spiel nur noch als WebP vor (Hintergründe, Tore, Rahmen, Tor, Schatz, Logo); Symbole, Medaillons, Kachel und Spin-Scheibe als PNG. Alle Schritte stehen in `tools/assets/process.py`.

**Offene Gestaltungspunkte:** Die offenen Tore zeigen die Innenseiten der Torflügel mit einem gespiegelten Emblem (bei der Jadekammer zwei Maskenhälften); ob das als Fehler gelesen wird, ist nicht geprüft. Der Rahmen trägt an den Ecken Jade- und Türkis-Steine in einem etwas helleren Grün als die Symbole.

### Ton (ElevenLabs)

Erzeugt am 2026-11-25 über das verbundene ElevenLabs-Konto des Auftraggebers; heruntergeladen nach ausdrücklicher Zustimmung. Kosten: 13 Effekte je rund 17 Credits, 2 Musikstücke je 900 Credits, zusammen rund 2 020 Credits.

**Nicht geprüft:** Nutzungsbedingungen von ElevenLabs für kommerzielle Verwendung und Weiterlizenzierung; Schutzfähigkeit KI-erzeugter Musik. **Niemand hat die Dateien angehört** – ich kann keinen Ton wiedergeben. Bei der Musik meldete das Werkzeug die Einstellung «Instrumental: False», obwohl «no vocals» verlangt war; ob Gesang enthalten ist, muss der Auftraggeber anhören.

| Datei (`public/audio/`) | Roh (`assets/audio/raw/`) | Modell | Länge | Auftrag (gekürzt) |
|---|---|---|---|---|
| `spin.mp3` | `spin.mp3` | `eleven_text_to_sound_v2` | 0,9 s | leises Rauschen fallender Steinplatten |
| `land.mp3` | `land.mp3` | ebenso | 0,6 s | kleine Steine landen auf einer Steinplatte |
| `win.mp3` | `win.mp3` | ebenso | 1,3 s | drei aufsteigende warme Glockentöne |
| `winMid.mp3` | `winMid.mp3` | ebenso | 1,9 s | aufsteigendes Harfen- und Glocken-Arpeggio |
| `remove.mp3` | `remove.mp3` | ebenso | 0,7 s | Edelsteine zerfallen zu glitzerndem Staub |
| `step.mp3` | `step.mp3` | ebenso | 0,5 s | einzelner leiser Stein-Tick |
| `station.mp3` | `station.mp3` | ebenso | 1,75 s | Bronzeglocke mit aufsteigendem Schimmer |
| `relic.mp3` | `relic.mp3` | ebenso | 1,8 s | schimmernde hohe Glocken, anschwellend |
| `bonus.mp3` | `bonus_v2.mp3` | ebenso | 1,0 s | tiefer Tempelgong mit aufsteigendem Schimmer; zweite Fassung vom 25.11.2026 (verlangt waren 3 s, geliefert 1 s). Die erste Fassung `bonus.mp3` (0,5 s) liegt nur noch als Rohdatei vor |
| `door.mp3` | `door.mp3` | ebenso | 2,0 s | schweres Steintor öffnet sich, Lichtstoss |
| `freeSpins.mp3` | `freeSpins.mp3` | ebenso | 2,0 s | kurze triumphale Fanfare |
| `bigWin.mp3` | `bigWin.mp3` | ebenso | 1,0 s | Orchesterschlag mit Münzen (verlangt waren 4 s; geliefert 1 s) |
| `retrigger.mp3` | `retrigger.mp3` | ebenso | 1,6 s | kurzer heller Belohnungsakzent für zusätzliche Free Spins: aufsteigende Glocken, kleiner Trommelwirbel (25.11.2026; im Register nachgetragen am 25.11.2026) |
| `complete.mp3` | `complete.mp3` | ebenso | 2,0 s | Abschlussakzent des Features: warmer auflösender Akkord mit Hörnern, Harfenglissando, Glöckchen (25.11.2026; nachgetragen) |
| `button.mp3` | `button.mp3` | ebenso | 0,3 s | kurzer Klick (aus 6 s zugeschnitten) |
| `music_base.mp3` | `music_base.mp3` | `eleven_music_v2` | 45 s | ruhige, geheimnisvolle Schleife, etwa 80 bpm |
| `music_free.mp3` | `music_free.mp3` | ebenso | 45 s | treibende, heroische Schleife, etwa 120 bpm |

**Bearbeitung (automatisch, `tools/assets/audio.sh`):** Stille am Anfang entfernt, Länge begrenzt mit kurzem Ausblenden, Lautheit angeglichen, Effekte mono 96 kbit/s, Musik stereo 112 kbit/s mit kurzen Blenden an beiden Enden für die Schleife. Die Schleifen sind nicht auf Taktgrenzen geschnitten; ein hörbarer Übergang ist möglich.

Fällt eine Datei aus, spielt das Spiel für dieses Ereignis den im Code synthetisierten Ersatzton (`src/client/audio/sfx.ts`).
