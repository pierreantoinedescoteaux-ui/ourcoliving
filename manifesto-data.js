/* =====================================================================
   MANIFESTO CONTENT LAYER — manifesto.html + assumption.html
   v3 (2026-07-11): Eisenstein arc — Story of Separation (gray) vs Story
   of Interbeing (color), each answered by the co-living village.
   Research source: ~/wiki/raw/specialized-knowledge/
   eisenstein-more-beautiful-world-separation-interbeing.md
   `stories` = the 10 live pairs. `assumptions` (13) + `whatifs` = LEGACY
   content bank, preserved (26 verified links) — not rendered on the page.
   [edit] = P-A voice needed.
   ===================================================================== */

const MANIFESTO = {
  eyebrow: "A manifesto",
  title: "What if we built for connection?",
  lede: "The loneliest era in human history is a design problem. This page is about the more beautiful world on the other side of it — and the homes already being built there. [edit]",

  heroImg: {
    src: "images/solarpunk-feast.jpg",
    alt: "A long shared table under a tree — the future drawn as it could feel",
    credit: "Original illustration"
  },

  /* ---- The gray field ---------------------------------------------- */
  fieldIntro: {
    kicker: "The story we were handed",
    title: "The broken status quo.",
    lede: "Most of what feels inevitable about modern life isn’t a law of nature — it’s a story, barely a century old, and it’s cracking. Touch a gray thought.",
    sparkTitle: "What if…"
  },

  /* Each story: gray (Story of Separation, lived & personal) → flip
     (Story of Interbeing, bare utopian statement) → village (how a real
     or imaginary co-living future answers it) + img + essay + reads.
     Desktop scatter position: x (% from left), y (px from field top). */
  stories: [
    {
      slug: "made-of-everyone",
      gray: "You come into this world alone, and you leave it alone.",
      flip: "You are made of everyone you’ve ever loved.",
      village: "A home where your people are already there — mornings, meals and hard days shared by design.",
      img: "images/mtl-brunch-jam.jpg",
      imgAlt: "Housemates sharing a long brunch with music",
      x: 5, y: 30, tone: 0,
      essay: [
        "The deepest assumption of the modern West, Charles Eisenstein argues, is that you are a “skin-encapsulated ego” — a discrete self, bounded by your skin, marooned in an indifferent universe. From that one premise the rest of the math follows: your own everything, safety through walls, love as a private arrangement between two separate bubbles.",
        "The Story of Interbeing starts from the opposite observation: “We are not just a soul encased in flesh. We are each other and we are the world.” Every experience of love is evidence — it only makes sense in that story. A co-living home simply takes the truth literally: a life where the people you’re made of are down the hall, not across town."
      ],
      read: [
        { label: "Living in the gift — Eisenstein (free essay)", href: "https://charleseisenstein.org/essays/living-in-the-gift/" },
        { label: "Why we need utopias — Ghodsee interview", href: "https://www.currentaffairs.org/news/2023/10/why-we-need-utopias" }
      ]
    },
    {
      slug: "more-for-you",
      gray: "More for them means less for you.",
      flip: "More for you is more for me.",
      village: "One long table: one person’s good news becomes everyone’s dinner party.",
      img: "images/rooral-dinner.jpg",
      imgAlt: "A shared dinner table in a village co-living",
      x: 52, y: 120, tone: 1,
      essay: [
        "“More for you is less for me” is the founding axiom of economics — and, Eisenstein points out, a statement of loneliness. It isn’t a fact about the world; it’s a premise that builds the world in its image. Design under scarcity and you get locked doors, property lines and rivals. The premise fulfills itself.",
        "“An economist says that more for you is less for me,” he writes, “but the lover knows that more for you is more for me, too.” A shared house runs on the lover’s math: the garden, the workshop, the long table — everything held in common gains value the more people use it."
      ],
      read: [
        { label: "Sacred Economics — full book, free online", href: "https://sacred-economics.com/read-online/" },
        { label: "Living in the gift — Eisenstein", href: "https://charleseisenstein.org/essays/living-in-the-gift/" }
      ]
    },
    {
      slug: "security",
      gray: "Security is a salary, a lock, and a savings account.",
      flip: "Security is twenty people who would drop everything for you.",
      village: "Twenty housemates are a safety net no insurance company can sell you.",
      img: "images/crew-poolside.jpg",
      imgAlt: "A house crew gathered together poolside",
      x: 24, y: 430, tone: 2,
      essay: [
        "The Story of Separation pursues security through control: contracts, cameras, insurance, accumulation. Eisenstein calls it compensation — “cut off from a life of meaning and purpose, there is nothing left but to stay alive.” The more security we buy, the less we seem to feel.",
        "“Community is woven from gifts,” he writes — “if you are financially independent, then you really don’t depend on your neighbors for anything. You can just pay someone to do it.” The village flips the equation: security as redundancy of care. Not a bigger wall — more hands that would catch you."
      ],
      read: [
        { label: "A circle of gifts — Eisenstein (free essay)", href: "https://charleseisenstein.org/essays/a-circle-of-gifts/" },
        { label: "Klinenberg on social infrastructure — Evergreen", href: "https://www.evergreen.ca/stories/palaces-for-the-people-building-social-infrastructure-with-eric-klinenberg/" }
      ]
    },
    {
      slug: "money-cant-buy",
      gray: "Anything you need, you can pay someone for.",
      flip: "Community is woven from the things money can’t buy.",
      village: "Nobody here hires movers — the hallway fills with hands before you finish asking.",
      img: "images/collab-art-table.jpg",
      imgAlt: "Housemates making things together around one table",
      x: 66, y: 560, tone: 3,
      essay: [
        "“You can’t have community as an add-on to a monetized life,” Eisenstein warns. “You have to actually need each other.” When every need is met by a professional — delivery, daycare, repairs, care itself — the threads of mutual dependence that community is made of are quietly severed, one convenience at a time.",
        "It’s why he notes that poor neighbourhoods often have stronger communities than rich ones. A shared household re-introduces honest need: the couch carried together, the soup that appears when you’re sick. Gifts create the bonds that transactions never will."
      ],
      read: [
        { label: "A circle of gifts — Eisenstein", href: "https://charleseisenstein.org/essays/a-circle-of-gifts/" },
        { label: "Third places as community builders — Brookings", href: "https://www.brookings.edu/articles/third-places-as-community-builders/" }
      ]
    },
    {
      slug: "own-your-time",
      gray: "Time is money, and you never have enough of either.",
      flip: "To be rich is to own your own time.",
      village: "Shared cooking, shared childcare, shared chores — the village gives you back your evenings.",
      img: "images/mtl-patio.jpg",
      imgAlt: "A slow evening on the house patio",
      x: 4, y: 810, tone: 4,
      essay: [
        "“Perhaps the deepest indication of our slavery is the monetization of time,” Eisenstein writes. When time itself carries a price tag, every unpaid moment feels like waste — so we hurry. “From the scarcity of time arises the habit of hurrying; from the scarcity of money, the habit of greed.”",
        "His definition of wealth is sovereignty over your own hours. The village gets there with arithmetic: ten people don’t cook ten dinners or watch ten children separately. Pool the load and the evening comes back — the least mystical, most immediate gift of living together."
      ],
      read: [
        { label: "Sacred Economics — full book, free online", href: "https://sacred-economics.com/read-online/" },
        { label: "Why we need utopias — Ghodsee interview", href: "https://www.currentaffairs.org/news/2023/10/why-we-need-utopias" }
      ]
    },
    {
      slug: "work-gift",
      gray: "You sell your hours and live for the weekend.",
      flip: "Your work is the gift only you can give.",
      village: "Workshops, studios and curious neighbours pull your craft out of the drawer.",
      img: "images/mtl-coworking.jpg",
      imgAlt: "Housemates working side by side in the house coworking room",
      x: 42, y: 930, tone: 0,
      essay: [
        "“We were not supposed to hate Mondays and live for the weekends,” Eisenstein writes. He reads our epidemic of procrastination, burnout and quiet despair not as malfunction but as refusal — the soul withholding participation from a story of work that doesn’t fit it.",
        "In the other story, “all beings have an unquenchable desire to pour forth their gifts.” A home full of curious people is a greenhouse for that: the project you mention at dinner has three collaborators by dessert. Work stops being what you escape from and becomes what you offer."
      ],
      read: [
        { label: "Living in the gift — Eisenstein", href: "https://charleseisenstein.org/essays/living-in-the-gift/" },
        { label: "Technologies of reunion — Eisenstein", href: "https://charleseisenstein.org/essays/institutes-for-technologies-of-reunion/" }
      ]
    },
    {
      slug: "trust",
      gray: "Being cynical is just being realistic.",
      flip: "Trust is how the new world gets built.",
      village: "Doors stay open here — not because it’s naive, but because it works.",
      img: "images/group-doorway.jpg",
      imgAlt: "Friends gathered in an open doorway",
      x: 72, y: 1160, tone: 1,
      essay: [
        "A control-based life is armored by default: contracts for every promise, cameras for every corner, cynicism as the grown-up posture. Eisenstein is honest about the alternative: “the state of interbeing is a vulnerable state… one must leave behind the seeming shelter of a control-based life, protected by walls of cynicism, judgment, and blame.”",
        "Shared homes practice trust as daily infrastructure — the open door, the borrowed car, the unlocked pantry. And generosity is contagious: each unguarded gesture creates what he calls a normalizing field, making the next one easier for everyone nearby."
      ],
      read: [
        { label: "Technologies of reunion — Eisenstein", href: "https://charleseisenstein.org/essays/institutes-for-technologies-of-reunion/" },
        { label: "The Dawn of Everything — overview", href: "https://en.wikipedia.org/wiki/The_Dawn_of_Everything" }
      ]
    },
    {
      slug: "truly-known",
      gray: "You can be surrounded by people and completely unknown.",
      flip: "To be truly known is the deepest form of home.",
      village: "Live with people through the seasons and they learn your weather.",
      img: "images/music-piano-night.jpg",
      imgAlt: "A quiet evening of music at the house piano",
      x: 12, y: 1300, tone: 2,
      essay: [
        "“To be truly seen and heard, to be truly known, is a deep human need,” Eisenstein writes. “Our hunger for it is so omnipresent that we no more know what we are missing than a fish knows it is wet.” A city can hold a million people and no one who notices your quiet day.",
        "Being known isn’t produced by scheduled catch-ups; it’s produced by repetition — seasons of shared kitchens, not calendar invites. That’s the quietest thing a village does: it gives people enough ordinary time together for knowing to happen on its own."
      ],
      read: [
        { label: "Ray Oldenburg on third places — PPS", href: "https://www.pps.org/article/roldenburg" },
        { label: "Technologies of reunion — Eisenstein", href: "https://charleseisenstein.org/essays/institutes-for-technologies-of-reunion/" }
      ]
    },
    {
      slug: "world-alive",
      gray: "The world is indifferent — you’re a speck in it.",
      flip: "The world is alive, and you belong to it.",
      village: "Food in the courtyard, sun on the roof — the village lives inside nature, not next to it.",
      img: "images/solarpunk-harvest.jpg",
      imgAlt: "Harvest in a green future village",
      x: 46, y: 1520, tone: 3,
      essay: [
        "In the Story of Separation, nature is a warehouse of resources and the universe is dead matter — so of course we feel like specks. Eisenstein lists connection to nature among the basic human needs that go “chronically, tragically unmet” in modern life.",
        "The other story treats purpose and intelligence as properties of the living world, not exceptions to it. A village built inside its landscape makes that story walkable: food in the courtyard, sun on the roof, seasons as housemates. Solarpunk isn’t decoration — it’s this sentence, drawn."
      ],
      read: [
        { label: "Living in the gift — Eisenstein", href: "https://charleseisenstein.org/essays/living-in-the-gift/" },
        { label: "The Dawn of Everything — overview", href: "https://en.wikipedia.org/wiki/The_Dawn_of_Everything" }
      ]
    },
    {
      slug: "another-story",
      gray: "This is just how things are.",
      flip: "Another story is already being lived.",
      village: "Thousands already live this way — cohousing, ecovillages, shared houses. The Coliving Atlas maps them.",
      img: "images/proj-trudeslund.jpg",
      imgAlt: "Trudeslund cohousing, Denmark — the other story, built",
      x: 70, y: 1690, tone: 4,
      essay: [
        "Eisenstein says we live in “a space between stories”: the old one no longer produces meaning or safety, but the new one hasn’t fully formed — so its institutions keep running on habit, hollow, while everyone privately senses that “normal isn’t coming back.” The loneliness of this moment is the loneliness of sensing it first.",
        "But the new story isn’t hypothetical. It has addresses: Danish common houses, Zurich co-ops, kibbutzim, farmhouses full of founders, a living room in Montreal. “A miracle is something impossible from an old story and possible from a new one.” The Coliving Atlas on this site maps them."
      ],
      read: [
        { label: "Why we need utopias — Ghodsee interview", href: "https://www.currentaffairs.org/news/2023/10/why-we-need-utopias" },
        { label: "The Dawn of Everything — overview", href: "https://en.wikipedia.org/wiki/The_Dawn_of_Everything" }
      ]
    }
  ],

  /* ---- What it could be (scroll scene) ------------------------------ */
  could: {
    kicker: "What it could be",
    title: "A village within reach.",
    lede: "Not a fantasy — a composition of things that already exist, arranged around connection instead of separation. Scroll, and watch it assemble.",
    possibilities: [
      "Homes you can actually afford.",
      "Food grown where you live.",
      "Connection as the default, solitude as the choice.",
      "Learning that crosses generations.",
      "Energy owned by the neighbourhood."
    ],
    finale: "A future you can walk to. [edit]"
  },

  /* ---- Close (BRIGHT — what this site aims to be) ------------------- */
  close: {
    kicker: "Why this site exists",
    title: "This is a manifesto of hope.",
    body: [
      "I’m not writing this because the world is broken beyond repair. I’m writing it because the opposite keeps proving true: everywhere I look, people are already living the better story — in common houses and co-ops, farmhouses and shared kitchens where thirty people eat well and nobody is lonely. [edit]",
      "Co-living is the piece of that story that gives me the most hope, because I’ve lived it. This site is my attempt to bring more attention to it: to map the shapes it takes, point you toward the projects already building it, and maybe help you find your own way in. [edit]"
    ],
    quote: {
      text: "An economist says that more for you is less for me. But the lover knows that more for you is more for me, too.",
      by: "Charles Eisenstein, The More Beautiful World Our Hearts Know Is Possible"
    },
    ctas: [
      { label: "Explore the Coliving Atlas", href: "map.html",
        keys: "12 shapes of living together · interactive map · field guides" },
      { label: "How design shapes behaviour", href: "design.html",
        keys: "design patterns · connection, intimacy, focus · budget-friendly moves" },
      { label: "About me", href: "about.html",
        keys: "my story · the houses I've run · get in touch" }
    ]
  },

  /* =====================================================================
     LEGACY BANK — v2 content, preserved (not rendered).
     13 researched assumptions with 26 verified links + the original
     what-if lines. Mine for future essays / per-assumption pages.
     ===================================================================== */

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
  ]
};
