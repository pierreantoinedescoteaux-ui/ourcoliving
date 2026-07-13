/* Round 20 QA: story2.html — hiring-weighted v2 draft (vignette strip + 6 chapters + interlude + slim gold band + linked bring cards) */
const { chromium } = require("playwright-core");
const path = require("path");
const root = "file:///C:/Users/User/coliving-portfolio/";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", e => errors.push("PAGEERROR: " + e.message));

  async function snap(name, viewportOnly) {
    await page.screenshot({ path: path.join(__dirname, name), fullPage: !viewportOnly });
    console.log(JSON.stringify({ shot: name }));
  }

  // ================================================================
  // 1. story2.html — desktop
  // ================================================================
  await page.goto(root + "story2.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);

  await snap("r20-story2-top.png", true);

  const structAsserts = await page.evaluate(() => {
    const vcards = document.querySelectorAll(".vcard");
    const chaps = document.querySelectorAll(".chap");

    // weight check: vignette card height vs first chapter block height
    const vH = vcards.length ? Math.round(vcards[0].getBoundingClientRect().height) : 0;
    const cH = chaps.length ? Math.round(chaps[0].getBoundingClientRect().height) : 0;

    // interlude must be the immediately-previous element sibling of #houses
    const houses = document.getElementById("houses");
    const interlude = document.querySelector(".interlude");
    const interludeImmediatelyBeforeHouses = !!(houses && houses.previousElementSibling &&
      houses.previousElementSibling.classList.contains("interlude"));

    // slim gold band after houses, no body paragraph inside
    let goldBandAfterHouses = false, goldBandHasNoBody = false;
    if (houses) {
      let next = houses.nextElementSibling;
      while (next) {
        if (next.classList.contains("gold-band")) {
          goldBandAfterHouses = true;
          goldBandHasNoBody = next.querySelectorAll("p").length === 0;
          break;
        }
        next = next.nextElementSibling;
      }
    }

    // what-I-bring cards + hrefs
    const bcards = [...document.querySelectorAll(".bring .bcard")];
    const hrefs = bcards.map(c => { const a = c.querySelector("a"); return a ? a.getAttribute("href") : null; });
    const expectedHrefs = ["story2.html#scale", "design.html", "story2.html#rooms-that-move", "work.html"];
    const hrefsMatch = expectedHrefs.every((h, i) => hrefs[i] === h);

    // compare pill in hero
    const pill = document.querySelector(".hero .compare-pill");
    const pillLinksV1 = !!(pill && pill.getAttribute("href") === "story.html");

    const mailto = !!document.querySelector('a[href^="mailto:"]');
    const bodyText = document.body.innerText || "";
    const noEditMarkers = !bodyText.match(/\[edit/i);

    return {
      vignetteCardCount: vcards.length,
      vignetteCardHeightPx: vH,
      chapterBlockHeightPx: cH,
      vignetteSmallerThanChapter: vH > 0 && cH > 0 && vH < cH,
      chapCount: chaps.length,
      interludeExists: !!interlude,
      interludeImmediatelyBeforeHouses: interludeImmediatelyBeforeHouses,
      goldBandAfterHouses: goldBandAfterHouses,
      goldBandHasNoBody: goldBandHasNoBody,
      bringCardCount: bcards.length,
      bringHrefs: hrefs,
      bringHrefsMatch: hrefsMatch,
      comparePillLinksV1: pillLinksV1,
      mailtoPresent: mailto,
      noEditMarkers: noEditMarkers,
    };
  });
  console.log(JSON.stringify({ page: "story2.html", asserts: structAsserts }));

  // viewport shot at the interlude
  await page.evaluate(() => {
    const el = document.querySelector(".interlude");
    if (el) el.scrollIntoView({ behavior: "auto", block: "center" });
  });
  await page.waitForTimeout(700);
  await snap("r20-story2-interlude.png", true);

  // viewport shot at what-I-bring
  await page.evaluate(() => {
    const el = document.querySelector(".bring");
    if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
  });
  await page.waitForTimeout(700);
  await snap("r20-story2-bring.png", true);

  // step-scroll the whole page to trigger all reveals, then full-page shot
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.waitForTimeout(300);
  await page.evaluate(async () => {
    const total = document.body.scrollHeight;
    let y = 0;
    while (y < total) {
      y += 400;
      window.scrollTo({ top: y, behavior: "auto" });
      await new Promise(r => setTimeout(r, 120));
    }
  });
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.waitForTimeout(400);
  await snap("r20-story2-full.png", false);

  // ================================================================
  // 2. Deep link: story2.html#rooms-that-move (fresh load)
  // ================================================================
  await page.goto(root + "story2.html#rooms-that-move", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  const deepLink = await page.evaluate(() => {
    const el = document.getElementById("rooms-that-move");
    if (!el) return { found: false };
    const rect = el.getBoundingClientRect();
    return { found: true, topPx: Math.round(rect.top), inRange: rect.top >= 0 && rect.top <= 200 };
  });
  console.log(JSON.stringify({ deepLink: "story2.html#rooms-that-move", result: deepLink }));

  // ================================================================
  // 3. Mobile 390x844
  // ================================================================
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  mob.on("console", m => { if (m.type() === "error") errors.push("[mobile] " + m.text()); });
  mob.on("pageerror", e => errors.push("PAGEERROR mobile: " + e.message));

  await mob.goto(root + "story2.html", { waitUntil: "networkidle" }).catch(() => {});
  await mob.waitForTimeout(1200);
  await mob.screenshot({ path: path.join(__dirname, "r20-story2-mobile.png"), fullPage: false });
  console.log(JSON.stringify({ shot: "r20-story2-mobile.png" }));

  const mobLayout = await mob.evaluate(() => {
    const chap = document.querySelector(".chap");
    const vgrid = document.querySelector(".v-grid");
    const oneCol = s => s.trim().split(/\s+/).filter(p => p.match(/\d/)).length <= 1;
    return {
      chapCols: chap ? getComputedStyle(chap).gridTemplateColumns : null,
      chapSingleColumn: chap ? oneCol(getComputedStyle(chap).gridTemplateColumns) : false,
      vignetteCols: vgrid ? getComputedStyle(vgrid).gridTemplateColumns : null,
      vignetteSingleColumn: vgrid ? oneCol(getComputedStyle(vgrid).gridTemplateColumns) : false,
    };
  });
  console.log(JSON.stringify({ mobile: mobLayout }));
  await mob.close();

  // ================================================================
  // Summary
  // ================================================================
  console.log(errors.length
    ? JSON.stringify({ consoleErrors: errors })
    : JSON.stringify({ consoleErrors: "none" }));

  await browser.close();
})();
