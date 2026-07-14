/* viewport-sweep.js — small-screen problem REPORT only, no fixes.
   Visits all main pages at 1366x768 and 1280x620.
   Logs JSON metrics per page+viewport, screenshots on any nonzero metric,
   writes _qa/RESIZE-REPORT.md. */
const { chromium } = require("playwright-core");
const path = require("path");
const fs = require("fs");
const root = "file:///C:/Users/User/coliving-portfolio/";

const PAGES = [
  { slug: "index",       file: "index.html" },
  { slug: "manifesto",   file: "manifesto.html" },
  { slug: "map",         file: "map.html" },
  { slug: "type",        file: "type.html?t=cohousing" },
  { slug: "design",      file: "design.html" },
  { slug: "projects",    file: "projects.html" },
  { slug: "inspiration", file: "inspiration.html" },
  { slug: "resources",   file: "resources.html" },
  { slug: "themes",      file: "themes.html" },
  { slug: "talkpieces",  file: "talkpieces.html" },
  { slug: "designers",   file: "designers.html" },
  { slug: "separation",  file: "separation.html" },
  { slug: "about",       file: "about.html" },
  { slug: "story",       file: "story.html" },
  { slug: "work",        file: "work.html" },
];

const VIEWPORTS = [
  { width: 1366, height: 768,  label: "1366x768" },
  { width: 1280, height: 620,  label: "1280x620" },
];

async function measurePage(page, vp) {
  return page.evaluate((vh) => {
    const iw = window.innerWidth;

    // hscroll
    const hscroll = document.documentElement.scrollWidth > iw + 4;

    // bigImgs
    const bigImgs = [...document.querySelectorAll("img")]
      .filter(img => {
        const r = img.getBoundingClientRect();
        return r.height > vh * 0.85;
      }).length;

    // offscreen (content selectors)
    const offscreenSels = "img, h1, .pcard, .book, .bub, .door, .rcard, section";
    const offscreen = [...document.querySelectorAll(offscreenSels)]
      .filter(el => {
        const r = el.getBoundingClientRect();
        return r.right > iw + 8 || r.left < -8;
      }).length;

    // overlapPairs — direct children of body-level sections that are cards
    const cardSels = [".pcard", ".book", ".rcard", ".door", ".bub"];
    const cards = [...document.querySelectorAll(cardSels.join(", "))].filter(el => {
      // must be a direct child of a section or body
      const p = el.parentElement;
      return p && (p.tagName === "SECTION" || p.tagName === "BODY" ||
                   p.tagName === "ARTICLE" || p.tagName === "MAIN");
    });
    const rects = cards.map(el => el.getBoundingClientRect());
    let overlapPairs = 0;
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i], b = rects[j];
        const xOverlap = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const yOverlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (xOverlap > 6 && yOverlap > 6) overlapPairs++;
      }
    }

    return { hscroll, bigImgs, offscreen, overlapPairs };
  }, vp.height);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });

  // results[slug][vpLabel] = metrics
  const results = {};

  for (const pg of PAGES) {
    results[pg.slug] = {};
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const bpage = await ctx.newPage();

      const url = root + pg.file;
      await bpage.goto(url, { waitUntil: "networkidle" }).catch(() => {});
      await bpage.waitForTimeout(900);

      // scroll-through: steps of 400px, 60ms, back to top
      await bpage.evaluate(async () => {
        const totalH = document.documentElement.scrollHeight;
        for (let y = 0; y <= totalH; y += 400) {
          window.scrollTo({ top: y, behavior: "auto" });
          await new Promise(r => setTimeout(r, 60));
        }
        window.scrollTo({ top: 0, behavior: "auto" });
      });
      await bpage.waitForTimeout(200);

      const metrics = await measurePage(bpage, vp);
      results[pg.slug][vp.label] = metrics;

      const anyNonzero = metrics.hscroll || metrics.bigImgs > 0 ||
                         metrics.offscreen > 0 || metrics.overlapPairs > 0;

      console.log(`[${vp.label}] ${pg.slug}:`, JSON.stringify(metrics));

      // screenshot only for 1280x620 when any metric nonzero
      if (anyNonzero && vp.width === 1280) {
        const shotName = `sweep-${pg.slug}-620.png`;
        await bpage.screenshot({
          path: path.join(__dirname, shotName),
          fullPage: false,
        });
        console.log("  → screenshot:", shotName);
      }

      await ctx.close();
    }
  }

  await browser.close();

  // ---- build RESIZE-REPORT.md ----
  const lines = [];

  // worst offenders: hscroll OR bigImgs>0 OR overlapPairs>0
  const worstSet = new Set();
  for (const pg of PAGES) {
    for (const vp of VIEWPORTS) {
      const m = results[pg.slug][vp.label];
      if (m.hscroll || m.bigImgs > 0 || m.overlapPairs > 0) {
        const symptoms = [];
        if (m.hscroll) symptoms.push("hscroll");
        if (m.bigImgs > 0) symptoms.push(`bigImgs=${m.bigImgs}`);
        if (m.overlapPairs > 0) symptoms.push(`overlapPairs=${m.overlapPairs}`);
        worstSet.add(`- **${pg.slug}** @ ${vp.label}: ${symptoms.join(", ")}`);
      }
    }
  }

  lines.push("# Resize Report — Small-Screen Problem Sweep");
  lines.push("");
  lines.push("## Worst Offenders");
  lines.push("Pages with hscroll, bigImgs>0, or overlapPairs>0:");
  lines.push("");
  if (worstSet.size === 0) {
    lines.push("_None — all metrics clean._");
  } else {
    for (const entry of worstSet) lines.push(entry);
  }
  lines.push("");
  lines.push("## Metrics Table");
  lines.push("");

  // header
  const vpLabels = VIEWPORTS.map(v => v.label);
  // columns: page | per-vp: hscroll | bigImgs | offscreen | overlapPairs
  const headerCols = ["page", ...vpLabels.flatMap(l => [
    `${l} hscroll`, `${l} bigImgs`, `${l} offscreen`, `${l} overlapPairs`
  ])];
  lines.push("| " + headerCols.join(" | ") + " |");
  lines.push("| " + headerCols.map(() => "---").join(" | ") + " |");

  for (const pg of PAGES) {
    const cols = [pg.slug];
    for (const vp of VIEWPORTS) {
      const m = results[pg.slug][vp.label];
      cols.push(m.hscroll ? "YES" : "no");
      cols.push(String(m.bigImgs));
      cols.push(String(m.offscreen));
      cols.push(String(m.overlapPairs));
    }
    lines.push("| " + cols.join(" | ") + " |");
  }

  lines.push("");
  lines.push("_Generated by `_qa/viewport-sweep.js` — report only, no fixes applied._");

  const reportPath = path.join(__dirname, "RESIZE-REPORT.md");
  fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
  console.log("\nReport written:", reportPath);
})();
