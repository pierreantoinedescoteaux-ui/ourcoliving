/* Find the scene layout P-A remembers: "the text was small enough that it was
   smooth and the sub pages were just like a small circular rectangle element
   underneath... all of it taking maybe a third of the page vertically."
   Shoots the same scene on the previous index.html and on the retired
   tower.html, on a phone, so the two can be compared side by side. */
const { chromium } = require('playwright-core');
const path = require('path');
const OUT = path.join(__dirname, 'mshots');

const TARGETS = [
  { file: '_oldref.html', tag: 'prev' },
  { file: 'tower.html', tag: 'tower' }
];

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const t of TARGETS) {
    const ctx = await b.newContext({
      viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
      isMobile: true, hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    });
    const p = await ctx.newPage();
    await p.goto('http://127.0.0.1:8123/' + t.file, { waitUntil: 'networkidle' });
    await p.waitForTimeout(3000);

    for (const id of ['library', 'gardens', 'lookout']) {
      const measured = await p.evaluate(async (sid) => {
        if (typeof WORLD === 'undefined') return null;
        const i = WORLD.indexOf(sid);
        if (i < 0) return null;
        window.scrollTo(0, WORLD.dwellCenter(i));
        await new Promise(r => setTimeout(r, 900));
        const copy = [...document.querySelectorAll('#world .sw-copy')]
          .filter(c => parseFloat(getComputedStyle(c).opacity || 0) > 0.5).pop();
        if (!copy) return null;
        const r = copy.getBoundingClientRect();
        const tags = [...copy.querySelectorAll('.sw-copy__tags li a')];
        const tr = tags.map(a => { const q = a.getBoundingClientRect(); return { w: Math.round(q.width), h: Math.round(q.height), fs: +parseFloat(getComputedStyle(a).fontSize).toFixed(1) }; });
        const title = copy.querySelector('.sw-copy__title');
        const body = copy.querySelector('.sw-copy__body');
        return {
          blockHeight: Math.round(r.height),
          shareOfScreen: +(r.height / innerHeight).toFixed(2),
          titlePx: title ? +parseFloat(getComputedStyle(title).fontSize).toFixed(1) : 0,
          bodyPx: body ? +parseFloat(getComputedStyle(body).fontSize).toFixed(1) : 0,
          tags: tr,
          tagsStacked: tr.length > 1 && tr[0].w > 300
        };
      }, id);
      if (measured) {
        console.log(t.tag.padEnd(6), id.padEnd(9),
          'copy block ' + measured.blockHeight + 'px (' + Math.round(measured.shareOfScreen * 100) + '% of the screen)',
          '| title ' + measured.titlePx + 'px body ' + measured.bodyPx + 'px',
          '| pills ' + measured.tags.map(x => x.w + 'x' + x.h + '@' + x.fs).join(' '),
          measured.tagsStacked ? '| STACKED FULL-WIDTH' : '| inline');
        await p.screenshot({ path: path.join(OUT, 'ref-' + t.tag + '-' + id + '.png') });
      } else {
        console.log(t.tag.padEnd(6), id.padEnd(9), 'no copy block found');
      }
    }
    await ctx.close();
  }
  await b.close();
})();
