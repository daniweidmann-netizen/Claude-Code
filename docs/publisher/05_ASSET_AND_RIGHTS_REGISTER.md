# 05 – Asset and Rights Register

Summary in English. The detailed register with every file, prompt and job identifier is `assets/ASSET_REGISTER.md` (German).

> **This is a factual inventory, not a legal opinion.** Where a right has not been verified, it says so. No rights confirmation is claimed that does not exist.

## Status legend

**CLEAR** – origin and licence documented and suitable for commercial use as far as the developer can tell · **UNVERIFIED** – usable in the demo; commercial licence terms not checked · **OPEN** – a known question that needs a decision or legal review.

## 1. Pictures

| Group | Files | Origin | Human rework | Status |
|---|---|---|---|---|
| 9 symbols | `public/symbols/sym0–8.png` | AI-generated (Higgsfield, model `gpt_image_2_6`), account of the owner | none; automatic cut-out and resize only | UNVERIFIED |
| 5 station medallions, tile, spin disc | `public/ui/station*.png`, `tile.png`, `spin.png` | same | none | UNVERIFIED |
| 3 chamber doors (closed and open), treasure, temple gate, play-field frame, Sun Relic artefact (added 25 November 2026) | `public/ui/*.webp` | same; open doors generated with the closed doors as reference | none | UNVERIFIED |
| 4 backgrounds | `public/bg*.webp` | same | none | UNVERIFIED |
| Logo | `public/logo.webp` | same; raster only, no vector | none | UNVERIFIED |
| Effect textures (sparks, glow, rays, coins, shadows) | generated in code at runtime | own work | – | CLEAR |
| Placeholder symbols | drawn in code (`src/client/textures.ts`) | own work | – | CLEAR |

Open points for all AI pictures:

1. **Licence terms.** The provider's help centre states that commercial use is allowed on all plans and that it does not claim ownership of outputs; the full terms were not reviewed, and third-party reporting describes a broad licence the provider retains. Terms of the underlying image model were not reviewed. **OPEN – legal review before any transfer of rights.**
2. **Copyright protection.** Purely AI-generated pictures may not be protected by copyright in important jurisdictions. No human rework has taken place. **OPEN.**
3. **Similarity.** No check against existing games, trademarks or real artefacts. The Explorer is a generated face; resemblance to a real person was not checked. **OPEN.**

## 2. Audio

| Group | Files | Origin | Status |
|---|---|---|---|
| 15 sound effects | `public/audio/*.mp3` | AI-generated (ElevenLabs, `eleven_text_to_sound_v2`), account of the owner; trimmed and normalised automatically | UNVERIFIED |
| 2 music loops | `public/audio/music_*.mp3` | AI-generated (ElevenLabs, `eleven_music_v2`) | UNVERIFIED |
| Fallback tones | synthesised in code | own work | CLEAR |

ElevenLabs' terms for commercial use and sub-licensing were not reviewed. **Nobody has listened to the files yet**; the music may contain vocals although instrumental music was requested. A jungle ambience bed was generated but not shipped (clip too short to loop).

## 3. Fonts

| Font | Use | Licence | Status |
|---|---|---|---|
| Cinzel 700 | titles, figures | SIL Open Font License 1.1 | CLEAR for embedding and commercial use; **the licence text is not yet bundled with the build** |
| Source Sans 3 (400, 600) | body text | SIL Open Font License 1.1 | same |

## 4. Software

| Component | Licence | In the shipped game |
|---|---|---|
| Phaser 3.90.0 | MIT | yes – licence notice must be included in distributions |
| TypeScript 5.9 | Apache-2.0 | no (build tool) |
| Vite 6.4, Vitest 2.1, fast-check 3.23, @types/node | MIT | no (build and test) |
| Playwright | Apache-2.0 | no (test) |
| @fontsource packages | OFL-1.1 (fonts) | font files only |

No copyleft dependency. A third-party licence notice file for Phaser and the two fonts is **not yet in the build**.

## 5. Source code

- Written for this project in one repository (`daniweidmann-netizen/claude-code`, branch `claude/awesome-heisenberg-7vbnfn`); no code copied from other games or from third-party slot frameworks.
- The code was written with an AI coding assistant (Claude) under the direction of the owner. Whether and how AI-assisted code is protected, and who is to be named as author, is a legal question that has **not been reviewed**. **OPEN.**
- There is no contributor other than the owner and the assistant; no employment or contractor relationship that would create third-party claims is known to the developer.
- The repository has no licence file. For a transfer or licence of the IP a written chain of title is needed.

## 6. Name and brand

A web search on 24 November 2026 found no slot titled "Temple of the Lost Sun"; similar titles exist ("Temple of the Sun", "Lost Temple", "Solar Temple", "Aztec Sun"). **No trademark register was searched** (EUIPO, Swiss IGE, USPTO, WIPO). **OPEN.**

## 7. Before due diligence

1. Legal review of the two AI providers' terms and of the code-authorship question.
2. Human rework of the key pictures (symbols, logo) and a vector logo, documented per asset.
3. Trademark search and, if clear, an application.
4. Bundle licence texts (OFL, MIT) with the build.
5. Listen to, select and if needed replace the audio; consider commissioned music with a clean assignment.
