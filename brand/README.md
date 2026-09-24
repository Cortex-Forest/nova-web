# YAZIMAO — Brand Assets

**Identity: "orbit" (v2).** Source of truth is the owner-supplied reference render
(`Desktop\16656.jpg`); the live logo is a transparent cut-out of that mark.

## Current assets

| File | Role |
|---|---|
| `export/logo-cutout-1024.png` | **Master**: transparent, tightly cropped, square (from the reference) |
| `export/logo-cutout-512.png`, `-256.png` | Scaled masters |
| `yazimao-symbol-orbit.svg` | Vector interpretation of the same mark (scalable alternative, **not wired**) |
| `compare-orbit.html` | Review sheet: reference vs vector vs cut-out, plus small sizes |
| `tools/cutout-reference.py` | Luminance-keyed cut-out → transparent PNG masters |
| `tools/build-assets.py` | Builds `public/logo-yazimao.png`, `public/favicon.svg`, `public/icon.svg`, `public/og.svg` |
| `tools/fit-ellipse.py` | Measures the reference (tilt, axis ratio, band profile) — numbers below |
| `tools/trace-band.py`, `tools/fit-and-generate.py`, `tools/generate-symbol.py` | Vector reconstruction experiments |
| `tools/compare-polar.py` | Numeric polar diff between the reference and a render |
| `archive/v1-hands-feather/` | Superseded "hands + feather" identity (sources, exports, preview) |

## Narrative (v2 restructure)

Single source of truth: `config/site.ts` (`brand.story`, `brand.markMeaning`,
`brand.positioning`, `brand.networkPositioning`). The site reads from there — never restate it elsewhere.

1. **Origin (the name)** — *a single feather is light, and so is a single creation. Light things are easy to
   overlook; gather enough of them and they hold weight.* Explains the name 亚兹毛 / YAZIMAO.
2. **The mark** — *an open ring, tilted like an orbit: no centre, no sealed edge, always an opening for
   whoever joins next.* Explains why the logo is a broken ring rather than a closed loop.
3. **What is being built** — a **community-owned Layer 1** where creations are recorded, connected, verified
   and preserved, and where participants hold the network in common.

Slogan stays `Every Creation Matters.`; the L1/community positioning stays `A Community-Owned Layer 1 Network.`
Honesty rules are unchanged: no live-mainnet/testnet claims, no reward promises, no dates.

## Measured geometry (from the reference)

- Outer silhouette: **tilt −51.8°**, **axis ratio 0.54** (fit spread 9.6%).
- Band is **thickest at both ends of the major axis** (upper-right and lower-left) and thin along the minor-axis sides.
- **Cyan accent** sits on the outer edge at the upper-right tip (mean rgb `24,144,221`).
- The mark is **open**: a break at each minor-axis side, with a short trailing arc outside the band on the lower right.

## Colour

| Token | Value | Role |
|---|---|---|
| Mark silver | `#FFFFFF → #F2F5FB → #AEBACD` | the ring stroke |
| Cyan accent | `#1B86D6 → #22A7E8 → #7DF9FF` | the leading tip (site `nova-cyan` is `#22D3EE`) |
| Plate | `#0A0F1C → #04060B` | icons / social backgrounds |

## Pipeline

```
Desktop reference render
  └─ tools/cutout-reference.py      → export/logo-cutout-1024.png   (transparent master)
       └─ tools/build-assets.py     → public/logo-yazimao.png       (site logo, 512)
                                    → public/favicon.svg, icon.svg  (raster embedded in SVG)
                                    → public/og.svg                 (share-card source)
       └─ scripts/generate-og.ps1   → public/og.png, apple-touch-icon.png,
                                      twitter-avatar.png, twitter-banner.png
```

`public/logo-yazimao.png` is the single logo image the site renders
(`components/visual/YazimaoSymbol.tsx` → header, footer, 404).

## Notes

1. Because the master is a **soft 3D render**, the cut-out keeps its glow. It reads well on the site's
   deep-black UI; it must not be placed on light backgrounds without recolouring.
2. The vector reconstruction (`yazimao-symbol-orbit.svg`) matches the tilt, thickness profile and accent
   placement but simplifies the nested inner line — swap it in only if a pure-vector mark is needed
   (favicon crispness, print, third-party production).
3. `brand/genesis-gauntlet/` and `brand/genesis-hand/` are owner explorations; left untouched.
4. Wordmark remains live text (Space Grotesk stack) in the header; convert to outlines for third-party use.
