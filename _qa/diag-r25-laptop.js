/* R25 diag: laptop viewport (1366x768) — no stacked bubbles, overlays pinned,
   whatif appears when heading leaves, symmetric side padding. */
const { chromium } = require("playwright-core");
const path = require("path");
const root = "file:///C:/Users/User/coliving-portfolio/";

(async () => {
  const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });

  for (const vp of [{ w: 1366, h: 768, tag: "laptop" }, { w: 1440, h: 950, tag: "desk" }]) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(root + "manifesto.html", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await page.evaluate(() => {
      const bed = document.getElementById("fieldbed");
      window.scrollTo({ top: bed.getBoundingClientRect().top + window.scrollY + 10, behavior: "auto" });
    });
    await page.waitForTimeout(900);
    const arrive = await page.evaluate(() => {
      const rs = [...document.querySelectorAll(".bub")].map(b => b.getBoundingClientRect());
      let ov = 0;
      for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
        const a = rs[i], b = rs[j];
        if (a.left < b.right - 6 && b.left < a.right - 6 && a.top < b.bottom - 6 && b.top < a.bottom - 6) ov++;
      }
      const padL = Math.min(...rs.map(r => r.left));
      const padR = Math.min(...rs.map(r => window.innerWidth - r.right));
      return {
        overlapsGray: ov, padL: Math.round(padL), padR: Math.round(padR),
        show: document.getElementById("field").classList.contains("show"),
        prompt: !!document.querySelector(".stageprompt"),
        note: !!document.querySelector(".stagenote"),
        whatifVisible: getComputedStyle(document.getElementById("whatif")).opacity,
      };
    });
    // scroll to end -> all popped, check card overlaps
    const bedInfo = await page.evaluate(() => { const r = document.getElementById("fieldbed").getBoundingClientRect(); return { top: r.top + window.scrollY, h: r.height, vh: window.innerHeight }; });
    await page.evaluate(({ top, h, vh }) => window.scrollTo({ top: top + (h - vh) * 0.999, behavior: "auto" }), bedInfo);
    await page.waitForTimeout(1500);
    const end = await page.evaluate(() => {
      const rs = [...document.querySelectorAll(".bub")].map(b => b.getBoundingClientRect());
      let ov = 0;
      for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
        const a = rs[i], b = rs[j];
        if (a.left < b.right - 6 && b.left < a.right - 6 && a.top < b.bottom - 6 && b.top < a.bottom - 6) ov++;
      }
      return { popped: document.querySelectorAll(".bub.pop").length, overlapsCards: ov };
    });
    await page.screenshot({ path: path.join(__dirname, "r25-" + vp.tag + "-end.png") });
    console.log(vp.tag + " ARRIVE:", JSON.stringify(arrive), "END:", JSON.stringify(end), errors.length ? "ERRORS: " + errors.join("|") : "no errors");
    if (vp.tag === "laptop") {
      await page.evaluate(({ top, h, vh }) => window.scrollTo({ top: top + 10, behavior: "auto" }), bedInfo);
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(__dirname, "r25-laptop-arrival.png") });
    }
    await page.close();
  }
  await browser.close();
})();
