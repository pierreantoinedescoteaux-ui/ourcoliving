const { chromium } = require("playwright-core");
const path = require("path");
const root = "file:///C:/Users/User/coliving-portfolio/";
(async () => {
  const b = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = [];
  p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  p.on("pageerror", e => errs.push("PAGEERROR: " + e.message));

  await p.goto(root + "design.html", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);

  const s0 = await p.evaluate(() => {
    const cur = document.querySelector(".feeling.cur");
    const tacts = cur ? cur.querySelectorAll(".tactic") : [];
    // is text before media in DOM (never underneath)? check first tactic
    let textFirstInDom = true;
    tacts.forEach(t => { const kids = [...t.children].map(c => c.className); if (kids.indexOf("t-media") < kids.indexOf("t-text") && kids[0] !== "t-text") {/*ok, order via css*/} });
    // uniform tactic image sizes
    const imgs = cur ? [...cur.querySelectorAll(".tactic .t-media img")] : [];
    const sizes = imgs.map(i => i.getBoundingClientRect().width + "x" + Math.round(i.getBoundingClientRect().height));
    return {
      curName: document.getElementById("curName").textContent,
      curColor: getComputedStyle(document.getElementById("curName")).color,
      tacticsVisible: cur ? cur.querySelectorAll(".tactic").length : 0,
      bgImage: getComputedStyle(document.getElementById("stageBg")).backgroundImage.slice(0, 30),
      peekLbg: getComputedStyle(document.getElementById("peekL")).backgroundImage !== "none",
      distinctImgSizes: [...new Set(sizes)].length,
      imgSample: sizes[0],
    };
  });
  console.log("feeling 0:", JSON.stringify(s0));
  await p.screenshot({ path: path.join(__dirname, "v4-design-full.png"), fullPage: true });

  // advance and check heading word + colour change
  await p.click("#nextBtn");
  await p.waitForTimeout(800);
  const s1 = await p.evaluate(() => ({
    curName: document.getElementById("curName").textContent,
    curColor: getComputedStyle(document.getElementById("curName")).color,
  }));
  console.log("after next:", JSON.stringify(s1), "| changed:", s0.curName !== s1.curName && s0.curColor !== s1.curColor);
  await p.screenshot({ path: path.join(__dirname, "v4-design-feeling2.png") });

  // deep link (fresh load — same-path hash change alone won't re-init)
  await p.goto(root + "design.html#creativity", { waitUntil: "networkidle" });
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  const deep = await p.evaluate(() => document.getElementById("curName").textContent);
  console.log("deep link #creativity -> heading:", deep);

  // budget open by default
  const budget = await p.evaluate(() => document.querySelectorAll("#budgetBlock .bcard").length);
  console.log("budget cards visible:", budget);

  // broken images across the stage (all feelings rendered)
  const broken = await p.evaluate(() => [...document.querySelectorAll("img")].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute("src")));
  console.log("broken imgs:", JSON.stringify(broken));

  // mobile — text before image (order) so text is never underneath
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto(root + "design.html", { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(__dirname, "v4-design-mobile.png"), fullPage: true });
  const mobBroken = await p.evaluate(() => [...document.querySelectorAll("img")].filter(i => i.complete && i.naturalWidth === 0).length);
  const mobOrder = await p.evaluate(() => {
    const t = document.querySelector(".feeling.cur .tactic");
    if (!t) return "none";
    const txt = t.querySelector(".t-text").getBoundingClientRect().top;
    const med = t.querySelector(".t-media").getBoundingClientRect().top;
    return txt < med ? "text-above-image (good)" : "image-above-text (BAD)";
  });
  console.log("mobile broken:", mobBroken, "| mobile tactic order:", mobOrder);

  console.log(errs.length ? "ERRORS:\n" + errs.join("\n") : "no console/page errors: YES");
  const pass = s0.tacticsVisible > 0 && s0.bgImage.includes("url") && s0.peekLbg && s0.distinctImgSizes === 1 &&
    s0.curName !== s1.curName && deep.toLowerCase() === "creativity" && budget > 0 && broken.length === 0 &&
    mobBroken === 0 && mobOrder.includes("good") && !errs.length;
  console.log(pass ? "\n✅ ALL PASSED" : "\n❌ CHECK ABOVE");
  await b.close();
  process.exit(pass ? 0 : 1);
})();
