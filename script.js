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
  if(!toggle || !nav) return;

  toggle.addEventListener("click", ()=>{
    const isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link=>{
    link.addEventListener("click", ()=>{
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
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
async function loadPosts(){
  const res = await fetch("posts.json", { cache: "no-store" });
  if(!res.ok) throw new Error("Could not load posts.json");
  const data = await res.json();
  return data.posts || [];
}

function postCardHTML(post){
  const meta = getCardMeta(post);
  return `
    <a class="card" href="article.html?id=${encodeURIComponent(post.id)}">
      <h3 class="card-title">${post.title}</h3>
      <p class="card-excerpt">${post.excerpt}</p>
      <span class="card-meta">${meta}</span>
      <span class="card-meta">Category: ${post.category}</span>
    </a>
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

async function renderHomeLatest(){
  const holder = document.getElementById("home-latest");
  if(!holder) return;
  const posts = await loadPosts();
  holder.innerHTML = posts.slice(0,3).map((post, index)=>{
    if(index !== 0) return postCardHTML(post);
    const meta = getCardMeta(post);
    return `
      <a class="card post-card post-link" href="article.html?id=${encodeURIComponent(post.id)}">
        <img class="post-thumb" src="images/Article-1.jpg" alt="Andersen Genève Celestial Voyager world time watches" loading="lazy" />
        <h3 class="card-title">${post.title}</h3>
        <p class="card-excerpt">${post.excerpt}</p>
        <span class="card-meta">${meta}</span>
        <span class="card-meta">Category: ${post.category}</span>
      </a>
    `;
  }).join("");
}

async function renderArticlesGrid(){
  const holder = document.getElementById("articles-grid");
  if(!holder) return;
  const posts = await loadPosts();
  holder.innerHTML = posts.map(postCardHTML).join("");
}

async function renderArticle(){
  const titleEl = document.getElementById("article-title");
  const badgeEl = document.getElementById("article-badge");
  const dateEl  = document.getElementById("article-date");
  const ledeEl  = document.getElementById("article-lede");
  const bodyEl  = document.getElementById("article-body");

  if(!titleEl || !badgeEl || !dateEl || !ledeEl || !bodyEl) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const posts = await loadPosts();
  const post = posts.find(p => p.id === id) || posts[0];

  titleEl.textContent = post.title;
  badgeEl.textContent = post.category;
  dateEl.textContent  = post.date;
  ledeEl.textContent  = post.excerpt;
  bodyEl.innerHTML    = post.content_html;
}

document.addEventListener("DOMContentLoaded", async ()=>{
  initDropdowns();
  initClocks();
  initMobileNav();

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
