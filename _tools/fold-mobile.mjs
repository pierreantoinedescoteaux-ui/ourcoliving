// Folds _mobile/*.css fragments into mobile.css (Round 2 section), pruning
// shared-component rules that are handled sitewide (wback, btn-pill, reveal).
import fs from "fs"; import path from "path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.slice(1)), "..");
const frag = path.join(root, "_mobile");
const PRUNE = /\.(wback|btn-pill|reveal)\b/;

function stripPruned(css) {
  const lines = css.split("\n"); const out = []; let i = 0; let pruned = [];
  while (i < lines.length) {
    // find start of a rule: selector line(s) ending with {
    if (/^\s*(html\.m-[\w-]+[^{]*|\s*[^@{}/]*)\{\s*$/.test(lines[i]) && PRUNE.test(lines[i])) {
      // remove preceding contiguous comment block
      while (out.length && (/^\s*(\/\*|\*|\s*$)/.test(out[out.length-1]) && !/\*\/\s*\S/.test(out[out.length-1]))) {
        const popped = out.pop();
        if (/^\s*\/\*/.test(popped)) break; // stop after removing the comment opener
      }
      pruned.push(lines[i].trim().slice(0, 60));
      while (i < lines.length && !/\}/.test(lines[i])) i++;
      i++; // skip closing }
      continue;
    }
    out.push(lines[i]); i++;
  }
  return { css: out.join("\n"), pruned };
}

let bundle = "\n/* ============================================================\n   ROUND 2 (2026-07-22): per-page layout/impact pass — folded from\n   _mobile/<page>.css fragments (10 parallel agents, see _mobile/*-REPORT.md).\n   Shared-component fixes (.wback, .btn-pill, footer) live in site-nav.js +\n   the shared section below — per-page duplicates pruned at fold time.\n   ============================================================ */\n\n@media (max-width: 760px) {\n  /* ---- shared: email CTA pill wraps instead of overflowing viewport ---- */\n  .btn-pill { max-width: 100%; white-space: normal; overflow-wrap: anywhere; word-break: break-word; text-align: center; line-height: 1.35; }\n}\n";
const report = [];
for (const f of fs.readdirSync(frag).filter(f => f.endsWith(".css")).sort()) {
  const raw = fs.readFileSync(path.join(frag, f), "utf8");
  const { css, pruned } = stripPruned(raw);
  report.push(f + ": " + (pruned.length ? "pruned " + pruned.join(" | ") : "clean"));
  bundle += "\n/* ================= " + f + " (round 2) ================= */\n" + css.trim() + "\n";
}
fs.appendFileSync(path.join(root, "mobile.css"), bundle);
console.log(report.join("\n"));
console.log("APPENDED", bundle.length, "chars to mobile.css");
