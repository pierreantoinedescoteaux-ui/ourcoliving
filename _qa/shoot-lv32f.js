/* QA: landing v3.2f — the way back belongs to the SCENE LAYER.
   P-A: the rail and the back button "stay ultra visible... it's like it's on
   its own layer". They must fade with the scene's words, not float above. */
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

  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 } });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
  await p.waitForTimeout(1500);

  check(await p.evaluate(() => !document.getElementById("lv3back")), "the floating back button is gone");
  const links = await p.evaluate(() => [...document.querySelectorAll("#world .sw-copy .lv3-backlink")].length);
  check(links === 6, "every scene's copy carries a back link in the counter's slot (" + links + "/6)");
  check(await p.evaluate(() => [...document.querySelectorAll("#world .sw-copy")].slice(1)
    .every(c => !/\d\s*\/\s*\d/.test(c.querySelector(".sw-copy__num").textContent))),
  "the 01 / 07 counter is replaced in every visible scene, not doubled up");

  /* the rail must not out-shout the drawing at rest */
  const railRest = await p.evaluate(() => {
    const r = document.querySelector("#world .sw-route");
    const s = getComputedStyle(r);
    const labs = [...r.querySelectorAll(".sw-route__label")].map(l => +getComputedStyle(l).opacity);
    return { bg: s.backgroundColor, shown: labs.filter(o => o > 0.5).length, total: labs.length };
  });
  check(railRest.bg === "rgba(0, 0, 0, 0)", "the rail has no plate of its own any more (" + railRest.bg + ")");
  check(railRest.shown <= 1, "only the stop you are ON is named (" + railRest.shown + "/" + railRest.total + ")");

  /* mid-transition: the copy is dark, so the rail and the link must be too */
  const mid = await p.evaluate(() => {
    const a = WORLD.dwellCenter(2), c = WORLD.dwellCenter(3);
    window.scrollTo(0, Math.round((a + c) / 2));
    return null;
  });
  await p.waitForTimeout(700);
  const dim = await p.evaluate(() => {
    const copies = [...document.querySelectorAll("#world .sw-copy")].map(c => +c.style.opacity || 0);
    return { maxCopy: Math.max(...copies), rail: +getComputedStyle(document.querySelector("#world .sw-route")).opacity };
  });
  check(dim.maxCopy < 0.3, "mid-transition the scene words are faded (" + dim.maxCopy.toFixed(2) + ")");
  check(dim.rail < 0.45, "...and the rail fades with them instead of hanging above (" + dim.rail.toFixed(2) + ")");
  await p.screenshot({ path: path.join(OUT, "lv32f-transition.png") });

  /* at rest in a scene: both are readable again */
  await p.evaluate(() => { WORLD.jumpToInstant(3); });
  await p.waitForTimeout(900);
  const lit = await p.evaluate(() => {
    const link = document.querySelectorAll("#world .sw-copy")[3].querySelector(".lv3-backlink");
    const copy = document.querySelectorAll("#world .sw-copy")[3];
    return { copy: +copy.style.opacity, rail: +getComputedStyle(document.querySelector("#world .sw-route")).opacity,
             linkVisible: !!link && link.getBoundingClientRect().width > 0,
             pe: getComputedStyle(copy).pointerEvents };
  });
  check(lit.copy > 0.9 && lit.rail > 0.9, "resting in a scene, both are back up (copy " + lit.copy.toFixed(2) + ", rail " + lit.rail.toFixed(2) + ")");
  check(lit.linkVisible && lit.pe === "auto", "the back link is visible and clickable there");
  const rule = await p.evaluate(() => {
    const a = document.querySelectorAll("#world .sw-copy")[3].querySelector(".lv3-backlink");
    const s = getComputedStyle(a);
    return { td: s.textDecorationLine, bb: s.borderBottomStyle };
  });
  check(rule.td === "none" && rule.bb === "solid", "it is underlined ONCE — the rule, not the browser default too (" + rule.td + " + " + rule.bb + ")");
  await p.screenshot({ path: path.join(OUT, "lv32f-scene.png") });

  /* and it still works */
  await p.evaluate(() => { document.querySelectorAll("#world .sw-copy")[3].querySelector(".lv3-backlink").click(); });
  await p.waitForTimeout(2300);
  check(await p.evaluate(() => window.scrollY === 0 && document.documentElement.classList.contains("lv3-map")), "clicking it still flies home to the map");

  /* on the map the rail IS the menu — it must not be dimmed there */
  const onMap = await p.evaluate(() => +getComputedStyle(document.querySelector("#world .sw-route")).opacity);
  check(onMap > 0.9, "on the map the rail stays up (" + onMap.toFixed(2) + ")");

  /* branding: the three pages that do not use the shared nav */
  for (const [page, sel] of [["why.html", ".nav .brand"], ["hope.html", ".brand"]]) {
    await p.goto(BASE + "/" + page, { waitUntil: "load" });
    await p.waitForTimeout(900);
    const t = await p.evaluate(s => { const e = document.querySelector(s); return e ? e.textContent.trim() : "(none)"; }, sel);
    check(t === "Our Coliving", page + " logo reads Our Coliving (" + t + ")");
  }

  check(errs.length === 0, "no page errors" + (errs.length ? ": " + errs[0] : ""));
  await ctx.close(); await b.close();
  console.log(fails ? "\n" + fails + " FAILED" : "\nALL GREEN");
  process.exit(fails ? 1 : 0);
})();
