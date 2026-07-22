/* =====================================================================
   WORLD-FX — the site's delight layer. Everything here is decoration:
   pollen motes that drift away from the cursor, click-blooms, magnetic
   CTAs, three button-hover moods (sprout / zap / sun) distributed by
   tower floor, ambient flyers (bird / rushed robot / hot air balloon),
   and the hammer-and-crystal page-transition moment.

   Performance contract (the reason this stays smooth):
   - transform/opacity only — never layout properties
   - one shared rAF loop for the motes; Web Animations API for one-shots
   - hard caps: ≤8 motes, exactly 1 flyer airborne at a time
   - everything gated behind prefers-reduced-motion
   ===================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer:fine)").matches;
  var FILE = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var IS_LANDING = { "index.html": 1, "tower.html": 1, "home-classic.html": 1, "index-v2.html": 1 }[FILE] === 1;
  var SPRITES = "assets/world/";

  /* floor mood: which hover effect this page's buttons get.
     Organic floors sprout, tech floors zap, the lookout (and every
     primary CTA anywhere) glows like a sun. Deterministic — no RNG. */
  var band = document.querySelector(".wband");
  var SCENE = band ? band.getAttribute("data-scene") : (FILE === "manifesto.html" || FILE === "separation.html" || FILE === "inspiration.html" ? "commons" : "");
  var MOOD = { commons: "leaf", gardens: "leaf", homes: "leaf", library: "zap", makers: "zap", lookout: "sun" }[SCENE] || "leaf";
  var accent = (getComputedStyle(document.documentElement).getPropertyValue("--scene-accent") || "").trim() || "#3c6b32";

  /* ---------------- shared CSS ---------------- */
  var css = "" +
".wfx-mote{position:fixed;border-radius:50%;pointer-events:none;z-index:300;will-change:transform;filter:blur(.6px)}" +
".wfx-flyer{position:fixed;left:0;top:0;pointer-events:none;z-index:65;will-change:transform}" +
".wfx-flyer img{display:block;width:100%;height:auto}" +
".wfx-bloom{position:fixed;pointer-events:none;z-index:9999;will-change:transform}" +
".wfx-hover{position:absolute;inset:-14px;pointer-events:none;overflow:visible;z-index:5}" +
".wfx-spr{position:absolute;pointer-events:none;will-change:transform,opacity}" +
".wfx-veil{position:fixed;inset:0;z-index:10000;background:#f6f2e7;display:flex;align-items:center;justify-content:center;" +
  "opacity:1;transition:opacity .32s ease;pointer-events:none}" +
".wfx-veil.gone{opacity:0}" +
".wfx-forge{position:relative;width:190px;height:150px}" +
".wfx-forge img{position:absolute;display:block}" +
".wfx-forge .f-crystal{left:28px;bottom:12px;width:46px;filter:drop-shadow(0 0 14px rgba(80,180,220,.7))}" +
".wfx-forge .f-hammer{left:44px;top:-4px;width:62px;transform-origin:88% 88%}" +
".wfx-forge .f-tree{left:104px;bottom:12px;width:0;opacity:0;transform-origin:50% 100%}" +
".wfx-forge .f-flash{position:absolute;left:18px;bottom:24px;width:64px;height:64px;border-radius:50%;" +
  "background:radial-gradient(circle,rgba(160,230,255,.95),rgba(160,230,255,0) 70%);opacity:0}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  /* =====================================================
     1) POLLEN — warm motes drifting, shy of the cursor
     ===================================================== */
  if (!reduce) {
    var MOTES = window.innerWidth < 700 ? 6 : 11;
    var motes = [], mx = -999, my = -999;
    for (var i = 0; i < MOTES; i++) {
      var m = document.createElement("div");
      m.className = "wfx-mote";
      var s = 5 + (i % 4) * 1.5;
      m.style.width = s + "px"; m.style.height = s + "px";
      m.style.background = i % 3 ? "rgba(217,154,61," + (0.5 + (i % 3) * 0.15) + ")" : "rgba(247,201,72,.65)";
      m.style.boxShadow = "0 0 " + (6 + (i % 3) * 4) + "px rgba(247,201,72,.5)";
      document.body.appendChild(m);
      motes.push({ el: m, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
        vx: 0, vy: 0, ph: Math.random() * 6.28, sp: 0.14 + Math.random() * 0.2 });
    }
    if (finePointer) document.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    /* on touch screens the finger IS the mouse: motes scatter from the
       touch point and resettle when the finger lifts */
    document.addEventListener("touchmove", function (e) {
      if (e.touches.length) { mx = e.touches[0].clientX; my = e.touches[0].clientY; }
    }, { passive: true });
    document.addEventListener("touchstart", function (e) {
      if (e.touches.length) { mx = e.touches[0].clientX; my = e.touches[0].clientY; }
    }, { passive: true });
    document.addEventListener("touchend", function () { mx = -999; my = -999; }, { passive: true });
    var t0 = 0;
    (function loop(t) {
      var dt = Math.min(50, t - t0); t0 = t;
      var W = window.innerWidth, H = window.innerHeight;
      for (var i = 0; i < motes.length; i++) {
        var o = motes[i];
        o.ph += 0.0004 * dt * (1 + i % 3);
        o.vx += Math.cos(o.ph + i) * 0.002 * dt * o.sp;
        o.vy += (Math.sin(o.ph * 0.8) * 0.0016 - 0.0007) * dt * o.sp; /* slight upward bias */
        var dx = o.x - mx, dy = o.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 57600) { var d = Math.sqrt(d2) || 1, f = (240 - d) * 0.02 * dt; o.vx += dx / d * f; o.vy += dy / d * f; }
        o.vx *= 0.985; o.vy *= 0.985;
        o.x += o.vx * dt * 0.06; o.y += o.vy * dt * 0.06;
        if (o.x < -20) o.x = W + 10; if (o.x > W + 20) o.x = -10;
        if (o.y < -20) o.y = H + 10; if (o.y > H + 20) o.y = -10;
        o.el.style.transform = "translate(" + o.x.toFixed(1) + "px," + o.y.toFixed(1) + "px)";
      }
      requestAnimationFrame(loop);
    })(0);
  }

  /* =====================================================
     2) CLICK-BLOOM — every click sprouts a tiny burst
     ===================================================== */
  if (!reduce) document.addEventListener("click", function (e) {
    if (e.target.closest("input,textarea,select,.gray")) return; /* bubbles have their own burst */
    var cols = [accent, "#5c9e4a", "#d99a3d", "#f7c948", "#3c6b32", "#e58ab7"];
    for (var k = 0; k < 13; k++) {
      var p = document.createElement("span");
      p.className = "wfx-bloom";
      var leaf = k % 2;
      p.style.width = leaf ? "15px" : "8px"; p.style.height = leaf ? "8px" : "8px";
      p.style.borderRadius = leaf ? "80% 20% 80% 20%" : "50%";
      p.style.background = cols[k % cols.length];
      p.style.left = e.clientX + "px"; p.style.top = e.clientY + "px";
      document.body.appendChild(p);
      var a = Math.PI * 2 * k / 13 + Math.random() * 0.3, d = 44 + (k % 4) * 22;
      p.animate([
        { transform: "translate(-50%,-50%) scale(.6) rotate(0deg)", opacity: 1 },
        { transform: "translate(" + (Math.cos(a) * d) + "px," + (Math.sin(a) * d * 0.8 + 16) + "px) scale(1.1) rotate(" + (leaf ? 170 : 60) + "deg)", opacity: 0 }
      ], { duration: 620 + k * 35, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" });
      (function (el) { setTimeout(function () { el.remove(); }, 1100); })(p);
    }
  }, { passive: true });

  /* =====================================================
     3) MAGNETIC CTAS + 4) HOVER MOODS (sprout / zap / sun)
     ===================================================== */
  /* selector set from the full-site inventory (2026-07-22): primary CTAs +
     cards, secondary pills/arrows/inline CTAs, landing doorway links.
     Excluded on purpose: inputs, .gray thought-bubbles, .snav items,
     #chart .node map markers (all have their own interactions). */
  var BTN_SEL = 'a[class*="btn"],a[class*="cta"],.ctas a,.sw-copy__cta a,.sw-copy__tags a,.wback,.liblink a,button[type="submit"],' +
    '.btn-pill,.hope-cta,a.mail,a.project-card,.exp-card,.door,a.piece,.insp-card--link,.bcard,a.pcard,' +
    '.filters button,.chip,.caro .arrow,.presets button,.s-arrow,.peek,.mtool,.pager a,.fgarrow,.gr-item,.gtile,' +
    '.d-link,.b-go,.exp-go,.visit,.read,.deep,.i-link,.int,a.tg,.mclose,.stotop';
  /* the three moods rotate across buttons — decided once per button by its
     arming order (deterministic, no runtime randomness) */
  var moodSeq = 0;
  function hoverFx(el) {
    if (el.dataset.wfx) return;
    el.dataset.wfx = "1";
    var mood = el.matches(".primary,[data-fx-sun]") ? "sun" : ["leaf", "zap", "sun"][moodSeq++ % 3];
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    var live = [];
    function spr(src, css, anims) {
      var im = document.createElement("img");
      im.src = SPRITES + src;
      im.className = "wfx-spr";
      for (var k in css) im.style[k] = css[k];
      el.appendChild(im); live.push(im);
      anims.forEach(function (a) { im.animate(a[0], a[1]); });
      return im;
    }
    el.addEventListener("mouseenter", function () {
      if (reduce || live.length) return;
      var w = el.offsetWidth, h = el.offsetHeight;
      var ns = "http://www.w3.org/2000/svg";
      if (mood === "leaf") {
        /* the painted sticker kit blooms around the button — same art as
           the manifesto vines and the footer branch, not drawn shapes */
        var pop = { duration: 340, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "forwards" };
        var sway = [{ transform: "rotate(-4deg)" }, { transform: "rotate(5deg)" }];
        var swayT = { duration: 2200, direction: "alternate", iterations: Infinity, easing: "ease-in-out" };
        spr("vk-cluster-b.webp", { left: "-16px", bottom: "-12px", width: "34px", opacity: 0, transformOrigin: "80% 90%" },
          [[[{ opacity: 0, transform: "scale(.2) rotate(-30deg)" }, { opacity: 1, transform: "scale(1) rotate(0deg)" }], pop]]);
        spr("vk-flower-pink.webp", { right: "-12px", top: "-20px", width: "26px", opacity: 0, transformOrigin: "50% 95%" },
          [[[{ opacity: 0, transform: "scale(.2) rotate(25deg)" }, { opacity: 1, transform: "scale(1) rotate(0deg)" }], { duration: 340, delay: 120, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "forwards" }]]);
        spr("vk-leaf-b.webp", { left: "22%", top: "-16px", width: "20px", opacity: 0, transformOrigin: "50% 100%" },
          [[[{ opacity: 0, transform: "scale(.2)" }, { opacity: 1, transform: "scale(1)" }], { duration: 300, delay: 220, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "forwards" }], [sway, swayT]]);
      } else if (mood === "zap") {
        var svg = document.createElementNS(ns, "svg");
        svg.setAttribute("class", "wfx-hover");
        svg.setAttribute("viewBox", "-14 -14 " + (w + 28) + " " + (h + 28));
        el.appendChild(svg); live.push(svg);
        /* holographic arcs flicker around the border */
        for (var z = 0; z < 3; z++) {
          var p2 = document.createElementNS(ns, "path");
          var y0 = z % 2 ? -6 : h + 6, x0 = 8 + z * (w / 3.2);
          var seg = "M" + x0 + "," + y0;
          for (var q = 1; q <= 4; q++) seg += " L" + (x0 + q * 12) + "," + (y0 + (q % 2 ? -5 : 5));
          p2.setAttribute("d", seg); p2.setAttribute("fill", "none");
          p2.setAttribute("stroke", z ? "#7fd4ff" : "#c9a7ff"); p2.setAttribute("stroke-width", "2.6");
          p2.setAttribute("stroke-linecap", "round");
          p2.style.filter = "drop-shadow(0 0 7px rgba(120,210,255,.95))";
          if (!z) el.style.boxShadow = "0 0 22px -4px rgba(120,210,255,.6)";
          p2.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: .25 }, { opacity: 1 }, { opacity: 0 }],
            { duration: 700, delay: z * 130, iterations: Infinity });
          svg.appendChild(p2);
        }
      } else {
        /* the painted smiling sun rises from behind the button and turns
           slowly — the sticker itself IS the rays */
        var sw = Math.min(74, Math.max(46, h * 1.5));
        spr("orn-sun.webp", { left: "50%", top: (-sw * 0.62) + "px", width: sw + "px", marginLeft: (-sw / 2) + "px", opacity: 0, zIndex: -1 },
          [[[{ opacity: 0, transform: "translateY(" + (sw * 0.4) + "px) rotate(-20deg)" }, { opacity: 1, transform: "translateY(0) rotate(0deg)" }],
            { duration: 480, easing: "cubic-bezier(.34,1.4,.6,1)", fill: "forwards" }],
           [[{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
            { duration: 26000, delay: 500, iterations: Infinity, easing: "linear" }]]);
        el.style.transition = "box-shadow .35s"; el.style.boxShadow = "0 0 30px -6px rgba(247,201,72,.6)";
      }
    });
    el.addEventListener("mouseleave", function () {
      el.style.boxShadow = "";
      if (live.length) {
        var v = live; live = [];
        v.forEach(function (n) { n.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" }); });
        setTimeout(function () { v.forEach(function (n) { n.remove(); }); }, 260);
      }
    });
    /* magnetic lean */
    if (finePointer && !reduce) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width, dy = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = "translate(" + (dx * 3).toFixed(1) + "px," + (dy * 2.4).toFixed(1) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    }
  }
  function armButtons() {
    document.querySelectorAll(BTN_SEL).forEach(hoverFx);
  }
  armButtons(); setTimeout(armButtons, 1200);
  /* most buttons are rendered by page scripts AFTER load — delegation arms
     any matching element the first time the cursor reaches it, then
     replays the mouseenter so the effect fires on that very hover */
  document.addEventListener("mouseover", function (e) {
    var el = e.target.closest && e.target.closest(BTN_SEL);
    if (el && !el.dataset.wfx) {
      hoverFx(el);
      el.dispatchEvent(new MouseEvent("mouseenter"));
    }
  }, { passive: true });

  /* =====================================================
     5) FLYERS — bird / rushed robot / hot air balloon
     ===================================================== */
  if (!reduce && !IS_LANDING) {
    var FLYERS = [
      /* wander = how far (fraction of viewport height) the flight path may
         drift up/down as it crosses. The bird meanders; the robot is late
         for something and flies a beeline; the balloon sways gently. */
      { img: "flyer-bird.webp",    w: 54, dur: 17000, top: [12, 40], bob: 14, weight: 5, wander: 0.17 },
      { img: "flyer-robot.webp",   w: 46, dur: 6500,  top: [16, 30], bob: 5,  weight: 2, tilt: 10, wander: 0.02 },
      { img: "flyer-balloon.webp", w: 82, dur: 52000, top: [4, 12],  bob: 0,  weight: 3, rise: -40, wander: 0.05 }
    ];
    var airborne = false, seq = 0;
    function launch() {
      if (airborne || document.hidden) { schedule(); return; }
      /* deterministic-ish rotation weighted bird-heavy */
      var pool = []; FLYERS.forEach(function (f, i) { for (var k = 0; k < f.weight; k++) pool.push(i); });
      var f = FLYERS[pool[(seq * 7 + 3) % pool.length]]; seq++;
      var el = document.createElement("div");
      el.className = "wfx-flyer";
      el.style.width = f.w + "px";
      var im = new Image();
      im.src = SPRITES + f.img;
      im.onerror = function () { el.remove(); airborne = false; }; /* sprites not deployed yet -> silently skip */
      im.onload = function () {
        airborne = true;
        var vh = window.innerHeight, topPx = vh * (f.top[0] + Math.random() * (f.top[1] - f.top[0])) / 100;
        var W = window.innerWidth + f.w * 2;
        if (f.tilt) im.style.transform = "rotate(" + f.tilt + "deg)";
        el.appendChild(im);
        document.body.appendChild(el);
        var fromX = -f.w - 20, toX = W;
        /* wandering flight: 7 waypoints, x uniform (steady crossing speed),
           y drifting smoothly within the wander band — never off-screen,
           each segment eased so turns are soft, not zigzag */
        var SEGS = 7, pts = [], yy = topPx;
        var amp = (f.wander || 0) * vh;
        for (var s = 0; s <= SEGS; s++) {
          var x = fromX + (toX - fromX) * s / SEGS;
          if (s > 0) {
            yy += (Math.random() - 0.5) * 2 * amp + (f.rise || 0) / SEGS;
            yy = Math.max(vh * 0.04, Math.min(vh * 0.75, yy));
          }
          pts.push([x, yy]);
        }
        var frames = pts.map(function (pt, s) {
          /* the bird banks into climbs and dives; balloon and robot stay level */
          var rot = 0;
          if (amp > vh * 0.1) {
            var a = pts[Math.max(0, s - 1)], b2 = pts[Math.min(SEGS, s + 1)];
            rot = Math.max(-14, Math.min(14, Math.atan2(b2[1] - a[1], b2[0] - a[0]) * 180 / Math.PI));
          }
          return { transform: "translate(" + pt[0].toFixed(0) + "px," + pt[1].toFixed(0) + "px) rotate(" + rot.toFixed(1) + "deg)", easing: "ease-in-out" };
        });
        el.animate(frames, { duration: f.dur, fill: "forwards" }).onfinish = function () {
          el.remove(); airborne = false; schedule();
        };
        if (f.bob) im.animate([
          { transform: (f.tilt ? "rotate(" + f.tilt + "deg) " : "") + "translateY(0)" },
          { transform: (f.tilt ? "rotate(" + f.tilt + "deg) " : "") + "translateY(" + f.bob + "px)" }
        ], { duration: f.dur > 20000 ? 3000 : 600, direction: "alternate", iterations: Infinity, easing: "ease-in-out" });
      };
    }
    function schedule() { setTimeout(launch, 28000 + Math.random() * 50000); }
    setTimeout(launch, 14000 + Math.random() * 20000);
    document.addEventListener("visibilitychange", function () { /* timers simply no-op while hidden */ });
  }

  /* =====================================================
     6) THE FORGE — hammer + crystal + growing tree,
        landing load cover + page-transition moment
     ===================================================== */
  function forgeHtml() {
    return '<div class="wfx-forge">' +
      '<img class="f-crystal" src="' + SPRITES + 'loader-crystal.webp" alt="">' +
      '<img class="f-tree" src="' + SPRITES + 'loader-sprout.webp" alt="">' +
      '<div class="f-flash"></div>' +
      '<img class="f-hammer" src="' + SPRITES + 'loader-hammer.webp" alt="">' +
      "</div>";
  }
  function playForge(veil, fast) {
    var h = veil.querySelector(".f-hammer"), fl = veil.querySelector(".f-flash"),
        tr = veil.querySelector(".f-tree"), cr = veil.querySelector(".f-crystal");
    if (!h) return;
    var T = fast ? 0.55 : 1;
    h.animate([
      { transform: "rotate(18deg)" }, { transform: "rotate(-38deg)", offset: .42 },
      { transform: "rotate(6deg)", offset: .55 }, { transform: "rotate(18deg)" }
    ], { duration: 620 * T, iterations: fast ? 1 : 2, easing: "ease-in-out" });
    var stages = ["loader-sprout.webp", "loader-tree.webp", "loader-bloom.webp"];
    var si = 0;
    function hit(n) {
      setTimeout(function () {
        fl.animate([{ opacity: .95 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
        cr.animate([{ transform: "scale(1)" }, { transform: "scale(1.14)" }, { transform: "scale(1)" }], { duration: 240 });
        if (si < stages.length) {
          tr.src = SPRITES + stages[si++];
          tr.style.width = (30 + si * 18) + "px";
          tr.style.left = (112 - si * 8) + "px";
          tr.animate([{ opacity: 0, transform: "scale(.4)" }, { opacity: 1, transform: "scale(1)" }],
            { duration: 260, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "forwards" });
        }
      }, n * 620 * T + 260 * T);
    }
    hit(0); if (!fast) hit(1);
  }
  function coverThenReveal() {
    /* arriving on any page: brief veil that the forge finishes off */
    if (reduce || !sessionStorage.getItem("wfx-nav")) return; /* only between internal navigations */
    var veil = document.createElement("div");
    veil.className = "wfx-veil";
    veil.innerHTML = forgeHtml();
    document.body.appendChild(veil);
    var first = !sessionStorage.getItem("wfx-seen");
    sessionStorage.setItem("wfx-seen", "1");
    playForge(veil, !first);
    setTimeout(function () { veil.classList.add("gone"); setTimeout(function () { veil.remove(); }, 400); }, first ? 1500 : 520);
  }
  /* outgoing: mark that the next page load is an internal navigation */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (/^(https?:)?\/\//.test(href) || href.indexOf("mailto:") === 0 || href.charAt(0) === "#") return;
    sessionStorage.setItem("wfx-nav", "1");
  }, { passive: true });
  if (!IS_LANDING) coverThenReveal();

  /* landing: hold a veil until the first scene's clip is actually painting */
  if (IS_LANDING && !reduce) {
    var lv = document.createElement("div");
    lv.className = "wfx-veil";
    lv.innerHTML = forgeHtml();
    document.body.appendChild(lv);
    playForge(lv, false);
    var done = false;
    function reveal() { if (done) return; done = true; lv.classList.add("gone"); setTimeout(function () { lv.remove(); }, 400); }
    var mo = new MutationObserver(function () {
      if (document.querySelector(".sw-scene.has-clip")) { setTimeout(reveal, 350); mo.disconnect(); }
    });
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"] });
    setTimeout(reveal, 2600); /* never hold the door longer than this */
  }
})();
