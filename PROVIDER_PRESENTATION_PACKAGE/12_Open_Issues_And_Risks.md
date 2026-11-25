# 12 – Open Issues and Risks

Stand: 25.11.2026

## 1. Entwicklungsstand

| Fertig | Teilweise | Offen |
|---|---|---|
| Spielregeln und Engine | Mathematik: eine RTP-Variante, intern geprüft | Zertifizierung, unabhängige Prüfung |
| Alle Features (Expedition, Free Spins, Temple Bonus und Finale, Feature-Kauf) | Tests: automatisch und in Chromium bestanden, nicht auf Geräten | Echte Geräte, Safari, Firefox |
| Web-Demo, Hoch- und Querformat, zwei Sprachen, Tempo-Modi, Regeln, Verlauf | Ton: eingebunden, nie angehört | Rechteklärung, Markenrecherche |
| Präsentationsmodus | Bilder: vollständig, KI-erzeugt ohne Überarbeitung, Standbilder | Server/RGS, Wallet, Wiederaufnahme |
| Simulator, Zweitimplementierung, Dokumentation | Publisher-Unterlagen: vorhanden, ohne Folien und Video | Weitere RTP-Varianten, Jurisdiktions-Schalter |

## 2. Risiken

| # | Risiko | Schwere | Was es bedeutet | Abhilfe |
|---|---|---|---|---|
| 1 | Rechte an KI-Bildern, KI-Ton und KI-gestütztem Code ungeklärt | **hoch** | Ein Partner kann Exklusivität oder Übertragung nicht sicher erwerben | Rechtsberatung; Schlüsselbilder und Musik durch beauftragte Werke ersetzen oder überarbeiten lassen |
| 2 | Keine Geräte- und Safari-Prüfung | **hoch** | Die Demo kann beim Provider anders aussehen oder ruckeln | Prüfliste auf iPhone, Android, Tablet abarbeiten; Bildrate notieren |
| 3 | Ton ungeprüft | **hoch** | unpassende oder fehlerhafte Töne im ersten Eindruck | anhören, auswählen, ersetzen; bis dahin Vorführung notfalls ohne Ton |
| 4 | Keine Zertifizierung, kein unabhängiger Mathematik-Bericht | hoch (für Veröffentlichung), mittel (für Erstgespräch) | Zahlen gelten als Angaben des Entwicklers | offen so benennen; Prüfung meist über den Partner |
| 5 | Einzelentwickler ohne veröffentlichte Titel | hoch | Zweifel an Lieferfähigkeit und Support | realistische Zusagen; Modell B oder C erwägen |
| 6 | Client-Technik passt eventuell nicht zum Framework des Anbieters | mittel | Neuaufbau der Darstellung | Trennung Engine/Client hervorheben; früh erfragen |
| 7 | Nur eine RTP-Variante | mittel | Betreiber erwarten mehrere | Werkzeuge vorhanden; Aufwand je Variante: Abstimmung und Abnahmelauf |
| 8 | Kein Abnahmelauf auf dem Hash 1.0.0; Feature-Kauf-RTP nur abgeleitet | mittel | formale Lücken in der Nachweisführung | zwei Simulationsläufe nachholen (braucht Freigabe, ändert keine Parameter) |
| 9 | Themenfeld «Tempel/Abenteuer» ist dicht besetzt | mittel | Abgrenzung nur über die Mechanik | Expedition Track in den Mittelpunkt stellen |
| 10 | Kein Spielertest | mittel | Verständlichkeit des Systems unbelegt | kleiner Test mit unbeteiligten Personen |
| 11 | Standbild-Symbole, 256 px | mittel | wirkt gegenüber aktuellen Premium-Titeln einfacher | Symbolanimationen, höhere Auflösung (Kunstauftrag) |
| 12 | Feature-Kauf in mehreren Märkten nicht erlaubt | niedrig | muss abschaltbar sein | Konfigurationsschalter ist vorhanden (`featureBuy.enabled`) |
| 13 | Kulturelle Sensibilität der Bildwelt ungeprüft | niedrig bis mittel | mögliche Einwände | Fachprüfung; die Welt ist bewusst erfunden |

## 3. Widersprüche und Unschärfen in den Unterlagen

| Thema | Quelle A | Quelle B | Einordnung |
|---|---|---|---|
| Mindestcluster | frühe Auftragstexte: 8 | Konfiguration, Code, alle aktuellen Dokumente: **5** | Geklärt am 25.11.2026: 5 ist die beabsichtigte Regel (`docs/12_CLUSTER_RULE_CONFIRMATION.md`). 8 steht nur noch als Historie in `docs/01_CONCEPT_REVIEW.md` |
| RTP | Ziel 96,00 % | simuliert 95,995 % (0.3.2); früherer Lauf 96,107 % (0.3.1) | kein Widerspruch: verschiedene Abstimmungsstände; gültig ist 0.3.2 = Spielwerte von 1.0.0 |
| Konfiguration der Messung | Messläufe: 0.3.2 (Hash `3161a5c3…`) | ausgeliefert: 1.0.0 (Hash `943082d6…`) | Unterschied laut Dokumentation nur Version und Feature-Kauf-Block; **kein Lauf auf 1.0.0** |
| Feature-Kauf-RTP | Simulation: 95,82 % bei Preis 58,6× | Spiel und Dokumente: 96,81 % bei Preis 58× | beide richtig für ihren Preis; der zweite Wert ist abgeleitet |
| Sun Relic | `docs/02_GDD.md` Z. 91 führt es in der Symboltabelle als «Feature-Symbol» | Entscheidung 25.11.2026: kein Walzensymbol | inhaltlich gleich (es fiel nie auf die Walzen); die GDD-Bezeichnung ist missverständlich |
| Versionsnummern | `package.json`: 0.1.0 | Konfiguration: 1.0.0 | zwei Zähler; nicht abgeglichen |
| Anzahl Tests | ältere Berichte: 79 bzw. 82 | aktuell: 86 | zeitlicher Verlauf |
| Volltest im QA-Bericht | `docs/publisher/06_QA_REPORT.md` (alt): nicht wiederholt | 25.11.2026: bestanden | dort korrigiert |
| Symbolbilder im Rechte-Register | `docs/publisher/05_…` nannte das Sun-Relic-Bild bis 25.11.2026 nicht | `assets/ASSET_REGISTER.md` führt es | dort ergänzt |

Nicht gefunden wurden Widersprüche bei: Höchstgewinn (überall 10 000×), Free-Spins-Anzahl
(8/10/12, Retrigger +4, höchstens 30), Paytable, Symbolgewichten, Bonus-Preistabellen.

## 4. Roadmap bis zu einer professionellen Veröffentlichung

| Phase | Schritte | Wer |
|---|---|---|
| **Vor dem ersten Kontakt** | Geräteprüfung (iPhone, Android, Tablet) · Ton anhören und bereinigen · Erstberatung zu Rechten und Rechtsform · Folien und kurzes Gameplay-Video · Demo-Link für Dritte | Eigentümer, Entwickler, Rechtsberatung |
| Nach erstem Interesse | technische Anforderungen des Programms klären · Entscheidung: Bild/Ton ersetzen oder überarbeiten · Markenrecherche · fehlende Simulationsläufe · weitere RTP-Varianten | Eigentümer, Partner |
| Integration | Engine auf den Server des Partners · Wallet, Sitzung, Wiederaufnahme · Jurisdiktions-Einstellungen · gegebenenfalls Client im Framework des Partners · Lokalisierung | Entwickler mit Partner |
| Prüfung | Zertifizierung von RNG und Mathematik · Geräte- und Browser-Matrix · Last- und Sicherheitstests | Prüflabor, Partner |
| Veröffentlichung | Marketingmaterial, Betreiber-Dokumentation, Überwachung nach dem Start | Partner |

Zeit- und Kostenangaben fehlen bewusst: Sie hängen von den Anforderungen des Partners ab, die
nicht bekannt sind.
