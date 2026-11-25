# 07 – Art and Audio Inventory

Stand: 25.11.2026 · Dateien unter `public/` (ausgeliefert) · Masse und Grössen am 25.11.2026 aus
den Dateien gelesen · Detailregister mit Erzeugungsaufträgen: `assets/ASSET_REGISTER.md` ·
Rohbilder (1024 px bzw. Originalformat): `assets/reference/raw/`.

**Lizenzstatus:** UNGEPRÜFT = in der Demo nutzbar, kommerzielle Bedingungen nicht juristisch
geprüft · KLAR = Herkunft und Lizenz dokumentiert. Einzelheiten: `09_IP_And_Licensing_Register.md`.

## 1. Bilder

| Asset | Datei | Format | Grösse (px) | kB | Verwendung | Quelle | Status |
|---|---|---|---|---|---|---|---|
| Logo | `logo.webp` | WebP | 720×208 | 79 | Titel, Statusleiste | KI (Higgsfield `gpt_image_2_6`); nur Raster, kein Vektor | UNGEPRÜFT |
| Hintergrund Dschungel hoch / quer | `bg_portrait.webp` / `bg_landscape.webp` | WebP | 752×1344 / 1344×752 | 89 / 116 | Basisrunde | KI | UNGEPRÜFT |
| Hintergrund Tempel hoch / quer | `bgfs_portrait.webp` / `bgfs_landscape.webp` | WebP | 752×1344 / 1344×752 | 88 / 96 | Free Spins, Temple Bonus | KI | UNGEPRÜFT |
| Spielfeldrahmen | `ui/frame.webp` (+ `frame.json`) | WebP | 1100×877 | 60 | Rahmen um das Raster | KI | UNGEPRÜFT |
| Kachel | `ui/tile.png` | PNG | 256×256 | 80 | Feldhintergrund | KI | UNGEPRÜFT |
| Sapphire Gem | `symbols/sym0.png` | PNG | 256×256 | 57 | Gewinnsymbol | KI | UNGEPRÜFT |
| Golden Scarab | `symbols/sym1.png` | PNG | 256×256 | 79 | Gewinnsymbol | KI | UNGEPRÜFT |
| Golden Chalice | `symbols/sym2.png` | PNG | 256×256 | 68 | Gewinnsymbol | KI | UNGEPRÜFT |
| Ruby Crown | `symbols/sym3.png` | PNG | 256×256 | 74 | Gewinnsymbol | KI | UNGEPRÜFT |
| Jade Mask | `symbols/sym4.png` | PNG | 256×256 | 94 | Gewinnsymbol | KI | UNGEPRÜFT |
| Wild | `symbols/sym5.png` | PNG | 256×256 | 106 | Wild | KI | UNGEPRÜFT |
| Compass | `symbols/sym6.png` | PNG | 256×256 | 76 | Auslöser | KI | UNGEPRÜFT |
| Temple Key | `symbols/sym7.png` | PNG | 256×256 | 59 | Sondersymbol | KI | UNGEPRÜFT |
| Explorer | `symbols/sym8.png` | PNG | 256×256 | 121 | stehendes Wild | KI; erzeugtes Gesicht, Ähnlichkeit mit realer Person ungeprüft | UNGEPRÜFT |
| Stationsmedaillons 1–5 | `ui/station1.png` … `station5.png` | PNG | 192×192 | 69–74 | Expedition Track | KI | UNGEPRÜFT |
| Sun Relic | `ui/relic.webp` | WebP | 384×384 | 41 | Relikt-Momente, Bonus, Regeln | KI (25.11.2026) | UNGEPRÜFT |
| Tempeltor | `ui/gate.webp` | WebP | 512×512 | 58 | Free-Spins-Einstieg | KI | UNGEPRÜFT |
| Kammertore zu / offen (Sonne, Jade, Mond) | `ui/door_*.webp`, `ui/door_*_open.webp` | WebP | 450×590–593 | 70–88 | Temple Bonus | KI | UNGEPRÜFT |
| Schatz | `ui/treasure.webp` | WebP | 320×320 | 29 | Kammerpreis | KI | UNGEPRÜFT |
| Spin-Knopf | `ui/spin.png` | PNG | 256×256 | 117 | Bedienung | KI | UNGEPRÜFT |
| Lichteffekte (Funken, Schein, Strahlen, Münzen, Schatten) | zur Laufzeit im Code erzeugt | – | – | – | Effekte | eigene Arbeit | KLAR |
| Platzhalter-Symbole | im Code gezeichnet | – | – | – | Rückfall, `?art=placeholder` | eigene Arbeit | KLAR |

Alle KI-Bilder: keine menschliche Überarbeitung, nur automatisches Freistellen und Skalieren
(`tools/assets/process.py`). Symbole liegen in 256 px vor; auf hochauflösenden Tablets ist das
knapp (nicht auf Geräten geprüft).

## 2. Ton

| Asset | Datei (`public/audio/`) | Dauer | kB | Verwendung | Quelle | Status |
|---|---|---|---|---|---|---|
| Knopf | `button.mp3` | 0,29 s | 4 | Bedienung | KI (ElevenLabs `eleven_text_to_sound_v2`) | UNGEPRÜFT |
| Spin | `spin.mp3` | 0,94 s | 11 | Spinstart | KI | UNGEPRÜFT |
| Landen | `land.mp3` | 0,63 s | 8 | Symbole landen | KI | UNGEPRÜFT |
| Gewinn / mittlerer Gewinn | `win.mp3` / `winMid.mp3` | 1,33 / 1,93 s | 16 / 23 | Clustergewinn | KI | UNGEPRÜFT |
| Entfernen | `remove.mp3` | 0,73 s | 9 | Symbole verschwinden | KI | UNGEPRÜFT |
| Schritt | `step.mp3` | 0,50 s | 6 | Track-Schritt | KI | UNGEPRÜFT |
| Station | `station.mp3` | 1,75 s | 21 | Station erreicht | KI | UNGEPRÜFT |
| Relikt | `relic.mp3` | 1,83 s | 22 | Sun Relic | KI | UNGEPRÜFT |
| Bonus | `bonus.mp3` | 1,04 s | 13 | Temple Bonus beginnt (kürzer als gewünscht) | KI | UNGEPRÜFT |
| Tor | `door.mp3` | 2,04 s | 24 | Kammer öffnet | KI | UNGEPRÜFT |
| Free Spins / Retrigger | `freeSpins.mp3` / `retrigger.mp3` | 2,04 / 1,65 s | 24 / 20 | Feature | KI | UNGEPRÜFT |
| Abschluss | `complete.mp3` | 2,04 s | 24 | Feature-Ende | KI | UNGEPRÜFT |
| Grosser Gewinn | `bigWin.mp3` | 1,04 s | 13 | Gewinnstufen (kürzer als gewünscht) | KI | UNGEPRÜFT |
| Musik Basisrunde | `music_base.mp3` | 45,0 s | 616 | Schleife | KI (ElevenLabs `eleven_music_v2`) | UNGEPRÜFT |
| Musik Free Spins | `music_free.mp3` | 45,0 s | 616 | Schleife | KI | UNGEPRÜFT |
| Ersatztöne | im Code synthetisiert | – | – | Rückfall | eigene Arbeit | KLAR |

Der Projektinhaber hat die Töne am 25.11.2026 im Spiel angehört: «Die Musik und die Töne klingen
gut und passen zum Slot.» Lautstärkeverhältnisse und Schleifenpunkte der Musik sind nicht
technisch geprüft. Eine Dschungel-Atmosphäre wurde erzeugt, aber nicht
ausgeliefert (Clip zu kurz für eine Schleife).

## 3. Schriften

| Schrift | Dateien (`public/fonts/`) | Verwendung | Lizenz | Status |
|---|---|---|---|---|
| Cinzel 700 | `cinzel-latin-700-normal.woff2`, `cinzel-latin-ext-700-normal.woff2` | Titel, Zahlen | SIL OFL 1.1 | KLAR; Lizenztext noch nicht im Build |
| Source Sans 3 (400, 600) | `source-sans-3-*.woff2` (3 Dateien) | Lesetext | SIL OFL 1.1 | wie oben |

## 4. Animationen (alle im Code, keine Animationsdateien)

Walzenwechsel als durchgehender Streifen · Kaskade mit Auflösen, Fallen und Aufsetzen ·
Gewinnmarkierung mit Betrag · Stationsgesten und Lichtstrahl · Relikt-Moment · Free-Spins-Tor ·
Kulissenwechsel · Kammeröffnung mit Überblendung der Torbilder · Gewinnstufen (ab 5×, 20×, 100×)
mit Münzregen · Titelbildschirm. Quellen: `src/client/views/*.ts`, `src/client/fx.ts`.
**Nicht vorhanden:** Einzelbild-Animationen der Symbole, Skelett-Animationen (Spine o. Ä.).

## 5. Visuelle Markenidentität

| Element | Festlegung |
|---|---|
| Farben | Nachtblau/Stein als Grund, Gold (`#e8b84a`, hell `#ffd76a`), Jade (`#3fae7c`), Türkis (`#39c6c0`) – `src/client/theme.ts` |
| Schrift | Cinzel für Titel und Zahlen, Source Sans 3 für Text |
| Leitmotiv | Sonnenscheibe: im Logo, als Wild, als Sun Relic, im Spin-Knopf, im Rahmen |
| Welt | erfundene Tempelkultur; Stufenfries-Ornamente ohne Bezug auf reale Kulturen (Vorgabe im GDD; **nicht von Fachleuten geprüft**) |

## 6. Bewertung nach Kriterien

Skala 1–10; «–» = nicht bewertbar, weil ungeprüft.

| Kriterium | Note | Begründung | Grenze |
|---|---|---|---|
| Konsistenz | 7,5 | ein Werkzeug, ein Stilblock, durchgehende Farbwelt | zwei Hintergründe zeigen nicht exakt dasselbe Bauwerk; keine menschliche Überarbeitung |
| Lesbarkeit | 7 | klare Silhouetten auf dunkler Kachel; Texte im Test nie überlappend | drei goldene Symbole ähneln sich; Farbfehlsichtigkeit ungeprüft |
| Symbolqualität | 7 | einheitliches Licht, freigestellt | 256 px, Standbilder |
| Animation | 7,5 | flüssige Abläufe, kein leeres Feld, keine Verzerrung (gemessen) | keine Symbolanimationen |
| Mobile UX | – (im Browser-Test 6,5) | zehn Formate ohne Überlappung | **kein echtes Gerät** |
| Performance | – | Langzeittest stabil | **keine Messung auf Hardware** |
| Wiedererkennungswert | 7 | Sonnenmotiv zieht sich durch | Markenrecherche fehlt; nur Rasterlogo |
| Ton | – (keine eigene Note) | vollständig eingebunden; vom Projektinhaber angehört: «klingen gut und passen zum Slot» (25.11.2026) | keine Zweitmeinung, keine technische Prüfung |
