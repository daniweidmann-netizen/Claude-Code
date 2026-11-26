# EVIDENCE AND DOCUMENTATION CHECKLIST

Date: 26 November 2026 · what exists as evidence and what is missing. Keep personal documents
(invoices, account pages) **outside** the repository.

## 1. Evidence that exists

| Evidence | Where | Covers |
|---|---|---|
| Embedded Higgsfield job ID in 37 raw images | `assets/reference/raw/*.png` | platform and job |
| Embedded OpenAI-signed provenance record in 37 raw images | same | executing model, time of creation, AI-generated |
| Embedded ElevenLabs-signed provenance record in 18 raw audio files | `assets/audio/raw/*.mp3` | service, AI-generated |
| Asset register with job IDs and prompt summaries | `assets/ASSET_REGISTER.md` | each asset |
| Processing scripts | `tools/assets/process.py`, `tools/assets/audio.sh` | raw file → shipped file |
| Git history | repository | dates and author of every file |
| File checksums | `MASTER_ASSET_REGISTER.csv` | integrity |
| Licence files of Phaser and the fonts | npm packages | MIT, OFL |
| Account queries (plan names) | development session record | Higgsfield "basic" (24 Nov), ElevenLabs "creator" (25 Nov) |
| Full prompts and all generation calls | development session record (**outside the repository**) | 42 image calls, 22 audio calls |
| Owner's listening review and iPhone test | owner's statements of 25 Nov 2026 | quality, not rights |

## 2. Evidence that is missing

| # | Missing | From whom | Priority |
|---|---|---|---|
| 1 | Invoice or receipt for Claude Max covering 23–26 November 2026 | owner | high |
| 2 | Invoice or receipt for ElevenLabs covering 25 November 2026 | owner | high |
| 3 | Invoice or receipt for Higgsfield covering 24–25 November 2026 | owner | high |
| 4 | Saved copies (PDF with date) of the terms in force on the generation dates: Anthropic Consumer Terms (Switzerland); ElevenLabs Terms of Use EU, Prohibited Use Policy, Creative Terms, Music Terms; Higgsfield Terms of Use; the model provider's usage policies | owner | high |
| 5 | Archived copy of the development session record | owner | high |
| 6 | Screenshots of the training / data-use settings in all three accounts | owner | high |
| 7 | Export of the generation history at Higgsfield (37 job IDs) and ElevenLabs (22 requests) | owner | medium |
| 8 | Written answers from Anthropic, ElevenLabs and Higgsfield to the open questions | providers | high |
| 9 | Confirmation whether ChatGPT was used for any project-related image | owner | medium |
| 10 | Cryptographic validation of the embedded provenance records | technical | low |
| 11 | Licence notices bundled with the build | developer | medium |
| 12 | Similarity checks for images, music and code | service provider | medium |
| 13 | Trade-mark search | attorney | medium |
| 14 | Written chain-of-title statement – only after legal review | owner with lawyer | later |

## 3. Suggested evidence folder (outside the repository)

```
evidence/
  invoices/        anthropic_2026-11.pdf  elevenlabs_2026-11.pdf  higgsfield_2026-11.pdf
  terms/           one PDF per document, file name with provider and date
  settings/        screenshots of data-use settings, dated
  history/         exports of generation history
  session/         copy of the development session record
  correspondence/  enquiries and answers
```
