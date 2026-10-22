/* Hub + toolbox QA (Wave 2/3): errors, sideways scroll, sections, cards open,
   strip follows. Runs on files directly, no server needed.
   Run: node _qa/shoot-hub.js */
const { chromium } = require('./node_modules/playwright-core');
const path = require('path');
const B = 'file:///' + path.resolve(__dirname, '..').split(String.fromCharCode(92)).join('/') + '/';
const OUT = __dirname + '/hub-';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  let fails = 0;
  for (const [w, h] of [[1512, 950], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    for (const [name, p] of [['themes', 'themes.html'], ['legal', 'themes.html#legal'], ['toolbox', 'how-to.html']]) {
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', e => errs.push(e.message));
      page.on('console', m => { if (m.type() === 'error' && !/favicon|net::ERR|ERR_FILE/.test(m.text())) errs.push(m.text()); });
      await page.goto(B + p, { waitUntil: 'load' }); await page.waitForTimeout(1500);
      const r = await page.evaluate(() => ({
        sideways: document.documentElement.scrollWidth - innerWidth,
        areas: document.querySelectorAll('.area').length,
        cards: document.querySelectorAll('.choice').length, rows: document.querySelectorAll('.qrow').length,
        grids: document.querySelectorAll('.glance table').length,
        ways: document.querySelectorAll('.way').length,
        soon: document.querySelectorAll('.soon').length,
        tags: document.querySelectorAll('.tag').length,
        y: Math.round(scrollY)
      }));
      if (name === 'themes') {
        const q = await page.$('.qbtn'); await q.scrollIntoViewIfNeeded(); await q.click(); await page.waitForTimeout(400); const b = await page.$('.qrow.open .cbtn'); await b.click(); await page.waitForTimeout(500);
        r.opened = await page.evaluate(() => !!document.querySelector('.choice.open .cfull p') && document.querySelectorAll('.qrow.open').length === 1);
        await page.screenshot({ path: OUT + 'card-' + w + '.png' });
        await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
        await page.screenshot({ path: OUT + 'top-' + w + '.png' });
      }
      if (name === 'toolbox') await page.screenshot({ path: OUT + 'toolbox-' + w + '.png' });
      let bad = errs.length || r.sideways > 1;
      if (name === 'themes' && (r.areas !== 9 || r.cards < 40 || !r.opened)) bad = true;
      if (name === 'legal' && r.y < 300) bad = true;
      if (bad) fails++;
      console.log((bad ? 'FAIL ' : 'ok   ') + w + ' ' + name, JSON.stringify(r), errs.slice(0, 3).join(' | '));
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  console.log(fails ? fails + ' FAILED' : 'ALL GREEN');
})();
