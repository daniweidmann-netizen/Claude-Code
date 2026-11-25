# 09 – Abschlussbericht «Ultimate Publisher Readiness»

Stand: 2026-11-25. Sicherungspunkte: Git-Tags `pre-polish`, `pre-readiness`, `pre-ultimate` (lokal; das Hochladen von Tags ist in dieser Umgebung nicht erlaubt, die Stände sind über die Commits erreichbar).

## 1. Audit (Phase 1)

**Technologie:** TypeScript 5.9 (strict), Phaser 3.90 (WebGL), Vite 6, Vitest und fast-check, Playwright (Chromium), Node 22 für die Simulation, Python 3 für die Zweitimplementierung.

**Komponenten:** `src/engine` (Regeln, RNG, Mathematik, Rundenzustand; 1 030 Zeilen, keine Laufzeitabhängigkeit) · `src/session` (Demo-Dienst, Guthaben, Verlauf; 160 Zeilen) · `src/client` (Ansichten, Ablaufsteuerung, Effekte, Ton, Info-Ansicht; 3 100 Zeilen) · `tools` (Simulator, Referenz, Browser-Tests, Asset-Aufbereitung) · `tests` (79 Tests).

**Trennung der Schichten:** erfüllt. Die Darstellung liest nur das Ereignisprotokoll; ein Zähler im Client meldet jede Abweichung zwischen gezeichnetem Raster und Protokoll und steht in allen Tests auf 0.

**Zwei Abweichungen zwischen Auftrag und Spiel** (nicht geändert, brauchen deine Zustimmung):

| Punkt | Auftrag | Spiel | Folge einer Änderung |
|---|---|---|---|
| Clustergrösse | mindestens 8 | mindestens 5 (CR-01, freigegeben am 23.11.) | neue Abstimmung der Mathematik, neue Abnahmeläufe; alle Messwerte verfallen |
| Sun Relic | eigenes Symbol | Effekt der Station Relic, wird zum Wild; kein eigenes Bild | ein Bild für das Erscheinen wäre rein gestalterisch möglich |

**Technische Schwachstellen:** siehe Abschnitt 5.

## 2. Was in diesem Durchgang verbessert wurde (Phasen 3 und 4)

| Bereich | Änderung | Dateien |
|---|---|---|
| Ton | Lautstärkeregler, Reiter «Settings», Töne für Retrigger und Feature-Abschluss, längerer Bonus-Gong | `src/client/audio/sfx.ts`, `presentation/presenter.ts`, `rules-text.ts`, `ui/info-panel.ts`, `tools/assets/audio.sh` |
| Hintergrund | atmende Sonnenstrahlen, sehr langsame Drift, Staub; abschaltend bei reduzierter Bewegung oder niedriger Bildrate | `src/client/fx.ts`, `scenes/game-scene.ts` |
| Effekte | Stufe wählbar (aus, leicht, voll); eigene Wahl hat Vorrang vor der Automatik | `scenes/game-scene.ts`, `rules-text.ts` |
| Regeln | Abschnitte zu Symbolen, Wild, Explorer, Compass, Temple Key und Bedienung in beiden Sprachen | `src/client/rules-text.ts`, `tests/unit/rules-text.test.ts` |
| Tests | Langzeittest über 300 Runden; Prüfung von Ton und Lautstärke im Browser-Test | `tools/e2e/soak.cjs`, `tools/e2e/smoke.cjs` |
| Dokumente | Publisher-Paket mit 11 Dokumenten | `docs/publisher/` |

Die grossen Überarbeitungen von Oberfläche, Raster, Expedition Track, Free Spins und Temple Bonus stammen aus den beiden vorangehenden Durchgängen (Dokumente 06 und 07).

**Nicht geändert:** `src/engine`, `src/session`, `config` – 0 Zeilen Unterschied zum Stand vor aller Oberflächenarbeit.

## 3. Tests (Phase 5)

| Test | Ergebnis |
|---|---|
| 79 automatisierte Tests | bestanden |
| Schneller Browser-Test auf dem Endstand (393×852, 16 Runden, 3 Bonusrunden, Ton, Einstellungen) | bestanden |
| Langzeittest 300 Runden | bestanden: Speicher 18,1 → 18,5 MB zwischen Runde 50 und 300; Objekte und laufende Animationen konstant |
| Vollständiger Browser-Test (6 Formate, 9 Bonusrunden) | bestanden – **auf dem Stand vor Ton, Einstellungen und Hintergrundbewegung; auf dem Endstand nicht wiederholt** |
| Fehlgeschlagen | keiner |
| Nicht durchgeführt | echte Geräte, Safari, Firefox, Android, langsames Netz, Unterbrechung einer Runde, Anhören des Tons |

Einzelheiten: `docs/publisher/06_QA_REPORT.md`.

## 4. Bewertung (Phase 7)

Eigene Einschätzung. **Kein Bereich erreicht 9 von 10.** Eine 9 setze ich nur, wo ein Ergebnis durch Tests oder Dritte belegt ist und keine wesentliche Lücke offen bleibt.

| Kategorie | Note | Begründung | Was bis 9 fehlt |
|---|---|---|---|
| Art Direction | 8 | einheitliche Welt aus Stein, Gold, Jade, Türkis; eigene Kulisse für Free Spins und Bonus | menschliche Überarbeitung; zwei Hintergründe zeigen nicht exakt dasselbe Bauwerk |
| Grafik | 7 | Rahmen, Tore, Medaillons tragen; Bewegung im Hintergrund vorhanden | gestauchter Rahmen, nur Rasterbilder, kein animiertes Symbol |
| Symbolqualität | 7 | klare Silhouetten, einheitliches Licht, freigestellt | drei Goldsymbole ähnlich; Lesbarkeit für Farbfehlsichtige ungeprüft; Explorer-Gesicht ungeprüft |
| UI/UX | 8 | klare Zonen, nächster Schritt immer benannt, Einstellungen, zwei Sprachen | Bestätigung auf Geräten |
| Mobile Experience | 6 | sechs Formate im Test ohne Überlappung | **kein echtes Gerät, kein Safari** |
| Gameplay | 8 | vollständig, getestet, eigene Idee | nur eine Volatilitäts- und RTP-Variante; kein Spielertest |
| Expedition System | 8 | eigene Gesten je Station, Trittsteine, Lichtstrahl | Spielertest, ob es verstanden wird |
| Free Spins | 8 | Einstieg, Kulisse, Zähler, Sonnenkranz, Abschluss | wie oben |
| Temple Bonus | 8 | grosse Tore mit echter Öffnung, ehrliche Auflösung | offene Tore zeigen gespiegelte Embleme (ungeprüft, ob das stört) |
| Animationen | 7 | flüssig im Test, keine Verzerrung, keine Pause | keine Symbolanimationen, Bildrate auf Geräten unbekannt |
| Sound | 4 | vollständige Struktur (17 Dateien, Musikwechsel, Lautstärke) | **nie angehört**; zwei Effekte zu kurz; keine Dschungelatmosphäre; Lizenz offen |
| Performance | 5 | Langzeittest stabil; Effekt-Budget vorhanden | 5,6 MB; keine Messung auf echter Hardware |
| Technische Stabilität | 7 | 79 Tests, Browser-Tests, Langzeittest, keine bekannten Fehler in Logik oder Buchführung | nur Chromium; keine Wiederaufnahme unterbrochener Runden |
| Mathematik-Dokumentation | 8 | reproduzierbare Läufe, Zweitimplementierung, exakte Teilrechnungen, Fehlversuche dokumentiert | Miniaturraster-Enumeration, RTP-Varianten, RNG-Testbatterie, Ausweis des gekappten Anteils |
| Publisher Readiness | 5 | Paket vorhanden, Spiel vorzeigbar | Geräte, Ton, Rechtekette, Zertifizierungspfad, Varianten |

### Reifegrade

| Stufe | Stand |
|---|---|
| A. Visuell fertig | weitgehend; alle Bilder KI-erzeugt und unbearbeitet |
| B. Spielerisch fertig | ja, als Demo mit Spielgeld |
| C. Technisch geprüft | teilweise: automatisiert und in Chromium; nicht auf Geräten |
| D. Mathematisch geprüft | intern: Simulation, exakte Teilrechnungen, Zweitimplementierung |
| E. Unabhängig zertifiziert | **nein** |
| F. Kommerziell pitchbereit | bereit für ein erstes Gespräch mit offen benannten Lücken; nicht bereit für eine Prüfung durch den Anbieter |

## 5. Was bis zu einer externen Prüfung fehlt

1. **Echte Geräte:** Prüfliste (Dokument 08) auf dem iPhone 15 Pro und einem Android-Gerät; Korrekturen daraus.
2. **Ton:** anhören, auswählen, zu kurze Effekte und nicht passende Musik ersetzen.
3. **Rechtekette:** Lizenzbedingungen von Higgsfield und ElevenLabs sowie die Urheberfrage beim KI-gestützten Code rechtlich prüfen lassen; Symbole und Logo handwerklich überarbeiten; Markenregister; Lizenztexte (OFL, MIT) ins Paket.
4. **Mathematik** (jeweils mit deiner Freigabe): RTP-Varianten, Miniaturraster-Enumeration, Ausweis des gekappten Anteils, eine anerkannte Testbatterie für den RNG.
5. **Integration:** klären, ob der Anbieter eine Portierung auf sein Framework verlangt; Wiederaufnahme unterbrochener Runden; Ladegrösse.
6. **Vollständigen Browser-Test** auf dem Endstand wiederholen; Firefox und WebKit, sobald verfügbar.

## 6. Ist das Spiel bereit für erste Publisher-Gespräche?

**Für ein erstes, unverbindliches Gespräch: ja, mit Einschränkungen.** Es gibt eine spielbare Demo, eine eigenständige Mechanik, eine nachvollziehbare Mathematik-Dokumentation und ein Paket, das die Lücken selbst nennt.

**Für eine Einreichung oder Prüfung: nein.** Vorher müssen mindestens die Punkte 1 bis 3 aus Abschnitt 5 erledigt sein. Ein Anbieter, der das Spiel auf einem Telefon öffnet, darf nicht der Erste sein, der das tut.

## 7. Zu den Zielanbietern

Nur aus öffentlichen Quellen (Websuche vom 24. und 25.11.2026); keine eigene Erfahrung, kein Kontakt. Aufnahmekriterien waren bei keinem der drei zu finden.

| Anbieter | Öffentlich belegt | Eigene Einschätzung |
|---|---|---|
| BGaming | Ein Fachartikel beschreibt «BGaming Publishing» für Studios (Integration, Vertrieb, Promotion, Analyse) | Passt zum bevorzugten Modell «Studio-Partnerschaft». Wichtigste Frage: eigenes Framework Pflicht? |
| Relax Gaming | «Silver Bullet» und «Powered By Relax»: Vertrieb über eine einmalige Integration, Unterstützung bei Compliance; Quellen überwiegend 2018–2021 | ähnlich; Aktualität der Bedingungen unklar |
| Hacksaw Gaming | Plattform OpenRGS für Partnerstudios seit 2023, laut Pressemitteilungen rund ein Dutzend Studios bis August 2026 | Partnerstudios bauen dort auf Hacksaws Technik; das spricht für eine Neuumsetzung des Clients auf deren Plattform |

Quellen: https://igamingfuture.com/helping-small-studios-scale-faster-with-bgaming-publishing/ · https://sbcnews.co.uk/igaming/2018/08/20/relax-gaming-launches-pioneering-silver-bullet-program/ · https://europeangaming.eu/portal/latest-news/2023/02/14/130023/hacksaw-gaming-announces-content-distribution-platform/ · https://www.accessnewswire.com/newsroom/en/computers-technology-and-internet/hacksaw-openrgs-welcomes-zerplaay-games-as-new-partner-studio-1201702

## 8. Vorschläge zur Spielmechanik (nicht umgesetzt, brauchen Freigabe)

Das Expedition System bietet spielerischen Mehrwert, weil jede Station den Zustand anders verändert. Zwei Beobachtungen aus den Messwerten:

1. **67 % der Spins bewegen den Track nicht, und nur 6,4 % kommen über Treasure hinaus.** Die oberen Stationen sieht ein Spieler in der Basisrunde selten. Denkbar: Keys etwas häufiger oder ein Trittstein weniger vor Ancient Power. Beides ändert RTP und Frequenzen.
2. **Die Temple Keys haben in der Basisrunde wenig sichtbare Wirkung**, weil sie nur bei einer Gewinnkaskade zählen. Denkbar: ein Key zählt auch ohne Gewinn als halber Schritt. Regel- und Mathematikänderung.

Beide Vorschläge würden neue Abstimmung und neue Abnahmeläufe erfordern. Ich empfehle, sie erst nach Rückmeldung eines Anbieters zu entscheiden.
