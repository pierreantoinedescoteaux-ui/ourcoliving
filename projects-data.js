/* =====================================================================
   REAL PROJECTS — facts, kept apart from the editorial type ranges in
   map-data.js. type = a COLIVING_TYPES slug, or null when the place is
   defined by who it's for (e.g. intergenerational) rather than a way of
   living. kind "network" = a federation or directory, not a place.
   setup / tags use the keys in TAG_VOCAB (map-data.js). Leave a field out
   rather than guess. Built by _tools/build-projects.js, then hand-edited.
   ===================================================================== */
const COLIVING_PROJECTS = [
  {
    "id": "findhorn",
    "name": "Findhorn",
    "place": "Scotland",
    "type": "ecovillage",
    "kind": "place",
    "img": "images/model-findhorn.jpg",
    "url": "https://www.findhorn.org",
    "note": "The 60-year proof of concept — from caravan park to full eco-settlement.",
    "tags": {
      "setting": [
        "countryside"
      ]
    },
    "setup": {
      "legal": [
        "nonprofit"
      ]
    }
  },
  {
    "id": "auroville",
    "name": "Auroville",
    "place": "India",
    "type": "ecovillage",
    "kind": "place",
    "img": "images/ex-auroville.jpg",
    "url": "https://auroville.org",
    "note": "The most ambitious version ever attempted — a planned universal township.",
    "tags": {
      "setting": [
        "countryside"
      ]
    },
    "setup": {
      "legal": [
        "nonprofit"
      ],
      "money": [
        "public"
      ],
      "holding": [
        "use-rights"
      ]
    }
  },
  {
    "id": "ecovillage-ithaca",
    "name": "EcoVillage Ithaca",
    "place": "New York",
    "type": "ecovillage",
    "kind": "place",
    "img": "images/ex-evi-ithaca.jpg",
    "url": "https://ecovillageithaca.org",
    "note": "The polished North American model: three cohousing neighborhoods on shared land.",
    "tags": {
      "setting": [
        "countryside"
      ]
    }
  },
  {
    "id": "tamera",
    "name": "Tamera",
    "place": "Portugal",
    "type": "ecovillage",
    "kind": "place",
    "img": "images/ex-tamera.jpg",
    "url": "https://www.tamera.org/our-facilities/",
    "note": "A 200-person peace-research ecovillage that re-watered its own valley — one of Europe's most complete intentional communities.",
    "tags": {
      "setting": [
        "countryside"
      ]
    }
  },
  {
    "id": "global-ecovillage-network",
    "name": "Global Ecovillage Network",
    "place": "Worldwide",
    "type": "ecovillage",
    "kind": "network",
    "url": "https://ecovillage.org",
    "note": "The directory — thousands of them, mapped."
  },
  {
    "id": "trudeslund",
    "name": "Trudeslund",
    "place": "Denmark",
    "type": "cohousing",
    "kind": "place",
    "img": "images/proj-trudeslund.jpg",
    "url": "https://en.wikipedia.org/wiki/Cohousing",
    "note": "The 1981 benchmark — 33 homes, common house, still thriving.",
    "tags": {
      "setting": [
        "suburb"
      ]
    }
  },
  {
    "id": "lilac",
    "name": "LILAC",
    "place": "Leeds, UK",
    "type": "cohousing",
    "kind": "place",
    "img": "images/ex-lilac.jpg",
    "url": "https://www.lilac.coop",
    "note": "Low-impact straw-bale cohousing with a mutual home-ownership model.",
    "tags": {
      "setting": [
        "city"
      ],
      "building": [
        "new"
      ]
    },
    "setup": {
      "legal": [
        "coop"
      ],
      "holding": [
        "shares"
      ]
    }
  },
  {
    "id": "nightingale",
    "name": "Nightingale",
    "place": "Melbourne",
    "type": "cohousing",
    "kind": "place",
    "url": "https://www.nightingalehousing.org",
    "note": "Architect-led apartment cohousing — sold at cost, no investors.",
    "tags": {
      "setting": [
        "city"
      ],
      "building": [
        "new"
      ]
    },
    "setup": {
      "legal": [
        "condo"
      ],
      "money": [
        "members"
      ],
      "holding": [
        "own"
      ]
    }
  },
  {
    "id": "kalkbreite",
    "name": "Kalkbreite",
    "place": "Zurich",
    "type": "cohousing",
    "kind": "place",
    "img": "images/model-kalkbreite.jpg",
    "url": "https://www.kalkbreite.net",
    "note": "97 flats over a tram depot — cluster living, car-free, legendary.",
    "tags": {
      "setting": [
        "city"
      ],
      "building": [
        "new"
      ],
      "hosts": [
        "mixed-use"
      ]
    },
    "setup": {
      "legal": [
        "coop"
      ],
      "holding": [
        "shares"
      ]
    }
  },
  {
    "id": "mehr-als-wohnen",
    "name": "Mehr als Wohnen",
    "place": "Zurich",
    "type": "cohousing",
    "kind": "place",
    "img": "images/proj-mehralswohnen.jpg",
    "url": "https://www.mehralswohnen.ch",
    "note": "'More than living' — a co-op quarter of 1,200 people.",
    "tags": {
      "setting": [
        "city"
      ],
      "building": [
        "new"
      ],
      "hosts": [
        "mixed-use"
      ]
    },
    "setup": {
      "legal": [
        "coop"
      ],
      "holding": [
        "shares"
      ]
    }
  },
  {
    "id": "co-op-housing-international",
    "name": "Co-op Housing International",
    "place": "Worldwide",
    "type": null,
    "kind": "network",
    "url": "https://www.housinginternational.coop",
    "note": "The global federation — the model exists everywhere.",
    "setup": {
      "legal": [
        "coop"
      ]
    }
  },
  {
    "id": "humanitas-deventer",
    "name": "Humanitas Deventer",
    "place": "Netherlands",
    "type": null,
    "kind": "place",
    "img": "images/ex-humanitas.jpg",
    "url": "https://www.humanitasdeventer.nl",
    "note": "The care home where students live free — the model everyone cites.",
    "tags": {
      "setting": [
        "city"
      ],
      "forWho": [
        "seniors",
        "students",
        "intergenerational"
      ]
    },
    "setup": {
      "legal": [
        "nonprofit"
      ]
    }
  },
  {
    "id": "bridge-meadows",
    "name": "Bridge Meadows",
    "place": "Portland, OR",
    "type": null,
    "kind": "place",
    "img": "images/ex-bridge-meadows.jpg",
    "url": "https://bridgemeadows.org",
    "note": "Elders + foster families, designed as one community.",
    "tags": {
      "setting": [
        "city"
      ],
      "forWho": [
        "intergenerational",
        "families",
        "seniors"
      ]
    },
    "setup": {
      "legal": [
        "nonprofit"
      ]
    }
  },
  {
    "id": "generations-united",
    "name": "Generations United",
    "place": "USA",
    "type": null,
    "kind": "network",
    "url": "https://www.gu.org",
    "note": "The advocacy hub for shared intergenerational sites.",
    "tags": {
      "forWho": [
        "intergenerational"
      ]
    }
  },
  {
    "id": "hogeweyk",
    "name": "Hogeweyk",
    "place": "Netherlands",
    "type": null,
    "kind": "place",
    "url": "https://www.bethecareconcept.com/en/hogeweyk-dementia-village-hogeweyk-netherlands/",
    "note": "A village-scale dementia care home where residents live in real streets and shops — radical normalcy for the people who need care most.",
    "tags": {
      "setting": [
        "suburb"
      ],
      "forWho": [
        "care",
        "seniors"
      ]
    }
  },
  {
    "id": "fujisawa-care-model",
    "name": "Fujisawa care model",
    "place": "Japan",
    "type": null,
    "kind": "place",
    "img": "images/intergen-japan.jpg",
    "url": "https://www.toyproject.net/2017/04/innovative-intergenerational-care-in-fujisawa-japan/",
    "note": "Daycare children and elderly residents share daily programming — one of the most studied designs for cross-generational contact.",
    "tags": {
      "forWho": [
        "intergenerational",
        "seniors",
        "families"
      ]
    }
  },
  {
    "id": "kibbutz-movement",
    "name": "Kibbutz movement",
    "place": "Israel",
    "type": "kibbutz",
    "kind": "network",
    "img": "images/model-kibbutz.jpg",
    "url": "https://en.wikipedia.org/wiki/Kibbutz",
    "note": "The full history — rise, crisis, reinvention."
  },
  {
    "id": "degania-alef",
    "name": "Degania Alef",
    "place": "Israel",
    "type": "kibbutz",
    "kind": "place",
    "img": "images/ex-degania.jpg",
    "url": "https://en.wikipedia.org/wiki/Degania_Alef",
    "note": "The first one, founded 1910.",
    "tags": {
      "setting": [
        "countryside"
      ]
    }
  },
  {
    "id": "nir-david",
    "name": "Nir David",
    "place": "Israel",
    "type": "kibbutz",
    "kind": "place",
    "img": "images/ex-nir-david.jpg",
    "url": "https://medium.com/globetrotters/nir-david-life-on-a-kibbutz-69a93d3ba654",
    "note": "A working kibbutz in the Jezreel Valley — some of the best first-person writing on what communal life actually costs and gives.",
    "tags": {
      "setting": [
        "countryside"
      ]
    }
  },
  {
    "id": "neot-smadar",
    "name": "Neot Smadar",
    "place": "Israel",
    "type": "kibbutz",
    "kind": "place",
    "img": "images/ex-neot-smadar.jpg",
    "url": "https://en.wikipedia.org/wiki/Neot_Smadar",
    "note": "A desert kibbutz in the Arava, founded 1989 — one of the few still running full income-sharing, famous for its art.",
    "tags": {
      "setting": [
        "countryside"
      ],
      "hosts": [
        "farm"
      ]
    }
  },
  {
    "id": "r50",
    "name": "R50",
    "place": "Berlin",
    "type": "baugruppen",
    "kind": "place",
    "url": "https://www.archdaily.com/593154/r50-nil-cohousing-ifau-und-jesko-fezer-heide-and-von-beckerath",
    "note": "The famous one — 19 households, raw concrete, shared everything.",
    "tags": {
      "setting": [
        "city"
      ],
      "building": [
        "new"
      ]
    }
  },
  {
    "id": "spreefeld",
    "name": "Spreefeld",
    "place": "Berlin",
    "type": "baugruppen",
    "kind": "place",
    "img": "images/ex-spreefeld.jpg",
    "url": "https://en.wikipedia.org/wiki/Baugruppe",
    "note": "Riverside building group with cluster flats and public ground floors.",
    "tags": {
      "setting": [
        "city"
      ],
      "building": [
        "new"
      ],
      "hosts": [
        "mixed-use"
      ]
    },
    "setup": {
      "legal": [
        "coop"
      ]
    }
  },
  {
    "id": "agi-house",
    "name": "AGI House",
    "place": "Bay Area",
    "type": "hacker-house",
    "kind": "place",
    "img": "images/ex-agi-house.jpg",
    "url": "https://agihouse.org",
    "note": "The flagship AI-era hacker mansion — hackathons in the living room.",
    "tags": {
      "setting": [
        "suburb"
      ],
      "forWho": [
        "entrepreneurs"
      ]
    }
  },
  {
    "id": "hf0",
    "name": "HF0",
    "place": "San Francisco",
    "type": "hacker-house",
    "kind": "place",
    "img": "images/ex-hf0.jpg",
    "url": "https://www.hf0.com",
    "note": "A 'monastery for founders' — 12-week live-in residency.",
    "tags": {
      "setting": [
        "city"
      ],
      "forWho": [
        "entrepreneurs"
      ]
    },
    "setup": {
      "legal": [
        "company"
      ]
    }
  },
  {
    "id": "habyt",
    "name": "Habyt",
    "place": "Europe & Asia",
    "type": "operator-coliving",
    "kind": "place",
    "img": "images/ex-habyt.jpg",
    "url": "https://www.habyt.com",
    "note": "The consolidator — absorbed Common and others; the biggest operator standing.",
    "tags": {
      "setting": [
        "city"
      ]
    },
    "setup": {
      "legal": [
        "company"
      ],
      "money": [
        "investors"
      ],
      "holding": [
        "rent"
      ]
    }
  },
  {
    "id": "cohabs",
    "name": "Cohabs",
    "place": "Brussels, NYC, Paris",
    "type": "operator-coliving",
    "kind": "place",
    "img": "images/ex-cohabs.jpg",
    "url": "https://www.cohabs.com",
    "note": "Brownstone co-living done carefully, house by house.",
    "tags": {
      "setting": [
        "city"
      ]
    },
    "setup": {
      "legal": [
        "company"
      ],
      "money": [
        "investors"
      ],
      "holding": [
        "rent"
      ]
    }
  },
  {
    "id": "the-collective",
    "name": "The Collective (2016–2021)",
    "place": "London",
    "type": "operator-coliving",
    "kind": "place",
    "img": "images/proj-collective.jpg",
    "url": "https://en.wikipedia.org/wiki/The_Collective_(company)",
    "note": "The rise-and-fall case study every founder should read.",
    "tags": {
      "setting": [
        "city"
      ]
    },
    "setup": {
      "legal": [
        "company"
      ],
      "money": [
        "investors"
      ],
      "holding": [
        "rent"
      ]
    }
  },
  {
    "id": "growth-hub",
    "name": "Growth Hub",
    "place": "Vancouver",
    "type": "entrepreneur-house",
    "kind": "place",
    "img": "images/dunbar-exterior.jpg",
    "url": "https://www.growthhub.house",
    "note": "My houses — six to nine entrepreneurs, living and working as one community.",
    "tags": {
      "setting": [
        "city"
      ],
      "forWho": [
        "entrepreneurs"
      ]
    },
    "setup": {
      "holding": [
        "rent"
      ]
    }
  },
  {
    "id": "montreal-house",
    "name": "Montreal house",
    "place": "Montreal",
    "type": "entrepreneur-house",
    "kind": "place",
    "img": "images/mtl-living-room.jpg",
    "url": "project.html?p=montreal",
    "note": "Three years of hands-on spatial design — the full case study is on this site.",
    "tags": {
      "setting": [
        "city"
      ]
    },
    "setup": {
      "holding": [
        "rent"
      ]
    }
  },
  {
    "id": "the-residency",
    "name": "The Residency",
    "place": "USA",
    "type": "entrepreneur-house",
    "kind": "place",
    "url": "https://www.livetheresidency.com/",
    "note": "Curated live-work cohorts for founders and creators — the entrepreneur house, franchised gently.",
    "tags": {
      "setting": [
        "city"
      ],
      "forWho": [
        "entrepreneurs"
      ]
    }
  },
  {
    "id": "rooral",
    "name": "Rooral",
    "place": "Benarrabá, Spain",
    "type": "rural-coliving",
    "kind": "place",
    "img": "images/rooral-hero.jpg",
    "url": "https://rooral.co",
    "note": "Curated village stays — the case study is on this site.",
    "tags": {
      "setting": [
        "countryside"
      ],
      "forWho": [
        "remote-workers"
      ]
    }
  },
  {
    "id": "sende",
    "name": "Sende",
    "place": "Galicia, Spain",
    "type": "rural-coliving",
    "kind": "place",
    "img": "images/ex-sende.jpg",
    "url": "https://sende.co",
    "note": "A coworking village in a 30-person hamlet, running since 2013.",
    "tags": {
      "setting": [
        "countryside"
      ],
      "forWho": [
        "remote-workers"
      ],
      "building": [
        "converted"
      ]
    }
  },
  {
    "id": "coconat",
    "name": "Coconat",
    "place": "Brandenburg, Germany",
    "type": "rural-coliving",
    "kind": "place",
    "img": "images/ex-coconat.jpg",
    "url": "https://coconat-space.com",
    "note": "A 'workation retreat' rebuilding a rural estate.",
    "tags": {
      "setting": [
        "countryside"
      ],
      "forWho": [
        "remote-workers"
      ],
      "building": [
        "converted"
      ]
    }
  },
  {
    "id": "edge-esmeralda",
    "name": "Edge Esmeralda",
    "place": "Healdsburg, CA",
    "type": "network-village",
    "kind": "place",
    "img": "images/ex-esmeralda.jpg",
    "url": "https://www.edgeesmeralda.com",
    "note": "A month-long pop-up village prototyping a future permanent town."
  },
  {
    "id": "zuzalu",
    "name": "Zuzalu",
    "place": "Montenegro (2023)",
    "type": "network-village",
    "kind": "place",
    "url": "https://zuzalu.city",
    "note": "The two-month pop-up that started the movement."
  },
  {
    "id": "culdesac",
    "name": "Culdesac",
    "place": "Tempe, AZ",
    "type": "network-village",
    "kind": "place",
    "img": "images/ex-culdesac.jpg",
    "url": "https://culdesac.com",
    "note": "A car-free neighborhood built from scratch — adjacent proof that new urban fabric is possible.",
    "tags": {
      "setting": [
        "city"
      ],
      "building": [
        "new"
      ]
    },
    "setup": {
      "legal": [
        "company"
      ],
      "money": [
        "investors"
      ],
      "holding": [
        "rent"
      ]
    }
  },
  {
    "id": "network-school",
    "name": "Network School",
    "place": "Malaysia",
    "type": "network-village",
    "kind": "place",
    "img": "images/ex-network-school.jpg",
    "url": "https://balajis.com/p/network-school-2025",
    "note": "Balaji's live-in school and co-living community — a network-state proof of concept, running since 2024.",
    "setup": {
      "legal": [
        "company"
      ],
      "money": [
        "investors"
      ],
      "holding": [
        "membership"
      ],
      "decisions": [
        "founder"
      ]
    }
  },
  {
    "id": "berkeley-student-cooperative",
    "name": "Berkeley Student Cooperative",
    "place": "California",
    "type": "student-coop",
    "kind": "place",
    "img": "images/ex-cloyne.jpg",
    "url": "https://www.bsc.coop",
    "note": "The giant — 17 houses, since 1933.",
    "tags": {
      "setting": [
        "city"
      ],
      "forWho": [
        "students"
      ]
    },
    "setup": {
      "legal": [
        "nonprofit"
      ],
      "holding": [
        "rent"
      ],
      "decisions": [
        "vote"
      ]
    }
  },
  {
    "id": "nasco",
    "name": "NASCO",
    "place": "North America",
    "type": "student-coop",
    "kind": "network",
    "url": "https://www.nasco.coop",
    "note": "The federation connecting campus co-ops across the continent.",
    "tags": {
      "forWho": [
        "students"
      ]
    }
  },
  {
    "id": "icc-ann-arbor",
    "name": "ICC Ann Arbor",
    "place": "Michigan",
    "type": "student-coop",
    "kind": "place",
    "img": "images/ex-icc-annarbor.jpg",
    "url": "https://icc.coop",
    "note": "The oldest continuous student co-op system in North America.",
    "tags": {
      "setting": [
        "city"
      ],
      "forWho": [
        "students"
      ]
    },
    "setup": {
      "legal": [
        "coop"
      ]
    }
  },
  {
    "id": "campus1-mtl",
    "name": "Campus1 MTL",
    "place": "Montréal",
    "type": "operator-coliving",
    "kind": "place",
    "img": "images/ex-campus1-mtl.jpg",
    "url": "https://campus1mtl.ca/montreal-student-housing/",
    "note": "Purpose-built student co-living downtown — communal programming baked in from day one.",
    "tags": {
      "setting": [
        "city"
      ],
      "forWho": [
        "students"
      ]
    },
    "setup": {
      "holding": [
        "rent"
      ]
    }
  },
  {
    "id": "un-village-a-lachine",
    "name": "Un Village à Lachine",
    "place": "Lachine, Montréal",
    "type": "cohousing",
    "kind": "place",
    "url": "https://villageurbain.org",
    "note": "58 homes by the non-profit Village Urbain: 16 sold at cost and 42 affordable rentals, side by side. Move-in planned for fall 2026.",
    "homes": 58,
    "opened": "2026",
    "tags": {
      "setting": [
        "city"
      ],
      "building": [
        "new"
      ]
    },
    "setup": {
      "holding": [
        "own",
        "rent"
      ]
    },
    "source": "https://villageurbain.org"
  },
  {
    "id": "cohabitat-quebec",
    "name": "Cohabitat Québec",
    "place": "Québec City",
    "type": "cohousing",
    "kind": "place",
    "url": "https://www.cohabitat.ca/",
    "note": "42 households in the Saint-Sacrement neighbourhood since 2013, run by sociocracy, in a LEED Platinum building.",
    "homes": 42,
    "opened": "2013",
    "tags": {
      "setting": [
        "city"
      ],
      "building": [
        "new"
      ]
    },
    "setup": {
      "legal": [
        "coop",
        "condo"
      ],
      "holding": [
        "own"
      ],
      "decisions": [
        "consent"
      ]
    },
    "source": "https://www.cohabitat.ca/"
  },
  {
    "id": "cohabitat-neuville",
    "name": "Cohabitat Neuville",
    "place": "Neuville, Québec",
    "type": "cohousing",
    "kind": "place",
    "url": "https://www.cohabitatneuville.com/",
    "note": "About 30 people on a 20-hectare property by the St. Lawrence, sharing a heritage house for meals, workshops and a sugar shack.",
    "tags": {
      "setting": [
        "countryside"
      ]
    },
    "setup": {
      "legal": [
        "coop",
        "condo"
      ],
      "holding": [
        "own"
      ]
    },
    "source": "https://www.cohabitatneuville.com/"
  },
  {
    "id": "vancouver-cohousing",
    "name": "Vancouver Cohousing",
    "place": "Vancouver, BC",
    "type": "cohousing",
    "kind": "place",
    "url": "https://www.vancouvercohousing.com/",
    "note": "31 homes on a city lot, 29 owned and 2 rented, since 2016.",
    "homes": 31,
    "opened": "2016",
    "tags": {
      "setting": [
        "city"
      ],
      "building": [
        "new"
      ]
    },
    "setup": {
      "holding": [
        "own",
        "rent"
      ]
    },
    "source": "https://www.vancouvercohousing.com/"
  },
  {
    "id": "windsong",
    "name": "WindSong",
    "place": "Langley, BC",
    "type": "cohousing",
    "kind": "place",
    "url": "https://windsong.bc.ca/",
    "note": "34 homes finished in 1996, among the first cohousing communities in Canada.",
    "homes": 34,
    "opened": "1996",
    "tags": {
      "setting": [
        "suburb"
      ],
      "building": [
        "new"
      ]
    },
    "source": "https://windsong.bc.ca/"
  },
  {
    "id": "terra-firma",
    "name": "Terra Firma",
    "place": "Ottawa, ON",
    "type": "cohousing",
    "kind": "place",
    "url": "https://cohousing.ca/communities/on/terra-firma/",
    "note": "Two renovated rows of townhouses with a new building between them for the common space, since 1997.",
    "opened": "1997",
    "tags": {
      "setting": [
        "city"
      ],
      "building": [
        "mixed"
      ]
    },
    "source": "https://cohousing.ca/communities/on/terra-firma/"
  },
  {
    "id": "muir-commons",
    "name": "Muir Commons",
    "place": "Davis, CA",
    "type": "cohousing",
    "kind": "place",
    "url": "http://www.muircommons.org/",
    "note": "The first newly built cohousing in the US: 26 homes on under 3 acres, lived in since 1991.",
    "homes": 26,
    "opened": "1991",
    "tags": {
      "setting": [
        "suburb"
      ],
      "building": [
        "new"
      ]
    },
    "source": "http://www.muircommons.org/"
  },
  {
    "id": "petaluma-avenue-homes",
    "name": "Petaluma Avenue Homes",
    "place": "Sebastopol, CA",
    "type": "cohousing",
    "kind": "place",
    "url": "https://www.sahahomes.org/property/petaluma-avenue-homes",
    "note": "Affordable rental cohousing for low-income families and seniors, run by a non-profit: 45 homes, a common house and a garden.",
    "homes": 45,
    "tags": {
      "forWho": [
        "families",
        "seniors"
      ]
    },
    "setup": {
      "legal": [
        "nonprofit"
      ],
      "holding": [
        "rent"
      ]
    },
    "source": "https://www.sahahomes.org/property/petaluma-avenue-homes"
  },
  {
    "id": "fardknappen",
    "name": "Färdknäppen",
    "place": "Stockholm",
    "type": "kollektivhus",
    "kind": "place",
    "url": "https://boio.se/guide/kollektivhus-bostadsko",
    "note": "43 rental flats built in 1993 for people over 40 whose children have left home, with a shared kitchen and dinners.",
    "homes": 43,
    "opened": "1993",
    "tags": {
      "setting": [
        "city"
      ],
      "building": [
        "new"
      ]
    },
    "setup": {
      "legal": [
        "public"
      ],
      "money": [
        "public"
      ],
      "holding": [
        "rent"
      ]
    },
    "source": "https://boio.se/guide/kollektivhus-bostadsko"
  },
  {
    "id": "stolplyckan",
    "name": "Stolplyckan",
    "place": "Linköping, Sweden",
    "type": "kollektivhus",
    "kind": "place",
    "url": "https://www.stolplyckan.se",
    "note": "Sweden's largest collective house: about 190 rental flats in 13 stairwells, since 1980.",
    "opened": "1980",
    "tags": {
      "setting": [
        "city"
      ]
    },
    "setup": {
      "holding": [
        "rent"
      ]
    },
    "source": "https://www.stolplyckan.se"
  }
];

/* rebuild each type's examples (field guides, map pop-up, projects page) */
COLIVING_TYPES.forEach(function (t) {
  t.examples = COLIVING_PROJECTS.filter(function (p) { return p.type === t.slug; });
});

/* pills for a project or a typical set-up: gold = set-up, sky = who it's for,
   terracotta = setting/building. obj = { setup:{...}, tags:{...} }; max = cap. */
function tagPillsHTML(obj, max) {
  if (typeof TAG_VOCAB === "undefined" || !obj) return "";
  var out = [];
  [["tags", "forWho"], ["setup", "legal"], ["setup", "holding"], ["setup", "money"], ["setup", "decisions"],
   ["tags", "setting"], ["tags", "building"], ["tags", "hosts"]].forEach(function (g) {
    var vals = (obj[g[0]] || {})[g[1]] || [], v = TAG_VOCAB[g[1]];
    vals.forEach(function (k) { if (v && v.values[k]) out.push('<span class="pill ' + v.layer + '" title="' + v.label + '">' + v.values[k] + "</span>"); });
  });
  if (max && out.length > max) out = out.slice(0, max);
  return out.length ? '<span class="pills">' + out.join("") + "</span>" : "";
}
