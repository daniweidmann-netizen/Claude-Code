# UNKNOWN ASSET ORIGINS

Date: 26 November 2026 · factual inventory, no legal conclusions

## 1. Assets with unknown origin

**None found in the repository.** Every one of the 314 files listed in the register and both shipped libraries
was matched to a source:

| Group | Files | How the origin is established |
|---|---|---|
| Raw images | 37 | embedded Higgsfield job ID and OpenAI-signed record in each file |
| Shipped images | 31 | produced from a named raw file by `tools/assets/process.py` |
| Screenshots in `docs/polish` | 8 | taken from the running demo by automated tests |
| Raw audio | 18 | embedded ElevenLabs-signed record in each file |
| Shipped audio | 17 | produced from a named raw file by `tools/assets/audio.sh` |
| Fonts | 5 | npm packages with SIL OFL 1.1 |
| Source code, configuration, tests, tools | 77 | Git history, development session record |
| Documents, reports, archives | 121 | Git history |
| Libraries | 2 | `package-lock.json` |

Not present at all: voice recordings, video files, icon sets, animation files, stock media.

## 2. Unverified statements – things the repository cannot confirm

| # | Statement or gap | Why it matters | Who can resolve |
|---|---|---|---|
| U1 | The owner recalls using **"OpenAI / ChatGPT for some graphics"**. No file in the repository was generated directly with ChatGPT; all images trace to Higgsfield jobs (which used an OpenAI model) | if ChatGPT images exist outside the repository (concept art, icons, social media, earlier drafts), they are not inventoried and fall under different terms | owner |
| U2 | Subscription plans: Claude Max is the owner's statement; Higgsfield "basic" and ElevenLabs "creator" are single account queries | no invoice or contract evidence in the project | owner |
| U3 | Account holders of the three service accounts | determines the contracting party | owner |
| U4 | Which model variant stands behind the platform identifier `gpt_image_2_6` | determines the applicable model terms | Higgsfield |
| U5 | Training / data-use settings at all three services during development | affects confidentiality and exclusivity statements | owner; providers |
| U6 | Whether anything connected with the project was created outside the documented session of 23–26 November 2026 | completeness of this inventory | owner |
| U7 | The demo page hosted outside the repository contains the same files as `dist-client`; no other assets are known | completeness | owner |
| U8 | The embedded provenance records were read but not cryptographically validated | strength of the evidence | anyone with a C2PA verification tool |
| U9 | The development session record – the only place with the full prompts – is stored in the work environment, not in the repository | it can be lost | owner |

## 3. How to add an asset here

If an asset is found whose origin cannot be shown, record: path, what it is, where it is used, what
is known, what is missing – and mark it ORIGIN UNKNOWN in `MASTER_ASSET_REGISTER.csv`. Do not use
it in presentation material until the origin is established.
