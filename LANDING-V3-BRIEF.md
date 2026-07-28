# LANDING v3 — build brief (one-shot spec, ANSWERS LOCKED 2026-07-27)

All of P-A's answers are in. Build in a FRESH chat: read this file fully,
load `frontend-design` + `ui-ux-pro-max`, study index.html + tower-engine.js
(the quality bar AND the substrate — v3 is an EVOLUTION of that page, not a
new page), plus MOBILE-RULES.md + DESKTOP-SCALE-RULES.md. Stage as
`landing-v3.html` (copy of index.html + changes) for P-A's verdict; swap to
index.html only after approval. landing-v2.html = dead test, delete after v3
ships.

## 0. THE ARCHITECTURE (P-A's answer #3 — this changes everything)
The map and the scenes are ONE page. Clicking a space does NOT navigate to a
section page — it zoom-blurs INTO that scene's ambient-loop dwell, which
ALREADY EXISTS as the scroll landing's scenes (S2–S7 dwells in
index.html/tower-engine). "It would be great if this feels more like zooming
in the room on this page than loading and appearing on a new page."
So v3 = index.html evolved:
1. The first dwell (S1) becomes MAP MODE: full-screen S1 ambient loop with
   the labeled spaces layered on top.
2. Click a label → fast zoom + blur veil → arrive AT that scene's dwell
   (engine hash-jump to section exists; add the zoom-blur veil transition and
   make it feel continuous, not a page load).
3. Each scene's overlay copy is REWRITTEN (see §3) to be self-explanatory
   about what the space is, with sublinks to the real pages (the existing
   doorway-link mechanism). No fictional-building narration.
4. "Take the slow tour" = the reverse-order tour (see §5).

## 1. LOCKED — map mode (the hero)
- Full-screen S1 ambient loop (`loop-s1.mp4` family) exactly like today's
  landing dwell — labels layered on top. No cropped mid-page image.
- Every space: name in black + a SMALL BLACK MARK (same minimalist line-mark
  language as type.html's guide icons — P-A confirmed) + a thin hairline line
  UNDER the name pointing to the part of the image that best fits the space.
  All visible BEFORE any interaction — the labels are part of the design.
- Hover/tap: the label takes the space's accent color, its one-line
  description appears, and the region highlights painterly — soft feathered
  edge, rest of scene gently dims/desaturates. NO colored polygon fills, no
  stroked octagons. Region shapes hand-traced to the actual drawn features.
- Legend under the hero, quiet (only for people who don't know where to go):
  "coliving knowledge → the library & the workshop (& the summit) ·
   the vision & the hope → the garden · about me → the home."
- Plain-language list of spaces further down the page (a11y/SEO) as in v2.

## 2. LOCKED — copy (hero)
Humble, hopeful, concrete, zero selling. A stranger with no context gets in
seconds: this site = (a) resources on coliving — some created by P-A, some
pooled from experts and organizations, leaning toward a directory; (b) a
manifesto of hope; (c) his story and work — so that wherever someone is in
their coliving journey, something here is for them. That's the VIBE, not
verbatim (P-A: "don't copy any of this verbatim"). Write it plainly, in his
register, [edit]-marked. Say what to do: click a space, or take the tour.

## 3. LOCKED — the six spaces (word is "space", never "room")
Scene copy rule: each scene's overlay states what the SPACE is about (real
site content, zero fiction, no context needed) + sublinks to its pages.
| Space | It answers | Scene | Links to |
|---|---|---|---|
| The Summit | Where is this happening? | S7 lookout | map.html, type.html (the shapes of coliving) |
| The Homes | Who lives here? | S6 dwellings | story.html, work.html, about.html |
| The Library | What's known? | S3 library | resources learning, designers.html, themes? (knowledge collection — NOT "literature") |
| The Workshop | How does it get built? | S4 workshop | design.html (+ the 20 themes as the workbench questions) |
| The Garden | Why do this at all? | S5 greenhouse belt | manifesto.html + talkpieces.html (writings = opinions = they live with the vision, P-A provisional: "put it there for now, I might switch it") |
| The Commons | Where do you come in? | S2 plaza | resources networks/orgs, contact |
Note Library/Garden shift: Writings moved OUT of Library into Garden.
Library is the knowledge/reading collection, not "literature."

## 4. LOCKED — click transition
Fast-paced zoom toward the space's spot on the tower + blur, fading INTO the
scene's ambient loop dwell. Continuous, in-world, no page-load feel.
Reduced-motion: instant jump, no zoom.

## 5. LOCKED — the slow tour (reverse order, ZERO rebuild)
Reverse narrative: start at the top (summit) and descend space by space —
"it's literally the same as when I scroll back up." The engine already plays
every transition backwards on upward scroll. Implement by entry point +
direction (e.g. tour button zooms to the summit dwell, then the visitor
proceeds through the existing sequence in reverse), NOT by re-encoding or
rebuilding clips. Day-arc note: reversed, light runs sunrise→dusk→morning —
accepted for now; flag to P-A after first build if it feels wrong.

## 6. Engineering + discipline
- Reuse v2's working mechanics (hit regions, mobile pills + sheet,
  reduced-motion, plain list) with the new visual layer. Feathered
  highlight: blurred SVG mask or pre-rendered alpha matte per region.
- Six black marks: inline SVG line-marks in the type.html icon language —
  free, no generation. (Painted-sticker route explicitly NOT needed; P-A
  approved the line-mark language.)
- NO scene generation. No credits expected for this build.
- Mobile: labels must work always-visible on phones (pills or stacked
  callouts — design it, don't punt); scene dwells already phone-aware.
- QA: extend `_qa/shoot-lv2.js` pattern — labels visible pre-hover, hover
  highlight, click lands in scene dwell (video playing, copy visible),
  tour-reverse entry, phone pass, 0 console errors, screenshots eyeballed.
- Interior/section PAGES keep their own copy-clarity rule (every page hero
  states its purpose plainly — separate round, logged in FEEDBACK.md).

## 7. Parked (P-A said so)
- Garden's physical position paradox — don't over-solve.
- Spaces-within-spaces (click the bookshelf → books) — after v3 lands.
- Writings placement is provisional (Garden) — P-A may move them.
