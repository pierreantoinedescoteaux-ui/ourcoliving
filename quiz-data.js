/* =====================================================================
   QUIZ CONTENT LAYER: "Find your way of living together" (quiz.html).
   Questions, letter copy and scoring nudges. The engine lives in
   quiz.html; type ranges come from map-data.js, places from
   projects-data.js. Draft + rationale: FOR PIERRE-ANTOINE/QUIZ-CONTENT-DRAFT.md.
   Answer order is part of the share link: ADD new questions at the END
   of a step's list and bump QUIZ.version, never reorder.
   ===================================================================== */
const QUIZ_IMG = "images/hub/";
const QUIZ = {
  version: 1,
  intro: {
    eyebrow: "The lookout · find your fit",
    title: "Find your way of living together",
    lede: "About thirty questions on how you live and what you hope for. At the end there’s a letter waiting for you, with the way of living that suits you best and a few real places to go and see.",
    note: "About 6 minutes. Skip anything you like. Nothing is saved anywhere: your answers stay in your browser, and in the link if you choose to share it.",
    start: "Begin"
  },
  helpImg: "mini-maptech-lens.webp",

  steps: [
    { id: "you", title: "You, today", img: "icon-who.webp",
      lede: "A little about where you are in life, so the letter speaks to you.",
      questions: [
        { id: "base", kind: "chips", q: "Where are you based?",
          options: ["Quebec", "Elsewhere in Canada", "United States", "Europe", "Somewhere else"] },
        { id: "with", kind: "chips", q: "Who would come with you?",
          options: ["Just me", "My partner", "My family, with kids", "A few friends", "I’m open"] },
        { id: "life", kind: "chips", multi: true, q: "Which of these sound like you right now?", hint: "Pick any.",
          options: ["Studying", "Starting out in my 20s or 30s", "Building a company or project", "Raising kids",
            "Raising kids on my own", "Working remotely", "New to the city or the country", "An artist or maker",
            "Going through a change (a move, a breakup, kids leaving home)", "Retired, or getting close"] },
        { id: "setting", kind: "stickers", q: "Where would you love to live?",
          options: [{ t: "City", img: "mini-setting-city.webp" }, { t: "Suburb", img: "mini-setting-suburb.webp" },
            { t: "Countryside", img: "mini-setting-countryside.webp" }, { t: "Anywhere good", img: "mini-map-pin.webp" }] },
        { id: "budget", kind: "chips", q: "What could you spend on housing, compared with a typical rent where you live?",
          options: ["Less than usual", "About the same", "More is fine"] }
      ] },

    { id: "values", title: "What matters to you", img: "mini-map-compass.webp",
      lede: "Each slider is one of the spectrums on our map. Tap the heart on the ones that matter most.",
      questions: [
        { id: "share", kind: "slider", spectrum: "share", heart: true, q: "How much of daily life would you share?",
          lo: "My own place, with a few shared rooms", hi: "Shared home, shared meals, maybe shared money",
          said: ["you want your own place with a few shared rooms", "you’d share some of daily life", "you’d share most of daily life"] },
        { id: "size", kind: "slider", spectrum: "size", heart: true, q: "How many neighbours feels right?",
          lo: "A handful of housemates", hi: "A whole village",
          said: ["a handful of housemates feels right", "you’d like a group big enough for variety", "you’d love a whole village"] },
        { id: "time", kind: "slider", spectrum: "time", heart: true, q: "How long do you picture staying?",
          lo: "A season, maybe a year", hi: "The rest of my life",
          said: ["you picture staying a season or a year", "you picture staying a few years", "you picture staying for life"] },
        { id: "power", kind: "slider", spectrum: "power", heart: true, q: "How much say do you want in how it runs?",
          lo: "Someone else runs it, I live there", hi: "We all run it together",
          said: ["you’d rather someone else ran it", "you’d like some say in how it runs", "you want everyone to run it together"] },
        { id: "autonomy", kind: "slider", spectrum: "autonomy", heart: true, q: "When you and the group want different things…",
          lo: "I’d mostly put myself first", hi: "I’d mostly put the group first",
          said: ["you’d keep plenty of room for yourself", "you’d balance your needs with the group’s", "you’d often put the group first"] },
        { id: "ecoTech", kind: "slider", spectrum: "ecoTech", heart: true, q: "What should the place be organised around?",
          lo: "Land, food and living lightly", hi: "Ideas, tech and building the future",
          said: ["you’d organise life around land and food", "you’d mix ecology with new ideas", "you’d organise life around ideas and tech"] },
        { id: "effort", kind: "slider", spectrum: "effort", heart: true, oneWay: true, q: "How much would you put in to make it exist?",
          lo: "I’d like to move in this year", hi: "Years of land, permits and money",
          said: ["you’d like to move in soon", "you’d give a project a few years", "you’d put years into making it exist"] },
        { id: "purpose", kind: "slider", spectrum: "purpose", heart: true, q: "Do you want a shared purpose?",
          lo: "Good neighbours is plenty", hi: "A mission or belief we share",
          said: ["good neighbours is plenty for you", "a loose shared purpose appeals to you", "you want a mission you share"] }
      ] },

    { id: "about", title: "A bit about you", img: "icon-privacy.webp",
      lede: "No right answers here. This shapes the advice more than the result.",
      questions: [
        { id: "recharge", kind: "slider", q: "After a long day, you recharge…", lo: "Alone, door closed", hi: "Around people" },
        { id: "conflict", kind: "slider", q: "When something about a housemate bugs you…", lo: "I mostly let it go", hi: "I bring it up and talk it through" },
        { id: "meetings", kind: "slider", q: "A two-hour house meeting sounds…", lo: "Draining", hi: "Kind of fun, honestly" },
        { id: "dishes", kind: "slider", q: "Someone else’s dishes in the sink…", lo: "Ruin my evening", hi: "I barely notice" },
        { id: "rhythm", kind: "slider", q: "Your weeks are…", lo: "The same rhythm, every week", hi: "Different every week" },
        { id: "cook", kind: "slider", q: "Cooking dinner for fifteen, once a month?", lo: "Please, no", hi: "Yes please" },
        { id: "faces", kind: "slider", q: "New faces at the table…", lo: "I like the familiar ones", hi: "The more the better" }
      ] },

    { id: "setup", title: "How you’d set it up", img: "icon-toolbox.webp",
      lede: "One choice for each part of a shared place. Not sure? “Help me choose” lets your other answers decide.",
      questions: [
        { id: "building", kind: "stickers", area: "Building", q: "What kind of building?", help: true,
          options: [{ t: "A new build we design together", img: "mini-building-new.webp" },
            { t: "An old building with character, given a new life", img: "mini-building-converted.webp" },
            { t: "A mix of both", img: "mini-building-mixed.webp" }] },
        { id: "hosts", kind: "stickers", area: "Building", q: "What else would be on site?", help: true,
          options: [{ t: "Just homes", img: "mini-hosts-homes.webp" },
            { t: "Homes with shops, studios or workspaces", img: "mini-hosts-mixed-use.webp" },
            { t: "Homes on a farm", img: "mini-hosts-farm.webp" }] },
        { id: "meals", kind: "chips", area: "Social life", q: "How often would you love to eat together?",
          options: ["Now and then", "Once a week", "A few nights a week", "Most nights"] },
        { id: "decisions", kind: "stickers", area: "Decisions", q: "How should decisions get made?", help: true,
          options: [{ t: "Someone I trust decides", img: "mini-decisions-founder.webp" },
            { t: "We vote", img: "mini-decisions-vote.webp" },
            { t: "We only go ahead when everyone agrees", img: "mini-decisions-consensus.webp" },
            { t: "We go ahead unless someone has a serious objection", img: "mini-decisions-consent.webp" },
            { t: "Whoever cares most decides, after asking around", img: "mini-decisions-advice.webp" }] },
        { id: "own", kind: "slider", area: "Your home", q: "How important is owning your own space?",
          lo: "Not at all, I’d rather stay free to leave", hi: "Essential, I want it to be mine" },
        { id: "holding", kind: "stickers", area: "Your home", q: "How would you like to hold your home?", help: true,
          options: [{ t: "Own it", img: "mini-holding-own.webp" }, { t: "A share in the whole", img: "mini-holding-shares.webp" },
            { t: "Rent", img: "mini-holding-rent.webp" }, { t: "A membership with my room included", img: "mini-holding-membership.webp" },
            { t: "The right to live there, held by the group", img: "mini-holding-use-rights.webp" }] },
        { id: "savings", kind: "chips", area: "Money", q: "Would you put your savings into it?",
          options: ["No, I’d rather keep my savings free", "Some, for a share I get back when I leave", "Yes, I’d buy my home", "I could help fund the whole thing"] }
      ] },

    { id: "path", title: "Join or start", img: "icon-path.webp",
      lede: "Last one. Then your letter.",
      questions: [
        { id: "role", kind: "chips", q: "Are you looking to…", options: ["Join a place that exists", "Start one with others", "Not sure yet"] },
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
      { ecovillage: 5, "rural-coliving": 5, kibbutz: 2, why: "you’d love the countryside" },
      null
    ],
    hosts: [ null, { "network-village": 2, "entrepreneur-house": 1, why: "you’d like work and shops on site" },
      { ecovillage: 5, kibbutz: 3, why: "you’d love homes on a farm" } ],
    savings: [
      { "operator-coliving": 2, "student-coop": 2, "entrepreneur-house": 2, "rural-coliving": 2, baugruppen: -3, why: "you’d keep your savings free" },
      { cohousing: 2, "student-coop": 1, ecovillage: 2, why: "you’d put in some savings for a share" },
      { cohousing: 3, baugruppen: 5, why: "you’d buy your home" },
      { "network-village": 4, baugruppen: 2, why: "you could help fund the whole thing" }
    ]
  },

  letter: {
    seal: "mini-map-seal.webp",
    stamp: "mini-extra-stamp.webp",
    tape: "mini-extra-tape.webp",
    pin: "mini-map-pin-clay.webp",
    sealHint: "Break the seal to read your letter",
    greeting: function (n) { return n ? "Dear " + n + "," : "Dear friend,"; },
    opening: "Thank you for sitting with these questions. Here is what your answers tell us. Take it as a first sketch of a home, something to talk over with the people you’d live with.",
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
    wayTitle: "Your way of living",
    strength: [ [88, "a very strong match"], [72, "a strong match"], [-1, "a good match"] ],
    because: "Because ",
    closeBehind: "Close behind: ",
    readGuide: "Read the field guide",
    why: {
      ecovillage: "You want a whole way of life more than an address: land and decisions held in common, for the long run. Ecovillages are the deepest kind of living together on our map, and the people in them often say nothing else gives the same sense of belonging.",
      cohousing: "You want your own front door and neighbours who know your name. In cohousing every household has a full home, and the community gathers in a common house a few evenings a week. It’s the most proven model on our map, with fifty years of Danish experience behind it.",
      kibbutz: "You’d share almost everything, and you’d want it to mean something. The kibbutz is the boldest experiment in shared life still running, and its newer urban versions are smaller and closer to what you described.",
      baugruppen: "You’d rather design your home than buy someone else’s idea of one. In a Baugruppe, a group of future neighbours becomes the developer and builds the place it will live in. It suits patient, organised people, and your answers say that’s you.",
      "hacker-house": "You want your home to be where the ideas happen. A hacker house puts a few builders under one roof for a season of focused work and late conversations in the kitchen.",
      "operator-coliving": "You want community to be ready the day you arrive, without having to run anything. Operator co-living gives you a furnished room and a team that looks after the social life.",
      "entrepreneur-house": "You want a home that pushes your life forward, shared with a handful of people chasing their own projects. It’s the kind of house this whole project grew out of.",
      "rural-coliving": "You’d like nature and good company for a while, without leaving your work behind. Rural co-living gives you weeks or months in the countryside with other people who work from anywhere.",
      "network-village": "You’d rather help build a new kind of town than join an old one. Network villages gather people around shared ideas, often for a season, sometimes for good.",
      "student-coop": "You want rent you can afford and a real say in your home. In a co-op house the residents run the place together and learn by doing it."
    },
    /* runner-up: "Close behind: X, if you’d rather …" by the spectrum where it differs most */
    rather: {
      share: ["keep more of life private", "share more of daily life"],
      size: ["live in a smaller group", "live in a bigger community"],
      time: ["stay for a shorter while", "stay for good"],
      power: ["let someone else run things", "run it all together"],
      autonomy: ["keep more room for yourself", "put the group first more often"],
      ecoTech: ["live closer to the land", "build around ideas and tech"],
      effort: ["move in sooner", "take on a bigger project"],
      purpose: ["keep it to good neighbours", "share a mission"]
    },
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
    setupTitle: "How you might set it up",
    yourPick: "your pick",
    placesTitle: ["Places you could visit or join", "Places to learn from", "Places to go and see"],
    knowTitle: "Things to know, for your profile",
    stepsTitle: "First steps",
    steps: [
      ["Visit two of the places above, and stay a few days if they host guests.",
       "Ask the people who live there what their week looks like, and what they wish they’d known.",
       "Find a network near you. <a href=\"networks.html\">Here are some to start with</a>."],
      ["Find two or three people who’d want this too, and send them this quiz. A first group is usually three to eight people.",
       "Ask yourselves whether you want to build it or mostly to live in it. Some groups hand much of the building to professionals.",
       "Read <a href=\"themes.html#path\">the path from first meeting to moving in</a>, and pick your legal set-up early, because it shapes who can join."],
      ["Visit first. A weekend in a shared place will tell you more than any quiz, this one included.",
       "Read about <a href=\"collective-tax.html\">the small price of living together</a>, and see how it sits with you.",
       "Come back and take this again in a year. Answers change, and that’s part of it."]
    ],
    closing: "Whatever you choose, we hope it brings you closer to the people around you. If you start something, we’d love to hear about it.",
    signoff: "With care,",
    signature: "Pierre-Antoine",
    signedFor: "for all of us at Our Coliving",
    share: "Send this to someone you’d live with",
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
    { id: "light-decisions", when: "meetingsLow",
      h: "Look for light decision-making", p: "An advice process or clear working groups keep meetings short and few." },
    { id: "facilitator", when: "meetingsHigh",
      h: "Your patience with meetings is rare", p: "Most groups need one or two people who enjoy running a good meeting. Learning facilitation, sociocracy for instance, would make you a gift to any group." },
    { id: "dishes", when: "dishesLow",
      h: "Agree on the dishes on day one", p: "Your standards help a house when they’re written down early. A cleaning rota with clear jobs keeps the peace." },
    { id: "table", when: "cookHigh",
      h: "The shared table may be yours to start", p: "Shared meals hold most communities together, and they need someone who loves them." },
    { id: "turnover", when: "facesLow && shortStayType",
      h: "Ask how long people stay", p: "Some places welcome new residents every season. Ask about it when you visit, and look for a core group that stays." },
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
    mealsFlex: "Keep the meals open, with a sign-up sheet, so the rhythm bends around your weeks.",
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
