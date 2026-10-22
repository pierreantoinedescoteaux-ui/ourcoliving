/* Feedback round step 1 QA: kollektivhus merged into cohousing, new taglines,
   pill hover sentences, external links open in a new tab.
   Run: node _qa/shoot-feedback-s1.js   (server on :8123) */
const { chromium } = require('./node_modules/playwright-core');
const B = process.env.BASE || 'http://localhost:8123/';
const OUT = __dirname + '/fb1-';
const PAGES = [
  ['map', 'map.html?live'],
  ['type-cohousing', 'type.html?t=cohousing&live'],
  ['type-kollektivhus', 'type.html?t=kollektivhus&live'],
  ['type-archived', 'type.html?t=housing-coop&live'],
  ['projects', 'projects.html?live'],
  ['index', 'index.html?live']
];
const SIZES = [[1512, 950], [390, 844]];
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  let fails = 0;
  for (const [w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    for (const [name, path] of PAGES) {
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', e => errs.push(e.message));
      page.on('console', m => { if (m.type() === 'error' && !/favicon|net::ERR/.test(m.text())) errs.push(m.text()); });
      await page.goto(B + path, { waitUntil: 'load' }); await page.waitForTimeout(1200);
      const r = await page.evaluate(() => {
        const pills = [...document.querySelectorAll('.pill[title]')];
        return {
          url: location.pathname + location.search,
          sideways: document.documentElement.scrollWidth - innerWidth,
          kollektivhusType: typeof COLIVING_TYPES !== 'undefined' && COLIVING_TYPES.some(t => t.slug === 'kollektivhus'),
          pills: pills.length,
          pillsWithSentence: pills.filter(p => /: \S/.test(p.title)).length,
          oldTagline: /garage myth|gateway drug|shared heart/i.test(document.body.innerText)
        };
      });
      let bad = errs.length || r.sideways > 1 || r.kollektivhusType || r.oldTagline || (r.pills && r.pillsWithSentence < r.pills);
      if (name === 'type-kollektivhus' && !/t=cohousing/.test(r.url)) bad = true;
      // an outside link must open a new tab, without leaving the page
      if (name === 'type-cohousing') {
        const link = await page.$('a[href^="http"]:not([href*="localhost"])');
        if (!link) { bad = true; r.extLink = 'none found'; }
        else {
          await link.evaluate(a => a.removeAttribute('target'));
          const [popup] = await Promise.all([ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), link.click({ modifiers: [] })]);
          r.extLink = popup ? 'new tab' : 'SAME TAB';
          if (!popup) bad = true; else await popup.close();
          r.stillHere = /type\.html/.test(page.url());
          if (!r.stillHere) bad = true;
        }
      }
      if (bad) fails++;
      console.log((bad ? 'FAIL ' : 'ok   ') + w + ' ' + name, JSON.stringify(r), errs.slice(0, 3).join(' | '));
      if (name === 'type-cohousing') await page.screenshot({ path: OUT + name + '-' + w + '.png', fullPage: true });
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  console.log(fails ? fails + ' FAILED' : 'ALL GREEN');
})();
