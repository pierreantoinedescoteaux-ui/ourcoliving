/* Quiz scoring check: runs random (and persona) answer sets through
   quiz-score.js and reports how often each way of living lands in the
   top 3, the match spread and the fit bands. It also checks that every
   "fits because" line is something the person really said.
   Run: node _tools/quiz-sim.js [n] */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const src = ["map-data.js", "projects-data.js", "quiz-data.js", "quiz-score.js"]
  .map(f => fs.readFileSync(path.join(root, f), "utf8")).join("\n")
  .replace(/^(const|let) /gm, "var ");
const vm = require("vm"); const ctx = { console }; vm.createContext(ctx); vm.runInContext(src, ctx);
const { QuizScore: QS, QUIZ } = ctx;
const N = +process.argv[2] || 5000;
const qs = QS.allQuestions();
const sliders = qs.filter(q => q.kind === "slider" && q.said);
const band3 = v => { const x = v / 6 * 100; return x < 34 ? 0 : x > 66 ? 2 : 1; };

function rnd(n) { return Math.floor(Math.random() * n); }
function randomState(skip) {
  const st = { a: {}, h: {}, o: {} };
  qs.forEach(q => {
    if (Math.random() < skip) return;
    if (QS.hasOpen(q) && Math.random() < .08) { st.o[q.id] = true; return; }   /* "Not sure" / "Open to many things" */
    if (q.kind === "slider") { st.a[q.id] = rnd(7); if (q.heart && Math.random() < .25) st.h[q.id] = true; }
    else if (q.kind === "rank") { const o = q.options.map((_, i) => i).sort(() => Math.random() - .5); const n = rnd(6); if (n) st.a[q.id] = o.slice(0, n); }
    else if (q.multi) { const a = []; q.options.forEach((o, i) => { if (Math.random() < (q.id === "care" ? .2 : .3)) a.push(i); }); if (a.length) st.a[q.id] = a; }
    else if (q.kind === "text") { if (Math.random() < .5) st.a[q.id] = Math.random() < .5 ? "Marie" : "Jean-Luc.2"; }
    else st.a[q.id] = q.help && Math.random() < .25 ? "help" : rnd(q.options.length);
  });
  return st;
}
/* every "fits because" line must be true: if it is a slider phrase, the
   person's answer on that slider must be in that band */
function lies(st, r) {
  const bad = [];
  r.fits.forEach(f => f.because.forEach(txt => {
    sliders.forEach(q => {
      const i = q.said.indexOf(txt);
      if (i < 0) return;
      if (st.a[q.id] == null || band3(st.a[q.id]) !== i) bad.push(f.slug + ": “" + txt + "” but " + q.id + "=" + st.a[q.id]);
    });
  }));
  return bad;
}
const inTop3 = {}, firsts = {}, bands = [0, 0, 0, 0], matches = [];
let errors = 0;
for (let i = 0; i < N; i++) {
  const st = randomState(i % 4 === 0 ? 0.4 : 0.05);
  try {
    const r = QS.result(st);
    firsts[r.top.slug] = (firsts[r.top.slug] || 0) + 1;
    r.fits.forEach(f => { inTop3[f.slug] = (inTop3[f.slug] || 0) + 1; });
    bands[r.fit.band]++; matches.push(r.top.match);
    const back = QS.decode("#" + QS.encode(st));
    if (JSON.stringify(QS.result(back).fits.map(f => f.slug)) !== JSON.stringify(r.fits.map(f => f.slug))) throw new Error("share link round-trip changed the result");
    if (back.a.name !== st.a.name) throw new Error("name lost in link: " + st.a.name + " → " + back.a.name);
    if (JSON.stringify(Object.keys(back.o).sort()) !== JSON.stringify(Object.keys(st.o).sort())) throw new Error("not-sure answers lost in link");
    if (r.mirror.stand.some(s => s.x == null && s.label !== QUIZ.open.one)) throw new Error("open slider without its label");
    if (["pool", "give", "conflict"].some(k => QS.gateOf(st.a) !== "shared" && QS.clean(st).a[k] != null)) throw new Error("another gate's answer kept");
    if (!r.mirror.gate || !r.mirror.gate.t) throw new Error("no gate in the letter");
    if (r.fits.length !== 3 || r.places.length < 1 || r.blocks.length !== 5 || r.know.length < 2) throw new Error("thin letter " + JSON.stringify([r.fits.length, r.places.length, r.blocks.length, r.know.length]));
    if (r.places.some(p => !p.reason)) throw new Error("place without a reason");
    if (r.blocks.some(b => !b.pick && !b.because)) throw new Error("block without a because: " + r.blocks.filter(b => !b.pick && !b.because).map(b => b.area));
    const l = lies(st, r); if (l.length) throw new Error("untrue reason: " + l[0]);
    const txt = JSON.stringify(r.fits) + JSON.stringify(r.blocks) + JSON.stringify(r.places);
    if (/undefined|null|NaN/.test(txt.replace(/"(holdMiss|decHit|backend|pick)":null/g, ""))) throw new Error("undefined/NaN in letter text");
  } catch (e) { if (errors++ < 5) console.log("ERROR", e.message); }
}
console.log(`\n${N} random answer sets, ${errors} errors`);
console.log("In the top 3 / ranked first:");
ctx.COLIVING_TYPES.map(t => t.slug).sort((a, b) => (inTop3[b] || 0) - (inTop3[a] || 0))
  .forEach(k => console.log("  " + k.padEnd(20) + (100 * (inTop3[k] || 0) / N).toFixed(1).padStart(5) + "%  " + (100 * (firsts[k] || 0) / N).toFixed(1).padStart(5) + "%"));
const missing = ctx.COLIVING_TYPES.map(t => t.slug).filter(s => !inTop3[s]);
console.log("Never in the top 3:", missing.length ? missing.join(", ") : "none");
const maxFirst = Math.max(...Object.values(firsts)) / N;
console.log("Most often first:", (100 * maxFirst).toFixed(1) + "%", maxFirst > 0.3 ? "(TOO HIGH, over 30%)" : "(ok)");
matches.sort((a, b) => a - b);
console.log("First match: min", matches[0], "median", matches[N >> 1], "max", matches[N - 1]);
console.log("Fit bands (top→lightest):", bands.map(b => (100 * b / N).toFixed(0) + "%").join(" / "));

/* personas: hand-written answer sets; the expected way of living must be in the top 3 */
const P = [
  ["family who wants own front door", "cohousing", { with: 2, life: [3], setting: [1], hopes: [2, 0], share: 1, size: 3, time: 6, power: 5, autonomy: 3, effort: 4, purpose: 2, care: [5, 7, 2], own: 5, holding: [0], savings: 2 }],
  ["student on a budget", "student-coop", { with: 0, life: [0], setting: [0], hopes: [1, 0], share: 4, size: 2, time: 1, power: 5, autonomy: 3, effort: 1, purpose: 2, care: [7, 10], own: 0, savings: 0 }],
  ["founder in SF", "hacker-house", { with: 0, life: [2], setting: [0], hopes: [6, 3], share: 4, size: 0, time: 1, power: 2, autonomy: 1, effort: 0, purpose: 4, care: [11, 12], savings: 0 }],
  ["remote worker, nature", "rural-coliving", { with: 0, life: [5], setting: [2], hopes: [6, 0], share: 4, size: 1, time: 0, power: 1, autonomy: 2, effort: 1, purpose: 1, care: [2, 8, 19], savings: 0 }],
  ["land-and-mission idealist", "ecovillage", { with: 4, setting: [2], hopes: [5, 3], share: 3, size: 5, time: 5, power: 5, autonomy: 4, effort: 6, purpose: 5, care: [0, 1, 16, 17], hosts: [2], holding: [4], savings: 1 }],
  ["new in town, wants it easy", "operator-coliving", { with: 0, life: [6, 1], setting: [0], hopes: [0], share: 3, size: 3, time: 1, power: 0, autonomy: 1, effort: 0, purpose: 0, own: 0, holding: [3], savings: 0 }],
  ["builders who design their own", "baugruppen", { with: 1, setting: [0], hopes: [2], share: 1, size: 2, time: 6, power: 5, autonomy: 2, effort: 5, purpose: 1, care: [15], building: [0], own: 6, holding: [0], savings: 2 }],
  ["total sharer with a cause", "kibbutz", { with: 2, setting: [2], hopes: [3, 1], share: 6, size: 5, time: 6, power: 5, autonomy: 6, effort: 6, purpose: 6, care: [0, 12, 13], holding: [3] }],
  ["tech town builder with money", "network-village", { with: 0, hopes: [3, 6], share: 2, size: 6, time: 2, power: 1, autonomy: 2, effort: 6, purpose: 5, care: [11, 13], savings: 3 }],
  ["P-A style entrepreneur house", "entrepreneur-house", { with: 0, life: [2], setting: [0], hopes: [6, 0, 3], share: 4, size: 0, time: 2, power: 2, autonomy: 2, effort: 1, purpose: 3, care: [12, 10], savings: 0 }],
  /* P-A's bug (2026-10-22): someone else runs it, owns nothing. No reason may claim he wants to run or design it. */
  ["someone else runs it, owns nothing", null, { with: 0, setting: [0], hopes: [0], share: 3, size: 2, time: 2, power: 0, autonomy: 2, effort: 0, own: 0, holding: [2, 3], savings: 0, decisions: 0 }],
  ["founder-run, picks a founder", null, { power: 1, decisions: 0, own: 1, savings: 0 }],
  /* v4 gates: the gate answers must pull in the expected direction */
  ["own home, walkable street, helping out", "cohousing", { with: 1, setting: [1], share: 1, size: 3, time: 5, power: 4, community: [0, 4, 1], space: 3, recharge: 2 }],
  ["shared home, pools income, a day a week", "kibbutz", { with: 0, setting: [2], share: 6, size: 5, time: 6, power: 5, autonomy: 5, pool: [0, 1, 3], give: 2, space: 0, conflict: 5 }],
  ["shared home, roomy with a gym", "operator-coliving", { with: 0, setting: [0], share: 4, size: 3, time: 1, power: 0, effort: 0, pool: [1], give: 0, space: 6, recharge: 3 }],
  /* answers from another gate (share changed afterwards) must not count */
  ["changed to own home, old shared answers left", "cohousing", { with: 2, setting: [1], share: 1, size: 3, time: 6, power: 5, pool: [3], give: 2, community: [1, 4] }]
];
console.log("\nPersonas:");
let fails = 0;
P.forEach(([name, want, a]) => {
  const st = { a, h: {} }, r = QS.result(st), slugs = r.fits.map(f => f.slug);
  let ok = !want || slugs.indexOf(want) >= 0, note = "";
  const l = lies(st, r); if (l.length) { ok = false; note += "  [untrue: " + l.join("; ") + "]"; }
  const all = r.fits.map(f => f.because.join(" / ")).join(" | ");
  if (/run it together|design/.test(all) && a.power != null && a.power <= 1) { ok = false; note += "  [claims a wish to run or design it: " + all + "]"; }
  if (!ok) fails++;
  console.log(`  ${ok ? "ok  " : "MISS"} ${name.padEnd(36)} → ${r.fits.map(f => f.slug + " " + f.match).join(", ")}` + (ok ? "" : (want && slugs.indexOf(want) < 0 ? `  [wanted ${want} in top 3]` : "") + note));
});
console.log(fails ? `\n${fails} persona(s) missed` : "\nAll personas land where expected");
const ex = QS.result({ a: P[10][2], h: {} });
console.log("\nSample letter bits (someone else runs it):");
ex.fits.forEach(f => console.log("  " + f.slug + " (" + f.words + "): fits because " + f.because.join(" / ") + "  ||  " + f.differs));
console.log("  blocks:", ex.blocks.map(r => r.area + ": " + r.title + (r.because ? " [because " + r.because + "]" : " [pick]")).join("\n          "));
console.log("  places:", ex.places.map(p => p.p.name + ": " + p.reason).join("\n          "));
console.log("  know:", ex.know.map(k => k.h).join(" | "));
console.log("  mirror:", JSON.stringify(ex.mirror));
console.log("  pin:", ex.pin.link);
const fam = QS.result({ a: P[0][2], h: { time: true } });
console.log("\nFamily persona:");
fam.fits.forEach(f => console.log("  " + f.slug + ": " + f.because.join(" / ") + "  ||  " + f.differs));
console.log("  places:", fam.places.map(p => p.p.name + ": " + p.reason).join("\n          "));
console.log("  pin:", fam.pin.link);
