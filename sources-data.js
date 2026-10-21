/* =====================================================================
   SOURCES — the project's growing reference list (public).
   Feeds the one-line credits on pages and, later, the credits page.
   FOR AGENTS: check this list BEFORE researching anything; add every new
   source you use AFTER. One entry per source:
     id, title, author, year, url, kind (guide|book|article|website|
     directory|report|video), lang (en|fr|sv...), topics [], usedOn [],
     added (YYYY-MM-DD), checked (true = someone confirmed it exists and
     says what we cite it for), note.
   Only cite entries with checked: true on the site.
   ===================================================================== */
const SOURCES = [
  { id: "guide-cohabitat", title: "Guide du cohabitat", author: "Village Urbain", year: 2026, url: "https://villageurbain.org",
    kind: "guide", lang: "fr", topics: ["cohousing", "definition", "legal", "money", "governance", "building", "setting", "size", "phases"],
    usedOn: ["map-data.js"], added: "2026-10-21", checked: true,
    note: "359 pages, all rights reserved: original writing only, short credited quotes. Its own facts and bibliography need checking: several case facts were wrong (Lachine move-in date, Petaluma operator) and some references look garbled. Full text + English summaries: ~/wiki/raw/specialized-knowledge/guide-du-cohabitat/." },
  { id: "village-urbain", title: "Village Urbain", author: "Village Urbain", year: 2026, url: "https://villageurbain.org",
    kind: "website", lang: "fr", topics: ["cohousing", "quebec", "affordability"], usedOn: ["projects-data.js"], added: "2026-10-21", checked: true,
    note: "Québec non-profit developer of affordable cohabitat; started 2019; flagship Un Village à Lachine." },
  { id: "kollektivhus-nu", title: "Kollektivhus NU", author: "Kollektivhus NU", year: 2025, url: "https://kollektivhus.se/",
    kind: "website", lang: "sv", topics: ["cohousing", "kollektivhus"], usedOn: ["map-data.js"], added: "2026-10-21", checked: true,
    note: "Swedish national association of collective houses." },
  { id: "gen", title: "Global Ecovillage Network", author: "GEN", url: "https://ecovillage.org",
    kind: "directory", lang: "en", topics: ["ecovillage"], usedOn: ["map-data.js", "resources.html"], added: "2026-10-21", checked: true },
  { id: "nasco", title: "NASCO", author: "North American Students of Cooperation", url: "https://www.nasco.coop",
    kind: "directory", lang: "en", topics: ["co-op house", "students"], usedOn: ["map-data.js"], added: "2026-10-21", checked: true },
  { id: "wiki-ecovillage", title: "Ecovillage", author: "Wikipedia", url: "https://en.wikipedia.org/wiki/Ecovillage",
    kind: "article", lang: "en", topics: ["ecovillage"], usedOn: ["map-data.js"], added: "2026-10-21", checked: true },
  { id: "wiki-cohousing", title: "Cohousing", author: "Wikipedia", url: "https://en.wikipedia.org/wiki/Cohousing",
    kind: "article", lang: "en", topics: ["cohousing"], usedOn: ["map-data.js"], added: "2026-10-21", checked: true },
  { id: "wiki-kibbutz", title: "Kibbutz", author: "Wikipedia", url: "https://en.wikipedia.org/wiki/Kibbutz",
    kind: "article", lang: "en", topics: ["kibbutz"], usedOn: ["map-data.js"], added: "2026-10-21", checked: true },
  { id: "wiki-baugruppe", title: "Baugruppe", author: "Wikipedia", url: "https://en.wikipedia.org/wiki/Baugruppe",
    kind: "article", lang: "en", topics: ["baugruppe"], usedOn: ["map-data.js"], added: "2026-10-21", checked: true },
  { id: "wiki-coliving", title: "Coliving", author: "Wikipedia", url: "https://en.wikipedia.org/wiki/Coliving",
    kind: "article", lang: "en", topics: ["coliving", "operator coliving"], usedOn: ["map-data.js"], added: "2026-10-21", checked: true },

  /* from the guide's bibliography: exist as far as we know, but confirm the details before citing */
  { id: "mccamant-durrett-2011", title: "Creating Cohousing: Building Sustainable Communities", author: "Kathryn McCamant, Charles Durrett", year: 2011,
    kind: "book", lang: "en", topics: ["cohousing", "design", "phases"], usedOn: ["map-data.js"], added: "2026-10-21", checked: true,
    note: "The standard cohousing handbook (New Society Publishers)." },
  { id: "durrett-2009", title: "The Senior Cohousing Handbook (2nd ed.)", author: "Charles Durrett", year: 2009,
    kind: "book", lang: "en", topics: ["cohousing", "seniors"], usedOn: [], added: "2026-10-21", checked: false },
  { id: "christian-2003", title: "Creating a Life Together (FR: Vivre autrement, 2015)", author: "Diana Leafe Christian", year: 2003,
    kind: "book", lang: "en", topics: ["intentional community", "ecovillage", "governance", "legal"], usedOn: [], added: "2026-10-21", checked: false },
  { id: "gicquel-2017", title: "Les clés de l'habitat participatif", author: "Anne Gicquel", year: 2017,
    kind: "book", lang: "fr", topics: ["habitat participatif", "phases"], usedOn: [], added: "2026-10-21", checked: false },
  { id: "uk-cohousing-2020", title: "Practical guide to cohousing", author: "UK Cohousing Network", year: 2020,
    kind: "guide", lang: "en", topics: ["cohousing", "phases", "governance"], usedOn: [], added: "2026-10-21", checked: false },
  { id: "holt-lunstad-2010", title: "Social relationships and mortality risk: a meta-analytic review", author: "Julianne Holt-Lunstad, Timothy B. Smith, J. Bradley Layton", year: 2010,
    url: "https://doi.org/10.1371/journal.pmed.1000316", kind: "article", lang: "en", topics: ["loneliness", "health"], usedOn: [], added: "2026-10-21", checked: false,
    note: "PLOS Medicine 7(7). The guide misquotes the title." },
  { id: "tummers-2016", title: "The re-emergence of self-managed co-housing in Europe: A critical review of co-housing research", author: "Lidewij Tummers", year: 2016,
    kind: "article", lang: "en", topics: ["cohousing", "research"], usedOn: [], added: "2026-10-21", checked: false, note: "Urban Studies 53(10)." },
  { id: "lang-2020", title: "Collaborative housing research (1990–2017): a systematic review", author: "Richard Lang, Claire Carriou, Darinka Czischke", year: 2020,
    kind: "article", lang: "en", topics: ["cohousing", "research"], usedOn: [], added: "2026-10-21", checked: false,
    note: "Housing, Theory and Society. The guide lists a different title and journal; confirm before citing." },
  { id: "larsen-2019", title: "Three phases of Danish cohousing: tenure and the development of an alternative housing form", author: "Henrik Gutzon Larsen", year: 2019,
    kind: "article", lang: "en", topics: ["cohousing", "tenure", "history"], usedOn: [], added: "2026-10-21", checked: false, note: "Housing Studies 34(8)." }
];
