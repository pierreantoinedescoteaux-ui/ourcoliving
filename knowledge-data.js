/* =====================================================================
   KNOWLEDGE LAYER — buckets 2 & 3 of the knowledge section.
   - THEMES: the 5 cross-cutting lenses that recur in every model.
   - TYPE_KNOWLEDGE: per-type deep-dive content, keyed by the slug used
     in map-data.js. origin / teaches / best (theme keys) / themes notes.
   - WHY: content for why.html (hope → how we got here → hope).
   Positions and claims are editorial; stats reuse the fact-checked set
   in data.js (HOPE.crises). [edit] marks copy for P-A's voice.
   ===================================================================== */

const THEMES = {
  governance: { label: "Governance", q: "Who decides, and how?" },
  financing:  { label: "Financing & ownership", q: "Who pays, who owns?" },
  space:      { label: "Space design", q: "What does the architecture do?" },
  community:  { label: "Community & events", q: "How is togetherness made?" },
  operations: { label: "Management & operations", q: "Who keeps it running?" }
};

const TYPE_KNOWLEDGE = {
  "ecovillage": {
    hero: { src: "images/model-findhorn.jpg", cap: "Findhorn ecovillage, Scotland" },
    diagram: { src: "images/generated/diagram-ecovillage.jpg", cap: "How an ecovillage organizes: homes clustered around a commons, gardens and energy systems at the edges" },
    origin: "Born from the 1960s–70s back-to-the-land movement and matured through permaculture; the Global Ecovillage Network formalized it in 1995. The oldest sites are now on their third generation.",
    teaches: "A community can own its whole stack — food, energy, decisions — and live lighter for it.",
    best: ["governance", "operations"],
    themes: {
      governance: "The pioneers of consensus and sociocracy. Decades of trial and error produced the most sophisticated decision-making culture on the map.",
      financing: "Land trusts and member equity keep the land off the market — usually built on decades of sweat equity rather than capital.",
      space: "Settlement-scale design: clustered homes, shared infrastructure, food and energy production folded into the site plan.",
      community: "Belonging through shared work — work parties, seasonal festivals, rituals — not just shared meals.",
      operations: "Near-total self-management. There is a committee for everything from compost to conflict, and it mostly works."
    }
  },
  "cohousing": {
    hero: { src: "images/proj-trudeslund.jpg", cap: "Trudeslund cohousing, Denmark" },
    diagram: { src: "images/generated/diagram-cohousing.jpg", cap: "Cohousing layout: private homes ring shared kitchen, dining, and outdoor spaces" },
    origin: "Denmark, 1972: Sættedammen was built after Bodil Graae's essay argued 'children should have a hundred parents.' Architect-led, resident-designed — and copied worldwide ever since.",
    teaches: "Design the common house right and community becomes the default instead of the effort.",
    best: ["space", "community"],
    themes: {
      governance: "Resident-led from day one — the future neighbours design the site together before anything is built.",
      financing: "Conventional private ownership plus shared common assets. You pay a normal price; the dividend is belonging.",
      space: "The masterclass: cars at the edge, the common house on everyone's desire path, private homes that don't isolate.",
      community: "The shared meal a few nights a week is the engine. Fifty years of Danish data says: keep the meal, keep the community.",
      operations: "Cooking rotas and committees — light structure carried by heavy participation."
    }
  },
  "housing-coop": {
    hero: { src: "images/model-kalkbreite.jpg", cap: "Kalkbreite cooperative, Zurich" },
    diagram: { src: "images/generated/diagram-housing-coop.jpg", cap: "Housing co-op structure: residents collectively own the building through a share model" },
    origin: "Rooted in 19th-century worker cooperatives; scaled by Zurich and Vienna across the 20th century until co-ops became ordinary civic infrastructure — a fifth of Zurich lives in one.",
    teaches: "Take the building off the market and the community stops being a commodity.",
    best: ["financing", "governance"],
    themes: {
      governance: "One member, one vote — democratic to the bone, and sometimes slow because of it.",
      financing: "The crown jewel: collective ownership, at-cost rent, permanently decommodified. Nobody can be flipped out of their home.",
      space: "From plain postwar blocks to the cluster-apartment innovation of Kalkbreite — co-ops now lead Europe's housing experiments.",
      community: "Structure guarantees fairness, not friendship — the best co-ops program deliberately for the social layer.",
      operations: "Professional staff answering to resident boards: the most institutional self-management on the map."
    }
  },
  "baugruppen": {
    hero: { src: "images/type-baugruppen.jpg", cap: "A Berlin Baugruppe - resident-developed housing" },
    diagram: { src: "images/generated/diagram-baugruppen.jpg", cap: "Baugruppen model: households co-develop a building together, each owning their unit" },
    origin: "Germany after reunification: groups in Berlin, Freiburg and Tübingen started acting as their own developers in the 1990s–2000s, and cities began zoning for them on purpose.",
    teaches: "Cut out the developer and you can afford both beauty and neighbours.",
    best: ["financing", "space"],
    themes: {
      governance: "A project democracy — intense while building, relaxed once everyone moves in.",
      financing: "Self-developing removes the 20–30% developer margin. The group carries the construction risk it just saved on.",
      space: "Architect-led custom design with shared roofs, courtyards and common rooms baked in from the first sketch.",
      community: "Forged before move-in: surviving a construction project together is the bonding ritual.",
      operations: "Runs like a well-made condominium afterwards — the intensity is all front-loaded."
    }
  },
  "kibbutz": {
    hero: { src: "images/ex-nir-david.jpg", cap: "Kibbutz Nir David, Israel" },
    diagram: { src: "images/generated/diagram-kibbutz.jpg", cap: "Kibbutz organization: communal dining, work, and childcare at the center; member homes around the perimeter" },
    origin: "Degania, 1910: Zionist-socialist pioneers built full income-sharing villages. At the peak, hundreds of kibbutzim housed over 100,000 people; most privatized after the 1980s crisis.",
    teaches: "Total sharing works — and shows exactly where its limits are.",
    best: ["community", "operations"],
    themes: {
      governance: "The general assembly rules; the institution outranks the individual. Direct democracy at village scale, with all its weight.",
      financing: "Historically full income pooling — the most radical model ever run at scale. Today mostly renewed into partial-sharing forms.",
      space: "The village plan orbits the communal dining hall — architecture built to make collectivism the path of least resistance.",
      community: "Cradle-to-grave belonging. A century of data on what deep community gives — and what it asks.",
      operations: "A complete village economy — farms, factories, services — run as a single enterprise."
    }
  },
  "intergenerational": {
    hero: { src: "images/intergen-japan.jpg", cap: "Multigenerational household, Fujisawa, Japan" },
    diagram: { src: "images/generated/diagram-intergenerational.jpg", cap: "Intergenerational living: mixed-age households share amenities designed for all life stages" },
    origin: "Age-mixed households were humanity's default until about 1950. The deliberate version is recent: Humanitas Deventer began housing students inside a Dutch care home in 2012, and the model went global.",
    teaches: "The generations are each other's missing resource — housing can broker the trade.",
    best: ["community", "financing"],
    themes: {
      governance: "Usually anchored by a host institution with clear resident agreements — 'being a good neighbour' is defined in writing.",
      financing: "The barter is the innovation: presence exchanged for rent. Care costs drop on both sides of the deal.",
      space: "Care homes and family houses retrofitted for encounter — shared kitchens, gardens, hallways designed to make crossing paths inevitable.",
      community: "The whole point: bonds across generations. Loneliness drops both ways, elders stay active, culture and skills pass down, childcare gets shared.",
      operations: "Matching and expectation-setting is the real work — the model lives or dies on it."
    }
  },
  "hacker-house": {
    hero: { src: "images/type-hacker-house.jpg", cap: "A hackerspace commons - Tirana, Albania" },
    diagram: { src: "images/generated/diagram-hacker-house.jpg", cap: "Hacker house layout: shared workspaces and social zones maximize serendipitous collaboration" },
    origin: "The Bay Area collectivized its garage myth through the 2000s–2010s — Rainbow Mansion, countless unnamed leases — and the AI wave revived it at full intensity.",
    teaches: "Curation is a technology: pick the right ten people and the house does the rest.",
    best: ["operations", "community"],
    themes: {
      governance: "Whoever holds the lease decides. Benevolent dictatorship — usually fine, occasionally not.",
      financing: "A lease and a rent split. The lowest barrier to entry on the entire map: you could start one this month.",
      space: "Bedrooms plus one big table. The whiteboard is the altar; everything else is optional.",
      community: "Peer pressure as a feature — ambition compounds when you cook dinner next to it.",
      operations: "Near-zero structure, chores by group chat. It works until it doesn't, and that's part of the deal."
    }
  },
  "operator-coliving": {
    hero: { src: "images/ex-cohabs-1.jpg", cap: "Cohabs — design-forward operator coliving, Brussels & NYC" },
    diagram: { src: "images/generated/diagram-operator-coliving.jpg", cap: "Operator coliving: amenity-rich shared floors above private bedrooms, managed by a host" },
    origin: "The 2015–16 venture wave — The Collective, WeLive, Common — bet that loneliness was a product problem. The crash taught the survivors (Habyt, Cohabs) to run leaner and promise less.",
    teaches: "You can buy convenience, but belonging has to be built — this model proves both halves.",
    best: ["operations", "space"],
    themes: {
      governance: "You're a customer, not a citizen. The operator decides; your vote is your notice period.",
      financing: "Institutional capital at scale, recouped through a rent premium for flexibility and services.",
      space: "Professionally designed commons — hotel-grade lounges, gyms, kitchens. Beautiful, and sometimes soulless.",
      community: "A programmed events calendar. Real friendships happen despite the programming more often than because of it.",
      operations: "The best-run buildings on the map: apps, cleaning, maintenance, zero friction. This is what capital buys."
    }
  },
  "entrepreneur-house": {
    hero: { src: "images/mtl-living-room.jpg", cap: "My Montreal house — the living room" },
    diagram: { src: "images/generated/diagram-entrepreneur-house.jpg", cap: "Founder house: co-working, event, and living spaces fused in a single building" },
    origin: "The middle path between the hacker house's chaos and the operator's sterility — one lived-in house, one intentional host, a curated handful of builders. My own practice sits here. [edit]",
    teaches: "One person with intention can curate a household that changes its members' trajectories.",
    best: ["community", "space"],
    themes: {
      governance: "Host-led with a strong house culture — light rules, heavy norms, decisions made at the dinner table.",
      financing: "Self-funded on a lease. Sweat and intention instead of capital — proof the barrier is lower than it looks.",
      space: "Behavioral design on no budget: focus rooms, gathering tables, stillness corners. Every room gets a job.",
      community: "Curated like a founding team — applications, interviews, chemistry. The selection is the product.",
      operations: "The host carries it. The design challenge is making community self-sustaining before the host burns out."
    }
  },
  "rural-coliving": {
    hero: { src: "images/rooral-hero.jpg", cap: "Rooral, Benarraba, Spain" },
    diagram: { src: "images/generated/diagram-rural-coliving.jpg", cap: "Rural coliving: land-based living with shared infrastructure and working farmland" },
    origin: "Remote work met rural depopulation: Sende opened in a 30-person Galician hamlet in 2013, Rooral followed in Andalusia in 2020, and a movement of village revivals is forming behind them.",
    teaches: "Urban loneliness and rural decline are the same problem — move the people, and both start to heal.",
    best: ["community", "operations"],
    themes: {
      governance: "A host organization curates the cohort; the village itself sets the rhythm of life.",
      financing: "Cheap rural buildings plus subscription stays — the economics of empty Spain meeting remote salaries.",
      space: "Repurposed village houses; the town square becomes the common room and the grandmother's kitchen the amenity.",
      community: "Two layers at once: instant cohort intimacy, and intergenerational ties with the villagers.",
      operations: "Turnkey cohort logistics — you arrive with a laptop, everything else is handled."
    }
  },
  "network-village": {
    hero: { src: "images/ex-network-school.jpg", cap: "Network School — a real network village node" },
    diagram: { src: "images/generated/diagram-network-village.jpg", cap: "Network village: a distributed mesh of nodes — each a home base in a different city" },
    origin: "Internet communities deciding to become physical: Zuzalu's two-month pop-up in Montenegro (2023) lit the fuse; Esmeralda and a wave of 'network villages' are now iterating toward permanence.",
    teaches: "Community can precede place — the internet lets a village form before it lands.",
    best: ["financing", "governance"],
    themes: {
      governance: "Live experiments — from token votes to benevolent founders. Genuinely new, genuinely unproven.",
      financing: "The most capital on the map: crypto wealth, venture money, patron funding. Buying land is the easy part.",
      space: "Pop-up first — rented hotels and venues, iterating toward built neighbourhoods and eventually towns.",
      community: "Pre-filtered by internet affinity: intense, aligned, homogenous — and increasingly self-aware about that.",
      operations: "Event operations maturing into town operations. They are still learning garbage collection, literally."
    }
  },
  "student-coop": {
    hero: { src: "images/ex-campus1-mtl.jpg", cap: "Campus1 Montréal — student cooperative housing" },
    diagram: { src: "images/generated/diagram-student-coop.jpg", cap: "Student co-op: democratically run housing with shared cooking, governance, and study spaces" },
    origin: "Depression-era students who couldn't afford rent started running their own houses — Berkeley's system dates to 1933 — and NASCO federated the movement across North America.",
    teaches: "Governance is learnable — give nineteen-year-olds a house and they'll learn democracy by doing dishes.",
    best: ["governance", "financing"],
    themes: {
      governance: "Elected officers, weekly house meetings, real budgets — democracy as a teaching tool, on purpose.",
      financing: "Roughly half market rent through shared labour and nonprofit ownership. The cheapest seat on the map.",
      space: "Big old houses with industrial kitchens and decades of patina — beauty by accumulation, not design.",
      community: "Total-immersion belonging that resets every few years as students graduate — the institution remembers what individuals forget.",
      operations: "Chore charts at scale, enforced by peers. Half the people on the rest of this map learned the craft here."
    }
  }
};

/* =====================================================================
   WHY — content for why.html. Arc: hope → how we got here → hope.
   Crisis stats are pulled at runtime from HOPE.crises (data.js) — not
   duplicated here. Solarpunk stills from "Dear Alice" (The Line studio),
   used as inspiration imagery with credit. [edit] marks P-A voice spots.
   ===================================================================== */
const WHY = {
  eyebrow: "Why co-living",
  title: "Start with the ending.",
  vignette: [
    "It's a Sunday morning, some years from now. Twenty people are eating at one long table under a tree — kids, founders, a retired carpenter teaching a nine-year-old how to hold a chisel. Someone's startup got funded this week; someone else's tomatoes came in. Nobody drove anywhere to be here.",
    "This isn't a commune fantasy or a rendering from a developer's brochure. Every piece of that morning already exists somewhere — in a Danish common house, a Zurich co-op, a Galician village, a Montreal living room. It just hasn't been put together at scale yet.",
    "That's the work I want to do. But first, be honest about why it matters. [edit]"
  ],
  vignetteImage: { src: "images/solarpunk-feast.jpg", credit: "Still from “Dear Alice” — The Line studio. The future, drawn the way it could feel." },

  turn: {
    kicker: "How we got here",
    lede: "Four slow emergencies, decades in the making — all pointing at the same root: how, and with whom, we live."
    /* the 4 stats render from HOPE.crises.items at runtime */
  },

  lenses: {
    kicker: "The case, lens by lens",
    lede: "Co-living isn't one argument. It's the same answer arriving from six different directions.",
    items: [
      { title: "Health & longevity",
        body: "The Harvard study's 85-year answer — good relationships keep us happier and healthier — isn't a metaphor, it's medicine. Face-to-face community predicts lifespan on par with not smoking. Housing that produces daily human contact is a health intervention wearing a building's clothes." },
      { title: "Economics",
        body: "One household per overpriced home is the most expensive way humans have ever lived. Pool the walls and the washing machines and everything gets cheaper: co-ops run at cost forever, building groups cut out the developer's margin, and shared childcare and tools quietly return thousands a year." },
      { title: "Elders & children",
        body: "Put the generations back within reach of each other and the trade is spectacular: elders stay active and needed, kids gain a dozen extra adults, care costs fall on both ends, and craft and culture pass down at the kitchen table instead of dying in a care home." },
      { title: "Ecology",
        body: "The greenest building is the one you share. Fewer square metres per person, shared energy, shared cars, shared things — community is a climate technology that happens to also feel like belonging. The ecovillages have run the proof for fifty years." },
      { title: "Meaning & growth",
        body: "Live among people building in the same direction and their ambition compounds into yours. As AI rewrites what work is for, meaning has to come from somewhere sturdier than a job title — and for most of human history, it came from each other." },
      { title: "Resilience",
        body: "A street of strangers is fragile. A community with its own food, energy, skills and mutual aid bends where isolated households break — in a blackout, a downturn, a pandemic, a bad year of your life." }
    ]
  },

  ways: {
    kicker: "And it can be done in so many ways",
    lede: "This is what gives me hope: there isn't one model to get right. There are at least twelve, and every one of them has something to teach the others."
    /* the 12 'teaches' lines render from TYPE_KNOWLEDGE at runtime */
  },

  close: {
    kicker: "Back to hope",
    title: "The future is a place we build on purpose.",
    body: "The solarpunk artists have already drawn it: technology in service of the table, energy from the sun, generations mixed, nobody optional. I don't think that future arrives by accident — I think it gets built, house by house, village by village, by people who decided isolation isn't a law of nature. [edit]",
    images: [
      { src: "images/solarpunk-solar.jpg", credit: "“Dear Alice” — The Line" },
      { src: "images/solarpunk-harvest.jpg", credit: "“Dear Alice” — The Line" }
    ],
    ctas: [
      { label: "Explore the twelve models", href: "map.html" },
      { label: "Read my vision", href: "hope.html" }
    ]
  }
};
