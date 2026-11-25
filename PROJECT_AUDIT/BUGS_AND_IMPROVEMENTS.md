# BUGS AND IMPROVEMENTS

Date: 25 November 2026

## 1. Known defects

No defect is known in game logic or accounting. [FACT: 86 tests, browser runs, simulations]

| ID | Open item | Severity | Type |
|---|---|---|---|
| K1 | Single-file build does not open on iPhone | low | bug (owner report); hosted version works |
| K2 | Frame image squeezed about 10 % | low | visual |
| K3 | Licence notices not bundled | low | compliance |
| K4 | Free-spin summary "highest multiplier" can be lower than the multiplier shown at the end | low | wording |
| K5 | No round recovery after reload | high for production | missing feature |
| K6 | Developer-tool strings remain in a production bundle (unreachable) | low | hygiene |

## 2. Defects fixed during development [FACT]

Prize-table rule in the Finale (B-001) · equivalence of chambers (B-002) · squashed symbols ·
symbols visible above the field · covered bet label · empty cells in cascades · empty play field
between spins · free-spin counter overlapping the speed buttons in landscape (found by the full
browser run on 25 November 2026).

## 3. Improvements, prioritised [RECOMMENDATION]

| Prio | Improvement | Needs approval? |
|---|---|---|
| 1 | Resolve rights for art, audio and code (`IP/`) | owner / lawyer |
| 1 | Test on Android, tablet, desktop Safari/Firefox; record frame rates | owner |
| 2 | Human-made vector logo and reworked key symbols | owner (cost) |
| 2 | Bundle licence notices; align version numbers | small build change |
| 2 | Additional RTP configurations | **yes – mathematics** |
| 3 | Symbol animations | owner (cost) |
| 3 | Lazy loading to reduce first load | client change |
| 3 | Clearer wording of the free-spin summary | small client change |
| 3 | Second statistical RTP sample with a new seed; RNG test battery | no parameter change, compute time only |

Nothing in this list was implemented without being named in `MASTER_PROJECT_STATUS.md`, section 5.
