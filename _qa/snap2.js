const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  for (const [n, w, h] of [['index-desktop', 1920, 1080], ['index-laptop', 1280, 620], ['type-laptop', 1280, 620]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('file:///C:/Users/User/coliving-portfolio/' + n.split('-')[0] + '.html');
    await p.waitForTimeout(1200);
    await p.screenshot({ path: 'snap-' + n + '.png' });
    await p.close();
  }
  await b.close(); console.log('done');
})();
