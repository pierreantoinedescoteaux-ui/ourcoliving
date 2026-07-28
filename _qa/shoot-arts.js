/* Spot check for arts.html placeholder page (single-page QA per calibration rule). */
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright-core")); }
catch (e) { ({ chromium } = require("/opt/node22/lib/node_modules/playwright/index.js")); }

const base = "http://localhost:8123/";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push("console.error: " + msg.text()); });

  const resp = await page.goto(base + "arts.html", { waitUntil: "networkidle" }).catch((e) => { errors.push("goto fail: " + e.message); return null; });
  await page.waitForTimeout(900);

  console.log("status:", resp ? resp.status() : "N/A");
  const navPresent = await page.$(".snav, [data-sitenav] nav, nav").then(el => !!el).catch(() => false);
  console.log("nav element present:", navPresent);
  const h1 = await page.textContent("h1").catch(() => null);
  console.log("h1:", h1);
  console.log("errors:", errors.length ? errors : "none");

  await page.screenshot({ path: path.join(__dirname, "arts-desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(__dirname, "arts-phone.png"), fullPage: true });

  await page.close();
  await browser.close();
  console.log(errors.length ? "\nRESULT: ERRORS FOUND" : "\nRESULT: CLEAN");
})();
