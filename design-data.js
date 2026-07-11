/* =====================================================================
   DESIGN FOR CONNECTION v2 — content layer for design.html
   Structure: HERO → six THEMES (feelings we design for), each with one
   image + a horizontal band; clicking a theme expands the tactics band
   underneath (each tactic: image + 1-liner + longer sentence + a
   "what to notice" caption) → BUDGET section (one cheap move per theme).

   Images: ALL placeholders for now. Each image = { scene, notice }.
   - scene  → what to generate (prompt-ready; combine with DFC_STYLE tail
              and the theme's duotone accents, per coliving-type-visual-guide.md
              workflow: Green Tea Town style reference in Gemini, 16:9).
   - notice → the one sentence shown to the READER next to the image.
   Target files when generated: images/generated/dfc-<slug>.jpg

   [edit] = P-A voice needed. v1 pattern bank absorbed 2026-07-11 (git has v1).
   ===================================================================== */

const DFC_STYLE =
  "Loose hand-drawn sketch: wobbly uneven lines, visible pencil, watercolor blooms and drips, rough edges. " +
  "Mostly bare cream paper (#f6f2e7); MAIN color dominant, sparse POP color pops. No text. 16:9.";

const DFC_INTRO = {
  eyebrow: "Design for connection",
  titleHtml: "We are a product of our environment. <em>Let&rsquo;s design for connection.</em>",
  lede: "Every room quietly tells people how to act. Name the feeling you want — then design backwards. [edit]"
};

/* "Designing what?" — the two scales of design, before the themes. */
const DFC_WHAT = {
  eyebrow: "First, a distinction",
  title: "Designing what, exactly?",
  blocks: [
    {
      name: "The spaces we live in",
      scale: "Architecture & interior design",
      body: "Rooms, light, furniture, thresholds — the scale you actually control. You can move a sofa tonight and change how your household behaves by the weekend. Most of this page lives here. [edit]"
    },
    {
      name: "The communities we live in",
      scale: "Urbanism",
      body: "Streets, shared courtyards, who lives near whom — more systemic, slower to move, mostly decided above any one household. Harder to control, but it shapes everything downstream. [edit]",
      link: { label: "The Atlas maps this scale", href: "map.html" }
    }
  ]
};

/* Future section — for now a deliberate dead link (designers.html not built yet). */
const DFC_INSPIRE = {
  eyebrow: "Future section",
  line: "People far better than me at these decisions — the architects and interior designers this page borrows from. [edit]",
  label: "Designers that inspire me",
  href: "designers.html",
  note: "coming soon"
};

/* Six feelings. accent = { main, deep, pop, wash } hexes from DESIGN.md palette;
   promptColors = the duotone in words, baked into every generation prompt. */
const DFC_THEMES = [
  {
    slug: "connection",
    name: "Connection",
    accent: { main: "#d99a3d", deep: "#8f6215", pop: "#5c9e4a", wash: "#f7ecd9" },
    promptColors: "honey gold dominant, sparse leaf-green pops",
    tagline: "Paths that cross, tables that gather.",
    blurb: "The feeling of being part of a household, not just a tenant of one. Design so that daily life bumps people into each other — gathering as the state the house rests in, not an event anyone has to organize.",
    image: {
      scene: "Warm interior of a big shared home at dinner time — a long table mid-meal with people passing plates, an open kitchen behind, sofas and a guitar at the edge of the same generous room, evening light through tall windows.",
      notice: "Notice how the kitchen, the table and the sofas share one room — nobody cooks, eats or rests out of sight of the others."
    },
    tactics: [
      {
        slug: "common-table",
        name: "The common table",
        line: "One table big enough for everyone.",
        more: "It is the single highest-leverage object in a shared home — fifty years of Danish cohousing runs on one rule of thumb: keep the common meal, and the community holds.",
        image: {
          scene: "A very long wooden dining table with mismatched chairs, set for ten, one big steaming pot at the centre, bread and bowls being passed, benches on one side.",
          notice: "One table, no head seat — the pot in the middle makes serving each other the default."
        }
      },
      {
        slug: "large-open-space",
        name: "One large open space",
        line: "A commons generous enough to hold the whole house at once.",
        more: "When the biggest, brightest volume in the home is the shared one — open to the kitchen, tall, uncluttered — gathering stops needing an invitation and becomes the path of least resistance.",
        image: {
          scene: "Cutaway of a double-height common room: open kitchen along one wall, long table, reading corner and a hammock all inside one continuous airy volume, people scattered in small clusters.",
          notice: "The room has no single purpose — cooking, lounging and playing overlap in one continuous space."
        }
      },
      {
        slug: "desire-path",
        name: "On the desire path",
        line: "Put the commons between the door and the bedrooms.",
        more: "People connect when crossing paths is inevitable — route everyone's daily walk through the shared space and hellos happen by default, before anyone decides to be social.",
        image: {
          scene: "Playful floor-plan sketch of a house viewed from above: front door, a dotted footprint trail passing straight through a big common room with a table, then splitting toward small bedrooms.",
          notice: "Follow the dotted trail — there is no way home that avoids the common room."
        }
      },
      {
        slug: "food-loops",
        name: "Food as the loop",
        line: "Grow a little, cook big, share the harvest.",
        more: "A garden scaled to the community's real labour plus one shared kitchen turns cost-cutting into culture — planting days and big cooks are community-building disguised as chores.",
        image: {
          scene: "A backyard with raised garden beds and fruit trees, two people carrying a basket of vegetables toward a wide-open kitchen door, a worn footpath connecting beds to door.",
          notice: "The path worn between the garden beds and the kitchen door — the loop the house lives on."
        }
      },
      {
        slug: "elders-in-the-middle",
        name: "Elders in the middle",
        line: "Mix the generations on purpose.",
        more: "Humanitas Deventer houses students inside a care home — thirty hours of neighbourliness a month for free rent — and loneliness drops on both sides of the deal.",
        image: {
          scene: "A sunny shared courtyard: an elder and a young adult playing chess on a bench, a walker and a skateboard parked side by side against the same wall, laundry lines above.",
          notice: "The walker and the skateboard parked side by side."
        }
      }
    ]
  },
  {
    slug: "intimacy",
    name: "Intimacy",
    accent: { main: "#b5613c", deep: "#8f4a2c", pop: "#d99a3d", wash: "#f6e7dd" },
    promptColors: "terracotta clay dominant, sparse honey-gold pops",
    tagline: "Small corners that hold people.",
    blurb: "Feeling held — closeness without crowd, privacy without isolation. Big shared homes need small places where two people can actually reach each other.",
    image: {
      scene: "A window nook at dusk: two cushions, a half-drawn linen curtain, one warm lamp, rain outside the glass, a mug on the sill — a small pocket of shelter inside a larger dark room.",
      notice: "The room is big, but the nook makes it feel like it is holding just you."
    },
    tactics: [
      {
        slug: "nooks-for-two",
        name: "Nooks that hold two",
        line: "Break big rooms into corners for two, not twenty.",
        more: "Alcoves, window seats and level changes give closeness a place to happen inside shared space — the size of the corner is itself the invitation.",
        image: {
          scene: "A cosy alcove built into a wall of bookshelves: two people reading under a blanket, a small shelf with two teacups, the bigger room blurred beyond.",
          notice: "The alcove fits two people and nothing else — the size is the invitation."
        }
      },
      {
        slug: "soft-boundaries",
        name: "Soft boundaries",
        line: "Curtains, plants and shelves instead of walls.",
        more: "Cut sightlines and soften sound without sealing people off — softness creates privacy you can push aside, which is exactly the kind a shared home needs.",
        image: {
          scene: "A room gently divided by a tall open bookshelf, hanging trailing plants and a floor-length linen curtain half open, warm light bleeding through the layers.",
          notice: "You can still hear the house — the boundary is soft on purpose."
        }
      },
      {
        slug: "low-light",
        name: "Low light, low ceiling",
        line: "Lower the light where you want people to stay.",
        more: "Brightness and height are for passing through; dimness and enclosure tell bodies it is safe to settle — pools of lamplight beat one bright overhead every time.",
        image: {
          scene: "A low corner of a living room at night: three small warm lamps making separate pools of light over a deep sofa, the ceiling feeling close, shadows soft.",
          notice: "Three small pools of lamplight instead of one bright overhead."
        }
      },
      {
        slug: "conversation-distance",
        name: "Conversation distance",
        line: "Seats angled toward each other, close enough to murmur.",
        more: "Furniture placed for talk rather than for a screen makes deep conversation the room's default setting — the arrangement decides what the evening becomes.",
        image: {
          scene: "Two armchairs angled toward each other at ninety degrees, a small round table with a teapot between them, no television anywhere in the frame.",
          notice: "The chairs face each other, not a screen."
        }
      }
    ]
  },
  {
    slug: "mindfulness",
    name: "Mindfulness",
    accent: { main: "#7fb6c9", deep: "#3d7286", pop: "#5c9e4a", wash: "#e3eff3" },
    promptColors: "sky blue dominant, sparse leaf-green pops",
    tagline: "Rooms that slow you down.",
    blurb: "Presence — space that lowers the noise instead of adding to it. The house can carry part of the practice: green in every sightline, thresholds that make you arrive, one room with nothing to do in it.",
    image: {
      scene: "A bright, almost empty room: one big window onto a garden, a single floor cushion, a small plant, steam rising from a cup of tea on the floor, long morning shadows.",
      notice: "Almost empty on purpose — the space leaves room for your attention."
    },
    tactics: [
      {
        slug: "proximity-nature",
        name: "Proximity with nature",
        line: "Something alive within reach of every room.",
        more: "Plants, courtyards and sightlines to green measurably calm the nervous system — treat nature as infrastructure for the mind, not as decoration.",
        image: {
          scene: "An interior where every window frames greenery: a fig tree pressing against one pane, trailing plants spilling from shelves, a courtyard garden visible through an open door.",
          notice: "From any seat, at least one window holds something alive."
        }
      },
      {
        slug: "stillness-room",
        name: "A stillness room",
        line: "One room with nothing to do in it.",
        more: "In my Montreal house, the floor-seated stillness room — low light, tatami, plants, no screens — became the place people went to be alone together. Nobody was told its purpose; the room said it. [edit]",
        image: {
          scene: "A serene tatami room: floor cushions in a loose circle, one paper lamp, a single plant in the corner, bare walls, soft even light — no table, no sockets, no screens.",
          notice: "No table, no sockets, no screens — the emptiness is the furniture."
        }
      },
      {
        slug: "slow-thresholds",
        name: "Thresholds that slow you",
        line: "A pause built between outside and in.",
        more: "A bench for shoes, a heavy door, three steps — small rituals of arrival let the street fall off your shoulders before the house begins.",
        image: {
          scene: "A calm entryway: low bench, shoes lined neatly at a step, a plant and a hook for coats, dim and enclosed — opening onto a brighter room beyond.",
          notice: "The shoes lined up at the step — the house asks you to arrive slowly."
        }
      },
      {
        slug: "quiet-materials",
        name: "Quiet materials",
        line: "Wood, textile and clay soak up the noise.",
        more: "Hard flat surfaces bounce sound and attention around the room; natural textures absorb both — you can hear a material palette as much as see it.",
        image: {
          scene: "A quiet corner rendered in textures: wooden wall slats, a thick wool throw over a chair, clay pots, a woven rug — matte surfaces everywhere, nothing glossy.",
          notice: "Nothing in the frame is shiny."
        }
      }
    ]
  },
  {
    slug: "collaboration",
    name: "Collaboration",
    accent: { main: "#5c9e4a", deep: "#3c6b32", pop: "#7fb6c9", wash: "#e7f0e2" },
    promptColors: "leaf green dominant, sparse sky-blue pops",
    tagline: "Space that pulls people into each other's projects.",
    blurb: "Building together starts long before a meeting is called. Make work visible, put thinking surfaces where people already pass, and spare minutes turn into contributions.",
    image: {
      scene: "A shared studio table with two people leaning over one large drawing, a wall of pinned sketches and plans behind them, mugs and pencils scattered, afternoon light.",
      notice: "The work is on the walls, not in drawers — visible work invites hands."
    },
    tactics: [
      {
        slug: "collision-surfaces",
        name: "Collision surfaces",
        line: "Whiteboards where people already pass.",
        more: "Ideas collide without scheduling when the surfaces for thinking live in circulation space — the kitchen wall, the landing, the hallway — instead of behind an office door.",
        image: {
          scene: "A kitchen wall turned whiteboard, covered in diagrams and arrows; one person sketching mid-gesture while another leans on the counter with coffee, mid-argument, smiling.",
          notice: "The whiteboard is in the kitchen, not the office."
        }
      },
      {
        slug: "big-shared-desk",
        name: "The big shared desk",
        line: "One work table nobody owns.",
        more: "A communal bench makes helping the default — sit down anywhere and you are already inside someone's project radius, one question away from being useful.",
        image: {
          scene: "A long workbench holding several projects mid-flow — a laptop, a half-soldered circuit, fabric and patterns, an open notebook — chairs pulled at friendly angles, no name tags.",
          notice: "Projects left mid-flow on the table — an open invitation to ask about them."
        }
      },
      {
        slug: "pin-up-walls",
        name: "Pin-up walls",
        line: "Show work in progress on the walls.",
        more: "Work made visible gets feedback for free; drawers are where collaboration goes to die — a wall of drafts turns the whole house into a quiet review panel.",
        image: {
          scene: "A corridor wall densely pinned with sketches, plans and sticky notes; one person on tiptoe adding a note to someone else's drawing.",
          notice: "The notes stuck by other hands on someone else's drawing."
        }
      },
      {
        slug: "project-room",
        name: "A room that shares a problem",
        line: "One room the whole house can walk into and help.",
        more: "Dedicate a room to whatever the house is currently making — door propped open by rule — and watch idle curiosity turn into an extra pair of hands.",
        image: {
          scene: "A small project room with a half-built canoe on trestles at its centre, tools on the walls, the door visibly propped open with a brick, a curious head peeking in.",
          notice: "The door is propped open — that is the rule, not an accident."
        }
      }
    ]
  },
  {
    slug: "creativity",
    name: "Creativity",
    accent: { main: "#f7c948", deep: "#8f6215", pop: "#b5613c", wash: "#fdf3d5" },
    promptColors: "sun yellow dominant, sparse terracotta pops",
    tagline: "Rooms with something to snag on.",
    blurb: "Sameness is sedative; strangeness is fuel. Fill the space with story-carrying objects, leave the instruments open, and give thinking some headroom — the house starts making things.",
    image: {
      scene: "A joyful room of mismatched wonders: an open piano, a wall of odd art, a globe, hanging paper birds, an easel by a huge window pouring in light.",
      notice: "Nothing matches — every object carries a story someone might ask about."
    },
    tactics: [
      {
        slug: "refuse-uniformity",
        name: "Refuse uniformity",
        line: "Fill the space with story-carrying objects.",
        more: "Mismatched, whimsical, slightly strange finds give minds something to snag on — a room where everything matches is a room where nothing starts.",
        image: {
          scene: "A shelf styled like a cabinet of curiosities: an old camera, a mask, a large shell, a tiny ship in a bottle, a strange stone — each object clearly from a different world.",
          notice: "Each object on the shelf earns a question."
        }
      },
      {
        slug: "instruments-open",
        name: "Instruments left open",
        line: "A closed piano is furniture; an open one is an invitation.",
        more: "The Dunbar house inherited an art collector's walls and we kept the strangeness — music nights started themselves, because the instruments were already out. [edit]",
        image: {
          scene: "An upright piano with the lid up and the stool pulled out, a guitar waiting on a stand beside it, sheet music open, late-day light across the keys.",
          notice: "The lid is up and the stool is out."
        }
      },
      {
        slug: "high-ceilings",
        name: "High ceilings, big windows",
        line: "Expansiveness overhead opens thinking.",
        more: "Generous volume and daylight where creation happens loosen the mind's grip — save the tall, bright rooms for making, and let the low snug ones hold rest.",
        image: {
          scene: "A tall studio space with one huge window, a single small figure at an easel dwarfed by the generous empty volume above them, dust motes in the light.",
          notice: "How small the person is in the volume — the room gives thought headroom."
        }
      },
      {
        slug: "materials-in-reach",
        name: "Materials in reach",
        line: "Tools visible, paper everywhere, nothing precious.",
        more: "Creation starts when the cost of starting is zero — leave the means lying around, unlocked and unprecious, and the house quietly begins to produce.",
        image: {
          scene: "Open shelving beside a work corner: jars of brushes and pencils, stacks of paper, balls of yarn, hand tools on a pegboard — everything visible, no cupboard doors.",
          notice: "No cupboard doors between you and starting."
        }
      }
    ]
  },
  {
    slug: "focus",
    name: "Focus",
    accent: { main: "#173a2c", deep: "#173a2c", pop: "#d99a3d", wash: "#e6ece5" },
    promptColors: "deep forest green dominant, sparse honey-gold pops",
    tagline: "Protecting the deep hours.",
    blurb: "In a house full of people, focus is a shared resource — it survives only where the space itself defends it. Real connection needs real retreat to come back from.",
    image: {
      scene: "A small desk facing a window in a quiet room, morning light, a closed door behind the chair, the rest of the house implied but silent beyond it.",
      notice: "The desk faces away from the door — the room defends the back of your attention."
    },
    tactics: [
      {
        slug: "rooms-one-job",
        name: "Rooms with one job",
        line: "Zone the house by behavioural job.",
        more: "The Montreal house gave every room a job — focus, gathering, rest — so five entrepreneurs could live, work and connect without the three needs cannibalizing each other. [edit]",
        image: {
          scene: "A cutaway dollhouse view of a shared home with each room washed in a single tone by its job — quiet work rooms clustered on one side, the lively kitchen and commons on the other.",
          notice: "Each room one colour, one job — the quiet rooms cluster away from the kitchen."
        }
      },
      {
        slug: "sound-discipline",
        name: "Sound discipline",
        line: "Quiet zones the space itself signals.",
        more: "Rugs, door norms and a hush floor should read instantly — you should never need a sign to know where in the house silence lives.",
        image: {
          scene: "A corridor threshold marked by a thick rug and a change in light, a door ajar onto a silent reading room beyond — the border between loud and quiet made visible.",
          notice: "The rug marks the border where voices drop."
        }
      },
      {
        slug: "door-you-can-close",
        name: "A door you can close",
        line: "Legitimize retreat.",
        more: "Community survives only next to real privacy — a closable door is not antisocial, it is what makes coming back out to the table genuine.",
        image: {
          scene: "A calm hallway at evening: one closed bedroom door with warm lamplight glowing underneath it, the hallway itself dim and peaceful, a plant by the wall.",
          notice: "The light under the door — present, but protected."
        }
      }
    ]
  }
];

/* One cheap move per theme — same card anatomy as tactics. */
const DFC_BUDGET = {
  eyebrow: "No matter the budget",
  title: "None of this needs an architect.",
  lede: "Every feeling on this page has a version that costs almost nothing. Design for behaviour, not spend — the room does not know how much the furniture cost. [edit]",
  items: [
    {
      theme: "connection",
      name: "A door on trestles",
      line: "A table for ten, for almost nothing.",
      more: "A secondhand door on two trestles with mismatched chairs seats the whole house — the meal does the rest.",
      image: {
        scene: "A flat wooden door laid across two simple trestles as a dining table, set with bowls and a big pot, benches and odd chairs around it, clearly improvised and clearly loved.",
        notice: "It is literally a door — nobody at dinner cares."
      }
    },
    {
      theme: "intimacy",
      name: "A curtain and a lamp",
      line: "A nook for the price of a takeout dinner.",
      more: "One thrifted lamp, a curtain across a corner and two cushions turn dead space into the most-fought-over spot in the house.",
      image: {
        scene: "A corner of a plain room transformed: a simple curtain on a wire, one warm secondhand lamp, two floor cushions — an obviously cheap, obviously inviting pocket of shelter.",
        notice: "Everything in this corner is secondhand."
      }
    },
    {
      theme: "mindfulness",
      name: "Cuttings in jars",
      line: "A forest in a year, for free.",
      more: "Plant cuttings in old jars propagate into a green room by themselves — and one screen-free cushion corner costs only the rule that protects it.",
      image: {
        scene: "A sunny windowsill crowded with plant cuttings rooting in recycled glass jars of every shape, one floor cushion below the window, morning light through the leaves.",
        notice: "The plants are cuttings in old jars — a forest in a year, for free."
      }
    },
    {
      theme: "collaboration",
      name: "The twenty-dollar whiteboard",
      line: "Hang it where everyone passes.",
      more: "A cheap whiteboard by the fridge collects more ideas than a meeting room — because everyone stands in front of it twice a day.",
      image: {
        scene: "A small whiteboard hung next to a refrigerator, dense with sketches, arrows and a shopping list bleeding into a project diagram, marker dangling from a string.",
        notice: "It hangs by the fridge — the busiest wall in the house."
      }
    },
    {
      theme: "creativity",
      name: "Thrift the strangeness",
      line: "Odd objects cost pennies at flea markets.",
      more: "One Saturday of flea-market hunting buys a shelf of story-carrying objects that no design catalogue could ever supply.",
      image: {
        scene: "A flea-market haul arranged proudly on a plank-and-brick shelf: a brass horn, an odd portrait, a globe, a carved animal — price stickers still on a couple of them.",
        notice: "Total cost of the shelf: under twenty dollars."
      }
    },
    {
      theme: "focus",
      name: "A rug and a rule",
      line: "A quiet room is mostly an agreement.",
      more: "An ordinary bedroom, a rug at the threshold and a rule everyone keeps make a deep-work studio without moving a single wall.",
      image: {
        scene: "An ordinary bedroom door with a small handwritten-style sign hanging from the handle and a neat rug at the threshold, the corridor around it calm and plain.",
        notice: "The 'studio' is a bedroom with a rule everyone keeps."
      }
    }
  ]
};
