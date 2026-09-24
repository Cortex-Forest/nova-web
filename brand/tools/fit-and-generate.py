"""Fit the reference mark as TWO concentric elliptical bands, then emit the SVG.

Model (validated against the polar profile of the reference render):
  * the outer silhouette is an ellipse (a_out, b_out) tilted by TILT;
  * the mark consists of an outer band and an inner band, both offset inward,
    each with its own angular extent and radial thickness;
  * a small cyan crescent sits on the outer band at the up-right tip.

Run:  python brand/tools/fit-and-generate.py
"""

import math
import os
import numpy as np
from PIL import Image

REF = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_ref-crop.png")
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "yazimao-symbol-orbit.svg")

# ---------------------------------------------------------------- measure
img = Image.open(REF).convert("RGB")
arr = np.asarray(img).astype(np.int16)
mn = arr.min(axis=2)
sat = arr.max(axis=2) - mn
white = (mn > 140) & (sat < 90)
cyan = (arr[..., 2] > 110) & ((arr[..., 2] - arr[..., 0]) > 50) & ((arr[..., 1] - arr[..., 0]) > 25)

ys, xs = np.nonzero(white)
cx, cy = float(xs.mean()), float(ys.mean())

# ---- orientation + axis ratio from the outer silhouette (bounding box method)
bx0, bx1, by0, by1 = xs.min(), xs.max(), ys.min(), ys.max()
W, H = bx1 - bx0 + 1, by1 - by0 + 1
best = None
for tilt in np.arange(-80, 80, 0.5):
    t = math.radians(tilt)
    S = (W / 2.0) ** 2
    T = (H / 2.0) ** 2
    c2, s2 = math.cos(t) ** 2, math.sin(t) ** 2
    # solve A^2 c2 + B^2 s2 = S ; A^2 s2 + B^2 c2 = T
    det = c2 * c2 - s2 * s2
    if abs(det) < 1e-6:
        continue
    A2 = (S * c2 - T * s2) / det
    B2 = (T * c2 - S * s2) / det
    if A2 <= 0 or B2 <= 0:
        continue
    A, B = math.sqrt(A2), math.sqrt(B2)
    if A < B:
        continue
    # prefer the flattest ellipse (smallest minor/major) that still fits the box
    score = B / A
    if best is None or score < best[0]:
        best = (score, tilt, A, B)
ratio, tilt, a_out, b_out = best
print(f"outer silhouette: tilt {tilt:+.1f} deg  a {a_out:.1f}  b {b_out:.1f}  ratio {ratio:.3f}")

t = math.radians(tilt)
dx, dy = xs - cx, ys - cy
u = (dx * math.cos(t) + dy * math.sin(t)) / a_out
v = (-dx * math.sin(t) + dy * math.cos(t)) / b_out
r = np.hypot(u, v)
phi = (np.degrees(np.arctan2(v, u)) + 360.0) % 360.0
print(f"normalised r: {r.min():.3f}..{r.max():.3f}  median {np.median(r):.3f}")

hist, edges = np.histogram(r, bins=24, range=(0, 1.2))
print("radial histogram (bin centre -> count):")
for i, c in enumerate(hist):
    if c:
        print(f"  {edges[i]+0.025:.3f}  {int(c):6d}  {'#' * max(1, int(c / 400))}")


def band_profile(mask_r, lo, hi, bins=36):
    """Per-phi centre radius and half-thickness (normalised units) for one band."""
    m = (r >= lo) & (r < hi)
    table = []
    for i in range(bins):
        p0 = i * 360.0 / bins
        p1 = p0 + 360.0 / bins
        sel = m & (phi >= p0) & (phi < p1)
        if sel.sum() < 60:
            table.append((p0 + 180.0 / bins, None, None))
        else:
            table.append((p0 + 180.0 / bins,
                          (r[sel].min() + r[sel].max()) / 2.0,
                          (r[sel].max() - r[sel].min()) / 2.0))
    return table


print("\nband split by radial histogram: inspect the two modes above to choose lo/hi below.")
