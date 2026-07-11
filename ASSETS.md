# ASSETS.md — visual asset pipeline

One entry per image slot on the site. Statuses: `proposed → chosen → prompt ready → generated → placed`.
Workflow (agreed 2026-07-11): (1) can it be interactive/code-built? → Claude builds it. (2) If not → generated image: Claude proposes concepts + writes generation prompts with the shared style block; P-A generates and drops files in `images/generated/`; Claude integrates. (3) Fallback: licensed photo.

**Current plan:** P-A is connecting an image-generation MCP. Until then, all `diagram` slots below show a designed placeholder on the site (icon + "illustration in progress"). When the MCP is live, Claude generates directly (or writes prompts if the MCP path changes).

## Shared style anchor (bake into every generation prompt)

> DRAFT — locks after the first approved generation.

Warm solarpunk palette on pale paper ground (#f6f2e7): honey gold, leaf green, sky blue, clay accents. Flat poster-minimalism with generous negative space (per moodboard: SEED poster / "cool summer" family), not busy storybook scenes. Isometric or cutaway architectural illustration style, clean line work, no text labels in the image. Consistent light (golden hour). No photorealism, no people's faces in close-up.

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

### Backlog (not yet specced)
- Home hero alternative (currently Dear Alice still — proprietary, credited; revisit before deploy)
- Manifesto per-assumption spot illustrations (13) — after assumption deep pages exist
- Design for Connection per-pattern photos/illustrations — after pattern bank grows
