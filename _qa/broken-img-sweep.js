/* Site-wide broken-image sweep: loads each main page (+ a couple of param variants),
   scrolls to trigger lazy content, reports every <img> that failed to load. */
const { chromium } = require("playwright-core");
const root = "file:///C:/Users/User/coliving-portfolio/";
const pages = [
  "index.html","manifesto.html","resources.html","about.html","story.html",
  "design.html","work.html","project.html?p=montreal","map.html",
  "type.html?t=intergenerational","why.html","hope.html","talkpieces.html",
  "designers.html","themes.html","inspiration.html","credits.html",
];
(async () => {
  const b = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  for (const url of pages) {
    await p.goto(root + url, { waitUntil: "networkidle" }).catch(()=>{});
    await p.evaluate(async () => { const h=document.body.scrollHeight; for(let y=0;y<=h;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,40));} window.scrollTo(0,0); });
    await p.waitForTimeout(500);
    const broken = await p.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter(i => i.complete && i.naturalWidth === 0)
        .map(i => i.getAttribute("src")));
    console.log((broken.length? "BROKEN "+broken.length : "clean").padEnd(10), url, broken.length? "-> "+[...new Set(broken)].join(", "):"" );
  }
  await b.close();
})();
