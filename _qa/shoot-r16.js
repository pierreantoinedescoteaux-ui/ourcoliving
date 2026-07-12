/* Round 16 QA: 5 hero swaps, field-guide restructure (featured "See it in action"
   + "Other examples"), themes rename, seamless infinite carousel. */
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

  async function reveal() {
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y <= h; y += 400) { window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 70)); }
      window.scrollTo({ top: 0, behavior: "auto" });
    });
    await page.waitForTimeout(500);
  }
  async function shoot(url, name, opts = {}) {
    await page.goto(root + url, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(1100);
    await reveal();
    if (opts.click) { await page.click(opts.click).catch(e => console.log("click fail", e.message)); await page.waitForTimeout(1200); }
    if (opts.scrollModalTo) { await page.evaluate(y => { const m = document.getElementById("modal"); if (m) m.scrollTop = m.scrollHeight * y; }, opts.scrollModalTo); await page.waitForTimeout(600); }
    await page.screenshot({ path: path.join(__dirname, name), fullPage: !opts.viewportOnly });
    console.log("shot:", name);
  }

  // --- Field guides: the 5 hero swaps + restructure ---
  for (const t of ["ecovillage", "cohousing", "housing-coop", "hacker-house", "rural-coliving"]) {
    await shoot("type.html?t=" + t, "r16-type-" + t + ".png");
  }

  // Structure assertions on one guide
  await page.goto(root + "type.html?t=cohousing", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const struct = await page.evaluate(() => {
    const txt = s => (document.querySelector(s)?.textContent || "").trim();
    const order = [...document.querySelectorAll("#main > .themes, #main > .feat, #main > .fnotes, #main > .exs")]
      .map(e => e.className.split(" ")[0]);
    return {
      themesLabel: txt(".themes .k"),
      hasFeatured: !!document.querySelector(".feat .featcard"),
      featHasImg: !!document.querySelector(".feat .featimg img"),
      featName: txt(".feat .featcap .fn"),
      featLink: document.querySelector(".feat .featcard")?.getAttribute("href"),
      exsLabel: txt(".exs .k"),
      otherCount: document.querySelectorAll(".exgrid .ex").length,
      order,
    };
  });
  console.log("STRUCT:", JSON.stringify(struct, null, 2));

  // --- Atlas: carousel + popup showing featured/other ---
  await shoot("map.html", "r16-atlas-full.png");
  await shoot("map.html", "r16-atlas-popup.png", { click: '.node[data-slug="ecovillage"]', viewportOnly: true });
  await shoot("map.html", "r16-atlas-popup-mid.png", { click: '.node[data-slug="ecovillage"]', viewportOnly: true, scrollModalTo: 0.55 });

  // --- Infinite carousel test ---
  await page.goto(root + "map.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const caro = await page.evaluate(async () => {
    const track = document.getElementById("caroTrack");
    const next = document.getElementById("caroNext");
    const N = track.children.length;
    const setW = track.children[12].offsetLeft - track.children[0].offsetLeft;
    const samples = [];
    for (let i = 0; i < 18; i++) {
      next.click();
      await new Promise(r => setTimeout(r, 260));
      samples.push(Math.round(track.scrollLeft));
    }
    const maxSL = Math.max(...samples), minSL = Math.min(...samples);
    return { slideCount: N, setW: Math.round(setW), maxSL, minSL, withinBand: minSL >= -5 && maxSL <= Math.round(setW * 2.2) };
  });
  console.log("CARO:", JSON.stringify(caro));

  // mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await shoot("type.html?t=hacker-house", "r16-type-mobile.png");
  await shoot("map.html", "r16-atlas-mobile.png");

  console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "NO CONSOLE ERRORS");
  await browser.close();
})();
