# talkpieces.html — mobile report

report.json shows `docOverflowX: 0` and the `div.wmedia`/`img` "overflow"
entries are the shared world-banner's intentional bleed (`.wband .wmedia`
is `inset:-7% -3%` inside an `overflow:hidden` parent — decorative, not a
scroll bug; confirmed by `docOverflowX:0`). The one real mechanical flag
was `tinyText: a.wback@9.6`. The baseline screenshot surfaced a second,
more important problem the mechanical audit can't catch: a legibility
failure where the masthead text sits almost unreadable over the banner
artwork.

## Done
- **Masthead legibility (screen 1).** The eyebrow ("The writing room") and
  the h1 ("Talk pieces.") render directly on top of the shared world-banner
  illustration (site-nav.js's `.wband`, inserted right after the nav). The
  banner's veil gradient only reaches useful contrast ~35-60% down its own
  height; at mobile banner heights (~240-320px) both text elements land in
  the low-contrast zone, and in the baseline screenshot the eyebrow is
  nearly invisible against the busy artwork. Added a small paper-colored,
  blurred backdrop (`width:fit-content`, so it hugs the text rather than
  covering the whole banner) behind both — banner still shows everywhere
  else, text is now legible regardless of what's behind it.
- **`.wback` pill ("↑ the library · back to the tower").** Measured 9.6px
  in the audit (below both the 12px micro-label floor and the site's own
  `@media(max-width:640px)` bump to .75rem — whatever's causing the gap,
  our page-scoped rule fixes it directly). Also only ~34px tall — under
  the 44px tap-target floor. Bumped to 12px / 15px×16px padding. This rule
  is scoped to `html.m-talkpieces .wback`, which out-specifies the shared
  `.wbandwrap .wback` rule from site-nav.js (extra element+class beats two
  plain classes), so no `!important` was needed.
- **`.piece .dek`** (the paragraph under each card title, e.g. "Ten
  assumptions about housing, family and ownership we inherited without
  asking…") was 15.2px — a full sentence, bumped to 16px.
- **`.piece .meta`** (the italic-style status line, e.g. "A long read · ten
  movements · the backbone of the manifesto") was 11.84px carrying full
  sentences — bumped to 16px (tracking eased to .06em so it doesn't read
  as shouty at the larger size).
- **`.young`** (the "This room is young…" note below the three cards) was
  14.4px full-sentence copy — bumped to 16px.
- **`.piece .kicker`** ("PIECE 01 · PHILOSOPHY") is a genuine short
  micro-label — was 10.56px, bumped to 12px.

## Proposed (not done)
- None beyond the CSS above. The masthead fix is CSS-only (background +
  padding on existing elements); no HTML/JS changes were made or are
  needed.

## Flags
- The `.wback` tiny-text measurement (9.6px) doesn't match either the
  page's un-queried size (.68rem = 10.9px) or its own ≤640px bump (.75rem =
  12px) — worth a second look at how the audit script measures this
  element, though the fix here (explicit 12px via a higher-specificity
  page-scoped rule) resolves it regardless of the root cause.

## Where each fix shows up
- Masthead scrim + `.wback` fix: screen 1, the very top of the page (banner
  + "Talk pieces." title).
- `.dek` / `.meta` / `.kicker`: all three cards in the middle of the page
  ("The story we were handed…", "Four slow emergencies, one root.", "What
  brought me here in the first place.").
- `.young`: the dashed note box right below the three cards.
