/* =========================
   DROPDOWNS
========================= */
(function initDropdowns(){
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
   CLOCKS (fully functioning)
   - DST-safe using IANA timezones
   - Analog drawn to canvas + digital HH:MM
========================= */
(function initClocks(){
  const TZ = {
    ny: "America/New_York",
    lon: "Europe/London",
    gen: "Europe/Zurich",   // Geneva shares Zurich timezone
    tok: "Asia/Tokyo"
  };

  // Only run if canvases exist on this page
  const hasAnyClock = Object.keys(TZ).some(id => document.getElementById(id));
  if(!hasAnyClock) return;

  function getTimeParts(tz){
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    // Returns "HH:MM:SS"
    const label = fmt.format(new Date());
    const [hh, mm, ss] = label.split(":").map(Number);
    return { hh, mm, ss, labelHM: `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}` };
  }

  function drawAnalog(canvas, hh, mm, ss){
    const ctx = canvas.getContext("2d");
    const w = canvas.width, r = w/2;

    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,w,w);
    ctx.translate(r,r);

    // outer ring
    ctx.beginPath();
    ctx.arc(0,0,r-2,0,Math.PI*2);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || "#1d4ed8";
    ctx.lineWidth = 4;
    ctx.stroke();

    // inner ring
    ctx.beginPath();
    ctx.arc(0,0,r-9,0,Math.PI*2);
    ctx.strokeStyle = "rgba(15,23,42,0.14)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // angles
    const hour = (hh % 12) + (mm/60);
    const hourAng = (Math.PI/6) * hour - Math.PI/2;
    const minAng  = (Math.PI/30) * (mm + ss/60) - Math.PI/2;
    const secAng  = (Math.PI/30) * ss - Math.PI/2;

    // hour hand
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(Math.cos(hourAng) * (r*0.46), Math.sin(hourAng) * (r*0.46));
    ctx.strokeStyle = "rgba(15,23,42,0.92)";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();

    // minute hand
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(Math.cos(minAng) * (r*0.72), Math.sin(minAng) * (r*0.72));
    ctx.strokeStyle = "rgba(15,23,42,0.92)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();

    // second hand (thin)
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(Math.cos(secAng) * (r*0.76), Math.sin(secAng) * (r*0.76));
    ctx.strokeStyle = "rgba(29,78,216,0.9)";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.stroke();

    // center dot
    ctx.beginPath();
    ctx.arc(0,0,3,0,Math.PI*2);
    ctx.fillStyle = "rgba(15,23,42,0.92)";
    ctx.fill();

    ctx.setTransform(1,0,0,1,0,0);
  }

  function tick(){
    Object.keys(TZ).forEach(id=>{
      const canvas = document.getElementById(id);
      const timeEl = document.getElementById(id + "-time");
      if(!canvas || !timeEl) return;

      const parts = getTimeParts(TZ[id]);
      timeEl.textContent = parts.labelHM;

      drawAnalog(canvas, parts.hh, parts.mm, parts.ss);
    });
  }

  tick();
  setInterval(tick, 250); // smooth seconds hand
})();
