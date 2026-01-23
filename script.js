// WORLD TIME + MINI WATCHES

function drawWatch(canvas, hours, minutes) {
  const ctx = canvas.getContext("2d");
  const r = canvas.width / 2;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.translate(r,r);

  // bezel
  ctx.beginPath();
  ctx.arc(0,0,r-2,0,Math.PI*2);
  ctx.strokeStyle="#1d4ed8";
  ctx.lineWidth=4;
  ctx.stroke();

  // hands
  function hand(angle,len,width){
    ctx.beginPath();
    ctx.rotate(angle);
    ctx.moveTo(0,0);
    ctx.lineTo(0,-len);
    ctx.lineWidth=width;
    ctx.strokeStyle="#0b1220";
    ctx.stroke();
    ctx.rotate(-angle);
  }

  hand((hours+minutes/60)*Math.PI/6, r*0.5,3);
  hand(minutes*Math.PI/30, r*0.75,2);

  ctx.translate(-r,-r);
}

function updateTimes(){
  document.querySelectorAll(".tz-card").forEach(card=>{
    const tz = card.dataset.tz;
    const d = new Date(new Date().toLocaleString("en-US",{timeZone:tz}));
    const h=d.getHours(), m=d.getMinutes();
    card.querySelector("[data-role=time]").textContent =
      `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
    drawWatch(card.querySelector("canvas"),h%12,m);
  });
}

setInterval(updateTimes,1000);
updateTimes();


// LOAD POSTS

fetch("posts.json").then(r=>r.json()).then(posts=>{
  const home = document.getElementById("home-cards");
  const featured = posts[0];

  if(document.getElementById("featured-title")){
    document.getElementById("featured-title").textContent = featured.title;
    document.getElementById("featured-dek").textContent = featured.dek;
    document.getElementById("featured-link").href = `article.html?id=${featured.id}`;
  }

  if(home){
    posts.slice(1,5).forEach(p=>{
      home.innerHTML += `
      <div class="card">
        <div class="tag">${p.category.toUpperCase()}</div>
        <h4>${p.title}</h4>
        <p>${p.dek}</p>
        <a class="card-link" href="article.html?id=${p.id}"></a>
      </div>`;
    });
  }
});
