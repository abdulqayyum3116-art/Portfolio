# Dr. Shahzaib Hamid — Personal Brand Site

A statically-exported **Next.js 14 (App Router, TypeScript)** site for Dr. Shahzaib Hamid, Founder & CEO of [CodeSquad](https://codesquad.ai). Tagline: *Found, Chosen, Booked.*

## Quick Start

```bash
npm install
npm run dev       # → http://localhost:3000
```

## Build & Export

```bash
npm run build     # Generates /out static export
```

Deploy the `/out` folder to any static host (Vercel, Netlify, Cloudflare Pages).

---

## How to Deploy to Vercel

1. Push the `shahzaib-hamid/` folder to a GitHub repo.
2. Import the repo in [vercel.com](https://vercel.com).
3. Set **Root Directory** to `shahzaib-hamid` (if the repo root is the workspace).
4. Add the environment variables (see below).
5. Click **Deploy**. Vercel auto-detects Next.js static export.

---

## Environment Variables

Create a `.env.local` file (already included with placeholders):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_BOOKING_URL` | Calendly / Cal.com link for all "Book a Roadmap Call" buttons |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO meta tags and sitemap |

Example:
```
NEXT_PUBLIC_BOOKING_URL=https://calendly.com/code_squad/30min
NEXT_PUBLIC_SITE_URL=https://shahzaibhamid.com
```

---

## Swapping Photos

The two portraits of Dr. Shahzaib Hamid are in:

```
public/images/
  shah-portrait.webp   ← Portrait (head & shoulders) — used in the About section
  shah-wide.webp       ← Wide/stage photo — used in the hero collage (top blob)
```

To replace:
1. Drop your new `.webp` (or `.jpg`) files in `public/images/`.
2. Either keep the same filenames **or** update the `src` props in:
   - `components/Hero.tsx` — `<Image src="/images/shah-wide.webp" …>`
   - `components/About.tsx` — `<Image src="/images/shah-portrait.webp" …>`
3. Run `npm run build` to verify.

**Recommended sizes:**
- `shah-wide.webp` → 1200 × 800 px minimum (landscape)
- `shah-portrait.webp` → 800 × 1000 px minimum (portrait)

---

## Changing the Booking Link

All "Book a Roadmap Call" buttons read from the `NEXT_PUBLIC_BOOKING_URL` env variable.

1. Open `.env.local`.
2. Replace the value:
   ```
   NEXT_PUBLIC_BOOKING_URL=https://your-calendly-or-cal-link
   ```
3. Restart the dev server or redeploy.

---

## Project Structure

```
app/
  layout.tsx        Root layout: fonts, metadata, JSON-LD schema
  page.tsx          Main page (assembles all sections)
  globals.css       Design tokens + base styles + keyframes
  sitemap.ts        Auto-generated sitemap.xml

components/
  Nav.tsx / .module.css
  Hero.tsx / .module.css        Headline stagger, wavy underline, collage parallax
  LogosStrip.tsx / .module.css  Marquee + count-up followers
  LeakCards.tsx / .module.css   Found/Chosen/Booked cards with scroll animations
  SignalGraphic.tsx / .module.css  Gait analysis SVG section
  About.tsx / .module.css       Portrait, beliefs grid
  Ways.tsx / .module.css        The Build + Growth Retainer cards
  CTA.tsx / .module.css         Booking CTA with animated gradient
  Footer.tsx / .module.css
  Doodles.tsx / .module.css     Reusable SVG doodles (PlusSign, ECGPulse, etc.)

public/
  images/           Portrait photos
  robots.txt
```

---

## Accessibility & SEO

- One `<h1>` per page, semantic heading hierarchy
- All images have `alt` text
- Visible focus states (`outline: 3px solid #F06C9B`)
- `prefers-reduced-motion` respected — all non-essential animations disabled
- JSON-LD: `Person` (Dr. Shahzaib Hamid) + `Organization` (CodeSquad)
- Auto-generated `sitemap.xml` and `robots.txt`
- Open Graph + Twitter Card meta tags

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| Next.js | 14 (App Router) | SSG/SSR, routing, image optimisation |
| TypeScript | 5 | Type safety |
| Framer Motion | 11 | UI & scroll animations |
| next/font | built-in | Zero-CLS font loading |

Fonts: **Fraunces** (variable, soft/wonky), **Caveat** (handwritten), **DM Sans** (body)
