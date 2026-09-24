# YAZIMAO — Brand Assets (v1, symbol locked)

Vector source for the YAZIMAO identity.

> **Owner decision (2026-09-19): variant C selected** — the diagonal plume cradled by the mirrored
> geometric hands. This is the identity master in the files below.
> Variants A (visible fingers) and B (upright feather) are kept only as alternates for the record.

**Nothing here is wired into the site.** No file in `components/`, `app/` or `public/` has been changed.

## Deliverables

| File | Use |
|---|---|
| `yazimao-symbol.svg` | **Main symbol** (icon only), transparent, dark-mode first |
| `yazimao-logo-horizontal.svg` | **Wordmark lockup** (symbol + `YAZIMAO` + cyan rule) |
| `yazimao-app-icon.svg` | **App icon master** (512×512 squircle plate) |
| `yazimao-header-dark.svg` | **Dark header lockup** (renders 30–40px tall in the navbar) |
| `social/og-source.svg` | Open Graph card source (1200×630) |
| `social/banner-source.svg` | X / social banner source (1500×500) |
| `social/avatar-source.svg` | Social avatar master (400×400, circle-crop safe) |
| `variants/symbol-fingers.svg` | Alternate A — not selected |
| `variants/symbol-upright.svg` | Alternate B — not selected |
| `preview.html` | Review sheet (sizes, monochrome, header in situ, variants) |

## Exported PNG (`export/`, from variant C)

| File | Size | Target |
|---|---|---|
| `app-icon-512.png` | 512×512 | app icon / PWA |
| `apple-touch-180.png` | 180×180 | `apple-touch-icon` |
| `og-1200x630.png` | 1200×630 | `og:image` / X card |
| `social-avatar-400.png` | 400×400 | X avatar |
| `social-banner-1500x500.png` | 1500×500 | X header |
| `symbol-512-transparent.png` | 512×512 | transparent master |
| `symbol-48-transparent.png`, `symbol-32-transparent.png` | 48 / 32 | raster favicons (fallback) |

## Concept

- **Two geometric hands** — mirrored tapered crescents; not realistic, no religious gesture, no coin or ticker motifs.
  Creators and community: two palms, one shared hold.
- **Feather** — the YAZIMAO mark, carrying *Every Creation Matters*. Set diagonally (24°) so the silhouette reads
  as a plume rather than a lens or an eye.
- **Node chain inside the feather** — 4 cyan nodes linked along the shaft: creations *recorded → connected → verified*.
  Deliberately sparse: no dense circuitry, no generic cubes.

## Colour

| Token | Value | Role |
|---|---|---|
| Hand silver | `#FFFFFF → #E7ECF6 → #A3B1C7` | human / community |
| Feather | `#FFFFFF → #F5F8FF → #B4C1D6` | creation |
| Cyan accent | `#7DF9FF → #22D3EE` | on-chain network (matches site `nova-cyan`) |
| Plate | `#0A0F1C → #04060B` | app icon / social background |

## Readability findings (measured on the review sheet)

| Variant | Reads as | 16–24px |
|---|---|---|
| A · fingers | A hand holding a feather — most literal | fingers merge |
| B · upright | Cleanest silhouette, least "hands" | best |
| **C · diagonal (selected)** | A plume cradled by a two-part geometric base — most premium | good (nodes blur into one cyan dot) |

## Production notes

1. **Wordmark** uses live `<text>` (Space Grotesk stack) so previews match the site header. Convert to outlines
   before third-party use (X, decks, print). The exported PNGs fall back to the system font when Space Grotesk
   is not installed — acceptable for these drafts, outline before final print use.
2. **Small sizes:** at ≤24px the four nodes blur into one cyan dot; the silhouette still carries the mark.
3. **Dark-mode first:** white/silver on deep black. On light backgrounds the mark must be recoloured
   (dark ink + cyan), never reused as-is.
4. Do not add coin, price, ticker or rocket motifs.

## Wiring (requires Owner approval — not done)

1. Copy `export/` files into `public/` (`icon.svg`, `favicon.svg`, `apple-touch-icon.png`, `og.png`,
   `twitter-avatar.png`, `twitter-banner.png`).
2. Update `components/visual/YazimaoSymbol.tsx` (currently `next/image` → `/logo-feather.png`) and
   `public/logo-feather.png`.
3. Update `config/site.ts` `ogImage` if the OG filename changes.

Steps 1–3 change the live site, so they are deliberately untouched.
