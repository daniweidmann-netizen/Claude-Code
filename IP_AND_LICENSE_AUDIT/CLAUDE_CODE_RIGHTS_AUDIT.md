# CLAUDE CODE RIGHTS AUDIT

Stand: 25. November 2026 · keine Rechtsberatung

> **Offenlegung:** Dieses Audit wurde mit demselben KI-Assistenten (Claude Code) erstellt, dessen
> Vertragsbedingungen hier geprüft werden. Die Befunde sollten deshalb von einer unabhängigen
> Stelle gegengelesen werden.
>
> **Quellenlage:** Die Anthropic-Dokumente wurden am 25.11.2026 **am Originaltext der
> offiziellen Seiten** gelesen (Status «GELESEN»). Nicht erreichbar waren das Privacy Center und
> das Hilfe-Center («NICHT GELESEN»).

## 1. Vertragsgrundlage

### 1.1 Welche Bedingungen gelten für Claude Max?

| Befund | Wortlaut | Quelle | Status |
|---|---|---|---|
| Max fällt unter die **Consumer Terms**, auch bei Nutzung von Claude Code | «If you use Claude on a Free, Pro, or Max plan, the Consumer Terms of Service apply. These terms also apply to your use of Claude Code through your Claude Pro, or Max plan.» | https://www.anthropic.com/legal (Legal Center, ohne Datum) | GELESEN |
| ebenso in der Claude-Code-Dokumentation | «Consumer Terms of Service - for Free, Pro, Max, and Ultra users»; Commercial Terms «for Team, Enterprise, and Claude API users» | https://code.claude.com/docs/en/legal-and-compliance | GELESEN |
| Die Commercial Terms gelten **nicht** für Max | «govern Customer's use of Anthropic API keys and any other Anthropic offerings that references these Terms»; «Services under these Terms are not for consumer use.» | https://www.anthropic.com/legal/commercial-terms, gültig ab 17.06.2025 | GELESEN |

**Claude Max unterliegt also nicht den Commercial Terms.**

### 1.2 Fassung für die Schweiz

Die Consumer Terms werden je Land ausgeliefert. Für die Schweiz:
https://www.anthropic.com/legal/consumer-terms/CH, **gültig ab 8. Oktober 2025** (GELESEN).

| Thema | Wortlaut | Ziffer |
|---|---|---|
| Vertragspartner | «the agreement between you and Anthropic Ireland, Limited» | Einleitung |
| Geltungsbereich | «These Terms apply to you if you are a consumer who is resident in the European Economic Area or Switzerland. You are a consumer if you are acting wholly or mainly outside your trade, business, craft or profession» | Einleitung |
| Rechte am Output | «Subject to your compliance with our Terms, we assign to you all our right, title, and interest (if any) in Outputs.» | 4 |
| **Kommerzielle Nutzung** | «**Non-commercial use only.** You agree that you will not use our Services for any commercial or business purposes and we and our Providers have no liability to you for any loss of profit, loss of business …» | 11 |
| Evaluation | «Use of our Services for evaluation purposes are for your personal, non-commercial use only.» | 2 |
| Wettbewerbsverbot | nicht, um Produkte zu entwickeln, die mit den Diensten konkurrieren, oder KI-Modelle zu trainieren | 3 |
| Training | «… including training our models, unless you opt out of training through your account settings.» | 4 |
| Recht, Gerichtsstand | irisches Recht, Gerichte in Irland; Konsumenten im EWR und in der Schweiz dürfen auch an ihrem Wohnsitz nach lokalem Recht klagen | 14 |
| Freistellung bei Schutzrechtsklagen | **keine** zugunsten des Nutzers | – |
| Aussage zu ähnlichen Outputs anderer Nutzer | keine Klausel gefunden | – |

Die drei früheren Fassungen für EWR/Schweiz (gültig ab 13.05.2024, 19.02.2025, 01.05.2025) sind
im Archiv der Seite abrufbar und enthalten **dieselbe** Klausel «Non-commercial use only» und
dieselbe Rechtezuweisung «(if any)». Die US-Fassung hat diese allgemeine Klausel **nicht**.

### 1.3 Unterschied zu den Commercial Terms

| | Consumer Terms (Schweiz) | Commercial Terms |
|---|---|---|
| Für wen | Free, Pro, Max; auch Claude Code über diese Tarife | API, Team, Enterprise |
| Output | Zuweisung der Rechte von Anthropic «(if any)», **unter Vorbehalt der Vertragstreue** | «Customer … owns its Outputs»; Anthropic verzichtet auf erhaltene Rechte und tritt ab «(if any)» |
| Kommerzielle Nutzung | **«Non-commercial use only»** | vorgesehen |
| Freistellung bei Urheberrechtsklagen Dritter | nein | ja (Abschn. K.1; Wortlaut der Definition nicht im Einzelnen geprüft) |
| Training mit Nutzerdaten | ja, sofern nicht abgewählt | laut Dokumentation nicht für kommerzielle Kunden (nicht im Einzelnen geprüft) |

### 1.4 Ist die konkrete Nutzung abgedeckt?

**Das ist der kritischste Punkt dieses Audits und ist nicht geklärt.**

Die Entwicklung eines Spiels, das an einen Provider lizenziert oder verkauft werden soll, ist eine
kommerzielle Absicht. Die Schweizer Consumer Terms sagen wörtlich, der Dienst dürfe nicht «for any
commercial or business purposes» genutzt werden. Mögliche Lesarten:

1. **Nutzungsverbot:** Die bisherige Entwicklung stand im Widerspruch zu den Bedingungen. Folge
   könnte sein, dass die Rechtezuweisung («Subject to your compliance») nicht greift und der
   Zugang gekündigt werden kann.
2. **Haftungsregel:** Die Klausel steht im Abschnitt zur Haftung und dient vor allem dazu,
   Ersatz für entgangenen Gewinn auszuschliessen.
3. **Falsche Vertragsart:** Wer geschäftlich handelt, ist kein «consumer» im Sinn der Bedingungen
   und hätte von Anfang an einen geschäftlichen Zugang gebraucht.

Welche Lesart gilt, ist eine Frage für einen Anwalt und für Anthropic. **Eine geschäftliche
Nutzung muss gesondert abgeklärt werden.** Bis dahin kann nicht behauptet werden, die Nutzung sei
vertraglich abgedeckt.

Zum Inhalt (iGaming): Die Usage Policy (https://www.anthropic.com/legal/aup, gültig ab 12.11.2026,
GELESEN) enthält **keine** Erwähnung von Glücksspiel; ebenso wenig die Fassungen vom 15.09.2025
und 26.06.2024. Es gilt nur die allgemeine Pflicht, geltendes Recht einzuhalten. Die Entwicklung
von Slot-Software ist dort also nicht besonders eingeschränkt.

## 2. Code und Entwicklungsleistungen (BELEGT aus dem Repository und dem Sitzungsprotokoll)

| Punkt | Befund |
|---|---|
| Entwicklungszeitraum | 23.11.2026, 22:44 UTC bis 25.11.2026 (laufend); eine zusammenhängende Sitzung |
| Versionsverlauf | 55 Commits: 1 vom Projektinhaber (16.06.2026, «Initial commit», eine Zeile README), 54 unter dem Namen «Claude <noreply@anthropic.com>» (4 am 23.11., 25 am 24.11., 25 am 25.11.) |
| Verwendetes Modell | in den Vermerken «Co-Authored-By» der Commits und im Sitzungsprotokoll festgehalten |
| Tarif | laut Projektinhaber Claude Max. **Im Projekt nicht nachweisbar** – Rechnung/Abo-Beleg OFFEN |
| KI-geschriebener Code | **der gesamte Quellcode**: Engine, Sitzungsschicht, Client, Simulator, Zweitimplementierung, Tests, Werkzeuge, sowie alle Dokumente |
| Vom Projektinhaber selbst geschriebener Code | **keiner nachweisbar** (ausser der ersten README-Zeile) |
| Vom Projektinhaber nachträglich veränderter Code | keiner nachweisbar |
| Fremdcode | keiner übernommen (Angabe aus der Sitzung; kein Ähnlichkeitsscan durchgeführt) |

### Menschliche Beiträge des Projektinhabers (aus dem Sitzungsprotokoll belegbar)

| Beitrag | Art |
|---|---|
| Ausgangskonzept («Master Prompt»): Titel, Claim, Thema, 6×5-Cluster-Slot mit Kaskaden, Expedition Track mit den fünf benannten Stationen, Temple Bonus mit drei Kammern, Free Spins, Feature-Kauf, Ziel-RTP, Zielanbieter | Konzept, Vorgaben |
| Freigaben von Änderungsvorschlägen (u. a. Mindestcluster 5 statt 8), Freigabe der eingefrorenen Mathematik | Entscheidung |
| Feature-Kauf: ja; Preis 58× | Entscheidung |
| Auswahl unter Bildvarianten: «Mask B und Wild A», Logo B | Auswahl |
| Rückmeldungen vom eigenen Gerät: Bonus und Free Spins zu schnell; Tempo-Vorgaben in Sekunden; drei Tempo-Modi | Gestaltungsvorgabe |
| Beanstandung des leeren Spielfelds beim Walzenwechsel | Qualitätsvorgabe |
| Sun Relic: kein Walzensymbol, sondern zentrales Artefakt | Entscheidung |
| Qualitäts- und Wahrheitsregeln (keine erfundenen Zahlen, keine Zertifizierungsbehauptung, Mathematik nur mit Freigabe) | Leitlinien |

Architektur- und Technikentscheidungen (Trennung Engine/Client, Zufallsgenerator,
Ereignisprotokoll, Testaufbau, konkrete Parameterwerte der Mathematik, Wortlaut der Bildaufträge)
wurden vom Assistenten vorgeschlagen und ausgeführt; der Projektinhaber hat sie gebilligt oder
unkommentiert übernommen. **Eigene technische Ausarbeitung des Projektinhabers ist nicht belegt.**

## 3. Rechteprüfung in fünf Ebenen

| Ebene | Befund |
|---|---|
| 1. Vertragliche Zuweisung der Output-Rechte | Anthropic tritt ab, was es «(if any)» hat – **unter Vorbehalt der Vertragstreue** (siehe 1.4). Die Zuweisung schafft kein Urheberrecht; sie stellt nur klar, dass Anthropic keine Rechte beansprucht |
| 2. Urheberrechtsschutz nach Schweizer Recht | Software ist grundsätzlich schutzfähig, Urheber kann aber nur ein Mensch sein. Bei vollständig vom Assistenten geschriebenem Code ist **fraglich, ob und in welchem Umfang** Schutz besteht (`SWISS_COPYRIGHT_AND_AI_REVIEW.md`) |
| 3. Rechte an selbst entwickeltem Code | nicht einschlägig – selbst geschriebener Code ist nicht belegt |
| 4. Rechte Dritter | keine bekannt. Nicht ausgeschlossen: Der Assistent könnte Passagen erzeugt haben, die bestehendem Code ähneln; kein Scan durchgeführt; keine Freistellung durch Anthropic im Consumer-Tarif |
| 5. Open-Source-Komponenten | unkritisch (`THIRD_PARTY_SOFTWARE_LICENSES.md`) |

## 4. Datennutzung und Training

| Punkt | Befund | Status |
|---|---|---|
| Regel | Daten aus Free-, Pro- und Max-Konten (auch aus Claude Code) werden für das Training verwendet, wenn die Einstellung eingeschaltet ist | GELESEN (https://code.claude.com/docs/en/data-usage) |
| Aufbewahrung | bis fünf Jahre bei eingeschaltetem Training, sonst 30 Tage | GELESEN (Mitteilung vom 28.08.2025) |
| Wo sichtbar | claude.ai/settings/data-privacy-controls | GELESEN |
| **Einstellung im Entwicklungszeitraum** | **nicht nachweisbar**; keine Seite beschreibt ein Protokoll früherer Einstellungen | OFFEN – Projektinhaber (Bildschirmfoto der heutigen Einstellung), Anthropic (Auskunft zum Zeitraum) |
| Bedeutung | War das Training eingeschaltet, können Konzept, Code und Mathematik des Spiels in Trainingsdaten eingegangen sein. Das berührt Vertraulichkeit und die Zusicherung von Exklusivität gegenüber einem Käufer | – |

## 5. Schriftlich zu klären

**Mit Anthropic**

1. Ist die Entwicklung eines kommerziell geplanten Spiels unter einem Max-Abo in der Schweiz
   angesichts der Klausel «Non-commercial use only» zulässig? Falls nein: Welche Folgen hat das
   für die bereits erzeugten Outputs und deren Zuweisung?
2. Kann die bisherige Arbeit nachträglich unter geschäftliche Bedingungen gestellt werden, und
   welcher Tarif ist für die weitere Entwicklung der richtige?
3. Bestätigung, dass Anthropic an den Outputs keine Rechte beansprucht und einer Übertragung an
   Dritte nicht widerspricht.
4. Welche Trainings- und Aufbewahrungseinstellung war vom 23. bis 25.11.2026 im Konto aktiv?
   Wurden Sitzungsdaten für Training verwendet?
5. Welche Nachweise (Rechnung, Kontoauskunft) kann Anthropic für eine Due Diligence ausstellen?

**Mit einem Schweizer IP-Anwalt**

1. Auslegung der Klausel in Ziff. 11 (Verbot, Haftungsregel oder Abgrenzung des Geltungsbereichs)
   und ihrer Wirkung auf Ziff. 4.
2. Ob und wie weit der Code urheberrechtlich geschützt ist und wem ein allfälliges Recht zusteht.
3. Wie ein Übertragungsvertrag formuliert werden muss, wenn der Schutz unsicher ist (Übertragung
   «soweit vorhanden», Know-how, Geheimhaltung, Gewährleistungsausschlüsse).
4. Ob das Projekt mit einem geschäftlichen Zugang neu aufgesetzt oder wesentlich von Menschen
   überarbeitet werden sollte, um die Rechtekette zu stärken.
