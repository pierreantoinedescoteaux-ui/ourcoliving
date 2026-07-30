/* QA: the rebuilt mobile landing (P-A, 2026-07-30).
   Walks the real flow a thumb takes: arrive -> scroll -> doors -> gate,
   and measures every text size against MOBILE-RULES.md floors. */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'mshots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://127.0.0.1:8123/index.html';

let fails = 0;
const ok = (label, cond, detail) => {
  if (!cond) fails++;
  console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail ? '  ' + detail : ''));
};

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
    isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 160)); });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200);

  // ---- 1. arrival: the tower alone ----
  console.log('\n[1] arrival');
  await page.screenshot({ path: path.join(OUT, '1-arrive.png') });
  let s = await page.evaluate(() => ({
    doorsVisible: getComputedStyle(document.getElementById('lv3doors')).visibility,
    cueShown: getComputedStyle(document.getElementById('lv3cue')).display !== 'none',
    stackGone: !document.getElementById('lv3stack'),
    heroBottom: Math.round(document.querySelector('.lv3-hero').getBoundingClientRect().bottom)
  }));
  ok('the six-tile stack is gone', s.stackGone);
  ok('the doors are not shown on arrival', s.doorsVisible === 'hidden', '(' + s.doorsVisible + ')');
  ok('the scroll cue is shown', s.cueShown);
  ok('the hero sits low, art above it', s.heroBottom > 500, 'bottom=' + s.heroBottom);

  // ---- 2. one scroll raises the doors ----
  console.log('\n[2] one scroll');
  await page.mouse.move(195, 500);
  await page.mouse.wheel(0, 240);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, '2-doors.png') });
  s = await page.evaluate(() => {
    const d = document.getElementById('lv3doors');
    const btns = [...d.querySelectorAll('.lv3-door')];
    return {
      visible: getComputedStyle(d).visibility,
      scrolled: window.scrollY,
      labels: btns.map(b => b.querySelector('b').textContent),
      heights: btns.map(b => Math.round(b.getBoundingClientRect().height)),
      bottom: Math.round(d.getBoundingClientRect().bottom),
      artClear: Math.round(d.getBoundingClientRect().top)
    };
  });
  ok('the doors came up', s.visible === 'visible');
  ok('the page itself did not scroll away', s.scrolled === 0, 'scrollY=' + s.scrolled);
  ok('three doors', s.labels.length === 3, s.labels.join(' | '));
  ok('every door is at least 44px tall', s.heights.every(h => h >= 44), s.heights.join(','));
  ok('the doors fit on screen', s.bottom <= 844, 'bottom=' + s.bottom);
  ok('the tower is still visible above them', s.artClear > 300, 'top=' + s.artClear);

  // ---- 3. type sizes against MOBILE-RULES ----
  console.log('\n[3] type floors (reading >=16px, micro >=12px)');
  const type = await page.evaluate(() => {
    const px = sel => { const e = document.querySelector(sel); return e ? +parseFloat(getComputedStyle(e).fontSize).toFixed(1) : null; };
    return {
      'hero headline': px('.lv3-hero h1'),
      'hero eyebrow (micro)': px('.lv3-eyebrow'),
      'scroll cue (micro)': px('.lv3-cue'),
      'door name': px('.lv3-door b'),
      'door line': px('.lv3-door i')
    };
  });
  const MICRO = ['hero eyebrow (micro)', 'scroll cue (micro)'];
  for (const [k, v] of Object.entries(type)) {
    const floor = MICRO.includes(k) ? 12 : 16;
    ok(k.padEnd(22) + v + 'px', v >= floor, '(floor ' + floor + ')');
  }

  // ---- 4. the gate ----
  console.log('\n[4] the resources gate');
  await page.click('.lv3-door[data-group="resources"]');
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, '3-gate.png') });
  await page.screenshot({ path: path.join(OUT, '3-gate-full.png'), fullPage: true });
  const g = await page.evaluate(() => {
    const el = document.getElementById('lv3gate');
    const zones = [...el.querySelectorAll('.lv3-zone')];
    const links = [...el.querySelectorAll('.lv3-zone a')];
    return {
      on: el.classList.contains('on'),
      title: el.querySelector('h2').textContent,
      zones: zones.map(z => (z.querySelector('h3') || {}).textContent).filter(Boolean),
      chips: zones.map(z => (z.querySelector('.lv3-zone__chip') || {}).textContent).filter(Boolean),
      linkCount: links.length,
      linkHeights: links.map(a => Math.round(a.getBoundingClientRect().height)),
      linkFont: links.length ? +parseFloat(getComputedStyle(links[0]).fontSize).toFixed(1) : 0,
      zoneDescFont: +parseFloat(getComputedStyle(el.querySelector('.lv3-zone p')).fontSize).toFixed(1),
      hasDescOnLinks: links.some(a => a.querySelector('span, i, p'))
    };
  });
  ok('the gate opened', g.on);
  ok('gate title', !!g.title, '"' + g.title + '"');
  ok('four zones under resources', g.zones.length === 4, g.zones.join(' | '));
  ok('each zone carries its colour word', g.chips.length === 4, g.chips.join(','));
  ok('subpage buttons present', g.linkCount >= 10, g.linkCount + ' links');
  ok('subpage buttons are names only, no descriptions', !g.hasDescOnLinks);
  ok('subpage buttons >=44px', g.linkHeights.every(h => h >= 44), Math.min(...g.linkHeights) + 'px min');
  ok('subpage label >=16px', g.linkFont >= 16, g.linkFont + 'px');
  ok('zone description >=16px', g.zoneDescFont >= 16, g.zoneDescFont + 'px');

  // gate must scroll
  const scrolledInGate = await page.evaluate(async () => {
    const el = document.getElementById('lv3gate');
    el.scrollTop = 400;
    await new Promise(r => setTimeout(r, 120));
    return el.scrollTop;
  });
  ok('the gate scrolls', scrolledInGate > 0, 'scrollTop=' + scrolledInGate);

  // ---- 5. back to the tower ----
  console.log('\n[5] back');
  await page.click('#lv3gateback');
  await page.waitForTimeout(700);
  const back = await page.evaluate(() => ({
    gateOff: !document.getElementById('lv3gate').classList.contains('on'),
    doorsStillUp: getComputedStyle(document.getElementById('lv3doors')).visibility === 'visible'
  }));
  ok('the gate closed', back.gateOff);
  ok('the doors are still there', back.doorsStillUp);

  // ---- 6. the about gate ----
  console.log('\n[6] the about gate');
  await page.click('.lv3-door[data-group="me"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, '4-gate-me.png'), fullPage: true });
  const g2 = await page.evaluate(() => {
    const el = document.getElementById('lv3gate');
    return {
      title: el.querySelector('h2').textContent,
      zones: [...el.querySelectorAll('.lv3-zone h3')].map(h => h.textContent),
      hello: !!el.querySelector('a[href^="mailto"]')
    };
  });
  ok('about gate title', !!g2.title, '"' + g2.title + '"');
  ok('house and garden', g2.zones.length === 2, g2.zones.join(' | '));
  ok('say hello is here', g2.hello);
  await page.click('#lv3gateback');
  await page.waitForTimeout(500);

  // ---- 7. a second scroll walks through the tour door ----
  console.log('\n[7] second scroll starts the tour');
  await page.waitForTimeout(1100);              // the 900ms reading beat
  await page.mouse.wheel(0, 240);
  await page.waitForTimeout(2600);
  const tour = await page.evaluate(() => ({ y: window.scrollY, doors: getComputedStyle(document.getElementById('lv3doors')).visibility }));
  ok('the tour flew to the top of the tower', tour.y > 2000, 'scrollY=' + tour.y);
  await page.screenshot({ path: path.join(OUT, '5-summit.png') });

  // ---- 8. the climb: scene copy shape ----
  console.log('\n[8] the climb');
  const climb = await page.evaluate(() => {
    const tags = [...document.querySelectorAll('#world .sw-copy__tags li a')].filter(a => a.offsetParent);
    const body = [...document.querySelectorAll('#world .sw-copy__body')].filter(b => b.offsetParent)[0];
    return {
      tagCount: tags.length,
      tagH: tags.map(a => Math.round(a.getBoundingClientRect().height)),
      tagFont: tags.length ? +parseFloat(getComputedStyle(tags[0]).fontSize).toFixed(1) : 0,
      bodyFont: body ? +parseFloat(getComputedStyle(body).fontSize).toFixed(1) : 0
    };
  });
  ok('the scene shows its subpage buttons', climb.tagCount >= 2, climb.tagCount + ' buttons');
  ok('scene buttons >=44px', climb.tagH.every(h => h >= 44), climb.tagH.join(','));
  ok('scene button label >=16px', climb.tagFont >= 16, climb.tagFont + 'px');
  ok('scene description >=16px', climb.bodyFont >= 16, climb.bodyFont + 'px');

  // ---- 9. the scene copy must be readable, every scene ----
  console.log('\n[9] every scene is readable while descending');
  const scenes = await page.evaluate(async () => {
    const out = [];
    const ids = ['lookout', 'homes', 'gardens', 'makers', 'library', 'commons'];
    for (const id of ids) {
      const i = WORLD.indexOf(id);
      window.scrollTo(0, WORLD.dwellCenter(i));
      await new Promise(r => setTimeout(r, 500));
      const copy = [...document.querySelectorAll('#world .sw-copy')]
        .filter(c => parseFloat(getComputedStyle(c).opacity || 0) > 0.5).pop();
      if (!copy) { out.push({ id, missing: true }); continue; }
      const r = copy.getBoundingClientRect();
      // the scrim strength where the heading sits
      const h = copy.querySelector('.sw-copy__title') || copy;
      const hr = h.getBoundingClientRect();
      out.push({
        id,
        top: Math.round(r.top), bottom: Math.round(r.bottom),
        headingTop: Math.round(hr.top),
        onScreen: r.top >= 0 && r.bottom <= innerHeight + 1,
        overNav: r.top < 56
      });
    }
    return out;
  });
  scenes.forEach(s => {
    ok(('scene ' + s.id).padEnd(16) + (s.missing ? 'no copy found' : 'top=' + s.top + ' bottom=' + s.bottom),
      !s.missing && s.onScreen && !s.overNav);
  });

  // ---- 10. the pin experiment, on the one element it can serve ----
  console.log('\n[10] the pin experiment (the Garden)');
  await page.evaluate(async () => {
    window.scrollTo(0, WORLD.dwellCenter(WORLD.indexOf('gardens')));
    await new Promise(r => setTimeout(r, 600));
  });
  await page.waitForTimeout(700);
  const pins = await page.evaluate(() => {
    const layer = document.getElementById('lv3pins');
    const els = [...layer.querySelectorAll('.lv3-pin')].filter(a => a.style.display !== 'none');
    const copy = [...document.querySelectorAll('#world .sw-copy')]
      .filter(c => parseFloat(getComputedStyle(c).opacity || 0) > 0.5).pop();
    const cb = copy ? copy.getBoundingClientRect() : null;
    const overlap = (a, b) => !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
    return {
      on: layer.classList.contains('is-on'),
      names: els.map(a => a.textContent),
      boxes: els.map(a => { const r = a.getBoundingClientRect(); return { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), h: Math.round(r.height) }; }),
      coversCopy: cb ? els.some(a => overlap(a.getBoundingClientRect(), cb)) : false,
      font: els.length ? +parseFloat(getComputedStyle(els[0]).fontSize).toFixed(1) : 0
    };
  });
  ok('the pin layer is lit in the Garden', pins.on);
  ok('one pin, the waterworks', pins.names.length === 1 && pins.names[0] === 'The waterworks', pins.names.join(' | ') || 'none');
  ok('no pin covers the scene copy', !pins.coversCopy);
  ok('the pin is fully on screen', pins.boxes.every(b => b.l >= 0 && b.r <= 390 && b.t >= 0 && b.b <= 844), JSON.stringify(pins.boxes));
  ok('the pin clears the site nav', pins.boxes.every(b => b.t >= 56), 'top=' + pins.boxes.map(b => b.t).join(','));
  ok('the pin is >=44px tall', pins.boxes.every(b => b.h >= 44), pins.boxes.map(b => b.h).join(','));
  ok('pin label >=16px', pins.font >= 16, pins.font + 'px');
  await page.screenshot({ path: path.join(OUT, '6-pins.png') });

  // no pins anywhere else
  const elsewhere = await page.evaluate(async () => {
    window.scrollTo(0, WORLD.dwellCenter(WORLD.indexOf('library')));
    await new Promise(r => setTimeout(r, 600));
    return document.getElementById('lv3pins').classList.contains('is-on');
  });
  ok('no pins in the other scenes', !elsewhere);

  console.log('\n' + (errs.length ? errs.join('\n') : 'no JS errors'));
  if (errs.length) fails += errs.length;
  console.log('\n' + (fails ? 'FAILURES: ' + fails : 'ALL GREEN'));
  await browser.close();
  process.exit(fails ? 1 : 0);
})();
