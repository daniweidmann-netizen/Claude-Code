# AUDIO LICENSE AUDIT

Date: 25 November 2026 · not legal advice · detail: `IP_AND_LICENSE_AUDIT/ELEVENLABS_AUDIO_LICENSE_AUDIT.md` (German)

## 1. Verified origin [FACT]

| Question | Finding |
|---|---|
| Service | ElevenLabs, via its connector in the development tool; 22 generation calls on 25 November 2026 |
| Models | effects `eleven_text_to_sound_v2`, music `eleven_music_v2` |
| Provenance | every raw file carries a C2PA record issued by "Eleven Labs Inc." (read, not cryptographically validated) |
| Tier | "creator", active, per account query on 25 Nov 2026; invoice UNRESOLVED |
| Voices, voice cloning, Voice Library, Music Marketplace, uploads | none used |
| Files shipped | 15 effects (0.3–2.0 s), 2 instrumental loops (45 s) |
| Processing | automatic trim, loudness, re-encode; no human editing |
| Listening review | owner, 25 Nov 2026: "The music and the sounds sound good and fit the slot." |

## 2. Terms (READ on 25 Nov 2026)

| Topic | Wording |
|---|---|
| Applicable version | "Terms of Use EU" for residents of the EEA, Switzerland or UK; "Last Updated: 09 October 2026" (date from search result) |
| Output | "as between you and ElevenLabs, you retain all rights in and to your Output" |
| Commercial use | paid plan: "you may use the Services for commercial purposes, but … your access and use of the Services and any Output must still comply with the Prohibited Use Policy" |
| Licence to ElevenLabs | "perpetual and irrevocable", "nonexclusive", "worldwide", "sub-licensable" |
| Prohibited Use Policy, "Last Updated: 09 October 2026" | "You may not use our Services to engage in or contribute to … restricted activities … This includes: … **Operating or facilitating real-money gambling**" |
| Creative terms | output may be incorporated into "games, applications, and other productions"; not to be sold or sublicensed "on a standalone basis" |
| Music terms, self-serve plans | "All online and offline commercial use permitted, except film, TV, radio, and Studio Games"; the user must judge and monitor whether a game is an "Indie Game" |

## 3. Assessment

| Question | Assessment |
|---|---|
| Use in the play-money demo | not affected by the gambling clause |
| Use in a commercial **real-money** slot | **UNRESOLVED – serious reservation** (policy applies to outputs) |
| Music in a slot published by an established provider | **probably not covered** by the current plan ("Studio Games"); an enterprise agreement may be needed |
| Distribution by a provider that is not an ElevenLabs customer | UNRESOLVED |
| Sublicensing | standalone: not allowed; as part of the game: UNRESOLVED |
| Exclusive licence | **cannot be warranted** (perpetual licence remains with ElevenLabs) |
| Copyright protection | doubtful under Swiss law for AI-generated music and sounds |

Practical alternative [RECOMMENDATION]: audio is the easiest part to replace (17 short files;
synthetic fallback exists). Commissioned sound design with a written assignment removes both
reservations.

## 4. Unresolved items

UNRESOLVED: written confirmation from ElevenLabs on real-money gambling · classification as Indie or
Studio Game and required plan · distribution by a third party · beta status of the two models ·
invoices and generation history · training setting.
