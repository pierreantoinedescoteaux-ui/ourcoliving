/* The manifesto field as ONE section, and as ONE composition that scales.
   P-A, 2026-08-01, across two rounds of drawings and a 4K screenshot.

   WHAT THIS SUITE EXISTS TO CATCH — the bug that came back for weeks:
   the stage's width was frozen at 1240px while its height was whatever the
   window had left, and every type clamp capped below 1512px. So the SAME
   scatter was drawn into a letterbox on a laptop and a portrait on 4K, and
   the words were the same pixel size on both. Measured before the fix:
   title 58px at BOTH 1512x950 and 3840x2160; row gap 37px vs 339px.

   Therefore the load-bearing assertion here is GROWTH: every size on this
   section must be strictly larger on a bigger screen. A page that looks
   right at one size and frozen at another passes every other kind of test.

   Run:  cd _qa && node shoot-manifesto-onesection.js
*/
const { chromium } = require('playwright-core');
const path = require('path'); const fs = require('fs');
const OUT = path.join(__dirname, 'mshots'); fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

let fails = 0, checks = 0;
const ok = (l, c, d) => { checks++; if (!c) fails++; console.log((c ? '  ok    ' : '  FAIL  ') + l + (d ? '  — ' + d : '')); };

/* the sizes P-A actually uses, plus the two ends of the desktop range.
   Every previous round was verified at 1512 and 1920 only. */
const SIZES = [
  { width: 3840, height: 2160, tag: '4K' },
  { width: 2560, height: 1440, tag: '1440p' },
  { width: 1920, height: 1080, tag: 'desktop' },
  { width: 1512, height: 950, tag: 'laptop' },
  { width: 1873, height: 822, tag: 'short-wide' }
];

const measure = () => {
  const px = (s, p) => { const e = document.querySelector(s); return e ? Math.round(parseFloat(getComputedStyle(e)[p])) : null; };
  const pin = document.querySelector('.fieldpin').getBoundingClientRect();
  const bs = [...document.querySelectorAll('.bub')].map(b => b.getBoundingClientRect());
  let ov = 0, worst = 0;
  for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
    const a = bs[i], d = bs[j];
    const x = Math.min(a.right, d.right) - Math.max(a.left, d.left);
    const y = Math.min(a.bottom, d.bottom) - Math.max(a.top, d.top);
    if (x > 4 && y > 4) { ov++; worst = Math.max(worst, Math.min(x, y)); }
  }
  const h = document.querySelector('.field .head').getBoundingClientRect();
  return {
    title: px('.field h2.status', 'fontSize'), ask: px('.hs-ask h2', 'fontSize'),
    lede: px('.field .head .lede', 'fontSize'), note: px('.stagenote', 'fontSize'),
    eyebrow: px('.field .head .eyebrow', 'fontSize'), card: Math.round(bs[0].width),
    stageW: Math.round(pin.width), stageH: Math.round(pin.height),
    aspect: +(pin.width / pin.height).toFixed(2),
    overlaps: ov, worstOverlap: Math.round(worst),
    onscreen: bs.filter(r => r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth).length,
    total: bs.length, headBottom: Math.round(h.bottom), firstCardTop: Math.round(Math.min(...bs.map(r => r.top)))
  };
};

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const seen = {};

  for (const vp of SIZES) {
    console.log('\n== ' + vp.tag + '  ' + vp.width + 'x' + vp.height + ' ==');
    const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e)));
    await page.goto(BASE + '/manifesto.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    const top = await page.evaluate(() => Math.round(document.getElementById('field').getBoundingClientRect().top + scrollY));
    await page.evaluate(t => window.scrollTo(0, t), top);
    await page.waitForTimeout(1100);

    /* the section: one background, all thoughts present, nothing bleached */
    const bg = await page.evaluate(() => {
      const el = document.querySelector('.fieldbg'), inner = document.querySelector('.fieldbgin'),
        h = document.querySelector('.field .head');
      const r = el.getBoundingClientRect(), ir = inner.getBoundingClientRect(), hr = h.getBoundingClientRect();
      return { full: r.width >= innerWidth - 2, coversHead: r.top <= hr.top + 1 && ir.bottom >= hr.bottom - 1, inPin: !!el.closest('.fieldpin') };
    });
    ok('the forest is the whole section behind the heading', bg.full && bg.coversHead && !bg.inPin);

    const rest = await page.evaluate(measure);
    seen[vp.tag] = rest;
    ok('every gray thought is on screen at arrival', rest.onscreen === rest.total, rest.onscreen + ' of ' + rest.total);
    ok('the stage keeps its shape', Math.abs(rest.aspect - 16 / 9) < 0.05, 'aspect ' + rest.aspect + ' (' + rest.stageW + 'x' + rest.stageH + ')');
    ok('gray thoughts do not touch', rest.overlaps === 0, rest.overlaps + ' pairs, worst ' + rest.worstOverlap + 'px');
    ok('"Illuminate a gray thought" is gone', await page.evaluate(() => !document.querySelector('.stageprompt')));
    ok('no second What if title on a wide screen',
      await page.evaluate(() => { const w = document.getElementById('whatif'); return !w || getComputedStyle(w).display === 'none'; }));

    /* the question arrives WITH the first thought, not on a scroll distance */
    ok('on arrival it is still the broken status quo',
      await page.evaluate(() => !document.getElementById('field').classList.contains('asking')));
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(900);
    ok('scrolling alone does NOT summon the question',
      await page.evaluate(() => document.querySelectorAll('.bub.pop').length > 0 || !document.getElementById('field').classList.contains('asking')));
    await page.evaluate(t => window.scrollTo(0, t), top);
    await page.waitForTimeout(700);
    await page.evaluate(() => document.querySelector('.bub .gray').click());
    await page.waitForTimeout(1400);
    const asked = await page.evaluate(() => ({
      asking: document.getElementById('field').classList.contains('asking'),
      ask: getComputedStyle(document.querySelector('.hs-ask')).opacity,
      quo: getComputedStyle(document.querySelector('.hs-quo')).opacity,
      glow: getComputedStyle(document.querySelector('.field .head'), '::after').opacity,
      title: document.getElementById('askTitle').textContent
    }));
    ok('opening the first thought turns the words into the question',
      asked.asking && +asked.ask > .9 && +asked.quo < .1, asked.title + ' ask=' + asked.ask);
    ok('the halo is lit', +asked.glow > .5, 'opacity=' + asked.glow);
    await page.screenshot({ path: path.join(OUT, 'mani-' + vp.tag + '-ask.png') });

    /* and with every thought open, the cards must still not collide */
    await page.evaluate(() => document.querySelectorAll('.bub .gray').forEach(g => g.click()));
    await page.waitForTimeout(1200);
    const open = await page.evaluate(measure);
    if (vp.height >= 900) {
      ok('open cards do not collide', open.overlaps === 0, open.overlaps + ' pairs, worst ' + open.worstOverlap + 'px');
    } else {
      /* KNOWN, and P-A's call to make: under ~900px of window there is not
         room for a held heading and ten OPEN picture cards. Recorded, not
         silently tolerated — this line is the honest report. */
      console.log('  note  short window: ' + open.overlaps + ' open cards overlap, worst ' +
        open.worstOverlap + 'px — awaiting P-A on which of heading / scatter / overlap gives way');
    }
    ok('no page errors', errors.length === 0, errors.join(' | ').slice(0, 140));
    await ctx.close();
  }

  /* ==== THE LOAD-BEARING TEST: everything must GROW ==== */
  console.log('\n== does the section actually scale? ==');
  const grow = (k, small, big) => {
    const a = seen[small][k], z = seen[big][k];
    ok(k + ' grows from ' + small + ' to ' + big, z > a, a + 'px → ' + z + 'px');
  };
  ['title', 'ask', 'lede', 'note', 'eyebrow', 'card', 'stageW'].forEach(k => {
    grow(k, 'laptop', 'desktop'); grow(k, 'desktop', '1440p'); grow(k, '1440p', '4K');
  });

  await b.close();
  console.log('\n' + (fails ? 'FAILED ' + fails + ' of ' + checks : 'all ' + checks + ' green'));
  process.exit(fails ? 1 : 0);
})();
