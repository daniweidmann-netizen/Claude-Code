# 01 – Game Design Document

Configuration 1.0.0 (frozen). This document states the rules as the engine implements them; where it and the engine disagree, the engine and `config/game-config.v1.0.0.json` are authoritative. The full German design document is `docs/02_GDD.md`.

## 1. Overview

| Item | Value |
|---|---|
| Format | 6 columns × 5 rows, cluster pays, cascades |
| Cluster | at least **5** matching symbols connected horizontally or vertically (no diagonals) |
| Pay symbols | Sapphire Gem, Golden Scarab, Golden Chalice, Ruby Crown, Jade Mask (low to high) |
| Special symbols | Wild, Explorer (a Wild that stays), Compass (scatter), Temple Key |
| Signature feature | Expedition Track with five stations |
| Bonus | Temple Bonus (three chambers, real choice), Free Spins with Base Camp, Temple Finale |
| Buy feature | Free spins for 58× bet (can be switched off by configuration) |
| Maximum win | 10,000× bet per round |
| Target RTP | 96.00 % (simulated 95.995 %, see document 02) |

**Note on the cluster size.** An early concept used 8 connected symbols. A preliminary simulation showed a hit frequency of about 7 % for that rule on a 6×5 grid, so the minimum was set to 5 (change request CR-01, approved 23 November 2026). All measured figures in this package belong to the 5-symbol rule.

**Note on the Sun Relic.** The Sun Relic is not a separate symbol on the reels. It is the effect of the fourth station: it appears on a pay-symbol position, adds its value to the sun bonus and becomes a Wild. This was confirmed as the intended design on 25 November 2026. The Sun Relic is the central artefact of the game world and has its own artwork; it is shown at the Relic station effect, when the expedition reaches the temple, in the Temple Bonus (title emblems and the Relic Bonus prize) and in the rules. It has no paytable entry and creates no winning combinations.

## 2. A spin, in order

1. The grid is filled column by column from independent weighted draws (document 02, section 3).
2. All clusters are evaluated. Each pays `paytable value × multiplier`. Wilds count for every pay symbol and can belong to several clusters; a cluster needs at least one pay symbol.
3. Progress: one step for the winning cascade, plus one step per Temple Key on the grid. Keys are collected (removed).
4. Winning symbols are removed (the Explorer stays), remaining symbols fall, new symbols drop in.
5. Stations reached by the new progress take effect, in order.
6. Steps 2–5 repeat until no cluster forms (hard limit: 50 cascades; never reached in 2 billion simulated rounds).
7. Compass symbols on the final grid are counted for the free-spin trigger.

The Expedition Track starts from zero on every paid spin. No state is carried between paid rounds.

## 3. Expedition Track

Stations are reached after 1 / 2 / 4 / 6 / 9 steps ("stepping stones").

| Station | Steps | Effect |
|---|---|---|
| 1 Discovery | 1 | 2 random pay symbols become Wilds |
| 2 Treasure | 2 | base multiplier becomes ×2 |
| 3 Ancient Power | 4 | a random pay symbol becomes the Explorer, a Wild that is not removed by wins |
| 4 Relic | 6 | a Sun Relic appears on a random pay symbol, adds its value to the sun bonus and becomes a Wild |
| 5 Temple | 9 | base game: the Temple Bonus starts after the spin; free spins: one temple seal (at most one per spin) |

Multiplier M = base multiplier T (1 or 2) + sun bonus S. Sun Relic values: base game 2, 3, 5, 10, 25; free spins 5, 10, 25, 50, 100 (weights in document 02).

## 4. Temple Bonus

- Three chambers. Three prizes are drawn from the tier's table (the grand treasure at most once), then shuffled onto the chambers. Only then does the player choose.
- The chosen chamber's prize is awarded. A Relic Bonus pays 25× and grants another choice among the closed chambers.
- Afterwards the remaining chambers are opened and shown truthfully.
- Base-game prizes: treasure 7× / 14× / 30× / 56× / 140×, Relic Bonus 25×, 8 free spins (Base Camp on station 2), grand treasure 2,500×.

## 5. Free spins

- 3 / 4 / 5+ Compass: 8 / 10 / 12 free spins with Base Camp on station 1 / 1 / 2.
- Every free spin starts on its Base Camp station with that station's effects already applied. Each Temple Key in a winning cascade raises the Base Camp by one station (maximum station 3).
- The sun bonus S is kept across all free spins of the feature.
- 3+ Compass during free spins: +4 free spins (maximum 30 in total).
- Temple Finale: with at least one seal, a Temple Bonus without free-spin prize follows. Grand treasure 2,500× / 5,000× / 10,000× for 1 / 2 / 3 seals.

## 6. Buy feature

For 58× bet the round starts directly with 8 free spins and Base Camp on station 1 (identical to a 3-Compass trigger). No base spin is played. Its simulated RTP differs from normal play (document 02).

## 7. Limits

Maximum win 10,000× bet; the round ends when it is reached. Maximum 50 cascades per spin, 30 free spins per feature.

## 8. Presentation principles

- The client only replays an ordered event log produced by the engine. Speed-up, skipping and autoplay cannot change a result.
- English and German interface; rules, paytable, round history with replay, performance view and settings are in the info panel and are generated from the configuration.
- Win presentation tiers are display thresholds only: from 5×, 20× and 100× bet.
