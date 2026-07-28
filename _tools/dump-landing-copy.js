/* Pulls every line of copy off index.html into LANDING-COPY.csv.
   Reads the page's own data (SPACES / SCENE_SPOTS / LV3_SECTIONS / the hero
   and invite DOM) so the sheet can never drift from what actually renders.
   P-A edits the Copy column; apply it back with _tools/apply-landing-copy.js.
   Run: node _tools/dump-landing-copy.js   (server on :8123) */
const fs = require("fs"), path = require("path");
let chromium;
/* playwright lives in _qa/node_modules — resolve it from there */
try { ({ chromium } = require("playwright-core")); }
catch (e) { ({ chromium } = require(path.join(__dirname, "..", "_qa", "node_modules", "playwright-core"))); }
const BASE = process.env.BASE || "http://localhost:8123";
const OUT = path.join(__dirname, "..", "LANDING-COPY.csv");

const cell = v => {
  const s = String(v == null ? "" : v).replace(/\s*\[edit\]\s*/g, " ").replace(/\s+/g, " ").trim();
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

(async () => {
  const launch = {};
  if (process.env.CHROME) launch.executablePath = process.env.CHROME;
  let b;
  try { b = await chromium.launch({ headless: true, channel: launch.executablePath ? undefined : "chrome", ...launch }); }
  catch (e) { b = await chromium.launch({ headless: true, ...launch }); }
  const p = await (await b.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
  await p.goto(BASE + "/index.html", { waitUntil: "load" });
  await p.waitForTimeout(1200);

  const rows = await p.evaluate(() => {
    const out = [];
    const t = el => el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    const zoneOf = id => (LV3_SECTIONS.filter(s => s.id === id)[0] || {}).label || id;

    /* the map itself */
    out.push(["Main map", "hero — eyebrow", t(document.querySelector(".lv3-eyebrow"))]);
    out.push(["Main map", "hero — heading", t(document.querySelector(".lv3-hero h1"))]);
    out.push(["Main map", "hero — body", t(document.querySelector(".lv3-hero .lede"))]);
    out.push(["Main map", "tour button", t(document.getElementById("lv3tour"))]);
    out.push(["Main map", "tour button — aside", t(document.querySelector(".lv3-do .or .on-wide"))]);
    out.push(["Main map", "tour button — aside (phone)", t(document.querySelector(".lv3-do .or .on-phone"))]);
    out.push(["Main map", "tour invite — heading", t(document.querySelector("#lv3invite h2"))]);
    out.push(["Main map", "tour invite — body", t(document.querySelector("#lv3invite p"))]);
    out.push(["Main map", "tour invite — button", t(document.querySelector("#lv3invite .lv3-inv-go"))]);
    out.push(["Main map", "back to the map link (in every scene)",
      t(document.querySelector("#world .sw-copy .lv3-backlink"))]);
    /* one row per chip, each named after itself — every Zone+Element pair in
       this sheet must be UNIQUE or the applier cannot tell the rows apart */
    document.querySelectorAll(".lv3-chip").forEach((c, i) =>
      out.push(["Main map", "legend chip " + (i + 1), t(c)]));

    /* the six spaces, as they read on the map */
    SPACES.forEach(sp => {
      out.push(["Main map", "space popup — " + sp.name + " (name)", sp.name]);
      out.push(["Main map", "space popup — " + sp.name + " (sentence)", sp.desc]);
      out.push(["Main map", "space popup — " + sp.name + " (plain words)", sp.q]);
    });

    /* each scene: the engine's overlay copy, then its hotspots, then the pills */
    LV3_SECTIONS.forEach(s => {
      if (!s.title) return;
      const z = s.label;
      out.push([z, "scene hero — eyebrow", s.eyebrow || ""]);
      out.push([z, "scene hero — heading", s.title]);
      out.push([z, "scene hero — body", s.body]);
      (s.tags || []).forEach(tg => out.push([z, "phone pill — " + tg.href, tg.label]));
      if (s.cta) {
        if (s.cta.primary) out.push([z, "button (primary)", s.cta.primary.label]);
        if (s.cta.secondary) out.push([z, "button (secondary)", s.cta.secondary.label]);
      }
      const g = SCENE_SPOTS.filter(x => x.id === s.id)[0];
      if (g) g.spots.forEach(sp => {
        out.push([z, "hotspot — " + sp.name + " (name)", sp.name]);
        out.push([z, "hotspot — " + sp.name + " (sentence)", sp.line]);
      });
    });

    /* the tour's one line of guidance */
    out.push(["Tour", "hint after landing on the summit",
      "You're at the top — scroll down to descend through the tower, space by space."]);
    return out;
  });

  const csv = "﻿" + ["Zone,Element,Copy"].concat(rows.map(r => r.map(cell).join(","))).join("\r\n") + "\r\n";
  fs.writeFileSync(OUT, csv, "utf8");
  console.log("wrote " + OUT + " — " + rows.length + " lines of copy");
  await b.close();
})();
