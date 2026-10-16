(() => {
  if (window.__pageMaskerLoaded) return;
  window.__pageMaskerLoaded = true;
  const selectorFor = el => {
    if (el.id && document.querySelectorAll(`#${CSS.escape(el.id)}`).length===1) return `#${CSS.escape(el.id)}`;
    const parts=[];
    while(el && el.nodeType===1 && el!==document.documentElement){
      let part=el.localName;
      if(el.id){part+=`#${CSS.escape(el.id)}`;parts.unshift(part);break;}
      const cls=[...el.classList].filter(c=>c.length<50).slice(0,2);
      if(cls.length) part+='.'+cls.map(CSS.escape).join('.');
      const peers=el.parentElement?[...el.parentElement.children].filter(x=>x.localName===el.localName):[];
      if(peers.length>1)part+=`:nth-of-type(${peers.indexOf(el)+1})`;
      parts.unshift(part);el=el.parentElement;
    }
    return parts.join(' > ');
  };
  const apply = async () => {
    const {rules=[]}=await chrome.storage.local.get('rules');
    const applicable=rules.filter(r=>r.host===location.hostname);
    for(const r of applicable){
      try { document.querySelectorAll(r.selector).forEach(el=>{if(el.dataset.pageMaskerRule!==r.id){el.textContent=r.text;el.dataset.pageMaskerRule=r.id;}}); } catch {}
    }
  };
  let applying=false;
  const schedule=()=>{if(applying)return;applying=true;requestAnimationFrame(()=>{applying=false;apply();});};
  const observer=new MutationObserver(schedule);
  if(document.documentElement)observer.observe(document.documentElement,{childList:true,subtree:true});
  apply();
  chrome.runtime.onMessage.addListener(msg=>{
    if(msg.type!=='PICK')return;
    document.documentElement.style.cursor='crosshair';
    const outline='3px solid #00d49a';let current=null;
    const move=e=>{const el=e.target;if(el===document.documentElement||el===document.body)return;if(current&&current!==el)current.style.outline='';current=el;current.style.outline=outline;e.preventDefault();};
    const click=e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const selector=selectorFor(e.target);const preview=(e.target.innerText||e.target.textContent||e.target.localName).trim().slice(0,100);cleanup();chrome.runtime.sendMessage({type:'PICKED',selector,preview});};
    const key=e=>{if(e.key==='Escape')cleanup();};
    const cleanup=()=>{document.documentElement.style.cursor='';if(current)current.style.outline='';document.removeEventListener('mousemove',move,true);document.removeEventListener('click',click,true);document.removeEventListener('keydown',key,true);};
    document.addEventListener('mousemove',move,true);document.addEventListener('click',click,true);document.addEventListener('keydown',key,true);
  });
})();
