const observer=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry);}});},{threshold:.10});document.querySelectorAll('.reveal').forEach((el)=>observer.observe(el));

const portrait=document.querySelector('.portrait-wrap img');
if(portrait){
  portrait.style.visibility='hidden';
  portrait.onload=()=>{portrait.style.visibility='visible';};
  portrait.onerror=()=>{portrait.style.visibility='visible';};
  const parts=[0,1,2,3,4,5].map((i)=>`jean-part-${i}.txt?v=20260930-5`);
  Promise.all(parts.map((url)=>fetch(url,{cache:'no-store'}).then((r)=>{if(!r.ok)throw new Error(`Falha ao carregar ${url}`);return r.text();})))
    .then((chunks)=>{
      const b64=chunks.join('').replace(/\s+/g,'');
      if(!b64.startsWith('UklGR'))throw new Error('Imagem do footer inválida');
      portrait.src=`data:image/webp;base64,${b64}`;
    })
    .catch(()=>{portrait.src='jean.webp?v=20260930-5';});
}
