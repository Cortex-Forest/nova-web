"""YAZIMAO symbol — data-driven trace of the reference mark.

Pipeline
  1. load the reference crop, isolate the bright neutral stroke (white) + the blue accent;
  2. fit the silhouette ellipse (tilt, axis ratio) by minimising the relative radius spread;
  3. normalise every stroke pixel with that ellipse, then measure, per angular bin,
     the inner and outer boundary -> the band's centre radius and half thickness;
  4. emit one closed path per contiguous run of non-empty bins (so the mark's gaps are
     preserved), plus the cyan accent as its own tapered arc.

Run:  python brand/tools/trace-band.py
"""

import math
import os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, "_ref-crop.png")
OUT = os.path.join(os.path.dirname(HERE), "yazimao-symbol-orbit.svg")

CANVAS = 120.0
CENTRE = 60.0
TARGET_R = 45.0          # silhouette radius on canvas
BINS = 90                # 4 deg bins
MIN_BIN_PIXELS = 40

# ------------------------------------------------------------------ 1. load
img = Image.open(REF).convert("RGB")
arr = np.asarray(img).astype(np.int16)
mn = arr.min(axis=2)
sat = arr.max(axis=2) - mn
white = (mn > 200) & (sat < 60)
cyan = (arr[..., 2] > 150) & ((arr[..., 2] - arr[..., 0]) > 80) & ((arr[..., 1] - arr[..., 0]) > 40)

ys, xs = np.nonzero(white)
cx, cy = float(xs.mean()), float(ys.mean())

# ------------------------------------------------- 2. fit the silhouette ellipse
rad = np.hypot(xs - cx, ys - cy)
ang = (np.degrees(np.arctan2(ys - cy, xs - cx)) + 360.0) % 360.0
bin1 = np.digitize(ang, np.arange(0, 361, 1.0)) - 1
sx, sy = [], []
for b in range(360):
    sel = bin1 == b
    if sel.any():
        k = int(np.argmax(rad[sel]))
        sx.append(xs[sel][k] - cx)
        sy.append(ys[sel][k] - cy)
sx, sy = np.array(sx, float), np.array(sy, float)

best = None
for tilt in np.arange(-75, -20, 0.25):
    t = math.radians(tilt)
    u = sx * math.cos(t) + sy * math.sin(t)
    v = -sx * math.sin(t) + sy * math.cos(t)
    for ratio in np.arange(0.40, 1.00, 0.01):
        rr = np.hypot(u, v / ratio)
        sp = rr.std() / rr.mean()
        if best is None or sp < best[0]:
            best = (sp, tilt, ratio, rr.mean())
spread, tilt, ratio, scale = best
print(f"fitted ellipse: tilt {tilt:+.2f} deg  ratio {ratio:.3f}  "
      f"silhouette r {scale:.1f}px  spread {spread*100:.2f}%")

t = math.radians(tilt)
def to_norm(px, py):
    dx, dy = px - cx, py - cy
    u = dx * math.cos(t) + dy * math.sin(t)
    v = -dx * math.sin(t) + dy * math.cos(t)
    return np.hypot(u, v / ratio) / scale, (np.degrees(np.arctan2(v / ratio, u)) + 360.0) % 360.0

r, phi = to_norm(xs, ys)

# ------------------------------------------------------ 3. per-angle band profile
# One solid band per angular bin: centre radius + half thickness taken from the
# measured inner/outer boundary of the bright stroke. Bins with too few pixels
# stay empty, which is how the mark's gaps are reproduced.
step = 360.0 / BINS
profile = []
for i in range(BINS):
    p0, p1 = i * step, (i + 1) * step
    sel = (phi >= p0) & (phi < p1)
    if sel.sum() < MIN_BIN_PIXELS:
        profile.append((p0 + step / 2, None))
    else:
        rr = r[sel]
        profile.append((p0 + step / 2,
                        (float((rr.min() + rr.max()) / 2.0),
                         float((rr.max() - rr.min()) / 2.0))))

print("\nphi  centre  half-thickness")
for p, seg in profile:
    print(f"{p:5.0f}  " + ("GAP" if seg is None else f"{seg[0]:.3f}   {seg[1]:.4f}"))

# ------------------------------------------------------------- 4. emit the SVG
K = TARGET_R                     # canvas units per normalised unit
A_C = K                          # centreline ellipse semi-major (normalised 1.0)
B_C = K * ratio


def pt(phi_deg, r_norm, outward):
    """Canvas point at ellipse angle phi, radius r_norm, offset along the normal."""
    t2 = math.radians(phi_deg)
    ex, ey = A_C * math.cos(t2), B_C * math.sin(t2)
    nx, ny = B_C * math.cos(t2), A_C * math.sin(t2)
    n = math.hypot(nx, ny) or 1.0
    ex, ey = ex * r_norm, ey * r_norm
    return (CENTRE + ex + nx / n * outward, CENTRE + ey + ny / n * outward)


# group consecutive non-empty bins into runs
def build_runs():
    runs, cur = [], []
    for p, seg in profile:
        if seg is None:
            if cur:
                runs.append(cur)
                cur = []
        else:
            cur.append((p, seg[0], seg[1]))
    if cur:
        runs.append(cur)
    # merge a run that wraps around 0 deg with the last one
    if len(runs) > 1 and runs[0][0][0] < 2 * step and runs[-1][-1][0] > 360 - 2 * step:
        runs[0] = runs[-1] + runs[0]
        runs.pop()
    # drop slivers that cannot be a real stroke
    return [rn for rn in runs if len(rn) >= 3]


paths = []
for run in build_runs():
    pts = run + run[::-1]
    offsets = [ht for _, _, ht in run] + [-ht for _, _, ht in run[::-1]]
    d = []
    for (p, rm, ht), off in zip(pts, offsets):
        x, y = pt(p, rm, off)
        d.append((x, y))
    paths.append("M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in d) + " Z")

# cyan accent
cys, cxs = np.nonzero(cyan)
accent_path = None
if len(cxs) > 50:
    cr, cphi = to_norm(cxs, cys)
    keep = cr > 0.85                      # only the outer edge
    if keep.sum() > 30:
        cr, cphi = cr[keep], cphi[keep]
        lo, hi = np.percentile(cphi, [10, 90])
        if hi < lo:
            lo, hi = np.percentile((cphi + 180) % 360, [10, 90])
        lo, hi = float(lo), float(hi)
        # reject a wrap-around artefact: keep the denser contiguous half
        if hi - lo > 90:
            med = float(np.median(cphi))
            lo, hi = med - 22, med + 22
        print(f"\naccent: phi {lo:.0f}..{hi:.0f}  r {cr.min():.2f}..{cr.max():.2f}")
        acc = []
        n = 12
        for j in range(n + 1):
            p = lo + (hi - lo) * j / n
            acc.append(pt(p, 1.0, 0.004 * K + 1.6))
        for j in range(n + 1):
            p = hi + (lo - hi) * j / n
            acc.append(pt(p, 1.0, -1.6))
        accent_path = "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in acc) + " Z"

layers = "\n".join(f'    <path d="{d}" fill="url(#yz-ring)"/>' for d in paths)
accent_layer = (f'\n    <path d="{accent_path}" fill="url(#yz-accent)" filter="url(#yz-bloom)"/>'
                if accent_path else "")

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="YAZIMAO">
  <title>YAZIMAO symbol</title>
  <desc>An orbiting open ring in silver-white with a cyan accent at its upper-right tip.</desc>

  <defs>
    <linearGradient id="yz-ring" x1="0.05" y1="0" x2="0.95" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="0.45" stop-color="#F2F5FB"/>
      <stop offset="1" stop-color="#AEBACD"/>
    </linearGradient>
    <linearGradient id="yz-accent" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#1B86D6"/>
      <stop offset="0.55" stop-color="#22A7E8"/>
      <stop offset="1" stop-color="#7DF9FF"/>
    </linearGradient>
    <filter id="yz-bloom" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="0.9" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <g transform="rotate({tilt:.2f} {CENTRE:g} {CENTRE:g})">
{layers}{accent_layer}
  </g>
</svg>
'''

with open(OUT, "w", encoding="utf-8") as fh:
    fh.write(svg)
print(f"\nwrote {OUT}  ({len(paths)} band path(s))")
