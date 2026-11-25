# PUBLISHING AND IP SALE RIGHTS

Stand: 25. November 2026 · keine Rechtsberatung · Grundlage: die übrigen Audit-Dokumente

Ampel: **GRÜN** ausreichend dokumentiert · **GELB** grundsätzlich möglich, Nachweise fehlen ·
**ROT** erkennbares Rechtehindernis oder keine ausreichende Nutzungsberechtigung.
Die Bewertung ist **vorläufig**: Mehrere Anbieterbedingungen lagen nur als Suchauszug vor.

## 1. Rechte je Bestandteil

| Bestandteil | Art des Rechts heute | Exklusiv? | Unterlizenzierbar? | Übertragbar? | Haupthindernis |
|---|---|---|---|---|---|
| Name, Claim | kein Schutzrecht (keine Marke) | nein | – | erst nach Markeneintragung | Recherche und Anmeldung fehlen |
| Spielkonzept, Regeln | nicht schutzfähig als Idee; Know-how | faktisch, solange vertraulich | vertraglich | als Know-how vertraglich | Vertraulichkeit sichern |
| Mathematik (Parameter, Simulator, Nachweise) | Know-how; Dateien als Teil des Codes | faktisch, solange vertraulich | vertraglich | als Know-how vertraglich | wie Code |
| Quellcode | vertragliche Zuweisung durch Anthropic «(if any)», unter Vorbehalt der Vertragstreue; Urheberrecht unklar | ungeklärt | ungeklärt | «soweit vorhanden» | **Klausel «Non-commercial use only»** der Schweizer Consumer Terms; unklarer Urheberrechtsschutz; Trainingseinstellung unbekannt |
| Dokumentation | wie Code | ungeklärt | ungeklärt | «soweit vorhanden» | wie Code |
| Grafiken (31 Bilder inkl. Logo) | vertragliches Nutzungsrecht aus den Higgsfield-Bedingungen | **nein** (Lizenz an Higgsfield, ähnliche Ausgaben möglich) | ungeklärt | ungeklärt | **Glücksspiel-Vorbehalt** über die Richtlinien des Modellanbieters; kein gesicherter Urheberrechtsschutz |
| Ton (17 Dateien) | vertragliches Nutzungsrecht aus den ElevenLabs-Bedingungen | **nein** (unbefristete Lizenz an ElevenLabs) | ungeklärt | ungeklärt | **Glücksspiel-Vorbehalt** der Nutzungsrichtlinie; **Musik in «Studio Games»** nur mit Enterprise-Vertrag |
| Phaser, Schriften | freie Lizenzen Dritter (MIT, OFL) | nein | durch die Lizenz selbst geregelt | nicht übertragbar; der Erwerber nutzt unter derselben Lizenz | Lizenztexte fehlen im Build |
| Im Code gezeichnete Effekte | Teil des Codes | wie Code | wie Code | wie Code | wie Code |

## 2. Die drei Geschäftsmodelle

### A. Publishing – vorläufig ROT mit den heutigen Bestandteilen · GELB erreichbar

Ein Provider würde das Spiel als **Echtgeld-Slot** veröffentlichen. Dafür müssen die
Nutzungsrechte an allen Bestandteilen diese Verwendung decken. Erkennbare Hindernisse:

1. Ton: Nutzungsrichtlinie von ElevenLabs («real-money gambling») und Ausschluss von
   «Studio Games» für die Musik.
2. Grafik: Verweis von Higgsfield auf die Richtlinien des Modellanbieters, die «real money
   gambling» nennen.
3. Code: Klausel «Non-commercial use only» im Schweizer Consumer-Vertrag.

Keines der drei ist am Volltext bzw. durch Auskunft abschliessend geklärt; jedes ist aber konkret
genug, dass eine Veröffentlichung **heute nicht als gedeckt gelten kann**.

**GELB wird erreicht**, wenn (a) Ton und Grafik durch den Provider oder durch Auftragswerke
ersetzt werden – bei Publishing-Programmen nicht unüblich – oder die Anbieter die Nutzung
schriftlich bestätigen, und (b) die Frage zum Code mit Anthropic und einem Anwalt geklärt ist.

### B. Exklusive Lizenz – ROT

Zusätzlich zu A: Exklusivität setzt ein ausschliessliches Recht voraus. An Grafik und Ton
bestehen nur **nicht exklusive** vertragliche Rechte, belastet mit Lizenzen der Anbieter; an Code
und Texten ist der Schutz unklar. Exklusiv einräumen lässt sich heute verlässlich nur, was
vertraglich und tatsächlich kontrolliert wird: der Zugang zum nicht veröffentlichten Code und
Know-how – und künftig eine Marke.

### C. Vollständiger IP-Verkauf – ROT

Zusätzlich zu A und B: Ein Käufer verlangt Gewährleistungen, dass der Verkäufer Inhaber aller
Rechte ist und sie unbelastet überträgt. Das kann der Projektinhaber heute für keinen
Hauptbestandteil zusichern.

| Kategorie | Bestandteile |
|---|---|
| Vollständig übertragbar (heute) | faktischer Besitz: Repository, Rohdateien, Dokumentation, Simulationsdaten; Domain-Namen, falls vorhanden |
| Vollständig übertragbar (nach Eintragung) | Marke |
| Übertragbar «soweit vorhanden» | Rechte an Code und Dokumentation |
| Nicht exklusive Nutzungsrechte | Grafik, Ton |
| Unterlizenzierbar | **ungeklärt** für Grafik und Ton; für Code abhängig von der Anthropic-Frage |
| Nicht übertragbar | die Verträge mit Anthropic, ElevenLabs, Higgsfield selbst; Lizenzen an Phaser und Schriften (der Erwerber erhält eigene) |
| Ungeklärt | Urheberrecht an Code, Grafik, Ton; Zulässigkeit der Nutzung für Echtgeld-Glücksspiel; Wirkung der Trainingseinstellungen |

## 3. Vergleich

| | A – Publishing | B – Exklusive Lizenz | C – IP-Verkauf |
|---|---|---|---|
| Vorläufige Ampel | **ROT** (heutige Bestandteile) | **ROT** | **ROT** |
| Erreichbar nach Klärung/Ersatz | GELB, mit Auftragsgrafik und -ton GRÜN denkbar | GELB | GELB; GRÜN erst mit Marke, ersetzten Assets und anwaltlich gefasster Rechtekette |
| Was der Provider braucht | Nutzungsrecht für Echtgeld-Betrieb | zusätzlich Ausschliesslichkeit | zusätzlich Inhaberschaft und Gewährleistungen |
| Bedeutung der KI-Assets | gering, wenn der Provider Grafik und Ton ersetzt | hoch | sehr hoch |
| Bedeutung der Code-Frage | mittel bis hoch | hoch | sehr hoch |
| Bedeutung der Marke | gering bis mittel | mittel | hoch |
| Realistischster Weg | Konzept, Mathematik und Engine anbieten; Grafik und Ton offen als ersetzbar deklarieren | erst nach Klärung | erst nach Klärung |

## 4. Was sich unabhängig vom Modell anbieten lässt

Auch bei ungeklärtem Urheberrecht hat das Projekt übertragbaren Wert: ein ausgearbeitetes,
getestetes Spielkonzept, eine nachvollziehbar abgestimmte Mathematik mit Nachweisen, lauffähiger
Code und Werkzeuge. Rechtlich wäre das eine Überlassung von **Know-how und Arbeitsergebnissen**
unter Geheimhaltung, mit ehrlichen, eng gefassten Gewährleistungen – keine Übertragung
gesicherter Urheberrechte. Ob ein Provider das so kauft, ist eine kaufmännische Frage.
