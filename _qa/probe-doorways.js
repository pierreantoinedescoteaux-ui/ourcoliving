/* P-A: "on about me there's a really weird and disproportionate size that
   makes it not nice. The button to go back to the tower is really big and
   then the design behind it, the tower narrative is barely used, so it's
   not very clean. Can you make sure there aren't other pages like that."

   So: measure all thirteen. For each, how wide is the pill against the
   screen, how much of the painted band is actually left visible by the
   page's own content, and does the page's first heading sit on the busy
   part of the painting. */
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

const PAGES = ['projects.html', 'resources.html', 'detail.html', 'inspiration.html',
  'talkpieces.html', 'themes.html', 'type.html', 'designers.html', 'design.html',
  'story.html', 'about.html', 'project.html', 'work.html', 'map.html'];

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const vp of [{ width: 390, height: 844, tag: 'phone' }, { width: 1440, height: 900, tag: 'desk' }]) {
    console.log(`\n===== ${vp.tag} ${vp.width}x${vp.height} =====`);
    const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height },
      isMobile: vp.tag === 'phone', hasTouch: vp.tag === 'phone',
      userAgent: vp.tag === 'phone' ? 'Mozilla/5.0 (Linux; Android 13) Mobile Safari/537.36' : undefined });
    const page = await ctx.newPage();
    for (const f of PAGES) {
      await page.goto(BASE + '/' + f, { waitUntil: 'load' });
      await page.waitForTimeout(500);
      const m = await page.evaluate(() => {
        const band = document.querySelector('.wband');
        const pill = document.querySelector('.wback');
        if (!band) return { none: true };
        const bb = band.getBoundingClientRect();
        const pb = pill ? pill.getBoundingClientRect() : null;

        /* how far down the band does the page's own opaque content start?
           walk the top-level content and find the first box that overlaps it */
        let firstCover = bb.bottom;
        document.querySelectorAll('main *, header *, section *').forEach(el => {
          if (el.closest('.wbandwrap')) return;
          const cs = getComputedStyle(el);
          const opaque = (cs.backgroundImage !== 'none') ||
            (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && !cs.backgroundColor.includes('rgba(0, 0, 0, 0)'));
          if (!opaque) return;
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) return;
          if (r.top < bb.bottom && r.bottom > bb.top && r.width > bb.width * 0.5) {
            firstCover = Math.min(firstCover, Math.max(bb.top, r.top));
          }
        });

        /* the page's first heading — is it inside the band? */
        const h = document.querySelector('main h1, main h2, header h1, .hero h1, h1');
        const hb = h ? h.getBoundingClientRect() : null;

        return {
          bandH: Math.round(bb.height),
          visible: Math.round(firstCover - bb.top),
          pillW: pb ? Math.round(pb.width) : 0,
          pillPct: pb ? Math.round(pb.width / innerWidth * 100) : 0,
          headInBand: hb ? (hb.top < bb.bottom && hb.bottom > bb.top) : false,
          headTop: hb ? Math.round(hb.top) : null,
          vw: innerWidth
        };
      });
      if (m.none) { console.log(`  ${f.padEnd(18)} no band`); continue; }
      const flags = [];
      if (m.pillPct > 55) flags.push(`PILL ${m.pillPct}% of screen`);
      if (m.visible < m.bandH * 0.55) flags.push(`band ${m.visible}/${m.bandH}px visible`);
      if (m.headInBand) flags.push('heading ON the painting');
      console.log(`  ${f.padEnd(18)} band ${String(m.bandH).padStart(3)}px  shown ${String(m.visible).padStart(3)}px  pill ${String(m.pillW).padStart(3)}px (${m.pillPct}%)  ${flags.length ? '<<< ' + flags.join(' | ') : ''}`);
    }
    await ctx.close();
  }
  await b.close();
})();
