/* =====================================================================
   EDIT MODE — visual, in-place copy editing for P-A.
   Loaded on every page via site-nav.js; activates ONLY on file:// or
   localhost (never on a deployed site). A ✎ button (bottom-left) turns
   every text block clickable-and-typeable; "Export" downloads a JSON of
   {original → edited} pairs; `node _tools/apply-edits.mjs <file>` ports
   them into the source files deterministically (no AI involved).
   ===================================================================== */
(function () {
  "use strict";
  var isLocal = location.protocol === "file:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if (!isLocal) return;

  var editing = false;
  var changes = {}; // key: uid -> {original, edited-el}
  var uid = 0;

  var CSS = "" +
    ".pa-editbtn{position:fixed;left:clamp(14px,2.2vw,26px);bottom:clamp(14px,2.6vh,26px);z-index:9990;width:46px;height:46px;border-radius:50%;border:1.5px solid rgba(34,48,31,.35);background:rgba(255,253,248,.94);color:#22301f;font-size:1.05rem;cursor:pointer;box-shadow:0 12px 30px -14px rgba(34,48,31,.45);opacity:.6;transition:opacity .25s,transform .25s}" +
    ".pa-editbtn:hover{opacity:1;transform:translateY(-2px)}" +
    ".pa-editbtn.on{background:#3c6b32;color:#fff;border-color:#3c6b32;opacity:1}" +
    ".pa-editbar{position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:9991;display:none;align-items:center;gap:14px;background:#22301f;color:#f6f2e7;border-radius:99px;padding:10px 12px 10px 22px;font-family:'Switzer',system-ui,sans-serif;font-size:.8rem;box-shadow:0 18px 44px -14px rgba(0,0,0,.5)}" +
    ".pa-editbar.on{display:flex}" +
    ".pa-editbar b{color:#e9b45f}" +
    ".pa-editbar button{font:inherit;font-weight:700;border:0;border-radius:99px;padding:8px 16px;cursor:pointer}" +
    ".pa-editbar .exp{background:#5c9e4a;color:#fff}" +
    ".pa-editbar .exp:hover{background:#6fb35c}" +
    ".pa-editbar .dis{background:transparent;color:#f6f2e7;border:1px solid rgba(246,242,231,.4)}" +
    ".pa-editbar .dis:hover{border-color:#f6f2e7}" +
    "body.pa-editing [data-pa-edit]{outline:1.5px dashed rgba(92,158,74,.55);outline-offset:3px;cursor:text;min-height:1em}" +
    "body.pa-editing [data-pa-edit]:hover{outline-color:#5c9e4a;background:rgba(92,158,74,.07)}" +
    "body.pa-editing [data-pa-edit]:focus{outline:2px solid #d99a3d;background:rgba(217,154,61,.08)}" +
    "body.pa-editing [data-pa-edit].pa-dirty{outline-color:#d99a3d;outline-style:solid}" +
    "body.pa-editing a{cursor:text}";

  var INLINE = { EM: 1, STRONG: 1, B: 1, I: 1, U: 1, SPAN: 1, A: 1, BR: 1, SMALL: 1, SUP: 1, SUB: 1, MARK: 1 };
  var SELECTOR = "h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,dt,dd,summary,caption,span,a,button";

  function editableCandidate(el) {
    if (el.closest(".pa-editbar,.pa-editbtn,.snav,script,style")) return false;
    if (!el.innerText || !el.innerText.trim()) return false;
    // only leaf-ish nodes: children must all be inline
    for (var i = 0; i < el.children.length; i++) {
      if (!INLINE[el.children[i].tagName]) return false;
    }
    // skip if an ancestor is already marked (avoid nesting)
    if (el.parentElement && el.parentElement.closest("[data-pa-edit]")) return false;
    return true;
  }

  function markEditables() {
    document.querySelectorAll(SELECTOR).forEach(function (el) {
      if (el.hasAttribute("data-pa-edit")) return;
      if (!editableCandidate(el)) return;
      el.setAttribute("data-pa-edit", ++uid);
      el.setAttribute("contenteditable", "plaintext-only");
      if (el.contentEditable !== "plaintext-only") el.setAttribute("contenteditable", "true"); // Firefox fallback
      el.setAttribute("spellcheck", "false");
      el.dataset.paOrig = el.innerText;
    });
  }
  function unmarkEditables() {
    document.querySelectorAll("[data-pa-edit]").forEach(function (el) {
      el.removeAttribute("contenteditable");
      el.removeAttribute("spellcheck");
    });
  }

  function collect() {
    var out = [];
    document.querySelectorAll("[data-pa-edit]").forEach(function (el) {
      var orig = el.dataset.paOrig, now = el.innerText;
      if (orig != null && now.trim() !== orig.trim() && orig.trim()) {
        out.push({ original: orig, edited: now });
      }
    });
    return out;
  }

  function refreshCount() {
    var n = collect().length;
    var c = bar.querySelector(".cnt");
    c.innerHTML = "<b>" + n + "</b> change" + (n === 1 ? "" : "s");
  }

  function exportData() {
    return {
      page: (location.pathname.split("/").pop() || "index.html"),
      exportedAt: new Date().toISOString(),
      changes: collect()
    };
  }

  function doExport() {
    var data = exportData();
    if (!data.changes.length) { alert("No changes yet — click any text and type first."); return; }
    var name = "edits-" + data.page.replace(/\.html?$/, "") + "-" + data.exportedAt.replace(/[:T]/g, "-").slice(0, 19) + ".json";
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    bar.querySelector(".cnt").innerHTML = "<b>Saved!</b> " + name + " → Downloads";
  }

  function toggle(on) {
    editing = on == null ? !editing : on;
    document.body.classList.toggle("pa-editing", editing);
    btn.classList.toggle("on", editing);
    bar.classList.toggle("on", editing);
    if (editing) { markEditables(); refreshCount(); }
    else unmarkEditables();
  }

  /* block navigation while editing (links become text targets) */
  document.addEventListener("click", function (e) {
    if (!editing) return;
    var a = e.target.closest("a");
    if (a) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  document.addEventListener("input", function (e) {
    if (!editing) return;
    var el = e.target.closest && e.target.closest("[data-pa-edit]");
    if (!el) return;
    el.classList.toggle("pa-dirty", el.innerText.trim() !== (el.dataset.paOrig || "").trim());
    refreshCount();
  });

  window.addEventListener("beforeunload", function (e) {
    if (editing && collect().length) { e.preventDefault(); e.returnValue = ""; }
  });

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
    '<span style="opacity:.65">click any text &middot; type &middot; export when done</span>' +
    '<button class="exp" type="button">Export changes</button>' +
    '<button class="dis" type="button">Discard</button>';
  bar.querySelector(".exp").addEventListener("click", doExport);
  bar.querySelector(".dis").addEventListener("click", function () {
    if (confirm("Discard all edits on this page?")) location.reload();
  });

  function mount() {
    document.body.appendChild(btn);
    document.body.appendChild(bar);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();

  window.__PA_EDIT = { toggle: toggle, exportData: exportData, collect: collect };
})();
