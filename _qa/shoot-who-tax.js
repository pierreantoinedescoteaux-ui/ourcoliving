/* QA for who.html and collective-tax.html: errors, sideways scroll, broken images, tiny text, screenshots. Run: node _qa/shoot-who-tax.js */
const { chromium } = require('./node_modules/playwright-core');
const path = require('path');
const B = 'file:///' + path.resolve(__dirname, '..').split(String.fromCharCode(92)).join('/') + '/';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  let fails = 0; const bad = m => { fails++; console.log('  FAIL', m); };
  for (const pg of ['who', 'collective-tax']) {
    for (const [tag, w, h] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: tag === 'phone' ? 2 : 1 });
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', e => errs.push(e.message));
      page.on('console', m => { if (m.type() === 'error' && !/favicon|net::ERR|ERR_FILE/.test(m.text())) errs.push(m.text()); });
      await page.goto(B + pg + '.html', { waitUntil: 'load' }); await page.waitForTimeout(900);
      await page.evaluate(async () => { for (const i of document.images) i.loading = 'eager'; window.scrollTo(0, document.body.scrollHeight); await new Promise(r => setTimeout(r, 400)); window.scrollTo(0, 0); });
      await page.waitForTimeout(500);
      const R = await page.evaluate(() => ({
        side: document.documentElement.scrollWidth - innerWidth,
        broken: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.getAttribute('src')),
        tiny: [...document.querySelectorAll('header.head *, main *')].filter(e => ![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) ? false : parseFloat(getComputedStyle(e).fontSize) < 12).map(e => (e.className || e.tagName) + ':' + getComputedStyle(e).fontSize).slice(0, 6),
        nav: !!document.querySelector('[data-sitenav] *')
      }));
      console.log(pg, tag, JSON.stringify(R));
      if (R.side > 1) bad(pg + ' ' + tag + ' sideways ' + R.side);
      if (R.broken.length) bad('broken images ' + R.broken);
      if (R.tiny.length) bad('text under 12px ' + R.tiny);
      if (errs.length) bad('JS errors: ' + errs.join(' | '));
      await page.screenshot({ path: __dirname + '/whotax-' + pg + '-' + tag + '.png', fullPage: true });
      await ctx.close();
    }
  }
  await browser.close();
  console.log(fails ? `\n${fails} problem(s)` : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})();
