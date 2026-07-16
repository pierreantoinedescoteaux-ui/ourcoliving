// Build batch generation spec for the Design-for-Connection image set.
// Deterministic: parses design-data.js scenes + theme duotones, merges setting
// overrides, appends the shared style + correctness tail. Output: _tools/dfc-batch-spec.json
import { readFileSync, writeFileSync } from 'fs';
import vm from 'vm';

const src = readFileSync(new URL('../design-data.js', import.meta.url), 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(src + ';__out = { DFC_WHAT, DFC_THEMES, DFC_BUDGET };', ctx);
const { DFC_WHAT, DFC_THEMES, DFC_BUDGET } = ctx.__out;

// P-A directives 2026-07-16: each image frames ITS design element as the hero;
// vary the frame of reference (house / warehouse loft / courtyard compound /
// farmhouse / indoor-outdoor — never default apartment); architectural
// correctness (windows, light source, believable proportions).
const STYLE =
  'Loose hand-drawn architectural concept sketch: confident wobbly ink lines, visible pencil construction marks, ' +
  'soft watercolor blooms, rough edges, generous bare cream paper (#f6f2e7). Duotone: {COLORS}. ' +
  'Architecturally believable: visible windows or a clear light source, correct human scale and proportions. ' +
  'The composition centers on the named design element — it is the unmistakable subject of the drawing. ' +
  'No text, no labels. 16:9 horizontal.';

// Setting overrides — vary the building type across the set.
const SETTING = {
  'what-home': 'Set in a lived-in brick rowhouse living room with one big street-facing window.',
  'common-table': 'Set in the big eat-in kitchen of a rural farmhouse shared by many, tall windows along one wall.',
  'large-open-space': 'Set in a converted warehouse loft with tall industrial windows flooding the volume with light.',
  'food-loops': 'Indoor-outdoor: view from the kitchen garden toward the open back door of a big shared house, raised beds in front, someone carrying vegetables inside.',
  'elders-in-the-middle': 'Set in the sunny inner courtyard of a low care-home compound: students and elders sharing benches near the one common front door.',
  'nooks-for-two': 'The alcove is a deep window seat with daylight coming through the window behind the readers.',
  'low-light': 'Evening scene in the snug den of an old house; windows dark, the three lamps are the only light.',
  'conversation-distance': 'Corner of a country-house sitting room beside a tall window with late light.',
  'quiet-materials': 'Attic corner of a timber house, one small deep-set window throwing soft light across the textures.',
  'collision-surfaces': 'Set in a compound kitchen with a window over the counter; the whiteboard wall is the hero.',
  'big-shared-desk': 'Set in a garden-facing coworking room of a large shared villa, one continuous desk under a band of windows.',
  'pin-up-walls': 'A wide corridor under a skylight, the pinned wall running its full length.',
  'project-room': 'A small workshop outbuilding across a yard, wide doors propped open with a brick, light spilling out.',
  'materials-in-reach': 'A bright garden room, big canvas flat on the table, French doors open to green.',
  'instruments-open': 'Bay-window corner of an old collector’s house at night, city lights outside the glass.',
  'budget-connection': 'Set in the plain main room of a starter shared house, one ordinary window with daylight.',
  'budget-intimacy': 'A corner of a plain bedroom-sized room, window light softened by the curtain.',
  'budget-collaboration': 'An ordinary kitchen wall beside the fridge, window over the sink in view.',
  'budget-focus': 'A plain upstairs corridor with a window at its end.',
};

const slots = [];
const add = (slug, section, scene, colors) => slots.push({
  slug, section,
  file: `images/generated/candidates/${slug}.png`,
  prompt: `${scene} ${SETTING[slug] ? SETTING[slug] + ' ' : ''}${STYLE.replace('{COLORS}', colors)}`,
});

add('what-community', 'intro', DFC_WHAT.blocks[0].image.scene, 'honey gold dominant, sparse leaf-green pops');
add('what-home', 'intro', DFC_WHAT.blocks[1].image.scene, 'honey gold dominant, sparse leaf-green pops');
for (const t of DFC_THEMES) {
  add(`hero-${t.slug}`, `theme:${t.slug}`, t.image.scene, t.promptColors);
  for (const tac of t.tactics) add(tac.slug, `theme:${t.slug}`, tac.image.scene, t.promptColors);
}
for (const b of DFC_BUDGET.items) {
  const theme = DFC_THEMES.find(t => t.slug === b.theme);
  add(`budget-${b.theme}`, 'budget', b.image.scene, theme.promptColors);
}

writeFileSync(new URL('./dfc-batch-spec.json', import.meta.url), JSON.stringify(slots, null, 1));
console.log(`spec written: ${slots.length} slots`);
slots.forEach(s => console.log(s.slug));
