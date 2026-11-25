# 10 – Tempo-Bericht: Free Spins und drei Geschwindigkeitsmodi

Stand: 2026-11-25. Sicherungspunkt vor der Arbeit: Git-Tag `pre-pacing` (lokal).

Geändert wurden nur Darstellung und Zeitsteuerung (`src/client`). `src/engine`, `src/session` und `config` sind unverändert (0 Zeilen Unterschied zum Stand vor aller Oberflächenarbeit); RTP, RNG, Gewichte, Wahrscheinlichkeiten und Auszahlungslogik wurden nicht berührt.

## 1. Analyse des alten Zustands

- Die Wartezeiten standen als Einzelwerte verstreut in den Ansichten und waren für schnelle Abläufe geschrieben. Ein Free Spin ohne Gewinn dauerte rund 0,9 Sekunden – acht Spins also etwa die beobachteten neun Sekunden.
- Es gab genau einen Zeitraffer (vierfach), ausgelöst durch Antippen, der bis zum Rundenende galt.
- Nach einer Stationsfreischaltung lief das Spiel ohne Pause weiter.

## 2. Was jetzt gilt

**Zentrale Steuerung** (`src/client/timing.ts`): eine Tabelle aller Pausen für den Modus Normal. Ein Modus legt einen Zeitfaktor über alle Animationen und Zeitgeber. Pausen, in denen etwas zu lesen ist, haben zusätzlich eine Mindestdauer in echter Zeit, die in jedem Modus gilt.

| Modus | Zeitfaktor | Gedacht für |
|---|---|---|
| Normal (Standard beim ersten Start) | 1 | das volle Erlebnis |
| Fast | 1,9 | zügiges Spiel, alles bleibt lesbar |
| Skip | 5 | so schnell wie möglich; Ergebnisse, Gewinne, Stationen und Bonusausgänge bleiben stehen |

Temple Bonus und die Abschlusstafel der Free Spins laufen in keinem Modus schneller als 1,6-fach. Antippen der Sonnenscheibe oder des Spielfelds während einer Runde zeigt den Rest **dieser** Runde im Skip-Tempo; danach gilt wieder der gewählte Modus.

**Pausen im Modus Normal** (Millisekunden; in Klammern die Mindestdauer in echter Zeit für Fast und Skip):

| Schritt | Normal | Minimum |
|---|---|---|
| Free Spin beginnt, Zähler hat gewechselt | 260 | 100 |
| Base-Camp-Effekte zu Beginn eines Free Spins (gemeinsam gezeigt) | 420 | 220 |
| Raster gelandet | 160 | – |
| nach einer Gewinnmarkierung | 160 | 120 |
| Station freigeschaltet | 420 | 300 |
| Stationseffekt angewendet | 260 | 180 |
| Spin-Ende ohne Gewinn | 360 | 120 |
| Spin-Ende mit Gewinn | 480 | 240 |
| zwischen zwei Free Spins | 380 | 100 |
| Zusatzpause vor und nach jedem der letzten zwei Free Spins | 380 | – |
| nach dem letzten Free Spin, vor der Abschlusstafel | 600 | 300 |

Dazu kommen die Animationen selbst: Einfallen des Rasters rund 1,1 s (spaltenweise), Gewinnmarkierung rund 1,0 s, Entfernen und Nachrücken rund 0,9 s, Freischaltgeste einer Station rund 0,3 s.

**Weitere Änderungen**

- Die Effekte der Base-Camp-Stationen (die der Spieler schon besitzt) werden zu Beginn eines Free Spins gemeinsam und kurz gezeigt statt nacheinander neu «freigeschaltet».
- Letzte zwei Free Spins: Der Zähler wird hell und pulsiert, ein Tick-Ton erklingt, die Ergebnisse bleiben länger stehen. Das Wort «letzter» wird bewusst nicht angezeigt, weil ein Retrigger es unwahr machen würde.
- Abschluss: Pause, dann Tafel mit Gesamtgewinn, höchstem Multiplikator und Siegeln, dann Rückkehr in die Basisrunde.
- Bei einem Retrigger zeigt der Zähler die neue Gesamtzahl sofort.
- Die Geschwindigkeitswahl steht als drei Felder unter dem Raster (Hochformat) bzw. in der Kopfleiste (Querformat); das aktive Feld hat den hellen Rand. Sie wird als reine Anzeige-Einstellung im Browser gespeichert und wirkt sofort, auch während einer Animation.

## 3. Entworfene Zeiten (bei flüssiger Darstellung)

Aus der Tabelle und den Animationsdauern gerechnet, nicht gemessen:

| Fall | Normal | Fast | Skip |
|---|---|---|---|
| Free Spin ohne Gewinn | rund 3,0 s | rund 1,7 s | rund 0,9 s |
| Free Spin mit einer Kaskade | rund 6 s | rund 3,3 s | rund 1,7 s |
| jede weitere Kaskade | rund 3 s | rund 1,6 s | rund 0,9 s |
| Abschluss (Tafel und Rückkehr) | rund 2,8 s | rund 2,0 s | rund 2,0 s |
| acht Free Spins ohne jeden Gewinn | rund 26 s | rund 15 s | rund 8 s |

Ein Free Spin mit einer Kaskade liegt damit über dem Richtwert von 3,5–4,5 Sekunden. Das ist die Summe aus Einfallen, Gewinnmarkierung, Nachrücken, Stationseffekt und Abschlusspause; jeder Einzelwert liegt in deinem Richtbereich. Wenn es sich auf dem Gerät zu lang anfühlt, lässt es sich über die Tabelle kürzen.

## 4. Gemessene Zeiten

Skript `tools/e2e/timing.cjs`: dieselben gekauften Free-Spin-Features (Seeds 7 und 21) in allen drei Modi, Handy-Format 393×852 und Desktop 1280×720; Zeit je Spin vom Start bis zum Ende seiner letzten Pause.

| Format | Modus | Spins | ohne Gewinn | eine Kaskade | zwei und mehr | Abschluss | Bilder/s im Test |
|---|---|---|---|---|---|---|---|
| Handy | Normal | 16 | 3,9 s (6) | 7,6 s (4) | 20,5 s (6) | 3,2 s | 16 |
| Handy | Fast | 16 | 2,4 s (6) | 4,8 s (4) | 13,9 s (6) | 2,3 s | 16 |
| Handy | Skip | 16 | 1,6 s (6) | 3,3 s (4) | 10,5 s (6) | 2,4 s | 17 |
| Desktop | Normal | 8 | 4,5 s (3) | 8,7 s (2) | 18,8 s (3) | 4,0 s | 9 |
| Desktop | Fast | 8 | 3,0 s (3) | 5,8 s (2) | 14,1 s (3) | 2,9 s | 9 |
| Desktop | Skip | 8 | 2,3 s (3) | 4,9 s (2) | 13,6 s (3) | 2,9 s | 9 |

**Diese Messwerte sind zu hoch und kein Massstab für echte Geräte.** Der Test-Browser rendert ohne Grafikkarte mit nur 9 bis 17 Bildern pro Sekunde. Jeder der rund 25 Einzelschritte eines Spins wartet mindestens ein Bild; bei 16 Bildern pro Sekunde sind das allein rund 1,5 Sekunden Zuschlag je Spin. Auf einem Gerät mit 60 Bildern pro Sekunde sollten die Zeiten nahe an Abschnitt 3 liegen. **Auf einem echten Gerät wurde nicht gemessen.**

Die Spins mit «zwei und mehr» Kaskaden enthalten in diesen Seeds lange Ketten mit mehreren Stationen und Tempelsiegeln; sie sind deshalb besonders lang.

## 5. Prüfungen

| Prüfung | Ergebnis |
|---|---|
| Gewinn je Seed in allen drei Modi und beiden Formaten identisch | bestanden (Seed 7: 65,10 · Seed 21: 266,50; im ersten Messlauf zusätzlich Seeds 40 und 63) |
| Moduswechsel mitten im Feature (Fast → Skip → Normal → Skip → Fast): Wechsel wirkt sofort, Gewinn unverändert, keine zusätzliche Runde | bestanden |
| Sechsmaliges Antippen der Sonnenscheibe während einer Runde startet keinen zweiten Spin | bestanden |
| Free-Spin-Zähler läuft lückenlos 1, 2, 3 … | bestanden |
| Gezeichnetes Raster gleich Ereignisprotokoll, keine Verzerrung, Kulisse nach dem Feature zurück in der Basisrunde | bestanden |
| Keine Konsolen- oder Seitenfehler | bestanden |
| 82 automatisierte Tests, darunter drei neue zur Tempo-Tabelle (Mindestzeiten in allen Modi) | bestanden |
| Schneller Browser-Test (16 Runden, 3 Bonusrunden, Ton, Einstellungen) | bestanden |

**Nicht gezielt geprüft**

- Ein Feature mit acht Free Spins ganz ohne Gewinn (in den Test-Seeds kam keines vor; gemessen sind einzelne Spins ohne Gewinn).
- Retrigger im Tempo-Lauf (die Regel ist durch die Engine-Tests abgedeckt; die neue Zähleranzeige beim Retrigger wurde nicht eigens beobachtet).
- Free Spins mit sehr hohen Gewinnen bis zur Gewinnobergrenze im Tempo-Lauf.
- Mehrere Spielsitzungen nacheinander mit gespeicherter Tempo-Einstellung.
- Der vollständige Browser-Test (sechs Formate) und der Langzeittest wurden nach dieser Änderung nicht wiederholt.
- Echte Geräte, Mobile Safari.

## 6. Geänderte Dateien

`src/client/timing.ts` (neu) · `src/client/presentation/presenter.ts` · `src/client/scenes/game-scene.ts` · `src/client/views/grid-view.ts` · `src/client/views/hud.ts` · `src/client/layout.ts` · `src/client/i18n.ts` · `tests/unit/timing.test.ts` (neu) · `tests/unit/layout.test.ts` · `tools/e2e/timing.cjs` (neu)

## 7. Nebenwirkung auf das Layout

Die Geschwindigkeitswahl braucht im Hochformat eine eigene Zeile unter dem Raster. Auf kleinen Displays wird der Expedition Track dadurch flacher (die Medaillons auf dem iPhone SE sind kleiner als zuvor); auf dem iPhone 15 Pro bleibt das Raster bei rund 55 Pixeln je Zelle.
