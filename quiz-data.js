/* =====================================================================
   QUIZ CONTENT LAYER: "Find your way of living together" (quiz.html).
   Questions, letter copy and scoring nudges. The engine lives in
   quiz.html; type ranges come from map-data.js, places from
   projects-data.js. Draft + rationale: FOR PIERRE-ANTOINE/QUIZ-CONTENT-DRAFT.md.
   Answer order is part of the share link: ADD new questions at the END
   of a step's list and bump QUIZ.version, never reorder.
   v4 (2026-10-29): step 4 is a gate. How much you'd share picks one of
   three (own home, a bit of both, a shared home); each shows only the
   questions with that gate in `gates` (no `gates` = every gate).
   v2 (2026-10-28): multi-select stickers, a ranked "hopes" step, slider
   stops, 20 things to care about, "?" notes from hub-cards-data.js.
   A sticker's `hub: "group:id"` points at HUB_CARDS for its "?" note.
   ===================================================================== */
const QUIZ_IMG = "images/hub/";
const QUIZ = {
  version: 5,
  intro: {
    eyebrow: "The lookout · find your fit",
    title: "Find your way of living together",
    lede: "About thirty questions on how you live and what you hope for. At the end there’s a letter waiting for you: what matters to you, the building blocks of a home that fits, a few ways of living close to it, and real places to go and see.",
    note: "About 6 minutes. Skip anything you like. Your answers never leave your browser, which keeps your letter for when you come back. They travel in a link only if you share it.",
    start: "Begin",
    welcome: "Welcome back. Your letter is still here.",
    reopen: "Open my letter",
    fresh: "Start fresh"
  },
  helpImg: "mini-maptech-lens.webp",
  /* every question but the factual ones has a way out: "Open to many things" (pick-any) or "Not sure" */
  open: { multi: "Open to many things", one: "Not sure", img: "mini-quiz-open.webp", mapMore: "See it on the map" },
  more: "Read more in the guide",

  steps: [
    { id: "you", title: "You, today", img: "icon-who.webp",
      lede: "A little about where you are in life, so the letter speaks to you.",
      questions: [
        { id: "base", kind: "chips", noOpen: true, q: "Where are you based?",
          options: ["Quebec", "Elsewhere in Canada", "United States", "Europe", "Somewhere else"] },
        { id: "with", kind: "chips", noOpen: true, q: "Who would come with you?",
          options: ["Just me", "My partner", "My family, with kids", "A few friends", "I’m open"] },
        { id: "life", kind: "chips", noOpen: true, multi: true, q: "Which of these sound like you right now?", hint: "Pick any.",
          options: ["Studying", "Starting out in my 20s or 30s", "Building a company or project", "Raising kids",
            "Raising kids on my own", "Working remotely", "New to the city or the country", "An artist or maker",
            "Going through a change (a move, a breakup, kids leaving home)", "Retired, or getting close"] },
        { id: "setting", kind: "stickers", multi: true, openLabel: "Anywhere good", q: "Where would you love to live?", hint: "Pick any.",
          options: [{ t: "City", img: "mini-setting-city.webp", hub: "setting:city" }, { t: "Suburb", img: "mini-setting-suburb.webp", hub: "setting:suburb" },
            { t: "Countryside", img: "mini-setting-countryside.webp", hub: "setting:countryside" }] }
      ] },

    { id: "hopes", title: "What you hope it brings", img: "icon-social.webp",
      lede: "Why live with others at all? Tap what you hope it would bring you, most important first.",
      questions: [
        { id: "hopes", kind: "rank", q: "What should living together help with?", hint: "Your first three taps are ranked 1, 2, 3. Tap more if they matter too.",
          also: "also",
          options: [
            { t: "Less loneliness", img: "icon-social.webp", said: "less loneliness",
              fit: { cohousing: 1, "student-coop": 1, "operator-coliving": 1, "entrepreneur-house": 1, "hacker-house": 1, ecovillage: 1, kibbutz: 1 } },
            { t: "A home I can afford", img: "mini-money-members.webp", said: "a home you can afford",
              fit: { "student-coop": 3, cohousing: 1, kibbutz: 1 } },
            { t: "Help raising kids", img: "icon-who.webp", said: "help raising kids",
              fit: { cohousing: 3, baugruppen: 2, ecovillage: 1, kibbutz: 1 } },
            { t: "People who share my values", img: "mini-govstyles-assembly.webp", said: "people who share your values",
              fit: { "entrepreneur-house": 2, "hacker-house": 2, ecovillage: 2, "network-village": 2, kibbutz: 1 } },
            { t: "Growing old with people around", img: "icon-leaving.webp", said: "growing old with people around",
              fit: { cohousing: 3, ecovillage: 1 } },
            { t: "A lighter footprint", img: "mini-hosts-farm.webp", said: "a lighter footprint",
              fit: { ecovillage: 3, baugruppen: 1, kibbutz: 1 } },
            { t: "Working and creating with others", img: "mini-hosts-mixed-use.webp", said: "working and creating with others",
              fit: { "entrepreneur-house": 2, "hacker-house": 2, "rural-coliving": 2, "network-village": 1 } }
          ] }
      ] },

    { id: "values", title: "What matters to you", img: "mini-map-compass.webp",
      lede: "Each slider is one of the spectrums on our map. Slide to the spot that sounds like you, and tap the heart on the ones that matter most.",
      questions: [
        { id: "share", kind: "slider", img: "icon-governance.webp", spectrum: "share", heart: true, q: "How much of daily life would you share?", topic: "Sharing",
          stops: ["My own home, a few shared rooms nearby", "My own home, plus a common house", "My own home, and meals together now and then", "My own room, a shared kitchen and living room", "A shared home, most meals together", "A shared home, groceries and chores too", "A shared home, and some of our money"],
          note: { name: "Sharing daily life", href: "map.html?x=share&y=size#map", summary: "At one end you keep your own home and share a few rooms, like in cohousing. At the other end you share a home, meals and even money, like on a kibbutz." },
          said: ["you want your own place with a few shared rooms", "you’d share some of daily life", "you’d share most of daily life"] },
        { id: "size", kind: "slider", img: "mini-size-medium.webp", spectrum: "size", heart: true, q: "How many neighbours feels right?", topic: "Size",
          stops: ["Two or three housemates", "A handful of housemates", "About ten people", "Fifteen to thirty homes", "Thirty to fifty homes", "A neighbourhood, fifty homes or more", "A whole village"],
          said: ["a handful of housemates feels right", "you’d like a group big enough for variety", "you’d love a whole village"] },
        { id: "time", kind: "slider", img: "mini-quiz-time.webp", spectrum: "time", heart: true, q: "How long do you picture staying?", topic: "Staying",
          stops: ["A season", "About a year", "A couple of years", "A few years", "Five years or so", "Ten years or more", "For good"],
          said: ["you picture staying a season or a year", "you picture staying a few years", "you picture staying for good"] },
        { id: "power", kind: "slider", img: "mini-quiz-power.webp", spectrum: "power", heart: true, q: "Who runs the place?", topic: "Running it",
          stops: ["Someone else runs it, I just live there", "Someone else runs it, and asks for my ideas", "They run it, we decide a few things", "We share it with whoever runs it", "We run most of it ourselves", "We run it, with a few people leading", "We all run it together, equally"],
          note: { name: "Who runs the place", href: "map.html?x=power&y=autonomy#map", summary: "Some places are run by a founder or a company, and you mostly get to live there. In others every resident has a say, and the group runs the place itself." },
          said: ["you’d rather someone else ran it", "you’d like some say in how it runs", "you want everyone to run it together"] },
        { id: "autonomy", kind: "slider", img: "mini-quiz-autonomy.webp", spectrum: "autonomy", heart: true, q: "When you and the group want different things…", topic: "You and the group",
          stops: ["My own needs, nearly always", "Mostly my own needs", "Leaning to my needs", "Half and half", "Leaning to the group", "Mostly the group’s needs", "The group’s needs, nearly always"],
          note: { name: "You and the group", href: "map.html?x=power&y=autonomy#map", summary: "Every shared place balances what each person needs with what the group needs. Some leave you lots of freedom, others ask you to put the group first more often." },
          said: ["you’d keep plenty of room for yourself", "you’d balance your needs with the group’s", "you’d often put the group first"] },
        { id: "effort", kind: "slider", img: "mini-quiz-effort.webp", spectrum: "effort", heart: true, oneWay: true, q: "How much would you put in to make it exist?", topic: "Effort to get there",
          stops: ["Move in this year", "Move in next year", "A year or two of work", "A few years of meetings", "Years of planning, some of my savings", "Years of planning and real money", "Land, permits, money, the lot"],
          said: ["you’d like to move in soon", "you’d give a project a few years", "you’d put years into making it exist"] },
        { id: "purpose", kind: "slider", img: "mini-quiz-purpose.webp", spectrum: "purpose", heart: true, q: "Do you want a shared purpose?", topic: "Shared purpose",
          stops: ["Good neighbours is plenty", "Friendly neighbours, a few traditions", "A few shared habits", "A loose shared purpose", "Shared values we live by", "Shared values we act on together", "A mission or belief we share"],
          said: ["good neighbours is plenty for you", "a loose shared purpose appeals to you", "you want a mission you share"] },
        { id: "care", kind: "chips", multi: true, q: "What would you love the place to care about?", hint: "Pick as many as you like.",
          options: ["Growing food", "Making our own energy", "Gardens and nature", "Art and music", "A workshop to make and repair",
            "Kids raised by a village", "Caring for elders", "Shared meals", "Sport and the outdoors", "Meditation or spiritual practice",
            "Books and learning", "Tech and startups", "Working side by side", "Changing the world", "Hosting travellers",
            "Car-free living", "Animals", "Low waste", "Celebrations and rituals", "Quiet and retreat"] }
      ] },

    { id: "gate", gate: true, title: "Your kind of home", img: "mini-quiz-gate-between.webp", skippable: true, skip: "Skip this step",
      eyebrow: "Halfway there",
      change: "Not quite you? Change how much you’d share",
      /* the pause before the gate: a likely direction, never a verdict */
      pause: { lead: "From your answers so far, you might lean toward", yes: "That sounds like me",
        others: "Or one of these might fit you better", switchTo: "Not this one? Switch to" },
      gates: {
        own: { title: "Your own front door", img: "mini-quiz-gate-own.webp", likely: "a home of your own", what: "Your own home, with shared spaces and neighbours close by.",
          pause: "A front door that’s yours, with neighbours you know by name close by.",
          lede: "You’d like a home of your own, with good neighbours close by. A few questions about the life around it." },
        between: { title: "A bit of both", img: "mini-quiz-gate-between.webp", likely: "a bit of both", what: "Your own room or flat, plus shared rooms like a kitchen or a garden.",
          pause: "Some of your own and some shared. Many people start right here, and it keeps lots of doors open.",
          lede: "Some of your own and some shared, or not sure yet. Many people start right here. A few questions to find your balance." },
        shared: { title: "A shared home", img: "mini-quiz-gate-shared.webp", likely: "a shared home", what: "One home shared with others, the kitchen and evenings included.",
          pause: "Sharing a home, with the kitchen and the evenings that come with it.",
          lede: "You’d like to share a home. A few questions about what that looks like day to day." }
      },
      questions: [
        { id: "community", gates: ["own", "between"], kind: "stickers", multi: true, q: "How would you feel the community, day to day?", hint: "Pick any.",
          options: [{ t: "Bumping into neighbours on a walkable street", img: "mini-quiz-walk.webp" },
            { t: "Shared meals now and then", img: "mini-quiz-eat.webp" },
            { t: "Activities and celebrations", img: "mini-quiz-activities.webp" },
            { t: "Neighbours who share my values", img: "mini-quiz-values.webp" },
            { t: "Helping each other out, like with kids or rides", img: "mini-quiz-help.webp" },
            { t: "Growing food together", img: "mini-quiz-food.webp" }] },
        { id: "keep", gates: ["between"], kind: "stickers", multi: true, q: "What would you keep for yourself?", hint: "Pick any.",
          options: [{ t: "My own bathroom", img: "mini-quiz-bath.webp" }, { t: "A small kitchen", img: "mini-quiz-kitchenette.webp" },
            { t: "My own entrance", img: "mini-quiz-entrance.webp" }, { t: "A room to work in", img: "mini-quiz-work.webp" }] },
        { id: "pool", gates: ["shared"], kind: "stickers", multi: true, q: "What would you pool together?", hint: "Pick any.",
          options: [{ t: "Groceries", img: "mini-quiz-groceries.webp" }, { t: "The bills", img: "mini-quiz-bills.webp" },
            { t: "Tools and cars", img: "mini-quiz-tools.webp" }, { t: "Some of our income", img: "mini-quiz-income.webp" }] },
        { id: "give", gates: ["shared"], kind: "chips", img: "icon-toolbox.webp", q: "How much time would you give the house each week?",
          options: ["An hour or two", "Half a day", "A day or more"] },
        { id: "space", kind: "slider", img: "mini-quiz-comfort.webp", q: "How much space and comfort would you like?", topic: "Space and comfort",
          stops: ["Small and simple, light on the earth", "Small, with good shared spaces", "Modest and comfortable", "Comfortable, nothing fancy",
            "Comfortable, with a few nice extras", "Roomy, with shared amenities", "Roomy, with a gym or a pool"] },
        { id: "recharge", kind: "slider", img: "icon-privacy.webp", q: "After a long day, you recharge…", lo: "Alone, door closed", hi: "Around people" },
        { id: "conflict", gates: ["shared"], kind: "slider", img: "mini-govstyles-informal-gov.webp", q: "When something about a housemate bugs you…", lo: "I mostly let it go", hi: "I bring it up and talk it through" },
        /* set when someone picks another gate than the one their answers point to; never shown as a question */
        { id: "gatePick", kind: "chips", hidden: true, noOpen: true, options: ["own", "between", "shared"] }
      ] },

    { id: "setup", title: "How you’d set it up", img: "icon-toolbox.webp",
      lede: "The building blocks of a shared place. Pick what appeals, and tap “?” to learn what an option means. Leave any of them empty and your other answers will choose.",
      questions: [
        { id: "building", kind: "stickers", multi: true, area: "Building", q: "What kind of building?", hint: "Pick any.",
          options: [{ t: "A new build we design together", img: "mini-building-new.webp", hub: "building:new" },
            { t: "An old building with character, given a new life", img: "mini-building-converted.webp", hub: "building:converted" },
            { t: "A mix of both", img: "mini-building-mixed.webp", hub: "building:mixed" }] },
        { id: "hosts", kind: "stickers", multi: true, area: "Building", q: "What else would be on site?", hint: "Pick any.",
          options: [{ t: "Just homes", img: "mini-hosts-homes.webp", hub: "hosts:homes" },
            { t: "Homes with shops, studios or workspaces", img: "mini-hosts-mixed-use.webp", hub: "hosts:mixed-use" },
            { t: "Homes on a farm", img: "mini-hosts-farm.webp", hub: "hosts:farm" }] },
        { id: "meals", kind: "chips", img: "mini-quiz-eat.webp", area: "Social life", q: "How often would you love to eat together?",
          options: ["Now and then", "Once a week", "A few nights a week", "Most nights"] },
        { id: "decisions", kind: "stickers", noOpen: true, area: "Decisions", q: "How should decisions get made?", help: true,
          options: [{ t: "Someone I trust decides", img: "mini-decisions-founder.webp", hub: "decisions:founder" },
            { t: "We vote", img: "mini-decisions-vote.webp", hub: "decisions:vote" },
            { t: "We only go ahead when everyone agrees", img: "mini-decisions-consensus.webp", hub: "decisions:consensus" },
            { t: "We go ahead unless someone has a serious objection", img: "mini-decisions-consent.webp", hub: "decisions:consent" },
            { t: "Whoever cares most decides, after asking around", img: "mini-decisions-advice.webp", hub: "decisions:advice" }] },
        { id: "own", kind: "slider", img: "mini-extra-mailbox.webp", area: "Your home", q: "How important is owning your own space?",
          stops: ["Not at all, I’d rather stay free to leave", "Not much, renting suits me", "Not very", "Nice to have", "Important", "Very important", "Essential, I want it to be mine"] },
        { id: "holding", kind: "rank", area: "Your home", q: "How would you like to hold your home?", hint: "Tap in order of preference. Your first three are ranked 1, 2, 3.", also: "also",
          options: [{ t: "Own it", img: "mini-holding-own.webp", hub: "holding:own" }, { t: "A share in the whole", img: "mini-holding-shares.webp", hub: "holding:shares" },
            { t: "Rent", img: "mini-holding-rent.webp", hub: "holding:rent" }, { t: "A membership with my room included", img: "mini-holding-membership.webp", hub: "holding:membership" },
            { t: "The right to live there, held by the group", img: "mini-holding-use-rights.webp", hub: "holding:use-rights" }] },
        { id: "savings", kind: "chips", img: "icon-money.webp", area: "Money", q: "Would you put your savings into it?",
          options: ["No, I’d rather keep my savings free", "Some, for a share I get back when I leave", "Yes, I’d buy my home", "I could help fund the whole thing"] }
      ] },

    { id: "path", title: "Join or start", img: "icon-path.webp",
      lede: "Last one. Then your letter.",
      questions: [
        { id: "role", kind: "chips", noOpen: true, q: "Are you looking to…", options: ["Join a place that exists", "Start one with others", "Not sure yet"] },
        { id: "hours", kind: "chips", q: "How much time could you give it, each month?", options: ["A few hours", "A day or two", "A lot, it would be my project"] },
        { id: "name", kind: "text", q: "Who should the letter be addressed to?", hint: "Your first name, if you like.", placeholder: "Your first name" }
      ] }
  ],

  /* small, traceable pushes toward a way of living (match points, ~5 = noticeable).
     why = the "Because you said…" phrase shown when the nudge helps the winner. */
  nudges: {
    with: [
      { "operator-coliving": 2, "entrepreneur-house": 2, "hacker-house": 2, "student-coop": 2, "rural-coliving": 2, why: "you’d come on your own" },
      { cohousing: 2, baugruppen: 2, why: "you’d come with your partner" },
      { cohousing: 6, baugruppen: 4, ecovillage: 2, "hacker-house": -6, "operator-coliving": -4, "rural-coliving": -3, why: "you’d bring your kids" },
      { "entrepreneur-house": 2, "student-coop": 2, baugruppen: 2, why: "you’d come with friends" },
      null
    ],
    life: [
      { "student-coop": 9, why: "you’re studying" },
      { "operator-coliving": 3, "entrepreneur-house": 3, "student-coop": 2, why: "you’re starting out" },
      { "entrepreneur-house": 6, "hacker-house": 5, why: "you’re building something of your own" },
      { cohousing: 5, baugruppen: 3, ecovillage: 2, why: "you’re raising kids" },
      { cohousing: 6, "student-coop": 1, why: "you’re raising kids on your own" },
      { "rural-coliving": 7, "network-village": 3, why: "you work remotely" },
      { "operator-coliving": 4, "student-coop": 2, why: "you’re new in town" },
      { "student-coop": 3, ecovillage: 2, why: "you make art" },
      { cohousing: 2, "operator-coliving": 2, why: "you’re at a turning point" },
      { cohousing: 6, why: "you’re retired, or nearly" }
    ],
    setting: [
      { "operator-coliving": 3, "student-coop": 2, baugruppen: 2, cohousing: 1, "hacker-house": 1, why: "you love the city" },
      { cohousing: 3, why: "you’d like the suburbs" },
      { ecovillage: 5, "rural-coliving": 5, kibbutz: 2, why: "you’d love the countryside" }
    ],
    hosts: [ null, { "network-village": 2, "entrepreneur-house": 1, why: "you’d like work and shops on site" },
      { ecovillage: 5, kibbutz: 3, why: "you’d love homes on a farm" } ],
    community: [
      { "network-village": 3, cohousing: 2, baugruppen: 1, why: "you’d love a walkable street where you bump into neighbours" },
      { cohousing: 3, kibbutz: 1, "student-coop": 1, why: "shared meals are part of community for you" },
      { cohousing: 2, ecovillage: 1, "rural-coliving": 2, "entrepreneur-house": 1, why: "you’d love activities and celebrations together" },
      { ecovillage: 3, kibbutz: 3, why: "you want neighbours who share your values" },
      { cohousing: 3, "network-village": 1, why: "you’d love neighbours who help each other out" },
      { ecovillage: 4, kibbutz: 2, "rural-coliving": 1, why: "you’d love to grow food together" }
    ],
    keep: [
      { "operator-coliving": 3, "entrepreneur-house": 1, why: "you’d want your own bathroom" },
      { cohousing: 3, baugruppen: 2, "operator-coliving": 1, why: "you’d want a small kitchen of your own" },
      { cohousing: 3, baugruppen: 3, why: "you’d want your own entrance" },
      { "entrepreneur-house": 2, "hacker-house": 2, "rural-coliving": 2, why: "you’d want a room to work in" }
    ],
    pool: [
      { "student-coop": 3, "hacker-house": 1, "entrepreneur-house": 1, why: "you’d pool the groceries" },
      { "student-coop": 2, "operator-coliving": 1, why: "you’d share the bills" },
      { ecovillage: 2, cohousing: 1, kibbutz: 1, why: "you’d share tools and cars" },
      { kibbutz: 6, why: "you’d pool some of your income" }
    ],
    give: [
      { "operator-coliving": 3, "hacker-house": 1, why: "an hour or two a week for the house suits you" },
      { "student-coop": 2, cohousing: 1, why: "you’d give the house half a day a week" },
      { kibbutz: 3, ecovillage: 3, "student-coop": 1, why: "you’d give the house a day or more a week" }
    ],
    /* the space-and-comfort slider: 0 to 1 = simple, 5 to 6 = roomy with extras */
    space: [
      { ecovillage: 3, kibbutz: 2, "student-coop": 2, "hacker-house": 1, why: "you’d keep things small and simple" },
      { "operator-coliving": 4, "entrepreneur-house": 2, baugruppen: 1, why: "you’d like room to spread out, with nice extras" }
    ],
    savings: [
      { "operator-coliving": 2, "student-coop": 2, "entrepreneur-house": 2, "rural-coliving": 2, baugruppen: -3, why: "you’d keep your savings free" },
      { cohousing: 2, "student-coop": 1, ecovillage: 2, why: "you’d put in some savings for a share" },
      { cohousing: 3, baugruppen: 5, why: "you’d buy your home" },
      { "network-village": 4, baugruppen: 2, why: "you could help fund the whole thing" }
    ]
  },

  /* "care" picks (indexes into the care question). eco/tech set the map's
     Ecology ↔ Technology position; purpose picks nudge the purpose spectrum;
     careFit = what each way of living is usually organised around
     (+1 match point per overlap, max 3, and a "you care about…" reason). */
  care: {
    eco: [0, 1, 2, 15, 16, 17],
    tech: [11, 12],
    purpose: [9, 13],
    fit: {
      ecovillage: [0, 1, 2, 16, 17, 9, 18],
      cohousing: [5, 6, 7, 2, 18],
      kibbutz: [0, 5, 7, 12, 13],
      baugruppen: [5, 15, 1],
      "hacker-house": [11, 12, 10],
      "operator-coliving": [12, 14, 8],
      "entrepreneur-house": [12, 11, 10, 13],
      "rural-coliving": [2, 8, 19, 12],
      "network-village": [11, 13, 10, 18],
      "student-coop": [7, 10, 3, 17]
    }
  },

  letter: {
    seal: "mini-map-seal.webp",
    stamp: "mini-extra-stamp.webp",
    tape: "mini-extra-tape.webp",
    pin: "mini-map-pin-clay.webp",
    sealHint: "Break the seal to read your letter",
    greeting: function (n) { return n ? "Dear " + n + "," : "Dear friend,"; },
    opening: "Thank you for sitting with these questions. Here is what your answers tell us. Take it as a first sketch of a home, something to talk over with the people you’d live with.",
    /* v2: what matters to you, reflected back */
    mirrorTitle: "What matters to you",
    hopesLead: "What you hope it brings",
    careLead: "What you’d love the place to care about",
    standLead: "Where you stand",
    gateLead: "Your kind of home",
    mirrorEmpty: "You kept your hopes to yourself, and that’s fine. The rest of this letter comes from your other answers.",
    blocksTitle: "Your building blocks",
    blocksLead: "The pieces of a home that fits your answers. Each one says where it came from.",
    fitsTitle: "Ways of living that fit these blocks",
    fitsLead: "No single answer here. These are the closest of the ten ways of living on our map, each with what fits and where it differs.",
    fitsBecause: "Fits because ",
    differs: "Where it differs: ",
    differsNone: "Nothing big. It sits close to all your answers.",
    differsLine: function (topic, theirs, yours) { return topic + ": usually “" + theirs + "” here, and you said “" + yours + "”."; },
    differsHolding: function (theirs) { return "Your home: people here usually " + theirs + "."; },
    holdingVerb: { own: "own their home", shares: "hold a share in the co-op", rent: "rent", membership: "pay a membership", "use-rights": "hold the right to live there" },
    careSaid: function (list) { return "you care about " + list; },
    hopeSaid: function (list) { return "you hope for " + list; },
    setupSaid: {
      holding: function (v) { return "people here often " + v + ", which you’d consider"; },
      decisions: function (v) { return "decisions are often made by " + v + ", like you picked"; }
    },
    decBy: { founder: "the founder or operator", vote: "majority vote", consensus: "consensus", consent: "consent", advice: "an advice process" },
    placeWhy: {
      fit: function (n) { return n + ", one of your close fits"; },
      setting: { city: "in a city like you want", suburb: "in the suburbs like you want", countryside: "in the countryside like you want" },
      holding: function (v) { return "residents " + v + ", which you’d consider"; },
      decisions: function (v) { return "decisions by " + v + ", like you picked"; },
      forWho: { families: "home to families like yours", "single-parents": "home to single parents", seniors: "made for growing older together",
        intergenerational: "mixes young and old", students: "made for students", entrepreneurs: "full of people building projects",
        "remote-workers": "made for remote workers", newcomers: "welcomes newcomers", artists: "home to artists", "young-adults": "made for young adults" },
      near: "close to you"
    },
    emailSubject: "My letter from Our Coliving",
    emailBody: function (url) { return "Here is the letter I got from “Find your way of living together”. Open it here:\n\n" + url + "\n"; },
    email: "Email it to me",
    copy: "Copy the link",
    fitTitle: "You and living together",
    fit: [
      { min: 68, h: "You’d thrive in most shared places",
        p: "You recharge around people, and a busy kitchen doesn’t faze you. For you the question is which kind of togetherness, more than whether." },
      { min: 54, h: "Living together comes naturally to you",
        p: "You have most of what shared life asks for. A few choices in how the place is set up will make the difference between good and great." },
      { min: 40, h: "You’ll love it with the right set-up",
        p: "You value your own space, and that’s a strength in a shared place. Look for a home where your door is truly yours and the shared life is something you choose each day." },
      { min: -1, h: "A lighter way of sharing suits you best",
        p: "You’d be happiest with your own home and a circle of neighbours close by. Cohousing was made for people like you: a private front door, a common house down the path, dinner together when you feel like it.",
        alt: "You’d be happiest with a space that’s fully yours and good people close by. Look for a place where shared life is an invitation you accept when you feel like it, never an obligation." }
    ],
    fullLife: "And if life is very full right now, that’s fine. Living together often fits best at a turning point, like a move or a new child. It will still be here.",
    strength: [ [88, "a very close fit"], [72, "a close fit"], [-1, "a good fit"] ],
    readGuide: "Read the field guide",
    /* v1's per-type "why" blurbs are gone on purpose: they claimed things the
       person never said. Fit reasons are now built only from real answers. */
    peopleTitle: "People like you",
    people: [
      "Students have shared houses for as long as there have been universities. A good co-op adds what a cheap room doesn’t: people to eat with, and a first lesson in running a home together.",
      "Your twenties and thirties move fast. A shared home keeps costs down and gives you a circle of friends while the rest of life is still settling.",
      "People building something new get the most from a house of peers: quick feedback at breakfast, and someone who understands a bad week. Guard the line between home and office.",
      "Children in shared places grow up with more trusted adults around them and friends right next door. Parents get a hand with pickups and the odd evening off.",
      "Raising kids alone is a lot to carry. Trusted neighbours and shared meals can lighten the daily load, and it works best when the help goes both ways.",
      "If you can work from anywhere, you can choose a place for its people and its setting. A shared home turns a lonely laptop into a table of colleagues.",
      "Arriving somewhere new is easier with neighbours who explain how things work. A shared place gives you a network on day one, and often a language teacher at dinner.",
      "Shared places have long sheltered artists, with cheaper space and neighbours who don’t mind odd hours.",
      "Many people come to shared living at a turning point. It’s a good moment to choose how you want to live next.",
      "Shared places keep people active and useful in later life, with neighbours close by if health changes. Planning for those years early is part of what makes them work."
    ],
    peopleWith: [
      "Living alone and living lonely are different things. A shared place lets you choose how much company you want each day, with a door that’s still yours.",
      "Couples in shared places keep their own home and gain a wider circle: friends next door, and help when you need it.",
      null, null, null
    ],
    peopleMore: "Who living together helps",
    mapTitle: "Your pin on the map",
    mapNote: "You, among the ten ways of living, on the two spectrums where your answers stand out most.",
    mapLink: "See yourself on the full map",
    yourPick: "your pick",
    placesTitle: ["Places you could visit or join", "Places to learn from", "Places to go and see"],
    knowTitle: "Things to know, for your profile",
    stepsTitle: "First steps",
    /* one link at most per list; the collective tax lives in "Things to know" only */
    steps: [
      ["Visit two of the places above, and stay a few days if they host guests.",
       "Ask the people who live there what their week looks like, and what they wish they’d known.",
       "Ask how people join. Many places have a trial stay or a waiting list, and some open only a few times a year. <a href=\"networks.html\">A network near you</a> can point you to more."],
      ["Find two or three people who’d want this too, and send them this quiz. Compare your letters over a meal.",
       "Ask yourselves whether you want to build it or mostly to live in it. Some groups hand much of the building to professionals.",
       "Pick your legal set-up early, because it shapes who can join and how the money comes in."],
      ["Visit first. A weekend in a shared place will tell you more than any quiz, this one included.",
       "Send this letter to someone you’d live with, and talk about where your answers differ.",
       "Write down the one thing you’d never give up and the one you’d happily share. Take both with you when you visit."]
    ],
    closing: "Whatever you choose, we hope it brings you closer to the people around you. If you start something, we’d love to hear about it.",
    signoff: "With care,",
    signature: "Pierre-Antoine",
    signedFor: "for all of us at Our Coliving",
    copied: "Link copied. Your answers travel inside it.",
    print: "Save as PDF",
    again: "Start over",
    edit: "Change my answers"
  },

  /* "Things to know": first matching rules win, 3 to 4 shown, the last one always closes */
  know: [
    { id: "quiet-belong", when: "rechargeLow && fitBand>=2",
      h: "Quiet people belong here too", p: "The Quebec cohousing guide says it plainly: living together asks for no constant presence and no forced social life, and it suits introverts too. You take part as much as you want." },
    { id: "quiet", when: "rechargeLow",
      h: "Protect your quiet", p: "People who recharge alone often become the calm centre of a house. Choose a place where a closed door is normal and nobody takes it personally." },
    { id: "connector", when: "rechargeHigh",
      h: "You’ll be a connector", p: "Houses need people who start the dinner and knock on doors. Keep a little of that energy for yourself." },
    { id: "say-early", when: "conflictLow",
      h: "Say the small things early", p: "Living close, small frictions add up quietly. Places with a regular check-in make it easy to raise them, so look for one." },
    { id: "talker", when: "conflictHigh",
      h: "Groups need people like you", p: "The places that last treat disagreement as a normal part of the week. Your habit of talking things through will be welcome." },
    { id: "pool-income", when: "poolIncome",
      h: "Put the money rules on paper early", p: "Groups that pool income last longer when the rules are written down before anyone moves in, including what happens when someone leaves." },
    { id: "values", when: "valuesPick",
      h: "Values show in what people do", p: "Most groups agree on values easily. Look for one that acts on them every week, with a work day or a table everyone is welcome at." },
    { id: "comfort", when: "comfortHigh",
      h: "Extras usually come with an operator", p: "A gym or weekly cleaning is easiest where an operator runs the place. Where residents run it, the extras are planned and paid for together." },
    { id: "small-jobs", when: "gateShared && giveLow",
      h: "A shared home runs on small jobs", p: "Cooking and repairs add up. Houses that work make the jobs visible and fair, so an hour or two from each person is enough." },
    { id: "table", when: "mealsLove",
      h: "The shared table may be yours to start", p: "Shared meals hold most communities together, and they need someone who loves them." },
    { id: "turnover", when: "timeHigh && shortStayType",
      h: "Ask how long people stay", p: "Some places welcome new residents every season, and you picture staying longer. Ask about it when you visit, and look for a core group that stays." },
    { id: "start-soon", when: "start && effortLow",
      h: "Start small and soon", p: "A shared rented house with two or three friends is a real first step, and many bigger projects began that way." },
    { id: "marathon", when: "start && hoursLow",
      h: "Starting takes a marathon’s patience", p: "Most groups take three to seven years to move in. Joining a group that’s already underway lets you give a few hours and still get there." },
    { id: "core", when: "start",
      h: "Start with three to eight people", p: "Most groups begin with a small core and grow once the idea is clear. Eat together before you build together." },
    { id: "own-share", when: "ownHigh && shareHigh",
      h: "Owning and sharing can live together", p: "Cohousing and Baugruppen let you own your home and share the rest." },
    { id: "visit", when: "always", fallback: true,
      h: "Visit before you decide", p: "Every shared place has its own rhythm. A few days as a guest will show you the real rhythm better than any description." },
    { id: "seasons", when: "always", fallback: true,
      h: "Your part can change with your life", p: "How much you give to a shared place goes up and down with work and family. Good places expect that, and nobody keeps score." }
  ],
  knowLast: { id: "tax", h: "Every shared place asks a small price",
    p: "A meeting you’d skip, or a decision that didn’t go your way. Durrett and McCamant, who brought cohousing to North America, call these the thorns that come with the roses. <a href=\"collective-tax.html\">Read about the collective tax</a>." },

  setup: {
    size: [ [34, "small", "A small group, about 6 to 14 homes", "Everyone knows everyone and decisions are quick."],
            [67, "medium", "A medium group, about 15 to 35 homes", "Big enough for variety, small enough that everyone knows your name."],
            [101, "large", "A large community, 36 homes or more", "Many friendships and shared costs, held together by a firmer structure."] ],
    smallHousehold: ["A shared house, about 4 to 10 people", "Small enough to feel like a household."],
    meals: [
      "A few shared dinners a month and one yearly tradition. Enough to know each other, light enough to keep.",
      "One shared dinner a week, cooked in turns. Many places that last started with exactly this.",
      "Shared dinners a few nights a week, with a cooking rota so each person cooks about once a month. Usually a third to half of the neighbours come to any given dinner, so nobody has to come every time.",
      "A shared table most nights. Somebody has to love it enough to start it, and it might be you."
    ],
    /* v2: why each building block was chosen ("Because …"), shown under derived rows */
    because: {
      building: { new: "you picture staying for good and would put years into it", converted: "you’d rather move in sooner", mixed: "you sit in the middle on time and effort" },
      hosts: { farm: "you care about growing food or animals, and want the countryside", "mixed-use": "you’re building something or want work close to home", homes: "a place with just homes is the simplest to plan and run" },
      meals: { community: "shared meals are part of how you’d feel the community", shared: "you’d share a home, and shared homes often eat together" },
      mealsNone: "most places that last start with one shared dinner a week",
      decisions: { founder: "you’d rather someone else ran it", advice: "you recharge alone, and an advice process keeps meetings few", consent: "you’d talk things through, or want a bigger group", type: "it’s the most common choice in your closest fit" },
      holding: { "use-rights": "you’d stay for good and live close to the land", own: "owning your space matters to you", shares: "you’d put in some savings for a share", membership: "you’d rather stay free to leave, and not for long", rent: "you’d rather stay free to leave", type: "it’s the usual set-up in your closest fit" },
      money: { members: "you’d put your own savings in", patron: "you could help fund the whole thing", operator: "you’d rather keep your savings free",
        "public": "you hope for a home you can afford, and would stay a while", derived: "it follows from how you’d hold your home" }
    },
    decisions: {
      founder: "The founder or operator makes the main calls, and residents give input. Easy to live with when you trust the people running it.",
      vote: "Majority vote, for clear and quick decisions. Many groups add a pause for discussion before the vote.",
      consensus: "Consensus: a decision passes when everyone can agree to it. Slower, and it brings everyone along.",
      consent: "Consent, in small circles: a decision passes unless someone has a serious objection. Most new cohousing groups choose this.",
      advice: "An advice process: anyone can decide, after asking the people affected and those who know the subject. Few meetings, lots of trust."
    },
    govStyle: { small: "Decided around the kitchen table, and written down.", large: "Working groups with clear jobs, and a general assembly once a year." },
    holding: {
      own: "Own your home. Each household owns its unit and the shared spaces are owned together, usually as a condo.",
      shares: "A share in a co-op. You get it back when you leave, and the co-op keeps homes affordable for the next people.",
      rent: "Rent, ideally from a co-op or non-profit so the place stays affordable for good.",
      membership: "A membership with your room included. Easy to arrive, easy to leave.",
      "use-rights": "The right to live there, with the land held by a trust or the group, so it can never be sold off."
    },
    holdingLegal: { own: "condo", shares: "coop", rent: "nonprofit", membership: "company", "use-rights": "land-trust" },
    money: {
      members: "Members’ own savings and a group mortgage.",
      public: "Public funding or a non-profit partner. Quebec and Canada have programmes for co-ops and non-profits doing exactly this.",
      patron: "You could be its patron or one of its first funders. Choose terms that keep the residents in charge.",
      operator: "Someone else carries the building, like an operator or a co-op. You pay rent or a membership."
    }
  }
};
