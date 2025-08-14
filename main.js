
document.querySelectorAll('.timeline details').forEach(d => {
  d.addEventListener('mouseenter', () => d.setAttribute('open',''));
  d.addEventListener('mouseleave', () => d.removeAttribute('open'));
});
(function(){
  const container = document.getElementById('projects');
  if(!container) return;
  const items = JSON.parse(container.dataset.items);
  const list = document.getElementById('list');
  const chips = document.getElementById('chips');
  const search = document.getElementById('search');
  const allTags = Array.from(new Set(items.flatMap(i=>i.tags))).sort();
  let activeTag = null;
  function render(){
    const q = (search.value || '').toLowerCase().trim();
    list.innerHTML = '';
    items
      .filter(i => !activeTag || i.tags.includes(activeTag))
      .filter(i => !q || i.title.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
      .forEach(i => {
        const el = document.createElement('article');
        el.className = 'card project';
        el.innerHTML = `<div class="project__meta">${i.year}</div>
                        <div><strong>${i.title}</strong>
                        <div class="lead">${i.desc}</div>
                        <div style="margin-top:6px" class="chips">${i.tags.map(t=>`<span class='chip'>${t}</span>`).join(' ')}</div></div>`;
        list.appendChild(el);
      });
  }
  function renderChips(){
    chips.innerHTML = `<span class="chip${(!activeTag?' is-active':'')}" data-tag="">Alle</span>` +
      allTags.map(t => `<span class="chip${(activeTag===t?' is-active':'')}" data-tag="${t}">${t}</span>`).join('');
  }
  chips.addEventListener('click', e => { const tag = e.target.dataset.tag; if(tag===undefined) return; activeTag = tag || null; renderChips(); render(); });
  search.addEventListener('input', render);
  renderChips(); render();
})();
