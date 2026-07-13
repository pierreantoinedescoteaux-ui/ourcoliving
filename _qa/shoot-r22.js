/* Round 22 QA: work.html + project.html (self-contained rework — WORK_INTRO/WORK_CASES/WORK_BEYOND + reused ABOUT_TRANSPARENCY/ABOUT_CTA) */
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
  async function stepScroll() {
    await page.evaluate(async () => {
      const total = document.body.scrollHeight;
      let y = 0;
      while (y < total) {
        y += 400;
        window.scrollTo({ top: y, behavior: "auto" });
        await new Promise(r => setTimeout(r, 120));
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    await page.waitForTimeout(800);
  }

  // ================================================================
  // 1. work.html — desktop
  // ================================================================
  await page.goto(root + "work.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);

  const workAsserts = await page.evaluate(() => {
    const h1 = document.querySelector(".hero h1");
    const gold = document.querySelector(".gold-band");
    const goldHasLine = !!(gold && gold.querySelector(".gb-line") && gold.querySelector(".gb-line").textContent.trim());
    const cards = [...document.querySelectorAll("a.case-card")];
    const cardHrefs = cards.map(c => c.getAttribute("href"));
    const expectedCardHrefs = ["project.html?p=montreal", "project.html?p=growth-hub-dunbar", "project.html?p=growth-hub-shaughnessy"];
    const cardHrefsMatch = expectedCardHrefs.every((h, i) => cardHrefs[i] === h);
    const firstIsFeatured = !!(cards[0] && cards[0].dataset.featured === "true");
    const beyond = [...document.querySelectorAll(".beyond .bcard")];
    const beyondHrefs = beyond.map(c => { const a = c.querySelector("a"); return a ? a.getAttribute("href") : null; });
    const expectedBeyond = ["story.html#scale", "story.html#rooms-that-move", "story.html#hard-chapter"];
    const beyondHrefsMatch = expectedBeyond.every((h, i) => beyondHrefs[i] === h);
    const mailto = !!document.querySelector('a[href^="mailto:"]');
    const bodyText = document.body.innerText || "";
    return {
      heroTitleNonEmpty: !!(h1 && h1.textContent.trim()),
      goldBandPresent: goldHasLine,
      caseCardCount: cards.length,
      cardHrefs: cardHrefs,
      cardHrefsMatch: cardHrefsMatch,
      firstCardFeatured: firstIsFeatured,
      beyondCardCount: beyond.length,
      beyondHrefs: beyondHrefs,
      beyondHrefsMatch: beyondHrefsMatch,
      mailtoPresent: mailto,
      noEditMarkers: !bodyText.match(/\[edit/i),
    };
  });
  console.log(JSON.stringify({ page: "work.html", asserts: workAsserts }));

  await stepScroll();
  await snap("r22-work.png", false);

  // ================================================================
  // 2. project.html — default (no param) -> montreal
  // ================================================================
  await page.goto(root + "project.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);

  const defaultAsserts = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const stats = document.querySelectorAll(".stat");
    const prev = document.querySelector(".pager .pg.prev");
    const next = document.querySelector(".pager .pg.next");
    const allWork = document.querySelector('.pager .pg-all a[href="work.html"]');
    const bodyText = document.body.innerText || "";
    return {
      h1Text: h1 ? h1.textContent.trim() : null,
      h1IsMontreal: !!(h1 && h1.textContent.includes("Montr")),
      titleIsRuntime: document.title.includes("Montr"),
      statCount: stats.length,
      pagerPrevHref: prev ? prev.getAttribute("href") : null,
      pagerNextHref: next ? next.getAttribute("href") : null,
      pagerWraps: !!(prev && prev.getAttribute("href") === "project.html?p=growth-hub-shaughnessy" &&
                     next && next.getAttribute("href") === "project.html?p=growth-hub-dunbar"),
      allWorkLink: !!allWork,
      noEditMarkers: !bodyText.match(/\[edit/i),
    };
  });
  console.log(JSON.stringify({ page: "project.html (default)", asserts: defaultAsserts }));

  await stepScroll();
  await snap("r22-case-montreal.png", false);

  // ================================================================
  // 3. project.html?p=growth-hub-shaughnessy — hero must be placeholder
  // ================================================================
  await page.goto(root + "project.html?p=growth-hub-shaughnessy", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);

  const shaugAsserts = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const heroImg = document.querySelector("#pHero img");
    const heroPh = document.querySelector("#pHero .ph");
    const stats = document.querySelectorAll(".stat");
    const bodyText = document.body.innerText || "";
    return {
      h1IsShaughnessy: !!(h1 && h1.textContent.includes("Shaughnessy")),
      heroIsPlaceholder: !heroImg && !!heroPh,
      statCount: stats.length,
      noEditMarkers: !bodyText.match(/\[edit/i),
    };
  });
  console.log(JSON.stringify({ page: "project.html?p=growth-hub-shaughnessy", asserts: shaugAsserts }));
  await snap("r22-case-shaughnessy-top.png", true);

  // ================================================================
  // 4. project.html?p=bogus — must fall back to first case
  // ================================================================
  await page.goto(root + "project.html?p=bogus", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  const bogusAsserts = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return { fallbackToFirst: !!(h1 && h1.textContent.includes("Montr")) };
  });
  console.log(JSON.stringify({ page: "project.html?p=bogus", asserts: bogusAsserts }));

  // ================================================================
  // 5. Mobile 390x844
  // ================================================================
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  mob.on("console", m => { if (m.type() === "error") errors.push("[mobile] " + m.text()); });
  mob.on("pageerror", e => errors.push("PAGEERROR mobile: " + e.message));

  await mob.goto(root + "work.html", { waitUntil: "networkidle" }).catch(() => {});
  await mob.waitForTimeout(1200);
  await mob.screenshot({ path: path.join(__dirname, "r22-work-mobile.png"), fullPage: false });
  console.log(JSON.stringify({ shot: "r22-work-mobile.png" }));

  const mobCard = await mob.evaluate(() => {
    const card = document.querySelector(".case-card");
    const oneCol = s => s.trim().split(/\s+/).filter(p => p.match(/\d/)).length <= 1;
    return {
      caseCardCols: card ? getComputedStyle(card).gridTemplateColumns : null,
      caseCardSingleColumn: card ? oneCol(getComputedStyle(card).gridTemplateColumns) : false,
    };
  });
  console.log(JSON.stringify({ mobile: "work.html", details: mobCard }));

  await mob.goto(root + "project.html", { waitUntil: "networkidle" }).catch(() => {});
  await mob.waitForTimeout(1200);
  await mob.screenshot({ path: path.join(__dirname, "r22-case-mobile.png"), fullPage: false });
  console.log(JSON.stringify({ shot: "r22-case-mobile.png" }));
  await mob.close();

  // ================================================================
  // Summary
  // ================================================================
  console.log(errors.length
    ? JSON.stringify({ consoleErrors: errors })
    : JSON.stringify({ consoleErrors: "none" }));

  await browser.close();
})();
