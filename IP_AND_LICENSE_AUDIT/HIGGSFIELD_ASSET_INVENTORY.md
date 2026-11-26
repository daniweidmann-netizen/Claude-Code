# HIGGSFIELD ASSET INVENTORY

Date: 26 November 2026 · factual inventory, **no legal conclusions** · generated from the repository; every row is in `MASTER_ASSET_REGISTER.csv`

## Finding

**Every image in the project was generated on the Higgsfield platform**, through its connector in
the development tool, on 24 and 25 November 2026: 42 generation calls, 37 images. Each raw file
carries the Higgsfield job ID in its metadata. The platform model identifier was `gpt_image_2_6`
in every call. The executing image model belongs to OpenAI (see `OPENAI_ASSET_INVENTORY.md`).

| Item | Evidence | Status |
|---|---|---|
| Platform | embedded `hf-job-id` in all 37 raw files; session record; `assets/ASSET_REGISTER.md` | documented |
| Model identifier | `gpt_image_2_6` in all 42 calls (session record) | documented |
| Generation date | embedded record in each raw file | documented |
| Subscription plan | account query 24 Nov 2026: `subscription_plan_type: "basic"`, 47.28 credits | documented as a snapshot only |
| Invoice / receipt | none in the project | **MISSING** |
| Prompts | complete in the development session record (outside the repository); summaries in `assets/ASSET_REGISTER.md` | available, not archived in the repository |
| Platform job history | not exported | **MISSING** |
| Licence documentation | Higgsfield Terms of Use, "Last updated: October 23, 2026", read online on 25 Nov 2026; **no saved copy** | partly documented |
| Reference images | three calls used the owner's own earlier outputs; no third-party image was uploaded | documented |
| Human rework | none; automatic cut-out and resize by `tools/assets/process.py` | documented |

## What the platform terms say (read 25 Nov 2026; quotations, not interpretation)

- "Company does not claim ownership of any of your Inputs or Outputs, nor does it restrict your commercial use of Outputs."
- "you may transfer or sublicense your rights in Outputs to your clients or other third parties."
- Inputs and outputs "may be used by Company to train … its … AI models".
- No warranty of "originality, uniqueness, legality" of outputs.
- For third-party models the user must comply with "that provider's applicable acceptable-use or prohibited-use policies"; "the more restrictive terms" govern.

The platform terms do not override the model provider's restrictions; they import them.

## Rights status of all images

SOURCE VERIFIED · EXCLUSIVITY NOT CONFIRMED · PROVIDER USE NEEDS CLARIFICATION · LEGAL REVIEW REQUIRED.
Not assigned: COMMERCIAL USE CONFIRMED and SUBLICENSING CONFIRMED – the platform terms permit both
in general, but use in a real-money gambling product is not cleared against the model provider's policy.

## Shipped images (31)

| File | Asset | Type | Raw source | Job ID | Generated (UTC) |
|---|---|---|---|---|---|
| `public/bg_landscape.webp` | bg_landscape | background | `bg_landscape.png` | `b1836ad1-1088-42ec-a510-71264fc7cbb8` | 2026-11-24T16:19:33Z |
| `public/bg_portrait.webp` | bg_portrait | background | `bg_portrait.png` | `ddd4daa6-d261-4e4e-96a9-946c05592313` | 2026-11-24T16:19:33Z |
| `public/bgfs_landscape.webp` | bgfs_landscape | background | `bgfs_landscape.png` | `f1fd6034-dda6-4ee3-879f-ab49487e0ee2` | 2026-11-24T18:01:06Z |
| `public/bgfs_portrait.webp` | bgfs_portrait | background | `bgfs_portrait.png` | `e96a729c-8dc7-4c22-9301-ab661d52260c` | 2026-11-24T18:01:29Z |
| `public/logo.webp` | logo | logo | `logo_b.png` | `c8d81381-5982-42d3-9415-03d4be36ee6c` | 2026-11-24T16:19:40Z |
| `public/symbols/sym0.png` | Sapphire Gem | symbol | `sapphire.png` | `9ebbca19-ea3b-4979-b9e9-9c711234e118` | 2026-11-24T15:19:33Z |
| `public/symbols/sym1.png` | Golden Scarab | symbol | `scarab.png` | `26f39eac-8360-408c-b21e-176b69718d62` | 2026-11-24T15:19:41Z |
| `public/symbols/sym2.png` | Golden Chalice | symbol | `chalice.png` | `9cadcd26-766d-4318-b034-51df0662c876` | 2026-11-24T15:19:47Z |
| `public/symbols/sym3.png` | Ruby Crown | symbol | `crown.png` | `5339daa4-1d95-4f90-adc4-8aafad943c11` | 2026-11-24T15:20:11Z |
| `public/symbols/sym4.png` | Jade Mask | symbol | `jade_mask_b.png` | `06379c7f-ab7e-4ea5-ad66-f0935ed2dc2d` | 2026-11-24T15:14:46Z |
| `public/symbols/sym5.png` | Wild | symbol | `wild_a.png` | `201a38f2-b73f-42c5-9017-5d2b20ede290` | 2026-11-24T15:14:53Z |
| `public/symbols/sym6.png` | Compass | symbol | `compass.png` | `7945e184-7686-4659-9e8c-e6edc382c213` | 2026-11-24T15:20:07Z |
| `public/symbols/sym7.png` | Temple Key | symbol | `key.png` | `b00d746c-78b3-4894-b702-dca38ba0f2a1` | 2026-11-24T15:20:05Z |
| `public/symbols/sym8.png` | Explorer | symbol | `explorer.png` | `1fd7e9e2-7917-49b1-9e17-b5cf3829b589` | 2026-11-24T15:20:12Z |
| `public/ui/door_jade.webp` | door_jade | UI graphic | `door_jade_v2.png` | `52deacc5-a9a2-489b-a005-c171652ca10e` | 2026-11-25T05:42:41Z |
| `public/ui/door_jade_open.webp` | door_jade_open | UI graphic | `door_jade_open.png` | `c1a5901c-9cba-4c68-8a51-48edb0e004db` | 2026-11-25T05:43:23Z |
| `public/ui/door_moon.webp` | door_moon | UI graphic | `door_moon_v2.png` | `eca14508-0d80-4604-ba69-8531422bb30e` | 2026-11-25T05:43:48Z |
| `public/ui/door_moon_open.webp` | door_moon_open | UI graphic | `door_moon_open.png` | `75eb90c9-5b45-48d2-b952-5bd58d8350e8` | 2026-11-25T05:44:14Z |
| `public/ui/door_sun.webp` | door_sun | UI graphic | `door_sun_v2.png` | `bf68a565-4a7d-40f5-820b-a3c3aceffe08` | 2026-11-25T05:42:48Z |
| `public/ui/door_sun_open.webp` | door_sun_open | UI graphic | `door_sun_open.png` | `b41d8a6a-f8a6-4238-bc50-f1be29d9fbc3` | 2026-11-25T05:43:31Z |
| `public/ui/frame.webp` | frame | UI graphic | `frame.png` | `7969923e-fd5f-4d8f-9e42-04b86fc178b8` | 2026-11-25T05:42:41Z |
| `public/ui/gate.webp` | gate | UI graphic | `gate_open.png` | `3a89a48d-be6f-456b-bd72-365e99a06906` | 2026-11-25T05:42:49Z |
| `public/ui/relic.webp` | relic | UI graphic | `sun_relic.png` | `3ae02554-04ef-424e-8a8a-636000cdb192` | 2026-11-25T13:57:15Z |
| `public/ui/spin.png` | spin | UI graphic | `spin.png` | `35077e4c-c631-43c5-b882-26faa0e698d3` | 2026-11-24T18:01:11Z |
| `public/ui/station1.png` | station1 | UI graphic | `st1_discovery.png` | `5771dda7-ca84-4c24-8f57-c07d64e8fced` | 2026-11-24T18:00:33Z |
| `public/ui/station2.png` | station2 | UI graphic | `st2_treasure.png` | `d828c149-e2ab-4be7-8099-6c89d9f57e23` | 2026-11-24T18:00:38Z |
| `public/ui/station3.png` | station3 | UI graphic | `st3_ancient.png` | `419aa606-28f3-4fb3-b7dd-4bccbd8f5727` | 2026-11-24T18:00:50Z |
| `public/ui/station4.png` | station4 | UI graphic | `st4_relic.png` | `d340b27d-fdef-4417-bd5f-410db1c28435` | 2026-11-24T18:00:48Z |
| `public/ui/station5.png` | station5 | UI graphic | `st5_temple.png` | `5dba0d19-5e2d-4aa3-b3b7-d21d77c228d5` | 2026-11-24T18:01:58Z |
| `public/ui/tile.png` | tile | UI graphic | `tile.png` | `2f790ba8-f91d-4416-8ebf-b48c44b58ebe` | 2026-11-24T18:01:09Z |
| `public/ui/treasure.webp` | treasure | UI graphic | `treasure.png` | `49567760-9eea-4d3d-b65e-fb3579f93567` | 2026-11-24T18:01:27Z |

## Raw generations (37) – 31 used, 6 unused variants

| Raw file (`assets/reference/raw/`) | Used | Job ID | Generated (UTC) | SHA-256 (start) |
|---|---|---|---|---|
| `bg_landscape.png` | yes | `b1836ad1-1088-42ec-a510-71264fc7cbb8` | 2026-11-24T16:19:33Z | `97ebcb0ba07f12fb` |
| `bg_portrait.png` | yes | `ddd4daa6-d261-4e4e-96a9-946c05592313` | 2026-11-24T16:19:33Z | `b0ab9d1453f9fdd6` |
| `bgfs_landscape.png` | yes | `f1fd6034-dda6-4ee3-879f-ab49487e0ee2` | 2026-11-24T18:01:06Z | `d58a124bfab0c2c2` |
| `bgfs_portrait.png` | yes | `e96a729c-8dc7-4c22-9301-ab661d52260c` | 2026-11-24T18:01:29Z | `c066a270e4c6cb64` |
| `chalice.png` | yes | `9cadcd26-766d-4318-b034-51df0662c876` | 2026-11-24T15:19:47Z | `a045581d2565650f` |
| `compass.png` | yes | `7945e184-7686-4659-9e8c-e6edc382c213` | 2026-11-24T15:20:07Z | `f8815a4300947fc9` |
| `crown.png` | yes | `5339daa4-1d95-4f90-adc4-8aafad943c11` | 2026-11-24T15:20:11Z | `101eb8a37ab73f27` |
| `door_jade.png` | no | `16c2b402-ce35-41b1-85f2-5ec387381a84` | 2026-11-24T18:02:06Z | `753bd87b5b6314b4` |
| `door_jade_open.png` | yes | `c1a5901c-9cba-4c68-8a51-48edb0e004db` | 2026-11-25T05:43:23Z | `e4319b9b0d8f27c9` |
| `door_jade_v2.png` | yes | `52deacc5-a9a2-489b-a005-c171652ca10e` | 2026-11-25T05:42:41Z | `bd1ecdc4e50dfbf7` |
| `door_moon.png` | no | `a77d6f05-4fc8-445b-a51b-590bdc0a8014` | 2026-11-24T18:01:06Z | `a7d05003ef1146a1` |
| `door_moon_open.png` | yes | `75eb90c9-5b45-48d2-b952-5bd58d8350e8` | 2026-11-25T05:44:14Z | `bd5d04a88da4461c` |
| `door_moon_v2.png` | yes | `eca14508-0d80-4604-ba69-8531422bb30e` | 2026-11-25T05:43:48Z | `8362d111de41a249` |
| `door_sun.png` | no | `a4e5a37b-8164-47b0-92d6-cc7718f03a3f` | 2026-11-24T18:00:51Z | `3d41badab0348cba` |
| `door_sun_open.png` | yes | `b41d8a6a-f8a6-4238-bc50-f1be29d9fbc3` | 2026-11-25T05:43:31Z | `30a9d6b3bf4c4011` |
| `door_sun_v2.png` | yes | `bf68a565-4a7d-40f5-820b-a3c3aceffe08` | 2026-11-25T05:42:48Z | `ae59cb29cd3c3b58` |
| `explorer.png` | yes | `1fd7e9e2-7917-49b1-9e17-b5cf3829b589` | 2026-11-24T15:20:12Z | `60848f1ef14091a9` |
| `frame.png` | yes | `7969923e-fd5f-4d8f-9e42-04b86fc178b8` | 2026-11-25T05:42:41Z | `b84a95111bd7f9b7` |
| `gate_open.png` | yes | `3a89a48d-be6f-456b-bd72-365e99a06906` | 2026-11-25T05:42:49Z | `8c66f99677bd9162` |
| `jade_mask_a.png` | no | `88d18963-2b19-4bc7-b537-126ee70c0b18` | 2026-11-24T15:15:00Z | `11970fb3ddd67908` |
| `jade_mask_b.png` | yes | `06379c7f-ab7e-4ea5-ad66-f0935ed2dc2d` | 2026-11-24T15:14:46Z | `0913e5ce3bb1d842` |
| `key.png` | yes | `b00d746c-78b3-4894-b702-dca38ba0f2a1` | 2026-11-24T15:20:05Z | `07414bccf8c5f26f` |
| `logo_a.png` | no | `42daf621-3e6c-4a00-a324-dba83d7ef5cf` | 2026-11-24T16:19:36Z | `ce20e21735569255` |
| `logo_b.png` | yes | `c8d81381-5982-42d3-9415-03d4be36ee6c` | 2026-11-24T16:19:40Z | `236dbe33f0c85fad` |
| `sapphire.png` | yes | `9ebbca19-ea3b-4979-b9e9-9c711234e118` | 2026-11-24T15:19:33Z | `6bf8710bf14084b9` |
| `scarab.png` | yes | `26f39eac-8360-408c-b21e-176b69718d62` | 2026-11-24T15:19:41Z | `1099dd04fcbf5b00` |
| `spin.png` | yes | `35077e4c-c631-43c5-b882-26faa0e698d3` | 2026-11-24T18:01:11Z | `ed2764d4a37b3071` |
| `st1_discovery.png` | yes | `5771dda7-ca84-4c24-8f57-c07d64e8fced` | 2026-11-24T18:00:33Z | `a12389aa9006bcb7` |
| `st2_treasure.png` | yes | `d828c149-e2ab-4be7-8099-6c89d9f57e23` | 2026-11-24T18:00:38Z | `249ede7c5fbb9e0f` |
| `st3_ancient.png` | yes | `419aa606-28f3-4fb3-b7dd-4bccbd8f5727` | 2026-11-24T18:00:50Z | `e8d9d44b613d6219` |
| `st4_relic.png` | yes | `d340b27d-fdef-4417-bd5f-410db1c28435` | 2026-11-24T18:00:48Z | `b744bd6c3bfa4985` |
| `st5_temple.png` | yes | `5dba0d19-5e2d-4aa3-b3b7-d21d77c228d5` | 2026-11-24T18:01:58Z | `e15aca38b210edef` |
| `sun_relic.png` | yes | `3ae02554-04ef-424e-8a8a-636000cdb192` | 2026-11-25T13:57:15Z | `192c328c5f0532dd` |
| `tile.png` | yes | `2f790ba8-f91d-4416-8ebf-b48c44b58ebe` | 2026-11-24T18:01:09Z | `b3d9b42abfba288f` |
| `treasure.png` | yes | `49567760-9eea-4d3d-b65e-fb3579f93567` | 2026-11-24T18:01:27Z | `353ab04ebaf0f257` |
| `wild_a.png` | yes | `201a38f2-b73f-42c5-9017-5d2b20ede290` | 2026-11-24T15:14:53Z | `9b3708d227c44f0b` |
| `wild_b.png` | no | `a7ba59af-ef39-40a7-afc6-be48805443f3` | 2026-11-24T15:15:05Z | `ca82f0b36a931682` |

## Needs written clarification from Higgsfield

Use of these outputs as artwork of a real-money gambling product · which provider's model and terms stand behind `gpt_image_2_6` · whether the general permission to transfer and sublicense holds for that model · training use of the outputs · invoice and job history as evidence.
