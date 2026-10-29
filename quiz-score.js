/* =====================================================================
   QUIZ SCORING (quiz.html). Pure functions, no DOM, so it can be
   tested in node (_tools/quiz-sim.js). Needs map-data.js,
   projects-data.js and quiz-data.js loaded first.
   How it works, in plain words: FOR PIERRE-ANTOINE/QUIZ-CONTENT-DRAFT.md §4.
   v2: no single winner. result() returns what the person said (mirror),
   building blocks with a "because" each, the 3 closest ways of living
   with reasons built ONLY from real answers, and places with a reason.
   ===================================================================== */
var QuizScore = (function () {
  var MAP_KEYS = ["share", "size", "time", "power", "autonomy", "ecoTech", "effort"];
  var SPECTRA = MAP_KEYS.concat(["purpose"]);
  var SET = ["city", "suburb", "countryside"], BK = ["new", "converted", "mixed"], HO = ["homes", "mixed-use", "farm"];
  var DK = ["founder", "vote", "consensus", "consent", "advice"], HK = ["own", "shares", "rent", "membership", "use-rights"];
  var LIFE_FOR = ["students", "young-adults", "entrepreneurs", "families", "single-parents", "remote-workers", "newcomers", "artists", null, "seniors"];

  var QS = null;
  function allQuestions() {
    var out = [];
    QUIZ.steps.forEach(function (s) { s.questions.forEach(function (q) { out.push(q); }); });
    return out;
  }
  function qById(id) {
    if (!QS) { QS = {}; allQuestions().forEach(function (q) { QS[q.id] = q; }); }
    return QS[id];
  }
  function pos(v) { return v == null ? null : v / 6 * 100; }
  function band3(x) { return x < 34 ? 0 : x > 66 ? 2 : 1; }
  function rangeOf(t, k) { return (t.ranges && t.ranges[k]) || (t.backend && t.backend[k]) || null; }
  function setups(t, field) {
    var o = [];
    (t.typicalSetups || []).forEach(function (s) { (s[field] || []).forEach(function (v) { if (o.indexOf(v) < 0) o.push(v); }); });
    return o;
  }
  function has(arr, i) { return Array.isArray(arr) && arr.indexOf(i) >= 0; }
  function picks(v) { return Array.isArray(v) ? v : typeof v === "number" ? [v] : []; }
  function isMulti(q) { return q.multi || q.kind === "rank"; }
  /* v3: one label per slider position */
  function stopLabel(q, v) { return q && q.stops && v != null ? q.stops[Math.max(0, Math.min(6, Math.round(v)))] : null; }
  function hasOpen(q) { return q.kind !== "text" && !q.noOpen; }

  /* ---------- the gate: how much you'd share picks own home, a bit of both or a shared home ---------- */
  function gateOf(a) { if (a.gatePick != null) return ["own", "between", "shared"][a.gatePick]; var v = a.share; return v == null ? "between" : v <= 2 ? "own" : v === 3 ? "between" : "shared"; }
  function inGate(q, a) { return !q.gates || q.gates.indexOf(gateOf(a)) >= 0; }
  /* answers to another gate's questions (share changed afterwards) are dropped */
  function clean(st) {
    var out = { a: {}, h: {}, o: {} };
    allQuestions().forEach(function (q) {
      if (!inGate(q, st.a)) return;
      if (st.a[q.id] != null) out.a[q.id] = st.a[q.id];
      if (st.h && st.h[q.id]) out.h[q.id] = true;
      if (st.o && st.o[q.id]) out.o[q.id] = true;
    });
    return out;
  }
  function joinList(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
  function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  /* ---------- share link: one token per question, in order ---------- */
  function encode(st) {
    var o = st.o || {};
    var toks = allQuestions().map(function (q) {
      var v = st.a[q.id];
      if (o[q.id] && v == null) return "_";
      if (q.kind === "slider") return v == null ? "" : String(v) + (st.h[q.id] ? "h" : "");
      if (q.kind === "rank") return (v || []).map(function (i) { return i.toString(36); }).join("-");
      if (q.multi) { var m = 0; (v || []).forEach(function (i) { m |= 1 << i; }); return m ? m.toString(36) : ""; }
      if (q.kind === "text") return v ? encodeURIComponent(v).replace(/\./g, "%2E").replace(/-/g, "%2D") : "";
      if (v === "help") return "x";
      return v == null ? "" : String(v);
    });
    return "q=" + QUIZ.version + "." + toks.join(".");
  }
  function decode(hash) {
    var m = /q=(\d+)\.([^&]*)/.exec(hash || "");
    if (!m || +m[1] !== QUIZ.version) return null;
    var toks = m[2].split("."), st = { a: {}, h: {}, o: {} };
    allQuestions().forEach(function (q, i) {
      var t = toks[i];
      if (t == null || t === "") return;
      if (t === "_") { if (hasOpen(q)) st.o[q.id] = true; return; }
      if (q.kind === "slider") {
        var n = parseInt(t, 10);
        if (n >= 0 && n <= 6) { st.a[q.id] = n; if (/h/.test(t)) st.h[q.id] = true; }
      } else if (q.kind === "rank") {
        var r = [];
        t.split("-").forEach(function (x) { var k = parseInt(x, 36); if (k >= 0 && k < q.options.length && r.indexOf(k) < 0) r.push(k); });
        if (r.length) st.a[q.id] = r;
      } else if (q.multi) {
        var mask = parseInt(t, 36), arr = [];
        q.options.forEach(function (o, j) { if (mask & (1 << j)) arr.push(j); });
        if (arr.length) st.a[q.id] = arr;
      } else if (q.kind === "text") {
        try { st.a[q.id] = decodeURIComponent(t).slice(0, 40); } catch (e) {}
      } else if (t === "x") st.a[q.id] = "help";
      else { var k = parseInt(t, 10); if (k >= 0 && k < q.options.length) st.a[q.id] = k; }
    });
    return st;
  }

  /* ---------- answers the scoring uses: the map's ecoTech comes from the care picks ---------- */
  function derive(a) {
    var d = {}, C = QUIZ.care, care = a.care || [], e = 0, t = 0;
    Object.keys(a).forEach(function (k) { d[k] = a[k]; });
    care.forEach(function (i) { if (has(C.eco, i)) e++; if (has(C.tech, i)) t++; });
    if (e + t) d.ecoTech = Math.round(3 + 3 * Math.min(1, (e + t) / 3) * (t - e) / (e + t));
    if (care.some(function (i) { return has(C.purpose, i); })) d.purpose = a.purpose == null ? 4 : Math.min(6, a.purpose + 1);
    return d;
  }

  /* ---------- matching ---------- */
  /* one group per question; a multi-pick question counts its best pick per way of living */
  function nudgeGroups(a) {
    var N = QUIZ.nudges, g = [];
    function grp(list) { list = list.filter(Boolean); if (list.length) g.push(list); }
    if (a["with"] != null) grp([N["with"][a["with"]]]);
    (a.life || []).forEach(function (i) { grp([N.life[i]]); });
    grp(picks(a.setting).map(function (i) { return N.setting[i]; }));
    grp(picks(a.hosts).map(function (i) { return N.hosts[i]; }));
    if (a.savings != null) grp([N.savings[a.savings]]);
    ["community", "keep", "pool"].forEach(function (k) { grp(picks(a[k]).map(function (i) { return N[k][i]; })); });
    if (a.give != null) grp([N.give[a.give]]);
    if (a.space != null && a.space <= 1) grp([N.space[0]]);
    if (a.space != null && a.space >= 5) grp([N.space[1]]);
    return g;
  }

  function matchAll(st) {
    var a = st.a, d = derive(a), groups = nudgeGroups(a), hopeQ = qById("hopes"), careFit = QUIZ.care.fit;
    var holdPicks = picks(a.holding).map(function (i) { return HK[i]; });
    return COLIVING_TYPES.map(function (t) {
      var sw = 0, sd = 0, inside = [], gaps = [];
      SPECTRA.forEach(function (k) {
        var x = pos(d[k]), r = rangeOf(t, k);
        if (x == null || !r) return;
        var w = st.h[k] ? 2 : 1, q = qById(k);
        var dd = q && q.oneWay ? Math.max(0, r[0] - x) : Math.max(0, r[0] - x, x - r[1]);
        sw += w; sd += w * dd * dd;
        if (a[k] == null) return;            /* only real answers become reasons, at their real value */
        var xr = pos(a[k]), dr = q && q.oneWay ? Math.max(0, r[0] - xr) : Math.max(0, r[0] - xr, xr - r[1]);
        if (dr === 0) inside.push({ k: k, x: xr, w: w });
        else gaps.push({ k: k, x: xr, d: dr, w: w, r: r });
      });
      var D = sw ? Math.sqrt(sd / sw) : 25;
      var score = 100 - D * 1.5, why = [];
      groups.forEach(function (list) {
        var best = null;
        list.forEach(function (n) { var v = n[t.slug] || 0; if (best === null || v > best.v) best = { v: v, txt: n.why }; });
        if (best && best.v) { score += best.v; if (best.v > 0) why.push(best); }
      });
      var hopeHits = [];
      (a.hopes || []).forEach(function (i, j) {
        var o = hopeQ.options[i], v = o && o.fit[t.slug] || 0;
        if (!v) return;
        var w = j < 3 ? [3, 2, 1][j] : 1;
        score += v * w; hopeHits.push({ v: v * w, j: j, txt: o.said });
      });
      var careHits = (a.care || []).filter(function (i) { return has(careFit[t.slug], i); });
      score += Math.min(3, careHits.length);
      var hold = setups(t, "holding"), dec = setups(t, "decisions");
      var holdHit = holdPicks.filter(function (h) { return hold.indexOf(h) >= 0; });
      if (holdHit.length) score += [3, 2, 1][Math.min(2, holdPicks.indexOf(holdHit[0]))];   /* ranked: first choice weighs most */
      var decHit = typeof a.decisions === "number" && dec.indexOf(DK[a.decisions]) >= 0 ? DK[a.decisions] : null;
      if (decHit) score += 2;
      if (a.own != null) {
        var ownish = hold.indexOf("own") >= 0 || hold.indexOf("shares") >= 0;
        if (a.own >= 5) score += ownish ? 3 : -4;
        if (a.own <= 1 && hold.indexOf("own") >= 0 && hold.indexOf("rent") < 0) score -= 3;
      }
      return { t: t, slug: t.slug, raw: score, match: Math.max(30, Math.min(99, Math.round(score))),
        inside: inside, gaps: gaps.sort(function (x, y) { return y.d * y.w - x.d * x.w; }),
        why: why.sort(function (x, y) { return y.v - x.v; }), hopeHits: hopeHits.sort(function (x, y) { return y.v - x.v || x.j - y.j; }),
        careHits: careHits, holdHit: holdHit, holdMiss: holdPicks.length && !holdHit.length ? hold : null, decHit: decHit };
    }).sort(function (x, y) { return y.raw - x.raw; });
  }

  /* "Fits because …": up to 3 reasons, each one a thing the person actually said */
  function reasons(r, st) {
    var a = st.a, L = QUIZ.letter, c = [];
    r.inside.forEach(function (s) {
      var q = qById(s.k);
      if (q && q.said) c.push({ w: s.w * Math.abs(s.x - 50) / 5, txt: q.said[band3(s.x)], spec: 1 });
    });
    if (r.hopeHits.length) c.push({ w: 10 + r.hopeHits[0].v / 3, txt: L.hopeSaid(joinList(r.hopeHits.slice(0, 2).map(function (h) { return h.txt; }))) });
    if (r.careHits.length) c.push({ w: 7 + r.careHits.length, txt: L.careSaid(joinList(r.careHits.slice(0, 2).map(function (i) { return lower(qById("care").options[i]); }))) });
    if (r.why.length) c.push({ w: 5 + r.why[0].v / 2, txt: r.why[0].txt });
    if (r.holdHit.length) c.push({ w: 6, txt: L.setupSaid.holding(L.holdingVerb[r.holdHit[0]]) });
    if (r.decHit) c.push({ w: 5, txt: L.setupSaid.decisions(L.decBy[r.decHit]) });
    c.sort(function (x, y) { return y.w - x.w; });
    var out = [], nSpec = 0;
    c.forEach(function (x) {
      if (out.length >= 3 || (x.spec && nSpec >= 2) || out.indexOf(x.txt) >= 0) return;
      if (x.spec) nSpec++;
      out.push(x.txt);
    });
    return out;
  }

  /* "Where it differs": the biggest gap between a real answer and the way of living */
  function differs(r, st) {
    var L = QUIZ.letter, best = null;
    r.gaps.some(function (g) {
      var q = qById(g.k);
      if (!q || !q.stops || g.d < 12) return false;
      if (g.k === "effort" && st.a.role !== 1) return false;   /* effort to start it only matters to founders */
      var mid = (g.r[0] + g.r[1]) / 2 / 100 * 6, theirs = stopLabel(q, mid), yours = stopLabel(q, st.a[g.k]);
      if (Math.abs(Math.round(mid) - st.a[g.k]) < 3 && g.d < 25) return false;
      best = { d: g.d, txt: L.differsLine(q.topic, lower(theirs), lower(yours)) };
      return true;
    });
    if (r.holdMiss && (!best || best.d < 20)) best = { d: 20, txt: L.differsHolding(L.holdingVerb[r.holdMiss[0]]) };
    return best ? best.txt : L.differsNone;
  }

  /* ---------- fit with living together ---------- */
  function fit(a) {
    var keys = ["recharge", "conflict", "share"], s = 0, n = 0;
    keys.forEach(function (k) { if (a[k] != null) { s += pos(a[k]); n++; } });
    if (typeof a.meals === "number") { s += pos(a.meals * 2); n++; }
    var v = n ? s / n : 60, F = QUIZ.letter.fit, i = 0;
    while (i < F.length - 1 && v < F[i].min) i++;
    return { value: Math.round(v), band: i };
  }

  /* ---------- building blocks, one row per area ---------- */
  function setup(st, top) {
    var a = st.a, d = derive(a), S = QUIZ.setup, B = S.because, V = TAG_VOCAB, rows = [], fam = top.t.family;
    var size = pos(a.size), time = pos(a.time), effort = pos(a.effort), eco = pos(d.ecoTech);
    var power = pos(a.power), auto = pos(a.autonomy);
    function n(v, dflt) { return v == null ? dflt : v; }

    // building: setting + kind + size + what's on site
    var setPicks = picks(a.setting).map(function (i) { return SET[i]; });
    var setting = setPicks[0];
    if (!setting) setting = ["ecovillage", "rural-coliving", "kibbutz"].indexOf(top.slug) >= 0 ? "countryside" : "city";
    var where = (setPicks.length ? setPicks : [setting]).map(function (s) { return s === "countryside" ? "the countryside" : s === "suburb" ? "the suburbs" : "the city"; });
    var bPicks = picks(a.building).map(function (i) { return BK[i]; }), bld, bBecause = "";
    if (bPicks.length) bld = bPicks[0];
    else if (n(time, 50) >= 67 && n(effort, 50) >= 50) { bld = "new"; bBecause = B.building["new"]; }
    else if (n(time, 50) < 50 || n(effort, 50) < 34) { bld = "converted"; bBecause = B.building.converted; }
    else { bld = "mixed"; bBecause = B.building.mixed; }
    var hPicks = picks(a.hosts).map(function (i) { return HO[i]; }), ho, hBecause = "";
    if (hPicks.length) ho = hPicks[0];
    else if (n(eco, 50) < 25 && setting === "countryside") { ho = "farm"; hBecause = B.hosts.farm; }
    else if (has(a.life, 2) || has(a.life, 5) || n(eco, 50) > 70) { ho = "mixed-use"; hBecause = B.hosts["mixed-use"]; }
    else { ho = "homes"; hBecause = B.hosts.homes; }
    var sz;
    if ((fam === "share-a-home" || fam === "flexible") && n(size, 30) < 50) sz = { img: "mini-size-small.webp", t: S.smallHousehold[0], p: S.smallHousehold[1] };
    else { var row = S.size.filter(function (r) { return n(size, 50) < r[0]; })[0]; sz = { img: "mini-size-" + row[1] + ".webp", t: row[2], p: row[3] }; }
    var kinds = (bPicks.length ? bPicks : [bld]).map(function (b) { return V.building.values[b].toLowerCase(); });
    rows.push({ area: "Building", img: "mini-building-" + bld + ".webp", pick: !!bPicks.length,
      title: sz.t + ", " + joinList(kinds).replace(/ and /g, " or ") + " in " + where.join(" or "),
      text: sz.p + " " + V.hosts.descs[ho],
      because: bBecause || hBecause });

    // social life
    var mealsQ = qById("meals"), meals, mBecause = "";
    if (typeof a.meals === "number") meals = a.meals;
    else if (has(a.community, 1)) { meals = 2; mBecause = B.meals.community; }
    else if (gateOf(a) === "shared") { meals = 2; mBecause = B.meals.shared; }
    else { meals = 1; mBecause = B.mealsNone; }
    var mo = mealsQ.options[meals];
    rows.push({ area: "Social life", img: "icon-social.webp", pick: typeof a.meals === "number",
      title: mo === "Now and then" ? "Dinner together now and then" : "Dinner together " + mo.toLowerCase(),
      text: S.meals[meals], because: mBecause });

    // decisions
    var dec, dBecause = "", decPick = typeof a.decisions === "number";
    if (decPick) dec = DK[a.decisions];
    else if (n(power, 60) < 34) { dec = "founder"; dBecause = B.decisions.founder; }
    else if (a.recharge != null && a.recharge <= 1) { dec = "advice"; dBecause = B.decisions.advice; }
    else if ((a.conflict != null && a.conflict >= 4) || n(size, 50) >= 67) { dec = "consent"; dBecause = B.decisions.consent; }
    else { dec = setups(top.t, "decisions")[0] || "consent"; dBecause = B.decisions.type; }
    var gov = n(size, 50) < 34 && dec !== "founder" ? S.govStyle.small : n(size, 50) >= 67 ? S.govStyle.large : "";
    rows.push({ area: "Decisions", img: "mini-decisions-" + dec + ".webp", pick: decPick,
      title: V.decisions.values[dec], text: S.decisions[dec] + (gov ? " " + gov : ""), because: dBecause });

    // your home + legal
    var hp = picks(a.holding).map(function (i) { return HK[i]; }), hold, hoBecause = "";
    if (hp.length) { var fits = setups(top.t, "holding"); hold = hp.filter(function (h) { return fits.indexOf(h) >= 0; })[0] || hp[0]; }
    else if (n(eco, 50) < 25 && n(time, 50) >= 67 && n(auto, 50) >= 60) { hold = "use-rights"; hoBecause = B.holding["use-rights"]; }
    else if (a.own != null && a.own >= 5) { hold = a.savings === 2 || a.savings == null ? "own" : "shares"; hoBecause = B.holding.own; }
    else if (a.savings === 1) { hold = "shares"; hoBecause = B.holding.shares; }
    else if (a.own != null && a.own <= 1) { hold = n(time, 50) < 50 ? "membership" : "rent"; hoBecause = B.holding[hold]; }
    else { hold = setups(top.t, "holding")[0] || "rent"; hoBecause = B.holding.type; }
    var legal = S.holdingLegal[hold];
    rows.push({ area: "Legal and your home", img: "mini-holding-" + hold + ".webp", pick: !!hp.length,
      title: V.holding.values[hold] + " · " + V.legal.values[legal], text: S.holding[hold], because: hoBecause });

    // money
    var money, moBecause;
    if (a.savings === 1 || a.savings === 2) { money = "members"; moBecause = B.money.members; }
    else if (a.savings === 3) { money = "patron"; moBecause = B.money.patron; }
    else if (a.savings === 0) {
      money = has(a.hopes, 1) && n(time, 50) >= 50 ? "public" : "operator";
      moBecause = B.money[money];
    }
    else { money = hold === "own" || hold === "shares" ? "members" : "operator"; moBecause = B.money.derived; }
    var mImg = { members: "mini-money-members.webp", "public": "mini-money-public.webp", patron: "mini-money-patron.webp", operator: "mini-money-investors.webp" }[money];
    var mTitle = { members: V.money.values.members, "public": V.money.values["public"], patron: V.money.values.patron, operator: "Carried by an operator or co-op" }[money];
    rows.push({ area: "Money", img: mImg, pick: false, title: mTitle, text: S.money[money], because: moBecause });

    return { rows: rows, setting: setting };
  }

  /* ---------- real places, each with a reason ---------- */
  var REGION = [
    [/Montr|Qu[eé]bec|Lachine|Neuville/i, [0, 1]],
    [/BC|ON\b|Vancouver|Ottawa|Langley/i, [1]],
    [/California|New York|Portland|Michigan|AZ|Bay Area|San Francisco|USA|CA\b|OR\b/i, [2]],
    [/Denmark|UK|Zurich|Netherlands|Berlin|Spain|Germany|Scotland|Portugal|Sweden|Brussels|London|Europe|Montenegro/i, [3]]
  ];
  function regions(place) {
    for (var i = 0; i < REGION.length; i++) if (REGION[i][0].test(place || "")) return REGION[i][1];
    return [4];
  }
  function places(st, fits) {
    var a = st.a, base = a.base, W = QUIZ.letter.placeWhy, Lt = QUIZ.letter;
    var setPicks = picks(a.setting).map(function (i) { return SET[i]; });
    var holdPicks = picks(a.holding).map(function (i) { return HK[i]; });
    var dec = typeof a.decisions === "number" ? DK[a.decisions] : null;
    var forWho = (a.life || []).map(function (i) { return LIFE_FOR[i]; }).filter(Boolean);
    if (a["with"] === 2) forWho.push("families");
    function hits(p) {
      var tg = p.tags || {}, su = p.setup || {}, h = {};
      h.setting = setPicks.filter(function (s) { return has(tg.setting, s); })[0];
      h.holding = holdPicks.filter(function (x) { return has(su.holding, x); })[0];
      h.decisions = dec && has(su.decisions, dec) ? dec : null;
      h.forWho = forWho.filter(function (f) { return has(tg.forWho, f); })[0];
      h.near = base != null && regions(p.place).indexOf(base) >= 0;
      return h;
    }
    function rank(slug) {
      return COLIVING_PROJECTS.filter(function (p) { return p.kind === "place" && p.type === slug; }).map(function (p) {
        var h = hits(p), s = 0;
        if (h.near) s += 3; if (h.setting) s += 2; if (p.img) s += 1.5;
        if (h.holding) s += 1; if (h.decisions) s += 1; if (h.forWho) s += 1;
        return { p: p, s: s, h: h };
      }).sort(function (x, y) { return y.s - x.s; });
    }
    var lists = fits.map(function (f) { return rank(f.slug); }), out = [], seen = {};
    function take(x, f) { if (x && !seen[x.p.id]) { seen[x.p.id] = 1; out.push({ x: x, f: f }); } }
    lists.forEach(function (l, i) { take(l[0], fits[i]); });
    for (var i = 1; out.length < 3 && i < lists[0].length; i++) take(lists[0][i], fits[0]);
    return out.map(function (o) {
      var h = o.x.h, bits = [W.fit(o.f.t.short || o.f.t.name)];
      if (h.setting) bits.push(W.setting[h.setting]);
      if (h.forWho && W.forWho[h.forWho]) bits.push(W.forWho[h.forWho]);
      if (h.holding) bits.push(W.holding(Lt.holdingVerb[h.holding]));
      else if (h.decisions) bits.push(W.decisions(Lt.decBy[h.decisions]));
      if (h.near) bits.push(W.near);
      /* "Cohousing, one of your close fits. In a city like you want · close to you" */
      var tail = bits.slice(1, 4).map(function (b, i) { return i ? b : b.charAt(0).toUpperCase() + b.slice(1); });
      return { p: o.x.p, reason: bits[0] + "." + (tail.length ? " " + tail.join(" · ") : "") };
    });
  }

  /* ---------- things to know ---------- */
  function know(st, top, fitBand) {
    var a = st.a, f = {
      rechargeLow: a.recharge != null && a.recharge <= 2, rechargeHigh: a.recharge != null && a.recharge >= 4,
      conflictLow: a.conflict != null && a.conflict <= 2, conflictHigh: a.conflict != null && a.conflict >= 4,
      gateOwn: gateOf(a) === "own", gateShared: gateOf(a) === "shared",
      poolIncome: has(a.pool, 3), valuesPick: has(a.community, 3), giveLow: a.give === 0,
      comfortHigh: a.space != null && a.space >= 5, mealsLove: has(a.community, 1) || a.meals === 3,
      timeHigh: a.time != null && a.time >= 5, shortStayType: top.t.ranges.time[1] < 60,
      start: a.role === 1, effortLow: a.effort != null && a.effort <= 1, hoursLow: a.hours === 0,
      ownHigh: a.own != null && a.own >= 5, shareHigh: a.share != null && a.share >= 4, fitBand: fitBand
    };
    var out = [], ids = {};
    QUIZ.know.forEach(function (k) {
      if (out.length >= 3) return;
      if (k.id === "quiet" && ids["quiet-belong"]) return;
      if (k.id === "start-soon" && ids.marathon) return;
      var ok = k.when === "always" || new Function("f", "return " + k.when.replace(/[a-zA-Z]+/g, "f.$&") + ";")(f);
      if (k.fallback && out.length >= 2) ok = false;
      if (ok) { out.push(k); ids[k.id] = 1; }
    });
    out.push(QUIZ.knowLast);
    return out;
  }

  /* ---------- your pin ---------- */
  function pin(st) {
    var a = derive(st.a), c = MAP_KEYS.filter(function (k) { return a[k] != null; })
      .sort(function (x, y) { return Math.abs(pos(a[y]) - 50) * (st.h[y] ? 1.2 : 1) - Math.abs(pos(a[x]) - 50) * (st.h[x] ? 1.2 : 1); });
    var x = c[0] || "ecoTech", y = c[1] || (x === "autonomy" ? "ecoTech" : "autonomy");
    var you = {};
    MAP_KEYS.forEach(function (k) { you[k] = a[k] == null ? 50 : pos(a[k]); });
    var link = "map.html?you=" + MAP_KEYS.map(function (k) { return a[k] == null ? "" : a[k]; }).join(",") + "&x=" + x + "&y=" + y + "#map";
    return { x: x, y: y, you: you, link: link };
  }

  /* ---------- what matters to you, reflected back ---------- */
  function mirror(st) {
    var a = st.a, hq = qById("hopes"), cq = qById("care"), stand = [], G = QUIZ.steps.filter(function (s) { return s.gate; })[0], g = gateOf(a);
    var around = [];
    ["community", "keep", "pool"].forEach(function (k) { if (inGate(qById(k), a)) picks(a[k]).forEach(function (i) { var o = qById(k).options[i]; around.push(o.t || o); }); });
    QUIZ.steps.filter(function (s) { return s.id === "values" || s.gate; }).forEach(function (S) { S.questions.forEach(function (q) {
      if (q.kind !== "slider" || !q.stops) return;
      if (a[q.id] != null) stand.push({ k: q.id, topic: q.topic, label: stopLabel(q, a[q.id]), x: pos(a[q.id]), heart: !!st.h[q.id] });
      else if ((st.o || {})[q.id]) stand.push({ k: q.id, topic: q.topic, label: QUIZ.open.one, x: null, heart: false });
    }); });
    return {
      hopes: (a.hopes || []).map(function (i, j) { var o = hq.options[i]; return { t: o.t, img: o.img, rank: j < 3 ? j + 1 : 0 }; }),
      care: (a.care || []).map(function (i) { return cq.options[i]; }),
      stand: stand,
      gate: { t: G.gates[g].title, img: G.gates[g].img }, around: around
    };
  }

  function result(st) {
    st = clean(st);
    var ranked = matchAll(st), top = ranked[0], a = st.a, L = QUIZ.letter;
    var F = fit(a), su = setup(st, top);
    var fitText = L.fit[F.band];
    var fits = ranked.slice(0, 3).map(function (r) {
      return { r: r, t: r.t, slug: r.slug, match: r.match, words: L.strength.filter(function (s) { return r.match >= s[0]; })[0][1],
        because: reasons(r, st), differs: differs(r, st) };
    });
    var people = (a.life || []).slice(0, 2).map(function (i) { return L.people[i]; });
    if (!people.length && a["with"] != null && L.peopleWith[a["with"]]) people = [L.peopleWith[a["with"]]];
    var full = a.hours === 0 && (has(a.life, 2) || has(a.life, 3) || has(a.life, 4));
    return {
      name: a.name || "", ranked: ranked, top: top, fits: fits, mirror: mirror(st),
      fit: F, fitText: { h: fitText.h, p: (F.band === 3 && top.t.family !== "own-home" && fitText.alt) ? fitText.alt : fitText.p },
      fullLife: full, people: people, blocks: su.rows, places: places(st, fits),
      know: know(st, top, F.band), pin: pin(st), role: a.role == null ? 2 : a.role
    };
  }

  return { encode: encode, decode: decode, result: result, matchAll: matchAll, allQuestions: allQuestions, derive: derive,
    stopLabel: stopLabel, qById: qById, MAP_KEYS: MAP_KEYS, isMulti: isMulti, hasOpen: hasOpen,
    gateOf: gateOf, inGate: inGate, clean: clean };
})();
if (typeof module !== "undefined") module.exports = QuizScore;
