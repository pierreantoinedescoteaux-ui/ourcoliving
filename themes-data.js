/* =====================================================================
   THEMES LIBRARY — content layer for themes.html. The ~20 recurring
   subjects every community wrestles with, each pointing at where to
   start (on this site first, trusted externals second).
   Seed = the 5 field-guide themes expanded to 20 by Claude; P-A curates.
   Future: grows toward the full ~100-subject map (influencer list TBD).
   ===================================================================== */
const THEMES_LIB = {
  eyebrow: "Coliving Atlas · themes",
  title: "The themes library.",
  lede: "Whatever shape a community takes, the same twenty questions come back. Each card names one, and points you at the best place to start — on this site first, then the people who've gone deepest. [edit]",
  themes: [
    { name: "Governance & decision-making", q: "Who decides, and how, when thirty people share a roof?",
      start: [ { label: "Housing co-op field guide", href: "type.html?t=housing-coop" }, { label: "Sociocracy — how it works", href: "https://en.wikipedia.org/wiki/Sociocracy", ext: true } ] },
    { name: "Financing & ownership", q: "How do you pay for a place no bank has a checkbox for?",
      start: [ { label: "Baugruppen field guide", href: "type.html?t=baugruppen" }, { label: "Foundation for Intentional Community", href: "https://www.ic.org/", ext: true } ] },
    { name: "Legal structures", q: "Co-op, nonprofit, LLC, land trust — what holds the thing together on paper?",
      start: [ { label: "Resources directory", href: "resources.html" }, { label: "FIC know-how", href: "https://www.ic.org/", ext: true } ] },
    { name: "Space & architecture", q: "How the building itself creates — or quietly kills — connection.",
      start: [ { label: "Design for Connection", href: "design.html" }, { label: "Cohousing field guide", href: "type.html?t=cohousing" } ] },
    { name: "Interiors & atmosphere", q: "Nooks, light, long tables — the small moves that change how a room behaves.",
      start: [ { label: "Designing for intimacy", href: "design.html#intimacy" }, { label: "Designers that inspire me", href: "designers.html" } ] },
    { name: "Community building & events", q: "Dinners, rituals, gatherings — how strangers become a household.",
      start: [ { label: "Designing for connection", href: "design.html#connection" }, { label: "Real communities to visit", href: "projects.html" } ] },
    { name: "Management & operations", q: "Chores, budgets, repairs — who actually runs the place, and how much structure is too much?",
      start: [ { label: "Operator co-living field guide", href: "type.html?t=operator-coliving" } ] },
    { name: "Communication & conflict", q: "The skill every community actually runs on — and the reason most that fail, fail.",
      start: [ { label: "Sociocracy — how it works", href: "https://en.wikipedia.org/wiki/Sociocracy", ext: true }, { label: "Resources directory", href: "resources.html" } ] },
    { name: "Finding & choosing members", q: "How to fill a house with the right strangers — selection, trials, onboarding.",
      start: [ { label: "Entrepreneur house field guide", href: "type.html?t=entrepreneur-house" }, { label: "FIC community directory", href: "https://www.ic.org/directory/", ext: true } ] },
    { name: "Food & shared meals", q: "The common table is the community's engine — growing, cooking and eating together.",
      start: [ { label: "Kibbutz field guide", href: "type.html?t=kibbutz" }, { label: "Designing for connection", href: "design.html#connection" } ] },
    { name: "Ecology & regeneration", q: "Living together as a way to live lighter — soil, water, waste, habitat.",
      start: [ { label: "Ecovillage field guide", href: "type.html?t=ecovillage" }, { label: "Global Ecovillage Network", href: "https://ecovillage.org/", ext: true } ] },
    { name: "Energy & infrastructure", q: "Solar on the common roof, heat shared between homes, energy owned by the neighbourhood.",
      start: [ { label: "Ecovillage field guide", href: "type.html?t=ecovillage" }, { label: "The manifesto's village", href: "manifesto.html#could" } ] },
    { name: "Affordability & economics", q: "The actual math: housing costs less when you share more — where the savings really come from.",
      start: [ { label: "Housing co-op field guide", href: "type.html?t=housing-coop" }, { label: "The essay on ownership", href: "separation.html" } ] },
    { name: "Elders & intergenerational life", q: "What happens when grandparents, founders and toddlers share a courtyard on purpose.",
      start: [ { label: "Intergenerational field guide", href: "type.html?t=intergenerational" }, { label: "Real communities: Humanitas & Hogeweyk", href: "projects.html" } ] },
    { name: "Families & children", q: "Raising kids with twenty aunts and uncles down the lane — the original village.",
      start: [ { label: "Cohousing field guide", href: "type.html?t=cohousing" }, { label: "Cohousing Association (US)", href: "https://www.cohousing.org/", ext: true } ] },
    { name: "Health & loneliness", q: "The evidence: what connection does to bodies, minds and lifespans.",
      start: [ { label: "The story we were handed", href: "separation.html" }, { label: "The bookshelf", href: "inspiration.html" } ] },
    { name: "Work & co-working", q: "Living where you work, working where you live — without the two eating each other.",
      start: [ { label: "Hacker house field guide", href: "type.html?t=hacker-house" }, { label: "Rural co-living field guide", href: "type.html?t=rural-coliving" } ] },
    { name: "Culture, ritual & meaning", q: "What a community believes in, celebrates and repeats — the software under the architecture.",
      start: [ { label: "Kibbutz field guide", href: "type.html?t=kibbutz" }, { label: "The essay", href: "separation.html" } ] },
    { name: "Land & buildings", q: "Finding the site: rural acreage, leftover urban buildings, and everything between.",
      start: [ { label: "Network village field guide", href: "type.html?t=network-village" }, { label: "Resources directory", href: "resources.html" } ] },
    { name: "Starting from zero", q: "You and three friends want to do this — the honest first twelve months.",
      start: [ { label: "Resources directory", href: "resources.html" }, { label: "FIC: starting a community", href: "https://www.ic.org/", ext: true }, { label: "Visit one first", href: "projects.html" } ] }
  ],
  young: "Twenty themes today; the full map is closer to a hundred. Each will eventually carry its own resources and people — this is the index growing in public."
};
