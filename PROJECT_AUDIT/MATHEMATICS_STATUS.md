# MATHEMATICS STATUS

Date: 25 November 2026 · summary; full detail in `MATH/`

> **All figures are internal simulations or internal calculations. None is independently
> validated or certified.** 96.00 % is the design target, not a proven value.

| Item | Value | Status |
|---|---|---|
| Configuration | 1.0.0, SHA-256 `943082d640a065931a87d21e3bb84a953ae27ba653531d4303b22857d75698e3` | VERIFIED (hash test) |
| Target RTP | 96.00 % | design target |
| Simulated RTP | 95.9950 % (95 % interval 95.9024–96.0877 %), 2,000,000,000 rounds on configuration 1.0.0 | NEEDS EXTERNAL VALIDATION |
| Hit frequency | 32.795 % (base spin with a cluster); 33.011 % of rounds pay anything | NEEDS EXTERNAL VALIDATION |
| Standard deviation | 21.141× bet per round; volatility "high" by the developer's own judgement | NEEDS EXTERNAL VALIDATION |
| Maximum win | 10,000× bet; reached 1 in 3,034,901 rounds | VERIFIED rule / simulated frequency |
| Free Spins | 1 in 222.1 rounds; average feature win 67.90× | NEEDS EXTERNAL VALIDATION |
| Temple Bonus | 1 in 326.1 rounds; expectation 50.971× exact, 50.826× simulated | NEEDS EXTERNAL VALIDATION |
| Buy Expedition at 58× | RTP 96.831 % (96.767–96.895 %), 100,000,000 purchases | NEEDS EXTERNAL VALIDATION |
| RTP variants | one only | IN PROGRESS (tooling exists) |
| RNG | xoshiro256**, statistical; own tests only, no test battery | NEEDS EXTERNAL VALIDATION |
| Math unchanged in this audit | yes | VERIFIED |

Internal safeguards [FACT]: exact sub-calculations match simulation; an independent Python
implementation reproduces rounds one by one; the run on configuration 1.0.0 is bit-identical to
the earlier acceptance run; the cluster rule was re-checked on 4,000 real rounds.

Open [FACT]: no independent laboratory, no second statistical sample on a new seed, one RTP
configuration, no recognised volatility index, no RNG test battery.
