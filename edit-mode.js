/* =====================================================================
   EDIT MODE v2 — visual, in-place copy editing for P-A.
   Loaded on every page via site-nav.js; activates ONLY on file:// or
   localhost (never on a deployed site).

   WHAT CHANGED FROM v1 (which silently lost edits):
   - AUTO-SAVES every keystroke into the browser (localStorage), per page.
     Edits survive closing the tab, navigating away, or a crash.
   - RESTORES saved edits automatically on every page load — your text
     stays edited as you move around the site.
   - "Copy all edits" uses the clipboard (works on file://, unlike the old
     blocked download) and only says "Copied!" when it truly succeeded.
   - Gathers edits from EVERY page at once, so one copy hands over the lot.
   - Honest status: it never claims saved/copied unless it actually happened.

   Recovery for Claude if the clipboard is ever unavailable: every edit is
   in localStorage under keys prefixed  pa-site-edits::  — readable straight
   from Chrome's Local Storage on disk, no browser needed.

   Apply back into source:  node _tools/apply-edits.mjs <file.json>  (or paste
   the copied JSON into a file first). Deterministic, no AI.
   ===================================================================== */
(function () {
  "use strict";
  var isLocal = location.protocol === "file:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if (!isLocal) return;

  var KEY_PREFIX = "pa-site-edits::";
  var PAGE = (location.pathname.split("/").pop() || "index.html");
  var STORE_KEY = KEY_PREFIX + PAGE;

  var editing = false;
  var uid = 0;
  var saveTimer = null;

  var CSS = "" +
    ".pa-editbtn{position:fixed;left:clamp(14px,2.2vw,26px);bottom:clamp(14px,2.6vh,26px);z-index:9990;width:46px;height:46px;border-radius:50%;border:1.5px solid rgba(34,48,31,.35);background:rgba(255,253,248,.94);color:#22301f;font-size:1.05rem;cursor:pointer;box-shadow:0 12px 30px -14px rgba(34,48,31,.45);opacity:.6;transition:opacity .25s,transform .25s}" +
    ".pa-editbtn:hover{opacity:1;transform:translateY(-2px)}" +
    ".pa-editbtn.on{background:#3c6b32;color:#fff;border-color:#3c6b32;opacity:1}" +
    ".pa-editbtn.dot::after{content:'';position:absolute;top:6px;right:6px;width:9px;height:9px;border-radius:50%;background:#d99a3d;border:2px solid #fffdf8}" +
    ".pa-editbar{position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:9991;display:none;align-items:center;gap:12px;background:#22301f;color:#f6f2e7;border-radius:99px;padding:10px 12px 10px 20px;font-family:'Switzer',system-ui,sans-serif;font-size:.8rem;box-shadow:0 18px 44px -14px rgba(0,0,0,.5);max-width:94vw;flex-wrap:wrap;justify-content:center}" +
    ".pa-editbar.on{display:flex}" +
    ".pa-editbar b{color:#e9b45f}" +
    ".pa-editbar .hint{opacity:.65}" +
    ".pa-editbar button{font:inherit;font-weight:700;border:0;border-radius:99px;padding:8px 15px;cursor:pointer}" +
    ".pa-editbar .exp{background:#5c9e4a;color:#fff}" +
    ".pa-editbar .exp:hover{background:#6fb35c}" +
    ".pa-editbar .dl{background:transparent;color:#f6f2e7;border:1px solid rgba(246,242,231,.4)}" +
    ".pa-editbar .dis{background:transparent;color:#f6b0a0;border:1px solid rgba(246,176,160,.4)}" +
    "body.pa-editing [data-pa-edit]{outline:1.5px dashed rgba(92,158,74,.55);outline-offset:3px;cursor:text;min-height:1em}" +
    "body.pa-editing [data-pa-edit]:hover{outline-color:#5c9e4a;background:rgba(92,158,74,.07)}" +
    "body.pa-editing [data-pa-edit]:focus{outline:2px solid #d99a3d;background:rgba(217,154,61,.08)}" +
    "body.pa-editing [data-pa-edit].pa-dirty{outline-color:#d99a3d;outline-style:solid}" +
    "body.pa-editing a{cursor:text}";

  var INLINE = { EM: 1, STRONG: 1, B: 1, I: 1, U: 1, SPAN: 1, A: 1, BR: 1, SMALL: 1, SUP: 1, SUB: 1, MARK: 1 };
  var SELECTOR = "h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,dt,dd,summary,caption,span,a,button";

  function editableCandidate(el) {
    if (el.closest(".pa-editbar,.pa-editbtn,script,style")) return false;
    if (!el.innerText || !el.innerText.trim()) return false;
    for (var i = 0; i < el.children.length; i++) {
      if (!INLINE[el.children[i].tagName]) return false;
    }
    if (el.parentElement && el.parentElement.closest("[data-pa-edit]")) return false;
    return true;
  }

  /* mark editable blocks + record their ORIGINAL (source) text — runs on load,
     with NO contenteditable, so restore has anchors even outside edit mode */
  function scanEditables() {
    document.querySelectorAll(SELECTOR).forEach(function (el) {
      if (el.hasAttribute("data-pa-edit")) return;
      if (!editableCandidate(el)) return;
      el.setAttribute("data-pa-edit", ++uid);
      el.setAttribute("spellcheck", "false");
      if (el.dataset.paOrig == null) el.dataset.paOrig = el.innerText;
    });
  }
  function enableEditing() {
    document.querySelectorAll("[data-pa-edit]").forEach(function (el) {
      el.setAttribute("contenteditable", "plaintext-only");
      if (el.contentEditable !== "plaintext-only") el.setAttribute("contenteditable", "true");
    });
  }
  function disableEditing() {
    document.querySelectorAll("[data-pa-edit]").forEach(function (el) { el.removeAttribute("contenteditable"); });
  }

  /* current page's changes, from live DOM */
  function collect() {
    var out = [];
    document.querySelectorAll("[data-pa-edit]").forEach(function (el) {
      var orig = el.dataset.paOrig, now = el.innerText;
      if (orig != null && orig.trim() && now.trim() !== orig.trim()) {
        out.push({ original: orig, edited: now });
      }
    });
    return out;
  }

  /* ---- persistence ---- */
  function save() {
    var changes = collect();
    try {
      if (changes.length) {
        localStorage.setItem(STORE_KEY, JSON.stringify({ page: PAGE, savedAt: new Date().toISOString(), changes: changes }));
      } else {
        localStorage.removeItem(STORE_KEY);
      }
    } catch (e) { /* storage full/blocked — DOM still holds edits this session */ }
    refreshCount();
    markDot();
  }
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 400); }

  /* re-apply this page's saved edits onto the DOM (called on load) */
  function restore() {
    var raw;
    try { raw = localStorage.getItem(STORE_KEY); } catch (e) { return 0; }
    if (!raw) return 0;
    var data; try { data = JSON.parse(raw); } catch (e) { return 0; }
    var applied = 0;
    (data.changes || []).forEach(function (ch) {
      var els = document.querySelectorAll("[data-pa-edit]");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if ((el.dataset.paOrig || "").trim() === (ch.original || "").trim() && el.innerText.trim() === (el.dataset.paOrig || "").trim()) {
          el.innerText = ch.edited;
          el.classList.add("pa-dirty");
          applied++;
          break;
        }
      }
    });
    return applied;
  }

  /* gather edits from EVERY page held in storage */
  function gatherAll() {
    var all = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(KEY_PREFIX) === 0) {
          try { var d = JSON.parse(localStorage.getItem(k)); if (d && d.changes && d.changes.length) all.push(d); } catch (e) {}
        }
      }
    } catch (e) {}
    return all;
  }
  function totalCount() { return gatherAll().reduce(function (n, d) { return n + d.changes.length; }, 0); }

  function refreshCount() {
    if (!bar) return;
    var here = collect().length, all = gatherAll();
    var pages = all.length, total = all.reduce(function (n, d) { return n + d.changes.length; }, 0);
    bar.querySelector(".cnt").innerHTML = "<b>" + here + "</b> on this page &middot; <b>" + total + "</b> saved across <b>" + pages + "</b> page" + (pages === 1 ? "" : "s");
  }
  function markDot() {
    if (btn) btn.classList.toggle("dot", totalCount() > 0);
  }

  /* ---- copy / download ---- */
  function copyAll() {
    var all = gatherAll();
    if (!all.length) { flash("Nothing to copy yet — edit some text first."); return; }
    var text = JSON.stringify(all.length === 1 ? all[0] : all, null, 2);
    var ok = function () { flash("Copied " + totalCount() + " edits from " + all.length + " page(s) — paste to Claude."); };
    var fail = function () { fallbackCopy(text, ok); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok).catch(fail);
    } else { fallbackCopy(text, ok); }
  }
  function fallbackCopy(text, ok) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.focus(); ta.select();
      var done = document.execCommand("copy");
      ta.remove();
      if (done) { ok(); return; }
    } catch (e) {}
    flash("Couldn't reach the clipboard — but every edit is safely auto-saved. Tell Claude 'done' and it'll pull them from the browser.");
  }
  function downloadAll() {
    var all = gatherAll();
    if (!all.length) { flash("Nothing to download yet."); return; }
    try {
      var name = "edits-ALL-" + new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19) + ".json";
      var blob = new Blob([JSON.stringify(all.length === 1 ? all[0] : all, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      flash("If a download didn't appear, use Copy — your edits are auto-saved either way.");
    } catch (e) { flash("Download blocked by the browser — use Copy instead (auto-save keeps everything safe)."); }
  }
  function flash(msg) {
    var c = bar.querySelector(".cnt");
    var prev = c.innerHTML;
    c.innerHTML = "<b>" + msg + "</b>";
    clearTimeout(flash._t);
    flash._t = setTimeout(refreshCount, 4200);
  }

  function toggle(on) {
    editing = on == null ? !editing : on;
    document.body.classList.toggle("pa-editing", editing);
    btn.classList.toggle("on", editing);
    bar.classList.toggle("on", editing);
    if (editing) enableEditing(); else disableEditing();
    refreshCount();
  }

  /* while editing: a plain click on a link/button edits its text; hold
     Ctrl / Cmd / Alt and click to actually follow the link or fire the button
     (e.g. to jump to another page — edits are auto-saved first, so nothing is
     lost when you leave). The edit tool's own buttons always work normally. */
  document.addEventListener("click", function (e) {
    if (!editing) return;
    var t = e.target.closest("a,button");
    if (!t || t.closest(".pa-editbar,.pa-editbtn")) return;
    if (e.ctrlKey || e.metaKey || e.altKey) {
      if (saveTimer) { clearTimeout(saveTimer); save(); } /* flush before leaving */
      var link = t.closest("a");
      if (link && link.getAttribute("href")) {
        e.preventDefault();          /* override ctrl-click's "new tab" — switch page in place */
        window.location.href = link.href;
      }
      return; /* buttons: let the native click fire the handler */
    }
    e.preventDefault();
    e.stopPropagation();
  }, true);

  /* P-A 2026-07-28: you could not type a SPACE while editing a button's words.
     Nothing here was eating it — a <button> (and a link) natively treats the
     space bar as "activate me", so the browser fires the button instead of
     inserting the character. Editable buttons need the key handled by hand.
     Capture phase, so it lands before any page's own space/scroll handling. */
  document.addEventListener("keydown", function (e) {
    if (!editing) return;
    if (e.key !== " " && e.key !== "Spacebar" && e.key !== "Enter") return;
    var t = e.target;
    if (!t || !t.isContentEditable) return;
    if (!/^(BUTTON|A|SUMMARY|LABEL)$/.test(t.tagName || "")) return;
    if (t.closest(".pa-editbar,.pa-editbtn")) return;      /* our own controls behave normally */
    e.preventDefault();
    e.stopPropagation();
    if (e.key === "Enter") return;                          /* one line per element — no stray breaks */
    var ok = false;
    try { ok = document.execCommand("insertText", false, " "); } catch (err) { ok = false; }
    if (!ok) {                                              /* fallback: place the space by hand */
      var sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      var r = sel.getRangeAt(0);
      r.deleteContents();
      var n = document.createTextNode(" ");
      r.insertNode(n);
      r.setStartAfter(n); r.collapse(true);
      sel.removeAllRanges(); sel.addRange(r);
    }
    t.dispatchEvent(new Event("input", { bubbles: true }));  /* keep autosave honest */
  }, true);

  document.addEventListener("input", function (e) {
    if (!editing) return;
    var el = e.target.closest && e.target.closest("[data-pa-edit]");
    if (!el) return;
    el.classList.toggle("pa-dirty", el.innerText.trim() !== (el.dataset.paOrig || "").trim());
    saveSoon();
  });
  /* flush a pending save if the tab is closing (belt-and-suspenders; auto-save already ran) */
  window.addEventListener("beforeunload", function () { if (saveTimer) { clearTimeout(saveTimer); save(); } });

  /* ---- mount ---- */
  var st = document.createElement("style");
  st.textContent = CSS;
  document.head.appendChild(st);

  var btn = document.createElement("button");
  btn.className = "pa-editbtn";
  btn.type = "button";
  btn.title = "Edit the text on this page";
  btn.setAttribute("aria-label", "Toggle edit mode");
  btn.textContent = "✎";
  btn.addEventListener("click", function () { toggle(); });

  var bar = document.createElement("div");
  bar.className = "pa-editbar";
  bar.innerHTML = '<span class="cnt"><b>0</b> changes</span>' +
    '<span class="hint">click text to edit &middot; auto-saves &middot; <b>Ctrl/⌘-click</b> a link to switch page</span>' +
    '<button class="exp" type="button">Copy all edits</button>' +
    '<button class="dl" type="button">Download</button>' +
    '<button class="dis" type="button">Clear all</button>';
  bar.querySelector(".exp").addEventListener("click", copyAll);
  bar.querySelector(".dl").addEventListener("click", downloadAll);
  bar.querySelector(".dis").addEventListener("click", function () {
    if (!confirm("Clear ALL saved edits on every page? This cannot be undone.")) return;
    try { gatherAll().forEach(function (d) { localStorage.removeItem(KEY_PREFIX + d.page); }); } catch (e) {}
    location.reload();
  });

  function mount() {
    document.body.appendChild(btn);
    document.body.appendChild(bar);
    scanEditables();
    var n = restore();          // re-apply this page's saved edits on load
    refreshCount();
    markDot();
    if (n) console.log("[edit-mode] restored " + n + " saved edit(s) on " + PAGE);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();

  window.__PA_EDIT = { toggle: toggle, collect: collect, gatherAll: gatherAll, save: save, restore: restore };
})();
