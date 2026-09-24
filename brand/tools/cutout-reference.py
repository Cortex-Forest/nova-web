"""Cut the reference mark out of its black background into a transparent PNG master.

The reference is a soft 3D render, so the alpha is derived from luminance with a
small ramp: pure black -> fully transparent, the glow keeps partial alpha, the
stroke body stays opaque. Outputs a square, tightly cropped master.
"""

import os
from PIL import Image
import numpy as np

SRC = r"C:\Users\Administrator\AppData\Local\Temp\yz_ref_crop.png"
REF_FULL = r"C:\Users\Administrator\Desktop\16656.jpg"
OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "export")

img = Image.open(REF_FULL).convert("RGB")
a = np.asarray(img).astype(np.float64)
lum = a.max(axis=2)

# luminance-keyed alpha: transparent below `lo`, opaque above `hi`
lo, hi = 14.0, 90.0
alpha = np.clip((lum - lo) / (hi - lo), 0.0, 1.0)

rgba = np.zeros((a.shape[0], a.shape[1], 4), dtype=np.uint8)
# un-premultiply slightly so the glow keeps its colour instead of greying out
rgba[..., :3] = np.clip(a / np.maximum(alpha[..., None], 0.25), 0, 255).astype(np.uint8)
rgba[..., 3] = (alpha * 255).astype(np.uint8)
out = Image.fromarray(rgba, "RGBA")

# tight crop around the visible mark, padded to a square
al = rgba[..., 3] > 8
ys, xs = np.nonzero(al)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
side = int(max(x1 - x0, y1 - y0) * 1.06)
cxc, cyc = (x0 + x1) // 2, (y0 + y1) // 2
box = (cxc - side // 2, cyc - side // 2, cxc + side // 2, cyc + side // 2)
crop = out.crop(box)
print(f"mark bbox {x1-x0}x{y1-y0} -> square master {crop.size[0]}x{crop.size[1]}")

os.makedirs(OUT_DIR, exist_ok=True)
for size in (1024, 512, 256):
    crop.resize((size, size), Image.LANCZOS).save(
        os.path.join(OUT_DIR, f"logo-cutout-{size}.png"))
    print("wrote", os.path.join(OUT_DIR, f"logo-cutout-{size}.png"))
