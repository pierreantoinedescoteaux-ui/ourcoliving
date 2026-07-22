# Round-2 mobile pass — per-page agent brief

You are doing the MOBILE layout/impact pass for ONE page of this static site
(C:\Users\User\coliving-portfolio). Desktop must render byte-identical — you break
desktop, you fail the task.

## Read first (in this order)
1. `MOBILE-RULES.md` (repo root) — the playbook. Follow it exactly; its numbers win.
2. Your page's HTML file (and its `*-data.js` if the page renders from data).
3. Your page's phone screenshot: `_qa/mshots/<page>.png` (390×844 full-page capture).
   Walk it top-to-bottom before writing any CSS.
4. Your page's entry in `_qa/mshots/report.json` (mechanical issues found).

## What you deliver
Write ONE file: `_mobile/<page>.css` — a fragment whose ENTIRE contents live inside
`@media (max-width: 760px) { ... }` and whose every selector is prefixed with
`html.m-<page> ` (the class is already stamped on the page's <html>). Plus
`_mobile/<page>-REPORT.md` (see below).

## Allowed (do these freely — pre-approved)
- Font sizes up to the playbook floors/scale; line-height fixes.
- Stacking side-by-side layouts vertically; `flex-direction:column`; grid → 1 column.
- Reordering with flex/grid `order` so each image sits DIRECTLY under the text it
  belongs to (playbook recipe 2 — the #1 fix this site needs).
- Image caps (max-height, object-fit), padding/margin retuning, gap fixes.
- Converting a desktop arrow-carousel to a scroll-snap swipe row (recipe 5).
- Tap-target padding (≥44px), fixed-chrome collision fixes.
- Hiding a DECORATIVE element that can't work on phone (ornament, hover-only affordance).

## NOT allowed (propose in your report instead, do not implement)
- Any HTML edit, any JS edit, any desktop-affecting rule.
- Hiding CONTENT (text, photos that carry meaning).
- Redesigning an interaction (pinned stage, popup, drag mechanic) — if the desktop
  interaction fundamentally can't translate, describe the mobile fallback you'd build.

## Keep the vibe (the actual goal)
This site is a warm, painted, storybook world (cream paper, gouache art, Zodiak serif
display, generous whitespace). "Mobile-friendly" must NOT mean "generic and small":
- Display headlines stay BIG (clamp per playbook — scale, don't shrink to meek).
- Painted banners/ornaments stay visible and proud, just resized/repositioned.
- Whitespace rhythm: separate ideas with space (40-56px between sections), not size cuts.
- One idea per screen-height where possible. The phone reader should feel the same
  drama as the desktop reader, delivered vertically.

## Report format (`_mobile/<page>-REPORT.md`, keep it SHORT)
- `## Done` — one line per fix (what + why, e.g. "stacked .split, text-first — photo was orphaned").
- `## Proposed (not done)` — structural/HTML/JS items, one line each with the concrete change.
- `## Flags` — anything that looks broken beyond mobile styling (bug, broken asset).

## Verify before you finish (mandatory — static checks only, do NOT run the audit)
Other agents work in parallel; the consolidated live audit runs AFTER fold-in. You must:
1. For EVERY selector in your fragment: grep the page's HTML (and its data.js/renderer
   if content is JS-rendered) to confirm the class/id actually exists. No guessed selectors.
2. Confirm every rule sits inside `@media (max-width:760px)` and is prefixed `html.m-<page>`.
3. Re-look at the baseline screenshot and mentally re-render each fix: state in your
   report WHERE on the page each change is visible (e.g. "screen 3 of the scroll").
Touch ONLY your own `_mobile/<page>.css` + `_mobile/<page>-REPORT.md` — nothing else.
