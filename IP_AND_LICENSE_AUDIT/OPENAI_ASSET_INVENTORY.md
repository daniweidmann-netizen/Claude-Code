# OPENAI ASSET INVENTORY

Date: 26 November 2026 · factual inventory, **no legal conclusions** · generated from the repository; every row is in `MASTER_ASSET_REGISTER.csv`

## Finding

The owner recalls using "OpenAI / ChatGPT for some graphics". **The project contains no asset that
can be shown to have been generated directly with ChatGPT or with an OpenAI account.**

What the evidence shows instead:

| Question | Evidence | Result |
|---|---|---|
| Is an OpenAI model involved? | all 37 raw images carry an embedded C2PA record: issuer "OpenAI Media Service API", software "API", version "gpt-image", source type "trainedAlgorithmicMedia" | **yes, for every image** |
| Were they generated directly at OpenAI (ChatGPT, OpenAI API with the owner's account)? | the development session record contains no call to an OpenAI service; all 37 images have a Higgsfield job ID | **no evidence of direct use** |
| How did the OpenAI model come into play? | Higgsfield offers the model as `gpt_image_2_6` and called it | via the platform |
| Does the owner have a contract with OpenAI for these images? | none documented | not documented |
| Is an OpenAI API credential configured in the development environment? | yes, as a connected service; it was not used for this project (session record) | unused |

The embedded records were read from the files; their cryptographic signatures were **not**
validated with a C2PA verification tool.

## Assets attributable to an OpenAI model

All 37 raw images and the 31 shipped images derived from them – the same files as in
`HIGGSFIELD_ASSET_INVENTORY.md`. There is no separate group of "OpenAI-only" assets.

| Group | Count | Model evidence |
|---|---|---|
| Symbols | 9 shipped (11 raw incl. two unused variants) | OpenAI "gpt-image" record in each raw file |
| Backgrounds | 4 | same |
| Logo | 1 shipped (2 raw) | same |
| Station medallions | 5 | same |
| Sun Relic | 1 | same |
| Chamber doors | 6 shipped (9 raw) | same |
| Frame, tile, spin disc, temple gate, treasure | 5 | same |

## If the owner did use ChatGPT

If any image was created in ChatGPT and brought into the project, it is **not among the files in
this repository** – every image file here traces to a Higgsfield job. The owner should check
whether ChatGPT images were used elsewhere (concept sketches, the app icon, social media, earlier
drafts) and list them in `UNKNOWN_ASSET_ORIGINS.md`.

## Model provider terms (read 25 Nov 2026; quotation, not interpretation)

OpenAI Usage Policies, "Effective: November 20, 2026": "Your use of OpenAI services must follow
these Usage Policies: … you cannot use our services for: … real money gambling".
Whether creating artwork for a gambling product falls under this wording is not stated in the text.
Other OpenAI documents (terms of use, services agreement) were available as search-result excerpts
only and are not quoted here.

## Rights status

SOURCE VERIFIED (model identified through the embedded record) · EXCLUSIVITY NOT CONFIRMED ·
PROVIDER USE NEEDS CLARIFICATION · LEGAL REVIEW REQUIRED.

## Missing

Any documentation of rights passing from OpenAI to the owner (the chain runs through Higgsfield) ·
confirmation which model variant was used · validation of the embedded signatures · the owner's
confirmation whether ChatGPT was used for anything connected with the project.
