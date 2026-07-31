/* QA: the painted double door that asks whether you want the tour.
   Desktop only. Captures closed, mid-swing and open, so P-A can judge the
   motion from stills, and asserts it opens on both hinges. */
const { chromium } = require('playwright-core');
const path = require('path');
const OUT = path.join(__dirname, 'mshots');
require('fs').mkdirSync(OUT, { recursive: true });

let fails = 0;
const ok = (l, c, d) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + l + (d ? '  ' + d : '')); };

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 140)); });

  await p.goto('http://127.0.0.1:8123/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3000);

  // ONE small scroll summons it now (P-A: it used to take far too many)
  await p.mouse.move(720, 500);
  await p.mouse.wheel(0, 160);
  await p.waitForTimeout(900);

  const closed = await p.evaluate(() => {
    const inv = document.getElementById('lv3invite');
    const d = inv.querySelector('.lv3-door2');
    const lf = d && d.querySelector('.lf'), rt = d && d.querySelector('.rt');
    const frame = d && d.querySelector('.lv3-door2__frame');
    const cs = lf && getComputedStyle(lf);
    return {
      on: inv.classList.contains('on'),
      hasDoor: !!d,
      art: cs && cs.backgroundImage,
      frameArt: getComputedStyle(d.querySelector('.lv3-door2__frame')).backgroundImage,
      leafW: lf ? Math.round(lf.getBoundingClientRect().width) : 0,
      doorW: d ? Math.round(d.querySelector('.lv3-door2__leaves').getBoundingClientRect().width) : 0,
      seam: lf && rt ? Math.round(rt.getBoundingClientRect().left - lf.getBoundingClientRect().right) : null,
      cardBg: getComputedStyle(inv).backgroundColor,
      inView: d ? (() => { const r = d.getBoundingClientRect(); return r.top >= 0 && r.bottom <= 900; })() : false
    };
  });
  ok('one small scroll summons the door', closed.on);
  ok('it is a double door, not a paper bubble', closed.hasDoor);
  ok('the leaf art is loaded', /gate-leaf-l\.webp/.test(closed.art || ''), (closed.art||'').slice(0,70));
  ok('the arch stays its own layer', /gate-frame\.webp/.test(closed.frameArt || ''), (closed.frameArt||'').slice(0,70));
  ok('two leaves fill the opening', Math.abs(closed.leafW * 2 - closed.doorW) <= 2, closed.leafW + 'x2 vs ' + closed.doorW);
  ok('the leaves meet with no gap at the seam', closed.seam === 0, 'gap=' + closed.seam);
  ok('the card behind the door is gone', /rgba\(0, 0, 0, 0\)|transparent/.test(closed.cardBg), closed.cardBg);
  ok('the whole door is on screen', closed.inView);
  await p.screenshot({ path: path.join(OUT, 'door-1-closed.png') });

  // scrolling must NOT walk through it: the door has to be clicked
  await p.mouse.wheel(0, 400); await p.waitForTimeout(700);
  const stillShut = await p.evaluate(() => ({
    on: document.getElementById('lv3invite').classList.contains('on'),
    opening: document.getElementById('lv3invite').classList.contains('is-opening'),
    y: Math.round(scrollY)
  }));
  ok('scrolling does not open it', stillShut.on && !stillShut.opening, 'y=' + stillShut.y);

  // open it and catch the swing
  await p.evaluate(() => document.getElementById('lv3invite').click());
  await p.waitForTimeout(230);
  await p.screenshot({ path: path.join(OUT, 'door-2-swinging.png') });
  const mid = await p.evaluate(() => {
    const d = document.querySelector('.lv3-door2');
    const t = s => getComputedStyle(d.querySelector(s)).transform;
    const fr = getComputedStyle(d.querySelector('.lv3-door2__frame')).transform;
    return { lf: t('.lf'), rt: t('.rt'), frame: fr };
  });
  ok('the left leaf is swinging', mid.lf !== 'none', mid.lf.slice(0, 40));
  ok('the right leaf is swinging', mid.rt !== 'none', mid.rt.slice(0, 40));
  ok('the leaves swing in opposite directions', mid.lf !== mid.rt, 'lf!=rt');
  ok('the stone arch does NOT move', mid.frame === 'none', mid.frame);

  await p.waitForTimeout(2600);
  await p.screenshot({ path: path.join(OUT, 'door-3-through.png') });
  const after = await p.evaluate(() => ({ y: Math.round(scrollY), invGone: !document.getElementById('lv3invite').classList.contains('on') }));
  ok('walking through the door starts the tour', after.y > 2000, 'scrollY=' + after.y);
  ok('the invitation is put away afterwards', after.invGone);

  console.log('\n' + (errs.length ? errs.join('\n') : 'no JS errors'));
  if (errs.length) fails += errs.length;
  console.log('\n' + (fails ? 'FAILURES: ' + fails : 'ALL GREEN'));
  await b.close();
  process.exit(fails ? 1 : 0);
})();
