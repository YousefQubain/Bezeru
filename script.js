function timeTZ(tz){
  return new Intl.DateTimeFormat('en-GB',{
    timeZone:tz,
    hour:'2-digit',
    minute:'2-digit',
    hour12:false
  }).format(new Date());
}

function updateTimes(){
  document.getElementById("tz-ny").textContent = timeTZ("America/New_York");
  document.getElementById("tz-lon").textContent = timeTZ("Europe/London");
  document.getElementById("tz-gen").textContent = timeTZ("Europe/Zurich");
  document.getElementById("tz-tok").textContent = timeTZ("Asia/Tokyo");
}

function moveHands(){
  const now=new Date();
  const s=now.getSeconds();
  const m=now.getMinutes()+s/60;
  const h=(now.getHours()%12)+m/60;

  document.getElementById("secHand").setAttribute("transform",`rotate(${s*6})`);
  document.getElementById("minHand").setAttribute("transform",`rotate(${m*6})`);
  document.getElementById("hourHand").setAttribute("transform",`rotate(${h*30})`);

  requestAnimationFrame(moveHands);
}

updateTimes();
setInterval(updateTimes,1000);
moveHands();
