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

    // Fallback: nenhum conteúdo pode ficar invisível por falha de animação.
    window.setTimeout(()=>revealEls.forEach(show),1200);
    window.addEventListener('load',()=>window.setTimeout(()=>revealEls.forEach(show),250),{once:true});
  }else{
    revealEls.forEach(show);
  }

  const portrait=document.querySelector('.portrait-wrap img');
  if(portrait){
    const parts=[0,1,2,3,4,5].map((i)=>`jean-part-${i}.txt?v=20261001-1`);
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
        probe.src=src;
      })
      .catch(()=>{
        // Mantém a imagem fallback já presente no HTML.
      });
  }
})();
