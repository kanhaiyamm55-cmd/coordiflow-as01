const demoChanges=[
 {title:'Checkout API migration',meta:'Engineering • 3 stakeholders • Updated 10:42',level:'high',status:'In progress'},
 {title:'Pricing model update',meta:'Product • 5 stakeholders • Updated 09:15',level:'medium',status:'Needs approval'},
 {title:'New brand assets',meta:'Marketing • 4 stakeholders • Updated yesterday',level:'low',status:'On track'},
 {title:'Mobile release scope',meta:'Product • 6 stakeholders • Updated Sep 04',level:'medium',status:'Monitoring'}
];
let changes=JSON.parse(localStorage.getItem('coordiflowChanges')||'null')||demoChanges;
const list=document.getElementById('changeList');
function render(){list.innerHTML=changes.map(c=>`<div class="change"><i class="bar ${c.level}"></i><div><b>${escapeHtml(c.title)}</b><span>${escapeHtml(c.meta)}</span><small>Impact: ${c.level}</small></div><em class="status">${escapeHtml(c.status)}</em></div>`).join('');document.getElementById('changeCount').textContent=changes.length;document.getElementById('sChanges').textContent=changes.length;document.getElementById('sPeople').textContent=Math.max(18,changes.length*4+2);}
function escapeHtml(s){return s.replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}
render();
document.getElementById('demoData').addEventListener('click',()=>{changes=demoChanges;localStorage.removeItem('coordiflowChanges');render();document.getElementById('dashboard').scrollIntoView({behavior:'smooth'});});
document.getElementById('changeForm').addEventListener('submit',e=>{e.preventDefault();const title=document.getElementById('title').value.trim();const owner=document.getElementById('owner').value;const level=document.getElementById('impactLevel').value.toLowerCase();const desc=document.getElementById('description').value.trim();if(!title||!desc)return;changes.unshift({title,meta:`${owner} • New change • Just now`,level,status:'New'});localStorage.setItem('coordiflowChanges',JSON.stringify(changes));render();e.target.reset();document.getElementById('formMsg').textContent='✓ Change added to the coordination board.';setTimeout(()=>document.getElementById('formMsg').textContent='',3500);document.getElementById('changes').scrollIntoView({behavior:'smooth'});});
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const mode=btn.textContent.toLowerCase();document.querySelectorAll('.change').forEach((el,i)=>{if(mode==='high impact')el.style.display=changes[i]?.level==='high'?'grid':'none';else el.style.display='grid';});}));
