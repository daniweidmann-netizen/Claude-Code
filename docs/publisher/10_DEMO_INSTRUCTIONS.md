# 10 – Demo Instructions

The demo uses play money. Outcomes are decided by the engine before they are shown.

## Run it

```
npm install
npm run dev                      # development server; open the printed address
# or
npm run build:client && npx vite preview --port 4173
```

A hosted private demo page exists for the owner; access is granted by the owner.

## Controls

| Control | Action |
|---|---|
| Sun disc | Spin; during a round: speed up |
| − / + or tap the bet amount | Change the bet (0.20 to 10.00) |
| AUTO | Up to 10 rounds; tap again to stop |
| BUY EXPEDITION | Free spins for 58× bet, after confirmation |
| Speaker | Mute |
| i | Rules, paytable, history with replay, performance, settings (volume, effects, language) |
| Space bar | Spin / speed up (desktop) |

## Presentation mode

`?demo=1` (or **i → Settings → Start demonstration**) plays four prepared rounds one after another:

| Step | Seed | Shows | Round win |
|---|---|---|---|
| 1 | 5 | win, two cascades, Discovery and Treasure | 2.20× bet |
| 2 | 57 | six cascades, expedition up to the Relic, growing multiplier | 11.30× bet |
| 3 | 697 | three Compasses, 8 free spins, Base Camp, sun bonus, summary | 38.80× bet |
| 4 | 1168 | the expedition reaches the Temple: Temple Bonus with three chambers | 42.30× bet |

- A gold label «DEMONSTRATION n/4» stays on screen the whole time.
- The rounds are **not staged**: each is computed by the engine from its seed, on the same path as a
  history replay. The seeds were found by searching ordinary results of configuration 1.0.0. They are
  **selected examples and not typical**: most rounds win nothing (hit rate 32.8 %).
- Balance and history are not touched. Afterwards normal demo play continues.
- The speed selector works during the demonstration; for a talk, Normal is recommended.
- **End demonstration** in the settings stops after the current round.

## Presentation mode for the Temple Bonus

**i → Settings → Start presentation mode (Temple Bonus)**, or the address parameter `?present=temple`.
Every spin then uses the same fixed seed (1168), whose ordinary result reaches the Temple, so the
complete Temple Bonus – including your own chamber pick – can be shown on demand. A gold label
"PRESENTATION MODE · FIXED SEED · VIRTUAL CREDITS" stays on screen. The engine, its configuration
and all probabilities are untouched; the mode runs in a separate session with virtual credits and
exists only in the demo build. A production build (`TLS_PRODUCTION=1 npx vite build`) contains no
developer tools: no fixed seeds, no demonstration, no presentation mode, no test hook.

## Useful addresses for a presentation

Add these to the address. They are for demonstration and testing only.

| Parameter | Effect |
|---|---|
| `?seed=1168` | Deterministic rounds; the first spin of this seed reaches the Temple and opens the Temple Bonus |
| `?seed=7` then BUY EXPEDITION | A free-spin feature from a fixed seed |
| `?lang=de` | German interface |
| `?motion=reduced` | Reduced-motion mode |
| `?fast=2` | Double presentation speed |
| `?balance=1000000` | Starting balance in minor units |
| `?art=placeholder` | Code-drawn placeholder symbols instead of the art set |

With a `seed` parameter the start screen is skipped and every round is reproducible.

## What to look at

1. The line under the medallions: it always names the next station.
2. A spin that reaches Treasure or further: station gestures, beam into the grid, multiplier.
3. Free spins: Base Camp flag, sun bonus in the multiplier, summary at the end.
4. Temple Bonus: rule text, door opening, the other chambers afterwards.
5. **i → History → Replay**: the same round again from its seed.
6. **i → Performance** after 20 rounds: frame rate on your device.

## Known limitations of the demo

Tested in Chromium only. No real-money functions, no server. Audio has not been reviewed by ear.
