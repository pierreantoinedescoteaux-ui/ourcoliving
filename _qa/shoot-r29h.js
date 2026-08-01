/* QA round 29h — the two phone additions P-A asked for on 2026-08-01.

   1. "For the doors of the gateway when you click on resources or on learn
       about me on mobile, which lead you to arched preview of different
       zone/space, could we have an alternation left and right for the
       image/text. Like one time image left of text then switch."
   2. "When you click take the tour, maybe there could be the door animation
       on mobile as well — the doors arrive and then they open and then you
       get to the top." */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'mshots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

let fails = 0;
const ok = (l, c, d) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + l + (d ? '  ' + d : '')); };

async function swipeUp(page, dist = 340, steps = 14) {
  const y0 = 620;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: y0 }] });
  for (let i = 1; i <= steps; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: y0 - (dist * i / steps) }] });
    await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
}

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    deviceScaleFactor: 2, userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile Safari/537.36' });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(2600);

  /* raise the doors */
  await swipeUp(page);
  await page.waitForTimeout(1400);
  const doorsUp = await page.evaluate(() =>
    document.documentElement.classList.contains('lv3-doorsup') ||
    !!document.querySelector('#lv3doors .lv3-door'));
  ok('the three doors are up', doorsUp);

  /* ---- 1. the gate previews alternate ---- */
  await page.evaluate(() => {
    const b2 = document.querySelector('#lv3doors .lv3-door[data-group]:not(.is-tour)');
    if (b2) b2.click();
  });
  await page.waitForTimeout(900);

  const zones = await page.evaluate(() => {
    const list = [...document.querySelectorAll('#lv3gatezones .lv3-zone[data-space]')];
    return list.map(z => {
      const art = z.querySelector('.lv3-zone__art');
      const txt = z.querySelector('.lv3-zone__txt');
      if (!art || !txt) return null;
      const a = art.getBoundingClientRect(), t = txt.getBoundingClientRect();
      return { artLeftOfText: a.left < t.left, flip: z.classList.contains('lv3-zone--flip'),
        artL: Math.round(a.left), txtL: Math.round(t.left) };
    }).filter(Boolean);
  });
  ok('the gate shows more than one preview', zones.length >= 2, `${zones.length} previews`);
  if (zones.length >= 2) {
    const alternates = zones.every((z, i) => z.artLeftOfText === (i % 2 === 0));
    ok('the picture alternates sides down the column', alternates,
      zones.map((z, i) => `${i}:${z.artLeftOfText ? 'L' : 'R'}`).join(' '));
  }
  await page.screenshot({ path: path.join(OUT, 'r29h-gate-phone.png') });

  /* back out */
  await page.evaluate(() => { const b3 = document.getElementById('lv3gateback'); if (b3) b3.click(); });
  await page.waitForTimeout(700);

  /* ---- 2. the tour door swings on a phone ----
     The states are recorded as they happen rather than sampled: the whole
     sequence is 2.2s long and a single well-timed look can miss a beat
     that really did fire. */
  await page.evaluate(() => {
    window.__doorStates = [];
    const inv = document.getElementById('lv3invite');
    new MutationObserver(() => window.__doorStates.push(inv.className))
      .observe(inv, { attributes: true, attributeFilter: ['class'] });
    const t = document.querySelector('#lv3doors .lv3-door[data-group="tour"]');
    if (t) t.click();
  });
  await page.waitForTimeout(420);
  const arriving = await page.evaluate(() => {
    const inv = document.getElementById('lv3invite');
    if (!inv) return null;
    const cs = getComputedStyle(inv);
    const h2 = inv.querySelector('h2');
    return { on: inv.classList.contains('on'), silent: inv.classList.contains('is-silent'),
      visible: parseFloat(cs.opacity) > 0.4,
      wordsHidden: h2 ? getComputedStyle(h2).display === 'none' : true,
      hasDoorArt: !!inv.querySelector('.lv3-door2') };
  });
  ok('the painted door arrives', arriving && arriving.on && arriving.visible,
    JSON.stringify(arriving));
  ok('it arrives with no words on it', arriving && arriving.silent && arriving.wordsHidden);
  ok('it is the same painted door the desktop uses', arriving && arriving.hasDoorArt);
  await page.screenshot({ path: path.join(OUT, 'r29h-door-phone.png') });

  await page.waitForTimeout(1500);
  const seq = await page.evaluate(() => window.__doorStates || []);
  ok('and then the leaves swing', seq.some(c => /is-opening/.test(c)), seq.join(' | ').slice(0, 120));
  ok('and you walk through it', seq.some(c => /is-through/.test(c)));

  /* and the tour actually starts behind it */
  await page.waitForTimeout(2200);
  const arrived = await page.evaluate(() => ({
    doorGone: !document.getElementById('lv3invite').classList.contains('on'),
    floor: document.documentElement.getAttribute('data-floor'),
    scrolled: (window.scrollY || 0) > 200
  }));
  ok('the door is taken down again', arrived.doorGone);
  ok('and you arrive in the tower', arrived.scrolled || arrived.floor,
    JSON.stringify(arrived));

  ok('no page errors', errs.length === 0, errs.join(' | '));
  await ctx.close();
  await b.close();
  console.log(fails ? `\n${fails} FAILED` : '\nall green');
  process.exit(fails ? 1 : 0);
})();
