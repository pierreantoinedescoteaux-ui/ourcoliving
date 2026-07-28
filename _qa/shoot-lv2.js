/* QA: landing-v2 map test — debug polygons, hover state, phone pills.
   Serve first: python -m http.server 8123, then: node _qa/shoot-lv2.js */
const { chromium } = require("playwright-core");
const path = require("path");
(async () => {
  const b = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  let fails = 0;
  const check = (ok, label) => { console.log((ok ? "PASS" : "FAIL") + "  " + label); if (!ok) fails++; };

  // desktop: debug overlay for polygon calibration
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto("http://localhost:8123/landing-v2.html?debug", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  await p.screenshot({ path: path.join(__dirname, "lv2-debug.png") });

  // hover the library room, capture the highlight + card
  await p.goto("http://localhost:8123/landing-v2.html", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const pt = await p.evaluate(() => {
    const st = document.getElementById("stage").getBoundingClientRect();
    return { x: st.left + st.width * (870 / 2048), y: st.top + st.height * (510 / 1360) };
  });
  await p.mouse.move(pt.x, pt.y); await p.waitForTimeout(600);
  const hov = await p.evaluate(() => ({
    hot: !!document.querySelector(".room.hot"),
    card: document.getElementById("card").classList.contains("on"),
    name: document.getElementById("cardname").textContent
  }));
  check(hov.hot && hov.card, "desktop: hover highlights a room + card shows (" + hov.name + ")");
  await p.screenshot({ path: path.join(__dirname, "lv2-hover.png") });
  check(errs.length === 0, "desktop: 0 errors" + (errs.length ? " -> " + errs.join(" | ") : ""));
  await p.close();

  // phone: pills visible, sheet opens
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const merrs = []; m.on("pageerror", e => merrs.push(e.message));
  await m.goto("http://localhost:8123/landing-v2.html", { waitUntil: "networkidle" });
  await m.waitForTimeout(900);
  const pills = await m.evaluate(() => [...document.querySelectorAll(".pill")].filter(x => getComputedStyle(x).display !== "none").length);
  check(pills === 6, "phone: 6 room pills visible (got " + pills + ")");
  await m.tap(".pill");
  await m.waitForTimeout(600);
  const sh = await m.evaluate(() => document.getElementById("sheet").classList.contains("on"));
  check(sh, "phone: tapping a pill opens the room sheet");
  await m.screenshot({ path: path.join(__dirname, "lv2-phone.png") });
  check(merrs.length === 0, "phone: 0 errors" + (merrs.length ? " -> " + merrs.join(" | ") : ""));
  await m.close();

  await b.close();
  console.log(fails === 0 ? "ALL GREEN" : fails + " FAILURES");
  process.exit(fails ? 1 : 0);
})();
