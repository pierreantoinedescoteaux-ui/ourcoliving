/* Full-page QA screenshots via real Chrome (headless) + Playwright */
const { chromium } = require("playwright-core");
const path = require("path");
const root = "file:///C:/Users/User/coliving-portfolio/";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  async function shoot(url, name, opts = {}) {
    await page.goto(root + url, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(1200);
    // scroll through the page to trigger all reveals, then back to top
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y <= h; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);
    if (opts.hover) { await page.hover(opts.hover).catch(e => console.log("hover fail", e.message)); await page.waitForTimeout(700); }
    if (opts.click) { await page.click(opts.click).catch(e => console.log("click fail", e.message)); await page.waitForTimeout(1200); }
    await page.screenshot({ path: path.join(__dirname, name), fullPage: !opts.viewportOnly });
    console.log("shot:", name);
  }

  await shoot("map.html", "pw-atlas-hover.png", { hover: '.node[data-slug="cohousing"]', viewportOnly: true });
  await shoot("map.html", "pw-atlas-modal.png", { click: '.node[data-slug="entrepreneur-house"]', viewportOnly: true });
  await shoot("work.html", "pw-work.png");
  await shoot("index.html", "pw-home.png");
  await shoot("map.html", "pw-atlas.png");
  await shoot("map.html", "pw-atlas-focus.png", { click: '.node[data-slug="entrepreneur-house"]', viewportOnly: true });
  await shoot("hope.html", "pw-vision.png");
  await shoot("project.html?p=montreal", "pw-project.png");
  await shoot("story.html", "pw-story.png");

  // mobile home
  await page.setViewportSize({ width: 390, height: 844 });
  await shoot("index.html", "pw-home-mobile.png");

  await browser.close();
})();
