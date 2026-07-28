const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const p = await b.newPage();
  p.on('response', r => { if (r.status() === 404) console.log('404:', r.url()); });
  await p.goto('https://ourcoliving.xyz/', { waitUntil: 'networkidle' });
  await p.evaluate(() => scrollTo(0, innerHeight * 6));
  await p.waitForTimeout(6000); const v=await p.evaluate(()=>{const x=document.querySelector('.sw-scene video'); return x?{playing:!x.paused||x.currentTime>0, seek:x.seekable.length?x.seekable.end(0):0}:null}); console.log('live video:', JSON.stringify(v));
  await b.close();
  console.log('done');
})();
