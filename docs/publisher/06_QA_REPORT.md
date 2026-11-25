# 06 – QA Report

Build of 25 November 2026, configuration 1.0.0. All tests were run by the developer in an automated environment. **No test was run on a real device, in Safari or in Firefox.**

## 1. Test plan and coverage

| Area | Case | How it is tested | Result |
|---|---|---|---|
| **Base game** | spin without win | scripted round (fixed draws) | pass |
| | spin with win, payout | scripted rounds; 12,000 random rounds re-derived by an independent verifier | pass |
| | cluster detection incl. Wild in several clusters, no diagonals | unit tests | pass |
| | payout arithmetic, integer money, books over 3,000 rounds | session tests | pass |
| **Cascades** | several cascades in a row, gravity, refill | unit, property tests, verifier | pass |
| | multiplier M = T + S in every cascade | verifier | pass |
| | termination at the cascade limit | forced by a degenerate configuration | pass |
| **Expedition** | each station's effect; steps and stepping stones; keys | scripted rounds per station, verifier | pass |
| | bonus trigger at station 5 | scripted round, browser test with seeded rounds | pass |
| **Free spins** | trigger by 3/4/5 Compass, Base Camp, kept sun bonus | scripted and random rounds | pass |
| | retrigger, cap of 30 spins | property tests | pass |
| | seals, Temple Finale, no free-spin prize in the finale | scripted rounds; configuration validator | pass |
| | end of feature: scenery back to base game, counters cleared | browser test | pass |
| **Temple Bonus** | trigger, prize draw, shuffle, pick, Relic second pick, reveal | scripted rounds; exact expectation vs. 6.1 million simulated bonuses | pass |
| | chamber pick through the interface | browser test: 9 rounds, 14 picks (full run) | pass |
| | closed chambers not disclosed before the pick | session test over 4,000 rounds | pass |
| **Buy feature** | price charged, starts in free spins, disabled by configuration | integration and session tests | pass |
| **Maximum win** | never exceeded; round ends when reached | property tests; 2 billion simulated rounds | pass |
| **RNG** | reference vectors, BigInt reference, chi-square on draws, determinism | unit tests | pass |
| **Math** | RTP and frequencies | simulation, see document 02 | pass (own criterion) |
| | second implementation | Python differential test, identical results | pass |
| **UI** | layout for 13 screen sizes × 2 pixel densities: no overlap, everything on screen | unit tests | pass |
| | phone portrait (393×852, 375×667, 360×640), phone landscape, desktop, pixel ratio 3 | browser test | pass |
| | no text over a button, touch targets at least 44 px, no symbol distortion, drawn grid equals event log | browser test, every round | pass |
| | info panel: rules, paytable, history, replay, performance, settings, volume | browser test | pass |
| | both languages; rule texts carry the same figures in English and German | unit and browser tests | pass |
| | reduced motion | one browser run | pass |
| **Audio** | all 17 files load and decode; mute and volume change state | browser test | pass |
| | how it sounds | – | **not tested (nobody has listened)** |
| **Stability** | 300 rounds in one session incl. 30 bought features | long-session test | pass: heap 18.1 → 18.5 MB between round 50 and 300, display objects and running tweens constant |
| | console and page errors | every browser test | none |
| **Technology not covered** | interruption and resume of a round, browser restart mid-round, loss of connection | – | **not implemented in the demo, not tested** |
| | real devices, Safari, Firefox, WebKit, Android browsers, tablets as hardware | – | **not tested** |
| | frame rate on real hardware | measurement view exists in the game | **not measured** |
| | loading on slow networks | – | **not tested** |

## 2. Runs behind this report

| Suite | Scope | Result |
|---|---|---|
| Automated tests (`npm test`) | 86 tests | 86 passed (25 November 2026) |
| Full browser suite | 6 formats, 102 rounds, autoplay, info panel, 9 bonus rounds with 15 picks, replay | **passed on 25 November 2026 on the current build** (a first run that day failed on an overlap of the free-spin counter and the speed buttons in landscape; fixed, second run passed) |
| Quick browser suite | 393×852, 16 rounds, 3 bonus rounds, audio and settings checks | passed on the current build |
| Long-session test | 300 rounds | passed on the current build |
| Engine unchanged | `git diff` of engine, session layer and configuration since before the interface work | 0 lines |

The full browser suite was repeated on 25 November 2026 and passed. It takes about 20 minutes because the test browser renders without a graphics card. The automated test count is now 86.

## 3. Defects found and fixed during development

| ID | Defect | Status |
|---|---|---|
| B-001 | Design allowed a free-spin prize in the bronze finale, contradicting the rules | fixed; validator forbids it |
| B-002 | Chambers were not equivalent without shuffling (grand-treasure rule) | fixed; shuffle after the draw |
| U-01 | Symbols squashed horizontally when a station transformed them | fixed; cross-fade at full size; distortion measured in every browser round |
| U-02 | Falling symbols visible above the play field | fixed; mask |
| U-03 | Bet label covered by buttons at 375 px | fixed; layout test |
| U-04 | Info and sound buttons read as cut-off text boxes | fixed; icon buttons |
| U-05 | Pause with empty cells during cascades | fixed; removal and falling overlap |

## 4. Known open issues

| Issue | Severity |
|---|---|
| No real-device or Safari confirmation | high |
| Audio not reviewed; two effects shorter than specified; music loops not cut on bar lines | high |
| Delivery about 5.6 MB | medium |
| Frame around the play field is squeezed about 10 % horizontally to fit | low |
| No critical defect is known in game logic or accounting | – |
