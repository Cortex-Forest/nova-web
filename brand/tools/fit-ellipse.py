"""Robust fit of the reference mark: silhouette ellipse + two-band profile.

Strategy: trace the outer silhouette (max-radius white pixel per screen angle),
then search (tilt, axis-ratio) minimising the relative spread of the radius in
that ellipse frame. With the ellipse known, normalise, split the mark into two
radial bands and report each band's centre radius, half thickness and angular extent.
"""

import math
import os
import numpy as np
from PIL import Image

REF = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_ref-crop.png")
img = Image.open(REF).convert("RGB")
arr = np.asarray(img).astype(np.int16)
mn = arr.min(axis=2)
sat = arr.max(axis=2) - mn
white = (mn > 140) & (sat < 90)
cyan = (arr[..., 2] > 110) & ((arr[..., 2] - arr[..., 0]) > 50) & ((arr[..., 1] - arr[..., 0]) > 25)

ys, xs = np.nonzero(white)
cx, cy = float(xs.mean()), float(ys.mean())

# ---- outer silhouette: max-radius pixel per 1-degree screen bin
rad = np.hypot(xs - cx, ys - cy)
ang = (np.degrees(np.arctan2(ys - cy, xs - cx)) + 360.0) % 360.0
edges = np.arange(0, 361, 1.0)
idx = np.digitize(ang, edges) - 1
sil_x, sil_y = [], []
for b in range(360):
    sel = idx == b
    if sel.sum() == 0:
        continue
    k = np.argmax(rad[sel])
    sil_x.append(xs[sel][k])
    sil_y.append(ys[sel][k])
sil_x = np.array(sil_x, float) - cx
sil_y = np.array(sil_y, float) - cy
print(f"silhouette points: {len(sil_x)}")

best = None
for tilt in np.arange(-75, -20, 0.25):
    t = math.radians(tilt)
    u = sil_x * math.cos(t) + sil_y * math.sin(t)
    v = -sil_x * math.sin(t) + sil_y * math.cos(t)
    for ratio in np.arange(0.40, 1.00, 0.01):
        ru = np.hypot(u, v / ratio)
        spread = ru.std() / ru.mean()
        if best is None or spread < best[0]:
            best = (spread, tilt, ratio, ru.mean())
spread, tilt, ratio, scale = best
print(f"best fit: tilt {tilt:+.2f} deg  axis ratio {ratio:.3f}  "
      f"silhouette radius {scale:.1f}px  spread {spread*100:.2f}%")

# ---- normalise every mark pixel with the fitted ellipse
t = math.radians(tilt)
dx, dy = xs - cx, ys - cy
u = dx * math.cos(t) + dy * math.sin(t)
v = -dx * math.sin(t) + dy * math.cos(t)
r = np.hypot(u, v / ratio) / scale          # 1.0 == outer silhouette
phi = (np.degrees(np.arctan2(v / ratio, u)) + 360.0) % 360.0

print("\nr histogram (0.02 bins):")
hist, ed = np.histogram(r, bins=40, range=(0.0, 1.2))
for i, c in enumerate(hist):
    if c:
        print(f"  {ed[i]:.2f}  {int(c):6d} {'#' * max(1, int(c / 300))}")

def band(lo, hi, bins=36):
    m = (r >= lo) & (r < hi)
    rows = []
    for i in range(bins):
        p0, p1 = i * 360.0 / bins, (i + 1) * 360.0 / bins
        sel = m & (phi >= p0) & (phi < p1)
        rows.append((p0 + 180.0 / bins, int(sel.sum()),
                     r[sel].mean() if sel.sum() else None,
                     (r[sel].max() - r[sel].min()) / 2 if sel.sum() else None))
    return rows

print("\nphi   inner(band B)          outer(band A)")
inner = band(0.0, 0.90)
outer = band(0.90, 1.2)
for (p, n, rm, ht), (_, n2, rm2, ht2) in zip(inner, outer):
    f = lambda n_, m_, h_: ("  GAP      ") if n_ < 60 else f"n={n_:5d} r={m_:.2f} t={h_:.4f}"
    print(f"{p:5.0f}  {f(n, rm, ht)}   {f(n2, rm2, ht2)}")

cys, cxs = np.nonzero(cyan)
cu = (cxs - cx) * math.cos(t) + (cys - cy) * math.sin(t)
cv = -(cxs - cx) * math.sin(t) + (cys - cy) * math.cos(t)
cr = np.hypot(cu, cv / ratio) / scale
cphi = (np.degrees(np.arctan2(cv / ratio, cu)) + 360.0) % 360.0
print(f"\nCYAN  phi {cphi.min():.0f}..{cphi.max():.0f} (mean {cphi.mean():.0f})  "
      f"r {cr.min():.2f}..{cr.max():.2f}")
