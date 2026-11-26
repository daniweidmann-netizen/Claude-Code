# ELEVENLABS AUDIO INVENTORY

Date: 26 November 2026 · factual inventory, **no legal conclusions** · generated from the repository; every row is in `MASTER_ASSET_REGISTER.csv`

## Finding

All audio was generated with ElevenLabs on 25 November 2026 through its connector in the
development tool (22 generation calls). Every raw file carries an embedded C2PA record issued by
"Eleven Labs Inc.". **No voice recordings, no voices, no voice cloning, no Voice Library content
and no uploads were used.**

| Item | Evidence | Status |
|---|---|---|
| Service and models | session record: `eleven_text_to_sound_v2` (effects), `eleven_music_v2` (music) | documented |
| Generation date | session record: 25 Nov 2026, 05:58–05:59 and 07:23 UTC | documented |
| Provenance | embedded record in all 18 raw files (read, not cryptographically validated) | documented |
| Subscription | account query 25 Nov 2026: tier "creator", status "active", monthly | snapshot only |
| Invoice / receipt | none in the project | **MISSING** |
| Prompts | development session record; summaries in `assets/ASSET_REGISTER.md` | available, not archived in the repository |
| Generation history export | none | **MISSING** |
| Licence documentation | Terms of Use EU, Prohibited Use Policy ("Last Updated: 09 October 2026"), Creative Terms, Music Terms – read online 25 Nov 2026; **no saved copies** | partly documented |
| Processing | automatic trim, loudness, re-encode (`tools/assets/audio.sh`) | documented |
| Listening review | owner, 25 Nov 2026: "The music and the sounds sound good and fit the slot." | documented |

## What the terms say (read 25 Nov 2026; quotations, not interpretation)

- "as between you and ElevenLabs, you retain all rights in and to your Output."
- Paid plan: "you may use the Services for commercial purposes, but … your access and use of the Services and any Output must still comply with the Prohibited Use Policy."
- Prohibited Use Policy: "You may not use our Services to engage in or contribute to … restricted activities … This includes: … Operating or facilitating real-money gambling".
- Licence to ElevenLabs over user content: "perpetual and irrevocable", "nonexclusive", "worldwide", "sub-licensable".
- Creative Terms: output may be incorporated into "games, applications, and other productions"; it may not be sold, licensed or sublicensed "on a standalone basis".
- Music Terms, self-serve plans: "All online and offline commercial use permitted, except film, TV, radio, and Studio Games".

## Rights status of all audio

SOURCE VERIFIED · EXCLUSIVITY NOT CONFIRMED · PROVIDER USE NEEDS CLARIFICATION · LEGAL REVIEW REQUIRED.
Not assigned: COMMERCIAL USE CONFIRMED (general commercial use is permitted on a paid plan, but
use in a real-money gambling product is not cleared) and SUBLICENSING CONFIRMED.

## Shipped audio (17)

| File | Type | Model | Bytes | Raw source |
|---|---|---|---|---|
| `public/audio/bigWin.mp3` | sound effect | `eleven_text_to_sound_v2` | 12897 | `bigWin.mp3` |
| `public/audio/bonus.mp3` | sound effect | `eleven_text_to_sound_v2` | 12897 | `bonus_v2.mp3` |
| `public/audio/button.mp3` | sound effect | `eleven_text_to_sound_v2` | 3806 | `button.mp3` |
| `public/audio/complete.mp3` | sound effect | `eleven_text_to_sound_v2` | 24809 | `complete.mp3` |
| `public/audio/door.mp3` | sound effect | `eleven_text_to_sound_v2` | 24809 | `door.mp3` |
| `public/audio/freeSpins.mp3` | sound effect | `eleven_text_to_sound_v2` | 24809 | `freeSpins.mp3` |
| `public/audio/land.mp3` | sound effect | `eleven_text_to_sound_v2` | 7881 | `land.mp3` |
| `public/audio/music_base.mp3` | music loop | `eleven_music_v2` | 630535 | `music_base.mp3` |
| `public/audio/music_free.mp3` | music loop | `eleven_music_v2` | 630901 | `music_free.mp3` |
| `public/audio/relic.mp3` | sound effect | `eleven_text_to_sound_v2` | 22301 | `relic.mp3` |
| `public/audio/remove.mp3` | sound effect | `eleven_text_to_sound_v2` | 9135 | `remove.mp3` |
| `public/audio/retrigger.mp3` | sound effect | `eleven_text_to_sound_v2` | 20107 | `retrigger.mp3` |
| `public/audio/spin.mp3` | sound effect | `eleven_text_to_sound_v2` | 11643 | `spin.mp3` |
| `public/audio/station.mp3` | sound effect | `eleven_text_to_sound_v2` | 21360 | `station.mp3` |
| `public/audio/step.mp3` | sound effect | `eleven_text_to_sound_v2` | 6314 | `step.mp3` |
| `public/audio/win.mp3` | sound effect | `eleven_text_to_sound_v2` | 16345 | `win.mp3` |
| `public/audio/winMid.mp3` | sound effect | `eleven_text_to_sound_v2` | 23555 | `winMid.mp3` |

## Raw generations (18)

| Raw file (`assets/audio/raw/`) | Model | SHA-256 (start) | Note |
|---|---|---|---|
| `bigWin.mp3` | `eleven_text_to_sound_v2` | `d5c0589ecf6aeabc` |  |
| `bonus.mp3` | `eleven_text_to_sound_v2` | `38229141263340ef` | byte-identical to bonus_v2.mp3 |
| `bonus_v2.mp3` | `eleven_text_to_sound_v2` | `38229141263340ef` | byte-identical to bonus.mp3 |
| `button.mp3` | `eleven_text_to_sound_v2` | `2e6bfe6651ab3b7e` |  |
| `complete.mp3` | `eleven_text_to_sound_v2` | `b7f9be65384e5934` |  |
| `door.mp3` | `eleven_text_to_sound_v2` | `e88ab2bde770466a` |  |
| `freeSpins.mp3` | `eleven_text_to_sound_v2` | `752801f6b67fdce5` |  |
| `land.mp3` | `eleven_text_to_sound_v2` | `35c8ac2ab5516bca` |  |
| `music_base.mp3` | `eleven_music_v2` | `b93045a264951592` |  |
| `music_free.mp3` | `eleven_music_v2` | `35be16b48ecd5378` |  |
| `relic.mp3` | `eleven_text_to_sound_v2` | `532b221d9986a435` |  |
| `remove.mp3` | `eleven_text_to_sound_v2` | `2e50473309983947` |  |
| `retrigger.mp3` | `eleven_text_to_sound_v2` | `7ebafd0f58463dea` |  |
| `spin.mp3` | `eleven_text_to_sound_v2` | `685238d5048ae060` |  |
| `station.mp3` | `eleven_text_to_sound_v2` | `31b428e8b8bfc7ca` |  |
| `step.mp3` | `eleven_text_to_sound_v2` | `c10a25f035196b69` |  |
| `win.mp3` | `eleven_text_to_sound_v2` | `664f4bbeeb6d1863` |  |
| `winMid.mp3` | `eleven_text_to_sound_v2` | `c6056e373bf0d90c` |  |

Generated but not kept in the repository: a jungle ambience, a first music attempt, a longer big-win sound, a first button click (session record).

## Needs written clarification from ElevenLabs

Use of the outputs in a real-money slot · whether the game is a "Studio Game" and which plan the music requires · distribution by a provider that is not an ElevenLabs customer · sublicensing and transfer as part of a game · beta status of the two models · invoices and generation history.
