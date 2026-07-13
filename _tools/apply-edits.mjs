#!/usr/bin/env node
/* =====================================================================
   APPLY-EDITS — ports edit-mode JSON exports back into the source files.
   Deterministic text replacement; no AI involved.

   Usage:
     node _tools/apply-edits.mjs <edits-file.json> [more.json ...]
     node _tools/apply-edits.mjs --latest      (newest edits-*.json in Downloads)
     node _tools/apply-edits.mjs --all         (every edits-*.json in Downloads)
   Add --dry to preview without writing.

   Matching rules:
   - whitespace-insensitive (rendered text collapses whitespace)
   - a trailing [edit ...] marker in the source counts as matched and is
     REMOVED on replace (the edit means P-A's voice arrived)
   - searches *-data.js, data.js, then *.html (page whose name is in the
     export gets searched first)
   - each change must match exactly ONE spot; 0 or 2+ matches -> reported
     for manual handling, never guessed.
   ===================================================================== */
import { readFileSync, writeFileSync, readdirSync, statSync, renameSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const args = process.argv.slice(2).filter(a => !a.startsWith("--"));

function downloadsDir() { return join(os.homedir(), "Downloads"); }
function findDownloads(all) {
  const dir = downloadsDir();
  const files = readdirSync(dir).filter(f => /^edits-.*\.json$/.test(f))
    .map(f => ({ f: join(dir, f), t: statSync(join(dir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  if (!files.length) { console.error("No edits-*.json found in " + dir); process.exit(1); }
  return all ? files.map(x => x.f) : [files[0].f];
}

let inputs = args;
if (process.argv.includes("--latest")) inputs = findDownloads(false);
if (process.argv.includes("--all")) inputs = findDownloads(true);
if (!inputs.length) { console.error("Give me an edits JSON file, or --latest / --all."); process.exit(1); }

/* candidate source files, ordered: data files first (copy lives there) */
const dataFiles = readdirSync(ROOT).filter(f => /-data\.js$/.test(f) || f === "data.js");
const htmlFiles = readdirSync(ROOT).filter(f => /\.html?$/.test(f) && !f.startsWith("index-v2"));

/* build a whitespace-tolerant regex from rendered text; also tolerate
   entity/JS-escape variants of a few special chars */
function esc(ch) { return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
const VARIANTS = {
  "—": "(?:—|&mdash;)", "–": "(?:–|&ndash;)",
  "’": "(?:’|&rsquo;|\\\\')", "‘": "(?:‘|&lsquo;)",
  "“": "(?:“|&ldquo;)", "”": "(?:”|&rdquo;)",
  "…": "(?:…|&hellip;)", "→": "(?:→|&rarr;)", "←": "(?:←|&larr;)",
  "&": "(?:&|&amp;)", "<": "(?:<|&lt;)", ">": "(?:>|&gt;)",
  '"': '(?:"|&quot;|\\\\")', "·": "(?:·|&middot;)", "©": "(?:©|&copy;)"
};
function toPattern(text) {
  const parts = [];
  for (const ch of text.trim()) {
    if (/\s/.test(ch)) { if (parts[parts.length - 1] !== "\\s+") parts.push("\\s+"); }
    else parts.push(VARIANTS[ch] || esc(ch));
  }
  // optional trailing [edit ...] marker (with optional leading space)
  return new RegExp(parts.join("") + "(\\s*\\[edit[^\\]]*\\])?", "g");
}

/* escape edited text to fit a JS double-quoted string if needed */
function fitContext(file, matchStart, content, edited) {
  if (/\.js$/.test(file)) {
    // crude but safe: if the char run before the match up to the last quote is a double-quote string, escape "
    return edited.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n+/g, " ");
  }
  return edited.replace(/\r?\n+/g, " ");
}

const summary = { applied: [], manual: [] };

for (const input of inputs) {
  const payload = JSON.parse(readFileSync(input, "utf8"));
  const page = payload.page || "";
  const order = [...dataFiles, ...[page, ...htmlFiles.filter(f => f !== page)].filter(f => htmlFiles.includes(f) || f === page)];
  const searchList = [...new Set(order)].filter(f => { try { statSync(join(ROOT, f)); return true; } catch { return false; } });

  for (const ch of payload.changes || []) {
    if (!ch.original || !ch.original.trim()) continue;
    /* pages sometimes wrap data strings in decorative chrome (curly quotes,
       ellipses, arrows) that isn't part of the source string — try the raw
       capture first, then a version with that chrome stripped off the ends */
    const CHROME = /^[\s“”"'«»‘’…·→←—–-]+|[\s“”"'«»‘’…·→←—–-]+$/g;
    const variants = [{ orig: ch.original, edit: ch.edited }];
    const strippedO = ch.original.replace(CHROME, ""), strippedE = ch.edited.replace(CHROME, "");
    if (strippedO !== ch.original.trim()) variants.push({ orig: strippedO, edit: strippedE });

    let hits = [], used = variants[0];
    for (const v of variants) {
      const rx = toPattern(v.orig);
      hits = [];
      for (const f of searchList) {
        const content = readFileSync(join(ROOT, f), "utf8");
        let m; rx.lastIndex = 0;
        while ((m = rx.exec(content)) !== null) {
          hits.push({ f, index: m.index, len: m[0].length });
          if (hits.length > 2) break;
        }
        if (hits.length) break; // first file with hits wins (data files first)
      }
      if (hits.length) { used = v; break; }
    }
    const eff = { original: used.orig, edited: used.edit };
    const label = eff.original.slice(0, 60).replace(/\s+/g, " ") + (eff.original.length > 60 ? "…" : "");
    if (hits.length === 1) {
      const { f, index, len } = hits[0];
      const content = readFileSync(join(ROOT, f), "utf8");
      const replacement = fitContext(f, index, content, eff.edited.trim());
      if (!DRY) writeFileSync(join(ROOT, f), content.slice(0, index) + replacement + content.slice(index + len), "utf8");
      summary.applied.push({ file: f, was: label });
    } else {
      summary.manual.push({ reason: hits.length === 0 ? "not found" : "ambiguous (multiple matches)", was: label, edited: eff.edited.slice(0, 80) });
    }
  }
  // archive the processed export so --all never reapplies it
  if (!DRY && input.startsWith(downloadsDir())) {
    try { renameSync(input, input.replace(/\.json$/, ".applied.json")); } catch {}
  }
}

console.log((DRY ? "[DRY RUN] " : "") + "Applied: " + summary.applied.length);
for (const a of summary.applied) console.log("  ✓ " + a.file + " — " + a.was);
if (summary.manual.length) {
  console.log("Needs manual handling: " + summary.manual.length);
  for (const m of summary.manual) console.log("  ✗ (" + m.reason + ") " + m.was + "  →  " + m.edited);
} else {
  console.log("Nothing needs manual handling.");
}
