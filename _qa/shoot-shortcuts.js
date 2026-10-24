/* Landing shortcuts QA (index.html, the five hanging tags / phone stickers).
   Needs the repo served over HTTP:  node _qa/shoot-shortcuts.js
   BASE defaults to http://127.0.0.1:8123 (override with env BASE). */
const { chromium } = require('C:/Users/User/coliving-portfolio/_qa/node_modules/playwright-core');
const path = require('path');
const BASE = (process.env.BASE || 'http://127.0.0.1:8123').replace(/\/$/, '');
const OUT = path.join(__dirname, 'shortcuts');
const SIZES = [
  { name: 'desktop-1366', w: 1366, h: 900, mobile: false },
  { name: 'laptop-1024', w: 1024, h: 768, mobile: false },
  { name: 'laptop-1280x720', w: 1280, h: 720, mobile: false },
  { name: 'phone-390', w: 390, h: 844, mobile: true },
  { name: 'phone-375x667', w: 375, h: 667, mobile: true },
];
const fails = [];
const F = (s, m) => fails.push(`[${s}] ${m}`);

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const hrefs = new Set();
  for (const S of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: S.w, height: S.h }, isMobile: S.mobile, hasTouch: S.mobile, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !/favicon|fontshare|Failed to load resource/i.test(m.text())) errs.push('console: ' + m.text()); });
    await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(3500);   // the tags' settle-swing is 2.5s
    await page.screenshot({ path: path.join(OUT, `shortcuts-${S.name}.png`) });
    if (errs.length) F(S.name, 'JS errors: ' + errs.join(' | '));

    const r = await page.evaluate((mobile) => {
      const vw = innerWidth, vh = innerHeight;
      const box = el => { const b = el.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height }; };
      const hit = (a, b) => !(a.r <= b.l || a.l >= b.r || a.b <= b.t || a.t >= b.b);
      const links = [...document.querySelectorAll('.lv3-jump a')].map(a => {
        const bx = box(a), cs = getComputedStyle(a);
        const cx = bx.l + bx.w / 2, cy = bx.t + bx.h / 2;
        const top = document.elementFromPoint(cx, cy);
        return { text: a.textContent.trim(), href: a.getAttribute('href'), box: bx,
          font: parseFloat(cs.fontSize), op: parseFloat(getComputedStyle(document.querySelector('.lv3-jump')).opacity),
          vis: cs.visibility, onTop: !!(top && a.contains(top)) };
      });
      const others = [];
      document.querySelectorAll('.lv3-name, .lv3-eyebrow, .lv3-hero h1, .lv3-hero .lede, .lv3-tour, .lv3-legend, .lv3-cue, .gl-btn, .sw-route').forEach(el => {
        const b = box(el); if (b.w && b.h && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden') others.push({ cls: el.className.toString().split(' ')[0] + ':' + (el.textContent || '').trim().slice(0, 16), box: b });
      });
      const clashes = [];
      links.forEach(L => others.forEach(o => { if (hit(L.box, o.box)) clashes.push(L.text + ' x ' + o.cls); }));
      const lede = document.querySelector('.lv3-hero .lede');
      return { links, clashes, sideways: document.documentElement.scrollWidth > vw + 1, vw, vh,
        ledeFont: lede && getComputedStyle(lede).display !== 'none' ? parseFloat(getComputedStyle(lede).fontSize) : null };
    }, S.mobile);

    if (r.sideways) F(S.name, 'sideways scroll');
    if (r.links.length < 3 || r.links.length > 5) F(S.name, `expected 3-5 shortcuts, got ${r.links.length}`);
    r.links.forEach(L => {
      hrefs.add(L.href);
      const b = L.box;
      if (!(b.w > 0 && b.h > 0 && b.l >= 0 && b.t >= 0 && b.r <= r.vw && b.b <= r.vh)) F(S.name, `${L.text} not fully on screen ${JSON.stringify(b)}`);
      if (L.op < 0.99 || L.vis === 'hidden') F(S.name, `${L.text} not visible (opacity ${L.op})`);
      if (!L.onTop) F(S.name, `${L.text} is covered by something at its centre`);
      if (L.font < 12) F(S.name, `${L.text} label ${L.font}px < 12px`);
      if (S.mobile) {
        if (b.h < 44 || b.w < 44) F(S.name, `${L.text} tap target ${Math.round(b.w)}x${Math.round(b.h)} < 44`);
        if (b.l < 16 - 0.5 || b.r > r.vw - 16 + 0.5) F(S.name, `${L.text} outside the 16px gutter`);
      } else if (b.h < 40) F(S.name, `${L.text} target only ${Math.round(b.h)}px tall`);
    });
    r.clashes.forEach(c => F(S.name, 'overlap: ' + c));
    if (S.mobile && r.ledeFont !== null && r.ledeFont < 16) F(S.name, `lede ${r.ledeFont}px < 16px`);

    if (S.mobile) {
      // one scroll: the doors rise, the stickers must step aside with the headline
      await page.mouse.wheel(0, 300).catch(() => {});
      await page.evaluate(() => window.scrollBy(0, 1));
      await page.touchscreen.tap(5, 5).catch(() => {});
      await page.evaluate(() => document.documentElement.classList.add('lv3-doorsup'));
      await page.waitForTimeout(600);
      const gone = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.lv3-jump')).opacity));
      if (gone > 0.01) F(S.name, `stickers still showing with the doors up (opacity ${gone})`);
      await page.screenshot({ path: path.join(OUT, `shortcuts-${S.name}-doors.png`) });
    }
    console.log(`${S.name}: ${r.links.map(l => l.text).join(' / ')}`);
    await ctx.close();
  }

  // reduced motion: no swing, no sway
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(800);
    const anim = await page.evaluate(() => [...document.querySelectorAll('.lv3-jump li')].map(li => getComputedStyle(li).animationName));
    if (anim.some(a => a !== 'none')) F('reduced-motion', 'tags still animate: ' + anim.join(','));
    await ctx.close();
  }

  // every href resolves
  const ctx = await browser.newContext();
  for (const h of hrefs) {
    const url = BASE + '/' + h.replace(/#.*$/, '');
    const res = await ctx.request.get(url).catch(e => ({ status: () => 'ERR ' + e.message }));
    const st = res.status();
    console.log(`  ${h} -> ${st}`);
    if (st !== 200) F('href', `${h} returned ${st}`);
  }
  await browser.close();
  console.log(fails.length ? 'FAILURES:\n' + fails.join('\n') : 'ALL GREEN');
  process.exit(fails.length ? 1 : 0);
})();
