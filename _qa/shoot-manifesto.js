/* Round 14 QA: manifesto (sticky whatif + bubble vine + bigger village +
   liblink), separation talk piece + anchors, projects library, resources
   directory, shared nav dropdowns + footer, infinite carousel, mobile. */
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

  // ---- manifesto ----
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);

  // nav dropdown
  await page.hover('.snav .item').catch(e => console.log("navhover fail", e.message));
  await page.waitForTimeout(500);
  await snap("r14-nav-dropdown.png", true);

  // click 2 bubbles, then scroll INTO the field to verify sticky whatif over bubbles
  await page.evaluate(() => document.getElementById("field").scrollIntoView({ behavior: "auto" }));
  await page.waitForTimeout(500);
  await page.click('#bub-made-of-everyone .gray', { force: true }).catch(e => console.log("click1 fail", e.message));
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollBy({ top: 900, behavior: "auto" }));
  await page.waitForTimeout(1200);
  const sticky = await page.evaluate(() => {
    const w = document.getElementById("whatif").getBoundingClientRect();
    return { top: Math.round(w.top), visible: w.top > 0 && w.top < 200 };
  });
  console.log("STICKY WHATIF:", JSON.stringify(sticky));
  await snap("r14-field-sticky-whatif.png", true);

  // full scroll -> auto pop all + vine + village
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y <= h; y += 350) { window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 90)); }
  });
  await page.waitForTimeout(1000);
  const state = await page.evaluate(() => ({
    popped: document.querySelectorAll(".bub.pop").length,
    stagesOn: document.querySelectorAll(".scene .st.on").length,
    vineDrawn: (() => { const p = document.querySelector(".bvinesvg .bstem"); return p ? Math.round((1 - parseFloat(p.style.strokeDashoffset || 0) / p.getTotalLength()) * 100) : -1; })(),
    leavesOn: document.querySelectorAll(".bvinesvg .bleaf.on").length,
    footer: !!document.querySelector(".sfooter"),
  }));
  console.log("STATE:", JSON.stringify(state));

  await page.evaluate(() => document.getElementById("field").scrollIntoView({ behavior: "auto" }));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollBy({ top: 600, behavior: "auto" }));
  await page.waitForTimeout(1400);
  await snap("r14-field-vine.png", true);

  await page.evaluate(() => {
    const w = document.getElementById("scenewrap");
    window.scrollTo({ top: w.offsetTop + w.offsetHeight * 0.55, behavior: "auto" });
  });
  await page.waitForTimeout(1800);
  await snap("r14-village.png", true);

  await page.evaluate(() => document.querySelector(".liblink").scrollIntoView({ behavior: "auto", block: "center" }));
  await page.waitForTimeout(600);
  await snap("r14-liblink-close.png", true);

  await page.evaluate(() => document.querySelector(".sfooter").scrollIntoView({ behavior: "auto" }));
  await page.waitForTimeout(600);
  await snap("r14-footer.png", true);

  // ---- separation talk piece + anchor ----
  await page.goto(root + "separation.html#security", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1500);
  const anchor = await page.evaluate(() => {
    const s = document.getElementById("security").getBoundingClientRect();
    return { top: Math.round(s.top), ok: s.top > -50 && s.top < 400 };
  });
  console.log("ANCHOR #security:", JSON.stringify(anchor));
  await snap("r14-separation-anchor.png", true);
  await page.goto(root + "separation.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  await snap("r14-separation-full.png");

  // ---- projects library ----
  await page.goto(root + "projects.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1300);
  const pcount = await page.evaluate(() => document.querySelectorAll(".pcard").length);
  await page.click('.filters button[data-k="Cohousing"]').catch(e => console.log("filter fail", e.message));
  await page.waitForTimeout(600);
  const pfilt = await page.evaluate(() => document.querySelectorAll(".pcard").length);
  console.log("PROJECTS: all=" + pcount + " cohousing=" + pfilt);
  await snap("r14-projects-filtered.png", true);
  await page.click('.filters button[data-k="all"]').catch(() => {});
  await page.waitForTimeout(500);
  await snap("r14-projects.png");

  // ---- resources directory ----
  await page.goto(root + "resources.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.click('.filters button[data-k="experts"]').catch(e => console.log("resfilter fail", e.message));
  await page.waitForTimeout(500);
  const rfilt = await page.evaluate(() => document.querySelectorAll(".rcard").length);
  console.log("RESOURCES experts count:", rfilt);
  await snap("r14-resources.png");

  // ---- atlas: shared nav + infinite carousel ----
  await page.goto(root + "map.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1500);
  const wrapTest = await page.evaluate(async () => {
    document.getElementById("caro").dispatchEvent(new Event("mouseenter")); // pause auto-advance, as a real user's hover would
    const track = document.getElementById("caroTrack");
    const tol = 120; // scroll-snap offsets both ends
    track.scrollTo({ left: 0, behavior: "auto" });        // pin to the start snap
    await new Promise(r => setTimeout(r, 500));
    const start = track.scrollLeft;
    document.getElementById("caroPrev").click();          // at start -> should wrap to end
    await new Promise(r => setTimeout(r, 1600));
    const atEnd = track.scrollLeft > track.scrollWidth - track.clientWidth - tol;
    document.getElementById("caroNext").click();          // at end -> should wrap to start
    await new Promise(r => setTimeout(r, 1600));
    const backAtStart = Math.abs(track.scrollLeft - start) < tol;
    return { atEnd, backAtStart };
  });
  console.log("CAROUSEL WRAP:", JSON.stringify(wrapTest));
  await snap("r14-atlas.png", true);

  // ---- other pages: nav + footer render, no errors ----
  for (const p of ["index.html", "about.html", "story.html", "work.html", "inspiration.html", "type.html?t=cohousing", "design.html"]) {
    await page.goto(root + p, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(900);
    const ok = await page.evaluate(() => ({ nav: !!document.querySelector(".snav"), foot: !!document.querySelector(".sfooter,.footer") }));
    console.log("PAGE " + p + ":", JSON.stringify(ok));
  }
  await page.goto(root + "index.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1000);
  await snap("r14-home-nav.png", true);

  // ---- mobile ----
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root + "manifesto.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1100);
  await page.click(".snav .mbtn").catch(e => console.log("mbtn fail", e.message));
  await page.waitForTimeout(500);
  await snap("r14-mobile-menu.png", true);
  await page.evaluate(async () => {
    document.querySelector(".snav .mpanel").classList.remove("openm");
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y <= h; y += 300) { window.scrollTo({ top: y, behavior: "auto" }); await new Promise(r => setTimeout(r, 80)); }
    window.scrollTo({ top: 0, behavior: "auto" });
  });
  await page.waitForTimeout(700);
  await snap("r14-mobile-full.png");

  console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "NO CONSOLE ERRORS");
  await browser.close();
})();
