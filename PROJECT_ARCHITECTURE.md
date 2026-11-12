# VIRELI — Project Architecture

Status: **Proposal — awaiting approval.** No application code has been written yet.
Date: 2026-11-12

---

## 1. Starting point (what exists today)

| Item | Finding |
| --- | --- |
| Repository | Empty apart from `README.md` (one initial commit). Nothing is overwritten by this proposal. |
| `/references/` | Did not exist. The 5 screenshots from the brief were saved to `references/screenshots-current-store/` (see `references/README.md`). |
| Current shop | Shopify Online Store theme at `vireli-rjmhlijj.myshopify.com`, CHF, German copy. Product "Vireli Night Gummies – Mixed Berry", CHF 34.90, currently **Sold out**. |
| Connected Shopify account in this workspace | Points to a **different** store: "Mein Shop" (`zsf03x-0u.myshopify.com`, CHF, trial plan, **0 products**). Before integration we must confirm which store is the production Vireli store. |
| Packaging | Two different pouch versions appear (see `references/README.md`). Final artwork must be confirmed. |

---

## 2. Decision: Next.js + Shopify Storefront API (headless) on Vercel

### 2.1 Options evaluated

| Criterion | Next.js 16 + Storefront API (Vercel) | Shopify Hydrogen (React Router 7, Oxygen) |
| --- | --- | --- |
| Fit for a **WebGL-first, single-product** experience | Excellent. R3F / Drei / GSAP ecosystem examples, tooling and talent are overwhelmingly Next/Vite based. | Good — R3F runs fine in Hydrogen too, but nothing in Hydrogen helps the 3D part. |
| Commerce primitives (cart, analytics, SEO helpers) | Built ourselves (small surface: 1 product, 1 cart, hosted checkout). `@shopify/hydrogen-react` helpers can still be used. | Built in (cart handler, analytics, consent, caching). Its strongest argument. |
| Hosting | Vercel: edge network, image optimisation, ISR / tag revalidation, preview deployments per branch. | Oxygen: included in Shopify plan, close to Shopify APIs. |
| Video / large media pipeline | Vercel Blob or external CDN (Mux / Cloudflare R2) — mature options. | External CDN required anyway. |
| Long-term flexibility (CMS, campaign micro-sites, other brands) | Very high. | Tied to Shopify's roadmap. |
| Lock-in / upgrade cadence | Next major roughly yearly. | Hydrogen tracks Storefront API quarterly (calendar versioning). |

### 2.2 Recommendation

**Next.js (App Router) + Shopify Storefront API, deployed on Vercel.**

The site is ~85 % immersive storytelling and ~15 % commerce (one product, one
cart, Shopify-hosted checkout). Hydrogen's advantages are concentrated in that
15 %, and they are easy to reproduce for a single-product store. Next.js gives
the better environment for the 85 % — and the brief explicitly asks for
Vercel. Shopify remains the system of record for everything commercial.

> If you prefer to avoid a Vercel bill entirely, Hydrogen/Oxygen is a valid
> fallback; the 3D layer described below would port over almost unchanged.

---

## 3. Technology stack (current stable, verified on npm 2026-11-12)

| Layer | Package | Version (pin at scaffold) | Purpose |
| --- | --- | --- | --- |
| Framework | `next` | 16.4.x | App Router, RSC, Server Actions, ISR, `next/image` |
| UI runtime | `react`, `react-dom` | 19.3.x | Note: R3F 9.8 peer range is `>=19 <19.4` — do not jump to 19.4 until R3F supports it |
| Language | `typescript` | 6.0.x | TS 7.0 (native compiler) is brand-new; adopt once Next tooling is confirmed compatible |
| 3D engine | `three` | 0.187.x | WebGL 2 renderer (WebGPU renderer evaluated later, not required) |
| React ↔ Three | `@react-three/fiber` | 9.8.x | Declarative scene graph, frame loop control |
| 3D helpers | `@react-three/drei` | 10.7.x | `useGLTF`, `KTX2`, `MeshTransmissionMaterial`, `MeshReflectorMaterial`, `PerformanceMonitor`, `AdaptiveDpr`, `Instances` |
| Post FX | `@react-three/postprocessing` | 3.2.x | Bloom, DOF, film grain, chromatic aberration (subtle), custom transition pass |
| Motion | `gsap` + `@gsap/react` | 3.15.x / 2.1.x | ScrollTrigger, SplitText, CustomEase — all GSAP plugins are free to use |
| Smooth scroll | `lenis` | 1.3.x | Synchronised with GSAP ticker; disabled for reduced motion |
| Styling | `tailwindcss` | 4.3.x | Design tokens via CSS variables (`@theme`) |
| State | `zustand` | 5.x | Scroll progress, active chapter, quality tier, cart drawer — shared between DOM and Canvas without re-renders |
| GPU tiering | `detect-gpu` | 5.x | Initial quality tier guess, refined at runtime by Drei `PerformanceMonitor` |
| Shopify | `@shopify/storefront-api-client` | 2.x | Typed GraphQL client for Storefront API |
| Shopify helpers | `@shopify/hydrogen-react` | 2026.x | `Money`, analytics + `useShopifyCookies`, Customer Privacy (consent) |
| Codegen | `@graphql-codegen/cli` + `@shopify/api-codegen-preset` | latest | Types generated from the Storefront schema |
| 3D asset pipeline | `@gltf-transform/cli`, `meshoptimizer`, KTX-Software (`toktx`) | 4.5.x / 1.3.x | Meshopt/Draco compression, KTX2/Basis textures, LOD generation |
| Dev perf | `r3f-perf` | 7.x | Dev-only GPU/CPU HUD |
| Testing | Playwright, Vitest | latest | E2E (cart → checkout handoff), visual snapshots, unit tests |
| Hosting | Vercel | — | Production + preview per branch |

Storefront API version: **`2026-10`** (latest stable quarterly release; reviewed each quarter).

---

## 4. High-level architecture

```
                         ┌──────────────────────────── Vercel ────────────────────────────┐
 Browser                 │                                                                 │
 ┌─────────────────────┐ │  Next.js App Router                                             │
 │ DOM layer (HTML)    │◄┼── RSC: product data, copy, SEO, JSON-LD (cached, tag "product") │
 │  · all copy & CTAs  │ │                                                                 │
 │  · purchase UI      │─┼─► Server Actions: cartCreate / cartLinesAdd / Update / Remove   │
 │  · cart drawer      │ │     (private Storefront token, never sent to the client)        │
 ├─────────────────────┤ │                                                                 │
 │ WebGL layer         │ │  Route Handler /api/revalidate  ◄── Shopify webhook            │
 │  · 1 persistent     │ │     (products/update, inventory_levels/update → revalidateTag) │
 │    <Canvas>         │ └─────────────────────────────────┬───────────────────────────────┘
 │  · chapter scenes   │                                   │ GraphQL (Storefront API 2026-10)
 │  · lazy-loaded      │                                   ▼
 └─────────────────────┘                     ┌──────────── Shopify ────────────┐
          │  "Zur Kasse" (cart.checkoutUrl)  │ Products · Variants · Prices    │
          └─────────────────────────────────►│ Inventory · Cart · Checkout     │
                                             │ Orders · Payments · Taxes       │
 Media CDN (Vercel Blob / Mux) ◄── videos    │ Metafields (label text, legal)  │
                                             └─────────────────────────────────┘
```

### 4.1 Two-layer rendering model

* **DOM layer** (server-rendered): every headline, paragraph, price and button
  exists as real HTML. This gives SEO, accessibility, instant LCP and a fully
  working page even if WebGL never loads.
* **WebGL layer** (client-only, dynamically imported): one fixed, full-viewport
  `<Canvas>` behind the DOM, mounted **after** first paint
  (`next/dynamic` with `ssr: false`, triggered on `requestIdleCallback` /
  first interaction). The hero shows an AVIF poster frame of the 3D scene as
  the LCP element; the canvas cross-fades over it once ready.

### 4.2 One world, one canvas, one camera

All six chapters live in a single Three.js scene graph ("The Vireli Night
Universe"). A single camera travels along authored spline paths. This avoids
context loss/re-creation, keeps transitions seamless and lets chapters share
lights, particles and the pouch model.

```
<Canvas>
  <QualityProvider/>              // tier 0–3, DPR clamp, feature flags
  <Lighting/>                     // shared moon key light + env map (KTX2 HDR)
  <CameraRig/>                    // spline path(s) driven by scroll progress
  <Pouch/>                        // single instance, re-parented/animated per chapter
  <Chapter01Night/>               // each chapter: lazy assets, mounted when within ±1 chapter
  <Chapter02Berries/>
  <Chapter03Formula/>
  <Chapter04Reveal/>
  <Chapter05Ritual/>
  <Chapter06Finale/>
  <Particles/>                    // GPU instanced, count by tier
  <PostFX/>                       // composer + custom transition shader pass
</Canvas>
```

* **Chapter lifecycle**: a chapter's assets are preloaded when the user is one
  chapter away, mounted when visible, and disposed (geometries, materials,
  textures, video elements) when two chapters away.
* **Frame loop**: `frameloop="demand"` when idle/off-screen, `always` while
  scrolling or interacting; render paused when the tab is hidden.

### 4.3 Scroll orchestration

* Lenis provides inertial scrolling; its RAF is driven by `gsap.ticker` so GSAP
  and Lenis share one clock.
* Each chapter is a DOM `<section>` with a pinned ScrollTrigger. A master
  timeline maps global progress → `cameraProgress`, chapter-local progress →
  scene uniforms. Values are written to a Zustand store **without React
  re-renders** (transient subscriptions read in `useFrame`).
* Text reveals (SplitText) and 3D animation share the same timeline so type and
  camera are choreographed together.
* Mobile uses `ScrollTrigger.normalizeScroll()` only where needed to prevent
  iOS address-bar jumps; Lenis touch smoothing is off on mobile (native feel).

### 4.4 Adaptive quality tiers

| Tier | Typical device | DPR | Particles | Post FX | Reflections | Shadows | Scenes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 3 | Desktop discrete GPU / M-series | ≤ 2 | ~40k | Bloom, DOF, grain, CA | Real-time reflector | Soft, contact | Full |
| 2 | Desktop iGPU, iPhone 15+/Pixel 8+ | ≤ 1.75 | ~12k | Bloom, grain | Reduced resolution | Baked + contact | Full, LOD1 |
| 1 | Older / mid-range phones | ≤ 1.25 | ~3k | Grain only | Baked env only | Baked | Simplified (fewer berries, no fog volume) |
| 0 | No WebGL 2, `prefers-reduced-motion`, Save-Data, or failure | — | — | — | — | — | **Cinematic fallback**: art-directed stills + optional muted video, cross-fades, all copy & commerce intact |

Initial tier from `detect-gpu`; Drei `PerformanceMonitor` lowers/raises it at
runtime based on measured FPS. A small "Motion: on/off" toggle is always
available in the UI.

### 4.5 Materials & shaders (planned)

| Object | Approach |
| --- | --- |
| Pouch | Modeled from the real dieline in Blender. `MeshPhysicalMaterial`: metalness + roughness map from foil, clearcoat for matte-lacquer areas, normal map for crinkle/seal texture. Label = **original artwork** as KTX2 texture — never re-typeset. |
| Gummies | Modeled from real macro photos. `MeshTransmissionMaterial` (tier 3) / physical transmission with thickness + attenuation colour (tier 2) / matcap (tier 1). |
| Berries | Photogrammetry-quality GLBs, instanced. Custom subsurface approximation (wrap lighting + thickness map) for raspberries/strawberries. |
| Atmosphere | Custom shaders: height fog, volumetric moon shaft (raymarched cone, tier 3 only), GPU particle "star dust" with curl noise. |
| Transitions | Full-screen post pass: organic ink/liquid dissolve driven by noise + scroll progress. |
| Video in 3D | Higgsfield clips used as `VideoTexture` on planes/backdrops inside the 3D scene (e.g. the window plate in Ch. 05) — never as a replacement for the interactive scene. |

---

## 5. Shopify integration

### 5.1 Responsibilities

Shopify remains the single source of truth for **products, prices, variants,
inventory, cart, checkout, payments, taxes, shipping, orders and customers.**
The website never hardcodes a price, never computes totals and never
implements checkout. CHF 34.90 in the brief is a reference only; the site
renders whatever the Storefront API returns.

### 5.2 Setup steps (one-time, in Shopify Admin)

1. Confirm the production store (see §1 — the connected account currently points to a different, empty trial store).
2. Install the **Headless** sales channel → create a storefront → obtain the **public** and **private** Storefront API tokens.
3. Publish the product to the Headless channel.
4. Create **metafields** on the product (namespace `vireli`) for content that must stay legally identical to the label: `ingredients`, `nutrition_table`, `recommended_intake`, `warnings`, `claims_footnote`, `allergens`. The site renders them; nobody re-types label text into code.
5. Webhooks → `products/update`, `inventory_levels/update` → `https://<site>/api/revalidate` (HMAC verified).
6. Domains: `vireli.ch` (or chosen domain) → Vercel. A subdomain such as `shop.vireli.ch` → Shopify, used for checkout and customer accounts. The old Online Store theme is put behind a password / redirects to the new site.
7. Upgrade from trial plan before launch (required to sell).

### 5.3 Data flow

| Operation | Where | How |
| --- | --- | --- |
| Product, variants, price, availability, media, metafields | Server Component | Storefront query, cached with tag `product:<handle>`, revalidated by webhook (fallback revalidate 300 s) |
| Live availability right before purchase | Server Action | Uncached query on add-to-cart |
| Cart | Server Actions | `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`, `cartBuyerIdentityUpdate`; cart ID in an `httpOnly`, `secure`, `sameSite=lax` cookie |
| Checkout | Shopify | Redirect to `cart.checkoutUrl` (Shopify-hosted checkout — payments, TWINT / cards, VAT, shipping rules such as "free shipping from CHF 60" remain in Shopify) |
| Accounts (optional) | Shopify | Customer Account API (hosted login) — link only, Phase 8 |
| Analytics & consent | Client | `@shopify/hydrogen-react` analytics + Customer Privacy API; cookie banner compliant with Swiss revDSG (and GDPR for EU visitors) |
| SEO | Server | `Product` JSON-LD generated from live data (price, availability), OpenGraph images |

### 5.4 Credentials & security

* `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` lives only in Vercel server env; all cart mutations run server-side and forward `Shopify-Storefront-Buyer-IP`.
* The optional public token is the only Shopify value ever exposed with `NEXT_PUBLIC_`.
* Webhook HMAC verification with `SHOPIFY_WEBHOOK_SECRET`.
* No Admin API token is needed by the website.
* `.env.local` is git-ignored; `.env.example` documents every variable.
* Security headers (CSP allowing Shopify CDN + media CDN only), rate limiting on Server Actions.

---

## 6. Proposed repository structure (created in Phase 1, not now)

```
/
├─ app/
│  ├─ layout.tsx                 # fonts, tokens, providers, Lenis
│  ├─ page.tsx                   # the six chapters (DOM layer)
│  ├─ produkt/[handle]/page.tsx  # SEO-complete classic PDP (also the no-JS / tier-0 path)
│  ├─ (legal)/impressum|datenschutz|agb|versand/
│  └─ api/revalidate/route.ts
├─ src/
│  ├─ chapters/                  # 01-night … 06-finale: DOM section + scene component each
│  ├─ webgl/
│  │  ├─ Experience.tsx          # the single Canvas
│  │  ├─ camera/  quality/  postfx/  shaders/  materials/  objects/
│  ├─ motion/                    # GSAP setup, eases, ScrollTrigger orchestration, Lenis
│  ├─ commerce/                  # storefront client, queries, cart actions, codegen types
│  ├─ components/                # DOM UI: Button, PriceTag, CartDrawer, Accordion…
│  ├─ content/                   # copy (de-CH), asset manifest (assets.ts)
│  └─ store/                     # zustand stores
├─ public/assets/                # web-ready, compressed assets (see ASSET_GUIDE.md)
├─ references/                   # brand source of truth (not shipped)
└─ docs (the *.md files in root)
```

---

## 7. Performance architecture

| Budget | Target |
| --- | --- |
| LCP (mobile, 4G) | < 2.0 s — poster image in DOM, fonts preloaded, 3D deferred |
| INP | < 200 ms — no heavy work on the main thread during input; draco/KTX decode in workers |
| CLS | 0 — fixed media aspect boxes, font `size-adjust` fallbacks |
| Initial JS (DOM shell) | < 150 kB gzip |
| 3D chunk | < 350 kB gzip JS (three + r3f + drei tree-shaken) — loaded after LCP |
| Hero 3D payload | Desktop ≤ 4 MB, mobile ≤ 1.8 MB (meshopt + KTX2) |
| Videos | Per loop ≤ 3 MB desktop / ≤ 1.2 MB mobile; HEVC/AV1 + H.264 fallback; `preload="none"` until the chapter is near |

Techniques: dynamic imports per chapter, `useGLTF.preload` one chapter ahead,
KTX2 transcoding in a worker, instancing for berries/gummies/particles, baked
lighting where possible, explicit `dispose()` on unmount, `IntersectionObserver`
to pause videos and the render loop off-screen, `prefers-reduced-motion`
and `Save-Data` respected, WebGL context-loss handling with graceful fallback
to tier 0.

---

## 8. Quality, testing, delivery

* **CI** (GitHub Actions): typecheck, lint, unit tests, Playwright E2E on preview URL (add to cart → checkout URL reached), Lighthouse CI budgets.
* **Device matrix**: iPhone 12 / 15 Pro (Safari), Pixel 7, Samsung A-series mid-range, iPad, MacBook Air M1, Windows iGPU laptop, desktop discrete GPU. Chrome, Safari, Firefox, Edge.
* **Accessibility**: WCAG 2.2 AA for all DOM content, canvas `aria-hidden`, focus management in cart drawer, motion toggle.
* **Environments**: `main` → production, every branch → Vercel preview.
