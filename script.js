/* =========================
   DROPDOWNS (stable)
========================= */
function initUnifiedHeader(){
  const header = document.querySelector("header");
  if(!header) return;
  if(header.dataset.sharedHeader === "true") return;

  const link = (path)=> {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    return lang ? `${path}?lang=${encodeURIComponent(lang)}` : path;
  };
  const linkWithLang = (langCode) => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", langCode);
    return `${url.pathname}${url.search}`;
  };
  const activeLang = (new URL(window.location.href)).searchParams.get("lang");
  const langLabel = activeLang === "ar" ? "AR" : "EN";

  header.innerHTML = `
    <div class="container">
      <div class="header-row">
        <a class="brand" href="${link("/index.html")}">
          <div class="word">BEZERU</div>
        </a>
        <div class="header-spacer"></div>
      </div>
    </div>

    <div class="nav-wrap">
      <div class="container nav-shell">
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav-panel" aria-label="Toggle navigation">
          <span class="nav-toggle-bars" aria-hidden="true">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </span>
          <span class="nav-toggle-label">Menu</span>
        </button>
        <nav id="primary-nav" aria-label="Primary">
          <div class="nav-overlay" data-nav-overlay aria-hidden="true"></div>
          <div id="primary-nav-panel" class="nav-panel">
            <button class="nav-close" type="button" aria-label="Close menu">✕</button>
            <div class="nav-links">
              <a class="nav-link" href="${link("/index.html")}">Home</a>
              <a class="nav-link" href="${link("/articles.html#latest")}">Read</a>
              <a class="nav-link" href="${link("/types.html")}">Types</a>
              <a class="nav-link" href="${link("/brands.html")}">Brands</a>
              <a class="nav-link" href="${link("/about.html")}">About</a>
            </div>
            <div class="nav-utilities">
              <a class="nav-cta" href="${link("/shop.html")}">Shop <span aria-hidden="true">→</span></a>
              <div class="lang-menu" data-lang-menu>
                <button class="lang-menu__toggle" type="button" aria-expanded="false" aria-haspopup="true">${langLabel} ▾</button>
                <div class="lang-menu__list" role="menu" aria-label="Language">
                  <a class="lang-menu__link" role="menuitem" href="${linkWithLang("en")}">EN</a>
                  <a class="lang-menu__link" role="menuitem" href="${linkWithLang("ar")}">AR</a>
                  <span class="lang-menu__link is-disabled" aria-disabled="true">FR</span>
                  <span class="lang-menu__link is-disabled" aria-disabled="true">DE</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <div class="clock-strip" aria-label="World clock">
      <div class="container clock-strip__inner">
        <span><strong>NEW YORK</strong> <em data-city-time="ny">--:--</em></span>
        <span><strong>LONDON</strong> <em data-city-time="london">--:--</em></span>
        <span><strong>GENEVA</strong> <em data-city-time="geneva">--:--</em></span>
        <span><strong>TOKYO</strong> <em data-city-time="tokyo">--:--</em></span>
      </div>
    </div>
  `;

  header.dataset.sharedHeader = "true";
}

initUnifiedHeader();

function initUnifiedFooter(){
  const footer = document.querySelector("footer.footer-pro");
  if(!footer) return;
  if(footer.dataset.sharedFooter === "true") return;

  const prefix = location.pathname.includes("/articles/") ? "../" : "";
  const subscribeCol = "";
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">BEZERU</div>
          <div class="footer-text">Modern + vintage watch editorial focused on design, proportion, culture, and the underdogs shaping modern taste.</div>
        </div>
        ${subscribeCol}
        <div class="footer-col">
          <h4>Contact me</h4>
          <div class="footer-links">
            <a href="mailto:yousef.qubain@gmail.com?subject=BEZERU%20—%20Hello">Email</a>
            <a href="#" aria-disabled="true">Instagram</a>
            <span class="coming-soon">X (Coming soon)</span>
          </div>
        </div>
        <div class="footer-col">
          <h4>Policies</h4>
          <div class="footer-legal">
            <a href="${prefix}editorial-policy.html">Editorial Policy</a> ·
            <a href="${prefix}contributors-policy.html">Contributors</a> ·
            <a href="${prefix}affiliate-policy.html">Affiliate Disclosure</a> ·
            <a href="${prefix}disclaimer-policy.html">Disclaimer</a> ·
            <a href="${prefix}privacy-policy.html">Privacy Policy</a> ·
            <a href="${prefix}terms-policy.html">Terms</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div>© <span id="footer-year"></span> BEZERU. All rights reserved.</div>
      </div>
    </div>
  `;
  footer.dataset.sharedFooter = "true";
}

initUnifiedFooter();

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
  const closeBtn = panel ? panel.querySelector(".nav-close") : null;
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
  closeBtn?.addEventListener("click", closeNav);

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

function initClockStrip(){
  const nodes = {
    ny: document.querySelector('[data-city-time="ny"]'),
    london: document.querySelector('[data-city-time="london"]'),
    geneva: document.querySelector('[data-city-time="geneva"]'),
    tokyo: document.querySelector('[data-city-time="tokyo"]')
  };
  if(Object.values(nodes).every(v => !v)) return;
  const format = (tz)=> new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
  const tick = ()=>{
    if(nodes.ny) nodes.ny.textContent = format("America/New_York");
    if(nodes.london) nodes.london.textContent = format("Europe/London");
    if(nodes.geneva) nodes.geneva.textContent = format("Europe/Zurich");
    if(nodes.tokyo) nodes.tokyo.textContent = format("Asia/Tokyo");
  };
  tick();
  setInterval(tick, 60000);
}

function initLanguageMenu(){
  const menu = document.querySelector("[data-lang-menu]");
  if(!menu) return;
  const button = menu.querySelector(".lang-menu__toggle");
  const toggle = (open)=>{
    menu.classList.toggle("is-open", open);
    button?.setAttribute("aria-expanded", String(open));
  };
  button?.addEventListener("click", ()=> toggle(!menu.classList.contains("is-open")));
  document.addEventListener("click", (e)=> { if(!menu.contains(e.target)) toggle(false); });
  document.addEventListener("keydown", (e)=> { if(e.key === "Escape") toggle(false); });
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
  const subscribedKey = "bezeru-subscribed-session";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let isInSubscribe = false;
  let eligibleToShow = false;

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
    if(!eligibleToShow || isDismissed() || sessionStorage.getItem(subscribedKey) === "1" || isInSubscribe){
      setVisible(false);
      return;
    }
    setVisible(true);
  }

  action.addEventListener("click", ()=>{
    sessionStorage.setItem(subscribedKey, "1");
    setVisible(false);
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

  setTimeout(() => {
    eligibleToShow = true;
    updateVisibility();
  }, 45000);
  document.addEventListener("mouseleave", (e) => {
    if(e.clientY <= 0){
      eligibleToShow = true;
      updateVisibility();
    }
  });
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

function normalizeCategoryKey(category = ""){
  const value = category.trim().toLowerCase();
  if(value.includes("underdogs") || value.includes("indie") || value.includes("independents")) return "underdogs";
  if(value.includes("design icons") || value.includes("vintage")) return "vintage-design-icons";
  if(value.includes("innovation") || value.includes("industry")) return "innovation-industry";
  if(value === "design") return "design";
  if(value.includes("middle east") || value.includes("culture")) return "middle-east-culture";
  if(value.includes("guides") || value.includes("guide")) return "guides";
  return "default";
}

function getExcerptReadingTime(excerpt = ""){
  const text = (excerpt || "").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(2, Math.round(words / 200) || 0);
}

function postCardHTML(post){
  const localizedPost = window.BEZERU_I18N?.localizePost ? window.BEZERU_I18N.localizePost(post) : post;
  const dateLabel = formatDate(localizedPost.date);
  const readingTime = getExcerptReadingTime(localizedPost.excerpt || "");
  const categoryKey = normalizeCategoryKey(localizedPost.category || "");
  const rawHref = post.url || `article.html?id=${encodeURIComponent(post.id)}`;
  const href = window.BEZERU_I18N?.localizeHref ? window.BEZERU_I18N.localizeHref(rawHref) : rawHref;
  return `
    <article class="card">
      <div class="card-body">
        <div class="meta">
          <span class="tag category-badge" data-category-key="${categoryKey}">${localizedPost.category || "Latest"}</span>
          <time datetime="${localizedPost.date || ""}">${dateLabel}</time>
          <span class="card-read-time">· ${readingTime} min read</span>
        </div>
        <h3 class="card-title">
          <a href="${href}">${localizedPost.title}</a>
        </h3>
        <p class="card-excerpt">${localizedPost.excerpt || ""}</p>
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
  const locale = window.BEZERU_I18N?.locale === "ar" ? "ar-SA" : "en-US";
  return date.toLocaleDateString(locale, { month: "short", year: "numeric" });
}

function getReadingTime(content){
  if(!content) return 1;
  const text = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function enhanceStaticCardMeta(){
  const cards = document.querySelectorAll(".card");
  cards.forEach((card)=>{
    const categoryEl = card.querySelector(".meta .tag");
    if(categoryEl){
      categoryEl.classList.add("category-badge");
      categoryEl.dataset.categoryKey = normalizeCategoryKey(categoryEl.textContent || "");
    }

    const meta = card.querySelector(".meta");
    const excerpt = card.querySelector(".card-excerpt")?.textContent || "";
    if(meta && !meta.querySelector(".card-read-time")){
      const read = document.createElement("span");
      read.className = "card-read-time";
      read.textContent = `· ${getExcerptReadingTime(excerpt)} min read`;
      meta.appendChild(read);
    }
  });
}

async function renderHomeLatestFeed(){
  const holder = document.getElementById("home-latest");
  if(!holder) return;

  const normalizeSlug = (href)=>{
    if(!href) return "";
    const url = new URL(href, window.location.origin + window.location.pathname);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments.length ? segments[segments.length - 1].toLowerCase() : "";
  };

  const existingLinks = new Set();
  holder.querySelectorAll(".card").forEach((card)=>{
    const articleLink = card.querySelector(".card-title a[href]");
    const slug = normalizeSlug(articleLink?.getAttribute("href") || "");
    if(!slug) return;
    existingLinks.add(slug);
  });

  const posts = await loadPosts();
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const missing = sorted.filter(post => {
    const slug = normalizeSlug(post.url || `article.html?id=${encodeURIComponent(post.id)}`);
    return slug && !existingLinks.has(slug);
  });

  if(missing.length === 0) return;
  holder.insertAdjacentHTML("beforeend", missing.map(postCardHTML).join(""));
}

async function renderArticlesGrid(){
  const holder = document.getElementById("articles-grid");
  if(!holder) return;
  const posts = await loadPosts();
  const chips = Array.from(document.querySelectorAll(".filter-chip[data-filter]"));

  function paint(filter){
    const visible = filter === "all"
      ? posts
      : posts.filter(post => (post.category || "").toLowerCase() === filter.toLowerCase());

    holder.innerHTML = visible.length
      ? visible.map(postCardHTML).join("")
      : `<p class="empty-state">${window.BEZERU_I18N?.t("noStories") || "No stories in this section yet."}</p>`;
  }

  paint("all");

  chips.forEach(chip => {
    chip.addEventListener("click", ()=>{
      chips.forEach(item => item.classList.remove("is-active"));
      chip.classList.add("is-active");
      paint(chip.dataset.filter || "all");
    });
  });
}

async function renderArticle(){
  const titleEl = document.getElementById("article-title");
  const categoryEl = document.getElementById("article-category");
  const dateEl  = document.getElementById("article-date");
  const readTimeEl = document.getElementById("article-reading-time");
  const ledeEl  = document.getElementById("article-excerpt");
  const bodyEl  = document.getElementById("article-body");
  const relatedEl = document.getElementById("related-stories");

  if(!titleEl || !categoryEl || !dateEl || !readTimeEl || !ledeEl || !bodyEl) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const posts = await loadPosts();
  const post = posts.find(p => p.id === id) || posts[0];
  const localizedPost = window.BEZERU_I18N?.localizePost ? window.BEZERU_I18N.localizePost(post) : post;

  titleEl.textContent = localizedPost.title;
  categoryEl.textContent = localizedPost.category || "Article";
  dateEl.textContent  = formatDate(localizedPost.date);
  if(window.BEZERU_I18N?.locale === "ar"){
    readTimeEl.textContent = `${getReadingTime(post.content_html)} ${window.BEZERU_I18N.t("readTime")}`;
  }else{
    readTimeEl.textContent = `${getReadingTime(post.content_html)} min read`;
  }
  ledeEl.textContent  = localizedPost.excerpt;
  bodyEl.innerHTML = (post.content_html || "")
    .replace(/<audio\b[^>]*\bcontrols\b[^>]*>[\s\S]*?<\/audio>/gi, "")
    .replace(/<audio\b[^>]*\bsrc=["'][^"']*independents-that-are-quietly-replacing-hype\.mp3[^"']*["'][^>]*\/?>/gi, "")
    .replace(/<figure[^>]*>[\s\S]*?<img[\s\S]*?<\/figure>/gi, "")
    .replace(/<img\b[^>]*>/gi, "");

  if(relatedEl){
    const relatedPosts = posts.filter(item => item.id !== post.id).slice(0, 3);
    if(relatedPosts.length === 0){
      relatedEl.innerHTML = `<p class="empty-state">${window.BEZERU_I18N?.t("moreSoon") || "More coming soon."}</p>`;
    }else{
      relatedEl.innerHTML = relatedPosts.map(postCardHTML).join("");
    }
  }
}

function initHeroWatchFace(){
  const svg = document.getElementById("hero-watch-face");
  if(!svg) return;

  const ticksGroup = document.getElementById("hero-watch-ticks");
  if(ticksGroup && ticksGroup.childElementCount === 0){
    for(let i = 0; i < 60; i += 1){
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const angle = (Math.PI * 2 * i) / 60;
      const isQuarter = i % 5 === 0;
      const rOuter = 56;
      const rInner = isQuarter ? 48 : 52;
      const x1 = 65 + Math.sin(angle) * rInner;
      const y1 = 65 - Math.cos(angle) * rInner;
      const x2 = 65 + Math.sin(angle) * rOuter;
      const y2 = 65 - Math.cos(angle) * rOuter;
      line.setAttribute("x1", x1.toFixed(2));
      line.setAttribute("y1", y1.toFixed(2));
      line.setAttribute("x2", x2.toFixed(2));
      line.setAttribute("y2", y2.toFixed(2));
      line.setAttribute("class", isQuarter ? "watch-tick watch-tick-major" : "watch-tick");
      ticksGroup.appendChild(line);
    }
  }

  const hour = document.getElementById("hero-watch-hour");
  const minute = document.getElementById("hero-watch-minute");
  const second = document.getElementById("hero-watch-second");
  const secondTail = document.getElementById("hero-watch-second-tail");
  if(!hour || !minute || !second || !secondTail) return;

  const update = ()=>{
    const now = new Date();
    const ms = now.getMilliseconds();
    const sec = now.getSeconds() + ms / 1000;
    const min = now.getMinutes() + sec / 60;
    const hr = (now.getHours() % 12) + min / 60;
    hour.setAttribute("transform", `rotate(${hr * 30} 65 65)`);
    minute.setAttribute("transform", `rotate(${min * 6} 65 65)`);
    second.setAttribute("transform", `rotate(${sec * 6} 65 65)`);
    secondTail.setAttribute("transform", `rotate(${sec * 6} 65 65)`);
  };

  update();
  setInterval(update, 100);
}

function initBrandsTeaser(){
  const root = document.getElementById("brands-teaser");
  if(!root) return;
  const panelName = document.getElementById("brands-name");
  const panelDescription = document.getElementById("brands-description");
  const panelMeta = document.getElementById("brands-meta");
  const panelLink = document.getElementById("brands-link");
  const pills = Array.from(root.querySelectorAll(".brand-pill"));
  if(!panelName || !panelDescription || !panelMeta || !panelLink || pills.length === 0) return;

  const brandData = {
    Rolex: {
      description: "The reference point for tool watches — obsessively refined over decades, deeply wearable, and impossible to ignore on the wrist.",
      meta: ["Founded 1905", "Switzerland", "Tool / Sport"],
      href: "brands.html#rolex"
    },
    Cartier: {
      description: "Where jewellery meets horology — Cartier’s watches are among the most architecturally distinctive objects in the market.",
      meta: ["Founded 1847", "France", "Dress / Artistic"],
      href: "brands.html#cartier"
    },
    Piaget: {
      description: "Specialists in ultra-thin movements and high jewellery, Piaget operates at the intersection of watchmaking and fine art.",
      meta: ["Founded 1874", "Switzerland", "Ultra-thin / Luxury"],
      href: "brands.html#piaget"
    },
    IWC: {
      description: "Schaffhausen’s answer to serious complications — IWC builds pilots and engineers’ watches with German rigour and Swiss precision.",
      meta: ["Founded 1868", "Switzerland", "Pilot / Dress"],
      href: "brands.html#iwc"
    }
  };

  function paint(brand){
    const data = brandData[brand];
    if(!data) return;
    panelName.textContent = brand;
    panelDescription.textContent = data.description;
    panelMeta.innerHTML = data.meta.map(item => `<span class="brands-chip">${item}</span>`).join("");
    panelLink.textContent = `Read more about ${brand} →`;
    panelLink.setAttribute("href", data.href);
    pills.forEach(pill => pill.classList.toggle("is-active", pill.dataset.brand === brand));
  }

  pills.forEach((pill)=>{
    pill.addEventListener("click", ()=> paint(pill.dataset.brand));
  });

  paint(root.dataset.defaultBrand || "Rolex");
}

function initArticleProgressBar(){
  if(!location.pathname.includes("/articles/")) return;
  if(document.getElementById("reading-progress")) return;

  const bar = document.createElement("div");
  bar.id = "reading-progress";
  bar.className = "reading-progress";
  document.body.appendChild(bar);

  const update = ()=>{
    const max = document.body.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initMobileCardTapTargets(){
  if(window.innerWidth > 767) return;
  const cards = document.querySelectorAll(".card, .pathway, .related-stories .card");
  cards.forEach((card)=>{
    const link = card.querySelector("a[href]");
    if(!link) return;
    if(link.closest(".nav-panel, .footer-pro")) return;
    card.style.cursor = "pointer";
    card.addEventListener("click", (event)=>{
      if(event.target.closest("a, button, input, textarea, select")) return;
      window.location.href = link.href;
    });
  });
}

document.addEventListener("DOMContentLoaded", async ()=>{
  initClockStrip();
  initLanguageMenu();
  initDropdowns();
  initMobileNav();
  initStickyHeader();
  initMobileCta();
  initHeroWatchFace();
  initBrandsTeaser();
  initArticleProgressBar();
  initMobileCardTapTargets();
  enhanceStaticCardMeta();

  // Ensure the hero CTA appears only once if duplicate markup gets served.
  const heroCtas = document.querySelectorAll(".hero .cta");
  heroCtas.forEach((cta, index)=>{
    if(index > 0) cta.remove();
  });

  // footer year (site started in 2026)
  const y = document.getElementById("footer-year");
  if (y) {
    y.textContent = String(new Date().getFullYear());
  }

  // page-specific rendering
  const page = document.body.getAttribute("data-page");

  try{
    if(page === "home") await renderHomeLatestFeed();
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

  function formatMonthYear(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }

  async function loadPosts() {
    const res = await fetch("/posts.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load posts.json: ${res.status}`);
    const data = await res.json();
    return data.posts || [];
  }

  function findPostForCurrentPage(posts) {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (id) {
      const byId = posts.find(p => p.id === id);
      if (byId) return byId;
    }

    const slug = getSlugFromUrl();
    return posts.find(p => (p.url || "").includes(slug)) || null;
  }

  function buildPlayer({ title, category, dateLabel, audioUrl, slug, hasAudio }) {
    const wrap = document.createElement("section");
    wrap.className = "audio-bar";
    if (!hasAudio) wrap.classList.add("is-disabled");
    wrap.innerHTML = `
      <div class="audio-bar__left">
        <button class="audio-bar__btn audio-bar__play" type="button" aria-label="Play" ${hasAudio ? "" : "disabled"}>
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
        <button class="audio-bar__btn audio-bar__speed" type="button" aria-label="Playback speed" ${hasAudio ? "" : "disabled"}>1x</button>
      </div>

      <audio class="audio-bar__audio" preload="metadata"></audio>
    `;

    wrap.querySelector(".audio-bar__title").textContent = title || "Listen to this article";
    wrap.querySelector(".audio-bar__sub").textContent = hasAudio
      ? `${category || ""}${dateLabel ? " · " + dateLabel : ""}`.trim()
      : "Audio version coming soon";

    const audio = wrap.querySelector(".audio-bar__audio");
    if (hasAudio && audioUrl) audio.src = audioUrl;

    const playBtn = wrap.querySelector(".audio-bar__play");
    const icon = wrap.querySelector(".audio-bar__icon");
    const currentEl = wrap.querySelector(".audio-bar__current");
    const durationEl = wrap.querySelector(".audio-bar__duration");
    const timeline = wrap.querySelector(".audio-bar__timeline");
    const fill = wrap.querySelector(".audio-bar__fill");
    const thumb = wrap.querySelector(".audio-bar__thumb");
    const speedBtn = wrap.querySelector(".audio-bar__speed");

    let speedIndex = 0;

    if (!hasAudio) {
      timeline.setAttribute("aria-disabled", "true");
      timeline.tabIndex = -1;
      durationEl.textContent = "--:--";
      return wrap;
    }

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
    const pageType = document.body?.getAttribute("data-page");
    const isArticle = pageType === "static-article" || pageType === "article" || location.pathname.includes("/articles/");
    if (!isArticle) return;

    const article = document.querySelector(".article-shell") || document.querySelector("article") || document.querySelector("main");
    if (!article) return;
    if (article.querySelector(".audio-bar")) return;

    let posts;
    try {
      posts = await loadPosts();
    } catch (_) {
      return;
    }

    const post = findPostForCurrentPage(posts);
    if (!post) return;

    const slug = getSlugFromUrl();
    const player = buildPlayer({
      title: post.title,
      category: post.category,
      dateLabel: formatMonthYear(post.date),
      audioUrl: post.audioUrl,
      slug,
      hasAudio: Boolean(post.audioUrl)
    });

    article.insertBefore(player, article.firstElementChild);
  }

  document.addEventListener("DOMContentLoaded", initPremiumAudioBar);
})();



document.addEventListener("DOMContentLoaded", () => {
  if (document.body?.getAttribute("data-page") === "home") {
    const homeSections = Array.from(document.querySelectorAll(".section-subscribe-home"));
    homeSections.forEach((section, index) => {
      if (index > 0) section.remove();
    });
    document.querySelectorAll("footer .footer-subscribe").forEach((dup) => dup.remove());
  }

  const isArticlePage = document.body?.getAttribute("data-page") === "static-article"
    || document.body?.getAttribute("data-page") === "article"
    || location.pathname.includes("/articles/");

  if (isArticlePage) {
    const backLink = document.querySelector(".back-link");
    if (backLink) {
      backLink.textContent = "← Back to Articles";
      backLink.setAttribute("href", location.pathname.includes("/articles/") ? "../articles.html" : "articles.html");
    }
    const shell = document.querySelector(".article-shell");
    if (shell && !shell.querySelector(".article-hero-image")) {
      const heroImage = document.createElement("div");
      heroImage.className = "article-hero-image";
      heroImage.style.cssText = "width:100%;aspect-ratio:16/9;background:var(--color-surface);display:flex;align-items:center;justify-content:center;color:var(--color-text-secondary);font-size:14px;margin-bottom:32px;";
      heroImage.textContent = "[Article hero image]";
      const title = shell.querySelector(".article-title");
      if (title) shell.insertBefore(heroImage, title);
    }

    if (shell && !shell.querySelector(".article-share")) {
      const share = document.createElement("div");
      share.className = "article-share";
      const encodedUrl = encodeURIComponent(location.href);
      const articleTitle = encodeURIComponent(document.querySelector(".article-title")?.textContent?.trim() || "BEZERU Article");
      share.innerHTML = `
        <span>Share:</span>
        <button type="button" class="share-pill" data-copy-link>Copy link</button>
        <a class="share-pill" href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${articleTitle}" target="_blank" rel="noopener">Share on X</a>
        <a class="share-pill" href="https://wa.me/?text=${articleTitle}%20${encodedUrl}" target="_blank" rel="noopener">Share on WhatsApp</a>
      `;
      const authorBox = shell.querySelector(".article-author-box");
      if (authorBox) shell.insertBefore(share, authorBox.nextSibling);
      const copyBtn = share.querySelector("[data-copy-link]");
      copyBtn?.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(location.href);
          copyBtn.textContent = "Copied!";
          setTimeout(() => { copyBtn.textContent = "Copy link"; }, 2000);
        } catch (_) {}
      });
    }

    if (shell && !shell.querySelector(".article-subscribe")) {
      const subscribe = document.createElement("section");
      subscribe.className = "article-subscribe";
      subscribe.innerHTML = `
        <h2 class="footer-title">SUBSCRIBE</h2>
        <p class="footer-subtitle">For collectors who care about the details. New BEZERU stories on design, wearability, independents, and vintage — delivered quietly.</p>
        <form
          action="https://buttondown.com/api/emails/embed-subscribe/qubain"
          method="post"
          target="popupwindow"
          onsubmit="window.open('https://buttondown.com/qubain', 'popupwindow')"
          class="embeddable-buttondown-form bezeru-subscribe-form"
          data-location="article-end"
        >
          <label for="bd-email-article" class="bezeru-subscribe-label">Email address</label>
          <input
            type="email"
            name="email"
            id="bd-email-article"
            class="bezeru-subscribe-input"
            placeholder="Your email address"
            required
            autocomplete="email"
          />
          <button type="submit" class="bezeru-subscribe-button">Subscribe</button>
        </form>
        <p class="subscribe-note">No spam. Unsubscribe anytime.</p>
      `;
      const anchor = shell.querySelector(".article-author-box") || shell.lastElementChild;
      shell.insertBefore(subscribe, anchor);
    }

    if (shell) {
      loadPosts().then((posts)=>{
        if (shell.querySelector(".related-stories")) return;
        const currentPath = location.pathname.split("/").pop() || "";
        const current = posts.find(p => (p.url || "").includes(currentPath));
        const related = posts.filter(p => p.id !== current?.id).slice(0, 2);
        if (!related.length) return;
        const section = document.createElement("section");
        section.className = "related-stories";
        section.innerHTML = `
          <h2>Related stories</h2>
          <div class="card-grid">
            ${related.map(r => `<article class="card"><div class="card-body"><div class="meta"><span class="tag">${r.category || "Article"}</span><time datetime="${r.date || ""}">${formatDate(r.date)}</time></div><h3 class="card-title"><a href="${r.url}">${r.title}</a></h3><p class="card-excerpt">${r.excerpt || ""}</p></div></article>`).join("")}
          </div>
        `;
        shell.appendChild(section);
      }).catch(()=>{});
    }
  }

  const forms = document.querySelectorAll(".bezeru-subscribe-form");
  forms.forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const locationLabel = form.dataset.location || "unknown";

    const ga = (eventName, extra = {}) => {
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, {
          location: locationLabel,
          page_path: window.location.pathname,
          ...extra
        });
      }
    };

    if (input) {
      input.addEventListener("focus", () => ga("subscribe_focus"), { once: true });
    }

    form.addEventListener("submit", () => {
      ga("subscribe_submit");
      if (button) {
        button.textContent = "Opening…";
        setTimeout(() => { button.textContent = "Subscribe"; }, 1400);
      }
    });
  });
});
