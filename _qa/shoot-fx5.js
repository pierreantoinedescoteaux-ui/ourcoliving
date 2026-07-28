const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) errs.push(m.text().slice(0, 140)); });

  await p.goto('http://localhost:8123/resources.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  const pills = await p.$$('.filters button');
  for (let i = 0; i < 3 && i < pills.length; i++) {
    await pills[i].hover();
    await p.waitForTimeout(750);
    const info = await p.evaluate(idx => {
      const el = document.querySelectorAll('.filters button')[idx];
      return { sprites: el.querySelectorAll('.wfx-spr').length, svg: !!el.querySelector('.wfx-hover') };
    }, i);
    console.log('pill', i, JSON.stringify(info));
    await p.screenshot({ path: '_qa/f5-hover-' + i + '.png', clip: { x: 180, y: 560, width: 1000, height: 300 } });
  }

  await p.goto('http://localhost:8123/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(4000);
  const loop = await p.evaluate(() => {
    const v = document.querySelector('video');
    return v ? { dur: +v.duration.toFixed(2), playing: !v.paused, loop: v.loop } : null;
  });
  console.log('landing loop:', JSON.stringify(loop));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();
