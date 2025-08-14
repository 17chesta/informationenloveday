(function(){
  const page=document.body.dataset.page;
  document.querySelectorAll('.nav__link').forEach(a=>{const href=a.getAttribute('href'); if(href && href.startsWith(page)) a.classList.add('is-active');});
  const root=document.documentElement, saved=localStorage.getItem('theme'); if(saved==='dark') root.classList.add('dark');
  document.getElementById('modeToggle').addEventListener('click',()=>{root.classList.toggle('dark');localStorage.setItem('theme',root.classList.contains('dark')?'dark':'light');});
  document.querySelectorAll('.card--flip').forEach(card=>card.addEventListener('click',()=>card.classList.toggle('is-flipped')));
  const modal=document.getElementById('skillModal');
  if(modal){
    const title=document.getElementById('modalTitle'), desc=document.getElementById('modalDesc'), src=document.getElementById('modalSrc');
    const closeBtn=document.getElementById('modalClose'); const close=()=>{modal.style.display='none'; modal.setAttribute('aria-hidden','true');};
    document.querySelectorAll('.skill-card').forEach(btn=>btn.addEventListener('click',()=>{title.textContent=btn.dataset.title;desc.textContent=btn.dataset.desc;src.textContent=btn.dataset.src||'—';modal.style.display='flex';modal.setAttribute('aria-hidden','false');}));
    closeBtn&&closeBtn.addEventListener('click',close); modal.addEventListener('click',(e)=>{if(e.target===modal) close();});
  }
  document.querySelectorAll('.timeline .tl-item').forEach(it=>it.addEventListener('click',()=>it.classList.toggle('is-open')));
  const input=document.getElementById('projSearch'), chips=[...document.querySelectorAll('.chip')], cards=[...document.querySelectorAll('.proj')];
  function apply(){
    const q=(input&&input.value||'').toLowerCase().trim();
    const active=(chips.find(c=>c.classList.contains('is-active'))||{}).dataset?.chip || '';
    cards.forEach(c=>{
      const text=(c.textContent+' '+(c.dataset.tags||'')).toLowerCase();
      const okText= q? text.includes(q): true;
      const okChip= active? text.includes(active): true;
      c.style.display = (okText && okChip) ? '' : 'none';
    });
  }
  chips.forEach(ch=>ch.addEventListener('click',()=>{chips.forEach(x=>x.classList.remove('is-active')); ch.classList.add('is-active'); apply();}));
  input&&input.addEventListener('input',apply);
  const excel=document.getElementById('pbi-excel'), visual=document.getElementById('pbi-visual');
  const rawBtn=document.getElementById('btn-raw'), vizBtn=document.getElementById('btn-viz');
  function setRaw(){ if(!excel) return; visual.style.opacity='0'; excel.style.opacity='1'; rawBtn&&rawBtn.classList.add('is-active'); vizBtn&&vizBtn.classList.remove('is-active');}
  function setViz(){ if(!excel) return; excel.style.opacity='0'; visual.style.opacity='1'; vizBtn&&vizBtn.classList.add('is-active'); rawBtn&&rawBtn.classList.remove('is-active');}
  rawBtn&&rawBtn.addEventListener('click',setRaw); vizBtn&&vizBtn.addEventListener('click',setViz);
})();