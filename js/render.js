/* ==========================================================================
   RENDERER — builds the News and Publications sections from the data files.
   You normally don't need to touch this file; edit data/*.js instead.
   ========================================================================== */

/** Escape plain-text fields before inserting into HTML. */
function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

/* ------------------------------- News ------------------------------------ */
function renderNews() {
  const root = document.getElementById("news-list");
  if (!root || typeof NEWS_ITEMS === "undefined") return;
  root.innerHTML = NEWS_ITEMS.map(
    (n) => `
    <div class="news-item">
      <div class="news-date">${esc(n.date)}</div>
      <div>${n.html}</div>
    </div>`
  ).join("");
}

/* --------------------------- Publications -------------------------------- */
function renderMedia(media) {
  // No media declared → neutral placeholder.
  if (!media || !media.src) {
    return `<div class="pub-media"><span class="ph">teaser figure</span></div>`;
  }
  // fit: "contain" shows the whole figure with equal padding; default "cover" crops to fill.
  const isContain = media.fit === "contain";
  const fitClass = isContain ? " fit-contain" : "";
  // aspect: optional slot-ratio override like "2/1" for COVER mode slots.
  // Ignored in contain mode, where the media's natural ratio sizes the slot.
  const aspectStyle = !isContain && media.aspect && /^\d+\s*\/\s*\d+$/.test(media.aspect)
    ? ` style="aspect-ratio: ${esc(media.aspect)}"`
    : "";
  if (media.type === "video") {
    return `
      <div class="pub-media${fitClass}"${aspectStyle}>
        <span class="ph">video teaser</span>
        ${isContain ? '<span class="media-clip">' : ""}<video src="${esc(media.src)}" autoplay muted loop playsinline
               onerror="this.remove()"></video>${isContain ? "</span>" : ""}
        <span class="play-badge">▶ Video</span>
      </div>`;
  }
  // Default: image. If the file is missing, the placeholder text shows through.
  return `
    <div class="pub-media${fitClass}"${aspectStyle}>
      <span class="ph">teaser figure</span>
      ${isContain ? '<span class="media-clip">' : ""}<img src="${esc(media.src)}" alt="${esc(media.alt || "")}"
           onerror="this.remove()">${isContain ? "</span>" : ""}
    </div>`;
}

/* Author markers: append to a name in the data file, e.g. "Yuqin Lu*" or
   "Yuqin Lu*†". A global legend is added automatically above the cards.
   macOS typing: † = Option+T · ‡ = Option+Shift+7 */
const AUTHOR_MARKS = {
  "*": "equal contribution",
  "†": "corresponding author",
  "‡": "project lead",
};

function splitAuthor(a) {
  const m = a.match(/^(.*?)([*†‡]+)$/);
  return m ? { name: m[1].trim(), marks: m[2] } : { name: a, marks: "" };
}

function renderAuthors(authors) {
  return authors
    .map((a) => {
      const { name, marks } = splitAuthor(a);
      const label = esc(name) + (marks ? `<sup>${esc(marks)}</sup>` : "");
      return name === SITE_AUTHOR ? `<span class="me">${label}</span>` : label;
    })
    .join(", ");
}

function authorsLegend(pubs) {
  // Global legend: collect markers used across ALL publications.
  const used = new Set();
  pubs.forEach((p) =>
    p.authors.forEach((a) => { for (const ch of splitAuthor(a).marks) used.add(ch); })
  );
  const parts = [...used]
    .filter((ch) => AUTHOR_MARKS[ch])
    .map((ch) => `${ch} ${AUTHOR_MARKS[ch]}`);
  return parts.length ? `<div class="pub-legend">${esc(parts.join(" · "))}</div>` : "";
}

/* Mini icons for known link labels (lowercase); unknown labels fall back to
   a generic link icon. Shared by link chips and the bibtex button. */
const LINK_ICONS = {
  paper: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  pdf: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  code: "M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
  bibtex: "M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z",
  video: "M8 5v14l11-7L8 5z",
  demo: "M8 5v14l11-7L8 5z",
  slides: "M10 8v8l5-4-5-4zm9-5H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z",
  poster: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  dataset: "M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z",
  project: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z",
};

function linkIcon(label) {
  const path = LINK_ICONS[label.toLowerCase()] || LINK_ICONS.project;
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
}

function renderLinks(links) {
  if (!links) return "";
  return Object.entries(links)
    .map(([label, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${linkIcon(label)}${esc(label)}</a>`)
    .join("");
}

function renderPublications() {
  const root = document.getElementById("pub-list");
  if (!root || typeof PUBLICATIONS === "undefined") return;
  const cards = PUBLICATIONS.map((p, i) => {
    const title = p.url
      ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a>`
      : esc(p.title);
    return `
    <div class="pub${p.featured ? " featured" : ""}"${p.media && p.media.accent ? ` data-accent="${esc(p.media.accent)}"` : ""}>
      ${renderMedia(p.media)}
      <div class="pub-body">
        <div class="pub-title">${title}</div>
        <div class="pub-authors">${renderAuthors(p.authors)}</div>
        ${p.desc ? `<div class="pub-desc">${esc(p.desc)}</div>` : ""}
        <div class="pub-meta">
          <span class="venue-badge">${esc(p.venue)}</span>
          ${p.award ? `<span class="award-badge">${esc(p.award)}</span>` : ""}
          ${renderLinks(p.links)}
          ${p.bibtex ? `<a href="#" class="bib-link" role="button" data-bib="${i}">${linkIcon("bibtex")}bibtex</a>` : ""}
        </div>
      </div>
    </div>`;
  }).join("");
  // Legend appears once, right under the section title, above the cards.
  root.innerHTML = authorsLegend(PUBLICATIONS) + cards;
  // BibTeX chips open a copyable popup instead of navigating away.
  root.addEventListener("click", (e) => {
    const chip = e.target.closest(".bib-link");
    if (!chip) return;
    e.preventDefault();
    const p = PUBLICATIONS[+chip.dataset.bib];
    if (p && p.bibtex) openBibtex(p.bibtex.trim());
  });
}

/* ----------------------------- BibTeX popup ------------------------------ */
function openBibtex(bib) {
  const ov = document.createElement("div");
  ov.className = "bib-overlay";
  ov.innerHTML = `
    <div class="bib-dialog" role="dialog" aria-modal="true" aria-label="BibTeX">
      <div class="bib-head">
        <span>BibTeX</span>
        <button class="bib-close" aria-label="Close">✕</button>
      </div>
      <pre class="bib-pre"></pre>
      <div class="bib-actions"><button class="bib-copy">Copy</button></div>
    </div>`;
  ov.querySelector(".bib-pre").textContent = bib;

  const onKey = (e) => { if (e.key === "Escape") close(); };
  const close = () => { ov.remove(); document.removeEventListener("keydown", onKey); };
  ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
  ov.querySelector(".bib-close").addEventListener("click", close);
  ov.querySelector(".bib-copy").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(bib);
    } catch {
      // Fallback for non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = bib; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy"); ta.remove();
    }
    btn.textContent = "Copied ✓";
    setTimeout(() => { btn.textContent = "Copy"; }, 1500);
  });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(ov);
}

/* ------------------- Teaser-adaptive card theme --------------------------
   Samples the teaser's dominant (average) color and derives a per-card
   mini-theme from its HUE only: saturation/lightness are normalized to fixed
   bands so all cards share the same tone and stay readable (à la Material
   You). Exposed as CSS vars on the card:
     --tint             "r g b"  → 5.5% background wash
     --card-accent      hsl(hue, normalized) → venue badge, chip text
     --card-accent-soft light tint of the hue → chip background
   Near-gray teasers are skipped (card keeps the global accent). A manual
   override is available via media.accent ("#rrggbb") in the data file. */
function rgbToHue(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (!d) return 0;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return Math.round((h * 60 + 360) % 360);
}

/* Accent hues already assigned on this page — used so sibling cards prefer
   DISTINCT accents when their teasers share similar dominant colors. */
let USED_HUES = [];

function hueDist(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function setCardTheme(pub, r, g, b) {
  const hue = rgbToHue(r, g, b);
  USED_HUES.push(hue);
  // Only the HUE is kept from the extracted color; saturation/lightness are
  // normalized (à la Material You tonal palettes) so vivid and muted teasers
  // produce washes and badges of identical perceptual weight.
  // HSL saturation is not perceptually uniform: greens/yellows read much
  // louder than blues at equal values, so damp chroma in that hue band.
  const damp = hue > 50 && hue < 170 ? 0.72 : 1;
  pub.style.setProperty("--tint-hsl", `${hue} ${Math.round(40 * damp)}% 46%`);
  pub.style.setProperty("--card-accent", `hsl(${hue} ${Math.round(58 * damp)}% 36%)`);
  pub.style.setProperty("--card-accent-soft", `hsl(${hue} ${Math.round(70 * damp)}% 94%)`);
  pub.classList.add("tinted");
}

function applyTint(mediaEl) {
  const pub = mediaEl.closest(".pub");
  if (!pub || pub.classList.contains("tinted")) return;
  try {
    const size = 32;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(mediaEl, 0, 0, size, size);
    const d = ctx.getImageData(0, 0, size, size).data;
    // Adaptive badge contrast: measure luminance where the ▶ Video badge sits
    // (bottom-left) and switch it to dark text over bright footage.
    if (mediaEl.tagName === "VIDEO") {
      let lum = 0, ln = 0;
      for (let y = 22; y < size; y++) {
        for (let x = 0; x < 12; x++) {
          const i = (y * size + x) * 4;
          if (d[i + 3] < 200) continue;
          lum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; ln++;
        }
      }
      if (ln) {
        mediaEl.closest(".pub-media")
          .classList.toggle("media-bright", lum / ln > 185);
      }
    }
    // Material You-style extraction: histogram colorful pixels by hue, score
    // candidate hue windows by population × mean chroma (vibrancy preference),
    // then pick the best-scoring candidate that is hue-distinct from accents
    // already used elsewhere on the page.
    const BINS = 24; // 15° per bin
    const bins = Array.from({ length: BINS }, () => ({ w: 0, c: 0, r: 0, g: 0, b: 0 }));
    let n = 0, cn = 0, r = 0, g = 0, b = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 200) continue; // skip transparent pixels
      const pr = d[i], pg = d[i + 1], pb = d[i + 2];
      r += pr; g += pg; b += pb; n++;
      const mx = Math.max(pr, pg, pb), mn = Math.min(pr, pg, pb);
      const sat = mx - mn;
      if (sat < 28 || mx < 60) continue; // ignore gray/near-black background
      cn++;
      const bin = bins[Math.floor(rgbToHue(pr, pg, pb) / (360 / BINS)) % BINS];
      bin.w += sat; bin.c++; bin.r += pr * sat; bin.g += pg * sat; bin.b += pb * sat;
    }
    if (!n) return;
    if (cn < n * 0.02) {
      // Whole media is near-gray → no reliable hue; keep the global theme.
      const ar = Math.round(r / n), ag = Math.round(g / n), ab = Math.round(b / n);
      if (Math.max(ar, ag, ab) - Math.min(ar, ag, ab) < 16) return;
      setCardTheme(pub, ar, ag, ab);
      return;
    }
    // Score sliding 3-bin windows: population(weight) × mean chroma.
    const wins = [];
    for (let i = 0; i < BINS; i++) {
      let W = 0, C = 0, R = 0, G = 0, B = 0;
      for (const j of [i, (i + 1) % BINS, (i + BINS - 1) % BINS]) {
        W += bins[j].w; C += bins[j].c; R += bins[j].r; G += bins[j].g; B += bins[j].b;
      }
      if (!W || !C) continue;
      wins.push({ score: W * (W / C), r: R / W, g: G / W, b: B / W });
    }
    wins.sort((a, b2) => b2.score - a.score);
    // Keep up to 3 mutually distinct candidates (≥50° apart).
    const cands = [];
    for (const w of wins) {
      const hue = rgbToHue(w.r, w.g, w.b);
      if (cands.every((c) => hueDist(c.hue, hue) >= 50)) cands.push({ ...w, hue });
      if (cands.length >= 3) break;
    }
    // Prefer a candidate distinct (≥22°) from hues already on the page.
    const pick =
      cands.find((c) => USED_HUES.every((h) => hueDist(h, c.hue) >= 22)) || cands[0];
    if (pick) setCardTheme(pub, Math.round(pick.r), Math.round(pick.g), Math.round(pick.b));
  } catch (e) {
    /* canvas blocked (e.g. cross-origin media) → keep default card style */
  }
}

function initTints() {
  USED_HUES = [];
  document.querySelectorAll(".pub").forEach((pub) => {
    // Manual override from data: media.accent = "#rrggbb"
    const hex = pub.dataset.accent;
    if (hex && /^#[0-9a-f]{6}$/i.test(hex)) {
      setCardTheme(pub, parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16));
      return;
    }
    const img = pub.querySelector(".pub-media img");
    if (img) {
      if (img.complete && img.naturalWidth) applyTint(img);
      else img.addEventListener("load", () => applyTint(img), { once: true });
    }
    const v = pub.querySelector(".pub-media video");
    if (v) {
      const tryTint = () => {
        applyTint(v);
        // First frame can be blank/monochrome — retry once after playback starts.
        if (!pub.classList.contains("tinted")) {
          setTimeout(() => applyTint(v), 1200);
        }
      };
      if (v.readyState >= 2) tryTint();
      else v.addEventListener("loadeddata", tryTint, { once: true });
    }
  });
}

/* --------------------------------- Init ---------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Chromium supports backdrop-filter: url(#svg-filter) for true refraction;
  // navigator.userAgentData only exists in Chromium, making it a safe gate.
  if (navigator.userAgentData?.brands?.some((b) => /Chromium/i.test(b.brand))) {
    document.documentElement.classList.add("refract");
  }
  renderNews();
  renderPublications();
  initTints();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
