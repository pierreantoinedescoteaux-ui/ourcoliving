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

  // ---- manifesto field: cluster ----
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);
  const setup = await page.evaluate(() => {
    const bubs = [...document.querySelectorAll(".bub")];
    const tops = bubs.map(b => Math.round(parseFloat(getComputedStyle(b).top)));
    return {
      bubbles: bubs.length,
      segs: document.querySelectorAll(".bvinesvg .seg").length,
      distinctStickyTops: [...new Set(tops)].sort((a, b) => a - b),
      bandsDissolved: getComputedStyle(document.querySelector(".bband")).display === "contents",
    };
  });
  console.log("SETUP:", JSON.stringify(setup));

  // scroll slowly through the field — recompute the end each step: popping
  // bubbles grows the bed (gray blob -> taller card), a fixed end undershoots
  await page.evaluate(async () => {
    const bed = document.getElementById("fieldbed");
    const endNow = () => bed.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 1.35;
    let y = 0;
    while (y < endNow()) { y += 260; window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 110)); }
    window.__endY = y;
  });
  await page.waitForTimeout(1600);
  const cluster = await page.evaluate(() => {
    const bubs = [...document.querySelectorAll(".bub")];
    const vh = window.innerHeight;
    const inView = bubs.filter(b => {
      const r = b.getBoundingClientRect();
      return r.top >= 0 && r.top < vh && r.bottom > 0; // top edge on screen = card visibly pinned
    }).length;
    const segs = [...document.querySelectorAll(".bvinesvg .seg")];
    const drawn = segs.filter(p => {
      const L = p.getTotalLength();
      return L > 0 && parseFloat(p.style.strokeDashoffset || L) < L * 0.15;
    }).length;
    return { popped: document.querySelectorAll(".bub.pop").length, pinnedInView: inView, segsDrawn: drawn };
  });
  console.log("CLUSTER AT FIELD END:", JSON.stringify(cluster));
  await snap("r17-cluster.png", true);

  // keep scrolling: the whole cluster should leave together when the field ends
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
