const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });

  // 1) pollen repel: move mouse to a mote's position, verify it flees
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 130)));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) errs.push(m.text().slice(0, 130)); });
  await p.goto('http://localhost:8123/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3500);
  const before = await p.evaluate(() => {
    const m = document.querySelector('.wfx-mote');
    const r = m.getBoundingClientRect();
    return { x: r.x, y: r.y, z: getComputedStyle(m).zIndex };
  });
  await p.mouse.move(before.x + 3, before.y + 3);
  for (let i = 0; i < 14; i++) { await p.mouse.move(before.x + 3 + i, before.y + 3); await p.waitForTimeout(50); }
  const after = await p.evaluate(() => {
    const m = document.querySelector('.wfx-mote');
    const r = m.getBoundingClientRect();
    return { x: r.x, y: r.y };
  });
  const fled = Math.hypot(after.x - before.x, after.y - before.y);
  console.log('mote z:', before.z, 'fled px:', Math.round(fled), fled > 40 ? 'REPEL OK' : 'REPEL WEAK');

  // 2) mini-footer at the true end, short viewport (his screenshot case)
  const p2 = await b.newPage({ viewport: { width: 1856, height: 833 } });
  await p2.goto('http://localhost:8123/index.html', { waitUntil: 'networkidle' });
  await p2.waitForTimeout(2500);
  await p2.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p2.waitForTimeout(1500);
  await p2.screenshot({ path: '_qa/f7-minifoot.png', clip: { x: 0, y: 400, width: 1856, height: 433 } });
  // mid-scene: should NOT show
  await p2.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight - innerHeight * 1.5));
  await p2.waitForTimeout(800);
  const midShow = await p2.evaluate(() => document.querySelector('.sminifoot').classList.contains('show'));
  console.log('minifoot mid-scene shown (want false):', midShow);

  // 3) footer at phone + tablet
  const p3 = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p3.goto('http://localhost:8123/about.html', { waitUntil: 'networkidle' });
  await p3.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p3.waitForTimeout(1200);
  await p3.screenshot({ path: '_qa/f7-footer-phone.png', fullPage: false });
  const ovf = await p3.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log('phone footer horizontal overflow:', ovf);

  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();
