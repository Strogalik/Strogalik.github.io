(() => {
  const screens=[...document.querySelectorAll('.screen')];
  const params=new URLSearchParams(location.search); const requested=params.get('screen');
  if(requested){ const key=String(requested).padStart(2,'0'); screens.forEach(s=>{if(s.dataset.screen!==key)s.style.display='none'}); document.body.classList.add('single-preview'); return; }
  let index=0; const visible=()=>screens.filter(s=>getComputedStyle(s).display!=='none');
  const go=(i)=>{const list=visible(); index=Math.max(0,Math.min(list.length-1,i)); list[index]?.scrollIntoView({behavior:'smooth',block:'start'})};
  addEventListener('keydown',e=>{if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();go(index+1)} if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();go(index-1)} if(e.key==='Home'){e.preventDefault();go(0)} if(e.key==='End'){e.preventDefault();go(visible().length-1)}});
})();
