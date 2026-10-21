/* =====================================================================
   MAP CONTENT LAYER — the co-living atlas backend (data model v2, 2026-10-21).
   Three layers, kept apart on purpose:
   - SPECTRUMS   = what a way of living IS. The only things on the map.
                   Each type has a RANGE [min,max] (0–100), since real
                   places vary. Editorial reads, sourced per type.
   - SET-UPS     = how a project is organized (legal form, money, how you
                   hold your home, how decisions are made). Types list 1–3
                   TYPICAL set-ups; real projects record their actual one.
   - POSSIBILITIES = who and where (who it's for, setting, building, what
                   it hosts). Tags on real projects only, never on types.
   Real projects live in projects-data.js (load it after this file).
   MAP_PROPS / t.scores are rebuilt at the bottom for older page code.
   ===================================================================== */

const SPECTRUMS = {
  share: {
    label: "Private ↔ Shared life",
    low: "Own home, shared spaces", high: "Shared home, money, work",
    blurb: "How much of daily life is shared."
  },
  size: {
    label: "Household ↔ Village",
    low: "One house", high: "A village",
    blurb: "How many people live the model together."
  },
  time: {
    label: "Passing through ↔ For life",
    low: "Passing through", high: "For life",
    blurb: "How long people typically stay."
  },
  power: {
    label: "Founder-run ↔ Resident-run",
    low: "One founder or operator", high: "All residents together",
    blurb: "Who holds the power."
  },
  autonomy: {
    label: "Autonomy ↔ Collectivism",
    low: "The person first", high: "The group first",
    blurb: "Whose needs come first when the person and the group disagree."
  },
  ecoTech: {
    label: "Ecology ↔ Technology",
    low: "Ecological", high: "Tech-driven",
    blurb: "What the community organizes its life around."
  },
  effort: {
    label: "Easy ↔ Hard to start",
    low: "Start this year", high: "Land, permits, money, years",
    blurb: "How hard it is to make one exist."
  }
};

/* kept in the data, not on the map */
const BACKEND_SPECTRUMS = {
  purpose: { label: "Light ↔ Shared mission", low: "Light", high: "Shared belief or mission" },
  cost:    { label: "Affordable ↔ Premium", low: "Affordable", high: "Premium" }
};

const MAP_PRESETS = [
  { name: "The classic",     x: "ecoTech", y: "autonomy" },
  { name: "Hard mode",       x: "effort",  y: "size" },
  { name: "Shape of life",   x: "share",   y: "time" },
  { name: "Who's in charge", x: "power",   y: "autonomy" }
];

const TYPE_FAMILIES = {
  "share-a-home": "Share a home",
  "own-home":     "Own home, shared heart",
  "life-project": "A shared life project",
  "flexible":     "Flexible and networked"
};

/* retired types: old links land on the right part of the Workshop hub */
const ARCHIVED_TYPES = {
  "housing-coop":      { to: "themes.html#legal", note: "A co-op is a legal set-up almost any way of living can use." },
  "intergenerational": { to: "themes.html#who",   note: "Intergenerational is about who a place is for, and any way of living can be." },
  "kollektivhus":      { to: "type.html?t=cohousing", note: "Sweden's collective house is a kind of cohousing, so it lives in the cohousing guide." }
};

/* labels for set-up and possibility pills. layer = pill colour:
   setup = gold, who = sky, place = terracotta (ways of living = green). */
const TAG_VOCAB = {
  legal: { layer: "setup", label: "Legal set-up", values: {
    "public": "Public housing", "coop": "Co-op", "solidarity-coop": "Solidarity co-op", "nonprofit": "Non-profit", "condo": "Condo",
    "company": "Company", "land-trust": "Land trust", "informal": "Shared lease", "hybrid": "Hybrid set-up" }, descs: {
    "public": "Homes owned by a city or public housing company, rented at a set price.",
    "coop": "Residents own the building together through a co-op, one vote each.",
    "solidarity-coop": "A Quebec co-op where residents share membership with workers or supporters of the project.",
    "nonprofit": "A non-profit owns the place and keeps it for its mission, so nobody profits from a sale.",
    "condo": "Each household owns its unit, and the shared spaces are owned together.",
    "company": "A business owns or runs the place, and residents are its customers.",
    "land-trust": "A trust holds the land for good, so homes stay affordable from one owner to the next.",
    "informal": "Housemates share one lease or a simple agreement, with no formal structure behind it.",
    "hybrid": "A mix of legal forms, like a co-op for the homes and a non-profit for the common spaces." } },
  money: { layer: "setup", label: "Financial set-up", values: {
    "members": "Members' own money", "public": "Public funding", "patron": "One founder or patron",
    "investors": "Investors", "donors": "Donors and crowdfunding" }, descs: {
    "members": "The future residents put in their own savings and take out the loans.",
    "public": "Grants or public loans from a city or government help pay for it.",
    "patron": "One founder or patron puts up most of the money.",
    "investors": "Investors fund it and expect a return.",
    "donors": "Gifts from many people, often through crowdfunding or a foundation." } },
  holding: { layer: "setup", label: "Your home", values: {
    "own": "Own", "rent": "Rent", "shares": "Member shares", "use-rights": "Use rights", "membership": "Membership" }, descs: {
    "own": "You own your home and can sell it.",
    "rent": "You pay rent and can leave without selling anything.",
    "shares": "You buy a share in the co-op and get it back when you leave.",
    "use-rights": "You have the right to live there, but the home belongs to the group or a trust.",
    "membership": "You pay a membership, often monthly, and your room comes with it." } },
  decisions: { layer: "setup", label: "Decisions", values: {
    "founder": "Founder or operator decides", "vote": "Majority vote", "consensus": "Consensus",
    "consent": "Consent / sociocracy", "advice": "Advice process" }, descs: {
    "founder": "The founder or company makes the main calls, and residents give input.",
    "vote": "A decision passes with more than half the votes.",
    "consensus": "A decision passes only when everyone can agree to it.",
    "consent": "A decision passes when no one has a serious objection, often in small circles.",
    "advice": "Anyone can decide, after asking the people affected and those who know the subject." } },
  forWho: { layer: "who", label: "Who lives there", values: {
    "students": "Students", "young-adults": "Young adults", "entrepreneurs": "Entrepreneurs", "families": "Families",
    "single-parents": "Single parents", "seniors": "Seniors", "intergenerational": "Intergenerational",
    "newcomers": "Newcomers", "artists": "Artists", "remote-workers": "Remote workers", "care": "People needing care" }, descs: {
    "students": "Built around people in school, with rents and rhythms to match.",
    "young-adults": "Mostly people in their twenties and early thirties.",
    "entrepreneurs": "People building their own companies or projects.",
    "families": "Households with children, often with shared places to play.",
    "single-parents": "Set up so single parents can share childcare and meals.",
    "seniors": "Older adults who want to grow old with neighbours close by.",
    "intergenerational": "Young and old living side by side on purpose.",
    "newcomers": "A soft landing for people new to the country or the city.",
    "artists": "Space and rent set up so artists can live and make their work.",
    "remote-workers": "People who can work from anywhere with good internet.",
    "care": "Homes designed around people who need daily support." } },
  setting: { layer: "place", label: "Location", values: { "city": "City", "suburb": "Suburb", "countryside": "Countryside" }, descs: {
    "city": "Dense and central, close to transit and services.",
    "suburb": "Quieter streets and more space, where a car often helps.",
    "countryside": "Low density, more land, close to farms and nature." } },
  building: { layer: "place", label: "Building", values: { "new": "New build", "converted": "Converted building", "mixed": "New + converted" }, descs: {
    "new": "Designed and built from scratch for living together.",
    "converted": "An existing building given a new life as shared homes.",
    "mixed": "Some new buildings and some old ones brought back to life." } },
  hosts: { layer: "place", label: "What's on site", values: { "homes": "Homes only", "mixed-use": "Homes + shops or work", "farm": "Homes + farm" }, descs: {
    "homes": "Only homes and the spaces residents share.",
    "mixed-use": "Homes alongside shops, workspaces or studios open to others.",
    "farm": "Homes on working land that grows food." } }
};

const COLIVING_TYPES = [
  {
    slug: "ecovillage",
    family: "life-project",
    name: "Ecovillage",
    short: "Ecovillage",
    tagline: "A whole village built around living lightly on the land, together.",
    ranges: { share: [35, 70], size: [55, 95], time: [60, 95], power: [65, 95], autonomy: [55, 80], ecoTech: [0, 20], effort: [75, 95] },
    backend: { purpose: [55, 85], cost: [25, 45] },
    typicalSetups: [
      { legal: ["land-trust", "coop"], money: ["members"], holding: ["shares", "use-rights"], decisions: ["consensus", "consent"],
        note: "Land held in common through a trust or co-op, built with members' money and years of shared work." },
      { legal: ["nonprofit"], money: ["donors", "members"], decisions: ["consensus"],
        note: "Some grew around a charity or foundation, like Findhorn." }
    ],
    sources: ["wiki-ecovillage", "gen"],
    body: [
      "The maximalist answer. An ecovillage doesn't just share a kitchen — it rebuilds the entire stack of daily life around regeneration: growing food, producing energy, consensus governance, often its own economy.",
      "It's also the deepest commitment on this map. The successful ones took decades and survived on stubbornness. But nothing else produces the same depth of belonging."
    ],
    who: "People ready to make community the main project of their life, not a feature of it.",
    watch: "Consensus fatigue is real. The governance load is a part-time job."
  },
  {
    slug: "cohousing",
    family: "own-home",
    name: "Cohousing (bofællesskab)",
    short: "Cohousing",
    aka: ["cohabitat", "kollektivhus", "collective house"],
    tagline: "Your own home, with neighbours who share a common house and a few meals a week.",
    ranges: { share: [15, 35], size: [30, 65], time: [70, 95], power: [80, 100], autonomy: [35, 55], ecoTech: [15, 45], effort: [60, 85] },
    backend: { purpose: [15, 40], cost: [45, 75] },
    typicalSetups: [
      { legal: ["condo"], money: ["members"], holding: ["own"], decisions: ["consensus", "consent"],
        note: "Each household owns its home, and the common house is owned together." },
      { legal: ["coop", "solidarity-coop", "nonprofit"], money: ["public", "members"], holding: ["rent", "shares"], decisions: ["consent"],
        note: "More and more are rental or co-op, to stay affordable. Un Village à Lachine mixes both." },
      { legal: ["public"], money: ["public"], holding: ["rent"], decisions: ["consensus", "vote"],
        label: "In Sweden", note: "A collective house is often rental flats from a public housing company, with daily life run by a residents' association." }
    ],
    sources: ["guide-cohabitat", "wiki-cohousing", "mccamant-durrett-2011", "kollektivhus-nu"],
    body: [
      "You own your own front door — full kitchen, full privacy — but the site is designed around a common house where the community eats together a few nights a week. Cars stay at the edge; the space between homes belongs to people.",
      "This is the most proven model on the map. Fifty years of Danish data says the common meal is the engine: keep it, and the community holds.",
      "In Sweden the same idea is called a kollektivhus, or collective house. It's usually one building of complete flats with a big shared kitchen, where residents take turns cooking dinner for everyone. You cook a few times a month and eat with your neighbours on the other evenings."
    ],
    who: "Families and couples who want community without giving up a private household.",
    watch: "Development takes 3–7 years and a core group that survives the process."
  },
  {
    slug: "kibbutz",
    family: "life-project",
    name: "Kibbutz",
    short: "Kibbutz",
    aka: ["commune"],
    tagline: "Israel's century-long experiment in sharing work and income, still changing today.",
    ranges: { share: [80, 100], size: [70, 95], time: [80, 100], power: [70, 95], autonomy: [75, 100], ecoTech: [10, 45], effort: [85, 100] },
    backend: { purpose: [75, 100], cost: [5, 25] },
    typicalSetups: [
      { legal: ["coop"], money: ["members", "public"], holding: ["membership"], decisions: ["vote"],
        label: "Historically", note: "A co-operative society that owned everything and pooled all income." },
      { legal: ["coop"], money: ["members"], holding: ["own"], decisions: ["vote"],
        label: "Today", note: "Most renewed kibbutzim now pay different salaries and let members own their homes." }
    ],
    sources: ["wiki-kibbutz"],
    body: [
      "For most of a century, hundreds of villages ran on full income-sharing: communal dining, collective childcare, work assigned by the community. At its peak the kibbutz movement housed over 100,000 people.",
      "Most kibbutzim privatized after the 1980s — the pure model asked more than most humans can give. But it remains the deepest dataset we have on what total community does to people: the highs and the costs."
    ],
    who: "Historically: ideologues and pioneers. Today: people drawn to the renewed urban kibbutz movement.",
    watch: "Total sharing means total governance. The model bends toward the institution, not the individual."
  },
  {
    slug: "baugruppen",
    family: "own-home",
    name: "Baugruppe (building group)",
    short: "Baugruppe",
    tagline: "Friends hire an architect together and build the apartment house they want to live in.",
    ranges: { share: [10, 30], size: [25, 55], time: [75, 95], power: [70, 95], autonomy: [25, 45], ecoTech: [25, 50], effort: [65, 85] },
    backend: { purpose: [10, 30], cost: [40, 70] },
    typicalSetups: [
      { legal: ["condo"], money: ["members"], holding: ["own"], decisions: ["vote", "consensus"],
        note: "The group buys and builds together, then each household owns its flat." },
      { legal: ["coop"], money: ["members"], holding: ["shares"], decisions: ["vote"],
        note: "Some build as a co-op so the homes stay off the market, like Spreefeld." }
    ],
    sources: ["guide-cohabitat", "wiki-baugruppe"],
    body: [
      "A German invention: a group of future residents acts as its own developer — buying the plot, hiring the architect, cutting the developer margin (often 20–30%) out of the price.",
      "The result is housing shaped by the people who'll live in it: shared roof terraces, common rooms, flexible walls. Community is a by-product of having survived a construction project together."
    ],
    who: "Organized, patient people with access to financing who want a custom home and built-in neighbors.",
    watch: "You're the developer now — every risk a developer carries, you carry."
  },
  {
    slug: "hacker-house",
    family: "share-a-home",
    name: "Hacker house",
    short: "Hacker house",
    tagline: "A big shared house of people building things, learning from each other at the kitchen table.",
    ranges: { share: [55, 70], size: [5, 20], time: [5, 30], power: [20, 55], autonomy: [15, 35], ecoTech: [80, 100], effort: [5, 25] },
    backend: { purpose: [45, 75], cost: [35, 65] },
    typicalSetups: [
      { legal: ["informal"], money: ["members"], holding: ["rent"], decisions: ["founder"],
        note: "A shared lease: one or two people sign it and everyone splits the rent." },
      { legal: ["company"], money: ["investors", "patron"], holding: ["membership"], decisions: ["founder"],
        note: "Some are run by a company or fund as a residency, like HF0." }
    ],
    sources: [],
    body: [
      "The easiest square on this map: a lease, some bunk beds or bedrooms, and a filter for who gets in. The house is a talent concentrator — ambition compounds when you cook dinner next to it.",
      "Most last eighteen months and that's fine — the alumni network *is* the product. A few evolve into institutions with demo days and funding attached."
    ],
    who: "Early-career founders and researchers who want their living room to be a career accelerant.",
    watch: "Burnout culture is a feature and a bug. Homes need rest, not just output."
  },
  {
    slug: "operator-coliving",
    family: "share-a-home",
    name: "Operator co-living",
    short: "Operator co-living",
    tagline: "A furnished room and a ready-made community, run by a company for one monthly price.",
    ranges: { share: [45, 65], size: [20, 80], time: [10, 35], power: [0, 15], autonomy: [5, 20], ecoTech: [55, 80], effort: [40, 70] },
    backend: { purpose: [0, 15], cost: [65, 85] },
    typicalSetups: [
      { legal: ["company"], money: ["investors"], holding: ["rent", "membership"], decisions: ["founder"],
        note: "A company leases or owns the building and rents rooms as a service." }
    ],
    sources: ["guide-cohabitat", "wiki-coliving"],
    body: [
      "Venture capital's read on loneliness: a company owns the building, designs the shared spaces, programs the events, and rents you belonging by the month. Flexible, frictionless, and entirely top-down.",
      "The cautionary tale is The Collective — 550 rooms in London, a spectacular building, bankrupt by 2021. Community that's bought instead of built is fragile. The survivors (Habyt, Cohabs) run leaner and promise less."
    ],
    who: "New-in-town professionals who want an instant social layer with zero setup cost.",
    watch: "When the operator's incentives and the residents' needs diverge, the operator wins."
  },
  {
    slug: "entrepreneur-house",
    family: "share-a-home",
    name: "The entrepreneur house",
    short: "Entrepreneur house",
    mine: true,
    tagline: "A small household of people building their own projects, who chose each other with care. It's where my own practice sits.",
    ranges: { share: [55, 70], size: [5, 15], time: [20, 55], power: [15, 45], autonomy: [25, 50], ecoTech: [45, 75], effort: [15, 35] },
    backend: { purpose: [40, 70], cost: [35, 55] },
    typicalSetups: [
      { legal: ["informal"], money: ["members"], holding: ["rent"], decisions: ["founder", "consensus"],
        note: "A host signs the lease and curates the house. Decisions happen at the dinner table." }
    ],
    sources: [],
    body: [
      "Between the hacker house's chaos and the operator's sterility there's a middle path: one house, five to ten carefully chosen people, run by someone who actually lives there and designs the space around behavior — focus rooms, gathering tables, stillness corners.",
      "This is the model I've built and run in Vancouver and Montreal for years. Almost no capital, no institution — just curation, intention, and a house whose bones get redesigned around the people in it."
    ],
    who: "Entrepreneurs and self-directed people who want their home to push their life forward.",
    watch: "It runs on the host's energy. The design has to make community self-sustaining, or the host burns out."
  },
  {
    slug: "rural-coliving",
    family: "flexible",
    name: "Rural co-living / coworkation",
    short: "Rural co-living",
    tagline: "Remote workers spend a month in a quiet village, and the village gets some new life too.",
    ranges: { share: [50, 70], size: [10, 40], time: [0, 15], power: [10, 35], autonomy: [15, 40], ecoTech: [25, 55], effort: [25, 50] },
    backend: { purpose: [15, 40], cost: [30, 50] },
    typicalSetups: [
      { legal: ["company"], holding: ["membership"], decisions: ["founder"],
        note: "A small host company or association runs short stays in buildings it rents or restores." }
    ],
    sources: [],
    body: [
      "The newest pattern here: take laptop workers who can live anywhere, and place them somewhere that desperately needs people — Spanish mountain villages, Galician hamlets. Fiber internet plus grandmother's cooking.",
      "The stays are short but the thesis is big: rural depopulation and urban loneliness might be the same problem, solvable in one move."
    ],
    who: "Remote workers craving nature and belonging without quitting their job or their city forever.",
    watch: "A month is a visit, not a community. The magic is real but it resets with every cohort."
  },
  {
    slug: "network-village",
    family: "flexible",
    name: "Network village",
    short: "Network village",
    tagline: "Online communities trying to grow into real towns. Still early and unproven.",
    ranges: { share: [20, 55], size: [60, 100], time: [10, 70], power: [5, 40], autonomy: [15, 45], ecoTech: [80, 100], effort: [80, 100] },
    backend: { purpose: [60, 90], cost: [70, 95] },
    typicalSetups: [
      { legal: ["company"], money: ["investors", "patron"], holding: ["membership"], decisions: ["founder"],
        note: "Usually a company started by a founder and backed by investors, with residents paying a membership, like Network School." },
      { legal: ["informal", "nonprofit"], money: ["members", "donors"], holding: ["membership"], decisions: ["consent", "vote"],
        note: "Some pop-up villages run more like a community gathering, paid for by tickets and sponsors." }
    ],
    sources: [],
    body: [
      "The crypto-and-AI generation's bet: start with an aligned online community, then buy land and instantiate it — pop-up cities that iterate toward permanence, or whole neighborhoods built from scratch.",
      "Almost nothing here is proven. But it's where the most capital and the most ambition currently point, and one of these will eventually work."
    ],
    who: "Early adopters with resources who'd rather build a town than join one.",
    watch: "Communities selected by capital select out the people who make places feel human."
  },
  {
    slug: "student-coop",
    family: "share-a-home",
    name: "Co-op house",
    short: "Co-op house",
    aka: ["student housing co-op"],
    tagline: "Young people share a big house, the chores and the rent, and run it together.",
    ranges: { share: [60, 75], size: [10, 40], time: [10, 35], power: [75, 95], autonomy: [40, 60], ecoTech: [30, 60], effort: [20, 60] },
    backend: { purpose: [20, 45], cost: [0, 20] },
    typicalSetups: [
      { legal: ["coop", "nonprofit"], money: ["members", "public"], holding: ["rent", "membership"], decisions: ["vote", "consensus"],
        note: "A member-run co-op or non-profit owns the houses. Members pay at-cost rent and share the work." }
    ],
    sources: ["nasco"],
    body: [
      "Members collectively run their own houses — very often students: cooking rotas, elected officers, rent at half market rate. It's where tens of thousands of people first learn that housing can be something you govern, not just rent.",
      "Berkeley's system alone houses ~1,300 students. Ask anyone who lived in one: it marks you. Half the people on the rest of this map started here."
    ],
    who: "Students and young people who want cheap rent and don't mind learning governance by doing dishes about it.",
    watch: "Turnover is total every few years — the institution remembers, the community resets."
  }
];

/* ---- compatibility: older page code reads MAP_PROPS + t.scores ---- */
const MAP_PROPS = SPECTRUMS;
COLIVING_TYPES.forEach(function (t) {
  t.scores = {};
  Object.keys(t.ranges).forEach(function (k) { t.scores[k] = Math.round((t.ranges[k][0] + t.ranges[k][1]) / 2); });
  t.examples = t.examples || [];
});
