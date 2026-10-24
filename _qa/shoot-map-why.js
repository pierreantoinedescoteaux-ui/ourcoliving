/* Map: labels don't collide on any preset (desktop + phone), the hover card
   shows the two "why it sits here" lines, and the field guide's spectrum
   lines open to their reason. Run: node _qa/shoot-map-why.js */
const { chromium } = require('./node_modules/playwright-core');
const BASE = (process.env.BASE || 'http://127.0.0.1:8123').replace(/\/$/, '');
const OUT = __dirname + '/mshots/mapwhy-';
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const fails = [];
  for (const [tag, vp] of [['desk', { width: 1366, height: 900 }], ['laptop', { width: 1024, height: 768 }], ['phone', { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
    const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor || 1 });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + '/map.html', { waitUntil: 'networkidle' });
    const presets = await p.$$eval('#presets button, .presets button', bs => bs.length);
    for (let i = 0; i < presets; i++) {
      await p.evaluate(i => (document.querySelectorAll('#presets button, .presets button')[i]).click(), i);
      await p.waitForTimeout(1300);
      const r = await p.evaluate(() => {
        const boxes = [...document.querySelectorAll('.chart .node')].map(n => ({ n: n.querySelector('.lab').textContent, l: n.querySelector('.lab').getBoundingClientRect(), m: n.querySelector('.mark').getBoundingClientRect() }));
        const ch = document.querySelector('.chart').getBoundingClientRect();
        const ov = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        const hits = [];
        boxes.forEach((a, i) => boxes.forEach((c, j) => {
          if (i < j && ov(a.l, c.l) > 20) hits.push(a.n + ' / ' + c.n + ' (labels)');
          if (i !== j && ov(a.l, c.m) > 60) hits.push(a.n + ' over the pin of ' + c.n);
        }));
        const out = boxes.filter(a => a.l.left < ch.left - 2 || a.l.right > ch.right + 2).map(a => a.n + ' outside');
        return { preset: document.querySelectorAll('#presets button, .presets button')[0] && [...document.querySelectorAll('#presets button, .presets button')].find(x => x.classList.contains('on'))?.textContent, hits: hits.concat(out) };
      });
      console.log(tag, '"' + r.preset + '"', r.hits.length ? 'COLLISIONS: ' + r.hits.join('; ') : 'no collisions');
      if (r.hits.length) fails.push(tag + ' ' + r.preset + ': ' + r.hits.join('; '));
      const chart = await p.$('.stage'); await chart.scrollIntoViewIfNeeded();
      await chart.screenshot({ path: OUT + tag + '-preset' + i + '.png' });
    }
    if (tag !== 'phone') {
      await p.evaluate(() => document.querySelectorAll('#presets button, .presets button')[0].click()); await p.waitForTimeout(1300);
      const node = p.locator('.chart .node[data-slug="cohousing"]'); await node.hover(); await p.waitForTimeout(500);
      const card = await p.evaluate(() => { const c = document.querySelector('.hcard.show'); if (!c) return null; const r = c.getBoundingClientRect(); return { why: [...c.querySelectorAll('.hwhy div')].map(d => d.textContent.slice(0, 60)), top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight }; });
      console.log(tag, 'hover card:', JSON.stringify(card)); if (!card || card.why.length !== 2) fails.push(tag + ' hover card why');
      await (await p.$('.stage')).screenshot({ path: OUT + tag + '-hover.png' });
    }
    if (errs.length) fails.push(tag + ' js: ' + errs.join(' | '));
    /* field guide */
    await p.goto(BASE + '/type.html?t=cohousing', { waitUntil: 'networkidle' });
    const n = await p.$$eval('#fg-map .fg-why', d => d.length).catch(() => 0);
    const first = p.locator('#fg-map .fg-why summary').first();
    if (n) { await first.scrollIntoViewIfNeeded(); await first.click(); await p.waitForTimeout(300); }
    const open = await p.evaluate(() => { const d = document.querySelector('#fg-map .fg-why[open] p'); return d ? d.textContent.slice(0, 70) : null; });
    const sum = await p.evaluate(() => { const s = document.querySelector('#fg-map .fg-why summary'); return s ? s.getBoundingClientRect().height : 0; });
    const side = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(tag, 'field guide: toggles', n, '| opened:', open, '| row height', Math.round(sum), '| sideways', side);
    if (n !== 7 || !open || sum < 44 || side > 0) fails.push(tag + ' field guide');
    await (await p.$('#fg-map')).screenshot({ path: OUT + tag + '-guide.png' });
    await ctx.close();
  }
  await b.close();
  console.log(fails.length ? 'FAILS:\n ' + fails.join('\n ') : 'ALL GREEN');
})();
