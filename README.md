# Aurum

A digital atelier storefront — built as a foundation for a luxury e-commerce
experience: restrained motion, glass surfaces, and depth over decoration.

## Stack

- **Next.js 15** (App Router, Turbopack) / **React 19** — server components by
  default, client components only where interaction requires it
- **Tailwind CSS v4** — CSS-first theme (`app/globals.css`) defines the full
  design system: palette, type, easing curves, keyframes
- **Framer Motion** — scroll-linked parallax, magnetic hover, tilt/depth,
  staggered reveals
- **Lenis** — smooth, inertial document scrolling
- **Lucide** — icons

## Structure

```
app/                  routes, root layout, global styles
components/
  motion/             reusable motion primitives (Reveal, Magnetic, TiltCard,
                       AuroraBackground, CursorGlow, SmoothScroll)
  layout/              Navbar, Footer, NewsletterForm
  sections/            Hero, ProductShowcase, Philosophy, Atelier
lib/                   shared utilities (cn)
```

## Development

```bash
npm install
npm run dev       # start dev server (Turbopack)
npm run build     # production build
npm run lint      # eslint
npm run typecheck # tsc --noEmit
```

## Design system notes

- All brand colors, fonts, easing curves, and keyframes live as CSS custom
  properties in `app/globals.css` under `@theme` — extend the palette there,
  not in component files.
- Motion primitives in `components/motion/` are the building blocks for every
  interaction (reveal-on-scroll, magnetic buttons, tilting cards, the aurora
  background, the cursor glow). New sections should compose these rather than
  hand-rolling new animation logic.
- Reduced-motion is respected globally via a `prefers-reduced-motion` media
  query in `globals.css`.
