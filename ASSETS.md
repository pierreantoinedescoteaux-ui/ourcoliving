# ASSETS.md — visual asset pipeline

One entry per image slot on the site. Statuses: `proposed → chosen → prompt ready → generated → placed`.
Workflow (agreed 2026-07-11): (1) can it be interactive/code-built? → Claude builds it. (2) If not → generated image: Claude proposes concepts + writes generation prompts with the shared style block; P-A generates and drops files in `images/generated/`; Claude integrates. (3) Fallback: licensed photo.

**Current plan:** P-A is connecting an image-generation MCP. Until then, all `diagram` slots below show a designed placeholder on the site (icon + "illustration in progress"). When the MCP is live, Claude generates directly (or writes prompts if the MCP path changes).

## Shared style anchor (bake into every generation prompt)

> DRAFT — locks after the first approved generation.

Hand-drawn isometric / cutaway architectural illustration: ink linework with soft watercolor and gouache washes and subtle paper grain. Warm solarpunk mood on a neutral pale warm-paper ground (#f6f2e7). **Near-monochrome duotone:** each image uses ONE main accent color across its full range of tints and shades for almost everything, plus ONE secondary accent for small highlights — never the full palette in one image. Both accents drawn from the palette (leaf green #5c9e4a, sky blue #7fb6c9, honey gold #d99a3d, sun yellow #f7c948, terracotta clay #b5613c); deep forest green #173a2c only for darkest linework/shadows. Flat poster-minimalism with generous negative space (per moodboard: SEED poster / "cool summer" family), one clear focal object on the paper ground, not busy storybook scenes. Clean line work, no text labels in the image. Consistent golden-hour light. No photorealism, no 3D-render look, no people's faces in close-up. Per-type main→secondary accent map and the 12 ready-to-use generation prompts live in `coliving-diagram-prompts.md`.

## Slot register

### Field-guide layout diagrams (12) — `type.html` + atlas popup

Each: an isometric/cutaway illustration that visually explains how the model organizes space. Renders when `TYPE_KNOWLEDGE[slug].diagram = { src, cap }` is added in `knowledge-data.js`. Target file: `images/generated/diagram-<slug>.jpg`.

| Slug | Concept to show | Status |
|---|---|---|
| ecovillage | whole settlement: clustered homes + food gardens + energy + commons at centre | proposed — awaiting MCP |
| cohousing | private homes ringing a common house + shared courtyard | proposed — awaiting MCP |
| housing-coop | one apartment building, units + shared spaces, ownership shared across all floors | proposed — awaiting MCP |
| baugruppen | group of families co-designing/building one infill building (construction cutaway) | proposed — awaiting MCP |
| kibbutz | village around communal dining hall + working fields | proposed — awaiting MCP |
| intergenerational | one big house / block mixing elders, families, students; shared kitchen at heart | proposed — awaiting MCP |
| hacker-house | one house: bedrooms + big open work/build space with desks & whiteboards | proposed — awaiting MCP |
| operator-coliving | apartment tower: small private studios + large managed amenity floors | proposed — awaiting MCP |
| entrepreneur-house | shared house where living room doubles as studio/workshop; long dinner table | proposed — awaiting MCP |
| rural-coliving | countryside farmhouse: coworking barn + gardens + guest rooms | proposed — awaiting MCP |
| network-village | several houses across a map connected by paths/links, one shared hub | proposed — awaiting MCP |
| student-coop | big shared student house: chore wheel energy, communal kitchen, study corners | proposed — awaiting MCP |

### Manifesto v3 (2026-07-11) — `manifesto.html` + `assumption.html`

| Slot | Concept to show | Current placeholder | Status |
|---|---|---|---|
| manifesto hero | hope hero: golden-hour village / long shared table, wide 16:8 | `solarpunk-feast.jpg` (Dear Alice — proprietary, credited) | proposed — awaiting MCP |
| story-made-of-everyone | people woven together / shared morning | `mtl-brunch-jam.jpg` (own) | proposed — awaiting MCP |
| story-more-for-you | one long abundant table | `rooral-dinner.jpg` (proprietary-ish, credited) | proposed — awaiting MCP |
| story-security | circle of people as a net | `crew-poolside.jpg` (own) | proposed — awaiting MCP |
| story-money-cant-buy | many hands carrying one thing | `collab-art-table.jpg` (own) | proposed — awaiting MCP |
| story-own-your-time | slow shared evening | `mtl-patio.jpg` (own) | proposed — awaiting MCP |
| story-work-gift | craft shared at home / studio corner | `mtl-coworking.jpg` (own) | proposed — awaiting MCP |
| story-trust | open door, warm light spilling out | `group-doorway.jpg` (own) | proposed — awaiting MCP |
| story-truly-known | two people, quiet music, lamplight | `music-piano-night.jpg` (own) | proposed — awaiting MCP |
| story-world-alive | village grown into its landscape | `solarpunk-harvest.jpg` (Dear Alice — proprietary, credited) | proposed — awaiting MCP |
| story-another-story | real cohousing street, lived-in | `proj-trudeslund.jpg` (Wikimedia, licensed) | proposed — awaiting MCP |
| village scroll scene | scroll-driven "village assembles" animation | CODE-BUILT v1 (inline SVG in manifesto.html, draws with scroll) | placed (code) — generated/video replacement optional if P-A wants richer |

Target files: `images/generated/story-<slug>.jpg` → wire via `MANIFESTO.stories[].img` in `manifesto-data.js`. Hero → `images/generated/manifesto-hero.jpg` → `MANIFESTO.heroImg.src`.

### Backlog (not yet specced)
- Home hero alternative (currently Dear Alice still — proprietary, credited; revisit before deploy)
- Design for Connection per-pattern photos/illustrations — after pattern bank grows
