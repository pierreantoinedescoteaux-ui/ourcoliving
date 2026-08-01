/* QA round 29d — the balloon easter egg.
   P-A: "if you click on the hot air balloon it could have a little popup,
   send a postcard." No street address on the page: he chose that. */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'mshots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

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
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto(BASE + '/arrival-mock.html', { waitUntil: 'load' });
    await page.waitForTimeout(2600);   /* the settle, then the arming poll */

    const armed = await page.evaluate(() => {
      const el = document.getElementById('balloon');
      return !!(el && el.dataset.wfxBalloon === '1' && el.getAttribute('role') === 'button');
    });
    ok(`${vp.tag}: the balloon is something you can click`, armed);

    /* the sky is staged by hand here — the rest of the delight layer must
       stay off or two designs fight */
    const quiet = await page.evaluate(() =>
      document.querySelectorAll('.wfx-mote').length === 0 &&
      document.querySelectorAll('.wfx-veil').length === 0);
    ok(`${vp.tag}: no motes or load veil on the arrival`, quiet);

    await page.evaluate(() => document.getElementById('balloon').click());
    await page.waitForTimeout(650);

    const card = await page.evaluate(() => {
      const w = document.querySelector('.wfx-pcwrap');
      if (!w) return null;
      const pc = w.querySelector('.wfx-pc');
      const r = pc.getBoundingClientRect();
      const txt = pc.textContent;
      return {
        onScreen: r.left >= 0 && r.right <= innerWidth + 1 && r.top >= 0 && r.bottom <= innerHeight + 1,
        w: Math.round(r.width),
        hasStamp: !!pc.querySelector('.wfx-stamp img'),
        mailto: (pc.querySelector('.wfx-go') || {}).href || '',
        emDash: /—/.test(txt),
        /* he chose: no street address published */
        looksLikeAddress: /\b\d{2,5}\s+\w+\s+(st|street|ave|avenue|rue|blvd|road|rd)\b/i.test(txt) ||
                          /\b[A-Z]\d[A-Z]\s?\d[A-Z]\d\b/.test(txt),
        closeH: Math.round((pc.querySelector('.wfx-x') || { getBoundingClientRect: () => ({ height: 0 }) }).getBoundingClientRect().height)
      };
    });
    ok(`${vp.tag}: the postcard opens`, !!card);
    if (card) {
      ok(`${vp.tag}: it fits on the screen`, card.onScreen, `${card.w}px wide`);
      ok(`${vp.tag}: it carries the painted balloon as its stamp`, card.hasStamp);
      ok(`${vp.tag}: it offers a way to write`, /^mailto:/.test(card.mailto));
      ok(`${vp.tag}: no street address published`, !card.looksLikeAddress);
      ok(`${vp.tag}: no em dashes`, !card.emDash);
      ok(`${vp.tag}: the close button is a real target`, card.closeH >= 44, `${card.closeH}px`);
    }
    if (vp.tag === 'phone') await page.screenshot({ path: path.join(OUT, 'r29d-postcard-phone.png') });
    else await page.screenshot({ path: path.join(OUT, 'r29d-postcard-desk.png') });

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    const gone = await page.evaluate(() => !document.querySelector('.wfx-pcwrap'));
    ok(`${vp.tag}: escape closes it`, gone);

    ok(`${vp.tag}: no page errors`, errs.length === 0, errs.join(' | '));
    await ctx.close();
  }
  await b.close();
  console.log(fails ? `\n${fails} FAILED` : '\nall green');
  process.exit(fails ? 1 : 0);
})();
