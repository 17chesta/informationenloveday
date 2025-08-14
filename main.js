(function(){
  // Active nav link
  const page = document.body.dataset.page || "";
  document.querySelectorAll('.nav__link').forEach(a => {
    const href = (a.getAttribute('href') || '').replace('.html','');
    if (page && href.includes(page)) a.classList.add('is-active');
  });

  // Theme toggle
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') root.classList.add('dark');
  const modeToggle = document.getElementById('modeToggle');
  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      root.classList.toggle('dark');
      localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  // Flip cards (toggle on click for mobile, also works on desktop)
  document.querySelectorAll('.card--flip').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('is-flipped'));
  });

  // Skills modal
  const modal = document.getElementById('skillModal');
  if (modal) {
    const title = document.getElementById('modalTitle');
    const desc  = document.getElementById('modalDesc');
    const srcEl = document.getElementById('modalSrc');
    const closeBtn = document.getElementById('modalClose');
    const open = (t,d,s) => { title.textContent=t; desc.textContent=d; srcEl.textContent=s; modal.style.display='flex'; modal.setAttribute('aria-hidden','false'); };
    const close = () => { modal.style.display='none'; modal.setAttribute('aria-hidden','true'); };
    document.querySelectorAll('.skill-card').forEach(btn => {
      btn.addEventListener('click', () => open(btn.dataset.title, btn.dataset.desc, btn.dataset.src));
    });
    closeBtn && closeBtn.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
  }

  // Timeline open/close on click
  document.querySelectorAll('.timeline .tl-item').forEach(it => it.addEventListener('click', () => it.classList.toggle('is-open')));

  // Projects filter & search
  const input = document.getElementById('projSearch');
  const chips = Array.from(document.querySelectorAll('.chip'));
  const cards = Array.from(document.querySelectorAll('.proj'));
  function apply() {
    const q = (input && input.value ? input.value.trim().toLowerCase() : "");
    const activeChip = chips.find(c => c.classList.contains('is-active'));
    const active = activeChip ? (activeChip.dataset.chip || "").toLowerCase() : "";
    cards.forEach(c => {
      const text = (c.textContent + " " + (c.dataset.tags || "")).toLowerCase();
      const okText = q ? text.includes(q) : true;
      const okChip = active ? text.includes(active) : true;
      c.style.display = (okText && okChip) ? "" : "none";
    });
  }
  chips.forEach(ch => ch.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('is-active'));
    ch.classList.add('is-active');
    apply();
  }));
  input && input.addEventListener('input', apply);

  // Power BI: toggle raw vs visual
  const excel = document.getElementById('pbi-excel');
  const visual = document.getElementById('pbi-visual');
  const rawBtn = document.getElementById('btn-raw');
  const vizBtn = document.getElementById('btn-viz');
  function setRaw(){
    if (!excel || !visual) return;
    visual.style.opacity = '0';
    excel.style.opacity  = '1';
    rawBtn && rawBtn.classList.add('is-active');
    vizBtn && vizBtn.classList.remove('is-active');
  }
  function setViz(){
    if (!excel || !visual) return;
    excel.style.opacity  = '0';
    visual.style.opacity = '1';
    vizBtn && vizBtn.classList.add('is-active');
    rawBtn && rawBtn.classList.remove('is-active');
  }
  rawBtn && rawBtn.addEventListener('click', setRaw);
  vizBtn && vizBtn.addEventListener('click', setViz);
})();