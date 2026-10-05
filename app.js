const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'关闭菜单':'打开菜单');nav.classList.toggle('open',open);menu.textContent=open?'×':'☰';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','打开菜单');menu.textContent='☰';}));
const inquiry=document.querySelector('#inquiry'),detail=document.querySelector('#detail');
function openDialog(dialog){dialog.showModal();document.body.classList.add('modal-open');}
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');});d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
document.querySelectorAll('[data-inquiry]').forEach(b=>b.addEventListener('click',()=>openDialog(inquiry)));
const content={packaging:{title:'纸制品包装装潢',body:'以纸制品包装装潢为业务方向，围绕实际使用需求沟通印刷方案。下列信息有助于业务人员了解您的项目。',items:['包装用途及所装产品','成品尺寸与印刷数量','设计文件、纸张偏好和参考样品'],type:'纸制品包装装潢'},manual:{title:'说明书类印刷',body:'大金原网站产品展示中收录了说明书类产品。您可以就内容、版式与印刷规格联系业务人员，获取适合项目的说明。',items:['成品尺寸、页数与使用语言','折页或装订需求','印刷数量与期望交付时间'],type:'说明书类印刷'}};
let currentType='纸制品包装装潢';document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>{const data=content[b.dataset.detail];currentType=data.type;document.querySelector('#detail-title').textContent=data.title;document.querySelector('#detail-body').textContent=data.body;const ul=document.querySelector('#detail-list');ul.replaceChildren(...data.items.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));openDialog(detail);}));
document.querySelector('#detail-inquiry').addEventListener('click',()=>{detail.close();document.querySelector('select[name="type"]').value=currentType;openDialog(inquiry);});
document.querySelector('#inquiry-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.target);const body=`您好，我想咨询${data.get('type')}。\n\n姓名：${data.get('name')}\n联系邮箱：${data.get('email')}\n\n项目需求：\n${data.get('message')}\n\n期待您的回复，谢谢。`;location.href=`mailto:tony-zhong@szdaikin.com.cn?subject=${encodeURIComponent('印刷项目咨询｜'+data.get('type'))}&body=${encodeURIComponent(body)}`;document.querySelector('#form-status').textContent='已请求打开邮件应用，请在邮件应用中确认并发送。若未打开，可直接发邮件至 tony-zhong@szdaikin.com.cn。';});
document.querySelector('#year').textContent=new Date().getFullYear();

// Native scrolling: reveal on entry, parallax and a pinned paper narrative.
(()=>{
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const root=document.documentElement;
 const story=document.querySelector('.paper-story');
 const lines=[...document.querySelectorAll('.story-line')];
 const hero=document.querySelector('.hero');
 const about=document.querySelector('.about');
 const products=[...document.querySelectorAll('.productart')];
 const progress=document.querySelector('.reading-progress');
 const index=document.querySelector('.story-index');
 const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
 let observer,raf=0;
 function setup(){
  if(observer)observer.disconnect();
  root.classList.toggle('motion-ready',!reduced.matches);
  if(!reduced.matches && 'IntersectionObserver' in window){
   observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -25px 0px'});
   const targets=document.querySelectorAll('.sectionhead,.design-home>div,.reading-grid>a,.home-catalog article,.factory-grid a,.productart,.productcopy,.abouttitle .eyebrow,.abouttitle h2,.aboutcopy,.collaboration>div:first-child,.steps>div,.newsgrid>a,.contact>div');
   targets.forEach(el=>{el.classList.add('reveal');observer.observe(el);});
   document.querySelectorAll('.newsgrid>a').forEach((el,i)=>el.style.setProperty('--reveal-delay',`${i*110}ms`));
  }
  schedule();
 }
 function update(){
  raf=0;
  const vh=innerHeight;
  document.body.classList.toggle('scrolled',scrollY>45);
  const range=document.documentElement.scrollHeight-vh;
  progress.style.transform=`scaleX(${range>0?clamp(scrollY/range):0})`;
  if(reduced.matches)return;
  const h=hero.getBoundingClientRect();
  if(h.bottom>0 && h.top<vh)hero.style.setProperty('--hero-y',`${clamp(-h.top*.18,-35,120)}px`);
  const s=story.getBoundingClientRect();
  const p=clamp((77-s.top)/Math.max(1,s.height-(vh-77)));
  if(s.top<vh && s.bottom>0){
   story.style.setProperty('--story-progress',p);
   story.style.setProperty('--paper-angle',`${-15+p*60}deg`);
   lines.forEach((line,i)=>line.style.setProperty('--fill',`${clamp(p*3-i+.08)*100}%`));
   index.textContent=`0${Math.min(3,Math.floor(p*3)+1)} — 03`;
  }
  const a=about.getBoundingClientRect();
  if(a.top<vh&&a.bottom>0)about.style.setProperty('--word-x',`${(a.top-vh*.4)*.07}px`);
  products.forEach(el=>{const r=el.getBoundingClientRect();if(r.top<vh&&r.bottom>0)el.style.setProperty('--product-y',`${clamp((r.top-vh*.45)*-.045,-16,16)}px`);});
 }
 function schedule(){if(!raf)raf=requestAnimationFrame(update);}
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule,{passive:true});
 addEventListener('pageshow',schedule);
 reduced.addEventListener('change',setup);
 // Keyboard navigation never lands on a visually hidden control.
 document.addEventListener('focusin',e=>{const parent=e.target.closest('.reveal');if(parent)parent.classList.add('is-visible');});
 setup();
})();
