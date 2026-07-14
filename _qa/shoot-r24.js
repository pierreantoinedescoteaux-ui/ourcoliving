/* R24 QA: pinned-stage manifesto field (all visible, shake, sequential pops),
   nav rename (Coliving Resources / Writings), single footer on index,
   credits page, map title, FOR PIERRE-ANTOINE folder launcher. */
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
  async function snap(name, viewportOnly) {
    await page.screenshot({ path: path.join(__dirname, name), fullPage: !viewportOnly });
    console.log("shot:", name);
  }

  // ---- manifesto stage ----
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);
  // scroll until the stage pins
  await page.evaluate(() => {
    const bed = document.getElementById("fieldbed");
    window.scrollTo({ top: bed.getBoundingClientRect().top + window.scrollY + 10, behavior: "auto" });
  });
  await page.waitForTimeout(1000);
  const arrival = await page.evaluate(() => {
    const vh = window.innerHeight;
    const wi = document.getElementById("whatif").getBoundingClientRect();
    const bubs = [...document.querySelectorAll(".bub")].map(b => b.getBoundingClientRect());
    return {
      visible: bubs.filter(r => r.top >= 0 && r.bottom <= vh + 4).length,
      underWhatif: bubs.filter(r => r.top < wi.bottom - 10 && r.left < wi.right && r.right > wi.left).length,
      shaking: document.querySelectorAll(".bub.shake").length,
      popped: document.querySelectorAll(".bub.pop").length,
      pinTop: Math.round(document.getElementById("fieldpin").getBoundingClientRect().top),
    };
  });
  console.log("ARRIVAL:", JSON.stringify(arrival));
  await snap("r24-stage-arrival.png", true);

  // scroll 30% into the field -> only the first 1-2 should have popped (slow start)
  const bedInfo = await page.evaluate(() => {
    const bed = document.getElementById("fieldbed");
    const r = bed.getBoundingClientRect();
    return { top: r.top + window.scrollY, h: r.height, vh: window.innerHeight };
  });
  await page.evaluate(({ top, h, vh }) => window.scrollTo({ top: top + (h - vh) * 0.3, behavior: "auto" }), bedInfo);
  await page.waitForTimeout(1200);
  const at30 = await page.evaluate(() => ({
    popped: document.querySelectorAll(".bub.pop").length,
    shaking: document.querySelectorAll(".bub.shake").length,
  }));
  console.log("AT 30%:", JSON.stringify(at30));
  await snap("r24-stage-30pct.png", true);

  // 60% -> more; 100% -> all
  await page.evaluate(({ top, h, vh }) => window.scrollTo({ top: top + (h - vh) * 0.6, behavior: "auto" }), bedInfo);
  await page.waitForTimeout(1000);
  const at60 = await page.evaluate(() => document.querySelectorAll(".bub.pop").length);
  await page.evaluate(({ top, h, vh }) => window.scrollTo({ top: top + (h - vh) * 0.999, behavior: "auto" }), bedInfo);
  await page.waitForTimeout(1400);
  const atEnd = await page.evaluate(() => {
    const segs = [...document.querySelectorAll(".bvinesvg .seg")];
    const drawn = segs.filter(p => { const L = p.getTotalLength(); return L > 0 && parseFloat(p.style.strokeDashoffset || L) < L * 0.15; }).length;
    return { popped: document.querySelectorAll(".bub.pop").length, segsDrawn: drawn, shaking: document.querySelectorAll(".bub.shake").length };
  });
  console.log("AT 60%:", at60, "AT END:", JSON.stringify(atEnd));
  await snap("r24-stage-end.png", true);

  // click-ahead works: reload, pin, click bubble #6 directly
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const bed = document.getElementById("fieldbed");
    window.scrollTo({ top: bed.getBoundingClientRect().top + window.scrollY + 10, behavior: "auto" });
  });
  await page.waitForTimeout(600);
  await page.click("#bub-work-gift .gray", { force: true }).catch(e => console.log("clickahead fail", e.message));
  await page.waitForTimeout(900);
  const ahead = await page.evaluate(() => document.getElementById("bub-work-gift").classList.contains("pop"));
  console.log("CLICK-AHEAD popped:", ahead);

  // ---- index: exactly one footer ----
  await page.goto(root + "index.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1000);
  const idx = await page.evaluate(() => ({
    footers: document.querySelectorAll("footer").length,
    contactAct: !!document.querySelector("section.footsec"),
    navResources: !![...document.querySelectorAll(".snav .item>a")].find(a => a.textContent.indexOf("Coliving Resources") >= 0),
    navWritings: !![...document.querySelectorAll(".snav .item>a")].find(a => a.textContent.indexOf("Writings") >= 0),
    creditsLink: !!document.querySelector('.sfooter a[href="credits.html"]'),
  }));
  console.log("INDEX:", JSON.stringify(idx));

  // ---- credits page + map title + launcher ----
  await page.goto(root + "credits.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(800);
  const cred = await page.evaluate(() => ({ h1: document.querySelector("h1").textContent, nav: !!document.querySelector(".snav"), footer: !!document.querySelector(".sfooter") }));
  console.log("CREDITS:", JSON.stringify(cred));
  await page.goto(root + "map.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  const mp = await page.evaluate(() => document.querySelector(".maphead h2").textContent);
  console.log("MAP TITLE:", mp);
  await page.goto(root + "FOR%20PIERRE-ANTOINE/CLICK-HERE-TO-MODIFY-TEXT.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(600);
  const launcher = await page.evaluate(() => document.querySelectorAll(".pages a").length);
  console.log("LAUNCHER links:", launcher);

  // ---- talkpieces: 3 pieces ----
  await page.goto(root + "talkpieces.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1000);
  const tp = await page.evaluate(() => document.body.textContent.indexOf("What brought me here") >= 0);
  console.log("PIECE 03 listed:", tp);

  // ---- mobile manifesto still flows ----
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1100);
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y <= h; y += 320) { window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 80)); }
  });
  await page.waitForTimeout(900);
  const mob = await page.evaluate(() => document.querySelectorAll(".bub.pop").length);
  console.log("MOBILE popped:", mob);

  console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "NO CONSOLE ERRORS");
  await browser.close();
})();
