# 03 – Game Design Overview

Stand: 25.11.2026 · Quelle der Regeln: `docs/02_GDD.md`, `src/engine/round/round.ts`,
`config/game-config.v1.0.0.json`. Die Pitch-Texte stehen auf Englisch (Sprache der Zielanbieter)
und auf Deutsch.

## 1. Identität

| Punkt | Inhalt |
|---|---|
| Name | TEMPLE OF THE LOST SUN |
| Claim | EVERY RELIC REVEALS A SECRET. |
| Genre | Abenteuer-Slot, Cluster Pays mit Kaskaden |
| Thema | Expedition durch den Dschungel zu einem vergessenen Sonnentempel; frei erfundene Welt, bewusst keine reale Kultur und keine realen Artefakte (`docs/02_GDD.md`) |
| Visuelle Identität | Stein, warmes Gold, Jade, Türkis; Titelschrift Cinzel, Lesetext Source Sans 3; zwei Kulissen (Dschungel vor dem Tempel, Tempelinneres) |
| Zielgruppe | Aus dem Konzept abgeleitet, **nicht durch Marktdaten belegt**: Spieler von Cluster- und Kaskaden-Slots mit hoher Volatilität, die sichtbaren Fortschritt innerhalb eines Spins mögen. Ein Spielertest hat nicht stattgefunden. |

## 2. Kernmechanik und Ablauf

1. Das 6×5-Raster wird gefüllt; jedes Feld wird unabhängig gezogen.
2. Cluster aus mindestens 5 gleichen, über Kanten verbundenen Symbolen zahlen; Wilds zählen mit.
3. Gewinnsymbole verschwinden, Symbole fallen nach: eine **Kaskade**.
4. Jede Gewinnkaskade ist **ein Schritt** auf dem Expedition Track; jeder Temple Key auf dem
   Raster zählt als weiterer Schritt und wird entfernt.
5. Nach 1, 2, 4, 6 und 9 Schritten wird eine Station erreicht und wirkt sofort auf das Raster
   oder den Multiplikator.
6. Der Track beginnt in der Basisrunde bei jedem Spin neu. In den Free Spins beginnt jeder Spin
   auf dem Base Camp (Station 1 bis 3); Stationen bis dorthin wirken bereits zu Spinbeginn.
7. Station 5 öffnet in der Basisrunde den Temple Bonus, in den Free Spins gibt sie ein Siegel
   für das Temple Finale.

Unterschied zu klassischen Slots: Der Fortschritt innerhalb eines Spins ist sichtbar und hat
fünf verschiedene Wirkungen, statt nur einen Multiplikator zu erhöhen. Der wichtigste Bonus wird
nicht durch ein Scatter-Symbol ausgelöst, sondern durch das Erreichen des Tempels.

## 3. Pitch-Texte

### Kurzbeschreibung (unter 50 Wörter)

**EN:** Temple of the Lost Sun is a 6×5 cluster slot with cascades. Every winning cascade moves
an expedition one step along a five-station track. Each station changes the spin in its own way,
and reaching the temple opens a three-chamber bonus.

**DE:** Temple of the Lost Sun ist ein 6×5-Cluster-Slot mit Kaskaden. Jede Gewinnkaskade bringt
eine Expedition einen Schritt weiter. Fünf Stationen verändern den Spin auf eigene Weise; wer
den Tempel erreicht, öffnet einen Bonus mit drei Kammern.

### Produktbeschreibung (100–150 Wörter)

**EN:** Temple of the Lost Sun is an adventure slot built around a visible journey. On a 6×5 grid,
clusters of five or more matching symbols pay and cascade. Each winning cascade is one step on the
Expedition Track; Temple Keys add extra steps. Five stations wait along the way: Discovery places
two Wilds, Treasure doubles the base multiplier, Ancient Power adds a sticky Explorer Wild, the
Sun Relic adds its value to the multiplier, and the Temple opens the Temple Bonus with three
chambers. In free spins every spin starts from a Base Camp higher up the track, the sun bonus
is kept for the whole feature, and reaching the temple collects seals for a Temple Finale.
Maximum win is 10,000× bet. The game exists as a playable web demo with one math configuration
(target RTP 96.00 %, internally simulated, not certified).

**DE:** Temple of the Lost Sun ist ein Abenteuer-Slot mit einer sichtbaren Reise. Auf einem
6×5-Raster zahlen Cluster ab fünf gleichen Symbolen und lösen Kaskaden aus. Jede Gewinnkaskade
ist ein Schritt auf dem Expedition Track; Temple Keys geben zusätzliche Schritte. Fünf Stationen
liegen am Weg: Discovery setzt zwei Wilds, Treasure verdoppelt den Grundmultiplikator, Ancient
Power bringt ein stehendes Explorer-Wild, das Sun Relic addiert seinen Wert zum Multiplikator,
und der Tempel öffnet den Temple Bonus mit drei Kammern. In den Free Spins startet jeder Spin
von einem Base Camp weiter oben, der Sonnenbonus bleibt über das ganze Feature erhalten, und
Siegel führen ins Temple Finale. Höchstgewinn 10 000× Einsatz. Das Spiel liegt als spielbare
Web-Demo mit einer Mathematik-Konfiguration vor (Ziel-RTP 96,00 %, intern simuliert, nicht
zertifiziert).

### Beschreibung für Provider (250–350 Wörter)

**EN:** Temple of the Lost Sun is a cluster-pays slot on a 6×5 grid whose signature is the
Expedition Track: a five-station progress path that is driven by the cascades of a single spin.

*Core loop.* Clusters of at least five orthogonally connected symbols pay; winning symbols are
removed and new ones fall in. Every winning cascade advances the expedition by one step, and
every Temple Key on the grid adds another. Stations are reached after 1, 2, 4, 6 and 9 steps and
act immediately: Discovery turns two pay symbols into Wilds; Treasure raises the base multiplier
from 1 to 2; Ancient Power creates an Explorer, a Wild that stays in place after wins; the Sun
Relic draws a value, adds it to the multiplier
and turns into a Wild; the Temple opens the Temple Bonus, where the player opens one of three
chambers whose prizes are fixed before the choice.

*Free spins.* Three or more Compass symbols award 8, 10 or 12 free spins. Each free spin starts
on a Base Camp station, so the lower stations take effect at once; Temple Keys move the Base Camp
up for the rest of the feature. The sun bonus is not reset between free spins. Reaching the
temple during free spins collects up to three seals, which upgrade the prize table of the Temple
Finale played after the last spin.

*Numbers.* One configuration exists. An internal two-billion-round simulation measured an
RTP of 95.995 % (95 % interval 95.902–96.088 %), a hit frequency of 32.80 % and a standard
deviation of 21.14× bet per round. Free spins occur about once in 222 rounds, the Temple Bonus
once in 326. The win is capped at 10,000× bet. These figures are not independently verified or certified.

*Status.* The math engine is separate from the presentation, deterministic from a seed and
covered by automated tests and a second implementation. The client is a playable Phaser 3 demo.
Not yet done: real-device testing, audio review, rights clearance for the AI-generated art and
audio, further RTP variants, server integration and certification.

Eine deutsche Fassung dieses langen Textes ist nicht ausgearbeitet; die Aussagen stehen auf Deutsch in `04_Feature_Overview.md` und `05_Math_Overview.md`.

## 4. Die fünf wichtigsten Verkaufsargumente

| # | Argument | Beleg im Projekt |
|---|---|---|
| 1 | **Expedition Track**: Fortschritt innerhalb eines Spins mit fünf unterschiedlichen Wirkungen statt eines reinen Zählers | `round.ts` Z. 277–319; `04_Feature_Overview.md` |
| 2 | **Der Bonus wird erreicht, nicht gewürfelt**: Der Temple Bonus ist das Ziel der Expedition; die Free Spins verkürzen den Weg (Base Camp) | `round.ts` Z. 136–140, 331–344 |
| 3 | **Ehrlicher Pick-Bonus**: Preise liegen vor der Wahl fest, die Kammern sind gleichwertig gemischt, die übrigen werden danach aufgedeckt | `round.ts` Z. 232–250, 180–185 |
| 4 | **Nachvollziehbare Mathematik**: eingefrorene Konfiguration mit Prüfsumme, Simulator, unabhängige Zweitimplementierung, jede Runde aus Seed wiederholbar | `05_Math_Overview.md`, `tests/` |
| 5 | **Trennung von Logik und Darstellung**: Die Engine kennt keinen Browser; der Client spielt nur ein Ereignisprotokoll ab. Erleichtert Portierung auf eine fremde Plattform | `src/engine/`, `src/client/presentation/presenter.ts` |

Nicht behauptet wird: Marktneuheit, Erfolg bei Spielern, Eignung für bestimmte Märkte. Dafür gibt
es keine Daten im Projekt.
