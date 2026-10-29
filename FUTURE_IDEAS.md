# Future Ideas — coliving portfolio

Ideas discussed and liked but deferred. Date = when parked.

## ~~Village finale revamp (manifesto bottom)~~ — SHIPPED 2026-07-22
Scroll-scrubbed painted time-lapse: neighbors raising the first timber frame →
lantern-lit village at dinner (seedance A→B, frame-locked, 8s). Stills in
`_landing/build2/raw/village-{a,b}.png`, film at `assets/world/village.mp4`.
Possible later polish: regenerate at 12s for a slower build, or add ambient
loop mode when idle at the end state.

## Per-asset generated animations
2026-07-22. Every sticker in `assets/world/` currently animates via CSS only
(float/sway/flicker). Later: generate real animation clips per asset (e.g. lantern
flame flicker, bird wing-beat sprite sheet, balloon swaying with heat shimmer).
Token/credit-expensive — batch when a set of them is wanted at once.

## Comprehensive per-page treatments (the "intense" tier)
2026-07-22. Light pass shipped (scene banners, grain, accents, footer branch, fx).
Comprehensive candidates, one page at a time, when P-A wants to go deeper:
- **resources.html** — "library shelf" framing: orn-books + orn-lantern vignettes
  beside the directory sections; holographic zap accents on filter pills.
- **map.html** — "the lookout table": frame the atlas as the map table from S7;
  corner-vine ornaments on the map card; sun hover on model markers.
- **story.html / about.html** — "homes fragment collage": soft-edged painting
  fragments from S6 + existing object renders (`_landing/_candidates/scenes/*-asset*`)
  woven between chapters.
- **design.html / work.html** — "makers pinboard": tool/wall vignettes, project cards
  pinned like workshop sketches, zap hover on case-study links.
- **themes.html** — gardens treatment: seedling ornament per theme cluster,
  flower sprites as list bullets.
- **type.html field guides** — unify the 38 generated illustrations with one frame
  style + grain + caption typography so they read as one commissioned series.

## Painting-fragment object vignettes
2026-07-22. Use the `-asset`/`-obj` renders in `_landing/_candidates/scenes/` and crops
of the 7 scene stills as soft-edged rounded "fragments of the big painting" pinned
beside text sections (collage aesthetic, no hard cutouts). Approved by P-A; not yet
placed — belongs to the per-page comprehensive passes above.

## Button-vine hover: strengthen the sprout
2026-07-22. The leaf hover mood draws 2 small stems + leaf/flower pops at button
corners. Works but subtle. Later: richer vine wrap (path hugging the full border,
more sprites), maybe using vk-tendril along the border path.

## Native 9:16 portrait mobile chain for the landing
2026-07-21. ~940cr. Second camera chain rendered natively in portrait so phones get
composed scenes instead of centre-crop. Do only if the phone crop bothers P-A.

## Split resources.html into designed subpages per category
2026-07-28. P-A: "these are not functional nor pretty pages, just a bunch of
links." resources.html's three categories (maps & directories, networks &
movements, learning & how-to) currently render as plain link cards on one
long page. Eventual redesign: give each category its own designed page
(networks.html shipped 2026-07-28 as a first step in this direction — plain
card grid, not yet a full redesign) with real layout, imagery and voice
instead of a directory-of-directories list.

## Mobile touch micro-animations
2026-07-22. P-A: some mobile sites have small animations when you swipe / pass your
finger on things. Out of scope for the mobile round-2 retrofit (his call). If wanted
later: tap-ripples on cards, touch-drag parallax on painted banners, pull-release
bounce on carousels — all transform/opacity-only, reduced-motion-gated, sticker-kit
art (never code-drawn shapes).

## "Which coliving fits you?" quiz (MVP later)
2026-10-21. Interactive form: where you live → what kind of set-up you'd want → your values on the same sliders as
the map. Output: a recommended way of living, how well it might fit you, likely challenges (living in one AND
starting one), places to visit, join or take inspiration from, and first steps to start one. Depends on the new
map data (core sliders as ranges + real projects with set-ups). MVP = 7 sliders + 3 questions → nearest type + 3 projects + challenges.

**IN PROGRESS 2026-10-22 — decisions (P-A):** quiz is the centrepiece; the "Audience + impact" section and "la taxe
collective" article below get written as its content. ~25 taps, 5 steps (you today · values on the 7 map sliders with a
"matters a lot" tap · a bit about you · set-up across the five areas with the painted mini stickers · join or start).
One step per screen. Result = a LETTER sealed with wax that you open and read (not a postcard): fit (always warm, never
"not for you"), top way of living + runner-up with why, one set-up choice per area, your pin on the map, 3 real places,
"things to know for your profile" (positive, no "challenges"), first steps (join vs start), share link (answers in the
URL, no server). English only. Linked from map.html + the menu (menu link last, after the other chat's shared-file work).
Phase 2: compare with a friend (two results overlaid). Process (round 2, P-A): build autonomously from `FOR PIERRE-ANTOINE/QUIZ-CONTENT-DRAFT.md`, commit locally, NO push, P-A reviews at the end. Letter signed by Pierre-Antoine on behalf of Our Coliving ("from us"). Existing art only (no Higgsfield credits); P-A may generate envelope / letter paper / shared-meals sticker later with GPT, so leave prompts. Collective-tax article ships without P-A's personal-story slot (add later). Audience piece = its own page.

## Audience + impact section
2026-10-21. Who coliving helps at each stage of life (kids, young adults, newcomers, people living alone, single
parents, seniors...), the impact on them, and how coliving answers social challenges (isolation, ageing, housing
access). Source: Guide du cohabitat (Village Urbain), ch. 3.

## Article: la taxe collective
2026-10-21. The small frictions you accept as the price of living together (Durrett and McCamant, cited in the
Guide du cohabitat p70). Fits P-A's voice: honest about the hard parts, still hopeful.

## Teach through questions, sitewide
2026-10-22. P-A, while testing the quiz: "asking a question for people and then having information as a way to
supplement that question is a good way to educate. Like actually an amazing way to educate. We should do that more
throughout the website." Pattern: a question first, then a small "?" that opens a side note (summarised from the hub /
glossary content), with an optional short read-more link, never pulling the reader away from finishing. First use:
quiz v2 option explanations. Later: field guides, hub, map.

## Quiz v2 (P-A's first feedback, 2026-10-22, verbatim intent)
**BUILT 2026-10-28 (local commit 6b83b30, not pushed).** Kept below as the record of what he asked for.
- More questions multi-select (e.g. setting: "city or countryside but not suburbs").
- Drop the housing-budget question (depends too much on where you live). Replace with RANKING what you want coliving
  to solve, 5-7 options: raising kids, fighting loneliness, affordable housing, a community of like-minded people...
- Sliders push people to the poles. Show the middle: as you slide, a new answer appears for that position (ranges and
  approximations, e.g. "How long do you picture staying": a season / a year or two / five years or so / for good).
  He is "not sold" on one end label getting highlighted.
- Some spectrum questions should be other formats: "what should the place be organised around" = multi-select of up
  to ~20 things that matter (food and energy self-sufficiency, art, childcare / kids raised by a village...).
- Step 3 may have too many questions unless genuinely useful; explore a light way to skip some.
- Education inside the form: a "?" on options (e.g. "a share in the whole", "membership with my room included") that
  opens a pop-up or a side note in the margin, summarised from the themes/hub page.
- Result must stop feeling like a personality test that assigns one type. Start with what matters to you, reflected
  back visually (keywords, icons, your own positioning on values). He prefers the set-up/design choices as the core
  ("building blocks", maybe with icons). Places to visit must say WHY they're relevant, linked to the person's answers.
- Signature: a real cursive that fits the site, not Caveat.
- BUG: he said someone else should run it, yet the letter said "You'd rather design your home than buy someone
  else's idea of one" (Baugruppe text). Type blurbs must never claim things the person didn't say.
- Save results: download, email to yourself, or remembered in the browser so nobody has to redo it, with the option
  to redo. Results can be improved iteratively.
- He loves the map pin.

## Map + projects follow-ups (P-A, 2026-10-22) -> separate chat
- projects.html "who maps it better" section: he hates the text list. Wants a small world map with pins; hover shows
  the organisation that maps projects there, as a pop-up; worldwide ones above the map. Add: the Foundation for
  Intentional Community directory + map (ic.org), GEN ecovillage map, the Quebec ecovillage network map, better
  European mappers (eurotopia, Diggers & Dreamers, national cohousing networks...). He said "an agartha should be
  there": unclear, ask him (Agartha? or ic.org?). Keep scope small.
- Map "why it sits here": hovering a way of living should explain WHY it sits where it does on the two visible
  spectrums, with a few examples (and say when real projects spread across the range). Same content in the field
  guide's "On the map" chapter: after each spectrum, a toggle opening the why + examples. Must stay visually light,
  not overcrowded. Content = 10 ways of living x 7 spectrums.
- Map labels still collide where ways of living sit close (e.g. Baugruppe/Rural co-living, Network village/Hacker
  house on the classic view; phone map crowded top-right).
- Places still without a photo: The Residency, Zuzalu, Muir Commons, Fardknappen, Hogeweyk (its only photo shows an
  identifiable dementia-village resident, deliberately not used), plus the 4 networks.

## Landing page shortcuts
2026-10-22. P-A: a few shortcuts on the landing to the most-seen and most useful pages: the map, the guide (hub),
the field guides, My work or My story, maybe the quiz. "3 to 5 max, otherwise it's too crowded." In the handoff
2026-10-22_coliving-map-why-and-mappers.md.

## Coliving types rethink (P-A, 2026-10-29) — ON HOLD
P-A asked whether the types are all genuinely distinct. Claude's read, not yet acted on:
- **Hacker house + entrepreneur house:** almost the same quiz ranges; the real difference is the crowd and the vibe
  (cheap and chaotic vs small and chosen with care). Option: merge into one guide with two flavours.
- **Baugruppe:** more than a buying group (the group acts as its own developer and designs together), but it is a way
  to BUILD, not a way to LIVE; once built it usually lives like cohousing. Option: keep it, framed as "how a group
  builds its own house", and link it from the quiz's "start one" answer.
- **Kibbutz:** not an intense ecovillage. Roots are pooled income and shared work, ecology optional. Option: widen to
  "income-sharing communities (kibbutz, Twin Oaks)", more relevant outside Israel.
Touches: map-data.js types, knowledge-data.js, guide-content-data.js, quiz scoring (quiz-score.js fit ranges), field
guide drawings and labels. Keep many groups to show diversity.

## Leftovers from the 2026-10-29 session
- **Story page animation:** the block tower that built itself on scroll is off (tower-climb.js kept). Build a proper one.
- **Quiz stickers v2:** regenerate the 24 with the warm-tech third (FOR PIERRE-ANTOINE/quiz-art-prompts.md Part A). P-A on it.
- **Design for Connection, the rest of the page:** the images after the opening pair are still flat paper-cut posters
  (design system: off brand, not urgent). Its captions also carry long dashes.
- **Manifesto "Dear Alice" still:** another studio's style, to replace (design system off-brand list).
- **Robot sticker (flyer-robot):** too quirky, to replace.
- **Interfaces as objects still planned:** manifesto as a letter or scroll, directories as a shelf or drawers, projects
  as postcards on a board.
- **Texture queue:** most tiles and pieces in the design system's queue are not generated yet.
- **Design system backlog:** art that went live before 2026-10-29 and is missing from its asset list and Lock log.
- **Landing at ~950px wide:** the headline sits over the tip of the tower (readable, not broken).
- **about.html:** "More in the library" link is a small tap target (29px, floor is 44px).
