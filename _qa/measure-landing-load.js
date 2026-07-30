/* What does the landing actually download before the visitor does anything?
   Answers P-A's question: is the whole climb loaded up front, or already lazy? */
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });

  for (const dev of [
    { name: 'PHONE  390x844', vp: { width: 390, height: 844 }, mobile: true },
    { name: 'DESKTOP 1440x900', vp: { width: 1440, height: 900 }, mobile: false }
  ]) {
    const ctx = await browser.newContext({ viewport: dev.vp, isMobile: dev.mobile, hasTouch: dev.mobile, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const seen = new Map();
    page.on('response', async r => {
      const u = r.url();
      let len = Number(r.headers()['content-length'] || 0);
      if (!len) { try { len = (await r.body()).length; } catch (e) { len = 0; } }
      seen.set(u, { len, type: r.request().resourceType() });
    });

    await page.goto('http://127.0.0.1:8123/index.html', { waitUntil: 'load' });
    await page.waitForTimeout(6000);   // let the idle loop settle

    const group = {};
    let total = 0;
    for (const [u, v] of seen) {
      const k = /\/vid\//.test(u) ? 'video (tower clips)'
        : /\.webp|\.png|\.jpg/.test(u) ? 'images/posters'
        : /\.js$/.test(u) ? 'scripts'
        : /\.css$/.test(u) ? 'styles' : 'other';
      group[k] = (group[k] || 0) + v.len;
      total += v.len;
    }
    console.log('\n=== ' + dev.name + ' : nothing touched, 6s after load ===');
    Object.entries(group).sort((a, b) => b[1] - a[1])
      .forEach(([k, v]) => console.log('  ' + k.padEnd(22) + (v / 1048576).toFixed(2) + ' MB'));
    console.log('  ' + 'TOTAL'.padEnd(22) + (total / 1048576).toFixed(2) + ' MB   (' + seen.size + ' requests)');

    const vids = [...seen.entries()].filter(([u]) => /\/vid\//.test(u));
    vids.forEach(([u, v]) => console.log('      ' + u.split('/').pop().padEnd(16) + (v.len / 1048576).toFixed(2) + ' MB'));

    await ctx.close();
  }
  await browser.close();
})();
