const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:8123/resources.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  const before = await p.evaluate(() =>
    Array.from(document.querySelectorAll('.wfx-mote')).map(m => { const r = m.getBoundingClientRect(); return [r.x, r.y]; }));
  // circle the cursor around screen center for ~2s
  for (let t = 0; t < 40; t++) {
    const a = t / 40 * Math.PI * 4;
    await p.mouse.move(720 + Math.cos(a) * 260, 450 + Math.sin(a) * 200);
    await p.waitForTimeout(50);
  }
  const after = await p.evaluate(() =>
    Array.from(document.querySelectorAll('.wfx-mote')).map(m => { const r = m.getBoundingClientRect(); return [r.x, r.y]; }));
  const moved = before.map((v, i) => Math.round(Math.hypot(after[i][0] - v[0], after[i][1] - v[1])));
  console.log('per-mote displacement px:', moved.join(','), '| max:', Math.max(...moved));
  await b.close();
})();
