/* =====================================================================
   CONTENT LAYER  —  edit everything here. Never touch styles to change words.
   - PROJECTS = narrative case studies (architecture-portfolio style).
   - INTENTIONS = design themes shown through space + story (not a skills list).
   - Skills are shown THROUGH the story, never as bullets.
   - For any image: set `src` to a file path. Leave `src: ""` and the page
     shows a labeled placeholder = your photo-gathering checklist.
   - [edit] marks placeholder text Pierre-Antoine should rewrite.
   ===================================================================== */

const SITE = {
  name: "Pierre-Antoine Descoteaux",
  role: "Co-living space designer & community builder",
  tagline: "I design co-living spaces around how people actually live, work, and connect.",
  intro:
    "For the last several years I've built and run co-living houses for entrepreneurs in " +
    "Vancouver and Montreal. My work sits where spatial design meets human behavior: how a " +
    "room invites focus or conversation, how privacy and shared space get balanced, how a " +
    "building's bones can be turned into a community. I don't come from architecture — I come " +
    "from living inside these spaces and shaping them around the people in them. [edit]",
  email: "pierreantoinedescoteaux@gmail.com",

  // Intro line for the Intentions section. Carries the design philosophy +
  // the constraint angle (working with no budget framed as a strength).
  intentionsIntro:
    "I don't design for budget — I design for behavior. Working with existing buildings and " +
    "almost no money, I put every effort where it changed how people actually lived: where they " +
    "found stillness, where they gathered, where they did their best work. [edit]"
};

/* ---- INTENTIONS: design themes, each shown through real spaces ---- */
const INTENTIONS = [
  {
    slug: "mindfulness",
    title: "Mindfulness & stillness",
    body:
      "Every house needs a place that asks nothing of you. In Vancouver I built a Japanese " +
      "meditation garden — a maple, a Buddhist figure, a ring of river stones — and watched it " +
      "hold the same calm through summer, autumn, and snow. Inside, in Montreal, I designed a " +
      "floor-seated room around stillness: low light, plants, tatami, no screens demanding " +
      "attention. These are the spaces that reset a high-output household. [edit]",
    images: [
      { src: "images/garden-summer.jpg", caption: "Meditation garden, summer — Vancouver" },
      { src: "images/garden-autumn.jpg", caption: "The same garden in autumn" },
      { src: "images/garden-winter.jpg", caption: "And under snow" },
      { src: "images/mtl-stillness-room.jpg", caption: "Floor-seated stillness room — Montreal" }
    ]
  },
  {
    slug: "community",
    title: "Community & gathering",
    body:
      "The thing I'm proudest of isn't a room — it's that strangers became a household. I " +
      "programmed the social life that did it: brunches, live-music nights, sports, big dinners — " +
      "some internal to the house, some opened to a wider circle. The spaces were designed to make " +
      "gathering the path of least resistance. [edit — name the recurring events you ran]",
    images: [
      { src: "images/mtl-brunch-jam.jpg", caption: "A brunch jam session — Montreal" },
      { src: "images/mtl-formal-dinner.jpg", caption: "One of the house dinners" },
      { src: "images/music-piano-night.jpg", caption: "Music night" },
      { src: "images/crew-poolside.jpg", caption: "The house, off the clock — Vancouver" }
    ]
  },
  {
    slug: "work",
    title: "Focused & collaborative work",
    body:
      "These are houses of entrepreneurs, so the spaces have to hold two opposite needs: heads-down " +
      "focus and real collaboration. I zoned for both — quiet rooms that protect deep work, shared " +
      "tables and whiteboards that pull people into each other's problems — so the house itself " +
      "pushed everyone's goals forward. [edit — coworking sessions, pitch nights, brainstorms]",
    images: [
      { src: "images/mtl-coworking.jpg", caption: "The coworking room — shared desks under a heritage ceiling" },
      { src: "images/mtl-bookshelf.jpg", caption: "A quieter corner for focused, solo work" }
    ]
  }
];

const PROJECTS = [
  {
    slug: "montreal",
    name: "Montreal Co-living House", // [edit] — does this house have a name?
    location: "Montreal, QC",
    years: "2023 – present",
    role: "Designer & House Manager",
    featured: true,
    summary:
      "A five-person co-living house I've designed and run for three years — the project where I " +
      "did the most hands-on spatial design and rebuilding.",
    hero: "images/mtl-living-room.jpg",
    heroCaption: "The main living room — exposed brick, original beams, redesigned around gathering",
    stats: [
      { label: "Residents", value: "5" },
      { label: "Duration", value: "3 years, ongoing" },
      { label: "My role", value: "Design + rebuild + operations" }
    ],
    sections: [
      {
        heading: "The intention",
        body:
          "This is the house where I got to design from the inside out. Over three years I reshaped " +
          "the space around a single question: how do you let five entrepreneurs live, work, and " +
          "connect under one roof without the three needs cannibalizing each other? Every room got " +
          "a behavioral job — focus, gathering, rest — and the house was segmented so privacy and " +
          "community could both exist. With almost no budget, the work was in reorganizing and " +
          "reusing what was already there, not renovating. [edit — name the specific design moves]",
        images: [
          { src: "images/mtl-bedroom.jpg", caption: "A private room designed for rest — light, plants, calm" },
          { src: "images/mtl-lounge.jpg", caption: "The lounge — books, music, a place to gather" }
        ]
      },
      {
        heading: "The spaces",
        body:
          "The building gave me good bones: a heritage Montreal house with original woodwork, exposed " +
          "brick, and a turning staircase. I worked with the architecture rather than against it, and " +
          "added what the house was missing — a rooftop terrace for the long summer evenings. [edit]",
        images: [
          { src: "images/mtl-staircase.jpg", caption: "The original heritage staircase" },
          { src: "images/mtl-patio.jpg", caption: "The rooftop terrace we built out" }
        ]
      },
      {
        heading: "Life in the house",
        body:
          "Three years of programming turned a house into a community: coworking sessions, pitch " +
          "nights, brunches, music jams, yoga, barbecues, and larger parties — some internal to the " +
          "house, some opened up to a wider circle. [edit]",
        images: [
          { src: "images/group-doorway.jpg", caption: "Residents in the heritage doorway" },
          { src: "images/mtl-brunch-jam.jpg", caption: "A Sunday brunch jam" }
        ]
      }
    ]
  },

  {
    slug: "growth-hub-dunbar",
    name: "Growth Hub — Dunbar",
    location: "Vancouver, BC",
    years: "[edit: years]",
    role: "Founder & House Manager",
    featured: false,
    summary:
      "The first house I built and ran: six entrepreneurs in a large Dunbar home originally built " +
      "by an art collector, turned into a living-and-working community.",
    hero: "images/dunbar-exterior.jpg",
    heroCaption: "The Dunbar house — the original art-collector architecture",
    stats: [
      { label: "Residents", value: "6" },
      { label: "Duration", value: "~1 year+" },
      { label: "My role", value: "Founder + operations + marketing" }
    ],
    sections: [
      {
        heading: "The space",
        body:
          "A large house in Dunbar with an unusual pedigree — originally built by an art collector, " +
          "full of distinctive architectural elements. I didn't design the building, but the work was " +
          "in reading it: figuring out how its existing bones could host focused work, shared living, " +
          "and events. The meditation garden was one of the things we built to give the house a place " +
          "of stillness. [edit]",
        images: [
          { src: "images/garden-summer.jpg", caption: "The meditation garden we built" },
          { src: "images/interior-armchair-art.jpg", caption: "A curated corner of the house [edit: confirm this is Dunbar]" }
        ]
      },
      {
        heading: "Building the community",
        body:
          "I assembled the group of entrepreneurs, set up a coworking space inside the house, ran the " +
          "ads and marketing that filled it, and managed short-term stays through Airbnb for one of the " +
          "rooms. We lived there together for a little over a year. Events kept it alive: cold plunges, " +
          "group workouts, barbecues, dinners, movie nights. [edit]",
        images: [
          { src: "", caption: "a strong event photo (cold plunge / BBQ / dinner)" },
          { src: "", caption: "the ad / listing creative you made for the house" }
        ]
      }
    ]
  },

  {
    slug: "growth-hub-shaughnessy",
    name: "Growth Hub — Shaughnessy",
    location: "Vancouver, BC",
    years: "[edit: years]",
    role: "House Manager",
    featured: false,
    summary:
      "Scaling the model into a 14,000 sq ft estate: nine bedrooms plus a guest house on the property.",
    hero: "",
    heroCaption: "PHOTO NEEDED: Shaughnessy house — exterior showing the scale",
    stats: [
      { label: "Bedrooms", value: "9 + guest house" },
      { label: "Interior", value: "14,000 sq ft" },
      { label: "My role", value: "Operations + management" }
    ],
    sections: [
      {
        heading: "Scaling up",
        body:
          "After Dunbar, a much larger house: nine bedrooms, a separate guest house, and 14,000 square " +
          "feet of interior to run as one community. The challenge shifted from starting a house to " +
          "operating one at scale — more people, more space, more to coordinate. [edit]",
        images: [
          { src: "", caption: "an impressive interior / common space" },
          { src: "", caption: "the grounds or guest house" }
        ]
      }
    ]
  }
];

/* =====================================================================
   STORY  —  the personal timeline (its own tab).
   - Each entry has `bubbles` (the zoomed-out, high-level story) and an
     optional `detail` (the zoomed-in, step-by-step story shown on click).
   - photo: "" + graphic: true  -> shows a designed geometric mark.
   - photo: "" + no graphic      -> shows a "to add" placeholder (gather it).
   ===================================================================== */
const STORY = {
  intro:
    "Five years, four houses, and one idea that kept getting sharper: the right space can turn a " +
    "group of strangers into a community.",
  entries: [
    {
      slug: "2020-vancouver",
      year: "2020",
      title: "Moving to Vancouver",
      media: [
        { src: "images/first-house-front.jpg", caption: "The first house — where I lived, before I built my own" },
        { src: "images/first-house-yard.jpg", caption: "Its backyard" }
      ],
      bubbles: [
        "I moved to Vancouver and into a shared house. It gave me something I didn't know I was " +
        "missing — a real sense of community. But it wasn't built around like-minded people, and " +
        "that gap is what started everything. [edit]"
      ]
    },
    {
      slug: "2021-dunbar",
      year: "2021",
      title: "Growth Hub — my first house",
      media: [
        { src: "images/dunbar-exterior.jpg", caption: "The Dunbar house" },
        { src: "images/crew-poolside.jpg", caption: "The first crew" }
      ],
      bubbles: [
        "So the next year, I built my own. I brought five other entrepreneurs into a big house in " +
        "Dunbar, carved a coworking space out of it, and made it a home. [edit]",
        "We had a great time — a constant rhythm of events, creatives, and people pushing each " +
        "other forward. [edit]"
      ],
      detail: {
        summary:
          "Turning a rented house into a community of entrepreneurs — from a story and a stack of " +
          "applications to a full calendar of events.",
        steps: [
          {
            heading: "Telling the story",
            body:
              "It started as a story. I wrote up the vision for the house and built ads around it — " +
              "and around 200 people applied to live there. That let me actually curate the group: " +
              "five entrepreneurs who'd push each other. [edit]",
            images: [
              { src: "images/dunbar-front.jpg", caption: "The house I pitched" },
              { src: "", caption: "an ad / listing you made for the house" }
            ]
          },
          {
            heading: "Getting the space together",
            body:
              "Then the unglamorous part: cleaning, furnishing, and carving a real coworking space " +
              "out of a house that was never built for it. We even built a Japanese meditation " +
              "garden for the quiet end of the day. [edit]",
            images: [
              { src: "images/garden-summer.jpg", caption: "The meditation garden we built" },
              { src: "images/dunbar-deck.jpg", caption: "The shoji-screen deck pavilion" }
            ]
          },
          {
            heading: "Hosting events",
            body:
              "Then we filled it with life: cold plunges, group workouts, barbecues, dinners, movie " +
              "nights — the rituals that turned six people into a household. [edit]",
            images: [
              { src: "images/dunbar-pool.jpg", caption: "The pool deck — where a lot of the hangouts happened" },
              { src: "", caption: "a strong event photo (cold plunge / BBQ / dinner)" }
            ]
          }
        ]
      }
    },
    {
      slug: "2022-shaughnessy",
      year: "2022",
      title: "Growth Hub — Shaughnessy",
      media: [
        { src: "", caption: "Shaughnessy house — exterior showing the scale" }
      ],
      bubbles: [
        "The model grew into a much bigger house in Shaughnessy — nine bedrooms, a guest house, and " +
        "14,000 square feet to run as one community. [edit]"
      ],
      detail: {
        summary: "Scaling the same idea into an estate — and learning what changes when a house gets big.",
        steps: [
          {
            heading: "Operating at scale",
            body:
              "The challenge shifted from starting a house to running one at scale: more people, more " +
              "space, more coordination — and keeping the sense of community intact through all of " +
              "it. [edit]",
            images: [
              { src: "", caption: "an impressive interior / common space" }
            ]
          }
        ]
      }
    },
    {
      slug: "2023-montreal",
      year: "2023",
      title: "The Montreal House",
      media: [
        { src: "images/mtl-living-room.jpg", caption: "The Montreal house, redesigned" },
        { src: "images/mtl-brunch-jam.jpg", caption: "A Sunday brunch jam" }
      ],
      bubbles: [
        "I handed the Vancouver house to Paul — one of the first residents, and a good friend — and " +
        "moved to Montreal to start again. This time, I designed the space myself. [edit: confirm year]"
      ],
      detail: {
        summary:
          "A house I didn't just run, but designed and rebuilt — and where I experimented with how a " +
          "co-living house should actually be managed.",
        steps: [
          {
            heading: "A new way to run a house",
            body:
              "Montreal became the place to experiment with management itself — testing models from " +
              "fully collaborative to more centralized, and learning what each does to how people " +
              "live together. [edit]",
            images: []
          },
          {
            heading: "Designing the space",
            body:
              "I furnished the place from scratch and ran a round of renovations — reshaping rooms " +
              "around how people actually live, work, and rest. [edit]",
            images: [
              { src: "", caption: "BEFORE — a room before the redesign" },
              { src: "", caption: "AFTER — the same room redesigned" }
            ]
          },
          {
            heading: "Building the community",
            body:
              "And then the part I love most: filling it with people. Brunch jams, pitch nights, " +
              "music, dinners — the events the house is known for. [edit]",
            images: [
              { src: "images/mtl-brunch-jam.jpg", caption: "A Sunday brunch jam" }
            ]
          }
        ]
      }
    }
  ]
};

/* =====================================================================
   HOPE  —  the vision / manifesto subpage (hope.html).
   Visual-first, low text. Each chapter pairs a generated geometric form
   with a few lines. The forms progress: alone -> scattered -> connected
   -> village. Rewrite anything marked [edit] in your own voice.
   ===================================================================== */
const HOPE = {
  eyebrow: "Where this is going",
  thesis: "We have never been more connected, or more alone. I think the answer is in how — and with whom — we live.",
  lede:
    "This is the throughline behind every house I've built, and the reason I want to build " +
    "something bigger. [edit]",
  chapters: [
    {
      form: "alone",
      kicker: "01 — Alone",
      title: "I had everything I needed, and still felt alone.",
      body:
        "I lived by myself. Independent, comfortable, free — and quietly isolated. Something " +
        "essential was missing, and I couldn't name it yet. [edit]"
    },
    {
      form: "scattered",
      kicker: "02 — Among strangers",
      title: "People nearby isn't the same as community.",
      body:
        "So I moved in with others. The loneliness lifted — but the house wasn't built on " +
        "anything. No shared direction, no glue. Proximity without purpose. [edit]"
    },
    {
      form: "connected",
      kicker: "03 — Among the like-minded",
      title: "Then I found my people.",
      body:
        "Builders, growth-minded, ambitious in the same direction. I learned more and grew more — " +
        "personally and professionally — than in any other years of my life. The space is what " +
        "made it happen. [edit]"
    },
    {
      form: "village",
      kicker: "04 — The dream",
      title: "Now I want to build it at the scale of a village.",
      body:
        "Co-living communities for an age where isolation runs deepest and division keeps rising. " +
        "We fight back with community — and with space. Because architecture and urbanism quietly " +
        "shape how we behave, who we meet, and who we become. [edit]"
    }
  ],
  journeyLabel: "How I found the answer",
  crises: {
    eyebrow: "Why now",
    intro: "This isn't nostalgia for the village. It's four crises, all pointing the same way — toward how, and with whom, we live.",
    items: [
      { stat: 871000, decimals: 0, suffix: "",
        statLabel: "deaths a year linked to loneliness — roughly one every hour (WHO, 2024).",
        kicker: "01 — Disconnection",
        title: "We are lonelier than we have ever been.",
        body: "Cut off from each other, from purpose, from nature. The things that used to bind us — faith, neighbourhood, the third place — are thinning out for the young, who were promised connection through a screen and handed isolation instead.",
        facts: [
          "Chronic loneliness raises the risk of early death about as much as smoking 15 cigarettes a day, and dementia risk by roughly 50% (US Surgeon General, 2023).",
          "44% of 18–29-year-olds now claim no religion, up from 16% a generation ago (Pew, 2025).",
          "Heavy social-media users are twice as likely to feel socially isolated (US Surgeon General, 2023)."
        ] },
      { stat: 61, decimals: 0, suffix: "%",
        statLabel: "of people in care homes are lonely — the place meant to care for our elders isolates them.",
        kicker: "02 — Our elders, sidelined",
        title: "A generation full of life, left in a dead end.",
        body: "Elders rich in skill, story and time are warehoused and unvalued — inactive, isolated, and quietly expensive. We lose their wisdom, then pay for the loss in health costs.",
        facts: [
          "35% of care-home residents are severely lonely (Altarum, 2023).",
          "Social isolation adds an estimated $6.7 billion a year in health spending on older adults — about $1,600 each (AARP / Stanford)."
        ] },
      { stat: 12.3, decimals: 1, suffix: "×",
        statLabel: "a median income — what a home costs in Vancouver, the world's 2nd least affordable city. My own country is among the worst.",
        kicker: "03 — Nowhere we can afford",
        title: "A home is slipping out of reach.",
        body: "Across the rich world, housing has outrun incomes. Canada's affordability has fallen further this past decade than almost anywhere — and going it alone, one household to one overpriced home, is part of what makes it impossible.",
        facts: [
          "OECD home prices rose 37% in real terms in a single decade (IMF, 2024).",
          "Canada's price-to-income ratio worsened by 40.8 points — 2nd worst in the OECD (IMF, 2024).",
          "Toronto sits at 9.3× income; 'affordable' is 3× or below (Demographia, 2024)."
        ] },
      { stat: 40, decimals: 0, suffix: "%",
        statLabel: "of jobs worldwide are exposed to AI — forcing a hard question about what a human life is for.",
        kicker: "04 — What are we for?",
        title: "AI is rewriting work, and meaning with it.",
        body: "As machines take the tasks, we're left to ask what's actually ours to do. If meaning won't come from a job title, it has to come from somewhere — and for most of human history, it came from each other.",
        facts: [
          "60% of jobs in advanced economies are exposed to AI (IMF, 2024).",
          "92 million roles displaced by 2030, and 39% of today's skills outdated (World Economic Forum, 2025)."
        ] }
    ],
    close: {
      kicker: "The answer we already have",
      body: "The longest study ever run on human happiness has followed the same lives for 85 years. Its finding isn't wealth, or fame, or work.",
      quote: "Good relationships keep us happier and healthier. Period.",
      cite: "Robert Waldinger · Harvard Study of Adult Development",
      kicker2: "We know this. We just haven't built our lives — or our buildings — around it. That's the work."
    }
  },
  close: {
    line: "I'm looking to design and build the places that pull us back toward each other.",
    cta: "Let's build it"
  }
};

/* =====================================================================
   INSPIRATION  —  the reference library behind the vision (inspiration.html).
   Three groups of cards. Each card uses a generated geometric mark
   (no photos needed). All facts researched + verified 2026-06-30.
   Swap, trim, or add your own — [edit] freely.
   ===================================================================== */
const INSPIRATION = {
  eyebrow: "Inspiration",
  title: "The work, places, and ideas that shape how I think about living together.",
  lede:
    "A working library behind the vision — the thinkers, projects, and models I keep coming " +
    "back to. Cards marked with a case study go deeper. [edit: add your own, cut what doesn't fit]",
  groups: [
    {
      key: "books",
      label: "Books & thinkers",
      items: [
        { slug: "everyday-utopia", img: "images/book-everyday-utopia.jpg", title: "Everyday Utopia", meta: "Kristen R. Ghodsee · 2023",
          note: "A 2,000-year history of communal living that reframes the private single-family home as a recent blip — and shows that designing for shared life is recovering an old idea, not risking a new one." },
        { img: "images/book-death-life.jpg", title: "The Death and Life of Great American Cities", meta: "Jane Jacobs · 1961",
          note: "Proof that community comes from density, mixed use, and casual street-level encounter — the logic behind shared corridors, ground-floor commons, and the accidental contact private apartments kill." },
        { img: "images/book-pattern-language.jpg", title: "A Pattern Language", meta: "Christopher Alexander · 1977",
          note: "253 spatial patterns for human community — 'Common Land,' 'Communal Eating,' 'Entrance Transition' — a working vocabulary for where shared life belongs in a building." },
        { img: "images/book-great-good-place.jpg", title: "The Great Good Place", meta: "Ray Oldenburg · 1989",
          note: "Coined the 'third place': the informal gathering spot that isn't home or work. A co-living commons open to neighbours is exactly this idea, built in concrete." },
        { img: "images/book-happy-city.jpg", title: "Happy City", meta: "Charles Montgomery · 2013",
          note: "Urban psychology showing that walkable, encounter-rich, mixed-use places measurably raise happiness — the data behind the claim that co-living's model is good for mental health." },
        { img: "images/book-village-effect.jpg", title: "The Village Effect", meta: "Susan Pinker · 2014",
          note: "Face-to-face community predicts lifespan as strongly as not smoking. The biological case that proximity to people is a health intervention, not a lifestyle choice." },
        { img: "images/book-palaces.jpg", title: "Palaces for the People", meta: "Eric Klinenberg · 2018",
          note: "Coined 'social infrastructure' — the physical spaces that decide how often people meet. Co-living is social infrastructure at the most intimate scale there is." },
        { title: "The More Beautiful World Our Hearts Know Is Possible", meta: "Charles Eisenstein · 2013",
          note: "The philosophical backbone of this site's manifesto: the Story of Separation we were handed, and the Story of Interbeing underneath it. Read the talk piece it inspired on the Manifesto page." }
      ]
    },
    {
      key: "projects",
      label: "Projects around the world",
      items: [
        { slug: "rooral", img: "images/rooral-hero.jpg", title: "Rooral", meta: "Benarrabá, Spain · est. 2020",
          note: "A rural co-living in Andalusia that pairs young remote workers with village elders — each teaching the other — reviving Spanish pueblos while breaking the generational divide." },
        { img: "images/proj-narkomfin.jpg", title: "Narkomfin Building", meta: "Moscow, Russia · 1932",
          note: "Ginzburg's constructivist block paired tiny private cells with a shared kitchen, gym and library — the direct ancestor of every co-living building that trades private space for pooled amenity." },
        { img: "images/proj-trudeslund.jpg", title: "Sættedammen", meta: "Hillerød, Denmark · 1972",
          note: "The world's first modern cohousing community: private homes around a common house, residents designing the whole thing together before moving in. The template the world still copies." },
        { title: "LILAC", meta: "Leeds, UK · 2013",
          note: "Strawbale cohousing with a mutual-ownership model that locks affordability in against the market — social, ecological and cooperative in a single project." },
        { img: "images/proj-mehralswohnen.jpg", title: "Mehr als Wohnen", meta: "Zurich, Switzerland · 2015",
          note: "Around 50 housing co-ops built a 1,200-person, 13-building community with no private developer — proof that cooperative housing works at full neighbourhood scale." },
        { title: "Nightingale Housing", meta: "Melbourne, Australia · 2016",
          note: "Architect-led and sold at cost to residents, not investors — no car parking, shared roofs and gardens, designed for long-term community over resale value." },
        { img: "images/proj-collective.jpg", title: "The Collective Old Oak", meta: "London, UK · 2016",
          note: "Once Europe's largest purpose-built co-living: 551 micro-rooms plus heavy shared amenity. The commercial-scale benchmark — and a cautionary tale, since the operator folded in 2021." }
      ]
    },
    {
      key: "models",
      label: "Models & concepts",
      items: [
        { slug: "danish-cohousing", title: "Danish Bofællesskab (Cohousing)", meta: "Denmark · since 1972",
          note: "Private units around a common house with shared weekly meals. The proof that community doesn't cost you privacy — you design deliberately for both." },
        { title: "Baugruppen", meta: "Berlin & Tübingen, Germany",
          note: "Future residents hire the architect and co-finance the build — 25–35% cheaper, and the act of building together creates the community before anyone moves in." },
        { img: "images/model-kalkbreite.jpg", title: "Zurich Housing Cooperatives", meta: "Zurich, Switzerland",
          note: "Around a fifth of the city lives in co-ops with democratic governance and permanently below-market rents — community housing treated as civic infrastructure." },
        { img: "images/model-findhorn.jpg", title: "Ecovillages", meta: "Findhorn, Scotland & Tamera, Portugal",
          note: "Communities that co-design settlement, economy and ecology together — sustaining dense, multi-generational social life on a fraction of the footprint." },
        { img: "images/model-kibbutz.jpg", title: "Kibbutz", meta: "Israel · since 1910",
          note: "A century of shared dining, childcare and economy — the longest-running proof that shared infrastructure builds a resilience private households can't reach." }
      ]
    }
  ]
};

/* =====================================================================
   DETAILS  —  case-study subpages (detail.html?item=<slug>).
   One reusable template, three kinds: Book, Project, Model. Each has a
   hero, a lede, body blocks (text + optional image + optional quote),
   and a "What I take from it" list. Add more items with new slugs.
   Rooral content is built from their real site (rooral.co); prose is
   embellished. [edit] = rewrite in your own voice.
   ===================================================================== */
const DETAILS = {
  "everyday-utopia": {
    kind: "Book",
    markCat: "books",
    title: "Everyday Utopia",
    meta: "Kristen R. Ghodsee · 2023",
    hero: "images/proj-narkomfin.jpg",
    heroCaption: "The Narkomfin Building, Moscow (1932) — the kind of bold experiment in shared living the book traces across history.",
    lede:
      "A sweeping history of how humans have actually organised home and family — and proof that " +
      "the isolated single-family household is a recent invention, not a law of nature.",
    blocks: [
      { heading: "The argument",
        body:
          "Ghodsee, an ethnographer, walks through two thousand years of real experiments in living " +
          "differently: monasteries and béguinages, communes, kibbutzim, shared kitchens, collective " +
          "childcare, modern cohousing. Her claim is simple and radical — the way most of us live now, " +
          "each family sealed in its own home doing its own unpaid domestic labour, is a historical " +
          "blip, and often a worse deal than the arrangements people have tried before.",
        image: "images/model-kibbutz.jpg",
        caption: "A kibbutz communal dining hall — collective living sustained for a century, one of the book's living examples." },
      { heading: "Not fringe — recurring",
        body:
          "From medieval béguinages to the kibbutz to today's cohousing, Ghodsee shows these aren't " +
          "fringe utopias. They're recurring, workable answers that mainstream life keeps forgetting — " +
          "and rediscovering, usually in a crisis.",
        image: "images/proj-trudeslund.jpg",
        caption: "Danish cohousing — the utopian idea, made completely ordinary." },
      { heading: "Why it sits behind my work",
        body:
          "It reframes co-living not as a lifestyle trend but as a return to something older and more " +
          "workable. The book gives language to what I've felt building houses: that sharing space, " +
          "meals and care isn't a compromise on the good life — for most of human history it simply " +
          "was the good life. [edit — add your own reaction]",
        image: "images/model-findhorn.jpg",
        caption: "Findhorn ecovillage, Scotland — designing the home, the economy and the ecology together." }
    ],
    takeaways: [
      "The private single-family home is recent, not inevitable — which means it can be redesigned.",
      "Shared domestic life — kitchens, childcare, care work — has a long, successful track record.",
      "Designing for community is recovering an old idea, not gambling on a risky new one."
    ]
  },

  "rooral": {
    kind: "Project",
    title: "Rooral",
    meta: "Benarrabá, Andalusia, Spain",
    hero: "images/rooral-hero.jpg",
    heroCaption: "Remote workers living village life in Benarrabá, in the mountains of Málaga.",
    lede:
      "A co-living in the white villages of Andalusia that does something rare: it puts young remote " +
      "workers and village elders into the same story — and lets each teach the other what they're missing.",
    link: { label: "Visit rooral.co", url: "https://www.rooral.co/about-us" },
    blocks: [
      { heading: "Two crises, one answer",
        body:
          "Spain has Europe's widest gap between its cities and its countryside; half its villages are " +
          "losing people. At the same time, a generation of remote workers is more connected and more " +
          "isolated than ever. Rooral's founder, Juan Barbed, grew up believing success meant leaving " +
          "the pueblo — until his grandmother's death drew him back to a village whose warmth and wisdom " +
          "the city had never offered. Rooral is his answer to both crises at once.",
        image: "images/rooral-landscape.jpg",
        caption: "The Andalusian mountains around the village.",
        quote: "For generations, we've been told that to succeed, we had to leave the village. Perhaps to remember things we forgot, we need to return." },
      { heading: "How it works",
        body:
          "In Benarrabá, residents live in village houses with a real coworking space and fast fibre, " +
          "and they stay for extended periods rather than passing through. The structure is non-profit — " +
          "surplus flows back into village projects — so residents arrive as contributors, not tourists. " +
          "Remote workers spend on average around €1,500 a month locally, and the village feels it.",
        image: "images/rooral-coworking.jpg",
        caption: "The coworking space, a short walk from the houses." },
      { heading: "The exchange that breaks the divide",
        body:
          "This is the heart of it. The village elders — the pueblo abuelas — teach goat's-cheese making, " +
          "basket weaving, cork, cooking and the ecology of the land. The young residents teach coding to " +
          "local children, run CV workshops, and document village life in film and photography. The mayor " +
          "holds a title the project invented for him — Village Guardian — and everyone meets at the " +
          "communal Monday dinner. Two generations who would never otherwise cross paths end up needing " +
          "each other.",
        image: "images/rooral-dinner.jpg",
        caption: "A communal dinner — goat's cheese and the whole table, in Benarrabá." },
      { heading: "Why it moves me",
        body:
          "Most co-living bonds people who are already alike. Rooral bonds people across the widest gap " +
          "there is — age, culture, the digital divide — and makes the village itself the thing that " +
          "heals. It's the clearest proof I've found that bringing young people back into rural " +
          "communities can revive both at once. [edit — make this yours]",
        image: "images/rooral-portraits.jpg",
        caption: "Faces from the surrounding villages." }
    ],
    takeaways: [
      "Designs an exchange both sides genuinely need — the elders' craft and presence, the young's skills and energy.",
      "Reverses rural decline by making the village a destination for the young, not just a place they leave.",
      "Proves the right rituals — a shared Monday dinner, a 'Village Guardian' — can bond people across generations and cultures."
    ]
  },

  "danish-cohousing": {
    kind: "Model",
    title: "Danish Cohousing",
    meta: "Bofællesskab · Denmark, since 1972",
    hero: "images/proj-trudeslund.jpg",
    heroCaption: "Trudeslund cohousing, Birkerød — a classic Danish bofællesskab of private homes around shared ground.",
    lede:
      "The template the whole world copies: private homes arranged around a shared common house, with " +
      "residents who design the community together before they ever move in.",
    link: { label: "Read about cohousing", url: "https://en.wikipedia.org/wiki/Cohousing" },
    blocks: [
      { heading: "What it is",
        body:
          "Bofællesskab means, roughly, 'living community.' Born in 1972 at Sættedammen, the model pairs " +
          "full private homes with a common house holding a shared kitchen, dining room, laundry and " +
          "spaces for children. Residents typically cook and eat together a few times a week — optional, " +
          "never forced. The private home stays completely private; the shared life is added on top." },
      { heading: "How it works day to day",
        body:
          "Communities govern themselves, usually by consensus. Cooking and chores rotate. A common meal " +
          "you can opt into on a Tuesday means you're never alone unless you want to be — and never " +
          "crowded unless you choose it. The design does the social work that good intentions alone can't." },
      { heading: "Why it's the reference",
        body:
          "It solves the exact problem I care about: community without surrendering privacy, because both " +
          "are designed in from the very start rather than left to chance. Fifty years on, more than 700 " +
          "communities worldwide trace back to this Danish model — the proof that it scales and that it lasts." }
    ],
    takeaways: [
      "Private home plus common house = community and privacy, both deliberately designed for.",
      "Residents co-design before move-in, so the social fabric already exists on day one.",
      "Fifty years and 700+ communities prove the model scales and endures."
    ]
  }
};

/* =====================================================================
   ABOUT  —  the about / contact section on the home page.
   Portrait + short bio + a few candid photos. [edit] the bio in your voice.
   ===================================================================== */
const ABOUT = {
  portrait: "images/about-portrait.jpg",
  lead: "I'm Pierre-Antoine — I design co-living spaces around how people actually live, work, and connect.",
  body:
    "For the last several years I've built and run houses in Montreal and Vancouver where strangers " +
    "become a community. I don't come from architecture — I come from living inside these places and " +
    "shaping them around the people in them. [edit — make this yours]",
  gallery: ["images/about-1.jpg", "images/about-2.jpg", "images/about-3.jpg"]
};
