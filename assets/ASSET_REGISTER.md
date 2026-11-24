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
