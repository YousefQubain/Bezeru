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
  if(!host) return;
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

async function fetchPosts(){
  const res=await fetch("./posts.json",{cache:"no-store"});
  if(!res.ok){
    throw new Error("Failed to load posts");
  }
  return res.json();
}

function renderCards(container, posts){
  if(!container) return;
  if(!posts.length){
    container.innerHTML="<p class=\"muted\">No stories match those filters yet.</p>";
    return;
  }

  container.innerHTML=posts.map(p=>`
    <article class="card" data-category="${p.category}" data-type="${p.type}">
      <div class="cat-pill">${p.category}</div>
      <h3>${p.title}</h3>
      <p>${p.excerpt}</p>
      <a class="card-link" href="./article.html?id=${p.id}">Read story →</a>
    </article>
  `).join("");
}

function matchesQuery(post, query){
  if(!query) return true;
  const haystack=[post.title,post.excerpt,post.author,...(post.tags||[])].join(" ").toLowerCase();
  return haystack.includes(query);
}

function applyFilters(posts){
  const qInput=document.getElementById("q");
  const catSelect=document.getElementById("cat");
  const typeSelect=document.getElementById("type");
  const query=qInput?.value.trim().toLowerCase();
  const category=catSelect?.value || "";
  const type=typeSelect?.value || "";

  return posts.filter(post=>{
    const postCategory=post.category.toLowerCase();
    const postType=post.type?.toLowerCase();
    const categoryMatch=category ? postCategory === category : true;
    const typeMatch=type ? postType === type : true;
    return matchesQuery(post, query) && categoryMatch && typeMatch;
  });
}

function setFilterDefaults(){
  const params=new URLSearchParams(window.location.search);
  const cat=params.get("cat");
  const type=params.get("type");
  if(cat){
    const catSelect=document.getElementById("cat");
    if(catSelect){
      catSelect.value=cat;
    }
  }
  if(type){
    const typeSelect=document.getElementById("type");
    if(typeSelect){
      typeSelect.value=type;
    }
  }
}

function bindFilters(posts){
  const qInput=document.getElementById("q");
  const catSelect=document.getElementById("cat");
  const typeSelect=document.getElementById("type");
  const clearButton=document.getElementById("clear");
  const cards=document.getElementById("cards");

  if(!qInput || !catSelect || !typeSelect || !cards){
    return;
  }

  const render=()=>renderCards(cards, applyFilters(posts));
  qInput.addEventListener("input", render);
  catSelect.addEventListener("change", render);
  typeSelect.addEventListener("change", render);
  clearButton?.addEventListener("click", ()=>{
    qInput.value="";
    catSelect.value="";
    typeSelect.value="";
    render();
  });
  render();
}

function renderArticle(post, posts){
  const title=document.getElementById("a-title");
  if(!title) return;

  document.getElementById("a-tag").textContent=post.category.toUpperCase();
  title.textContent=post.title;
  document.getElementById("a-dek").textContent=post.excerpt;
  document.getElementById("a-date").textContent=post.date;
  document.getElementById("a-read").textContent=post.readTime;
  document.getElementById("a-by").textContent=`By ${post.author}`;

  const body=document.getElementById("a-body");
  body.innerHTML=post.sections.map(section=>`
    <div>
      <h2>${section.heading}</h2>
      ${section.paragraphs.map(p=>`<p>${p}</p>`).join("")}
    </div>
  `).join("");

  const moreCards=document.getElementById("more-cards");
  if(moreCards){
    const more=posts.filter(item=>item.id!==post.id).slice(0,2);
    renderCards(moreCards, more);
  }
}

document.addEventListener("DOMContentLoaded",async ()=>{
  renderWatches();
  updateWatches();
  setInterval(updateWatches,1000);

  let posts=[];
  try{
    posts=await fetchPosts();
  }catch(e){
    const cards=document.getElementById("cards");
    if(cards){
      cards.innerHTML="<p class=\"muted\">Posts failed to load.</p>";
    }
    return;
  }

  const cards=document.getElementById("cards");
  const articleTitle=document.getElementById("a-title");

  if(articleTitle){
    const params=new URLSearchParams(window.location.search);
    const id=params.get("id") || posts[0]?.id;
    const post=posts.find(item=>item.id===id) || posts[0];
    renderArticle(post, posts);
    return;
  }

  if(cards){
    const hasFilters=document.getElementById("q");
    if(hasFilters){
      setFilterDefaults();
      bindFilters(posts);
    }else{
      renderCards(cards, posts.slice(0,3));
    }
  }
});
