function drawClock(canvas, time) {
  const ctx = canvas.getContext("2d");
  const r = canvas.width / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(r, r);

  ctx.beginPath();
  ctx.arc(0, 0, r - 2, 0, Math.PI * 2);
  ctx.strokeStyle = "#1d4ed8";
  ctx.lineWidth = 4;
  ctx.stroke();

  const hour = time.getHours() % 12;
  const min = time.getMinutes();

  ctx.rotate((Math.PI / 6) * hour + (Math.PI / 360) * min);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -r * 0.5);
  ctx.stroke();
  ctx.rotate(-(Math.PI / 6) * hour - (Math.PI / 360) * min);

  ctx.rotate((Math.PI / 30) * min);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -r * 0.75);
  ctx.stroke();
  ctx.rotate(-(Math.PI / 30) * min);

  ctx.translate(-r, -r);
}

function updateClocks() {
  const now = new Date();

  const zones = {
    ny: -5,
    lon: 0,
    gen: 1,
    tok: 9
  };

  Object.keys(zones).forEach(id => {
    const local = new Date(now.getTime() + zones[id] * 3600000);
    const canvas = document.getElementById(id);
    const label = document.getElementById(id + "-time");

    if (canvas && label) {
      drawClock(canvas, local);
      label.innerText = local.toTimeString().slice(0,5);
    }
  });
}

setInterval(updateClocks, 1000);
updateClocks();
