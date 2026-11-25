# OPEN LEGAL ISSUES

Stand: 25. November 2026 · Priorität 1 = vor jedem Vertrag zu klären · keine Rechtsberatung

| # | Prio | Thema | Worum es geht | Wer klärt | Dokument |
|---|---|---|---|---|---|
| 1 | 1 | **Anthropic: «Non-commercial use only»** | Die Schweizer Consumer Terms (gültig ab 08.10.2025, am Original gelesen) untersagen die Nutzung «for any commercial or business purposes». Das Spiel ist kommerziell geplant. Folge für Zulässigkeit und Output-Zuweisung offen | Anwalt; Anthropic | `CLAUDE_CODE_RIGHTS_AUDIT.md` |
| 2 | 1 | **ElevenLabs: Echtgeld-Glücksspiel** | Nutzungsrichtlinie untersagt Beiträge zu «Operating or facilitating real-money gambling»; gilt ausdrücklich auch für «any Output» (am Original gelesen) | ElevenLabs schriftlich; Anwalt | `ELEVENLABS_AUDIO_LICENSE_AUDIT.md` |
| 3 | 1 | **ElevenLabs: Musik in «Studio Games»** | Selbstbedienungstarife schliessen Musik in «Studio Games» aus (am Original gelesen) | ElevenLabs; Anwalt | wie oben |
| 4 | 1 | **Bilder: Glücksspiel-Vorbehalt über den Modellanbieter** | Higgsfield bindet an die Richtlinien des Modellanbieters, die strengere Regel gilt; OpenAI: «you cannot use our services for: … real money gambling» (beides am Original gelesen) | Higgsfield schriftlich; Anwalt | `AI_GRAPHICS_LICENSE_AUDIT.md` |
| 5 | 1 | **Urheberrechtsschutz von Code, Bildern, Ton** | Nach Schweizer Recht nur menschliche Schöpfungen; hoher KI-Anteil belegt | Anwalt | `SWISS_COPYRIGHT_AND_AI_REVIEW.md` |
| 6 | 1 | **Keine Exklusivität an Bild und Ton** | Anbieter behalten Lizenzen; ähnliche Ausgaben für andere möglich | Anwalt (Vertragsgestaltung) | `PUBLISHING_AND_IP_SALE_RIGHTS.md` |
| 7 | 2 | Trainingseinstellungen bei Anthropic, ElevenLabs, Higgsfield | Stand im Entwicklungszeitraum unbekannt; berührt Vertraulichkeit und Exklusivität | Projektinhaber (Belege); Anbieter | je Audit |
| 8 | 2 | Marke | keine Recherche, keine Anmeldung; ähnliche Titel existieren | Markenanwalt | `TRADEMARK_PROTECTION_CHECKLIST.md` |
| 9 | 2 | Tarif- und Kaufnachweise | Rechnungen für Max, ElevenLabs, Higgsfield im November 2026 liegen dem Audit nicht vor | Projektinhaber | `OWNER_CONFIRMATION_CHECKLIST.md` |
| 10 | 2 | Geltende Fassungen am Erzeugungstag | Bedingungen von Higgsfield wurden 2026 mehrfach geändert (23.07., 27.08., 23.10.); OpenAI-Richtlinie neu ab 20.11.2026; ElevenLabs zuletzt 09.10.2026. Kopien sichern | Projektinhaber; Anwalt | je Audit |
| 11 | 2 | Unterlizenz und Übertragung der KI-Ausgaben | Bilder: von Higgsfield ausdrücklich erlaubt (Ziff. 4.4). Ton: einzeln verboten, als Teil des Spiels durch Dritte ungeklärt | ElevenLabs; Anwalt | je Audit |
| 12 | 2 | Rechtsform und Vertragspartei | Privatperson oder Gesellschaft; Haftung; Gewährleistungen | Anwalt/Treuhänder | – |
| 13 | 3 | Ähnlichkeitsprüfung | Bilder (auch Explorer-Gesicht), Musik, Code nicht gegen Bestehendes geprüft | Dienstleister | – |
| 14 | 3 | Lizenzhinweise im Build | MIT (Phaser, eventemitter3), OFL (zwei Schriften) fehlen | Entwickler | `THIRD_PARTY_SOFTWARE_LICENSES.md` |
| 15 | 3 | Kennzeichnung von KI-Inhalten | maschinenlesbare Kennzeichnung in den Spieldateien entfernt; Pflichten je Markt unbekannt | Anwalt | `AI_GRAPHICS_LICENSE_AUDIT.md` |
| 16 | 3 | Kulturelle Prüfung der Bildwelt | erfundene Tempelkultur, nicht fachlich geprüft | Fachperson | – |
| 17 | 3 | Glücksspielrecht | Entwicklung und Lizenzierung von Spielsoftware aus der Schweiz, Anforderungen der Zielmärkte | Anwalt | ausserhalb dieses Audits |

## Grenzen dieses Audits

1. **Kein Anwalt hat mitgewirkt.** Alle rechtlichen Einordnungen sind Einschätzungen.
2. **Nicht alles wurde am Original gelesen.** Gelesen: Anthropic (Consumer Terms CH, Commercial
   Terms, Usage Policy), ElevenLabs (Use Policy, Terms of Use EU, Music Terms, Creative Terms),
   Higgsfield (Terms of Use), OpenAI (Usage Policies), IGE (Gebühren). Nur Suchergebnis-Auszüge:
   Hilfe-Center, weitere OpenAI-Verträge, IGE-Aussagen zu KI, Gesetzeswortlaute, WIPO, EUIPO.
   Gelesen wurden die Fassungen vom 25.11.2026; frühere Fassungen nur bei Anthropic.
3. **Keine Unterlagen des Projektinhabers** (Rechnungen, Kontoeinstellungen, Vertragsannahmen)
   lagen vor.
4. Die eingebetteten Herkunftssignaturen wurden ausgelesen, nicht kryptografisch validiert.
5. Das Audit wurde mit einem KI-Assistenten erstellt, dessen Anbieter selbst Gegenstand ist.
