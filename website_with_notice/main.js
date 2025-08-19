
/*! Interactive CV Core JS – Godswill Adele Loveday (2025-08-16)
   Covers: theme toggle, active nav, scroll-animations, PM guided demo,
           skills modal, projects filter, timeline touch toggle.
*/

(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* ===== Theme toggle with persistence ===== */
  const html = document.documentElement;
  const themeKey = "gal_theme";
  const saved = localStorage.getItem(themeKey);
  if(saved){ html.setAttribute("data-theme", saved); }
  const modeBtn = $("#modeToggle");
  if(modeBtn){
    modeBtn.addEventListener("click", () => {
      const cur = html.getAttribute("data-theme") || "dark";
      const next = cur === "light" ? "dark" : "light";
      html.setAttribute("data-theme", next);
      localStorage.setItem(themeKey, next);
    });
  }

  /* ===== Active nav link by body[data-page] ===== */
  (function markActiveNav(){
    const page = document.body.getAttribute("data-page");
    if(!page) return;
    $$("#mainNav .nav__link").forEach(a => a.classList.remove("is-active"));
    const map = {
      index:"index.html",
      about:"about.html",
      skills:"skills.html",
      timeline:"timeline.html",
      projects:"projects.html",
      projektmanagement:"projektmanagement.html",
      contact:"contact.html"
    };
    const href = map[page];
    if(href){
      const link = $(`#mainNav .nav__link[href="${href}"]`);
      if(link) link.classList.add("is-active");
    }
  })();

  /* ===== Scroll-in animations ===== */
  (function observeScrollIn(){
    const els = $$(".scroll-anim");
    if(!("IntersectionObserver" in window) || !els.length) {
      els.forEach(el => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => {
        if(e.isIntersecting){
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: .12 });
    els.forEach(el => io.observe(el));
  })();

  /* ===== PM Guided Demo (slider) ===== */
  (function pmSlider(){
    /* AUTO DOTS: build dots dynamically based on .pm-stage count */
    const root = $("#pm");
    if(!root) return;
    const stages = $$(".pm-stage");
    const stepsEl = document.querySelector(".pm-steps");
    let dots = $$(".pm-steps .dot");
    if(stepsEl){
      stepsEl.innerHTML = "";
      for(let i=0;i<stages.length;i++){
        const d = document.createElement("span");
        d.className = "dot" + (i===0 ? " is-active" : "");
        stepsEl.appendChild(d);
      }
      dots = $$(".pm-steps .dot");
    }
    const prev = $("#pm-prev");
    const next = $("#pm-next");
    let idx = 0;

    function show(i){
      idx = Math.max(0, Math.min(i, stages.length-1));
      stages.forEach((s, n) => s.classList.toggle("is-active", n === idx));
      dots = $$('.pm-steps .dot');
      dots.forEach((d, n) => d.classList.toggle('is-active', n === idx));
      if(prev) prev.disabled = idx === 0;
      if(next) next.textContent = idx === stages.length-1 ? "Fertig" : "Weiter";
      // announce for a11y
      const h = stages[idx].querySelector("h2,h3");
      if(h){ h.setAttribute("tabindex","-1"); h.focus({preventScroll:false}); }
      // update hash for deep-linking
      history.replaceState(null, "", `#step=${idx+1}`);
    }

    // init from hash
    const m = location.hash.match(/step=(\d+)/);
    if(m){ idx = Math.max(0, Math.min(parseInt(m[1],10)-1, stages.length-1)); }

    show(idx);

    prev && prev.addEventListener("click", () => show(idx-1));
    next && next.addEventListener("click", () => {
      if(idx === stages.length-1){
        // back to first step to loop
        show(0);
      }else{
        show(idx+1);
      }
    });

    // click dots
    dots.forEach((d, n) => d.addEventListener("click", () => show(n)));

    // keyboard
    document.addEventListener("keydown", (e)=>{
      if(e.key === "ArrowRight") show(idx+1);
      else if(e.key === "ArrowLeft") show(idx-1);
    });

    // swipe (simple)
    let startX = 0, startY = 0, swiping = false;
    function onTouchStart(e){
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY; swiping = true;
    }
    function onTouchMove(e){
      if(!swiping) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      // horizontal swipe dominance
      if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 24){
        e.preventDefault();
      }
    }
    function onTouchEnd(e){
      if(!swiping) return;
      swiping = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      if(Math.abs(dx) > 60){
        if(dx < 0) show(idx+1);
        else show(idx-1);
      }
    }
    root.addEventListener("touchstart", onTouchStart, {passive:true});
    root.addEventListener("touchmove", onTouchMove, {passive:false});
    root.addEventListener("touchend", onTouchEnd, {passive:true});
  })();

  /* ===== Skills modal ===== */
  (function skillsModal(){
    const grid = $("#skillsGrid");
    const modal = $("#skillModal");
    if(!grid || !modal) return;
    const title = $("#modalTitle");
    const desc = $("#modalDesc");
    const src = $("#modalSrc");
    const closeBtn = $("#modalClose");

    grid.addEventListener("click", (e)=>{
      const btn = e.target.closest(".skill-card");
      if(!btn) return;
      title.textContent = btn.dataset.title || "";
      desc.textContent = btn.dataset.desc || "";
      src.textContent = btn.dataset.src || "";
      modal.setAttribute("aria-hidden","false");
    });
    closeBtn && closeBtn.addEventListener("click", ()=> modal.setAttribute("aria-hidden","true"));
    modal.addEventListener("click", (e)=>{
      if(e.target === modal) modal.setAttribute("aria-hidden","true");
    });
    document.addEventListener("keydown",(e)=>{
      if(e.key === "Escape") modal.setAttribute("aria-hidden","true");
    });
  })();

  /* ===== Projects filter (chips + search) ===== */
  (function projectsFilter(){
    const chips = $$("#chipbar .chip");
    const search = $("#projSearch");
    const cards = $$("#projList .proj");
    if(!cards.length) return;

    let activeTag = "";
    function apply(){
      const q = (search?.value || "").toLowerCase().trim();
      cards.forEach(card => {
        const text = (card.textContent || "").toLowerCase();
        const tags = (card.dataset.tags || "").toLowerCase();
        const matchQ = !q || text.includes(q);
        const matchTag = !activeTag || tags.includes(activeTag);
        card.style.display = (matchQ && matchTag) ? "" : "none";
      });
    }
    chips.forEach(ch => ch.addEventListener("click", ()=>{
      chips.forEach(c => c.classList.remove("is-active"));
      ch.classList.add("is-active");
      activeTag = (ch.dataset.chip || "").toLowerCase();
      apply();
    }));
    search && search.addEventListener("input", apply);
    apply();
  })();

  /* ===== Timeline: tap to toggle details on mobile ===== */
  (function timelineTap(){
    const list = $$(".timeline .tl-item");
    if(!list.length) return;
    list.forEach(item => {
      const body = item.querySelector(".tl-body");
      if(!body) return;
      item.addEventListener("click", (e)=>{
        const open = body.classList.toggle("open");
        if(open){
          body.style.maxHeight = body.scrollHeight + "px";
        }else{
          body.style.maxHeight = null;
        }
      });
    });
  })();

})();
