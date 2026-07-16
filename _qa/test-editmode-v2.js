/* Proves edit-mode v2 actually persists: edit -> auto-save -> RELOAD -> restore
   -> gather -> apply-back (dry). If any step fails, it says so loudly. */
const { chromium } = require("playwright-core");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");
const root = "file:///C:/Users/User/coliving-portfolio/";
const MARK = " [E2E-TEST-EDIT]";

(async () => {
  const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push("PAGEERROR: " + e.message));

  await page.goto(root + "about.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // enter edit mode
  await page.click(".pa-editbtn");
  await page.waitForTimeout(200);

  // pick a real editable block, remember its original, append a marker
  const orig = await page.evaluate((MARK) => {
    const els = [...document.querySelectorAll("[data-pa-edit]")]
      .filter(e => (e.dataset.paOrig || "").trim().length > 40);
    const el = els[0];
    const o = el.dataset.paOrig;
    el.focus();
    el.innerText = o + MARK;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    return o;
  }, MARK);
  await page.waitForTimeout(700); // let debounced auto-save fire

  const saved = await page.evaluate(() => localStorage.getItem("pa-site-edits::about.html"));
  console.log("1) auto-saved to localStorage:", saved ? "YES" : "NO ❌");

  // RELOAD — the real test the old tool failed
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const restored = await page.evaluate((MARK) => {
    const el = [...document.querySelectorAll("[data-pa-edit]")].find(e => e.innerText.includes(MARK));
    return el ? { has: true, dirty: el.classList.contains("pa-dirty") } : { has: false };
  }, MARK);
  console.log("2) survived RELOAD + restored to DOM:", restored.has ? ("YES (dirty=" + restored.dirty + ")") : "NO ❌");

  // gather (what "Copy all edits" serializes)
  const gathered = await page.evaluate(() => window.__PA_EDIT.gatherAll());
  const okGather = Array.isArray(gathered) && gathered.some(d => d.page === "about.html" && d.changes.some(c => c.edited.includes("E2E-TEST-EDIT")));
  console.log("3) gatherAll() returns the edit:", okGather ? "YES" : "NO ❌");

  // apply-back dry run against source
  const tmp = path.join(os.tmpdir(), "e2e-edits.json");
  fs.writeFileSync(tmp, JSON.stringify(gathered, null, 2));
  let applyOut = "";
  try { applyOut = execSync('node "C:/Users/User/coliving-portfolio/_tools/apply-edits.mjs" "' + tmp + '" --dry', { encoding: "utf8" }); }
  catch (e) { applyOut = "ERROR: " + e.message; }
  const appliedOne = /Applied: [1-9]/.test(applyOut);
  console.log("4) apply-edits.mjs (dry) matches it in source:", appliedOne ? "YES" : "NO ❌");
  console.log("   apply output:", applyOut.split("\n").filter(Boolean).slice(0, 4).join(" | "));

  // cleanup the test key so nothing lingers
  await page.evaluate(() => localStorage.removeItem("pa-site-edits::about.html"));
  fs.unlinkSync(tmp);

  console.log(errs.length ? "PAGE ERRORS: " + errs.join("; ") : "5) no page errors: YES");
  const allGood = saved && restored.has && okGather && appliedOne && !errs.length;
  console.log(allGood ? "\n✅ ALL PASSED — edits now survive close/reload and apply back." : "\n❌ SOMETHING FAILED — see above.");
  await browser.close();
  process.exit(allGood ? 0 : 1);
})();
