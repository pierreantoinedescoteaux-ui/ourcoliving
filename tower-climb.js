/* Story page: a tower of toy blocks that builds itself as you read.
   One block per section (early years at the bottom, Now at the top), stacked like
   the Duplo tower in the age-5 photo. A block drops in when its section is reached
   and disappears again if you scroll back up. The next block waits on top as a
   dashed outline. At the end, two dashed floors stay: the ones not built yet.
   Tap a block to jump. Desktop: left margin. Narrow screens: a small row at the bottom. */
(function () {
  var FLOORS = [
    ["sVignettes", "Early years"], ["facilitator", "Université Laval"], ["scale", "A whole country"],
    ["houses", "The houses"], ["rooms-that-move", "C2 Montréal"], ["hard-chapter", "The startup years"], ["now", "Now"]
  ];
  var els = FLOORS.map(function (f) { return document.getElementById(f[0]); });
  if (els.some(function (e) { return !e; })) return;
  var PAL = [["#e7f0e2", "#3c6b32"], ["#fbe29a", "#8f6215"], ["#e3eff3", "#3d7286"], ["#f3dccf", "#8f4a2c"]];
  var DASH = "rgba(60,107,50,.45)";

  var css =
    ".tclimb{position:fixed;z-index:40;opacity:0;pointer-events:none;transition:opacity .5s}" +
    ".tclimb.on{opacity:1;pointer-events:auto}" +
    ".tc-stack{display:flex;flex-direction:column-reverse;align-items:center}" +
    ".tc-b{all:unset;box-sizing:border-box;position:relative;width:58px;height:28px;margin-top:8px;cursor:pointer;" +
      "background:var(--f);border:2px solid var(--s);border-radius:5px;display:grid;place-items:center;" +
      "transform:translateX(var(--x)) rotate(var(--r));box-shadow:0 6px 10px -8px rgba(34,48,31,.55)}" +
    ".tc-b::before,.tc-b::after{content:'';position:absolute;top:-8px;width:13px;height:7px;background:var(--f);" +
      "border:2px solid var(--s);border-bottom:0;border-radius:3px 3px 0 0}" +
    ".tc-b::before{left:9px}.tc-b::after{right:9px}" +
    ".tc-b i{width:12px;height:10px;border:1.6px solid var(--s);border-radius:3px 3px 1px 1px;background:#fffdf8;transition:background .4s,box-shadow .4s}" +
    ".tc-b.here i{background:#d99a3d;box-shadow:0 0 0 4px rgba(217,154,61,.25)}" +
    ".tc-b.off{display:none}" +
    ".tc-b.ghost{background:transparent!important;border-color:" + DASH + "!important;border-style:dashed;box-shadow:none;cursor:default;transform:none}" +
    ".tc-b.ghost::before,.tc-b.ghost::after{background:transparent!important;border-color:" + DASH + "!important;border-style:dashed}.tc-b.ghost i,.tc-b.ghost .tc-l{visibility:hidden}" +
    ".tc-b.drop{animation:tcDrop .7s cubic-bezier(.34,1.56,.64,1)}" +
    "@keyframes tcDrop{from{opacity:0;transform:translate(var(--x),-80px) rotate(calc(var(--r) * -3))}}" +
    ".tc-b:focus-visible{outline:2px solid #d99a3d;outline-offset:3px}" +
    ".tc-l{position:absolute;left:72px;white-space:nowrap;font:600 .72rem/1 Switzer,system-ui,sans-serif;letter-spacing:.04em;" +
      "color:#22301f;background:#fffdf8;border:1px solid rgba(34,48,31,.14);border-radius:99px;padding:7px 11px;" +
      "box-shadow:0 8px 20px -14px rgba(34,48,31,.5);opacity:0;transform:translateX(-4px);transition:opacity .2s,transform .2s;pointer-events:none}" +
    ".tc-b:hover .tc-l,.tc-b:focus-visible .tc-l{opacity:1;transform:none}" +
    ".tc-ground{display:block;width:86px;height:2px;border-radius:2px;background:" + DASH + ";margin:4px auto 0;position:relative}" +
    ".tc-ground::before{content:'';position:absolute;left:8px;right:8px;top:2px;height:6px;" +
      "background:repeating-linear-gradient(90deg,rgba(92,158,74,.55) 0 2px,transparent 2px 9px)}" +
    "@media(min-width:1180px){.tclimb{left:max(16px,calc((100vw - 1320px)/2 - 36px));bottom:max(40px,12vh)}}" +
    "@media(max-width:1179px){.tclimb{left:50%;bottom:calc(12px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);" +
      "background:rgba(246,242,231,.94);border:1px solid rgba(34,48,31,.14);border-radius:16px;padding:12px 14px 9px;" +
      "box-shadow:0 12px 28px -18px rgba(34,48,31,.55)}" +
      ".tc-stack{flex-direction:row;align-items:flex-end;gap:5px}" +
      ".tc-b{width:30px;height:18px;margin-top:6px;border-radius:4px;transform:none}" +
      ".tc-b::before,.tc-b::after{top:-6px;width:7px;height:5px}.tc-b::before{left:5px}.tc-b::after{right:5px}" +
      ".tc-b i{width:7px;height:6px}.tc-l,.tc-ground{display:none}" +
      "@keyframes tcDrop{from{opacity:0;transform:translateY(-34px)}}}" +
    "@media(prefers-reduced-motion:reduce){.tclimb,.tc-b i{transition:none!important}.tc-b.drop{animation:none}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var nav = document.createElement("nav");
  nav.className = "tclimb"; nav.setAttribute("aria-label", "Chapters of the story");
  var html = '<div class="tc-stack">';
  FLOORS.forEach(function (f, i) {
    var p = PAL[i % PAL.length], r = (i % 2 ? 1.6 : -1.4) + "deg", x = (i % 3 - 1) * 3 + "px";
    html += '<button type="button" class="tc-b off" data-i="' + i + '" aria-label="' + f[1] + '" style="--f:' + p[0] +
      ";--s:" + p[1] + ";--r:" + r + ";--x:" + x + '"><i></i><span class="tc-l">' + f[1] + "</span></button>";
  });
  html += '<span class="tc-b ghost off" aria-hidden="true"><i></i></span><span class="tc-b ghost off" aria-hidden="true"><i></i></span>' +
    '</div><span class="tc-ground"></span>';
  nav.innerHTML = html;
  document.body.appendChild(nav);

  var blocks = [].slice.call(nav.querySelectorAll("button.tc-b")), extra = nav.querySelectorAll("span.ghost");
  var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  nav.addEventListener("click", function (e) {
    var b = e.target.closest("button.tc-b"); if (!b || b.classList.contains("ghost")) return;
    els[+b.getAttribute("data-i")].scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });
  nav.addEventListener("animationend", function (e) { e.target.classList.remove("drop"); });

  var prev = -2, ticking = false, endEl = document.getElementById("sClose"), last = blocks.length - 1;
  function update() {
    ticking = false;
    var here = -1;
    els.forEach(function (el, i) { if (el.getBoundingClientRect().top < innerHeight * 0.6) here = i; });
    here = Math.max(here, 0);
    var atEnd = !!endEl && endEl.getBoundingClientRect().top < innerHeight * 0.75;
    blocks.forEach(function (b, i) {
      var built = i <= here, next = i === here + 1;
      if (built && i > prev && prev > -2) b.classList.add("drop");
      b.classList.toggle("off", !built && !next);
      b.classList.toggle("ghost", next);
      b.classList.toggle("here", i === here);
      if (next) b.setAttribute("tabindex", "-1"); else b.removeAttribute("tabindex");
    });
    extra[0].classList.toggle("off", !(here === last && atEnd));
    extra[1].classList.toggle("off", !(here === last && atEnd));
    prev = here;
    var first = els[0].getBoundingClientRect().top, bottom = (endEl || els[last]).getBoundingClientRect().bottom;
    nav.classList.toggle("on", first < innerHeight * 0.9 && bottom > innerHeight * 0.3);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  update();
})();
