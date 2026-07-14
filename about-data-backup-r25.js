/* =====================================================================
   ABOUT ROOM — content layer (About + My Story).
   Written from the master story reference:
   ~/.claude/projects/C--Users-User/memory/reference_pa_personal_story.md
   [edit] = Claude draft awaiting P-A's voice.
   Images: `src` renders a real photo; no `src` renders a placeholder
   showing `scene` (the photo P-A should dig up or shoot).
   ===================================================================== */

const ABOUT_INTRO = {
  eyebrow: "About Pierre-Antoine",
  titleHtml: "I've been building the <em>same thing</em> my whole life.",
  lede: "Rooms where people grow because of each other. I just didn't always know that's what it was called. [edit]",
  portrait: { src: "images/about-portrait.jpg", scene: "Portrait of Pierre-Antoine — warm light, relaxed." }
};

const ABOUT_THREAD = {
  line: "A stone playhouse at five. An improv team at eighteen. A campus at twenty-one. A house in Tokyo. Four houses of my own. The shape never changed — only the scale.",
  body: "This page is the short version. The long one — the story, told honestly, including the parts that didn't work — is one click away. [edit]"
};

/* ------- the story chapters (story.html) ------- */
const ABOUT_CHAPTERS = [
  {
    slug: "stone-house",
    years: "Growing up in Drummondville",
    title: "The stone house",
    story: [
      "I grew up an only child in a small town between Québec City and Montréal, raised by my mother — a teacher, and the strongest person I know. There wasn't much to do, which turned out to be a gift: when there's nothing to do, you build. Lego, sandcastles, forts in the woods.",
      "When I was five I stacked a playhouse out of stone bricks, twice my height, and invited my friends in. I didn't know it yet, but that was the whole career plan: make a space, bring people into it, see what happens. [edit]"
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
      "Then I got to coach: improv teams and tennis players, kids and adults. It was the first time I was formally responsible for other people's growth, and I loved it more than anything I'd done. [edit]"
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
      "The company taught me every job at once — product, marketing, accounting, selling face to face. And the deeper I got, the more I understood that business was a set of tools, not a destination. What I actually cared about was what the tools could build. [edit]"
    ],
    stayed: "Sales, budgets, operations — I learned the unglamorous machinery early, and I've never been afraid of it since.",
    image: { scene: "PHOTO WANTED — Sway Accessories era: a product shot, a market stand, or P-A at a case competition (Jeux du commerce / Happening Marketing podium)." }
  },
  {
    slug: "facilitator",
    years: "2018 – 2019 · Université Laval",
    title: "The facilitator of the space",
    story: [
      "At university in Québec City I met a PhD student who had noticed something: dozens of groups were working on sustainability — students, admin, researchers — and none of them were talking to each other. We co-founded an alliance whose only job was to be the connective tissue.",
      "We mapped every actor on campus, made the introductions, hosted the gatherings, and used the UN's seventeen development goals as a shared vocabulary so sixty student associations and the administration could finally pull in the same direction.",
      "That experience named the pattern I'd been living since the stone house: most spaces don't need another actor. They need a facilitator of the space. [edit]"
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
      "What I'm proudest of isn't the funding we raised or the events. It's the culture. Everyone led something and backed everyone else's something. Two years after I stepped away, I came back to visit — and the culture was still there, running without me. That's when I understood what building actually means. [edit]"
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
      "Pooling our resources bought us something none of us could afford alone: a place where things happened. Dinners, arguments, projects, friendships. I didn't call it co-living yet. I just noticed that I was more alive there than anywhere I'd ever lived. [edit]"
    ],
    stayed: "The seed. Shared space isn't a compromise — it's an upgrade nobody told us about.",
    image: { scene: "PHOTO WANTED — the Tokyo share-house common room, or a group dinner there. Even a bad phone photo carries it." }
  },
  {
    slug: "houses",
    years: "2021 – today · Vancouver & Montréal",
    title: "The houses",
    story: [
      "In Vancouver I stopped waiting for someone else to build the room. I started the Growth Hub — a house where young entrepreneurs live, push each other, and start things. Two businesses were born at that kitchen table; one has passed a hundred thousand in revenue. Then more houses, and in Montréal I finally went all the way: I designed the interior myself, every room with a job to do.",
      "I need to say this plainly, because it's the part I used to soften: none of this was a job. Nobody hired me, there was no company, no title. I found the houses, chose the people, set the culture, resolved the conflicts, coached the ones who wobbled, and rebuilt the spaces as we learned what they needed to be. All of it was real — the proof is in the case studies, and in the people.",
      "Those years are where everything on this site comes from. The atlas, the design patterns, the manifesto — it's all field notes from living it. [edit]"
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
      "Officially I worked in sales and operations, and I did the full unglamorous stack: beat a ticket target by a third, rebuilt the CRM, wrote the playbooks, automated most of my own reporting job. But what I really took from C2 was a trained sensitivity to space — watching professionals design a room the way a director designs a scene. At the same time, a design-thinking program at La Factry gave that instinct a method. [edit]"
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
      "What I wanted, it turned out, was the thing I kept doing for free my whole life. [edit]"
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
      "If you're building a place where people are supposed to grow because of each other, that's the room I've been building since I was five. I'd love to help you build yours. [edit]"
    ],
    stayed: "Community as the antidote to isolation — and space as the tool that makes it stick.",
    image: { scene: "PHOTO WANTED — recent: P-A hiking / trail running, or hosting a dinner at the Montréal house. Warm, outdoors or golden-hour indoors." }
  }
];

/* ------- the honest-footing statement (rendered between chapters and on about.html) ------- */
const ABOUT_TRANSPARENCY = {
  kicker: "Said plainly",
  line: "None of this was a job. All of it was real.",
  body: "No landlord hired me, no operator certified me. I built and ran these houses because I believed in them — which means what you'll find here isn't corporate polish, it's lived knowledge with the receipts to match. [edit]"
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
   STORY v2 (story2.html) — P-A feedback 2026-07-12:
   (1) weight by hiring value — charisma moments small (vignette strip),
       skill-bearing eras keep full chapters;
   (2) TONE = personal essay, "telling my story in my way" — humble,
       funny, authentic, not pitchy.
   Fresh copy (does NOT reuse ABOUT_CHAPTERS). story.html v1 untouched
   for comparison. [edit] = Claude draft awaiting P-A's voice.
   ===================================================================== */

/* small, charming, fast — authenticity texture, not resume weight */
const STORY2_TEXTURE = {
  kicker: "Before any of it had a name",
  intro: "The short version of the first twenty years, because you have things to do. [edit]",
  items: [
    { slug: "stone-house", years: "Age 5", line: "I stacked a playhouse out of stone bricks — twice my height, zero permits — and invited the neighbourhood in. I've been told the career plan hasn't changed much since.", image: { scene: "PHOTO WANTED — childhood: building something or playing outside. Grainy family photo is perfect." } },
    { slug: "organizer", years: "School years", line: "I was the kid who organized things. Class rep, school president in sixth grade, eventually 'organizer of the year' — mostly because nobody else wanted to run the student radio AND the dance AND the fair.", image: { scene: "PHOTO WANTED — school-years P-A mid-organizing: on stage, at the radio, with a team." } },
    { slug: "coach", years: "16 – 20", line: "I coached improv teams and tennis players, kids and adults. Someone was paying me to care about other people's progress. I couldn't believe my luck.", image: { scene: "PHOTO WANTED — coaching era: improv team or on court with students." } },
    { slug: "first-company", years: "19", line: "I started a little accessories company between classes. It taught me every job at once — including the humbling ones, like selling face to face and doing my own books.", image: { scene: "PHOTO WANTED — Sway Accessories era: product, market stand, or a case-competition podium." } }
  ]
};

/* the skill-bearing eras — full chapters, essay voice */
const STORY2_CHAPTERS = [
  {
    slug: "facilitator",
    years: "2018 – 2019 · Université Laval",
    title: "The facilitator of the space",
    story: [
      "I went into business school convinced that if you wanted to change anything you needed power, and that business was where power lived. University had other plans. I met a PhD student who had noticed something odd: dozens of groups on campus were working on sustainability — students, researchers, the administration — and none of them were talking to each other.",
      "So instead of founding yet another club, we built the connective tissue. We mapped everyone, made the introductions, hosted the gatherings, and borrowed the UN's seventeen development goals as a common language so that sixty student associations and one administration could stop reinventing each other's wheels.",
      "Nobody was in charge, and that was the discovery. Most spaces don't need another leader — they need someone who holds the room so everyone else can lead. I finally had a name for the thing I'd been doing since the stone house. [edit]"
    ],
    stayed: "Map the players, build the common language, host the room.",
    image: { scene: "PHOTO WANTED — an Alliance event at ULaval: a room of students mid-workshop, or P-A facilitating." }
  },
  {
    slug: "scale",
    years: "2019 – 2021",
    title: "Trying it at the scale of a country",
    story: [
      "That little alliance somehow got me to the UN's High-Level Political Forum in New York — badge, marble halls, imposter syndrome, the whole package. The useful part turned out to be the hallway, where I met young people from across Canada who had hit the same wall on their own campuses.",
      "We started two things together. A national youth network, because we thought young people should choose their own representatives instead of being chosen — it reached over fifty thousand of them and kept people organizing through the first pandemic months. And ReImagine17, a nonprofit where we wrote the playbook for campus alliances and created paid sustainability jobs for students. At some point I was 'managing' fourteen people, a word I use loosely, because half of what I did was learn payroll the hard way.",
      "Here's the part I'm actually proud of. We built a culture where everyone led something and backed everyone else's something. I stepped away for two years, came back to visit — and it was all still running. Better than when I left, in places. Nothing has taught me more about what building actually means. [edit]"
    ],
    stayed: "A community is working when it no longer needs you.",
    image: { scene: "PHOTO WANTED — UN HLPF 2019 delegate shot, or a ReImagine17 team retreat — people, not logos." }
  },
  {
    slug: "houses",
    years: "2021 – today · Vancouver & Montréal",
    title: "The houses",
    story: [
      "In Vancouver I stopped waiting for someone else to build the room. I started the Growth Hub — a house where young entrepreneurs live together and push each other. Two businesses started at that kitchen table, and one has passed a hundred thousand in revenue, which still makes me smile, because the 'incubator' was literally a kitchen.",
      "Then more houses. In Montréal I finally went all the way and designed the interior myself — every room with one job to do. Along the way I made most of the mistakes available on the market: wrong roommate calls, fuzzy house rules, a common room that was beautiful and completely dead until I understood why.",
      "Let me say the quiet part plainly, because I used to soften it: none of this was a job. Nobody hired me. No company, no title, no salary. I found the houses, chose the people, set the culture, patched the conflicts, and rebuilt the spaces as we learned what they wanted to be. Five years, four houses, all real — the case studies have the receipts.",
      "Everything on this site — the atlas, the design patterns, the manifesto — is field notes from those years. [edit]"
    ],
    stayed: "Run the experiment on yourself first. I did.",
    image: { src: "images/mtl-living-room.jpg", scene: "The Montréal house living room — the interior P-A designed." }
  },
  {
    slug: "rooms-that-move",
    years: "2022 – 2024 · C2, Montréal",
    title: "Rooms that change people",
    story: [
      "Back in Montréal I joined C2, the people behind one of the most theatrical business events anywhere. Officially I worked in sales and operations — I beat a ticket target by a third, migrated a CRM, wrote the playbooks, automated most of my own reporting, and made a lasting peace with spreadsheets.",
      "But the real education was watching their designers work. Stages that move mid-session. Rooms engineered for the exact kind of collaboration they want to spark. I had spent years intuiting that space changes people; C2 was the first place I watched professionals aim it on purpose. A design-thinking program at La Factry then gave the instinct a method.",
      "That's the strange gift of those years: I went for the craft, and left with a trained eye. [edit]"
    ],
    stayed: "Space is a tool you can aim.",
    image: { scene: "PHOTO WANTED — a C2 event floor shot (the immersive staging), ideally with P-A in it." }
  },
  {
    slug: "hard-chapter",
    years: "2024 – 2026 · Vancouver",
    title: "The chapter that didn't work",
    story: [
      "Then I co-founded an AI startup in manufacturing. I knew nothing about manufacturing, which in startup mythology is supposed to be charming. I was the business half — operations, revenue, learning an industry from zero. We joined an accelerator, did the San Francisco pilgrimage, slept in the office some nights, and sold about three hundred and fifty thousand dollars of work.",
      "It still didn't grow the way it needed to. The sales cycles were long, the market was patient, and we weren't. After a year and a half we looked at it honestly and stopped.",
      "I won't dress that up as 'failing forward'. It stung. But somewhere in those months I finally saw the pattern: every version of my life I've actually loved had the same shape — and it wasn't software. It was the thing I kept doing for free. [edit]"
    ],
    stayed: "I can build the machine. I'd rather build the village.",
    image: { scene: "PHOTO WANTED — startup era: late-night office, the SF trip, or a whiteboard of scheduling diagrams. Honest > polished." }
  },
  {
    slug: "now",
    years: "2026 · Montréal",
    title: "Now: all of it, on purpose",
    story: [
      "Along the way there was a year-long fellowship on compassion — two retreats in the Montana mountains with Tibetan Buddhist teachers, which is a sentence I never expected to write — and a deepening obsession with psychology, meditation, and how environments shape minds. I run, I lift, I finished a marathon once and mention it exactly as often as marathon finishers do. The woods are still where my head gets quiet.",
      "Today it all points one direction: co-living. Not nostalgia for my houses — a craft. Facilitation, space design, operations, care. Separately they're skills; together they're how you build places where people grow because of each other.",
      "This site is my workshop for that craft. If you're building one of those places, I'd love to help you build yours. [edit]"
    ],
    stayed: "Community as the antidote to isolation — space as the tool that makes it stick.",
    image: { scene: "PHOTO WANTED — recent: hiking / trail running, or hosting a dinner at the Montréal house. Warm light." }
  }
];

/* Tokyo compressed into a single turning-point interlude (renders before the houses chapter) */
const STORY2_INTERLUDE = {
  before: "houses",
  years: "2019 – 2020 · Tokyo",
  quote: "Between those chapters I lived a year in Tokyo, in a share-house with a common room big enough to host — in a city where almost nobody can. A rotating cast from everywhere, dinners that went long. I was more alive there than anywhere I'd lived. I didn't call it co-living yet. I just didn't want it to end.",
  image: { scene: "PHOTO WANTED — the Tokyo share-house common room or a group dinner there." }
};

/* what-I-bring v2: capability → honest receipt → where to see it */
const ABOUT_NOW2 = {
  title: "What I bring to a co-living team",
  sub: "Four things I'm good at, with receipts instead of adjectives. [edit]",
  items: [
    {
      k: "Communities that outlive me",
      line: "The culture we built at my nonprofit was still running two years after I left — humbling, in the best way. Since then: four houses of curation, onboarding, and the occasional late-night conflict mediation.",
      href: "story.html#scale", go: "That story"
    },
    {
      k: "Space aimed at behavior",
      line: "I designed the Montréal house room by room and trained my eye at C2, where stages literally move to change how a room feels. The design bank on this site is those lessons written down.",
      href: "design.html", go: "Design for Connection"
    },
    {
      k: "The unglamorous machinery",
      line: "CRMs, playbooks, dashboards, automation — I learned the boring systems so the human stuff has room to happen. At C2 I beat a ticket target by 33% and automated most of my own reporting job.",
      href: "story.html#rooms-that-move", go: "The C2 years"
    },
    {
      k: "Zero-to-one, honestly",
      line: "One company, three nonprofits, $100K+ raised, two businesses incubated at my kitchen table — and one startup I shut down after eighteen honest months. I count that last one as a credential too.",
      href: "work.html", go: "Work & case studies"
    }
  ]
};
