/* QA for the rebuilt Work page: 4 themes, WIP cards non-clickable, house cards
   link to project.html, empty folders -> placeholders, 0 broken imgs, 0 errors. */
const { chromium } = require("playwright-core");
const path = require("path");
const root = "file:///C:/Users/User/coliving-portfolio/";
(async () => {
  const b = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = [];
  p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  p.on("pageerror", e => errs.push("PAGEERROR: " + e.message));

  await p.goto(root + "work.html", { waitUntil: "networkidle" });
  await p.evaluate(async () => { const h=document.body.scrollHeight; for(let y=0;y<=h;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));} window.scrollTo(0,0); });
  await p.waitForTimeout(600);

  const info = await p.evaluate(() => ({
    themes: [...document.querySelectorAll(".theme .theme-head h2")].map(h => h.textContent),
    jumpLinks: document.querySelectorAll(".jump a").length,
    wipCards: document.querySelectorAll("div.exp-card").length,           // non-clickable
    linkCards: document.querySelectorAll("a.exp-card").length,            // clickable houses
    houseLinks: [...document.querySelectorAll("a.exp-card")].map(a => a.getAttribute("href")),
    wipTags: document.querySelectorAll(".wip-tag").length,
    placeholders: document.querySelectorAll(".exp-media .ph").length,
    heroImgs: document.querySelectorAll(".exp-media img").length,
    brokenImgs: [...document.querySelectorAll("img")].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute("src")),
  }));
  console.log(JSON.stringify(info, null, 1));

  await p.screenshot({ path: path.join(__dirname, "work-themes-full.png"), fullPage: true });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto(root + "work.html", { waitUntil: "networkidle" });
  await p.evaluate(async () => { const h=document.body.scrollHeight; for(let y=0;y<=h;y+=400){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,30));} window.scrollTo(0,0); });
  await p.waitForTimeout(400);
  const mob = await p.evaluate(() => [...document.querySelectorAll("img")].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute("src")));
  await p.screenshot({ path: path.join(__dirname, "work-themes-mobile.png"), fullPage: true });

  const pass = info.themes.length === 4 && info.linkCards === 3 &&
    info.houseLinks.every(h => h && h.startsWith("project.html?p=")) &&
    info.brokenImgs.length === 0 && mob.length === 0 && errs.length === 0;
  console.log("mobile broken:", JSON.stringify(mob));
  console.log(errs.length ? "ERRORS: " + errs.join("; ") : "no console/page errors");
  console.log(pass ? "\nRESULT: PASS" : "\nRESULT: FAIL");
  await b.close();
})();
