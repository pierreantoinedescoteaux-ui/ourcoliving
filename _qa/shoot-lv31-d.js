/* Slice D verification: networks.html, how-to.html, community.html
   + rebrand check (brand="Our Coliving", footer keeps P-A's name) +
   resources.html regression spot check. Playwright via real Chrome. */
const { chromium } = require("playwright-core");
const path = require("path");
const base = "http://localhost:8123/";

const PAGES = ["networks.html", "how-to.html", "community.html", "resources.html"];

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  let anyErr = false;

  for (const url of PAGES) {
    const errors = [];
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    page.on("console", (msg) => { if (msg.type() === "error") errors.push("console.error: " + msg.text()); });

    await page.goto(base + url, { waitUntil: "networkidle" }).catch((e) => errors.push("goto fail: " + e.message));
    await page.waitForTimeout(900);

    const brand = await page.textContent(".snav .brand").catch(() => null);
    const sig = await page.textContent(".sfooter .sig").catch(() => null);
    const copy = await page.textContent(".fby").catch(() => null);

    console.log("=== " + url + " ===");
    console.log("brand:", brand);
    console.log("footer sig:", sig);
    console.log("footer copy line:", copy);
    console.log("errors:", errors.length ? errors : "none");
    if (errors.length) anyErr = true;

    // desktop screenshot
    const slug = url.replace(".html", "");
    await page.screenshot({ path: path.join(__dirname, "lv31-d-" + slug + "-desktop.png"), fullPage: true });

    // phone screenshot
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(__dirname, "lv31-d-" + slug + "-phone.png"), fullPage: true });

    await page.close();
  }

  await browser.close();
  console.log(anyErr ? "\nRESULT: ERRORS FOUND" : "\nRESULT: CLEAN");
})();
