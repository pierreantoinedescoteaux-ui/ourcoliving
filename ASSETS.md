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
| ecovillage | whole settlement: clustered homes + food gardens + energy + commons at centre | generated → placed (2026-07-11) |
| cohousing | private homes ringing a common house + shared courtyard | generated → placed (2026-07-11) |
| housing-coop | one apartment building, units + shared spaces, ownership shared across all floors | generated → placed (2026-07-11) |
| baugruppen | group of families co-designing/building one infill building (construction cutaway) | generated → placed (2026-07-11) |
| kibbutz | village around communal dining hall + working fields | generated → placed (2026-07-11) |
| intergenerational | one big house / block mixing elders, families, students; shared kitchen at heart | generated → placed (2026-07-11) |
| hacker-house | one house: bedrooms + big open work/build space with desks & whiteboards | generated → placed (2026-07-11) |
| operator-coliving | apartment tower: small private studios + large managed amenity floors | generated → placed (2026-07-11) |
| entrepreneur-house | shared house where living room doubles as studio/workshop; long dinner table | generated → placed (2026-07-11) |
| rural-coliving | countryside farmhouse: coworking barn + gardens + guest rooms | generated → placed (2026-07-11) |
| network-village | several houses across a map connected by paths/links, one shared hub | generated → placed (2026-07-11) |
| student-coop | big shared student house: chore wheel energy, communal kitchen, study corners | generated → placed (2026-07-11) |

### Manifesto v3 (2026-07-11) — `manifesto.html` + `separation.html` (the talk piece; replaced assumption.html)

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

### Design for Connection v2 (2026-07-11) — `design.html` (36 slots)

6 theme heroes + 24 tactic images + 6 budget-move images, all 16:9, all currently designed placeholders that render their scene description on-page. **Source of truth for every scene + notice caption: `design-data.js`** (each image = `{scene, notice}`; add a `src` key when generated and the page swaps the placeholder for the image automatically — no HTML change needed).

- Duotone per theme (also in `DFC_THEMES[].promptColors`): connection = honey gold + leaf-green pops · intimacy = terracotta + gold · mindfulness = sky blue + leaf green · collaboration = leaf green + sky · creativity = sun yellow + terracotta · focus = deep forest + gold.
- Generation workflow: same as field-guide diagrams (`coliving-type-visual-guide.md` — Green Tea Town style reference in Gemini), scene from `design-data.js` + the `DFC_STYLE` tail with MAIN/POP replaced by the theme's duotone.
- Target files: `images/generated/dfc-<theme>.jpg` (theme heroes), `dfc-<theme>-<tactic>.jpg` (tactics), `dfc-budget-<theme>.jpg` (budget moves).
- Status: **6 theme heroes generated + placed 2026-07-11** (P-A-provided illustrations from Downloads; Claude curated — mindfulness candidate #1 "person on hill" chosen over #2 "stones on red"; set is style-mixed [riso/watercolor/flat vector/collage], acceptable since one shows at a time — flag for possible consistency regeneration later). NOTE: collaboration image has a small artist watermark (@sashadrmr-ish) bottom-right — check licensing/credit before deploy, log in CREDITS.md.
- **8 tactic slots filled from existing site images 2026-07-11** (P-A asked for a reuse pass): common-table→mtl-formal-dinner · food-loops→garden-summer · elders→ex-humanitas · stillness-room→mtl-stillness-room · instruments-open→music-piano-night · big-shared-desk→mtl-coworking · materials-in-reach→collab-art-table · rooms-one-job→work-sunroom-office. Also "Designing what?" blocks: communities→proj-trudeslund (Wikimedia, licensed), homes→mtl-living-room. **16 tactic + 6 budget slots still proposed — awaiting MCP.**

### Backlog (not yet specced)
- Home hero alternative (currently Dear Alice still — proprietary, credited; revisit before deploy)

## About / Story — photo slots (R19)

Swap in by adding `src:` to the chapter's image in about-data.js — placeholder auto-replaces.

- story:stone-house — WANTED from P-A — PHOTO WANTED — childhood photo: P-A as a kid building something (fort, Lego, sandcastle) or playing outside in Drummondville. Grainy family photo is perfect — the realness is the point.
- story:organizer — WANTED from P-A — PHOTO WANTED — teenage P-A with the improv team, on stage, or coaching tennis. A tournament group shot works.
- story:way-in — WANTED from P-A — PHOTO WANTED — Sway Accessories era: a product shot, a market stand, or P-A at a case competition (Jeux du commerce / Happening Marketing podium).
- story:facilitator — WANTED from P-A — PHOTO WANTED — an Alliance event at ULaval: a room of students mid-workshop, or P-A speaking/facilitating.
- story:scale — WANTED from P-A — PHOTO WANTED — the UN HLPF 2019 delegate badge/floor shot, or a ReImagine17 team retreat photo — people, not logos.
- story:tokyo — WANTED from P-A — PHOTO WANTED — the Tokyo share-house common room, or a group dinner there. Even a bad phone photo carries it.
- story:rooms-that-move — WANTED from P-A — PHOTO WANTED — a C2 event floor shot (the immersive staging) with P-A in it if possible, or P-A at work during the event.
- story:hard-chapter — WANTED from P-A — PHOTO WANTED — Bridge2AI era: late-night office/accelerator shot, the SF trip, or a whiteboard covered in scheduling diagrams. Honest > polished.
- story:now — WANTED from P-A — PHOTO WANTED — recent: P-A hiking / trail running, or hosting a dinner at the Montréal house. Warm, outdoors or golden-hour indoors.

## Work / case studies — photo slots (R22)

Swap in by adding `src:` to the entry in work-data.js — placeholder auto-replaces.

- work:growth-hub-dunbar — WANTED from P-A — PHOTO WANTED — the ad / listing creative that filled the house, or a screenshot of the application pipeline. The unglamorous proof.
- work:growth-hub-dunbar — WANTED from P-A — PHOTO WANTED — a strong event shot: cold plunge, group workout, or a full-table dinner at Dunbar.
- work:growth-hub-shaughnessy — WANTED from P-A — PHOTO WANTED — the Shaughnessy house exterior, wide enough to show the scale. This case study has no photos yet; the estate deserves one good shot minimum.
- work:growth-hub-shaughnessy — WANTED from P-A — PHOTO WANTED — an interior common space that shows the estate's scale.
- work:growth-hub-shaughnessy — WANTED from P-A — PHOTO WANTED — the grounds or the guest house.
