# RTP SIMULATION REPORT

Date: 25 November 2026 · **internal simulations, not independently validated, not certified** ·
confidential

## 1. All runs

| Run | Configuration (hash start) | Sample | Seed | RTP | 95 % interval | Std. dev. | Hit freq. |
|---|---|---|---|---|---|---|---|
| Draft | 0.1 (`4b2319b4`) | 20 M rounds | 20261123 | 1721.95 % | – | 153.03× | 43.21 % |
| Candidate | 0.2 (`55caa641`) | 400 M | 20261123 | 95.980 % | 95.860–96.099 | 12.20× | 32.70 % |
| Candidate | 0.3 (`d2c94def`) | 1,000 M | 20261124 | 95.850 % | 95.719–95.980 | 21.07× | 32.80 % |
| Acceptance 1 | 0.3.1 (`b6ca9b0d`) | 2,000 M | 20261125 | 96.107 % | 96.014–96.200 | 21.23× | 32.80 % |
| Acceptance 2 | 0.3.2 (`3161a5c3`) | 2,000 M | 20261126 | 95.995 % | 95.902–96.088 | 21.14× | 32.80 % |
| **Acceptance on shipped configuration** | **1.0.0 (`943082d6`)** | **2,000 M** | 20261126 | **95.995 %** | **95.902–96.088** | 21.14× | 32.80 % |
| Extra statistics | 1.0.0 | 100 M | 20261128 | 95.941 % | – | – | – |
| Buy feature, first run | 0.3.3 (`71630094`) | 100 M purchases | 20261127 | 95.815 % at price 58.6× | 95.752–95.879 | 189.51× | – |
| **Buy feature on shipped configuration** | **1.0.0** | **100 M purchases** | 20261129 | **96.831 % at price 58×** | **96.767–96.895** | 189.58× | – |

## 2. Reading the table

- 0.1 was an unbalanced first draft; it only shows that the simulator ran.
- 0.3 → 0.3.1 → 0.3.2 are tuning steps. 0.3.1 was outside the developer's own tolerance
  (±0.10 percentage points around the target); one treasure prize was then lowered from 15× to 14×.
- The run on 1.0.0 used the same seed as Acceptance 2 and is **bit-identical** in every counter.
  It proves that 0.3.2 and 1.0.0 have the same values for normal rounds; it is **not** a second
  statistical sample.
- The 100 M extra-statistics sample (95.941 %) lies inside the interval of the large run.

## 3. Target versus result

Target 96.00 %. Result 95.995 %, interval 95.902–96.088 %. The target lies inside the interval;
the true value is known only to about ±0.09 percentage points.

## 4. Buy Expedition

Price 58× bet, 8 Free Spins from Base Camp 1. Average win 56.162× (±0.037) → RTP 96.831 %.
The first run measured 56.148× at a different price; dividing by 58 gave 96.81 %, which the direct
run confirms. The game's rules page shows 96.81 % (96.74–96.87 %) from the first run.
The buy feature returns about 0.84 percentage points more than normal play; this is the owner's
decision for a round price and is disclosed in the rules.

## 5. Limits

No independent replication; one configuration; no second sample on a fresh seed for 1.0.0; share
of win removed by the 10,000× cap not reported.
