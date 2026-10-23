/* ==========================================================================
   RENDERER — builds the News and Publications sections from the data files.
   You normally don't need to touch this file; edit data/*.js instead.
   ========================================================================== */

/** Escape plain-text fields before inserting into HTML. */
function esc(s) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(s ?? "").replace(/[&<>"']/g, (ch) => entities[ch]);
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
function renderMedia(media, title, index) {
  if (!media || !media.src) {
    return `<div class="pub-media"><span class="ph">teaser figure</span></div>`;
  }
  const isContain = media.fit === "contain";
  const fitClass = isContain ? " fit-contain" : "";
  const validAspect = /^\d+\s*\/\s*\d+$/.test(media.aspect || "");
  const aspectStyle = validAspect
    ? ` style="--media-aspect: ${esc(media.aspect)}${isContain ? "" : `; aspect-ratio: ${esc(media.aspect)}`}"`
    : "";
  const dimensions = validAspect ? media.aspect.split("/").map(Number) : [];
  const sizeAttrs = dimensions.length ? ` width="${dimensions[0]}" height="${dimensions[1]}"` : "";
  if (media.type === "video") {
    return `
      <div class="pub-media${fitClass}"${aspectStyle}>
        ${isContain ? '<span class="media-clip">' : ""}<video id="pub-video-${index}" aria-hidden="true" data-src="${esc(media.src)}" poster="${esc(media.poster || "")}"
          preload="none" muted loop playsinline${sizeAttrs} aria-label="Video teaser for ${esc(title)}"
          onerror="this.closest('.pub-media').classList.add('media-error')"></video>${isContain ? "</span>" : ""}
        <button class="play-badge video-toggle" type="button" aria-controls="pub-video-${index}" aria-label="Play video teaser for ${esc(title)}" aria-pressed="false">▶ Video</button>
        <span class="media-error-message" role="status">Video unavailable. Please use the paper or project link.</span>
      </div>`;
  }
  return `
    <div class="pub-media${fitClass}"${aspectStyle}>
      <span class="ph">teaser figure</span>
      ${isContain ? '<span class="media-clip">' : ""}<img src="${esc(media.src)}" alt="${esc(media.alt || title + ' — overview figure')}"
        loading="lazy" decoding="async"${sizeAttrs} onerror="this.remove()">${isContain ? "</span>" : ""}
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

function renderLinks(links, title) {
  if (!links) return "";
  return Object.entries(links)
    .map(([label, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${esc(label)} for ${esc(title)}">${linkIcon(label)}${esc(label)}</a>`)
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
    <article class="pub${p.featured ? " featured" : ""}"${p.media && p.media.accent ? ` data-accent="${esc(p.media.accent)}"` : ""}>
      ${renderMedia(p.media, p.title, i)}
      <div class="pub-body">
        <h3 class="pub-title">${title}</h3>
        <div class="pub-authors">${renderAuthors(p.authors)}</div>
        ${p.desc ? `<div class="pub-desc">${esc(p.desc)}</div>` : ""}
        <div class="pub-meta">
          <span class="venue-badge">${esc(p.venue)}</span>
          ${p.award ? `<span class="award-badge">${esc(p.award)}</span>` : ""}
          ${renderLinks(p.links, p.title)}
          ${p.bibtex ? `<button type="button" class="bib-link" data-bib="${i}" aria-label="BibTeX citation for ${esc(p.title)}">${linkIcon("bibtex")}bibtex</button>` : ""}
        </div>
      </div>
    </article>`;
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
  const trigger = document.activeElement;
  const dialog = document.createElement("dialog");
  dialog.className = "bib-dialog";
  dialog.setAttribute("aria-labelledby", "bib-title");
  dialog.innerHTML = `
    <div class="bib-head">
      <span id="bib-title">BibTeX</span>
      <button type="button" class="bib-close" aria-label="Close citation" autofocus>✕</button>
    </div>
    <pre class="bib-pre" tabindex="0" aria-label="Citation text"></pre>
    <div class="bib-actions"><span class="bib-status" role="status"></span><button type="button" class="bib-copy" aria-label="Copy citation">Copy</button></div>`;
  dialog.querySelector(".bib-pre").textContent = bib;
  dialog.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const controls = [...dialog.querySelectorAll("button, [tabindex='0']")];
    const first = controls[0], last = controls[controls.length - 1];
    if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      e.preventDefault(); first.focus();
    }
  });
  dialog.querySelector(".bib-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    const r = dialog.getBoundingClientRect();
    if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    dialog.remove();
    trigger?.focus({ preventScroll: true });
  }, { once: true });
  dialog.querySelector(".bib-copy").addEventListener("click", async () => {
    const status = dialog.querySelector(".bib-status");
    try {
      await navigator.clipboard.writeText(bib);
      status.textContent = "Citation copied.";
    } catch {
      // Keep the selectable citation available when clipboard access is unavailable.
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(dialog.querySelector(".bib-pre"));
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = "Select and copy the citation text.";
    }
  });
  document.body.appendChild(dialog);
  document.body.classList.add("dialog-open");
  dialog.showModal();
}

/* Load videos only when visible; honor motion/data preferences until Play is chosen. */
function initVideos() {
  const videos = [...document.querySelectorAll(".pub-media video")];
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection;
  const allowAutoplay = () => !motion.matches && !connection?.saveData;
  const visible = new Set();
  const load = (video) => {
    if (!video.hasAttribute("src")) video.src = video.dataset.src;
  };
  const play = (video) => {
    load(video);
    const pending = video.play();
    if (pending) pending.catch(() => {});
  };
  const update = (video) => {
    const button = video.closest(".pub-media").querySelector(".video-toggle");
    const playing = !video.paused;
    button.textContent = playing ? "Ⅱ Video" : "▶ Video";
    button.setAttribute("aria-pressed", String(playing));
    button.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${video.getAttribute("aria-label")}`);
  };
  const sync = () => videos.forEach((video) => {
    if (document.hidden || !visible.has(video) || video.dataset.userPaused === "true" || (!allowAutoplay() && video.dataset.userStarted !== "true")) video.pause();
    else play(video);
  });
  videos.forEach((video) => {
    video.addEventListener("play", () => update(video));
    video.addEventListener("pause", () => update(video));
    // The preview itself is also a large touch target; the glass badge stays compact.
    video.addEventListener("click", () => video.closest(".pub-media").querySelector(".video-toggle").click());
    video.closest(".pub-media").querySelector(".video-toggle").addEventListener("click", () => {
      if (video.paused) {
        video.dataset.userPaused = "false";
        video.dataset.userStarted = "true";
        visible.add(video);
        play(video);
      } else {
        video.dataset.userPaused = "true";
        video.pause();
      }
    });
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) visible.add(target);
        else visible.delete(target);
      });
      sync();
    }, { threshold: 0.15 });
    videos.forEach((video) => observer.observe(video));
  }
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", () => {
    videos.forEach((video) => { delete video.dataset.userStarted; });
    sync();
  });
  connection?.addEventListener("change", sync);
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
    let n = 0, r = 0, g = 0, b = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 200) continue; // skip transparent pixels
      r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
    }
    if (!n) return;
    // Histogram pass, parameterized by a minimum saturation so pale teasers
    // (pastel renders on white paper figures) can rerun with a relaxed cutoff.
    let bins, cn;
    const collect = (satMin) => {
      bins = Array.from({ length: BINS }, () => ({ w: 0, c: 0, r: 0, g: 0, b: 0 }));
      cn = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 200) continue;
        const pr = d[i], pg = d[i + 1], pb = d[i + 2];
        const mx = Math.max(pr, pg, pb), mn = Math.min(pr, pg, pb);
        const sat = mx - mn;
        if (sat < satMin || mx < 60) continue; // ignore gray/near-black background
        cn++;
        const bin = bins[Math.floor(rgbToHue(pr, pg, pb) / (360 / BINS)) % BINS];
        bin.w += sat; bin.c++; bin.r += pr * sat; bin.g += pg * sat; bin.b += pb * sat;
      }
    };
    collect(28);
    // Even a sparse colorful region (e.g. a small rendering on a white page)
    // is a better hue signal than the near-white average, so gate on a small
    // ABSOLUTE pixel count — and try a softer saturation cutoff before giving up.
    if (cn < 10) collect(14);
    if (cn < 10) {
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
      const tryTint = (attempt = 0) => {
        applyTint(v);
        // Early frames can be blank/white — retry a few times as playback
        // advances so white-dominant teasers still get sampled on content.
        if (!pub.classList.contains("tinted") && attempt < 4) {
          setTimeout(() => tryTint(attempt + 1), 1200);
        }
      };
      if (v.readyState >= 2) tryTint();
      // NOTE: wrap in an arrow fn — passing tryTint directly would receive the
      // Event object as `attempt` and disable the retry loop.
      else v.addEventListener("loadeddata", () => tryTint(), { once: true });
    }
  });
}

/* --------------------------------- Init ---------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Preserve Chromium's original liquid-glass refraction effect.
  if (navigator.userAgentData?.brands?.some((b) => /Chromium/i.test(b.brand))) {
    document.documentElement.classList.add("refract");
  }
  renderNews();
  renderPublications();
  initTints();
  initVideos();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
