/* Wave 1 QA (data model v2): JS errors, sideways scroll, key elements, screenshots.
   Run: node _qa/shoot-datamodel-v2.js   (server on :8123) */
const { chromium } = require('./node_modules/playwright-core');
const B = 'http://localhost:8123/';
const OUT = __dirname + '/dm2-';
const PAGES = [
  ['map', 'map.html?live'],
  ['map-compare', 'map.html?compare=cohousing&live#map'],
  ['type-cohousing', 'type.html?t=cohousing&live'],
  ['type-kollektivhus', 'type.html?t=kollektivhus&live'],
  ['type-archived', 'type.html?t=housing-coop&live'],
  ['projects', 'projects.html?live'],
  ['why', 'why.html?live'],
  ['index', 'index.html?live'],
  ['tower', 'tower.html?live']
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
      const r = await page.evaluate(() => ({
        url: location.pathname + location.hash,
        sideways: document.documentElement.scrollWidth - innerWidth,
        pills: document.querySelectorAll('.pill').length,
        setups: document.querySelectorAll('.gsetup').length,
        rng: document.querySelectorAll('.sigrow .rng').length,
        cmp: document.querySelectorAll('.cmpbtn').length,
        shp: document.querySelectorAll('.shp-pol').length,
        active: document.querySelectorAll('.stage.comparing .node.active').length,
        cards: document.querySelectorAll('.pcard').length,
        twelve: /\btwelve (models|shapes|ways|field)|\b12 (models|field guides)/i.test(document.body.innerText)
      }));
      const bad = errs.length || r.sideways > 1 || r.twelve;
      if (bad) fails++;
      console.log((bad ? 'FAIL ' : 'ok   ') + w + ' ' + name, JSON.stringify(r), errs.slice(0, 3).join(' | '));
      if (w === 1512 && /type-cohousing|map$|projects/.test(name)) {
        const sel = name === 'map' ? '#shapes' : name === 'projects' ? '#grid' : '.gsetups';
        const el = await page.$(sel); if (el) await el.screenshot({ path: OUT + name + '-' + w + '.png' });
      }
      if (w === 390 && name === 'map') { const el = await page.$('#shapes'); if (el) await el.screenshot({ path: OUT + name + '-' + w + '.png' }); }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  console.log(fails ? fails + ' FAILED' : 'ALL GREEN');
})();
