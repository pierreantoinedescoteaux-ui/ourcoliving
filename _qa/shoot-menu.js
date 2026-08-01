/* The site menu on a phone — the two regressions P-A caught, 2026-08-01:
   (1) "the menu kinda lives where you could see the background on the nav bar"
   (2) "you cannot scroll to see all the pages. The community at the bottom is
        just hidden"

   Every assertion here reads a REAL getBoundingClientRect and a REAL painted
   colour. The round before this one shipped a test that asserted `opacity`
   on a display:none element and passed on a door that was never drawn.

   Run:  node _qa/shoot-menu.js      (needs a server on BASE)
*/
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'mshots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

let fails = 0, checks = 0;
const ok = (label, cond, detail) => {
  checks++; if (!cond) fails++;
  console.log((cond ? '  ok    ' : '  FAIL  ') + label + (detail ? '  — ' + detail : ''));
};

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    deviceScaleFactor: 2
  });

  for (const name of ['index.html', 'about.html']) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(BASE + '/' + name, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1400);

    console.log('\n== ' + name + ' ==');

    const opened = await page.evaluate(() => {
      const btn = document.querySelector('.snav .mbtn');
      if (!btn) return 'no menu button';
      btn.click();
      return document.querySelector('.snav .mpanel').classList.contains('openm');
    });
    ok('menu opens', opened === true, String(opened));
    await page.waitForTimeout(350);

    /* (1) the bar must not be see-through while the menu stands on it */
    const bar = await page.evaluate(() => {
      const n = document.querySelector('.snav');
      const r = n.getBoundingClientRect();
      return {
        bg: getComputedStyle(n).backgroundColor,
        menuopen: n.classList.contains('menuopen'),
        h: Math.round(r.height)
      };
    });
    const m = /rgba?\(([^)]+)\)/.exec(bar.bg);
    const alpha = m ? (m[1].split(',').map(Number).length > 3 ? Number(m[1].split(',')[3]) : 1) : 1;
    ok('nav carries .menuopen', bar.menuopen === true, String(bar.menuopen));
    ok('nav bar is opaque behind the open menu', alpha >= 0.85, bar.bg);
    ok('nav bar has real height', bar.h > 40, bar.h + 'px');

    /* (2) the LAST link must be reachable — scroll the panel and measure it */
    const tail = await page.evaluate(async () => {
      const p = document.querySelector('.snav .mpanel');
      const links = [...p.querySelectorAll('a')];
      const last = links[links.length - 1];
      const sh = p.scrollHeight, ch = p.clientHeight;
      p.scrollTop = p.scrollHeight;
      await new Promise(r => setTimeout(r, 150));
      const r = last.getBoundingClientRect();
      return {
        label: last.textContent.trim(), count: links.length,
        top: Math.round(r.top), bottom: Math.round(r.bottom),
        w: Math.round(r.width), h: Math.round(r.height),
        vh: window.innerHeight, sh, ch, scrolled: Math.round(p.scrollTop)
      };
    });
    ok('last menu link is drawn (non-zero rect)', tail.w > 0 && tail.h > 0,
      tail.label + ' ' + tail.w + 'x' + tail.h);
    ok('last menu link sits INSIDE the screen once the panel is scrolled',
      tail.bottom <= tail.vh && tail.top >= 0,
      tail.label + ' top=' + tail.top + ' bottom=' + tail.bottom + ' vh=' + tail.vh);
    ok('the panel actually scrolled', tail.sh <= tail.ch + 2 || tail.scrolled > 0,
      'scrollTop=' + tail.scrolled + ' of ' + (tail.sh - tail.ch));
    ok('The Community is in the panel',
      await page.evaluate(() => [...document.querySelectorAll('.snav .mpanel a')]
        .some(a => /community/i.test(a.textContent))));

    /* nothing fixed may stand on the last row — hit-test the real pixel */
    const onTop = await page.evaluate(() => {
      const p = document.querySelector('.snav .mpanel');
      const last = [...p.querySelectorAll('a')].pop();
      const r = last.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + 12, r.top + r.height / 2);
      return hit ? (hit.tagName + '.' + hit.className) : 'none';
    });
    ok('the last row is not covered by fixed furniture', /^A\./.test(onTop), onTop);

    /* (3) on the homepage the map lock must let a drag over the panel through */
    if (name === 'index.html') {
      const cancelled = await page.evaluate(() => new Promise(res => {
        const p = document.querySelector('.snav .mpanel');
        let seen = null;
        const probe = e => { seen = e.defaultPrevented; };
        window.addEventListener('touchmove', probe, { passive: true });
        const t = y => new Touch({ identifier: 1, target: p, clientX: 100, clientY: y });
        p.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true, touches: [t(600)] }));
        p.dispatchEvent(new TouchEvent('touchmove', { bubbles: true, cancelable: true, touches: [t(400)] }));
        setTimeout(() => { window.removeEventListener('touchmove', probe); res(seen); }, 80);
      }));
      ok('a drag over the open menu is not eaten by the map lock',
        cancelled === false, 'defaultPrevented=' + cancelled);
    }

    await page.screenshot({ path: path.join(OUT, 'menu-' + name.replace('.html', '') + '-top.png') });
    await page.evaluate(() => { const p = document.querySelector('.snav .mpanel'); p.scrollTop = p.scrollHeight; });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(OUT, 'menu-' + name.replace('.html', '') + '-end.png') });

    ok('no page errors', errors.length === 0, errors.join(' | ').slice(0, 160));
    await page.close();
  }

  await b.close();
  console.log('\n' + (fails ? 'FAILED ' + fails + ' of ' + checks : 'all ' + checks + ' green'));
  process.exit(fails ? 1 : 0);
})();
