/* Quiz QA: walks the five steps answering like a real person, seals,
   breaks the seal, checks the letter, opens a shared link cold, checks
   the map pin. Errors, sideways scroll, small text. Run: node _qa/shoot-quiz.js */
const { chromium } = require('./node_modules/playwright-core');
const path = require('path');
const B = 'file:///' + path.resolve(__dirname, '..').split(String.fromCharCode(92)).join('/') + '/';
const OUT = __dirname + '/quiz-';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  let fails = 0; const bad = m => { fails++; console.log('  FAIL', m); };
  for (const [tag, w, h] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
    console.log(tag);
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: tag === 'phone' ? 2 : 1 });
    const page = await ctx.newPage(); const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !/favicon|net::ERR|ERR_FILE/.test(m.text())) errs.push(m.text()); });
    await page.goto(B + 'quiz.html', { waitUntil: 'load' }); await page.waitForTimeout(800);
    await page.screenshot({ path: OUT + tag + '-0-intro.png' });
    await page.click('#startBtn'); await page.waitForTimeout(300);
    for (let s = 0; s < 5; s++) {
      // answer: chips/stickers pick the 2nd option, sliders get a value, hearts on the first slider
      await page.evaluate((s) => {
        const card = document.getElementById('card');
        const groups = {};
        card.querySelectorAll('.chip,.stk').forEach(b => { (groups[b.dataset.q] = groups[b.dataset.q] || []).push(b); });
        Object.values(groups).forEach((g, i) => g[(i + s) % g.length].click());
        card.querySelectorAll('.slider input').forEach((inp, i) => { inp.value = String((i * 2 + s) % 7); inp.dispatchEvent(new Event('input', { bubbles: true })); });
        const hb = card.querySelector('.heart'); if (hb) hb.click();
        const t = card.querySelector('.textin'); if (t) { t.value = 'Marie'; t.dispatchEvent(new Event('input', { bubbles: true })); }
      }, s);
      if (s === 1 || s === 3) { await page.waitForTimeout(400); } if (s === 1 || s === 3) await page.screenshot({ path: OUT + tag + '-step' + (s + 1) + '.png', fullPage: true });
      const side = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (side > 1) bad(`step ${s + 1} sideways scroll ${side}px`);
      await page.click('#nextBtn'); await page.waitForTimeout(250);
    }
    if (!(await page.isVisible('#mailView'))) bad('envelope not shown');
    await page.screenshot({ path: OUT + tag + '-envelope.png' });
    const hash = await page.evaluate(() => location.hash);
    if (!/^#q=1\./.test(hash)) bad('no share hash: ' + hash);
    await page.click('#seal', { force: true }); await page.waitForTimeout(800);
    await page.screenshot({ path: OUT + tag + '-opening.png' });
    await page.waitForTimeout(1400);
    const L = await page.evaluate(() => ({
      visible: !document.getElementById('letterView').hidden,
      sections: document.querySelectorAll('#letter section').length,
      name: (document.querySelector('.way .name') || {}).textContent,
      rows: document.querySelectorAll('.srow').length,
      places: document.querySelectorAll('.place').length,
      know: document.querySelectorAll('.know li').length,
      greet: (document.querySelector('#letter .hand') || {}).textContent,
      side: document.documentElement.scrollWidth - innerWidth,
      brokenImgs: [...document.querySelectorAll('#letter img')].filter(i => i.complete && !i.naturalWidth).map(i => i.getAttribute('src')),
      tiny: [...document.querySelectorAll('#letter *')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 12).map(e => e.className || e.tagName).slice(0, 5)
    }));
    console.log('  letter:', JSON.stringify(L));
    if (!L.visible) bad('letter hidden'); if (L.rows !== 5) bad('setup rows ' + L.rows);
    if (L.places < 1) bad('no places'); if (L.side > 1) bad('letter sideways ' + L.side);
    if (L.brokenImgs.length) bad('broken images ' + L.brokenImgs.join(','));
    if (L.tiny.length) bad('text under 12px: ' + L.tiny.join(','));
    if (!/Marie/.test(L.greet || '')) bad('greeting missing name');
    await page.screenshot({ path: OUT + tag + '-letter.png', fullPage: true });
    // shared link opened cold in a fresh page
    const p2 = await ctx.newPage(); p2.on('pageerror', e => errs.push('shared: ' + e.message));
    await p2.goto(B + 'quiz.html' + hash, { waitUntil: 'load' }); await p2.waitForTimeout(500);
    if (!(await p2.isVisible('#seal'))) bad('shared link does not open on the envelope');
    await p2.click('#seal', { force: true }); await p2.waitForTimeout(2000);
    const n2 = await p2.evaluate(() => (document.querySelector('.way .name') || {}).textContent);
    if (n2 !== L.name) bad(`shared link letter differs: ${n2} vs ${L.name}`);
    if (errs.length) bad('JS errors: ' + errs.join(' | '));
    await ctx.close();
  }
  await browser.close();
  console.log(fails ? `\n${fails} problem(s)` : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})();
