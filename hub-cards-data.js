/* HUB CARDS: option cards for themes.html, built by _tools/build-hub.js from
   _tools/hub/<group>.json. Edit those, then rebuild. */
var HUB_CARDS = {
 "setting": [
  {
   "id": "city",
   "name": "City",
   "summary": "The project sits in a dense, built-up neighbourhood. Land is scarce and costly. Transit and shops are right outside the door.",
   "body": "A city project fits into streets that already exist. It is usually a compact building, sometimes squeezed onto a tight site or made by reusing an older one. Land is rare and tightly regulated, so the group spends a lot of time talking with the municipality and the neighbours.\n\nLife outside the front door is already full. Transit and groceries are close by. Clinics and cafes are a short walk away. Many households can live without a car. Because so much is available nearby, the shared spaces inside can stay modest. They still matter, since they give a small group of neighbours a place to meet without leaving the building.\n\nThe Quebec guide says urban projects are often asked to open up to the street, since they sit so close to their neighbours. A ground floor with a shop or a public room helps the neighbourhood accept the project and ties the residents into local life.\n\nThe hard part is money and rules. Land costs the most here and zoning is strict. A small lot leaves little room for gardens or play space. Balconies and roofs often do that job. Shared cars and bikes are easier to justify when streets are crowded and parking is scarce. A group that picks the city gets convenience and connection, and pays for it in price and in patience with permits.",
   "pros": [
    "Transit and shops are close by",
    "The project ties into an existing neighbourhood"
   ],
   "cons": [
    "Land is scarce and costs the most",
    "Zoning and neighbours need constant dialogue"
   ],
   "impact": {
    "building": {
     "dot": "harder",
     "t": "Tight sites and strict rules"
    },
    "social": {
     "dot": "easier",
     "t": "Neighbours and services already close"
    },
    "governance": {
     "dot": "depends",
     "t": "City hall becomes a partner"
    },
    "legal": {
     "dot": "harder",
     "t": "Dense zoning and permit rules"
    },
    "money": {
     "dot": "harder",
     "t": "Highest land prices"
    }
   },
   "bestWhen": "When the group wants to live without a car and close to work, and can afford the land and the permit process.",
   "examples": [
    "kalkbreite",
    "nightingale"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "suburb",
   "name": "Suburb",
   "summary": "The project stands between city and countryside. There is more room for gardens and open space, but a car is often needed for daily errands.",
   "body": "The suburb sits between city and country. Land costs less than downtown and there is more of it, so buildings can spread out and gardens can be bigger. Townhouses and low blocks are common, with generous outdoor space around them. The Quebec guide says this kind of site allows more open building shapes and bigger yards.\n\nShared spaces matter more here than in a city, because the shops are farther away. A common house or a garden becomes the place where neighbours meet. The guide says these spaces carry much of the project's social life and help the group share what it owns.\n\nThe weak point is getting around. Without planning, every errand needs a car, and a project can end up cut off from the area around it. Groups often respond with a shared car or a site near a station. The guide says the main challenge is balancing quality of life with access to the area.\n\nThe suburb suits groups who want a quieter pace and some space for children without moving far from jobs and schools. It is a middle path for many groups, with some of the room of the country and some of the reach of the city. Because shared yards and play areas are easier to fit here, families often find it a good match for daily life.",
   "pros": [
    "More room for gardens and common spaces",
    "Land costs less than in the city centre"
   ],
   "cons": [
    "Daily errands often need a car",
    "The project can feel cut off from the area"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "More space and simpler sites"
    },
    "social": {
     "dot": "depends",
     "t": "Shared spaces carry the social life"
    },
    "governance": {
     "dot": "easier",
     "t": "Fewer outside parties involved"
    },
    "legal": {
     "dot": "depends",
     "t": "Rules vary by municipality"
    },
    "money": {
     "dot": "easier",
     "t": "Cheaper land than downtown"
    }
   },
   "bestWhen": "When the group wants space and quiet but still needs to reach jobs and schools within a short drive.",
   "examples": [
    "trudeslund",
    "windsong",
    "muir-commons"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "countryside",
   "name": "Countryside",
   "summary": "The project sits in a village or on open land. There is room for fields and nature, but services are far away and keeping the group full takes work.",
   "body": "A rural project has the most land and the most freedom. Homes are usually grouped in a small cluster, like a little village, so that the fields stay open around them. The Quebec guide notes that this keeps some density, which helps neighbours meet. It also makes shared roads and utilities cheaper.\n\nThe group often lives close to farming and nature, and ties with local people tend to be strong. Shared spaces hold daily life together. They give the group room for meals and tools, and sometimes a small business. A new project can also help a village by bringing in families and letting older people stay in the place they know.\n\nThe cost is distance. Jobs and schools are far away, and so are clinics, a car is almost always needed, and the risk of isolation is real. Finding new members when someone leaves can take time, since fewer people are searching in a small area. The guide says the project must fit into the local economy to last. That means knowing the nearby farms and workplaces before moving in.\n\nLocal rules decide what can be built. In Quebec, regional county plans set the limits, so a group should check them before buying land. Water and power may also need to be brought in, which adds to the budget early on.",
   "pros": [
    "Plenty of land and room to grow food",
    "A project can bring new life to a village"
   ],
   "cons": [
    "Services and schools are far away",
    "Finding new members can be slow"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Free land, but needs utilities"
    },
    "social": {
     "dot": "depends",
     "t": "Close group, far from others"
    },
    "governance": {
     "dot": "easier",
     "t": "Few outside voices at the table"
    },
    "legal": {
     "dot": "depends",
     "t": "Regional plans limit what is built"
    },
    "money": {
     "dot": "easier",
     "t": "Land costs less per home"
    }
   },
   "bestWhen": "When the group wants land and a slower life, and is ready to deal with distance and car travel.",
   "examples": [
    "findhorn",
    "ecovillage-ithaca",
    "neot-smadar"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  }
 ],
 "building": [
  {
   "id": "new",
   "name": "New build",
   "summary": "The group builds on empty land and designs the place from scratch. It gets the most freedom, and also the most work and risk.",
   "body": "A new build starts with a blank site. The group works with an architect to decide where the common house goes, how homes face each other and which rooms are shared. The Quebec guide says empty land gives the most freedom in design.\n\nThe price of that freedom is work. Empty land usually needs roads and pipes before anything goes up, and each choice is paid for. Designing with future residents takes many workshops, and the group has to agree on trade-offs when the budget runs short.\n\nFor people living together, a new building can be planned for good soundproofing and step-free access. It can also include rooms that change as households grow.",
   "pros": [
    "Full freedom to design for shared life",
    "Modern standards for access and sound"
   ],
   "cons": [
    "Empty land needs costly site work",
    "Long design and permit process before moving in"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Total freedom, total responsibility"
    },
    "social": {
     "dot": "easier",
     "t": "Design built around the group"
    },
    "governance": {
     "dot": "harder",
     "t": "Many design choices to agree on"
    },
    "legal": {
     "dot": "depends",
     "t": "Permits for every stage"
    },
    "money": {
     "dot": "harder",
     "t": "Site work adds to the cost"
    }
   },
   "bestWhen": "When the group has a clear idea of how it wants to live and the money and patience to build it.",
   "examples": [
    "lilac",
    "kalkbreite",
    "windsong"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "converted",
   "name": "Converted building",
   "summary": "The group takes an existing building, such as a farm. It becomes shared homes. It can save time and keep a place's history.",
   "body": "A converted building starts from what already stands. The group may take over an old school or an office block and reshape the rooms for shared living. The Quebec guide says an existing building can bring a site back to life and honour its heritage. It usually brings tighter technical and legal limits.\n\nThe walls and roof are already there, which can shorten the wait before people move in. The group has to work with them, though. Old plumbing and thick walls make soundproofing and energy upgrades harder. Zoning may need to change if the use changes.\n\nFor residents, a conversion often gives a place with character. The guide adds that the best choice is the one that fits what the group wants, even when it costs more.",
   "pros": [
    "Keeps a building and its history alive",
    "Walls and roof are already in place"
   ],
   "cons": [
    "Old structures limit layout and sound",
    "Change of use may need new permits"
   ],
   "impact": {
    "building": {
     "dot": "harder",
     "t": "Old structure limits the layout"
    },
    "social": {
     "dot": "depends",
     "t": "Rooms may not suit shared life"
    },
    "governance": {
     "dot": "depends",
     "t": "Group decides what to keep"
    },
    "legal": {
     "dot": "harder",
     "t": "Change of use needs approval"
    },
    "money": {
     "dot": "depends",
     "t": "Savings or surprises behind walls"
    }
   },
   "bestWhen": "When a fitting building is available, and the group values its character more than a perfect plan.",
   "examples": [
    "sende",
    "coconat"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "mixed",
   "name": "New + converted",
   "summary": "The project adds new buildings next to an older one. It joins the character of the old with the comfort of the new.",
   "body": "Some projects use both. The group keeps an older building, such as a barn. New homes go up beside it. Or a new wing joins an old block. The old part often holds the common house, and the new part holds the private homes.\n\nThis lets the group choose what to keep and what to start fresh. Old rooms can give character to shared spaces, while new construction can meet today's rules for access and energy. It also lets a project grow in stages as money and members arrive.\n\nThe trade-off is that the group manages two kinds of work at once. Old and new parts need different builders and permits, and the joins between them need care.",
   "pros": [
    "Keeps older character and adds modern comfort",
    "Can be built in stages as money arrives"
   ],
   "cons": [
    "Two kinds of building work to manage",
    "The join between old and new needs care"
   ],
   "impact": {
    "building": {
     "dot": "harder",
     "t": "Two kinds of work at once"
    },
    "social": {
     "dot": "easier",
     "t": "Old rooms add character to shared life"
    },
    "governance": {
     "dot": "harder",
     "t": "More choices on what to keep"
    },
    "legal": {
     "dot": "harder",
     "t": "Different rules for each part"
    },
    "money": {
     "dot": "depends",
     "t": "Phasing helps, mixing adds cost"
    }
   },
   "bestWhen": "When a site already has a building worth keeping that is too small for the whole group.",
   "examples": [
    "terra-firma"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  }
 ],
 "size": [
  {
   "id": "small",
   "name": "Small (about 6 to 14 homes)",
   "summary": "A close group where everyone knows everyone. Decisions are quick and the bond is strong, but costs per home run higher.",
   "body": "A small project feels like a large shared house. Neighbours know each other well and talking things through is simple. The Quebec guide notes that people feel directly responsible for the place. Decisions stay light and quick.\n\nThe flip side is fragility. With few households, one person who steps back leaves a gap. Being close all the time can raise tension, so the group needs good habits for talking things out. Costs per home are higher, and there is less money for shared rooms and equipment.\n\nBelow six homes, the guide says people usually speak of shared living rather than cohousing.",
   "pros": [
    "Close bonds and quick decisions",
    "Everyone feels responsible for the place"
   ],
   "cons": [
    "One person leaving is deeply felt",
    "Higher cost per home, fewer shared rooms"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Simple, but costs more per home"
    },
    "social": {
     "dot": "easier",
     "t": "Everyone knows everyone"
    },
    "governance": {
     "dot": "easier",
     "t": "Light, quick decisions"
    },
    "legal": {
     "dot": "easier",
     "t": "Few parties to agree"
    },
    "money": {
     "dot": "harder",
     "t": "Few households to share costs"
    }
   },
   "bestWhen": "When the group wants a tight, family-like circle. Each person has to be ready to carry real weight.",
   "examples": [],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "medium",
   "name": "Medium (15 to 35)",
   "summary": "The classic size for cohousing. Big enough for variety and shared costs, small enough that people still know each other.",
   "body": "This is the size most cohousing has been built at. The Quebec guide calls it a practical sweet spot, especially for groups led by the future residents themselves. There is room for different ages and skills, and the group can handle people coming and going.\n\nPrivacy and community balance well here. Shared rooms are affordable, and no one has to attend every event. Decades of experience mean the habits for this size are well documented.\n\nDecisions get harder as the group grows, so clear meeting habits matter. Many Danish practitioners say a project should stay under 35 households. One Danish community that grew past that sold some units as ordinary condos to shrink its group.",
   "pros": [
    "The best-tested size, with lots of experience",
    "Enough people for variety and shared costs"
   ],
   "cons": [
    "Decisions need more structure than in a small group",
    "Misunderstandings grow if talk is not planned"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Space is tighter to plan"
    },
    "social": {
     "dot": "easier",
     "t": "Big enough for variety, small enough to know"
    },
    "governance": {
     "dot": "depends",
     "t": "Needs clear meeting habits"
    },
    "legal": {
     "dot": "depends",
     "t": "Standard, well-known structures"
    },
    "money": {
     "dot": "easier",
     "t": "Costs spread over many homes"
    }
   },
   "bestWhen": "When a group of residents wants to lead the project and wants the most proven size.",
   "examples": [
    "r50",
    "trudeslund"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "large",
   "name": "Large (36 to 59)",
   "summary": "A mature community with many subgroups. It shares costs well and needs firmer structure.",
   "body": "At this size, a project holds many interest groups. Gardeners and musicians each find their circle, which gives more points of contact while keeping a sense of belonging. The Quebec guide describes it as a stage where variety and organisation reach a good balance.\n\nCosts spread over more homes, so shared rooms can be larger and better. Roles can be divided, and each person can give time in their own way.\n\nBelonging needs deliberate effort, and informal talk is no longer enough. Decisions need clearer rules, and the money plan is more complex. The guide says these projects are usually led by an experienced cohousing developer. Un Village à Lachine in Montreal mixes owners and renters in this range.",
   "pros": [
    "Shared costs allow better common spaces",
    "Many subgroups mean many ways to join in"
   ],
   "cons": [
    "Belonging needs deliberate effort",
    "Complex finance usually needs an experienced developer"
   ],
   "impact": {
    "building": {
     "dot": "harder",
     "t": "Bigger, more complex project"
    },
    "social": {
     "dot": "depends",
     "t": "Subgroups form, ties need care"
    },
    "governance": {
     "dot": "harder",
     "t": "Formal rules and clear roles"
    },
    "legal": {
     "dot": "harder",
     "t": "More complex financing and legal set-up"
    },
    "money": {
     "dot": "easier",
     "t": "Economies of scale cut cost per home"
    }
   },
   "bestWhen": "When a group wants lively community life with many circles, and can work with a seasoned developer.",
   "examples": [
    "un-village-a-lachine"
   ],
   "sources": [
    "guide-cohabitat",
    "village-urbain"
   ]
  },
  {
   "id": "very-large",
   "name": "Very large (60 and more)",
   "summary": "A small neighbourhood under one roof, often split into clusters. It can host shops and services, and leans on paid staff.",
   "body": "A very large project works like a micro-neighbourhood. It is often split into smaller clusters, each with its own common rooms, living side by side in one complex. Each cluster runs daily life by itself, while the whole group shares bigger events.\n\nThe Quebec guide points to real strengths. Such projects can host shops and cultural spaces, offer many kinds of homes and keep costs per home lower.\n\nNot everyone takes part to the same degree here, so the project needs several ways to join in. Paid staff usually help with coordination, so governance mixes citizen groups with professionals. Ecojonction in Geneva, with 115 homes, pays some residents for community roles.",
   "pros": [
    "Can host shops and many home types",
    "Lower cost per home through scale"
   ],
   "cons": [
    "Involvement varies from person to person",
    "Needs paid staff and formal management"
   ],
   "impact": {
    "building": {
     "dot": "harder",
     "t": "Large site, many parts to build"
    },
    "social": {
     "dot": "depends",
     "t": "Clusters hold the close ties"
    },
    "governance": {
     "dot": "harder",
     "t": "Citizens plus paid professionals"
    },
    "legal": {
     "dot": "harder",
     "t": "Large, layered legal structure"
    },
    "money": {
     "dot": "easier",
     "t": "Scale lowers cost per home"
    }
   },
   "bestWhen": "When a project aims to be a lively part of a city and has a budget for staff.",
   "examples": [
    "kalkbreite"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "neighbourhood",
   "name": "A neighbourhood of projects",
   "summary": "Several separate cohousing groups share a district. Each keeps its own life and rules while sharing squares and services.",
   "body": "Some projects are more than one building. A neighbourhood of projects links several independent communities in one network. Each keeps its own character and way of deciding, and together they share things like parking and a mobility hub.\n\nThe Quebec guide sees this as a way to treat a district as a web of collectives. It also allows shops and cultural rooms that no single group could support alone.\n\nMehr als Wohnen in Zurich is the guide's example, with a cluster of separate buildings. About 1,300 people live there. Each building runs its own governance, while a site-wide group shares bikes and maintenance staff.\n\nThe cost is coordination. Many groups must agree on shared rules, and such a project takes years to build.",
   "pros": [
    "Shared services and public spaces at district scale",
    "Each community keeps its own identity"
   ],
   "cons": [
    "Many groups must agree on shared rules",
    "Takes a long time and a lot of coordination"
   ],
   "impact": {
    "building": {
     "dot": "harder",
     "t": "Many buildings, shared public space"
    },
    "social": {
     "dot": "depends",
     "t": "Strong inside, looser across"
    },
    "governance": {
     "dot": "harder",
     "t": "Building and district levels"
    },
    "legal": {
     "dot": "harder",
     "t": "Several owners and shared agreements"
    },
    "money": {
     "dot": "easier",
     "t": "Shared staff and services cut costs"
    }
   },
   "bestWhen": "When several groups or co-ops can plan one district together and share its services.",
   "examples": [
    "mehr-als-wohnen"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  }
 ],
 "hosts": [
  {
   "id": "homes",
   "name": "Homes only",
   "summary": "The site holds homes and the spaces residents share, and nothing else. It is the simplest set-up to plan and run.",
   "body": "In a homes only project, every square metre serves the residents. There are private homes and a common house, plus shared outdoor spaces. No shop or farm serves outsiders. This is the classic cohousing shape, and the Quebec guide treats living space as the core of any project.\n\nKeeping to homes makes life easier. Banks and city planners know how to assess it, there is one set of rules to follow, and nobody has to manage tenants or opening hours.\n\nThe downside is that the project depends on its residents alone. There are no extra rents to help pay costs, and fewer reasons for neighbours to walk through.",
   "pros": [
    "Simplest to design and manage",
    "One clear set of rules to follow"
   ],
   "cons": [
    "No extra income from other uses",
    "Fewer reasons for neighbours to visit"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "One use, one kind of building"
    },
    "social": {
     "dot": "depends",
     "t": "Quiet, but less contact outside"
    },
    "governance": {
     "dot": "easier",
     "t": "Only residents to manage"
    },
    "legal": {
     "dot": "easier",
     "t": "Ordinary residential zoning"
    },
    "money": {
     "dot": "easier",
     "t": "Lenders know this model"
    }
   },
   "bestWhen": "When the group wants calm and simplicity, and plans to put its energy into daily life together.",
   "examples": [],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "mixed-use",
   "name": "Homes + shops or work",
   "summary": "Part of the site holds shops or public rooms open to others. It ties the project to the neighbourhood but adds complexity.",
   "body": "A mixed use project puts other activities next to the homes, such as a cafe. Some hold a clinic. The Quebec guide says they root the project in its area and cut daily travel.\n\nKalkbreite in Zurich is the guide's main example. It sits over a tram depot and combines homes with shops and a cinema.\n\nThe guide is clear that this is never just an extra room. Each use needs its own entrance and its own sound control. Zoning and fire rules differ, lenders ask for different terms, and empty commercial space is a risk. Someone must also manage hours and tenants.",
   "pros": [
    "Rents from shops help pay costs",
    "Opens the project to its neighbourhood"
   ],
   "cons": [
    "More complex to design and finance",
    "Visitors and noise reach residents' doors"
   ],
   "impact": {
    "building": {
     "dot": "harder",
     "t": "Separate entrances and sound control"
    },
    "social": {
     "dot": "depends",
     "t": "More contact, less privacy"
    },
    "governance": {
     "dot": "harder",
     "t": "Tenants and hours to manage"
    },
    "legal": {
     "dot": "harder",
     "t": "Zoning and fire rules per use"
    },
    "money": {
     "dot": "depends",
     "t": "Extra rent, but vacancy risk"
    }
   },
   "bestWhen": "When the project is in a lively area, and the group wants a presence in the neighbourhood and can handle more management.",
   "examples": [
    "kalkbreite",
    "mehr-als-wohnen",
    "spreefeld"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "farm",
   "name": "Homes + farm",
   "summary": "The homes stand on or beside working land that grows food. Living and farming feed each other, and the group takes on a second business.",
   "body": "In a farm project, the homes sit close together. The rest of the land is kept for growing. The Quebec guide describes Belfast Cohousing in the United States. About thirty households sit on a compact part of a large site, which leaves most of the land open. A small farm sells shares of its harvest to members in advance, and a barn supports storage and group use.\n\nFor residents, this means fresh food close by and a stronger tie to the land.\n\nThe cost is that the group runs a housing project and a farm at once. Farming needs skills and time. Good years and bad years change the budget. Not everyone wants to work the land.",
   "pros": [
    "Fresh food and shared work on the land",
    "Most of the site stays open and green"
   ],
   "cons": [
    "Farming is a second business to run",
    "Harvests and income change from year to year"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Barns and farm buildings added"
    },
    "social": {
     "dot": "easier",
     "t": "Shared work on the land"
    },
    "governance": {
     "dot": "harder",
     "t": "Farm decisions on top of home ones"
    },
    "legal": {
     "dot": "harder",
     "t": "Farmland rules limit building"
    },
    "money": {
     "dot": "depends",
     "t": "Farm sales can help or strain"
    }
   },
   "bestWhen": "When the group has land and real farming skills, and wants to grow food together.",
   "examples": [
    "neot-smadar"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  }
 ],
 "decisions": [
  {
   "id": "founder",
   "name": "Founder or operator decides",
   "summary": "One person or one company makes the main calls. Residents can share ideas and complaints, but the final say stays with the operator. That keeps things fast and puts the risk on one pair of shoulders.",
   "body": "In this set-up one person or one company makes the main calls. It might be the founder who rents out the rooms, or an operator who runs several houses. Residents can give opinions and raise problems, but the decision stays with the operator.\n\nThis is how most coliving businesses and hacker houses work. It is also how many community projects begin, before a real group has formed. Decisions are quick. Someone can sign a lease or change the house rules in a day, without a meeting. People who live there do not have to run anything, which suits those who want a good place to live and no committee.\n\nThe weak point is that everything rests on one person. If the founder loses interest or sells, the place can change overnight. The same can happen if the money runs out. Residents hold little power, so they have little to lean on when they disagree. Trust depends on how fair and open the operator is.\n\nFor people living together, this fits a group that wants a service more than a shared project. It is a poor match for residents who expect to shape the place over many years. Some founder-led houses soften the model by asking for advice first, or by handing a whole area, such as the events, to the residents. This gives the group some say without giving up the operator's lead.",
   "pros": [
    "Decisions are fast and clear",
    "Residents carry no meetings or management"
   ],
   "cons": [
    "The place depends on one person",
    "Residents have little say or protection"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "One person can act quickly"
    },
    "social": {
     "dot": "depends",
     "t": "Rests on the operator's style"
    },
    "governance": {
     "dot": "easier",
     "t": "No meetings needed to decide"
    },
    "legal": {
     "dot": "easier",
     "t": "One owner, one set of papers"
    },
    "money": {
     "dot": "depends",
     "t": "Operator carries the risk and profit"
    }
   },
   "bestWhen": "When residents want a ready-made home and an operator they trust, and do not need a say in how the place is run.",
   "examples": [
    "network-school"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "vote",
   "name": "Majority vote",
   "summary": "A proposal passes when more than half of the votes are in favour. It is quick and easy to follow, but a split group always leaves some people on the losing side.",
   "body": "With majority voting, a proposal passes when more than half of the votes are in favour. Some groups ask for more on big matters, such as two thirds to change the house rules or to sell the building. The rules on who can vote, how many must be present and what counts as a majority are usually written in the by-laws.\n\nVoting is the standard way in co-ops and condo associations. The law behind many of them sets out votes at the general assembly. It is simple. Everybody can see the result, the meeting ends on time, and a quiet member holds the same vote as a loud one.\n\nThe cost is that someone always loses. A group that splits down the middle can send nearly half its members home unhappy. If the same people lose again and again, they start to stay away. A vote also tends to skip the stage where people shape a proposal together, and debate can turn into campaigning for a side.\n\nFor people living together, voting works well for money and house rules, where a clear answer matters more than perfect agreement. It also scales better than consensus when the group is large. Groups that vote well tend to talk first and vote last. Many use votes for the small things and a slower method for the choices that shape daily life.",
   "pros": [
    "Quick and easy to run",
    "Works for large groups"
   ],
   "cons": [
    "Always leaves some people on the losing side",
    "Skips the work of shaping a shared proposal"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "Design choices settle quickly"
    },
    "social": {
     "dot": "depends",
     "t": "Losing votes can leave a sting"
    },
    "governance": {
     "dot": "easier",
     "t": "Familiar rules everyone knows"
    },
    "legal": {
     "dot": "easier",
     "t": "Matches what the law expects"
    },
    "money": {
     "dot": "easier",
     "t": "Budgets pass without long talks"
    }
   },
   "bestWhen": "When a group is large or short on time, or when the choice is small enough that a clear answer matters most.",
   "examples": [],
   "sources": [
    "guide-cohabitat",
    "https://en.wikipedia.org/wiki/Majority_rule"
   ]
  },
  {
   "id": "consensus",
   "name": "Consensus",
   "summary": "The group shapes a proposal until everyone can live with it. It builds strong buy-in and gives each person real weight, but it can stall in big groups or under time pressure.",
   "body": "In consensus, the group works on a proposal until every person can accept it. Nobody has to love the result. They only have to be able to live with it and support it. A typical meeting hears the proposal and collects concerns. Then it changes the wording and tests for agreement. A person who cannot accept it can block it, or step aside and let the others go ahead.\n\nThe method has deep roots. Quakers have used it for centuries to run their meetings. Many intentional communities and cohousing groups took it up later. The American author Diana Leafe Christian writes about it at length in her guide for new communities.\n\nIts strength is buy-in. Because everyone shaped the outcome, people tend to follow through and the decision rarely gets reopened. Its weakness is speed. One person can hold up a whole group, and the process can drag in larger groups or when a decision is urgent. Some groups add a fallback, such as a vote with a high bar, if talks stall.\n\nFor people living together, consensus fits big, lasting choices, like which land to buy or how the shared spaces should work. It asks for good facilitation and a group that trusts each other. Most groups that use it keep it for the important matters and hand smaller ones to a team or a person.",
   "pros": [
    "Everyone shapes the result, so people back it",
    "Each voice carries real weight"
   ],
   "cons": [
    "One person can hold up the whole group",
    "Slow in big groups or when time is short"
   ],
   "impact": {
    "building": {
     "dot": "harder",
     "t": "Design talks can drag on"
    },
    "social": {
     "dot": "depends",
     "t": "Builds trust or wears people out"
    },
    "governance": {
     "dot": "harder",
     "t": "Needs skill and patient meetings"
    },
    "legal": {
     "dot": "depends",
     "t": "Formal votes still needed on paper"
    },
    "money": {
     "dot": "depends",
     "t": "Slow talks can delay deadlines"
    }
   },
   "bestWhen": "When the group is small and the choice is big and lasting. People also need the time and trust to work through disagreement.",
   "examples": [],
   "sources": [
    "https://en.wikipedia.org/wiki/Consensus_decision-making",
    "christian-2003",
    "guide-cohabitat"
   ]
  },
  {
   "id": "consent",
   "name": "Consent / sociocracy",
   "summary": "A proposal goes ahead when nobody has a serious, reasoned objection. Small circles run their own areas, so the group can move on without needing everyone to be enthusiastic.",
   "body": "Consent is a lighter test than consensus. A proposal goes ahead if nobody has a serious, reasoned objection to it. The question is not whether people love the idea. It is whether it is good enough for now and safe enough to try. An objection is treated as useful information, and the group changes the proposal to answer it.\n\nSociocracy is a full way of running a group built on consent. It began in the Netherlands in the 1970s with the engineer Gerard Endenburg. The group splits into small circles, each with its own area and a clear mandate. One circle might look after the garden, for example. Each circle sends two people to the circle above it, so information travels both ways. Decisions in every circle use consent, and the group reviews them on a set date.\n\nThe guide to cohousing in Quebec says sociocracy is a common frame in cohousing, and it notes that consent takes practice. Teams need training and a good facilitator. Without them, meetings can feel heavy.\n\nFor people living together, the method gives everyone a voice without forcing every choice through a full group meeting. It fits a group that expects to be around for years and is ready to learn a method. A single house with a handful of friends may find it more than it needs.",
   "pros": [
    "Moves forward without needing full enthusiasm",
    "Circles share the load across the group"
   ],
   "cons": [
    "Takes training and practice to do well",
    "Adds structure that small groups may not need"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "A circle can own design choices"
    },
    "social": {
     "dot": "easier",
     "t": "Objections are heard and used"
    },
    "governance": {
     "dot": "depends",
     "t": "Strong once the group has learned it"
    },
    "legal": {
     "dot": "depends",
     "t": "Sits alongside the formal board"
    },
    "money": {
     "dot": "depends",
     "t": "A finance circle can run the budget"
    }
   },
   "bestWhen": "When a group of some size wants shared power and steady decisions, and will invest the time to learn the method.",
   "examples": [
    "cohabitat-quebec"
   ],
   "sources": [
    "https://www.sociocracyforall.org/consent-decision-making/",
    "https://www.sociocracyforall.org/sociocracy/",
    "guide-cohabitat"
   ]
  },
  {
   "id": "advice",
   "name": "Advice process",
   "summary": "Anyone can make a call, as long as they first ask the people it affects and those who know the topic. They listen to the advice and then choose, and the choice is theirs to own.",
   "body": "In an advice process, any person can make a decision. The rule is that before deciding, they must ask the people the choice will affect and the people who know the subject. They listen to what comes back and weigh it. Then they decide and carry the result. The advice does not bind them. Ignoring it would still cost them the trust of the group.\n\nThe approach was made popular by Dennis Bakke, who used it at the energy company AES, and by the writer Frédéric Laloux in his book Reinventing Organizations. The Quebec cohousing guide describes a close cousin: one person or a committee decides after asking the group. It calls this very efficient for avoiding overload while still respecting what the group knows.\n\nIts strength is speed with respect. Few people sit through meetings, and the person closest to a problem acts on it. Its weakness is that it needs real trust and a clear sense of what is a small decision and what is a big one. A person can also ask too few people, or only those who agree.\n\nFor people living together, this suits everyday matters such as buying something for the shared kitchen or fixing a rule that keeps causing friction. Big choices that cannot be undone, like buying land, still need a stronger method that the whole group joins.",
   "pros": [
    "Quick, with few meetings needed",
    "Puts the choice with the person closest to it"
   ],
   "cons": [
    "Needs a lot of trust and honesty",
    "Can be misused by asking only friendly people"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "Small fixes happen without meetings"
    },
    "social": {
     "dot": "depends",
     "t": "Works where trust is high"
    },
    "governance": {
     "dot": "easier",
     "t": "Fewer meetings, clearer owners"
    },
    "legal": {
     "dot": "depends",
     "t": "Formal body still signs and votes"
    },
    "money": {
     "dot": "depends",
     "t": "Needs limits on spending power"
    }
   },
   "bestWhen": "When trust is high and the group wants day-to-day choices made quickly by whoever knows the issue best.",
   "examples": [],
   "sources": [
    "https://www.reinventingorganizationswiki.com/en/theory/decision-making/",
    "guide-cohabitat"
   ]
  }
 ],
 "govstyles": [
  {
   "id": "informal-gov",
   "name": "Informal (kitchen-table)",
   "summary": "No formal bodies. The group talks things through over dinner or in a chat, and a couple of people keep things moving. It is simple and fast while the group is small.",
   "body": "An informal set-up has no board and no committees. The group settles things over dinner or in a chat thread. A couple of people tend to carry the project forward. Roles are shared loosely, and rules appear only when a need shows up.\n\nThe Quebec cohousing guide says this is usually enough in the first stage, when a few people are shaping an idea. Building heavy structure too early only slows things down. The cost shows later. Work piles up on a few people, nobody is sure who decides what, and the project struggles when a key person leaves. Lenders and funders also expect a legal body with clear roles once money or land is involved.",
   "pros": [
    "Simple and fast to start",
    "No meetings or paperwork to keep up"
   ],
   "cons": [
    "Work and power gather around a few people",
    "Hard to keep going when those people leave"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Fine for small, simple projects"
    },
    "social": {
     "dot": "easier",
     "t": "Feels like friends, not a committee"
    },
    "governance": {
     "dot": "easier",
     "t": "Almost nothing to set up"
    },
    "legal": {
     "dot": "harder",
     "t": "Lenders want clear roles on paper"
    },
    "money": {
     "dot": "harder",
     "t": "Hard to share costs and risk fairly"
    }
   },
   "bestWhen": "When a small group is just starting out, or when the place is a shared rental among people who already trust each other.",
   "examples": [],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "assembly",
   "name": "General assembly",
   "summary": "All members meet, usually at least once a year, to approve the big decisions. It gives the group a clear and fair voice, but it gets heavy if too much is sent to it.",
   "body": "In this style the main authority sits with a meeting of all members. The assembly approves the big directions and the yearly accounts. It also elects the board and changes the by-laws. Co-ops and non-profits are usually required by law to hold one.\n\nThe Quebec guide gives a simple picture. The board and the working teams meet each month to handle daily matters. The assembly meets once a year to look at the long-term plan and the finances. That split keeps the big questions with everyone.\n\nThe strength is legitimacy and openness, since each member can see and shape the major choices. The weakness is weight. If the assembly decides too many things, daily life stalls. If it meets rarely, members lose touch.",
   "pros": [
    "Gives every member a clear and fair voice",
    "Matches what the law asks of co-ops and non-profits"
   ],
   "cons": [
    "Slow if too many decisions land there",
    "Meets rarely, so daily life needs another body"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Big design choices wait for meetings"
    },
    "social": {
     "dot": "easier",
     "t": "Everyone sees the big decisions"
    },
    "governance": {
     "dot": "depends",
     "t": "Needs a board for daily work"
    },
    "legal": {
     "dot": "easier",
     "t": "Fits co-op and non-profit rules"
    },
    "money": {
     "dot": "easier",
     "t": "Budget approved in the open"
    }
   },
   "bestWhen": "When the group is a co-op or a condo that must hold formal meetings and wants every member to share the big decisions.",
   "examples": [],
   "sources": [
    "guide-cohabitat",
    "https://en.wikipedia.org/wiki/General_assembly"
   ]
  },
  {
   "id": "delegation",
   "name": "Working groups with mandates (structured delegation)",
   "summary": "The whole group keeps the final say but hands clear jobs to a board or to teams. Each has set limits and a duty to report back. It keeps things moving without losing fairness.",
   "body": "With structured delegation, the group keeps the final authority and hands clear mandates to a board or to teams. A good mandate says the goal and which decisions the team can make. It also sets limits and an end date, and says how the team reports back.\n\nThe Quebec guide suggests what to hand off and what to keep. Following a budget and carrying out a decision already made can be delegated. The vision and the land stay with the whole group. So do the legal structure and the basic rules.\n\nThe strength is speed with fairness. It needs clearly written mandates, because vague ones create grey zones and tight ones leave teams stuck. Teams should also be checked now and then to see that they are still useful.",
   "pros": [
    "Spreads the work and keeps decisions moving",
    "Keeps the final say with the whole group"
   ],
   "cons": [
    "Needs clear, written mandates to work",
    "Too many teams can mean too many meetings"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "A design team can move fast"
    },
    "social": {
     "dot": "depends",
     "t": "Some people hold more information"
    },
    "governance": {
     "dot": "depends",
     "t": "Needs clear mandates and reports"
    },
    "legal": {
     "dot": "easier",
     "t": "Fits a board and committees"
    },
    "money": {
     "dot": "easier",
     "t": "A finance team can track the budget"
    }
   },
   "bestWhen": "When the project has grown too big for every decision to go through the full group, but members still want the last word.",
   "examples": [],
   "sources": [
    "guide-cohabitat"
   ]
  }
 ],
 "legal": [
  {
   "id": "public",
   "name": "Public housing",
   "summary": "A city or a public housing company owns the building and rents the homes at set prices. Residents are tenants, and the rules come from public policy.",
   "body": "In public housing, a public body owns the building and rents out the homes. That owner can be a city or a public housing company. In Quebec, municipal housing offices run much of it. Rents are set by public rules, and those rules also decide who qualifies for a home. Tenants rarely own anything in the building.\n\nPublic owners usually work from the top down. A central office handles waiting lists and repairs, and tenants rarely choose their neighbours or change how the building is run. That sits badly with groups who want to pick who joins and share many decisions. The Quebec guide says shared-living projects rarely fit strict public housing for exactly this reason.\n\nThere are still ways in. Some public bodies back a project without running it. They can sell or lease land, and they can lend money. In Sweden, public landlords rent whole collective houses to their residents. Färdknäppen in Stockholm is one: a municipal housing company owns the building, and the flats come with a shared kitchen and common dinners.\n\nFor a group, this route brings low rents and a steady, well-funded owner. In return, there is less say over who moves in and how the place changes over time. It works best for a group that cares most about affordability and is happy to work inside a public partner's rules.",
   "pros": [
    "Rents stay low and the owner is steady",
    "No need to raise purchase money"
   ],
   "cons": [
    "Little say over who moves in",
    "Rules and decisions come from the owner"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Owner decides on changes and repairs"
    },
    "social": {
     "dot": "harder",
     "t": "Tenants are placed, not chosen"
    },
    "governance": {
     "dot": "harder",
     "t": "Owner holds the final say"
    },
    "legal": {
     "dot": "easier",
     "t": "Tenants only sign a lease"
    },
    "money": {
     "dot": "easier",
     "t": "Low set rents, no purchase"
    }
   },
   "bestWhen": "When affordability matters most and the group can work with a public partner that supports its way of living.",
   "examples": [
    "fardknappen"
   ],
   "sources": [
    "guide-cohabitat",
    "https://en.wikipedia.org/wiki/Public_housing"
   ]
  },
  {
   "id": "coop",
   "name": "Co-op",
   "summary": "The residents own the building together through a co-operative. Each member gets one vote, and members hold their home through shares or a right to live there.",
   "body": "A housing co-op is a legal body owned by the people who live in it. The co-op owns the building, and each household is a member with one vote, whatever it paid in. Members elect a board and meet in a general assembly to decide the big things.\n\nMost members do not own their flat. They hold a right to live in it, often tied to a share in the co-op. They pay a monthly charge that covers the loan and the upkeep, plus some savings. When a member leaves, the share is paid back and a new household takes the home. No one sells a flat on the open market, so prices stay steady. Profit has little room to creep in.\n\nCo-ops are common in Zurich. Kalkbreite and Mehr als Wohnen are well known there. In England, LILAC in Leeds uses a mutual co-op where members hold shares. Spreefeld in Berlin also uses a co-op, and a student co-op system like ICC in Ann Arbor shows the same idea at house scale.\n\nFor a group living together, a co-op fits shared ownership and shared decisions. It also asks for steady work. Someone has to keep the books and hold meetings. Someone also answers to lenders, and members carry that load together. Banks can be slower to lend to co-ops than to private owners, so many groups lean on public programmes or ethical lenders.",
   "pros": [
    "Shared ownership with one vote each",
    "Homes stay out of the speculative market"
   ],
   "cons": [
    "Members do the admin and board work",
    "Banks can be slower to lend"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Co-op can own any kind of building"
    },
    "social": {
     "dot": "easier",
     "t": "Members already share a stake"
    },
    "governance": {
     "dot": "easier",
     "t": "One member, one vote, built in"
    },
    "legal": {
     "dot": "harder",
     "t": "Statutes and yearly duties"
    },
    "money": {
     "dot": "depends",
     "t": "Shared loan, but lenders can hesitate"
    }
   },
   "bestWhen": "When a group wants to own its building together and share decisions equally.",
   "examples": [
    "kalkbreite",
    "mehr-als-wohnen",
    "lilac",
    "spreefeld",
    "icc-ann-arbor"
   ],
   "sources": [
    "guide-cohabitat",
    "https://en.wikipedia.org/wiki/Housing_cooperative"
   ]
  },
  {
   "id": "solidarity-coop",
   "name": "Solidarity co-op",
   "summary": "A Quebec kind of co-op that lets residents and supporters of the project belong to one body, with a vote each.",
   "body": "A solidarity co-op is a form set out in Quebec's co-operative law. It works like an ordinary co-op, with one vote per member. The difference is that it can hold more than one kind of member. Some use its services and some work there. Others simply back the project.\n\nThat mix matters for a group that wants more than residents around the table. A neighbourhood organisation or a care provider can sit beside the households. Each kind of member can have its own seats on the board, so no single group runs everything. The co-op can also take on tasks beyond housing, like running a shared space or services open to the neighbourhood.\n\nIn Quebec cohousing, the form often shows up inside a hybrid. A solidarity co-op carries the project and the shared parts, while households own their homes as condos. A co-op and divided co-ownership can also be combined in one project.\n\nFor a group in Quebec, a solidarity co-op gives a democratic body that can bring partners in. It also carries the usual co-op load of meetings and rules. It also needs advice from people who know Quebec law. Outside Quebec, similar forms exist under other names, such as multi-stakeholder co-ops.",
   "pros": [
    "Residents and supporters share one democratic body",
    "Partners can join without taking over"
   ],
   "cons": [
    "Quebec law only, so it does not travel",
    "Meetings and rules take steady effort"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Works for any building the co-op holds"
    },
    "social": {
     "dot": "easier",
     "t": "Neighbours and supporters can join in"
    },
    "governance": {
     "dot": "depends",
     "t": "Member groups need balanced board seats"
    },
    "legal": {
     "dot": "harder",
     "t": "Quebec co-op law and yearly duties"
    },
    "money": {
     "dot": "depends",
     "t": "Supporters can add funds and trust"
    }
   },
   "bestWhen": "When a Quebec group wants partners such as local groups or workers to belong to the project alongside the households.",
   "examples": [],
   "sources": [
    "guide-cohabitat",
    "https://en.wikipedia.org/wiki/Multi-stakeholder_cooperative"
   ]
  },
  {
   "id": "nonprofit",
   "name": "Non-profit",
   "summary": "A non-profit owns the place and keeps it for its mission. Surplus goes back into the project, and nobody can take profit out when the building changes hands.",
   "body": "A non-profit is a legal body with a mission and no owners. It can own land and buildings and sign loans, but it cannot pay out profit to anyone. Any surplus goes back into the place or the mission. If the non-profit closes, its assets usually pass to a similar organisation.\n\nIn housing, that makes it a steady keeper. The non-profit holds the building for good, so the homes cannot be sold off one by one. Residents are most often tenants. A board elected by members runs the organisation. Residents may hold seats on it, though not always a majority.\n\nThe form turns up in many kinds of project. Findhorn in Scotland is run through a non-profit. Humanitas in Deventer and Bridge Meadows in Portland use non-profits for their care and housing mix. Petaluma Avenue Homes in California is non-profit rental cohousing, and the Berkeley Student Cooperative has housed students since 1933. In Quebec, Village Urbain is a non-profit that develops affordable cohousing.\n\nFor a group, a non-profit is easier to set up than a co-op in many places and attracts grants and gifts. The trade-off is control. Residents may not own the thing they live in, and the board must serve the mission, not only the households. It works best when a group wants to protect affordability and is happy to be tenants.",
   "pros": [
    "Profit cannot be taken out of the place",
    "Open to grants and public support"
   ],
   "cons": [
    "Residents may only be tenants",
    "Board must serve the mission first"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "Can own land and any building type"
    },
    "social": {
     "dot": "depends",
     "t": "Depends on how members are chosen"
    },
    "governance": {
     "dot": "depends",
     "t": "Board may include non-residents"
    },
    "legal": {
     "dot": "depends",
     "t": "Simple to start, yearly duties"
    },
    "money": {
     "dot": "easier",
     "t": "Grants and gifts are open to it"
    }
   },
   "bestWhen": "When a group wants a place to stay affordable for good and is fine with a board that guards the mission.",
   "examples": [
    "findhorn",
    "humanitas-deventer",
    "bridge-meadows",
    "petaluma-avenue-homes",
    "berkeley-student-cooperative"
   ],
   "sources": [
    "guide-cohabitat",
    "https://en.wikipedia.org/wiki/Nonprofit_organization",
    "village-urbain"
   ]
  },
  {
   "id": "condo",
   "name": "Condo / divided co-ownership",
   "summary": "Each household owns its own unit outright, and everyone owns the shared parts together. An owners' association runs the building under a set of written rules.",
   "body": "In a condo, which Quebec calls divided co-ownership, the building is cut into private units and shared parts. Each household owns its unit and can sell it or mortgage it, and can pass it to family. The shared parts belong to all owners together, in shares set by the size or value of each unit. That covers the hallways and the common house.\n\nThe owners form an association, called a syndicate in Quebec. It runs the building through a written set of rules. Owners vote at a yearly meeting and elect a board. They also pay monthly fees into a repair fund. Those rules can be written to suit a group, with clauses about shared spaces and new owners.\n\nBanks know this form well, so each household can usually get its own mortgage. That is a real advantage next to co-ops. Nightingale in Melbourne is built this way and sells its homes at cost. In Quebec, Cohabitat Québec and Cohabitat Neuville pair a condo structure with a co-op, according to the 2025 law article cited in the project checks.\n\nThe weak spot is price. Units sell at market value, so the place can drift out of reach for people with less money, and the group has no hold over who buys. A condo works best when members are comfortable owning and can write strong rules from the start.",
   "pros": [
    "Each household can get its own mortgage",
    "Owners build savings and can sell"
   ],
   "cons": [
    "Prices follow the market and can climb",
    "Little say over who buys a unit"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "Banks and builders know this form"
    },
    "social": {
     "dot": "depends",
     "t": "Owners can sell to anyone"
    },
    "governance": {
     "dot": "easier",
     "t": "Syndicate rules are well tested"
    },
    "legal": {
     "dot": "easier",
     "t": "Standard law and templates exist"
    },
    "money": {
     "dot": "easier",
     "t": "Individual mortgages are available"
    }
   },
   "bestWhen": "When members want to own their own home and can agree on firm rules for shared parts and new buyers.",
   "examples": [
    "nightingale",
    "cohabitat-quebec",
    "cohabitat-neuville"
   ],
   "sources": [
    "guide-cohabitat",
    "https://en.wikipedia.org/wiki/Condominium"
   ]
  },
  {
   "id": "company",
   "name": "Company",
   "summary": "A business owns or runs the place, and residents are its customers. The company sets the rules and the prices. It also decides who moves in, and aims to earn a return.",
   "body": "In this set-up, a business runs the place. It either owns the building or leases it. Residents sign a lease or a membership with the company. The company decides on prices and house rules. It also picks who gets a room. Its owners expect to earn money from the place.\n\nThat makes it the quickest route. One owner can buy or lease a building and fit it out, then fill it, without a vote among future residents. It is how many coliving operators work. Habyt and Cohabs rent rooms in furnished shared homes, and The Collective in London is often studied as a case where a fast-growing company ran into trouble. Culdesac in Arizona builds a whole car-free neighbourhood under a company.\n\nResidents get convenience. Rent often covers furniture and cleaning, with utilities included. The company handles the paperwork. The trade-off is that residents have little say in how the place is run, and they can lose their home if the company changes course or closes. Rents follow what the market will pay.\n\nA company also suits a founder who wants to start something hands-on, like the live-in residency run by HF0 in San Francisco. For a group that wants to own and shape its home together, this is the opposite path, since the group buys a service and does not hold the place.",
   "pros": [
    "Fast to set up with one clear owner",
    "Services like cleaning and repairs are handled"
   ],
   "cons": [
    "Residents have little say or security",
    "Rents follow the market, not need"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "One owner can buy or lease fast"
    },
    "social": {
     "dot": "depends",
     "t": "The operator picks who joins"
    },
    "governance": {
     "dot": "harder",
     "t": "Company decides, residents advise"
    },
    "legal": {
     "dot": "easier",
     "t": "Residents sign a simple lease"
    },
    "money": {
     "dot": "depends",
     "t": "No purchase, but market rents"
    }
   },
   "bestWhen": "When a founder or operator wants to start quickly, or residents want a flexible home without any ownership duties.",
   "examples": [
    "habyt",
    "cohabs",
    "the-collective",
    "culdesac",
    "hf0"
   ],
   "sources": [
    "guide-cohabitat",
    "https://en.wikipedia.org/wiki/Coliving"
   ]
  },
  {
   "id": "land-trust",
   "name": "Land trust",
   "summary": "A non-profit owns the land for good and the homes sit on it. When a home changes hands, the price stays capped, so it stays affordable for the next household.",
   "body": "A community land trust splits a home in two. The land belongs to a non-profit run by residents, neighbours and partners, and it is never sold again. The buildings on it can be owned, rented or held through a co-op, on a long lease of the land that usually runs for most of a century.\n\nThe trick is in the resale formula. When owners move, they sell at a capped price, usually what they paid plus a small share of any rise in value. They leave with some savings, and the next household buys in at a price ordinary incomes can reach. Over time the trust holds a growing pool of homes that never go back to the open market.\n\nThe idea grew out of the civil rights movement in Georgia and spread to cities like Burlington in Vermont, then to Brussels and London. In Quebec the same logic shows up through emphyteutic leases and non-profits that keep the land.\n\nFor a group living together, a land trust brings a steady partner and lasting protection from speculation. You give up some freedom in return: you can't sell for whatever the market pays, and decisions about the land are shared with people beyond your own walls. Many cohousing and co-op projects pair a trust for the land with their own set-up for the buildings.",
   "pros": [
    "Homes stay affordable from one household to the next",
    "The land is protected from speculation for good"
   ],
   "cons": [
    "The resale price is capped, so owners gain less",
    "A second organisation shares decisions about the land"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Any building, on leased land"
    },
    "social": {
     "dot": "depends",
     "t": "Neighbours sit on the board too"
    },
    "governance": {
     "dot": "harder",
     "t": "Two boards to agree with"
    },
    "legal": {
     "dot": "harder",
     "t": "Land and buildings held apart"
    },
    "money": {
     "dot": "easier",
     "t": "Land cost leaves the price"
    }
   },
   "bestWhen": "When a group wants its homes to stay affordable for good, and is happy to share some control to get there.",
   "examples": [],
   "sources": [
    "https://en.wikipedia.org/wiki/Community_land_trust",
    "guide-cohabitat"
   ]
  },
  {
   "id": "undivided",
   "name": "Undivided co-ownership",
   "summary": "Several people own the whole building together, each with a share of the whole and no unit of their own. It is a Quebec form called copropriété indivise.",
   "body": "In undivided co-ownership, which Quebec calls copropriété indivise, the building is not cut into units. Each owner holds a share of the whole property, and the group agrees in writing who uses which part. It works like owning a house together with friends.\n\nThe written agreement does the heavy lifting. It sets each person's share and how bills are split. It also says what happens when someone wants out or dies. Quebec's Civil Code caps how long owners can agree to postpone ending it, and without such an agreement any owner can ask to end it, so the agreement needs care. It is simpler than a condo but much looser, and lenders may treat it with caution. It suits small groups of people who trust each other.",
   "pros": [
    "Simple and cheap to set up",
    "Flexible rules written by the owners"
   ],
   "cons": [
    "Any owner leaving can strain the group",
    "Lenders may be wary of it"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Usually a house or small building"
    },
    "social": {
     "dot": "depends",
     "t": "Rests on trust between owners"
    },
    "governance": {
     "dot": "depends",
     "t": "Only what the agreement says"
    },
    "legal": {
     "dot": "depends",
     "t": "Few rules, so the agreement matters"
    },
    "money": {
     "dot": "depends",
     "t": "Shared loan, exits can be costly"
    }
   },
   "bestWhen": "When a small group of trusted people wants to buy one house together and will write a careful agreement.",
   "examples": [],
   "sources": [
    "guide-cohabitat",
    "https://www.legisquebec.gouv.qc.ca/en/document/cs/CCQ-1991"
   ]
  },
  {
   "id": "informal",
   "name": "Shared lease",
   "summary": "Housemates share one lease or a simple agreement with no formal structure behind it. It is the easiest way to begin and also the most fragile.",
   "body": "A shared lease is how most people first live together. A group of housemates rents a home from a landlord. Everyone may share one lease, or each person may sign their own. No company or co-op stands behind the group. House rules sit in a shared document, or are agreed over dinner.\n\nIt is fast and cheap, and easy to end. That ease is also the weakness. If everyone is on one lease, one person who stops paying can leave the rest owing. The landlord can sell the home or end the lease, and the group has no say. New members can only join if the landlord agrees.\n\nMany groups start here, then move to something firmer. A written housemate agreement that covers rent and notice periods helps a lot.",
   "pros": [
    "Quick and easy to leave",
    "Good way to test living together"
   ],
   "cons": [
    "One missed payment can hit everyone",
    "The landlord, not the group, has control"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "Rent an existing home"
    },
    "social": {
     "dot": "depends",
     "t": "Rests on how well you get along"
    },
    "governance": {
     "dot": "harder",
     "t": "Only what you agree among yourselves"
    },
    "legal": {
     "dot": "easier",
     "t": "Just a lease and a housemate agreement"
    },
    "money": {
     "dot": "easier",
     "t": "No purchase, deposit only"
    }
   },
   "bestWhen": "When a group wants to test living together before committing money or setting up a legal body.",
   "examples": [],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "hybrid",
   "name": "Hybrid set-up",
   "summary": "A mix of legal forms, like a co-op for the homes and a non-profit for the common spaces. Each form handles the job it suits best.",
   "body": "A hybrid set-up uses two or more legal forms in one project. The Quebec guide suggests asking what jobs the project needs done: who builds it, who owns it, who decides, what rights each household has and who actually lives there. Different bodies can take different jobs.\n\nFor example, a non-profit can develop the project and keep the land. A co-op or condo then holds the homes. Cohabitat Québec and Cohabitat Neuville are described as a mix of co-op and divided co-ownership. Split jobs can limit risk and let a project change over time. They also need clear written deals between the bodies, and everyone has to understand who does what. Without that, gaps follow.",
   "pros": [
    "Each form does the job it suits best",
    "Can change as the project grows"
   ],
   "cons": [
    "More bodies mean more paperwork",
    "Roles must be clear to everyone"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "Fits mixed buildings and uses"
    },
    "social": {
     "dot": "depends",
     "t": "Residents must grasp the layers"
    },
    "governance": {
     "dot": "harder",
     "t": "Several boards to coordinate"
    },
    "legal": {
     "dot": "harder",
     "t": "Several bodies and written deals"
    },
    "money": {
     "dot": "depends",
     "t": "Can open more funding routes"
    }
   },
   "bestWhen": "When one legal form cannot cover the project, such as owners mixed with renters.",
   "examples": [
    "cohabitat-quebec",
    "cohabitat-neuville"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  }
 ],
 "holding": [
  {
   "id": "own",
   "name": "Own",
   "summary": "You own your home outright. You can sell it or borrow against it, and you can pass it on, within the rules your group has agreed.",
   "body": "Owning means your name is on the title. You can sell the home or mortgage it, and you can leave it to family. You also carry the costs: the loan and the taxes, plus your share of shared spaces. In a group, ownership usually comes with written rules about who can buy when you sell, because new neighbours are a big deal when you share a house. Condos are the usual legal frame. Nightingale in Melbourne and Cohabitat Québec are lived this way. The upside is savings and freedom. The downside is a big starting sum and a price that follows the market.",
   "pros": [
    "Your savings grow in your own home",
    "You can sell or pass it on"
   ],
   "cons": [
    "Large sum needed to get in",
    "Price follows the market"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "Banks lend against homes"
    },
    "social": {
     "dot": "depends",
     "t": "Buyers are not always chosen"
    },
    "governance": {
     "dot": "depends",
     "t": "Owners vote, not all agree"
    },
    "legal": {
     "dot": "easier",
     "t": "Well known law and templates"
    },
    "money": {
     "dot": "harder",
     "t": "Large deposit and a mortgage"
    }
   },
   "bestWhen": "When members have savings or can borrow, and want to build equity and freedom to sell.",
   "examples": [
    "nightingale",
    "cohabitat-quebec"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "rent",
   "name": "Rent",
   "summary": "You pay rent and can leave without selling anything. The owner might be a landlord or a company, or it might be a non-profit or a public body.",
   "body": "Renting means you pay monthly for the right to live in the home, and the owner looks after the building. You put in little money to start, and you can leave when the lease allows. The owner might be a company like Habyt, a non-profit like the one behind Petaluma Avenue Homes, or a public landlord like the one at Färdknäppen. Who the owner is matters more than the renting itself. A caring non-profit can keep rents fair, while a company follows the market. Renters build no equity and have less say about the building.",
   "pros": [
    "Low upfront cost and easy to leave",
    "The owner handles big repairs"
   ],
   "cons": [
    "No savings grow from the home",
    "Little say over the building"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "No building to buy or repair"
    },
    "social": {
     "dot": "depends",
     "t": "Depends on who picks tenants"
    },
    "governance": {
     "dot": "harder",
     "t": "Owner has the final say"
    },
    "legal": {
     "dot": "easier",
     "t": "A lease is all you sign"
    },
    "money": {
     "dot": "easier",
     "t": "Low entry cost, flexible exit"
    }
   },
   "bestWhen": "When members want a flexible home with little money up front, or are not sure how long they will stay.",
   "examples": [
    "habyt",
    "petaluma-avenue-homes",
    "fardknappen"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "shares",
   "name": "Member shares",
   "summary": "You buy a share in the co-op and get it back when you leave. The co-op owns the building, and your share is your stake and your right to live there.",
   "body": "In a co-op with member shares, you pay in a sum when you join. This share is your stake in the co-op, and it gives you the right to live in a home. You also pay a monthly charge. The co-op owns the building, so there is no sale of the home. When you leave, you get your share back, and the co-op's rules say whether interest is added. The next member buys in. Your loss is limited to what you put in. Kalkbreite and Mehr als Wohnen in Zurich work this way, and so does LILAC in Leeds. It keeps prices steady, though your share does not grow with the market.",
   "pros": [
    "Entry sum is paid back when you leave",
    "Prices stay steady between members"
   ],
   "cons": [
    "Your share does not grow with the market",
    "You still need a sum to join"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Co-op owns the building"
    },
    "social": {
     "dot": "easier",
     "t": "All members share a stake"
    },
    "governance": {
     "dot": "easier",
     "t": "Members vote and elect the board"
    },
    "legal": {
     "dot": "depends",
     "t": "Co-op law, shares set by statutes"
    },
    "money": {
     "dot": "depends",
     "t": "Smaller sum than buying, no gain"
    }
   },
   "bestWhen": "When members want a lasting home with steady prices and are happy to give up market gains.",
   "examples": [
    "kalkbreite",
    "mehr-als-wohnen",
    "lilac"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "use-rights",
   "name": "Use rights",
   "summary": "You have the right to live in the home, but the home belongs to the group or a trust. You cannot sell it, and the group's rules say what happens next.",
   "body": "With use rights, you are neither an owner nor an ordinary tenant. You have a long-term right to live in a home, usually because you belong to a group or trust that holds the property. The Quebec guide describes this as separating the value of land from the use of a home. You cannot sell it for a profit, and the rules say what happens when you leave or die. This keeps prices low and speculation out. It can be hard to get a bank loan, and some forms are less tested in Canadian law. Auroville in India works this way.",
   "pros": [
    "Secure home with little speculation",
    "Low cost compared with buying"
   ],
   "cons": [
    "You cannot sell for profit",
    "Banks and law are less familiar with it"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Group or trust holds the property"
    },
    "social": {
     "dot": "easier",
     "t": "Everyone shares the same status"
    },
    "governance": {
     "dot": "depends",
     "t": "The holder sets the rules"
    },
    "legal": {
     "dot": "harder",
     "t": "Unusual forms, fewer templates"
    },
    "money": {
     "dot": "depends",
     "t": "Low cost, but loans are harder"
    }
   },
   "bestWhen": "When a group wants homes kept out of the market for good and accepts that residents will not sell.",
   "examples": [
    "auroville"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "membership",
   "name": "Membership",
   "summary": "You pay a monthly membership and your room comes with it. The operator runs the home and the services around it.",
   "body": "A membership lets you join a community for a monthly fee. The fee covers your room and the services that come with it. Meals and a workspace are common extras, and so are events. You do not hold a lease in the usual sense, and the terms can change when the operator updates them. Network School in Malaysia sells housing this way. It is quick to join and easy to leave. It also gives you fewer legal protections than a normal lease, so read the terms closely before you move in.",
   "pros": [
    "Easy to join with housing and extras together",
    "Little paperwork to start"
   ],
   "cons": [
    "Fewer legal protections than a lease",
    "Operator can change the terms"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "Operator provides the building"
    },
    "social": {
     "dot": "easier",
     "t": "Community comes with the fee"
    },
    "governance": {
     "dot": "harder",
     "t": "Operator sets the terms"
    },
    "legal": {
     "dot": "depends",
     "t": "Membership terms, not a normal lease"
    },
    "money": {
     "dot": "depends",
     "t": "One fee, no purchase"
    }
   },
   "bestWhen": "When someone wants to join a ready-made community quickly and is fine with a short, flexible stay.",
   "examples": [
    "network-school"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  }
 ],
 "money": [
  {
   "id": "members",
   "name": "Members' own money",
   "summary": "The people who will live there pay for it from their own savings and their own loans. No outside owner or funder has a claim on the place.",
   "body": "In this set-up the future residents are the main source of money. Each household puts in savings, often called an equity stake, and takes out a personal mortgage for the rest. Together the households fund the land and the building. They also cover the costs that come before either.\n\nTiming matters here. Early costs come long before any bank lends a cent. These include studies and professional fees. The Quebec guide notes that this early money is the most exposed, because the project can still change or stop. It also shows the group is serious. That helps when lenders and other partners decide whether to join.\n\nWhen the homes are sold to members, the construction loan is usually repaid as each household closes its own mortgage. If building runs late or costs rise, the group may have to find more of its own money. Too few pre-sold homes can force a rethink of the project.\n\nFor people living together this means a lot of control. Nobody outside expects a return or sits on the board because of a cheque. It also means the project is only open to those who can afford the entry price, and gaps in savings between members can strain the group. Talking about money early and openly is a habit the guide recommends. Some groups soften the gap with a shared fund or flexible payment schedules.",
   "pros": [
    "No outside funder to answer to or pay back",
    "Real commitment from everyone who joins"
   ],
   "cons": [
    "Only people with savings or credit can take part",
    "Members carry the risk if costs rise or the build is late"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Scale follows what members can raise"
    },
    "social": {
     "dot": "harder",
     "t": "Wealth gaps show up in the group"
    },
    "governance": {
     "dot": "easier",
     "t": "No outside funder has a say"
    },
    "legal": {
     "dot": "depends",
     "t": "Works with several legal shapes"
    },
    "money": {
     "dot": "harder",
     "t": "Households must raise a large sum"
    }
   },
   "bestWhen": "When a group has enough savings and trust to carry the project itself and wants to keep every decision in its own hands.",
   "examples": [
    "nightingale"
   ],
   "sources": [
    "guide-cohabitat",
    "wiki-cohousing"
   ]
  },
  {
   "id": "public",
   "name": "Public funding",
   "summary": "Governments help pay through grants or cheap loans. A guarantee from a city or province can also back the project. Rules such as lasting affordability usually come with it.",
   "body": "Public funding means a government body puts money or backing into the project. It can come as a grant or a loan on easy terms. Tax credits and cheap land also count, as does technical help from a public agency. In some countries the state builds and owns the housing itself, as with a municipal housing company.\n\nThis money almost always comes with conditions. Programmes set who can live there and how high rents or prices may go. They also say which costs they cover and how the group must report back. Payments often arrive in stages. A delay or a missed condition can cost the project its support. The Quebec guide advises looking past the size of a grant to the rules and the schedule. How long the promises last matters too.\n\nPublic funds are often paired with other sources. A project can mix them with members' savings and a bank loan. Each lender has its own timetable, so the pieces have to move together.\n\nFor people living together, public money is the main way to reach households that could never raise a large down payment. It can make rents truly affordable. The trade is time and paperwork, plus rules that limit who joins and what the group can later change. The guide's case sheet for Un Village à Lachine lists the Société d'habitation du Québec among its funders. The federal housing agency and the City of Montréal appear there too. Groups elsewhere face different programmes, so each project has to check what exists in its own place.",
   "pros": [
    "Can bring rents and prices within reach of ordinary incomes",
    "Often unlocks other lenders who trust public backing"
   ],
   "cons": [
    "Strict rules on who can live there and what can change",
    "Slow approvals and reporting that take real time"
   ],
   "impact": {
    "building": {
     "dot": "harder",
     "t": "Standards and budgets set from outside"
    },
    "social": {
     "dot": "depends",
     "t": "Wider mix of households, set by rules"
    },
    "governance": {
     "dot": "harder",
     "t": "Funder conditions limit group choices"
    },
    "legal": {
     "dot": "harder",
     "t": "Agreements run for many years"
    },
    "money": {
     "dot": "easier",
     "t": "Lowers cost for households"
    }
   },
   "bestWhen": "When affordability for lower-income households is a core goal and the group can handle long approvals and paperwork.",
   "examples": [
    "fardknappen",
    "un-village-a-lachine",
    "auroville"
   ],
   "sources": [
    "guide-cohabitat",
    "village-urbain"
   ]
  },
  {
   "id": "patron",
   "name": "One founder or patron",
   "summary": "A single person or family puts up most of the money. Things move fast, and the whole project depends on that one person's wealth and goodwill.",
   "body": "Here one founder or sponsor provides most of the money. This often happens by buying or building the property and then letting others in. The patron may be an idealist who wants a community to exist, or an entrepreneur who treats it as a venture. Sometimes the money is a loan, sometimes a gift, sometimes a purchase that the group will later buy back.\n\nThe big advantage is speed. There is no need to convince a bank or win a grant round. Nobody waits for twenty households to save a down payment. One decision-maker can sign for land and start work. A small group with a wealthy supporter can reach a finished building years ahead of one that has to raise money from many sources.\n\nThe weak point is dependence. The patron usually owns the property or holds the loan, so they hold the real power, whatever the group's rules say. If their wealth changes or their health fails, the project can stall. It can also be sold if they lose interest. Residents also find it hard to claim that the place is truly theirs.\n\nFor people living together this works best when everyone is honest about who holds what. Written agreements help. They can say how the patron is repaid, what happens if they die or leave, and whether residents can later buy the place. Without them, a generous start can turn into a quiet imbalance in daily life, because the person who paid is also a housemate.",
   "pros": [
    "One person pays and decides, so it moves quickly",
    "Needs no big savings from the residents"
   ],
   "cons": [
    "The whole project leans on one person's money and mood",
    "Residents may never fully own or steer the place"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "One buyer can move quickly"
    },
    "social": {
     "dot": "harder",
     "t": "The payer is also a housemate"
    },
    "governance": {
     "dot": "harder",
     "t": "Patron holds the real power"
    },
    "legal": {
     "dot": "depends",
     "t": "Needs clear written terms"
    },
    "money": {
     "dot": "easier",
     "t": "No large sums from households"
    }
   },
   "bestWhen": "When a trusted backer wants to start a community and everyone agrees in writing how control and repayment will work.",
   "examples": [],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "investors",
   "name": "Investors",
   "summary": "Outside investors fund the building and expect a return, usually paid from rents. The place is run as a business, and residents are usually tenants.",
   "body": "Investor funding means people or firms outside the group put in money and want it back with a profit. They may buy shares in a company or lend at a set rate. Some own the building outright. The residents then pay rent or fees that cover the loans and leave something for the investors.\n\nThis is how most commercial coliving works. An operator raises money and leases or buys buildings. Then it fits them out and rents out rooms. Investors expect steady results, so rents are set to hit targets and the operator is under pressure to fill rooms. The Collective in London rose and then closed, and it is a well-known study of what happens when the numbers stop working.\n\nThe Quebec guide describes gentler forms. Subordinated debt, sometimes called mezzanine, sits behind the main bank loan and costs more because it is riskier. Patient capital comes from social-mission bodies and foundations. Impact investors also offer it. All accept a longer wait and softer terms. Even these funders set conditions that can affect timing and control.\n\nFor people living together, investors can make a large project possible without any resident needing savings. The cost is that residents rarely own anything, and decisions follow the return. Rents may rise, and a sale of the building can end the community overnight. Groups that want a say in how the place runs often limit investor money or choose patient capital with clear terms.",
   "pros": [
    "Large projects can start without resident savings",
    "Professional operators handle running the place"
   ],
   "cons": [
    "Rents must pay a return, so costs stay higher",
    "Residents have little say and no lasting claim"
   ],
   "impact": {
    "building": {
     "dot": "easier",
     "t": "Capital for bigger, faster projects"
    },
    "social": {
     "dot": "harder",
     "t": "Turnover and rent pressure"
    },
    "governance": {
     "dot": "harder",
     "t": "Investor return shapes decisions"
    },
    "legal": {
     "dot": "depends",
     "t": "Company or lender sets the terms"
    },
    "money": {
     "dot": "depends",
     "t": "No savings needed, rents stay high"
    }
   },
   "bestWhen": "When the goal is a larger place with professional management, and residents are happy to rent without owning or steering it.",
   "examples": [
    "habyt",
    "cohabs",
    "the-collective",
    "culdesac",
    "network-school"
   ],
   "sources": [
    "guide-cohabitat",
    "wiki-coliving"
   ]
  },
  {
   "id": "donors",
   "name": "Donors and crowdfunding",
   "summary": "Gifts from foundations and supporters cover part of the cost. Many small backers can add to it. The money is usually small and slow, so it works best beside other sources.",
   "body": "Donor funding means money that is given rather than lent or invested. It can come from a foundation or a wealthy supporter. A faith group or a crowd of small backers can give too, often through a crowdfunding campaign. Nobody expects repayment or a share of the profits.\n\nIn practice gifts rarely build a whole place. They tend to cover a piece, such as the early studies or a common house. A fund that helps a household that cannot afford its share is another use. The Quebec guide lists foundations among the outside partners that can support a project's solidarity fund, and it names donations as one way to feed such a fund. Foundations often fund with a particular aim in mind, such as housing for a certain group, so the project has to fit what they care about.\n\nA public campaign adds a different kind of work. Someone must write the story and keep backers informed. Rewards or updates also have to be delivered. Success depends on how large and engaged the group's network already is. Campaigns can bring visibility and early members as well as money.\n\nFor people living together, donors lower the amount households must raise and can open the door to those with little savings. The price is uncertainty, because gifts are never guaranteed and arrive on someone else's schedule. Groups usually plan as if donations might shrink, and treat them as a bonus on top of a plan that already works. Un Village à Lachine drew on public and foundation funding.",
   "pros": [
    "Lowers what households must raise and repay",
    "Can bring visibility and early supporters"
   ],
   "cons": [
    "Gifts are uncertain and arrive on the giver's schedule",
    "Funders may steer the project toward their own aims"
   ],
   "impact": {
    "building": {
     "dot": "depends",
     "t": "Pays for pieces, rarely the whole"
    },
    "social": {
     "dot": "easier",
     "t": "Backers become a wider circle"
    },
    "governance": {
     "dot": "depends",
     "t": "Light unless a funder sets terms"
    },
    "legal": {
     "dot": "depends",
     "t": "Gifts need a non-profit or clear receiver"
    },
    "money": {
     "dot": "easier",
     "t": "Cuts what households must repay"
    }
   },
   "bestWhen": "When a group has a strong cause and a wide network, and needs extra money to complete a plan that already stands on its own.",
   "examples": [
    "un-village-a-lachine"
   ],
   "sources": [
    "guide-cohabitat",
    "https://en.wikipedia.org/wiki/Crowdfunding"
   ]
  }
 ],
 "who": [
  {
   "id": "students",
   "name": "Students",
   "summary": "Rent is split and meals are shared, so company comes built in. Student co-ops also teach members to run meetings and a budget.",
   "body": "Sharing a house or a co-op cuts rent and cooking time, and gives company during a stressful stretch of life. Many student co-ops are run by the members themselves, so living there is also practice at chairing a meeting and keeping accounts. The thing to watch is turnover. When people graduate every year, the group's memory leaves with them, and chores slip during exams. Written routines and a simple handover for each new batch keep the house steady.",
   "fits": [
    "student-coop",
    "operator-coliving"
   ],
   "examples": [
    "berkeley-student-cooperative",
    "nasco",
    "icc-ann-arbor",
    "campus1-mtl"
   ],
   "sources": [
    "nasco"
   ]
  },
  {
   "id": "young-adults",
   "name": "Young adults",
   "summary": "A first step toward independence with lower costs and new friends, with room to change plans. Easy to enter, easy to outgrow.",
   "body": "For people in their twenties and early thirties, living together can make a city affordable and help build a circle of friends after school ends. It also gives some support when jobs and plans keep shifting. The guide notes this stage is often marked by moving around and instability, which shared homes can soften. What to watch is the pull of the exit. If everyone leaves after a year, no community forms, so a mix of stayers and short stays helps.",
   "fits": [
    "operator-coliving",
    "student-coop",
    "hacker-house"
   ],
   "examples": [],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "entrepreneurs",
   "name": "Entrepreneurs",
   "summary": "People building a company get peers and quick feedback, and the costs are shared. The risk is a house that turns into an office.",
   "body": "Founders often work alone and hit the same walls. A house full of other builders gives quick advice and a reason to keep going on slow days, and tools get shared. Costs drop, and introductions happen over breakfast. The risk is that work takes over every room and every conversation, leaving no real rest. Rules about quiet hours and work-free spaces matter. Short stays also mean friendships can stay shallow, so a few long-term residents give the place some roots.",
   "fits": [
    "entrepreneur-house",
    "hacker-house",
    "network-village"
   ],
   "examples": [
    "agi-house",
    "hf0",
    "growth-hub",
    "the-residency"
   ],
   "sources": [
    "wiki-coliving"
   ]
  },
  {
   "id": "families",
   "name": "Families",
   "summary": "Parents share childcare and errands while children get a wider circle of friends and adults. Privacy must stay protected.",
   "body": "Families get the most from daily help. Neighbours can cover a school pickup or watch the kids play outside. Children grow up with other children and trusted adults nearby, and many parents report a lighter mental load. Parents still need a closed front door and time apart. Watch for different views on raising children, and for who supervises the shared spaces. Agreeing on a few simple house habits early prevents most quarrels.",
   "fits": [
    "cohousing",
    "baugruppen",
    "ecovillage"
   ],
   "examples": [
    "bridge-meadows",
    "petaluma-avenue-homes",
    "trudeslund"
   ],
   "sources": [
    "guide-cohabitat",
    "wiki-cohousing"
   ]
  },
  {
   "id": "single-parents",
   "name": "Single parents",
   "summary": "One adult carrying everything can lean on neighbours for childcare and company. Help works only if it goes both ways.",
   "body": "Raising children alone brings a heavy load of planning and a higher risk of isolation. Living near trusted neighbours can make the day safer and lighter: someone to watch the children for an hour, a shared dinner, another adult to talk to. The guide points to informal mutual help and shared resources as the main gain. The catch is balance. Help should flow both ways, or resentment builds. Be clear early about what neighbours are happy to offer, and what stays a parent's own job.",
   "fits": [
    "cohousing",
    "student-coop"
   ],
   "examples": [],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "seniors",
   "name": "Seniors",
   "summary": "Retirees stay socially active and have people nearby if health changes. Planning for later years matters early.",
   "body": "After retirement, daily contact with neighbours keeps people active and feeling useful. A group of nearby friends also watches out for each other in an informal way. Senior cohousing is a known model, with homes built for easy access and a common house for shared meals. What to watch is aging inside the group. When members need more support than neighbours can give, the community needs a plan, such as outside care.",
   "fits": [
    "cohousing",
    "baugruppen"
   ],
   "examples": [
    "humanitas-deventer",
    "petaluma-avenue-homes",
    "bridge-meadows"
   ],
   "sources": [
    "guide-cohabitat",
    "durrett-2009"
   ]
  },
  {
   "id": "intergenerational",
   "name": "Intergenerational",
   "summary": "Young and old share a roof on purpose. Each gets company and help the other has to offer.",
   "body": "Mixing ages is the point. Older residents bring time and a steady presence. Younger ones bring energy and help with errands or technology. Children get grandparent figures, and elders stay connected to daily life. These places work when the exchange is real and fair. Some programs give students cheap rent in return for hours of company. Watch for unequal expectations and for different sleep and noise rhythms. A named coordinator and clear written give-and-take keep the deal honest.",
   "fits": [
    "cohousing",
    "ecovillage"
   ],
   "examples": [
    "humanitas-deventer",
    "bridge-meadows",
    "generations-united",
    "fujisawa-care-model"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "newcomers",
   "name": "Newcomers",
   "summary": "A soft landing in a new country or city, with neighbours who explain how things work and a ready-made network.",
   "body": "Arriving somewhere new is lonely and confusing. Neighbours can explain local habits and point to services. Everyday contact teaches language and local codes informally, and a ready network often matters most in the first years. What to watch is that the help does not turn into dependence or pressure to fit in. Clear house agreements and respect for different customs let newcomers be members and not just guests.",
   "fits": [
    "cohousing",
    "operator-coliving"
   ],
   "examples": [],
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "artists",
   "name": "Artists",
   "summary": "Cheap space and studios close at hand, among people who understand odd hours. Money stays tight for everyone.",
   "body": "Artists need room to make work and rent that does not eat the budget. A shared building can offer studios and fellow makers who understand late nights and irregular income. Neighbours also become first audiences and collaborators. The risk is that rents rise once a place becomes known, and income swings make monthly payments hard. Owning or leasing the building through a co-op or non-profit protects the arrangement. Noise and mess also need agreed limits.",
   "fits": [
    "cohousing",
    "baugruppen",
    "operator-coliving"
   ],
   "examples": [],
   "sources": [
    "wiki-baugruppe"
   ]
  },
  {
   "id": "remote-workers",
   "name": "Remote workers",
   "summary": "People who can work anywhere pick a place for its setting and company. The Wi-Fi has to be solid.",
   "body": "Anyone with a laptop and a good connection can choose a village or a quiet region over a pricey city. Rural coliving spaces offer desks and other remote workers for company, so a quiet place does not turn lonely. What to watch is the link between work and home. Calls collide, and everyone shares the same walls. Separate work rooms and clear quiet hours help. Remote workers also move on often, which can leave local friendships thin.",
   "fits": [
    "rural-coliving",
    "network-village",
    "operator-coliving"
   ],
   "examples": [
    "rooral",
    "sende",
    "coconat"
   ],
   "sources": [
    "wiki-coliving"
   ]
  },
  {
   "id": "care",
   "name": "People needing care",
   "summary": "Homes designed around daily support, with the load shared between neighbours and staff. Safety and dignity guide the design.",
   "body": "Some people need regular help to live well. Housing built around that need puts support close by, so people stay in a home setting and not an institution. Neighbours offer company and informal watchfulness, and trained staff cover what volunteers cannot. The guide stresses adapted buildings and clear organisation, with professional support in some cases. The danger is that volunteers get overloaded or that residents lose control over their lives. Plan paid help and define roles, so residents can shape their own days.",
   "fits": [
    "cohousing",
    "ecovillage"
   ],
   "examples": [
    "hogeweyk",
    "fujisawa-care-model"
   ],
   "sources": [
    "guide-cohabitat"
   ]
  }
 ],
 "path": [
  {
   "id": "core-group",
   "name": "Form a core group",
   "summary": "A small group with a shared intention gets together and starts meeting regularly. Everything later rests on these first people.",
   "body": "Most projects start with three to eight people or households who share an intention and agree to meet. The first months are for getting to know each other, trying out a simple way of working, and writing down what is known and what is not. The common failure is rushing to find a site before the group trusts itself. Another is relying on one tireless person, so the project dies if they step away. Keep recruiting open and share jobs early. Leave room for people to drop out without drama.",
   "time": "a few months",
   "tip": "Meet on a fixed rhythm and write notes after every meeting.",
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "vision",
   "name": "Agree on a shared vision",
   "summary": "The group works out why it exists, what daily life should feel like and which things are negotiable.",
   "body": "This is where the group says what it wants: how much to share, how many homes, what kind of neighbours, what a normal week looks like. It helps to separate essentials from nice extras. Good groups also pick a simple, temporary way to decide things. What goes wrong is vague agreement. Everyone says community and imagines something different, and the gaps show up later when money is on the table. Writing a short vision and testing it with newcomers exposes these gaps while changes are still cheap.",
   "time": "a few months",
   "tip": "Sort wishes into must-haves and negotiables before spending money.",
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "legal-setup",
   "name": "Choose a legal set-up",
   "summary": "The group picks how the place will be owned and who holds the rights, for example through a co-op.",
   "body": "The legal form decides who owns the building and what happens on resale. Common choices include a co-op or a land trust. Early on, the group also decides who carries the project in the meantime and whether to create a legal entity. Trouble starts when the choice is left late. The form shapes financing and affordability, and it is hard to change later. A lawyer or advisor who knows housing co-ops is worth paying for at this point.",
   "time": "several months, alongside other steps",
   "tip": "Compare a couple of legal forms against the vision before choosing.",
   "sources": [
    "guide-cohabitat",
    "wiki-cohousing"
   ]
  },
  {
   "id": "site",
   "name": "Find land or a building",
   "summary": "The group looks for a site that fits the vision and the budget, then secures it with a conditional offer.",
   "body": "Searching for a site is slow, and good ones go quickly. The group sets criteria and checks local zoning. Talking to the municipality early helps. Once a candidate looks right, an offer to purchase with conditions gives time to study it. Typical problems are zoning that forbids the plan, hidden costs in an old building, and a site that quietly rewrites the vision. Test the site against the vision, and have professionals review it before the group commits any real money.",
   "time": "several months to over a year",
   "tip": "Make every offer conditional on financing and on a zoning check.",
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "programme",
   "name": "Define needs and plan the money",
   "summary": "The group writes down which private and shared spaces it needs and estimates costs and who pays what.",
   "body": "A written programme lists the private homes and the common house, with a first budget. Professionals help turn wishes into numbers. Rough costs per square metre show whether the dream fits the means. This is also when members confirm what each household can put in. The usual mistake is falling in love with a design before checking the budget. Another is leaving out the cost of studies, which must be paid before any loan arrives. Several scenarios, compared honestly, prevent painful cuts later.",
   "time": "half a year to well over a year",
   "tip": "Price a modest scenario and an ambitious one side by side.",
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "design",
   "name": "Design the building",
   "summary": "Architects turn the programme into sketches, then plans, with the group steering the big choices.",
   "body": "Design moves from sketches to preliminary plans and then to full drawings and specifications. A general contractor gives better cost estimates as plans become detailed. The group decides the big choices, such as how homes meet the common house, while professionals handle technical details. Changes get costlier at each step. Groups often go wrong by reopening decisions late or by arguing over small finishes. Setting who decides what, and freezing the main layout before final drawings, saves money.",
   "time": "about a year, overlapping the programme",
   "tip": "Decide in advance which choices belong to the group and which to the architect.",
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "financing",
   "name": "Secure the financing",
   "summary": "Loans and member contributions are confirmed so the project can start building.",
   "body": "Financing is assembled in layers: study money first, then commitments from members, then loans from lenders. Lenders want firm costs and a legal entity before they release funds. Members must be able to show their share, which is where some drop out. A cost overrun or a rate rise can break the budget. A cushion for surprises, regular updates to the cost estimate and honest talks about what each household can afford keep the group from being caught out at the last minute.",
   "time": "runs through design, closes before building",
   "tip": "Keep a contingency line in the budget and update it monthly.",
   "sources": [
    "guide-cohabitat",
    "durrett-2009"
   ]
  },
  {
   "id": "building",
   "name": "Build",
   "summary": "The plans become a real building. Decisions are fast and money flows out every month.",
   "body": "Construction turns years of planning into a site with workers. The project manager and the contractor coordinate with the group, while a few trusted people take daily decisions. Changes now cost the most and delays pile up. Typical troubles include cost surprises and members who want to alter things already built. Keep the essentials of the vision when cutting costs. If members help build or finish, make clear who does what, and check the insurance. Meanwhile the group should start planning how it will run the place.",
   "time": "one to two years",
   "tip": "Give one small team the authority to decide urgent site questions.",
   "sources": [
    "guide-cohabitat"
   ]
  },
  {
   "id": "moving-in",
   "name": "Move in and start living together",
   "summary": "Keys are handed over and flaws are fixed. The group moves from building a project to running a home.",
   "body": "Moving in is more than getting keys. Systems are tested, defects are listed, the construction loan becomes permanent financing and development committees give way to everyday ones. The first weeks are a settling period. People find routines, and rules that looked fine on paper meet real life. Common mistakes include piling on activities at once and forgetting to pass on what the builders know. Stagger arrivals, get the common rooms working early and hold a review after a few months to fix what does not work.",
   "time": "a few weeks to a few months",
   "tip": "Hold a review a few months after move-in, and another a year in.",
   "sources": [
    "guide-cohabitat"
   ]
  }
 ]
};
