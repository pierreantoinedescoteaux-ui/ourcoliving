/* =====================================================================
   DESIGN FOR CONNECTION — content layer for design.html
   Behavior-first design bank: start from the life we want, then the
   design / urbanism / engineering moves that produce it, then a real
   example. A growing bank — add patterns freely; the page renders all.
   Seeded from P-A's houses + the examples he described (2026-07-11).
   [edit] = P-A voice. Tags: design | urbanism | engineering.
   ===================================================================== */

const DESIGN_INTRO = {
  eyebrow: "Design for connection",
  title: "Space shapes behaviour. Design for the life you want.",
  lede: "Every room, street and building quietly tells people how to act — whether anyone designed it on purpose or not. This is a growing bank of patterns that starts from the other end: name the behaviour you want, then design backwards. Another way to re-question how things have always been done. [edit]"
};

const DESIGN_PATTERNS = [
  {
    slug: "elders-at-the-centre",
    want: "Elders active, needed, and passing knowledge on",
    tags: ["urbanism"],
    moves: [
      "House elders in the centre of the city or village — walkable to shops, schools, daily life — instead of facilities at the periphery.",
      "Give them roles the community actually needs: mentoring, childcare presence, craft teaching, front-porch eyes on the street.",
      "Design ground floors and courtyards so crossing paths with them is inevitable, not an event."
    ],
    example: "Humanitas Deventer houses students inside a care home — 30 hours of neighbourliness a month for free rent. Loneliness drops on both sides; the students describe the elders as the best part of the deal.",
    exampleLink: { label: "Humanitas Deventer", href: "map.html#intergenerational" }
  },
  {
    slug: "cozy-nooks",
    want: "People feeling held — intimacy inside shared space",
    tags: ["design"],
    moves: [
      "Break big rooms into nooks: alcoves, window seats, corners that hold two people, not twenty.",
      "Cut sightlines and sound with curtains, plants, bookshelves, and level changes instead of walls — softness that creates privacy without isolation.",
      "Lower the light and the ceiling where you want people to stay; brightness and height are for passing through."
    ],
    example: "In my Montreal house, the floor-seated stillness room — low light, tatami, plants, no screens — became the place people went to be alone together. Nobody was told its purpose; the room said it. [edit]",
    exampleLink: { label: "Montreal house", href: "project.html?p=montreal" }
  },
  {
    slug: "whimsy-for-creation",
    want: "Creativity sparking — people making things",
    tags: ["design"],
    moves: [
      "Refuse uniformity: fill the space with mismatched, whimsical, story-carrying objects — art, instruments, strange finds — that give minds something to snag on.",
      "High ceilings and big windows where creation happens; expansiveness up top opens thinking.",
      "Leave tools visible and reachable — a piano that's closed is furniture; a piano that's open is an invitation."
    ],
    example: "The Dunbar house inherited an art collector's walls and we kept the strangeness. Music nights started themselves — the instruments were already out. [edit]",
    exampleLink: { label: "Growth Hub Dunbar", href: "project.html?p=growth-hub-dunbar" }
  },
  {
    slug: "common-table",
    want: "Strangers becoming a household",
    tags: ["design"],
    moves: [
      "One table big enough for everyone — the single highest-leverage object in any shared home.",
      "Put the common room on the desire path: between the door and the bedrooms, so daily life flows through it by default.",
      "Make gathering the path of least resistance: comfortable seats in conversation distance, food storage that's shared, a kitchen open to the room."
    ],
    example: "Fifty years of Danish cohousing runs on one rule of thumb: keep the common meal. The architecture serves the table — cars at the edge, common house in the middle — and the community holds.",
    exampleLink: { label: "Cohousing field guide", href: "type.html?t=cohousing" }
  },
  {
    slug: "local-food-loops",
    want: "Cheaper food, shared work, and a reason to gather",
    tags: ["engineering", "urbanism"],
    moves: [
      "Grow something on site — garden beds, a greenhouse, fruit trees — scaled to the community's actual labour, not its fantasy.",
      "Share the infrastructure: one big kitchen, bulk buying, preserved harvests — food costs drop when the unit is the community, not the household.",
      "Let the harvest be the event: planting days and big cooks are community-building disguised as chores."
    ],
    example: "Ecovillages have run this loop for decades — Findhorn's gardens fed both the residents and the culture. At house scale, even a herb wall changes how a kitchen gets used.",
    exampleLink: { label: "Ecovillage field guide", href: "type.html?t=ecovillage" }
  },
  {
    slug: "zoning-for-both",
    want: "Deep focus and real collaboration under one roof",
    tags: ["design"],
    moves: [
      "Zone the house by behavioural job: rooms that protect heads-down work, rooms that pull people into each other's problems — and never let one leak into the other.",
      "Protect focus with sound discipline: quiet floors, door norms, work hours the space itself signals.",
      "Put the collaboration surfaces — whiteboards, big shared desks — where people already pass, so ideas collide without scheduling."
    ],
    example: "The Montreal house gave every room a job — focus, gathering, rest — so five entrepreneurs could live, work and connect without the three needs cannibalizing each other. [edit]",
    exampleLink: { label: "Montreal house", href: "project.html?p=montreal" }
  }
];
