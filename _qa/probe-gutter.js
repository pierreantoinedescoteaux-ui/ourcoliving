/* P-A: "the padding on the website is still odd on mobile in particular,
   it's very tight at the top and even though there's white space at the
   bottom." Find every block of reading text that is closer to the screen
   edge than the page's own gutter. */
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

const PAGES = ['index.html', 'manifesto.html', 'projects.html', 'resources.html', 'detail.html',
  'inspiration.html', 'talkpieces.html', 'themes.html', 'type.html', 'designers.html',
  'design.html', 'story.html', 'about.html', 'project.html', 'work.html', 'map.html',
  'why.html', 'networks.html', 'how-to.html', 'community.html', 'separation.html', 'arts.html'];

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile Safari/537.36' });
  const page = await ctx.newPage();

  for (const f of PAGES) {
    const res = await page.goto(BASE + '/' + f, { waitUntil: 'load' }).catch(() => null);
    if (!res || !res.ok()) { console.log(`  ${f.padEnd(18)} (missing)`); continue; }
    await page.waitForTimeout(450);
    const m = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('h1,h2,h3,p,li,.lede,.eyebrow').forEach(el => {
        if (el.closest('.snav') || el.closest('.sfooter') || el.closest('.wbandwrap')) return;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') return;
        const r = el.getBoundingClientRect();
        if (r.width < 40 || r.height < 6) return;
        if (r.bottom < -400 || r.top > 6000) return;
        if (!el.textContent.trim()) return;
        /* off to the side entirely (carousel tracks) — not on screen at all */
        if (r.right < 0 || r.left > innerWidth) return;
        /* a centred full-bleed line is a deliberate banner, not lost padding */
        if (cs.textAlign === 'center' && r.width >= innerWidth - 26) return;
        if (getComputedStyle(el.parentElement || el).justifyContent === 'center'
            && r.width >= innerWidth - 26) return;
        /* inside something that scrolls sideways: a card peeking in is the
           point of a carousel, not a padding fault */
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const o = getComputedStyle(p).overflowX;
          if (o === 'auto' || o === 'scroll') return;
        }
        /* a text box whose own left edge is under 12px from the screen */
        if (r.left < 12 || r.right > innerWidth - 12) {
          bad.push({ tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 28),
            l: Math.round(r.left), r: Math.round(innerWidth - r.right),
            txt: el.textContent.trim().slice(0, 34) });
        }
      });
      /* dedupe by text */
      const seen = new Set();
      return bad.filter(x => { const k = x.txt; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 6);
    });
    if (m.length) {
      console.log(`  ${f}`);
      m.forEach(x => console.log(`      ${x.tag}.${x.cls}  left ${x.l}px right ${x.r}px  "${x.txt}"`));
    } else {
      console.log(`  ${f.padEnd(18)} ok`);
    }
  }
  await b.close();
})();
