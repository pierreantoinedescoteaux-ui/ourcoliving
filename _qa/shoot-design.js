/* Design for Connection v2.2 QA: real theme images, single-section pager (side arrows + swipe),
   worded budget button, deep link, mobile */
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

  async function shoot(url, name, opts = {}) {
    await page.goto(root + url, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(1200);
    if (opts.click) { for (const sel of [].concat(opts.click)) { await page.click(sel).catch(e => console.log("click fail", sel, e.message)); await page.waitForTimeout(900); } }
    if (opts.fullScroll) {
      await page.evaluate(async () => {
        const h = document.documentElement.scrollHeight;
        for (let y = 0; y <= h; y += 400) { window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 60)); }
        window.scrollTo({ top: 0, behavior: "auto" });
      });
      await page.waitForTimeout(500);
    }
    if (opts.scrollTo) { await page.evaluate(sel => { const el = document.querySelector(sel); if (el) el.scrollIntoView({ behavior: "auto", block: "start" }); }, opts.scrollTo); await page.waitForTimeout(500); }
    await page.screenshot({ path: path.join(__dirname, name), fullPage: !opts.viewportOnly });
    console.log("shot:", name);
  }

  await shoot("design.html", "dfc3-full.png", { fullScroll: true });
  await shoot("design.html", "dfc3-carousel-img.png", { viewportOnly: true, scrollTo: ".designing" });
  await shoot("design.html", "dfc3-pager-open.png", { click: ".slide.active .open-btn", viewportOnly: true });
  await shoot("design.html", "dfc3-pager-next.png", { click: [".slide.active .open-btn", ".b-next"], viewportOnly: true });
  await shoot("design.html", "dfc3-pager-prev-wrap.png", { click: [".slide.active .open-btn", ".b-prev"], viewportOnly: true });
  await shoot("design.html", "dfc3-budget-btn.png", { scrollTo: ".budget", viewportOnly: true });
  await shoot("design.html", "dfc3-budget-open.png", { click: "#budHead", scrollTo: ".budget", viewportOnly: true });
  await shoot("design.html#creativity", "dfc3-deeplink.png", { viewportOnly: true });

  // mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await shoot("design.html", "dfc3-mobile.png", { fullScroll: true });
  await shoot("design.html", "dfc3-mobile-pager.png", { click: ".slide.active .open-btn", viewportOnly: true });

  // swipe simulation on mobile pager
  await page.goto(root + "design.html#connection", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const b = document.getElementById("bankAll");
    const t = (type, x) => { const ev = new Event(type, { bubbles: true }); const pt = [{ clientX: x, clientY: 300 }]; ev.touches = pt; ev.changedTouches = pt; b.dispatchEvent(ev); };
    t("touchstart", 320); t("touchend", 80);
  });
  await page.waitForTimeout(900);
  const afterSwipe = await page.evaluate(() => location.hash);
  console.log("hash after swipe left from #connection:", afterSwipe);
  await page.screenshot({ path: path.join(__dirname, "dfc3-mobile-swiped.png"), fullPage: false });

  console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "NO CONSOLE ERRORS");
  await browser.close();
})();
