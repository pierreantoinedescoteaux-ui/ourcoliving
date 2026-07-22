## Done
- Bumped `p`, `li`, `.note` from .98rem/.95rem (~15.2-15.7px) up to a 16px floor — visible on every screen, all body copy and the mailto callout box.
- Added extra top margin to `h2` (34px → 44px) for stronger one-idea-per-section rhythm — visible at each source-family heading (screens 1-3 of the scroll: "My own photographs", "Illustrations", "Solarpunk stills", "Community & project photos").
- Tightened the very first `h2` (right after the intro paragraph) back to 40px so it doesn't double up with the intro's own spacing — screen 1.
- Added 10px bottom margin between `<li>` items in the "Community & project photos" list so each dense, link-heavy source reads as its own line instead of a wall of text — screen 2-3.
- Gave inline links in the list and the `.note` box a couple px of tap padding (display:inline-block) so adjacent citation links aren't edge-to-edge — screen 2-3 and the mailto CTA at the bottom of the visible content.
- Widened `.note` box padding slightly (18-22px → 20px) and its outer margin (22px → 28px) for breathing room around the "write me" callout — screen 3.

## Proposed (not done)
- None — page is simple static markup with no image/text pairs, carousels, or interactive stages that needed structural changes.

## Flags
- The baseline screenshot (`_qa/mshots/credits.png`) shows a small circular icon with a pencil glyph overlapping the "Rooral" list item text near the top of "Community & project photos." This isn't present in credits.html's markup — it looks like a cursor/watermark artifact from the mshots screenshot service, not real page content. Flagging in case it turns out to be a real overlapping element from a shared component (site-nav.js) rather than a screenshot artifact — worth a quick visual re-check on a live device.
