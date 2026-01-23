const WATCHES = [
  { city: "NEW YORK", tz: "America/New_York" },
  { city: "LONDON", tz: "Europe/London" },
  { city: "GENEVA", tz: "Europe/Zurich" },
  { city: "TOKYO", tz: "Asia/Tokyo" }
];

function getTZTime(tz){
  const parts = new Intl.DateTimeFormat("en-GB",{
    timeZone:tz,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false
  }).formatToParts(new Date());
  const g=t=>parts.find(p=>p.type===t)?.value||"00";
  const d=new Date();
  d.setHours(+g("hour"),+g("minute"),+g("second"),0);
  return d;
}

function renderWatches(){
  const host=document.getElementById("worldwatches");
  host.innerHTML=WATCHES.map((w,i)=>`
    <div class="worldwatch" data-i="${i}">
      <div class="city">${w.city}</div>
      <div class="small-watch">
        <div class="hand hour"></div>
        <div class="hand min"></div>
        <div class="hand sec"></div>
        <div class="pivot"></div>
      </div>
      <div class="time">--:--</div>
    </div>
  `).join("");
}

function updateWatches(){
  document.querySelectorAll(".worldwatch").forEach((el,i)=>{
    const d=getTZTime(WATCHES[i].tz);
    el.querySelector(".time").textContent=
      String(d.getHours()).padStart(2,"0")+":"+
      String(d.getMinutes()).padStart(2,"0");

    const h=((d.getHours()%12)*30)+(d.getMinutes()*0.5);
    const m=(d.getMinutes()*6)+(d.getSeconds()*0.1);
    const s=d.getSeconds()*6;

    el.querySelector(".hour").style.transform=`translate(-50%,-100%) rotate(${h}deg)`;
    el.querySelector(".min").style.transform=`translate(-50%,-100%) rotate(${m}deg)`;
    el.querySelector(".sec").style.transform=`translate(-50%,-100%) rotate(${s}deg)`;
  });
}

async function loadPosts(){
  const host=document.getElementById("cards");
  try{
    const res=await fetch("./posts.json",{cache:"no-store"});
    const posts=await res.json();
    host.innerHTML=posts.map(p=>`
      <article class="card">
        <div class="cat-pill">${p.category}</div>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
      </article>
    `).join("");
  }catch(e){
    host.innerHTML="<p>Posts failed to load.</p>";
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  renderWatches();
  updateWatches();
  setInterval(updateWatches,1000);
  loadPosts();
});
