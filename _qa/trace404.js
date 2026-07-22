const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const p = await b.newPage();
  p.on('response', r => { if (r.status() === 404) console.log('404:', r.url()); });
  await p.goto('http://localhost:8123/tower.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => scrollTo(0, innerHeight * 6));
  await p.waitForTimeout(3000);
  await b.close();
  console.log('done');
})();
