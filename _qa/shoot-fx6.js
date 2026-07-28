const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) errs.push(m.text().slice(0, 140)); });

  // 1) hero-on-banner: map + resources + type (workshop now)
  for (const pg of ['map.html', 'resources.html', 'type.html']) {
    await p.goto('http://localhost:8123/' + pg, { waitUntil: 'networkidle' });
    await p.waitForTimeout(2200);
    await p.screenshot({ path: '_qa/f6-hero-' + pg.replace('.html', '') + '.png', clip: { x: 0, y: 0, width: 1920, height: 760 } });
  }
  const scene = await p.evaluate(() => document.querySelector('.wband') && document.querySelector('.wband').getAttribute('data-scene'));
  console.log('type.html scene (want makers):', scene);

  // 2) footer compact + logo
  await p.goto('http://localhost:8123/about.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1400);
  await p.screenshot({ path: '_qa/f6-footer2.png', clip: { x: 0, y: 560, width: 1920, height: 520 } });

  // 3) landing mini-footer at the end
  await p.goto('http://localhost:8123/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(2500);
  const mini = await p.evaluate(() => {
    const m = document.querySelector('.sminifoot');
    return m ? { shown: m.classList.contains('show') } : null;
  });
  console.log('mini-footer:', JSON.stringify(mini));
  await p.screenshot({ path: '_qa/f6-minifoot.png', clip: { x: 0, y: 480, width: 1920, height: 600 } });

  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();
