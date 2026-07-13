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
      kind: "community",
      name: "Our communities",
      scale: "Urbanism",
      sub: "The cities, neighbourhoods and common spaces between us.",
      body: "Streets, shared courtyards, who lives near whom — more systemic, slower to move, mostly decided above any one household. Harder to control, but it shapes everything downstream. [edit]",
      image: {
        src: "images/proj-trudeslund.jpg", pos: "center",
        scene: "A lived-in pedestrian lane in Trudeslund cohousing, Denmark — homes facing each other across a car-free path."
      },
      link: { label: "The Coliving Atlas maps this scale", href: "map.html" }
    },
    {
      kind: "space",
      name: "Our homes: inside and outside",
      scale: "Architecture & design",
      sub: "The rooms, light and objects we live among.",
      body: "Rooms, light, furniture, thresholds — the scale you actually control. You can move a sofa tonight and change how your household behaves by the weekend. Most of this page lives here. [edit]",
      image: {
        src: "images/mtl-living-room.jpg", pos: "center 45%",
        scene: "The bright living room of the Montreal house — brick wall, plants, big window, deep sofa."
      }
    }
  ]
};

/* Live since 2026-07-12 — designers.html (content: designers-data.js). */
const DFC_INSPIRE = {
  eyebrow: "The shoulders",
  line: "People far better than me at these decisions — the architects and interior designers this page borrows from. [edit]",
  label: "Designers that inspire me",
  href: "designers.html",
  note: "eight of them, for a start"
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
      src: "images/generated/dfc-connection.jpg", pos: "center 22%",
      scene: "Green paper-cut figures holding hands in a ring around a heart-shaped earth on warm cream.",
      notice: "The circle only closes because every figure gives both hands — connection is something people build together."
    },
    tactics: [
      {
        slug: "common-table",
        name: "The common table",
        line: "One table big enough for everyone.",
        more: "It is the single highest-leverage object in a shared home — fifty years of Danish cohousing runs on one rule of thumb: keep the common meal, and the community holds.",
        image: {
          src: "images/mtl-formal-dinner.jpg", pos: "center 55%",
          scene: "A real dinner at the Montreal house — one big roast pan in the middle of a full table, everyone leaning in and serving themselves.",
          notice: "One pan in the middle, no head seat — everyone serves each other by default."
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
          src: "images/garden-summer.jpg", pos: "center",
          scene: "The house garden in full summer.",
          notice: "Dinner starts a few steps from the kitchen door."
        }
      },
      {
        slug: "elders-in-the-middle",
        name: "Elders in the middle",
        line: "Mix the generations on purpose.",
        more: "Humanitas Deventer houses students inside a care home — thirty hours of neighbourliness a month for free rent — and loneliness drops on both sides of the deal.",
        image: {
          src: "images/ex-humanitas.jpg", pos: "center",
          scene: "Humanitas Deventer in the Netherlands — students and elders who share the same building and the same front door.",
          notice: "Humanitas Deventer — students and elders behind one front door, on purpose."
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
      src: "images/generated/dfc-intimacy.jpg", pos: "center",
      scene: "Watercolor sketch of two figures, one red and one blue, hands touching, with a warm golden glow linking their chests.",
      notice: "The gold light runs chest to chest — closeness is the warmth two people make between them."
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
      src: "images/generated/dfc-mindfulness.jpg", pos: "center 38%",
      scene: "Textured print of a person sitting on a green hillside, seen from behind, watching a huge orange sun rise through the clouds.",
      notice: "Nothing in their hands, nowhere to be — the hill does the slowing down for them."
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
          src: "images/mtl-stillness-room.jpg", pos: "center 60%",
          scene: "The stillness room of the Montreal house — tatami mats, floor cushions, a low table, plants in the window light, slippers left at the edge of the mat.",
          notice: "The slippers left at the edge of the mat — nobody was told; the room sets its own rules."
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
      src: "images/generated/dfc-collaboration.jpg", pos: "center 30%",
      scene: "Five blue hands weaving one yellow string figure together, cat's-cradle style, on paper white.",
      notice: "One string, five hands — the figure only exists while everyone keeps holding their part."
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
          src: "images/mtl-coworking.jpg", pos: "center 55%",
          scene: "The coworking room of the Montreal house — one long desk wall, a row of screens and chairs, plants on the shelves above.",
          notice: "One shared desk wall — sit down anywhere and you're in working distance of everyone."
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
      src: "images/generated/dfc-creativity.jpg", pos: "center 42%",
      scene: "Collage illustration of a calm face whose open head holds a bouquet of bold retro flowers growing upward.",
      notice: "The head is open on purpose — ideas grow where the lid is off."
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
          src: "images/music-piano-night.jpg", pos: "center 40%",
          scene: "Two people at the keyboard by the window on a house night — sheet music lit by one lamp, city lights outside.",
          notice: "Nobody planned this — the keyboard was out, so the evening became music."
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
          src: "images/collab-art-table.jpg", pos: "center",
          scene: "Four people drawing together on one big canvas laid flat on the table, markers out, red and black ink spreading from every side.",
          notice: "One canvas, four hands — it started because the markers were already on the table."
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
      src: "images/generated/dfc-focus.jpg", pos: "center 65%",
      scene: "Minimal poster of a lone figure walking a long white arrow-shaped path across an amber field, small sun above.",
      notice: "One path, one direction, nothing else in the frame — that is what the room should feel like."
    },
    tactics: [
      {
        slug: "rooms-one-job",
        name: "Rooms with one job",
        line: "Zone the house by behavioural job.",
        more: "The Montreal house gave every room a job — focus, gathering, rest — so five entrepreneurs could live, work and connect without the three needs cannibalizing each other. [edit]",
        image: {
          src: "images/work-sunroom-office.jpg", pos: "center 55%",
          scene: "A sunroom turned office — one desk and one chair under a glass roof full of trees.",
          notice: "One desk, one chair, a roof of trees — this room has exactly one job."
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
