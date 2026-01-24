// Dropdown open/close
document.querySelectorAll(".nav-dropdown").forEach(dd => {
  const btn = dd.querySelector(".dropdown-btn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isOpen = dd.classList.contains("open");
    document.querySelectorAll(".nav-dropdown.open").forEach(x => {
      x.classList.remove("open");
      const b = x.querySelector(".dropdown-btn");
      if (b) b.setAttribute("aria-expanded", "false");
    });

    dd.classList.toggle("open", !isOpen);
    btn.setAttribute("aria-expanded", String(!isOpen));
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".nav-dropdown.open").forEach(dd => {
    dd.classList.remove("open");
    const b = dd.querySelector(".dropdown-btn");
    if (b) b.setAttribute("aria-expanded", "false");
  });
});

// Live times + analog hands
function pad2(n){ return String(n).padStart(2,"0"); }

function updateClocks(){
  const cards = document.querySelectorAll(".clock-card");
  const now = new Date();

  cards.forEach(card => {
    const tz = card.getAttribute("data-tz");
    if (!tz) return;

    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    const parts = fmt.formatToParts(now);
    const hh = Number(parts.find(p => p.type === "hour")?.value || "0");
    const mm = Number(parts.find(p => p.type === "minute")?.value || "0");

    const timeEl = card.querySelector(".clock-time");
    if (timeEl) timeEl.textContent = `${pad2(hh)}:${pad2(mm)}`;

    const sec = now.getSeconds();
    const minuteAngle = (mm + sec / 60) * 6;
    const hourAngle = ((hh % 12) + mm / 60) * 30;
    const secondAngle = sec * 6;

    const hourHand = card.querySelector(".mini-hour");
    const minHand  = card.querySelector(".mini-minute");
    const secHand  = card.querySelector(".mini-second");

    if (hourHand) hourHand.style.transform = `translate(-50%, -100%) rotate(${hourAngle}deg)`;
    if (minHand)  minHand.style.transform  = `translate(-50%, -100%) rotate(${minuteAngle}deg)`;
    if (secHand)  secHand.style.transform  = `translate(-50%, -100%) rotate(${secondAngle}deg)`;
  });
}

updateClocks();
setInterval(updateClocks, 1000);
