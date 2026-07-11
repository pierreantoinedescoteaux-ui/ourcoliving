const { chromium } = require("playwright-core");
const root = "file:///C:/Users/User/coliving-portfolio/";
(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const out = await page.evaluate(() => {
    const w = document.getElementById("scenewrap");
    window.scrollTo({ top: w.offsetTop + w.offsetHeight * 0.45, behavior: "auto" });
    return new Promise(res => setTimeout(() => {
      const pin = document.querySelector(".scenepin").getBoundingClientRect();
      const nav = document.querySelector(".nav").getBoundingClientRect();
      const svg = document.querySelector(".scene svg").getBoundingClientRect();
      res({
        scrollY: window.scrollY,
        wrapTop: w.offsetTop, wrapH: w.offsetHeight,
        pin: { top: pin.top, h: pin.height },
        nav: { top: nav.top },
        svg: { top: svg.top, h: svg.height, w: svg.width },
        htmlScroll: document.documentElement.scrollHeight,
      });
    }, 600));
  });
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
