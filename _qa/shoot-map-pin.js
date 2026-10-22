/* Map "you" pin from the quiz: errors, pin inside the chart, axes set. Run: node _qa/shoot-map-pin.js */
const { chromium } = require('./node_modules/playwright-core');
const path = require('path');
const B = 'file:///' + path.resolve(__dirname, '..').split(String.fromCharCode(92)).join('/') + '/';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' }); let fails = 0;
  for (const [tag, w, h] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
    const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage(); const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.goto(B + 'map.html?you=1,3,6,5,,2,4&x=time&y=power#map', { waitUntil: 'load' }); await page.waitForTimeout(2200);
    const r = await page.evaluate(() => { const p = document.querySelector('.youpin'), c = document.getElementById('chart').getBoundingClientRect(), b = p && p.getBoundingClientRect();
      return { pin: !!p, inside: b && b.left >= c.left - 20 && b.right <= c.right + 20 && b.top >= c.top - 60 && b.bottom <= c.bottom + 10, ax: document.getElementById('ax').value, ay: document.getElementById('ay').value,
        txt: document.getElementById('fittxt').textContent.slice(0, 30), side: document.documentElement.scrollWidth - innerWidth }; });
    console.log(tag, JSON.stringify(r), errs.length ? 'ERR ' + errs.join('|') : '');
    if (!r.pin || !r.inside || r.ax !== 'time' || r.ay !== 'power' || r.side > 1 || errs.length) fails++;
    await page.locator('#stage').screenshot({ path: __dirname + '/mappin-' + tag + '.png' });
    const p2 = await page.context().newPage(); const e2 = []; p2.on('pageerror', e => e2.push(e.message));
    await p2.goto(B + 'map.html#map', { waitUntil: 'load' }); await p2.waitForTimeout(1200);
    if (await p2.$('.youpin') || e2.length) { fails++; console.log('plain map broke', e2); }
  }
  await browser.close(); console.log(fails ? fails + ' problem(s)' : 'ALL GREEN'); process.exit(fails ? 1 : 0);
})();
