/* QA: landing v3 — the map and the scenes on one page.
   Checks: labels + hairlines visible BEFORE any interaction, hover paints the
   highlight, clicking a space lands inside that scene's dwell (video playing,
   its copy up), the slow tour lands on the summit, phones get the stacked
   callouts, and nothing throws.

   Serve first:  npx http-server -p 8123 -s .
   Then:         node _qa/shoot-lv3.js
   CHROME env var overrides the browser path. */
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright-core")); }
catch (e) { ({ chromium } = require("/opt/node22/lib/node_modules/playwright/index.js")); }

const BASE = process.env.BASE || "http://localhost:8123";
const OUT = __dirname;

(async () => {
  const launch = {};
  if (process.env.CHROME) launch.executablePath = process.env.CHROME;
  const b = await chromium.launch({ headless: true, ...launch });
  let fails = 0;
  const check = (ok, label) => { console.log((ok ? "PASS" : "FAIL") + "  " + label); if (!ok) fails++; };
  /* Only OUR errors count. Third-party asset failures (the Fontshare webfont
     behind a corporate proxy, say) are noise, so they are reported separately
     rather than failing the run. */
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
  const noise = errs => errs.external.length ? "   (ignored " + errs.external.length + " third-party asset failures)" : "";

  /* ---------------- desktop ---------------- */
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = watch(p);
  await p.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
  await p.waitForTimeout(1800);

  /* Playwright's bundled Chromium ships without the proprietary H.264 decoder,
     so the scene clips cannot play there — index.html fails the same way. When
     the decoder is missing we verify the still poster instead of the loop. */
  const H264 = await p.evaluate(() => !!document.createElement("video").canPlayType('video/mp4; codecs="avc1.42E01E"'));
  if (!H264) console.log("NOTE  this browser has no H.264 decoder — checking scene posters instead of playback");

  const pre = await p.evaluate(() => {
    const labels = [...document.querySelectorAll(".lv3-label")];
    const leaders = [...document.querySelectorAll(".lv3-leader")];
    const vw = innerWidth, vh = innerHeight;
    const onScreen = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.top >= 0 && r.right <= vw && r.bottom <= vh; };
    return {
      count: labels.length,
      visible: labels.filter(l => getComputedStyle(l).visibility !== "hidden" && l.getBoundingClientRect().width > 0).length,
      inViewport: labels.filter(onScreen).length,
      names: labels.map(l => l.querySelector(".lv3-name").textContent.trim()),
      marks: labels.filter(l => l.querySelector(".lv3-mark svg path,.lv3-mark svg circle")).length,
      leaders: leaders.filter(l => (l.getAttribute("points") || "").split(" ").length === 3).length,
      descsHidden: labels.every(l => getComputedStyle(l.querySelector(".lv3-desc")).opacity === "0"),
      plain: document.querySelectorAll(".lv3-plain li a").length,
      mapOn: document.documentElement.classList.contains("lv3-map")
    };
  });
  check(pre.count === 6, "desktop: six spaces built (" + pre.count + ")");
  check(pre.visible === 6, "desktop: all six labels visible before any interaction (" + pre.visible + ")");
  check(pre.inViewport === 6, "desktop: no label clipped off-screen (" + pre.inViewport + " in viewport)");
  check(pre.marks === 6, "desktop: every label carries its black line-mark (" + pre.marks + ")");
  check(pre.leaders === 6, "desktop: every label has a hairline pointing into the picture (" + pre.leaders + ")");
  check(pre.descsHidden, "desktop: one-line descriptions stay hidden until hover");
  check(pre.plain === 6, "desktop: plain-words list has six real links (" + pre.plain + ")");
  check(pre.mapOn, "desktop: map mode is on at the top of the page");
  console.log("        labels: " + pre.names.join(" | "));

  /* a label sitting on top of the hero or the plain-words block is a layout bug,
     not a style choice — the hero has to stay readable and clickable */
  const collide = await p.evaluate(() => {
    const hit = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
    const chrome = [document.querySelector(".lv3-hero"), document.querySelector(".lv3-plain"), document.querySelector(".snav")]
      .filter(Boolean).map(e => ({ n: e.className || e.tagName, r: e.getBoundingClientRect() }));
    const bad = [];
    [...document.querySelectorAll(".lv3-label")].forEach(l => {
      const r = l.querySelector(".lv3-name").getBoundingClientRect();
      chrome.forEach(c => { if (hit(r, c.r)) bad.push(l.querySelector(".lv3-name").textContent.trim() + " over " + c.n); });
    });
    return bad;
  });
  check(collide.length === 0, "desktop: no label sits on the hero / plain list / nav" + (collide.length ? " -> " + collide.join(", ") : ""));
  await p.screenshot({ path: path.join(OUT, "lv3-map.png") });

  /* hover a space: label takes its accent, region highlight paints */
  const box = await p.evaluate(() => {
    const l = [...document.querySelectorAll(".lv3-label")].find(x => x.textContent.includes("Library"));
    const r = l.querySelector(".lv3-name").getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await p.mouse.move(box.x, box.y);
  await p.waitForTimeout(600);
  const hov = await p.evaluate(() => {
    const l = document.querySelector(".lv3-label.is-hot");
    return {
      hot: !!l,
      name: l ? l.querySelector(".lv3-name").textContent.trim() : "",
      accent: l ? getComputedStyle(l.querySelector(".lv3-name")).color : "",
      fxOn: getComputedStyle(document.getElementById("lv3fx")).opacity !== "0",
      holeHasPath: (document.getElementById("lv3hole").getAttribute("d") || "").length > 20,
      descShown: l ? getComputedStyle(l.querySelector(".lv3-desc")).opacity === "1" : false
    };
  });
  check(hov.hot && hov.descShown, "desktop: hover names the space + reveals its line (" + hov.name + ")");
  check(hov.accent === "rgb(43, 139, 143)", "desktop: hovered label takes the space accent (" + hov.accent + ")");
  check(hov.fxOn && hov.holeHasPath, "desktop: feathered region highlight paints");
  await p.screenshot({ path: path.join(OUT, "lv3-hover.png") });

  /* click it: we should end up inside the library dwell, same page */
  const urlBefore = p.url();
  await p.mouse.click(box.x, box.y);
  await p.waitForTimeout(2600);
  /* the destination clip is an 8 MB blob — give it room to arrive before judging */
  await p.waitForFunction(() => {
    const s = [...document.querySelectorAll(".sw-scene")].filter(x => +getComputedStyle(x).opacity > 0.5);
    return s.some(x => { const v = x.querySelector("video"); return v && !v.paused && v.readyState >= 2; });
  }, null, { timeout: 15000 }).catch(() => {});
  const landed = await p.evaluate(() => {
    const copies = [...document.querySelectorAll(".sw-copy")];
    const lit = copies.map((c, i) => ({ i, op: +getComputedStyle(c).opacity, t: (c.querySelector(".sw-copy__title") || {}).textContent }))
      .filter(c => c.op > 0.5);
    const scenes = [...document.querySelectorAll(".sw-scene")];
    const shown = scenes.filter(s => +getComputedStyle(s).opacity > 0.5);
    const vid = shown.map(s => s.querySelector("video")).filter(Boolean);
    return {
      y: Math.round(scrollY), samePage: true,
      lit: lit.map(c => c.i + ":" + c.t),
      mapOff: !document.documentElement.classList.contains("lv3-map"),
      veilClear: getComputedStyle(document.getElementById("lv3veil")).opacity === "0",
      stageClean: (document.querySelector(".sw-stage").getAttribute("style") || "").trim() === "",
      videoPlaying: vid.some(v => !v.paused && v.readyState >= 2),
      videoPresent: vid.length > 0,
      videoState: vid.map(v => "paused=" + v.paused + " ready=" + v.readyState).join(";"),
      poster: (shown.map(s => s.querySelector(".sw-scene__still")).filter(Boolean)[0] || {}).currentSrc || "",
      posterUp: shown.some(s => { const i = s.querySelector(".sw-scene__still"); return i && i.complete && i.naturalWidth > 0; })
    };
  });
  check(p.url() === urlBefore, "desktop: clicking a space does NOT navigate away (" + p.url().split("/").pop() + ")");
  check(landed.y > 0 && landed.lit.length === 1 && /library|reading/i.test(landed.lit[0]), "desktop: landed in the library dwell with its copy up -> " + landed.lit.join(","));
  check(landed.mapOff, "desktop: map mode released after arriving");
  check(landed.veilClear, "desktop: zoom veil fully lifted");
  check(landed.stageClean, "desktop: stage transform/blur cleaned up after the flight");
  if (H264) check(landed.videoPresent && landed.videoPlaying, "desktop: the destination scene's ambient loop is playing (" + (landed.videoState || "no video element") + ")");
  else check(landed.posterUp, "desktop: the destination scene is painted (no H.264 here — poster: " + landed.poster + ")");
  await p.screenshot({ path: path.join(OUT, "lv3-landed-library.png") });

  /* back to the map, then the slow tour */
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(900);
  await p.click("#lv3tour");
  await p.waitForTimeout(2600);
  const tour = await p.evaluate(() => {
    const copies = [...document.querySelectorAll(".sw-copy")];
    const lit = copies.map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(c => c.op > 0.5).map(c => c.i);
    return { lit, last: copies.length - 1, hint: document.getElementById("lv3tourhint").classList.contains("on"), y: Math.round(scrollY) };
  });
  check(tour.lit.indexOf(tour.last) > -1, "desktop: the slow tour lands on the summit (last scene) -> copies lit " + tour.lit.join(","));
  check(tour.hint, "desktop: the tour tells you to scroll up to come back down");
  await p.screenshot({ path: path.join(OUT, "lv3-tour-summit.png") });

  /* the reverse walk: scrolling up from the summit steps back through the scenes */
  await p.evaluate(() => scrollTo(0, WORLD.dwellCenter(WORLD.sections.length - 2)));
  await p.waitForTimeout(1400);
  const back = await p.evaluate(() => {
    const copies = [...document.querySelectorAll(".sw-copy")];
    return copies.map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(c => c.op > 0.4).map(c => c.i);
  });
  check(back.indexOf(tour.last - 1) > -1, "desktop: scrolling up from the summit descends into the next space down (the homes) -> copies lit " + back.join(","));
  await p.screenshot({ path: path.join(OUT, "lv3-tour-descending.png") });

  check(errs.length === 0, "desktop: 0 console/page errors" + (errs.length ? " -> " + errs.join(" | ") : noise(errs)));
  await p.close();

  /* ---------------- reduced motion ---------------- */
  const r = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const rerrs = watch(r);
  await r.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
  await r.waitForTimeout(1200);
  const rbox = await r.evaluate(() => {
    const l = [...document.querySelectorAll(".lv3-label")].find(x => x.textContent.includes("Garden"));
    const b = l.querySelector(".lv3-name").getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
  });
  await r.mouse.click(rbox.x, rbox.y);
  await r.waitForTimeout(500);
  const rjump = await r.evaluate(() => ({
    y: Math.round(scrollY),
    stageClean: (document.querySelector(".sw-stage").getAttribute("style") || "").indexOf("scale") === -1,
    lit: [...document.querySelectorAll(".sw-copy")].map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(c => c.op > 0.5).map(c => c.i)
  }));
  check(rjump.y > 0 && rjump.stageClean, "reduced motion: instant jump, no zoom (y=" + rjump.y + ")");
  check(rerrs.length === 0, "reduced motion: 0 errors" + (rerrs.length ? " -> " + rerrs.join(" | ") : noise(rerrs)));
  await r.screenshot({ path: path.join(OUT, "lv3-reduced.png") });
  await r.close();

  /* ---------------- phone ---------------- */
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const merrs = watch(m);
  await m.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
  await m.waitForTimeout(1800);
  const phone = await m.evaluate(() => {
    const rows = [...document.querySelectorAll(".lv3-row")];
    const vh = innerHeight;
    return {
      rows: rows.length,
      visible: rows.filter(x => x.getBoundingClientRect().width > 0).length,
      onScreen: rows.filter(x => { const r = x.getBoundingClientRect(); return r.top >= 0 && r.bottom <= vh; }).length,
      labelsHidden: getComputedStyle(document.querySelector(".lv3-labels")).display === "none",
      heroUp: document.querySelector(".lv3-hero h1").getBoundingClientRect().width > 0
    };
  });
  check(phone.rows === 6 && phone.visible === 6, "phone: six stacked callouts, always visible (" + phone.visible + ")");
  check(phone.onScreen === 6, "phone: all six fit on screen without scrolling (" + phone.onScreen + ")");
  check(phone.labelsHidden, "phone: the desktop image labels are off (portrait clip is a different crop)");
  check(phone.heroUp, "phone: hero copy is up");
  await m.screenshot({ path: path.join(OUT, "lv3-phone.png") });

  await m.tap(".lv3-row");
  await m.waitForTimeout(2800);
  const mland = await m.evaluate(() => ({
    y: Math.round(scrollY),
    lit: [...document.querySelectorAll(".sw-copy")].map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(c => c.op > 0.5).map(c => c.i),
    mapOff: !document.documentElement.classList.contains("lv3-map")
  }));
  check(mland.y > 0 && mland.lit.length === 1 && mland.mapOff, "phone: tapping a callout lands in that scene's dwell -> copy " + mland.lit.join(","));
  await m.screenshot({ path: path.join(OUT, "lv3-phone-landed.png") });
  check(merrs.length === 0, "phone: 0 errors" + (merrs.length ? " -> " + merrs.join(" | ") : noise(merrs)));
  await m.close();

  /* ---------------- viewport sweep: labels must never fall off ---------------- */
  for (const vp of [{ width: 1280, height: 800 }, { width: 1920, height: 1080 }, { width: 2560, height: 1080 }, { width: 1024, height: 1366 }]) {
    const s = await b.newPage({ viewport: vp });
    const serrs = watch(s);
    await s.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
    await s.waitForTimeout(1500);
    const fit = await s.evaluate(() => {
      const sel = getComputedStyle(document.querySelector(".lv3-labels")).display === "none" ? ".lv3-row" : ".lv3-label";
      const els = [...document.querySelectorAll(sel)];
      return { sel, total: els.length, ok: els.filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1; }).length };
    });
    check(fit.ok === fit.total && fit.total === 6, vp.width + "x" + vp.height + ": all six doors on screen (" + fit.ok + "/" + fit.total + " " + fit.sel + ")");
    check(serrs.length === 0, vp.width + "x" + vp.height + ": 0 errors" + (serrs.length ? " -> " + serrs.join(" | ") : noise(serrs)));
    await s.screenshot({ path: path.join(OUT, "lv3-" + vp.width + "x" + vp.height + ".png") });
    await s.close();
  }

  /* ---------------- every door actually resolves ---------------- */
  const l = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await l.goto(BASE + "/landing-v3.html", { waitUntil: "load" });
  await l.waitForTimeout(1200);
  const hrefs = await l.evaluate(() => [...new Set([...document.querySelectorAll(".lv3-label,.lv3-row,.lv3-plain a,.sw-copy__tags a,.sw-btn")].map(a => a.getAttribute("href")))]);
  const assets = await l.evaluate(() => [...new Set([...document.querySelectorAll(".sw-scene__still")].map(i => i.getAttribute("src")).filter(Boolean))]);
  let bad = [];
  for (const h of hrefs.concat(assets)) {
    if (!h || h.startsWith("mailto:") || h.startsWith("#")) continue;
    const res = await l.request.get(BASE + "/" + h.split("#")[0]);
    if (!res.ok()) bad.push(h + " -> " + res.status());
  }
  check(bad.length === 0, "links & scene stills all resolve" + (bad.length ? " -> " + bad.join(", ") : " (" + (hrefs.length + assets.length) + " checked)"));
  const clips = await l.evaluate(() => {
    const cfg = [...document.scripts].map(s => s.textContent).join("");
    return [...new Set((cfg.match(/assets\/tower\/vid\/[a-z0-9\-]+\.mp4/g) || []))];
  });
  let badClips = [];
  for (const c of clips) { const res = await l.request.get(BASE + "/" + c); if (!res.ok()) badClips.push(c + " -> " + res.status()); }
  check(badClips.length === 0, "all " + clips.length + " scene/connector clips resolve" + (badClips.length ? " -> " + badClips.join(", ") : ""));
  await l.close();

  await b.close();
  console.log(fails === 0 ? "\nALL GREEN" : "\n" + fails + " FAILURES");
  process.exit(fails ? 1 : 0);
})();
