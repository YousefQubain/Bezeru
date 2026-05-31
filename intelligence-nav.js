(() => {
  const header = document.getElementById("bzHeader");
  const toggle = header?.querySelector(".bezeru-nav-toggle");
  if(!header || !toggle) return;

  function closeMenu(){
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
  }

  toggle.addEventListener("click", ()=>{
    const isOpen = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  header.querySelectorAll(".bezeru-links a").forEach((link)=>{
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event)=>{
    if(event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", ()=>{
    if(window.innerWidth > 900) closeMenu();
  });
})();
