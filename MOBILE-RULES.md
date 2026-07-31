# MOBILE-RULES.md — how every page on this site gets built mobile-friendly

**v2 — 2026-07-22.** Cross-checked against the `wshobson/agents` `responsive-design` skill
(container queries, fluid type/spacing, breakpoint strategy references) and the `hoodini`
`mobile-responsiveness` marketplace skill (touch/safe-area/viewport patterns). Raised
typography floors, tap target size, and added viewport-height + safe-area guidance below.
v1 baseline (2026-07-19) preserved everywhere else.

Read this BEFORE building or restyling any page. Written so a Sonnet agent can follow
it without judgment calls. Companion files: `mobile.css` (sitewide retrofit layer),
`_tools/wire-mobile-css.mjs` (wires new pages in), `_qa/mobile-audit.js` (the QA gate).

## The gate (2026-07-30) — these numbers are enforced now

`node _qa/mobile-audit.js` used to print its findings and exit clean, so every
floor below was advisory. It now exits non-zero on a breach.

- Run it with `BASE=http://127.0.0.1:8123` (serve the repo first) so the
  homepage is included. Without a BASE it runs on file:// and skips index.html,
  because the landing fetches its clips as blobs.
- Turning it on found breaches on 13 interior pages built up over months. They
  are recorded in `_qa/mobile-baseline.json` so the run passes on the known debt
  and fails on anything NEW. The baseline may only ever shrink.
- Fix a page, then `node _qa/mobile-audit.js --rebaseline` to clear its entries.
- `index.html` is never baselined. The homepage holds the floors outright.

Two documented exemptions from the reading floor, both boilerplate rather than
reading: the `[edit]` authoring markers, and the `.mby` copyright strip.

## The one-sentence rule
On a phone, the DOM order IS the story: every screen must read
**heading → its text → its image → next thing**, at legible sizes, with nothing cut off
— and interaction-heavy pages get a DESIGNED mobile fallback, not a squeezed desktop.

## Architecture (do not deviate)
- Pages are self-contained (own `<style>` block). **New pages put their mobile rules in
  their own `<style>`, inside `@media (max-width: 760px)`.** The shared `mobile.css` is
  the retrofit layer for old pages + sitewide floors — don't bloat it with new-page rules.
- After creating ANY new page: run `node _tools/wire-mobile-css.mjs` (idempotent — stamps
  `<html class="m-<page>">` + links mobile.css so sitewide floors apply).
- Breakpoint: **760px**, one breakpoint only. Design desktop-first is fine, but write the
  mobile block in the same sitting — never "later".

## Recipes by content type (copy the pattern, keep the numbers)

### 1. Text sections
- Single column, `padding: 0 20px`. Standard: body text **16-18px**, `line-height 1.5-1.6`.
- Floors (raised v2 — was 14px/11px): body/reading text ≥ **16px**; micro-labels
  (kickers/eyebrows/tags) ≥ **12px**. Nothing that carries reading content ships below 16px.
- Big display headlines: use `clamp()`, e.g. `font-size: clamp(30px, 9vw, 54px)`. Never
  let a headline force horizontal scroll (`overflow-wrap: break-word`).

**Fluid type scale (390px phone → 1440px desktop) — ready-made formulas:**
```css
/* Body / reading text: 16px → 18px */
font-size: clamp(1rem, 0.954rem + 0.19vw, 1.125rem);

/* Section heading: 22px → 34px */
font-size: clamp(1.375rem, 1.096rem + 1.143vw, 2.125rem);

/* Display headline: 32px → 64px */
font-size: clamp(2rem, 1.257rem + 3.048vw, 4rem);
```
Use these instead of hand-picking a vw multiplier — they're solved for this site's actual
device range so text can't undershoot the 16px/12px floors above at 390px.

### 2. Image + text pairs (the #1 failure on this site)
Desktop puts a photo BESIDE its text; naive stacking orphans the photo between unrelated
blocks. On mobile, **each image must sit directly under the text it belongs to**:
```css
@media (max-width:760px){
  .split { display:flex; flex-direction:column; }
  .split .txt { order:1; }  /* text first */
  .split .img { order:2; }  /* its image directly after */
}
```
If a section interleaves several photos + paragraphs, group each pair in a wrapper so
order is unambiguous. A photo that would land with no explaining text nearby: move it
(order) or hide it (`display:none`) — an unexplained photo is worse than no photo.

### 3. Images & sizing
- `img { width:100%; height:auto; }` within its block; **cap tall images ~`max-height:70vh`**
  with `object-fit:cover` when both dimensions are constrained.
- Full-bleed hero images: ≤ `60svh` on phone so the headline + first text share screen 1.
- Small logos/icons: keep small; don't stretch to container.
- Juxtaposed pairs (two photos side by side): keep side-by-side ONLY if each stays ≥ 160px
  wide; otherwise stack them.

### 4. Card grids (work gallery, themes, inspiration…)
- 1 column, full width, `gap ≥ 16px`. 2 columns allowed only for tiny tiles (icons,
  ≤ 120px tall). Card cover images keep their aspect ratio (`aspect-ratio: 16/10`).
- Filter chips / pill rows: allow horizontal scroll-snap row instead of wrapping into a
  tall block: `overflow-x:auto; display:flex; scroll-snap-type:x proximity;` chips ≥ 40px tall.

### 5. Carousels
- No JS needed on mobile: `overflow-x:auto` + `scroll-snap-type:x mandatory`, each slide
  `flex: 0 0 85vw; scroll-snap-align:center;` so the next slide **peeks** (affordance).
- Hide desktop prev/next arrows ≤ 760px (swipe is primary); keep dots if present.
- Auto-advance: OFF on mobile (fights finger scrolling).

### 6. Interactive / pinned scroll stages (atlas chart, manifesto field, popups)
- **Never squeeze the desktop interaction down.** Decide the mobile experience FIRST:
  usually a flowing column or list delivering the same content (e.g., atlas nodes → a
  scrollable card list; pinned stage → simple sequential sections).
- Sticky/pinned elements must never cover more than ~35% of the viewport, and must not
  overlap the nav.
- If you can't design the fallback, STOP and escalate to P-A/Fable — don't ship a broken
  interaction.

### 7. Tables / axis readouts / stat rows
- Stack as `label — value` rows, label 11-12px over value. Never let a table force
  horizontal scroll; a scrollable table is a last resort and needs a visible edge fade.

### 8. Tap targets & fixed chrome
- Anything tappable: **≥ 44×44px** hit area (padding counts) — Apple HIG / WCAG 2.2 AA
  standard, raised from 40px in v1. Adjacent links ≥ 8px apart.
- Fixed buttons (back-to-top etc.) must not cover content or each other at 390×844.
- Fixed bottom chrome (nav bars, sticky CTAs) on notched phones: add
  `padding-bottom: max(16px, env(safe-area-inset-bottom))` so it clears the home-indicator
  strip instead of sitting under it. Only needed on elements `position: fixed`/`sticky` to
  the bottom edge — not on normal in-flow content.

### 9. Impact (the point of all this)
Mobile is not "desktop but smaller" — it's the same DRAMA delivered vertically:
- Keep the big moments big: stat numbers, display headlines, dark bands stay bold
  (scale with clamp, don't meek them down to fit).
- One idea per screen-height where possible; use spacing (`margin: 48px 0` between
  sections), not size reduction, to create rhythm.
- Cutting content to fit is a design decision — flag it, never do it silently.
- **The art fills the screen; the words sit ON it.** (P-A, 2026-07-31, with a
  red circle round the foot of a scene.) Nothing on a full-bleed painted page
  is allowed to end in a rectangle of blank paper — no cream slab under the
  last button, no solid band at the bottom of the viewport. Two rules follow:
  - A copy scrim ends at the BOTTOM OF THE SCREEN, not some fixed distance
    past the copy block, and it fades back to transparent on the way down.
    Anchor it to the same value the copy is lifted off the bottom by.
  - Panels laid over a painting are glass, not plates: a low alpha plus a real
    `backdrop-filter` blur. The blur is what makes the text readable — an alpha
    low enough to see through is not, on its own, enough to read on. Always
    ship an opaque fallback outside `@supports`, and never set plain
    `border-color` on a panel whose left edge is carrying a category colour.

### 10. Viewport-height pitfalls (svh/dvh vs vh)
- **Never use plain `vh` for full-bleed mobile sections.** Mobile browser chrome
  (address bar, bottom toolbar) resizes the viewport as the user scrolls, so `100vh`
  either clips content behind the toolbar or leaves a jump-cut gap when it hides.
- **`dvh` (dynamic viewport height)** — use for anything that should track the *current*
  visible viewport as chrome shows/hides (full-height hero sections, pinned-scroll stages
  in recipe 6). `min-height: 100dvh;`
- **`svh` (small viewport height)** — use when you need a size that's stable and never
  overflows even with chrome fully expanded (modal max-height, anything that must never
  get cut off). This site already uses it for hero caps — e.g. `≤ 60svh` in recipe 3;
  keep using `svh` there, not `vh`.
- **`lvh` (large viewport height)** — rarely needed here; only for backgrounds that should
  fill the max possible space when chrome is hidden and a slight overflow is fine.
- Rule of thumb: capping/never-overflow → `svh`. Tracking the live viewport → `dvh`. Plain
  `vh` is banned in new mobile work on this site.

### 11. Safe-area insets (notched phones)
- Any full-width fixed/sticky element touching an edge — bottom nav, sticky CTA bar, a
  fixed filter chip row — must pad for the notch/home-indicator:
  ```css
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
           env(safe-area-inset-bottom) env(safe-area-inset-left);
  ```
  Combine with a real minimum so the padding never collapses to 0 on non-notched phones:
  `padding-bottom: max(16px, env(safe-area-inset-bottom));`
- Requires `<meta name="viewport" content="width=device-width, initial-scale=1,
  viewport-fit=cover">` on the page — check it's present before insets will do anything.
- Normal in-page content does NOT need this — only chrome pinned to a screen edge.

### 12. Other conventions worth adopting
- **Reserve space for images before they load** — set `width`/`height` attributes or
  `aspect-ratio` on every `<img>` so the layout doesn't jump when it finishes loading.
  Recipe 3's `aspect-ratio: 16/10` cards already do this; apply the same to hero/content
  images that don't yet have it.
- **Large hero images: ship a mobile-sized file, not a squeezed desktop one.** Use
  `srcset`/`sizes` (or a `<picture>` with a `max-width: 760px` source) so a 390px phone
  downloads a ~800px-wide image, not the 2000px desktop original.
- **`prefers-reduced-motion` on carousels/animated stages.** Recipe 5 already turns off
  auto-advance on mobile; also wrap any CSS transition/animation in
  `@media (prefers-reduced-motion: reduce) { … }` to disable it for users who've asked
  for less motion — a few lines, meaningful accessibility win.
- **Don't add a second breakpoint without the same evidence bar as the first.** The 760px
  cutoff was chosen from real audit data, not a device guess. If a page seems to need a
  second breakpoint, that's a signal to re-test at 760px first — don't default to adding
  `@media (max-width: 480px)` etc.
- **`min()`/`max()` for one-off fluid widths that don't need a full clamp() scale** — e.g.
  `width: min(90vw, 600px);` for a modal, or `padding-inline: max(20px, 4vw);` for a
  section that should breathe more on slightly wider phones without a breakpoint.

## QA gate (two tiers — P-A calibration, 2026-07-22)

**Full gate** — fires only on LARGE work: a new page, a change to a shared file
(site-nav.js, mobile.css, data files consumed by multiple pages), or a
layout/structure change to a page:
1. `cd _qa && node mobile-audit.js <repoRoot>` — must show for your page:
   `ovfX=0`, `imgs=0` issues, no JS errors, tiny-text not increased.
2. Look at the full-page phone screenshot it produces (`_qa/mshots/<page>.png`):
   walk it top-to-bottom asking "does every photo sit with its text? is every screen
   legible? did the page keep its impact?"

**Spot check** — for small content/style edits scoped to one page:
one desktop + one phone (390×844) screenshot of THAT page + a JS-error check.
No sitewide audit. (Why: full gate after every slight modification is too slow —
P-A accepted the tradeoff that cross-page surprises wait for the next full gate.)

Either tier: never claim done without running it. "It should work" is not verification.

## Don'ts
- ❌ No separate mobile site / duplicated pages.
- ❌ No `display:none` on content text to make things fit (images without nearby text may
  be hidden per recipe 2 — text may not).
- ❌ No new rules OUTSIDE the `@media (max-width:760px)` block when doing mobile work —
  desktop must render byte-identical.
- ❌ No editing `mobile.css` for new-page styles (it's the retrofit layer only).
- ❌ No `!important` except to beat inline `style=""` attributes.
