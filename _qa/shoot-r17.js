/* Round 17 QA: bubble cluster (closer arrivals + all pinned until field ends),
   CTA hover keyword tips, Coliving Atlas renames. */
const { chromium } = require("playwright-core");
const path = require("path");
const root = "file:///C:/Users/User/coliving-portfolio/";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  const errors = [];
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", e => errors.push("PAGEERROR: " + e.message));
  async function snap(name, viewportOnly) {
    await page.screenshot({ path: path.join(__dirname, name), fullPage: !viewportOnly });
    console.log("shot:", name);
  }

  // ---- manifesto field: pinned scatter stage ----
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);
  // arrival: scroll to where the stage pins — ALL gray bubbles should be visible
  await page.evaluate(() => { window.scrollTo({ top: document.getElementById("fieldbed").getBoundingClientRect().top + window.scrollY, behavior: "auto" }); });
  await page.waitForTimeout(900);
  const arrival = await page.evaluate(() => {
    const bubs = [...document.querySelectorAll(".bub")];
    const vh = window.innerHeight, vw = window.innerWidth;
    return {
      bubbles: bubs.length,
      grayVisibleOnArrival: bubs.filter(b => {
        const r = b.getBoundingClientRect();
        return r.top >= -10 && r.bottom <= vh + 10 && r.left >= -10 && r.right <= vw + 10;
      }).length,
      pinSticky: getComputedStyle(document.getElementById("fieldpin")).position === "sticky",
      segs: document.querySelectorAll(".bvinesvg .seg").length,
    };
  });
  console.log("ARRIVAL (gray scatter):", JSON.stringify(arrival));
  await snap("r17-arrival.png", true);

  // scroll through the stage — pops cascade with progress
  await page.evaluate(async () => {
    const bed = document.getElementById("fieldbed");
    const end = bed.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 1.1;
    let y = window.scrollY;
    while (y < end) { y += 240; window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 110)); }
    window.__endY = y;
  });
  await page.waitForTimeout(1800);
  const collage = await page.evaluate(() => {
    const bubs = [...document.querySelectorAll(".bub")];
    const vh = window.innerHeight, vw = window.innerWidth;
    const rects = bubs.map(b => b.getBoundingClientRect());
    const fullyInView = rects.filter(r => r.top >= -6 && r.bottom <= vh + 6 && r.left >= -6 && r.right <= vw + 6).length;
    // pairwise overlap check (any two cards intersecting)
    let overlaps = 0, minGap = 1e9;
    for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i], b = rects[j];
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 0 && oy > 0) overlaps++;
      const gap = Math.max(-ox, -oy); if (ox > 0 || oy > 0) minGap = Math.min(minGap, gap);
    }
    const segs = [...document.querySelectorAll(".bvinesvg .seg")];
    const drawn = segs.filter(p => {
      const L = p.getTotalLength();
      return L > 0 && parseFloat(p.style.strokeDashoffset || L) < L * 0.15;
    }).length;
    // curviness of the first drawn segment: path length vs straight chord
    let curve = null;
    if (segs[0]) {
      const L = segs[0].getTotalLength();
      const a = segs[0].getPointAtLength(0), b = segs[0].getPointAtLength(L);
      curve = +(L / Math.hypot(b.x - a.x, b.y - a.y)).toFixed(2);
    }
    return {
      popped: document.querySelectorAll(".bub.pop").length,
      fullyInView, overlaps, minGapPx: Math.round(minGap),
      segsDrawn: drawn, leavesOn: document.querySelectorAll(".bvinesvg .bleaf.on").length,
      curveRatio: curve,
    };
  });
  console.log("COLLAGE AT FIELD END:", JSON.stringify(collage));
  await snap("r17-cluster.png", true);

  // keep scrolling: the whole collage should leave together when the field ends
  await page.evaluate(() => window.scrollTo({ top: window.__endY + window.innerHeight * 1.6, behavior: "auto" }));
  await page.waitForTimeout(900);
  const released = await page.evaluate(() => {
    const bubs = [...document.querySelectorAll(".bub")];
    return { anyStillOnScreen: bubs.some(b => b.getBoundingClientRect().bottom > 0) };
  });
  console.log("AFTER FIELD (village arriving):", JSON.stringify(released));

  // ---- close CTAs: hover keyword tips ----
  await page.evaluate(() => document.querySelector(".close .ctas").scrollIntoView({ behavior: "auto", block: "center" }));
  await page.waitForTimeout(800);
  const tipCount = await page.evaluate(() => document.querySelectorAll(".close .ctas .tip").length);
  await page.hover(".close .ctas a:first-child");
  await page.waitForTimeout(500);
  const tip = await page.evaluate(() => {
    const t = document.querySelector(".close .ctas a:first-child .tip");
    return { tips: document.querySelectorAll(".close .ctas .tip").length, firstTipOpacity: getComputedStyle(t).opacity, text: t.textContent };
  });
  console.log("CTA TIPS:", JSON.stringify({ tipCount, ...tip }));
  await snap("r17-cta-tip.png", true);

  // ---- Coliving Atlas renames ----
  const label = await page.evaluate(() => document.querySelector(".close .ctas a:first-child").childNodes[0].textContent);
  await page.goto(root + "map.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  const renames = { manifestoCta: label, mapTitle: await page.title(), mapEyebrow: await page.evaluate(() => document.querySelector(".head .eyebrow").textContent) };
  await page.goto(root + "type.html?t=cohousing", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  renames.typeCrumb = await page.evaluate(() => document.getElementById("backMap").textContent);
  await page.goto(root + "index.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  renames.indexDoorTag = await page.evaluate(() => document.querySelector(".door.d-atlas .tag").textContent);
  console.log("RENAMES:", JSON.stringify(renames));

  // ---- mobile: flow-through still works ----
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  const mobSetup = await page.evaluate(() => ({
    bandsBlock: getComputedStyle(document.querySelector(".bband")).display === "block",
  }));
  await page.evaluate(async () => {
    const bed = document.getElementById("fieldbed");
    const end = bed.getBoundingClientRect().bottom + window.scrollY + 300;
    for (let y = 0; y <= end; y += 240) { window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 100)); }
  });
  await page.waitForTimeout(1200);
  const mob = await page.evaluate(() => ({ popped: document.querySelectorAll(".bub.pop").length }));
  console.log("MOBILE:", JSON.stringify({ ...mobSetup, ...mob }));
  await snap("r17-mobile-field.png", true);

  console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "NO CONSOLE ERRORS");
  await browser.close();
})();
