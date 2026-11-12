# Vireli — Night Gummies · Luxury Wellness Experience

A single-product storefront for **Vireli Night Gummies – Mixed Berry** (CH/DACH, German, CHF).
It is plain HTML, CSS and JS with no build step and no dependencies, so it can be hosted anywhere:
Netlify, Vercel, Cloudflare Pages, GitHub Pages, or any static host.

```
index.html              page markup, SEO meta, Product JSON-LD
assets/css/styles.css   design system and every section
assets/js/main.js       motion, scroll scenes, gallery, cart → Shopify checkout
assets/img/             product photography + Higgsfield-generated stills
assets/img/float/       transparent berries & gummies (floating elements)
assets/video/           Higgsfield/Kling cinematic loops (H.264, muted)
```

Preview locally:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Sections

1. **Hero:** a cinematic looping video (separate desktop 16:9 and mobile 9:16 versions), an animated aurora, particles, floating berries/gummies with pointer parallax, and a camera push-in on scroll.
2. **Product reveal:** a sticky 3-screen scroll scene. The pouch moves to centre, zooms toward the camera and dissolves into light. Gummies then burst out, and a slow-motion gummy film opens to full screen.
3. **Marquee:** product attributes.
4. **Ingredients:** four cards with macro visuals (L-Theanin, Ashwagandha, Vitamin D, Zink). On hover or tap they tilt and reveal their text.
5. **Product:** a gallery with 3D tilt and glare, price, attributes, availability, quantity, add to cart, and accordions (ingredients, use, notes, shipping).
6. **Lifestyle:** a bedroom-at-night film with parallax and three ritual steps.
7. **Brand story:** the text lights up word by word as you scroll, followed by five pillars.
8. **Final CTA:** a moonlight film, floating gummies, and the CTA.
9. **Footer:** the newsletter posts to the Shopify customer form.
10. **Cart drawer:** a progress bar toward free shipping at CHF 60, then a hand-off to Shopify checkout.

Every animation respects `prefers-reduced-motion`. Videos load lazily, only play while visible, and are skipped on Save-Data.

## Connecting the Shopify store

Open `assets/js/main.js` and edit `CONFIG` at the top:

| key | meaning |
| --- | --- |
| `shopDomain` | `vireli-rjmhlijj.myshopify.com`, or your own domain once connected |
| `productHandle` | the product's URL handle (Shopify Admin → Products → *Search engine listing*) |
| `variantId` | numeric variant ID. When set, **Zur Kasse** opens checkout with the chosen quantity (`/cart/{variantId}:{qty}`) |
| `available` | `false` shows *Ausverkauft* and disables the button |

> The live Shopify product currently shows **Sold out**. Add inventory in Shopify, or set `available: false`.

## Content & compliance notes

- The only health claims used are the two already on the current Vireli site. Both are EU/CH-authorised claims, for Vitamin D (immune system) and Zink (cognitive function), and both carry the required footnote. L-Theanin and Ashwagandha are described neutrally with no effect claims.
- Nothing has been invented: no reviews, ratings, certifications, lab results, dosages or delivery times.
- The full ingredient list and nutrition table point to the packaging. Add them once they are final.
- Swiss spelling is used throughout (ss instead of ß).
- The footer links to Impressum / Datenschutz / AGB / Versand currently point to `#`. Replace them with your Shopify policy URLs.

## Visual assets

Two product photos are taken from the existing store:

- `product-scene.webp`
- `detail-front.webp`

These assets were generated with **Higgsfield**, using the original product photos as references so the packaging stays accurate:

| file | model |
| --- | --- |
| `hero-desktop.webp` / `hero-mobile.webp` (+ `.mp4`) | GPT Image 2.6 → Kling 4.0 |
| `gummies-macro.webp` (+ `gummies.mp4`) | GPT Image 2.6 → Kling 4.0 |
| `lifestyle-bedroom.webp` (+ `lifestyle.mp4`) | GPT Image 2.6 → Kling 4.0 |
| `final-moon.webp` (+ `final.mp4`) | GPT Image 2.6 → Kling 4.0 |
| `ing-*.webp` | GPT Image 2.6 |
| `pouch-cutout.webp`, `float/*.webp` | GPT Image 2.6 (transparent) |

Each video starts and ends on the same frame, so the loops are seamless.
