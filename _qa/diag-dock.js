const { chromium } = require("playwright-core");
const root = "file:///C:/Users/User/coliving-portfolio/";
(async () => {
  const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const out = await page.evaluate(async () => {
    const bed = document.getElementById("fieldbed");
    const end = bed.offsetTop + bed.offsetHeight;
    for (let y = 0; y <= end; y += 260) { window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 120)); }
    await new Promise(r => setTimeout(r, 800));
    return [...document.querySelectorAll(".bub")].map(b => ({
      id: b.id, pop: b.classList.contains("pop"),
      top: Math.round(b.getBoundingClientRect().top),
      bandH: b.parentElement.offsetHeight,
    }));
  });
  console.log(JSON.stringify(out, null, 0));
  await browser.close();
})();
