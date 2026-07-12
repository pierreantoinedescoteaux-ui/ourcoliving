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

function guideBodyHTML(t, k){
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function noEdit(s){return String(s||"").replace(/\s*\[edit[^\]]*\]/gi,"");}

  var themeCards = Object.keys(THEMES).map(function(key){
    var best = (k.best||[]).indexOf(key) >= 0;
    return '<div class="tcard'+(best?" best":"")+'">'+(best?'<span class="badge">★ Does this best</span>':"")+
      '<h3>'+esc(THEMES[key].label)+'</h3><div class="q">'+esc(THEMES[key].q)+'</div>'+
      '<p>'+esc((k.themes||{})[key]||"—")+'</p></div>';
  }).join("");

  var sig = Object.keys(MAP_PROPS).map(function(pk){
    var p = MAP_PROPS[pk];
    return '<div class="sigrow"><span class="e">'+esc(p.low)+'</span>'+
      '<span class="track"><span class="pin" style="left:'+t.scores[pk]+'%"></span></span>'+
      '<span class="e r">'+esc(p.high)+'</span></div>';
  }).join("");

  function exExt(ex){ return /^https?:/i.test(ex.url); }
  function exGo(ex){ return exExt(ex) ? "Visit" : "Read the case study"; }

  // Split the examples: the first one with a photo becomes the big "in action"
  // feature (placed right after the themes); the rest fill the grid below.
  var allEx = (t.examples||[]);
  var featIdx = -1;
  for (var _i=0; _i<allEx.length; _i++){ if(allEx[_i].img){ featIdx=_i; break; } }
  var feat = featIdx>=0 ? allEx[featIdx] : null;
  var rest = allEx.filter(function(ex,i){ return i!==featIdx; });

  var featuredHTML = feat ? (
    '<div class="feat"><div class="k">See it in action</div>'+
    '<a class="featcard" href="'+esc(feat.url)+'"'+(exExt(feat)?' target="_blank" rel="noopener"':'')+'>'+
      '<div class="featimg"><img src="'+esc(feat.img)+'" alt="'+esc(feat.name)+'" loading="lazy" onerror="this.closest(\'.featimg\').remove()"></div>'+
      '<div class="featcap">'+
        '<div class="featmeta"><span class="fn">'+esc(feat.name)+'</span><span class="fpl">'+esc(feat.place)+'</span></div>'+
        '<p class="fnote">'+esc(feat.note)+'</p>'+
        '<span class="fgo">'+exGo(feat)+' →</span>'+
      '</div>'+
    '</a></div>'
  ) : "";

  var restHTML = rest.map(function(ex){
    var ext = exExt(ex);
    return '<a class="ex" href="'+esc(ex.url)+'"'+(ext?' target="_blank" rel="noopener"':'')+'>'+
      (ex.img?'<span class="exphoto"><img src="'+esc(ex.img)+'" alt="" loading="lazy" onerror="this.parentElement.remove()"></span>':"")+
      '<span class="exmain"><span class="t"><span class="n">'+esc(ex.name)+'</span><span class="pl">'+esc(ex.place)+'</span></span>'+
      '<p class="note">'+esc(ex.note)+'</p><span class="go">'+(ext?"Visit":"Read the case study")+' →</span></span></a>';
  }).join("");

  var examplesHTML = rest.length ? (
    '<div class="exs"><div class="k">'+(feat?"Other examples":("Go see it — "+allEx.length+" examples"))+'</div>'+
    '<div class="exgrid">'+restHTML+'</div></div>'
  ) : "";

  var diagram = k.diagram
    ? '<figure class="diag"><img src="'+esc(k.diagram.src)+'" alt="'+esc(k.diagram.cap||("How a "+t.name+" is laid out"))+'" loading="lazy" onerror="this.parentElement.remove()">'+
      (k.diagram.cap?'<figcaption>'+esc(k.diagram.cap)+'</figcaption>':"")+'</figure>'
    : '<div class="diag placeholder">'+typeIcon(t.slug,"tsym big")+
      '<p class="ph-t">The anatomy of '+esc(t.name.toLowerCase().indexOf("the ")===0?t.name:"a "+t.name.toLowerCase())+'</p>'+
      '<p class="ph-s">A visual layout of how this model organizes space — illustration in progress.</p></div>';

  return (
    '<div class="grid2">'+
      '<div class="body"><div class="k">The model</div>'+ (t.body||[]).map(function(p){return "<p>"+esc(noEdit(p))+"</p>";}).join("") +'</div>'+
      '<div class="origin"><div class="k">Where it comes from</div><p>'+esc(noEdit(k.origin||""))+'</p></div>'+
    '</div>'+
    diagram+
    '<div class="teaches"><blockquote>“<em>'+esc(k.teaches||"")+'</em>”</blockquote><div class="who">What this model teaches the rest of the map</div></div>'+
    '<div class="themes"><div class="k">How key areas work</div><div class="tgrid">'+themeCards+'</div></div>'+
    featuredHTML+
    '<div class="fnotes">'+
      '<div class="fnote"><div class="fk">Who it’s for</div><p>'+esc(t.who)+'</p></div>'+
      '<div class="fnote"><div class="fk">Watch out</div><p>'+esc(t.watch)+'</p></div>'+
    '</div>'+
    '<div class="sig"><div class="k">Where it sits on every axis</div>'+sig+'</div>'+
    examplesHTML
  );
}
