# ELEVENLABS AUDIO LICENSE AUDIT

Stand: 25. November 2026 · keine Rechtsberatung

> **Quellenlage der Vertragsbedingungen:** Die offiziellen Seiten von ElevenLabs waren aus der
> Arbeitsumgebung **nicht abrufbar** (Netzwerksperre). Alle Aussagen zu den Bedingungen stammen
> aus **Suchergebnis-Auszügen** der offiziellen Seiten vom 25.11.2026 – kurze, möglicherweise
> gekürzte Fragmente, nicht am Volltext geprüft. Sie sind als «AUSZUG» gekennzeichnet und müssen
> vor jeder Verwendung im Volltext gelesen werden. Technische Befunde sind «BELEGT».

## 1. Technische Herkunft (BELEGT)

| Punkt | Befund | Nachweis |
|---|---|---|
| Dienst | ElevenLabs, über den Anschluss «ElevenLabs» des Entwicklungswerkzeugs, Funktion «creative_generate_in_flow» | Sitzungsprotokoll: 22 Aufrufe am 25.11.2026 (05:58–05:59 und 07:23 UTC) |
| Modelle | Effekte: `eleven_text_to_sound_v2` · Musik: `eleven_music_v2` | wie oben |
| Herkunftssignatur | Alle 18 Rohdateien tragen eine eingebettete C2PA-Angabe mit Aussteller «Eleven Labs Inc.» | Dateiinhalt `assets/audio/raw/*.mp3`; Signatur nicht mit Prüfwerkzeug validiert |
| Tarif | Kontoabfrage 25.11.2026, 05:58 UTC: `tier: "creator"`, `status: "active"`, monatliche Abrechnung | Sitzungsprotokoll. Rechnung: **OFFEN – Projektinhaber** |
| Stimmen | **keine.** Es wurden nur Geräusche und Instrumentalmusik aus Textbeschreibungen erzeugt | Sitzungsprotokoll |
| Voice Cloning, Voice Library, Music Marketplace | **nicht verwendet** | Sitzungsprotokoll |
| Hochgeladene Inhalte | **keine** (keine Referenzaufnahmen, keine fremde Musik) | Sitzungsprotokoll |
| Hinweis | Das Konto meldet `voice_slots_used: 1`. Diese Stimme wurde im Projekt **nicht** benutzt; was sie ist, weiss nur der Kontoinhaber | Kontoabfrage |

## 2. Inventar

Rohdateien `assets/audio/raw/` (unverändert vom Dienst, MP3, mit Signatur) → Spieldateien
`public/audio/` (automatisch gekürzt, in der Lautheit angeglichen, neu kodiert durch
`tools/assets/audio.sh`; Effekte mono 96 kbit/s, Musik stereo 112 kbit/s). Alle am 25.11.2026
erzeugt und am selben Tag ins Repository aufgenommen.

| Spieldatei | Grösse | Dauer | Verwendung | Modell | Rohdatei SHA-256 (Anfang) |
|---|---|---|---|---|---|
| `button.mp3` | 4 kB | 0,29 s | Knopf | `eleven_text_to_sound_v2` | `2e6bfe6651ab3b7e` |
| `spin.mp3` | 11 kB | 0,94 s | Spinstart | ebenso | `685238d5048ae060` |
| `land.mp3` | 8 kB | 0,63 s | Symbole landen | ebenso | `35c8ac2ab5516bca` |
| `win.mp3` | 16 kB | 1,33 s | Gewinn | ebenso | `664f4bbeeb6d1863` |
| `winMid.mp3` | 23 kB | 1,93 s | mittlerer Gewinn | ebenso | `c6056e373bf0d90c` |
| `remove.mp3` | 9 kB | 0,73 s | Symbole lösen sich auf | ebenso | `2e50473309983947` |
| `step.mp3` | 6 kB | 0,50 s | Schritt auf dem Track | ebenso | `c10a25f035196b69` |
| `station.mp3` | 21 kB | 1,75 s | Station erreicht | ebenso | `31b428e8b8bfc7ca` |
| `relic.mp3` | 22 kB | 1,83 s | Sun Relic | ebenso | `532b221d9986a435` |
| `bonus.mp3` | 13 kB | 1,04 s | Temple Bonus beginnt | ebenso | `38229141263340ef` |
| `door.mp3` | 24 kB | 2,04 s | Kammer öffnet | ebenso | `e88ab2bde770466a` |
| `freeSpins.mp3` | 24 kB | 2,04 s | Free Spins beginnen | ebenso | `752801f6b67fdce5` |
| `retrigger.mp3` | 20 kB | 1,65 s | zusätzliche Free Spins | ebenso | `7ebafd0f58463dea` |
| `complete.mp3` | 24 kB | 2,04 s | Feature-Ende | ebenso | `b7f9be65384e5934` |
| `bigWin.mp3` | 13 kB | 1,04 s | grosser Gewinn | ebenso | `d5c0589ecf6aeabc` |
| `music_base.mp3` | 616 kB | 45,0 s | Musikschleife Basisrunde | `eleven_music_v2` | `b93045a264951592` |
| `music_free.mp3` | 616 kB | 45,0 s | Musikschleife Free Spins | ebenso | `35be16b48ecd5378` |

Erzeugt, aber nicht ausgeliefert: eine Dschungel-Atmosphäre, eine zweite Fassung «grosser
Gewinn», je ein erster Versuch für Musik und Knopf.
Auffälligkeit: Die Rohdateien `bonus.mp3` und `bonus_v2.mp3` sind **byte-identisch**; die erste
Gong-Fassung ist also nicht mehr vorhanden (im Asset-Register berichtigt).

Rechte Dritter an den Dateien: keine bekannt. **Nicht geprüft:** Ähnlichkeit der Musik mit
bestehenden Werken; **niemand hat die Dateien angehört.**

## 3. Vertragsbedingungen (AUSZUG – im Volltext zu prüfen)

| Thema | Auszug | Quelle |
|---|---|---|
| Geltende Fassung für die Schweiz | «Terms of Use EU», «Last Updated: 09 October 2026», gilt für Nutzer mit Wohnsitz im EWR, in der Schweiz oder im UK | https://elevenlabs.io/terms-of-use-eu |
| Vertragspartner, anwendbares Recht | für Konsumenten Gerichte und Recht des Wohnsitzlandes; für Geschäftsnutzer und zur Vertragspartei: **OFFEN** | wie oben |
| Rechte am Output | «as between you and ElevenLabs, you retain all rights in and to your Output» | wie oben |
| Kommerzielle Nutzung | mit bezahltem Abo erlaubt; Gratistarif nicht kommerziell und mit Namensnennung | wie oben; Hilfeartikel 13313564601361 |
| Lizenz **an ElevenLabs** | an den Inhalten des Nutzers, um die Dienste bereitzustellen, zu verbessern und neue Dienste zu entwickeln; «perpetual and irrevocable», nicht exklusiv, weltweit, unentgeltlich, unterlizenzierbar | https://elevenlabs.io/terms-of-use-eu |
| Beta-Dienste | Ausgaben aus Beta-Diensten sind von der kommerziellen Lizenz ausgenommen; ob die zwei benutzten Modelle als Beta gelten: **OFFEN** | https://elevenlabs.io/bsa |
| ElevenCreative-Bedingungen | Output darf nicht «on a standalone basis» verkauft, lizenziert oder vertrieben werden; Geltungsbereich des Auszugs unklar | https://elevenlabs.io/creative-terms |
| **Eleven Music** | Selbstbedienungstarife: «All online and offline commercial use permitted, except film, TV, radio, and Studio Games» | https://elevenlabs.io/music-terms |
| «Indie Game» | Spiel mit weniger als 500 000 USD Umsatz seit Erstveröffentlichung; zusätzlich Entwickler-Schwelle unter 1 000 000 USD aus allen Spielen im letzten Geschäftsjahr, **einschliesslich verbundener Unternehmen** | wie oben |
| Pflicht | Der Nutzer muss selbst prüfen und überwachen, ob sein Spiel ein «Indie Game» bleibt; bei Verlust des Status 60 Tage Frist für einen passenden Tarif | wie oben, Ziff. 4.7 |
| **Verbotene Nutzung** | Unter «Dangerous, Harmful and Restricted Activities»: «Operating or facilitating real-money gambling» | https://elevenlabs.io/use-policy |
| Trainingseinstellung | Schalter «Improve the models for everyone» im Profil; Abwahl wirkt nur für die Zukunft | Hilfeartikel 29952728805393 |
| Nachweise | Rechnungen als PDF im Konto; Verlauf der Erzeugungen im Konto bzw. über Schnittstelle | Hilfeartikel 13514643375889, 13313879331601 |

## 4. Bewertung

**Zwei ernste Vorbehalte, beide nur am Volltext und mit schriftlicher Auskunft zu klären:**

1. **Echtgeld-Glücksspiel.** Die Nutzungsrichtlinie nennt nach dem Auszug das «Betreiben oder
   Ermöglichen von Echtgeld-Glücksspiel» als eingeschränkte Tätigkeit. Ob das Einbetten erzeugter
   Töne in ein Slot-Spiel darunter fällt und ob es eine Ausnahme oder Genehmigung gibt, ist
   **OFFEN**. Solange das ungeklärt ist, ist die Verwendung dieser Töne in einem
   Echtgeld-Slot **nicht als abgedeckt anzusehen**. Die heutige Demo ohne Echtgeld ist davon
   nicht betroffen.
2. **Musik in «Studio Games».** Die Musik-Bedingungen schliessen nach dem Auszug bei
   Selbstbedienungstarifen die Nutzung in Spielen aus, die über den Indie-Schwellen liegen. Ein
   von einem etablierten Provider veröffentlichter Slot dürfte die Schwellen überschreiten
   (auch wegen der Umsätze verbundener Unternehmen). Dann wäre ein Enterprise-Vertrag nötig.

| Frage | Einschätzung |
|---|---|
| Kommerzielle Nutzung der Effekte in einem Spiel allgemein | nach Auszug mit bezahltem Tarif erlaubt – unter Vorbehalt 1 |
| Kommerzielle Nutzung der zwei Musikschleifen in einem Provider-Slot | **voraussichtlich nicht** vom Creator-Tarif gedeckt (Vorbehalt 2), dazu Vorbehalt 1 |
| Nutzung durch einen Provider, Weitergabe als Teil des Spiels | **OFFEN** – keine Klausel zur Weitergabe an Dritte gefunden |
| Unterlizenzierung | **OFFEN** |
| Exklusive Lizenz | **nicht zusichern:** ElevenLabs behält eine unbefristete, nicht exklusive Lizenz; ähnliche Ausgaben für andere Nutzer sind nicht ausgeschlossen |
| Vollständige Übertragung | **OFFEN**; übertragbar wäre höchstens, was der Nutzer hat – belastet mit der Lizenz von ElevenLabs |
| Urheberrechtsschutz der Töne | nach Schweizer Recht fraglich (`SWISS_COPYRIGHT_AND_AI_REVIEW.md`) |

**Schriftliche Bestätigung von ElevenLabs erforderlich für:** Echtgeld-Glücksspiel (Vorbehalt 1) ·
Einordnung des Spiels und passender Tarif für die Musik (Vorbehalt 2) · Weitergabe und
Unterlizenz an einen Provider · Übertragung bei IP-Verkauf · Beta-Status der zwei Modelle.

**Praktische Alternative:** Ton ist der am leichtesten ersetzbare Teil des Spiels (17 kurze
Dateien, im Code gibt es synthetische Ersatztöne). Auftragsarbeit eines Sounddesigners mit
schriftlicher Rechteübertragung würde beide Vorbehalte beseitigen.

## 5. Nachweise beim Projektinhaber (alle OFFEN)

Rechnungen des Abos für November 2026 · Bildschirmfoto oder Export des Erzeugungsverlaufs mit
Datum und Modell · Stand des Schalters zur Modellverbesserung · Angabe, was die belegte
Stimmen-Ablage im Konto ist · gespeicherte Kopie der am 25.11.2026 geltenden Bedingungen.
