/* Design for Connection v2.1 QA: hero, what-section, overlay carousel, scroll-through bank,
   sticky theme titles, collapsible budget, inspire link, deep link, mobile */
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
    if (opts.scrollBy) { await page.evaluate(px => window.scrollBy({ top: px, behavior: "auto" }), opts.scrollBy); await page.waitForTimeout(500); }
    await page.screenshot({ path: path.join(__dirname, name), fullPage: !opts.viewportOnly });
    console.log("shot:", name);
  }

  await shoot("design.html", "dfc2-full.png", { fullScroll: true });
  await shoot("design.html", "dfc2-what.png", { viewportOnly: true, scrollTo: ".what" });
  await shoot("design.html", "dfc2-carousel.png", { viewportOnly: true, scrollTo: ".designing" });
  await shoot("design.html", "dfc2-bank-open.png", { click: ".slide.active .open-btn", viewportOnly: true });
  await shoot("design.html", "dfc2-bank-sticky-mid.png", { click: ".slide.active .open-btn", scrollTo: "#sec-connection", scrollBy: 350, viewportOnly: true });
  await shoot("design.html", "dfc2-bank-scrollthrough.png", { click: ".slide.active .open-btn", scrollTo: "#sec-intimacy", viewportOnly: true });
  await shoot("design.html", "dfc2-budget-closed.png", { scrollTo: ".budget", viewportOnly: true });
  await shoot("design.html", "dfc2-budget-open.png", { click: "#budHead", scrollTo: ".budget", viewportOnly: true });
  await shoot("design.html", "dfc2-inspire.png", { scrollTo: ".inspire", viewportOnly: true });
  await shoot("design.html#mindfulness", "dfc2-deeplink.png", { viewportOnly: true });

  // mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await shoot("design.html", "dfc2-mobile.png", { fullScroll: true });
  await shoot("design.html", "dfc2-mobile-bank.png", { click: ".slide.active .open-btn", viewportOnly: true });

  console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "NO CONSOLE ERRORS");
  await browser.close();
})();
