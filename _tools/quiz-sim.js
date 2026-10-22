/* Quiz scoring check: runs random (and persona) answer sets through
   quiz-score.js and reports how often each way of living comes out on
   top, the match spread and the fit bands. Run: node _tools/quiz-sim.js [n] */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const src = ["map-data.js", "projects-data.js", "quiz-data.js", "quiz-score.js"]
  .map(f => fs.readFileSync(path.join(root, f), "utf8")).join("\n")
  .replace(/^(const|let) /gm, "var ");
const vm = require("vm"); const ctx = { console }; vm.createContext(ctx); vm.runInContext(src, ctx);
const { QuizScore: QS, QUIZ } = ctx;
const N = +process.argv[2] || 5000;
const qs = QS.allQuestions();

function rnd(n) { return Math.floor(Math.random() * n); }
function randomState(skip) {
  const st = { a: {}, h: {} };
  qs.forEach(q => {
    if (Math.random() < skip) return;
    if (q.kind === "slider") { st.a[q.id] = rnd(7); if (q.heart && Math.random() < .25) st.h[q.id] = true; }
    else if (q.kind === "chips" && q.multi) { const a = []; q.options.forEach((o, i) => { if (Math.random() < .15) a.push(i); }); if (a.length) st.a[q.id] = a; }
    else if (q.kind === "text") { if (Math.random() < .5) st.a[q.id] = "Marie"; }
    else st.a[q.id] = q.help && Math.random() < .25 ? "help" : rnd(q.options.length);
  });
  return st;
}
const tops = {}, seconds = {}, bands = [0, 0, 0, 0], matches = [];
let errors = 0;
for (let i = 0; i < N; i++) {
  const st = randomState(i % 4 === 0 ? 0.4 : 0.05);
  try {
    const r = QS.result(st);
    tops[r.top.slug] = (tops[r.top.slug] || 0) + 1;
    seconds[r.second.slug] = (seconds[r.second.slug] || 0) + 1;
    bands[r.fit.band]++; matches.push(r.top.match);
    const back = QS.decode("#" + QS.encode(st));
    if (QS.result(back).top.slug !== r.top.slug) throw new Error("share link round-trip changed the result");
    if (r.places.length < 1 || r.setup.length !== 5 || r.know.length < 2) throw new Error("thin letter " + JSON.stringify([r.places.length, r.setup.length, r.know.length]));
  } catch (e) { if (errors++ < 5) console.log("ERROR", e.message); }
}
console.log(`\n${N} random answer sets, ${errors} errors`);
console.log("Top result share:");
Object.entries(tops).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log("  " + k.padEnd(20) + (100 * v / N).toFixed(1) + "%"));
const missing = ctx.COLIVING_TYPES.map(t => t.slug).filter(s => !tops[s]);
console.log("Never on top:", missing.length ? missing.join(", ") : "none");
matches.sort((a, b) => a - b);
console.log("Top match: min", matches[0], "median", matches[N >> 1], "max", matches[N - 1]);
console.log("Fit bands (top→lightest):", bands.map(b => (100 * b / N).toFixed(0) + "%").join(" / "));

/* personas: hand-written answer sets with an expected winner */
const P = [
  ["family who wants own front door", "cohousing", { with: 2, life: [3], setting: 1, budget: 1, share: 1, size: 3, time: 6, power: 5, autonomy: 3, ecoTech: 2, effort: 4, purpose: 2, own: 5, holding: 0, savings: 2 }],
  ["student on a budget", "student-coop", { with: 0, life: [0], setting: 0, budget: 0, share: 4, size: 2, time: 1, power: 5, autonomy: 3, ecoTech: 3, effort: 1, purpose: 2, own: 0, savings: 0 }],
  ["founder in SF", "hacker-house", { with: 0, life: [2], setting: 0, budget: 1, share: 4, size: 0, time: 1, power: 2, autonomy: 1, ecoTech: 6, effort: 0, purpose: 4, savings: 0 }],
  ["remote worker, nature", "rural-coliving", { with: 0, life: [5], setting: 2, budget: 1, share: 4, size: 1, time: 0, power: 1, autonomy: 2, ecoTech: 2, effort: 1, purpose: 1, savings: 0 }],
  ["land-and-mission idealist", "ecovillage", { with: 4, setting: 2, budget: 0, share: 3, size: 5, time: 5, power: 5, autonomy: 4, ecoTech: 0, effort: 6, purpose: 5, hosts: 2, holding: 4, savings: 1 }],
  ["new in town, wants it easy", "operator-coliving", { with: 0, life: [6, 1], setting: 0, budget: 2, share: 3, size: 3, time: 1, power: 0, autonomy: 1, ecoTech: 4, effort: 0, purpose: 0, own: 0, savings: 0 }],
  ["builders who design their own", "baugruppen", { with: 1, setting: 0, budget: 2, share: 1, size: 2, time: 6, power: 5, autonomy: 2, ecoTech: 3, effort: 5, purpose: 1, building: 0, own: 6, holding: 0, savings: 2 }],
  ["total sharer with a cause", "kibbutz", { with: 2, setting: 2, budget: 0, share: 6, size: 5, time: 6, power: 5, autonomy: 6, ecoTech: 2, effort: 6, purpose: 6, holding: 3 }],
  ["tech town builder with money", "network-village", { with: 0, setting: 3, budget: 2, share: 2, size: 6, time: 2, power: 1, autonomy: 2, ecoTech: 6, effort: 6, purpose: 5, savings: 3 }],
  ["P-A style entrepreneur house", "entrepreneur-house", { with: 0, life: [2], setting: 0, budget: 1, share: 4, size: 0, time: 2, power: 2, autonomy: 2, ecoTech: 4, effort: 1, purpose: 3, savings: 0 }]
];
console.log("\nPersonas:");
let fails = 0;
P.forEach(([name, want, a]) => {
  const r = QS.result({ a, h: {} });
  const ok = r.top.slug === want; if (!ok) fails++;
  console.log(`  ${ok ? "ok  " : "MISS"} ${name.padEnd(32)} → ${r.top.slug} (${r.top.match}), then ${r.second.slug} (${r.second.match})` + (ok ? "" : `  [wanted ${want}]`));
});
console.log(fails ? `\n${fails} persona(s) missed` : "\nAll personas land where expected");
const ex = QS.result({ a: P[0][2], h: { time: true } });
console.log("\nSample letter bits (family persona):");
console.log("  because:", ex.reasons.join(" / "));
console.log("  rather:", ex.second.slug, "if you'd rather", ex.rather);
console.log("  fit:", ex.fitText.h);
console.log("  setup:", ex.setup.map(r => r.area + ": " + r.title).join(" | "));
console.log("  places:", ex.places.map(p => p.name).join(", "));
console.log("  know:", ex.know.map(k => k.h).join(" | "));
console.log("  pin:", ex.pin.link);
