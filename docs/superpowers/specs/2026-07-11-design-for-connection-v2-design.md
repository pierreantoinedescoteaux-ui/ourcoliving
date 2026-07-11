# Design for Connection v2 — design spec (2026-07-11)

P-A's spec (verbatim-ish, two rounds): themes/feelings instead of specific examples — connection, mindfulness, collaboration, intimacy, creativity; each theme one image, consistency across; expandable detail per theme showing "a bunch of different ways we can design for this", each with its own image + one clear 1-liner + 1 longer sentence + one sentence next to the image on what to notice; images can't be generated yet → placeholders + written description of what each image should be. Round 2: budget section at the end ("how it's possible no matter the budget — cheap ways to do each of these, one image per concept, same format"); ludiq-scale images and fonts. Round 3 (layout): hero = "we are a product of our environment, let's design for connection" (few words); "Designing for…" = large horizontal section, one theme at a time with faded slivers of neighbours at both edges; click → expands a horizontal section underneath with the tactics. Scope constraint: touch ONLY this page (parallel chat owns other files).

## Built

- **`design-data.js` v2** — DFC_INTRO / DFC_THEMES (6) / DFC_BUDGET / DFC_STYLE. Six themes: Connection, Intimacy, Mindfulness, Collaboration, Creativity, Focus (6th = Claude's addition, proposed round 1, unobjected). 24 tactics total (5/4/4/4/4/3), each `{name, line, more, image:{scene, notice}}`. v1 pattern bank fully absorbed (common table, elders, food loops → Connection; nooks/soft boundaries → Intimacy; stillness room → Mindfulness; collision surfaces → Collaboration; whimsy/instruments → Creativity; zoning → Focus). P-A's named examples in: "large open space" (Connection), "proximity with nature" (Mindfulness). His-house stories keep [edit].
- **`design.html` v2** — hero (huge serif, few words) → "Designing for…" carousel (one ~76vw slide centered, neighbours peek faded at both edges, arrows/dots/keyboard, click side slide = navigate) → click active theme = tactics band expands underneath (theme-wash color block, horizontal snap rail of tactic cards) → "No matter the budget" sun-yellow block (6 cards, one per theme, same anatomy) → growing-bank mailto outro. Deep links: `design.html#<theme>` opens that theme expanded. Each theme owns a duotone accent; everything inside inherits it.
- **Placeholders** — every image slot renders a dashed accent-framed block with the generation scene written inside; the "what to notice" caption sits below as permanent content. When a `src` key is added in design-data.js the placeholder swaps to the real image automatically.
- **ASSETS.md** — new "Design for Connection v2 (36 slots)" register section; design-data.js is the single source of truth for scenes (no-drift pattern).

## Known behaviour flagged to P-A
- First/last theme show a neighbour sliver on one side only (linear carousel; wrap navigation works via arrows but jumps). Infinite-loop track = future polish if wanted.

## Verify
`_qa/shoot-design.js` — 9 shots (desktop/mobile/band open/rail end/deep link/budget), 0 console errors.

## v2.1 — feedback round (same day)

P-A: like it overall; images coming soon. Changes: (1) theme title now OVERLAYS the image (frosted caption card, slide = just the image + notice line); (2) popup band REPLACED by scroll-through open state — all six themes as stacked full-width sections, each one big block in its light theme color, theme title FROZEN (sticky under nav, with i/6 + "Overview ↑") so each theme fits ~one screen, vertical scroll flows theme → theme, hash follows scroll; (3) NEW "Designing what, exactly?" section after hero — the two scales: spaces we live in (architecture/interior, high control) vs communities we live in (urbanism, systemic; links Atlas); (4) budget section now COLLAPSIBLE, reframed "cost-effective ways to design the inside of your space", collapsed by default; (5) new bottom card "Designers that inspire me" — future section, deliberate dead link to designers.html marked "coming soon". Data additions: DFC_WHAT, DFC_INSPIRE, DFC_BUDGET.sub.

Incident: design.html em-dashes double-encoded during parallel-chat footer insertion; repaired byte-level (perl), footer preserved, verified in-browser. Re-verified: `_qa/shoot-design.js` v2.1 — 12 shots, 0 console errors.
