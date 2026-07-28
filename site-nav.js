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
      { label: "Resources directory", href: "resources.html" },
      { label: "Networks & movements", href: "networks.html" },
      { label: "How-to guides", href: "how-to.html" }
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
    ]},
    { label: "The Community", href: "community.html", key: "community", sub: [] }
  ];

  var PAGE_KEY = {
    "manifesto.html": "manifesto", "separation.html": "writings", "projects.html": "manifesto",
    "inspiration.html": "manifesto", "detail.html": "manifesto",
    "map.html": "atlas", "type.html": "atlas", "resources.html": "atlas", "themes.html": "atlas",
    "networks.html": "atlas", "how-to.html": "atlas",
    "design.html": "design", "talkpieces.html": "writings", "designers.html": "design",
    "about.html": "about", "story.html": "about", "story-v1.html": "about", "work.html": "about", "project.html": "about",
    "community.html": "community"
  };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function activeKey() {
    var f = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    return PAGE_KEY[f] || "";
  }

  var CSS = "" +
".snav{position:sticky;top:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:12px clamp(20px,5vw,88px);background:rgba(246,242,231,.9);backdrop-filter:blur(12px);box-shadow:0 1px 0 rgba(34,48,31,.14)}" +
".snav .brand{font-family:'Zodiak',Georgia,serif;font-size:1.12rem;font-weight:700;color:#22301f;text-decoration:none}" +
".snav .top{display:flex;gap:clamp(12px,2.2vw,30px);align-items:center}" +
".snav .item{position:relative}" +
".snav .item>a{display:inline-flex;align-items:center;gap:5px;font-family:'Switzer',system-ui,sans-serif;font-size:.92rem;font-weight:500;color:#22301f;text-decoration:none;padding:6px 2px}" +
".snav .item>a .car{display:none}" +
".snav .item:hover>a .car{transform:translateY(1px) rotate(180deg)}" +
".snav .item>a:hover,.snav .item.on>a{color:#3c6b32}" +
".snav .item.on>a{font-weight:600}" +
".snav .drop{position:absolute;top:100%;left:50%;transform:translate(-50%,8px);min-width:250px;background:#fffdf8;border:1px solid rgba(34,48,31,.14);border-radius:16px;box-shadow:0 22px 50px -22px rgba(34,48,31,.35);padding:8px;opacity:0;visibility:hidden;transition:opacity .22s,transform .22s,visibility .22s}" +
".snav .item:hover .drop,.snav .item:focus-within .drop{opacity:1;visibility:visible;transform:translate(-50%,2px)}" +
".snav .drop a{display:block;font-family:'Switzer',system-ui,sans-serif;font-size:.9rem;font-weight:500;color:#22301f;text-decoration:none;padding:10px 13px;border-radius:10px}" +
".snav .drop a:hover{background:#f1f4e8;color:#3c6b32}" +
".snav .mbtn{display:none;border:1px solid rgba(34,48,31,.25);background:transparent;border-radius:99px;font-family:'Switzer',system-ui,sans-serif;font-size:.8rem;font-weight:600;color:#22301f;padding:11px 18px;cursor:pointer}" +
".snav .mpanel{display:none;position:absolute;top:100%;left:0;right:0;background:#fffdf8;border-bottom:1px solid rgba(34,48,31,.14);box-shadow:0 30px 50px -25px rgba(34,48,31,.35);padding:10px clamp(20px,5vw,88px) 18px;max-height:calc(100vh - 60px);overflow:auto}" +
".snav .mpanel.openm{display:block}" +
".snav .mpanel a{display:block;font-family:'Switzer',system-ui,sans-serif;font-size:1rem;font-weight:600;color:#22301f;text-decoration:none;padding:12px 0;border-bottom:1px solid rgba(34,48,31,.08)}" +
".snav .mpanel a.subm{font-weight:400;font-size:.92rem;color:#5c6b57;padding:10px 0 10px 16px}" +
"@media(max-width:900px){.snav .top{display:none}.snav .mbtn{display:inline-block}}" +
".sfooter{margin-top:clamp(36px,6vh,64px);border-top:1px solid rgba(34,48,31,.14);background:rgba(246,242,231,.7);padding:clamp(18px,3vh,28px) clamp(20px,5vw,88px) 12px;font-family:'Switzer',system-ui,sans-serif;color:#22301f}" +
".sfooter .fbrand{display:flex;align-items:flex-start;gap:16px}" +
".sfooter .fmark{flex:0 0 auto;width:60px;margin-top:2px}" +
".sfooter .fmark img{width:100%;height:auto;display:block}" +
/* the branch sits STRAIGHT under the note line — part of the signature,
   not a spacer */
".sfooter .fbranch{margin:6px 0 0}" +
".sfooter .fbranch img{width:min(300px,56vw);height:auto;opacity:.92;display:block}" +
".sfooter .frow{display:flex;justify-content:space-between;align-items:flex-start;gap:18px 50px;flex-wrap:wrap;max-width:1500px;margin:0 auto}" +
".sfooter .note{font-family:'Zodiak',Georgia,serif;font-style:italic;font-weight:300;font-size:clamp(1.15rem,1.8vw,1.5rem);color:#3c4636;margin:0 0 8px}" +
".sfooter .sig{font-size:.75rem;letter-spacing:.16em;text-transform:uppercase;color:#8f6215}" +
".sfooter .flinks{display:grid;grid-template-columns:repeat(3,minmax(130px,auto));gap:7px 36px;align-content:start}" +
".sfooter .flinks a{font-size:.82rem;font-weight:500;color:#5c6b57;text-decoration:none}" +
".sfooter .flinks a:hover{color:#3c6b32}" +
".sfooter .fbase{max-width:1500px;margin:14px auto 0;padding-top:9px;border-top:1px solid rgba(34,48,31,.1);font-size:.72rem;color:#93a08d;display:flex;justify-content:space-between;align-items:baseline;gap:14px;flex-wrap:wrap}" +
".sfooter .fby{text-align:right;margin-left:auto}" +
/* landing-only: a whisper of a footer overlaid on the final scene */
/* note CENTERED at the stage's bottom (clear of the copy panel on the
   left and the rail on the right); credit pinned bottom-right above the
   back-to-top button */
".sminifoot{position:fixed;left:0;right:0;bottom:0;z-index:140;display:flex;justify-content:center;align-items:flex-end;" +
  "padding:10px clamp(20px,5vw,88px) 8px;pointer-events:none;opacity:0;transform:translateY(8px);transition:opacity .5s,transform .5s;" +
  "font-family:'Switzer',system-ui,sans-serif;color:#2d3a2a;text-shadow:0 1px 10px rgba(248,233,207,.9),0 0 22px rgba(248,233,207,.7)}" +
".sminifoot.show{opacity:1;transform:none}" +
".sminifoot .mnote{display:flex;align-items:center;gap:10px;font-family:'Zodiak',Georgia,serif;font-style:italic;font-weight:300;font-size:.85rem}" +
".sminifoot .mnote img{width:80px;height:auto;opacity:.9;filter:drop-shadow(0 1px 6px rgba(248,233,207,.8))}" +
".sminifoot .mby{position:absolute;right:clamp(16px,2.2vw,26px);bottom:70px;font-size:.58rem;letter-spacing:.06em;text-align:right;line-height:1.5;" +
  "text-shadow:0 1px 8px rgba(248,233,207,.95),0 0 16px rgba(248,233,207,.9),0 0 30px rgba(248,233,207,.8)}" +
"@media(max-width:640px){.sminifoot .mnote img{display:none}.sminifoot .mnote{font-size:.85rem}.sminifoot .mby{font-size:.68rem;bottom:64px}}" +
"@media(max-width:760px){" +
  ".sfooter{padding-bottom:max(14px,env(safe-area-inset-bottom))}" +
  ".sfooter .frow{flex-direction:column;gap:22px}" +
  ".sfooter .note{font-size:1.35rem;line-height:1.45}" +
  ".sfooter .sig{font-size:.8rem}" +
  ".sfooter .flinks{grid-template-columns:1fr 1fr;gap:0 20px;width:100%}" +
  ".sfooter .flinks a{font-size:1rem;padding:11px 0;display:block}" +
  ".sfooter .fbranch img{width:min(240px,64vw)}" +
  ".sfooter .fbase{flex-direction:column;align-items:flex-start;gap:6px;font-size:.85rem}" +
  ".sfooter .fby{text-align:left;margin-left:0}" +
"}" +
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
      '<a class="brand" href="index.html">Our Coliving</a>' +
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
          '<div>' +
            '<p class="note">This site is built of hope and love.</p>' +
            '<div class="sig">Pierre-Antoine Descoteaux</div>' +
            '<div class="fbranch" aria-hidden="true"><img src="assets/world/orn-branch.webp" alt="" loading="lazy"></div>' +
          '</div>' +
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
      '<div class="fbase"><span>&copy; ' + yr + ' Pierre-Antoine Descoteaux</span>' +
        '<span class="fby">a project, resources and portfolio by Pierre-Antoine Descoteaux · <a href="credits.html" style="opacity:.75">Image credits</a></span></div>' +
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

  /* painted sun favicon on every page that doesn't declare its own */
  function mountFavicon() {
    var ex = document.querySelector('link[rel~="icon"]');
    if (ex && ex.getAttribute("href") !== "data:,") return;
    if (ex) ex.remove();
    [[64, "favicon-64.png"], [32, "favicon-32.png"]].forEach(function (f) {
      var l = document.createElement("link");
      l.rel = "icon"; l.type = "image/png"; l.sizes = f[0] + "x" + f[0];
      l.href = "assets/world/" + f[1];
      document.head.appendChild(l);
    });
  }

  /* visual edit mode (local only — edit-mode.js gates itself on file://) */
  function mountEditMode() {
    if (document.querySelector('script[src$="edit-mode.js"]')) return;
    if (location.protocol !== "file:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;
    var s = document.createElement("script");
    s.src = "edit-mode.js";
    document.head.appendChild(s);
  }

  /* ===================================================================
     WORLD LAYER — every interior page keeps a trace of the tower scene
     its doorway came from: a slim painted banner under the nav (ambient
     video on flagship pages), the scene's accent as --scene-accent, a
     "back to the tower" link into the right floor, and the shared film
     grain. All free: the images/clips are the landing's own assets.
     =================================================================== */
  var SCENES = {
    commons: { img: "assets/tower/S2.webp", accent: "#c96b32", label: "the commons",
               video: "assets/tower/vid/loop-s2.mp4", videoM: "assets/tower/vid/loop-s2-m.mp4" },
    library: { img: "assets/tower/S3.webp", accent: "#2b8b8f", label: "the library",
               video: "assets/tower/vid/loop-s3.mp4", videoM: "assets/tower/vid/loop-s3-m.mp4" },
    makers:  { img: "assets/tower/S4.webp", accent: "#a8712c", label: "the workshop",
               video: "assets/tower/vid/loop-s4.mp4", videoM: "assets/tower/vid/loop-s4-m.mp4" },
    gardens: { img: "assets/tower/S5.webp", accent: "#d08a2e", label: "the gardens",
               video: "assets/tower/vid/loop-s5.mp4", videoM: "assets/tower/vid/loop-s5-m.mp4" },
    homes:   { img: "assets/tower/S6.webp", accent: "#b3543e", label: "the homes",
               video: "assets/tower/vid/loop-s6.mp4", videoM: "assets/tower/vid/loop-s6-m.mp4" },
    lookout: { img: "assets/tower/S7.webp", accent: "#3e7db0", label: "the lookout",
               video: "assets/tower/vid/loop-s7.mp4", videoM: "assets/tower/vid/loop-s7-m.mp4" }
  };
  /* P-A's mapping logic: "you'd find that element on that floor."
     Field guides + designers = the workshop (how to build). Books of
     inspiration + writings + themes = the library. Real communities +
     the resource directory (notice board) = the commons. Design for
     Connection = the gardens. The me-pages = the homes. Map = lookout. */
  var PAGE_SCENE = {
    "projects.html": "commons", "resources.html": "commons", "detail.html": "commons",
    "inspiration.html": "library", "talkpieces.html": "library", "themes.html": "library",
    "type.html": "makers", "designers.html": "makers",
    "design.html": "gardens",
    "story.html": "homes", "about.html": "homes", "project.html": "homes", "work.html": "homes",
    "map.html": "lookout"
  };
  /* ambient video only on the flagships — everyone else gets the still */
  var VIDEO_PAGES = { "resources.html": 1, "about.html": 1, "map.html": 1 };
  /* the landing IS the world — no banner, no extra grain there */
  var WORLD_SKIP = { "index.html": 1, "tower.html": 1, "home-classic.html": 1, "index-v2.html": 1, "manifesto.html": 1 };

  function pageFile() {
    return (location.pathname.split("/").pop() || "index.html").toLowerCase();
  }

  var WORLD_CSS = "" +
/* the banner IS the hero's background: a zero-height wrapper holds the
   painting at z:-1 (BEHIND the page's own static title/lede, which render
   on top of it) and the back-pill as a normal sibling above everything */
".wbandwrap{position:relative;height:0;margin:0;padding:0}" +
".wband{position:absolute;top:0;left:0;right:0;height:var(--wbh,clamp(360px,52vh,600px));overflow:hidden;z-index:-1}" +
".wband .wmedia{position:absolute;inset:-7% -3%;will-change:transform;transition:transform .25s ease-out}" +
".wband .wmedia img,.wband .wmedia video{width:100%;height:100%;object-fit:cover;object-position:50% 30%}" +
".wband .wveil{position:absolute;inset:0;pointer-events:none}" +
".wbandwrap .wback{position:absolute;left:clamp(20px,5vw,88px);top:14px;z-index:60;display:inline-flex;align-items:center;gap:8px;" +
  "font-family:'Switzer',system-ui,sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;" +
  "color:var(--scene-accent,#3c6b32);background:rgba(255,253,248,.88);backdrop-filter:blur(6px);" +
  "padding:8px 15px;border-radius:99px;text-decoration:none;box-shadow:0 10px 26px -14px rgba(34,48,31,.5);" +
  "transition:background .3s,color .3s,transform .3s}" +
".wbandwrap .wback:hover{background:var(--scene-accent,#3c6b32);color:#fffdf8;transform:translateY(-2px)}" +
"@media(max-width:640px){.wband{--wbh:clamp(240px,36vh,320px)}.wbandwrap .wback{font-size:.75rem;letter-spacing:.12em;padding:14px 17px;left:12px;top:10px}}" +
".wgrain{position:fixed;inset:0;z-index:9998;pointer-events:none;opacity:.34;mix-blend-mode:multiply;" +
  "background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.25'/%3E%3C/svg%3E\")}";

  function injectWorldCss() {
    if (document.getElementById("world-css")) return;
    var st = document.createElement("style");
    st.id = "world-css";
    st.textContent = WORLD_CSS;
    document.head.appendChild(st);
  }

  /* veil: the painting dissolves into whatever background THIS page uses */
  function pageBg() {
    var c = getComputedStyle(document.body).backgroundColor || "";
    var m = c.match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
    if (!m || (c.indexOf("rgba") === 0 && /rgba\([\d.\s,]+0\)/.test(c))) return [246, 242, 231];
    return [+m[1], +m[2], +m[3]];
  }

  function mountWorld() {
    var f = pageFile();
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* grain everywhere except the landing (it has paint texture already)
       and pages that ship their own .grain layer */
    if (!WORLD_SKIP[f] && !document.querySelector(".grain,.wgrain")) {
      var g = document.createElement("div");
      g.className = "wgrain";
      g.setAttribute("aria-hidden", "true");
      document.body.appendChild(g);
    }
    var key = PAGE_SCENE[f];
    if (!key || WORLD_SKIP[f] || document.querySelector(".wband")) return;
    var sc = SCENES[key];
    var nav = document.querySelector(".snav");
    if (!nav) return;
    document.documentElement.style.setProperty("--scene-accent", sc.accent);
    injectWorldCss();

    var wrap = document.createElement("div");
    wrap.className = "wbandwrap";
    var bg = pageBg();
    var solid = "rgb(" + bg.join(",") + ")";
    wrap.innerHTML =
      '<div class="wband" data-scene="' + key + '">' +
        '<div class="wmedia"><img src="' + sc.img + '" alt="" decoding="async"></div>' +
        '<div class="wveil" style="background:linear-gradient(180deg,rgba(' + bg.join(",") + ',.08) 0%,rgba(' + bg.join(",") + ',.38) 36%,rgba(' + bg.join(",") + ',.56) 64%,rgba(' + bg.join(",") + ',.82) 84%,' + solid + ' 97%)"></div>' +
      '</div>' +
      '<a class="wback" href="index.html#' + key + '">↑ ' + esc(sc.label) + " · back to the tower</a>";
    nav.parentNode.insertBefore(wrap, nav.nextSibling);
    var band = wrap.querySelector(".wband");

    /* selection color joins the scene */
    var sel = document.createElement("style");
    sel.textContent = "::selection{background:" + sc.accent + ";color:#fffdf8}";
    document.head.appendChild(sel);

    /* ambient clip on flagship pages: lazy (idle), mobile encode on phones,
       paused whenever the banner scrolls away, skipped under reduced motion */
    if (VIDEO_PAGES[f] && sc.video && !reduce) {
      var later = window.requestIdleCallback || function (cb) { setTimeout(cb, 1200); };
      later(function () {
        var v = document.createElement("video");
        v.muted = true; v.loop = true; v.playsInline = true; v.preload = "auto";
        v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
        v.poster = sc.img;
        v.src = (window.innerWidth < 700 && sc.videoM) ? sc.videoM : sc.video;
        v.style.opacity = "0"; v.style.transition = "opacity .8s";
        var media = band.querySelector(".wmedia");
        v.addEventListener("playing", function () { v.style.opacity = "1"; }, { once: true });
        media.appendChild(v);
        v.play().catch(function () {});
        if ("IntersectionObserver" in window) {
          new IntersectionObserver(function (en) {
            en.forEach(function (e) {
              if (e.isIntersecting) { v.play().catch(function () {}); }
              else v.pause();
            });
          }).observe(band);
        }
      });
    }

    /* gentle parallax: the painting leans a few px against the cursor.
       transform-only + rAF-coalesced = no layout work, no jank. */
    /* the band lives BEHIND the content (z:-1) so it never receives mouse
       events itself — track the cursor at window level while it's over
       the banner's screen area */
    if (!reduce && window.matchMedia("(pointer:fine)").matches) {
      var media2 = band.querySelector(".wmedia"), px = 0, py = 0, raf = 0;
      window.addEventListener("mousemove", function (e) {
        var r = band.getBoundingClientRect();
        if (e.clientY < r.top || e.clientY > r.bottom) { media2.style.transform = "translate(0,0)"; return; }
        px = ((e.clientX - r.left) / r.width - 0.5) * -10;
        py = ((e.clientY - r.top) / r.height - 0.5) * -6;
        if (!raf) raf = requestAnimationFrame(function () {
          raf = 0;
          media2.style.transform = "translate(" + px.toFixed(1) + "px," + py.toFixed(1) + "px)";
        });
      }, { passive: true });
    }
  }

  /* app.js pages render the nav after us — retry briefly until .snav exists */
  function mountWorldWhenReady() {
    var tries = 0;
    (function tick() {
      mountWorld();
      if (!document.querySelector(".wband") && PAGE_SCENE[pageFile()] && ++tries < 25) { setTimeout(tick, 120); return; }
      mountFx();
    })();
  }

  /* landing only: thin transparent footer that fades in over the last
     scene — the note, a tiny branch, and the signature. Nothing else. */
  function mountMiniFooter() {
    var f = pageFile();
    if (!{ "index.html": 1, "tower.html": 1 }[f] || document.querySelector(".sminifoot")) return;
    var d = document.createElement("div");
    d.className = "sminifoot";
    d.innerHTML =
      '<div class="mnote">This site is built of hope and love, by Pierre-Antoine Descoteaux.' +
        '<img src="assets/world/orn-branch.webp" alt="" loading="lazy"></div>' +
      '<div class="mby">a project, resources and portfolio<br>' +
        "&copy; " + new Date().getFullYear() + " Pierre-Antoine Descoteaux</div>";
    document.body.appendChild(d);
    function onS() {
      var end = document.documentElement.scrollHeight - window.innerHeight;
      d.classList.toggle("show", end > 0 && end - window.scrollY < window.innerHeight * 0.22);
    }
    window.addEventListener("scroll", onS, { passive: true });
    setTimeout(onS, 800);
  }

  /* the delight layer (pollen, click-blooms, hover moods, flyers, forge
     transition) — loaded after the world layer so it can read the scene */
  function mountFx() {
    if (document.querySelector('script[src$="world-fx.js"]')) return;
    var s = document.createElement("script");
    s.src = "world-fx.js";
    document.head.appendChild(s);
  }

  function init() {
    injectCss();
    injectWorldCss();
    mountFavicon();
    mountToTop();
    mountMiniFooter();
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
    mountWorldWhenReady();
    function fill(el) { el.outerHTML = navHtml(); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.SITENAV = { html: navHtml, footerHtml: footerHtml, injectCss: injectCss };
})();
