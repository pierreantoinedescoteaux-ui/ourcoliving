/* GLOSSARY BOOK — loaded on every page by site-nav.js.
   A closed book floats bottom-right. Click: it grows to the centre and
   opens (intro, search and A to Z on the left page, definitions on the
   right). Phones get one full-screen page.
   Words on the page that are in the glossary get a dotted underline
   (first time each word appears, at most one per paragraph); hover or
   focus shows a small definition card. The first card a reader ever
   sees makes the book glow gold for 3s.
   Turn off: <body data-nogloss> (everything) or data-nogloss-underline
   (no underlines). Elements with data-gloss="term-id" get the card too.
   Definitions live in glossary-data.js, fetched when the browser is idle. */
(function () {
  "use strict";
  if (window.GLOSSARY || document.body.hasAttribute("data-nogloss")) return;

  var DATA = null, byId = {}, loading = null;
  var BASE = (document.currentScript && document.currentScript.src || "").replace(/glossary\.js.*$/, "");
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  function load() {
    if (DATA) return Promise.resolve(DATA);
    if (loading) return loading;
    loading = new Promise(function (res) {
      var s = document.createElement("script");
      s.src = BASE + "glossary-data.js";
      s.onload = function () {
        DATA = window.GLOSSARY_DATA || { terms: [] };
        DATA.terms.sort(function (a, b) { return a.term.localeCompare(b.term); });
        DATA.terms.forEach(function (t) { byId[t.id] = t; });
        res(DATA);
      };
      s.onerror = function () { DATA = { terms: [] }; res(DATA); };
      document.head.appendChild(s);
    });
    return loading;
  }

  /* ---------- styles ---------- */
  var css =
    ".gl-btn{position:fixed;right:clamp(10px,2vw,22px);bottom:calc(clamp(14px,2.6vh,26px) + 58px);z-index:76;width:74px;height:74px;border:0;padding:0;background:none;cursor:pointer;" +
    "animation:glFloat 4.5s ease-in-out infinite;filter:drop-shadow(0 12px 16px rgba(34,48,31,.35));transition:filter .4s}" +
    ".gl-btn img{width:100%;height:100%;object-fit:contain;display:block}" +
    ".gl-btn:hover{filter:drop-shadow(0 14px 20px rgba(34,48,31,.45)) brightness(1.06)}" +
    ".gl-btn .gl-tip{position:absolute;right:calc(100% + 8px);top:50%;transform:translateY(-50%);white-space:nowrap;font:600 12px/1 var(--grotesk,system-ui);letter-spacing:.08em;" +
    "background:#fffdf8;color:#22301f;border:1px solid rgba(34,48,31,.18);border-radius:99px;padding:8px 12px;opacity:0;transition:opacity .25s;pointer-events:none}" +
    ".gl-btn:hover .gl-tip,.gl-btn:focus-visible .gl-tip{opacity:1}" +
    ".gl-btn.glow{filter:drop-shadow(0 0 18px rgba(232,180,80,.95)) drop-shadow(0 0 6px rgba(255,214,120,.9))}" +
    "@keyframes glFloat{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-6px) rotate(1deg)}}" +
    "body:has(.snav.menuopen) .gl-btn{opacity:0;pointer-events:none}" +
    "html:has(.gl-ov.open) .pa-editbtn,html:has(.gl-ov.open) .stotop{visibility:hidden}" +
    ".gl-hint{margin-top:auto;font-size:14px;line-height:1.45;color:#6b6350;font-style:italic}" +
    ".gl-hint span{border-bottom:1.5px dotted rgba(143,98,21,.7);font-style:normal}" +
    ".gl-ov{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;background:rgba(24,32,22,0);transition:background .45s;pointer-events:none}" +
    ".gl-ov.open{background:rgba(24,32,22,.55);pointer-events:auto}" +
    ".gl-book{position:relative;width:min(94vw,calc(90vh * 1.532),1240px);aspect-ratio:1800/1175;background:url(" + "\"__BOOK__\"" + ") center/contain no-repeat;" +
    "transition:transform .6s cubic-bezier(.2,.8,.2,1),opacity .35s;color:#2b2416;font-family:var(--grotesk,system-ui)}" +
    ".gl-page{position:absolute;top:6.5%;height:76%;width:37%;display:flex;flex-direction:column;opacity:0;transition:opacity .4s .15s}" +
    ".gl-ov.ready .gl-page{opacity:1}" +
    ".gl-left{left:10%}.gl-right{left:53%}" +
    ".gl-eyebrow{font:700 12px/1 var(--grotesk,system-ui);letter-spacing:.24em;text-transform:uppercase;color:#8f6215}" +
    ".gl-title{font-family:var(--serif,'Zodiak',Georgia,serif);font-weight:400;font-size:clamp(1.5rem,2.3vw,2.2rem);line-height:1.05;margin:10px 0 12px;color:#22301f}" +
    ".gl-intro{font-size:clamp(15px,1.15vw,17px);line-height:1.5;color:#4b4535;margin:0 0 14px}" +
    ".gl-search{width:100%;font:inherit;font-size:16px;padding:10px 14px;border:1.5px solid rgba(91,72,30,.35);border-radius:99px;background:rgba(255,253,245,.8);color:#22301f;outline:none}" +
    ".gl-search:focus{border-color:#8f6215;background:#fffdf5}" +
    ".gl-az{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:14px}" +
    ".gl-az button{font:500 15px/1 var(--serif,'Zodiak',Georgia,serif);min-height:36px;border:0;border-radius:8px;background:none;color:#22301f;cursor:pointer}" +
    ".gl-az button:hover{background:rgba(217,154,61,.18)}.gl-az button:disabled{color:rgba(43,36,22,.25);cursor:default;background:none}" +
    ".gl-list{overflow-y:auto;flex:1;padding-right:10px;scrollbar-width:thin;scrollbar-color:rgba(143,98,21,.4) transparent}" +
    ".gl-letter{font:italic 400 1.6rem/1 var(--serif,'Zodiak',Georgia,serif);color:#8f6215;margin:14px 0 6px;border-bottom:1px solid rgba(143,98,21,.25);padding-bottom:4px}" +
    ".gl-letter:first-child{margin-top:0}" +
    ".gl-entry{padding:10px 0 12px;border-bottom:1px dotted rgba(91,72,30,.22);scroll-margin-top:8px;transition:background .6s}" +
    ".gl-entry h3{font:400 1.18rem/1.2 var(--serif,'Zodiak',Georgia,serif);color:#22301f;margin:0 0 4px}" +
    ".gl-entry p{font-size:clamp(15px,1.1vw,16.5px);line-height:1.5;color:#3d3727;margin:0}" +
    ".gl-entry a{display:inline-block;margin-top:6px;font-size:13px;font-weight:700;color:#3c6b32;border-bottom:1.5px solid rgba(60,107,50,.4)}" +
    ".gl-entry.hit{background:rgba(232,180,80,.22)}" +
    ".gl-none{color:#6b6350;font-style:italic;padding:10px 0}" +
    ".gl-close{position:absolute;top:1%;right:3.5%;width:44px;height:44px;border-radius:50%;border:1.5px solid rgba(34,48,31,.3);background:#fffdf8;color:#22301f;font-size:1.3rem;cursor:pointer;opacity:0;transition:opacity .3s .3s}" +
    ".gl-ov.ready .gl-close{opacity:1}" +
    ".gl-flip{position:absolute;left:50.3%;top:3.6%;width:42.6%;height:81.5%;transform-origin:left center;background:linear-gradient(90deg,#efe3c4,#f7eedb 30%,#f3e8cf);" +
    "border-radius:0 6px 6px 0;box-shadow:inset 18px 0 24px -18px rgba(80,60,20,.35);backface-visibility:hidden;pointer-events:none}" +
    ".gl-ov.flip .gl-flip{animation:glFlip .7s cubic-bezier(.45,.05,.3,1) forwards}" +
    "@keyframes glFlip{0%{transform:perspective(1600px) rotateY(0)}99%{opacity:1}100%{transform:perspective(1600px) rotateY(-180deg);opacity:0}}" +
    /* the dotted words and their card */
    ".gl-term{border-bottom:1.5px dotted rgba(143,98,21,.7);cursor:help}" +
    ".gl-term:hover,.gl-term:focus{background:rgba(232,180,80,.18);outline:none}" +
    ".gl-card{position:fixed;z-index:1900;max-width:320px;background:#fffaf0;border:1px solid rgba(143,98,21,.35);border-radius:14px;padding:14px 16px;" +
    "box-shadow:0 18px 40px -16px rgba(34,48,31,.45);color:#2b2416;font:400 15px/1.45 var(--grotesk,system-ui);opacity:0;transform:translateY(4px);transition:opacity .2s,transform .2s;pointer-events:none}" +
    ".gl-card.show{opacity:1;transform:none;pointer-events:auto}" +
    ".gl-card b{display:block;font:400 1.08rem/1.2 var(--serif,'Zodiak',Georgia,serif);color:#22301f;margin-bottom:4px}" +
    ".gl-card button{margin-top:8px;font:700 13px/1 var(--grotesk,system-ui);color:#3c6b32;background:none;border:0;padding:6px 0;cursor:pointer}" +
    /* phones: one full-screen page */
    "@media(max-width:760px){" +
    ".gl-btn{width:60px;height:60px;bottom:calc(clamp(14px,2.6vh,26px) + 56px)}.gl-btn .gl-tip{display:none}" +
    ".gl-book{width:100vw;height:100dvh;aspect-ratio:auto;background:#f6efdc;overflow-y:auto;padding:64px 18px 40px}" +
    ".gl-page{position:static;width:auto;height:auto}" +
    ".gl-list{overflow:visible;padding:0;margin-top:22px}" +
    ".gl-az{grid-template-columns:repeat(9,1fr)}.gl-az button{min-height:44px;font-size:16px}" +
    ".gl-entry p{font-size:16px}.gl-entry a{padding:12px 0 6px}" +
    ".gl-close{position:fixed;top:12px;right:12px}.gl-flip{display:none}}" +
    "@media(prefers-reduced-motion:reduce){.gl-btn{animation:none}.gl-book,.gl-page{transition:none}.gl-ov.flip .gl-flip{animation:none;opacity:0}}";

  function injectCss() {
    var st = document.createElement("style");
    st.id = "gl-css";
    st.textContent = css.replace("__BOOK__", BASE + "images/glossary/book-open.webp");
    document.head.appendChild(st);
  }

  /* ---------- the floating closed book ---------- */
  var btn, ov, book, list, search, az;
  function mountButton() {
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gl-btn";
    btn.setAttribute("aria-label", "Open the glossary");
    btn.innerHTML = '<img src="' + BASE + 'images/glossary/book-closed.webp" alt="" width="74" height="74"><span class="gl-tip">Glossary</span>';
    btn.addEventListener("click", function () { open(); });
    btn.addEventListener("pointerenter", function () { load(); var i = new Image(); i.src = BASE + "images/glossary/book-open.webp"; }, { once: true });
    document.body.appendChild(btn);
  }

  /* ---------- the open book ---------- */
  function build() {
    ov = document.createElement("div");
    ov.className = "gl-ov";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", "Glossary");
    ov.innerHTML =
      '<div class="gl-book">' +
        '<div class="gl-page gl-left">' +
          '<span class="gl-eyebrow">Glossary</span>' +
          '<h2 class="gl-title">Words for living together</h2>' +
          '<p class="gl-intro">' + esc(DATA.intro || "") + '</p>' +
          '<input class="gl-search" type="search" placeholder="Look up a word" aria-label="Look up a word">' +
          '<div class="gl-az" aria-label="Jump to a letter"></div>' +
          '<p class="gl-hint">Across the site, words with a <span>dotted line</span> are in this book. Hover or tap one to read it there.</p>' +
        '</div>' +
        '<div class="gl-page gl-right"><div class="gl-list" tabindex="0" aria-live="polite"></div></div>' +
        '<div class="gl-flip" aria-hidden="true"></div>' +
        '<button type="button" class="gl-close" aria-label="Close the glossary">×</button>' +
      '</div>';
    document.body.appendChild(ov);
    book = ov.querySelector(".gl-book");
    list = ov.querySelector(".gl-list");
    search = ov.querySelector(".gl-search");
    az = ov.querySelector(".gl-az");
    ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
    ov.querySelector(".gl-close").addEventListener("click", close);
    search.addEventListener("input", function () { render(search.value); });
    az.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-l]"); if (!b) return;
      search.value = ""; render("");
      var h = list.querySelector('[data-letter="' + b.dataset.l + '"]');
      if (h) h.scrollIntoView({ block: "start", behavior: "smooth" });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && ov.classList.contains("open")) close(); });
    render("");
  }

  function letterOf(t) { return t.term.charAt(0).toUpperCase(); }
  function render(q) {
    q = (q || "").trim().toLowerCase();
    var terms = DATA.terms.filter(function (t) {
      if (!q) return true;
      return (t.term + " " + (t.aliases || []).join(" ") + " " + t.def).toLowerCase().indexOf(q) >= 0;
    });
    var used = {}, html = "", cur = "";
    terms.forEach(function (t) {
      var L = letterOf(t);
      if (L !== cur) { cur = L; used[L] = 1; html += '<div class="gl-letter" data-letter="' + L + '">' + L + "</div>"; }
      var ext = /^https?:/.test(t.link || "");
      html += '<div class="gl-entry" id="gl-' + esc(t.id) + '"><h3>' + esc(t.term) + "</h3><p>" + esc(t.def) + "</p>" +
        (t.link ? '<a href="' + esc(t.link) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(t.linkLabel || "Read more") + (ext ? " ↗" : " →") + "</a>" : "") + "</div>";
    });
    list.innerHTML = html || '<p class="gl-none">No word matches yet. If it should be here, tell me and we’ll add it.</p>';
    if (!q) {
      var all = {}; DATA.terms.forEach(function (t) { all[letterOf(t)] = 1; });
      az.innerHTML = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(function (L) {
        return '<button type="button" data-l="' + L + '"' + (all[L] ? "" : " disabled") + ">" + L + "</button>";
      }).join("");
    }
  }

  var lastFocus = null;
  function open(id) {
    load().then(function () {
      if (!ov) build();
      lastFocus = document.activeElement;
      hideCard();
      var r = btn.getBoundingClientRect();
      ov.style.display = "flex";
      var b = book.getBoundingClientRect();
      var s = Math.max(.06, r.width / b.width);
      var dx = (r.left + r.width / 2) - (b.left + b.width / 2), dy = (r.top + r.height / 2) - (b.top + b.height / 2);
      book.style.transition = "none";
      book.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + s + ")";
      book.style.opacity = "0";
      void book.offsetWidth;
      book.style.transition = "";
      ov.classList.add("open");
      book.style.transform = "none";
      book.style.opacity = "1";
      btn.style.visibility = "hidden";
      setTimeout(function () { ov.classList.add("flip"); }, 420);
      setTimeout(function () {
        ov.classList.add("ready");
        if (id && byId[id]) goTo(id); else if (window.innerWidth > 760) search.focus({ preventScroll: true });
      }, 820);
      document.documentElement.style.overflow = "hidden";
    });
  }
  function goTo(id) {
    search.value = ""; render("");
    var el = document.getElementById("gl-" + id);
    if (!el) return;
    el.scrollIntoView({ block: "start" });
    el.classList.add("hit");
    setTimeout(function () { el.classList.remove("hit"); }, 2200);
  }
  function close() {
    if (!ov) return;
    ov.classList.remove("open", "ready", "flip");
    book.style.opacity = "0";
    book.style.transform = "scale(.9)";
    document.documentElement.style.overflow = "";
    btn.style.visibility = "";
    setTimeout(function () { if (!ov.classList.contains("open")) ov.style.display = "none"; }, 450);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ---------- hover cards ---------- */
  var card = null, hideT = null;
  function showCard(el) {
    var t = byId[el.getAttribute("data-gloss")];
    if (!t) return;
    clearTimeout(hideT);
    if (!card) {
      card = document.createElement("div");
      card.className = "gl-card";
      card.setAttribute("role", "tooltip");
      card.addEventListener("pointerenter", function () { clearTimeout(hideT); });
      card.addEventListener("pointerleave", hideCardSoon);
      card.addEventListener("click", function (e) { if (e.target.closest("button")) open(card.dataset.id); });
      document.body.appendChild(card);
    }
    card.dataset.id = t.id;
    card.innerHTML = "<b>" + esc(t.term) + "</b>" + esc(t.def) + '<br><button type="button">Open in the glossary →</button>';
    var r = el.getBoundingClientRect(), w = Math.min(320, innerWidth - 24);
    card.style.maxWidth = w + "px";
    card.classList.add("show");
    var h = card.offsetHeight;
    var left = Math.max(12, Math.min(r.left, innerWidth - w - 12));
    var top = r.bottom + 8 + h > innerHeight ? r.top - h - 8 : r.bottom + 8;
    card.style.left = left + "px";
    card.style.top = Math.max(8, top) + "px";
    if (!store("gl-seen")) { store("gl-seen", "1"); btn.classList.add("glow"); setTimeout(function () { btn.classList.remove("glow"); }, 3000); }
  }
  function hideCardSoon() { clearTimeout(hideT); hideT = setTimeout(hideCard, 220); }
  function hideCard() { if (card) card.classList.remove("show"); }
  function bindCards() {
    document.addEventListener("pointerover", function (e) {
      var el = e.target.closest && e.target.closest("[data-gloss]");
      if (el && DATA) showCard(el);
    });
    document.addEventListener("pointerout", function (e) {
      var el = e.target.closest && e.target.closest("[data-gloss]");
      if (el) hideCardSoon();
    });
    document.addEventListener("focusin", function (e) { if (e.target.matches && e.target.matches("[data-gloss]") && DATA) showCard(e.target); });
    document.addEventListener("focusout", function (e) { if (e.target.matches && e.target.matches("[data-gloss]")) hideCardSoon(); });
    /* touch: first tap shows the card, the card's button opens the book */
    document.addEventListener("click", function (e) {
      var el = e.target.closest && e.target.closest(".gl-term");
      if (el && DATA) { e.preventDefault(); showCard(el); }
    });
  }

  /* ---------- the dotted underlines ---------- */
  var BLOCKS = "main p, main li, article p, section p, .m-in p, .fnote p, .gs-foot";
  var SKIP = "a, button, h1, h2, h3, h4, h5, h6, nav, label, .pill, .gl-term, .gl-ov, .gl-card, [data-nogloss], .snav, .sfooter, script, style";
  var matchers = null, seen = {};
  function buildMatchers() {
    matchers = [];
    DATA.terms.forEach(function (t) {
      if (t.area === "map") return;
      [t.term].concat(t.aliases || []).forEach(function (w) {
        if (w && w.length > 2) matchers.push({ id: t.id, w: w, re: new RegExp("(^|[^\\p{L}])(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?:e?s)?)(?![\\p{L}])", "iu") });
      });
    });
    matchers.sort(function (a, b) { return b.w.length - a.w.length; });
  }
  function scan(root) {
    if (!DATA || document.body.hasAttribute("data-nogloss-underline")) return;
    if (!matchers) buildMatchers();
    var blocks = (root.matches && root.matches(BLOCKS)) ? [root] : root.querySelectorAll ? root.querySelectorAll(BLOCKS) : [];
    Array.prototype.forEach.call(blocks, function (blk) {
      if (blk.closest(SKIP) || blk.querySelector(".gl-term")) return;
      var walker = document.createTreeWalker(blk, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) { return n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
      });
      var n, done = false;
      while (!done && (n = walker.nextNode())) {
        for (var i = 0; i < matchers.length; i++) {
          var m = matchers[i];
          if (seen[m.id]) continue;
          var r = m.re.exec(n.nodeValue);
          if (!r) continue;
          var at = r.index + r[1].length, word = r[2];
          var after = n.splitText(at); after.splitText(word.length);
          var span = document.createElement("span");
          span.className = "gl-term";
          span.tabIndex = 0;
          span.setAttribute("data-gloss", m.id);
          span.textContent = word;
          after.parentNode.replaceChild(span, after);
          seen[m.id] = 1; done = true;
          break;
        }
      }
    });
  }
  function watch() {
    scan(document.body);
    var pending = [], timer = null;
    new MutationObserver(function (muts) {
      muts.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1 && !n.closest(".gl-ov, .gl-card")) pending.push(n); }); });
      if (pending.length && !timer) timer = setTimeout(function () { var p = pending; pending = []; timer = null; p.forEach(function (n) { if (n.isConnected) scan(n); }); }, 250);
    }).observe(document.body, { childList: true, subtree: true });
  }

  function start() {
    injectCss();
    mountButton();
    bindCards();
    var idle = window.requestIdleCallback || function (f) { setTimeout(f, 1200); };
    idle(function () { load().then(watch); });
  }
  window.GLOSSARY = { open: open, scan: function (el) { load().then(function () { scan(el || document.body); }); } };
  start();
})();
