/* shoot-backpill.js — verifies the "back to the tower" pill fix.
   Checks, at 390x844, on every page in PAGES, at scroll 0 / 150 / 600:
     1. pill has real width+height (getBoundingClientRect > 0), UNLESS it
        has legitimately retired (its band has scrolled fully past the nav)
     2. when visible, pill.top is at/below the nav's bottom edge (never
        hidden under the sticky nav)
     3. document.elementFromPoint(pill center) hits the pill itself (proves
        nothing else is painted on top of it)
     4. pill's rendered width/height is the same across every page (at rest)
   Run from inside _qa: `node shoot-backpill.js`
   Requires a server already running at BASE (default http://127.0.0.1:8123). */
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const BASE = (process.env.BASE || "http://127.0.0.1:8123").replace(/\/$/, "");
const OUT = path.join(__dirname, "backpill-shots");
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  "about.html", "story.html", "resources.html", "map.html",
  "work.html", "project.html?p=montreal", "talkpieces.html",
];
const SCROLLS = [0, 150, 600];

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });

  const restSizes = {}; // page -> {w,h} at scroll 0, for the "same size everywhere" check
  const allProblems = [];
  const allRows = [];

  for (const url of PAGES) {
    const page = await context.newPage();
    const jsErrors = [];
    page.on("pageerror", (e) => jsErrors.push(String(e).slice(0, 200)));
    page.on("console", (m) => { if (m.type() === "error") jsErrors.push(m.text().slice(0, 200)); });

    await page.goto(BASE + "/" + url, { waitUntil: "networkidle", timeout: 30000 });
    // let the world layer mount + navh sync settle
    await page.waitForTimeout(500);

    for (const y of SCROLLS) {
      await page.evaluate((sy) => window.scrollTo(0, sy), y);
      // let the scroll listener's rAF + retire transition settle
      await page.waitForTimeout(250);

      const data = await page.evaluate(() => {
        const nav = document.querySelector(".snav");
        const pill = document.querySelector(".wback");
        const band = document.querySelector(".wband");
        if (!nav || !pill) return { error: "nav or pill missing", navFound: !!nav, pillFound: !!pill };
        const navR = nav.getBoundingClientRect();
        const pillR = pill.getBoundingClientRect();
        const bandR = band ? band.getBoundingClientRect() : null;
        const cs = getComputedStyle(pill);
        const gone = pill.classList.contains("wgone");
        const style = { fontSize: cs.fontSize, paddingTop: cs.paddingTop, paddingLeft: cs.paddingLeft, minHeight: cs.minHeight, height: pillR.height };
        const cx = pillR.left + pillR.width / 2;
        const cy = pillR.top + pillR.height / 2;
        let hitSel = null, hitIsPill = false;
        if (pillR.width > 0 && pillR.height > 0) {
          const el = document.elementFromPoint(cx, cy);
          hitSel = el ? (el.tagName + (el.className ? "." + String(el.className).trim().split(/\s+/).join(".") : "")) : null;
          hitIsPill = !!(el && (el === pill || pill.contains(el) || (el.closest && el.closest(".wback") === pill)));
        }
        return {
          navFound: true, pillFound: true,
          navBottom: navR.bottom,
          pill: { top: pillR.top, left: pillR.left, width: pillR.width, height: pillR.height, bottom: pillR.bottom },
          bandBottom: bandR ? bandR.bottom : null,
          gone, visibility: cs.visibility, opacity: cs.opacity, pointerEvents: cs.pointerEvents,
          scrollY: window.scrollY,
          hitSel, hitIsPill, style,
        };
      });

      const shotName = `${url.split("?")[0].replace(".html", "")}_${y}.png`;
      await page.screenshot({ path: path.join(OUT, shotName) });

      const row = { url, scrollY: y, data };
      allRows.push(row);

      if (data.error) { allProblems.push(`${url}@${y}: ${data.error}`); continue; }

      const visible = data.pill.width > 0 && data.pill.height > 0 &&
        data.visibility !== "hidden" && parseFloat(data.opacity) > 0;

      if (!data.gone) {
        // pill claims to still be active — it MUST be genuinely visible, below the nav, and hit-testable.
        if (!visible) allProblems.push(`${url}@scroll${y}: pill not gone but not visible (w=${data.pill.width} h=${data.pill.height} vis=${data.visibility} op=${data.opacity})`);
        if (visible && data.pill.top < data.navBottom - 0.5) allProblems.push(`${url}@scroll${y}: pill top(${data.pill.top.toFixed(1)}) is ABOVE nav bottom(${data.navBottom.toFixed(1)}) — hidden under nav`);
        if (visible && !data.hitIsPill) allProblems.push(`${url}@scroll${y}: hit-test at pill center landed on "${data.hitSel}", not the pill`);
        if (visible && data.pill.height < 44) allProblems.push(`${url}@scroll${y}: pill height ${data.pill.height.toFixed(1)}px is under the 44px tap floor`);
        if (y === 0) restSizes[url] = { w: Math.round(data.pill.width), h: Math.round(data.pill.height), style: data.style };
      } else {
        // retired: should NOT be hit-testable / should not visually intrude
        if (data.pointerEvents !== "none") allProblems.push(`${url}@scroll${y}: pill is .wgone but pointer-events is "${data.pointerEvents}" (should be none)`);
      }
    }

    if (jsErrors.length) allProblems.push(`${url}: JS errors: ${jsErrors.join(" | ")}`);
    await page.close();
  }

  await browser.close();

  console.log("\n===== PER-SCROLL RESULTS =====");
  for (const r of allRows) {
    const d = r.data;
    if (d.error) { console.log(`${r.url} @${r.scrollY}: ERROR ${d.error}`); continue; }
    console.log(
      `${r.url.padEnd(24)} scroll=${String(r.scrollY).padEnd(4)} gone=${String(d.gone).padEnd(5)} ` +
      `pillTop=${d.pill.top.toFixed(1).padEnd(7)} navBottom=${d.navBottom.toFixed(1).padEnd(7)} ` +
      `w=${d.pill.width.toFixed(1)} h=${d.pill.height.toFixed(1)} hit=${d.hitIsPill}`
    );
  }

  console.log("\n===== SIZE UNIFORMITY (at rest, scroll=0, while active) =====");
  console.log("(width legitimately varies with label text — \"the homes\" vs \"the commons\" vs \"the lookout\" vs \"the library\" — the pill is shrink-to-fit. Height/font-size/padding must match.)");
  const sizes = Object.entries(restSizes);
  console.log(JSON.stringify(restSizes, null, 2));
  if (sizes.length > 1) {
    const firstH = sizes[0][1].h;
    const firstStyle = JSON.stringify(sizes[0][1].style);
    for (const [url, s] of sizes) {
      if (Math.abs(s.h - firstH) > 1) {
        allProblems.push(`HEIGHT MISMATCH: ${url} is ${s.h}px tall, expected ~${firstH}px (like ${sizes[0][0]})`);
      }
      if (JSON.stringify(s.style) !== firstStyle) {
        allProblems.push(`STYLE MISMATCH: ${url} computed style ${JSON.stringify(s.style)} != ${firstStyle} (${sizes[0][0]})`);
      }
    }
  }

  console.log("\n===== PROBLEMS =====");
  if (allProblems.length) {
    allProblems.forEach((p) => console.log("  FAIL: " + p));
    console.log(`\n${allProblems.length} problem(s) found.`);
    process.exitCode = 1;
  } else {
    console.log("  none — all checks passed.");
  }
  console.log("\nScreenshots -> " + OUT);
})();
