"""Build the public brand assets from the reference cut-out.

Source of truth: brand/export/logo-cutout-1024.png  (transparent, tight crop, square)
Outputs
  public/logo-yazimao.png    512x512 transparent logo master (used by YazimaoSymbol)
  public/favicon.svg         dark rounded tile + embedded logo (vector wrapper, raster payload)
  public/icon.svg            full-bleed square + embedded logo (PWA / maskable)
  public/og.svg              1200x630 share card design source (embedded logo + copy)

og.png / apple-touch-icon.png / twitter-*.png are produced by scripts/generate-og.ps1
from public/logo-yazimao.png, keeping the project's single-logo-source pipeline intact.

Run:  python brand/tools/build-assets.py
"""

import base64
import io
import math
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
BRAND = os.path.dirname(HERE)
WEB = os.path.dirname(BRAND)
PUBLIC = os.path.join(WEB, "public")

CUT = os.path.join(BRAND, "export", "logo-cutout-1024.png")
BG_TOP, BG_BOT = (10, 15, 28), (4, 6, 11)
MARK_RATIO = 0.80            # logo width as a fraction of the tile


def png_b64(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return base64.b64encode(buf.getvalue()).decode("ascii")


def radial_glow(size, colour, alpha_center):
    """Soft cyan glow, returned as RGBA to composite over the plate."""
    g = Image.new("RGBA", size, (0, 0, 0, 0))
    px = g.load()
    w, h = size
    cx, cy = w / 2.0, h / 2.0
    rad = 0.62 * max(w, h)
    for y in range(h):
        for x in range(w):
            d = math.hypot(x - cx, y - cy) / rad
            a = max(0.0, 1.0 - d) ** 2 * alpha_center
            if a > 0:
                px[x, y] = (colour[0], colour[1], colour[2], int(a * 255))
    return g


def plate(size, radius_ratio):
    """Dark rounded plate (radius_ratio=0 -> full bleed square)."""
    w = h = size
    plate = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    grad = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gp = grad.load()
    for y in range(h):
        t = y / (h - 1)
        gp_row = tuple(int(BG_TOP[i] + (BG_BOT[i] - BG_TOP[i]) * t) for i in range(3))
        for x in range(w):
            gp[x, y] = (gp_row[0], gp_row[1], gp_row[2], 255)
    mask = Image.new("L", (w, h), 0)
    mp = mask.load()
    r = int(size * radius_ratio)
    for y in range(h):
        for x in range(w):
            dx = min(x, w - 1 - x)
            dy = min(y, h - 1 - y)
            inside = True
            if r > 0:
                if dx < r and dy < r:
                    inside = math.hypot(r - dx, r - dy) <= r
            mp[x, y] = 255 if inside else 0
    plate.paste(grad, (0, 0), mask)
    plate.alpha_composite(radial_glow((w, h), (34, 211, 238), 0.30))
    return plate


def tile(size, radius_ratio, mark_ratio=MARK_RATIO):
    plate_img = plate(size, radius_ratio)
    mark = Image.open(CUT).convert("RGBA")
    m = int(size * mark_ratio)
    mark = mark.resize((m, m), Image.LANCZOS)
    off = (size - m) // 2
    # lift the mark 2% so the optical centre matches the geometric centre
    plate_img.alpha_composite(mark, (off, off - int(size * 0.02)))
    return plate_img


def main():
    cut = Image.open(CUT).convert("RGBA")

    # 1. logo master used by the site header / footer / 404
    master = cut.resize((512, 512), Image.LANCZOS)
    master.save(os.path.join(PUBLIC, "logo-yazimao.png"), optimize=True)
    print("wrote public/logo-yazimao.png (512)")

    # 2. vector wrappers with the raster embedded (dark tile + full bleed)
    for name, size, radius in (("favicon.svg", 512, 0.225), ("icon.svg", 512, 0.0)):
        img = tile(size, radius)
        b64 = png_b64(img)
        svg = (
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" '
            'width="512" height="512" role="img" aria-label="YAZIMAO">\n'
            "  <title>YAZIMAO</title>\n"
            "  <desc>YAZIMAO icon: the tilted orbit mark on a deep black plate.</desc>\n"
            f'  <image x="0" y="0" width="512" height="512" href="data:image/png;base64,{b64}"/>\n'
            "</svg>\n"
        )
        with open(os.path.join(PUBLIC, name), "w", encoding="utf-8") as fh:
            fh.write(svg)
        print(f"wrote public/{name} ({len(b64)//1024} KB embedded)")

    # 3. OG card design source (matches the copy used by generate-og.ps1)
    W, H = 1200, 630
    card = Image.new("RGBA", (W, H), (4, 6, 11, 255))
    card.alpha_composite(radial_glow((W, H), (14, 23, 48), 0.95))
    card.alpha_composite(radial_glow((W, H), (34, 211, 238), 0.10))
    mark = cut.resize((150, 150), Image.LANCZOS)
    card.alpha_composite(mark, ((W - 150) // 2, 58))
    png = png_b64(card.crop((0, 0, W, H)))
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" '
        'role="img" aria-label="YAZIMAO">\n'
        "  <title>YAZIMAO — share card</title>\n"
        f'  <image x="0" y="0" width="1200" height="630" href="data:image/png;base64,{png}"/>\n'
        '  <g font-family="Segoe UI, Inter, system-ui, sans-serif" text-anchor="middle">\n'
        '    <text x="600" y="330" font-size="96" font-weight="700" fill="#F2F6FB">YAZIMAO</text>\n'
        '    <text x="600" y="420" font-size="44" font-weight="700" fill="#F2F6FB">Every Creation Matters.</text>\n'
        '    <text x="600" y="487" font-size="28" fill="#8E9CB3">Layer1 · Storage · Compute · Node Network</text>\n'
        '    <text x="600" y="566" font-size="24" fill="#B9C5D8">yazimao.xyz</text>\n'
        "  </g>\n"
        "</svg>\n"
    )
    with open(os.path.join(PUBLIC, "og.svg"), "w", encoding="utf-8") as fh:
        fh.write(svg)
    print("wrote public/og.svg (1200x630)")


if __name__ == "__main__":
    main()
