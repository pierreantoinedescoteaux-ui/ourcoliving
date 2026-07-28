/* Loads every *-data.js content file and hands back their top-level objects.
   They declare their content with `const NAME = ...`, which is lexically
   scoped, so running them in a sandbox alone exposes nothing — we collect the
   declared names first and ask for them by name at the end. */
const fs = require("fs"), path = require("path"), vm = require("vm");

const ROOT = path.join(__dirname, "..");
const FILES = [
  "data.js", "work-data.js", "talkpieces-data.js", "map-data.js",
  "about-data.js", "manifesto-data.js", "design-data.js", "themes-data.js",
  "knowledge-data.js", "resources-data.js", "designers-data.js"
];

function load() {
  let src = "";
  const names = new Set(), origin = {};
  for (const f of FILES) {
    const s = fs.readFileSync(path.join(ROOT, f), "utf8");
    src += "\n" + s;
    for (const m of s.matchAll(/^(?:const|var|let)\s+([A-Z][A-Z0-9_]*)\s*=/gm)) {
      names.add(m[1]); origin[m[1]] = f;
    }
  }
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(src + "\n;globalThis.__ALL={" + [...names].join(",") + "};", ctx);
  return { data: ctx.__ALL, origin, FILES, ROOT };
}

module.exports = { load, FILES, ROOT };
