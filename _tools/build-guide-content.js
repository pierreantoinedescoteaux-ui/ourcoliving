/* Builds guide-content-data.js from _tools/guide-content-<slug>.json (one per
   way of living) and checks the voice rules. Run: node _tools/build-guide-content.js */
const fs = require('fs'), path = require('path');
const AREAS = ['governance', 'financing', 'space', 'community', 'operations', 'privacy', 'leaving'];
const out = {}, bad = [];
fs.readdirSync(__dirname).filter(f => /^guide-content-.+\.json$/.test(f)).forEach(f => {
  const slug = f.replace(/^guide-content-|\.json$/g, '');
  const c = JSON.parse(fs.readFileSync(path.join(__dirname, f), 'utf8'));
  AREAS.forEach(a => {
    const x = (c.areas || {})[a];
    if (!x) { bad.push(slug + '.' + a + ': missing'); return; }
    ['summary', 'body', 'pitfall'].forEach(k => {
      const v = x[k] || '';
      if (!v) bad.push(slug + '.' + a + '.' + k + ': empty');
      if (/[—–]/.test(v)) bad.push(slug + '.' + a + '.' + k + ': long dash');
      if (/\b(not just|isn't just|but rather)\b/i.test(v)) bad.push(slug + '.' + a + '.' + k + ': contrast');
    });
    const n = (x.body || '').split(/\s+/).length;
    if (n < 70 || n > 175) bad.push(slug + '.' + a + '.body: ' + n + ' words');
  });
  ['whoPoints', 'watchPoints'].forEach(k => { if (!(c[k] || []).length) bad.push(slug + '.' + k + ': empty'); });
  out[slug] = c;
});
fs.writeFileSync(path.join(__dirname, '..', 'guide-content-data.js'),
  '/* GUIDE CONTENT: the longer field-guide text per way of living (how each area\n   works, who it suits, what to watch). Built by _tools/build-guide-content.js\n   from _tools/guide-content-<slug>.json. Edit those, then rebuild. */\n' +
  'var GUIDE_CONTENT = ' + JSON.stringify(out, null, 1) + ';\n');
console.log('guide-content-data.js:', Object.keys(out).join(', '), bad.length ? '\nPROBLEMS:\n ' + bad.join('\n ') : '(clean)');
