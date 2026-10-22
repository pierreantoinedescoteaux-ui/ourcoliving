/* =====================================================================
   HUB DATA: "How a place comes together" (themes.html, the Workshop's
   model city). Nine areas, each with P-A's short intro, the recurring
   questions from themes-data.js, how each way of living handles it
   (pulled from guide-content-data.js) and the option cards
   (hub-cards-data.js, built by _tools/build-hub.js).
   label: x/y = where the area's label sits on the hero painting, in %.
   ===================================================================== */
const HUB = {
  eyebrow: "The Workshop · the model city",
  title: "How a place comes together",
  lede: "A shared place is a stack of choices: the building, the money, the rules and the people. Here they are side by side, with real places that made each choice, so your group can see what fits.",
  hero: { src: "images/hub/hero.webp", fallback: "images/hub/hero-placeholder.webp", alt: "A painted model city on a workshop bench" },
  gridAreas: [
    { id: "building", label: "Building" }, { id: "social", label: "Social life" }, { id: "governance", label: "Governance" },
    { id: "legal", label: "Legal" }, { id: "money", label: "Money" }
  ],
  areas: [
    { id: "building", label: "The building", q: "What does the place itself do?", guideArea: "space",
      hero: { x: 14, y: 52 }, groups: ["setting", "building", "size", "hosts"],
      themes: ["Space & architecture", "Interiors & atmosphere", "Land & buildings", "Energy & infrastructure", "Ecology & regeneration"],
      intro: "A building can pull people together or quietly keep them apart. Most of what I know here I learned by rearranging the rooms of the houses I’ve lived in, and watching what people did next." },
    { id: "social", label: "Social life", q: "How is togetherness made?", guideArea: "community",
      hero: { x: 50, y: 50 }, groups: [],
      themes: ["Community building & events", "Food & shared meals", "Culture, ritual & meaning", "Work & co-working"],
      intro: "The building opens the door, and habits do the rest. Shared meals and small rituals give people a reason to linger, and every way of living finds its own rhythm." },
    { id: "governance", label: "Governance", q: "Who decides, and how?", guideArea: "governance",
      hero: { x: 78, y: 30 }, groups: ["decisions", "govstyles"],
      themes: ["Governance & decision-making", "Management & operations", "Finding & choosing members"],
      intro: "Every group decides somehow, even when nobody chose how. Picking a way on purpose is one of the kindest things a group can do for itself." },
    { id: "legal", label: "Legal set-up", q: "What holds it together on paper?", guideArea: null,
      hero: { x: 22, y: 78 }, groups: ["legal", "holding"],
      themes: ["Legal structures"],
      intro: "The legal set-up sounds dry, and it quietly decides who can afford to join and what happens when someone leaves. These are the forms groups use most, Quebec’s own ones included." },
    { id: "money", label: "Money", q: "Who pays, and who owns?", guideArea: "financing",
      hero: { x: 84, y: 60 }, groups: ["money"],
      themes: ["Financing & ownership", "Affordability & economics"],
      intro: "Somebody has to pay for the land and the walls. Where that money comes from shapes who gets to live there, often more than any rule does." },
    { id: "privacy", label: "Privacy & conflict", q: "How much is yours, and what happens when people disagree?", guideArea: "privacy",
      hero: { x: 64, y: 72 }, groups: [],
      themes: ["Communication & conflict"],
      intro: "Living close works when you also have a door you can close. The places that last plan for privacy from the start, and they treat disagreement as a normal part of the week." },
    { id: "leaving", label: "Leaving & growing old", q: "What happens when you move on, or stay for life?", guideArea: "leaving",
      hero: { x: 90, y: 82 }, groups: [],
      themes: [],
      intro: "People move on, and people grow old. A place that plans for both stays healthy for everyone who stays." },
    { id: "who", label: "Who it’s for", q: "Who does living together help, and how?", guideArea: null,
      hero: { x: 46, y: 86 }, groups: ["who"],
      themes: ["Elders & intergenerational life", "Families & children", "Health & loneliness"],
      intro: "Living together helps different people in different ways. A student and a grandmother want very different things from the same shared kitchen." },
    { id: "path", label: "The path", q: "Where do you start?", guideArea: null,
      hero: { x: 10, y: 26 }, groups: ["path"],
      themes: ["Starting from zero"],
      intro: "If you and a few friends want to start one, this is the road most groups walk. It’s long, and it can be walked one step at a time. I’m still somewhere along it myself." }
  ],
  groupLabels: {
    setting: "Where it is", building: "What you build", size: "How big", hosts: "What else is on site",
    decisions: "How decisions are made", govstyles: "How the group organizes itself",
    legal: "Legal forms", holding: "How you hold your home", money: "Where the money comes from",
    who: "Who it’s for", path: "From zero to moving in"
  },
  closing: "None of these choices is final, and no place gets all of them right. If you’re weighing one of them for your own group, I’d love to hear how it goes."
};
