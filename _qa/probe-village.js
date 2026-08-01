/* how full is the pinned village screen as the lines arrive? */
const { chromium } = require('playwright-core');
const path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile Safari/537.36' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/manifesto.html', { waitUntil: 'load' });
  await page.waitForTimeout(600);

  const y = await page.evaluate(() => document.getElementById('scenewrap').getBoundingClientRect().top + scrollY);
  const H = await page.evaluate(() => document.getElementById('scenewrap').getBoundingClientRect().height);

  for (const frac of [0.05, 0.25, 0.5, 0.75, 0.95]) {
    await page.evaluate(([y, H, f]) => scrollTo(0, y + H * f), [y, H, frac]);
    await page.waitForTimeout(700);
    const m = await page.evaluate(() => {
      const lis = [...document.querySelectorAll('#poss li')];
      const lit = lis.filter(l => l.classList.contains('litp'));
      const last = lit.length ? lit[lit.length - 1].getBoundingClientRect().bottom
                              : document.getElementById('vilwrap').getBoundingClientRect().bottom;
      const fin = document.querySelector('.poss .finale');
      const finB = fin && fin.classList.contains('litp') ? fin.getBoundingClientRect().bottom : last;
      const im = document.getElementById('vilposter').getBoundingClientRect();
      return { lit: lit.length, lowest: Math.round(Math.max(last, finB)), vh: innerHeight,
        emptyBottom: Math.round(innerHeight - Math.max(last, finB)),
        island: Math.round(im.width) + 'x' + Math.round(im.height) };
    });
    console.log(`frac ${frac}  lit ${m.lit}/5  island ${m.island}  content ends ${m.lowest}px  empty below ${m.emptyBottom}px`);
    await page.screenshot({ path: path.join(__dirname, 'mshots', `probe-vil-${frac}.png`) });
  }
  await b.close();
})();
