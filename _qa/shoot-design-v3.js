/* Design for Connection v3 QA — full-height carousel, popup + scroll-lock,
   matched peeks, quick-link, always-open budget, deep link, mobile, broken imgs, errors. */
const { chromium } = require("playwright-core");
const path = require("path");
const root = "file:///C:/Users/User/coliving-portfolio/";
const shot = (p, n) => p.screenshot({ path: path.join(__dirname, n), fullPage: false });

(async () => {
  const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", e => errors.push("PAGEERROR: " + e.message));
  const broken = () => page.evaluate(() => [...document.querySelectorAll("img")].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute("src")));

  await page.goto(root + "design.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  // 1) carousel full-height + title above
  const caro = await page.evaluate(() => {
    const s = document.querySelector(".slide.active");
    const media = s && s.querySelector(".s-media");
    const top = s && s.querySelector(".s-top");
    return {
      slides: document.querySelectorAll(".slide").length,
      mediaH: media ? Math.round(media.getBoundingClientRect().height) : 0,
      titleAbove: (top && media) ? (top.getBoundingClientRect().bottom <= media.getBoundingClientRect().top + 2) : false,
      vh: window.innerHeight,
    };
  });
  console.log("1) carousel:", JSON.stringify(caro), "-> full-height?", caro.mediaH > caro.vh * 0.6, "title above?", caro.titleAbove);
  await page.screenshot({ path: path.join(__dirname, "v3-design-full.png"), fullPage: true });

  // 2) budget always open by default
  const budgetOpen = await page.evaluate(() => {
    const b = document.querySelector(".bud-body");
    return b ? b.getBoundingClientRect().height > 100 : false;
  });
  console.log("2) budget open by default:", budgetOpen);

  // 3) quick-link jump menu opens a feeling (popup) + scroll lock
  await page.click('.js-pill[data-jump="2"]');
  await page.waitForTimeout(700);
  const afterJump = await page.evaluate(() => ({
    bankOn: document.querySelector("#bankAll").classList.contains("on"),
    locked: document.body.classList.contains("dfc-locked"),
    cur: (document.querySelector(".tsec.cur") || {}).id || null,
    hash: location.hash,
  }));
  console.log("3) quick-link -> popup:", JSON.stringify(afterJump), "scroll-locked?", afterJump.locked);

  // 3b) scroll lock really holds (body shouldn't scroll)
  const scrollHeld = await page.evaluate(() => {
    const before = window.scrollY; window.scrollTo(0, 4000); const after = window.scrollY; window.scrollTo(0, before);
    return after === before;
  });
  console.log("3b) page scroll locked while open:", scrollHeld);
  await shot(page, "v3-design-popup.png");

  // 4) peeks present + full height beside content
  const peeks = await page.evaluate(() => {
    const l = document.querySelector(".peek-l"), r = document.querySelector(".peek-r");
    const vis = el => el && getComputedStyle(el).visibility !== "hidden" && el.classList.contains("showp");
    return { count: document.querySelectorAll(".peek").length, lVis: vis(l), rVis: vis(r), h: l ? Math.round(l.getBoundingClientRect().height) : 0, vh: window.innerHeight };
  });
  console.log("4) peeks:", JSON.stringify(peeks), "-> full-height beside?", peeks.h > peeks.vh * 0.7);

  // 5) close returns + unlocks
  await page.click(".tsec.cur .t-close");
  await page.waitForTimeout(500);
  const closed = await page.evaluate(() => ({ bankOn: document.querySelector("#bankAll").classList.contains("on"), locked: document.body.classList.contains("dfc-locked") }));
  console.log("5) close popup -> unlocked:", !closed.locked && !closed.bankOn);

  // 6) click active slide opens (zoom path) + all 6 art-directed variants exist
  await page.click(".slide.active .s-media");
  await page.waitForTimeout(900);
  const variants = await page.evaluate(() => [...document.querySelectorAll(".tsec")].map(s => s.getAttribute("data-v")).join(","));
  console.log("6) slide-click opened; art-directed variants:", variants);
  const brokenOpen = await broken();

  // 7) deep link (force a real document load — a same-page #hash goto does not reload)
  await page.goto("about:blank");
  await page.goto(root + "design.html#creativity", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const deep = await page.evaluate(() => ({ hash: location.hash, cur: (document.querySelector(".tsec.cur") || {}).id, locked: document.body.classList.contains("dfc-locked") }));
  console.log("7) deep link #creativity:", JSON.stringify(deep));

  // 8) mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root + "design.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.click(".slide.active .s-media").catch(() => {});
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(__dirname, "v3-design-mobile.png"), fullPage: true });
  const brokenMobile = await broken();

  console.log("broken imgs (desktop open):", JSON.stringify(brokenOpen), "| (mobile):", JSON.stringify(brokenMobile));
  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "NO CONSOLE/PAGE ERRORS");
  await browser.close();
})();
