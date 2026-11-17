# Dr. Shahzaib Hamid — Personal Brand Site

A statically-exported **Next.js 16.4.6 (App Router, TypeScript)** site for Dr. Shahzaib Hamid, Founder & CEO of [CodeSquad](https://codesquad.ai). Tagline: *Found, Chosen, Booked.*

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
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO meta tags and sitemap |
| `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`) | Supabase project URL — blog posts for the Learning Hub are read from here **at build time** |
| `SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`) | Supabase anon key (RLS must allow `select` on published posts) |
| `SUPABASE_POSTS_TABLE` | Optional — table name, defaults to `posts` |

Example:
```
NEXT_PUBLIC_SITE_URL=https://shahzaibhamid.com
```

---

## Swapping Photos

The two portraits of Dr. Shahzaib Hamid are in:

```
public/images/
  shah-portrait.webp   ← Portrait (head & shoulders) — used in the About section
  shah-headshot.webp       ← Wide/stage photo — used in the hero collage (top blob)
```

To replace:
1. Drop your new `.webp` (or `.jpg`) files in `public/images/`.
2. Either keep the same filenames **or** update the `src` props in:
   - `components/Hero.tsx` — `<Image src="/images/shah-headshot.webp" …>`
   - `components/About.tsx` — `<Image src="/images/shah-portrait.webp" …>`
3. Run `npm run build` to verify.

**Recommended sizes:**
- `shah-headshot.webp` → 1200 × 800 px minimum (landscape)
- `shah-portrait.webp` → 800 × 1000 px minimum (portrait)

---

## Changing the Booking Link

All booking buttons import `bookingUrl` from `lib/booking.ts`. Edit that constant and rebuild to change the destination. The current call is 30 minutes; keep the hero and CTA copy aligned with the event duration.

---

## Learning Hub (`/learn`)

Blogs, YouTube videos and Shorts in one place:

| Route | Source |
|---|---|
| `/learn/` | Searchable library with format/topic filters and six resources per page |
| `/learn/blog/` and `/learn/blog/[slug]/` | Supabase table (`SUPABASE_POSTS_TABLE`, default `posts`) |
| `/learn/videos/` | `content/videos.ts` entries with `kind: 'video'` |
| `/learn/shorts/` | `content/videos.ts` entries with `kind: 'short'` |

All resource archives also support search, topic filtering and six results per page.

### Blog posts (Supabase)

`lib/blog.ts` fetches the table through Supabase's REST API during `next build`. `mapRow()` accepts common column
names (`title`, `slug`, `content`/`body`, `excerpt`/`summary`, `cover_image`, `tags`, `published_at`, `status`, …);
edit it if your schema differs. Rows with `status != 'published'`, `published = false` or `draft = true` are skipped.
A post's `youtube` link is embedded at the top of the post and added to `/learn/videos/` automatically.
HTML and Markdown bodies are sanitized through an allowlist. Markdown is parsed with `marked`; unsafe scripts, event handlers, and URL schemes are removed.

**Publishing a new blog post:** because the site is a static export, a new post goes live on the next build.
Production builds require Supabase configuration and fetch fresh CMS data. Missing credentials or request failures stop the build rather than silently removing articles. Development can run without credentials.

Automate this with a Supabase **Database Webhook** (on INSERT/UPDATE of the posts table) that POSTs to your
Vercel/Netlify **deploy hook** URL.

### Adding a video or Short

Append an entry to `content/videos.ts`: paste the YouTube ID (after `v=` or `/shorts/`), title, `kind`, `topic`
and `publishedAt`. Players are click-to-load (`youtube-nocookie.com`), so pages stay fast.

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
- Site-owned images have `alt` text; imported CMS images should include descriptive alternative text
- Visible focus states (`outline: 3px solid #F06C9B`)
- `prefers-reduced-motion` respected — all non-essential animations disabled
- JSON-LD: `Person` (Dr. Shahzaib Hamid) + `Organization` (CodeSquad)
- Auto-generated `sitemap.xml` and `robots.txt`
- Open Graph + Twitter Card meta tags

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| Next.js | 16.4.6 (App Router) | SSG/SSR, routing, image optimisation |
| TypeScript | 5 | Type safety |
| Framer Motion | 14 | UI & scroll animations |
| next/font | built-in | Zero-CLS font loading |

Fonts: **Fraunces** (variable, soft/wonky), **Caveat** (handwritten), **DM Sans** (body)

## Regression checks

After `npm run build`, run `node tests/site-check.mjs` to check content sanitization, Markdown formatting, archive filters/pagination, mobile menu interactions, CMS configuration and exported metadata.

The shared preview image is `public/og-image.jpg`; its editable vector source is `public/images/social-card.svg` (1200 ? 630). Regenerate the JPEG after changing the source.
