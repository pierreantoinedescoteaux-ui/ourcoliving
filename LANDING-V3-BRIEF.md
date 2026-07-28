# LANDING v3 — build brief (one-shot spec)

Status: OPEN QUESTIONS pending P-A (see §6). Everything tagged LOCKED is P-A's
explicit feedback from 2026-07-27 (verbatim-derived); PROPOSED = Claude
proposal awaiting his answer. The build happens in a FRESH chat that reads
this file first, loads `frontend-design` + `ui-ux-pro-max` skills, and studies
index.html (the current landing) for the quality bar before writing a line.

## 1. What this page is
The site's front door. The tower is the literal map of the site: labeled
places, each answering one plain question. The scroll climb (index.html)
survives as "the slow tour" — linked, not replaced. landing-v2.html was a
mechanics test; P-A's verdict: mechanics direction OK, execution a regression.
This brief is the corrective spec. Do NOT call the areas "rooms" (P-A).
Working term: places (confirm in §6).

## 2. LOCKED — visual bar
- Full-screen hero, consistent with the current landing's quality: the scene
  fills the viewport with a proper text layout — NOT a cropped image floating
  mid-page (P-A: "big regression... weirdly cropped photo in the middle").
- Use the existing world assets; the current landing's ambient S1 loop
  (`assets/tower/vid/loop-s1.mp4` + poster `assets/tower/S1.webp`) is the
  expected base layer. No new scene generation unless it clearly serves the
  spec.
- Labels are PART OF THE DESIGN, visible before any interaction: each place's
  name in black text with a thin hairline line pointing to its spot on the
  tower (architectural-callout style, monograph voice). A small BLACK mark
  (logo) sits next to each name (style question in §6).
- Hover/tap a label (or its region): the label takes the place's accent
  color, the one-line description appears, and the region highlights — a
  BETTER highlight than v2's colored polygon fill (P-A: "terrible").
  PROPOSED: no fill at all — the rest of the scene dims/desaturates gently
  while the region keeps full color inside a soft feathered edge (painted
  vignette logic, not vector polygon logic).
- Region shapes must match what the thing actually looks like in the art —
  hand-traced tight, not blocky octagons. (Garden-position paradox parked by
  P-A — don't over-solve.)
- Click: an animation that lands you IN that place's scene — zoom toward the
  region while that scene's ambient loop fades in (the S2–S7 loops exist),
  then hand off to the page. Interior pages already carry scene banners
  (site-nav world layer) so arrival continuity exists.
- Legend under the hero, quiet, non-distracting — only there if you don't
  know where to go: coliving knowledge → library + workshop (+ summit);
  vision / hope → garden (+ writings); about me → home. Exact groupings §6.

## 3. LOCKED — copy bar
- Humble, hopeful, concrete. ZERO selling. P-A: the chat line was right —
  "what if this whole site is built around one question." The hero must let a
  context-free stranger understand what the site is in seconds.
- Draft to react to (P-A rewrites voice):
  headline: "This whole site grew out of one question: what if our homes
  were designed to bring us together?"
  sub: "I've been chasing it for years — in books, in drawings, and in
  houses I've run. Everything it produced lives in this village. Click a
  place to enter, or take the slow tour."
- The hero (or text beside the tower) must say what to DO (click a place /
  take the tour) in plain words.
- RULE (applies beyond the landing, log for every section page): each page's
  hero/text states that page's purpose plainly, no context required — no
  atmospheric copy that only makes sense if you already get it.

## 4. The places (semantics LOCKED from the one-question scheme)
| Place | Question it answers | Opens | Accent |
|---|---|---|---|
| The Summit | Where is this happening? | map.html (+ guides = places out there) | sky |
| The Homes | Who lives here? | about.html OR work.html (§6) | warm rose |
| The Library | What's been written? | talkpieces.html | teal |
| The Workshop | How does it get built? | design.html | gold |
| The Garden | Why do this at all? | manifesto.html | green |
| The Commons | Where do you come in? | resources.html | clay |

## 5. Engineering notes for the builder
- Reuse the v2 mechanics that WORK (region hit-testing, mobile sheet,
  plain-language list fallback, reduced-motion path) — rebuild the visual
  layer per §2. landing-v2.html stays until v3 replaces it.
- Ambient loop base = blob-load + autoplay muted (copy the engine's pattern);
  poster-first so first paint is instant.
- Feathered region highlight: SVG mask with blurred edge (feGaussianBlur on
  the mask shape) or a pre-rendered per-region alpha matte — NOT a stroked
  polygon.
- The 6 black marks: if code-drawn is rejected (taste rule!) slice from the
  painted sticker kit or generate ONE 6-mark sticker sheet (gpt_image_2,
  black ink marks, ~0.5cr) and slice — ask P-A first (§6).
- Compute discipline: no scene regeneration; the only candidate generation is
  the mark sheet. QA: `_qa/shoot-lv2.js` pattern extended (labels visible
  pre-hover, click lands on loop, phone).
- Skills to load in the build chat: frontend-design, ui-ux-pro-max
  (+ scroll-world reference for engine patterns). Study index.html +
  DESKTOP-SCALE-RULES.md + MOBILE-RULES.md first.

## 6. OPEN QUESTIONS → P-A (answer these, then the fresh chat one-shots)
1. Hero base: ambient S1 loop as full-screen background (like today's
   landing) with labels layered on it — confirmed? Or the still, animated
   only on interaction?
2. The 6 black marks next to names: same minimalist line-mark language as the
   type.html guide icons (code-drawn, already approved there) — or painted
   marks from a generated ink sticker sheet (~0.5cr)?
3. Homes opens about.html or work.html?
4. Legend groupings confirmed? (knowledge → library+workshop+summit · hope →
   garden+writings · me → home) — and do the Writings stay inside the Library
   or get their own legend mention?
5. Collective word for the six: "places"? (Not "rooms".)
6. Click behavior: zoom → scene loop fills the screen for a beat → page
   loads. Or skip the loop moment and go zoom → page directly (faster)?
7. Headline/sub draft in §3 — right direction for the voice pass, or rewrite
   from scratch?

## 7. Parked (explicitly, by P-A)
- Garden's physical position on the tower vs its meaning — don't over-solve.
- Rooms-within-places (click bookshelf → books) — after v3 lands.
- Flip the scroll-tour order (coliving forms → me → why): ANSWERED as
  feasible-cheap (reverse configs + reverse-scrub or reversed re-encodes,
  zero credits; day-arc lighting + copy are the real work). Decide separately.
