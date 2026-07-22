# separation.html — mobile report

Baseline was already clean mechanically (report.json: 0 overflow, 0
tiny-text flags). The page already has a working responsive photo rule in
its own `<style>` (`.mov .photo` floats on desktop, stacks full-width,
image directly after the section's aside/heading on mobile — recipe 2
already satisfied). This pass covered reading-floor + tap-target gaps the
mechanical audit doesn't catch.

## Done
- `.mov .vil` (the bordered "village" aside inside every one of the ten
  movements, e.g. under "The story we were handed") carries a full
  sentence (`s.village`) at 15.2px — bumped to 16px to clear the reading
  floor.
- `.mov .reads a` (the "Learn more"-style pills at the end of each
  movement) was 11.84px (just under the 12px micro-label floor) and only
  ~28px tall (well under the 44px tap-target floor). Bumped to 12px /
  15px×16px padding.
- `.bookrow a` ("On my bookshelf →", in the book-credit row right under the
  h1) was 11.52px with a ~16px-tall hit area. Bumped to 12px, made
  inline-block, added padding so the tap target clears 44px without
  changing the visible underline treatment.
- `.outro .ctas a` (the three closing links: "← Back to the manifesto" /
  "See the real communities" / "The bookshelf") were ~42px tall, just
  under the 44px tap-target floor. Padding bumped 13px→15px top/bottom.

## Proposed (not done)
- None — no structural/HTML/JS gaps found on this page beyond the CSS
  fixes above.

## Flags
- None. No broken assets, no JS errors in report.json for this page.

## Where each fix shows up
- `.mov .vil`: every movement (I through X), the short bordered quote line
  right under the h2 flip-title, before the photo.
- `.mov .reads a`: bottom of each movement, the pill-style "further
  reading" links.
- `.bookrow a`: screen 1, the card right under the h1 with the book cover
  thumbnail ("The More Beautiful World Our Hearts Know Is Possible").
- `.outro .ctas a`: last screen before the footer, inside the pale
  rounded outro card.
