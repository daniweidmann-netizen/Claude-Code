# PROVIDER DEMO GUIDE

Date: 25 November 2026 · how to show the game in a meeting (about 8 minutes)

## Before the meeting
- Use the hosted demo link on a phone and a laptop; test both on the day.
- Sound on, speed Normal, language English (`?lang=en`).
- The single-file version does not open on iPhone – use the link.
- Have the one-pager and the four statements of section "Say it first" ready.

## Three ways to show features

| Mode | Address | What it does | Label on screen |
|---|---|---|---|
| Normal demo play | (no parameter) | random rounds with play money | DEMO PLAY |
| Demonstration | `?demo=1` or **i → Settings → Start demonstration** | four prepared rounds in a row: cascade, long expedition, Free Spins, Temple Bonus; balance and history untouched | DEMONSTRATION n/4 |
| **Presentation mode** | **i → Settings → Start presentation mode (Temple Bonus)**, or `?present=temple` | every spin is the same prepared round that reaches the Temple, so the **complete Temple Bonus can be shown on demand – with your own chamber pick** | PRESENTATION MODE · FIXED SEED · VIRTUAL CREDITS |

What presentation mode is and is not:
- It uses the real game engine and the real Temple Bonus with all animations and sounds.
- Only the seed is fixed instead of random. Probabilities, RTP and payouts are untouched.
- Credits are virtual. Nothing is stored; the demo keeps no gameplay statistics that could be contaminated.
- It never starts by itself: only through the Settings switch or the address parameter, only in the demo build.
- Switching it on starts a separate session with its own virtual credits; switching it off starts a fresh normal session.
- A production build (`TLS_PRODUCTION=1`) contains neither this mode nor the demonstration, the
  fixed seeds or the test hook.

## Suggested run

| Min | Step | Say |
|---|---|---|
| 0–1 | Title screen, START | name and tagline |
| 1–3 | Normal play, five or six spins | cluster rule, cascades, steps on the track; most spins win nothing – that is the real distribution |
| 3–5 | Demonstration, steps 1–3 | Discovery, Treasure, Explorer, Sun Relic; Free Spins from Base Camp |
| 5–7 | Presentation mode | reach the Temple, let the guest choose a chamber, show the reveal |
| 7–8 | **i → Rules / History** | transparency: every round can be replayed from its seed |

## Say it first
1. The prepared rounds are selected examples from fixed seeds, not typical rounds.
2. All figures are internal simulations; nothing is certified.
3. Art and audio are AI-generated; their rights for commercial real-money use are being clarified.
4. This is a demo client; server integration is not built.

## If something goes wrong
Reload the page – a round is not resumed, the demo starts fresh. If audio is muted, tap the
speaker icon; browsers start sound only after the first tap.
