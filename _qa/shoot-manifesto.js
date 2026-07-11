/* Manifesto v3 QA: gray field + pop cards + spark title + vines,
   scroll village scene, bright close, assumption deep page, mobile. */
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

  // 1. gray state (no scroll, no clicks)
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);
  await page.evaluate(() => document.getElementById("field").scrollIntoView({ behavior: "auto" }));
  await page.waitForTimeout(700);
  await snap("mf3-gray-state.png", true);

  // 2. click two bubbles -> pop cards + spark title
  await page.click('#bub-made-of-everyone .gray', { force: true }).catch(e => console.log("click1 fail", e.message));
  await page.waitForTimeout(900);
  await page.click('#bub-more-for-you .gray', { force: true }).catch(e => console.log("click2 fail", e.message));
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.getElementById("field").scrollIntoView({ behavior: "auto" }));
  await page.waitForTimeout(500);
  await snap("mf3-popped-spark.png", true);

  // 3. scroll through whole page (auto-pops rest, draws scene)
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y <= h; y += 350) { window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 90)); }
  });
  await page.waitForTimeout(900);
  const state = await page.evaluate(() => ({
    popped: document.querySelectorAll(".bub.pop").length,
    total: document.querySelectorAll(".bub").length,
    p: document.getElementById("field").style.getPropertyValue("--p"),
    lit: document.getElementById("field").classList.contains("lit"),
    stagesOn: document.querySelectorAll(".scene .st.on").length,
  }));
  console.log("STATE:", JSON.stringify(state));

  // 4. village scene mid + end
  await page.evaluate(() => {
    const w = document.getElementById("scenewrap");
    window.scrollTo({ top: w.offsetTop + w.offsetHeight * 0.45, behavior: "auto" });
  });
  await page.waitForTimeout(1600);
  await snap("mf3-scene-mid.png", true);
  await page.evaluate(() => {
    const w = document.getElementById("scenewrap");
    window.scrollTo({ top: w.offsetTop + w.offsetHeight - window.innerHeight - 10, behavior: "auto" });
  });
  await page.waitForTimeout(1800);
  await snap("mf3-scene-end.png", true);

  // 5. close section
  await page.evaluate(() => document.querySelector(".close").scrollIntoView({ behavior: "auto" }));
  await page.waitForTimeout(700);
  await snap("mf3-close.png", true);

  // 6. field after all popped (vines + green)
  await page.evaluate(() => document.getElementById("field").scrollIntoView({ behavior: "auto" }));
  await page.waitForTimeout(900);
  await snap("mf3-field-after.png", true);

  // 7. full page
  await snap("mf3-full.png");

  // 8. assumption deep page
  await page.goto(root + "assumption.html?a=security", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  await snap("mf3-assumption.png");

  // 9. bad slug redirects
  await page.goto(root + "assumption.html?a=nope", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(800);
  console.log("bad-slug lands on:", page.url().split("/").pop());

  // 10. mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y <= h; y += 300) { window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 80)); }
    window.scrollTo({ top: 0, behavior: "auto" });
  });
  await page.waitForTimeout(700);
  await snap("mf3-mobile-full.png");

  console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "NO CONSOLE ERRORS");
  await browser.close();
})();
