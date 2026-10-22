/* =====================================================================
   QUIZ SCORING (quiz.html). Pure functions, no DOM, so it can be
   tested in node (_tools/quiz-sim.js). Needs map-data.js,
   projects-data.js and quiz-data.js loaded first.
   How it works, in plain words: FOR PIERRE-ANTOINE/QUIZ-CONTENT-DRAFT.md §4.
   ===================================================================== */
var QuizScore = (function () {
  var MAP_KEYS = ["share", "size", "time", "power", "autonomy", "ecoTech", "effort"];
  var BUDGET_POS = [15, 45, 85];

  function allQuestions() {
    var out = [];
    QUIZ.steps.forEach(function (s) { s.questions.forEach(function (q) { out.push(q); }); });
    return out;
  }
  function pos(v) { return v == null ? null : v / 6 * 100; }
  function band3(x) { return x < 34 ? 0 : x > 66 ? 2 : 1; }
  function typeBy(slug) { return COLIVING_TYPES.filter(function (t) { return t.slug === slug; })[0]; }
  function rangeOf(t, k) { return (t.ranges && t.ranges[k]) || (t.backend && t.backend[k]) || null; }
  function setups(t, field) {
    var o = [];
    (t.typicalSetups || []).forEach(function (s) { (s[field] || []).forEach(function (v) { if (o.indexOf(v) < 0) o.push(v); }); });
    return o;
  }
  function has(arr, i) { return Array.isArray(arr) && arr.indexOf(i) >= 0; }

  /* ---------- share link: one token per question, in order ---------- */
  function encode(st) {
    var toks = allQuestions().map(function (q) {
      var v = st.a[q.id];
      if (q.kind === "slider") return v == null ? "" : String(v) + (st.h[q.id] ? "h" : "");
      if (q.kind === "chips" && q.multi) { var m = 0; (v || []).forEach(function (i) { m |= 1 << i; }); return m ? m.toString(36) : ""; }
      if (q.kind === "text") return v ? encodeURIComponent(v).replace(/\./g, "%2E") : "";
      if (v === "help") return "x";
      return v == null ? "" : String(v);
    });
    return "q=" + QUIZ.version + "." + toks.join(".");
  }
  function decode(hash) {
    var m = /q=(\d+)\.([^&]*)/.exec(hash || "");
    if (!m) return null;
    var toks = m[2].split("."), st = { a: {}, h: {} };
    allQuestions().forEach(function (q, i) {
      var t = toks[i];
      if (t == null || t === "") return;
      if (q.kind === "slider") {
        var n = parseInt(t, 10);
        if (n >= 0 && n <= 6) { st.a[q.id] = n; if (/h/.test(t)) st.h[q.id] = true; }
      } else if (q.kind === "chips" && q.multi) {
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

  /* ---------- matching ---------- */
  function nudgesFor(a) {
    var N = QUIZ.nudges, list = [];
    function add(n) { if (n) list.push(n); }
    if (a["with"] != null) add(N["with"][a["with"]]);
    (a.life || []).forEach(function (i) { add(N.life[i]); });
    if (typeof a.setting === "number") add(N.setting[a.setting]);
    if (typeof a.hosts === "number") add(N.hosts[a.hosts]);
    if (a.savings != null) add(N.savings[a.savings]);
    return list;
  }

  function matchAll(st) {
    var a = st.a, nudges = nudgesFor(a);
    var spectra = MAP_KEYS.concat(["purpose"]);
    return COLIVING_TYPES.map(function (t) {
      var sw = 0, sd = 0, inside = [];
      spectra.forEach(function (k) {
        var x = pos(a[k]), r = rangeOf(t, k);
        if (x == null || !r) return;
        var w = st.h[k] ? 2 : 1;
        var q = allQuestions().filter(function (qq) { return qq.id === k; })[0];
        var d = q.oneWay ? Math.max(0, r[0] - x) : Math.max(0, r[0] - x, x - r[1]);
        sw += w; sd += w * d * d;
        if (d === 0) inside.push({ k: k, x: x, w: w });
      });
      if (a.budget != null && t.backend && t.backend.cost) {
        var dc = Math.max(0, t.backend.cost[0] - BUDGET_POS[a.budget]);
        sw += 1; sd += dc * dc;
      }
      var D = sw ? Math.sqrt(sd / sw) : 25;
      var score = 100 - D * 1.5, why = [];
      nudges.forEach(function (n) {
        var v = n[t.slug] || 0;
        if (v) { score += v; if (v > 0) why.push({ v: v, txt: n.why }); }
      });
      /* set-up compatibility */
      var hold = setups(t, "holding"), dec = setups(t, "decisions");
      var HK = ["own", "shares", "rent", "membership", "use-rights"], DK = ["founder", "vote", "consensus", "consent", "advice"];
      if (typeof a.holding === "number" && hold.indexOf(HK[a.holding]) >= 0) score += 3;
      if (typeof a.decisions === "number" && dec.indexOf(DK[a.decisions]) >= 0) score += 2;
      if (a.own != null) {
        var ownish = hold.indexOf("own") >= 0 || hold.indexOf("shares") >= 0;
        if (a.own >= 5) score += ownish ? 3 : -4;
        if (a.own <= 1 && hold.indexOf("own") >= 0 && hold.indexOf("rent") < 0) score -= 3;
      }
      return { t: t, slug: t.slug, raw: score, match: Math.max(30, Math.min(99, Math.round(score))), inside: inside,
        why: why.sort(function (x, y) { return y.v - x.v; }) };
    }).sort(function (x, y) { return y.raw - x.raw; });
  }

  function reasons(r) {
    var qs = allQuestions(), out = [];
    var ranked = r.inside.slice().sort(function (x, y) { return y.w * Math.abs(y.x - 50) - x.w * Math.abs(x.x - 50); });
    var nud = r.why[0];
    var nSpec = nud ? 2 : 3;
    ranked.slice(0, nSpec).forEach(function (s) {
      var q = qs.filter(function (qq) { return qq.id === s.k; })[0];
      out.push(q.said[band3(s.x)]);
    });
    if (nud) out.push(nud.txt);
    return out;
  }

  function rather(top, second, a) {
    var best = null, bestD = -1;
    MAP_KEYS.forEach(function (k) {
      var r1 = top.t.ranges[k], r2 = second.t.ranges[k];
      var d = (r2[0] + r2[1]) / 2 - (r1[0] + r1[1]) / 2;
      var wt = a[k] != null ? 1 : 0.6;
      if (Math.abs(d) * wt > bestD) { bestD = Math.abs(d) * wt; best = { k: k, dir: d < 0 ? 0 : 1 }; }
    });
    return QUIZ.letter.rather[best.k][best.dir];
  }

  /* ---------- fit with living together ---------- */
  function fit(a) {
    var keys = ["recharge", "conflict", "dishes", "cook", "faces", "share"], s = 0, n = 0;
    keys.forEach(function (k) { if (a[k] != null) { s += pos(a[k]); n++; } });
    var v = n ? s / n : 60, F = QUIZ.letter.fit, i = 0;
    while (i < F.length - 1 && v < F[i].min) i++;
    return { value: Math.round(v), band: i };
  }

  /* ---------- set-up, one row per area ---------- */
  function setup(st, top) {
    var a = st.a, S = QUIZ.setup, V = TAG_VOCAB, rows = [], fam = top.t.family;
    var size = pos(a.size), time = pos(a.time), effort = pos(a.effort), eco = pos(a.ecoTech);
    var power = pos(a.power), auto = pos(a.autonomy);
    function n(v, d) { return v == null ? d : v; }

    // building: setting + kind + size + what's on site
    var SET = ["city", "suburb", "countryside"], setting = typeof a.setting === "number" && a.setting < 3 ? SET[a.setting] : null;
    if (!setting) setting = ["ecovillage", "rural-coliving", "kibbutz"].indexOf(top.slug) >= 0 ? "countryside" : "city";
    var BK = ["new", "converted", "mixed"], bld, bldPick = typeof a.building === "number";
    if (bldPick) bld = BK[a.building];
    else if (n(time, 50) >= 67 && n(effort, 50) >= 50) bld = "new";
    else if (n(time, 50) < 50 || n(effort, 50) < 34) bld = "converted";
    else bld = "mixed";
    var HO = ["homes", "mixed-use", "farm"], ho, hoPick = typeof a.hosts === "number";
    if (hoPick) ho = HO[a.hosts];
    else if (n(eco, 50) < 25 && setting === "countryside") ho = "farm";
    else if (has(a.life, 2) || has(a.life, 5) || n(eco, 50) > 70) ho = "mixed-use";
    else ho = "homes";
    var sz;
    if ((fam === "share-a-home" || fam === "flexible") && n(size, 30) < 50) sz = { img: "mini-size-small.webp", t: S.smallHousehold[0], p: S.smallHousehold[1] };
    else { var row = S.size.filter(function (r) { return n(size, 50) < r[0]; })[0]; sz = { img: "mini-size-" + row[1] + ".webp", t: row[2], p: row[3] }; }
    rows.push({ area: "Building", img: "mini-building-" + bld + ".webp", pick: bldPick,
      title: sz.t + ", " + V.building.values[bld].toLowerCase() + " in the " + (setting === "countryside" ? "countryside" : setting === "suburb" ? "suburbs" : "city"),
      text: sz.p + " " + V.hosts.descs[ho] });

    // social life
    var meals = typeof a.meals === "number" ? a.meals : (a.cook == null ? 1 : [0, 0, 1, 1, 2, 2, 3][a.cook]);
    rows.push({ area: "Social life", img: "icon-social.webp", pick: typeof a.meals === "number",
      title: QUIZ.steps[3].questions[2].options[meals] === "Now and then" ? "Dinner together now and then" : "Dinner together " + QUIZ.steps[3].questions[2].options[meals].toLowerCase(),
      text: S.meals[meals] + (a.rhythm != null && a.rhythm >= 4 ? " " + S.mealsFlex : "") });

    // decisions
    var DK = ["founder", "vote", "consensus", "consent", "advice"], dec, decPick = typeof a.decisions === "number";
    if (decPick) dec = DK[a.decisions];
    else if (n(power, 60) < 34) dec = "founder";
    else if (a.meetings != null && a.meetings <= 2) dec = "advice";
    else if ((a.meetings != null && a.meetings >= 4 && n(a.conflict, 3) >= 4) || n(size, 50) >= 67) dec = "consent";
    else dec = setups(top.t, "decisions")[0] || "consent";
    var gov = n(size, 50) < 34 && dec !== "founder" ? S.govStyle.small : n(size, 50) >= 67 ? S.govStyle.large : "";
    rows.push({ area: "Decisions", img: "mini-decisions-" + dec + ".webp", pick: decPick,
      title: V.decisions.values[dec], text: S.decisions[dec] + (gov ? " " + gov : "") });

    // your home + legal
    var HK = ["own", "shares", "rent", "membership", "use-rights"], hold, holdPick = typeof a.holding === "number";
    if (holdPick) hold = HK[a.holding];
    else if (n(eco, 50) < 25 && n(time, 50) >= 67 && n(auto, 50) >= 60) hold = "use-rights";
    else if (a.own != null && a.own >= 5) hold = a.savings === 2 || a.savings == null ? "own" : "shares";
    else if (a.savings === 1) hold = "shares";
    else if (a.own != null && a.own <= 1) hold = n(time, 50) < 50 ? "membership" : "rent";
    else hold = setups(top.t, "holding")[0] || "rent";
    var legal = S.holdingLegal[hold];
    rows.push({ area: "Legal and your home", img: "mini-holding-" + hold + ".webp", pick: holdPick,
      title: V.holding.values[hold] + " · " + V.legal.values[legal], text: S.holding[hold] });

    // money
    var money;
    if (a.savings === 1 || a.savings === 2) money = "members";
    else if (a.savings === 3) money = "patron";
    else if (a.savings === 0) money = a.budget === 0 && n(time, 50) >= 50 ? "public" : "operator";
    else money = hold === "own" || hold === "shares" ? "members" : "operator";
    var mImg = { members: "mini-money-members.webp", public: "mini-money-public.webp", patron: "mini-money-patron.webp", operator: "mini-money-investors.webp" }[money];
    var mTitle = { members: V.money.values.members, public: V.money.values["public"], patron: V.money.values.patron, operator: "Carried by an operator or co-op" }[money];
    rows.push({ area: "Money", img: mImg, pick: a.savings != null, title: mTitle, text: S.money[money] });

    return { rows: rows, setting: setting };
  }

  /* ---------- real places ---------- */
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
  function places(st, top, second, setting) {
    var base = st.a.base;
    function rank(slug) {
      return COLIVING_PROJECTS.filter(function (p) { return p.kind === "place" && p.type === slug; }).map(function (p) {
        var s = 0;
        if (base != null && regions(p.place).indexOf(base) >= 0) s += 3;
        if (p.tags && p.tags.setting && p.tags.setting.indexOf(setting) >= 0) s += 2;
        if (p.img) s += 1.5;
        return { p: p, s: s };
      }).sort(function (x, y) { return y.s - x.s; }).map(function (x) { return x.p; });
    }
    var A = rank(top.slug), B = rank(second.slug), out = A.slice(0, 2);
    if (B.length) out.push(B[0]);
    var i = 2; while (out.length < 3 && i < A.length) out.push(A[i++]);
    return out;
  }

  /* ---------- things to know ---------- */
  function know(st, top, fitBand) {
    var a = st.a, f = {
      rechargeLow: a.recharge != null && a.recharge <= 2, rechargeHigh: a.recharge != null && a.recharge >= 4,
      conflictLow: a.conflict != null && a.conflict <= 2, conflictHigh: a.conflict != null && a.conflict >= 4,
      meetingsLow: a.meetings != null && a.meetings <= 2, meetingsHigh: a.meetings != null && a.meetings >= 5,
      dishesLow: a.dishes != null && a.dishes <= 1, cookHigh: a.cook != null && a.cook >= 5,
      facesLow: a.faces != null && a.faces <= 2, shortStayType: top.t.ranges.time[1] < 60,
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
    var a = st.a, c = MAP_KEYS.filter(function (k) { return a[k] != null; })
      .sort(function (x, y) { return Math.abs(pos(a[y]) - 50) * (st.h[y] ? 1.2 : 1) - Math.abs(pos(a[x]) - 50) * (st.h[x] ? 1.2 : 1); });
    var x = c[0] || "ecoTech", y = c[1] || (x === "autonomy" ? "ecoTech" : "autonomy");
    var you = {};
    MAP_KEYS.forEach(function (k) { you[k] = a[k] == null ? 50 : pos(a[k]); });
    var link = "map.html?you=" + MAP_KEYS.map(function (k) { return a[k] == null ? "" : a[k]; }).join(",") + "&x=" + x + "&y=" + y + "#map";
    return { x: x, y: y, you: you, link: link };
  }

  function result(st) {
    var ranked = matchAll(st), top = ranked[0], second = ranked[1], a = st.a;
    var F = fit(a), su = setup(st, top);
    var fitText = QUIZ.letter.fit[F.band];
    var peopleIdx = (a.life || []).slice(0, 2);
    var people = peopleIdx.map(function (i) { return QUIZ.letter.people[i]; });
    if (!people.length && a["with"] != null && QUIZ.letter.peopleWith[a["with"]]) people = [QUIZ.letter.peopleWith[a["with"]]];
    var full = a.hours === 0 && (has(a.life, 2) || has(a.life, 3) || has(a.life, 4));
    return {
      name: a.name || "", ranked: ranked, top: top, second: second,
      strength: QUIZ.letter.strength.filter(function (s) { return top.match >= s[0]; })[0][1],
      reasons: reasons(top), rather: rather(top, second, a),
      fit: F, fitText: { h: fitText.h, p: (F.band === 3 && top.t.family !== "own-home" && fitText.alt) ? fitText.alt : fitText.p },
      fullLife: full, people: people, setup: su.rows, places: places(st, top, second, su.setting),
      know: know(st, top, F.band), pin: pin(st), role: a.role == null ? 2 : a.role
    };
  }

  return { encode: encode, decode: decode, result: result, matchAll: matchAll, allQuestions: allQuestions, MAP_KEYS: MAP_KEYS };
})();
if (typeof module !== "undefined") module.exports = QuizScore;
