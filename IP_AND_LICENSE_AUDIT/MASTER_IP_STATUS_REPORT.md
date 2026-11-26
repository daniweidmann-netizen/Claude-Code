# MASTER IP STATUS REPORT

**TEMPLE OF THE LOST SUN** · date: 26 November 2026
Complete asset-origin and rights inventory for a possible publishing partnership or IP sale.

> This report states facts and documented terms. **It draws no legal conclusions.** Status labels
> describe what is documented, not what is legally valid. Platform terms are not treated as
> overriding the restrictions of an underlying model provider. No file of the game was modified,
> deleted, replaced or regenerated for this inventory; source code, mathematics and configuration
> are unchanged.

## 1. Scope

Register: `MASTER_ASSET_REGISTER.csv` – one row per file in the repository plus the two libraries
shipped with the game (316 rows). Built by `tools/audit/build_asset_register.py` from embedded
provenance records, Git history and file contents.

| Asset class | Count | Inventory |
|---|---|---|
| Images shipped with the game | 31 | `HIGGSFIELD_ASSET_INVENTORY.md`, `OPENAI_ASSET_INVENTORY.md` |
| Raw image generations (incl. 6 unused variants) | 37 | same |
| Sound effects shipped | 15 | `ELEVENLABS_AUDIO_INVENTORY.md` |
| Music loops shipped | 2 | same |
| Raw audio generations | 18 | same |
| Voice recordings | 0 | – |
| Animation files | 0 (all motion is code) | `CLAUDE_CODE_SOURCE_INVENTORY.md` |
| Icon files or icon libraries | 0 | – |
| Fonts | 5 files, 2 families | `THIRD_PARTY_LICENSE_INVENTORY.md` |
| External libraries shipped | 2 | same |
| Source code, configuration, tests, tools | 77 files | `CLAUDE_CODE_SOURCE_INVENTORY.md` |
| Documents, reports, archives, screenshots | 129 files | CSV |

## 2. Which assets have documented origins

**All of them.** No asset of unknown origin was found.

| Asset group | Generator / source | Evidence |
|---|---|---|
| All images | Higgsfield platform, model identifier `gpt_image_2_6`; executing model by OpenAI ("gpt-image") | job ID and OpenAI-signed record embedded in each raw file; session record |
| All audio | ElevenLabs, `eleven_text_to_sound_v2` and `eleven_music_v2` | ElevenLabs-signed record embedded in each raw file; session record |
| All source code and documents | AI coding assistant Claude Code, directed by the owner | Git history; session record |
| Fonts, libraries | third parties | licence files |

One of the owner's recollections is **not** supported by the project: no image was generated
directly with ChatGPT or an OpenAI account. OpenAI's model was used through Higgsfield
(`UNKNOWN_ASSET_ORIGINS.md`, item U1).

## 3. Rights status by asset group

| Asset group | SOURCE VERIFIED | COMMERCIAL USE CONFIRMED | SUBLICENSING CONFIRMED | EXCLUSIVITY NOT CONFIRMED | PROVIDER USE NEEDS CLARIFICATION | LEGAL REVIEW REQUIRED | ORIGIN UNKNOWN |
|---|---|---|---|---|---|---|---|
| Images (31 shipped, 37 raw) | ✔ | – ¹ | – ² | ✔ | ✔ | ✔ | – |
| Sound effects (15) | ✔ | – ³ | – | ✔ | ✔ | ✔ | – |
| Music loops (2) | ✔ | – ³ ⁴ | – | ✔ | ✔ | ✔ | – |
| Source code, configuration, documents | ✔ | – ⁵ | – | ✔ | ✔ | ✔ | – |
| Phaser, eventemitter3 (MIT) | ✔ | ✔ | ✔ | ✔ (open licence) | – | – | – |
| Fonts (SIL OFL 1.1) | ✔ | ✔ | redistribution under the same licence | ✔ (open licence) | – | – | – |

¹ Higgsfield's terms do not restrict commercial use, but they bind the user to the model
provider's policies, which list "real money gambling" as a use that is not permitted. Commercial
use in the intended product is therefore not confirmed.
² Higgsfield's terms permit transfer and sublicence of rights in outputs; not confirmed against
the model provider's terms.
³ ElevenLabs permits commercial use on a paid plan, subject to its Prohibited Use Policy, which
lists "Operating or facilitating real-money gambling" and applies to outputs.
⁴ The Music Terms exclude "Studio Games" on self-serve plans.
⁵ The applicable Anthropic Consumer Terms for Switzerland contain "Non-commercial use only".

## 4. Which assets have documented commercial permissions

Without reservation: **only** the third-party software (Phaser, eventemitter3) and the two fonts.

With a documented general permission but an open question for this product: images (platform
terms) and audio (paid plan).

Without documented permission for commercial use: source code and documents.

## 5. Which assets require written clarification

| Assets | From | Question |
|---|---|---|
| All 31 shipped images | Higgsfield (and through it the model provider) | use as artwork of a real-money gambling product; model variant and its terms; whether transfer and sublicence hold for that model |
| All 17 audio files | ElevenLabs | use in a real-money slot; distribution by a third-party provider; sublicence and transfer inside a game |
| The 2 music loops | ElevenLabs | whether the game counts as a "Studio Game" and which plan is needed |
| All source code | Anthropic | commercial development under a Max subscription in Switzerland; effect on existing outputs |

## 6. Which assets may need replacement

Depends on the answers above; listed by how exposed they are and how easily they can be replaced.

| Assets | Why replacement may be needed | Effort |
|---|---|---|
| 2 music loops | plan restriction for games plus the gambling clause | low – commissioned music |
| 15 sound effects | gambling clause | low – commissioned sound design; synthetic fallback exists in code |
| Logo | AI-generated raster image; exclusivity not confirmed; relevant for a trade mark | low – human-drawn vector logo |
| 9 symbols, 5 medallions, Sun Relic, 6 doors, 4 backgrounds, frame, tile, spin disc, gate, treasure | gambling reservation; exclusivity not confirmed | medium to high – commissioned art, or supplied by the provider |
| Source code | cannot be "replaced" like an asset; the question is contractual | clarification first |

No asset was replaced or changed as part of this inventory.

## 7. What evidence is missing

1. Invoices for all three subscriptions for November 2026.
2. Saved copies of the terms in force on the generation dates.
3. An archived copy of the development session record (it holds the full prompts).
4. Screenshots of training / data-use settings.
5. Generation-history exports from Higgsfield and ElevenLabs.
6. Written answers from the providers.
7. The owner's confirmation whether ChatGPT was used for anything connected with the project.
8. Validation of the embedded provenance signatures; similarity checks; trade-mark search.

Full list: `EVIDENCE_AND_DOCUMENTATION_CHECKLIST.md`.

## 8. Sources of the quoted terms

Read on the official pages on 25 November 2026 (no saved copies exist yet): Anthropic Consumer
Terms of Service for Switzerland (effective 8 October 2025) and Legal Center; ElevenLabs Terms of
Use EU, Prohibited Use Policy (last updated 9 October 2026), Creative Terms, Music Terms;
Higgsfield Terms of Use (last updated 23 October 2026); OpenAI Usage Policies (effective
20 November 2026). Other provider documents were seen as search-result excerpts only and are not
relied on here.

## 9. Related documents in this folder

English inventories created with this report: `MASTER_ASSET_REGISTER.csv`,
`OPENAI_ASSET_INVENTORY.md`, `HIGGSFIELD_ASSET_INVENTORY.md`, `ELEVENLABS_AUDIO_INVENTORY.md`,
`CLAUDE_CODE_SOURCE_INVENTORY.md`, `THIRD_PARTY_LICENSE_INVENTORY.md`, `UNKNOWN_ASSET_ORIGINS.md`,
`EVIDENCE_AND_DOCUMENTATION_CHECKLIST.md`.
Earlier German audit (terms in detail, Swiss copyright, trade mark, questions to providers):
`MASTER_IP_AND_LICENSE_REPORT.md` and the other files of this folder.
