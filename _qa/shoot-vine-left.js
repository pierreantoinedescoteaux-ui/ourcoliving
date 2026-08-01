/* QA — the case-study vine, rebuilt to P-A's drawing (2026-08-01).
   DESIGN.md "Drawn lines": never straight, lives on the LEFT and never the
   right, travels off the edge rather than across the reading column, and may
   be absent over a long picture run.

   These checks read the REAL geometry off the drawn <path> (getPointAtLength
   through getScreenCTM), not the code that made it. Nothing is forced with
   inline styles; the page is scrolled so the vine actually draws.

   Usage: cd _qa && node shoot-vine-left.js        (server must be up)
          BASE=http://127.0.0.1:8123 node shoot-vine-left.js */
const { chromium } = require("playwright-core");
const path = require("path");
const BASE = process.env.BASE || "http://127.0.0.1:8123";

const SIZES = [[1280, 800], [1512, 950], [1920, 1080]];
const CASES = ["montreal", "growth-hub-dunbar", "growth-hub-shaughnessy"];

let fail = 0;
const ok = (name, cond, extra) => {
  console.log((cond ? "PASS" : "FAIL") + "  " + name + (extra != null ? "  [" + extra + "]" : ""));
  if (!cond) fail++;
};
const info = (name, v) => console.log("      · " + name + ": " + v);

/* everything below runs in the page: sample the path, and hand back plain
   numbers so the assertions live here, in the open. */
function measure() {
  const svg = document.querySelector("svg.storyrail");
  const p = svg && svg.querySelector(".railpath");
  if (!p) return { drawn: false };
  const ctm = p.getScreenCTM();
  const total = p.getTotalLength();
  const STEP = 18;
  const pts = [];
  for (let l = 0; l <= total; l += STEP) {
    const q = p.getPointAtLength(l).matrixTransform(ctm);
    pts.push([q.x, q.y]);
  }
  const last = p.getPointAtLength(total).matrixTransform(ctm);
  pts.push([last.x, last.y]);

  const TEXT_SEL = "p,h1,h2,h3,h4,li,blockquote,figcaption,.eyebrow,.chapeye," +
    ".lede,.lede-serif,.s-label,.t-kicker,.p-kicker,.hero-cap,.note,a";
  const story = document.getElementById("pStory");
  const boxes = [];
  story.querySelectorAll(TEXT_SEL).forEach(el => {
    if (el.classList.contains("railnode")) return;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return;
    if (!el.textContent.trim()) return;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 6) return;
    boxes.push([r.left, r.top, r.right, r.bottom]);
  });
  return {
    drawn: true, pts, boxes, total,
    textLeft: boxes.length ? Math.min(...boxes.map(b => b[0])) : null,
    vw: window.innerWidth,
    dash: p.style.strokeDashoffset,
    stroke: parseFloat(getComputedStyle(p).strokeWidth),
    strokePaint: getComputedStyle(p).stroke,
    nodes: document.querySelectorAll(".railnode").length,
    subpaths: (p.getAttribute("d").match(/M/g) || []).length,
    vine: window.__vine ? {
      runs: window.__vine.runs.map(r => [Math.round(r[0]), Math.round(r[1])]),
      minX: Math.round(window.__vine.minX), maxX: Math.round(window.__vine.maxX),
      xEdge: Math.round(window.__vine.xEdge), pad: window.__vine.pad,
      storyLeft: Math.round(window.__vine.storyLeft), H: Math.round(window.__vine.H)
    } : null,
    ovf: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
}

/* perpendicular distance of pt from the chord a—b */
function devFromChord(a, b, pt) {
  const vx = b[0] - a[0], vy = b[1] - a[1];
  const L = Math.hypot(vx, vy);
  if (L < 1e-6) return Math.hypot(pt[0] - a[0], pt[1] - a[1]);
  return Math.abs((pt[0] - a[0]) * vy - (pt[1] - a[1]) * vx) / L;
}

async function shots(p, dir, tag) {
  // scroll the page in steps so the vine actually grows, then capture it whole
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += Math.round(await p.evaluate(() => window.innerHeight) * 0.75)) {
    await p.evaluate(v => window.scrollTo(0, v), y);
    await p.waitForTimeout(160);
  }
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(dir, "vineL-" + tag + "-full.png"), fullPage: true });
}

(async () => {
  const b = await chromium.launch({ channel: "chrome", headless: true });

  for (const [vw, vh] of SIZES) {
    const p = await b.newPage({ viewport: { width: vw, height: vh } });
    const errors = [];
    p.on("pageerror", e => errors.push(String(e).slice(0, 200)));
    p.on("console", m => { if (m.type() === "error" && !/favicon/i.test(m.text())) errors.push(m.text().slice(0, 160)); });
    await p.goto(BASE + "/project.html?p=montreal", { waitUntil: "networkidle" });
    await p.waitForTimeout(500);
    // reveals fire on their own once scrolled; scroll through and come back
    await shots(p, __dirname, vw + "x" + vh);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(400);

    const m = await p.evaluate(measure);
    const T = vw + "x" + vh + ": ";
    ok(T + "0 JS errors", errors.length === 0, errors.join(" | "));
    ok(T + "vine drawn", m.drawn === true);
    if (!m.drawn) { await p.close(); continue; }
    ok(T + "no horizontal overflow", m.ovf <= 0, m.ovf);
    ok(T + "still painted with the gouache texture", /vinetex/.test(m.strokePaint), m.strokePaint);
    ok(T + "sprites placed", m.nodes >= 4, m.nodes);
    info("path length", Math.round(m.total) + "px in " + m.subpaths + " run(s)");
    info("lane (story-local x)", m.vine ? m.vine.minX + " … " + m.vine.maxX + "  (words begin at " + m.vine.pad + ")" : "n/a");
    info("runs (story-local y)", m.vine ? JSON.stringify(m.vine.runs) : "n/a");

    const half = m.vw / 2;
    const CLR = m.stroke / 2;   // the stroke has width; test its edge, not its spine

    // 1. LEFT only — never the right half of the page, never past the words
    let worstX = -Infinity, offscreen = 0;
    m.pts.forEach(q => { if (q[0] > worstX) worstX = q[0]; if (q[0] < 0) offscreen++; });
    ok(T + "never in the right half", worstX + CLR < half, "rightmost " + Math.round(worstX) + " vs half " + Math.round(half));
    ok(T + "always left of the words", worstX + CLR < m.textLeft,
      "rightmost edge " + Math.round(worstX + CLR) + " vs text at " + Math.round(m.textLeft));
    info("samples off the left of the window", offscreen + " / " + m.pts.length);

    // 2. never over a word
    let hits = 0, worstHit = null;
    m.pts.forEach(q => {
      for (const bx of m.boxes) {
        if (q[0] + CLR > bx[0] && q[0] - CLR < bx[2] && q[1] + CLR > bx[1] && q[1] - CLR < bx[3]) {
          hits++; worstHit = [Math.round(q[0]), Math.round(q[1])]; break;
        }
      }
    });
    ok(T + "never overlaps a text box", hits === 0, hits ? hits + " hits, e.g. " + worstHit : m.boxes.length + " boxes checked");

    // 3. never straight — no ruled segment anywhere.
    //    A wiggly line has inflection points, where any three points ARE
    //    momentarily collinear; a RULED segment is a stretch that stays flat.
    //    So the test is a sliding window (6 samples ≈ 90px of line): every
    //    window has to bow away from its own chord.
    const WIN = 6, MIN_BOW = 1.5;
    let flat = [], minBow = Infinity, worstAt = null;
    for (let i = 0; i + WIN - 1 < m.pts.length; i++) {
      const a = m.pts[i], z = m.pts[i + WIN - 1];
      if (Math.hypot(z[0] - a[0], z[1] - a[1]) > 200) continue;   // spans a break between runs
      let bow = 0;
      for (let k = 1; k < WIN - 1; k++) bow = Math.max(bow, devFromChord(a, z, m.pts[i + k]));
      if (bow < minBow) { minBow = bow; worstAt = [Math.round(a[0]), Math.round(a[1])]; }
      if (bow < MIN_BOW) flat.push(i);
    }
    ok(T + "never straight (every ~90px window bows > " + MIN_BOW + "px)", flat.length === 0,
      "flattest window bows " + minBow.toFixed(2) + "px at " + JSON.stringify(worstAt) + (flat.length ? ", " + flat.length + " flat" : ""));

    // 4. it actually ondulates — count the times it changes direction sideways
    let turns = 0, dir = 0;
    for (let i = 1; i < m.pts.length; i++) {
      const d = Math.sign(m.pts[i][0] - m.pts[i - 1][0]);
      if (d && dir && d !== dir) turns++;
      if (d) dir = d;
    }
    ok(T + "ondulates (>= 12 direction changes)", turns >= 12, turns + " turns");

    // 5. it grows with the scroll (and is whole at the bottom)
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(300);
    const top = await p.evaluate(() => parseFloat(document.querySelector(".railpath").style.strokeDashoffset));
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(400);
    const bot = await p.evaluate(() => parseFloat(document.querySelector(".railpath").style.strokeDashoffset));
    ok(T + "grows on scroll (offset falls to 0)", top > bot && bot < 1, top.toFixed(0) + " -> " + bot.toFixed(0));

    await p.close();
  }

  // ---- reduced motion: whole vine there from the start, no growth
  {
    const p = await b.newPage({ viewport: { width: 1512, height: 950 }, reducedMotion: "reduce" });
    const errors = [];
    p.on("pageerror", e => errors.push(String(e).slice(0, 200)));
    await p.goto(BASE + "/project.html?p=montreal", { waitUntil: "networkidle" });
    await p.waitForTimeout(600);
    const r = await p.evaluate(() => {
      const el = document.querySelector(".railpath");
      return el ? { has: true, da: el.style.strokeDasharray, off: el.style.strokeDashoffset } : { has: false };
    });
    ok("reduced-motion: 0 JS errors", errors.length === 0, errors.join(" | "));
    ok("reduced-motion: vine drawn", r.has);
    ok("reduced-motion: no dash animation at all", r.has && !r.da && !r.off, JSON.stringify(r));
    await p.screenshot({ path: path.join(__dirname, "vineL-reduced.png"), fullPage: true });
    await p.close();
  }

  // ---- the other cases still behave
  for (const slug of CASES) {
    const p = await b.newPage({ viewport: { width: 1512, height: 950 } });
    const errors = [];
    p.on("pageerror", e => errors.push(String(e).slice(0, 200)));
    await p.goto(BASE + "/project.html?p=" + slug, { waitUntil: "networkidle" });
    await p.waitForTimeout(400);
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(400);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(300);
    const m = await p.evaluate(measure);
    ok(slug + ": 0 JS errors", errors.length === 0, errors.join(" | "));
    ok(slug + ": vine drawn", m.drawn === true);
    if (m.drawn) {
      const CLR = m.stroke / 2;
      const worstX = Math.max(...m.pts.map(q => q[0]));
      ok(slug + ": left of the words", worstX + CLR < m.textLeft, Math.round(worstX + CLR) + " vs " + Math.round(m.textLeft));
      let hits = 0;
      m.pts.forEach(q => { for (const bx of m.boxes) if (q[0] + CLR > bx[0] && q[0] - CLR < bx[2] && q[1] + CLR > bx[1] && q[1] - CLR < bx[3]) { hits++; break; } });
      ok(slug + ": never over a word", hits === 0, hits);
      info(slug + " runs", m.vine ? JSON.stringify(m.vine.runs) : "n/a");
    }
    await p.close();
  }

  // ---- narrow: the story has no empty left column, so no vine at all
  for (const w of [1024, 1099]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(BASE + "/project.html?p=montreal", { waitUntil: "networkidle" });
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => ({
      rail: !!document.querySelector(".storyrail .railpath"),
      nodes: document.querySelectorAll(".railnode").length,
      leaves: Array.from(document.querySelectorAll(".chapleaf")).filter(e => getComputedStyle(e).display !== "none").length,
      ovf: document.documentElement.scrollWidth - document.documentElement.clientWidth
    }));
    ok(w + "px: no vine, leaves instead", !r.rail && r.nodes === 0 && r.leaves >= 4, JSON.stringify(r));
    ok(w + "px: no horizontal overflow", r.ovf <= 0, r.ovf);
    await p.close();
  }

  // ---- phone keeps its leaves, not a vine
  {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const errors = [];
    p.on("pageerror", e => errors.push(String(e).slice(0, 200)));
    await p.goto(BASE + "/project.html?p=montreal", { waitUntil: "networkidle" });
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => ({
      rail: !!document.querySelector(".storyrail .railpath"),
      leaves: Array.from(document.querySelectorAll(".chapleaf")).filter(e => getComputedStyle(e).display !== "none").length,
      ovf: document.documentElement.scrollWidth - document.documentElement.clientWidth
    }));
    ok("phone: 0 JS errors", errors.length === 0, errors.join(" | "));
    ok("phone: no vine", !r.rail);
    ok("phone: leaf chapter markers instead", r.leaves >= 4, r.leaves);
    ok("phone: no horizontal overflow", r.ovf <= 0, r.ovf);
    await p.close();
  }

  await b.close();
  console.log(fail === 0 ? "\nALL GREEN" : "\n" + fail + " FAILURES");
  process.exit(fail === 0 ? 0 : 1);
})();
