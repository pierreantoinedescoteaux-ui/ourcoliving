/* QA: landing v3.2b — the popup-refinement slice.
   Checks P-A's three popup complaints + the letterbox colour:
     1. an open bubble is fully ON-SCREEN (The Commons was opening off the edge)
     2. the other labels DIM while one is open
     3. hovering the sentence does not collapse the bubble
     4. map-mode letterbox bands are the tower field #F1DBC0, not page cream
   Serve first: npx http-server -p 8123 -s .   Then: node _qa/shoot-lv32b.js */
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright-core")); }
catch (e) { ({ chromium } = require("/opt/node22/lib/node_modules/playwright/index.js")); }

const BASE = process.env.BASE || "http://localhost:8123";
const OUT = __dirname;
const KEYS = ["summit", "homes", "library", "workshop", "garden", "commons"];

(async () => {
  const launch = {};
  if (process.env.CHROME) launch.executablePath = process.env.CHROME;
  let b;
  try { b = await chromium.launch({ headless: true, channel: launch.executablePath ? undefined : "chrome", ...launch }); }
  catch (e) { b = await chromium.launch({ headless: true, ...launch }); }
  let fails = 0;
  const check = (ok, label) => { console.log((ok ? "PASS" : "FAIL") + "  " + label); if (!ok) fails++; };

  for (const vp of [{ width: 1920, height: 1080 }, { width: 1440, height: 900 }, { width: 2560, height: 1080 }]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", e => errs.push(e.message));
    await p.goto(BASE + "/index.html", { waitUntil: "load" });
    await p.waitForTimeout(1500);
    const tag = vp.width + "x" + vp.height;

    /* 4. letterbox colour */
    if (vp.width >= 861) {
      const px = await p.evaluate(() => {
        const s = getComputedStyle(document.querySelector("#world .sw-stage"));
        return s.backgroundColor;
      });
      check(px === "rgb(241, 219, 192)", tag + " — map-mode stage field is #F1DBC0 (got " + px + ")");
    }

    for (const key of KEYS) {
      /* hover the label by dispatching mouseenter the way the page listens.
         The dim is a .25s transition — settle before reading opacity. */
      await p.evaluate(k => {
        SPACES.filter(s => s.key === k)[0].el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: false }));
      }, key);
      await p.waitForTimeout(340);
      const geo = await p.evaluate(k => {
        const sp = SPACES.filter(s => s.key === k)[0];
        const b = sp.el.getBoundingClientRect();
        const cs = getComputedStyle(sp.el, "::before");
        const out = { l: parseFloat(cs.left) || 0 };
        /* the plate outsets are the ::before insets (-19px etc.) */
        const others = SPACES.filter(s => s.key !== k)
          .map(s => parseFloat(getComputedStyle(s.el).opacity));
        return {
          left: b.left - 19, right: b.right + 19, top: b.top - 15, bottom: b.bottom + 18,
          vw: innerWidth, vh: innerHeight,
          hot: sp.el.classList.contains("is-hot"),
          descPE: getComputedStyle(sp.el.querySelector(".lv3-desc")).pointerEvents,
          labelPE: getComputedStyle(sp.el).pointerEvents,
          others: others
        };
      }, key);
      check(geo.hot, tag + " " + key + " — goes hot");
      const onScreen = geo.left >= 0 && geo.top >= 0 && geo.right <= geo.vw + 0.5 && geo.bottom <= geo.vh + 0.5;
      check(onScreen, tag + " " + key + " — open bubble fully on-screen (l" + geo.left.toFixed(0) +
        " r" + geo.right.toFixed(0) + "/" + geo.vw + " t" + geo.top.toFixed(0) + " b" + geo.bottom.toFixed(0) + "/" + geo.vh + ")");
      check(geo.others.every(o => o <= 0.4), tag + " " + key + " — other labels dimmed (max " + Math.max(...geo.others).toFixed(2) + ")");
      check(geo.descPE === "auto" && geo.labelPE === "auto", tag + " " + key + " — sentence is part of the hover target");
      await p.evaluate(k => {
        const sp = SPACES.filter(s => s.key === k)[0];
        sp.el.dispatchEvent(new MouseEvent("mouseleave", { bubbles: false }));
      }, key);
    }

    /* rest state must restore: every label back at full opacity + its place() spot */
    const rested = await p.evaluate(() => SPACES.every(s =>
      !s.el.classList.contains("is-hot") &&
      Math.abs((parseFloat(s.el.style.left) || 0) - s.rest[0]) < 0.6));
    check(rested, tag + " — labels return to their resting positions after hover");

    /* screenshots: rest + the two labels nearest an edge */
    await p.screenshot({ path: path.join(OUT, "lv32b-rest-" + tag + ".png") });
    for (const k of ["commons", "summit"]) {
      await p.evaluate(kk => { SPACES.filter(s => s.key === kk)[0].el.dispatchEvent(new MouseEvent("mouseenter", {})); }, k);
      await p.waitForTimeout(420);
      await p.screenshot({ path: path.join(OUT, "lv32b-" + k + "-" + tag + ".png") });
      await p.evaluate(kk => { SPACES.filter(s => s.key === kk)[0].el.dispatchEvent(new MouseEvent("mouseleave", {})); }, k);
    }

    check(errs.length === 0, tag + " — no page errors" + (errs.length ? ": " + errs[0] : ""));
    await ctx.close();
  }

  /* in-scene sub-popups: same three rules, on the library dwell */
  const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", e => errs.push(e.message));
  await p.goto(BASE + "/index.html", { waitUntil: "load" });
  await p.waitForTimeout(1200);
  await p.evaluate(() => { WORLD.jumpToInstant(2); });
  await p.waitForTimeout(900);
  await p.evaluate(() => {
    SCENE_SPOTS.filter(x => x.id === "library")[0].spots[0].el.dispatchEvent(new MouseEvent("mouseenter", {}));
  });
  await p.waitForTimeout(340);
  const sg = await p.evaluate(() => {
    const g = SCENE_SPOTS.filter(x => x.id === "library")[0];
    const sp = g.spots[0];
    const b = sp.el.getBoundingClientRect();
    return {
      hot: sp.el.classList.contains("is-hot"),
      left: b.left - 19, right: b.right + 19, top: b.top - 15, bottom: b.bottom + 18,
      vw: innerWidth, vh: innerHeight,
      others: g.spots.slice(1).map(s => parseFloat(getComputedStyle(s.el).opacity)),
      murals: g.spots.filter(s => s.name === "The murals")[0].href
    };
  });
  check(sg.hot, "scene(library) — sub-popup goes hot");
  check(sg.left >= 0 && sg.top >= 0 && sg.right <= sg.vw + 0.5 && sg.bottom <= sg.vh + 0.5, "scene(library) — sub-popup fully on-screen");
  check(sg.others.every(o => o <= 0.4), "scene(library) — sibling spots dimmed");
  check(/arts\.html$/.test(sg.murals), "scene(library) — The murals now points at arts.html (was hope.html)");
  await p.screenshot({ path: path.join(OUT, "lv32b-scene-library.png") });
  check(errs.length === 0, "scene — no page errors" + (errs.length ? ": " + errs[0] : ""));
  await ctx.close();

  await b.close();
  console.log(fails ? "\n" + fails + " FAILED" : "\nALL GREEN");
  process.exit(fails ? 1 : 0);
})();
