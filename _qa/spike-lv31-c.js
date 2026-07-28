/* QA spike: landing v3.1 — Slice C (in-scene hotspots + copy + pills).
   Verifies: per-scene anchored spots (S2-S7) live only at their dwell, hover
   highlight + one-liner, click departs with zoom+veil then REAL page load,
   reduced-motion plain navigation, desktop pills hidden / phone pills ≥44px
   and ≥16px, spot layer absent on phone, map lock + tour still intact.
   Does NOT touch shoot-lv3.js.

   Serve first:  npx http-server -p 8123 -s .
   Full run:     node _qa/spike-lv31-c.js
   Debug shots:  node _qa/spike-lv31-c.js debug   (trace-calibration screenshots)
   CHROME env var overrides the browser path (H.264 posters note as in ab spike). */
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright-core")); }
catch (e) { ({ chromium } = require("/opt/node22/lib/node_modules/playwright/index.js")); }

const BASE = process.env.BASE || "http://localhost:8123";
const OUT = __dirname;
const DEBUG_ONLY = process.argv[2] === "debug";
const SCENES = [
  { id: "commons", index: 1, spots: 3, pills: 3 },
  { id: "library", index: 2, spots: 4, pills: 4 },
  { id: "makers",  index: 3, spots: 3, pills: 3 },
  { id: "gardens", index: 4, spots: 2, pills: 2 },
  { id: "homes",   index: 5, spots: 3, pills: 3 },
  { id: "lookout", index: 6, spots: 3, pills: 3 }
];

(async () => {
  const launch = {};
  if (process.env.CHROME) launch.executablePath = process.env.CHROME;
  let b;
  try { b = await chromium.launch({ headless: true, channel: launch.executablePath ? undefined : "chrome", ...launch }); }
  catch (e) { b = await chromium.launch({ headless: true, ...launch }); }
  let fails = 0;
  const check = (ok, label) => { console.log((ok ? "PASS" : "FAIL") + "  " + label); if (!ok) fails++; };
  const watch = p => {
    const errs = [], ext = [];
    const mine = u => !u || u.indexOf(BASE) === 0;
    p.on("pageerror", e => errs.push(e.message));
    p.on("console", m => {
      if (m.type() !== "error") return;
      const u = (m.location() && m.location().url) || "";
      (mine(u) ? errs : ext).push(m.text() + (u ? " [" + u + "]" : ""));
    });
    p.on("requestfailed", r => { if (!mine(r.url())) ext.push(r.url()); });
    errs.external = ext;
    return errs;
  };
  const noise = errs => errs.external.length ? "   (ignored " + errs.external.length + " third-party failures)" : "";
  const jump = (p, i) => p.evaluate(k => { WORLD.jumpToInstant(k); }, i);

  /* ---------- debug-mode: trace-calibration screenshots ---------- */
  if (DEBUG_ONLY) {
    const d = await b.newPage({ viewport: { width: 1440, height: 900 } });
    watch(d);
    await d.goto(BASE + "/index.html?debug", { waitUntil: "load" });
    await d.waitForTimeout(1500);
    for (const sc of SCENES) {
      await jump(d, sc.index);
      await d.waitForTimeout(700);
      await d.screenshot({ path: path.join(OUT, "lv31-c-debug-" + sc.id + ".png") });
      console.log("shot  lv31-c-debug-" + sc.id + ".png");
    }
    await d.close(); await b.close();
    return;
  }

  /* ---------- main desktop pass: 1440x900 ---------- */
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = watch(p);
  await p.goto(BASE + "/index.html", { waitUntil: "load" });
  await p.waitForTimeout(1600);
  const H264 = await p.evaluate(() => !!document.createElement("video").canPlayType('video/mp4; codecs="avc1.42E01E"'));
  if (!H264) console.log("NOTE  no H.264 decoder here — posters (not playback) verified, as in index.html");

  /* map spot-check: 6 map labels + lock holds (regression guard) */
  const mapState = await p.evaluate(() => ({
    labels: document.querySelectorAll("#lv3labels .lv3-label").length,
    mapOn: document.documentElement.classList.contains("lv3-map"),
    spotsOff: !document.getElementById("lv3scenes").classList.contains("is-on")
  }));
  check(mapState.labels === 6 && mapState.mapOn, "map: still loads with 6 labels");
  check(mapState.spotsOff, "map: scene-spot layer is OFF in map mode");
  await p.mouse.move(720, 450);
  await p.mouse.wheel(0, 600);
  await p.waitForTimeout(250);
  const lockY = await p.evaluate(() => Math.round(scrollY));
  check(lockY === 0, "map: scroll lock still holds (scrollY=" + lockY + ")");

  /* per-scene: spots live at dwell, pills hidden, hover behaviour */
  for (const sc of SCENES) {
    await jump(p, sc.index);
    await p.waitForTimeout(750);
    const st = await p.evaluate((n) => {
      const layer = document.getElementById("lv3scenes");
      const vis = [...document.querySelectorAll("#lv3slabels .lv3-label")]
        .filter(l => l.offsetParent !== null);
      const tags = [...document.querySelectorAll("#world .sw-copy__tags")];
      const litCopy = [...document.querySelectorAll("#world .sw-copy")]
        .map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(c => c.op > 0.5).map(c => c.i);
      const overCopy = [];
      const copyR = document.querySelectorAll("#world .sw-copy")[n] &&
        document.querySelectorAll("#world .sw-copy")[n].getBoundingClientRect();
      const hitR = (a, c) => !(a.right <= c.left || a.left >= c.right || a.bottom <= c.top || a.top >= c.bottom);
      vis.forEach(l => {
        const r = l.querySelector(".lv3-name").getBoundingClientRect();
        if (copyR && hitR(r, copyR)) overCopy.push(l.querySelector(".lv3-name").textContent.trim());
      });
      /* label pair overlaps (name rows only) */
      const pairHits = [];
      const rects = vis.map(l => l.querySelector(".lv3-name").getBoundingClientRect());
      for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++)
        if (hitR(rects[i], rects[j])) pairHits.push(i + "x" + j);
      return {
        on: layer.classList.contains("is-on"),
        op: +getComputedStyle(layer).opacity,
        spots: vis.length,
        onScreen: vis.filter(l => { const r = l.getBoundingClientRect(); return r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight + 40; }).length,
        pillsHidden: tags.every(t => getComputedStyle(t).display === "none"),
        litCopy, overCopy, pairHits
      };
    }, sc.index);
    check(st.on && st.op > 0.85, sc.id + ": spot layer ON at dwell (op=" + st.op.toFixed(2) + ")");
    check(st.spots === sc.spots, sc.id + ": " + sc.spots + " spots rendered (" + st.spots + ")");
    check(st.onScreen === st.spots, sc.id + ": every spot label fully on screen (" + st.onScreen + "/" + st.spots + ")");
    check(st.pillsHidden, sc.id + ": desktop tag pills hidden");
    check(st.overCopy.length === 0, sc.id + ": no spot label sits on the scene copy" + (st.overCopy.length ? " -> " + st.overCopy.join(",") : ""));
    check(st.pairHits.length === 0, sc.id + ": no spot labels overlap each other" + (st.pairHits.length ? " -> " + st.pairHits.join(",") : ""));
    await p.screenshot({ path: path.join(OUT, "lv31-c-" + sc.id + ".png") });

    /* hover the first label: highlight + one-liner */
    const first = p.locator("#lv3slabels .lv3-label:visible").first();
    await first.locator(".lv3-name").hover();
    await p.waitForTimeout(450);
    const hov = await p.evaluate(() => {
      const layer = document.getElementById("lv3scenes");
      const hot = document.querySelector("#lv3slabels .lv3-label.is-hot");
      return {
        isHot: layer.classList.contains("is-hot"),
        fxOp: +getComputedStyle(document.getElementById("lv3sfx")).opacity,
        descVis: hot ? getComputedStyle(hot.querySelector(".lv3-desc")).visibility : "none",
        descOp: hot ? +getComputedStyle(hot.querySelector(".lv3-desc")).opacity : 0,
        holeD: (document.getElementById("lv3shole").getAttribute("d") || "").length > 10
      };
    });
    check(hov.isHot && hov.fxOp > 0.9 && hov.holeD, sc.id + ": hover paints the painterly highlight (fx=" + hov.fxOp + ")");
    check(hov.descVis === "visible" && hov.descOp > 0.9, sc.id + ": hover reveals the one-liner");
    await p.screenshot({ path: path.join(OUT, "lv31-c-" + sc.id + "-hover.png") });
    await p.mouse.move(10, 880);
    await p.waitForTimeout(250);
  }

  /* spots must be gone BETWEEN dwells (mid-connector) */
  await p.evaluate(() => {
    const a = WORLD.dwellCenter(2), b2 = WORLD.dwellCenter(3);
    scrollTo(0, (a + b2) / 2);
  });
  await p.waitForTimeout(500);
  const between = await p.evaluate(() => document.getElementById("lv3scenes").classList.contains("is-on"));
  check(!between, "between dwells: spot layer stands down");

  /* tour spot-check (regression): lands on summit, spots for lookout live */
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(600);
  await p.click("#lv3tour");
  await p.waitForTimeout(2600);
  const tourSt = await p.evaluate(() => ({
    y: Math.round(scrollY),
    hint: document.getElementById("lv3tourhint").textContent,
    spotsOn: document.getElementById("lv3scenes").classList.contains("is-on"),
    spotCount: [...document.querySelectorAll("#lv3slabels .lv3-label")].filter(l => l.offsetParent !== null).length
  }));
  check(tourSt.y > 0 && /scroll down/i.test(tourSt.hint), "tour: still lands on the summit with the descend hint");
  check(tourSt.spotsOn && tourSt.spotCount === 3, "tour: summit spots are live at the top (" + tourSt.spotCount + ")");
  check(errs.length === 0, "desktop: 0 same-origin console/page errors" + (errs.length ? " -> " + errs.join(" | ") : noise(errs)));
  await p.close();

  /* ---------- click test: departs then REALLY navigates ---------- */
  const c = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const cerrs = watch(c);
  await c.goto(BASE + "/index.html", { waitUntil: "load" });
  await c.waitForTimeout(1200);
  await jump(c, 3);              /* the workshop */
  await c.waitForTimeout(800);
  const t0 = Date.now();
  await c.locator("#lv3slabels .lv3-label:visible", { hasText: "The blueprint" }).first().locator(".lv3-name").click();
  await c.waitForTimeout(220);
  const midVeil = await c.evaluate(() => document.getElementById("lv3veil") && document.getElementById("lv3veil").classList.contains("on")).catch(() => "navigated-early");
  await c.waitForURL("**/design.html", { timeout: 4000 });
  const dt = Date.now() - t0;
  check(true, "click: The blueprint navigates to design.html (" + dt + "ms)");
  check(midVeil === true || midVeil === "navigated-early", "click: veil covered during the departure (" + midVeil + ")");
  check(dt >= 450 && dt < 1600, "click: departure is fast (~0.5s) not instant/slow (" + dt + "ms)");
  check(cerrs.length === 0, "click page: 0 errors" + (cerrs.length ? " -> " + cerrs.join(" | ") : noise(cerrs)));
  await c.close();

  /* ctrl-click must fall through to the native link (new tab), page stays */
  const ctx2 = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const c2 = await ctx2.newPage();
  watch(c2);
  await c2.goto(BASE + "/index.html", { waitUntil: "load" });
  await c2.waitForTimeout(1200);
  await jump(c2, 3);
  await c2.waitForTimeout(800);
  const popupWait = ctx2.waitForEvent("page", { timeout: 3000 }).catch(() => null);
  await c2.locator("#lv3slabels .lv3-label:visible", { hasText: "The blueprint" }).first().locator(".lv3-name").click({ modifiers: ["Control"] });
  const popup = await popupWait;
  await c2.waitForTimeout(400);
  const stayed = c2.url().indexOf("index.html") > -1;
  check(stayed, "ctrl-click: the landing page does NOT navigate away");
  check(!!popup, "ctrl-click: opens the target in a new tab (native link behaviour)");
  await ctx2.close();

  /* reduced motion: plain navigation, no zoom choreography */
  const rm = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  watch(rm);
  await rm.goto(BASE + "/index.html", { waitUntil: "load" });
  await rm.waitForTimeout(1000);
  await jump(rm, 5);             /* the homes */
  await rm.waitForTimeout(700);
  await rm.locator("#lv3slabels .lv3-label:visible", { hasText: "The story book" }).first().locator(".lv3-name").click();
  await rm.waitForURL("**/story.html", { timeout: 3000 });
  check(true, "reduced motion: spot click navigates plainly to story.html");
  await rm.close();

  /* ---------- viewport sweep: labels + anchors stay in frame ---------- */
  for (const vp of [{ width: 1280, height: 800 }, { width: 1920, height: 1080 }, { width: 2560, height: 1080 }]) {
    const v = await b.newPage({ viewport: vp });
    const verrs = watch(v);
    await v.goto(BASE + "/index.html", { waitUntil: "load" });
    await v.waitForTimeout(1200);
    for (const sc of SCENES) {
      await jump(v, sc.index);
      await v.waitForTimeout(550);
      const r = await v.evaluate((idx) => {
        const g = SCENE_SPOTS.filter(x => x.index === idx)[0];
        const f = sceneFrame(idx);
        const badAnchor = [], offLabel = [];
        g.spots.forEach(sp => {
          const ax = f.x + sp.anchor[0] * f.w, ay = f.y + sp.anchor[1] * f.h;
          if (ax < 0 || ax > innerWidth || ay < 0 || ay > innerHeight) badAnchor.push(sp.name);
          const lr = sp.el.getBoundingClientRect();
          if (lr.left < 0 || lr.top < 0 || lr.right > innerWidth || lr.bottom > innerHeight + 40) offLabel.push(sp.name);
        });
        return { badAnchor, offLabel };
      }, sc.index);
      check(r.badAnchor.length === 0, vp.width + "x" + vp.height + " " + sc.id + ": anchors in frame" + (r.badAnchor.length ? " -> " + r.badAnchor.join(",") : ""));
      check(r.offLabel.length === 0, vp.width + "x" + vp.height + " " + sc.id + ": labels on screen" + (r.offLabel.length ? " -> " + r.offLabel.join(",") : ""));
    }
    check(verrs.length === 0, vp.width + "x" + vp.height + ": 0 errors" + (verrs.length ? " -> " + verrs.join(" | ") : noise(verrs)));
    await v.close();
  }

  /* ---------- phone 390x844 ---------- */
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const merrs = watch(m);
  await m.goto(BASE + "/index.html", { waitUntil: "load" });
  await m.waitForTimeout(1600);
  const ph = await m.evaluate(() => {
    const layer = document.getElementById("lv3scenes");
    const tagUls = [...document.querySelectorAll("#world .sw-copy__tags")];
    const pills = tagUls.map(u => [...u.querySelectorAll("li a")].map(a => {
      const r = a.getBoundingClientRect();
      return { h: r.height, fs: parseFloat(getComputedStyle(a).fontSize), t: a.textContent.trim() };
    }));
    return {
      layerHidden: getComputedStyle(layer).display === "none",
      counts: pills.map(x => x.length),
      minH: Math.min(...pills.flat().map(x => x.h)),
      minFs: Math.min(...pills.flat().map(x => x.fs)),
      rows: document.querySelectorAll(".lv3-row").length
    };
  });
  check(ph.layerHidden, "phone: desktop spot layer fully hidden");
  check(ph.rows === 6, "phone: six map callouts still present");
  check(JSON.stringify(ph.counts) === JSON.stringify([3, 4, 3, 2, 3, 3]), "phone: pills per scene = 3,4,3,2,3,3 (" + ph.counts.join(",") + ")");
  check(ph.minH >= 44, "phone: every pill tap target ≥44px (min " + ph.minH.toFixed(1) + ")");
  check(ph.minFs >= 16, "phone: pill text ≥16px (min " + ph.minFs + ")");
  await m.screenshot({ path: path.join(OUT, "lv31-c-phone-map.png") });

  /* tap into the garden, pills visible + tappable, tap one navigates */
  await m.tap('.lv3-row[data-key="garden"]');
  await m.waitForTimeout(2800);
  const gpills = await m.evaluate(() => {
    const copies = [...document.querySelectorAll("#world .sw-copy")];
    const lit = copies.map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(x => x.op > 0.5).map(x => x.i);
    const ul = lit.length ? copies[lit[0]].querySelector(".sw-copy__tags") : null;
    return {
      lit,
      shown: ul ? getComputedStyle(ul).display !== "none" : false,
      labels: ul ? [...ul.querySelectorAll("a")].map(a => a.textContent.trim()) : []
    };
  });
  check(gpills.lit.length === 1 && gpills.lit[0] === 4, "phone: tap lands in the garden (lit " + gpills.lit.join(",") + ")");
  check(gpills.shown && gpills.labels.indexOf("Read the manifesto") > -1, "phone: garden pills present -> " + gpills.labels.join(" · "));
  await m.screenshot({ path: path.join(OUT, "lv31-c-phone-garden.png") });
  await m.tap('#world .sw-copy__tags a:has-text("Read the manifesto")');
  await m.waitForURL("**/manifesto.html", { timeout: 4000 });
  check(true, "phone: tapping a pill navigates (no touch-interception regression)");
  check(merrs.length === 0, "phone: 0 errors" + (merrs.length ? " -> " + merrs.join(" | ") : noise(merrs)));
  await m.close();

  await b.close();
  console.log(fails === 0 ? "\nALL GREEN" : "\n" + fails + " FAILURES");
  process.exit(fails ? 1 : 0);
})();
