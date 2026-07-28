/* QA: landing v3.2c — getting back to the map.
   Back arrow (left) + a readable route rail + rail "The map" scrolling fully home. */
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright-core")); }
catch (e) { ({ chromium } = require("/opt/node22/lib/node_modules/playwright/index.js")); }
const BASE = process.env.BASE || "http://localhost:8123";
const OUT = __dirname;
(async () => {
  const launch = {};
  if (process.env.CHROME) launch.executablePath = process.env.CHROME;
  let b;
  try { b = await chromium.launch({ headless: true, channel: launch.executablePath ? undefined : "chrome", ...launch }); }
  catch (e) { b = await chromium.launch({ headless: true, ...launch }); }
  let fails = 0;
  const check = (ok, l) => { console.log((ok ? "PASS" : "FAIL") + "  " + l); if (!ok) fails++; };

  for (const vp of [{ width: 1920, height: 1080 }, { width: 390, height: 844, mobile: true }]) {
    const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.mobile, hasTouch: !!vp.mobile });
    const p = await ctx.newPage();
    const errs = []; p.on("pageerror", e => errs.push(e.message));
    await p.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
    await p.waitForTimeout(1400);
    const tag = vp.width + "x" + vp.height;

    const hidden = await p.evaluate(() => {
      const s = getComputedStyle(document.getElementById("lv3back"));
      return { op: parseFloat(s.opacity), pe: s.pointerEvents };
    });
    check(hidden.op < 0.05 && hidden.pe === "none", tag + " — back button hidden on the map");

    await p.evaluate(() => { WORLD.jumpToInstant(3); });
    await p.waitForTimeout(900);
    const shown = await p.evaluate(() => {
      const el = document.getElementById("lv3back");
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      return { op: parseFloat(s.opacity), pe: s.pointerEvents, h: r.height, left: r.left, mid: Math.abs(r.top + r.height / 2 - innerHeight / 2) };
    });
    check(shown.op > 0.9 && shown.pe === "auto", tag + " — back button appears inside a space");
    check(shown.h >= 44, tag + " — back button is tappable (" + shown.h.toFixed(0) + "px)");
    check(shown.left < vp.width * 0.2, tag + " — back button sits on the LEFT (" + shown.left.toFixed(0) + "px)");
    await p.screenshot({ path: path.join(OUT, "lv32c-scene-" + tag + ".png") });

    await p.click("#lv3back");
    await p.waitForTimeout(2200);
    const home = await p.evaluate(() => ({ y: window.scrollY, map: document.documentElement.classList.contains("lv3-map"),
      st: WORLD.stage.style.transform, back: parseFloat(getComputedStyle(document.getElementById("lv3back")).opacity) }));
    check(home.y === 0, tag + " — back button lands at the very top (y=" + home.y + ")");
    check(home.map, tag + " — map mode re-forms");
    check(home.st === "", tag + " — the zoom is cleaned up");
    check(home.back < 0.05, tag + " — back button hides again on the map");
    await p.screenshot({ path: path.join(OUT, "lv32c-home-" + tag + ".png") });

    if (!vp.mobile) {
      /* the rail's first stop must go all the way home, not to the dwell centre */
      await p.evaluate(() => { WORLD.jumpToInstant(4); });
      await p.waitForTimeout(700);
      const railGeo = await p.evaluate(() => {
        const r = document.querySelector("#world .sw-route");
        const lab = r.firstElementChild.querySelector(".sw-route__label");
        const s = getComputedStyle(r), ls = getComputedStyle(lab);
        return { bg: s.backgroundColor, labOp: parseFloat(ls.opacity), txt: lab.textContent };
      });
      check(railGeo.bg !== "rgba(0, 0, 0, 0)", "1920 — rail has a cream plate behind it (" + railGeo.bg + ")");
      check(railGeo.labOp > 0.9, "1920 — rail stops are named at rest (opacity " + railGeo.labOp + ")");
      check(/map/i.test(railGeo.txt), "1920 — first rail stop is The map");
      await p.evaluate(() => { document.querySelector("#world .sw-route").firstElementChild.click(); });
      await p.waitForTimeout(2300);
      const y2 = await p.evaluate(() => window.scrollY);
      check(y2 === 0, "1920 — rail 'The map' scrolls fully to the top (y=" + y2 + ")");
      await p.screenshot({ path: path.join(OUT, "lv32c-rail-home.png") });
    }
    check(errs.length === 0, tag + " — no page errors" + (errs.length ? ": " + errs[0] : ""));
    await ctx.close();
  }
  await b.close();
  console.log(fails ? "\n" + fails + " FAILED" : "\nALL GREEN");
  process.exit(fails ? 1 : 0);
})();
