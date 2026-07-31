/* QA: landing v3.1 — the CONSOLIDATED suite. Canonical entry point for the
   map + scene-world on one page, after three build slices on top of the
   original v3 (see git log: "v3.1 slice D", "slices A+B", "slice C").

   Model as of v3.1 (do not regress to the v3 assumptions):
   · Map (S1) is CONTAIN-fit — the whole tower shows, letterboxed into the
     cream field. (v3 was cover-fit, cropped.)
   · Map mode SCROLL-LOCKS the page. The only exits are clicking a space or
     taking the tour. A blocked scroll nudges the map + pulses the tour button.
   · The slow tour lands on the summit, then INVERTS scroll: wheel/key DOWN
     DESCENDS the tower (scrollY heads to 0). Programmatic scrollTo still
     works the old way — only real input is inverted while tourMode is on.
   · Labels are category-toned AT REST, not just on hover. A 5-chip legend
     names the categories.
   · Every dwell (S2-S7) gets in-scene hotspots (map's own visual language)
     desktop-only (>=861px); phones keep the tag pills as the interface.
   · Three new pages (networks/how-to/community.html) + "Our Coliving" rebrand.

   Serve first:  npx http-server -p 8123 -s .
   Then:         node _qa/shoot-lv3.js
   Debug shots:  node _qa/shoot-lv3.js debug
   CHROME env var overrides the browser path (needed for H.264 + webfonts —
   Playwright's bundled Chromium ships without either). */
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright-core")); }
catch (e) { ({ chromium } = require("/opt/node22/lib/node_modules/playwright/index.js")); }

const BASE = process.env.BASE || "http://localhost:8123";
const OUT = __dirname;
const DEBUG_ONLY = process.argv[2] === "debug";
const CATS = ["rgb(43, 139, 143)", "rgb(208, 138, 46)", "rgb(62, 125, 176)", "rgb(179, 84, 62)", "rgb(60, 107, 50)"];
const SCENES = [
  { id: "commons", index: 1, spots: 3 },
  { id: "library", index: 2, spots: 4 },
  { id: "makers",  index: 3, spots: 3 },
  { id: "gardens", index: 4, spots: 2 },
  { id: "homes",   index: 5, spots: 3 },
  { id: "lookout", index: 6, spots: 3 }
];
const PILL_COUNTS = [3, 4, 3, 2, 3, 3];
const NEW_PAGES = ["networks.html", "how-to.html", "community.html"];

(async () => {
  const launch = {};
  if (process.env.CHROME) launch.executablePath = process.env.CHROME;
  let b;
  try { b = await chromium.launch({ headless: true, channel: launch.executablePath ? undefined : "chrome", ...launch }); }
  catch (e) { b = await chromium.launch({ headless: true, ...launch }); }
  let fails = 0;
  const check = (ok, label) => { console.log((ok ? "PASS" : "FAIL") + "  " + label); if (!ok) fails++; };
  /* Only OUR errors count. Third-party asset failures (the Fontshare webfont
     behind a corporate proxy, say) are noise, so they are reported separately
     rather than failing the run. */
  const watch = p => {
    const errs = [], ext = [];
    const mine = u => !u || u.indexOf(BASE) === 0;
    const BENIGN = /The play\(\) request was interrupted/;   /* loop paused mid-play as it scrolls out — harmless */
    p.on("pageerror", e => { (BENIGN.test(e.message) ? ext : errs).push(e.message); });
    p.on("console", m => {
      if (m.type() !== "error") return;
      const u = (m.location() && m.location().url) || "";
      (mine(u) && !BENIGN.test(m.text()) ? errs : ext).push(m.text() + (u ? " [" + u + "]" : ""));
    });
    p.on("requestfailed", r => { if (!mine(r.url())) ext.push(r.url()); });
    errs.external = ext;
    return errs;
  };
  const noise = errs => errs.external.length ? "   (ignored " + errs.external.length + " third-party asset failures)" : "";
  const jump = (p, i) => p.evaluate(k => { WORLD.jumpToInstant(k); }, i);

  /* ---------------- debug-mode: calibration screenshots only ---------------- */
  if (DEBUG_ONLY) {
    const d = await b.newPage({ viewport: { width: 1440, height: 900 } });
    watch(d);
    await d.goto(BASE + "/index.html?debug", { waitUntil: "load" });
    await d.waitForTimeout(1600);
    await d.screenshot({ path: path.join(OUT, "lv31-final-debug-map.png") });
    for (const sc of SCENES) {
      await jump(d, sc.index);
      await d.waitForTimeout(700);
      await d.screenshot({ path: path.join(OUT, "lv31-final-debug-" + sc.id + ".png") });
    }
    await d.close(); await b.close();
    return;
  }

  /* ================= 1. contain-fit letterbox math (A1, hardened) ================= */
  for (const vp of [{ width: 1280, height: 800 }, { width: 1920, height: 1080 }, { width: 2560, height: 1080 }, { width: 1024, height: 1366 }]) {
    const s = await b.newPage({ viewport: vp });
    const serrs = watch(s);
    await s.goto(BASE + "/index.html", { waitUntil: "load" });
    await s.waitForTimeout(1400);
    const r = await s.evaluate(() => {
      const sc = document.querySelector("#world .sw-stage .sw-scene");
      const still = sc && sc.querySelector(".sw-scene__still");
      const cs = still && getComputedStyle(still);
      const f = window.frame ? window.frame() : null;
      return {
        fit: cs && cs.objectFit,
        transform: cs && cs.transform,
        frame: f,
        vw: innerWidth, vh: innerHeight,
        labels: document.querySelectorAll("#lv3labels .lv3-label").length,
        mapOn: document.documentElement.classList.contains("lv3-map")
      };
    });
    const IMG_W = 1600, IMG_H = 900;
    const expSc = Math.min(vp.width / IMG_W, vp.height / IMG_H);
    const expW = IMG_W * expSc, expH = IMG_H * expSc;
    const expX = (vp.width - expW) / 2, expY = (vp.height - expH) / 2;
    const f = r.frame || {};
    const mathOk = f && Math.abs(f.w - expW) < 1 && Math.abs(f.h - expH) < 1 &&
      Math.abs(f.x - expX) < 1 && Math.abs(f.y - expY) < 1;
    /* "letterboxes" only means something when the viewport's aspect differs
       from the image's 16:9 — at an exact 16:9 viewport (e.g. 1920x1080)
       contain and cover coincide and neither axis pads, which is correct.
       The real regression guard is "never overflows" (no crop). */
    const noOverflow = f && Math.round(f.w) <= vp.width + 1 && Math.round(f.h) <= vp.height + 1;
    check(r.fit === "contain", vp.width + "x" + vp.height + ": S1 still is contain-fit (" + r.fit + ")");
    check(r.transform === "none", vp.width + "x" + vp.height + ": S1 poster push-transform neutralised (" + r.transform + ")");
    check(mathOk, vp.width + "x" + vp.height + ": letterbox math matches min(vw/1600,vh/900) -> got " + JSON.stringify(f) + " want w=" + expW.toFixed(1) + " h=" + expH.toFixed(1) + " x=" + expX.toFixed(1) + " y=" + expY.toFixed(1));
    check(noOverflow, vp.width + "x" + vp.height + ": image never overflows the viewport (full tower visible, not cropped) -> " + JSON.stringify(f));
    check(r.labels === 6 && r.mapOn, vp.width + "x" + vp.height + ": 6 map labels + map on (" + r.labels + ")");
    check(serrs.length === 0, vp.width + "x" + vp.height + ": 0 errors" + (serrs.length ? " -> " + serrs.join(" | ") : noise(serrs)));

    /* spot anchors + labels stay in frame at every viewport (regression guard) */
    for (const sc of SCENES) {
      await jump(s, sc.index);
      await s.waitForTimeout(550);
      const sp = await s.evaluate((idx) => {
        const g = SCENE_SPOTS.filter(x => x.index === idx)[0];
        const f2 = sceneFrame(idx);
        const badAnchor = [], offLabel = [];
        g.spots.forEach(function (sp2) {
          /* assert the RENDERED leader endpoint (placeSpots clamps raw anchors
             into the visible crop on tall viewports) — not the raw projection */
          const pts = (sp2.leader.getAttribute("points") || "").trim().split(" ");
          const last = pts[pts.length - 1].split(",");
          const ax = parseFloat(last[0]), ay = parseFloat(last[1]);
          if (!(ax >= 0 && ax <= innerWidth && ay >= 0 && ay <= innerHeight)) badAnchor.push(sp2.name);
          /* measure the VISIBLE pill, like the map's labels: the sentence sits
             in flow beneath it but is hidden until hover, and hover pulls the
             whole bubble back on-screen (fitHot, checked in shoot-lv32b.js).
             P-A parks some spots low on purpose. */
          const lr = sp2.nameEl.getBoundingClientRect();
          if (lr.left < 0 || lr.top < 0 || lr.right > innerWidth || lr.bottom > innerHeight) offLabel.push(sp2.name);
        });
        return { badAnchor, offLabel };
      }, sc.index);
      check(sp.badAnchor.length === 0, vp.width + "x" + vp.height + " " + sc.id + ": spot anchors in frame" + (sp.badAnchor.length ? " -> " + sp.badAnchor.join(",") : ""));
      check(sp.offLabel.length === 0, vp.width + "x" + vp.height + " " + sc.id + ": spot labels on screen" + (sp.offLabel.length ? " -> " + sp.offLabel.join(",") : ""));
    }
    await s.screenshot({ path: path.join(OUT, "lv3-" + vp.width + "x" + vp.height + ".png") });
    await s.close();
  }

  /* ================= 2. main desktop pass: 1440x900 ================= */
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = watch(p);
  await p.goto(BASE + "/index.html", { waitUntil: "load" });
  await p.waitForTimeout(1800);

  /* Playwright's bundled Chromium ships without the proprietary H.264 decoder,
     so the scene clips cannot play there — index.html fails the same way. When
     the decoder is missing we verify the still poster instead of the loop. */
  const H264 = await p.evaluate(() => !!document.createElement("video").canPlayType('video/mp4; codecs="avc1.42E01E"'));
  if (!H264) console.log("NOTE  this browser has no H.264 decoder — checking scene posters instead of playback (index.html fails identically)");

  const pre = await p.evaluate(() => {
    const labels = [...document.querySelectorAll("#lv3labels .lv3-label")];
    const leaders = [...document.querySelectorAll("#lv3lines .lv3-leader")];
    const vw = innerWidth, vh = innerHeight;
    const onScreen = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.top >= 0 && r.right <= vw && r.bottom <= vh; };
    return {
      count: labels.length,
      visible: labels.filter(l => getComputedStyle(l).visibility !== "hidden" && l.getBoundingClientRect().width > 0).length,
      /* at rest only the NAME PILL is visible -- the sentence is in flow but
         hidden, so a label whose invisible box hangs past the edge is fine.
         P-A parks The Commons on the cream at the bottom-right on purpose.
         The full bubble staying on-screen ON HOVER is checked in
         _qa/shoot-lv32b.js, which is where that rule now lives. */
      inViewport: labels.filter(l => onScreen(l.querySelector(".lv3-name"))).length,
      names: labels.map(l => l.querySelector(".lv3-name").textContent.trim()),
      marks: labels.filter(l => l.querySelector(".lv3-mark svg path,.lv3-mark svg circle")).length,
      leaders: leaders.filter(l => (l.getAttribute("points") || "").split(" ").length === 3).length,
      descsHidden: labels.every(l => getComputedStyle(l.querySelector(".lv3-desc")).opacity === "0"),
      plain: document.querySelectorAll(".lv3-plain li a").length,
      mapOn: document.documentElement.classList.contains("lv3-map")
    };
  });
  check(pre.count === 6, "desktop: six map spaces built (" + pre.count + ")");
  check(pre.visible === 6, "desktop: all six labels visible before any interaction (" + pre.visible + ")");
  check(pre.inViewport === 6, "desktop: no label clipped off-screen (" + pre.inViewport + " in viewport)");
  check(pre.marks === 6, "desktop: every label carries its line-mark (" + pre.marks + ")");
  check(pre.leaders === 6, "desktop: every label has a hairline pointing into the picture (" + pre.leaders + ")");
  check(pre.descsHidden, "desktop: one-line descriptions stay hidden until hover");
  check(pre.plain === 6, "desktop: plain-words list has six real links (" + pre.plain + ")");
  check(pre.mapOn, "desktop: map mode is on at the top of the page");
  console.log("        labels: " + pre.names.join(" | "));

  /* A3 — category colour applied AT REST (not just hover) */
  const rest = await p.evaluate(() => {
    const labels = [...document.querySelectorAll("#lv3labels .lv3-label")];
    const leaders = [...document.querySelectorAll("#lv3lines .lv3-leader")];
    return {
      names: labels.map(l => getComputedStyle(l.querySelector(".lv3-name")).color),
      leaderStrokes: leaders.map(l => getComputedStyle(l).stroke),
      chips: document.querySelectorAll(".lv3-chip").length,
      chipDots: [...document.querySelectorAll(".lv3-chip i")].map(i => getComputedStyle(i).backgroundColor)
    };
  });
  check(rest.names.every(c => c !== "rgb(34, 48, 31)"), "rest: label names are category-toned, not raw ink");
  check(rest.leaderStrokes.every(s => CATS.indexOf(s) > -1), "rest: every leader carries a category colour -> " + rest.leaderStrokes.join(","));
  check(rest.chips === 5, "A4: five legend chips render (" + rest.chips + ")");
  check(rest.chipDots.length === 5 && rest.chipDots.every(c => CATS.indexOf(c) > -1), "A4: each chip dot is a category colour -> " + rest.chipDots.join(","));
  check(rest.chipDots.filter(c => c === "rgb(43, 139, 143)").length === 1 &&
    rest.chipDots.indexOf("rgb(208, 138, 46)") > -1 && rest.chipDots.indexOf("rgb(62, 125, 176)") > -1 &&
    rest.chipDots.indexOf("rgb(179, 84, 62)") > -1 && rest.chipDots.indexOf("rgb(60, 107, 50)") > -1,
    "A4: legend covers teal/amber/blue/terracotta/green exactly once each -> " + rest.chipDots.join(","));
  /* teal (#2b8b8f) is reused across TWO space accents (library + workshop) even
     though the legend shows it once — confirm that space-level reuse holds */
  const tealSpaces = await p.evaluate(() => [...document.querySelectorAll("#lv3labels .lv3-label")]
    .filter(l => getComputedStyle(l.querySelector(".lv3-mark svg")).color === "rgb(43, 139, 143)" || true)
    .map(l => ({ n: l.querySelector(".lv3-name").textContent.trim(), c: getComputedStyle(l.querySelector(".lv3-leader, .lv3-name")).color })));
  const tealLeaderCount = rest.leaderStrokes.filter(s => s === "rgb(43, 139, 143)").length;
  check(tealLeaderCount === 2, "teal (#2b8b8f) is used by two map spaces (Library + Workshop) -> " + tealLeaderCount + " leaders");

  /* no label sits on the hero / plain list / nav */
  const collide = await p.evaluate(() => {
    const hit = (a, c) => !(a.right <= c.left || a.left >= c.right || a.bottom <= c.top || a.top >= c.bottom);
    const chrome = [document.querySelector(".lv3-hero"), document.querySelector(".lv3-plain"), document.querySelector(".snav")]
      .filter(Boolean).map(e => ({ n: e.className || e.tagName, r: e.getBoundingClientRect() }));
    const bad = [];
    [...document.querySelectorAll("#lv3labels .lv3-label")].forEach(l => {
      const r = l.querySelector(".lv3-name").getBoundingClientRect();
      chrome.forEach(c => { if (hit(r, c.r)) bad.push(l.querySelector(".lv3-name").textContent.trim() + " over " + c.n); });
    });
    return bad;
  });
  check(collide.length === 0, "desktop: no label sits on the hero / plain list / nav" + (collide.length ? " -> " + collide.join(", ") : ""));
  await p.screenshot({ path: path.join(OUT, "lv31-final-map-1440.png") });

  /* phantom-pill guard (Slice C regression the builder flagged): the engine's
     CSS re-enables pointer-events on every copy's tags/CTA, even faded-out
     ones, so an invisible scene's pill could sit on top of the visible one
     and eat the tap. The page CSS overrides that to `inherit` so each pill
     follows its own article's lit/dark pointer state. getComputedStyle()
     resolves "inherit" to the actual inherited value (never the literal
     keyword), so the only reliable regression guard is the source rule
     itself — confirmed functionally by the phone pill-tap-navigates test
     and the "no spot label sits on scene copy" checks elsewhere in this file. */
  const phantomSrc = await p.evaluate(() => document.documentElement.outerHTML)
    .then(html => /#world \.sw-copy__tags,\s*#world \.sw-copy__cta\s*\{\s*pointer-events:\s*inherit;?\s*\}/.test(html));
  check(phantomSrc, "phantom-pill guard: #world .sw-copy__tags/.sw-copy__cta {pointer-events:inherit} rule intact in source");

  /* hover a space: label takes its accent, region highlight paints */
  const box = await p.evaluate(() => {
    const l = [...document.querySelectorAll("#lv3labels .lv3-label")].find(x => x.textContent.includes("Library"));
    const r = l.querySelector(".lv3-name").getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await p.mouse.move(box.x, box.y);
  await p.waitForTimeout(600);
  const hov = await p.evaluate(() => {
    const l = document.querySelector("#lv3labels .lv3-label.is-hot");
    return {
      hot: !!l,
      name: l ? l.querySelector(".lv3-name").textContent.trim() : "",
      accent: l ? getComputedStyle(l.querySelector(".lv3-name")).color : "",
      fxOn: getComputedStyle(document.getElementById("lv3fx")).opacity !== "0",
      holeHasPath: (document.getElementById("lv3hole").getAttribute("d") || "").length > 20,
      descShown: l ? getComputedStyle(l.querySelector(".lv3-desc")).opacity === "1" : false,
      plate: l ? getComputedStyle(l, "::before").backgroundColor : "",
      othersDim: [...document.querySelectorAll("#lv3labels .lv3-label:not(.is-hot)")]
        .every(o => +getComputedStyle(o).opacity <= 0.4)
    };
  });
  check(hov.hot && hov.descShown, "desktop: hover names the space + reveals its line (" + hov.name + ")");
  check(hov.accent === "rgb(251, 243, 226)", "desktop: hovered label's words go cream inside the bubble (" + hov.accent + ")");
  check(!!hov.plate && !/^rgba\(0, 0, 0, 0\)$|^transparent$/.test(hov.plate), "desktop: ...on a full bubble of the space's colour (" + hov.plate + ")");
  check(hov.othersDim, "desktop: the other labels recede while one is open");
  check(hov.fxOn && hov.holeHasPath, "desktop: feathered region highlight paints");

  /* click it: we should end up inside the library dwell, same page */
  const urlBefore = p.url();
  await p.mouse.click(box.x, box.y);
  await p.waitForTimeout(2600);
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
      y: Math.round(scrollY),
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
  check(p.url() === urlBefore, "desktop: clicking a map space does NOT navigate away (" + p.url().split("/").pop() + ")");
  check(landed.y > 0 && landed.lit.length === 1 && /library|reading|known/i.test(landed.lit[0]), "desktop: landed in the library dwell with its copy up -> " + landed.lit.join(","));
  check(landed.mapOff, "desktop: map mode released after arriving");
  check(landed.veilClear, "desktop: zoom veil fully lifted");
  check(landed.stageClean, "desktop: stage transform/blur cleaned up after the flight");
  if (H264) check(landed.videoPresent && landed.videoPlaying, "desktop: the destination scene's ambient loop is playing (" + (landed.videoState || "no video element") + ")");
  else check(landed.posterUp, "desktop: the destination scene is painted (no H.264 here — poster: " + landed.poster + ")");
  await p.screenshot({ path: path.join(OUT, "lv3-landed-library.png") });

  /* ---------------- A5: map scroll lock ---------------- */
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(400);
  await p.mouse.move(720, 450);
  await p.mouse.wheel(0, 600);
  const nudged = await p.evaluate(() => document.getElementById("mapmode").classList.contains("is-nudge"));
  await p.mouse.wheel(0, 600);
  await p.waitForTimeout(200);
  const lock = await p.evaluate(() => ({ y: Math.round(scrollY), mapOn: document.documentElement.classList.contains("lv3-map") }));
  check(lock.y === 0 && lock.mapOn, "A5: wheel does NOT leave the map (scrollY=" + lock.y + ", mapOn=" + lock.mapOn + ")");
  check(nudged, "A5: a blocked scroll fires the map nudge feedback");
  /* keyboard exits are locked too (ArrowDown/PageDown/Space) */
  await p.keyboard.press("PageDown");
  await p.waitForTimeout(150);
  const keyLock = await p.evaluate(() => Math.round(scrollY));
  check(keyLock === 0, "A5: PageDown does NOT leave the locked map (scrollY=" + keyLock + ")");

  /* ---------------- B1: inverted tour — enter, land on summit, wheel-DOWN descends ---------------- */
  await p.click("#lv3tour");
  await p.waitForTimeout(2600);
  const atSummit = await p.evaluate(() => {
    const copies = [...document.querySelectorAll(".sw-copy")];
    const lit = copies.map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(c => c.op > 0.5).map(c => c.i);
    return { lit, last: copies.length - 1, y: Math.round(scrollY), hint: document.getElementById("lv3tourhint").textContent };
  });
  check(atSummit.lit.indexOf(atSummit.last) > -1, "B1: tour enters and lands on the summit (last scene) -> lit " + atSummit.lit.join(","));
  check(/scroll down/i.test(atSummit.hint), "B1: hint tells the visitor to scroll DOWN to descend -> \"" + atSummit.hint + "\"");
  await p.screenshot({ path: path.join(OUT, "lv31-final-tour-summit.png") });

  /* the new assertion the A+B builder flagged: real wheel-DOWN gestures must
     DESCEND (scrollY decreases, lit index drops) — this is the inverted
     mapping, not a plain scrollTo jump */
  const yStart = await p.evaluate(() => Math.round(scrollY));
  const idxStart = Math.max.apply(null, atSummit.lit);
  const marks = [];
  for (let k = 1; k <= 3; k++) {
    for (let j = 0; j < 6; j++) { await p.mouse.wheel(0, 500); await p.waitForTimeout(40); }
    await p.waitForTimeout(700);
    const st = await p.evaluate(() => {
      const lit = [...document.querySelectorAll(".sw-copy")].map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(c => c.op > 0.4).map(c => c.i);
      return { y: Math.round(scrollY), lit, maxIdx: lit.length ? Math.max.apply(null, lit) : -1 };
    });
    marks.push(st);
  }
  const descended = marks[marks.length - 1].y < yStart;
  const idxDropped = marks[marks.length - 1].maxIdx < idxStart;
  check(descended, "B1: wheel-DOWN descends one dwell at a time — scrollY " + yStart + " -> " + marks.map(m => m.y).join(" -> "));
  check(idxDropped, "B1: descent steps to lower scenes — top lit index " + idxStart + " -> " + marks.map(m => m.maxIdx).join(" -> "));

  /* keep descending to the ground: the tour ends and the map re-forms.
     CHANGED in v3.2d, at P-A's request: the lock is a one-time teaching
     device, so it does NOT re-engage -- once the tour has been taken,
     arriving back at the map must not be a trap. Scroll now climbs. */
  /* stop the moment the ground is reached — past that point the wheel is a
     normal scroll again (that is the point of the change) and would climb */
  for (let j = 0; j < 60; j++) {
    /* the tour hands back at scene 1's dwell centre and then GLIDES the last
       stretch to the top — stop wheeling the moment it hands back, or the
       test races its own glide */
    if (await p.evaluate(() => !tourMode)) break;
    await p.mouse.wheel(0, 700); await p.waitForTimeout(20);
  }
  await p.waitForTimeout(900);
  const ended = await p.evaluate(() => ({ y: Math.round(scrollY), mapOn: document.documentElement.classList.contains("lv3-map"), taken: tourTaken, tour: tourMode }));
  check(ended.mapOn && ended.y <= 4, "B1: descent to the ground restores map mode (scrollY=" + ended.y + ", mapOn=" + ended.mapOn + ")");
  check(ended.taken === true && ended.tour === false, "B1: the tour is over and remembered");
  /* THE ARRIVAL CARD (P-A, 2026-07-31). Landing back on the map now says so,
     and the one thing it holds is the descent: "you arrive at the map, you
     keep scrolling down and it automatically gets you back to the commons...
     maybe it temporarily blocks it, and if you close the pop-up you can
     scroll down again."
     So the old assertion here — that a wheel immediately climbs again — is
     now only true on the far side of the card. Both halves are checked. */
  const card = await p.evaluate(() => {
    const e = document.getElementById("lv3end");
    return { on: e.classList.contains("on"), text: e.innerText.replace(/\s+/g, " ").trim().slice(0, 60) };
  });
  check(card.on, "B1: landing back on the map is acknowledged -> " + card.text);
  await p.mouse.wheel(0, 600);
  await p.waitForTimeout(250);
  const held = await p.evaluate(() => Math.round(scrollY));
  check(held <= 4, "B1: while the card is up the descent is held (scrollY=" + held + ")");
  await p.evaluate(() => document.querySelector(".lv3-end__x").click());
  await p.waitForTimeout(700);
  await p.mouse.wheel(0, 600);
  await p.waitForTimeout(250);
  const after = await p.evaluate(() => Math.round(scrollY));
  check(after > 4, "B1: closing the card hands scrolling back, and the map never re-locks (scrollY=" + after + ")");

  check(errs.length === 0, "desktop: 0 same-origin console/page errors" + (errs.length ? " -> " + errs.join(" | ") : noise(errs)));
  await p.close();

  /* ================= 3. in-scene hotspots (Slice C) — per scene ================= */
  const h = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const herrs = watch(h);
  await h.goto(BASE + "/index.html", { waitUntil: "load" });
  await h.waitForTimeout(1600);

  const mapState = await h.evaluate(() => ({
    labels: document.querySelectorAll("#lv3labels .lv3-label").length,
    mapOn: document.documentElement.classList.contains("lv3-map"),
    spotsOff: !document.getElementById("lv3scenes").classList.contains("is-on")
  }));
  check(mapState.labels === 6 && mapState.mapOn, "map: still loads with 6 labels, spot layer off in map mode (" + mapState.spotsOff + ")");

  for (const sc of SCENES) {
    await jump(h, sc.index);
    await h.waitForTimeout(750);
    const st = await h.evaluate((n) => {
      const layer = document.getElementById("lv3scenes");
      const vis = [...document.querySelectorAll("#lv3slabels .lv3-label")].filter(l => l.offsetParent !== null);
      const tags = [...document.querySelectorAll("#world .sw-copy__tags")];
      const overCopy = [];
      const copyR = document.querySelectorAll("#world .sw-copy")[n] &&
        document.querySelectorAll("#world .sw-copy")[n].getBoundingClientRect();
      const hitR = (a, c) => !(a.right <= c.left || a.left >= c.right || a.bottom <= c.top || a.top >= c.bottom);
      vis.forEach(l => {
        const r = l.querySelector(".lv3-name").getBoundingClientRect();
        if (copyR && hitR(r, copyR)) overCopy.push(l.querySelector(".lv3-name").textContent.trim());
      });
      const pairHits = [];
      const rects = vis.map(l => l.querySelector(".lv3-name").getBoundingClientRect());
      for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++)
        if (hitR(rects[i], rects[j])) pairHits.push(i + "x" + j);
      return {
        on: layer.classList.contains("is-on"), op: +getComputedStyle(layer).opacity,
        spots: vis.length,
        /* the VISIBLE pill, not the box — the sentence sits in flow beneath it
           but is hidden until hover, and hover pulls the whole bubble back on
           screen (fitHot; checked in shoot-lv32b.js) */
        onScreen: vis.filter(l => { const r = l.querySelector(".lv3-name").getBoundingClientRect(); return r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight; }).length,
        pillsHidden: tags.every(t => getComputedStyle(t).display === "none"),
        overCopy, pairHits
      };
    }, sc.index);
    check(st.on && st.op > 0.85, sc.id + ": spot layer ON at dwell (op=" + st.op.toFixed(2) + ")");
    check(st.spots === sc.spots, sc.id + ": " + sc.spots + " spots rendered (" + st.spots + ")");
    check(st.onScreen === st.spots, sc.id + ": every spot label fully on screen (" + st.onScreen + "/" + st.spots + ")");
    check(st.pillsHidden, sc.id + ": desktop tag pills hidden (in-scene spots are the interface)");
    check(st.overCopy.length === 0, sc.id + ": no spot label sits on the scene copy" + (st.overCopy.length ? " -> " + st.overCopy.join(",") : ""));
    check(st.pairHits.length === 0, sc.id + ": no spot labels overlap each other" + (st.pairHits.length ? " -> " + st.pairHits.join(",") : ""));

    /* hover the first label: highlight + one-liner */
    const first = h.locator("#lv3slabels .lv3-label:visible").first();
    await first.locator(".lv3-name").hover();
    await h.waitForTimeout(450);
    const hov2 = await h.evaluate(() => {
      const layer = document.getElementById("lv3scenes");
      const hot = document.querySelector("#lv3slabels .lv3-label.is-hot");
      return {
        isHot: layer.classList.contains("is-hot"),
        fxOp: +getComputedStyle(document.getElementById("lv3sfx")).opacity,
        descVis: hot ? getComputedStyle(hot.querySelector(".lv3-desc")).visibility : "none",
        descOp: hot ? +getComputedStyle(hot.querySelector(".lv3-desc")).opacity : 0,
        name: hot ? hot.querySelector(".lv3-name").textContent.trim() : ""
      };
    });
    check(hov2.isHot && hov2.fxOp > 0.9, sc.id + ": hover paints the painterly highlight (fx=" + hov2.fxOp + ")");
    check(hov2.descVis === "visible" && hov2.descOp > 0.9, sc.id + ": hover shows name + one-liner (" + hov2.name + ")");
    if (sc.id === "library") await h.screenshot({ path: path.join(OUT, "lv31-final-scene-library-hover.png") });
    await h.mouse.move(10, 880);
    await h.waitForTimeout(250);
  }

  /* spots must be gone BETWEEN dwells (mid-connector) */
  await h.evaluate(() => { const a = WORLD.dwellCenter(2), b2 = WORLD.dwellCenter(3); scrollTo(0, (a + b2) / 2); });
  await h.waitForTimeout(500);
  const between = await h.evaluate(() => document.getElementById("lv3scenes").classList.contains("is-on"));
  check(!between, "between dwells: spot layer stands down");

  /* tour regression: summit spots stay live */
  await h.evaluate(() => scrollTo(0, 0));
  await h.waitForTimeout(600);
  await h.click("#lv3tour");
  await h.waitForTimeout(2600);
  const tourSt = await h.evaluate(() => ({
    y: Math.round(scrollY), hint: document.getElementById("lv3tourhint").textContent,
    spotsOn: document.getElementById("lv3scenes").classList.contains("is-on"),
    spotCount: [...document.querySelectorAll("#lv3slabels .lv3-label")].filter(l => l.offsetParent !== null).length
  }));
  check(tourSt.y > 0 && /scroll down/i.test(tourSt.hint), "tour: still lands on the summit with the descend hint");
  check(tourSt.spotsOn && tourSt.spotCount === 3, "tour: summit spots are live at the top (" + tourSt.spotCount + ")");
  check(herrs.length === 0, "hotspots pass: 0 same-origin console/page errors" + (herrs.length ? " -> " + herrs.join(" | ") : noise(herrs)));
  await h.close();

  /* ---------------- click test: departs then REALLY navigates ---------------- */
  const c = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const cerrs = watch(c);
  await c.goto(BASE + "/index.html", { waitUntil: "load" });
  await c.waitForTimeout(1200);
  await jump(c, 3);
  await c.waitForTimeout(800);
  const t0 = Date.now();
  await c.locator("#lv3slabels .lv3-label:visible", { hasText: "The blueprint" }).first().locator(".lv3-name").click();
  await c.waitForTimeout(220);
  const midVeil = await c.evaluate(() => document.getElementById("lv3veil") && document.getElementById("lv3veil").classList.contains("on")).catch(() => "navigated-early");
  await c.waitForURL("**/design.html", { timeout: 4000 });
  const dt = Date.now() - t0;
  check(true, "click test: 'The blueprint' hotspot navigates to design.html (" + dt + "ms)");
  check(midVeil === true || midVeil === "navigated-early", "click test: veil covered during the departure (" + midVeil + ")");
  check(cerrs.length === 0, "click test page: 0 errors" + (cerrs.length ? " -> " + cerrs.join(" | ") : noise(cerrs)));
  await c.close();

  /* ctrl-click falls through to native link (new tab), page stays */
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
  check(c2.url().indexOf("index.html") > -1, "ctrl-click: the landing page does NOT navigate away");
  check(!!popup, "ctrl-click: opens the target in a new tab (native link behaviour)");
  await ctx2.close();

  /* reduced motion: instant jump on map click; plain navigation on a spot click */
  const r = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const rerrs = watch(r);
  await r.goto(BASE + "/index.html", { waitUntil: "load" });
  await r.waitForTimeout(1200);
  const rbox = await r.evaluate(() => {
    const l = [...document.querySelectorAll("#lv3labels .lv3-label")].find(x => x.textContent.includes("Garden"));
    const bx = l.querySelector(".lv3-name").getBoundingClientRect();
    return { x: bx.left + bx.width / 2, y: bx.top + bx.height / 2 };
  });
  await r.mouse.click(rbox.x, rbox.y);
  await r.waitForTimeout(500);
  const rjump = await r.evaluate(() => ({
    y: Math.round(scrollY),
    stageClean: (document.querySelector(".sw-stage").getAttribute("style") || "").indexOf("scale") === -1
  }));
  check(rjump.y > 0 && rjump.stageClean, "reduced motion: map click is an instant jump, no zoom (y=" + rjump.y + ")");
  await jump(r, 5);
  await r.waitForTimeout(700);
  await r.locator("#lv3slabels .lv3-label:visible", { hasText: "The story book" }).first().locator(".lv3-name").click();
  await r.waitForURL("**/story.html", { timeout: 3000 });
  check(true, "reduced motion: in-scene spot click navigates plainly to story.html");
  check(rerrs.length === 0, "reduced motion: 0 errors" + (rerrs.length ? " -> " + rerrs.join(" | ") : noise(rerrs)));
  await r.close();

  /* ================= 4. phone pass (390x844) ================= */
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const merrs = watch(m);
  await m.goto(BASE + "/index.html", { waitUntil: "load" });
  await m.waitForTimeout(1800);
  /* RECONCILED 2026-07-30. The six stacked callouts are gone: they covered
     the tower with six equal choices. The phone now arrives on the artwork
     alone and the first scroll raises three doors. Detailed coverage of the
     new flow lives in `shoot-mobile-landing.js`; these checks are the
     regression guard inside the consolidated suite. */
  const phone = await m.evaluate(() => {
    const doors = [...document.querySelectorAll(".lv3-door")];
    const layer = document.getElementById("lv3scenes");
    return {
      stackGone: !document.querySelector(".lv3-row"),
      doorsHiddenOnArrival: getComputedStyle(document.getElementById("lv3doors")).visibility === "hidden",
      doors: doors.length,
      borderCols: doors.map(x => getComputedStyle(x).borderLeftColor),
      cueShown: getComputedStyle(document.getElementById("lv3cue")).display !== "none",
      labelsHidden: getComputedStyle(document.querySelector(".lv3-labels")).display === "none",
      heroUp: document.querySelector(".lv3-hero h1").getBoundingClientRect().width > 0,
      spotLayerHidden: getComputedStyle(layer).display === "none"
    };
  });
  check(phone.stackGone, "phone: the six-tile stack is gone");
  check(phone.doorsHiddenOnArrival, "phone: arrival is the artwork alone, doors not yet up");
  check(phone.cueShown, "phone: the scroll cue asks for the gesture");
  check(phone.labelsHidden, "phone: the desktop image labels are off (portrait clip is a different crop)");
  check(phone.heroUp, "phone: hero copy is up");
  check(phone.spotLayerHidden, "phone: desktop in-scene spot layer fully hidden");
  await m.screenshot({ path: path.join(OUT, "lv31-final-phone-arrive.png") });

  /* RECONCILED again, 2026-07-30 round 2. The first scroll is now meant to
     MOVE THE WORLD (P-A: "I definitely need to see a first scroll... the 3D
     scrolling is the coolest part"), so the page rides one scene, holds
     there, and the doors come up on that screen. The detailed walk of that
     flow lives in shoot-mobile-arrival.js; this is the regression guard. */
  for (let i = 0; i < 10; i++) {
    if (await m.evaluate(() => document.documentElement.classList.contains("lv3-landed"))) break;
    await m.mouse.move(195, 500);
    await m.mouse.wheel(0, 420);
    await m.waitForTimeout(320);
  }
  await m.waitForTimeout(800);
  const dz = await m.evaluate(() => {
    const d = document.getElementById("lv3doors");
    const btns = [...d.querySelectorAll(".lv3-door")];
    return {
      up: getComputedStyle(d).visibility === "visible",
      landed: document.documentElement.classList.contains("lv3-landed"),
      y: Math.round(scrollY),
      labels: btns.map(b => b.querySelector("b").textContent),
      cols: btns.map(b => getComputedStyle(b).borderLeftColor),
      minH: Math.min(...btns.map(b => b.getBoundingClientRect().height)),
      artTop: Math.round(d.getBoundingClientRect().top)
    };
  });
  check(dz.y > 60, "phone: the first scroll MOVES THE WORLD rather than popping a menu (y=" + dz.y + ")");
  check(dz.up && dz.landed, "phone: it holds one scene later and the doors come up there");
  check(dz.labels.length === 3, "phone: three doors -> " + dz.labels.join(" · "));
  /* the tour door is deliberately warmer-plated, so its border is a blend
     rather than a flat category colour — two of three must still be flat */
  check(dz.cols.filter(c => CATS.indexOf(c) > -1).length >= 2, "phone: the doors carry category colours -> " + dz.cols.join(","));
  check(dz.minH >= 44, "phone: every door tap target >=44px (min " + dz.minH.toFixed(1) + ")");
  check(dz.artTop > 300, "phone: the tower is still visible above the doors (top=" + dz.artTop + ")");
  await m.screenshot({ path: path.join(OUT, "lv31-final-phone-doors.png") });

  /* a content door opens its gate, and the gate must sit above the site nav */
  await m.tap('.lv3-door[data-group="resources"]');
  await m.waitForTimeout(800);
  const gt = await m.evaluate(() => {
    const el = document.getElementById("lv3gate");
    const back = document.getElementById("lv3gateback");
    const r = back.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return {
      on: el.classList.contains("on"),
      title: el.querySelector("h2").textContent,
      zones: [...el.querySelectorAll(".lv3-zone__name")].map(h => h.textContent),
      backReachable: !!(hit && (hit === back || back.contains(hit)))
    };
  });
  check(gt.on && gt.zones.length === 4, "phone: the resources gate opens with its four zones -> " + gt.zones.join(" · "));
  check(gt.backReachable, "phone: the site nav does not sit on top of the gate's way back");
  await m.tap("#lv3gateback");
  await m.waitForTimeout(700);
  check(await m.evaluate(() => !document.getElementById("lv3gate").classList.contains("on")), "phone: the gate closes back onto the tower");

  /* pills: hidden >=861px checked above; on phone, present with tap targets */
  await jump(m, 4);   /* gardens: 2 pills, distinct count from others */
  await m.waitForTimeout(1200);
  const pillsCheck = await m.evaluate(() => {
    const tagUls = [...document.querySelectorAll("#world .sw-copy__tags")];
    const pills = tagUls.map(u => [...u.querySelectorAll("li a")].map(a => {
      const r = a.getBoundingClientRect();
      return { h: r.height, fs: parseFloat(getComputedStyle(a).fontSize) };
    })).filter(arr => arr.length);
    const counts = tagUls.map(u => u.querySelectorAll("li a").length).filter(n => n > 0);
    const flat = pills.flat();
    return { counts, minH: flat.length ? Math.min(...flat.map(x => x.h)) : 0, minFs: flat.length ? Math.min(...flat.map(x => x.fs)) : 0 };
  });
  check(JSON.stringify(pillsCheck.counts.sort()) === JSON.stringify([...PILL_COUNTS].sort()), "phone: pill counts per scene = 3,4,3,2,3,3 (" + pillsCheck.counts.join(",") + ")");
  check(pillsCheck.minH >= 44, "phone: every pill tap target >=44px (min " + pillsCheck.minH.toFixed(1) + ")");
  check(pillsCheck.minFs >= 16, "phone: pill text >=16px (min " + pillsCheck.minFs + ")");
  await m.screenshot({ path: path.join(OUT, "lv31-final-phone-scene.png") });

  /* the tour door does what the tour button has always done: fly to the
     summit, then scrolling descends */
  await m.evaluate(() => scrollTo(0, 0));
  await m.waitForTimeout(600);
  await m.tap('.lv3-door[data-group="tour"]');
  await m.waitForTimeout(2800);
  const mland = await m.evaluate(() => ({
    y: Math.round(scrollY),
    lit: [...document.querySelectorAll(".sw-copy")].map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(c => c.op > 0.5).map(c => c.i),
    mapOff: !document.documentElement.classList.contains("lv3-map")
  }));
  check(mland.y > 0 && mland.lit.length === 1 && mland.mapOff, "phone: the tour door lands at the summit dwell -> copy " + mland.lit.join(","));

  /* and a scene's own buttons still carry every destination */
  await jump(m, 4);
  await m.waitForTimeout(1600);
  const gpills = await m.evaluate(() => {
    const copies = [...document.querySelectorAll("#world .sw-copy")];
    const lit = copies.map((c, i) => ({ i, op: +getComputedStyle(c).opacity })).filter(x => x.op > 0.5).map(x => x.i);
    const ul = lit.length ? copies[lit[0]].querySelector(".sw-copy__tags") : null;
    return { lit, shown: ul ? getComputedStyle(ul).display !== "none" : false, labels: ul ? [...ul.querySelectorAll("a")].map(a => a.textContent.trim()) : [] };
  });
  check(gpills.lit.length === 1 && gpills.shown && gpills.labels.indexOf("Read the manifesto") > -1, "phone: garden pills present and tappable -> " + gpills.labels.join(" · "));
  await m.tap('#world .sw-copy__tags a:has-text("Read the manifesto")');
  await m.waitForURL("**/manifesto.html", { timeout: 4000 });
  check(true, "phone: tapping a pill navigates (no touch-interception regression)");
  check(merrs.length === 0, "phone: 0 errors" + (merrs.length ? " -> " + merrs.join(" | ") : noise(merrs)));
  await m.close();

  /* headline 2560px map shot (separate, no interaction needed) */
  const wide = await b.newPage({ viewport: { width: 2560, height: 1080 } });
  watch(wide);
  await wide.goto(BASE + "/index.html", { waitUntil: "load" });
  await wide.waitForTimeout(1500);
  await wide.screenshot({ path: path.join(OUT, "lv31-final-map-2560.png") });
  await wide.close();

  /* ================= 5. new pages + rebrand + title sweep ================= */
  const PAGES = NEW_PAGES.concat(["resources.html"]);
  for (const url of PAGES) {
    const np = await b.newPage({ viewport: { width: 1440, height: 950 } });
    const nperrs = watch(np);
    const res = await np.goto(BASE + "/" + url, { waitUntil: "networkidle" }).catch(() => null);
    await np.waitForTimeout(900);
    const status = res ? res.status() : 0;
    const brand = await np.textContent(".snav .brand").catch(() => null);
    const sig = await np.textContent(".sfooter .sig").catch(() => null);
    check(status === 200, url + ": loads 200 (" + status + ")");
    check(brand === "Our Coliving", url + ": nav brand rebranded to \"Our Coliving\" (" + brand + ")");
    check(sig === "Pierre-Antoine Descoteaux", url + ": footer keeps P-A's name (" + sig + ")");
    check(nperrs.length === 0, url + ": 0 console/page errors" + (nperrs.length ? " -> " + nperrs.join(" | ") : noise(nperrs)));
    await np.close();
  }

  /* title sweep spot-check */
  for (const [url, want] of [["resources.html", "— Our Coliving"], ["manifesto.html", "— Our Coliving"]]) {
    const tp = await b.newPage();
    watch(tp);
    await tp.goto(BASE + "/" + url, { waitUntil: "load" });
    const title = await tp.title();
    check(title.endsWith(want), url + ": <title> ends in \"" + want + "\" -> \"" + title + "\"");
    await tp.close();
  }

  /* ================= 6. every hotspot href + tag href + new-page link resolves ================= */
  const l = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await l.goto(BASE + "/index.html", { waitUntil: "load" });
  await l.waitForTimeout(1200);
  const mapHrefs = await l.evaluate(() => [...new Set([...document.querySelectorAll("#lv3labels .lv3-label,.lv3-door,.lv3-plain a")].map(a => a.getAttribute("href")))]);
  const spotHrefs = await l.evaluate(() => [...new Set(SCENE_SPOTS.flatMap(g => g.spots.map(s => s.href)))]);
  const tagHrefs = await l.evaluate(() => [...new Set([...document.querySelectorAll(".sw-copy__tags a,.sw-btn")].map(a => a.getAttribute("href")))]);
  const navHrefs = await l.evaluate(() => [...new Set([...document.querySelectorAll(".snav a")].map(a => a.getAttribute("href")))]);
  const assets = await l.evaluate(() => [...new Set([...document.querySelectorAll(".sw-scene__still")].map(i => i.getAttribute("src")).filter(Boolean))]);
  const allHrefs = [...new Set(mapHrefs.concat(spotHrefs, tagHrefs, navHrefs, NEW_PAGES))];
  let bad = [];
  for (const hh of allHrefs.concat(assets)) {
    if (!hh || hh.startsWith("mailto:") || hh.startsWith("#")) continue;
    const res = await l.request.get(BASE + "/" + hh.split("#")[0]);
    if (!res.ok()) bad.push(hh + " -> " + res.status());
  }
  check(bad.length === 0, "every hotspot href + tag href + nav link + scene still resolves 200" + (bad.length ? " -> " + bad.join(", ") : " (" + (allHrefs.length + assets.length) + " checked)"));
  const clips = await l.evaluate(() => {
    const cfg = [...document.scripts].map(s => s.textContent).join("");
    return [...new Set((cfg.match(/assets\/tower\/vid\/[a-z0-9\-]+\.mp4/g) || []))];
  });
  let badClips = [];
  for (const cc of clips) { const res = await l.request.get(BASE + "/" + cc); if (!res.ok()) badClips.push(cc + " -> " + res.status()); }
  check(badClips.length === 0, "all " + clips.length + " scene/connector clips resolve" + (badClips.length ? " -> " + badClips.join(", ") : ""));
  await l.close();

  await b.close();
  console.log(fails === 0 ? "\nALL GREEN" : "\n" + fails + " FAILURES");
  process.exit(fails ? 1 : 0);
})();
