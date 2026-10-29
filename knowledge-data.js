/* =====================================================================
   KNOWLEDGE LAYER — buckets 2 & 3 of the knowledge section.
   - THEMES: the 5 cross-cutting lenses that recur in every model.
   - TYPE_KNOWLEDGE: per-type deep-dive content, keyed by the slug used
     in map-data.js. origin / teaches / best (theme keys) / themes notes.
   - WHY: content for why.html (hope → how we got here → hope).
   Positions and claims are editorial; stats reuse the fact-checked set
   in data.js (HOPE.crises). marks copy for P-A's voice.
   ===================================================================== */

const THEMES = {
  governance: { label: "Governance", q: "Who decides, and how?" },
  financing:  { label: "Financing & ownership", q: "Who pays, who owns?" },
  space:      { label: "Space design", q: "What does the architecture do?" },
  community:  { label: "Community & events", q: "How is togetherness made?" },
  operations: { label: "Management & operations", q: "Who keeps it running?" },
  privacy:    { label: "Privacy & conflict", q: "How much is yours, and what happens when people disagree?" },
  leaving:    { label: "Leaving & growing old", q: "What happens when you move on, or stay for life?" }
};

const TYPE_KNOWLEDGE = {
  "ecovillage": {
    hero: { src: "images/ex-tamera.jpg", cap: "Tamera ecovillage, Portugal: a whole re-watered valley settlement" },
    /* spots: at most 7 labels per guide (P-A, 2026-10-29). Each label (lx,ly = where it sits) points
       at one or more places in the drawing (to = [x,y] pairs), all in % of the drawing */
    diagram: { src: "images/generated/sketch-ecovillage.webp", cap: "How an ecovillage organizes: homes clustered around a commons, gardens and energy systems at the edges",
      spots: [
        { t: "The forest kept wild", lx: 31, ly: 2, to: [[38, 26]], p: "Part of the land stays wild on purpose. It shelters wildlife and gives the village firewood and quiet." },
        { t: "Making its own energy", lx: 83, ly: 4, to: [[66.5, 26], [80, 31]], p: "Solar panels and a wind turbine make much of the village’s power, and a battery shed keeps it for the evening. They sit at the edge, so the homes stay quiet." },
        { t: "The food system", lx: 12, ly: 13, to: [[26, 44], [13, 51]], p: "Fields and a greenhouse feed much of the village, often grown with permaculture. Work days in the fields are part of the week." },
        { t: "The village commons", lx: 85, ly: 49, to: [[59.5, 57.5], [53, 63]], p: "Homes face a shared green with a fire circle, where children play, neighbours meet and the village celebrates." },
        { t: "Water and shared tools", lx: 15, ly: 90, to: [[21.8, 60.5], [25.5, 64.5]], p: "Rain from the roofs is caught for the gardens. One tool shed for everyone means each home can own less." },
        { t: "Car-free paths", lx: 33, ly: 101, to: [[46.5, 66.5]], p: "Cars stay at the edge. The paths are for walking and cycling, so children can roam safely." },
        { t: "Small homes and their gardens", lx: 64, ly: 101, to: [[48, 79], [77, 80]], p: "Homes are small, built from timber or straw with green roofs, each with a garden by the door. Most of life happens outside them." }
      ] },
    origin: "Born from the 1960s to 70s back-to-the-land movement and matured through permaculture; the Global Ecovillage Network formalized it in 1995. The oldest sites are now on their third generation.",
    teaches: "A community can own its whole stack (food, energy, decisions) and live lighter for it.",
    best: ["governance", "operations"],
    themes: {
      governance: "The pioneers of consensus and sociocracy. Decades of trial and error produced the most sophisticated decision-making culture on the map.",
      financing: "Land trusts and member equity keep the land off the market, usually built on decades of sweat equity rather than capital.",
      space: "Settlement-scale design: clustered homes, shared infrastructure, food and energy production folded into the site plan.",
      community: "Belonging through shared work (work parties, seasonal festivals, rituals), not just shared meals.",
      operations: "Near-total self-management. There is a committee for everything from compost to conflict, and it mostly works."
    }
  },
  "cohousing": {
    hero: { src: "images/cohousing-denmark.jpg", cap: "A Danish cohousing courtyard: shared ground between private homes" },
    diagram: { src: "images/generated/sketch-cohousing.webp", cap: "Cohousing: private homes along a car-free lane, with a common house for shared meals",
      spots: [
        { t: "Private homes", lx: 14, ly: 20, to: [[22, 50], [33, 38]], p: "Each household has a full home of its own, with its own kitchen and front door. Homes are often a little smaller than usual, because so much is shared." },
        { t: "The common house", lx: 62, ly: 4, to: [[72, 22]], p: "The heart of the place, with a big kitchen and dining room where neighbours share a few meals a week. Extra rooms like a guest room live here too, so homes can stay smaller." },
        { t: "Porches facing the lane", lx: 12, ly: 63, to: [[25, 55], [36, 46]], p: "Front porches and kitchen windows face the lane on purpose. You see who passes, and a chat starts without planning it." },
        { t: "The car-free lane", lx: 24, ly: 88, to: [[30, 69]], p: "Cars stop at the edge, so the lane between the homes becomes a safe place for children to play and neighbours to stop and talk." },
        { t: "Shared gardens and play", lx: 80, ly: 84, to: [[70, 67], [57, 73]], p: "Gardens and play areas are shared, so children have a bigger world and grown-ups have a reason to work side by side." },
        { t: "Parking at the edge", lx: 89, ly: 20, to: [[89, 42]], p: "Parking sits at the edge of the site. Walking the last bit home is how you run into your neighbours." }
      ] },
    origin: "Denmark, 1972: Sættedammen was built after Bodil Graae's essay argued 'children should have a hundred parents.' Architect-led, resident-designed, and copied worldwide ever since. Sweden grew its own version, the collective house: from the 1930s with paid staff in a central kitchen, and from the late 1970s with residents cooking for each other.",
    teaches: "Design the common house right and community becomes the default instead of the effort.",
    best: ["space", "community"],
    themes: {
      governance: "Resident-led from day one. The future neighbours design the site together before anything is built.",
      financing: "Conventional private ownership plus shared common assets. You pay a normal price; the dividend is belonging.",
      space: "The masterclass: cars at the edge, the common house on everyone's desire path, private homes that don't isolate.",
      community: "The shared meal a few nights a week is the engine. Fifty years of Danish data says: keep the meal, keep the community.",
      operations: "Cooking rotas and committees: light structure carried by heavy participation."
    }
  },
  "housing-coop": {
    hero: { src: "images/coop-denmark.jpg", cap: "Residents of a housing co-op, out between their homes" },
    diagram: { src: "images/generated/diagram-housing-coop.jpg", cap: "Housing co-op structure: residents collectively own the building through a share model" },
    origin: "Rooted in 19th-century worker cooperatives; scaled by Zurich and Vienna across the 20th century until co-ops became ordinary civic infrastructure: a fifth of Zurich lives in one.",
    teaches: "Take the building off the market and the community stops being a commodity.",
    best: ["financing", "governance"],
    themes: {
      governance: "One member, one vote, democratic to the bone, and sometimes slow because of it.",
      financing: "The crown jewel: collective ownership, at-cost rent, permanently decommodified. Nobody can be flipped out of their home.",
      space: "From plain postwar blocks to the cluster-apartment innovation of Kalkbreite, co-ops now lead Europe's housing experiments.",
      community: "Structure guarantees fairness, not friendship. The best co-ops program deliberately for the social layer.",
      operations: "Professional staff answering to resident boards: the most institutional self-management on the map."
    }
  },
  "baugruppen": {
    hero: { src: "images/type-baugruppen.jpg", cap: "A Berlin Baugruppe - resident-developed housing" },
    diagram: { src: "images/generated/sketch-baugruppen.webp", cap: "Baugruppe: households design and build their apartment house together",
      spots: [
        { t: "Flats each household designed", lx: 18, ly: 18, to: [[41, 40], [38, 57]], p: "Every household plans its own flat, so no two are the same. One wants a big kitchen, another an extra room for a parent." },
        { t: "The roof garden", lx: 30, ly: 5, to: [[48, 15], [34, 30]], p: "A shared roof garden gives every flat, even the lowest, a place in the sun." },
        { t: "Built green: timber and sun", lx: 86, ly: 10, to: [[59, 19], [67, 48]], p: "Many groups build with a timber frame, solar panels and very low energy use. The people paying for the building will also pay its bills." },
        { t: "The group and its architect", lx: 30, ly: 99, to: [[48, 85]], p: "A group of households hires an architect together and designs the building around their own needs. With no developer taking a profit, the homes often cost less." },
        { t: "Shared rooms on the ground floor", lx: 64, ly: 98, to: [[62, 76]], p: "Groups often keep the ground floor for shared rooms like a workshop or a guest room, sometimes with a space open to the street." },
        { t: "The courtyard", lx: 8, ly: 92, to: [[24, 84]], p: "The garden behind the building belongs to everyone. The group met there while building, and neighbours still do." }
      ] },
    origin: "Germany after reunification: groups in Berlin, Freiburg and Tübingen started acting as their own developers in the 1990s to 2000s, and cities began zoning for them on purpose.",
    teaches: "Cut out the developer and you can afford both beauty and neighbours.",
    best: ["financing", "space"],
    themes: {
      governance: "A project democracy, intense while building, relaxed once everyone moves in.",
      financing: "Self-developing removes the 20 to 30% developer margin. The group carries the construction risk it just saved on.",
      space: "Architect-led custom design with shared roofs, courtyards and common rooms baked in from the first sketch.",
      community: "Forged before move-in: surviving a construction project together is the bonding ritual.",
      operations: "Runs like a well-made condominium afterwards. The intensity is all front-loaded."
    }
  },
  "kibbutz": {
    hero: { src: "images/ex-nir-david.jpg", cap: "Kibbutz Nir David, Israel" },
    diagram: { src: "images/generated/sketch-kibbutz.webp", cap: "Kibbutz: the dining hall at the centre, homes around it, fields and industry at the edges",
      spots: [
        { t: "Fields, orchards and greenhouses", lx: 22, ly: 9, to: [[22, 40], [40, 27], [65, 30]], p: "Farming built the kibbutz and still feeds part of its economy. Members used to work the land in rotation." },
        { t: "The dining hall", lx: 55, ly: 5, to: [[64, 50]], p: "Members once ate every meal together here, and it was the centre of kibbutz life. Many kibbutzim now open it only for some meals and celebrations." },
        { t: "Children's houses and school", lx: 83, ly: 9, to: [[84, 44]], p: "For decades children slept in children’s houses and were raised partly by the community. That ended in the 1990s, and the school and daycare are still shared." },
        { t: "The factory", lx: 11, ly: 88, to: [[17, 67]], p: "Most kibbutzim added industry, from plastics to drip irrigation. The factory’s income was shared by everyone." },
        { t: "Members' homes", lx: 40, ly: 97, to: [[33, 60], [41, 70], [58, 70]], p: "Homes were modest and alike, since housing came with membership. Today many kibbutzim let members own and enlarge their homes." },
        { t: "The assembly hall", lx: 90, ly: 90, to: [[88, 64]], p: "Big decisions go to the general assembly of all members, one person one vote. The weekly meeting was once as central as the dining hall." }
      ] },
    origin: "Degania, 1910: Zionist-socialist pioneers built full income-sharing villages. At the peak, hundreds of kibbutzim housed over 100,000 people; most privatized after the 1980s crisis.",
    teaches: "Total sharing works, and shows exactly where its limits are.",
    best: ["community", "operations"],
    themes: {
      governance: "The general assembly rules; the institution outranks the individual. Direct democracy at village scale, with all its weight.",
      financing: "Historically full income pooling, the most radical model ever run at scale. Today mostly renewed into partial-sharing forms.",
      space: "The village plan orbits the communal dining hall, architecture built to make collectivism the path of least resistance.",
      community: "Cradle-to-grave belonging. A century of data on what deep community gives, and what it asks.",
      operations: "A complete village economy (farms, factories, services) run as a single enterprise."
    }
  },
  "intergenerational": {
    hero: { src: "images/intergen-japan.jpg", cap: "Multigenerational household, Fujisawa, Japan" },
    diagram: { src: "images/generated/diagram-intergenerational.jpg", cap: "Intergenerational living: mixed-age households share amenities designed for all life stages" },
    origin: "Age-mixed households were humanity's default until about 1950. The deliberate version is recent: Humanitas Deventer began housing students inside a Dutch care home in 2012, and the model went global.",
    teaches: "The generations are each other's missing resource. Housing can broker the trade.",
    best: ["community", "financing"],
    themes: {
      governance: "Usually anchored by a host institution with clear resident agreements: 'being a good neighbour' is defined in writing.",
      financing: "The barter is the innovation: presence exchanged for rent. Care costs drop on both sides of the deal.",
      space: "Care homes and family houses retrofitted for encounter: shared kitchens, gardens, hallways designed to make crossing paths inevitable.",
      community: "The whole point: bonds across generations. Loneliness drops both ways, elders stay active, culture and skills pass down, childcare gets shared.",
      operations: "Matching and expectation-setting is the real work. The model lives or dies on it."
    }
  },
  "hacker-house": {
    hero: { src: "images/ex-hf0-2.jpg", cap: "HF0, San Francisco: founders building side by side" },
    diagram: { src: "images/generated/sketch-hacker-house.webp", cap: "Hacker house: a shared home where the kitchen table and the workbench matter most",
      spots: [
        { t: "Bedrooms, some shared", lx: 13, ly: 7, to: [[17, 25], [34, 24]], p: "Rooms are small or shared, sometimes with bunk beds, which keeps rent low. Most people come for the house around them." },
        { t: "The whiteboard wall", lx: 44, ly: 3, to: [[56, 22]], p: "Ideas go on the wall where everyone passes. Someone always adds to them on the way to the kitchen." },
        { t: "Desks in every corner", lx: 89, ly: 10, to: [[80, 34], [67, 58]], p: "Work happens everywhere, from a desk under the stairs to a laptop on a bed." },
        { t: "The living room for demo nights", lx: 19, ly: 78, to: [[26, 47]], p: "On demo nights the sofa faces the screen, and housemates and guests show what they made that week." },
        { t: "The kitchen table", lx: 22, ly: 95, to: [[44, 66]], p: "The real heart of the house. People eat, argue about ideas and help each other fix their code here, long after dinner." },
        { t: "The build bench", lx: 78, ly: 96, to: [[82, 66]], p: "A garage turned workshop with a 3D printer and a soldering iron, where software people learn to build real things." }
      ] },
    origin: "The Bay Area collectivized its garage myth through the 2000s to 2010s (Rainbow Mansion, countless unnamed leases) and the AI wave revived it at full intensity.",
    teaches: "Curation is a technology: pick the right ten people and the house does the rest.",
    best: ["operations", "community"],
    themes: {
      governance: "Whoever holds the lease decides. Benevolent dictatorship. Usually fine, occasionally not.",
      financing: "A lease and a rent split. The lowest barrier to entry on the entire map: you could start one this month.",
      space: "Bedrooms plus one big table. The whiteboard is the altar; everything else is optional.",
      community: "Peer pressure as a feature. Ambition compounds when you cook dinner next to it.",
      operations: "Near-zero structure, chores by group chat. It works until it doesn't, and that's part of the deal."
    }
  },
  "operator-coliving": {
    hero: { src: "images/ex-cohabs-1.jpg", cap: "Cohabs: design-forward operator coliving, Brussels & NYC" },
    diagram: { src: "images/generated/sketch-operator-coliving.webp", cap: "Operator co-living: private rooms and shared floors, run by a company for one price",
      spots: [
        { t: "The rooftop for events", lx: 38, ly: 4, to: [[60, 16]], p: "The company runs a calendar of events, from rooftop dinners to talks, so new residents meet people in their first week." },
        { t: "A shared kitchen on each floor", lx: 81, ly: 8, to: [[67, 31], [68, 41]], p: "Each floor shares a kitchen, so you cook next to the same few neighbours every day." },
        { t: "Furnished private rooms", lx: 15, ly: 26, to: [[56, 32], [56, 41]], p: "Rooms come ready to live in, with a bed, a desk and storage. You arrive with a suitcase." },
        { t: "Lounge and coworking", lx: 12, ly: 42, to: [[64, 50]], p: "A floor of sofas and long desks, for working from home without working alone." },
        { t: "Gym", lx: 12, ly: 56, to: [[59, 55]], p: "A small gym is part of the package, one less membership to pay for." },
        { t: "Front desk and community manager", lx: 32, ly: 96, to: [[60, 82]], p: "A community manager welcomes newcomers at the front desk and sorts out problems, so you never have to organise anything yourself." },
        { t: "Cleaning and services included", lx: 82, ly: 96, to: [[69, 81]], p: "One monthly price covers everything, cleaning and internet included." }
      ] },
    origin: "The 2015 to 2016 venture wave (The Collective, WeLive, Common) bet that loneliness was a product problem. The crash taught the survivors (Habyt, Cohabs) to run leaner and promise less.",
    teaches: "You can buy convenience, but belonging has to be built. This model proves both halves.",
    best: ["operations", "space"],
    themes: {
      governance: "You're a customer, not a citizen. The operator decides; your vote is your notice period.",
      financing: "Institutional capital at scale, recouped through a rent premium for flexibility and services.",
      space: "Professionally designed commons: hotel-grade lounges, gyms, kitchens. Beautiful, and sometimes soulless.",
      community: "A programmed events calendar. Real friendships happen despite the programming more often than because of it.",
      operations: "The best-run buildings on the map: apps, cleaning, maintenance, zero friction. This is what capital buys."
    }
  },
  "entrepreneur-house": {
    hero: { src: "images/mtl-living-room.jpg", cap: "My Montreal house: the living room" },
    diagram: { src: "images/generated/sketch-entrepreneur-house.webp", cap: "Entrepreneur house: private rooms upstairs, a shared table and work space below",
      spots: [
        { t: "Private bedrooms", lx: 11, ly: 14, to: [[36, 23], [50, 25]], p: "Everyone has a private room upstairs to retreat to after a long day of building." },
        { t: "The quiet work room", lx: 84, ly: 12, to: [[52, 41]], p: "A room behind a glass door for focused work, so the shared spaces can stay social." },
        { t: "The pitch wall", lx: 90, ly: 38, to: [[69, 49]], p: "Everyone’s projects go up on the wall. Housemates test their pitches on each other before facing investors or clients." },
        { t: "The dinner table", lx: 9, ly: 86, to: [[48, 57]], p: "Most decisions happen over dinner. It is also where housemates give each other honest feedback on their projects." },
        { t: "The event corner", lx: 80, ly: 96, to: [[67, 64]], p: "The house hosts talks and dinners for its wider circle, a steady source of mentors and new friends." }
      ] },
    origin: "The middle path between the hacker house's chaos and the operator's sterility: one lived-in house, one intentional host, a curated handful of builders. My own practice sits here.",
    teaches: "One person with intention can curate a household that changes its members' trajectories.",
    best: ["community", "space"],
    themes: {
      governance: "Host-led with a strong house culture: light rules, heavy norms, decisions made at the dinner table.",
      financing: "Self-funded on a lease. Sweat and intention instead of capital. Proof the barrier is lower than it looks.",
      space: "Behavioral design on no budget: focus rooms, gathering tables, stillness corners. Every room gets a job.",
      community: "Curated like a founding team: applications, interviews, chemistry. The selection is the product.",
      operations: "The host carries it. The design challenge is making community self-sustaining before the host burns out."
    }
  },
  "rural-coliving": {
    hero: { src: "images/rooral-lunch.jpg", cap: "Rooral, Benarrabá: a cohort lunch over the Andalusian hills" },
    diagram: { src: "images/generated/sketch-rural-coliving.webp", cap: "Rural co-living: a restored farm next to an old village, with work and harvest shared",
      spots: [
        { t: "The restored farmhouse", lx: 16, ly: 10, to: [[30, 55], [44, 42]], p: "An old farmhouse brought back to life, often one the village had left empty for years." },
        { t: "The new rooms", lx: 42, ly: 7, to: [[56, 45]], p: "A modern wing adds private rooms with good light and fast internet, for people staying a month or more." },
        { t: "The village next door", lx: 62, ly: 5, to: [[87, 12]], p: "Guests spend their money and time in the old village, at its café and shops. Some projects use this to bring life back to villages that were emptying out." },
        { t: "Vines, olives and gardens", lx: 13, ly: 95, to: [[14, 70], [30, 32], [64, 72]], p: "The farm still works. Guests can help with the harvest, and the kitchen cooks from its own garden." },
        { t: "The shared courtyard", lx: 50, ly: 99, to: [[47, 60]], p: "Meals happen at the long table outside. For most guests this is where a group of strangers becomes a group of friends." },
        { t: "The coworking barn", lx: 86, ly: 92, to: [[77, 60]], p: "The old barn is now a shared office with fast internet, its doors open onto the fields." }
      ] },
    origin: "Remote work met rural depopulation: Sende opened in a 30-person Galician hamlet in 2013, Rooral followed in Andalusia in 2020, and a movement of village revivals is forming behind them.",
    teaches: "Urban loneliness and rural decline are the same problem. Move the people, and both start to heal.",
    best: ["community", "operations"],
    themes: {
      governance: "A host organization curates the cohort; the village itself sets the rhythm of life.",
      financing: "Cheap rural buildings plus subscription stays: the economics of empty Spain meeting remote salaries.",
      space: "Repurposed village houses; the town square becomes the common room and the grandmother's kitchen the amenity.",
      community: "Two layers at once: instant cohort intimacy, and intergenerational ties with the villagers.",
      operations: "Turnkey cohort logistics: you arrive with a laptop, everything else is handled."
    }
  },
  "network-village": {
    hero: { src: "images/ex-network-school.jpg", cap: "Network School: a real network village node" },
    diagram: { src: "images/generated/sketch-network-village.webp", cap: "Network village: buildings around green courtyards, linked to a city and to other villages",
      spots: [
        { t: "Homes around courtyards", lx: 13, ly: 14, to: [[20, 40], [41, 20]], p: "Members live in buildings grouped around green courtyards, with a mix of short and long stays." },
        { t: "The shared work hub", lx: 33, ly: 4, to: [[59, 46]], p: "Most members work remotely or on their own ventures, so the work hub sits at the centre of the village." },
        { t: "Green courtyards", lx: 56, ly: 4, to: [[49, 33], [40, 44]], p: "The courtyards are planted and car-free, so the walk from home to work passes through a garden." },
        { t: "The shuttle stop to the city", lx: 82, ly: 2, to: [[89, 27], [88, 10]], p: "Network villages stay linked to a nearby city and to sister villages around the world. Members move between them." },
        { t: "Café and amphitheatre", lx: 82, ly: 94, to: [[76, 58], [63, 72]], p: "Talks, classes and festivals happen in the amphitheatre, and the café keeps people crossing paths all day." },
        { t: "Bike and walk paths", lx: 14, ly: 96, to: [[37, 89], [21, 74]], p: "A loop of paths ties everything together. Cars are rare, so people run into each other on the way." }
      ] },
    origin: "Internet communities deciding to become physical: Zuzalu's two-month pop-up in Montenegro (2023) lit the fuse; Esmeralda and a wave of 'network villages' are now iterating toward permanence.",
    teaches: "Community can precede place. The internet lets a village form before it lands.",
    best: ["financing", "governance"],
    themes: {
      governance: "Live experiments, from token votes to benevolent founders. Genuinely new, genuinely unproven.",
      financing: "The most capital on the map: crypto wealth, venture money, patron funding. Buying land is the easy part.",
      space: "Pop-up first: rented hotels and venues, iterating toward built neighbourhoods and eventually towns.",
      community: "Pre-filtered by internet affinity: intense, aligned, homogenous, and increasingly self-aware about that.",
      operations: "Event operations maturing into town operations. They are still learning garbage collection, literally."
    }
  },
  "student-coop": {
    hero: { src: "images/ex-campus1-mtl.jpg", cap: "Campus1 Montréal: student cooperative housing" },
    diagram: { src: "images/generated/sketch-student-coop.webp", cap: "Co-op house: a big shared home its members run themselves",
      spots: [
        { t: "Small private bedrooms", lx: 16, ly: 10, to: [[39, 27], [51, 31], [61, 31]], p: "Each member has a small room of their own. The rest of the house belongs to everyone." },
        { t: "The chore board", lx: 50, ly: 4, to: [[45, 41]], p: "The chore wheel turns each week. Everyone does a share of the work, which keeps the rent at cost." },
        { t: "The house meeting", lx: 88, ly: 24, to: [[63, 50]], p: "Members run the house themselves. The weekly meeting decides everything from new members to who fixes the sink." },
        { t: "The big shared kitchen", lx: 12, ly: 38, to: [[39, 46]], p: "Members take turns cooking for the whole house, so most nights dinner is ready when you get home." },
        { t: "The bike shed", lx: 8, ly: 86, to: [[20, 58]], p: "Bikes are the house car. The shed out back keeps a dozen of them dry." },
        { t: "Shared bathrooms and laundry", lx: 50, ly: 98, to: [[56, 69], [61, 68]], p: "Bathrooms and the laundry are shared, with a schedule on the door when the house is full." },
        { t: "The vegetable garden", lx: 88, ly: 93, to: [[78, 78]], p: "Members grow some of their own food and cook it in the shared kitchen." }
      ] },
    origin: "Depression-era students who couldn't afford rent started running their own houses, Berkeley's system dates to 1933, and NASCO federated the movement across North America.",
    teaches: "Governance is learnable. Give nineteen-year-olds a house and they'll learn democracy by doing dishes.",
    best: ["governance", "financing"],
    themes: {
      governance: "Elected officers, weekly house meetings, real budgets: democracy as a teaching tool, on purpose.",
      financing: "Roughly half market rent through shared labour and nonprofit ownership. The cheapest seat on the map.",
      space: "Big old houses with industrial kitchens and decades of patina: beauty by accumulation, not design.",
      community: "Total-immersion belonging that resets every few years as students graduate. The institution remembers what individuals forget.",
      operations: "Chore charts at scale, enforced by peers. Half the people on the rest of this map learned the craft here."
    }
  }
};

/* =====================================================================
   WHY — content for why.html. Arc: hope → how we got here → hope.
   Crisis stats are pulled at runtime from HOPE.crises (data.js) — not
   duplicated here. Solarpunk stills from "Dear Alice" (The Line studio),
   used as inspiration imagery with credit. marks P-A voice spots.
   ===================================================================== */
const WHY = {
  eyebrow: "Why co-living",
  title: "Start with the ending.",
  vignette: [
    "It's a Sunday morning, some years from now. Twenty people are eating at one long table under a tree: kids, founders, a retired carpenter teaching a nine-year-old how to hold a chisel. Someone's startup got funded this week; someone else's tomatoes came in. Nobody drove anywhere to be here.",
    "This isn't a commune fantasy or a rendering from a developer's brochure. Every piece of that morning already exists somewhere: in a Danish common house, a Zurich co-op, a Galician village, a Montreal living room. It just hasn't been put together at scale yet.",
    "That's the work I want to do. But first, be honest about why it matters."
  ],
  vignetteImage: { src: "images/solarpunk-feast.jpg", credit: "Still from “Dear Alice”, The Line studio. The future, drawn the way it could feel." },

  turn: {
    kicker: "How we got here",
    lede: "Four slow emergencies, decades in the making, all pointing at the same root: how, and with whom, we live."
    /* the 4 stats render from HOPE.crises.items at runtime */
  },

  lenses: {
    kicker: "The case, lens by lens",
    lede: "Co-living isn't one argument. It's the same answer arriving from six different directions.",
    items: [
      { title: "Health & longevity",
        body: "The Harvard study's 85-year answer (good relationships keep us happier and healthier) isn't a metaphor, it's medicine. Face-to-face community predicts lifespan on par with not smoking. Housing that produces daily human contact is a health intervention wearing a building's clothes." },
      { title: "Economics",
        body: "One household per overpriced home is the most expensive way humans have ever lived. Pool the walls and the washing machines and everything gets cheaper: co-ops run at cost forever, building groups cut out the developer's margin, and shared childcare and tools quietly return thousands a year." },
      { title: "Elders & children",
        body: "Put the generations back within reach of each other and the trade is spectacular: elders stay active and needed, kids gain a dozen extra adults, care costs fall on both ends, and craft and culture pass down at the kitchen table instead of dying in a care home." },
      { title: "Ecology",
        body: "The greenest building is the one you share. Fewer square metres per person, shared energy, shared cars, shared things. Community is a climate technology that happens to also feel like belonging. The ecovillages have run the proof for fifty years." },
      { title: "Meaning & growth",
        body: "Live among people building in the same direction and their ambition compounds into yours. As AI rewrites what work is for, meaning has to come from somewhere sturdier than a job title. For most of human history, it came from each other." },
      { title: "Resilience",
        body: "A street of strangers is fragile. A community with its own food, energy, skills and mutual aid bends where isolated households break: in a blackout, a downturn, a pandemic, a bad year of your life." }
    ]
  },

  ways: {
    kicker: "And it can be done in so many ways",
    lede: "This is what gives me hope: there isn't one model to get right. There are many, and every one of them has something to teach the others."
    /* the 12 'teaches' lines render from TYPE_KNOWLEDGE at runtime */
  },

  close: {
    kicker: "Back to hope",
    title: "The future is a place we build on purpose.",
    body: "The solarpunk artists have already drawn it: technology in service of the table, energy from the sun, generations mixed, nobody optional. I don't think that future arrives by accident. I think it gets built, house by house, village by village, by people who decided isolation isn't a law of nature.",
    images: [
      { src: "images/solarpunk-solar.jpg", credit: "“Dear Alice”, The Line" },
      { src: "images/solarpunk-harvest.jpg", credit: "“Dear Alice”, The Line" }
    ],
    ctas: [
      { label: "Explore the ways of living", href: "map.html" },
      { label: "See what's coming next", href: "arts.html" }
    ]
  }
};
