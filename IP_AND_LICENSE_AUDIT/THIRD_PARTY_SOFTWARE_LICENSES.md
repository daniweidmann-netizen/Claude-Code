# THIRD-PARTY SOFTWARE LICENSES

Stand: 25. November 2026 · Quelle: `package.json`, `package-lock.json`, Lizenzdateien in
`node_modules`, installierte Werkzeuge · keine Rechtsberatung

## 1. Was im ausgelieferten Spiel steckt

| Komponente | Version | Lizenz | Kommerziell nutzbar | Weitergabe | Copyleft | Pflichthinweis | Hindernis für IP-Verkauf |
|---|---|---|---|---|---|---|---|
| Phaser | 3.90.0 | MIT («Copyright (c) 2024 Richard Davey, Phaser Studio Inc.») | ja | ja, auch verändert | nein | Urheber- und Lizenzhinweis muss allen Kopien beiliegen | nein. Phaser selbst wird **nicht** mitverkauft; der Käufer erhält es unter derselben MIT-Lizenz |
| eventemitter3 (Abhängigkeit von Phaser, im Phaser-Paket enthalten) | 5.0.4 | MIT | ja | ja | nein | Lizenzhinweis | nein |
| Schrift Cinzel 700 (2 Dateien, aus `@fontsource/cinzel` 5.3.0) | – | SIL Open Font License 1.1 | ja | ja, eingebettet | nur für die Schrift selbst: veränderte Schriftdateien müssen unter OFL bleiben; das Spiel wird davon nicht erfasst | Lizenztext und Urhebervermerk mitliefern; Schrift nicht einzeln verkaufen | nein; die Schrift bleibt unter OFL und ist nicht exklusiv |
| Schrift Source Sans 3, 400/600 (3 Dateien, aus `@fontsource/source-sans-3` 5.3.1) | – | SIL OFL 1.1 | ja | ja | wie oben | wie oben | nein |

**Befund:** Der Lizenzhinweis für Phaser/eventemitter3 und die OFL-Texte **fehlen derzeit im
Build** (`dist-client`). Das ist vor jeder Weitergabe nachzuholen. Es ist ein Formfehler, kein
Rechtehindernis.

**Befund:** Die Schriftpakete `@fontsource/*` sind **nicht** in `package.json` eingetragen; die
Schriftdateien liegen fertig kopiert in `public/fonts`. Die Herkunft ist über das Asset-Register
und die installierten Pakete belegt, aber nicht über die Paketliste reproduzierbar.

## 2. Entwicklungs- und Testwerkzeuge (nicht im Spiel)

| Werkzeug | Version | Lizenz | Bemerkung |
|---|---|---|---|
| TypeScript | 5.9.3 | Apache-2.0 | Übersetzer |
| Vite | 6.4.6 | MIT | Build |
| esbuild, Rollup (über Vite) | 0.25.12 / 4.68.8 | MIT | Build |
| Vitest | 2.1.9 | MIT | Tests |
| fast-check | 3.23.2 | MIT | Tests |
| @types/node | 22.x | MIT | Typdefinitionen |
| Playwright (in der Arbeitsumgebung vorinstalliert, nicht in `package.json`) | 1.63.0 | Apache-2.0 | Browser-Tests |
| Python 3 mit Pillow | 13.0.0 | Pillow: MIT-CMU (HPND) | Bildaufbereitung |
| FFmpeg | 6.1.1 | LGPL/GPL (je nach Bauart) | Tonaufbereitung. Als **Werkzeug** benutzt, nicht mitgeliefert; die Lizenz erfasst die erzeugten Dateien nicht |

Gesamtbild der Paketliste (`package-lock.json`, 154 Pakete einschliesslich aller
Unterabhängigkeiten): 149× MIT, 2× Apache-2.0, 2× ISC, 1× BSD-3-Clause.
**Keine GPL-, LGPL-, AGPL- oder andere Copyleft-Lizenz in der Paketliste.**

## 3. Nicht vorhanden

Keine Icon-Bibliothek, keine Audio-Bibliothek (Ton über die Web-Audio-Schnittstelle des
Browsers), kein Slot-Framework, kein Fremdcode aus anderen Spielen (Angabe aus der
Entwicklungssitzung; ein Ähnlichkeits- oder Plagiatsscan des Codes wurde **nicht** durchgeführt).

## 4. Bewertung

| Frage | Antwort |
|---|---|
| Steht eine Softwarelizenz der kommerziellen Veröffentlichung entgegen? | Nein |
| Steht eine Softwarelizenz der Weitergabe des Quellcodes entgegen? | Nein |
| Steht eine Softwarelizenz einem vollständigen IP-Verkauf entgegen? | Nein. Übertragbar ist der eigene Code; Phaser und die Schriften bleiben Werke Dritter unter freier, nicht exklusiver Lizenz |
| Was ist zu tun? | Datei mit Drittlizenzen (MIT für Phaser und eventemitter3, OFL für beide Schriften) in den Build aufnehmen; Schriftpakete in `package.json` eintragen; vor einem Verkauf einen automatischen Lizenzscan und einen Code-Ähnlichkeitsscan dokumentieren |

Status: **BELEGT** (Lizenzdateien eingesehen), mit den zwei genannten Formmängeln.
