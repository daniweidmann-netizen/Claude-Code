# SOFTWARE LICENSE AUDIT

Date: 25 November 2026 · not legal advice

## 1. In the shipped game [FACT – licence files inspected]

| Component | Version | Licence | Commercial use | Copyleft | Obligation |
|---|---|---|---|---|---|
| Phaser | 3.90.0 | MIT | yes | no | include copyright and licence notice |
| eventemitter3 (inside Phaser) | 5.0.4 | MIT | yes | no | same |
| Font Cinzel 700 | from @fontsource/cinzel 5.3.0 | SIL OFL 1.1 | yes, embedding allowed | font only | include licence text; do not sell the font alone |
| Font Source Sans 3 (400, 600) | from @fontsource/source-sans-3 5.3.1 | SIL OFL 1.1 | yes | font only | same |

## 2. Tools only, not shipped [FACT]

TypeScript 5.9.3 (Apache-2.0) · Vite 6.4.6, esbuild, Rollup (MIT) · Vitest 2.1.9, fast-check 3.23.2
(MIT) · Playwright 1.63.0 (Apache-2.0) · Pillow 13.0.0 (MIT-CMU) · FFmpeg 6.1.1 (LGPL/GPL, used as
a tool; its licence does not attach to the processed audio).

Lock file: 154 packages – 149 MIT, 2 Apache-2.0, 2 ISC, 1 BSD-3-Clause. **No GPL, LGPL or AGPL.**

## 3. Source code of the game

Written entirely by an AI coding assistant on the owner's instructions; no code taken from other
games or slot frameworks (statement from the development session; **no similarity scan run**).

Applicable terms (READ on anthropic.com, 25 Nov 2026): Claude Max, including Claude Code, falls
under the **Consumer Terms**. The version for Switzerland (effective 8 October 2025, contracting
party Anthropic Ireland, Limited) states:
- "Subject to your compliance with our Terms, we assign to you all our right, title, and interest
  (if any) in Outputs."
- "**Non-commercial use only.** You agree that you will not use our Services for any commercial or
  business purposes".
- No IP indemnity for consumers; training on user data unless opted out.

The usage policy contains no restriction on gambling software.

## 4. Assessment

| Question | Assessment |
|---|---|
| Does a third-party licence block publication, source hand-over or an IP sale? | No |
| Is the commercial development covered by the applicable Anthropic terms? | **UNRESOLVED – LEGAL REVIEW REQUIRED** (non-commercial clause) |
| Is the code protected by copyright, and who is the author? | UNRESOLVED under Swiss law (author must be a human) |
| Formal defects | licence notices not bundled; font packages not declared in `package.json` |

## 5. Unresolved items

UNRESOLVED: Anthropic's written position on commercial use under Max and on past outputs · training
setting during development · subscription evidence · similarity scan · bundling of notices.
