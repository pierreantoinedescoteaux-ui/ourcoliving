/* Round 18 QA: relay pin on the original scatter — each thought freezes on
   the line, moves on when the next arrives; no overlaps; line always held. */
const { chromium } = require("playwright-core");
const path = require("path");
const root = "file:///C:/Users/User/coliving-portfolio/";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  const errors = [];
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", e => errors.push("PAGEERROR: " + e.message));

  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);

  // walk the whole field; sample overlap + line-held at every step
  const walk = await page.evaluate(async () => {
    const bed = document.getElementById("fieldbed");
    const bedTop = bed.getBoundingClientRect().top + window.scrollY;
    const bedH = bed.getBoundingClientRect().height;
    const bubs = [...document.querySelectorAll(".bub")];
    let maxOverlaps = 0, worst = null, lineMisses = 0, samples = 0, maxVisible = 0;
    const marks = {};
    window.__shots = [];
    for (let y = bedTop - 400; y <= bedTop + bedH - 400; y += 200) {
      window.scrollTo({ top: y, behavior: "auto" });
      await new Promise(r => setTimeout(r, 90));
      const vis = bubs.filter(b => {
        const o = parseFloat(b.style.opacity || "1");
        const r = b.getBoundingClientRect();
        return o > 0.15 && r.bottom > 0 && r.top < innerHeight;
      });
      maxVisible = Math.max(maxVisible, vis.length);
      let ov = 0;
      const rs = vis.map(b => b.getBoundingClientRect());
      for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
        const ox = Math.min(rs[i].right, rs[j].right) - Math.max(rs[i].left, rs[j].left);
        const oy = Math.min(rs[i].bottom, rs[j].bottom) - Math.max(rs[i].top, rs[j].top);
        if (ox > 6 && oy > 6) { ov++; worst = { atScroll: Math.round(y - bedTop), ox: Math.round(ox), oy: Math.round(oy) }; }
      }
      maxOverlaps = Math.max(maxOverlaps, ov);
      // once anything has popped, the line should hold a thought
      const popped = document.querySelectorAll(".bub.pop").length;
      if (popped > 0 && popped < bubs.length) {
        samples++;
        const held = bubs.some(b => { const r = b.getBoundingClientRect(); return r.top > 60 && r.top < 420; });
        if (!held) lineMisses++;
      }
      const frac = (y - bedTop + 400) / bedH;
      for (const f of [0.22, 0.5, 0.78]) {
        if (!marks[f] && frac >= f) { marks[f] = true; window.__shots.push(y); }
      }
    }
    return {
      popped: document.querySelectorAll(".bub.pop").length,
      maxSimultaneousVisible: maxVisible, maxOverlaps, worst, lineMisses, samples,
      segs: document.querySelectorAll(".bvinesvg .seg").length,
      shots: window.__shots,
    };
  });
  console.log("RELAY WALK:", JSON.stringify(walk));

  // screenshots at the three saved depths
  const labels = ["r18-early.png", "r18-mid.png", "r18-late.png"];
  for (let k = 0; k < walk.shots.length && k < 3; k++) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: "auto" }), walk.shots[k]);
    await page.waitForTimeout(1300);
    await page.screenshot({ path: path.join(__dirname, labels[k]) });
    console.log("shot:", labels[k]);
  }

  // mobile: static column still pops
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.evaluate(async () => {
    const bed = document.getElementById("fieldbed");
    const end = bed.getBoundingClientRect().bottom + window.scrollY + 300;
    for (let y = 0; y <= end; y += 240) { window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 90)); }
  });
  await page.waitForTimeout(1000);
  console.log("MOBILE:", JSON.stringify(await page.evaluate(() => ({ popped: document.querySelectorAll(".bub.pop").length }))));

  console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "NO CONSOLE ERRORS");
  await browser.close();
})();
