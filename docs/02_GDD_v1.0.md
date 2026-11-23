# 02 – Game Design Document v1.0

**TEMPLE OF THE LOST SUN** – *Every relic reveals a secret.*

Stand: 2026-11-23 · Status: APPROVED (Freigabe vom 2026-11-23, einschliesslich CR-01 bis CR-08) · Präzisierungen v1.0.1 aus der Implementierung sind mit «v1.0.1» markiert · CR-09 (Abschnitt 5.5) ist offen.

> **Hinweis zu allen Zahlen:** Regeln und Abläufe in diesem Dokument sind verbindlich definiert. Gewichte, Auszahlungswerte und Preistabellen sind **Startwerte (Entwurf v0.1)** für die Simulation und noch nicht validiert. RTP, Trefferfrequenz und Volatilität sind **Zielwerte**, keine Messergebnisse.

---

## 1. Produktübersicht

| Merkmal | Wert |
|---|---|
| Genre | Premium Adventure Video Slot |
| Raster | 6 Spalten × 5 Reihen (30 Positionen) |
| Gewinnsystem | Cluster Pays, orthogonal verbunden, ab 5 Symbolen (CR-01) |
| Kernmechanik | Kaskaden + Expedition Track (5 Stationen) |
| Features | Temple Bonus (3 Kammern), Free Spins mit Base Camp, Temple Finale |
| Ziel-RTP | 96,00 % (weitere Varianten ableitbar) |
| Ziel-Volatilität | hoch |
| Ziel-Trefferfrequenz | 22–30 % |
| Maximalgewinn | 10 000× Einsatz (harte Obergrenze) |
| Plattform | Mobile-first (Hochformat), Desktop, Querformat |
| Zielgruppe | Spieler von Kaskaden-/Cluster-Slots mit Feature-Fokus |

**Designleitsatz:** Jede Gewinnkaskade ist ein Schritt tiefer in den Tempel. Der Spieler sieht jederzeit, wo er steht, was die nächste Station bringt und wie nah der Tempel ist.

**Abgrenzung:** Das Spiel hat keinen fortlaufend steigenden Kaskadenmultiplikator und keine frei fallenden Multiplikatorsymbole. Verstärkung entsteht ausschliesslich über Stationen, die in fester Reihenfolge erreicht werden. Das ist der Wiedererkennungswert.

## 2. Story und Erzählweise

Ein Abenteurer dringt in einen vergessenen Dschungeltempel ein, in dem eine verschollene Zivilisation fünf Relikte verborgen hat. Die Geschichte wird ohne Dialogtext erzählt:

- **Basisrunde:** Tempelvorhof im Dschungel, Tageslicht, Wasserfall im Hintergrund. Der Expedition Track ist ein Steinpfad mit fünf Siegeln; die Explorer-Figur steht am Anfang.
- **Fortschritt:** Mit jeder Station entzündet sich ein Siegel, die Figur rückt vor, die Umgebung reagiert (Fackeln, Lichtstrahl, Staub).
- **Free Spins:** Das Innere des Tempels, Fackellicht und türkise Energie; das Base Camp ist als Lagerfeuer auf dem Pfad markiert.
- **Temple Bonus:** Die Sonnenkammer mit drei versiegelten Schatzkammern.

## 3. Grundregeln

### 3.1 Einsatz und Runde

- Der Spieler wählt einen Gesamteinsatz. Alle Auszahlungen sind Vielfache des Gesamteinsatzes.
- Eine **Runde** umfasst einen bezahlten Spin mit allen Kaskaden sowie alle daraus ausgelösten Features (Temple Bonus, Free Spins, Temple Finale).
- Jede bezahlte Runde ist unabhängig von allen vorherigen Runden. Es gibt keinen gespeicherten Fortschritt zwischen bezahlten Spins (CR-02).

### 3.2 Cluster

- Ein Cluster ist eine Menge von mindestens **5** Positionen, die über gemeinsame Kanten (horizontal/vertikal) zusammenhängen und alle dasselbe Gewinnsymbol oder ein Wild zeigen. Diagonalen verbinden nicht.
- Ein Cluster muss mindestens ein Gewinnsymbol enthalten. Gruppen nur aus Wilds zahlen nicht.
- Ein Wild kann gleichzeitig zu Clustern verschiedener Symbole gehören.
- Die Clustergrösse zählt Gewinnsymbole und Wilds.
- Mehrere Cluster in einem Schritt werden einzeln ausgezahlt und addiert.

### 3.3 Ablauf eines Spins (verbindliche Reihenfolge)

1. **Füllen:** Alle 30 Positionen werden gezogen (spaltenweise von links nach rechts, je Spalte von unten nach oben).
2. **Start-Effekte:** nur in Free Spins – Effekte des Base Camps (Abschnitt 7).
3. **Auswerten:** Alle Cluster werden bestimmt. Gibt es keinen, weiter mit Schritt 9.
4. **Auszahlen:** Jeder Cluster zahlt `Auszahlungswert(Symbol, Grösse) × Einsatz × M`, wobei M der in diesem Moment gültige Multiplikator ist (Abschnitt 5.3).
5. **Fortschritt:** Der Track rückt um 1 Station vor, zusätzlich um 1 je Temple Key, der sich auf dem Raster befindet (Keys werden dabei eingesammelt). Maximum ist Station 5.
6. **Entfernen:** Alle Positionen der Gewinncluster und alle eingesammelten Keys werden geleert. Der Explorer wird nie entfernt.
7. **Fallen und Nachfüllen:** Verbleibende Symbole fallen spaltenweise nach unten; leere Positionen werden von oben neu gezogen (gleiche Zugreihenfolge wie in Schritt 1).
8. **Stationseffekte:** Für jede in Schritt 5 neu erreichte Station wird ihr Effekt in aufsteigender Reihenfolge auf dem neuen Raster ausgeführt (Abschnitt 5.2). Danach zurück zu Schritt 3.
9. **Abschluss:** Compass-Symbole auf dem Raster werden gezählt (Free-Spin-Auslösung). Wurde Station 5 erreicht, folgt der Temple Bonus (Basisrunde) bzw. wird das Temple Finale vorgemerkt (Free Spins).

Die Auszahlung eines Schritts erfolgt **vor** dem Fortschritt. Eine neu erreichte Station wirkt also ab der nächsten Kaskade.

### 3.4 Grenzen und Terminierung (CR-05)

- **Maximalgewinn:** Erreicht der Rundengewinn 10 000× Einsatz, wird genau dieser Betrag ausgezahlt und die Runde endet sofort, einschliesslich laufender Features.
- **Kaskadenlimit:** Höchstens 50 Kaskaden je Spin. Das Limit ist eine Sicherheitsgrenze; die Simulation muss belegen, dass es praktisch nie erreicht wird (Zielgrösse: 0 Fälle in 10⁹ Spins).
- **Free-Spin-Limit:** Höchstens 30 Free Spins je Runde.

## 4. Symbolsystem

### 4.1 Übersicht

| # | Symbol | Typ | Fällt natürlich | Funktion |
|---|---|---|---|---|
| 1 | Jade Mask | Gewinnsymbol (höchstes) | ja | Clusterauszahlung |
| 2 | Ruby Crown | Gewinnsymbol | ja | Clusterauszahlung |
| 3 | Golden Chalice | Gewinnsymbol | ja | Clusterauszahlung |
| 4 | Golden Scarab | Gewinnsymbol | ja | Clusterauszahlung |
| 5 | Sapphire Gem | Gewinnsymbol (niedrigstes) | ja | Clusterauszahlung |
| 6 | Wild | Sondersymbol | ja (selten) + durch Station 1 | Ersetzt alle Gewinnsymbole |
| 7 | Ancient Compass | Scatter | ja | 3+ lösen Free Spins aus |
| 8 | Temple Key | Fortschrittssymbol | ja | +1 Station bei der nächsten Gewinnkaskade |
| 9 | Explorer | Feature-Wild | nein, nur Station 3 | Wild, das bei Gewinnen nicht entfernt wird |
| 10 | Sun Relic | Feature-Symbol | nein, nur Station 4 | Trägt einen Multiplikatorwert, wird danach zum Wild |

Compass, Key, Explorer und Sun Relic haben keine eigene Clusterauszahlung. Compass und Key ersetzen nichts und werden nicht durch Wilds ersetzt.

### 4.2 Auszahlungstabelle (Entwurf v0.1, × Gesamteinsatz)

| Clustergrösse | 5 | 6 | 7 | 8–9 | 10–11 | 12–14 | 15–19 | 20+ |
|---|---|---|---|---|---|---|---|---|
| Jade Mask | 1,00 | 1,50 | 2,50 | 4,00 | 8,00 | 15,00 | 40,00 | 150,00 |
| Ruby Crown | 0,50 | 0,80 | 1,20 | 2,00 | 4,00 | 8,00 | 20,00 | 75,00 |
| Golden Chalice | 0,40 | 0,50 | 0,80 | 1,20 | 2,50 | 5,00 | 12,00 | 40,00 |
| Golden Scarab | 0,30 | 0,40 | 0,50 | 0,80 | 1,50 | 3,00 | 8,00 | 25,00 |
| Sapphire Gem | 0,20 | 0,30 | 0,40 | 0,60 | 1,00 | 2,00 | 5,00 | 15,00 |

### 4.3 Symbolgewichte (Entwurf v0.1, je 1 000)

Jede Position wird unabhängig aus einer gewichteten Tabelle gezogen. Es gibt getrennte Tabellen für Basisrunde und Free Spins.

| Symbol | Basisrunde | Free Spins |
|---|---|---|
| Sapphire Gem | 250 | 250 |
| Golden Scarab | 220 | 220 |
| Golden Chalice | 190 | 190 |
| Ruby Crown | 160 | 160 |
| Jade Mask | 125 | 125 |
| Wild | 12 | 15 |
| Ancient Compass | 8 | 5 |
| Temple Key | 35 | 35 |

Diese Werte sind die Stellschrauben der Mathematikphase und werden sich ändern.

### 4.4 Gestaltung, Animation und Sound je Symbol

Gemeinsame Art Direction: gerenderte Objekte auf dunklem Steinsockel, warmes Hauptlicht von oben links, türkises Kantenlicht von rechts, einheitliche Kamera und Brennweite. Jedes Symbol hat eine eigene Silhouette **und** eine eigene Leitfarbe, damit es auch bei Farbsehschwäche und auf kleinen Displays unterscheidbar ist.

| Symbol | Gestaltung | Silhouette / Leitfarbe | Gewinnanimation | Sound |
|---|---|---|---|---|
| Jade Mask | Zeremonialmaske aus polierter Jade mit Goldeinlagen | hohes Oval / Jadegrün | Augen glühen auf, Lichtriss läuft über die Maske | tiefer Chor-Akzent |
| Ruby Crown | Goldreif mit Rubinen, Sonnenzacken | Zackenkrone / Rubinrot | Rubine pulsieren nacheinander | heller Metallklang |
| Golden Chalice | Kelch mit eingravierten Sonnenstrahlen | Kelchform / Gelbgold | Licht steigt aus dem Kelch | Glasartiger Klang |
| Golden Scarab | Skarabäus mit halb geöffneten Flügeldecken | breites Rund / Bronze-Gold | Flügel klappen auf | kurzes Rasseln |
| Sapphire Gem | facettierter Saphir in Steinfassung | Raute / Tiefblau | Facetten blitzen im Uhrzeigersinn | Kristallton |
| Wild | Sonnenscheibe mit Schriftzug WILD | Kreis mit Strahlen / Weissgold | Strahlen rotieren, verschmilzt mit dem Cluster | warmer Gong |
| Ancient Compass | Messingkompass, Nadel dreht sich | Kreis mit Öse / Messing-Türkis | Nadel rastet ein, Deckel springt auf | Mechanik-Klick, steigender Ton je Compass |
| Temple Key | Steinschlüssel mit Jadekern | länglich / Jade auf Stein | fliegt zum Track und entsperrt ein Siegel | Stein auf Stein, Schloss |
| Explorer | Brustbild des Abenteurers mit Fackel | Figur / warmes Braun mit Fackellicht | hebt die Fackel, bleibt stehen | Fackelzischen |
| Sun Relic | goldene Sonnenscheibe mit Wertanzeige | grosses Rund / leuchtendes Gold-Türkis | Wert wird enthüllt und fliegt zur Multiplikatoranzeige | Energiestoss |

Alle Symbole haben zusätzlich eine Lande-Animation (kurzes Stauchen, Staub) und einen Ruhezustand.

## 5. Das Expedition System (USP)

### 5.1 Fortschritt

- Zu Beginn jedes bezahlten Spins steht der Track auf Station 0.
- **Jede Gewinnkaskade** rückt den Track um eine Station vor.
- **Jeder Temple Key**, der bei einer Gewinnkaskade auf dem Raster liegt, rückt den Track um eine weitere Station vor und wird eingesammelt.
- Keys auf einem Raster ohne Gewinn bleiben wirkungslos liegen.
- Stationen können übersprungen werden; alle übersprungenen Effekte werden trotzdem der Reihe nach ausgeführt.
- Nach Station 5 gibt es keinen weiteren Fortschritt; Kaskaden laufen weiter.

### 5.2 Die fünf Stationen

| Station | Name | Effekt (genau einmal beim Erreichen) | Dauer |
|---|---|---|---|
| 1 | **Discovery** | 2 zufällige Positionen mit Gewinnsymbolen werden zu Wilds | einmalig |
| 2 | **Treasure** | Grundmultiplikator T steigt von 1 auf 2 | bis Spin-Ende |
| 3 | **Ancient Power** | Eine zufällige Position mit Gewinnsymbol wird zum Explorer (Wild, das bei Gewinnen bestehen bleibt und mit der Schwerkraft fällt) | bis Spin-Ende |
| 4 | **Relic** | Eine zufällige Position mit Gewinnsymbol wird zum Sun Relic. Sein Wert wird aus einer Tabelle gezogen und zum Sonnenbonus S addiert; danach wird das Relic zum Wild | S bis Spin-Ende (in Free Spins: bis Feature-Ende) |
| 5 | **Temple** | Der Temple Bonus wird ausgelöst (nach Ende der Kaskaden) | – |

Zufällige Positionen werden gleichverteilt unter allen Positionen mit Gewinnsymbol gezogen. Gibt es weniger geeignete Positionen als benötigt, werden nur die vorhandenen umgewandelt.

**Sun-Relic-Werte (Entwurf v0.1):**

| Wert | +2 | +3 | +5 | +10 | +25 |
|---|---|---|---|---|---|
| Gewicht | 500 | 280 | 150 | 55 | 15 |

### 5.3 Multiplikator

`M = T + S`

- **T** (Grundmultiplikator): 1; ab Station 2 für den Rest des Spins 2.
- **S** (Sonnenbonus): Summe aller in Station 4 enthüllten Relic-Werte. In der Basisrunde beginnt S bei jedem Spin bei 0. In Free Spins bleibt S über alle Free Spins des Features erhalten.

M gilt für alle Clusterauszahlungen, die nach seiner Änderung ausgewertet werden.

### 5.4 Warum das mehr ist als eine Anzeige

Jede Station verändert Raster oder Multiplikator direkt und nachvollziehbar. Der Spieler sieht vor jedem Schritt, was als Nächstes freigeschaltet wird. Keys erzeugen Sprünge, die Erwartungen bewusst durchbrechen. In Free Spins verschiebt das Base Camp den Startpunkt dauerhaft – der Track wird zum Träger des gesamten Features.

### 5.5 Messbefund und offener Änderungsvorschlag CR-09 («Trittsteine»)

Die Simulation der freigegebenen Regel zeigt: Mit einer Station je Gewinnkaskade wird Station 5 auch ganz ohne Temple Keys etwa jeden 50.–80. Spin erreicht (Messwerte in `docs/math/reports/`). Der Temple Bonus könnte dann im Schnitt nur etwa 7–10× Einsatz wert sein und wäre kein Höhepunkt mehr; Keys müssten praktisch entfallen.

**Vorschlag CR-09:** Zwischen den Stationen liegen Trittsteine. Jede Gewinnkaskade und jeder Key ist ein Schritt; die Stationen werden nach insgesamt **1 / 2 / 4 / 6 / 9** Schritten erreicht. Alles andere bleibt unverändert. In Free Spins beginnt jeder Spin genau auf der Base-Camp-Station.

Die Engine führt die Schrittzahlen als Parameter `stationSteps`; `[1,2,3,4,5]` entspricht der freigegebenen Regel, `[1,2,4,6,9]` dem Vorschlag. Der Abstimmungskandidat v0.2 verwendet den Vorschlag und ist bis zur Entscheidung nur ein Kandidat.

## 6. Temple Bonus

### 6.1 Auslösung

- **Basisrunde:** Erreicht ein Spin Station 5, beginnt der Temple Bonus nach der letzten Kaskade (Stufe *Bronze*).
- **Free Spins:** siehe Temple Finale (Abschnitt 7.4).

### 6.2 Ablauf (echte Auswahl, CR-04)

1. Vor der Anzeige werden drei Preise gezogen und den Kammern 1–3 fest zugeordnet. Das Ergebnis ist ab diesem Moment festgelegt und wird in einer Echtgeldarchitektur serverseitig gespeichert.
2. Der Spieler wählt eine Kammer und erhält deren Preis.
3. Zeigt eine geöffnete Kammer einen **Relic Bonus**, erhält der Spieler dessen Betrag und öffnet eine weitere Kammer, solange noch eine verschlossen ist (v1.0.1: gilt für jeden Relic Bonus, nicht nur den ersten).
4. Am Ende werden alle nicht gewählten Kammern mit ihrem tatsächlichen Inhalt aufgedeckt.

Da die Zuordnung der Preise zu den Kammern gleichverteilt zufällig ist, hat jede Kammer dieselbe Gewinnerwartung. Die Wahl beeinflusst das Ergebnis, aber nicht den RTP. Es gibt keine Beinahe-Gewinn-Inszenierung: Die Kammern sehen vor der Wahl identisch aus, und es wird nichts angedeutet.

### 6.3 Preisziehung

Die drei Preise werden nacheinander unabhängig aus der Stufentabelle gezogen. Der Hauptschatz kann je Bonus höchstens einmal vorkommen (bei erneutem Ziehen wird wiederholt). Anschliessend werden die Preise gleichverteilt auf die Kammern gemischt (v1.0.1: ohne das Mischen wären die Kammern wegen der Hauptschatz-Regel nicht gleichwertig).

**Preistabelle (Entwurf v0.1, relative Gewichte; Wahrscheinlichkeit = Gewicht ÷ Summe der Stufe):**

| Preis | Bronze | Silber | Gold |
|---|---|---|---|
| Schatz 10× | 300 | 150 | – |
| Schatz 20× | 240 | 220 | 150 |
| Schatz 40× | 150 | 200 | 220 |
| Schatz 80× | 80 | 140 | 200 |
| Schatz 200× | 30 | 70 | 130 |
| Relic Bonus (25× und zweite Kammer) | 100 | 120 | 150 |
| Free Spins (8, Base Camp auf Station 2) | 90 | – | – |
| Hauptschatz | 10 (1 000×) | 20 (2 500×) | 30 (5 000×) |
| Summe der Gewichte | 1 000 | 920 | 880 |

v1.0.1: Im Temple Finale mit einem Siegel gilt die Bronze-Tabelle ohne den Free-Spin-Preis; dessen Gewicht (90) geht auf «Schatz 40×».

Der Erwartungswert jeder Stufe ist exakt berechenbar und wird als analytische Kontrollgrösse für die Simulation verwendet (Dokument 04).

### 6.4 Sonderfälle

- Autoplay hält beim Temple Bonus an; die Auswahl trifft immer der Spieler.
- Bei Verbindungsabbruch wird der Bonus beim Wiedereinstieg an derselben Stelle fortgesetzt.
- Lösen Temple Bonus und Free Spins im selben Spin aus, wird zuerst der Bonus gespielt.
- Gewinnt der Spieler Free Spins im Bonus und hat zugleich Free Spins über Compass ausgelöst, werden die Anzahlen addiert; es gilt das höhere Base Camp.

## 7. Free Spins

### 7.1 Auslösung

Die Compass-Symbole werden am Ende eines Spins gezählt (sie bleiben während der Kaskaden liegen und fallen mit).

| Compass | Free Spins | Base Camp zu Beginn |
|---|---|---|
| 3 | 8 | Station 1 |
| 4 | 10 | Station 1 |
| 5 oder mehr | 12 | Station 2 |

### 7.2 Base Camp – der Unterschied zur Basisrunde

- Jeder Free Spin beginnt nicht bei Station 0, sondern am **Base Camp**. Die Effekte aller Stationen bis einschliesslich Base Camp werden zu Beginn des Spins auf dem Startraster ausgeführt.
- **Jeder eingesammelte Temple Key** verschiebt das Base Camp dauerhaft um eine Station nach oben, höchstens bis Station 3.
- Der **Sonnenbonus S** wird zwischen den Free Spins nicht zurückgesetzt.
- Innerhalb eines Free Spins gelten Fortschritt und Stationseffekte wie in der Basisrunde.

Damit hat das Feature einen klaren Spannungsbogen: Keys bauen das Lager aus, Relics lassen den Multiplikator wachsen, und der Tempel rückt mit jedem Spin näher.

### 7.3 Zusätzliche Free Spins

3 oder mehr Compass am Ende eines Free Spins geben +4 Free Spins. Obergrenze: 30 Free Spins je Runde.

### 7.4 Temple Finale

- Erreicht ein Free Spin Station 5, wird ein **Tempelsiegel** gesammelt (höchstens eines je Free Spin, höchstens drei je Feature).
- Nach dem letzten Free Spin wird bei mindestens einem Siegel der Temple Bonus genau einmal gespielt: 1 Siegel = Bronze, 2 = Silber, 3 = Gold.
- Im Finale gibt es in keiner Stufe einen Free-Spin-Preis; das Finale kann keine weiteren Free Spins auslösen.

## 8. Zielkennzahlen (Entwicklungsziele, nicht gemessen)

| Kennzahl | Ziel |
|---|---|
| RTP gesamt | 96,00 % |
| davon Basisrunde (Cluster inkl. Stationseffekte) | ca. 56 % |
| davon Temple Bonus aus der Basisrunde | ca. 12 % |
| davon Free Spins inkl. Temple Finale | ca. 28 % |
| Trefferfrequenz | 22–30 % |
| Free Spins | 1 in 150–250 Spins |
| Temple Bonus (Basisrunde) | 1 in 250–450 Spins |
| Volatilität | hoch |
| Maximalgewinn | 10 000× |

## 9. Benutzeroberfläche und UX

### 9.1 Layout

- **Hochformat (Priorität):** oben Logo und Multiplikatoranzeige, darunter der Expedition Track als waagerechter Pfad mit fünf Siegeln, dann das Raster, unten die Bedienleiste. Der Spin-Button liegt in Daumenreichweite unten mittig.
- **Querformat/Desktop:** Track senkrecht links neben dem Raster als ansteigender Pfad zum Tempel; Bedienleiste unten.
- Mindestgrösse für Bedienelemente: 44 × 44 CSS-Pixel. Symbole müssen bei 360 px Bildschirmbreite eindeutig unterscheidbar sein.

### 9.2 Elemente

Raster · Expedition Track mit Explorer-Figur und Stationssymbolen (Antippen zeigt den Effekt der Station) · Multiplikatoranzeige M · Demo-Guthaben · Einsatzwahl · Spin/Stop · Autoplay (Demo, per Konfiguration abschaltbar) · Gewinnanzeige · Free-Spin-Zähler mit Base-Camp-Markierung und Tempelsiegeln · Menü mit Regeln und Auszahlungstabelle, Ton, Rundenhistorie der Demo · deutlich sichtbarer Hinweis «DEMO – kein Echtgeld».

### 9.3 Zustände

`Idle → Spinning → Evaluating → Cascading → (StationEffect) → RoundEnd`, dazu `TempleBonus`, `FreeSpinsIntro`, `FreeSpins`, `TempleFinale`, `BigWin`, `MaxWin`, `Error/Reconnect`. Jeder Übergang hat genau einen Auslöser; der Client spielt nur Ereignisse ab, die die Engine geliefert hat.

### 9.4 Tempo und Barrierefreiheit

- Animationen sind überspringbar, soweit die Konfiguration es erlaubt; Mindestrundendauer und Schnellspielmodus sind konfigurierbar, weil Märkte sie unterschiedlich regeln.
- Modus «Reduzierte Bewegung» (folgt der Systemeinstellung): keine Kamerabewegungen, kein Blitzen, Überblendungen statt Partikel.
- Kein Informationsgehalt allein über Farbe; Kontrast von Text mindestens 4,5:1; Ton getrennt für Musik und Effekte regelbar.
- Gewinne unter dem Einsatz werden nicht als Gewinn gefeiert.

## 10. Art Direction

- **Stil:** Premium Cinematic Adventure Fantasy; realistisch gerenderte Materialien mit leicht überhöhtem Licht.
- **Palette:** Dschungelgrün `#0F3B2E`, antikes Gold `#C9A227`, dunkler Stein `#23262B`, Jade `#3FA796`, mystisches Türkis `#2EC4B6`, Sonnenlicht `#FFD98A`. Türkis ist für Energie/Features reserviert, Gold für Wert.
- **Tiefe:** drei Parallaxe-Ebenen (Vordergrundranken, Tempelrahmen, Hintergrund mit Wasserfall), dezente Lichtstrahlen und Staubpartikel.
- **Pipeline (kostenfrei):** Blender für Symbolmodelle und einheitliches Licht-Setup, Krita/GIMP für Nachbearbeitung, Texturatlas-Erstellung per Free Texture Packer. Jedes Asset wird im Asset-Register geführt (CR-07).
- **Animation:** Phaser-Tweens, Partikel und einfache Shader; Bildsequenzen aus Blender für wenige Schlüsselanimationen. Spine/Rive erst bei belegtem Bedarf (CR-08).

## 11. Audiokonzept

- **Klangidentität:** ein kurzes Vier-Ton-Motiv («Sonnenmotiv»), das in Logo-Jingle, Stationsfortschritt und Bonusauslösung in steigender Instrumentierung wiederkehrt.
- **Ebenen:** Dschungelatmosphäre (Basis) → Tempelhall und Trommeln (Free Spins) → Chor und tiefe Hörner (Temple Bonus).
- **Ereignisse:** Spin, Landung, Clustergewinn (je Symbol), Kaskade (Tonhöhe steigt je Kaskade), Stationsfortschritt (Motiv um je eine Stufe höher), Reliktaktivierung, Tempeltür, Bonusauslösung, Free-Spin-Start/-Ende, Big Win, Maximalgewinn.
- **Rechte:** nur selbst produzierte, CC0- oder nachweislich kommerziell lizenzierte Klänge; jeder Klang steht im Asset-Register.

## 12. Für später vorgesehen (nicht Teil von v1.0)

- Feature-Kauf (je nach Markt zulässig oder verboten; als abschaltbare Option).
- Weitere RTP-Varianten.
- Lokalisierung der Regeltexte.
- Turnier-/Promotion-Schnittstellen des Providers.
