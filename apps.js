// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Prevent "#" jump on dropdown trigger
document.querySelectorAll(".has-dropdown > a").forEach(a => {
  a.addEventListener("click", (e) => e.preventDefault());
});

// Load Latest Stories cards
async function loadCards() {
  const cardsEl = document.getElementById("cards");
  if (!cardsEl) return;

  try {
    const res = await fetch("posts.json", { cache: "no-store" });
    if (!res.ok) throw new Error("posts.json not found");
    const posts = await res.json();

    posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    cardsEl.innerHTML = posts.slice(0, 6).map(p => `
      <a class="card" href="post.html?id=${encodeURIComponent(p.id)}">
        <div class="tag">${escapeHtml(p.category)}</div>
        <h3 class="card-title">${escapeHtml(p.title)}</h3>
        <p class="card-excerpt">${escapeHtml(p.excerpt)}</p>
      </a>
    `).join("");
  } catch (err) {
    console.error(err);
    cardsEl.innerHTML = `
      <div class="card">
        <div class="tag">ERROR</div>
        <h3 class="card-title">Couldn’t load posts</h3>
        <p class="card-excerpt">Make sure <b>posts.json</b> is in the same folder as index.html.</p>
      </div>`;
  }
}
loadCards();

// -------- WORLD CLOCKS (DIGITAL + ANALOG) --------
const tzCards = Array.from(document.querySelectorAll(".tz-card"));

// Build HH:MM safely
function hhmm(date, tz) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);

  const hh = parts.find(p => p.type === "hour")?.value ?? "--";
  const mm = parts.find(p => p.type === "minute")?.value ?? "--";
  return `${hh}:${mm}`;
}

// Get hours/minutes/seconds in that timezone
function tzParts(date, tz) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);

  return {
    hh: parseInt(parts.find(p => p.type === "hour")?.value ?? "0", 10),
    mm: parseInt(parts.find(p => p.type === "minute")?.value ?? "0", 10),
    ss: parseInt(parts.find(p => p.type === "second")?.value ?? "0", 10)
  };
}

function setHand(el, deg) {
  if (!el) return;
  el.style.transform = `translate(-50%, -100%) rotate(${deg}deg)`;
}

function tickClocks() {
  const now = new Date();

  tzCards.forEach(card => {
    const tz = card.getAttribute("data-tz");
    const timeEl = card.querySelector('[data-role="time"]');

    // digital
    if (timeEl) timeEl.textContent = hhmm(now, tz);

    // analog
    const { hh, mm, ss } = tzParts(now, tz);
    const hourDeg = ((hh % 12) + mm / 60) * 30; // 360/12
    const minDeg  = (mm + ss / 60) * 6;        // 360/60
    const secDeg  = ss * 6;

    setHand(card.querySelector(".mw-hour"), hourDeg);
    setHand(card.querySelector(".mw-minute"), minDeg);
    setHand(card.querySelector(".mw-second"), secDeg);
  });
}

// run now + every second
tickClocks();
setInterval(tickClocks, 1000);

// Helpers
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
