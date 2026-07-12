/* Round 18 QA:
   map.html — no auto-advance, no load jump, order swap (intergenerational <-> baugruppen),
     popup opens past the hero image, frozen close/fullpage icon buttons outside the card.
   design.html — infinite carousel both ways, no notice when collapsed, toggle pill fixed
     location, open section = image shaded background, drag-to-swipe, neighbour peeks.
   site-nav.js — essay under Design for Connection, real footer w/ year, fixed back-to-top. */
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

  /* ============ MAP.HTML ============ */
  await page.goto(root + "map.html", { waitUntil: "domcontentloaded" }).catch(() => {});
  const early = await page.evaluate(() => document.getElementById("caroTrack").scrollLeft);
  await page.waitForTimeout(2600);
  const later = await page.evaluate(() => {
    const t = document.getElementById("caroTrack");
    const kids = t.children;
    const oneSet = kids[12].offsetLeft - kids[0].offsetLeft;
    const names = [...kids].slice(0, 12).map(s => s.getAttribute("data-slug"));
    return { scrollLeft: Math.round(t.scrollLeft), oneSet: Math.round(oneSet), order: names };
  });
  console.log("MAP CAROUSEL:", JSON.stringify({
    earlyScrollLeft: Math.round(early),
    laterScrollLeft: later.scrollLeft,
    centeredOnMiddleSet: Math.abs(later.scrollLeft - later.oneSet) < later.oneSet * 0.4,
    noAutoDrift: Math.abs(later.scrollLeft - early) < 5,
    slot4: later.order[3], slot6: later.order[5],
  }));
  await snap("r18-atlas-carousel.png", true);

  // arrows still wrap both ways
  await page.click("#caroPrev"); await page.waitForTimeout(800);
  await page.click("#caroPrev"); await page.waitForTimeout(800);
  const afterPrev = await page.evaluate(() => Math.round(document.getElementById("caroTrack").scrollLeft));
  console.log("MAP ARROWS: afterPrev2 scrollLeft =", afterPrev, "(should still be a sane positive number)");

  // popup: open housing-coop (No. 03/12), image must be scrolled away
  await page.evaluate(() => document.querySelector('.node[data-slug="housing-coop"]').click());
  await page.waitForTimeout(900);
  const popup = await page.evaluate(() => {
    const ms = document.getElementById("mscroll");
    const idx = document.querySelector(".modal .idx");
    const hero = document.querySelector(".modal .mhero");
    const msR = ms.getBoundingClientRect(), idxR = idx.getBoundingClientRect(), heroR = hero.getBoundingClientRect();
    const closeR = document.getElementById("mClose").getBoundingClientRect();
    const fullEl = document.getElementById("mFull");
    return {
      scrollTop: Math.round(ms.scrollTop),
      idxText: idx.textContent.trim().slice(0, 12),
      idxTopPad: Math.round(idxR.top - msR.top),
      heroHidden: heroR.bottom <= msR.top + 4,
      toolsOutsideCard: closeR.left >= msR.right - 2,
      fullHref: fullEl.getAttribute("href"),
      fullHasIcon: !!fullEl.querySelector("svg"),
      closeY0: Math.round(closeR.top),
    };
  });
  console.log("POPUP OPEN STATE:", JSON.stringify(popup));
  await snap("r18-popup-open.png", true);

  // frozen while scrolling: scroll the popup content, buttons must not move
  await page.evaluate(() => { document.getElementById("mscroll").scrollTop += 700; });
  await page.waitForTimeout(500);
  const frozen = await page.evaluate(() => ({
    closeY: Math.round(document.getElementById("mClose").getBoundingClientRect().top),
    fullY: Math.round(document.getElementById("mFull").getBoundingClientRect().top),
  }));
  console.log("TOOLS AFTER SCROLL:", JSON.stringify({ ...frozen, frozenOk: frozen.closeY === popup.closeY0 }));
  await snap("r18-popup-scrolled.png", true);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // drawings-variant preview for P-A (NOT shipped — carousel with anatomy diagrams instead of photos)
  await page.evaluate(() => {
    document.querySelectorAll("#caroTrack .slide").forEach(s => {
      const img = s.querySelector("img");
      if (img) img.src = "images/generated/diagram-" + s.getAttribute("data-slug") + ".jpg";
    });
  });
  await page.waitForTimeout(1500);
  await snap("r18-atlas-carousel-DRAWINGS-preview.png", true);

  /* ============ DESIGN.HTML ============ */
  await page.goto(root + "design.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);
  const dInit = await page.evaluate(() => {
    const track = document.getElementById("track");
    const act = track.querySelector(".slide.active");
    return {
      slides: track.children.length,
      activeCloneIdx: Array.prototype.indexOf.call(track.children, act),
      noticeInCarousel: !!track.querySelector(".notice"),
      pillOnActive: !!act.querySelector(".toggle-pill") && getComputedStyle(act.querySelector(".toggle-pill")).opacity !== "0",
    };
  });
  console.log("DESIGN COLLAPSED:", JSON.stringify(dInit));
  await page.evaluate(() => document.getElementById("caro").scrollIntoView({ behavior: "auto", block: "center" }));
  await page.waitForTimeout(600);
  await snap("r18-design-collapsed.png", true);

  // infinite: 8x prev from the start must keep working (would previously jump)
  for (let i = 0; i < 8; i++) { await page.click("#prevBtn"); await page.waitForTimeout(300); }
  await page.waitForTimeout(900);
  const dLoop = await page.evaluate(() => {
    const track = document.getElementById("track");
    const act = track.querySelector(".slide.active");
    const ci = Array.prototype.indexOf.call(track.children, act);
    return { activeCloneIdx: ci, normalizedToMiddle: ci >= 6 && ci < 12, theme: act.querySelector("h3").textContent, hash: location.hash };
  });
  console.log("DESIGN AFTER 8x PREV (infinite):", JSON.stringify(dLoop));

  // open the active theme
  await page.evaluate(() => document.querySelector("#track .slide.active .toggle-pill").click());
  await page.waitForTimeout(1200);
  const dOpen = await page.evaluate(() => {
    const sec = document.querySelector(".tsec.cur");
    const bg = sec.style.background || "";
    return {
      open: document.querySelector(".bankAll").classList.contains("on"),
      secId: sec.id,
      bgHasImage: bg.includes("url("),
      closeLabel: sec.querySelector(".t-close").textContent.trim(),
      noticesInOpen: sec.querySelectorAll(".titem .notice").length,
      peeksShown: document.querySelectorAll(".peek.showp").length,
      peekLName: document.querySelector(".peek-l .pk-name").textContent,
      peekRName: document.querySelector(".peek-r .pk-name").textContent,
    };
  });
  console.log("DESIGN OPEN STATE:", JSON.stringify(dOpen));
  await snap("r18-design-open.png", true);

  // drag-to-swipe: click-hold and pull left => next theme
  const beforeDrag = await page.evaluate(() => location.hash);
  const secBox = await page.evaluate(() => {
    const r = document.querySelector(".tsec.cur .t-blurb").getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await page.mouse.move(secBox.x, secBox.y);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(secBox.x - i * 30, secBox.y, { steps: 2 }); await page.waitForTimeout(20); }
  await snap("r18-design-mid-drag.png", true);
  await page.mouse.up();
  await page.waitForTimeout(900);
  const afterDrag = await page.evaluate(() => ({ hash: location.hash, cur: document.querySelector(".tsec.cur").id }));
  console.log("DRAG SWIPE:", JSON.stringify({ before: beforeDrag, ...afterDrag }));

  // collapse: back to carousel, centered on the same theme
  await page.evaluate(() => document.querySelector(".tsec.cur .t-close").click());
  await page.waitForTimeout(800);
  const dClosed = await page.evaluate(() => {
    const track = document.getElementById("track");
    const act = track.querySelector(".slide.active");
    return {
      caroBack: !document.getElementById("caro").classList.contains("hidden"),
      theme: act ? act.querySelector("h3").textContent : null,
      peeksHidden: document.querySelectorAll(".peek.showp").length === 0,
    };
  });
  console.log("DESIGN COLLAPSED AGAIN:", JSON.stringify(dClosed));

  // deep link still opens the right theme
  await page.goto(root + "design.html#mindfulness", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);
  const dDeep = await page.evaluate(() => ({
    cur: (document.querySelector(".tsec.cur") || {}).id,
    open: document.querySelector(".bankAll").classList.contains("on"),
  }));
  console.log("DESIGN DEEP LINK:", JSON.stringify(dDeep));

  /* ============ SITE-NAV: nav move, footer, back-to-top ============ */
  const nav = await page.evaluate(() => {
    const items = [...document.querySelectorAll(".snav .item")];
    const design = items.find(i => i.querySelector("a").textContent.includes("Design for Connection"));
    const manifesto = items.find(i => i.querySelector("a").textContent.includes("Manifesto"));
    return {
      essayUnderDesign: !!design.querySelector('.drop a[href="separation.html"]'),
      essayGoneFromManifesto: !manifesto.querySelector('.drop a[href="separation.html"]'),
    };
  });
  console.log("NAV:", JSON.stringify(nav));

  const footer = await page.evaluate(() => {
    const f = document.querySelector(".sfooter");
    return {
      note: f.querySelector(".note").textContent.trim(),
      sig: f.querySelector(".sig").textContent.trim(),
      links: f.querySelectorAll(".flinks a").length,
      base: f.querySelector(".fbase").textContent.trim(),
      oldUpGone: !f.querySelector(".up"),
    };
  });
  console.log("FOOTER:", JSON.stringify(footer));
  await page.evaluate(() => document.querySelector(".sfooter").scrollIntoView({ behavior: "auto", block: "end" }));
  await page.waitForTimeout(700);
  await snap("r18-footer.png", true);

  const totop = await page.evaluate(() => {
    const b = document.querySelector(".stotop");
    const r = b.getBoundingClientRect();
    return {
      exists: !!b, fixed: getComputedStyle(b).position === "fixed",
      shown: b.classList.contains("show"),
      bottomRight: r.right > window.innerWidth - 90 && r.bottom > window.innerHeight - 90,
    };
  });
  console.log("BACK-TO-TOP (scrolled):", JSON.stringify(totop));
  await page.evaluate(() => document.querySelector(".stotop").click());
  await page.waitForTimeout(1400);
  const totopTop = await page.evaluate(() => ({ y: Math.round(window.scrollY), hiddenAtTop: !document.querySelector(".stotop").classList.contains("show") }));
  console.log("BACK-TO-TOP CLICK:", JSON.stringify(totopTop));

  // active tab on the essay page
  await page.goto(root + "separation.html", { waitUntil: "domcontentloaded" }).catch(() => {});
  await page.waitForTimeout(1200);
  const essayTab = await page.evaluate(() => {
    const on = document.querySelector(".snav .item.on > a");
    return { activeTab: on ? on.textContent.trim() : null };
  });
  console.log("ESSAY PAGE ACTIVE TAB:", JSON.stringify(essayTab));

  /* ============ MOBILE spot-checks ============ */
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root + "map.html", { waitUntil: "domcontentloaded" }).catch(() => {});
  await page.waitForTimeout(1600);
  await page.evaluate(() => document.querySelector('.node[data-slug="ecovillage"]').click());
  await page.waitForTimeout(900);
  const mobPopup = await page.evaluate(() => {
    const msR = document.getElementById("mscroll").getBoundingClientRect();
    const cR = document.getElementById("mClose").getBoundingClientRect();
    return { toolsInsideCard: cR.right <= msR.right + 2 && cR.top >= msR.top - 2, heroHidden: document.querySelector(".modal .mhero").getBoundingClientRect().bottom <= msR.top + 4 };
  });
  console.log("MOBILE POPUP:", JSON.stringify(mobPopup));
  await snap("r18-mobile-popup.png", true);

  await page.goto(root + "design.html", { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1400);
  await page.evaluate(() => document.getElementById("caro").scrollIntoView({ behavior: "auto", block: "center" }));
  await page.waitForTimeout(500);
  await snap("r18-mobile-design.png", true);

  console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "NO CONSOLE ERRORS");
  await browser.close();
})();
