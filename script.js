/* =========================
   DROPDOWNS
========================= */
(function () {
  const dropdowns = Array.from(document.querySelectorAll(".dropdown"));

  function closeAll() {
    dropdowns.forEach(dd => dd.classList.remove("dd-open"));
  }

  dropdowns.forEach(dd => {
    const btn = dd.querySelector(".dd-btn");
    const menu = dd.querySelector(".dd-menu");
    if (!btn || !menu) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.contains("dd-open");
      closeAll();
      if (!isOpen) dd.classList.add("dd-open");
    });

    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => closeAll());
    });
  });

  document.addEventListener("click", closeAll);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
})();

/* =========================
   CLOCKS (DST-safe timezones)
   + includes hour/min/sec markers
========================= */
function timeParts(tz) {
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

function drawClock(canvas, hh, mm, ss) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const r = w / 2;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, w);
  ctx.translate(r, r);

  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();

  // Outer ring
  ctx.beginPath();
  ctx.arc(0, 0, r - 2, 0, Math.PI * 2);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Inner ring
  ctx.beginPath();
  ctx.arc(0, 0, r - 9, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(15,23,42,0.14)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Minute markers (60)
  for (let i = 0; i < 60; i++) {
    const ang = (Math.PI * 2 * i) / 60 - Math.PI / 2;
    const outer = r - 12;
    const inner = (i % 5 === 0) ? (r - 22) : (r - 18);

    ctx.beginPath();
    ctx.moveTo(Math.cos(ang) * inner, Math.sin(ang) * inner);
    ctx.lineTo(Math.cos(ang) * outer, Math.sin(ang) * outer);
    ctx.strokeStyle = (i % 5 === 0) ? "rgba(15,23,42,0.35)" : "rgba(15,23,42,0.22)";
    ctx.lineWidth = (i % 5 === 0) ? 2 : 1;
    ctx.stroke();
  }

  // Angles
  const hour = (hh % 12) + mm / 60 + ss / 3600;
  const hourAng = (Math.PI / 6) * hour - Math.PI / 2;
  const minAng = (Math.PI / 30) * (mm + ss / 60) - Math.PI / 2;
  const secAng = (Math.PI / 30) * ss - Math.PI / 2;

  // Hour hand
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(hourAng) * (r * 0.42), Math.sin(hourAng) * (r * 0.42));
  ctx.strokeStyle = "rgba(15,23,42,0.92)";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.stroke();

  // Minute hand
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(minAng) * (r * 0.62), Math.sin(minAng) * (r * 0.62));
  ctx.strokeStyle = "rgba(15,23,42,0.92)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.stroke();

  // Second hand
  ctx.beginPath();
  ctx.moveTo(Math.cos(secAng) * (r * -0.12), Math.sin(secAng) * (r * -0.12));
  ctx.lineTo(Math.cos(secAng) * (r * 0.72), Math.sin(secAng) * (r * 0.72));
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.stroke();

  // Center
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(15,23,42,0.92)";
  ctx.fill();

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function tickClocks() {
  const clocks = document.querySelectorAll(".clock[data-tz]");
  clocks.forEach(clock => {
    const tz = clock.getAttribute("data-tz");
    const canvas = clock.querySelector("canvas");
    const timeEl = clock.querySelector(".time");
    if (!tz || !canvas || !timeEl) return;

    const { hh, mm, ss, label } = timeParts(tz);
    timeEl.textContent = label;
    drawClock(canvas, hh, mm, ss);
  });
}
tickClocks();
setInterval(tickClocks, 250); // smooth seconds

/* =========================
   POSTS LOADER (posts.json)
   - fills articles.html grid
   - optional: fills home grid with latest 3
========================= */
async function loadPosts() {
  try {
    const res = await fetch("posts.json", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data)) return null;
    return data;
  } catch {
    return null;
  }
}

function cardHTML(post) {
  const safeCat = (post.category || "Latest").toString();
  return `
    <a class="card" href="article.html?id=${encodeURIComponent(post.id)}">
      <span class="badge">${safeCat}</span>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
    </a>
  `;
}

(async function initContent() {
  const posts = await loadPosts();
  if (!posts) return;

  // Articles page
  const articlesGrid = document.getElementById("articles-grid");
  if (articlesGrid) {
    articlesGrid.innerHTML = posts.map(cardHTML).join("");
  }

  // Home: replace with latest 3 if container exists
  const homeGrid = document.getElementById("home-grid");
  if (homeGrid) {
    const latest3 = posts.slice(0, 3);
    homeGrid.innerHTML = latest3.map(cardHTML).join("");
  }

  // Single article page
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id) return;

  const post = posts.find(p => p.id === id);
  if (!post) return;

  const badge = document.getElementById("article-badge");
  const title = document.getElementById("article-title");
  const sub = document.getElementById("article-sub");
  const body = document.getElementById("article-body");

  if (badge) badge.textContent = post.category || "Latest";
  if (title) title.textContent = post.title || "Article";
  if (sub) sub.textContent = post.excerpt || "";
  if (body) body.innerHTML = (post.body || "").split("\n").map(p => `<p>${p}</p>`).join("");
})();
