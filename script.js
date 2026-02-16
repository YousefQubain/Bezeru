/* =========================
   DROPDOWNS (stable)
========================= */
function initDropdowns(){
  const dropdowns = document.querySelectorAll(".dropdown");

  function closeAll(){
    dropdowns.forEach(dd => {
      dd.classList.remove("dd-open");
      const btn = dd.querySelector(".dd-btn");
      if(btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  dropdowns.forEach(dd=>{
    const btn = dd.querySelector(".dd-btn");
    const menu = dd.querySelector(".dd-menu");
    if(!btn || !menu) return;

    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", (e)=>{
      e.preventDefault();
      e.stopPropagation();
      const isOpen = dd.classList.contains("dd-open");
      closeAll();
      if(!isOpen){
        dd.classList.add("dd-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });

    // prevent clicks inside menu from closing instantly
    menu.addEventListener("click", (e)=> e.stopPropagation());

    // close after choosing a link
    menu.querySelectorAll("a").forEach(a=>{
      a.addEventListener("click", ()=> closeAll());
    });
  });

  // close only if click is outside any dropdown
  document.addEventListener("click", (e)=>{
    const inside = e.target.closest(".dropdown");
    if(!inside) closeAll();
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeAll();
  });
}

/* =========================
   MOBILE NAV TOGGLE
========================= */
function initMobileNav(){
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  const panel = document.getElementById("primary-nav-panel");
  const overlay = nav ? nav.querySelector("[data-nav-overlay]") : null;
  if(!toggle || !nav || !panel) return;

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

  let lastFocused = null;
  panel.setAttribute("aria-hidden", "true");

  function trapFocus(e){
    if(e.key !== "Tab") return;
    const focusables = panel.querySelectorAll(focusableSelector);
    if(!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if(e.shiftKey && document.activeElement === first){
      e.preventDefault();
      last.focus();
    }else if(!e.shiftKey && document.activeElement === last){
      e.preventDefault();
      first.focus();
    }
  }

  function openNav(){
    lastFocused = document.activeElement;
    document.body.classList.add("nav-open");
    panel.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    overlay?.classList.add("is-visible");
    const focusTarget = panel.querySelector(focusableSelector);
    if(focusTarget) focusTarget.focus();
  }

  function closeNav(){
    document.body.classList.remove("nav-open");
    panel.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    overlay?.classList.remove("is-visible");
    if(lastFocused && lastFocused.focus){
      lastFocused.focus();
    }else{
      toggle.focus();
    }
  }

  toggle.addEventListener("click", ()=>{
    const isOpen = document.body.classList.contains("nav-open");
    if(isOpen){
      closeNav();
    }else{
      openNav();
    }
  });

  nav.querySelectorAll("a").forEach(link=>{
    link.addEventListener("click", ()=>{
      if(document.body.classList.contains("nav-open")){
        closeNav();
      }
    });
  });

  overlay?.addEventListener("click", closeNav);

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && document.body.classList.contains("nav-open")){
      closeNav();
    }
  });

  panel.addEventListener("keydown", trapFocus);

  window.addEventListener("resize", ()=>{
    if(window.innerWidth > 768 && document.body.classList.contains("nav-open")){
      closeNav();
    }
  });
}

/* =========================
   STICKY HEADER (MOBILE)
========================= */
function initStickyHeader(){
  const header = document.querySelector("header");
  if(!header) return;
  let lastScroll = window.scrollY;
  let ticking = false;

  function update(){
    const isMobile = window.innerWidth <= 768;
    if(!isMobile){
      header.classList.remove("header-hidden");
      return;
    }
    const currentScroll = window.scrollY;
    const delta = currentScroll - lastScroll;
    if(currentScroll < 12){
      header.classList.remove("header-hidden");
    }else if(delta > 6){
      header.classList.add("header-hidden");
    }else if(delta < -6){
      header.classList.remove("header-hidden");
    }
    lastScroll = currentScroll;
  }

  function onScroll(){
    if(!ticking){
      window.requestAnimationFrame(()=>{
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);
}

/* =========================
   CLOCKS (HiDPI + markers + seconds)
========================= */
const TZ = {
  ny:  { tz: "America/New_York", label: "NEW YORK" },
  lon: { tz: "Europe/London",    label: "LONDON" },
  gen: { tz: "Europe/Zurich",    label: "GENEVA" },
  tok: { tz: "Asia/Tokyo",       label: "TOKYO" }
};

function formatTime(tz){
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const label = fmt.format(new Date()); // HH:MM:SS
  const [hh, mm, ss] = label.split(":").map(Number);
  return { hh, mm, ss, label };
}

function setupHiDPI(canvas){
  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  const cssW = 38, cssH = 38;
  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr,0,0,dpr,0,0); // draw in CSS pixels
  return { ctx, dpr, w: cssW, h: cssH };
}

function drawDial(canvas, hh, mm, ss){
  if(!canvas) return;
  const { ctx, w } = setupHiDPI(canvas);
  const r = w/2;

  ctx.clearRect(0,0,w,w);
  ctx.save();
  ctx.translate(r,r);

  // dial fill
  ctx.beginPath();
  ctx.arc(0,0,r-2.6,0,Math.PI*2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  // outer ring
  ctx.beginPath();
  ctx.arc(0,0,r-1.5,0,Math.PI*2);
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || "#1d4ed8";
  ctx.lineWidth = 3.2;
  ctx.stroke();

  // white dial background (inside area)
  ctx.beginPath();
  ctx.arc(0,0,r-6.8,0,Math.PI*2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  // inner ring
  ctx.beginPath();
  ctx.arc(0,0,r-6.8,0,Math.PI*2);
  ctx.strokeStyle = "rgba(15,23,42,0.08)";
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // minute/second ticks
  for(let i=0;i<60;i++){
    const ang = (Math.PI/30)*i - Math.PI/2;
    const isHour = i % 5 === 0;
    const len = isHour ? 6.5 : 3.8;
    const lw  = isHour ? 1.7 : 1.1;

    ctx.beginPath();
    ctx.moveTo(Math.cos(ang)*(r-7.5), Math.sin(ang)*(r-7.5));
    ctx.lineTo(Math.cos(ang)*(r-7.5-len), Math.sin(ang)*(r-7.5-len));
    ctx.strokeStyle = isHour ? "rgba(15,23,42,0.55)" : "rgba(15,23,42,0.28)";
    ctx.lineWidth = lw;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  // hands angles
  const hour = (hh % 12) + mm/60 + ss/3600;
  const min  = mm + ss/60;

  const hourAng = (Math.PI/6) * hour - Math.PI/2;
  const minAng  = (Math.PI/30) * min  - Math.PI/2;
  const secAng  = (Math.PI/30) * ss   - Math.PI/2;

  // hour hand
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(Math.cos(hourAng) * (r*0.42), Math.sin(hourAng) * (r*0.42));
  ctx.strokeStyle = "rgba(15,23,42,0.92)";
  ctx.lineWidth = 3.2;
  ctx.lineCap = "round";
  ctx.stroke();

  // minute hand
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(Math.cos(minAng) * (r*0.62), Math.sin(minAng) * (r*0.62));
  ctx.strokeStyle = "rgba(15,23,42,0.92)";
  ctx.lineWidth = 2.4;
  ctx.lineCap = "round";
  ctx.stroke();

  // second hand (accent)
  ctx.beginPath();
  ctx.moveTo(Math.cos(secAng) * (r*0.10), Math.sin(secAng) * (r*0.10));
  ctx.lineTo(Math.cos(secAng) * (r*0.70), Math.sin(secAng) * (r*0.70));
  ctx.strokeStyle = "rgba(29,78,216,0.95)";
  ctx.lineWidth = 1.4;
  ctx.lineCap = "round";
  ctx.stroke();

  // center dot
  ctx.beginPath();
  ctx.arc(0,0,2.4,0,Math.PI*2);
  ctx.fillStyle = "rgba(15,23,42,0.92)";
  ctx.fill();

  ctx.restore();
}

function tickClocks(){
  Object.keys(TZ).forEach(id=>{
    const canvas = document.getElementById(id);
    const tEl = document.getElementById(id + "-time");
    if(!canvas || !tEl) return;

    const parts = formatTime(TZ[id].tz);
    tEl.textContent = parts.label;
    drawDial(canvas, parts.hh, parts.mm, parts.ss);
  });
}

function initClocks(){
  tickClocks();
  setInterval(tickClocks, 1000);
}

/* =========================
   MOBILE SUBSCRIBE CTA
========================= */
function initMobileCta(){
  const cta = document.querySelector("[data-cta-bar]");
  const action = document.querySelector("[data-cta-action]");
  const close = document.querySelector("[data-cta-close]");
  const subscribeSection = document.getElementById("subscribe");
  if(!cta || !action || !close || !subscribeSection) return;

  const storageKey = "bezeru-cta-dismissed";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let isInSubscribe = false;

  function isDismissed(){
    try{
      const stored = localStorage.getItem(storageKey);
      if(!stored) return false;
      const parsed = JSON.parse(stored);
      if(parsed.expires && Date.now() < parsed.expires) return true;
      localStorage.removeItem(storageKey);
      return false;
    }catch(err){
      return false;
    }
  }

  function setDismissed(){
    try{
      const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(storageKey, JSON.stringify({ expires }));
    }catch(err){
      // ignore storage errors
    }
  }

  function setVisible(visible){
    cta.setAttribute("aria-hidden", visible ? "false" : "true");
    document.body.classList.toggle("cta-visible", visible);
  }

  function updateVisibility(){
    if(window.innerWidth > 768){
      setVisible(false);
      return;
    }
    if(isDismissed() || isInSubscribe){
      setVisible(false);
      return;
    }
    setVisible(true);
  }

  action.addEventListener("click", ()=>{
    subscribeSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  });

  close.addEventListener("click", ()=>{
    setDismissed();
    updateVisibility();
  });

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      isInSubscribe = entry.isIntersecting;
      updateVisibility();
    });
  }, { threshold: 0.2 });

  observer.observe(subscribeSection);

  updateVisibility();
  window.addEventListener("resize", updateVisibility);
}

/* =========================
   POSTS RENDERING
========================= */
const FEATURED_POST_ID = "independents-replacing-hype-001";

async function loadPosts(){
  const res = await fetch("posts.json", { cache: "no-store" });
  if(!res.ok) throw new Error("Could not load posts.json");
  const data = await res.json();
  return data.posts || [];
}

function postCardHTML(post){
  const meta = getCardMeta(post);
  const image = post.image || post.thumbnail || "/images/Article-1.jpg";
  const dateLabel = formatDate(post.date);
  const href = post.url || `article.html?id=${encodeURIComponent(post.id)}`;
  return `
    <article class="card">
      <a class="card-media" href="${href}">
        <img class="card-image" src="${image}" alt="${post.title}" loading="lazy" decoding="async" />
      </a>
      <div class="card-body">
        <div class="meta">
          <span class="tag">${post.category || "Latest"}</span>
          <time datetime="${post.date || ""}">${dateLabel}</time>
        </div>
        <h3 class="card-title">
          <a href="${href}">${post.title}</a>
        </h3>
        <p class="card-excerpt">${post.excerpt || ""}</p>
      </div>
    </article>
  `;
}

function getCardMeta(post){
  if(Array.isArray(post.tags) && post.tags.length){
    return post.tags.join(" • ").toUpperCase();
  }
  const category = (post.category || "").toLowerCase();
  const tagsByCategory = {
    underdogs: "INDEPENDENTS • UNDER-THE-RADAR • WEARABILITY",
    independents: "INDEPENDENTS • DESIGN • COLLECTORS",
    design: "DESIGN • PROPORTION • DETAILS",
    history: "MODERN • VINTAGE CONTEXT • COLLECTORS",
    "middle east": "REGIONAL • CULTURE • COLLECTORS"
  };
  return tagsByCategory[category] || "INDEPENDENTS • DESIGN • COLLECTORS";
}

function formatDate(dateString){
  if(!dateString) return "";
  const date = new Date(dateString);
  if(Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getReadingTime(content){
  if(!content) return 1;
  const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function getHeroImage(post){
  if(post.image) return post.image;
  if(post.thumbnail) return post.thumbnail;
  if(post.content_html){
    const match = post.content_html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if(match && match[1]) return match[1];
  }
  return "/images/Article-1.jpg";
}


async function renderArticlesGrid(){
  const holder = document.getElementById("articles-grid");
  if(!holder) return;
  const posts = await loadPosts();
  holder.innerHTML = posts.map(postCardHTML).join("");
}

async function renderArticle(){
  const titleEl = document.getElementById("article-title");
  const categoryEl = document.getElementById("article-category");
  const dateEl  = document.getElementById("article-date");
  const readTimeEl = document.getElementById("article-reading-time");
  const ledeEl  = document.getElementById("article-excerpt");
  const bodyEl  = document.getElementById("article-body");
  const heroImgEl = document.getElementById("article-hero-image");
  const relatedEl = document.getElementById("related-stories");

  if(!titleEl || !categoryEl || !dateEl || !readTimeEl || !ledeEl || !bodyEl) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const posts = await loadPosts();
  const post = posts.find(p => p.id === id) || posts[0];

  titleEl.textContent = post.title;
  categoryEl.textContent = post.category || "Article";
  dateEl.textContent  = formatDate(post.date);
  readTimeEl.textContent = `${getReadingTime(post.content_html)} min read`;
  ledeEl.textContent  = post.excerpt;
  bodyEl.innerHTML    = post.content_html;

  if(heroImgEl){
    const heroSrc = getHeroImage(post);
    const heroWrap = heroImgEl.closest(".article-hero-media");
    if(post.id === "independents-replacing-hype-001"){
      if(heroWrap){
        heroWrap.hidden = true;
        heroWrap.setAttribute("aria-hidden", "true");
      }
      heroImgEl.removeAttribute("src");
      heroImgEl.removeAttribute("alt");
    }else{
      if(heroWrap){
        heroWrap.hidden = false;
        heroWrap.removeAttribute("aria-hidden");
      }
      heroImgEl.src = heroSrc;
      heroImgEl.alt = post.title || "Featured image";
    }
  }

  if(relatedEl){
    const relatedPosts = posts.filter(item => item.id !== post.id).slice(0, 3);
    if(relatedPosts.length === 0){
      relatedEl.innerHTML = "<p class=\"empty-state\">More coming soon.</p>";
    }else{
      relatedEl.innerHTML = relatedPosts.map(postCardHTML).join("");
    }
  }
}

document.addEventListener("DOMContentLoaded", async ()=>{
  initDropdowns();
  initClocks();
  initMobileNav();
  initStickyHeader();
  initMobileCta();

  // Ensure the hero CTA appears only once if duplicate markup gets served.
  const heroCtas = document.querySelectorAll(".hero .cta");
  heroCtas.forEach((cta, index)=>{
    if(index > 0) cta.remove();
  });

  // footer year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // page-specific rendering
  const page = document.body.getAttribute("data-page");

  try{
    if(page === "home") await renderHomeLatest();
    if(page === "articles") await renderArticlesGrid();
    if(page === "article") await renderArticle();
  }catch(err){
    console.warn(err);
  }
});

// Premium per-article audio player (injects on article pages when audioUrl exists)
(function () {
  const SPEEDS = [1, 1.25, 1.5, 1.75, 2];

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function storageKey(slug) {
    return `bezeru_audio_progress:${slug}`;
  }

  function getSlugFromUrl() {
    const path = location.pathname.split("/").pop() || "";
    return path.replace(".html", "");
  }

  async function loadPosts() {
    const res = await fetch("/posts.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load posts.json: ${res.status}`);
    const data = await res.json();
    return data.posts || [];
  }

  function findPostForCurrentPage(posts) {
    const slug = getSlugFromUrl();
    return posts.find(p => (p.url || "").includes(slug)) || null;
  }

  function buildPlayer({ title, category, dateLabel, audioUrl, slug }) {
    const wrap = document.createElement("section");
    wrap.className = "audio-bar";
    wrap.innerHTML = `
      <div class="audio-bar__left">
        <button class="audio-bar__btn audio-bar__play" type="button" aria-label="Play">
          <span class="audio-bar__icon" data-icon="play">▶</span>
        </button>
      </div>

      <div class="audio-bar__mid">
        <div class="audio-bar__meta">
          <div class="audio-bar__kicker">Listen</div>
          <div class="audio-bar__title"></div>
          <div class="audio-bar__sub"></div>
        </div>

        <div class="audio-bar__timeline" role="slider" aria-label="Audio progress" tabindex="0">
          <div class="audio-bar__track"></div>
          <div class="audio-bar__fill"></div>
          <div class="audio-bar__thumb"></div>
        </div>

        <div class="audio-bar__time">
          <span class="audio-bar__current">0:00</span>
          <span class="audio-bar__sep">/</span>
          <span class="audio-bar__duration">0:00</span>
        </div>
      </div>

      <div class="audio-bar__right">
        <button class="audio-bar__btn audio-bar__speed" type="button" aria-label="Playback speed">1x</button>
      </div>

      <audio class="audio-bar__audio" preload="metadata"></audio>
    `;

    wrap.querySelector(".audio-bar__title").textContent = title || "Listen to this article";
    wrap.querySelector(".audio-bar__sub").textContent = `${category || ""}${dateLabel ? " · " + dateLabel : ""}`.trim();

    const audio = wrap.querySelector(".audio-bar__audio");
    audio.src = audioUrl;

    const playBtn = wrap.querySelector(".audio-bar__play");
    const icon = wrap.querySelector(".audio-bar__icon");
    const currentEl = wrap.querySelector(".audio-bar__current");
    const durationEl = wrap.querySelector(".audio-bar__duration");
    const timeline = wrap.querySelector(".audio-bar__timeline");
    const fill = wrap.querySelector(".audio-bar__fill");
    const thumb = wrap.querySelector(".audio-bar__thumb");
    const speedBtn = wrap.querySelector(".audio-bar__speed");

    let speedIndex = 0;

    // Resume progress
    const saved = localStorage.getItem(storageKey(slug));
    if (saved) {
      const savedTime = Number(saved);
      if (isFinite(savedTime) && savedTime > 0) audio.currentTime = savedTime;
    }

    function setPlayingUI(playing) {
      icon.textContent = playing ? "❚❚" : "▶";
      icon.setAttribute("data-icon", playing ? "pause" : "play");
      playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
      wrap.classList.toggle("is-playing", playing);
    }

    function updateTimeline() {
      const dur = audio.duration || 0;
      const cur = audio.currentTime || 0;
      const pct = dur ? Math.min(1, Math.max(0, cur / dur)) : 0;
      fill.style.width = `${pct * 100}%`;
      thumb.style.left = `${pct * 100}%`;
      currentEl.textContent = formatTime(cur);
      if (dur) durationEl.textContent = formatTime(dur);
      localStorage.setItem(storageKey(slug), String(cur));
    }

    playBtn.addEventListener("click", async () => {
      try {
        if (audio.paused) {
          await audio.play();
          setPlayingUI(true);
        } else {
          audio.pause();
          setPlayingUI(false);
        }
      } catch (_) {
        // autoplay restrictions or load errors; fail silently
      }
    });

    audio.addEventListener("loadedmetadata", () => {
      durationEl.textContent = formatTime(audio.duration);
      updateTimeline();
    });

    audio.addEventListener("timeupdate", updateTimeline);
    audio.addEventListener("pause", () => setPlayingUI(false));
    audio.addEventListener("play", () => setPlayingUI(true));
    audio.addEventListener("ended", () => setPlayingUI(false));

    function seekTo(clientX) {
      const rect = timeline.getBoundingClientRect();
      const x = Math.min(rect.right, Math.max(rect.left, clientX));
      const pct = (x - rect.left) / rect.width;
      if (audio.duration) audio.currentTime = pct * audio.duration;
      updateTimeline();
    }

    let dragging = false;

    timeline.addEventListener("mousedown", (e) => {
      dragging = true;
      seekTo(e.clientX);
    });
    window.addEventListener("mousemove", (e) => {
      if (dragging) seekTo(e.clientX);
    });
    window.addEventListener("mouseup", () => {
      dragging = false;
    });

    timeline.addEventListener("keydown", (e) => {
      if (!audio.duration) return;
      const step = 5;
      if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration, audio.currentTime + step);
      if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - step);
      updateTimeline();
    });

    speedBtn.addEventListener("click", () => {
      speedIndex = (speedIndex + 1) % SPEEDS.length;
      audio.playbackRate = SPEEDS[speedIndex];
      speedBtn.textContent = `${SPEEDS[speedIndex]}x`;
    });

    return wrap;
  }

  async function initPremiumAudioBar() {
    const isArticle = location.pathname.includes("/articles/");
    if (!isArticle) return;

    const article = document.querySelector("article") || document.querySelector("main");
    if (!article) return;

    let posts;
    try {
      posts = await loadPosts();
    } catch (_) {
      return;
    }

    const post = findPostForCurrentPage(posts);
    if (!post || !post.audioUrl) return;

    const slug = getSlugFromUrl();
    const player = buildPlayer({
      title: post.title,
      category: post.category,
      dateLabel: post.dateLabel || "",
      audioUrl: post.audioUrl,
      slug
    });

    article.insertBefore(player, article.firstElementChild);
  }

  document.addEventListener("DOMContentLoaded", initPremiumAudioBar);
})();


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("subscribe-form");
  const input = document.getElementById("subscribe-email");
  const button = document.getElementById("subscribe-button");
  const statusEl = document.getElementById("subscribe-status");
  if (!form || !input || !button || !statusEl) return;

  // TODO: replace after deploying Worker
  const WORKER_ENDPOINT = "YOUR_WORKER_URL"; // e.g. https://bezeru-subscribe.yourname.workers.dev/subscribe

  const baseParams = () => ({
    location: form.dataset.location || "unknown",
    page_path: window.location.pathname
  });

  function ga(eventName, extra = {}) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, { ...baseParams(), ...extra });
    }
  }

  input.addEventListener(
    "focus",
    () => ga("subscribe_focus"),
    { once: true }
  );

  function setStatus(kind, msg) {
    statusEl.classList.remove("is-success", "is-error");
    if (kind) statusEl.classList.add(kind === "success" ? "is-success" : "is-error");
    statusEl.textContent = msg;
  }

  function setLoading(isLoading) {
    button.classList.toggle("is-loading", isLoading);
    button.disabled = isLoading;
    button.textContent = isLoading ? "Subscribing…" : "Subscribe";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = String(input.value || "").trim().toLowerCase();
    const hp = form.querySelector('input[name="hp"]')?.value || "";

    ga("subscribe_submit");

    if (!email) {
      setStatus("error", "Please enter your email.");
      ga("subscribe_error", { error_reason: "empty_email" });
      return;
    }

    setLoading(true);
    setStatus("", "");

    try {
      const res = await fetch(WORKER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, hp })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data && data.ok) {
        setStatus("success", "You’re in. Check your inbox to confirm.");
        input.value = "";
        ga("subscribe_success");
      } else {
        const reason = (data && data.error) ? String(data.error) : `http_${res.status}`;
        setStatus("error", "Something went wrong. Please try again.");
        ga("subscribe_error", { error_reason: reason.slice(0, 80) });
      }
    } catch (err) {
      setStatus("error", "Network error. Please try again.");
      ga("subscribe_error", { error_reason: "network_error" });
    } finally {
      setLoading(false);
    }
  });
});
