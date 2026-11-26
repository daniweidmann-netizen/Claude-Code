# CLAUDE CODE SOURCE INVENTORY

Date: 26 November 2026 · factual inventory, **no legal conclusions** · generated from the repository; every row is in `MASTER_ASSET_REGISTER.csv`

## Finding

The entire source code was written by an AI coding assistant (Claude Code) on the owner's
instructions between 23 and 26 November 2026. The Git history shows the assistant as author of
every commit except the first (16 June 2026, one README line by the owner). No file was written
or edited by hand by the owner as far as the history shows. No code was copied from other games or
slot frameworks according to the session record; **no similarity scan was run**.

| Item | Evidence | Status |
|---|---|---|
| Authoring tool | Git author and `Co-Authored-By` trailers; session record | documented |
| Model | named in the commit trailers | documented |
| Dates | Git history | documented |
| Subscription | Claude Max per the owner's statement | **not evidenced in the project** |
| Invoice / receipt | none in the project | **MISSING** |
| Prompts / history | complete development session record (outside the repository); Git history | available |
| Licence documentation | Anthropic Consumer Terms of Service for Switzerland, effective 8 October 2025 – read online 25 Nov 2026; **no saved copy**; the repository has no licence file | partly documented |
| Training / data-use setting during development | unknown | **MISSING** |
| Owner's contributions | concept, feature brief, decisions and approvals – documented in the session record | documented |

## What the terms say (read 25 Nov 2026; quotations, not interpretation)

- Claude Max, including Claude Code, falls under the Consumer Terms (Anthropic Legal Center).
- "Subject to your compliance with our Terms, we assign to you all our right, title, and interest (if any) in Outputs."
- "Non-commercial use only. You agree that you will not use our Services for any commercial or business purposes".

## Rights status of all source files

SOURCE VERIFIED · EXCLUSIVITY NOT CONFIRMED · PROVIDER USE NEEDS CLARIFICATION · LEGAL REVIEW REQUIRED.

## Files by group (77 files: the 76 below plus `tools/audit/build_asset_register.py`, the script that builds the register, added on 26 November 2026)

| Group | Files | Lines |
|---|---|---|
| project file | 11 | 31042 |
| game configuration | 2 | 658 |
| data file | 1 | 1 |
| source code - client | 22 | 3608 |
| source code - engine | 10 | 1028 |
| source code - session | 1 | 159 |
| source code - tests | 13 | 989 |
| source code - tools | 16 | 1532 |

## File list

| Path | Group | First commit | Lines |
|---|---|---|---|
| `.gitignore` | project file | 2026-11-23 | 4 |
| `assets/reference/contact_sheet_all.png` | project file | 2026-11-24 | 15775 |
| `assets/reference/ingame_landscape.png` | project file | 2026-11-24 | 9064 |
| `assets/reference/ingame_portrait.png` | project file | 2026-11-24 | 3448 |
| `config/game-config.v1.0.0.json` | game configuration |  | 332 |
| `config/test-feature-rich.json` | game configuration | 2026-11-24 | 326 |
| `index.html` | project file | 2026-11-24 | 24 |
| `package-lock.json` | project file | 2026-11-23 | 2626 |
| `package.json` | project file | 2026-11-23 | 29 |
| `public/ui/frame.json` | data file | 2026-11-25 | 1 |
| `src/client/anim.ts` | source code - client | 2026-11-24 | 10 |
| `src/client/asset.ts` | source code - client | 2026-11-25 | 8 |
| `src/client/audio/sfx.ts` | source code - client | 2026-11-24 | 214 |
| `src/client/env.ts` | source code - client | 2026-11-24 | 21 |
| `src/client/fx.ts` | source code - client | 2026-11-24 | 164 |
| `src/client/i18n.ts` | source code - client | 2026-11-24 | 119 |
| `src/client/layout.ts` | source code - client | 2026-11-24 | 117 |
| `src/client/main.ts` | source code - client | 2026-11-24 | 38 |
| `src/client/perf.ts` | source code - client | 2026-11-24 | 44 |
| `src/client/presentation/presenter.ts` | source code - client | 2026-11-24 | 330 |
| `src/client/rules-text.ts` | source code - client | 2026-11-24 | 223 |
| `src/client/scenes/game-scene.ts` | source code - client | 2026-11-24 | 542 |
| `src/client/textures.ts` | source code - client | 2026-11-24 | 94 |
| `src/client/theme.ts` | source code - client | 2026-11-24 | 22 |
| `src/client/timing.ts` | source code - client | 2026-11-25 | 64 |
| `src/client/ui/info-panel.ts` | source code - client | 2026-11-24 | 100 |
| `src/client/views/bonus-view.ts` | source code - client | 2026-11-24 | 249 |
| `src/client/views/button.ts` | source code - client | 2026-11-24 | 112 |
| `src/client/views/grid-view.ts` | source code - client | 2026-11-24 | 356 |
| `src/client/views/hud.ts` | source code - client | 2026-11-24 | 336 |
| `src/client/views/overlays.ts` | source code - client | 2026-11-24 | 210 |
| `src/client/views/track-view.ts` | source code - client | 2026-11-24 | 235 |
| `src/engine/clusters/clusters.ts` | source code - engine | 2026-11-23 | 57 |
| `src/engine/config/candidate-config.ts` | source code - engine | 2026-11-23 | 64 |
| `src/engine/config/default-config.ts` | source code - engine | 2026-11-23 | 99 |
| `src/engine/config/types.ts` | source code - engine | 2026-11-23 | 89 |
| `src/engine/config/validate.ts` | source code - engine | 2026-11-23 | 80 |
| `src/engine/grid/grid.ts` | source code - engine | 2026-11-23 | 40 |
| `src/engine/index.ts` | source code - engine | 2026-11-23 | 9 |
| `src/engine/rng/rng.ts` | source code - engine | 2026-11-23 | 119 |
| `src/engine/round/events.ts` | source code - engine | 2026-11-23 | 41 |
| `src/engine/round/round.ts` | source code - engine | 2026-11-23 | 430 |
| `src/session/game-service.ts` | source code - session | 2026-11-24 | 159 |
| `tests/integration/cluster-rule.test.ts` | source code - tests | 2026-11-25 | 59 |
| `tests/integration/round.test.ts` | source code - tests | 2026-11-23 | 185 |
| `tests/integration/session.test.ts` | source code - tests | 2026-11-24 | 94 |
| `tests/property/round.property.test.ts` | source code - tests | 2026-11-23 | 72 |
| `tests/support/scripted-rng.ts` | source code - tests | 2026-11-23 | 36 |
| `tests/support/verify-events.ts` | source code - tests | 2026-11-23 | 119 |
| `tests/unit/frozen-config.test.ts` | source code - tests | 2026-11-24 | 23 |
| `tests/unit/grid-clusters.test.ts` | source code - tests | 2026-11-23 | 114 |
| `tests/unit/layout.test.ts` | source code - tests | 2026-11-24 | 82 |
| `tests/unit/perf.test.ts` | source code - tests | 2026-11-24 | 30 |
| `tests/unit/rng.test.ts` | source code - tests | 2026-11-23 | 71 |
| `tests/unit/rules-text.test.ts` | source code - tests | 2026-11-24 | 71 |
| `tests/unit/timing.test.ts` | source code - tests | 2026-11-25 | 33 |
| `tools/assets/audio.sh` | source code - tools | 2026-11-25 | 19 |
| `tools/assets/process.py` | source code - tools | 2026-11-24 | 110 |
| `tools/build-single.cjs` | source code - tools | 2026-11-25 | 50 |
| `tools/e2e/final.cjs` | source code - tools | 2026-11-25 | 161 |
| `tools/e2e/resilience.cjs` | source code - tools | 2026-11-25 | 82 |
| `tools/e2e/smoke.cjs` | source code - tools | 2026-11-24 | 197 |
| `tools/e2e/soak.cjs` | source code - tools | 2026-11-25 | 47 |
| `tools/e2e/timing.cjs` | source code - tools | 2026-11-25 | 111 |
| `tools/exploration/first_drop_cluster_frequency.py` | source code - tools | 2026-11-23 | 27 |
| `tools/reference/diff.sh` | source code - tools | 2026-11-24 | 17 |
| `tools/reference/reference_engine.py` | source code - tools | 2026-11-24 | 277 |
| `tools/sim/bonus-math.ts` | source code - tools | 2026-11-23 | 63 |
| `tools/sim/cli.ts` | source code - tools | 2026-11-23 | 166 |
| `tools/sim/core.ts` | source code - tools | 2026-11-23 | 136 |
| `tools/sim/dump.ts` | source code - tools | 2026-11-24 | 23 |
| `tools/sim/extra-stats.ts` | source code - tools | 2026-11-25 | 46 |
| `tsconfig.build.json` | project file | 2026-11-23 | 14 |
| `tsconfig.client.json` | project file | 2026-11-24 | 15 |
| `tsconfig.json` | project file | 2026-11-23 | 23 |
| `vite.config.ts` | project file | 2026-11-24 | 20 |

Documentation written by the same assistant: 113 files (documents, simulation reports, archives); listed in the CSV.

Animations: there are no animation files. All motion is produced by code in `src/client` (tweens and particles).
Icons: there are no icon files or icon libraries. Button symbols are drawn in code or are images listed in `HIGGSFIELD_ASSET_INVENTORY.md`.

## Needs written clarification from Anthropic

Whether developing a commercially planned game under a Max subscription in Switzerland is permitted given the non-commercial clause · the effect on outputs already produced · which plan to use going forward · the data-use setting during 23–26 November 2026.
