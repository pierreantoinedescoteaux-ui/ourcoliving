const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push(page(p) + ' ' + String(e).slice(0, 120)));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) errs.push(page(p) + ' ' + m.text().slice(0, 120)); });
  const page = pp => pp.url().split('/').pop();

  // 1) banner overlap: title should sit over the painting's faded bottom
  await p.goto('http://localhost:8123/map.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2200);
  await p.screenshot({ path: '_qa/f4-map-banner.png', clip: { x: 0, y: 0, width: 1440, height: 640 } });
  await p.goto('http://localhost:8123/resources.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2200);
  await p.screenshot({ path: '_qa/f4-resources-banner.png', clip: { x: 0, y: 0, width: 1440, height: 640 } });
  const motes = await p.evaluate(() => document.querySelectorAll('.wfx-mote').length);

  // 2) hover mood on a dynamically-rendered filter pill (delegation path)
  const pill = await p.$('.filters button');
  if (pill) { await pill.hover(); await p.waitForTimeout(650); }
  const armed = await p.evaluate(() => {
    const el = document.querySelector('.filters button');
    return el ? { armed: el.dataset.wfx === '1', fx: !!el.querySelector('.wfx-hover') } : null;
  });
  await p.screenshot({ path: '_qa/f4-pill-hover.png', clip: { x: 200, y: 300, width: 900, height: 420 } });

  // 3) footer branch crest
  await p.goto('http://localhost:8123/about.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: '_qa/f4-footer.png', clip: { x: 0, y: 350, width: 1440, height: 550 } });

  // 4) click-bloom size
  await p.mouse.click(700, 400);
  await p.waitForTimeout(150);
  const blooms = await p.evaluate(() => document.querySelectorAll('.wfx-bloom').length);

  // 5) landing: pollen present + auto-settle
  await p.goto('http://localhost:8123/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3200);
  const landingMotes = await p.evaluate(() => document.querySelectorAll('.wfx-mote').length);
  // park mid-transition: between dwell 1 (center 0.75vh) and dwell 2
  const parked = await p.evaluate(() => { const y = Math.round(innerHeight * 1.9); window.scrollTo(0, y); return y; });
  await p.waitForTimeout(4500); // idle > 2.6s -> settle should fire
  const settled = await p.evaluate(() => Math.round(window.scrollY));
  console.log(JSON.stringify({ motes, armed, blooms, landingMotes, parked, settled, moved: Math.abs(settled - parked) > 100 }));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();
