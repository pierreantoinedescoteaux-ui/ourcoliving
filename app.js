/* =====================================================================
   RENDER LAYER  —  turns the content in data.js into the page.
   You normally never need to touch this. Edit words in data.js,
   edit looks in styles.css.
   ===================================================================== */

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// An <img> if a src exists, otherwise a labeled placeholder box (the checklist).
function frame(img) {
  if (img && img.src) {
    return `<div class="frame"><img src="${esc(img.src)}" alt="${esc(img.caption || "")}"></div>`;
  }
  const cap = (img && img.caption) || "PHOTO NEEDED";
  return `<div class="frame"><div class="ph"><span><b>To add</b>${esc(cap.replace(/^PHOTO NEEDED:\s*/i, ""))}</span></div></div>`;
}

function thumb(p) {
  if (p.hero) return `<img src="${esc(p.hero)}" alt="${esc(p.name)}">`;
  const cap = (p.heroCaption || "Hero image").replace(/^PHOTO NEEDED:\s*/i, "");
  return `<div class="ph"><span><b>To add</b>${esc(cap)}</span></div>`;
}

/* ---------- HOME ---------- */
function renderHome() {
  document.title = `Our Coliving — ${SITE.role}`;

  const intentions = INTENTIONS.map(t => `
    <div class="theme" id="${esc(t.slug)}">
      <div class="tx">
        <h3>${esc(t.title)}</h3>
        <p>${esc(t.body)}</p>
      </div>
      <div class="imgs">${(t.images || []).map(frame).join("")}</div>
    </div>`).join("");

  const cards = PROJECTS.map(p => `
    <a class="project-card ${p.featured ? "is-featured" : ""}" href="project.html?p=${esc(p.slug)}">
      <div class="thumb">${thumb(p)}</div>
      <div class="meta">
        <div>
          ${p.featured ? `<span class="tag">Featured</span>` : ""}
          <h2>${esc(p.name)}</h2>
        </div>
        <div class="place">${esc(p.location)} · ${esc(p.years)}</div>
      </div>
      <p class="summary">${esc(p.summary)}</p>
    </a>`).join("");

  document.querySelector("#app").innerHTML = `
    <nav class="nav"><div class="wrap">
      <a class="brand" href="index.html">Our Coliving</a>
      <div class="links">
        <a href="#intentions">Intentions</a>
        <a href="#work">Work</a>
        <a href="story.html">Story</a>
        <a href="inspiration.html">Inspiration</a>
        <a href="#contact">Contact</a>
      </div>
    </div></nav>

    <header class="hero"><div class="wrap">
      <div class="eyebrow">${esc(SITE.role)}</div>
      <h1>${esc(SITE.tagline)}</h1>
      <p class="intro">${esc(SITE.intro)}</p>
    </div></header>

    <section class="section" id="intentions"><div class="wrap">
      <div class="section-label">Intentions</div>
      <p class="intentions-intro">${esc(SITE.intentionsIntro)}</p>
      <div class="intentions">${intentions}</div>
    </div></section>

    <section class="section" id="work"><div class="wrap">
      <div class="section-label">Selected work</div>
      <div class="projects">${cards}</div>
    </div></section>

    <section class="about" id="about"><div class="wrap">
      <div class="section-label">About</div>
      <div class="about-grid">
        <div class="about-portrait"><img src="${esc(ABOUT.portrait)}" alt="${esc(SITE.name)}"></div>
        <div class="about-text">
          <p class="about-lead">${esc(ABOUT.lead)}</p>
          <p class="about-body">${esc(ABOUT.body)}</p>
        </div>
      </div>
      <div class="about-gallery">${ABOUT.gallery.map(g => `<div class="frame"><img src="${esc(g)}" alt=""></div>`).join("")}</div>
    </div></section>

    <footer class="footer" id="contact"><div class="wrap">
      <h2>Let's talk about your space.</h2>
      <a class="mail" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
      <div class="fine">© ${esc(SITE.name)}</div>
    </div></footer>
  `;
}

/* ---------- PROJECT DETAIL ---------- */
function renderProject() {
  const slug = new URLSearchParams(location.search).get("p");
  const p = PROJECTS.find(x => x.slug === slug) || PROJECTS[0];
  document.title = `${p.name} — ${SITE.name}`;

  const stats = (p.stats || []).map(s => `
    <div class="stat"><div class="k">${esc(s.label)}</div><div class="v">${esc(s.value)}</div></div>`).join("");

  const story = (p.sections || []).map(sec => {
    const gallery = (sec.images && sec.images.length)
      ? `<div class="gallery">${sec.images.map(frame).join("")}</div>` : "";
    return `<div class="block">
      <h2>${esc(sec.heading)}</h2>
      <p>${esc(sec.body)}</p>
      ${gallery}
    </div>`;
  }).join("");

  document.querySelector("#app").innerHTML = `
    ${navHTML()}

    <div class="wrap"><a class="back" href="index.html#work">← All work</a></div>

    <div class="wrap">
      <div class="detail-hero"><div class="frame">${p.hero ? `<img src="${esc(p.hero)}" alt="${esc(p.name)}">` : `<div class="ph"><span><b>To add</b>${esc((p.heroCaption||"Hero image").replace(/^PHOTO NEEDED:\s*/i,""))}</span></div>`}</div></div>

      <div class="detail-head">
        <h1>${esc(p.name)}</h1>
        <p class="summary">${esc(p.summary)}</p>
      </div>

      <div class="stats">${stats}</div>

      <div class="story">${story}</div>
    </div>

    <footer class="footer"><div class="wrap">
      <h2>Let's talk about your space.</h2>
      <a class="mail" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
      <div class="fine">© ${esc(SITE.name)}</div>
    </div></footer>
  `;
}

/* ---------- shared nav + footer — delegated to site-nav.js when loaded ---------- */
function navHTML() {
  if (window.SITENAV) { SITENAV.injectCss(); return SITENAV.html(); }
  return `<nav class="nav"><div class="wrap">
    <a class="brand" href="index.html">Our Coliving</a>
    <div class="links">
      <a href="manifesto.html">Manifesto</a>
      <a href="map.html">Coliving Atlas</a>
      <a href="design.html">Design for Connection</a>
      <a href="about.html">About</a>
    </div>
  </div></nav>`;
}
function footerHTML() {
  if (window.SITENAV) return SITENAV.footerHtml();
  return `<footer class="footer"><div class="wrap">
    <h2>Let's talk about your space.</h2>
    <a class="mail" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
    <div class="fine">© ${esc(SITE.name)}</div>
  </div></footer>`;
}

/* ---------- STORY: editorial timeline + click-to-zoom detail ---------- */
// img frame that falls back to a labeled "to add" placeholder
function imgFrame(m, cls) {
  if (m && m.src) return `<div class="${cls}"><img src="${esc(m.src)}" alt="${esc(m.caption || "")}"></div>`;
  const cap = ((m && m.caption) || "photo").replace(/^PHOTO NEEDED:\s*/i, "");
  return `<div class="${cls}"><div class="ph"><span><b>To add</b>${esc(cap)}</span></div></div>`;
}

function renderStory() {
  const slug = (location.hash.match(/entry=([\w-]+)/) || [])[1];
  if (slug) return renderStoryDetail(slug);

  document.title = `Story — ${SITE.name}`;
  const entries = STORY.entries.map(e => {
    const media = e.media || [];
    const bubbles = (e.bubbles || []).map(b => `<p class="bubble">${esc(b)}</p>`).join("");
    const more = (e.detail && e.detail.steps && e.detail.steps.length)
      ? `<a class="tl-more" href="#entry=${esc(e.slug)}">Read the full story →</a>` : "";
    const accent = media[1] ? imgFrame(media[1], "tl-accent") : "";
    return `<article class="tl-entry">
      <div class="tl-text">
        <div class="tl-year">${esc(e.year)}</div>
        <h3>${esc(e.title)}</h3>
        <div class="bubbles">${bubbles}</div>
        ${more}
      </div>
      <div class="tl-visual">
        ${imgFrame(media[0], "tl-main")}
        ${accent}
      </div>
    </article>`;
  }).join("");

  document.querySelector("#app").innerHTML = `
    ${navHTML()}
    <header class="story-hero"><div class="wrap">
      <div class="section-label">Story</div>
      <h1 class="story-title">${esc(STORY.intro)}</h1>
    </div></header>
    <div class="wrap"><div class="timeline">${entries}</div></div>
    ${footerHTML()}
  `;
  window.scrollTo(0, 0);
}

function renderStoryDetail(slug) {
  const e = STORY.entries.find(x => x.slug === slug);
  if (!e || !e.detail) { location.hash = ""; return; }
  document.title = `${e.title} — ${SITE.name}`;

  const steps = (e.detail.steps || []).map((s, i) => {
    const imgs = s.images || [];
    const visual = imgs.length
      ? `<div class="sd-visual">${imgs.map(m => imgFrame(m, "sd-img")).join("")}</div>` : "";
    return `<section class="sd-step ${imgs.length ? "" : "sd-step--solo"}">
      <div class="sd-text">
        <span class="sd-num">${String(i + 1).padStart(2, "0")}</span>
        <h2>${esc(s.heading)}</h2>
        <p>${esc(s.body)}</p>
      </div>
      ${visual}
    </section>`;
  }).join("");

  document.querySelector("#app").innerHTML = `
    ${navHTML()}
    <div class="wrap"><a class="back" href="#">← Timeline</a></div>
    <header class="sd-head"><div class="wrap">
      <div class="sd-year">${esc(e.year)}</div>
      <h1>${esc(e.title)}</h1>
      ${e.detail.summary ? `<p class="sd-summary">${esc(e.detail.summary)}</p>` : ""}
    </div></header>
    <div class="wrap"><div class="sd-steps">${steps}</div></div>
    ${footerHTML()}
  `;
  window.scrollTo(0, 0);
}

/* ---------- HOPE: generated geometric forms (no photos needed) ---------- */
function hopeForm(name) {
  const svg = inner => `<svg class="hope-svg" viewBox="0 0 320 320" fill="none" stroke-width="1.4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  if (name === "alone") {
    return svg(`
      <circle cx="160" cy="160" r="132" stroke="#e2d9cb"/>
      <circle cx="160" cy="160" r="80" stroke="#d8ccba"/>
      <circle cx="160" cy="160" r="9" fill="#b5613c" stroke="none"/>`);
  }

  if (name === "scattered") {
    const pts = [[78,96],[134,212],[216,80],[250,176],[98,250],[238,256],[188,44],[60,150]];
    return svg(
      pts.map(([x,y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#9a9088" stroke="none"/>`).join("") +
      `<circle cx="162" cy="150" r="8" fill="#b5613c" stroke="none"/>`);
  }

  if (name === "connected") {
    const nodes = [[108,104],[214,108],[96,198],[224,200],[160,86],[150,236]];
    const spokes = nodes.map(n => `<line x1="160" y1="160" x2="${n[0]}" y2="${n[1]}" stroke="#d3c7b4"/>`).join("");
    const ring =
      `<line x1="108" y1="104" x2="160" y2="86" stroke="#d3c7b4"/>` +
      `<line x1="214" y1="108" x2="160" y2="86" stroke="#d3c7b4"/>` +
      `<line x1="96" y1="198" x2="150" y2="236" stroke="#d3c7b4"/>` +
      `<line x1="224" y1="200" x2="150" y2="236" stroke="#d3c7b4"/>`;
    const dots = nodes.map(n => `<circle cx="${n[0]}" cy="${n[1]}" r="8" fill="#211c17" stroke="none"/>`).join("");
    return svg(`${spokes}${ring}${dots}<circle cx="160" cy="160" r="11" fill="#b5613c" stroke="none"/>`);
  }

  if (name === "village") {
    const xs = [70,130,190,250], ys = [70,130,190,250];
    let lines = "";
    ys.forEach(y => { lines += `<line x1="70" y1="${y}" x2="250" y2="${y}" stroke="#e0d6c5"/>`; });
    xs.forEach(x => { lines += `<line x1="${x}" y1="70" x2="${x}" y2="250" stroke="#e0d6c5"/>`; });
    let dots = "";
    ys.forEach(y => xs.forEach(x => { dots += `<circle cx="${x}" cy="${y}" r="4" fill="#c9bba6" stroke="none"/>`; }));
    const houses = [[130,130],[190,190],[250,70],[70,250],[190,70]];
    const roofs = houses.map(([x,y]) =>
      `<path d="M${x-11} ${y-3} L${x} ${y-18} L${x+11} ${y-3} Z" fill="#b5613c" stroke="none"/>` +
      `<circle cx="${x}" cy="${y}" r="5" fill="#b5613c" stroke="none"/>`).join("");
    return svg(`${lines}${dots}${roofs}`);
  }

  return svg("");
}

/* ---------- HOPE page ---------- */
function renderHope() {
  document.title = `Vision — ${SITE.name}`;

  const chapters = HOPE.chapters.map(c => `
    <section class="hope-chapter">
      <div class="hc-visual">${hopeForm(c.form)}</div>
      <div class="hc-text">
        <div class="hc-kicker">${esc(c.kicker)}</div>
        <h2>${esc(c.title)}</h2>
        <p>${esc(c.body)}</p>
      </div>
    </section>`).join("");

  const cr = HOPE.crises;
  const crisisItems = cr.items.map(c => `
    <section class="crisis">
      <div class="crisis-stat">
        <div class="crisis-num" data-target="${c.stat}" data-dec="${c.decimals}" data-suffix="${esc(c.suffix)}">0${esc(c.suffix)}</div>
        <div class="crisis-statlabel">${esc(c.statLabel)}</div>
      </div>
      <div class="crisis-text">
        <div class="crisis-kicker">${esc(c.kicker)}</div>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.body)}</p>
        <ul class="crisis-facts">${c.facts.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
      </div>
    </section>`).join("");

  const crisesSection = `
    <section class="crises"><div class="wrap">
      <div class="section-label">${esc(cr.eyebrow)}</div>
      <p class="crises-intro">${esc(cr.intro)}</p>
      <div class="crisis-list">${crisisItems}</div>
      <div class="crises-close">
        <div class="crisis-kicker">${esc(cr.close.kicker)}</div>
        <p class="cc-body">${esc(cr.close.body)}</p>
        <blockquote class="cc-quote">${esc(cr.close.quote)}</blockquote>
        <div class="cc-cite">${esc(cr.close.cite)}</div>
        <p class="cc-turn">${esc(cr.close.kicker2)}</p>
      </div>
    </div></section>`;

  document.querySelector("#app").innerHTML = `
    ${navHTML()}
    <header class="hope-hero"><div class="wrap">
      <div class="eyebrow">${esc(HOPE.eyebrow)}</div>
      <h1 class="hope-thesis">${esc(HOPE.thesis)}</h1>
      <p class="hope-lede">${esc(HOPE.lede)}</p>
    </div></header>

    ${crisesSection}

    <div class="wrap"><div class="hope-journey"><div class="section-label">${esc(HOPE.journeyLabel || "How I found the answer")}</div></div></div>
    <div class="wrap"><div class="hope-chapters">${chapters}</div></div>

    <section class="hope-close"><div class="wrap">
      <h2>${esc(HOPE.close.line)}</h2>
      <a class="hope-cta" href="index.html#contact">${esc(HOPE.close.cta)} →</a>
    </div></section>

    ${footerHTML()}
  `;
  window.scrollTo(0, 0);

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.18 });
    document.querySelectorAll(".hope-chapter, .hope-close, .crisis, .crises-close").forEach(el => { el.classList.add("reveal"); io.observe(el); });

    const numObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); numObs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    document.querySelectorAll(".crisis-num").forEach(el => numObs.observe(el));
  }
}

/* animated count-up for the crisis stats */
function animateCount(el) {
  const target = parseFloat(el.getAttribute("data-target")) || 0;
  const dec = parseInt(el.getAttribute("data-dec"), 10) || 0;
  const suffix = el.getAttribute("data-suffix") || "";
  const dur = 1500, startT = performance.now();
  const fmt = v => (dec > 0 ? v.toFixed(dec) : Math.round(v).toLocaleString("en-US")) + suffix;
  function step(now) {
    const p = Math.min(1, (now - startT) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(target * eased);
    if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target);
  }
  requestAnimationFrame(step);
}

/* ---------- INSPIRATION: generated geometric marks (3 variants per category) ---------- */
function inspMark(cat, i) {
  const v = i % 3;
  const svg = inner => `<svg class="insp-svg" viewBox="0 0 120 120" fill="none" stroke="#211c17" stroke-width="2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  if (cat === "books") {
    if (v === 0) return svg(`<rect x="22" y="38" width="14" height="58" fill="#211c17" stroke="none"/><rect x="42" y="52" width="14" height="44" fill="#b5613c" stroke="none"/><rect x="62" y="32" width="14" height="64" fill="#211c17" stroke="none"/><rect x="82" y="56" width="14" height="40" fill="#211c17" stroke="none"/>`);
    if (v === 1) return svg(`<path d="M60 38 L30 46 L30 86 L60 80 Z" fill="#efe9df" stroke="#211c17"/><path d="M60 38 L90 46 L90 86 L60 80 Z" fill="#211c17" stroke="none"/><line x1="60" y1="38" x2="60" y2="80" stroke="#b5613c"/>`);
    return svg(`<rect x="28" y="40" width="64" height="13" fill="#211c17" stroke="none"/><rect x="24" y="57" width="68" height="13" fill="#b5613c" stroke="none"/><rect x="32" y="74" width="56" height="13" fill="#211c17" stroke="none"/>`);
  }

  if (cat === "projects") {
    if (v === 0) return svg(`<rect x="26" y="30" width="38" height="30" fill="#211c17" stroke="none"/><rect x="70" y="30" width="24" height="60" fill="#b5613c" stroke="none"/><rect x="26" y="66" width="38" height="24" fill="#d3c7b4" stroke="none"/>`);
    if (v === 1) return svg(`<circle cx="60" cy="60" r="36" stroke="#211c17"/><circle cx="60" cy="60" r="22" stroke="#d3c7b4"/><circle cx="60" cy="60" r="7" fill="#b5613c" stroke="none"/>`);
    return svg(`<rect x="34" y="30" width="52" height="60" stroke="#211c17"/><rect x="42" y="40" width="9" height="9" fill="#211c17" stroke="none"/><rect x="56" y="40" width="9" height="9" fill="#211c17" stroke="none"/><rect x="70" y="40" width="9" height="9" fill="#211c17" stroke="none"/><rect x="42" y="55" width="9" height="9" fill="#211c17" stroke="none"/><rect x="70" y="55" width="9" height="9" fill="#211c17" stroke="none"/><rect x="54" y="68" width="12" height="22" fill="#b5613c" stroke="none"/>`);
  }

  /* models */
  if (v === 0) return svg(`<line x1="60" y1="62" x2="60" y2="34" stroke="#d3c7b4"/><line x1="60" y1="62" x2="34" y2="84" stroke="#d3c7b4"/><line x1="60" y1="62" x2="86" y2="84" stroke="#d3c7b4"/><circle cx="60" cy="34" r="8" fill="#211c17" stroke="none"/><circle cx="34" cy="84" r="8" fill="#211c17" stroke="none"/><circle cx="86" cy="84" r="8" fill="#211c17" stroke="none"/><circle cx="60" cy="62" r="10" fill="#b5613c" stroke="none"/>`);
  if (v === 1) return svg(`<rect x="28" y="28" width="64" height="64" stroke="#211c17"/><rect x="42" y="42" width="36" height="36" stroke="#d3c7b4"/><rect x="53" y="53" width="14" height="14" fill="#b5613c" stroke="none"/>`);
  return svg(`<line x1="60" y1="38" x2="38" y2="80" stroke="#d3c7b4"/><line x1="60" y1="38" x2="82" y2="80" stroke="#d3c7b4"/><line x1="38" y1="80" x2="82" y2="80" stroke="#d3c7b4"/><circle cx="60" cy="38" r="8" fill="#211c17" stroke="none"/><circle cx="38" cy="80" r="8" fill="#b5613c" stroke="none"/><circle cx="82" cy="80" r="8" fill="#211c17" stroke="none"/>`);
}

/* ---------- INSPIRATION page ---------- */
function renderInspiration() {
  document.title = `Inspiration — ${SITE.name}`;

  const sections = INSPIRATION.groups.map(g => {
    const cards = g.items.map((it, i) => {
      const coverCls = g.key === "books" ? " insp-photo--cover" : "";
      const visual = it.img
        ? `<div class="insp-mark insp-photo${coverCls}"><img src="${esc(it.img)}" alt="${esc(it.title)}"></div>`
        : `<div class="insp-mark">${inspMark(g.key, i)}</div>`;
      const inner = `${visual}
        <div class="insp-text">
          <div class="insp-meta">${esc(it.meta)}</div>
          <h3>${esc(it.title)}</h3>
          <p>${esc(it.note)}</p>
          ${it.slug ? `<span class="insp-more">Read the case study →</span>` : ""}
        </div>`;
      return it.slug
        ? `<a class="insp-card insp-card--link" href="detail.html?item=${esc(it.slug)}">${inner}</a>`
        : `<article class="insp-card">${inner}</article>`;
    }).join("");
    return `<section class="section"><div class="wrap">
      <div class="section-label">${esc(g.label)}</div>
      <div class="insp-grid">${cards}</div>
    </div></section>`;
  }).join("");

  document.querySelector("#app").innerHTML = `
    ${navHTML()}
    <header class="hope-hero"><div class="wrap">
      <div class="eyebrow">${esc(INSPIRATION.eyebrow)}</div>
      <h1 class="hope-thesis">${esc(INSPIRATION.title)}</h1>
      <p class="hope-lede">${esc(INSPIRATION.lede)}</p>
    </div></header>
    ${sections}
    ${footerHTML()}
  `;
  window.scrollTo(0, 0);

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".insp-card").forEach(el => { el.classList.add("reveal"); io.observe(el); });
  }
}

/* ---------- WORK: dedicated selected-work page ---------- */
function renderWork() {
  document.title = `Work — ${SITE.name}`;
  const cards = PROJECTS.map(p => `
    <a class="project-card ${p.featured ? "is-featured" : ""}" href="project.html?p=${esc(p.slug)}">
      <div class="thumb">${thumb(p)}</div>
      <div class="meta">
        <div>
          ${p.featured ? `<span class="tag">Featured</span>` : ""}
          <h2>${esc(p.name)}</h2>
        </div>
        <div class="place">${esc(p.location)}${String(p.years || "").indexOf("[") < 0 && p.years ? ` · ${esc(p.years)}` : ""}</div>
      </div>
      <p class="summary">${esc(p.summary)}</p>
    </a>`).join("");

  document.querySelector("#app").innerHTML = `
    ${navHTML()}
    <header class="hope-hero"><div class="wrap">
      <div class="eyebrow">Selected work</div>
      <h1 class="hope-thesis">Three houses. One question: how do people live well together?</h1>
      <p class="hope-lede">${esc(SITE.intentionsIntro.replace(/\s*\[edit[^\]]*\]/gi, ""))}</p>
    </div></header>
    <section class="section"><div class="wrap">
      <div class="projects">${cards}</div>
    </div></section>
    ${footerHTML()}
  `;
  window.scrollTo(0, 0);
}

/* ---------- DETAIL: reusable case-study page (book / project / model) ---------- */
function renderDetail() {
  const slug = new URLSearchParams(location.search).get("item");
  const d = DETAILS[slug];
  if (!d) { location.href = "inspiration.html"; return; }
  document.title = `${d.title} — ${SITE.name}`;

  const hero = d.hero
    ? `<figure class="dt-hero"><div class="frame"><img src="${esc(d.hero)}" alt="${esc(d.heroCaption || d.title)}"></div>${d.heroCaption ? `<figcaption class="dt-cap">${esc(d.heroCaption)}</figcaption>` : ""}</figure>`
    : `<div class="dt-hero dt-hero--mark">${inspMark(d.markCat || "models", 0)}</div>`;

  const blocks = (d.blocks || []).map(b => {
    const visual = b.image
      ? `<figure class="dt-visual"><div class="frame"><img src="${esc(b.image)}" alt="${esc(b.caption || "")}"></div>${b.caption ? `<figcaption class="dt-cap">${esc(b.caption)}</figcaption>` : ""}</figure>`
      : "";
    const quote = b.quote ? `<blockquote class="dt-quote">${esc(b.quote)}</blockquote>` : "";
    return `<section class="dt-block ${b.image ? "" : "dt-block--solo"}">
      <div class="dt-text">
        ${b.heading ? `<h2>${esc(b.heading)}</h2>` : ""}
        <p>${esc(b.body)}</p>
        ${quote}
      </div>
      ${visual}
    </section>`;
  }).join("");

  const takeaways = (d.takeaways && d.takeaways.length)
    ? `<section class="dt-takeaways"><div class="wrap">
        <div class="section-label">What I take from it</div>
        <ul class="dt-list">${d.takeaways.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
      </div></section>` : "";

  const link = d.link
    ? `<a class="dt-source" href="${esc(d.link.url)}" target="_blank" rel="noopener">${esc(d.link.label)} →</a>` : "";

  document.querySelector("#app").innerHTML = `
    ${navHTML()}
    <div class="wrap"><a class="back" href="inspiration.html">← Inspiration</a></div>
    <div class="wrap">
      <header class="dt-head">
        <div class="dt-kind">${esc(d.kind)}</div>
        <h1>${esc(d.title)}</h1>
        <div class="dt-meta">${esc(d.meta)}</div>
        <p class="dt-lede">${esc(d.lede)}</p>
        ${link}
      </header>
      ${hero}
      <div class="dt-body">${blocks}</div>
    </div>
    ${takeaways}
    ${footerHTML()}
  `;
  window.scrollTo(0, 0);

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".dt-block").forEach(el => { el.classList.add("reveal"); io.observe(el); });
  }
}
