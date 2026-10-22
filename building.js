/* "This room is still being built" — one shared piece for the rooms that are open
   but not finished. Drop <div data-building></div> where it should sit.
     data-variant="banner"  card beside existing content (resources, networks)
     (default)              centred, for rooms that are mostly scaffolding so far
     data-line="..."        overrides the invitation line
   Self-contained: injects its own CSS once. Drawing = the tower's room language:
   half the walls up, the other half still dashed, a crane lowering the next window. */
(function () {
  var EMAIL = "pierreantoinedescoteaux@gmail.com";
  var css =
    ".bld{--b-ink:#3c6b32;--b-gold:#d99a3d;--b-line:rgba(34,48,31,.14);font-family:inherit}" +
    ".bld svg{display:block;width:100%;height:auto;overflow:visible}" +
    ".bld .hook{animation:bldBob 3.6s ease-in-out infinite;transform-origin:244px 20px}" +
    ".bld .glow{animation:bldGlow 2.8s ease-in-out infinite}" +
    "@keyframes bldBob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(7px) rotate(-1.5deg)}}" +
    "@keyframes bldGlow{0%,100%{opacity:.95}50%{opacity:.55}}" +
    "@media (prefers-reduced-motion:reduce){.bld .hook,.bld .glow{animation:none}}" +
    ".bld-tag{display:inline-flex;align-items:center;gap:9px;border:1.5px dashed rgba(34,48,31,.32);border-radius:99px;" +
      "padding:8px 18px;font-size:max(12px,.74rem);font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#5c6b57}" +
    ".bld-tag i{width:8px;height:8px;border-radius:50%;background:var(--b-gold);animation:bldGlow 2.2s ease-in-out infinite}" +
    ".bld-line{color:#5c6b57;margin:14px 0 0;font-size:max(16px,clamp(.98rem,1.2vw,1.08rem));line-height:1.55}" +
    ".bld-cta{display:inline-flex;align-items:center;gap:8px;margin-top:16px;background:#fffdf8;border:1px solid var(--b-line);" +
      "border-radius:99px;padding:11px 22px;font-size:.88rem;font-weight:600;color:#22301f;transition:border-color .25s,transform .25s,box-shadow .25s}" +
    ".bld-cta:hover{border-color:var(--b-ink);color:var(--b-ink);transform:translateY(-2px);box-shadow:0 14px 30px -18px rgba(34,48,31,.4)}" +
    /* centred */
    ".bld-stub{text-align:center;margin:clamp(22px,4vh,40px) auto 0;max-width:520px}" +
    ".bld-stub svg{max-width:340px;margin:0 auto clamp(18px,3vh,28px)}" +
    ".bld-stub .bld-line{max-width:44ch;margin-left:auto;margin-right:auto}" +
    /* banner */
    ".bld-banner{display:grid;grid-template-columns:minmax(150px,230px) 1fr;gap:clamp(18px,3vw,36px);align-items:center;" +
      "background:#fffdf8;border:1.5px dashed rgba(34,48,31,.22);border-radius:24px;padding:clamp(18px,2.6vw,30px);margin:clamp(24px,4vh,40px) 0 0}" +
    "@media(max-width:640px){.bld-banner{grid-template-columns:1fr;text-align:center}.bld-banner svg{max-width:240px;margin:0 auto}}";

  function art() {
    var I = "var(--b-ink)", G = "var(--b-gold)";
    return '<svg viewBox="0 0 320 200" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      /* ground */
      '<path d="M8 186 H312" stroke="' + I + '" stroke-width="2" opacity=".35"/>' +
      /* built half: wall, roof, door, lit window */
      '<path d="M54 186 V92 L118 52 L150 72" stroke="' + I + '" stroke-width="2.6"/>' +
      '<path d="M54 186 H150" stroke="' + I + '" stroke-width="2.6"/>' +
      '<path d="M78 186 V150 a12 12 0 0 1 24 0 V186" stroke="' + I + '" stroke-width="2.2"/>' +
      '<rect x="72" y="104" width="30" height="28" rx="3" fill="' + G + '" class="glow" stroke="' + I + '" stroke-width="2.2"/>' +
      '<path d="M87 104 V132 M72 118 H102" stroke="' + I + '" stroke-width="1.6"/>' +
      /* vine climbing the built wall */
      '<path d="M58 186 C66 170 52 160 62 146 C70 134 58 124 66 112" stroke="#5c9e4a" stroke-width="2"/>' +
      '<path d="M62 170 q-8 -2 -10 -9 M60 152 q8 -3 11 -10 M64 128 q-8 -1 -11 -8" stroke="#5c9e4a" stroke-width="1.8"/>' +
      /* unbuilt half, still dashed */
      '<path d="M150 72 L182 92 V186 H150" stroke="' + I + '" stroke-width="2" stroke-dasharray="5 6" opacity=".55"/>' +
      '<rect x="150" y="104" width="22" height="28" rx="3" stroke="' + I + '" stroke-width="1.8" stroke-dasharray="4 5" opacity=".55"/>' +
      /* scaffolding */
      '<path d="M192 186 V96 M224 186 V96" stroke="' + I + '" stroke-width="2.2"/>' +
      '<path d="M186 120 H230 M186 152 H230" stroke="' + I + '" stroke-width="3.2"/>' +
      '<path d="M192 152 L224 120 M192 186 L224 152" stroke="' + I + '" stroke-width="1.4" opacity=".6"/>' +
      /* ladder */
      '<path d="M236 186 L246 124 M248 186 L258 124 M239 168 H251 M242 150 H254 M245 134 H256" stroke="' + I + '" stroke-width="1.6" opacity=".75"/>' +
      /* crane mast + jib */
      '<path d="M292 186 V20 M276 186 L292 160 L308 186" stroke="' + I + '" stroke-width="2.2"/>' +
      '<path d="M292 34 L292 160 M286 40 L298 52 M298 64 L286 76 M286 88 L298 100 M298 112 L286 124 M286 136 L298 148" stroke="' + I + '" stroke-width="1.2" opacity=".5"/>' +
      '<path d="M206 20 H312 M292 20 L270 8 L246 20" stroke="' + I + '" stroke-width="2.2"/>' +
      /* hook lowering the next window */
      '<g class="hook">' +
        '<path d="M244 20 V62" stroke="' + I + '" stroke-width="1.4"/>' +
        '<path d="M244 62 l-10 12 M244 62 l10 12" stroke="' + I + '" stroke-width="1.4"/>' +
        '<rect x="230" y="74" width="28" height="24" rx="3" fill="' + G + '" stroke="' + I + '" stroke-width="2"/>' +
        '<path d="M244 74 V98 M230 86 H258" stroke="' + I + '" stroke-width="1.4"/>' +
      '</g>' +
      /* a few bricks waiting */
      '<path d="M158 186 v-8 h16 v8 M166 178 v-8 h16 v8" stroke="' + G + '" stroke-width="2"/>' +
    '</svg>';
  }

  function render(el) {
    var banner = el.getAttribute("data-variant") === "banner";
    var line = el.getAttribute("data-line") ||
      (banner ? "Here's what's on the shelves so far. It grows as I learn, and with your help."
              : "The walls are going up. Know something that belongs in this room? Tell me, and we'll build it together.");
    var subject = encodeURIComponent("For the tower: " + document.title.split(" — ")[0]);
    var text =
      '<div><span class="bld-tag"><i aria-hidden="true"></i>This room is still being built</span>' +
      '<p class="bld-line">' + line + '</p>' +
      '<a class="bld-cta" href="mailto:' + EMAIL + '?subject=' + subject + '">' +
        "Suggest something" + ' &rarr;</a></div>';
    el.className = "bld " + (banner ? "bld-banner" : "bld-stub");
    el.innerHTML = banner ? art() + text : art() + text;
  }

  if (!document.getElementById("bld-css")) {
    var s = document.createElement("style"); s.id = "bld-css"; s.textContent = css;
    document.head.appendChild(s);
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-building]"), render);
})();
