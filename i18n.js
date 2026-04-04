(function(){
  const DEFAULT_LOCALE = "en";
  const SUPPORTED = ["en", "ar"];

  const UI = {
    en: {
      languageName: "English",
      dir: "ltr",
      menu: "Menu",
      toggleNavigation: "Toggle navigation",
      worldTime: "World time",
      readTime: "min read",
      noStories: "No stories in this section yet.",
      moreSoon: "More coming soon."
    },
    ar: {
      languageName: "العربية",
      dir: "rtl",
      menu: "القائمة",
      toggleNavigation: "تبديل التنقل",
      worldTime: "التوقيت العالمي",
      readTime: "دقائق قراءة",
      noStories: "لا توجد مقالات في هذا القسم حتى الآن.",
      moreSoon: "المزيد قريبًا."
    }
  };

  const TEXT_MAP_AR = {
    "Home": "الرئيسية",
    "About": "من نحن",
    "Read": "اقرأ",
    "Latest": "الأحدث",
    "Design": "التصميم",
    "Guides": "أدلة",
    "Vintage": "فينتج",
    "Types": "الأنواع",
    "Dress": "رسمي",
    "Diver": "غواص",
    "Chronograph": "كرونوغراف",
    "Travel": "سفر",
    "Complications": "تعقيدات",
    "Brands": "العلامات",
    "Shop": "المتجر",
    "Articles": "المقالات",
    "All stories": "جميع المقالات",
    "Back to Home": "العودة للرئيسية",
    "All": "الكل",
    "Design Icons": "أيقونات التصميم",
    "Middle East Stories": "قصص الشرق الأوسط",
    "Innovation": "الابتكار",
    "Featured Story": "القصة المميزة",
    "Read article": "اقرأ المقال",
    "Start Here": "ابدأ من هنا",
    "Underdogs": "العلامات الصاعدة",
    "Innovation / Industry": "الابتكار / الصناعة",
    "Middle East / Culture": "الشرق الأوسط / الثقافة",
    "Editor’s note": "ملاحظة المحرر",
    "About BEZERU": "عن BEZERU",
    "Contact me": "تواصل معي",
    "Email": "البريد الإلكتروني",
    "X (Coming soon)": "X (قريبًا)",
    "Policies": "السياسات",
    "Editorial Policy": "سياسة التحرير",
    "Contributors": "المساهمون",
    "Affiliate Disclosure": "إفصاح العمولة",
    "Disclaimer": "إخلاء المسؤولية",
    "Privacy Policy": "سياسة الخصوصية",
    "Terms": "الشروط",
    "Independent Watch Journal": "مجلة ساعات مستقلة",
    "Watches, explained with editorial restraint and sharp taste.": "الساعات، بشرح تحريري راقٍ وذوق حاد.",
    "Explore the archive →": "استكشف الأرشيف ←",
    "Read the featured story": "اقرأ القصة المميزة",
    "A slower, clearer point of view on watches.": "رؤية أهدأ وأكثر وضوحًا لعالم الساعات.",
    "What Is Actually New in Watchmaking": "ما الجديد فعلاً في صناعة الساعات",
    "Culture, Craft, and Regional Taste": "الثقافة والحِرفة والذوق الإقليمي",
    "How the BEZERU shop works": "كيف يعمل متجر BEZERU",
    "Trust and transparency": "الثقة والشفافية",
    "What BEZERU does": "ما الذي يقدمه BEZERU",
    "What BEZERU does not guarantee": "ما لا يضمنه BEZERU",
    "List a watch": "اعرض ساعة",
    "Start your listing": "ابدأ إعلانك",
    "Submit a watch →": "أرسل ساعة ←",
    "Shop the community vault.": "تسوّق من خزانة المجتمع.",
    "What we accept": "ما الذي نقبله",
    "Step 1": "الخطوة 1",
    "Step 2": "الخطوة 2",
    "Step 3": "الخطوة 3",
    "Submit your watch": "قدّم ساعتك",
    "Editorial review": "مراجعة تحريرية",
    "Connect with buyers": "تواصل مع المشترين",
    "NEW YORK": "نيويورك",
    "LONDON": "لندن",
    "GENEVA": "جنيف",
    "TOKYO": "طوكيو"
  };

  function currentFromUrl(){
    const params = new URLSearchParams(window.location.search);
    const urlLocale = params.get("lang");
    return SUPPORTED.includes(urlLocale) ? urlLocale : null;
  }

  function detectLocale(){
    return currentFromUrl()
      || localStorage.getItem("bezeru-locale")
      || (navigator.language || "").toLowerCase().startsWith("ar") && "ar"
      || DEFAULT_LOCALE;
  }

  function localizeLinks(locale){
    document.querySelectorAll('a[href]').forEach((a)=>{
      const href = a.getAttribute('href');
      if(!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
      const [path, hash] = href.split('#');
      const [cleanPath, query] = path.split('?');
      const params = new URLSearchParams(query || '');
      params.set('lang', locale);
      const nextHref = `${cleanPath}?${params.toString()}${hash ? `#${hash}` : ''}`;
      a.setAttribute('href', nextHref);
    });
  }

  function translateTextNodes(){
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const skipTags = new Set(["SCRIPT", "STYLE"]);
    while(walker.nextNode()){
      const node = walker.currentNode;
      const parent = node.parentElement;
      if(!parent || skipTags.has(parent.tagName)) continue;
      const text = node.nodeValue;
      if(!text || !text.trim()) continue;
      const trimmed = text.trim();
      const replacement = TEXT_MAP_AR[trimmed];
      if(replacement){
        node.nodeValue = text.replace(trimmed, replacement);
      }
    }
  }

  function updateMeta(locale){
    document.documentElement.lang = locale;
    document.documentElement.dir = UI[locale].dir;
    document.body.classList.toggle('is-rtl', locale === 'ar');

    let alternates = document.head.querySelectorAll('link[data-alt-lang]');
    alternates.forEach(node => node.remove());
    const canonical = window.location.origin + window.location.pathname;
    ["en","ar"].forEach(l=>{
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = l;
      link.href = `${canonical}?lang=${l}`;
      link.dataset.altLang = '1';
      document.head.appendChild(link);
    });
  }

  function injectLanguageSwitcher(locale){
    const headers = document.querySelectorAll('.header-row, .nav-panel');
    headers.forEach((container)=>{
      if(!container || container.querySelector('.lang-switcher')) return;
      const wrap = document.createElement('div');
      wrap.className = 'lang-switcher';
      wrap.setAttribute('role', 'group');
      wrap.setAttribute('aria-label', locale === 'ar' ? 'تبديل اللغة' : 'Language switcher');

      [
        { code: 'en', label: 'English' },
        { code: 'ar', label: 'العربية' }
      ].forEach(item=>{
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lang-btn' + (locale === item.code ? ' is-active' : '');
        btn.textContent = item.label;
        btn.setAttribute('aria-pressed', locale === item.code ? 'true' : 'false');
        btn.addEventListener('click', ()=>{
          const params = new URLSearchParams(window.location.search);
          params.set('lang', item.code);
          localStorage.setItem('bezeru-locale', item.code);
          window.location.search = params.toString();
        });
        wrap.appendChild(btn);
      });

      if(container.classList.contains('header-row')){
        container.appendChild(wrap);
      }else{
        const first = container.firstElementChild;
        container.insertBefore(wrap, first);
      }
    });
  }

  function applyLocale(locale){
    localStorage.setItem('bezeru-locale', locale);
    updateMeta(locale);
    injectLanguageSwitcher(locale);

    const navLabel = document.querySelector('.nav-toggle-label');
    if(navLabel) navLabel.textContent = UI[locale].menu;
    const navToggle = document.querySelector('.nav-toggle');
    if(navToggle) navToggle.setAttribute('aria-label', UI[locale].toggleNavigation);
    const clocks = document.querySelector('.clocks');
    if(clocks) clocks.setAttribute('aria-label', UI[locale].worldTime);

    if(locale === 'ar') translateTextNodes();
    localizeLinks(locale);

    window.BEZERU_I18N = {
      locale,
      t: (key)=> UI[locale][key] || key
    };
  }

  window.BEZERU_I18N = { locale: DEFAULT_LOCALE, t:(k)=>k };
  document.addEventListener('DOMContentLoaded', ()=>{
    const locale = detectLocale();
    applyLocale(locale);
  });
})();
