# FEEDBACK.md — P-A's change backlog

**How this works (agreed 2026-07-11):**
- P-A dumps quick reactions/changes here anytime (or tells any session "add to backlog" and it writes here).
- When 5–10 items pile up (or P-A says "process the backlog"), a Fable 5/Opus session reads ALL items, groups related ones, dispatches concrete items to cheaper agents, and **escalates ambiguous/judgment items back to P-A instead of guessing**.
- Each processed item gets moved to Done with a one-line note + commit hash.
- One feedback item must NEVER trigger a rewrite of anything in the LOCKED list.

---

## 🔒 LOCKED — approved, do not touch without P-A's explicit ask
- The Atlas map interaction model v2 (hover mini-cards + click opens FULL field-notes popup with "Open as full page" button; no intermediate summary modal) — P-A's explicit redesign spec, verdict session 2026-07-11. Earlier "hover cards + centered summary modal" lock superseded by that same explicit ask.
- Architecture v3 buckets (Manifesto · Atlas · Design for Connection · About) — stable containers, never re-architect (P-A hard requirement)
- Content/data layer split (one data file per room) — content survives all re-skins

## 📥 Inbox (unprocessed)
<!-- P-A or any session appends below. Format: - [date] item. One line each, specifics welcome. -->

## ⏳ Escalated — needs P-A's call
<!-- Judgment items pulled from inbox during processing land here with the question spelled out. -->
- [2026-07-12] Atlas carousel: photos or the anatomy DRAWINGS? P-A hedged ("maybe the drawing versions are better"). Preview with drawings: `_qa/r18-atlas-carousel-DRAWINGS-preview.png`; current photos: `_qa/r18-atlas-carousel.png`. One-line swap in map.html slide render once decided.
- [2026-07-16] Design for Connection: keep the AI hand-drawn sketches, or restore P-A's REAL house photos? A frozen R28 chat converted the whole DfC page to one duotone sketch style, replacing ~8 real photos (Montréal living room / dinner / stillness room / coworking; garden; Dunbar piano; art table; sunroom office) — this breaks the "never replace real photos" rule. For an authenticity-first portfolio it's a real call. Committed as `4d73330`; old photo srcs are in that diff — any/all revertable per-slot. QA of the shipped state: `_qa/shoot-design-r28.js` (all green). Preview open bank: `_qa/r28-design-bank-open.png`.

## ✅ Done
- [2026-07-16] R28 DfC batch + resize + story polish (recovery chat — finished a frozen session's uncommitted work): 38 z_image hand-drawn sketches generated+resized to images/generated/dfc2/ and wired into every design-data.js slot; index hero + type.html .diag img capped 80vh; story chapter links styled green; "university in Québec City"→"Université Laval". Verified: 0 broken imgs desktop+mobile, 0 page errors via new _qa/shoot-design-r28.js. (commit 4d73330) — NOTE: photo-replacement decision escalated above.
- [2026-07-15] R27 — the three R26-deferred items (direct chat): writings cards render their main images; every field guide lands on the "Co-living takes many shapes" intro + 12-tile icon gallery (active guide highlighted, click opens the guide, arrows untouched); design.html carousel image capped (--slide-w gains a 110vh term) so short laptop screens (1280x620) no longer get images taller than the viewport — RESIZE-REPORT worst offender cleared (commit 1647737)
- [2026-07-12] R18 batch (direct chat): atlas carousel calm load + no auto-advance + Baugruppen↔Intergenerational swap; popup pre-scrolled past hero + frozen ×/⤢ icon tools outside the card; DfC infinite carousel + toggle pill fixed top-right + notice open-only + image-shaded open sections + drag-swipe + edge peeks; essay moved under Design for Connection nav; real footer w/ © year; fixed bottom-right back-to-top sitewide (commit 84e009e)
<!-- - [date] item → what was done (commit abc1234) -->
- [2026-07-11] P-A verdict round (direct chat, not via inbox): homepage v4 rejected → v5 warm-paper at big scale; atlas = "Co-living takes many shapes" + full-width 12-model carousel + symbol markers + full-guide popup w/ open-as-page; type.html bright re-skin + diagram placeholder slots; ASSETS.md 12 diagram slots awaiting P-A's image MCP (commit bc1b90d)
