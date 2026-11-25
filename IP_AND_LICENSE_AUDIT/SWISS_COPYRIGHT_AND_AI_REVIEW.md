# SWISS COPYRIGHT AND AI REVIEW

Stand: 25. November 2026

> **Keine Rechtsberatung.** Diese Übersicht ordnet die Projektbestandteile nach öffentlich
> zugänglichen Aussagen zum Schweizer Recht. Verbindlich kann das nur ein Anwalt beurteilen.
>
> **Quellenlage:** fedlex.admin.ch und ige.ch waren aus der Arbeitsumgebung **nicht abrufbar**.
> Gesetzeswortlaute stammen aus Zweitquellen, IGE-Aussagen aus Suchergebnis-Auszügen der
> offiziellen Seiten («AUSZUG»). Der Stand der konsolidierten Gesetzesfassung konnte nicht
> gelesen werden. Alles ist am Original nachzuprüfen.

## 1. Rechtlicher Rahmen (Urheberrechtsgesetz, URG, SR 231.1)

| Norm | Inhalt | Quelle |
|---|---|---|
| Art. 2 Abs. 1 | «Werke sind, unabhängig von ihrem Wert oder Zweck, geistige Schöpfungen der Literatur und Kunst, die individuellen Charakter haben.» | zitiert in BGE 148 III 305 (Zweitquelle) |
| Art. 2 Abs. 3 | Computerprogramme gelten als Werke | Wortlaut nicht abgerufen |
| Art. 6 | Urheber ist die natürliche Person, die das Werk geschaffen hat | Zweitquelle |
| Art. 9–11 | Urheberpersönlichkeitsrechte (Anerkennung der Urheberschaft, Werkintegrität) | sinngemäss, Zweitquelle |
| Art. 16 | Urheberrecht ist übertragbar | Wortlaut nicht abgerufen |
| Art. 17 | Programme aus einem Arbeitsverhältnis: Arbeitgeber übt die Verwendungsrechte aus | hier nicht einschlägig (kein Arbeitsverhältnis) |
| Register | Es gibt **kein** Urheberrechtsregister; Schutz entsteht automatisch | IGE, AUSZUG: https://www.ige.ch/de/etwas-schuetzen/urheberrecht/ein-werk-schuetzen |
| Ideen | Ideen, Konzepte und Anweisungen an den menschlichen Geist sind nicht geschützt, nur die konkrete Ausdrucksform | IGE, AUSZUG: Leitfaden «Kein Schutz für …» |

### Aussagen des IGE zu KI (AUSZUG)

- KI-Output **kann** geschützt sein, wenn er eine menschliche geistige Schöpfung mit individuellem
  Charakter ausdrückt, also der Mensch einen eigenen schöpferischen Beitrag leistet und die KI nur
  Werkzeug ist (IGE-Blog «Urheberrechtliche Fragen beim Training und beim Einsatz von künstlicher
  Intelligenz»).
- Zu Musik: «Nach geltendem Recht ist ein musikalisches Werk dann urheberrechtlich geschützt, wenn
  es von einem Menschen geschrieben und komponiert wurde. Einem KI-generierten Werk wird dieser
  Schutz nicht gewährt.» (IGE-Blog, Interview)
- KMU-Portal des Bundes: In der Schweiz ist nur von Menschen Geschaffenes urheberrechtlich
  geschützt.
- Zu Prompts und zur Auswahl/Anordnung von KI-Ausgaben wurde **keine** offizielle Aussage gefunden.

### Gesetzgebung in Bewegung

Der Bundesrat hat am 12.02.2025 einen sektoriellen Ansatz zur KI-Regulierung beschlossen; die
Motion 24.4596 (Gössi) zum Urheberrechtsschutz gegenüber KI-Nutzung wurde 2025 von beiden Räten
angenommen; das IGE erarbeitet eine Regelung im Urheberrecht. Eine Vernehmlassung war bis Ende
2026 angekündigt; eine Zweitquelle berichtet von einer Verschiebung auf Frühjahr 2027. Ob am
25.11.2026 eine Vernehmlassung läuft: nicht verifiziert. Diese Vorhaben betreffen vor allem die
Nutzung von Werken **für** KI, nicht den Schutz von KI-Output.

## 2. Einordnung der Projektbestandteile

Einschätzung des Verfassers, keine gesicherte Rechtslage.

| Bestandteil | Wie entstanden | Menschlicher schöpferischer Beitrag (belegt) | Urheberrechtsschutz |
|---|---|---|---|
| Titel «Temple of the Lost Sun», Claim | vom Projektinhaber vorgegeben | ja | Kurze Titel und Slogans sind in der Regel **nicht** urheberrechtlich geschützt; Schutz über das Markenrecht |
| Spielkonzept, Spielmechanik, Regeln, Mathematik als Idee | Konzept vom Projektinhaber, Ausarbeitung durch den Assistenten | Konzept ja | **Ideen und Regeln als solche sind nicht geschützt.** Geschützt sein kann nur ihre konkrete Ausformulierung |
| Parameterwerte der Mathematik | vom Assistenten durch Simulation abgestimmt | Freigabe, nicht Gestaltung | als Zahlenwerk kaum Werk; **wirtschaftlich als Know-how/Geschäftsgeheimnis** schützbar, solange geheim |
| Quellcode | vollständig vom Assistenten geschrieben, nach Vorgaben und unter Freigabe des Projektinhabers | Vorgaben, Auswahl, Freigabe; keine eigene Programmierung | **unklar.** Programme sind an sich Werke, aber nur als menschliche Schöpfung. Ob Vorgaben und Steuerung dafür genügen, ist offen |
| Dokumentation, Regeltexte | vom Assistenten geschrieben | Vorgaben, Durchsicht | **unklar**, wie Code |
| 31 verwendete Bilder (Symbole, Hintergründe, Logo, Medaillons, Tore usw.) | vollständig KI-erzeugt aus Textaufträgen, die der Assistent formuliert hat; nur automatisch zugeschnitten | Themenvorgabe; Auswahl bei drei Varianten (Maske, Wild, Logo) | **voraussichtlich kein oder nur sehr schwacher Schutz.** Kein menschlicher Gestaltungsakt am Bild belegt |
| Zusammenstellung und Layout der Oberfläche | vom Assistenten entworfen, vom Projektinhaber über Rückmeldungen gelenkt | Rückmeldungen | unklar |
| 15 Effekte, 2 Musikschleifen | vollständig KI-erzeugt aus Textaufträgen | keine Gestaltung | nach der zitierten IGE-Aussage zu KI-Musik **kein Schutz** |
| Im Code gezeichnete Effekte und Bedienelemente | Teil des Codes | wie Code | wie Code |
| Schriften, Phaser | Werke Dritter | – | geschützt, frei lizenziert |

### Was der Projektinhaber nachweisen kann

Das Sitzungsprotokoll dokumentiert seine Vorgaben und Entscheidungen lückenlos (Liste in
`CLAUDE_CODE_RIGHTS_AUDIT.md`, Abschn. 2). Es dokumentiert aber ebenso, dass Code, Texte, Bilder
und Töne nicht von ihm ausgeführt wurden. Das Protokoll ist das stärkste Beweismittel für seine
Rolle und zugleich der Beleg für den hohen KI-Anteil.

## 3. Bestandteile mit unklarem Schutzumfang

1. Gesamter Quellcode.
2. Alle 31 verwendeten Bilder einschliesslich Logo.
3. Alle 17 Tondateien.
4. Dokumentation und Regeltexte.
5. Layout und Gesamtgestaltung.

**Folge:** Fehlt der Urheberrechtsschutz, kann der Projektinhaber Dritten die Übernahme dieser
Bestandteile urheberrechtlich nicht verbieten und einem Käufer kein ausschliessliches
Urheberrecht daran verschaffen. Schutz und Wert liegen dann in: Marke, Vertraulichkeit
(nicht veröffentlichter Code und Parameter), vertraglichen Bindungen, Vorsprung und
Lieferfähigkeit.

## 4. Wege, die Rechtslage zu stärken (Empfehlungen, keine Zusagen)

| Massnahme | Wirkung |
|---|---|
| Schlüsselgrafik (Logo, Symbole) von Menschen neu schaffen oder substanziell überarbeiten lassen, mit schriftlicher Rechteübertragung | schafft klar schutzfähige Werke |
| Musik und Effekte als Auftragswerk | ebenso; beseitigt die Tarif- und Richtlinienfragen |
| Code durch einen menschlichen Entwickler prüfen und überarbeiten lassen, dokumentiert | stärkt menschliche Urheberschaft; Umfang der Wirkung rechtlich offen |
| Repository privat halten, Geheimhaltungsvereinbarung vor Einsicht durch Provider | schützt Know-how unabhängig vom Urheberrecht |
| Marke anmelden | eigenständiges, übertragbares Schutzrecht |
| Beweise sichern: Sitzungsprotokoll, Rohdateien mit Signaturen, Rechnungen | belegt Herkunft und Zeitpunkt |

## 5. Fragen an einen Schweizer IP-Anwalt

1. Genügen Konzeptvorgaben, Auswahl und Freigabe für eine Urheberschaft am Code oder an Teilen davon?
2. Wie ist die Übertragung von Bestandteilen ohne gesicherten Schutz vertraglich zu fassen?
3. Welche Gewährleistungen zur Rechtekette kann der Projektinhaber verantwortbar abgeben?
4. Reicht der Schutz als Geschäftsgeheimnis (UWG, Vertragsrecht) für einen IP-Verkauf, und welche Vorkehrungen sind nötig?
5. Welche Rechtsordnungen sind für die Zielmärkte des Providers zusätzlich zu prüfen (EU, UK, USA)?
