/* Builds glossary-data.js from glossary-terms.json (ids, aliases, areas) and a
   definitions file, and checks the voice rules. Run:
   node _tools/build-glossary.js <definitions.json>   -> glossary-data.js */
const fs = require('fs'), path = require('path');
const terms = JSON.parse(fs.readFileSync(path.join(__dirname, 'glossary-terms.json'), 'utf8'));
const defs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const byId = {}; defs.forEach(d => { byId[d.id] = d; });
const INTRO = "Living together comes with its own words, and some of them only made sense to me after a few long meetings. " +
  "I keep this little book open while I learn. Look up anything that stops you, and if a word is missing, tell me and we’ll add it.";
const bad = [];
const out = terms.map(t => {
  const d = byId[t.id];
  if (!d) { bad.push(t.id + ': no definition'); return null; }
  const words = d.def.split(/\s+/).length;
  if (/[—–]/.test(d.def)) bad.push(t.id + ': long dash');
  if (/\b(not just|isn't just|but rather)\b/i.test(d.def)) bad.push(t.id + ': contrast pattern');
  if (words > 55) bad.push(t.id + ': ' + words + ' words');
  return { id: t.id, term: t.term, aliases: t.aliases || [], area: t.area, def: d.def, link: d.link || t.link || '', linkLabel: d.linkLabel || '' };
}).filter(Boolean);
if (bad.length) { console.log('PROBLEMS:\n ' + bad.join('\n ')); }
fs.writeFileSync(path.join(__dirname, '..', 'glossary-data.js'),
  '/* GLOSSARY DATA, built by _tools/build-glossary.js from _tools/glossary-terms.json.\n   Loaded by glossary.js when the browser is idle. Edit the definitions file, then rebuild. */\n' +
  'window.GLOSSARY_DATA = ' + JSON.stringify({ intro: INTRO, terms: out }, null, 1) + ';\n');
console.log('glossary-data.js:', out.length, 'terms', bad.length ? '(' + bad.length + ' problems)' : '(clean)');
