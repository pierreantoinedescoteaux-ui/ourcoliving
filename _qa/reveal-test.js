const { chromium } = require("playwright-core");
(async () => {
  const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
  for (const page of ["about.html", "project.html?p=montreal"]) {
    for (const [label, step, delay] of [["fast-audit", 600, 60], ["human", 250, 180]]) {
      const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      await p.goto("file:///C:/Users/User/coliving-portfolio/" + page, { waitUntil: "networkidle" });
      await p.evaluate(async ({step, delay}) => {
        const h = document.body.scrollHeight;
        for (let y = 0; y <= h; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, delay)); }
      }, {step, delay});
      await p.waitForTimeout(800);
      const r = await p.evaluate(() => {
        const all = document.querySelectorAll(".reveal").length;
        const lit = document.querySelectorAll(".reveal.in, .reveal.on, .reveal.show, .reveal.visible").length;
        // find what class the observer adds: sample a revealed one
        const sample = document.querySelector(".reveal");
        return { all, lit, cls: sample ? sample.className : "none" };
      });
      console.log(page, label, JSON.stringify(r));
      await p.close();
    }
  }
  await b.close();
})();
