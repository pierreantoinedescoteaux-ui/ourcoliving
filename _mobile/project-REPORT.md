# project.html — mobile pass report

## Done
- **Forced `.reveal` to permanent `opacity:1; transform:none` on mobile** — the baseline capture showed the hero, kicker/title/summary/stats and the italic pull-line, then ~70% blank cream all the way to the footer. Every section (`.psec.reveal`), the taught block (`.taught.reveal`) and the pager (`.pager.reveal`) never got their IntersectionObserver `.in` class during capture, so they sat invisible. Now guaranteed visible regardless of scroll timing. Visible: everything from directly under the pull-line ("Every room got one job...") through the case-study sections, the green "taught" callout, and the prev/next pager — previously blank space.
- Swapped the hero image/placeholder's `vh` cap to `svh` (same 52 value, stable unit per playbook #10 — mobile chrome resize no longer risks clipping/jump-cut). Visible: screen 1, the interior photo directly under the world-band pill.
- Closed the 641-760px gaps in three components whose own inline breakpoints (640/680/640px) sit under the site's 760px cutoff: `.stats` (stacks to one column), `.img-grid` (drops to one column), `.pager` (prev/next stack full-width). No visible change at the 390px baseline; only extends already-correct behavior up to 760px.
- Taught-block CTA pills ("...→" links): bumped from ~34px tall (10px padding + 11.5px text) to a real ≥44px tap target, and the label text from 11.5px to the 12px micro-label floor. Visible: green callout box, screen with "Every room got one job" theme block.
- "All work →" pager link: added real padding — was a bare text link with near-zero tap height. Visible: bottom of the pager row, above the footer.
- Bumped the shared "back to the tower" pill (`.wback`, injected by `site-nav.js`) from 9.6px to 14px, scoped to this page only — matches the fix already shipped on resources.html for the same shared element. Visible: the pill over the world-band illustration, screen 1.

## Proposed (not done)
- The reveal-on-scroll bug (see Done) is patched defensively via CSS; the root cause is the shared `IntersectionObserver` setup in project.html's own inline `<script>` (threshold 0.15, no width check) — worth a real JS fix so this doesn't rely on the same silent failure mode on desktop/tablet too. Out of scope for a CSS-only pass.
- `.img-grid` uses its own 680px breakpoint and `.stats`/`.pager` use 640px — cosmetically inconsistent with the site's 760px standard. I closed the functional gap in this fragment rather than touching the page's inline `<style>` (HTML/desktop-affecting edit, not allowed here).

## Flags
- `div.wmedia` / `img` overflow in report.json (-12px to 402px against a 390px viewport) comes from the shared `site-nav.js` world-band parallax bleed (`inset:-7% -3%` by design), not from project.html itself. `docOverflowX:0` in the same report confirms it's clipped by `.wband{overflow:hidden}` and doesn't produce a real scrollbar — a script false-positive on the child's unclipped bounding box, not a visible bug. Same conclusion already reached independently on design.html and about.html.
- Not verified live (brief excludes running the audit): whether the reveal fix above fully resolves visually, since the baseline screenshot itself was misleading (see Done #1) — worth a fresh capture after fold-in.
