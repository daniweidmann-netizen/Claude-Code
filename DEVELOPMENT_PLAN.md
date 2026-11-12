# VIRELI — Development Plan

Status: **Proposal — awaiting approval.** Implementation starts only after
you approve `PROJECT_ARCHITECTURE.md` and `DESIGN_DIRECTION.md`.

---

## 1. Approach

Agency-style, in phases with **approval gates**. Commerce works first (so the
site is always sellable), then a single chapter is taken to final quality as a
**vertical slice** before the rest is built. This catches taste and
performance problems early, when they are cheap.

```
P0 Discovery ─► P1 Foundations ─► P2 3D look-dev ─► P3 Vertical slice (Ch.01) ─► GATE
                                                                            │
     P8 Launch ◄─ P7 Hardening ◄─ P6 Ch.05–06 ◄─ P5 Ch.04 + commerce UI ◄─ P4 Ch.02–03
```

---

## 2. Phases

### P0 — Discovery & direction ✅ (this delivery)
* Repo analysed (empty), references collected, packaging inconsistencies found.
* Architecture, design direction, asset guide, env template.
* **Gate:** your approval + answers to §4 Open Questions.

### P1 — Foundations
* Scaffold Next.js 16 / TS / Tailwind 4, lint, format, CI, Vercel project + previews.
* Design tokens (colour, type scale, spacing, eases), font loading, base layout, header, cart drawer.
* Shopify: codegen, product query, metafields, Server Actions for cart, checkout handoff, webhook revalidation, `Product` JSON-LD.
* Classic, fully functional product page `/produkt/[handle]` (also the tier-0 / no-JS path).
* Legal page shells (content supplied by you / Shopify policies).
* **Deliverable:** a plain but elegant, working storefront on a preview URL: add to cart → Shopify checkout.

### P2 — 3D pipeline & look-dev
* Asset pipeline scripts (gltf-transform: meshopt, KTX2, LODs) + asset manifest.
* Pouch model from the real dieline; gummy model from macro photos; berry set.
* Look-dev sandbox route (`/lab`, not indexed): lighting, foil material, gummy transmission, berry subsurface, fog, particles, post FX.
* Quality-tier system (detect-gpu + PerformanceMonitor), tier-0 fallback renderer.
* **Deliverable:** turntable renders of pouch / gummy / berries for approval of material fidelity.

### P3 — Vertical slice: Preloader + Chapter 01
* Moon-crescent preloader, hero composition, cursor/gyro interaction, scroll camera, headline choreography, "fall through the label" transition prototype.
* Mobile art direction of Ch. 01, performance budget verified on real devices.
* **GATE (most important):** you review the slice on desktop and phone. Direction is locked here.

### P4 — Chapters 02 & 03
* Berry Dimension fly-through, video plate integration, ink transition.
* Four ingredient micro-worlds, horizontal pinned sequence (desktop) / vertical cards (mobile).

### P5 — Chapter 04 + commerce UI
* Product reveal scene, drag-rotate, hotspots, gummy macro view.
* Purchase panel bound to live data, sold-out state, sticky mobile buy bar, cart drawer polish, accordions from metafields.

### P6 — Chapters 05 & 06
* Bedroom hybrid scene (video plate + 3D foreground), lamp-off transition, finale eclipse moment, footer.

### P7 — Hardening
* Performance: bundle analysis, LCP/INP/CLS on device matrix, memory/dispose audit, context-loss tests.
* Accessibility audit (WCAG 2.2 AA), reduced motion, keyboard.
* Cross-browser/device QA, Playwright E2E, Lighthouse CI budgets.
* SEO: metadata, OG images, sitemap, structured data validation.

### P8 — Launch
* Shopify plan upgrade (the connected store is on trial), Headless channel in production store, domains (site on Vercel, checkout subdomain on Shopify), redirects from the old theme, analytics + consent, monitoring (Vercel Analytics / Speed Insights), go-live checklist.

---

## 3. Missing assets & credentials (blocking items in bold)

### From you — brand / product
| # | Item | Needed by |
| --- | --- | --- |
| 1 | **Which pouch version is final (A or B)?** | P2 |
| 2 | **Print artwork / dieline of the pouch, front + back (PDF/AI)** | P2 |
| 3 | **Vector logo (SVG/AI)** | P1 |
| 4 | Photos of the real pouch (6 angles) + dimensions in mm | P2 |
| 5 | Macro photos of real gummies + dimensions, colour, shape | P2 |
| 6 | **Complete label text**: ingredients, nutrition / per-gummy amounts, intake recommendation, warnings, `*` footnote, producer | P5 (and for compliance review) |
| 7 | Legal texts: Impressum, Datenschutzerklärung, AGB, Versand & Rückgabe | P8 |
| 8 | Font licences (if licensed fonts are chosen) | P1 |

### From you — Higgsfield (see `ASSET_GUIDE.md`)
Hero plate, berry world plate, gummy macro loop, 4 ingredient loops, lifestyle/bedroom plate, final reveal plate. Placeholders are used until delivered.

### Credentials / access
| Item | Where |
| --- | --- |
| **Confirm the production Shopify store** — the connected account is "Mein Shop" (`zsf03x-0u.myshopify.com`, trial, 0 products), not the `vireli-rjmhlijj` store in the screenshots | Shopify |
| **Storefront API private token** (+ optional public token) from the Headless channel | Shopify Admin → Headless |
| Webhook secret | Shopify Admin → Notifications → Webhooks |
| Vercel account / team access | Vercel |
| Domain + DNS access | Registrar |
| Media CDN (Vercel Blob or Mux) | Vercel / Mux |

All secrets go into Vercel environment variables — never into the repo or chat.

---

## 4. Compliance notes & open questions (please review)

These come from inspecting the references. They are flagged, not resolved —
nothing here is legal advice; please check with your Swiss food-law advisor.

1. **"Zuckerfrei" vs "Ohne Zuckerzusatz"** — the current home page icon row says *Zuckerfrei*, the pack says *Ohne Zuckerzusatz*. These are different nutrition claims with different legal conditions. The new site will use **"Ohne Zuckerzusatz"** only, unless you confirm *zuckerfrei* is valid for the product.
2. **"Für einen entspannten Geist und erholsamen Schlaf"** (pack tagline) is a general health-related statement. In Switzerland (LIV) and the EU such statements generally need to be accompanied by an authorised specific claim. Please confirm this wording has been reviewed; the site will reproduce it only as printed on the approved pack and will not add any sleep/stress promises.
3. **Ashwagandha** — regulatory status and required warnings differ between countries (and have been tightened in some EU states). Confirm it is permitted for sale in CH (and any export markets) and which warnings must appear.
4. **Supplement mandatory information** (Swiss ordinance on food supplements): recommended daily dose, warning not to exceed it, "not a substitute for a varied diet", "keep out of reach of children" — must appear on the product page. Exact wording will be rendered from the label data you supply.
5. **The `*` footnote** next to the Vitamin D and Zinc claims — what is its exact text?
6. **"Natürliche Aromen"** appears only on pack version B. Should it be communicated?
7. **Is the product actually berry-flavoured with real fruit, or flavoured?** Determines what Chapter 02 may say. Until then it says only "Mixed Berry".
8. **Product is "Sold out"** in Shopify — the site will display Shopify's live state. Do you want a back-in-stock notification app at launch?
9. **Free shipping threshold "ab 60 CHF"** — confirm it is configured as a Shopify shipping rule; the site will display it as content, not calculate it.
10. Spelling: "Gummy" / "Gummie" / "Gummi"?
11. Launch languages (de-CH only, or + fr / it / en via Shopify Markets & translations)?
12. Domain name for the new site?

---

## 5. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| No print-ready packaging artwork → 3D pouch cannot be faithful | Blocking item; until then a clearly labelled neutral placeholder pouch is used ("Artwork pending"), never an invented label. |
| AI video distorts the pouch / its text | Higgsfield videos must not contain the pouch unless generated from the real packshot and approved frame-by-frame. 3D handles all product shots. |
| Mobile GPU / battery | Tier system, tier-0 fallback, frame-loop on demand, budgets enforced in CI. |
| Scroll-heavy UX hurts usability/SEO | All content in DOM, skip-to-product link, short pinned sections, classic PDP route. |
| Shopify API version drift | Pinned version, quarterly review, codegen types fail the build on breaking changes. |
| Scope creep | Vertical-slice gate; each chapter has a definition of done (design approved, desktop+mobile, budgets met, a11y checked). |

---

## 6. Definition of done (per chapter)

* Matches approved storyboard on desktop **and** separately art-directed mobile.
* Meets tier budgets (60 fps tier 3, ≥ 50 fps tier 2, ≥ 30 fps tier 1) on the device matrix.
* Tier-0 version complete and beautiful.
* All copy in DOM, verified against the approved claim list.
* Resources disposed on exit; no memory growth after 3 full scroll passes.
* Reviewed and approved by you.
