/* =====================================================================
   MANIFESTO CONTENT LAYER — manifesto.html
   Super hopeful. Issues appear only as links, never as resident stats.
   ASSUMPTIONS: seed list (Claude draft from Everyday Utopia / Eisenstein /
   general knowledge) — research agent enriching with verified article links;
   `read` arrays get filled/corrected from its report. [edit] = P-A voice.
   ===================================================================== */

const MANIFESTO = {
  eyebrow: "A manifesto",
  title: "What if we built for connection?",
  lede: "I believe the loneliest era in human history is a design problem — and that the most hopeful work of our generation is redesigning how we live together. [edit]",

  whatifs: [
    "What if your neighbours were the safety net?",
    "What if kids grew up with thirty adults who know their name?",
    "What if elders lived at the centre of the village, not the edge of life?",
    "What if your home pushed your best work forward instead of just storing you at night?",
    "What if the table was long enough for everyone?",
    "What if we weren't competing — for houses, for status, for space?"
  ],

  assumptionsIntro: {
    kicker: "Reimagining how we live",
    title: "The assumptions we stopped questioning.",
    lede: "Most of what feels inevitable about housing is barely a century old. These are beliefs we inherited, not laws of nature — and every one of them is being re-questioned somewhere in the world, right now."
  },

  /* Each: assumption (the inherited belief) / crack (why to re-question) /
     read (verified links, researched 2026-07-11 from Everyday Utopia /
     Eisenstein / Jacobs / Oldenburg / Klinenberg / Graeber & Wengrow).
     Ordered: the 4 most jolting openers first. */
  assumptions: [
    {
      slug: "nuclear-family",
      assumption: "The nuclear family is the natural way to organize a household.",
      crack: "The isolated nuclear household is a recent, geographically narrow invention. Kristen Ghodsee traces 2,500 years of humans living otherwise — Pythagorean communes, medieval beguinages, kibbutzim, modern ecovillages — and argues the nuclear form concentrates childrearing pressure and asks romantic partnership to carry a weight it was never designed to bear alone.",
      read: [
        { label: "Why we need utopias — Ghodsee interview", href: "https://www.currentaffairs.org/news/2023/10/why-we-need-utopias" },
        { label: "Everyday Utopia in five ideas", href: "https://nextbigideaclub.com/magazine/everyday-utopia-2000-years-wild-experiments-can-teach-us-good-life-bookbite/43081/" }
      ]
    },
    {
      slug: "own-everything",
      assumption: "Every household needs its own everything.",
      crack: "Thirty kitchens, thirty washing machines idle six days a week, thirty lawnmowers on one street. Ghodsee points at the staggering economies of scale we refuse — and at the hidden cost baked into the design: housing built on the assumption that someone, usually a woman, does the duplicated cooking and cleaning behind each closed door.",
      read: [
        { label: "Ghodsee on the private household — Penn Today", href: "https://penntoday.upenn.edu/news/everyday-utopia-kristen-ghodsee-sas" },
        { label: "Why we need utopias — Current Affairs", href: "https://www.currentaffairs.org/news/2023/10/why-we-need-utopias" }
      ]
    },
    {
      slug: "housing-investment",
      assumption: "Housing is primarily an investment.",
      crack: "When homes must appreciate, scarcity becomes the business model and neighbours become opponents of change — fighting the density, transit and shelters that would make their own streets livable, because their retirement depends on it. Housing treated as consumption instead would be cheap, plentiful, and socially stabilizing.",
      read: [
        { label: "The homeownership society was a mistake — The Atlantic", href: "https://www.theatlantic.com/ideas/archive/2022/12/homeownership-financialization-housing-crisis/672285/" },
        { label: "The financialization of housing — Shelterforce", href: "https://shelterforce.org/2022/08/09/the-financialization-of-housing-and-its-implications-for-community-development/" }
      ]
    },
    {
      slug: "separation",
      assumption: "We are fundamentally in competition with our neighbours.",
      crack: "Charles Eisenstein calls it the Story of Separation. When you can buy every service from strangers, you genuinely don't need your neighbour — and 'I don't need you' quietly forecloses intimacy. Interdependence wasn't a burden our ancestors escaped; it was the very thing that generated their bonds.",
      read: [
        { label: "A circle of gifts — Eisenstein (free essay)", href: "https://charleseisenstein.org/essays/a-circle-of-gifts/" },
        { label: "Living in the gift — Eisenstein (free essay)", href: "https://charleseisenstein.org/essays/living-in-the-gift/" }
      ]
    },
    {
      slug: "parenting-alone",
      assumption: "Raising children is the parents' job alone.",
      crack: "Humans evolved as cooperative breeders — children were raised by networks of adults, and they develop better that way. Two exhausted adults behind one closed door is historically bizarre, and the alternatives are already here: 'mommunes', multi-parent legal frameworks, cohousing where the kids live where the village is.",
      read: [
        { label: "A better way to parent than the nuclear family — Aeon", href: "https://aeon.co/ideas/there-is-a-better-way-to-parent-than-the-nuclear-family" },
        { label: "Why we need utopias — Current Affairs", href: "https://www.currentaffairs.org/news/2023/10/why-we-need-utopias" }
      ]
    },
    {
      slug: "elders-edge",
      assumption: "Elders belong in facilities, at the edge of life.",
      crack: "Age-segregated warehousing is historically anomalous — for most of human history, elders were embedded in the household fabric. The strongest predictor of elder wellbeing is the robustness of their social connections: exactly what facilities systematically remove, and what every intergenerational experiment restores.",
      read: [
        { label: "Klinenberg on social infrastructure — Evergreen", href: "https://www.evergreen.ca/stories/palaces-for-the-people-building-social-infrastructure-with-eric-klinenberg/" },
        { label: "Third places as community builders — Brookings", href: "https://www.brookings.edu/articles/third-places-as-community-builders/" }
      ]
    },
    {
      slug: "privacy-luxury",
      assumption: "Privacy is the ultimate residential luxury.",
      crack: "More private space with no shared space attached produces wealthier isolation. Klinenberg found community resilience — including who survives a disaster — tracks the presence of shared social spaces more than income; Oldenburg showed that without informal public life, living simply gets more expensive and lonelier.",
      read: [
        { label: "Ray Oldenburg on third places — PPS", href: "https://www.pps.org/article/roldenburg" },
        { label: "Third places as community builders — Brookings", href: "https://www.brookings.edu/articles/third-places-as-community-builders/" }
      ]
    },
    {
      slug: "more-space",
      assumption: "More square footage means a better life.",
      crack: "Homes doubled in size while households shrank and happiness flatlined. What predicts wellbeing is connection, not floor area — a small apartment near a living street beats a big house in a subdivision with nowhere to gather. And eight families sharing common space instead of duplicating it collapses the environmental footprint.",
      read: [
        { label: "Why we need utopias — Current Affairs", href: "https://www.currentaffairs.org/news/2023/10/why-we-need-utopias" },
        { label: "Ray Oldenburg on third places — PPS", href: "https://www.pps.org/article/roldenburg" }
      ]
    },
    {
      slug: "private-refuge",
      assumption: "A home is a private refuge — what happens inside is nobody's business.",
      crack: "Total domestic privacy makes the household politically invisible: labour, care and inequality get absorbed behind closed doors without accounting. When domestic work is private it's unvalued; unvalued, it's unshared; unshared, it compounds — and the retreat inward is as much a symptom of social breakdown as a cause.",
      read: [
        { label: "Ghodsee on the private household — Penn Today", href: "https://penntoday.upenn.edu/news/everyday-utopia-kristen-ghodsee-sas" },
        { label: "A circle of gifts — Eisenstein", href: "https://charleseisenstein.org/essays/a-circle-of-gifts/" }
      ]
    },
    {
      slug: "home-work-separation",
      assumption: "Home and work belong in separate zones.",
      crack: "Jane Jacobs called use-segregation the most destructive force applied to 20th-century neighbourhoods: it emptied the sidewalks, killed the eyes on the street, and made daily life car-dependent. The coffee shop and corner store aren't amenities — they're the infrastructure of community, and zoning them away from housing makes neighbourhoods lonelier, not quieter.",
      read: [
        { label: "Ray Oldenburg on third places — PPS", href: "https://www.pps.org/article/roldenburg" },
        { label: "Third places as community builders — Brookings", href: "https://www.brookings.edu/articles/third-places-as-community-builders/" }
      ]
    },
    {
      slug: "scarcity",
      assumption: "Scarcity is the natural condition we design around.",
      crack: "'More for me is less for you' is a produced premise, not a fact — and it's self-fulfilling: design under scarcity and you get locked doors, alarms and property lines; design under abundance and you get shared gardens, open workshops and tool libraries. Neither is more realistic. They are self-fulfilling architectures.",
      read: [
        { label: "Living in the gift — Eisenstein", href: "https://charleseisenstein.org/essays/living-in-the-gift/" },
        { label: "Sacred Economics — full book, free online", href: "https://sacred-economics.com/read-online/" }
      ]
    },
    {
      slug: "this-is-just-modern-life",
      assumption: "Home, commute, work, repeat — that's just how modern life works.",
      crack: "Graeber and Wengrow's Dawn of Everything shows our arrangement is the narrowed residue of 40,000 years of alternatives — including societies built on three freedoms we've designed away: to move and be welcomed, to disobey, and to reimagine the social order. Some of the earliest cities arranged their houses in circles so no one sat at the head.",
      read: [
        { label: "The Dawn of Everything — overview", href: "https://en.wikipedia.org/wiki/The_Dawn_of_Everything" },
        { label: "The three freedoms modern society lacks", href: "https://devonprice.medium.com/the-three-fundamental-human-freedoms-that-modern-society-lacks-bda98e1a2855" }
      ]
    },
    {
      slug: "community-is-joined",
      assumption: "Community is something you join — not something your home creates.",
      crack: "Everyone names community as what's missing, yet it's been architecturally designed out of daily life. Klinenberg's research says shared physical space is the infrastructure through which strangers become neighbours: provide it and community emerges from the ordinary texture of a day; remove it and community becomes a hobby you have to schedule.",
      read: [
        { label: "Technologies of reunion — Eisenstein", href: "https://charleseisenstein.org/essays/institutes-for-technologies-of-reunion/" },
        { label: "Klinenberg on social infrastructure — Evergreen", href: "https://www.evergreen.ca/stories/palaces-for-the-people-building-social-infrastructure-with-eric-klinenberg/" }
      ]
    }
  ],

  close: {
    kicker: "The invitation",
    title: "Imagine first. Then build.",
    body: "None of this is nostalgia, and none of it requires waiting for permission. Every assumption above is already being rebuilt somewhere — in a Danish common house, a Zurich co-op, a village in Andalusia, a living room in Montreal. This site is my map of that territory, and my hand raised to help build the next piece. [edit]",
    ctas: [
      { label: "Explore the atlas", href: "map.html" },
      { label: "See how design shapes behaviour", href: "design.html" },
      { label: "About me", href: "about.html" }
    ]
  }
};
