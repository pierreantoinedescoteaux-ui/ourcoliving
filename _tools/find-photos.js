/* Finds free (CC / public domain) Wikimedia Commons photos for real places
   that have no image yet, and writes a contact sheet to pick from.
   Run: node _tools/find-photos.js   -> _tools/photo-candidates.json + _tools/photo-sheet.html */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// better search words than the bare name, where the name is too common
const QUERY = {
  'nightingale': ['Nightingale Housing Brunswick', 'Nightingale 1 Brunswick'],
  'r50': ['R50 Ritterstraße Berlin', 'R50 cohousing Berlin'],
  'the-residency': ['The Residency hacker house San Francisco'],
  'zuzalu': ['Zuzalu Montenegro'],
  'cohabitat-quebec': ['Cohabitat Québec Saint-Sacrement'],
  'cohabitat-neuville': ['Neuville Québec cohabitat'],
  'vancouver-cohousing': ['Vancouver Cohousing'],
  'windsong': ['WindSong cohousing Langley'],
  'terra-firma': ['Terra Firma cohousing Ottawa'],
  'muir-commons': ['Muir Commons Davis'],
  'petaluma-avenue-homes': ['Petaluma Avenue Homes Sebastopol'],
  'fardknappen': ['Färdknäppen Stockholm', 'Färdknäppen kollektivhus'],
  'stolplyckan': ['Stolplyckan Linköping'],
  'hogeweyk': ['Hogeweyk Weesp', 'De Hogeweyk'],
  'un-village-a-lachine': ['Lachine cohabitat Village Urbain']
};
const FREE = /^(cc[ -]?by|cc[ -]?by-sa|cc0|public domain|pd)/i;

function loadProjects() {
  const c = {}; c.window = c; vm.createContext(c);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'map-data.js'), 'utf8') + '\n' +
    fs.readFileSync(path.join(ROOT, 'projects-data.js'), 'utf8') + ';this.__P=COLIVING_PROJECTS', c);
  return c.__P;
}

async function search(q) {
  const u = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', generator: 'search', gsrnamespace: '6', gsrsearch: q, gsrlimit: '10',
    prop: 'imageinfo', iiprop: 'url|extmetadata|size|mime', iiurlwidth: '900'
  });
  const r = await fetch(u, { headers: { 'User-Agent': 'ourcoliving.xyz photo finder (https://ourcoliving.xyz)' } });
  const j = await r.json();
  return Object.values((j.query && j.query.pages) || {}).map(p => {
    const ii = (p.imageinfo || [])[0] || {}, m = ii.extmetadata || {};
    const strip = s => String((s && s.value) || '').replace(/<[^>]+>/g, '').trim();
    return { title: p.title, thumb: ii.thumburl, full: ii.url, page: ii.descriptionurl, w: ii.width, h: ii.height, mime: ii.mime,
      license: strip(m.LicenseShortName), author: strip(m.Artist), licenseUrl: strip(m.LicenseUrl) };
  }).filter(x => x.thumb && /jpeg|png|webp/.test(x.mime || '') && FREE.test(x.license) && x.w >= 800);
}

(async () => {
  const todo = loadProjects().filter(p => !p.img && p.kind !== 'network');
  const out = {};
  for (const p of todo) {
    const qs = QUERY[p.id] || [p.name + ' ' + (p.place || '').split(',')[0]];
    const seen = new Set(), cands = [];
    for (const q of qs.concat([p.name])) {
      for (const c of await search(q)) if (!seen.has(c.title)) { seen.add(c.title); cands.push(c); }
      if (cands.length >= 6) break;
    }
    out[p.id] = { name: p.name, place: p.place, candidates: cands.slice(0, 6) };
    console.log(p.id.padEnd(24), cands.length);
  }
  fs.writeFileSync(path.join(__dirname, 'photo-candidates.json'), JSON.stringify(out, null, 1));
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const html = `<!doctype html><meta charset="utf-8"><title>Pick the photos</title>
<style>body{font:15px system-ui;margin:24px;background:#f6f2ea;color:#222}h2{margin:28px 0 6px}.row{display:flex;gap:10px;flex-wrap:wrap}
figure{margin:0;width:260px;cursor:pointer;border:4px solid transparent;border-radius:8px;background:#fff;padding:6px}figure.on{border-color:#2f7d4f}
img{width:100%;height:170px;object-fit:cover;border-radius:4px}figcaption{font-size:11px;color:#666;margin-top:4px}
#out{position:fixed;right:16px;bottom:16px;width:340px;background:#fff;border:2px solid #2f7d4f;border-radius:10px;padding:12px}textarea{width:100%;height:120px}
.none{color:#a33}</style>
<h1>Click the best photo for each place (click again to unpick)</h1><p>Then copy the box at the bottom right and paste it to Claude. Places with no good photo: just don't pick one.</p>
${Object.entries(out).map(([id, e]) => `<h2>${esc(e.name)} <small>${esc(e.place)}</small></h2>` + (e.candidates.length ? `<div class="row">${e.candidates.map((c, i) =>
    `<figure data-id="${id}" data-i="${i + 1}"><img loading="lazy" src="${esc(c.thumb)}"><figcaption>${i + 1} · ${esc(c.license)} · ${esc(c.author).slice(0, 40)}</figcaption></figure>`).join('')}</div>` : '<p class="none">No free photo found.</p>')).join('\n')}
<div id="out"><b>Your picks</b><textarea id="t" readonly></textarea></div>
<script>var picks={};document.addEventListener('click',function(e){var f=e.target.closest('figure');if(!f)return;var id=f.dataset.id;
document.querySelectorAll('figure[data-id="'+id+'"]').forEach(function(x){if(x!==f)x.classList.remove('on')});
f.classList.toggle('on');if(f.classList.contains('on'))picks[id]=f.dataset.i;else delete picks[id];
document.getElementById('t').value=Object.keys(picks).map(function(k){return k+' '+picks[k]}).join('\\n');});</script>`;
  fs.writeFileSync(path.join(__dirname, 'photo-sheet.html'), html);
  console.log('wrote _tools/photo-sheet.html');
})();
