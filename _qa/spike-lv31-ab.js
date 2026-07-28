/* QA spike: landing v3.1 — Slices A+B.
   Verifies: contain-fit S1 (full tower), bigger sizing, always-on category
   colours, chip legend, MAP SCROLL LOCK, and the INVERTED tour (scroll-down
   descends). Extends the shoot-lv3.js patterns; does NOT touch shoot-lv3.js.

   Serve first:  npx http-server -p 8123 -s .
   Then:         node _qa/spike-lv31-ab.js
   CHROME env var overrides the browser path. */
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright-core")); }
catch (e) { ({ chromium } = require("/opt/node22/lib/node_modules/playwright/index.js")); }

const BASE = process.env.BASE || "http://localhost:8123";
const OUT = __dirname;
const CATS = ["rgb(43, 139, 143)", "rgb(208, 138, 46)", "rgb(62, 125, 176)", "rgb(179, 84, 62)", "rgb(60, 107, 50)"];

(async () => {
  const launch = {};
  if (process.env.CHROME) launch.executablePath = process.env.CHROME;
  const b = await chromium.launch({ headless: true, ...launch });
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

  /* ---------- A1: contain-fit full tower across desktop widths ---------- */
  for (const vp of [{ width: 1280, height: 800 }, { width: 1920, height: 1080 }, { width: 2560, height: 1080 }]) {
    const s = await b.newPage({ viewport: vp });
    const serrs = watch(s);
    await s.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
    await s.waitForTimeout(1400);
    const r = await s.evaluate(() => {
      const sc = document.querySelector("#world .sw-stage .sw-scene");
      const still = sc && sc.querySelector(".sw-scene__still");
      const vid = sc && sc.querySelector(".sw-scene__video");
      const cs = still && getComputedStyle(still);
      const ir = still && still.getBoundingClientRect();
      return {
        fit: cs && cs.objectFit,
        vidFit: vid ? getComputedStyle(vid).objectFit : "(no video yet)",
        transform: cs && cs.transform,
        // contain letterboxes: the rendered image cannot fill BOTH dims unless aspect matches
        imgW: ir && Math.round(ir.width), imgH: ir && Math.round(ir.height),
        vw: innerWidth, vh: innerHeight,
        labels: document.querySelectorAll(".lv3-label").length,
        mapOn: document.documentElement.classList.contains("lv3-map")
      };
    });
    check(r.fit === "contain", vp.width + "x" + vp.height + ": S1 still is contain-fit (" + r.fit + ")");
    check(r.transform === "none", vp.width + "x" + vp.height + ": S1 poster push-transform neutralised (" + r.transform + ")");
    check(r.labels === 6 && r.mapOn, vp.width + "x" + vp.height + ": 6 labels + map on");
    check(serrs.length === 0, vp.width + "x" + vp.height + ": 0 errors" + (serrs.length ? " -> " + serrs.join(" | ") : noise(serrs)));
    await s.screenshot({ path: path.join(OUT, "lv31-a-" + vp.width + "x" + vp.height + ".png") });
    await s.close();
  }

  /* ---------- main desktop pass: colours, chips, debug, lock, tour ---------- */
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = watch(p);
  await p.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
  await p.waitForTimeout(1600);
  const H264 = await p.evaluate(() => !!document.createElement("video").canPlayType('video/mp4; codecs="avc1.42E01E"'));
  if (!H264) console.log("NOTE  no H.264 decoder here — checking posters, not playback (index.html fails the same way)");

  /* A3 — category colour applied AT REST (not just hover) */
  const rest = await p.evaluate(() => {
    const labels = [...document.querySelectorAll(".lv3-label")];
    const leaders = [...document.querySelectorAll(".lv3-leader")];
    return {
      names: labels.map(l => getComputedStyle(l.querySelector(".lv3-name")).color),
      leaderStrokes: leaders.map(l => getComputedStyle(l).stroke),
      chips: document.querySelectorAll(".lv3-chip").length,
      chipDots: [...document.querySelectorAll(".lv3-chip i")].map(i => getComputedStyle(i).backgroundColor)
    };
  });
  check(rest.names.every(c => c !== "rgb(34, 48, 31)"), "rest: label names are category-toned, not raw ink -> " + rest.names.join(","));
  check(rest.leaderStrokes.every(s => CATS.indexOf(s) > -1), "rest: every leader carries a category colour -> " + rest.leaderStrokes.join(","));
  check(rest.chips === 5, "A4: five legend chips render (" + rest.chips + ")");
  check(rest.chipDots.every(c => CATS.indexOf(c) > -1) && rest.chipDots.length === 5, "A4: each chip dot is a category colour -> " + rest.chipDots.join(","));

  /* no label sits on the hero / plain list / nav (collision guard, as shoot-lv3) */
  const collide = await p.evaluate(() => {
    const hit = (a, c) => !(a.right <= c.left || a.left >= c.right || a.bottom <= c.top || a.top >= c.bottom);
    const chrome = [document.querySelector(".lv3-hero"), document.querySelector(".lv3-plain"), document.querySelector(".snav")]
      .filter(Boolean).map(e => ({ n: e.className || e.tagName, r: e.getBoundingClientRect() }));
    const bad = [];
    [...document.querySelectorAll(".lv3-label")].forEach(l => {
      const r = l.querySelector(".lv3-name").getBoundingClientRect();
      chrome.forEach(c => { if (hit(r, c.r)) bad.push(l.querySelector(".lv3-name").textContent.trim() + " over " + c.n); });
    });
    return bad;
  });
  check(collide.length === 0, "desktop: no label sits on hero / plain list / nav" + (collide.length ? " -> " + collide.join(", ") : ""));
  await p.screenshot({ path: path.join(OUT, "lv31-a-map-1440.png") });

  /* A5 — map scroll lock: a wheel at the top must NOT move the page */
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(300);
  await p.mouse.move(720, 450);
  await p.mouse.wheel(0, 600);
  const nudged = await p.evaluate(() => document.getElementById("mapmode").classList.contains("is-nudge"));
  await p.mouse.wheel(0, 600);
  await p.waitForTimeout(200);
  const lock = await p.evaluate(() => ({ y: Math.round(scrollY), mapOn: document.documentElement.classList.contains("lv3-map") }));
  check(lock.y === 0 && lock.mapOn, "A5: scrolling does NOT leave the map (scrollY=" + lock.y + ", mapOn=" + lock.mapOn + ")");
  check(nudged, "A5: a blocked scroll fires the map nudge feedback");

  /* B1 — inverted tour: land on summit, then scroll DOWN to DESCEND */
  await p.click("#lv3tour");
  await p.waitForTimeout(2600);
  const atSummit = await p.evaluate(() => {
    const copies = [...document.querySelectorAll(".sw-copy")];
    const lit = copies.map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(c => c.op > 0.5).map(c => c.i);
    return { lit, last: copies.length - 1, y: Math.round(scrollY), hint: document.getElementById("lv3tourhint").textContent };
  });
  check(atSummit.lit.indexOf(atSummit.last) > -1, "B1: tour lands on the summit (last scene) -> lit " + atSummit.lit.join(","));
  check(/scroll down/i.test(atSummit.hint), "B1: hint tells the visitor to scroll DOWN to descend -> \"" + atSummit.hint + "\"");
  await p.screenshot({ path: path.join(OUT, "lv31-b-summit.png") });

  /* three scroll-DOWN gestures = descent; scrollY must DECREASE, index must DROP */
  const yStart = await p.evaluate(() => Math.round(scrollY));
  let idxStart = Math.max.apply(null, atSummit.lit);
  const marks = [];
  for (let k = 1; k <= 3; k++) {
    for (let j = 0; j < 6; j++) { await p.mouse.wheel(0, 500); await p.waitForTimeout(40); }
    await p.waitForTimeout(700);
    const st = await p.evaluate(() => {
      const lit = [...document.querySelectorAll(".sw-copy")].map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(c => c.op > 0.4).map(c => c.i);
      return { y: Math.round(scrollY), lit, maxIdx: lit.length ? Math.max.apply(null, lit) : -1 };
    });
    marks.push(st);
    await p.screenshot({ path: path.join(OUT, "lv31-b-descent" + k + ".png") });
  }
  const descended = marks[marks.length - 1].y < yStart;
  const idxDropped = marks[marks.length - 1].maxIdx < idxStart;
  check(descended, "B1: scroll-DOWN descends the tower — scrollY decreased " + yStart + " -> " + marks.map(m => m.y).join(" -> "));
  check(idxDropped, "B1: descent steps to lower scenes — top lit index " + idxStart + " -> " + marks.map(m => m.maxIdx).join(" -> "));

  /* keep descending to the ground: tour ends, map + lock re-engage */
  for (let j = 0; j < 60; j++) { await p.mouse.wheel(0, 700); await p.waitForTimeout(15); }
  await p.waitForTimeout(900);
  const ended = await p.evaluate(() => ({ y: Math.round(scrollY), mapOn: document.documentElement.classList.contains("lv3-map") }));
  await p.mouse.wheel(0, 600);
  await p.waitForTimeout(200);
  const relocked = await p.evaluate(() => Math.round(scrollY));
  check(ended.mapOn && ended.y <= 4, "B1: descent ends back at the map (scrollY=" + ended.y + ", mapOn=" + ended.mapOn + ")");
  check(relocked <= 4, "B1: the map lock re-engages after the tour (scrollY=" + relocked + ")");
  await p.screenshot({ path: path.join(OUT, "lv31-b-ended-map.png") });
  check(errs.length === 0, "desktop: 0 console/page errors" + (errs.length ? " -> " + errs.join(" | ") : noise(errs)));
  await p.close();

  /* ---------- ?debug alignment screenshot ---------- */
  const d = await b.newPage({ viewport: { width: 1440, height: 900 } });
  watch(d);
  await d.goto(BASE + "/landing-v3.html?debug", { waitUntil: "load" });
  await d.waitForTimeout(1600);
  await d.screenshot({ path: path.join(OUT, "lv31-a-debug.png") });
  await d.close();

  /* ---------- phone: coloured stacked rows, tap enters scene ---------- */
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const merrs = watch(m);
  await m.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
  await m.waitForTimeout(1800);
  const phone = await m.evaluate(() => {
    const rows = [...document.querySelectorAll(".lv3-row")];
    const vh = innerHeight;
    return {
      rows: rows.length,
      onScreen: rows.filter(x => { const r = x.getBoundingClientRect(); return r.top >= 0 && r.bottom <= vh; }).length,
      borderCols: rows.map(x => getComputedStyle(x).borderLeftColor),
      markCols: rows.map(x => getComputedStyle(x.querySelector(".lv3-mark svg")).color)
    };
  });
  const catphone = ["rgb(43, 139, 143)", "rgb(208, 138, 46)", "rgb(62, 125, 176)", "rgb(179, 84, 62)", "rgb(60, 107, 50)"];
  check(phone.rows === 6 && phone.onScreen === 6, "phone: six stacked callouts, all on screen (" + phone.onScreen + ")");
  check(phone.borderCols.every(c => catphone.indexOf(c) > -1), "phone: each row shows its category colour (left border) -> " + phone.borderCols.join(","));
  await m.screenshot({ path: path.join(OUT, "lv31-phone.png") });
  await m.tap(".lv3-row");
  await m.waitForTimeout(2800);
  const mland = await m.evaluate(() => ({
    y: Math.round(scrollY),
    lit: [...document.querySelectorAll(".sw-copy")].map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(c => c.op > 0.5).map(c => c.i),
    mapOff: !document.documentElement.classList.contains("lv3-map")
  }));
  check(mland.y > 0 && mland.lit.length === 1 && mland.mapOff, "phone: tapping a callout still enters that scene -> copy " + mland.lit.join(","));
  check(merrs.length === 0, "phone: 0 errors" + (merrs.length ? " -> " + merrs.join(" | ") : noise(merrs)));
  await m.screenshot({ path: path.join(OUT, "lv31-phone-landed.png") });
  await m.close();

  await b.close();
  console.log(fails === 0 ? "\nALL GREEN" : "\n" + fails + " FAILURES");
  process.exit(fails ? 1 : 0);
})();
