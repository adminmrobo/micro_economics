/* Cobb–Douglas educational model. */
(function(){
'use strict';
const model=(p0,p1,m,a,py=5)=>{
 const choice=(p,i)=>({x:a*i/p,y:(1-a)*i/py});
 const utility=q=>q.x**a*q.y**(1-a);
 const exp=(p,u)=>u/((a/p)**a*((1-a)/py)**(1-a));
 const A=choice(p0,m),B=choice(p1,m),u0=utility(A),u1=utility(B);
 const mh=exp(p1,u0),ms=p1*A.x+py*A.y,H=choice(p1,mh),S=choice(p1,ms);
 return {p0,p1,m,a,py,A,B,H,S,u0,u1,mh,ms,utility,exp,choice,cv:m-mh,ev:exp(p0,u1)-m,cs:a*m*Math.log(p0/p1)};
};
// Small pure-model export supports deterministic tests without a browser.
if(typeof module!=='undefined'&&module.exports)module.exports={model};
if(typeof document==='undefined')return;
const $=id=>document.getElementById('w-'+id), f=n=>(Math.abs(n)<1e-9?0:n).toLocaleString('ko-KR',{maximumFractionDigits:2});
const defaults={p0:10,p1:5,m:120,a:.5};
const storageKey='micro-ch01-welfare-baseline-v2';
const valid=o=>o&&Object.keys(defaults).every(k=>Number.isFinite(o[k]))&&o.p0>=2&&o.p0<=20&&o.p1>=2&&o.p1<=20&&o.m>=40&&o.m<=240&&o.a>=.15&&o.a<=.85;
let baseline={...defaults},stored=false,stage=0,timer=null;
try{const saved=JSON.parse(localStorage.getItem(storageKey));if(valid(saved)){baseline={p0:saved.p0,p1:saved.p1,m:saved.m,a:saved.a};stored=true;}}catch(e){}
const motion=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const current=()=>({p0:+$('p0').value,p1:+$('p1').value,m:+$('m').value,a:+$('a').value});
const toModel=o=>model(o.p0,o.p1,o.m,o.a);
function stop(){if(timer!==null){clearInterval(timer);timer=null;}}
function save(){baseline=current();stored=false;try{localStorage.setItem(storageKey,JSON.stringify(baseline));stored=true;}catch(e){}stop();render();}
const ns='http://www.w3.org/2000/svg';
function node(tag,attrs={},text){const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;return n;}
function chart(id,xmax,ymax,ylabel){
 const el=$(id),h=id==='choice'?430:400,l=64,r=680,t=30,b=h-55;
 // Preserve the accessible title/description declared in HTML.
 [...el.children].filter(n=>!['title','desc'].includes(n.tagName.toLowerCase())).forEach(n=>n.remove());
 const X=x=>l+x/xmax*(r-l),Y=y=>b-y/ymax*(b-t),add=(tag,attrs,text)=>{let n=node(tag,attrs,text);el.appendChild(n);return n;};
 for(let j=0;j<=4;j++){
  let xv=xmax*j/4,yv=ymax*j/4;
  add('line',{x1:X(xv),x2:X(xv),y1:t,y2:b,stroke:'#e2e8f0'});add('line',{x1:l,x2:r,y1:Y(yv),y2:Y(yv),stroke:'#e2e8f0'});
  add('text',{x:X(xv),y:b+23,'text-anchor':'middle','font-size':13,fill:'#334155'},f(xv));
  add('text',{x:l-10,y:Y(yv)+4,'text-anchor':'end','font-size':13,fill:'#334155'},f(yv));
 }
 add('path',{d:`M${l},${t}V${b}H${r}`,fill:'none',stroke:'#334155','stroke-width':1.5});
 add('text',{x:r,y:b+43,'text-anchor':'end','font-size':15},'x 수량');add('text',{x:l,y:18,'font-size':15},ylabel);
 const defs=add('defs'),cp=node('clipPath',{id:'w-'+id+'-clip'});cp.appendChild(node('rect',{x:l,y:t,width:r-l,height:b-t}));defs.appendChild(cp);
 const g=add('g',{'clip-path':`url(#w-${id}-clip)`});
 const path=(pts,color,dash='',width=2.3,fill='none')=>{let n=node('path',{d:pts.map((q,i)=>(i?'L':'M')+X(q[0])+','+Y(q[1])).join(' '),stroke:color,'stroke-width':width,fill,'stroke-dasharray':dash});g.appendChild(n);return n;};
 const point=(q,label,color,dy=0,hollow=false)=>{g.appendChild(node('circle',{cx:X(q.x),cy:Y(q.y),r:hollow?6:5,fill:hollow?'white':color,stroke:hollow?color:'#fff','stroke-width':1.5}));add('text',{x:Math.min(r-28,X(q.x)+9),y:Y(q.y)-10+dy,fill:color,'font-size':16,'font-weight':'bold'},label);};
 return {X,Y,add,path,point};
}
function render(){
 const v=current(),{p0,p1,m,a}=v,z=toModel(v),base=toModel(baseline),h=$('method').value==='h',C=h?z.H:z.S,mc=h?z.mh:z.ms,label=h?'H':'S',BC=h?base.H:base.S,bmc=h?base.mh:base.ms,areaKey=$('area').value;
 for(const [id,val] of Object.entries(v))$(id+'-out').textContent=f(val);
 $('summary').textContent=`x 가격 ${f(p0)} → ${f(p1)} · ${p1<p0?'가격 하락: 효용 증가':p1>p0?'가격 상승: 효용 감소':'변화 없음'} · y 가격 5 고정`;
 $('baseline-note').textContent=`저장 기준: p₀ ${f(base.p0)} → p₁ ${f(base.p1)}, 소득 ${f(base.m)}, α ${f(base.a)}. ${stored?'이 브라우저에 저장됨.':'현재 페이지에서 유지됨 (기본값 또는 브라우저 저장 미사용).'} 기준은 조작해도 바뀌지 않습니다.`;
 const moneyLabels={cv:'CV · 새 가격 / 옛 효용',cs:'ΔCS · 일반수요 면적',ev:'EV · 옛 가격 / 새 효용'};
 $('kpis').innerHTML=['cv','cs','ev'].map(k=>`<article class="w-kpi" data-active="${areaKey===k}"><span>${moneyLabels[k]}</span><strong>${f(z[k])}</strong><small>기준 ${f(base[k])} · 차이 ${f(z[k]-base[k])}</small></article>`).join('');
 const measures=[['초기 x',base.A.x,z.A.x],['보상 x ('+label+')',BC.x,C.x],['최종 x',base.B.x,z.B.x],['x 대체효과',BC.x-base.A.x,C.x-z.A.x],['x 소득효과',base.B.x-BC.x,z.B.x-C.x],['CV',base.cv,z.cv],['ΔCS',base.cs,z.cs],['EV',base.ev,z.ev]];
 $('compare').innerHTML=measures.map(([name,b,c])=>`<tr><th scope="row">${name}</th><td>${f(b)}</td><td>${f(c)}</td><td>${f(c-b)}</td></tr>`).join('');
 const explanations=[`1 / 3 · A: 초기 가격에서 (x,y)=(${f(z.A.x)},${f(z.A.y)})를 선택합니다.`, `2 / 3 · ${label}: 새 상대가격에서 ${h?'초기 효용':'초기 묶음의 구매력'}을 유지합니다. x 대체효과 ${f(C.x-z.A.x)}.`, `3 / 3 · B: 소득을 원래 m=${f(m)}로 되돌립니다. x 소득효과 ${f(z.B.x-C.x)}; 합계 ${f(z.B.x-z.A.x)}.`];
 $('stage').textContent=explanations[stage]+(timer!==null?' (재생 중)':motion.matches?' (동작 줄이기: 수동 단계)':' (정지)');
 $('stage').setAttribute('data-stage',stage);$('play').disabled=motion.matches||timer!==null;$('pause').disabled=timer===null;$('prev').disabled=stage===0;$('next').disabled=stage===2;
 const xmax=1.12*Math.max(m/p0,m/p1,mc/p1,base.m/base.p0,base.m/base.p1,bmc/base.p1),ymax=1.12*Math.max(m/5,mc/5,base.m/5,bmc/5);
 const c=chart('choice',xmax,ymax,'y 수량');
 // Frozen scenario and current scenario share the exact same axes.
 c.path([[0,base.m/5],[base.m/base.p0,0]],'#7c3aed','2 6',1.2);
 c.path([[0,base.m/5],[base.m/base.p1,0]],'#7c3aed','8 5',1.2);
 c.path([[0,bmc/5],[bmc/base.p1,0]],'#7c3aed','3 6',1.2);
 c.point(base.A,'Aᵇ','#7c3aed',30,true);c.point(BC,'Cᵇ','#7c3aed',30,true);c.point(base.B,'Bᵇ','#7c3aed',30,true);
 c.path([[0,m/5],[m/p0,0]],'#475569');
 if(stage>=1)c.path([[0,mc/5],[mc/p1,0]],'#b45309','8 5');
 if(stage>=2)c.path([[0,m/5],[m/p1,0]],'#0f766e');
 for(const [u,col] of [[z.u0,'#94a3b8'],...(stage>=2?[[z.u1,'#5ba99d']]:[])]){
  const pts=[];for(let j=1;j<=200;j++){const x=xmax*j/200,y=(u/x**a)**(1/(1-a));if(Number.isFinite(y))pts.push([x,Math.min(y,1e7)]);}c.path(pts,col,'',1.7);
 }
 c.point(z.A,'A','#334155');if(stage>=1)c.point(C,label,'#b45309',p0===p1?44:0);if(stage>=2)c.point(z.B,'B','#0f766e',p0===p1?22:0);
 // Emphasis rings mark a discrete exact solution, never an interpolated choice.
 const focus=[z.A,C,z.B][stage];c.add('circle',{cx:c.X(focus.x),cy:c.Y(focus.y),r:11,fill:'none',stroke:'#111827','stroke-width':2});
 const row=(name,q,income)=>`<tr><th scope="row">${name}</th><td>${f(q.x)}</td><td>${f(q.y)}</td><td>${f(z.utility(q))}</td><td>${f(income)}</td></tr>`;
 $('table').innerHTML=row('A · 초기',z.A,m)+row(label+' · '+(h?'Hicks':'Slutsky'),C,mc)+row('B · 최종',z.B,m);
 $('effects').textContent=`x 총 변화 ${f(z.B.x-z.A.x)} = 대체효과 ${f(C.x-z.A.x)} + 소득효과 ${f(z.B.x-C.x)}. ${h?'Hicks는 초기 효용을 유지합니다.':'Slutsky는 초기 묶음을 살 수 있게 합니다. 최적 효용은 초기보다 작지 않습니다.'}`;
 const lo=Math.min(p0,p1,base.p0,base.p1)*.65,hi=Math.max(p0,p1,base.p0,base.p1)*1.35;
 const demand=(mod,p,key)=>key==='cs'?mod.a*mod.m/p:mod.a*mod.exp(p,key==='cv'?mod.u0:mod.u1)/p;
 const maxq=1.08*Math.max(...['cv','cs','ev'].flatMap(k=>[demand(z,lo,k),demand(base,lo,k)])),d=chart('demand',maxq,hi,'x 가격');
 function area(mod,key,color){const pts=[[0,mod.p1]];for(let j=0;j<=100;j++){const p=mod.p1+(mod.p0-mod.p1)*j/100;pts.push([demand(mod,p,key),p]);}pts.push([0,mod.p0],[0,mod.p1]);const shape=d.path(pts,'none','',0,color);shape.setAttribute('fill-opacity',.45);}
 area(base,areaKey,'#ddd0fa');area(z,areaKey,'#8bd3ba');
 const baselinePoints=[];for(let j=0;j<=180;j++){const p=lo+(hi-lo)*j/180;baselinePoints.push([demand(base,p,areaKey),p]);}d.path(baselinePoints,'#7c3aed','7 5',2);
 for(const [key,col,dash] of [['cv','#64748b',''],['cs','#0f766e',''],['ev','#b45309','7 4']]){
  const pts=[];for(let j=0;j<=180;j++){const p=lo+(hi-lo)*j/180;pts.push([demand(z,p,key),p]);}d.path(pts,col,dash,key===areaKey?3.7:1.3);
 }
 d.path([[0,p0],[maxq,p0]],'#64748b','3 4',1);d.path([[0,p1],[maxq,p1]],'#0f766e','3 4',1);
 d.add('text',{x:650,y:d.Y(p0)-7,'text-anchor':'end',fill:'#475569','font-size':14},'p₀ = '+f(p0));d.add('text',{x:650,y:d.Y(p1)+(p0===p1?19:-7),'text-anchor':'end',fill:'#0f766e','font-size':14},'p₁ = '+f(p1));
 $('area-note').textContent=`선택: ${moneyLabels[areaKey]}. 현재 ${f(z[areaKey])}, 저장 기준 ${f(base[areaKey])}, 차이 ${f(z[areaKey]-base[areaKey])}. 초록 면적은 현재, 보라 면적은 저장 기준. 면적의 크기는 절댓값이며 가격 하락은 +, 상승은 −입니다.`;
 $('money').textContent=`CV ${f(z.cv)} · ΔCS ${f(z.cs)} · EV ${f(z.ev)}. ${p1>p0?'초기 효용 회복에 필요한 현금 보상은 −CV = '+f(-z.cv)+'입니다.':p1<p0?'새 가격에서 '+f(z.cv)+'만큼 회수해도 초기 효용을 유지합니다.':'가격이 같으므로 세 값이 모두 0입니다.'}`;
}
function changed(){stop();stage=0;render();}
for(const id of ['p0','p1','m','a','method'])$(id).addEventListener('input',changed);
$('area').addEventListener('change',()=>{stop();render();});
function preset(p0,p1,a=.5){$('p0').value=p0;$('p1').value=p1;$('m').value=120;$('a').value=a;$('method').value='h';changed();}
$('reset').addEventListener('click',()=>preset(10,5));$('rise').addEventListener('click',()=>preset(5,10));$('highshare').addEventListener('click',()=>preset(10,5,.8));$('equal').addEventListener('click',()=>{$('p1').value=$('p0').value;changed();});
$('save').addEventListener('click',save);
$('baseline-reset').addEventListener('click',()=>{baseline={...defaults};stored=false;try{localStorage.removeItem(storageKey);}catch(e){}stop();render();});
$('play').addEventListener('click',()=>{stop();if(motion.matches){render();return;}if(stage===2)stage=0;timer=setInterval(()=>{stage=Math.min(2,stage+1);if(stage===2)stop();render();},1800);render();});
$('pause').addEventListener('click',()=>{stop();render();});
$('next').addEventListener('click',()=>{stop();stage=Math.min(2,stage+1);render();});
$('prev').addEventListener('click',()=>{stop();stage=Math.max(0,stage-1);render();});
$('stage-reset').addEventListener('click',()=>{stop();stage=0;render();});
if(motion.addEventListener)motion.addEventListener('change',()=>{stop();render();});
if(typeof window!=='undefined')window.addEventListener('pagehide',stop);
render();
})();
