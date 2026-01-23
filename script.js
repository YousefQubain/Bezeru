function pad2(n){ return String(n).padStart(2, "0"); }

function getTimePartsInTZ(date, timeZone){
  // Use Intl to get time in specific timezone, then parse parts safely
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = fmt.formatToParts(date);
  const obj = {};
  for (const p of parts){
    if (p.type === "hour" || p.type === "minute" || p.type === "second") obj[p.type] = Number(p.value);
  }
  return { h: obj.hour ?? 0, m: obj.minute ?? 0, s: obj.second ?? 0 };
}

function setHands(el, h, m, s){
  const hourHand = el.querySelector(".mini-hand.hour");
  const minHand  = el.querySelector(".mini-hand.min");
  const secHand  = el.querySelector(".mini-hand.sec");

  // analog math
  const hourAngle = (h % 12) * 30 + m * 0.5;      // 360/12 = 30 deg per hour + minute offset
  const minAngle  = m * 6 + s * 0.1;              // 360/60 = 6 deg per minute + second offset
  const secAngle  = s * 6;

  hourHand.style.transform = `translate(-50%, -100%) rotate(${hourAngle}deg)`;
  minHand.style.transform  = `translate(-50%, -100%) rotate(${minAngle}deg)`;
  secHand.style.transform  = `translate(-50%, -100%) rotate(${secAngle}deg)`;
}

function tick(){
  const now = new Date();
  document.querySelectorAll(".tz-watch").forEach(card => {
    const tz = card.getAttribute("data-tz");
    const { h, m, s } = getTimePartsInTZ(now, tz);

    // set analog
    setHands(card, h, m, s);

    // optional small digital readout under the watch (still elegant)
    const digital = card.querySelector("[data-digital]");
    if (digital) digital.textContent = `${pad2(h)}:${pad2(m)}`;
  });

  requestAnimationFrame(() => {
    // update ~once per second (smooth enough, stable)
  });
}

function start(){
  // run immediately
  tick();
  // then update every second (keeps seconds hand moving per second)
  setInterval(tick, 1000);
}

start();
