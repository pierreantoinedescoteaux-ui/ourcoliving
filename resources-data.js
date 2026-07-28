/* =====================================================================
   RESOURCES DIRECTORY CONTENT LAYER — resources.html
   Pointers to organizations that have ALREADY mapped the territory —
   this page is a directory of directories, not a duplicate of them.
   v2 (2026-07-22): categorized (maps & directories / networks &
   movements / learning & how-to) + 6 new entries (Agartha + 5 peers,
   links curl-verified live). Each entry links the SPECIFIC useful
   subpage, not just the homepage, when a deeper page is the value.
   v3 (2026-07-28): GEN + FIC also appear under networks (cat:'networks',
   separate entries from their maps-category listing above) — feeds the
   new networks.html "Networks & movements" page. Same organizations,
   framed here as the people/movement, not the directory.
   ===================================================================== */

const RESOURCE_CATS = [
  { key: "maps",     name: "Maps & directories",   line: "Where the existing communities are — searchable, by region and model." },
  { key: "networks", name: "Networks & movements", line: "The people organizing the space — associations, gatherings, pop-up villages." },
  { key: "learning", name: "Learning & how-to",    line: "How it's actually done — writing, courses and hard-won practice." }
];

const RESOURCES = [
  /* ---- maps & directories ---- */
  {
    name: "Foundation for Intentional Community (FIC)",
    cat: "maps",
    url: "https://www.ic.org",
    def: "The oldest and largest directory of intentional communities — a searchable worldwide map of thousands of existing communities and forming groups, plus courses, a bookstore, classifieds and consultants for starting or joining one."
  },
  {
    name: "Global Ecovillage Network (GEN)",
    cat: "maps",
    url: "https://ecovillage.org",
    def: "The worldwide network of ecovillages and regenerative communities — regional maps and project database across every continent, plus Ecovillage Design Education: the closest thing to a curriculum for building a village."
  },
  {
    name: "Eurotopia",
    cat: "maps",
    url: "https://www.eurotopia.de/en/",
    def: "The closest thing Europe has to FIC's directory — a searchable database of intentional communities and ecovillages, strongest in the German-speaking countries but covering the wider continent, refreshed with a new print edition each spring."
  },
  {
    name: "Cohousing Alliance",
    cat: "maps",
    url: "https://cohousingalliance.org/cohousing-directory-map-and-metrics/",
    linkLabel: "Open the directory & map",
    def: "The US national body for cohousing (formerly the Cohousing Association of the US) keeps a directory and map of American cohousing communities with basic self-reported stats — the place to look if you mean cohousing specifically: shared facilities, resident-run, privately owned homes."
  },

  /* ---- networks & movements ---- */
  {
    name: "Agartha",
    cat: "networks",
    url: "https://www.agartha.one/map",
    linkLabel: "Open the map",
    def: "Agartha keeps a map (agartha.one/map) of solarpunk and regenerative communities — a network with one foot in tech/web3 and one in coliving, mainly in the US and Europe but growing internationally. They periodically host pop-up villages and month-long residencies for people in the space to learn and co-build together."
  },
  {
    name: "Co-Liv",
    cat: "networks",
    url: "https://co-liv.org/",
    def: "The trade-association side of coliving — a global network of operators, investors and designers with its own summit and a deep research library. Less useful if you're looking for a place to live; very useful if you want to understand who is building the industry."
  },
  {
    name: "UK Cohousing Network",
    cat: "networks",
    url: "https://cohousing.org.uk/members-directory/",
    linkLabel: "Open the members directory",
    def: "The UK's national cohousing body — a directory of UK groups plus a short course for people seriously considering starting or joining one. A good complement to the US- and Europe-heavy directories above."
  },
  {
    name: "GEN — Global Ecovillage Network",
    cat: "networks",
    url: "https://ecovillage.org",
    def: "Also the closest thing this movement has to a governing body — regional chapters, a members' assembly and Ecovillage Design Education convene ecovillagers across every continent, not just list them. If you want to find your people, not just find a place, this is where they gather."
  },
  {
    name: "FIC — Foundation for Intentional Community",
    cat: "networks",
    url: "https://www.ic.org/",
    def: "Beyond its directory, FIC is a working membership organization — conferences, a bookstore, classifieds and consultants that have kept the wider intentional-communities movement connected for decades. The people, not just the map."
  },

  /* ---- learning & how-to ---- */
  {
    name: "Supernuclear",
    cat: "learning",
    url: "https://supernuclear.substack.com/",
    def: "The best ongoing read on the culture side of coliving — practical, opinionated essays on hosting, community facilitation and what actually kills a community, written by people who have run these houses and still publishing."
  }
];
