const { chromium } = require("playwright-core");
const path = require("path");
const root = "file:///C:/Users/User/coliving-portfolio/";
(async () => {
  const b = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = [];
  p.on("pageerror", e => errs.push("PAGEERROR: " + e.message));
  await p.goto(root + "story.html", { waitUntil: "networkidle" });
  await p.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y <= h; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => ({
    juxtas: document.querySelectorAll(".juxta").length,
    juxtaImgs: document.querySelectorAll(".juxta img").length,
    chapImgs: document.querySelectorAll(".chap-img img").length,
    placeholders: document.querySelectorAll(".ph, .v-ph").length,
    broken: [...document.querySelectorAll("img")].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute("src")),
  }));
  await p.screenshot({ path: path.join(__dirname, "story-full.png"), fullPage: true });
  console.log("juxtas:", r.juxtas, "| juxta imgs:", r.juxtaImgs, "| single chap imgs:", r.chapImgs, "| placeholders left:", r.placeholders);
  console.log("broken:", JSON.stringify(r.broken));
  // mobile
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto(root + "story.html", { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  const mb = await p.evaluate(() => [...document.querySelectorAll("img")].filter(i => i.complete && i.naturalWidth === 0).length);
  console.log("mobile broken:", mb);
  console.log(errs.length ? "ERRORS: " + errs.join("; ") : "no page errors: YES");
  await b.close();
})();
