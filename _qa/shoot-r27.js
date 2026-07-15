/* R27 QA — the three deferred items from R26:
   1) talkpieces.html: each piece card renders its main image (P-A's #1)
   2) type.html: "many shapes" intro + 12-tile guide gallery, active highlighted (P-A's #3)
   3) design.html: carousel image capped — no image taller than 85% of viewport
      at 1280x620 / 1366x768 (RESIZE-REPORT worst offender) */
const { chromium } = require("playwright-core");
const path = require("path");
const root = "file:///C:/Users/User/coliving-portfolio/";

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  let fails = 0;
  const check = (name, ok, detail) => {
    console.log((ok ? "PASS" : "FAIL") + "  " + name + (detail ? "  [" + detail + "]" : ""));
    if (!ok) fails++;
  };

  async function newPage(vp) {
    const page = await browser.newPage({ viewport: vp });
    const errors = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", e => errors.push("PAGEERROR: " + e.message));
    return { page, errors };
  }

  /* ---- 1) talk pieces card images ---- */
  {
    const { page, errors } = await newPage({ width: 1440, height: 950 });
    await page.goto(root + "talkpieces.html", { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll(".piece .p-img img")];
      return {
        n: imgs.length,
        loaded: imgs.filter(i => i.naturalWidth > 0).length,
        bodies: document.querySelectorAll(".piece .p-body").length,
        readInBody: !!document.querySelector("a.piece .p-body .read"),
        upcomingImgs: document.querySelectorAll(".piece.upcoming .p-img img").length,
      };
    });
    check("talkpieces: 3 card images rendered", r.n === 3, "n=" + r.n);
    check("talkpieces: all images load", r.loaded === 3, "loaded=" + r.loaded);
    check("talkpieces: bodies wrap content (3)", r.bodies === 3);
    check("talkpieces: read pill inside live card body", r.readInBody);
    check("talkpieces: upcoming cards keep their image", r.upcomingImgs === 2, "n=" + r.upcomingImgs);
    await page.screenshot({ path: path.join(__dirname, "r27-talkpieces.png"), fullPage: true });
    check("talkpieces: 0 JS errors", errors.length === 0, errors.join(" | ").slice(0, 200));
    await page.setViewportSize({ width: 390, height: 800 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(__dirname, "r27-talkpieces-mobile.png"), fullPage: true });
    await page.close();
  }

  /* ---- 2) type.html intro gallery ---- */
  {
    const { page, errors } = await newPage({ width: 1440, height: 950 });
    await page.goto(root + "type.html?t=cohousing", { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const tiles = [...document.querySelectorAll("#tgal .gtile")];
      const on = document.querySelector("#tgal .gtile.on");
      const title = document.querySelector(".tintro .ti-title");
      return {
        tiles: tiles.length,
        svgs: tiles.filter(t => t.querySelector("svg")).length,
        onName: on ? on.querySelector(".gname").textContent : null,
        onCurrent: on ? on.getAttribute("aria-current") : null,
        firstHref: tiles[0] ? tiles[0].getAttribute("href") : null,
        introText: title ? title.textContent : "",
        introBeforeGuide: title && document.querySelector("#main h1") &&
          (title.getBoundingClientRect().top < 0 ||
           title.compareDocumentPosition(document.querySelector("#main h1")) & Node.DOCUMENT_POSITION_FOLLOWING) ? true : false,
        guideH1: (document.querySelector("#main h1") || {}).textContent || "",
        arrows: document.querySelectorAll(".fgarrow").length,
      };
    });
    check("type: 12 gallery tiles", r.tiles === 12, "n=" + r.tiles);
    check("type: every tile has its type mark (svg)", r.svgs === 12, "n=" + r.svgs);
    check("type: active tile = Cohousing", r.onName === "Cohousing", "on=" + r.onName);
    check("type: active tile aria-current=page", r.onCurrent === "page");
    check("type: tile links to its guide", /^type\.html\?t=/.test(r.firstHref || ""), r.firstHref);
    check("type: intro says many shapes", /many shapes/.test(r.introText));
    check("type: intro sits above the guide", r.introBeforeGuide);
    check("type: guide h1 still renders", /Cohousing/i.test(r.guideH1), r.guideH1);
    check("type: floating arrows untouched (2)", r.arrows === 2);
    await page.screenshot({ path: path.join(__dirname, "r27-type-gallery.png") });
    // click a tile -> lands on that guide with its tile active
    await page.click('#tgal .gtile[href="type.html?t=kibbutz"]');
    await page.waitForTimeout(900);
    const r2 = await page.evaluate(() => ({
      on: (document.querySelector("#tgal .gtile.on .gname") || {}).textContent,
      h1: (document.querySelector("#main h1") || {}).textContent,
    }));
    check("type: tile click opens that guide", /Kibbutz/i.test(r2.h1 || ""), r2.h1);
    check("type: active tile follows", r2.on === "Kibbutz", "on=" + r2.on);
    check("type: 0 JS errors", errors.length === 0, errors.join(" | ").slice(0, 200));
    // mobile: 3-col gallery still sane
    await page.setViewportSize({ width: 390, height: 800 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(__dirname, "r27-type-gallery-mobile.png") });
    await page.close();
  }

  /* ---- 3) design.html tall-image cap ---- */
  for (const vp of [{ width: 1280, height: 620 }, { width: 1366, height: 768 }]) {
    const { page, errors } = await newPage(vp);
    await page.goto(root + "design.html", { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(1200);
    const r = await page.evaluate((vh) => {
      const big = [...document.querySelectorAll("img")].filter(i => {
        const rr = i.getBoundingClientRect();
        return rr.width > 0 && rr.height > vh * 0.85;
      });
      const active = document.querySelector(".slide.active .slot-img, .slide.active .ph");
      const ar = active ? active.getBoundingClientRect() : null;
      return {
        bigImgs: big.length,
        bigSample: big[0] ? Math.round(big[0].getBoundingClientRect().height) : 0,
        slideImgH: ar ? Math.round(ar.height) : 0,
        slideVisible: ar ? ar.height > 100 : false,
      };
    }, vp.height);
    const tag = vp.width + "x" + vp.height;
    check("design " + tag + ": 0 images taller than 85% viewport", r.bigImgs === 0, "bigImgs=" + r.bigImgs + " h=" + r.bigSample);
    check("design " + tag + ": active slide image visible + sane", r.slideVisible && r.slideImgH < vp.height * 0.85, "h=" + r.slideImgH);
    check("design " + tag + ": 0 JS errors", errors.length === 0, errors.join(" | ").slice(0, 200));
    if (vp.height === 620) await page.screenshot({ path: path.join(__dirname, "r27-design-1280x620.png") });
    await page.close();
  }

  await browser.close();
  console.log(fails === 0 ? "\nALL GREEN" : "\n" + fails + " FAILURES");
  process.exit(fails === 0 ? 0 : 1);
})();
