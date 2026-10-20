/* =====================================================================
   ABOUT ROOM — content layer (About + My Story).
   Written from the master story reference:
   ~/.claude/projects/C--Users-User/memory/reference_pa_personal_story.md
 = Claude draft awaiting P-A's voice.
   Images: `src` renders a real photo; no `src` renders a placeholder
   showing `scene` (the photo P-A should dig up or shoot).
   ===================================================================== */

const ABOUT_INTRO = {
  eyebrow: "The house · about me",
  titleHtml: "Hi, I'm <em>Pierre-Antoine.</em>",
  lede: "I live in Montréal, in a shared house I designed and keep reshaping with the people who live there. I believe we can live closer together, and better, and I'm spending my life learning how. Nonprofits, events, a startup and a few houses later, the thread is simple: I love creating spaces where people grow because of each other.",
  portrait: { src: "images/about-portrait.jpg", scene: "Portrait of Pierre-Antoine, smiling in the mountains." }
};

const ABOUT_THREAD = {
  line: "I've never followed a straight line. Looking back, the same thing kept showing up: I love building spaces where people find each other. Some were online, some were ideas, some were rooms you could walk into. This is how I got here, and who helped along the way.",
  body: ""
};

/* ------- the story chapters (story.html) ------- */
const ABOUT_CHAPTERS = [
  {
    slug: "stone-house",
    years: "Growing up in Drummondville",
    title: "The stone house",
    story: [
      "I grew up an only child in a small town between Québec City and Montréal, raised by my mother — a teacher, and the strongest person I know. There wasn't much to do, which turned out to be a gift: when there's nothing to do, you build. Lego, sandcastles, forts in the woods.",
      "When I was five I stacked a playhouse out of stone bricks, twice my height, and invited my friends in. I didn't know it yet, but that was the whole career plan: make a space, bring people into it, see what happens."
    ],
    stayed: "Building the room is only half of it. The other half is who you invite in.",
    image: { scene: "PHOTO WANTED — childhood photo: P-A as a kid building something (fort, Lego, sandcastle) or playing outside in Drummondville. Grainy family photo is perfect — the realness is the point." }
  },
  {
    slug: "organizer",
    years: "School years",
    title: "Organizer of the year",
    story: [
      "Class representative every year of elementary school. School president in sixth grade. In high school I studied sciences, but what I actually did was organize — fairs, radio, dance events, short films with friends. They ended up naming me organizer of the year.",
      "Then I got to coach: improv teams and tennis players, kids and adults. It was the first time I was formally responsible for other people's growth, and I loved it more than anything I'd done."
    ],
    stayed: "I'm at my best when someone else's progress is the scoreboard.",
    image: { scene: "PHOTO WANTED — teenage P-A with the improv team, on stage, or coaching tennis. A tournament group shot works." }
  },
  {
    slug: "way-in",
    years: "2016 – 2019",
    title: "Business as the way in",
    story: [
      "I believed that if you wanted to change anything you needed power, and business looked like where power lived. So I went all in: started a small accessories company at nineteen and ran it out of school hours, competed in every business case competition I could find, and won a few.",
      "The company taught me every job at once — product, marketing, accounting, selling face to face. And the deeper I got, the more I understood that business was a set of tools, not a destination. What I actually cared about was what the tools could build."
    ],
    stayed: "Sales, budgets, operations — I learned the unglamorous machinery early, and I've never been afraid of it since.",
    image: { scene: "PHOTO WANTED — Sway Accessories era: a product shot, a market stand, or P-A at a case competition (Jeux du commerce / Happening Marketing podium)." }
  },
  {
    slug: "facilitator",
    years: "2018 – 2019 · Université Laval",
    title: "The facilitator of the space",
    story: [
      "At Université Laval in Québec City I met a PhD student who had noticed something: dozens of groups were working on sustainability — students, admin, researchers — and none of them were talking to each other. We co-founded an alliance whose only job was to be the connective tissue.",
      "We mapped every actor on campus, made the introductions, hosted the gatherings, and used the UN's seventeen development goals as a shared vocabulary so sixty student associations and the administration could finally pull in the same direction.",
      "That experience named the pattern I'd been living since the stone house: most spaces don't need another actor. They need a facilitator of the space."
    ],
    stayed: "Map the players, build the common language, host the room — connection is a design problem.",
    image: { scene: "PHOTO WANTED — an Alliance event at ULaval: a room of students mid-workshop, or P-A speaking/facilitating." }
  },
  {
    slug: "scale",
    years: "2019 – 2021",
    title: "Trying it at the scale of a country",
    story: [
      "The alliance took me to the UN's High-Level Political Forum in New York, where I met young people from across Canada who had hit the same wall on their own campuses. We started two things together.",
      "One was a national youth network so young people could organize and speak for themselves — it reached over fifty thousand of them, hosted events with federal ministers, and helped people find each other through the first pandemic months. The other, ReImagine17, became a national nonprofit: we wrote the playbook for starting campus alliances, created paid sustainability jobs for students, and grew a team of fourteen.",
      "What I'm proudest of isn't the funding we raised or the events. It's the culture. Everyone led something and backed everyone else's something. Two years after I stepped away, I came back to visit — and the culture was still there, running without me. That's when I understood what building actually means."
    ],
    stayed: "A community is working when it no longer needs you.",
    image: { scene: "PHOTO WANTED — the UN HLPF 2019 delegate badge/floor shot, or a ReImagine17 team retreat photo — people, not logos." }
  },
  {
    slug: "tokyo",
    years: "2019 – 2020 · Tokyo",
    title: "The house in Tokyo",
    story: [
      "During an exchange year at Sophia University I lived in a shared house in downtown Tokyo — a rotating cast of people from everywhere, and a common room big enough to host in a city where almost nobody can host.",
      "Pooling our resources bought us something none of us could afford alone: a place where things happened. Dinners, arguments, projects, friendships. I didn't call it co-living yet. I just noticed that I was more alive there than anywhere I'd ever lived."
    ],
    stayed: "The seed. Shared space isn't a compromise — it's an upgrade nobody told us about.",
    image: { src: "images/tokyo-house.jpg", scene: "The Tokyo share-house — a common room big enough to host, in a city where almost nobody can." }
  },
  {
    slug: "houses",
    years: "2021 – today · Vancouver & Montréal",
    title: "The houses",
    story: [
      "In Vancouver I stopped waiting for someone else to build the room. I started the Growth Hub — a house where young entrepreneurs live, push each other, and start things. Two businesses were born at that kitchen table; one has passed a hundred thousand in revenue. Then more houses, and in Montréal I finally went all the way: I designed the interior myself, every room with a job to do.",
      "I need to say this plainly, because it's the part I used to soften: none of this was a job. Nobody hired me, there was no company, no title. I found the houses, chose the people, set the culture, resolved the conflicts, coached the ones who wobbled, and rebuilt the spaces as we learned what they needed to be. All of it was real — the proof is in the case studies, and in the people.",
      "Those years are where everything on this site comes from. The atlas, the design patterns, the manifesto — it's all field notes from living it."
    ],
    stayed: "Run the experiment on yourself first. I did — for five years, across four houses.",
    image: { src: "images/mtl-living-room.jpg", scene: "The Montréal house living room — the interior P-A designed." }
  },
  {
    slug: "rooms-that-move",
    years: "2022 – 2024 · C2, Montréal",
    title: "Rooms that change people",
    story: [
      "Back in Montréal I joined C2 — the people behind one of the most inventive business events in the world — because they were the best I'd seen at something I cared about: making rooms that change what people feel. Stage sets that move mid-session. Environments engineered for the exact kind of collaboration they want to spark.",
      "Officially I worked in sales and operations, and I did the full unglamorous stack: beat a ticket target by a third, rebuilt the CRM, wrote the playbooks, automated most of my own reporting job. But what I really took from C2 was a trained sensitivity to space — watching professionals design a room the way a director designs a scene. At the same time, a design-thinking program at La Factry gave that instinct a method."
    ],
    stayed: "Space is a tool you can aim. C2 taught me to aim it on purpose.",
    image: { scene: "PHOTO WANTED — a C2 event floor shot (the immersive staging) with P-A in it if possible, or P-A at work during the event." }
  },
  {
    slug: "hard-chapter",
    years: "2024 – 2026 · Vancouver",
    title: "The chapter that didn't work",
    story: [
      "I co-founded an AI startup in manufacturing — production scheduling for factories with messy, changing demand. I was the business half: operations, revenue, and learning an industry from zero. We joined an accelerator, toured the San Francisco scene, slept in the office some nights, and sold about three hundred and fifty thousand dollars of work.",
      "And it still didn't grow the way it needed to. After a year and a half we looked at the sales cycles honestly and stopped. I'm telling you this for two reasons: because it's true, and because those months taught me more about focus, honesty, and what I actually want than any success has.",
      "What I wanted, it turned out, was the thing I kept doing for free my whole life."
    ],
    stayed: "I can build the machine. I'd rather build the village.",
    image: { scene: "PHOTO WANTED — Bridge2AI era: late-night office/accelerator shot, the SF trip, or a whiteboard covered in scheduling diagrams. Honest > polished." }
  },
  {
    slug: "now",
    years: "2026 · Montréal",
    title: "Now: all of it, on purpose",
    story: [
      "Along the way I spent a year in a fellowship on compassion — two retreats in the Montana mountains with Tibetan Buddhist teachers — and went deep into psychology, meditation, and how environments shape minds. I run, I lift, I finished a marathon; the woods are still where my head gets quiet.",
      "Today everything points the same direction: co-living. Not as nostalgia for my houses, but as the discipline where everything I've practiced — facilitation, space design, operations, care — becomes one craft. This site is my workshop for it.",
      "If you're building a place where people are supposed to grow because of each other, that's the room I've been building since I was five. I'd love to help you build yours."
    ],
    stayed: "Community as the antidote to isolation — and space as the tool that makes it stick.",
    image: { scene: "PHOTO WANTED — recent: P-A hiking / trail running, or hosting a dinner at the Montréal house. Warm, outdoors or golden-hour indoors." }
  }
];

/* ------- the honest-footing statement (rendered between chapters and on about.html) ------- */
const ABOUT_TRANSPARENCY = {
  kicker: "Said plainly",
  line: "I created what I wished existed for myself.",
  body: "The houses, the alliances, the gatherings — nobody assigned them to me. I built them because I wanted to live in them, and they taught me everything on this site."
};

/* ------- what working with me looks like (about.html) ------- */
const ABOUT_NOW = {
  title: "What I bring to a co-living team",
  items: [
    { k: "The resident's eye", line: "I've lived it for five years — I know where communities crack and which design choices prevent it, because I made the mistakes myself." },
    { k: "The facilitator's craft", line: "Curation, onboarding, conflict, culture — the human systems that decide whether a beautiful building becomes a community or a hallway." },
    { k: "The operator's toolkit", line: "Sales, CRM systems, playbooks, automation — I've run the machinery at a company that stages world-class events, and in my own ventures." },
    { k: "The designer's obsession", line: "Space that aims at behavior: everything in the Design for Connection room on this site, tested in my own houses first." }
  ]
};

const ABOUT_CTA = {
  line: "Building something in co-living — a house, a building, a village?",
  sub: "I read everything personally.",
  email: "pierreantoinedescoteaux@gmail.com"
};


/* =====================================================================
   STORY + ABOUT v3 — 2026-10-20 revamp, written to _brand/GUIDE.md
   (P-A's voice + internal character guide). Story = the journey;
   About = who I am now. ABOUT_TRANSPARENCY / ABOUT_CTA above are kept
   only because the Work page still reads them.
   ===================================================================== */

/* the early cards: small, warm, fast */
const STORY2_TEXTURE = {
  kicker: "Before any of it had a name",
  intro: "",
  items: [
    { slug: "stone-house", years: "Age 5", line: "Small town, only child, raised by my mother, a teacher. There wasn't much to do, so I built: Duplo towers in a hard hat, and a stone-brick playhouse twice my height that I invited my friends into.", image: { src: "images/story/story-age5-1.jpg", scene: "Me at five, in a hard hat, building a tower.", caption: "Five years old, hard hat on." } },
    { slug: "organizer", years: "School years", line: "I was the kid who organized things: class rep, school president in sixth grade, the student radio, the dances, the fair. They named me organizer of the year. I loved bringing people together long before I had a word for it.", image: { src: "images/story/story-organizer-1.jpg", scene: "End-of-year school gala, 2017.", caption: "End-of-year gala, 2017." } },
    { slug: "coach", years: "16 – 20", line: "I coached improv teams and tennis players, kids and adults. Someone was paying me to care about other people's progress. I couldn't believe my luck.", image: { src: "images/story/story-coach-1.jpg", scene: "Coaching improv and tennis.", caption: "One of the improv teams I coached." } },
    { slug: "first-company", years: "19", line: "I started Sway, a small accessories company, between classes. It taught me every job at once, including the humbling ones, like selling face to face and doing my own books.", image: { src: "images/story/story-first-company-1.jpg", scene: "The Sway Accessories years.", caption: "Sway, my first company." } }
  ]
};

/* the chapters: same shape each time, a closing line that points forward */
const STORY2_CHAPTERS = [
  {
    slug: "facilitator",
    years: "2018 – 2019 · Université Laval",
    title: "The facilitator of the space",
    story: [
      "I went into business school at Université Laval, in Québec City, believing that to change anything you needed power, and that business was where power lived. University changed my mind. I met a PhD student who had noticed something odd: dozens of groups on campus, from students to researchers to the administration, were working on sustainability, and none of them were talking to each other.",
      "So instead of founding yet another club, we built the connections between them. We mapped everyone, made the introductions, hosted the gatherings, and borrowed the UN's seventeen Sustainable Development Goals as a common language, so sixty student associations and the administration could stop reinventing each other's wheels.",
      "Nobody was in charge, and that was the discovery. Most spaces don't need another leader. They need someone who holds the room so everyone else can lead. I finally had a name for what I'd been doing since I was five."
    ],
    stayed: "Change starts when the people already doing the work find each other.",
    builtWith: "Built with a PhD student, sixty student associations and Université Laval.",
    margin: "Who taught me this: a PhD student who saw the gaps before anyone else did.",
    images: [ { src: "images/story/story-facilitator-1.jpg" }, { src: "images/story/story-facilitator-2.jpg" }, { src: "images/story/story-facilitator-3.jpg" } ]
  },
  {
    slug: "scale",
    years: "2019 – 2021",
    title: "Trying it at the scale of a country",
    story: [
      "That little alliance took me to the UN's High-Level Political Forum in New York, the yearly meeting where countries report on those same goals. The most useful part was the hallway, where I met young people from across Canada who had hit the same wall on their own campuses.",
      "We started two things together. A national youth network, so young people could choose their own representatives instead of being chosen. It reached more than fifty thousand of them and kept people organizing through the first months of the pandemic. And ReImagine17, a national nonprofit where we wrote the playbook for campus alliances and created paid sustainability jobs for students. Our team grew, and I learned a lot about leading, often the hard way.",
      "Here's the part I'm proud of. We built a culture where everyone led something and backed everyone else's something. I stepped away, came back two years later to visit, and it was all still running. Better than when I left, in places."
    ],
    stayed: "A community is working when it no longer needs you.",
    builtWith: "Built with the ReImagine17 team and young organizers across Canada.",
    images: [ { src: "images/story/story-scale-1.jpg" }, { src: "images/story/story-scale-2.jpg" }, { src: "images/story/story-scale-3.jpg" }, { src: "images/story/story-scale-4.jpg" } ]
  },
  {
    slug: "houses",
    years: "2020 – today · Vancouver & Montréal",
    title: "The houses",
    story: [
      "It started in Tokyo. During an exchange year at Sophia University I lived in a share-house with a common room big enough to host, in a city where almost nobody can. A rotating cast from everywhere, dinners that went long. I didn't call it coliving yet. I just knew I had never felt so at home.",
      "Summer 2020, Vancouver, mid-pandemic. I wanted that feeling back, and I wanted to be surrounded by people making things. So I posted ads with stock photos of what a shared house could look like, and interviewed about fifty strangers for a house I didn't have yet. A group formed around the idea, we found the house together, and it became the Growth Hub, a shared house for young entrepreneurs and creatives. More houses followed. In Montréal I designed the interior myself, every room with one job to do.",
      "I made plenty of mistakes: wrong roommate calls, fuzzy house rules, a beautiful common room nobody used. That last one taught me the most. The room only came alive when I asked the people living there what they actually needed, and redesigned it with them. The case studies on this site are those field notes."
    ],
    stayed: "Build it with the people who'll live in it, then let it teach you.",
    builtWith: "Built with the housemates of the Growth Hub houses and the Montréal house.",
    margin: "What I got wrong: designing for people instead of with them.",
    images: [ { src: "images/story/story-houses-1.jpg" }, { src: "images/story/story-houses-2.jpg" }, { src: "images/story/story-houses-3.jpg" }, { src: "images/story/story-houses-4.jpg" }, { src: "images/story/story-houses-5.jpg" } ]
  },
  {
    slug: "rooms-that-move",
    years: "2022 – 2024 · C2, Montréal",
    title: "Rooms that change people",
    story: [
      "Back in Montréal I joined C2 Montréal, a yearly business conference famous for its theatrical, immersive staging. Officially, I worked in sales and operations.",
      "But the real education was watching their designers work. Stages that move mid-session. Rooms built for the exact kind of collaboration they want to spark. I had spent years sensing that space changes people. At C2 I watched professionals do it on purpose. A design-thinking program at La Factry, a Montréal school of creativity, then gave that instinct a method.",
      "I came for a job in sales and left seeing rooms the way a designer does."
    ],
    stayed: "Space is a tool you can aim at connection.",
    builtWith: "Built with the C2 Montréal team.",
    margin: "Who taught me this: C2's set and experience designers.",
    images: [ { src: "images/story/story-rooms-1.jpg" }, { src: "images/story/story-rooms-2.jpg" }, { src: "images/story/story-rooms-3.jpg" } ]
  },
  {
    slug: "hard-chapter",
    years: "2024 – 2026 · Vancouver",
    title: "The startup years",
    story: [
      "Then I co-founded an AI startup that helped factories plan their production, in an industry I knew nothing about. I was the business half: operations, sales, learning everything from zero. We joined an accelerator, went to San Francisco, slept in the office some nights, and got real work into real factories.",
      "After a year and a half we looked at it honestly and chose to stop. The sales cycles were long, the market moved slowly, and our energy belonged elsewhere. I'm glad I lived it. It taught me how to work under pressure, and it showed me what I actually want.",
      "Somewhere in those months I noticed which parts of my week I protected no matter what. They all looked like the house."
    ],
    stayed: "I can build the machine. I'd rather build the village.",
    image: { src: "images/story/story-hard-1.jpg", scene: "The startup years." }
  },
  {
    slug: "now",
    years: "2026 · Montréal",
    title: "Now: the beginning of a new path",
    story: [
      "I'm not going to pretend I've found the answer. I'm at the beginning of a new path, not the end of an old one. What I know is the direction: putting my energy into building more hope, and coliving is where I've seen connection built most concretely.",
      "I have a lot to learn, and I want to learn it with others. This site is my workshop for that: a tower of everything I'm gathering, built in the open."
    ],
    stayed: "Let's build the places where people find each other.",
    image: { src: "images/story/story-now-1.jpg", scene: "The beginning of a new path." }
  }
];

/* the forward-looking end of the story: leaves room for other people's dreams */
const STORY2_CLOSE = {
  kicker: "The floors above",
  line: "The floors above aren't built yet.",
  body: "I'd like to build them with people whose dreams are different from mine. Maybe one of them is yours.",
  doors: [
    { href: "about.html", t: "Who I am now", d: "About me" },
    { href: "work.html", t: "The work", d: "Projects and case studies" }
  ]
};

/* About + Story contact box (the Work page keeps ABOUT_CTA) */
const ABOUT_CLOSE = {
  line: "Building something, dreaming of it, or just curious?",
  sub: "I'd love to hear from you. I read every message myself.",
  email: "pierreantoinedescoteaux@gmail.com"
};

/* ---------------- ABOUT: who I am now ---------------- */
const ABOUT_ME = {
  kicker: "About me",
  title: "A small-town kid who fell for big tables.",
  paras: [
    "I grew up in Drummondville, a small town between Québec City and Montréal, an only child raised by a mother who taught. Watching her, I learned early that helping someone grow is about the best thing a person can do.",
    "Today I live in Montréal, in a shared house. I'm happiest in two places: around a long table full of people, and alone on a trail in the woods. I care a lot, I start a lot, and I'm still learning how to do both well."
  ],
  facts: [
    { k: "Based in", v: "Montréal" },
    { k: "Grew up in", v: "Drummondville, Québec" },
    { k: "Lives in", v: "A coliving house" },
    { k: "Speaks", v: "French, English, some Japanese, a little Spanish" }
  ],
  photos: [
    { src: "images/about-tree.jpg", cap: "Under a tree, my favourite office." },
    { src: "images/about-1.jpg", cap: "Hosting an evening at La Factry." },
    { src: "images/mtl-formal-dinner.jpg", cap: "One of our house dinners." },
    { src: "images/mtl-brunch-jam.jpg", cap: "A Sunday brunch jam." }
  ]
};

const ABOUT_RIGHTNOW = {
  kicker: "Right now",
  title: "Living it, and looking for what's next.",
  body: "I live in the Montréal house, I'm building this site in the open, and I'm looking for my next step in coliving. Whatever it turns out to be, I want to build it with people.",
  asks: [
    { k: "A team to join", d: "An organization building or running community housing, where I can bring what the houses taught me." },
    { k: "People to build with", d: "If you're starting a coliving project, in Québec or elsewhere, I'd love to help shape it." },
    { k: "Future housemates", d: "People who want to live this way, and maybe build the next house together." },
    { k: "Conversations", d: "If you're further along than me, I'd love to learn from you. Coffee's on me." }
  ]
};

/* "How I work" on About */
const STORY2_PILLARS = {
  kicker: "How I work",
  title: "What the spaces taught me.",
  intro: "Different spaces, same lessons. These are the principles I try to build by, most of them learned the hard way, and from people further along.",
  items: [
    { t: "Co-create with humility", d: "The space belongs to the people in it. My job is to hold it, not to own it." },
    { t: "Let it take its time", d: "Good communities take time. Rushing them never works." },
    { t: "Start from shared values", d: "Bring together people who share what matters. Everything else builds on that." },
    { t: "Grow it with rituals", d: "A table becomes a community through the meals that repeat at it." },
    { t: "Design with people, not for them", d: "My first common room was beautiful and empty. It came alive once we asked what people needed: a cozy corner to read, open space to host or do yoga." },
    { t: "Say things out loud", d: "Name expectations, bring up tensions early. Spaces stay healthy when people talk." }
  ]
};

const ABOUT_LEARNING = {
  kicker: "What I'm learning",
  title: "The questions I'm living with.",
  intro: "I don't have answers to these. I'm not sure anyone does yet. If you're asking them too, I'd love to think about them together.",
  questions: [
    "How might we live collectively while keeping the right balance of autonomy?",
    "What would it take for belonging to be the default, not the exception?",
    "Can a home be designed to make the people in it kinder to each other?",
    "What do we owe the people we live beside?",
    "What would our cities look like if we built them for connection first?"
  ],
  shelfTitle: "A few books that changed how I think",
  shelf: [
    { t: "The Art of Gathering", a: "Priya Parker" },
    { t: "The More Beautiful World Our Hearts Know Is Possible", a: "Charles Eisenstein" },
    { t: "Let My People Go Surfing", a: "Yvon Chouinard" },
    { t: "Siddhartha", a: "Hermann Hesse" },
    { t: "The Untethered Soul", a: "Michael A. Singer" }
  ],
  shelfLink: { href: "inspiration.html", go: "More in the library" }
};

const ABOUT_SIDEQUESTS = {
  kicker: "Side quests",
  title: "More interests than hours.",
  intro: "My main quest is building places where people grow together. Along the way I keep picking up side quests. Most of them come back as ideas, skills, or at least a good story.",
  items: [
    { icon: "run", k: "Running", line: "Twelve years of it and one marathon, mostly to find out if I could. My best ideas show up somewhere in the second hour." },
    { icon: "guitar", k: "Guitar", line: "I play well enough to start every song at a party, and finish about half of them." },
    { icon: "sit", k: "Meditation", line: "Compassion in Action, a year-long fellowship rooted in Tibetan Buddhism, took me to two retreats in the Montana mountains. Doing less is still my hardest side quest." },
    { icon: "sail", k: "Sailing", line: "Where I learned that a crew works when everyone knows their job and trusts the others to do theirs." },
    { icon: "dance", k: "Salsa", line: "Proof that you can learn anything if you're willing to look a bit silly for the first few months." },
    { icon: "book", k: "Books", line: "Psychology, Buddhism, cities, company culture, novels. My nightstand is a small library with no system." },
    { icon: "path", k: "Careers", line: "Business, nonprofits, events, film, a startup. Each one handed me a tool I still use in the houses." }
  ]
};

/* "Where I can help" on About */
const ABOUT_NOW2 = {
  title: "Where I can help",
  sub: "If you're building something, here's where I can be useful.",
  items: [
    {
      k: "Communities that last",
      line: "The culture we built at ReImagine17, my national nonprofit, a team of fourteen, was still running two years after I left. Since then, the houses: choosing people, welcoming them, and the occasional late-night conflict.",
      href: "story.html#scale", go: "That story"
    },
    {
      k: "Spaces designed around people",
      line: "I designed the Montréal house room by room, then reshaped it with the people living there. The designers at C2 Montréal taught me to see a room the way a director sees a scene.",
      href: "design.html", go: "Design for Connection"
    },
    {
      k: "The practical side",
      line: "CRMs, playbooks, dashboards, automation. I learned the systems so the human side has room to breathe.",
      href: "story.html#rooms-that-move", go: "The C2 years"
    },
    {
      k: "Starting things, with others",
      line: "Three nonprofits, a company, a startup, and five businesses born in our houses. Over three years we raised more than $300K for the initiatives I started. The startup we chose to close taught me the most.",
      href: "work.html", go: "Work & case studies"
    }
  ]
};
