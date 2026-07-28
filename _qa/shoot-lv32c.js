/* QA: landing v3.2c — getting back to the map.
   The floating back button this suite used to check was replaced in v3.2f by
   a link inside each scene's copy block (covered by shoot-lv32f.js). What
   still lives here is the part shoot-lv32f does not touch: the rail's first
   stop going ALL the way home, and the phone. */
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

  /* --- desktop: the rail's "The map" --- */
  let ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
  let p = await ctx.newPage();
  let errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
  await p.waitForTimeout(1400);

  const first = await p.evaluate(() => {
    const d = document.querySelector("#world .sw-route").firstElementChild;
    return d.querySelector(".sw-route__label").textContent.trim();
  });
  check(/map/i.test(first), "the rail's first stop is The map (" + first + ")");

  await p.evaluate(() => { WORLD.jumpToInstant(4); });
  await p.waitForTimeout(800);
  check(await p.evaluate(() => window.scrollY > 100), "parked deep in the tower");
  await p.evaluate(() => { document.querySelector("#world .sw-route").firstElementChild.click(); });
  await p.waitForTimeout(2300);
  const home = await p.evaluate(() => ({ y: window.scrollY, map: document.documentElement.classList.contains("lv3-map"), st: WORLD.stage.style.transform }));
  check(home.y === 0, "clicking it scrolls FULLY to the top, not to the dwell centre (y=" + home.y + ")");
  check(home.map, "map mode re-forms");
  check(home.st === "", "the zoom is cleaned up after the trip");
  await p.screenshot({ path: path.join(OUT, "lv32c-rail-home.png") });
  check(errs.length === 0, "desktop — no page errors" + (errs.length ? ": " + errs[0] : ""));
  await ctx.close();

  /* --- phone: the copy pills are the interface; the back link rides with them --- */
  ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  p = await ctx.newPage();
  errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
  await p.waitForTimeout(1400);
  await p.evaluate(() => { WORLD.jumpToInstant(3); });
  await p.waitForTimeout(900);
  const ph = await p.evaluate(() => {
    const c = document.querySelectorAll("#world .sw-copy")[3];
    const a = c.querySelector(".lv3-backlink");
    const r = a.getBoundingClientRect();
    return { visible: r.width > 0 && r.height > 0, h: r.height, pe: getComputedStyle(c).pointerEvents };
  });
  check(ph.visible && ph.pe === "auto", "phone: the back link is there and live inside the scene copy");
  check(ph.h >= 22, "phone: it is big enough to hit (" + ph.h.toFixed(0) + "px, inside a 44px row)");
  await p.evaluate(() => { document.querySelectorAll("#world .sw-copy")[3].querySelector(".lv3-backlink").click(); });
  await p.waitForTimeout(2300);
  check(await p.evaluate(() => window.scrollY === 0), "phone: it flies home to the map");
  await p.screenshot({ path: path.join(OUT, "lv32c-phone-home.png") });
  check(errs.length === 0, "phone — no page errors" + (errs.length ? ": " + errs[0] : ""));
  await ctx.close();

  await b.close();
  console.log(fails ? "\n" + fails + " FAILED" : "\nALL GREEN");
  process.exit(fails ? 1 : 0);
})();
