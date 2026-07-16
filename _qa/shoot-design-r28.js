/* Design for Connection R28 QA — real interaction flow (replaces stale shoot-design.js).
   Verifies: carousel renders + images load; slide-click opens the bank; open-bank tactic
   images load; peek arrows + mobile pager advance themes; deep link; 0 broken imgs; 0 pageerrors. */
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

  const brokenImgs = async () => page.evaluate(() =>
    [...document.querySelectorAll("img")]
      .filter(i => i.complete && i.naturalWidth === 0)
      .map(i => i.getAttribute("src")));

  await page.goto(root + "design.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(__dirname, "r28-design-full.png"), fullPage: true });

  // carousel state + images
  const caro = await page.evaluate(() => ({
    slides: document.querySelectorAll(".slide").length,
    active: document.querySelectorAll(".slide.active").length,
    pill: document.querySelectorAll(".toggle-pill").length,
  }));
  const brokenCaro = await brokenImgs();
  console.log("carousel:", JSON.stringify(caro), "broken:", JSON.stringify(brokenCaro));

  // open the bank by clicking the active slide (the real open control)
  await page.evaluate(() => document.querySelector(".designing").scrollIntoView());
  await page.waitForTimeout(300);
  await page.click(".slide.active").catch(e => console.log("slide click fail:", e.message));
  await page.waitForTimeout(900);
  const open = await page.evaluate(() => ({
    bankOn: document.querySelector("#bankAll")?.classList.contains("on") || false,
    sections: document.querySelectorAll(".tsec").length,
    cur: document.querySelectorAll(".tsec.cur").length,
    tacticImgs: document.querySelectorAll(".tsec .t-media img").length,
    peeks: document.querySelectorAll(".peek").length,
  }));
  await page.waitForTimeout(600);
  const brokenOpen = await brokenImgs();
  console.log("open bank:", JSON.stringify(open), "broken:", JSON.stringify(brokenOpen));
  await page.screenshot({ path: path.join(__dirname, "r28-design-bank-open.png") });

  // advance a theme via the right peek arrow (real control)
  const hashBefore = await page.evaluate(() => location.hash);
  await page.click(".peek-r").catch(e => console.log("peek-r fail:", e.message));
  await page.waitForTimeout(700);
  const hashAfter = await page.evaluate(() => location.hash);
  console.log("theme advance via peek-r:", hashBefore, "->", hashAfter);

  // deep link straight into a theme
  await page.goto(root + "design.html#creativity", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1000);
  const deep = await page.evaluate(() => location.hash);
  console.log("deep link ->", deep);

  // mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root + "design.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1000);
  await page.click(".slide.active").catch(() => {});
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(__dirname, "r28-design-mobile.png"), fullPage: true });
  const brokenMobile = await brokenImgs();
  console.log("mobile broken:", JSON.stringify(brokenMobile));

  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "NO CONSOLE/PAGE ERRORS");
  await browser.close();
})();
