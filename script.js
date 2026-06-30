(function(){
  const els = document.querySelectorAll('.card,.module,.step,.kpi-card,.ops-grid div,.industry-grid div,.client-grid div,.timeline div,.proof-cards div,.proof-big,.hero-dashboard,.big-problem-card,.compare-table,.architecture,.call-card,.manager-panel');
  els.forEach(el=>el.classList.add('reveal'));
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); } });
  },{threshold:.18});
  els.forEach(el=>io.observe(el));
})();
