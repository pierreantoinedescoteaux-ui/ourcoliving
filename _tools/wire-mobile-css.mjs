// Wires mobile.css into every target page: adds <link> before </head> and stamps
// <html class="m-<page>"> so mobile.css can scope per page. Idempotent — safe to
// re-run any time (e.g., after creating a new page). Zero model tokens.
// Usage: node _tools/wire-mobile-css.mjs   (run from repo root or _tools)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// index.html + tower.html excluded (scroll landing — its engine owns mobile)
const SKIP = new Set(["index.html", "tower.html", "index-v2.html", "story-v1.html", "story-backup-r25.html"]);

const pages = fs.readdirSync(root).filter(f => f.endsWith(".html") && !SKIP.has(f));
for (const f of pages) {
  const p = path.join(root, f);
  let html = fs.readFileSync(p, "utf8");
  const slug = "m-" + f.replace(/\.html$/, "");
  let changed = false;

  // 1. stamp <html class="m-<page>">
  if (!new RegExp(`<html[^>]*class="[^"]*\\b${slug}\\b`).test(html)) {
    if (/<html([^>]*)class="([^"]*)"/.test(html)) {
      html = html.replace(/<html([^>]*)class="([^"]*)"/, `<html$1class="$2 ${slug}"`);
    } else {
      html = html.replace(/<html([^>]*)>/, `<html$1 class="${slug}">`);
    }
    changed = true;
  }

  // 2. add the stylesheet link last in <head>
  if (!html.includes('href="mobile.css"')) {
    html = html.replace(/<\/head>/i, '<link rel="stylesheet" href="mobile.css">\n</head>');
    changed = true;
  }

  // 3. viewport-fit=cover so env(safe-area-inset-*) works on notched phones
  const vp = html.match(/<meta name="viewport" content="([^"]*)"/);
  if (vp && !vp[1].includes("viewport-fit")) {
    html = html.replace(vp[0], '<meta name="viewport" content="' + vp[1] + ', viewport-fit=cover"');
    changed = true;
  }

  if (changed) { fs.writeFileSync(p, html); console.log("wired", f); }
  else console.log("ok    ", f);
}
