// ===== Time zones (live) =====
const fmt = (tz) => new Intl.DateTimeFormat('en-GB', {
  timeZone: tz,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}).format(new Date());

function tickTZ(){
  document.getElementById('tz-ny').textContent  = fmt('America/New_York');
  document.getElementById('tz-lon').textContent = fmt('Europe/London');
  document.getElementById('tz-gen').textContent = fmt('Europe/Zurich'); // Geneva uses Switzerland TZ
  document.getElementById('tz-tok').textContent = fmt('Asia/Tokyo');
}
tickTZ();
setInterval(tickTZ, 10000);

// ===== Watch hands (smooth) =====
function tickHands(){
  const now = new Date();
  const ms = now.getMilliseconds();
  const s = now.getSeconds() + ms/1000;
  const m = now.getMinutes() + s/60;
  const h = (now.getHours()%12) + m/60;

  const secDeg = s * 6;
  const minDeg = m * 6;
  const hourDeg = h * 30;

  document.getElementById('secHand').setAttribute('transform', `rotate(${secDeg})`);
  document.getElementById('minHand').setAttribute('transform', `rotate(${minDeg})`);
  document.getElementById('hourHand').setAttribute('transform', `rotate(${hourDeg})`);

  requestAnimationFrame(tickHands);
}
requestAnimationFrame(tickHands);
