// ====== World time + analog mini watches ======
function pad2(n){ return String(n).padStart(2,"0"); }

// returns {hh, mm, ss} in the given IANA timezone
function getTimeParts(tz){
  const dt = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(dt);

  const map = {};
  for (const p of parts) map[p.type] = p.value;

  return {
    hh: Number(map.hour),
    mm: Number(map.minute),
    ss: Number(map.second)
  };
}

function updateClocks(){
  const cards = document.querySelectorAll(".clock-card");

  cards.forEach((card, idx) => {
    const tz = card.getAttribute("data-tz");
    const {hh, mm, ss} = getTimeParts(tz);

    // digital time text
    const timeEl = card.querySelector(".clock-time");
    if (timeEl) timeEl.textContent = `${pad2(hh)}:${pad2(mm)}`;

    // analog hands
    const hourHand = card.querySelector(".mini-hour");
    const minuteHand = card.querySelector(".mini-minute");
    const secondHand = card.querySelector(".mini-second");

    const hourDeg   = ((hh % 12) * 30) + (mm * 0.5); // 30° per hour + minute offset
    const minuteDeg = (mm * 6) + (ss * 0.1);         // 6° per minute + smooth seconds
    const secondDeg = (ss * 6);

    if (hourHand)   hourHand.style.transform   = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    if (minuteHand) minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
    if (secondHand) secondHand.style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
  });
}

// run immediately + every second
updateClocks();
setInterval(updateClocks, 1000);

// ====== Dropdown accessibility for click (mobile) ======
document.querySelectorAll(".nav-dropdown .dropdown-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const expanded = btn.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".nav-dropdown .dropdown-btn").forEach(b => b.setAttribute("aria-expanded","false"));
    btn.setAttribute("aria-expanded", expanded ? "false" : "true");

    // toggle panel
    const panel = btn.parentElement.querySelector(".dropdown-panel");
    document.querySelectorAll(".dropdown-panel").forEach(p => p.style.display = "none");
    if (!expanded) panel.style.display = "block";
  });
});

// close dropdown when clicking outside
document.addEventListener("click", (e) => {
  const isInside = e.target.closest(".nav-dropdown");
  if (!isInside){
    document.querySelectorAll(".nav-dropdown .dropdown-btn").forEach(b => b.setAttribute("aria-expanded","false"));
    document.querySelectorAll(".dropdown-panel").forEach(p => p.style.display = "none");
  }
});
