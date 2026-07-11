const { chromium } = require("playwright-core");
const root = "file:///C:/Users/User/coliving-portfolio/";
(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  page.on("pageerror", e => console.log("PAGEERROR:", e.message));
  await page.goto(root + "map.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const out = await page.evaluate(async () => {
    const track = document.getElementById("caroTrack");
    const log = [];
    track.scrollTo({ left: 0, behavior: "auto" });
    await new Promise(r => setTimeout(r, 300));
    log.push(["start", track.scrollLeft, track.scrollWidth, track.clientWidth]);
    document.getElementById("caroPrev").click();
    for (const d of [200, 600, 1200, 2000]) {
      await new Promise(r => setTimeout(r, d));
      log.push(["after prev +" + d, track.scrollLeft]);
    }
    return log;
  });
  console.log(JSON.stringify(out));
  await browser.close();
})();
