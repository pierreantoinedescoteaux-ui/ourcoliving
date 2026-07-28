const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 130)));
  await p.goto('http://localhost:8123/index.html', { waitUntil: 'networkidle' });
  await p.waitForTimeout(5000);
  const v = await p.evaluate(() => {
    const vid = document.querySelector('video');
    return vid ? { w: vid.videoWidth, h: vid.videoHeight, playing: !vid.paused, dur: +vid.duration.toFixed(2) } : null;
  });
  console.log('phone clip:', JSON.stringify(v), '(want 608x1080 portrait, playing, ~7.5s)');
  await p.screenshot({ path: '_qa/f8-phone-landing.png' });
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();
