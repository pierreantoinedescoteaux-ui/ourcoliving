## Done
- Bumped `.person .take` (the main per-card body copy, e.g. "Start from the life you want in a room...") from 15.2px to 16px reading floor, with line-height 1.55 for legibility — visible on every card, screen 2 onward.
- Bumped `.person .who` (role/studio uppercase micro-label under each name) from 11.52px to the 12px micro-label floor — visible on every card, directly under each h2.
- Bumped `.person .row a` (outbound link labels like "PATTERNLANGUAGE.COM ↗") from 11.52px to 12px floor, and added 10px/12px vertical padding so each link's tap box clears comfortably past the old ~18px hit area — visible at the bottom of every card.
- Bumped `.young` closing note ("A working list, not a finished one...") from 14.4px to 16px reading floor — visible on the last screen of content, just above the shared footer.

## Proposed (not done)
- None — the page's own in-file `@media(max-width:860px){.people{grid-template-columns:1fr}}` already collapses the grid to one column well above the 760px breakpoint, so no structural stacking work was needed here.

## Flags
- `div.wmedia`/`img` overflow (-12 to 402, 413px wide) and `a.wback@9.6px` tiny text are both part of the shared "back to the tower" hero band injected by `site-nav.js` (`.wband .wmedia{inset:-7% -3%}` and `.wbandwrap .wback{font-size:.68rem}`, upgraded to `.75rem` only at its own internal `max-width:640px` query). This is shared JS-injected markup, not designers.html content, so it's out of scope for this fragment/HTML-only-page rule. Note: the overflow is already visually harmless — `html,body{overflow-x:clip}` in designers.html's own `<style>` clips it, matching `docOverflowX: 0` in the report. The 9.6px reading on `a.wback` looks like a measurement/timing artifact of the audit (its own media query should already yield 12px at 390px width) — worth a look when the shared nav band gets its own mobile pass, not a designers.html-specific bug.
