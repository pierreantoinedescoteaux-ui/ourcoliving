/* Pulls the site's LONG-FORM writing out of the data files into one folder of
   markdown, one file per piece — P-A's call: "each long form is an md file in
   a master folder", and the short copy lives in the Google Sheet instead.

   In scope: case studies, field guides, articles.
   Out of scope (short copy -> the Sheet): manifesto bubbles, headings, labels,
   card blurbs, buttons.

   Every file carries frontmatter with the EXACT data path each block came
   from, so _tools/apply-longform.js can put it back without guessing.

   Run: node _tools/extract-longform.js            (writes content/)
        node _tools/extract-longform.js --check    (report only) */
const fs = require("fs"), path = require("path");
const { load, ROOT } = require("./lib-site-data");

const OUT = path.join(ROOT, "content");
const CHECK = process.argv.indexOf("--check") > -1;
const { data } = load();

const slugify = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const clean = s => String(s == null ? "" : s).replace(/\s*\[edit\]\s*/g, " ").replace(/[ \t]+/g, " ").trim();
const para = v => (Array.isArray(v) ? v : [v]).map(clean).filter(Boolean).join("\n\n");

function write(rel, body) {
  const p = path.join(OUT, rel);
  if (CHECK) { console.log("would write", rel, "(" + body.length + " chars)"); return; }
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, body, "utf8");
  console.log("wrote", rel, "(" + body.length + " chars)");
}
const fm = o => "---\n" + Object.entries(o).map(([k, v]) =>
  k + ": " + (typeof v === "string" ? JSON.stringify(v) : v)).join("\n") + "\n---\n\n";

/* ---------- case studies ---------- */
const CASE_SECTIONS = [
  ["open", "Where it starts"],
  ["challenge", "The challenge"],
  ["moves", "What I did"],
  ["outcome", "What came of it"],
  ["changed", "What it changed in me"]
];
function caseStudy(c, source, index) {
  const out = [];
  out.push(fm({
    title: clean(c.name), slug: c.slug, kind: "case-study",
    source: source, path: source.replace(".js", "") + "[" + index + "]",
    role: clean(c.role || ""), kicker: clean(c.kicker || "")
  }));
  out.push("# " + clean(c.name) + "\n");
  if (c.summary) out.push("> " + clean(c.summary) + "\n");
  if (c.pull) out.push("**Pull quote —** " + clean(c.pull) + "\n");
  const st = c.story || {};
  for (const [key, heading] of CASE_SECTIONS) {
    const sec = st[key];
    out.push("## " + heading + "   <!-- story." + key + " -->\n");
    if (!sec) { out.push("_(not written yet)_\n"); continue; }
    /* "moves" is a bare ARRAY of moves; every other section is an object */
    const moves = Array.isArray(sec) ? sec : (sec.moves || []);
    if (!Array.isArray(sec)) {
      if (sec.title) out.push("**" + clean(sec.title) + "**\n");
      if (sec.body) out.push(para(sec.body) + "\n");
      if (sec.prompt) out.push("_P-A writes — " + clean(sec.prompt) + "_\n");
    }
    moves.forEach((m, i) => {
      out.push("### " + clean(m.heading || m.title || "Move " + (i + 1)) +
        "   <!-- story." + key + "[" + i + "] -->\n");
      if (m.body) out.push(para(m.body) + "\n");
      if (m.method) out.push("_Method — " + clean(m.method.term || m.method) +
        (m.method.note ? ": " + clean(m.method.note) : "") + "_\n");
      (m.images || []).forEach(im => { if (im.caption) out.push("_Photo caption — " + clean(im.caption) + "_\n"); });
      if (m.prompt) out.push("_P-A writes — " + clean(m.prompt) + "_\n");
    });
    const kpis = (!Array.isArray(sec) && (sec.kpis || sec.stats)) || [];
    kpis.forEach((k, i) => out.push("- **" + clean(k.value || k.k || k.num || "") + "** " +
      clean(k.label || k.v || k.note || "") + "   <!-- story." + key + ".kpis[" + i + "] -->\n"));
  }
  return out.join("\n");
}

/* ---------- field guides ---------- */
function fieldGuide(t, index) {
  const out = [];
  out.push(fm({
    title: clean(t.name), slug: t.slug, kind: "field-guide",
    source: "map-data.js", path: "COLIVING_TYPES[" + index + "]",
    tagline: clean(t.tagline || "")
  }));
  out.push("# " + clean(t.name) + "\n");
  if (t.short) out.push("> " + clean(t.short) + "\n");
  if (t.tagline) out.push("_" + clean(t.tagline) + "_\n");
  if (t.body) { out.push("## What it is   <!-- body -->\n"); out.push(para(t.body) + "\n"); }
  if (t.who) { out.push("## Who it suits   <!-- who -->\n"); out.push(para(t.who) + "\n"); }
  if (t.watch) { out.push("## What to watch for   <!-- watch -->\n"); out.push(para(t.watch) + "\n"); }
  if (t.examples && t.examples.length) {
    out.push("## Real examples   <!-- examples -->\n");
    t.examples.forEach((e, i) => {
      out.push("### " + clean(e.name) + "   <!-- examples[" + i + "] -->\n");
      out.push(para(e.note || e.body || e.what || "") + "\n");
    });
  }
  return out.join("\n");
}

/* ---------- articles ---------- */
function article(p, index) {
  const out = [];
  out.push(fm({
    title: clean(p.title), slug: p.slug, kind: "article",
    source: "talkpieces-data.js", path: "TALKPIECES.pieces[" + index + "]",
    status: p.status || "", page: p.href || "", kicker: clean(p.kicker || "")
  }));
  out.push("# " + clean(p.title) + "\n");
  if (p.dek) out.push("> " + clean(p.dek) + "\n");
  if (p.meta) out.push("_" + clean(p.meta) + "_\n");
  out.push("<!-- The card above lives in talkpieces-data.js. The piece ITSELF is a\n" +
    "     page (" + (p.href || "not written yet") + ") — paste its body below and\n" +
    "     apply-longform.js will write it back into that page. -->\n");
  return out.join("\n");
}

/* ---------- run ---------- */
let n = 0;
(data.WORK_CASES || []).forEach((c, i) => { write("case-studies/" + c.slug + ".md", caseStudy(c, "work-data.js", i)); n++; });
(data.WORK_CASE_SCAFFOLDS || []).forEach((c, i) => { write("case-studies/" + c.slug + ".md", caseStudy(c, "work-data.js (scaffold)", i)); n++; });
(data.COLIVING_TYPES || []).forEach((t, i) => { write("field-guides/" + t.slug + ".md", fieldGuide(t, i)); n++; });
((data.TALKPIECES || {}).pieces || []).forEach((p, i) => { write("articles/" + p.slug + ".md", article(p, i)); n++; });
console.log("\n" + n + " long-form pieces" + (CHECK ? " would be written" : " written to content/"));
