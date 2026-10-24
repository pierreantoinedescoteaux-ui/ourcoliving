/* Glossary, checked the way a reader uses it: open the book, tap a letter,
   look for the word there. Land trust under L (P-A's example) plus five
   other words under the letter a newcomer would try. Then search, then the
   card on a "Land trust" label. Run: node _qa/shoot-gloss-path.js */
const { chromium } = require('./node_modules/playwright-core');
const BASE = (process.env.BASE || 'http://127.0.0.1:8123').replace(/\/$/, '');
const OUT = __dirname + '/mshots/gloss-path-';
const CHECKS = [['L', 'Land trust'], ['U', 'Use rights'], ['S', 'Solidarity co-op'], ['D', 'Divided co-ownership'], ['M', 'Member shares'], ['C', 'Consent decision-making']];
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const fails = [];
  for (const [tag, vp] of [['desk', { width: 1366, height: 900 }], ['phone', { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
    const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor || 1 });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + '/themes.html', { waitUntil: 'networkidle' });
    await p.waitForFunction(() => window.GLOSSARY_DATA, null, { timeout: 15000 }).catch(() => {});
    await p.click('.gl-btn', { force: true }); await p.waitForSelector('.gl-ov.ready', { timeout: 8000 });
    for (const [L, word] of CHECKS) {
      await p.click('.gl-az button[data-l="' + L + '"]'); await p.waitForTimeout(1800);
      const r = await p.evaluate(([L, word]) => {
        const head = document.querySelector('.gl-list [data-letter="' + L + '"]'); if (!head) return { ok: false, why: 'no letter ' + L };
        const names = []; let n = head.nextElementSibling;
        while (n && !n.classList.contains('gl-letter')) { const h = n.querySelector('h3'); if (h) names.push(h.textContent + (n.classList.contains('gl-see') ? ' (see ' + n.querySelector('.gl-go').textContent.replace(' →', '') + ')' : '')); n = n.nextElementSibling; }
        const row = names.find(x => x.toLowerCase().startsWith(word.toLowerCase()));
        /* and the reader can SEE it: the row is inside the visible part of the list */
        const el = [...document.querySelectorAll('.gl-list h3')].find(h => h.textContent.toLowerCase() === word.toLowerCase());
        const box = document.querySelector('.gl-list'), lb = box.scrollHeight > box.clientHeight ? box.getBoundingClientRect() : { top: 0, bottom: innerHeight };
        const hb = head.getBoundingClientRect(), landed = hb.top >= lb.top - 2 && hb.bottom <= lb.bottom + 2;
        /* then scroll down to the word, like a reader would, for the screenshot */
        if (el) el.scrollIntoView({ block: 'center' });
        return { ok: !!row && landed, row: row && (row + (landed ? ' [letter lands on screen]' : ' [letter NOT on screen]')), under: names.length };
      }, [L, word]);
      if (!r.ok) fails.push(tag + ' ' + word + ' not under ' + L);
      console.log(tag, L, word, '->', r.row || 'MISSING', '(' + r.under + ' words under ' + L + ')');
      await p.waitForTimeout(300);
      const shot = tag === 'desk' ? await p.$('.gl-book') : p;
      await shot.screenshot({ path: OUT + tag + '-' + L + '.png' });
    }
    /* the see row jumps to the entry */
    await p.click('.gl-az button[data-l="L"]'); await p.waitForTimeout(500);
    const go = p.locator('.gl-see:has(h3:text-is("Land trust")) .gl-go'); await go.click(); await p.waitForTimeout(600);
    const jumped = await p.evaluate(() => { const e = document.getElementById('gl-community-land-trust'); const r = e.getBoundingClientRect(), l = document.querySelector('.gl-list').getBoundingClientRect(); return e.classList.contains('hit') && r.top < Math.max(l.bottom, innerHeight) && r.bottom > 0; });
    console.log(tag, 'see-row jump to Community land trust:', jumped); if (!jumped) fails.push(tag + ' jump');
    await (tag === 'desk' ? await p.$('.gl-book') : p).screenshot({ path: OUT + tag + '-jump.png' });
    /* search says which name matched */
    const srch = async (q, want) => {
      await p.fill('.gl-search', q); await p.waitForTimeout(400);
      const got = await p.evaluate(() => [...document.querySelectorAll('.gl-entry')].map(e => e.querySelector('h3').textContent + ((e.querySelector('.gl-aka') || {}).textContent ? ' | ' + e.querySelector('.gl-aka').textContent : '')));
      console.log(tag, 'search "' + q + '":', got.join(' ; ')); if (!got.some(x => x.startsWith(want))) fails.push(tag + ' search ' + q);
    };
    await srch('usufruct', 'Use rights | Also called');
    await srch('land trust', 'Community land trust');
    await (tag === 'desk' ? await p.$('.gl-book') : p).screenshot({ path: OUT + tag + '-search.png' });
    await p.click('.gl-close'); await p.waitForTimeout(600);
    /* the card on a Land trust label */
    await p.click('#q-legal > .qbtn'); await p.waitForTimeout(500);
    const lab = p.locator('.gl-lab[data-gloss="community-land-trust"]').first();
    const nLab = await p.locator('.gl-lab').count();
    if (await lab.count()) {
      await lab.scrollIntoViewIfNeeded();
      if (tag === 'desk') await lab.hover(); else await lab.focus();
      await p.waitForTimeout(500);
      const card = await p.evaluate(() => { const c = document.querySelector('.gl-card.show'); return c ? c.querySelector('b').textContent : null; });
      console.log(tag, 'labels with a card:', nLab, '| Land trust label card:', card); if (card !== 'Community land trust') fails.push(tag + ' label card');
      await p.screenshot({ path: OUT + tag + '-label.png' });
    } else { console.log(tag, 'labels with a card:', nLab, '| no Land trust label on themes.html'); fails.push(tag + ' no land trust label'); }
    if (errs.length) fails.push(tag + ' js: ' + errs.join(' | '));
    await ctx.close();
  }
  await b.close();
  console.log(fails.length ? 'FAILS:\n ' + fails.join('\n ') : 'ALL GREEN');
})();
