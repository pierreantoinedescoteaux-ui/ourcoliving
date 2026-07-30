# AGENT-RULES.md — ground rules for EVERY session/agent working on this site

Read this + `DESIGN.md` + the ⬛ PAGE STATUS TABLE in `~/.claude/projects/C--Users-User/memory/project_coliving_portfolio.md` before touching anything.

## Canon files (agents obey these; conflicts → ask P-A)
1. `DESIGN.md` — visual system. Status DRAFT until P-A approves homepage v4.
2. `ASSETS.md` — visual asset pipeline + shared style anchor for generated images.
3. Project memory file (path above) — architecture, decisions, page status table. Update it every round.
4. Data files (`data.js`, `map-data.js`, `knowledge-data.js`, `manifesto-data.js`, `design-data.js`) — one per room; content layer is sacred.

## Editing discipline
- **Surgical edits only.** Never regenerate a whole file to change one thing. Use targeted edits; preserve everything not named in the task.
- **LOCKED list is law.** Check `FEEDBACK.md` 🔒 section before editing. Locked items need P-A's explicit ask to change.
- **Git after every approved round:** `git add -A && git commit -m "<round summary>"`. Never leave a session with uncommitted approved work.
- **Verify before claiming done:** run `_qa/shoot.js` FROM the `_qa/` directory (plain headless --screenshot is unreliable on these pages). 0 JS errors + visual check of full-page shots.

## Visual assets — the hierarchy (P-A spec, 2026-07-11)
For every visual slot, in order:
1. **Interactive/code-built first** — can this be an animation, scroll-driven element, SVG scene, or 3D moment built in code? If yes, build it (costs P-A nothing).
2. **Generated image** — via `ASSETS.md` pipeline (3 concepts → P-A picks → style-anchored prompt / image MCP).
3. **Licensed photo** — Wikimedia/press/permission; log in `images/CREDITS.md`.

### Generated-asset art direction (P-A, 2026-07-22 — ALL new site art, content pages included)
New generated art = storybook gouache **asset-vignette**: the scene painted with soft irregular dry-brush edges dissolving into plain cream/paper background, generous paper margin, floating ON the page (no card frame, no hard rectangle). Solarpunk means VISIBLE technology + modernity blended with the warm organic world — never "old village." Ornaments/hover art use the painted sticker kit (`assets/world/`), never code-drawn vector shapes. Reference recipe: `_landing/build2/raw/village-a2/b2.png` + `_landing/build2/prompts/village-a2/b2.txt`. Films from stills keep vignette edges completely still and get a CSS radial mask to melt into the page.

### Animation rules (P-A, 2026-07-27 — ALL future generated animations)
**Idle / ambient loops ("static animations"):**
- Mix obvious and subtle movement. 2-3 actions must be clearly visible at a glance (a person working, a child playing, an animal moving); the rest stays subtle (water, foliage, fabric). All-subtle reads as a broken still.
- Any character drawn mid-action in the source still MUST be animated — a frozen runner or frozen farmer reads as a glitch. If it can't be animated, it shouldn't be mid-action in the still.
- Elements that are supposed to visibly move (turbine blades, wheels, flags) must NOT be crisply drawn in the start still — the video model animates a second copy on top of the baked one (double-blade bug, 2026-07-27). Either remove/neutralize them in the still (hub only, motion blur) and let the video add the motion, or accept them fully static.
- Loops: start image = end image, tail crossfaded into head (`seamless-loops.sh` pattern).

**Camera transitions between scenes:**
- ONE fluid motion, ONE direction. Never let the camera reverse or hesitate mid-clip — direction changes are where the world morphs into a different world. Prompt as a timed shot list (e.g. 0-40% orbit right, 40-70% descend, 70-100% straight push-in) and state "never reverses direction".
- Proportions come from the camera, not the world: if a section must fill the frame, the camera zooms into it — the world never rescales.
- Big camera journeys (aerial→ground, front→back) fail as single 8s generations: the model must invent too much. Break them into small legs bridged by generated stills that share geometry with both ends; validate each leg separately.
- Before any 1080p spend on a new camera path: render a cheap low-res draft first to prove the path reads, then re-render final. Never burn full-price rerolls hunting a path.

## Copy rule: concrete words, never invented ones (P-A, 2026-07-30)
Say the plain thing. If the page means resources, it says "resources". Do not
coin a phrase where a common word exists.

> "stop with this stupid vocabulary like 'what's gathered' this is just a very
> unclear way to say 'resources'. you keep making things not concrete sometimes
> in the copy."

Concrete failures to avoid: naming a section after a feeling instead of its
contents; a label the visitor has to decode before they can decide; a clever
phrase where a noun would do. Before shipping a label, ask what a visitor
would have to already know to understand it. If the answer is anything, rename it.

**No em dashes anywhere on this site (P-A, 2026-07-30).** He reads them as the
clearest tell of AI-written text. Use commas, periods, colons or parentheses.
Existing copy still carries 18 of them on the landing; they are flagged in the
Notes column of `LANDING-COPY.csv` and come out with his voice pass, not by a
blind find-and-replace, because removing one changes the sentence's rhythm.

## Mobile sizes are enforced, not advised (2026-07-30)
The numbers live in `MOBILE-RULES.md`: reading text 16px minimum, small labels
12px minimum, tap targets 44px. Do not copy them into new files and do not
hand-tune below them.

`node _qa/mobile-audit.js` (with `BASE=http://127.0.0.1:8123` to include the
homepage) now FAILS on a breach instead of printing a warning. Known older
breaches are recorded in `_qa/mobile-baseline.json`; that file may only shrink.
Fix a page, then `node _qa/mobile-audit.js --rebaseline` to clear its entries.

## Taste rule (P-A, 2026-07-11 — after 2 misses)
Do NOT guess aesthetics from adjectives. P-A provides visual references (`moodboard/`, ludiq.org); Claude does structure, interactions, content, and faithful rebuild-to-reference. If a visual call has no reference to anchor it, ask or propose options — don't invent.

## Model discipline
- Judgment (design calls, copy voice, architecture, escalations) → Fable 5 / Opus.
- Grunt work (scraping, image sourcing, batch edits, fact-checks) → Sonnet subagents.
- Feedback processing: concrete items → cheap agents; ambiguous items → escalate to P-A via FEEDBACK.md ⏳ section. Never guess.

## Copyright (deploy blockers tracked in images/CREDITS.md)
Dear Alice stills + Rooral photos + some example photos are proprietary — credited, OK-ish for personal portfolio, need permission/replacement before wide deploy. Don't add new proprietary images without flagging in CREDITS.md.
