# Coliving Case-Study Skill — Design Spec

**Date:** 2026-07-15 · **Status:** approved by P-A (design round, this date)
**Skill home:** `~/.claude/skills/coliving-case-study/` (self-contained; NOT dependent on this repo)
**Spec home:** this repo, because the studies feed the coliving site and pilots reference site content.

## 1. What it is

A skill P-A points at any coliving / intentional-community project ("case study on LILAC", `/coliving-case-study <project>`). It researches the project across a fixed dimension canon, optionally gathers photos via a script pipeline, and writes a standalone deep case study in an identical format every time. Purpose: let one person study the model well enough to inform building their own project. Standalone resource; publishable on the coliving site or exportable as PDF later.

## 2. Hard requirements (from P-A)

- R1 — Fixed format, every study identical in structure.
- R2 — Depth 2,000–6,000 words, scaled to documented substance. NEVER padded. No fluff, but nuances included.
- R3 — Runnable end-to-end by **Sonnet with no access to P-A's site files** (fresh Claude Code session, skill folder only).
- R4 — Reference documents teach by **real worked examples, not rules**. Canonical example = the finished LILAC study (embedded after pilot 1).
- R5 — Photos: script pipeline, not model judgment. Non-licensed scraping from the project's own site is acceptable with credit + takedown-note approach (site `credits.html` precedent). Module is separable — v1 may ship without it if build runs long (P-A pre-approved).
- R6 — Output is a standalone folder (study + images + credits + sources); site/PDF integration is separate repo-side plumbing, built only after the skill works.
- R7 — Pilots: **LILAC (Leeds)** then **Traditional Dream Factory (Abela, Portugal)**.
- R8 — Every claim sourced; plausible-but-unverified claims carry an explicit honesty label. Every lesson traces to a sourced fact earlier in the study or is cut.

## 3. Section canon

Research basis: Diana Leafe Christian (*Creating a Life Together*), McCamant & Durrett, GEN research protocol, Kanter commitment theory, Rubin et al. 2019, IC.org zoning research. Full findings: `~/wiki/raw/specialized-knowledge/intentional-community-case-study-frameworks.md`; P-A copy: `~/Documents/Coliving Study/case-study-dimensions-expert-frameworks.md`.

### Fixed spine (every study, in order)

1. **Snapshot** — facts band: location, founded/since, resident count, site/building size, ownership form in one line.
2. **The story** — timeline. MUST hunt for: (a) **startup sequencing** — the order vision / land / legal / members / money actually arrived; (b) **crisis / near-death moments**. If none findable, the study states that explicitly ("no published account of a crisis — treat the official story with that in mind"), never silently skips.
3. **The space today** — buildings, common vs private, land.
4. **Designing for behavior** — design intentions and observed behavior shaping. MUST address the car/parking-vs-front-door question and whether daily movement routes past common spaces (top researched predictor of resident encounters).
5. **The money** — four sub-parts: capital financing of build/purchase · ongoing economics · **legal/ownership vehicle** (who holds title; control, exit, resale, dissolution) · **affordability mechanism** if one exists (resale formula, equity cap, land lease…).
6. **The operating model** — business model / revenue, if any.
7. **The fight** — zoning/planning battle: conflicting rules, variances sought, duration, cost, outcome; whether the project changed local policy. If genuinely no fight (greenfield + friendly zoning), say so — that's a finding about replicability.
8. **Community mechanics** — governance/decision-making structure, actual membership screening protocol, commitment mechanisms (what's *required* of members), turnover, founder succession. FIXED section with honest gaps: "not documented" is itself reported as a finding (P-A's call, 2026-07-15).
9. **Replication** — has the model been copied / spawned derivatives; what replicating would require (minimum committed households, capital, expertise, transferable vs context-specific).
10. **Lessons** — each lesson cites the section/fact it derives from. No motivational filler. Include care/aging angle where relevant.
11. **Sources** — every claim linked; honesty labels for unverified claims.

### Conditional sections (rendered only if findable — no empty sections)

- **People** — how many, demographics, values holding the collective.
- **How to join** — process + link.
- **Voices** — resident quotes from reviews/interviews/press/Reddit, always attributed.

## 4. Pipeline

- **Stage 0 — Scope scan.** Survey what's documented (official site, press, academic, video, forums). Output: source map + depth call (word band within 2,000–6,000) + which conditional sections will exist. Presented to P-A only if he's present; otherwise logged in the study folder as `scope.md`.
- **Stage 1 — Research lanes (parallel subagents, cheap models).** Six lanes: story+sequencing+crises · money+ownership+affordability · space+design · community mechanics · voices · fight+replication. Each returns sourced notes: claim + URL + confidence (verified / single-source / inferred).
- **Stage 2 — Photos (separable module).** Scripts in `<skill>/scripts/`: candidate collection from official site + press + Wikimedia → download → resize to 1600px q82 → verify each file opens/renders → write `credits.md` (source URL + credit line per image). Model only selects among verified candidates and assigns them to sections. Skill runs fine with module skipped → described placeholder slots instead.
- **Stage 3 — Write.** The dispatched agent itself writes the study (Sonnet by default — P-A 2026-07-15: "as much as possible through Sonnet, that's the real test"), imitating `references/format-example.md`. If a Sonnet study falls short, the fix is stronger skill instructions/examples — never escalating the model as a crutch. Frontmatter facts block (YAML: name, place, founded, residents, tenure, url, status, depth_words) + the section canon.
- **Stage 4 — Verify.** Checklist: (a) 5 random claims spot-checked against their cited sources; (b) every lesson traces to an in-study fact; (c) structure diff vs reference example (same sections, same order, conditionals justified); (d) images all render / placeholders well-described; (e) word count within the Stage-0 band, deviations justified by source density, zero padding.

## 5. Output contract

`case-studies/<slug>/` — created in the session's current working directory by default; P-A can name any target folder when invoking. Portable folder, no repo assumptions:
- `study.md` — the case study (YAML facts frontmatter + sections)
- `images/` — verified photos (when module runs)
- `credits.md` — per-image source + credit
- `sources.md` — full research bibliography incl. lane notes with confidence labels
- `scope.md` — Stage-0 source map + depth decision

## 6. Skill packaging (portability, R3/R4)

```
~/.claude/skills/coliving-case-study/
  SKILL.md                      — triggers, pipeline, verification, self-improvement (per rules/skill-authoring.md)
  references/format-example.md  — the real LILAC study, frozen after pilot 1 (examples > rules)
  references/dimensions.md      — expert dimension checklist w/ the why-it-matters lines
  references/photo-pipeline.md  — how to run the scripts, credit format, fallback slots
  scripts/                      — photo pipeline (deterministic-first principle)
```
No reads outside the skill folder at runtime. Required sections per `rules/skill-authoring.md`: Verification, Self-Improvement, Eval Suite (min 3 cases), Owner/Trigger/Procedure on outputs. Platform Notes section for OpenClaw portability.

## 7. Site/PDF integration (deferred; separate build)

Repo-side, after both pilots: case-studies room page (one-data-file-per-room rule), `_tools/import-study.mjs` converting a study folder → data entry deterministically, print stylesheet for PDF export. Decision on downloadable-PDF vs read-on-site stays open (P-A: "tbd"). NOT part of the skill.

## 8. Build order

1. Skill skeleton (SKILL.md + dimensions.md + photo scripts) — via `/skill-creator` + Skill Edit Protocol governance.
2. Pilot 1: LILAC end-to-end (photos module on).
3. Extract LILAC study → `references/format-example.md`; freeze.
4. Pilot 2: Traditional Dream Factory (tests sparse-source honesty + depth scaling).
5. Adjust from pilot findings; eval suite; Skill DB entry on Notion (mandatory, per skill-authoring step 7.5).
6. (Later, optional) site room + import script + print CSS.

## 9. Deferred list

- Site case-studies room + PDF export plumbing (section 7).
- PDF image policy question (credited-but-unlicensed photos leaving the site in a PDF) — resolve when PDF plumbing is built.
- Batch mode ("case studies for all 12 atlas type examples").
- ~~Sonnet-only benchmark of the writing pass~~ — superseded 2026-07-15: the pilots run Sonnet end-to-end including writing; they ARE the benchmark.
