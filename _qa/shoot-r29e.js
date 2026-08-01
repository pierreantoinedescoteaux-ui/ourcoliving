/* QA round 29e — the flight into the tower.

   The bug this suite exists for: the old zoom stopped at a HARDCODED share
   of the painting (0.313), measured on one screen. It is a function of the
   viewport's aspect, so on a shorter screen the still ended more zoomed in
   than the clip and the handover jumped. The old QA missed it because it
   only ever checked the still against its own target, never the still
   against the CLIP.

   So the assertion here is the one that matters: at every point of the
   flight, the still and the clip must be showing the same picture at the
   same size. Swept across five viewport shapes, because the shape is the
   bug. */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'mshots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

let fails = 0;
const ok = (l, c, d) => { if (!c) fails++; console.log((c ? '  ok   ' : '  FAIL ') + l + (d ? '  ' + d : '')); };

const VPS = [
  { w: 390, h: 844 }, { w: 390, h: 730 }, { w: 414, h: 896 },
  { w: 360, h: 640 }, { w: 1440, h: 900 }
];

/* where the waterfall is on screen, according to each layer independently */
const PROBE = `(() => {
  const stage = document.getElementById('stage');
  const island = document.getElementById('island');
  const loop = document.getElementById('loop');
  const vid = document.getElementById('loopvid');
  const FX = 0.021, FW = 0.96338, FY = 0.01471, AR = 1360/2048;
  const WF_X = 0.5091, WF_Y = 0.5611;
  const CPX = 159.4, CPW = 1600.5, CPY = 8.6, CPH = 1062.9, CROP = 656;

  // the still: the anchor's screen position, straight off the rendered box
  const ir = island.getBoundingClientRect();
  const wPaint = ir.width / FW, hPaint = wPaint * AR;
  const pL = ir.left - FX * wPaint, pT = ir.top - FY * hPaint;
  const stillX = pL + WF_X * wPaint, stillY = pT + WF_Y * hPaint;

  // the clip: same anchor, through the clip's own layout and transform
  const vw = vid.videoWidth || 608, vh = vid.videoHeight || 1080;
  const cropX = vw < 1000 ? CROP : 0;
  const lr = loop.getBoundingClientRect();
  const k = Math.max(lr.width / vw, lr.height / vh);
  const clipX = lr.left + (lr.width - vw*k)/2 + (CPX + WF_X*CPW - cropX)*k;
  const clipY = lr.top + (lr.height - vh*k)/2 + (CPY + WF_Y*CPH)*k;

  // and the same for the painting's WIDTH, so scale is compared too
  const stillW = wPaint;
  const clipW = CPW * k;

  return { stillX, stillY, clipX, clipY, stillW, clipW,
    dx: stillX - clipX, dy: stillY - clipY,
    scaleRatio: stillW / clipW,
    coversScreen: lr.width >= innerWidth - 1 && lr.height >= innerHeight - 1 };
})()`;

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const vp of VPS) {
    const phone = vp.w < 900;
    console.log(`\n-- ${vp.w}x${vp.h} --`);
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h },
      isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 2 : 1,
      userAgent: phone ? 'Mozilla/5.0 (Linux; Android 13) Mobile Safari/537.36' : undefined });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto(BASE + '/arrival-mock.html', { waitUntil: 'load' });
    await page.waitForTimeout(2400);

    let worstD = 0, worstS = 0, worstAt = 0;
    for (const p of [0, 0.15, 0.3, 0.45, 0.55, 0.7, 0.85, 1]) {
      await page.evaluate(f => {
        const max = document.documentElement.scrollHeight - innerHeight;
        scrollTo(0, max * f);
      }, p);
      await page.waitForTimeout(230);
      const m = await page.evaluate(PROBE);
      /* how far apart the two pictures are, as a share of the screen */
      const d = Math.hypot(m.dx, m.dy) / vp.w;
      const s = Math.abs(m.scaleRatio - 1);
      if (d > worstD) { worstD = d; worstAt = p; }
      if (s > worstS) worstS = s;
    }
    ok(`${vp.w}x${vp.h}: the still and the clip stay the same picture`,
      worstD < 0.02, `worst offset ${(worstD * 100).toFixed(1)}% of the screen at p=${worstAt}`);
    ok(`${vp.w}x${vp.h}: and the same size`, worstS < 0.02,
      `worst scale mismatch ${(worstS * 100).toFixed(1)}%`);

    /* it must finish with the clip filling the screen */
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(500);
    const end = await page.evaluate(PROBE);
    ok(`${vp.w}x${vp.h}: it lands on the clip, filling the screen`, end.coversScreen);

    /* the waterfall must stay clear of the block of ways in */
    const clear = await page.evaluate(() => {
      const ways = document.getElementById('ways');
      const wr = ways.getBoundingClientRect();
      const island = document.getElementById('island');
      const ir = island.getBoundingClientRect();
      const FW = 0.96338, FX = 0.021, FY = 0.01471, AR = 1360/2048;
      const wP = ir.width / FW, hP = wP * AR;
      const pL = ir.left - FX * wP, pT = ir.top - FY * hP;
      /* the waterfall's box, not just its centre */
      const box = { l: pL + 0.4887*wP, r: pL + 0.5294*wP,
                    t: pT + 0.4815*hP, b: pT + 0.6407*hP };
      /* the block's top third is a transparent gradient by design — the
         water reads straight through it. What must not cover the waterfall
         is the part that is actually opaque, which starts about 30% down. */
      const solidTop = wr.top + wr.height * 0.3;
      const over = !(box.b < solidTop || box.t > wr.bottom || box.r < wr.left || box.l > wr.right);
      return { over, box: { l: Math.round(box.l), t: Math.round(box.t), b: Math.round(box.b) },
        waysTop: Math.round(solidTop) };
    });
    ok(`${vp.w}x${vp.h}: the waterfall is not covered by the ways in`, !clear.over,
      `waterfall ${clear.box.t}..${clear.box.b}, block starts ${clear.waysTop}`);

    /* P-A: "the text arrives just a little bit below the bridge. It can be a
       bit lower but not higher." So nothing in the block may spill ABOVE the
       block's own top, which is the bridge. And the floors still apply. */
    const fit = await page.evaluate(() => {
      const ways = document.getElementById('ways');
      const wr = ways.getBoundingClientRect();
      let above = 0, minTap = 999, minLabel = 99;
      ways.querySelectorAll('.ways__q,.way').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < wr.top - 1) above = Math.max(above, Math.round(wr.top - r.top));
      });
      ways.querySelectorAll('.way').forEach(el => {
        minTap = Math.min(minTap, Math.round(el.getBoundingClientRect().height));
      });
      ways.querySelectorAll('.way__s').forEach(el => {
        minLabel = Math.min(minLabel, parseFloat(getComputedStyle(el).fontSize));
      });
      return { above, minTap, minLabel,
        bottomSpill: Math.round(ways.scrollHeight - wr.height) };
    });
    ok(`${vp.w}x${vp.h}: the words start below the bridge, not above it`,
      fit.above === 0, `${fit.above}px above the block`);
    ok(`${vp.w}x${vp.h}: the ways in fit the space`, fit.bottomSpill <= 0,
      `${fit.bottomSpill}px of overflow`);
    ok(`${vp.w}x${vp.h}: 44px targets`, fit.minTap >= 44, `${fit.minTap}px`);
    ok(`${vp.w}x${vp.h}: 12px label floor`, fit.minLabel >= 12, `${fit.minLabel}px`);

    if (vp.w === 390 && vp.h === 844) {
      await page.screenshot({ path: path.join(OUT, 'r29e-arrival-end.png') });
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT, 'r29e-arrival-start.png') });
      await page.evaluate(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        scrollTo(0, max * 0.55);
      });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(OUT, 'r29e-arrival-mid.png') });
    }

    ok(`${vp.w}x${vp.h}: no page errors`, errs.length === 0, errs.join(' | '));
    await ctx.close();
  }
  await b.close();
  console.log(fails ? `\n${fails} FAILED` : '\nall green');
  process.exit(fails ? 1 : 0);
})();
