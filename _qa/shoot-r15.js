/* Round 15 QA: sticky dock-pop bubbles + segment vine + unpop, wider essay,
   projects filter-line + popup, bookshelf v2, type arrows + diagrams,
   map title + doors, nav map item. */
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

  // ---- manifesto field ----
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);
  const setup = await page.evaluate(() => ({
    bands: document.querySelectorAll(".bband").length,
    segs: document.querySelectorAll(".bvinesvg .seg").length,
    dock: getComputedStyle(document.querySelector(".bub")).top,
  }));
  console.log("FIELD SETUP:", JSON.stringify(setup));

  // scroll slowly through the field -> dock-pops fire one by one
  await page.evaluate(async () => {
    const bed = document.getElementById("fieldbed");
    const end = bed.getBoundingClientRect().bottom + window.scrollY + 300;
    for (let y = 0; y <= end; y += 260) { window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 120)); }
  });
  await page.waitForTimeout(1600);
  const afterScroll = await page.evaluate(() => {
    const segs = [...document.querySelectorAll(".bvinesvg .seg")];
    const drawn = segs.filter(p => {
      const L = p.getTotalLength();
      return L > 0 && parseFloat(p.style.strokeDashoffset || L) < L * 0.15;
    }).length;
    // curviness: a seg path should be meaningfully longer than the straight line between its ends
    let curvy = null;
    if (segs[0]) {
      const L = segs[0].getTotalLength();
      const a = segs[0].getPointAtLength(0), b = segs[0].getPointAtLength(L);
      curvy = +(L / Math.hypot(b.x - a.x, b.y - a.y)).toFixed(2);
    }
    return {
      popped: document.querySelectorAll(".bub.pop").length,
      segsDrawn: drawn,
      curveRatio: curvy,
      whatifTop: Math.round(document.getElementById("whatif").getBoundingClientRect().top),
      bubTop: Math.round(document.querySelector(".bub").getBoundingClientRect().top),
    };
  });
  console.log("AFTER FIELD SCROLL:", JSON.stringify(afterScroll));
  await page.evaluate(() => { const b = document.querySelectorAll(".bband")[4]; window.scrollTo({ top: b.offsetTop - 200, behavior: "auto" }); });
  await page.waitForTimeout(1300);
  await snap("r15-field-mid.png", true);

  // unpop: click a popped card -> gray returns, adjacent segs retract
  const unpopTest = await page.evaluate(async () => {
    const bub = document.getElementById("bub-security");
    bub.querySelector(".cardp").click();
    await new Promise(r => setTimeout(r, 1400));
    const segs = [...document.querySelectorAll(".bvinesvg .seg")];
    const adj = [segs[1], segs[2]]; // segments 1-2 and 2-3 touch bubble index 2
    const retracted = adj.every(p => { const L = p.getTotalLength(); return parseFloat(p.style.strokeDashoffset || 0) > L * 0.85; });
    return { unpopped: !bub.classList.contains("pop"), retracted };
  });
  console.log("UNPOP:", JSON.stringify(unpopTest));
  await snap("r15-unpop.png", true);

  // ---- separation (wider + float) ----
  await page.goto(root + "separation.html#security", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);
  const sep = await page.evaluate(() => {
    const s = document.getElementById("security").getBoundingClientRect();
    const ph = document.querySelector(".mov .photo");
    return { anchorOk: s.top > -50 && s.top < 400, floated: getComputedStyle(ph).float === "right", pageH: document.documentElement.scrollHeight };
  });
  console.log("SEPARATION:", JSON.stringify(sep));
  await snap("r15-separation.png", true);

  // ---- projects ----
  await page.goto(root + "projects.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1300);
  const proj1 = await page.evaluate(() => ({
    cards: document.querySelectorAll(".pcard").length,
    guideLinksInCards: document.querySelectorAll(".pcard a.guide").length,
  }));
  await page.click('.filters button[data-k="Kibbutz"]').catch(e => console.log("filter fail", e.message));
  await page.waitForTimeout(500);
  const proj2 = await page.evaluate(() => ({
    kibbutzCards: document.querySelectorAll(".pcard").length,
    guidelineShown: !document.getElementById("guideline").hidden,
  }));
  console.log("PROJECTS:", JSON.stringify({ ...proj1, ...proj2 }));
  await snap("r15-projects-kibbutz.png", true);
  await page.evaluate(() => document.querySelector(".pcard").click());
  await page.waitForTimeout(700);
  await snap("r15-project-popup.png", true);
  await page.keyboard.press("Escape");

  // ---- bookshelf ----
  await page.goto(root + "inspiration.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1300);
  const shelf = await page.evaluate(() => ({
    books: document.querySelectorAll(".book").length,
    withCovers: document.querySelectorAll(".book .cov img").length,
    filters: document.querySelectorAll(".filters button").length,
  }));
  console.log("SHELF:", JSON.stringify(shelf));
  await snap("r15-bookshelf.png", true);
  await page.evaluate(() => document.querySelectorAll(".book")[7] && document.querySelectorAll(".book")[7].click());
  await page.waitForTimeout(700);
  await snap("r15-book-popup.png", true);
  await page.keyboard.press("Escape");

  // ---- field guide: arrows + diagram ----
  await page.goto(root + "type.html?t=cohousing", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);
  const guide = await page.evaluate(() => ({
    arrows: document.querySelectorAll(".fgarrow").length,
    diagram: !!document.querySelector('img[src*="diagram-"]'),
    hero: (document.querySelector(".heroimg img") || {}).src || "none",
  }));
  console.log("GUIDE:", JSON.stringify(guide));
  await page.evaluate(() => { const d = document.querySelector('img[src*="diagram-"]'); if (d) d.scrollIntoView({ behavior: "auto", block: "center" }); });
  await page.waitForTimeout(900);
  await snap("r15-guide-diagram.png", true);

  // ---- map: title + doors + new heroes ----
  await page.goto(root + "map.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1500);
  const mapok = await page.evaluate(() => ({
    maphead: !!document.querySelector(".maphead h2"),
    doors: document.querySelectorAll(".door").length,
    navMapItem: !![...document.querySelectorAll(".snav .drop a")].find(a => a.getAttribute("href") === "map.html#map"),
  }));
  console.log("MAP:", JSON.stringify(mapok));
  await page.evaluate(() => document.querySelector(".maphead").scrollIntoView({ behavior: "auto" }));
  await page.waitForTimeout(700);
  await snap("r15-maphead.png", true);
  await page.evaluate(() => document.querySelector(".doors").scrollIntoView({ behavior: "auto", block: "center" }));
  await page.waitForTimeout(700);
  await snap("r15-doors.png", true);

  // ---- mobile manifesto ----
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.evaluate(async () => {
    const bed = document.getElementById("fieldbed");
    const end = bed.getBoundingClientRect().bottom + window.scrollY + 300;
    for (let y = 0; y <= end; y += 240) { window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 100)); }
  });
  await page.waitForTimeout(1200);
  const mob = await page.evaluate(() => ({ popped: document.querySelectorAll(".bub.pop").length }));
  console.log("MOBILE:", JSON.stringify(mob));
  await snap("r15-mobile-field.png", true);

  console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "NO CONSOLE ERRORS");
  await browser.close();
})();
