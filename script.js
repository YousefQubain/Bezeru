/* =========================
   DROPDOWNS (every page)
========================= */
(function(){
  const dropdowns = document.querySelectorAll(".dropdown");
  if(!dropdowns.length) return;

  function closeAll(){
    dropdowns.forEach(dd => dd.classList.remove("dd-open"));
  }

  dropdowns.forEach(dd=>{
    const btn = dd.querySelector(".dd-btn");
    if(!btn) return;

    btn.addEventListener("click", (e)=>{
      e.stopPropagation();
      const isOpen = dd.classList.contains("dd-open");
      closeAll();
      if(!isOpen) dd.classList.add("dd-open");
    });

    dd.querySelectorAll(".dd-menu a").forEach(a=>{
      a.addEventListener("click", ()=> closeAll());
    });
  });

  document.addEventListener("click", closeAll);
  document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") closeAll(); });
})();

/* =========================
   ACTIVE NAV HIGHLIGHT
========================= */
(function(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("nav a.nav-link").forEach(a=>{
    const href = (a.getAttribute("href") || "").toLowerCase();
    if(href === path) a.classList.add("active");
    else a.classList.remove("active");
  });
})();

/* =========================
   CLOCKS (DST-safe timezones)
   + HD markers + seconds hand
========================= */
const TZ = {
  ny: "America/New_York",
  lon: "Europe/London",
  gen: "Europe/Zurich",
  tok: "Asia/Tokyo"
};

function getHMS(tz){
  // Use Intl to handle DST correctly
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date()); // "HH:MM:SS"

  const [hh, mm, ss] = parts.split(":").map(Number);
  return { hh, mm, ss, label: parts.slice(0,5) }; // show HH:MM below (clean)
}

function drawAnalog(canvas, hh, mm, ss){
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const r = w / 2;

  // High-DPI crisp
  const dpr = window.devicePixelRatio || 1;
  if(canvas._dpr !== dpr){
    canvas._dpr = dpr;
    canvas.width = Math.round(44 * dpr);
    canvas.height = Math.round(44 * dpr);
    canvas.style.width = "44px";
    canvas.style.height = "44px";
  }

  const cw = canvas.width;
  const cr = cw/2;

  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,cw,cw);
  ctx.translate(cr, cr);

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || "#1d4ed8";

  // Outer ring
  ctx.beginPath();
  ctx.arc(0,0,cr-2,0,Math.PI*2);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4 * dpr;
  ctx.stroke();

  // Face
  ctx.beginPath();
  ctx.arc(0,0,cr-8*dpr,0,Math.PI*2);
  ctx.strokeStyle = "rgba(15,23,42,0.12)";
  ctx.lineWidth = 2 * dpr;
  ctx.stroke();

  // Minute ticks (60)
  for(let i=0; i<60; i++){
    const ang = (Math.PI/30)*i - Math.PI/2;
    const isHour = i % 5 === 0;
    const inner = cr - (isHour ? 12*dpr : 10*dpr);
    const outer = cr - 6*dpr;

    ctx.beginPath();
    ctx.moveTo(Math.cos(ang)*inner, Math.sin(ang)*inner);
    ctx.lineTo(Math.cos(ang)*outer, Math.sin(ang)*outer);
    ctx.strokeStyle = isHour ? "rgba(15,23,42,0.55)" : "rgba(15,23,42,0.25)";
    ctx.lineWidth = (isHour ? 1.6 : 1.0) * dpr;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  // Small 12/3/6/9 markers (tiny dots)
  const dotR = 1.3 * dpr;
  [0,3,6,9].forEach(n=>{
    const ang = (Math.PI/6)*n - Math.PI/2;
    const dist = cr - 14*dpr;
    ctx.beginPath();
    ctx.arc(Math.cos(ang)*dist, Math.sin(ang)*dist, dotR, 0, Math.PI*2);
    ctx.fillStyle = "rgba(15,23,42,0.55)";
    ctx.fill();
  });

  // Angles
  const hour = (hh % 12) + mm/60 + ss/3600;
  const hourAng = (Math.PI/6) * hour - Math.PI/2;
  const minAng  = (Math.PI/30) * (mm + ss/60) - Math.PI/2;
  const secAng  = (Math.PI/30) * ss - Math.PI/2;

  // Hour hand
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(Math.cos(hourAng) * (cr*0.42), Math.sin(hourAng) * (cr*0.42));
  ctx.strokeStyle = "rgba(15,23,42,0.92)";
  ctx.lineWidth = 3.6 * dpr;
  ctx.lineCap = "round";
  ctx.stroke();

  // Minute hand
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(Math.cos(minAng) * (cr*0.62), Math.sin(minAng) * (cr*0.62));
  ctx.strokeStyle = "rgba(15,23,42,0.92)";
  ctx.lineWidth = 2.8 * dpr;
  ctx.lineCap = "round";
  ctx.stroke();

  // Second hand (accent)
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(Math.cos(secAng) * (cr*0.70), Math.sin(secAng) * (cr*0.70));
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.6 * dpr;
  ctx.lineCap = "round";
  ctx.stroke();

  // Center
  ctx.beginPath();
  ctx.arc(0,0,2.7*dpr,0,Math.PI*2);
  ctx.fillStyle = "rgba(15,23,42,0.92)";
  ctx.fill();

  ctx.setTransform(1,0,0,1,0,0);
}

function tickClocks(){
  Object.keys(TZ).forEach(id=>{
    const canvas = document.getElementById(id);
    const label = document.getElementById(id + "-time");
    if(!canvas || !label) return;

    const { hh, mm, ss, label: hhmm } = getHMS(TZ[id]);
    label.textContent = hhmm;
    drawAnalog(canvas, hh, mm, ss);
  });
}

// Run on every page that has clocks
tickClocks();
setInterval(tickClocks, 250);

/* =========================
   POSTS RENDERING
   - Home: shows Latest grid
   - Articles page: renders all sections
   - Article page: renders single article by ?id=
========================= */
async function loadPosts(){
  const res = await fetch("posts.json", { cache: "no-store" });
  if(!res.ok) throw new Error("Could not load posts.json");
  return await res.json();
}

function postCard(post){
  const safeCat = (post.category || "Latest").toUpperCase();
  return `
    <a class="card" href="article.html?id=${encodeURIComponent(post.id)}">
      <span class="badge">${post.category}</span>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
    </a>
  `;
}

(async function(){
  let posts = [];
  try{
    posts = await loadPosts();
  }catch(e){
    // If posts.json missing, silently do nothing
    return;
  }

  // HOME: fill latest grid
  const homeGrid = document.getElementById("latestGrid");
  if(homeGrid){
    const latest = [...posts]
      .sort((a,b)=> (b.date||"").localeCompare(a.date||""))
      .slice(0,6);
    homeGrid.innerHTML = latest.map(postCard).join("");
  }

  // ARTICLES PAGE: fill sections
  const sections = document.querySelectorAll("[data-section]");
  if(sections.length){
    sections.forEach(sec=>{
      const key = sec.getAttribute("data-section");
      const holder = sec.querySelector(".grid");
      if(!holder) return;

      let filtered = posts;
      if(key !== "all"){
        filtered = posts.filter(p => (p.section || "").toLowerCase() === key.toLowerCase());
      }
      filtered = filtered.sort((a,b)=> (b.date||"").localeCompare(a.date||""));

      holder.innerHTML = filtered.map(postCard).join("") || `<div style="color:rgba(15,23,42,0.65);font-weight:700;">No posts yet.</div>`;
    });
  }

  // ARTICLE PAGE: render single
  const articleMount = document.getElementById("articleMount");
  if(articleMount){
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const post = posts.find(p => p.id === id) || posts[0];

    if(!post){
      articleMount.innerHTML = `<div class="article-card">No post found.</div>`;
      return;
    }

    articleMount.innerHTML = `
      <div class="article-card">
        <div class="article-meta">
          <span class="badge">${post.category || "Latest"}</span>
          <div class="article-date">${post.date || ""}</div>
        </div>
        <div class="article-title">${post.title}</div>
        <div class="article-content">
          ${post.content || `<p>${post.excerpt || ""}</p>`}
        </div>
      </div>
    `;
  }
})();
