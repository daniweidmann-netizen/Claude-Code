# MATH DOCUMENTATION

Date: 25 November 2026 · configuration 1.0.0
SHA-256 of the canonical JSON: `943082d640a065931a87d21e3bb84a953ae27ba653531d4303b22857d75698e3`
(file `config/game-config.v1.0.0.json`; checked by `tests/unit/frozen-config.test.ts`)

> **Internal simulation and internal calculation only. Not independently validated. Not
> certified.** This document is confidential: it contains the mathematical internals and must not
> be used in public presentation material.

## 1. Model

- Grid 6×5. Every cell is drawn independently from a weighted table (no reel strips).
- Weights, base game / Free Spins: Sapphire 2000 / 2000 · Scarab 1950 / 1950 · Chalice 1900 / 1900 ·
  Crown 1850 / 1850 · Mask 1800 / 1800 · Wild 0 / 0 · Compass 92 / 60 · Temple Key 200 / 91
  (sums 9792 / 9651; probability = weight ÷ sum).
- Win: clusters of at least 5 equal symbols connected by edges; Wild and Explorer substitute.
- Pay brackets by cluster size: 5, 6, 7, 8–9, 10–11, 12–14, 15–19, 20+.

| Symbol | 5 | 6 | 7 | 8–9 | 10–11 | 12–14 | 15–19 | 20+ |
|---|---|---|---|---|---|---|---|---|
| Sapphire Gem | 0.1 | 0.2 | 0.3 | 0.4 | 0.7 | 1.3 | 3.5 | 10 |
| Golden Scarab | 0.2 | 0.3 | 0.3 | 0.5 | 0.9 | 1.9 | 5 | 17.5 |
| Golden Chalice | 0.3 | 0.3 | 0.5 | 0.8 | 1.6 | 3.2 | 7.5 | 25 |
| Ruby Crown | 0.3 | 0.5 | 0.8 | 1.3 | 2.6 | 5.1 | 12.5 | 50 |
| Jade Mask | 0.7 | 0.9 | 1.6 | 2.6 | 5.1 | 9.4 | 25 | 100 |

- Cluster win = paytable value × M, with M = T + S (T = 1 or 2, S = sun bonus).
- Expedition: stations after 1, 2, 4, 6, 9 steps; effects as in `../GAMEPLAY_FEATURE_AUDIT.md`.
- Sun Relic values (weight per 1000): base 2 (500), 3 (280), 5 (150), 10 (55), 25 (15);
  Free Spins 5 (480), 10 (290), 25 (150), 50 (60), 100 (20).
- Limits: 50 cascades per spin, 30 Free Spins per feature, Base Camp ≤ 3, seals ≤ 3,
  round win capped at 10,000× bet.
- Money: integers in hundredths of a bet.

## 2. Key figures (2,000,000,000 rounds on configuration 1.0.0, seed 20261126)

| Figure | Value |
|---|---|
| Target RTP | 96.00 % (design target) |
| Simulated RTP | 95.9950 %, 95 % interval 95.9024–96.0877 % |
| Standard deviation per round | 21.141× bet |
| Hit frequency (base spin with a cluster) | 32.795 % |
| Rounds with any win | 33.011 % |
| Average win of a winning round | 2.908× bet (derived) |
| Cascades per base spin | 0.650 on average; 1.982 when the spin wins (derived) |
| Maximum win 10,000× | reached 659 times = 1 in 3,034,901 |
| Volatility | "high" – developer's own judgement, no recognised index applied |

RTP by source: base clusters 49.836 % · Temple Bonus (base) 15.588 % · Free-Spin clusters 25.738 % ·
Temple Finale 4.834 %. Base game in total 65.42 %, Free-Spin feature in total 30.57 %.

Why two hit figures: 32.795 % counts rounds whose **base spin** has a cluster; 33.011 % counts
rounds that pay **anything**. The difference is rounds that trigger Free Spins without a base
cluster and win there.

Win distribution per round: 0: 66.989 % · below 1×: 17.765 % · 1–2×: 7.910 % · 2–5×: 5.372 % ·
5–10×: 1.199 % · 10–20×: 0.339 % · 20–50×: 0.236 % · 50–100×: 0.095 % · 100–500×: 0.082 % ·
500–1,000×: 0.0071 % · 1,000–5,000×: 0.0053 % · 5,000×+: 0.00021 %.

## 3. Method

Monte Carlo simulation with the game engine itself (`tools/sim/`), four independent RNG streams,
batch-means error estimate. Exact enumeration for the Temple Bonus expectations and the first-drop
Compass probability. Differential test against an independent Python implementation
(`tools/reference/`).

## 4. Sources

Reports in `docs/math/reports/` (Markdown and JSON): `2026-11-25_v1.0.0_2G_acceptance`,
`2026-11-25_v1.0.0_featurebuy_100M`, `2026-11-25_v1.0.0_extra-stats_100M`, and the earlier tuning
runs. Rules: `src/engine/round/round.ts`.
