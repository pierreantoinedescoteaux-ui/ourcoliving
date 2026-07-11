/* Round 12 QA: landing v5, atlas v3 (carousel + symbols + full-guide popup), field guide bright */
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
    await page.waitForTimeout(1300);
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y <= h; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);
    if (opts.hover) { await page.hover(opts.hover).catch(e => console.log("hover fail", e.message)); await page.waitForTimeout(700); }
    if (opts.click) { await page.click(opts.click).catch(e => console.log("click fail", e.message)); await page.waitForTimeout(1300); }
    if (opts.scrollModal) { await page.evaluate(() => { const m = document.getElementById("modal"); if (m) m.scrollTop = m.scrollHeight; }); await page.waitForTimeout(600); }
    await page.screenshot({ path: path.join(__dirname, name), fullPage: !opts.viewportOnly });
    console.log("shot:", name);
  }

  await shoot("index.html", "r12-home.png");
  await shoot("map.html", "r12-atlas-full.png");
  await shoot("map.html", "r12-atlas-carousel-hover.png", { hover: '.slide[data-slug="cohousing"]', viewportOnly: true });
  await shoot("map.html", "r12-atlas-node-hover.png", { hover: '.node[data-slug="kibbutz"]', viewportOnly: true });
  await shoot("map.html", "r12-atlas-popup-top.png", { click: '.node[data-slug="intergenerational"]', viewportOnly: true });
  await shoot("map.html", "r12-atlas-popup-bottom.png", { click: '.node[data-slug="intergenerational"]', viewportOnly: true, scrollModal: true });
  await shoot("type.html?t=hacker-house", "r12-type.png");

  // mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await shoot("index.html", "r12-home-mobile.png");
  await shoot("map.html", "r12-atlas-mobile.png");

  console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "NO CONSOLE ERRORS");
  await browser.close();
})();
