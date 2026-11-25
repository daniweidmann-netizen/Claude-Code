# 09 – IP and Licensing Register

Stand: 25.11.2026

> **Tatsachenübersicht, kein Rechtsgutachten.** Wo ein Recht nicht geprüft ist, steht das so da.
> Es wird keine Rechtebestätigung behauptet, die nicht existiert. Grundlage:
> `docs/publisher/05_ASSET_AND_RIGHTS_REGISTER.md`, `assets/ASSET_REGISTER.md`.

## 1. Übersicht

| Bestandteil | Urheber / Quelle | Lizenz | Kommerziell nutzbar? | Namensnennung | Einschränkungen / fehlender Nachweis |
|---|---|---|---|---|---|
| Spielidee, Regeln, Mathematik | Eigentümer; ausgearbeitet mit KI-Assistent (Claude) | – (keine Lizenzdatei im Repository) | **ungeklärt:** Schutzfähigkeit und Urheberschaft KI-gestützter Arbeit nicht juristisch geprüft | – | schriftliche Rechtekette fehlt |
| Quellcode (Engine, Client, Werkzeuge) | wie oben; kein Code aus anderen Spielen oder Slot-Frameworks übernommen (Angabe des Entwicklers) | – | **ungeklärt** wie oben | – | keine weiteren Mitwirkenden bekannt; kein Arbeits- oder Auftragsverhältnis bekannt |
| Phaser 3.90 | Phaser Studio Inc. und Mitwirkende | MIT | ja | Lizenzhinweis muss mitgeliefert werden | **Hinweis fehlt noch im Build** |
| TypeScript, Vite, Vitest, fast-check, Playwright | jeweilige Projekte | Apache-2.0 / MIT | nur Werkzeuge, nicht im Spiel | – | keine |
| Schrift Cinzel | Natanael Gama u. a. | SIL OFL 1.1 | ja, Einbetten erlaubt | Lizenztext mitliefern | **Lizenztext fehlt im Build** |
| Schrift Source Sans 3 | Adobe | SIL OFL 1.1 | ja | wie oben | wie oben |
| 9 Symbole, 5 Medaillons, Rahmen, Kachel, Tore, Schatz, Tor, Spin-Knopf, Sun Relic, 4 Hintergründe, Logo | KI-erzeugt mit Higgsfield (Modell `gpt_image_2_6`) im Konto des Eigentümers | Nutzungsbedingungen des Anbieters | **ungeprüft.** Laut Hilfeseite des Anbieters kommerzielle Nutzung erlaubt; die vollständigen Bedingungen und die des zugrunde liegenden Bildmodells wurden nicht gelesen | unbekannt | keine menschliche Überarbeitung; Urheberrechtsschutz rein KI-erzeugter Bilder in wichtigen Rechtsordnungen fraglich; keine Ähnlichkeitsprüfung; Explorer-Gesicht ungeprüft |
| 15 Soundeffekte, 2 Musikschleifen | KI-erzeugt mit ElevenLabs (`eleven_text_to_sound_v2`, `eleven_music_v2`) im Konto des Eigentümers | Nutzungsbedingungen des Anbieters | **ungeprüft** (kommerzielle Nutzung, Unterlizenzierung, Tarifabhängigkeit nicht geprüft) | unbekannt | nie angehört; Ähnlichkeit zu bestehender Musik ungeprüft |
| Lichteffekte, Platzhalter, Ersatztöne | im Code erzeugt | wie Quellcode | wie Quellcode | – | – |
| Name «Temple of the Lost Sun» und Claim | Eigentümer | nicht als Marke angemeldet | **ungeklärt** | – | Websuche vom 24.11.2026 fand keinen Slot dieses Namens, aber ähnliche Titel («Temple of the Sun», «Lost Temple», «Solar Temple», «Aztec Sun»); **keine Recherche in Markenregistern** |

Copyleft-Abhängigkeiten: keine bekannt.

## 2. Nachweise, die fehlen

1. Vollständige, gelesene Nutzungsbedingungen von Higgsfield und ElevenLabs samt Nachweis des
   Tarifs zum Zeitpunkt der Erzeugung.
2. Bedingungen des zugrunde liegenden Bildmodells.
3. Schriftliche Erklärung zur Rechtekette (wer hat was wann geschaffen; keine Dritten beteiligt).
4. Juristische Einschätzung zur Schutzfähigkeit von KI-Bildern, KI-Ton und KI-gestütztem Code
   in den Zielmärkten.
5. Markenrecherche (EUIPO, IGE Schweiz, USPTO, WIPO) und gegebenenfalls Anmeldung.
6. Ähnlichkeitsprüfung der Bilder und der Musik.
7. Lizenztexte (MIT, OFL) im Build.

## 3. Vor Verkauf oder Lizenzierung rechtlich zu prüfen

- Kann der Eigentümer **ausschliessliche** Rechte an den KI-erzeugten Bildern und Tönen
  überhaupt einräumen oder übertragen? Falls nein: Ersatz durch beauftragte Werke mit sauberer
  Rechteübertragung, oder Preisabschlag.
- Wer gilt als Urheber des Codes, und was folgt daraus für eine Übertragung?
- Rechtsform, unter der der Eigentümer Verträge schliesst; Gewährleistungen, die er abgeben kann.
- Namenskollisionen und Markenschutz.
- Kulturelle Prüfung der Bildwelt (erfundene Kultur; Abgrenzung zu realen Kulturen).

**Ergebnis:** Das geistige Eigentum ist **nicht vollständig geklärt**. Für Modell C
(IP-Verkauf) ist das der wichtigste offene Punkt; bei den Modellen A und B kann ein Partner Bild
und Ton ersetzen, die Frage zum Code und zur Marke bleibt.
