# BONUS PROBABILITY REPORT

Date: 25 November 2026 · configuration 1.0.0 · **internal simulation and calculation, not
validated** · confidential

## 1. Free Spins

| Figure | Value | Basis |
|---|---|---|
| Trigger | 3 / 4 / 5+ Compass at spin end → 8 / 10 / 12 spins | rule |
| Frequency, any source | 1 in 222.1 rounds | 2 billion rounds |
| via Compass | 1 in 238.1 | same |
| via Temple Bonus prize | 1 in 3,267 | derived |
| 3+ Compass on the first drop | 0.2785 % | exact (binomial) |
| Average spins per feature | 8.21 | simulation |
| Average feature win incl. Finale | 67.90× (std. dev. 212.44×) | simulation |
| Final Base Camp 1 / 2 / 3 | 21.6 % / 30.6 % / 47.8 % | simulation |
| Retrigger (+4 spins, max 30) | in 1.360 % of features (1 in 73.5); one per 596 free spins | 100 M rounds |
| Average final sun bonus | 14.72 (highest seen: 400) | simulation |
| Average multiplier per winning cascade | base game 1.42 · Free Spins 9.47 | 100 M rounds |

## 2. Temple Bonus (base game)

| Figure | Value |
|---|---|
| Trigger | Expedition reaches station 5 (9 steps in one spin) |
| Frequency | 1 in 326.1 rounds |
| Chambers / picks | 3 / 1 (plus one per Relic Bonus) |
| Expectation | 50.971× exact · 50.826× simulated (6.13 M bonuses) |
| Probability that the bonus awards Free Spins | 9.991 % exact · 9.980 % simulated |
| Contribution to RTP | 15.588 % |

Prize table (value × bet, weight of 1000): 7 (300) · 14 (240) · 30 (150) · 56 (80) · 140 (30) ·
Relic Bonus 25 + another chamber (100) · 8 Free Spins at Base Camp 2 (90) · grand treasure 2,500 (10).
Three prizes are drawn independently, the grand treasure at most once, then shuffled.

## 3. Temple Finale (after Free Spins with seals)

| Seals | Share of features | Expectation exact | Simulated | Grand treasure |
|---|---|---|---|---|
| 0 | 87.0 % | – | – | – |
| 1 | 11.2 % | 63.360× | 63.034× | 2,500× |
| 2 | 1.6 % | 174.954× | 176.550× | 5,000× |
| 3 | 0.2 % | 476.347× | 454.174× | 10,000× |

The three-seal simulation is lower than the exact value because the 10,000× cap truncates it.
Contribution of the Finale to RTP: 4.834 %.

## 4. Buy Expedition

58× bet → 8 Free Spins from Base Camp 1. Average win 56.162×; RTP 96.831 %; maximum win reached
1 in 18,252 purchases; 99.977 % of purchases pay something. Can be disabled by configuration.
