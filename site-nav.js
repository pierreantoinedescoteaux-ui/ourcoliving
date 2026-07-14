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
      { label: "The manifesto — start here", href: "manifesto.html" },
      { label: "Hope: real communities", href: "projects.html" },
      { label: "Hope: books of inspiration", href: "inspiration.html" }
    ]},
    { label: "Coliving Resources", href: "map.html", key: "atlas", sub: [
      { label: "The map — compare the 12 models", href: "map.html#map" },
      { label: "Field guides — one per model", href: "type.html?t=ecovillage" },
      { label: "Themes library — the recurring questions", href: "themes.html" },
      { label: "Resources directory", href: "resources.html" }
    ]},
    { label: "Design for Connection", href: "design.html", key: "design", sub: [
      { label: "Design for Connection — start here", href: "design.html" },
      { label: "Designers that inspire me", href: "designers.html" }
    ]},
    { label: "Writings", href: "talkpieces.html", key: "writings", sub: [
      { label: "The story we were handed", href: "separation.html" }
    ]},
    { label: "About", href: "about.html", key: "about", sub: [
      { label: "My story", href: "story.html" },
      { label: "Work & case studies", href: "work.html" }
    ]}
  ];

  var PAGE_KEY = {
    "manifesto.html": "manifesto", "separation.html": "writings", "projects.html": "manifesto",
    "inspiration.html": "manifesto", "detail.html": "manifesto",
    "map.html": "atlas", "type.html": "atlas", "resources.html": "atlas", "themes.html": "atlas",
    "design.html": "design", "talkpieces.html": "writings", "designers.html": "design",
    "about.html": "about", "story.html": "about", "story-v1.html": "about", "work.html": "about", "project.html": "about"
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
".sfooter{margin-top:clamp(50px,8vh,90px);border-top:1px solid rgba(34,48,31,.14);background:rgba(246,242,231,.7);padding:clamp(36px,6vh,60px) clamp(20px,5vw,88px) clamp(18px,3vh,26px);font-family:'Switzer',system-ui,sans-serif;color:#22301f}" +
".sfooter .frow{display:flex;justify-content:space-between;align-items:flex-start;gap:28px 60px;flex-wrap:wrap;max-width:1500px;margin:0 auto}" +
".sfooter .note{font-family:'Zodiak',Georgia,serif;font-style:italic;font-weight:300;font-size:clamp(1.15rem,1.8vw,1.5rem);color:#3c4636;margin:0 0 8px}" +
".sfooter .sig{font-size:.75rem;letter-spacing:.16em;text-transform:uppercase;color:#8f6215}" +
".sfooter .flinks{display:grid;grid-template-columns:repeat(2,minmax(150px,auto));gap:10px 42px}" +
".sfooter .flinks a{font-size:.82rem;font-weight:500;color:#5c6b57;text-decoration:none}" +
".sfooter .flinks a:hover{color:#3c6b32}" +
".sfooter .fbase{max-width:1500px;margin:clamp(26px,4vh,40px) auto 0;padding-top:14px;border-top:1px solid rgba(34,48,31,.1);font-size:.74rem;color:#93a08d;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}" +
"@media(max-width:640px){.sfooter .flinks{grid-template-columns:1fr 1fr;gap:10px 24px}}" +
/* back-to-top: frozen in the bottom-right corner of every page */
".stotop{position:fixed;right:clamp(14px,2.2vw,26px);bottom:clamp(14px,2.6vh,26px);z-index:75;width:48px;height:48px;border-radius:50%;border:1.5px solid rgba(34,48,31,.3);background:rgba(255,253,248,.92);backdrop-filter:blur(6px);color:#22301f;font-size:1.1rem;cursor:pointer;box-shadow:0 12px 30px -14px rgba(34,48,31,.4);opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .35s,visibility .35s,transform .35s,color .3s,border-color .3s}" +
".stotop.show{opacity:1;visibility:visible;transform:none}" +
".stotop:hover{border-color:#3c6b32;color:#3c6b32;transform:translateY(-3px)}";

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
    var yr = new Date().getFullYear();
    return '<footer class="sfooter">' +
      '<div class="frow">' +
        '<div class="fbrand">' +
          '<p class="note">This site is built for hope and love.</p>' +
          '<div class="sig">Pierre-Antoine Descoteaux</div>' +
        "</div>" +
        '<nav class="flinks" aria-label="Footer">' +
          '<a href="manifesto.html">Manifesto</a>' +
          '<a href="map.html">Coliving Resources</a>' +
          '<a href="design.html">Design for Connection</a>' +
          '<a href="talkpieces.html">Writings</a>' +
          '<a href="projects.html">Real communities</a>' +
          '<a href="themes.html">Themes library</a>' +
          '<a href="resources.html">Resources</a>' +
          '<a href="about.html">About</a>' +
          '<a href="mailto:' + EMAIL + '">Say hello</a>' +
        "</nav>" +
      "</div>" +
      '<div class="fbase"><span>&copy; ' + yr + ' Pierre-Antoine Descoteaux</span><span> · </span><a href="credits.html" style="opacity:.75">Image credits</a></div>' +
      "</footer>";
  }

  /* back-to-top button — mounted on EVERY page that loads this script
     (static shells and app.js pages alike), frozen bottom-right.
     Fades in once there is anything to go back up from. */
  function mountToTop() {
    if (document.querySelector(".stotop")) return;
    var b = document.createElement("button");
    b.className = "stotop";
    b.type = "button";
    b.setAttribute("aria-label", "Back to top");
    b.textContent = "↑";
    b.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(b);
    function onScroll() { b.classList.toggle("show", window.scrollY > 300); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function injectCss() {
    if (document.getElementById("snav-css")) return;
    var st = document.createElement("style");
    st.id = "snav-css";
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* visual edit mode (local only — edit-mode.js gates itself on file://) */
  function mountEditMode() {
    if (document.querySelector('script[src$="edit-mode.js"]')) return;
    if (location.protocol !== "file:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;
    var s = document.createElement("script");
    s.src = "edit-mode.js";
    document.head.appendChild(s);
  }

  function init() {
    injectCss();
    mountToTop();
    mountEditMode();
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
