/* Flags voice-rule risks in guide content: lists of three, "not X but Y",
   more than one number per text, sales words. Run: node _tools/voice-lint.js [files...] */
const fs = require('fs'), path = require('path');
const files = process.argv.slice(2).length ? process.argv.slice(2) :
  fs.readdirSync(__dirname).filter(f => /^guide-content-.+\.json$/.test(f)).map(f => path.join(__dirname, f));
const THREE = /\b[\w'-]+(?: [\w'-]+){0,3}, [\w'-]+(?: [\w'-]+){0,3},? (?:and|or) [\w'-]+/g;
const SALES = /\b(revolutionary|unique|vibrant|seamless|game-chang|thriving|cutting-edge|world-class|legendary)\b/i;
let n = 0;
function walk(o, where, file) {
  if (typeof o === 'string') {
    const hits = [];
    (o.match(THREE) || []).forEach(m => hits.push('three: "' + m + '"'));
    if (/\bnot\b[^.]{0,40}\bbut\b/i.test(o)) hits.push('not X but Y');
    if (SALES.test(o)) hits.push('sales word: ' + o.match(SALES)[0]);
    const nums = (o.match(/\b\d[\d,.]*\b/g) || []).length;
    if (nums > 1 && !/sources|id$/.test(where)) hits.push(nums + ' numbers');
    if (hits.length) { n++; console.log(path.basename(file) + ' ' + where + ': ' + hits.join(' | ')); }
  } else if (o && typeof o === 'object') for (const k in o) if (!/^(sources|newSources|flags|id)$/.test(k)) walk(o[k], where ? where + '.' + k : k, file);
}
files.forEach(f => walk(JSON.parse(fs.readFileSync(f, 'utf8')), '', f));
console.log(n + ' texts flagged');
