# 02 – Math Documentation

Configuration **1.0.0**, file `config/game-config.v1.0.0.json`, SHA-256 of the canonical JSON `943082d640a065931a87d21e3bb84a953ae27ba653531d4303b22857d75698e3` (checked by an automated test).

> **All figures are results of internal simulation. They are not certified.** No independent test laboratory has examined the game, its RNG or its mathematics. An internal simulation is not a certification.

## 1. Summary

| Metric | Value | Source |
|---|---|---|
| Target RTP | 96.00 % | design |
| Simulated RTP, normal rounds | **95.995 %** (95 % interval 95.902–96.088 %) | 2,000,000,000 rounds, seed 20261126 |
| Standard deviation per round | 21.14× bet | same run |
| Hit frequency (base spin with a cluster) | 32.80 % | same run |
| Rounds with any win | 33.01 % | same run |
| RTP split | base clusters 49.84 % · Temple Bonus (base) 15.59 % · free-spin clusters 25.74 % · Temple Finale 4.83 % | same run |
| Free spins, any source | 1 in 222.1 rounds (via Compass 1 in 238.1) | same run |
| Temple Bonus in base game | 1 in 326.1 rounds | same run |
| Maximum win 10,000× reached | 659 times, 1 in 3,034,901 rounds | same run |
| Cascade limit reached | 0; longest sequence 23 | same run |
| Buy feature, average win | 56.148× bet (95 % interval ±0.037) | 100,000,000 bought features, seed 20261127 |
| Buy feature RTP at price 58× | **96.81 %** (95 % interval 96.74–96.87 %) | derived: 56.148 / 58 |

The buy-feature RTP differs from normal play by design decision of the owner (round price). The figures for normal rounds were measured on configuration 0.3.2; configuration 1.0.0 has identical parameters for normal rounds (only the buy-feature block was added), which was verified by comparing 300,000 rounds output for output.

Volatility: high. Win distribution per round (2 billion rounds):

| Win (× bet) | Share of rounds |
|---|---|
| 0 | 66.989 % |
| below 1 | 17.765 % |
| 1 to below 2 | 7.910 % |
| 2 to below 5 | 5.372 % |
| 5 to below 10 | 1.199 % |
| 10 to below 20 | 0.339 % |
| 20 to below 50 | 0.236 % |
| 50 to below 100 | 0.095 % |
| 100 to below 500 | 0.082 % |
| 500 to below 1,000 | 0.0071 % |
| 1,000 to below 5,000 | 0.0053 % |
| 5,000 and above | 0.00021 % |

## 2. Why simulation

A closed-form RTP is not available for a 6×5 cluster game with cascades (state space of the order 8³⁰ per grid, plus cascade paths). The total RTP is therefore estimated by Monte Carlo simulation with a confidence interval, and secured by three independent checks (section 6).

## 3. Model

**Symbol draw.** Every cell is drawn independently from a weighted table; there are no reel strips. Weights per 10,000 (the remainder to 10,000 is not used; probability = weight ÷ sum):

| Symbol | Base game | Free spins |
|---|---|---|
| Sapphire Gem | 2000 | 2000 |
| Golden Scarab | 1950 | 1950 |
| Golden Chalice | 1900 | 1900 |
| Ruby Crown | 1850 | 1850 |
| Jade Mask | 1800 | 1800 |
| Wild | 0 | 0 |
| Compass | 92 | 60 |
| Temple Key | 200 | 91 |

Wilds never drop naturally; they are created by stations.

**Paytable** (× bet, by cluster size):

| Symbol | 5 | 6 | 7 | 8–9 | 10–11 | 12–14 | 15–19 | 20+ |
|---|---|---|---|---|---|---|---|---|
| Sapphire Gem | 0.1 | 0.2 | 0.3 | 0.4 | 0.7 | 1.3 | 3.5 | 10 |
| Golden Scarab | 0.2 | 0.3 | 0.3 | 0.5 | 0.9 | 1.9 | 5 | 17.5 |
| Golden Chalice | 0.3 | 0.3 | 0.5 | 0.8 | 1.6 | 3.2 | 7.5 | 25 |
| Ruby Crown | 0.3 | 0.5 | 0.8 | 1.3 | 2.6 | 5.1 | 12.5 | 50 |
| Jade Mask | 0.7 | 0.9 | 1.6 | 2.6 | 5.1 | 9.4 | 25 | 100 |

**Complete list of random decisions** (each with a documented distribution in the configuration): symbol per cell; positions of the two Discovery Wilds; position of the Explorer; position and value of the Sun Relic; the three Temple Bonus prizes and their assignment to chambers. Nothing else is random, and no draw depends on balance, bet size, history or player behaviour.

**Sun Relic values** (weight per 1,000): base game 2 (500), 3 (280), 5 (150), 10 (55), 25 (15); free spins 5 (480), 10 (290), 25 (150), 50 (60), 100 (20).

**Temple Bonus prize tables** (value × bet, relative weight):

| Base game | Weight | Finale, 1 seal | Weight | Finale, 2 seals | Weight | Finale, 3 seals | Weight |
|---|---|---|---|---|---|---|---|
| Treasure 7 | 300 | Treasure 10 | 300 | Treasure 10 | 150 | Treasure 20 | 150 |
| Treasure 14 | 240 | Treasure 20 | 240 | Treasure 20 | 220 | Treasure 40 | 220 |
| Treasure 30 | 150 | Treasure 40 | 240 | Treasure 40 | 200 | Treasure 80 | 200 |
| Treasure 56 | 80 | Treasure 80 | 80 | Treasure 80 | 140 | Treasure 200 | 130 |
| Treasure 140 | 30 | Treasure 200 | 30 | Treasure 200 | 70 | Relic Bonus 25 | 150 |
| Relic Bonus 25 | 100 | Relic Bonus 25 | 100 | Relic Bonus 25 | 120 | Grand 10,000 | 30 |
| Free spins | 90 | Grand 2,500 | 10 | Grand 5,000 | 20 | | |
| Grand 2,500 | 10 | | | | | | |

The grand treasure can occur at most once per bonus (redraw otherwise). After the draw, the prizes are shuffled uniformly onto the chambers, so every chamber has the same distribution and the player's choice is a real choice with identical expectation for each chamber.

## 4. RNG used for simulation and demo

- Generator: xoshiro256** with SplitMix64 seeding; implemented on 32-bit halves and tested against published reference vectors and against a BigInt reference.
- Integers in [0, n) by rejection sampling on the upper 32 bits (no modulo bias); chi-square tests on symbol frequencies and weighted picks are part of the test suite.
- Streams: each simulation worker uses its own stream derived from master seed and stream index.
- Demo: the seed of each round comes from the browser's cryptographic generator and is stored in the round history, so every demo round can be replayed exactly.
- **This RNG is a simulation and demo generator. It carries no certification claim.** In a real-money integration the licensee's certified RNG sits behind the same one-method interface (`nextInt(n)`).

## 5. Reproducing the results

```
npm install
npm test                                                  # 79 automated tests
npm run sim -- --rounds 2000000000 --seed 20261126        # acceptance run (about 75 minutes on 4 cores)
npm run sim -- --mode buy --rounds 100000000 --seed 20261127
tools/reference/diff.sh config/game-config.v1.0.0.json 777 4 250000        # engine vs. Python reference
tools/reference/diff.sh config/game-config.v1.0.0.json 99 4 250000 buy
```

A run is fully determined by configuration, master seed, number of workers and rounds per worker. Reports (Markdown and JSON, with configuration hash and git commit) are in `docs/math/reports/`, including the two acceptance runs that **failed** before the final configuration (95.850 % and 96.107 %) and the adjustment made after each.

Acceptance criterion used: point estimate within 96.00 ± 0.10 % **and** half-width of the 95 % interval at most 0.10 percentage points. Result: 95.995 %, half-width 0.093.

## 6. Checks behind the number

1. **Exact sub-calculations.** The expected value of every Temple Bonus tier is enumerated exactly and compared with the simulation: base game exact 50.971×, simulated 50.826× (6.13 million bonuses); finale 63.360 / 63.034, 174.954 / 176.550, 476.347 / 454.174 (the three-seal tier is lower in simulation because the 10,000× cap truncates it). First-drop Compass probability is computed from the binomial distribution.
2. **Second, independent implementation** of the round logic in Python (different cluster algorithm). With the same seed both implementations returned identical results for every round in all comparisons: 1.1 million rounds (config 0.3.0), 200,000 each for later configurations, and 1,000,000 bought rounds.
3. **Independent event-log verifier** (union-find instead of flood fill) that re-derives every win, every removal and every track step for 12,000 random rounds in the test suite.

## 7. Known limitations

| Point | Status |
|---|---|
| Certification | none |
| RTP variants (94 %, 92 %, …) | not derived; only one configuration exists |
| Exhaustive enumeration of miniature grids | planned in the math plan, **not done** |
| RTP truncated by the 10,000× cap | not reported separately |
| Batch-means standard error | 0.054 vs. analytic 0.047 percentage points in the acceptance run; the criterion was checked with the analytic value |
| Paytable smoothing | functional values, not rounded for presentation (e.g. two equal values in one row) |
| Statistical test battery for the RNG (e.g. TestU01, Dieharder) | not run; only reference vectors and chi-square tests |
