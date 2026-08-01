#!/usr/bin/env python3
"""Find the waterfall in the S1 ambient loop, by looking rather than by eye.

P-A on the arrival zoom: "I want one point to be anchored as if you are a
bird flying into that. Right now it just feels the same as if I'm zooming
in the photo."

The anchor has to be the waterfall, and the waterfall has to be located in
the PAINTING's coordinates so the still planes and the clip agree about
where it is. Falling water is the strongest sustained motion in the frame,
so differencing frames far apart in the loop and taking the densest cluster
finds it without anyone guessing at pixel positions.

Writes the box into assets/tower/layers/layers.json as "waterfall", in
fractions of the painting, next to the layer boxes already there.

    python _tools/find-waterfall.py
"""
import json
import pathlib
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
CLIP = ROOT / "assets/tower/vid/loop-s1.mp4"
LAYERS = ROOT / "assets/tower/layers/layers.json"

# the painting sits inside the 16:9 clip pillarboxed at this share of its
# width. Measured in the 2026-08-01 session by keying the island silhouette
# out of both the painting and the clip's first frame; see the arrival's
# own comment block. Both numbers are needed to map clip x -> painting x.
PAINT_IN_CLIP_W = 0.832


def grab(t, out):
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-ss", str(t), "-i", str(CLIP),
         "-frames:v", "1", str(out)],
        check=True,
    )


def main():
    if not CLIP.exists():
        sys.exit(f"missing {CLIP}")

    with tempfile.TemporaryDirectory() as td:
        td = pathlib.Path(td)
        # several pairs across the loop: water moves constantly, a bird or a
        # cloud only sometimes, so summing pairs favours the sustained motion
        times = [0.0, 1.3, 2.6, 3.9, 5.2, 6.5]
        frames = []
        rgb0 = None
        for i, t in enumerate(times):
            p = td / f"f{i}.png"
            grab(t, p)
            im = Image.open(p).convert("RGB")
            if rgb0 is None:
                rgb0 = np.asarray(im, dtype=np.int16)
            frames.append(np.asarray(im.convert("L"), dtype=np.int16))

    H, W = frames[0].shape
    acc = np.zeros((H, W), dtype=np.float32)
    for i in range(len(frames)):
        for j in range(i + 1, len(frames)):
            acc += np.abs(frames[i] - frames[j]).astype(np.float32)
    acc /= (len(frames) * (len(frames) - 1)) / 2

    # Motion alone is not enough, and two earlier passes of this script prove
    # it: the first found the hot air balloon, the second found the flock.
    # A body that TRANSLATES diffs harder than water that churns in place,
    # and cropping the sky away just moved the answer to whatever flies
    # lowest.
    #
    # The thing that actually separates the waterfall from everything else in
    # this painting is its COLOUR. It is the only strongly moving thing that
    # is cyan. So motion is weighted by how watery the pixel is, and the
    # cascade wins on its own merits instead of by us fencing the sky off.
    r, g, b = rgb0[:, :, 0].astype(np.float32), rgb0[:, :, 1].astype(np.float32), rgb0[:, :, 2].astype(np.float32)
    watery = np.clip(((g + b) / 2.0 - r) / 40.0, 0.0, 1.0)
    acc = acc * watery

    # keep only strong, sustained movement
    nz = acc[acc > 0]
    thr = max(6.0, float(np.percentile(nz, 99.4))) if nz.size else 6.0
    hot = acc >= thr

    # densest cluster: sum the mask over a sliding window about the size a
    # waterfall occupies, and take the best window
    win_h, win_w = int(H * 0.16), int(W * 0.055)
    ii = np.cumsum(np.cumsum(hot.astype(np.int32), axis=0), axis=1)
    ii = np.pad(ii, ((1, 0), (1, 0)))

    def box_sum(y0, x0, y1, x1):
        return ii[y1, x1] - ii[y0, x1] - ii[y1, x0] + ii[y0, x0]

    best, best_n = None, -1
    for y in range(0, H - win_h, 8):
        for x in range(0, W - win_w, 8):
            n = box_sum(y, x, y + win_h, x + win_w)
            if n > best_n:
                best_n, best = n, (y, x)
    y0, x0 = best
    y1, x1 = y0 + win_h, x0 + win_w

    # tighten onto the actual hot pixels inside that window
    sub = hot[y0:y1, x0:x1]
    ys, xs = np.nonzero(sub)
    if len(ys):
        y0, y1 = y0 + int(ys.min()), y0 + int(ys.max()) + 1
        x0, x1 = x0 + int(xs.min()), x0 + int(xs.max()) + 1

    cx_clip = ((x0 + x1) / 2) / W
    cy_clip = ((y0 + y1) / 2) / H

    # clip x -> painting x. The painting is pillarboxed inside the clip, so
    # its left edge sits at (1 - 0.832) / 2 of the clip width. Vertically the
    # 3:2 painting fills the 16:9 frame's height, so y maps straight through.
    left = (1.0 - PAINT_IN_CLIP_W) / 2
    cx_paint = (cx_clip - left) / PAINT_IN_CLIP_W
    x0p = ((x0 / W) - left) / PAINT_IN_CLIP_W
    x1p = ((x1 / W) - left) / PAINT_IN_CLIP_W

    box = {
        "cx": round(cx_paint, 4), "cy": round(cy_clip, 4),
        "x0": round(x0p, 4), "x1": round(x1p, 4),
        "y0": round(y0 / H, 4), "y1": round(y1 / H, 4),
        "note": "densest sustained motion in loop-s1.mp4, in fractions of "
                "the painting. Found by _tools/find-waterfall.py, not by eye. "
                "Used as the anchor the arrival zoom flies toward.",
    }
    print(f"clip {W}x{H}  hot>={thr:.1f}  pixels={int(hot.sum())}")
    print(f"waterfall in painting coords: cx={box['cx']} cy={box['cy']} "
          f"x {box['x0']}..{box['x1']}  y {box['y0']}..{box['y1']}")

    data = json.loads(LAYERS.read_text(encoding="utf-8")) if LAYERS.exists() else {}
    data["waterfall"] = box
    LAYERS.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {LAYERS}")

    # and a picture of what it decided, because a number that is confidently
    # wrong looks exactly like a number that is right
    with tempfile.TemporaryDirectory() as td:
        td = pathlib.Path(td)
        grab(0.0, td / "f0.png")
        im = Image.open(td / "f0.png").convert("RGB")
        px = im.load()
        for x in range(max(0, x0 - 3), min(W, x1 + 3)):
            for dy in (0, 1, 2):
                for yy in (y0 + dy, y1 - dy):
                    if 0 <= yy < H:
                        px[x, yy] = (255, 40, 40)
        for y in range(max(0, y0 - 3), min(H, y1 + 3)):
            for dx in (0, 1, 2):
                for xx in (x0 + dx, x1 - dx):
                    if 0 <= xx < W:
                        px[xx, y] = (255, 40, 40)
        out = ROOT / "_qa/mshots/waterfall-found.png"
        out.parent.mkdir(parents=True, exist_ok=True)
        im.save(out)
        print(f"preview -> {out}")


if __name__ == "__main__":
    main()
