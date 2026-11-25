# QA TEST RESULTS

Date: 25 November 2026 · demo build after the presentation-mode change · **only executed tests are
listed; all results are internal**

## 1. Automated tests (`npm test`) – 86 of 86 passed

| File | Tests | Result |
|---|---|---|
| `tests/unit/rng.test.ts` | 7 | PASS |
| `tests/unit/grid-clusters.test.ts` | 10 | PASS |
| `tests/unit/frozen-config.test.ts` | 2 | PASS |
| `tests/unit/layout.test.ts` | 32 | PASS |
| `tests/unit/rules-text.test.ts` | 7 | PASS |
| `tests/unit/timing.test.ts` | 3 | PASS |
| `tests/unit/perf.test.ts` | 2 | PASS |
| `tests/integration/round.test.ts` | 9 | PASS |
| `tests/integration/cluster-rule.test.ts` | 2 | PASS |
| `tests/integration/session.test.ts` | 5 | PASS |
| `tests/property/round.property.test.ts` | 7 | PASS |

Type check: PASS.

## 2. Browser tests (Playwright, Chromium headless)

| Run | Scope | Result |
|---|---|---|
| Full suite `npm run e2e` | six formats, 102 rounds, 9 bonus rounds and 15 chamber picks through the UI; console errors, loaded art, grid equals event log, distortion, overlap, accounting, scenery reset | **PASS** (run on the build before the in-game presentation switch was added; after that addition the additional checks, the quick play-through and the resilience checks were repeated and passed) |
| Quick play-through `npm run e2e:quick` on the final build | 16 rounds, 3 bonus rounds through the UI | **PASS** |
| `npm run e2e:final` | title screen and layout in five formats; reel changeover (least symbols on the field: 27 of 30 over 504 frames); demonstration (four steps, balance and history untouched); **presentation mode** by address parameter (two rounds, fixed seed, real chamber picks, label kept) and by the in-game switch under Settings (on, one bonus round, off, normal session with random seed restored); inactive otherwise | **PASS** |
| `npm run e2e:resilience` | reload mid-round → clean fresh start; all symbol images blocked → placeholders, correct result; all audio blocked → game plays; offline after load → round completes | **PASS** |
| Long session, 300 rounds | memory, object count, stuck animations | PASS – memory 13.7 → 19.8 MB, stable from round 50; 47 objects; no stuck animations (run on the build before the in-game presentation switch was added; after that addition the additional checks, the quick play-through and the resilience checks were repeated and passed) |
| Speed modes | Normal / Fast / Skip in two formats, same seeds | PASS – wins per seed identical in all three modes; free spin without a win on the phone format: Normal 3.5 s · Fast 2.1 s · Skip 1.4 s (test browser at 17 fps) (run on the build before the in-game presentation switch was added; after that addition the additional checks, the quick play-through and the resilience checks were repeated and passed) |

## 3. Required areas

| Area | Evidence | Result |
|---|---|---|
| Desktop layouts | 1280×720 play-through; 1366×768, 1920×1080 layout and start | PASS (Chromium) |
| Mobile layouts | 360×640, 375×667, 393×852, 430×932, 852×393; 768×1024 | PASS (Chromium) |
| iPhone | owner on iPhone 15 Pro | "very good" – impression, no measurements |
| Android | – | NOT EXECUTED |
| Browser compatibility | Chromium only | Safari, Firefox NOT EXECUTED |
| Sound and music | files load; fallback works; owner's listening review positive | PASS for function; loudness not measured |
| Animation performance | – | NOT MEASURED on hardware |
| Spin functionality | all runs; six rapid taps start no second spin | PASS |
| Cascades | grid equals event log in every round (mismatches 0) | PASS |
| Cluster calculation, minimum 5 | unit tests; 4,000 real rounds re-checked independently | PASS |
| Expedition progression | scripted and property tests | PASS |
| Free Spins | tests; counter without gaps; scenery returns | PASS |
| Retriggers | property tests (cap 30); frequency measured | PASS |
| Temple Bonus | tests; UI clicks; presentation mode | PASS |
| Restart and recovery | reload mid-round | PASS for a clean restart; **no recovery exists** |
| Error handling | blocked images, blocked audio, offline | PASS |
| Normal / Fast / Skip | see timing run | PASS – identical results in all modes; mode switch works |

## 4. Mathematics-related checks

Differential test against the Python implementation: identical (80,000 rounds, 25 Nov 2026).
Run on configuration 1.0.0: bit-identical to the earlier acceptance run. See `../MATH/`.

## 5. Production build

`TLS_PRODUCTION=1` build: the test hook is absent; presentation mode, demonstration and fixed
seeds are unreachable. The production build was **not** played through by automated tests, because
the tests rely on the hook that the build removes.

## 6. Not executed

Real Android devices, tablets, desktop Safari/Firefox · frame rate and load time on hardware ·
RNG test battery · independent or external QA · player test · accessibility review ·
load and security tests (no server).
