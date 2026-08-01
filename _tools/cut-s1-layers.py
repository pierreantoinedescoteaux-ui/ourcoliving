"""Cut S1 (the whole tower on its cream field) into parallax planes.

Why this is safe on THIS painting, and would not be on most:
the island is one silhouette standing on flat paper, and the balloon, the
birds, the sun and the cloud float separately on that same paper. So every
gap the parallax opens between the planes is cream — which is what is
supposed to be behind them. Nothing has to be invented or inpainted. The
moment you try to cut INSIDE the island (trees in front of buildings) that
stops being true and you need a generative fill, which is where this stops.

Method is the repo's own key_alpha.py, applied to a still:
  strict cream mask -> keep only the part connected to the frame border
  -> geodesic dilation through looser paper-grain so the vignette edge keys
  but the cloud's own whites survive -> feather -> label what is left.
The biggest surviving component is the island; the rest are sky objects.

Out: _landing/build4/layers/*.webp plus layers.json with each piece's box
in fractions of the source, so the page can compose them for a tall screen
instead of letterboxing a 16:9 painting into a 9:19.5 phone.

Usage: python cut-s1.py
"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = os.path.join(os.path.dirname(__file__), "..", "final", "S1.png")
OUT = os.path.join(os.path.dirname(__file__), "layers")

BG = np.array([249, 233, 205], dtype=float)   # sampled from all four corners

# TWO keys, because the island and the sky want opposite things.
#
# The island wants an AGGRESSIVE key: the paper grain around its vignette
# edge has to go or it wears a cream halo when it moves. TOL_LOOSE 46 does
# that and the silhouette comes out clean.
#
# The sky objects want a GENTLE one. Measured on this painting: at 46 the
# cloud keeps 1,715px of itself, at 34 it keeps 6,115 — the aggressive key
# was eating three quarters of the cloud, because a soft grey wisp sits
# about 38 away from cream and the flood walks straight through it. The
# birds barely care (960 vs 1002) since they are dark strokes.
#
# So: island from key A, everything else from key B. They never overlap, so
# each gets the treatment it needs and neither compromises for the other.
TOL = 24.0            # strict: seeds the background flood from the border
TOL_ISLAND = 46.0     # key A — clean silhouette, no cream fringe
TOL_SKY = 32.0        # key B — keeps soft edges (the cloud)
FEATHER = 2.0
ERODE = 1
MIN_AREA_SKY = 0      # unused: naming, not size, decides what a piece is
GROUP_PX = 14         # dilation used only to group a flock into one object
GROUP_SKY_PX = 6      # tight: the sun and the cloud are only 61px apart
CRUMB_MIN = 12        # px: a single bird stroke; below this is paper speckle

os.makedirs(OUT, exist_ok=True)
im = np.asarray(Image.open(SRC).convert("RGB"), dtype=float)
H, W, _ = im.shape
print(f"source {W}x{H}")

st = ndimage.generate_binary_structure(2, 2)
dist = np.sqrt(((im - BG) ** 2).sum(axis=2))
lab, _ = ndimage.label(dist < TOL, structure=st)
border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
border = border[border != 0]
seed = np.isin(lab, border)


def key(tol_loose, erode):
    """One pass of the repo's hysteresis key at a given looseness."""
    bg = ndimage.binary_propagation(seed, mask=dist < tol_loose, structure=st)
    k = ~bg
    if erode:
        k = ndimage.binary_erosion(k, iterations=erode, structure=st)
    return k


keep_island = key(TOL_ISLAND, ERODE)
keep_sky = key(TOL_SKY, 0)          # no erosion: a bird is two strokes wide

# --- the island: the one big thing ---------------------------------------
lab_i, n_i = ndimage.label(ndimage.binary_dilation(keep_island, structure=st,
                                                   iterations=GROUP_PX), structure=st)
sizes = ndimage.sum(keep_island, lab_i, range(1, n_i + 1))
island_id = int(np.argmax(sizes)) + 1
island_mask = (lab_i == island_id) & keep_island

# --- the sky: everything else, from the gentler key -----------------------
# anything the island already owns is removed first (dilated, so the gentle
# key's slightly fatter edge around the island does not come back as debris)
not_island = ~ndimage.binary_dilation(island_mask, structure=st, iterations=10)
sky_only = keep_sky & not_island
lab_s, n_s = ndimage.label(ndimage.binary_dilation(sky_only, structure=st,
                                                   iterations=GROUP_SKY_PX), structure=st)
print(f"{n_s} sky components before the area filter")

# Grouping stays TIGHT (the sun and the cloud are only 61px apart and weld
# together at anything looser), so the flock of birds arrives as five separate
# scraps. Both problems are solved after the fact instead: name every scrap by
# WHERE IT SITS, then merge everything that got the same name. Positions are
# stable between runs; areas and component counts are not.
def name_for(m):
    ys, xs = np.where(m)
    cx, cy = xs.mean() / W, ys.mean() / H
    if cx < 0.5:
        return "balloon" if cy < 0.26 else "birds"
    return "sun" if cy < 0.25 else "cloud"


named = {}
for i in range(1, n_s + 1):
    m = (lab_s == i) & sky_only
    if int(m.sum()) < CRUMB_MIN:          # paper speckle, not a thing
        continue
    n = name_for(m)
    named[n] = m if n not in named else (named[n] | m)

pieces = [{"mask": island_mask, "name": "island"}]
for n in ("cloud", "sun", "balloon", "birds"):
    if n in named and int(named[n].sum()) >= CRUMB_MIN:
        pieces.append({"mask": named[n], "name": n})
print(f"{len(pieces)} pieces kept: " + ", ".join(p["name"] for p in pieces))

alpha_i = ndimage.gaussian_filter(keep_island.astype(float), FEATHER)
alpha_i = np.clip((alpha_i - 0.25) / 0.5, 0, 1)
alpha_s = ndimage.gaussian_filter(keep_sky.astype(float), 1.3)
alpha_s = np.clip((alpha_s - 0.3) / 0.45, 0, 1)

manifest = []
for k, p in enumerate(pieces):
    name = p["name"]
    m = p["mask"]
    a = (alpha_i if name == "island" else alpha_s) * m
    ys, xs = np.where(m)
    p["x0"], p["x1"] = int(xs.min()), int(xs.max()) + 1
    p["y0"], p["y1"] = int(ys.min()), int(ys.max()) + 1
    p["area"] = int(m.sum())
    pad = 6
    x0, x1 = max(0, p["x0"] - pad), min(W, p["x1"] + pad)
    y0, y1 = max(0, p["y0"] - pad), min(H, p["y1"] + pad)
    rgba = np.dstack([im[y0:y1, x0:x1].astype(np.uint8),
                      (a[y0:y1, x0:x1] * 255).astype(np.uint8)])
    img = Image.fromarray(rgba, "RGBA")
    img.save(os.path.join(OUT, name + ".webp"), quality=88, method=6)
    manifest.append({
        "name": name, "file": name + ".webp",
        "area": p["area"],
        "w": x1 - x0, "h": y1 - y0,
        # position and size as fractions of the source frame, so the page can
        # place each piece wherever a portrait composition wants it
        "fx": round(x0 / W, 5), "fy": round(y0 / H, 5),
        "fw": round((x1 - x0) / W, 5), "fh": round((y1 - y0) / H, 5),
    })
    print(f"  {name:8s} {x1-x0:5d}x{y1-y0:<5d} area={p['area']:>9d} at ({x0},{y0})")

with open(os.path.join(OUT, "layers.json"), "w") as f:
    json.dump({"source": [W, H], "bg": BG.tolist(), "pieces": manifest}, f, indent=1)
print("\nlayers.json written")
