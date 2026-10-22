/* Builds toolbox-data.js (how-to.html) from _tools/toolbox.json and checks
   each tool has what the page needs. Run: node _tools/build-toolbox.js */
const fs = require('fs'), path = require('path');
const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'toolbox.json'), 'utf8'));
const AREAS = ['building', 'social', 'governance', 'legal', 'money', 'privacy', 'leaving', 'who', 'path'];
const bad = [];
const tools = (d.tools || []).filter(t => {
  const miss = ['id', 'name', 'what', 'by', 'format', 'cost', 'url'].filter(k => !t[k]);
  if (miss.length) { bad.push(t.id + ': missing ' + miss.join(',')); return false; }
  if (/[—–]/.test(t.what)) bad.push(t.id + ': long dash');
  t.areas = (t.areas || []).filter(a => AREAS.includes(a));
  if (!t.areas.length) { bad.push(t.id + ': no valid area'); return false; }
  return true;
});
fs.writeFileSync(path.join(__dirname, '..', 'toolbox-data.js'),
  '/* TOOLBOX: outside tools for how-to.html, built by _tools/build-toolbox.js from\n   _tools/toolbox.json. Edit that, then rebuild. */\nvar TOOLBOX = ' + JSON.stringify({ tools }, null, 1) + ';\n');
console.log('toolbox-data.js:', tools.length, 'tools', bad.length ? '\nNOTES:\n ' + bad.join('\n ') : '(clean)');
