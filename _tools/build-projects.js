// builds projects-data.js from the old nested examples + a tag table. Run: node build-projects.js <projects.json> <extra.json|-> <out>
const fs=require('fs');
const [,,src,extraPath,out]=process.argv;
const P=JSON.parse(fs.readFileSync(src,'utf8'));
// index -> overrides. s=setting w=forWho b=building h=hosts L=legal M=money H=holding D=decisions t=type k=kind
const T={
 0:{s:'countryside',L:'nonprofit'},1:{s:'countryside',L:'nonprofit',M:'public',H:'use-rights'},2:{s:'countryside'},3:{s:'countryside'},4:{k:'network'},
 5:{s:'suburb'},6:{s:'city',b:'new',L:'coop',H:'shares'},7:{s:'city',b:'new',L:'condo',M:'members',H:'own'},
 8:{t:'cohousing',s:'city',b:'new',h:'mixed-use',L:'coop',H:'shares'},9:{t:'cohousing',s:'city',b:'new',h:'mixed-use',L:'coop',H:'shares'},
 10:{t:null,k:'network',L:'coop'},
 11:{t:null,s:'city',w:['seniors','students','intergenerational'],L:'nonprofit'},12:{t:null,s:'city',w:['intergenerational','families','seniors'],L:'nonprofit'},
 13:{t:null,k:'network',w:['intergenerational']},14:{t:null,s:'suburb',w:['care','seniors']},15:{t:null,w:['intergenerational','seniors','families']},
 16:{k:'network'},17:{s:'countryside'},18:{s:'countryside'},19:{s:'countryside',h:'farm'},
 20:{s:'city',b:'new'},21:{s:'city',b:'new',h:'mixed-use',L:'coop'},
 22:{s:'suburb',w:['entrepreneurs']},23:{s:'city',w:['entrepreneurs'],L:'company'},
 24:{s:'city',L:'company',M:'investors',H:'rent'},25:{s:'city',L:'company',M:'investors',H:'rent'},26:{s:'city',L:'company',M:'investors',H:'rent'},
 27:{s:'city',w:['entrepreneurs'],H:'rent'},28:{s:'city',H:'rent'},29:{s:'city',w:['entrepreneurs']},
 30:{s:'countryside',w:['remote-workers']},31:{s:'countryside',w:['remote-workers'],b:'converted'},32:{s:'countryside',w:['remote-workers'],b:'converted'},
 33:{},34:{},35:{s:'city',b:'new',L:'company',M:'investors',H:'rent'},36:{L:'company',M:'investors',H:'membership',D:'founder'},
 37:{s:'city',w:['students'],L:'nonprofit',H:'rent',D:'vote'},38:{k:'network',w:['students']},39:{s:'city',w:['students'],L:'coop'},
 40:{t:'operator-coliving',s:'city',w:['students'],H:'rent'}
};
const arr=v=>v==null?undefined:(Array.isArray(v)?v:[v]);
function clean(o){Object.keys(o).forEach(k=>{if(o[k]===undefined||(typeof o[k]==='object'&&o[k]&&!Array.isArray(o[k])&&!Object.keys(clean(o[k])).length))delete o[k];});return o;}
const slugify=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\(.*?\)/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
let list=P.map((p,i)=>{const o=T[i]||{};return clean({id:slugify(p.name),name:p.name,place:p.place,
 type:('t' in o)?o.t:p.type,kind:o.k||'place',img:p.img,url:p.url,note:p.note,
 tags:{setting:arr(o.s),forWho:arr(o.w),building:arr(o.b),hosts:arr(o.h)},
 setup:{legal:arr(o.L),money:arr(o.M),holding:arr(o.H),decisions:arr(o.D)}});});
if(extraPath&&extraPath!=='-')list=list.concat(JSON.parse(fs.readFileSync(extraPath,'utf8')));
const head=`/* =====================================================================
   REAL PROJECTS — facts, kept apart from the editorial type ranges in
   map-data.js. type = a COLIVING_TYPES slug, or null when the place is
   defined by who it's for (e.g. intergenerational) rather than a way of
   living. kind "network" = a federation or directory, not a place.
   setup / tags use the keys in TAG_VOCAB (map-data.js). Leave a field out
   rather than guess. Built by _tools/build-projects.js, then hand-edited.
   ===================================================================== */
`;
const body='const COLIVING_PROJECTS = '+JSON.stringify(list,null,2)+';\n\n'+
`/* rebuild each type's examples (field guides, map pop-up, projects page) */
COLIVING_TYPES.forEach(function (t) {
  t.examples = COLIVING_PROJECTS.filter(function (p) { return p.type === t.slug; });
});
`+"\n/* pills for a project or a typical set-up: gold = set-up, sky = who it's for,\n   terracotta = setting/building. obj = { setup:{...}, tags:{...} }; max = cap. */\nfunction tagPillsHTML(obj, max) {\n  if (typeof TAG_VOCAB === \"undefined\" || !obj) return \"\";\n  var out = [];\n  [[\"tags\", \"forWho\"], [\"setup\", \"legal\"], [\"setup\", \"holding\"], [\"setup\", \"money\"], [\"setup\", \"decisions\"],\n   [\"tags\", \"setting\"], [\"tags\", \"building\"], [\"tags\", \"hosts\"]].forEach(function (g) {\n    var vals = (obj[g[0]] || {})[g[1]] || [], v = TAG_VOCAB[g[1]];\n    vals.forEach(function (k) { if (v && v.values[k]) out.push('<span class=\"pill ' + v.layer + '\" title=\"' + v.label + '\">' + v.values[k] + \"</span>\"); });\n  });\n  if (max && out.length > max) out = out.slice(0, max);\n  return out.length ? '<span class=\"pills\">' + out.join(\"\") + \"</span>\" : \"\";\n}\n";
fs.writeFileSync(out,head+body);
console.log('projects',list.length,'typed',list.filter(p=>p.type).length,'untyped',list.filter(p=>!p.type).length);
