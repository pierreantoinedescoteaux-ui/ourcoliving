const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage();
  p.on('response', r => { if (r.status() >= 400) console.log(r.status(), r.url()); });
  for (const pg of process.argv.slice(2)) {
    await p.goto('http://localhost:8123/' + pg, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1200);
  }
  await b.close();
})();
