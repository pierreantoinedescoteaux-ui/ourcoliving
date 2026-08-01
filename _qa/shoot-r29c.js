/* QA round 29c — the story vine.

   P-A asked for one thing above all: "it should definitely not go on top of
   images... ideally it doesn't pass underneath text. It could pass
   underneath images or bubble popups and whitespace." So the test samples
   the real rendered path and checks it against the real rendered words. If
   the thread touches a letter anywhere, this fails.

   It also has to actually CROSS — a thread that hides in the left margin
   the whole way is the thing he already had. */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'mshots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8123';
const URL = BASE + '/project.html?p=montreal';

let fails = 0;
const ok = (l, c, d) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + l + (d ? '  ' + d : '')); };

async function check(page, tag, expectCross) {
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(1100);
  /* draw the whole thread: the reveal is scroll-driven and we want the
     geometry, not the animation */
  await page.evaluate(() => {
    const p = document.querySelector('.railpath');
    if (p) p.style.strokeDashoffset = '0';
  });
  await page.waitForTimeout(200);

  const r = await page.evaluate(() => {
    const rail = document.getElementById('pRail');
    const p = rail && rail.querySelector('.railpath');
    const story = document.getElementById('pStory');
    if (!p) return { none: true };
    const sRect = story.getBoundingClientRect();
    const len = p.getTotalLength();
    const stroke = parseFloat(getComputedStyle(p).strokeWidth) || 8;

    /* the words, in the same coordinate space as the path */
    const SEL = 'p,h1,h2,h3,h4,li,blockquote,figcaption,.eyebrow,.lede,.lede-serif,.hero-cap,a';
    const words = [];
    story.querySelectorAll(SEL).forEach(el => {
      if (el.classList.contains('railnode')) return;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      if (!el.textContent.trim()) return;
      /* the glyph run, not the block box — a full-width <p> whose text is
         one short line should not fence off the whole row */
      const rg = document.createRange();
      rg.selectNodeContents(el);
      [...rg.getClientRects()].forEach(b => {
        if (b.width < 6 || b.height < 5) return;
        words.push({ t: b.top - sRect.top, b: b.bottom - sRect.top,
          l: b.left - sRect.left, r: b.right - sRect.left,
          txt: (el.textContent || '').trim().slice(0, 30) });
      });
    });

    const hits = [];
    let minX = Infinity, maxX = -Infinity;
    const N = Math.min(3000, Math.max(400, Math.round(len / 6)));
    for (let i = 0; i <= N; i++) {
      const pt = p.getPointAtLength(len * i / N);
      minX = Math.min(minX, pt.x); maxX = Math.max(maxX, pt.x);
      const half = stroke / 2;
      for (const w of words) {
        if (pt.y + half < w.t || pt.y - half > w.b) continue;
        if (pt.x + half < w.l || pt.x - half > w.r) continue;
        hits.push({ x: Math.round(pt.x), y: Math.round(pt.y), txt: w.txt });
        break;
      }
    }
    return { hits: hits.slice(0, 5), nHits: hits.length, samples: N + 1,
      minX: Math.round(minX), maxX: Math.round(maxX),
      spread: Math.round(maxX - minX), storyW: Math.round(sRect.width),
      words: words.length };
  });

  if (r.none) { ok(`${tag}: the vine is drawn`, false); return; }
  ok(`${tag}: the thread never crosses a word`, r.nHits === 0,
    r.nHits ? `${r.nHits}/${r.samples} samples on text, e.g. ${JSON.stringify(r.hits[0])}` :
              `${r.samples} samples against ${r.words} runs of text`);
  /* P-A wants the crossing on the phone too ("that same kind of across the
     page could be the case as well on mobile"). Because the route can only
     ever stand in free space, crossing costs the text nothing — the
     no-word check above is what guarantees it is not taking up room. */
  ok(`${tag}: it crosses the page instead of hiding in the margin`,
    r.spread > r.storyW * 0.33, `travels ${r.spread}px of ${r.storyW}px`);
  return r;
}

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });

  console.log('\n-- desktop 1440x900 --');
  let ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  let page = await ctx.newPage();
  let errs = []; page.on('pageerror', e => errs.push(e.message));
  await check(page, 'desktop', true);
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight * 0.42));
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, 'r29c-vine-desktop.png') });
  ok('desktop: no page errors', errs.length === 0, errs.join(' | '));
  await ctx.close();

  for (const vp of [{ w: 390, h: 844 }, { w: 360, h: 640 }]) {
    console.log(`\n-- phone ${vp.w}x${vp.h} --`);
    ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: true, hasTouch: true,
      deviceScaleFactor: 2, userAgent: 'Mozilla/5.0 (Linux; Android 13) Mobile Safari/537.36' });
    page = await ctx.newPage();
    errs = []; page.on('pageerror', e => errs.push(e.message));
    await check(page, `${vp.w}px`, false);
    if (vp.w === 390) {
      await page.evaluate(() => scrollTo(0, document.body.scrollHeight * 0.42));
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(OUT, 'r29c-vine-phone.png') });
    }
    ok(`${vp.w}px: no page errors`, errs.length === 0, errs.join(' | '));
    await ctx.close();
  }

  await b.close();
  console.log(fails ? `\n${fails} FAILED` : '\nall green');
  process.exit(fails ? 1 : 0);
})();
