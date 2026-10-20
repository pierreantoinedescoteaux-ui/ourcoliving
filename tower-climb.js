/* Story page: a small line-drawn tower that climbs as you read.
   One floor per section (early years at the bottom, Now at the top); each window
   lights gold once its section is reached. The two dashed floors above are the
   ones not built yet, the same idea the story ends on. Tap a floor to jump.
   Desktop: sticky in the left margin. Narrow screens: a small row at the bottom. */
(function () {
  var FLOORS = [
    ["sVignettes", "Early years"], ["facilitator", "Université Laval"], ["scale", "A whole country"],
    ["houses", "The houses"], ["rooms-that-move", "C2"], ["hard-chapter", "The startup years"], ["now", "Now"]
  ];
  var els = FLOORS.map(function (f) { return document.getElementById(f[0]); });
  if (els.some(function (e) { return !e; })) return;

  var css =
    ".tclimb{--ink:#3c6b32;--gold:#d99a3d;position:fixed;z-index:40;display:flex;align-items:center;" +
      "opacity:0;pointer-events:none;transition:opacity .5s}" +
    ".tclimb.on{opacity:1;pointer-events:auto}" +
    ".tclimb .tc-floors{display:flex;flex-direction:column-reverse;align-items:center}" +
    ".tclimb button{all:unset;cursor:pointer;display:grid;place-items:center;width:34px;height:26px;" +
      "border:2px solid var(--ink);border-bottom-width:0;background:#fffdf8;position:relative}" +
    ".tclimb button:first-child{border-bottom-width:2px}" +
    ".tclimb button i{width:10px;height:9px;border:1.6px solid var(--ink);border-radius:2px;transition:background .4s,box-shadow .4s}" +
    ".tclimb button.lit i{background:var(--gold)}" +
    ".tclimb button.here i{box-shadow:0 0 0 4px rgba(217,154,61,.28)}" +
    ".tclimb button:focus-visible{outline:2px solid var(--gold);outline-offset:2px}" +
    ".tclimb button .tc-l{position:absolute;left:46px;white-space:nowrap;font:600 .7rem/1 Switzer,system-ui,sans-serif;" +
      "letter-spacing:.06em;color:#5c6b57;background:#fffdf8;border:1px solid rgba(34,48,31,.14);border-radius:99px;padding:6px 10px;z-index:2;opacity:0;transform:translateX(-4px);transition:opacity .25s,transform .25s;pointer-events:none}" +
    ".tclimb button:hover .tc-l,.tclimb button:focus-visible .tc-l{opacity:1;transform:none}" +
    ".tclimb .tc-ghost{width:34px;height:22px;border:2px dashed rgba(60,107,50,.45);border-bottom:0}" +
    ".tclimb .tc-roof{width:0;height:0;border-left:21px solid transparent;border-right:21px solid transparent;" +
      "border-bottom:16px solid rgba(60,107,50,.25);margin-bottom:-1px}" +
    ".tclimb .tc-ground{width:56px;height:2px;background:rgba(60,107,50,.4);margin-top:0}" +
    /* desktop: left margin, vertically centred */
    "@media(min-width:1180px){.tclimb{left:max(14px,calc((100vw - 1320px)/2 - 30px));top:50%;transform:translateY(-50%);flex-direction:column}}" +
    /* narrow: a small horizontal row at the bottom */
    "@media(max-width:1179px){.tclimb{left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);" +
      "flex-direction:row;background:rgba(246,242,231,.92);border:1px solid rgba(34,48,31,.14);border-radius:99px;padding:6px 12px;" +
      "box-shadow:0 10px 26px -16px rgba(34,48,31,.5)}" +
      ".tclimb .tc-floors{flex-direction:row}.tclimb button{width:22px;height:20px;border-width:2px 0 2px 2px}" +
      ".tclimb button:first-child{border-bottom-width:2px}.tclimb button i{width:7px;height:7px}" +
      ".tclimb .tc-l,.tclimb .tc-roof,.tclimb .tc-ground{display:none}" +
      ".tclimb .tc-ghosts{display:flex}.tclimb .tc-ghost{width:20px;height:20px;border:2px dashed rgba(60,107,50,.45);border-right:0}" +
      ".tclimb .tc-ghost:last-child{border-right:2px dashed rgba(60,107,50,.45)}" +
      ".tclimb .tc-floors button:last-child{border-right-width:2px}}" +
    "@media(prefers-reduced-motion:reduce){.tclimb,.tclimb *{transition:none!important}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var nav = document.createElement("nav");
  nav.className = "tclimb"; nav.setAttribute("aria-label", "Chapters of the story");
  var floors = FLOORS.map(function (f, i) {
    return '<button type="button" data-i="' + i + '" aria-label="' + f[1] + '"><i></i><span class="tc-l">' + f[1] + "</span></button>";
  }).join("");
  var narrow = window.matchMedia("(max-width:1179px)");
  function build() {
    nav.innerHTML = narrow.matches
      ? '<div class="tc-floors">' + floors + '</div><div class="tc-ghosts"><span class="tc-ghost"></span><span class="tc-ghost"></span></div>'
      : '<span class="tc-roof"></span><span class="tc-ghost"></span><span class="tc-ghost"></span><div class="tc-floors">' + floors + '</div><span class="tc-ground"></span>';
    update();
  }
  document.body.appendChild(nav);

  var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  nav.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    els[+b.getAttribute("data-i")].scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });

  var ticking = false;
  function update() {
    ticking = false;
    var line = innerHeight * 0.55, here = -1;
    els.forEach(function (el, i) { if (el.getBoundingClientRect().top < line) here = i; });
    var btns = nav.querySelectorAll("button");
    btns.forEach(function (b, i) { b.classList.toggle("lit", i <= here); b.classList.toggle("here", i === here); });
    var first = els[0].getBoundingClientRect().top, last = (document.getElementById("sClose") || els[els.length - 1]).getBoundingClientRect().bottom;
    nav.classList.toggle("on", first < innerHeight * 0.9 && last > innerHeight * 0.35);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  (narrow.addEventListener ? narrow.addEventListener("change", build) : narrow.addListener(build));
  build();
})();
