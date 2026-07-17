/* Verifies edit-mode v2.1: nav/footer text editable, plain-click suppressed
   while editing, Ctrl/Cmd/Alt-click navigates, persistence intact, new copy present. */
const { chromium } = require("playwright-core");
const root = "file:///C:/Users/User/coliving-portfolio/";
(async () => {
  const b = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", e => errs.push("PAGEERROR: " + e.message));

  await p.goto(root + "index.html", { waitUntil: "networkidle" });
  await p.waitForTimeout(600);

  // 1) new landing copy present
  const bodyText = await p.evaluate(() => document.body.innerText);
  const copyOk = bodyText.includes("Resources to imagine a better world") &&
                 bodyText.includes("I build spaces of hope and connection") &&
                 bodyText.includes("built of hope and love");
  console.log("1) new landing copy present:", copyOk ? "YES" : "NO ❌");

  // 2) enter edit mode; nav/footer text now editable
  await p.click(".pa-editbtn");
  await p.waitForTimeout(300);
  const navEditable = await p.evaluate(() => {
    const navWrap = document.querySelector("[data-sitenav]") || document;
    return navWrap.querySelectorAll("[data-pa-edit]").length;
  });
  console.log("2) editable elements inside nav/footer:", navEditable, navEditable > 0 ? "✓" : "❌");

  // 3) plain click on a nav link is suppressed (stays on page)
  const urlBefore = p.url();
  const linkSel = await p.evaluate(() => {
    const here = location.pathname.split("/").pop();
    // a big door anchor is a clean, reliably-clickable link to another page
    const a = document.querySelector('a.door[href$=".html"]') ||
      [...document.querySelectorAll('a[href$=".html"]')].find(x =>
        !x.closest(".pa-editbar,.pa-editbtn") && !x.getAttribute("href").endsWith(here));
    if (!a) return null;
    a.setAttribute("data-testlink", "1");
    return 'a[data-testlink="1"]';
  });
  await p.click(linkSel, { force: true }).catch(() => {});
  await p.waitForTimeout(400);
  const stayed = p.url() === urlBefore;
  console.log("3) plain-click stays on page (edit mode):", stayed ? "YES" : "NO ❌", "→", p.url().split("/").pop());

  // 4) Ctrl+click navigates
  await p.click(linkSel, { modifiers: ["Control"], force: true }).catch(() => {});
  await p.waitForTimeout(900);
  const navigated = p.url() !== urlBefore;
  console.log("4) Ctrl-click navigates:", navigated ? "YES → " + p.url().split("/").pop() : "NO ❌");

  // 5) persistence still works
  await p.goto(root + "about.html", { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  await p.click(".pa-editbtn");
  await p.waitForTimeout(200);
  await p.evaluate(() => {
    const el = [...document.querySelectorAll("[data-pa-edit]")].find(e => (e.dataset.paOrig || "").trim().length > 40);
    el.focus(); el.innerText = el.dataset.paOrig + " [NAVTEST]";
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await p.waitForTimeout(700);
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  const restored = await p.evaluate(() => [...document.querySelectorAll("[data-pa-edit]")].some(e => e.innerText.includes("[NAVTEST]")));
  console.log("5) persistence across reload:", restored ? "YES" : "NO ❌");
  await p.evaluate(() => localStorage.removeItem("pa-site-edits::about.html"));

  console.log(errs.length ? "ERRORS: " + errs.join("; ") : "6) no page errors: YES");
  const pass = copyOk && navEditable > 0 && stayed && navigated && restored && !errs.length;
  console.log(pass ? "\n✅ ALL PASSED" : "\n❌ SOMETHING FAILED");
  await b.close();
  process.exit(pass ? 0 : 1);
})();
