/* =====================================================================
   SITE-NAV — one shared nav (with sub-navigation) + minimalist footer.
   Usage A (static pages): put <div data-sitenav></div> where the nav
     goes and load this script; nav renders there, footer auto-appends.
   Usage B (app.js pages): navHTML()/footerHTML() delegate to
     SITENAV.html() / SITENAV.footerHtml(); no placeholder needed.
   Active tab is auto-detected from the current filename.
   Nav structure lives HERE only — edit once, every page follows.
   ===================================================================== */
(function () {
  "use strict";

  var EMAIL = "pierreantoinedescoteaux@gmail.com";

  var ITEMS = [
    { label: "Manifesto", href: "manifesto.html", key: "manifesto", sub: [
      { label: "The story we were handed — the essay", href: "separation.html" },
      { label: "Hope: real communities", href: "projects.html" },
      { label: "Hope: books of inspiration", href: "inspiration.html" }
    ]},
    { label: "Coliving Atlas", href: "map.html", key: "atlas", sub: [
      { label: "Field guides — the 12 models", href: "type.html?t=ecovillage" },
      { label: "Resources directory", href: "resources.html" }
    ]},
    { label: "Design for Connection", href: "design.html", key: "design", sub: [] },
    { label: "About", href: "about.html", key: "about", sub: [
      { label: "My story", href: "story.html" },
      { label: "Work & case studies", href: "work.html" }
    ]}
  ];

  var PAGE_KEY = {
    "manifesto.html": "manifesto", "separation.html": "manifesto", "projects.html": "manifesto",
    "inspiration.html": "manifesto", "detail.html": "manifesto",
    "map.html": "atlas", "type.html": "atlas", "resources.html": "atlas",
    "design.html": "design",
    "about.html": "about", "story.html": "about", "work.html": "about", "project.html": "about"
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function activeKey() {
    var f = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    return PAGE_KEY[f] || "";
  }

  var CSS = "" +
".snav{position:sticky;top:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:14px clamp(20px,5vw,88px);background:rgba(246,242,231,.9);backdrop-filter:blur(12px);box-shadow:0 1px 0 rgba(34,48,31,.14)}" +
".snav .brand{font-family:'Zodiak',Georgia,serif;font-size:1rem;font-weight:700;color:#22301f;text-decoration:none}" +
".snav .top{display:flex;gap:clamp(10px,2vw,26px);align-items:center}" +
".snav .item{position:relative}" +
".snav .item>a{display:inline-flex;align-items:center;gap:5px;font-family:'Switzer',system-ui,sans-serif;font-size:.8rem;font-weight:500;color:#22301f;text-decoration:none;padding:8px 2px}" +
".snav .item>a .car{font-size:.55rem;color:#93a08d;transition:transform .25s}" +
".snav .item:hover>a .car{transform:translateY(1px) rotate(180deg)}" +
".snav .item>a:hover,.snav .item.on>a{color:#3c6b32}" +
".snav .item.on>a{font-weight:600}" +
".snav .drop{position:absolute;top:100%;left:50%;transform:translate(-50%,8px);min-width:250px;background:#fffdf8;border:1px solid rgba(34,48,31,.14);border-radius:16px;box-shadow:0 22px 50px -22px rgba(34,48,31,.35);padding:8px;opacity:0;visibility:hidden;transition:opacity .22s,transform .22s,visibility .22s}" +
".snav .item:hover .drop,.snav .item:focus-within .drop{opacity:1;visibility:visible;transform:translate(-50%,2px)}" +
".snav .drop a{display:block;font-family:'Switzer',system-ui,sans-serif;font-size:.82rem;font-weight:500;color:#22301f;text-decoration:none;padding:9px 12px;border-radius:10px}" +
".snav .drop a:hover{background:#f1f4e8;color:#3c6b32}" +
".snav .mbtn{display:none;border:1px solid rgba(34,48,31,.25);background:transparent;border-radius:99px;font-family:'Switzer',system-ui,sans-serif;font-size:.75rem;font-weight:600;color:#22301f;padding:7px 14px;cursor:pointer}" +
".snav .mpanel{display:none;position:absolute;top:100%;left:0;right:0;background:#fffdf8;border-bottom:1px solid rgba(34,48,31,.14);box-shadow:0 30px 50px -25px rgba(34,48,31,.35);padding:10px clamp(20px,5vw,88px) 18px;max-height:calc(100vh - 60px);overflow:auto}" +
".snav .mpanel.openm{display:block}" +
".snav .mpanel a{display:block;font-family:'Switzer',system-ui,sans-serif;font-size:.95rem;font-weight:600;color:#22301f;text-decoration:none;padding:10px 0;border-bottom:1px solid rgba(34,48,31,.08)}" +
".snav .mpanel a.subm{font-weight:400;font-size:.86rem;color:#5c6b57;padding-left:16px}" +
"@media(max-width:900px){.snav .top{display:none}.snav .mbtn{display:inline-block}}" +
".sfooter{margin-top:clamp(50px,8vh,90px);border-top:1px solid rgba(34,48,31,.14);background:rgba(246,242,231,.6);padding:clamp(36px,6vh,60px) clamp(20px,5vw,88px) clamp(30px,5vh,46px);text-align:center;font-family:'Switzer',system-ui,sans-serif;color:#22301f}" +
".sfooter .note{font-family:'Zodiak',Georgia,serif;font-style:italic;font-weight:300;font-size:clamp(1.05rem,1.5vw,1.3rem);color:#3c4636;max-width:46ch;margin:0 auto 6px}" +
".sfooter .sig{font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;color:#8f6215;margin-bottom:22px}" +
".sfooter .flinks{display:flex;gap:clamp(12px,2.5vw,26px);justify-content:center;flex-wrap:wrap;margin-bottom:26px}" +
".sfooter .flinks a{font-size:.78rem;font-weight:500;color:#5c6b57;text-decoration:none}" +
".sfooter .flinks a:hover{color:#3c6b32}" +
".sfooter .up{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;border:1.5px solid rgba(34,48,31,.3);background:transparent;color:#22301f;font-size:1.05rem;cursor:pointer;transition:all .3s}" +
".sfooter .up:hover{border-color:#3c6b32;color:#3c6b32;transform:translateY(-3px)}";

  function navHtml() {
    var act = activeKey();
    var tops = ITEMS.map(function (it) {
      var drop = it.sub.length
        ? '<div class="drop">' + it.sub.map(function (s) { return '<a href="' + esc(s.href) + '">' + esc(s.label) + "</a>"; }).join("") + "</div>"
        : "";
      return '<div class="item' + (it.key === act ? " on" : "") + '">' +
        '<a href="' + esc(it.href) + '">' + esc(it.label) + (it.sub.length ? ' <span class="car">▾</span>' : "") + "</a>" + drop + "</div>";
    }).join("");
    var mob = ITEMS.map(function (it) {
      return '<a href="' + esc(it.href) + '">' + esc(it.label) + "</a>" +
        it.sub.map(function (s) { return '<a class="subm" href="' + esc(s.href) + '">' + esc(s.label) + "</a>"; }).join("");
    }).join("");
    return '<nav class="snav" aria-label="Site">' +
      '<a class="brand" href="index.html">Pierre-Antoine Descoteaux</a>' +
      '<div class="top">' + tops + "</div>" +
      '<button class="mbtn" type="button" aria-expanded="false" onclick="var p=this.parentNode.querySelector(\'.mpanel\');p.classList.toggle(\'openm\');this.setAttribute(\'aria-expanded\',p.classList.contains(\'openm\'))">Menu ▾</button>' +
      '<div class="mpanel">' + mob + "</div>" +
      "</nav>";
  }

  function footerHtml() {
    return '<footer class="sfooter">' +
      '<p class="note">This site is built for hope and for love — a bet that we can still choose to live closer to each other.</p>' +
      '<div class="sig">— Pierre-Antoine Descoteaux</div>' +
      '<div class="flinks">' +
        '<a href="manifesto.html">Manifesto</a>' +
        '<a href="map.html">Coliving Atlas</a>' +
        '<a href="projects.html">Real communities</a>' +
        '<a href="resources.html">Resources</a>' +
        '<a href="mailto:' + EMAIL + '">Say hello</a>' +
      "</div>" +
      '<button class="up" type="button" aria-label="Back to top" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">↑</button>' +
      "</footer>";
  }

  function injectCss() {
    if (document.getElementById("snav-css")) return;
    var st = document.createElement("style");
    st.id = "snav-css";
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function init() {
    injectCss();
    var slots = document.querySelectorAll("[data-sitenav]");
    if (slots.length) {
      slots.forEach ? slots.forEach(fill) : Array.prototype.forEach.call(slots, fill);
      if (!document.body.hasAttribute("data-nofooter") && !document.querySelector(".sfooter")) {
        var d = document.createElement("div");
        d.innerHTML = footerHtml();
        document.body.appendChild(d.firstChild);
      }
    }
    function fill(el) { el.outerHTML = navHtml(); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.SITENAV = { html: navHtml, footerHtml: footerHtml, injectCss: injectCss };
})();
