/* QA: landing v3.2d — the tour invitation.
   Keep scrolling against the lock -> the bubble asks; one more scroll = yes;
   the door opens into the summit; and the map never locks again after. */
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright-core")); }
catch (e) { ({ chromium } = require("/opt/node22/lib/node_modules/playwright/index.js")); }
const BASE = process.env.BASE || "http://localhost:8123";
const OUT = __dirname;
const spin = async (p, n) => { for (let i = 0; i < n; i++) { await p.mouse.wheel(0, 220); await p.waitForTimeout(240); } };
(async () => {
  const launch = {};
  if (process.env.CHROME) launch.executablePath = process.env.CHROME;
  let b;
  try { b = await chromium.launch({ headless: true, channel: launch.executablePath ? undefined : "chrome", ...launch }); }
  catch (e) { b = await chromium.launch({ headless: true, ...launch }); }
  let fails = 0;
  const check = (ok, l) => { console.log((ok ? "PASS" : "FAIL") + "  " + l); if (!ok) fails++; };
  const on = p => p.evaluate(() => document.getElementById("lv3invite").classList.contains("on"));
  const fresh = async () => {
    const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } });
    const p = await ctx.newPage();
    p.on("pageerror", e => { console.log("PAGEERROR " + e.message); fails++; });
    await p.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
    await p.waitForTimeout(1400);
    await p.mouse.move(800, 500);
    return { ctx, p };
  };

  /* 1. one flick does not summon it; sustained scrolling does */
  let { ctx, p } = await fresh();
  await spin(p, 1);
  check(!(await on(p)), "one blocked gesture — no invitation yet (just the nudge)");
  await spin(p, 2);
  check(await on(p), "kept scrolling — the invitation appears");
  await p.waitForTimeout(300);
  check(await on(p), "the summoning gesture does not immediately trigger it");
  check(await p.evaluate(() => window.scrollY === 0), "the map is still locked while it asks");
  await p.screenshot({ path: path.join(OUT, "lv32d-invite.png") });

  /* 2. Esc dismisses and buys quiet */
  await p.keyboard.press("Escape");
  await p.waitForTimeout(400);
  check(!(await on(p)), "Esc dismisses it");
  await spin(p, 4);
  check(!(await on(p)), "it stays quiet for ten seconds after a dismissal");
  await ctx.close();

  /* 3. one more scroll IS the yes — and it opens like a door */
  ({ ctx, p } = await fresh());
  await spin(p, 3);
  check(await on(p), "invitation up");
  await p.waitForTimeout(1000);
  await p.mouse.wheel(0, 220);
  await p.waitForTimeout(120);
  check(await p.evaluate(() => document.getElementById("lv3invite").classList.contains("is-opening")), "scrolling again swings the door open");
  await p.screenshot({ path: path.join(OUT, "lv32d-door.png") });
  await p.waitForTimeout(2600);
  const after = await p.evaluate(() => ({
    y: window.scrollY, tour: tourMode, taken: tourTaken,
    at: WORLD.dwellCenter(WORLD.indexOf("lookout")),
    inv: document.getElementById("lv3invite").className
  }));
  check(Math.abs(after.y - after.at) < 4, "it flies into the summit (y=" + after.y.toFixed(0) + " vs " + after.at.toFixed(0) + ")");
  check(after.tour === true, "the tour is running (scroll down now descends)");
  check(/^lv3invite\s*$/.test("lv3invite " + after.inv.replace("lv3invite", "").trim()) || !/on|is-opening/.test(after.inv), "the bubble is cleaned up (" + after.inv + ")");

  /* 4. after the tour, the map never locks again */
  await p.evaluate(() => { window.scrollTo(0, 0); syncMap(); });
  await p.waitForTimeout(700);
  const before = await p.evaluate(() => window.scrollY);
  await spin(p, 3);
  const moved = await p.evaluate(() => window.scrollY);
  check(moved > before + 40, "back at the map, scrolling now climbs instead of blocking (" + before + " -> " + moved + ")");
  await ctx.close();

  /* 5. the tour BUTTON also counts as taken */
  ({ ctx, p } = await fresh());
  await p.click("#lv3tour");
  await p.waitForTimeout(2600);
  await p.evaluate(() => { window.scrollTo(0, 0); syncMap(); });
  await p.waitForTimeout(700);
  await spin(p, 3);
  check(await p.evaluate(() => window.scrollY > 40), "the tour button also unlocks the map for good");
  check(await p.evaluate(() => tourTaken === true), "tourTaken is set by the button");
  await ctx.close();

  await b.close();
  console.log(fails ? "\n" + fails + " FAILED" : "\nALL GREEN");
  process.exit(fails ? 1 : 0);
})();
