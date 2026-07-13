/* Full-site review sweep: every page — console errors, broken internal
   links, missing images, nav/footer presence — plus full-page screenshots. */
const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const SITE = "C:/Users/User/coliving-portfolio";
const root = "file:///" + SITE + "/";

const PAGES = [
  "index.html", "manifesto.html", "map.html", "type.html?t=cohousing",
  "design.html", "about.html", "story.html", "work.html", "project.html?item=montreal",
  "projects.html", "resources.html", "separation.html", "inspiration.html",
  "detail.html?item=everyday-utopia",
  "talkpieces.html", "designers.html", "themes.html",
];

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  const report = {};
  let errors = [];
  page.on("console", m => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); });
  page.on("pageerror", e => errors.push("PAGEERROR: " + e.message.slice(0, 160)));

  for (const p of PAGES) {
    errors = [];
    const name = p.split("?")[0];
    await page.goto(root + p, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(1600);
    // trigger lazy content
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 700) {
        window.scrollTo({ top: y, behavior: "auto" });
        await new Promise(r => setTimeout(r, 60));
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    await page.waitForTimeout(600);
    const data = await page.evaluate(() => {
      const links = [...document.querySelectorAll("a[href]")].map(a => a.getAttribute("href"))
        .filter(h => h && !h.startsWith("http") && !h.startsWith("mailto:") && !h.startsWith("#"));
      const imgs = [...document.querySelectorAll("img")].map(i => i.getAttribute("src")).filter(s => s && !s.startsWith("data:") && !s.startsWith("http"));
      const brokenImgs = [...document.querySelectorAll("img")].filter(i => i.complete && i.naturalWidth === 0 && !(i.getAttribute("src") || "").startsWith("http")).map(i => i.getAttribute("src"));
      return {
        title: document.title,
        hasNav: !!document.querySelector(".snav, nav, [data-sitenav] *"),
        hasFooter: !!document.querySelector("footer, .sfoot"),
        links: [...new Set(links)],
        imgCount: imgs.length,
        brokenImgs: [...new Set(brokenImgs)],
        editMarkers: (document.body.innerText.match(/\[edit[^\]]*\]/gi) || []).length,
        h1: (document.querySelector("h1") || {}).innerText || "(none)",
      };
    });
    // verify link targets + img files exist on disk
    const badLinks = data.links.filter(h => {
      const f = h.split("?")[0].split("#")[0];
      return f && !fs.existsSync(path.join(SITE, f));
    });
    report[p] = {
      title: data.title, h1: data.h1.slice(0, 60), nav: data.hasNav, footer: data.hasFooter,
      links: data.links.length, badLinks, imgs: data.imgCount, brokenImgs: data.brokenImgs,
      editMarkers: data.editMarkers, jsErrors: [...new Set(errors)],
    };
    await page.screenshot({ path: path.join(__dirname, "review-" + name.replace(".html", "") + ".png"), fullPage: true });
    console.log("done:", p);
  }
  fs.writeFileSync(path.join(__dirname, "site-review.json"), JSON.stringify(report, null, 1));
  console.log("REPORT written to site-review.json");
  await browser.close();
})();
