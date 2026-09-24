"""Numeric polar comparison: reference render vs generated SVG render."""
from PIL import Image
import numpy as np
import math
import sys

REF = r"C:\Users\Administrator\nova\nova-web\brand\tools\_ref-crop.png"
GEN = r"C:\Users\Administrator\nova\nova-web\brand\tools\_gen-512.png"


def load_marks(path):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    mn = a.min(axis=2)
    sat = a.max(axis=2) - mn
    white = (mn > 140) & (sat < 90)
    cyan = (a[..., 2] > 110) & ((a[..., 2] - a[..., 0]) > 50) & ((a[..., 1] - a[..., 0]) > 25)
    return a, white, cyan


def describe(name, path, bins=24):
    a, white, cyan = load_marks(path)
    h, w, _ = a.shape
    ys, xs = np.nonzero(white | cyan)
    if len(xs) == 0:
        print(name, "no mark")
        return
    cx, cy = xs.mean(), ys.mean()
    # scale so the mark's mean radius is 1.0 (comparable across renders)
    wys, wxs = np.nonzero(white)
    r = np.hypot(wxs - cx, wys - cy)
    scale = r.mean()
    th = (np.degrees(np.arctan2(wys - cy, wxs - cx)) + 360.0) % 360.0
    rn = r / scale
    print(f"\n--- {name} ({path.split(chr(92))[-1]})  mean r {scale:.0f}px  "
          f"r range {rn.min():.2f}..{rn.max():.2f}  coverage {100*len(wxs)/(h*w):.1f}%")
    print("ang   n       rmin  rmax  thick")
    step = 360 // bins
    for lo in range(0, 360, step):
        m = (th >= lo) & (th < lo + step)
        if m.sum() < 30:
            print(f"{lo:3d}   GAP")
        else:
            print(f"{lo:3d} {int(m.sum()):6d}  {rn[m].min():5.2f} {rn[m].max():5.2f} {rn[m].max()-rn[m].min():6.2f}")
    if cyan.any():
        cys, cxs = np.nonzero(cyan)
        cr = np.hypot(cxs - cx, cys - cy) / scale
        cth = (np.degrees(np.arctan2(cys - cy, cxs - cx)) + 360.0) % 360.0
        print(f"CYAN  ang {cth.min():.0f}..{cth.max():.0f} (mean {cth.mean():.0f})  r {cr.min():.2f}..{cr.max():.2f}")


describe("REFERENCE", REF)
describe("GENERATED", GEN)
