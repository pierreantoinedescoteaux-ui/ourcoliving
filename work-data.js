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
  eyebrow: "Work & experience",
  titleHtml: "The <em>practice.</em>",
  lede: "A working life in four kinds of work — the jobs, the causes, the houses and the side quests. Most are still being written up; the houses run deepest. Told honestly: what I built, what broke, what it taught me. [edit]"
};

/* ---------------------------------------------------------------------
   CASE STUDY v2 schema (2026-07-22, story-first template):
   top-level (slug/name/kicker/role/summary/pull/hero) unchanged — work.html
   gallery reads those. `story` carries the arc project.html renders:
     open      { body:[…] }                  — where it starts (human scene-setting)
     challenge { body:[…] }                  — the goal + what made it hard
     moves     [ {heading, body, images, layout?, method?{term,note}} ]
                                             — what I did; method = margin teaching note
     outcome   { body, images?, kpis:[…] }   — story first, numbers quiet + secondary
     changed   { body, links }               — learnings / how it changed me
   Any story section may instead carry { prompt:"…" } → renders a gold
   "P-A writes" placeholder card (see WORK_CASE_SCAFFOLDS below).
   ALL copy below = Claude draft from P-A's notes, awaiting his voice ([edit]).
   --------------------------------------------------------------------- */
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
    story: {
      open: {
        body: [
          "I live here. That matters to the story: the Montréal house isn't a project I visited — it's the one I designed from the inside, across three years of Tuesday dinners, morning coworking sessions and the slow learning of what a room actually does to the people in it. [edit]",
          "The house came with gifts — a heritage building with original woodwork, exposed brick, a turning staircase. Into it moved five entrepreneurs: five people who each needed to focus hard, rest well, and still want to find each other at the end of the day. [edit]"
        ]
      },
      challenge: {
        body: [
          "Five entrepreneurs living, working and connecting under one roof — without the three needs cannibalizing each other.",
          "And almost no budget. No renovation, no architect, no furniture spree. When you can't build, you have to think — which turned out to be the best design teacher I've had. [edit]"
        ]
      },
      moves: [
        {
          heading: "Every room got one job",
          body: [
            "The work was reorganization, not construction. I zoned the house so each room carries exactly one behavioral job — focus, gathering, stillness, rest — and privacy and community stopped having to negotiate daily.",
            "The stillness room is the clearest example: it's the one room in the house that does nothing else, and that's exactly why it works. [edit]"
          ],
          method: { term: "Zoning by behavior", note: "Give each room one job, and design it to defend that job. When the space has already decided, people stop negotiating over it." },
          images: [
            { src: "images/mtl-stillness-room.jpg", caption: "The stillness room — the one room in the house with no other job." },
            { src: "images/mtl-coworking.jpg", caption: "The coworking room: one shared desk, everyone's projects in sight." }
          ]
        },
        {
          heading: "Working with the bones",
          body: [
            "The building gave me good bones and I worked with them, not against them. The additions were surgical: a long table sized for formal dinners, a rooftop terrace built out for the summer months, light and plants where rest needed defending.",
            "Most of these moves are now written up as patterns in the Design for Connection room — this house was their laboratory. [edit — name 1-2 more specific moves]"
          ],
          method: { term: "Reading the bones", note: "Before changing anything, ask what the building already wants to be. Heritage woodwork and a turning staircase aren't obstacles — they're the starting material." },
          images: [
            { src: "images/mtl-formal-dinner.jpg", caption: "The long table doing its job — one pan in the middle, everyone leaning in." },
            { src: "images/mtl-patio.jpg", caption: "The rooftop terrace we built out." },
            { src: "images/mtl-staircase.jpg", caption: "The heritage staircase — the bones I designed around." }
          ]
        },
        {
          heading: "Programming the year",
          body: [
            "A floor plan becomes a community through rhythm: coworking sessions, pitch nights, Sunday brunches that slid into music jams, yoga, barbecues — some just for the house, some opened to a wider circle.",
            "The rooms set the stage; the calendar made the culture. [edit]"
          ],
          images: [
            { src: "images/mtl-brunch-jam.jpg", caption: "A Sunday brunch becoming a jam." },
            { src: "images/group-doorway.jpg", caption: "The house, in its doorway." }
          ]
        }
      ],
      outcome: {
        body: [
          "The honest metric: people who could live anywhere kept choosing to stay. Three years in, the house still runs — the long table still fills, and the community has outlasted every version of the calendar that started it. [edit]",
          "The design patterns it produced became the backbone of the Design for Connection room — tested here first, written up there. [edit]"
        ],
        kpis: [
          { label: "Residents", value: "5" },
          { label: "Duration", value: "3 years, ongoing" },
          { label: "Budget", value: "Almost none — on purpose" }
        ]
      },
      changed: {
        body: [
          "This house made me trust that space is a tool you can aim: zone the rooms, and the culture follows.",
          "It also slowed me down. Three years of living inside my own design taught me that the best moves are small, patient and mostly invisible. [edit]"
        ],
        links: [
          { label: "Design for Connection", href: "design.html" },
          { label: "The houses — my story", href: "story.html#houses" }
        ]
      }
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
    story: {
      open: {
        body: [
          "My first house. I was the one finding the building, writing the ads, reading the applications and choosing the six people who would live — and build — together in a home an art collector had already made remarkable. [edit]",
          "This is where I learned the founder's half of the craft, end to end."
        ]
      },
      challenge: {
        body: [
          "Fill a house from zero with six entrepreneurs who would sharpen each other — and make the economics work, including running one room on short-term stays to balance the books. [edit]"
        ]
      },
      moves: [
        {
          heading: "Saying no well",
          body: [
            "Ads I built brought in far more applicants than beds; the job was saying no well. The curation was the real product — six people chosen for how they'd sharpen each other, not just for how they'd pay rent. [edit — the applications number if you have it]"
          ],
          method: { term: "Curation", note: "A community is chosen before it is built. Marketing brings volume; the craft is the filter." },
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
            "Cold plunges, group workouts, barbecues, movie nights — rhythm is what turns co-tenants into a crew. [edit]"
          ],
          images: [
            { src: "images/crew-poolside.jpg", caption: "The crew, poolside. [edit: confirm this is Dunbar]" },
            { scene: "PHOTO WANTED — a strong event shot: cold plunge, group workout, or a full-table dinner at Dunbar." }
          ]
        }
      ],
      outcome: {
        body: [
          "Two businesses were born at that kitchen table, and one of them has passed a hundred thousand in revenue. [edit]",
          "The house still exists. It outlived my tenure — which, by my own definition, is the point. [edit]"
        ],
        kpis: [
          { label: "Residents", value: "6" },
          { label: "Duration", value: "~1 year" },
          { label: "Incubated", value: "2 businesses — one past $100K revenue" }
        ]
      },
      changed: {
        body: [
          "Dunbar gave me the founder's loop end to end — marketing, curation, economics, culture — and the proof that a community I start can keep running without me."
        ],
        links: [
          { label: "That chapter of the story", href: "story.html#houses" },
          { label: "The entrepreneur house — field guide", href: "type.html?t=entrepreneur-house" }
        ]
      }
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
    hero: { src: "images/projects/growth-hub-shaughnessy.jpg", caption: "The Shaughnessy estate — nine bedrooms, a guest house, fourteen thousand square feet." },
    story: {
      open: {
        body: [
          "After Dunbar, the model got a bigger canvas: nine bedrooms, a separate guest house, fourteen thousand square feet to run as one community. [edit]"
        ]
      },
      challenge: {
        body: [
          "Everything that had been informal at six people needed structure at this size — cleaning rhythms, house economics, how decisions get made, who owns the common spaces. Warmth doesn't scale by itself. [edit]"
        ]
      },
      moves: [
        {
          heading: "Building the machinery",
          body: [
            "At three times the size, culture stops being automatic. The work shifted from hosting to systems: rhythms for cleaning and upkeep, clear economics, decision-making that didn't depend on everyone being friends that week. [edit]"
          ],
          method: { term: "Culture with a system", note: "A house with a culture relies on people; a culture with a system survives them. Scale is where the difference shows." },
          images: [
            { scene: "PHOTO WANTED — an interior common space that shows the estate's scale." },
            { scene: "PHOTO WANTED — the grounds or the guest house." }
          ]
        }
      ],
      outcome: {
        body: [
          "It's where I learned the difference between a house with a culture and a culture with a system — and that my operator instincts hold at scale. [edit]"
        ],
        kpis: [
          { label: "Bedrooms", value: "9 + guest house" },
          { label: "Interior", value: "14,000 sq ft" },
          { label: "The lesson", value: "Scale changes the job" }
        ]
      },
      changed: {
        body: [
          "Shaughnessy is the bridge between my houses and the larger communities this site hopes for: scale is exactly where design and systems have to meet."
        ],
        links: [
          { label: "Operator co-living — field guide", href: "type.html?t=operator-coliving" },
          { label: "The manifesto's village", href: "manifesto.html" }
        ]
      }
    }
  }
];

/* ---------------------------------------------------------------------
   CASE STUDY SCAFFOLDS — one per project awaiting P-A's brain dump.
   NOT linked anywhere public (work.html cards stay wip / non-clickable);
   previewable at project.html?p=<slug>. Each section carries a prompt
   describing what P-A should tell — when a brain dump lands, Claude
   turns prompts into body/images and moves the entry up into WORK_CASES.
   --------------------------------------------------------------------- */
const WORK_CASE_SCAFFOLDS = [
  {
    slug: "bridge2ai", name: "Bridge2AI",
    kicker: "Case study · [edit: place · years]", role: "Founder [edit]",
    pull: "",
    hero: { scene: "PHOTO WANTED — you at work on Bridge2AI: a demo, a factory visit, a screen with the product." },
    story: {
      open:      { prompt: "How Bridge2AI started — the moment you decided to build an AI startup in manufacturing, and what the world looked like from there." },
      challenge: { prompt: "What you set out to prove or solve, and what made it genuinely hard (market, tech, timing, being solo…)." },
      moves:     { prompt: "The concrete work: what you built, sold, tried, pivoted. Name the methods (customer discovery, prototyping…) and any numbers you're comfortable sharing." },
      outcome:   { prompt: "What came of it — told honestly, the way the story page tells the hard chapter. KPIs quiet and secondary." },
      changed:   { prompt: "What eighteen honest months of it taught you, and what you carry from it into the houses." }
    }
  },
  {
    slug: "c2-studios", name: "C2 Studios",
    kicker: "Case study · Montréal, QC · [edit: years]", role: "[edit — your role]",
    pull: "",
    hero: { scene: "PHOTO WANTED — a C2 room mid-event: a stage moving, a crowd being moved." },
    story: {
      open:      { prompt: "Arriving at C2 — what the place was, what your job officially was, and what you actually watched for." },
      challenge: { prompt: "What C2 was trying to do to people with its rooms — and your part in making that happen." },
      moves:     { prompt: "The work itself: sales, operations, the rooms that moved mid-event. What you learned to see about engineered experiences." },
      outcome:   { prompt: "What the years produced — for C2, for the events, for you. Numbers secondary." },
      changed:   { prompt: "How two years of rooms-that-move trained your eye for space — the thread that leads to the houses." }
    }
  },
  {
    slug: "mars-my-startr", name: "MaRS Discovery District & My Startr",
    kicker: "Case study · Toronto, ON · [edit: years]", role: "[edit — your role]",
    pull: "",
    hero: { scene: "PHOTO WANTED — you at MaRS or with My Startr participants." },
    story: {
      open:      { prompt: "The scene: Canada's largest innovation hub, youth unemployment, and where you fit in it." },
      challenge: { prompt: "The problem My Startr went after and why it mattered to you." },
      moves:     { prompt: "What you did concretely — programs, cohorts, partnerships. The methods you'd teach someone else." },
      outcome:   { prompt: "Who it reached, what changed for them. Numbers quiet." },
      changed:   { prompt: "What working inside a big institution taught you about building outside one." }
    }
  },
  {
    slug: "reimagine17", name: "ReImagine17",
    kicker: "Case study · Canada · [edit: years]", role: "Co-founder [edit]",
    pull: "",
    hero: { scene: "PHOTO WANTED — the ReImagine17 team or an event; young people at work on the SDGs." },
    story: {
      open:      { prompt: "Co-founding a national nonprofit — how it began, who with, and what you believed." },
      challenge: { prompt: "Empowering young people's work on sustainable development — what stood in the way." },
      moves:     { prompt: "How you built it: the team, the culture of collaboration, the programs. The methods behind the culture." },
      outcome:   { prompt: "The proudest fact — the collaboration culture ran for two years after you stepped away. Tell that story." },
      changed:   { prompt: "What your proudest exit taught you about building things that outlive you." }
    }
  },
  {
    slug: "canyouth", name: "CanYouth Network",
    kicker: "Case study · Canada · [edit: years]", role: "[edit — your role]",
    pull: "",
    hero: { scene: "PHOTO WANTED — CanYouth gathering or advocacy moment." },
    story: {
      open:      { prompt: "The idea: a representative body of youth advising the Canadian government. Where it came from." },
      challenge: { prompt: "What building national youth representation actually required — and what pushed back." },
      moves:     { prompt: "What you did: organizing, structure, outreach. The civic machinery you tried to build." },
      outcome:   { prompt: "How far it got, honestly — attempts count as chapters here." },
      changed:   { prompt: "What trying to organize a country's youth taught you about governance — a thread that runs to how houses decide things." }
    }
  },
  {
    slug: "ocean-bridge", name: "Ocean Bridge",
    kicker: "Case study · Canada · [edit: years]", role: "[edit — your role]",
    pull: "",
    hero: { scene: "PHOTO WANTED — you in the field with Ocean Bridge; coast, water, service project." },
    story: {
      open:      { prompt: "Joining Ocean Bridge — the draw of ocean conservation and service." },
      challenge: { prompt: "What the program set out to do for ocean literacy, and your part in it." },
      moves:     { prompt: "The projects you served on, concretely." },
      outcome:   { prompt: "What the service produced — for the coasts, the communities, you." },
      changed:   { prompt: "What it planted — the ecological thread that shows up later in the manifesto." }
    }
  },
  {
    slug: "alliance", name: "Alliance for Sustainable Development",
    kicker: "Case study · Université Laval, Québec · [edit: years]", role: "Co-founder [edit]",
    pull: "",
    hero: { scene: "PHOTO WANTED — the Alliance in action on campus; a gathering of the member groups." },
    story: {
      open:      { prompt: "The campus, dozens of sustainability groups not talking to each other, and the idea of a shared language (the UN's 17 goals)." },
      challenge: { prompt: "Getting independent groups to act as an alliance — the coordination problem." },
      moves:     { prompt: "How you connected them: the structure, the events, the SDG framing as glue." },
      outcome:   { prompt: "What the alliance made possible that separate groups couldn't." },
      changed:   { prompt: "Your first taste of federating small communities into something bigger — the seed of the village idea." }
    }
  },
  {
    slug: "namchak", name: "Namchak Foundation",
    kicker: "Case study · Montana, US · [edit: years]", role: "[edit — your role]",
    pull: "",
    hero: { scene: "PHOTO WANTED — the retreat land, a practice space, stillness." },
    story: {
      open:      { prompt: "Arriving at Namchak — what brought you to Tibetan Buddhist practice and this community." },
      challenge: { prompt: "What you were there to do — and what you were really there to learn." },
      moves:     { prompt: "The work and the practice: what your days held." },
      outcome:   { prompt: "What grew still, what healed. This one can be almost all story." },
      changed:   { prompt: "How stillness became a design requirement — why every house you've run since has a stillness room." }
    }
  },
  {
    slug: "la-factry", name: "La Factry",
    kicker: "Case study · Montréal, QC · [edit: years]", role: "[edit — your role]",
    pull: "",
    hero: { scene: "PHOTO WANTED — a workshop in motion: sticky notes, people mid-idea." },
    story: {
      open:      { prompt: "La Factry — the school of creativity, and your place in it." },
      challenge: { prompt: "What sparking creativity in a room full of strangers actually takes." },
      moves:     { prompt: "The workshops you facilitated: formats, design-thinking methods, what you'd teach another facilitator." },
      outcome:   { prompt: "What participants left with; what you left with." },
      changed:   { prompt: "How facilitation shaped the way you host — the line from workshop rooms to living rooms." }
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

/* =====================================================================
   WORK gallery — one filterable grid, chips by type (WORK_TYPES order).
   WORK_TYPES = the filter types + their colour key (tints live in work.html).
   WORK_THEMES = the same types, each carrying its cards; work.html flattens
   them into a single uniform-card gallery and filters by type.key.
   Each card: title, org, role, blurb, hero {src}, logo (png, hidden if
   missing), wip. fromCases:true pulls the 3 real houses from WORK_CASES
   (clickable to project.html; type "Coliving projects").
   [edit] = draft copy from P-A's one-liners, awaiting his voice.
   ===================================================================== */
const WORK_TYPES = [
  { key: "work",         name: "Work" },
  { key: "coliving",     name: "Coliving projects" },
  { key: "volunteering", name: "Volunteering" },
  { key: "creative",     name: "Other creative projects" }
];

const WORK_THEMES = [
  {
    name: "Work", key: "work",
    blurb: "Where I earned the craft — building organizations, products and rooms.",
    cards: [
      { slug: "bridge2ai", title: "Bridge2AI", org: "Bridge2AI", role: "Founder [edit]",
        blurb: "Building an AI startup in manufacturing during the AI boom. [edit]",
        hero: { src: "images/projects/bridge2ai.jpg" }, logo: "images/projects/logos/bridge2ai.png", wip: true },
      { slug: "c2-studios", title: "C2 Studios", org: "C2", role: "[edit — your role]",
        blurb: "Building unforgettable experiences that move people and brands. [edit]",
        hero: { src: "images/projects/c2-studios.jpg" }, logo: "images/projects/logos/c2-studios.png", wip: true },
      { slug: "mars-my-startr", title: "MaRS Discovery District & My Startr", org: "MaRS · My Startr", role: "[edit — your role]",
        blurb: "Addressing youth unemployment as part of Canada's largest innovation hub. [edit]",
        hero: { src: "images/projects/my-startr.jpg" }, logo: "images/projects/logos/mars-my-startr.png", wip: true },
      { slug: "reimagine17", title: "ReImagine17", org: "ReImagine17", role: "Co-founder [edit]",
        blurb: "Building a national nonprofit empowering young people's work on sustainable development. [edit]",
        hero: { src: "images/projects/reimagine17.jpg" }, logo: "images/projects/logos/reimagine17.png", wip: true }
    ]
  },
  {
    name: "Coliving projects", key: "coliving",
    blurb: "The houses — found, filled, run and redesigned. My deepest work, written up.",
    fromCases: true
  },
  {
    name: "Volunteering", key: "volunteering",
    blurb: "Where I gave the craft away — to young people, communities and causes.",
    cards: [
      { slug: "canyouth", title: "CanYouth Network", org: "CanYouth", role: "[edit — your role]",
        blurb: "Trying to build a representative body of youth to advise the Canadian government. [edit]",
        hero: { src: "images/projects/canyouth.jpg" }, logo: "images/projects/logos/canyouth.png", wip: true },
      { slug: "ocean-bridge", title: "Ocean Bridge", org: "Ocean Bridge", role: "[edit — your role]",
        blurb: "Advancing ocean conservation and literacy in Canada. [edit]",
        hero: { src: "images/projects/ocean-bridge.jpg" }, logo: "images/projects/logos/ocean-bridge.png", wip: true },
      { slug: "alliance", title: "Alliance for Sustainable Development", org: "AllianceDDUL · Université Laval", role: "Co-founder [edit]",
        blurb: "Co-founding a campus alliance that connected dozens of sustainability groups at Université Laval, using the UN's 17 goals as a shared language. [edit]",
        hero: { src: "images/projects/alliance.jpg" }, logo: "images/projects/logos/alliance.png", wip: true }
    ]
  },
  {
    name: "Other creative projects", key: "creative",
    blurb: "Side quests that shaped how I see practice, stillness and creativity.",
    cards: [
      { slug: "namchak", title: "Namchak Foundation", org: "Namchak", role: "[edit — your role]",
        blurb: "Growing still and healing with Tibetan Buddhist practices. [edit]",
        hero: { src: "images/projects/namchak.jpg" }, logo: "images/projects/logos/namchak.png", wip: true },
      { slug: "la-factry", title: "La Factry", org: "La Factry", role: "[edit — your role]",
        blurb: "Sparking creativity and facilitating design-thinking workshops. [edit]",
        hero: { src: "images/projects/la-factry.jpg" }, logo: "images/projects/logos/la-factry.png", wip: true },
      { slug: "contractor", title: "Various — contractor mode", org: "Independent", role: "Contractor",
        blurb: "Going contractor mode — lending the craft where it was needed. [edit]",
        hero: { src: "images/projects/contractor.jpg" }, wip: true }
    ]
  }
];
