/* QA: new village growth film on manifesto — poster, scrub frames, errors.
   Serve first: python -m http.server 8123 (repo root), then: node _qa/shoot-village2.js */
const { chromium } = require("playwright-core");
const path = require("path");
const BASE = "http://localhost:8123/manifesto.html";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  let fails = 0;
  const check = (ok, label) => { console.log((ok ? "PASS" : "FAIL") + "  " + label); if (!ok) fails++; };

  for (const [tag, vp] of [["desk", { width: 1440, height: 950 }], ["phone", { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport: vp, hasTouch: tag === "phone", isMobile: tag === "phone" });
    const errors = [];
    page.on("pageerror", e => errors.push("pageerror: " + e.message));
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.goto(BASE, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(2000);
    const wrapTop = await page.evaluate(() => {
      const w = document.querySelector(".scenewrap");
      return w ? w.getBoundingClientRect().top + scrollY : -1;
    });
    check(wrapTop > 0, tag + ": village scenewrap present");
    const wrapH = await page.evaluate(() => document.querySelector(".scenewrap").offsetHeight);
    // scrub 0%, 30%, 55%, 80%, 98% through the pinned range
    for (const [i, f] of [0, 0.3, 0.55, 0.8, 0.98].entries()) {
      await page.evaluate(([t, h, f2]) => scrollTo(0, Math.round(t + (h - innerHeight) * f2)), [wrapTop, wrapH, f]);
      await page.waitForTimeout(1100);
      await page.screenshot({ path: path.join(__dirname, `vil2-${tag}-${i}.png`) });
    }
    const state = await page.evaluate(() => {
      const v = document.getElementById("vilvid"), w = document.getElementById("vilwrap"), l = document.getElementById("villoop");
      return { live: w.classList.contains("live"), alpha: w.classList.contains("alpha"),
               resting: w.classList.contains("resting"), loopPlaying: l && !l.paused,
               poster: (document.getElementById("vilposter").currentSrc || "").split("/").pop(),
               t: +v.currentTime.toFixed(2), dur: +(v.duration || 0).toFixed(2) };
    });
    console.log(tag + " film state:", JSON.stringify(state));
    check(state.live, tag + ": film went live (first frame painted)");
    check(state.dur > 14, tag + ": film is the 16s master (dur " + state.dur + ")");
    check(state.t > state.dur * 0.8, tag + ": scrub reached the finale");
    check(state.alpha, tag + ": alpha path active (Chromium)");
    check(state.poster === "village-a-alpha.webp", tag + ": transparent poster (" + state.poster + ")");
    // hold at the very end for the idle loop to fade in
    await page.evaluate(([t, h]) => scrollTo(0, Math.round(t + (h - innerHeight) * 1)), [wrapTop, wrapH]);
    await page.waitForTimeout(2500);
    const rest = await page.evaluate(() => {
      const w = document.getElementById("vilwrap"), l = document.getElementById("villoop");
      return { resting: w.classList.contains("resting"), playing: l && !l.paused && l.currentTime > 0 };
    });
    check(rest.resting && rest.playing, tag + ": idle loop playing at scroll end " + JSON.stringify(rest));
    await page.screenshot({ path: path.join(__dirname, `vil2-${tag}-rest.png`) });
    check(errors.length === 0, tag + ": 0 console/page errors" + (errors.length ? " -> " + errors.slice(0, 3).join(" | ") : ""));
    await page.close();
  }

  await browser.close();
  console.log(fails === 0 ? "ALL GREEN" : fails + " FAILURES");
  process.exit(fails === 0 ? 0 : 1);
})();
