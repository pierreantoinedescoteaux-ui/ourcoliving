/* QA — case-study template v2 + resources v2 (2026-07-22).
   Desktop 1440 checks + full-page shots for:
   project.html?p=montreal (filled), ?p=bridge2ai (scaffold), resources.html.
   Usage: node shoot-case-v2.js   (from _qa/) */
const { chromium } = require("playwright-core");
const path = require("path");
const rootDir = path.resolve(__dirname, "..").replace(/\\/g, "/");
const root = "file:///" + rootDir + "/";

(async () => {
  const b = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  let fail = 0;
  const ok = (name, cond, extra) => { console.log((cond ? "PASS" : "FAIL") + "  " + name + (extra != null ? "  [" + extra + "]" : "")); if (!cond) fail++; };

  async function open(url, vw, vh) {
    const p = await b.newPage({ viewport: { width: vw || 1440, height: vh || 900 } });
    const errors = [];
    p.on("pageerror", e => errors.push(String(e).slice(0, 200)));
    p.on("console", m => { if (m.type() === "error" && !/favicon/i.test(m.text())) errors.push(m.text().slice(0, 200)); });
    await p.goto(root + url, { waitUntil: "networkidle" });
    await p.waitForTimeout(600);
    return { p, errors };
  }

  // ---- 1. Montreal (filled case) desktop
  {
    const { p, errors } = await open("project.html?p=montreal");
    // force reveals for capture
    await p.evaluate(() => document.querySelectorAll(".reveal").forEach(el => el.classList.add("in")));
    // scroll to bottom to grow vine, then back
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(500);
    const r = await p.evaluate(() => ({
      rail: !!document.querySelector(".storyrail .railpath"),
      nodes: document.querySelectorAll(".railnode").length,
      chaps: document.querySelectorAll(".chap").length,
      moves: document.querySelectorAll(".move").length,
      mnotes: document.querySelectorAll(".mnote").length,
      numbers: !!document.querySelector(".numbers"),
      kpis: document.querySelectorAll(".numbers .num").length,
      changed: !!document.querySelector(".changed"),
      hook: !!document.querySelector(".p-hook"),
      pager: document.querySelectorAll(".pager .pg").length,
      editLeak: /\[edit/i.test(document.querySelector("main").innerText),
      imgs: Array.from(document.images).filter(i => i.src && !i.complete === false && i.naturalWidth === 0 && !i.loading).length
    }));
    ok("mtl: 0 JS errors", errors.length === 0, errors.join(" | "));
    ok("mtl: vine rail drawn", r.rail);
    ok("mtl: 5 rail nodes (seed→bloom)", r.nodes === 5, r.nodes);
    ok("mtl: 5 chapters", r.chaps === 5, r.chaps);
    ok("mtl: 3 moves", r.moves === 3, r.moves);
    ok("mtl: method notes present", r.mnotes === 2, r.mnotes);
    ok("mtl: quiet numbers band w/ 3 kpis", r.numbers && r.kpis === 3, r.kpis);
    ok("mtl: changed block", r.changed);
    ok("mtl: hook line", r.hook);
    ok("mtl: pager prev+next", r.pager === 2, r.pager);
    ok("mtl: no [edit] leaking to render", !r.editLeak);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(__dirname, "case2-mtl-desktop.png"), fullPage: true });
    await p.close();
  }

  // ---- 2. Broken-image sweep on all three filled cases
  for (const slug of ["montreal", "growth-hub-dunbar", "growth-hub-shaughnessy"]) {
    const { p, errors } = await open("project.html?p=" + slug);
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(800);
    const broken = await p.evaluate(() =>
      Array.from(document.images).filter(i => i.getAttribute("src") && i.complete && i.naturalWidth === 0).map(i => i.getAttribute("src")));
    ok(slug + ": 0 broken images", broken.length === 0, broken.join(","));
    ok(slug + ": 0 JS errors", errors.length === 0, errors.join(" | "));
    await p.close();
  }

  // ---- 3. Scaffold page (bridge2ai)
  {
    const { p, errors } = await open("project.html?p=bridge2ai");
    await p.evaluate(() => document.querySelectorAll(".reveal").forEach(el => el.classList.add("in")));
    const r = await p.evaluate(() => ({
      scafnote: !!document.querySelector(".scafnote"),
      prompts: document.querySelectorAll(".ph.pcard").length,
      heroPh: !!document.querySelector(".p-hero .hero-ph"),
      pagerLinks: document.querySelectorAll(".pager .pg").length,
      allLink: !!document.querySelector(".pager .pg-all a")
    }));
    ok("scaffold: 0 JS errors", errors.length === 0, errors.join(" | "));
    ok("scaffold: waiting-note shown", r.scafnote);
    ok("scaffold: 5 prompt cards", r.prompts === 5, r.prompts);
    ok("scaffold: hero placeholder", r.heroPh);
    ok("scaffold: no prev/next, has All-work", r.pagerLinks === 0 && r.allLink);
    await p.screenshot({ path: path.join(__dirname, "case2-scaffold-desktop.png"), fullPage: true });
    await p.close();
  }

  // ---- 4. Resources v2
  {
    const { p, errors } = await open("resources.html");
    const r = await p.evaluate(() => ({
      cats: document.querySelectorAll(".rcat").length,
      cards: document.querySelectorAll(".rcard").length,
      links: Array.from(document.querySelectorAll(".rcard .visit")).map(a => a.href),
      agartha: /agartha\.one\/map/.test(document.body.innerHTML)
    }));
    ok("resources: 0 JS errors", errors.length === 0, errors.join(" | "));
    ok("resources: 3 category sections", r.cats === 3, r.cats);
    ok("resources: 8 cards", r.cards === 8, r.cards);
    ok("resources: agartha map link present", r.agartha);
    await p.screenshot({ path: path.join(__dirname, "case2-resources-desktop.png"), fullPage: true });
    await p.close();
  }

  // ---- 5. Phone spot-checks (mobile-audit does the full sweep)
  for (const [url, name] of [["project.html?p=montreal", "case2-mtl-phone"], ["resources.html", "case2-resources-phone"]]) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const errors = [];
    p.on("pageerror", e => errors.push(String(e).slice(0, 200)));
    await p.goto(root + url, { waitUntil: "networkidle" });
    await p.waitForTimeout(500);
    await p.evaluate(() => document.querySelectorAll(".reveal").forEach(el => el.classList.add("in")));
    const r = await p.evaluate(() => ({
      ovf: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rail: !!document.querySelector(".storyrail .railpath"),
      floatNote: Array.from(document.querySelectorAll(".mnote")).some(n => getComputedStyle(n).float === "right")
    }));
    ok(name + ": 0 JS errors", errors.length === 0, errors.join(" | "));
    ok(name + ": no horizontal overflow", r.ovf <= 0, r.ovf);
    if (/project/.test(url)) {
      ok(name + ": vine hidden on phone", !r.rail);
      ok(name + ": method notes in-flow (not floated)", !r.floatNote);
    }
    await p.screenshot({ path: path.join(__dirname, name + ".png"), fullPage: true });
    await p.close();
  }

  await b.close();
  console.log(fail === 0 ? "\nALL GREEN" : "\n" + fail + " FAILURES");
  process.exit(fail === 0 ? 0 : 1);
})();
