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
   POSTS RENDERING
========================= */
const FEATURED_POST_ID = "independents-replacing-hype-001";

async function loadArticles(){
  const res = await fetch("articles.json", { cache: "no-store" });
  if(!res.ok) throw new Error("Could not load articles.json");
  const data = await res.json();
  return data.articles || [];
}

function postCardHTML(post, opts = {}){
  const image = post.image || post.thumbnail || "/images/Article-1.jpg";
  const dateLabel = formatDate(post.date);
  const readTime = formatReadingTime(post);
  const href = post.url || `article.html?id=${encodeURIComponent(post.id)}`;
  const isFeatured = opts.featured ? " card-featured" : "";
  return `
    <article class="card${isFeatured}" data-card-link="${href}" tabindex="0" role="link" aria-label="${post.title}">
      <a class="card-media" href="${href}">
        <img class="card-image" src="${image}" alt="${post.title}" loading="lazy" decoding="async" />
      </a>
      <div class="card-body">
        <div class="card-kicker">${post.category || "Latest"}</div>
        <h3 class="card-title">
          <a href="${href}">${post.title}</a>
        </h3>
        <p class="card-excerpt">${post.excerpt || ""}</p>
        <div class="card-meta-row">
          <time datetime="${post.date || ""}">${dateLabel}</time>
          <span>${readTime}</span>
        </div>
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

function formatReadingTime(post){
  const minutes = post.reading_time || getReadingTime(post.content_html);
  return `${minutes} min read`;
}

function renderArticleNav(currentId, articles){
  const navEl = document.getElementById("article-nav");
  if(!navEl || !currentId) return;
  const sorted = [...articles].sort((a, b)=> new Date(a.date || 0) - new Date(b.date || 0));
  const index = sorted.findIndex(item => item.id === currentId);
  if(index === -1) return;
  const prev = sorted[index - 1];
  const next = sorted[index + 1];
  navEl.innerHTML = `
    <div class="article-nav-links">
      ${prev ? `<a class="article-nav-link" href="${prev.url}">← ${prev.title}</a>` : ""}
      ${next ? `<a class="article-nav-link" href="${next.url}">${next.title} →</a>` : ""}
    </div>
  `;
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

async function renderHomeLatest(articles){
  const holder = document.getElementById("home-latest");
  if(!holder) return;
  if(holder.children.length > 0) return;
  const data = articles || await loadArticles();
  const sortedPosts = [...data].sort((a, b)=> new Date(b.date || 0) - new Date(a.date || 0));
  if(sortedPosts.length === 0){
    holder.innerHTML = "<p class=\"empty-state\">More coming soon.</p>";
    return;
  }
  holder.innerHTML = sortedPosts.slice(0,3).map((post)=> postCardHTML(post)).join("");
}

async function renderLatestFeatured(articles){
  const holder = document.getElementById("latest-featured");
  if(!holder) return;
  const data = articles || await loadArticles();
  const sorted = [...data].sort((a, b)=> new Date(b.date || 0) - new Date(a.date || 0));
  if(sorted.length === 0){
    holder.innerHTML = "<p class=\"empty-state\">More coming soon.</p>";
    return;
  }
  holder.innerHTML = postCardHTML(sorted[0], { featured: true });
}

async function renderArchivePreview(articles){
  const holder = document.getElementById("archive-preview");
  if(!holder) return;
  const data = articles || await loadArticles();
  const sorted = [...data].sort((a, b)=> new Date(b.date || 0) - new Date(a.date || 0));
  holder.innerHTML = sorted.slice(0, 6).map(postCardHTML).join("");
}

async function renderArchivePage(){
  const grid = document.getElementById("archive-grid");
  const filters = document.querySelectorAll("[data-filter]");
  const search = document.getElementById("archive-search");
  if(!grid) return;
  const articles = await loadArticles();
  const sorted = [...articles].sort((a, b)=> new Date(b.date || 0) - new Date(a.date || 0));
  grid.innerHTML = sorted.map(postCardHTML).join("");

  function applyFilter(){
    const term = (search?.value || "").toLowerCase();
    const active = document.querySelector("[data-filter].is-active")?.dataset.filter || "all";
    const cards = grid.querySelectorAll(".card");
    cards.forEach(card=>{
      const title = card.querySelector(".card-title")?.textContent.toLowerCase() || "";
      const excerpt = card.querySelector(".card-excerpt")?.textContent.toLowerCase() || "";
      const kicker = card.querySelector(".card-kicker")?.textContent.toLowerCase() || "";
      const matchesTerm = !term || title.includes(term) || excerpt.includes(term);
      const matchesFilter = active === "all" || kicker.includes(active);
      card.style.display = matchesTerm && matchesFilter ? "" : "none";
    });
  }

  filters.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      filters.forEach(item=> item.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyFilter();
    });
  });

  search?.addEventListener("input", applyFilter);
}
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
  const posts = await loadArticles();
  const post = posts.find(p => p.id === id) || posts[0];

  titleEl.textContent = post.title;
  categoryEl.textContent = post.category || "Article";
  dateEl.textContent  = formatDate(post.date);
  readTimeEl.textContent = formatReadingTime(post);
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

  renderArticleNav(post.id, posts);
}

function initCardClick(){
  document.querySelectorAll("[data-card-link]").forEach(card=>{
    card.addEventListener("click", (event)=>{
      if(event.target.closest("a")) return;
      const href = card.getAttribute("data-card-link");
      if(href) window.location.href = href;
    });
    card.addEventListener("keydown", (event)=>{
      if(event.key === "Enter" || event.key === " "){
        event.preventDefault();
        const href = card.getAttribute("data-card-link");
        if(href) window.location.href = href;
      }
    });
  });
}

function initSubscribeForms(){
  const forms = document.querySelectorAll(".subscribe-form");
  if(!forms.length) return;

  forms.forEach(form=>{
    const status = form.querySelector(".form-status");
    const endpoint = form.dataset.endpoint;
    if(!endpoint) return;

    form.addEventListener("submit", async (event)=>{
      event.preventDefault();
      const formData = new FormData(form);
      if(formData.get("email_address")){
        return;
      }
      if(status) status.textContent = "Submitting…";
      try{
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData
        });
        if(res.ok){
          form.reset();
          if(status) status.textContent = "Thanks for subscribing.";
        }else{
          if(status) status.textContent = "Something went wrong. Please try again.";
        }
      }catch(err){
        if(status) status.textContent = "Something went wrong. Please try again.";
      }
    });
  });
}

async function initStaticArticleNav(){
  const currentId = document.body.dataset.articleId;
  if(!currentId) return;
  const articles = await loadArticles();
  renderArticleNav(currentId, articles);
}

function initComments(){
  document.querySelectorAll("[data-load-comments]").forEach(button=>{
    button.addEventListener("click", ()=>{
      const placeholder = button.parentElement?.querySelector(".comment-placeholder");
      if(placeholder){
        placeholder.textContent = "Comments will appear here once the discussion space is enabled.";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", async ()=>{
  initDropdowns();
  initClocks();
  initMobileNav();
  initStickyHeader();
  initSubscribeForms();
  initComments();

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
    if(page === "home") {
      const articles = await loadArticles();
      await renderLatestFeatured(articles);
      await renderArchivePreview(articles);
      await renderHomeLatest(articles);
    }
    if(page === "archive") await renderArchivePage();
    if(page === "article") await renderArticle();
    if(page === "static-article") await initStaticArticleNav();
  }catch(err){
    console.warn(err);
  }finally{
    initCardClick();
  }
});
