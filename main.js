// Main site JS – konsistente Navigation, Theme, Banner, Filter, Modals, Slider
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // ===== Theme handling (persist + system preference) =====
  const rootHtml = document.documentElement;
  const modeToggle = $('#modeToggle');
  const STORAGE_KEY = 'theme';

  function applyTheme(theme){
    if(theme === 'light' || theme === 'dark'){
      rootHtml.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
    }else{
      // fallback: system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      rootHtml.setAttribute('data-theme', prefersDark ? 'dark':'light');
    }
  }
  // init
  applyTheme(localStorage.getItem(STORAGE_KEY));

  if(modeToggle){
    modeToggle.addEventListener('click', ()=>{
      const cur = rootHtml.getAttribute('data-theme') || 'light';
      applyTheme(cur === 'light' ? 'dark' : 'light');
    });
  }

  // ===== Active nav highlighting based on data-page =====
  const page = document.body.dataset.page;
  if(page){
    // try direct href match first
    const link = $(`.nav a[href$="${page}.html"]`);
    if(link){ link.classList.add('is-active'); }
    // remove accidental duplicates
    $$('.nav a').forEach(a => {
      if(a !== link) a.classList.remove('is-active');
    });
  }

  // ===== Sub‑Hero banner on pages without .hero (use same background color as index) =====
  function ensureSubHero(){
    if($('.hero')) return; // index already has one
    const h1 = $('main h1, .section__title, h1');
    const sub = document.createElement('section');
    sub.className = 'hero hero--sub';
    sub.innerHTML = `<div class="container hero__inner">
        <div class="hero__copy">
          <h1>${h1 ? h1.textContent : document.title}</h1>
          ${$('.lead') ? `<p class="lead">${$('.lead').textContent}</p>` : ''}
        </div>
      </div>`;
    document.body.insertBefore(sub, $('main'));
  }
  ensureSubHero();

  // ===== Projects: chips + live search =====
  (function initProjectFilters(){
    const list = $('#projList');
    if(!list) return;
    const cards = $$('#projList .proj');
    const chips = $$('#chipbar .chip');
    const search = $('#projSearch');
    let activeTag = '';

    function apply(){
      const q = (search?.value || '').trim().toLowerCase();
      cards.forEach(card => {
        const tags = (card.dataset.tags || '').toLowerCase();
        const text = card.textContent.toLowerCase();
        const tagOk = !activeTag || tags.includes(activeTag);
        const textOk = !q || text.includes(q);
        card.style.display = (tagOk && textOk) ? '' : 'none';
      });
      // empty state
      if(!$('#proj-empty')){
        const empty = document.createElement('p');
        empty.id = 'proj-empty';
        empty.textContent = 'Keine Ergebnisse.';
        empty.style.display = 'none';
        list.parentElement.appendChild(empty);
      }
      const anyVisible = cards.some(c => c.style.display !== 'none');
      $('#proj-empty').style.display = anyVisible ? 'none' : '';
    }

    chips.forEach(ch => ch.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      ch.classList.add('is-active');
      activeTag = (ch.dataset.chip || '').toLowerCase();
      apply();
      // Deaktiviert die Suche beim Chip-Wechsel? Nein – Suche bleibt bestehen.
    }));

    if(search){
      search.addEventListener('input', apply);
    }
    apply();
  })();

  // ===== Skills: modal content fill =====
  (function initSkills(){
    const grid = $('#skillsGrid');
    if(!grid) return;
    const modal = $('#skillModal');
    const closeBtn = $('#modalClose');
    const t = $('#modalTitle'), d = $('#modalDesc'), s = $('#modalSrc');

    grid.addEventListener('click', (e)=>{
      const btn = e.target.closest('.skill-card');
      if(!btn) return;
      t.textContent = btn.dataset.title || '';
      d.textContent = btn.dataset.desc || 'Kurzbeschreibung folgt.';
      s.textContent = btn.dataset.src || '';
      modal.setAttribute('aria-hidden','false');
    });
    closeBtn?.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
    modal.addEventListener('click', (e)=>{
      if(e.target === modal) modal.setAttribute('aria-hidden','true');
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') modal.setAttribute('aria-hidden','true');
    });
  })();

  // ===== PM slider next/prev + dots =====
  
  (function initPmSlider(){
    const container = $('#pm');
    if(!container) return;
    const stages = $$('.pm-stage', container);
    const dots = $$('.pm-steps .dot', container.parentElement);
    const prev = $('#pm-prev');
    const next = $('#pm-next');
    // create Finish button if not exists
    let finish = $('#pm-finish');
    if(!finish){
      finish = document.createElement('button');
      finish.id = 'pm-finish';
      finish.className = 'btn';
      finish.textContent = 'Fertig';
      $('#pm .pm-ctrls')?.appendChild(finish);
    }
    let idx = stages.findIndex(s => s.classList.contains('is-active'));
    if(idx < 0) idx = 2; // default emphasize Jira

    function show(i){
      idx = Math.max(0, Math.min(stages.length-1, i));
      stages.forEach((s, k) => s.classList.toggle('is-active', k === idx));
      dots.forEach((d, k) => d.classList.toggle('is-active', k === idx));
      if(prev) prev.disabled = idx === 0;
      if(next) next.disabled = idx === stages.length-1;
      // finish visible only on last
      if(finish) finish.style.display = (idx === stages.length-1) ? '' : 'none';
    }
    prev?.addEventListener('click', ()=> show(idx-1));
    next?.addEventListener('click', ()=> show(idx+1));
    finish?.addEventListener('click', ()=> {
      show(0);
      window.scrollTo({top:0, behavior:'smooth'});
    });

    // keyboard support
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'ArrowRight') show(idx+1);
      if(e.key === 'ArrowLeft') show(idx-1);
    });

    show(idx);
  })();


})();