// ---------- World Watches (live) ----------
const WATCHES = [
  { city: "NEW YORK", tz: "America/New_York" },
  { city: "LONDON", tz: "Europe/London" },
  { city: "GENEVA", tz: "Europe/Zurich" },
  { city: "TOKYO", tz: "Asia/Tokyo" }
];

function formatHHMM(date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function getTimeInTZ(tz) {
  // Reliable way without external libraries: use Intl formatting then rebuild a Date
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).formatToParts(new Date());

  const get = (type) => parts.find(p => p.type === type)?.value || "00";
  const now = new Date();
  const d = new Date(now);
  d.setHours(parseInt(get("hour"), 10));
  d.setMinutes(parseInt(get("minute"), 10));
  d.setSeconds(parseInt(get("second"), 10));
  d.setMilliseconds(0);
  return d;
}

function renderWorldWatches() {
  const host = document.getElementById("worldwatches");
  if (!host) return;

  host.innerHTML = WATCHES.map((w, idx) => `
    <div class="worldwatch" data-idx="${idx}">
      <div class="city">${w.city}</div>
      <div class="small-watch" aria-label="${w.city} watch">
        <div class="hand hour"></div>
        <div class="hand min"></div>
        <div class="hand sec"></div>
        <div class="pivot"></div>
      </div>
      <div class="time">--:--</div>
    </div>
  `).join("");
}

function updateWorldWatches() {
  const items = document.querySelectorAll(".worldwatch");
  items.forEach((el, i) => {
    const tz = WATCHES[i]?.tz;
    if (!tz) return;

    const d = getTimeInTZ(tz);
    const hh = d.getHours();
    const mm = d.getMinutes();
    const ss = d.getSeconds();

    // Update digital
    const timeEl = el.querySelector(".time");
    if (timeEl) timeEl.textContent = formatHHMM(d);

    // Analog angles
    const hourAngle = ((hh % 12) * 30) + (mm * 0.5);   // 360/12 + minute offset
    const minAngle = (mm * 6) + (ss * 0.1);           // 360/60 + second smoothing
    const secAngle = ss * 6;

    const h = el.querySelector(".hand.hour");
    const m = el.querySelector(".hand.min");
    const s = el.querySelector(".hand.sec");

    if (h) h.style.transform = `translate(-50%,-100%) rotate(${hourAngle}deg)`;
    if (m) m.style.transform = `translate(-50%,-100%) rotate(${minAngle}deg)`;
    if (s) s.style.transform = `translate(-50%,-100%) rotate(${secAngle}deg)`;
  });
}

// ---------- Latest Stories (cards) ----------
async function loadPosts() {
  const cards = document.getElementById("cards");
  if (!cards) return;

  try {
    const res = await fetch("./posts.json?v=1", { cache: "no-store" });
    if (!res.ok) throw new Error("posts.json not found");
    const posts = await res.json();

    cards.innerHTML = posts.map(p => `
      <article class="card">
        <div class="cat-pill">${p.category}</div>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
      </article>
    `).join("");

  } catch (err) {
    cards.innerHTML = `
      <article class="card">
        <div class="cat-pill">ERROR</div>
        <h3>Posts didn’t load</h3>
        <p>
          Make sure <strong>posts.json</strong> is in the same folder as index.html
          and that the filename is exactly <strong>posts.json</strong> (case-sensitive).
        </p>
      </article>
    `;
    console.error(err);
  }
}

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded", () => {
  renderWorldWatches();
  updateWorldWatches();
  setInterval(updateWorldWatches, 1000); // LIVE

  loadPosts();
});
