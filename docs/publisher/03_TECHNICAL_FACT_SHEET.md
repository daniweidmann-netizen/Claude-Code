# 03 – Technical Fact Sheet

## Stack

| Layer | Technology | Version | Licence |
|---|---|---|---|
| Language | TypeScript (strict) | 5.9 | Apache-2.0 |
| Game engine (client rendering) | Phaser 3, WebGL with Canvas fallback | 3.90.0 | MIT |
| Build | Vite | 6.4 | MIT |
| Tests | Vitest, fast-check | 2.1 / 3.23 | MIT |
| Browser tests | Playwright (Chromium) | system install | Apache-2.0 |
| Simulation | Node.js 22 worker threads; Python 3 reference implementation | – | – |

The math engine has **no runtime dependency**. The shipped client depends on Phaser only.

## Architecture

```
client (Phaser)      views · presenter · effects · audio · info panel      src/client   3,100 lines
        │ reads only an ordered event log
session              GameService interface · LocalGameService (demo)        src/session    160 lines
        │
engine (pure TS)     config · rng · grid · clusters · round state machine   src/engine   1,030 lines
tools                simulator · Python reference · browser tests · assets  tools          ~1,100 lines
tests                unit · property · integration                          tests          ~900 lines
```

Separation that matters for an integration:

- **Rules, RNG, math and round state** live in `src/engine`. It has no DOM, no Phaser and no clock; a round is a function of (configuration, RNG sequence, player picks).
- **Presentation** never computes an outcome. It replays the event log; a check in the client counts any frame where the drawn grid differs from the log (must be 0, enforced in browser tests).
- **Session layer** is the seam for a remote game server: `LocalGameService` (demo, play money) can be replaced by a remote implementation of the same interface. Closed chambers' prizes are not sent to the client before the pick (tested).
- **Configuration** is data (`config/game-config.v1.0.0.json`), validated on load, hash-checked by a test.
- **Money** is integer arithmetic throughout (wins in hundredths of the bet, balances in minor currency units).

## Integration contract (summary)

```ts
interface Rng { nextInt(n: number): number }          // uniform in [0, n)

round.start() | round.startBought()                    // plays until done or until a chamber pick is needed
round.pick(chamber)                                    // continues
round.events: GameEvent[]                              // ordered log: gridFilled, clustersWon, trackAdvanced, …, roundEnded
round.totalWin, round.capped, round.done
```

Event types and their fields are defined in `src/engine/round/events.ts`. The same log drives the demo client, the round replay and the independent verifier.

## Delivery sizes (current build)

| Part | Size |
|---|---|
| Game code | 0.12 MB (38 kB gzip) |
| Phaser | 1.48 MB (340 kB gzip) |
| Pictures (WebP/PNG) | 2.5 MB |
| Audio (17 MP3 files) | 1.6 MB, loaded after the first user gesture |
| Fonts (WOFF2) | 0.09 MB |
| **Total** | **about 5.6 MB** |

## Display

Responsive layout computed for portrait and landscape; rendering at device resolution up to pixel ratio 2; minimum touch target 44 CSS px (tested); reduced-motion mode follows the system setting; effect level steps down automatically when the measured frame rate drops and can be set by the player.

## What is not there

- No remote game server, no wallet integration, no jurisdiction-specific features (reality check, session limits, game history API, RTP switching).
- No recovery of an interrupted round in the client (the engine's round state is serialisable in principle; not implemented in the demo).
- No telemetry, no localisation beyond English and German.
- Tested in Chromium only; see document 06.
