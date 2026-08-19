/* ==========================================================================
   THEME PREVIEW PICKER — hidden dev tool.
   The site's active theme is set via <html data-theme="..."> in index.html
   (currently "graphite"). This picker stays OFF the normal page; to compare
   themes live, open the site with ?themes appended, e.g.:
       http://localhost:8000/site/?themes
   The picker's choice is temporary (per visit) — to change the site's real
   theme, edit the data-theme attribute in index.html.
   ========================================================================== */
(function () {
  const THEMES = [
    { id: "", label: "Slate · Sky", swatch: ["#0284c7", "#1e293b"] },
    { id: "graphite", label: "Graphite · Blue", swatch: ["#0969da", "#1f2328"] },
    { id: "navy", label: "Navy · Royal", swatch: ["#1d4ed8", "#1e2a44"] },
    { id: "teal", label: "Teal · Calm", swatch: ["#0d9488", "#1c2b2d"] },
    { id: "paper", label: "Paper · Cyan", swatch: ["#0e7490", "#292524"] },
  ];

  function apply(id) {
    if (id) document.documentElement.dataset.theme = id;
    else delete document.documentElement.dataset.theme;
    document.querySelectorAll(".tp-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.theme === id);
    });
  }

  function build() {
    // Only show the picker when explicitly requested via ?themes
    if (!new URLSearchParams(location.search).has("themes")) return;
    const style = document.createElement("style");
    style.textContent = `
      .tp-panel {
        position: fixed; right: 16px; bottom: 16px; z-index: 999;
        background: #fff; border: 1px solid #d9dee5; border-radius: 14px;
        box-shadow: 0 10px 30px rgba(0,0,0,.14); padding: 12px 14px;
        font: 12px/1.4 -apple-system, BlinkMacSystemFont, sans-serif;
      }
      .tp-panel h4 { margin: 0 0 8px; font-size: 11px; letter-spacing: .06em;
        text-transform: uppercase; color: #8a93a2; }
      .tp-btn { display: flex; align-items: center; gap: 8px; width: 100%;
        padding: 5px 8px; margin-bottom: 3px; border: 1px solid transparent;
        border-radius: 8px; background: none; cursor: pointer; font: inherit;
        color: #333; text-align: left; }
      .tp-btn:hover { background: #f2f4f7; }
      .tp-btn.active { border-color: #b9c2cf; background: #f2f4f7; font-weight: 600; }
      .tp-dot { width: 13px; height: 13px; border-radius: 50%; flex-shrink: 0; }
    `;
    document.head.appendChild(style);

    const panel = document.createElement("div");
    panel.className = "tp-panel";
    panel.innerHTML =
      `<h4>Theme preview</h4>` +
      THEMES.map(
        (t) => `
        <button class="tp-btn" data-theme="${t.id}">
          <span class="tp-dot" style="background: linear-gradient(135deg, ${t.swatch[0]} 50%, ${t.swatch[1]} 50%)"></span>
          ${t.label}
        </button>`
      ).join("");
    panel.addEventListener("click", (e) => {
      const btn = e.target.closest(".tp-btn");
      if (btn) apply(btn.dataset.theme);
    });
    document.body.appendChild(panel);
    apply(document.documentElement.dataset.theme || "");
  }

  document.addEventListener("DOMContentLoaded", build);
})();
