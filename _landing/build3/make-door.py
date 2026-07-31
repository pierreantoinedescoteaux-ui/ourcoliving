"""Turn a flat painted gate into a door that can actually open.

The round-1 door was one image split down the middle, so the stone arch
swung open along with the timber — which is why it read as "the background
is opening" rather than "a door is opening" (P-A, 2026-07-31).

This cuts the painting into two layers instead:

  gate-frame.webp   the stonework, the vines, the solar glass — everything
                    that must STAY STILL — with the doorway knocked out so
                    the world shows through the opening.
  gate-leaf-l.webp  the left timber leaf, hinged on its outer edge.
  gate-leaf-r.webp  the right timber leaf.

White is keyed to transparency by flooding in from the border, so whites
INSIDE the painting (a highlight on the brass) survive. Same approach as
the sticker sheets in _landing/build2/slice.py.

Usage: python make-door.py <raw/gate-simple-a.png> <out-prefix>
       (doorway box is auto-found from the timber's own colour)
"""
import sys, os
import numpy as np
from PIL import Image

WHITE = 240          # >= this in every channel counts as background
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "assets", "world")


def key_white(im):
    """Alpha out only the white REACHABLE FROM THE BORDER."""
    a = np.array(im.convert("RGB")).astype(np.int16)
    whiteish = (a >= WHITE).all(axis=2)
    h, w = whiteish.shape
    seen = np.zeros((h, w), dtype=bool)
    stack = []
    for x in range(w):
        for y in (0, h - 1):
            if whiteish[y, x] and not seen[y, x]:
                seen[y, x] = True; stack.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if whiteish[y, x] and not seen[y, x]:
                seen[y, x] = True; stack.append((y, x))
    while stack:                                     # flood, 4-connected
        y, x = stack.pop()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and whiteish[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True; stack.append((ny, nx))
    rgba = np.dstack([np.array(im.convert("RGB")), np.where(seen, 0, 255).astype(np.uint8)])
    return Image.fromarray(rgba, "RGBA")


def find_doorway(rgba):
    """The timber leaves are the warm mid-tone mass in the middle: high
    red, clearly warmer than the cream stone and not the green vines."""
    a = np.array(rgba)
    r, g, b, al = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int), a[..., 3]
    wood = (al > 128) & (r > 120) & (r - b > 68) & (r >= g) & (g - b > 18) & (r < 245) & (r > 140)
    h, w = wood.shape
    # ignore a border margin so vine stems and stone shadows do not drag the box out
    m = int(min(h, w) * 0.02)
    wood[:m, :] = wood[-m:, :] = wood[:, :m] = wood[:, -m:] = False
    cols = wood.sum(axis=0); rows = wood.sum(axis=1)
    cx = np.where(cols > cols.max() * 0.18)[0]
    ry = np.where(rows > rows.max() * 0.18)[0]
    return int(cx[0]), int(ry[0]), int(cx[-1]) + 1, int(ry[-1]) + 1


def main():
    src = sys.argv[1]
    prefix = sys.argv[2] if len(sys.argv) > 2 else "gate"
    im = Image.open(src)
    rgba = key_white(im)
    W, H = rgba.size
    # Auto-detection kept swallowing the cream stone, which is nearly as warm
    # as the timber in this painting. The doorway is measured by eye and passed
    # in as four normalised numbers instead: x0 y0 x1 y1.
    if len(sys.argv) >= 7:
        x0, y0, x1, y1 = [int(float(v) * (W if i % 2 == 0 else H)) for i, v in enumerate(sys.argv[3:7])]
    else:
        x0, y0, x1, y1 = find_doorway(rgba)
    print("doorway box  x %.3f-%.3f  y %.3f-%.3f" % (x0 / W, x1 / W, y0 / H, y1 / H))

    # the two leaves
    door = rgba.crop((x0, y0, x1, y1))
    mid = door.width // 2
    door.crop((0, 0, mid, door.height)).save(os.path.join(OUT, prefix + "-leaf-l.webp"), "WEBP", quality=90, method=6)
    door.crop((mid, 0, door.width, door.height)).save(os.path.join(OUT, prefix + "-leaf-r.webp"), "WEBP", quality=90, method=6)

    # the frame, with the doorway knocked out so the world shows through
    frame = np.array(rgba).copy()
    # the opening is an ARCH, not a rectangle: a round head over straight
    # jambs, so the stone above the springing line is never touched
    hole = np.zeros((H, W), dtype=bool)
    dw, dh = x1 - x0, y1 - y0
    rx, ry = dw / 2.0, dw / 2.0                 # semicircular head
    cx, cy = x0 + rx, y0 + ry
    yy, xx = np.mgrid[0:H, 0:W]
    head = ((xx - cx) ** 2) / (rx ** 2) + ((yy - cy) ** 2) / (ry ** 2) <= 1.0
    body = (xx >= x0) & (xx < x1) & (yy >= cy) & (yy < y1)
    hole = (head | body) & (yy >= y0)
    # Inside the opening, clear EVERYTHING that belongs to the door: the
    # planks, the brass bands, the handles, the highlights. Colour-testing for
    # timber alone left the ironwork floating in mid-air. What survives is
    # only what genuinely belongs to the surround and happens to overlap the
    # box: pale stone, and green vine.
    r, g, b = frame[..., 0].astype(int), frame[..., 1].astype(int), frame[..., 2].astype(int)
    stone = (r > 198) & (g > 190) & (b > 168) & (r - b < 52)
    vine  = (g > r + 8) & (g > b + 18)
    frame[..., 3] = np.where(hole & ~(stone | vine), 0, frame[..., 3])
    Image.fromarray(frame, "RGBA").save(os.path.join(OUT, prefix + "-frame.webp"), "WEBP", quality=90, method=6)

    for n in ("-frame", "-leaf-l", "-leaf-r"):
        p = os.path.join(OUT, prefix + n + ".webp")
        print("  %-22s %6.1f KB" % (os.path.basename(p), os.path.getsize(p) / 1024))
    # hand back the geometry the CSS needs
    print("CSS: --door-x:%.4f; --door-y:%.4f; --door-w:%.4f; --door-h:%.4f;" %
          (x0 / W, y0 / H, (x1 - x0) / W, (y1 - y0) / H))


if __name__ == "__main__":
    main()
