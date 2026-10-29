/* Quiz QA (v3): walks the six steps answering like a real person, checks
   the ranked hopes, the slider bubble (one label per spot), tick boxes vs
   round dots, "Not sure", the "?" notes popping up where you tap, the
   ranked holding, seals,
   breaks the seal, checks the letter (P-A's "someone else runs it" case
   must not get design-your-own or run-it-together text), the email link,
   a shared link opened cold, and "welcome back" on return.
   Errors, sideways scroll, small text. Run: node _qa/shoot-quiz.js */
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
    await page.evaluate(() => { try { localStorage.clear(); sessionStorage.clear(); } catch (e) {} });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(500);
    await page.screenshot({ path: OUT + tag + '-0-intro.png' });
    await page.click('#startBtn'); await page.waitForTimeout(300);
    const side = async (where) => { const s = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (s > 1) bad(`${where} sideways scroll ${s}px`); };
    const next = async () => { await page.click('#nextBtn'); await page.waitForTimeout(250); };

    // 1. you, today: city + countryside (pick any)
    await page.click('[data-q="base"][data-i="0"]'); await page.click('[data-q="with"][data-i="0"]');
    await page.click('[data-q="setting"][data-i="0"]'); await page.click('[data-q="setting"][data-i="2"]');
    const setPressed = await page.$$eval('[data-q="setting"][aria-pressed="true"]', e => e.length);
    if (setPressed !== 2) bad('setting is not pick-any: ' + setPressed);
    const marks = await page.evaluate(() => ({
      multi: getComputedStyle(document.querySelector('.stickers.multi .stk'), '::before').borderRadius,
      single: getComputedStyle(document.querySelector('.chips.single .chip'), '::before').borderRadius,
      anywhere: !!document.querySelector('[data-open="setting"]') && document.querySelector('[data-open="setting"]').innerText.trim() }));
    if (marks.multi !== '5px' || !/50%/.test(marks.single)) bad('tick box / round dot look wrong: ' + JSON.stringify(marks));
    if (marks.anywhere !== 'Anywhere good') bad('no "Anywhere good" on setting: ' + marks.anywhere);
    await page.screenshot({ path: OUT + tag + '-step1-marks.png' });
    await side('step 1'); await next();

    // 2. hopes: four taps → 1, 2, 3, also
    for (const i of [0, 2, 1, 6]) await page.click(`.rk[data-i="${i}"]`);
    const badges = await page.$$eval('.rk', bs => bs.map(b => b.querySelector('.badge').textContent));
    if (badges[0] !== '1' || badges[2] !== '2' || badges[1] !== '3' || badges[6] !== 'also') bad('rank badges wrong: ' + badges.join(','));
    await page.click('.rk[data-i="2"]');   // untap #2 → the rest renumber
    const re = await page.$$eval('.rk', bs => bs.map(b => b.querySelector('.badge').textContent));
    if (re[0] !== '1' || re[1] !== '2' || re[6] !== '3') bad('ranks do not renumber: ' + re.join(','));
    await page.click('.rk[data-i="2"]');
    await page.screenshot({ path: OUT + tag + '-step2-hopes.png', fullPage: true });
    await side('step 2'); await next();

    // 3. values: the bubble changes as the thumb moves; P-A's case: "someone else runs it"
    const bub = async (id, v) => page.evaluate(([id, v]) => { const i = document.querySelector(`input[data-q="${id}"]`); i.value = String(v); i.dispatchEvent(new Event('input', { bubbles: true })); const b = i.parentNode.querySelector('.bubble'); return b ? b.textContent : null; }, [id, v]);
    const t0 = await bub('time', 0), t3 = await bub('time', 3), t6 = await bub('time', 6);
    if (!(t0 && t3 && t6 && t0 !== t3 && t3 !== t6)) bad(`bubble does not change: ${t0} / ${t3} / ${t6}`);
    else console.log('  bubble:', t0, '→', t3, '→', t6);
    await bub('time', 2); await bub('share', 3); await bub('size', 2); await bub('power', 0); await bub('autonomy', 2); await bub('effort', 0);
    const bubBox = await page.evaluate(() => { const b = document.querySelector('input[data-q="effort"]').parentNode.querySelector('.bubble').getBoundingClientRect(); return [b.left, b.right, innerWidth]; });
    if (bubBox[0] < 0 || bubBox[1] > bubBox[2]) bad('bubble off screen ' + bubBox);
    for (const [id, v] of [['share', 2], ['share', 3], ['power', 1]]) {
      await bub(id, v);
      const cut = await page.evaluate((id) => { const i = document.querySelector(`input[data-q="${id}"]`), b = i.parentNode.querySelector('.bubble'); const br = b.getBoundingClientRect(), ir = i.getBoundingClientRect(); return { cut: b.scrollWidth > b.clientWidth + 1, over: br.bottom > ir.top + 8, txt: b.textContent }; }, id);
      if (cut.cut || cut.over) bad(`bubble cut off or over the track: ${JSON.stringify(cut)}`);
    }
    await bub('share', 3); await bub('power', 0);
    await page.click('[data-q="care"][data-i="7"]'); await page.click('[data-q="care"][data-i="11"]');
    const notesOn = await page.$$eval('.qm.inl', bs => bs.map(b => b.dataset.note).join(','));
    if (notesOn !== 'share,power,autonomy') bad('slider "?" should be on share, power, autonomy only: ' + notesOn);
    const shareQ = page.locator('.qm.inl[data-note="share"]');
    await shareQ.scrollIntoViewIfNeeded(); await shareQ.click(); await page.waitForTimeout(400);
    const pop = await page.evaluate(() => { const t = document.querySelector('.tnote'), b = document.querySelector('.qm.inl[data-note="share"]').getBoundingClientRect(); if (!t) return null; const r = t.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, bTop: b.top, bBottom: b.bottom, w: innerWidth, h: innerHeight, txt: t.innerText, href: t.querySelector('a').getAttribute('href') }; });
    if (!pop) bad('no pop-up note on the share slider');
    else {
      if (pop.left < 0 || pop.right > pop.w) bad(`pop-up off screen ${pop.left}-${pop.right}`);
      const gap = pop.top >= pop.bBottom ? pop.top - pop.bBottom : pop.bTop - pop.bottom;
      if (gap < 0 || gap > 20) bad('pop-up not next to the "?": gap ' + gap);
      if (!/^map\.html\?x=share/.test(pop.href)) bad('share note link ' + pop.href);
      console.log('  slider note:', pop.txt.split('\n')[0], '| gap', Math.round(gap), 'px');
      await page.screenshot({ path: OUT + tag + '-step3-popup.png' });
    }
    await page.keyboard.press('Escape'); await page.waitForTimeout(150);
    if (await page.$('.tnote')) bad('Esc does not close the note');
    await page.click('.qm.inl[data-note="power"]'); await page.waitForTimeout(200);
    await page.mouse.click(5, 5); await page.waitForTimeout(150);
    if (await page.$('.tnote')) bad('tapping elsewhere does not close the note');
    await bub('purpose', 5);
    await page.click('[data-open="purpose"]'); await page.waitForTimeout(150);
    const ps = await page.evaluate(() => { const w = document.querySelector('input[data-q="purpose"]').parentNode; return { unset: w.classList.contains('unset'), pressed: document.querySelector('[data-open="purpose"]').getAttribute('aria-pressed') }; });
    if (!ps.unset || ps.pressed !== 'true') bad('"Not sure" on a slider does not set it aside: ' + JSON.stringify(ps));
    await page.evaluate(() => document.querySelector('input[data-q="time"]').scrollIntoView({ block: 'center' }));
    await page.screenshot({ path: OUT + tag + '-step3-bubble.png' });
    await side('step 3'); await next();

    // 4. the gate: a pause on a sun block says which way you lean ("a bit of both" at share 3),
    //    "not quite" goes back to the share slider; share 5 → "a shared home"; back to 3; shared answers must not survive
    const gate = async () => page.evaluate(() => ({ title: document.getElementById('stepTitle').textContent,
      pause: document.getElementById('card').classList.contains('pause'),
      bg: getComputedStyle(document.getElementById('card')).backgroundColor,
      img: (() => { const i = document.querySelector('.gimg'); return !!(i && i.complete && i.naturalWidth > 0); })(),
      qs: [...document.querySelectorAll('.q')].map(q => q.dataset.qid).join(',') }));
    await page.waitForTimeout(900);
    let G = await gate();
    const alts = await page.$$eval('.alt', bs => bs.map(b => b.dataset.gate).join(','));
    if (!G.pause || G.title !== 'a bit of both' || !G.img || G.bg !== 'rgb(247, 201, 72)' || G.qs || alts !== 'own,shared') bad('pause before the gate wrong: ' + JSON.stringify(G) + ' alts ' + alts);
    await page.screenshot({ path: OUT + tag + '-step4-pause.png', fullPage: true });
    await page.click('.alt[data-gate="shared"]'); await page.waitForTimeout(300);
    G = await gate();
    if (G.pause || G.title !== 'A shared home' || G.qs !== 'pool,give,space,recharge,conflict') bad('picking "a shared home" did not switch: ' + JSON.stringify(G));
    await page.click('[data-q="pool"][data-i="3"]');
    await page.screenshot({ path: OUT + tag + '-step4-gate-shared.png', fullPage: true });
    await page.click('[data-switch="between"]'); await page.waitForTimeout(300);
    G = await gate();
    if (G.title !== 'A bit of both' || G.qs !== 'community,keep,space,recharge') bad('switching back to "a bit of both" failed: ' + JSON.stringify(G));
    await page.click('[data-q="community"][data-i="0"]'); await page.click('[data-q="community"][data-i="3"]'); await page.click('[data-q="keep"][data-i="2"]');
    await bub('space', 2); await bub('recharge', 1);
    const gap = await page.evaluate(() => [...document.querySelectorAll('.slider.stops')].map(w => parseFloat(w.style.paddingTop) || 46).filter(v => v > 96));
    if (gap.length) bad('slider label left a gap: ' + gap.join(','));
    const dot = await page.evaluate(() => getComputedStyle(document.querySelector('.stickers.multi .stk.open'), '::before').borderRadius);
    if (!/50%/.test(dot)) bad('"Open to many things" should have a round dot: ' + dot);
    await page.screenshot({ path: OUT + tag + '-step4-gate-full.png', fullPage: true });
    await side('step 4'); await next();

    // 5. set-up: "?" notes on the options P-A named
    for (const name of ['A share in the whole', 'A membership with my room included']) {
      const btn = page.locator(`.rkw:has(.rk span:text-is("${name}")) .qm`);
      await btn.scrollIntoViewIfNeeded(); await btn.click(); await page.waitForTimeout(450);
      const n = await page.evaluate((nm) => { const t = document.querySelector('.tnote'); if (!t) return null; const r = t.getBoundingClientRect(); const b = [...document.querySelectorAll('.rkw')].find(w => w.querySelector('.rk span').textContent === nm).querySelector('.qm').getBoundingClientRect(); return { txt: t.innerText, left: r.left, right: r.right, top: r.top, bottom: r.bottom, bTop: b.top, bBottom: b.bottom, w: innerWidth, href: t.querySelector('a').getAttribute('href') }; }, name);
      if (!n) { bad('no note for ' + name); continue; }
      if (!/Member shares|Membership/.test(n.txt)) bad('note text wrong for ' + name + ': ' + n.txt.slice(0, 60));
      if (n.right > n.w || n.left < 0) bad(`note off screen for ${name}: ${n.left}-${n.right}`);
      const gap = n.top >= n.bBottom ? n.top - n.bBottom : n.bTop - n.bottom;
      if (gap < 0 || gap > 20) bad(`note not next to its "?" for ${name}: gap ${gap}`);
      if (!/^themes\.html#o-holding-/.test(n.href)) bad('note link ' + n.href);
      console.log('  note:', name, '→', n.txt.split('\n')[0], '| gap', Math.round(gap), 'px', n.href);
      if (name.startsWith('A share')) await page.screenshot({ path: OUT + tag + '-step5-note.png' });
      await page.keyboard.press('Escape');
    }
    await page.click('[data-q="decisions"][data-i="0"]');
    await page.click('[data-q="holding"][data-i="2"]'); await page.click('[data-q="holding"][data-i="3"]');
    const hb = await page.$$eval('.rk[data-q="holding"]', bs => bs.map(b => b.querySelector('.badge').textContent).join(','));
    if (hb !== ',,1,2,') bad('holding is not ranked: ' + hb);
    await page.evaluate(() => document.querySelector('.rk[data-q="holding"]').scrollIntoView({ block: 'center' }));
    await page.screenshot({ path: OUT + tag + '-step5-holding.png' });
    await page.click('[data-q="savings"][data-i="0"]');
    await side('step 5'); await next();

    // 6. join or start
    await page.click('[data-q="role"][data-i="0"]');
    await page.fill('.textin', 'Marie'); await page.dispatchEvent('.textin', 'input');
    await next();

    if (!(await page.isVisible('#mailView'))) bad('envelope not shown');
    await page.screenshot({ path: OUT + tag + '-envelope.png' });
    const hash = await page.evaluate(() => location.hash);
    if (!/^#q=5./.test(hash)) bad('no v5 share hash: ' + hash);
    await page.click('#seal', { force: true }); await page.waitForTimeout(3200);
    const L = await page.evaluate(() => ({
      visible: !document.getElementById('letterView').hidden,
      fits: [...document.querySelectorAll('.fitc .nm')].map(e => e.textContent),
      rows: document.querySelectorAll('.srow').length,
      places: document.querySelectorAll('.place').length,
      whys: [...document.querySelectorAll('.place .why')].map(e => e.textContent),
      hopes: [...document.querySelectorAll('.hope:not(.gate)')].map(e => e.innerText.replace(/\s+/g, ' ')),
      stand: document.querySelectorAll('.strow').length,
      unsure: [...document.querySelectorAll('.strow .lb.open')].map(e => e.textContent),
      gatePill: (document.querySelector('.hope.gate') || {}).innerText,
      around: [...document.querySelectorAll('.mirror .kw span')].map(e => e.textContent),
      steps: [...document.querySelectorAll('.steps li')].map(e => e.innerText),
      kw: document.querySelectorAll('.kw.care span').length,
      greet: (document.querySelector('#letter .hand') || {}).textContent,
      text: document.getElementById('letter').innerText,
      sigFont: getComputedStyle(document.querySelector('.sign .who')).fontFamily,
      mail: (document.getElementById('mailBtn') || {}).href,
      side: document.documentElement.scrollWidth - innerWidth,
      brokenImgs: [...document.querySelectorAll('#letter img')].filter(i => i.complete && !i.naturalWidth).map(i => i.getAttribute('src')),
      tiny: [...document.querySelectorAll('#letter *')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 12).map(e => e.className || e.tagName).slice(0, 5)
    }));
    console.log('  letter: fits', L.fits.join(', '), '| blocks', L.rows, '| places', L.places, '| hopes', L.hopes.join(' · '), '| stand', L.stand, '| care', L.kw);
    console.log('  place reasons:', L.whys.join(' || '));
    if (!L.visible) bad('letter hidden'); if (L.fits.length !== 3) bad('fits ' + L.fits.length); if (L.rows !== 5) bad('blocks ' + L.rows);
    if (L.places < 1 || L.whys.length !== L.places) bad('places without reasons');
    if (L.hopes.length !== 4 || !/^1 /.test(L.hopes[0])) bad('hopes not reflected: ' + L.hopes.join(' | '));
    if (L.stand < 7 || L.kw !== 2) bad(`stand ${L.stand} / care ${L.kw}`);
    if (L.unsure.join() !== 'Not sure') bad('the "not sure" slider is not in the letter: ' + L.unsure.join());
    if (/take this again|collective-tax/i.test(L.steps.join(' '))) bad('old first steps still there');
    if (L.gatePill !== 'A bit of both') bad('gate missing from the letter: ' + L.gatePill);
    if (L.around.indexOf('Some of our income') >= 0) bad('an answer from the other gate reached the letter');
    if (L.around.indexOf('My own entrance') < 0) bad('gate answers missing from the letter: ' + L.around.join('|'));
    if (/design your home|design it|run it together|run it all together/i.test(L.text)) bad('P-A bug: letter claims a wish to design or run it');
    if (!/Saint Delafield/.test(L.sigFont)) bad('signature font ' + L.sigFont);
    if (!/^mailto:\?subject=/.test(L.mail || '') || !/q%3D5/.test(L.mail)) bad('email link ' + L.mail);
    if (L.side > 1) bad('letter sideways ' + L.side);
    if (L.brokenImgs.length) bad('broken images ' + L.brokenImgs.join(','));
    if (L.tiny.length) bad('text under 12px: ' + L.tiny.join(','));
    if (!/Marie/.test(L.greet || '')) bad('greeting missing name');
    await page.waitForTimeout(600);
    await page.screenshot({ path: OUT + tag + '-letter.png', fullPage: true });

    // shared link opened cold in a fresh page
    const p2 = await ctx.newPage(); p2.on('pageerror', e => errs.push('shared: ' + e.message));
    await p2.goto(B + 'quiz.html' + hash, { waitUntil: 'load' }); await p2.waitForTimeout(500);
    if (!(await p2.isVisible('#seal'))) bad('shared link does not open on the envelope');
    await p2.click('#seal', { force: true }); await p2.waitForTimeout(3200);
    const n2 = await p2.evaluate(() => [...document.querySelectorAll('.fitc .nm')].map(e => e.textContent).join(','));
    if (n2 !== L.fits.join(',')) bad(`shared link letter differs: ${n2} vs ${L.fits.join(',')}`);
    // coming back without the link → welcome back → open my letter
    await p2.goto(B + 'quiz.html', { waitUntil: 'load' }); await p2.waitForTimeout(400);
    if (!(await p2.isVisible('#welcome'))) bad('no "welcome back" on return');
    else { await p2.click('#reopenBtn'); await p2.waitForTimeout(500); const n3 = await p2.evaluate(() => document.querySelectorAll('.fitc').length); if (n3 !== 3) bad('reopen did not show the letter'); }
    if (errs.length) bad('JS errors: ' + errs.join(' | '));
    await ctx.close();
  }
  await browser.close();
  console.log(fails ? `\n${fails} problem(s)` : '\nALL GREEN');
  process.exit(fails ? 1 : 0);
})();
