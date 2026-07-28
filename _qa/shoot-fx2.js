const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  p.on('pageerror', e => errors.push(String(e).slice(0, 140)));

  // forge on landing veil
  await p.goto('http://localhost:8123/index.html', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(900);
  await p.screenshot({ path: '_qa/fx2-forge.png', clip: { x: 560, y: 300, width: 340, height: 300 } });

  // leaf hover close-up (themes = gardens)
  await p.goto('http://localhost:8123/themes.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await p.hover('.wback');
  await p.waitForTimeout(750);
  const box = await p.evaluate(() => { const r = document.querySelector('.wback').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  await p.screenshot({ path: '_qa/fx2-leaf.png', clip: { x: box.x - 40, y: box.y - 60, width: box.w + 120, height: box.h + 120 } });

  // zap hover close-up (resources = library)
  await p.goto('http://localhost:8123/resources.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await p.hover('.wback');
  await p.waitForTimeout(500);
  const bx = await p.evaluate(() => { const r = document.querySelector('.wback').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  await p.screenshot({ path: '_qa/fx2-zap.png', clip: { x: bx.x - 40, y: bx.y - 60, width: bx.w + 120, height: bx.h + 120 } });

  // footer branch
  await p.goto('http://localhost:8123/about.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: '_qa/fx2-footer.png', clip: { x: 0, y: 400, width: 1440, height: 500 } });

  console.log('ERRORS:', errors.length ? errors.join(' | ') : 'none');
  await b.close();
})();
