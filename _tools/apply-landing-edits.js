/* Bakes the JSON from landing-v3.html?edit ("Copy the JSON") into the file,
   so P-A's dragged anchors, moved bubbles, retyped words, added and deleted
   spots become the real defaults instead of living in his browser.

   Usage:  node _tools/apply-landing-edits.js edits.json
           node _tools/apply-landing-edits.js edits.json --dry

   Same safety model as apply-landing-copy.js: it edits only what it can
   locate unambiguously, refuses to guess, backs the file up first, and
   prints exactly what it did and what it could not do.

   Shape of the JSON (written by the panel):
     { spaces: { <key>: {anchor?, label?, name?, desc?} },
       spots:  { "<scene>::<name>": {anchor?, label?, line?, href?} },
       added:  [ {scene,name,href,cat,line,anchor,label} ],
       removed:[ "<scene>::<name>" ] }                                   */
const fs = require("fs"), path = require("path");

const ROOT = path.join(__dirname, "..");
const PAGE = path.join(ROOT, "landing-v3.html");
const DRY = process.argv.indexOf("--dry") > -1;
const src = process.argv[2];
if (!src || src.startsWith("--")) { console.error("usage: node _tools/apply-landing-edits.js <edits.json> [--dry]"); process.exit(1); }

const edits = JSON.parse(fs.readFileSync(src, "utf8"));
let html = fs.readFileSync(PAGE, "utf8");
const done = [], todo = [];

const num = n => (Math.round(n * 10000) / 10000).toString();
const pair = a => "[" + num(a[0]) + "," + num(a[1]) + "]";
const esc = s => String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");

/* Finds the object literal for one entry and rewrites a field inside it.
   `head` is a string that appears exactly once and starts that literal
   (e.g. "key:'garden'" or "name:'The murals'"); we then operate on the
   slice from there to the end of that entry. */
function patch(head, field, value, label) {
  const at = html.indexOf(head);
  if (at < 0) { todo.push([label, "could not find " + head + " in the file"]); return; }
  if (html.indexOf(head, at + 1) > -1) { todo.push([label, head + " appears more than once"]); return; }
  /* the entry ends at the next "polys:" block's closing "] }," or the next entry */
  const end = html.indexOf("\n\n", at) > -1 ? html.indexOf("\n\n", at) : at + 2000;
  const seg = html.slice(at, end);
  const re = new RegExp("(" + field + "\\s*:\\s*)(\\[[^\\]]*\\]|'(?:[^'\\\\]|\\\\.)*')");
  if (!re.test(seg)) { todo.push([label, "no " + field + ": in that entry — add it by hand"]); return; }
  const next = seg.replace(re, "$1" + value.replace(/\$/g, "$$$$"));
  html = html.slice(0, at) + next + html.slice(end);
  done.push(label);
}

/* --- the six spaces on the map --- */
Object.keys(edits.spaces || {}).forEach(key => {
  const o = edits.spaces[key], head = "key:'" + key + "'";
  if (o.anchor) patch(head, "anchor", pair(o.anchor), key + " → anchor " + pair(o.anchor));
  if (o.label)  patch(head, "label",  pair(o.label),  key + " → label " + pair(o.label));
  if (o.name)   patch(head, "name",   "'" + esc(o.name) + "'", key + " → name");
  if (o.desc)   patch(head, "desc",   "'" + esc(o.desc) + "'", key + " → sentence");
});

/* --- the in-scene hotspots --- */
Object.keys(edits.spots || {}).forEach(k => {
  const o = edits.spots[k], name = k.split("::")[1], head = "name:'" + esc(name) + "'";
  if (o.anchor) patch(head, "anchor", pair(o.anchor), k + " → anchor " + pair(o.anchor));
  if (o.label)  patch(head, "label",  pair(o.label),  k + " → label " + pair(o.label));
  if (o.line)   patch(head, "line",   "'" + esc(o.line) + "'", k + " → sentence");
  if (o.href)   patch(head, "href",   "'" + esc(o.href) + "'", k + " → link");
});

/* --- added and removed spots need a shape decision (the traced region), so
       they are REPORTED rather than guessed: a spot with a square placeholder
       region would look wrong next to hand-traced ones. --- */
(edits.added || []).forEach(a => todo.push([
  a.scene + "::" + a.name,
  "NEW spot — add it to SCENE_SPOTS by hand and trace its polys:\n" +
  "        { name:'" + esc(a.name) + "', href:'" + esc(a.href) + "', cat:'" + a.cat + "',\n" +
  "          line:'" + esc(a.line) + "',\n" +
  "          anchor:" + pair(a.anchor) + ", label:" + pair(a.label) + ",\n" +
  "          polys:[[ … trace the drawn feature … ]] },"
]));
(edits.removed || []).forEach(k => todo.push([k, "DELETED — remove this entry from SCENE_SPOTS by hand"]));

if (done.length && !DRY) {
  fs.writeFileSync(PAGE + ".bak", fs.readFileSync(PAGE));
  fs.writeFileSync(PAGE, html, "utf8");
}

console.log("\n" + (DRY ? "DRY RUN — nothing written" : done.length ? "applied to landing-v3.html (backup: landing-v3.html.bak)" : "nothing applied"));
console.log("  " + done.length + " baked in, " + todo.length + " need a hand\n");
done.forEach(d => console.log("  OK   " + d));
if (todo.length) { console.log("\nBY HAND:"); todo.forEach(t => console.log("  " + t[0] + "\n      " + t[1])); }
console.log("\nThen tell P-A to click \"Reset everything\" in ?edit — his browser copy is now stale.");
