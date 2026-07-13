/* =====================================================================
   WORK ROOM — content layer (work.html index + project.html cases).
   R22 rework, P-A feedback: portfolio was "weak, not curated, doesn't
   tell my full journey skill set wise". Reframed as THE PRACTICE —
   evidence inside the resource, essay voice matching story v2.
   Facts: master story reference + data.js PROJECTS (superseded for
   these pages; data.js untouched for legacy renderers).
   [edit] = Claude draft awaiting P-A's voice.
   Images: src renders a photo (curated set only — dedupe by function);
   no src renders a wanted-placeholder describing the shot to get.
   NOTE: work.html/project.html also load about-data.js and reuse
   ABOUT_TRANSPARENCY + ABOUT_CTA — one source of truth.
   ===================================================================== */

const WORK_INTRO = {
  eyebrow: "Work & case studies",
  titleHtml: "The <em>practice.</em>",
  lede: "Nobody commissioned these houses. I found them, filled them, ran them and redesigned them because I wanted to live in a world where they existed. Three case studies, told honestly — what I built, what broke, what it taught me. [edit]"
};

const WORK_CASES = [
  {
    slug: "montreal",
    name: "The Montréal house",
    kicker: "Case study 01 · Montréal, QC · 2023 – today [edit: confirm dates]",
    role: "Designer & house manager",
    featured: true,
    summary: "Five people, three years, and the house where I finally designed everything myself.",
    pull: "Every room got one job — and the house started doing the work.",
    hero: { src: "images/mtl-living-room.jpg", caption: "The main living room — exposed brick, original beams, rebuilt around gathering." },
    stats: [
      { label: "Residents", value: "5" },
      { label: "Duration", value: "3 years, ongoing" },
      { label: "Budget", value: "Almost none — on purpose" }
    ],
    sections: [
      {
        heading: "The brief I gave myself",
        body: [
          "Five entrepreneurs living, working and connecting under one roof — without the three needs cannibalizing each other. That was the whole brief. No client, no budget to speak of, which turned out to be the best design teacher I've had: when you can't renovate, you have to think.",
          "So the work was reorganization, not construction. Every room got exactly one behavioral job — focus, gathering, stillness, rest — and the house was zoned so privacy and community could both exist without negotiating daily. [edit]"
        ],
        images: [
          { src: "images/mtl-stillness-room.jpg", caption: "The stillness room — the one room in the house with no other job." },
          { src: "images/mtl-coworking.jpg", caption: "The coworking room: one shared desk, everyone's projects in sight." }
        ]
      },
      {
        heading: "The design moves",
        body: [
          "The building gave me good bones — a heritage Montréal house with original woodwork, exposed brick and a turning staircase — and I worked with them, not against them. The additions were surgical: a long table sized for formal dinners, a rooftop terrace built out for the summer months, light and plants where rest needed defending.",
          "Most of these moves are now written up as patterns in the Design for Connection room — this house was their laboratory. [edit — name 1-2 more specific moves]"
        ],
        images: [
          { src: "images/mtl-formal-dinner.jpg", caption: "The long table doing its job — one pan in the middle, everyone leaning in." },
          { src: "images/mtl-patio.jpg", caption: "The rooftop terrace we built out." },
          { src: "images/mtl-staircase.jpg", caption: "The heritage staircase — the bones I designed around." }
        ]
      },
      {
        heading: "Life in it",
        body: [
          "Three years of programming turned a floor plan into a community: coworking sessions, pitch nights, Sunday brunches that slid into music jams, yoga, barbecues — some just for the house, some opened to a wider circle.",
          "The honest metric: people who could live anywhere kept choosing to stay. [edit]"
        ],
        images: [
          { src: "images/mtl-brunch-jam.jpg", caption: "A Sunday brunch becoming a jam." },
          { src: "images/group-doorway.jpg", caption: "The house, in its doorway." }
        ]
      }
    ],
    taught: {
      line: "What this house proved",
      body: "That space is a tool you can aim: zone the rooms, and the culture follows. The patterns it produced live in the design bank; the years around it are in the story.",
      links: [
        { label: "Design for Connection", href: "design.html" },
        { label: "The houses — my story", href: "story.html#houses" }
      ]
    }
  },

  {
    slug: "growth-hub-dunbar",
    name: "Growth Hub — Dunbar",
    kicker: "Case study 02 · Vancouver, BC · 2021 – 2022 [edit: confirm dates]",
    role: "Founder & house manager",
    featured: false,
    summary: "My first house: six entrepreneurs in a home built by an art collector.",
    pull: "Two businesses started at that kitchen table.",
    hero: { src: "images/dunbar-exterior.jpg", caption: "The Dunbar house — the art collector's architecture, inherited." },
    stats: [
      { label: "Residents", value: "6" },
      { label: "Duration", value: "~1 year" },
      { label: "Incubated", value: "2 businesses — one past $100K revenue" }
    ],
    sections: [
      {
        heading: "Starting from zero",
        body: [
          "This is the house where I learned the founder's half of the craft: find the building, write the ads, filter the applications, choose six people who would sharpen each other, and make the economics work — including running one room on short-term stays to balance the books.",
          "The curation was the real product. Ads I built brought in far more applicants than beds; the job was saying no well. [edit — the applications number if you have it]"
        ],
        images: [
          { src: "images/dunbar-deck.jpg", caption: "The deck — where half the house's conversations actually happened." },
          { scene: "PHOTO WANTED — the ad / listing creative that filled the house, or a screenshot of the application pipeline. The unglamorous proof." }
        ]
      },
      {
        heading: "Reading a building I didn't design",
        body: [
          "I couldn't touch the architecture — an art collector had already made it remarkable — so the skill was reading it: which rooms wanted focus, which wanted gathering, where stillness could live. We built a meditation garden to give the house a quiet heart, and set up a coworking space inside it.",
          "Designing from constraints first: I've used that reading-the-bones skill in every house since. [edit]"
        ],
        images: [
          { src: "images/garden-summer.jpg", caption: "The meditation garden in full summer." },
          { src: "images/interior-armchair-art.jpg", caption: "A corner of the collector's house. [edit: confirm this is Dunbar]" }
        ]
      },
      {
        heading: "Keeping it alive",
        body: [
          "Cold plunges, group workouts, barbecues, movie nights — rhythm is what turns co-tenants into a crew. The proof it worked isn't the events, though. It's that two businesses were born at that kitchen table, and one of them has passed a hundred thousand in revenue.",
          "The house still exists. It outlived my tenure — which, by my own definition, is the point. [edit]"
        ],
        images: [
          { src: "images/crew-poolside.jpg", caption: "The crew, poolside. [edit: confirm this is Dunbar]" },
          { scene: "PHOTO WANTED — a strong event shot: cold plunge, group workout, or a full-table dinner at Dunbar." }
        ]
      }
    ],
    taught: {
      line: "What this house proved",
      body: "The founder's loop end to end — marketing, curation, economics, culture — and that a community I start can keep running without me.",
      links: [
        { label: "That chapter of the story", href: "story.html#houses" },
        { label: "The entrepreneur house — field guide", href: "type.html?t=entrepreneur-house" }
      ]
    }
  },

  {
    slug: "growth-hub-shaughnessy",
    name: "Growth Hub — Shaughnessy",
    kicker: "Case study 03 · Vancouver, BC · 2022 [edit: confirm dates]",
    role: "Operations & management",
    featured: false,
    summary: "The scale test: nine bedrooms, a guest house, fourteen thousand square feet.",
    pull: "At three times the size, culture stops being automatic.",
    hero: { scene: "PHOTO WANTED — the Shaughnessy house exterior, wide enough to show the scale. This case study has no photos yet; the estate deserves one good shot minimum." },
    stats: [
      { label: "Bedrooms", value: "9 + guest house" },
      { label: "Interior", value: "14,000 sq ft" },
      { label: "The lesson", value: "Scale changes the job" }
    ],
    sections: [
      {
        heading: "From starting a house to operating one",
        body: [
          "After Dunbar the model got a bigger canvas: nine bedrooms, a separate guest house, fourteen thousand square feet to run as one community. Everything that had been informal at six people needed structure at this size — cleaning rhythms, house economics, how decisions get made, who owns the common spaces.",
          "It's where I learned the difference between a house with a culture and a culture with a system. At three times the size, warmth doesn't scale by itself; you have to build the machinery that carries it. [edit]"
        ],
        images: [
          { scene: "PHOTO WANTED — an interior common space that shows the estate's scale." },
          { scene: "PHOTO WANTED — the grounds or the guest house." }
        ]
      }
    ],
    taught: {
      line: "What this house proved",
      body: "That my operator instincts hold at scale — and that scale is exactly where design and systems have to meet. It's the bridge between my houses and the larger communities this site argues for.",
      links: [
        { label: "Operator co-living — field guide", href: "type.html?t=operator-coliving" },
        { label: "The manifesto's village", href: "manifesto.html" }
      ]
    }
  }
];

/* the journey beyond the houses — same skills, other arenas; links, no duplication */
const WORK_BEYOND = {
  kicker: "The practice, outside the houses",
  intro: "The same craft shows up wherever I've worked — these are the receipts that didn't happen under my own roof.",
  items: [
    { k: "A culture that ran without me", line: "The national nonprofit I co-founded kept its collaboration culture for two years after I stepped away — my proudest exit.", href: "story.html#scale", go: "ReImagine17" },
    { k: "Rooms engineered to move people", line: "Two years at C2, where stages move mid-event — sales and operations officially, a trained eye for space unofficially.", href: "story.html#rooms-that-move", go: "The C2 years" },
    { k: "The machinery, tested elsewhere", line: "CRMs, playbooks, automation, honest revenue numbers — including a startup I wound down after eighteen honest months.", href: "story.html#hard-chapter", go: "That chapter" }
  ]
};
