## Done
- Bumped all `.eyebrow` kickers (11.2px), the hero photo credit (9.92px), and the
  closing quote's attribution line (11.52px) to the 12px micro-label floor. Visible
  on nearly every screen (hero, gray-field heading, village heading, close band).
- Bumped the gray-field lede sentence (`#fLede`, 15.2px) and the story-card secondary
  sentence (`.cardp .vil`, 14.72px) to the 16px reading floor. Screen 1 (field intro)
  and the popped story cards (screens 2-4).
- Bumped the closing CTA button labels (14.4px) to 16px — they're read words
  ("Explore the Coliving Atlas"), not UI chips. Bottom screen, close band.
- Forced the story-card secondary line + "Go deeper →" link to always render on
  mobile instead of relying on the page's `@media(hover:none)` heuristic (which
  didn't fire in the QA screenshot — see Flags). Also gave "Go deeper" real tap
  padding (was bare text, under the 44px hit-area minimum) and bumped it to the
  12px micro-label floor. Visible on every popped story card, screens 2-4.
- Restored the village-section subhead (`#cdLede`), which the page's own CSS hides
  entirely below 900px (`display:none`) — that's content text, not a decorative
  element, so it shouldn't disappear. Sized at the 16px reading floor. Sits right
  under "A village within reach." (top of screen 4/5), which currently has a lot of
  otherwise-dead space beneath it (see Flags).
- Swapped `vh` → `svh`/`dvh` on the hero image cap, the sticky-heading trigger
  spacer (`.headhold`), the village pinned-scroll stage (`.scenewrap`), and the
  village film/poster cap — same sizes, stops the mobile browser chrome
  show/hide from jump-cutting these during scroll (playbook recipe 10). No visible
  change to a static screenshot; only affects real-device scroll behavior.

## Proposed (not done)
- **The village-film pinned-scroll stage (`.scenewrap`/`.scenepin`) has no designed
  mobile fallback — it's the desktop interaction squeezed, not converted.** Unlike
  the "field of thoughts" bubbles (which the page already flattens to a flowing
  static column below 900px via `display:contents`/`position:static`), the village
  scene keeps the exact same sticky-pin + scroll-scrub mechanic on mobile, just
  shortened from 560vh to 300vh and stacked to a column. In the QA screenshot this
  renders as ~2000px (2.3 phone screens) of flat cream paper between the village
  heading/first frame and the "Visit the library" link, because the reveal (`.poss
  li.litp`, the video scrub) only fires via live scroll events a static full-page
  capture can't simulate. On a real phone it will animate as the user scrolls, but
  it's still ~3 screens of continuous scrolling for a payoff of 7 short list items
  + a video scrub — the exact pattern recipe 6 asks for a *flowing column or
  sequential-sections* fallback instead. Concrete change (needs HTML/JS, out of
  CSS-fragment scope): drop the sticky pin on mobile, lay the village poster/video
  as one static or autoplay-on-scroll-into-view element, and stack the
  possibilities list as plain sequential `<li>`s above/below it (revealed once on
  scroll-into-view, not scrubbed across 3 screens).
- **Story-card secondary content relies on `@media(hover:none)` alone.** I forced
  it visible in this fragment as a safety net, but the underlying page CSS should
  probably drop the hover-reveal pattern for touch devices at the source rather
  than depending on a media feature that isn't 100% reliable across mobile
  browsers/WebViews (HTML/CSS change to the page's own `<style>`, out of scope
  here).

## Flags
- `_qa/mshots/report.json` shows two `jsErrors` for this page: a CORS failure
  fetching `assets/world/village-m.mp4` via `fetch()` from a `file://` origin, and
  a follow-on `net::ERR_FAILED`. This is a `file://` protocol artifact (fetch/CORS
  behaves differently than over `http(s)://`) — flagging in case it's not, since it
  means the village film never loads in this specific test harness (poster image
  used as fallback throughout, which is why the QA screenshot only ever shows the
  static "raising the frame" painting, never a later village-film frame).
- The ~2000px dead-paper gap described above under Proposed is real in the
  screenshot; whether it's *only* a screenshot-capture artifact (sticky elements
  don't reflow correctly when Playwright expands the viewport to full document
  height for a single-shot capture) or also reads as dead space during real
  continuous scrolling is worth a hand-scroll check on an actual phone — I could
  not run the live audit per the brief's instructions.
