/* QA: the phone arrival, round 2 (P-A: "I definitely need to see a first
   scroll... the scroll and the 3D scrolling is the coolest part").

   Walks the real thumb path: tower -> a scroll that MOVES THE WORLD -> the
   page holds one scene later -> three doors -> a zone preview -> into the
   space itself. */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'mshots');
fs.mkdirSync(OUT, { recursive: true });

let fails = 0;
const ok = (l, c, d) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + l + (d ? '  ' + d : '')); };

/* a thumb drag, not a wheel event: this is the gesture that was broken */
async function swipeUp(page, dist = 320, steps = 14) {
  const y0 = 620;   /* NOT over the doors: a tap here would open one */
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
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
    isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 150)); });

  await p.goto('http://127.0.0.1:8123/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3200);

  // ---- 1. arrival ----
  console.log('\n[1] you land on the tower');
  let s = await p.evaluate(() => ({
    y: Math.round(scrollY),
    doors: getComputedStyle(document.getElementById('lv3doors')).visibility,
    cue: getComputedStyle(document.getElementById('lv3cue')).display !== 'none',
    floor: Math.round(WORLD.dwellCenter(1))
  }));
  ok('the doors are NOT up yet', s.doors === 'hidden', '(' + s.doors + ')');
  ok('the cue asks for a scroll', s.cue);
  ok('there is a scene to ride to', s.floor > 400, 'arrival floor=' + s.floor);
  await p.screenshot({ path: path.join(OUT, 'a1-tower.png') });

  // ---- 2. the scroll MOVES THE WORLD ----
  console.log('\n[2] the first scroll moves the world');
  await swipeUp(p, 300);
  await p.waitForTimeout(320);
  const mid = await p.evaluate(() => ({
    y: Math.round(scrollY),
    doors: getComputedStyle(document.getElementById('lv3doors')).visibility
  }));
  ok('the page actually scrolled', mid.y > 60, 'scrollY=' + mid.y);
  ok('it is a camera move, not an instant menu', mid.doors === 'hidden' || mid.y > 0,
    'y=' + mid.y + ' doors=' + mid.doors);
  await p.screenshot({ path: path.join(OUT, 'a2-moving.png') });

  // keep going until it holds
  for (let i = 0; i < 8; i++) {
    const done = await p.evaluate(() => document.documentElement.classList.contains('lv3-landed'));
    if (done) break;
    await swipeUp(p, 400);
    await p.waitForTimeout(260);
  }
  await p.waitForTimeout(900);

  // ---- 3. it holds one scene later, doors up ----
  console.log('\n[3] the page holds where you arrived');
  s = await p.evaluate(() => {
    const d = document.getElementById('lv3doors');
    const btns = [...d.querySelectorAll('.lv3-door')];
    const lit = [...document.querySelectorAll('#world .sw-copy')].filter(c => +getComputedStyle(c).opacity > 0.5);
    return {
      landed: document.documentElement.classList.contains('lv3-landed'),
      y: Math.round(scrollY), floor: Math.round(WORLD.dwellCenter(1)),
      doors: getComputedStyle(d).visibility,
      labels: btns.map(x => x.querySelector('b').textContent),
      sceneCopyShowing: lit.length,
      lede: (d.querySelector('.lv3-doors__lede') || {}).textContent
    };
  });
  ok('it landed', s.landed);
  ok('it holds at the next scene, not the top', Math.abs(s.y - s.floor) < 6, 'y=' + s.y + ' floor=' + s.floor);
  ok('the doors are up', s.doors === 'visible');
  ok('the order is resources, about me, tour',
    JSON.stringify(s.labels) === JSON.stringify(['Jump to resources', 'Learn about me', 'Take the tour']),
    s.labels.join(' | '));
  ok('the scene\'s own copy stands down so it does not double up', s.sceneCopyShowing === 0, s.sceneCopyShowing + ' showing');
  ok('the arrival line is there', /Where do you want to go/.test(s.lede || ''), s.lede);
  await p.screenshot({ path: path.join(OUT, 'a3-landed.png') });

  // ---- 4. the hold holds, and pushing pulses the tour door ----
  console.log('\n[4] pushing against the hold points at the tour');
  const beforeY = await p.evaluate(() => Math.round(scrollY));
  await swipeUp(p, 380);
  await p.waitForTimeout(120);
  const held = await p.evaluate(() => ({
    y: Math.round(scrollY),
    pulsed: !!document.querySelector('.lv3-door.is-tour.is-pulse')
  }));
  ok('the page did not run away', Math.abs(held.y - beforeY) < 8, beforeY + ' -> ' + held.y);
  ok('the tour door answered the push', held.pulsed);

  // ---- 5. a zone preview, not a subpage list ----
  console.log('\n[5] the gate shows zone previews');
  await p.waitForTimeout(600);
  await p.click('.lv3-door[data-group="resources"]');
  await p.waitForTimeout(800);
  const g = await p.evaluate(() => {
    const el = document.getElementById('lv3gate');
    const z = [...el.querySelectorAll('.lv3-zone[data-space]')];
    return {
      on: el.classList.contains('on'),
      names: z.map(x => x.querySelector('.lv3-zone__name').textContent),
      haveArt: z.every(x => /url\(/.test(getComputedStyle(x.querySelector('.lv3-zone__art')).backgroundImage)),
      haveDesc: z.every(x => (x.querySelector('.lv3-zone__desc').textContent || '').length > 20),
      subpageLists: el.querySelectorAll('.lv3-zone a[href]:not(.lv3-zone--plain)').length,
      arch: getComputedStyle(z[0].querySelector('.lv3-zone__art')).borderTopLeftRadius
    };
  });
  ok('the gate opened', g.on);
  ok('four zone previews', g.names.length === 4, g.names.join(' | '));
  ok('each one shows its own painting', g.haveArt);
  ok('each one carries the space\'s sentence', g.haveDesc);
  ok('no subpage list in the gate any more', g.subpageLists === 0, g.subpageLists + ' found');
  ok('the preview is a door shape (arched head)', parseFloat(g.arch) >= 30, g.arch);
  await p.screenshot({ path: path.join(OUT, 'a4-gate.png') });
  await p.screenshot({ path: path.join(OUT, 'a4-gate-full.png'), fullPage: true });

  // ---- 6. tapping a preview flies INTO the space ----
  console.log('\n[6] a preview takes you into the space');
  await p.click('.lv3-zone[data-space="library"]');
  await p.waitForTimeout(3200);
  const inSpace = await p.evaluate(() => {
    const lit = [...document.querySelectorAll('#world .sw-copy')].filter(c => +getComputedStyle(c).opacity > 0.5);
    const copy = lit[lit.length - 1];
    const r = copy ? copy.getBoundingClientRect() : null;
    const pills = copy ? [...copy.querySelectorAll('.sw-copy__tags li')] : [];
    const rows = new Set(pills.map(x => Math.round(x.getBoundingClientRect().top)));
    return {
      gateOff: !document.getElementById('lv3gate').classList.contains('on'),
      title: copy ? (copy.querySelector('.sw-copy__title') || {}).textContent : '',
      eyebrow: copy ? (copy.querySelector('.sw-copy__eyebrow') || {}).textContent : '',
      blockPct: r ? Math.round(r.height / innerHeight * 100) : 0,
      pills: pills.length, rows: rows.size,
      pillH: pills.length ? Math.round(pills[0].getBoundingClientRect().height) : 0,
      backOn: document.querySelector('.lv3-pback').classList.contains('on')
    };
  });
  ok('the gate closed behind you', inSpace.gateOff);
  ok('you are inside the library', /library/i.test(inSpace.eyebrow || ''), inSpace.eyebrow + ' / ' + inSpace.title);
  ok('the subpages are here, as small pills', inSpace.pills >= 3 && inSpace.pillH <= 50,
    inSpace.pills + ' pills on ' + inSpace.rows + ' rows, ' + inSpace.pillH + 'px tall');
  ok('the copy block leaves the painting room (<=45%)', inSpace.blockPct <= 45, inSpace.blockPct + '%');
  ok('there is a way back', inSpace.backOn);
  await p.screenshot({ path: path.join(OUT, 'a5-inside.png') });

  // ---- 7. type floors and the other gate (folded in from the retired
  //         shoot-mobile-landing.js when the flow it tested was replaced) ----
  console.log('\n[7] type floors and the about gate');
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(900);
  for (let i = 0; i < 9; i++) {
    if (await p.evaluate(() => document.documentElement.classList.contains('lv3-landed'))) break;
    await swipeUp(p, 400); await p.waitForTimeout(280);
  }
  await p.waitForTimeout(700);
  const type = await p.evaluate(() => {
    const px = sel => { const e = document.querySelector(sel); return e ? +parseFloat(getComputedStyle(e).fontSize).toFixed(1) : null; };
    const d = [...document.querySelectorAll('.lv3-door')];
    return {
      name: px('.lv3-door b'), line: px('.lv3-door i'), lede: px('.lv3-doors__lede'),
      minTap: Math.min(...d.map(x => Math.round(x.getBoundingClientRect().height))),
      bottom: Math.round(document.getElementById('lv3doors').getBoundingClientRect().bottom)
    };
  });
  ok('door name >=16px', type.name >= 16, type.name + 'px');
  ok('door line >=16px', type.line >= 16, type.line + 'px');
  ok('arrival line >=16px', type.lede >= 16, type.lede + 'px');
  ok('every door >=44px tall', type.minTap >= 44, type.minTap + 'px');
  ok('the doors fit on screen', type.bottom <= 845, 'bottom=' + type.bottom);

  await p.click('.lv3-door[data-group="me"]');
  await p.waitForTimeout(800);
  const g2 = await p.evaluate(() => {
    const el = document.getElementById('lv3gate');
    return {
      title: el.querySelector('h2').textContent,
      zones: [...el.querySelectorAll('.lv3-zone__name')].map(h => h.textContent),
      hello: !!el.querySelector('a[href^="mailto"]')
    };
  });
  ok('the about gate is titled plainly', g2.title === 'About me', g2.title);
  ok('house and garden, previewed', g2.zones.length >= 2, g2.zones.join(' | '));
  ok('say hello is there', g2.hello);
  await p.screenshot({ path: path.join(OUT, 'a6-gate-me.png'), fullPage: true });

  console.log('\n' + (errs.length ? errs.join('\n') : 'no JS errors'));
  if (errs.length) fails += errs.length;
  console.log('\n' + (fails ? 'FAILURES: ' + fails : 'ALL GREEN'));
  await b.close();
  process.exit(fails ? 1 : 0);
})();
