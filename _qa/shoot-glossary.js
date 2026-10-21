/* Glossary book QA: button, underlines, hover card, open, search, letters, close.
   Run: node _qa/shoot-glossary.js   (server on :8123) */
const { chromium } = require('./node_modules/playwright-core');
const B = 'http://localhost:8123/';
const OUT = __dirname + '/gl-';
const PAGES = [['type', 'type.html?t=cohousing&live'], ['map', 'map.html?live'], ['projects', 'projects.html?live'], ['index', 'index.html?live'], ['why', 'why.html?live']];
const SIZES = [[1512, 950], [390, 844]];
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  let fails = 0;
  for (const [w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 500 });
    for (const [name, path] of PAGES) {
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', e => errs.push(e.message));
      page.on('console', m => { if (m.type() === 'error' && !/favicon|net::ERR/.test(m.text())) errs.push(m.text()); });
      await page.goto(B + path, { waitUntil: 'load' }); await page.waitForTimeout(2600);
      const r = await page.evaluate(() => ({
        btn: !!document.querySelector('.gl-btn'),
        terms: document.querySelectorAll('.gl-term').length,
        sideways: document.documentElement.scrollWidth - innerWidth
      }));
      if (name === 'type') {
        const t = await page.$('.gl-term');
        if (t) {
          await t.scrollIntoViewIfNeeded();
          if (w > 500) await t.hover(); else await t.tap();
          await page.waitForTimeout(400);
          r.card = await page.evaluate(() => { const c = document.querySelector('.gl-card.show'); return c ? c.innerText.slice(0, 60) : null; });
          if (w > 500) await page.screenshot({ path: OUT + 'card-' + w + '.png' });
        }
        await page.click('.gl-btn', { force: true }); await page.waitForTimeout(1300);
        r.open = await page.evaluate(() => !!document.querySelector('.gl-ov.open.ready') && document.querySelectorAll('.gl-entry').length);
        await page.screenshot({ path: OUT + 'open-' + w + '.png' });
        await page.fill('.gl-search', 'land trust'); await page.waitForTimeout(300);
        r.search = await page.evaluate(() => [...document.querySelectorAll('.gl-entry h3')].map(e => e.textContent).join(', '));
        await page.screenshot({ path: OUT + 'search-' + w + '.png' });
        await page.fill('.gl-search', ''); await page.click('.gl-az button[data-l="S"]'); await page.waitForTimeout(700);
        r.letterS = await page.evaluate(() => { const l = document.querySelector('.gl-letter[data-letter="S"]'), box = document.querySelector('.gl-list').getBoundingClientRect(); return !!l && Math.abs(l.getBoundingClientRect().top - box.top) < 80; });
        await page.keyboard.press('Escape'); await page.waitForTimeout(600);
        r.closed = await page.evaluate(() => !document.querySelector('.gl-ov.open'));
      }
      let bad = errs.length || !r.btn || r.sideways > 1;
      if (name === 'type' && (!r.terms || !r.card || !r.open || !/Community land trust/.test(r.search || '') || !r.closed)) bad = true;
      if (bad) fails++;
      console.log((bad ? 'FAIL ' : 'ok   ') + w + ' ' + name, JSON.stringify(r), errs.slice(0, 3).join(' | '));
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  console.log(fails ? fails + ' FAILED' : 'ALL GREEN');
})();
