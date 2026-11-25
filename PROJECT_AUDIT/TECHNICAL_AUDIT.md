# TECHNICAL AUDIT

Date: 25 November 2026 · marks: [FACT] / [ASSUMPTION] / [RECOMMENDATION]

## 1. Stack [FACT]

| Item | Value |
|---|---|
| Language | TypeScript 5.9 (strict) |
| Rendering | Phaser 3.90 (MIT), WebGL with canvas fallback |
| Audio | Web Audio API; 15 recorded effects, 2 music loops, synthesised fallback |
| Build | Vite 6; static files, about 5.6 MB (Phaser 1.48 MB, game code 136 kB) |
| Runtime dependencies | Phaser only |
| Tests | Vitest, fast-check, Playwright; Python reference implementation |
| Languages | English, German |

## 2. Architecture [FACT]

Three layers with one-way dependencies:

| Layer | Path | Responsibility |
|---|---|---|
| Engine | `src/engine` (about 1,100 lines) | rules, RNG, round state machine; no browser code; integer money arithmetic |
| Session | `src/session` | balance, bet, history with seed, exact replay; interface `GameService` |
| Client | `src/client` | presentation only: plays the engine's ordered event log |

Consequences: the result of a round is fixed before the first animation starts; speed modes and
skipping cannot change results (tested); every round can be replayed from seed and picks.

## 3. Strengths [FACT]

- Deterministic engine, frozen configuration with SHA-256 hash checked by a test.
- Second, independent implementation produces identical rounds.
- RNG behind an interface; unbiased integer generation.
- Layout is a pure function with 32 tests; effect budget with automatic step-down.
- Production switch: `TLS_PRODUCTION=1` removes fixed seeds, start balance, test speed,
  demonstration, presentation mode and the test hook from the build.

## 4. Weaknesses

| # | Finding | Mark | Severity |
|---|---|---|---|
| T1 | Game logic runs in the player's browser; RNG is statistical, not cryptographic | FACT | blocker for real money, by design for a demo |
| T2 | No server, RGS interface, wallet, sessions, jurisdiction settings | FACT | high |
| T3 | No recovery of an interrupted round (reload starts fresh) | FACT | high for production |
| T4 | Tested in headless Chromium only | FACT | high |
| T5 | Delivery 5.6 MB in one piece, no lazy loading | FACT | medium |
| T6 | Symbols are 256 px raster stills | FACT | medium |
| T7 | Licence notices (MIT, OFL) not bundled with the build | FACT | low, must fix before distribution |
| T8 | Font packages not declared in `package.json` | FACT | low |
| T9 | Package version 0.1.0 vs configuration 1.0.0 | FACT | low |
| T10 | In a production build, unused text strings of the developer tools remain in the bundle (the functions are unreachable) | FACT | low |
| T11 | Single-file build does not open on iPhone | FACT (owner report) | low |
| T12 | No error reporting or telemetry | FACT | medium for production |
| T13 | Whether a partner requires its own client framework | ASSUMPTION: likely for some | unknown |

## 5. Recommendations

1. Keep the engine as the asset to integrate; expect the client to be adapted or rebuilt. [RECOMMENDATION]
2. Before any hand-over: bundle licence notices, align version numbers, build with `TLS_PRODUCTION=1`.
3. Add round recovery only together with a server.
