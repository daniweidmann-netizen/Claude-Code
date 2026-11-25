# IP OWNERSHIP OVERVIEW

Date: 25 November 2026 · English summary of the detailed audit in `IP_AND_LICENSE_AUDIT/` (German)

> **Not legal advice.** A factual audit with assessments. No lawyer was involved. Clauses marked
> READ were read on the provider's official page on 25 November 2026; reading is not legal
> interpretation.

## 1. Who created what [FACT]

| Component | Created by | Service / contract | Evidence |
|---|---|---|---|
| Name, tagline, concept, feature brief, decisions | the owner | – | development session record |
| Source code, tests, tools, documents | AI coding assistant (Claude Code) on the owner's instructions | Anthropic, Claude Max (owner's statement), consumer terms for Switzerland | Git history: all commits but the first (a one-line README) were made by the assistant |
| Math parameters | tuned by the assistant through simulation, approved by the owner | same | configuration, reports |
| 37 images (31 used) | platform **Higgsfield**, executing model an **OpenAI** image model; prompts written by the assistant | Higgsfield, plan "basic" (account query) | Higgsfield job ID and OpenAI-signed provenance record embedded in every raw file |
| 17 audio files | **ElevenLabs** sound-effect and music models; prompts written by the assistant | ElevenLabs, tier "creator" (account query) | ElevenLabs-signed provenance record in every raw file |
| Phaser, eventemitter3 | third parties | MIT | licence files |
| Fonts Cinzel, Source Sans 3 | third parties | SIL OFL 1.1 | licence files |

The image provider question is settled: Higgsfield was the platform and contracting party, an
OpenAI model generated the images, Claude Code only steered the workflow. No direct OpenAI account
was used.

## 2. Five findings

1. **Origin is fully evidenced**; rights are not. All rights in AI output rest on provider terms.
2. **Three sets of terms are in doubt for the intended use** (all READ):
   - Anthropic consumer terms, Switzerland: "Non-commercial use only. You agree that you will not
     use our Services for any commercial or business purposes".
   - ElevenLabs Prohibited Use Policy: no use to contribute to "Operating or facilitating
     real-money gambling"; the terms extend the policy to "any Output". Music terms exclude
     "Studio Games" on self-serve plans.
   - Higgsfield binds users to the model provider's policies; OpenAI's Usage Policies: "you cannot
     use our services for: … real money gambling".
3. **No exclusivity** in images or audio; providers keep licences; similar outputs are possible.
4. **Copyright protection is doubtful** under Swiss law for fully AI-generated images and audio
   and uncertain for AI-written code.
5. **No registered right exists** (no trade mark).

## 3. Preliminary traffic light

| Model | Rating | Reason |
|---|---|---|
| Publishing | RED with today's components; AMBER reachable | the three terms above |
| Exclusive licence | RED | additionally no exclusive rights to grant |
| Non-exclusive licence | RED with today's components; AMBER reachable | same use-case doubts as publishing; exclusivity not needed |
| Full IP acquisition | RED | owner cannot warrant ownership free of encumbrances |

RED means "do not offer or warrant without clarification", not "infringement established".

One positive point (READ): Higgsfield's terms state "you may transfer or sublicense your rights in
Outputs to your clients or other third parties".
