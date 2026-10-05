(()=>{
const mode=document.body.dataset.catalog;
const data=mode==='equipment'?window.DAIKIN_CATALOG.equipment:window.DAIKIN_CATALOG.products;
const labels={box:'彩盒、彩箱',foam:'泡棉类',manual:'说明书类'};
const cards=[...document.querySelectorAll('.catalog-card')];
const query=new URLSearchParams(location.search);
let category=mode==='equipment'?'all':query.get('category')||'all';
if(!['all','box','foam','manual'].includes(category))category='all';
let visible=data;
const search=document.querySelector('#catalog-search');
const dialog=document.querySelector('#product-dialog');
let activeId=null;
function filter(){
 const term=search.value.trim().toLowerCase();
 visible=data.filter(x=>(category==='all'||x.category===category)&&(!term||[x.name,x.brand,x.stage,x.model,x.originalName,x.id].filter(Boolean).join(' ').toLowerCase().includes(term)));
 const ids=new Set(visible.map(x=>x.id));
 cards.forEach(card=>card.hidden=!ids.has(card.dataset.id));
 document.querySelector('#result-count').textContent=`显示 ${visible.length} 项 / 共 ${data.length} 项`;
 document.querySelector('#empty').hidden=visible.length>0;
 document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
}
document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;const url=new URL(location.href);if(category==='all')url.searchParams.delete('category');else url.searchParams.set('category',category);url.searchParams.delete('id');history.replaceState(null,'',url);filter();}));
search.addEventListener('input',filter);
function openItem(id){
 const item=data.find(x=>x.id===id);if(!item)return;
 activeId=id;
 const img=document.querySelector('#product-image');img.src=item.images[0]||item.image;img.alt=item.name+'（原网站图片）';
 document.querySelector('#product-name').textContent=item.name;
 document.querySelector('#product-category').textContent=mode==='equipment'?item.stage:labels[item.category];
 if(mode!=='equipment')document.querySelector('#product-number').textContent=item.id;
 if(mode==='equipment'){document.querySelector('#equipment-brand').textContent=item.brand;document.querySelector('#equipment-model').textContent=item.model;document.querySelector('#equipment-confidence').textContent=item.confidence;document.querySelector('#equipment-evidence').textContent=item.identification;const reference=document.querySelector('#equipment-reference');reference.href=item.reference;reference.textContent=item.referenceLabel+' ↗';}
 document.querySelector('#product-note').textContent=mode==='equipment'?item.description:'产品实物展示图。尺寸、材质、设计与报价可结合您的项目沟通；请联系业务人员确认具体需求。';
 const contact=document.querySelector('#product-inquiry');contact.href=`mailto:tony-zhong@szdaikin.com.cn?subject=${encodeURIComponent('咨询：'+item.name)}&body=${encodeURIComponent('您好，我想了解'+item.name+'（原站编号：'+item.id+'）。\n\n我的需求：\n联系方式：')}`;
 const src=document.querySelector('#product-source');src.href='design.html'+(mode==='equipment'?'#process':'#studio');src.removeAttribute('target');src.removeAttribute('rel');src.textContent=mode==='equipment'?'了解包装项目流程 ↗':'探索包装设计方向 ↗';
 const list=visible.some(x=>x.id===id)?visible:data;
 const i=list.findIndex(x=>x.id===id);
 document.querySelector('#product-position').textContent=`${i+1} / ${list.length}`;
 document.querySelector('#product-prev').disabled=i===0;
 document.querySelector('#product-next').disabled=i===list.length-1;
 const url=new URL(location.href);url.searchParams.set('id',id);history.replaceState(null,'',url);
 if(!dialog.open){dialog.showModal();document.body.classList.add('modal-open');}
}
cards.forEach(card=>card.querySelector('a').addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();openItem(card.dataset.id);}));
function step(delta){const list=visible.some(x=>x.id===activeId)?visible:data;const i=list.findIndex(x=>x.id===activeId);if(list[i+delta])openItem(list[i+delta].id);}
document.querySelector('#product-prev').addEventListener('click',()=>step(-1));
document.querySelector('#product-next').addEventListener('click',()=>step(1));
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');const u=new URL(location.href);u.searchParams.delete('id');history.replaceState(null,'',u);});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'关闭菜单':'打开菜单');nav.classList.toggle('open',open);menu.textContent=open?'×':'☰';});
filter();if(query.get('id'))openItem(query.get('id'));
})();
