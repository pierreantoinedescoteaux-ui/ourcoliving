# Manifesto v3 — design spec (approved 2026-07-11)

P-A approved after 4 iteration rounds in-session. This spec records the locked design.

## Arc
1. **Hero of hope** — "What if we built for connection?", Dear Alice feast image big (placeholder; ASSETS.md slot), short lede `[edit]`.
2. **The gray field ("The broken status quo")** — 10 gray organic shapes scattered full page width, drifting slightly. Each = one lived Story-of-Separation sentence (Eisenstein, *The More Beautiful World Our Hearts Know Is Possible* — research: `~/wiki/raw/specialized-knowledge/eisenstein-more-beautiful-world-separation-interbeing.md`). Click/tap → particle burst → colored card: Story-of-Interbeing statement (bare, no "what if" prefix, no numbers) + one-liner on how the co-living village answers it + small image + "Go deeper →" link. Bubbles also auto-pop when they reach the upper part of the viewport while scrolling (nobody misses the payoff). On FIRST pop: big serif **"What if…"** sparks into view above the field (whimsical starburst) and stays as the section's second title. As pops accumulate (`--p` 0→1): vegetation vines grow along both page edges, section background warms gray → pale green, gray title un-grays.
3. **"What it could be"** — code-built scroll-driven SVG village scene (duotone green + gold per DESIGN.md): section pins on screen, scroll draws stages ground → homes → gardens/greenhouse → long table + people → elder + kids bench → solar/turbine/sun. Possibilities list lights in sync: homes you can afford · food grown where you live · connection as the default · learning that crosses generations · energy owned by the neighbourhood. Finale caption. If the scene disappoints it IS the placeholder (ASSETS.md).
4. **Bright close (NO dark band — explicitly rejected)** — what the site aims to be: a manifesto of hope, map of the ways in, pointing to projects already building it. Sun/gold accents on paper. Eisenstein "more for you is more for me" pull-quote. CTAs → Atlas / Design for Connection / About.

## New page
`assumption.html?a=<slug>` — deep page per story: gray line → flip statement, village line, image, 2 short essay paragraphs (Eisenstein-grounded), verified reading links, prev/next pager. Renders from `MANIFESTO.stories`.

## Data
`manifesto-data.js`: new `stories` (10), `could`, new bright `close`. Legacy `assumptions` (13, with 26 verified links) and `whatifs` PRESERVED in file as content bank.

## Content decisions (P-A)
- Grays = personal, lived lines ("Security is a salary, a lock, and a savings account.") — NOT abstract assumptions, NOT housing-domain-heavy; drawn from the high-level Separation/Interbeing philosophy.
- Flips = bare utopian statements; "What if" appears ONCE as the spark title.
- Each card: village one-liner + image (placeholders from existing pool now; 10 generated slots registered in ASSETS.md).
- Negative-first; click + scroll fallback; deep pages built now.

## Non-negotiables honored
- No dark-by-default (forest reserved: NOT used here at all).
- Body ≥18px; content/data layer split; hybrid Zodiak/Switzer + ludiq scale; `prefers-reduced-motion` respected; QA via `_qa` Playwright harness before claiming done.
