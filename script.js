function initUnifiedHeader(){
  const header = document.querySelector("header");
  if(!header) return;
  if(header.dataset.sharedHeader === "true") return;
  if(header.classList.contains("bz-header")) return;
  if(document.getElementById("bzHeader")) return;

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
    <div class="container global-nav">
      <a class="brand" href="${link("/index.html")}" aria-label="BEZERU home">
        <div class="word">BEZERU</div>
      </a>

      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav-panel" aria-label="Open navigation menu">☰</button>

      <div class="nav-links" aria-label="Primary links">
        <a class="nav-link" href="${link("/index.html")}">Home</a>
        <a class="nav-link" href="${link("/articles.html#latest")}">Read</a>
        <a class="nav-link" href="${link("/types.html")}">Types</a>
        <a class="nav-link" href="${link("/brands.html")}">Brands</a>
        <a class="nav-link" href="${link("/intelligence.html")}">Intelligence</a>
        <a class="nav-link" href="${link("/about.html")}">About</a>
        <a class="nav-shop" href="${link("/shop.html")}">Shop</a>
      </div>

      <div class="nav-right">
        <div class="lang-menu" data-lang-menu>
          <button class="lang-menu__toggle" type="button" aria-expanded="false" aria-haspopup="true">${langLabel} ▾</button>
          <div class="lang-menu__list" role="menu" aria-label="Language selector">
            <a class="lang-menu__link" role="menuitem" href="${linkWithLang("en")}">English</a>
            <a class="lang-menu__link" role="menuitem" href="${linkWithLang("ar")}">العربية</a>
            <span class="lang-menu__link is-disabled" aria-disabled="true">Français (coming soon)</span>
            <span class="lang-menu__link is-disabled" aria-disabled="true">Deutsch (coming soon)</span>
          </div>
        </div>
      </div>

      <nav id="primary-nav" aria-label="Mobile">
        <div class="nav-overlay" data-nav-overlay aria-hidden="true"></div>
        <div id="primary-nav-panel" class="nav-panel" aria-hidden="true">
          <button class="nav-close" type="button" aria-label="Close menu">✕</button>
          <div class="nav-links">
            <a class="nav-link" href="${link("/index.html")}">Home</a>
            <a class="nav-link" href="${link("/articles.html#latest")}">Read</a>
            <a class="nav-link" href="${link("/types.html")}">Types</a>
            <a class="nav-link" href="${link("/brands.html")}">Brands</a>
            <a class="nav-link" href="${link("/intelligence.html")}">Intelligence</a>
            <a class="nav-link" href="${link("/about.html")}">About</a>
            <a class="nav-shop" href="${link("/shop.html")}">Shop</a>
          </div>
          <div class="nav-mobile-footer">
            <div class="nav-lang-line">
              <a href="${linkWithLang("en")}">EN</a>
              <a href="${linkWithLang("ar")}">AR</a>
              <span class="is-disabled">FR (coming soon)</span>
              <span class="is-disabled">DE (coming soon)</span>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <div class="clock-strip" aria-label="World clock">
      <div class="container clock-strip__inner">
        <span><strong>NEW YORK</strong> <em data-city-time="ny">--:--:--</em></span>
        <span><strong>LONDON</strong> <em data-city-time="london">--:--:--</em></span>
        <span><strong>GENEVA</strong> <em data-city-time="geneva">--:--:--</em></span>
        <span><strong>TOKYO</strong> <em data-city-time="tokyo">--:--:--</em></span>
      </div>
    </div>
  `;

  const currentPath = window.location.pathname === "/" ? "/index.html" : window.location.pathname;
  header.querySelectorAll(".nav-link, .nav-shop").forEach((anchor) => {
    const anchorPath = new URL(anchor.href, window.location.origin).pathname;
    if(anchorPath === currentPath) anchor.classList.add("active");
  });

  header.dataset.sharedHeader = "true";
}

initUnifiedHeader();

function forceBzHeaderStacking(){
  const header = document.getElementById("bzHeader");
  if(!header) return;

  header.style.display = "block";
  header.style.width = "100%";
  header.style.maxWidth = "none";
  header.style.minWidth = "100%";
  header.style.flexDirection = "column";

  header.querySelectorAll(":scope > .topbar, :scope > .bz-topbar, :scope > .site-header").forEach((section)=>{
    section.style.display = "block";
    section.style.float = "none";
    section.style.clear = "both";
    section.style.width = "100%";
    section.style.maxWidth = "none";
    section.style.minWidth = "100%";
    section.style.flex = "0 0 100%";
    section.style.gridColumn = "1 / -1";
  });
}

forceBzHeaderStacking();
window.addEventListener("load", forceBzHeaderStacking);
window.addEventListener("resize", forceBzHeaderStacking);

function sanitizeBzMobileMenu(){
  const menu = document.getElementById("bzMobileMenu");
  if(!menu) return;

  menu.querySelectorAll(".bz-mm-cities").forEach(el => el.remove());

  const footers = Array.from(menu.querySelectorAll(".bz-mm-footer"));
  footers.slice(1).forEach(el => el.remove());

  const langRows = Array.from(menu.querySelectorAll(".bz-mm-lang"));
  langRows.slice(1).forEach(el => el.remove());
}

sanitizeBzMobileMenu();

function normalizeBzMobileMenuLayout(){
  const menu = document.getElementById("bzMobileMenu");
  if(!menu) return;

  const header = menu.querySelector(".bz-mm-header");
  const nav = menu.querySelector(".bz-mm-nav");
  if(!header || !nav) return;

  let headerLeft = header.querySelector(".bz-mm-header-left");
  if(!headerLeft){
    headerLeft = document.createElement("div");
    headerLeft.className = "bz-mm-header-left";
    const logo = header.querySelector(".bz-logo");
    if(logo){
      header.insertBefore(headerLeft, logo);
      headerLeft.appendChild(logo);
    }else{
      header.insertBefore(headerLeft, header.firstChild);
    }
  }

  let cities = header.querySelector(".bz-mm-header-cities");
  if(!cities){
    cities = document.createElement("div");
    cities.className = "bz-mm-header-cities";
    cities.innerHTML = `
      <span><em>GVA</em><b class="bz-city-time" data-tz="Europe/Zurich"></b></span>
      <span><em>NYC</em><b class="bz-city-time" data-tz="America/New_York"></b></span>
      <span><em>DXB</em><b class="bz-city-time" data-tz="Asia/Dubai"></b></span>
    `;
  }

  let divider = header.querySelector(".bz-mm-header-divider");
  if(!divider){
    divider = document.createElement("div");
    divider.className = "bz-mm-header-divider";
  }

  if(!headerLeft.contains(divider)) headerLeft.appendChild(divider);
  divider.style.display = 'none';
  if(!headerLeft.contains(cities)) headerLeft.appendChild(cities);
  cities.style.display = 'none';

  menu.querySelectorAll(".bz-mm-cities").forEach((el)=>{
    if(!header.contains(el)) el.remove();
  });

  let langBar = menu.querySelector(".bz-mm-lang-bar");
  if(!langBar){
    langBar = document.createElement("div");
    langBar.className = "bz-mm-lang-bar";
  }

  if(langBar.children.length === 0){
    const sourceLang = menu.querySelector(".bz-mm-lang");
    if(sourceLang){
      Array.from(sourceLang.querySelectorAll(".bz-mm-lang-opt")).forEach((btn)=> langBar.appendChild(btn));
    }else{
      langBar.innerHTML = `
        <button class="bz-mm-lang-opt active">EN</button>
        <button class="bz-mm-lang-opt">AR</button>
        <button class="bz-mm-lang-opt soon">FR</button>
        <button class="bz-mm-lang-opt soon">DE</button>
      `;
    }
  }

  menu.querySelectorAll(".bz-mm-footer, .bz-mm-lang").forEach((el)=> el.remove());
  if(menu.firstElementChild !== header) menu.prepend(header);
  if(header.nextElementSibling !== langBar) header.insertAdjacentElement("afterend", langBar);
  if(langBar.nextElementSibling !== nav) langBar.insertAdjacentElement("afterend", nav);
}

function initBzMobileMenu(){
  const menu = document.getElementById("bzMobileMenu");
  const hamburger = document.getElementById("bzHamburger");
  const closeBtn = document.getElementById("bzMenuClose");
  const backdrop = document.getElementById("bzBackdrop");
  if(!menu || !hamburger || !closeBtn || !backdrop) return;

  normalizeBzMobileMenuLayout();

  const isMobileViewport = ()=> window.matchMedia("(max-width: 767px)").matches;
  let isOpen = false;

  function lockBody(){
    document.body.classList.add("bz-menu-open");
  }

  function unlockBody(){
    document.body.classList.remove("bz-menu-open");
  }

  function openMenu(e){
    if(e){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    if(isOpen) return;
    isOpen = true;
    menu.removeAttribute("style");
    requestAnimationFrame(()=>{
      menu.classList.add("open");
      backdrop.classList.add("visible");
      hamburger.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      lockBody();
    });
  }

  function closeMenu(e){
    if(e && e.type === "keydown"){
      e.preventDefault();
    }
    if(!isOpen) return;
    isOpen = false;
    menu.classList.remove("open");
    backdrop.classList.remove("visible");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    unlockBody();
    // display handled by CSS visibility + transform
  }

  hamburger.addEventListener("click", openMenu, true);
  closeBtn.addEventListener("click", closeMenu, true);
  backdrop.addEventListener("click", closeMenu, true);
  menu.querySelectorAll(".bz-mm-link").forEach((link)=>{
    link.addEventListener("click", function(e){
      const href = link.getAttribute("href");
      closeMenu();
      if(href && !href.startsWith("#")){
        setTimeout(function(){ window.location.href = href; }, 50);
      } else if(href && href.startsWith("#")){
        setTimeout(function(){
          const target = document.querySelector(href);
          if(target) target.scrollIntoView({ behavior: "smooth" });
        }, 400);
      }
    }, false);
  });

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", ()=>{
    if(window.innerWidth > 900) closeMenu();
  });
}

function initUnifiedFooter(){
  const footer = document.querySelector("footer.footer-pro");
  if(!footer) return;
  if(footer.dataset.sharedFooter === "true") return;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">BEZERU</div>
          <div class="footer-text">An independent watch editorial site focused on design, proportion, culture, and collecting clarity.</div>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <div class="footer-links">
            <a href="mailto:yousef.qubain@gmail.com?subject=BEZERU%20—%20Hello">Email</a><br>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a><br>
            <span>X coming soon</span>
          </div>
        </div>
        <div class="footer-col">
          <h4>Policies</h4>
          <div class="footer-legal">
            <a href="/editorial-policy.html">Editorial Policy</a><br>
            <a href="/contributors-policy.html">Contributors Policy</a><br>
            <a href="/affiliate-policy.html">Affiliate Policy</a><br>
            <a href="/disclaimer-policy.html">Disclaimer Policy</a><br>
            <a href="/privacy-policy.html">Privacy Policy</a><br>
            <a href="/terms-policy.html">Terms Policy</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">© <span id="footer-year"></span> BEZERU</div>
    </div>
  `;

  footer.dataset.sharedFooter = "true";
}

initUnifiedFooter();


function initTopbarDateAndTimes(){
  const dateEl = document.getElementById("bzDate");
  const cityNodes = Array.from(document.querySelectorAll(".bz-city-time[data-tz]"));
  if(!dateEl && cityNodes.length === 0) return;

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const formatCityTime = (tz)=> new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());

  const paint = ()=>{
    const now = new Date();
    if(dateEl) dateEl.textContent = dateFormatter.format(now);
    cityNodes.forEach((node)=>{
      const tz = node.dataset.tz;
      if(!tz) return;
      node.textContent = formatCityTime(tz);
    });
  };

  paint();
  setInterval(paint, 30000);
}

function initHomeAnalogClock(){
  const svg = document.getElementById("bzClock");
  if(!svg) return;

  const ticks = document.getElementById("bzTicks");
  if(ticks && ticks.childElementCount === 0){
    for(let i = 0; i < 60; i += 1){
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const angle = ((i * 6) - 90) * Math.PI / 180;
      const major = i % 5 === 0;
      const inner = major ? 75 : 85;
      line.setAttribute("x1", (100 + inner * Math.cos(angle)).toFixed(3));
      line.setAttribute("y1", (100 + inner * Math.sin(angle)).toFixed(3));
      line.setAttribute("x2", (100 + 92 * Math.cos(angle)).toFixed(3));
      line.setAttribute("y2", (100 + 92 * Math.sin(angle)).toFixed(3));
      line.setAttribute("stroke", "#111111");
      line.setAttribute("stroke-width", major ? "2" : "0.8");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("opacity", major ? "1" : "0.2");
      ticks.appendChild(line);
    }
  }

  const setHand = (id, angleDeg, len, tailLen)=>{
    const hand = document.getElementById(id);
    if(!hand) return;
    const angle = (angleDeg - 90) * Math.PI / 180;
    hand.setAttribute("x2", (100 + len * Math.cos(angle)).toFixed(3));
    hand.setAttribute("y2", (100 + len * Math.sin(angle)).toFixed(3));
    if(tailLen){
      hand.setAttribute("x1", (100 - tailLen * Math.cos(angle)).toFixed(3));
      hand.setAttribute("y1", (100 - tailLen * Math.sin(angle)).toFixed(3));
    }else{
      hand.setAttribute("x1", "100");
      hand.setAttribute("y1", "100");
    }
  };

  const draw = ()=>{
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ms = now.getMilliseconds();
    setHand("bzHour", (hours * 30) + (minutes * 0.5), 52, 0);
    setHand("bzMin", (minutes * 6) + (seconds * 0.1), 68, 0);
    setHand("bzSec", (seconds * 6) + (ms * 0.006), 72, 16);
  };

  draw();
  setInterval(draw, 50);
}

function dedupePageFooters(){
  const footers = Array.from(document.querySelectorAll("body > footer, main + footer, .site-footer"));
  const unique = [];
  footers.forEach((footer)=>{
    if(!unique.includes(footer)) unique.push(footer);
  });
  if(unique.length <= 1) return;
  unique.slice(1).forEach((footer)=> footer.remove());
}

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
  if(header.classList.contains("bz-header")) return;
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
  const existingStrip = document.querySelector('.clock-strip');
  if(existingStrip) existingStrip.remove();
  const nodes = {
    ny: document.querySelector('[data-city-time="ny"]'),
    london: document.querySelector('[data-city-time="london"]'),
    geneva: document.querySelector('[data-city-time="geneva"]'),
    tokyo: document.querySelector('[data-city-time="tokyo"]')
  };
  if(Object.values(nodes).every(v => !v)) return;
  const format = (tz)=> new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
  const tick = ()=>{
    if(nodes.ny) nodes.ny.textContent = format("America/New_York");
    if(nodes.london) nodes.london.textContent = format("Europe/London");
    if(nodes.geneva) nodes.geneva.textContent = format("Europe/Zurich");
    if(nodes.tokyo) nodes.tokyo.textContent = format("Asia/Tokyo");
  };
  tick();
  setInterval(tick, 1000);
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
  if(value.includes("collecting") || value.includes("provenance")) return "collecting";
  if(value.includes("design icons") || value.includes("vintage")) return "design-icons";
  if(value.includes("innovation") || value.includes("industry")) return "innovation";
  if(value === "design" || value.includes("marketing")) return "design-icons";
  if(value.includes("middle east") || value.includes("culture") || value.includes("brands")) return "middle-east-stories";
  if(value.includes("guides") || value.includes("guide")) return "guides";
  return "default";
}

function categoryLabelFromKey(key){
  const labels = {
    underdogs: "Underdogs",
    collecting: "Collecting",
    "middle-east-stories": "Middle East Stories",
    innovation: "Innovation",
    "design-icons": "Design Icons"
  };
  return labels[key] || "Latest";
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
          <span class="tag category-badge" data-category-key="${categoryKey}">${categoryLabelFromKey(categoryKey)}</span>
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
    collecting: "COLLECTING • PROVENANCE • CONTEXT",
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
  const posts = await loadPosts();
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  holder.innerHTML = sorted.slice(0, 3).map(postCardHTML).join("");
}

async function renderArticlesArchive(){
  const holder = document.getElementById("articles-archive");
  if(!holder) return;
  const posts = await loadPosts();
  const chips = Array.from(document.querySelectorAll(".filter-chip[data-filter]"));
  const categoryBlueprint = [
    {
      key: "collecting",
      heading: "Collecting",
      descriptor: "Provenance, collector signals, and the details that shape long-term taste."
    },
    {
      key: "underdogs",
      heading: "Underdogs",
      descriptor: "Small-scale makers and overlooked names worth watching."
    },
    {
      key: "middle-east-stories",
      heading: "Middle East Stories",
      descriptor: "Regional taste, culture, and watchmaking beyond surface-level luxury."
    },
    {
      key: "innovation",
      heading: "Innovation",
      descriptor: "Materials, mechanics, and the ideas reshaping modern watchmaking."
    },
    {
      key: "design-icons",
      heading: "Design Icons",
      descriptor: "Releases and themes that matter because they last, not because they trend."
    }
  ];

  const groupedPosts = posts.reduce((acc, post)=>{
    const key = normalizeCategoryKey(post.category || "");
    if(!acc[key]) acc[key] = [];
    acc[key].push(post);
    return acc;
  }, {});

  function renderGroup(group){
    const sectionPosts = (groupedPosts[group.key] || [])
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if(sectionPosts.length === 0) return "";
    return `
      <section class="archive-group" data-category-group="${group.key}" id="category-${group.key}">
        <header class="archive-group-head">
          <h3>${group.heading}</h3>
          <p>${group.descriptor}</p>
        </header>
        <div class="card-grid archive-card-grid">
          ${sectionPosts.map(postCardHTML).join("")}
        </div>
      </section>
    `;
  }

  holder.innerHTML = categoryBlueprint.map(renderGroup).join("");

  chips.forEach(chip => {
    chip.addEventListener("click", ()=>{
      chips.forEach(item => item.classList.remove("is-active"));
      chip.classList.add("is-active");
      const filter = chip.dataset.filter || "all";
      const groups = holder.querySelectorAll("[data-category-group]");
      let visibleCount = 0;
      groups.forEach(group => {
        const shouldShow = filter === "all" || group.dataset.categoryGroup === filter;
        group.hidden = !shouldShow;
        if(shouldShow) visibleCount += 1;
      });
      const empty = holder.querySelector(".empty-state");
      if(empty) empty.remove();
      if(visibleCount === 0){
        holder.insertAdjacentHTML("beforeend", `<p class="empty-state">${window.BEZERU_I18N?.t("noStories") || "No stories in this section yet."}</p>`);
        return;
      }
      if(filter !== "all"){
        const target = holder.querySelector(`[data-category-group="${filter}"]`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
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

function initArticleEngagement(){
  const isArticlePage = document.body?.getAttribute("data-page") === "static-article"
    || document.body?.getAttribute("data-page") === "article"
    || location.pathname.includes("/articles/");
  if(!isArticlePage) return;

  const shell = document.querySelector(".article-shell");
  if(!shell || shell.querySelector(".article-engagement")) return;

  shell.querySelectorAll(".comment-section").forEach(section => section.remove());

  const params = new URLSearchParams(location.search);
  const articleId = params.get("id") || location.pathname.split("/").pop()?.replace(".html", "") || "article";
  const storageBase = `bezeru_article_engagement:${articleId}`;
  const likeKey = `${storageBase}:liked`;
  const commentsKey = `${storageBase}:comments`;
  const maxCommentLength = 420;

  let liked = localStorage.getItem(likeKey) === "true";
  let comments = [];
  const savedComments = localStorage.getItem(commentsKey);
  if(savedComments){
    try{
      const parsed = JSON.parse(savedComments);
      if(Array.isArray(parsed)) comments = parsed;
    }catch(_){}
  }

  const section = document.createElement("section");
  section.className = "article-engagement";
  section.setAttribute("aria-labelledby", "article-engagement-title");
  section.innerHTML = `
    <div class="article-engagement__head">
      <span class="article-engagement__kicker">Collector response</span>
      <h2 id="article-engagement-title">Like and discuss this article</h2>
      <p>Leave a considered note for other BEZERU readers, or save a quiet like if this piece was useful.</p>
    </div>

    <button class="article-like-button" type="button" aria-pressed="false">
      <span class="article-like-button__label">Like article</span>
      <span class="article-like-button__count">0</span>
    </button>

    <form class="article-comment-form" novalidate>
      <div class="article-comment-form__grid">
        <label>
          <span>Name</span>
          <input class="article-comment-name" type="text" maxlength="60" placeholder="Collector name" autocomplete="name">
        </label>
        <label>
          <span>Comment</span>
          <textarea class="article-comment-text" maxlength="${maxCommentLength}" placeholder="Share a thoughtful comment about the article."></textarea>
        </label>
      </div>
      <div class="article-comment-form__meta">
        <span>Be respectful and avoid sharing private contact details.</span>
        <span><span class="article-comment-count">0</span>/${maxCommentLength}</span>
      </div>
      <p class="article-comment-error" aria-live="polite"></p>
      <button class="article-comment-submit" type="submit">Post comment</button>
    </form>

    <div class="article-comments" aria-live="polite"></div>
  `;

  const articleBody = shell.querySelector(".article-body");
  const related = shell.querySelector(".related-stories");
  if(articleBody){
    articleBody.insertAdjacentElement("afterend", section);
  }else if(related){
    shell.insertBefore(section, related);
  }else{
    shell.appendChild(section);
  }

  const likeButton = section.querySelector(".article-like-button");
  const likeCount = section.querySelector(".article-like-button__count");
  const form = section.querySelector(".article-comment-form");
  const nameInput = section.querySelector(".article-comment-name");
  const commentInput = section.querySelector(".article-comment-text");
  const commentCount = section.querySelector(".article-comment-count");
  const errorEl = section.querySelector(".article-comment-error");
  const commentsEl = section.querySelector(".article-comments");

  function escapeHtml(value){
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatCommentTime(value){
    const date = new Date(value);
    if(Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function renderLike(){
    likeButton.classList.toggle("is-liked", liked);
    likeButton.setAttribute("aria-pressed", String(liked));
    likeButton.querySelector(".article-like-button__label").textContent = liked ? "Liked" : "Like article";
    likeCount.textContent = liked ? "1" : "0";
  }

  function renderComments(){
    if(!comments.length){
      commentsEl.innerHTML = `<div class="article-comments__empty">No comments yet. Be the first to add a thoughtful note.</div>`;
      return;
    }

    commentsEl.innerHTML = comments.map(comment => `
      <article class="article-comment-card">
        <div class="article-comment-card__meta">
          <strong>${escapeHtml(comment.name || "Guest Collector")}</strong>
          <time>${escapeHtml(formatCommentTime(comment.timestamp))}</time>
        </div>
        <p>${escapeHtml(comment.text || "")}</p>
      </article>
    `).join("");
  }

  function setError(message){
    errorEl.textContent = message;
    errorEl.classList.toggle("is-visible", Boolean(message));
  }

  likeButton.addEventListener("click", ()=>{
    liked = !liked;
    localStorage.setItem(likeKey, String(liked));
    renderLike();
  });

  commentInput.addEventListener("input", ()=>{
    commentCount.textContent = String(commentInput.value.length);
    if(commentInput.value.trim()) setError("");
  });

  form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const text = commentInput.value.trim();
    if(!text){
      setError("Please write a comment before posting.");
      commentInput.focus();
      return;
    }
    if(text.length > maxCommentLength){
      setError(`Comments must stay under ${maxCommentLength} characters.`);
      commentInput.focus();
      return;
    }

    comments = [{
      name: nameInput.value.trim() || "Guest Collector",
      timestamp: new Date().toISOString(),
      text
    }, ...comments];
    localStorage.setItem(commentsKey, JSON.stringify(comments));
    commentInput.value = "";
    commentCount.textContent = "0";
    setError("");
    renderComments();
  });

  renderLike();
  renderComments();
}

document.addEventListener("DOMContentLoaded", async ()=>{
  initBzMobileMenu();
  initTopbarDateAndTimes();
  dedupePageFooters();
  initClockStrip();
  initLanguageMenu();
  initDropdowns();
  initMobileNav();
  initStickyHeader();
  initHeroWatchFace();
  initHomeAnalogClock();
  initBrandsTeaser();
  initArticleProgressBar();
  initArticleEngagement();
  enhanceStaticCardMeta();

  // Ensure the hero CTA appears only once if duplicate markup gets served.
  const heroCtas = document.querySelectorAll(".hero .cta");
  heroCtas.forEach((cta, index)=>{
    if(index > 0) cta.remove();
  });

  // footer year (site started in 2026)
  ["footer-year", "footerYear", "bzFooterYear"].forEach((id)=>{
    const yearEl = document.getElementById(id);
    if(yearEl) yearEl.textContent = new Date().getFullYear();
  });

  // page-specific rendering
  const page = document.body.getAttribute("data-page");

  try{
    if(page === "home") await renderHomeLatestFeed();
    if(page === "articles") await renderArticlesArchive();
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


  function normalizeAudioUrl(audioUrl) {
    if (!audioUrl || typeof audioUrl !== "string") return "";
    const trimmed = audioUrl.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("/")) return trimmed;
    return `/${trimmed.replace(/^\.\//, "")}`;
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

  function buildPlayer({ title, category, dateLabel, audioUrl, slug }) {
    const wrap = document.createElement("section");
    wrap.className = "bezeru-audio-bar";
    wrap.innerHTML = `
      <div class="bezeru-audio-bar__left">
        <button class="bezeru-audio-bar__btn bezeru-audio-bar__play" type="button" aria-label="Play">
          <span class="bezeru-audio-bar__icon" data-icon="play">▶</span>
        </button>
      </div>

      <div class="bezeru-audio-bar__mid">
        <div class="bezeru-audio-bar__meta">
          <div class="bezeru-audio-bar__kicker">Listen</div>
          <div class="bezeru-audio-bar__title"></div>
          <div class="bezeru-audio-bar__sub"></div>
        </div>

        <div class="bezeru-audio-bar__timeline" role="slider" aria-label="Audio progress" tabindex="0">
          <div class="bezeru-audio-bar__track"></div>
          <div class="bezeru-audio-bar__fill"></div>
          <div class="bezeru-audio-bar__thumb"></div>
        </div>

        <div class="bezeru-audio-bar__time">
          <span class="bezeru-audio-bar__current">0:00</span>
          <span class="bezeru-audio-bar__sep">/</span>
          <span class="bezeru-audio-bar__duration">0:00</span>
        </div>
      </div>

      <div class="bezeru-audio-bar__right">
        <button class="bezeru-audio-bar__btn bezeru-audio-bar__speed" type="button" aria-label="Playback speed">1x</button>
      </div>

      <audio class="bezeru-audio-bar__audio" preload="metadata"></audio>
    `;

    wrap.querySelector(".bezeru-audio-bar__title").textContent = title || "Listen to this article";
    wrap.querySelector(".bezeru-audio-bar__sub").textContent = `${category || ""}${dateLabel ? " · " + dateLabel : ""}`.trim();

    const audio = wrap.querySelector(".bezeru-audio-bar__audio");
    audio.src = normalizeAudioUrl(audioUrl);

    const playBtn = wrap.querySelector(".bezeru-audio-bar__play");
    const icon = wrap.querySelector(".bezeru-audio-bar__icon");
    const currentEl = wrap.querySelector(".bezeru-audio-bar__current");
    const durationEl = wrap.querySelector(".bezeru-audio-bar__duration");
    const timeline = wrap.querySelector(".bezeru-audio-bar__timeline");
    const fill = wrap.querySelector(".bezeru-audio-bar__fill");
    const thumb = wrap.querySelector(".bezeru-audio-bar__thumb");
    const speedBtn = wrap.querySelector(".bezeru-audio-bar__speed");

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
    if (document.getElementById('bzAudio') || document.getElementById('bzPlayBtn')) return;
    // Audio player injection disabled - handled per-page with inline HTML
    return;
    const pageType = document.body?.getAttribute("data-page");
    const isArticle = pageType === "static-article" || pageType === "article" || location.pathname.includes("/articles/");
    if (!isArticle) return;

    const article = document.querySelector(".article-shell") || document.querySelector("article") || document.querySelector("main");
    if (!article) return;
    article.querySelectorAll(".audio-bar").forEach((legacy)=>{
      if (legacy.querySelector(".audio-play-btn") || legacy.querySelector("#audioPlayer")) legacy.remove();
    });
    if (article.querySelector(".bezeru-audio-bar")) return;

    let posts;
    try {
      posts = await loadPosts();
    } catch (_) {
      return;
    }

    const post = findPostForCurrentPage(posts);
    if (!post) return;

    const normalizedAudioUrl = normalizeAudioUrl(post.audioUrl);
    if (!normalizedAudioUrl) return;

    const slug = getSlugFromUrl();
    const player = buildPlayer({
      title: post.title,
      category: post.category,
      dateLabel: formatMonthYear(post.date),
      audioUrl: normalizedAudioUrl,
      slug,
    });

    if (!player) return;
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

    if (false && shell && !shell.querySelector(".article-subscribe")) { // Article subscribe injection disabled
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
