# VIRELI — Asset Guide

How to produce, name and deliver every asset, including the Higgsfield
cinematic assets. Missing assets are replaced by **clearly labelled, designed
placeholders** (dark gradient plate + chapter name + "Asset pending") —
never by random substitute images.

---

## 1. Golden rules

1. **The packaging is sacred.** The pouch in any image/video must be the real artwork. AI generators (video and image) tend to warp logos and re-type text — so:
   * Prefer Higgsfield plates **without the pouch**; the pouch is added in real-time 3D.
   * If a shot must contain the pouch, generate it **image-to-video from an approved real packshot**, and check every frame for warped text. Rejected otherwise.
2. **No text, logos, watermarks or UI** baked into videos/visuals. All type is set live in HTML.
3. **No invented product facts.** Visuals of ingredients are atmospheric metaphors, not depictions of dosage, origin or effect.
4. Every delivered file is named per §4 and listed in the asset manifest (`src/content/assets.ts`, created in Phase 1).

---

## 2. Folder structure

```
references/                      # source of truth, NOT shipped to the website
├─ screenshots-current-store/    # present
├─ packaging/                    # print PDF/AI, dieline, front/back flats
├─ logo/                         # SVG/AI
├─ photos/                       # real pouch + gummy photography
└─ label-text/                   # full back-of-pack text (PDF or TXT)

higgsfield/                      # raw Higgsfield masters (git-ignored; keep in cloud storage)

public/assets/                   # web-ready, compressed (shipped)
├─ models/                       # .glb (meshopt-compressed)
│  ├─ pouch/   gummy/   berries/   environment/
├─ textures/                     # .ktx2, HDR environment (.hdr / .ktx2)
├─ video/
│  ├─ hero/  berry-world/  gummy-macro/  ingredients/  lifestyle/  finale/
├─ images/
│  ├─ posters/                   # first-frame posters for each video + tier-0 stills
│  ├─ ingredients/
│  └─ og/                        # social share images
├─ fonts/
└─ audio/                        # optional ambient sound
```

Large videos are served from a media CDN (Vercel Blob or Mux) in production;
the same folder structure is mirrored there and referenced via
`NEXT_PUBLIC_MEDIA_BASE_URL`.

---

## 3. Higgsfield deliverables

General specs for all clips:

| Property | Spec |
| --- | --- |
| Master export | Highest available quality (ProRes/high-bitrate MP4), 24 fps or 25 fps, no text, no watermark |
| Desktop aspect | 16:9 (also 21:9 when stated) |
| Mobile aspect | **9:16, generated separately** (re-composed, not cropped) |
| Loops | Seamless loop where noted (matching first/last frame, or we cross-fade) |
| Camera | Slow, steady, dolly / orbit / push-in; no handheld shake, no fast cuts |
| Palette | Midnight `#05060F`, navy `#0D1030`, indigo `#1E1161`, violet `#3C2965`, lavender `#C8B6EE`, a single warm accent only in the lifestyle scene |
| Mood words | "luxury fragrance film, moonlit, still, sculptural, macro, velvet darkness, soft volumetric haze" |

| ID | Asset | Use in site | Length | Notes / prompt direction |
| --- | --- | --- | --- | --- |
| `HF-01` | **Hero cinematic plate** | Ch. 01 far background (behind the 3D pouch) + tier-0 hero | 8–12 s loop | Empty midnight landscape echoing the label's layered violet hills, thin crescent moon top-left, faint stars, slow mist drift. **No pouch, no berries** (those are 3D). Leave the right third calm for the pouch. |
| `HF-02` | **Berry world plate** | Ch. 02 sky/fog layer behind 3D berries; tier-0/1 fallback | 10–15 s loop | Surreal giant berries (strawberry, raspberry, blackberry, blueberry) in night fog, macro lens look, slow drift forward. Photoreal. |
| `HF-03` | **Gummy macro** | Ch. 04 macro view fallback, Ch. 03→04 transition, social | 6–10 s | Extreme macro of **gummies matching the real product** (shape/colour from `references/photos/` — deep garnet, translucent, sugar-free glossy surface), slow rotation, moonlit rim light. Generate from a real gummy photo (image-to-video). |
| `HF-04a–d` | **Ingredient visuals** — L-Theanin, Ashwagandha, Vitamin D, Zink | Ch. 03 backgrounds on mobile/tier 1, still frames as posters | 6–8 s loop each + 1 still each | a) still liquid surface, single leaf form, ripples calming — lavender; b) sculptural root in warm dusk haze, earth particles; c) eclipse-like ring of light behind a dark sphere; d) faceted mineral / brushed metal with refractions. Abstract, no labels, no pills, no medical imagery. |
| `HF-05` | **Lifestyle / bedroom plate** | Ch. 05 background plate (VideoTexture) | 10–15 s loop | Luxurious minimal bedroom at night, linen, moonlight through a sheer moving curtain, one warm bedside lamp. **Leave the nightstand area empty** (3D pouch + glass are placed there). Optional variant with a person's hand reaching (no face) — only if you want a human presence. |
| `HF-06` | **Final product reveal plate** | Ch. 06 background | 8–12 s | Crescent moon rising behind a soft horizon, light gradually increasing, stars. Pouch is 3D. |
| `HF-07` (optional) | Social cut-downs | Instagram/TikTok, not the site | — | Can include the pouch only via image-to-video from approved packshot. |

Also deliver one **still frame (PNG, 3840 px wide)** per clip — used as poster
and as tier-0 image.

### Web encodes (we produce these from your masters)

| Variant | Codec | Resolution | Target size |
| --- | --- | --- | --- |
| `*-desktop.av1.mp4` | AV1 | 1920×1080 | ≤ 3 MB per loop |
| `*-desktop.hevc.mp4` | HEVC (Safari) | 1920×1080 | ≤ 3 MB |
| `*-desktop.h264.mp4` | H.264 fallback | 1920×1080 | ≤ 4 MB |
| `*-mobile.*.mp4` | same three | 1080×1920 (from 9:16 master) | ≤ 1.2 MB |
| `*-poster.avif` / `.jpg` | — | 1920 / 1080 wide | ≤ 150 kB |

All muted, `playsinline`, no audio track (ambient sound is separate).

---

## 4. Naming convention

```
<chapter>-<subject>-<variant>.<codec>.<ext>
ch01-hero-desktop.av1.mp4
ch01-hero-mobile.hevc.mp4
ch01-hero-poster.avif
ch03-ingredient-zink-desktop.h264.mp4
ch04-pouch.glb
ch04-pouch-label-front.ktx2
```

Lowercase, hyphens, no spaces, no umlauts (`zink`, `l-theanin`, `ashwagandha`, `vitamin-d`).

---

## 5. 3D assets

| Asset | Source | Target |
| --- | --- | --- |
| Pouch | Modeled in Blender from the real dieline + photos; label texture from the print PDF (front & back) | ≤ 30k tris (LOD0), 2k KTX2 label (4k desktop tier 3), normal + roughness maps |
| Gummy | Modeled from macro photos (real shape) | ≤ 3k tris, instanced |
| Berries (4 types) | Photogrammetry / high-end CC0 or licensed models; Higgsfield `generate_3d` only as a starting point, then cleaned up | ≤ 15k tris each (LOD0), 1k–2k KTX2 textures, 2 LODs |
| Environment | HDR studio/night environment map | 1k–2k, KTX2/HDR |
| Ch. 05 nightstand, glass | Modeled, baked lighting | ≤ 20k tris total |

Pipeline: Blender → glTF → `gltf-transform` (dedup, prune, meshopt, KTX2 via `toktx`, LOD) → `public/assets/models/`.

---

## 6. Placeholder policy

| Missing | Placeholder |
| --- | --- |
| Any Higgsfield video | Designed gradient/noise plate in the chapter's palette with discreet label "Asset pending — HF-0x" (visible only in preview deployments) |
| Pouch artwork | Neutral, unbranded matte pouch silhouette, labelled "Artwork pending" in preview — never an invented label |
| Gummy | Simple translucent garnet primitive |
| Ingredient visuals | Abstract procedural shader per ingredient |
| Fonts | Free alternatives (Instrument Serif, DM Sans) |

Production builds fail the asset check if any placeholder is still referenced.

---

## 7. Status checklist

- [x] Store screenshots (5) — `references/screenshots-current-store/`
- [ ] Final pouch version decision (A / B)
- [ ] Pouch print artwork / dieline
- [ ] Vector logo
- [ ] Pouch photos + dimensions
- [ ] Gummy macro photos + dimensions
- [ ] Full label text
- [ ] HF-01 Hero plate
- [ ] HF-02 Berry world
- [ ] HF-03 Gummy macro
- [ ] HF-04a–d Ingredient visuals
- [ ] HF-05 Lifestyle / bedroom
- [ ] HF-06 Final reveal
- [ ] Fonts / licences
- [ ] Ambient audio (optional)
