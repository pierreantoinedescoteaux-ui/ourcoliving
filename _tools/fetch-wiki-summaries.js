/* Pulls free Wikipedia summaries (REST API) for glossary terms, as raw
   material for the writers. Run: node _tools/fetch-wiki-summaries.js <out.json> */
const fs = require('fs'), path = require('path');
const terms = JSON.parse(fs.readFileSync(path.join(__dirname, 'glossary-terms.json'), 'utf8'));
(async () => {
  const out = {};
  for (const t of terms.filter(t => t.wiki)) {
    const u = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(t.wiki.replace(/ /g, '_'));
    try {
      const r = await fetch(u, { headers: { 'User-Agent': 'ourcoliving.xyz glossary (https://ourcoliving.xyz)' } });
      const j = await r.json();
      out[t.id] = r.ok ? { title: j.title, extract: j.extract, url: j.content_urls && j.content_urls.desktop.page } : { error: r.status };
    } catch (e) { out[t.id] = { error: String(e) }; }
    console.log(t.id.padEnd(26), out[t.id].error ? 'ERR ' + out[t.id].error : out[t.id].extract.length);
  }
  fs.writeFileSync(process.argv[2] || path.join(__dirname, 'wiki-summaries.json'), JSON.stringify(out, null, 1));
})();
