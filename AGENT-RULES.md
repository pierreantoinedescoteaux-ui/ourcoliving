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

## Taste rule (P-A, 2026-07-11 — after 2 misses)
Do NOT guess aesthetics from adjectives. P-A provides visual references (`moodboard/`, ludiq.org); Claude does structure, interactions, content, and faithful rebuild-to-reference. If a visual call has no reference to anchor it, ask or propose options — don't invent.

## Model discipline
- Judgment (design calls, copy voice, architecture, escalations) → Fable 5 / Opus.
- Grunt work (scraping, image sourcing, batch edits, fact-checks) → Sonnet subagents.
- Feedback processing: concrete items → cheap agents; ambiguous items → escalate to P-A via FEEDBACK.md ⏳ section. Never guess.

## Copyright (deploy blockers tracked in images/CREDITS.md)
Dear Alice stills + Rooral photos + some example photos are proprietary — credited, OK-ish for personal portfolio, need permission/replacement before wide deploy. Don't add new proprietary images without flagging in CREDITS.md.
