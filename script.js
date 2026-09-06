const BEZERU_WHATSAPP_NUMBER = "+41000000000"; // TODO: replace with real number
const BEZERU_WHATSAPP_CONCIERGE_MESSAGE = "Hi Bezeru, I’m looking for help finding a watch.";
const BEZERU_GA_MEASUREMENT_ID = "G-312HY6RE8D";
const BEZERU_COOKIE_CONSENT_KEY = "bezeruCookieConsent";

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
window.gtag("consent", "default", {
  analytics_storage: "denied"
});

function hasBezeruAnalyticsConsent(){
  try {
    return JSON.parse(localStorage.getItem(BEZERU_COOKIE_CONSENT_KEY) || "null")?.analytics === true;
  } catch (_) {
    return false;
  }
}

function buildBezeruWhatsAppUrl(message){
  const phone = BEZERU_WHATSAPP_NUMBER.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function loadGoogleAnalytics(){
  if(!BEZERU_GA_MEASUREMENT_ID || window.__bezeruGoogleAnalyticsLoaded) return;
  window.__bezeruGoogleAnalyticsLoaded = true;
  window.gtag("consent", "update", {
    analytics_storage: "granted"
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(BEZERU_GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", BEZERU_GA_MEASUREMENT_ID);
}

function initCookieConsent(){
  if(document.getElementById("bzCookieConsent")) return;

  const getStoredConsent = () => {
    try {
      return JSON.parse(localStorage.getItem(BEZERU_COOKIE_CONSENT_KEY) || "null");
    } catch (_) {
      return null;
    }
  };

  const saveConsent = (analytics) => {
    const consent = {
      analytics: Boolean(analytics),
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(BEZERU_COOKIE_CONSENT_KEY, JSON.stringify(consent));
    } catch (_) {}
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied"
    });
    if(consent.analytics) loadGoogleAnalytics();
    return consent;
  };

  const applyStoredConsent = () => {
    const consent = getStoredConsent();
    if(!consent) return false;
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied"
    });
    if(consent.analytics) loadGoogleAnalytics();
    return true;
  };

  const ensureStyles = () => {
    if(document.getElementById("bzCookieConsentStyles")) return;
    const style = document.createElement("style");
    style.id = "bzCookieConsentStyles";
    style.textContent = `
      .bz-cookie-consent{position:fixed;left:50%;bottom:18px;z-index:1600;width:min(960px,calc(100vw - 32px));transform:translateX(-50%);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#171717}
      .bz-cookie-card{border:1px solid #ded8cf;background:#f7f3ec;box-shadow:0 18px 44px rgba(17,17,17,.10);padding:18px 20px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:center;border-radius:6px}
      .bz-cookie-label{display:block;margin-bottom:7px;font-size:10px;font-weight:750;letter-spacing:.16em;text-transform:uppercase;color:#c0392b}
      .bz-cookie-title{font-family:"Playfair Display",Georgia,serif;font-size:21px;line-height:1.15;font-weight:500;margin:0 0 6px;color:#111}
      .bz-cookie-copy{font-size:13px;line-height:1.65;color:#606060;margin:0;max-width:620px}
      .bz-cookie-actions{display:flex;align-items:center;justify-content:flex-end;gap:10px;flex-wrap:wrap}
      .bz-cookie-btn{min-height:42px;border-radius:3px;border:1px solid #d7d0c7;background:transparent;color:#333;padding:0 16px;font:750 11px/1 Inter,system-ui,sans-serif;letter-spacing:.09em;text-transform:uppercase;cursor:pointer}
      .bz-cookie-btn:hover,.bz-cookie-btn:focus-visible{border-color:#111;color:#111;outline:none}
      .bz-cookie-btn-primary{background:#c0392b;border-color:#c0392b;color:#fff}
      .bz-cookie-btn-primary:hover,.bz-cookie-btn-primary:focus-visible{background:#a83225;border-color:#a83225;color:#fff}
      .bz-cookie-panel{display:none;margin-top:10px;border:1px solid #ded8cf;background:#fffaf4;box-shadow:0 18px 44px rgba(17,17,17,.10);padding:20px;border-radius:6px}
      .bz-cookie-consent.is-managing .bz-cookie-card{display:none}
      .bz-cookie-consent.is-managing .bz-cookie-panel{display:block}
      .bz-cookie-panel-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:14px}
      .bz-cookie-panel h2{font-family:"Playfair Display",Georgia,serif;font-size:24px;font-weight:500;line-height:1.15;margin:0 0 8px;color:#111}
      .bz-cookie-panel p{font-size:13px;line-height:1.65;color:#606060;margin:0}
      .bz-cookie-close{border:0;background:transparent;color:#777;font-size:24px;line-height:1;cursor:pointer;padding:0 2px}
      .bz-cookie-option{margin:18px 0;padding:16px;border:1px solid #ebe4da;background:#fff;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:center;border-radius:4px}
      .bz-cookie-option strong{display:block;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#111;margin-bottom:5px}
      .bz-cookie-switch{position:relative;display:inline-flex;align-items:center;width:52px;height:30px}
      .bz-cookie-switch input{position:absolute;opacity:0;pointer-events:none}
      .bz-cookie-slider{position:absolute;inset:0;border-radius:999px;background:#d8d2ca;border:1px solid #cfc7bd;transition:background .18s ease,border-color .18s ease}
      .bz-cookie-slider::after{content:"";position:absolute;left:3px;top:3px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.16);transition:transform .18s ease}
      .bz-cookie-switch input:checked + .bz-cookie-slider{background:#c0392b;border-color:#c0392b}
      .bz-cookie-switch input:checked + .bz-cookie-slider::after{transform:translateX(22px)}
      .bz-cookie-switch input:focus-visible + .bz-cookie-slider{outline:2px solid #111;outline-offset:3px}
      .bz-cookie-preferences-link{display:inline-flex;margin-top:10px;border:0;background:transparent;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:0}
      @media(max-width:720px){.bz-cookie-consent{bottom:12px;width:calc(100vw - 24px)}.bz-cookie-card{grid-template-columns:1fr;padding:16px;gap:14px}.bz-cookie-actions{justify-content:stretch}.bz-cookie-btn{flex:1 1 100px;padding:0 12px}.bz-cookie-panel{padding:16px}.bz-cookie-option{grid-template-columns:1fr;gap:12px}.bz-cookie-title{font-size:19px}}
    `;
    document.head.appendChild(style);
  };

  const closeConsent = () => {
    const root = document.getElementById("bzCookieConsent");
    if(root) root.remove();
  };

  const openPreferences = () => {
    ensureStyles();
    let root = document.getElementById("bzCookieConsent");
    const existing = getStoredConsent();
    if(!root){
      root = buildConsentUi(Boolean(existing?.analytics));
      document.body.appendChild(root);
    }
    const toggle = root.querySelector("#bzAnalyticsCookies");
    if(toggle) toggle.checked = Boolean(existing?.analytics);
    root.classList.add("is-managing");
  };

  const buildConsentUi = (initialAnalytics) => {
    const root = document.createElement("section");
    root.id = "bzCookieConsent";
    root.className = "bz-cookie-consent";
    root.setAttribute("aria-label", "Cookie consent");
    root.innerHTML = `
      <div class="bz-cookie-card">
        <div>
          <span class="bz-cookie-label">Privacy</span>
          <h2 class="bz-cookie-title">Your privacy matters</h2>
          <p class="bz-cookie-copy">Bezeru uses cookies to understand site performance and improve the experience. You can accept, reject, or manage your preferences at any time.</p>
        </div>
        <div class="bz-cookie-actions" aria-label="Cookie consent actions">
          <button type="button" class="bz-cookie-btn" data-cookie-reject>Reject</button>
          <button type="button" class="bz-cookie-btn" data-cookie-manage>Manage</button>
          <button type="button" class="bz-cookie-btn bz-cookie-btn-primary" data-cookie-accept>Accept</button>
        </div>
      </div>
      <div class="bz-cookie-panel" role="dialog" aria-labelledby="bzCookiePanelTitle" aria-describedby="bzCookiePanelBody">
        <div class="bz-cookie-panel-head">
          <div>
            <span class="bz-cookie-label">Privacy</span>
            <h2 id="bzCookiePanelTitle">Cookie preferences</h2>
            <p id="bzCookiePanelBody">Choose whether Bezeru can use analytics cookies to understand site performance.</p>
          </div>
          <button type="button" class="bz-cookie-close" aria-label="Back to cookie banner" data-cookie-back>×</button>
        </div>
        <div class="bz-cookie-option">
          <div>
            <strong>Analytics cookies</strong>
            <p>Helps Bezeru understand visits, pages viewed, and site performance. This does not control strictly necessary cookies.</p>
          </div>
          <label class="bz-cookie-switch" for="bzAnalyticsCookies">
            <input type="checkbox" id="bzAnalyticsCookies" ${initialAnalytics ? "checked" : ""}>
            <span class="bz-cookie-slider" aria-hidden="true"></span>
          </label>
        </div>
        <div class="bz-cookie-actions">
          <button type="button" class="bz-cookie-btn" data-cookie-save>Save preferences</button>
          <button type="button" class="bz-cookie-btn" data-cookie-reject-all>Reject all</button>
          <button type="button" class="bz-cookie-btn bz-cookie-btn-primary" data-cookie-accept-all>Accept all</button>
        </div>
      </div>
    `;

    root.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
      saveConsent(true);
      closeConsent();
    });
    root.querySelector("[data-cookie-reject]")?.addEventListener("click", () => {
      saveConsent(false);
      closeConsent();
    });
    root.querySelector("[data-cookie-manage]")?.addEventListener("click", () => {
      root.classList.add("is-managing");
      root.querySelector("#bzAnalyticsCookies")?.focus();
    });
    root.querySelector("[data-cookie-back]")?.addEventListener("click", () => {
      if(getStoredConsent()) closeConsent();
      else root.classList.remove("is-managing");
    });
    root.querySelector("[data-cookie-save]")?.addEventListener("click", () => {
      saveConsent(Boolean(root.querySelector("#bzAnalyticsCookies")?.checked));
      closeConsent();
    });
    root.querySelector("[data-cookie-reject-all]")?.addEventListener("click", () => {
      saveConsent(false);
      closeConsent();
    });
    root.querySelector("[data-cookie-accept-all]")?.addEventListener("click", () => {
      saveConsent(true);
      closeConsent();
    });
    return root;
  };

  const addFooterLink = () => {
    if(document.getElementById("bzCookiePreferencesLink")) return;
    const footer = document.querySelector("footer");
    if(!footer) return;
    const button = document.createElement("button");
    button.id = "bzCookiePreferencesLink";
    button.type = "button";
    button.className = "bz-cookie-preferences-link";
    button.textContent = "Cookie Preferences";
    button.addEventListener("click", openPreferences);

    const target = footer.querySelector(".shop-footer-bottom, .footer-bottom") || footer.lastElementChild || footer;
    target.appendChild(button);
  };

  ensureStyles();
  const hasChoice = applyStoredConsent();
  if(!hasChoice){
    document.body.appendChild(buildConsentUi(false));
  }
  addFooterLink();
}

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
        <a class="nav-link" href="${link("/ai-watch-concierge.html")}">Concierge</a>
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
            <a class="nav-link" href="${link("/ai-watch-concierge.html")}">Concierge</a>
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

function initBzWhatsAppConcierge(){
  if(document.getElementById("bzWhatsappConcierge")) return;
  const button = document.createElement("a");
  button.id = "bzWhatsappConcierge";
  button.className = "bz-wa-concierge";
  button.href = buildBezeruWhatsAppUrl(BEZERU_WHATSAPP_CONCIERGE_MESSAGE);
  button.target = "_blank";
  button.rel = "noopener";
  button.textContent = "Speak to Bezeru";
  Object.assign(button.style, {
    position: "fixed",
    right: "22px",
    bottom: "22px",
    zIndex: "1200",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "42px",
    padding: "0 18px",
    borderRadius: "999px",
    background: "#173f32",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 14px 34px rgba(17,17,17,0.16)",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    textDecoration: "none"
  });
  document.body.appendChild(button);
}

function initBzWhatsAppForms(){
  document.querySelectorAll("form[data-bz-whatsapp-form]").forEach((form)=>{
    if(form.dataset.bzWhatsappReady === "true") return;
    form.dataset.bzWhatsappReady = "true";

    form.addEventListener("submit", (event)=>{
      event.preventDefault();
      if(typeof form.reportValidity === "function" && !form.reportValidity()) return;

      const intro = form.dataset.whatsappIntro || "Hi Bezeru, I would like to speak with you.";
      const lines = [intro, ""];
      form.querySelectorAll("[data-wa-label]").forEach((field)=>{
        const label = field.dataset.waLabel;
        const value = (field.value || "").trim();
        lines.push(`${label}: ${value}`);
      });

      window.open(buildBezeruWhatsAppUrl(lines.join("\n")), "_blank", "noopener");
    });
  });
}

initBzWhatsAppConcierge();
initBzWhatsAppForms();
initCookieConsent();

function getRecommendationPool(){
  const standardCaution = "Compare size, condition, service history, and how the design feels on the intended wearer before deciding.";
  const regionalCaution = "Only pursue rare regional pieces with strong documentation, originality, and trusted review.";
  return [
    { model: "Rolex Datejust 36 or 41", wearer: ["stronger", "neutral"], styles: ["Classic and timeless", "Elegant and understated", "Gender-neutral"], occasions: ["Personal purchase", "Daily wear", "First luxury watch", "Collection upgrade"], presence: ["Balanced", "Noticeable"], budgets: ["$10,000–$25,000", "$25,000–$50,000"], value: true, categories: ["everyday", "classic"], why: "A refined daily watch with strong recognition, flexible sizing, and a classic collector feel.", bestFor: "A safer starting point for a daily or milestone watch.", caution: standardCaution },
    { model: "Rolex Datejust 31 or 36", wearer: ["refined", "neutral"], styles: ["Elegant and understated", "Jewellery-led", "Classic and timeless"], occasions: ["Personal purchase", "Birthday gift", "Anniversary gift", "Family gift"], presence: ["Understated", "Balanced"], budgets: ["$10,000–$25,000", "$25,000–$50,000"], value: true, categories: ["everyday", "gift"], why: "A polished daily option with graceful proportions and enough versatility for formal or casual wear.", bestFor: "An elegant personal watch or milestone gift.", caution: "Consider bracelet fit, dial tone, and whether the wearer wants a quieter or more noticeable wrist presence." },
    { model: "Rolex Oyster Perpetual 31, 34, or 36", wearer: ["refined", "neutral"], styles: ["Gender-neutral", "Elegant and understated", "Classic and timeless"], occasions: ["First luxury watch", "Daily wear", "Birthday gift"], presence: ["Understated", "Balanced"], budgets: ["$5,000–$10,000", "$10,000–$25,000"], value: true, categories: ["entry", "everyday"], why: "A clean, design-led Rolex direction with approachable proportions and strong everyday utility.", bestFor: "A first luxury watch or refined daily piece.", caution: standardCaution },
    { model: "Rolex GMT-Master II", wearer: ["stronger", "neutral"], styles: ["Sporty", "Bold and noticeable"], occasions: ["Personal purchase", "Business milestone", "Collection upgrade"], presence: ["Noticeable", "Strong statement"], budgets: ["$10,000–$25,000", "$25,000–$50,000"], value: true, categories: ["sports", "gmt"], why: "A travel-led sports watch with strong wrist presence and broad collector recognition.", bestFor: "A wearer who wants a practical sports-watch presence.", caution: "Worth comparing against less obvious GMT options if subtlety or budget flexibility matters." },
    { model: "Rolex Day-Date", wearer: ["stronger", "neutral"], styles: ["Classic and timeless", "Bold and noticeable"], occasions: ["Business milestone", "Anniversary gift", "Collection upgrade", "Family gift"], presence: ["Noticeable", "Strong statement"], budgets: ["$25,000–$50,000", "$50,000+"], value: true, categories: ["classic", "collector"], why: "A prestige-led collector piece that can feel formal, symbolic, and highly memorable.", bestFor: "A milestone watch with status and long-term collector relevance.", caution: "Precious-metal condition, bracelet stretch, and provenance should be reviewed carefully." },
    { model: "Rolex Day-Date with Eastern Arabic numerals", wearer: ["stronger", "neutral"], styles: ["Bold and noticeable", "Classic and timeless"], occasions: ["Business milestone", "Family gift", "Collection upgrade"], presence: ["Noticeable", "Strong statement"], budgets: ["$25,000–$50,000", "$50,000+"], value: true, regional: true, categories: ["regional", "arabic dial"], why: "A regionally relevant collector-led option that connects prestige, language, and Gulf collecting culture.", bestFor: "A collector who wants status with local relevance.", caution: regionalCaution },
    { model: "Tudor Black Bay 54", wearer: ["stronger", "neutral"], styles: ["Sporty", "Gender-neutral", "Elegant and understated"], occasions: ["First luxury watch", "Daily wear", "Personal purchase"], presence: ["Understated", "Balanced"], budgets: ["Under $5,000", "$5,000–$10,000"], value: false, categories: ["entry", "diver", "sports"], why: "A compact sports-watch direction with restrained proportions and strong everyday versatility.", bestFor: "A first serious watch or understated daily sports piece.", caution: standardCaution },
    { model: "Tudor Black Bay 58", wearer: ["stronger", "neutral"], styles: ["Sporty", "Classic and timeless"], occasions: ["First luxury watch", "Daily wear"], presence: ["Balanced", "Noticeable"], budgets: ["Under $5,000", "$5,000–$10,000"], value: false, categories: ["entry", "diver", "sports"], why: "A versatile diver-style watch with enough character for daily wear without feeling excessive.", bestFor: "A robust daily watch with vintage-leaning charm.", caution: standardCaution },
    { model: "Omega Speedmaster", wearer: ["stronger", "neutral"], styles: ["Sporty", "Classic and timeless"], occasions: ["First luxury watch", "Collection upgrade", "Birthday gift"], presence: ["Balanced", "Noticeable"], budgets: ["$5,000–$10,000", "$10,000–$25,000"], value: true, categories: ["sports", "collector"], why: "A heritage sports-watch direction with strong story, broad recognition, and collector depth.", bestFor: "A thoughtful sports watch with history rather than flash.", caution: "Compare manual-wind comfort, case size, and bracelet or strap preference." },
    { model: "Omega Seamaster Aqua Terra", wearer: ["stronger", "neutral"], styles: ["Elegant and understated", "Sporty", "Gender-neutral"], occasions: ["Daily wear", "First luxury watch", "Personal purchase"], presence: ["Understated", "Balanced"], budgets: ["Under $5,000", "$5,000–$10,000"], value: false, categories: ["everyday", "sports"], why: "A refined daily watch with enough sports-watch resilience for frequent wear.", bestFor: "A practical daily watch that does not feel overly loud.", caution: standardCaution },
    { model: "Cartier Panthère", wearer: ["refined"], styles: ["Jewellery-led", "Elegant and understated"], occasions: ["Wedding or engagement gift", "Birthday gift", "Anniversary gift", "Personal purchase"], presence: ["Understated", "Balanced", "Noticeable"], budgets: ["$5,000–$10,000", "$10,000–$25,000"], value: false, categories: ["jewellery", "gift"], why: "A refined jewellery-led option with strong design identity and elegant daily wear potential.", bestFor: "A milestone gift or elegant personal watch.", caution: "Consider size, bracelet fit, and whether the wearer prefers jewellery-led or sportier pieces." },
    { model: "Cartier Tank", wearer: ["refined", "neutral", "stronger"], styles: ["Elegant and understated", "Gender-neutral", "Classic and timeless"], occasions: ["Personal purchase", "Wedding or engagement gift", "Anniversary gift", "Daily wear"], presence: ["Understated", "Balanced"], budgets: ["Under $5,000", "$5,000–$10,000", "$10,000–$25,000"], value: false, categories: ["dress", "design"], why: "A design-led classic that can work across many wearers depending on size, strap, and metal.", bestFor: "Quiet elegance, formal wear, or a tasteful gift.", caution: "Compare case size and strap choice carefully; the right proportions matter." },
    { model: "Cartier Ballon Bleu", wearer: ["refined", "neutral"], styles: ["Jewellery-led", "Elegant and understated"], occasions: ["Birthday gift", "Anniversary gift", "Personal purchase"], presence: ["Balanced", "Noticeable"], budgets: ["$5,000–$10,000", "$10,000–$25,000"], value: false, categories: ["jewellery", "daily"], why: "A softer Cartier direction with polished presence and strong gift potential.", bestFor: "A refined daily watch with a rounded, elegant character.", caution: standardCaution },
    { model: "Cartier Santos Medium", wearer: ["neutral", "refined", "stronger"], styles: ["Gender-neutral", "Classic and timeless", "Sporty"], occasions: ["Daily wear", "Personal purchase", "Collection upgrade"], presence: ["Balanced", "Noticeable"], budgets: ["$5,000–$10,000", "$10,000–$25,000"], value: false, categories: ["design", "everyday"], why: "A balanced design-led watch with integrated-bracelet energy and elegant geometry.", bestFor: "A refined daily watch with more personality than a simple dress watch.", caution: standardCaution },
    { model: "Cartier Santos Middle East Edition", wearer: ["neutral", "refined", "stronger"], styles: ["Bold and noticeable", "Classic and timeless"], occasions: ["Collection upgrade", "Business milestone", "Family gift"], presence: ["Noticeable", "Strong statement"], budgets: ["$10,000–$25,000", "$25,000–$50,000"], value: false, regional: true, categories: ["regional", "design"], why: "A Cartier direction that may suit a collector who wants design identity with regional context.", bestFor: "A collector-led gift or regional design brief.", caution: regionalCaution },
    { model: "Cartier Pasha Middle East Edition", wearer: ["neutral", "refined", "stronger"], styles: ["Bold and noticeable", "Jewellery-led"], occasions: ["Collection upgrade", "Family gift"], presence: ["Noticeable", "Strong statement"], budgets: ["$10,000–$25,000", "$25,000–$50,000"], value: false, regional: true, categories: ["regional", "statement"], why: "An expressive Cartier option that may be worth exploring for regional character and visual presence.", bestFor: "A wearer who wants a distinctive Cartier rather than a quiet classic.", caution: regionalCaution },
    { model: "Bulgari Serpenti", wearer: ["refined"], styles: ["Jewellery-led", "Bold and noticeable"], occasions: ["Wedding or engagement gift", "Anniversary gift", "Birthday gift"], presence: ["Noticeable", "Strong statement"], budgets: ["$10,000–$25,000", "$25,000–$50,000", "$50,000+"], value: false, categories: ["jewellery", "statement"], why: "A jewellery-led icon with sculptural presence and strong emotional gift potential.", bestFor: "A special occasion where design and jewellery character lead.", caution: "Confirm the wearer wants jewellery-led presence rather than a quieter daily watch." },
    { model: "Bulgari Octo Finissimo", wearer: ["neutral", "stronger"], styles: ["Gender-neutral", "Bold and noticeable", "Sporty"], occasions: ["Collection upgrade", "Personal purchase"], presence: ["Balanced", "Noticeable"], budgets: ["$10,000–$25,000", "$25,000–$50,000"], value: false, categories: ["integrated", "design"], why: "A modern design-led option with slim architecture and strong collector conversation value.", bestFor: "A wearer who wants something refined but less expected.", caution: standardCaution },
    { model: "Jaeger-LeCoultre Reverso", wearer: ["neutral", "refined", "stronger"], styles: ["Classic and timeless", "Elegant and understated", "Gender-neutral"], occasions: ["Wedding or engagement gift", "Anniversary gift", "Family gift", "Collection upgrade"], presence: ["Understated", "Balanced"], budgets: ["$5,000–$10,000", "$10,000–$25,000"], value: false, categories: ["dress", "heritage"], why: "A classic collector piece with architectural design and strong emotional gifting potential.", bestFor: "A refined occasion watch or design-led daily piece.", caution: standardCaution },
    { model: "Patek Philippe Twenty~4", wearer: ["refined"], styles: ["Jewellery-led", "Elegant and understated", "Classic and timeless"], occasions: ["Anniversary gift", "Family gift", "Personal purchase"], presence: ["Understated", "Balanced"], budgets: ["$10,000–$25,000", "$25,000–$50,000"], value: true, categories: ["jewellery", "classic"], why: "A refined maison-led option with elegant proportions and stronger long-term collector context.", bestFor: "A polished personal watch or meaningful family gift.", caution: standardCaution },
    { model: "Patek Philippe Calatrava", wearer: ["neutral", "stronger", "refined"], styles: ["Elegant and understated", "Classic and timeless"], occasions: ["Wedding or engagement gift", "Business milestone", "Family gift", "Collection upgrade"], presence: ["Understated", "Balanced"], budgets: ["$10,000–$25,000", "$25,000–$50,000", "$50,000+"], value: true, categories: ["dress", "collector"], why: "A formal dress-watch direction with maison heritage and strong legacy appeal.", bestFor: "A classic collector piece or refined milestone gift.", caution: "Condition, dial originality, and service history matter especially on pre-owned examples." },
    { model: "Vacheron Constantin Overseas", wearer: ["stronger", "neutral"], styles: ["Sporty", "Bold and noticeable", "Classic and timeless"], occasions: ["Collection upgrade", "Business milestone"], presence: ["Noticeable", "Strong statement"], budgets: ["$25,000–$50,000", "$50,000+"], value: true, categories: ["sports", "integrated"], why: "A high-end sports-watch direction that is prestigious without feeling as obvious as some alternatives.", bestFor: "A collector-led sports watch with maison depth.", caution: standardCaution },
    { model: "Vacheron Constantin Overseas 34.5mm", wearer: ["refined", "neutral"], styles: ["Sporty", "Elegant and understated", "Gender-neutral"], occasions: ["Personal purchase", "Anniversary gift", "Collection upgrade"], presence: ["Balanced", "Noticeable"], budgets: ["$25,000–$50,000", "$50,000+"], value: true, categories: ["sports", "refined daily"], why: "A refined sports-watch direction with smaller proportions and high-end finishing.", bestFor: "A wearer who wants sports-watch quality without oversized presence.", caution: standardCaution },
    { model: "Audemars Piguet Royal Oak", wearer: ["stronger", "neutral"], styles: ["Bold and noticeable", "Sporty"], occasions: ["Business milestone", "Collection upgrade"], presence: ["Noticeable", "Strong statement"], budgets: ["$25,000–$50,000", "$50,000+"], value: true, categories: ["integrated", "collector"], why: "An architectural collector-led option with strong recognition and status.", bestFor: "A bold milestone piece or collection upgrade.", caution: "Be careful with condition, polishing, and provenance on pre-owned examples." },
    { model: "Audemars Piguet Royal Oak 34mm", wearer: ["refined", "neutral"], styles: ["Jewellery-led", "Sporty", "Bold and noticeable"], occasions: ["Anniversary gift", "Personal purchase", "Collection upgrade"], presence: ["Balanced", "Noticeable"], budgets: ["$25,000–$50,000", "$50,000+"], value: true, categories: ["integrated", "jewellery"], why: "A compact high-end sports watch with jewellery-like finishing and strong design identity.", bestFor: "A refined sports-watch presence with collector weight.", caution: standardCaution },
    { model: "IWC Pilot's Watch", wearer: ["stronger", "neutral"], styles: ["Sporty", "Elegant and understated"], occasions: ["Daily wear", "First luxury watch", "Birthday gift"], presence: ["Balanced", "Noticeable"], budgets: ["Under $5,000", "$5,000–$10,000"], value: false, categories: ["everyday", "pilot"], why: "A legible, practical direction with honest daily-watch character.", bestFor: "A wearer who values function and restraint.", caution: standardCaution },
    { model: "IWC Ingenieur", wearer: ["stronger", "neutral"], styles: ["Sporty", "Gender-neutral", "Classic and timeless"], occasions: ["Daily wear", "Collection upgrade"], presence: ["Balanced", "Noticeable"], budgets: ["$5,000–$10,000", "$10,000–$25,000"], value: false, categories: ["integrated", "sports"], why: "A clean engineering-led sports design that sits between practical and collector-minded.", bestFor: "A refined daily sports watch with modern architecture.", caution: standardCaution },
    { model: "Grand Seiko Elegance", wearer: ["neutral", "refined", "stronger"], styles: ["Elegant and understated", "Gender-neutral", "Classic and timeless"], occasions: ["Daily wear", "Personal purchase", "First luxury watch"], presence: ["Understated", "Balanced"], budgets: ["Under $5,000", "$5,000–$10,000", "$10,000–$25,000"], value: false, categories: ["dress", "understated"], why: "A refined option for someone who values finishing, subtlety, and a quieter collector signal.", bestFor: "An understated daily or formal watch.", caution: standardCaution },
    { model: "Grand Seiko sports models", wearer: ["stronger", "neutral"], styles: ["Sporty", "Elegant and understated"], occasions: ["Daily wear", "First luxury watch"], presence: ["Balanced", "Noticeable"], budgets: ["Under $5,000", "$5,000–$10,000"], value: false, categories: ["sports", "daily"], why: "A strong alternative to more obvious Swiss sports watches, with excellent finishing and everyday utility.", bestFor: "A practical wearer who still wants collector quality.", caution: standardCaution },
    { model: "Zenith Chronomaster", wearer: ["stronger", "neutral"], styles: ["Sporty", "Classic and timeless"], occasions: ["Collection upgrade", "Birthday gift"], presence: ["Balanced", "Noticeable"], budgets: ["$5,000–$10,000", "$10,000–$25,000"], value: false, categories: ["chronograph", "collector"], why: "A chronograph direction with real movement heritage and less obvious collector energy.", bestFor: "A wearer who wants sports history without the most predictable choice.", caution: standardCaution },
    { model: "Panerai Luminor or Radiomir", wearer: ["stronger", "neutral"], styles: ["Bold and noticeable", "Sporty"], occasions: ["Personal purchase", "Collection upgrade"], presence: ["Noticeable", "Strong statement"], budgets: ["$5,000–$10,000", "$10,000–$25,000"], value: false, categories: ["statement", "sports"], why: "A stronger sports-watch presence with distinctive design language and strap versatility.", bestFor: "A wearer who wants bold character and wrist presence.", caution: "Size and comfort matter; compare case dimensions carefully." },
    { model: "Piaget Altiplano", wearer: ["refined", "neutral"], styles: ["Elegant and understated", "Jewellery-led", "Classic and timeless"], occasions: ["Wedding or engagement gift", "Anniversary gift", "Personal purchase"], presence: ["Understated", "Balanced"], budgets: ["$10,000–$25,000", "$25,000–$50,000", "$50,000+"], value: false, categories: ["dress", "jewellery"], why: "An ultra-thin refined option with quiet luxury and strong formal elegance.", bestFor: "A discreet dress watch or elegant gift.", caution: standardCaution },
    { model: "Piaget Limelight", wearer: ["refined"], styles: ["Jewellery-led", "Elegant and understated"], occasions: ["Anniversary gift", "Wedding or engagement gift", "Birthday gift"], presence: ["Balanced", "Noticeable"], budgets: ["$10,000–$25,000", "$25,000–$50,000"], value: false, categories: ["jewellery", "gift"], why: "A jewellery-led direction with maison identity and elegant occasion potential.", bestFor: "A gift where jewellery character matters as much as watchmaking.", caution: standardCaution },
    { model: "Chopard Alpine Eagle smaller sizes", wearer: ["refined", "neutral"], styles: ["Sporty", "Jewellery-led", "Gender-neutral"], occasions: ["Daily wear", "Birthday gift", "Personal purchase"], presence: ["Balanced", "Noticeable"], budgets: ["$10,000–$25,000", "$25,000–$50,000"], value: false, categories: ["sports", "jewellery"], why: "A polished sports-watch option with refined finishing and less predictable branding.", bestFor: "A daily piece with jewellery-like finishing.", caution: standardCaution },
    { model: "Van Cleef & Arpels jewellery watches", wearer: ["refined"], styles: ["Jewellery-led", "Bold and noticeable"], occasions: ["Wedding or engagement gift", "Anniversary gift", "Family gift"], presence: ["Noticeable", "Strong statement"], budgets: ["$25,000–$50,000", "$50,000+"], value: false, categories: ["jewellery", "gift"], why: "A jewellery-first direction that may suit a highly emotional gift brief.", bestFor: "A milestone gift where design, maison identity, and jewellery presence lead.", caution: "Confirm the wearer wants a jewellery-led watch rather than a daily collector piece." },
    { model: "Chanel J12", wearer: ["refined", "neutral"], styles: ["Sporty", "Bold and noticeable", "Gender-neutral"], occasions: ["Birthday gift", "Daily wear", "Personal purchase"], presence: ["Balanced", "Noticeable"], budgets: ["$5,000–$10,000", "$10,000–$25,000"], value: false, categories: ["sports", "design"], why: "A design-led ceramic sports direction with fashion-house confidence and daily wearability.", bestFor: "A wearer who likes clean, noticeable design.", caution: standardCaution },
    { model: "Hermes Cape Cod or Heure H", wearer: ["refined", "neutral"], styles: ["Elegant and understated", "Gender-neutral", "Jewellery-led"], occasions: ["Birthday gift", "Daily wear", "Personal purchase"], presence: ["Understated", "Balanced"], budgets: ["Under $5,000", "$5,000–$10,000"], value: false, categories: ["entry", "design"], why: "A refined design-led option with a softer, less conventional luxury signal.", bestFor: "A tasteful daily watch or thoughtful gift.", caution: standardCaution },
    { model: "Hermes H08", wearer: ["neutral", "stronger"], styles: ["Gender-neutral", "Sporty", "Elegant and understated"], occasions: ["Daily wear", "First luxury watch"], presence: ["Balanced", "Noticeable"], budgets: ["Under $5,000", "$5,000–$10,000"], value: false, categories: ["sports", "design"], why: "A modern design-led sports direction that feels refined without chasing hype.", bestFor: "A wearer who wants something practical, stylish, and less expected.", caution: standardCaution },
    { model: "Dior Grand Bal or La D de Dior", wearer: ["refined"], styles: ["Jewellery-led", "Bold and noticeable"], occasions: ["Anniversary gift", "Birthday gift", "Wedding or engagement gift"], presence: ["Noticeable", "Strong statement"], budgets: ["$10,000–$25,000", "$25,000–$50,000"], value: false, categories: ["jewellery", "gift"], why: "A couture-led watch direction where design and jewellery presence are central.", bestFor: "A wearer who enjoys expressive, design-forward luxury.", caution: standardCaution },
    { model: "Nomos Tangente", wearer: ["neutral", "refined", "stronger"], styles: ["Gender-neutral", "Elegant and understated", "Classic and timeless"], occasions: ["First luxury watch", "Daily wear", "Graduation gift"], presence: ["Understated", "Balanced"], budgets: ["Under $5,000", "$5,000–$10,000"], value: false, categories: ["entry", "dress"], why: "A minimal design-led direction that works well when restraint and clarity matter.", bestFor: "A first luxury watch or understated daily piece.", caution: standardCaution },
    { model: "Longines DolceVita", wearer: ["refined", "neutral"], styles: ["Elegant and understated", "Gender-neutral", "Classic and timeless"], occasions: ["Graduation gift", "Birthday gift", "First luxury watch"], presence: ["Understated", "Balanced"], budgets: ["Under $5,000", "$5,000–$10,000"], value: false, categories: ["entry", "dress"], why: "A refined rectangular dress-watch direction at a more accessible luxury level.", bestFor: "A tasteful first luxury watch or elegant gift.", caution: standardCaution },
    { model: "Breitling Chronomat GMT Middle East Edition", wearer: ["stronger", "neutral"], styles: ["Sporty", "Bold and noticeable"], occasions: ["Business milestone", "Collection upgrade", "Personal purchase"], presence: ["Noticeable", "Strong statement"], budgets: ["$5,000–$10,000", "$10,000–$25,000"], value: false, regional: true, categories: ["regional", "gmt", "sports"], why: "A sporty regional direction that could suit a travel or Gulf-context brief.", bestFor: "A wearer who wants practical sports-watch energy with regional detail.", caution: regionalCaution },
    { model: "Carefully documented Khanjar or regional provenance pieces", wearer: ["neutral", "stronger", "refined"], styles: ["Classic and timeless", "Bold and noticeable"], occasions: ["Collection upgrade", "Family gift"], presence: ["Noticeable", "Strong statement"], budgets: ["$25,000–$50,000", "$50,000+"], value: true, regional: true, categories: ["regional", "vintage", "collector"], why: "A rare regional provenance direction may be worth exploring for a serious collector-led brief.", bestFor: "A collector who values documented Gulf or Middle East provenance.", caution: regionalCaution },
    { model: "Independent watchmakers such as F.P. Journe, H. Moser & Cie., Laurent Ferrier, or Czapek", wearer: ["neutral", "stronger", "refined"], styles: ["Elegant and understated", "Classic and timeless", "Bold and noticeable"], occasions: ["Collection upgrade", "Personal purchase"], presence: ["Balanced", "Noticeable"], budgets: ["$25,000–$50,000", "$50,000+"], value: true, categories: ["independent", "collector"], why: "An independent direction may suit a collector who wants refinement beyond the most common prestige names.", bestFor: "A collection upgrade with individuality and deeper collector interest.", caution: "Availability, service network, condition, and long-term liquidity should be considered carefully." },
    { model: "Entry luxury alternatives from TAG Heuer, Oris, Longines, Baume & Mercier, or Frederique Constant", wearer: ["neutral", "stronger", "refined"], styles: ["Sporty", "Classic and timeless", "Elegant and understated"], occasions: ["First luxury watch", "Graduation gift", "Daily wear"], presence: ["Understated", "Balanced", "Noticeable"], budgets: ["Under $5,000"], value: false, categories: ["entry", "daily"], why: "A broader entry-luxury direction can keep the search practical while still matching the preferred style.", bestFor: "A first luxury watch or refined daily option.", caution: "Consider exploring similar references from this brand or category, especially pieces that match the preferred size, budget, and style direction." },
    { model: "Statement alternatives from Hublot, Franck Muller, Gerald Charles, MB&F, Ressence, or Ulysse Nardin", wearer: ["neutral", "stronger", "refined"], styles: ["Bold and noticeable"], occasions: ["Personal purchase", "Collection upgrade", "Business milestone"], presence: ["Strong statement", "Noticeable"], budgets: ["$10,000–$25,000", "$25,000–$50,000", "$50,000+"], value: false, categories: ["statement", "independent"], why: "A broader statement category may suit someone who wants design impact rather than a conventional classic.", bestFor: "A wearer who wants a stronger visual point of view.", caution: "Compare long-term wearability, service needs, and resale expectations before committing." }
  ];
}

function normalizeWatchAnswer(type, value){
  const raw = value || "";
  const lower = raw.toLowerCase();
  if(type === "style"){
    if(lower.includes("masculine")) return "More masculine";
    if(lower.includes("feminine")) return "More feminine";
    if(lower.includes("gender-neutral")) return "Gender-neutral";
    if(lower.includes("understated")) return "Elegant and understated";
    if(lower.includes("jewellery")) return "Jewellery-led";
    if(lower.includes("sporty") || lower.includes("sports")) return "Sporty";
    if(lower.includes("bold") || lower.includes("statement")) return "Bold and noticeable";
    if(lower.includes("classic") || lower.includes("timeless")) return "Classic and timeless";
    if(lower.includes("dress")) return "Elegant and understated";
    if(lower.includes("diver")) return "Sporty";
    if(lower.includes("integrated")) return "Sporty";
    if(lower.includes("vintage")) return "Classic and timeless";
    if(lower.includes("daily")) return "Elegant and understated";
  }
  if(type === "presence"){
    if(lower.includes("very understated") || lower.includes("understated")) return "Understated";
    if(lower.includes("balanced")) return "Balanced";
    if(lower.includes("noticeable")) return "Noticeable";
    if(lower.includes("strong statement")) return "Strong statement";
  }
  if(type === "occasion"){
    if(lower.includes("personal")) return "Personal purchase";
    if(lower.includes("wedding") || lower.includes("engagement")) return "Wedding or engagement gift";
    if(lower.includes("graduation")) return "Graduation gift";
    if(lower.includes("birthday")) return "Birthday gift";
    if(lower.includes("business")) return "Business milestone";
    if(lower.includes("anniversary")) return "Anniversary gift";
    if(lower.includes("family")) return "Family gift";
    if(lower.includes("upgrade")) return "Collection upgrade";
    if(lower.includes("first")) return "First luxury watch";
    if(lower.includes("daily")) return "Daily wear";
  }
  if(type === "preference"){
    if(lower.includes("new")) return "New";
    if(lower.includes("pre-owned")) return "Pre-owned";
    if(lower.includes("both")) return "Open to both";
  }
  if(type === "resale"){
    if(lower.includes("very important")) return "Very important";
    if(lower.includes("somewhat")) return "Somewhat important";
    if(lower.includes("not important")) return "Not important";
    if(lower.includes("emotional")) return "I mainly want emotional value";
  }
  return raw;
}

function getWearerDirection(answers){
  const wearer = (answers.intendedWearer || answers.wearer || "").toLowerCase();
  const refinedWearers = ["wife", "fiancee", "fiancée", "girlfriend", "mother", "sister", "female family"];
  const strongerWearers = ["husband", "fiance", "fiancé", "boyfriend", "father", "brother", "male family"];
  if(refinedWearers.some((term)=> wearer.includes(term))) return { key: "refined", label: "a refined or jewellery-aware style direction" };
  if(strongerWearers.some((term)=> wearer.includes(term))) return { key: "stronger", label: "a stronger daily, sports, dress, or classic collector direction" };
  if(wearer.includes("prefer not") || wearer.includes("not sure") || wearer.includes("someone else")) return { key: "neutral", label: "a flexible style direction that can be refined with sizing and taste" };
  return { key: "neutral", label: "the intended wearer and preferred wrist presence" };
}

function getStyleDirection(answers){
  return normalizeWatchAnswer("style", answers.styleDirection || answers.style);
}

function answerIncludesAny(answers, terms){
  const haystack = [
    answers.country,
    answers.intendedWearer,
    answers.styleDirection || answers.style,
    answers.occasion,
    answers.preference,
    answers.presence,
    answers.resale,
    answers.wrist,
    answers.brandsLike,
    answers.brandsDislike,
    answers.notes
  ].join(" ").toLowerCase();
  return terms.some((term)=> haystack.includes(term));
}

function isRegionalBrief(answers){
  return answerIncludesAny(answers, [
    "uae", "saudi", "qatar", "kuwait", "bahrain", "oman", "jordan", "dubai", "doha", "riyadh",
    "gulf", "middle east", "arabic", "khanjar", "qaboos", "regional", "provenance", "crest",
    "pre-owned", "vintage", "neo-vintage", "collector"
  ]);
}

function getCollectorProfile(answers){
  const style = getStyleDirection(answers);
  const occasion = normalizeWatchAnswer("occasion", answers.occasion);
  const presence = normalizeWatchAnswer("presence", answers.presence);
  const resale = normalizeWatchAnswer("resale", answers.resale);
  const wearer = getWearerDirection(answers);
  if(isRegionalBrief(answers) && (style === "Bold and noticeable" || occasion === "Collection upgrade" || resale === "Very important")) return "Regional Collector Direction";
  if(style === "Jewellery-led") return "Jewellery-Led Milestone Brief";
  if(occasion && occasion.toLowerCase().includes("gift")) return "Considered Gift Shortlist";
  if(occasion === "First luxury watch") return "First Luxury Watch Brief";
  if(resale === "Very important") return "Collector-Led Value Brief";
  if(style === "Gender-neutral" || wearer.key === "neutral") return "Balanced Design-Led Brief";
  if(presence === "Strong statement" || style === "Bold and noticeable") return "Bold Presence Brief";
  if(style === "Elegant and understated") return "Refined Daily Watch Brief";
  return "Classic Collector Brief";
}

function scoreWatchOption(option, answers){
  const wearer = getWearerDirection(answers);
  const style = getStyleDirection(answers);
  const presence = normalizeWatchAnswer("presence", answers.presence);
  const occasion = normalizeWatchAnswer("occasion", answers.occasion);
  const preference = normalizeWatchAnswer("preference", answers.preference);
  const resale = normalizeWatchAnswer("resale", answers.resale);
  const regional = isRegionalBrief(answers);
  const liked = (answers.brandsLike || "").toLowerCase();
  const avoided = (answers.brandsDislike || "").toLowerCase();
  const modelTokens = option.model.toLowerCase().split(/[,\s]+/)
    .map((word)=> word.replace(/[^a-z0-9]/g, ""))
    .filter((word)=> word.length > 2);
  let score = 0;

  if(option.wearer.includes(wearer.key)) score += 5;
  if(style && option.styles.includes(style)) score += 6;
  if(style === "More masculine" && option.wearer.includes("stronger")) score += 4;
  if(style === "More feminine" && option.wearer.includes("refined")) score += 4;
  if(style === "Gender-neutral" && option.wearer.includes("neutral")) score += 4;
  if(presence && option.presence.includes(presence)) score += 4;
  if(occasion && option.occasions.includes(occasion)) score += 5;
  if(option.budgets.includes(answers.budget)) score += 5;
  if(resale === "Very important" && option.value) score += 3;
  if(preference === "Pre-owned" && (option.value || option.categories.includes("vintage") || option.regional)) score += 2;
  if(preference === "New" && !option.categories.includes("vintage") && !option.regional) score += 1;
  if(regional && option.regional) score += 4;
  if(style === "Jewellery-led" && option.categories.includes("jewellery")) score += 5;
  if(style === "Sporty" && option.categories.includes("sports")) score += 4;
  if(style === "Elegant and understated" && (option.categories.includes("dress") || option.categories.includes("understated") || option.categories.includes("daily"))) score += 3;
  if(style === "Bold and noticeable" && (option.categories.includes("statement") || option.presence.includes("Strong statement"))) score += 4;
  if(occasion === "First luxury watch" && option.categories.includes("entry")) score += 5;
  if(occasion && occasion.toLowerCase().includes("gift") && option.categories.includes("gift")) score += 4;
  if(occasion === "Daily wear" && (option.categories.includes("daily") || option.categories.includes("everyday"))) score += 3;
  if(occasion === "Collection upgrade" && (option.categories.includes("collector") || option.categories.includes("independent"))) score += 3;
  if(liked && modelTokens.some((word)=> liked.includes(word))) score += 4;
  if(avoided && modelTokens.some((word)=> avoided.includes(word))) score -= 12;
  return score;
}

function getWatchRecommendations(answers){
  const pool = getRecommendationPool();
  const profile = getCollectorProfile(answers);
  const wearer = getWearerDirection(answers);
  const style = getStyleDirection(answers);
  const presence = normalizeWatchAnswer("presence", answers.presence);
  const occasion = normalizeWatchAnswer("occasion", answers.occasion);
  const preference = normalizeWatchAnswer("preference", answers.preference);
  const regional = isRegionalBrief(answers);
  const ranked = pool
    .map((option)=> ({ ...option, score: scoreWatchOption(option, answers) }))
    .sort((a, b)=> b.score - a.score);

  const recommended = ranked.slice(0, 5).map((option)=> ({
    model: option.model,
    reason: option.why,
    bestFor: option.bestFor,
    caution: option.caution,
    score: option.score
  }));

  const lowestScore = recommended.reduce((min, watch)=> Math.min(min, watch.score), recommended[0]?.score || 0);
  if(lowestScore < 8){
    recommended[recommended.length - 1] = {
      model: "Broader category search",
      reason: "Consider exploring similar references from this brand or category, especially pieces that match the preferred size, budget, and style direction.",
      bestFor: "A brief that needs refinement beyond the starter pool.",
      caution: "Use this as a direction for comparison, not a final buying decision.",
      score: 8
    };
  }

  const why = `Based on the intended wearer, occasion, style direction, budget, and wrist presence, these watches may be worth exploring. The shortlist leans toward ${wearer.label}, a ${String(style || "not yet fixed").toLowerCase()} style direction, ${String(presence || "balanced").toLowerCase()} wrist presence, and ${String(occasion || "a flexible brief").toLowerCase()}. ${preference && preference !== "Not sure yet" ? `The ${preference.toLowerCase()} preference also shapes how much condition, documentation, and availability should matter.` : "Because the new or pre-owned route is still open, both boutique and carefully reviewed secondary-market options can remain on the table."}`;

  let avoid = "This shortlist is a starting point, not a final buying decision. Bezeru can help refine the search further based on availability, condition, provenance, and budget.";
  if(regional){
    avoid += " For rare regional pieces, documentation is essential; only pursue examples with strong documentation, originality, and trusted review.";
  }
  if(preference === "Pre-owned"){
    avoid += " For pre-owned watches, condition, service history, seller credibility, and provenance should be reviewed before any purchase.";
  }

  return { profile, recommended, why, avoid };
}

function buildWhatsAppRecommendationMessage(answers, recommendation){
  return [
    "Hi Bezeru, I used the AI Watch Concierge and would like guidance.",
    "",
    `Name: ${answers.name || "—"}`,
    `Country: ${answers.country || "—"}`,
    `Intended wearer: ${answers.intendedWearer || answers.wearer || "—"}`,
    `Style direction: ${answers.styleDirection || answers.style || "—"}`,
    `Gift or occasion: ${answers.occasion || "—"}`,
    `Budget: ${answers.budget || "—"}`,
    `New/pre-owned preference: ${answers.preference || "—"}`,
    `Wrist presence: ${answers.presence || "—"}`,
    `Long-term value importance: ${answers.resale || "—"}`,
    `Wrist size: ${answers.wrist || "—"}`,
    `Brands liked: ${answers.brandsLike || "—"}`,
    `Brands avoided: ${answers.brandsDislike || "—"}`,
    `Notes: ${answers.notes || "—"}`,
    "",
    `Collector profile: ${recommendation.profile}`,
    `Recommended watches: ${recommendation.recommended.map((watch)=> watch.model).join(", ")}`
  ].join("\n");
}

function initAiWatchConcierge(){
  const form = document.getElementById("aiWatchConciergeForm");
  const result = document.getElementById("aiWatchResult");
  if(!form || !result) return;

  const getValue = (name)=> (form.elements[name]?.value || "").trim();

  form.addEventListener("submit", (event)=>{
    event.preventDefault();
    if(typeof form.reportValidity === "function" && !form.reportValidity()) return;

    const answers = {
      name: getValue("name"),
      country: getValue("country"),
      intendedWearer: getValue("intendedWearer") || getValue("wearer"),
      budget: getValue("budget"),
      preference: getValue("preference"),
      styleDirection: getValue("styleDirection") || getValue("style"),
      occasion: getValue("occasion"),
      presence: getValue("presence"),
      resale: getValue("resale"),
      wrist: getValue("wrist"),
      brandsLike: getValue("brandsLike"),
      brandsDislike: getValue("brandsDislike"),
      notes: getValue("notes")
    };
    const recommendation = getWatchRecommendations(answers);
    const message = buildWhatsAppRecommendationMessage(answers, recommendation);

    result.innerHTML = `
      <div class="ai-result-card">
        <span class="service-eyebrow">Collector Profile</span>
        <h2>Your Bezeru Profile: ${recommendation.profile}</h2>
        <div class="ai-result-block">
          <h3>Recommended Watches</h3>
          <div class="ai-watch-list">
            ${recommendation.recommended.map((watch)=> `
              <article class="ai-watch-card">
                <h4>${watch.model}</h4>
                <p>${watch.reason}</p>
                <span>Best for: ${watch.bestFor}</span>
                <span>Caution: ${watch.caution || "Use this as a starting point and compare condition, provenance, and budget carefully."}</span>
              </article>
            `).join("")}
          </div>
        </div>
        <div class="ai-result-block">
          <h3>Why These Fit</h3>
          <p>${recommendation.why}</p>
        </div>
        <div class="ai-result-block">
          <h3>What to Avoid</h3>
          <p>${recommendation.avoid}</p>
        </div>
        <div class="service-actions">
          <a class="btn-dark" href="${buildBezeruWhatsAppUrl(message)}" target="_blank" rel="noopener">Send to Bezeru Concierge</a>
          <a class="btn-outline" href="/source-a-watch.html">Source a Watch</a>
        </div>
      </div>
    `;
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

initAiWatchConcierge();

function repairBzHeaderRows(){
  const header = document.getElementById("bzHeader");
  if(!header || !header.classList.contains("bz-header")) return;
  header.style.display = "block";
  header.style.width = "100%";
  header.style.minWidth = "100%";
  header.style.padding = "0";
  header.style.margin = "0";

  header.querySelectorAll(":scope > .topbar, :scope > .bz-topbar, :scope > .site-header").forEach((section)=>{
    section.style.display = "block";
    section.style.width = "100%";
    section.style.minWidth = "100%";
    section.style.maxWidth = "none";
    section.style.float = "none";
    section.style.clear = "both";
    section.style.position = "relative";
    section.style.left = "auto";
    section.style.right = "auto";
    section.style.transform = "none";
  });
}

repairBzHeaderRows();
window.addEventListener("load", repairBzHeaderRows);
window.addEventListener("resize", repairBzHeaderRows);

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
        setTimeout(function(){ window.location.href = href; }, 60);
      } else if(href && href.startsWith("#")){
        setTimeout(function(){
          const target = document.querySelector(href);
          if(target) target.scrollIntoView({ behavior: "smooth" });
        }, 420);
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

function initPlaceholderSocialLinks(){
  document.querySelectorAll('a[href="#"]').forEach((link)=>{
    if((link.textContent || "").trim().toLowerCase() !== "instagram") return;
    const note = document.createElement("span");
    note.textContent = "Instagram (coming soon)";
    note.className = link.className;
    note.style.cssText = link.style.cssText;
    note.setAttribute("aria-label", "Instagram coming soon");
    link.replaceWith(note);
  });
}

function initEditorialIntelligenceCta(){
  const isArticle = document.body?.getAttribute("data-page") === "static-article"
    || document.body?.getAttribute("data-page") === "article"
    || location.pathname.includes("/articles/");
  if(!isArticle) return;

  const shell = document.querySelector(".article-shell");
  if(!shell || shell.querySelector(".article-intelligence-cta")) return;

  const cta = document.createElement("aside");
  cta.className = "article-intelligence-cta";
  cta.innerHTML = `
    <span class="article-intelligence-cta__eyebrow">Understand the market</span>
    <p>Want to compare a specific reference before you buy, sell, or list it?</p>
    <a href="/intelligence.html">Explore Bezeru Intelligence →</a>
  `;
  const authorBox = shell.querySelector(".article-author-box");
  if(authorBox) authorBox.insertAdjacentElement("afterend", cta);
  else shell.appendChild(cta);
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
  initPlaceholderSocialLinks();
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
  initEditorialIntelligenceCta();

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
      if (!hasBezeruAnalyticsConsent()) return;
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
