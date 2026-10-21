# Brief: option cards for the Workshop hub "How a place comes together" (ourcoliving.xyz)

The hub explains the choices a group makes when it builds a place to live together. Each choice (an "option", like "Land trust" or "Consensus") gets a card. A careful editor polishes after you, so get the FACTS right and keep the tone plain.

## Read first
- GOLD STANDARD card (copy its shape, depth and tone): C:/Users/User/coliving-portfolio/_tools/hub/gold-card.json
- Short definitions already on the site (stay consistent): C:/Users/User/coliving-portfolio/glossary-data.js and TAG_VOCAB in C:/Users/User/coliving-portfolio/map-data.js (lines 82-140).
- Real places you may cite as examples (ids): C:/Users/User/coliving-portfolio/projects-data.js (each has id, name, place, note, setup, tags). Only cite a place for something its data or a source supports.
- Source list (use ids where they fit): C:/Users/User/coliving-portfolio/sources-data.js
- The Quebec guide (French, ALL RIGHTS RESERVED: write original English, never translate passages): C:/Users/User/wiki/raw/specialized-knowledge/guide-du-cohabitat/full-text.md has page markers "=== pN ===". Grep for the page range given to you and read only those pages. Corrections in projects-verify-2026-10-21.json in the same folder win over the guide.
- Up to 8 web searches in total for facts you are unsure of.

## Output
Write ONE JSON file (path given in your task): { "group": "<id>", "options": [card, card, ...], "newSources": [{"title","author","year","url","topics":[]}], "flags": [] }
Each card has the gold card's fields: id, name, summary (about 30 words), body, pros, cons, impact, bestWhen, examples, sources, flags.
- body length: "big" options 220-300 words in 3-4 short paragraphs; "small" options 90-130 words in 1-2 paragraphs. Your task says which is which.
- pros and cons: exactly 2 items each, short.
- impact: the five areas building, social, governance, legal, money. dot is "easier", "depends" or "harder" (what this option does to that area for a group, compared with an ordinary home), t is 3-7 words.
- Use the option ids given in your task exactly.

## Style (strict)
- Plain, warm, concrete English a curious 16-year-old understands. Short sentences. Say how it works, then what it means for people living together.
- NEVER em dashes or en dashes. Never "not X but Y" / "isn't just". Avoid lists of exactly three. At most one number per paragraph. No slogans or sales words.
- No "I" or "we".
- Before finishing: the file must be valid JSON and contain no "—" or "–".

Reply with only the file path and the flags.
