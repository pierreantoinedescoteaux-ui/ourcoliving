const { chromium } = require('./node_modules/playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const [t, w, h] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
    const pg = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message));
    await pg.goto('http://127.0.0.1:8123/map.html', { waitUntil: 'load' }); await pg.waitForTimeout(2500);
    await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(800);
    const a = await pg.evaluate(() => document.getElementById('caroTrack').scrollLeft); await pg.waitForTimeout(2500);
    const c = await pg.evaluate(() => document.getElementById('caroTrack').scrollLeft);
    await pg.locator('.caro').screenshot({ path: __dirname + '/diag-caro-' + t + '.png' }); await pg.locator('#stage').screenshot({ path: __dirname + '/diag-pins-' + t + '.png' });
    const pres = await pg.evaluate(() => [...document.querySelectorAll('#presets .p')].map(x => x.textContent));
    console.log(t, 'carousel moved', Math.round(c - a), 'px in 2.5s', JSON.stringify(pres), errs);
  }
  await b.close();
})();
