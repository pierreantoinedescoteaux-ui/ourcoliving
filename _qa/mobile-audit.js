/* Mobile audit: loads each page at phone size, reports mechanical issues as JSON +
   takes full-page screenshots. Usage: node mobile-audit.js [rootDir] [outDir]
   Defaults: root = the mobile worktree, out = <root>/_qa/mshots */
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

// 2026-07-30: the default root used to be a temp worktree that no longer
// exists, so a plain `node mobile-audit.js` audited nothing. It is the repo now.
const argv = process.argv.slice(2).filter(a => a.indexOf("--") !== 0);
const rootDir = argv[0] || path.resolve(__dirname, "..");
const outDir = argv[1] || path.join(rootDir, "_qa", "mshots");
// The landing fetches its clips as blobs, which is dead on file://, so set
// BASE=http://127.0.0.1:8123 (serve the repo) to include the homepage.
const BASE = process.env.BASE;
const root = BASE ? BASE.replace(/\/$/, "") + "/" : "file:///" + rootDir.replace(/\\/g, "/") + "/";
fs.mkdirSync(outDir, { recursive: true });

// tower.html is the retired climb, kept for reference, not audited.
// index.html IS audited when a BASE url is given — it is the homepage and the
// page most visitors see on a phone, and leaving it out is exactly how five of
// its seven text elements ended up under the floor (P-A, 2026-07-30).
const pages = [
  "story.html", "work.html", "design.html", "project.html?p=montreal", "why.html",
  "map.html", "type.html?t=intergenerational", "manifesto.html", "hope.html",
  "about.html", "resources.html", "talkpieces.html", "designers.html",
  "themes.html", "inspiration.html", "separation.html", "credits.html",
  "detail.html?item=rooral",
].concat(BASE ? ["index.html"] : []);

// MOBILE-RULES.md v2. These are the numbers the site is built to; the audit
// used to warn at a stale 11px and never failed the run, so nothing enforced
// them. Breaching one is now an error with a non-zero exit code.
const FLOOR_READING = 16;   // anything carrying a sentence
const FLOOR_MICRO   = 12;   // kickers, eyebrows, tags, chips
const FLOOR_TAP     = 44;   // links and buttons
const SENTENCE = 40;        // chars of text: the reading-vs-label proxy

const VW = 390, VH = 844;

(async () => {
  const b = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  const report = {};
  const failures = [];
  for (const url of pages) {
    const p = await b.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const errors = [];
    /* the engine pauses a loop mid-play as it scrolls out of view; the browser
       reports the abandoned play() as an error. Harmless, and already treated
       as noise by shoot-lv3.js. */
    const BENIGN = /play\(\) request was interrupted/;
    p.on("pageerror", e => { if (!BENIGN.test(String(e))) errors.push(String(e).slice(0, 200)); });
    p.on("console", m => { if (m.type() === "error" && !BENIGN.test(m.text())) errors.push(m.text().slice(0, 200)); });
    await p.goto(root + url, { waitUntil: "networkidle", timeout: 30000 }).catch(e => errors.push("NAV: " + e.message.slice(0, 100)));
    // scroll through to trigger lazy/reveal content
    await p.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    // capture aid: force scroll-reveal state so fullPage shots show all content
    // (reveals verified to fire at human scroll speed — _qa/reveal-test.js;
    // fullPage capture can still race the transition, so neutralise it here)
    await p.addStyleTag({ content: ".reveal{opacity:1!important;transform:none!important;transition:none!important}" });
    // capture aid: force lazy images to load so fullPage shots include them
    await p.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = "eager"; }));
    await p.waitForTimeout(900);

    const data = await p.evaluate(({ VW2, FLOOR_MICRO, FLOOR_READING, FLOOR_TAP, SENTENCE }) => {
      const sel = el => {
        let s = el.tagName.toLowerCase();
        if (el.id) s += "#" + el.id;
        else if (el.className && typeof el.className === "string") s += "." + el.className.trim().split(/\s+/).slice(0, 2).join(".");
        return s;
      };
      const vw = document.documentElement.clientWidth;
      const out = {};
      out.viewportMeta = !!document.querySelector('meta[name="viewport"]');
      out.docOverflowX = Math.max(0, document.documentElement.scrollWidth - vw);

      // elements poking outside the viewport horizontally
      const off = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const st = getComputedStyle(el);
        if (st.position === "fixed") continue;
        // skip elements clipped by a scrolling/hidden ancestor (carousel slides,
        // the world-band's intentional bleed, the guide rail) — they can't cause
        // page scroll; docOverflowX is the truth for that
        let clipped = false, a = el.parentElement;
        while (a && a !== document.body) {
          const ao = getComputedStyle(a).overflowX;
          if (ao === "hidden" || ao === "auto" || ao === "scroll" || ao === "clip") { clipped = true; break; }
          a = a.parentElement;
        }
        if (clipped) continue;
        // only leaf-ish offenders (avoid reporting every ancestor)
        if ((r.right > vw + 8 || r.left < -8) && el.children.length < 6) {
          off.push({ sel: sel(el), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width), txt: (el.textContent || "").trim().slice(0, 40) });
          if (off.length >= 12) break;
        }
      }
      out.overflowEls = off;

      // image problems
      const imgIssues = [];
      for (const im of document.querySelectorAll("img")) {
        const r = im.getBoundingClientRect();
        if (r.width === 0) continue;
        const relH = r.height / window.innerHeight;
        if (relH > 0.85) imgIssues.push({ sel: sel(im), src: (im.getAttribute("src") || "").split("/").pop(), issue: "too-tall", h: Math.round(r.height) });
        else if (r.width < 90 && im.naturalWidth > 400) imgIssues.push({ sel: sel(im), src: (im.getAttribute("src") || "").split("/").pop(), issue: "tiny-render", w: Math.round(r.width) });
        if (imgIssues.length >= 15) break;
      }
      out.imgIssues = imgIssues;

      // ---- type floors (MOBILE-RULES.md v2) ----
      // Two floors, because the site has two kinds of text. A kicker may be
      // 12px; a sentence may not. Length of the element's own text is the
      // proxy: labels are short, reading content is not.
      const micro = [], reading = [];
      const seenText = new Set();
      for (const el of document.querySelectorAll("body *")) {
        if (!el.childNodes.length) continue;
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(" ").trim();
        if (own.length < 4) continue;
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;               // not rendered at all
        const fs2 = parseFloat(cs.fontSize);
        if (!fs2) continue;
        // .edit — P-A's own authoring markers, deliberately faint, removed
        // with his copy pass. Making them louder would be backwards. This one
        // is exempt from both floors; it is not site copy at all.
        if (el.classList.contains("edit")) continue;
        // CREDIT LINES. Long enough to trip the sentence proxy, but nobody
        // sits and reads a byline — they are eyebrows, which MOBILE-RULES
        // puts at the 12px label floor. They are still held to THAT floor:
        // the exemption is from the reading check only, not from both.
        //   .mby           the copyright strip in the footer
        //   .lv3-eyebrow   the landing's byline, which on a phone moves to
        //                  the top-right sky at 12px (P-A, 2026-07-31)
        //   .hero-cap      the photo caption under a case study's hero image
        //                  ("The main living room, exposed brick..."). It is
        //                  a caption, the same species as a credit, and it
        //                  is italic and faint on purpose. Held to 12px.
        const CREDITISH = ["mby", "lv3-eyebrow", "hero-cap"];
        const isCredit = CREDITISH.some(c => el.classList.contains(c)) ||
                         (el.parentElement && CREDITISH.some(c => el.parentElement.classList.contains(c)));
        const key = sel(el) + "@" + fs2.toFixed(1);
        if (seenText.has(key)) continue;
        seenText.add(key);
        if (fs2 < FLOOR_MICRO) micro.push({ sel: sel(el), px: +fs2.toFixed(1), text: own.slice(0, 44) });
        else if (!isCredit && own.length >= SENTENCE && fs2 < FLOOR_READING) reading.push({ sel: sel(el), px: +fs2.toFixed(1), text: own.slice(0, 44) });
      }
      out.belowMicroFloor = micro.slice(0, 10);
      out.belowReadingFloor = reading.slice(0, 10);

      // ---- tap targets ----
      const smallTaps = [];
      for (const el of document.querySelectorAll("a[href], button, [role=button], input, select")) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.pointerEvents === "none") continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        // an inline link inside a paragraph is not a tap target in its own right
        if (el.tagName === "A" && cs.display.indexOf("inline") === 0 && el.closest("p,li,blockquote")) continue;
        if (r.height < FLOOR_TAP) smallTaps.push({ sel: sel(el), h: Math.round(r.height), text: (el.textContent || "").trim().slice(0, 30) });
        if (smallTaps.length >= 10) break;
      }
      out.smallTaps = smallTaps;

      // does the page ship any mobile media rules?
      let mobileRules = 0;
      for (const sh of document.styleSheets) {
        let rules; try { rules = sh.cssRules; } catch { continue; }
        if (!rules) continue;
        for (const r of rules) {
          if (r.media && /max-width:\s*(3\d\d|4\d\d|5\d\d|6\d\d|7\d\d|8[0-2]\d)px/.test(r.media.mediaText)) mobileRules += r.cssRules ? r.cssRules.length : 1;
        }
      }
      out.mobileRuleCount = mobileRules;

      out.pageHeight = document.body.scrollHeight;
      return out;
    }, { VW2: VW, FLOOR_MICRO, FLOOR_READING, FLOOR_TAP, SENTENCE });

    data.jsErrors = [...new Set(errors)].slice(0, 5);
    report[url] = data;

    const shot = path.join(outDir, url.replace(/\.html.*/, "") + ".png");
    await p.screenshot({ path: shot, fullPage: true }).catch(e => { data.shotError = e.message.slice(0, 80); });
    const micro = data.belowMicroFloor.length, reading = data.belowReadingFloor.length, taps = data.smallTaps.length;
    const bad = data.docOverflowX > 8 || micro || reading || taps || data.jsErrors.length;
    if (bad) failures.push({ url, micro: data.belowMicroFloor, reading: data.belowReadingFloor, taps: data.smallTaps, ovf: data.docOverflowX, errs: data.jsErrors });
    const flag = (data.docOverflowX > 8 ? "OVF" : "   ") + (data.mobileRuleCount === 0 ? " NOMQ" : "     ") + (data.jsErrors.length ? " ERR" : "");
    console.log(flag.padEnd(12), url.padEnd(34),
      "ovfX=" + data.docOverflowX, "imgs=" + data.imgIssues.length,
      "under12=" + micro, "under16=" + reading, "taps<44=" + taps,
      "mq=" + data.mobileRuleCount, "h=" + data.pageHeight);
    await p.close();
  }
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 1));
  console.log("\nreport -> " + path.join(outDir, "report.json"));
  await b.close();

  /* THE GATE. Until 2026-07-30 this script printed its findings and exited 0,
     which is why the homepage could ship five text elements under the floor
     without anyone noticing.

     Turning it on found breaches on 14 interior pages, built up over months
     of rounds. Fixing all of them at once would restyle half the site with
     nobody looking, so they are recorded in mobile-baseline.json as a known
     debt: the run PASSES on them, FAILS on anything new, and prints the debt
     every time so it cannot quietly become permanent.

     To clear an item: fix the page, then `node mobile-audit.js --rebaseline`.
     The baseline may only ever shrink. index.html is never baselined — the
     homepage holds the floors outright. */
  const BASELINE_FILE = path.join(__dirname, "mobile-baseline.json");
  const REBASELINE = process.argv.includes("--rebaseline");
  const NEVER_BASELINE = ["index.html"];
  const fingerprint = f => [].concat(
    f.micro.map(x => "micro|" + x.sel + "|" + x.px),
    f.reading.map(x => "reading|" + x.sel + "|" + x.px),
    f.taps.map(x => "tap|" + x.sel + "|" + x.h),
    f.ovf > 8 ? ["ovf|" + f.ovf] : [],
    f.errs.map(x => "err|" + x.slice(0, 60))
  );

  if (REBASELINE) {
    const base = {};
    failures.filter(f => NEVER_BASELINE.indexOf(f.url) < 0).forEach(f => { base[f.url] = fingerprint(f); });
    fs.writeFileSync(BASELINE_FILE, JSON.stringify(base, null, 1));
    const n = Object.values(base).reduce((a, x) => a + x.length, 0);
    console.log("\nBaseline rewritten: " + n + " known breaches on " + Object.keys(base).length + " pages.");
    console.log(BASELINE_FILE);
    return;
  }

  let baseline = {};
  try { baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, "utf8")); } catch (e) { /* first run */ }

  const fresh = [];
  let carried = 0;
  for (const f of failures) {
    const known = NEVER_BASELINE.indexOf(f.url) < 0 ? (baseline[f.url] || []) : [];
    const now = fingerprint(f);
    const newOnes = now.filter(x => known.indexOf(x) < 0);
    carried += now.length - newOnes.length;
    if (newOnes.length) fresh.push({ url: f.url, items: newOnes, f });
  }

  if (carried) {
    console.log("\n" + carried + " known breaches carried in mobile-baseline.json (older pages, not fixed today).");
    console.log("They are listed in that file. Fix a page, then re-run with --rebaseline to clear it.");
  }

  if (fresh.length) {
    console.log("\n===== NEW MOBILE-RULES BREACHES on " + fresh.length + " page(s) =====");
    for (const n of fresh) {
      console.log("\n" + n.url);
      n.f.micro.forEach(x => { if (n.items.indexOf("micro|" + x.sel + "|" + x.px) > -1) console.log("   under the " + FLOOR_MICRO + "px label floor: " + x.sel + " @" + x.px + "px  \"" + x.text + "\""); });
      n.f.reading.forEach(x => { if (n.items.indexOf("reading|" + x.sel + "|" + x.px) > -1) console.log("   under the " + FLOOR_READING + "px reading floor: " + x.sel + " @" + x.px + "px  \"" + x.text + "\""); });
      n.f.taps.forEach(x => { if (n.items.indexOf("tap|" + x.sel + "|" + x.h) > -1) console.log("   tap target under " + FLOOR_TAP + "px: " + x.sel + " " + x.h + "px  \"" + x.text + "\""); });
      n.f.errs.forEach(x => console.log("   js error: " + x));
    }
    console.log("\nThe numbers live in MOBILE-RULES.md. Fix the page, do not lower the floor.");
    process.exit(1);
  }
  console.log("\nNo new breaches. " + pages.length + " pages checked.");
})();
