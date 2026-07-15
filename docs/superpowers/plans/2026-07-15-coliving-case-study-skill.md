# Coliving Case-Study Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `~/.claude/skills/coliving-case-study/` — a self-contained skill that turns "case study on <project>" into a standalone 11-section deep case study folder — and validate it with two real pilots (LILAC, Traditional Dream Factory).

**Architecture:** SKILL.md orchestrates a 5-stage pipeline (scope scan → parallel research lanes → photo scripts → write → verify). References teach by real example (frozen LILAC study), not rules. Photo pipeline is a zero-dependency Node script (deterministic-first). Pilots run as fresh Sonnet subagents with NO repo access — portability is tested, not assumed.

**Tech Stack:** Markdown skill files, Node ≥18 (built-in fetch) for `scripts/photos.mjs`, Claude Code Agent dispatch for pilots.

## Global Constraints (from spec, verbatim)

- Depth 2,000–6,000 words, scaled to documented substance. NEVER padded.
- Runnable end-to-end by Sonnet with no access to P-A's site files.
- Reference documents teach by real worked examples, not rules.
- Photos: script pipeline, not model judgment; non-licensed scraping OK with credit + takedown approach; module separable.
- Output: standalone folder (`study.md`, `images/`, `credits.md`, `sources.md`, `scope.md`); no repo assumptions; default = session cwd, P-A can name a target.
- Every claim sourced; unverified claims carry honesty labels; every lesson traces to a sourced fact or is cut.
- Empty sections forbidden; fixed-spine gaps reported as findings.
- Pilot outputs go to `C:\Users\User\Documents\Coliving Study\case-studies\<slug>\` (P-A's study home).

---

### Task 1: Skill skeleton — SKILL.md

**Files:**
- Create: `C:\Users\User\.claude\skills\coliving-case-study\SKILL.md`

**Interfaces:**
- Produces: the pipeline contract and section spec that Tasks 2-8 and both pilots consume. Section names EXACTLY: Snapshot / The story / The space today / Designing for behavior / The money / The operating model / The fight / Community mechanics / Replication / Lessons / Sources; conditionals: People / How to join / Voices.

- [ ] **Step 1: Write SKILL.md** with: YAML frontmatter (name `coliving-case-study`, trigger-rich description); non-negotiable rules (depth band, sourcing + honesty labels, lessons-trace rule, no-empty-sections, imitate format-example.md when present / pilot mode when absent); 5-stage pipeline with the 6 research lanes (story+sequencing+crises · money+ownership+affordability · space+design · community mechanics · voices · fight+replication), each lane returning claim+URL+confidence notes; output contract (5 files); full section spec with per-section must-hunt items (startup sequencing, crises, car-parking question, ownership-vs-financing split, "no fight found = replicability finding"); photos module invocation + placeholder-slot fallback; Verification section (5 checks from spec §4 Stage 4); Self-Improvement section; Platform Notes (Node ≥18 for scripts; skill functions without them); Eval Suite pointer.
- [ ] **Step 2: Verify structure** — `grep` for required headings (Verification, Self-Improvement, Platform Notes, Eval Suite) and that frontmatter has name+description. Expected: all present.
- [ ] **Step 3: Commit** in `~/.claude` repo: `git add skills/coliving-case-study && git commit -m "feat: coliving-case-study skill skeleton"`

### Task 2: references/dimensions.md

**Files:**
- Create: `C:\Users\User\.claude\skills\coliving-case-study\references\dimensions.md`

**Interfaces:**
- Consumes: research findings at `C:\Users\User\wiki\raw\specialized-knowledge\intentional-community-case-study-frameworks.md` and P-A copy at `Documents\Coliving Study\case-study-dimensions-expert-frameworks.md`.
- Produces: the expert dimension checklist (dimension → why it matters to a builder → which section it feeds) that research lanes cite.

- [ ] **Step 1: Adapt the study-folder doc** into a skill-internal checklist organized BY SECTION (so a research lane can grep its own lane), keeping the why-lines and the "5 most commonly missing" list as a mandatory hunt list. Include source URLs.
- [ ] **Step 2: Verify** — every fixed-spine section from SKILL.md appears as a heading; the 5 missing-dimensions all map to a lane. Commit.

### Task 3: Photo pipeline — scripts/photos.mjs + references/photo-pipeline.md

**Files:**
- Create: `C:\Users\User\.claude\skills\coliving-case-study\scripts\photos.mjs`
- Create: `C:\Users\User\.claude\skills\coliving-case-study\references\photo-pipeline.md`

**Interfaces:**
- Produces: CLI `node photos.mjs collect <pageUrl...> --out <dir>` → `<dir>/candidates.json` (`[{src,page,alt}]`); `node photos.mjs download <dir>` → verified images in `<dir>/images/` + `<dir>/credits.md` + report (kept/rejected+reason); `node photos.mjs verify <dir>` → re-check report. Zero npm dependencies.

- [ ] **Step 1: Write photos.mjs** (~200 lines, Node built-ins only): `collect` fetches each page (10s timeout, descriptive UA with contact email — Wikimedia lesson), extracts `<img src>`, `srcset` largest, `og:image`, absolutizes URLs, dedupes, drops obvious icons/logos/svg/data-URIs by pattern, writes candidates.json. `download` fetches each candidate to `images/raw-<n>.<ext>`, verifies magic bytes (JPEG `FFD8`, PNG `\x89PNG`, WebP `RIFF....WEBP`), parses pixel dimensions in pure JS (JPEG SOF scan, PNG IHDR, WebP VP8/VP8L/VP8X), rejects width<500 or height<350 or bytes<20KB, renames keepers `<slug>-<n>.<ext>`, writes `credits.md` (file → source page URL + credit line template) and a kept/rejected report. `verify` re-parses all files in `images/` and reports dimensions or corruption. No resize (site pipeline resizes at integration; keep originals).
- [ ] **Step 2: Test — collect** against `https://www.lilac.coop/`: run and inspect candidates.json is non-empty valid JSON with absolute URLs. Expected: ≥5 candidates.
- [ ] **Step 3: Test — download+verify** on those candidates: run, confirm ≥1 image kept with parsed dimensions, credits.md written, rejects have reasons. Then `verify` exits 0.
- [ ] **Step 4: Write photo-pipeline.md** — how to run the 3 commands, the credit format (matches site credits.html approach: credit everything, takedown note), the fallback when scripts can't run: described placeholder slots in study.md (`> PHOTO WANTED: <scene description>`), and the rule that the MODEL only selects/places verified keepers — never judges licensing or fabricates images.
- [ ] **Step 5: Commit.**

### Task 4: Pilot 1 — LILAC (fresh Sonnet subagent, no repo access)

**Files:**
- Create (by subagent): `C:\Users\User\Documents\Coliving Study\case-studies\lilac\{study.md,scope.md,sources.md,credits.md,images/}`

**Interfaces:**
- Consumes: only the skill folder. The dispatch prompt gives: skill path, project name "LILAC (Low Impact Living Affordable Community), Leeds, UK", output dir. NOTHING about the site repo.
- Produces: the candidate reference-example study.

- [ ] **Step 1: Dispatch** Sonnet subagent: "Read C:\Users\User\.claude\skills\coliving-case-study\SKILL.md and follow it exactly to produce a case study on LILAC (Leeds, UK). Output to <dir>." Photos module ON.
- [ ] **Step 2: Review output** against SKILL.md Verification (structure vs section spec, 5 random claim spot-checks, lessons-trace, honesty labels, word band vs scope.md call, images render).
- [ ] **Step 3: Log deviations** — every place the subagent needed judgment the skill didn't provide = a skill fix, not a one-off correction (capture rules, not use cases).

### Task 5: Fix round + freeze reference example

**Files:**
- Modify: `SKILL.md` (deviation fixes)
- Create: `references\format-example.md` (the reviewed LILAC study, frozen)

- [ ] **Step 1: Apply skill fixes** from Task 4 deviations.
- [ ] **Step 2: Freeze** — copy the reviewed study.md into references/format-example.md with a 5-line header ("this is the canonical worked example; imitate voice, density, sourcing style, section shapes").
- [ ] **Step 3: Flip SKILL.md pilot-mode line** to "imitate references/format-example.md". Commit.

### Task 6: Pilot 2 — Traditional Dream Factory (sparse-source test)

**Files:**
- Create (by subagent): `Documents\Coliving Study\case-studies\traditional-dream-factory\...`

- [ ] **Step 1: Dispatch** fresh Sonnet subagent, same minimal prompt shape, project "Traditional Dream Factory, Abela, Portugal".
- [ ] **Step 2: Review** — SAME rigor as pilot 1 (every instance gets full process). Extra attention: depth scaled DOWN if sources thin (no padding), honesty labels on the project's own claims (young project, self-published), crisis section honesty, format-example imitation fidelity.
- [ ] **Step 3: Apply second fix round** to SKILL.md if deviations. Commit.

### Task 7: Eval suite

**Files:**
- Create: `evals\evals.json`

- [ ] **Step 1: Write ≥4 cases** per skill-creator schema: (1) fires on "make a case study on Mehr als Wohnen"; (2) fires on "/coliving-case-study Tamera"; (3) does NOT fire on "what is cohousing?" (single question → answer directly); (4) edge: barely-documented project → assert honesty labels present + word count near band floor + no empty sections. Commit.

### Task 8: Governance wrap

- [ ] **Step 1:** Routing — add row to `~/.claude/rules/routing.md`: signal "case study on <community>", "study <project> deep", `/coliving-case-study` → skill. (Part of skill creation; P-A authorized the build autonomously.)
- [ ] **Step 2:** Skill DB entry on Notion (mandatory, skill-authoring 7.5): message-triage row as template, all properties, Trigger Spec + Verification contract + Dependencies (references/, scripts/, Node ≥18).
- [ ] **Step 3:** Routing Reference Page (`32b79bba-d910-8185-8556-fc9c285cbcf5`) Section 2 + changelog line.
- [ ] **Step 4:** Final `~/.claude` git commit; update memory (`project_coliving_portfolio.md` gets a pointer; skill work noted); report to P-A with both studies linked + what's deferred (site room, PDF plumbing, batch mode, Sonnet writing benchmark).
