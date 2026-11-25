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
