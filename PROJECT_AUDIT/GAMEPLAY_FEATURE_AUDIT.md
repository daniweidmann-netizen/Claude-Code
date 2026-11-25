# GAMEPLAY FEATURE AUDIT

Date: 25 November 2026 · configuration 1.0.0 · all rules verified in `src/engine/round/round.ts`
and `config/game-config.v1.0.0.json` [FACT unless marked]

## 1. Core rules

| Rule | Value | Status |
|---|---|---|
| Grid | 6 columns × 5 rows, every cell drawn independently from a weighted table (no reel strips) | VERIFIED |
| Win | cluster of at least **5** equal symbols connected by edges; Wilds count | VERIFIED |
| Diagonals | do not connect | VERIFIED |
| Cascades | winning symbols removed, symbols fall, new ones drawn; limit 50 per spin (longest seen in 2 billion rounds: 23) | VERIFIED |
| Multiplier | M = T + S: base multiplier T (1, or 2 after Treasure) plus sun bonus S | VERIFIED |
| Maximum win | 10,000× bet per round, hard cap | VERIFIED |

## 2. Symbols

| Symbol | Type | Function |
|---|---|---|
| Sapphire Gem, Golden Scarab, Golden Chalice, Ruby Crown, Jade Mask | pay symbols (low to high) | paytable by cluster size 5 / 6 / 7 / 8–9 / 10–11 / 12–14 / 15–19 / 20+ |
| Wild | wild | never drops; created by Discovery and Relic; can belong to several clusters |
| Explorer | sticky wild | created by Ancient Power; stays after wins until the spin ends |
| Compass | trigger | 3+ on the grid at spin end start Free Spins (or retrigger) |
| Temple Key | special | each key in a winning cascade is one extra step; in Free Spins also raises the Base Camp |
| Sun Relic | **not a reel symbol** | the effect of station 4 and the central artefact of the game world |

Paytable (× bet): Sapphire 0.1–10 · Scarab 0.2–17.5 · Chalice 0.3–25 · Crown 0.3–50 · Mask 0.7–100.

## 3. Expedition Track

One step per winning cascade, plus one per Temple Key. Restarts every paid spin.

| Station | Steps | Effect | Highest station per base spin (internal simulation) |
|---|---|---|---|
| Discovery | 1 | 2 random pay symbols become Wilds | 7.2 % |
| Treasure | 2 | base multiplier becomes ×2 | 19.2 % |
| Ancient Power | 4 | one pay symbol becomes the Explorer | 4.6 % |
| Relic | 6 | Sun Relic: value 2/3/5/10/25 (Free Spins 5/10/25/50/100) is added to the sun bonus; the cell becomes a Wild | 1.5 % |
| Temple | 9 | base game: Temple Bonus · Free Spins: one seal | 0.31 % (1 in 326) |

Status: COMPLETED and VERIFIED by tests.

## 4. Free Spins

3 / 4 / 5+ Compass → 8 / 10 / 12 spins, Base Camp on station 1 / 1 / 2. Every free spin starts on
its Base Camp with those stations already applied; keys raise the camp (max station 3). The sun
bonus is kept for the whole feature. 3+ Compass retrigger +4 spins (max 30). Reaching the Temple
gives a seal (max one per spin, three per feature). Status: COMPLETED, VERIFIED.

## 5. Temple Bonus and Temple Finale

Three chambers. Prizes are drawn and shuffled before the player chooses; the client learns a
chamber's content only when it is opened. One pick; a Relic Bonus (25×) grants another. Remaining
chambers are revealed afterwards. Base-game prizes: 7 / 14 / 30 / 56 / 140×, Relic Bonus 25×,
8 Free Spins, grand treasure 2,500×. The Finale after Free Spins uses a better table per seal
count (grand treasure 2,500 / 5,000 / 10,000×). No multiplier applies to chamber prizes.
Status: COMPLETED, VERIFIED (exact expectations match simulation).

## 6. Further functions

Buy Expedition (58× bet, 8 Free Spins from Base Camp 1, can be switched off) · autoplay 10 rounds ·
Normal / Fast / Skip · history with exact replay · rules, paytable, performance and settings panel ·
demonstration with four fixed seeds · presentation mode for the Temple Bonus.

## 7. Inconsistencies found

| # | Finding | Assessment |
|---|---|---|
| G1 | The buy feature returns 96.83 % against 95.995 % in normal play | owner's decision (round price); disclosed in the rules; providers will ask [FACT] |
| G2 | The buy feature is called "Buy Expedition" in the game and "buy feature / feature buy" in documents | naming only [FACT] |
| G3 | The summary after Free Spins shows the "highest multiplier" at a win, which can be lower than the multiplier displayed at the end | display detail, not an error; could confuse [FACT] |
| G4 | The last Free Spins have no special rule, only presentation | intended [FACT] |
| G5 | Whether players understand the Expedition Track without explanation | NEEDS TESTING – no player test [ASSUMPTION either way] |

## 8. Not present

Symbol frame animations, ambience sound bed, jackpots, gamble feature, bonus bets, tournaments,
round recovery. None is planned in the current scope.
