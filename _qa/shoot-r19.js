/* Round 19 QA: about.html + story.html (self-contained pages, no styles.css/app.js) */
const { chromium } = require("playwright-core");
const path = require("path");
const root = "file:///C:/Users/User/coliving-portfolio/";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  const errors = [];
  function makePageWithErrors(page) {
    page.on("console", m => { if (m.type() === "error") errors.push("[about/story] " + m.text()); });
    page.on("pageerror", e => errors.push("PAGEERROR: " + e.message));
  }

  // ---- DESKTOP page ----
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  makePageWithErrors(page);

  async function snap(name, viewportOnly) {
    await page.screenshot({ path: path.join(__dirname, name), fullPage: !viewportOnly });
    console.log(JSON.stringify({ shot: name }));
  }

  // ================================================================
  // 1. about.html — desktop
  // ================================================================
  await page.goto(root + "about.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);

  const aboutAsserts = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const portrait = document.querySelector("img.slot-img");
    const cards = document.querySelectorAll(".bcard");
    const doorLinks = [...document.querySelectorAll(".door")];
    const storyLink = doorLinks.find(a => a.href && a.href.includes("story.html"));
    const workLink = doorLinks.find(a => a.href && a.href.includes("work.html"));
    const footer = document.querySelector(".sfooter");
    const totop = document.querySelector(".stotop");
    const bodyText = document.body.innerText || "";
    const noEditMarkers = !bodyText.match(/\[edit/i);
    return {
      h1NonEmpty: !!(h1 && h1.textContent.trim()),
      portraitImgPresent: !!portrait,
      bringCardCount: cards.length,
      doorStoryPresent: !!storyLink,
      doorWorkPresent: !!workLink,
      footerPresent: !!footer,
      tototopPresent: !!totop,
      noEditMarkers: noEditMarkers,
    };
  });
  console.log(JSON.stringify({ page: "about.html", asserts: aboutAsserts }));
  await snap("r19-about.png", false);

  // ================================================================
  // 2. story.html — desktop
  // ================================================================
  await page.goto(root + "story.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);

  // Take top screenshot before scrolling
  await snap("r19-story-top.png", true);

  // Scroll through entire page to trigger reveals
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

  // Scroll to the "houses" chapter for mid screenshot
  await page.evaluate(() => {
    const el = document.getElementById("houses");
    if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
  });
  await page.waitForTimeout(600);
  await snap("r19-story-mid.png", true);

  // Scroll back to top for full-page shot
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.waitForTimeout(400);

  const storyAsserts = await page.evaluate(() => {
    const chaps = document.querySelectorAll(".chap");
    const realImgs = document.querySelectorAll("img.slot-img");
    const placeholders = document.querySelectorAll(".ph");
    // Find the transparency band — should be after chapter with id="houses"
    const housesChap = document.getElementById("houses");
    let transBandAfterHouses = false;
    if (housesChap) {
      let next = housesChap.nextElementSibling;
      while (next) {
        if (next.classList.contains("trans-band")) { transBandAfterHouses = true; break; }
        next = next.nextElementSibling;
      }
    }
    const mailtoLink = document.querySelector('a[href^="mailto:"]');
    const bodyText = document.body.innerText || "";
    const noEditMarkers = !bodyText.match(/\[edit/i);
    return {
      chapCount: chaps.length,
      realImgCount: realImgs.length,
      placeholderCount: placeholders.length,
      transBandAfterHouses: transBandAfterHouses,
      mailtoPresent: !!mailtoLink,
      noEditMarkers: noEditMarkers,
    };
  });
  console.log(JSON.stringify({ page: "story.html", asserts: storyAsserts }));
  await snap("r19-story-full.png", false);

  // ================================================================
  // 3. Deep link: story.html#tokyo
  // ================================================================
  await page.goto(root + "story.html#tokyo", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);

  const deepLink = await page.evaluate(() => {
    const el = document.getElementById("tokyo");
    if (!el) return { tokyoFound: false };
    const rect = el.getBoundingClientRect();
    return {
      tokyoFound: true,
      topPx: Math.round(rect.top),
      inRange: rect.top >= 0 && rect.top <= 200,
    };
  });
  console.log(JSON.stringify({ deepLink: "story.html#tokyo", result: deepLink }));

  // ================================================================
  // 4. Mobile 390x844
  // ================================================================
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
  mob.on("console", m => { if (m.type() === "error") errors.push("[mobile] " + m.text()); });
  mob.on("pageerror", e => errors.push("PAGEERROR mobile: " + e.message));

  async function snapMob(name) {
    await mob.screenshot({ path: path.join(__dirname, name), fullPage: false });
    console.log(JSON.stringify({ shot: name }));
  }

  await mob.goto(root + "about.html", { waitUntil: "networkidle" }).catch(() => {});
  await mob.waitForTimeout(1200);
  await snapMob("r19-about-mobile.png");

  await mob.goto(root + "story.html", { waitUntil: "networkidle" }).catch(() => {});
  await mob.waitForTimeout(1200);
  await snapMob("r19-story-mobile.png");

  // Assert chapters are single-column on mobile
  const mobileLayout = await mob.evaluate(() => {
    const chaps = document.querySelectorAll(".chap");
    const results = [];
    chaps.forEach(function(ch, i) {
      if (i < 3) { // check first 3 chapters
        const cols = getComputedStyle(ch).gridTemplateColumns;
        results.push({ idx: i, gridTemplateColumns: cols });
      }
    });
    return results;
  });
  // Single column means there's only one track (no space-separated pair of sizes)
  const allSingleCol = mobileLayout.every(function(r) {
    // A single column will have one value (no space between two column sizes meaning multiple columns)
    // The value should not contain two separate sizes like "X px Y px"
    const trimmed = r.gridTemplateColumns.trim();
    // Count how many "px" or "fr" or "%" tokens appear - single col = 1
    const parts = trimmed.split(/\s+/).filter(p => p.match(/\d/));
    return parts.length <= 1;
  });
  console.log(JSON.stringify({ mobile: "chaptersLayout", details: mobileLayout, allSingleColumn: allSingleCol }));

  await mob.close();

  // ================================================================
  // Summary
  // ================================================================
  console.log(errors.length
    ? JSON.stringify({ consoleErrors: errors })
    : JSON.stringify({ consoleErrors: "none" }));

  await browser.close();
})();
