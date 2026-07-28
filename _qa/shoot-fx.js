const { chromium } = require('playwright-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(page.url().split('/').pop() + ': ' + m.text().slice(0, 140)); });
  page.on('pageerror', e => errors.push(page.url().split('/').pop() + ' PAGEERROR: ' + String(e).slice(0, 140)));

  // 1) manifesto: bubble stage with backdrop + popped vines
  await page.goto('http://localhost:8123/manifesto.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const bed = await page.evaluate(() => {
    const b = document.getElementById('fieldbed');
    return b.getBoundingClientRect().top + window.scrollY;
  });
  await page.evaluate(y => window.scrollTo(0, y + window.innerHeight * 2.2), bed);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: '_qa/fx-manifesto-stage.png' });
  const mstate = await page.evaluate(() => ({
    backdrop: !!document.querySelector('.fieldbg .b-bloom'),
    bloomOpacity: getComputedStyle(document.querySelector('.fieldbg .b-bloom')).opacity,
    popped: document.querySelectorAll('.bub.pop').length,
    segsDrawn: Array.from(document.querySelectorAll('.bvinesvg .seg')).filter(s => parseFloat(s.style.strokeDashoffset || 1) < parseFloat(s.style.strokeDasharray || 1) * 0.5).length,
    spriteLeaves: document.querySelectorAll('.bvinesvg image.bleaf').length
  }));
  console.log('manifesto', JSON.stringify(mstate));
  await page.evaluate(y => window.scrollTo(0, y + window.innerHeight * 4.5), bed);
  await page.waitForTimeout(2600);
  await page.screenshot({ path: '_qa/fx-manifesto-lit.png' });

  // 2) resources: pollen + hover mood (zap on library floor)
  await page.goto('http://localhost:8123/resources.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const rstate = await page.evaluate(() => ({
    motes: document.querySelectorAll('.wfx-mote').length,
    fxLoaded: !!document.querySelector('script[src$="world-fx.js"]'),
    favicon: !!document.querySelector('link[href*="favicon-64"]')
  }));
  console.log('resources', JSON.stringify(rstate));
  await page.hover('.wback');
  await page.waitForTimeout(700);
  await page.screenshot({ path: '_qa/fx-hover-zap.png', clip: { x: 0, y: 100, width: 700, height: 260 } });

  // 3) themes (gardens floor): leaf hover
  await page.goto('http://localhost:8123/themes.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.hover('.wback');
  await page.waitForTimeout(700);
  await page.screenshot({ path: '_qa/fx-hover-leaf.png', clip: { x: 0, y: 100, width: 700, height: 260 } });

  // 4) click-bloom
  await page.mouse.click(720, 500);
  await page.waitForTimeout(200);
  const blooms = await page.evaluate(() => document.querySelectorAll('.wfx-bloom').length);
  console.log('click-bloom particles:', blooms);

  // 5) landing veil: shows then reveals
  await page.goto('http://localhost:8123/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  const veilEarly = await page.evaluate(() => !!document.querySelector('.wfx-veil'));
  await page.screenshot({ path: '_qa/fx-landing-veil.png' });
  await page.waitForTimeout(3200);
  const veilGone = await page.evaluate(() => !document.querySelector('.wfx-veil'));
  console.log('landing veil early:', veilEarly, 'gone after:', veilGone);

  // 6) transition veil: navigate from a page via link click
  await page.goto('http://localhost:8123/resources.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.evaluate(() => { const a = document.querySelector('.wback'); a.click(); });
  await page.waitForTimeout(600);
  const transState = await page.evaluate(() => ({ url: location.pathname, veil: !!document.querySelector('.wfx-veil') }));
  console.log('transition', JSON.stringify(transState));
  await page.waitForTimeout(2000);

  console.log('ERRORS:', errors.length ? errors.join(' | ') : 'none');
  await browser.close();
})();
