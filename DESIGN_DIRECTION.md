# VIRELI — Design Direction

## THE VIRELI NIGHT UNIVERSE

Status: **Proposal — awaiting approval.**

---

## 1. Creative idea

**"The moment the day lets go."**

Vireli is not sold as a product; it is staged as the **threshold between day and
night**. The whole site is one continuous night: it starts in absolute
darkness, a thin crescent moon appears — the same crescent printed on the
pouch — and that moon is the only light source we ever need. Everything the
visitor sees is lit by it.

The pouch artwork already contains the entire world we need: a crescent moon,
layered violet hills, a berry cluster, small stars. **We do not invent a new
universe — we step *into* the packaging.** The rolling hills on the label become
landscapes, the berries become architecture, the stars become particles. This
keeps every frame unmistakably Vireli and gives the site a concept nobody else
can copy.

Three words guide every decision: **Stillness. Depth. Precision.**

* *Stillness* — slow camera, long eases, lots of black space. Luxury is not loud.
* *Depth* — layered parallax, fog, reflections, real 3D volume.
* *Precision* — perfect type, exact grid, crisp microinteractions, no "AI-glow" clutter.

References in spirit (not to copy): luxury fragrance films (slow, sculptural
product lighting), Apple product pages (clarity, typographic hierarchy),
igloo.inc (one continuous world, technical ambition).

---

## 2. The first three seconds

| Time | What happens |
| --- | --- |
| 0.0 s | Pure midnight (`#05060F`). A 1‑pixel crescent begins to draw itself in the centre — this *is* the preloader (progress = how much of the crescent is drawn). No spinner, no percentage. |
| ~1.0 s | Crescent completes and blooms softly. Its light rakes across the scene from upper left: the **pouch** emerges from darkness, foil catching a single specular line along its seal. |
| ~1.8 s | Fine star‑dust drifts upward; four berries resolve in the dark around the pouch at different depths, slowly orbiting. A black, liquid‑glass floor reflects everything. |
| ~2.4 s | Headline reveals line by line, letter tracking slowly tightening:<br>**DEIN ABEND.**<br>**DEIN RITUAL.**<br>**DEINE RUHE.** |
| 3.0 s+ | Mouse: pouch tilts ±5°, light follows the cursor like a moonbeam. Scroll cue: a thin vertical line that "breathes". |

If the visitor is on tier 0 (no WebGL / reduced motion), the same composition
appears as a still, with a gentle cross-fade instead of motion.

---

## 3. Colour system

Derived from the pouch and the existing store (sampled from the screenshots).

| Token | Hex | Use |
| --- | --- | --- |
| `--midnight` | `#05060F` | Deepest background, letterbox, preloader |
| `--night-navy` | `#0D1030` | Primary dark surfaces, sky |
| `--deep-navy` | `#121834` | Announcement bar / UI chrome on dark (existing store colour) |
| `--velvet-indigo` | `#1E1161` | Shadow side of the pouch, fog tint |
| `--vireli-violet` | `#3C2965` | Pouch body (version B), mid-tones |
| `--foil-blue` | `#5744D3` | Specular highlights on foil (version A) — accent only, small doses |
| `--aubergine` | `#5D3C65` | Primary CTA (continuity with the existing store) |
| `--lavender` | `#C8B6EE` *(to verify against print file)* | "MIXED BERRY" lavender, hover states, small labels |
| `--moon-ivory` | `#F2EEE9` | Light sections, text on dark (existing store background) |
| `--garnet` | `#54102B` | Gummy colour; used only inside imagery, never as UI colour |
| `--ember` | `#E3A260` *(approx.)* | The single warm counter-light (bedside lamp) — Chapter 05 only |

Rules
* Dark chapters: 90 % midnight/navy, 8 % violet, ≤ 2 % accent. No rainbow gradients; gradients only as light falling off in 3D.
* Light editorial sections (Formula intro, legal info, footer) use `--moon-ivory` with charcoal text — the "morning after" contrast, used sparingly.
* All text meets WCAG AA contrast.
* No glassmorphism. The cart drawer is a solid `--night-navy` panel with a 1px `--lavender` 12 % hairline.

---

## 4. Typography

| Role | Recommendation (licensed) | Free alternative | Use |
| --- | --- | --- | --- |
| Display | **Saol Display** or **Canela** (high-contrast serif, echoes the wordmark) | Instrument Serif / Fraunces (opsz) | Chapter titles, the big statements — set large, light weight, tight leading (0.95) |
| Editorial caps | **Neue Montreal** Medium, uppercase, tracking +0.18em | Inter Tight / DM Sans | Headline "DEIN ABEND…", chapter numbers, labels |
| Body & UI | **Neue Montreal** Regular | DM Sans (current store font) | Paragraphs, prices, buttons |
| Numerals | Tabular figures of the body face | — | Price, quantity, chapter index |

* The Vireli **wordmark is never typed** — always the supplied vector logo.
* Scale (desktop): 12 / 14 / 16 / 20 / 28 / 44 / 72 / 120 / 184 px; mobile caps at 72 px.
* Measure: 32–60 characters for body text.
* Swiss German orthography: **"ss" instead of "ß"** everywhere.
* Chapter index style: `01 — DIE NACHT` in small caps at the top-left of each chapter, editorial-magazine style.

Decision needed: licensed fonts (≈ CHF 300–900 one-off web licence) or free alternatives.

---

## 5. Motion language

| Aspect | Rule |
| --- | --- |
| Camera | Always moving slightly (breathing drift ±0.5 %), never static, never fast. Scroll maps to camera along splines; inertia via Lenis. |
| Eases | `vireli.out` = `cubic-bezier(0.16, 1, 0.3, 1)` (expo-like) for reveals; `vireli.inOut` = `cubic-bezier(0.65, 0, 0.35, 1)` for camera; no bounces, no elastic. |
| Durations | Micro 180–240 ms · UI 400–600 ms · Text reveals 900–1400 ms · Scene transitions are scroll-bound, not time-bound. |
| Text reveals | Lines rise from a mask (8–12 px) with a slight blur-to-sharp; words, not letters, except for the hero. |
| Cursor (desktop) | Native cursor kept; a soft 24 px moonlight halo follows with lag over the canvas only. Over interactive 3D objects it becomes a ring with the label "Drehen" / "Entdecken". |
| Hover | Buttons: fill wipes in from left in 400 ms, label shifts 2 px. Links: underline draws in. |
| Sound | Optional ambient night soundscape (wind, faint chime on chapter change). **Off by default**, toggle in the header. |
| Reduced motion | No camera flight, no parallax, no scroll-jacking — chapters cross-fade; all content present. |

---

## 6. Chapters — storyboards

Each chapter has its own composition. Desktop and mobile are art-directed separately (mobile notes in §7).

### CHAPTER 01 — DIE NACHT *(The Night Universe)*

* **Composition**: pouch on the right third, floating 20 cm above a black liquid‑glass floor; headline left, flush to a 12-column grid, huge negative space. Four berries (strawberry, raspberry, blackberry, blueberry — the four on the label) orbit at different depths; star-dust particles rise.
* **Light**: moon key light from top-left (cool lavender), faint violet rim from behind, floor reflection.
* **Interaction**: pouch tilt + moonbeam follow the cursor; berries gently repel from the cursor.
* **Scroll**: camera dollies in and arcs around the pouch until the **printed berry cluster on the label fills the screen** …
* **Transition → 02**: … the printed illustration dissolves (ink shader) into real 3D berries — we fall *through the label* into the Berry Dimension.
* **Copy**: `DEIN ABEND. / DEIN RITUAL. / DEINE RUHE.` + subline from the verified store copy: "Melatoninfrei, vegan und ohne Zuckerzusatz." + CTA "Night Gummies entdecken" (scrolls to Ch. 04).

### CHAPTER 02 — DIE BEERENWELT *(The Berry Dimension)*

* **Composition**: architectural scale — berries the size of buildings in fog, like monuments in a night landscape; the violet hills of the label become rolling terrain. Strong scale contrast: tiny drifting particles vs. giant fruit.
* **Camera**: a single continuous fly-through on a spline: under a blackberry's drupelets, past a raspberry, over a blueberry's bloom-dusted surface, toward a strawberry glowing from inside.
* **Craft**: macro-photography look — shallow depth of field, specular water droplets, subsurface glow.
* **Video**: Higgsfield "berry world" plate used as the far background (sky/fog layer) to add organic detail at zero geometry cost.
* **Copy** (minimal, large serif): "Mixed Berry." — any statement about the flavour source is pending (see Open Questions; e.g. "Natürliche Aromen" appears on only one pack version).
* **Transition → 03**: fog thickens to black; a single droplet falls and its ripple opens the Formula chapter.

### CHAPTER 03 — DIE FORMEL *(The Formula)*

A pinned, horizontal sequence on desktop (4 panels, scroll-driven). Each ingredient has its **own micro-world**, unified by the same moon light and grid.

| Ingredient | Visual environment (metaphor — not a claim) | Verified text (only this, from current store) |
| --- | --- | --- |
| **L-Theanin** | A perfectly still liquid surface; a single tea leaf-like form lands, concentric ripples settle into calm — cool lavender tones. | "Ausgewählter Bestandteil der Vireli Rezeptur." |
| **Ashwagandha-Extrakt** | A sculptural root suspended in warm dusk light, slowly rotating; fine earth particles. | "Pflanzlicher Bestandteil der Rezeptur." |
| **Vitamin D** | "A captured sunrise at midnight": an eclipse-like ring of light behind a dark sphere. | "Trägt zu einer normalen Funktion des Immunsystems bei.*" |
| **Zink** | A faceted mineral / brushed-metal form with precise refractions, cold and exact. | "Trägt zu einer normalen kognitiven Funktion bei.*" |

* Typography: ingredient name huge in serif, chapter-index caps above, claim text small and precise. The `*` footnote is shown on screen with its exact text (pending from label).
* **No dosages, percentages or extra benefits** are shown until the label data is supplied — then they are rendered from Shopify metafields.
* Mobile: vertical stack, each ingredient a full-screen card with its own lightweight scene (or Higgsfield ingredient loop on tier 1).

### CHAPTER 04 — DAS PRODUKT *(The Product Reveal)*

* **Composition**: museum-like. Pouch centred on a slow turntable of dark polished stone; gummies arranged in a precise arc; a few berries as still-life. Split layout: 3D left 60 %, purchase panel right 40 %.
* **Interaction**: drag to rotate (inertia, limited tilt), double-click/tap to reset; hotspots on the printed badges (Melatoninfrei · Vegan · Ohne Zuckerzusatz) open short, verified explanations. A "Gummies" toggle brings a single gummy forward to macro view, rotatable.
* **Purchase panel** (live from Shopify): product title, price + "inkl. MwSt.", availability state ("Ausverkauft" handled elegantly with a "Benachrichtigen"-style option only if you add a back-in-stock app — otherwise a calm disabled state), quantity stepper, `In den Warenkorb`, shipping note pulled from Shopify settings/content (e.g. free shipping threshold — not hardcoded), accordion: *Zutaten · Nährwerte · Verzehrempfehlung · Hinweise* (all from metafields).
* **Fidelity rule**: the pouch is always the original artwork; we never alter, re-colour or animate its print.

### CHAPTER 05 — DAS RITUAL *(The Night Ritual)*

* **Composition**: a calm, high-end bedroom at night — linen, a stone nightstand, a glass of water, the pouch, a window with moonlight and a sheer curtain moving. One warm bedside lamp (`--ember`) is the only warm light on the entire site — the emotional climax.
* **Technique**: hybrid. Higgsfield lifestyle video as the window/room background plate (`VideoTexture`), with real 3D foreground (nightstand, pouch, glass, gummy) lit to match the plate, plus 2.5D parallax layers. This gives film-like richness while staying interactive (the pouch can still be touched/turned).
* **Copy**: a three-step ritual using only verified facts, e.g. `Abends.` → `1 Gummy.` → `Ruhe finden.` + "Einfach eine Gummie abends nehmen – und deinem Körper die Ruhe geben, die er verdient." (existing store copy; wording to be legally reviewed, see Open Questions).
* **Transition → 06**: the lamp switches off; only moonlight remains.

### CHAPTER 06 — DAS FINALE *(The Final Experience)*

* **Composition**: back to the void of Chapter 01 — the circle closes. The pouch rises slowly into the moon's light, the crescent behind it aligns with the crescent on the label (a deliberate "eclipse" moment).
* **CTA**: one sentence and one button, nothing else: "Bereit für deinen Abend?" + `Night Gummies kaufen — CHF {live price}`. Secondary link: "Mehr über Vireli".
* **Footer** (light `--moon-ivory` section): logo, Shop · Über Vireli · Kontakt, newsletter (Shopify customer marketing consent), legal links (Impressum, Datenschutz, AGB, Versand & Rückgabe), payment icons from Shopify.

---

## 7. Mobile art direction (not a shrunk desktop)

| Chapter | Mobile composition |
| --- | --- |
| 01 | Portrait framing: pouch large, top 60 % of screen; headline bottom-left over a navy fade. Tilt via gyroscope (opt-in, iOS permission) instead of cursor; tap pouch to spin. |
| 02 | Shorter flight (3 key "shots" instead of a continuous path); fewer, bigger berries; video plate carries more of the detail. |
| 03 | Vertical full-screen cards with snap; one lightweight scene active at a time. |
| 04 | 3D pouch on top (swipe to rotate), sticky bottom purchase bar (price + `In den Warenkorb`) always reachable by thumb. |
| 05 | Mostly the lifestyle video with a 3D pouch overlay; ritual steps as a swipeable strip. |
| 06 | Full-bleed pouch + moon; CTA button 56 px tall, full width. |

Touch targets ≥ 48 px, no hover-dependent information, sticky cart access, no scroll-jacking on mobile — pinned sections are short and always escapable.

---

## 8. Things we deliberately avoid

* Template sections, card grids with icons, generic "benefits" rows.
* Neon glows, heavy gradients, glassmorphism, lens-flare clichés.
* Stock photography; AI images that show a distorted or re-typed pouch.
* Health promises beyond the verified, authorised wording.
* Auto-playing sound, cursor hijacking, unskippable intros.

---

## 9. Open design decisions for you

1. Which pouch version is final — **A (cobalt blue, 3 badges)** or **B (violet, 4 badges)**? This sets the master palette.
2. Licensed fonts or free alternatives?
3. Ambient sound: yes (off by default) or no sound at all?
4. Languages at launch: German only, or also French / Italian / English?
5. Is "Gummy", "Gummie" or "Gummi" the house spelling? (The store uses "Gummie", the pack "Gummies".)
