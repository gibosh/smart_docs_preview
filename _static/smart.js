/* SMART help site behaviour (HTML only), matching the Logic+ help site:
   1. Light/dark switch in the header. Default light; the reader's choice is
      kept in localStorage ("theme", shared with Furo); ?theme=light|dark forces one.
   2. Lucide icons beside each chapter in the sidebar, matched by chapter folder. */

(function () {
  // 1. Theme: decide before first paint, then wire the header button.
  var forced = new URLSearchParams(location.search).get("theme");
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  var theme = forced || stored;
  if (theme !== "dark" && theme !== "light") theme = "light";
  document.documentElement.dataset.theme = theme;

  function apply(t) {
    document.body.dataset.theme = t;
    document.documentElement.dataset.theme = t;
  }

  var ICON = function (paths) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  };
  // Folder name of each chapter -> Lucide icon (same set as the Logic+ help site where they overlap).
  var ICONS = {
    home: ICON('<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
    "getting-started": ICON('<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>'),
    map: ICON('<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>'),
    safety: ICON('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>'),
    resources: ICON('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    zones: ICON('<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>'),
    tasks: ICON('<path d="M10 6h8"/><path d="M12 16h6"/><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M8 11h7"/>'),
    analytics: ICON('<path d="M12 16v5"/><path d="M16 14.639V21"/><path d="M20 10.656V21"/><path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"/><path d="M4 18.463V21"/><path d="M8 14.656V21"/>'),
    administration: ICON('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'),
    reference: ICON('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>')
  };

  document.addEventListener("DOMContentLoaded", function () {
    apply(theme);
    if (document.querySelector(".smart-home")) document.body.classList.add("smart-is-home");
    var btn = document.querySelector(".smart-theme-toggle");
    if (btn) btn.addEventListener("click", function () {
      theme = theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("theme", theme); } catch (e) {}
      apply(theme);
    });

    document.querySelectorAll(".sidebar-tree .toctree-l1 > a.reference").forEach(function (a) {
      var href = new URL(a.getAttribute("href"), location.href).pathname;
      var key = a.closest(".smart-home-link") ? "home" : (href.match(/([a-z-]+)\/index\.html/) || [])[1];
      if (ICONS[key]) a.insertAdjacentHTML("afterbegin", '<span class="sidebar-icon">' + ICONS[key] + "</span>");
    });

    // 3. "On this page": mark the section being read. Furo's tracker measures from
    //    its own (hidden) header, so it marked the wrong section; this one measures
    //    from our sticky header. After a jump to a section, that section stays
    //    marked until the reader scrolls (the last sections can't reach the top).
    var links = [].slice.call(document.querySelectorAll(".toc-tree a.reference"));
    var header = document.querySelector(".smart-header");
    var locked = false;
    var shown = function (a) { return a.offsetParent !== null; };
    var target = function (a) { return a.hash && document.getElementById(decodeURIComponent(a.hash.slice(1))); };
    function mark(a) { links.forEach(function (l) { l.classList.toggle("smart-toc-active", l === a); }); }
    function markHash() {
      var a = links.filter(function (l) { return l.hash && l.hash === location.hash; })[0];
      while (a && !shown(a)) a = a.parentNode.parentNode.closest("li").querySelector(":scope > a"); // hidden level -> its parent
      if (a) { mark(a); locked = true; }
    }
    function onScroll() {
      if (locked) return;
      var line = (header ? header.offsetHeight : 0) + 48, current = null;
      links.forEach(function (a) { var t = target(a); if (t && shown(a) && t.getBoundingClientRect().top <= line) current = a; });
      mark(current || links.filter(shown)[0]);  // top of the page: first section, as on the Logic+ site
    }
    ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (e) {
      window.addEventListener(e, function () { locked = false; }, { passive: true });
    });
    links.forEach(function (a) { a.addEventListener("click", function () { setTimeout(markHash, 0); }); });
    window.addEventListener("hashchange", markHash);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (location.hash) markHash(); else onScroll();
  });
})();
