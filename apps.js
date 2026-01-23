// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Dropdown accessibility (optional polish) ----------
document.querySelectorAll(".has-dropdown > a").forEach(a => {
  a.addEventListener("click", (e) => {
    // Prevent jump-to-top on "#"
    e.preventDefault();
  });
});

// ---------- Render Latest Stories ----------
async function loadCards() {
  const cardsEl = document.getElementById("cards");
  try {
    const res = await fetch("posts.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load posts.json");
    const posts = await res.json();

    // Show newest first (by date)
    posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    cardsEl.innerHTML = posts.slice(0, 3).map(p => `
      <a class="card" href="post.html?id=${encodeURIComponent(p.id)}">
        <div class="tag">${escapeHtml(p.category)}</div>
        <h3 class="card-title">${escapeHtml(p.title)}</h3>
        <p class="card-excerpt">${escapeHtml(p.excerpt)}</p>
      </a>
    `).join("");
  } catch (err) {
    cardsEl.innerHTML = `<div class="card"><div class="tag">ERROR</div><h3 class="card-title">Couldn’t load posts</h3><p class="card-excerpt">Make sure posts.json is in the same folder as index.html.</p></div>`;
    console.error(err);
  }
}
loadCards();

// ---------- World clocks (analog + digital) ----------
const tzCards = Array.from(document.querySelectorAll(".tz-card"));

function formatHHMM(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const hh = parts.find(p => p.type === "hour")?.value ?? "--";
  const mm = parts.find(p => p.type === "minute")?.value ?? "--";
  return `${hh}:${mm}`;
}

// Get seconds accurately in a timezone by formatting and rebuilding a Date-like reading
function getTZParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);

  const hh = parseInt(parts.find(p => p.type === "hour")?.value ?? "0", 10);
  const mm = parseInt(parts.find(p => p.type === "minute")?.value ?? "0", 10);
  const ss = parseInt(parts.find(p => p.type === "second")?.value ?? "0", 10);
  return { hh, mm, ss };
}

function setHand(el, deg) {
  el.style.transform = `translate(-50%, -100%) rotate(${deg}deg)`;
}

function tickClocks() {
  const now = new Date();

  tzCards.forEach(card => {
    const tz = card.getAttribute("data-tz");
    const timeEl = card.querySelector('[data-role="time"]');

    // Digital time (below the mini watch)
    timeEl.textContent = formatHHMM(now, tz);

    // Analog hands
    const { hh, mm, ss } = getTZParts(now, tz);

    const hourHand = card.querySelector(".mw-hour");
    const minHand  = card.querySelector(".mw-minute");
    const secHand  = card.querySelector(".mw-second");

    // Smooth-ish motion: hour includes minutes, minute includes seconds
    const hourDeg = ((hh % 12) + mm / 60) * 30;      // 360/12
    const minDeg  = (mm + ss / 60) * 6;              // 360/60
    const secDeg  = ss * 6;

    setHand(hourHand, hourDeg);
    setHand(minHand, minDeg);
    setHand(secHand, secDeg);
  });

  requestAnimationFrame(() => {
    // Update once per second without drift
    // (we still animate frame loop, but changes appear per second)
  });
}

// Update immediately then every second
tickClocks();
setInterval(tickClocks, 1000);

// ---------- Helpers ----------
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
