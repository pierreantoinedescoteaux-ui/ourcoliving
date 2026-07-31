/* QA for P-A's round-3 phone notes: the cream slab left behind when the words
   fade, the direction of scroll inside the tower, the doubled signature, and
   the eyebrow that repeated the pills. */
const { chromium } = require('playwright-core');
const path = require('path');
const OUT = path.join(__dirname, 'mshots');

let fails = 0;
const ok = (l, c, d) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + l + (d ? '  ' + d : '')); };

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => { if (!/play() request was interrupted/.test(e.message)) errs.push('PAGEERROR ' + e.message); });
  p.on('console', m => { if (m.type() === 'error' && !/favicon|play() request was interrupted/.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 140)); });
  await p.goto('http://127.0.0.1:8123/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3000);

  // ---- the eyebrow no longer repeats the pills ----
  console.log('\n[eyebrow]');
  const eb = await p.evaluate(async () => {
    window.scrollTo(0, WORLD.dwellCenter(WORLD.indexOf('lookout')));
    await new Promise(r => setTimeout(r, 700));
    return [...document.querySelectorAll('#world .sw-copy__eyebrow')].map(e => e.textContent.trim());
  });
  ok('no eyebrow still carries the descriptor after the dot',
    eb.every(t => t.indexOf('·') < 0), eb.slice(0, 3).join(' | '));
  ok('the coloured zone name survives as the legend', eb.some(t => /summit/i.test(t)), eb.find(t => /summit/i.test(t)));

  // ---- the cream must leave with the words ----
  console.log('\n[the cream slab]');
  const slab = await p.evaluate(async () => {
    const i = WORLD.indexOf('lookout');
    window.scrollTo(0, WORLD.dwellCenter(i));
    await new Promise(r => setTimeout(r, 800));
    const withCopy = [...document.querySelectorAll('#world .sw-copy')]
      .filter(c => +getComputedStyle(c).opacity > 0.5).length;
    const layerScrim = getComputedStyle(document.querySelector('.sw-copylayer'), '::before').display;
    // now scroll to a point BETWEEN dwells, where no copy is lit
    const a = WORLD.dwellCenter(i), bq = WORLD.dwellCenter(i - 1);
    window.scrollTo(0, Math.round((a + bq) / 2));
    await new Promise(r => setTimeout(r, 800));
    const between = [...document.querySelectorAll('#world .sw-copy')]
      .map(c => +getComputedStyle(c).opacity);
    const scrimOpacities = [...document.querySelectorAll('#world .sw-copy')]
      .map(c => +getComputedStyle(c).opacity);   // the scrim is a child, inherits this
    return { withCopy, layerScrim, maxBetween: Math.max(...between), scrimOpacities: Math.max(...scrimOpacities) };
  });
  ok('the layer-wide scrim is off during the climb', slab.layerScrim === 'none', slab.layerScrim);
  ok('a scene shows its words at its dwell', slab.withCopy === 1, slab.withCopy + ' lit');
  ok('between dwells nothing is lit, so no cream is left behind',
    slab.maxBetween < 0.5, 'max copy opacity=' + slab.maxBetween.toFixed(2));
  await p.screenshot({ path: path.join(OUT, 's-between.png') });

  // ---- scrolling DOWN at the summit descends ----
  console.log('\n[direction at the summit]');
  await p.evaluate(async () => {
    window.scrollTo(0, WORLD.dwellCenter(WORLD.indexOf('lookout')));
    await new Promise(r => setTimeout(r, 700));
  });
  const before = await p.evaluate(() => Math.round(scrollY));
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 620 }] });
  for (let i = 1; i <= 12; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: 620 - i * 24 }] });
    await p.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
  await p.waitForTimeout(500);
  const after = await p.evaluate(() => Math.round(scrollY));
  ok('a downward thumb at the summit DESCENDS the tower', after < before - 40,
    before + ' -> ' + after + ' (must go down)');
  await p.screenshot({ path: path.join(OUT, 's-summit-after.png') });

  // ---- one signature, not two ----
  console.log('\n[the signature]');
  const sig = await p.evaluate(async () => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise(r => setTimeout(r, 900));
    const f = document.querySelector('.sminifoot');
    if (!f) return { none: true };
    const note = f.querySelector('.mnote'), by = f.querySelector('.mby');
    return {
      noteShown: note ? getComputedStyle(note).display !== 'none' : false,
      byText: by ? by.textContent.replace(/\s+/g, ' ').trim() : '',
      byWidth: by ? Math.round(by.getBoundingClientRect().width) : 0,
      byFont: by ? +parseFloat(getComputedStyle(by).fontSize).toFixed(1) : 0
    };
  });
  ok('only one credit line is shown', !sig.noteShown);
  ok('it names the project, the author, the love and the year',
    /resource and portfolio/.test(sig.byText) && /made with love/.test(sig.byText) && /©/.test(sig.byText),
    sig.byText);
  ok('it uses the full width', sig.byWidth >= 340, sig.byWidth + 'px');
  ok('it is readable', sig.byFont >= 12, sig.byFont + 'px');
  await p.screenshot({ path: path.join(OUT, 's-footer.png') });

  console.log('\n' + (errs.length ? errs.join('\n') : 'no JS errors'));
  if (errs.length) fails += errs.length;
  console.log('\n' + (fails ? 'FAILURES: ' + fails : 'ALL GREEN'));
  await b.close();
  process.exit(fails ? 1 : 0);
})();
