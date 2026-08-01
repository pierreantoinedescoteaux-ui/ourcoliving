/* The manifesto field as ONE section — P-A's two drawings, 2026-08-01.

   1. the dying forest is the background of the WHOLE section, from under the
      nav, not just of the pinned stage
   2. the gray thoughts are already under the heading when you arrive
   3. after a little scrolling the heading's own words swap to the question,
      keeping the same shape, and swap back if you scroll up
   4. "Illuminate a gray thought to give it hope" is gone
   5. there is no second What if title on a wide screen
   6. no thought is bleached by the heading's halo

   Assertions read real rectangles and real painted colours. Screenshots in
   _qa/mshots/mani-*.png are meant to be looked at, not just counted.
*/
const { chromium } = require('playwright-core');
const path = require('path'); const fs = require('fs');
const OUT = path.join(__dirname, 'mshots'); fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

let fails = 0, checks = 0;
const ok = (l, c, d) => { checks++; if (!c) fails++; console.log((c ? '  ok    ' : '  FAIL  ') + l + (d ? '  — ' + d : '')); };

const seen = () => {
  const vh = window.innerHeight, vw = window.innerWidth;
  return [...document.querySelectorAll('.bub')].filter(b => {
    const r = b.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= vh && r.left >= 0 && r.right <= vw && r.width > 0;
  }).length;
};

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });

  for (const vp of [{ width: 1512, height: 950 }, { width: 1920, height: 1080 }]) {
    const tag = vp.width + 'x' + vp.height;
    console.log('\n== ' + tag + ' ==');
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e)));
    await page.goto(BASE + '/manifesto.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    const top = await page.evaluate(() =>
      Math.round(document.getElementById('field').getBoundingClientRect().top + scrollY));
    await page.evaluate(t => window.scrollTo(0, t), top);
    await page.waitForTimeout(1300);

    /* 1 — the painting is behind the heading, not below it */
    const bg = await page.evaluate(() => {
      const el = document.querySelector('.fieldbg');
      const inner = document.querySelector('.fieldbgin');
      const h = document.querySelector('.field .head');
      if (!el || !inner || !h) return null;
      const r = el.getBoundingClientRect(), ir = inner.getBoundingClientRect(), hr = h.getBoundingClientRect();
      return {
        w: Math.round(r.width), vw: window.innerWidth,
        coversHead: r.top <= hr.top + 1 && ir.top <= hr.top + 1 && ir.bottom >= hr.bottom - 1,
        innerH: Math.round(ir.height), vh: window.innerHeight,
        inPin: !!el.closest('.fieldpin')
      };
    });
    ok('the forest spans the window', bg && bg.w >= bg.vw - 2, bg && bg.w + ' of ' + bg.vw);
    ok('the forest is behind the heading, not below it', bg && bg.coversHead);
    ok('it holds a screenful', bg && Math.abs(bg.innerH - bg.vh) <= 2, bg && bg.innerH + 'px');
    ok('it no longer lives inside the pinned stage', bg && bg.inPin === false);

    /* 2 — the thoughts are already there */
    const arrive = await page.evaluate(seen);
    const total = await page.evaluate(() => document.querySelectorAll('.bub').length);
    ok('every gray thought is on screen at arrival', arrive === total, arrive + ' of ' + total);

    /* 4 + 5 — the prompt and the second title are gone */
    ok('"Illuminate a gray thought" is gone',
      await page.evaluate(() => !document.querySelector('.stageprompt')));
    ok('no second What if title on a wide screen',
      await page.evaluate(() => {
        const w = document.getElementById('whatif');
        return !w || getComputedStyle(w).display === 'none';
      }));

    /* 3 — the words change their mind, and change back */
    let st = await page.evaluate(() => ({
      asking: document.getElementById('field').classList.contains('asking'),
      quo: getComputedStyle(document.querySelector('.hs-quo')).opacity,
      ask: getComputedStyle(document.querySelector('.hs-ask')).opacity,
      title: document.querySelector('.hs-quo h2').textContent
    }));
    ok('on arrival it is still the broken status quo', st.asking === false && +st.quo > .9 && +st.ask < .1,
      st.title + ' quo=' + st.quo + ' ask=' + st.ask);
    await page.screenshot({ path: path.join(OUT, 'mani-arrive-' + tag + '.png') });

    await page.evaluate(t => window.scrollTo(0, t + 520), top);
    await page.waitForTimeout(1500);
    st = await page.evaluate(() => ({
      asking: document.getElementById('field').classList.contains('asking'),
      quo: getComputedStyle(document.querySelector('.hs-quo')).opacity,
      ask: getComputedStyle(document.querySelector('.hs-ask')).opacity,
      title: document.getElementById('askTitle').textContent,
      lede: document.getElementById('askLede').textContent,
      glow: getComputedStyle(document.querySelector('.field .head'), '::after').opacity,
      headTop: Math.round(document.querySelector('.field .head').getBoundingClientRect().top)
    }));
    ok('a little scrolling swaps the words', st.asking === true && +st.ask > .9 && +st.quo < .1,
      st.title + ' ask=' + st.ask + ' quo=' + st.quo);
    ok('the question keeps the same shape (a paragraph under it)',
      st.lede.length > 40, st.lede.slice(0, 48) + '…');
    ok('the halo is lit', +st.glow > .5, 'opacity=' + st.glow);
    ok('the heading is still held at the top', st.headTop < 140, st.headTop + 'px');
    await page.screenshot({ path: path.join(OUT, 'mani-ask-' + tag + '.png') });

    /* 6 — nothing in the scatter is bleached by the halo */
    const bleached = await page.evaluate(() => {
      const h = document.querySelector('.field .head');
      const hr = h.getBoundingClientRect();
      /* the halo is the ::before, sized off the head; approximate its box */
      const bad = [];
      document.querySelectorAll('.bub').forEach(bub => {
        const r = bub.getBoundingClientRect();
        const overlapY = Math.min(r.bottom, hr.bottom) - Math.max(r.top, hr.top);
        const overlapX = Math.min(r.right, hr.right) - Math.max(r.left, hr.left);
        if (overlapY > 8 && overlapX > 8) bad.push(bub.querySelector('.gray, .flip')?.textContent.slice(0, 24));
      });
      return bad;
    });
    ok('no thought sits inside the heading block', bleached.length === 0, bleached.join(' | '));

    /* scroll back up — it must change its mind back */
    await page.evaluate(t => window.scrollTo(0, t), top);
    await page.waitForTimeout(1300);
    ok('scrolling back up restores the broken status quo',
      await page.evaluate(() => !document.getElementById('field').classList.contains('asking')));

    ok('no page errors', errors.length === 0, errors.join(' | ').slice(0, 150));
    await ctx.close();
  }

  /* the phone keeps the round-7 design untouched */
  console.log('\n== 390x844 (unchanged) ==');
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.goto(BASE + '/manifesto.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  ok('the phone still has its own What if',
    await page.evaluate(() => {
      const w = document.getElementById('whatif');
      return !!w && getComputedStyle(w).display !== 'none';
    }));
  ok('the phone heading is not stacked into two states',
    await page.evaluate(() => getComputedStyle(document.querySelector('.field .head')).display !== 'grid'));
  /* the second state must not simply stack under the first — the phone would
     then read the question twice, once in each typeface */
  ok('the phone shows the question exactly once',
    await page.evaluate(() => {
      const vis = [...document.querySelectorAll('.field .head .hs-ask, #whatif')]
        .filter(el => getComputedStyle(el).display !== 'none');
      return vis.length === 1 && vis[0].id === 'whatif';
    }));
  await page.screenshot({ path: path.join(OUT, 'mani-phone.png') });
  ok('no page errors (phone)', errors.length === 0, errors.join(' | ').slice(0, 150));
  await ctx.close();

  await b.close();
  console.log('\n' + (fails ? 'FAILED ' + fails + ' of ' + checks : 'all ' + checks + ' green'));
  process.exit(fails ? 1 : 0);
})();
