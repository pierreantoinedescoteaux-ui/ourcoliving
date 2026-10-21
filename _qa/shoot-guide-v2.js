/* Field guide v2 QA: chapters, index, areas, places capped at 4, pop-up short version.
   Run: node _qa/shoot-guide-v2.js [slug]   (server on :8123) */
const { chromium } = require('./node_modules/playwright-core');
const B = 'http://localhost:8123/', OUT = __dirname + '/fg2-';
const slug = process.argv[2] || 'cohousing';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  let fails = 0;
  for (const [w, h] of [[1512, 950], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    for (const [name, path] of [['type', 'type.html?t=' + slug + '&live'], ['map', 'map.html?live#' + slug], ['projects', 'projects.html?t=' + slug + '&live#grid']]) {
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', e => errs.push(e.message));
      page.on('console', m => { if (m.type() === 'error' && !/favicon|net::ERR/.test(m.text())) errs.push(m.text()); });
      await page.goto(B + path, { waitUntil: 'load' }); await page.waitForTimeout(1200);
      for (let y = 0; y < 16000; y += 700) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(60); }
      await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(600);
      const r = await page.evaluate(() => ({
        sideways: document.documentElement.scrollWidth - innerWidth,
        chapters: document.querySelectorAll('.fg-ch').length,
        index: document.querySelectorAll('.fg-index a').length,
        areas: document.querySelectorAll('.fg-area').length,
        sum: document.querySelectorAll('.fg-sumlist li').length,
        places: document.querySelectorAll('.fg-place').length,
        all: !!document.querySelector('.fg-all'),
        filter: (document.querySelector('#filters .onf') || {}).textContent || '',
        oldBoxes: document.querySelectorAll('.tcard, .fnote, .featcard, .exgrid').length
      }));
      let bad = errs.length || r.sideways > 1;
      if (name === 'type' && (r.chapters < 6 || !r.index || r.areas < 5 || r.places > 4 || r.oldBoxes)) bad = true;
      if (name === 'map' && r.chapters && (r.areas || r.places > 3)) bad = true;
      if (name === 'projects' && /^All/.test(r.filter)) bad = true;
      if (bad) fails++;
      console.log((bad ? 'FAIL ' : 'ok   ') + w + ' ' + name, JSON.stringify(r), errs.slice(0, 3).join(' | '));
      if (name === 'type') await page.screenshot({ path: OUT + slug + '-' + w + '.png', fullPage: true });
      if (name === 'map') await page.screenshot({ path: OUT + 'map-' + w + '.png' });
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  console.log(fails ? fails + ' FAILED' : 'ALL GREEN');
})();
