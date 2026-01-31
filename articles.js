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
    if(post.id === FEATURED_POST_ID){
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

async function initStaticArticleNav(){
  const currentId = document.body.dataset.articleId;
  if(!currentId) return;
  const articles = await loadArticles();
  renderArticleNav(currentId, articles);
}

document.addEventListener("DOMContentLoaded", async ()=>{
  const page = document.body.getAttribute("data-page");

  try{
    if(page === "home"){
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
