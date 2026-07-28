/* QA: new t12 scrub (desktop) + mobile landing flow (portrait posters, loop autoplay).
   Serve first: python -m http.server 8123 (repo root), then: node _qa/shoot-t12-mobile.js */
const { chromium } = require("playwright-core");
const path = require("path");
const BASE = "http://localhost:8123/index.html";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  let fails = 0;
  const check = (ok, label) => { console.log((ok ? "PASS" : "FAIL") + "  " + label); if (!ok) fails++; };

  /* ---------- desktop: scrub through the t12 segment ---------- */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    const errors = [];
    page.on("pageerror", e => errors.push("pageerror: " + e.message));
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.goto(BASE, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(3000);
    // t12 = first connector; scrub from S1 dwell into the connector range
    const probe = await page.evaluate(() => ({ max: document.body.scrollHeight - innerHeight, vh: innerHeight }));
    // sample 5 points across the first 18% of the scroll range (S1 dive + conn 1 + S2 arrival)
    for (let i = 0; i <= 4; i++) {
      const y = Math.round(probe.max * 0.045 * i);
      await page.evaluate(_y => scrollTo(0, _y), y);
      await page.waitForTimeout(650);
      await page.screenshot({ path: path.join(__dirname, `t12scrub-${i}.png`) });
    }
    const vidState = await page.evaluate(() => {
      const vids = [...document.querySelectorAll(".sw-scene video, video")];
      return vids.slice(0, 4).map(v => ({ src: (v.currentSrc || "").split("/").pop().slice(0, 24), t: +v.currentTime.toFixed(2), ready: v.readyState }));
    });
    console.log("videos:", JSON.stringify(vidState));
    check(errors.length === 0, "desktop: 0 console/page errors" + (errors.length ? " -> " + errors.slice(0, 3).join(" | ") : ""));
    await page.close();
  }

  /* ---------- phone: portrait poster + loop autoplay on land ---------- */
  {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true, hasTouch: true,
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });
    const errors = [], fetched = [];
    page.on("pageerror", e => errors.push("pageerror: " + e.message));
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    page.on("request", r => { const u = r.url(); if (u.endsWith(".mp4")) fetched.push(u.split("/").pop()); });
    await page.goto(BASE, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(1200);
    // landed WITHOUT any gesture: poster must be the PORTRAIT -m.webp
    const poster = await page.evaluate(() => {
      const img = document.querySelector(".sw-scene img");
      return img ? img.currentSrc.split("/").pop() : null;
    });
    check(poster === "S1-m.webp", "phone: landing poster is portrait S1-m.webp (got " + poster + ")");
    await page.screenshot({ path: path.join(__dirname, "t12m-land.png") });
    // loop should autoplay muted without user gesture once loaded
    await page.waitForTimeout(3800);
    const loop = await page.evaluate(async () => {
      const v = document.querySelector(".sw-scene video");
      if (!v) return { present: false };
      const t0 = v.currentTime;
      await new Promise(r => setTimeout(r, 1300));
      return { present: true, src: (v.currentSrc || "").split("/").pop(), playing: v.currentTime > t0 + 0.4 };
    });
    console.log("phone S1 loop:", JSON.stringify(loop));
    check(fetched.includes("loop-s1-m.mp4"), "phone: mobile loop file fetched (" + fetched.slice(0, 3).join(",") + ")");
    check(loop.playing === true, "phone: loop autoplays before any touch");
    await page.screenshot({ path: path.join(__dirname, "t12m-loop.png") });
    // scrub a little into the transition
    await page.evaluate(() => scrollTo(0, Math.round((document.body.scrollHeight - innerHeight) * 0.09)));
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(__dirname, "t12m-scrub.png") });
    check(errors.length === 0, "phone: 0 console/page errors" + (errors.length ? " -> " + errors.slice(0, 3).join(" | ") : ""));
    await page.close();
  }

  await browser.close();
  console.log(fails === 0 ? "ALL GREEN" : fails + " FAILURES");
  process.exit(fails === 0 ? 0 : 1);
})();
