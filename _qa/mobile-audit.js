/* Mobile audit: loads each page at phone size, reports mechanical issues as JSON +
   takes full-page screenshots. Usage: node mobile-audit.js [rootDir] [outDir]
   Defaults: root = the mobile worktree, out = <root>/_qa/mshots */
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const rootDir = process.argv[2] || "C:/Users/User/AppData/Local/Temp/claude/C--Users-User/de49b17c-1549-485c-95b7-990a8f982b8b/scratchpad/mobile-wt";
const outDir = process.argv[3] || path.join(rootDir, "_qa", "mshots");
const root = "file:///" + rootDir.replace(/\\/g, "/") + "/";
fs.mkdirSync(outDir, { recursive: true });

// index.html + tower.html excluded (scroll landing owns its own mobile)
const pages = [
  "story.html", "work.html", "design.html", "project.html?p=montreal", "why.html",
  "map.html", "type.html?t=intergenerational", "manifesto.html", "hope.html",
  "about.html", "resources.html", "talkpieces.html", "designers.html",
  "themes.html", "inspiration.html", "separation.html", "credits.html",
  "detail.html?item=rooral",
];

const VW = 390, VH = 844;

(async () => {
  const b = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  const report = {};
  for (const url of pages) {
    const p = await b.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const errors = [];
    p.on("pageerror", e => errors.push(String(e).slice(0, 200)));
    p.on("console", m => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
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

    const data = await p.evaluate((VW2) => {
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

      // tiny text
      let tinyCount = 0; const tinySamples = new Set();
      for (const el of document.querySelectorAll("body *")) {
        if (!el.childNodes.length) continue;
        const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 3);
        if (!hasText) continue;
        const fs2 = parseFloat(getComputedStyle(el).fontSize);
        if (fs2 && fs2 < 11) { tinyCount++; if (tinySamples.size < 8) tinySamples.add(sel(el) + "@" + fs2.toFixed(1)); } // 11px = the design floor for micro-labels (MOBILE-RULES.md)
      }
      out.tinyText = { count: tinyCount, samples: [...tinySamples] };

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
    }, VW);

    data.jsErrors = [...new Set(errors)].slice(0, 5);
    report[url] = data;

    const shot = path.join(outDir, url.replace(/\.html.*/, "") + ".png");
    await p.screenshot({ path: shot, fullPage: true }).catch(e => { data.shotError = e.message.slice(0, 80); });
    const flag = (data.docOverflowX > 8 ? "OVF" : "   ") + (data.mobileRuleCount === 0 ? " NOMQ" : "     ") + (data.jsErrors.length ? " ERR" : "");
    console.log(flag.padEnd(12), url.padEnd(34), "ovfX=" + data.docOverflowX, "imgs=" + data.imgIssues.length, "tiny=" + data.tinyText.count, "mq=" + data.mobileRuleCount, "h=" + data.pageHeight);
    await p.close();
  }
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 1));
  console.log("\nreport -> " + path.join(outDir, "report.json"));
  await b.close();
})();
