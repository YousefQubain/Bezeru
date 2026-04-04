(function(){
  const DEFAULT_LOCALE = "en";
  const SUPPORTED = ["en", "ar"];

  const UI = {
    en: {
      dir: "ltr",
      menu: "Menu",
      toggleNavigation: "Toggle navigation",
      worldTime: "World time",
      readTime: "min read",
      noStories: "No stories in this section yet.",
      moreSoon: "More coming soon.",
      languageSwitcher: "Language switcher"
    },
    ar: {
      dir: "rtl",
      menu: "القائمة",
      toggleNavigation: "تبديل القائمة",
      worldTime: "التوقيت العالمي",
      readTime: "دقائق قراءة",
      noStories: "لا توجد مقالات في هذا القسم حتى الآن.",
      moreSoon: "المزيد قريبًا.",
      languageSwitcher: "مبدّل اللغة"
    }
  };

  const POST_TRANSLATIONS = {
    ar: {
      "independents-replacing-hype-001": {
        title: "علامات مستقلة تستبدل الضجة بهدوء",
        excerpt: "أربعة أسماء يراقبها الجامعون غالبًا قبل أن يلاحظها الجميع.",
        category: "العلامات الصاعدة"
      },
      "ap-vacheron-middle-east-soul-001": {
        title: "قصص خالدة في الساعات: كيف يحتفي AP وVacheron بروح الشرق الأوسط",
        excerpt: "كيف تتعامل الدارَتان مع تأثير المنطقة كقيمة أصيلة لا كاتجاه عابر.",
        category: "العلامات / الثقافة"
      },
      "time-reimagined-watchmaking-innovations-2025-26-001": {
        title: "إعادة تصور الزمن: ابتكارات صناعة الساعات 2025–26",
        excerpt: "نظرة أقرب على المواد والميكانيكا وروح المستقلين التي تعيد تشكيل الصناعة.",
        category: "الابتكار / الصناعة"
      },
      "year-of-the-fire-horse-2026-001": {
        title: "عام حصان النار: إصدارات 2026 التي تستحق الاهتمام فعلاً",
        excerpt: "قراءة تحريرية مركزة لإصدارات العام وما الذي سيصمد بعد الموسم.",
        category: "التصميم"
      },
      "cosc-new-standard-signals-a-new-era-for-swiss-watchmaking-001": {
        title: "معيار COSC الجديد يشير إلى مرحلة جديدة في صناعة الساعات السويسرية",
        excerpt: "أهم تطور هذا الشهر ليس إصدارًا جديدًا، بل معيارًا جديدًا للتميّز.",
        category: "الابتكار / الصناعة"
      },
      "before-watches-and-wonders-2026-opens-the-mood-of-the-watch-world-already-feels-different-001": {
        title: "قبل افتتاح Watches and Wonders 2026، مزاج عالم الساعات يبدو مختلفًا",
        excerpt: "هناك هدوء غريب يسبق دائمًا Watches and Wonders.",
        category: "أخبار"
      }
    }
  };

  const STATIC_TEXT_AR = {
    "Home": "الرئيسية", "About": "من نحن", "Read": "اقرأ", "Latest": "الأحدث", "Design": "التصميم", "Guides": "أدلة",
    "Vintage": "فينتج", "Types": "الأنواع", "Dress": "رسمي", "Diver": "غواص", "Chronograph": "كرونوغراف", "Travel": "سفر",
    "Complications": "تعقيدات", "Brands": "العلامات", "Shop": "المتجر", "Articles": "المقالات", "All stories": "جميع المقالات",
    "Back to Home": "العودة للرئيسية", "All": "الكل", "Design Icons": "أيقونات التصميم", "Middle East Stories": "قصص الشرق الأوسط",
    "Innovation": "الابتكار", "Featured Story": "القصة المميزة", "Read article": "اقرأ المقال", "Start Here": "ابدأ من هنا",
    "Contact me": "تواصل معي", "Policies": "السياسات", "Email": "البريد الإلكتروني", "X (Coming soon)": "X (قريبًا)",
    "Editorial Policy": "سياسة التحرير", "Contributors": "المساهمون", "Affiliate Disclosure": "إفصاح العمولة", "Disclaimer": "إخلاء المسؤولية",
    "Privacy Policy": "سياسة الخصوصية", "Terms": "الشروط", "Independent Watch Journal": "مجلة ساعات مستقلة",
    "Watches, explained with editorial restraint and sharp taste.": "الساعات، بشرح تحريري راقٍ وذوق حاد.",
    "Explore the archive →": "استكشف الأرشيف ←", "Read the featured story": "اقرأ القصة المميزة", "Editor’s note": "ملاحظة المحرر",
    "A slower, clearer point of view on watches.": "رؤية أهدأ وأكثر وضوحًا لعالم الساعات.", "About BEZERU": "عن BEZERU",
    "How the BEZERU shop works": "كيف يعمل متجر BEZERU", "Trust and transparency": "الثقة والشفافية", "What BEZERU does": "ما الذي يقدمه BEZERU",
    "What BEZERU does not guarantee": "ما الذي لا يضمنه BEZERU", "List a watch": "اعرض ساعة", "Start your listing": "ابدأ إعلانك",
    "Submit a watch →": "أرسل ساعة ←", "Shop the community vault.": "تسوّق من خزانة المجتمع.", "What we accept": "ما الذي نقبله",
    "Step 1": "الخطوة 1", "Step 2": "الخطوة 2", "Step 3": "الخطوة 3", "Submit your watch": "قدّم ساعتك",
    "Editorial review": "مراجعة تحريرية", "Connect with buyers": "تواصل مع المشترين", "NEW YORK": "نيويورك", "LONDON": "لندن",
    "GENEVA": "جنيف", "TOKYO": "طوكيو"
  };

  function getPathLocale(pathname){
    const first = pathname.split("/").filter(Boolean)[0];
    return SUPPORTED.includes(first) ? first : null;
  }

  function getQueryLocale(){
    const lang = new URLSearchParams(window.location.search).get("lang");
    return SUPPORTED.includes(lang) ? lang : null;
  }

  function detectLocale(){
    return getPathLocale(window.location.pathname)
      || getQueryLocale()
      || localStorage.getItem("bezeru-locale")
      || ((navigator.language || "").toLowerCase().startsWith("ar") ? "ar" : null)
      || DEFAULT_LOCALE;
  }

  function localizeHref(href, locale){
    if(!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || /^https?:/i.test(href)) return href;
    const url = new URL(href, window.location.origin + window.location.pathname);
    url.searchParams.set("lang", locale);
    const relative = `${url.pathname.replace(/^\//, "")}${url.search}${url.hash}`;
    return href.startsWith("/") ? `/${relative}` : relative;
  }

  function localizeLinks(locale){
    document.querySelectorAll("a[href]").forEach((a)=>{
      a.setAttribute("href", localizeHref(a.getAttribute("href"), locale));
    });
  }

  function translateStaticText(){
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const skipTags = new Set(["SCRIPT", "STYLE"]);
    while(walker.nextNode()){
      const node = walker.currentNode;
      const parent = node.parentElement;
      if(!parent || skipTags.has(parent.tagName)) continue;
      const raw = node.nodeValue;
      if(!raw || !raw.trim()) continue;
      const trimmed = raw.trim();
      if(STATIC_TEXT_AR[trimmed]) node.nodeValue = raw.replace(trimmed, STATIC_TEXT_AR[trimmed]);
    }
  }

  function setMetadata(locale){
    document.documentElement.lang = locale;
    document.documentElement.dir = UI[locale].dir;
    document.body.classList.toggle("is-rtl", locale === "ar");

    document.querySelectorAll("link[data-alt-lang]").forEach((el)=> el.remove());
    const canonicalBase = `${window.location.origin}${window.location.pathname}`;
    ["en", "ar"].forEach((l)=>{
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = l;
      link.href = `${canonicalBase}?lang=${l}`;
      link.dataset.altLang = "1";
      document.head.appendChild(link);
    });
  }

  function injectSwitcher(locale){
    const host = document.querySelector(".header-row");
    if(!host || host.querySelector(".lang-switcher")) return;

    const wrap = document.createElement("div");
    wrap.className = "lang-switcher";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", UI[locale].languageSwitcher);

    [["en","English"],["ar","العربية"]].forEach(([code,label])=>{
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `lang-btn${locale === code ? " is-active" : ""}`;
      btn.textContent = label;
      btn.setAttribute("aria-pressed", String(locale === code));
      btn.addEventListener("click", ()=>{
        const params = new URLSearchParams(window.location.search);
        params.set("lang", code);
        localStorage.setItem("bezeru-locale", code);
        window.location.search = params.toString();
      });
      wrap.appendChild(btn);
    });

    host.appendChild(wrap);
  }

  function localizePost(post, locale){
    if(locale !== "ar") return post;
    const translated = POST_TRANSLATIONS.ar[post.id];
    if(!translated) return post;
    return { ...post, ...translated };
  }

  function applyLocale(locale){
    localStorage.setItem("bezeru-locale", locale);
    setMetadata(locale);
    injectSwitcher(locale);

    const navToggleLabel = document.querySelector(".nav-toggle-label");
    if(navToggleLabel) navToggleLabel.textContent = UI[locale].menu;
    const navToggle = document.querySelector(".nav-toggle");
    if(navToggle) navToggle.setAttribute("aria-label", UI[locale].toggleNavigation);
    const clocks = document.querySelector(".clocks");
    if(clocks) clocks.setAttribute("aria-label", UI[locale].worldTime);

    if(locale === "ar") translateStaticText();
    localizeLinks(locale);

    window.BEZERU_I18N = {
      locale,
      t: (key)=> UI[locale][key] || key,
      localizeHref: (href)=> localizeHref(href, locale),
      localizePost: (post)=> localizePost(post, locale)
    };
  }

  window.BEZERU_I18N = {
    locale: DEFAULT_LOCALE,
    t: (k)=> k,
    localizeHref: (href)=> href,
    localizePost: (post)=> post
  };

  document.addEventListener("DOMContentLoaded", ()=> applyLocale(detectLocale()));
})();
