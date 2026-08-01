/* QA round 29g — the summit, reframed rather than re-rendered.

   P-A's notes, each one an assertion here:
     "move the scene's text box to the top, into the sky, and keep enough sky
      above and below the text that it still reads as sky"
     "shift the design down a little so more sky shows, but not past the
      telescope; the telescope must stay visible"
     "shift a little to the right so more of the gardener shows"
     "the house with the chimney smoke, that's too far, forget about it"

   The telescope and the gardeners are points in the SOURCE painting. They
   are projected through the same cover fit the browser uses, so the test
   knows where they land on the phone rather than guessing from a picture. */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'mshots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

let fails = 0;
const ok = (l, c, d) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + l + (d ? '  ' + d : '')); };

/* fractions of the FULL 1600x900 painting, read off assets/tower/S7.webp */
const POINTS = {
  telescope: [0.485, 0.790],
  gardeners: [0.635, 0.855],
  standing:  [0.575, 0.720]
};
/* the phone encode is crop=608:1080:656:0 of 1920x1080 */
const CROP0 = 656 / 1920, CROPW = 608 / 1920;

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const vp of [{ w: 390, h: 844 }, { w: 360, h: 640 }]) {
    console.log(`\n-- phone ${vp.w}x${vp.h} --`);
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: true, hasTouch: true,
      deviceScaleFactor: 2, userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile Safari/537.36' });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto(BASE + '/index.html', { waitUntil: 'load' });
    await page.waitForTimeout(2600);

    /* stand on the summit */
    const landed = await page.evaluate(() => {
      if (!window.SW || !window.SW.dwellCenter) return false;
      const i = (window.SW.sections || []).findIndex(s => s.id === 'lookout');
      const n = i >= 0 ? i : 0;
      scrollTo(0, window.SW.dwellCenter(n));
      return true;
    }).catch(() => false);
    if (!landed) {
      /* the engine's handle is not exposed here; walk to the end instead */
      await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    }
    await page.waitForTimeout(1400);

    const m = await page.evaluate(({ POINTS, CROP0, CROPW }) => {
      const sc = document.querySelector('.sw-scene[data-scene="lookout"]');
      if (!sc) return { none: true };
      const media = sc.querySelector('.sw-scene__video') || sc.querySelector('.sw-scene__still');
      const r = media.getBoundingClientRect();
      const nat = { w: media.videoWidth || media.naturalWidth, h: media.videoHeight || media.naturalHeight };
      if (!nat.w) return { noNat: true };
      const cs = getComputedStyle(media);
      const pos = cs.objectPosition.split(' ');
      const px = parseFloat(pos[0]) / 100, py = parseFloat(pos[1]) / 100;
      const k = Math.max(r.width / nat.w, r.height / nat.h);
      const dw = nat.w * k, dh = nat.h * k;
      /* object-position places the overflow */
      const offX = (r.width - dw) * px, offY = (r.height - dh) * py;

      const out = {};
      for (const [name, p] of Object.entries(POINTS)) {
        /* source fraction -> phone clip fraction (the clip is a crop) */
        const cx = (p[0] - CROP0) / CROPW;
        const cy = p[1];
        const x = r.left + offX + cx * dw;
        const y = r.top + offY + cy * dh;
        out[name] = { x: Math.round(x), y: Math.round(y),
          on: x >= 0 && x <= innerWidth && y >= 0 && y <= innerHeight };
      }
      /* the words live in the copy LAYER, not inside the scene */
      const copy = document.querySelector('.sw-copy[data-scene="lookout"]');
      const cr = copy ? copy.getBoundingClientRect() : null;
      return { pts: out, objectPosition: cs.objectPosition,
        copy: cr ? { t: Math.round(cr.top), b: Math.round(cr.bottom) } : null,
        vh: innerHeight };
    }, { POINTS, CROP0, CROPW });

    if (m.none) { ok('the summit scene is on the page', false); await ctx.close(); continue; }
    if (m.noNat) { ok('the summit media has loaded', false); await ctx.close(); continue; }

    ok(`${vp.w}px: the telescope stays visible`, m.pts.telescope.on,
      `at ${m.pts.telescope.x},${m.pts.telescope.y}`);
    ok(`${vp.w}px: the gardeners are in frame`, m.pts.gardeners.on,
      `at ${m.pts.gardeners.x},${m.pts.gardeners.y}`);
    ok(`${vp.w}px: the standing figure is in frame`, m.pts.standing.on,
      `at ${m.pts.standing.x},${m.pts.standing.y}`);
    /* the words in the sky, with sky above AND below them */
    /* "keep enough sky above and below the text that it still reads as sky":
       the terrace begins around 0.62 of the frame, so the words have to
       finish clear of it */
    ok(`${vp.w}px: the words sit in the sky, not on the terrace`,
      m.copy && m.copy.b < m.vh * 0.58,
      m.copy ? `copy ${m.copy.t}..${m.copy.b} of ${m.vh}` : 'no copy block');
    ok(`${vp.w}px: sky above the words too`, m.copy && m.copy.t > 40,
      m.copy ? `starts at ${m.copy.t}` : '');

    if (vp.w === 390) await page.screenshot({ path: path.join(OUT, 'r29g-summit-phone.png') });
    ok(`${vp.w}px: no page errors`, errs.length === 0, errs.join(' | '));
    await ctx.close();
  }
  await b.close();
  console.log(fails ? `\n${fails} FAILED` : '\nall green');
  process.exit(fails ? 1 : 0);
})();
