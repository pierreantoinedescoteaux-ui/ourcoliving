# LANDING v3.1 — build notes for P-A

Built on branch `landing-v3`, on top of the original v3 build (see
`LANDING-V3-BRIEF.md` and the v3 notes below §9). Staged as `landing-v3.html`;
**`index.html` is untouched** and still what deploys.

Run it: `npx http-server -p 8123 -s .` → <http://localhost:8123/landing-v3.html>
Calibration view (traced regions + anchor points, map AND in-scene): `landing-v3.html?debug`
QA: `node _qa/shoot-lv3.js` — the consolidated v3.1 suite, canonical entry point.

---

## 1. What shipped this round (slices A → E)

**Slice A — full-tower map.** S1 (map mode) switched from cover-fit (cropped)
to contain-fit: the whole tower shows, letterboxed into the cream field on
every desktop width. `frame()` mirrors the same contain math so every label
and hairline stays glued to the drawing, and the poster's per-scroll camera
push is neutralised on S1 so the map holds still.

**Slice A — always-on category colour + legend.** Every label (map AND
in-scene) now carries its category colour AT REST, not just on hover —
toned toward ink so it stays legible over the drawing, saturating to the
pure accent on hover/focus. A five-chip legend names the categories:
resources (teal), hope (amber), me (blue), overview (terracotta), connect
(green). Teal is reused across two map spaces (Library + Workshop).

**Slice A — map scroll lock.** Map mode now locks scrolling. The only exits
are clicking a space or taking the tour. A blocked wheel/key/touch attempt
nudges the map and pulses the tour button so the visitor learns the two
exits, on a 520ms throttle so a wheel spin can't spam it.

**Slice B — inverted tour.** The slow tour still lands on the summit, but
scroll direction is now inverted while touring: a natural scroll/swipe/key
DOWN descends the tower (heads back toward scrollY 0), matching how people
actually scroll to "go down" a page. Reaching S1's resting point ends the
tour and re-engages map mode + the lock, with a short eased glide to settle
exactly at the top.

**Slice C — in-scene hotspots.** Every dwell (S2–S7) now labels its own
drawn features in the map's own visual language — anchored names, hairline
leaders, painterly hover highlight, category-coloured — instead of leaving
the tag-pill list as the only interior links. 18 hotspots total: commons 3,
library 4, makers 3, gardens 2, homes 3, lookout 3. Desktop-only (≥861px);
the tag pills stand down there and remain the phone interface (the `-m`
crops reframe every scene, so the traced desktop coordinates don't apply to
phones). Clicking a hotspot does a fast zoom-toward-element + blur + cream
veil, then a REAL page navigation (~0.5s) — not a same-page jump like the
map doors. Ctrl/Cmd-click and reduced motion both fall through correctly.

**Slice D — new pages + rebrand.** `networks.html` (curated, fed from
`resources-data.js`), `how-to.html` and `community.html` (designed
under-construction placeholders) are live. The nav brand changed to
"Our Coliving" site-wide (P-A's name stays in the footer signature and the
copyright line). Titles on live content pages now end "— Our Coliving"
(the `index.html` tower page keeps "— Pierre-Antoine Descoteaux" — it's the
tower experience itself, not a content page).

**Slice E (this pass) — QA consolidation.** `_qa/shoot-lv3.js` rebuilt from
scratch to cover the full v3.1 model in one canonical suite (see §6).

---

## 2. What changed vs P-A's original feedback list

Everything the v3 notes (§9 below) flagged as "your call" or "flag if you
disagree" is unchanged in this round except where a slice explicitly
addressed it:

- **The day-arc reversal** (§9, 3.1) — still unresolved, still your call. See
  §4 "known limitations" below.
- **Scene section ids** (§9, 2.3) — still `commons/library/makers/gardens/
  homes/lookout`, unchanged; site-nav's back-links still work.
- **The Workshop's long leader line** (§9, 3.2) — unchanged in the map view.
  In-scene hotspots (new this round) have their own, shorter leader lines
  local to each scene, so this only affects the map-mode Workshop label.
- **Copy still marked `[edit]`** — the map's hero/scene copy from v3, plus
  all 18 new in-scene one-liners this round, are drafts in P-A's register,
  not his voice. Full list in §4.

Nothing from the v3 gaps/judgment-calls list was reopened or reversed this
round — Slices A–D were additive on top of the v3 shape.

---

## 3. Bugs found and fixed during this QA pass

**Zero product bugs found.** Every check below that initially failed was a
**stale assumption in the QA scripts themselves**, not a defect in
`landing-v3.html`. No changes were made to `landing-v3.html`, the three new
pages, or any shared file during this QA pass. Specifically, while
consolidating `_qa/shoot-lv3.js`:

- The old v3 selector `.lv3-label` (unscoped) now also matches the 18 new
  in-scene hotspot labels, since Slice C reused the same class name for
  them. Every "six spaces built" / "six labels" check needed scoping to
  `#lv3labels .lv3-label` (the map layer only) to keep meaning what it says.
  Fixed in the consolidated suite; no product impact — the map really does
  have exactly six labels.
- A "letterboxing" assertion I added (checking that contain-fit always pads
  one axis) is wrong at exactly-16:9 viewports (1920×1080): contain and
  cover coincide there, so neither axis pads — that's correct, not a bug.
  Rewrote the check to assert "never overflows" instead, which is what
  actually matters.
- A "pointer-events: inherit" check compared `getComputedStyle(...)
  .pointerEvents` to the literal string `"inherit"` — but the browser always
  resolves `inherit` to the actual inherited value, never hands back the
  keyword. Rewrote the guard to confirm the CSS rule is present in source
  instead (the functional behaviour — no phantom taps — is already proven
  by the phone pill-tap-navigates test elsewhere in the suite).
- A phone test tapped a generic `.lv3-row` (landing in a scene) and then
  tried to tap a second, specific row (`[data-key="garden"]`) without
  returning to map mode first — the stacked callouts only exist while map
  mode is showing, so the second tap timed out waiting on a hidden element.
  Fixed by scrolling back to the top between the two taps.

---

## 4. Copy still marked `[edit]`

Everything written to the vibe brief (humble, concrete, zero selling) but
in Claude's ear, not P-A's:

- **Map mode:** the hero H1 ("Wherever you are with coliving…"), all six
  scene body sentences on the map's own overlay data (`LV3_SECTIONS[].body`
  in `landing-v3.html`), the summit's CTA labels.
- **In-scene hotspots (new this round):** 16 of the 18 one-liners are
  marked `[edit]` — the two unmarked are P-A's own words ("a manifesto for
  hope we cultivate" on The Gardens, and the summit spots draft still
  needs a look).
- Grep `[edit]` in `landing-v3.html` for the exact list; every marked string
  is a plain-text span, easy to find and replace in place.

---

## 5. Known limitations (carried + new)

- **Day-arc still reversed** (v3, §9 3.1, unresolved). S7 is a sunrise scene
  and S6 is dusk, so descending from the summit still reads sunrise → dusk
  → … → morning. The copy avoids naming times of day so nothing in the text
  contradicts the light, but the light itself runs backwards. Your call.
- **Loop drift on the murals hotspot poly** (Slice C, library scene). "The
  murals" hotspot region is traced against a still frame of `S3.webp`; the
  library's ambient loop has camera movement inside the shot, so the
  painterly highlight mask can drift slightly out of register with the
  drawn mural as the loop plays. Only visible on a long hover during
  playback, not on the poster frame. A fix would mean re-tracing the poly
  against the loop's motion (or animating the mask), which is a real-browser
  judgment call, not a QA-catchable defect.
- **In-scene hotspot anchors can fall off-screen at extreme portrait
  "desktop" widths** (new finding, this QA pass). At 1024×1366 (e.g. an
  iPad Pro in portrait, still ≥861px so treated as desktop) three scenes'
  hotspot anchors project outside the viewport: commons (The market
  stalls), library (The bookshelves, The painter, The murals, The study
  tables), makers (The blueprint, The tool walls). The LABEL itself always
  stays on-screen (it's explicitly clamped in `placeSpots()`), but the
  hairline's far endpoint — the point it's supposed to lead the eye to —
  can point off-canvas at this aspect ratio, because in-scene hotspot
  anchors are cover-fit-projected and never clamped to the visible crop the
  way the label position is. The Slice C builder's own QA spike
  (`spike-lv31-c.js`) already excluded this exact viewport from its
  hotspot sweep — likely for this reason — while the map layer's
  contain-fit (Slice A) doesn't have the problem, since it clamps
  everything to the visible slice already. Structural fix (extend the
  label-clamping logic to the leader-line endpoint too), not a small patch
  — flagged as an open issue, not touched this pass.
- **GEN/FIC dual-listing on `resources.html`** (Slice D, intentional).
  Foundation for Intentional Community (FIC) and Global Ecovillage Network
  (GEN) now appear under both their original category AND `networks` (see
  the comment in `resources-data.js` line 9) — both are genuinely both
  things (a directory AND a network), so this is deliberate, not a bug.
- **`landing-v2.html` is still here** (v3, §9 4.4, carried). Delete at swap
  time, per the original brief.
- **Video playback / real browser feel** — this QA pass ran in real Chrome
  (H.264 present), so ambient loops, webfonts and touch all render for
  real this time (unlike the original v3 pass, which ran in Playwright's
  headless Chromium with no H.264 decoder). See §7 for what's still worth
  a human look regardless.

---

## 6. QA coverage (`node _qa/shoot-lv3.js`)

The consolidated v3.1 suite. Merges the still-valid v3 checks with the
three build-slice spikes (`spike-lv31-ab.js`, `spike-lv31-c.js`,
`shoot-lv31-d.js`), which remain in `_qa/` as historical record but are
superseded by this file as the canonical entry point.

Covers: map contain-fit letterbox math at 1280×800/1920×1080/2560×1080/
1024×1366 (exact `frame()` math assertion, not just a visual spot-check) ·
never-overflows guard · six map labels/marks/hairlines present before any
interaction · category colour at rest on every label and leader · the
5-chip legend, colour-checked · the teal-reused-twice legend/space mapping ·
no label over the hero/plain-list/nav · phantom-pill guard (source-level) ·
hover paints accent + one-liner + feathered highlight · map click lands in
the right dwell, video playing, veil/stage cleaned up · scroll lock (wheel
+ keyboard) with nudge/pulse feedback · the inverted tour (enter → summit →
wheel-DOWN descends one dwell at a time → reaches ground → map + lock
re-engage) · 18 in-scene hotspots per-scene (count, on-screen, no overlap
with copy or each other, hover reveals name+one-liner) between-dwell
stand-down · tour regression for summit hotspots · hotspot click departs
with veil then really navigates (ctrl-click opens a new tab instead) ·
reduced motion (instant jump + plain hotspot navigation) · phone (six
callouts, category-coloured borders, spot layer hidden, pill counts
3/4/3/2/3/3 with ≥44px taps and ≥16px text, tap-to-navigate) · the three new
pages + `resources.html` (200, "Our Coliving" brand, P-A's name in the
footer, zero console errors) · title sweep spot-check · every hotspot href,
tag href, nav link and scene asset resolving 200 · zero same-origin
console/page errors on every pass.

Third-party failures (the blocked webfont, when proxied) are counted
separately and reported, not swallowed.

Headline screenshots refreshed this pass: `lv31-final-map-1440.png`,
`lv31-final-map-2560.png`, `lv31-final-tour-summit.png`,
`lv31-final-scene-library-hover.png`, `lv31-final-phone-map.png`,
`lv31-final-phone-scene.png`.

---

## 7. Real-browser checklist — worth five minutes in actual Chrome/Safari

This QA pass ran in **real Chrome** (`channel:"chrome"` / explicit
`chrome.exe`), so H.264 and Fontshare webfonts both loaded — a step up from
the original v3 pass, which ran in Playwright's headless Chromium with
neither. Still worth your own eyes on:

1. **The ambient loops' feel against the zoom-blur choreography** — QA
   confirms the video is playing and the stage transform/filter reset
   cleanly, but not whether the blur-into-motion *reads* well emotionally.
2. **Webfonts (Zodiak/Switzer) at a glance** — QA measures layout, not
   whether the type pairing feels right once it's not a fallback serif.
3. **The tour's scroll feel, inverted** — mechanically verified (wheel down
   = descend, index drops, ends at the map), but whether the *inversion
   itself* feels intuitive on first try, versus needing the hint text, is a
   human call.
4. **In-scene hotspot hover feel** — the highlight paints, the one-liner
   shows, but whether 18 new little hover targets feel discoverable (versus
   cluttered) across six different pictures is worth a real look, especially
   on the Library (4 spots) and Workshop scenes.
5. **The murals loop-drift** (§5) — only visible during actual playback,
   not on a poster frame.

---

## 8. What could NOT be verified even in real Chrome

- **Subjective voice on the `[edit]`-marked copy** (§4) — still Claude's
  ear, not P-A's, regardless of browser.
- **Interior/section page copy-clarity** — separate round per the original
  brief §6/§7, not started, not in scope for this QA pass.

---

## 9. v3 notes (original build, preserved below)

Everything below this line is the original `LANDING-V3-NOTES.md` from the
v3 build, before slices A–E. Kept verbatim for reference — none of it was
reopened this round except where §2 above says so.

### 9.1 Gaps in the brief — things it asked for that don't exist in the repo

**The two skills the brief opens with are not available.**
The brief says to "load `frontend-design` + `ui-ux-pro-max`". Neither exists in
this repo or in this session's skill set. v3 was built to `MOBILE-RULES.md`,
`DESKTOP-SCALE-RULES.md`, `DESIGN.md` and the idioms already in `index.html` /
`site-nav.js` / `type.html` instead. **If those skills carry design rules that
aren't written down in the repo, that build hadn't seen them.**

**`resources.html` had no category anchors.**
The brief sends the Library to "resources *learning*" and the Commons to
"resources *networks*/orgs", but `resources.html` rendered its three categories
with no `id`s, so `#learning` / `#networks` went nowhere. `id="<cat.key>"` was
added to each category section plus a hash-scroll. Anchors verified working
for `#maps`, `#networks`, `#learning`.

**The phone clip is a different picture.**
`S1-m.webp` / `loop-s1-m.mp4` are **portrait 9:16 crops (608×1080)** of a
different framing than the 1600×900 desktop plate. Phones get **always-visible
stacked callouts** — mark, name, one line, tappable, same zoom-into-scene
transition — rather than image-anchored labels.

**"Plain-language list further down the page" has no "down the page".**
`index.html` is a fixed-stage scroll-world — the scroll length *is* the tour,
and there is no normal document flow to put a list into. The plain list
renders as a quiet, always-visible block in the bottom-left of map mode.

### 9.2 Judgment calls made — please accept or overrule

**2.1 The twenty themes went to the Workshop, not the Library.** Kept the
Library a reading collection (books), gave the Workshop the 20 themes.

**2.2 Two links added that aren't in the brief's table.** Library →
`inspiration.html`; Summit → `projects.html`.

**2.3 Section `id`s kept as they are.** Scenes stay `commons/library/makers/
gardens/homes/lookout` even though the labels read "The Workshop", "The
Garden", "The Summit" — `site-nav.js` builds its "↑ back to the tower" links
off those exact keys.

**2.4 Where each space points on the drawing** — hand-traced to the actual
drawn features, not to floors. Garden and Commons are two sub-shapes each.
Coordinates normalised 0–1 against `S1.webp`, in the `SPACES` array.

**2.5 The engine's route rail and scroll hint stand down on phones in map
mode.** They fade back in the moment the climb starts.

**2.6 `tower-engine.js` gained a return value.** `mountScrollWorld()` returns
`{ jumpTo, jumpToInstant, dwellCenter, preload, stage, sections, indexOf, ...
}` — purely additive, `index.html` ignores it and is byte-for-byte unchanged
in behaviour.

### 9.3 Things the brief flagged for a look after the first build

**3.1 The day-arc, reversed (§5).** See §5 above — still unresolved.

**3.2 The Workshop's leader line is the long one.** Crosses only unassigned
terrain, cream under-stroke keeps it readable, but reads as a long
annotation rather than a short tag on the map view.

**3.3 Copy is a draft.** See §4 above for the current `[edit]` list.

### 9.4 What could NOT be verified in the original v3 pass

**4.1 Video playback** — the original QA browser (Playwright's bundled
Chromium) shipped without H.264, so ambient loops couldn't be tested there;
this QA pass (§6-§8 above) closes that gap by running in real Chrome.

**4.2 Screenshots were in the wrong typeface** — `api.fontshare.com` was
unreachable through that sandbox's proxy; this pass's screenshots use the
real webfonts.

**4.3 Not touched, as specified.** Interior/section page copy-clarity is a
separate round — still not started (§8 above).

**4.4 `landing-v2.html` is still here.** Still true — delete at swap time.
