# IMAGE GENERATION ORIGIN AUDIT

Stand: 25. November 2026 · Technische Herkunftsprüfung aller Grafiken · keine Rechtsberatung

Legende: **BELEGT** = durch technische Spuren im Projekt nachgewiesen · **UNCONFIRMED** = nicht
nachweisbar · **OFFEN** = Angabe des Projektinhabers oder des Anbieters nötig.

## 1. Ergebnis

| Frage | Antwort | Status |
|---|---|---|
| Über welche Plattform wurden die Bilder erzeugt? | **Higgsfield** (Anschluss «Higgsfield» im Entwicklungswerkzeug, Aufruf `generate_image`) | BELEGT für alle 37 Rohbilder |
| Welches Modell wurde angefordert? | Modellkennung der Plattform: `gpt_image_2_6` (von Higgsfield im Werkzeug als «GPT Image 2.6» bezeichnet) | BELEGT für alle 42 Aufrufe |
| Wer hat das Bild technisch erzeugt? | Ein **OpenAI**-Bilddienst: Jede Rohdatei trägt eine eingebettete Herkunftssignatur (C2PA) mit Aussteller «OpenAI Media Service API», Software «API», Version «gpt-image», Quelltyp «trainedAlgorithmicMedia» | BELEGT durch Dateiinhalt; die kryptografische Gültigkeit der Signatur wurde **nicht** mit einem Prüfwerkzeug validiert |
| Wurde OpenAI direkt genutzt (eigenes OpenAI-Konto, ChatGPT, OpenAI-API)? | **Nein.** Im Sitzungsprotokoll gibt es keinen einzigen Aufruf eines OpenAI-Dienstes; alle Bilder kamen über Higgsfield | BELEGT für diese Entwicklungssitzung |
| War Claude Code der Bildgenerator? | **Nein.** Claude Code hat die Aufträge formuliert, den Dienst aufgerufen, die Ergebnisse heruntergeladen und automatisch zugeschnitten. Es hat kein Bild selbst erzeugt | BELEGT |
| Stammen alle Bilder vom selben Anbieter und Modell? | Ja: alle 37 Rohbilder, gleiche Plattform, gleiche Modellkennung, gleiche Signatur | BELEGT |
| Welcher Higgsfield-Tarif? | Kontoabfrage vom 24.11.2026, 15:14 UTC: `subscription_plan_type: "basic"`, 47,28 Credits | BELEGT als Momentaufnahme; Rechnung und Tarifbedingungen: **OFFEN** (Projektinhaber) |
| In wessen Konto? | im mit dem Entwicklungswerkzeug verbundenen Higgsfield-Konto des Projektinhabers (Benutzerkennung in den Ergebnis-Adressen) | BELEGT; Kontoinhaber und Vertragspartner: **OFFEN** (Projektinhaber bestätigt) |
| Vertragsbeziehung zu OpenAI? | Keine direkte bekannt. Higgsfield hat das OpenAI-Modell aufgerufen | Rechtsfolge **OFFEN** (siehe `AI_GRAPHICS_LICENSE_AUDIT.md`) |

Damit ist die Erinnerung des Projektinhabers («Higgsfield oder OpenAI») aufgelöst: **beides trifft
zu, auf verschiedenen Ebenen** – Higgsfield als Plattform und Vertragspartner, ein OpenAI-Modell
als ausführender Generator, Claude Code als steuerndes Werkzeug.

## 2. Beweismittel

| Nr. | Beweismittel | Wo | Aussage |
|---|---|---|---|
| E1 | Sitzungsprotokoll der Entwicklung (23.–25.11.2026) | lokal beim Entwicklungswerkzeug, **nicht im Repository** | 42 Aufrufe `generate_image`, alle mit `model: gpt_image_2_6`: 34 erfolgreiche Aufrufe mit zusammen 37 Bildern (drei Aufrufe lieferten je zwei Varianten), 8 Fehlversuche ohne Bild (6× Begrenzung paralleler Aufträge, 2× Referenzbild nicht mehr verfügbar); vollständige Auftragstexte, Zeitstempel, Auftragskennungen |
| E2 | Eingebettetes Feld `hf-job-id` in jeder Rohdatei | `assets/reference/raw/*.png` | Higgsfield-Auftragskennung; stimmt bei allen 37 Dateien mit dem Register und mit E1 überein |
| E3 | Eingebettete C2PA-Herkunftsangabe in jeder Rohdatei | wie oben | Aussteller OpenAI, Erzeugungszeitpunkt, «trainedAlgorithmicMedia» (= vollständig KI-erzeugt) |
| E4 | Asset-Register | `assets/ASSET_REGISTER.md` | je Bild: Rohdatei, Spieldatei, Auftragskennung, Motivbeschreibung |
| E5 | Aufbereitungsskript | `tools/assets/process.py` | welche Rohdatei zu welcher Spieldatei wird; nur Freistellen, Zuschneiden, Skalieren, Formatwandlung |
| E6 | Versionsverlauf | Git, Commits vom 24. und 25.11.2026 | Zeitpunkt, zu dem jede Datei ins Projekt kam |
| E7 | Kontoabfrage | E1 | Tarifbezeichnung «basic» am 24.11.2026 |

**Wichtig für die Beweissicherung:** E1 liegt nur in der Arbeitsumgebung und geht verloren, wenn
sie gelöscht wird. Die Rohdateien (E2, E3) liegen im Repository und sind dauerhaft. Die
**ausgelieferten** Bilder unter `public/` enthalten die Signaturen nicht mehr (durch die
Aufbereitung entfernt; geprüft: 0 von 37).

Nicht gefunden (danach wurde gesucht): Higgsfield-CLI-Konfiguration, OpenAI-API-Schlüssel oder
-Konfiguration im Repository, separate Prompt-Dateien, Exportverzeichnisse, Bilder aus anderen
Quellen (Stock, Handzeichnung, andere Generatoren).

## 3. Inventar aller erzeugten Bilder

Generator und Modell sind für jede Zeile gleich: **Plattform Higgsfield · Modellkennung
`gpt_image_2_6` · Signatur OpenAI «gpt-image» · Tarif «basic» (Momentaufnahme)**. Zeitpunkt aus
der eingebetteten Signatur. Rechte-Status für alle Zeilen: **Herkunft BELEGT – Nutzungsrechte
vertraglich, nicht geprüft; Urheberrechtsschutz fraglich** (siehe `AI_GRAPHICS_LICENSE_AUDIT.md`,
`SWISS_COPYRIGHT_AND_AI_REVIEW.md`).

| Asset | Rohdatei (`assets/reference/raw/`) | Spieldatei | Higgsfield-Auftrag | Erzeugt | Grösse | SHA-256 (Anfang) |
|---|---|---|---|---|---|---|
| Sapphire Gem | `sapphire.png` | `public/symbols/sym0.png` | `9ebbca19-ea3b-4979-b9e9-9c711234e118` | 2026-11-24 15:19:33 UTC | 1024x1024 | `6bf8710bf14084b9…` |
| Golden Scarab | `scarab.png` | `public/symbols/sym1.png` | `26f39eac-8360-408c-b21e-176b69718d62` | 2026-11-24 15:19:41 UTC | 1024x1024 | `1099dd04fcbf5b00…` |
| Golden Chalice | `chalice.png` | `public/symbols/sym2.png` | `9cadcd26-766d-4318-b034-51df0662c876` | 2026-11-24 15:19:47 UTC | 1024x1024 | `a045581d2565650f…` |
| Ruby Crown | `crown.png` | `public/symbols/sym3.png` | `5339daa4-1d95-4f90-adc4-8aafad943c11` | 2026-11-24 15:20:11 UTC | 1024x1024 | `101eb8a37ab73f27…` |
| Jade Mask | `jade_mask_b.png` | `public/symbols/sym4.png` | `06379c7f-ab7e-4ea5-ad66-f0935ed2dc2d` | 2026-11-24 15:14:46 UTC | 1024x1024 | `0913e5ce3bb1d842…` |
| Wild | `wild_a.png` | `public/symbols/sym5.png` | `201a38f2-b73f-42c5-9017-5d2b20ede290` | 2026-11-24 15:14:53 UTC | 1024x1024 | `9b3708d227c44f0b…` |
| Compass | `compass.png` | `public/symbols/sym6.png` | `7945e184-7686-4659-9e8c-e6edc382c213` | 2026-11-24 15:20:07 UTC | 1024x1024 | `f8815a4300947fc9…` |
| Temple Key | `key.png` | `public/symbols/sym7.png` | `b00d746c-78b3-4894-b702-dca38ba0f2a1` | 2026-11-24 15:20:05 UTC | 1024x1024 | `07414bccf8c5f26f…` |
| Explorer | `explorer.png` | `public/symbols/sym8.png` | `1fd7e9e2-7917-49b1-9e17-b5cf3829b589` | 2026-11-24 15:20:12 UTC | 1024x1024 | `60848f1ef14091a9…` |
| Logo mit Spieltitel | `logo_b.png` | `public/logo.webp` | `c8d81381-5982-42d3-9415-03d4be36ee6c` | 2026-11-24 16:19:40 UTC | 1344x752 | `236dbe33f0c85fad…` |
| Hintergrund Dschungel hoch | `bg_portrait.png` | `public/bg_portrait.webp` | `ddd4daa6-d261-4e4e-96a9-946c05592313` | 2026-11-24 16:19:33 UTC | 752x1344 | `b0ab9d1453f9fdd6…` |
| Hintergrund Dschungel quer | `bg_landscape.png` | `public/bg_landscape.webp` | `b1836ad1-1088-42ec-a510-71264fc7cbb8` | 2026-11-24 16:19:33 UTC | 1344x752 | `97ebcb0ba07f12fb…` |
| Hintergrund Tempel hoch (Free Spins, Temple Bonus) | `bgfs_portrait.png` | `public/bgfs_portrait.webp` | `e96a729c-8dc7-4c22-9301-ab661d52260c` | 2026-11-24 18:01:29 UTC | 752x1344 | `c066a270e4c6cb64…` |
| Hintergrund Tempel quer | `bgfs_landscape.png` | `public/bgfs_landscape.webp` | `f1fd6034-dda6-4ee3-879f-ab49487e0ee2` | 2026-11-24 18:01:06 UTC | 1344x752 | `d58a124bfab0c2c2…` |
| Expedition Track: Station Discovery | `st1_discovery.png` | `public/ui/station1.png` | `5771dda7-ca84-4c24-8f57-c07d64e8fced` | 2026-11-24 18:00:33 UTC | 1024x1024 | `a12389aa9006bcb7…` |
| Expedition Track: Station Treasure | `st2_treasure.png` | `public/ui/station2.png` | `d828c149-e2ab-4be7-8099-6c89d9f57e23` | 2026-11-24 18:00:38 UTC | 1024x1024 | `249ede7c5fbb9e0f…` |
| Expedition Track: Station Ancient Power | `st3_ancient.png` | `public/ui/station3.png` | `419aa606-28f3-4fb3-b7dd-4bccbd8f5727` | 2026-11-24 18:00:50 UTC | 1024x1024 | `e8d9d44b613d6219…` |
| Expedition Track: Station Relic | `st4_relic.png` | `public/ui/station4.png` | `d340b27d-fdef-4417-bd5f-410db1c28435` | 2026-11-24 18:00:48 UTC | 1024x1024 | `b744bd6c3bfa4985…` |
| Expedition Track: Station Temple | `st5_temple.png` | `public/ui/station5.png` | `5dba0d19-5e2d-4aa3-b3b7-d21d77c228d5` | 2026-11-24 18:01:58 UTC | 1024x1024 | `e15aca38b210edef…` |
| Sun Relic (Artefakt) | `sun_relic.png` | `public/ui/relic.webp` | `3ae02554-04ef-424e-8a8a-636000cdb192` | 2026-11-25 13:57:15 UTC | 1024x1024 | `192c328c5f0532dd…` |
| UI: Spielfeldrahmen | `frame.png` | `public/ui/frame.webp` | `7969923e-fd5f-4d8f-9e42-04b86fc178b8` | 2026-11-25 05:42:41 UTC | 1120x896 | `b84a95111bd7f9b7…` |
| UI: Kachel | `tile.png` | `public/ui/tile.png` | `2f790ba8-f91d-4416-8ebf-b48c44b58ebe` | 2026-11-24 18:01:09 UTC | 1024x1024 | `b3d9b42abfba288f…` |
| UI: Spin-Knopf | `spin.png` | `public/ui/spin.png` | `35077e4c-c631-43c5-b882-26faa0e698d3` | 2026-11-24 18:01:11 UTC | 1024x1024 | `ed2764d4a37b3071…` |
| Free Spins: Tempeltor | `gate_open.png` | `public/ui/gate.webp` | `3a89a48d-be6f-456b-bd72-365e99a06906` | 2026-11-25 05:42:49 UTC | 1024x1024 | `8c66f99677bd9162…` |
| Temple Bonus: Schatz | `treasure.png` | `public/ui/treasure.webp` | `49567760-9eea-4d3d-b65e-fb3579f93567` | 2026-11-24 18:01:27 UTC | 1024x1024 | `353ab04ebaf0f257…` |
| Temple Bonus: Sonnenkammer zu | `door_sun_v2.png` | `public/ui/door_sun.webp` | `bf68a565-4a7d-40f5-820b-a3c3aceffe08` | 2026-11-25 05:42:48 UTC | 880x1168 | `ae59cb29cd3c3b58…` |
| Temple Bonus: Sonnenkammer offen | `door_sun_open.png` | `public/ui/door_sun_open.webp` | `b41d8a6a-f8a6-4238-bc50-f1be29d9fbc3` | 2026-11-25 05:43:31 UTC | 880x1168 | `30a9d6b3bf4c4011…` |
| Temple Bonus: Jadekammer zu | `door_jade_v2.png` | `public/ui/door_jade.webp` | `52deacc5-a9a2-489b-a005-c171652ca10e` | 2026-11-25 05:42:41 UTC | 880x1168 | `bd1ecdc4e50dfbf7…` |
| Temple Bonus: Jadekammer offen | `door_jade_open.png` | `public/ui/door_jade_open.webp` | `c1a5901c-9cba-4c68-8a51-48edb0e004db` | 2026-11-25 05:43:23 UTC | 880x1168 | `e4319b9b0d8f27c9…` |
| Temple Bonus: Mondkammer zu | `door_moon_v2.png` | `public/ui/door_moon.webp` | `eca14508-0d80-4604-ba69-8531422bb30e` | 2026-11-25 05:43:48 UTC | 880x1168 | `8362d111de41a249…` |
| Temple Bonus: Mondkammer offen | `door_moon_open.png` | `public/ui/door_moon_open.webp` | `75eb90c9-5b45-48d2-b952-5bd58d8350e8` | 2026-11-25 05:44:14 UTC | 880x1168 | `bd5d04a88da4461c…` |
| Jade Mask, Variante A | `jade_mask_a.png` | `– (nicht verwendet)` | `88d18963-2b19-4bc7-b537-126ee70c0b18` | 2026-11-24 15:15:00 UTC | 1024x1024 | `11970fb3ddd67908…` |
| Wild, Variante B | `wild_b.png` | `– (nicht verwendet)` | `a7ba59af-ef39-40a7-afc6-be48805443f3` | 2026-11-24 15:15:05 UTC | 1024x1024 | `ca82f0b36a931682…` |
| Logo, Variante A | `logo_a.png` | `– (nicht verwendet)` | `42daf621-3e6c-4a00-a324-dba83d7ef5cf` | 2026-11-24 16:19:36 UTC | 1344x752 | `ce20e21735569255…` |
| Sonnenkammer, erste Fassung | `door_sun.png` | `– (nicht verwendet)` | `a4e5a37b-8164-47b0-92d6-cc7718f03a3f` | 2026-11-24 18:00:51 UTC | 880x1168 | `3d41badab0348cba…` |
| Jadekammer, erste Fassung | `door_jade.png` | `– (nicht verwendet)` | `16c2b402-ce35-41b1-85f2-5ec387381a84` | 2026-11-24 18:02:06 UTC | 880x1168 | `753bd87b5b6314b4…` |
| Mondkammer, erste Fassung | `door_moon.png` | `– (nicht verwendet)` | `a77d6f05-4fc8-445b-a51b-590bdc0a8014` | 2026-11-24 18:01:06 UTC | 880x1168 | `a7d05003ef1146a1…` |
31 Rohbilder sind im Spiel verwendet, 6 sind verworfene Varianten (Auswahl durch den
Projektinhaber: «Mask B und Wild A», Logo B; erste Fassungen der Tore ersetzt).

### Referenzbilder

Drei Aufträge (offene Kammertore) verwendeten ein Referenzbild. Referenz war jeweils **ein zuvor
im selben Konto erzeugtes Bild** (geschlossenes Tor, zweite Fassung). Es wurde **kein fremdes
Bild**, kein Foto, kein Logo und kein Werk Dritter hochgeladen. BELEGT durch E1.

### Bearbeitung

Ausschliesslich automatisch (`tools/assets/process.py`): Hintergrund entfernen, zuschneiden,
skalieren, in PNG/WebP speichern; beim Explorer Rundmaske; beim Logo Freistellen über Helligkeit.
**Keine manuelle Bearbeitung, keine Retusche, keine Übermalung durch einen Menschen.**

## 4. Nicht KI-erzeugte Grafik

| Bestandteil | Herkunft | Status |
|---|---|---|
| Lichteffekte (Funken, Schein, Strahlen, Münzen, Schatten) | zur Laufzeit im Programmcode gezeichnet (`src/client/fx.ts`) | BELEGT |
| Platzhalter-Symbole | im Programmcode gezeichnet (`src/client/textures.ts`) | BELEGT |
| Bedienelemente (Knöpfe, Tafeln, Startknopf, Schilder) | im Programmcode gezeichnet | BELEGT |
| Schriften Cinzel, Source Sans 3 | freie Schriften (SIL OFL 1.1) | BELEGT, siehe `THIRD_PARTY_SOFTWARE_LICENSES.md` |

## 5. Geforderte Einzelposten

| Posten aus dem Auftrag | Befund |
|---|---|
| Hauptlogo, Spieltitel | `logo_b.png` → `public/logo.webp`; der Schriftzug ist Teil des erzeugten Bildes (keine Schriftdatei), nur Raster, kein Vektor |
| Hintergrund | vier Bilder (Dschungel und Tempel, je hoch und quer) |
| Golden Scarab, Jade Mask, Golden Chalice, Ruby Crown, Sapphire Gem, Compass, Temple Key, Explorer, Wild | je ein Bild, siehe Tabelle |
| Sun Relic | `sun_relic.png`, erzeugt am 25.11.2026 |
| Expedition Track | fünf Stationsmedaillons; Linien und Trittsteine im Code |
| Temple Bonus | drei Tore (zu/offen), Schatz; Hintergrund = Tempelbild |
| Free Spins | Tempeltor, Tempelhintergrund |
| UI-Elemente | Rahmen, Kachel, Spin-Knopf als Bild; übrige im Code |
| Trailer-Grafiken, Werbematerialien | **nicht vorhanden** im Projekt |

## 6. Offene Punkte zur Herkunft

1. Rechnung bzw. Abo-Nachweis des Higgsfield-Kontos für November 2026 (Tarif, Zeitraum, Kontoinhaber). **OFFEN – Projektinhaber.**
2. Bestätigung von Higgsfield, welches Modell welches Anbieters sich hinter `gpt_image_2_6` verbirgt und unter welchen Bedingungen dessen Ausgaben stehen. **OFFEN – Higgsfield.**
3. Validierung der C2PA-Signaturen mit einem offiziellen Prüfwerkzeug. **OFFEN – technisch einfach nachholbar.**
4. Sicherung des Sitzungsprotokolls (E1) als Beweismittel. **OFFEN – Projektinhaber.**
5. Der Projektinhaber sollte bestätigen, dass ausserhalb dieser Entwicklungssitzung keine weiteren Bilder für das Projekt erzeugt oder eingefügt wurden.
