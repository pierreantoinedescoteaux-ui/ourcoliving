/* Builds hub-cards-data.js (option cards for themes.html) from _tools/hub/<group>.json
   and checks the voice rules. Run: node _tools/build-hub.js */
const fs = require('fs'), path = require('path');
const DIR = path.join(__dirname, 'hub');
const GROUPS = ['setting', 'building', 'size', 'hosts', 'decisions', 'govstyles', 'legal', 'holding', 'money', 'who', 'path'];
const out = {}, bad = [];
GROUPS.forEach(g => {
  const f = path.join(DIR, g + '.json');
  if (!fs.existsSync(f)) { bad.push(g + ': no file yet'); return; }
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  let cards = d.options || d.cards || d.steps || [];
  if (g === 'legal' && !cards.some(c => c.id === 'land-trust')) cards.splice(6, 0, JSON.parse(fs.readFileSync(path.join(DIR, 'gold-card.json'), 'utf8')));
  cards.forEach(c => {
    ['summary', 'body'].forEach(k => {
      if (!c[k]) bad.push(g + '.' + c.id + '.' + k + ': empty');
      else if (/[—–]/.test(c[k])) bad.push(g + '.' + c.id + '.' + k + ': long dash');
    });
    delete c.flags;
  });
  out[g] = cards;
});
fs.writeFileSync(path.join(__dirname, '..', 'hub-cards-data.js'),
  '/* HUB CARDS: option cards for themes.html, built by _tools/build-hub.js from\n   _tools/hub/<group>.json. Edit those, then rebuild. */\nvar HUB_CARDS = ' + JSON.stringify(out, null, 1) + ';\n');
console.log('hub-cards-data.js:', Object.keys(out).map(g => g + ' ' + out[g].length).join(', '), bad.length ? '\nNOTES:\n ' + bad.join('\n ') : '(clean)');
