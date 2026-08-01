/* where can the thread cross the column, if anywhere? */
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://127.0.0.1:8123';

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/project.html?p=montreal', { waitUntil: 'load' });
  await page.waitForTimeout(1200);

  const out = await page.evaluate(() => {
    const story = document.getElementById('pStory');
    const sRect = story.getBoundingClientRect();
    const W = story.clientWidth, H = story.scrollHeight;
    const CLEAR = 11, CLEAR_Y = 5, THICK = 8, BAND = 22;
    const SEL = "p,h1,h2,h3,h4,li,blockquote,figcaption,.eyebrow,.chapeye,.lede,.lede-serif,.s-label,.t-kicker,.p-kicker,.hero-cap,.note,a";
    const obst = [];
    story.querySelectorAll(SEL).forEach(el => {
      if (el.classList.contains('railnode')) return;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      if (!el.textContent.trim()) return;
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 6) return;
      obst.push({ top: r.top - sRect.top - CLEAR_Y, bot: r.bottom - sRect.top + CLEAR_Y,
        a: r.left - sRect.left - CLEAR, b: r.right - sRect.left + CLEAR,
        tag: el.tagName.toLowerCase() + '.' + (el.className || '').toString().split(' ')[0] });
    });
    const bleedL = Math.max(0, Math.min(30, sRect.left));
    const bleedR = Math.max(0, Math.min(30, innerWidth - sRect.right));
    const X0 = -bleedL, X1 = W + bleedR;
    function free(here) {
      let out = [[X0, X1]];
      here.forEach(o => {
        const nx = [];
        out.forEach(s => {
          if (o.b <= s[0] || o.a >= s[1]) { nx.push(s); return; }
          if (o.a > s[0]) nx.push([s[0], o.a]);
          if (o.b < s[1]) nx.push([o.b, s[1]]);
        });
        out = nx;
      });
      return out.filter(s => s[1] - s[0] >= THICK + 2);
    }
    const bands = Math.ceil(H / BAND);
    let wideRuns = [], run = 0, widest = 0;
    const sample = [];
    for (let i = 0; i < bands; i++) {
      const yT = i * BAND, yB = yT + BAND;
      const here = obst.filter(o => o.bot > yT && o.top < yB);
      const sp = free(here);
      const w = sp.reduce((m, s) => Math.max(m, s[1] - s[0]), 0);
      widest = Math.max(widest, w);
      if (w > (X1 - X0) * 0.8) { run++; } else { if (run) wideRuns.push({ end: i, run }); run = 0; }
      if (i % 20 === 0) sample.push({ i, spans: sp.map(s => [Math.round(s[0]), Math.round(s[1])]) });
    }
    if (run) wideRuns.push({ end: bands, run });
    return { W, H, X0, X1, bands, widest: Math.round(widest),
      wideRuns: wideRuns.filter(r => r.run >= 1).slice(0, 14),
      maxRun: wideRuns.reduce((m, r) => Math.max(m, r.run), 0),
      sample: sample.slice(0, 8), obst: obst.length };
  });
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
