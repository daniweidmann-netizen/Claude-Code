# MASTER PROJECT STATUS

**TEMPLE OF THE LOST SUN** · *EVERY RELIC REVEALS A SECRET.*
Date: 25 November 2026 · Game configuration 1.0.0 · Demo build, play money only

Reading guide — every statement in this audit carries one of three marks:
**[FACT]** verified in code, configuration, test output or file contents ·
**[ASSUMPTION]** plausible but not verified · **[RECOMMENDATION]** the auditor's advice.
Nothing in this audit is independently validated or certified.

## 1. What the project is [FACT]

A 6×5 cluster-pays slot with cascades. Minimum winning cluster: 5 symbols connected horizontally
or vertically. Signature feature: the five-station Expedition Track (Discovery, Treasure, Ancient
Power, Relic, Temple). Free Spins with Base Camp, Temple Bonus with three chambers, Temple Finale,
optional feature buy ("Buy Expedition"). Maximum win 10,000× bet.

Built 23–25 November 2026 by one independent developer in Switzerland with an AI coding
assistant. Source code, documents, images and audio were produced with AI services under the
owner's direction (see `IP/`).

## 2. Status at a glance

| Area | Status | Basis |
|---|---|---|
| Game rules and engine | COMPLETED | 86 automated tests pass |
| All features (Expedition, Free Spins, Temple Bonus, Finale, feature buy) | COMPLETED | tests, simulation, browser runs |
| Math model, one RTP configuration | NEEDS EXTERNAL VALIDATION | internally simulated: RTP 95.995 % over 2 billion rounds on configuration 1.0.0 |
| Web demo client (portrait, landscape, EN/DE, three speed modes) | COMPLETED | browser tests in Chromium |
| Presentation mode for the Temple Bonus | COMPLETED | added in this audit, demo build only |
| Real-device testing | NEEDS TESTING | one iPhone 15 Pro, owner's impression "very good"; no other device, no measurements |
| Audio | COMPLETED / LEGAL REVIEW REQUIRED | owner listened: "sound good and fit the slot"; rights for real-money use open |
| Graphics | COMPLETED / LEGAL REVIEW REQUIRED | AI-generated stills; origin proven; rights for real-money use open |
| Source-code rights | LEGAL REVIEW REQUIRED | consumer terms for Switzerland say "Non-commercial use only" |
| Server / RGS / wallet / round recovery | BLOCKED (not built; needs a partner platform) | – |
| Certification | NEEDS EXTERNAL VALIDATION | nothing certified |
| Trailer | IN PROGRESS | script and plan ready, no video recorded |
| Pitch deck | IN PROGRESS | content ready, slides not designed |
| Trade mark | LEGAL REVIEW REQUIRED | no search, no application |

## 3. The three things that matter most [RECOMMENDATION]

1. **Rights.** Three provider terms do not clearly cover a commercial real-money slot
   (`IP/OPEN_LEGAL_ISSUES.md`). Until resolved, present art and audio as replaceable and promise
   nothing about ownership.
2. **Evidence beyond one phone.** Android, tablet, desktop Safari/Firefox and measured frame
   rates are missing.
3. **External validation.** All mathematics is internally simulated only.

## 4. Documents of this audit

| Folder | Content |
|---|---|
| `PROJECT_AUDIT/` | this status, technical, gameplay, mathematics, visual/audio, mobile/browser QA, bugs, scorecard, final report |
| `PROJECT_AUDIT/QA/` | test plan, results, device compatibility, known issues |
| `PROJECT_AUDIT/MATH/` | math documentation, RTP report, bonus probabilities, validation requirements, discrepancies |
| `PROJECT_AUDIT/IP/` | ownership overview, graphics, audio, software, open legal issues, owner checklist |
| `PRESENTATION/` | trailer (script, scenes, recordings, editing), pitch deck content, one-pager, feature overview, demo guide |
| `COMMERCIAL/` | outreach plan, submission checklist, partnership options, negotiation preparation |

Earlier German-language material remains valid and more detailed: `docs/`,
`PROVIDER_PRESENTATION_PACKAGE/`, `IP_AND_LICENSE_AUDIT/`.

## 5. Changes made during this audit [FACT]

| Change | Affects gameplay or math? |
|---|---|
| Presentation mode `?present=temple` (demo build only) | No. Fixed seed instead of a random one; engine, configuration and probabilities untouched |
| Build switch `TLS_PRODUCTION=1` that removes all developer tools | No. Default build behaves as before |
| One additional browser check | No |
| New documents in `PROJECT_AUDIT/`, `PRESENTATION/`, `COMMERCIAL/` | No |

Backup before the changes: local Git tag `pre-master-audit`. Engine, session layer and
configuration: zero changed lines; configuration hash unchanged.
