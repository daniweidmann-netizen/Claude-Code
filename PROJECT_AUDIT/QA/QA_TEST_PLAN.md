# QA TEST PLAN

Date: 25 November 2026 · scope: demo build of configuration 1.0.0

## 1. Test levels

| Level | Tool | Command | Covers |
|---|---|---|---|
| Unit, integration, property tests | Vitest, fast-check | `npm test` | RNG, cluster search, round logic, session accounting, layout, rules text, timing |
| Differential test | Node + Python | `tools/reference/diff.sh` | engine vs independent implementation, round by round |
| Simulation | `tools/sim` | `npm run sim` | RTP, frequencies, distributions |
| Browser, full | Playwright (Chromium) | `npm run e2e` | six formats: play-through, bonus by clicking, autoplay, panel, replay, accounting, overlap, distortion |
| Browser, additional | Playwright | `npm run e2e:final` | title screen, five more formats, reel changeover, demonstration, presentation mode |
| Browser, resilience | Playwright | `npm run e2e:resilience` | reload mid-round, blocked images, blocked audio, offline |
| Long session | Playwright | `node tools/e2e/soak.cjs` | 300 rounds: memory, object count, stuck animations |
| Speed modes | Playwright | `node tools/e2e/timing.cjs` | Normal / Fast / Skip: durations, identical results per seed |
| Manual on devices | checklist | `docs/08_DEVICE_TEST_CHECKLIST.md` | real phones, tablets, browsers, sound |

## 2. Areas and how each is checked

| Area | Automated check | Manual check |
|---|---|---|
| Desktop layouts | 1280×720, 1366×768, 1920×1080 | real monitors, Safari/Firefox |
| Mobile layouts | 360×640, 375×667, 393×852, 430×932, 852×393, 768×1024 | real devices |
| Sound and music | files load; fallback when blocked | listening review |
| Animation performance | none meaningful (software rendering) | frame rate on devices |
| Spin, cascades, cluster calculation | tests; drawn grid equals event log in every browser round | – |
| Minimum cluster 5 | unit tests; 4,000 real rounds re-checked independently | – |
| Expedition progression | scripted-draw tests; property tests | – |
| Free Spins, retriggers | tests (counter, cap 30); simulation frequency | – |
| Temple Bonus | tests; bonus rounds clicked through the UI; presentation mode | – |
| Restart and recovery | reload mid-round | – |
| Error handling | blocked images, blocked audio, offline | – |
| Normal / Fast / Skip | timing test; mode switch mid-feature; repeated taps | feel on device |

## 3. Rules for reporting

Only executed tests are reported as results. Results are internal. Speed settings must never
change results: verified by playing the same seeds in all three modes and comparing wins.
