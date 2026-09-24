"""YAZIMAO symbol generator — "orbit" mark (v4, measured from the reference).

Measurements taken from the reference render (brand/tools/_ref-crop.png):
  * outer silhouette: tilt -51.8 deg, axis ratio 0.54   (fit-ellipse.py, spread 9.6%)
  * the band is THICKEST at both ends of the major axis (upper-right and lower-left,
    reference polar 285-345 deg and 105-150 deg) and THIN along the minor-axis sides;
  * the cyan accent sits on the outer edge at the upper-right end (local phi ~ 0);
  * the mark is open, with a break at each minor-axis side, plus a short trailing arc
    outside the band on the lower right.

Local frame: phi 0 = upper-right tip | 90 = lower-right (minor axis) |
             180 = lower-left end | 270 = upper-left (minor axis).

Emits brand/yazimao-symbol-orbit.svg (120x120, transparent).
Run:  python brand/tools/generate-symbol.py
"""

import math
import os

CX = CY = 60.0
TILT = -51.8
A_SEMI = 45.0                                   # silhouette semi-major, canvas units
B_SEMI = 45.0 * 0.54                            # 24.3
STEPS = 72

# (phi_from, phi_to, semi-major, semi-minor, (half-thickness at start / middle / end))
ARCS = [
    (112.0, 248.0, A_SEMI * 0.88, B_SEMI * 0.88, (3.0, 6.6, 3.2)),   # top + left, thick at 180
    (292.0, 428.0, A_SEMI * 0.88, B_SEMI * 0.88, (3.2, 6.4, 3.0)),   # right + bottom, thick at 360
]

# short detached trailing arc, outside the band on the lower right
TRAIL = (373.0, 401.0, A_SEMI * 1.14, B_SEMI * 1.14, (1.5, 2.1, 1.3))

# cyan accent: a thinner crescent riding on the outer edge of the upper-right tip
ACCENT = (349.0, 372.0, A_SEMI * 0.88, B_SEMI * 0.88, (1.9, 3.2, 1.7), 1.6)


def thick_at(t, table):
    lo, mid, hi = table
    if t <= 0.5:
        return lo + (mid - lo) * math.sin(math.pi * t)
    return mid - (mid - hi) * math.sin(math.pi * (t - 0.5))


def point(phi_deg, a, b, h, side):
    r = math.radians(phi_deg)
    ex, ey = a * math.cos(r), b * math.sin(r)
    nx, ny = b * math.cos(r), a * math.sin(r)
    n = math.hypot(nx, ny) or 1.0
    return (CX + ex + nx / n * h * side, CY + ey + ny / n * h * side)


def band_path(phi_from, phi_to, a, b, table, lift=0.0):
    outer, inner = [], []
    for i in range(STEPS + 1):
        t = i / STEPS
        phi = phi_from + (phi_to - phi_from) * t
        h = thick_at(t, table) + lift
        outer.append(point(phi, a, b, h, +1))
        inner.append(point(phi, a, b, h, -1))
    pts = outer + inner[::-1]
    return "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in pts) + " Z"


bands = "\n".join(
    f'    <path d="{band_path(f, t, a, b, th)}" fill="url(#yz-ring)"/>'
    for f, t, a, b, th in ARCS
)
trail = band_path(*TRAIL)
acc = band_path(ACCENT[0], ACCENT[1], ACCENT[2], ACCENT[3], ACCENT[4], ACCENT[5])

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="YAZIMAO">
  <title>YAZIMAO symbol</title>
  <desc>An open orbit: two silver-white arcs form a tilted ring, thickest at the lower-left and upper-right, with a cyan crescent on the leading tip.</desc>

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
      <feGaussianBlur stdDeviation="0.7" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <g transform="rotate({TILT} {CX:g} {CY:g})">
{bands}
    <path d="{trail}" fill="url(#yz-ring)"/>
    <path d="{acc}" fill="url(#yz-accent)" filter="url(#yz-bloom)"/>
  </g>
</svg>
'''

out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "yazimao-symbol-orbit.svg")
with open(out, "w", encoding="utf-8") as fh:
    fh.write(svg)
print("wrote", out)
