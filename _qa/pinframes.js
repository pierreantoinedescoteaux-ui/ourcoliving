// Extract frames from the Pinterest reference video via Chrome
const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 720, height: 906 } });
  const videoPath = 'file:///' + path.resolve('C:/tmp/pin.mp4').replace(/\\/g, '/');
  // git-bash /tmp maps to C:\Users\User\AppData\Local\Temp or msys tmp — pass real path via env
  const src = process.env.VIDEO_URL;
  await page.setContent(`<body style="margin:0;background:#000"><video id="v" src="${src}" style="width:720px" muted></video></body>`);
  await page.waitForFunction(() => {
    const v = document.getElementById('v');
    return v && v.readyState >= 2 && v.duration > 0;
  }, { timeout: 30000 });
  const duration = await page.evaluate(() => document.getElementById('v').duration);
  console.log('duration:', duration);
  const N = 10;
  for (let i = 0; i < N; i++) {
    const t = (duration * i) / (N - 1);
    await page.evaluate((t) => {
      const v = document.getElementById('v');
      return new Promise((res) => {
        v.onseeked = res;
        v.currentTime = t;
      });
    }, Math.min(t, duration - 0.05));
    await page.waitForTimeout(200);
    await page.screenshot({ path: `pinframe-${String(i).padStart(2, '0')}.png` });
    console.log('frame', i, 'at', t.toFixed(2) + 's');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
