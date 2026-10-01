(()=>{
  const revealEls=[...document.querySelectorAll('.reveal')];
  const show=(el)=>el&&el.classList.add('visible');

  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:'0px 0px -20px 0px'});

    revealEls.forEach((el)=>observer.observe(el));
    window.setTimeout(()=>revealEls.forEach(show),1200);
    window.addEventListener('load',()=>window.setTimeout(()=>revealEls.forEach(show),250),{once:true});
  }else{
    revealEls.forEach(show);
  }

  /* Menu hamburger */
  const navWrap=document.querySelector('.nav-wrap');
  const toggle=document.querySelector('.mobile-menu-toggle');
  const mobileMenu=document.getElementById('mobile-menu');
  const setMenu=(open)=>{
    if(!navWrap||!toggle||!mobileMenu)return;
    navWrap.classList.toggle('menu-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
    mobileMenu.setAttribute('aria-hidden',String(!open));
  };
  if(toggle&&mobileMenu&&navWrap){
    toggle.addEventListener('click',(event)=>{
      event.stopPropagation();
      setMenu(!navWrap.classList.contains('menu-open'));
    });
    mobileMenu.querySelectorAll('a').forEach((link)=>link.addEventListener('click',()=>setMenu(false)));
    document.addEventListener('click',(event)=>{
      if(navWrap.classList.contains('menu-open')&&!navWrap.contains(event.target))setMenu(false);
    });
    document.addEventListener('keydown',(event)=>{if(event.key==='Escape')setMenu(false);});
    window.addEventListener('resize',()=>{if(window.innerWidth>760)setMenu(false);},{passive:true});
  }

  /* Foto do footer */
  const portrait=document.querySelector('.portrait-wrap img');
  if(portrait){
    const parts=[0,1,2,3,4,5].map((i)=>`jean-part-${i}.txt?v=20261001-3`);
    const timeout=new Promise((_,reject)=>window.setTimeout(()=>reject(new Error('timeout')),5000));
    const loadParts=Promise.all(parts.map((url)=>fetch(url,{cache:'no-store'}).then((r)=>{
      if(!r.ok) throw new Error(`Falha ao carregar ${url}`);
      return r.text();
    })));

    Promise.race([loadParts,timeout])
      .then((chunks)=>{
        const b64=chunks.join('').replace(/\s+/g,'');
        if(!b64.startsWith('UklGR')) throw new Error('Imagem do footer inválida');
        const src=`data:image/webp;base64,${b64}`;
        const probe=new Image();
        probe.onload=()=>{portrait.src=src;};
        probe.onerror=()=>{portrait.src='jean.webp?v=20261001-3';};
        probe.src=src;
      })
      .catch(()=>{portrait.src='jean.webp?v=20261001-3';});
  }
})();
