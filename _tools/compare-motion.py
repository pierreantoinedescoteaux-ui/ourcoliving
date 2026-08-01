#!/usr/bin/env python3
"""Does the new clip actually move where P-A said it doesn't?

The handoff's warning, and it matters: frame-diffing proved the OLD S1 loop
moves across essentially the whole frame while P-A still read it as a still.
So a diff COUNT is not the gate. What is measured here is motion PER REGION,
in the specific places he named, old clip against new, so the answer is
"the lantern went from 0.8 to 6.4" rather than "there is motion".

    python _tools/compare-motion.py old.mp4 new.mp4
"""
import subprocess
import sys
import tempfile
import pathlib

import numpy as np
from PIL import Image

# fractions of the frame, read off assets/tower/S6.webp
REGIONS = {
    "lantern (fireflies)": (0.655, 0.495, 0.775, 0.790),
    "couch (mother+child)": (0.415, 0.515, 0.560, 0.690),
    "table (child drawing)": (0.495, 0.655, 0.610, 0.790),
    "balcony (watering can)": (0.525, 0.375, 0.605, 0.560),
    "lamp": (0.470, 0.415, 0.535, 0.560),
    "sunset + valley": (0.600, 0.250, 0.700, 0.420),
    "whole frame": (0.0, 0.0, 1.0, 1.0),
}


def frames(path, times):
    out = []
    with tempfile.TemporaryDirectory() as td:
        td = pathlib.Path(td)
        for i, t in enumerate(times):
            p = td / f"f{i}.png"
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(t),
                            "-i", str(path), "-frames:v", "1", str(p)], check=True)
            out.append(np.asarray(Image.open(p).convert("L"), dtype=np.int16))
    return out


def motion(path):
    fs = frames(path, [0.4, 1.6, 2.8, 4.0, 5.2, 6.4])
    H, W = fs[0].shape
    acc = np.zeros((H, W), dtype=np.float32)
    n = 0
    for i in range(len(fs)):
        for j in range(i + 1, len(fs)):
            acc += np.abs(fs[i] - fs[j]).astype(np.float32)
            n += 1
    acc /= n
    out = {}
    for name, (x0, y0, x1, y1) in REGIONS.items():
        sub = acc[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)]
        out[name] = float(sub.mean()) if sub.size else 0.0
    return out


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    old, new = sys.argv[1], sys.argv[2]
    a, b = motion(old), motion(new)
    print(f"{'region':<24} {'old':>7} {'new':>7} {'change':>9}")
    print("-" * 52)
    worse = []
    for name in REGIONS:
        o, n = a[name], b[name]
        ratio = (n / o) if o > 0.01 else float("inf")
        arrow = f"x{ratio:.1f}" if ratio != float("inf") else "  new"
        print(f"{name:<24} {o:7.2f} {n:7.2f} {arrow:>9}")
        if name != "whole frame" and n < o:
            worse.append(name)
    print()
    if worse:
        print("MOVES LESS than before in: " + ", ".join(worse))
    else:
        print("every named region moves at least as much as before")


if __name__ == "__main__":
    main()
