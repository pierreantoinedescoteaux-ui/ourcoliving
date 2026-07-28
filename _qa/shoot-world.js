/* QA: world layer (scene banners + grain) on interior pages */
const { chromium } = require('playwright-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PAGES = ['resources.html', 'about.html', 'projects.html', 'design.html', 'themes.html', 'map.html', 'work.html', 'story.html'];

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(page.url().split('/').pop() + ': ' + m.text().slice(0, 160)); });
  page.on('pageerror', e => errors.push(page.url().split('/').pop() + ' PAGEERROR: ' + String(e).slice(0, 160)));

  for (const p of PAGES) {
    await page.goto('http://localhost:8123/' + p, { waitUntil: 'networkidle', timeout: 20000 }).catch(e => errors.push(p + ' NAV: ' + e.message.slice(0, 100)));
    await page.waitForTimeout(2200);
    const state = await page.evaluate(() => ({
      band: !!document.querySelector('.wband'),
      scene: document.querySelector('.wband') ? document.querySelector('.wband').getAttribute('data-scene') : null,
      grain: !!document.querySelector('.grain,.wgrain'),
      video: !!document.querySelector('.wband video'),
      playing: (() => { const v = document.querySelector('.wband video'); return v ? !v.paused : null; })(),
      accent: getComputedStyle(document.documentElement).getPropertyValue('--scene-accent').trim(),
      back: document.querySelector('.wback') ? document.querySelector('.wback').getAttribute('href') : null
    }));
    console.log(p, JSON.stringify(state));
    await page.screenshot({ path: '_qa/world-' + p.replace('.html', '') + '.png' });
  }

  // deep-link check: back-to-tower lands on the right floor
  await page.goto('http://localhost:8123/index.html#library', { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2500);
  const y = await page.evaluate(() => Math.round(window.scrollY));
  console.log('index#library scrollY:', y, y > 1000 ? 'JUMPED OK' : 'NO JUMP');
  await page.screenshot({ path: '_qa/world-deeplink.png' });

  console.log('ERRORS:', errors.length ? errors.join(' | ') : 'none');
  await browser.close();
})();
