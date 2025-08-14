
(function(){
  const excel = document.getElementById('pbi-excel');
  const visual = document.getElementById('pbi-visual');
  const rawBtn = document.getElementById('btn-raw');
  const vizBtn = document.getElementById('btn-viz');
  const frame = excel?.parentElement;

  if(!excel || !visual || !rawBtn || !vizBtn || !frame) return;

  function showRaw(){
    frame.classList.add('animating');
    visual.style.opacity = '0';
    visual.style.transform = 'scale(1.01)';
    excel.style.opacity = '1';
    excel.style.transform = 'scale(1)';
    rawBtn.classList.add('is-active');
    vizBtn.classList.remove('is-active');
    setTimeout(()=>frame.classList.remove('animating'), 900);
  }

  function showViz(){
    frame.classList.add('animating');
    excel.style.opacity = '0';
    excel.style.transform = 'scale(1.01)';
    visual.style.opacity = '1';
    visual.style.transform = 'scale(1)';
    vizBtn.classList.add('is-active');
    rawBtn.classList.remove('is-active');
    setTimeout(()=>frame.classList.remove('animating'), 900);
  }

  rawBtn.addEventListener('click', showRaw);
  vizBtn.addEventListener('click', showViz);
})();
