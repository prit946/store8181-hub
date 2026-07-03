/* hub.js v1 — Store 8181 Hub — Shared Utilities
   <script src="hub.js"></script> in every tool — load BEFORE tool script. */
'use strict';

/* ── SHORTHAND ───────────────────────────────────────────────────────────── */
function $(id){return document.getElementById(id);}

/* ── TOAST ───────────────────────────────────────────────────────────────── */
function toast(msg,type,dur){
  type=type||'ok';dur=dur||3200;
  const el=$('toast');if(!el)return;
  const icons={ok:'✅ ',err:'❌ ',warn:'⚠️ ',info:'ℹ️ '};
  el.textContent=(icons[type]||'')+msg;
  el.className='show '+type;
  clearTimeout(el._t);
  el._t=setTimeout(()=>{el.className='';},dur);
}

/* ── LOADER ──────────────────────────────────────────────────────────────── */
function showLoader(msg){
  const el=$('loader');if(!el)return;
  el.style.display='flex';
  const lm=$('lmsg')||el.querySelector('.lmsg');
  if(lm)lm.textContent=msg||'Loading…';
}
function hideLoader(){const el=$('loader');if(el)el.style.display='none';}

/* ── TABS ────────────────────────────────────────────────────────────────── */
function switchTab(tabId){
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tabId));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+tabId));
}

/* ── COPY ────────────────────────────────────────────────────────────────── */
function hubCopy(text,successMsg){
  successMsg=successMsg||'Copied';
  const done=()=>toast(successMsg,'ok');
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(fallback);
  }else{fallback();}
  function fallback(){
    const ta=document.createElement('textarea');
    ta.value=text;ta.style.cssText='position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');done();}catch(e){toast('Copy failed','err');}
    document.body.removeChild(ta);
  }
}

/* ── PIN STATE ────────────────────────────────────────────────────────────
   Usage:
     const ps = makePinState(['pd0','pd1','pd2','pd3'], 'pinErr', onComplete);
     key onclick → ps.add('5')
     del onclick → ps.del()
     bad PIN     → ps.shake('pinDots','Incorrect PIN')
   ─────────────────────────────────────────────────────────────────────── */
function makePinState(dotIds,errorId,onComplete){
  let buf='';
  function render(){dotIds.forEach((id,i)=>{const el=$(id);if(el)el.classList.toggle('on',i<buf.length);});}
  function clearErr(){if(errorId&&$(errorId))$(errorId).textContent='';}
  function reset(){buf='';render();clearErr();}
  function add(d){
    if(buf.length>=4)return;
    buf+=d;render();
    if(buf.length===4){const v=buf;onComplete(v);}
  }
  function del(){buf=buf.slice(0,-1);render();clearErr();}
  function shake(containerId,errMsg){
    const c=$(containerId);
    if(c){c.classList.add('shake');setTimeout(()=>c.classList.remove('shake'),400);}
    if(errorId&&$(errorId))$(errorId).textContent=errMsg||'Incorrect PIN';
    setTimeout(()=>{buf='';render();clearErr();},900);
  }
  render();
  return{add,del,reset,shake,get:()=>buf};
}

/* ── CONFIRM DIALOG ──────────────────────────────────────────────────────── */
function hubConfirm(msg,onYes){
  if(window.confirm(msg))onYes();
}

/* ── LOCAL STORAGE HELPERS ───────────────────────────────────────────────── */
function lsGet(key,fallback){
  try{const v=localStorage.getItem(key);return v!=null?JSON.parse(v):fallback;}
  catch(e){return fallback;}
}
function lsSet(key,val){localStorage.setItem(key,JSON.stringify(val));}

/* ── DATE HELPERS ────────────────────────────────────────────────────────── */
function todayLocal(){
  const d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function shortDate(d){
  const[y,m,dy]=d.split('-').map(Number);
  return new Date(y,m-1,dy).toLocaleDateString('en-US',{month:'short',day:'numeric'});
}

/* ── CURRENCY ────────────────────────────────────────────────────────────── */
function fmt(n,dec){
  dec=dec==null?2:dec;
  return '$'+(+n||0).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g,',');
}
