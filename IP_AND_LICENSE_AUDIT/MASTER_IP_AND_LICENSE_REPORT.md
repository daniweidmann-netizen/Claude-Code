# MASTER IP AND LICENSE REPORT

**TEMPLE OF THE LOST SUN** · Stand: 25. November 2026
Interne Rechte-, Herkunfts- und Lizenzprüfung für Publishing, exklusive Lizenz und IP-Verkauf

> **Keine Rechtsberatung.** Dieses Audit trennt belegte Tatsachen, Einschätzungen und
> Empfehlungen. Es ersetzt weder einen Schweizer IP-Anwalt noch schriftliche Auskünfte der
> Anbieter.
>
> **Quellenqualität:** *Am Originaltext gelesen* wurden nur die Dokumente von Anthropic.
> Die Seiten von ElevenLabs, Higgsfield, OpenAI, fedlex, IGE und EUIPO waren aus der
> Arbeitsumgebung nicht abrufbar; dort beruhen die Aussagen auf **Suchergebnis-Auszügen** vom
> 25.11.2026 und sind am Volltext zu wiederholen.
>
> **Unverändert:** Spielmechanik, RNG, RTP, Parameter, Auszahlungslogik, Quellcode der
> Spielfunktionen, Grafiken, Audio und Konfigurationen. Neu sind nur die Dokumente dieses Ordners;
> im Asset-Register wurde eine Zeile berichtigt.
>
> **Offenlegung:** Erstellt mit dem KI-Assistenten, dessen Anbieter selbst geprüft wird.

---

## 1. Gesamtbewertung

| Geschäftsmodell | Ampel | Kurzbegründung |
|---|---|---|
| **A. Publishing** | **ROT** (vorläufig, mit den heutigen Bestandteilen) | Drei Vertragswerke decken die Verwendung in einem kommerziellen Echtgeld-Slot nicht erkennbar ab: Anthropic Consumer Terms Schweiz («Non-commercial use only»), ElevenLabs (Glücksspiel; Musik in «Studio Games»), Bilder (Glücksspiel-Vorbehalt über den Modellanbieter). **GELB erreichbar**, wenn Grafik und Ton ersetzt oder bestätigt werden und die Code-Frage geklärt ist |
| **B. Exklusive Lizenz** | **ROT** | wie A; zusätzlich bestehen an Grafik und Ton nur nicht exklusive vertragliche Rechte, an Code und Texten ist der Schutz unklar |
| **C. Vollständiger IP-Verkauf** | **ROT** | wie A und B; zusätzlich kann der Projektinhaber heute für keinen Hauptbestandteil Inhaberschaft und Lastenfreiheit zusichern; kein eingetragenes Schutzrecht |

«ROT» heisst hier: **nicht ohne Klärung anbieten oder zusichern.** Es heisst nicht, dass eine
Rechtsverletzung feststeht – zwei der drei Vorbehalte beruhen auf Auszügen und können sich am
Volltext oder durch eine Auskunft entschärfen.

Ein informelles Erstgespräch mit einem Provider bleibt möglich, **wenn diese Lage offen genannt
wird** und nichts zugesichert wird.

---

## 2. Die elf Abschlussfragen

### 1. Welche Rechte sind tatsächlich nachgewiesen?

- Nutzungsrechte an **Phaser** und **eventemitter3** (MIT) und an den Schriften **Cinzel** und
  **Source Sans 3** (SIL OFL 1.1) – Lizenzdateien eingesehen.
- Die **Herkunft** aller 37 Bilder und 18 Roh-Tondateien (Dienst, Modell, Zeitpunkt, Auftrag) –
  durch eingebettete Signaturen, Auftragskennungen, Register und Sitzungsprotokoll.
- Die **Rolle des Projektinhabers** (Konzept, Vorgaben, Entscheidungen) – durch das Sitzungsprotokoll.

Nachgewiesen ist damit Herkunft, **nicht** ein ausschliessliches Recht an Code, Bild oder Ton.

### 2. Welche Rechte beruhen nur auf vertraglichen Output-Zuweisungen?

- **Code und Dokumentation:** Zuweisung durch Anthropic «(if any)», ausdrücklich «subject to your
  compliance with our Terms».
- **Bilder:** Higgsfield beansprucht nach Auszug kein Eigentum; eine ausdrückliche Abtretung
  wurde nicht gesehen. Rechte von OpenAI erreichen den Projektinhaber nur über Higgsfield.
- **Ton:** nach Auszug behält der Nutzer gegenüber ElevenLabs die Rechte am Output.

### 3. Welche Bestandteile sind möglicherweise urheberrechtlich geschützt?

Möglicherweise: Teile des **Codes**, der **Dokumentation** und der **Gesamtgestaltung**, soweit
ein Gericht in den Vorgaben, der Auswahl und der Steuerung des Projektinhabers eine menschliche
Schöpfung sieht – offen. Voraussichtlich **nicht** oder nur sehr schwach: die vollständig
KI-erzeugten **Bilder** und **Töne**. Nicht schutzfähig als solche: Idee, Spielmechanik, Regeln.

### 4. Welche KI-Assets sind nicht eindeutig zugeordnet?

**Keines.** Alle Bilder: Higgsfield, Modellkennung `gpt_image_2_6`, Signatur OpenAI. Alle Töne:
ElevenLabs, `eleven_text_to_sound_v2` bzw. `eleven_music_v2`. Unbestätigt bleiben nur: welche
Variante des Bildmodells hinter der Kennung steht, und die Rechnungsbelege zu den Tarifen.

### 5. Welche Assets haben unklare kommerzielle Nutzungsrechte?

- **Alle 17 Tondateien** für einen Echtgeld-Slot (Nutzungsrichtlinie); die **2 Musikschleifen**
  zusätzlich wegen des Ausschlusses von «Studio Games».
- **Alle 31 verwendeten Bilder** für einen Echtgeld-Slot (Richtlinie des Modellanbieters).
- **Der gesamte Code** wegen der Klausel «Non-commercial use only».

Für die heutige Demo ohne Echtgeld bestehen die Glücksspiel-Vorbehalte nicht; die Code-Frage
betrifft die kommerzielle Absicht und damit auch die Demo als Verkaufsunterlage.

### 6. Welche Rechte sind nicht exklusiv?

Rechte an **Bildern** (Lizenz und Trainingsrecht bei Higgsfield; gleiche oder ähnliche Ausgaben
für andere möglich), an **Ton** (unbefristete Lizenz bei ElevenLabs), an **Phaser** und den
**Schriften**. Ob am **Code** Ausschliesslichkeit besteht, ist offen.

### 7. Welche Rechte dürfen unterlizenziert werden?

Gesichert: nichts aus den KI-Diensten – **keine** gelesene Klausel erlaubt oder verbietet die
Unterlizenz ausdrücklich. Phaser und die Schriften bringen ihre eigene Lizenz für jeden
Empfänger mit. Alles Übrige: OFFEN (Fragenlisten).

### 8. Welche Rechte dürfen vollständig übertragen werden?

Heute sicher: der **Besitz** an Repository, Rohdateien, Dokumentation und Simulationsdaten sowie
vertraglich das **Know-how**. Nach Eintragung: eine **Marke**. Rechte an Code und Dokumentation
nur «soweit vorhanden». Die Verträge mit den Anbietern selbst sind nicht übertragbar; an Bild und
Ton kann höchstens ein nicht exklusives Nutzungsrecht weitergegeben werden – ob das zulässig ist,
ist offen.

### 9. Welche Anbieterbestätigungen fehlen?

Alle. Im Einzelnen (`PROVIDER_LICENSE_QUESTIONS.md`): Anthropic A1–A7 (vor allem kommerzielle
Nutzung unter Max und Trainingseinstellung), ElevenLabs E1–E8 (vor allem Glücksspiel, Musik in
Spielen, Weitergabe), Higgsfield H1–H8 (vor allem Glücksspiel, Modellanbieter, Übertragung),
OpenAI O1–O5 (nachrangig, kein Vertragsverhältnis).

### 10. Was muss ein Schweizer IP-Anwalt prüfen?

1. Auslegung und Folgen der Klausel «Non-commercial use only» für die bisherige Entwicklung.
2. Urheberrechtsschutz von Code, Texten, Bildern, Ton bei diesem KI-Anteil.
3. Vertragsgestaltung für Lizenz oder Verkauf bei unsicherem Schutz (Know-how, Geheimhaltung,
   Übertragung «soweit vorhanden», verantwortbare Gewährleistungen).
4. Markenrecherche, Anmeldestrategie und Klassen.
5. Rechtsform und Vertragspartei.
6. Volltext der Anbieterbedingungen in der am Erzeugungstag geltenden Fassung.
7. Glücksspielrechtliche Anforderungen an die Lizenzierung von Spielsoftware (ausserhalb dieses Audits).

### 11. Was muss der Projektinhaber vor dem ersten Provider-Pitch erledigen?

Siehe To-do-Liste. Mindestens die Punkte 1 bis 5.

---

## 3. Priorisierte To-do-Liste

| # | Aufgabe | Warum | Aufwand |
|---|---|---|---|
| 1 | **Belege sichern:** Rechnungen (Claude Max, ElevenLabs, Higgsfield) für November 2026; Bildschirmfotos der Trainings-/Datennutzungseinstellungen; Sitzungsprotokoll; Kopie des Repositorys mit Rohdateien | ohne Belege ist nichts nachweisbar; Einstellungen lassen sich später nicht rekonstruieren | Stunden |
| 2 | **Bedingungen im Volltext speichern** (PDF mit Datum): Anthropic Consumer Terms CH; ElevenLabs Terms of Use EU, Music Terms, Use Policy; Higgsfield Terms; OpenAI Usage Policies | Bedingungen ändern sich; drei wurden 2026 mehrfach geändert | Stunden |
| 3 | **Erstgespräch mit einem Schweizer IP-Anwalt** mit diesem Ordner | drei ROT-Punkte sind Rechtsfragen | Termin |
| 4 | **Schriftliche Anfragen** an Anthropic (A1, A2, A6), ElevenLabs (E1, E2, E3), Higgsfield (H2, H3, H6) | nur die Anbieter können die Vorbehalte auflösen | 1–2 Stunden; Antwortzeit offen |
| 5 | **Entscheidung zu Grafik und Ton:** bestätigen lassen, ersetzen (Auftragswerk mit Rechteübertragung) oder ausdrücklich als «vom Provider zu ersetzen» anbieten | entschärft zwei von drei ROT-Punkten unabhängig von den Antworten | Entscheidung; Ersatz kostet |
| 6 | **Weiterentwicklung auf einen geschäftlichen Zugang umstellen**, sobald die kommerzielle Absicht feststeht, und mit dem Anwalt klären, wie mit dem bisherigen Stand umzugehen ist | vermeidet, dass die Frage sich fortsetzt | gering |
| 7 | **Markenrecherche beauftragen**, danach Anmeldung der Wortmarke prüfen | einziges klar übertragbares Schutzrecht | Kosten laut `TRADEMARK_PROTECTION_CHECKLIST.md` plus Recherche und Beratung |
| 8 | Repository privat halten; **Geheimhaltungsvereinbarung** vor jeder Code-Einsicht durch Dritte | schützt Know-how, den verlässlichsten Wert | gering |
| 9 | Lizenzhinweise (MIT, OFL) in den Build aufnehmen; Schriftpakete in die Paketliste eintragen | Formmangel | gering (braucht Freigabe, da Änderung am Build) |
| 10 | Ähnlichkeitsprüfungen (Bilder, Musik, Code) und Validierung der Herkunftssignaturen | für eine Due Diligence | mittel |
| 11 | Rechtsform klären | Vertragspartei und Haftung | Beratung |

## 4. Was im Pitch gesagt werden kann – und was nicht

| Zulässig | Nicht zulässig |
|---|---|
| «Konzept, Mathematik und Code sind eigene Entwicklung mit KI-Unterstützung; die Herkunft jedes Bestandteils ist dokumentiert.» | «Alle Rechte liegen bei mir.» |
| «Grafik und Ton sind KI-erzeugt und als Platzhalter für die Präsentation zu verstehen; die Rechte für einen Echtgeld-Einsatz sind in Klärung.» | «Die Assets sind lizenzfrei / exklusiv / voll übertragbar.» |
| «Eine Markenrecherche steht aus.» | «Die Marke ist frei / geschützt.» |
| «Die Rechtekette wird derzeit anwaltlich geprüft.» (erst wenn das zutrifft) | «Die Rechte sind geklärt.» |

## 5. Verweise

Einstieg: `IP_OWNERSHIP_OVERVIEW.md`. Einzelprüfungen und Quellen mit Adresse, Fassungsdatum und
Abrufdatum (25.11.2026) in den jeweiligen Dokumenten. Grenzen des Audits: `OPEN_LEGAL_ISSUES.md`.
