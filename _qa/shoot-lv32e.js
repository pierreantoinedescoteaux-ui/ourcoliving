/* QA: landing v3.2e — edit mode (?edit).
   The point of this suite is PERSISTENCE. P-A lost hours to a tool that said
   "Saved!" and had saved nothing (commit fe726bc), so every check here is
   "did it survive a reload", not "did the UI say so". */
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

  const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.goto(BASE + "/index.html?edit", { waitUntil: "load" });
  await p.waitForTimeout(1500);

  check(await p.evaluate(() => document.documentElement.classList.contains("lv3-edit")), "?edit turns edit mode on");
  check(await p.isVisible("#lv3edit"), "the panel is there");
  check(await p.evaluate(() => SPACES.every(s => !!s.dot)), "every space has a draggable anchor dot");
  check(await p.evaluate(() => !document.documentElement.classList.contains("lv3-edit") || getComputedStyle(SPACES[0].dot).pointerEvents === "auto"), "anchor dots take the pointer");

  /* --- drag a bubble --- */
  const before = await p.evaluate(() => SPACES.filter(s => s.key === "library")[0].label.slice());
  let box = await p.evaluate(() => {
    const r = SPACES.filter(s => s.key === "library")[0].el.getBoundingClientRect();
    return { x: r.left + 30, y: r.top + 10 };
  });
  await p.mouse.move(box.x, box.y); await p.mouse.down();
  await p.mouse.move(box.x - 160, box.y + 120, { steps: 12 });
  await p.mouse.up();
  await p.waitForTimeout(300);
  const afterDrag = await p.evaluate(() => SPACES.filter(s => s.key === "library")[0].label.slice());
  check(afterDrag[0] !== before[0] || afterDrag[1] !== before[1], "dragging a bubble moves it (" + before + " -> " + afterDrag + ")");
  check(await p.evaluate(() => window.scrollY === 0), "dragging did not navigate away");

  /* --- drag an anchor --- */
  const aBefore = await p.evaluate(() => SPACES.filter(s => s.key === "garden")[0].anchor.slice());
  const dot = await p.evaluate(() => {
    const d = SPACES.filter(s => s.key === "garden")[0].dot;
    return { x: +d.getAttribute("cx"), y: +d.getAttribute("cy") };
  });
  await p.mouse.move(dot.x, dot.y); await p.mouse.down();
  await p.mouse.move(dot.x + 90, dot.y - 70, { steps: 10 });
  await p.mouse.up();
  await p.waitForTimeout(300);
  const aAfter = await p.evaluate(() => SPACES.filter(s => s.key === "garden")[0].anchor.slice());
  check(aAfter[0] !== aBefore[0] || aAfter[1] !== aBefore[1], "dragging an anchor moves where the line points");

  /* --- retype --- */
  await p.fill("#eline", "A brand new sentence for the garden.");
  await p.evaluate(() => document.getElementById("eline").dispatchEvent(new Event("change")));
  await p.waitForTimeout(200);
  const saidSaved = await p.textContent("#esaved");
  check(/^Saved:/.test(saidSaved.trim()), "the panel confirms a save (" + saidSaved.trim() + ")");

  /* --- add a spot inside a scene --- */
  await p.evaluate(() => { WORLD.jumpToInstant(2); });
  await p.waitForTimeout(900);
  const nBefore = await p.evaluate(() => SCENE_SPOTS.filter(g => g.id === "library")[0].spots.length);
  await p.click("#eadd");
  await p.waitForTimeout(400);
  const nAfter = await p.evaluate(() => SCENE_SPOTS.filter(g => g.id === "library")[0].spots.length);
  check(nAfter === nBefore + 1, "adding a spot adds one (" + nBefore + " -> " + nAfter + ")");
  await p.fill("#ename", "The reading nets");
  await p.evaluate(() => document.getElementById("ename").dispatchEvent(new Event("change")));
  await p.waitForTimeout(250);
  await p.screenshot({ path: path.join(OUT, "lv32e-edit.png") });

  /* --- THE test: does any of it survive a reload --- */
  await p.reload({ waitUntil: "load" });
  await p.waitForTimeout(1600);
  const survived = await p.evaluate(() => {
    const lib = SPACES.filter(s => s.key === "library")[0];
    const gar = SPACES.filter(s => s.key === "garden")[0];
    const g = SCENE_SPOTS.filter(x => x.id === "library")[0];
    return { label: lib.label.slice(), anchor: gar.anchor.slice(), desc: gar.desc,
             names: g.spots.map(s => s.name), n: g.spots.length };
  });
  check(Math.abs(survived.label[0] - afterDrag[0]) < 0.001, "the moved bubble survived the reload");
  check(Math.abs(survived.anchor[0] - aAfter[0]) < 0.001, "the moved anchor survived the reload");
  check(survived.desc === "A brand new sentence for the garden.", "the retyped sentence survived the reload");
  check(survived.names.indexOf("The reading nets") > -1, "the added spot survived the reload (" + survived.names.join(", ") + ")");

  /* --- delete it again, and check THAT survives too --- */
  await p.evaluate(() => { WORLD.jumpToInstant(2); });
  await p.waitForTimeout(900);
  await p.evaluate(() => {
    const g = SCENE_SPOTS.filter(x => x.id === "library")[0];
    const sp = g.spots.filter(s => s.name === "The reading nets")[0];
    sp.el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 10, clientY: 10 }));
    window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
  });
  await p.waitForTimeout(200);
  await p.click("#edel");
  await p.waitForTimeout(300);
  await p.reload({ waitUntil: "load" });
  await p.waitForTimeout(1600);
  const gone = await p.evaluate(() => SCENE_SPOTS.filter(x => x.id === "library")[0].spots.map(s => s.name));
  check(gone.indexOf("The reading nets") < 0, "the deletion survived the reload too");

  /* --- copy button tells the truth --- */
  await p.click("#ecopy");
  await p.waitForTimeout(400);
  const copyMsg = await p.textContent("#esaved");
  const clip = await p.evaluate(() => navigator.clipboard.readText().catch(() => ""));
  check(/Copied/.test(copyMsg), "copy reports success (" + copyMsg.trim() + ")");
  check(clip.indexOf('"spaces"') > -1, "...and the clipboard really has the JSON (" + clip.length + " chars)");

  /* --- and none of this leaks into the normal page --- */
  await p.goto(BASE + "/index.html", { waitUntil: "load" });
  await p.waitForTimeout(1400);
  const clean = await p.evaluate(() => ({
    edit: document.documentElement.classList.contains("lv3-edit"),
    panel: !!document.getElementById("lv3edit"),
    dots: SPACES.filter(s => s.dot).length,
    desc: SPACES.filter(s => s.key === "garden")[0].desc
  }));
  check(!clean.edit && !clean.panel && clean.dots === 0, "the plain page has no edit mode at all");
  check(!/brand new sentence/.test(clean.desc), "and visitors never see the saved-but-unbaked edits");

  check(errs.length === 0, "no page errors" + (errs.length ? ": " + errs[0] : ""));
  await ctx.close(); await b.close();
  console.log(fails ? "\n" + fails + " FAILED" : "\nALL GREEN");
  process.exit(fails ? 1 : 0);
})();
