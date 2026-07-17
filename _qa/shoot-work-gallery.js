/* Work gallery QA: filterable grid, uniform cards+covers, house links,
   graceful logos, 0 broken imgs, 0 errors. */
const { chromium } = require("playwright-core");
const path = require("path");
const root = "file:///C:/Users/User/coliving-portfolio/";
(async () => {
  const b = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = [];
  // logo PNGs don't exist yet (wired for later, self-removed) — those 404s are expected, not failures
  p.on("console", m => { if (m.type() === "error" && !/ERR_FILE_NOT_FOUND/.test(m.text())) errs.push(m.text()); });
  p.on("pageerror", e => errs.push("PAGEERROR: " + e.message));

  await p.goto(root + "work.html", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);

  const info = await p.evaluate(() => {
    const cards = [...document.querySelectorAll("#wGal .exp-card")];
    const byType = {};
    cards.forEach(c => { const t = c.getAttribute("data-type"); byType[t] = (byType[t] || 0) + 1; });
    const medias = [...document.querySelectorAll("#wGal .exp-media")].map(m => {
      const r = m.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) };
    });
    const cardW = [...document.querySelectorAll("#wGal .exp-card")].map(c => Math.round(c.getBoundingClientRect().width));
    const houses = cards.filter(c => c.tagName === "A" && (c.getAttribute("href") || "").includes("project.html"));
    const broken = [...document.querySelectorAll("img")].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute("src"));
    return {
      total: cards.length, byType, chips: document.querySelectorAll("#wFilters .chip").length,
      logosInDom: document.querySelectorAll(".exp-logo").length,
      houseLinks: houses.length,
      coverWuniform: new Set(medias.map(m => m.w)).size, coverHuniform: new Set(medias.map(m => m.h)).size,
      cardWuniform: new Set(cardW).size, sampleCover: medias[0], broken
    };
  });
  console.log("cards:", info.total, "byType:", JSON.stringify(info.byType), "chips:", info.chips);
  console.log("cover sizes — distinct widths:", info.coverWuniform, "distinct heights:", info.coverHuniform, "sample:", JSON.stringify(info.sampleCover));
  console.log("card distinct widths:", info.cardWuniform, "| house links:", info.houseLinks, "| logos left in DOM:", info.logosInDom);
  console.log("broken imgs:", JSON.stringify(info.broken));
  await p.screenshot({ path: path.join(__dirname, "work-gallery-all.png"), fullPage: true });

  // filter to Work
  await p.click('.chip[data-type="work"]');
  await p.waitForTimeout(500);
  const workVisible = await p.evaluate(() => [...document.querySelectorAll("#wGal .exp-card")].filter(c => !c.classList.contains("hide")).length);
  const workType = await p.evaluate(() => [...document.querySelectorAll("#wGal .exp-card")].filter(c => !c.classList.contains("hide")).every(c => c.getAttribute("data-type") === "work"));
  console.log("filter Work -> visible:", workVisible, "all work-type:", workType);
  await p.screenshot({ path: path.join(__dirname, "work-gallery-filtered.png") });

  // back to All
  await p.click('.chip[data-type="all"]');
  await p.waitForTimeout(400);
  const allVisible = await p.evaluate(() => [...document.querySelectorAll("#wGal .exp-card")].filter(c => !c.classList.contains("hide")).length);
  console.log("filter All -> visible:", allVisible);

  // mobile
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(__dirname, "work-gallery-mobile.png"), fullPage: true });

  console.log(errs.length ? "ERRORS: " + errs.join("; ") : "no console/page errors: YES");
  const pass = info.total === 13 && info.coverWuniform === 1 && info.coverHuniform === 1 && info.houseLinks === 3 &&
    info.broken.length === 0 && workVisible === 4 && workType && allVisible === 13 && !errs.length;
  console.log(pass ? "\n✅ ALL PASSED" : "\n❌ CHECK ABOVE");
  await b.close();
})();
