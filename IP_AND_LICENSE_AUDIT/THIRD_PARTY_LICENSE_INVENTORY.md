# THIRD-PARTY LICENSE INVENTORY

Date: 26 November 2026 · factual inventory, **no legal conclusions** · versions from
`package-lock.json` and installed packages; licence files inspected in the packages

## 1. Shipped with the game

| Component | Version | Licence | Licence file seen | Notice bundled with the build | Rights status |
|---|---|---|---|---|---|
| Phaser | 3.90.0 | MIT – "Copyright (c) 2024 Richard Davey, Phaser Studio Inc." | yes (`LICENSE.md` in the package) | **no** | SOURCE VERIFIED · COMMERCIAL USE CONFIRMED · SUBLICENSING CONFIRMED · EXCLUSIVITY NOT CONFIRMED |
| eventemitter3 (inside Phaser) | 5.0.4 | MIT | per lock file | **no** | same |
| Font Cinzel 700 – `public/fonts/cinzel-latin-700-normal.woff2`, `cinzel-latin-ext-700-normal.woff2` | from @fontsource/cinzel 5.3.0 | SIL Open Font License 1.1 | yes (`LICENSE` in the package) | **no** | SOURCE VERIFIED · COMMERCIAL USE CONFIRMED · redistribution under the same licence (the font may not be sold by itself) · EXCLUSIVITY NOT CONFIRMED |
| Font Source Sans 3 – `source-sans-3-latin-400-normal.woff2`, `-latin-600-normal.woff2`, `-latin-ext-600-normal.woff2` | from @fontsource/source-sans-3 5.3.1 | SIL OFL 1.1 | yes | **no** | same |

"EXCLUSIVITY NOT CONFIRMED" is inherent here: these are open licences available to everyone.

## 2. Development and test tools (not shipped)

| Tool | Version | Licence |
|---|---|---|
| TypeScript | 5.9.3 | Apache-2.0 |
| Vite | 6.4.6 | MIT |
| esbuild / Rollup (via Vite) | 0.25.12 / 4.68.8 | MIT |
| Vitest | 2.1.9 | MIT |
| fast-check | 3.23.2 | MIT |
| @types/node | 22.x | MIT |
| Playwright (pre-installed in the work environment, not in `package.json`) | 1.63.0 | Apache-2.0 |
| Pillow (Python, image processing) | 13.0.0 | MIT-CMU |
| FFmpeg (audio processing) | 6.1.1 | LGPL/GPL depending on build – used as a tool, not distributed |

All 154 packages in `package-lock.json`: 149 MIT, 2 Apache-2.0, 2 ISC, 1 BSD-3-Clause.
No GPL, LGPL or AGPL package.

## 3. Not present

No icon library, no audio library, no stock images, no stock music, no third-party game or slot
framework, no code from other games (per the session record; no similarity scan was run).

## 4. Open points

1. Licence notices (MIT for Phaser and eventemitter3, OFL for both fonts) are not yet in the build.
2. The font packages are not declared in `package.json`; the font files were copied into `public/fonts`.
3. No automated licence scan report and no code-similarity scan exist as stand-alone evidence.
