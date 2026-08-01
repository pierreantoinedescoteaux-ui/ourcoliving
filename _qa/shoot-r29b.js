/* QA round 29b — the thirteen doorway pages.
   P-A's items: the back pill is too big, the tower design behind it is
   barely used, and it is not clean; check the other pages for the same. */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'mshots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

const PAGES = ['projects.html', 'resources.html', 'detail.html', 'inspiration.html',
  'talkpieces.html', 'themes.html', 'type.html', 'designers.html', 'design.html',
  'story.html', 'about.html', 'project.html', 'work.html', 'map.html'];
const SHOT = ['about.html', 'resources.html', 'story.html'];

let fails = 0;
const ok = (l, c, d) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + l + (d ? '  ' + d : '')); };

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });

  for (const vp of [{ w: 390, h: 844, tag: 'phone' }, { w: 1440, h: 900, tag: 'desk' }]) {
    console.log(`\n-- ${vp.tag} ${vp.w}x${vp.h} --`);
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h },
      isMobile: vp.tag === 'phone', hasTouch: vp.tag === 'phone', deviceScaleFactor: vp.tag === 'phone' ? 2 : 1,
      userAgent: vp.tag === 'phone' ? 'Mozilla/5.0 (Linux; Android 13) Mobile Safari/537.36' : undefined });
    const page = await ctx.newPage();
    let worstPill = 0, worstPage = '', noHalo = [], smallTap = [];

    for (const f of PAGES) {
      const errs = [];
      page.removeAllListeners('pageerror');
      page.on('pageerror', e => errs.push(f + ': ' + e.message));
      await page.goto(BASE + '/' + f, { waitUntil: 'load' });
      await page.waitForTimeout(600);

      const m = await page.evaluate(() => {
        const band = document.querySelector('.wband');
        const pill = document.querySelector('.wback');
        if (!band || !pill) return null;
        const pb = pill.getBoundingClientRect(), bb = band.getBoundingClientRect();
        /* any heading sitting on the painting must carry the paper halo */
        const onArt = [...document.querySelectorAll('h1,h2,.lede,.eyebrow')].filter(el => {
          if (el.closest('.wbandwrap') || el.closest('.snav')) return false;
          const r = el.getBoundingClientRect();
          return r.width && r.height && r.top < bb.bottom && r.bottom > bb.top;
        });
        return {
          pillPct: Math.round(pb.width / innerWidth * 100),
          pillH: Math.round(pb.height),
          onArt: onArt.length,
          haloed: onArt.filter(el => el.classList.contains('wonart')).length
        };
      });
      if (!m) { ok(`${f}: has a band`, false); continue; }
      if (m.pillPct > worstPill) { worstPill = m.pillPct; worstPage = f; }
      if (m.onArt && m.haloed < m.onArt) noHalo.push(`${f} ${m.haloed}/${m.onArt}`);
      if (vp.tag === 'phone' && m.pillH < 44) smallTap.push(`${f} ${m.pillH}px`);
      if (errs.length) ok(`${f}: no page errors`, false, errs.join(' | '));
      if (SHOT.includes(f)) await page.screenshot({ path: path.join(OUT, `r29b-${f.replace('.html', '')}-${vp.tag}.png`) });
    }

    ok(`${vp.tag}: the back pill stays a pill`, worstPill <= (vp.tag === 'phone' ? 50 : 30),
      `worst ${worstPill}% on ${worstPage}`);
    ok(`${vp.tag}: every word on the painting carries the paper halo`, noHalo.length === 0, noHalo.join(', '));
    if (vp.tag === 'phone') ok('phone: the pill is still a 44px target', smallTap.length === 0, smallTap.join(', '));
    await ctx.close();
  }

  await b.close();
  console.log(fails ? `\n${fails} FAILED` : '\nall green');
  process.exit(fails ? 1 : 0);
})();
