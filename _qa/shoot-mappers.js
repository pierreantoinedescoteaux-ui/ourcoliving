// QA for the "Who maps this better than I do" section on projects.html.
// Run from anywhere: node _qa/shoot-mappers.js   (server on http://127.0.0.1:8123)
const path = require("path");
const { chromium } = require("C:/Users/User/coliving-portfolio/_qa/node_modules/playwright-core");
const BASE = process.env.BASE || "http://127.0.0.1:8123";
const OUT = path.join(__dirname, "mappers");
require("fs").mkdirSync(OUT, { recursive: true });

const fails = [];
const fail = (vp, msg) => fails.push(`[${vp}] ${msg}`);

async function run(browser, name, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push(e.message));
  page.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  await page.goto(BASE + "/projects.html?qa=" + Date.now(), { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  if (errs.length) fail(name, "JS errors: " + errs.join(" | "));

  const sideways = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (sideways > 0) fail(name, `sideways scroll of ${sideways}px`);

  // worldwide cards
  const cards = await page.$$eval("#wwlist a", as => as.map(a => ({ t: a.textContent, href: a.href, target: a.target,
    vis: a.getBoundingClientRect().height > 0 })));
  for (const want of ["ic.org", "agartha.one"]) {
    const c = cards.find(c => c.href.includes(want));
    if (!c || !c.vis) fail(name, `worldwide card for ${want} missing or hidden`);
  }
  if (cards.some(c => c.target !== "_blank")) fail(name, "a worldwide card does not open in a new tab");

  // section screenshot
  const sec = await page.$("section.others");
  await sec.scrollIntoViewIfNeeded();
  await sec.screenshot({ path: path.join(OUT, `${name}-section.png`) });

  // every visible tack opens a pop-up with working links
  const tacks = await page.$$(".tack");
  let opened = 0, shotDone = false;
  for (const t of tacks) {
    if (!(await t.isVisible())) continue;
    const label = await t.getAttribute("aria-label");
    await t.evaluate(el => el.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(60);
    const box = await t.boundingBox();
    if (box.width < 44 || box.height < 44) fail(name, `tap target too small for ${label}: ${box.width}x${box.height}`);
    // the tack's own centre must belong to it (not covered by a neighbour)
    const own = await page.evaluate(([x, y, l]) => {
      const el = document.elementFromPoint(x, y); const tk = el && el.closest(".tack");
      return tk && tk.getAttribute("aria-label") === l ? "" : (el ? el.tagName + "." + el.className : "nothing");
    }, [box.x + box.width / 2, box.y + box.height / 2, label]);
    if (own) fail(name, `centre of ${label} is covered by ${own}`);
    await t.scrollIntoViewIfNeeded();
    if (opts.isMobile) await t.tap(); else await t.click();
    await page.waitForTimeout(150);
    const pop = await page.evaluate(() => {
      const p = [...document.querySelectorAll(".wm-pop")].find(p => !p.hidden);
      if (!p) return null;
      const r = p.getBoundingClientRect();
      return { links: [...p.querySelectorAll("a")].map(a => ({ href: a.getAttribute("href"), target: a.target })),
        l: r.left, r: r.right, w: window.innerWidth, text: p.textContent };
    });
    if (!pop) { fail(name, `no pop-up for ${label}`); continue; }
    if (!pop.links.length || pop.links.some(a => !a.href || !/^https?:\/\//.test(a.href))) fail(name, `pop-up for ${label} has a missing link`);
    if (pop.links.some(a => a.target !== "_blank")) fail(name, `pop-up link for ${label} not in a new tab`);
    if (pop.l < 0 || pop.r > pop.w) fail(name, `pop-up for ${label} runs off screen (${Math.round(pop.l)}..${Math.round(pop.r)} of ${pop.w})`);
    opened++;
    if (!shotDone && /Quebec/.test(label)) {
      await page.waitForTimeout(250);
      const fig = await page.evaluate(() => {
        const p = [...document.querySelectorAll(".wm-pop")].find(p => !p.hidden);
        const f = p.parentNode.getBoundingClientRect(), r = p.getBoundingClientRect();
        return { x: Math.max(0, Math.min(f.left, r.left) - 10), y: Math.min(f.top, r.top) - 10 + window.scrollY,
          w: Math.min(window.innerWidth, Math.max(f.right, r.right) + 10) - Math.max(0, Math.min(f.left, r.left) - 10),
          h: Math.max(f.bottom, r.bottom) - Math.min(f.top, r.top) + 20 };
      });
      await page.screenshot({ path: path.join(OUT, `${name}-popup.png`), fullPage: true, clip: { x: fig.x, y: fig.y, width: fig.w, height: fig.h } });
      shotDone = true;
    }
    await page.keyboard.press("Escape");
    await page.waitForTimeout(80);
    const still = await page.evaluate(() => [...document.querySelectorAll(".wm-pop")].some(p => !p.hidden));
    if (still) fail(name, `Esc did not close the pop-up for ${label}`);
  }
  const groups = await page.evaluate(() => new Set(SOURCES.filter(x => x.pin && (x.usedOn || []).includes("projects.html")).map(x => x.region)).size);
  if (opened < groups) fail(name, `only ${opened} of ${groups} regions reachable by a visible pin`);

  // outside click closes
  if (!opts.isMobile) { // desktop: hovering a pin previews its card, leaving closes it
    const t = (await page.$$(".wm-main .tack"))[0];
    await t.hover(); await page.waitForTimeout(150);
    if (!(await page.evaluate(() => [...document.querySelectorAll(".wm-pop")].some(p => !p.hidden)))) fail(name, "hover did not open a pop-up");
    await page.mouse.move(3, 3); await page.waitForTimeout(450);
    if (await page.evaluate(() => [...document.querySelectorAll(".wm-pop")].some(p => !p.hidden))) fail(name, "pop-up stayed open after the mouse left");
  }
  for (const t of await page.$$(".tack")) { if (await t.isVisible()) { if (opts.isMobile) await t.tap(); else await t.click(); break; } }
  if (opts.isMobile) await page.touchscreen.tap(5, 300); else await page.mouse.click(5, 5);
  await page.waitForTimeout(80);
  if (await page.evaluate(() => [...document.querySelectorAll(".wm-pop")].some(p => !p.hidden))) fail(name, "outside click did not close the pop-up");

  // keyboard: Tab to a pin, Enter opens and focuses the first link
  await page.evaluate(() => { const t = [...document.querySelectorAll(".tack")].find(t => t.offsetParent); t.focus(); });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(80);
  const kb = await page.evaluate(() => document.activeElement && document.activeElement.closest(".wm-pop") !== null);
  if (!kb) fail(name, "Enter on a pin did not move focus into its pop-up");
  await page.keyboard.press("Escape");

  // text size floors inside the section (visible text only)
  const tiny = await page.evaluate(isPhone => {
    const bad = [];
    document.querySelectorAll("section.others *").forEach(el => {
      if (!el.offsetParent && getComputedStyle(el).position !== "fixed") return;
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!own) return;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      const reading = el.matches("p, .wwlist span, .others > p");
      const floor = isPhone && reading ? 16 : 12;
      if (fs < floor) bad.push(`${el.tagName}.${el.className} "${el.textContent.trim().slice(0, 30)}" ${fs}px < ${floor}`);
    });
    return bad;
  }, !!opts.isMobile);
  tiny.forEach(t => fail(name, "text too small: " + t));

  // phone: pop-up shot on the inset map too
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  await run(browser, "desktop", { viewport: { width: 1366, height: 900 } });
  await run(browser, "phone", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await browser.close();
  if (fails.length) { console.log("FAILURES (" + fails.length + "):\n" + fails.join("\n")); process.exit(1); }
  console.log("ALL GREEN  screenshots in " + OUT);
})();
