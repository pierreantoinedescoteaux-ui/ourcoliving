/* QA round 29 — P-A's voice note, the manifesto half.

   The two things he actually said:
     "the what if is just on top of the bubbles which just definitely
      doesn't work and even on desktop it's still overlapping other text"
     "once all the bubbles are opened the what if should be scrolling with
      the bubbles at the same distance... it's part of the image now"
     "the background... I would have it be full width" (the painted field)

   So this asserts overlap directly rather than eyeballing a screenshot:
   the What if's box must never intersect the box of any text the visitor
   is reading, at any scroll position, on a phone or on a desktop. */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'mshots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

let fails = 0;
const ok = (l, c, d) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + l + (d ? '  ' + d : '')); };

/* the boxes the visitor is actually reading — bubble lines and card lines.
   The halo behind the What if is allowed to sit over them; the LETTERS are
   not, so the text box is measured, not the element's full width. */
async function overlapReport(page) {
  return page.evaluate(() => {
    const w = document.getElementById('whatif');
    if (!w) return { missing: true };
    const style = getComputedStyle(w);
    if (style.opacity === '0' || style.visibility === 'hidden') return { hidden: true };
    /* the glyphs, not the block: the element is full width but the words
       are centred inside it */
    const r = document.createRange();
    const txt = document.getElementById('whatifTxt');
    if (!txt || !txt.firstChild) return { hidden: true };
    r.selectNodeContents(txt);
    const wb = r.getBoundingClientRect();
    if (!wb.width) return { hidden: true };

    const hits = [];
    document.querySelectorAll('.bub .gray, .cardp .flip, .cardp .vil, .head h2, .head .lede').forEach(el => {
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return;
      if (b.bottom < 0 || b.top > innerHeight) return;
      const ox = Math.min(wb.right, b.right) - Math.max(wb.left, b.left);
      const oy = Math.min(wb.bottom, b.bottom) - Math.max(wb.top, b.top);
      if (ox > 2 && oy > 2) hits.push({ cls: el.className, ox: Math.round(ox), oy: Math.round(oy) });
    });
    return { hits, top: Math.round(wb.top) };
  });
}

async function walk(page, label, steps) {
  const worst = [];
  for (let i = 0; i < steps; i++) {
    await page.evaluate(() => scrollBy(0, innerHeight * 0.45));
    await page.waitForTimeout(160);
    const rep = await overlapReport(page);
    if (rep.hits && rep.hits.length) worst.push({ step: i, hits: rep.hits });
  }
  ok(`${label}: the What if never sits on text`, worst.length === 0,
    worst.length ? JSON.stringify(worst.slice(0, 3)) : '');
  return worst;
}

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });

  /* ---------- phone ---------- */
  for (const vp of [{ width: 390, height: 844 }, { width: 360, height: 640 }]) {
    const ctx = await b.newContext({ viewport: vp, isMobile: true, hasTouch: true,
      deviceScaleFactor: 2, userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36' });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.goto(BASE + '/manifesto.html', { waitUntil: 'load' });
    await page.waitForTimeout(700);

    console.log(`\n-- phone ${vp.width}x${vp.height} --`);
    await walk(page, `${vp.width}px`, 26);

    /* every thought opened -> the question is freed and rides along */
    await page.evaluate(() => document.querySelectorAll('.bub .gray').forEach(g => g.click()));
    await page.waitForTimeout(500);
    const freed = await page.evaluate(() => document.getElementById('field').classList.contains('freed'));
    ok(`${vp.width}px: freed once every thought is open`, freed);

    /* back to where the question is on screen — the walk above ends at the
       foot of the page, where nothing can scroll and the check is vacuous */
    const travels = await page.evaluate(async () => {
      const t = document.getElementById('whatifTxt');
      const doc = document.documentElement;
      scrollTo(0, Math.max(0, t.getBoundingClientRect().top + scrollY - innerHeight * 0.35));
      await new Promise(r => setTimeout(r, 260));
      const a = t.getBoundingClientRect().top;
      const room = doc.scrollHeight - innerHeight - scrollY;
      scrollBy(0, 300);
      await new Promise(r => setTimeout(r, 260));
      const c = t.getBoundingClientRect().top;
      return { a: Math.round(a), c: Math.round(c), moved: Math.round(a - c), room: Math.round(room) };
    });
    ok(`${vp.width}px: it scrolls WITH the thoughts, not pinned`,
      travels.room < 320 || travels.moved > 240,
      `moved ${travels.moved}px of a 300px scroll, ${travels.room}px of page left`);

    if (vp.width === 390) await page.screenshot({ path: path.join(OUT, 'r29-manifesto-phone.png'), fullPage: false });

    /* the village: the island must arrive with the words, not two screens
       after them. P-A's screenshot was a heading, a hole, and a speck. */
    const vil = await page.evaluate(async () => {
      const wrap = document.getElementById('scenewrap');
      scrollTo(0, wrap.getBoundingClientRect().top + scrollY + innerHeight * 0.1);
      await new Promise(r => setTimeout(r, 500));
      const h = document.querySelector('.cohead').getBoundingClientRect();
      const v = document.getElementById('vilwrap').getBoundingClientRect();
      return { gap: Math.round(v.top - h.bottom), islandTop: Math.round(v.top),
        islandH: Math.round(v.height), vh: innerHeight };
    });
    ok(`${vp.width}px: the island follows the heading, no void`, vil.gap < 90,
      `${vil.gap}px between the words and the island`);
    ok(`${vp.width}px: the island is on screen, not pushed low`,
      vil.islandTop + vil.islandH < vil.vh, `island ends at ${vil.islandTop + vil.islandH} of ${vil.vh}`);
    if (vp.width === 390) await page.screenshot({ path: path.join(OUT, 'r29-village-phone.png') });

    ok(`${vp.width}px: no page errors`, errs.length === 0, errs.join(' | '));
    await ctx.close();
  }

  /* ---------- desktop ---------- */
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(BASE + '/manifesto.html', { waitUntil: 'load' });
  await page.waitForTimeout(700);

  console.log('\n-- desktop 1440x900 --');
  await walk(page, 'desktop', 30);

  const bg = await page.evaluate(() => {
    const el = document.querySelector('.fieldbg');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), vw: innerWidth, left: Math.round(r.left) };
  });
  ok('desktop: the painted field runs the full width', bg && Math.abs(bg.w - bg.vw) <= 2,
    bg ? `field ${bg.w}px vs window ${bg.vw}px, left ${bg.left}` : 'no .fieldbg');

  await page.evaluate(() => scrollTo(0, document.body.scrollHeight * 0.34));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, 'r29-manifesto-desktop.png') });
  ok('desktop: no page errors', errs.length === 0, errs.join(' | '));
  await ctx.close();

  await b.close();
  console.log(fails ? `\n${fails} FAILED` : '\nall green');
  process.exit(fails ? 1 : 0);
})();
