/* =====================================================================
   GUIDE RENDER — shared field-guide body + type symbols.
   Used by type.html (full page) and map.html (field-notes popup) so the
   guide content is written once. Styling is per-page (same class names).

   - TYPE_ICONS[slug] → minimalist inline SVG symbol for the atlas
   - typeIcon(slug, cls) → svg string
   - guideBodyHTML(t, k) → the guide body sections (model+origin, diagram
     slot, teaches, themes, who/watch, axes, examples)

   Diagram slot: when knowledge-data.js gains `diagram:{src,cap}` on a
   type, the image renders; until then a designed placeholder shows.
   (Generated per ASSETS.md pipeline — awaiting P-A's image MCP.)
   ===================================================================== */

var TYPE_ICONS = {
  "ecovillage":
    '<circle cx="7.5" cy="10.5" r="3.6"/><path d="M7.5 14.1V20"/><path d="M13 20v-5.4l3.8-3 3.8 3V20h-7.6z"/><path d="M2.5 20h19"/>',
  "cohousing":
    '<path d="M3 19.5v-5.4l4-3.4 4 3.4v5.4H3z"/><path d="M13 19.5v-5.4l4-3.4 4 3.4v5.4h-8z"/><path d="M2 19.5h20"/>',
  "housing-coop":
    '<path d="M6.5 20V4.5h11V20"/><path d="M9.8 8h1.6M13 8h1.6M9.8 11.5h1.6M13 11.5h1.6M9.8 15h1.6M13 15h1.6"/><path d="M11 20v-2.6h2V20"/><path d="M4 20h16"/>',
  "baugruppen":
    '<path d="M4 13.8l8-6.3 8 6.3"/><path d="M4.5 20h15M4.5 16.9h15"/><path d="M9.5 20v-3.1M14.5 20v-3.1M7 16.9v-2.4M12 16.9v-2.4M17 16.9v-2.4"/>',
  "kibbutz":
    '<circle cx="12" cy="7.5" r="2.7"/><path d="M12 2.6v1M16.4 5.3l.8-.7M7.6 5.3l-.8-.7"/><path d="M3.5 14.5h17M5.5 17.5h13M8 20.5h8"/>',
  "intergenerational":
    '<circle cx="8.7" cy="6.4" r="2.3"/><path d="M8.7 8.7v7"/><circle cx="15.8" cy="10.6" r="1.8"/><path d="M15.8 12.4v4.6"/><path d="M8.7 12.2l7.1 1.6"/><path d="M5 19.8h14"/>',
  "hacker-house":
    '<path d="M4 20v-8.6L12 5l8 6.4V20H4z"/><path d="M8.7 12.8l2.6 2.2-2.6 2.2"/><path d="M13.2 17.2h3.2"/>',
  "operator-coliving":
    '<path d="M8 20V3.8h8V20"/><path d="M10.6 7h2.8M10.6 10.3h2.8M10.6 13.6h2.8"/><path d="M11 20v-2.8h2V20"/><path d="M5 20h14"/>',
  "entrepreneur-house":
    '<path d="M5 20v-7.6L12 7l7 5.4V20H5z"/><path d="M12 6.8V2.4"/><path d="M12 2.4h4.2l-1.4 1.6 1.4 1.6H12"/>',
  "rural-coliving":
    '<path d="M10.5 19.5l5.2-8 5.3 8"/><path d="M3.5 19.5v-4.2l3-2.6 3 2.6v4.2h-6z"/><path d="M2 19.5h20"/>',
  "network-village":
    '<path d="M10 8V5.6l2-1.7 2 1.7V8h-4z"/><path d="M3 19.5v-2.4l2-1.7 2 1.7v2.4H3z"/><path d="M17 19.5v-2.4l2-1.7 2 1.7v2.4h-4z"/><path d="M10.7 8.6L6 15M13.3 8.6L18 15M7.5 18h9"/>',
  "student-coop":
    '<path d="M4 20v-8.4L12 5.4l8 6.2V20H4z"/><path d="M12 11.6l4.4 1.7-4.4 1.7-4.4-1.7z"/><path d="M16.4 13.5v2.4"/>',
  "_default": '<circle cx="12" cy="12" r="5"/>'
};

function typeIcon(slug, cls){
  return '<svg class="' + (cls || "tsym") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    (TYPE_ICONS[slug] || TYPE_ICONS._default) + '</svg>';
}

/* ---------------------------------------------------------------------
   FIELD GUIDE v2 (feedback round, 2026-10-21): one style from top to
   bottom, like an illustrated field guide. Numbered chapters with real
   headings, text sitting on the page (no boxes), every image a plate
   with its caption underneath. The styles live here, so the full page
   and the map pop-up look the same.
     guideBodyHTML(t, k)                  full guide (type.html)
     guideBodyHTML(t, k, { short: true }) short version (map pop-up)
     guideEnhance(root)                   sticky chapter index highlight
   Longer text comes from guide-content-data.js (GUIDE_CONTENT); a type
   without it falls back to its one-line notes in knowledge-data.js.
   --------------------------------------------------------------------- */
var GUIDE_AREAS = ["governance", "financing", "space", "community", "operations", "privacy", "leaving"];
var GUIDE_SPECTRUM_GLOSS = { share: "spectrum-share", size: "spectrum-size", time: "spectrum-time", power: "spectrum-power",
  autonomy: "spectrum-autonomy", ecoTech: "spectrum-ecotech", effort: "spectrum-effort" };

(function injectGuideCss(){
  if (typeof document === "undefined" || document.getElementById("fg-css")) return;
  var c =
  ".fg-full-wrap{display:block}" +
  ".fg-index{position:sticky;top:calc(var(--navh,64px) + 8px);z-index:20;height:0}" +
  ".fg-idx-btn{position:absolute;left:0;top:0;font:600 .8rem/1 var(--sans,inherit);color:var(--ink,#22301f);background:rgba(246,242,231,.95);backdrop-filter:blur(10px);border:1px solid var(--line-strong,rgba(34,48,31,.3));border-radius:99px;padding:0 14px;min-height:44px;cursor:pointer}" +
  ".fg-idx-list{display:none;position:absolute;left:0;top:50px;width:min(300px,calc(100vw - 2 * var(--gutter,18px)));background:rgba(251,249,242,.98);border:1px solid var(--line-strong,rgba(34,48,31,.3));border-radius:14px;padding:6px;box-shadow:0 18px 40px -18px rgba(34,48,31,.5)}" +
  ".fg-index.open .fg-idx-list{display:block}" +
  ".fg-index a{font-size:.85rem;font-weight:600;color:var(--ink-soft,#5c6b57);padding:10px 12px;border-radius:10px;min-height:44px;display:flex;align-items:center;gap:8px;transition:background .25s,color .25s}" +
  ".fg-index a i{font-family:var(--serif,Georgia,serif);font-style:italic;font-weight:400;color:var(--gold-deep,#8f6215)}" +
  ".fg-index a:hover{background:var(--sky-wash,#e3eff3);color:var(--ink,#22301f)}" +
  ".fg-index a.on{background:var(--green-deep,#3c6b32);color:#fff}.fg-index a.on i{color:#f3d9a6}" +
  "@media(min-width:1000px){.fg-full-wrap{display:grid;grid-template-columns:176px minmax(0,1fr);column-gap:clamp(20px,3vw,44px);align-items:start}" +
  ".fg-index{height:auto;align-self:start;padding-top:clamp(40px,7vh,84px)}.fg-idx-btn{display:none}" +
  ".fg-idx-list{display:block;position:static;width:auto;background:none;border:0;border-radius:0;padding:0;box-shadow:none}" +
  ".fg-index a{font-size:.78rem;min-height:0;padding:7px 10px;border-radius:8px;line-height:1.25}}" +
  ".fg-ch{padding:clamp(40px,7vh,84px) 0 clamp(10px,2vh,20px);scroll-margin-top:calc(var(--navh,64px) + 64px)}" +
  ".fg-h{display:flex;align-items:baseline;gap:16px;border-top:1.5px solid var(--ink,#22301f);padding-top:16px;margin-bottom:clamp(20px,3.5vh,34px)}" +
  ".fg-h .fg-n{font-family:var(--serif,Georgia,serif);font-style:italic;font-size:clamp(1.1rem,1.6vw,1.4rem);color:var(--gold-deep,#8f6215);min-width:2.2em}" +
  ".fg-h h2{font-family:var(--serif,Georgia,serif);font-weight:300;font-size:clamp(2rem,3.8vw,3.1rem);line-height:1.04;letter-spacing:-.015em;color:var(--ink,#22301f);margin:0}" +
  ".fg-ch p{color:var(--ink-soft,#5c6b57);line-height:1.7;max-width:66ch;margin:0 0 1em}" +
  ".fg-cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,300px);gap:clamp(24px,5vw,64px);align-items:start}" +
  "@media(max-width:820px){.fg-cols{grid-template-columns:1fr}}" +
  ".fg-lead p:first-child{font-family:var(--serif,Georgia,serif);font-size:clamp(1.25rem,1.9vw,1.55rem);line-height:1.45;color:var(--ink,#22301f)}" +
  ".fg-margin{border-left:2px solid var(--gold,#d99a3d);padding:4px 0 4px 20px;font-size:.95rem}" +
  ".fg-margin .fg-mk{display:block;font-family:var(--serif,Georgia,serif);font-style:italic;color:var(--gold-deep,#8f6215);font-size:1.02rem;margin-bottom:6px}" +
  ".fg-ch .fg-margin p{font-size:max(16px,.92em);line-height:1.55;margin-bottom:10px}" +
  ".fg-quote{font-family:var(--serif,Georgia,serif);font-style:italic;font-weight:300;font-size:clamp(1.5rem,3vw,2.4rem);line-height:1.28;color:var(--ink,#22301f);max-width:30ch;margin:clamp(24px,4vh,44px) 0 6px;padding-left:22px;border-left:3px solid var(--gold,#d99a3d)}" +
  ".fg-quote-by{font-size:max(16px,.85em);color:var(--ink-faint,#93a08d);padding-left:25px}" +
  ".fg-plate{margin:0 0 clamp(26px,4vh,44px)}" +
  ".fg-plate img{width:100%;display:block;border-radius:6px;box-shadow:0 24px 50px -30px rgba(34,48,31,.45);background:var(--sky-wash,#e3eff3)}" +
  ".fg-plate figcaption{font-family:var(--serif,Georgia,serif);font-style:italic;font-size:1rem;color:var(--ink-soft,#5c6b57);margin-top:10px;max-width:70ch}" +
  ".fg-plate figcaption b{font-style:normal;font-weight:600;font-family:var(--grotesk,system-ui);font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ink,#22301f);margin-right:8px}" +
  ".fg-diag img{max-height:78vh;object-fit:contain;background:none;box-shadow:none}" +
  ".fg-areanav{display:flex;flex-wrap:wrap;gap:6px 8px;margin:0 0 clamp(18px,3vh,30px)}" +
  ".fg-areanav a{font-size:.85rem;font-weight:600;color:var(--green-deep,#3c6b32);border:1px solid var(--line-strong,rgba(34,48,31,.3));border-radius:99px;padding:10px 14px;min-height:44px;display:inline-flex;align-items:center}" +
  ".fg-areanav a:hover{background:var(--green-deep,#3c6b32);color:#fff;border-color:var(--green-deep,#3c6b32)}" +
  ".fg-area{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,290px);gap:clamp(22px,4.5vw,60px);padding:clamp(26px,4.5vh,44px) 0;border-top:1px solid var(--line,rgba(34,48,31,.14));scroll-margin-top:calc(var(--navh,64px) + 70px)}" +
  "@media(max-width:820px){.fg-area{grid-template-columns:1fr}}" +
  ".fg-area h3{font-family:var(--serif,Georgia,serif);font-weight:400;font-size:clamp(1.5rem,2.4vw,1.95rem);line-height:1.15;color:var(--ink,#22301f);margin:0 0 4px}" +
  ".fg-ch .fg-q{font-style:italic;color:var(--ink-faint,#93a08d);margin-bottom:14px}" +
  ".fg-area .fg-best{display:inline-block;font-size:.75rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-deep,#8f6215);margin-bottom:10px}" +
  ".fg-ch .fg-sum{font-weight:600;color:var(--ink,#22301f);font-size:1.1em;line-height:1.5}" +
  ".fg-ch .fg-pit{font-size:max(16px,.92em);border-top:1px dashed var(--line-strong,rgba(34,48,31,.3));padding-top:12px;margin-top:4px}" +
  ".fg-pit b{color:var(--clay-deep,#8f4a2c);font-weight:700;margin-right:6px}" +
  ".fg-ex{margin:0;font-size:max(16px,.9em)}" +
  ".fg-ex img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;border-radius:6px;background:var(--sky-wash,#e3eff3)}" +
  ".fg-ex figcaption{margin-top:10px;line-height:1.55;color:var(--ink-soft,#5c6b57)}" +
  ".fg-ex figcaption b{display:block;font-family:var(--serif,Georgia,serif);font-weight:400;font-size:1.2em;color:var(--ink,#22301f)}" +
  ".fg-ex figcaption .fg-in{display:block;font-size:.75rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--green-deep,#3c6b32);margin-bottom:4px}" +
  ".fg-setup{display:grid;grid-template-columns:150px minmax(0,1fr);gap:8px 28px;padding:18px 0;border-top:1px solid var(--line,rgba(34,48,31,.14))}" +
  ".fg-setup .fg-sl{font-family:var(--serif,Georgia,serif);font-style:italic;font-size:1.15rem;color:var(--gold-deep,#8f6215)}" +
  ".fg-setup p{margin:0 0 8px}" +
  "@media(max-width:640px){.fg-setup{grid-template-columns:1fr}}" +
  ".fg-two{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,64px)}" +
  "@media(max-width:760px){.fg-two{grid-template-columns:1fr}}" +
  ".fg-two h3{font-family:var(--serif,Georgia,serif);font-weight:400;font-size:1.6rem;color:var(--ink,#22301f);margin:0 0 10px}" +
  ".fg-two ul{list-style:none;padding:0;margin:0}" +
  ".fg-two li{position:relative;font-size:max(16px,.95em);padding:10px 0 10px 26px;border-top:1px solid var(--line,rgba(34,48,31,.14));color:var(--ink-soft,#5c6b57);line-height:1.6}" +
  ".fg-two li:before{content:'';position:absolute;left:4px;top:21px;width:9px;height:9px;border-radius:50%;background:var(--green,#5c9e4a)}" +
  ".fg-two .fg-watch li:before{background:var(--clay,#b5613c)}" +
  ".fg-places{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(18px,2.6vw,30px)}" +
  ".fg-places .fg-place:first-child{grid-column:1/-1}" +
  ".fg-places .fg-place:first-child img{aspect-ratio:21/9}" +
  "@media(max-width:820px){.fg-places{grid-template-columns:1fr 1fr}}" +
  "@media(max-width:520px){.fg-places{grid-template-columns:1fr}.fg-places .fg-place:first-child img{aspect-ratio:4/3}}" +
  ".fg-place{display:block;color:inherit}" +
  ".fg-place img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;border-radius:6px;background:var(--sky-wash,#e3eff3);transition:box-shadow .5s}" +
  ".fg-place:hover img{box-shadow:0 22px 44px -26px rgba(34,48,31,.5)}" +
  ".fg-place .fg-pn{font-family:var(--serif,Georgia,serif);font-size:1.25rem;color:var(--ink,#22301f);margin-top:12px;display:block}" +
  ".fg-place .fg-pp{font-size:.75rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-faint,#93a08d)}" +
  ".fg-ch .fg-place p{font-size:max(16px,.9em);line-height:1.55;margin:6px 0 8px}" +
  ".fg-place .fg-go{font-size:.85rem;font-weight:700;color:var(--green-deep,#3c6b32)}" +
  ".fg-all{display:inline-flex;align-items:center;min-height:44px;margin-top:clamp(18px,3vh,28px);font-weight:700;color:var(--green-deep,#3c6b32);border-bottom:2px solid var(--green,#5c9e4a)}" +
  ".fg-ch .sigrow .e{cursor:help}" +
  /* why it sits here: each spectrum line opens to show its reason (MAP_WHY) */
  ".fg-whyhint{font-size:max(16px,.9em);font-style:italic;color:var(--ink-faint,#93a08d);margin:0 0 10px}" +
  ".fg-why summary{list-style:none;cursor:pointer;border-radius:6px;transition:background .3s}" +
  ".fg-why summary::-webkit-details-marker{display:none}" +
  ".fg-why summary:hover,.fg-why summary:focus-visible{background:rgba(232,180,80,.12);outline:none}" +
  ".fg-why summary .sigrow{margin:0;min-height:44px}" +
  ".fg-why[open] summary .e{color:#8f6215}" +
  ".fg-why p{margin:2px 0 12px;padding:10px 14px;max-width:800px;background:rgba(232,180,80,.12);border-left:2px solid #d9a441;border-radius:0 8px 8px 0;font-size:max(16px,.92em);line-height:1.5;color:var(--ink-soft,#4b5a47)}" +
  ".fg-ch .gs-foot{font-size:max(16px,.9em);color:var(--ink-faint,#93a08d)}" +
  ".fg .cmpbtn{min-height:44px;display:inline-flex;align-items:center}" +
  ".fg-end{padding:clamp(28px,5vh,48px) 0 clamp(40px,7vh,72px);border-top:1px solid var(--line,rgba(34,48,31,.14));margin-top:clamp(28px,5vh,48px)}" +
  ".fg-end .gsrc{font-size:max(16px,.82em);color:var(--ink-faint,#93a08d);margin-top:18px;max-width:none}" +
  ".fg-end .gsrc a{border-bottom:1px solid var(--line-strong,rgba(34,48,31,.3))}" +
  ".fg-short .fg-ch{padding-top:clamp(26px,4vh,40px)}" +
  ".fg-short .fg-h h2{font-size:clamp(1.5rem,2.6vw,2rem)}" +
  ".fg-sumlist{margin:0;padding:0;list-style:none}" +
  ".fg-sumlist li{padding:12px 0;border-top:1px solid var(--line,rgba(34,48,31,.14))}" +
  ".fg-sumlist b{display:block;font-family:var(--serif,Georgia,serif);font-weight:400;font-size:1.15rem;color:var(--ink,#22301f)}" +
  ".fg-sumlist span{color:var(--ink-soft,#5c6b57);line-height:1.55}" +
  ".fg-full{display:inline-flex;align-items:center;min-height:48px;padding:0 24px;border-radius:99px;background:var(--green-deep,#3c6b32);color:#fff!important;font-weight:700;margin-top:14px}";
  var st = document.createElement("style"); st.id = "fg-css"; st.textContent = c;
  (document.head || document.documentElement).appendChild(st);
})();

function guideBodyHTML(t, k, opts){
  opts = opts || {};
  var SHORT = !!opts.short;
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function noEdit(s){return String(s||"").replace(/\s*\[edit[^\]]*\]/gi,"");}
  var pills = (typeof tagPillsHTML === "function") ? tagPillsHTML : function(){ return ""; };
  var G = (typeof GUIDE_CONTENT !== "undefined" && GUIDE_CONTENT[t.slug]) || null;
  var projById = {};
  (typeof COLIVING_PROJECTS !== "undefined" ? COLIVING_PROJECTS : []).forEach(function(p){ projById[p.id] = p; });
  function ext(u){ return /^https?:/i.test(u||""); }
  var n = 0, chapters = [];
  function chapter(id, title, inner){
    n++;
    chapters.push({ id: id, n: n, title: title });
    return '<section class="fg-ch" id="fg-'+id+'"><header class="fg-h"><span class="fg-n">'+String(n).padStart(2,"0")+'</span><h2>'+esc(title)+'</h2></header>'+inner+'</section>';
  }
  var cmpHTML = '<a class="cmpbtn" href="map.html?compare='+esc(t.slug)+'#map">Compare it with other ways of living →</a>';
  var setups = t.typicalSetups || [];

  /* 1 At a glance */
  var body = (t.body||[]).map(function(p){ return "<p>"+esc(noEdit(p))+"</p>"; });
  var glance = '<div class="fg-cols"><div class="fg-lead">'+(SHORT ? body.slice(0,1) : body).join("")+'</div>'+
    (setups[0] ? '<aside class="fg-margin"><span class="fg-mk">Most often set up as</span><p>'+esc(setups[0].note)+'</p>'+pills({ setup: setups[0] }, 4)+'</aside>' : "")+
    '</div>';

  /* 2 Where it comes from */
  var origin = '<p>'+esc(noEdit(k.origin||""))+'</p>'+
    (k.teaches ? '<blockquote class="fg-quote">“'+esc(k.teaches)+'”</blockquote><div class="fg-quote-by">What this way of living teaches everyone else</div>' : "");

  /* 3 How it works */
  function areaOf(a){
    var x = G && G.areas && G.areas[a];
    var one = (k.themes||{})[a];
    if (x) return x;
    return one ? { summary: one } : null;
  }
  var areas = GUIDE_AREAS.filter(function(a){ return THEMES[a] && areaOf(a); });
  var diag = k.diagram ? '<figure class="fg-plate fg-diag"><img src="'+esc(k.diagram.src)+'" alt="'+esc(k.diagram.cap||("How a "+t.name+" is laid out"))+'" loading="lazy" onerror="this.parentElement.remove()"><figcaption><b>Plate</b>'+esc(k.diagram.cap||"")+'</figcaption></figure>' : "";
  var howHTML;
  if (SHORT) {
    howHTML = '<ul class="fg-sumlist">'+areas.map(function(a){
      return '<li><b>'+esc(THEMES[a].label)+'</b><span>'+esc(areaOf(a).summary)+'</span></li>';
    }).join("")+'</ul>';
  } else {
    howHTML = diag + (areas.length > 2 ? '<nav class="fg-areanav" aria-label="Areas">'+areas.map(function(a){
      return '<a href="#fg-a-'+a+'">'+esc(THEMES[a].label)+'</a>'; }).join("")+'</nav>' : "") +
      areas.map(function(a){
        var x = areaOf(a), best = (k.best||[]).indexOf(a) >= 0;
        var p = x.example && projById[x.example.id];
        var ex = p ? '<figure class="fg-ex">'+(p.img ? '<img src="'+esc(p.img)+'" alt="'+esc(p.name)+'" loading="lazy" onerror="this.remove()">' : "")+
          '<figcaption><span class="fg-in">In real life</span><b>'+esc(p.name)+'</b>'+esc(x.example.text)+'</figcaption></figure>' : "";
        return '<article class="fg-area" id="fg-a-'+a+'"><div>'+
          '<h3>'+esc(THEMES[a].label)+'</h3><p class="fg-q">'+esc(THEMES[a].q)+'</p>'+
          (best ? '<span class="fg-best">★ Where it shines</span>' : "")+
          '<p class="fg-sum">'+esc(x.summary)+'</p>'+
          (x.body ? '<p>'+esc(x.body)+'</p>' : "")+
          (x.pitfall ? '<p class="fg-pit"><b>Watch for</b>'+esc(x.pitfall)+'</p>' : "")+
          '</div>'+ex+'</article>';
      }).join("");
  }

  /* 4 How it's usually set up */
  var setupHTML = setups.map(function(u, i){
    return '<div class="fg-setup"><span class="fg-sl">'+esc(u.label||(i===0?"Most often":"Also"))+'</span><div><p>'+esc(u.note)+'</p>'+pills({ setup: u })+'</div></div>';
  }).join("") + '<p class="gs-foot" style="margin-top:14px">Usually, not always. The real places below show how differently it can be done.</p>';

  /* 5 Who it's for / Watch out */
  function list(intro, pts, cls){
    return '<div class="'+cls+'">'+(intro ? '<p class="fg-sum">'+esc(intro)+'</p>' : "")+
      ((pts||[]).length ? '<ul>'+pts.map(function(s){ return "<li>"+esc(s)+"</li>"; }).join("")+'</ul>' : "")+'</div>';
  }
  var whoHTML = '<div class="fg-two"><div><h3>Who it’s for</h3>'+list(t.who, G && G.whoPoints, "fg-who")+'</div>'+
    '<div><h3>Watch out</h3>'+list(t.watch, G && G.watchPoints, "fg-watch")+'</div></div>';

  /* 6 Real places: at most 4, photos first, then a link to all of them */
  var allEx = (t.examples||[]).filter(function(p){ return p.kind !== "network"; });
  var withImg = allEx.filter(function(p){ return p.img; });
  var shown = withImg.slice(0, SHORT ? 3 : 4);
  var placesHTML = shown.length ? '<div class="fg-places">'+shown.map(function(p){
      var go = ext(p.url) ? "Visit ↗" : "Read the case study →";
      return '<a class="fg-place" href="'+esc(p.url)+'"'+(ext(p.url)?' target="_blank" rel="noopener"':'')+'>'+
        '<img src="'+esc(p.img)+'" alt="'+esc(p.name)+'" loading="lazy" onerror="this.style.visibility=\'hidden\'">'+
        '<span class="fg-pn">'+esc(p.name)+'</span><span class="fg-pp">'+esc(p.place)+'</span>'+
        '<p>'+esc(p.note)+'</p>'+(SHORT ? "" : pills(p, 3))+'<span class="fg-go">'+go+'</span></a>';
    }).join("")+'</div>' : "";
  var allLink = allEx.length ? '<a class="fg-all" href="projects.html?t='+esc(t.slug)+'#grid">See all '+allEx.length+' real places on Real communities →</a>' : "";

  /* 7 On the map */
  var WHY = (typeof MAP_WHY !== "undefined" && MAP_WHY[t.slug]) || {};
  var sig = Object.keys(MAP_PROPS).map(function(pk){
    var p = MAP_PROPS[pk], r = (t.ranges && t.ranges[pk]) || [t.scores[pk], t.scores[pk]];
    var g = GUIDE_SPECTRUM_GLOSS[pk] ? ' data-gloss="'+GUIDE_SPECTRUM_GLOSS[pk]+'"' : "";
    var why = WHY[pk], tagN = why ? "span" : "div";
    var row = '<'+tagN+' class="sigrow" title="'+esc(p.label)+'"><span class="e"'+g+'>'+esc(p.low)+'</span>'+
      '<span class="track"><span class="rng" style="left:'+r[0]+'%;width:'+Math.max(2, r[1]-r[0])+'%"></span><span class="pin" style="left:'+t.scores[pk]+'%"></span></span>'+
      '<span class="e r"'+g+'>'+esc(p.high)+'</span></'+tagN+'>';
    return why ? '<details class="fg-why"><summary>'+row+'</summary><p>'+esc(why)+'</p></details>' : row;
  }).join("");
  if (Object.keys(WHY).length) sig = '<p class="fg-whyhint">Tap a line to see why it sits there.</p>' + sig;

  var srcList = (typeof SOURCES !== "undefined" ? SOURCES : []).filter(function(s){ return s.checked && (t.sources||[]).indexOf(s.id) >= 0; });
  var srcHTML = srcList.length ? '<p class="gsrc">Sources: '+srcList.map(function(s){
    return s.url ? '<a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.author && s.author!==s.title ? s.title+" ("+s.author+")" : s.title)+'</a>' : esc(s.title);
  }).join(" · ")+'</p>' : "";

  var out;
  if (SHORT) {
    out = chapter("glance", "At a glance", glance) +
      chapter("how", "How it works", howHTML) +
      (placesHTML ? chapter("places", "Real places", placesHTML + allLink) : "") +
      chapter("map", "On the map", '<div class="sig">'+sig+'</div>') +
      '<div class="fg-end"><a class="fg-full" href="type.html?t='+esc(t.slug)+'">Read the full guide →</a></div>';
    return '<div class="fg fg-short">'+out+'</div>';
  }
  out = chapter("glance", "At a glance", glance + cmpHTML) +
    chapter("origin", "Where it comes from", origin) +
    chapter("how", "How it works", howHTML) +
    chapter("map", "On the map", '<div class="sig">'+sig+'</div>'+cmpHTML) +
    (setups.length ? chapter("setup", "How it’s usually set up", setupHTML) : "") +
    chapter("who", "Who it’s for, and what to watch", whoHTML) +
    (allEx.length ? chapter("places", "Real places", (placesHTML || "") + allLink) : "") +
    (srcHTML ? '<div class="fg-end">'+srcHTML+'</div>' : "");
  var index = '<nav class="fg-index" aria-label="Chapters"><button type="button" class="fg-idx-btn" aria-expanded="false">Chapters</button><div class="fg-idx-list">'+chapters.map(function(c){
    return '<a href="#fg-'+c.id+'"><i>'+String(c.n).padStart(2,"0")+'</i>'+esc(c.title.replace(/, and what to watch$/,"").replace(/^How it’s usually set up$/,"How it’s set up"))+'</a>';
  }).join("")+'</div></nav>';
  return '<div class="fg fg-full-wrap">'+index+'<div class="fg-main">'+out+'</div></div>';
}

/* highlight the chapter being read in the sticky index */
function guideEnhance(root){
  root = root || document;
  var links = root.querySelectorAll(".fg-index a");
  if (!links.length || !("IntersectionObserver" in window)) return;
  var map = {};
  links.forEach(function(a){ map[a.getAttribute("href").slice(1)] = a; });
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (!e.isIntersecting) return;
      links.forEach(function(a){ a.classList.remove("on"); });
      var a = map[e.target.id];
      if (a) a.classList.add("on");
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  root.querySelectorAll(".fg-ch").forEach(function(s){ io.observe(s); });
  var nav = root.querySelector(".fg-index"), btn = nav && nav.querySelector(".fg-idx-btn");
  if (btn) {
    btn.addEventListener("click", function(){ var o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
    links.forEach(function(a){ a.addEventListener("click", function(){ nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }); });
  }
}
