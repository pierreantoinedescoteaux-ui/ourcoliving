/* =====================================================================
   DESIGNERS — content layer for designers.html ("Designers that inspire
   me", linked from design.html DFC_INSPIRE). Seed list drafted by Claude
   from the practices already cited across the site — P-A curates: cut,
   add, re-voice the "take" lines. All URLs verified at build time.
   ===================================================================== */
const DESIGNERS = {
  eyebrow: "Design for Connection · the shoulders",
  title: "Designers that inspire me.",
  lede: "People far better than me at these decisions — the architects, urbanists and studios this site borrows from. Not a hall of fame: a working list of who I reach for when a design question stumps me. [edit]",
  people: [
    {
      name: "Christopher Alexander",
      who: "Architect & pattern theorist",
      known: "A Pattern Language · The Timeless Way of Building",
      take: "Start from the life you want in a room — a window seat, a common table at the crossing of paths — and let the building follow. Every pattern on my Design for Connection page is downstream of him.",
      link: { label: "patternlanguage.com", href: "https://www.patternlanguage.com/" },
      site: { label: "His book on the shelf", href: "inspiration.html" }
    },
    {
      name: "Jan Gehl",
      who: "Urbanist, Copenhagen",
      known: "Life Between Buildings · the human-scale city",
      take: "Count what people actually do between buildings — sit, linger, talk — then design for that. The reason this site cares about edges, benches and slow streets.",
      link: { label: "gehlpeople.com", href: "https://gehlpeople.com/" }
    },
    {
      name: "Jan Gudmand-Høyer",
      who: "Architect, father of Danish cohousing",
      known: "Sættedammen (1972) — the first bofællesskab",
      take: "He didn't invent a building type, he invented a social contract with a site plan: private homes, one common house, cars at the edge. Fifty years later it still works.",
      link: { label: "The cohousing story", href: "https://en.wikipedia.org/wiki/Cohousing" },
      site: { label: "Cohousing field guide", href: "type.html?t=cohousing" }
    },
    {
      name: "Vandkunsten Architects",
      who: "Studio, Denmark",
      known: "Trudeslund cohousing · decades of social housing",
      take: "The proof that community architecture can be modest, wooden, and quietly beautiful — Trudeslund's car-free lane appears all over this site because I can't stop looking at it.",
      link: { label: "vandkunsten.com", href: "https://vandkunsten.com/" }
    },
    {
      name: "Jeremy McLeod — Breathe",
      who: "Architect, Melbourne",
      known: "Nightingale Housing — at-cost, fossil-free apartments",
      take: "Took the developer out of development: apartments sold at cost to a ballot of future neighbours, with rooftop laundries because clotheslines make friends. A business model as a design tool.",
      link: { label: "nightingalehousing.org", href: "https://nightingalehousing.org/" }
    },
    {
      name: "Duplex Architekten",
      who: "Studio, Zurich",
      known: "Mehr als Wohnen — cluster apartments",
      take: "The cluster flat: a dozen small private suites orbiting one huge shared kitchen. The boldest answer yet to \"how much home do I actually need to own alone?\"",
      link: { label: "duplex-architekten.ch", href: "https://duplex-architekten.ch/" },
      site: { label: "The co-op field guide", href: "type.html?t=housing-coop" }
    },
    {
      name: "Moshe Safdie",
      who: "Architect, Montreal",
      known: "Habitat 67 — \"for everyone a garden\"",
      take: "Stacked density where every unit still gets sky, air and a terrace. It's a twenty-minute walk from my old house — the local reminder that radical housing can be built, because it was.",
      link: { label: "safdiearchitects.com", href: "https://www.safdiearchitects.com/" }
    },
    {
      name: "The Line",
      who: "Animation studio, London",
      known: "\"Dear Alice\" — the solarpunk short",
      take: "Not architects — but nobody has drawn the feeling this site chases better than their two minutes of a garden city at golden hour. The visual north star for every warm pixel here.",
      link: { label: "thelineanimation.com", href: "https://thelineanimation.com/" },
      site: { label: "Their stills, credited, on the manifesto", href: "manifesto.html" }
    }
  ],
  young: "A working list, not a finished one — it grows every time someone builds something worth stealing from."
};
