/* Contact sheet screenshots for DFC candidate images */
const { chromium } = require("playwright-core");
const path = require("path");

const url = "file:///C:/Users/User/coliving-portfolio/_qa/contact-dfc.html";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1140, height: 900 } });

  for (let i = 1; i <= 4; i++) {
    // Show page i by toggling display
    await page.goto(url);
    await page.evaluate((pageNum) => {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const target = document.getElementById('page' + pageNum);
      if (target) target.classList.add('active');
    }, i);

    // Wait for images to load
    await page.waitForFunction(() => {
      const imgs = Array.from(document.querySelectorAll('.page.active img'));
      return imgs.length > 0 && imgs.every(img => img.complete && img.naturalWidth > 0);
    }, { timeout: 30000 });

    const outPath = path.join(__dirname, `contact-dfc-${i}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`Screenshot ${i} saved: ${outPath}`);
  }

  await browser.close();
  console.log("Done.");
})();
