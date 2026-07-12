/* =====================================================================
   MAP CONTENT LAYER — the co-living atlas backend.
   - MAP_PROPS   = the 8 scored properties (any two can become the axes)
   - MAP_PRESETS = curated axis pairings
   - COLIVING_TYPES = the 12 mapped types. scores are 0–100 on each prop.
     Positions are editorial reads, not census data — tune freely.
   - [edit] marks copy P-A should put in his own voice.
   ===================================================================== */

const MAP_PROPS = {
  ecoTech: {
    label: "Ecology ↔ Technology",
    low: "Ecological", high: "Tech-driven",
    blurb: "What the community organizes its life around."
  },
  centralization: {
    label: "Grassroots ↔ Institutional",
    low: "Grassroots", high: "Institutional",
    blurb: "Who holds the power — the residents, or an operator / institution."
  },
  financing: {
    label: "Self-funded ↔ Capital-backed",
    low: "Self-funded", high: "Capital-backed",
    blurb: "Where the money comes from."
  },
  difficulty: {
    label: "Easy ↔ Hard to build",
    low: "Start this year", high: "Zoning, capital, decades",
    blurb: "How hard it is to actually make one exist."
  },
  independence: {
    label: "Communal ↔ Private",
    low: "Deeply communal", high: "High privacy",
    blurb: "How much of daily life is shared."
  },
  scale: {
    label: "Household ↔ Village",
    low: "A household", high: "A village",
    blurb: "How many people live the model together."
  },
  permanence: {
    label: "Come-and-go ↔ For life",
    low: "Come & go", high: "For life",
    blurb: "How long people typically stay."
  },
  cost: {
    label: "Affordable ↔ Premium",
    low: "Affordable", high: "Premium",
    blurb: "The price of a seat at the table."
  }
};

const MAP_PRESETS = [
  { name: "The classic",   x: "ecoTech",     y: "centralization" },
  { name: "Hard mode",     x: "difficulty",  y: "cost" },
  { name: "Shape of life", x: "independence", y: "permanence" },
  { name: "Money & power", x: "financing",   y: "centralization" }
];

const COLIVING_TYPES = [
  {
    slug: "ecovillage",
    name: "Ecovillage",
    short: "Ecovillage",
    tagline: "A whole settlement designed around living lightly — food, energy, governance, everything.",
    scores: { ecoTech: 8, centralization: 18, financing: 15, difficulty: 88, independence: 30, scale: 85, permanence: 90, cost: 35 },
    body: [
      "The maximalist answer. An ecovillage doesn't just share a kitchen — it rebuilds the entire stack of daily life around regeneration: growing food, producing energy, consensus governance, often its own economy.",
      "It's also the deepest commitment on this map. The successful ones took decades and survived on stubbornness. But nothing else produces the same depth of belonging."
    ],
    who: "People ready to make community the main project of their life, not a feature of it.",
    watch: "Consensus fatigue is real. The governance load is a part-time job.",
    examples: [
      { img: "images/model-findhorn.jpg", name: "Findhorn", place: "Scotland", note: "The 60-year proof of concept — from caravan park to full eco-settlement.", url: "https://www.findhorn.org" },
      { img: "images/ex-auroville.jpg", name: "Auroville", place: "India", note: "The most ambitious version ever attempted — a planned universal township.", url: "https://auroville.org" },
      { img: "images/ex-evi-ithaca.jpg", name: "EcoVillage Ithaca", place: "New York", note: "The polished North American model: three cohousing neighborhoods on shared land.", url: "https://ecovillageithaca.org" },
      { img: "images/ex-tamera.jpg", name: "Tamera", place: "Portugal", note: "A 200-person peace-research ecovillage that re-watered its own valley — one of Europe's most complete intentional communities.", url: "https://www.tamera.org/our-facilities/" },
      { name: "Global Ecovillage Network", place: "Worldwide", note: "The directory — thousands of them, mapped.", url: "https://ecovillage.org" }
    ]
  },
  {
    slug: "cohousing",
    name: "Cohousing (bofællesskab)",
    short: "Cohousing",
    tagline: "Private homes, shared heart. Denmark solved this in 1972 and the world is still catching up.",
    scores: { ecoTech: 28, centralization: 35, financing: 45, difficulty: 70, independence: 68, scale: 55, permanence: 85, cost: 60 },
    body: [
      "You own your own front door — full kitchen, full privacy — but the site is designed around a common house where the community eats together a few nights a week. Cars stay at the edge; the space between homes belongs to people.",
      "This is the most proven model on the map. Fifty years of Danish data says the common meal is the engine: keep it, and the community holds."
    ],
    who: "Families and couples who want community without giving up a private household.",
    watch: "Development takes 3–7 years and a core group that survives the process.",
    examples: [
      { img: "images/proj-trudeslund.jpg", name: "Trudeslund", place: "Denmark", note: "The 1981 benchmark — 33 homes, common house, still thriving.", url: "https://en.wikipedia.org/wiki/Cohousing" },
      { img: "images/ex-lilac.jpg", name: "LILAC", place: "Leeds, UK", note: "Low-impact straw-bale cohousing with a mutual home-ownership model.", url: "https://www.lilac.coop" },
      { name: "Nightingale", place: "Melbourne", note: "Architect-led apartment cohousing — sold at cost, no investors.", url: "https://www.nightingalehousing.org" }
    ]
  },
  {
    slug: "housing-coop",
    name: "Housing cooperative",
    short: "Housing co-op",
    tagline: "The residents are the landlord. Zurich runs a fifth of its housing this way.",
    scores: { ecoTech: 35, centralization: 60, financing: 65, difficulty: 75, independence: 72, scale: 80, permanence: 90, cost: 30 },
    body: [
      "A co-op takes the building off the speculative market forever: residents collectively own it, rents cover costs instead of profit, and nobody can be flipped out of their home.",
      "Zurich's big co-ops are the most sophisticated co-living machines in the world — cluster apartments, shared workshops, guest rooms, all inside affordable rent. Institutional in structure, communal in spirit."
    ],
    who: "People who want permanence and affordability, and will trade some autonomy to a democratic structure for it.",
    watch: "Waiting lists measured in years. Founding a new one needs serious finance engineering.",
    examples: [
      { img: "images/model-kalkbreite.jpg", name: "Kalkbreite", place: "Zurich", note: "97 flats over a tram depot — cluster living, car-free, legendary.", url: "https://www.kalkbreite.net" },
      { img: "images/proj-mehralswohnen.jpg", name: "Mehr als Wohnen", place: "Zurich", note: "'More than living' — a co-op quarter of 1,200 people.", url: "https://www.mehralswohnen.ch" },
      { name: "Co-op Housing International", place: "Worldwide", note: "The global federation — the model exists everywhere.", url: "https://www.housinginternational.coop" }
    ]
  },
  {
    slug: "baugruppen",
    name: "Baugruppe (building group)",
    short: "Baugruppe",
    tagline: "Skip the developer: friends hire an architect and build their own apartment house.",
    scores: { ecoTech: 38, centralization: 28, financing: 55, difficulty: 78, independence: 78, scale: 45, permanence: 88, cost: 55 },
    body: [
      "A German invention: a group of future residents acts as its own developer — buying the plot, hiring the architect, cutting the developer margin (often 20–30%) out of the price.",
      "The result is housing shaped by the people who'll live in it: shared roof terraces, common rooms, flexible walls. Community is a by-product of having survived a construction project together."
    ],
    who: "Organized, patient people with access to financing who want a custom home and built-in neighbors.",
    watch: "You're the developer now — every risk a developer carries, you carry.",
    examples: [
      { name: "R50", place: "Berlin", note: "The famous one — 19 households, raw concrete, shared everything.", url: "https://www.archdaily.com/593154/r50-nil-cohousing-ifau-und-jesko-fezer-heide-and-von-beckerath" },
      { img: "images/ex-spreefeld.jpg", name: "Spreefeld", place: "Berlin", note: "Riverside building group with cluster flats and public ground floors.", url: "https://en.wikipedia.org/wiki/Baugruppe" }
    ]
  },
  {
    slug: "kibbutz",
    name: "Kibbutz",
    short: "Kibbutz",
    tagline: "The most radical experiment in shared living ever run at national scale.",
    scores: { ecoTech: 22, centralization: 72, financing: 50, difficulty: 95, independence: 12, scale: 95, permanence: 95, cost: 15 },
    body: [
      "For most of a century, hundreds of villages ran on full income-sharing: communal dining, collective childcare, work assigned by the community. At its peak the kibbutz movement housed over 100,000 people.",
      "Most kibbutzim privatized after the 1980s — the pure model asked more than most humans can give. But it remains the deepest dataset we have on what total community does to people: the highs and the costs."
    ],
    who: "Historically: ideologues and pioneers. Today: people drawn to the renewed urban kibbutz movement.",
    watch: "Total sharing means total governance. The model bends toward the institution, not the individual.",
    examples: [
      { img: "images/model-kibbutz.jpg", name: "Kibbutz movement", place: "Israel", note: "The full history — rise, crisis, reinvention.", url: "https://en.wikipedia.org/wiki/Kibbutz" },
      { img: "images/ex-degania.jpg", name: "Degania Alef", place: "Israel", note: "The first one, founded 1910.", url: "https://en.wikipedia.org/wiki/Degania_Alef" },
      { img: "images/ex-nir-david.jpg", name: "Nir David", place: "Israel", note: "A working kibbutz in the Jezreel Valley — some of the best first-person writing on what communal life actually costs and gives.", url: "https://medium.com/globetrotters/nir-david-life-on-a-kibbutz-69a93d3ba654" },
      { img: "images/ex-neot-smadar.jpg", name: "Neot Smadar", place: "Israel", note: "A desert kibbutz in the Arava, founded 1989 — one of the few still running full income-sharing, famous for its art.", url: "https://en.wikipedia.org/wiki/Neot_Smadar" }
    ]
  },
  {
    slug: "intergenerational",
    name: "Intergenerational housing",
    short: "Intergenerational",
    tagline: "Students living rent-free in care homes. Grandparents on the ground floor. The oldest idea, made deliberate.",
    scores: { ecoTech: 18, centralization: 48, financing: 35, difficulty: 40, independence: 50, scale: 30, permanence: 75, cost: 25 },
    body: [
      "Humans lived in age-mixed households for all of history until about 1950. This model re-engineers that on purpose: pairing young people who need cheap housing with older people who need presence.",
      "The Dutch cracked the famous version — students live free in a care home in exchange for 30 hours a month of being a good neighbor. Loneliness drops on both sides of the deal."
    ],
    who: "Students, young workers, and elders — anyone the housing market has priced out of connection.",
    watch: "It lives or dies on matching and expectations. 'Being neighborly' has to be defined.",
    examples: [
      { img: "images/ex-humanitas.jpg", name: "Humanitas Deventer", place: "Netherlands", note: "The care home where students live free — the model everyone cites.", url: "https://www.humanitasdeventer.nl" },
      { img: "images/ex-bridge-meadows.jpg", name: "Bridge Meadows", place: "Portland, OR", note: "Elders + foster families, designed as one community.", url: "https://bridgemeadows.org" },
      { name: "Generations United", place: "USA", note: "The advocacy hub for shared intergenerational sites.", url: "https://www.gu.org" },
      { name: "Hogeweyk", place: "Netherlands", note: "A village-scale dementia care home where residents live in real streets and shops — radical normalcy for the people who need care most.", url: "https://www.bethecareconcept.com/en/hogeweyk-dementia-village-hogeweyk-netherlands/" },
      { img: "images/intergen-japan.jpg", name: "Fujisawa care model", place: "Japan", note: "Daycare children and elderly residents share daily programming — one of the most studied designs for cross-generational contact.", url: "https://www.toyproject.net/2017/04/innovative-intergenerational-care-in-fujisawa-japan/" }
    ]
  },
  {
    slug: "hacker-house",
    name: "Hacker house",
    short: "Hacker house",
    tagline: "Rent a big house, fill it with builders, see what ships. The garage myth, collectivized.",
    scores: { ecoTech: 88, centralization: 22, financing: 35, difficulty: 15, independence: 35, scale: 15, permanence: 15, cost: 50 },
    body: [
      "The easiest square on this map: a lease, some bunk beds or bedrooms, and a filter for who gets in. The house is a talent concentrator — ambition compounds when you cook dinner next to it.",
      "Most last eighteen months and that's fine — the alumni network *is* the product. A few evolve into institutions with demo days and funding attached."
    ],
    who: "Early-career founders and researchers who want their living room to be a career accelerant.",
    watch: "Burnout culture is a feature and a bug. Homes need rest, not just output.",
    examples: [
      { img: "images/ex-agi-house.jpg", name: "AGI House", place: "Bay Area", note: "The flagship AI-era hacker mansion — hackathons in the living room.", url: "https://agihouse.org" },
      { img: "images/ex-hf0.jpg", name: "HF0", place: "San Francisco", note: "A 'monastery for founders' — 12-week live-in residency.", url: "https://www.hf0.com" }
    ]
  },
  {
    slug: "operator-coliving",
    name: "Operator co-living",
    short: "Operator co-living",
    tagline: "Community as a subscription: furnished room, app, events calendar, one invoice.",
    scores: { ecoTech: 68, centralization: 95, financing: 95, difficulty: 55, independence: 85, scale: 80, permanence: 25, cost: 75 },
    body: [
      "Venture capital's read on loneliness: a company owns the building, designs the shared spaces, programs the events, and rents you belonging by the month. Flexible, frictionless, and entirely top-down.",
      "The cautionary tale is The Collective — 550 rooms in London, a spectacular building, bankrupt by 2021. Community that's bought instead of built is fragile. The survivors (Habyt, Cohabs) run leaner and promise less."
    ],
    who: "New-in-town professionals who want an instant social layer with zero setup cost.",
    watch: "When the operator's incentives and the residents' needs diverge, the operator wins.",
    examples: [
      { img: "images/ex-habyt.jpg", name: "Habyt", place: "Europe & Asia", note: "The consolidator — absorbed Common and others; the biggest operator standing.", url: "https://www.habyt.com" },
      { img: "images/ex-cohabs.jpg", name: "Cohabs", place: "Brussels, NYC, Paris", note: "Brownstone co-living done carefully, house by house.", url: "https://www.cohabs.com" },
      { img: "images/proj-collective.jpg", name: "The Collective (2016–2021)", place: "London", note: "The rise-and-fall case study every founder should read.", url: "https://en.wikipedia.org/wiki/The_Collective_(company)" }
    ]
  },
  {
    slug: "entrepreneur-house",
    name: "The entrepreneur house",
    short: "Entrepreneur house",
    mine: true,
    tagline: "A curated household of builders — my own practice sits here.",
    scores: { ecoTech: 62, centralization: 35, financing: 15, difficulty: 25, independence: 45, scale: 20, permanence: 40, cost: 45 },
    body: [
      "Between the hacker house's chaos and the operator's sterility there's a middle path: one house, five to ten carefully chosen people, run by someone who actually lives there and designs the space around behavior — focus rooms, gathering tables, stillness corners.",
      "This is the model I've built and run in Vancouver and Montreal for years. Almost no capital, no institution — just curation, intention, and a house whose bones get redesigned around the people in it. [edit — make this yours]"
    ],
    who: "Entrepreneurs and self-directed people who want their home to push their life forward.",
    watch: "It runs on the host's energy. The design has to make community self-sustaining, or the host burns out.",
    examples: [
      { img: "images/dunbar-exterior.jpg", name: "Growth Hub", place: "Vancouver", note: "My houses — six to nine entrepreneurs, living and working as one community.", url: "https://www.growthhub.house" },
      { img: "images/mtl-living-room.jpg", name: "Montreal house", place: "Montreal", note: "Three years of hands-on spatial design — the full case study is on this site.", url: "project.html?p=montreal" },
      { name: "The Residency", place: "USA", note: "Curated live-work cohorts for founders and creators — the entrepreneur house, franchised gently.", url: "https://www.livetheresidency.com/" }
    ]
  },
  {
    slug: "rural-coliving",
    name: "Rural co-living / coworkation",
    short: "Rural co-living",
    tagline: "Remote workers move into a dying village for a month. Both come back to life.",
    scores: { ecoTech: 42, centralization: 52, financing: 38, difficulty: 35, independence: 55, scale: 30, permanence: 12, cost: 40 },
    body: [
      "The newest pattern here: take laptop workers who can live anywhere, and place them somewhere that desperately needs people — Spanish mountain villages, Galician hamlets. Fiber internet plus grandmother's cooking.",
      "The stays are short but the thesis is big: rural depopulation and urban loneliness might be the same problem, solvable in one move."
    ],
    who: "Remote workers craving nature and belonging without quitting their job or their city forever.",
    watch: "A month is a visit, not a community. The magic is real but it resets with every cohort.",
    examples: [
      { img: "images/rooral-hero.jpg", name: "Rooral", place: "Benarrabá, Spain", note: "Curated village stays — the case study is on this site.", url: "https://rooral.co" },
      { img: "images/ex-sende.jpg", name: "Sende", place: "Galicia, Spain", note: "A coworking village in a 30-person hamlet, running since 2013.", url: "https://sende.co" },
      { img: "images/ex-coconat.jpg", name: "Coconat", place: "Brandenburg, Germany", note: "A 'workation retreat' rebuilding a rural estate.", url: "https://coconat-space.com" }
    ]
  },
  {
    slug: "network-village",
    name: "Network village",
    short: "Network village",
    tagline: "Internet communities trying to become physical towns. The frontier — thrilling and unproven.",
    scores: { ecoTech: 93, centralization: 62, financing: 88, difficulty: 92, independence: 60, scale: 90, permanence: 50, cost: 85 },
    body: [
      "The crypto-and-AI generation's bet: start with an aligned online community, then buy land and instantiate it — pop-up cities that iterate toward permanence, or whole neighborhoods built from scratch.",
      "Almost nothing here is proven. But it's where the most capital and the most ambition currently point, and one of these will eventually work."
    ],
    who: "Early adopters with resources who'd rather build a town than join one.",
    watch: "Communities selected by capital select out the people who make places feel human.",
    examples: [
      { img: "images/ex-esmeralda.jpg", name: "Edge Esmeralda", place: "Healdsburg, CA", note: "A month-long pop-up village prototyping a future permanent town.", url: "https://www.edgeesmeralda.com" },
      { name: "Zuzalu", place: "Montenegro (2023)", note: "The two-month pop-up that started the movement.", url: "https://zuzalu.city" },
      { img: "images/ex-culdesac.jpg", name: "Culdesac", place: "Tempe, AZ", note: "A car-free neighborhood built from scratch — adjacent proof that new urban fabric is possible.", url: "https://culdesac.com" },
      { img: "images/ex-network-school.jpg", name: "Network School", place: "Malaysia", note: "Balaji's live-in school and co-living community — a network-state proof of concept, running since 2024.", url: "https://balajis.com/p/network-school-2025" }
    ]
  },
  {
    slug: "student-coop",
    name: "Student housing co-op",
    short: "Student co-op",
    tagline: "The gateway drug: cheap rooms, shared chores, democracy practiced at nineteen.",
    scores: { ecoTech: 48, centralization: 45, financing: 42, difficulty: 30, independence: 32, scale: 65, permanence: 15, cost: 8 },
    body: [
      "Students collectively run their own houses — cooking rotas, elected officers, rent at half market rate. It's where tens of thousands of people first learn that housing can be something you govern, not just rent.",
      "Berkeley's system alone houses ~1,300 students. Ask anyone who lived in one: it marks you. Half the people on the rest of this map started here."
    ],
    who: "Students who want cheap rent and don't mind learning governance by doing dishes about it.",
    watch: "Turnover is total every few years — the institution remembers, the community resets.",
    examples: [
      { img: "images/ex-cloyne.jpg", name: "Berkeley Student Cooperative", place: "California", note: "The giant — 17 houses, since 1933.", url: "https://www.bsc.coop" },
      { name: "NASCO", place: "North America", note: "The federation connecting campus co-ops across the continent.", url: "https://www.nasco.coop" },
      { img: "images/ex-icc-annarbor.jpg", name: "ICC Ann Arbor", place: "Michigan", note: "The oldest continuous student co-op system in North America.", url: "https://icc.coop" },
      { img: "images/ex-campus1-mtl.jpg", name: "Campus1 MTL", place: "Montréal", note: "Purpose-built student co-living downtown — communal programming baked in from day one.", url: "https://campus1mtl.ca/montreal-student-housing/" }
    ]
  }
];
