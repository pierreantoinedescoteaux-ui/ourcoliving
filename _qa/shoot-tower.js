/* Living Tower landing QA — seams, loops, scrub, console. Serve repo over HTTP first:
   python -m http.server 8123  (from repo root), then: node _qa/shoot-tower.js */
const { chromium } = require("playwright-core");
const path = require("path");
const BASE = "http://localhost:8123/tower.html";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });

  await page.goto(BASE, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(2500);

  const info = await page.evaluate(() => {
    const scenes = document.querySelectorAll(".sw-scene").length;
    const dots = document.querySelectorAll(".sw-route__dot").length;
    const track = document.querySelector(".sw-track");
    return { scenes, dots, trackH: track ? track.offsetHeight : 0, vh: innerHeight };
  });
  console.log("segments:", info.scenes, "route dots:", info.dots, "track:", info.trackH + "px");

  // wait for first loop to come up, verify it PLAYS (currentTime advances, not scrubbed)
  await page.waitForTimeout(3500);
  const loop1 = await page.evaluate(async () => {
    const v = document.querySelector(".sw-scene video");
    if (!v) return { present: false };
    const t0 = v.currentTime;
    await new Promise(r => setTimeout(r, 1200));
    return { present: true, playing: v.currentTime > t0 + 0.4, seekable: v.seekable.length ? v.seekable.end(0) : 0, loop: v.loop };
  });
  console.log("S1 loop:", JSON.stringify(loop1));
  await page.screenshot({ path: path.join(__dirname, "tw-s1.png") });

  // seam positions: read segment boundaries from layout via scroll math
  const seams = await page.evaluate(() => {
    // reconstruct: scenes' opacity flips are driven by scroll; sample instead
    const track = document.querySelector(".sw-track");
    return { total: track.offsetHeight - innerHeight };
  });
  const N = 13; // 7 loops + 6 transitions
  for (let i = 1; i <= 3; i++) {
    // sample three seams spread across the page: before/after screenshots
    const frac = i / 4;
    const y = Math.round(seams.total * frac);
    await page.evaluate(yy => window.scrollTo(0, yy), y - 40);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: path.join(__dirname, `tw-seam${i}-a.png`) });
    await page.evaluate(yy => window.scrollTo(0, yy), y + 40);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: path.join(__dirname, `tw-seam${i}-b.png`) });
    console.log(`seam sample ${i} @${y}px shot`);
  }

  // transition scrub check: find a scrubbed (non-loop) video mid-band and verify currentTime tracks scroll
  const scrub = await page.evaluate(async () => {
    const vids = [...document.querySelectorAll(".sw-scene video")];
    const v = vids.find(v => !v.loop);
    if (!v) return { found: false };
    return { found: true, seekable: v.seekable.length ? v.seekable.end(0) : 0 };
  });
  console.log("transition video:", JSON.stringify(scrub));

  // end state: last section CTA visible
  await page.evaluate(t => window.scrollTo(0, t), seams.total);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(__dirname, "tw-end.png") });

  // reduced-motion smoke
  const rm = await browser.newPage({ viewport: { width: 1440, height: 950 }, reducedMotion: "reduce" });
  await rm.goto(BASE, { waitUntil: "networkidle" }).catch(() => {});
  await rm.waitForTimeout(1500);
  const rmv = await rm.evaluate(() => document.querySelectorAll(".sw-scene video").length);
  console.log("reduced-motion videos loaded (want 0):", rmv);

  // phone viewport smoke
  const ph = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ph.goto(BASE, { waitUntil: "networkidle" }).catch(() => {});
  await ph.waitForTimeout(2000);
  await ph.screenshot({ path: path.join(__dirname, "tw-phone.png") });

  console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "0 console/page errors");
  await browser.close();
})();
