# LANDING v3 — build notes for P-A

Built from `LANDING-V3-BRIEF.md` on branch `landing-v3`. Staged as
`landing-v3.html`; **`index.html` is untouched** and still what deploys.

Run it: `npx http-server -p 8123 -s .` → <http://localhost:8123/landing-v3.html>
Calibration view (shows the traced regions + their anchor points):
`landing-v3.html?debug`
QA: `node _qa/shoot-lv3.js` — 42 checks, all green.

---

## 1. Gaps in the brief — things it asked for that don't exist in the repo

**1.1 The two skills the brief opens with are not available.**
The brief says to "load `frontend-design` + `ui-ux-pro-max`". Neither exists in
this repo or in this session's skill set. I built to `MOBILE-RULES.md`,
`DESKTOP-SCALE-RULES.md`, `DESIGN.md` and the idioms already in `index.html` /
`site-nav.js` / `type.html` instead. **If those skills carry design rules that
aren't written down in the repo, this build hasn't seen them.**

**1.2 `resources.html` had no category anchors.**
The brief sends the Library to "resources *learning*" and the Commons to
"resources *networks*/orgs", but `resources.html` rendered its three categories
with no `id`s, so `#learning` / `#networks` went nowhere. I added `id="<cat.key>"`
to each category section plus a hash-scroll (the cards render from JS *after*
the browser has already resolved the hash, so the jump has to be done by hand).
**This edits a shared page** — it's on the branch, not on master. Anchors now
verified working for `#maps`, `#networks`, `#learning`.

**1.3 The phone clip is a different picture.**
`S1-m.webp` / `loop-s1-m.mp4` are **portrait 9:16 crops (608×1080)** of a
different framing than the 1600×900 desktop plate. The desktop label positions
and hand-traced region shapes are normalised to the desktop frame and cannot be
reused on the portrait crop. Per §6 ("design it, don't punt") phones get
**always-visible stacked callouts** — mark, name, one line, tappable, same
zoom-into-scene transition. If you want labels *on* the picture on phones, that
needs a **second hand-traced coordinate set against `S1-m.webp`** — say the word
and it's an hour of tracing, not a rebuild.

**1.4 "Plain-language list further down the page" has no "down the page".**
`index.html` is a fixed-stage scroll-world — the scroll length *is* the tour, and
there is no normal document flow to put a list into. Anything placed after the
track would appear only after all seven scenes, floating over the fixed stage.
So the plain list is rendered as a quiet, always-visible block in the bottom-left
of map mode: six real `<a href>` links with their plain question. a11y and SEO
are satisfied honestly (the labels themselves are also real links). **Flag if you
specifically wanted it below the fold.**

---

## 2. Judgment calls I made — please accept or overrule

**2.1 The twenty themes went to the Workshop, not the Library.**
The brief's table lists `themes?` under the Library *with a question mark* and
"the 20 themes as the workbench questions" under the Workshop without one. I put
them in the Workshop only, and gave the Library `inspiration.html` (books) in
that slot instead — which keeps the Library a reading collection, per your
"NOT literature" note.

**2.2 Two links added that aren't in the brief's table.**
- Library → `inspiration.html` (books of inspiration) — see above.
- Summit → `projects.html` (real communities). "Where is this happening?" seemed
  to want the actual communities alongside the map and the models.

Both are one-line removals if you disagree.

**2.3 Section `id`s kept as they are.**
Scenes stay `commons / library / makers / gardens / homes / lookout` even though
the labels now read "The Workshop", "The Garden", "The Summit". `site-nav.js`
builds its "↑ back to the tower" links as `index.html#<key>` off those exact
keys, so renaming them would break every interior page the day v3 becomes
`index.html`. Only the visible labels and copy changed.

**2.4 Where each space points on the drawing.**
Hand-traced to the actual drawn features, not to floors:

| Space | Points at |
|---|---|
| The Summit | the crowning domed tower |
| The Homes | the terraced dwellings on the upper-left flank |
| The Library | the great teal domed hall |
| The Workshop | the arcaded masonry quarter by the waterfall |
| The Garden | the barrel-vaulted glasshouse belt **+** the terraced fields bottom-left |
| The Commons | the ground-level market plaza **+** the right-hand promenade |

Garden and Commons are two sub-shapes each (like v2's garden). Re-trace any of
them in `?debug` — the coordinates are normalised 0–1 against `S1.webp`, in the
`SPACES` array at the top of the page's script.

**2.5 The engine's route rail and scroll hint stand down on phones in map mode.**
They were sitting on top of the six callouts. They fade back in the moment the
climb starts. Desktop keeps both.

**2.6 `tower-engine.js` gained a return value.**
`mountScrollWorld()` now returns `{ jumpTo, jumpToInstant, dwellCenter, preload,
stage, sections, indexOf, ... }` so the map can drive the world. Purely
additive — `index.html` ignores the return value and is byte-for-byte unchanged
in behaviour (verified: still builds its 13 segments, zero errors). But it *is*
a shared file, so it ships when the branch ships.

---

## 3. Things the brief flagged for a look after the first build

**3.1 The day-arc, reversed (§5).** Confirmed: it does run backwards. S7 is a
sunrise scene and S6 is dusk, so descending from the summit reads
sunrise → dusk → … → morning. I softened it slightly by dropping the times of
day out of the scene eyebrows (v1 had "Sunrise · the summit", "Upper terraces ·
dusk"; v3 says "The summit · where this is happening", "The homes · who lives
here"), so nothing in the copy contradicts the light any more. The light itself
still runs backwards. **Your call whether that's a problem.**

**3.2 The Workshop's leader line is the long one.** Its label has to sit far
left — the hero owns the top-left and the workshop's feature is mid-picture —
so its hairline crosses a good stretch of the drawing. It crosses only
unassigned terrain (no other space's region), and the cream under-stroke keeps
it readable, but it's the one leader that reads as a long annotation rather than
a short tag. Easy to move if it bothers you.

**3.3 Copy is a draft.** Every rewritten string is marked `[edit]`. Hero, six
scene overlays, six one-line descriptions, the legend. Written to the vibe in
§2 (humble, concrete, zero selling, nothing copied verbatim) but it's my ear,
not yours.

---

## 4. What I could NOT verify here, and what you should check yourself

**4.1 Video playback — not testable in this environment.**
The QA browser (Playwright's bundled Chromium) **ships without the H.264
decoder**. `canPlayType('avc1')` returns empty and every `.mp4` fails with
`DEMUXER_ERROR_NO_SUPPORTED_STREAMS`. **This is not a v3 bug — the live
`index.html` fails identically in the same browser.** The QA detects the missing
decoder and falls back to asserting the destination scene's still poster is
painted. So verified: the right scene arrives, its copy is up, the stage
transform/blur is cleaned up. **Not verified: that the ambient loops actually
play, and how the zoom-blur reads against moving video.** Open it in real
Chrome/Safari — that's the one thing this build has not been seen doing.

**4.2 The screenshots are in the wrong typeface.**
`api.fontshare.com` is unreachable through this sandbox's proxy, so every
screenshot in `_qa/lv3-*.png` renders in fallback serif/sans instead of
Zodiak/Switzer. Layout is computed at runtime from measured text so it
self-corrects, and the four-viewport sweep confirms nothing falls off screen —
but **the screenshots are not what the page looks like.**

**4.3 Not touched, as specified.** Interior/section page copy-clarity is a
separate round (§6) — not started. Parked per §7: the garden's position paradox,
spaces-within-spaces, and the writings-in-the-garden placement (provisional,
built as briefed).

**4.4 `landing-v2.html` is still here.** The brief says delete it after v3 ships.
v3 hasn't shipped, so I left it. Delete it at swap time.

---

## 5. QA coverage (`node _qa/shoot-lv3.js`)

Labels + marks + hairlines present before any interaction · no label sitting on
the hero, the plain list or the nav · hover paints the accent, the one-liner and
the feathered highlight · click does not navigate and lands in the right dwell
with its copy up · veil lifted and stage cleaned afterwards · tour lands on the
summit and says to scroll up · scrolling up from the summit descends into the
homes · reduced motion jumps instantly with no zoom · phone gets six callouts,
all on screen, tap lands in the scene · four-viewport sweep (1280×800,
1920×1080, 2560×1080, 1024×1366) with no door off screen · every link, scene
still and clip resolves (49 assets) · zero same-origin console/page errors on
every pass.

Third-party failures (the blocked webfont) are counted separately and reported,
not swallowed.
