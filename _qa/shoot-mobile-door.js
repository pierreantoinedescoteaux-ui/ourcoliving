/* QA — verify the mobile "take the tour" door swing is actually PAINTED and
   VISIBLE on a phone viewport, not just that classes/opacity flip.

   The previous QA (shoot-r29h.js) asserted classList.contains('on') and
   computed opacity > 0.4 — a display:none element still reports opacity:1,
   so that test passed on a door that never rendered. Every check here reads
   getBoundingClientRect() on the actual door parts and requires non-zero
   width AND height, plus screenshots taken DURING the animation that get
   looked at with the Read tool afterward. */
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

/* reads real geometry, not classes/opacity */
async function doorRect(page) {
  return page.evaluate(() => {
    const inv = document.getElementById('lv3invite');
    const door = document.querySelector('.lv3-door2');
    const lf = document.querySelector('.lv3-door2 .lf');
    const rt = document.querySelector('.lv3-door2 .rt');
    const vw = window.innerWidth, vh = window.innerHeight;
    function box(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        w: Math.round(r.width), h: Math.round(r.height),
        left: Math.round(r.left), top: Math.round(r.top),
        right: Math.round(r.right), bottom: Math.round(r.bottom),
        display: cs.display, opacity: cs.opacity,
        inViewportX: r.right > 0 && r.left < vw,
        inViewportY: r.bottom > 0 && r.top < vh,
        overflowsX: r.left < -1 || r.right > vw + 1
      };
    }
    return { invite: box(inv), door: box(door), lf: box(lf), rt: box(rt), vw, vh,
      inviteClass: inv ? inv.className : null };
  });
}

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
    deviceScaleFactor: 2, userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile Safari/537.36' });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(BASE + '/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(2600);

  /* raise the doors (the arrival screen with the three door buttons).
     NOTE: a fixed-distance synthetic touch swipe (the old shoot-r29h.js
     approach) does NOT reliably reach the real arrival floor (measured at
     ~3038px on this build via arrivalFloor() — a single 340px swipe only
     gets to ~325px and settles in the intermediate "riding" state, never
     "landed"/"doorsup"). Scrolling straight to the real floor exercises the
     actual arrival mechanism instead of guessing a swipe distance. */
  const floor = await page.evaluate(() => arrivalFloor());
  await page.evaluate((f) => window.scrollTo(0, f), floor);
  await page.waitForTimeout(1300); // scroll settle (90ms) + glide (420ms) + margin
  const arrivalState = await page.evaluate(() => {
    const doors = document.getElementById('lv3doors');
    const tourBtn = document.querySelector('#lv3doors .lv3-door[data-group="tour"]');
    function box(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { w: Math.round(r.width), h: Math.round(r.height),
        visible: cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.5,
        top: Math.round(r.top), bottom: Math.round(r.bottom) };
    }
    return { htmlClass: document.documentElement.className, doors: box(doors), tourBtn: box(tourBtn) };
  });
  ok('lv3-doorsup class is actually on', /lv3-doorsup/.test(arrivalState.htmlClass), arrivalState.htmlClass);
  ok('the tour door button has real, visible geometry (not just present in DOM)',
    arrivalState.tourBtn && arrivalState.tourBtn.w > 0 && arrivalState.tourBtn.h > 0 && arrivalState.tourBtn.visible,
    JSON.stringify(arrivalState.tourBtn));
  await page.screenshot({ path: path.join(OUT, 'md-0-arrival.png') });

  /* baseline: before tapping, the door element must be display:none (still
     hidden the rest of the time — that part of the old behaviour must not
     regress) */
  const before = await doorRect(page);
  ok('before tap: #lv3invite is display:none (still hidden normally)',
    before.invite && before.invite.display === 'none', JSON.stringify(before.invite));

  /* tap "take the tour". The MutationObserver callback runs IN-BROWSER at
     the exact instant each class changes and captures geometry right there
     — this avoids the Node round-trip race that made an earlier version of
     this script flaky (screenshot/evaluate I/O between stages could eat
     enough wall-clock time that by the time Node asked for "is-opening but
     not is-through", is-through had already landed too). */
  await page.evaluate(() => {
    window.__doorFrames = [];
    const inv = document.getElementById('lv3invite');
    function rectOf(sel) {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height),
        left: Math.round(r.left), right: Math.round(r.right) };
    }
    function frame() {
      window.__doorFrames.push({
        t: performance.now(), cls: inv.className,
        lf: rectOf('.lv3-door2 .lf'), rt: rectOf('.lv3-door2 .rt')
      });
    }
    new MutationObserver(frame).observe(inv, { attributes: true, attributeFilter: ['class'] });
    frame();
    const t = document.querySelector('#lv3doors .lv3-door[data-group="tour"]');
    if (t) t.click();
  });

  /* stage A: just after the tap, BEFORE is-opening is added (door has
     arrived silently — walkThroughDoor() waits 260ms then adds is-opening).
     Poll on the real class list rather than a fixed sleep, since screenshot/
     evaluate round-trips eat into the animation's own clock and a fixed
     wait risks sampling a later beat than intended (see stage B note below). */
  await page.waitForFunction(() => {
    const inv = document.getElementById('lv3invite');
    return inv && inv.classList.contains('is-silent') && inv.classList.contains('on');
  }, { timeout: 2000 });
  const justAfterTap = await doorRect(page);
  await page.screenshot({ path: path.join(OUT, 'md-1-just-after-tap.png') });
  console.log('  stage A (just after tap, pre-swing):', JSON.stringify(justAfterTap));
  ok('stage A: door container has non-zero size',
    justAfterTap.invite && justAfterTap.invite.w > 0 && justAfterTap.invite.h > 0,
    JSON.stringify(justAfterTap.invite));
  ok('stage A: .lv3-door2 art has non-zero size',
    justAfterTap.door && justAfterTap.door.w > 0 && justAfterTap.door.h > 0,
    JSON.stringify(justAfterTap.door));
  ok('stage A: door is inside the viewport',
    justAfterTap.door && justAfterTap.door.inViewportX && justAfterTap.door.inViewportY);

  /* stage B: screenshot mid-swing for visual inspection. Timing here doesn't
     need to be exact for the SCREENSHOT (the transition is continuous, so
     any frame between is-opening and is-through is a valid "swinging" shot)
     — the actual pass/fail assertion below is drawn from the in-browser
     frame log, not from what Node happened to see when it looked. */
  await page.waitForFunction(() => {
    const inv = document.getElementById('lv3invite');
    return inv && inv.classList.contains('is-opening');
  }, { timeout: 2000 });
  await page.screenshot({ path: path.join(OUT, 'md-2-mid-swing.png') });

  /* stage C: end of sequence (through the door, tour has started) */
  await page.waitForTimeout(2200);
  const frames = await page.evaluate(() => window.__doorFrames || []);
  await page.screenshot({ path: path.join(OUT, 'md-3-through-and-landed.png') });
  console.log('  recorded frames:', frames.map(f => `${Math.round(f.t)}ms:${f.cls}`).join(' | '));
  ok('the leaves actually swung (is-opening fired)', frames.some(f => /is-opening/.test(f.cls)));
  ok('the camera walked through (is-through fired)', frames.some(f => /is-through/.test(f.cls)));

  /* the real "mid-swing" proof: a frame recorded with is-opening but NOT yet
     is-through, where the leaves had non-zero, non-overflowing geometry
     RIGHT AT THAT INSTANT (captured in-browser, no Node round-trip race). */
  const midSwingFrames = frames.filter(f => /is-opening/.test(f.cls) && !/is-through/.test(f.cls));
  ok('a genuine mid-swing frame was recorded (is-opening without is-through)',
    midSwingFrames.length > 0, `${midSwingFrames.length} frame(s)`);
  const goodMidSwing = midSwingFrames.find(f =>
    f.lf && f.lf.w > 0 && f.lf.h > 0 && f.rt && f.rt.w > 0 && f.rt.h > 0);
  ok('during that mid-swing frame, both leaves have non-zero size',
    !!goodMidSwing, JSON.stringify(midSwingFrames.map(f => ({ lf: f.lf, rt: f.rt }))));
  if (goodMidSwing) {
    const vw = 390;
    const lfOverflow = goodMidSwing.lf.left < -1 || goodMidSwing.lf.right > vw + 1;
    const rtOverflow = goodMidSwing.rt.left < -1 || goodMidSwing.rt.right > vw + 1;
    ok('during that mid-swing frame, neither leaf overflows the viewport horizontally',
      !lfOverflow && !rtOverflow, JSON.stringify({ lf: goodMidSwing.lf, rt: goodMidSwing.rt, vw }));
  }

  await page.waitForTimeout(1600);
  const arrived = await page.evaluate(() => ({
    doorGone: !document.getElementById('lv3invite').classList.contains('on'),
    floor: document.documentElement.getAttribute('data-floor'),
    scrolled: (window.scrollY || 0) > 200
  }));
  ok('the door is taken back down afterward', arrived.doorGone);
  ok('and the tour actually starts (scrolled/floor changed)', arrived.scrolled || arrived.floor,
    JSON.stringify(arrived));
  await page.screenshot({ path: path.join(OUT, 'md-4-final.png') });

  /* sanity: after everything resets, the door goes back to display:none */
  await page.waitForTimeout(400);
  const after = await doorRect(page);
  ok('after the sequence: #lv3invite is display:none again (no regression)',
    after.invite && after.invite.display === 'none', JSON.stringify(after.invite));

  ok('no page errors', errs.length === 0, errs.join(' | '));
  await ctx.close();
  await b.close();
  console.log(fails ? `\n${fails} FAILED` : '\nall green');
  process.exit(fails ? 1 : 0);
})();
