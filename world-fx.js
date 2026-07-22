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
".wfx-mote{position:fixed;border-radius:50%;pointer-events:none;z-index:60;will-change:transform;filter:blur(.6px)}" +
".wfx-flyer{position:fixed;left:0;top:0;pointer-events:none;z-index:65;will-change:transform}" +
".wfx-flyer img{display:block;width:100%;height:auto}" +
".wfx-bloom{position:fixed;pointer-events:none;z-index:9999;will-change:transform}" +
".wfx-hover{position:absolute;inset:-14px;pointer-events:none;overflow:visible;z-index:5}" +
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
  if (!reduce && !IS_LANDING) {
    var MOTES = window.innerWidth < 700 ? 5 : 8;
    var motes = [], mx = -999, my = -999;
    for (var i = 0; i < MOTES; i++) {
      var m = document.createElement("div");
      m.className = "wfx-mote";
      var s = 3 + (i % 4);
      m.style.width = s + "px"; m.style.height = s + "px";
      m.style.background = i % 3 ? "rgba(217,154,61," + (0.32 + (i % 3) * 0.14) + ")" : "rgba(247,201,72,.42)";
      document.body.appendChild(m);
      motes.push({ el: m, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
        vx: 0, vy: 0, ph: Math.random() * 6.28, sp: 0.14 + Math.random() * 0.2 });
    }
    if (finePointer) document.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
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
        if (d2 < 16900) { var d = Math.sqrt(d2) || 1, f = (130 - d) * 0.0022 * dt; o.vx += dx / d * f; o.vy += dy / d * f; }
        o.vx *= 0.978; o.vy *= 0.978;
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
    var cols = [accent, "#5c9e4a", "#d99a3d", "#f7c948", "#3c6b32"];
    for (var k = 0; k < 7; k++) {
      var p = document.createElement("span");
      p.className = "wfx-bloom";
      var leaf = k % 2;
      p.style.width = leaf ? "9px" : "5px"; p.style.height = leaf ? "5px" : "5px";
      p.style.borderRadius = leaf ? "80% 20% 80% 20%" : "50%";
      p.style.background = cols[k % cols.length];
      p.style.left = e.clientX + "px"; p.style.top = e.clientY + "px";
      document.body.appendChild(p);
      var a = -Math.PI / 2 + (k - 3) * 0.5 + Math.random() * 0.25, d = 26 + (k % 3) * 16;
      p.animate([
        { transform: "translate(-50%,-50%) scale(.6) rotate(0deg)", opacity: 1 },
        { transform: "translate(" + (Math.cos(a) * d) + "px," + (Math.sin(a) * d + 10) + "px) scale(1) rotate(" + (leaf ? 140 : 40) + "deg)", opacity: 0 }
      ], { duration: 520 + k * 40, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" });
      (function (el) { setTimeout(function () { el.remove(); }, 900); })(p);
    }
  }, { passive: true });

  /* =====================================================
     3) MAGNETIC CTAS + 4) HOVER MOODS (sprout / zap / sun)
     ===================================================== */
  var BTN_SEL = 'a[class*="btn"],a[class*="cta"],.ctas a,.sw-copy__cta a,.wback,.deep,.liblink a,button[type="submit"]';
  function hoverFx(el) {
    if (el.dataset.wfx) return;
    el.dataset.wfx = "1";
    var mood = el.matches(".primary,[data-fx-sun]") ? "sun" : MOOD;
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    var live = null;
    el.addEventListener("mouseenter", function () {
      if (reduce) return;
      var w = el.offsetWidth, h = el.offsetHeight;
      var ns = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(ns, "svg");
      svg.setAttribute("class", "wfx-hover");
      svg.setAttribute("viewBox", "-14 -14 " + (w + 28) + " " + (h + 28));
      if (mood === "leaf") {
        /* two stems grow from the corners, leaves pop at the tips */
        [[2, h - 2, -1], [w - 2, 2, 1]].forEach(function (c, ci) {
          var p = document.createElementNS(ns, "path");
          var sx = c[0], sy = c[1], dir = c[2];
          p.setAttribute("d", "M" + sx + "," + sy + " q" + (10 * dir) + "," + (-14) + " " + (4 * dir) + "," + (-26) + " q" + (-6 * dir) + ",-10 " + (2 * dir) + ",-18");
          p.setAttribute("fill", "none"); p.setAttribute("stroke", "#5c9e4a");
          p.setAttribute("stroke-width", "2.4"); p.setAttribute("stroke-linecap", "round");
          var L = 70; p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
          p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 420, delay: ci * 70, easing: "ease-out", fill: "forwards" });
          svg.appendChild(p);
          [[sx + 6 * dir, sy - 26, "#5c9e4a"], [sx + 2 * dir, sy - 44, ci ? "#d99a3d" : "#e58ab7"]].forEach(function (lf, li) {
            var e2 = document.createElementNS(ns, "ellipse");
            e2.setAttribute("cx", lf[0]); e2.setAttribute("cy", lf[1]);
            e2.setAttribute("rx", li ? 4.5 : 6); e2.setAttribute("ry", li ? 4.5 : 2.8);
            e2.setAttribute("fill", lf[2]);
            e2.setAttribute("transform", "rotate(" + (dir * -35) + " " + lf[0] + " " + lf[1] + ")");
            e2.animate([{ opacity: 0, transform: "scale(.2)" }, { opacity: 1, transform: "scale(1)" }],
              { duration: 300, delay: 250 + ci * 90 + li * 110, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "forwards" });
            e2.style.opacity = 0; e2.style.transformOrigin = lf[0] + "px " + lf[1] + "px";
            svg.appendChild(e2);
          });
        });
      } else if (mood === "zap") {
        /* holographic arcs flicker around the border */
        for (var z = 0; z < 3; z++) {
          var p2 = document.createElementNS(ns, "path");
          var y0 = z % 2 ? -6 : h + 6, x0 = 8 + z * (w / 3.2);
          var seg = "M" + x0 + "," + y0;
          for (var q = 1; q <= 4; q++) seg += " L" + (x0 + q * 12) + "," + (y0 + (q % 2 ? -5 : 5));
          p2.setAttribute("d", seg); p2.setAttribute("fill", "none");
          p2.setAttribute("stroke", z ? "#7fd4ff" : "#c9a7ff"); p2.setAttribute("stroke-width", "1.8");
          p2.setAttribute("stroke-linecap", "round");
          p2.style.filter = "drop-shadow(0 0 4px rgba(120,210,255,.9))";
          p2.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: .25 }, { opacity: 1 }, { opacity: 0 }],
            { duration: 700, delay: z * 130, iterations: Infinity });
          svg.appendChild(p2);
        }
      } else {
        /* sun: golden rays fan out from behind */
        for (var r = 0; r < 10; r++) {
          var ln = document.createElementNS(ns, "line");
          var ang = (r / 10) * Math.PI * 2, cx = w / 2, cy = h / 2;
          var rx = w / 2 + 8, ry = h / 2 + 8;
          ln.setAttribute("x1", cx + Math.cos(ang) * rx); ln.setAttribute("y1", cy + Math.sin(ang) * ry);
          ln.setAttribute("x2", cx + Math.cos(ang) * (rx + 9)); ln.setAttribute("y2", cy + Math.sin(ang) * (ry + 9));
          ln.setAttribute("stroke", r % 2 ? "#f7c948" : "#d99a3d"); ln.setAttribute("stroke-width", "2.6");
          ln.setAttribute("stroke-linecap", "round");
          ln.animate([{ opacity: 0, transform: "scale(.85)" }, { opacity: 1, transform: "scale(1)" }],
            { duration: 320, delay: r * 26, easing: "ease-out", fill: "forwards" });
          ln.style.opacity = 0; ln.style.transformOrigin = cx + "px " + cy + "px";
          svg.appendChild(ln);
        }
        el.style.transition = "box-shadow .35s"; el.style.boxShadow = "0 0 30px -6px rgba(247,201,72,.55)";
      }
      el.appendChild(svg); live = svg;
    });
    el.addEventListener("mouseleave", function () {
      el.style.boxShadow = "";
      if (live) { var v = live; live = null; v.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: "forwards" }); setTimeout(function () { v.remove(); }, 260); }
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
  if (!IS_LANDING) { armButtons(); setTimeout(armButtons, 1200); }

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
