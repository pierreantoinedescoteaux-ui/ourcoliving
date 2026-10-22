"""Cuts P-A's ChatGPT art into web images for the hub and toolbox.

Reads the cell ids ([group/id]) from FOR PIERRE-ANTOINE/art-queue-prompts.md, so
the prompt file is the single map of which cell is which. Any sheet not saved yet
is skipped, so it can run after every new image.

  sheet-N.png  (3 x 2 objects)  -> images/hub/mini-<group>-<id>.webp
  icons.png    (5 x 2 icons)    -> images/hub/icon-<area>.webp
  hero.png / toolwall.png       -> images/hub/hero.webp / toolwall.webp

Run: python _tools/cut-art.py
"""
import os, re, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(os.path.expanduser("~"), "Downloads", "coliving-art")
OUT = os.path.join(ROOT, "images", "hub")
PROMPTS = os.path.join(ROOT, "FOR PIERRE-ANTOINE", "art-queue-prompts.md")
ICONS = ["building", "social", "governance", "legal", "money", "privacy", "leaving", "who", "path", "toolbox"]


def sheet_map():
    """{'sheet-1.png': ['legal/coop', ...], ...} in reading order."""
    text = open(PROMPTS, encoding="utf-8").read()
    out = {}
    for block in re.split(r"\n## ", text):
        m = re.search(r"→\s*(sheet-\d+\.png)", block.split("\n")[0])
        if m:
            out[m.group(1)] = re.findall(r"\[([a-z-]+(?:/[a-z-]+)?)\]", block)
    return out


def alpha_or_white(im):
    """Transparent PNGs pass through; a white background becomes transparent."""
    im = im.convert("RGBA")
    if im.getextrema()[3][0] < 250:
        return im
    px = im.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            r, g, b, a = px[x, y]
            if r > 242 and g > 242 and b > 242:
                px[x, y] = (r, g, b, 0)
    return im


def cut(path, cols, rows, names, max_px, prefix):
    im = alpha_or_white(Image.open(path))
    w, h = im.size
    done = 0
    for i, name in enumerate(names[: cols * rows]):
        if not name or name.startswith("spare"):
            continue
        c, r = i % cols, i // cols
        cell = im.crop((c * w // cols, r * h // rows, (c + 1) * w // cols, (r + 1) * h // rows))
        box = cell.getbbox()
        if not box:
            print("  empty cell:", name)
            continue
        cell = cell.crop(box)
        cell.thumbnail((max_px, max_px), Image.LANCZOS)
        cell.save(os.path.join(OUT, prefix + name.replace("/", "-") + ".webp"), "WEBP", quality=72, alpha_quality=50, method=6)
        done += 1
    print(f"{os.path.basename(path)}: {done} images")


def main():
    os.makedirs(OUT, exist_ok=True)
    if not os.path.isdir(ART):
        sys.exit("no folder " + ART)
    for sheet, ids in sorted(sheet_map().items(), key=lambda kv: int(re.search(r"\d+", kv[0]).group())):
        p = os.path.join(ART, sheet)
        if os.path.exists(p):
            cut(p, 3, 2, ids, 440, "mini-")
    p = os.path.join(ART, "icons.png")
    if os.path.exists(p):
        cut(p, 5, 2, ICONS, 160, "icon-")
    for name, size in (("hero", 2000), ("toolwall", 2000)):
        p = os.path.join(ART, name + ".png")
        if os.path.exists(p):
            im = Image.open(p).convert("RGB")
            im.thumbnail((size, size), Image.LANCZOS)
            im.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=74, method=6)
            print(name + ".webp")


if __name__ == "__main__":
    main()
