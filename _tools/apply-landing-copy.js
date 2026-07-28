/* Applies P-A's edited LANDING-COPY.csv back into index.html.
   Safety model, learned from the pen-tool data-loss incident (commit fe726bc):
   nothing is guessed and nothing is silently skipped.
     1. re-dumps the CURRENT copy from the live page (the same extractor the
        CSV was written by), so we know exactly what each row used to say
     2. only rows that actually CHANGED are touched
     3. a change is applied only if its old text appears EXACTLY ONCE in the
        file — anything ambiguous or missing is reported, never guessed
     4. writes a .bak first, and prints a per-row report at the end
   Run: node _tools/dump-landing-copy.js   (refresh the baseline first)
        node _tools/apply-landing-copy.js  (server on :8123)
        node _tools/apply-landing-copy.js --dry   (report only) */
const fs = require("fs"), path = require("path"), cp = require("child_process");

const ROOT = path.join(__dirname, "..");
const CSV = path.join(ROOT, "LANDING-COPY.csv");
const PAGE = path.join(ROOT, "index.html");
const DRY = process.argv.indexOf("--dry") > -1;

/* --- a small RFC4180 reader (quotes, embedded commas and newlines) --- */
function parseCSV(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows = []; let row = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n") { row.push(f); f = ""; if (row.length > 1 || row[0] !== "") rows.push(row); row = []; }
    else if (c !== "\r") f += c;
  }
  if (f !== "" || row.length) { row.push(f); rows.push(row); }
  return rows;
}
const norm = s => String(s == null ? "" : s).replace(/\s+/g, " ").trim();

/* --- baseline: what the page says RIGHT NOW --- */
const tmp = path.join(ROOT, "_tools", ".copy-baseline.csv");
fs.copyFileSync(CSV, tmp);                       /* P-A's edited file, parked */
try {
  cp.execFileSync(process.execPath, [path.join(__dirname, "dump-landing-copy.js")], { stdio: "inherit" });
} catch (e) {
  console.error("could not re-dump the baseline — is the server running on :8123?");
  fs.copyFileSync(tmp, CSV); fs.unlinkSync(tmp); process.exit(1);
}
const baseRows = parseCSV(fs.readFileSync(CSV, "utf8")).slice(1);
fs.copyFileSync(tmp, CSV); fs.unlinkSync(tmp);   /* P-A's file back in place */
const editRows = parseCSV(fs.readFileSync(CSV, "utf8")).slice(1);

const key = r => norm(r[0]) + " │ " + norm(r[1]);
const base = new Map(); baseRows.forEach(r => { if (!base.has(key(r))) base.set(key(r), norm(r[2])); });

let html = fs.readFileSync(PAGE, "utf8");
const applied = [], skipped = [], unchanged = [];

editRows.forEach(r => {
  const k = key(r), now = base.get(k), want = norm(r[2]);
  if (now === undefined) { skipped.push([k, "no such row on the page any more"]); return; }
  if (now === want) { unchanged.push(k); return; }
  if (!now) { skipped.push([k, "the old text was empty — apply this one by hand"]); return; }
  /* the page stores curly quotes as escapes in places; match the literal text */
  const hits = html.split(now).length - 1;
  if (hits === 0) { skipped.push([k, "old text not found verbatim in the file"]); return; }
  if (hits > 1) { skipped.push([k, "old text appears " + hits + " times — too ambiguous to touch"]); return; }
  html = html.replace(now, want);
  applied.push([k, now, want]);
});

if (applied.length && !DRY) {
  fs.writeFileSync(PAGE + ".bak", fs.readFileSync(PAGE));
  fs.writeFileSync(PAGE, html, "utf8");
}

console.log("\n" + (DRY ? "DRY RUN — nothing written" : applied.length ? "applied to index.html (backup: index.html.bak)" : "nothing to apply"));
console.log("  " + applied.length + " changed, " + unchanged.length + " unchanged, " + skipped.length + " need a hand\n");
applied.forEach(a => console.log("  CHANGED  " + a[0] + "\n      was: " + a[1] + "\n      now: " + a[2]));
if (skipped.length) {
  console.log("\nNOT APPLIED — do these by hand:");
  skipped.forEach(s => console.log("  " + s[0] + "  — " + s[1]));
}
console.log("\nRe-run node _tools/dump-landing-copy.js afterwards to refresh the sheet.");
